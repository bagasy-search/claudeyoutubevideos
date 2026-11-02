// wl01a · COMPONENTES sobre FOTO REAL (placas y recortes Nano Banana en public/wl01a/kit): kayla (el cronómetro cae en el
// tocador junto a la faja y no llega a 4:00) · layaway (tarjeta de apartado en el mostrador, 30 semanas a un dólar, sello PAID)
// · halloran (3 sombrereras caen y se apilan en 15 minutos; la boleta sale de la caja) · puerta (contraluz: el vestido sin enagua deja pasar el sol).
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { FONT, e, spr } from "./lib";
import { HAND } from "./k3d";
import type { Fi } from "./hilo";

const kit = (k: string) => staticFile(`wl01a/kit/${k}`);
const Placa: React.FC<{ t: number; a: number; b: number; src: string; ox: number; oy: number; z: number; children?: React.ReactNode }> = ({ t, a, b, src, ox, oy, z, children }) => {
  const out = e(t, b - 0.3, b), sc = 1 + (z - 1) * e(t, a, b);   // la cámara se arrima despacio todo el tramo
  return <AbsoluteFill style={{ background: "#0b0907", overflow: "hidden", opacity: 1 - out }}>
    <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: `${ox}% ${oy}%` }}>
      <Img src={kit(src)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
      {children}
    </AbsoluteFill>
    <AbsoluteFill style={{ background: "radial-gradient(85% 75% at 50% 50%, transparent 55%, rgba(10,7,4,.5) 100%)" }} />
  </AbsoluteFill>;
};
// algo que cae sobre la mesa: altura h (0 = apoyado), sombra de contacto que se achica y se aclara con la altura
const Sombra: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) =>
  <div style={{ position: "absolute", left: x - w / 2, top: y - w * 0.09, width: w, height: w * 0.18, borderRadius: "50%",
    background: "radial-gradient(closest-side, rgba(20,12,6,.7), transparent)", opacity: Math.max(0, 1 - h / 700), transform: `scale(${1 + h / 900})` }} />;

// ---------- KAYLA: el cronómetro cae en el tocador al lado de la faja, corre 4 minutos en 3 segundos y se clava en 4:00 ----------
export const KaylaFX: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!, four = f.mo?.four ?? wow + 0.6;
  const A = Math.max(a, f.va ?? a), cae = Math.min(1.05, spr(t, A + 0.1, 0.9)), h = (1 - cae) * 900;
  const run = e(t, A + 0.9, wow + 0.15), seg = 240 * Math.pow(run, 1.6), par = t > wow + 0.15;
  const reb = par ? 9 * Math.sin((t - wow - 0.15) * 26) * Math.exp(-(t - wow - 0.15) * 4.5) : 0;    // la aguja rebota al clavarse
  const vib = par ? 5 * Math.sin((t - wow) * 70) * Math.exp(-(t - wow) * 6) : 0, pulse = 1 + 0.14 * Math.sin(Math.PI * e(t, four, four + 0.5));
  const S = 1000, X = 930, Y = 40, cx = X + (514 / 1024) * S, cy = Y + (570 / 1024) * S, R = (168 / 1024) * S;
  const mm = Math.floor(seg / 60), ss = Math.floor(seg % 60);
  return <Placa t={t} a={A} b={b} src="w_tocador.jpg" ox={70} oy={55} z={1.14}>
    <Sombra x={cx} y={Y + 0.79 * S} w={0.5 * S} h={h} />
    <div style={{ position: "absolute", left: 0, top: -h, width: 1920, height: 1080, transform: `rotate(${vib * 0.3}deg)`, transformOrigin: `${cx}px ${cy}px` }}>
      <Img src={kit("k_cronometro.png")} style={{ position: "absolute", left: X, top: Y, width: S, height: S, filter: "drop-shadow(0 18px 18px rgba(20,10,4,.55)) sepia(.15)" }} />
      <svg style={{ position: "absolute", left: cx - R - 20, top: cy - R - 20 }} width={2 * R + 40} height={2 * R + 40} viewBox={`${-R - 20} ${-R - 20} ${2 * R + 40} ${2 * R + 40}`}>
        <g transform={`rotate(${seg * 6 + reb})`} style={{ filter: "drop-shadow(3px 5px 3px rgba(0,0,0,.35))" }}>
          <line x1={0} y1={R * 0.22} x2={0} y2={-R} stroke="#a3221b" strokeWidth={5} strokeLinecap="round" />
          <circle r={11} fill="#3a2a22" />
        </g>
        <circle r={4} fill="#d9c9a8" />
      </svg>
    </div>
    <div style={{ position: "absolute", left: cx - 300, width: 600, top: Y + 0.82 * S + 10, textAlign: "center", opacity: e(t, A + 0.8, A + 1.1), fontFamily: FONT, fontWeight: 900,
      fontSize: 118 * pulse, color: par ? "#ffd27a" : "#fbf4e6", textShadow: "0 6px 24px rgba(0,0,0,.85)", letterSpacing: 4 }}>{mm}:{String(ss).padStart(2, "0")}</div>
  </Placa>;
};

