#!/usr/bin/env sh
set -eu

# ═══════════════════════════════════════════════════════════════
# Drayko Portfolio — Self-Hosted Installer (POSIX sh)
# Usage:
#   curl -SLfs https://drayko.xyz/api/installer | sh
#   curl -SLfs https://drayko.xyz/api/installer | sh -s -- --port 3456
# ═══════════════════════════════════════════════════════════════

REPO_URL="https://github.com/drayko/v6-portfolio.git"
PROJECT_DIR="$HOME/drayko-portfolio"

# ── Colors ────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'
YELLOW='\033[1;33m'; BLUE='\033[0;34m'
CYAN='\033[0;36m'; NC='\033[0m'

log()   { printf '%b\n' "${GREEN}✔${NC} $1"; }
warn()  { printf '%b\n' "${YELLOW}⚠${NC} $1"; }
error() { printf '%b\n' "${RED}✘${NC} $1"; }
info()  { printf '%b\n' "${BLUE}→${NC} $1"; }
title() { printf '\n%b\n' "${CYAN}════ $1 ════${NC}"; }

# ── Cleanup trap ──────────────────────────────────────────────
cleanup() { printf '\n'; info "Interrupted."; exit 1; }
trap cleanup INT TERM

# ── Help ──────────────────────────────────────────────────────
show_help() {
  cat <<EOF
Usage: curl -SLfs https://drayko.xyz/api/installer | sh [-- <options>]

Options:
  -y, --yes          Non-interactive mode (accepts all defaults)
  --port <port>      Dev server port (default: 3000)
  --dir <path>       Install directory (default: ~/drayko-portfolio)
  --db <type>        Database type: postgresql | sqlite | mysql
  --domain <domain>  Domain for nginx config
  --help             Show this help
EOF
  exit 0
}

# ── Prompt helper (read from /dev/tty to work with curl | sh) ─
TTY=/dev/tty
if [ ! -r "$TTY" ]; then
  TTY=/dev/null
fi

prompt_yesno() {
  local _question="$1" _default="${2:-Y}" _ans
  printf "%s [%s] " "$_question" "$_default" >&2
  read -r _ans < "$TTY" 2>/dev/null || _ans=""
  if [ -z "$_ans" ]; then
    _ans="$_default"
  fi
  case "$_ans" in
    [Yy]|[Yy][Ee][Ss]) return 0 ;;
    *) return 1 ;;
  esac
}

prompt_value() {
  local _prompt="$1" _default="$2" _val
  printf "%s [%s]: " "$_prompt" "$_default" >&2
  read -r _val < "$TTY" 2>/dev/null || _val=""
  if [ -z "$_val" ]; then
    _val="$_default"
  fi
  echo "$_val"
}

prompt_password() {
  local _prompt="$1" _pass
  printf "%s: " "$_prompt" >&2
  stty -echo < "$TTY" 2>/dev/null || true
  read -r _pass < "$TTY" 2>/dev/null || _pass=""
  stty echo < "$TTY" 2>/dev/null || true
  printf '\n' >&2
  echo "$_pass"
}

# ── Parse args ────────────────────────────────────────────────
NONINTERACTIVE=false
DEV_PORT=3000
DB_TYPE=""
DOMAIN=""

while [ $# -gt 0 ]; do
  case "$1" in
    -y|--yes)       NONINTERACTIVE=true; shift ;;
    --port)         DEV_PORT="$2"; shift 2 ;;
    --dir)          PROJECT_DIR="$2"; shift 2 ;;
    --db)           DB_TYPE="$2"; shift 2 ;;
    --domain)       DOMAIN="$2"; shift 2 ;;
    --help)         show_help ;;
    *)              shift ;;
  esac
done

# ── Root check ────────────────────────────────────────────────
if [ "$(id -u)" -eq 0 ]; then
  warn "Running as root is not recommended (npm/systemd security)."
  if [ "$NONINTERACTIVE" = false ]; then
    if ! prompt_yesno "Continue as root?" "N"; then
      exit 1
    fi
  fi
