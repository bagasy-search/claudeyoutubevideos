// MovCta.tsx — MOVIMIENTO 7 · "LOS DOS INODOROS QUE TRES PLOMEROS CONDENARON" · 780 frames @30fps (26 s)
// Canal Mike Dalton (EN) · video `mdring`.
//
// UN SOLO PLANO SECUENCIA. La MATERIA que cruza las cuatro fronteras es LA PÁGINA: la misma hoja
// que en el acto 1 aparece de canto sobre el banco es la que en el acto 2 se abre y muestra el
// paso que nadie conoce, la que en el acto 3 se apila con las otras — y la que en el acto 4 se
// gira de canto otra vez hasta convertirse en el CUADRADO del QR.
//
// ⛔ REGLA DEL CANAL: ni precio ni link hablado. El QR es la única puerta y se presenta como un
// gesto físico ("apuntá la cámara"), no como una venta.
//
// ACTO 1 · f0–170 · "CAROL, PHOENIX"          cam {z −200}  luz {FRÍO}
//   ── FRONTERA A @154 · la página gira de canto y tapa el cuadro ──
// ACTO 2 · f170–420 · "EL PASO QUE NADIE SABE" la página se abre; el sellado del esmalte
//   ── FRONTERA B @404 · OCLUSIÓN por la propia página ──
// ACTO 3 · f420–580 · "ONCE SEMANAS. NADA."    la foto del resultado; luz CÁLIDA
//   ── FRONTERA C @564 · las páginas se apilan y se giran ──
// ACTO 4 · f580–780 · "APUNTÁ LA CÁMARA"       el QR, hold LARGO y quieto (tiene que escanearse)
import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, Img } from "remotion";
import {
  MD, rgba, clamp01, lerp, eio, cam, light, Atmos, Occluder, Sheen, TextBed, Kicker, Title, Em, glassStyle, F_SANS,
} from "../mdmold/Stage";

const A1 = 0, A2 = 170, A3 = 420, A4 = 580, END = 780;

