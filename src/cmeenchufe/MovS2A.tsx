// MovS2A.tsx — MOVIMIENTO S2A · "EL TRASVASE"
// Video `cmeenchufe` (Claudio Mendoza Constructor, ES). 7 actos · 167.040 → 288.220 ms · 3635 frames @30.
//
// LA IDEA (la más importante del video): la caja NO genera energía. La MUEVE EN EL TIEMPO.
// Compra el kilovatio de las 2 de la madrugada a 6 y te lo devuelve a las 8 de la noche, cuando vale 34.
// Y el reverso: si tu compañía te cobra siempre lo mismo, el trasvase no gana nada y encima pierde
// el 12 % por el camino. No falla la caja: falla que no haya diferencia que aprovechar.
//
// EL OBJETO QUE CRUZA LAS SEIS FRONTERAS: **EL CAÑO**, que es una tarjeta con la FOTO REAL de la caja gris.
//   acto 1 → dos vasijas de vidrio (adentro corre MATERIAL REAL: la calle a las 2 AM y el pasillo
//            encendido de las 8 PM) y entre ellas el caño; el líquido voltio pasa y el total no cambia;
//   acto 2 → la cámara BAJA por el mismo caño y abajo corren las dos cintas de precio: 6 contra 34;
//   acto 3 → la cámara SUBE por el mismo caño y ahora las dos cintas marcan lo mismo: se derrama el 12 %;
//   acto 4 → el derrame cae en negro y de ese negro se abre la boca de Ernesto: dos enchufes reales;
//   acto 5 → las dos monedas que cayeron ruedan al centro y vuelven a entrar las vasijas, ya en sodio;
//   acto 6 → sobre las dos monedas de canto cae UNA sola, grande y fría: 34;
//   acto 7 → epílogo: la vasija entera de las 2 AM entra por la tapa de la caja y se queda adentro.
//
// UNA cámara: `camAt(gFrame)` — un solo `gcam` monótono (z −260 → +520) + una grúa continua que BAJA
// por el caño hasta las cintas de precio, VUELVE A SUBIR por el mismo caño y sigue trepando hasta el
// remate de las monedas, y sólo al final cae sobre la caja en la vereda. Como es función pura de
// `gFrame`, sigue viajando durante los clips reales que van entre acto y acto: el acto 4 empieza
// exactamente donde la dejó el acto 3, 61 s después. NUNCA vuelve a cero.
// UNA atmósfera: `<VoltAtmos/>` montada una sola vez, fuera del switch de actos.
// LA LUZ: VOLT (la medición) → se enfría a SKY cuando entra la cinta cara desde ARRIBA → y a partir
// de la risa de Ernesto vira a NARANJA DE SODIO desde arriba a la derecha (la calle). Evoluciona.
//
// ══════════════════════════════════════════════════════════════════════════════════════════════
// TABLA DE HANDOFF
// ══════════════════════════════════════════════════════════════════════════════════════════════
// ACTO 1 · g0-135 · "LA MUEVE EN EL TIEMPO"   material: CLIP calle 2AM + FOTO pasillo prendido + FOTO caja
//   entra  cam {z −260, saliendo de la tapa de la caja}     luz {VOLT, key 0.20, int 0.86}
//   sale   cam {grúa +26, las dos vasijas llenas de cuadro} luz {VOLT}
//   ── FRONTERA A ···· MATCH-MOVE: la cámara sigue BAJANDO por el mismo caño. ················
// ACTO 2 · g140-299 · "NADA MÁS"              material: las 2 vasijas + el caño + CLIP medidor
//   entra  cam {grúa bajando, −40}                          luz {VOLT enfriándose}
//   sale   cam {grúa −180, debajo de las vasijas}           luz {SKY, la cinta cara desde arriba}
//   ── FRONTERA B ···· MATCH-MOVE INVERSO: sube por el MISMO caño; cambian las cintas, no el caño. ··
// ACTO 3 · g614-746 · "+12 %"                 material: las 2 vasijas + el caño
//   entra  cam {grúa −140, mirando el caño desde abajo}     luz {SKY, key 0.34}
//   sale   cam {grúa +100, arriba del borde que derrama}    luz {SKY virando a sodio}
//   ── FRONTERA C ···· OCLUSIÓN: el derrame cae y ese negro se abre en la boca de Ernesto. ···
// ACTO 4 · g2447-2612 · "LA COMPRAS DOS VECES"  material: FOTO tu enchufe + CLIP dedo en el tomacorriente
//   entra  cam {saliendo de la boca, push 1.34 → 1}         luz {SODIO desde arriba a la derecha}
//   sale   cam {grúa +90, las dos monedas ya cayeron}       luz {SODIO, key 0.84}
//   ── FRONTERA D ···· LAS MONEDAS RUEDAN: los mismos dos objetos cruzan la frontera. ········
// ACTO 5 · g2637-2817 · "DOS VECES A 6"       material: las 2 vasijas + el caño, ya en sodio
//   entra  cam {grúa +96, las monedas parándose de canto}   luz {SODIO}
//   sale   cam {grúa +210, subiendo}                        luz {SODIO pleno}
//   ── FRONTERA E ···· MATCH-MOVE: la cámara termina de subir y algo cae desde arriba. ·······
// ACTO 6 · g2913-3069 · "6 + 6  CONTRA  34"   material: CLIP la cuenta en el capó (la superficie)
//   entra  cam {grúa +232, sobre la chapa del capó}         luz {SODIO abajo · FRÍO arriba}
//   sale   cam {grúa +300, la moneda fría llenando cuadro}  luz {frío arriba, sodio abajo}
//   ── FRONTERA F ···· MATCH-CUT DE ESCALA: el disco frío del 34 = el farol de sodio de la calle. ··
// ACTO 7 · g3527-3635 · epílogo sin una sola palabra   material: CLIP caja en la vereda + la vasija entera
//   entra  cam {bajando del farol, push 1 → 1.5 sobre la tapa}  luz {sodio de calle}
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
const A1 = 0, A2 = 140, A3 = 614, A4 = 2447, A5 = 2637, A6 = 2913, A7 = 3527;
const G_END = 3635;
const START: Record<number, number> = { 1: A1, 2: A2, 3: A3, 4: A4, 5: A5, 6: A6, 7: A7 };

