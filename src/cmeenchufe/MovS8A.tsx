// MovS8A.tsx — MOVIMIENTO S8A · "EL DESGLOSE"
// Video `cmeenchufe` (Claudio Mendoza Constructor, ES). 6 actos · 1.127.090 → 1.166.710 ms · 1189 frames @30.
//
// LA IDEA: los 67 dólares no son un número, son un billete que hay que ABRIR. Se abre en tajadas:
// 53,80 de haber movido la punta · 8,28 de bajar la potencia · 5 del congelador (que no son de la
// batería, y se dicen igual). Y al final se RESTA lo que costó cargarla de madrugada: 10,08.
// El movimiento termina con la pila MÁS BAJA de la que empezó. Eso es la honestidad.
//
// EL OBJETO QUE ATRAVIESA LAS SEIS FRONTERAS: **EL BILLETE / LA TAJADA**.
//   acto 1 → el billete macizo de 67 se abanica y la tajada de 53,80 se va volando a la derecha;
//   acto 2 → esa misma tajada ATERRIZA sobre el peldaño y lo hunde: la casa baja un escalón;
//   acto 3 → la cámara entra en la contrahuella y sale DENTRO de la cinta de precio (34 → 27);
//   acto 4 → la cinta se enrolla y es el DIAL de la potencia: del borde cae la tajada de 8,28;
//   acto 5 → la pila crece, pero la tajada de 5 no se deja apilar: se sale sola y se enfría;
//   acto 6 → la raya del cuaderno es la BARRA DE LA RESTA y 10,08 se descuenta desde abajo.
//
// UNA cámara: `camAt(gFrame)` — un solo `gcam` monótono (z −280 → +470) más una grúa continua que
// SUBE con la tajada que se va, CAE con el escalón, entra en la contrahuella, rodea el dial y baja
// con la resta hasta el fondo. Nunca vuelve a cero. Le entrega la posición a S8B: el z0 de S8B es
// exactamente el z1 de acá (+470).
// UNA atmósfera: `<VoltAtmos/>` montada una sola vez, fuera del switch de actos.
// LA LUZ (tramo 1 de 5 de la sección): VOLT frío de la mañana de la factura → en el acto 6 cae a
// MADRUGADA (sky azul, lámpara desnuda apagada, azul de calle por debajo del portón). Evoluciona.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · g0-231 · "DE ESOS 67"                       material: FOTO factura + FOTO hombro/facturas
//   entra  cam {z −280, plano medio del billete sobre la tarjeta} luz {VOLT, key 0.18}
//   sale   cam {grúa +54, siguiendo la tajada que vuela}          luz {VOLT, key 0.21}
//   ── FRONTERA A ···· LA TAJADA QUE VIAJA aterriza en el peldaño: el objeto cruza solo. ····
// ACTO 2 · g234-351 · "ABAJO DEL ESCALÓN"              material: FOTO dorso + FOTO fachada
//   entra  cam {grúa +54, a la altura del peldaño}                luz {VOLT, key 0.22}
//   sale   cam {METIDA en la contrahuella, push ×3.05}            luz {VOLT, key 0.24}
//   ── FRONTERA B ···· ZOOM-THROUGH: entra en la contrahuella, sale dentro de la cinta. ······
// ACTO 3 · g353-530 · "DE 34 A 27"                     material: CLIP pinza general + FOTO dorso de canto
//   entra  cam {saliendo del push 3.05 → 1}                       luz {VOLT, key 0.25}
//   sale   cam {grúa +86, la cinta empieza a enroscarse}          luz {VOLT, key 0.27}
//   ── FRONTERA C ···· MORPH: la cinta se enrolla sobre sí misma y ya es el dial. ············
// ACTO 4 · g533-647 · "BAJÉ LA POTENCIA"               material: FOTO tablero de breakers + FOTO factura
//   entra  cam {grúa +58, rodeando el aro}                        luz {VOLT, key 0.28}
//   sale   cam {grúa +12, la tajada nueva cae a la pila}          luz {VOLT, key 0.29}
//   ── FRONTERA D ···· MATCH-CUT DE ESCALA: la tajada que cayó ES la pila del acto 5. ·······
// ACTO 5 · g745-883 · "Y TE LO DIGO IGUAL"             material: FOTO goma congelador + FOTO factura
//   entra  cam {grúa −30, mirando la pila}                        luz {VOLT, key 0.30, empieza a enfriar}
//   sale   cam {clavada en la tajada expulsada}                   luz {30% sky}
//   ── FRONTERA E ···· BARRIDO DE MATERIA: la raya del cuaderno cruza y es la barra de resta. ·
// ACTO 6 · g991-1189 · "Y AHORA RESTA"                 material: CLIP caja cargando de madrugada + FOTO cuaderno
//   entra  cam {grúa −150, bajando}                               luz {SKY, madrugada azul, int 0.66}
//   sale   cam {grúa −232, la pila queda más baja}                luz {SKY plena — se la entrega a S8B}
//
// ⛔ cero Math.random/Date · cero backdrop-filter · cero fade entre actos · cero texto de otro video.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  V, F_DISPLAY, F_BODY, clamp01, lerp, eio, rgba,
  gcam, light, VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng, Readout,
  Kick, Head,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO (frames desde el arranque del MOVIMIENTO, 30 fps) ────────────────
