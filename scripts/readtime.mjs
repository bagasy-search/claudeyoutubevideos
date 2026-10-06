// readtime.mjs — cuánto tiene que durar un plano para que su texto SE PUEDA LEER.
//
// Regla del usuario (ago-2026): "cada componente debe tener segundos, no debe ser
// todo rápido pq no se llega ni a leer". Esto deja de ser criterio y pasa a ser
// aritmética: entrada + lectura + respiro, y si el texto se ESCRIBE, además el
// tiempo de tipeo antes de poder empezar a leerlo.
//
//   node scripts/readtime.mjs _v3/moho_shots_min1.json
import fs from "node:fs";

const ENTRADA = 0.8;      // la pieza llega con motion blur y se asienta
const RESPIRO = 1.0;      // no cortar en el instante en que terminó de leer
const CPS_LECTURA = 14;   // caracteres/segundo leyendo en pantalla MIENTRAS se escucha la voz
const CPS_TIPEO = 26;     // velocidad del typewriter

// el texto de titulares grandes se lee más rápido que el de cuerpo
const PESO = { display: 0.75, body: 1.0 };

const textOf = (v, out = []) => {
  if (typeof v === "string") out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => textOf(x, out));
  else if (v && typeof v === "object") Object.values(v).forEach((x) => textOf(x, out));
  return out;
};

export const readTime = (props, { typewriter = false } = {}) => {
  const strs = textOf(props).filter((s) => s.length > 1 && !s.includes("/") && !s.endsWith(".png"));
  const chars = strs.reduce((a, s) => a + s.length * (s.length < 26 ? PESO.display : PESO.body), 0);
  const lectura = chars / CPS_LECTURA;
  const tipeo = typewriter ? chars / CPS_TIPEO : 0;
  return { chars: Math.round(chars), min: +(ENTRADA + tipeo + lectura + RESPIRO).toFixed(2) };
};

const file = process.argv[2];
if (file) {
  const plan = JSON.parse(fs.readFileSync(file, "utf8").replace(/^﻿/, ""));
  let deuda = 0;
  console.log("plano".padEnd(22), "actual", "  mínimo", " veredicto");
  for (const s of plan) {
    if (s.kind === "avatar" || s.kind === "fotoHero") {
      console.log(`${s.kind.padEnd(22)} ${String(s.dur).padStart(5)}s      —    (sin texto)`);
      continue;
    }
    const { chars, min } = readTime(s.props, { typewriter: !!s.props?.typewriter });
    const falta = +(min - s.dur).toFixed(2);
    if (falta > 0) deuda += falta;
    console.log(
      `${s.kind.padEnd(22)} ${String(s.dur).padStart(5)}s  ${String(min).padStart(6)}s   ${
        falta > 0 ? `✗ le faltan ${falta}s (${chars} car.)` : "✓"
      }`,
    );
  }
  console.log(`\nDEUDA TOTAL DE LECTURA: ${deuda.toFixed(1)}s sobre un minuto de narración.`);
}
