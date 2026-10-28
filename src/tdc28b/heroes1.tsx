// componentes únicos de tdc28b (estufa de tambor) · 1-12 (minutos 0-11). Cada uno = lo que se dice en ese segundo, dibujado en código.
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, ICE, RED, Stage, TX, Tag, cl, eio, phys } from "./hkit";

// ---------- piezas comunes: el tambor ----------
type Tone = "rust" | "burnt" | "blue";
const TONES: Record<Tone, [string, string, string, string]> = {
  rust: ["#2a140b", "#b5612f", "#74391a", "#1c0d06"],
  burnt: ["#120d0b", "#5a4136", "#33241d", "#0a0706"],
  blue: ["#0c1a2e", "#4b86c6", "#24507f", "#08111f"],
};
// tambor ACOSTADO visto de costado (centrado en x,y); la tapa redonda queda a la derecha
export const DrumSide: React.FC<{ x: number; y: number; w: number; h: number; tone?: Tone; style?: React.CSSProperties; children?: React.ReactNode }> = ({ x, y, w, h, tone = "rust", style, children }) => {
  const [a, b, c, d] = TONES[tone];
  return <div style={{ position: "absolute", left: x - w / 2, top: y - h / 2, width: w, height: h, ...style }}>
    <div style={{ position: "absolute", left: 0, bottom: -h * 0.16, width: w, height: h * 0.2, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,.55), transparent 70%)", filter: "blur(10px)" }} />
    <div style={{ position: "absolute", inset: 0, borderRadius: `${h * 0.1}px ${h * 0.2}px ${h * 0.2}px ${h * 0.1}px`, background: `linear-gradient(180deg, ${a}, ${b} 24%, ${c} 58%, ${d})`, overflow: "hidden", boxShadow: "inset 0 -20px 40px rgba(0,0,0,.4)" }}>
      {[0.3, 0.66].map((k, i) => <div key={i} style={{ position: "absolute", left: `${k * 100}%`, top: 0, bottom: 0, width: 16, background: "linear-gradient(90deg, rgba(0,0,0,.35), rgba(255,255,255,.18), rgba(0,0,0,.35))" }} />)}
      <div style={{ position: "absolute", left: "4%", right: "10%", top: "14%", height: "9%", borderRadius: 30, background: "linear-gradient(90deg, transparent, rgba(255,240,220,.28), transparent)" }} />
      {tone === "rust" && Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: `${(i * 37) % 92}%`, top: `${20 + (i * 53) % 66}%`, width: 30 + (i * 13) % 60, height: 18 + (i * 7) % 30, borderRadius: "50%", background: "rgba(60,22,8,.45)", filter: "blur(4px)" }} />)}
    </div>
    <div style={{ position: "absolute", right: -h * 0.14, top: 0, width: h * 0.28, height: h, borderRadius: "50%", background: `radial-gradient(ellipse at 40% 40%, ${b}, ${c} 60%, ${d})`, boxShadow: "inset 0 0 0 8px rgba(0,0,0,.35)" }} />
    {children}
  </div>;
};
// tapa redonda del tambor vista de frente (con las dos bocas)
export const DrumFace: React.FC<{ x: number; y: number; r: number; tone?: Tone; children?: React.ReactNode }> = ({ x, y, r, tone = "rust", children }) => {
  const [, b, c, d] = TONES[tone];
  return <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r }}>
    <div style={{ position: "absolute", inset: -18, borderRadius: "50%", background: `radial-gradient(circle, ${c}, ${d})`, boxShadow: "0 50px 110px rgba(0,0,0,.65)" }} />
    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle at 38% 34%, ${b}, ${c} 55%, ${d})`, boxShadow: "inset 0 0 0 10px rgba(0,0,0,.25), inset 0 0 60px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", inset: r * 0.12, borderRadius: "50%", border: "3px solid rgba(0,0,0,.25)" }} />
    {[[0.8, 0.22, 0.08], [0.2, 0.24, 0.045]].map(([px, py, s], i) => <div key={i} style={{ position: "absolute", left: 2 * r * px - r * s, top: 2 * r * py - r * s, width: 2 * r * s, height: 2 * r * s, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%, #555, #1a1a1a)", boxShadow: "0 0 0 6px rgba(0,0,0,.3)" }} />)}
    {children}
  </div>;
};
const Spark: React.FC<{ x: number; y: number; tt: number; n?: number; on?: number }> = ({ x, y, tt, n = 14, on = 1 }) => <>{on > 0.02 && Array.from({ length: n }, (_, i) => {
  const ph = (tt * 2.2 + i / n) % 1, a = -2.4 + (i * 0.71) % 1.6, d = 40 + ph * 200;
  return <div key={i} style={{ position: "absolute", left: x + Math.cos(a) * d, top: y + Math.sin(a) * d + ph * ph * 120, width: 7, height: 7, borderRadius: 4, background: "#ffd27a", boxShadow: "0 0 12px #ffb040", opacity: on * (1 - ph) }} />;
})}</>;

// ---- 0:17 · UN PUÑADO DE LEÑA: tres troncos chicos a la izquierda y el taller entero que se llena de calor ----
export const HHandful: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const heat = eio(tt, 1.6, 4.6), deg = Math.round(2 + 16 * heat);
  return <>
    <Head tt={tt} kick="CON ESTO NOMÁS" title="UN PUÑADO DE LEÑA" />
    {[0, 1, 2].map((i) => { const s = cl(phys(tt, 0.4 + i * 0.25, 7, 0.5)); return <div key={i} style={{ position: "absolute", left: 300 + i * 40, top: 560 - i * 70 - (1 - s) * 200, width: 360, height: 74, borderRadius: 37, background: "linear-gradient(180deg,#8a5a34,#5a3518 60%,#3a200c)", transform: `rotate(${-6 + i * 5}deg)`, opacity: s, boxShadow: "0 18px 30px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", right: 0, top: 0, width: 74, height: 74, borderRadius: "50%", background: "radial-gradient(circle,#e3b07a,#b07a44 40%,#7a4c22 70%,#5a3518)" }} />
    </div>; })}
    <svg width={160} height={60} style={{ position: "absolute", left: 780, top: 520, opacity: cl(tt - 1.2) }}><path d={`M0 30 L${120 * eio(tt, 1.2, 1.8)} 30`} stroke={AMB} strokeWidth={8} strokeLinecap="round" /><path d="M110 10 L140 30 L110 50" stroke={AMB} strokeWidth={8} fill="none" opacity={cl(tt - 1.7)} /></svg>
    <div style={{ position: "absolute", left: 1000, top: 300, width: 640, height: 480 }}>
      <svg width={640} height={480} style={{ position: "absolute", inset: 0 }}><defs><clipPath id="hfhouse"><path d="M20 180 L320 20 L620 180 L620 470 L20 470 Z" /></clipPath></defs>
        <g clipPath="url(#hfhouse)"><rect x={0} y={470 - 460 * heat} width={640} height={480} fill={`rgba(255,${150 - 40 * heat},70,${0.25 + 0.35 * heat})`} />
          {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${60 + i * 100} ${470 - ((tt * 70 + i * 60) % 420)} q20 -20 0 -40 q-20 -20 0 -40`} stroke="rgba(255,230,190,.5)" strokeWidth={5} fill="none" opacity={heat} />)}</g>
        <path d="M20 180 L320 20 L620 180 L620 470 L20 470 Z" fill="none" stroke={TX} strokeWidth={10} strokeLinejoin="round" />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 220, textAlign: "center", fontWeight: 900, fontSize: 130, color: heat > 0.5 ? AMB : ICE, textShadow: "0 10px 30px rgba(0,0,0,.6)" }}>{deg}°</div>
    </div>
    <Tag tt={tt} at={4.4} x={1320} y={850} txt="TODO EL TALLER" col={AMB} size={42} />
  </>;
}}</Stage>;

