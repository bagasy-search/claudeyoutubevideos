// Títulos del molde: sans negra blanca + UNA palabra en itálica serif (más grande, con subrayado rojo de neón).
// nx-collage-titulo: la promesa del video arriba y debajo miniaturas que CAEN, se acomodan en grilla, se tiñen de
// rojo y colapsan en el bucle ancla (el bucle nace del collage: primer "objeto que nace del anterior").
import React from "react";
import { Img, staticFile } from "remotion";
import { N, SANS, SERIF, ease, easeOut, lerp, partes, pop, ramp, rnd, useT, vis } from "./base";
import { geoBucle } from "./Bucle";

const src = (p: string) => (p.startsWith("http") ? p : staticFile(p));

// Una línea de título: palabras que entran desde el desenfoque, escalonadas. `*itálica*` = serif más grande.
export const LineaTitulo: React.FC<{ texto: string; t0: number; size?: number; color?: string; subrayado?: boolean; peso?: number; paso?: number }> = ({ texto, t0, size = 64, color = "#fff", subrayado = false, peso = 800, paso = 0.06 }) => {
  const t = useT();
  let i = 0;
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", flexWrap: "wrap", columnGap: size * 0.24, lineHeight: 1.04 }}>
      {partes(texto).flatMap((p, pi) =>
        p.s.trim().split(/\s+/).filter(Boolean).map((wd, wi) => {
          const k = ramp(t, t0 + i++ * paso, 0.38, easeOut);
          const it = p.it;
          const sub = it && subrayado ? ramp(t, t0 + i * paso + 0.2, 0.45, easeOut) : 0;
          return (
            <span key={pi + "_" + wi} style={{ position: "relative", display: "inline-block", opacity: k, filter: `blur(${(1 - k) * 14}px)`, transform: `translateY(${(1 - k) * size * 0.25}px)`,
              fontFamily: it ? SERIF : SANS, fontStyle: it ? "italic" : "normal", fontWeight: it ? 400 : peso, fontSize: it ? size * 1.32 : size, letterSpacing: it ? -0.5 : -size * 0.02, color, textShadow: "0 4px 22px rgba(0,0,0,.7)" }}>
              {wd}
              {sub > 0 && <span style={{ position: "absolute", left: 0, bottom: size * 0.04, height: Math.max(2, size * 0.045), width: `${sub * 100}%`, background: N.rojo, borderRadius: 2, boxShadow: `0 0 10px ${N.rojo}, 0 0 22px ${N.rojo}` }} />}
            </span>
          );
        }),
      )}
    </div>
  );
};

// Título de 1-3 líneas. Fijo en el escenario (pantalla) o en el mundo (pasar x, y y `mundo`).
// lineas: ["Así funciona", "*la trampa* del celular"] · tamanos: [44, 76]
export const TituloNeon: React.FC<{ lineas: string[]; t0: number; t1?: number; tamanos?: number[]; x?: number; y?: number; w?: number; subrayado?: boolean; mundo?: boolean }> = ({ lineas, t0, t1 = Infinity, tamanos, x, y = 70, w = 1312, subrayado = true, mundo = false }) => {
  const t = useT();
  if (!vis(t, t0, t1)) return null;
  const sal = t1 === Infinity ? 0 : ramp(t, t1 - 0.35, 0.35);
  const left = x ?? w / 2;
  return (
    <div style={{ position: "absolute", left, top: y, transform: `translate(-50%,0) translateY(${-sal * 30}px)`, width: mundo ? 1400 : w * 0.92, opacity: 1 - sal, filter: sal ? `blur(${sal * 12}px)` : undefined, textAlign: "center", pointerEvents: "none" }}>
      {lineas.map((l, i) => (
        <LineaTitulo key={i} texto={l} t0={t0 + i * 0.18} size={tamanos?.[i] ?? (i === 0 && lineas.length > 1 ? 40 : 68)} subrayado={subrayado} />
      ))}
    </div>
  );
};

