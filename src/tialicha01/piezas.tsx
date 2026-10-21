// tialicha01 · PIEZAS NUEVAS del resto del video (77 s → fin). Cada minuto trae las suyas, todas en el mismo estilo de noche de
// rancho del minuto 1 (lila, morado, maíz, papel, barro). Todas reciben t y sus tiempos clavados a la voz con at("frase").
import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT, HAND, SERIF, e, ei, extrude, spr } from "./lib";

export const LI = { lila: "#c9b3ea", morado: "#6b4a9a", noche: "#0b1328", maiz: "#f2c14e", crema: "#f6e7c8", tinta: "#2b1d3a", papel: "#efe0bf", barro: "#c2552d", rojo: "#e0503a", verde: "#7fbf5a", azul: "#8fb6ff" };
const SH = "0 30px 60px rgba(0,0,0,.55)";

// entrada con resorte + salida: devuelve [k (escala), o (opacidad)]
const ko = (t: number, a: number, out: number, sp = 1) => [Math.min(1.08, spr(t, a, sp)), e(t, a, a + 0.12) * (1 - e(t, out, out + 0.3))] as const;
const Pop: React.FC<{ t: number; at: number; out: number; x: number; y: number; rot?: number; from?: "up" | "down" | "left" | "right" | "pop"; children: React.ReactNode }> = ({ t, at, out, x, y, rot = 0, from = "pop", children }) => {
  const [k, o] = ko(t, at, out);
  if (o <= 0.01) return null;
  const d = 1 - Math.min(1, k);
  const tr = from === "pop" ? `scale(${k})` : from === "up" ? `translateY(${-260 * d}px)` : from === "down" ? `translateY(${260 * d}px)` : from === "left" ? `translateX(${-420 * d}px)` : `translateX(${420 * d}px)`;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) ${tr} rotate(${rot}deg)` }}>{children}</div>;
};
const Lbl: React.FC<{ s?: number; c?: string; f?: string; w?: number; ls?: number; children: React.ReactNode }> = ({ s = 40, c = LI.crema, f = FONT, w = 800, ls = 0, children }) =>
  <div style={{ fontFamily: f, fontWeight: w, fontSize: s, color: c, letterSpacing: ls, lineHeight: 1.08, whiteSpace: "nowrap" }}>{children}</div>;
const X: React.FC<{ t: number; at: number; size: number; col?: string }> = ({ t, at, size, col = LI.rojo }) => {
  const a = e(t, at, at + 0.18), b = e(t, at + 0.14, at + 0.32);
  if (a <= 0) return null;
  return <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", overflow: "visible" }}>
    <path d="M12 12 L88 88" stroke={col} strokeWidth={11} strokeLinecap="round" strokeDasharray={110} strokeDashoffset={110 * (1 - a)} />
    <path d="M88 12 L12 88" stroke={col} strokeWidth={11} strokeLinecap="round" strokeDasharray={110} strokeDashoffset={110 * (1 - b)} />
  </svg>;
};
const Check: React.FC<{ t: number; at: number; size?: number; col?: string }> = ({ t, at, size = 60, col = LI.verde }) => {
  const a = e(t, at, at + 0.3);
  return <svg width={size} height={size} viewBox="0 0 100 100"><circle cx={50} cy={50} r={44} fill="none" stroke={col} strokeWidth={8} opacity={a} /><path d="M28 52 L44 68 L74 34" fill="none" stroke={col} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={80} strokeDashoffset={80 * (1 - a)} /></svg>;
};

// vapor que barre la pantalla (costura entre dos tomas)
export const Vaho: React.FC<{ t: number; mid: number; w?: number }> = ({ t, mid, w = 0.38 }) => {
  const k = 1 - Math.min(1, Math.abs(t - mid) / w);
  if (k <= 0.01) return null;
  const blobs = Array.from({ length: 14 }, (_, i) => {
    const x = (i * 137) % 1920, y = 1100 - ((t - mid + w) / (2 * w)) * (900 + (i % 5) * 120) + (i % 3) * 140;
    return `radial-gradient(circle ${420 + (i % 4) * 120}px at ${x}px ${y}px, rgba(236,228,255,${0.7 * k}) 0%, rgba(236,228,255,0) 70%)`;
  });
  return <AbsoluteFill style={{ background: blobs.join(","), opacity: Math.min(1, k * 1.6), filter: "blur(18px)" }}><AbsoluteFill style={{ background: `rgba(238,232,252,${0.8 * Math.pow(k, 1.6)})` }} /></AbsoluteFill>;
};

// ===================== minuto 2 · quién es Licha, el rancho, la campanita =====================
// mapa de Michoacán que se dibuja solo + alfiler en Pátzcuaro
const MICH = "M40 120 L90 70 L150 60 L200 30 L260 40 L320 20 L380 50 L430 40 L470 90 L440 140 L470 190 L420 230 L360 250 L300 300 L230 290 L170 320 L120 280 L80 240 L50 190 Z";
export const MapaMich: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const d = ei(t, at, at + 1.1), pin = spr(t, at + 0.9, 1.2), o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)" }}>
    <svg width={620} height={460} viewBox="0 0 520 360" style={{ overflow: "visible", filter: "drop-shadow(0 20px 30px rgba(0,0,0,.6))" }}>
      <path d={MICH} fill={`rgba(201,179,234,${0.28 * d})`} stroke={LI.lila} strokeWidth={5} strokeLinejoin="round" strokeDasharray={1500} strokeDashoffset={1500 * (1 - d)} />
      <g transform={`translate(255 170) scale(${Math.min(1.1, pin)})`}><path d="M0 0 C -22 -30 -22 -58 0 -58 C 22 -58 22 -30 0 0 Z" fill={LI.rojo} stroke="#fff" strokeWidth={3} /><circle cx={0} cy={-40} r={8} fill="#fff" /></g>
    </svg>
    <div style={{ position: "absolute", left: 330, top: 150, opacity: e(t, at + 1.1, at + 1.4) }}><Lbl f={SERIF} s={56} w={900} c={LI.crema}>Pátzcuaro</Lbl><Lbl s={26} c={LI.lila} ls={5}>MICHOACÁN</Lbl></div>
  </div>;
};
// botón SUSCRÍBETE que se aprieta + la campanita que suena
export const Campanita: React.FC<{ t: number; at: number; bell: number; out: number; x: number; y: number }> = ({ t, at, bell, out, x, y }) => {
  const [k, o] = ko(t, at, out), press = e(t, at + 0.45, at + 0.55) * (1 - e(t, at + 0.55, at + 0.7)), done = t > at + 0.55;
  if (o <= 0.01) return null;
  const sw = t > bell ? Math.sin((t - bell) * 22) * 22 * Math.exp(-(t - bell) * 2.2) : 0, rays = e(t, bell, bell + 0.2) * (1 - e(t, bell + 1.2, bell + 1.6));
  const cx = 0.42 * Math.max(0, 1 - Math.abs(t - at - 0.35) * 4);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, display: "flex", alignItems: "center", gap: 36 }}>
    <div style={{ transform: `scale(${1 - 0.08 * press})`, padding: "22px 52px", borderRadius: 18, background: done ? "#3a3346" : "#d42a2a", boxShadow: SH, fontFamily: FONT, fontWeight: 900, fontSize: 54, color: "#fff", letterSpacing: 2 }}>{done ? "SUSCRITA ✓" : "SUSCRÍBETE"}</div>
    <div style={{ position: "relative", width: 130, height: 130 }}>
      <svg width={130} height={130} viewBox="0 0 100 100" style={{ transform: `rotate(${sw}deg)`, transformOrigin: "50% 10%" }}><path d="M50 10 C30 10 24 28 24 44 L24 62 L14 74 L86 74 L76 62 L76 44 C76 28 70 10 50 10 Z" fill={LI.maiz} stroke="#5a3a10" strokeWidth={4} /><circle cx={50} cy={82} r={8} fill={LI.maiz} stroke="#5a3a10" strokeWidth={4} /></svg>
      {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 65, top: 55, width: 150 + i * 50, height: 150 + i * 50, marginLeft: -(75 + i * 25), marginTop: -(75 + i * 25), borderRadius: "50%", border: `5px solid rgba(242,193,78,${rays * (0.8 - i * 0.22)})`, transform: `scale(${0.6 + 0.4 * e(t, bell + i * 0.12, bell + 0.6 + i * 0.12)})` }} />)}
    </div>
    {cx > 0 && <div style={{ position: "absolute", left: 250, top: 70, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,.9)", opacity: cx * 2, transform: `scale(${1 - press * 0.3})` }} />}
  </div>;
};

// ===================== minuto 3 · el sueño cambia, la culpa, 30 vs 60 =====================
// piedra "CULPA" que se levanta y se va volando
export const Culpa: React.FC<{ t: number; at: number; lift: number; out: number; x: number; y: number }> = ({ t, at, lift, out, x, y }) => {
  const [k, o] = ko(t, at, out), up = ei(t, lift, lift + 1.1);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x + 380 * up, top: y - 520 * up, opacity: o * (1 - up * 0.9), transform: `translate(-50%,-50%) scale(${k * (1 - 0.4 * up)}) rotate(${-6 + 28 * up}deg)` }}>
    <div style={{ padding: "34px 64px", borderRadius: "46% 54% 40% 60% / 55% 45% 55% 45%", background: "radial-gradient(circle at 35% 30%,#8a8296,#4a4256 70%)", boxShadow: SH, border: "4px solid #2b2533" }}><Lbl f={SERIF} s={92} w={900} c="#f0e9ff" ls={6}>CULPA</Lbl></div>
  </div>;
};
// hipnograma: el sueño a los 30 (hondo, parejo) y después de los 60 (ligerito, con despertares)
export const Hipnograma: React.FC<{ t: number; at: number; b: number; out: number; x: number; y: number }> = ({ t, at, b, out, x, y }) => {
  const [k, o] = ko(t, at, out), da = ei(t, at + 0.2, at + 1.4), db = ei(t, b, b + 1.8);
  if (o <= 0.01) return null;
  const young = "M0 20 L60 20 L80 120 L180 120 L200 60 L260 60 L280 125 L380 125 L400 50 L480 50 L500 110 L600 110 L620 30 L700 30";
  const old = "M0 20 L60 20 L80 80 L140 80 L150 0 L165 0 L175 70 L260 70 L270 0 L285 0 L295 75 L380 75 L390 0 L405 0 L415 65 L500 65 L510 0 L525 0 L535 60 L620 60 L630 0 L700 0";
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, padding: "26px 34px", borderRadius: 22, background: "rgba(14,18,40,.84)", border: `3px solid ${LI.lila}`, boxShadow: SH }}>
    <Lbl s={30} c={LI.lila} ls={5}>EL SUEÑO EN LA NOCHE</Lbl>
    <svg width={900} height={330} viewBox="-20 -20 880 300" style={{ overflow: "visible", marginTop: 10 }}>
      <text x={-10} y={0} fill="#8fa0c8" fontSize={20} fontFamily={FONT}>despierta</text><text x={-10} y={135} fill="#8fa0c8" fontSize={20} fontFamily={FONT}>hondo</text>
      <path d={young} transform="translate(0 6)" fill="none" stroke={LI.azul} strokeWidth={6} strokeDasharray={1800} strokeDashoffset={1800 * (1 - da)} opacity={0.75} />
      <path d={old} transform="translate(0 150)" fill="none" stroke={LI.maiz} strokeWidth={6} strokeDasharray={2200} strokeDashoffset={2200 * (1 - db)} />
      <text x={720} y={40} fill={LI.azul} fontSize={26} fontWeight={800} fontFamily={FONT} opacity={da}>A LOS 30</text>
      <text x={720} y={200} fill={LI.maiz} fontSize={26} fontWeight={800} fontFamily={FONT} opacity={db}>A LOS 60</text>
    </svg>
  </div>;
};
// balanza: la cena pesa más
export const Balanza: React.FC<{ t: number; at: number; tip: number; out: number; x: number; y: number; l: string; r: string }> = ({ t, at, tip, out, x, y, l, r }) => {
  const [k, o] = ko(t, at, out), a = 14 * ei(t, tip, tip + 0.6) - 3 * Math.sin(Math.max(0, t - tip) * 8) * Math.exp(-Math.max(0, t - tip) * 3);
  if (o <= 0.01) return null;
  const pan = (lab: string, side: number) => <div style={{ position: "absolute", left: 300 + side * 250, top: 120 + side * a * 9, transform: "translate(-50%,0)", textAlign: "center" }}>
    <div style={{ width: 4, height: 70, background: LI.maiz, margin: "0 auto" }} /><div style={{ width: 230, height: 46, borderRadius: "0 0 120px 120px", background: "linear-gradient(#c9a24a,#8a6a20)", boxShadow: SH }} />
    <div style={{ marginTop: 14 }}><Lbl f={SERIF} s={44} w={900}>{lab}</Lbl></div></div>;
  return <div style={{ position: "absolute", left: x, top: y, width: 600, height: 420, opacity: o, transform: `translate(-50%,-50%) scale(${k})` }}>
    <div style={{ position: "absolute", left: 292, top: 110, width: 16, height: 300, background: "#8a6a20" }} />
    <div style={{ position: "absolute", left: 40, top: 112, width: 520, height: 12, borderRadius: 6, background: LI.maiz, transform: `rotate(${a}deg)` }} />
    {pan(l, -1)}{pan(r, 1)}
  </div>;
};
// tamales: tres a los 30, uno a los 60
const Tamal: React.FC<{ s?: number }> = ({ s = 1 }) => <svg width={110 * s} height={150 * s} viewBox="0 0 110 150"><path d="M20 20 Q55 -6 90 20 L100 130 Q55 150 10 130 Z" fill="#d9c08a" stroke="#8a6a30" strokeWidth={4} /><path d="M30 40 Q55 30 80 40 L84 118 Q55 128 26 118 Z" fill="#f2d98a" /><path d="M55 8 L55 140" stroke="#b89a5a" strokeWidth={3} /></svg>;
export const Tamales: React.FC<{ t: number; a: number; b: number; out: number }> = ({ t, a, b, out }) => {
  const oa = e(t, a, a + 0.15) * (1 - e(t, out, out + 0.3)), ob = e(t, b, b + 0.15) * (1 - e(t, out, out + 0.3));
  if (oa <= 0.01) return null;
  const panel = (x: number, o: number, a0: number, n: number, top: string, bottom: string, col: string) => <div style={{ position: "absolute", left: x, top: 560, opacity: o, transform: "translate(-50%,-50%)", padding: "24px 40px", borderRadius: 24, background: "rgba(14,18,40,.82)", border: `3px solid ${col}`, boxShadow: SH, textAlign: "center" }}>
    <Lbl f={SERIF} s={64} w={900} c={col}>{top}</Lbl>
    <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "16px 0" }}>{Array.from({ length: n }, (_, i) => <div key={i} style={{ transform: `scale(${Math.min(1.1, spr(t, a0 + 0.2 + i * 0.18, 1.3))})` }}><Tamal /></div>)}</div>
    <Lbl s={36} c={LI.crema}>{bottom}</Lbl></div>;
  return <AbsoluteFill>{panel(560, oa, a, 3, "A LOS 30", "a las 10 p.m. · dormías como bebé", LI.azul)}{panel(1360, ob, b, 1, "A LOS 60", "a las 10 p.m. · despierta a las 3", LI.maiz)}</AbsoluteFill>;
};

// ===================== minuto 4 · las tres reglas =====================
export const Reglas: React.FC<{ t: number; at: number; ats: number[]; labels: string[]; hl: number; out: number; x: number; y: number }> = ({ t, at, ats, labels, hl, out, x, y }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", gap: 18 }}>
    {["I", "II", "III"].map((r, i) => { const k = Math.min(1, spr(t, at + i * 0.2, 1.1)), l = e(t, ats[i], ats[i] + 0.3), on = hl === i;
      return <div key={i} style={{ display: "flex", alignItems: "center", gap: 24, width: 700, padding: "16px 26px", borderRadius: 14, background: on ? "linear-gradient(90deg,#8a4a20,#5a2e12)" : "linear-gradient(90deg,#5a3a22,#3a2414)", border: `3px solid ${on ? LI.maiz : "#7a5a3a"}`, boxShadow: SH, transform: `translateX(${(1 - k) * -500}px) scale(${on ? 1.06 : 1})`, opacity: k }}>
        <Lbl f={SERIF} s={70} w={900} c={LI.maiz}>{r}</Lbl>
        <div style={{ opacity: l, transform: `translateY(${(1 - l) * 20}px)` }}><Lbl f={HAND} s={66} w={700} c={LI.crema}>{labels[i]}</Lbl></div>
      </div>; })}
  </div>;
};
// reloj: de la cena (7) a la cama (10) — el arco de 2-3 horas
export const RelojArco: React.FC<{ t: number; at: number; arc: number; out: number; x: number; y: number }> = ({ t, at, arc, out, x, y }) => {
  const [k, o] = ko(t, at, out), a = ei(t, arc, arc + 1.2);
  if (o <= 0.01) return null;
  const pt = (h: number, r: number) => [Math.sin((h / 12) * Math.PI * 2) * r, -Math.cos((h / 12) * Math.PI * 2) * r];
  const [x0, y0] = pt(7, 118), [x1, y1] = pt(7 + 3 * a, 118), large = 3 * a > 6 ? 1 : 0;
  const hh = pt(7 + 3 * a, 60);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, textAlign: "center" }}>
    <svg width={340} height={340} viewBox="-170 -170 340 340"><circle r={150} fill={LI.crema} stroke="#5a3a22" strokeWidth={14} />
      {Array.from({ length: 12 }, (_, i) => { const [a1, b1] = pt(i, 128), [a2, b2] = pt(i, 142); return <line key={i} x1={a1} y1={b1} x2={a2} y2={b2} stroke="#3a2414" strokeWidth={6} />; })}
      {a > 0.01 && <path d={`M${x0} ${y0} A118 118 0 ${large} 1 ${x1} ${y1}`} fill="none" stroke={LI.morado} strokeWidth={22} strokeLinecap="round" opacity={0.85} />}
      <line x1={0} y1={0} x2={hh[0]} y2={hh[1]} stroke="#2b1d3a" strokeWidth={10} strokeLinecap="round" /><circle r={10} fill="#2b1d3a" />
      <text x={pt(7, 92)[0]} y={pt(7, 92)[1] + 10} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={30} fill={LI.barro}>7</text>
      <text x={pt(10, 92)[0]} y={pt(10, 92)[1] + 10} textAnchor="middle" fontFamily={SERIF} fontWeight={900} fontSize={30} fill={LI.morado}>10</text>
    </svg>
    <div style={{ marginTop: 8, opacity: a }}><Lbl f={SERIF} s={52} w={900} c={LI.maiz}>2 – 3 HORAS ANTES</Lbl></div>
  </div>;
};
// estómago lleno: se llena y la flecha sube (agruras)
export const Estomago: React.FC<{ t: number; at: number; up: number; out: number; x: number; y: number }> = ({ t, at, up, out, x, y }) => {
  const [k, o] = ko(t, at, out), fill = ei(t, at + 0.2, at + 1.3), ar = ei(t, up, up + 0.6);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})` }}>
    <svg width={360} height={420} viewBox="0 0 180 210" style={{ overflow: "visible" }}>
      <defs><clipPath id="stc"><path d="M70 10 L70 50 C40 60 20 100 40 140 C60 180 130 190 155 150 C175 115 150 80 110 80 C95 80 92 60 92 40 L92 10 Z" /></clipPath></defs>
      <g clipPath="url(#stc)"><rect x={0} y={210 - 170 * fill} width={180} height={210} fill={LI.barro} opacity={0.85} /></g>
      <path d="M70 10 L70 50 C40 60 20 100 40 140 C60 180 130 190 155 150 C175 115 150 80 110 80 C95 80 92 60 92 40 L92 10 Z" fill="none" stroke={LI.crema} strokeWidth={6} />
      <g opacity={ar} transform={`translate(81 ${30 - 60 * ar})`}><path d="M0 -40 L-22 -10 L-8 -10 L-8 30 L8 30 L8 -10 L22 -10 Z" fill={LI.rojo} /></g>
    </svg>
    <div style={{ textAlign: "center", opacity: fill }}><Lbl f={SERIF} s={46} w={900}>LLENO = SE REGRESA</Lbl></div>
  </div>;
};
// desayuna como rey · come como príncipe · cena como mendigo — tres platos que se achican
export const Platos3: React.FC<{ t: number; ats: number[]; out: number; y: number }> = ({ t, ats, out, y }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (t < ats[0] - 0.1 || o <= 0.01) return null;
  const L = [["REY", 300, "desayuna"], ["PRÍNCIPE", 220, "come"], ["MENDIGO", 130, "cena"]] as const;
  return <AbsoluteFill style={{ opacity: o }}>{L.map(([n, d, v], i) => { const k = Math.min(1.08, spr(t, ats[i], 1.1)); if (k <= 0.01) return null;
    return <div key={i} style={{ position: "absolute", left: 460 + i * 500, top: y, transform: `translate(-50%,-50%) scale(${k})`, textAlign: "center", padding: "16px 30px 10px", borderRadius: 28, background: "rgba(24,12,6,.66)", boxShadow: SH }}>
      <Lbl s={34} c={LI.lila} ls={4}>{v.toUpperCase()} COMO</Lbl>
      <div style={{ width: d, height: d * 0.42, margin: "18px auto", borderRadius: "50%", background: "radial-gradient(ellipse at 50% 40%,#f6e7c8 0 45%,#c2552d 47% 70%,#8a3a18 72%)", boxShadow: SH }} />
      <Lbl f={SERIF} s={i === 2 ? 76 : 60} w={900} c={i === 2 ? LI.maiz : LI.crema}>{n}</Lbl></div>; })}</AbsoluteFill>;
};
// medidor: helado · TIBIO · hirviendo (la aguja se queda en tibio)
export const Tibiometro: React.FC<{ t: number; at: number; stop: number; out: number; x: number; y: number }> = ({ t, at, stop, out, x, y }) => {
  const [k, o] = ko(t, at, out);
  if (o <= 0.01) return null;
  const swing = t < stop ? 0.5 + 0.48 * Math.sin((t - at) * 5) : 0.5 + 0.2 * Math.sin((t - stop) * 14) * Math.exp(-(t - stop) * 4);
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, width: 640 }}>
    <div style={{ height: 34, borderRadius: 17, background: "linear-gradient(90deg,#6fb6ff,#f2d98a 45%,#f2d98a 55%,#e0503a)", boxShadow: SH, position: "relative" }}>
      <div style={{ position: "absolute", left: `${swing * 100}%`, top: -26, width: 0, height: 0, borderLeft: "18px solid transparent", borderRight: "18px solid transparent", borderTop: `30px solid ${LI.crema}`, transform: "translateX(-50%)" }} />
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}><Lbl s={30} c="#9fd0ff">HELADO</Lbl><Lbl f={SERIF} s={54} w={900} c={LI.maiz}>TIBIO</Lbl><Lbl s={30} c="#ff8a6a">HIRVIENDO</Lbl></div>
  </div>;
};

