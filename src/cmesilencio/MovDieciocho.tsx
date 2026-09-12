// MovDieciocho.tsx — S14 · LOS DIECIOCHO  (arranca en 1037,50 s · 57,5 s · 1725 frames · 5 actos)
//
// EL GIRO HONESTO DEL VIDEO: de los dieciocho decibeles que bajó, ONCE salieron de cosas GRATIS.
// Los tres actos centrales son las tres acciones, cada una con su número:
//   · girar el generador 180°            (−2)  el lóbulo del escape deja de apuntar a la ventana
//   · romper la línea de vista con el muro(−3)  los anillos se DOBLAN contra la coronación
//   · duplicar la distancia, 7 → 14 m    (−6)  los anillos se ralean
// El marcador baja 78 → 60 y las tres lascas se apilan y se funden en el bloque del ONCE.
//
// ENTRA saliendo del calor de MovHorno: la tapa de contrachapado se abre hacia arriba como
// OCCLUDER a luminancia media y del otro lado ya estamos ALTOS Y LEJOS sobre el patio, en `sky`.
// SALE en plano largo del patio a 60 decibeles, NOCHE AZUL — y en los últimos cuadros la cámara
// ya insinúa el descenso hacia la caja (MovLana entra por la junta, hacia la fibra).
//
// ⛔ UNA SOLA <Sequence> (la del wrapper). Los actos se recortan por RANGO de `g` y se pisan
//    20-40 cuadros. La cámara NUNCA vuelve a cero (salvo la subida que pide el plano largo final).
//
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import {
  V, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, SoundField, PadPlane, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, zoomThrough,
  Kick, Head, Body, Em, Num, Bed,
} from "./VoltStage";

// ── EL RELOJ DEL MOVIMIENTO ─────────────────────────────────────────────────────────────────
const END = 1725;

const A1 = 0, A2 = 360, A3 = 690, A4 = 1050, A5 = 1395;

const S01 = 34;      // OCCLUDER: la tapa de contrachapado se abre → del calor al patio alto y lejos
const S12 = 360;     // LA CÁMARA SIGUE: el descenso no se interrumpe, el lóbulo tampoco
const S23 = 690;     // METAMORFOSIS: el anillo exterior del lóbulo se estira y ES la línea de vista
const S34 = 1050;    // OCCLUDER: la coronación del muro pasa por delante del lente (V.concrete)
const S45 = 1395;    // ZOOM-THROUGH: la cámara entra en el rollo del cable y sale al fondo del terreno

const LN = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ES = (g: number, a: number, b: number) => eio(0, 1, LN(g, a, b));

// ── EL MURO BAJO DE BLOQUES — materia real del patio, no un vector ─────────────────────────
const Muro: React.FC<{ g: number; x: number; y: number; w: number; h: number; on: number; lit?: number }> = ({
  g, x, y, w, h, on, lit = 1,
}) => {
  if (on <= 0.01) return null;
  const respira = 1 + Math.sin(g / 103) * 0.003;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: `${w}%`, height: `${h}%`,
      opacity: clamp01(on), transform: `scaleY(${respira.toFixed(4)})`, transformOrigin: "50% 100%",
    }}>
      {/* sombra de contacto contra el concreto */}
      <div style={{
        position: "absolute", left: "-6%", right: "-6%", bottom: -26, height: 60,
        background: `radial-gradient(60% 100% at 50% 0%, ${rgba(V.ink0, 0.86)} 0%, rgba(0,0,0,0) 74%)`,
      }} />
      {/* el cuerpo del muro */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 2,
        background: `linear-gradient(184deg, ${rgba(V.concrete, 0.86 * lit)} 0%, ${rgba(V.concrete, 0.52 * lit)} 42%, ${rgba(V.ink0, 0.94)} 100%)`,
        boxShadow: `inset 0 2px 0 ${rgba(V.white, 0.10 * lit)}, 0 -12px 44px ${rgba(V.ink0, 0.7)}`,
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.5,
          backgroundImage:
            `repeating-linear-gradient(0deg, ${rgba(V.ink0, 0.5)} 0 2px, rgba(0,0,0,0) 2px 46px), ` +
            `repeating-linear-gradient(90deg, ${rgba(V.ink0, 0.42)} 0 2px, rgba(0,0,0,0) 2px 118px)`,
        }} />
      </div>
      {/* LA CORONACIÓN: la arista que rompe la línea de vista, con su canto iluminado */}
      <div style={{
        position: "absolute", left: "-1.4%", right: "-1.4%", top: -15, height: 20, borderRadius: 3,
        background: `linear-gradient(180deg, ${rgba(V.bone, 0.62 * lit)} 0%, ${rgba(V.concrete, 0.94 * lit)} 46%, ${rgba(V.ink0, 0.86)} 100%)`,
        boxShadow: `0 6px 22px ${rgba(V.ink0, 0.8)}`,
      }} />
    </div>
  );
};

// ── LA VENTANA AMARILLA DEL VECINO — nunca se ve la cara, sólo la ventana ──────────────────
const Ventana: React.FC<{ g: number; x: number; y: number; w: number; h: number; on: number; halo: number }> = ({
  g, x, y, w, h, on, halo,
}) => {
  if (on <= 0.01) return null;
  const parpadeo = 0.94 + Math.sin(g / 137) * 0.05;
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
      marginLeft: -w / 2, marginTop: -h / 2, opacity: clamp01(on),
    }}>
      <div style={{
        position: "absolute", left: -w, top: -h, width: w * 3, height: h * 3,
        background: `radial-gradient(closest-side, ${rgba(V.amber, 0.30 * halo * parpadeo)}, rgba(0,0,0,0) 72%)`,
      }} />
      <div style={{
        position: "absolute", inset: 0, borderRadius: 2,
        background: `linear-gradient(172deg, ${rgba(V.amber, 0.82 * parpadeo)} 0%, ${rgba(V.amber, 0.56)} 62%, ${rgba(V.copper, 0.5)} 100%)`,
        boxShadow: `0 0 ${Math.round(38 * halo)}px ${rgba(V.amber, 0.5 * halo)}, inset 0 0 18px ${rgba(V.copper, 0.5)}`,
      }} />
      {/* los travesaños: es una ventana, no un rectángulo */}
      <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: 3, marginLeft: -1.5, background: rgba(V.ink0, 0.62) }} />
      <div style={{ position: "absolute", top: "46%", left: 0, right: 0, height: 3, background: rgba(V.ink0, 0.62) }} />
    </div>
  );
};

