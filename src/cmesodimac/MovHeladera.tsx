// MovHeladera.tsx — S6 · La respuesta a Ernesto es NO: el refri pide 1250 al día y el panel junta 310.
// ── TABLA DE HANDOFF ─────────────────────────────────────────────────────────────────────────
// acto | frames      | entra (cám / luz / materia)                 | sale (cám / luz / materia)
//  1   |    0 →  320 | z=-20 panX-250 · amber · ámbar del patio     | z≈+2 · amber · la MIRADA al techo
//  2   |  320 →  700 | mundo 2 (+2200px) · amber · chapa y rejilla  | z≈+30 · amber denso · la rejilla
//  3   |  700 → 1060 | z≈+30 · amber denso · cobre del cable        | z≈+55 · amber denso · la pinza
//  4   | 1060 → 1380 | z≈+55 · amber denso · ACERO (la puerta)      | z≈+75 · amber+cobre · los vasos
//  5   | 1380 → 1680 | z≈+75 · amber+cobre · vidrio de los paneles  | z=+90 panX-200 · amber denso · ZOOM
// ── COSTURAS (una distinta por frontera · NINGUNA es un fade) ────────────────────────────────
//  1→2 f=320  MATCH-MOVE (rail 2200 px: la cámara sigue su mirada del techo a la cocina)
//  2→3 f=700  CORTE EN EL BEAT — SeamFlash volt (el pico de arranque del compresor)
//  3→4 f=1060 OCLUSIÓN V.steel (la puerta del refrigerador cruzando el lente)
//  4→5 f=1380 MATCH-SHAPE (los cuatro tramos del vaso de 1.250 se separan y SON los cuatro paneles)
//  5→   f=1658 ZOOM-THROUGH por la rejilla del compresor → MovEntra
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Audio, staticFile } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rgba, gcam, light,
  VoltAtmos, DutyField, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamFlash, zoomThrough,
  Kick, Head, Body, Num, Bed,
} from "./VoltStage";

const END = 1680;                                  // 56 s × 30
const A2 = 320, A3 = 700, A4 = 1060, A5 = 1380;    // las fronteras
const WX = 2200;                                   // el mundo 2 vive montado a +2200 px

const LN = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ES = (g: number, a: number, b: number) => eio(0, 1, LN(g, a, b));
// visibilidad de un acto: el cambio ocurre DEBAJO de la costura, nunca a la vista
const VIS = (g: number, a: number, b: number, ei = 10, eo = 10) =>
  clamp01((g - a) / Math.max(1, ei)) * clamp01((b - g) / Math.max(1, eo));

// el pico de arranque: la aguja salta y se cae sola
const pico = (g: number, at: number) => {
  const up = clamp01((g - at) / 4);
  const dn = eio(0, 1, clamp01((g - at - 9) / 56));
  return up * (1 - dn);
};

