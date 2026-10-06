// MovS8E.tsx — MOVIMIENTO S8E · "LA CUENTA"
// Video `cmeenchufe` (Claudio Mendoza Constructor, ES). 5 actos · 1.251.610 → 1.305.810 ms · 1626 frames @30.
//
// LA IDEA: 1.680 dividido 67 de ahorro por mes da 25 meses. Con 6.000 ciclos de garantía, la caja
// sigue trabajando otros 14 años DESPUÉS de haberse pagado. Y si no tenés 1.680, existe la hermana
// chica de menos de 300, que hace lo mismo con menos capacidad y se paga en 14 meses: más rápido
// que la grande. Ninguna cifra se escribe por decreto: la escribe la ALTURA de una pila, la
// LONGITUD de una vía y el ORDEN DE LLEGADA de dos barras.
//
// EL OBJETO QUE ATRAVIESA LAS CUATRO FRONTERAS: **EL RENGLÓN** (la línea de la etiqueta).
//   acto 1 → es la mordida de la sierra que rebana el ladrillo de 1.680 en tajadas de 67;
//   acto 2 → la cámara sale del renglón de la etiqueta y ese renglón ES la vía de 6.000 ciclos;
//   acto 3 → la vía se apoya y es el PISO del garaje donde las dos cajas quedan de perfil;
//   acto 4 → la sombra larga de la caja chica se estira por ese piso y se abre en cuatro hilos;
//   acto 5 → los cuatro hilos se juntan otra vez en uno solo: la LÍNEA DE LARGADA de los carriles.
//
// UNA cámara: `camAt(gFrame)` — hereda de S8D (z +240, grúa +86, todavía basculada) y BAJA al piso
// del garaje a lo largo del movimiento, hasta quedar a ras del asfalto en la carrera final. Nunca
// vuelve a cero: es el último tramo del viaje que arrancó en S8A.
// UNA atmósfera: `<VoltAtmos/>` montada una sola vez, fuera del switch de actos.
// LA LUZ (tramo 5 de 5, el final del arco): ÁMBAR DE COSTADO con el polvo del garaje suspendido en
// el haz → baja un punto en el acto 2 (ya es media tarde) → entra RASANTE por la ventana en el acto
// 3 y alarga las sombras → cae a NOCHE AZUL en el acto 4 (la casa dormida, sólo cuatro cosas
// encendidas) → y vuelve a subir ÁMBAR sobre la línea de meta del acto 5.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · g0-186 · "1.680 ÷ 67 = 25 MESES"           material: CLIP calculadora + FOTO palma sobre la caja + FOTO calendario 25 hojas
//   entra  cam {z +240, grúa +86, sobre la tecla}       luz {ÁMBAR de costado, key 0.84, polvo en el haz}
//   sale   cam {METIDA en el renglón de la etiqueta, ×3.1} luz {ÁMBAR, key 0.86}
//   ── FRONTERA A ···· ZOOM-THROUGH: entra en el renglón y sale montada sobre la vía. ········
// ACTO 2 · g484-583 · "OTROS 14 AÑOS"                  material: CLIP etiqueta de ciclos + FOTO pago en el mostrador
//   entra  cam {saliendo del push 3.0 → 1, grúa +30}    luz {ÁMBAR un punto abajo: media tarde}
//   sale   cam {grúa −20, siguiendo al punto que no frena} luz {ÁMBAR bajo}
//   ── FRONTERA B ···· MORPH: la vía se apoya y ya es el piso del garaje. ····················
// ACTO 3 · g990-1119 · "LO MISMO CON MENOS"            material: FOTO rueditas + FOTO caja chica al lado
//   entra  cam {grúa −190, a ras del piso}              luz {ÁMBAR RASANTE de la ventana, sombras largas}
//   sale   cam {grúa −210, en la punta de las sombras}  luz {ÁMBAR rasante}
//   ── FRONTERA C ···· LA SOMBRA que ya estaba en el cuadro se estira y se abre en cuatro. ···
// ACTO 4 · g1120-1228 · "REFRI · INTERNET · LUCES · CARGADORES"  material: 4 FOTOS reales de la casa
//   entra  cam {grúa −150, siguiendo la sombra}         luz {cae a NOCHE AZUL, sky, int 0.62}
//   sale   cam {grúa −96, la franja cara a oscuras}     luz {noche azul con cuatro puntos ámbar}
//   ── FRONTERA D ···· LOS CUATRO HILOS se juntan en uno: la línea de largada. ···············
// ACTO 5 · g1527-1626 · "14 MESES, MÁS RÁPIDO"         material: CLIP display de la pinza + FOTO rueditas + FOTO caja chica en la camioneta
//   entra  cam {grúa −60, a ras de los carriles}        luz {ÁMBAR vuelve de costado y toma la meta}
//   sale   cam {grúa −30, la grande sigue andando detrás} luz {ÁMBAR pleno: fin del arco de la sección}
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
const A1 = 0, A2 = 484, A3 = 990, A4 = 1120, A5 = 1527;
const G_END = 1626;
const START: Record<number, number> = { 1: A1, 2: A2, 3: A3, 4: A4, 5: A5 };

