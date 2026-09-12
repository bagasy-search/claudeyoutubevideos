// MovS3A.tsx — MOVIMIENTO S3A · "LA CURVA DEL SOL CONTRA LA CURVA DE LA FACTURA"
// Video `cmeenchufe` (Claudio Mendoza Constructor, ES). 2 actos · 313.080 → 353.060 ms · 1199 frames @30.
//
// LA IDEA: el panel no falla por malo, falla por HORARIO. El sol hace su joroba al mediodía, cuando
// no hay nadie en la casa; la factura explota entre las siete y las once de la noche, cuando el panel
// ya es una plancha de vidrio muerta. Las dos curvas NUNCA se cruzan, y ese hueco es toda la razón.
// Y la cuarta razón, la más dura: un equipo solar decente tarda nueve o diez años en pagarse solo.
//
// EL OBJETO QUE CRUZA LA FRONTERA: **LA CURVA FRÍA DE LA FACTURA**.
//   acto 1 → es la curva que se dispara a las 19:00 y por la que se encienden las ventanas de la casa;
//   acto 2 → esa MISMA curva (el mismo `path`, con los mismos números interpolados) SE ACUESTA hasta
//            quedar horizontal y ya no es una curva: es la línea de tiempo de diez años sobre la madera
//            del banco. Ninguna forma nueva entra a reemplazarla: la de antes se convierte en la de después.
//
// UNA cámara: `camAt(gFrame)` — un `gcam` monótono (z −220 → +430) que deriva a la derecha y no se
// detiene, más una grúa que baja hasta el nivel del banco de trabajo mientras la curva se acuesta, y
// vuelve a subir un palmo en el remate. Función pura de `gFrame`: entre el acto 1 y el acto 2 hay
// 27 s de clips reales y la cámara los atraviesa viajando. NUNCA vuelve a cero.
// UNA atmósfera: `<VoltAtmos/>` montada una sola vez, fuera del switch de actos.
// LA LUZ: arranca SKY (la luz fría de la calle, que es la que cobra) y a lo largo del acto 2 se vuelve
// TORCH, la lámpara blanca del banco de trabajo — por ahí entra la sección de la caja.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · g0-165 · "TU FACTURA EXPLOTA A LAS 19:00"   material: CLIP techo mediodía + CLIP panel muerto
//                                                                + CLIP casa con las ventanas encendidas
//   entra  cam {z −220, bajando del techo de mediodía}      luz {SKY arriba · ÁMBAR abajo, key 0.26}
//   sale   cam {grúa −46, la curva fría llenando el cuadro} luz {SKY, key 0.34}
//   ── FRONTERA A ···· MORPH: la MISMA curva fría se acuesta y queda horizontal: es la línea de tiempo. ··
// ACTO 2 · g971-1199 · "NUEVE AÑOS EN PAGARSE"          material: CLIP pinza sobre el panel (el tanque
//                                                                que se vacía) + FOTO dos paneles + FOTO caja
//   entra  cam {grúa −120, a la altura de la madera}        luz {SKY virando a TORCH, key 0.44}
//   sale   cam {grúa +60, sobre el tramo corto y el "?"}    luz {TORCH pleno, lámpara de trabajo}
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero fade entre actos · cero texto de otro video.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rnd, rgba,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng, Readout,
  Kick, Head,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO (frames desde el arranque del movimiento, 30 fps) ────────────────
const A1 = 0, A2 = 971;
const G_END = 1199;
const START: Record<number, number> = { 1: A1, 2: A2 };

const pc = (px: number) => (px / 1080) * 100;

