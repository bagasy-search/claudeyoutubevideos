#!/bin/bash
# Entorno "Videos" — corre al iniciar cada sesión. NO depende de la carpeta en la que arranque.
# Única variable necesaria: GH_TOKEN. Claves, skills y memoria salen del repo PRIVADO claude-brain.
LOG=~/setup_videos.log
exec > >(tee -a "$LOG") 2>&1
echo "=== setup Videos $(date -u +%FT%TZ) · pwd=$(pwd) · HOME=$HOME"

# 1) herramientas del sistema
(apt-get update -qq && apt-get install -y -qq ffmpeg jq >/dev/null) || sudo apt-get install -y -qq ffmpeg jq >/dev/null || true
pip install -q modal openai requests yt-dlp 2>/dev/null || true

# 2) cerebro desde claude-brain → ~/.video2-secrets, ~/.claude/skills, ~/.claude/memoria
if [ -z "${GH_TOKEN:-}" ]; then echo "!! FALTA la variable GH_TOKEN en el entorno"; exit 0; fi
B=/tmp/claude-brain; rm -rf "$B"
if ! git clone -q --depth 1 "https://x-access-token:${GH_TOKEN}@github.com/bautielcrack4-web/claude-brain.git" "$B"; then
  echo "!! no pude clonar claude-brain (GH_TOKEN sin acceso o red bloqueada)"; exit 0
fi
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
- Skills del creador en ~/.claude/skills. Rama de trabajo: `nube`. Sin disco D:, GPU local, ComfyUI ni Chrome.
- Español rioplatense.
MD
fi

git config --global user.name "BagasyStudio"
git config --global user.email "bautielcrack4@gmail.com"

# 6) si el repo ya está clonado, lo dejo listo ya
"$S/bootstrap_repo.sh" || echo "(el repo todavía no está: Claude corre el bootstrap al arrancar)"
echo "=== setup Videos OK"
