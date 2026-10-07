#!/bin/bash
# ci_secretos.sh — en GitHub Actions (repo PÚBLICO: los logs los ve cualquiera).
#   bash scripts/ci_secretos.sh mask            → registra cada valor del .env como secreto (los logs lo tapan)
#   echo "$texto" | bash scripts/ci_secretos.sh tapar   → reemplaza cualquier valor del .env por ***
# Se usa ANTES de imprimir o comentar nada que haya escrito un modelo.
REPO="$(cd "$(dirname "$0")/.." && pwd)"
valores() { for f in "$REPO/.env" "$REPO/.env.local"; do [ -f "$f" ] && sed -n 's/^[A-Za-z0-9_]*=//p' "$f"; done | sed "s/^[\"']//; s/[\"']$//" | awk 'length($0) >= 8'; }
case "$1" in
  mask) valores | while IFS= read -r v; do echo "::add-mask::$v"; done ;;
  tapar) node -e '
    const fs = require("fs"); let t = fs.readFileSync(0, "utf8");
    const vs = process.argv.slice(1).filter(Boolean).sort((a, b) => b.length - a.length);
    for (const v of vs) t = t.split(v).join("***");
    process.stdout.write(t);' $(valores) ;;
  *) echo "uso: ci_secretos.sh mask|tapar"; exit 2 ;;
esac
