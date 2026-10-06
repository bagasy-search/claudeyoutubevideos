// Kit Rhonda · ANILLO DEL INODORO (rhtoiletring): gráficos DENTRO del mundo (mesada, taza, luz de ventana, sombra).
//   RhPasteMix      bol sobre la mesada: caen 3 cucharadas de bicarbonato y 1 de agua oxigenada, se revuelve y queda "como pasta dental"
//   RhWaterLevel    la taza de costado (porcelana dibujada sobre la foto): llave cerrada → descarga → se saca con vaso → el anillo queda "high and dry"
//   RhPumiceWetDry  dos mitades de esmalte: piedra MOJADA (gotas, se desliza, queda liso) vs SECA (chispas y surcos rojos)
//   RhHardWater     3 polaroids de las señales de agua dura (canilla con costra, vaso manchado, pava con sarro) pinchadas en la pared
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { RH, SERIF, LABEL, HAND, hexA, rnd } from "./RhTheme";
import { Bed, Card, Tape, lin, pop, tileBg, useOut } from "./RhParts";

const Wall: React.FC = () => (
  <AbsoluteFill style={{ ...tileBg(200, 100) }}>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 18% 22%, rgba(255,248,230,0.9), rgba(255,255,255,0.1) 50%, rgba(30,42,54,0.1) 100%)" }} />
  </AbsoluteFill>
);
// mesada de piedra clara en perspectiva (abajo del cuadro)
const Counter: React.FC = () => (
  <div style={{ position: "absolute", left: -200, right: -200, bottom: 0, height: 420, background: "linear-gradient(180deg, #E9E4DA 0%, #D9D2C4 100%)", transform: "perspective(900px) rotateX(38deg)", transformOrigin: "50% 100%", boxShadow: "0 -6px 0 #CFC7B6 inset" }} />
);

export const RhPasteMix: React.FC<{ bed?: string }> = ({ bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const per = Math.max(8, (T * 0.55) / 4);
  const drops = [0, 1, 2, 3].map((i) => lin(f, 6 + i * per, 6 + i * per + per * 0.6));
  const stir = lin(f, 6 + 4 * per, T - 8);
  const fill = 0.12 + 0.12 * drops.reduce((a, b) => a + b, 0);
  const ang = f * 0.25 * (stir > 0 && stir < 1 ? 1 : 0);
  const lab = (i: number) => (i < 3 ? `${i + 1} tbsp baking soda` : "1 tbsp peroxide");
  return (
    <AbsoluteFill style={{ opacity: out }}>
      {bed ? <Bed src={bed} seed={51} dim={0.35} /> : <Wall />}
      <Counter />
      {/* el bol */}
      <svg width={760} height={520} viewBox="0 0 760 520" style={{ position: "absolute", left: 230, top: 420, filter: "drop-shadow(0 30px 24px rgba(30,42,54,0.3))" }}>
        <ellipse cx={380} cy={140} rx={330} ry={86} fill="#F4F1EA" stroke="#D6CFC2" strokeWidth={6} />
        <ellipse cx={380} cy={150} rx={300 * (0.6 + fill)} ry={70 * (0.6 + fill)} fill={stir > 0.5 ? "#F8F7F2" : "#FBFAF6"} />
        {stir > 0 ? Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx={380} cy={150} rx={60 + i * 45} ry={14 + i * 11} fill="none" stroke="rgba(190,180,160,0.6)" strokeWidth={3} strokeDasharray="30 20" transform={`rotate(${ang * (i % 2 ? -1 : 1) * 20} 380 150)`} />) : null}
        <path d="M 50 140 Q 70 420 380 440 Q 690 420 710 140" fill="#ECE7DD" stroke="#D6CFC2" strokeWidth={6} />
        {/* la cuchara que revuelve */}
        {stir > 0 ? <g transform={`rotate(${Math.sin(f / 5) * 18} 380 150)`}><rect x={370} y={-180} width={22} height={320} rx={10} fill="#BFC5CA" /><ellipse cx={381} cy={150} rx={42} ry={20} fill="#AAB1B7" /></g> : null}
      </svg>
      {/* cucharadas que caen */}
      {drops.map((k, i) => (k > 0 && k < 1 ? (
        <div key={i} style={{ position: "absolute", left: 560 + (i % 2) * 60, top: interpolate(k, [0, 1], [80, 520]), width: 80, height: 50, borderRadius: "50%", background: i < 3 ? "#FFFFFF" : "rgba(220,240,252,0.9)", boxShadow: "0 6px 10px rgba(0,0,0,0.15)", opacity: 1 - k * 0.3 }} />
      ) : null))}
      {/* la receta, escrita a mano en una tarjeta pegada a la pared */}
      <div style={{ position: "absolute", right: 150, top: 120, width: 620, rotate: "2deg", translate: `0 ${(1 - pop(f, fps, 0, 15)) * 80}px` }}>
        <Card style={{ padding: "36px 44px", borderTop: `16px solid ${RH.blue}` }}>
          <Tape x={230} y={-30} rot={-3} w={170} />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, opacity: 0.25 + 0.75 * drops[i], fontFamily: HAND, fontWeight: 700, fontSize: 56, color: i < 3 ? RH.ink : RH.blueDeep, lineHeight: 1.15 }}>
              <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: RH.yellow, background: RH.ink, borderRadius: 8, padding: "0 12px" }}>{i < 3 ? "3" : "1"}</span>{lab(i)}
            </div>
          ))}
          <div style={{ marginTop: 14, fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: RH.ink, opacity: lin(f, T * 0.7, T * 0.8) }}>= like toothpaste</div>
        </Card>
      </div>
    </AbsoluteFill>
  );
};