// ===================== tarjeta de cada cena (los diez jarritos) =====================
export const CenaCard: React.FC<{ t: number; at: number; out: number; n: number; title: string; sub?: string; x?: number; y?: number }> = ({ t, at, out, n, title, sub, x = 560, y = 820 }) => {
  const kd = Math.min(1.1, spr(t, at, 1.1)), kr = ei(t, at + 0.25, at + 0.75), o = e(t, at, at + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", alignItems: "center" }}>
    <div style={{ width: 210, height: 210, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#d0683a,#8a3a18 72%)", border: `7px solid ${LI.maiz}`, boxShadow: SH, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${kd}) rotate(${(1 - Math.min(1, kd)) * -120}deg)`, zIndex: 2 }}>
      <Lbl s={26} c={LI.crema} ls={4}>CENA</Lbl><Lbl f={SERIF} s={100} w={900} c={LI.maiz}><span style={{ textShadow: extrude(5, "#4a1a08") }}>{n}</span></Lbl>
    </div>
    <div style={{ marginLeft: -40, padding: "22px 46px 22px 70px", background: LI.papel, borderRadius: "0 16px 16px 0", boxShadow: SH, clipPath: `inset(0 ${(1 - kr) * 100}% 0 0)` }}>
      <Lbl f={HAND} s={72} w={700} c={LI.tinta}>{title}</Lbl>{sub && <Lbl s={28} c="#7a5a3a" ls={3}>{sub}</Lbl>}
    </div>
  </div>;
};
// LA ABUELA DECÍA: azulejo de barro con el dicho
export const Dicho: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; rot?: number }> = ({ t, at, out, x, y, text, rot = -3 }) =>
  <Pop t={t} at={at} out={out} x={x} y={y} rot={rot} from="left"><div style={{ maxWidth: 760, padding: "22px 40px", borderRadius: 16, background: "linear-gradient(180deg,#b5582f,#8a3f20)", border: `5px solid ${LI.maiz}`, boxShadow: SH }}>
    <Lbl s={28} c={LI.maiz} ls={6}>LA ABUELA DECÍA</Lbl><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: LI.crema, lineHeight: 1.05 }}>«{text}»</div></div></Pop>;
