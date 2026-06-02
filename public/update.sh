#!/usr/bin/env sh
set -eu

# ═══════════════════════════════════════════════════════════════
# Drayko Portfolio — Self-Hosted Updater
# Usage:
#   curl -SLfs https://drayko.xyz/api/update | sh
#   curl -SLfs https://drayko.xyz/api/update | sh -s -- --yes
# ═══════════════════════════════════════════════════════════════

RED='\033[0;31m'; GREEN='\033[0;32m'
YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

log()   { printf '%b\n' "${GREEN}✔${NC} $1"; }
warn()  { printf '%b\n' "${YELLOW}⚠${NC} $1"; }
error() { printf '%b\n' "${RED}✘${NC} $1"; }
info()  { printf '%b\n' "${CYAN}→${NC} $1"; }
title() { printf '\n%b\n' "${CYAN}════ $1 ════${NC}"; }

SERVICE_NAME="drayko-portfolio"

# ── Find project directory ────────────────────────────────────
find_project() {
  for dir in "$HOME/drayko-portfolio" /opt/drayko-portfolio /srv/drayko-portfolio; do
    if [ -f "$dir/package.json" ] && [ -d "$dir/.git" ]; then
      PROJECT_DIR="$dir"
      return 0
    fi
  done
  if [ -f "package.json" ] && grep -q "drayko" package.json 2>/dev/null; then
    PROJECT_DIR="$(pwd)"
    return 0
  fi
  return 1
}

if ! find_project; then
  error "Cannot find Drayko Portfolio installation."
  echo "Re-run the installer: curl -SLfs https://drayko.xyz/api/installer | sh"
  exit 1
fi

cd "$PROJECT_DIR"
log "Found installation at $PROJECT_DIR"

# ── Args ──────────────────────────────────────────────────────
NONINTERACTIVE=false
while [ $# -gt 0 ]; do
  case "$1" in
    -y|--yes) NONINTERACTIVE=true; shift ;;
    *) shift ;;
  esac
done

# ── Stash local changes ───────────────────────────────────────
title "Fetching updates"

if ! git diff --quiet 2>/dev/null; then
  warn "Local changes detected — stashing them."
  git stash -u 2>/dev/null || true
fi

# ── Fetch & show changelog ────────────────────────────────────
info "Fetching latest commits..."
git fetch origin 2>&1 | tail -1

BEFORE=$(git rev-parse HEAD)
BEHIND=$(git rev-list --count "HEAD..origin/$(git rev-parse --abbrev-ref HEAD)" 2>/dev/null || echo "0")

if [ "$BEHIND" = "0" ]; then
  log "Already up to date."
  exit 0
fi

echo ""
info "New commits behind: $BEHIND"
echo ""
git log --oneline --no-decorate "HEAD..origin/$(git rev-parse --abbrev-ref HEAD)" 2>/dev/null | head -20
echo ""

if [ "$NONINTERACTIVE" = false ]; then
  printf "Apply this update? [Y/n] "
  read -r _ans < /dev/tty 2>/dev/null || _ans="Y"
  case "$_ans" in [Nn]|[Nn][Oo]) exit 0 ;; esac
fi

# ── Pull ──────────────────────────────────────────────────────
info "Pulling latest changes..."
git pull --ff-only

AFTER=$(git rev-parse HEAD)
if [ "$BEFORE" = "$AFTER" ]; then
  log "No changes applied."
  exit 0
fi

# ── Install & build ───────────────────────────────────────────
title "Update dependencies"
npm install 2>&1 | tail -2

title "Build"
npm run build 2>&1 | tail -3
log "Build complete"

# ── Migrate database ──────────────────────────────────────────
if [ -f .env ] && grep -q "DB_TYPE" .env 2>/dev/null; then
  title "Database migration"
  info "Running db:push..."
  npx drizzle-kit push 2>&1 | tail -3
  log "Database up to date"
fi

# ── Restart service ───────────────────────────────────────────
if systemctl is-active --quiet "$SERVICE_NAME" 2>/dev/null; then
  title "Restarting service"
  sudo systemctl restart "$SERVICE_NAME"
  log "Service restarted"
elif command -v pm2 >/dev/null 2>&1 && pm2 list 2>/dev/null | grep -q "$SERVICE_NAME"; then
  title "Restarting PM2 process"
  pm2 restart "$SERVICE_NAME"
  log "PM2 process restarted"
else
  warn "No service manager detected. Restart manually:"
  warn "  cd $PROJECT_DIR && npm start"
fi

# ── Done ──────────────────────────────────────────────────────
title "Update complete"
printf '%b\n' "${GREEN}Updated:${NC}"
echo "  $(echo "$BEFORE" | head -c 7) → $(echo "$AFTER" | head -c 7)"
echo ""
git log --oneline "$BEFORE..$AFTER" 2>/dev/null | head -10
echo ""
log "Site is running on the latest version."