fi

# ═══════════════════════════════════════════════════════════════
# PREFLIGHT
# ═══════════════════════════════════════════════════════════════

title "Preflight checks"

detect_os() {
  if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS_ID="${ID:-}"
    OS_NAME="${NAME:-}"
    OS_VERSION="${VERSION_ID:-}"
  elif [ -f /etc/debian_version ]; then
    OS_ID="debian"
    OS_NAME="Debian"
    OS_VERSION=$(cat /etc/debian_version)
  else
    OS_ID="unknown"
    OS_NAME="unknown"
    OS_VERSION="unknown"
  fi

  case "$OS_ID" in
    debian|ubuntu|linuxmint) ;;
    *)
      warn "This script is designed for Debian/Ubuntu. Your OS: $OS_NAME"
      if [ "$NONINTERACTIVE" = false ]; then
        if ! prompt_yesno "Continue anyway?" "N"; then
          exit 1
        fi
      fi
      ;;
  esac
  log "OS: $OS_NAME $OS_VERSION"
}

detect_os

# ── Check prerequisites ──────────────────────────────────────
PREREQ_OK=true

for cmd in curl git; do
  if ! command -v "$cmd" >/dev/null 2>&1; then
    warn "$cmd is not installed"
    PREREQ_OK=false
  fi
done

if ! command -v node >/dev/null 2>&1; then
  warn "Node.js is not installed"
  PREREQ_OK=false
else
  NODE_VERSION=$(node -v | sed 's/v//')
  NODE_MAJOR="${NODE_VERSION%%.*}"
  log "Node.js v$NODE_VERSION"
  if [ "$NODE_MAJOR" -lt 18 ]; then
    warn "Node.js >= 18 is recommended (detected v$NODE_VERSION)"
  fi
fi

if ! command -v npm >/dev/null 2>&1; then
  warn "npm is not installed"
  PREREQ_OK=false
else
  log "npm $(npm -v)"
fi

if [ "$PREREQ_OK" = false ]; then
  title "Install prerequisites"

  echo "Missing tools: curl, git, nodejs, npm"
  echo "Install them with:"
  echo "  sudo apt update && sudo apt install -y curl git nodejs npm"
  echo ""
  if [ "$NONINTERACTIVE" = false ]; then
    if prompt_yesno "Install prerequisites now?" "Y"; then
      sudo apt update && sudo apt install -y curl git nodejs npm
    else
      error "Prerequisites missing. Aborting."
      exit 1
    fi
  else
    sudo apt update && sudo apt install -y curl git nodejs npm 2>/dev/null || true
  fi
fi

# ═══════════════════════════════════════════════════════════════
# PROJECT SETUP
# ═══════════════════════════════════════════════════════════════

title "Project setup"

if [ -d "$PROJECT_DIR/.git" ]; then
  log "Project already exists at $PROJECT_DIR"
  cd "$PROJECT_DIR"
  info "Pulling latest changes..."
  git pull --ff-only 2>/dev/null || warn "Could not pull (uncommitted changes?)"
elif [ -f "package.json" ] && grep -q "drayko" package.json 2>/dev/null; then
  log "Running from repository directory: $(pwd)"
  PROJECT_DIR="$(pwd)"
else
  info "Cloning repository into $PROJECT_DIR ..."
  git clone "$REPO_URL" "$PROJECT_DIR"
  cd "$PROJECT_DIR"
  log "Repository cloned"
fi

cd "$PROJECT_DIR"

# ═══════════════════════════════════════════════════════════════
# DATABASE WIZARD
# ═══════════════════════════════════════════════════════════════

title "Database configuration"

