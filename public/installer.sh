#!/usr/bin/env bash
set -euo pipefail

# ═══════════════════════════════════════════════════════════════
# Drayko Portfolio — Self-Hosted Installer for Debian/Ubuntu
# Usage:
#   curl -SLfs https://drayko.xyz/installer.sh | sh
#   curl -SLfs https://drayko.xyz/installer.sh | bash -s -- --port 3456
# ═══════════════════════════════════════════════════════════════

REPO_URL="https://github.com/drayko/v6-portfolio.git"
PROJECT_DIR="$HOME/drayko-portfolio"

# ── Colors ────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'
YELLOW='\033[1;33m'; BLUE='\033[0;34m'
CYAN='\033[0;36m'; NC='\033[0m'

log()   { echo -e "${GREEN}✔${NC} $1"; }
warn()  { echo -e "${YELLOW}⚠${NC} $1"; }
error() { echo -e "${RED}✘${NC} $1"; }
info()  { echo -e "${BLUE}→${NC} $1"; }
title() { echo -e "\n${CYAN}════ $1 ════${NC}\n"; }

# ── Cleanup trap ──────────────────────────────────────────────
cleanup() { echo; info "Interrupted."; exit 1; }
trap cleanup INT TERM

# ── Help ──────────────────────────────────────────────────────
show_help() {
  cat <<EOF
Usage: curl -SLfs https://drayko.xyz/installer.sh | sh [-- <options>]

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

# ── Parse args ────────────────────────────────────────────────
NONINTERACTIVE=false
DEV_PORT=3000
DB_TYPE=""
DOMAIN=""

while [[ $# -gt 0 ]]; do
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
if [[ $EUID -eq 0 ]]; then
  error "Do not run this script as root. Use a regular user with sudo."
  exit 1
fi

# ═══════════════════════════════════════════════════════════════
# PREFLIGHT
# ═══════════════════════════════════════════════════════════════

title "Preflight checks"

detect_os() {
  if [[ -f /etc/os-release ]]; then
    . /etc/os-release
    OS_ID="$ID"
    OS_NAME="$NAME"
    OS_VERSION="$VERSION_ID"
  elif [[ -f /etc/debian_version ]]; then
    OS_ID="debian"
    OS_NAME="Debian"
    OS_VERSION=$(cat /etc/debian_version)
  else
    OS_ID="unknown"
    OS_NAME="unknown"
    OS_VERSION="unknown"
  fi

  if [[ "$OS_ID" != "debian" && "$OS_ID" != "ubuntu" && "$OS_ID" != "linuxmint" ]]; then
    warn "This script is designed for Debian/Ubuntu. Your OS: $OS_NAME"
    if [[ "$NONINTERACTIVE" == false ]]; then
      read -rp "Continue anyway? [y/N] " ans
      if [[ ! "$ans" =~ ^[Yy]$ ]]; then exit 1; fi
    fi
  fi
  log "OS: $OS_NAME $OS_VERSION"
}

detect_os

# ── Check prerequisites ──────────────────────────────────────
PREREQ_OK=true

for cmd in curl git; do
  if ! command -v "$cmd" &>/dev/null; then
    warn "$cmd is not installed"
    PREREQ_OK=false
  fi
done

if ! command -v node &>/dev/null; then
  warn "Node.js is not installed"
  PREREQ_OK=false
else
  NODE_VERSION=$(node -v | sed 's/v//')
  NODE_MAJOR="${NODE_VERSION%%.*}"
  log "Node.js v$NODE_VERSION"
  if [[ "$NODE_MAJOR" -lt 18 ]]; then
    warn "Node.js >= 18 is recommended (detected v$NODE_VERSION)"
  fi
fi

if ! command -v npm &>/dev/null; then
  warn "npm is not installed"
  PREREQ_OK=false
else
  log "npm $(npm -v)"
fi

if [[ "$PREREQ_OK" == false ]]; then
  title "Install prerequisites"

  echo "Missing tools: curl, git, nodejs, npm"
  echo "Install them with:"
  echo "  sudo apt update && sudo apt install -y curl git nodejs npm"
  echo ""
  if [[ "$NONINTERACTIVE" == false ]]; then
    read -rp "Install prerequisites now? [Y/n] " ans
    if [[ ! "$ans" =~ ^[Nn]$ ]]; then
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

if [[ -d "$PROJECT_DIR/.git" ]]; then
  log "Project already exists at $PROJECT_DIR"
  cd "$PROJECT_DIR"
  info "Pulling latest changes..."
  git pull --ff-only 2>/dev/null || warn "Could not pull (uncommitted changes?)"
elif [[ -f "package.json" ]] && grep -q "drayko" package.json 2>/dev/null; then
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
  if [[ -n "$DB_TYPE" ]]; then
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
  if [[ "$NONINTERACTIVE" == true ]]; then
    DB_TYPE="sqlite"
    log "Non-interactive mode, defaulting to SQLite"
    return
  fi
  read -rp "Choice [1/2/3] (default: 1): " ans
  case "$ans" in
    2|3)   [[ "$ans" == "2" ]] && DB_TYPE="postgresql" || DB_TYPE="mysql" ;;
    *)     DB_TYPE="sqlite" ;;
  esac
}

