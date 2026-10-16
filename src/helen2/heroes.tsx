// helen2 · componentes PROPIOS (repollo + cerdo de 2 dólares). Capas: textura real del oficio → luz/sombra → foto real → datos → acento.
// Fuentes: LABEL (Oswald) + HAND (Caveat). Paleta: azul delantal, papel crema, verde repollo, ámbar ahumado, rojo precio.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { img, sp, useT, ez, eo, cl, Mark, LABEL, HAND, fit, FPS } from "../lkit/core";

const NAVY = "#1E2C47", CREAM = "#F7F1E3", GREEN = "#5E8C3A", AMBER = "#B3631E", RED = "#B8322A", CHALK = "#EEEBE2", INK = "#2A2520";
type Base = { a: number; a0?: number; d: number };
const useT0 = (a: number, a0?: number) => { const { f } = useT(a); const s = a0 ?? a; const R = (t: number) => Math.round(t * FPS); return { f: f + R(a) - R(s), at: (t: number) => R(t) - R(s) }; };
const Tex: React.FC<{ k: string; f: number; d: number; dim?: number }> = ({ k, f, d, dim = 0 }) => (
  <AbsoluteFill style={{ overflow: "hidden", background: "#222" }}>
    <AbsoluteFill style={{ transform: `scale(${1.03 + 0.04 * f / Math.max(1, d)})` }}>
      <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: dim ? `brightness(${1 - dim})` : undefined }} />
    </AbsoluteFill>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 80% at 22% 8%, rgba(255,240,210,0.20), rgba(255,240,210,0) 60%), linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.28))" }} />
  </AbsoluteFill>
);
// foto real con paspartú blanco y sombra proyectada; entra con resorte
const Photo: React.FC<{ k: string; w: number; h: number; x: number; y: number; rot?: number; f: number; at?: number; from?: "up" | "left" | "right" | "down"; mat?: number; z?: number }> =
  ({ k, w, h, x, y, rot = 0, f, at = 0, from = "up", mat = 14, z = 1 }) => {
    const u = sp(f, at, 15, 120);
    const dx = from === "left" ? -700 : from === "right" ? 700 : 0, dy = from === "up" ? -500 : from === "down" ? 500 : 0;
    return (
      <div style={{ position: "absolute", left: x, top: y, zIndex: z, opacity: cl(u * 2), transform: `translate(${dx * (1 - u)}px, ${dy * (1 - u)}px) rotate(${rot + (1 - u) * 6}deg)` }}>
        <div style={{ background: "#FFFDF8", padding: `${mat}px ${mat}px ${mat * 1.3}px`, borderRadius: 3, boxShadow: `0 ${30 + 20 * u}px ${70}px rgba(20,12,4,0.5), 0 5px 12px rgba(0,0,0,0.25)` }}>
          <div style={{ width: w, height: h, overflow: "hidden" }}>
            <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.03 + 0.05 * Math.min(1, f / 300)})` }} />
          </div>
        </div>
      </div>
    );
  };
// texto que se escribe a mano (revela de izquierda a derecha)
const Write: React.FC<{ txt: string; f: number; at: number; size: number; color?: string; dur?: number; font?: string; shadow?: string; weight?: number }> =
  ({ txt, f, at, size, color = NAVY, dur, font = HAND, shadow, weight = 700 }) => {
    const D = dur ?? Math.max(10, txt.length * 1.3);
    const u = ez((f - at) / D);
    return <div style={{ fontFamily: font, fontSize: size, color, fontWeight: weight, whiteSpace: "nowrap", clipPath: `inset(-20% ${100 - u * 100}% -30% 0)`, textShadow: shadow, lineHeight: 1.1 }}>{txt}</div>;
  };
const Pin: React.FC<{ x: number; y: number; c?: string }> = ({ x, y, c = RED }) => (
  <div style={{ position: "absolute", left: x - 16, top: y - 16, width: 32, height: 32, borderRadius: 16, zIndex: 9,
    background: `radial-gradient(circle at 35% 30%, #fff8 0 18%, ${c} 22% 70%, #0006 100%)`, boxShadow: "4px 8px 8px rgba(0,0,0,0.45)" }} />
);
const Lbl: React.FC<{ txt: string; size: number; color?: string; ls?: number; style?: React.CSSProperties }> = ({ txt, size, color = NAVY, ls = 2, style }) => (
  <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: size, color, letterSpacing: ls, textTransform: "uppercase", lineHeight: 1.05, ...style }}>{txt}</div>
);
const pop = (f: number, at: number) => { const u = sp(f, at, 12, 170); return { opacity: cl(u * 3), transform: `scale(${0.7 + 0.3 * u})` }; };