// ---------- LAYAWAY: la tarjeta de apartado en el mostrador; la perforadora marca una semana por golpe, cada vez más rápido; cae PAID ----------
export const LayawayFX: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!;
  const A = Math.max(a, f.va ?? a), P0 = A + 0.9, P1 = Math.max(P0 + 3, wow - 0.5);
  const hora = (i: number) => P0 + (P1 - P0) * Math.pow((i + 1) / 30, 1 / 1.7);   // golpe de la semana i: cada vez más seguidos
  let n = 0; while (n < 30 && t >= hora(n)) n++;
  const ult = n > 0 ? hora(n - 1) : -9, prox = n < 30 ? hora(n) : 1e9;
  const pr = n < 30 && t > P0 - 0.4 ? Math.max(0, 1 - Math.min(1, (prox - t) / Math.min(0.35, prox - ult))) : 0;   // la perforadora baja justo antes de cada golpe
  const sello = spr(t, wow, 0.9), golpe = t > wow ? 10 * Math.exp(-(t - wow) * 7) * Math.sin((t - wow) * 50) : 0;
  const ent = Math.min(1, spr(t, A, 0.75));
  return <Placa t={t} a={A} b={b} src="w_mostrador.jpg" ox={48} oy={62} z={1.1}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, perspective: 1500 }}>
      <div style={{ position: "absolute", left: 380, top: 220, width: 1180, height: 600, transformOrigin: "50% 70%",
        transform: `rotateX(${42 + 10 * (1 - ent)}deg) rotateZ(-5deg) translateY(${(1 - ent) * -600}px) translateX(${golpe}px)`,
        background: "linear-gradient(170deg,#f6eedb,#e3d5b6)", borderRadius: 12, boxShadow: "0 40px 50px rgba(30,15,5,.55), 0 4px 6px rgba(30,15,5,.4)", padding: "30px 46px", color: "#2a2116" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "3px double #7d6a4e", paddingBottom: 8 }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 48, letterSpacing: 10 }}>LAYAWAY</span>
          <span style={{ fontFamily: HAND, fontSize: 76, color: "#1d2a4a" }}>camel coat · $30</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 12, marginTop: 26 }}>
          {Array.from({ length: 30 }, (_, i) => {
            const on = i < n, k = on ? Math.min(1, spr(t, hora(i), 2.2)) : 0;
            return <div key={i} style={{ height: 120, border: "2px solid #a8977a", borderRadius: 6, position: "relative" }}>
              {on && <div style={{ position: "absolute", left: "50%", top: "38%", width: 46, height: 46, marginLeft: -23, marginTop: -23, borderRadius: "50%", background: "#3b2a1a",
                boxShadow: "inset 0 5px 8px #000, 0 0 0 2px rgba(255,255,255,.4)", transform: `scale(${0.3 + 0.7 * k})` }} />}
              {on && <div style={{ position: "absolute", bottom: 0, width: "100%", textAlign: "center", fontFamily: HAND, fontSize: 40, color: "#1d2a4a", opacity: k }}>$1</div>}
            </div>;
          })}
        </div>
        {sello > 0.01 && <div style={{ position: "absolute", left: "50%", top: "55%", transform: `translate(-50%,-50%) rotate(-12deg) scale(${1.9 - 0.9 * Math.min(1, sello)})`, opacity: Math.min(1, sello * 1.6),
          border: "12px solid #b3261e", borderRadius: 18, padding: "0 46px", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 190, letterSpacing: 20, color: "#b3261e",
          mixBlendMode: "multiply", boxShadow: sello < 0.9 ? `0 ${60 * (1 - sello)}px ${80 * (1 - sello)}px rgba(0,0,0,.35)` : undefined }}>PAID</div>}
      </div>
    </div>
    {n < 30 && <Img src={kit("k_perforadora.png")} style={{ position: "absolute", left: 1180, top: -60 + 110 * pr - (1 - ent) * 700, width: 600, height: 600,
      transform: `rotate(${-28 + 6 * pr}deg)`, filter: "drop-shadow(20px 40px 26px rgba(20,10,4,.55))" }} />}
  </Placa>;
};