export const RhWaterLevel: React.FC<{ img?: string }> = ({ img }) => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const s1 = lin(f, 4, T * 0.22), s2 = lin(f, T * 0.25, T * 0.5), s3 = lin(f, T * 0.52, T * 0.8);
  const level = 1 - 0.55 * Easing.inOut(Easing.cubic)(s2) - 0.35 * s3;   // 1 = normal, ~0.1 = vacía
  const ringY = 300, bottomY = 760, waterY = ringY + (1 - level) * (bottomY - ringY - 40);
  const step = s3 > 0 ? 3 : s2 > 0 ? 2 : 1;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      {img ? <Img src={staticFile(img)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", filter: "blur(6px) brightness(1.08)" }} /> : <Wall />}
      <AbsoluteFill style={{ background: "rgba(251,248,242,0.55)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 30px 26px rgba(30,42,54,0.3))" }}>
        <defs><clipPath id="bowlIn"><path d="M 560 230 Q 600 820 960 840 Q 1320 820 1360 230 Z" /></clipPath><linearGradient id="por" x1="0" x2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset="1" stopColor="#E8E5DF" /></linearGradient></defs>
        <path d="M 520 210 Q 560 880 960 900 Q 1360 880 1400 210 Z" fill="url(#por)" stroke="#D3CEC4" strokeWidth={8} />
        <g clipPath="url(#bowlIn)">
          <rect x={540} y={230} width={840} height={620} fill="#FBFBF8" />
          <rect x={540} y={waterY} width={840} height={900} fill="rgba(170,210,235,0.75)" />
          <path d={`M 540 ${waterY} Q 960 ${waterY + 12} 1380 ${waterY}`} stroke="rgba(255,255,255,0.9)" strokeWidth={5} fill="none" />
          {/* el anillo marrón en la línea de agua original */}
          <rect x={540} y={ringY - 16} width={840} height={30} fill="rgba(120,85,50,0.85)" />
          <rect x={540} y={ringY + 6} width={840} height={10} fill="rgba(200,190,170,0.9)" />
        </g>
        <rect x={500} y={180} width={920} height={50} rx={24} fill="#F5F3EE" stroke="#D3CEC4" strokeWidth={6} />
        {/* el vaso que saca agua */}
        {s3 > 0 && s3 < 1 ? <g transform={`translate(${880 + Math.sin(f / 4) * 40} ${interpolate(s3, [0, 0.5, 1], [200, 640, 200])}) rotate(${Math.sin(f / 4) * 20})`}><path d="M -50 0 L 50 0 L 40 110 L -40 110 Z" fill="rgba(235,245,252,0.85)" stroke="#9FB7C6" strokeWidth={5} /></g> : null}
      </svg>
      {/* la llave de paso (paso 1) */}
      <div style={{ position: "absolute", left: 150, top: 640, opacity: lin(f, 2, 10) }}>
        <svg width={260} height={200}><rect x={0} y={120} width={260} height={30} fill="#C9CED2" /><circle cx={130} cy={90} r={50} fill="#D9DDE0" stroke="#9AA2A8" strokeWidth={6} /><rect x={118} y={20} width={24} height={70} rx={10} fill={RH.red} transform={`rotate(${90 * s1} 130 90)`} /></svg>
      </div>
      {/* pasos escritos a mano */}
      <div style={{ position: "absolute", right: 110, top: 150, width: 520, display: "flex", flexDirection: "column", gap: 18 }}>
        {["Valve off", "Flush it low", "Scoop out the rest"].map((t, i) => (
          <div key={i} style={{ opacity: step > i ? 1 : 0.25, translate: `${step > i ? 0 : 30}px 0`, background: RH.white, borderLeft: `14px solid ${step === i + 1 ? RH.yellow : RH.blue}`, padding: "12px 26px", boxShadow: `0 12px 26px ${RH.shadow}`, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: RH.ink }}>{i + 1}. {t}</div>
        ))}
        <div style={{ opacity: lin(f, T * 0.8, T * 0.9), background: RH.blueDeep, color: "#fff", fontFamily: SERIF, fontWeight: 900, fontSize: 56, padding: "12px 26px", rotate: "-2deg" }}>Ring: high and dry</div>
      </div>
    </AbsoluteFill>
  );
};

