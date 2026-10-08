// Kit de la PUERTA (Claudio el Fumigador ep. 2 "La barrera de la puerta"), dentro del mundo (cama real + sombra + luz):
//   ClDoorGap     corte de la parte de abajo de la puerta: adentro oscuro, afuera la luz prendida; la rayita de luz de 1 cm y la
//                 cucaracha que entra sin agacharse (mode "light") · el burlete se monta, la luz desaparece y la cucaracha da la vuelta ("sealed")
//   ClBarrierLine el umbral visto desde arriba: la raya de tiza gruesa y sin cortes ("line": el corte = una puerta, las hormigas pasan por
//                 el corte y después se cierra) · "herbs": 3 clavos + 2 hojas de laurel cada 30 cm a lo largo del marco, canela en las esquinas
//                 · "dog": el marco de frente, las hierbas en bolsitas ARRIBA, la altura de Bruno marcada (el laurel le cae mal al perro)
//   ClPerimeter30 la casa desde arriba con la franja de 30 cm: leña, macetas y la rama del limonero = puentes, y la fila de hormigas del nido
//                 a la puerta ("bridges") · "clean": todo se aleja de la pared, la rama se corta, la fila se pierde
import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { CL, LABEL, SERIF, HAND, rnd, clamp01, ease, hexA } from "./ClTheme";
import { Bed, Card, RoomLight, lin, pop, useOut } from "./ClParts";
import { Roach } from "./ClFumigador";

