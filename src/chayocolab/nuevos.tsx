// chayocolab · piezas NUEVAS de este video (frijoles de olla + Claudio): página real del libro, hervor, frijol nuevo/viejo, remojo,
// tetera, soplar al frijol, hoja de aguacate, ayer/hoy, una olla = 7 comidas. Mismo estilo del kit (barro/maíz/crema, serif + letra a mano, 2.5D con canto).
import React from "react";
import { Img, staticFile } from "remotion";
import { CH, FONT, HAND, P, SERIF, e, ei, extrude, spr } from "./lib";

type B = { t: number; at: number; out: number };
const op = (t: number, at: number, out: number) => e(t, at, at + 0.18) * (1 - e(t, out, out + 0.3));
const panel: React.CSSProperties = { background: "linear-gradient(180deg, rgba(42,18,12,.92), rgba(24,10,6,.92))", borderRadius: 18, boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.12)", border: `3px solid ${CH.barro}` };
// un frijol bayo en SVG: lisito y con brillo (nuevo) o opaco, arrugado y con polvito (viejo)
const Frijol: React.FC<{ nuevo: boolean; sz: number; shine?: number; rot?: number; burst?: number }> = ({ nuevo, sz, shine = 0, rot = 0, burst = 0 }) => (
  <svg width={sz} height={sz * 0.7} viewBox="0 0 100 70" style={{ transform: `rotate(${rot}deg)`, overflow: "visible" }}>
    <defs><radialGradient id={nuevo ? "fjn" : "fjv"} cx="40%" cy="35%" r="70%"><stop offset="0" stopColor={nuevo ? "#e9b77e" : "#a88968"} /><stop offset="1" stopColor={nuevo ? "#8a4f26" : "#6b5440"} /></radialGradient></defs>
    <path d="M10 38 Q8 8 48 8 Q92 8 92 36 Q92 62 52 62 Q44 62 42 52 Q38 44 26 56 Q12 62 10 38 Z" fill={`url(#${nuevo ? "fjn" : "fjv"})`} stroke="#3a1c10" strokeWidth={2} />
    {nuevo ? <ellipse cx={42} cy={22} rx={18 + 10 * shine} ry={5} fill="#fff" opacity={0.35 + 0.5 * shine} />
      : <><path d="M22 30 Q34 26 40 34 M52 20 Q62 30 74 24 M58 44 Q68 40 80 46" stroke="#4a3626" strokeWidth={2} fill="none" opacity={0.8} />
        {[18, 30, 64, 76, 46].map((x, i) => <circle key={i} cx={x} cy={18 + (i * 11) % 30} r={1.6} fill="#d8cbb4" opacity={0.8} />)}</>}
    {burst > 0 && <path d={`M30 14 Q48 ${2 - 14 * burst} 70 14`} stroke="#f4dcc0" strokeWidth={4} fill="none" opacity={burst} />}
  </svg>
);

// la PÁGINA REAL del libro (render del PDF) que se levanta del recetario con su canto, un marcatextos barre el título y una etiqueta dice la página
export const PaginaReal: React.FC<B & { x: number; y: number; src: string; pag: string; libro: string; hl?: number; w?: number; rot?: number }> = ({ t, at, out, x, y, src, pag, libro, hl, w = 560, rot = -4 }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = Math.min(1.06, spr(t, at, 0.8)), h = w * 1.294;
  const sweep = hl === undefined ? 0 : ei(t, hl, hl + 0.7);
  return (
    <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, perspective: 1600, opacity: o }}>
      <div style={{ width: w, height: h, transformOrigin: "50% 100%", transform: `rotateX(${(1 - Math.min(1, k)) * 75 + 8}deg) rotateZ(${rot + Math.sin((t - at) * 0.6) * 0.8}deg) translateZ(${(1 - Math.min(1, k)) * -300}px)`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", inset: 0, background: "#f4ecd8", borderRadius: 6, boxShadow: "0 50px 90px rgba(0,0,0,.65), 0 0 0 1px rgba(0,0,0,.2)", overflow: "hidden" }}>
          <Img src={staticFile(P + src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", left: 0, top: 0, width: 26, bottom: 0, background: "linear-gradient(90deg, rgba(0,0,0,.25), transparent)" }} />
          {hl !== undefined && <div style={{ position: "absolute", left: "6%", top: "15.5%", height: "7%", width: `${88 * sweep}%`, background: "rgba(255,214,64,.42)", mixBlendMode: "multiply", borderRadius: 4 }} />}
        </div>
        <div style={{ position: "absolute", right: -40, top: -46, transform: `rotate(6deg) scale(${Math.min(1, spr(t, at + 0.4))})`, background: CH.guinda, color: CH.crema, fontFamily: FONT, fontWeight: 900, fontSize: 40, padding: "12px 24px", borderRadius: 10, boxShadow: "0 18px 30px rgba(0,0,0,.55)", whiteSpace: "nowrap", letterSpacing: 2 }}>{pag}</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: -74, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 50, color: CH.maiz, textShadow: "0 3px 12px #000" }}>{libro}</div>
      </div>
    </div>
  );
};