// 1 · ticket de balanza que se imprime desde la ranura
export const ScaleTicket: React.FC<Base & { k: string; head: string; lines: { txt: string; amt: string; t: number }[]; total: { txt: string; amt: string; t: number } }> = ({ a, a0, d, k, head, lines, total }) => {
  const { f, at } = useT0(a, a0);
  const rows = [...lines, total];
  const shown = rows.filter((r) => f >= at(r.t) - 2).length;
  const hTarget = 140 + shown * 92;
  const H = hTarget - 30 * (1 - ez((f - at(rows[Math.max(0, shown - 1)].t)) / 10));
  return (
    <AbsoluteFill>
      <Tex k="tx_steel" f={f} d={d} />
      <Photo k={k} w={820} h={480} x={90} y={250} rot={-2.5} f={f} at={2} from="left" />
      <div style={{ position: "absolute", left: 1020, top: 150, width: 820, height: 46, borderRadius: 10, background: "linear-gradient(180deg,#2b2f33,#5a6066)", boxShadow: "inset 0 6px 10px #000a, 0 2px 0 #fff4", zIndex: 3 }} />
      <div style={{ position: "absolute", left: 1060, top: 176, width: 740, height: Math.max(40, H), overflow: "hidden", zIndex: 2, filter: "drop-shadow(0 26px 30px rgba(0,0,0,0.45))" }}>
        <div style={{ position: "absolute", left: 0, bottom: 0, width: 740, height: hTarget, background: "#FDFCF7",
          clipPath: "polygon(0 0,100% 0,100% calc(100% - 14px),97% 100%,94% calc(100% - 14px),91% 100%,88% calc(100% - 14px),85% 100%,82% calc(100% - 14px),79% 100%,76% calc(100% - 14px),73% 100%,70% calc(100% - 14px),67% 100%,64% calc(100% - 14px),61% 100%,58% calc(100% - 14px),55% 100%,52% calc(100% - 14px),49% 100%,46% calc(100% - 14px),43% 100%,40% calc(100% - 14px),37% 100%,34% calc(100% - 14px),31% 100%,28% calc(100% - 14px),25% 100%,22% calc(100% - 14px),19% 100%,16% calc(100% - 14px),13% 100%,10% calc(100% - 14px),7% 100%,4% calc(100% - 14px),0 100%)", padding: "40px 44px" }}>
          <Lbl txt={head} size={40} color="#555" ls={6} />
          <div style={{ borderTop: "3px dashed #bbb", margin: "14px 0 10px" }} />
          {rows.map((r, i) => i < shown && (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", height: 92, opacity: cl((f - at(r.t) + 2) / 6) }}>
              <Lbl txt={r.txt} size={r === total ? 52 : 42} color={r === total ? INK : "#444"} />
              <Lbl txt={r.amt} size={r === total ? 74 : 46} color={r === total ? RED : "#444"} />
            </div>
          ))}
        </div>
      </div>
      <Mark kind="circle" x={1530} y={176 + 120 + (rows.length - 1) * 92 + 6} w={290} h={110} f={f} at={at(total.t) + 6} color={RED} sw={8} />
    </AbsoluteFill>
  );
};

// 2 · olla de agua vs sartén con taza: antes / después partido
export const PotVsPan: React.FC<Base & { kL: string; kR: string; txtL: string; subL: string; txtR: string; subR: string; tR: number; tX: number }> = ({ a, a0, d, kL, kR, txtL, subL, txtR, subR, tR, tX }) => {
  const { f, at } = useT0(a, a0);
  const X = ez((f - at(tX)) / 10);
  return (
    <AbsoluteFill>
      <Tex k="tx_block" f={f} d={d} dim={0.15} />
      <Photo k={kL} w={760} h={440} x={90} y={170} rot={-3} f={f} at={2} from="left" />
      <Photo k={kR} w={760} h={440} x={1040} y={150} rot={2.2} f={f} at={at(tR)} from="right" />
      <div style={{ position: "absolute", left: 120, top: 700, width: 790, ...pop(f, 8) }}>
        <div style={{ background: CREAM, padding: "18px 30px", borderRadius: 6, boxShadow: "0 18px 30px rgba(0,0,0,0.4)", transform: "rotate(-1.5deg)" }}>
          <Lbl txt={txtL} size={58} color={INK} /><Write txt={subL} f={f} at={14} size={50} color="#7a4b2a" />
        </div>
      </div>
      <div style={{ position: "absolute", left: 1070, top: 680, width: 790, ...pop(f, at(tR) + 6) }}>
        <div style={{ background: NAVY, padding: "18px 30px", borderRadius: 6, boxShadow: "0 18px 30px rgba(0,0,0,0.4)", transform: "rotate(1.2deg)" }}>
          <Lbl txt={txtR} size={58} color="#fff" /><Write txt={subR} f={f} at={at(tR) + 12} size={50} color="#BFE39A" />
        </div>
      </div>
      {X > 0 && <svg style={{ position: "absolute", left: 140, top: 200, overflow: "visible" }} width={700} height={420}>
        <path d="M 30 30 L 670 390" stroke={RED} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cl(X * 2)} fill="none" style={{ filter: "drop-shadow(0 6px 6px #0008)" }} />
        <path d="M 670 30 L 30 390" stroke={RED} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cl(X * 2 - 1)} fill="none" style={{ filter: "drop-shadow(0 6px 6px #0008)" }} />
      </svg>}
    </AbsoluteFill>
  );
};

