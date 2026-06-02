#!/usr/bin/env sh
set -eu

# ═══════════════════════════════════════════════════════════════
# Drayko Portfolio — Create Admin Account
# Usage:
#   curl -SLfs https://drayko.xyz/api/add-admin | sh
#   curl -SLfs https://drayko.xyz/api/add-admin | sh -s -- admin@example.com
# ═══════════════════════════════════════════════════════════════

RED='\033[0;31m'; GREEN='\033[0;32m'
YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'

log()   { printf '%b\n' "${GREEN}✔${NC} $1"; }
error() { printf '%b\n' "${RED}✘${NC} $1"; }
info()  { printf '%b\n' "${CYAN}→${NC} $1"; }

# ── Find project ──────────────────────────────────────────────
find_project() {
  for dir in "$HOME/drayko-portfolio" /opt/drayko-portfolio /srv/drayko-portfolio; do
    if [ -f "$dir/package.json" ] && [ -f "$dir/scripts/create-admin.js" ]; then
      PROJECT_DIR="$dir"
      return 0
    fi
  done
  if [ -f "package.json" ] && grep -q "drayko" package.json 2>/dev/null && [ -f "scripts/create-admin.js" ]; then
    PROJECT_DIR="$(pwd)"
    return 0
  fi
  return 1
}

if ! find_project; then
  error "Cannot find Drayko Portfolio installation."
  exit 1
fi

cd "$PROJECT_DIR"

# ── Get email ─────────────────────────────────────────────────
EMAIL="${1:-}"
if [ -z "$EMAIL" ]; then
  printf "Admin email: "
  read -r EMAIL < /dev/tty 2>/dev/null || { error "No terminal available."; exit 1; }
fi

# ── Get password ──────────────────────────────────────────────
printf "Password: "
stty -echo < /dev/tty 2>/dev/null || true
read -r PASSWORD < /dev/tty 2>/dev/null || { error "No terminal available."; exit 1; }
stty echo < /dev/tty 2>/dev/null || true
printf '\n'

if [ -z "$EMAIL" ] || [ -z "$PASSWORD" ]; then
  error "Email and password are required."
  exit 1
fi

# ── Confirm ───────────────────────────────────────────────────
printf "Create admin %s? [Y/n] " "$EMAIL"
read -r CONFIRM < /dev/tty 2>/dev/null || CONFIRM="Y"
case "$CONFIRM" in [Nn]|[Nn][Oo]) echo "Aborted."; exit 0 ;; esac

# ── Execute ───────────────────────────────────────────────────
node scripts/create-admin.js "$EMAIL" "$PASSWORD"