// LO QUE SE SABE HOY: pizarra con renglones de gis
export const Pizarra: React.FC<{ t: number; at: number; out: number; x: number; y: number; rows: { at: number; text: string }[]; title?: string }> = ({ t, at, out, x, y, rows, title = "LO QUE SE SABE HOY" }) =>
  <Pop t={t} at={at} out={out} x={x} y={y} from="right"><div style={{ width: 720, padding: "26px 38px", borderRadius: 14, background: "linear-gradient(180deg,#24314f,#141c30)", border: "10px solid #6b4a2a", boxShadow: SH }}>
    <Lbl s={30} c={LI.lila} ls={6}>{title}</Lbl>
    {rows.map((r, i) => { const n = Math.round(r.text.length * e(t, r.at, r.at + 0.7)); return <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 58, color: "#eef2ff", minHeight: 66, opacity: n > 0 ? 1 : 0 }}>· {r.text.slice(0, n)}</div>; })}
  </div></Pop>;
// ficha de receta (papel, a mano, con su palomita por renglón)
export const Receta: React.FC<{ t: number; at: number; out: number; x: number; y: number; title: string; rows: { at: number; text: string }[]; rot?: number }> = ({ t, at, out, x, y, title, rows, rot = 2 }) =>
  <Pop t={t} at={at} out={out} x={x} y={y} rot={rot} from="up"><div style={{ width: 640, padding: "22px 34px 26px", background: `repeating-linear-gradient(180deg,${LI.papel} 0 62px,#d8c69c 62px 64px)`, borderRadius: 6, borderTop: `16px solid ${LI.barro}`, boxShadow: SH }}>
    <Lbl f={SERIF} s={44} w={900} c={LI.barro}>{title}</Lbl>
    {rows.map((r, i) => { const l = e(t, r.at, r.at + 0.3); return <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, height: 64, opacity: l, transform: `translateX(${(1 - l) * 30}px)` }}><Check t={t} at={r.at} size={44} col={LI.morado} /><Lbl f={HAND} s={54} w={700} c={LI.tinta}>{r.text}</Lbl></div>; })}
  </div></Pop>;
