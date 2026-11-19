// tdp16 · escenas propias (S): ocupan el plano entero. Material: pasaporte (página, tapa, sello), fotos reales del video.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, D, P, SANS, SERIF, cap, cl, e, eo, h, lerp, paginaBg, sm, spr, tapaBg } from "./lib";

type SP = { t: number; a: number; b: number } & Record<string, any>;
const src = (f: string) => staticFile(P + f);

// foto pegada con esquineros (impresión física sobre el papel)
const Pegada: React.FC<{ f: string; w: number; hgt: number; rot?: number }> = ({ f, w, hgt, rot = 0 }) => (
  <div style={{ width: w, height: hgt, padding: 10, background: "#fbf8f1", boxShadow: "0 10px 24px rgba(20,14,6,.35)", transform: `rotate(${rot}deg)`, position: "relative" }}>
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}><Img src={src(f)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.11)", transformOrigin: "0% 50%" }} /></div>
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", width: 34, height: 34, ...(i < 2 ? { top: -4 } : { bottom: -4 }), ...(i % 2 ? { right: -4 } : { left: -4 }),
      background: "rgba(20,18,15,.82)", clipPath: i === 0 ? "polygon(0 0,100% 0,0 100%)" : i === 1 ? "polygon(0 0,100% 0,100% 100%)" : i === 2 ? "polygon(0 0,0 100%,100% 100%)" : "polygon(100% 0,100% 100%,0 100%)" }} />)}
  </div>
);

// sello de visado: doble filete, tinta que no llena parejo, golpe con resorte
export const Sello: React.FC<{ t: number; at: number; top: string; big: string; bottom: string; rot?: number; scale?: number; col?: string }> = ({ t, at, top, big, bottom, rot = -8, scale = 1, col = C.red }) => {
  const p = cl(spr(t, at, 1.6)), o = t < at ? 0 : 1;
  return <div style={{ opacity: o * 0.9, transform: `rotate(${rot}deg) scale(${scale * lerp(1.8, 1, p)})`, border: `5px solid ${col}`, borderRadius: 14, padding: 6,
    maskImage: "repeating-linear-gradient(17deg, #000 0 7px, rgba(0,0,0,.72) 7px 9px)", WebkitMaskImage: "repeating-linear-gradient(17deg, #000 0 7px, rgba(0,0,0,.72) 7px 9px)" }}>
    <div style={{ border: `2px solid ${col}`, borderRadius: 9, padding: "14px 30px 12px", textAlign: "center", color: col }}>
      <div style={{ ...cap, fontSize: 22, letterSpacing: "0.32em" }}>{top}</div>
      <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 64, lineHeight: 1.05, letterSpacing: "0.04em", textTransform: "uppercase", margin: "6px 0" }}>{big}</div>
      <div style={{ ...cap, fontSize: 18 }}>{bottom}</div>
    </div>
  </div>;
};