const A1 = 0, A2 = 234, A3 = 353, A4 = 533, A5 = 745, A6 = 991;
const G_END = 1189;
const START: Record<number, number> = { 1: A1, 2: A2, 3: A3, 4: A4, 5: A5, 6: A6 };

const pc = (px: number) => (px / 1080) * 100;   // px verticales → % de pantalla

// ── EL MATERIAL REAL (todas verificadas en disco) ────────────────────────────────────────────
const M = {
  facturaF: "img/cmeenchufe/cmee_s4_alisa_factura.png",
  hombroF: "img/cmeenchufe/cmee_s8_hombro_factura_manos.png",
  dorsoF: "img/cmeenchufe/cmee_s8_dedo_dorso_un_precio.png",
  fachadaF: "img/cmeenchufe/cmee_s1_fachada_noche.png",
  vueltaF: "img/cmeenchufe/cmee_s4_da_vuelta_hoja.png",
  pinzaV: "broll/cmeenchufe/cmee_s4_pinza_general.mp4",
  breakersF: "img/cmeenchufe/cmee_s4_tablero_breakers.png",
  gomaF: "img/cmeenchufe/cmee_s8_goma_congelador.png",
  cargaV: "broll/cmeenchufe/cmee_s7_caja_carga_madrugada.mp4",
  cuadernoF: "img/cmeenchufe/cmee_s8_banco_cuaderno_abre.png",
  menosF: "img/cmeenchufe/cmee_s8_signo_menos_cuaderno.png",
  icBillete: "img/cmeenchufe/cmee_ic_billete.png",
  icReloj: "img/cmeenchufe/cmee_ic_reloj.png",
  icBreaker: "img/cmeenchufe/cmee_ic_breaker.png",
  icCongelador: "img/cmeenchufe/cmee_ic_congelador.png",
  icCuaderno: "img/cmeenchufe/cmee_ic_cuaderno.png",
};

// ── LA CÁMARA · una sola función de gFrame, monótona, que nunca vuelve a cero ────────────────
const camAt = (g: number) => {
  const base = gcam(g, { z0: -280, z1: 470, panX: -150, panY: 24, ry: -6.5, rx: 2.2, dur: G_END });
  // LA GRÚA (positivo = la cámara sube): sube con la tajada que vuela, cae con el escalón,
  // entra en la contrahuella, rodea el dial y baja con la resta hasta el fondo del cuadro.
  const crane = interpolate(
    g,
    [0, A1 + 120, A2, A2 + 90, A3 + 90, A4, A4 + 110, A5, A5 + 130, A6, G_END],
    [0, 54, 54, 118, 86, 58, 12, -30, -44, -150, -232],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  // EL ZOOM-THROUGH del acto 2→3: entramos DENTRO de la contrahuella (x 38% / y 66%).
  const push = interpolate(g, [A2 + 62, A3, A3 + 34], [1, 3.05, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.55, 0, 0.35, 1),
  });
  const tx = (50 - 38) * (push - 1);
  const ty = (50 - 66) * (push - 1);
  return (
    `${base.transform} translateY(${crane.toFixed(1)}px) ` +
    `translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%) scale(${push.toFixed(3)})`
  );
};