// una cucharadita, nada más (el terrón de azúcar tachado)
export const Cucharadita: React.FC<{ t: number; at: number; cross: number; out: number; x: number; y: number }> = ({ t, at, cross, out, x, y }) =>
  <Pop t={t} at={at} out={out} x={x} y={y}><div style={{ display: "flex", alignItems: "center", gap: 50 }}>
    <div style={{ textAlign: "center" }}><svg width={260} height={120} viewBox="0 0 260 120"><ellipse cx={70} cy={60} rx={62} ry={40} fill="#c9a24a" stroke="#6a4a10" strokeWidth={5} /><ellipse cx={70} cy={54} rx={44} ry={24} fill="#7a3a12" /><rect x={128} y={52} width={130} height={16} rx={8} fill="#c9a24a" stroke="#6a4a10" strokeWidth={4} /></svg><Lbl f={SERIF} s={48} w={900} c={LI.maiz}>1 cucharadita</Lbl></div>
    <div style={{ position: "relative", textAlign: "center" }}><div style={{ display: "grid", gridTemplateColumns: "repeat(3,70px)", gap: 8 }}>{Array.from({ length: 6 }, (_, i) => <div key={i} style={{ width: 70, height: 70, borderRadius: 8, background: "#fbfbf6", boxShadow: "inset -6px -6px 0 #d8d8cc" }} />)}</div><X t={t} at={cross} size={250} /><div style={{ marginTop: 12 }}><Lbl s={34} c={LI.crema}>azúcar de noche</Lbl></div></div>
  </div></Pop>;

// ===================== minuto 5 · la leche tibia: triptófano, la costumbre =====================
// la lupa sobre el vaso: el triptófano es "tan poquito"
export const Lupa: React.FC<{ t: number; at: number; dot: number; out: number; x: number; y: number }> = ({ t, at, dot, out, x, y }) => {
  const [k, o] = ko(t, at, out), d = e(t, dot, dot + 0.4), mx = -120 + 120 * ei(t, at, dot);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, width: 520, height: 460 }}>
    <svg width={520} height={460} viewBox="0 0 520 460"><path d="M150 60 L370 60 L345 420 L175 420 Z" fill="rgba(255,255,255,.12)" stroke="#e8f0ff" strokeWidth={6} /><path d="M158 140 L362 140 L345 420 L175 420 Z" fill="#f6f1e6" opacity={0.92} />
      <circle cx={262 + 0.3 * mx} cy={300} r={3.5} fill={LI.morado} opacity={d} /></svg>
    <div style={{ position: "absolute", left: 262 + mx, top: 300, width: 200, height: 200, marginLeft: -100, marginTop: -100, borderRadius: "50%", border: "12px solid #5a3a22", background: "rgba(255,255,255,.15)", boxShadow: SH, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 14, height: 14, borderRadius: "50%", background: LI.morado, opacity: d, boxShadow: `0 0 18px ${LI.lila}` }} />
      <div style={{ position: "absolute", left: 90, top: 200, width: 26, height: 120, background: "#5a3a22", borderRadius: 10, transform: "rotate(-35deg)" }} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: -30, textAlign: "center", opacity: d }}><Lbl f={SERIF} s={58} w={900} c={LI.maiz}>triptófano: tan poquito</Lbl></div>
  </div>;
};
// MISMO vaso · MISMA hora · MISMA silla
export const TresMismos: React.FC<{ t: number; ats: number[]; out: number; y: number }> = ({ t, ats, out, y }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (t < ats[0] - 0.1 || o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 30, opacity: o }}>
    {[["MISMO", "vaso"], ["MISMA", "hora"], ["MISMA", "silla"]].map(([a, b], i) => { const k = Math.min(1.08, spr(t, ats[i], 1.2)); return <div key={i} style={{ transform: `scale(${k}) rotate(${(i - 1) * 3}deg)`, opacity: Math.min(1, k * 3), padding: "14px 34px", borderRadius: 14, background: "rgba(43,29,58,.9)", border: `4px solid ${LI.lila}`, boxShadow: SH, textAlign: "center" }}>
      <Lbl s={30} c={LI.lila} ls={5}>{a}</Lbl><Lbl f={HAND} s={70} w={700}>{b}</Lbl></div>; })}
  </div>;
};
// siete noches: la taza a la misma hora, noche tras noche
export const Noches7: React.FC<{ t: number; at: number; out: number; y: number }> = ({ t, at, out, y }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 16, opacity: o }}>
    {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => { const a = at + 0.25 + i * 0.42, k = Math.min(1.06, spr(t, a, 1.2)); return <div key={i} style={{ width: 190, padding: "14px 0 18px", borderRadius: 16, background: "rgba(11,19,40,.88)", border: `3px solid ${k > 0.5 ? LI.maiz : "#3a4466"}`, textAlign: "center", boxShadow: SH, transform: `translateY(${(1 - Math.min(1, k)) * 40}px)` }}>
      <Lbl s={40} c={LI.lila}>{d}</Lbl>
      <svg width={80} height={80} viewBox="0 0 80 80" style={{ opacity: Math.min(1, k) }}><path d="M18 26 L62 26 L58 66 Q40 72 22 66 Z" fill={LI.crema} /><path d="M62 34 Q76 36 72 50 Q68 58 60 56" fill="none" stroke={LI.crema} strokeWidth={5} /><path d="M32 18 Q28 10 34 4 M44 18 Q40 10 46 4" stroke="#d8d0ff" strokeWidth={3} fill="none" opacity={0.7} /></svg>
      <Lbl f={SERIF} s={36} w={900} c={LI.maiz}>8:00</Lbl></div>; })}
  </div>;
};

// ===================== minuto 6 · el caldito y la calabacita =====================
// taza chica ✓ contra plato hondo ✗
export const TazaPlato: React.FC<{ t: number; at: number; cross: number; out: number; x: number; y: number; ok?: string; no?: string }> = ({ t, at, cross, out, x, y, ok = "taza chica", no = "plato hondo" }) =>
  <Pop t={t} at={at} out={out} x={x} y={y}><div style={{ display: "flex", gap: 80, alignItems: "flex-end" }}>
    <div style={{ textAlign: "center" }}><svg width={190} height={170} viewBox="0 0 190 170"><path d="M30 40 L150 40 L140 140 Q90 160 40 140 Z" fill={LI.barro} stroke="#5a2410" strokeWidth={5} /><path d="M150 60 Q186 66 176 100 Q166 124 142 118" fill="none" stroke={LI.barro} strokeWidth={12} /><ellipse cx={90} cy={42} rx={60} ry={10} fill="#d9a050" /></svg><Check t={t} at={at + 0.4} size={70} /><Lbl f={HAND} s={58} w={700}>{ok}</Lbl></div>
    <div style={{ textAlign: "center", position: "relative" }}><div style={{ position: "relative" }}><svg width={320} height={150} viewBox="0 0 320 150"><path d="M10 30 L310 30 Q290 140 160 145 Q30 140 10 30 Z" fill="#8a6a50" stroke="#3a2414" strokeWidth={5} /><ellipse cx={160} cy={32} rx={150} ry={16} fill="#d9a050" /></svg><X t={t} at={cross} size={200} /></div><div style={{ height: 70 }} /><Lbl f={HAND} s={58} w={700} c="#d8c6b0">{no}</Lbl></div>
  </div></Pop>;
// lo que va a la taza: caen los ingredientes uno por uno
export const TazaCae: React.FC<{ t: number; at: number; out: number; x: number; y: number; items: { at: number; text: string; col: string }[] }> = ({ t, at, out, x, y, items }) =>
  <Pop t={t} at={at} out={out} x={x} y={y}><div style={{ position: "relative", width: 460, height: 520 }}>
    {items.map((it, i) => { const f = ei(t, it.at, it.at + 0.6), o = e(t, it.at, it.at + 0.1); return <div key={i} style={{ position: "absolute", left: 230, top: -40 + 300 * f, transform: `translate(-50%,0) scale(${1 - 0.5 * f})`, opacity: o * (1 - e(t, it.at + 0.55, it.at + 0.7)) }}><div style={{ padding: "8px 24px", borderRadius: 30, background: it.col, boxShadow: SH }}><Lbl f={HAND} s={52} w={700} c={LI.tinta}>{it.text}</Lbl></div></div>; })}
    <svg width={460} height={260} viewBox="0 0 460 260" style={{ position: "absolute", left: 0, top: 260 }}><path d="M70 30 L390 30 L360 230 Q230 260 100 230 Z" fill={LI.barro} stroke="#5a2410" strokeWidth={6} /><ellipse cx={230} cy={32} rx={160} ry={20} fill="#e2b25a" /></svg>
    <div style={{ position: "absolute", left: 0, right: 0, top: 290, textAlign: "center" }}>{items.map((it, i) => <span key={i} style={{ display: "inline-block", width: 24, height: 24, margin: 4, borderRadius: "50%", background: it.col, opacity: e(t, it.at + 0.55, it.at + 0.7) }} />)}</div>
  </div></Pop>;