// (1) PARADA n: el pasaporte abierto sobre la mesa; foto del lugar pegada a la izquierda, sello del visado golpea la derecha, título a mano
export const Parada: React.FC<SP> = ({ t, a, b, n }) => {
  const it = D.paradas[n - 1], k = t - a, dur = b - a, NP = D.paradas.length;
  const cam = 1.02 + 0.05 * sm(k / (dur + 0.5)), ab = eo(t, a, 0.9);
  return <AbsoluteFill style={{ ...tapaBg }}>
    <AbsoluteFill style={{ perspective: 2400, transform: `scale(${cam}) translateY(${(1 - ab) * 40}px)` }}>
      <div style={{ position: "absolute", left: 150, top: 120, width: 1620, height: 840, display: "flex", transform: `rotateX(${lerp(14, 6, ab)}deg) rotateZ(${lerp(-2, -1, ab)}deg)`, boxShadow: "0 40px 90px rgba(0,0,0,.55)" }}>
        <div style={{ flex: 1, ...paginaBg, position: "relative", borderRight: "2px solid rgba(0,0,0,.18)" }}>
          <div style={{ position: "absolute", left: 90, top: 80, transform: `translateY(${(1 - eo(t, a + 0.25, 0.6)) * 30}px)`, opacity: eo(t, a + 0.25, 0.4) }}><Pegada f={it.f} w={620} hgt={440} rot={-2.5} /></div>
          <div style={{ position: "absolute", left: 90, bottom: 70, ...cap, fontSize: 20, color: "rgba(29,26,22,.6)" }}>{it.city || ""}</div>
        </div>
        <div style={{ flex: 1, ...paginaBg, position: "relative", transformOrigin: "0% 50%", transform: `rotateY(${lerp(-150, 0, sm(cl(k / 0.75)))}deg)`, backfaceVisibility: "hidden" }}>
          <div style={{ position: "absolute", right: 70, top: 60, ...cap, fontSize: 20, color: "rgba(29,26,22,.55)" }}>stop {n} of {NP}</div>
          <div style={{ position: "absolute", left: 120, top: 120 }}><Sello t={t} at={a + 0.9} top={`stop ${String(n).padStart(2, "0")}`} big={it.sello || it.city || ""} bottom={it.fecha || "entry"} rot={-7 + 4 * h(n, 3)} /></div>
          <div style={{ position: "absolute", left: 110, right: 90, bottom: 110 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 76, lineHeight: 1.06, color: C.ink, opacity: eo(t, a + 1.35, 0.5), transform: `translateY(${(1 - eo(t, a + 1.35, 0.5)) * 20}px)` }}>{it.t}</div>
            {it.sub && <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: 38, color: "rgba(29,26,22,.7)", marginTop: 14, opacity: eo(t, a + 1.8, 0.5) }}>{it.sub}</div>}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// (2) LISTA: las paradas del viaje caen una a una sobre la tapa azul como copias impresas, con su número
export const Lista: React.FC<SP> = ({ t, a, b, titulo }) => {
  const n = D.paradas.length, cols = n > 6 ? 4 : 3, w = n > 6 ? 360 : 440, gx = n > 6 ? 410 : 500, gy = n > 6 ? 380 : 420, k = t - a;
  const rows = Math.ceil(n / cols), x0 = 960 - ((cols - 1) * gx) / 2 - w / 2, y0 = rows > 1 ? 210 : 360;
  return <AbsoluteFill style={{ ...tapaBg, transform: `scale(${1.0 + 0.012 * k})` }}>
    <div style={{ position: "absolute", top: 60, width: "100%", textAlign: "center", fontFamily: SERIF, fontWeight: 300, fontSize: 70, color: C.cream, opacity: eo(t, a, 0.6) }}>{titulo}</div>
    {D.paradas.map((it, i) => {
      const c = i % cols, r = Math.floor(i / cols), at = a + 0.35 + i * ((b - a - 2.2) / n), p = cl(spr(t, at, 1.2)), rot = (h(i, 9) - 0.5) * 9;
      return <div key={i} style={{ position: "absolute", left: x0 + c * gx, top: y0 + r * gy, opacity: t < at ? 0 : 1, transform: `translate(${(1 - p) * (c - 1.5) * 120}px, ${(1 - p) * -260}px) rotate(${rot * p + (1 - p) * 20}deg) scale(${lerp(1.25, 1, p)})` }}>
        <div style={{ width: w, background: "#fbf8f1", padding: 12, paddingBottom: 18, boxShadow: "0 14px 30px rgba(0,0,0,.45)" }}>
          <div style={{ width: "100%", height: w * 0.6, overflow: "hidden" }}><Img src={staticFile(P + it.f)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.11)", transformOrigin: "0% 50%" }} /></div>
          <div style={{ display: "flex", gap: 14, alignItems: "baseline", marginTop: 12 }}>
            <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 30, color: C.red }}>{String(it.n).padStart(2, "0")}</span>
            <span style={{ fontFamily: SERIF, fontSize: 30, color: C.ink, lineHeight: 1.1 }}>{it.corto || it.t}</span>
          </div>
        </div>
      </div>;
    })}
  </AbsoluteFill>;
};

