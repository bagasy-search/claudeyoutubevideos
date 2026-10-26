// plo30taza · piezas 2D NUEVAS del video del inodoro (las genéricas vienen de rest2d.tsx / lib.tsx).
// QR de la guía con su página real, termómetro 20→60 °C con la raya roja del hervor, los dos frascos (papel vs toallita),
// la cuenta de la visita contra el pack, el sello, y la cuenta de litros del tanque.
import React from "react";
import { Img, staticFile } from "remotion";
import { COL, FONT, P, e, ei, extrude, spr } from "./lib";

const pop = (t: number, at: number, out: number, sp = 1) => ({ k: Math.min(1.1, spr(t, at, sp)), o: e(t, at, at + 0.12) * (1 - e(t, out, out + 0.3)) });
const K = (k: number) => Math.min(1, k);
const dark: React.CSSProperties = { background: "linear-gradient(180deg, rgba(22,30,44,.96), rgba(10,15,24,.96))", boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.15)", borderRadius: 24, fontFamily: FONT };

// EL QR: tarjeta con la página real a la izquierda y el código grande (se lee desde el teléfono); nunca la URL escrita
export const QRCard: React.FC<{ t: number; at: number; out: number; page: string; name: string; pg: string; x?: number; y?: number }> = ({ t, at, out, page, name, pg, x = 1380, y = 560 }) => {
  const { k, o } = pop(t, at, out, 0.8); if (o < 0.01) return null;
  return (
    <div style={{ ...dark, position: "absolute", left: x, top: y, opacity: o, padding: 26, transform: `translate(-50%,-50%) perspective(1500px) rotateY(${(1 - K(k)) * -70 - 4}deg) scale(${0.75 + 0.25 * K(k)})`, display: "flex", gap: 26, alignItems: "center" }}>
      <Img src={staticFile(P + page + ".jpg")} style={{ width: 300, height: 424, objectFit: "cover", borderRadius: 8, boxShadow: "0 20px 40px rgba(0,0,0,.6)" }} />
      <div style={{ width: 400, textAlign: "center" }}>
        <div style={{ fontWeight: 900, fontSize: 34, color: COL.amber, letterSpacing: 2 }}>{name}</div>
        <div style={{ fontWeight: 800, fontSize: 28, color: COL.dim, marginBottom: 12 }}>{pg}</div>
        <div style={{ background: "#fff", borderRadius: 16, padding: 14, display: "inline-block" }}><Img src={staticFile(P + "qr.png")} style={{ width: 300, height: 300, display: "block" }} /></div>
        <div style={{ fontWeight: 900, fontSize: 30, color: "#fff", marginTop: 12 }}>📱 ESCANEA CON LA CÁMARA</div>
        <div style={{ fontWeight: 700, fontSize: 22, color: COL.dim, marginTop: 6 }}>o el link en la 1ª línea de la descripción</div>
      </div>
    </div>
  );
};