// ---------- HALLORAN: tres sombrereras caen y se apilan en el mostrador mientras el reloj corre 15 minutos; la boleta sale de la caja ----------
export const HalloranFX: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow0 = f.wow!;
  const A = Math.max(a, f.va ?? a), caidas = [A + 0.15, A + 0.55, A + 0.95].map((x) => Math.min(1.04, spr(t, x, 1)));
  const slip = e(t, Math.min(A + 1.3, wow0 - 0.5), Math.min(A + 2.1, wow0 + 0.3)), wow = Math.max(wow0, A + 2.2), sello = spr(t, wow, 1);
  const min = 15 * e(t, A, wow), tic = Math.floor(min * 4) / 4;
  const W = 560, X = 640, base = 800;   // pila: cada caja (recorte 1024, cuerpo 177..840 x 256..845) se apoya en la de abajo
  return <Placa t={t} a={A} b={b} src="w_mostrador.jpg" ox={40} oy={60} z={1.12}>
    {[0, 1, 2].map((i) => {
      const s = W * (1 - 0.1 * i), h = (1 - caidas[i]) * 1000, y = base - i * 0.42 * W - (845 / 1024) * s;
      return <React.Fragment key={i}>
        {i === 0 && <Sombra x={X} y={base} w={0.7 * W} h={h} />}
        <Img src={kit("k_sombrerera.png")} style={{ position: "absolute", left: X - 0.5 * s - ((508 - 512) / 1024) * s, top: y - h, width: s, height: s,
          transform: `rotate(${(i - 1) * 2.5}deg)`, filter: `drop-shadow(0 14px 14px rgba(20,10,4,.5)) hue-rotate(${[0, 150, 70][i]}deg) saturate(${[1, 0.7, 0.8][i]})` }} />
      </React.Fragment>;
    })}
    <svg style={{ position: "absolute", left: 1000, top: 70, filter: "drop-shadow(0 20px 24px rgba(0,0,0,.55))" }} width={340} height={340} viewBox="-170 -170 340 340">
      <defs><radialGradient id="hb" cx="35%" cy="30%"><stop offset="0" stopColor="#8a5a34" /><stop offset="1" stopColor="#3a2414" /></radialGradient>
        <radialGradient id="hv" cx="40%" cy="30%"><stop offset="0" stopColor="rgba(255,255,255,.35)" /><stop offset=".5" stopColor="rgba(255,255,255,0)" /></radialGradient></defs>
      <circle r={160} fill="url(#hb)" /><circle r={138} fill="#f3ead6" />
      {Array.from({ length: 60 }, (_, i) => <line key={i} x1={0} y1={-130} x2={0} y2={i % 5 ? -122 : -110} stroke="#3a2e22" strokeWidth={i % 5 ? 2 : 5} transform={`rotate(${i * 6})`} />)}
      <path d={`M0 0 L0 -118 A118 118 0 0 1 ${118 * Math.sin((tic / 60) * 2 * Math.PI)} ${-118 * Math.cos((tic / 60) * 2 * Math.PI)} Z`} fill="rgba(179,38,30,.45)" />
      <line x1={0} y1={14} x2={0} y2={-118} stroke="#2a2116" strokeWidth={5} strokeLinecap="round" transform={`rotate(${tic * 6})`} />
      <line x1={0} y1={10} x2={0} y2={-72} stroke="#2a2116" strokeWidth={9} strokeLinecap="round" transform={`rotate(${330 + tic / 2})`} />
      <circle r={9} fill="#2a2116" /><circle r={138} fill="url(#hv)" />
    </svg>
    {/* la boleta sale de la caja registradora (derecha) como cinta de papel */}
    <div style={{ position: "absolute", left: 1380, top: 300, width: 440, height: 520, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 520 - 520 * slip, width: 440, height: 520, transform: "rotate(2deg)", background: "linear-gradient(#fbf8f0,#ece3cf)",
        boxShadow: "0 30px 50px rgba(0,0,0,.5)", padding: "30px 34px", color: "#2a2116", boxSizing: "border-box" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 26, letterSpacing: 6, color: "#6d5a40" }}>HATS · 1956</div>
        <div style={{ fontFamily: HAND, fontSize: 88, color: "#1d2a4a", lineHeight: "110px" }}>3 × $12</div>
        <div style={{ fontFamily: HAND, fontSize: 88, color: "#1d2a4a", lineHeight: "100px" }}>= $36</div>
        <div style={{ height: 2, background: "rgba(80,60,40,.35)", margin: "12px 0" }} />
        <div style={{ fontFamily: "Georgia, serif", fontSize: 26, letterSpacing: 6, color: "#8a3a2e" }}>TODAY</div>
      </div>
    </div>
    {sello > 0.01 && <div style={{ position: "absolute", left: 1600, top: 760, transform: `translate(-50%,-50%) rotate(-8deg) scale(${2.6 - 1.6 * Math.min(1, sello)})`, opacity: Math.min(1, sello * 1.6),
      border: "10px solid #b3261e", borderRadius: 14, padding: "0 26px", fontFamily: "Georgia, serif", fontWeight: 900, fontSize: 130, color: "#b3261e", background: "rgba(251,248,240,.85)" }}>$440</div>}
  </Placa>;
};

