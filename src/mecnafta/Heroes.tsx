// mecnafta · escenas héroe (ocho). Cada una: a = segundo de entrada (voz), d = cuadros. Los tiempos de las props son
// segundos absolutos de la voz (words.json). Capas: cama (foto desenfocada) → fotos reales con borde → marcas rojas →
// notas en letra a mano y chips → grade + grano. Nada dibujado con CSS que sea un objeto.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SERIF, HAND, cl, C, Grade, Grain, Mark, Print, Chip, Bed, sp } from "./Base";

type P<T> = React.FC<T & { a: number; d: number }>;
const shadowTxt = "0 6px 26px rgba(0,0,0,0.65)";
const Note: React.FC<{ x: number; y: number; o: number; txt: string; size?: number; rot?: number }> = ({ x, y, o, txt, size = 84, rot = -2 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: cl(o), transform: `rotate(${rot}deg)`, fontFamily: HAND, fontSize: size, color: C.porc, textShadow: shadowTxt, whiteSpace: "nowrap", zIndex: 8 }}>{txt}</div>
);

// 1) Notebook (story): libreta azul a página completa, la cámara baja por las columnas; nota "450 km ÷ 40 L = 11,2"
export const Notebook: P<{ bed: string; divide: number; chip: number; chipTxt: string }> = ({ a, d, bed, divide, chip, chipTxt }) => {
  const f = useCurrentFrame(); const at = (t: number) => Math.round((t - a) * 30);
  const sc = 1.04 + 0.1 * f / Math.max(1, d);
  const u = sp(f, at(divide), 14, 150);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <Bed k={bed} f={f} T={d} dim={0.5} />
      <AbsoluteFill style={{ transform: `scale(${sc}) translateY(${-f * 0.9}px)`, transformOrigin: "50% 30%" }}>
        <div style={{ position: "absolute", left: 560, top: 60 }}>
          <Print k={bed} w={800} h={960} f={f} mat={18} />
        </div>
      </AbsoluteFill>
      <Note x={900} y={700} o={u} txt="450 km ÷ 40 L = 11,2" size={92} rot={-3} />
      <div style={{ position: "absolute", left: 120, top: 110, opacity: cl(sp(f, at(chip), 13, 150) * 1.5) }}><Chip txt={chipTxt} size={50} /></div>
      <Grade warm={1.05} vig={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};

// 2) EightThieves (promesa): cama = el sedán desenfocado; ocho impresiones aterrizan una por palabra; la 8.ª queda tapada con "?"
export const EightThieves: P<{ bed: string; cards: { k: string; t: number }[]; hidden: number }> = ({ a, d, bed, cards, hidden }) => {
  const f = useCurrentFrame(); const at = (t: number) => Math.round((t - a) * 30);
  const W = 300, H = 210, G = 28, x0 = 960 - (4 * W + 3 * G) / 2;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <Bed k={bed} f={f} T={d} dim={0.6} />
      {cards.map((c, i) => {
        const u = sp(f, at(c.t), 13, 150);
        const col = i % 4, row = Math.floor(i / 4);
        const x = x0 + col * (W + G), y = 300 + row * (H + G + 40);
        const rot = [-2.5, 1.8, -1.2, 2.4][i % 4];
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, opacity: cl(u * 2), transform: `translateY(${(1 - u) * -120}px) rotate(${rot}deg)` }}>
            <Print k={c.k} w={W} h={H} f={f} mat={10}>
              {i === 7 ? <div style={{ position: "absolute", inset: 0, background: "rgba(20,14,8,0.82)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontSize: 150, color: C.porc }}>?</div> : null}
              <Mark kind="circle" x={W * 0.1} y={H * 0.15} w={W * 0.8} h={H * 0.7} f={f} at={at(c.t) + 8} dur={10} sw={5} />
            </Print>
          </div>
        );
      })}
      <Note x={120} y={110} o={sp(f, at(hidden), 13, 150)} txt="El octavo, al final" size={70} rot={-2} />
      <Grade warm={1.05} vig={0.42} />
      <Grain />
    </AbsoluteFill>
  );
};

