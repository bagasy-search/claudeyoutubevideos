// nx-hoja-guion — leer un ejemplo, una cita o un guion: hoja de vidrio con bordes de luz; los renglones de relleno
// se tienden solos y la frase dicha se ESCRIBE en vivo (letra a letra, al ritmo de la voz) con resaltador verde
// fosforescente en la parte clave.
import React from "react";
import { interpolate } from "remotion";
import { N, SANS, clamp, easeOut, pop, ramp, rnd, useT, vis } from "./base";

export type Renglon = { fila: number; texto: string; t: number; dur?: number; resaltar?: string; tResaltar?: number };
// (x, y) = centro de la hoja en el MUNDO. filas = renglones de relleno; cada Renglon reemplaza la fila `fila`.
export const HojaGuion: React.FC<{ x: number; y: number; t0: number; t1?: number; titulo?: string; renglones: Renglon[]; ancho?: number; alto?: number; filas?: number; letra?: number }> = ({ x, y, t0, t1 = Infinity, titulo = "GUION", renglones, ancho = 760, alto = 900, filas = 15, letra = 34 }) => {
  const t = useT();
  if (!vis(t, t0, t1)) return null;
  const e = pop(t, t0, 14, 120);
  const sal = t1 === Infinity ? 0 : ramp(t, t1 - 0.35, 0.35);
  const brillo = interpolate(t, [t0 + 0.15, t0 + 1.1], [-0.4, 1.4], clamp); // reflejo que barre el vidrio al entrar
  const pad = 70, top0 = 150, paso = (alto - top0 - 80) / filas;
  return (
    <div style={{ position: "absolute", left: x - ancho / 2, top: y - alto / 2, width: ancho, height: alto, perspective: 1600, opacity: (1 - sal) * Math.min(1, e * 1.4) }}>
      <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 100%", transform: `rotateX(${(1 - e) * 24 + Math.sin(t * 0.7) * 1.2}deg) rotateY(${Math.sin(t * 0.5) * 2}deg) translateY(${(1 - e) * 60}px)`,
        borderRadius: 6, border: "2px solid rgba(255,255,255,.88)", background: "linear-gradient(165deg, rgba(255,255,255,.075) 0%, rgba(255,255,255,.02) 45%, rgba(255,255,255,.045) 100%)",
        boxShadow: "0 0 16px rgba(255,255,255,.35), 0 0 60px rgba(255,255,255,.08), inset 0 0 40px rgba(255,255,255,.05)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${brillo * 100 - 12}%, rgba(255,255,255,.13) ${brillo * 100}%, transparent ${brillo * 100 + 12}%)` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 58, textAlign: "center", fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 3, color: "#fff", opacity: ramp(t, t0 + 0.2, 0.3) }}>{titulo}</div>
        {Array.from({ length: filas }).map((_, i) => {
          const r = renglones.find((q) => q.fila === i);
          const ky = top0 + i * paso;
          if (r && t >= r.t) {
            const dur = r.dur ?? Math.max(0.5, r.texto.length / 22);
            const n = Math.round(interpolate(t, [r.t, r.t + dur], [0, r.texto.length], clamp));
            const vis_ = r.texto.slice(0, n);
            const escribe = n < r.texto.length;
            const hi = r.resaltar ? r.texto.indexOf(r.resaltar) : -1;
            const kh = r.resaltar && hi >= 0 ? ramp(t, r.tResaltar ?? r.t + dur + 0.1, 0.35, easeOut) : 0;
            const seg = (a: number, b: number) => vis_.slice(Math.min(a, vis_.length), Math.min(b, vis_.length));
            return (
              <div key={i} style={{ position: "absolute", left: pad, top: ky - letra * 0.62, width: ancho - pad * 2, fontFamily: SANS, fontWeight: 800, fontSize: letra, color: "#fff", whiteSpace: "nowrap", letterSpacing: -0.2, textShadow: "0 0 10px rgba(255,255,255,.35)" }}>
                {hi < 0 ? vis_ : (
                  <>
                    {seg(0, hi)}
                    <span style={{ position: "relative", isolation: "isolate", margin: "0 5px 0 7px", color: kh > 0.5 ? "#04140a" : "#fff", textShadow: kh > 0.5 ? "none" : undefined }}>
                      <span style={{ position: "absolute", left: -5, right: -5, top: 2, bottom: -2, background: N.fosfo, opacity: 0.9, borderRadius: 3, transformOrigin: "0 50%", transform: `scaleX(${kh}) skewX(-6deg)`, boxShadow: `0 0 18px ${N.fosfo}`, zIndex: -1 }} />
                      <span style={{ position: "relative" }}>{seg(hi, hi + r.resaltar!.length)}</span>
                    </span>
                    {seg(hi + r.resaltar!.length, r.texto.length)}
                  </>
                )}
                {escribe && <span style={{ display: "inline-block", width: 3, height: letra * 1.05, marginLeft: 3, background: "#fff", verticalAlign: -letra * 0.18, opacity: Math.floor(t * 8) % 2 ? 1 : 0.3 }} />}
              </div>
            );
          }
          // renglón de relleno: barra gris que se tiende de izquierda a derecha
          const k = ramp(t, t0 + 0.25 + i * 0.03, 0.35, easeOut);
          const wfr = r ? 0.9 : 0.42 + rnd(i, 7) * 0.5;
          return <div key={i} style={{ position: "absolute", left: pad, top: ky - 3, width: (ancho - pad * 2) * wfr * k, height: 6, borderRadius: 3, background: r ? "rgba(255,255,255,.32)" : N.gris }} />;
        })}
      </div>
    </div>
  );
};