// ---- 0:50 · DE CHATARRA A ESTUFA: el tambor oxidado y cada pieza que se le suma con peso ----
export const HTransform: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const P = [0.9, 1.7, 2.5, 3.3, 4.1].map((a) => cl(phys(tt, a, 6.5, 0.48))), fire = cl(tt - 4.4);
  const LBL = ["PUERTA", "PATAS", "CHIMENEA", "LADRILLOS", "FUEGO"];
  return <>
    <Head tt={tt} kick="200 LITROS" title="DE CHATARRA A ESTUFA" />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
      {/* patas: cunas */}
      {[620, 1180].map((x, i) => <div key={i} style={{ position: "absolute", left: x - 90, top: 820 - (1 - P[1]) * 120, width: 180, height: 120, opacity: P[1], borderLeft: "16px solid #555", borderRight: "16px solid #555", borderBottom: "16px solid #555", borderRadius: "0 0 90px 90px", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />)}
      <DrumSide x={900} y={660} w={780} h={330} tone="rust">
        {/* ladrillos adentro (se ven por transparencia de la chapa) */}
        <div style={{ position: "absolute", left: 60, right: 80, bottom: 30, height: 70, display: "flex", gap: 6, opacity: P[3] * 0.85 }}>{Array.from({ length: 8 }, (_, i) => <div key={i} style={{ flex: 1, background: "linear-gradient(180deg,#d9b48a,#a8794c)", borderRadius: 4, transform: `translateY(${(1 - cl(phys(tt, 3.3 + i * 0.06, 8, 0.5))) * -80}px)` }} />)}</div>
      </DrumSide>
      {/* chimenea */}
      <div style={{ position: "absolute", left: 600, top: 495 - 250 * P[2], width: 70, height: 250 * P[2], background: "linear-gradient(90deg,#3a3a3e,#9a9aa2 40%,#4a4a50)", borderRadius: "8px 8px 0 0" }} />
      {/* puerta en la tapa (a la derecha) */}
      <div style={{ position: "absolute", left: 1250, top: 600, width: 46, height: 120, borderRadius: 10, background: `linear-gradient(90deg,#3a1c0e,#7a3c1a)`, transform: `perspective(600px) rotateY(${(1 - P[0]) * 80}deg)`, transformOrigin: "left", opacity: P[0], boxShadow: `0 0 ${60 * fire}px rgba(255,140,40,${0.8 * fire})`, border: "4px solid #222" }} />
      {fire > 0 && <div style={{ position: "absolute", left: 1258, top: 618, width: 30, height: 84, borderRadius: 8, background: `radial-gradient(ellipse at 50% 80%, #fff2b0, #ff9a2a 50%, transparent 75%)`, opacity: fire * (0.85 + 0.15 * Math.sin(tt * 9)) }} />}
    </div>
    {LBL.map((l, i) => <div key={i} style={{ position: "absolute", left: 1460, top: 330 + i * 90, display: "flex", alignItems: "center", gap: 18, opacity: P[i], transform: `translateX(${(1 - P[i]) * 60}px)` }}>
      <div style={{ width: 44, height: 44, borderRadius: 22, background: i === 4 ? AMB : GRN, color: "#111", fontWeight: 900, fontSize: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
      <div style={{ fontWeight: 900, fontSize: 40 }}>{l}</div>
    </div>)}
  </>;
}}</Stage>;

// ---- 2:32 · EL TAMBOR ESTÁNDAR: plano con las cotas 57 × 88 y la lupa sobre la chapa de 1 mm ----
export const HDims: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="#0f2a4a">{(tt) => {
  const d1 = eio(tt, 0.8, 1.8), d2 = eio(tt, 2.2, 3.2), lp = cl(phys(tt, 4.0, 6, 0.55));
  return <>
    <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
    <Head tt={tt} kick="LO QUE MIDE" title="UN TAMBOR DE 200 LITROS" col={ICE} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <g stroke="#cfe6ff" strokeWidth={5} fill="rgba(143,214,255,.06)">
        <ellipse cx={760} cy={330} rx={230} ry={50} /><path d="M530 330 L530 900 A230 50 0 0 0 990 900 L990 330" />
        <path d="M530 520 A230 50 0 0 0 990 520" fill="none" opacity={0.6} /><path d="M530 710 A230 50 0 0 0 990 710" fill="none" opacity={0.6} />
      </g>
      <g stroke={AMB} strokeWidth={4} fill={AMB}>
        <line x1={530} y1={1000} x2={530 + 460 * d1} y2={1000} /><line x1={530} y1={980} x2={530} y2={1020} />{d1 > 0.98 && <line x1={990} y1={980} x2={990} y2={1020} />}
        <line x1={1060} y1={330} x2={1060} y2={330 + 570 * d2} /><line x1={1040} y1={330} x2={1080} y2={330} />{d2 > 0.98 && <line x1={1040} y1={900} x2={1080} y2={900} />}
      </g>
    </svg>
    <div style={{ position: "absolute", left: 760, top: 1030, transform: "translate(-50%,-50%)", fontFamily: HAND, fontWeight: 700, fontSize: 64, color: AMB, opacity: d1 }}>57 cm</div>
    <div style={{ position: "absolute", left: 1100, top: 615, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: AMB, opacity: d2 }}>88 cm</div>
    {/* lupa sobre la chapa */}
    <div style={{ position: "absolute", left: 1440, top: 560, transform: `translate(-50%,-50%) scale(${lp})`, width: 420, height: 420, borderRadius: "50%", border: "14px solid #d8d4cc", background: "radial-gradient(circle,#1c3556,#0b1a2e)", overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 80, top: 60, width: 60, height: 300, background: "linear-gradient(90deg,#6a6a72,#d0d0d8,#6a6a72)", borderRadius: 4 }} />
      <div style={{ position: "absolute", left: 160, top: 170, fontWeight: 900, fontSize: 62, color: TX }}>1 mm</div>
      <div style={{ position: "absolute", left: 160, top: 250, fontWeight: 800, fontSize: 28, color: DIM }}>DE CHAPA</div>
    </div>
    {lp > 0.1 && <div style={{ position: "absolute", left: 990, top: 600, width: 260 * lp, height: 6, background: "#d8d4cc", transform: "rotate(-4deg)", transformOrigin: "left" }} />}
  </>;
}}</Stage>;

// ---- 3:15 · VACÍO NO ES SEGURO: el vapor invisible adentro, la chispa de la amoladora y la tapa que vuela como un plato ----
export const HBlast: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split" bg="radial-gradient(ellipse at 50% 50%, #2a1414, #080606 75%)">{(tt) => {
  const blow = h.blowAt !== undefined ? (h.blowAt as number) - h.at : 3.2, b = tt - blow, fly = b > 0 ? b : 0, glow = cl(b * 1.5) * cl(1 - (b - 0.8) * 0.8);
  return <>
    <Head tt={tt} kick="NAFTA · VACÍO · SECO" title="EL VAPOR NO SE VE" col={RED} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <defs><linearGradient id="hbdr" x1="0" x2="1"><stop offset="0" stopColor="#1a2a20" /><stop offset=".35" stopColor="#4e6b52" /><stop offset=".7" stopColor="#2c4030" /><stop offset="1" stopColor="#101a12" /></linearGradient></defs>
      <path d="M720 420 L720 920 A240 50 0 0 0 1200 920 L1200 420" fill="url(#hbdr)" />
      <ellipse cx={960} cy={920} rx={240} ry={50} fill="none" stroke="rgba(0,0,0,.4)" strokeWidth={4} />
      {Array.from({ length: 36 }, (_, i) => { const x = 760 + (i * 97) % 400, y = 480 + (i * 61) % 400 + 14 * Math.sin(tt * 1.5 + i); return <circle key={i} cx={x} cy={y - (fly > 0 ? fly * 300 : 0)} r={10 + (i % 4) * 4} fill="rgba(180,255,170,.22)" opacity={cl(tt - 0.6) * (fly > 0 ? cl(1 - fly) : 1)} />; })}
    </svg>
    <div style={{ position: "absolute", left: 960, top: 420, width: 520, height: 110, transform: `translate(-50%,-50%) translateY(${-fly * 700 + fly * fly * 120}px) rotateX(60deg) rotate(${fly * 420}deg)`, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%,#6e8f72,#2c4030)", boxShadow: "0 0 0 8px rgba(0,0,0,.3)" }} />
    {/* amoladora */}
    {b < 0 && <><div style={{ position: "absolute", left: 1180, top: 330, width: 260, height: 70, borderRadius: 30, background: "linear-gradient(180deg,#2d6bd1,#163a7a)", transform: "rotate(18deg)", opacity: cl(tt - 1.2) }} /><Spark x={1150} y={410} tt={tt} on={cl(tt - 1.6)} /></>}
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 40%, rgba(255,150,60,.55), transparent 55%)", opacity: glow }} />
    <Tag tt={tt} at={0.9} x={380} y={560} txt="NO SE VE" col="rgba(180,255,170,.9)" size={46} />
    <Tag tt={tt} at={1.4} x={380} y={630} txt="NO HUELE" col="rgba(180,255,170,.9)" size={46} />
    {b > 0.3 && <Tag tt={tt} at={blow + 0.4} x={1500} y={760} txt="LA TAPA, COMO UN PLATO" col={RED} size={44} />}
  </>;
}}</Stage>;

// ---- 3:33 · ¿QUÉ TUVO ADENTRO?: tres pruebas que se dan vuelta de a una (etiqueta, oler las bocas, preguntar) ----
export const HChecks: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const T = (h.steps as number[] | undefined) ?? [h.at + 0.6, h.at + 2.4, h.at + 4.2];
  const IC = [
    <svg key="a" width={200} height={200} viewBox="0 0 200 200"><rect x={40} y={30} width={120} height={150} rx={14} fill="#e9dcc0" /><rect x={58} y={60} width={84} height={12} rx={6} fill="#8a6a3a" /><rect x={58} y={88} width={64} height={10} rx={5} fill="#b19a6e" /><text x={100} y={150} textAnchor="middle" fontSize={34} fontWeight={900} fill={RED}>ACEITE</text></svg>,
    <svg key="b" width={200} height={200} viewBox="0 0 200 200"><circle cx={70} cy={120} r={34} fill="#333" stroke="#777" strokeWidth={8} /><circle cx={150} cy={130} r={20} fill="#333" stroke="#777" strokeWidth={6} />{[0, 1, 2].map((k) => <path key={k} d={`M${60 + k * 18} 80 q-12 -18 0 -36 q12 -18 0 -36`} stroke={ICE} strokeWidth={6} fill="none" opacity={0.4 + 0.6 * ((tt * 1.5 + k / 3) % 1)} />)}</svg>,
    <svg key="c" width={200} height={200} viewBox="0 0 200 200"><path d="M30 40 h140 a16 16 0 0 1 16 16 v70 a16 16 0 0 1 -16 16 h-80 l-36 30 v-30 h-24 a16 16 0 0 1 -16 -16 v-70 a16 16 0 0 1 16 -16 z" fill="#f2efe8" /><text x={100} y={110} textAnchor="middle" fontSize={64} fontWeight={900} fill="#222">¿?</text></svg>,
  ];
  const L = ["LA ETIQUETA", "OLER LAS BOCAS", "PREGUNTAR"];
  return <>
    <Head tt={tt} kick="ANTES DE CORTAR" title="¿QUÉ TUVO ADENTRO?" col={RED} />
    {L.map((l, i) => { const s = cl(phys(tt, T[i] - h.at, 5.5, 0.5)); return <div key={i} style={{ position: "absolute", left: 300 + i * 460, top: 330, width: 400, height: 520, perspective: 1200 }}>
      <div style={{ width: "100%", height: "100%", borderRadius: 30, background: "linear-gradient(160deg,#2a2622,#141210)", boxShadow: `0 40px 90px rgba(0,0,0,.6), 0 0 0 2px ${s > 0.5 ? AMB : "rgba(255,255,255,.12)"}`, transform: `rotateY(${(1 - s) * 180}deg)`, backfaceVisibility: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 30, opacity: s > 0.5 ? 1 : 0.15 }}>
        <div style={{ fontWeight: 900, fontSize: 90, color: AMB, lineHeight: 1 }}>{i + 1}</div>{IC[i]}<div style={{ fontWeight: 900, fontSize: 38 }}>{l}</div>
      </div>
    </div>; })}
  </>;
}}</Stage>;

