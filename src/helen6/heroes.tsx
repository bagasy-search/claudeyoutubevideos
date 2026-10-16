// helen6 · componentes PROPIOS (8 trucos: piel de muslo de pollo crocante, 80 centavos el muslo). PURO CSS: cero imágenes.
// Identidad distinta de helen4/helen5: el SARTÉN DE HIERRO y la piel dorada. Materiales dibujados con gradientes: hierro fundido,
// esmalte blanco de cocina, delantal azul a rayitas de Helen, papel de carnicería, pizarra de tiza, acero cepillado, ticket térmico.
// Fuentes (2): Oswald (rótulos) + Caveat (letra de Helen). Paleta: azul delantal, dorado piel, crema esmalte, rojo tomate, hierro.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";
import { sp, ez, cl, fr } from "../lkit/core";

const OSW = loadOswald().fontFamily;
const CAV = loadCaveat().fontFamily;
const NAVY = "#1E2C48", GOLD = "#E5A53C", CRISP = "#B86A22", CREAM = "#FBF4E4", RED = "#B9372B", INK = "#1C1814", GREEN = "#3B7A4C", ICE = "#9CC7E6", PINK = "#E8B4A6";
const SH = "0 2px 3px rgba(0,0,0,.28), 0 14px 28px rgba(0,0,0,.28), 0 44px 80px rgba(0,0,0,.32)";
type B = { a: number; a0?: number; d: number };
const useT0 = (a: number, a0?: number) => { const f0 = useCurrentFrame(); const s = a0 ?? a; return { f: f0 + fr(a) - fr(s), at: (t: number) => fr(t) - fr(s) }; };
const rnd = (i: number) => { const x = Math.sin(i * 77.3 + 11.9) * 43758.5453; return x - Math.floor(x); };
const pos = (p: React.CSSProperties): React.CSSProperties => ({ position: "absolute", ...p });