// hervor: la olla vista de lado con burbujas; "tiembla" (pocas, en una orilla) contra "borbotones" (muchas, turbio)
export const Hervor: React.FC<B & { x: number; y: number; fuerte: number; label: string }> = ({ t, at, out, x, y, fuerte, label }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const n = Math.round(4 + 26 * fuerte), turb = 0.15 + 0.6 * fuerte;
  return (
    <div style={{ position: "absolute", left: x - 230, top: y - 210, width: 460, opacity: o, transform: `scale(${0.8 + 0.2 * Math.min(1, spr(t, at))})` }}>
      <svg width={460} height={360} viewBox="0 0 460 360">
        <defs><linearGradient id="hvf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={`rgba(120,62,30,${1 - turb * 0.3})`} /><stop offset="1" stopColor={`rgba(${70 - 20 * fuerte},${34 - 10 * fuerte},16,1)`} /></linearGradient></defs>
        <path d="M60 90 L400 90 L370 320 Q230 350 90 320 Z" fill="#6b3a22" stroke="#2a120c" strokeWidth={8} />
        <path d="M74 112 L386 112 L362 305 Q230 332 98 305 Z" fill="url(#hvf)" />
        <rect x={74} y={112} width={312} height={200} fill={`rgba(190,170,150,${turb * 0.45})`} />
        {Array.from({ length: n }, (_, i) => {
          const side = fuerte < 0.4 ? 0.82 + 0.12 * ((i * 37) % 10) / 10 : ((i * 53) % 100) / 100;
          const ph = ((t * (0.7 + fuerte * 1.6) + i * 0.37) % 1);
          const bx = 95 + side * 270, by = 300 - ph * 190, r = 4 + ((i * 7) % 5) * (1 + fuerte);
          return <circle key={i} cx={bx + Math.sin(ph * 9 + i) * 4} cy={by} r={r} fill="none" stroke="rgba(255,250,235,.85)" strokeWidth={2.5} opacity={1 - ph * 0.6} />;
        })}
        <ellipse cx={230} cy={90} rx={170} ry={16} fill="#3a1c10" />
      </svg>
      <div style={{ textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: fuerte > 0.5 ? "#ff7a5c" : CH.maiz, textShadow: extrude(4, "#000"), marginTop: -8 }}>{label}</div>
    </div>
  );
};