const pc = (px: number) => (px / 1080) * 100;   // px verticales → % de pantalla

// ── EL MATERIAL REAL (todas verificadas en disco) ────────────────────────────────────────────
const M = {
  madrugadaV: "broll/cmeenchufe/cmee_s2_calle_dos_madrugada.mp4",
  nocheF: "img/cmeenchufe/cmee_s9_pasillo_todo_prendido.png",
  cajaF: "img/cmeenchufe/cmee_s2_palma_sobre_caja.png",
  celdasF: "img/cmeenchufe/cmee_s2_caja_abierta_celdas.png",
  medidorV: "broll/cmeenchufe/cmee_s4_medidor_digitos.mp4",
  enchufeF: "img/cmeenchufe/cmee_s2_tu_enchufe.png",
  enchufeV: "broll/cmeenchufe/cmee_s2_dedo_tomacorriente.mp4",
  risaV: "broll/cmeenchufe/cmee_s2_ernesto_rie.mp4",
  capoV: "broll/cmeenchufe/cmee_s2_cuenta_en_el_capo.mp4",
  capoF: "img/cmeenchufe/cmee_s2_capo_ernesto_descruza.png",
  veredaV: "broll/cmeenchufe/cmee_s2_baja_caja_camioneta.mp4",
  fachadaF: "img/cmeenchufe/cmee_s1_fachada_noche.png",
  portonF: "img/cmeenchufe/cmee_s2_porton_sube_naranja.png",
  icRegla: "img/cmeenchufe/cmee_ic_regla.png",
  icMoneda: "img/cmeenchufe/cmee_ic_moneda.png",
  icReloj: "img/cmeenchufe/cmee_ic_reloj.png",
  icEnchufe: "img/cmeenchufe/cmee_ic_enchufe.png",
};

// ── LA CÁMARA · una sola función de gFrame, monótona, que nunca vuelve a cero ────────────────
const camAt = (g: number) => {
  const gg = Math.min(g, G_END);
  const base = gcam(gg, { z0: -260, z1: 520, panX: -120, panY: -26, ry: -6, rx: 1.8, dur: G_END });
  // LA GRÚA (positivo = la cámara sube): baja por el caño, vuelve a subir por el MISMO caño,
  // sigue trepando hasta el remate de las monedas y sólo al final cae sobre la caja de la vereda.
  const crane = interpolate(
    gg,
    [0, 135, 260, 614, 746, 2447, 2612, 2637, 2817, 2913, 3069, 3527, 3635],
    [0, 26, -180, -140, 100, 66, 90, 96, 210, 232, 300, 150, -80],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.24, 1) },
  );
  // DOS entradas en un detalle: salimos de la boca de Ernesto (acto 4) y entramos en la caja (acto 7).
  const sc = interpolate(gg, [0, 746, A4 - 40, A4 + 44, A7, A7 + 96], [1, 1, 1.34, 1, 1, 1.5], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.55, 0, 0.35, 1),
  });
  const fy = interpolate(gg, [0, A4 + 44, A7], [46, 46, 58], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ty = (50 - fy) * (sc - 1);
  return `${base.transform} translateY(${crane.toFixed(1)}px) translate(0%, ${ty.toFixed(2)}%) scale(${sc.toFixed(3)})`;
};

// ── LAS DOS VASIJAS: vidrio con MATERIAL REAL adentro y el líquido voltio leyéndose ENCIMA ───
// la micro-deriva se replica exacta a la de MediaCard para que el líquido no se despegue del vidrio
const dY = (frame: number, x: number) => Math.sin(frame / 41 + x) * 2.4;
const dR = (frame: number, y: number) => Math.sin(frame / 67 + y) * 0.5;