export const RhPumiceWetDry: React.FC<{}> = () => {
  const f = useCurrentFrame(); const { durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const k = Easing.inOut(Easing.quad)(lin(f, 10, T * 0.75));
  const half = (dry: boolean) => {
    const x0 = dry ? 990 : 30, sx = x0 + 60 + k * 760;
    return (
      <div style={{ position: "absolute", left: x0, top: 150, width: 900, height: 760, borderRadius: 26, overflow: "hidden", background: "linear-gradient(160deg,#FFFFFF,#EDEBE6)", boxShadow: `0 26px 50px ${RH.shadow}, inset 0 0 60px rgba(180,190,200,0.25)` }}>
        {/* reflejo del esmalte */}
        <div style={{ position: "absolute", left: -100, top: 80, width: 1200, height: 90, background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.9), rgba(255,255,255,0))", rotate: "-8deg" }} />
        {/* la franja del anillo que se va (detrás de la piedra) */}
        <div style={{ position: "absolute", left: 0, top: 360, height: 70, width: "100%", background: `linear-gradient(90deg, transparent ${(sx - x0) / 9}%, rgba(130,95,60,0.8) ${(sx - x0) / 9 + 2}%)` }} />
        {dry ? Array.from({ length: 9 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40, top: 320 + i * 16, height: 3, width: Math.max(0, sx - x0 - 40), background: hexA(RH.red, 0.75), rotate: `${(rnd(i) - 0.5) * 2}deg`, transformOrigin: "0 50%" }} />) : null}
        {/* la piedra */}
        <div style={{ position: "absolute", left: sx - x0 - 110, top: 300, width: 200, height: 150, borderRadius: 40, background: "radial-gradient(circle at 35% 35%, #B5AFA3, #8F897D)", boxShadow: "0 18px 24px rgba(0,0,0,0.3)", rotate: `${Math.sin(f / 3) * 6}deg` }}>
          {Array.from({ length: 30 }, (_, i) => <div key={i} style={{ position: "absolute", left: 15 + rnd(i * 3) * 160, top: 15 + rnd(i * 7) * 110, width: 6 + rnd(i) * 8, height: 6 + rnd(i) * 8, borderRadius: "50%", background: "rgba(60,55,48,0.45)" }} />)}
        </div>
        {/* mojada: agua y gotas · seca: chispas */}
        {Array.from({ length: 16 }, (_, i) => { const ph = ((f * 0.06 + rnd(i * 5)) % 1); return dry ? (
          <div key={i} style={{ position: "absolute", left: sx - x0 - 20 + ph * 220 * (rnd(i) + 0.3), top: 370 - ph * 200 * rnd(i * 3) + ph * ph * 120, width: 10, height: 10, borderRadius: "50%", background: "#FFD873", boxShadow: "0 0 14px 4px rgba(255,200,80,0.8)", opacity: 1 - ph }} />
        ) : (
          <div key={i} style={{ position: "absolute", left: sx - x0 - 130 - rnd(i) * 120, top: 340 + ph * 300, width: 14, height: 20, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "rgba(170,210,240,0.8)", border: "2px solid rgba(255,255,255,0.8)", opacity: 1 - ph }} />
        ); })}
        <div style={{ position: "absolute", left: 40, top: 40, fontFamily: LABEL, fontWeight: 700, fontSize: 70, color: dry ? RH.red : RH.blueDeep, letterSpacing: 3 }}>{dry ? "DRY STONE" : "WET STONE"}</div>
        <div style={{ position: "absolute", left: 40, bottom: 50, opacity: lin(f, T * 0.6, T * 0.75), fontFamily: HAND, fontWeight: 700, fontSize: 70, color: dry ? RH.red : RH.blueDeep }}>{dry ? "scratched for good" : "smooth, no scratch"}</div>
      </div>
    );
  };
  return (<AbsoluteFill style={{ opacity: out }}><Wall />{half(false)}{half(true)}</AbsoluteFill>);
};