// ── LA TAJADA DE BILLETE · el objeto que cruza el movimiento entero ──────────────────────────
// No es una tarjeta con texto: es un OBJETO con espesor, canto y guardas de papel. El material
// real vive en las MediaCard que la acompañan, nunca en su lugar.
const Tajada: React.FC<{
  x: number; y: number; w: number; h: number; z?: number; tint: string;
  rot?: number; value?: string; nota?: string; opacity?: number; blur?: number;
}> = ({ x, y, w, h, z = 0, tint, rot = 0, value, nota, opacity = 1, blur = 0 }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
    marginLeft: -w / 2, marginTop: -h / 2, opacity,
    transform: `translateZ(${z}px) rotate(${rot}deg)`,
    filter: blur > 0 ? `blur(${blur}px)` : undefined,
  }}>
    {/* el cuerpo del billete: papel viejo lamido por la luz de su franja */}
    <div style={{
      position: "absolute", left: 0, top: 0, right: 0, bottom: 0,
      background: `linear-gradient(178deg, ${rgba(tint, 0.34)} 0%, ${rgba(V.ink2, 0.97)} 26%, ${rgba(V.ink1, 1)} 100%)`,
      borderTop: `3px solid ${rgba(tint, 0.92)}`,
      boxShadow: `0 ${Math.round(h * 0.3)}px ${Math.round(h * 0.5)}px ${rgba(V.ink0, 0.8)}, inset 0 0 40px ${rgba(V.ink0, 0.6)}`,
    }} />
    {/* el canto: la tajada tiene ESPESOR, no es un rectángulo */}
    <div style={{
      position: "absolute", right: -13, top: 5, width: 13, height: Math.max(0, h - 5),
      background: `linear-gradient(180deg, ${rgba(tint, 0.18)}, ${rgba(V.ink0, 0.98)})`,
      transform: "skewY(-8deg)", transformOrigin: "left top",
    }} />
    {/* las guardas del billete: rayado finito, para que se lea PAPEL y no bloque */}
    <div style={{
      position: "absolute", left: 14, right: 26, top: 10, bottom: 10, opacity: 0.3,
      backgroundImage: `repeating-linear-gradient(92deg, ${rgba(tint, 0.5)} 0px, ${rgba(tint, 0.5)} 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 7px)`,
    }} />
    {value && (
      <div style={{
        position: "absolute", left: 22, top: "50%", transform: "translateY(-50%)",
        fontFamily: F_DISPLAY, fontWeight: 800, fontSize: Math.min(Math.round(h * 0.62), 74),
        letterSpacing: 1.4, color: tint, textShadow: "0 5px 22px rgba(0,0,0,0.94)", whiteSpace: "nowrap",
      }}>{value}</div>
    )}
    {nota && (
      <div style={{
        position: "absolute", right: 30, top: "50%", transform: "translateY(-50%)",
        fontFamily: F_BODY, fontWeight: 500, fontSize: Math.min(Math.round(h * 0.28), 27),
        letterSpacing: 2.4, color: rgba(V.bone, 0.72), textTransform: "uppercase", whiteSpace: "nowrap",
      }}>{nota}</div>
    )}
  </div>
);

// ── EL ODÓMETRO · las cifras ruedan como en una bomba de nafta (esto SÍ es un gráfico) ───────
const Roll: React.FC<{ from: number; to: number; p: number; size: number; color: string }> = ({
  from, to, p, size, color,
}) => {
  const cell = Math.round(size * 1.04);
  const hi = Math.max(from, to) + 1, lo = Math.min(from, to) - 1;
  const y = lerp(from, to, p);
  const cells: number[] = [];
  for (let v = hi; v >= lo; v--) cells.push(v);
  const off = (hi - y) * cell;
  return (
    <div style={{
      width: Math.round(size * 0.66), height: cell, overflow: "hidden", position: "relative",
      background: `linear-gradient(180deg, ${rgba(V.ink0, 0.9)}, ${rgba(V.ink1, 0.72)})`,
      boxShadow: `inset 0 10px 18px ${rgba(V.ink0, 0.9)}, inset 0 -10px 18px ${rgba(V.ink0, 0.9)}`,
      borderRadius: 4,
    }}>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `translateY(${(-off).toFixed(1)}px)` }}>
        {cells.map((v) => (
          <div key={v} style={{
            height: cell, lineHeight: `${cell}px`, width: Math.round(size * 0.66), textAlign: "center",
            fontFamily: F_DISPLAY, fontWeight: 800, fontSize: size, color,
          }}>{((v % 10) + 10) % 10}</div>
        ))}
      </div>
    </div>
  );
};