// ── EL MATERIAL REAL (todas verificadas en disco) ────────────────────────────────────────────
const M = {
  techoDiaV: "broll/cmeenchufe/cmee_s3_techo_mediodia_vacio.mp4",
  techoNocheV: "broll/cmeenchufe/cmee_s3_techo_noche_panel_muerto.mp4",
  ventanasV: "broll/cmeenchufe/cmee_s1_casa_ventanas_encendidas.mp4",
  fachadaF: "img/cmeenchufe/cmee_s1_fachada_noche.png",
  pinzaPanelV: "broll/cmeenchufe/cmee_s3_pinza_panel_vereda.mp4",
  dosPanelesF: "img/cmeenchufe/cmee_s3_dos_paneles_paragolpes.png",
  cajaF: "img/cmeenchufe/cmee_s3_pinza_en_la_caja.png",
  bancoF: "img/cmeenchufe/cmee_s3_cuaderno_columna_precios.png",
  icSol: "img/cmeenchufe/cmee_ic_sol.png",
  icCalendario: "img/cmeenchufe/cmee_ic_calendario.png",
  icPanel: "img/cmeenchufe/cmee_ic_panelsolar.png",
};

// ── LA CURVA QUE CRUZA LA FRONTERA ───────────────────────────────────────────────────────────
// Los mismos doce números: en el acto 1 dibujan la curva de la factura, en el acto 2 se acuestan
// hasta la horizontal. No entra una forma nueva: la de antes SE CONVIERTE en la de después.
const P_CURVA = [120, 745, 620, 742, 980, 736, 1160, 700, 1480, 300, 1800, 210];
const P_PLANA = [120, 700, 620, 700, 980, 700, 1160, 700, 1480, 700, 1800, 700];
const S_SOL = [150, 800, 320, 792, 470, 420, 700, 372, 1010, 730, 1220, 800];
const dOf = (p: number[]) =>
  `M ${p[0].toFixed(1)} ${p[1].toFixed(1)} C ${p[2].toFixed(1)} ${p[3].toFixed(1)}, ${p[4].toFixed(1)} ${p[5].toFixed(1)}, ${p[6].toFixed(1)} ${p[7].toFixed(1)} S ${p[8].toFixed(1)} ${p[9].toFixed(1)}, ${p[10].toFixed(1)} ${p[11].toFixed(1)}`;
const dMix = (a: number[], b: number[], t: number) => dOf(a.map((v, i) => lerp(v, b[i], clamp01(t))));

// ── LA CÁMARA · una sola función de gFrame, monótona, que nunca vuelve a cero ────────────────
const camAt = (g: number) => {
  const gg = Math.min(g, G_END);
  const base = gcam(gg, { z0: -220, z1: 430, panX: -190, panY: 10, ry: -5, rx: 2.2, dur: G_END });
  const crane = interpolate(
    gg,
    [0, 165, 600, 971, 1064, 1140, 1199],
    [0, -46, -96, -120, -52, 26, 60],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  // en el remate la cámara entra un palmo en el tramo corto (donde queda el signo de pregunta)
  const sc = interpolate(gg, [0, A2 + 150, G_END], [1, 1, 1.18], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.5, 0, 0.4, 1),
  });
  const ty = (50 - 62) * (sc - 1);
  return `${base.transform} translateY(${crane.toFixed(1)}px) translate(0%, ${ty.toFixed(2)}%) scale(${sc.toFixed(3)})`;
};

// ── EL TANQUE: MATERIAL REAL adentro del vidrio y el nivel ámbar leyéndose ENCIMA ────────────
// (la micro-deriva se replica exacta a la de MediaCard para que el nivel no se despegue del marco)
const dY = (frame: number, x: number) => Math.sin(frame / 41 + x) * 2.4;
const dR = (frame: number, y: number) => Math.sin(frame / 67 + y) * 0.5;

