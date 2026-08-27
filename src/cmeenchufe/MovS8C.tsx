// MovS8C.tsx — MOVIMIENTO S8C · "LAS NEGACIONES"
// Video `cmeenchufe` (Claudio Mendoza Constructor, ES). 3 actos · 1.202.190 → 1.223.730 ms · 646 frames @30.
//
// LA IDEA: lo que la caja NO hace. No te independiza de la compañía. Con tarifa plana te hace pagar
// el 12 % de Y y nada más. Y no mueve un aire central: 8 kilovatios hora se van rapidísimo.
// Tres negaciones, tres objetos que se niegan a sí mismos: una línea SIN escalón, una lasca
// ridícula al lado del bloque del que salió, y un depósito que no baja — se desploma.
//
// EL OBJETO QUE ATRAVIESA LAS DOS FRONTERAS: **LA LÍNEA**.
//   acto 1 → la línea de tendido del poste baja y ya es la línea de precio de una tarifa plana;
//   acto 2 → esa misma línea se pliega sobre sí misma y se levanta como el bloque macizo Y;
//   acto 3 → la cámara sale por la boca de la turbina y la línea reaparece como el NIVEL del
//            depósito de 8 kWh — la única línea del movimiento que sí se mueve, y se desploma.
//
// UNA cámara: `camAt(gFrame)` — hereda de S8B (z +150, grúa +22) y sigue: BARRE la línea plana de
// izquierda a derecha buscando un escalón, no lo encuentra, llega al borde y SIGUE DE LARGO (el pan
// no se frena en el borde del cuadro); después rodea el bloque y se mete en la boca de la turbina.
// Le entrega a S8D la posición: z0 de S8D = +560 (el z1 de acá).
// UNA atmósfera: `<VoltAtmos/>` montada una sola vez, fuera del switch de actos.
// LA LUZ (tramo 3 de 5): entra en SKY frío desde arriba —esto sigue siendo la compañía— y a partir
// del acto 3, cuando la escena se muda al patio del condensador, empieza a templarse hacia el ámbar
// de la tarde que S8D va a recibir ya hecho.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · g0-96 · "SI TU TARIFA ES PLANA"             material: CLIP línea plana + FOTO otra factura + FOTO dorso un precio
//   entra  cam {z +150, grúa +22, arriba en el tendido}     luz {SKY frío desde arriba, key 0.56}
//   sale   cam {pan +260 a la derecha, pasado el borde}     luz {SKY, key 0.58}
//   ── FRONTERA A ···· MORPH: la línea plana se pliega y se levanta como el bloque Y. ········
// ACTO 2 · g159-282 · "EL 12 % DE Y"                   material: FOTO factura de 111 + FOTO palma sobre la caja
//   entra  cam {pan +260, rodeando el bloque que sube}      luz {SKY, key 0.6, contra ámbar por abajo}
//   sale   cam {METIDA en la boca de la turbina, push ×3.2} luz {empieza a templarse}
//   ── FRONTERA B ···· ZOOM-THROUGH: entra en la turbina y sale en el patio del condensador. ·
// ACTO 3 · g517-646 · "8 kWh CON UN AIRE GRANDE"       material: CLIP condensador + FOTO rueditas + CLIP rejilla central
//   entra  cam {saliendo del push 3.05 → 1, grúa +120}      luz {SKY 60 % / ámbar 40 %, key 0.64}
//   sale   cam {grúa −40, cayendo detrás del nivel}         luz {ámbar de tarde — se la entrega a S8D}
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero fade entre actos · cero texto de otro video.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rnd, rgba,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng, Readout,
  Kick, Head,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO (frames desde el arranque del MOVIMIENTO, 30 fps) ────────────────
const A1 = 0, A2 = 159, A3 = 517;
const G_END = 646;
const START: Record<number, number> = { 1: A1, 2: A2, 3: A3 };

const pc = (px: number) => (px / 1080) * 100;