// frijol NUEVO contra VIEJO: dos frijoles grandes en su charola, al nuevo le corre un brillo, al viejo se le notan las arrugas y el polvito
export const NuevoViejo: React.FC<B & { x: number; y: number; viejoAt: number }> = ({ t, at, out, x, y, viejoAt }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const sh = (Math.sin((t - at) * 2.4) + 1) / 2, kv = Math.min(1.08, spr(t, viejoAt));
  const lado = (nuevo: boolean, k: number, title: string, sub: string, c: string) => (
    <div style={{ textAlign: "center", width: 360, transform: `translateY(${(1 - Math.min(1, k)) * 80}px) scale(${0.8 + 0.2 * Math.min(1, k)})`, opacity: Math.min(1, k * 2) }}>
      <Frijol nuevo={nuevo} sz={250} shine={nuevo ? sh : 0} rot={nuevo ? -8 : 10} />
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 50, color: c, textShadow: extrude(4, "#000"), marginTop: 6 }}>{title}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: CH.crema, textShadow: "0 2px 8px #000" }}>{sub}</div>
    </div>);
  return (
    <div style={{ position: "absolute", left: x - 400, top: y - 220, width: 800, padding: "30px 20px", display: "flex", justifyContent: "space-between", opacity: o, ...panel }}>
      {lado(true, spr(t, at), "NUEVO", "brilla, lisito, parejo", CH.maiz)}
      {lado(false, kv, "VIEJO", "opaco, arrugado, con polvo", "#c9c2b6")}
    </div>
  );
};

// el remojo: la jícara de lado, el agua llega al DOBLE de los frijoles, pasan 8 horas y los frijoles se ponen gorditos
export const Remojo: React.FC<B & { x: number; y: number; nocheAt: number }> = ({ t, at, out, x, y, nocheAt }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const agua = ei(t, at + 0.2, at + 1.4), crece = ei(t, nocheAt, nocheAt + 1.6), hrs = Math.round(8 * crece);
  return (
    <div style={{ position: "absolute", left: x - 260, top: y - 240, width: 520, opacity: o, textAlign: "center" }}>
      <svg width={560} height={360} viewBox="0 0 560 360">
        <path d="M40 80 L480 80 Q470 330 260 340 Q50 330 40 80 Z" fill="#8a4a2a" stroke="#2a120c" strokeWidth={8} />
        <clipPath id="rmj"><path d="M54 92 L466 92 Q456 318 260 326 Q64 318 54 92 Z" /></clipPath>
        <g clipPath="url(#rmj)">
          <rect x={0} y={326 - 230 * agua} width={520} height={240} fill="rgba(150,190,210,.55)" />
          {Array.from({ length: 26 }, (_, i) => { const cx = 90 + ((i * 47) % 340), cy = 300 - ((i * 29) % 3) * 24 - Math.floor(i / 9) * 26 * (1 + 0.5 * crece); const r = 15 * (1 + 0.45 * crece);
            return <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.68} fill="#b8794a" stroke="#4a2614" strokeWidth={2} />; })}
        </g>
        <line x1={490} y1={326} x2={490} y2={326 - 230 * agua} stroke={CH.maiz} strokeWidth={5} />
        <text x={500} y={326 - 230 * agua + 10} fill={CH.maiz} fontFamily={FONT} fontWeight={900} fontSize={30} opacity={agua}>×2</text>
      </svg>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: CH.maiz, textShadow: extrude(4, "#000") }}>{crece > 0.02 ? `${hrs} HORAS · GORDITOS` : "AGUA FRÍA, EL DOBLE"}</div>
    </div>
  );
};

// la tetera: el agua FRÍA a la mitad asusta al frijol (tachada), la caliente de la tetera sí
export const Tetera: React.FC<B & { x: number; y: number; okAt: number }> = ({ t, at, out, x, y, okAt }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const tach = ei(t, at + 0.6, at + 1.0), ok = Math.min(1.1, spr(t, okAt)), sus = Math.max(0, 1 - e(t, okAt, okAt + 0.5)) * Math.sin(t * 40) * 3 * e(t, at + 0.3, at + 0.6);
  const caja = (c: string, title: string, sub: string, k: number, mark: React.ReactNode) => (
    <div style={{ width: 380, padding: "26px 20px", ...panel, borderColor: c, transform: `scale(${0.85 + 0.15 * Math.min(1, k)})`, opacity: Math.min(1, k * 2), position: "relative" }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 52, color: c, textShadow: extrude(3, "#000") }}>{title}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 40, color: CH.crema, marginTop: 6 }}>{sub}</div>{mark}
    </div>);
  return (
    <div style={{ position: "absolute", left: x - 410, top: y - 120, width: 820, display: "flex", justifyContent: "space-between", textAlign: "center", opacity: o }}>
      {caja("#8fd6ff", "AGUA FRÍA", "el frijol se asusta", spr(t, at), <>
        <div style={{ position: "absolute", left: 30, right: 30, top: "50%", height: 10, background: "#e8452c", borderRadius: 5, transform: `rotate(-12deg) scaleX(${tach})` }} />
        <div style={{ position: "absolute", right: 16, top: -40, transform: `translateX(${sus}px)` }}><Frijol nuevo sz={90} /></div></>)}
      {caja(CH.maiz, "DE LA TETERA", "calientita, siempre", ok, <div style={{ position: "absolute", right: -18, top: -30, fontSize: 70, color: "#7fdc6a", fontFamily: FONT, fontWeight: 900, transform: `scale(${Math.min(1, ok)})` }}>✓</div>)}
    </div>
  );
};