// 3 · tres cortes de cerdo baratos con etiqueta colgante que se balancea
export const PorkTrio: React.FC<Base & { head: string; items: { k: string; name: string; price: string; t: number }[] }> = ({ a, a0, d, head, items }) => {
  const { f, at } = useT0(a, a0);
  return (
    <AbsoluteFill>
      <Tex k="tx_paper" f={f} d={d} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, display: "flex", justifyContent: "center", ...pop(f, 3) }}><Lbl txt={head} size={84} color={NAVY} ls={4} /></div>
      <Mark kind="under" x={560} y={168} w={800} h={30} f={f} at={12} color={AMBER} sw={10} />
      {items.map((it, i) => {
        const x = 90 + i * 600, t0 = at(it.t);
        const sw = f > t0 ? 9 * Math.exp(-(f - t0) / 22) * Math.sin((f - t0) / 4.2) : 0;
        return (
          <React.Fragment key={i}>
            <Photo k={it.k} w={520} h={330} x={x} y={260} rot={[-2.5, 1.5, -1][i]} f={f} at={t0} from="up" />
            {f >= t0 + 6 && <div style={{ position: "absolute", left: x + 110, top: 640, transformOrigin: "50% -60px", transform: `rotate(${sw}deg)`, opacity: cl((f - t0 - 6) / 5) }}>
              <svg style={{ position: "absolute", left: 145, top: -70, overflow: "visible" }} width={10} height={80}><path d="M 5 0 L 5 78" stroke="#8a7a62" strokeWidth={3} /></svg>
              <div style={{ width: 300, padding: "30px 16px 20px", background: "#F4E9CC", borderRadius: "14px 14px 8px 8px", boxShadow: "0 18px 26px rgba(0,0,0,0.35)", textAlign: "center", position: "relative" }}>
                <div style={{ position: "absolute", left: 140, top: 8, width: 20, height: 20, borderRadius: 10, background: "#d8ccb0", boxShadow: "inset 0 2px 3px #0005" }} />
                <Write txt={it.name} f={f} at={t0 + 8} size={Math.min(54, fit(it.name, 250, 54, "hand"))} color={INK} />
                <Lbl txt={it.price} size={68} color={RED} />
              </div>
            </div>}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};

// 4 · nota de pedido amarilla clavada en el corcho, escrita a mano
export const OrderSlip: React.FC<Base & { k: string; head: string; lines: { txt: string; t: number }[] }> = ({ a, a0, d, k, head, lines }) => {
  const { f, at } = useT0(a, a0);
  const u = sp(f, 4, 14, 120);
  return (
    <AbsoluteFill>
      <Tex k="tx_cork" f={f} d={d} />
      <Photo k={k} w={680} h={420} x={110} y={300} rot={-4} f={f} at={2} from="left" />
      <Pin x={460} y={300} />
      <div style={{ position: "absolute", left: 960, top: 170, width: 820, minHeight: 640, background: "linear-gradient(180deg,#F6E7A6,#EFD98A)", transform: `rotate(${2 - (1 - u) * 8}deg) translateY(${(1 - u) * -300}px)`, opacity: cl(u * 2),
        boxShadow: "0 40px 60px rgba(40,20,0,0.45), 0 4px 8px rgba(0,0,0,0.2)", padding: "70px 60px 50px" }}>
        <Lbl txt={head} size={40} color="#8a6d2b" ls={8} />
        <div style={{ height: 3, background: "#c9ad62", margin: "10px 0 30px" }} />
        {lines.map((l, i) => <div key={i} style={{ marginBottom: 26 }}><Write txt={l.txt} f={f} at={at(l.t)} size={fit(l.txt, 720, 96, "hand")} color={NAVY} /></div>)}
      </div>
      <Pin x={1370} y={200} c="#2f5e9e" />
    </AbsoluteFill>
  );
};

// 5 · perilla en MEDIO + reloj que corre + "2-3 cucharadas"
export const RenderGauge: React.FC<Base & { k: string; tMed: number; tTime: number; tFat: number; fat: string }> = ({ a, a0, d, k, tMed, tTime, tFat, fat }) => {
  const { f, at } = useT0(a, a0);
  const ang = -120 + 120 * sp(f, at(tMed), 11, 90);   // LOW(-120) → MEDIUM(0)
  const mins = Math.min(10, 10 * ez((f - at(tTime)) / (3 * FPS)));
  const R = 190;
  return (
    <AbsoluteFill>
      <Tex k="tx_steel" f={f} d={d} />
      <Photo k={k} w={860} h={500} x={80} y={250} rot={-2} f={f} at={2} from="left" />
      <div style={{ position: "absolute", left: 1150, top: 120, width: 560, height: 560 }}>
        <svg width={560} height={560} style={{ overflow: "visible", filter: "drop-shadow(0 24px 30px rgba(0,0,0,0.5))" }}>
          <circle cx={280} cy={280} r={R + 50} fill="#1f2328" stroke="#8c939a" strokeWidth={6} />
          {[-120, -60, 0, 60, 120].map((g, i) => <line key={i} x1={280 + Math.sin(g * Math.PI / 180) * (R + 10)} y1={280 - Math.cos(g * Math.PI / 180) * (R + 10)} x2={280 + Math.sin(g * Math.PI / 180) * (R + 38)} y2={280 - Math.cos(g * Math.PI / 180) * (R + 38)} stroke={g === 0 ? AMBER : "#ccc"} strokeWidth={g === 0 ? 10 : 5} />)}
          <circle cx={280} cy={280} r={R - 30} fill="url(#kn)" />
          <defs><radialGradient id="kn" cx="40%" cy="35%"><stop offset="0" stopColor="#f2f2f2" /><stop offset="1" stopColor="#9aa1a8" /></radialGradient></defs>
          <g transform={`rotate(${ang} 280 280)`}><rect x={262} y={110} width={36} height={170} rx={16} fill="#2a2e33" /><circle cx={280} cy={140} r={9} fill={AMBER} /></g>
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 540, textAlign: "center", ...pop(f, at(tMed) + 4) }}><Lbl txt="MEDIUM HEAT" size={64} color="#fff" style={{ textShadow: "0 4px 12px #000a" }} /></div>
      </div>
      <div style={{ position: "absolute", left: 1150, top: 770, width: 560, textAlign: "center", ...pop(f, at(tTime)) }}>
        <Lbl txt={`${Math.round(mins)} MIN`} size={110} color={AMBER} style={{ textShadow: "0 6px 16px #000b" }} />
      </div>
      <div style={{ position: "absolute", left: 240, top: 820, ...pop(f, at(tFat)) }}>
        <div style={{ background: CREAM, padding: "14px 34px", borderRadius: 6, transform: "rotate(-2deg)", boxShadow: "0 18px 30px rgba(0,0,0,0.45)" }}><Write txt={fat} f={f} at={at(tFat) + 4} size={66} color={INK} /></div>
      </div>
    </AbsoluteFill>
  );
};

// 6 · guía de corte: foto real + diagrama de tiza que se dibuja corte por corte
export const CutGuide: React.FC<Base & { k: string; steps: { txt: string; t: number }[] }> = ({ a, a0, d, k, steps }) => {
  const { f, at } = useT0(a, a0);
  const L = (i: number) => (steps[i] ? ez((f - at(steps[i].t)) / 14) : 0);
  const cx = 1440, cy = 470, r = 300;
  return (
    <AbsoluteFill>
      <Tex k="tx_chalk" f={f} d={d} />
      <Photo k={k} w={720} h={430} x={90} y={150} rot={-2} f={f} at={2} from="left" />
      <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
        <g style={{ filter: "drop-shadow(0 0 2px rgba(255,255,255,0.4))" }} fill="none" stroke={CHALK} strokeLinecap="round">
          <circle cx={cx} cy={cy} r={r} strokeWidth={9} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ez(f / 18)} />
          <path d={`M ${cx} ${cy - r - 30} L ${cx} ${cy + r + 30}`} stroke="#F2C14E" strokeWidth={10} strokeDasharray="28 18" opacity={L(0) > 0 ? 1 : 0} style={{ clipPath: `inset(0 0 ${100 - L(0) * 100}% 0)` }} />
          <path d={`M ${cx - r - 30} ${cy} L ${cx + r + 30} ${cy}`} stroke="#F2C14E" strokeWidth={10} strokeDasharray="28 18" opacity={L(1) > 0 ? 1 : 0} style={{ clipPath: `inset(0 ${100 - L(1) * 100}% 0 0)` }} />
          <path d={`M ${cx - 70} ${cy - 70} L ${cx} ${cy + 10} L ${cx + 70} ${cy - 70}`} stroke={RED} strokeWidth={10} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - L(2)} />
          {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${cx + 40 + i * 42} ${cy + 40} L ${cx + 40 + i * 42} ${cy + 240 - i * 22}`} stroke={CHALK} strokeWidth={5} opacity={0.85} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cl(L(3) * 3 - i * 0.3)} />)}
        </g>
      </svg>
      <div style={{ position: "absolute", left: 110, top: 640 }}>
        {steps.map((s, i) => f >= at(s.t) - 2 && (
          <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: 18, ...pop(f, at(s.t)) }}>
            <div style={{ width: 74, height: 74, borderRadius: 37, background: "#F2C14E", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 22, boxShadow: "0 8px 14px #0008" }}><Lbl txt={String(i + 1)} size={50} color={INK} /></div>
            <Write txt={s.txt} f={f} at={at(s.t) + 3} size={62} color={CHALK} />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 7 · balanza de reloj: la aguja barre al peso + etiqueta de precio
export const HeavyScale: React.FC<Base & { k: string; t: number; lb: number; tP: number; price: string; tS: number; serv: string }> = ({ a, a0, d, k, t, lb, tP, price, tS, serv }) => {
  const { f, at } = useT0(a, a0);
  const u = sp(f, at(t), 7, 60);
  const ang = -150 + (lb / 5) * 300 * u;
  return (
    <AbsoluteFill>
      <Tex k="tx_cinder" f={f} d={d} />
      <Photo k={k} w={820} h={480} x={90} y={260} rot={-2} f={f} at={2} from="left" />
      <div style={{ position: "absolute", left: 1080, top: 110 }}>
        <svg width={640} height={640} style={{ overflow: "visible", filter: "drop-shadow(0 30px 34px rgba(0,0,0,0.45))" }}>
          <circle cx={320} cy={320} r={300} fill="#C9CED3" /><circle cx={320} cy={320} r={268} fill="#FBFAF4" stroke="#7d848a" strokeWidth={4} />
          {Array.from({ length: 21 }, (_, i) => { const g = (-150 + i * 15) * Math.PI / 180, big = i % 4 === 0; return <line key={i} x1={320 + Math.sin(g) * (big ? 200 : 222)} y1={320 - Math.cos(g) * (big ? 200 : 222)} x2={320 + Math.sin(g) * 250} y2={320 - Math.cos(g) * 250} stroke={INK} strokeWidth={big ? 7 : 3} />; })}
          {[0, 1, 2, 3, 4, 5].map((n) => { const g = (-150 + n * 60) * Math.PI / 180; return <text key={n} x={320 + Math.sin(g) * 160} y={338 - Math.cos(g) * 160} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={50} fill={INK}>{n}</text>; })}
          <text x={320} y={408} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={32} fill="#777" letterSpacing={6}>POUNDS</text>
          <g transform={`rotate(${ang} 320 320)`}><path d="M 312 320 L 320 82 L 328 320 Z" fill={RED} /></g>
          <circle cx={320} cy={320} r={22} fill={INK} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 1120, top: 790, display: "flex", gap: 30 }}>
        <div style={{ ...pop(f, at(tP)), background: "#fff", border: `6px solid ${RED}`, borderRadius: 10, padding: "6px 30px", transform: "rotate(-3deg)", boxShadow: "0 16px 26px #0006" }}><Lbl txt={price} size={92} color={RED} /></div>
        <div style={{ ...pop(f, at(tS)), background: GREEN, borderRadius: 10, padding: "16px 30px", transform: "rotate(2deg)", boxShadow: "0 16px 26px #0006", alignSelf: "center" }}><Lbl txt={serv} size={58} color="#fff" /></div>
      </div>
    </AbsoluteFill>
  );
};

// 8 · tarjeta de receta del fichero de mamá (líneas que se escriben solas) + foto con clip
export const RecipeCard: React.FC<Base & { k: string; title: string; lines: { txt: string; t: number }[] }> = ({ a, a0, d, k, title, lines }) => {
  const { f, at } = useT0(a, a0);
  const u = sp(f, 2, 15, 110);
  return (
    <AbsoluteFill>
      <Tex k="tx_block" f={f} d={d} dim={0.2} />
      <div style={{ position: "absolute", left: 700, top: 130, width: 1080, height: 800, transform: `rotate(${-1.5 + (1 - u) * 5}deg) translateX(${(1 - u) * 600}px)`, opacity: cl(u * 2),
        background: "#FBF6E8", boxShadow: "0 50px 70px rgba(30,15,0,0.5), 0 4px 10px rgba(0,0,0,0.25)", borderRadius: 6,
        backgroundImage: "repeating-linear-gradient(180deg, rgba(0,0,0,0) 0 79px, rgba(90,140,200,0.55) 79px 82px)", backgroundPosition: "0 150px" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 148, height: 4, background: "rgba(200,60,60,0.7)" }} />
        <div style={{ position: "absolute", left: 60, top: 40 }}><Write txt={title} f={f} at={10} size={96} color="#8E2E22" /></div>
        <div style={{ position: "absolute", left: 80, top: 172 }}>
          {lines.map((l, i) => <div key={i} style={{ height: 82, display: "flex", alignItems: "flex-end" }}><Write txt={l.txt} f={f} at={at(l.t)} size={fit(l.txt, 920, 74, "hand")} color={NAVY} /></div>)}
        </div>
      </div>
      <Photo k={k} w={600} h={380} x={90} y={420} rot={4} f={f} at={6} from="left" z={3} />
      <svg style={{ position: "absolute", left: 560, top: 380, zIndex: 4, overflow: "visible", filter: "drop-shadow(2px 5px 4px #0007)" }} width={60} height={160}>
        <path d="M 20 150 L 20 20 Q 20 4 34 4 Q 48 4 48 20 L 48 130 Q 48 142 38 142 Q 28 142 28 130 L 28 34" fill="none" stroke="#9aa2a9" strokeWidth={7} strokeLinecap="round" />
      </svg>
    </AbsoluteFill>
  );
};

// 9 · línea de tiempo de la tapa: TAPA PUESTA → TAPA AFUERA, con cabezal que avanza con la voz
export const LidTimeline: React.FC<Base & { kOn: string; kOff: string; tOn: number; tOff: number; tEnd: number; on: string; off: string }> = ({ a, a0, d, kOn, kOff, tOn, tOff, tEnd, on, off }) => {
  const { f, at } = useT0(a, a0);
  const x0 = 160, x1 = 1760, xm = x0 + (x1 - x0) * 0.68;
  const p = f < at(tOff) ? x0 + (xm - x0) * ez((f - at(tOn)) / Math.max(1, at(tOff) - at(tOn))) : xm + (x1 - xm) * ez((f - at(tOff)) / Math.max(1, at(tEnd) - at(tOff)));
  return (
    <AbsoluteFill>
      <Tex k="tx_steel" f={f} d={d} />
      <Photo k={kOn} w={760} h={440} x={170} y={120} rot={-2} f={f} at={at(tOn)} from="up" />
      <Photo k={kOff} w={760} h={440} x={1010} y={140} rot={2} f={f} at={at(tOff)} from="up" />
      <div style={{ position: "absolute", left: x0, top: 760, width: xm - x0 - 8, height: 70, background: NAVY, borderRadius: "35px 0 0 35px", boxShadow: "0 14px 24px #0007", display: "flex", alignItems: "center", paddingLeft: 40, ...pop(f, at(tOn)) }}><Lbl txt={on} size={44} color="#fff" /></div>
      <div style={{ position: "absolute", left: xm, top: 760, width: x1 - xm, height: 70, background: AMBER, borderRadius: "0 35px 35px 0", boxShadow: "0 14px 24px #0007", display: "flex", alignItems: "center", paddingLeft: 30, ...pop(f, at(tOff)) }}><Lbl txt={off} size={44} color="#fff" /></div>
      <div style={{ position: "absolute", left: p - 30, top: 735, width: 60, height: 120, borderRadius: 30, background: "#fff", border: `8px solid ${RED}`, boxShadow: "0 10px 18px #0008" }} />
    </AbsoluteFill>
  );
};

// 10 · etiqueta de precio que se tacha y se re-etiqueta
export const SaltLast: React.FC<Base & { k: string; no: string; yes: string; tNo: number; tYes: number }> = ({ a, a0, d, k, no, yes, tNo, tYes }) => {
  const { f, at } = useT0(a, a0);
  const s = sp(f, at(tYes), 10, 160);
  return (
    <AbsoluteFill>
      <Tex k="tx_kraft" f={f} d={d} />
      <Photo k={k} w={820} h={480} x={90} y={260} rot={-3} f={f} at={2} from="left" />
      <div style={{ position: "absolute", left: 1040, top: 300, ...pop(f, 6) }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "30px 46px", boxShadow: "0 22px 34px #0006", transform: "rotate(-4deg)", border: "4px dashed #c9c2b2" }}><Lbl txt={no} size={86} color={INK} /></div>
      </div>
      <Mark kind="strike" x={1050} y={300} w={700} h={170} f={f} at={at(tNo)} color={RED} sw={18} />
      {f >= at(tYes) - 1 && <div style={{ position: "absolute", left: 1090, top: 520, opacity: cl(s * 3), transform: `scale(${1.6 - 0.6 * s}) rotate(${3 - 2 * s}deg)` }}>
        <div style={{ background: "#F2C14E", borderRadius: 16, padding: "30px 50px", boxShadow: `0 ${30 * s}px ${40 * s}px #0007` }}><Lbl txt={yes} size={96} color={NAVY} /></div>
      </div>}
    </AbsoluteFill>
  );
};