const Vessel: React.FC<{
  src: string; kind: "video" | "photo"; x: number; y: number; w: number; h: number;
  fill: number; tint: string; label?: string; startFrom?: number; sheenAt?: number; z?: number; ry?: number;
  warmFromBelow?: number;
}> = ({ src, kind, x, y, w, h, fill, tint, label, startFrom = 0, sheenAt = -999, z = 0, ry = 0, warmFromBelow = 0 }) => {
  const frame = useCurrentFrame();
  const lv = clamp01(fill);
  const t = `translateZ(${z}px) rotateY(${(ry + dR(frame, y)).toFixed(2)}deg) translateY(${dY(frame, x).toFixed(2)}px)`;
  const wave = Math.sin(frame / 9) * 1.1 + Math.sin(frame / 5.3) * 0.6;
  return (
    <>
      <MediaCard src={src} kind={kind} w={w} h={h} x={x} y={y} z={z} ry={ry} radius={10}
        lit={0.42 + 0.58 * lv} litColor={tint} label={label} startFrom={startFrom} sheenAt={sheenAt} />
      <div style={{
        position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
        marginLeft: -w / 2, marginTop: -h / 2, transform: t, transformStyle: "preserve-3d",
        borderRadius: 10, overflow: "hidden", pointerEvents: "none",
      }}>
        {/* EL LÍQUIDO: la energía se lee SOBRE el material real que corre adentro del vidrio */}
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0, height: `${(lv * 100).toFixed(2)}%`,
          background: `linear-gradient(180deg, ${rgba(tint, 0.52)} 0%, ${rgba(tint, 0.2)} 44%, ${rgba(tint, 0.4)} 100%)`,
          mixBlendMode: "screen",
        }} />
        {/* el calor que sube desde abajo cuando el líquido YA cruzó (lo que te queda) */}
        {warmFromBelow > 0 && (
          <div style={{
            position: "absolute", left: 0, right: 0, bottom: 0, height: `${(lv * 100).toFixed(2)}%`,
            background: `linear-gradient(0deg, ${rgba(V.amber, 0.46 * warmFromBelow)} 0%, rgba(0,0,0,0) 74%)`,
            mixBlendMode: "screen",
          }} />
        )}
        {/* la superficie del líquido: una línea con ondita, nunca una línea muerta */}
        {lv > 0.006 && lv < 0.994 && (
          <div style={{
            position: "absolute", left: -12, right: -12, bottom: `${(lv * 100).toFixed(2)}%`,
            height: 4, marginBottom: -2, transform: `rotate(${(wave * 0.08).toFixed(3)}deg)`,
            background: `linear-gradient(90deg, ${rgba(tint, 0)}, ${rgba(tint, 0.95)} 18%, ${rgba(V.white, 0.92)} 50%, ${rgba(tint, 0.95)} 82%, ${rgba(tint, 0)})`,
            boxShadow: `0 0 24px ${rgba(tint, 0.85)}`,
          }} />
        )}
        {/* que se lea VIDRIO: los dos cantos verticales */}
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 11, background: `linear-gradient(90deg, ${rgba(V.white, 0.22)}, rgba(255,255,255,0))` }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 11, background: `linear-gradient(270deg, ${rgba(V.white, 0.15)}, rgba(255,255,255,0))` }} />
      </div>
    </>
  );
};

// ── EL CAÑO: una tarjeta con la FOTO REAL de la caja gris. NO se mueve en todo el movimiento. ─
const Pipe: React.FC<{
  x: number; y: number; w: number; h: number; flow: number; running: boolean; tint: string; sheenAt?: number;
}> = ({ x, y, w, h, flow, running, tint, sheenAt = -999 }) => {
  const frame = useCurrentFrame();
  const t = `rotateY(${dR(frame, y).toFixed(2)}deg) translateY(${dY(frame, x).toFixed(2)}px)`;
  const band = ((frame * 9) % (w + 300)) - 150;
  return (
    <>
      <MediaCard src={M.cajaF} kind="photo" w={w} h={h} x={x} y={y} radius={10}
        lit={0.72 + 0.28 * clamp01(flow)} litColor={tint} label="LA CAJA" sheenAt={sheenAt} />
      <div style={{
        position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
        marginLeft: -w / 2, marginTop: -h / 2, transform: t,
        borderRadius: 10, overflow: "hidden", pointerEvents: "none",
      }}>
        {/* el nivel que ya pasó por adentro, leyéndose sobre la foto real de la caja */}
        <div style={{
          position: "absolute", left: 0, top: "26%", height: "48%", width: `${(clamp01(flow) * 100).toFixed(1)}%`,
          background: `linear-gradient(180deg, ${rgba(tint, 0.16)}, ${rgba(tint, 0.46)} 52%, ${rgba(tint, 0.14)})`,
          mixBlendMode: "screen",
        }} />
        {running && (
          <div style={{
            position: "absolute", top: "26%", height: "48%", left: band, width: 150,
            background: `linear-gradient(90deg, rgba(0,0,0,0), ${rgba(V.white, 0.42)} 50%, rgba(0,0,0,0))`,
            mixBlendMode: "screen",
          }} />
        )}
        <div style={{ position: "absolute", left: 0, right: 0, top: "26%", height: 2, background: rgba(tint, 0.5) }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: "74%", height: 2, background: rgba(tint, 0.5) }} />
      </div>
    </>
  );
};

// ── LAS BOQUILLAS: esto SÍ es un esquema (une dos objetos), así que va en vector ─────────────
const Stub: React.FC<{ x0: number; x1: number; y: number; tint: string; on: number }> = ({ x0, x1, y, tint, on }) => (
  <div style={{
    position: "absolute", left: `${Math.min(x0, x1)}%`, top: `${y}%`, width: `${Math.abs(x1 - x0)}%`,
    height: 16, marginTop: -8,
    background: `linear-gradient(180deg, ${rgba(tint, 0.1)}, ${rgba(tint, 0.34 + 0.4 * on)} 50%, ${rgba(tint, 0.1)})`,
    boxShadow: `0 0 ${(16 + 22 * on).toFixed(0)}px ${rgba(tint, 0.5 * on)}`,
  }} />
);

