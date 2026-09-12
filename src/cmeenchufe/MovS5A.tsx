// MovS5A.tsx — MOVIMIENTO S5A · "LOS 90 MINUTOS QUE PAGAN EL DÍA ENTERO"
// Video `cmeenchufe` (Claudio Mendoza Constructor, ES). 4 actos · 652.800 → 682.240 ms · 883 frames @30.
//
// LA IDEA: la casa promedia 800 W y eso no le importa a nadie. Entre las 19:30 y las 21:00 la misma
// casa se va a 4.500, y una noche tocó 5.100. Por esos 90 minutos se paga una potencia contratada
// que sostiene los otros 1.350 minutos del día, con la casa prácticamente apagada.
//
// LA MATERIA QUE CRUZA LAS TRES FRONTERAS: **LA CINTA DE CONSUMO**.
//   acto 1 → sale del display de la pinza y se estira a la derecha: una cinta baja y cálida en 800 W;
//   acto 2 → la MISMA cinta se despega del piso y trepa (la curva es una sola función de gFrame);
//   acto 3 → la cresta choca contra el techo del cuadro y el 5.100 se clava ahí;
//   acto 4 → esa misma polilínea se DOBLA sobre sí misma, punto por punto, y se cierra en el aro
//            de los 1.440 minutos del día. Es un morph real: cada muestra de la curva viaja a su
//            posición en el círculo con retardo por posición. No hay corte ni fundido.
//
// UNA cámara: `camAt(gFrame)` — un solo `gcam` monótono (z −240 → +520) + una grúa continua que
// BAJA mientras la cinta trepa (el pico crece contra una cámara que se hunde) y vuelve a SUBIR
// rodeando el aro, con una órbita `rotateY` que sólo empieza en el acto 4 y ya no para.
// El acto 1 arranca DENTRO del display de la pinza (push 2.7 → 1 sobre el punto 20%/52%).
// Como es función pura de `gFrame`, la cámara sigue viajando durante los clips reales que van entre
// acto y acto: el acto 3 empieza exactamente donde el acto 2 la dejó. NUNCA vuelve a cero.
// UNA atmósfera: `<VoltAtmos/>` montada una sola vez, fuera del switch de actos.
// LA LUZ: VOLT abajo y cálido (los 800 W son "lo tuyo") → a medida que la cinta trepa, el aire se
// enfría desde ARRIBA hacia SKY (lo que te cobran entra siempre de arriba y en frío). Evoluciona.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · g0-183 · "ENTRE LAS 7:30 Y LAS 9 DE LA NOCHE"     material: CLIP display + CLIP reloj de pared
//   entra  cam {DENTRO del display, push ×2.7} luz {VOLT cálido abajo, key 0.20, int 0.86}
//   sale   cam {plano general de la cinta, grúa −46} luz {empieza el frío arriba, key 0.28}
//   ── FRONTERA A ···· MATCH-MOVE: la MISMA cinta se despega del piso y sigue subiendo. ······
// ACTO 2 · g183-285 · "4.000 · 4.500"                        material: CLIP calentador + 3 FOTOS aparatos
//   entra  cam {grúa −46, la cinta a ras}       luz {key 0.34, 30% frío}
//   sale   cam {grúa −140, mirando hacia arriba} luz {key 0.50, 70% frío}
//   ── FRONTERA B ···· MATCH-CUT DE ESCALA: la cresta sale del cuadro por arriba y vuelve. ···
// ACTO 3 · g285-628 · "5.100"                                material: CLIP su cara contra el display
//   entra  cam {grúa −140, pegada al pico}      luz {key 0.50, frío pleno}
//   sale   cam {grúa −96, quieta sobre el pico} luz {key 0.62}
//   ── FRONTERA C ···· MORPH PUNTO A PUNTO: la polilínea se dobla y se cierra en el ARO. ·····
// ACTO 4 · g628-883 · "90 CONTRA 1.350"          material: FOTO factura marcada + CLIP factura cenital
//   entra  cam {la curva plegándose, órbita 0}  luz {frío arriba pleno, ámbar sólo en la cuña}
//   sale   cam {grúa +110, órbita −14°, rodeando el aro} luz {key 0.66}
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero fade entre actos · cero texto de otro video.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rnd, rgba,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng, Readout,
  Kick, Num,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO (frames desde el arranque del MOVIMIENTO, 30 fps) ────────────────