const pt = (a: number, r: number): [number, number] => {
  const rad = ((a - 90) * Math.PI) / 180;
  return [200 + Math.cos(rad) * r, 210 + Math.sin(rad) * r];
};
const arco = (a0: number, a1: number, r: number) => {
  const [x0, y0] = pt(a0, r);
  const [x1, y1] = pt(a1, r);
  return `M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};

/** LA AGUJA — un eje y una aguja: esto SÍ es un gráfico, así que va en vector (regla 1). */
const Aguja: React.FC<{ watts: number; op: number; color: string }> = ({ watts, op, color }) => {
  const t = clamp01(watts / 1000);
  const ang = lerp(-118, 118, t);
  const n = pt(ang, 148);
  return (
    <div style={{ position: "absolute", left: 1150, top: 286, width: 400, height: 340, opacity: op }}>
      <svg viewBox="0 0 400 340" width={400} height={340}>
        <path d={arco(-118, 118, 148)} stroke={rgba(V.white, 0.16)} strokeWidth={16} fill="none" strokeLinecap="round" />
        <path d={arco(-118, ang, 148)} stroke={color} strokeWidth={16} fill="none" strokeLinecap="round" />
        {[0, 200, 400, 600, 800, 1000].map((w) => {
          const p = pt(lerp(-118, 118, w / 1000), 120);
          return <circle key={w} cx={p[0]} cy={p[1]} r={3.4} fill={rgba(V.white, 0.42)} />;
        })}
        <line x1={200} y1={210} x2={n[0]} y2={n[1]} stroke={V.white} strokeWidth={5} strokeLinecap="round" />
        <circle cx={200} cy={210} r={13} fill={V.ink1} stroke={rgba(color, 0.9)} strokeWidth={3} />
      </svg>
    </div>
  );
};

/** El recipiente de vatios-hora: en el acto 4 son dos, y no hay comparación posible. */
const Vaso: React.FC<{ x: number; y: number; w: number; h: number; op: number; label: string; color: string }> = ({
  x, y, w, h, op, label, color,
}) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, opacity: op }}>
    <div style={{
      position: "absolute", left: 0, top: 0, right: 0, bottom: 0, borderRadius: 8,
      border: `3px solid ${rgba(color, 0.62)}`,
      boxShadow: `inset 0 0 46px ${rgba(color, 0.14)}, 0 18px 50px ${rgba(V.ink0, 0.7)}`,
    }} />
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: -42, textAlign: "center",
      fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 24, letterSpacing: 3.2,
      color: rgba(V.white, 0.7), textTransform: "uppercase",
    }}>{label}</div>
  </div>
);

const mil = (n: number) => (n < 1000 ? String(n) : Math.floor(n / 1000) + "." + ("00" + (n % 1000)).slice(-3));

const Escena: React.FC<{ g: number }> = ({ g }) => {
  // UNA cámara, función de g, que nunca vuelve a cero
  const cam = gcam(g, { z0: -20, z1: 90, panX: -200, panY: -22, ry: 2, rx: -3, dur: END });
  const rail = -WX * ES(g, A2 - 76, A2 + 18);              // MATCH-MOVE al mundo de la cocina
  const key = light(ES(g, 0, END), "amber", "copper");     // ámbar → ámbar DENSO (atardecer)
  const kf = lerp(0.34, 0.24, LN(g, 0, END));

  const o1 = VIS(g, -40, A2, 1, 22);
  const o2 = VIS(g, A2 - 4, A3, 20, 14);
  const o3 = VIS(g, A3 - 4, A4, 14, 20);
  const o4 = VIS(g, A4 - 4, A5 + 70, 20, 1);               // sigue vivo: sus tramos se vuelven paneles
  const o5 = VIS(g, A5 - 70, END + 40, 46, 1);

  const watts = 130 + 670 * Math.max(pico(g, A3 + 72), pico(g, A3 + 246));
  const m = ES(g, A5 - 50, A5 + 40);                       // MATCH-SHAPE vaso → paneles
  const precio = Math.round(lerp(110, 1050, ES(g, A5 + 60, A5 + 190)));
  const grow = ES(g, END - 120, END - 20);
  const zt = zoomThrough(g, END - 22, 22, 50, 46);         // salida: por la rejilla

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <VoltAtmos tint={V.amber} tint2={V.volt} keyFrom={kf} intensity={1} floor={0.6} />
      <AbsoluteFill style={{ transform: zt.out === "none" ? undefined : zt.out, opacity: zt.opacity }}>
        <Layers cam={`${cam.transform} translate3d(${rail.toFixed(1)}px,0,0)`}>

          {/* ══ MUNDO 1 · el patio: Ernesto mirando el techo ══════════════════════════════ */}
          <Plane z={-520}>
            <AbsoluteFill style={{ opacity: o1 }}>
              <PhotoPlane src="img/cmesodimac/cmes_mv_hela5.jpg" dim={0.56} tint={V.amber} scale={1.22} />
            </AbsoluteFill>
          </Plane>
          <Plane z={-40}>
            <MediaCard src="broll/cmesodimac/cmes_mv_hela1.mp4" kind="video"
              w={1120} h={630} x={50} y={45} ry={-4} lit={0.95} litColor={key}
              sheenAt={44} opacity={o1} label="ERNESTO · EL VECINO DE LA GORRA" />
          </Plane>
          <Plane z={150}>
            <div style={{ position: "absolute", left: 110, top: 690, width: 940, opacity: o1 }}>
              <Bed pad={26} w={940}>
                <Kick color={V.amber}>LA PREGUNTA QUE HACE TODO EL MUNDO</Kick>
                <div style={{ height: 10 }} />
                <Head size={60}>¿Y con eso te anda el refrigerador?</Head>
              </Bed>
            </div>
            <IconPng src="img/cmesodimac/cmes_ic_heladera.png" x={86} y={18} size={132} opacity={o1 * 0.92} z={40} />
          </Plane>

          {/* ══ MUNDO 2 · la cocina, montado a +2200 px ═══════════════════════════════════ */}
          <Plane z={-520}>
            <AbsoluteFill style={{ transform: `translateX(${WX}px)`, opacity: 1 - o1 * 0.9 }}>
              <PhotoPlane src="img/cmesodimac/cmes_mv_hela4.jpg" dim={0.6} tint={V.amber} scale={1.2} />
            </AbsoluteFill>
          </Plane>

          {/* ── acto 2 · PRENDE Y APAGA ── */}
          <Plane z={-30}>
            <AbsoluteFill style={{ transform: `translateX(${WX}px)` }}>
              <MediaCard src="broll/cmesodimac/cmes_mv_hela2.mp4" kind="video"
                w={1000} h={570} x={45} y={41} ry={5} lit={0.9} litColor={key}
                sheenAt={A2 + 40} opacity={o2} label="LA REJILLA DEL COMPRESOR" />
            </AbsoluteFill>
          </Plane>
          <Plane z={160}>
            <AbsoluteFill style={{ transform: `translateX(${WX}px)` }}>
              <div style={{ position: "absolute", left: 112, top: 106, width: 720, opacity: o2 }}>
                <Bed pad={24} w={720}>
                  <Kick>EL COMPRESOR NO ANDA TODO EL TIEMPO</Kick>
                  <div style={{ height: 8 }} />
                  <Head size={72}>Prende y apaga.</Head>
                </Bed>
              </div>
              <DutyField duty={1 / 3} cells={30} on={o2} tint={V.volt} y={80} w={1240} h={52} cycle={132} />
              <div style={{ opacity: o2 }}>
                <Readout value="1 de 3" label="DEL TIEMPO, NADA MÁS" at={A2 + 96} x={72} y={64} size={104} color={V.volt} />
              </div>
            </AbsoluteFill>
          </Plane>

          {/* ── acto 3 · OCHOCIENTOS AL ARRANCAR ── */}
          <Plane z={-10}>
            <AbsoluteFill style={{ transform: `translateX(${WX}px)` }}>
              <MediaCard src="broll/cmesodimac/cmes_mv_hela3.mp4" kind="video"
                w={780} h={450} x={28} y={52} ry={7} lit={1} litColor={key}
                sheenAt={A3 + 34} opacity={o3} label="LA PINZA EN EL CABLE" />
            </AbsoluteFill>
          </Plane>
          <Plane z={170}>
            <AbsoluteFill style={{ transform: `translateX(${WX}px)` }}>
              <Aguja watts={watts} op={o3} color={V.volt} />
              <div style={{ position: "absolute", left: 1226, top: 512, width: 250, textAlign: "center", opacity: o3 }}>
                <Num size={124} color={V.volt}>{Math.round(watts)}</Num>
                <div style={{
                  fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 3.4,
                  color: rgba(V.white, 0.66), textTransform: "uppercase", marginTop: 4,
                }}>vatios</div>
              </div>
              <div style={{ position: "absolute", left: 112, top: 120, width: 700, opacity: o3 }}>
                <Bed pad={24} w={700}>
                  <Kick>LO QUE MARCA CUANDO ARRANCA</Kick>
                  <div style={{ height: 8 }} />
                  <Head size={62}>Ochocientos. Y después, ciento treinta.</Head>
                </Bed>
              </div>
            </AbsoluteFill>
          </Plane>

          {/* ── acto 4 · MIL DOSCIENTOS AL DÍA  ·  acto 5 · CUATRO EQUIPOS (misma instancia) ── */}
          <Plane z={-70}>
            <AbsoluteFill style={{ transform: `translateX(${WX}px)` }}>
              <MediaCard src="img/cmesodimac/cmes_mv_hela4.jpg" kind="photo"
                w={700} h={430} x={24} y={31} ry={6} lit={0.9} litColor={key}
                sheenAt={A4 + 40} opacity={o4 * (1 - m)} label="UN DÍA ENTERO DE REFRIGERADOR" />
              <MediaCard src="img/cmesodimac/cmes_mv_hela5.jpg" kind="photo"
                w={900} h={470} x={50} y={29} ry={-3} lit={0.95} litColor={key}
                sheenAt={A5 + 30} opacity={o5 * m} label="CUATRO DE ESTOS EQUIPOS" />
            </AbsoluteFill>
          </Plane>
          <Plane z={120}>
            <AbsoluteFill style={{ transform: `translateX(${WX}px)` }}>
              {/* los recipientes: 310 al lado de 1.250 */}
              <Vaso x={752} y={582} w={236} h={126} op={o4 * (1 - m)} label="EL PANEL · 310" color={V.volt} />
              <Vaso x={1156} y={194} w={236} h={514} op={o4 * (1 - m)} label="EL REFRI · 1.250" color={V.amber} />
              {/* LOS CUATRO TRAMOS: son el vaso de 1.250 y son los cuatro paneles. LA MISMA instancia. */}
              {[0, 1, 2, 3].map((i) => {
                const x = lerp(1162, 258 + i * 356, m);
                const y = lerp(582 - i * 128, 620, m);
                const w = lerp(224, 302, m);
                const h = lerp(120, 192, m);
                const op = Math.max(o4 * (1 - m), o5 * m);
                return (
                  <div key={i} style={{
                    position: "absolute", left: x, top: y, width: w, height: h, opacity: op, borderRadius: 6,
                    background: `linear-gradient(168deg, ${rgba(V.amber, lerp(0.42, 0.1, m))} 0%, ${rgba(V.sky, lerp(0.06, 0.4, m))} 100%)`,
                    border: `2px solid ${rgba(m > 0.5 ? V.sky : V.amber, 0.72)}`,
                    boxShadow: `0 18px 44px ${rgba(V.ink0, 0.72)}, inset 0 1px 0 ${rgba(V.white, 0.2)}`,
                  }}>
                    <div style={{
                      position: "absolute", left: 6, top: 6, right: 6, bottom: 6, opacity: m * 0.55,
                      backgroundImage: `repeating-linear-gradient(90deg, ${rgba(V.white, 0.34)} 0 1px, rgba(0,0,0,0) 1px 26px), repeating-linear-gradient(0deg, ${rgba(V.white, 0.24)} 0 1px, rgba(0,0,0,0) 1px 30px)`,
                    }} />
                  </div>
                );
              })}
            </AbsoluteFill>
          </Plane>
          <Plane z={200}>
            <AbsoluteFill style={{ transform: `translateX(${WX}px)` }}>
              <div style={{ opacity: o4 * (1 - m) }}>
                <Readout value="1.250" unit="Wh" label="LO QUE SE COME EN UN DÍA" at={A4 + 82} x={64} y={12} size={128} color={V.volt} />
              </div>
              <div style={{ position: "absolute", left: 112, top: 462, width: 520, opacity: o4 * (1 - m) }}>
                <Bed pad={22} w={520}>
                  <Kick>Y EL PANEL JUNTA</Kick>
                  <Num size={104} color={V.volt}>310</Num>
                  <Body size={26}>vatios hora en un día bueno.</Body>
                </Bed>
              </div>
              <div style={{ position: "absolute", left: 112, top: 126, width: 560, opacity: o5 * m }}>
                <Bed pad={24} w={560}>
                  <Kick color={V.amber}>YA NO ESTÁS EN CIENTO DIEZ</Kick>
                  <div style={{ height: 6 }} />
                  <Num size={128} color={V.amber}>{"$ " + mil(precio)}</Num>
                  <Body size={26}>cuatro paneles, batería de verdad e inversor.</Body>
                </Bed>
              </div>
              {/* el objeto por el que se SALE: la rejilla vuelve, y la cámara la atraviesa */}
              <MediaCard src="broll/cmesodimac/cmes_mv_hela2.mp4" kind="video"
                w={lerp(320, 620, grow)} h={lerp(190, 360, grow)}
                x={50} y={46} lit={1} litColor={key}
                opacity={VIS(g, END - 132, END + 30, 36, 1)} />
            </AbsoluteFill>
          </Plane>

        </Layers>
      </AbsoluteFill>

      {/* ── LAS COSTURAS ── */}
      <SeamFlash at={A3} color={V.volt} dur={7} />
      <SeamOcclude at={A4 - 8} dur={16} color={V.steel} angle={7} />

      <Sequence from={A2 - 70} durationInFrames={50} layout="none">
        <Audio src={staticFile("sfx/whoosh.mp3")} volume={0.3} />
      </Sequence>
      <Sequence from={A3 + 70} durationInFrames={26} layout="none">
        <Audio src={staticFile("sfx/impacto_hit.mp3")} volume={0.34} />
      </Sequence>
      <Sequence from={A4 - 8} durationInFrames={26} layout="none">
        <Audio src={staticFile("sfx/sfx_thump.mp3")} volume={0.3} />
      </Sequence>
      <Sequence from={A5 + 56} durationInFrames={70} layout="none">
        <Audio src={staticFile("sfx/counter_up.mp3")} volume={0.26} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MovHeladera: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  void acto;
  const localF = useCurrentFrame();
  const off = Math.round(localF - gFrame);
  const g = Math.max(0, Math.min(END, gFrame));
  return (
    <Sequence from={off} layout="none">
      <Escena g={g} />
    </Sequence>
  );
};