// soplar al frijol: cinco frijoles en la cuchara; al soplido la cáscara se levanta solita
export const Soplar: React.FC<B & { x: number; y: number; soploAt: number }> = ({ t, at, out, x, y, soploAt }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const s1 = e(t, soploAt, soploAt + 0.9);
  return (
    <div style={{ position: "absolute", left: x - 330, top: y - 170, width: 660, opacity: o, textAlign: "center" }}>
      <div style={{ position: "relative", height: 230 }}>
        <div style={{ position: "absolute", left: 60, right: 60, top: 70, height: 140, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 40%, #c89058 0 55%, #8a5a30 57% 70%, #5a361c 72%)", boxShadow: "0 24px 40px rgba(0,0,0,.6)" }} />
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 120 + i * 84, top: 92 + (i % 2) * 22, transform: `scale(${Math.min(1, spr(t, at + i * 0.08))})` }}><Frijol nuevo sz={92} rot={(i - 2) * 12} burst={e(t, soploAt + 0.25 + i * 0.1, soploAt + 0.7 + i * 0.1)} /></div>)}
        {s1 > 0 && s1 < 1 && [0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: -40 + 600 * s1, top: 60 + i * 40, width: 120, height: 6, borderRadius: 3, background: "rgba(255,255,255,.55)", opacity: 1 - s1 }} />)}
      </div>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 50, color: CH.maiz, textShadow: extrude(4, "#000") }}>{s1 > 0.5 ? "SE LEVANTA SOLITA = YA ESTÁN" : "5 FRIJOLES Y LES SOPLAS"}</div>
    </div>
  );
};

// la hoja de aguacate de Claudio: la hoja se tuesta (se oscurece y se riza) y suelta su "anís"
export const Hoja: React.FC<B & { x: number; y: number; tuesta: number }> = ({ t, at, out, x, y, tuesta }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const k = ei(t, tuesta, tuesta + 1.4), g = `rgb(${Math.round(60 - 20 * k)},${Math.round(120 - 60 * k)},${Math.round(50 - 20 * k)})`;
  return (
    <div style={{ position: "absolute", left: x - 260, top: y - 200, width: 520, opacity: o, textAlign: "center", transform: `scale(${0.8 + 0.2 * Math.min(1, spr(t, at))})` }}>
      <svg width={520} height={280} viewBox="0 0 520 280">
        <ellipse cx={260} cy={220} rx={230} ry={48} fill="#1e1612" stroke="#000" strokeWidth={4} />
        <g transform={`translate(260 170) rotate(-18) scale(1 ${1 - 0.15 * k})`}>
          <path d="M-190 0 Q-60 -90 150 -14 Q180 0 150 14 Q-60 90 -190 0 Z" fill={g} stroke="#1c2a10" strokeWidth={4} />
          <path d="M-190 0 L170 0" stroke="#c9d89a" strokeWidth={3} opacity={0.7} />
          {[-120, -60, 0, 60, 110].map((px, i) => <path key={i} d={`M${px} 0 Q${px + 20} -30 ${px + 50} -40 M${px} 0 Q${px + 20} 30 ${px + 50} 40`} stroke="#c9d89a" strokeWidth={2} fill="none" opacity={0.5} />)}
        </g>
        {k > 0.2 && [0, 1, 2, 3].map((i) => { const ph = ((t * 0.5 + i * 0.25) % 1); return <path key={i} d={`M${200 + i * 40} ${150 - ph * 120} q 12 -16 0 -32 q -12 -16 0 -32`} stroke="rgba(255,240,220,.55)" strokeWidth={4} fill="none" opacity={(1 - ph) * k} />; })}
      </svg>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 48, color: "#a8d24a", textShadow: extrude(4, "#000") }}>1 HOJA = TODA LA OLLA</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 42, color: CH.crema, opacity: k, textShadow: "0 2px 8px #000" }}>saborcito como a anís</div>
    </div>
  );
};

