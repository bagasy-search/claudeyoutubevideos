// LatchCutaway.tsx — CORTE VISTO DESDE ARRIBA del borde de la puerta contra el marco (video rkcard).
//
// Cuatro modos, el mismo dibujo, para que el espectador aprenda UNA geometría y la vea cambiar:
//   close     — la puerta cierra: la RAMPA del pestillo choca el cerradero, entra, y salta al hueco. Click.
//   spring    — algo fino llega a la cara inclinada y el pestillo CEDE (rojo). Sólo pestillo de resorte.
//   deadlatch — el émbolo "deadlatch" está APRETADO por el cerradero y traba la rampa: no cede (verde).
//   slack     — la puerta tiene HOLGURA: el émbolo no llega a la placa, queda afuera y la rampa cede.
// ⛔ ENCUADRE DEFENSIVO (brief rkcard §2): es un ESQUEMA del porqué — la "tarjeta" es una forma
//    translúcida rotulada "anything thin", sin trayectoria ni pasos. Nunca un tutorial.
// ⛔ Tiempos = fracciones de `durationInFrames` (LatchKit.useT).
import React from "react";
import { Easing, interpolate } from "remotion";
import { V, F_DISPLAY, F_BODY, rgba } from "./RayStage";
import { useT, DiagramStage, MetalDefs, Callout } from "./LatchKit";

type Mode = "close" | "spring" | "deadlatch" | "slack";

const DEF: Record<Mode, { kicker: string; title: string; caption: string; tone: "brass" | "danger" | "ok" }> = {
  close: { kicker: "WHAT HOLDS IT SHUT", title: "A ramp and a spring", caption: "Built to close a door. Not to lock it.", tone: "brass" },
  spring: { kicker: "WHY THE CARD WORKS", title: "Push the ramp, it moves", caption: "A knob lock stops a hand, not a card.", tone: "danger" },
  deadlatch: { kicker: "THE PIECE BUILT TO STOP IT", title: "The deadlatch", caption: "Pressed in, it locks the ramp.", tone: "ok" },
  slack: { kicker: "A DOOR WITH PLAY", title: "The plunger misses", caption: "Same lock. Doing nothing.", tone: "danger" },
};

