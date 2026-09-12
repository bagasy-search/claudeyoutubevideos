import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, staticFile, OffthreadVideo } from "remotion";
import { Media } from "../components/Media";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

// ── AvatarPizarra (COMPONENTE NUEVO — "calidad pura") ────────────────────────
// Avatar a media pantalla a la DERECHA. A la IZQUIERDA, una pizarra UNIFICADA (marco
// y fondo constantes) donde el contenido cambia por CROSSFADE (sin animación de
// salida: el siguiente aparece ENCIMA del anterior, la pizarra nunca queda vacía).
// Cada ítem: una FOTO simple + texto debajo, O una TARJETA FLOTANTE con texto.
// NUNCA una imagen-diagrama (achicada queda ilegible).

const INTER = loadInter().fontFamily;
const C = { ink: "#0E1B22", teal: "#12B3AE", cream: "#F3F7F8", sub: "rgba(255,255,255,0.82)" };

// `at` = frame (relativo al inicio del componente) en que aparece este ítem —
// se clava al ms EXACTO en que el avatar lo menciona. Sin `at`, reparto parejo.
export type PizItem = { image?: string; caption?: string; eyebrow?: string; card?: string; sub?: string; at?: number };

const AV_W = 860, AV_X = 1920 - AV_W - 30;
const BOARD_R = AV_X - 40;

// una "diapositiva": CORTE LIMPIO (la imagen/tarjeta cambia al instante, sin fusión).
// `enter` (0→1) solo anima SUTILMENTE el TEXTO (marco e imagen ya están al instante).
const Slide: React.FC<{ item: PizItem; enter: number }> = ({ item, enter }) => {
  const isCard = !item.image && !!item.card;
  const txtOp = interpolate(enter, [0.15, 0.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const txtY = interpolate(enter, [0.15, 1], [12, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineW = interpolate(enter, [0.3, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      {/* fondo blureado de ESTE ítem — CONFINADO al panel IZQUIERDO (nunca sangra bajo el
          avatar de la derecha). Fix de raíz: el media va contenido en su mitad, no full-bleed. */}
      {item.image && (
        <div style={{ position: "absolute", left: 0, top: 0, width: AV_X - 15, height: 1080, overflow: "hidden" }}>
          <Media src={item.image} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(38px) brightness(0.44) saturate(1.05)", transform: "scale(1.2)" }} />
          {/* divisor sutil entre panel y avatar */}
          <div style={{ position: "absolute", right: 0, top: 0, width: 2, height: "100%", background: "linear-gradient(180deg, transparent, rgba(18,179,174,0.35), transparent)" }} />
        </div>
      )}
      <div style={{ position: "absolute", left: 70, top: 0, width: BOARD_R - 70, height: 1080, display: "flex", flexDirection: "column", justifyContent: "center", gap: 32 }}>
        {item.eyebrow && (
          <div style={{ fontSize: 27, fontWeight: 800, letterSpacing: 3, textTransform: "uppercase", color: C.teal, opacity: txtOp, transform: `translateY(${txtY}px)` }}>{item.eyebrow}</div>
        )}
        {isCard ? (
          <div style={{ padding: "60px 56px", borderRadius: 30, background: "linear-gradient(160deg, rgba(255,255,255,0.10), rgba(255,255,255,0.04))", border: "1px solid rgba(255,255,255,0.16)", boxShadow: "0 30px 80px rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}>
            <div style={{ fontSize: 76, fontWeight: 900, color: C.cream, lineHeight: 1.05, letterSpacing: -1, opacity: txtOp, transform: `translateY(${txtY}px)` }}>{item.card}</div>
            {item.sub && <div style={{ fontSize: 40, fontWeight: 600, color: C.sub, marginTop: 18, lineHeight: 1.2, opacity: txtOp }}>{item.sub}</div>}
            <div style={{ marginTop: 24, height: 6, borderRadius: 3, width: lineW * 220, background: `linear-gradient(90deg, ${C.teal}, rgba(18,179,174,0.2))` }} />
          </div>
        ) : (
          <>
            {/* IMAGEN — corte limpio (aparece al instante, sin disolver) */}
            <div style={{ width: "100%", height: 490, borderRadius: 26, overflow: "hidden", border: "3px solid rgba(255,255,255,0.14)", boxShadow: "0 26px 70px rgba(0,0,0,0.5)" }}>
              <Media src={item.image!} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            {item.caption && (
              <div style={{ opacity: txtOp, transform: `translateY(${txtY}px)` }}>
                <div style={{ fontSize: 48, fontWeight: 800, color: C.cream, lineHeight: 1.16, textShadow: "0 3px 20px rgba(0,0,0,0.55)" }}>{item.caption}</div>
                <div style={{ marginTop: 18, height: 5, borderRadius: 3, width: lineW * 200, background: `linear-gradient(90deg, ${C.teal}, rgba(18,179,174,0.2))` }} />
              </div>
            )}
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const AvatarPizarra: React.FC<{
  durationInFrames: number;
  items: PizItem[];
  avatar?: string;
  avatarFrom?: number;
  objectPos?: string;
}> = ({ durationInFrames, items, avatar, avatarFrom = 0, objectPos = "50% 50%" }) => {
  const frame = useCurrentFrame();
  const n = Math.max(1, items.length);
  // momento de aparición de cada ítem: `at` clavado al ms del avatar; si no, reparto parejo
  const per = durationInFrames / n;
  const starts = items.map((it, i) => (it.at != null ? it.at : Math.round(i * per)));
  let idx = 0;
  for (let i = 0; i < n; i++) if (frame >= starts[i]) idx = i;
  const local = frame - starts[idx];

  // CORTE LIMPIO: la diapositiva cambia al instante (sin fusión de dos imágenes).
  // `enter` solo anima sutilmente el TEXTO del ítem actual.
  const enter = interpolate(local, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ fontFamily: INTER, backgroundColor: C.ink }}>
      {/* base oscura CONSTANTE (nunca parpadea) */}
      <AbsoluteFill style={{ background: "radial-gradient(120% 90% at 30% 40%, rgba(14,27,34,0.42), rgba(14,27,34,0.9))" }} />

      {/* diapositiva actual — corte limpio (una sola por vez, sin disolver) */}
      <Slide item={items[idx]} enter={enter} />

      {/* AVATAR a la derecha — CONSTANTE (no participa del crossfade) */}
      {avatar && (
        <div style={{ position: "absolute", right: 30, top: 40, width: AV_W, height: 1000, borderRadius: 28, overflow: "hidden", boxShadow: "0 30px 90px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <OffthreadVideo src={staticFile(avatar)} trimBefore={avatarFrom} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: objectPos }} />
        </div>
      )}
    </AbsoluteFill>
  );
};