export const MovS8A: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const cf = useCurrentFrame();
  const f = gFrame - (START[acto] ?? 0);    // frame LOCAL del acto (robusto a cómo lo monte el Main)
  const toCF = (t: number) => cf - f + t;   // pasa un frame mío al reloj interno de las primitivas

  // LA LUZ, función continua de gFrame: evoluciona, nunca salta entre actos.
  const keyFrom = interpolate(gFrame, [0, A3, A5, A6, G_END], [0.18, 0.25, 0.30, 0.33, 0.38], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cool = interpolate(gFrame, [A5, A6 + 46], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inten = interpolate(gFrame, [0, A4, A5, A6, G_END], [0.98, 1.06, 1.0, 0.66, 0.62], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const floorDim = interpolate(gFrame, [0, A5, A6], [0.55, 0.62, 0.82], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // el ÁMBAR de abajo (lo que te queda) se apaga con la madrugada: en el acto 6 casi no queda nada
  const amberMix = interpolate(gFrame, [A5, A6 + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam = camAt(gFrame);

  return (
    <AbsoluteFill>
      {/* ── LA ATMÓSFERA: se monta UNA vez, sólo evoluciona la luz ────────────────────────── */}
      <VoltAtmos tint={light(cool, "volt", "sky")} tint2={light(amberMix, "amber", "sky")}
        keyFrom={keyFrom} intensity={inten} floor={floorDim} />

      <Layers cam={cam}>
        {/* ═══ ACTO 1 · el billete de 67 se abre en tajadas y la grande se va ═════════════ */}
        {acto === 1 && (() => {
          const land = clamp01(f / 30);                 // el billete macizo se apoya
          const fan = clamp01((f - 34) / 52);           // se abanica en tres tajadas
          const fly = clamp01((f - 96) / 78);           // la de 53,80 se despega y se va
          const tape = clamp01((f - 108) / 60);         // la cinta de 190 kWh se vacía del reloj
          const slices = [
            { v: "53,80", h: 156, tint: V.volt, nota: "FRANJA PUNTA" },
            { v: "8,28", h: 46, tint: V.amber, nota: "POTENCIA" },
            { v: "5", h: 34, tint: V.bone, nota: "CONGELADOR" },
          ];
          return (
            <>
              <Plane z={-580}><PhotoPlane src={M.hombroF} kind="photo" z={0} scale={1.3} dim={0.7} tint={V.volt} /></Plane>
              {/* EL RELOJ TARIFARIO insinuado arriba: la franja punta que se vacía (es un gráfico) */}
              <Plane z={-120}>
                <AbsoluteFill>
                  <svg width="100%" height="100%" viewBox="0 0 1920 1080" style={{ position: "absolute", left: 0, top: 0 }}>
                    <path d="M 300 168 A 420 420 0 0 1 1620 168" fill="none" stroke={rgba(V.white, 0.16)} strokeWidth={16} strokeLinecap="round" />
                    <path d="M 300 168 A 420 420 0 0 1 1620 168" fill="none" stroke={V.danger} strokeWidth={16} strokeLinecap="round"
                      pathLength={1} strokeDasharray={1} strokeDashoffset={0.62 + 0.38 * tape}
                      style={{ filter: `drop-shadow(0 0 20px ${rgba(V.danger, 0.7)})` }} />
                  </svg>
                </AbsoluteFill>
                <IconPng src={M.icReloj} x={16} y={9} size={92} z={0} opacity={0.72} glow={V.ink0} />
              </Plane>
              {/* LA TARJETA QUE SOSTIENE EL BILLETE: la factura real */}
              <Plane z={-40}>
                <MediaCard src={M.facturaF} kind="photo" w={720} h={430} x={46} y={eio(70, 62, land)} z={0}
                  ry={-13} rx={eio(16, 7, land)} lit={0.92} litColor={V.volt} label="LA FACTURA DE 44" sheenAt={toCF(14)} radius={10} />
              </Plane>
              {/* EL BILLETE MACIZO DE 67 → se abre en tajadas */}
              <Plane z={140}>
                {fan < 0.06 && (
                  <Tajada x={46} y={eio(56, 47, land)} w={660} h={eio(150, 214, land)} tint={V.volt} value="67" nota="ESTE MES" />
                )}
                {fan >= 0.06 && slices.map((s, i) => {
                  const gap = eio(0, 1, fan);
                  const yy = 47 + (i - 1) * pc(122) * gap;
                  const goX = i === 0 ? eio(46, 84, fly) : 46;
                  const goY = i === 0 ? yy - pc(96) * eio(0, 1, fly) : yy;
                  const w = i === 0 ? eio(660, 452, fly) : 660 - i * 60;
                  return (
                    <Tajada key={s.v} x={goX} y={goY} w={w} h={s.h} tint={s.tint}
                      value={s.v} nota={s.nota} z={i === 0 ? 90 * eio(0, 1, fly) : 0}
                      rot={i === 0 ? eio(0, -5, fly) : 0} />
                  );
                })}
                {/* LA CINTA DE 190 kWh que la tajada arrastra detrás: sale de la franja punta */}
                {fly > 0.04 && (
                  <div style={{
                    position: "absolute", left: `${lerp(46, 62, eio(0, 1, fly)).toFixed(2)}%`,
                    top: `${(47 - pc(96) * eio(0, 1, fly)).toFixed(2)}%`,
                    width: 560 * eio(0, 1, fly), height: 22, marginTop: -11,
                    background: `linear-gradient(90deg, ${rgba(V.danger, 0)} 0%, ${rgba(V.danger, 0.62)} 40%, ${rgba(V.volt, 0.8)} 100%)`,
                    boxShadow: `0 0 30px ${rgba(V.danger, 0.42)}`,
                    transform: "rotate(-5deg)", transformOrigin: "left center",
                  }} />
                )}
              </Plane>
              <Plane z={260}>
                <Readout value="67" unit="$" label="DE ESOS" at={toCF(12)} x={16} y={30} size={132} color={V.volt} />
                {fly > 0.12 && <Readout value="53,80" unit="$" at={toCF(102)} x={82} y={20} size={112} color={V.volt} />}
                {tape > 0.3 && <Readout value="190" unit="kWh" label="SACADOS DE PUNTA" at={toCF(140)} x={72} y={80} size={92} color={V.danger} />}
                <IconPng src={M.icBillete} x={16} y={45} size={104} z={0} opacity={clamp01((f - 22) / 12) * 0.9} glow={V.ink0} />
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 2 · la tajada aterriza y el peldaño CEDE: la casa baja un escalón ═════ */}
        {acto === 2 && (() => {
          const hit = clamp01(f / 14);                  // la tajada que venía viajando toca el peldaño
          const ceder = clamp01((f - 16) / 40);         // el peldaño cede y toda la casa baja
          const marker = clamp01((f - 40) / 22);        // el renglón subrayado a marcador
          const drop = eio(0, 154, ceder);
          return (
            <>
              <Plane z={-600}><PhotoPlane src={M.vueltaF} kind="photo" z={0} scale={1.26} dim={0.74} tint={V.volt} /></Plane>
              {/* EL ESCALÓN DE PRECIO: dos peldaños de hormigón. Es un objeto, no una tarjeta. */}
              <Plane z={-60}>
                <div style={{
                  position: "absolute", left: 0, top: 640 + drop, width: 1180, height: 440,
                  background: `linear-gradient(180deg, ${rgba(V.concrete, 0.3)} 0%, ${rgba(V.ink1, 1)} 22%)`,
                  borderTop: `4px solid ${rgba(V.volt, 0.72)}`,
                  boxShadow: `0 -18px 60px ${rgba(V.ink0, 0.86)}`,
                }} />
                <div style={{
                  position: "absolute", left: 1000, top: 794, width: 920, height: 286,
                  background: `linear-gradient(180deg, ${rgba(V.concrete, 0.22)} 0%, ${rgba(V.ink1, 1)} 22%)`,
                  borderTop: `4px solid ${rgba(V.sky, 0.6)}`,
                  boxShadow: `0 -18px 60px ${rgba(V.ink0, 0.86)}`,
                }} />
              </Plane>
              {/* LA CONTRAHUELLA con la tarjeta de la FOTO REAL del dorso + el renglón subrayado */}
              <Plane z={40}>
                <MediaCard src={M.dorsoF} kind="photo" w={430} h={262} x={38} y={pc(772 + drop)} z={0}
                  ry={4} rx={-6} lit={0.95} litColor={V.volt} label="EL DORSO" sheenAt={toCF(26)} radius={8} />
                <div style={{
                  position: "absolute", left: "38%", top: `${(pc(772 + drop) + pc(58)).toFixed(2)}%`, width: 340, marginLeft: -170,
                  height: 12, borderRadius: 6, transformOrigin: "left center",
                  transform: `scaleX(${marker.toFixed(3)}) rotate(-1.4deg)`,
                  background: `linear-gradient(90deg, ${rgba(V.amber, 0.72)}, ${rgba(V.amber, 0.5)})`,
                  boxShadow: `0 0 22px ${rgba(V.amber, 0.5)}`,
                }} />
              </Plane>
              {/* LA CASA, en su tarjeta con foto real, bajando el escalón entero */}
              <Plane z={180}>
                <MediaCard src={M.fachadaF} kind="photo" w={392} h={244} x={26} y={pc(500 + drop)} z={0}
                  ry={9} lit={0.9} litColor={V.amber} label="MI CASA" sheenAt={toCF(8)} radius={8} />
                {/* la tajada que venía viajando: se posa sobre el peldaño y lo hunde */}
                <Tajada x={eio(78, 55, hit)} y={pc(eio(320, 596, hit) + drop)} w={452} h={156} tint={V.volt}
                  value="53,80" nota="FRANJA PUNTA" rot={eio(-5, 0, hit)} z={40} />
              </Plane>
              <Plane z={280}>
                <div style={{ position: "absolute", left: "70%", top: "22%", transform: "translate(-50%,0)", opacity: clamp01((f - 46) / 14) }}>
                  <Head size={68} color={V.bone}>ABAJO DEL ESCALÓN</Head>
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 3 · dentro de la cinta de precio: 34 rueda hasta 27 ══════════════════ */}
        {acto === 3 && (() => {
          const out = clamp01(f / 26);                  // salimos del push, ya adentro de la cinta
          const roll = clamp01((f - 44) / 52);          // el odómetro rueda 34 → 27
          const shrink = clamp01((f - 70) / 44);        // las barras que quedaron en punta se encogen
          const curl = clamp01((f - 132) / 44);         // la cinta EMPIEZA a enroscarse (frontera C)
          return (
            <>
              <Plane z={-640}><PhotoPlane src={M.pinzaV} kind="video" startFrom={16} z={0} scale={1.34} dim={0.78} tint={V.volt} /></Plane>
              {/* LA CINTA DE PRECIO: la banda por la que se desliza la cifra */}
              <Plane z={-40}>
                <div style={{
                  position: "absolute", left: "50%", top: 402, width: 1740, height: 264, marginLeft: -870,
                  transform: `perspective(1200px) rotateX(${(eio(24, 4, out) + curl * 44).toFixed(2)}deg) scaleY(${(1 - curl * 0.34).toFixed(3)})`,
                  transformOrigin: "50% 100%",
                  background: `linear-gradient(180deg, ${rgba(V.volt, 0.16)} 0%, ${rgba(V.ink1, 0.99)} 34%, ${rgba(V.ink0, 1)} 100%)`,
                  borderTop: `3px solid ${rgba(V.volt, 0.86)}`,
                  boxShadow: `0 34px 80px ${rgba(V.ink0, 0.9)}, inset 0 0 90px ${rgba(V.ink0, 0.7)}`,
                }} />
              </Plane>
              {/* EL ODÓMETRO: la cifra se desliza a la izquierda y rueda dígito por dígito */}
              <Plane z={160}>
                <div style={{
                  position: "absolute", left: `${lerp(62, 40, eio(0, 1, roll)).toFixed(2)}%`, top: "44%",
                  transform: "translate(-50%,-50%)", display: "flex", gap: 8, alignItems: "center",
                  opacity: 1 - curl * 0.5,
                }}>
                  <Roll from={3} to={2} p={eio(0, 1, roll)} size={168} color={V.volt} />
                  <Roll from={4} to={-3} p={eio(0, 1, roll)} size={168} color={V.volt} />
                  <div style={{ fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 96, color: rgba(V.volt, 0.8), marginLeft: 8 }}>¢</div>
                </div>
              </Plane>
              {/* LAS POCAS BARRAS QUE QUEDARON EN PUNTA, encogiéndose a la altura nueva */}
              <Plane z={60}>
                {[0, 1, 2, 3].map((i) => {
                  const h0 = 208 - i * 16;
                  const hh = lerp(h0, h0 * 0.79, eio(0, 1, clamp01(shrink - i * 0.1)));
                  return (
                    <div key={i} style={{
                      position: "absolute", left: 1210 + i * 118, top: 856 - hh, width: 78, height: hh,
                      background: `linear-gradient(180deg, ${rgba(V.danger, 0.4)}, ${rgba(V.ink1, 0.99)})`,
                      borderTop: `3px solid ${rgba(V.danger, 0.85)}`,
                      boxShadow: `0 16px 34px ${rgba(V.ink0, 0.85)}`,
                    }} />
                  );
                })}
              </Plane>
              {/* la tarjeta del dorso sigue ahí, ahora VISTA DE CANTO, con la luz fría en el filo */}
              <Plane z={220}>
                <MediaCard src={M.dorsoF} kind="photo" w={430} h={262} x={eio(38, 15, out)} y={72} z={0}
                  ry={eio(4, -74, out)} lit={0.8} litColor={V.sky} sheenAt={toCF(30)} radius={8} />
                <div style={{ position: "absolute", left: "58%", top: "16%", transform: "translate(-50%,0)", opacity: clamp01((f - 12) / 12) }}>
                  <Kick color={V.bone}>LOS POCOS QUE QUEDARON EN PUNTA</Kick>
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 4 · la cinta enrollada es el DIAL de la potencia contratada ══════════ */}
        {acto === 4 && (() => {
          const form = clamp01(f / 22);                 // el aro termina de formarse desde la cinta
          const notch = interpolate(f, [26, 38, 44, 56, 62], [0, -16, -17.5, -33, -34], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.7, 0, 0.2, 1),
          });
          const fall = clamp01((f - 66) / 40);          // la tajada de 8,28 se desprende y cae a la pila
          const R = eio(180, 300, form);
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.facturaF} kind="photo" z={0} scale={1.32} dim={0.78} tint={V.volt} /></Plane>
              {/* EL ARO METÁLICO: la cinta del acto 3 enrollada sobre sí misma */}
              <Plane z={0}>
                <div style={{
                  position: "absolute", left: "40%", top: "48%", width: R * 2, height: R * 2,
                  marginLeft: -R, marginTop: -R, borderRadius: "50%",
                  transform: `rotate(${notch.toFixed(2)}deg)`,
                  background: `conic-gradient(from 200deg, ${rgba(V.concrete, 0.7)}, ${rgba(V.ink0, 0.98)} 30%, ${rgba(V.volt, 0.5)} 52%, ${rgba(V.ink0, 0.98)} 78%, ${rgba(V.concrete, 0.7)})`,
                  boxShadow: `0 34px 80px ${rgba(V.ink0, 0.9)}, inset 0 0 60px ${rgba(V.ink0, 0.86)}`,
                  opacity: form,
                }}>
                  {/* las muescas del dial: esto SÍ es un instrumento, va en vector */}
                  {Array.from({ length: 18 }, (_, i) => (
                    <div key={i} style={{
                      position: "absolute", left: "50%", top: -12, width: 4, height: 26, marginLeft: -2,
                      background: rgba(i === 4 ? V.volt : V.bone, i === 4 ? 0.95 : 0.42),
                      transformOrigin: `50% ${R + 12}px`, transform: `rotate(${i * 20}deg)`,
                    }} />
                  ))}
                </div>
                {/* la aguja fija que lee el dial (no gira: gira el aro) */}
                <div style={{
                  position: "absolute", left: "40%", top: `calc(48% - ${R + 46}px)`, width: 5, height: 44, marginLeft: -2.5,
                  background: rgba(V.volt, 0.95), boxShadow: `0 0 22px ${rgba(V.volt, 0.8)}`, opacity: form,
                }} />
              </Plane>
              {/* LA TARJETA ADENTRO DEL ARO: la FOTO REAL de la caja de medidores de la casa */}
              <Plane z={120}>
                <MediaCard src={M.breakersF} kind="photo" w={Math.round(R * 1.5)} h={Math.round(R * 1.5)} x={40} y={48} z={0}
                  ry={-3} lit={1} litColor={V.volt} radius={Math.round(R)} sheenAt={toCF(30)} opacity={form} />
                <IconPng src={M.icBreaker} x={40} y={78} size={86} z={0} opacity={0.8 * form} glow={V.ink0} />
              </Plane>
              {/* LA TAJADA NUEVA se desprende del borde y se apila junto a la de 53,80 */}
              <Plane z={220}>
                {fall > 0 && (
                  <Tajada x={eio(52, 78, fall)} y={pc(eio(430, 748, fall))} w={eio(300, 430, fall)} h={46}
                    tint={V.amber} value="8,28" nota="POTENCIA" rot={eio(-12, 0, fall)} />
                )}
                {fall > 0.55 && (
                  <Tajada x={78} y={pc(838)} w={452} h={156} tint={V.volt} value="53,80" nota="FRANJA PUNTA" opacity={0.9} />
                )}
                <Readout value="8,28" unit="$" label="BAJÉ LA POTENCIA" at={toCF(70)} x={20} y={26} size={112} color={V.amber} />
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 5 · la tajada de 5 no se deja apilar: LA HONESTIDAD ══════════════════ */}
        {acto === 5 && (() => {
          const push5 = clamp01(f / 34);                // la tajada de 5 se sale sola del bloque
          const cold = clamp01((f - 24) / 40);          // se enfría de ámbar a gris
          const linea = clamp01((f - 46) / 26);         // la línea voltio que no las deja tocarse
          const desenf = clamp01((f - 40) / 34);        // la pila sigue apilándose desenfocada al fondo
          return (
            <>
              <Plane z={-640}><PhotoPlane src={M.hombroF} kind="photo" z={0} scale={1.3} dim={0.8} tint={V.volt} /></Plane>
              {/* LA PILA que sigue creciendo, cada vez más al fondo y fuera de foco */}
              <Plane z={-180}>
                <Tajada x={28} y={pc(760)} w={452} h={156} tint={V.volt} value="53,80" blur={6 * desenf} opacity={1 - 0.25 * desenf} />
                <Tajada x={28} y={pc(646)} w={430} h={46} tint={V.amber} value="8,28" blur={6 * desenf} opacity={1 - 0.25 * desenf} />
                <MediaCard src={M.facturaF} kind="photo" w={330} h={206} x={28} y={pc(410)} z={0} ry={11}
                  lit={0.5} litColor={V.volt} opacity={1 - 0.4 * desenf} radius={8} />
              </Plane>
              {/* LA LÍNEA VOLTIO: separa y NO las deja tocarse (es un gráfico, va en vector) */}
              <Plane z={60}>
                <div style={{
                  position: "absolute", left: "48%", top: "22%", width: 4, height: `${(56 * linea).toFixed(1)}%`,
                  background: `linear-gradient(180deg, ${rgba(V.volt, 0)}, ${rgba(V.volt, 0.85)} 20%, ${rgba(V.volt, 0.85)} 80%, ${rgba(V.volt, 0)})`,
                  boxShadow: `0 0 26px ${rgba(V.volt, 0.6)}`,
                }} />
              </Plane>
              {/* LA TAJADA EXPULSADA, ya gris, con su tarjeta chica de FOTO REAL adentro */}
              <Plane z={220}>
                <Tajada x={eio(34, 72, push5)} y={pc(eio(690, 540, push5))} w={eio(430, 356, push5)} h={34}
                  tint={light(cold, "amber", "sky")} value="5" nota="NO ES LA BATERÍA" rot={eio(0, 3, push5)} />
                <MediaCard src={M.gomaF} kind="photo" w={330} h={206} x={72} y={pc(730)} z={0} ry={-8}
                  lit={0.5 + 0.5 * (1 - cold)} litColor={light(cold, "amber", "sky")} label="LA GOMA DE 3 DÓLARES"
                  sheenAt={toCF(40)} radius={8} opacity={clamp01((f - 22) / 18)} />
                <IconPng src={M.icCongelador} x={72} y={pc(310)} size={96} z={0} opacity={0.72 * clamp01((f - 30) / 14)} glow={V.ink0} />
              </Plane>
              <Plane z={300}>
                <div style={{ position: "absolute", left: "72%", top: "17%", transform: "translate(-50%,0)", opacity: clamp01((f - 54) / 14), textAlign: "center" }}>
                  <Head size={58} color={V.bone}>Y TE LO DIGO IGUAL</Head>
                </div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 6 · LA RESTA: la raya del cuaderno es la barra, y la pila baja ═══════ */}
        {acto === 6 && (() => {
          const raya = clamp01(f / 30);                 // la raya del cuaderno se estira: es la barra
          const carga = clamp01((f - 30) / 130);        // la caja carga toda la madrugada
          const baja = eio(0, 92, clamp01((f - 40) / 130));  // por cada tramo que se llena, la pila baja
          const mins = Math.round(lerp(60, 390, carga));
          const hh = Math.floor(mins / 60), mm = mins % 60;
          const reloj = `${hh}:${mm < 10 ? "0" : ""}${mm}`;
          return (
            <>
              <Plane z={-660}><PhotoPlane src={M.cuadernoF} kind="photo" z={0} scale={1.28} dim={0.84} tint={V.sky} /></Plane>
              {/* LA MADRUGADA: azul de calle por debajo del portón, la lámpara desnuda apagada */}
              <Plane z={-420}>
                <AbsoluteFill style={{ background: `linear-gradient(0deg, ${rgba(V.sky, 0.24)} 0%, rgba(0,0,0,0) 26%)` }} />
                <div style={{
                  position: "absolute", left: 0, right: 0, bottom: 96, height: 30,
                  background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.sky, 0.5)} 30%, ${rgba(V.sky, 0.5)} 70%, rgba(0,0,0,0))`,
                  filter: "blur(7px)",
                }} />
              </Plane>
              {/* LA PILA, que ahora baja: es el mismo objeto del acto 5, no uno nuevo */}
              <Plane z={40}>
                <Tajada x={34} y={pc(700 + baja)} w={452} h={eio(156, 118, clamp01((f - 40) / 130))} tint={V.volt} value="53,80" />
                <Tajada x={34} y={pc(600 + baja)} w={430} h={46} tint={V.amber} value="8,28" opacity={0.94} />
                {/* LA BARRA DE LA RESTA: la raya que él acaba de trazar en el cuaderno */}
                <div style={{
                  position: "absolute", left: "34%", top: `${pc(786 + baja).toFixed(2)}%`, width: 520, marginLeft: -260, height: 9,
                  transformOrigin: "left center", transform: `scaleX(${raya.toFixed(3)})`,
                  background: `linear-gradient(90deg, ${rgba(V.bone, 0.9)}, ${rgba(V.bone, 0.62)})`,
                  boxShadow: `0 4px 18px ${rgba(V.ink0, 0.9)}`,
                }} />
                {/* la tajada FRÍA que se descuenta desde abajo: en azul, NUNCA en voltio */}
                {carga > 0.04 && (
                  <Tajada x={34} y={pc(844 + baja)} w={eio(120, 452, clamp01(carga * 1.3))} h={40}
                    tint={V.sky} value="− 10,08" nota="FRANJA VALLE" />
                )}
                <IconPng src={M.icCuaderno} x={11} y={pc(700)} size={88} z={0} opacity={0.6 * raya} glow={V.ink0} />
              </Plane>
              {/* LA CAJA GRIS CARGANDO AL FONDO, en su tarjeta con material real, con su barra */}
              <Plane z={-160}>
                <MediaCard src={M.cargaV} kind="video" w={472} h={288} x={76} y={40} z={0} ry={-14}
                  startFrom={10} lit={0.7} litColor={V.sky} label="CARGANDO EN VALLE" sheenAt={toCF(24)} radius={8} />
                <div style={{
                  position: "absolute", left: "76%", top: `${pc(586).toFixed(2)}%`, width: 472, marginLeft: -236, height: 16,
                  background: rgba(V.ink0, 0.85), boxShadow: `inset 0 0 14px ${rgba(V.ink0, 0.9)}`, borderRadius: 8, overflow: "hidden",
                }}>
                  <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0, width: `${(carga * 100).toFixed(1)}%`,
                    background: `linear-gradient(90deg, ${rgba(V.sky, 0.66)}, ${rgba(V.sky, 0.95)})`,
                    boxShadow: `0 0 20px ${rgba(V.sky, 0.6)}`,
                  }} />
                </div>
              </Plane>
              {/* EL RELOJ DE PARED, chiquito en la esquina, corriendo de 1:00 a 6:30 */}
              <Plane z={300}>
                <MediaCard src={M.menosF} kind="photo" w={272} h={172} x={13} y={22} z={0} ry={10}
                  lit={0.62} litColor={V.sky} label="Y AHORA RESTA" sheenAt={toCF(16)} radius={8} />
                <div style={{
                  position: "absolute", right: 54, bottom: 44, textAlign: "right",
                  fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 52, letterSpacing: 3,
                  color: rgba(V.sky, 0.86), textShadow: "0 4px 20px rgba(0,0,0,0.94)",
                }}>{reloj}</div>
                <IconPng src={M.icReloj} x={91} y={83} size={70} z={0} opacity={0.6} glow={V.ink0} />
              </Plane>
            </>
          );
        })()}
      </Layers>
    </AbsoluteFill>
  );
};