export const LatchCutaway: React.FC<{
  mode?: Mode;
  kicker?: string;
  title?: string;
  caption?: string;
  bed?: string;
  durationInFrames?: number;
}> = ({ mode = "spring", kicker, title, caption, bed, durationInFrames }) => {
  const { ph, salida } = useT(durationInFrames);
  const d = DEF[mode] ?? DEF.spring;
  const aTitle = ph(0, 0.1, Easing.out(Easing.quad));
  const aStruct = ph(0.02, 0.16, Easing.out(Easing.cubic));
  const aCall = [ph(0.12, 0.26), ph(0.18, 0.32), ph(0.24, 0.38), ph(0.3, 0.44)];
  const aCap = ph(0.7, 0.8, Easing.out(Easing.quad));

  // ── geometría (coords 1920x1080) ──
  const J0 = 1000;                              // cara del marco (jamb)
  const gap = mode === "slack" ? 44 : 10;       // luz entre canto de puerta y marco
  let xe = J0 - gap;                            // canto de la puerta
  let dy = 0;                                   // desplazamiento de la puerta (modo close)
  let r = 0;                                    // retracción del pestillo (px)
  let click = 0;

  if (mode === "close") {
    const mov = ph(0.16, 0.62, Easing.inOut(Easing.sin));
    dy = interpolate(mov, [0, 1], [290, 0]);
    // la rampa toca la esquina del marco (y=760) -> entra; sobre el marco queda adentro; al hueco salta
    const latchTop = 510 + dy;
    if (latchTop > 760) r = 0;
    else if (latchTop > 700) r = interpolate(latchTop, [760, 700], [0, 60]);
    else if (latchTop > 512) r = 60;
    else r = 0;
    click = mov > 0.985 ? 1 - ph(0.64, 0.8) : 0;
  }
  // tarjeta (esquema): entra, toca la cara inclinada
  const cardIn = mode === "close" ? 0 : ph(0.32, 0.52, Easing.out(Easing.cubic));
  const push = mode === "close" ? 0 : ph(0.54, 0.68, Easing.inOut(Easing.cubic));
  const bloqueado = mode === "deadlatch";
  if (mode === "spring" || mode === "slack") r = 58 * push;
  if (bloqueado) r = Math.sin(push * Math.PI * 3) * 3 * (1 - push);
  const aRes = ph(0.62, 0.72, Easing.out(Easing.back(1.6)));

  // émbolo: extendido 24 px; apretado si la placa lo alcanza
  const plExt = 24;
  const plReach = xe + plExt;
  const plPressed = mode !== "slack" && plReach > J0 - 6 && dy < 40;
  const plLen = plPressed ? J0 - 6 - xe : plExt;
  const latchColor = (mode === "spring" || mode === "slack") && push > 0.05 ? V.danger : undefined;

  const id = "lc";
  const P = (pts: number[][]) => pts.map((p) => p.join(",")).join(" ");
  const L = xe - r;                             // raíz del pestillo corrida
  const latchPts = P([[L - 40, 510], [L + 30, 510], [L + 70, 555], [L + 70, 595], [L - 40, 595]]);

  // ── CÁMARA VIRTUAL: arranca abierta y ENTRA en el pestillo (s 1,15 -> 1,75) ──
  const cam = ph(0.1, 0.46, Easing.inOut(Easing.cubic));
  const s = interpolate(cam, [0, 1], [1.15, 1.75]);
  const CX = 1000, CY = 560, SX = 820, SY = 575;       // punto del mundo que queda en SX,SY
  const T = (x: number, y: number) => [SX + (x - CX) * s, SY + (y - CY) * s];
  const conPlunger = mode !== "spring";
  const lat = T(L + 50, dy + 540), plc = T(xe + plLen - 4, dy + 635), stk = T(J0, 650), stp = T(J0 - 35, 405);

  return (
    <DiagramStage bed={bed} kicker={kicker ?? d.kicker} title={title ?? d.title} caption={caption ?? d.caption}
      captionTone={d.tone} aTitle={aTitle} aCaption={aCap} salida={salida}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <MetalDefs id={id} />
        <clipPath id={`${id}_clip`}><rect x={92} y={212} width={1736} height={716} rx={16} /></clipPath>
        <g clipPath={`url(#${id}_clip)`} opacity={aStruct}>
          <g transform={`translate(${SX} ${SY}) scale(${s.toFixed(4)}) translate(${-CX} ${-CY})`}>
            <text x={560} y={330} fill={rgba(V.bone, 0.7)} style={{ fontFamily: F_DISPLAY, fontSize: 26, letterSpacing: 6 }}>OUTSIDE</text>
            <text x={560} y={800} fill={rgba(V.bone, 0.7)} style={{ fontFamily: F_DISPLAY, fontSize: 26, letterSpacing: 6 }}>INSIDE</text>
            <rect x={J0} y={380} width={320} height={380} fill={`url(#${id}_wood)`} />
            <rect x={J0} y={380} width={320} height={380} fill={`url(#${id}_grain)`} />
            <rect x={J0} y={503} width={78} height={98} fill="#050506" />
            <rect x={J0 - 6} y={440} width={12} height={63} fill={`url(#${id}_steel)`} />
            <rect x={J0 - 6} y={601} width={12} height={92} fill={`url(#${id}_steel)`} />
            {/* tarjeta: esquema translúcido que baja por la luz entre canto y marco (se dibuja sobre el marco y DEBAJO del tope) */}
            {mode !== "close" ? (() => {
              const x = xe + gap / 2 + (bloqueado ? 0 : push * 4);
              const tipY = interpolate(cardIn, [0, 1], [150, 522]);
              return <rect x={x - 5} y={tipY - 420} width={12} height={420} rx={3} fill={rgba(V.white, 0.95)} stroke={V.brassSoft} strokeWidth={1.5} opacity={cardIn > 0 ? 1 : 0} />;
            })() : null}
            <rect x={J0 - 70} y={380} width={70} height={50} fill={`url(#${id}_wood)`} stroke={rgba(V.brass, 0.5)} strokeWidth={1.5} />
            <g transform={`translate(0 ${dy})`}>
              <polygon points={latchPts} fill={latchColor ?? `url(#${id}_brass)`} stroke={rgba("#000", 0.5)} strokeWidth={2} />
              {conPlunger ? (
                <rect x={xe - 30} y={617} width={30 + plLen} height={36} rx={4}
                  fill={mode === "slack" ? V.danger : bloqueado && push > 0 ? V.ok : `url(#${id}_brass)`} stroke={rgba("#000", 0.5)} strokeWidth={2} />
              ) : null}
              <rect x={380} y={430} width={xe - 380} height={270} fill={`url(#${id}_door)`} />
              <rect x={xe - 14} y={450} width={14} height={230} fill={`url(#${id}_brass)`} opacity={0.9} />
            </g>
            {click > 0 ? (
              <text x={J0 + 95} y={540} fill={V.brassSoft} opacity={click} style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 44 }}>CLICK</text>
            ) : null}
          </g>
          {/* callouts en coordenadas de PANTALLA (siguen a la cámara) */}
          <Callout x={lat[0]} y={lat[1]} tx={1400} ty={330} text="Spring latch — the ramp" a={aCall[0]} />
          <Callout x={stk[0]} y={stk[1]} tx={1400} ty={470} text="Strike plate" a={aCall[1]} />
          {conPlunger ? <Callout x={plc[0]} y={plc[1]} tx={1400} ty={860} text="Deadlatch plunger" a={aCall[2]} color={mode === "slack" ? V.dangerSoft : V.brassSoft} /> : null}
          <Callout x={stp[0]} y={stp[1]} tx={520} ty={300} text="Door stop" a={aCall[3]} align="end" />
          {mode !== "close" ? (
            <text x={Math.min(1350, T(xe, 0)[0] + 40)} y={265} fill={V.white} opacity={cardIn} style={{ fontFamily: F_BODY, fontStyle: "italic", fontWeight: 600, fontSize: 30 }}>anything thin</text>
          ) : null}
          {mode !== "close" ? (
            <g opacity={aRes} transform={`translate(1400 ${660 + (1 - aRes) * 20})`}>
              <rect x={0} y={-52} width={400} height={78} rx={8} fill={bloqueado ? rgba(V.ok, 0.22) : rgba(V.danger, 0.22)} stroke={bloqueado ? V.ok : V.danger} strokeWidth={3} />
              <text x={24} y={2} fill={bloqueado ? V.ok : V.dangerSoft} style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 44, letterSpacing: 2 }}>
                {bloqueado ? "IT CAN'T MOVE" : "PUSHED BACK"}
              </text>
            </g>
          ) : null}
        </g>
      </svg>
    </DiagramStage>
  );
};