// ── EL LÓBULO DEL ESCAPE — la mitad brillante que mira a alguien ───────────────────────────
const Lobulo: React.FC<{ g: number; x: number; y: number; rot: number; on: number; tint: string; r?: number }> = ({
  g, x, y, rot, on, tint, r = 640,
}) => {
  if (on <= 0.01) return null;
  const cx = (x / 100) * 1920, cy = (y / 100) * 1080;
  const pulso = 0.82 + Math.sin(g / 11) * 0.18;
  return (
    <AbsoluteFill style={{ opacity: clamp01(on), pointerEvents: "none", mixBlendMode: "screen" }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none">
        <defs>
          <radialGradient id="lob_g" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={rgba(tint, 0.42 * pulso)} />
            <stop offset="52%" stopColor={rgba(tint, 0.16)} />
            <stop offset="100%" stopColor={rgba(tint, 0)} />
          </radialGradient>
        </defs>
        <g transform={`translate(${cx} ${cy}) rotate(${rot.toFixed(2)}) scale(1 0.44)`}>
          {/* el cono de directividad: donde el escape empuja el aire */}
          <path
            d={`M 0 0 L ${r} ${-r * 0.62} A ${r} ${r} 0 0 1 ${r} ${r * 0.62} Z`}
            fill="url(#lob_g)"
          />
          {/* los anillos densos del lado del escape */}
          {[0.36, 0.58, 0.82].map((k, i) => (
            <path
              key={i}
              d={`M ${r * k} ${-r * k * 0.55} A ${r * k} ${r * k} 0 0 1 ${r * k} ${r * k * 0.55}`}
              fill="none"
              stroke={rgba(tint, (0.5 - i * 0.11) * pulso)}
              strokeWidth={5 - i}
            />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ── LA LÍNEA DE VISTA — nace como el anillo exterior del lóbulo y se ENDEREZA (metamorfosis) ─
// `m` = 0 el trazo todavía es el arco del anillo · `m` = 1 es la recta blanca del escape a la
// ventana. `rompe` la corta contra la coronación: del otro lado sale doblada, punteada y sin cuerpo.
const Vista: React.FC<{
  g: number; m: number; rompe: number; ax: number; ay: number; bx: number; by: number; wx: number; on: number;
}> = ({ g, m, rompe, ax, ay, bx, by, wx, on }) => {
  if (on <= 0.01) return null;
  const x0 = (ax / 100) * 1920, y0 = (ay / 100) * 1080;
  const x1 = (bx / 100) * 1920, y1 = (by / 100) * 1080;
  const xw = (wx / 100) * 1920;
  // el control de la curva: del bombeo del anillo (arco) a la recta pura
  const cxq = lerp((x0 + x1) / 2 - (y1 - y0) * 0.42, (x0 + x1) / 2, m);
  const cyq = lerp((y0 + y1) / 2 + (x1 - x0) * 0.30, (y0 + y1) / 2, m);
  // el punto donde la recta toca la coronación
  const t = clamp01((xw - x0) / Math.max(1, x1 - x0));
  const xh = lerp(x0, x1, t), yh = lerp(y0, y1, t);
  const col = light(m, "volt", "white");
  const chasquido = clamp01(1 - Math.abs(rompe - 0.14) / 0.1);
  return (
    <AbsoluteFill style={{ opacity: clamp01(on), pointerEvents: "none" }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none">
        {/* el tramo que llega al muro: entero, sin perder nada */}
        <path
          d={`M ${x0} ${y0} Q ${cxq} ${cyq} ${lerp(x1, xh, rompe)} ${lerp(y1, yh, rompe)}`}
          fill="none" stroke={rgba(col, 0.9)} strokeWidth={lerp(2.4, 3.4, m)}
          strokeLinecap="round"
        />
        {/* del otro lado, doblado sobre la arista y sin cuerpo */}
        {rompe > 0.02 && (
          <path
            d={`M ${xh} ${yh} Q ${lerp(xh, x1, 0.5)} ${yh + 118 * rompe} ${x1} ${y1 + 46 * rompe}`}
            fill="none" stroke={rgba(col, 0.20 * rompe)} strokeWidth={1.6}
            strokeDasharray="10 15"
          />
        )}
        {/* el chasquido seco del corte */}
        {chasquido > 0.01 && (
          <circle cx={xh} cy={yh} r={10 + 54 * (1 - chasquido)} fill="none"
            stroke={rgba(V.white, 0.8 * chasquido)} strokeWidth={3} />
        )}
        {/* la punta viva de la recta, para que no sea un vector muerto */}
        <circle cx={x0} cy={y0} r={4 + Math.sin(g / 9) * 1.4} fill={rgba(col, 0.9)} />
      </svg>
    </AbsoluteFill>
  );
};

// ── LAS LASCAS — el descuento que se despega del marcador y se apila ───────────────────────
const Lasca: React.FC<{
  g: number; n: string; at: number; fromX: number; fromY: number; toX: number; toY: number; fund: number;
}> = ({ g, n, at, fromX, fromY, toX, toY, fund }) => {
  const p = ES(g, at, at + 34);
  if (p <= 0) return null;
  const x = lerp(fromX, lerp(toX, 88, fund), p);
  const y = lerp(fromY, lerp(toY, 62, fund), p);
  const w = lerp(206, 250, fund);
  const h = lerp(96, 104, fund);
  return (
    <div style={{
      position: "absolute", left: `${x}%`, top: `${y}%`, width: w, height: h,
      marginLeft: -w / 2, marginTop: -h / 2,
      opacity: clamp01(p * 1.4) * (1 - fund * 0.999),
      transform: `translateY(${((1 - p) * -18 + Math.sin(g / 57) * 2).toFixed(1)}px) rotate(${lerp(-3.4, 0, fund).toFixed(2)}deg)`,
      borderRadius: 6,
      background: `linear-gradient(176deg, ${rgba(V.volt, 0.92)} 0%, ${rgba(V.voltSoft, 0.86)} 58%, ${rgba(V.ink1, 0.94)} 100%)`,
      boxShadow: `0 ${Math.round(16 + 10 * fund)}px ${Math.round(34 + 16 * fund)}px ${rgba(V.ink0, 0.8)}, inset 0 2px 0 ${rgba(V.white, 0.42)}, inset 0 -5px 0 ${rgba(V.ink0, 0.4)}`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Num size={70} color={V.ink0}>{n}</Num>
    </div>
  );
};

// ── EL MARCADOR DE ESQUINA — el número que rueda ───────────────────────────────────────────
const Marcador: React.FC<{ g: number; db: number; dist: string; on: number; hundido: number }> = ({
  g, db, dist, on, hundido,
}) => {
  if (on <= 0.01) return null;
  const salto = 1 + 0.06 * clamp01(1 - Math.abs(((g % 6) - 3)) / 3) * hundido;
  return (
    <div style={{
      position: "absolute", right: 130, top: 96, textAlign: "right", opacity: clamp01(on),
      transform: `scale(${salto.toFixed(3)})`, transformOrigin: "100% 0%",
    }}>
      <Bed pad={22} w={340}>
        <Kick color={V.volt}>{dist}</Kick>
        <div style={{ height: 4 }} />
        <Num size={148} color={V.volt}>{Math.round(db)}</Num>
        <div style={{ marginTop: -6 }}><Kick color={rgba(V.white, 0.6)}>DECIBELES</Kick></div>
      </Bed>
    </div>
  );
};

// ── TITULAR: entra por barrido (clip-path), nunca por fade ─────────────────────────────────
const Titular: React.FC<{ g: number; at: number; out?: number; kick: string; text: string; top?: number; color?: string }> = ({
  g, at, out = 999999, kick, text, top = 148, color = V.volt,
}) => {
  const inP = ES(g, at, at + 17);
  const outP = ES(g, out, out + 15);
  if (inP <= 0) return null;
  const p = clamp01(inP - outP);
  if (p <= 0) return null;
  return (
    <div style={{
      position: "absolute", left: 148, top, maxWidth: 880,
      transform: `translateY(${((1 - inP) * 26 - outP * 20).toFixed(1)}px)`,
      clipPath: `inset(0 ${(100 - p * 100).toFixed(1)}% -34% 0)`,
    }}>
      <Bed pad={22}>
        <Kick color={color}>{kick}</Kick>
        <div style={{ height: 8 }} />
        <Head size={72}>{text}</Head>
      </Bed>
    </div>
  );
};

// ── LA ESCENA ───────────────────────────────────────────────────────────────────────────────
const Dieciocho: React.FC<{ g: number }> = ({ g }) => {
  // ── LA CÁMARA: entra alta y lejos y BAJA sin volver a subir… salvo el plano largo del cierre,
  //    que es lo único que el video permite remontar. Después ya insinúa el descenso a la caja.
  const cam = gcam(g, { z0: -140, z1: 330, panX: 64, panY: -172, ry: -3.6, rx: 2.4, dur: 1420 });
  const sube = ES(g, 1466, 1618);
  const baja = ES(g, 1660, END);                 // el guiño hacia la junta de la caja (→ MovLana)
  const camT =
    `${cam.transform} translateZ(${(-340 * sube + 150 * baja).toFixed(1)}px) ` +
    `translateY(${(-72 * sube + 28 * baja).toFixed(1)}px) rotateX(${(2.4 * sube).toFixed(2)}deg)`;

  // ── LA LUZ: el rojo del horno se entrega al `sky` frío del patio, y el patio se hace noche.
  const tintA = g < 48 ? light(ES(g, 6, 42), "danger", "sky") : V.sky;
  const tint2A = g < 1480 ? V.amber : light(ES(g, 1480, 1694), "amber", "sky");
  const inten = g < 60 ? lerp(1.0, 0.94, ES(g, 0, 46)) : lerp(0.94, 0.64, ES(g, 1400, 1706));
  const keyFrom = lerp(0.26, 0.60, ES(g, 42, 1200));
  const piso = lerp(0.46, 0.86, ES(g, 880, 1710));

  // ── EL NÚMERO: 78 → 76 (−2) → 73 (−3) → 67 (−6) → 60 en el plano largo ───────────────────
  const db = interpolate(
    g,
    [A1, 396, 516, 1146, 1256, 1502, 1584, 1636, 1692],
    [78, 78, 76, 76, 73, 73, 67, 67, 60],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // ── GEOMETRÍA DEL PATIO (el mismo escenario en todos los actos, visto desde más y más cerca)
  const gx = interpolate(g, [A1, A2, A3, A4, A5, 1520, END], [42, 44, 34, 30, 33, 40, 43],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const gy = interpolate(g, [A1, A2, A3, A4, A5, 1520, END], [66, 62, 72, 71, 66, 58, 60],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const wx = interpolate(g, [A1, A3, 900, A4, A5, END], [74, 72, 60, 57, 60, 63],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vx = interpolate(g, [A1, A3, A4, A5, END], [86, 87, 88, 85, 84],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vy = interpolate(g, [A1, A3, A4, END], [42, 40, 38, 44],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vw = interpolate(g, [A1, A3, A4, 1300, END], [128, 140, 120, 78, 62],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // ── LAS TRES ACCIONES ─────────────────────────────────────────────────────────────────────
  const giro180 = 180 * ES(g, 420, 560);                       // el aparato rota sobre su propio eje
  const morfea = ES(g, S23 - 32, S23 + 76);                    // el anillo se endereza y ES la recta
  const rompe = ES(g, 838, 962);                               // la recta se corta contra el muro
  const arrastre = ES(g, 1128, 1268);                          // la caja cruza la sombra acústica
  const dobla = ES(g, 1498, 1596);                             // 7 → 14 metros
  const funde = ES(g, 1618, 1672);                             // las tres lascas se hacen un bloque
  const hunde = ES(g, 1672, 1706);                             // y el bloque se hunde en el marcador

  // ── VENTANAS DE ACTO (se pisan 20-40 cuadros; cada unión lleva su costura) ────────────────
  const v1 = g < A2 + 20;
  const v2 = g >= S12 - 20 && g < A3 + 20;
  const v3 = g >= A3 - 20 && g < A4 + 20;
  const v4 = g >= A4 - 20 && g < A5 + 20;
  const v5 = g >= A5 - 20;

  const zt = zoomThrough(g, S45 - 43, 46, 22, 82);             // entra en el rollo del cable naranja
  const a4T = zt.out === "none" ? "none" : zt.out;
  const calorIn = 1 - ES(g, 4, S01);                           // lo que queda del horno de MovHorno

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0, overflow: "hidden" }}>
      {/* ── ATMÓSFERA: se monta UNA vez y no se remonta nunca ───────────────────────────── */}
      <VoltAtmos tint={tintA} tint2={tint2A} keyFrom={keyFrom} intensity={inten} floor={piso} />

      <Layers cam={camT}>
        {/* ═══ ENTRADA · TODAVÍA ADENTRO DEL CALOR DE MovHorno ════════════════════════════ */}
        {g < S01 + 6 && (
          <Plane z={-520}>
            <PhotoPlane
              src="img/cmesilencio/cms_s14_caja_sin_usar_banco.jpg" kind="photo" z={0}
              scale={lerp(1.44, 1.30, ES(g, 0, S01))} dim={0.42} tint={V.danger}
            />
            <AbsoluteFill style={{
              background: `radial-gradient(72% 58% at 48% 56%, ${rgba(V.danger, 0.34 * calorIn)} 0%, rgba(0,0,0,0) 76%)`,
              mixBlendMode: "screen",
            }} />
            {/* la lámina galvanizada del codo, respirando */}
            <div style={{
              position: "absolute", left: "8%", right: "8%", top: "18%", height: 8, borderRadius: 4,
              opacity: calorIn,
              background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.steel, 0.7)} 40%, ${rgba(V.danger, 0.5)} 78%, rgba(0,0,0,0) 100%)`,
            }} />
          </Plane>
        )}

        {/* ═══ EL PATIO · la cama compartida de los actos 1, 2 y 3 (nada corta entre ellos) ═ */}
        {(v1 || v2 || v3) && (
          <Plane z={-520} style={{ opacity: g >= S01 ? 1 : 0 }}>
            <PhotoPlane
              src="img/cmesilencio/cms_s14_trapo_mira_patio.jpg" kind="photo" z={0}
              scale={lerp(1.18, 1.42, ES(g, S01, 1040))}
              dim={lerp(0.52, 0.62, ES(g, S01, 1040))}
              tint={V.sky}
            />
          </Plane>
        )}

        {/* ═══ EL ESCENARIO DEL PATIO (vive en los cuatro primeros actos) ═════════════════ */}
        {(v1 || v2 || v3 || v4) && g >= S01 - 2 && (
          <>
            <Plane z={-420}>
              <PadPlane y={78} w={1560} h={340} rx={63} lit={lerp(0.42, 0.72, ES(g, 60, 900))} z={0} />
            </Plane>

            {/* el muro bajo de bloques y, detrás, la ventana amarilla */}
            <Plane z={-240}>
              <Ventana
                g={g} x={vx} y={vy} w={vw} h={vw * 0.78}
                on={LN(g, S01, S01 + 40)}
                halo={lerp(1, 0.16, Math.max(rompe, arrastre))}
              />
              <Muro
                g={g} x={wx} y={interpolate(g, [A1, A3, A4, END], [58, 52, 50, 54], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
                w={interpolate(g, [A1, A3, A4, END], [30, 44, 52, 40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
                h={interpolate(g, [A1, A3, A4, END], [16, 26, 30, 20], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
                on={LN(g, S01, S01 + 36)} lit={lerp(0.9, 0.6, ES(g, 1300, 1700))}
              />
            </Plane>

            {/* ⭐ LA FIRMA DEL VIDEO: la densidad de los anillos ES el número de decibeles */}
            <Plane z={-120}>
              <SoundField
                db={db} x={gx} y={gy}
                wall={g >= 830 ? wx : null}
                on={LN(g, S01 + 6, S01 + 46)}
                tint={V.volt} speed={1} spread={82}
              />
              <Lobulo
                g={g} x={gx} y={gy} rot={-8 + giro180} on={LN(g, S01 + 10, S01 + 54) * (1 - ES(g, 1360, 1470))}
                tint={V.volt} r={lerp(660, 420, ES(g, 1440, 1620))}
              />
            </Plane>
          </>
        )}

        {/* ═══ ACTO 1 · EL PATIO ENTERO A 78: LOS ANILLOS LLEGAN ENTEROS A LA VENTANA ═════ */}
        {v1 && g >= S01 - 2 && (
          <Plane z={60}>
            <MediaCard
              src="broll/cmesilencio/cms_s14_dedo_indice_orden.mp4" kind="video"
              w={412} h={252} x={17} y={70} z={0} ry={12} radius={14}
              lit={0.95} litColor={V.volt} sheenAt={S01 + 40} label="PRIMERO"
              opacity={LN(g, S01 + 24, S01 + 58) * (1 - LN(g, 330, 366))}
            />
            <MediaCard
              src="broll/cmesilencio/cms_s14_tres_gestos_seguidos.mp4" kind="video"
              w={392} h={240} x={83} y={72} z={0} ry={-12} radius={14}
              lit={0.95} litColor={V.volt} sheenAt={196} label="TRES COSAS QUE NO CUESTAN NADA"
              opacity={LN(g, 178, 214) * (1 - LN(g, 336, 370))}
            />
            <IconPng
              src="img/cmesilencio/cms_ic_escape.png" x={lerp(56, 58, ES(g, 90, 340))} y={54} size={112} z={40}
              opacity={LN(g, 96, 132) * (1 - LN(g, 340, 372))} glow={V.ink0}
            />
            <IconPng
              src="img/cmesilencio/cms_ic_casa.png" x={vx} y={vy - 13} size={104} z={40}
              opacity={LN(g, 124, 158) * (1 - LN(g, 340, 372))} glow={V.ink0}
            />
          </Plane>
        )}

        {/* ═══ ACTO 2 · MEDIA VUELTA: EL LÓBULO GIRA CON EL APARATO ══════════════════════ */}
        {v2 && (
          <>
            {/* el arco de tiza: las patas no se movieron del mismo punto de concreto */}
            <Plane z={-100}>
              <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none"
                style={{ position: "absolute", inset: 0, opacity: LN(g, 400, 446) * (1 - LN(g, 664, 700)) }}>
                <ellipse
                  cx={(gx / 100) * 1920} cy={(gy / 100) * 1080} rx={168} ry={70}
                  fill="none" stroke={rgba(V.bone, 0.38)} strokeWidth={3} strokeDasharray="14 12"
                />
              </svg>
            </Plane>

            <Plane z={60}>
              <MediaCard
                src="broll/cmesilencio/cms_s14_manos_marco_pesa.mp4" kind="video"
                w={430} h={266} x={17} y={lerp(56, 52, ES(g, 400, 560))} z={0} ry={13} radius={14}
                lit={0.96} litColor={V.volt} sheenAt={418} label="EMPUJAR EL MARCO"
                opacity={LN(g, 386, 420) * (1 - LN(g, 660, 694))}
              />
              <IconPng
                src="img/cmesilencio/cms_ic_giro.png" x={gx} y={gy - 16} size={132} z={40}
                rot={giro180 * 0.5}
                opacity={LN(g, 408, 442) * (1 - LN(g, 606, 646))} glow={V.ink0}
              />
            </Plane>

            <Plane z={120}>
              <Titular g={g} at={A2 + 22} out={660} kick="MEDIA VUELTA · CERO PESOS" text="EL ESCAPE YA NO LA MIRA" top={140} />
            </Plane>
          </>
        )}

        {/* ═══ ACTO 3 · LA LÍNEA DE VISTA Y LA SOMBRA ACÚSTICA ═══════════════════════════ */}
        {v3 && (
          <>
            <Plane z={-80}>
              <Vista
                g={g} m={morfea} rompe={rompe}
                ax={gx} ay={gy - 6} bx={vx} by={vy + 3} wx={wx}
                on={LN(g, S23 - 30, S23 + 10) * (1 - LN(g, 1010, 1048))}
              />
            </Plane>

            <Plane z={60}>
              {/* el ícono que marca dónde está el vecino, apoyado en la coronación */}
              <IconPng
                src="img/cmesilencio/cms_ic_ojo.png" x={wx + 3} y={interpolate(g, [A3, A4], [50, 48], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
                size={108} z={0}
                opacity={LN(g, 764, 800) * (1 - LN(g, 1016, 1046))} glow={V.ink0}
              />
              <IconPng
                src="img/cmesilencio/cms_ic_muro.png" x={17} y={30} size={116} z={0}
                opacity={LN(g, 800, 836) * (1 - LN(g, 1016, 1046))} glow={V.ink0}
              />
              <MediaCard
                src="img/cmesilencio/cms_s14_dedo_indice_orden.jpg" kind="photo"
                w={392} h={244} x={17} y={62} z={0} ry={12} radius={14}
                lit={0.95} litColor={V.volt} sheenAt={730} label="SEGUNDO"
                opacity={LN(g, 714, 748) * (1 - LN(g, 1012, 1044))}
              />
              <MediaCard
                src="broll/cmesilencio/cms_s14_sala_hablan_tranquilos.mp4" kind="video"
                w={402} h={248} x={84} y={72} z={0} ry={-13} radius={14}
                lit={0.94} litColor={V.amber} sheenAt={906} label="DEL OTRO LADO DEL MURO"
                opacity={LN(g, 890, 926) * (1 - LN(g, 1014, 1046))}
              />
            </Plane>

            {/* la sombra acústica que el muro proyecta sobre el concreto */}
            <Plane z={-200}>
              <div style={{
                position: "absolute", left: `${wx}%`, right: 0, top: "52%", bottom: 0,
                opacity: rompe * 0.7,
                background: `linear-gradient(96deg, ${rgba(V.ink0, 0.72)} 0%, ${rgba(V.ink0, 0.34)} 62%, rgba(0,0,0,0) 100%)`,
              }} />
            </Plane>

            <Plane z={120}>
              <Titular g={g} at={A3 + 26} out={1010} kick="SEGUNDO · LA LÍNEA DE VISTA" text="SI NO TE VE, NO TE OYE" top={140} />
            </Plane>
          </>
        )}

        {/* ═══ ACTO 4 · LA CAJA CRUZA LA SOMBRA (y el zoom-through al rollo del cable) ════ */}
        {v4 && (
          <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: a4T, opacity: zt.opacity }}>
            <Plane z={-520} style={{ opacity: g >= S34 ? 1 : 0 }}>
              <PhotoPlane
                src="img/cmesilencio/cms_s14_manos_marco_pesa.jpg" kind="photo" z={0}
                scale={lerp(1.26, 1.40, ES(g, S34, A5))} dim={0.60} tint={V.sky}
              />
            </Plane>

            {/* LA CINTA MÉTRICA AMARILLA que se desenrolla sola: metro y medio, medidos */}
            <Plane z={-60}>
              <div style={{
                position: "absolute", left: "24%", top: "80%", height: 20,
                width: `${(30 * arrastre).toFixed(1)}%`, borderRadius: 3,
                opacity: LN(g, 1112, 1150),
                background: `linear-gradient(180deg, ${rgba(V.amber, 0.94)} 0%, ${rgba(V.copper, 0.86)} 100%)`,
                boxShadow: `0 8px 22px ${rgba(V.ink0, 0.8)}`,
              }}>
                <div style={{
                  position: "absolute", inset: 0, opacity: 0.7,
                  backgroundImage: `repeating-linear-gradient(90deg, ${rgba(V.ink0, 0.8)} 0 2px, rgba(0,0,0,0) 2px 26px)`,
                }} />
              </div>
              <div style={{
                position: "absolute", left: "40%", top: "84.5%", opacity: LN(g, 1186, 1220),
              }}>
                <Kick color={V.amber}>METRO Y MEDIO</Kick>
              </div>
            </Plane>

            <Plane z={60}>
              <MediaCard
                src="broll/cmesilencio/cms_s14_caja_sin_usar_banco.mp4" kind="video"
                w={430} h={266} x={18} y={lerp(46, 42, ES(g, 1080, 1300))} z={0} ry={12} radius={14}
                lit={0.95} litColor={V.volt} sheenAt={1096} label="EMPUJAR, NADA MÁS"
                opacity={LN(g, 1074, 1112) * (1 - LN(g, 1352, 1382))}
              />
              <IconPng
                src="img/cmesilencio/cms_ic_cinta.png" x={83} y={34} size={116} z={0}
                opacity={LN(g, 1156, 1192) * (1 - LN(g, 1350, 1380))} glow={V.ink0}
              />
              <IconPng
                src="img/cmesilencio/cms_ic_pasos.png" x={83} y={58} size={112} z={0}
                opacity={LN(g, 1214, 1250) * (1 - LN(g, 1350, 1380))} glow={V.ink0}
              />
              {/* EL ROLLO DE CABLE NARANJA: el detalle por el que va a entrar la cámara */}
              <div style={{
                position: "absolute", left: "22%", top: "82%", width: 168, height: 168,
                marginLeft: -84, marginTop: -84, borderRadius: "50%",
                opacity: LN(g, 1288, 1330),
                background: `repeating-radial-gradient(circle, ${rgba(V.danger, 0.92)} 0 7px, ${rgba(V.copper, 0.6)} 7px 13px)`,
                boxShadow: `0 16px 38px ${rgba(V.ink0, 0.86)}, inset 0 0 30px ${rgba(V.ink0, 0.7)}`,
              }} />
            </Plane>

            <Plane z={120}>
              <Titular g={g} at={S34 + 26} out={1350} kick="DETRÁS DEL MURO" text="SIN UN SOLO TORNILLO" top={140} />
            </Plane>
          </div>
        )}

        {/* ═══ ACTO 5 · DUPLICAR LA DISTANCIA, EL BLOQUE DEL ONCE, Y EL PLANO LARGO ═══════ */}
        {v5 && (
          <>
            <Plane z={-520} style={{ opacity: g >= S45 ? 1 : 0 }}>
              <PhotoPlane
                src="img/cmesilencio/cms_s14_fondo_terreno_mira.jpg" kind="photo" z={0}
                scale={lerp(1.34, 1.16, ES(g, S45, 1640))}
                dim={lerp(0.48, 0.74, ES(g, 1440, END))}
                tint={V.sky}
              />
            </Plane>

            {/* el patio de noche, ya lejos: suelo, muro y ventana chiquita a la derecha */}
            <Plane z={-420} style={{ opacity: g >= S45 ? 1 : 0 }}>
              <PadPlane y={80} w={1620} h={330} rx={64} lit={0.5} z={0} />
            </Plane>
            <Plane z={-240} style={{ opacity: g >= S45 ? 1 : 0 }}>
              <Ventana g={g} x={vx} y={vy} w={vw} h={vw * 0.78} on={1} halo={0.2} />
              <Muro g={g} x={wx} y={54} w={40} h={20} on={1} lit={0.58} />
              <SoundField db={db} x={gx} y={gy} wall={wx} on={0.95} tint={V.volt} speed={0.86} spread={82} />
            </Plane>

            {/* EL CABLE NARANJA y la regla de distancia: 7 metros, y después 14 */}
            <Plane z={-40}>
              <div style={{
                position: "absolute", left: "8%", right: "8%", bottom: "13%", height: 3,
                opacity: LN(g, S45 + 10, S45 + 50) * (1 - LN(g, 1640, 1682)),
                background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${rgba(V.danger, 0.8)} 12%, ${rgba(V.danger, 0.8)} 88%, rgba(0,0,0,0) 100%)`,
                boxShadow: `0 6px 20px ${rgba(V.danger, 0.34)}`,
              }} />
              <div style={{
                position: "absolute", left: "8%", bottom: "9.6%", width: `${lerp(34, 78, dobla).toFixed(1)}%`, height: 12,
                opacity: LN(g, S45 + 16, S45 + 56) * (1 - LN(g, 1640, 1682)),
                background: `linear-gradient(180deg, ${rgba(V.volt, 0.9)} 0%, ${rgba(V.voltSoft, 0.7)} 100%)`,
                borderRadius: 2,
              }}>
                <div style={{
                  position: "absolute", inset: 0, opacity: 0.6,
                  backgroundImage: `repeating-linear-gradient(90deg, ${rgba(V.ink0, 0.8)} 0 2px, rgba(0,0,0,0) 2px 34px)`,
                }} />
                <div style={{ position: "absolute", right: -6, top: 22 }}>
                  <Kick color={V.volt}>{dobla < 0.5 ? "7 METROS" : "14 METROS"}</Kick>
                </div>
              </div>
            </Plane>

            <Plane z={60}>
              <MediaCard
                src="broll/cmesilencio/cms_s14_desenrolla_cable_naranja.mp4" kind="video"
                w={430} h={266} x={18} y={40} z={0} ry={12} radius={14}
                lit={0.95} litColor={V.volt} sheenAt={S45 + 30} label="EL CABLE HACE EL TRABAJO"
                opacity={LN(g, S45 + 14, S45 + 52) * (1 - LN(g, 1596, 1632))}
              />
              <MediaCard
                src="broll/cmesilencio/cms_s14_cinta_siete_pared.mp4" kind="video"
                w={392} h={244} x={84} y={40} z={0} ry={-12} radius={14}
                lit={0.94} litColor={V.volt} sheenAt={1490} label="DE SIETE A CATORCE"
                opacity={LN(g, 1472, 1508) * (1 - LN(g, 1598, 1634))}
              />
              <IconPng
                src="img/cmesilencio/cms_ic_cable.png" x={17} y={66} size={116} z={0}
                opacity={LN(g, S45 + 40, S45 + 78) * (1 - LN(g, 1594, 1628))} glow={V.ink0}
              />
              <IconPng
                src="img/cmesilencio/cms_ic_medidor.png" x={84} y={66} size={112} z={0}
                opacity={LN(g, 1520, 1556) * (1 - LN(g, 1594, 1628))} glow={V.ink0}
              />
              <IconPng
                src="img/cmesilencio/cms_ic_dolar.png" x={50} y={30} size={126} z={0}
                opacity={LN(g, 1626, 1660) * (1 - LN(g, 1692, 1714))} glow={V.volt}
              />
            </Plane>

            <Plane z={120}>
              <Titular g={g} at={S45 + 24} out={1610} kick="EL DOBLE DE DISTANCIA" text="SEIS DECIBELES, GRATIS" top={140} />
              <Readout value="14" unit="M" label="DEL MEDIDOR AL GENERADOR" at={1528} x={50} y={72} size={132} color={V.volt} />

              {/* EL BLOQUE DEL ONCE: las tres lascas fundidas, y después se hunde en el marcador */}
              {funde > 0.02 && (
                <div style={{
                  position: "absolute", left: "88%", top: `${lerp(62, 15, hunde).toFixed(1)}%`,
                  width: 268, height: 268, marginLeft: -134, marginTop: -134,
                  opacity: funde * (1 - hunde * 0.94),
                  transform: `scale(${lerp(0.86, lerp(1, 0.36, hunde), funde).toFixed(3)})`,
                  borderRadius: 10,
                  background: `linear-gradient(172deg, ${rgba(V.volt, 0.94)} 0%, ${rgba(V.voltSoft, 0.88)} 62%, ${rgba(V.ink1, 0.96)} 100%)`,
                  boxShadow: `0 26px 60px ${rgba(V.ink0, 0.86)}, inset 0 3px 0 ${rgba(V.white, 0.46)}, inset 0 -7px 0 ${rgba(V.ink0, 0.42)}`,
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                }}>
                  <Num size={132} color={V.ink0}>11</Num>
                  <div style={{ marginTop: 2 }}><Kick color={rgba(V.ink0, 0.78)}>GRATIS</Kick></div>
                </div>
              )}

              {g > 1638 && (
                <div style={{
                  position: "absolute", left: 148, top: 470, opacity: LN(g, 1642, 1676) * (1 - LN(g, 1706, END)),
                }}>
                  <Bed pad={26} w={640}>
                    <Body size={31}>
                      De los dieciocho que bajé, <Em>once</Em> salieron de girar, tapar y alejar.
                      Ni un peso.
                    </Body>
                  </Bed>
                </div>
              )}
            </Plane>
          </>
        )}

        {/* ═══ LAS TRES LASCAS · viven por encima de los actos y se apilan al costado ═════ */}
        <Plane z={150}>
          <Lasca g={g} n="−2" at={512} fromX={82} fromY={22} toX={88} toY={44} fund={funde} />
          <Lasca g={g} n="−3" at={1250} fromX={82} fromY={22} toX={88} toY={58} fund={funde} />
          <Lasca g={g} n="−6" at={1578} fromX={82} fromY={22} toX={88} toY={72} fund={funde} />
          <Marcador g={g} db={db} dist={dobla > 0.5 ? "A 14 METROS" : "A 7 METROS"} on={LN(g, S01 + 20, S01 + 60)} hundido={hunde} />
        </Plane>

        {/* PLANO DE PRIMER TÉRMINO: el polvo del patio, parallax fuerte, hold vivo */}
        <Plane z={300} style={{ pointerEvents: "none" }}>
          {Array.from({ length: 15 }, (_, i) => {
            const sp = 0.5 + rnd(i * 11.3) * 1.5;
            const yy = (((rnd(i * 4.4) * 132 - (g * sp) / 9) % 132) + 132) % 132;
            const s = 3 + rnd(i * 7.9) * 5;
            return (
              <div key={i} style={{
                position: "absolute", left: `${(rnd(i * 2.2) * 110 - 5).toFixed(2)}%`, top: `${(yy - 12).toFixed(2)}%`,
                width: s, height: s, borderRadius: "50%",
                background: rgba(V.white, 0.05 + rnd(i * 5.1) * 0.1),
              }} />
            );
          })}
        </Plane>
      </Layers>

      {/* ── COSTURA DE ENTRADA · la TAPA DE CONTRACHAPADO se abre hacia arriba y tapa el cuadro
             en el instante exacto en que el calor se cambia por el patio (V.paper, lit .30) ─ */}
      <SeamOcclude at={S01 - 15} dur={30} color={V.paper} angle={78} lit={0.30} />

      {/* ── COSTURA 3→4 · la CORONACIÓN DEL MURO pasa por delante del lente (V.concrete) ─── */}
      <SeamOcclude at={S34 - 13} dur={26} color={V.concrete} angle={-6} lit={0.30} />

      {/* la noche azul del cierre: se cierra sobre la caja del fondo y entrega a MovLana */}
      <AbsoluteFill style={{
        background: `radial-gradient(${lerp(126, 96, ES(g, 1640, END)).toFixed(0)}% ${lerp(94, 70, ES(g, 1640, END)).toFixed(0)}% at ${lerp(50, 40, ES(g, 1650, END)).toFixed(1)}% ${lerp(50, 58, ES(g, 1650, END)).toFixed(1)}%, rgba(0,0,0,0) 40%, ${rgba(V.ink0, lerp(0.46, 0.84, ES(g, 1420, END)))} 100%)`,
        pointerEvents: "none",
      }} />
    </AbsoluteFill>
  );
};

export const MovDieciocho: React.FC<{ acto?: number; gFrame?: number }> = ({ acto = 0, gFrame }) => {
  void acto;                       // el build lo usa para saber qué acto monta; acá TODO sale de `g`
  const localF = useCurrentFrame();
  const gf = gFrame ?? localF;
  // Los componentes del Stage leen useCurrentFrame(). Con este Sequence, adentro
  // useCurrentFrame() === gFrame: las costuras, el SoundField, los Readout y la deriva de las
  // tarjetas quedan CONTINUOS aunque el build monte cada acto en su propia ventana.
  const off = Math.round(localF - gf);
  const g = Math.max(0, Math.min(END, gf));
  return (
    <Sequence from={off} layout="none">
      <Dieciocho g={g} />
    </Sequence>
  );
};

/*
── TABLA DE ENTRADA Y SALIDA DE LOS ACTOS ─────────────────────────────────────────────────────
ACTO | RANGO g (ventana)    | ENTRA (encuadre + luz)                          | SALE (encuadre + luz)                             | COSTURA hacia el siguiente
-----|----------------------|-------------------------------------------------|---------------------------------------------------|------------------------------------------------
 0→1 | 0 → 34               | ADENTRO del calor de MovHorno: rojo-ámbar,      | —                                                 | OCCLUDER DE MATERIA: la TAPA de contrachapado
     |                      | la lámina del codo respirando (cám cerrada)     |                                                   | se abre hacia arriba (V.paper, lit .30 = 76/255)
-----|----------------------|-------------------------------------------------|---------------------------------------------------|------------------------------------------------
 1   | 34 → 360   (0-380)   | ALTO Y LEJOS sobre el patio, `sky` frío;        | media altura, el generador ya grande;             | LA CÁMARA SIGUE: el descenso no se interrumpe
     |                      | SoundField a 78 saturando el cuadro; el lóbulo | 78 todavía; el lóbulo empezando a girar           | y el lóbulo tampoco — el acto 2 ya está dentro
     |                      | brillante mira a la ventana amarilla           | (cám bajando, z≈+10)                              | del mismo recorrido
-----|----------------------|-------------------------------------------------|---------------------------------------------------|------------------------------------------------
 2   | 360 → 690  (340-710) | a la altura del tanque, `sky` un punto más     | los anillos densos apuntando al fondo oscuro;     | METAMORFOSIS: el anillo exterior del lóbulo se
     |                      | frío; el arco de tiza en el piso               | marcador 76, la lasca −2 apilada (cám z≈+110)     | ESTIRA y se vuelve la recta blanca de la línea
     |                      |                                                 |                                                   | de vista (arco → recta, volt → blanco)
-----|----------------------|-------------------------------------------------|---------------------------------------------------|------------------------------------------------
 3   | 690 → 1050 (670-1070)| casi al ras del concreto, corrida hacia el     | la ventana en sombra acústica, los anillos        | OCCLUDER DE MATERIA: la CORONACIÓN del muro
     |                      | muro; la recta blanca llega entera             | doblados sobre la arista (cám z≈+200)             | pasa por delante del lente (V.concrete, lit .30)
-----|----------------------|-------------------------------------------------|---------------------------------------------------|------------------------------------------------
 4   | 1050 → 1395(1030-…)  | baja, acompañando el arrastre de la caja;      | la caja detrás de la sombra, marcador 73,         | ZOOM-THROUGH: la cámara entra en el ROLLO DEL
     |                      | la cinta amarilla desenrollándose              | lasca −3 apilada; el rollo de cable en cuadro     | CABLE naranja (22%, 82%) y sale al ras del piso
     |                      |                                                 | (cám z≈+290)                                      | en el fondo del terreno
-----|----------------------|-------------------------------------------------|---------------------------------------------------|------------------------------------------------
 5   | 1395 → 1725(1375-…)  | al ras del piso siguiendo el cable naranja     | PLANO LARGO del patio entero, NOCHE AZUL, tres    | (SALIDA) marcador 60. La cámara ya insinúa el
     |                      | hasta el fondo; 7 → 14 m, los anillos se ralean| anillos tranquilos, la ventana chiquita; el       | descenso hacia la caja y la viñeta se corre
     |                      | (cám z≈+330 → sube al plano largo)             | bloque del 11 hundido en el marcador              | sobre ella → MovLana entra por la junta
───────────────────────────────────────────────────────────────────────────────────────────────
*/