// ayer / hoy: dos hojas de calendario; la de AYER se cuece, la de HOY se sirve y "sabe el doble"
export const AyerHoy: React.FC<B & { x: number; y: number; hoyAt: number }> = ({ t, at, out, x, y, hoyAt }) => {
  const o = op(t, at, out); if (o <= 0.01) return null;
  const hoja = (dia: string, txt: string, k: number, c: string, rot: number) => (
    <div style={{ width: 300, background: CH.papel, borderRadius: 10, overflow: "hidden", boxShadow: "0 30px 50px rgba(0,0,0,.6)", transform: `rotate(${rot}deg) translateY(${(1 - Math.min(1, k)) * -140}px)`, opacity: Math.min(1, k * 2) }}>
      <div style={{ background: c, color: "#fff", fontFamily: FONT, fontWeight: 900, fontSize: 44, padding: "12px 0", letterSpacing: 4 }}>{dia}</div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: CH.tinta, padding: "26px 10px 30px" }}>{txt}</div>
    </div>);
  const x2 = Math.min(1.1, spr(t, hoyAt + 0.9));
  return (
    <div style={{ position: "absolute", left: x - 360, top: y - 160, width: 720, display: "flex", justifyContent: "space-between", textAlign: "center", opacity: o }}>
      {hoja("AYER", "se cuece y reposa", spr(t, at), CH.barro, -4)}
      {hoja("HOY", "se sirve", spr(t, hoyAt), CH.guinda, 3)}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: -110, fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: CH.maiz, textShadow: extrude(5, "#000"), transform: `scale(${Math.min(1, x2)})` }}>SABE EL DOBLE</div>
    </div>
  );
};

// una olla, siete comidas: la olla al centro y los platos le salen alrededor, cada uno con su nombre
export const SieteComidas: React.FC<{ t: number; out: number; x: number; y: number; rows: { at: number; label: string }[] }> = ({ t, out, x, y, rows }) => {
  const o = 1 - e(t, out, out + 0.3), k0 = rows.length ? Math.min(1, spr(t, rows[0].at - 0.4)) : 0; if (o <= 0.01 || k0 <= 0) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o }}>
      <div style={{ position: "absolute", left: -90, top: -70, width: 180, height: 140, borderRadius: "40% 40% 50% 50%", background: "radial-gradient(ellipse at 50% 30%, #5a2c16 0 40%, #2a120c 42% 50%, #6b3a22 52%)", boxShadow: "0 30px 50px rgba(0,0,0,.6)", transform: `scale(${k0})` }} />
      {rows.map((r, i) => { const ang = (-90 + (360 / rows.length) * i) * Math.PI / 180, k = Math.min(1.1, spr(t, r.at)), R = 300 * Math.min(1, k);
        return k > 0 ? <div key={i} style={{ position: "absolute", left: Math.cos(ang) * R * 1.35, top: Math.sin(ang) * R, transform: `translate(-50%,-50%) scale(${Math.min(1, k)})`, background: CH.crema, color: CH.tinta, fontFamily: FONT, fontWeight: 900, fontSize: 32, padding: "10px 18px", borderRadius: 12, whiteSpace: "nowrap", boxShadow: "0 14px 24px rgba(0,0,0,.5)", border: `3px solid ${CH.barro}` }}>{r.label}</div> : null; })}
    </div>
  );
};