// ---- 4:18 · EL SEMÁFORO DE LOS TAMBORES: verde, amarillo y rojo se prenden con lo que tuvieron ----
export const HSemaphore: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const T = (h.steps as number[] | undefined) ?? [h.at + 0.5, h.at + 3, h.at + 5.5];
  const R = [{ c: GRN, a: "ACEITE · GRASA · COMIDA", b: "LOS MEJORES" }, { c: AMB, a: "ACEITE DE MOTOR", b: "LAVAR BIEN" }, { c: RED, a: "NAFTA · SOLVENTE · PINTURA", b: "DEJALO" }];
  return <>
    <Head tt={tt} kick="PARA UNA ESTUFA" title="¿SIRVE O NO SIRVE?" />
    <div style={{ position: "absolute", left: 250, top: 300, width: 220, height: 640, borderRadius: 40, background: "linear-gradient(90deg,#1b1b1e,#3a3a40,#1b1b1e)", boxShadow: "0 40px 90px rgba(0,0,0,.7)" }}>
      {R.map((r, i) => { const on = cl((tt - (T[i] - h.at)) * 3); return <div key={i} style={{ position: "absolute", left: 30, top: 30 + i * 200, width: 160, height: 160, borderRadius: "50%", background: on > 0 ? `radial-gradient(circle at 40% 35%, #fff, ${r.c} 40%, ${r.c}88)` : "#202024", opacity: 0.25 + 0.75 * on, boxShadow: on > 0 ? `0 0 ${80 * on}px ${r.c}` : "inset 0 0 30px #000" }} />; })}
    </div>
    {R.map((r, i) => { const s = cl(phys(tt, T[i] - h.at + 0.15, 6, 0.55)); return <div key={i} style={{ position: "absolute", left: 600, top: 340 + i * 200, opacity: s, transform: `translateX(${(1 - s) * 80}px)`, display: "flex", alignItems: "center", gap: 36 }}>
      <div style={{ width: 150, height: 120, position: "relative" }}><DrumSide x={75} y={60} w={150} h={90} tone={i === 2 ? "blue" : "rust"} /></div>
      <div><div style={{ fontWeight: 900, fontSize: 46 }}>{r.a}</div><div style={{ fontWeight: 900, fontSize: 34, color: r.c, letterSpacing: 3 }}>{r.b}</div></div>
    </div>; })}
  </>;
}}</Stage>;