export const RhHardWater: React.FC<{ imgs: string[]; labels: string[] }> = ({ imgs, labels }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const z = interpolate(f, [0, T], [1, 1.05]);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Wall />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 50, scale: String(z) }}>
        {imgs.map((im, i) => { const p = pop(f, fps, 4 + i * 8, 13); const rot = [-4, 2, -2][i % 3];
          return (
            <div key={i} style={{ width: 520, background: "#fff", padding: "18px 18px 80px", rotate: `${rot}deg`, translate: `0 ${(1 - p) * 140}px`, opacity: Math.min(1, p * 1.5), boxShadow: `0 30px 50px ${RH.shadow}`, position: "relative" }}>
              <div style={{ position: "absolute", left: "50%", top: -14, width: 30, height: 30, borderRadius: "50%", background: RH.red, translate: "-50% 0", boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }} />
              <Img src={staticFile(im)} style={{ width: "100%", aspectRatio: "4 / 3", objectFit: "cover" }} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 52, color: RH.ink }}>{labels[i]}</div>
            </div>
          ); })}
      </div>
      <div style={{ position: "absolute", left: "50%", bottom: 50, translate: "-50% 0", opacity: lin(f, T * 0.55, T * 0.7), background: RH.blueDeep, color: "#fff", fontFamily: SERIF, fontWeight: 900, fontSize: 60, padding: "10px 36px", borderRadius: 12 }}>See these? You've got hard water</div>
    </AbsoluteFill>
  );
};