// ── materiales ──
const IRON = "radial-gradient(circle at 20% 30%, rgba(255,255,255,.05) 0 1px, transparent 2px) 0 0/23px 19px, radial-gradient(circle at 60% 70%, rgba(0,0,0,.35) 0 1.5px, transparent 2.5px) 0 0/17px 21px, radial-gradient(ellipse 70% 60% at 50% 35%, #3a3634, #1b1918 70%, #0e0d0c)";
const APRON = "repeating-linear-gradient(90deg, rgba(255,255,255,.22) 0 3px, transparent 3px 46px), repeating-linear-gradient(0deg, rgba(255,255,255,.025) 0 1px, transparent 1px 5px), radial-gradient(ellipse 80% 70% at 30% 20%, #2c3f63, #1a2640 70%, #121b2e)";
const ENAMEL = "radial-gradient(ellipse 55% 45% at 28% 18%, rgba(255,255,255,.85), transparent 70%), repeating-linear-gradient(0deg, rgba(0,0,0,.012) 0 2px, transparent 2px 7px), linear-gradient(90deg, #E7E2D5, #FBF8F1 35%, #F1ECE0 70%, #DCD6C7)";
const BUTCHER = "repeating-linear-gradient(97deg, rgba(150,90,80,.06) 0 2px, transparent 2px 9px), repeating-linear-gradient(7deg, rgba(255,255,255,.08) 0 1px, transparent 1px 5px), radial-gradient(ellipse at 40% 30%, #F7E9E2, #E9D2C7 80%)";
const CHALK = "radial-gradient(ellipse 45% 35% at 30% 30%, rgba(255,255,255,.07), transparent), radial-gradient(ellipse 30% 25% at 75% 70%, rgba(255,255,255,.05), transparent), repeating-linear-gradient(-12deg, rgba(255,255,255,.018) 0 2px, transparent 2px 9px), linear-gradient(160deg, #2C3A33, #1A2420)";
const STEEL = "repeating-linear-gradient(90deg, rgba(255,255,255,.07) 0 1px, transparent 1px 3px, rgba(0,0,0,.05) 3px 4px, transparent 4px 7px), linear-gradient(180deg, #d9dde1, #b7bdc3 50%, #cfd4d8)";
const CORK = "radial-gradient(circle at 30% 40%, rgba(90,50,20,.35) 0 2px, transparent 3px) 0 0/14px 13px, radial-gradient(circle at 70% 20%, rgba(255,230,190,.25) 0 1.5px, transparent 2.5px) 0 0/11px 17px, linear-gradient(135deg, #C08A57, #A8743F)";
const WOOD = "repeating-linear-gradient(88deg, rgba(60,30,10,.18) 0 3px, transparent 3px 22px, rgba(60,30,10,.1) 22px 24px, transparent 24px 61px), linear-gradient(180deg, #8a5a33, #6b4325)";
const Light: React.FC<{ x?: number; y?: number; o?: number }> = ({ x = 70, y = 0, o = 0.26 }) => (
  <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse 70% 80% at ${x}% ${y}%, rgba(255,244,220,${o}), transparent 60%), linear-gradient(180deg, transparent 62%, rgba(0,0,0,.28))` }} />
);
const Bg: React.FC<{ m: string; f: number; x?: number; o?: number }> = ({ m, f, x, o }) => (
  <>
    <AbsoluteFill style={{ transform: `scale(${1.06 + 0.00012 * f}) translateX(${-0.03 * f}px)` }}><AbsoluteFill style={{ background: m }} /></AbsoluteFill>
    <Light x={x} o={o} />
  </>
);
const Sheen: React.FC<{ f: number; at: number; o?: number }> = ({ f, at, o = 0.32 }) => {
  const u = (f - at) / 26; if (u < 0 || u > 1) return null;
  return <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", background: `linear-gradient(110deg, transparent ${u * 140 - 40}%, rgba(255,255,255,${o}) ${u * 140 - 30}%, transparent ${u * 140 - 20}%)` }} />;
};
// ── piezas ──
const Txt: React.FC<{ txt: string; size: number; color?: string; w?: number; style?: React.CSSProperties; ls?: number }> = ({ txt, size, color = INK, w = 700, style, ls = 1 }) => (
  <div style={{ fontFamily: OSW, fontWeight: w, fontSize: size, color, lineHeight: 0.98, letterSpacing: ls, whiteSpace: "nowrap", textTransform: "uppercase", ...style }}>{txt}</div>
);
const Hand: React.FC<{ txt: string; size: number; color?: string; f?: number; at?: number; dur?: number; style?: React.CSSProperties; chalk?: boolean }> = ({ txt, size, color = INK, f = 999, at = 0, dur = 16, style, chalk }) => (
  <div style={{ fontFamily: CAV, fontWeight: 700, fontSize: size, color, lineHeight: 1.0, whiteSpace: "nowrap", paddingRight: 16, clipPath: `inset(-30% ${100 - 112 * ez((f - at) / dur)}% -30% -4%)`,
    textShadow: chalk ? "0 0 2px rgba(255,255,255,.55), 1px 1px 0 rgba(255,255,255,.12), -1px 0 0 rgba(255,255,255,.1)" : undefined, ...style }}>{txt}</div>
);
const pop = (f: number, at: number) => { const u = sp(f, at, 10, 200); return { opacity: cl(u * 3), transform: `scale(${0.5 + 0.5 * u})` }; };
const drop = (f: number, at: number, dy = -520, rot = 8) => { const u = sp(f, at, 12, 150); return { opacity: cl(u * 2), transform: `translateY(${dy * (1 - u)}px) rotate(${rot * (1 - u)}deg)` }; };
const slide = (f: number, at: number, dx = 700) => { const u = sp(f, at, 14, 130); return { opacity: cl(u * 2), transform: `translateX(${dx * (1 - u)}px)` }; };
const flipIn = (f: number, at: number) => { const u = sp(f, at, 14, 120); return { opacity: cl(u * 2), transform: `perspective(1200px) rotateX(${(1 - u) * 75}deg)`, transformOrigin: "50% 0%" }; };
const Tick: React.FC<{ f: number; at: number; s?: number; c?: string }> = ({ f, at, s = 54, c = GREEN }) => {
  const u = sp(f, at, 11, 200);
  return <div style={{ width: s * 0.45, height: s * 0.9, borderRight: `${s * 0.18}px solid ${c}`, borderBottom: `${s * 0.18}px solid ${c}`, transform: `rotate(40deg) scale(${u})`, opacity: cl(u * 3), flex: "none", margin: `0 ${s * 0.35}px 0 ${s * 0.1}px` }} />;
};
const Cross: React.FC<{ f: number; at: number; s?: number; c?: string }> = ({ f, at, s = 60, c = RED }) => {
  const u1 = ez((f - at) / 6), u2 = ez((f - at - 4) / 6);
  return (
    <div style={{ position: "relative", width: s, height: s, flex: "none", marginRight: s * 0.3 }}>
      <div style={pos({ left: s * 0.08, top: s * 0.02, width: s * 1.2 * u1, height: s * 0.17, borderRadius: 6, background: c, transform: "rotate(45deg)", transformOrigin: "0 50%" })} />
      <div style={pos({ left: s * 0.92, top: s * 0.02, width: s * 1.2 * u2, height: s * 0.17, borderRadius: 6, background: c, transform: "rotate(135deg)", transformOrigin: "0 50%" })} />
    </div>
  );
};
const Strike: React.FC<{ f: number; at: number; c?: string }> = ({ f, at, c = RED }) => (
  <div style={pos({ left: -12, right: -12, top: "50%", height: 10, borderRadius: 5, background: c, transformOrigin: "left", transform: `rotate(-4deg) scaleX(${ez((f - at) / 8)})`, boxShadow: "0 2px 3px rgba(0,0,0,.3)" })} />
);
const Stamp: React.FC<{ txt: string; f: number; at: number; c?: string; size?: number; rot?: number; style?: React.CSSProperties }> = ({ txt, f, at, c = RED, size = 70, rot = -8, style }) => {
  const u = sp(f, at, 9, 260);
  return (
    <div style={{ display: "inline-block", padding: `${size * 0.12}px ${size * 0.35}px`, border: `${size * 0.09}px solid ${c}`, borderRadius: size * 0.16, color: c, opacity: cl(u * 3) * 0.92,
      transform: `rotate(${rot}deg) scale(${2.2 - 1.2 * u})`, fontFamily: OSW, fontWeight: 700, fontSize: size, letterSpacing: 3, textTransform: "uppercase", whiteSpace: "nowrap",
      background: "repeating-linear-gradient(45deg, rgba(255,255,255,.0) 0 3px, rgba(255,255,255,.12) 3px 4px)", mixBlendMode: "multiply", ...style }}>{txt}</div>
  );
};
const Tape: React.FC<{ w: number; rot?: number; style?: React.CSSProperties }> = ({ w, rot = -4, style }) => (
  <div style={{ width: w, height: 46, transform: `rotate(${rot}deg)`, background: "linear-gradient(180deg, rgba(255,255,255,.35), rgba(255,255,255,.1)), rgba(236,224,190,.85)", boxShadow: "0 3px 6px rgba(0,0,0,.2)",
    clipPath: "polygon(0 8%, 4% 0, 8% 10%, 12% 2%, 100% 0, 97% 40%, 100% 70%, 96% 100%, 5% 96%, 0 70%, 3% 40%)", ...style }} />
);
// muslo dorado visto desde arriba (forma de gota, piel con burbujitas)
const Thigh: React.FC<{ w: number; raw?: boolean; rot?: number; style?: React.CSSProperties; crack?: number }> = ({ w, raw, rot = 0, style, crack = 0 }) => (
  <div style={{ position: "relative", width: w, height: w * 0.78, transform: `rotate(${rot}deg)`, ...style }}>
    <div style={pos({ inset: 0, borderRadius: "48% 52% 44% 56% / 58% 50% 50% 42%", boxShadow: "0 6px 10px rgba(0,0,0,.45), inset -10px -14px 22px rgba(0,0,0,.28), inset 10px 10px 18px rgba(255,255,255,.25)",
      background: raw ? "radial-gradient(circle at 30% 30%, rgba(255,255,255,.35) 0 2px, transparent 3px) 0 0/17px 15px, radial-gradient(ellipse at 40% 35%, #F3D9CC, #E6B9A6 70%, #D59E8B)"
        : "radial-gradient(circle at 35% 35%, rgba(255,240,200,.55) 0 2px, rgba(120,60,10,.25) 3px, transparent 4px) 0 0/15px 13px, radial-gradient(circle at 70% 60%, rgba(255,230,170,.5) 0 1.5px, transparent 3px) 0 0/11px 12px, radial-gradient(ellipse at 40% 35%, #F2BE5C, #D88E2F 55%, #A75C1B)" })} />
    {crack > 0 ? Array.from({ length: 6 }, (_, i) => (
      <div key={i} style={pos({ left: w * (0.25 + rnd(i) * 0.45), top: w * (0.2 + rnd(i + 9) * 0.38), width: w * 0.22 * cl(crack * 1.4 - i * 0.12), height: 3, background: "rgba(70,30,5,.75)", transform: `rotate(${rnd(i + 4) * 180}deg)`, transformOrigin: "0 50%", borderRadius: 2 })} />
    )) : null}
  </div>
);
// sartén de hierro visto desde arriba
const Skillet: React.FC<{ d: number; children?: React.ReactNode; style?: React.CSSProperties; glow?: number }> = ({ d, children, style, glow = 0 }) => (
  <div style={{ position: "relative", width: d * 1.55, height: d, ...style }}>
    <div style={pos({ left: d * 0.9, top: d * 0.42, width: d * 0.65, height: d * 0.16, borderRadius: d * 0.08, background: "linear-gradient(180deg,#3b3735,#121110)", boxShadow: "0 8px 14px rgba(0,0,0,.5)" })} />
    <div style={pos({ left: 0, top: 0, width: d, height: d, borderRadius: "50%", background: "radial-gradient(circle at 50% 50%, #2a2726 0 60%, #3d3936 66%, #161413 72%, #2f2b29 100%)", boxShadow: `0 18px 40px rgba(0,0,0,.55), 0 0 ${80 * glow}px rgba(255,140,40,${0.5 * glow})` })} />
    <div style={pos({ left: d * 0.08, top: d * 0.08, width: d * 0.84, height: d * 0.84, borderRadius: "50%", background: IRON, boxShadow: "inset 0 10px 30px rgba(0,0,0,.7)", overflow: "hidden" })}>{children}</div>
  </div>
);
// termómetro de vidrio vertical (escala 100-200 °F)
const Thermo: React.FC<{ h: number; v: number; marks?: number[]; hi?: [number, number]; style?: React.CSSProperties }> = ({ h, v, marks = [], hi, style }) => {
  const y = (x: number) => h * 0.86 - ((x - 100) / 100) * h * 0.78;
  return (
    <div style={{ position: "relative", width: 150, height: h, ...style }}>
      <div style={pos({ left: 45, top: 0, width: 60, height: h * 0.9, borderRadius: 30, background: "linear-gradient(90deg, rgba(255,255,255,.55), rgba(255,255,255,.15) 40%, rgba(255,255,255,.4))", border: "3px solid rgba(255,255,255,.75)", boxShadow: SH })} />
      {hi ? <div style={pos({ left: 41, top: y(hi[1]), width: 68, height: y(hi[0]) - y(hi[1]), borderRadius: 10, background: "rgba(229,165,60,.45)", border: `3px solid ${GOLD}` })} /> : null}
      <div style={pos({ left: 63, top: y(v), width: 24, height: h * 0.9 - y(v) - 10, borderRadius: 12, background: "linear-gradient(90deg,#e0473a,#b52b20)" })} />
      <div style={pos({ left: 30, top: h * 0.82, width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ff8a7a, #c02d22 60%, #8e1d15)", boxShadow: SH })} />
      {marks.map((m) => (
        <div key={m} style={pos({ left: 112, top: y(m) - 22, display: "flex", alignItems: "center" })}>
          <div style={{ width: 26, height: 5, background: CREAM, marginRight: 10 }} /><Txt txt={`${m}°`} size={42} color={CREAM} />
        </div>
      ))}
    </div>
  );
};
const Card: React.FC<{ w: number; h: number; bg?: string; rot?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ w, h, bg = CREAM, rot = 0, style, children }) => (
  <div style={{ position: "relative", width: w, height: h, background: bg, borderRadius: 10, boxShadow: SH, transform: `rotate(${rot}deg)`, ...style }}>{children}</div>
);
const LINED = "linear-gradient(90deg, transparent 70px, rgba(200,60,60,.5) 70px 73px, transparent 73px), repeating-linear-gradient(180deg, transparent 0 58px, rgba(70,110,170,.35) 58px 61px), linear-gradient(180deg, #FFFDF6, #F6F0E2)";
const Frame: React.FC<{ w: number; h: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ w, h, style, children }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: 14, background: WOOD, padding: 26, boxShadow: SH, ...style }}>
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 6, background: CHALK, boxShadow: "inset 0 0 40px rgba(0,0,0,.6)", overflow: "hidden" }}>{children}</div>
  </div>
);

// ═════════════════ COMPONENTES ═════════════════
// 0 · tarjeta de truco: medallón de esmalte con el número sobre el delantal de Helen + tira de papel con el nombre
export const TrickCard: React.FC<B & { n: number; title: string; t: number }> = ({ a, a0, n, title, t }) => {
  const { f, at } = useT0(a, a0);
  const u = sp(f, at(t) - 2, 12, 160);
  return (
    <AbsoluteFill>
      <Bg m={APRON} f={f} x={25} o={0.18} />
      <div style={pos({ left: 170, top: 250, width: 520, height: 520, borderRadius: "50%", transform: `scale(${0.3 + 0.7 * u}) rotate(${(1 - u) * -90}deg)`, opacity: cl(u * 3),
        background: "radial-gradient(circle at 35% 28%, #fff, #F3EEE2 45%, #D8D1C0 100%)", boxShadow: `${SH}, inset 0 -14px 30px rgba(0,0,0,.18)`, border: "14px solid #C9CED3" })}>
        <div style={pos({ inset: 26, borderRadius: "50%", border: `5px dashed ${NAVY}`, opacity: 0.35 })} />
        <Txt txt="TRICK" size={64} color={NAVY} w={500} ls={10} style={pos({ left: 0, right: 0, top: 86, textAlign: "center" })} />
        <Txt txt={String(n)} size={300} color={CRISP} style={pos({ left: 0, right: 0, top: 150, textAlign: "center", textShadow: "0 4px 0 #8a4a12, 0 10px 20px rgba(0,0,0,.25)" })} />
      </div>
      <div style={pos({ left: 640, top: 440, ...slide(f, at(t) + 6, 900) })}>
        <div style={{ position: "relative", padding: "34px 60px 34px 90px", background: BUTCHER, boxShadow: SH, clipPath: "polygon(0 0, 100% 2%, 98% 50%, 100% 98%, 0 100%, 2% 50%)" }}>
          <Txt txt={title} size={96} color={INK} />
        </div>
        <Tape w={160} rot={-8} style={pos({ left: -30, top: -20 })} />
      </div>
      <div style={pos({ left: 690, top: 640, display: "flex", gap: 22 })}>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} style={{ width: 38, height: 38, borderRadius: "50%", border: `4px solid ${CREAM}`, background: i < n ? GOLD : "transparent", opacity: cl((f - at(t) - 10 - i * 2) / 6), boxShadow: i === n - 1 ? `0 0 0 8px rgba(229,165,60,.35)` : undefined }} />
        ))}
      </div>
      <Sheen f={f} at={at(t) + 14} o={0.18} />
    </AbsoluteFill>
  );
};

// 1 · 90 centavos: un muslo dorado en el sartén se cuartea y le cae la etiqueta de precio colgada de un hilo
export const NinetyCents: React.FC<B & { t: number }> = ({ a, a0, t }) => {
  const { f, at } = useT0(a, a0);
  const sw = Math.sin((f - at(t)) / 7) * 9 * Math.exp(-(Math.max(0, f - at(t))) / 30);
  return (
    <AbsoluteFill>
      <Bg m={ENAMEL} f={f} x={30} />
      <div style={pos({ left: 210, top: 210, ...drop(f, 0, -300, 0) })}>
        <Skillet d={660} glow={0.25}><Thigh w={420} rot={-12} style={pos({ left: 70, top: 120 })} /></Skillet>
      </div>
      <div style={pos({ left: 1220, top: 0, width: 4, height: 330, background: "#8b7a64", transform: `rotate(${sw}deg)`, transformOrigin: "50% 0", opacity: cl((f - at(t) + 6) / 6) })}>
        <div style={pos({ left: -190, top: 300, width: 380, height: 260, ...drop(f, at(t) - 4, -400, 20) })}>
          <div style={{ width: "100%", height: "100%", background: BUTCHER, borderRadius: "18px 18px 18px 18px", clipPath: "polygon(20% 0, 80% 0, 100% 22%, 100% 100%, 0 100%, 0 22%)", boxShadow: SH, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#d9c6b8", boxShadow: "inset 0 3px 4px rgba(0,0,0,.4)", marginBottom: 6 }} />
            <Txt txt="90¢" size={150} color={RED} />
            <Txt txt="ONE THIGH" size={42} color={INK} w={500} ls={6} />
          </div>
        </div>
      </div>
      <div style={pos({ left: 1060, top: 820, ...pop(f, at(t) + 14) })}><Hand txt="it shatters like a chip" size={78} color={NAVY} f={f} at={at(t) + 14} /></div>
    </AbsoluteFill>
  );
};

// 2 · la cuenta del restaurante: 11 dólares por 2 piezas, el 2 se encierra en rojo
export const ElevenCheck: React.FC<B & { t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useT0(a, a0);
  const ring = ez((f - at(t2)) / 14);
  return (
    <AbsoluteFill>
      <Bg m={WOOD} f={f} x={60} o={0.3} />
      <div style={pos({ left: 560, top: 70, ...drop(f, 0, -900, -6) })}>
        <Card w={800} h={940} bg="linear-gradient(180deg, transparent 150px, rgba(60,120,80,.5) 150px 154px, transparent 154px), repeating-linear-gradient(180deg, transparent 0 86px, rgba(60,120,80,.28) 86px 89px), linear-gradient(180deg, #F2F5E8, #E5EBD6)" rot={-3}>
          <Txt txt="GUEST CHECK" size={70} color="#2D6A45" ls={8} style={pos({ left: 0, right: 0, top: 46, textAlign: "center" })} />
          <div style={pos({ left: 60, top: 220, display: "flex", alignItems: "center" })}>
            <div style={{ position: "relative" }}>
              <Hand txt="2" size={120} color={NAVY} f={f} at={6} />
              <div style={pos({ left: -34, top: -14, width: 130, height: 140, borderRadius: "50%", border: `7px solid ${RED}`, clipPath: `inset(0 ${100 - 100 * ring}% 0 0)`, transform: "rotate(-12deg)" })} />
            </div>
            <Hand txt="pc fried chicken" size={88} color={NAVY} f={f} at={10} style={{ marginLeft: 30 }} />
          </div>
          <Hand txt="side slaw" size={70} color={NAVY} f={f} at={18} style={pos({ left: 90, top: 400 })} />
          <div style={pos({ left: 60, right: 60, top: 640, height: 5, background: "#2D6A45", opacity: 0.6 })} />
          <Txt txt="TOTAL" size={64} color="#2D6A45" style={pos({ left: 70, top: 690 })} />
          <div style={pos({ right: 70, top: 640, ...pop(f, at(t)) })}><Txt txt="$11.00" size={170} color={RED} /></div>
        </Card>
      </div>
      <div style={pos({ left: 120, top: 760, ...pop(f, at(t2) + 10) })}><Stamp txt="$5.50 A PIECE" f={f} at={at(t2) + 10} size={66} rot={-10} style={{ mixBlendMode: "normal", background: CREAM }} /></div>
    </AbsoluteFill>
  );
};

// 3 · promesa: pizarra de menú "8 trucos" y se tachan freidora, aparatos, cosas raras
export const EightPromise: React.FC<B & { t: number; t2: number; t3: number; t4: number }> = ({ a, a0, t, t2, t3, t4 }) => {
  const { f, at } = useT0(a, a0);
  const rows: [string, number][] = [["A FRYER", t2], ["GADGETS", t3], ["ANYTHING FANCY", t4]];
  return (
    <AbsoluteFill>
      <Bg m={STEEL} f={f} x={20} />
      <div style={pos({ left: 260, top: 60, ...flipIn(f, 0) })}>
        <Frame w={1400} h={960}>
          <Hand txt="8 old butcher tricks" size={150} color={CREAM} f={f} at={at(t)} dur={18} chalk style={pos({ left: 90, top: 60 })} />
          <div style={pos({ left: 90, top: 250, width: 900 * ez((f - at(t) - 10) / 14), height: 6, background: GOLD, borderRadius: 3, opacity: 0.85 })} />
          <Txt txt="YOU WON'T NEED" size={54} color="rgba(251,244,228,.7)" w={400} ls={8} style={pos({ left: 96, top: 300, opacity: cl((f - at(t2) + 8) / 8) })} />
          {rows.map(([s, tt], i) => (
            <div key={s} style={pos({ left: 96, top: 400 + i * 140, display: "flex", alignItems: "center", opacity: cl((f - at(tt) + 4) / 6) })}>
              <Cross f={f} at={at(tt) + 4} s={70} />
              <div style={{ position: "relative" }}><Hand txt={s.toLowerCase()} size={110} color={CREAM} chalk /><Strike f={f} at={at(tt) + 6} c="rgba(230,90,70,.9)" /></div>
            </div>
          ))}
          <div style={pos({ right: 70, bottom: 70 })}><Stamp txt="UNDER $1 A PIECE" f={f} at={at(t4) + 12} c={GOLD} size={60} rot={-7} style={{ mixBlendMode: "normal" }} /></div>
        </Frame>
      </div>
    </AbsoluteFill>
  );
};

// 4 · corte de la piel: agua atrapada bajo la tapa rebota y vuelve = vapor = goma
export const SkinSteam: React.FC<B & { t: number; t2: number; t3: number }> = ({ a, a0, t, t2, t3 }) => {
  const { f, at } = useT0(a, a0);
  const lid = sp(f, at(t2), 14, 120);
  const ceil = 340 + 0 * lid;
  return (
    <AbsoluteFill>
      <Bg m={APRON} f={f} x={70} o={0.15} />
      <div style={pos({ left: 260, top: 120, width: 1400, height: 840, borderRadius: 30, background: ENAMEL, boxShadow: SH, overflow: "hidden", ...pop(f, 0) })}>
        <Txt txt="CHICKEN SKIN = WATER + FAT" size={64} color={NAVY} style={pos({ left: 70, top: 46, opacity: cl((f - at(t)) / 8) })} />
        {/* tapa */}
        <div style={pos({ left: 230, top: 250 - 400 * (1 - lid), width: 940, height: 70, borderRadius: "50% 50% 8px 8px / 100% 100% 8px 8px", background: "linear-gradient(180deg, rgba(200,220,235,.7), rgba(150,175,195,.75))", border: "4px solid rgba(255,255,255,.8)", boxShadow: "0 10px 20px rgba(0,0,0,.25)", opacity: cl(lid * 2) })}>
          <div style={pos({ left: 430, top: -40, width: 80, height: 44, borderRadius: 14, background: "#2b2b2b" })} />
        </div>
        {/* sartén en corte */}
        <div style={pos({ left: 180, top: 700, width: 1040, height: 40, borderRadius: "0 0 20px 20px", background: "linear-gradient(180deg,#2b2826,#0f0e0d)" })} />
        <div style={pos({ left: 300, top: 600, width: 800, height: 100, borderRadius: "40px 40px 0 0", background: "linear-gradient(180deg,#E7A6A0,#C9776F)" })} />
        <div style={pos({ left: 290, top: 560, width: 820, height: 46, borderRadius: "40px 40px 0 0", background: "linear-gradient(180deg,#FBEFD2,#EBD7A8)" })} />
        <div style={pos({ left: 280, top: 520, width: 840, height: 44, borderRadius: "42px 42px 0 0", background: "linear-gradient(180deg,#F1D3B6,#E2B990)", boxShadow: "inset 0 4px 6px rgba(255,255,255,.5)" })} />
        {[["SKIN", 500], ["FAT", 568], ["MEAT", 640]].map(([s, y], i) => (
          <div key={s as string} style={pos({ left: 1150, top: (y as number) - 4, display: "flex", alignItems: "center", opacity: cl((f - at(t) - 6 - i * 4) / 6) })}>
            <div style={{ width: 40, height: 4, background: INK, marginRight: 12 }} /><Txt txt={s as string} size={38} color={INK} />
          </div>
        ))}
        {/* gotas: suben; con la tapa rebotan y vuelven */}
        {Array.from({ length: 16 }, (_, i) => {
          const ph = ((f - at(t) + i * 9) % 60) / 60; if (f < at(t)) return null;
          const x = 320 + rnd(i) * 760;
          const top = 500, hgt = lid > 0.5 ? 500 - 330 : 500 - 40;
          const y = lid > 0.5 ? top - hgt * Math.sin(Math.PI * ph) : top - hgt * ph * 1.6;
          return <div key={i} style={pos({ left: x, top: y, width: 26, height: 34, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: `radial-gradient(circle at 35% 30%, #fff, ${ICE} 60%, #5f97c4)`, opacity: lid > 0.5 ? 0.9 : cl(1 - ph) })} />;
        })}
        <div style={pos({ left: 470, top: 360, opacity: cl((f - at(t2) - 10) / 8) })}><Txt txt="NOWHERE TO GO" size={58} color={NAVY} /></div>
        <div style={pos({ left: 760, top: 60, ...pop(f, at(t3)) })}><Stamp txt="STEAMED = RUBBER" f={f} at={at(t3)} size={86} rot={-4} style={{ mixBlendMode: "normal", background: "rgba(251,244,228,.92)" }} /></div>
      </div>
    </AbsoluteFill>
  );
};

