// MovClose.tsx — MOVIMIENTO 7 · EL CIERRE del video `mddrain` — 1020 frames (34,0 s) @30fps.
//
// Mike cierra confesando: manejó la máquina años, le cobró a gente —en plural— por una
// herramienta que nunca iba a tocar lo que les molestaba, y un viejo con un papel de cocina lo
// desarmó en once segundos. El remate es una instrucción: no llames a nadie, no compres nada,
// mojá un papel, pasalo por debajo del borde y MIRALO. Estuvo a cuatro pulgadas todo este tiempo.
//
// ⛔ NADA de objetos dibujados con CSS haciendo de cosa real: la botella marrón es el CLIP
//    `h49_bottlehold`, el papel es `h11_holdtowelup` / `h07_wettowel`, la máquina es
//    `h04_machinefloor`. Cada tarjeta flotante lleva MATERIAL REAL adentro, con marco de vidrio,
//    rim-light, reflejo y sombra de contacto que aterriza.
//
// ── TABLA DE HANDOFF ────────────────────────────────────────────────────────────────────────
// acto 1  f0-230    EL HOMBRE QUE LA MANEJÓ
//   enterFrom: cámara heredada del b-roll de la canilla caliente (vapor todavía en el aire),
//              luz FRÍA de cocina de noche, cam z=40.
//   exitTo:    la tarjeta hero ocupa TODO el cuadro (pasamos a través de ella).
//   materia:   EL PAPEL nace limpio en una tarjeta satélite abajo a la derecha (`h07_wettowel`).
//   real:      hero = clip `h77_wipehands` (2 beats) · satélite = clip `h07_wettowel` (2 beats).
//
// acto 2  f230-460  LE COBRÉ A GENTE. EN PLURAL.
//   enterFrom: caemos DENTRO del plano de la máquina, a escala 1,58 (sigue el mismo empuje).
//   exitTo:    la máquina reducida a una placa lejana, apagada, con el piloto rojo muerto.
//   materia:   el PAPEL se acerca a cámara mientras la máquina se aleja (el cruce del acto).
//   real:      placa lejana = clip `h04_machinefloor` (2 beats) · tarjeta = clip `h11_holdtowelup` (2 beats).
//
// acto 3  f460-670  ONCE SEGUNDOS
//   enterFrom: la hoja de papel cruza el cuadro entero y tapa el corte.
//   exitTo:    el papel manchado gana el cuadro; entra vapor de la canilla.
//   materia:   el papel, ahora SUCIO: es la prueba.
//   real:      hero macro = clip `h08_reachunder` (2 beats) · tarjeta lateral = FOTO `h11_holdtowelup.jpg`.
//
// acto 4  f670-860  NO LLAMES. NO COMPRES.
//   enterFrom: el vapor barre y detrás ya está la botella apoyada en la mesada.
//   exitTo:    la botella se apoya y sale por abajo; el papel queda solo.
//   materia:   la botella real + el papel mojándose.
//   real:      hero = clip `h49_bottlehold` (2 beats) + su REFLEJO (foto espejada, enmascarada) ·
//              satélite = clip `h07_wettowel` y después su foto.
//
// acto 5  f860-1019 A CUATRO PULGADAS, TODO ESTE TIEMPO
//   enterFrom: la tarjeta satélite viaja y se CUADRA en 420x420 exactamente donde va el QR.
//   exitTo:    negro limpio, centro libre y calibrado para `MdQrCta` (QR 380x380 + 20 px de padding
//              blanco, centro en x≈543 / y=540). El papel es lo ÚLTIMO iluminado antes del negro.
//   materia:   el papel se vuelve la plancha blanca que la cámara del espectador va a leer.
//   real:      placa lejana = clip `h78_pointcamera` · dentro de la plancha, la marca de agua del QR.
//
// COSTURAS (una distinta por frontera, ⛔ ningún fade):
//   1→2 f230  ZOOM-THROUGH   — empujamos hasta ATRAVESAR la tarjeta hero y caemos dentro del
//                              plano de la máquina, que sigue el mismo vector y recién ahí se enmarca.
//   2→3 f460  OCLUSIÓN       — la hoja de papel (color hueso) cruza y tapa el 100% ~6 frames.
//   3→4 f670  WIPE POR MATERIA — el vapor de la canilla caliente barre y detrás ya está la botella.
//   4→5 f860  MATCH-SHAPE    — la tarjeta del papel viaja y se cuadra en la plancha del QR.
//
// PLANOS (6 + texto): P0 cama de cocina (_blur, z-420) · P1 placa lejana (z-150→-560) ·
// P2 mesada + hachas de luz (z-60) · P3 hero (z+40) · P4 tarjeta media (z+120) ·
// P5 primer plano EN ESPACIO DE PANTALLA con parallax propio (satélites, plancha, gotas, vapor) ·
// P6 texto (sin perspectiva, para que el safe-area sea exacto).
import React from "react";
import {
  AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, interpolate, useCurrentFrame, Easing,
} from "remotion";
import {
  MD, rgba, clamp01, lerp, rnd, cam, light, Atmos, Occluder, Sheen, VaporWipe, glassStyle,
  Kicker, Title, Em, TextBed,
} from "../mdmold/Stage";
import { DR } from "./Pipe";