// RhRingColors — fichas de pintura en abanico apoyadas sobre la tapa del tanque (mundo real): los 5 colores del anillo.
// pick = -1 abanico entero (tease) · 0..4 la ficha elegida sale del abanico con QUÉ ES y QUÉ HACER (≤12 palabras)
const RINGS = [
  { c: "#7A5536", name: "Brown or gray", what: "Mineral + bacteria", do: "Paste + wet stone" },
  { c: "#E7E1D2", name: "White, chalky", what: "Mostly mineral", do: "Vinegar day" },
  { c: "#B5541F", name: "Rusty orange", what: "Iron in your water", do: "Lighten it, fix the water" },
  { c: "#1F1C17", name: "Black, smears", what: "Living slime", do: "Same paste, 20 minutes" },
  { c: "#E59AA8", name: "Pink, slick", what: "Bacteria", do: "Paste + brushing" },
];
export const RhRingColors: React.FC<{ pick?: number; bed?: string }> = ({ pick = -1, bed }) => {
  const f = useCurrentFrame(); const { fps, durationInFrames: T } = useVideoConfig(); const out = useOut(6);
  const open = pop(f, fps, 0, 16), sel = pick >= 0 ? pop(f, fps, 8, 13) : 0;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      {bed ? <Bed src={bed} seed={61} dim={0.3} /> : <Wall />}
      {/* tapa del tanque de porcelana en perspectiva */}
      <div style={{ position: "absolute", left: 160, right: 160, bottom: 60, height: 300, borderRadius: 40, background: "linear-gradient(180deg,#FFFFFF,#E9E6E0)", transform: "perspective(1000px) rotateX(48deg)", transformOrigin: "50% 100%", boxShadow: "0 30px 40px rgba(30,42,54,0.25)" }} />
      <div style={{ position: "absolute", left: pick >= 0 ? 360 : 960, top: 840, transition: "none" }}>
        {RINGS.map((r, i) => {
          const isSel = i === pick, ang = (i - 2) * 14 * open;
          const lift = isSel ? sel : 0;
          return (
            <div key={i} style={{ position: "absolute", left: -90, bottom: 0, width: 180, height: 600, transformOrigin: "50% 100%", rotate: `${ang * (1 - lift)}deg`, translate: `${lift * 520}px ${-lift * 60}px`, scale: String(1 + lift * 0.35), zIndex: isSel ? 10 : i, opacity: pick >= 0 && !isSel ? 0.55 : 1 }}>
              <div style={{ width: "100%", height: "100%", background: "#fff", borderRadius: 14, boxShadow: `0 ${10 + lift * 30}px ${20 + lift * 30}px rgba(30,42,54,0.3)`, padding: 14, boxSizing: "border-box" }}>
                <div style={{ height: 300, borderRadius: 8, background: r.c, boxShadow: "inset 0 0 30px rgba(0,0,0,0.15)" }} />
                <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, color: RH.ink, marginTop: 14, lineHeight: 1.05 }}>{r.name.toUpperCase()}</div>
              </div>
            </div>
          );
        })}
      </div>
      {pick >= 0 ? (
        <div style={{ position: "absolute", right: 140, top: 200, width: 700, opacity: lin(f, 14, 26), translate: `${(1 - lin(f, 14, 26)) * 60}px 0` }}>
          <Card style={{ padding: "40px 50px", borderLeft: `20px solid ${RINGS[pick].c}` }}>
            <div style={{ fontFamily: LABEL, fontWeight: 600, fontSize: 38, letterSpacing: 3, color: RH.inkSoft }}>{RINGS[pick].name.toUpperCase()}</div>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 82, color: RH.ink, lineHeight: 1.05, marginTop: 6 }}>{RINGS[pick].what}</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 66, color: RH.blueDeep, marginTop: 12, opacity: lin(f, T * 0.35, T * 0.5) }}>→ {RINGS[pick].do}</div>
          </Card>
        </div>
      ) : (
        <div style={{ position: "absolute", left: "50%", top: 130, translate: "-50% 0", opacity: lin(f, 10, 22), fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: RH.ink, background: "rgba(255,255,255,0.85)", padding: "8px 40px", borderRadius: 14 }}>Which ring is yours?</div>
      )}
    </AbsoluteFill>
  );
};