const pc = (px: number) => (px / 1080) * 100;

// ── EL MATERIAL REAL (todas verificadas en disco) ────────────────────────────────────────────
const M = {
  calculadoraV: "broll/cmeenchufe/cmee_s8_calculadora_golpe.mp4",
  palmaF: "img/cmeenchufe/cmee_s2_palma_sobre_caja.png",
  calendarioF: "img/cmeenchufe/cmee_s8_calendario_25_hojas.png",
  etiquetaV: "broll/cmeenchufe/cmee_s8_etiqueta_ciclos_dedo.mp4",
  pagoF: "img/cmeenchufe/cmee_s8_pago_mostrador.png",
  grandeF: "img/cmeenchufe/cmee_s3_rueditas_concreto.png",
  chicaF: "img/cmeenchufe/cmee_s8_caja_chica_al_lado.png",
  chicaCamionetaF: "img/cmeenchufe/cmee_s8_caja_chica_camioneta.png",
  refriF: "img/cmeenchufe/cmee_s8_refri_noche.png",
  routerF: "img/cmeenchufe/cmee_s8_router_luces.png",
  pasilloF: "img/cmeenchufe/cmee_s9_pasillo_todo_prendido.png",
  cargadoresF: "img/cmeenchufe/cmee_s8_cargadores_regleta.png",
  displayV: "broll/cmeenchufe/cmee_s5_display_800.mp4",
  icCalendario: "img/cmeenchufe/cmee_ic_calendario.png",
  icCalculadora: "img/cmeenchufe/cmee_ic_calculadora.png",
  icBateria: "img/cmeenchufe/cmee_ic_bateria.png",
  icReloj: "img/cmeenchufe/cmee_ic_reloj.png",
  icCaja: "img/cmeenchufe/cmee_ic_caja.png",
};

// ── LA CÁMARA · hereda de S8D y BAJA al piso, hasta quedar a ras en la carrera final ────────
const camAt = (g: number) => {
  const base = gcam(g, { z0: 240, z1: 640, panX: 128, panY: -52, ry: -5.8, rx: 2.6, dur: G_END });
  const crane = interpolate(
    g,
    [0, A1 + 120, A2, A2 + 80, A3, A3 + 80, A4, A4 + 90, A5, G_END],
    [86, 30, 30, -20, -190, -210, -150, -96, -60, -30],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  // EL ZOOM-THROUGH del acto 1→2: entramos en EL RENGLÓN de la etiqueta (x 70% / y 30%).
  const push = interpolate(g, [A1 + 128, A1 + 186, A2, A2 + 34], [1, 3.1, 3.0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.55, 0, 0.35, 1),
  });
  const tx = (50 - 70) * (push - 1);
  const ty = (50 - 30) * (push - 1);
  return (
    `${base.transform} translateY(${crane.toFixed(1)}px) ` +
    `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${push.toFixed(3)})`
  );
};

// ── LA TAJADA DE 67 · el mes. Objeto con canto, no tarjeta con texto. ───────────────────────
const Mes: React.FC<{ x: number; top: number; w: number; h: number; tint: string; hoja: number }> = ({
  x, top, w, h, tint, hoja,
}) => (
  <div style={{ position: "absolute", left: `${x}%`, top, width: w, height: h, marginLeft: -w / 2 }}>
    <div style={{
      position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
      background: `linear-gradient(178deg, ${rgba(tint, 0.34)} 0%, ${rgba(V.ink2, 0.96)} 34%, ${rgba(V.ink1, 1)} 100%)`,
      borderTop: `2px solid ${rgba(tint, 0.9)}`,
      boxShadow: `0 6px 16px ${rgba(V.ink0, 0.8)}`,
    }} />
    <div style={{
      position: "absolute", right: -9, top: 3, width: 9, height: Math.max(0, h - 3),
      background: `linear-gradient(180deg, ${rgba(tint, 0.16)}, ${rgba(V.ink0, 0.98)})`,
      transform: "skewY(-9deg)", transformOrigin: "left top",
    }} />
    {/* la hoja chiquita de calendario que cada tajada arrastra pegada */}
    <div style={{
      position: "absolute", right: -46, top: 2, width: 30, height: Math.max(6, h - 6),
      background: `linear-gradient(180deg, ${rgba(V.bone, 0.72)}, ${rgba(V.bone, 0.32)})`,
      opacity: hoja, transform: `rotate(${(3 + hoja * 2).toFixed(1)}deg)`,
      boxShadow: `0 3px 10px ${rgba(V.ink0, 0.8)}`,
    }} />
  </div>
);