// 3) DoorLabel (ladrón 1): etiqueta de la puerta en círculo; "no la del costado" tacha la otra foto; manómetro con chip EN FRÍO
export const DoorLabel: P<{ label: string; side: string; gauge: string; strike: number; chip: number }> = ({ a, d, label, side, gauge, strike, chip }) => {
  const f = useCurrentFrame(); const at = (t: number) => Math.round((t - a) * 30);
  const sx = sp(f, at(strike), 13, 140);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <Bed k={label} f={f} T={d} dim={0.55} />
      <div style={{ position: "absolute", left: 260, top: 150 }}><Print k={label} w={820} h={600} f={f}><Mark kind="circle" x={300} y={240} w={260} h={170} f={f} at={at(a + 1)} dur={12} sw={8} /></Print></div>
      <div style={{ position: "absolute", left: 1180, top: 330, opacity: cl(sx * 2) }}>
        <Print k={side} w={480} h={340} f={f} mat={12}><Mark kind="strike" x={20} y={120} w={440} h={100} f={f} at={at(strike)} dur={8} sw={10} /></Print>
      </div>
      <div style={{ position: "absolute", left: 1180, top: 700, opacity: cl(sp(f, at(chip), 13, 150) * 1.5) }}>
        <Print k={gauge} w={380} h={240} f={f} mat={10} />
        <div style={{ marginTop: 14 }}><Chip txt="EN FRÍO" size={48} /></div>
      </div>
      <Grade warm={1.05} vig={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};

// 4) FilterLight (ladrón 2): filtro sucio contra la luz (oscuro) vs nuevo (pasa la luz); marca roja y verde
export const FilterLight: P<{ dirty: string; clean: string; tick: number; strike: number }> = ({ a, d, dirty, clean, tick, strike }) => {
  const f = useCurrentFrame(); const at = (t: number) => Math.round((t - a) * 30);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <Bed k={dirty} f={f} T={d} dim={0.55} />
      <div style={{ position: "absolute", left: 230, top: 170 }}><Print k={dirty} w={700} h={520} f={f}><Mark kind="strike" x={60} y={380} w={560} h={100} f={f} at={at(strike)} dur={8} sw={12} /></Print></div>
      <div style={{ position: "absolute", left: 1040, top: 170 }}><Print k={clean} w={700} h={520} f={f}>
        <svg style={{ position: "absolute", right: 30, top: 30, opacity: cl(sp(f, at(tick), 13, 150)) }} width={120} height={120}><path d="M 14 62 L 48 96 L 108 22" fill="none" stroke="#3E9B4F" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" /></svg>
      </Print></div>
      <div style={{ position: "absolute", left: 120, top: 760, opacity: cl(sp(f, at(strike), 13, 150) * 1.5) }}><Chip txt="A CONTRALUZ" size={52} /></div>
      <Grade warm={1.05} vig={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};

// 5) HandHeat (ladrón 4): mano cerca de la rueda sin tocarla; el resplandor cálido sólo en una rueda; chip AL TALLER
export const HandHeat: P<{ k: string; warmAt: number; chip: number; warmX: number; warmY: number }> = ({ a, d, k, warmAt, chip, warmX, warmY }) => {
  const f = useCurrentFrame(); const at = (t: number) => Math.round((t - a) * 30);
  const g = sp(f, at(warmAt), 14, 120);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <Bed k={k} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 300, top: 120 }}><Print k={k} w={1320} h={820} f={f} mat={18}>
        <div style={{ position: "absolute", left: warmX, top: warmY, width: 380, height: 380, borderRadius: 999, transform: "translate(-50%,-50%)", opacity: g * 0.85,
          background: "radial-gradient(circle, rgba(255,120,40,0.75) 0%, rgba(255,120,40,0.35) 45%, rgba(255,120,40,0) 70%)", mixBlendMode: "screen" }} />
      </Print></div>
      <div style={{ position: "absolute", left: 120, top: 760, opacity: cl(sp(f, at(chip), 13, 150) * 1.5) }}><Chip txt="AL TALLER" size={56} bg={C.red} color="#fff" /></div>
      <Grade warm={1.05} vig={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};

// 6) TrunkWeight (ladrón 5): baúl abierto, círculos por objeto, una palabra por vez; chip LO QUE NO USAS, AFUERA
export const TrunkWeight: P<{ k: string; marks: { x: number; y: number; w: number; h: number; t: number }[]; chip: number }> = ({ a, d, k, marks, chip }) => {
  const f = useCurrentFrame(); const at = (t: number) => Math.round((t - a) * 30);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <Bed k={k} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 300, top: 110 }}><Print k={k} w={1320} h={860} f={f} mat={18}>
        {marks.map((m, i) => <Mark key={i} kind="circle" x={m.x} y={m.y} w={m.w} h={m.h} f={f} at={at(m.t)} dur={9} sw={7} />)}
      </Print></div>
      <div style={{ position: "absolute", left: 120, top: 780, opacity: cl(sp(f, at(chip), 13, 150) * 1.5) }}><Chip txt="LO QUE NO USAS, AFUERA" size={50} /></div>
      <Grade warm={1.05} vig={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};