const Tank: React.FC<{
  src: string; kind: "video" | "photo"; x: number; y: number; w: number; h: number;
  fill: number; tint: string; label?: string; startFrom?: number; sheenAt?: number;
}> = ({ src, kind, x, y, w, h, fill, tint, label, startFrom = 0, sheenAt = -999 }) => {
  const frame = useCurrentFrame();
  const lv = clamp01(fill);
  const t = `rotateY(${dR(frame, y).toFixed(2)}deg) translateY(${dY(frame, x).toFixed(2)}px)`;
  return (
    <>
      <MediaCard src={src} kind={kind} w={w} h={h} x={x} y={y} radius={10}
        lit={0.44 + 0.56 * lv} litColor={tint} label={label} startFrom={startFrom} sheenAt={sheenAt} />
      <div style={{
        position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
        marginLeft: -w / 2, marginTop: -h / 2, transform: t,
        borderRadius: 10, overflow: "hidden", pointerEvents: "none",
      }}>
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0, height: `${(lv * 100).toFixed(2)}%`,
          background: `linear-gradient(180deg, ${rgba(tint, 0.5)} 0%, ${rgba(tint, 0.18)} 44%, ${rgba(tint, 0.42)} 100%)`,
          mixBlendMode: "screen",
        }} />
        {lv > 0.006 && lv < 0.994 && (
          <div style={{
            position: "absolute", left: -12, right: -12, bottom: `${(lv * 100).toFixed(2)}%`, height: 4, marginBottom: -2,
            background: `linear-gradient(90deg, ${rgba(tint, 0)}, ${rgba(tint, 0.95)} 18%, ${rgba(V.white, 0.9)} 50%, ${rgba(tint, 0.95)} 82%, ${rgba(tint, 0)})`,
            boxShadow: `0 0 22px ${rgba(tint, 0.8)}`,
          }} />
        )}
        {/* la fuga por abajo: el equipo solar se paga por goteo, no de golpe */}
        <div style={{
          position: "absolute", left: "48%", bottom: 0, width: 8, height: 22,
          background: `linear-gradient(180deg, ${rgba(tint, 0.9)}, rgba(0,0,0,0))`,
        }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 11, background: `linear-gradient(90deg, ${rgba(V.white, 0.2)}, rgba(255,255,255,0))` }} />
      </div>
    </>
  );
};