const A2 = 230, A3 = 460, A4 = 670;

// ── MATERIAL REAL ───────────────────────────────────────────────────────────────────────────
// Cada uso de clip va envuelto en su propia <Sequence>, así el frame local del video arranca en 0
// y nunca se pide más allá de los 121 frames (5,04 s) que dura el asset.
const Clip: React.FC<{
  from: number; len: number; src: string; start?: number; scale?: number; x?: number; y?: number;
}> = ({ from, len, src, start = 0, scale = 1, x = 0, y = 0 }) => (
  <Sequence layout="none" from={from} durationInFrames={len}>
    <OffthreadVideo
      muted
      startFrom={start}
      src={staticFile(`broll/${src}.mp4`)}
      style={{
        position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover",
        transform: `translate(${x.toFixed(2)}%, ${y.toFixed(2)}%) scale(${scale.toFixed(4)})`,
      }}
    />
  </Sequence>
);

const Photo: React.FC<{ src: string; scale?: number; x?: number; y?: number; op?: number; flip?: boolean }> = ({
  src, scale = 1, x = 0, y = 0, op = 1, flip = false,
}) => (
  <Img
    src={staticFile(`img/${src}.jpg`)}
    style={{
      position: "absolute", left: 0, top: 0, width: "100%", height: "100%", objectFit: "cover",
      opacity: op,
      transform: `translate(${x.toFixed(2)}%, ${y.toFixed(2)}%) scale(${scale.toFixed(4)})${flip ? " scaleY(-1)" : ""}`,
    }}
  />
);