pick_database() {
  if [ -n "$DB_TYPE" ]; then
    local t
    t=$(echo "$DB_TYPE" | tr '[:upper:]' '[:lower:]')
    case "$t" in
      postgresql|postgres|supabase|neon) DB_TYPE="postgresql" ;;
      sqlite|sqlite3)                   DB_TYPE="sqlite" ;;
      mysql|mariadb)                    DB_TYPE="mysql" ;;
      *) warn "Unknown DB type '$DB_TYPE', falling back to interactive" ;;
    esac
    return
  fi

  echo "Which database would you like to use?"
  echo "  1) SQLite  — simple file-based, no server needed (easiest)"
  echo "  2) PostgreSQL — powerful, recommended for production"
  echo "  3) MySQL / MariaDB"
  if [ "$NONINTERACTIVE" = true ]; then
    DB_TYPE="sqlite"
    log "Non-interactive mode, defaulting to SQLite"
    return
  fi

  local _choice
  _choice=$(prompt_value "Choice" "1")
  case "$_choice" in
    2) DB_TYPE="postgresql" ;;
    3) DB_TYPE="mysql" ;;
    *) DB_TYPE="sqlite" ;;
  esac
}

pick_database
log "Database type: $DB_TYPE"

# ── SQLite ────────────────────────────────────────────────────
setup_sqlite() {
  local db_path
  db_path="$PROJECT_DIR/data.db"
  if [ "$NONINTERACTIVE" = false ]; then
    db_path=$(prompt_value "SQLite database path" "$db_path")
  fi
  log "SQLite database: $db_path"

  mkdir -p "$(dirname "$db_path")"
  touch "$db_path" 2>/dev/null || true

  cat > .env <<EOF
# Drayko Portfolio — Environment Configuration
DB_TYPE=sqlite
DATABASE_URL=sqlite://${db_path}
NODE_ENV=production
EOF
  log ".env file generated"
}

# ── PostgreSQL ────────────────────────────────────────────────
setup_postgresql() {
  local pg_host="localhost"
  local pg_port="5432"
  local pg_user="drayko"
  local pg_pass=""
  local pg_db="drayko_portfolio"

  local pg_installed=false
  if command -v psql >/dev/null 2>&1; then
    pg_installed=true
    log "PostgreSQL client found"
  else
    warn "PostgreSQL is not installed"
    if [ "$NONINTERACTIVE" = false ]; then
      if prompt_yesno "Install PostgreSQL now?" "Y"; then
        install_postgresql
        pg_installed=true
      fi
    elif prompt_yesno "Install PostgreSQL?" "N"; then
      install_postgresql
      pg_installed=true
    fi
  fi

  if [ "$pg_installed" = true ] && [ "$NONINTERACTIVE" = false ]; then
    echo ""
    pg_host=$(prompt_value "PostgreSQL host" "$pg_host")
    pg_port=$(prompt_value "PostgreSQL port" "$pg_port")
    pg_db=$(prompt_value "Database name" "$pg_db")
    pg_user=$(prompt_value "Username" "$pg_user")
    pg_pass=$(prompt_password "Password (leave empty to skip)")
  fi

  if [ "$pg_host" = "localhost" ] || [ "$pg_host" = "127.0.0.1" ]; then
    if command -v psql >/dev/null 2>&1; then
      if [ -z "$pg_pass" ]; then
        info "Attempting to create database '$pg_db' with peer authentication..."
        sudo -u postgres psql -c "CREATE DATABASE $pg_db;" 2>/dev/null || warn "Database '$pg_db' may already exist"
      else
        info "Creating user '$pg_user' and database '$pg_db'..."
        sudo -u postgres psql <<-EOSQL 2>/dev/null || warn "User/database may already exist"
          CREATE USER $pg_user WITH PASSWORD '$pg_pass';
          CREATE DATABASE $pg_db OWNER $pg_user;
EOSQL
      fi
    fi
  fi

  local url="postgresql://${pg_user}"
  if [ -n "$pg_pass" ]; then
    url="${url}:${pg_pass}"
  fi
  url="${url}@${pg_host}:${pg_port}/${pg_db}"

  cat > .env <<EOF
# Drayko Portfolio — Environment Configuration
DB_TYPE=postgresql
DATABASE_URL=${url}
NODE_ENV=production
EOF
  log ".env file generated"
}