// 11 · pizarra de tiza: el toque final, línea por línea
export const ChalkFinish: React.FC<Base & { k: string; head: string; lines: { txt: string; t: number }[] }> = ({ a, a0, d, k, head, lines }) => {
  const { f, at } = useT0(a, a0);
  const ch = "0 0 3px rgba(255,255,255,0.35), 1px 1px 0 rgba(255,255,255,0.15)";
  return (
    <AbsoluteFill>
      <Tex k="tx_chalk" f={f} d={d} />
      <div style={{ position: "absolute", left: 120, top: 90 }}><Write txt={head} f={f} at={4} size={110} color="#F2C14E" shadow={ch} /></div>
      <Mark kind="under" x={120} y={215} w={760} h={30} f={f} at={18} color={CHALK} sw={7} op={0.8} />
      <div style={{ position: "absolute", left: 140, top: 300 }}>
        {lines.map((l, i) => <div key={i} style={{ height: 150, display: "flex", alignItems: "center" }}>
          <div style={{ fontFamily: HAND, fontSize: 90, color: CHALK, marginRight: 26, opacity: f >= at(l.t) ? 1 : 0, textShadow: ch }}>•</div>
          <Write txt={l.txt} f={f} at={at(l.t)} size={fit(l.txt, 900, 100, "hand")} color={CHALK} shadow={ch} />
        </div>)}
      </div>
      <Photo k={k} w={560} h={360} x={1230} y={330} rot={3} f={f} at={8} from="right" />
      <div style={{ position: "absolute", left: 1290, top: 312, width: 160, height: 46, background: "rgba(232,205,140,0.8)", transform: "rotate(-8deg)", zIndex: 5, boxShadow: "0 2px 4px #0004" }} />
      <div style={{ position: "absolute", left: 1640, top: 330, width: 160, height: 46, background: "rgba(232,205,140,0.8)", transform: "rotate(10deg)", zIndex: 5, boxShadow: "0 2px 4px #0004" }} />
    </AbsoluteFill>
  );
};

