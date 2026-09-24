#!/bin/bash
# Entorno "Videos" — corre al iniciar cada sesión. NO depende de la carpeta en la que arranque.
# Sin variables: claude-brain se conecta a la sesión como 2º repo (o BRAIN_TOKEN=ghp_... como respaldo). Claves, skills y memoria salen del repo PRIVADO claude-brain.
LOG=~/setup_videos.log
exec > >(tee -a "$LOG") 2>&1
echo "=== setup Videos $(date -u +%FT%TZ) · pwd=$(pwd) · HOME=$HOME"

# 1) herramientas del sistema
(apt-get update -qq && apt-get install -y -qq ffmpeg jq gh >/dev/null) || sudo apt-get install -y -qq ffmpeg jq gh >/dev/null || true
pip install -q modal openai requests yt-dlp 2>/dev/null || true

# 2) cerebro desde claude-brain → ~/.video2-secrets, ~/.claude/skills, ~/.claude/memoria
# Acceso a claude-brain, en orden:
#  1) proxy de GitHub de la nube (claude-brain conectado a la sesión como 2º repo) — sin token
#  2) BRAIN_TOKEN (token real, si lo cargaste en el entorno; GH_TOKEN lo pisa la nube)
#  3) GH_TOKEN sólo si es un token real (ghp_ / github_pat_)
B=/tmp/claude-brain; rm -rf "$B"; OK=
git clone -q --depth 1 https://github.com/bautielcrack4-web/claude-brain.git "$B" 2>/dev/null && OK=proxy
if [ -z "$OK" ]; then
  for T in "${BRAIN_TOKEN:-}" "${GH_TOKEN:-}"; do
    case "$T" in ghp_*|github_pat_*) rm -rf "$B"; git clone -q --depth 1 "https://x-access-token:${T}@github.com/bautielcrack4-web/claude-brain.git" "$B" 2>/dev/null && { OK=token; break; } ;; esac
  done
fi
if [ -z "$OK" ]; then
  echo "!! no pude clonar claude-brain: conectá bautielcrack4-web/claude-brain a la sesión (botón + junto al repo) o cargá BRAIN_TOKEN=ghp_... en el entorno"; exit 0
fi
echo "claude-brain clonado vía $OK"
S=~/.video2-secrets; mkdir -p "$S" ~/.claude/skills ~/.claude/memoria
cp "$B/secretos/"* "$S/"
cp "$S/modal.toml" ~/.modal.toml
cp -r "$B/skills/." ~/.claude/skills/
cp -r "$B/memory/." ~/.claude/memoria/
rm -rf "$B"

# 3) script que prepara el REPO (se puede correr en cualquier momento, desde cualquier lado)
cat > "$S/bootstrap_repo.sh" <<'BOOT'
#!/bin/bash
# Prepara el repo de videos: .env, .env.local, memoria del proyecto y node_modules.
S=~/.video2-secrets
R="${1:-}"
[ -z "$R" ] && R=$(git rev-parse --show-toplevel 2>/dev/null)
if [ -z "$R" ] || [ ! -f "$R/scripts/farm.mjs" ]; then
  R=$(find "$HOME" /home /workspace /workspaces /code /root /srv /mnt /tmp -maxdepth 5 -path '*/scripts/farm.mjs' -not -path '*/node_modules/*' 2>/dev/null | head -1 | xargs -r dirname | xargs -r dirname)
fi
[ -z "$R" ] && { echo "bootstrap: todavía no encuentro el repo (scripts/farm.mjs)"; exit 1; }
cp "$S/video2.env" "$R/.env"; cp "$S/video2.env.local" "$R/.env.local"
P=~/.claude/projects/$(echo "$R" | sed 's/[^A-Za-z0-9]/-/g')/memory
mkdir -p "$P" && cp -r ~/.claude/memoria/. "$P/"
[ -d "$R/node_modules" ] || (cd "$R" && (npm ci --no-audit --no-fund || npm install --no-audit --no-fund) && npx remotion browser ensure >/dev/null 2>&1)
echo "bootstrap OK → $R (.env $(grep -c = "$R/.env") claves)"
BOOT
chmod +x "$S/bootstrap_repo.sh"

# 4) claves como variables para cada shell
grep -q 'video2-secrets' ~/.bashrc 2>/dev/null || cat >> ~/.bashrc <<'RC'
# video2-secrets
set -a; . ~/.video2-secrets/video2.env 2>/dev/null; . ~/.video2-secrets/video2.env.local 2>/dev/null; set +a
RC
cp ~/.bashrc ~/.bash_profile 2>/dev/null || true

# 5) instrucciones para Claude en TODAS las sesiones
if ! grep -q 'video2-secrets' ~/.claude/CLAUDE.md 2>/dev/null; then
  cat >> ~/.claude/CLAUDE.md <<'MD'
# Sesión en la NUBE — entorno "Videos"
- PRIMER PASO de cada sesión: `bash ~/.video2-secrets/bootstrap_repo.sh` (pone .env/.env.local en el repo, la memoria del proyecto y node_modules). Si no existe, el setup falló: leé `~/setup_videos.log`.
- Claves: `set -a; . ~/.video2-secrets/video2.env; . ~/.video2-secrets/video2.env.local; set +a`. No imprimirlas ni commitearlas: el repo es PÚBLICO.
- Memoria del creador: @~/.claude/memoria/MEMORY.md — leé el .md de cada tema antes de actuar.
- Skills del creador en ~/.claude/skills. Rama de trabajo: `main` (nube quedó fusionada el 24-sep). Sin disco D:, GPU local, ComfyUI ni Chrome.
- Español rioplatense.
MD
fi

git config --global user.name "BagasyStudio"
git config --global user.email "bautielcrack4@gmail.com"

# 6) si el repo ya está clonado, lo dejo listo ya
"$S/bootstrap_repo.sh" || echo "(el repo todavía no está: Claude corre el bootstrap al arrancar)"
echo "=== setup Videos OK"