// (3) RUTA: billete de tren largo con las paradas como estaciones; el punto ámbar avanza hasta la estación de hoy
export const Ruta: React.FC<SP> = ({ t, a, b, hasta = 0, titulo }) => {
  const n = D.paradas.length, x0 = 230, x1 = 1690, k = t - a, cur = lerp(0, Math.max(0, hasta - 1), e(t, a + 0.9, a + Math.min(3.2, b - a - 0.6)));
  const X = (i: number) => lerp(x0, x1, i / Math.max(1, n - 1));
  return <AbsoluteFill style={{ ...tapaBg }}>
    <div style={{ position: "absolute", left: 110, right: 110, top: 250, height: 580, ...paginaBg, borderRadius: 18, boxShadow: "0 30px 70px rgba(0,0,0,.5)", transform: `perspective(2200px) rotateX(${lerp(12, 4, eo(t, a, 1))}deg) scale(${1 + 0.01 * k})` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 92, background: C.red, borderRadius: "18px 18px 0 0", display: "flex", alignItems: "center", padding: "0 60px", justifyContent: "space-between" }}>
        <span style={{ ...cap, color: C.cream, fontSize: 26 }}>{titulo || "the route"}</span>
        <span style={{ ...cap, color: C.cream, fontSize: 22, opacity: 0.8 }}>single · one passenger</span>
      </div>
      <div style={{ position: "absolute", top: 300, left: x0 - 110, width: (x1 - x0) * e(t, a + 0.2, a + 1.0), height: 6, background: C.ink }} />
      {D.paradas.map((it, i) => {
        const on = i <= cur + 0.01, ap = eo(t, a + 0.3 + i * 0.09, 0.4);
        return <div key={i} style={{ position: "absolute", left: X(i) - 110 - 18, top: 300 - 15, opacity: ap }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: on ? C.ink : C.page, border: `6px solid ${C.ink}` }} />
          <div style={{ position: "absolute", top: i % 2 ? 60 : -150, left: -80, width: 196, textAlign: "center" }}>
            <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 24, color: C.red }}>{String(it.n).padStart(2, "0")}</div>
            <div style={{ fontFamily: SERIF, fontSize: 28, color: C.ink, lineHeight: 1.08, opacity: on ? 1 : 0.55 }}>{it.corto || it.t}</div>
          </div>
        </div>;
      })}
      <div style={{ position: "absolute", top: 300 - 26, left: lerp(x0, x1, cur / Math.max(1, n - 1)) - 110 - 29, width: 58, height: 58, borderRadius: "50%", background: C.amber, boxShadow: "0 0 0 10px rgba(255,178,87,.3)", opacity: e(t, a + 0.8, a + 1.1) }} />
    </div>
  </AbsoluteFill>;
};