// ── EL MATERIAL REAL (todas verificadas en disco) ────────────────────────────────────────────
const M = {
  posteF: "img/cmeenchufe/cmee_s8_espalda_poste.png",
  planaV: "broll/cmeenchufe/cmee_s9_linea_plana.mp4",
  otraF: "img/cmeenchufe/cmee_s4_otra_factura_formato.png",
  dorsoF: "img/cmeenchufe/cmee_s8_dedo_dorso_un_precio.png",
  factura111F: "img/cmeenchufe/cmee_s1_factura_abre.png",
  palmaF: "img/cmeenchufe/cmee_s2_palma_sobre_caja.png",
  condensadorV: "broll/cmeenchufe/cmee_s8_aire_central_condensador.mp4",
  rejillaV: "broll/cmeenchufe/cmee_s8_rejilla_central_quieta.mp4",
  rueditasF: "img/cmeenchufe/cmee_s3_rueditas_concreto.png",
  icRegla: "img/cmeenchufe/cmee_ic_regla.png",
  icLupa: "img/cmeenchufe/cmee_ic_lupa.png",
  icCalentador: "img/cmeenchufe/cmee_ic_calentador.png",
};

// ── LA CÁMARA · hereda de S8B, barre la línea y no se frena en el borde ─────────────────────
const camAt = (g: number) => {
  const base = gcam(g, { z0: 150, z1: 560, panX: 260, panY: -18, ry: -5.4, rx: 1.8, dur: G_END });
  // LA GRÚA: baja con la línea de tendido, sube rodeando el bloque, y cae detrás del nivel.
  const crane = interpolate(
    g,
    [0, A1 + 70, A2, A2 + 80, A3, A3 + 70, G_END],
    [22, 96, 96, 34, 120, 40, -40],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  // EL ZOOM-THROUGH del acto 2→3: entramos por la BOCA DE LA TURBINA (x 76% / y 28%).
  const push = interpolate(g, [A2 + 84, A2 + 123, A3, A3 + 34], [1, 3.2, 3.05, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.55, 0, 0.35, 1),
  });
  const tx = (50 - 76) * (push - 1);
  const ty = (50 - 28) * (push - 1);
  return (
    `${base.transform} translateY(${crane.toFixed(1)}px) ` +
    `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${push.toFixed(3)})`
  );
};

// ── LA HOJA VOLTIO que rebana · esto SÍ es una herramienta, va en vector ─────────────────────
const Hoja: React.FC<{ y: number; p: number; w?: number }> = ({ y, p, w = 1560 }) => (
  <div style={{
    position: "absolute", left: "50%", top: y, width: w, height: 3, marginLeft: -w / 2,
    transformOrigin: "left center", transform: `scaleX(${clamp01(p).toFixed(3)})`,
    background: `linear-gradient(90deg, ${rgba(V.volt, 0)} 0%, ${rgba(V.volt, 0.95)} 8%, ${rgba(V.volt, 0.95)} 92%, ${rgba(V.volt, 0)} 100%)`,
    boxShadow: `0 0 26px ${rgba(V.volt, 0.75)}`,
  }} />
);