// 7) PumpClick (ladrón 8): boquilla en el tanque; anillo al "clic"; tachado sobre el goteo; nota AL CLIC, SE TERMINA
export const PumpClick: P<{ k: string; drip: string; click: number; strike: number; note: number }> = ({ a, d, k, drip, click, strike, note }) => {
  const f = useCurrentFrame(); const at = (t: number) => Math.round((t - a) * 30);
  const pulse = ((f - at(click)) % 30 + 30) % 30 / 30;
  const ringOn = f >= at(click);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <Bed k={k} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 300, top: 110 }}><Print k={k} w={1320} h={860} f={f} mat={18}>
        {ringOn ? <div style={{ position: "absolute", left: 560, top: 300, width: 220 + 60 * pulse, height: 220 + 60 * pulse, borderRadius: 999, transform: "translate(-50%,-50%)", border: `8px solid rgba(255,80,60,${0.9 - pulse * 0.9})` }} /> : null}
      </Print></div>
      <div style={{ position: "absolute", left: 1180, top: 620, opacity: cl(sp(f, at(strike), 13, 150)) }}>
        <Print k={drip} w={420} h={300} f={f} mat={10}><Mark kind="strike" x={20} y={110} w={380} h={90} f={f} at={at(strike)} dur={8} sw={10} /></Print>
      </div>
      <Note x={1180} y={960} o={sp(f, at(note), 13, 150) * 1.4} txt="AL CLIC, SE TERMINA" size={70} rot={-2} />
      <Grade warm={1.05} vig={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};

// 8) PageSixteen (CTA): página 16 del manual sobre la cama, checks por cada ladrón, chip TRUCO 8 · PÁGINA 16
export const PageSixteen: P<{ k: string; checks: { t: number; x: number; y: number }[]; chip: number }> = ({ a, d, k, checks, chip }) => {
  const f = useCurrentFrame(); const at = (t: number) => Math.round((t - a) * 30);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#15110c" }}>
      <Bed k={k} f={f} T={d} dim={0.55} />
      <div style={{ position: "absolute", left: 560, top: 60 }}><Print k={k} w={800} h={1000} f={f} mat={16}>
        {checks.map((c, i) => <svg key={i} style={{ position: "absolute", left: c.x, top: c.y, opacity: cl(sp(f, at(c.t), 13, 150)) }} width={80} height={80}><path d="M 10 42 L 32 66 L 72 14" fill="none" stroke="#3E9B4F" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" /></svg>)}
      </Print></div>
      <div style={{ position: "absolute", left: 120, top: 120, opacity: cl(sp(f, at(chip), 13, 150) * 1.5) }}><Chip txt="TRUCO 8 · PÁGINA 16" size={54} bg={C.red} color="#fff" /></div>
      <Grade warm={1.05} vig={0.4} />
      <Grain />
    </AbsoluteFill>
  );
};