export const MovCta: React.FC<{
  durationInFrames: number;
  qr?: string;
  pages?: string[];
}> = ({ durationInFrames, qr = "img/mdring_qrcard.png", pages = [] }) => {
  const frame = useCurrentFrame();
  const f = Math.min(frame, END);

  const C = cam(f, { z0: -200, z1: 260, panY: -30, ry: 5, dur: A4 });
  const tint = light(clamp01((f - A3) / 120), "cold", "warm");
  const keyPos = interpolate(f, [A1, A2, A4, END], [0.28, 0.46, 0.34, 0.32], { extrapolateRight: "clamp" });

  // la página: de canto → abierta → apilada → cuadrado del QR
  const open = clamp01((f - A2 + 10) / 90);
  const stack = clamp01((f - A3 + 10) / 90);
  const toQr = clamp01((f - A4 + 20) / 80);

  // el QR tiene que estar QUIETO para escanearse: cero deriva después de que entra
  const qrSettled = clamp01((f - A4 - 70) / 40);

  return (
    <AbsoluteFill style={{ backgroundColor: MD.ink0, overflow: "hidden" }}>
      <Atmos tint={tint} keyFrom={keyPos} intensity={interpolate(f, [A1, A3, END], [0.95, 1.15, 1.05], { extrapolateRight: "clamp" })} />

      {/* ── la escena: se congela cuando aparece el QR ── */}
      <AbsoluteFill
        style={{
          transform: qrSettled > 0.9 ? "none" : C.transform,
          transformOrigin: "50% 50%",
        }}
      >
        {/* las páginas de la guía */}
        {toQr < 0.98 &&
          pages.slice(0, 3).map((p, i) => {
            const spread = lerp(0, 1, stack);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${(30 + i * 9 * spread).toFixed(1)}%`,
                  top: `${(16 + i * 5 * spread).toFixed(1)}%`,
                  width: "26%", aspectRatio: "1024/1536",
                  transform:
                    `rotateY(${lerp(84, 6 + i * 3, open).toFixed(1)}deg) rotate(${(-6 + i * 5 * spread).toFixed(1)}deg) ` +
                    `scale(${lerp(1, 0.7, toQr).toFixed(3)})`,
                  transformOrigin: "50% 50%",
                  boxShadow: `0 30px 80px ${rgba(MD.ink0, 0.8)}`,
                  opacity: clamp01(open * 3) * (1 - toQr),
                  overflow: "hidden",
                  borderRadius: 6,
                }}
              >
                <Img src={staticFile(p)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            );
          })}

        {/* EL QR — nace del giro de la última página */}
        {toQr > 0.01 && (
          <div
            style={{
              position: "absolute", left: "50%", top: "46%",
              transform:
                `translate(-50%,-50%) rotateY(${lerp(80, 0, toQr).toFixed(1)}deg) ` +
                `scale(${lerp(0.5, 1, eio(0, 1, toQr)).toFixed(3)})`,
              width: 460, height: 460,
              borderRadius: 18,
              background: MD.white,
              padding: 16,
              boxShadow: `0 30px 90px ${rgba(MD.ink0, 0.85)}, 0 0 0 6px ${rgba(MD.red, 0.5)}`,
              opacity: clamp01(toQr * 2),
            }}
          >
            <Img src={staticFile(qr)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        )}
      </AbsoluteFill>

      <Sheen at={A2 + 40} dur={26} angle={16} />
      <Occluder at={A2 - 14} dur={14} color={MD.ink1} angle={8} />
      <Occluder at={A3 - 14} dur={14} color={MD.ink2} angle={-6} />
      <Occluder at={A4 - 14} dur={14} color={MD.ink1} angle={5} />

      <AbsoluteFill style={{ padding: 92, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
        {f < A2 && (
          <div style={{ opacity: clamp01((f - 36) / 24) * clamp01((A2 - f) / 26), maxWidth: 1180 }}>
            <TextBed>
              <Kicker>Phoenix. The hardest water in the country.</Kicker>
              <Title size={64}>Three plumbers told her the same thing. <Em>Replace them.</Em></Title>
            </TextBed>
          </div>
        )}
        {f >= A2 + 60 && f < A3 && (
          <div style={{ opacity: clamp01((f - A2 - 70) / 24) * clamp01((A3 - f) / 26), maxWidth: 1240 }}>
            <TextBed>
              <Title size={62}>She sealed the pitted glaze back closed</Title>
              <Title size={62}>with a <Em>ceramic glass coating</Em>.</Title>
            </TextBed>
          </div>
        )}
        {f >= A3 + 40 && f < A4 && (
          <div style={{ opacity: clamp01((f - A3 - 50) / 24) * clamp01((A4 - f) / 26), maxWidth: 1160 }}>
            <TextBed>
              <Kicker>Eleven weeks later</Kicker>
              <Title size={70}>Nothing.</Title>
            </TextBed>
          </div>
        )}
        {f >= A4 + 60 && (
          <div style={{ opacity: clamp01((f - A4 - 70) / 26), maxWidth: 1320 }}>
            <TextBed>
              <Kicker>Exact products, exact order, dilution chart</Kicker>
              <Title size={56}>Point your phone camera at it.</Title>
              <div style={{ fontFamily: F_SANS, fontWeight: 600, fontSize: 26, color: rgba(MD.white, 0.6), marginTop: 8 }}>
                It opens by itself — nothing to type
              </div>
            </TextBed>
          </div>
        )}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          opacity: 0.05,
          backgroundImage: "repeating-conic-gradient(rgba(255,255,255,.5) 0% 25%, rgba(0,0,0,.5) 0% 50%)",
          backgroundSize: "3px 3px", mixBlendMode: "overlay",
        }}
      />
    </AbsoluteFill>
  );
};

export const MOVCTA_FRAMES = END;