// ── LA TARJETA ──────────────────────────────────────────────────────────────────────────────
// Marco de vidrio del canal + rim-light del lado de la ventanita + bisel + sombra de CONTACTO que
// aterriza en el piso. El contenido (clip o foto) va adentro, recortado por el marco.
const Card: React.FC<{
  w: number; h: number; r?: number; lit?: number; grade?: number; contact?: number;
  sheenAt?: number; bg?: string; children?: React.ReactNode; style?: React.CSSProperties;
}> = ({ w, h, r = 14, lit = 1, grade = 1, contact = 1, sheenAt, bg, children, style }) => {
  const g = glassStyle({ radius: r, lit });
  return (
    <div style={{ position: "absolute", width: w, height: h, ...style }}>
      {/* sombra de contacto: la tarjeta pesa y toca el piso */}
      <div
        style={{
          position: "absolute", left: -w * 0.12, width: w * 1.24,
          bottom: -Math.round(h * 0.05), height: Math.round(h * 0.13), borderRadius: "50%",
          background: `radial-gradient(ellipse, rgba(0,0,0,${(0.66 * contact).toFixed(3)}) 0%, rgba(0,0,0,0) 72%)`,
        }}
      />
      <div style={{ ...g, position: "absolute", left: 0, top: 0, width: w, height: h, overflow: "hidden", background: bg ?? g.background }}>
        {children}
        {/* grade del canal: negro levantado + viraje rojo muy leve */}
        <AbsoluteFill style={{ background: "rgba(228,50,42,0.05)", mixBlendMode: "soft-light" }} />
        <AbsoluteFill
          style={{ background: `radial-gradient(90% 78% at 50% 42%, rgba(0,0,0,0) 44%, rgba(0,0,0,${(0.44 * grade).toFixed(3)}) 100%)` }}
        />
        {sheenAt !== undefined ? <Sheen at={sheenAt} dur={30} /> : null}
      </div>
      {/* rim-light: filo frío por la ventanita (arriba-izq) y rebote cálido del pasillo (abajo-der) */}
      <div
        style={{
          position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: r, pointerEvents: "none",
          mixBlendMode: "screen",
          background: `linear-gradient(118deg, ${rgba(MD.cold, 0.34 * lit)} 0%, rgba(255,255,255,0) 16%, rgba(255,255,255,0) 80%, ${rgba(MD.warm, 0.26 * lit)} 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute", left: 0, top: 0, width: w, height: h, borderRadius: r, pointerEvents: "none",
          boxShadow: `inset 0 0 0 1px ${rgba(MD.white, 0.18 * lit)}, inset 0 1px 0 ${rgba(MD.white, 0.42 * lit)}, inset 0 -1px 0 rgba(0,0,0,0.5)`,
        }}
      />
    </div>
  );
};

// ── VAPOR (hold vivo del primer plano) ──────────────────────────────────────────────────────
const Steam: React.FC<{ amount: number; seed?: number; cx?: number; cy?: number }> = ({ amount, seed = 0, cx = 52, cy = 74 }) => {
  const frame = useCurrentFrame();
  if (amount <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "screen", opacity: clamp01(amount) }}>
      {Array.from({ length: 9 }, (_, i) => {
        const s = rnd(i * 3.3 + seed);
        const s2 = rnd(i * 8.9 + seed);
        const p = (frame / (150 + s * 120) + s2) % 1;
        const size = 150 + s2 * 260;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(cx + (s - 0.5) * 46 + Math.sin(frame / (43 + s * 30) + i) * 2.2).toFixed(2)}%`,
              top: `${(cy - p * 62).toFixed(2)}%`,
              width: size, height: size * 0.72, borderRadius: "50%",
              background: `radial-gradient(circle at 44% 40%, ${rgba(MD.white, 0.09)} 0%, rgba(255,255,255,0) 70%)`,
              opacity: Math.sin(p * Math.PI) * (0.45 + s * 0.55),
              transform: `scale(${(0.7 + p * 0.8).toFixed(3)})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const MovClose: React.FC<{
  durationInFrames: number;
  qr?: string;        // "img/mddrain_qrcard.png"
  kitchen?: string;   // "img/mddrain_h77_wipehands.jpg"
}> = ({ durationInFrames, qr, kitchen }) => {
  const frame = useCurrentFrame();
  const D = Math.max(120, durationInFrames);

  // ⛔ UNA sola cámara, función del frame global del movimiento: NUNCA vuelve a 0.
  const c = cam(frame, { z0: 40, z1: 210, panX: -74, panY: -30, ry: 4.5, rx: -1.6, dur: D });
  const dr = (per: number, amp: number, ph = 0) => Math.sin(frame / per + ph) * amp;

  // ── LA LUZ: noche fría de cocina → cálida de resuelto → negro limpio ──────────────────────
  const warm = interpolate(frame, [0, 470, 800, 980], [0.1, 0.4, 1, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.32, 0, 0.24, 1),
  });
  const room = interpolate(frame, [0, 700, 900, 1004], [0.8, 1, 0.52, 0.05], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.3, 0, 0.3, 1),
  });
  const tint = light(warm, "cold", "warm");

  // la cama de cocina: el hermano `_blur.jpg` ya horneado (⛔ nunca filter:blur a pantalla completa)
  const bedSrc = (kitchen ?? "img/mddrain_h77_wipehands.jpg").replace(/\.(jpg|jpeg|png)$/i, "_blur.jpg");

  // ── ACTO 1 → 2 · ZOOM-THROUGH ────────────────────────────────────────────────────────────
  const heroPush = interpolate(frame, [0, 196, A2], [1, 1.06, 2.45], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.5, 0, 0.72, 0.2),
  });
  const heroZ = interpolate(frame, [196, A2], [40, 470], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.5, 0, 0.72, 0.2),
  });

  // ── ACTO 2 · la máquina se ALEJA y se apaga; el papel se ACERCA ───────────────────────────
  const machZ = interpolate(frame, [A2, A2 + 70, A3 - 6], [-150, -300, -560], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.18, 0.72, 0.24, 1),
  });
  const machS = interpolate(frame, [A2, A2 + 22, A3 - 6], [1.58, 1.16, 0.72], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.18, 0.72, 0.24, 1),
  });
  const machDim = interpolate(frame, [A2 + 34, A3 - 10], [0.04, 0.74], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pilot = interpolate(frame, [A2 + 60, 372, 404], [1, 0.9, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const paperNear = interpolate(frame, [A2 + 8, A3 - 8], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.2, 0.7, 0.22, 1),
  });

  // ── ACTO 4 · la botella entra, se apoya y sale por abajo ──────────────────────────────────
  const bottleIn = interpolate(frame, [666, 708], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 0.82, 0.2, 1),
  });
  const bottleOut = interpolate(frame, [852, 902], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.42, 0, 0.7, 0.4),
  });

  // ── ACTO 4 → 5 · MATCH-SHAPE: la tarjeta del papel se cuadra en la plancha del QR ─────────
  // Destino calibrado: 420x420 en (333,330) → centro x≈543 / y=540, exactamente donde `MdQrCta`
  // deja el código (QR 380x380 + 20 px de padding blanco).
  const mm = interpolate(frame, [846, 896], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.28, 0, 0.18, 1),
  });
  const satL = lerp(1300, 333, mm), satT = lerp(640, 330, mm);
  const satW = lerp(430, 420, mm), satH = lerp(268, 420, mm);
  const sheetDown = interpolate(frame, [860, 906], [-108, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.24, 0.8, 0.2, 1),
  });
  const mark = interpolate(frame, [906, 968], [0, 0.3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sheetLit = interpolate(frame, [896, 940, 984, 1006], [0.5, 1, 0.94, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.4, 0, 0.3, 1),
  });

  // ── ACTO 5 · la placa de dirección a cámara ───────────────────────────────────────────────
  const addrIn = interpolate(frame, [856, 900], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.16, 0.82, 0.2, 1),
  });
  const addrDim = interpolate(frame, [900, 940, 1000], [0.28, 0.5, 0.98], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const addrZ = interpolate(frame, [900, 1000], [-260, -520], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // parallax propio del plano de primer plano (espacio de pantalla, sin perspectiva: la posición
  // del QR y el safe-area tienen que ser exactos al píxel)
  const fgX = -c.e * 34 + dr(89, 5);
  const fgY = -c.e * 14 + dr(127, 3.4);
  const fgS = 1 + c.e * 0.1;
  const fg: React.CSSProperties = {
    transform: `translate(${fgX.toFixed(2)}px, ${fgY.toFixed(2)}px) scale(${fgS.toFixed(4)})`,
    transformOrigin: "50% 60%",
  };
  // el mismo plano, pero su parallax se APAGA a medida que la tarjeta se cuadra: en mm=1 el
  // transform es identidad y la plancha cae exactamente en los píxeles donde va el QR.
  const fgOut: React.CSSProperties = {
    transform: `translate(${(fgX * (1 - mm)).toFixed(2)}px, ${(fgY * (1 - mm)).toFixed(2)}px) scale(${(1 + (fgS - 1) * (1 - mm)).toFixed(4)})`,
    transformOrigin: "50% 60%",
  };

  const tin = (a: number, b: number) =>
    interpolate(frame, [a, a + 14, b - 12, b], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rise = (t: number) => `translateY(${lerp(26, 0, t).toFixed(1)}px)`;

  const plane = (z: number, x: number, y: number, s = 1): React.CSSProperties => ({
    transform: `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) scale(${s.toFixed(4)})`,
    transformStyle: "preserve-3d",
  });

  const t1 = tin(26, 224), t2 = tin(250, 452), t3 = tin(482, 662), t4 = tin(690, 852);

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0 }}>
      {/* ── LA ATMÓSFERA: se monta UNA sola vez y no se remonta entre actos ── */}
      <Atmos
        tint={tint}
        keyFrom={interpolate(frame, [0, D], [0.26, 0.64], { extrapolateRight: "clamp" })}
        intensity={(0.5 + warm * 0.6) * (0.26 + room * 0.74)}
      />

      {/* ══ EL ESPACIO 3D: una sola cámara, cinco planos con parallax propio ══ */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ position: "relative", width: 1920, height: 1080, transformStyle: "preserve-3d", transform: c.transform }}>

          {/* P0 · la cocina de fondo (foto _blur horneada, blur 0) */}
          <div
            style={{
              position: "absolute", left: -360, top: -220, width: 2640, height: 1520,
              ...plane(-420, -c.e * 22 + dr(97, 6), -c.e * 10 + dr(139, 4), lerp(1.02, 1.12, c.e)),
            }}
          >
            <Img
              src={staticFile(bedSrc)}
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: (0.26 + warm * 0.24) * room }}
            />
            <AbsoluteFill
              style={{ background: `radial-gradient(72% 62% at 46% 42%, rgba(0,0,0,0) 26%, rgba(0,0,0,${(0.72 + (1 - room) * 0.26).toFixed(3)}) 100%)` }}
            />
          </div>

          {/* P1a · LA MÁQUINA (acto 2): entra a escala 1,42 —caemos dentro— y después se aleja y se apaga */}
          {frame >= 214 && frame < A3 && (
            <div style={{ position: "absolute", left: 280, top: 158, ...plane(machZ, -c.e * 10 + dr(103, 4), dr(151, 3), machS) }}>
              <Card w={1360} h={765} r={16} lit={0.9} grade={0.9} contact={0.9} sheenAt={A2 + 118}>
                <Clip from={214} len={128} src="mddrain_h04_machinefloor" start={4} scale={1.03} />
                <Clip from={342} len={118} src="mddrain_h04_machinefloor" start={22} scale={1.06} />
                {/* el piloto rojo de la máquina, que se muere */}
                <div
                  style={{
                    position: "absolute", left: "26%", top: "62%", width: 16, height: 16, borderRadius: "50%",
                    background: rgba(MD.redHot, 0.9 * pilot),
                    boxShadow: `0 0 ${(26 * pilot).toFixed(1)}px ${(8 * pilot).toFixed(1)}px ${rgba(MD.red, 0.6 * pilot)}`,
                    opacity: pilot * (0.7 + Math.sin(frame / 9) * 0.3),
                  }}
                />
                <AbsoluteFill style={{ background: `rgba(4,4,6,${machDim.toFixed(3)})` }} />
              </Card>
            </div>
          )}

          {/* P1b · LA DIRECCIÓN A CÁMARA (acto 5): Mike señala, con la botella marrón al lado */}
          {frame >= 856 && (
            <div
              style={{
                position: "absolute", left: 210, top: 118,
                ...plane(addrZ, -c.e * 8 + dr(111, 4), lerp(150, 0, addrIn) + dr(163, 3), lerp(0.96, 1, addrIn)),
                opacity: addrIn,
              }}
            >
              <Card w={1500} h={844} r={18} lit={0.82} grade={1} contact={0.8}>
                <Clip from={856} len={118} src="mddrain_h78_pointcamera" start={8} scale={1.04} />
                <AbsoluteFill style={{ background: `rgba(4,4,6,${addrDim.toFixed(3)})` }} />
              </Card>
            </div>
          )}

          {/* P2 · la mesada (plano medio que ancla todo) + dos hachas de luz de la ventanita */}
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, ...plane(-60, -c.e * 16 + dr(83, 3.4), dr(119, 2.6)) }}>
            <div
              style={{
                position: "absolute", left: -180, right: -180, bottom: 34, height: 168,
                background: `linear-gradient(180deg, ${rgba(MD.warm, 0.1 * warm * room)} 0%, rgba(0,0,0,0.86) 34%, rgba(0,0,0,0.96) 100%)`,
                boxShadow: `0 -2px 0 ${rgba(MD.warm, 0.26 * warm * room)}`,
              }}
            />
            {[0, 1].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute", left: `${8 + i * 21}%`, top: "-24%", width: 190 + i * 90, height: "104%",
                  transform: `rotate(${12 + i * 5}deg)`,
                  background: `linear-gradient(180deg, ${rgba(tint, (0.1 - i * 0.03) * room)} 0%, rgba(0,0,0,0) 76%)`,
                  opacity: 0.86 + Math.sin(frame / 71 + i) * 0.14,
                }}
              />
            ))}
          </div>

          {/* P3 · HERO acto 1: Mike apoyado en la mesada, secándose las manos (CLIP REAL, 2 beats) */}
          {frame < A2 && (
            <div style={{ position: "absolute", left: 420, top: 170, ...plane(heroZ, -c.e * 26 + dr(93, 6), -c.e * 8 + dr(133, 4), heroPush) }}>
              <Card w={1120} h={630} r={16} lit={1} grade={0.85} contact={1} sheenAt={112}>
                <Clip from={0} len={114} src="mddrain_h77_wipehands" start={6} scale={1.02} />
                <Clip from={114} len={118} src="mddrain_h77_wipehands" start={20} scale={1.06} />
              </Card>
            </div>
          )}

          {/* P3 · HERO acto 3: el macro del dedo con el papel bajo el borde (CLIP REAL, 2 beats) */}
          {frame >= 458 && frame < 668 && (
            <div
              style={{
                position: "absolute", left: 250, top: 150,
                ...plane(30, -c.e * 22 + dr(87, 5), dr(141, 4), lerp(0.94, 1.04, clamp01((frame - 458) / 150))),
              }}
            >
              <Card w={700} h={760} r={16} lit={1} grade={0.8} contact={1} sheenAt={572}>
                <Clip from={458} len={112} src="mddrain_h08_reachunder" start={8} scale={1.04} />
                <Clip from={570} len={100} src="mddrain_h08_reachunder" start={30} scale={1.09} />
              </Card>
            </div>
          )}

          {/* P3 · HERO acto 4: LA BOTELLA MARRÓN — clip real + su reflejo en la mesada */}
          {frame >= 666 && bottleOut < 0.999 && (
            <div
              style={{
                position: "absolute", left: 320, top: 150,
                ...plane(40, -c.e * 18 + dr(101, 5), lerp(70, 0, bottleIn) + bottleOut * 620 + dr(147, 3.6), lerp(0.92, 1, bottleIn)),
                opacity: bottleIn,
              }}
            >
              <Card w={480} h={640} r={14} lit={1} grade={0.72} contact={1 - bottleOut} sheenAt={790}>
                <Clip from={666} len={110} src="mddrain_h49_bottlehold" start={10} scale={1.03} />
                <Clip from={776} len={104} src="mddrain_h49_bottlehold" start={34} scale={1.08} />
              </Card>
              {/* el REFLEJO: la misma foto, espejada y enmascarada — la botella APOYA de verdad */}
              <div
                style={{
                  position: "absolute", left: 0, top: 644, width: 480, height: 150, overflow: "hidden",
                  opacity: (0.24 + warm * 0.14) * (1 - bottleOut),
                  WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 88%)",
                  maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 88%)",
                }}
              >
                <Photo src="mddrain_h49_bottlehold" flip scale={1.06} />
              </div>
            </div>
          )}

          {/* P4 · acto 2: EL PAPEL manchado se ACERCA mientras la máquina se aleja */}
          {frame >= 232 && frame < A3 && (
            <div
              style={{
                position: "absolute", left: 1060, top: 600,
                ...plane(lerp(50, 170, paperNear), -c.e * 30 + dr(79, 6), dr(123, 5), lerp(0.84, 1.1, paperNear)),
              }}
            >
              <Card w={430} h={242} r={12} lit={0.95} grade={0.8} contact={1} sheenAt={356}>
                <Clip from={232} len={118} src="mddrain_h11_holdtowelup" start={6} scale={1.03} />
                <Clip from={350} len={112} src="mddrain_h11_holdtowelup" start={24} scale={1.08} />
              </Card>
            </div>
          )}

          {/* P4 · acto 3: la FOTO del papel manchado en alto — la prueba */}
          {frame >= 466 && frame < 668 && (
            <div
              style={{
                position: "absolute", left: 1120, top: 250,
                ...plane(
                  120,
                  -c.e * 30 + dr(107, 6),
                  lerp(40, 0, clamp01((frame - 466) / 34)) + dr(129, 5),
                  lerp(0.9, 1, clamp01((frame - 466) / 40)),
                ),
                opacity: clamp01((frame - 466) / 22),
              }}
            >
              <Card w={460} h={600} r={12} lit={0.92} grade={0.86} contact={1} sheenAt={604}>
                <Photo
                  src="mddrain_h11_holdtowelup"
                  scale={lerp(1.16, 1.03, clamp01((frame - 466) / 200))}
                  y={lerp(-1.6, 1.2, clamp01((frame - 466) / 200))}
                />
              </Card>
            </div>
          )}
        </div>
      </AbsoluteFill>

      {/* ══ P5 · PRIMER PLANO en espacio de pantalla, con parallax propio ══ */}
      {/* acto 1: EL PAPEL nace LIMPIO — el objeto que cruza los cinco actos */}
      {frame >= 54 && frame < 236 && (
        <AbsoluteFill style={fg}>
          <Card
            w={380} h={214} r={12} lit={0.9} grade={0.8} contact={1} sheenAt={150}
            style={{
              left: 1330, top: 720,
              transform: `translateY(${lerp(56, 0, clamp01((frame - 54) / 40)).toFixed(1)}px) scale(${lerp(0.9, 1, clamp01((frame - 54) / 46)).toFixed(3)})`,
              opacity: clamp01((frame - 54) / 20) * (1 - clamp01((frame - 214) / 20)),
            }}
          >
            <Clip from={54} len={126} src="mddrain_h07_wettowel" start={8} scale={1.04} />
            <Clip from={180} len={58} src="mddrain_h07_wettowel" start={30} scale={1.1} />
          </Card>
        </AbsoluteFill>
      )}

      {/* acto 4 → 5: la tarjeta del papel VIAJA y se cuadra en la plancha del QR (MATCH-SHAPE) */}
      {frame >= 682 && sheetLit > 0.001 && (
        <AbsoluteFill style={fgOut}>
          <Card
            w={satW} h={satH} r={lerp(12, 8, mm)} lit={lerp(0.92, 1, mm)} grade={lerp(0.8, 0, mm)}
            contact={lerp(1, 0.55, mm)} sheenAt={mm > 0.5 ? 930 : 760}
            bg={mm > 0.02 ? `linear-gradient(158deg, #FCFBF7 0%, ${DR.foam} 46%, #DFDCD3 100%)` : undefined}
            style={{
              left: satL, top: satT,
              opacity: clamp01((frame - 682) / 22) * sheetLit,
              transform: `translateY(${(lerp(34, 0, clamp01((frame - 682) / 40)) + (1 - mm) * dr(117, 4)).toFixed(1)}px)`,
              boxShadow: mm > 0.5 ? `0 0 ${(76 * sheetLit).toFixed(0)}px ${(16 * sheetLit).toFixed(0)}px ${rgba(MD.warm, 0.2 * sheetLit)}` : undefined,
            }}
          >
            {/* material real hasta que la hoja limpia lo cubre */}
            <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", overflow: "hidden" }}>
              <Clip from={682} len={116} src="mddrain_h07_wettowel" start={4} scale={1.03} />
              {frame >= 798 && <Photo src="mddrain_h07_wettowel" scale={lerp(1.03, 1.12, clamp01((frame - 798) / 100))} />}
            </div>
            {/* LA HOJA LIMPIA baja y cubre: oclusión a escala de objeto, no un fundido */}
            {frame >= 856 && (
              <div
                style={{
                  position: "absolute", left: 0, top: `${sheetDown.toFixed(1)}%`, width: "100%", height: "100%",
                  background: `linear-gradient(158deg, #FDFCF9 0%, ${DR.foam} 44%, #DEDBD1 100%)`,
                  boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
                }}
              >
                {/* fibra del papel */}
                <AbsoluteFill style={{ opacity: 0.1, mixBlendMode: "multiply" }}>
                  <svg width="100%" height="100%">
                    <filter id="mddrclosefib">
                      <feTurbulence type="fractalNoise" baseFrequency="0.78" numOctaves="3" seed={23} />
                    </filter>
                    <rect width="100%" height="100%" filter="url(#mddrclosefib)" />
                  </svg>
                </AbsoluteFill>
                {/* la marca de agua del código: la plancha YA sabe lo que va a mostrar */}
                {qr && mark > 0.005 ? (
                  <Img
                    src={staticFile(qr)}
                    style={{
                      position: "absolute", left: "50%", top: "50%", width: 340, height: 340,
                      transform: "translate(-50%,-50%)", opacity: mark * sheetLit, mixBlendMode: "multiply",
                    }}
                  />
                ) : null}
              </div>
            )}
          </Card>
        </AbsoluteFill>
      )}

      {/* las gotas de la canilla se ordenan en cuadrícula en los MÁRGENES — el centro queda LIBRE */}
      {frame > 878 &&
        Array.from({ length: 24 }, (_, i) => {
          const side = i % 2;
          const idx = Math.floor(i / 2);
          const col = idx % 3, row = Math.floor(idx / 3);
          const s = rnd(i * 4.7), s2 = rnd(i * 10.3);
          const p = clamp01((frame - 878 - s * 46) / 110);
          const gx = side === 0 ? 4 + col * 4.1 : 85 + col * 4.1;
          const gy = 24 + row * 8.4;
          const out = 1 - clamp01((frame - 982) / 26);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${lerp(side === 0 ? 2 + s * 14 : 82 + s * 15, gx, p).toFixed(2)}%`,
                top: `${lerp(102, gy, p).toFixed(2)}%`,
                width: lerp(7, 13, p), height: lerp(7, 13, p),
                borderRadius: lerp(50, 3, p),
                background: rgba(MD.white, 0.34 + s2 * 0.34),
                boxShadow: `0 0 ${(12 * p).toFixed(1)}px ${rgba(MD.warm, 0.42 * p)}`,
                opacity: out * (0.22 + p * 0.6) * (0.8 + Math.sin(frame / 17 + i) * 0.2),
              }}
            />
          );
        })}

      {/* vapor: entra desde el b-roll de la canilla caliente y vuelve en la costura 3→4 */}
      <Steam
        amount={interpolate(frame, [0, 26, 640, 668, 720], [0.9, 0.3, 0.34, 0.95, 0.24], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) * room}
        cx={54}
        cy={78}
      />
      <Steam
        amount={interpolate(frame, [876, 892, 960, 1006], [0, 0.2, 0.14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        seed={31}
        cx={46}
        cy={96}
      />

      {/* ══ P6 · TEXTO — una idea por acto, sin perspectiva (safe-area exacto) ══ */}
      {t1 > 0.004 && (
        <div style={{ position: "absolute", left: 110, bottom: 84, width: 780, opacity: t1, transform: rise(t1) }}>
          <TextBed pad={28}>
            <Kicker>THE PART I DON&apos;T LIKE</Kicker>
            <div style={{ height: 14 }} />
            <Title size={72}>
              I ran that machine for <Em>years</Em>.
            </Title>
          </TextBed>
        </div>
      )}

      {t2 > 0.004 && (
        <div style={{ position: "absolute", left: 110, bottom: 96, width: 760, opacity: t2, transform: rise(t2) }}>
          <TextBed pad={28}>
            <Kicker>AND I SENT INVOICES</Kicker>
            <div style={{ height: 14 }} />
            <Title size={76}>
              I charged people. <Em>Plural</Em>.
            </Title>
            <div style={{ marginTop: 18, font: "500 31px/1.4 Inter, system-ui, sans-serif", color: rgba(MD.white, 0.84) }}>
              For a tool that was never going to touch what bothered them.
            </div>
          </TextBed>
        </div>
      )}

      {t3 > 0.004 && (
        <div style={{ position: "absolute", left: 110, bottom: 92, width: 720, opacity: t3, transform: rise(t3) }}>
          <TextBed pad={28}>
            <Kicker>ELEVEN SECONDS</Kicker>
            <div style={{ height: 14 }} />
            <Title size={74}>
              An old man <Em>undid</Em> me.
            </Title>
            <div style={{ marginTop: 18, font: "500 31px/1.4 Inter, system-ui, sans-serif", color: rgba(MD.white, 0.84) }}>
              With a paper towel. And he did me a favor.
            </div>
          </TextBed>
        </div>
      )}

      {t4 > 0.004 && (
        <div style={{ position: "absolute", left: 1000, top: 116, width: 800, opacity: t4, transform: rise(t4) }}>
          <TextBed pad={28}>
            <Kicker>NEXT TIME IT SMELLS</Kicker>
            <div style={{ height: 14 }} />
            <Title size={68}>
              Don&apos;t call. Don&apos;t buy. <Em>Wet a towel</Em>.
            </Title>
            <div style={{ marginTop: 18, font: "500 30px/1.4 Inter, system-ui, sans-serif", color: rgba(MD.white, 0.84) }}>
              Run it under the rim. Then look at it.
            </div>
          </TextBed>
        </div>
      )}

      {/* cama oscura del remate: la luz cae sobre la mitad derecha (⛔ nunca texto sobre imagen sin cama) */}
      {frame >= 872 && (
        <AbsoluteFill
          style={{
            background: "linear-gradient(90deg, rgba(0,0,0,0) 26%, rgba(6,6,8,0.62) 46%, rgba(6,6,8,0.82) 100%)",
            opacity: interpolate(frame, [872, 892, 996, 1008], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            pointerEvents: "none",
          }}
        />
      )}

      {/* acto 5 · el remate en bloques semánticos, a la derecha: donde `MdQrCta` pone su texto */}
      {frame >= 884 && (
        <div style={{ position: "absolute", left: 820, top: 392, width: 720 }}>
          <div style={{ opacity: tin(884, 1004), transform: rise(tin(884, 1004)) }}>
            <Title size={82}>Four inches away,</Title>
          </div>
          <div style={{ marginTop: 10, opacity: tin(918, 1004), transform: rise(tin(918, 1004)) }}>
            <Title size={82}>
              the <Em>whole time</Em>.
            </Title>
          </div>
          <div
            style={{
              marginTop: 26, width: lerp(0, 190, clamp01((frame - 946) / 26)), height: 4,
              background: MD.red, borderRadius: 2, opacity: tin(946, 1004),
              boxShadow: `0 0 22px ${rgba(MD.red, 0.6)}`,
            }}
          />
        </div>
      )}

      {/* el charco de luz donde va a aterrizar el código: queda VIVO respirando sobre el negro */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(30% 40% at 28.3% 50%, ${rgba(MD.warm, 0.16 * clamp01((frame - 900) / 60) * (0.86 + Math.sin(frame / 52) * 0.14))} 0%, rgba(0,0,0,0) 70%)`,
          opacity: clamp01((frame - 900) / 60),
          pointerEvents: "none",
        }}
      />

      {/* ══ COSTURAS ══ */}
      {/* 2→3 · OCLUSIÓN: la hoja de papel cruza el cuadro entero y tapa el corte */}
      <Occluder at={A3 - 8} dur={16} color={MD.bone} angle={6} />
      {/* 3→4 · WIPE POR MATERIA: el vapor de la canilla barre y detrás ya está la botella */}
      <VaporWipe at={A4 - 16} dur={32} />

      {/* el negro final: la cocina se apaga y el centro queda limpio y calibrado para el QR */}
      <AbsoluteFill
        style={{
          background: MD.ink0,
          opacity: interpolate(frame, [940, 1000, 1010], [0, 0.72, 0.86], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
