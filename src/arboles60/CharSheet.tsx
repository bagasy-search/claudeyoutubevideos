import React from "react";
import { useCurrentFrame } from "remotion";
import { Bird, Clipboard, Telescope, Tape } from "./chars";
import { C, FONT, Stage, blink } from "./lib";

const Label: React.FC<{ x: number; y: number; children: React.ReactNode }> = ({ x, y, children }) => (
  <text x={x} y={y} fontFamily={FONT} fontWeight={700} fontSize={22} fill="#C9D4FF" textAnchor="middle">{children}</text>
);

export const CharSheet: React.FC = () => {
  const t = useCurrentFrame() / 60;
  const rowT = 330, rowL = 720, rowE = 1020;
  const views = [
    { l: "Frente", p: {} },
    { l: "Perfil", p: { turn: 1 } },
    { l: "Tres cuartos", p: { turn: 0.5 } },
    { l: "Espalda", p: { back: true } },
  ];
  const moods = [
    { l: "Feliz", p: { mood: "happy" as const } },
    { l: "Confundido", p: { mood: "confused" as const, head: -8, lx: 0.6, ly: -0.6 } },
    { l: "Sorprendido", p: { mood: "surprised" as const } },
    { l: "Preocupado", p: { mood: "worried" as const, head: 5 } },
    { l: "Caminando", p: { walk: 1.2, turn: 0.6, lean: 4 } },
    { l: "Señalando", p: { wr: -125, turn: 0.4, mood: "happy" as const, lx: 0.8, ly: -0.5 } },
  ];
  return (
    <Stage bg={C.deep}>
      <rect width={1920} height={1080} fill={C.deep} />
      <text x={60} y={70} fontFamily={FONT} fontWeight={800} fontSize={40} fill="#fff">Tito y Luma — hoja de personajes</text>
      {views.map((v, i) => (
        <g key={i}>
          <Bird who="tito" uid={`tv${i}`} t={t} p={{ x: 140 + i * 230, y: rowT, s: 0.9, blink: blink(t, i), handL: i === 0 ? <Clipboard ticks={3} /> : undefined, ...v.p }} />
          <Label x={140 + i * 230} y={rowT + 50}>{v.l}</Label>
          <Bird who="luma" uid={`lv${i}`} t={t} p={{ x: 1050 + i * 230, y: rowT, s: 0.9, blink: blink(t, i + 9), ...v.p }} />
          <Label x={1050 + i * 230} y={rowT + 50}>{v.l}</Label>
        </g>
      ))}
      {moods.map((m, i) => (
        <g key={i}>
          <Bird who="tito" uid={`tm${i}`} t={t} p={{ x: 140 + i * 300, y: rowL, s: 0.85, ...m.p }} />
          <Bird who="luma" uid={`lm${i}`} t={t} p={{ x: 140 + i * 300, y: rowE, s: 0.85, ...m.p }} />
          <Label x={140 + i * 300} y={rowL + 44}>{m.l}</Label>
        </g>
      ))}
      <Telescope x={1820} y={980} a={-30} s={0.8} />
      <g transform="translate(1760 640)"><Tape len={60} /></g>
    </Stage>
  );
};
