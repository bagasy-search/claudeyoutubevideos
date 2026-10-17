// Kit del video clsangre: set-pieces DENTRO del mundo del hotel (cama real, sombra, luz de techo), ≤12 palabras.
//   ClProteinCook  el culpable: el huevo y la sábana. FRÍA → la clara líquida / la sangre sale con el agua ✓ · CALIENTE → la clara
//                  cuajada / la sangre cocida en la tela ✗. hi 0 = fría · 1 = caliente. Sin hi: las dos.
//   ClInsideOut    el 1er secreto: la tela en corte. Del derecho el chorro empuja la mancha más adentro ✗ · del revés la saca por
//                  donde entró ✓. hi 0/1.
//   ClBlotNoRub    el 2º secreto: el trapo blanco. Frotar → la mancha se agranda ✗ · apretar → el trapo la chupa ✓. hi 0/1.
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, rnd } from "./ClTheme";
import { Bed, RoomLight, Stamp, lin, pop, useOut } from "./ClParts";

const tick = (ok: boolean, s = 70): React.ReactNode => (
  <svg width={s} height={s} viewBox="0 0 70 70">{ok ? <path d="M10 38 L28 56 L60 16" stroke="#2F8F48" strokeWidth={11} fill="none" strokeLinecap="round" /> : <path d="M14 14 L56 56 M56 14 L14 56" stroke={CL.red} strokeWidth={11} strokeLinecap="round" />}</svg>
);
const BLOOD = "#9E1F24", OLD = "#7A4A2E";

const Card: React.FC<{ i: number; hi: number; good: boolean; title: string; big: string; small: string; children: React.ReactNode }> = ({ i, hi, good, title, big, small, children }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig(); const out = useOut(8);
  const on = hi < 0 || hi === i, k = pop(f, fps, 4 + i * 10, 15);
  return (
    <div style={{ position: "absolute", left: 190 + i * 800, top: 120, width: 740, height: 820, borderRadius: 34, background: "#FFFDF6", boxShadow: hi === i ? `0 0 0 10px ${good ? "#2F8F48" : CL.red}, 24px 30px 60px ${CL.shadow}` : `14px 18px 34px ${CL.shadow}`, opacity: out * k * (on ? 1 : 0.42), translate: `0 ${(1 - k) * 80}px`, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 36 }}>
      <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 4, color: CL.navy }}>{title}</div>
      <div style={{ marginTop: 20 }}>{children}</div>
      <div style={{ marginTop: 18, display: "flex", alignItems: "center", gap: 16 }}>
        {tick(good, 60)}
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: CL.ink }}>{big}</div>
      </div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: CL.ink, marginTop: 6 }}>{small}</div>
    </div>
  );
};