const A1 = 0, A2 = 183, A3 = 285, A4 = 628;
const G_END = 883;
const START: Record<number, number> = { 1: A1, 2: A2, 3: A3, 4: A4 };

// ── EL MATERIAL REAL (todas las rutas verificadas en disco) ──────────────────────────────────
const M = {
  displayV: "broll/cmeenchufe/cmee_s5_display_800.mp4",
  relojV: "broll/cmeenchufe/cmee_s4_reloj_pared_3am.mp4",
  caraV: "broll/cmeenchufe/cmee_s5_cara_display_noche.mp4",
  caraF: "img/cmeenchufe/cmee_s5_cara_display_noche.png",
  calentadorV: "broll/cmeenchufe/cmee_s5_calentador_arranca.mp4",
  calentadorF: "img/cmeenchufe/cmee_s5_calentador_pasillo.png",
  hornoF: "img/cmeenchufe/cmee_s5_horno_rojo.png",
  hervidorF: "img/cmeenchufe/cmee_s5_hervidor_vapor.png",
  aireF: "img/cmeenchufe/cmee_s5_aire_sala.png",
  facturaF: "img/cmeenchufe/cmee_s4_dedo_letra_chica.png",
  cenitalV: "broll/cmeenchufe/cmee_s4_factura_cenital_cierre.mp4",
  pinzaCableF: "img/cmeenchufe/cmee_s5_pinza_cable_entrada.png",
  icPinza: "img/cmeenchufe/cmee_ic_pinza.png",
  icReloj: "img/cmeenchufe/cmee_ic_reloj.png",
};

// ── LA CINTA DE CONSUMO · una sola función del frame global ──────────────────────────────────
// El eje vertical es LITERAL: 800 W y 5.100 W están a la escala real uno del otro.
const SAMP = 96;
const CX0 = 60, CX1 = 1860;
const yOfW = (v: number) => 866 - (v / 5100) * 606;      // 800 W → 771 px · 5.100 W → 260 px
const gauss = (u: number, c: number, s: number) => Math.exp(-((u - c) * (u - c)) / (2 * s * s));

// el pico del día: plano hasta las 19:30, después trepa y ya no vuelve a bajar dentro del movimiento
const peakAt = (g: number) =>
  interpolate(g, [120, 190, 226, 262, 300, 332], [800, 800, 4000, 4500, 4500, 5100], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.42, 0, 0.3, 1),
  });