// cubitos iguales (se cuecen parejo)
export const Cubitos: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) =>
  <Pop t={t} at={at} out={out} x={x} y={y}><div style={{ textAlign: "center" }}><div style={{ display: "grid", gridTemplateColumns: "repeat(5,70px)", gap: 12 }}>
    {Array.from({ length: 15 }, (_, i) => { const k = Math.min(1.1, spr(t, at + 0.1 + i * 0.06, 1.3)); return <div key={i} style={{ width: 70, height: 70, borderRadius: 10, background: "linear-gradient(135deg,#d8e8a0,#9cc060)", boxShadow: "inset -8px -8px 0 #6f9a3a, 0 10px 18px rgba(0,0,0,.4)", transform: `scale(${k}) rotate(${(1 - Math.min(1, k)) * 90}deg)` }} />; })}
  </div><div style={{ marginTop: 18 }}><Lbl f={SERIF} s={54} w={900} c={LI.maiz}>cubitos IGUALES</Lbl><Lbl s={32} c={LI.crema}>se cuecen parejo</Lbl></div></div></Pop>;
// la gota: casi pura agua y fibra
export const Gota: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const [k, o] = ko(t, at, out), lv = ei(t, at + 0.2, at + 1.2);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, textAlign: "center" }}>
    <svg width={220} height={290} viewBox="0 0 110 145"><defs><clipPath id="gtc"><path d="M55 5 C55 5 10 65 10 95 C10 122 30 140 55 140 C80 140 100 122 100 95 C100 65 55 5 55 5 Z" /></clipPath></defs>
      <g clipPath="url(#gtc)"><rect x={0} y={145 - 135 * lv * 0.95} width={110} height={145} fill="#6fb6ff" /></g><path d="M55 5 C55 5 10 65 10 95 C10 122 30 140 55 140 C80 140 100 122 100 95 C100 65 55 5 55 5 Z" fill="none" stroke="#e8f4ff" strokeWidth={5} /></svg>
    <Lbl f={SERIF} s={80} w={900} c="#bfe0ff">{Math.round(95 * lv)}%</Lbl><Lbl s={32} c={LI.crema}>AGUA Y FIBRA</Lbl></div>;
};
// el serrano: de noche, sin picante
export const ChileNo: React.FC<{ t: number; at: number; cross: number; out: number; x: number; y: number }> = ({ t, at, cross, out, x, y }) =>
  <Pop t={t} at={at} out={out} x={x} y={y} rot={-4}><div style={{ textAlign: "center", position: "relative" }}>
    <div style={{ position: "relative", display: "inline-block" }}><svg width={300} height={200} viewBox="0 0 300 200"><circle cx={240} cy={50} r={34} fill="#f4f1e2" /><circle cx={256} cy={40} r={30} fill="rgba(11,19,40,1)" />
      <path d="M40 120 C80 70 180 60 250 110 C200 140 120 160 40 120 Z" fill="#3f8a2a" stroke="#1f4a10" strokeWidth={5} /><path d="M40 120 C24 110 20 92 30 80" stroke="#5a7a2a" strokeWidth={8} fill="none" strokeLinecap="round" /></svg><X t={t} at={cross} size={230} /></div>
    <Lbl f={SERIF} s={56} w={900} c={LI.maiz}>DE NOCHE, SIN PICANTE</Lbl><Lbl s={30} c={LI.crema}>el serrano, pa' la comida</Lbl></div></Pop>;

// ===================== minuto 7 · rinde para cuatro, martes → viernes =====================
export const Rinde4: React.FC<{ t: number; at: number; cheap: number; out: number; x: number; y: number }> = ({ t, at, cheap, out, x, y }) => {
  const [k, o] = ko(t, at, out);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, width: 760, height: 520 }}>
    <svg width={300} height={200} viewBox="0 0 300 200" style={{ position: "absolute", left: 230, top: 150 }}><path d="M30 60 L270 60 Q262 170 150 180 Q38 170 30 60 Z" fill="#8a3a18" stroke="#3a1408" strokeWidth={6} /><ellipse cx={150} cy={60} rx={120} ry={22} fill="#9cc060" /><ellipse cx={120} cy={56} rx={20} ry={8} fill="#f6f1e6" /><ellipse cx={180} cy={58} rx={16} ry={7} fill={LI.maiz} /></svg>
    {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => { const f = ei(t, at + 0.3 + i * 0.15, at + 0.9 + i * 0.15); return <div key={i} style={{ position: "absolute", left: 380 + sx * 290 * f, top: 250 + sy * 190 * f, width: 140, height: 60, marginLeft: -70, marginTop: -30, borderRadius: "50%", background: "radial-gradient(ellipse,#9cc060 0 40%,#c2552d 42% 70%,#8a3a18 72%)", opacity: f, boxShadow: SH }} />; })}
    <div style={{ position: "absolute", left: 0, right: 0, top: -20, textAlign: "center" }}><Lbl f={SERIF} s={64} w={900} c={LI.maiz}>RINDE PARA 4</Lbl></div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 470, textAlign: "center", opacity: e(t, cheap, cheap + 0.3), transform: `scale(${Math.min(1.1, spr(t, cheap, 1.3))})` }}><Lbl f={HAND} s={70} w={700} c={LI.verde}>¡y sale baratísima!</Lbl></div>
  </div>;
};
export const Dias2: React.FC<{ t: number; at: number; b: number; out: number; x: number; y: number; a1: string; a2: string; b1: string; b2: string }> = ({ t, at, b, out, x, y, a1, a2, b1, b2 }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3)), ar = ei(t, b - 0.4, b), kb = Math.min(1.08, spr(t, b, 1.2));
  if (o <= 0.01) return null;
  const page = (d: string, s: string, k: number) => <div style={{ minWidth: 300, borderRadius: 10, overflow: "hidden", background: LI.papel, boxShadow: SH, transform: `scale(${k})`, textAlign: "center" }}><div style={{ background: LI.rojo, padding: "8px 26px" }}><Lbl s={40} c="#fff" ls={4}>{d}</Lbl></div><div style={{ padding: "16px 10px 20px" }}><Lbl f={HAND} s={50} w={700} c={LI.tinta}>{s}</Lbl></div></div>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", gap: 30 }}>
    {page(a1, a2, Math.min(1.08, spr(t, at, 1.2)))}
    <svg width={140} height={60} viewBox="0 0 140 60"><path d="M5 30 L120 30" stroke={LI.maiz} strokeWidth={10} strokeLinecap="round" strokeDasharray={120} strokeDashoffset={120 * (1 - ar)} /><path d="M100 10 L130 30 L100 50" fill="none" stroke={LI.maiz} strokeWidth={10} strokeLinecap="round" opacity={ar} /></svg>
    {kb > 0.01 && page(b1, b2, kb)}
  </div>;
};