pick_database
log "Database type: $DB_TYPE"

# ── SQLite ────────────────────────────────────────────────────
setup_sqlite() {
  local db_path
  db_path="$PROJECT_DIR/data.db"
  if [[ "$NONINTERACTIVE" == false ]]; then
    read -rp "SQLite database path [${db_path}]: " ans
    [[ -n "$ans" ]] && db_path="$ans"
  fi
  log "SQLite database: $db_path"

  # Ensure parent directory exists
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

  # Check if psql is available
  local pg_installed=false
  if command -v psql &>/dev/null; then
    pg_installed=true
    log "PostgreSQL client found"
  else
    warn "PostgreSQL is not installed"
    if [[ "$NONINTERACTIVE" == false ]]; then
      read -rp "Install PostgreSQL now? [Y/n] " ans
      if [[ ! "$ans" =~ ^[Nn]$ ]]; then
        install_postgresql
        pg_installed=true
      fi
    else
      read -rp "Install PostgreSQL? [y/N] " ans
      if [[ "$ans" =~ ^[Yy]$ ]]; then
        install_postgresql
        pg_installed=true
      fi
    fi
  fi

  if [[ "$pg_installed" == true ]] && [[ "$NONINTERACTIVE" == false ]]; then
    echo ""
    read -rp "PostgreSQL host [${pg_host}]: " ans
    [[ -n "$ans" ]] && pg_host="$ans"
    read -rp "PostgreSQL port [${pg_port}]: " ans
    [[ -n "$ans" ]] && pg_port="$ans"
    read -rp "Database name [${pg_db}]: " ans
    [[ -n "$ans" ]] && pg_db="$ans"
    read -rp "Username [${pg_user}]: " ans
    [[ -n "$ans" ]] && pg_user="$ans"
    read -rsp "Password (leave empty to skip): " pg_pass
    echo ""
  fi

  # Try to create database and user if running locally
  if [[ "$pg_host" == "localhost" || "$pg_host" == "127.0.0.1" ]] && command -v psql &>/dev/null; then
    if [[ -z "$pg_pass" ]]; then
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

  # Build connection URL
  local url="postgresql://${pg_user}"
  [[ -n "$pg_pass" ]] && url="${url}:${pg_pass}"
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
  if command -v mysql &>/dev/null; then
    my_installed=true
    log "MySQL/MariaDB client found"
  else
    warn "MySQL/MariaDB is not installed"
    if [[ "$NONINTERACTIVE" == false ]]; then
      read -rp "Install MariaDB now? [Y/n] " ans
      if [[ ! "$ans" =~ ^[Nn]$ ]]; then
        install_mariadb
        my_installed=true
      fi
    else
      read -rp "Install MariaDB? [y/N] " ans
      if [[ "$ans" =~ ^[Yy]$ ]]; then
        install_mariadb
        my_installed=true
      fi
    fi
  fi

  if [[ "$my_installed" == true ]] && [[ "$NONINTERACTIVE" == false ]]; then
    echo ""
    read -rp "MySQL/MariaDB host [${my_host}]: " ans
    [[ -n "$ans" ]] && my_host="$ans"
    read -rp "Port [${my_port}]: " ans
    [[ -n "$ans" ]] && my_port="$ans"
    read -rp "Database name [${my_db}]: " ans
    [[ -n "$ans" ]] && my_db="$ans"
    read -rp "Username [${my_user}]: " ans
    [[ -n "$ans" ]] && my_user="$ans"
    read -rsp "Password (leave empty to skip): " my_pass
    echo ""
  fi

  # Try to create database and user if running locally
  if [[ "$my_host" == "localhost" || "$my_host" == "127.0.0.1" ]] && command -v mysql &>/dev/null; then
    if [[ -n "$my_pass" ]]; then
      info "Creating user '$my_user' and database '$my_db'..."
      sudo mysql <<-EOSQL 2>/dev/null || warn "User/database may already exist"
        CREATE USER IF NOT EXISTS '$my_user'@'localhost' IDENTIFIED BY '$my_pass';
        CREATE DATABASE IF NOT EXISTS $my_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        GRANT ALL PRIVILEGES ON $my_db.* TO '$my_user'@'localhost';
        FLUSH PRIVILEGES;
EOSQL
    fi
  fi

  local url="mysql://${my_user}"
  [[ -n "$my_pass" ]] && url="${url}:${my_pass}"
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

  # Run secure installation interactively
  if [[ "$NONINTERACTIVE" == false ]]; then
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

if [[ "$NONINTERACTIVE" == false ]]; then
  echo ""
  read -rp "Build the project now? (required for production) [Y/n] " build_ans
  if [[ ! "$build_ans" =~ ^[Nn]$ ]]; then
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

if [[ "$NONINTERACTIVE" == false ]]; then
  read -rp "Push schema to database (create tables)? [Y/n] " push_ans
  if [[ ! "$push_ans" =~ ^[Nn]$ ]]; then
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

if [[ "$NONINTERACTIVE" == true ]]; then
  install_systemd_service
else
  read -rp "Install as a systemd service? (auto-start on boot) [Y/n] " svc_ans
  if [[ ! "$svc_ans" =~ ^[Nn]$ ]]; then
    install_systemd_service
  fi
fi

install_systemd_service() {
  local node_path
  node_path="$(command -v node)"
  local npm_path
  npm_path="$(command -v npm)"

  sudo tee "/etc/systemd/system/${SERVICE_NAME}.service" >/dev/null <<EOF
[Unit]
Description=Drayko Portfolio
After=network.target

[Service]
Type=exec
User=$USER
WorkingDirectory=$PROJECT_DIR
ExecStart=${node_path} ${npm_path} exec next start -- -p ${DEV_PORT}
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

# ═══════════════════════════════════════════════════════════════
# NGINX (optional)
# ═══════════════════════════════════════════════════════════════

if [[ -n "$DOMAIN" ]]; then
  title "Nginx reverse proxy"

  if command -v nginx &>/dev/null; then
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

echo -e "${GREEN}Drayko Portfolio has been installed!${NC}"
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

if [[ -n "$DOMAIN" ]]; then
  echo ""
  echo "  Your domain: http://$DOMAIN"
fi

echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Create an admin account at http://localhost:$DEV_PORT/admin"
echo "  2. Review and customize the site content"
echo ""
if [[ -n "$DOMAIN" ]]; then
  echo "  3. Set up SSL with: sudo certbot --nginx -d $DOMAIN"
fi
echo ""
echo -e "${CYAN}Thank you for using Drayko Portfolio!${NC}"