// ───────── nx-collage-titulo ─────────
// imgs: 9 fotos/miniaturas (de lo que habla el video). tRojo: se tiñen de rojo y la del centro crece ("la clave").
// tColapso: vuelan a puntos del bucle ancla (destino) y se apagan mientras el bucle se dibuja → poner el BucleNeon
// con t0 = tColapso + 0.25 en el mismo destino.
export const CollageTitulo: React.FC<{ x: number; y: number; t0: number; imgs: string[]; tRojo?: number; tColapso?: number; destino?: { x: number; y: number; a: number }; celda?: [number, number]; gap?: number }> = ({ x, y, t0, imgs, tRojo, tColapso, destino, celda = [176, 236], gap = 16 }) => {
  const t = useT();
  if (!vis(t, t0, tColapso !== undefined ? tColapso + 1.4 : Infinity)) return null;
  const [cw, ch] = celda;
  const g = destino ? geoBucle(destino.a) : null;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0 }}>
      {Array.from({ length: 9 }).map((_, i) => {
        const col = i % 3, row = Math.floor(i / 3);
        const orden = [4, 1, 3, 5, 7, 0, 2, 6, 8].indexOf(i); // caen del centro hacia afuera
        const ti = t0 + orden * 0.075;
        const s = pop(t, ti, 13, 150);
        if (t < ti - 0.05) return null;
        const gx = (col - 1) * (cw + gap), gy = (row - 1) * (ch + gap);
        let px = lerp(gx + (rnd(i, 4) - 0.5) * 300, gx, s), py = lerp(gy - 700 - rnd(i, 5) * 300, gy, s);
        let rot = lerp((rnd(i, 6) - 0.5) * 50, 0, s), sc = 1, op = 1;
        // rojo: tinte progresivo del centro hacia afuera; la del centro crece
        const kr = tRojo !== undefined ? ramp(t, tRojo + (i === 4 ? 0 : 0.06 * orden), 0.35) : 0;
        const centro = i === 4 ? ramp(t, (tRojo ?? 1e9) + 0.15, 0.45, easeOut) : 0;
        sc *= 1 + centro * 0.32;
        // colapso al bucle
        if (tColapso !== undefined && g && destino) {
          const kc = ramp(t, tColapso + orden * 0.04, 0.55, ease);
          const p = g.at(orden / 9);
          const dx = destino.x - x + p.x, dy = destino.y - y + p.y;
          px = lerp(px, dx, kc); py = lerp(py, dy, kc);
          rot = lerp(rot, (p.ang * 180) / Math.PI, kc);
          sc = lerp(sc, 0.12, kc);
          op = 1 - ramp(t, tColapso + 0.35 + orden * 0.04, 0.35);
        }
        const brillo = 0.55 + 0.45 * s;
        return (
          <div key={i} style={{ position: "absolute", left: px - cw / 2, top: py - ch / 2, width: cw, height: ch, transform: `rotate(${rot}deg) scale(${sc})`, opacity: op, zIndex: i === 4 ? 2 : 1,
            borderRadius: 8, overflow: "hidden", border: `2px solid rgba(255,255,255,${0.25 + centro * 0.7})`, boxShadow: `0 18px 40px rgba(0,0,0,.6), 0 0 ${10 + centro * 30}px rgba(255,${120 - kr * 90},${130 - kr * 100},${0.25 + kr * 0.4})` }}>
            <Img src={src(imgs[i % imgs.length])} style={{ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${brillo}) saturate(${1 - kr * 0.6})` }} />
            <div style={{ position: "absolute", inset: 0, background: N.rojo, mixBlendMode: "multiply", opacity: kr * (i === 4 ? 0.35 : 0.85) }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(140deg, rgba(255,255,255,.22) 0%, transparent 38%)", opacity: 0.6 }} />
          </div>
        );
      })}
    </div>
  );
};