// ===================== minuto 8 · frijoles, la abuela y los cuentos =====================
export const Check3: React.FC<{ t: number; ats: number[]; labels: string[]; out: number; x: number; y: number; title?: string }> = ({ t, ats, labels, out, x, y, title }) => {
  const o = e(t, ats[0] - 0.2, ats[0]) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", padding: "24px 40px", borderRadius: 20, background: "rgba(43,29,58,.9)", border: `4px solid ${LI.lila}`, boxShadow: SH }}>
    {title && <Lbl s={30} c={LI.lila} ls={5}>{title}</Lbl>}
    {labels.map((l, i) => { const v = e(t, ats[i], ats[i] + 0.25); return <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, height: 86, opacity: 0.25 + 0.75 * v }}><Check t={t} at={ats[i]} size={62} /><Lbl f={HAND} s={64} w={700}>{l}</Lbl></div>; })}
  </div>;
};
// el jarrito que se brinca (si te cae mal, sáltate esta)
export const Saltar: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3)), a = ei(t, at + 0.1, at + 0.9);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", textAlign: "center" }}>
    <svg width={460} height={170} viewBox="0 0 460 170"><path d="M20 150 Q230 -60 440 150" fill="none" stroke={LI.maiz} strokeWidth={9} strokeLinecap="round" strokeDasharray="22 16" strokeDashoffset={0} pathLength={600} style={{ strokeDasharray: `${600 * a} 600` }} /><path d="M410 120 L440 152 L398 156" fill="none" stroke={LI.maiz} strokeWidth={9} strokeLinecap="round" opacity={e(t, at + 0.8, at + 0.9)} /></svg>
    <Lbl f={HAND} s={70} w={700} c={LI.maiz}>¿te cae mal? sáltate ésta</Lbl><Lbl s={32} c={LI.crema}>no pasa nada</Lbl>
  </div>;
};
// "bajaba la voz… y bajaba la voz": el renglón se achica y se apaga
export const VozBaja: React.FC<{ t: number; ats: number[]; out: number; x: number; y: number; text: string }> = ({ t, ats, out, x, y, text }) => {
  const o = 1 - e(t, out, out + 0.4);
  if (t < ats[0] - 0.1 || o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", textAlign: "center", opacity: o }}>{ats.map((a, i) => <div key={i} style={{ fontFamily: HAND, fontWeight: 700, fontSize: 96 - i * 26, color: LI.crema, opacity: e(t, a, a + 0.4) * (1 - i * 0.28), lineHeight: 1.1, textShadow: "0 6px 20px rgba(0,0,0,.7)" }}>{text}…</div>)}</div>;
};
// luz bajita · voz bajita · estómago tranquilo — tres perillas que bajan
export const Perillas: React.FC<{ t: number; ats: number[]; labels: string[]; out: number; x: number; y: number }> = ({ t, ats, labels, out, x, y }) => {
  const o = e(t, ats[0] - 0.25, ats[0]) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 46, padding: "26px 44px", borderRadius: 24, background: "rgba(11,19,40,.85)", border: `3px solid ${LI.morado}`, boxShadow: SH }}>
    {labels.map((l, i) => { const d = ei(t, ats[i], ats[i] + 0.8); return <div key={i} style={{ textAlign: "center", width: 220 }}>
      <div style={{ position: "relative", width: 34, height: 220, margin: "0 auto", borderRadius: 17, background: "#1a2244" }}><div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${100 - 70 * d}%`, borderRadius: 17, background: `linear-gradient(0deg,${LI.morado},${LI.maiz})`, opacity: 1 - 0.5 * d }} /><div style={{ position: "absolute", left: -14, bottom: `calc(${100 - 70 * d}% - 14px)`, width: 62, height: 28, borderRadius: 8, background: LI.crema }} /></div>
      <div style={{ marginTop: 14 }}><Lbl f={HAND} s={48} w={700}>{l}</Lbl></div></div>; })}
  </div>;
};
// el celular que dice "todavía es de día"
export const SolCel: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const [k, o] = ko(t, at, out), r = (t - at) * 0.6;
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, textAlign: "center" }}>
    <div style={{ position: "relative", width: 220, height: 400, margin: "0 auto", borderRadius: 34, background: "#111", border: "10px solid #333", boxShadow: `0 0 120px 30px rgba(140,190,255,${0.45 * o}), ${SH}` }}>
      <div style={{ position: "absolute", inset: 14, borderRadius: 20, background: "linear-gradient(180deg,#bfe4ff,#ffffff)" }} />
      <svg width={160} height={160} viewBox="-80 -80 160 160" style={{ position: "absolute", left: 30, top: 110, transform: `rotate(${r * 60}deg)` }}><circle r={34} fill={LI.maiz} />{Array.from({ length: 10 }, (_, i) => <line key={i} x1={0} y1={-46} x2={0} y2={-70} stroke={LI.maiz} strokeWidth={8} strokeLinecap="round" transform={`rotate(${i * 36})`} />)}</svg>
    </div>
    <div style={{ marginTop: 20 }}><Lbl f={HAND} s={66} w={700} c={LI.maiz}>«¡todavía es de día!»</Lbl></div>
  </div>;
};

// ===================== minuto 9 · quesadilla, aceite, huevo =====================
// dos relojes de arena: la tortilla baja rápido, lo frito tarda mucho más
export const ArenaDos: React.FC<{ t: number; at: number; b: number; out: number; x: number; y: number }> = ({ t, at, b, out, x, y }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const glass = (lab: string, a0: number, dur: number, col: string) => { const f = Math.min(1, Math.max(0, (t - a0) / dur)), k = Math.min(1.08, spr(t, a0, 1.2));
    return <div style={{ textAlign: "center", transform: `scale(${k})` }}><svg width={180} height={280} viewBox="0 0 90 140"><path d="M10 6 L80 6 L80 12 Q80 50 50 70 Q80 90 80 128 L80 134 L10 134 L10 128 Q10 90 40 70 Q10 50 10 12 Z" fill="rgba(255,255,255,.08)" stroke="#e8dcc0" strokeWidth={4} />
      <path d={`M${18 + 10 * f} ${16 + 44 * f} L${72 - 10 * f} ${16 + 44 * f} L45 66 Z`} fill={col} /><path d={`M14 130 L76 130 L${66 - 14 * f} ${130 - 50 * f} L${24 + 14 * f} ${130 - 50 * f} Z`} fill={col} /><rect x={43.5} y={60} width={3} height={70} fill={col} opacity={f < 1 ? 0.8 : 0} /></svg>
      <Lbl f={SERIF} s={46} w={900} c={col}>{lab}</Lbl></div>; };
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 90, padding: "26px 50px", borderRadius: 24, background: "rgba(43,29,58,.86)", boxShadow: SH }}>
    {glass("la tortilla", at, 1.4, LI.maiz)}{t > b - 0.1 && glass("lo frito", b, 9, "#e8a040")}
    <div style={{ position: "absolute", left: 0, right: 0, top: -60, textAlign: "center" }}><Lbl s={34} c={LI.lila} ls={5}>¿QUÉ TARDA EN BAJAR?</Lbl></div>
  </div>;
};
// un huevo ✓ — tres ✗
export const UnoNoTres: React.FC<{ t: number; at: number; cross: number; out: number; x: number; y: number }> = ({ t, at, cross, out, x, y }) => {
  const egg = (k: number) => <div style={{ width: 110, height: 140, borderRadius: "50% 50% 46% 46% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 30%,#fff8ec,#e8d2b0 70%)", boxShadow: SH, transform: `scale(${k})` }} />;
  return <Pop t={t} at={at} out={out} x={x} y={y}><div style={{ display: "flex", gap: 90, alignItems: "flex-end" }}>
    <div style={{ textAlign: "center" }}>{egg(1)}<Check t={t} at={at + 0.3} size={64} /><Lbl f={SERIF} s={52} w={900} c={LI.maiz}>UNO</Lbl></div>
    <div style={{ textAlign: "center", position: "relative" }}><div style={{ display: "flex", gap: 10, position: "relative" }}>{egg(0.9)}{egg(0.9)}{egg(0.9)}<X t={t} at={cross} size={260} /></div><div style={{ height: 64 }} /><Lbl f={SERIF} s={52} w={900} c="#c8b8a8">TRES</Lbl></div>
  </div></Pop>;
};

// ===================== minuto 10 · plátano, arroz con leche =====================
// azulejos de minerales: potasio y magnesio
export const Minerales: React.FC<{ t: number; ats: number[]; out: number; x: number; y: number }> = ({ t, ats, out, x, y }) => {
  const o = e(t, ats[0] - 0.1, ats[0] + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 30, perspective: 1000 }}>
    {[["K", "potasio", "#e8c050"], ["Mg", "magnesio", "#9cc0e8"]].map(([s0, n, c], i) => { const f = ei(t, ats[i], ats[i] + 0.6); return <div key={i} style={{ width: 230, height: 250, borderRadius: 18, background: "rgba(14,18,40,.9)", border: `5px solid ${c}`, boxShadow: SH, textAlign: "center", paddingTop: 22, transform: `rotateY(${(1 - f) * 180}deg)`, backfaceVisibility: "hidden", opacity: f > 0.5 ? 1 : 0 }}>
      <Lbl f={SERIF} s={120} w={900} c={c}>{s0}</Lbl><Lbl f={HAND} s={50} w={700}>{n}</Lbl></div>; })}
  </div>;
};
// ½ plátano con su canela
export const Medio: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) =>
  <Pop t={t} at={at} out={out} x={x} y={y} rot={-6}><div style={{ width: 260, height: 260, borderRadius: "50%", background: `conic-gradient(${LI.maiz} 0 50%, rgba(255,255,255,.12) 50% 100%)`, border: `8px solid ${LI.crema}`, boxShadow: SH, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ width: 170, height: 170, borderRadius: "50%", background: "#2b1d3a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}><Lbl f={SERIF} s={90} w={900} c={LI.maiz}>½</Lbl><Lbl s={24} c={LI.crema} ls={3}>PLÁTANO</Lbl></div></div></Pop>;
// la palanca: menos azúcar · más canela
export const AzucarCanela: React.FC<{ t: number; at: number; b: number; out: number; x: number; y: number }> = ({ t, at, b, out, x, y }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3)), da = ei(t, at + 0.1, at + 0.9), db = ei(t, b, b + 0.8);
  if (o <= 0.01) return null;
  const bar = (lab: string, h: number, col: string, arrow: string) => <div style={{ textAlign: "center", width: 220 }}>
    <div style={{ height: 300, display: "flex", alignItems: "flex-end", justifyContent: "center" }}><div style={{ width: 110, height: 300 * h, borderRadius: "14px 14px 4px 4px", background: col, boxShadow: SH }} /></div>
    <Lbl f={SERIF} s={64} w={900} c={col}>{arrow}</Lbl><Lbl f={HAND} s={56} w={700}>{lab}</Lbl></div>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", display: "flex", gap: 40, padding: "24px 40px", borderRadius: 24, background: "rgba(43,29,58,.86)", boxShadow: SH }}>
    {bar("azúcar", 0.85 - 0.55 * da, "#f4f1e6", "MENOS")}{bar("canela", 0.3 + 0.6 * db, "#b0602a", "MÁS")}
  </div>;
};

// ===================== minuto 11 · manzanilla, médico, las tres que nunca =====================
export const Estudios: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) =>
  <Pop t={t} at={at} out={out} x={x} y={y}><div style={{ textAlign: "center" }}><div style={{ display: "flex", gap: 14, justifyContent: "center", alignItems: "flex-end" }}>
    {[0, 1, 2].map((i) => <div key={i} style={{ width: 70, height: 92, background: "#fbf8f0", borderRadius: 4, boxShadow: SH, transform: `rotate(${(i - 1) * 6}deg) scale(${Math.min(1, spr(t, at + 0.15 * i, 1.2))})`, padding: 8 }}>{[0, 1, 2, 3, 4].map((j) => <div key={j} style={{ height: 5, margin: "5px 0", background: "#c0b8a8", width: `${90 - j * 10}%` }} />)}</div>)}</div>
    <div style={{ marginTop: 16 }}><Lbl f={SERIF} s={52} w={900} c={LI.maiz}>estudios chiquitos</Lbl><Lbl s={32} c={LI.crema}>no prometen mucho</Lbl></div></div></Pop>;
// aviso médico (la cruz y su recado)
export const Aviso: React.FC<{ t: number; at: number; out: number; x: number; y: number; title: string; text: string }> = ({ t, at, out, x, y, title, text }) =>
  <Pop t={t} at={at} out={out} x={x} y={y} from="up"><div style={{ display: "flex", gap: 26, alignItems: "center", maxWidth: 820, padding: "26px 40px", borderRadius: 22, background: "#f6f3ff", border: `5px solid ${LI.morado}`, boxShadow: SH }}>
    <svg width={110} height={110} viewBox="0 0 100 100"><rect x={36} y={8} width={28} height={84} rx={6} fill={LI.rojo} /><rect x={8} y={36} width={84} height={28} rx={6} fill={LI.rojo} /></svg>
    <div><Lbl s={30} c={LI.morado} ls={5}>{title}</Lbl><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: LI.tinta, lineHeight: 1.05 }}>{text}</div></div></div></Pop>;
// las tres que la abuela NUNCA cenaba: tres cazuelitas tapadas; cada tapa se levanta y cae la X
export const Nunca3: React.FC<{ t: number; at: number; ats: number[]; labels: string[]; out: number; y: number }> = ({ t, at, ats, labels, out, y }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <AbsoluteFill style={{ opacity: o }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: y - 250, textAlign: "center" }}><Lbl f={SERIF} s={70} w={900} c={LI.maiz}><span style={{ textShadow: extrude(5, "#3a1408") }}>LO QUE NUNCA CENABA</span></Lbl></div>
    {labels.map((l, i) => { const k = Math.min(1.06, spr(t, at + 0.15 * i, 1.2)), lid = ei(t, ats[i], ats[i] + 0.5); return <div key={i} style={{ position: "absolute", left: 480 + i * 480, top: y, transform: `translate(-50%,-50%) scale(${k})`, textAlign: "center" }}>
      <div style={{ position: "relative", width: 300, height: 190 }}>
        <div style={{ position: "absolute", left: 20, top: 70, width: 260, height: 110, borderRadius: "0 0 130px 130px", background: "linear-gradient(#b5582f,#7a3a18)", boxShadow: SH }} />
        <div style={{ position: "absolute", left: 10, top: 40 - 120 * lid, width: 280, height: 46, borderRadius: "140px 140px 10px 10px", background: "linear-gradient(#c9683a,#8a3a18)", transform: `rotate(${-24 * lid}deg)`, boxShadow: SH }}><div style={{ width: 40, height: 22, margin: "-16px auto 0", borderRadius: 10, background: "#7a3a18" }} /></div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 60, height: 140 }}><X t={t} at={ats[i] + 0.45} size={200} /></div>
      </div>
      <div style={{ marginTop: 10, opacity: lid }}><Lbl f={HAND} s={60} w={700}>{l}</Lbl></div>
    </div>; })}
  </AbsoluteFill>;
};
// la cafeína: de las 6 de la tarde hasta la medianoche, todavía despierta
export const Cafeina: React.FC<{ t: number; at: number; b: number; out: number; x: number; y: number }> = ({ t, at, b, out, x, y }) => {
  const [k, o] = ko(t, at, out), f = ei(t, at + 0.2, b);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, width: 900, padding: "26px 40px", borderRadius: 22, background: "rgba(11,19,40,.88)", boxShadow: SH }}>
    <Lbl s={30} c={LI.lila} ls={5}>LA CAFEÍNA SE QUEDA HORAS</Lbl>
    <div style={{ position: "relative", height: 60, marginTop: 26, borderRadius: 30, background: "#1c2448" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${100 * f}%`, borderRadius: 30, background: "linear-gradient(90deg,#6b3a1a,#c27a3a)" }} />
      <div style={{ position: "absolute", left: `calc(${100 * f}% - 30px)`, top: -14, width: 88, height: 88, borderRadius: "50%", background: "#c27a3a", border: `5px solid ${LI.crema}`, display: "flex", alignItems: "center", justifyContent: "center" }}><svg width={44} height={44} viewBox="0 0 80 80"><path d="M14 24 L58 24 L54 64 Q36 70 18 64 Z" fill="#fff" /><path d="M58 32 Q72 34 68 48 Q64 56 56 54" fill="none" stroke="#fff" strokeWidth={6} /></svg></div>
    </div>
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}><Lbl f={SERIF} s={44} w={900} c={LI.maiz}>6:00 p.m.</Lbl><Lbl f={SERIF} s={44} w={900} c={LI.lila}>12:00 a.m. · ¡despierta!</Lbl></div>
  </div>;
};
// ni pozole · ni tamales · ni el recalentado con chile
export const NiNiNi: React.FC<{ t: number; ats: number[]; items: string[]; out: number; x: number; y: number }> = ({ t, ats, items, out, x, y }) => {
  const o = e(t, ats[0] - 0.15, ats[0]) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", padding: "20px 44px", borderRadius: 20, background: "rgba(43,29,58,.88)", boxShadow: SH }}>
    {items.map((it, i) => { const l = e(t, ats[i], ats[i] + 0.2), c = e(t, ats[i] + 0.3, ats[i] + 0.6); return <div key={i} style={{ position: "relative", height: 92, display: "flex", alignItems: "center", gap: 18, opacity: l }}>
      <Lbl f={SERIF} s={48} w={900} c={LI.lila}>ni</Lbl><Lbl f={HAND} s={70} w={700}>{it}</Lbl>
      <div style={{ position: "absolute", left: 70, top: 46, height: 8, width: `${(it.length * 30 + 20) * c}px`, background: LI.rojo, borderRadius: 4, transform: "rotate(-3deg)" }} /></div>; })}
  </div>;
};
// el sueño cortado a las 3 (la tijera)
export const SuenoCortado: React.FC<{ t: number; at: number; cut: number; out: number; x: number; y: number }> = ({ t, at, cut, out, x, y }) => {
  const [k, o] = ko(t, at, out), d = ei(t, at + 0.2, cut), sp = ei(t, cut, cut + 0.5);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, padding: "26px 40px", borderRadius: 22, background: "rgba(11,19,40,.88)", boxShadow: SH }}>
    <svg width={820} height={220} viewBox="0 0 820 220" style={{ overflow: "visible" }}>
      <path d="M10 60 Q120 170 240 170 Q330 170 400 150" fill="none" stroke={LI.azul} strokeWidth={8} strokeDasharray={500} strokeDashoffset={500 * (1 - d)} />
      <path d="M430 40 L460 20 L490 50 L520 20 L560 40 L600 25 L640 45 L690 30 L740 45 L800 35" fill="none" stroke={LI.rojo} strokeWidth={6} opacity={sp} transform={`translate(${30 * sp} ${-20 * sp})`} />
      <text x={10} y={210} fontFamily={FONT} fontWeight={800} fontSize={30} fill={LI.lila}>te duermes rápido…</text>
      <text x={470} y={210} fontFamily={FONT} fontWeight={800} fontSize={30} fill={LI.rojo} opacity={sp}>3:00 a.m. · se corta</text>
      <g transform={`translate(${415} 120) rotate(${-20 + 30 * Math.sin(Math.max(0, t - cut) * 16) * (1 - sp)})`} opacity={e(t, cut - 0.3, cut)}><circle cx={-30} cy={30} r={18} fill="none" stroke={LI.crema} strokeWidth={7} /><circle cx={30} cy={30} r={18} fill="none" stroke={LI.crema} strokeWidth={7} /><path d="M-18 16 L22 -60 M18 16 L-22 -60" stroke={LI.crema} strokeWidth={9} strokeLinecap="round" /></g>
    </svg>
  </div>;
};