# ── MySQL / MariaDB ──────────────────────────────────────────
setup_mysql() {
  local my_host="localhost"
  local my_port="3306"
  local my_user="drayko"
  local my_pass=""
  local my_db="drayko_portfolio"

  local my_installed=false
  if command -v mysql >/dev/null 2>&1; then
    my_installed=true
    log "MySQL/MariaDB client found"
  else
    warn "MySQL/MariaDB is not installed"
    if [ "$NONINTERACTIVE" = false ]; then
      if prompt_yesno "Install MariaDB now?" "Y"; then
        install_mariadb
        my_installed=true
      fi
    elif prompt_yesno "Install MariaDB?" "N"; then
      install_mariadb
      my_installed=true
    fi
  fi

  if [ "$my_installed" = true ] && [ "$NONINTERACTIVE" = false ]; then
    echo ""
    my_host=$(prompt_value "MySQL/MariaDB host" "$my_host")
    my_port=$(prompt_value "Port" "$my_port")
    my_db=$(prompt_value "Database name" "$my_db")
    my_user=$(prompt_value "Username" "$my_user")
    my_pass=$(prompt_password "Password (leave empty to skip)")
  fi

  if [ "$my_host" = "localhost" ] || [ "$my_host" = "127.0.0.1" ]; then
    if command -v mysql >/dev/null 2>&1; then
      if [ -n "$my_pass" ]; then
        info "Creating user '$my_user' and database '$my_db'..."
        sudo mysql <<-EOSQL 2>/dev/null || warn "User/database may already exist"
          CREATE USER IF NOT EXISTS '$my_user'@'localhost' IDENTIFIED BY '$my_pass';
          CREATE DATABASE IF NOT EXISTS $my_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
          GRANT ALL PRIVILEGES ON $my_db.* TO '$my_user'@'localhost';
          FLUSH PRIVILEGES;
EOSQL
      fi
    fi
  fi

  local url="mysql://${my_user}"
  if [ -n "$my_pass" ]; then
    url="${url}:${my_pass}"
  fi
  url="${url}@${my_host}:${my_port}/${my_db}"

  cat > .env <<EOF
# Drayko Portfolio — Environment Configuration
DB_TYPE=mysql
DATABASE_URL=${url}
NODE_ENV=production
EOF
  log ".env file generated"
}

# ── Installers ────────────────────────────────────────────────
install_postgresql() {
  info "Installing PostgreSQL..."
  sudo apt update && sudo apt install -y postgresql postgresql-client
  sudo systemctl enable postgresql
  sudo systemctl start postgresql
  log "PostgreSQL installed and started"
}

install_mariadb() {
  info "Installing MariaDB..."
  sudo apt update && sudo apt install -y mariadb-server mariadb-client
  sudo systemctl enable mariadb
  sudo systemctl start mariadb
  log "MariaDB installed and started"

  if [ "$NONINTERACTIVE" = false ]; then
    echo ""
    info "Running MariaDB secure installation..."
    echo "Follow the prompts to set a root password and secure your installation."
    sudo mysql_secure_installation
  fi
}

# ── Execute DB setup ─────────────────────────────────────────
case "$DB_TYPE" in
  postgresql) setup_postgresql ;;
  mysql)      setup_mysql ;;
  sqlite|*)   setup_sqlite ;;
esac

# ═══════════════════════════════════════════════════════════════
# NPM INSTALL & BUILD
# ═══════════════════════════════════════════════════════════════

title "Install dependencies"

info "Running npm install..."
npm install 2>&1 | tail -3
log "Dependencies installed"

if [ "$NONINTERACTIVE" = false ]; then
  echo ""
  if prompt_yesno "Build the project now? (required for production)" "Y"; then
    title "Build"
    info "Running next build..."
    npm run build 2>&1 | tail -5
    log "Build complete"
  fi
else
  title "Build"
  info "Running next build..."
  npm run build 2>&1 | tail -5
  log "Build complete"
fi

# ═══════════════════════════════════════════════════════════════
# DATABASE PUSH (create tables)
# ═══════════════════════════════════════════════════════════════