// ---- 4:55 · LOS NUDILLOS: golpes a lo largo del tambor; donde suena hueco, la onda se rompe en rojo ----
export const HKnock: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const X = [520, 760, 1000, 1240], k = Math.min(3, Math.floor(cl((tt - 0.8) / 4.4) * 4)), lt = (tt - 0.8) - k * 1.1;
  return <>
    <Head tt={tt} kick="GOLPEALO POR TODOS LADOS" title="TIENE QUE SONAR PAREJO" />
    <DrumSide x={900} y={640} w={980} h={360} tone="rust">
      <div style={{ position: "absolute", left: 1240 - 410 - 70, top: 120, width: 140, height: 120, borderRadius: "50%", background: "radial-gradient(circle,#160a04,#3a1c0e 60%,transparent 72%)", opacity: k >= 3 ? 1 : 0.5 }} />
    </DrumSide>
    {X.slice(0, k + 1).map((x, i) => { const bad = i === 3, a = i === k ? lt : 1.4; return <React.Fragment key={i}>
      {[0, 1, 2].map((r) => { const g = cl(a * 1.4 - r * 0.25); return g > 0 && g < 1 && <div key={r} style={{ position: "absolute", left: x - 30 - g * 120, top: 640 - 30 - g * 120, width: 60 + g * 240, height: 60 + g * 240, borderRadius: "50%", border: `${bad ? 6 : 5}px ${bad ? "dashed" : "solid"} ${bad ? RED : GRN}`, opacity: 1 - g }} />; })}
      <div style={{ position: "absolute", left: x, top: i % 2 ? 940 : 880, transform: "translate(-50%,0)", fontWeight: 900, fontSize: 34, color: bad ? RED : GRN, opacity: cl(a * 3) }}>{bad ? "HUECO = PODRIDO" : "PAREJO ✓"}</div>
    </React.Fragment>; })}
    {/* el puño */}
    <div style={{ position: "absolute", left: X[k] - 55, top: 400 - 60 * Math.abs(Math.sin(cl(lt) * Math.PI)), width: 110, height: 90, borderRadius: "40px 40px 30px 30px", background: "linear-gradient(180deg,#d9a27a,#a86f48)", boxShadow: "0 20px 30px rgba(0,0,0,.4)" }}>
      {[0, 1, 2, 3].map((j) => <div key={j} style={{ position: "absolute", left: 10 + j * 24, top: 66, width: 18, height: 10, borderRadius: 5, background: "rgba(0,0,0,.18)" }} />)}
    </div>
  </>;
}}</Stage>;