// 12 · un hueso, tres comidas: fotos unidas por flechas a mano sobre papel de carnicería
export const BoneLife: React.FC<Base & { head: string; items: { k: string; txt: string; t: number }[] }> = ({ a, a0, d, head, items }) => {
  const { f, at } = useT0(a, a0);
  const P = [[90, 300], [700, 200], [1310, 330]];
  return (
    <AbsoluteFill>
      <Tex k="tx_paper" f={f} d={d} />
      <div style={{ position: "absolute", left: 100, top: 70, ...pop(f, 3) }}><Lbl txt={head} size={78} color={NAVY} ls={3} /></div>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          <Photo k={it.k} w={500} h={320} x={P[i][0]} y={P[i][1]} rot={[-3, 2, -1.5][i]} f={f} at={at(it.t)} from="down" />
          <div style={{ position: "absolute", left: P[i][0] + 20, top: P[i][1] + 380, width: 520 }}><Write txt={it.txt} f={f} at={at(it.t) + 8} size={Math.max(58, fit(it.txt, 520, 70, "hand"))} color={INK} /></div>
          {i > 0 && <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width={1920} height={1080}>
            <path d={`M ${P[i - 1][0] + 520} ${P[i - 1][1] + 120} Q ${(P[i - 1][0] + P[i][0]) / 2 + 300} ${Math.min(P[i - 1][1], P[i][1]) - 60} ${P[i][0] + 20} ${P[i][1] + 60}`} fill="none" stroke={RED} strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ez((f - at(it.t) + 6) / 14)} />
          </svg>}
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};