// termómetro de 20 a 60 °C, con la raya roja de 100 °C tachada ("NO HIERVE")
export const HotThermo: React.FC<{ t: number; at: number; out: number; x: number; y: number; to?: number }> = ({ t, at, out, x, y, to = 60 }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const v = 20 + (to - 20) * ei(t, at + 0.2, at + 1.8), f = (v - 0) / 110;
  const col = v > 90 ? COL.red : v > 50 ? "#ff9f43" : "#6fc3ff";
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * K(k)}) perspective(1000px) rotateY(-14deg)`, display: "flex", alignItems: "flex-end", gap: 26 }}>
      <div style={{ position: "relative", width: 70, height: 520 }}>
        <div style={{ position: "absolute", left: 10, top: 0, width: 50, height: 470, borderRadius: 25, background: "linear-gradient(90deg, rgba(255,255,255,.35), rgba(255,255,255,.08) 40%, rgba(255,255,255,.3))", boxShadow: "inset 0 0 0 3px rgba(255,255,255,.7), 0 20px 40px rgba(0,0,0,.6)" }} />
        <div style={{ position: "absolute", left: 24, bottom: 56, width: 22, height: 420 * f, borderRadius: 11, background: col, boxShadow: `0 0 18px ${col}` }} />
        <div style={{ position: "absolute", left: 0, bottom: 0, width: 70, height: 70, borderRadius: 35, background: col, boxShadow: `0 0 30px ${col}` }} />
        <div style={{ position: "absolute", left: 66, bottom: 56 + 420 * (100 / 110) - 4, width: 90, height: 8, background: COL.red }} />
        <div style={{ position: "absolute", left: 160, bottom: 56 + 420 * (100 / 110) - 26, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: COL.red, whiteSpace: "nowrap" }}>100 °C ✗</div>
        <div style={{ position: "absolute", left: 66, bottom: 56 + 420 * (60 / 110) - 3, width: 50, height: 6, background: "#7dff9e" }} />
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 120, color: col, textShadow: extrude(9, "rgba(0,0,0,.6)"), marginBottom: 150 }}>{Math.round(v)} °C</div>
    </div>
  );
};

// los dos frascos: el papel se deshace (agua turbia), la toallita sigue entera
export const Jars: React.FC<{ t: number; at: number; shake: number; out: number }> = ({ t, at, shake, out }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const sh = t > shake && t < shake + 2.2 ? Math.sin(t * 40) * 14 : 0, dis = e(t, shake + 0.6, shake + 2.4);
  const jar = (label: string, paper: boolean) => (
    <div style={{ textAlign: "center" }}>
      <svg width={360} height={460} viewBox="0 0 360 460" style={{ transform: `translateX(${sh}px) rotate(${sh * 0.3}deg)`, filter: "drop-shadow(0 30px 40px rgba(0,0,0,.6))" }}>
        <rect x={60} y={20} width={240} height={40} rx={8} fill="#c9a35a" />
        <rect x={40} y={60} width={280} height={380} rx={40} fill="rgba(220,240,255,.18)" stroke="rgba(255,255,255,.75)" strokeWidth={5} />
        <rect x={46} y={150} width={268} height={284} rx={34} fill={paper ? `rgba(225,225,215,${0.25 + 0.5 * dis})` : "rgba(160,210,240,.35)"} />
        {paper ? Array.from({ length: 22 }, (_, i) => <rect key={i} x={70 + ((i * 53) % 220)} y={170 + ((i * 37) % 240)} width={18 - dis * 10} height={12 - dis * 6} fill="#fbfaf4" opacity={0.6 + 0.4 * dis} transform={`rotate(${i * 33} ${80 + ((i * 53) % 220)} ${176 + ((i * 37) % 240)})`} />)
          .slice(0, Math.round(4 + 18 * dis)).concat(dis < 0.9 ? [<rect key="sq" x={110} y={220} width={140 * (1 - dis)} height={140 * (1 - dis)} fill="#fbfaf4" />] : [])
          : <path d={`M100 ${250 + sh} q40 -50 80 0 t80 0 l0 120 q-40 30 -80 0 t-80 0 z`} fill="#fbfaf4" stroke="#d8d4c8" strokeWidth={3} />}
      </svg>
      <div style={{ ...dark, display: "inline-block", padding: "10px 26px", fontWeight: 900, fontSize: 40, color: paper ? "#7dff9e" : COL.red }}>{label}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 170, opacity: o, display: "flex", justifyContent: "center", gap: 160, transform: `scale(${0.7 + 0.3 * K(k)})` }}>
      {jar(dis > 0.6 ? "PAPEL · SE DESHACE ✓" : "PAPEL", true)}
      {jar(dis > 0.6 ? "TOALLITA · ENTERA ✗" : "TOALLITA", false)}
    </div>
  );
};

// la cuenta: una visita del plomero (de noche) contra el pack con 50 arreglos
export const PriceGuide: React.FC<{ t: number; at: number; gAt: number; out: number }> = ({ t, at, gAt, out }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const b1 = ei(t, at + 0.1, at + 1.0), g = ei(t, gAt, gAt + 0.7);
  const col = (h: number, c: string, label: string, val: string, w = 320) => <div style={{ textAlign: "center", fontFamily: FONT }}>
    <div style={{ fontWeight: 900, fontSize: 60, color: "#fff", textShadow: extrude(6, "#000"), marginBottom: 10 }}>{val}</div>
    <div style={{ width: w, height: h, borderRadius: "18px 18px 0 0", background: c, boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 2px 0 rgba(255,255,255,.3)", margin: "0 auto" }} />
    <div style={{ ...dark, borderRadius: 14, padding: "10px 18px", marginTop: 8, fontWeight: 900, fontSize: 32, color: COL.ink }}>{label}</div></div>;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 80, opacity: o, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 140, transform: `scale(${0.7 + 0.3 * K(k)})`, transformOrigin: "50% 100%" }}>
      {col(440 * b1, "linear-gradient(180deg,#e05a4a,#8f2a20)", "1 VISITA DEL PLOMERO", "1 arreglo")}
      {g > 0.01 && col(150 * g, "linear-gradient(180deg,#7dff9e,#1f8a4c)", "PLOMERÍA CASERA", "50 arreglos")}
    </div>
  );
};

// sello que cae girando
export const Stamp: React.FC<{ t: number; at: number; out: number; text: string; x: number; y: number; rot?: number; size?: number; col?: string }> = ({ t, at, out, text, x, y, rot = -9, size = 110, col = COL.red }) => {
  const k = spr(t, at, 1.3), o = e(t, at, at + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  const hw = (text.length * size * 0.84 + 80) / 2 * Math.cos(rot * Math.PI / 180) + 60;  // que el sello entero quede adentro del cuadro
  x = Math.max(hw, Math.min(1920 - hw, x));
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.4 - 1.4 * Math.min(1, k)})` }}>
      <div style={{ border: `10px solid ${col}`, borderRadius: 14, padding: "6px 30px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(20,0,0,.25)", boxShadow: `0 0 30px ${col}77`, textShadow: "0 4px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

// cuenta de litros: el tanque se vacía en la taza llena → "6-9 LITROS SIN SALIDA"
export const Liters: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const { k, o } = pop(t, at, out); if (o < 0.01) return null;
  const f = ei(t, at + 0.3, at + 2.6), n = (6 + 3 * f).toFixed(0);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.7 + 0.3 * K(k)})`, display: "flex", alignItems: "center", gap: 34 }}>
      <svg width={260} height={340} viewBox="0 0 260 340" style={{ filter: "drop-shadow(0 25px 40px rgba(0,0,0,.6))" }}>
        <rect x={20} y={20} width={220} height={300} rx={20} fill="rgba(12,18,28,.9)" stroke="#dfe4e8" strokeWidth={6} />
        <rect x={32} y={32 + 276 * f} width={196} height={276 * (1 - f)} rx={12} fill="#4fa8d8" />
      </svg>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 130, color: COL.ink, textShadow: extrude(10, "#0a2a40"), lineHeight: 1 }}>{n} L<div style={{ fontSize: 40, color: COL.red, letterSpacing: 3 }}>SIN SALIDA → AL PISO</div></div>
    </div>
  );
};

// las 3 descargas de Don Aurelio: tres círculos que se tildan
export const ThreeFlush: React.FC<{ t: number; ats: number[]; out: number; x?: number; y?: number }> = ({ t, ats, out, x = 960, y = 860 }) => {
  const o = e(t, ats[0] - 0.2, ats[0]) * (1 - e(t, out, out + 0.3)); if (o < 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 40 }}>
      {ats.map((a, i) => { const kk = K(spr(t, a)); return (
        <div key={i} style={{ ...dark, width: 220, height: 160, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `translateY(${(1 - kk) * 120}px)`, opacity: kk }}>
          <div style={{ fontWeight: 900, fontSize: 64, color: "#7dff9e" }}>✓</div>
          <div style={{ fontWeight: 900, fontSize: 30, color: COL.ink }}>DESCARGA {i + 1}</div>
        </div>); })}
    </div>
  );
};
