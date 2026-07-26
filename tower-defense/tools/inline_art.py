#!/usr/bin/env python3
"""
Empotra el arte de `public/art/` dentro del bundle, como data: URIs.

Hace falta para el build de un solo archivo: esa pagina no puede hacer ninguna
request, asi que el manifiesto por fetch no sirve y los PNG tienen que viajar
adentro del JS.

Genera `src/generated/inlineArt.ts`. Sin correrlo, ese archivo es un stub que
exporta null y el juego arranca con el arte procedural.

    python3 tools/inline_art.py                 # empotra public/art/manifest.json
    python3 tools/inline_art.py --clear         # vuelve al stub
"""

import argparse
import base64
import io
import json
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ART = os.path.join(ROOT, "public", "art")
OUT = os.path.join(ROOT, "src", "generated", "inlineArt.ts")

HEADER = """// GENERADO por tools/inline_art.py — no editar a mano.
import type { ArtManifest } from '../render/externalArt'

/**
 * Arte empotrado como data: URIs. Es null salvo que se corra la herramienta,
 * y en ese caso el build de un solo archivo lleva los PNG adentro.
 */
export const INLINE_ART: ArtManifest | null = """


# El tipo sale de la extension y no se asume PNG: el tablero viaja en WebP, que
# para una imagen pintada de 1080x1920 pesa un quinto que el PNG. Declararlo
# como PNG hace que `createImageBitmap` lo rechace en el navegador y el fondo
# queda sin cargar, sin mas sintoma que un tablero procedural.
MIME = {".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg"}


def encode(path: str) -> str:
    mime = MIME.get(os.path.splitext(path)[1].lower())
    if mime is None:
        sys.exit(f"no se que tipo MIME tiene {path}")
    with open(path, "rb") as fh:
        data = base64.b64encode(fh.read()).decode("ascii")
    return f"data:{mime};base64,{data}"


def walk(node, base: str):
    """Reemplaza cada ruta del manifiesto por su data: URI."""
    if isinstance(node, str):
        full = os.path.join(base, node)
        if not os.path.exists(full):
            sys.exit(f"falta {full}")
        return encode(full)
    if isinstance(node, list):
        return [walk(v, base) for v in node]
    if isinstance(node, dict):
        if "path" in node:
            out = dict(node)
            out["path"] = walk(node["path"], base)
            return out
        return {k: walk(v, base) for k, v in node.items()}
    return node


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--clear", action="store_true", help="volver al stub")
    args = ap.parse_args()

    os.makedirs(os.path.dirname(OUT), exist_ok=True)

    if args.clear:
        io.open(OUT, "w", encoding="utf-8").write(HEADER + "null\n")
        print("stub restaurado")
        return

    manifest_path = os.path.join(ART, "manifest.json")
    if not os.path.exists(manifest_path):
        sys.exit(f"no hay manifiesto en {manifest_path}")

    manifest = json.load(open(manifest_path, encoding="utf-8"))
    inlined = walk(manifest, ART)
    body = json.dumps(inlined, indent=2, ensure_ascii=False)

    io.open(OUT, "w", encoding="utf-8").write(HEADER + body + "\n")
    kb = os.path.getsize(OUT) / 1024
    print(f"escrito {OUT}  ({kb:.0f} kB)")


if __name__ == "__main__":
    main()