// ── LA CINTA DE PRECIO: es un gráfico, va en vector ──────────────────────────────────────────
const PriceTape: React.FC<{
  x: number; y: number; w: number; value: string; unit: string; caption: string; color: string; p: number; from: "top" | "bottom";
}> = ({ x, y, w, value, unit, caption, color, p, from }) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`, width: w, marginLeft: -w / 2,
    transform: `translateY(${lerp(from === "top" ? -46 : 46, 0, p).toFixed(1)}px)`, opacity: p,
  }}>
    <div style={{
      height: 8, background: `linear-gradient(90deg, ${rgba(color, 0)}, ${rgba(color, 0.92)} 14%, ${rgba(color, 0.92)} 86%, ${rgba(color, 0)})`,
      boxShadow: `0 0 26px ${rgba(color, 0.55)}`,
    }} />
    <div style={{
      marginTop: 14, textAlign: "center", fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 96, lineHeight: 0.9,
      color, textShadow: `0 0 40px ${rgba(color, 0.4)}, 0 6px 26px rgba(0,0,0,0.92)`,
    }}>
      {value}<span style={{ fontSize: 40, marginLeft: 8, color: rgba(color, 0.85) }}>{unit}</span>
    </div>
    <div style={{
      marginTop: 4, textAlign: "center", fontFamily: F_BODY, fontWeight: 600, fontSize: 27, letterSpacing: 3.2,
      color: rgba(V.bone, 0.72), textTransform: "uppercase",
    }}>{caption}</div>
  </div>
);

// ── EL DERRAME: lo que se pierde por el camino cuando no hay diferencia que aprovechar ───────
const Spill: React.FC<{ x: number; yTop: number; w: number; p: number }> = ({ x, yTop, w, p }) => {
  const frame = useCurrentFrame();
  if (p <= 0) return null;
  return (
    <>
      <div style={{
        position: "absolute", left: `${x}%`, top: `${yTop}%`, width: w * 0.86, marginLeft: -w * 0.43,
        height: 16, marginTop: -8, borderRadius: 8,
        background: `linear-gradient(90deg, ${rgba(V.volt, 0)}, ${rgba(V.volt, 0.85 * p)} 30%, ${rgba(V.volt, 0.85 * p)} 70%, ${rgba(V.volt, 0)})`,
        boxShadow: `0 0 30px ${rgba(V.volt, 0.6 * p)}`,
      }} />
      {Array.from({ length: 14 }, (_, i) => {
        const o = rnd(i * 4.3);
        const t = clamp01((frame - 6 - i * 2.4) / 44);
        if (t <= 0) return null;
        const fall = t * t * 760;
        return (
          <div key={i} style={{
            position: "absolute", left: `${(x + (o - 0.5) * 13).toFixed(2)}%`, top: `${yTop}%`,
            marginTop: fall, width: 7 + o * 7, height: 12 + o * 16, borderRadius: "50%",
            background: rgba(V.volt, 0.8 * (1 - t) * p), boxShadow: `0 0 18px ${rgba(V.volt, 0.5 * (1 - t))}`,
          }} />
        );
      })}
    </>
  );
};

// ── LA MONEDA: PNG sin fondo como objeto de la escena + su cifra escrita con tipografía ──────
const Coin: React.FC<{ x: number; y: number; size: number; value: string; color: string; rot?: number; opacity?: number; edge?: number }> = ({
  x, y, size, value, color, rot = 0, opacity = 1, edge = 0,
}) => (
  <>
    <div style={{ transform: `scaleX(${lerp(1, 0.24, clamp01(edge)).toFixed(3)})`, transformOrigin: `${x}% 50%` }}>
      <IconPng src={M.icMoneda} x={x} y={y} size={size} opacity={opacity} rot={rot} glow={color} />
    </div>
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, marginTop: size / 2,
      transform: "translate(-50%,-50%)", opacity: opacity * (1 - clamp01(edge) * 0.15),
      fontFamily: F_DISPLAY, fontWeight: 800, fontSize: Math.round(size * 0.42), color,
      textShadow: `0 0 ${Math.round(size * 0.3)}px ${rgba(color, 0.5)}, 0 4px 18px rgba(0,0,0,0.95)`,
    }}>{value}</div>
  </>
);

// ── LETRA TORCIDA DE MANO (acto 4: lo que dice Ernesto, no lo que dice el gráfico) ───────────
const HandText: React.FC<{ words: string[]; x: number; y: number; size: number; color: string; p: number }> = ({
  words, x, y, size, color, p,
}) => (
  <div style={{
    position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-50%)",
    display: "flex", gap: size * 0.28, whiteSpace: "nowrap",
  }}>
    {words.map((w, i) => {
      const a = clamp01((p - i * 0.08) * 4);
      return (
        <span key={w + String(i)} style={{
          fontFamily: F_DISPLAY, fontWeight: 700, fontSize: size, color, opacity: a,
          transform: `rotate(${((rnd(i * 7.3) - 0.5) * 5).toFixed(2)}deg) skewX(-7deg) translateY(${((rnd(i * 3.1) - 0.5) * 12).toFixed(1)}px) scale(${lerp(0.86, 1, a).toFixed(3)})`,
          textShadow: "0 6px 30px rgba(0,0,0,0.94)",
        }}>{w}</span>
      );
    })}
  </div>
);

// ── LA BOCA DE ERNESTO: el negro del derrame se abre y salimos del otro lado (⛔ no es un fade) ─
const MouthIris: React.FC<{ f: number }> = ({ f }) => {
  const r = interpolate(f, [0, 15], [0, 176], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.5, 0, 0.7, 0.4) });
  if (r >= 174) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 46%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) ${r.toFixed(1)}%, ${rgba(V.ink0, 0.99)} ${(r + 7).toFixed(1)}%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 46%, rgba(0,0,0,0) ${(r * 0.86).toFixed(1)}%, ${rgba(V.danger, 0.16)} ${r.toFixed(1)}%, rgba(0,0,0,0) ${(r + 9).toFixed(1)}%)`, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