export const MovS8E: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const cf = useCurrentFrame();
  const f = gFrame - (START[acto] ?? 0);
  const toCF = (t: number) => cf - f + t;

  // LA LUZ, función continua de gFrame: ámbar de costado → media tarde → rasante → noche azul → ámbar.
  const keyFrom = interpolate(gFrame, [0, A2, A3, A4, A5, G_END], [0.84, 0.86, 0.9, 0.62, 0.86, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const noche = interpolate(gFrame, [A4 - 40, A4 + 40, A5 - 60, A5], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inten = interpolate(gFrame, [0, A2, A3, A4, A4 + 60, A5, G_END], [1.12, 0.94, 1.08, 0.9, 0.62, 1.08, 1.14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const floorDim = interpolate(gFrame, [0, A3, A4 + 60, A5], [0.5, 0.44, 0.8, 0.5], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam = camAt(gFrame);

  return (
    <AbsoluteFill>
      {/* ── LA ATMÓSFERA: se monta UNA vez, sólo evoluciona la luz ────────────────────────── */}
      <VoltAtmos tint={light(noche, "amber", "sky")} tint2={light(noche, "amber", "sky")}
        keyFrom={keyFrom} intensity={inten} floor={floorDim} />

      <Layers cam={cam}>
        {/* ═══ ACTO 1 · el ladrillo de 1.680 rebanado en tajadas de 67 ═══════════════════ */}
        {acto === 1 && (() => {
          const tecla = clamp01(f / 14);                // la tecla que él apretó se hunde
          const sube = clamp01((f - 12) / 40);          // y de ella sale hacia arriba el ladrillo
          const sierra = clamp01((f - 52) / 108);       // la hoja rebana, tajada por tajada
          const n = Math.floor(sierra * 25);            // el apilado se detiene SOLO cuando se acabó
          const H = 620;                                // el ladrillo entero: 1.680
          const hMes = H / 25;                          // cada tajada: 67
          const restante = H * (1 - sierra);
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.calculadoraV} kind="video" startFrom={12} z={0} scale={1.3} dim={0.72} tint={V.amber} /></Plane>
              {/* EL HAZ ÁMBAR de costado, con el polvo del garaje suspendido adentro */}
              <Plane z={-380}>
                <div style={{
                  position: "absolute", left: -180, top: -120, width: 1180, height: 1400,
                  transform: "rotate(17deg)", transformOrigin: "0 0",
                  background: `linear-gradient(96deg, ${rgba(V.amber, 0.13)}, rgba(0,0,0,0) 62%)`,
                  filter: "blur(16px)",
                }} />
              </Plane>
              {/* LA TECLA que se hunde, y el LADRILLO de 1.680 que sale de ella */}
              <Plane z={-40}>
                <div style={{
                  position: "absolute", left: "26%", top: 862 + 14 * tecla, width: 260, height: 74, marginLeft: -130,
                  borderRadius: 10,
                  background: `linear-gradient(180deg, ${rgba(V.bone, 0.3 - 0.14 * tecla)}, ${rgba(V.ink1, 0.98)})`,
                  boxShadow: `0 ${(16 - 12 * tecla).toFixed(0)}px 28px ${rgba(V.ink0, 0.88)}`,
                }} />
                <div style={{
                  position: "absolute", left: "26%", top: 830 - eio(0, H, sube) + (H - restante), width: 380, height: restante, marginLeft: -190,
                  background: `linear-gradient(180deg, ${rgba(V.amber, 0.26)} 0%, ${rgba(V.ink2, 0.97)} 14%, ${rgba(V.ink1, 1)} 100%)`,
                  borderTop: `4px solid ${rgba(V.amber, 0.92)}`,
                  boxShadow: `0 30px 74px ${rgba(V.ink0, 0.9)}, inset -20px 0 44px ${rgba(V.ink0, 0.78)}`,
                  opacity: sube,
                }} />
                {/* LA HOJA DE SIERRA VOLTIO que muerde el ladrillo: es una herramienta, va en vector */}
                {sierra > 0 && sierra < 1 && (
                  <div style={{
                    position: "absolute", left: "26%", top: 830 - eio(0, H, sube) + (H - restante) - 2,
                    width: 520, marginLeft: -260, height: 4,
                    background: `linear-gradient(90deg, ${rgba(V.volt, 0)}, ${rgba(V.volt, 0.95)} 14%, ${rgba(V.volt, 0.95)} 86%, ${rgba(V.volt, 0)})`,
                    boxShadow: `0 0 28px ${rgba(V.volt, 0.8)}`,
                    transform: `translateY(${(Math.sin(f / 2.2) * 2.4).toFixed(2)}px)`,
                  }} />
                )}
              </Plane>
              {/* LA TARJETA EN LA CARA DEL LADRILLO: la FOTO REAL de la caja gris */}
              <Plane z={120}>
                <MediaCard src={M.palmaF} kind="photo" w={330} h={206} x={26} y={pc(830 - eio(0, H, sube) + (H - restante) + Math.max(120, restante / 2))}
                  z={0} ry={-6} lit={0.96} litColor={V.amber} label="1.680 DÓLARES" sheenAt={toCF(26)} radius={8} opacity={sube} />
              </Plane>
              {/* LA PILA DE MESES: 25 tajadas de 67. El 25 NO se escribe: lo escribe la altura. */}
              <Plane z={200}>
                {Array.from({ length: Math.max(0, n) }, (_, i) => (
                  <Mes key={i} x={68} top={862 - (i + 1) * hMes} w={eio(300, 420, clamp01((sierra * 25 - i) / 2))}
                    h={hMes - 2} tint={i % 2 === 0 ? V.volt : V.voltSoft} hoja={clamp01(sierra * 25 - i)} />
                ))}
                {/* la regla que la pila va tapando: la altura ES la cuenta */}
                <div style={{
                  position: "absolute", left: "80.5%", top: 862 - H, width: 3, height: H,
                  background: `linear-gradient(180deg, ${rgba(V.bone, 0.1)}, ${rgba(V.bone, 0.42)})`,
                }} />
                <MediaCard src={M.calendarioF} kind="photo" w={300} h={188} x={90} y={78} z={0} ry={-12}
                  lit={0.86} litColor={V.amber} label="UN MES CADA UNA" sheenAt={toCF(96)} radius={8}
                  opacity={clamp01((f - 80) / 22)} />
              </Plane>
              <Plane z={300}>
                <Readout value="1.680" unit="$" label="LO QUE ME COSTÓ" at={toCF(18)} x={22} y={15} size={112} color={V.amber} />
                <Readout value="67" unit="$/MES" label="DIVIDIDO EL AHORRO" at={toCF(58)} x={48} y={22} size={104} color={V.volt} />
                <IconPng src={M.icCalculadora} x={10} y={pc(760)} size={92} z={0} opacity={0.6 + 0.3 * tecla} glow={V.ink0} />
                <IconPng src={M.icCalendario} x={90} y={pc(300)} size={88} z={0} opacity={0.6 * clamp01((f - 90) / 20)} glow={V.ink0} />
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 2 · el renglón es la vía de 6.000 ciclos y no se termina ═════════════ */}
        {acto === 2 && (() => {
          const out = clamp01(f / 22);                  // salimos del renglón, ya montados en la vía
          const corre = clamp01((f - 14) / 76);         // el punto voltio corre un ciclo por día
          const marca = clamp01((f - 26) / 20);         // la marca del kilómetro 25: ahí se pagó
          const xPunto = lerp(9, 96, eio(0, 1, corre));
          const yVia = 596;
          return (
            <>
              <Plane z={-640}><PhotoPlane src={M.etiquetaV} kind="video" startFrom={16} z={0} scale={1.34} dim={0.78} tint={V.amber} /></Plane>
              {/* LA VÍA: el renglón estirado hasta perderse fuera del cuadro */}
              <Plane z={-60}>
                <div style={{
                  position: "absolute", left: -160, top: yVia, width: eio(700, 2320, out), height: 6,
                  background: `linear-gradient(90deg, ${rgba(V.amber, 0.2)} 0%, ${rgba(V.bone, 0.7)} 8%, ${rgba(V.bone, 0.7)} 78%, ${rgba(V.bone, 0.16)} 100%)`,
                  boxShadow: `0 12px 30px ${rgba(V.ink0, 0.82)}`,
                }} />
                {/* los durmientes: se van juntando con la perspectiva (esto es un esquema: vector) */}
                {Array.from({ length: 34 }, (_, i) => {
                  const t = i / 33;
                  const xx = -140 + Math.pow(t, 0.72) * 2180;
                  return (
                    <div key={i} style={{
                      position: "absolute", left: xx, top: yVia + 6, width: 4, height: 26 - t * 17,
                      background: rgba(V.bone, 0.3 - t * 0.2),
                    }} />
                  );
                })}
              </Plane>
              {/* LA MARCA DEL KILÓMETRO 25 con la tarjeta chica: AHÍ SE PAGÓ */}
              <Plane z={80}>
                <div style={{
                  position: "absolute", left: "27%", top: yVia - 118, width: 4, height: 118,
                  background: rgba(V.volt, 0.9 * marca), boxShadow: `0 0 22px ${rgba(V.volt, 0.6 * marca)}`,
                }} />
                <MediaCard src={M.pagoF} kind="photo" w={268} h={168} x={27} y={pc(yVia - 216)} z={0} ry={7}
                  lit={0.9} litColor={V.volt} label="AHÍ SE PAGÓ" sheenAt={toCF(34)} radius={8} opacity={marca} />
              </Plane>
              {/* EL PUNTO VOLTIO: un ciclo por día. Pasa la marca SIN FRENAR. */}
              <Plane z={220}>
                <div style={{
                  position: "absolute", left: `${xPunto.toFixed(2)}%`, top: yVia - 9, width: 22, height: 22, marginLeft: -11,
                  borderRadius: "50%", background: V.volt,
                  boxShadow: `0 0 34px ${rgba(V.volt, 0.9)}, 0 0 90px ${rgba(V.volt, 0.4)}`,
                }} />
                <div style={{
                  position: "absolute", left: `${Math.max(0, xPunto - 16).toFixed(2)}%`, top: yVia - 3,
                  width: `${Math.min(16, xPunto).toFixed(2)}%`, height: 8,
                  background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.volt, 0.5)})`,
                }} />
                <Readout value="6.000" unit="CICLOS" at={toCF(20)} x={70} y={22} size={104} color={V.amber} />
                <div style={{ position: "absolute", left: "70%", top: "80%", transform: "translate(-50%,0)", textAlign: "center", opacity: clamp01((f - 46) / 16) }}>
                  <Head size={68} color={V.bone}>OTROS 14 AÑOS</Head>
                  <div style={{ marginTop: 8 }}><Kick color={rgba(V.amber, 0.86)}>DESPUÉS DE HABERSE PAGADO</Kick></div>
                </div>
                <IconPng src={M.icBateria} x={9} y={pc(yVia - 130)} size={86} z={0} opacity={0.62} glow={V.ink0} />
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 3 · las dos cajas de perfil: lo mismo con menos capacidad ═══════════ */}
        {acto === 3 && (() => {
          const perfil = clamp01(f / 26);               // las dos cajas quedan de perfil
          const balanza = clamp01((f - 22) / 42);       // las etiquetas de precio cuelgan como balanza
          const onda = clamp01((f - 44) / 54);          // la misma forma de onda entre las dos
          const PISO = 858;
          return (
            <>
              <Plane z={-640}><PhotoPlane src={M.grandeF} kind="photo" z={0} scale={1.34} dim={0.82} tint={V.amber} /></Plane>
              {/* LA LUZ RASANTE de la ventana del garaje: alarga las dos sombras hacia la cámara */}
              <Plane z={-300}>
                <div style={{
                  position: "absolute", left: 0, top: PISO - 40, right: 0, height: 260,
                  background: `linear-gradient(180deg, ${rgba(V.amber, 0.1)}, rgba(0,0,0,0) 70%)`,
                }} />
                {[30, 68].map((sx, i) => (
                  <div key={sx} style={{
                    position: "absolute", left: `${sx}%`, top: PISO - 6, width: eio(60, 420 - i * 150, perfil),
                    height: 26, marginLeft: -20,
                    background: `linear-gradient(90deg, ${rgba(V.ink0, 0.86)}, rgba(0,0,0,0))`,
                    transform: "skewX(-46deg)", transformOrigin: "left top", filter: "blur(6px)",
                  }} />
                ))}
              </Plane>
              {/* LAS DOS CAJAS, cada una dentro de su tarjeta con su FOTO REAL */}
              <Plane z={40}>
                <MediaCard src={M.grandeF} kind="photo" w={eio(360, 470, perfil)} h={eio(230, 300, perfil)}
                  x={30} y={pc(PISO - 168)} z={0} ry={16} lit={0.94} litColor={V.amber}
                  label="LA GRANDE" sheenAt={toCF(16)} radius={8} />
                <MediaCard src={M.chicaF} kind="photo" w={eio(280, 320, perfil)} h={eio(180, 206, perfil)}
                  x={68} y={pc(PISO - 122)} z={0} ry={-14} lit={0.94} litColor={V.volt}
                  label="LA HERMANA CHICA" sheenAt={toCF(34)} radius={8} />
              </Plane>
              {/* LAS ETIQUETAS DE PRECIO colgando como de una balanza */}
              <Plane z={200}>
                {[
                  { x: 30, txt: "1.680", drop: eio(0, 250, balanza), c: V.amber },
                  { x: 68, txt: "MENOS DE 300", drop: eio(0, 64, balanza), c: V.volt },
                ].map((o) => (
                  <div key={o.x} style={{ position: "absolute", left: `${o.x}%`, top: pc(PISO - 300) + "%" }}>
                    <div style={{
                      position: "absolute", left: 0, top: 0, width: 2, height: o.drop,
                      background: rgba(V.bone, 0.5),
                    }} />
                    <div style={{
                      position: "absolute", left: -104, top: o.drop, width: 208, padding: "12px 0", textAlign: "center",
                      background: `linear-gradient(180deg, ${rgba(V.ink1, 0.94)}, ${rgba(V.ink0, 0.86)})`,
                      border: `1px solid ${rgba(o.c, 0.4)}`, borderRadius: 6,
                      boxShadow: `0 14px 30px ${rgba(V.ink0, 0.82)}`,
                      fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 34, letterSpacing: 1.8, color: o.c,
                    }}>{o.txt}</div>
                  </div>
                ))}
              </Plane>
              {/* LA MISMA FORMA DE ONDA entre las dos: idéntica en su dibujo, sólo más corta */}
              <Plane z={120}>
                <AbsoluteFill>
                  <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
                    <path d="M 300 470 L 360 470 L 400 392 L 470 548 L 540 392 L 610 548 L 660 470 L 760 470"
                      fill="none" stroke={V.amber} strokeWidth={6} strokeLinecap="round"
                      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - onda}
                      style={{ filter: `drop-shadow(0 0 16px ${rgba(V.amber, 0.6)})` }} />
                    <path d="M 1150 470 L 1186 470 L 1210 416 L 1252 524 L 1294 416 L 1336 524 L 1366 470 L 1426 470"
                      fill="none" stroke={V.volt} strokeWidth={6} strokeLinecap="round"
                      pathLength={1} strokeDasharray={1} strokeDashoffset={1 - onda}
                      style={{ filter: `drop-shadow(0 0 16px ${rgba(V.volt, 0.6)})` }} />
                  </svg>
                </AbsoluteFill>
              </Plane>
              <Plane z={300}>
                <div style={{ position: "absolute", left: "50%", top: "12%", transform: "translate(-50%,0)", textAlign: "center", opacity: clamp01((f - 52) / 16) }}>
                  <Head size={70} color={V.bone}>HACEN LO MISMO</Head>
                  <div style={{ marginTop: 8 }}><Kick color={rgba(V.volt, 0.9)}>CON MENOS CAPACIDAD</Kick></div>
                </div>
                <IconPng src={M.icCaja} x={50} y={pc(880)} size={84} z={0} opacity={0.5 * perfil} glow={V.ink0} />
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 4 · la sombra se abre en cuatro hilos: la casa de noche ═════════════ */}
        {acto === 4 && (() => {
          const estira = clamp01(f / 26);               // la sombra larga de la caja chica se estira
          const abre = clamp01((f - 20) / 30);          // y se abre en cuatro hilos voltio
          const PISO = 858;
          const nodos = [
            { src: M.refriF, x: 17, y: 30, at: 34, label: "EL REFRIGERADOR" },
            { src: M.routerF, x: 39, y: 22, at: 48, label: "EL INTERNET" },
            { src: M.pasilloF, x: 61, y: 24, at: 60, label: "LAS LUCES" },
            { src: M.cargadoresF, x: 83, y: 32, at: 72, label: "LOS CARGADORES" },
          ];
          return (
            <>
              <Plane z={-660}><PhotoPlane src={M.chicaF} kind="photo" z={0} scale={1.32} dim={0.86} tint={V.sky} /></Plane>
              {/* LA NOCHE AZUL del fondo de la casa */}
              <Plane z={-420}>
                <AbsoluteFill style={{ background: `linear-gradient(0deg, ${rgba(V.sky, 0.2)} 0%, rgba(0,0,0,0) 40%)` }} />
              </Plane>
              {/* ARRIBA: la franja cara del reloj tarifario, A OSCURAS, porque ya no le cuelga nada */}
              <Plane z={-140}>
                <AbsoluteFill>
                  <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
                    <path d="M 420 150 A 380 380 0 0 1 1500 150" fill="none" stroke={rgba(V.white, 0.09)} strokeWidth={14} strokeLinecap="round" />
                    <path d="M 700 96 A 380 380 0 0 1 1220 96" fill="none" stroke={rgba(V.danger, 0.12)} strokeWidth={14} strokeLinecap="round" />
                  </svg>
                </AbsoluteFill>
                <div style={{
                  position: "absolute", left: "50%", top: 44, transform: "translateX(-50%)",
                  fontFamily: F_BODY, fontWeight: 600, fontSize: 27, letterSpacing: 4.2, color: rgba(V.bone, 0.3),
                }}>FRANJA CARA · APAGADA</div>
                <IconPng src={M.icReloj} x={50} y={pc(196)} size={72} z={0} opacity={0.24} glow={V.ink0} />
              </Plane>
              {/* LA SOMBRA que se estira por el piso y se abre en CUATRO HILOS */}
              <Plane z={-40}>
                <div style={{
                  position: "absolute", left: "50%", top: PISO, width: eio(80, 900, estira), height: 34, marginLeft: -40,
                  background: `linear-gradient(90deg, ${rgba(V.ink0, 0.9)}, rgba(0,0,0,0))`,
                  transform: "skewX(-40deg)", transformOrigin: "left top", filter: "blur(7px)",
                }} />
                <AbsoluteFill>
                  <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
                    {nodos.map((nd, i) => (
                      <path key={i}
                        d={`M 960 ${PISO} C ${820 + i * 90} ${PISO - 150} ${nd.x * 19.2} ${PISO - 200} ${nd.x * 19.2} ${nd.y * 10.8 + 130}`}
                        fill="none" stroke={V.volt} strokeWidth={4} strokeLinecap="round"
                        pathLength={1} strokeDasharray={1} strokeDashoffset={1 - clamp01(abre * 1.2 - i * 0.08)}
                        style={{ filter: `drop-shadow(0 0 14px ${rgba(V.volt, 0.6)})` }} />
                    ))}
                  </svg>
                </AbsoluteFill>
              </Plane>
              {/* LOS CUATRO, ENCENDIENDO EN CASCADA, en el orden exacto en que la voz los nombra */}
              <Plane z={180}>
                {nodos.map((nd) => {
                  const on = clamp01((f - nd.at) / 12);
                  return (
                    <MediaCard key={nd.label} src={nd.src} kind="photo" w={300} h={188} x={nd.x} y={nd.y} z={0}
                      ry={(nd.x - 50) / 6} lit={0.24 + 0.76 * on} litColor={on > 0.4 ? V.amber : V.sky}
                      label={nd.label} sheenAt={toCF(nd.at + 4)} radius={8} opacity={0.34 + 0.66 * on} />
                  );
                })}
              </Plane>
              <Plane z={300}>
                <div style={{ position: "absolute", left: "50%", top: "76%", transform: "translate(-50%,0)", textAlign: "center", opacity: clamp01((f - 16) / 14) }}>
                  <Kick color={rgba(V.bone, 0.86)}>FUERA DE LA FRANJA CARA</Kick>
                </div>
                {/* las motas que el haz voltio levanta del piso de la casa dormida */}
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} style={{
                    position: "absolute", left: `${(20 + rnd(i * 4.7) * 62).toFixed(1)}%`,
                    top: `${(58 + rnd(i * 8.3) * 24 - (f * 0.14) % 20).toFixed(1)}%`,
                    width: 3, height: 3, borderRadius: "50%",
                    background: rgba(V.volt, 0.2 + rnd(i * 2.9) * 0.3),
                  }} />
                ))}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 5 · dos carriles: la chica llega catorce marcas antes ═══════════════ */}
        {acto === 5 && (() => {
          const despega = clamp01(f / 20);              // el número del display se despega y aterriza
          const corre = clamp01((f - 16) / 66);         // las dos barras salen del mismo punto
          const grande = eio(0, 0.56, corre);           // la grande tarda: 25 marcas
          const chica = eio(0, 1, clamp01(corre * 1.78)); // la chica llega primero: 14 marcas
          const X0 = 16, X1 = 88;
          const yG = 400, yC = 640;
          return (
            <>
              <Plane z={-640}><PhotoPlane src={M.displayV} kind="video" startFrom={14} z={0} scale={1.32} dim={0.8} tint={V.amber} /></Plane>
              {/* LOS DOS CARRILES, del mismo punto de largada, y la meta que toma la luz ámbar */}
              <Plane z={-60}>
                {[yG, yC].map((yy) => (
                  <div key={yy} style={{
                    position: "absolute", left: `${X0}%`, top: yy, width: `${X1 - X0}%`, height: 86, marginTop: -43,
                    background: `linear-gradient(180deg, ${rgba(V.ink1, 0.9)}, ${rgba(V.ink0, 0.72)})`,
                    borderTop: `1px solid ${rgba(V.bone, 0.16)}`, borderBottom: `1px solid ${rgba(V.bone, 0.16)}`,
                  }} />
                ))}
                <div style={{
                  position: "absolute", left: `${X0}%`, top: yG - 90, width: 4, height: 420,
                  background: rgba(V.bone, 0.5),
                }} />
                <div style={{
                  position: "absolute", left: `${X1}%`, top: yG - 90, width: 8, height: 420,
                  background: `linear-gradient(180deg, ${rgba(V.amber, 0.95)}, ${rgba(V.amber, 0.5)})`,
                  boxShadow: `0 0 40px ${rgba(V.amber, 0.7)}`,
                }} />
                {/* las marcas del recorrido: los meses (esto es una escala, va en vector) */}
                {Array.from({ length: 25 }, (_, i) => (
                  <div key={i} style={{
                    position: "absolute", left: `${(X0 + ((i + 1) / 25) * (X1 - X0)).toFixed(2)}%`, top: yC + 52,
                    width: 2, height: i === 13 ? 30 : 16,
                    background: rgba(i === 13 ? V.volt : V.bone, i === 13 ? 0.9 : 0.26),
                  }} />
                ))}
              </Plane>
              {/* LAS DOS BARRAS con su tarjeta de FOTO REAL a la cabeza */}
              <Plane z={140}>
                <div style={{
                  position: "absolute", left: `${X0}%`, top: yG - 30, width: `${(X1 - X0) * grande}%`, height: 60,
                  background: `linear-gradient(90deg, ${rgba(V.amber, 0.3)}, ${rgba(V.amber, 0.72)})`,
                  boxShadow: `0 14px 34px ${rgba(V.ink0, 0.8)}`,
                }} />
                <div style={{
                  position: "absolute", left: `${X0}%`, top: yC - 30, width: `${(X1 - X0) * chica}%`, height: 60,
                  background: `linear-gradient(90deg, ${rgba(V.volt, 0.32)}, ${rgba(V.volt, 0.8)})`,
                  boxShadow: `0 14px 34px ${rgba(V.ink0, 0.8)}, 0 0 40px ${rgba(V.volt, 0.2)}`,
                }} />
                <MediaCard src={M.grandeF} kind="photo" w={272} h={170} x={X0 + (X1 - X0) * grande} y={pc(yG - 34)} z={0}
                  ry={-8} lit={0.86} litColor={V.amber} label="LA GRANDE" sheenAt={toCF(22)} radius={8} />
                <MediaCard src={M.chicaCamionetaF} kind="photo" w={272} h={170} x={X0 + (X1 - X0) * chica} y={pc(yC - 34)} z={0}
                  ry={-8} lit={1} litColor={V.volt} label="LA CHICA" sheenAt={toCF(30)} radius={8} />
              </Plane>
              {/* LA CUOTA que se despegó del display de la pinza y aterrizó al pie de los carriles */}
              <Plane z={280}>
                <Readout value="22" unit="$/MES" label="MEDIDO EN MI CASA" at={toCF(6)} x={lerp(72, 22, eio(0, 1, despega))}
                  y={lerp(22, 88, eio(0, 1, despega))} size={lerp(84, 108, despega)} color={V.volt} />
                {chica > 0.985 && (
                  <div style={{ position: "absolute", left: "72%", top: "12%", transform: "translate(-50%,0)", textAlign: "center" }}>
                    <Head size={78} color={V.volt}>14 MESES</Head>
                    <div style={{ marginTop: 8 }}><Kick color={rgba(V.bone, 0.86)}>MÁS RÁPIDO QUE LA GRANDE</Kick></div>
                  </div>
                )}
                <IconPng src={M.icCalendario} x={92} y={pc(yC + 120)} size={78} z={0} opacity={0.55} glow={V.ink0} />
              </Plane>
            </>
          );
        })()}
      </Layers>
    </AbsoluteFill>
  );
};