export const MovS3A: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const cf = useCurrentFrame();
  const f = gFrame - (START[acto] ?? 0);
  const toCF = (t: number) => cf - f + t;

  // LA LUZ, función continua de gFrame: de la calle fría a la lámpara blanca del banco.
  const warmT = interpolate(gFrame, [A2, A2 + 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const keyFrom = interpolate(gFrame, [0, A1 + 165, A2, G_END], [0.26, 0.34, 0.44, 0.62], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inten = interpolate(gFrame, [0, A1 + 120, A2, G_END], [0.88, 1.08, 1.0, 1.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const floorDim = interpolate(gFrame, [0, A2, G_END], [0.52, 0.62, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam = camAt(gFrame);

  return (
    <AbsoluteFill>
      {/* ── LA ATMÓSFERA: se monta UNA vez, sólo evoluciona la luz ── */}
      <VoltAtmos tint={light(warmT, "sky", "torch")} tint2={V.amber} keyFrom={keyFrom} intensity={inten} floor={floorDim} />

      <Layers cam={cam}>
        {/* ═══ ACTO 1 · el sol hace su joroba cuando no hay nadie; la factura explota a las 19 ═══ */}
        {acto === 1 && (() => {
          const sun = clamp01(f / 46);
          const fade = clamp01((f - 44) / 26);          // el sol se apaga: la curva cálida pierde fuerza
          const price = clamp01((f - 40) / 62);
          const gap = clamp01((f - 104) / 20);
          const txt = clamp01((f - 116) / 14);
          const horas = [
            { x: 150, t: "06:00" }, { x: 700, t: "12:00" }, { x: 1290, t: "19:00" }, { x: 1740, t: "23:00" },
          ];
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.fachadaF} kind="photo" z={0} scale={1.3} dim={0.76} tint={V.sky} /></Plane>
              {/* LAS DOS CURVAS. Esto SÍ es un gráfico, así que va en vector. */}
              <Plane z={0}>
                <AbsoluteFill>
                  <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
                    {/* el eje: el suelo del día */}
                    <path d="M 110 800 L 1820 800" stroke={rgba(V.bone, 0.22)} strokeWidth={2} fill="none" />
                    {/* LA CURVA DEL SOL: cálida, sube desde la izquierda, hace su joroba y se apaga */}
                    <path d={dOf(S_SOL)} fill="none" stroke={V.amber} strokeWidth={9} strokeLinecap="round"
                      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sun}
                      style={{ filter: `drop-shadow(0 0 26px ${rgba(V.amber, 0.7 - 0.4 * fade)})`, opacity: 1 - 0.55 * fade }} />
                    {/* LA CURVA DE LA FACTURA: fría, plana mientras el sol está arriba, y se dispara */}
                    <path d={dOf(P_CURVA)} fill="none" stroke={V.sky} strokeWidth={9} strokeLinecap="round"
                      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - price}
                      style={{ filter: `drop-shadow(0 0 26px ${rgba(V.sky, 0.8)})` }} />
                  </svg>
                </AbsoluteFill>
                {/* la casa recortada sobre la línea: sus ventanas se encienden una por una */}
                <div style={{ position: "absolute", left: 1236, top: 590, width: 190, height: 210 }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
                    background: `linear-gradient(180deg, ${rgba(V.ink2, 0.99)}, ${rgba(V.ink0, 1)})`,
                    clipPath: "polygon(50% 0%, 100% 30%, 100% 100%, 0% 100%, 0% 30%)",
                    boxShadow: `0 14px 34px ${rgba(V.ink0, 0.92)}`,
                  }} />
                  {[0, 1, 2, 3].map((w) => {
                    const on = clamp01((f - (62 + w * 8 + rnd(w * 5.7) * 5)) / 5);
                    return (
                      <div key={w} style={{
                        position: "absolute", left: 34 + (w % 2) * 84, top: 96 + Math.floor(w / 2) * 62,
                        width: 54, height: 46, background: rgba(V.amber, 0.08 + 0.86 * on),
                        boxShadow: on > 0 ? `0 0 ${(30 * on).toFixed(1)}px ${rgba(V.amber, 0.75 * on)}` : "none",
                      }} />
                    );
                  })}
                </div>
                {/* EL HUECO entre las dos curvas: la razón número uno, medida */}
                {gap > 0.01 && (
                  <div style={{ position: "absolute", left: 1352, top: 372, width: 3, height: 400 * gap, background: rgba(V.volt, 0.9), boxShadow: `0 0 22px ${rgba(V.volt, 0.7)}` }}>
                    <div style={{ position: "absolute", left: -13, top: 0, width: 29, height: 3, background: rgba(V.volt, 0.9) }} />
                    <div style={{ position: "absolute", left: -13, bottom: 0, width: 29, height: 3, background: rgba(V.volt, 0.9) }} />
                    <div style={{
                      position: "absolute", left: 26, top: 150, whiteSpace: "nowrap", opacity: gap,
                      fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 40, letterSpacing: 3.4, color: V.volt,
                      textShadow: "0 4px 20px rgba(0,0,0,0.94)",
                    }}>EL HUECO</div>
                  </div>
                )}
                {horas.map((h) => (
                  <div key={h.t} style={{
                    position: "absolute", left: h.x, top: 812, transform: "translateX(-50%)",
                    fontFamily: F_BODY, fontWeight: 600, fontSize: 25, letterSpacing: 2.6, color: rgba(V.bone, 0.5),
                  }}>{h.t}</div>
                ))}
              </Plane>
              {/* EL MATERIAL REAL, colgado de cada tramo de la curva */}
              <Plane z={180}>
                <MediaCard src={M.techoDiaV} kind="video" w={352} h={214} x={27} y={20} z={0} ry={9}
                  startFrom={18} lit={0.95} litColor={V.amber} label="MEDIODÍA · NO HAY NADIE" sheenAt={toCF(14)} radius={9} />
                <MediaCard src={M.techoNocheV} kind="video" w={352} h={214} x={62} y={82} z={0} ry={-6}
                  startFrom={30} lit={0.9} litColor={V.sky} label="19:00 · VIDRIO MUERTO" sheenAt={toCF(62)} radius={9} />
                <MediaCard src={M.ventanasV} kind="video" w={352} h={214} x={87} y={48} z={0} ry={-11}
                  startFrom={22} lit={1} litColor={V.amber} label="TODO ENCENDIDO" sheenAt={toCF(96)} radius={9} />
                <IconPng src={M.icSol} x={40} y={pc(258)} size={104} z={0} opacity={0.7 * (1 - 0.7 * fade)} glow={V.amber} />
              </Plane>
              <Plane z={280}>
                {txt > 0.01 && (
                  <div style={{ position: "absolute", left: "6%", top: "88%", transform: "translateY(-50%)", opacity: txt }}>
                    <Kick color={V.sky}>RAZÓN NÚMERO UNO</Kick>
                    <div style={{ marginTop: 8 }}><Head size={78} color={V.white}>TU FACTURA EXPLOTA A LAS 19:00</Head></div>
                  </div>
                )}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 2 · la misma curva se acuesta: diez años sobre la madera del banco ════ */}
        {acto === 2 && (() => {
          const lay = clamp01(f / 30);                 // LA COSTURA: la curva del acto 1 se acuesta
          const run = clamp01((f - 26) / 132);         // el cabezal recorre los diez años
          const yearsF = run * 10;
          const drain = clamp01((f - 30) / 128);
          const stop = clamp01((f - 172) / 8);         // frena en seco
          const quest = clamp01((f - 186) / 14);
          const marks = Array.from({ length: 10 }, (_, i) => 180 + i * 160);
          const head = 180 + run * 9 * 160;
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.bancoF} kind="photo" z={0} scale={1.28} dim={0.72} tint={V.torch} /></Plane>
              {/* la caja gris, sombra proyectada en la pared del fondo */}
              <Plane z={-420}>
                <div style={{
                  position: "absolute", left: "72%", top: "16%", width: 460, height: 330, borderRadius: 16,
                  background: rgba(V.ink0, 0.72), filter: "blur(26px)",
                  boxShadow: `0 0 90px ${rgba(V.ink0, 0.8)}`,
                }} />
                <div style={{
                  position: "absolute", left: "72%", top: "16%", width: 460, height: 330, borderRadius: 16,
                  border: `2px solid ${rgba(V.torch, 0.09)}`, filter: "blur(6px)",
                }} />
              </Plane>
              {/* LA MISMA CURVA, acostándose hasta la horizontal: no entra una forma nueva */}
              <Plane z={0}>
                <AbsoluteFill>
                  <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
                    <path d={dMix(P_CURVA, P_PLANA, eio(0, 1, lay))} fill="none"
                      stroke={light(lay, "sky", "volt")} strokeWidth={lerp(9, 5, lay)} strokeLinecap="round"
                      style={{ filter: `drop-shadow(0 0 24px ${rgba(V.sky, 0.6 - 0.2 * lay)})` }} />
                  </svg>
                </AbsoluteFill>
                {/* las diez marcas de año: pasan por debajo del cuadro una por una */}
                {marks.map((mx, i) => {
                  const alive = run * 9 >= i - 0.4;
                  const off = stop > 0.2 && i > 2;
                  const a = (alive ? 1 : 0.2) * (off ? 0.12 : 1) * lay;
                  return (
                    <div key={mx}>
                      <div style={{
                        position: "absolute", left: mx, top: 676, width: 3, height: 46,
                        background: rgba(off ? V.bone : V.volt, 0.9 * a),
                        boxShadow: off ? "none" : `0 0 ${(14 * a).toFixed(1)}px ${rgba(V.volt, 0.6 * a)}`,
                      }} />
                      <div style={{
                        position: "absolute", left: mx, top: 730, transform: "translateX(-50%)", opacity: a,
                        fontFamily: F_BODY, fontWeight: 600, fontSize: 26, letterSpacing: 2, color: rgba(V.bone, 0.66),
                      }}>{String(i + 1)}</div>
                    </div>
                  );
                })}
                {/* el cabezal que corre y frena en seco */}
                <div style={{
                  position: "absolute", left: head, top: 654, width: 5, height: 92, marginLeft: -2.5,
                  background: rgba(V.volt, 0.95), boxShadow: `0 0 26px ${rgba(V.volt, 0.8)}`, opacity: lay,
                }} />
              </Plane>
              {/* EL CALENDARIO: suelta una hoja por cada marca de año */}
              <Plane z={140}>
                <IconPng src={M.icCalendario} x={12} y={9} size={124} z={0} opacity={0.86 * lay} glow={V.ink0} />
                {Array.from({ length: 10 }, (_, i) => {
                  const t = clamp01((f - (30 + i * 13)) / 46);
                  if (t <= 0 || t >= 1) return null;
                  return (
                    <div key={i} style={{
                      position: "absolute", left: `${(12 + (rnd(i * 6.1) - 0.5) * 3.4).toFixed(2)}%`, top: `${(15 + t * 62).toFixed(2)}%`,
                      width: 46, height: 58, marginLeft: -23,
                      background: `linear-gradient(160deg, ${rgba(V.bone, 0.86)}, ${rgba(V.concrete, 0.5)})`,
                      transform: `rotate(${(t * (120 + rnd(i * 2.3) * 160)).toFixed(1)}deg)`,
                      opacity: 0.9 * (1 - t * 0.75),
                      boxShadow: `0 8px 18px ${rgba(V.ink0, 0.7)}`,
                    }} />
                  );
                })}
              </Plane>
              {/* EL COSTO DEL EQUIPO SOLAR: un tanque con MATERIAL REAL adentro que se vacía por abajo */}
              <Plane z={210}>
                <Tank src={M.pinzaPanelV} kind="video" x={35} y={34} w={430} h={300}
                  fill={1 - drain * 0.97} tint={V.amber} label="EL EQUIPO SOLAR" startFrom={24} sheenAt={toCF(18)} />
                <MediaCard src={M.dosPanelesF} kind="photo" w={300} h={188} x={62} y={26} z={0} ry={-8}
                  lit={0.82} litColor={V.torch} label="LOS QUE PROBÉ" sheenAt={toCF(52)} radius={9} />
                <IconPng src={M.icPanel} x={47} y={pc(96)} size={92} z={0} opacity={0.55 * lay} glow={V.ink0} />
                <Readout value={String(Math.min(9, Math.floor(yearsF)))} unit="AÑOS" label="EN PAGARSE SOLO"
                  at={toCF(34)} x={83} y={62} size={104} color={V.amber} />
              </Plane>
              {/* el tramo corto: sobre él queda encendido un signo de pregunta voltio */}
              <Plane z={310}>
                {quest > 0.01 && (
                  <>
                    <div style={{
                      position: "absolute", left: 180, top: 700, width: 320 * quest, height: 6,
                      background: `linear-gradient(90deg, ${rgba(V.volt, 0.95)}, ${rgba(V.volt, 0.4)})`,
                      boxShadow: `0 0 28px ${rgba(V.volt, 0.7)}`,
                    }} />
                    <div style={{
                      position: "absolute", left: 340, top: `${lerp(560, 496, quest).toFixed(0)}px`, transform: "translate(-50%,-50%)",
                      opacity: quest, fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 210, lineHeight: 0.86, color: V.volt,
                      textShadow: `0 0 70px ${rgba(V.volt, 0.5)}, 0 6px 26px rgba(0,0,0,0.94)`,
                    }}>?</div>
                    <MediaCard src={M.cajaF} kind="photo" w={330} h={206} x={18} y={80} z={0} ry={7}
                      lit={0.95} litColor={V.volt} label="LA CAJA" sheenAt={toCF(196)} radius={9} />
                  </>
                )}
              </Plane>
            </>
          );
        })()}
      </Layers>
    </AbsoluteFill>
  );
};