// ---- 5:50 · RODARLO: el tambor gira por el piso con el agua jabonosa adentro, tres veces ----
export const HRoll: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const x = 960 + 420 * Math.sin(tt * 0.9), rot = -420 * Math.sin(tt * 0.9) / 260 * 57.3, vel = Math.cos(tt * 0.9), pass = Math.min(3, 1 + Math.floor(tt * 0.9 / Math.PI + 0.5));
  return <>
    <Head tt={tt} kick="AGUA CALIENTE + DETERGENTE" title="LO HACÉS RODAR" col={ICE} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, height: 6, background: "rgba(255,255,255,.2)" }} />
    <div style={{ position: "absolute", left: x - 260, top: 860 - 520, width: 520, height: 520, borderRadius: "50%", overflow: "hidden", background: "radial-gradient(circle,#2a140b,#120804)", boxShadow: "0 0 0 22px #74391a, 0 40px 80px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: -60, right: -60, top: 290 + 30 * vel * 0.2, height: 300, background: "linear-gradient(180deg,rgba(143,214,255,.85),rgba(60,120,170,.9))", transform: `rotate(${-14 * vel}deg)`, borderTop: "8px solid rgba(255,255,255,.6)" }}>
        {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: `${(i * 41 + tt * 30) % 100}%`, top: -18 + (i % 3) * 8, width: 22 + (i % 4) * 8, height: 22 + (i % 4) * 8, borderRadius: "50%", border: "3px solid rgba(255,255,255,.8)" }} />)}
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `rotate(${rot}deg)` }}>
        <div style={{ position: "absolute", left: 300, top: 120, width: 56, height: 56, borderRadius: "50%", background: "#3a3a3a", boxShadow: "0 0 0 8px #74391a" }} />
        <div style={{ position: "absolute", left: 150, top: 150, width: 32, height: 32, borderRadius: "50%", background: "#3a3a3a", boxShadow: "0 0 0 6px #74391a" }} />
      </div>
    </div>
    <div style={{ position: "absolute", right: 140, top: 300, display: "flex", gap: 20 }}>{[1, 2, 3].map((n) => <div key={n} style={{ width: 110, height: 110, borderRadius: 24, border: `5px solid ${n <= pass ? ICE : "rgba(255,255,255,.2)"}`, background: n <= pass ? "rgba(143,214,255,.18)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 56, color: n <= pass ? ICE : DIM }}>{n}</div>)}</div>
    <Tag tt={tt} at={1.2} x={1560} y={460} txt="3 VECES" col={ICE} size={40} />
  </>;
}}</Stage>;

// ---- 6:15 · UNA SEMANA AL SOL: siete días que se tachan y el vapor que sale de las bocas se va apagando ----
export const HWeek: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="blinds" bg="radial-gradient(ellipse at 50% 20%, #3a2c14, #0c0a06 75%)">{(tt) => {
  const day = cl((tt - 0.8) / 5) * 7, D = ["L", "M", "M", "J", "V", "S", "D"], sunA = (day % 1) * Math.PI, ok = cl(tt - 6.2);
  return <>
    <Head tt={tt} kick="DESTAPADO, ACOSTADO" title="UNA SEMANA AL SOL" />
    <div style={{ position: "absolute", left: 960 + Math.cos(Math.PI - sunA) * 620 - 60, top: 600 - Math.sin(sunA) * 330 - 60, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle,#fff6c8,#ffc94a 55%,rgba(255,170,40,0))", boxShadow: "0 0 90px #ffb43a" }} />
    <DrumSide x={900} y={720} w={760} h={300} tone="burnt" />
    {[0, 1].map((j) => Array.from({ length: 5 }, (_, i) => { const ph = (tt * 0.6 + i / 5) % 1, pow = cl(1 - day / 7); return <div key={`${j}${i}`} style={{ position: "absolute", left: 1220 + j * 50 + Math.sin(ph * 6 + i) * 20, top: 610 - ph * 260, width: 40 + ph * 60, height: 40 + ph * 60, borderRadius: "50%", background: "rgba(220,230,210,.35)", filter: "blur(8px)", opacity: pow * (1 - ph) }} />; }))}
    <div style={{ position: "absolute", left: 360, top: 920, display: "flex", gap: 16 }}>{D.map((d, i) => { const done = day > i + 1; return <div key={i} style={{ width: 150, height: 90, borderRadius: 16, background: done ? "rgba(255,200,90,.22)" : "rgba(255,255,255,.06)", border: `3px solid ${done ? AMB : "rgba(255,255,255,.15)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 40, color: done ? AMB : DIM, position: "relative" }}>{d}{done && <div style={{ position: "absolute", left: 20, right: 20, top: 42, height: 6, background: AMB, transform: "rotate(-14deg)" }} />}</div>; })}</div>
    <div style={{ position: "absolute", left: 1500, top: 420, opacity: ok, transform: `scale(${0.8 + 0.2 * ok})`, textAlign: "center" }}><div style={{ width: 120, height: 120, margin: "0 auto 14px", borderRadius: "50%", border: `8px solid ${GRN}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 70, color: GRN }}>✓</div><div style={{ fontWeight: 900, fontSize: 34, color: GRN }}>SÓLO CHAPA MOJADA ✓</div></div>
  </>;
}}</Stage>;

// ---- 6:33 · CORTARLO LLENO DE AGUA: el agua sube y el espacio para vapores desaparece; la línea de corte queda justo arriba ----
export const HWaterCut: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const lv = eio(tt, 0.8, 3.6) * 0.82, cut = eio(tt, 4.0, 5.6), H0 = 560, top = 300;
  return <>
    <Head tt={tt} kick="EL TRUCO DE LOS QUE SABEN" title="CORTARLO LLENO DE AGUA" col={ICE} />
    <div style={{ position: "absolute", left: 700, top, width: 520, height: H0, borderRadius: 30, overflow: "hidden", background: "rgba(255,255,255,.04)", boxShadow: "0 0 0 16px #74391a, 0 40px 90px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: H0 * (1 - lv), background: "repeating-linear-gradient(45deg, rgba(255,90,74,.28) 0 14px, transparent 14px 28px)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: H0 * lv, background: "linear-gradient(180deg,rgba(143,214,255,.9),rgba(40,100,160,.95))" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: -6, height: 12, background: `repeating-radial-gradient(circle at ${tt * 40}px 6px, rgba(255,255,255,.7) 0 4px, transparent 4px 18px)` }} />
      </div>
    </div>
    <div style={{ position: "absolute", left: 660, top: top + H0 * (1 - lv) - 26, width: 600 * cut, height: 0, borderTop: `6px dashed ${AMB}`, opacity: cut > 0 ? 1 : 0 }} />
    {cut > 0 && cut < 1 && <Spark x={660 + 600 * cut} y={top + H0 * (1 - lv) - 26} tt={tt} n={10} />}
    <Tag tt={tt} at={1.6} x={420} y={top + 40} txt="VAPOR: SIN LUGAR" col={RED} size={40} />
    <Tag tt={tt} at={4.2} x={1500} y={top + H0 * (1 - lv) - 26} txt="CORTE ACÁ" col={AMB} size={40} />
    <div style={{ position: "absolute", left: 960, top: 940, transform: "translateX(-50%)", fontWeight: 900, fontSize: 64, color: ICE, opacity: cl(tt - 2.4) }}>{Math.round(lv * 100 / 0.82 * 0.9)}% AGUA</div>
  </>;
}}</Stage>;

// ---- 7:22 · LEJOS DE TODO: el patio visto de arriba, el viento se lleva el humo lejos de la casa ----
export const HYard: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse at 50% 50%, #26301e, #0b0f08 80%)">{(tt) => {
  const s = (a: number) => cl(phys(tt, a, 6, 0.55)), ring = eio(tt, 2.2, 3.4);
  return <>
    <Head tt={tt} kick="LA PINTURA SE QUEMA AFUERA" title="LEJOS DE TODO" />
    <div style={{ position: "absolute", left: 260, top: 330, width: 420, height: 360, borderRadius: 10, background: "linear-gradient(135deg,#6b4a3a,#4a3024)", transform: `scale(${s(0.4)})`, boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}><div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg, rgba(0,0,0,.18) 0 4px, transparent 4px 40px)" }} /><div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontWeight: 900, fontSize: 40 }}>CASA</div></div>
    {[[1560, 330], [1660, 520]].map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x - 90, top: y - 90, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle at 40% 40%,#4f8a3a,#23451a)", transform: `scale(${s(0.6 + i * 0.15)})` }} />)}
    <div style={{ position: "absolute", left: 1060 - 380 * ring, top: 700 - 380 * ring, width: 760 * ring, height: 760 * ring, borderRadius: "50%", border: `5px dashed ${AMB}`, opacity: 0.7 }} />
    <div style={{ position: "absolute", left: 1060 - 70, top: 700 - 70, width: 140, height: 140, borderRadius: "50%", background: "radial-gradient(circle,#ffd27a,#ff7a1a 35%,#3a1c0e 60%)", boxShadow: "0 0 0 14px #33241d, 0 0 80px rgba(255,140,40,.6)", transform: `scale(${s(1.0)})` }} />
    {Array.from({ length: 12 }, (_, i) => { const ph = (tt * 0.45 + i / 12) % 1; return <div key={i} style={{ position: "absolute", left: 1060 + ph * 700, top: 700 + ph * 260 + Math.sin(ph * 8 + i) * 30, width: 60 + ph * 140, height: 60 + ph * 140, borderRadius: "50%", background: "rgba(90,90,90,.5)", filter: "blur(12px)", opacity: cl(tt - 1.4) * (1 - ph), transform: "translate(-50%,-50%)" }} />; })}
    <svg width={300} height={120} style={{ position: "absolute", left: 1100, top: 900, opacity: cl(tt - 1.8) }}><path d="M10 60 L250 60" stroke={ICE} strokeWidth={8} strokeLinecap="round" /><path d="M220 30 L270 60 L220 90" stroke={ICE} strokeWidth={8} fill="none" strokeLinecap="round" /></svg>
    <Tag tt={tt} at={2.0} x={1260} y={1010} txt="EL VIENTO, LEJOS DE LA CASA" col={ICE} size={32} />
    <Tag tt={tt} at={3.0} x={1060} y={560} txt="SOBRE TIERRA" col={AMB} size={30} />
  </>;
}}</Stage>;

// ---- 7:37 · LA PINTURA SE AMPOLLA: la chapa pintada se llena de ampollas, se pone negra y se cae sola; reloj de una hora ----
export const HBlister: React.FC<{ t: number; h: H }> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const p = eio(tt, 0.6, 6.2), bl = cl(p * 2.2), dark = cl(p * 2 - 0.5), fall = cl(p * 2 - 1);
  return <>
    <Head tt={tt} kick="UNA HORA DE FUEGO" title="SE AMPOLLA Y SE CAE SOLA" />
    <div style={{ position: "absolute", left: 300, top: 300, width: 1000, height: 620, borderRadius: 24, overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.7)", background: "radial-gradient(ellipse at 40% 35%,#8a4a24,#4a2412 60%,#1e0f08)" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-radial-gradient(circle at 30% 60%, rgba(0,0,0,.12) 0 6px, transparent 6px 22px)", opacity: fall }} />
      {Array.from({ length: 40 }, (_, i) => { const x = (i * 211) % 960, y = (i * 137) % 580, s = 50 + (i * 23) % 90, gone = cl(fall * 1.6 - (i % 7) / 7); return <div key={i} style={{ position: "absolute", left: x - s / 2, top: y - s / 2 + gone * gone * 500, width: s, height: s * 0.9, borderRadius: "46% 54% 50% 50%", opacity: 1 - gone, transform: `rotate(${gone * (i % 2 ? 90 : -90)}deg)`, background: `radial-gradient(circle at 40% 35%, ${dark > 0.5 ? "#2a2522" : "#7fb2e6"}, ${dark > 0.5 ? "#0e0c0b" : "#2e5f96"} 70%)`, boxShadow: `inset 0 ${-8 * bl}px ${16 * bl}px rgba(0,0,0,.4), 0 ${6 * bl}px ${14 * bl}px rgba(0,0,0,.35)` }} />; })}
      <div style={{ position: "absolute", inset: 0, background: `rgba(30,60,100,${0.75 * (1 - Math.max(bl, fall))})` }} />
    </div>
    <div style={{ position: "absolute", left: 1460, top: 420, width: 280, height: 280, borderRadius: "50%", border: "12px solid #d8d4cc", background: "#141210", boxShadow: "0 30px 70px rgba(0,0,0,.6)" }}>
      <svg width={256} height={256} style={{ position: "absolute", inset: 0 }}><path d={`M128 128 L128 20 A108 108 0 ${p > 0.5 ? 1 : 0} 1 ${128 + 108 * Math.sin(p * 2 * Math.PI)} ${128 - 108 * Math.cos(p * 2 * Math.PI)} Z`} fill="rgba(255,178,87,.55)" /></svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 100, textAlign: "center", fontWeight: 900, fontSize: 50 }}>{Math.round(p * 60)}′</div>
    </div>
    {["AMPOLLAS", "NEGRA", "SE CAE"].map((l, i) => <Tag key={i} tt={tt} at={1.2 + i * 1.8} x={1600} y={780 + i * 60} txt={l} col={[ICE, DIM, AMB][i]} size={34} />)}
  </>;
}}</Stage>;