const Tag: React.FC<{ x: number; y: number; text: string; color?: string; o?: number; size?: number }> = ({ x, y, text, color = CL.navy, o = 1, size = 40 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - o) * 14}px)`, background: color, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: size, letterSpacing: 2, padding: "6px 20px", borderRadius: 10, textTransform: "uppercase", whiteSpace: "nowrap", boxShadow: `0 12px 26px ${CL.shadow}`, borderBottom: `5px solid ${CL.yellow}` }}>{text}</div>
);
const Ant: React.FC<{ x: number; y: number; r?: number; s?: number; o?: number; walk?: number }> = ({ x, y, r = 0, s = 1, o = 1, walk = 0 }) => {
  const w = Math.sin(walk) * 3;
  return (
    <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} opacity={o}>
      {[-5, 0, 5].map((lx, i) => <path key={i} d={`M${lx} 0 l ${-3 + (i % 2 ? w : -w)} -9 M${lx} 0 l ${-3 + (i % 2 ? -w : w)} 9`} stroke="#1A120A" strokeWidth={1.6} fill="none" />)}
      <circle cx={-9} cy={0} r={5} fill="#1A120A" /><circle cx={0} cy={0} r={3.4} fill="#1A120A" /><circle cx={8} cy={0} r={4} fill="#1A120A" />
    </g>
  );
};
const Clove: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <rect x={-2.5} y={-14} width={5} height={20} rx={2} fill="#5A3217" />
    <circle cx={0} cy={-16} r={5.5} fill="#7A4626" stroke="#3E200C" strokeWidth={1.2} />
  </g>
);
const Bay: React.FC<{ x: number; y: number; r?: number; s?: number }> = ({ x, y, r = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <path d="M-34 0 Q 0 -16 34 0 Q 0 16 -34 0 Z" fill="#7E8F4E" stroke="#4E5C2C" strokeWidth={1.6} />
    <line x1={-32} y1={0} x2={32} y2={0} stroke="#4E5C2C" strokeWidth={1.2} />
  </g>
);
const Cinnamon: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <rect x={-40} y={-8} width={80} height={16} rx={7} fill="#A0602A" stroke="#5E3714" strokeWidth={1.6} />
    <path d="M-36 -2 H 36" stroke="#C98A4C" strokeWidth={2} />
  </g>
);

// ───────────────── ClDoorGap
export const ClDoorGap: React.FC<{ mode?: "light" | "sealed"; bed?: string }> = ({ mode = "light", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const sealed = mode === "sealed";
  const sk = sealed ? ease(clamp01((f - T * 0.2) / (T * 0.25))) : 0; // el burlete baja
  const light = sealed ? 1 - sk : 1;
  const DX = 900, FLOOR = 820, GAP = 70; // la rendija dibujada (1 cm, agrandada)
  // cucaracha: entra (light) o llega, choca y da la vuelta (sealed)
  const rk = sealed ? clamp01((f - T * 0.5) / (T * 0.45)) : clamp01((f - T * 0.25) / (T * 0.6));
  const rx = sealed ? DX - 260 + Math.sin(rk * Math.PI) * 200 : DX - 300 + rk * 760;
  const rr = sealed ? (rk > 0.5 ? 180 : 0) : 0;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={331} dim={0.6} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        {/* afuera (izq) con la luz prendida · adentro (der) oscuro */}
        <rect x={160} y={160} width={DX - 160} height={FLOOR - 160} fill="#F2E6BE" />
        <rect x={DX} y={160} width={1760 - DX} height={FLOOR - 160} fill="#1C1A1E" />
        {/* el piso */}
        <rect x={160} y={FLOOR} width={1600} height={46} fill="#B9A58A" stroke={CL.ink} strokeWidth={5} />
        {/* la puerta (canto) */}
        <rect x={DX - 30} y={160} width={60} height={FLOOR - GAP - 160} fill="#8A5A34" stroke={CL.ink} strokeWidth={5} />
        {/* el burlete (cepillo) que baja del lado de adentro */}
        <g transform={`translate(0 ${(1 - sk) * -60})`} opacity={sealed ? clamp01(sk * 3) : 0}>
          <rect x={DX + 30} y={FLOOR - GAP - 20} width={34} height={40} fill="#3A3D42" stroke={CL.ink} strokeWidth={3} />
          {Array.from({ length: 12 }, (_, i) => <line key={i} x1={DX + 32 + i * 2.6} y1={FLOOR - GAP + 20} x2={DX + 32 + i * 2.6} y2={FLOOR} stroke="#55585C" strokeWidth={2} />)}
        </g>
        {/* la rayita de luz que entra por abajo */}
        <path d={`M${DX - 30} ${FLOOR - GAP} L ${DX + 520} ${FLOOR - 4} L ${DX + 520} ${FLOOR} L ${DX - 30} ${FLOOR} Z`} fill={hexA("#FFE9A0", 0.7 * light)} />
        {/* la medida */}
        <g opacity={lin(f, 10, 18) * light}>
          <line x1={DX - 80} y1={FLOOR - GAP} x2={DX - 80} y2={FLOOR} stroke={CL.red} strokeWidth={4} />
          <line x1={DX - 92} y1={FLOOR - GAP} x2={DX - 68} y2={FLOOR - GAP} stroke={CL.red} strokeWidth={4} />
          <line x1={DX - 92} y1={FLOOR} x2={DX - 68} y2={FLOOR} stroke={CL.red} strokeWidth={4} />
        </g>
        <Roach x={rx} y={FLOOR - 16} r={rr} s={1.5} walk={f * 0.6} />
      </svg>
      <Tag x={DX - 330} y={FLOOR - GAP - 70} text="1 cm" color={CL.red} o={lin(f, 12, 20) * light} size={40} />
      <Tag x={220} y={200} text="Afuera · luz prendida" color={CL.brass} o={lin(f, 6, 14)} size={34} />
      <Tag x={DX + 80} y={200} text="Adentro · a oscuras" color={CL.navy} o={lin(f, 8, 16)} size={34} />
      {!sealed ? (
        <div style={{ position: "absolute", left: DX + 120, top: 360, opacity: lin(f, T * 0.4, T * 0.5) }}>
          <Card style={{ padding: "16px 32px", borderBottom: `6px solid ${CL.red}` }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: CL.ink, lineHeight: 1.05 }}>¿Ves luz abajo?</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: CL.red }}>por ahí entran</div>
          </Card>
        </div>
      ) : (
        <>
          <Tag x={DX + 120} y={FLOOR - 200} text="Burlete" color={CL.nitrile} o={lin(f, T * 0.3, T * 0.4)} size={40} />
          <div style={{ position: "absolute", left: DX + 120, top: 360, opacity: lin(f, T * 0.62, T * 0.72) }}>
            <Card style={{ padding: "16px 32px", borderBottom: `6px solid ${CL.nitrile}` }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 60, color: CL.ink, lineHeight: 1.05 }}>Sin luz abajo</div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 50, color: CL.nitrile }}>está cerrado</div>
            </Card>
          </div>
        </>
      )}
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};

// ───────────────── ClBarrierLine
export const ClBarrierLine: React.FC<{ mode?: "line" | "herbs" | "dog"; bed?: string }> = ({ mode = "line", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  if (mode === "dog") {
    const k = lin(f, 10, 22), d = lin(f, T * 0.35, T * 0.45), w = lin(f, T * 0.6, T * 0.7);
    const FX = 640, FW = 640, TOP = 120, FL = 960, DOGH = 640;
    return (
      <AbsoluteFill style={{ opacity: out }}>
        <Bed src={bed} seed={341} dim={0.55} />
        <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
          {/* el marco de la puerta de frente */}
          <rect x={FX - 50} y={TOP} width={FW + 100} height={FL - TOP} fill="#8A5A34" stroke={CL.ink} strokeWidth={6} />
          <rect x={FX} y={TOP + 50} width={FW} height={FL - TOP - 50} fill="#D9CBB2" stroke={CL.ink} strokeWidth={5} />
          <rect x={FX - 80} y={FL} width={FW + 160} height={30} fill="#B9A58A" stroke={CL.ink} strokeWidth={5} />
          {/* la raya de tiza en el umbral */}
          <rect x={FX} y={FL - 10} width={FW} height={12} fill="#FAFAF6" opacity={k} />
          {/* bolsitas de tela arriba en el marco */}
          {[260, 420].map((y, i) => (
            <g key={i} opacity={k}>
              {[FX - 26, FX + FW + 26].map((x, j) => (
                <g key={j} transform={`translate(${x} ${y})`}>
                  <line x1={0} y1={-34} x2={0} y2={-14} stroke={CL.ink} strokeWidth={3} />
                  <path d="M-22 -14 H 22 L 18 34 Q 0 44 -18 34 Z" fill="#E8DCC2" stroke={CL.ink} strokeWidth={3} />
                  <circle cx={-6} cy={8} r={4} fill="#5A3217" /><circle cx={7} cy={14} r={4} fill="#7E8F4E" />
                </g>
              ))}
            </g>
          ))}
          {/* la altura de Bruno */}
          <line x1={240} y1={DOGH} x2={1700} y2={DOGH} stroke={CL.red} strokeWidth={5} strokeDasharray="22 14" opacity={d} />
          <g opacity={d} transform="translate(1520 960)">
            <ellipse cx={0} cy={-150} rx={140} ry={70} fill="#C8894A" stroke={CL.ink} strokeWidth={4} />
            <rect x={-120} y={-110} width={30} height={110} fill="#C8894A" stroke={CL.ink} strokeWidth={4} /><rect x={80} y={-110} width={30} height={110} fill="#C8894A" stroke={CL.ink} strokeWidth={4} />
            <circle cx={150} cy={-250} r={66} fill="#C8894A" stroke={CL.ink} strokeWidth={4} />
            <path d="M118 -296 q -34 20 -26 74 q 26 -10 40 -50 Z" fill="#9A6532" stroke={CL.ink} strokeWidth={3} />
            <circle cx={176} cy={-262} r={7} fill={CL.ink} /><ellipse cx={212} cy={-236} rx={12} ry={9} fill={CL.ink} />
          </g>
        </svg>
        <Tag x={1300} y={DOGH - 76} text="Hasta aquí llega Bruno" color={CL.red} o={d} size={34} />
        <Tag x={170} y={300} text="Hierbas en el marco · arriba" color={CL.nitrile} o={k} size={34} />
        <div style={{ position: "absolute", left: 160, top: 700, opacity: w }}>
          <Card style={{ padding: "14px 28px", borderBottom: `6px solid ${CL.red}` }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 50, color: CL.ink, lineHeight: 1.05 }}>Nada en el piso</div>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 44, color: CL.red }}>el laurel le cae mal al perro</div>
          </Card>
        </div>
        <RoomLight k={0.3} />
      </AbsoluteFill>
    );
  }
  // vista desde arriba: el umbral horizontal, afuera arriba, adentro abajo
  const X0 = 260, X1 = 1660, UY = 470, UH = 120;
  const herbs = mode === "herbs";
  const draw = herbs ? 1 : ease(clamp01((f - 8) / (T * 0.3)));
  const cutX = 1080, closeK = herbs ? 1 : lin(f, T * 0.66, T * 0.74);
  const cutW = 70 * (1 - closeK);
  const nAnts = 16;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={351} dim={0.55} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        {/* afuera: el escalón · adentro: el azulejo */}
        <rect x={160} y={140} width={1600} height={UY - 140} fill="#A9A49A" stroke={CL.ink} strokeWidth={4} />
        <rect x={160} y={UY + UH} width={1600} height={980 - UY - UH} fill="#ECE8E0" stroke={CL.ink} strokeWidth={4} />
        {Array.from({ length: 7 }, (_, i) => <line key={i} x1={160 + i * 260} y1={UY + UH} x2={160 + i * 260} y2={980} stroke="#CFC8BB" strokeWidth={3} />)}
        {/* el umbral de madera + jambas */}
        <rect x={X0} y={UY} width={X1 - X0} height={UH} fill="#9A6A40" stroke={CL.ink} strokeWidth={5} />
        <rect x={X0 - 70} y={UY - 40} width={70} height={UH + 80} fill="#7A4F2C" stroke={CL.ink} strokeWidth={5} />
        <rect x={X1} y={UY - 40} width={70} height={UH + 80} fill="#7A4F2C" stroke={CL.ink} strokeWidth={5} />
        {/* la raya de tiza: gruesa, de punta a punta (con el corte en "line") */}
        <clipPath id="clipdraw"><rect x={X0} y={0} width={(X1 - X0) * draw} height={1080} /></clipPath>
        <g clipPath="url(#clipdraw)">
          <rect x={X0} y={UY + UH + 10} width={cutX - X0} height={26} rx={8} fill="#FAFAF6" stroke="#DCDCD2" strokeWidth={2} />
          <rect x={cutX + cutW} y={UY + UH + 10} width={X1 - cutX - cutW} height={26} rx={8} fill="#FAFAF6" stroke="#DCDCD2" strokeWidth={2} />
          {Array.from({ length: 60 }, (_, i) => <circle key={i} cx={X0 + rnd(i + 5) * (X1 - X0)} cy={UY + UH + 12 + rnd(i + 6) * 22} r={1.8} fill="#E6E4DA" />)}
        </g>
        {/* hormigas: se frenan en la raya; por el corte pasan (hasta que se cierra) */}
        {!herbs && Array.from({ length: nAnts }, (_, i) => {
          const t = ((f * 0.008 + i / nAnts) % 1);
          const lane = X0 + 80 + (i * 97) % (X1 - X0 - 160);
          const throughCut = Math.abs(lane - cutX - 35) < 90 && closeK < 0.5;
          const x = throughCut ? cutX + 35 + Math.sin(i) * 10 : lane;
          const yStop = UY + UH + 4;
          const y = throughCut ? 200 + t * 760 : Math.min(200 + t * 760, yStop - (t > 0.5 ? (t - 0.5) * 400 : 0));
          const r = throughCut ? 90 : (t > 0.5 ? -90 : 90);
          return <Ant key={i} x={x} y={y} r={r} s={1.6} walk={f * 0.8 + i} o={draw > 0.5 ? 1 : 0} />;
        })}
        {/* hierbas cada 30 cm a lo largo del marco */}
        {herbs && Array.from({ length: 5 }, (_, i) => {
          const x = X0 + 140 + i * 280, o = lin(f, 10 + i * 8, 18 + i * 8);
          return (
            <g key={i} opacity={o}>
              <Clove x={x - 30} y={UY + 52} r={-20} /><Clove x={x} y={UY + 48} r={8} /><Clove x={x + 30} y={UY + 54} r={30} />
              <Bay x={x - 40} y={UY + 88} r={-12} s={0.9} /><Bay x={x + 44} y={UY + 84} r={14} s={0.9} />
            </g>
          );
        })}
        {herbs && <g opacity={lin(f, 54, 64)}><Cinnamon x={X0 + 50} y={UY + 30} r={90} /><Cinnamon x={X1 - 50} y={UY + 30} r={90} /></g>}
        {herbs && Array.from({ length: 4 }, (_, i) => {
          const a = X0 + 140 + i * 280, o = lin(f, 70 + i * 6, 78 + i * 6);
          return (
            <g key={i} opacity={o} stroke={CL.red} strokeWidth={4}>
              <line x1={a} y1={UY - 60} x2={a + 280} y2={UY - 60} /><line x1={a} y1={UY - 74} x2={a} y2={UY - 46} /><line x1={a + 280} y1={UY - 74} x2={a + 280} y2={UY - 46} />
            </g>
          );
        })}
      </svg>
      {!herbs ? (
        <>
          <Tag x={X0} y={UY + UH + 70} text="Tiza · gruesa y sin cortes" color={CL.nitrile} o={lin(f, 14, 22)} size={36} />
          <Tag x={cutX - 120} y={UY - 110} text="Un corte = una puerta" color={CL.red} o={lin(f, T * 0.32, T * 0.4) * (1 - closeK)} size={36} />
          <Tag x={cutX - 120} y={UY - 110} text="Retocada ✓" color={CL.nitrile} o={closeK} size={36} />
        </>
      ) : (
        <>
          {Array.from({ length: 4 }, (_, i) => <div key={i} style={{ position: "absolute", left: X0 + 140 + i * 280 + 86, top: UY - 130, opacity: lin(f, 70 + i * 6, 78 + i * 6), fontFamily: LABEL, fontWeight: 700, fontSize: 36, color: CL.red }}>30 cm</div>)}
          <Tag x={X0} y={UY + UH + 70} text="3 clavos + 2 hojas de laurel" color={CL.nitrile} o={lin(f, 30, 40)} size={36} />
          <Tag x={X0} y={UY + UH + 150} text="Canela en las esquinas" color={CL.brass} o={lin(f, 58, 68)} size={36} />
          <Tag x={X1 - 560} y={UY + UH + 150} text="Renovar: 3 a 4 semanas" color={CL.navy} o={lin(f, T * 0.7, T * 0.78)} size={36} />
        </>
      )}
      <RoomLight k={0.3} />
    </AbsoluteFill>
  );
};

// ───────────────── ClPerimeter30
export const ClPerimeter30: React.FC<{ mode?: "bridges" | "clean"; bed?: string }> = ({ mode = "bridges", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames: T, fps } = useVideoConfig(); const out = useOut(6);
  const p = pop(f, fps, 2, 14);
  const clean = mode === "clean";
  const mv = clean ? ease(clamp01((f - T * 0.2) / (T * 0.35))) : 0;
  const HX = 620, HY = 260, HW = 760, HH = 520, BAND = 70;
  const nest = { x: HX + 470, y: HY + HH + 40 + mv * 170 };
  const trailO = clean ? 1 - lin(f, T * 0.45, T * 0.6) : lin(f, T * 0.3, T * 0.4);
  const nAnts = 18;
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Bed src={bed} seed={361} dim={0.55} />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: clamp01(p * 1.4) }}>
        {/* el patio */}
        <rect x={180} y={80} width={1560} height={940} rx={20} fill="#9DAF7A" stroke={CL.ink} strokeWidth={5} />
        {/* la franja de 30 cm */}
        <rect x={HX - BAND} y={HY - BAND} width={HW + BAND * 2} height={HH + BAND * 2} fill={hexA("#E8DCC2", 0.9)} stroke={CL.red} strokeWidth={4} strokeDasharray="18 12" opacity={lin(f, 8, 16)} />
        {/* la casa */}
        <rect x={HX} y={HY} width={HW} height={HH} fill="#F2EEE6" stroke={CL.ink} strokeWidth={7} />
        <line x1={HX + HW * 0.45} y1={HY} x2={HX + HW * 0.45} y2={HY + HH} stroke={CL.ink} strokeWidth={4} />
        <text x={HX + HW * 0.22} y={HY + HH * 0.5} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={34} fill={CL.inkSoft}>COCINA</text>
        <text x={HX + HW * 0.72} y={HY + HH * 0.5} textAnchor="middle" fontFamily={LABEL} fontWeight={700} fontSize={34} fill={CL.inkSoft}>CUARTOS</text>
        {/* la puerta del patio y la ventana de la cocina */}
        <rect x={HX + HW * 0.2 - 50} y={HY + HH - 8} width={100} height={16} fill="#8A5A34" stroke={CL.ink} strokeWidth={3} />
        <rect x={HX - 8} y={HY + 120} width={16} height={130} fill="#9CC7E6" stroke={CL.ink} strokeWidth={3} />
        {/* la leña (se va al fondo, sobre ladrillos) */}
        <g transform={`translate(${HX + 400} ${HY + HH + 20 + mv * 170})`}>
          {Array.from({ length: 9 }, (_, i) => <rect key={i} x={(i % 3) * 46} y={Math.floor(i / 3) * 26} width={44} height={24} rx={10} fill="#8B5A2B" stroke="#4A2A12" strokeWidth={2} />)}
        </g>
        {/* las macetas (se separan de la pared) */}
        {[0, 1, 2].map((i) => <g key={i} transform={`translate(${HX + HW + 22 + mv * 140} ${HY + 120 + i * 120})`}><circle r={36} fill="#B8613A" stroke={CL.ink} strokeWidth={3} /><circle r={24} fill="#5F7A3A" /></g>)}
        {/* el limonero y la rama que toca la ventana */}
        <circle cx={HX - 300} cy={HY + 180} r={120} fill="#6F8F43" stroke={CL.ink} strokeWidth={4} />
        <path d={`M${HX - 200} ${HY + 170} Q ${HX - 100} ${HY + 160} ${HX - 6 - mv * 150} ${HY + 185}`} stroke="#5A3A1E" strokeWidth={12} fill="none" strokeLinecap="round" />
        {mv > 0.5 && <path d={`M${HX - 160} ${HY + 150} l 30 40 M${HX - 140} ${HY + 150} l -30 40`} stroke={CL.red} strokeWidth={6} opacity={lin(f, T * 0.4, T * 0.48)} />}
        {/* la fila: del nido (debajo de la leña) a la puerta */}
        {Array.from({ length: nAnts }, (_, i) => {
          const t = ((f * 0.006 + i / nAnts) % 1);
          const dx = HX + HW * 0.2, x = nest.x - (nest.x - dx) * t;
          const y = nest.y + (HY + HH + 14 - nest.y) * t + Math.sin(i * 1.7) * 4;
          return <Ant key={i} x={x} y={y} r={180} s={1.2} walk={f * 0.8 + i} o={trailO} />;
        })}
      </svg>
      <Tag x={HX + 40} y={HY - BAND - 70} text="30 cm limpios" color={CL.red} o={lin(f, 10, 18)} size={36} />
      {!clean ? (
        <>
          <Tag x={HX + 330} y={HY + HH + 120} text="Leña = el nido" color="#8B5A2B" o={lin(f, T * 0.2, T * 0.28)} size={34} />
          <Tag x={HX + HW + 80} y={HY + 40} text="Macetas mojadas" color={CL.brass} o={lin(f, T * 0.4, T * 0.48)} size={34} />
          <Tag x={250} y={HY - 40} text="Rama = puente" color={CL.nitrile} o={lin(f, T * 0.55, T * 0.63)} size={34} />
        </>
      ) : (
        <>
          <Tag x={HX + 120} y={HY + HH + 120} text="Leña lejos · sobre ladrillos" color="#8B5A2B" o={lin(f, T * 0.45, T * 0.55)} size={32} />
          <Tag x={HX + HW + 150} y={HY + 20} text="Macetas separadas" color={CL.brass} o={lin(f, T * 0.5, T * 0.6)} size={32} />
          <Tag x={230} y={HY - 40} text="Rama cortada" color={CL.nitrile} o={lin(f, T * 0.55, T * 0.65)} size={32} />
        </>
      )}
      <RoomLight k={0.28} />
    </AbsoluteFill>
  );
};