// (4) CIFRA: tarjeta de declaración de aduana; el número se escribe en la casilla, la fuente al pie
export const Cifra: React.FC<SP> = ({ t, a, b, big, lab, fuente, pre }) => {
  const k = t - a, p = eo(t, a, 0.7), txt = String(big), nch = Math.round(txt.length * e(t, a + 0.6, a + 0.6 + 0.07 * txt.length + 0.3));
  return <AbsoluteFill style={{ ...tapaBg }}>
    <div style={{ position: "absolute", left: 300, top: 150, width: 1320, height: 780, ...paginaBg, boxShadow: "0 30px 70px rgba(0,0,0,.5)", transform: `perspective(2000px) rotateX(${lerp(10, 3, p)}deg) rotateZ(${lerp(3, 1, p)}deg) translateY(${(1 - p) * 120}px) scale(${1.0 + 0.012 * k})` }}>
      <div style={{ position: "absolute", left: 70, right: 70, top: 56, display: "flex", justifyContent: "space-between", borderBottom: `2px solid ${C.ink}`, paddingBottom: 14 }}>
        <span style={{ ...cap, fontSize: 24, color: C.ink }}>declaration</span><span style={{ ...cap, fontSize: 20, color: "rgba(29,26,22,.55)" }}>{pre || "for the record"}</span>
      </div>
      <div style={{ position: "absolute", left: 70, top: 150, ...cap, fontSize: 24, color: "rgba(29,26,22,.7)" }}>{lab}</div>
      <div style={{ position: "absolute", left: 70, right: 70, top: 210, height: 330, border: `3px solid ${C.ink}`, display: "flex", alignItems: "center", paddingLeft: 50 }}>
        <span style={{ fontFamily: SERIF, fontWeight: 400, fontSize: txt.length > 9 ? 150 : 210, color: C.navy, letterSpacing: "-0.01em" }}>{txt.slice(0, nch)}</span>
        <span style={{ width: 6, height: 170, background: C.navy, opacity: nch < txt.length && Math.floor(k * 3) % 2 === 0 ? 0.8 : 0, marginLeft: 6 }} />
      </div>
      <div style={{ position: "absolute", left: 70, right: 70, bottom: 60, fontFamily: SERIF, fontStyle: "italic", fontWeight: 300, fontSize: 30, color: "rgba(29,26,22,.75)", opacity: eo(t, a + 1.4, 0.5) }}>Source: {fuente}</div>
    </div>
  </AbsoluteFill>;
};

// (5) REPASO: las paradas en grilla sobre la tapa; cada una recibe el sello VISITED sobre su palabra
export const Repaso: React.FC<SP> = ({ t, a, marcas = [], titulo }) => {
  const n = D.paradas.length, cols = 4, w = 330, gx = 410, gy = 400, rows = Math.ceil(n / cols), x0 = 960 - ((cols - 1) * gx) / 2 - w / 2, y0 = rows > 1 ? 190 : 330;
  return <AbsoluteFill style={{ ...tapaBg }}>
    <div style={{ position: "absolute", top: 54, width: "100%", textAlign: "center", fontFamily: SERIF, fontWeight: 300, fontSize: 64, color: C.cream, opacity: eo(t, a, 0.5) }}>{titulo}</div>
    {D.paradas.map((it, i) => {
      const c = i % cols, r = Math.floor(i / cols), en = cl(spr(t, a + i * 0.06, 1.1)), at = marcas[i] ?? a + 1 + i * 0.7, lit = t >= at;
      return <div key={i} style={{ position: "absolute", left: x0 + c * gx, top: y0 + r * gy, opacity: en, transform: `translateY(${(1 - en) * 50}px) rotate(${(h(i, 4) - 0.5) * 4}deg) scale(${lit ? 1 : 0.95})` }}>
        <div style={{ width: w, background: "#fbf8f1", padding: 10, paddingBottom: 14, boxShadow: "0 12px 26px rgba(0,0,0,.45)" }}>
          <div style={{ width: "100%", height: w * 0.6, overflow: "hidden" }}><Img src={staticFile(P + it.f)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scale(1.11)", transformOrigin: "0% 50%", opacity: lit ? 1 : 0.45 }} /></div>
          <div style={{ fontFamily: SERIF, fontSize: 27, color: C.ink, marginTop: 10, lineHeight: 1.1 }}><b style={{ fontFamily: SANS, color: C.red, marginRight: 10 }}>{String(it.n).padStart(2, "0")}</b>{it.corto || it.t}</div>
        </div>
        {lit && <div style={{ position: "absolute", right: -30, top: 40 }}><Sello t={t} at={at} top="stop" big="visited" bottom={String(it.n).padStart(2, "0")} rot={-12 + 8 * h(i, 5)} scale={0.5} /></div>}
      </div>;
    })}
  </AbsoluteFill>;
};

export const ESCENAS: Record<string, React.FC<any>> = { parada: Parada, lista: Lista, ruta: Ruta, cifra: Cifra, repaso: Repaso };