// 5 · carteles de precio de la vitrina (tablero ranurado de letras blancas): 1,79 vs 4,49 y "más del doble"
const Groove: React.FC<{ w: number; h: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ w, h, style, children }) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: 8, boxShadow: SH, padding: "26px 36px", border: "10px solid #9aa1a8",
    background: "repeating-linear-gradient(180deg, #1d1d1f 0 14px, #0d0d0e 14px 18px), #151516", ...style }}>{children}</div>
);
export const PriceCase: React.FC<B & { t: number; t2: number; t3: number }> = ({ a, a0, t, t2, t3 }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m="radial-gradient(ellipse 80% 60% at 50% 30%, rgba(200,230,255,.25), transparent), repeating-linear-gradient(90deg, rgba(255,255,255,.04) 0 2px, transparent 2px 160px), linear-gradient(180deg, #B9C6CF, #7F8F9A)" f={f} x={50} />
      <div style={pos({ left: 0, right: 0, top: 690, bottom: 0, background: "linear-gradient(180deg, #F5EFEA, #DCCFC6)", boxShadow: "0 -10px 30px rgba(0,0,0,.25)" })}>
        {Array.from({ length: 9 }, (_, i) => <Thigh key={i} w={190} raw rot={rnd(i) * 40 - 20} style={pos({ left: 60 + i * 205, top: 60 + (i % 2) * 70 })} />)}
      </div>
      <div style={pos({ left: 150, top: 160, ...drop(f, at(t) - 4, -600, -4) })}>
        <Groove w={760} h={430}>
          <Txt txt="BONE-IN · SKIN-ON" size={56} color="#F4F4F4" w={500} ls={4} />
          <Txt txt="THIGHS" size={56} color="#F4F4F4" w={500} ls={4} />
          <div style={{ display: "flex", alignItems: "flex-end", marginTop: 20 }}><Txt txt="$1.79" size={180} color="#FFFFFF" /><Txt txt="/LB" size={60} color="#F4F4F4" style={{ marginBottom: 26, marginLeft: 10 }} /></div>
        </Groove>
      </div>
      <div style={pos({ left: 1010, top: 160, ...drop(f, at(t2) - 4, -600, 4) })}>
        <Groove w={760} h={430}>
          <Txt txt="BONELESS · SKINLESS" size={56} color="#F4F4F4" w={500} ls={4} />
          <Txt txt="THIGHS" size={56} color="#F4F4F4" w={500} ls={4} />
          <div style={{ display: "flex", alignItems: "flex-end", marginTop: 20 }}><Txt txt="$4.49" size={180} color="#FF8A7A" /><Txt txt="/LB" size={60} color="#F4F4F4" style={{ marginBottom: 26, marginLeft: 10 }} /></div>
        </Groove>
      </div>
      <div style={pos({ left: 1450, top: 80, ...pop(f, at(t3)) })}>
        <div style={{ width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #ff8b6e, ${RED} 65%)`, boxShadow: SH, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: "rotate(10deg)", border: "6px dashed rgba(255,255,255,.6)" }}>
          <Txt txt="2.5×" size={120} color="#fff" /><Txt txt="THE PRICE" size={40} color="#fff" w={500} />
        </div>
      </div>
      <Sheen f={f} at={at(t2) + 6} />
    </AbsoluteFill>
  );
};

// 6 · cómo elegir el paquete: tablilla con ✓ piel de borde a borde y ✗ agua rosada en la bandeja
const Tray: React.FC<{ w: number; pink?: number }> = ({ w, pink = 0 }) => (
  <div style={{ position: "relative", width: w, height: w * 0.62, borderRadius: 26, background: "linear-gradient(180deg,#FDFDFB,#E6E4DE)", boxShadow: "0 10px 20px rgba(0,0,0,.25), inset 0 -10px 20px rgba(0,0,0,.08)" }}>
    <div style={pos({ left: w * 0.06, right: w * 0.06, bottom: w * 0.05, height: w * 0.16 * pink, borderRadius: 16, background: "linear-gradient(180deg, rgba(232,120,120,.55), rgba(200,70,80,.75))" })} />
    {[0, 1, 2].map((i) => <Thigh key={i} w={w * 0.34} raw rot={i * 15 - 15} style={pos({ left: w * (0.04 + i * 0.3), top: w * 0.1 })} />)}
    <div style={pos({ inset: 0, borderRadius: 26, background: "linear-gradient(130deg, rgba(255,255,255,.55), transparent 30%, transparent 70%, rgba(255,255,255,.3))" })} />
  </div>
);
export const PackCheck: React.FC<B & { t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={STEEL} f={f} x={60} />
      <div style={pos({ left: 110, top: 130, ...drop(f, 0, -500, -5) })}><Tray w={780} /><Txt txt="SKIN EDGE TO EDGE" size={52} color={GREEN} style={{ marginTop: 30 }} /></div>
      <div style={pos({ left: 1030, top: 130, ...drop(f, at(t2) - 6, -500, 5) })}><Tray w={780} pink={ez((f - at(t2)) / 18)} /><Txt txt="PINK WATER = WET SKIN" size={52} color={RED} style={{ marginTop: 30 }} /></div>
      <div style={pos({ left: 790, top: 90, ...pop(f, at(t) + 6) })}><div style={{ width: 120, height: 120, borderRadius: "50%", background: CREAM, boxShadow: SH, display: "flex", alignItems: "center", justifyContent: "center" }}><Tick f={f} at={at(t) + 8} s={70} /></div></div>
      <div style={pos({ left: 1710, top: 90, ...pop(f, at(t2) + 8) })}><div style={{ width: 120, height: 120, borderRadius: "50%", background: CREAM, boxShadow: SH, display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: 26 }}><Cross f={f} at={at(t2) + 10} s={62} /></div></div>
      <div style={pos({ left: 150, top: 860, opacity: cl((f - at(t2) - 20) / 8) })}><Hand txt="that water goes right onto your skin" size={76} color={NAVY} f={f} at={at(t2) + 20} /></div>
    </AbsoluteFill>
  );
};