// ===================== minuto 12 · la semana, el mercado, las señales =====================
export const Semana: React.FC<{ t: number; at: number; ats: number[]; dishes: string[]; out: number; y: number; small?: number }> = ({ t, at, ats, dishes, out, y, small = 0 }) => {
  const o = e(t, at, at + 0.2) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const D = ["LUNES", "MARTES", "MIÉRC.", "JUEVES", "VIERNES", "SÁBADO", "DOMINGO"];
  return <div style={{ position: "absolute", left: 960, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${1 - 0.35 * small})`, transformOrigin: "50% 100%", display: "flex", gap: 12, padding: 20, borderRadius: 20, background: "rgba(239,224,191,.95)", boxShadow: SH }}>
    {D.map((d, i) => { const v = e(t, ats[i], ats[i] + 0.3), on = t >= ats[i] && (i === 6 || t < ats[i + 1]); return <div key={i} style={{ width: 236, height: 240, borderRadius: 12, background: on ? "#fff7e2" : "#f4e8cc", border: `4px solid ${on ? LI.barro : "#d8c69c"}`, textAlign: "center", overflow: "hidden" }}>
      <div style={{ background: on ? LI.barro : "#8a6a50", padding: "8px 0" }}><Lbl s={30} c="#fff" ls={2}>{d}</Lbl></div>
      <div style={{ padding: "14px 10px", opacity: v, transform: `translateY(${(1 - v) * 24}px)`, fontFamily: HAND, fontWeight: 700, fontSize: 46, color: LI.tinta, lineHeight: 1.05, whiteSpace: "normal" }}>{dishes[i]}</div></div>; })}
  </div>;
};
// menos que un pan dulce con café
export const PanVsCena: React.FC<{ t: number; at: number; out: number; x: number; y: number }> = ({ t, at, out, x, y }) => {
  const o = e(t, at, at + 0.15) * (1 - e(t, out, out + 0.3)), a = ei(t, at + 0.2, at + 0.9), b = ei(t, at + 0.6, at + 1.3);
  if (o <= 0.01) return null;
  const row = (lab: string, w: number, col: string) => <div style={{ display: "flex", alignItems: "center", gap: 20, height: 100 }}><div style={{ width: 360, textAlign: "right" }}><Lbl f={HAND} s={56} w={700}>{lab}</Lbl></div><div style={{ height: 56, width: 440 * w, borderRadius: 12, background: col, boxShadow: SH }} /></div>;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: "translate(-50%,-50%)", padding: "22px 40px", borderRadius: 22, background: "rgba(43,29,58,.88)", boxShadow: SH }}>
    <Lbl s={30} c={LI.lila} ls={5}>LO QUE CUESTA</Lbl>{row("pan dulce + café", a, "#c27a3a")}{row("la cena de la abuela", 0.62 * b, LI.verde)}</div>;
};
// tres señales para ir al médico
export const Senales: React.FC<{ t: number; ats: number[]; labels: string[]; out: number; y: number }> = ({ t, ats, labels, out, y }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (t < ats[0] - 0.1 || o <= 0.01) return null;
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 34, opacity: o }}>
    {labels.map((l, i) => { const k = Math.min(1.08, spr(t, ats[i], 1.2)); return <div key={i} style={{ width: 460, padding: "22px 26px", borderRadius: 20, background: "linear-gradient(180deg,#f2c14e,#d89a20)", border: "5px solid #3a2414", boxShadow: SH, textAlign: "center", transform: `scale(${k}) rotate(${(i - 1) * 2}deg)`, opacity: Math.min(1, k * 3) }}>
      <svg width={70} height={62} viewBox="0 0 70 62"><path d="M35 4 L66 58 L4 58 Z" fill="#3a2414" /><rect x={32} y={22} width={6} height={20} fill={LI.maiz} /><rect x={32} y={46} width={6} height={6} fill={LI.maiz} /></svg>
      <Lbl f={HAND} s={58} w={700} c="#2b1408">{l}</Lbl></div>; })}
  </div>;
};

// ===================== minuto 13 · la tarea, la pregunta, el próximo =====================
export const Cuaderno: React.FC<{ t: number; at: number; out: number; x: number; y: number; rows: { at: number; text: string }[] }> = ({ t, at, out, x, y, rows }) =>
  <Pop t={t} at={at} out={out} x={x} y={y} rot={-2} from="down"><div style={{ width: 720, padding: "26px 40px 30px 90px", background: `repeating-linear-gradient(180deg,#fbfbf4 0 66px,#b8d0f0 66px 68px)`, borderRadius: 8, borderLeft: "6px solid #e07070", boxShadow: SH, position: "relative" }}>
    <div style={{ position: "absolute", left: -18, top: 20, bottom: 20, display: "flex", flexDirection: "column", justifyContent: "space-around" }}>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ width: 30, height: 30, borderRadius: "50%", background: "#1a1a2a" }} />)}</div>
    <Lbl f={HAND} s={70} w={700} c={LI.rojo}>Tarea de la semana</Lbl>
    {rows.map((r, i) => { const n = Math.round(r.text.length * e(t, r.at, r.at + 0.8)); return <div key={i} style={{ height: 68, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: "#1a2a5a" }}>{r.text.slice(0, n)}</div>; })}
  </div></Pop>;
