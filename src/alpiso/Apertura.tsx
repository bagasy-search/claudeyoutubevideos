// alpiso · APERTURA (Claude, 13-oct-2026). Los primeros 10 s arrancan en la MINIATURA real y nunca quedan quietos:
// empuje lento de cámara sobre th_card → transición al still del reel (último cuadro).
// ⚠️ PENDIENTE: `still` por defecto = th_card (placeholder). Cuando salga el reel del avatar, pasar el still real
// (p. ej. "img/alpiso/ap_reel_still.jpg") desde el EDL o desde quien monte la apertura. No está cableado en Full.tsx todavía.
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { useCurrentFrame } from "remotion";
import { fr, cl, ez, img, Grade, Grain } from "./Base";

export const APERTURA_INICIO = "img/alpiso/th_card_sintexto.jpg"; // miniatura sin texto ni flecha (inpaint de th_card.jpg)
export const APERTURA_PENDIENTE = "img/alpiso/ap_reel_still.jpg"; // still del reel del avatar (frame 5 s, out/alpiso_avatar/reel.mp4)

export const Apertura: React.FC<{ a: number; d: number; still?: string; fundidoS?: number }> = ({
  a, d, still = APERTURA_PENDIENTE, fundidoS = 0.5,
}) => {
  const f = useCurrentFrame();
  const at = f - fr(a);
  const dur = Math.max(1, fr(d));
  const u = ez(cl(at / dur));
  // empuje lento: 1.04 → 1.12, deriva suave hacia arriba
  const z = 1.04 + 0.08 * u;
  const x = -1.2 * u;
  const y = -0.8 * u;
  // fundido al still final en el último tramo
  const fundIn = fr(d) - fr(fundidoS);
  const k = ez(cl((at - fundIn) / Math.max(1, fr(fundidoS))));
  const transformo = `translate(${x}%, ${y}%) scale(${z})`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: transformo, transformOrigin: "50% 50%" }}>
        <Img src={img(APERTURA_INICIO)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {still !== APERTURA_INICIO && (
        <AbsoluteFill style={{ opacity: k, transform: transformo, transformOrigin: "50% 50%" }}>
          <Img src={img(still)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      )}
      <Grade />
      <Grain />
    </AbsoluteFill>
  );
};
