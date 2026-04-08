#!/usr/bin/env bash
set -euo pipefail

# zb-poc-devs skill installer
# Installs the /friction slash command for Claude Code

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_SOURCE="${SCRIPT_DIR}/skills/friction.md"
CONFIG_FILE="${HOME}/.claude/zb-poc-devs.json"
GLOBAL_COMMANDS="${HOME}/.claude/commands"

# Colors (safe for terminals that don't support them)
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

info()  { echo -e "${GREEN}[info]${NC} $*"; }
warn()  { echo -e "${YELLOW}[warn]${NC} $*"; }
error() { echo -e "${RED}[error]${NC} $*" >&2; }

usage() {
    cat <<EOF
Usage: ./install.sh [command]

Commands:
  install   Interactive install (default)
  update    Pull latest and re-copy/re-link skill
  status    Show current installation info
  uninstall Remove skill and config

EOF
}

detect_author() {
    local git_user
    git_user=$(git config user.name 2>/dev/null || echo "")
    case "${git_user,,}" in
        *clark*)  echo "clark" ;;
        *dan*)    echo "dan" ;;
        *)        echo "" ;;
    esac
}

write_config() {
    local author="$1"
    mkdir -p "$(dirname "${CONFIG_FILE}")"
    cat > "${CONFIG_FILE}" <<EOF
{
  "repo_path": "${SCRIPT_DIR}",
  "author": "${author}"
}
EOF
    info "Config written to ${CONFIG_FILE}"
}

do_install() {
    echo ""
    echo "=== zb-poc-devs Skill Installer ==="
    echo ""

    # Check skill source exists
    if [[ ! -f "${SKILL_SOURCE}" ]]; then
        error "Skill file not found: ${SKILL_SOURCE}"
        exit 1
    fi

    # Detect or ask for author name
    local author
    author=$(detect_author)
    if [[ -z "${author}" ]]; then
        read -rp "Your name (e.g., clark, dan): " author
    else
        read -rp "Author name [${author}]: " input_author
        author="${input_author:-${author}}"
    fi

    # Ask install scope
    echo ""
    echo "Install scope:"
    echo "  1) Global   — available in all projects (~/.claude/commands/)"
    echo "  2) Project  — specific project's .claude/commands/"
    echo ""
    read -rp "Choice [1]: " scope_choice
    scope_choice="${scope_choice:-1}"

    local target_dir
    if [[ "${scope_choice}" == "2" ]]; then
        read -rp "Project path (absolute): " project_path
        target_dir="${project_path}/.claude/commands"
    else
        target_dir="${GLOBAL_COMMANDS}"
    fi

    # Ask install method
    echo ""
    echo "Install method:"
    echo "  1) Symlink  — always uses latest from this repo (recommended)"
    echo "  2) Copy     — independent copy (use './install.sh update' to refresh)"
    echo ""
    read -rp "Choice [1]: " method_choice
    method_choice="${method_choice:-1}"

    # Create target directory
    mkdir -p "${target_dir}"

    local target_file="${target_dir}/friction.md"

    # Remove existing if present
    if [[ -e "${target_file}" || -L "${target_file}" ]]; then
        warn "Removing existing: ${target_file}"
        rm -f "${target_file}"
    fi

    if [[ "${method_choice}" == "2" ]]; then
        cp "${SKILL_SOURCE}" "${target_file}"
        info "Copied to ${target_file}"
    else
        ln -s "${SKILL_SOURCE}" "${target_file}"
        info "Symlinked to ${target_file}"
    fi

    # Write config
    write_config "${author}"

    echo ""
    info "Installation complete! Use /friction in Claude Code."
}

do_update() {
    echo ""
    echo "=== Updating zb-poc-devs skills ==="
    echo ""

    # Pull latest
    info "Pulling latest from origin..."
    git -C "${SCRIPT_DIR}" pull --ff-only

    # Check config
    if [[ ! -f "${CONFIG_FILE}" ]]; then
        error "Config not found: ${CONFIG_FILE}"
        error "Run './install.sh install' first."
        exit 1
    fi

    # Find existing installations (non-symlink copies)
    local found=0

    # Check global
    local global_target="${GLOBAL_COMMANDS}/friction.md"
    if [[ -f "${global_target}" && ! -L "${global_target}" ]]; then
        cp "${SKILL_SOURCE}" "${global_target}"
        info "Updated global: ${global_target}"
        found=1
    elif [[ -L "${global_target}" ]]; then
        info "Global is symlinked — already up to date"
        found=1
    fi

    # Search for project-level copies
    while IFS= read -r -d '' proj_copy; do
        if [[ ! -L "${proj_copy}" ]]; then
            cp "${SKILL_SOURCE}" "${proj_copy}"
            info "Updated: ${proj_copy}"
            found=1
        fi
    done < <(find "${HOME}/Projects" -path "*/.claude/commands/friction.md" -print0 2>/dev/null || true)

    if [[ "${found}" -eq 0 ]]; then
        warn "No installations found. Run './install.sh install' first."
    fi

    echo ""
    info "Update complete."
}

do_status() {
    echo ""
    echo "=== zb-poc-devs Installation Status ==="
    echo ""

    if [[ -f "${CONFIG_FILE}" ]]; then
        info "Config: ${CONFIG_FILE}"
        cat "${CONFIG_FILE}"
    else
        warn "Config not found — not installed"
    fi

    echo ""

    local global_target="${GLOBAL_COMMANDS}/friction.md"
    if [[ -L "${global_target}" ]]; then
        info "Global: symlinked → $(readlink "${global_target}")"
    elif [[ -f "${global_target}" ]]; then
        info "Global: copied (run './install.sh update' to refresh)"
    else
        warn "Global: not installed"
    fi
}

do_uninstall() {
    echo ""
    echo "=== Uninstalling zb-poc-devs skills ==="
    echo ""

    local global_target="${GLOBAL_COMMANDS}/friction.md"
    if [[ -e "${global_target}" || -L "${global_target}" ]]; then
        rm -f "${global_target}"
        info "Removed: ${global_target}"
    fi

    if [[ -f "${CONFIG_FILE}" ]]; then
        rm -f "${CONFIG_FILE}"
        info "Removed: ${CONFIG_FILE}"
    fi

    info "Uninstall complete."
}

# Main
case "${1:-install}" in
    install)    do_install ;;
    update)     do_update ;;
    status)     do_status ;;
    uninstall)  do_uninstall ;;
    -h|--help)  usage ;;
    *)          usage; exit 1 ;;
esac