// ---------- PUERTA: el vestido al sol en la puerta deja pasar la luz; con la enagua adentro, ya no ----------
export const PuertaFX: React.FC<{ t: number; f: Fi }> = ({ t, f }) => {
  const { a, b } = f, wow = f.wow!;
  const w = e(t, wow + 0.3, wow + 1.4), sc = 1.04 + 0.6 * e(t, a, wow + 1.6), out = e(t, b - 0.3, b);   // se arrima al vestido mientras pasa la luz
  const im = (k: string) => staticFile(`wl01a/hilo/${k}.jpg`);
  return <AbsoluteFill style={{ background: "#0b0907", overflow: "hidden", opacity: 1 - out }}>
    <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: "46% 36%" }}>
      <Img src={im("puerta_a")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
      <Img src={im("puerta_b")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", WebkitMaskImage: `linear-gradient(to bottom, #000 ${130 * w - 22}%, transparent ${130 * w + 8}%)` }} />
    </AbsoluteFill>
    {/* un haz de sol ancho, con polvo, que baja y "pinta" el vestido de opaco */}
    {w > 0 && w < 1 && <div style={{ position: "absolute", left: 0, right: 0, top: `${130 * w - 22}%`, height: "30%", background: "linear-gradient(to bottom, transparent, rgba(255,232,190,.32) 50%, transparent)", mixBlendMode: "screen" }}>
      {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: `${(i * 37) % 100}%`, top: `${(i * 53 + t * 9 * (1 + (i % 3))) % 100}%`, width: 3 + (i % 3), height: 3 + (i % 3), borderRadius: "50%", background: "rgba(255,245,220,.8)" }} />)}
    </div>}
  </AbsoluteFill>;
};