// 13 · pizarra de menú de la semana con marco de madera
export const WeekBoard: React.FC<Base & { head: string; rows: { day: string; txt: string; k: string; t: number }[]; tot: string; tTot: number }> = ({ a, a0, d, head, rows, tot, tTot }) => {
  const { f, at } = useT0(a, a0);
  const ch = "0 0 3px rgba(255,255,255,0.35)";
  return (
    <AbsoluteFill>
      <Tex k="tx_cinder" f={f} d={d} dim={0.1} />
      <div style={{ position: "absolute", left: 140, top: 60, width: 1640, height: 960, borderRadius: 8, padding: 26, background: "linear-gradient(135deg,#7a4e2a,#4b2d16)", boxShadow: "0 40px 70px rgba(0,0,0,0.55)", ...{ transform: `scale(${0.96 + 0.04 * sp(f, 0, 16, 120)})` } }}>
        <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", borderRadius: 4 }}>
          <Img src={img("tx_chalk")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", left: 60, top: 30 }}><Write txt={head} f={f} at={4} size={100} color="#F2C14E" shadow={ch} /></div>
          {rows.map((r, i) => (
            <div key={i} style={{ position: "absolute", left: 60, top: 190 + i * 160, width: 1480, height: 140, display: "flex", alignItems: "center", opacity: f >= at(r.t) - 2 ? 1 : 0 }}>
              <div style={{ width: 230 }}><Write txt={r.day} f={f} at={at(r.t)} size={76} color="#9FD3F0" shadow={ch} font={LABEL} dur={8} /></div>
              <div style={{ flex: 1 }}><Write txt={r.txt} f={f} at={at(r.t) + 5} size={fit(r.txt, 860, 80, "hand")} color={CHALK} shadow={ch} /></div>
              <div style={{ width: 220, height: 124, border: "6px solid #fff", boxShadow: "0 8px 14px #0008", transform: `rotate(${i % 2 ? 2 : -2}deg) scale(${sp(f, at(r.t) + 6, 13, 150)})`, overflow: "hidden" }}><Img src={img(r.k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", right: 120, bottom: 70, ...pop(f, at(tTot)) }}>
        <div style={{ background: RED, borderRadius: 10, padding: "18px 40px", transform: "rotate(-3deg)", boxShadow: "0 20px 30px #0008" }}><Lbl txt={tot} size={72} color="#fff" /></div>
      </div>
    </AbsoluteFill>
  );
};

// 14 · la cuenta en un recibo largo sobre papel madera + plato de la cafetería tachado
export const Receipt: React.FC<Base & { lines: { txt: string; amt: string; t: number }[]; tot: { txt: string; amt: string; t: number }; per: { txt: string; t: number }; cmp?: { k: string; txt: string; amt: string; t: number } }> = ({ a, a0, d, lines, tot, per, cmp }) => {
  const { f, at } = useT0(a, a0);
  const u = sp(f, 2, 15, 110);
  const all = [...lines, tot];
  return (
    <AbsoluteFill>
      <Tex k="tx_kraft" f={f} d={d} />
      <div style={{ position: "absolute", left: 130, top: 80, width: 700, padding: "40px 46px 60px", background: "#FFFEFA", transform: `rotate(${-2}deg) translateY(${(1 - u) * 900}px)`,
        boxShadow: "0 40px 60px rgba(40,20,0,0.45)", backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.03), rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.04))" }}>
        <Lbl txt="SUNDAY CABBAGE" size={50} color="#555" ls={6} />
        <div style={{ borderTop: "3px dashed #bbb", margin: "16px 0" }} />
        {all.map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", height: r === tot ? 120 : 86, alignItems: "center", opacity: cl((f - at(r.t) + 2) / 6), borderTop: r === tot ? "4px solid #333" : undefined, marginTop: r === tot ? 10 : 0 }}>
            <Lbl txt={r.txt} size={r === tot ? 58 : 44} color={r === tot ? INK : "#444"} />
            <Lbl txt={r.amt} size={r === tot ? 78 : 48} color={r === tot ? RED : "#444"} />
          </div>
        ))}
      </div>
      <Mark kind="circle" x={530} y={150 + lines.length * 86 + 40} w={300} h={130} f={f} at={at(tot.t) + 6} color={RED} sw={8} />
      <div style={{ position: "absolute", left: 930, top: cmp ? 140 : 400, ...pop(f, at(per.t)) }}>
        <div style={{ border: `10px solid ${NAVY}`, borderRadius: 18, padding: "20px 40px", transform: "rotate(-6deg)", background: "rgba(247,241,227,0.92)", boxShadow: "0 20px 30px #0006" }}><Lbl txt={per.txt} size={fit(per.txt, 820, 110, "label", 1, 2)} color={NAVY} style={{ whiteSpace: "nowrap" }} /></div>
      </div>
      {cmp && <Photo k={cmp.k} w={500} h={300} x={1180} y={520} rot={3} f={f} at={at(cmp.t)} from="right" />}
      {cmp && f >= at(cmp.t) && <div style={{ position: "absolute", left: 1220, top: 880, ...pop(f, at(cmp.t) + 8) }}><Lbl txt={`${cmp.txt} ${cmp.amt}`} size={64} color={INK} /></div>}
      {cmp && <Mark kind="strike" x={1200} y={860} w={560} h={100} f={f} at={at(cmp.t) + 26} color={RED} sw={14} />}
    </AbsoluteFill>
  );
};

// overlay · etiqueta de truco (forma de etiqueta de carnicería con ojal), entra desde la izquierda
export const TrickTag: React.FC<Base & { n: number; txt: string }> = ({ d, n, txt }) => {
  const f = useCurrentFrame();
  const u = sp(f, 0, 14, 130), o = 1 - ez((f - (d - 10)) / 10);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 60, top: 60, display: "flex", alignItems: "stretch", transform: `translateX(${(1 - u) * -900}px)`, opacity: o, filter: "drop-shadow(0 16px 22px rgba(0,0,0,0.5))" }}>
        <div style={{ background: NAVY, color: "#fff", padding: "10px 30px 10px 40px", clipPath: "polygon(8% 0,100% 0,100% 100%,8% 100%,0 50%)", display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 22, height: 22, borderRadius: 11, background: CREAM, opacity: 0.9 }} />
          <Lbl txt={`#${n}`} size={86} color="#F2C14E" />
        </div>
        <div style={{ background: CREAM, padding: "0 36px", display: "flex", alignItems: "center" }}><Lbl txt={txt} size={fit(txt.toUpperCase(), 900, 54, "label", 1, 2)} color={NAVY} /></div>
      </div>
    </AbsoluteFill>
  );
};