title "Database migration"

if [ "$NONINTERACTIVE" = false ]; then
  if prompt_yesno "Push schema to database (create tables)?" "Y"; then
    info "Running db:push..."
    npx drizzle-kit push 2>&1 | tail -5
    log "Database tables created"
  fi
else
  info "Running db:push..."
  npx drizzle-kit push 2>&1 | tail -5
  log "Database tables created"
fi

# ═══════════════════════════════════════════════════════════════
# SYSTEMD SERVICE (optional)
# ═══════════════════════════════════════════════════════════════

title "Production service"

SERVICE_NAME="drayko-portfolio"

install_systemd_service() {
  local _node_path _npm_path
  _node_path=$(command -v node)
  _npm_path=$(command -v npm)

  sudo tee "/etc/systemd/system/${SERVICE_NAME}.service" >/dev/null <<EOF
[Unit]
Description=Drayko Portfolio
After=network.target

[Service]
Type=exec
User=$USER
WorkingDirectory=$PROJECT_DIR
ExecStart=${_node_path} ${_npm_path} exec next start -- -p ${DEV_PORT}
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

  sudo systemctl daemon-reload
  sudo systemctl enable "$SERVICE_NAME"
  sudo systemctl start "$SERVICE_NAME"
  log "Service '$SERVICE_NAME' started on port $DEV_PORT"
}

if [ "$NONINTERACTIVE" = true ]; then
  install_systemd_service
else
  if prompt_yesno "Install as a systemd service? (auto-start on boot)" "Y"; then
    install_systemd_service
  fi
fi

# ═══════════════════════════════════════════════════════════════
# NGINX (optional)
# ═══════════════════════════════════════════════════════════════

if [ -n "$DOMAIN" ]; then
  title "Nginx reverse proxy"

  if command -v nginx >/dev/null 2>&1; then
    info "Configuring nginx for $DOMAIN ..."

    sudo tee "/etc/nginx/sites-available/${SERVICE_NAME}" >/dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:${DEV_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    client_max_body_size 10m;
}
EOF

    sudo ln -sf "/etc/nginx/sites-available/${SERVICE_NAME}" "/etc/nginx/sites-enabled/"
    sudo nginx -t && sudo systemctl reload nginx
    log "Nginx configured for $DOMAIN"
  else
    warn "Nginx not found. Install with: sudo apt install nginx"
  fi
fi

# ═══════════════════════════════════════════════════════════════
# SUMMARY
# ═══════════════════════════════════════════════════════════════

title "Setup complete"

printf '%b\n' "${GREEN}Drayko Portfolio has been installed!${NC}"
echo ""
echo "  Directory: $PROJECT_DIR"
echo "  DB type:   $DB_TYPE"
echo "  Port:      $DEV_PORT"
echo ""

if systemctl is-active --quiet "$SERVICE_NAME" 2>/dev/null; then
  echo "  Your site should be running at:"
  echo "    http://localhost:$DEV_PORT"
  echo ""
  echo "  Service management:"
  echo "    sudo systemctl status $SERVICE_NAME"
  echo "    sudo systemctl restart $SERVICE_NAME"
  echo "    sudo journalctl -u $SERVICE_NAME -f"
else
  echo "  To start the development server:"
  echo "    cd $PROJECT_DIR && npm run dev"
  echo ""
  echo "  For production:"
  echo "    cd $PROJECT_DIR && npm run build && npm start"
fi

if [ -n "$DOMAIN" ]; then
  echo ""
  echo "  Your domain: http://$DOMAIN"
fi

echo ""
printf '%b\n' "${YELLOW}Next steps:${NC}"
echo "  1. Create an admin account at http://localhost:$DEV_PORT/admin"
echo "  2. Review and customize the site content"
echo ""
if [ -n "$DOMAIN" ]; then
  echo "  3. Set up SSL with: sudo certbot --nginx -d $DOMAIN"
fi
echo ""
printf '%b\n' "${CYAN}Thank you for using Drayko Portfolio!${NC}"