// la caja de comentarios: la pregunta se escribe sola
export const Comentario: React.FC<{ t: number; at: number; out: number; x: number; y: number; text: string; send: number }> = ({ t, at, out, x, y, text, send }) => {
  const n = Math.round(text.length * e(t, at + 0.3, send - 0.2)), cur = Math.floor(t * 2.5) % 2 === 0 && t < send;
  return <Pop t={t} at={at} out={out} x={x} y={y} from="down"><div style={{ width: 1100, padding: "26px 34px", borderRadius: 22, background: "#ffffff", boxShadow: SH }}>
    <Lbl s={30} c="#606060">Comentarios</Lbl>
    <div style={{ display: "flex", gap: 22, marginTop: 18, alignItems: "flex-start" }}>
      <div style={{ width: 76, height: 76, borderRadius: "50%", background: LI.morado, display: "flex", alignItems: "center", justifyContent: "center" }}><Lbl s={34} c="#fff">TÚ</Lbl></div>
      <div style={{ flex: 1, borderBottom: `3px solid ${t > send ? "#bbb" : "#111"}`, paddingBottom: 10, fontFamily: FONT, fontWeight: 600, fontSize: 44, color: "#111", minHeight: 60, whiteSpace: "normal" }}>{text.slice(0, n)}{cur ? "|" : ""}</div>
    </div>
    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}><div style={{ padding: "12px 34px", borderRadius: 30, background: t > send ? "#065fd4" : "#e8e8e8", transform: `scale(${t > send && t < send + 0.2 ? 0.94 : 1})` }}><Lbl s={34} c={t > send ? "#fff" : "#888"}>COMENTAR</Lbl></div></div>
  </div></Pop>;
};
// ¿atole o café con pan?
export const Duo: React.FC<{ t: number; a: number; b: number; out: number; y: number; la: string; lb: string }> = ({ t, a, b, out, y, la, lb }) => {
  const o = 1 - e(t, out, out + 0.3);
  if (t < a - 0.1 || o <= 0.01) return null;
  const chip = (l: string, at: number, col: string) => { const k = Math.min(1.08, spr(t, at, 1.2)); return <div style={{ transform: `scale(${k})`, opacity: Math.min(1, k * 3), padding: "16px 44px", borderRadius: 50, background: col, boxShadow: SH }}><Lbl f={HAND} s={72} w={700} c={LI.tinta}>{l}</Lbl></div>; };
  return <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", alignItems: "center", gap: 36, opacity: o }}>
    {chip(la, a, LI.papel)}<Lbl f={SERIF} s={60} w={900} c={LI.maiz}>¿o?</Lbl>{chip(lb, b, "#e8c8a0")}</div>;
};
// el próximo video: el té de la noche, las siete hierbas
export const Proximo: React.FC<{ t: number; at: number; leaves: number; out: number; x: number; y: number }> = ({ t, at, leaves, out, x, y }) => {
  const [k, o] = ko(t, at, out);
  if (o <= 0.01) return null;
  return <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${k})`, width: 800, height: 520 }}>
    {Array.from({ length: 7 }, (_, i) => { const a = (i / 7) * Math.PI * 2 - Math.PI / 2, f = Math.min(1.1, spr(t, leaves + i * 0.14, 1.2)); return <svg key={i} width={110} height={110} viewBox="0 0 100 100" style={{ position: "absolute", left: 400 + Math.cos(a) * 330 - 55, top: 260 + Math.sin(a) * 220 - 55, transform: `scale(${f}) rotate(${i * 50}deg)`, opacity: Math.min(1, f) }}><path d="M50 8 C80 30 80 70 50 92 C20 70 20 30 50 8 Z" fill={["#7fbf5a", "#9cc060", "#5f8a3a", "#a8c870", "#6fa04a", "#8ab060", "#4f7a30"][i]} /><path d="M50 12 L50 90" stroke="#2f4a1a" strokeWidth={3} /></svg>; })}
    <div style={{ position: "absolute", left: 160, top: 130, width: 480, padding: "26px 30px", borderRadius: 22, background: "rgba(43,29,58,.94)", border: `4px solid ${LI.lila}`, boxShadow: SH, textAlign: "center" }}>
      <Lbl s={28} c={LI.lila} ls={6}>EN EL PRÓXIMO VIDEO</Lbl><div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 66, color: LI.crema, lineHeight: 1.05, marginTop: 8 }}>el té de la noche<br />de mi abuela</div>
      <div style={{ marginTop: 8, opacity: e(t, leaves, leaves + 0.4) }}><Lbl f={SERIF} s={40} w={900} c={LI.maiz}>las 7 hierbas del patio</Lbl></div></div>
  </div>;
};
