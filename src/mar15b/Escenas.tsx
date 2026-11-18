// Escenas mar15b · tres escenas hechas con las fotos reales (ver D:/rtmp/mar15b/ideas.md)
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";

const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const S = (n: string) => staticFile(`mar15b/g/${n}.jpg`);
const NOMAX: React.CSSProperties = { maxWidth: "none", maxHeight: "none" };   // index.css trae img{max-width:100%}: achica las copias anchas dentro de cajas chicas
const FULL: React.CSSProperties = { ...NOMAX, position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "fill" };
const BOX: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080, overflow: "hidden" };
const EASE = Easing.bezier(0.45, 0, 0.2, 1);

// 1 · La escarcha real de la ventana (1830,420) crece sobre el cuadro como sobre un vidrio; en "confused" cruza la cama,
//     en "shivering" le llega a los puños y todo tirita; en "four" sólo queda tibio el círculo de la lámpara (225,370).
const WIN = [1830, 420];
const LAMP = [225, 400];
export const Shiver: React.FC<{ dur: number; fConf: number; fShiv: number; fFour: number }> = ({ dur, fConf, fShiv, fFour }) => {
  const f = useCurrentFrame();
  const R = interpolate(f, [8, fConf, fShiv, fFour, dur], [0, 520, 960, 1500, 1700], { ...CL, easing: EASE });
  const frost = `radial-gradient(circle ${Math.max(1, R)}px at ${WIN[0]}px ${WIN[1]}px, #000 0%, #000 ${R > 200 ? 78 : 40}%, transparent 100%)`;
  const warmR = interpolate(f, [fFour - 10, fFour + 14], [900, 330], { ...CL, easing: EASE });
  const warm = `radial-gradient(circle ${warmR}px at ${LAMP[0]}px ${LAMP[1]}px, #000 45%, transparent 100%)`;
  const shake = interpolate(f, [fShiv - 2, fShiv + 4, fShiv + 30, fShiv + 44], [0, 1, 1, 0.25], CL);
  const jx = (Math.sin(f * 2.9) + Math.sin(f * 5.3) * 0.5) * 2.2 * shake, jy = Math.cos(f * 3.7) * 1.4 * shake;
  const cam = interpolate(f, [0, dur], [1.04, 1.1], CL);
  const cold = interpolate(f, [fShiv, fFour + 10], [0, 1], CL);
  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0f12", overflow: "hidden" }}>
      <div style={{ ...BOX, transform: `scale(${cam}) translate(${jx}px, ${jy}px)`, transformOrigin: "975px 470px" }}>
        <Img src={S("e_shiver")} style={FULL} />
        {/* capa helada: la misma foto lavada hacia el azul, con cristales de gradientes finos */}
        <div style={{ ...BOX, WebkitMaskImage: frost, maskImage: frost }}>
          <Img src={S("e_shiver")} style={{ ...FULL, filter: `saturate(${0.35 - cold * 0.15}) brightness(${1.12 - cold * 0.1}) contrast(0.92) blur(0.7px)` }} />
          <div style={{ ...BOX, background: "rgba(176,205,236,0.34)", mixBlendMode: "screen" }} />
          <div style={{ ...BOX, opacity: 0.5, mixBlendMode: "screen",
            background: [
              "repeating-linear-gradient(62deg, rgba(255,255,255,0.10) 0 1px, transparent 1px 9px)",
              "repeating-linear-gradient(-38deg, rgba(255,255,255,0.09) 0 1px, transparent 1px 13px)",
              "repeating-linear-gradient(118deg, rgba(235,245,255,0.07) 0 2px, transparent 2px 21px)",
              "radial-gradient(circle at 1830px 420px, rgba(255,255,255,0.22), transparent 60%)",
            ].join(",") }} />
        </div>
        {/* lo único que se paga con los doce dólares: el círculo tibio de la lámpara sigue sin hielo */}
        <div style={{ ...BOX, WebkitMaskImage: warm, maskImage: warm, opacity: interpolate(f, [fFour - 10, fFour], [0, 1], CL) }}>
          <Img src={S("e_shiver")} style={FULL} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 2 · En el vidrio oscuro del termostato (355–550 x 330–710) aparece el reflejo espejado de la puerta de entrada (900–1200 x 250–760);
//     en "front door" se vuelve nítido y la cámara llega al vidrio.
const GLASS = "polygon(355px 330px, 550px 336px, 548px 702px, 360px 712px)";
const SX = 195 / 300, SY = 380 / 510;
export const Hall: React.FC<{ dur: number; fHall: number; fDoor: number }> = ({ dur, fHall, fDoor }) => {
  const f = useCurrentFrame();
  const cam = interpolate(f, [0, fHall, fDoor + 6, dur], [1.0, 1.06, 1.55, 1.6], { ...CL, easing: EASE });
  const op = interpolate(f, [fHall - 6, fHall + 14, fDoor - 4, fDoor + 8], [0, 0.22, 0.32, 0.55], CL);
  const bl = interpolate(f, [fHall, fDoor + 8], [3.5, 0], CL);
  return (
    <AbsoluteFill style={{ backgroundColor: "#16140f", overflow: "hidden" }}>
      <div style={{ ...BOX, transform: `scale(${cam})`, transformOrigin: "452px 520px" }}>
        <Img src={S("e_hall")} style={FULL} />
        <div style={{ ...BOX, clipPath: GLASS, opacity: op, mixBlendMode: "screen" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0",
            transform: `translate(${550 + 900 * SX}px, ${330 - 250 * SY}px) scale(${-SX}, ${SY})` }}>
            <Img src={S("e_hall")} style={{ ...FULL, filter: `blur(${bl}px) brightness(0.95) contrast(1.1)` }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 3 · Una lupa (copia de la foto al doble recortada en círculo) aparece sobre las manos que se tocan en "Mama",
//     viaja por la pared hasta el dial de bronce (1615,325) en "number" y engorda en "below".
const HANDS = [870, 840], DIAL = [1615, 325];
export const Mama: React.FC<{ dur: number; fMama: number; fNum: number; fBelow: number }> = ({ dur, fMama, fNum, fBelow }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [fMama + 8, fNum + 12], [0, 1], { ...CL, easing: EASE });
  const cx = HANDS[0] + (DIAL[0] - HANDS[0]) * k, cy = HANDS[1] + (DIAL[1] - HANDS[1]) * k;
  const r = interpolate(f, [fMama - 4, fMama + 8, fBelow, fBelow + 12], [0, 115, 115, 150], { ...CL, easing: EASE });
  const z = interpolate(f, [fBelow, fBelow + 12], [2, 2.4], { ...CL, easing: EASE });
  const cam = interpolate(f, [0, dur], [1.02, 1.07], CL);
  return (
    <AbsoluteFill style={{ backgroundColor: "#140d08", overflow: "hidden" }}>
      <div style={{ ...BOX, transform: `scale(${cam})`, transformOrigin: "1200px 560px" }}>
        <Img src={S("e_mama")} style={FULL} />
        {r > 1 && (
          <>
            <div style={{ position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: "50%",
              boxShadow: "0 14px 40px rgba(0,0,0,0.55)" }} />
            <div style={{ ...BOX, clipPath: `circle(${r}px at ${cx}px ${cy}px)` }}>
              <div style={{ ...BOX, overflow: "visible", transform: `scale(${z})`, transformOrigin: `${cx}px ${cy}px` }}>
                <Img src={S("e_mama")} style={{ ...FULL, filter: "brightness(1.08) contrast(1.05)" }} />
              </div>
              <div style={{ position: "absolute", left: cx - r, top: cy - r, width: r * 2, height: r * 2, borderRadius: "50%",
                boxShadow: "inset 0 0 0 2px rgba(255,248,230,0.35), inset 0 -18px 30px rgba(0,0,0,0.25), inset 0 14px 24px rgba(255,255,255,0.12)" }} />
            </div>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};

export const ESC_MAR15B = { shiver: Shiver, hall: Hall, mama: Mama } as Record<string, React.FC<any>>;