// el temblor: arranca en el ms en que el reloj marca las 19:30 y se calma cuando el pico se clava
const tremAt = (g: number) =>
  interpolate(g, [96, 150, 190, 300, 430], [0, 26, 40, 14, 7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

const ptAt = (u: number, g: number) => {
  const v = 800 + (peakAt(g) - 800) * gauss(u, 0.62, 0.118);
  const tr = tremAt(g) * Math.sin(u * 47 + g / 2.4) * (0.32 + 0.68 * gauss(u, 0.62, 0.34));
  return { x: CX0 + u * (CX1 - CX0), y: yOfW(v) + tr };
};
const cintaD = (g: number) => {
  let d = "";
  for (let i = 0; i <= SAMP; i++) {
    const p = ptAt(i / SAMP, g);
    d += (i === 0 ? "M " : "L ") + p.x.toFixed(1) + " " + p.y.toFixed(1) + " ";
  }
  return d;
};
const cintaArea = (g: number) => cintaD(g) + `L ${CX1} 1010 L ${CX0} 1010 Z`;

// ── EL ARO DE LOS 1.440 MINUTOS (acto 4) ─────────────────────────────────────────────────────
const RCX = 960, RCY = 512, RR = 300, RTH = 56;
const RING_OFF = 80.55;   // calibrado para que la CRESTA de la curva caiga sobre la cuña del pico
const polar = (aTop: number, r: number): [number, number] => {
  const t = ((aTop - 90) * Math.PI) / 180;
  return [RCX + Math.cos(t) * r, RCY + Math.sin(t) * r];
};
const ringPt = (u: number) => polar(360 * u + RING_OFF, RR);
const sector = (a0: number, a1: number, r0: number, r1: number) => {
  const p0 = polar(a0, r1), p1 = polar(a1, r1), p2 = polar(a1, r0), p3 = polar(a0, r0);
  const big = a1 - a0 > 180 ? 1 : 0;
  return `M ${p0[0].toFixed(1)} ${p0[1].toFixed(1)} A ${r1} ${r1} 0 ${big} 1 ${p1[0].toFixed(1)} ${p1[1].toFixed(1)} ` +
    `L ${p2[0].toFixed(1)} ${p2[1].toFixed(1)} A ${r0} ${r0} 0 ${big} 0 ${p3[0].toFixed(1)} ${p3[1].toFixed(1)} Z`;
};
// EL MORPH: cada muestra de la curva viaja a su lugar en el círculo, con retardo por posición.
const morphD = (m: number, g: number) => {
  let d = "";
  for (let i = 0; i <= SAMP; i++) {
    const u = i / SAMP;
    const a = ptAt(u, g), b = ringPt(u);
    const k = clamp01((m - u * 0.3) / 0.7);
    const e = interpolate(k, [0, 1], [0, 1], { easing: Easing.bezier(0.5, 0, 0.18, 1) });
    d += (i === 0 ? "M " : "L ") + lerp(a.x, b[0], e).toFixed(1) + " " + lerp(a.y, b[1], e).toFixed(1) + " ";
  }
  return d;
};

// ── LA CÁMARA · una sola función de gFrame, monótona, que nunca vuelve a cero ────────────────
const camAt = (g: number) => {
  const base = gcam(g, { z0: -240, z1: 520, panX: -190, panY: -30, ry: 8, rx: -2.4, dur: G_END });
  // LA GRÚA: se hunde mientras la cinta trepa (el pico crece contra una cámara que baja) y vuelve
  // a subir rodeando el aro. Un solo tramo continuo, sin un frame quieto.
  const crane = interpolate(
    g, [0, A2, A3, A3 + 120, A4, A4 + 140, G_END],
    [0, -46, -140, -196, -96, 54, 110],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  // ARRANQUE DENTRO DEL DISPLAY: salimos del número de la pinza y la escena se abre alrededor.
  const push = interpolate(g, [0, 44], [2.7, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.5, 0, 0.32, 1),
  });
  const tx = (50 - 20) * (push - 1);
  const ty = (50 - 52) * (push - 1);
  // LA ÓRBITA: sólo empieza en el acto 4, cuando hay un aro que rodear, y ya no se detiene.
  const orbit = interpolate(g, [A4, G_END], [0, -14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    `${base.transform} translateY(${crane.toFixed(1)}px) rotateY(${orbit.toFixed(2)}deg) ` +
    `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${push.toFixed(3)})`
  );
};

// ── LA CINTA dibujada (actos 1-3): el objeto que cruza las fronteras A y B ───────────────────
const Cinta: React.FC<{ g: number; reveal: number }> = ({ g, reveal }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
      <defs>
        <linearGradient id="s5aCinta" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={rgba(V.sky, 0.34)} />
          <stop offset="46%" stopColor={rgba(V.volt, 0.16)} />
          <stop offset="100%" stopColor={rgba(V.amber, 0.04)} />
        </linearGradient>
        <clipPath id="s5aClip">
          <rect x="0" y="0" width={(CX0 + reveal * (CX1 - CX0)).toFixed(1)} height="1080" />
        </clipPath>
      </defs>
      <g clipPath="url(#s5aClip)">
        <path d={cintaArea(g)} fill="url(#s5aCinta)" />
        <path d={cintaD(g)} fill="none" stroke={V.volt} strokeWidth={6} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 20px ${rgba(V.volt, 0.7)})` }} />
      </g>
      {/* el piso de los 800 W: la línea contra la que se mide todo lo demás */}
      <line x1={CX0} y1={yOfW(800)} x2={CX1} y2={yOfW(800)} stroke={rgba(V.amber, 0.4)} strokeWidth={2} strokeDasharray="14 12" />
    </svg>
  </AbsoluteFill>
);

// ── LA REJILLA HORARIA: esto SÍ es un gráfico, va en vector ──────────────────────────────────
const Horas: React.FC<{ p: number }> = ({ p }) => {
  const horas = ["18:00", "19:00", "19:30", "20:00", "21:00", "22:00"];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {horas.map((h, i) => {
        const u = [0.06, 0.3, 0.42, 0.54, 0.78, 0.96][i];
        const x = CX0 + u * (CX1 - CX0);
        const on = clamp01(p * 6 - i * 0.5);
        const hot = h === "19:30" || h === "21:00";
        return (
          <div key={h} style={{
            position: "absolute", left: `${((x / 1920) * 100).toFixed(2)}%`, top: "82.5%",
            transform: "translateX(-50%)", opacity: on,
          }}>
            <div style={{ width: 2, height: 22, margin: "0 auto", background: rgba(hot ? V.volt : V.bone, hot ? 0.85 : 0.3) }} />
            <div style={{
              marginTop: 8, fontFamily: F_BODY, fontWeight: 600, fontSize: 24, letterSpacing: 2.4,
              color: rgba(hot ? V.volt : V.bone, hot ? 0.95 : 0.42), textShadow: "0 3px 14px rgba(0,0,0,0.9)",
            }}>{h}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const MovS5A: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const cf = useCurrentFrame();
  const f = gFrame - (START[acto] ?? 0);    // frame LOCAL del acto (robusto a cómo lo monte el Main)
  const toCF = (t: number) => cf - f + t;   // pasa un frame mío al reloj interno de las primitivas

  // LA LUZ, función continua de gFrame: evoluciona, nunca salta entre actos.
  const keyFrom = interpolate(gFrame, [0, A2, A3, A4], [0.2, 0.34, 0.5, 0.66], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cool = interpolate(gFrame, [A1 + 110, A3 + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inten = interpolate(gFrame, [0, A2, A3 + 30, A4, G_END], [0.86, 1.0, 1.18, 0.98, 0.92], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const floorDim = interpolate(gFrame, [0, A3, A4], [0.5, 0.6, 0.7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam = camAt(gFrame);
  const reveal = clamp01((gFrame - 8) / 40);

  return (
    <AbsoluteFill>
      {/* ── LA ATMÓSFERA: se monta UNA vez, mismos parámetros salvo la evolución de la luz ── */}
      <VoltAtmos tint={light(cool, "volt", "sky")} tint2={V.amber} keyFrom={keyFrom} intensity={inten} floor={floorDim} />

      <Layers cam={cam}>
        {/* ═══ ACTO 1 · la cinta sale del display y se estira hacia la derecha ════════════ */}
        {acto === 1 && (() => {
          const relojIn = clamp01((f - 18) / 22);
          const sweep = clamp01((f - 30) / 88);            // las agujas barren la tarde
          const alarm = clamp01((f - 112) / 14);           // 19:30: la cinta empieza a temblar
          return (
            <>
              <Plane z={-580}><PhotoPlane src={M.caraF} kind="photo" z={0} scale={1.3} dim={0.68} tint={V.volt} /></Plane>
              <Plane z={-40}><Cinta g={gFrame} reveal={reveal} /></Plane>
              <Plane z={20}><Horas p={clamp01((f - 26) / 60)} /></Plane>

              {/* EL DISPLAY DE LA PINZA: de acá sale la cinta y de acá salió la cámara */}
              <Plane z={140}>
                <MediaCard src={M.displayV} kind="video" w={368} h={222} x={20} y={52} z={0}
                  ry={13} rx={-3} startFrom={20} lit={1} litColor={V.volt} sheenAt={toCF(12)} radius={9} label="LA PINZA" />
                <IconPng src={M.icPinza} x={7.5} y={40} size={92} z={0} opacity={0.55 * clamp01((f - 24) / 14)} rot={-12} glow={V.ink0} />
              </Plane>

              {/* EL RELOJ DEL GARAJE, colgado arriba a la izquierda, con material REAL adentro */}
              <Plane z={260}>
                <div style={{ opacity: relojIn, transform: `translateY(${lerp(-26, 0, relojIn).toFixed(1)}px)` }}>
                  <MediaCard src={M.relojV} kind="video" w={302} h={196} x={17} y={22} z={0}
                    ry={9} rx={2} startFrom={8} lit={0.92} litColor={V.sky} sheenAt={toCF(34)} radius={9} label="EL RELOJ DEL GARAJE" />
                  {/* el arco que barre la tarde: esto es un gráfico, va en vector */}
                  <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
                    <circle cx={326} cy={238} r={126} fill="none" stroke={rgba(V.volt, 0.8)} strokeWidth={4}
                      strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - sweep * 0.72}
                      transform="rotate(-90 326 238)" style={{ filter: `drop-shadow(0 0 14px ${rgba(V.volt, 0.7)})` }} />
                  </svg>
                </div>
                <Readout value="19:30" label="EMPIEZA" at={toCF(112)} x={17} y={41.5} size={78} color={V.volt} />
              </Plane>

              {/* la lectura que ya venía del display: pegada a la cinta, chiquita y cálida */}
              <Plane z={200}>
                <Readout value="800" unit="W" label="TODA LA CASA, EN PROMEDIO" at={toCF(20)} x={13} y={65} size={96} color={V.amber} />
                {f > 118 && (
                  <div style={{
                    position: "absolute", left: "62%", top: "63%", transform: "translate(-50%,0)",
                    opacity: alarm, textAlign: "center",
                  }}>
                    <Kick color={V.sky}>Y ENTONCES EMPIEZA A TEMBLAR</Kick>
                  </div>
                )}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 2 · la MISMA cinta se despega del piso y trepa ═══════════════════════ */}
        {acto === 2 && (() => {
          const cards: { src: string; kind: "video" | "photo"; u: number; at: number; lab: string; w: number }[] = [
            { src: M.calentadorV, kind: "video", u: 0.62, at: 6, lab: "EL CALENTADOR", w: 320 },
            { src: M.hornoF, kind: "photo", u: 0.46, at: 24, lab: "EL HORNO", w: 258 },
            { src: M.hervidorF, kind: "photo", u: 0.76, at: 40, lab: "EL HERVIDOR", w: 258 },
            { src: M.aireF, kind: "photo", u: 0.34, at: 56, lab: "EL AIRE", w: 240 },
          ];
          return (
            <>
              <Plane z={-600}><PhotoPlane src={M.calentadorF} kind="photo" z={0} scale={1.32} dim={0.72} tint={V.sky} /></Plane>
              <Plane z={-40}><Cinta g={gFrame} reveal={1} /></Plane>
              <Plane z={20}><Horas p={1} /></Plane>

              {/* ⭐ los aparatos que apilan el pico, montados SOBRE la curva: cada uno con su material */}
              <Plane z={160}>
                {cards.map((c, i) => {
                  const ap = clamp01((f - c.at) / 16);
                  if (ap <= 0) return null;
                  const p = ptAt(c.u, gFrame);
                  const yy = ((p.y - 132) / 1080) * 100;
                  return (
                    <MediaCard key={c.lab} src={c.src} kind={c.kind} w={c.w} h={Math.round(c.w * 0.6)}
                      x={(p.x / 1920) * 100} y={eio(yy + 9, yy, ap)} z={lerp(-90, 0, ap)}
                      ry={i % 2 === 0 ? -7 : 7} startFrom={14} lit={0.5 + 0.5 * ap} litColor={V.sky}
                      label={c.lab} sheenAt={toCF(c.at + 12)} radius={8} opacity={ap} />
                  );
                })}
              </Plane>

              {/* las cifras saltan en el ms EXACTO en que la cresta las pasa */}
              <Plane z={280}>
                <Readout value="4.000" unit="W" at={toCF(43)} x={82} y={34} size={100} color={V.sky} />
                <Readout value="4.500" unit="W" at={toCF(79)} x={82} y={21} size={122} color={V.sky} />
                <Readout value="800" unit="W" at={toCF(0)} x={11} y={69} size={62} color={V.amber} />
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 3 · la cresta choca contra el techo: 5.100 clavado ═══════════════════ */}
        {acto === 3 && (() => {
          const shadow = clamp01((f - 10) / 50);
          const clav = clamp01((f - 45) / 12);
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.caraF} kind="photo" z={0} scale={1.38} dim={0.78} tint={V.sky} /></Plane>

              {/* LA SOMBRA DE LA CAJA GRIS contra la pared del fondo: es una sombra, va en vector */}
              <Plane z={-380}>
                <div style={{
                  position: "absolute", left: "70%", top: `${lerp(64, 41, shadow).toFixed(1)}%`,
                  width: lerp(300, 470, shadow), height: lerp(200, 320, shadow),
                  background: `linear-gradient(160deg, ${rgba(V.ink0, 0.86)}, ${rgba(V.ink0, 0.34)})`,
                  filter: "blur(16px)", transform: "skewY(-6deg)", opacity: 0.9 * shadow,
                }} />
                <div style={{
                  position: "absolute", left: "70%", top: `${lerp(64, 41, shadow).toFixed(1)}%`,
                  width: lerp(300, 470, shadow), height: 4,
                  background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.sky, 0.4 * shadow)}, rgba(0,0,0,0))`,
                }} />
              </Plane>

              <Plane z={-40}><Cinta g={gFrame} reveal={1} /></Plane>
              <Plane z={20}><Horas p={1} /></Plane>

              {/* el techo del cuadro: la cresta choca ahí y no puede seguir */}
              <Plane z={120}>
                <div style={{
                  position: "absolute", left: 0, right: 0, top: 236, height: 3,
                  background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.sky, 0.8 * clav)} 22%, ${rgba(V.sky, 0.8 * clav)} 78%, rgba(0,0,0,0))`,
                  boxShadow: `0 0 ${(28 * clav).toFixed(1)}px ${rgba(V.sky, 0.6 * clav)}`,
                }} />
              </Plane>

              {/* la noche que la miró justo: material REAL de su cara contra el display */}
              <Plane z={200}>
                <MediaCard src={M.caraV} kind="video" w={340} h={210} x={17} y={72} z={0}
                  ry={11} rx={-2} startFrom={16} lit={0.95} litColor={V.sky} sheenAt={toCF(18)} radius={9}
                  label="LA NOCHE QUE LA MIRÉ" opacity={clamp01((f - 8) / 14)} />
              </Plane>

              <Plane z={300}>
                <Readout value="5.100" unit="W" label="UNA NOCHE TOCÓ" at={toCF(45)} x={62} y={16} size={150} color={V.sky} />
                <Readout value="800" unit="W" at={toCF(0)} x={11} y={69} size={58} color={V.amber} />
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 4 · la curva se dobla sobre sí misma y se cierra en el DÍA ═══════════ */}
        {acto === 4 && (() => {
          const m = clamp01(f / 46);
          const aro = clamp01((f - 40) / 18);
          const cuna = clamp01((f - 52) / 20);
          const barra = clamp01((f - 60) / 36);
          const fijo = clamp01((f - 130) / 40);
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.pinzaCableF} kind="photo" z={0} scale={1.34} dim={0.8} tint={V.sky} /></Plane>

              <Plane z={0}>
                <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
                  {/* los 1.350 minutos apagados: el aro gris entero */}
                  <circle cx={RCX} cy={RCY} r={RR} fill="none" stroke={rgba(V.concrete, 0.3 * aro)} strokeWidth={RTH} />
                  <circle cx={RCX} cy={RCY} r={RR} fill="none" stroke={rgba(V.bone, 0.1 * aro)} strokeWidth={1.5} />
                  {/* las 24 marcas de hora: es un instrumento, va en vector */}
                  {Array.from({ length: 24 }, (_, i) => {
                    const a = polar(i * 15, RR + RTH / 2 + 8), b = polar(i * 15, RR + RTH / 2 + (i % 6 === 0 ? 26 : 15));
                    return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
                      stroke={rgba(V.bone, (i % 6 === 0 ? 0.44 : 0.2) * aro)} strokeWidth={i % 6 === 0 ? 3 : 2} />;
                  })}
                  {/* LOS 90 MINUTOS DEL PICO: la cuña voltio encendida (19:30 → 21:00) */}
                  <path d={sector(292.5, 315, RR - RTH / 2, RR + RTH / 2)} fill={rgba(V.volt, 0.9 * cuna)}
                    style={{ filter: `drop-shadow(0 0 ${(30 * cuna).toFixed(1)}px ${rgba(V.volt, 0.75 * cuna)})` }} />
                  {/* LA CURVA, plegándose: sigue estando ahí después del morph, como el filo del aro */}
                  <path d={morphD(m, gFrame)} fill="none"
                    stroke={rgba(V.volt, lerp(0.95, 0.42, aro))} strokeWidth={lerp(6, 3, aro)} strokeLinecap="round"
                    style={{ filter: `drop-shadow(0 0 ${lerp(22, 10, aro).toFixed(1)}px ${rgba(V.volt, 0.6)})` }} />
                </svg>
              </Plane>

              {/* EL DÍA ENTERO, en el centro del aro */}
              <Plane z={90}>
                <div style={{
                  position: "absolute", left: "50%", top: "44%", transform: "translate(-50%,-50%)", textAlign: "center",
                  opacity: clamp01((f - 50) / 16),
                }}>
                  <Num size={136} color={V.bone}>1.440</Num>
                  <div style={{ marginTop: 10 }}><Kick color={rgba(V.bone, 0.6)}>MINUTOS AL DÍA</Kick></div>
                </div>
                <IconPng src={M.icReloj} x={50} y={57} size={86} z={0} opacity={0.4 * clamp01((f - 62) / 18)} glow={V.ink0} />
              </Plane>

              {/* LA POTENCIA CONTRATADA: baja desde ARRIBA y en FRÍO, y cruza el aro ENTERO */}
              <Plane z={220}>
                <div style={{
                  position: "absolute", left: "50%", top: `${lerp(-14, 64.8, eio(0, 1, barra)).toFixed(2)}%`,
                  width: 812, marginLeft: -406, height: 16,
                  background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.sky, 0.95)} 8%, ${rgba(V.sky, 0.95)} 92%, rgba(0,0,0,0))`,
                  boxShadow: `0 0 34px ${rgba(V.sky, 0.7)}`,
                }} />
                <div style={{
                  position: "absolute", left: "50%", top: `${lerp(-19, 59.6, eio(0, 1, barra)).toFixed(2)}%`,
                  transform: "translateX(-50%)", textAlign: "center", opacity: barra,
                }}>
                  <Kick color={V.sky}>POTENCIA CONTRATADA</Kick>
                </div>
                <Readout value="5,75" unit="kW" at={toCF(96)} x={50} y={71.5} size={104} color={V.sky} />
              </Plane>

              {/* las dos cifras del reparto: 90 encendidos contra 1.350 apagados */}
              <Plane z={280}>
                <Readout value="90" label="MINUTOS DE PICO" at={toCF(104)} x={26.5} y={23} size={126} color={V.volt} />
                <Readout value="1.350" label="MINUTOS CASI APAGADO" at={toCF(126)} x={77} y={53} size={104} color={rgba(V.bone, 0.7)} />
              </Plane>

              {/* ⭐ EL MATERIAL REAL: la factura con la línea de potencia marcada a lápiz */}
              <Plane z={340}>
                <MediaCard src={M.facturaF} kind="photo" w={356} h={222} x={15} y={76} z={0}
                  ry={14} rx={-3} lit={1} litColor={V.sky} sheenAt={toCF(20)} radius={9}
                  label="LA LÍNEA DE POTENCIA" opacity={clamp01((f - 14) / 16)} />
                <MediaCard src={M.cenitalV} kind="video" w={318} h={198} x={85.5} y={22} z={0}
                  ry={-13} rx={2} startFrom={22} lit={0.92} litColor={V.amber} sheenAt={toCF(70)} radius={9}
                  label="TODOS LOS MESES" opacity={clamp01((f - 64) / 16)} />
              </Plane>

              {/* LA CINTA DEL FIJO MENSUAL corriendo por el borde de abajo */}
              <Plane z={400}>
                <div style={{
                  position: "absolute", left: 0, right: 0, bottom: 26, height: 54,
                  transform: `translateX(${lerp(-104, 0, eio(0, 1, fijo)).toFixed(1)}%)`,
                  background: `linear-gradient(90deg, ${rgba(V.ink1, 0.94)}, ${rgba(V.ink2, 0.9)})`,
                  borderTop: `2px solid ${rgba(V.amber, 0.55)}`,
                  boxShadow: `0 -14px 40px ${rgba(V.ink0, 0.8)}`,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 26,
                  overflow: "hidden",
                }}>
                  {Array.from({ length: 9 }, (_, i) => (
                    <div key={i} style={{
                      fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 4.6,
                      color: rgba(V.amber, 0.42 + rnd(i * 2.9) * 0.3), whiteSpace: "nowrap",
                    }}>CARGO FIJO · SE PAGA IGUAL</div>
                  ))}
                </div>
              </Plane>
            </>
          );
        })()}
      </Layers>
    </AbsoluteFill>
  );
};