// ── el culpable: el calor cocina la proteína
export const ClProteinCook: React.FC<{ hi?: number; bed?: string }> = ({ hi = -1, bed }) => {
  const f = useCurrentFrame(); const t = lin(f, 14, 70);
  const pan = (hot: boolean) => (
    <svg width={560} height={420} viewBox="0 0 560 420">
      {/* la sartén con el huevo */}
      <ellipse cx={180} cy={150} rx={150} ry={92} fill="#3B3F44" />
      <rect x={320} y={138} width={160} height={24} rx={10} fill="#2A2D31" />
      <ellipse cx={180} cy={146} rx={110 * (hot ? 1 : 0.9)} ry={66 * (hot ? 1 : 0.9)} fill={hot ? `rgba(255,255,255,${0.3 + 0.7 * t})` : "rgba(235,240,230,0.35)"} stroke={hot ? "none" : "rgba(255,255,255,0.6)"} strokeWidth={3} />
      <circle cx={170} cy={140} r={30} fill="#F2B21C" />
      {hot ? Array.from({ length: 6 }, (_, j) => <path key={j} d={`M${120 + j * 22} 60 q-8 -16 0 -32 q8 -16 0 -32`} stroke="#C9CED3" strokeWidth={4} fill="none" opacity={0.7} />) : null}
      {/* la tela con la mancha */}
      <rect x={60} y={270} width={440} height={130} rx={10} fill="#FBFAF6" stroke="#DAD5CA" strokeWidth={4} />
      {Array.from({ length: 12 }, (_, j) => <line key={j} x1={60} y1={278 + j * 10} x2={500} y2={278 + j * 10} stroke="#EFEBE2" strokeWidth={2} />)}
      <ellipse cx={280} cy={335} rx={hot ? 90 : 90 * (1 - 0.85 * t)} ry={hot ? 40 : 40 * (1 - 0.85 * t)} fill={hot ? OLD : BLOOD} opacity={hot ? 0.75 : 0.85 * (1 - 0.6 * t)} />
      {!hot ? Array.from({ length: 10 }, (_, j) => <rect key={j} x={140 + j * 28} y={250 + ((f * 4 + j * 37) % 160)} width={6} height={22} rx={3} fill="#8CC3E3" opacity={0.8} />) : null}
    </svg>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={231} dim={0.22} />
      <Card i={0} hi={hi} good title="AGUA FRÍA" big="Se va con el agua" small="la proteína sigue líquida">{pan(false)}</Card>
      <Card i={1} hi={hi} good={false} title="AGUA CALIENTE" big="Se cocina" small="como la clara del huevo">{pan(true)}</Card>
      {hi === 1 ? <Stamp text="Para siempre" at={50} color={CL.red} x="74%" y="91%" rot={-4} size={60} /> : null}
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};

// ── 1er secreto: del revés
export const ClInsideOut: React.FC<{ hi?: number; bed?: string }> = ({ hi = -1, bed }) => {
  const f = useCurrentFrame(); const t = lin(f, 14, 70);
  const cut = (back: boolean) => (
    <svg width={560} height={420} viewBox="0 0 560 420">
      <text x={20} y={34} fontFamily={LABEL} fontSize={24} fill="#8A8172">{back ? "REVÉS" : "DERECHO"}</text>
      <text x={20} y={404} fontFamily={LABEL} fontSize={24} fill="#8A8172">{back ? "DERECHO" : "REVÉS"}</text>
      {/* la tela en corte: hilos */}
      {Array.from({ length: 9 }, (_, j) => <rect key={j} x={20} y={150 + j * 14} width={520} height={9} rx={4} fill={j % 2 ? "#EFEBE2" : "#F7F4EC"} stroke="#DAD5CA" strokeWidth={1} />)}
      {/* la mancha: del derecho baja (ensucia más hilos), del revés sube y sale */}
      {Array.from({ length: 26 }, (_, j) => {
        const x = 200 + rnd(j) * 160, y0 = back ? 210 + rnd(j + 3) * 60 : 160 + rnd(j + 3) * 30;
        const y = back ? y0 + t * (260 - y0 + 60 * rnd(j + 9)) : y0 + t * (110 + 30 * rnd(j + 9));
        return <circle key={j} cx={x} cy={Math.min(y, back ? 420 : 300)} r={7} fill={BLOOD} opacity={back && y > 300 ? 0.5 : 0.9} />;
      })}
      {/* el chorro de agua fría */}
      {Array.from({ length: 8 }, (_, j) => <rect key={`w${j}`} x={230 + j * 14} y={((f * 9 + j * 23) % 110) + 30} width={6} height={22} rx={3} fill="#5BA6D6" opacity={0.85} />)}
      <path d="M280 20 L280 120" stroke="#5BA6D6" strokeWidth={30} strokeLinecap="round" opacity={0.35} />
    </svg>
  );
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={233} dim={0.22} />
      <Card i={0} hi={hi} good={false} title="DEL DERECHO" big="La empuja adentro" small="más hilos manchados">{cut(false)}</Card>
      <Card i={1} hi={hi} good title="DEL REVÉS" big="La saca afuera" small="por donde entró">{cut(true)}</Card>
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};

// ── 2º secreto: apretar, no frotar
export const ClBlotNoRub: React.FC<{ hi?: number; bed?: string }> = ({ hi = -1, bed }) => {
  const f = useCurrentFrame(); const t = lin(f, 14, 70);
  const sheet = (rub: boolean) => {
    const dx = rub ? Math.sin(f * 0.5) * 60 : 0, press = rub ? 0 : Math.max(0, Math.sin(f * 0.25)) * 14;
    return (
      <svg width={560} height={420} viewBox="0 0 560 420">
        <rect x={20} y={40} width={520} height={360} rx={10} fill="#FBFAF6" stroke="#DAD5CA" strokeWidth={4} />
        {/* la mancha: frotando se agranda, apretando se achica */}
        <ellipse cx={280} cy={240} rx={rub ? 70 + 120 * t : 70 * (1 - 0.8 * t)} ry={rub ? 36 + 50 * t : 36 * (1 - 0.8 * t)} fill={BLOOD} opacity={rub ? 0.55 : 0.85} />
        {/* el trapo blanco */}
        <g transform={`translate(${200 + dx} ${110 + press})`}>
          <rect width={160} height={110} rx={14} fill="#FFFFFF" stroke="#CFC9BD" strokeWidth={4} />
          {!rub ? <ellipse cx={80} cy={96} rx={46 * t + 6} ry={10 * t + 2} fill={BLOOD} opacity={0.7} /> : <ellipse cx={80} cy={96} rx={60} ry={9} fill={BLOOD} opacity={0.35} />}
        </g>
      </svg>
    );
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed src={bed} seed={235} dim={0.22} />
      <Card i={0} hi={hi} good={false} title="FROTAR" big="Se agranda" small="la desparrama por la tela">{sheet(true)}</Card>
      <Card i={1} hi={hi} good title="APRETAR" big="El trapo la chupa" small="hasta que salga limpio">{sheet(false)}</Card>
      <RoomLight k={0.7} />
    </AbsoluteFill>
  );
};