// 7 · la medida de sal: cucharita de 3/4 que se llena, ticket de balanza "6 thighs ≈ 2 lb", resultado 1 1/2 cdta
export const SaltMeasure: React.FC<B & { t: number; t2: number; t3: number }> = ({ a, a0, t, t2, t3 }) => {
  const { f, at } = useT0(a, a0);
  const fill = ez((f - at(t) - 6) / 30);
  return (
    <AbsoluteFill>
      <Bg m={BUTCHER} f={f} x={30} />
      <div style={pos({ left: 140, top: 220, ...drop(f, 0, -500, -8) })}>
        <div style={{ position: "relative", width: 560, height: 360 }}>
          <div style={pos({ left: 330, top: 160, width: 300, height: 46, borderRadius: 23, background: "linear-gradient(180deg,#e9edf0,#9ea6ad)", boxShadow: "0 8px 14px rgba(0,0,0,.3)", transform: "rotate(-8deg)" })} />
          <div style={pos({ left: 20, top: 20, width: 340, height: 340, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #f6f8f9, #b5bcc2 60%, #7d868e)", boxShadow: SH })}>
            <div style={pos({ left: 34, top: 34, width: 272, height: 272, borderRadius: "50%", background: "radial-gradient(circle at 50% 40%, #a3abb2, #d6dbdf)", overflow: "hidden" })}>
              <div style={pos({ left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, background: "radial-gradient(circle at 30% 30%, #fff 0 2px, transparent 3px) 0 0/12px 10px, radial-gradient(circle at 70% 70%, #e6e1d8 0 2px, transparent 3px) 0 0/9px 11px, #f7f4ee" })} />
            </div>
          </div>
        </div>
        <Txt txt="¾ TSP" size={120} color={NAVY} style={{ marginTop: 10 }} />
        <Txt txt="KOSHER SALT · PER POUND" size={44} color={INK} w={500} ls={3} />
      </div>
      <div style={pos({ left: 880, top: 140, width: 520, ...slide(f, at(t2) - 4, 600) })}>
        <div style={{ background: "linear-gradient(180deg,#FFFFFF,#F3F1EC)", padding: "36px 40px", boxShadow: SH, clipPath: "polygon(0 0, 100% 0, 100% 96%, 95% 100%, 90% 96%, 85% 100%, 80% 96%, 75% 100%, 70% 96%, 65% 100%, 60% 96%, 55% 100%, 50% 96%, 45% 100%, 40% 96%, 35% 100%, 30% 96%, 25% 100%, 20% 96%, 15% 100%, 10% 96%, 5% 100%, 0 96%)" }}>
          <Txt txt="HELEN'S MEAT MARKET" size={36} color={INK} w={500} ls={3} />
          <div style={{ borderTop: "3px dashed #999", margin: "16px 0" }} />
          <Txt txt="6 THIGHS" size={70} color={INK} />
          <Txt txt="≈ 2.00 LB" size={110} color={NAVY} />
        </div>
      </div>
      <div style={pos({ left: 960, top: 640, ...pop(f, at(t3)) })}>
        <Hand txt="= 1½ teaspoons" size={130} color={RED} f={f} at={at(t3)} dur={14} />
      </div>
    </AbsoluteFill>
  );
};

// 8 · cuántas horas: tres imanes de heladera con reloj y una barra de "crocancia" que crece
export const HoursBar: React.FC<B & { t: number; t2: number; t3: number }> = ({ a, a0, t, t2, t3 }) => {
  const { f, at } = useT0(a, a0);
  const rows: [string, string, number, number, string][] = [["12 H", "GOOD", t, 0.7, GOLD], ["24 H", "BETTER", t2, 1.0, CRISP], ["1 H", "EVEN THAT HELPS", t3, 0.25, "#D9C08A"]];
  return (
    <AbsoluteFill>
      <Bg m={ENAMEL} f={f} x={20} />
      <div style={pos({ left: 1740, top: 0, width: 70, bottom: 0, background: "linear-gradient(90deg,#b9bfc5,#f4f6f7 40%,#8e969d)", boxShadow: "-10px 0 20px rgba(0,0,0,.2)" })} />
      <Txt txt="UNCOVERED IN THE FRIDGE" size={58} color={NAVY} ls={4} style={pos({ left: 160, top: 120, opacity: cl(f / 10) })} />
      {rows.map(([h, lab, tt, v, c], i) => {
        const u = ez((f - at(tt) - 4) / 22);
        return (
          <div key={h} style={pos({ left: 160, top: 260 + i * 240, display: "flex", alignItems: "center", ...slide(f, at(tt) - 4, -500) })}>
            <div style={{ width: 190, height: 190, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #fff, #EDE7DA)", border: `10px solid ${NAVY}`, boxShadow: SH, position: "relative" }}>
              <div style={pos({ left: 85, top: 30, width: 10, height: 66, background: INK, borderRadius: 5, transformOrigin: "50% 100%", transform: `rotate(${u * 360 * (i === 1 ? 2 : 1)}deg)` })} />
              <div style={pos({ left: 85, top: 60, width: 10, height: 36, background: RED, borderRadius: 5, transformOrigin: "50% 100%", transform: `rotate(${u * 30 + 90}deg)` })} />
            </div>
            <Txt txt={h} size={110} color={INK} style={{ width: 240, marginLeft: 40 }} />
            <div style={{ width: 760, height: 64, borderRadius: 32, background: "rgba(30,44,72,.12)", boxShadow: "inset 0 4px 8px rgba(0,0,0,.15)", position: "relative", overflow: "hidden" }}>
              <div style={pos({ left: 0, top: 0, bottom: 0, width: `${v * u * 100}%`, borderRadius: 32, background: `repeating-linear-gradient(-45deg, rgba(255,255,255,.18) 0 12px, transparent 12px 24px), ${c}` })} />
              <Txt txt={lab} size={40} color={INK} style={pos({ left: 26, top: 10 })} />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 9 · polvo de hornear SÍ, bicarbonato NO (sabe a jabón): dos latas de hojalata
const Tin: React.FC<{ w: number; label: string; c: string }> = ({ w, label, c }) => (
  <div style={{ position: "relative", width: w, height: w * 1.3 }}>
    <div style={pos({ left: 0, top: w * 0.1, width: w, height: w * 1.15, borderRadius: `${w * 0.08}px`, background: `linear-gradient(90deg, rgba(0,0,0,.25), rgba(255,255,255,.25) 30%, rgba(0,0,0,.05) 60%, rgba(0,0,0,.3)), ${c}`, boxShadow: SH })} />
    <div style={pos({ left: -6, top: 0, width: w + 12, height: w * 0.18, borderRadius: w * 0.05, background: "linear-gradient(90deg,#8d959c,#f1f3f4 35%,#aab1b7 65%,#6f777e)", boxShadow: "0 6px 10px rgba(0,0,0,.3)" })} />
    <div style={pos({ left: w * 0.08, right: w * 0.08, top: w * 0.42, padding: "18px 8px", background: CREAM, borderRadius: 8, textAlign: "center", boxShadow: "0 3px 6px rgba(0,0,0,.2)" })}>
      <Txt txt="BAKING" size={w * 0.13} color={INK} w={500} ls={4} />
      <Txt txt={label} size={w * 0.2} color={INK} />
    </div>
  </div>
);
export const PowderSoda: React.FC<B & { t: number; t2: number; t3: number }> = ({ a, a0, t, t2, t3 }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={WOOD} f={f} x={40} o={0.32} />
      <div style={pos({ left: 330, top: 200, ...drop(f, at(t) - 6, -700, -6) })}><Tin w={420} label="POWDER" c={NAVY} /></div>
      <div style={pos({ left: 1150, top: 200, ...drop(f, at(t2) - 6, -700, 6), filter: f > at(t3) + 6 ? "saturate(.6)" : undefined })}><Tin w={420} label="SODA" c="#C7862F" /></div>
      <div style={pos({ left: 470, top: 790, display: "flex", alignItems: "center", ...pop(f, at(t) + 8) })}><Tick f={f} at={at(t) + 10} s={80} /><Txt txt="YES" size={90} color={GREEN} /></div>
      <div style={pos({ left: 1080, top: 800, display: "flex", alignItems: "center", ...pop(f, at(t3)) })}><Cross f={f} at={at(t3) + 2} s={64} /><Txt txt="TASTES LIKE SOAP" size={66} color={RED} /></div>
      {f > at(t3) ? Array.from({ length: 10 }, (_, i) => {
        const u = ((f - at(t3) + i * 7) % 50) / 50;
        return <div key={i} style={pos({ left: 1200 + rnd(i) * 320, top: 260 - u * 220, width: 30 + rnd(i + 3) * 30, height: 30 + rnd(i + 3) * 30, borderRadius: "50%", border: "3px solid rgba(255,255,255,.8)", background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,.7), rgba(180,220,255,.15) 60%)", opacity: 1 - u })} />;
      }) : null}
    </AbsoluteFill>
  );
};

// 10 · sartén FRÍO: hierro con escarcha, dial en COLD, la llama tachada
export const ColdPan: React.FC<B & { t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useT0(a, a0);
  const frost = 1 - ez((f - at(t2) - 30) / 60) * 0.5;
  return (
    <AbsoluteFill>
      <Bg m={ENAMEL} f={f} x={70} />
      <div style={pos({ left: 140, top: 190, ...drop(f, 0, -400, 0) })}>
        <Skillet d={700}>
          {[0, 1, 2, 3].map((i) => <Thigh key={i} w={240} raw rot={i * 70} style={pos({ left: 70 + (i % 2) * 260, top: 80 + Math.floor(i / 2) * 250 })} />)}
          <div style={pos({ inset: 0, background: `radial-gradient(circle at 30% 30%, rgba(220,240,255,${0.5 * frost}) 0 2px, transparent 3px) 0 0/19px 17px, radial-gradient(circle, rgba(170,210,240,${0.25 * frost}), transparent 70%)` })} />
        </Skillet>
      </div>
      <div style={pos({ left: 1300, top: 170, ...pop(f, at(t)) })}>
        <div style={{ width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #ffffff, #dfe3e6 60%, #a8b0b6)", boxShadow: SH, position: "relative", border: "12px solid #c7ccd1" }}>
          {["COLD", "LOW", "MED", "HIGH"].map((s, i) => <Txt key={s} txt={s} size={40} color={i === 0 ? "#2f78b6" : INK} style={pos({ left: 150 + Math.cos(Math.PI * (1.15 - i * 0.37)) * 120 - 30, top: 150 - Math.sin(Math.PI * (1.15 - i * 0.37)) * 120 })} />)}
          <div style={pos({ left: 168, top: 60, width: 20, height: 130, background: RED, borderRadius: 10, transformOrigin: "50% 100%", transform: `rotate(${-60 + 25 * ez((f - at(t2) - 20) / 40)}deg)` })} />
          <div style={pos({ left: 148, top: 168, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #666, #111)" })} />
        </div>
      </div>
      <div style={pos({ left: 1250, top: 640, display: "flex", alignItems: "center", ...pop(f, at(t2)) })}>
        <div style={{ position: "relative", width: 120, height: 150, marginRight: 30 }}>
          <div style={pos({ left: 20, top: 10, width: 80, height: 130, borderRadius: "50% 50% 50% 50% / 70% 70% 30% 30%", background: "radial-gradient(ellipse at 50% 80%, #fff 0 15%, #8ab8ff 35%, #2e6fe0 70%)" })} />
          <div style={pos({ left: -10, top: 66, width: 140, height: 14, background: RED, borderRadius: 7, transform: `rotate(-40deg) scaleX(${ez((f - at(t2) - 4) / 8)})` })} />
        </div>
        <Txt txt="NOT HOT" size={110} color={RED} />
      </div>
      <div style={pos({ left: 140, top: 940, opacity: cl((f - at(t) - 10) / 8) })}><Txt txt="SKIN SIDE DOWN · COLD PAN · THEN MEDIUM" size={50} color={NAVY} ls={3} /></div>
    </AbsoluteFill>
  );
};

// 11 · no lo toques: timer de cuerda con el arco 15-18 min resaltado
export const LeaveAlone: React.FC<B & { t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useT0(a, a0);
  const sweep = ez((f - at(t)) / 50);
  const ang = (m: number) => (m / 60) * 360;
  return (
    <AbsoluteFill>
      <Bg m={APRON} f={f} x={30} o={0.18} />
      <div style={pos({ left: 220, top: 160, width: 760, height: 760, ...pop(f, 0) })}>
        <div style={pos({ inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 35% 28%, #fff, #F2EBDD 55%, #CFC6B2)", boxShadow: `${SH}, inset 0 -20px 40px rgba(0,0,0,.15)`, border: "20px solid #D94B3C" })} />
        <div style={pos({ inset: 70, borderRadius: "50%", background: `conic-gradient(from ${ang(15)}deg, rgba(229,165,60,.75) 0 ${ang(3) * sweep}deg, transparent 0)` })} />
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={pos({ left: 370, top: 40, width: 6, height: 40, background: INK, transformOrigin: "50% 330px", transform: `rotate(${i * 30}deg)` })} />
        ))}
        {[0, 15, 30, 45].map((m) => <Txt key={m} txt={String(m)} size={58} color={INK} style={pos({ left: 380 + Math.sin((m / 60) * 2 * Math.PI) * 250 - 26, top: 345 - Math.cos((m / 60) * 2 * Math.PI) * 250 - 30 })} />)}
        <div style={pos({ left: 370, top: 110, width: 18, height: 270, background: RED, borderRadius: 9, transformOrigin: "50% 270px", transform: `rotate(${ang(15) + ang(3) * sweep}deg)`, boxShadow: "0 4px 6px rgba(0,0,0,.3)" })} />
        <div style={pos({ left: 335, top: 335, width: 90, height: 90, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #777, #111)" })} />
      </div>
      <div style={pos({ left: 1080, top: 230 })}>
        <Txt txt="15–18 MIN" size={140} color={GOLD} style={{ ...pop(f, at(t) + 6) }} />
        {["DON'T MOVE IT", "DON'T LIFT IT", "DON'T PEEK"].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", marginTop: 28, ...slide(f, at(t) + 14 + i * 8, 500) }}><Cross f={f} at={at(t) + 18 + i * 8} s={52} c="#FF8A7A" /><Txt txt={s} size={70} color={CREAM} /></div>
        ))}
        <div style={{ marginTop: 50, opacity: cl((f - at(t2)) / 8) }}><Hand txt="it lets go by itself" size={90} color={GOLD} f={f} at={at(t2)} /></div>
      </div>
    </AbsoluteFill>
  );
};

// 12 · espacio en el sartén: 10 pulgadas = 4 muslos, 12 pulgadas = 5-6, con "un dedo" de separación
export const PanRoom: React.FC<B & { t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useT0(a, a0);
  const four = [[60, 60], [250, 60], [60, 250], [250, 250]], six = [[50, 70], [230, 50], [400, 80], [60, 290], [240, 300], [410, 290]];
  return (
    <AbsoluteFill>
      <Bg m={ENAMEL} f={f} x={50} />
      <div style={pos({ left: 90, top: 200, ...pop(f, 0) })}>
        <Skillet d={560}>{four.map(([x, y], i) => <Thigh key={i} w={170} rot={i * 50} style={{ ...pos({ left: x, top: y }), ...pop(f, 4 + i * 3) }} />)}</Skillet>
        <Txt txt='10" PAN · 4 THIGHS' size={64} color={NAVY} style={{ marginTop: 30 }} />
      </div>
      <div style={pos({ left: 1000, top: 140, ...pop(f, at(t2) - 4) })}>
        <Skillet d={660}>{six.map(([x, y], i) => <Thigh key={i} w={160} rot={i * 40} style={{ ...pos({ left: x, top: y }), ...pop(f, at(t2) + i * 3) }} />)}</Skillet>
        <Txt txt='12" PAN · 5 OR 6' size={64} color={NAVY} style={{ marginTop: 30 }} />
      </div>
      <div style={pos({ left: 380, top: 120, ...pop(f, 20) })}>
        <div style={{ padding: "12px 26px", background: GOLD, borderRadius: 40, boxShadow: SH }}><Txt txt="ONE FINGER OF SPACE" size={44} color={INK} /></div>
      </div>
    </AbsoluteFill>
  );
};

// 13 · 165 es seguro, pero el muslo no está terminado
export const Thermo165: React.FC<B & { t: number; t2: number; t3: number }> = ({ a, a0, t, t2, t3 }) => {
  const { f, at } = useT0(a, a0);
  const v = 100 + 65 * ez((f - at(t) + 4) / 30);
  return (
    <AbsoluteFill>
      <Bg m={CHALK} f={f} x={30} o={0.12} />
      <div style={pos({ left: 300, top: 70 })}><Thermo h={940} v={v} marks={[165, 185]} /></div>
      <div style={pos({ left: 720, top: 180 })}>
        <Hand txt="everybody learned" size={84} color="rgba(251,244,228,.8)" f={f} at={at(t)} chalk />
        <Txt txt="165°F" size={240} color={CREAM} style={{ ...pop(f, at(t) + 6) }} />
        <div style={{ display: "flex", alignItems: "center", marginTop: 10, ...pop(f, at(t2)) }}><Tick f={f} at={at(t2) + 2} s={80} c="#7FD18F" /><Txt txt="SAFE" size={110} color="#7FD18F" /></div>
        <div style={{ marginTop: 40 }}><Stamp txt="BUT A THIGH IS NOT A BREAST" f={f} at={at(t3)} c={GOLD} size={58} rot={-4} style={{ mixBlendMode: "normal" }} /></div>
      </div>
    </AbsoluteFill>
  );
};

// 14 · entre 175 y 190 las fibras se derriten: la aguja entra a la franja dorada
export const ThermoRise: React.FC<B & { t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useT0(a, a0);
  const v = 165 + 20 * ez((f - at(t)) / 40);
  return (
    <AbsoluteFill>
      <Bg m={APRON} f={f} x={70} o={0.16} />
      <div style={pos({ left: 1450, top: 70 })}><Thermo h={940} v={v} marks={[165, 175, 190]} hi={[175, 190]} /></div>
      <div style={pos({ left: 140, top: 200, width: 1150 })}>
        <Txt txt="175° – 190°F" size={170} color={GOLD} style={{ ...pop(f, at(t)) }} />
        <Txt txt="THE TOUGH STRINGS MELT" size={80} color={CREAM} style={{ marginTop: 20, ...slide(f, at(t) + 8, -600) }} />
        <div style={{ display: "flex", gap: 18, marginTop: 70 }}>
          {Array.from({ length: 9 }, (_, i) => {
            const m = ez((f - at(t2) - i * 2) / 20);
            return <div key={i} style={{ width: 90, height: 200, borderRadius: 40, background: `linear-gradient(180deg, ${m > 0.5 ? "#F2C274" : "#E7B3A7"}, ${m > 0.5 ? "#C77A2A" : "#C98A80"})`, transform: `scaleY(${1 - 0.55 * m}) translateY(${80 * m}px)`, opacity: 0.95, boxShadow: "0 6px 10px rgba(0,0,0,.3)" }} />;
          })}
        </div>
        <Hand txt="…and turn into juice" size={90} color={GOLD} f={f} at={at(t2) + 6} style={{ marginTop: 40 }} />
      </div>
    </AbsoluteFill>
  );
};

// 15 · el papelito de la heladera: BREAST 165 · THIGH 185 sujetado con imán
export const FridgeNote: React.FC<B & { t: number; t2: number; t3: number }> = ({ a, a0, t, t2, t3 }) => {
  const { f, at } = useT0(a, a0);
  const mag = sp(f, at(t3), 9, 260);
  return (
    <AbsoluteFill>
      <Bg m="radial-gradient(ellipse 50% 60% at 30% 20%, rgba(255,255,255,.7), transparent 70%), linear-gradient(90deg, #DCE8E6, #F2F7F5 40%, #E1ECEA 80%, #C9D9D6)" f={f} x={30} />
      <div style={pos({ left: 1620, top: 0, width: 80, bottom: 0, background: "linear-gradient(90deg,#9ea6ad,#f4f6f7 45%,#7f878e)", boxShadow: "-10px 0 20px rgba(0,0,0,.18)" })} />
      <div style={pos({ left: 330, top: 120, ...drop(f, 0, -700, 10) })}>
        <Card w={1060} h={820} bg={LINED} rot={-2}>
          <Hand txt="breast" size={140} color={NAVY} f={f} at={at(t)} style={pos({ left: 120, top: 140 })} />
          <Txt txt="165°" size={190} color={NAVY} style={pos({ left: 600, top: 110, ...pop(f, at(t) + 8) })} />
          <Hand txt="thigh" size={150} color={RED} f={f} at={at(t2)} style={pos({ left: 120, top: 430 })} />
          <Txt txt="185°" size={220} color={RED} style={pos({ left: 580, top: 380, ...pop(f, at(t2) + 8) })} />
          <div style={pos({ left: 560, top: 640, width: 420 * ez((f - at(t2) - 16) / 12), height: 12, borderRadius: 6, background: RED, transform: "rotate(-2deg)" })} />
        </Card>
        <div style={pos({ left: 470, top: -50, width: 130, height: 130, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #ffd27a, ${GOLD} 55%, #a8661b)`, boxShadow: SH, transform: `scale(${2 - mag}) translateY(${-300 * (1 - mag)}px)`, opacity: cl(mag * 3) })} />
      </div>
    </AbsoluteFill>
  );
};

// 16 · el reposo: tres sellos sobre papel de carnicería — PIEL ARRIBA · AL AIRE · 5 MIN
export const RestRule: React.FC<B & { t: number; t2: number; t3: number }> = ({ a, a0, t, t2, t3 }) => {
  const { f, at } = useT0(a, a0);
  const cols: [string, number, React.ReactNode][] = [
    ["SKIN UP", t, <div style={{ width: 0, height: 0, borderLeft: "70px solid transparent", borderRight: "70px solid transparent", borderBottom: `110px solid ${CRISP}` }} />],
    ["OPEN AIR", t2, <div style={{ position: "relative", width: 160, height: 110, borderRadius: 14, background: "linear-gradient(135deg,#f4f5f6,#a9b0b6 50%,#e6e9eb)" }}><div style={pos({ left: -20, top: 48, width: 200, height: 14, background: RED, borderRadius: 7, transform: "rotate(-30deg)" })} /></div>],
    ["5 MIN", t3, <div style={{ width: 130, height: 130, borderRadius: "50%", border: `12px solid ${NAVY}`, background: `conic-gradient(${GOLD} 0 30deg, transparent 0)` }} />],
  ];
  return (
    <AbsoluteFill>
      <Bg m={BUTCHER} f={f} x={60} />
      <Thigh w={520} rot={-8} style={pos({ left: 700, top: 650, ...drop(f, 0, -300, 0) })} />
      {cols.map(([s, tt, icon], i) => (
        <div key={s} style={pos({ left: 150 + i * 560, top: 160, width: 460, height: 420, borderRadius: 30, border: `10px solid ${i === 0 ? CRISP : i === 1 ? RED : NAVY}`, background: "rgba(255,255,255,.35)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", ...pop(f, at(tt)) })}>
          {icon}
          <Txt txt={s} size={96} color={INK} style={{ marginTop: 30 }} />
        </div>
      ))}
    </AbsoluteFill>
  );
};

// 17 · pizarra "qué salió mal": síntoma → causa
export const FixChart: React.FC<B & { t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useT0(a, a0);
  const rows: [string, string, number][] = [["brown but soft", "still wet · crowded · a lid", t], ["burned first", "burner too high → medium", t2]];
  return (
    <AbsoluteFill>
      <Bg m={STEEL} f={f} x={30} />
      <div style={pos({ left: 150, top: 90, ...flipIn(f, 0) })}>
        <Frame w={1620} h={900}>
          <Txt txt="IF IT STILL DIDN'T WORK" size={80} color={GOLD} ls={4} style={pos({ left: 80, top: 50 })} />
          {rows.map(([s, c, tt], i) => (
            <div key={s} style={pos({ left: 80, top: 230 + i * 300, opacity: cl((f - at(tt) + 4) / 6) })}>
              <Hand txt={s} size={120} color={CREAM} f={f} at={at(tt)} chalk />
              <div style={{ display: "flex", alignItems: "center", marginTop: 6 }}>
                <div style={{ width: 120 * ez((f - at(tt) - 12) / 8), height: 8, background: GOLD, marginRight: 20, position: "relative" }}><div style={pos({ right: -6, top: -14, width: 0, height: 0, borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderLeft: `26px solid ${GOLD}` })} /></div>
                <Hand txt={c} size={96} color="#F6D89A" f={f} at={at(tt) + 18} chalk />
              </div>
            </div>
          ))}
        </Frame>
      </div>
    </AbsoluteFill>
  );
};

// 18 · carne chiclosa junto al hueso = le faltó cocción (no le sobró): +10 min y termómetro
export const ChewyFix: React.FC<B & { t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={APRON} f={f} x={50} o={0.16} />
      <div style={pos({ left: 140, top: 180, width: 860, height: 540, borderRadius: 24, background: ENAMEL, boxShadow: SH, padding: 50, ...slide(f, 0, -700) })}>
        <Txt txt="CHEWY NEAR THE BONE?" size={64} color={NAVY} />
        <div style={{ position: "relative", display: "inline-block", marginTop: 50 }}><Txt txt="OVERCOOKED" size={96} color="#8d8478" /><Strike f={f} at={at(t) + 20} /></div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 30, ...pop(f, at(t) + 30) }}><Tick f={f} at={at(t) + 32} s={74} /><Txt txt="UNDERCOOKED" size={96} color={GREEN} /></div>
      </div>
      <div style={pos({ left: 1050, top: 160, ...pop(f, at(t) + 40) })}>
        <div style={{ width: 360, height: 360, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #ffd27a, ${GOLD} 60%, ${CRISP})`, boxShadow: SH, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "8px dashed rgba(255,255,255,.6)" }}>
          <Txt txt="+10" size={170} color={INK} /><Txt txt="MINUTES" size={50} color={INK} ls={4} />
        </div>
      </div>
      <div style={pos({ left: 1000, top: 620, ...slide(f, at(t2), 700) })}>
        <div style={{ padding: "30px 46px", background: BUTCHER, boxShadow: SH, borderRadius: 12, transform: "rotate(-3deg)" }}>
          <Hand txt="a thermometer costs less" size={76} color={INK} />
          <Hand txt="than one ruined supper" size={76} color={RED} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 19 · la cuenta: ticket térmico de la balanza que se imprime línea por línea (se corta por el avatar: sigue donde iba con a0)
export const Receipt: React.FC<B & { t: number; t2: number; t3: number; t4: number; t5: number }> = ({ a, a0, t, t2, t3, t4, t5 }) => {
  const { f, at } = useT0(a, a0);
  const L: [string, string, number, string][] = [["RESTAURANT · 2 PC", "$11.00", t, "#8d8478"], ["6 THIGHS BONE-IN", "$4.80", t2, INK], ["PER THIGH", "$0.80", t3, INK], ["+ SALT & POWDER", "< $1", t4, INK], ["SUPPER (2 THIGHS)", "< $2", t5, RED]];
  const shown = L.filter((l) => f >= at(l[2]) - 4).length;
  const h = 260 + shown * 128;
  return (
    <AbsoluteFill>
      <Bg m={STEEL} f={f} x={70} />
      <div style={pos({ left: 560, top: 0, width: 800, height: 120, borderRadius: "0 0 30px 30px", background: "linear-gradient(180deg,#3c3f44,#1f2125)", boxShadow: SH, zIndex: 2 })}>
        <div style={pos({ left: 90, top: 92, width: 620, height: 10, background: "#000", borderRadius: 5 })} />
      </div>
      <div style={pos({ left: 580, top: 90, width: 760, height: h, transition: "none", background: "repeating-linear-gradient(180deg, rgba(0,0,0,.015) 0 2px, transparent 2px 5px), linear-gradient(90deg,#f1efe9,#ffffff 30%,#f6f4ef)", boxShadow: SH, padding: "60px 50px", overflow: "hidden",
        clipPath: "polygon(0 0, 100% 0, 100% 98%, 96% 100%, 92% 98%, 88% 100%, 84% 98%, 80% 100%, 76% 98%, 72% 100%, 68% 98%, 64% 100%, 60% 98%, 56% 100%, 52% 98%, 48% 100%, 44% 98%, 40% 100%, 36% 98%, 32% 100%, 28% 98%, 24% 100%, 20% 98%, 16% 100%, 12% 98%, 8% 100%, 4% 98%, 0 100%)" })}>
        <Txt txt="THE ARITHMETIC" size={52} color={INK} ls={6} style={{ textAlign: "center" }} />
        <div style={{ borderTop: "4px dashed #777", margin: "22px 0 30px" }} />
        {L.map(([l, v, tt, c], i) => (
          <div key={l} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", height: 128, opacity: cl((f - at(tt) + 4) / 5) }}>
            <Txt txt={l} size={38} color={c} w={500} />
            <div style={{ position: "relative" }}><Txt txt={v} size={i === 4 ? 96 : 80} color={c} />{i === 0 ? <Strike f={f} at={at(t2) + 6} /> : null}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 20 · repaso: pizarra de menú con los 8 trucos que se escriben a tiza en su palabra
export const Recap: React.FC<B & { t1: number; t2: number; t3: number; t4: number; t5: number; t6: number; t7: number; t8: number }> = (p) => {
  const { f, at } = useT0(p.a, p.a0);
  const L: [string, number][] = [["bone-in, skin-on", p.t1], ["trim · stretch · press dry", p.t2], ["salt + baking powder, uncovered", p.t3], ["cold pan, skin down, leave it", p.t4],
    ["press it with a weight", p.t5], ["room in the pan · never a lid", p.t6], ["thigh to 185°, not 165°", p.t7], ["rest skin up, uncovered", p.t8]];
  const cur = L.reduce((k, l, i) => (f >= at(l[1]) ? i : k), -1);
  return (
    <AbsoluteFill>
      <Bg m={WOOD} f={f} x={50} o={0.3} />
      <div style={pos({ left: 110, top: 40 })}>
        <Frame w={1700} h={1000}>
          <Txt txt="HELEN'S 8 TRICKS" size={70} color={GOLD} ls={8} style={pos({ left: 0, right: 0, top: 34, textAlign: "center" })} />
          {L.map(([s, tt], i) => (
            <div key={i} style={pos({ left: i < 4 ? 60 : 905, top: 170 + (i % 4) * 190, display: "flex", alignItems: "center", opacity: f >= at(tt) - 2 ? 1 : 0.0 })}>
              <div style={{ width: 92, height: 92, borderRadius: "50%", border: `5px solid ${i === cur ? GOLD : "rgba(251,244,228,.7)"}`, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 22, background: i === cur ? "rgba(229,165,60,.25)" : "transparent" }}>
                <Txt txt={String(i + 1)} size={60} color={i === cur ? GOLD : CREAM} />
              </div>
              <Hand txt={s} size={60} color={i === cur ? "#F6D89A" : CREAM} f={f} at={at(tt)} dur={18} chalk />
            </div>
          ))}
        </Frame>
      </div>
    </AbsoluteFill>
  );
};

// 21 · la tarea: "hacé DOS" en dos fichas clavadas en el corcho
export const Homework: React.FC<B & { t: number; t2: number; t3: number }> = ({ a, a0, t, t2, t3 }) => {
  const { f, at } = useT0(a, a0);
  const pin = (c: string) => <div style={pos({ left: "46%", top: -26, width: 52, height: 52, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #fff8, ${c} 50%, #0006)`, boxShadow: "0 6px 8px rgba(0,0,0,.4)" })} />;
  return (
    <AbsoluteFill>
      <Bg m={CORK} f={f} x={40} o={0.3} />
      <div style={pos({ left: 0, right: 0, top: 70, textAlign: "center", ...pop(f, at(t)) })}><Txt txt="HOMEWORK: JUST DO TWO" size={110} color={CREAM} style={{ textShadow: "0 6px 14px rgba(0,0,0,.5)" }} /></div>
      <div style={pos({ left: 180, top: 300, ...drop(f, at(t2) - 4, -700, -12) })}>
        <Card w={720} h={560} bg={LINED} rot={-4}>{pin(RED)}
          <Txt txt="TONIGHT" size={80} color={RED} style={pos({ left: 100, top: 40 })} />
          <Hand txt="salt the thighs" size={84} color={NAVY} style={pos({ left: 100, top: 170 })} />
          <Hand txt="uncovered, in the fridge" size={74} color={NAVY} style={pos({ left: 100, top: 290 })} />
        </Card>
      </div>
      <div style={pos({ left: 1020, top: 320, ...drop(f, at(t3) - 4, -700, 12) })}>
        <Card w={720} h={560} bg={LINED} rot={3}>{pin(NAVY)}
          <Txt txt="TOMORROW" size={80} color={NAVY} style={pos({ left: 100, top: 40 })} />
          <Hand txt="cold pan, skin down" size={84} color={NAVY} style={pos({ left: 100, top: 170 })} />
          <Hand txt="and leave it alone" size={84} color={NAVY} style={pos({ left: 100, top: 290 })} />
        </Card>
      </div>
    </AbsoluteFill>
  );
};

// 22 · la pregunta para comentarios: tarjeta de comentario que se escribe + respuestas que se apilan
export const CommentAsk: React.FC<B & { t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useT0(a, a0);
  const q = "Did your mother put a lid on the chicken?";
  const n = Math.round(q.length * ez((f - at(t)) / 40));
  const reps = ["Every single Sunday!", "Always. Rubber skin all my life", "No lid in our house, ever"];
  return (
    <AbsoluteFill>
      <Bg m={APRON} f={f} x={30} o={0.16} />
      <div style={pos({ left: 230, top: 150, width: 1460, padding: "50px 60px", borderRadius: 34, background: "#FFFFFF", boxShadow: SH, display: "flex", ...pop(f, 0) })}>
        <div style={{ width: 130, height: 130, borderRadius: "50%", background: `radial-gradient(circle at 40% 35%, #F6D89A, ${GOLD})`, flex: "none", display: "flex", alignItems: "center", justifyContent: "center" }}><Txt txt="H" size={80} color={NAVY} /></div>
        <div style={{ marginLeft: 40 }}>
          <Txt txt="HELEN · TELL ME IN THE COMMENTS" size={40} color="#7a7a7a" w={500} ls={2} />
          <div style={{ fontFamily: OSW, fontWeight: 600, fontSize: 82, color: INK, marginTop: 12, lineHeight: 1.05, width: 1180 }}>{q.slice(0, n)}<span style={{ opacity: (f % 16) < 8 ? 1 : 0 }}>|</span></div>
        </div>
      </div>
      {reps.map((r, i) => (
        <div key={r} style={pos({ left: 420 + i * 60, top: 560 + i * 140, padding: "24px 40px", borderRadius: 26, background: "rgba(251,244,228,.95)", boxShadow: SH, ...slide(f, at(t2) + i * 8, 900) })}>
          <Txt txt={r} size={54} color={NAVY} w={500} ls={0} style={{ textTransform: "none" }} />
        </div>
      ))}
    </AbsoluteFill>
  );
};

// 23 · el próximo video: frasco de grasa dorada + papas, "nunca hiervas las papas en agua sola"
export const NextUp: React.FC<B & { t: number; t2: number }> = ({ a, a0, t, t2 }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Bg m={WOOD} f={f} x={60} o={0.32} />
      <div style={pos({ left: 200, top: 240, ...drop(f, 0, -600, -6) })}>
        <div style={{ position: "relative", width: 380, height: 520 }}>
          <div style={pos({ left: 30, top: 0, width: 320, height: 70, borderRadius: 12, background: "linear-gradient(90deg,#8d959c,#f1f3f4 35%,#aab1b7 65%,#6f777e)", boxShadow: "0 6px 10px rgba(0,0,0,.3)" })} />
          <div style={pos({ left: 0, top: 60, width: 380, height: 460, borderRadius: "40px 40px 60px 60px", background: "linear-gradient(90deg, rgba(255,255,255,.45), rgba(255,255,255,.08) 30%, rgba(255,255,255,.3) 70%, rgba(255,255,255,.1)), rgba(255,255,255,.18)", border: "4px solid rgba(255,255,255,.7)", overflow: "hidden", boxShadow: SH })}>
            <div style={pos({ left: 0, right: 0, bottom: 0, height: "72%", background: "linear-gradient(180deg, #F5D37A, #E2A93E)" })} />
          </div>
        </div>
      </div>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} style={pos({ left: 650 + i * 120, top: 640 + (i % 2) * 70, width: 170, height: 120, borderRadius: "50% 45% 55% 50%", background: "radial-gradient(circle at 30% 30%, rgba(80,50,20,.4) 0 3px, transparent 4px) 0 0/31px 27px, radial-gradient(ellipse at 40% 35%, #D8B07A, #A87843 70%, #7f5528)", boxShadow: "0 10px 16px rgba(0,0,0,.4)", transform: `rotate(${i * 25}deg)`, ...pop(f, 6 + i * 3) })} />
      ))}
      <div style={pos({ left: 700, top: 130 })}>
        <div style={{ ...pop(f, at(t) - 6) }}><div style={{ display: "inline-block", padding: "10px 26px", background: RED, borderRadius: 10 }}><Txt txt="NEXT TIME" size={50} color="#fff" ls={6} /></div></div>
        <Txt txt="NEVER BOIL POTATOES" size={118} color={CREAM} style={{ marginTop: 26, textShadow: "0 6px 14px rgba(0,0,0,.45)", ...slide(f, at(t), 700) }} />
        <Txt txt="IN PLAIN WATER AGAIN" size={118} color={GOLD} style={{ textShadow: "0 6px 14px rgba(0,0,0,.45)", ...slide(f, at(t) + 8, 700) }} />
        <div style={{ marginTop: 30, opacity: cl((f - at(t2)) / 8) }}><Hand txt="…taste like a holiday" size={90} color={CREAM} f={f} at={at(t2)} /></div>
      </div>
    </AbsoluteFill>
  );
};