export const MovS8C: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const cf = useCurrentFrame();
  const f = gFrame - (START[acto] ?? 0);
  const toCF = (t: number) => cf - f + t;

  // LA LUZ, función continua de gFrame: sky frío heredado de S8B que empieza a templarse en el acto 3.
  const keyFrom = interpolate(gFrame, [0, A2, A3, G_END], [0.56, 0.6, 0.64, 0.68], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const warm = interpolate(gFrame, [A2 + 90, A3 + 60, G_END], [0, 0.4, 0.58], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inten = interpolate(gFrame, [0, A2, A3, G_END], [0.8, 0.96, 1.08, 1.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const floorDim = interpolate(gFrame, [0, A2, A3], [0.72, 0.6, 0.56], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam = camAt(gFrame);

  return (
    <AbsoluteFill>
      {/* ── LA ATMÓSFERA: se monta UNA vez, sólo evoluciona la luz ────────────────────────── */}
      <VoltAtmos tint={light(warm, "sky", "volt")} tint2={light(clamp01(warm * 1.7), "sky", "amber")}
        keyFrom={keyFrom} intensity={inten} floor={floorDim} />

      <Layers cam={cam}>
        {/* ═══ ACTO 1 · la línea del poste es la línea de una tarifa PLANA ═══════════════ */}
        {acto === 1 && (() => {
          const baja = clamp01(f / 34);                 // la línea de tendido baja hasta el borde
          const busca = clamp01((f - 26) / 56);         // la cámara la recorre buscando un escalón
          const pliegue = clamp01((f - 74) / 30);       // EMPIEZA a plegarse (frontera A)
          const yLinea = eio(214, 792, baja);
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.posteF} kind="photo" z={0} scale={1.3} dim={0.76} tint={V.sky} /></Plane>
              {/* LA LÍNEA: baja del tendido y queda perfectamente horizontal, sin un solo escalón */}
              <Plane z={-40}>
                <div style={{
                  position: "absolute", left: -80, top: yLinea, width: 2080, height: 7,
                  transform: `perspective(1400px) rotateX(${(pliegue * 62).toFixed(2)}deg)`,
                  transformOrigin: "50% 100%",
                  background: `linear-gradient(90deg, ${rgba(V.sky, 0.4)} 0%, ${rgba(V.sky, 0.95)} 12%, ${rgba(V.sky, 0.95)} 88%, ${rgba(V.sky, 0.4)} 100%)`,
                  boxShadow: `0 0 30px ${rgba(V.sky, 0.6)}, 0 16px 40px ${rgba(V.ink0, 0.8)}`,
                }} />
                {/* la sombra de la línea sobre el piso: le da altura, no es un trazo pegado al fondo */}
                <div style={{
                  position: "absolute", left: -80, top: yLinea + 74, width: 2080, height: 22,
                  background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.ink0, 0.7)} 20%, ${rgba(V.ink0, 0.7)} 80%, rgba(0,0,0,0))`,
                  filter: "blur(11px)",
                }} />
                {/* la lupa que la recorre buscando el escalón que no está */}
                <IconPng src={M.icLupa} x={lerp(12, 90, eio(0, 1, busca))} y={pc(yLinea - 92)} size={98} z={0}
                  opacity={0.8 * clamp01(busca * 3)} glow={V.ink0} />
              </Plane>
              {/* LAS DOS FACTURAS: sus franjas horarias marcan casi el mismo número */}
              <Plane z={180}>
                <MediaCard src={M.otraF} kind="photo" w={362} h={226} x={27} y={82} z={0} ry={12}
                  lit={0.86} litColor={V.sky} label="MISMO PRECIO" sheenAt={toCF(18)} radius={8} />
                <MediaCard src={M.dorsoF} kind="photo" w={362} h={226} x={73} y={82} z={0} ry={-12}
                  lit={0.86} litColor={V.sky} label="TODO EL DÍA" sheenAt={toCF(34)} radius={8} />
                <MediaCard src={M.planaV} kind="video" w={330} h={206} x={50} y={22} z={80}
                  startFrom={16} ry={0} lit={1} litColor={V.sky} sheenAt={toCF(10)} radius={8} />
              </Plane>
              <Plane z={280}>
                <div style={{ position: "absolute", left: "50%", top: "56%", transform: "translate(-50%,0)", textAlign: "center", opacity: clamp01((f - 20) / 14) }}>
                  <Head size={72} color={V.bone}>TARIFA PLANA</Head>
                  <div style={{ marginTop: 12 }}><Kick color={rgba(V.sky, 0.9)}>NO HAY ESCALÓN DEL QUE CAER</Kick></div>
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 2 · el bloque Y y la lasca ridícula del 12 % ════════════════════════ */}
        {acto === 2 && (() => {
          const sube = clamp01(f / 34);                 // el pliegue termina de levantarse como bloque
          const corte = clamp01((f - 38) / 26);         // la hoja voltio rebana la lasca
          const aparta = clamp01((f - 60) / 36);        // la lasca se aparta y queda sola en el centro
          const apaga = clamp01((f - 72) / 40);         // el bloque se apaga al fondo, pero NO desaparece
          const H = eio(7, 700, sube);
          const topY = 812 - H;
          return (
            <>
              <Plane z={-640}><PhotoPlane src={M.posteF} kind="photo" z={0} scale={1.34} dim={0.84} tint={V.sky} /></Plane>
              {/* EL BLOQUE MACIZO Y: la línea plegada sobre sí misma, de pie */}
              <Plane z={-60}>
                <div style={{
                  position: "absolute", left: "36%", top: topY, width: 700, height: H, marginLeft: -350,
                  background: `linear-gradient(180deg, ${rgba(V.concrete, 0.3 * (1 - apaga * 0.7))} 0%, ${rgba(V.ink2, 0.97)} 16%, ${rgba(V.ink1, 1)} 100%)`,
                  borderTop: `4px solid ${rgba(V.sky, 0.86 * (1 - apaga * 0.7))}`,
                  boxShadow: `0 34px 80px ${rgba(V.ink0, 0.88)}, inset -26px 0 50px ${rgba(V.ink0, 0.8)}`,
                  filter: apaga > 0 ? `brightness(${(1 - apaga * 0.62).toFixed(3)})` : undefined,
                }}>
                  {/* el canto: el bloque tiene ESPESOR */}
                  <div style={{
                    position: "absolute", right: -30, top: 8, width: 30, height: Math.max(0, H - 8),
                    background: `linear-gradient(180deg, ${rgba(V.sky, 0.14)}, ${rgba(V.ink0, 0.99)})`,
                    transform: "skewY(-8deg)", transformOrigin: "left top",
                  }} />
                  <div style={{
                    position: "absolute", left: 0, right: 0, top: 40, textAlign: "center",
                    fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 128, color: rgba(V.bone, 0.5 * (1 - apaga * 0.8)),
                  }}>Y</div>
                </div>
              </Plane>
              {/* LA TARJETA EN LA CARA DEL BLOQUE: la FOTO REAL de la factura de 111 */}
              <Plane z={60}>
                <MediaCard src={M.factura111F} kind="photo" w={430} h={266} x={36} y={pc(topY + 330)} z={0}
                  ry={-4} lit={0.9 * (1 - apaga * 0.66)} litColor={V.sky} label="LA FACTURA ENTERA"
                  sheenAt={toCF(24)} radius={8} opacity={sube} />
                <Hoja y={topY + 30} p={corte} w={860} />
              </Plane>
              {/* LA LASCA: apenas un 12 % del grosor, sola en el centro, iluminada DESDE ABAJO */}
              <Plane z={240}>
                <div style={{
                  position: "absolute", left: `${lerp(36, 74, eio(0, 1, aparta)).toFixed(2)}%`,
                  top: eio(topY + 12, 616, aparta), width: eio(700, 384, aparta), height: 34, marginLeft: -eio(350, 192, aparta),
                  transform: `rotate(${eio(0, -3, aparta).toFixed(2)}deg)`,
                  background: `linear-gradient(0deg, ${rgba(V.volt, 0.6)} 0%, ${rgba(V.ink1, 0.98)} 74%)`,
                  borderBottom: `3px solid ${rgba(V.volt, 0.95)}`,
                  boxShadow: `0 -14px 44px ${rgba(V.volt, 0.3)}, 0 22px 46px ${rgba(V.ink0, 0.88)}`,
                  opacity: corte,
                }} />
                {/* el 12 % se escribe ENCIMA DE LA LASCA, nunca sobre el bloque */}
                <div style={{
                  position: "absolute", left: `${lerp(36, 74, eio(0, 1, aparta)).toFixed(2)}%`,
                  top: eio(topY - 76, 528, aparta), transform: "translateX(-50%)", opacity: corte,
                  fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 96, letterSpacing: 1.2, color: V.volt,
                  textShadow: `0 0 40px ${rgba(V.volt, 0.5)}, 0 6px 26px rgba(0,0,0,0.94)`,
                }}>12 %</div>
                <MediaCard src={M.palmaF} kind="photo" w={330} h={206} x={74} y={pc(792)} z={0} ry={-9}
                  lit={1} litColor={V.volt} label="ESO ES LO QUE TE DA" sheenAt={toCF(66)} radius={8}
                  opacity={aparta} />
                <IconPng src={M.icRegla} x={74} y={pc(430)} size={92} z={0} opacity={0.62 * aparta} glow={V.ink0} />
              </Plane>
              {/* LA BOCA DE LA TURBINA arriba a la derecha: por acá se va la cámara en la frontera B */}
              <Plane z={200}>
                <MediaCard src={M.condensadorV} kind="video" w={300} h={300} x={76} y={28} z={80}
                  startFrom={10} ry={-6} lit={0.86} litColor={V.sky} radius={150} sheenAt={toCF(84)}
                  opacity={clamp01((f - 66) / 22)} />
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 3 · el depósito de 8 kWh no baja: SE DESPLOMA ═══════════════════════ */}
        {acto === 3 && (() => {
          const out = clamp01(f / 24);                  // salimos del push, ya en el patio
          const arranca = clamp01((f - 44) / 8);        // el aire arranca: golpe seco
          const caida = clamp01((f - 48) / 30);         // el nivel se desploma
          const nivel = lerp(1, 0.06, eio(0, 1, caida));
          const spin = (f * 13) % 360;
          const H = 520, TOP = 300;
          return (
            <>
              <Plane z={-660}><PhotoPlane src={M.rejillaV} kind="video" startFrom={18} z={0} scale={1.36} dim={0.8} tint={V.amber} /></Plane>
              {/* EL DEPÓSITO DE 8 kWh: un tanque de chapa con el nivel de luz voltio adentro */}
              <Plane z={0}>
                <div style={{
                  position: "absolute", left: "34%", top: TOP, width: 480, height: H, marginLeft: -240,
                  transform: `scale(${eio(0.86, 1, out).toFixed(3)})`, transformOrigin: "50% 100%",
                  background: `linear-gradient(100deg, ${rgba(V.concrete, 0.24)}, ${rgba(V.ink1, 0.99)} 46%, ${rgba(V.ink0, 1)})`,
                  border: `3px solid ${rgba(V.concrete, 0.6)}`,
                  boxShadow: `0 40px 90px ${rgba(V.ink0, 0.9)}, inset 0 0 70px ${rgba(V.ink0, 0.8)}`,
                  overflow: "hidden",
                }}>
                  {/* el contenido: 8 kWh de luz voltio que NO baja — se desploma */}
                  <div style={{
                    position: "absolute", left: 0, right: 0, bottom: 0, height: `${(nivel * 100).toFixed(1)}%`,
                    background: `linear-gradient(180deg, ${rgba(V.volt, 0.9)} 0%, ${rgba(V.volt, 0.42)} 60%, ${rgba(V.voltSoft, 0.32)} 100%)`,
                    boxShadow: `0 -10px 44px ${rgba(V.volt, 0.6)}`,
                  }} />
                  {/* el fondo vacío queda A LA VISTA antes de que la cámara alcance a bajar */}
                  <div style={{
                    position: "absolute", left: 0, right: 0, top: 0, height: `${((1 - nivel) * 100).toFixed(1)}%`,
                    background: `linear-gradient(180deg, ${rgba(V.ink0, 0.98)}, ${rgba(V.ink1, 0.86)})`,
                    boxShadow: `inset 0 -16px 30px ${rgba(V.ink0, 0.9)}`,
                  }} />
                  {/* las marcas del tanque: instrumento, va en vector */}
                  {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} style={{
                      position: "absolute", right: 12, top: (H / 8) * i + 10, width: 34 + (i % 2) * 20, height: 2,
                      background: rgba(V.bone, 0.28),
                    }} />
                  ))}
                </div>
              </Plane>
              {/* LA MANGUERA GRUESA que sube del depósito al condensador (es un caño: vector) */}
              <Plane z={80}>
                <AbsoluteFill>
                  <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
                    <path d="M 780 340 C 1040 296 1180 340 1352 268" fill="none" stroke={rgba(V.concrete, 0.7)}
                      strokeWidth={34} strokeLinecap="round" />
                    <path d="M 780 340 C 1040 296 1180 340 1352 268" fill="none" stroke={rgba(V.ink0, 0.55)}
                      strokeWidth={12} strokeLinecap="round" strokeDasharray="18 26"
                      strokeDashoffset={-(f * 5) % 44} />
                  </svg>
                </AbsoluteFill>
              </Plane>
              {/* LA TARJETA CON LA FOTO REAL DE LA CAJA GRIS, apoyada contra el costado del depósito */}
              <Plane z={200}>
                <MediaCard src={M.rueditasF} kind="photo" w={340} h={212} x={20} y={78} z={0} ry={13}
                  lit={0.94} litColor={V.volt} label="8 kWh" sheenAt={toCF(20)} radius={8} />
                {/* EL CONDENSADOR arriba a la derecha, girando: la cámara salió de acá */}
                <MediaCard src={M.condensadorV} kind="video" w={392} h={392} x={74} y={24} z={60}
                  startFrom={14} ry={-8} lit={0.7 + 0.3 * arranca} litColor={V.amber} radius={196} sheenAt={toCF(46)} />
                <AbsoluteFill style={{ pointerEvents: "none" }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} style={{
                      position: "absolute", left: "74%", top: "24%", width: 176, height: 26, marginLeft: -6, marginTop: -13,
                      borderRadius: 13, transformOrigin: "6px 50%",
                      transform: `rotate(${(spin + i * 72).toFixed(1)}deg)`,
                      background: `linear-gradient(90deg, ${rgba(V.blade, 0.24)}, rgba(0,0,0,0))`,
                      opacity: 0.34 + 0.3 * arranca,
                    }} />
                  ))}
                </AbsoluteFill>
                <IconPng src={M.icCalentador} x={92} y={pc(560)} size={92} z={0} opacity={0.55 + 0.35 * arranca} glow={V.ink0} />
              </Plane>
              <Plane z={300}>
                <Readout value="8" unit="kWh" label="SE VAN RAPIDÍSIMO" at={toCF(12)} x={34} y={16} size={128} color={V.volt} />
                <div style={{ position: "absolute", left: "50%", top: "88%", transform: "translate(-50%,0)", opacity: clamp01((f - 54) / 12) }}>
                  <Kick color={rgba(V.bone, 0.86)}>UN AIRE GRANDE SE LOS COME</Kick>
                </div>
                {/* el polvo que el arranque levanta del piso del patio */}
                {arranca > 0.2 && Array.from({ length: 9 }, (_, i) => (
                  <div key={i} style={{
                    position: "absolute", left: `${(22 + rnd(i * 3.3) * 46).toFixed(1)}%`,
                    top: `${(80 - caida * 10 - rnd(i * 7.1) * 8).toFixed(1)}%`,
                    width: 120 + rnd(i * 2.2) * 160, height: 120 + rnd(i * 2.2) * 160, borderRadius: "50%",
                    background: `radial-gradient(circle, ${rgba(V.concrete, 0.18 * (1 - caida))}, rgba(0,0,0,0) 70%)`,
                    filter: "blur(12px)",
                  }} />
                ))}
                <div style={{
                  position: "absolute", left: "34%", top: `${pc(TOP + H * (1 - nivel)).toFixed(2)}%`,
                  transform: "translate(-50%,-50%)", opacity: 0.9,
                  fontFamily: F_BODY, fontWeight: 600, fontSize: 30, letterSpacing: 3.2, color: rgba(V.volt, 0.86),
                }}>{`${(nivel * 8).toFixed(1)} kWh`}</div>
              </Plane>
            </>
          );
        })()}
      </Layers>
    </AbsoluteFill>
  );
};