// ── GEOMETRÍA COMPARTIDA DE LAS DOS VASIJAS Y EL CAÑO (idéntica en actos 1, 2, 3 y 5) ────────
const VX_L = 19, VX_R = 81, VY = 44, VW = 400, VH = 340;
const PX = 50, PY_W = 520, PH = 138;

export const MovS2A: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  const cf = useCurrentFrame();
  const f = gFrame - (START[acto] ?? 0);    // frame LOCAL del acto (robusto a cómo lo monte el Main)
  const toCF = (t: number) => cf - f + t;   // pasa un frame mío al reloj interno de las primitivas

  // LA LUZ, función continua de gFrame: evoluciona, nunca salta entre actos.
  const coolT = interpolate(gFrame, [A2, A2 + 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sodT = interpolate(gFrame, [A3 + 40, A4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const tintTop = sodT > 0.001 ? light(sodT, "sky", "amber") : light(coolT, "volt", "sky");
  const keyFrom = interpolate(gFrame, [0, A3, A4, A6], [0.2, 0.34, 0.84, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const inten = interpolate(gFrame, [0, A2, A4, A6, A7], [0.86, 1.0, 1.12, 1.06, 0.74], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const floorDim = interpolate(gFrame, [0, A4, A7], [0.52, 0.6, 0.86], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cam = camAt(gFrame);

  return (
    <AbsoluteFill>
      {/* ── LA ATMÓSFERA: se monta UNA vez, sólo evoluciona la luz ── */}
      <VoltAtmos tint={tintTop} tint2={V.amber} keyFrom={keyFrom} intensity={inten} floor={floorDim} />

      <Layers cam={cam}>
        {/* ═══ ACTO 1 · dos horas del mismo día, y el caño entre las dos ═══════════════════ */}
        {acto === 1 && (() => {
          const rise = clamp01(f / 22);
          const yv = eio(122, VY, rise);
          const pipeIn = clamp01((f - 18) / 16);
          const flow = clamp01((f - 34) / 66);
          const run = f > 34 && f < 104;
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.celdasF} kind="photo" z={0} scale={1.3} dim={0.72} tint={V.volt} /></Plane>
              <Plane z={-40}>
                <Vessel src={M.madrugadaV} kind="video" x={VX_L} y={yv} w={VW} h={VH}
                  fill={lerp(1, 0.15, flow)} tint={V.volt} label="02:00" startFrom={20} sheenAt={toCF(10)} />
                <Vessel src={M.nocheF} kind="photo" x={VX_R} y={yv} w={VW} h={VH}
                  fill={lerp(0, 0.85, flow)} tint={V.volt} label="20:00" sheenAt={toCF(26)} />
              </Plane>
              <Plane z={90}>
                <Stub x0={VX_L + 10.4} x1={PX - 13.5} y={yv} tint={V.volt} on={run ? 1 : 0.25} />
                <Stub x0={PX + 13.5} x1={VX_R - 10.4} y={yv} tint={V.volt} on={flow > 0.04 ? 1 : 0.15} />
                <div style={{ opacity: pipeIn, transform: `translateY(${lerp(70, 0, pipeIn).toFixed(1)}px)` }}>
                  <Pipe x={PX} y={yv} w={PY_W} h={PH} flow={flow} running={run} tint={V.volt} sheenAt={toCF(30)} />
                </div>
              </Plane>
              {/* la regla voltio al costado: el mismo número antes y después del trasvase */}
              <Plane z={200}>
                <IconPng src={M.icRegla} x={94} y={26} size={126} z={0} opacity={0.8} rot={90} glow={V.volt} />
                <Readout value="8,0" unit="kWh" label="MISMO TOTAL" at={toCF(26)} x={94} y={62} size={72} color={V.volt} />
                {f > 52 && (
                  <div style={{ position: "absolute", left: "50%", top: "82%", transform: "translate(-50%,-50%)", textAlign: "center", opacity: clamp01((f - 52) / 12) }}>
                    <Kick color={V.voltSoft}>NO LA FABRICA</Kick>
                    <div style={{ marginTop: 8 }}><Head size={84} color={V.white}>LA MUEVE EN EL TIEMPO</Head></div>
                  </div>
                )}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 2 · la cámara bajó por el caño: abajo corren las dos cintas de precio ══ */}
        {acto === 2 && (() => {
          const cheap = clamp01((f - 10) / 20);
          const dear = clamp01((f - 34) / 20);
          const nada = clamp01((f - 96) / 12) * (1 - clamp01((f - 138) / 16));
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.celdasF} kind="photo" z={0} scale={1.32} dim={0.76} tint={V.sky} /></Plane>
              <Plane z={-40}>
                <Vessel src={M.madrugadaV} kind="video" x={VX_L} y={VY} w={VW} h={VH}
                  fill={0.15} tint={V.volt} label="02:00" startFrom={62} />
                <Vessel src={M.nocheF} kind="photo" x={VX_R} y={VY} w={VW} h={VH}
                  fill={0.85} tint={V.volt} label="20:00" warmFromBelow={clamp01((f - 40) / 30)} />
              </Plane>
              <Plane z={90}>
                <Stub x0={VX_L + 10.4} x1={PX - 13.5} y={VY} tint={V.volt} on={0.2} />
                <Stub x0={PX + 13.5} x1={VX_R - 10.4} y={VY} tint={V.volt} on={0.55} />
                <Pipe x={PX} y={VY} w={PY_W} h={PH} flow={1} running={false} tint={V.volt} />
              </Plane>
              {/* el medidor: el aparato que cobra ENTRA DESDE ARRIBA y en frío */}
              <Plane z={170}>
                <MediaCard src={M.medidorV} kind="video" w={330} h={200} x={PX} y={eio(-14, 84, clamp01((f - 30) / 24))}
                  z={0} ry={-6} startFrom={26} lit={0.95} litColor={V.sky} label="EL MEDIDOR" sheenAt={toCF(58)} radius={8} />
              </Plane>
              <Plane z={250}>
                <PriceTape x={VX_L} y={72} w={430} value="6" unit="¢" caption="LO QUE PAGÓ" color={V.amber} p={cheap} from="bottom" />
                <PriceTape x={VX_R} y={72} w={430} value="34" unit="¢" caption="LO QUE VALE" color={V.sky} p={dear} from="top" />
                {nada > 0.01 && (
                  <div style={{
                    position: "absolute", left: `${PX}%`, top: "108%", transform: "translate(-50%,-50%)", opacity: nada,
                    fontFamily: F_BODY, fontWeight: 600, fontSize: 34, letterSpacing: 7, color: rgba(V.bone, 0.8),
                    textShadow: "0 4px 20px rgba(0,0,0,0.9)",
                  }}>NADA MÁS</div>
                )}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 3 · el mismo caño desde abajo: tarifa plana, y se derrama el 12 % ═════ */}
        {acto === 3 && (() => {
          const same = clamp01(f / 16);
          const flow = clamp01((f - 18) / 54);
          const spill = clamp01((f - 58) / 18);
          const pct = clamp01((f - 74) / 14);
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.portonF} kind="photo" z={0} scale={1.3} dim={0.78} tint={V.sky} /></Plane>
              <Plane z={-40}>
                <Vessel src={M.madrugadaV} kind="video" x={VX_L} y={VY} w={VW} h={VH}
                  fill={lerp(1, 0.16, flow)} tint={V.sky} label="02:00" startFrom={20} />
                <Vessel src={M.nocheF} kind="photo" x={VX_R} y={VY} w={VW} h={VH}
                  fill={lerp(0, 0.72, flow)} tint={V.sky} label="20:00" />
              </Plane>
              <Plane z={90}>
                <Stub x0={VX_L + 10.4} x1={PX - 13.5} y={VY} tint={V.sky} on={flow > 0.02 && flow < 0.98 ? 1 : 0.2} />
                <Stub x0={PX + 13.5} x1={VX_R - 10.4} y={VY} tint={V.sky} on={flow > 0.06 ? 0.9 : 0.15} />
                <Pipe x={PX} y={VY} w={PY_W} h={PH} flow={flow} running={flow > 0.02 && flow < 0.98} tint={V.sky} sheenAt={toCF(20)} />
                {/* lo que se pierde por el camino: se va del cuadro y no vuelve */}
                <Spill x={VX_R} yTop={VY - 14} w={VW} p={spill} />
              </Plane>
              <Plane z={250}>
                {/* las DOS cintas marcan lo mismo: no hay diferencia que aprovechar */}
                <PriceTape x={VX_L} y={72} w={430} value="19" unit="¢" caption="TARIFA PLANA" color={V.bone} p={same} from="bottom" />
                <PriceTape x={VX_R} y={72} w={430} value="19" unit="¢" caption="TARIFA PLANA" color={V.bone} p={same} from="top" />
                {/* el +12 % entra en FRÍO desde arriba, dentro del hueco que dejó el derrame */}
                {pct > 0.01 && (
                  <div style={{
                    position: "absolute", left: `${VX_R}%`, top: `${(VY - 22).toFixed(1)}%`,
                    transform: `translate(-50%,-50%) translateY(${lerp(-52, 0, pct).toFixed(1)}px)`, opacity: pct, textAlign: "center",
                  }}>
                    <div style={{
                      fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 132, lineHeight: 0.9, color: V.amber,
                      textShadow: `0 0 52px ${rgba(V.amber, 0.45)}, 0 6px 26px rgba(0,0,0,0.94)`,
                    }}>+12 %</div>
                    <div style={{ fontFamily: F_BODY, fontWeight: 600, fontSize: 28, letterSpacing: 4, color: rgba(V.bone, 0.78), marginTop: 4 }}>SE PIERDE EN EL CAMINO</div>
                  </div>
                )}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 4 · salimos de la boca: el MISMO enchufe, dos veces ═══════════════════ */}
        {acto === 4 && (() => {
          const split = clamp01((f - 16) / 26);
          const txt = clamp01((f - 34) / 40);
          const c1 = clamp01((f - 74) / 20);
          const c2 = clamp01((f - 92) / 20);
          const xL = eio(50, 26, split), xR = eio(50, 74, split);
          return (
            <>
              <Plane z={-640}><PhotoPlane src={M.risaV} kind="video" z={0} scale={1.4} dim={0.82} startFrom={22} tint={V.amber} /></Plane>
              {/* el mismo tomacorriente REAL duplicado: dos veces el mismo enchufe, dos veces el mismo cable */}
              <Plane z={40}>
                <MediaCard src={M.enchufeF} kind="photo" w={420} h={264} x={xL} y={62} z={eio(0, -70, split)}
                  ry={eio(0, 13, split)} lit={0.95} litColor={V.amber} label="UNA VEZ" sheenAt={toCF(30)} radius={10} />
                <MediaCard src={M.enchufeV} kind="video" w={420} h={264} x={xR} y={62} z={eio(0, 40, split)}
                  ry={eio(0, -13, split)} startFrom={30} lit={0.95} litColor={V.amber} label="Y OTRA VEZ" sheenAt={toCF(44)} radius={10} />
              </Plane>
              {/* una moneda cae en cada uno, con distinto peso */}
              <Plane z={190}>
                {c1 > 0 && <Coin x={xL} y={pc(lerp(-140, 452, eio(0, 1, c1)))} size={lerp(96, 116, c1)} value="6" color={V.amber} rot={lerp(-40, -6, c1)} opacity={0.98} />}
                {c2 > 0 && <Coin x={xR} y={pc(lerp(-160, 452, eio(0, 1, c2)))} size={lerp(96, 168, c2)} value="34" color={V.sky} rot={lerp(46, 8, c2)} opacity={0.98} />}
              </Plane>
              <Plane z={280}>
                <HandText words={["ESTÁS", "COMPRANDO", "LA", "LUZ", "DOS", "VECES"]} x={50} y={20} size={86} color={V.white} p={txt} />
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 5 · las monedas se paran de canto y las vasijas vuelven, ya en sodio ══ */}
        {acto === 5 && (() => {
          const roll = clamp01(f / 26);
          const edge = clamp01((f - 22) / 16);
          const back = clamp01((f - 34) / 26);
          const flow = clamp01((f - 62) / 62);
          const sum = clamp01((f - 122) / 14);
          const yv = eio(126, VY, back);
          return (
            <>
              <Plane z={-640}><PhotoPlane src={M.capoF} kind="photo" z={0} scale={1.32} dim={0.8} tint={V.amber} /></Plane>
              <Plane z={-40}>
                {back > 0.01 && (
                  <>
                    <Vessel src={M.madrugadaV} kind="video" x={VX_L} y={yv} w={VW} h={VH}
                      fill={lerp(1, 0.18, flow)} tint={V.amber} label="02:00" startFrom={20} sheenAt={toCF(40)} />
                    <Vessel src={M.nocheF} kind="photo" x={VX_R} y={yv} w={VW} h={VH}
                      fill={lerp(0, 0.82, flow)} tint={V.amber} label="20:00" warmFromBelow={flow} />
                  </>
                )}
              </Plane>
              <Plane z={90}>
                {back > 0.01 && (
                  <>
                    <Stub x0={VX_L + 10.4} x1={PX - 13.5} y={yv} tint={V.amber} on={flow > 0.02 && flow < 0.98 ? 1 : 0.2} />
                    <Stub x0={PX + 13.5} x1={VX_R - 10.4} y={yv} tint={V.amber} on={flow > 0.06 ? 0.9 : 0.15} />
                    <Pipe x={PX} y={yv} w={PY_W} h={PH} flow={flow} running={flow > 0.02 && flow < 0.98} tint={V.amber} />
                  </>
                )}
              </Plane>
              {/* las dos monedas del acto anterior: ruedan al centro y se paran de canto */}
              <Plane z={230}>
                <Coin x={eio(26, 43.5, roll)} y={62} size={116} value="6" color={V.amber} rot={lerp(-6, -300, roll)} edge={edge} />
                <Coin x={eio(74, 56.5, roll)} y={62} size={116} value="6" color={V.amber} rot={lerp(8, 300, roll)} edge={edge} />
                {sum > 0.01 && (
                  <>
                    <IconPng src={M.icRegla} x={50} y={66} size={430} z={0} opacity={0.5 * sum} glow={V.volt} />
                    <Readout value="12" unit="¢" label="LAS DOS COMPRAS" at={toCF(122)} x={50} y={72} size={92} color={V.volt} />
                  </>
                )}
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 6 · sobre las dos monedas cae UNA sola, grande y fría: 34 ════════════ */}
        {acto === 6 && (() => {
          const drop = clamp01((f - 10) / 30);
          const cold = clamp01((f - 40) / 26);
          const warm = clamp01((f - 48) / 26);
          return (
            <>
              {/* la superficie sobre la que están apoyadas las tres: la chapa del capó, MATERIAL REAL */}
              <Plane z={-560}><PhotoPlane src={M.capoV} kind="video" z={0} scale={1.28} dim={0.7} startFrom={24} tint={V.amber} /></Plane>
              <Plane z={60}>
                <MediaCard src={M.capoV} kind="video" w={640} h={380} x={50} y={44} z={0} ry={-5} rx={26}
                  startFrom={54} lit={0.9} litColor={V.amber} label="LA CUENTA EN EL CAPÓ" sheenAt={toCF(16)} radius={10} />
              </Plane>
              {/* 6 + 6 abajo, calentándose desde abajo — 34 arriba, enfriándose desde arriba */}
              <Plane z={220}>
                <Coin x={40} y={48} size={126} value="6" color={V.amber} edge={0.82} rot={-4} />
                <div style={{
                  position: "absolute", left: "50%", top: `${(48 + pc(63)).toFixed(2)}%`, transform: "translate(-50%,-50%)",
                  fontFamily: F_DISPLAY, fontWeight: 800, fontSize: 62, color: rgba(V.amber, 0.9 * warm), textShadow: "0 4px 20px rgba(0,0,0,0.94)",
                }}>+</div>
                <Coin x={60} y={48} size={126} value="6" color={V.amber} edge={0.82} rot={5} />
                <div style={{
                  position: "absolute", left: 0, right: 0, top: `${(48 + pc(150)).toFixed(2)}%`, textAlign: "center",
                  fontFamily: F_BODY, fontWeight: 600, fontSize: 27, letterSpacing: 5, color: rgba(V.amber, 0.72 * warm),
                }}>MADRUGADA</div>
              </Plane>
              <Plane z={330}>
                <Coin x={50} y={pc(lerp(-460, -40, eio(0, 1, drop)))} size={lerp(300, 372, drop)} value="34"
                  color={light(cold, "bone", "sky")} rot={lerp(-16, -3, drop)} />
                <div style={{
                  position: "absolute", left: 0, right: 0, top: `${(pc(-40) + pc(410)).toFixed(2)}%`, textAlign: "center",
                  fontFamily: F_BODY, fontWeight: 600, fontSize: 27, letterSpacing: 5, color: rgba(V.sky, 0.78 * cold),
                }}>LAS OCHO DE LA NOCHE</div>
              </Plane>
            </>
          );
        })()}

        {/* ═══ ACTO 7 · epílogo: la madrugada entera entra por la tapa y se queda adentro ══ */}
        {acto === 7 && (() => {
          const lamp = clamp01(f / 26);
          const shrink = clamp01((f - 12) / 40);
          const lid = clamp01((f - 54) / 22);
          const slit = clamp01((f - 72) / 16);
          return (
            <>
              <Plane z={-620}><PhotoPlane src={M.fachadaF} kind="photo" z={0} scale={1.3} dim={0.74} tint={V.amber} /></Plane>
              {/* el farol de sodio: es el disco frío del 34, ya de vuelta en la calle, y sale de cuadro */}
              <Plane z={-200}>
                <div style={{
                  position: "absolute", left: "50%", top: `${lerp(-4, -34, lamp).toFixed(1)}%`, width: 760, height: 760, marginLeft: -380,
                  borderRadius: "50%", background: `radial-gradient(circle, ${rgba(V.amber, 0.5)} 0%, ${rgba(V.amber, 0.14)} 34%, rgba(0,0,0,0) 68%)`,
                }} />
              </Plane>
              {/* la caja gris REAL apoyada en la vereda */}
              <Plane z={20}>
                <MediaCard src={M.veredaV} kind="video" w={760} h={470} x={50} y={58} z={0} ry={-4}
                  startFrom={44} lit={0.86} litColor={V.amber} sheenAt={toCF(8)} radius={10} />
              </Plane>
              {/* la vasija entera de las 2 AM, con todo su líquido, entra por la tapa */}
              <Plane z={150}>
                {shrink < 0.995 && (
                  <Vessel src={M.madrugadaV} kind="video"
                    x={lerp(VX_L, 50, eio(0, 1, shrink))} y={lerp(20, 48, eio(0, 1, shrink))}
                    w={lerp(VW, 96, eio(0, 1, shrink))} h={lerp(VH, 82, eio(0, 1, shrink))}
                    fill={1} tint={V.volt} startFrom={20} />
                )}
              </Plane>
              {/* la tapa baja y afuera la calle sigue naranja */}
              <Plane z={210}>
                <div style={{
                  position: "absolute", left: "50%", top: `${(58 - pc(235)).toFixed(2)}%`, width: 760, height: 118, marginLeft: -380,
                  transform: `translateY(${lerp(-150, 0, eio(0, 1, lid)).toFixed(1)}px)`,
                  background: `linear-gradient(180deg, ${rgba(V.concrete, 0.34)} 0%, ${rgba(V.ink1, 0.99)} 42%, ${rgba(V.ink0, 1)} 100%)`,
                  boxShadow: `0 26px 60px ${rgba(V.ink0, 0.9)}`,
                }} />
                {/* el nivel se ve apenas por la ranura: la caja no brilla ni late */}
                <div style={{
                  position: "absolute", left: "50%", top: `${(58 - pc(150)).toFixed(2)}%`, width: 300, height: 5, marginLeft: -150,
                  opacity: slit, background: `linear-gradient(90deg, ${rgba(V.volt, 0)}, ${rgba(V.volt, 0.72)} 22%, ${rgba(V.volt, 0.72)} 78%, ${rgba(V.volt, 0)})`,
                  boxShadow: `0 0 18px ${rgba(V.volt, 0.4 * slit)}`,
                }} />
                <IconPng src={M.icReloj} x={12} y={80} size={92} z={0} opacity={0.32 * slit} glow={V.ink0} />
                <IconPng src={M.icEnchufe} x={88} y={80} size={92} z={0} opacity={0.26 * slit} glow={V.ink0} />
              </Plane>
            </>
          );
        })()}
      </Layers>

      {/* la boca de Ernesto abriéndose: va FUERA de la cámara, es la costura del acto 4 */}
      {acto === 4 && <MouthIris f={f} />}
    </AbsoluteFill>
  );
};
