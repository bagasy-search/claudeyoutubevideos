// MovGuia.tsx — S13 · El atajo ya está hecho: las páginas reales de la guía, y el código en pantalla.
// ⛔ ÚLTIMO movimiento del video: termina en V.volt limpio, amaneciendo, SIN costura de salida.
// ⛔ EL QR va QUIETO: fuera de <Layers> (no lo toca la cámara), sin escala, sin nada encima, 470 px.
//    Aparece por opacidad entre f=1080 y f=1102 y queda CLAVADO de f=1104 a f=1476 (12,4 s).
// ── TABLA DE HANDOFF ────────────────────────────────────────────────────────────────────────
// acto | frames      | entra (cám / luz / materia)                    | sale (cám / luz / materia)
//  1   |    0 →  380 | z=-60 panX+215 · volt limpio .52 · papel cuaderno| z≈-86 · volt limpio · la página de las 14 acciones
//  2   |  380 →  740 | z≈-86 · volt limpio · la MISMA página, grande   | z≈-110 · volt limpio · papel de la guía
//  3   |  740 → 1080 | z≈-110 · volt limpio · papel + retrato          | z≈-135 · volt limpio · el costado del tablón
//  4   | 1080 → 1476 | mundo 2 (+1600 px) · volt limpio .58 · papel claro| FIN DEL VIDEO · volt limpio, sin costura
// ── COSTURAS (ninguna es un fade) ───────────────────────────────────────────────────────────
//  1→2 f=380  MATCH-SHAPE (la página de las 14 acciones se queda del carrusel y crece: misma instancia)
//  2→3 f=740  OCLUSIÓN V.paper (una hoja de la guía cruza el cuadro)
//  3→4 f=1080 MATCH-MOVE (rail 1600 px: la cámara se corre al costado y entra el panel del QR)
//  4→▸ f=1476 SIN COSTURA — el video termina acá, con el QR quieto en pantalla
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Audio, Img, staticFile } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rgba, gcam, light,
  VoltAtmos, Layers, Plane, MediaCard, Carousel3D, PhotoPlane, IconPng,
  Readout, SeamOcclude, Kick, Head, Body, Bed,
} from "./VoltStage";

const END = 1476;                      // 49,2 s × 30 — el acto 4 llega hasta acá
const A2 = 380, A3 = 740, A4 = 1080;
const WX = 1600;                       // el mundo 2 (el panel del QR) vive a +1600 px
const QR_ON = 1080, QR_QUIETO = 1104;  // el QR queda CLAVADO desde acá hasta END

const LN = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ES = (g: number, a: number, b: number) => eio(0, 1, LN(g, a, b));
const OP = (g: number, a: number, b: number, fi = 12, fo = 12) =>
  Math.min(LN(g, a, a + fi), 1 - LN(g, b - fo, b));

const PAGINAS = [
  { src: "img/cmesodimac/cmes_lam_14acciones.jpg", kind: "photo" as const, label: "LAS CATORCE ACCIONES" },
  { src: "img/cmesodimac/cmes_lam_60a_caros.jpg", kind: "photo" as const, label: "LOS SESENTA, MEDIDOS" },
  { src: "img/cmesodimac/cmes_lam_7conexiones.jpg", kind: "photo" as const, label: "LAS SIETE CONEXIONES" },
  { src: "img/cmesodimac/cmes_lam_cablefusible.jpg", kind: "photo" as const, label: "CABLE Y FUSIBLE" },
];

/** ancho determinista de cada renglón (nada de Math.random) */
const rnd01 = (i: number) => ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;

/** Las once que salen gratis — un gráfico (una lista de marcas), no una tarjeta con texto. */
const Once: React.FC<{ g: number }> = ({ g }) => {
  const vivo = OP(g, A2 + 40, A3 - 24, 18, 22);
  if (vivo <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 1210, top: 232, opacity: vivo }}>
      {Array.from({ length: 14 }, (_, i) => {
        const on = clamp01((g - (A2 + 60) - i * 13) / 8);
        const gratis = i < 11;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
            <div style={{
              width: 20, height: 20, borderRadius: 4,
              border: `2px solid ${rgba(gratis ? V.volt : V.bone, 0.7)}`,
              background: gratis ? rgba(V.volt, 0.86 * on) : rgba(V.bone, 0.12),
              boxShadow: gratis ? `0 0 ${Math.round(18 * on)}px ${rgba(V.volt, 0.6 * on)}` : "none",
            }} />
            <div style={{
              width: lerp(70, 210, rnd01(i)), height: 8, borderRadius: 4,
              background: gratis ? rgba(V.white, 0.20 + 0.42 * on) : rgba(V.white, 0.16),
            }} />
          </div>
        );
      })}
    </div>
  );
};

const Escena: React.FC<{ g: number }> = ({ g }) => {
  const cam = gcam(g, { z0: -60, z1: -170, panX: 215, panY: -12, ry: 5, rx: -2, dur: END });
  const rail = -WX * ES(g, A4 - 85, A4 + 5);
  const key = light(LN(g, 0, END), "volt", "amber");

  // MATCH-SHAPE: la MISMA página sale del carrusel (430×270 al frente) y crece
  const gr = ES(g, A2 - 60, A2 + 90);
  const pw = lerp(430, 860, gr), ph = lerp(270, 540, gr);
  const px = lerp(50, 36, gr), py = lerp(52, 50, gr);

  const oCar = OP(g, -20, A2 - 20, 1, 34);
  const oPag = OP(g, A2 - 62, A3 + 6, 8, 12);
  const o3 = OP(g, A3 - 6, A4 + 8, 14, 12);
  const o4 = OP(g, A4 - 100, END + 60, 30, 10);
  const qr = LN(g, QR_ON, QR_QUIETO - 2);   // 1080 → 1102 y CLAVADO en 1 hasta el final

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <VoltAtmos
        tint={V.volt} tint2={V.torch}
        keyFrom={lerp(0.52, 0.58, LN(g, 0, END))}
        intensity={1} floor={lerp(0.50, 0.46, LN(g, 0, END))}
      />
      <Layers cam={`${cam.transform} translate3d(${rail.toFixed(1)}px,0,0)`}>
        {/* ═══ MUNDO 1 · las páginas de la guía ═════════════════════════════════ */}
        <AbsoluteFill style={{ transformStyle: "preserve-3d" }}>
          <Plane z={-520}>
            <PhotoPlane src="broll/cmesodimac/cmes_mv_guia1.mp4" kind="video"
              dim={lerp(0.52, 0.44, LN(g, 0, A3))} tint={V.volt} scale={1.18} />
          </Plane>

          {/* ── ACTO 1 · el carrusel de páginas reales ─────────────────────────── */}
          {oCar > 0 && (
            <AbsoluteFill style={{ transformStyle: "preserve-3d", opacity: oCar }}>
              <Plane z={-30}>
                <Carousel3D items={PAGINAS} spin={LN(g, 0, A2) * 0.62}
                  radius={640} cardW={430} cardH={270} y={52} focus={0} litColor={key} />
              </Plane>
            </AbsoluteFill>
          )}

          {/* ── LA PÁGINA (misma instancia: sale del carrusel y crece) ─────────── */}
          {oPag > 0 && (
            <AbsoluteFill style={{ transformStyle: "preserve-3d", opacity: oPag }}>
              <Plane z={-30}>
                <MediaCard src="img/cmesodimac/cmes_lam_14acciones.jpg" kind="photo"
                  w={pw} h={ph} x={px} y={py} ry={lerp(0, -5, gr)} lit={0.94} litColor={key}
                  sheenAt={A2 + 30} label="LA HOJA QUE MÁS ME PIDEN" />
              </Plane>
              <Plane z={150}>
                <div style={{ position: "absolute", left: 118, top: 128, opacity: OP(g, 30, A2 - 30, 18, 24) }}>
                  <Bed pad={24} w={560}>
                    <Kick>EL ATAJO</Kick>
                    <Head size={78}>Ya está hecho.</Head>
                    <div style={{ height: 10 }} />
                    <Body size={29}>Los sesenta aparatos medidos, la tabla de cable y fusible, las siete conexiones.</Body>
                  </Bed>
                </div>
                <Once g={g} />
                <div style={{ opacity: OP(g, A2 + 130, A3 - 24, 14, 22) }}>
                  <Readout value="11" unit="/ 14" label="SIN COMPRAR NADA"
                    at={A2 + 136} x={72} y={80} size={124} color={V.volt} />
                </div>
                <div style={{ position: "absolute", left: 118, top: 128, opacity: OP(g, A2 + 40, A3 - 30, 16, 22) }}>
                  <Bed pad={24} w={520}>
                    <Kick>CATORCE COSAS ESTA SEMANA</Kick>
                    <Head size={70}>Once de ellas, gratis.</Head>
                  </Bed>
                </div>
              </Plane>
            </AbsoluteFill>
          )}

          {/* ── ACTO 3 · Óscar, cincuenta y dos años ───────────────────────────── */}
          {o3 > 0 && (
            <AbsoluteFill style={{ transformStyle: "preserve-3d", opacity: o3 }}>
              <Plane z={-40}>
                <MediaCard src="img/cmesodimac/cmes_lam_14acciones.jpg" kind="photo"
                  w={560} h={350} x={72} y={62} ry={-10} rot={1.3} lit={0.62} litColor={key}
                  label="LA MISMA HOJA" />
                <MediaCard src="img/cmesodimac/cmes_mv_guia2.jpg" kind="photo"
                  w={520} h={560} x={31} y={52} ry={7} lit={0.96} litColor={key}
                  sheenAt={A3 + 46} label="ÓSCAR · 52 AÑOS" />
              </Plane>
              <Plane z={150}>
                <div style={{ position: "absolute", left: 1030, top: 190 }}>
                  <Bed pad={24} w={600}>
                    <Kick>HIZO CUATRO</Kick>
                    <Head size={62}>Le bajó cuarenta y un dólares el primer mes.</Head>
                  </Bed>
                </div>
                <Readout value="41" unit="USD" label="EL PRIMER MES"
                  at={A3 + 130} x={72} y={72} size={132} color={V.amber} />
              </Plane>
            </AbsoluteFill>
          )}
        </AbsoluteFill>

        {/* ═══ MUNDO 2 (+1600 px) · el tablón donde está el código ══════════════ */}
        <AbsoluteFill style={{ transform: `translate3d(${WX}px,0,0)`, transformStyle: "preserve-3d" }}>
          <Plane z={-520}>
            <PhotoPlane src="img/cmesodimac/cmes_mv_guia3.jpg" dim={0.34} tint={V.volt} scale={1.14} />
          </Plane>
          {o4 > 0 && (
            <AbsoluteFill style={{ transformStyle: "preserve-3d", opacity: o4 }}>
              <Plane z={-40}>
                <MediaCard src="broll/cmesodimac/cmes_mv_guia1.mp4" kind="video"
                  w={430} h={270} x={22} y={64} ry={9} rot={-1.2} lit={0.9} litColor={key}
                  sheenAt={A4 + 70} label="LA GUÍA DEL CANAL" />
              </Plane>
              <Plane z={140}>
                <div style={{ position: "absolute", left: 112, top: 150 }}>
                  <Bed pad={24} w={600}>
                    <Kick>EL CÓDIGO ESTÁ ACÁ</Kick>
                    <Head size={64}>Apunta con la cámara del teléfono.</Head>
                    <div style={{ height: 10 }} />
                    <Body size={29}>El enlace también está abajo, por si te sirve.</Body>
                  </Bed>
                </div>
                {/* ⛔ Estos dos íconos estaban en x=13% / x=24%, y=22%: eso cae ADENTRO de la
                    cama de texto de arriba (left 112 + w 600 = hasta 712 px) y los PNG quedaban
                    encima de las palabras "con la" y "el", tapando el titular del CTA — que es
                    justo el momento de conversión. Se van al hueco libre entre la cama de texto
                    (termina en 712 px) y el panel del QR (arranca en 1150 px). */}
                <IconPng src="img/cmesodimac/cmes_ic_telefono.png" x={44} y={31} size={104} z={26} opacity={0.9} />
                <IconPng src="img/cmesodimac/cmes_ic_cuaderno.png" x={53} y={31} size={104} z={26} opacity={0.9} />
              </Plane>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      </Layers>

      {/* ═══ EL QR ═══ fuera de <Layers>: no lo toca la cámara, no tiene escala, no tiene nada encima.
          Panel de papel claro real (guia3) + zona de silencio blanca + QR de 470 px.
          f=1104 → f=1476 (12,4 s) COMPLETAMENTE QUIETO. */}
      {g > QR_ON - 2 && (
        <AbsoluteFill style={{ opacity: qr }}>
          <div style={{
            position: "absolute", left: 1150, top: 190, width: 660, height: 660,
            borderRadius: 12, overflow: "hidden",
            boxShadow: `0 34px 90px ${rgba(V.ink0, 0.7)}, 0 0 0 1px ${rgba(V.paper, 0.5)}`,
          }}>
            <Img src={staticFile("img/cmesodimac/cmes_mv_guia3.jpg")}
              style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, background: rgba(V.paper, 0.72) }} />
            <div style={{
              position: "absolute", left: 77, top: 77, width: 506, height: 506,
              background: "#FFFFFF", borderRadius: 6,
            }} />
            <Img src={staticFile("img/cmesodimac/cmes_qr.png")}
              style={{ position: "absolute", left: 95, top: 95, width: 470, height: 470 }} />
          </div>
          <div style={{
            position: "absolute", left: 1150, top: 872,
            fontFamily: F_DISPLAY, fontWeight: 700, fontSize: 26, letterSpacing: 3.4,
            color: rgba(V.white, 0.8), textShadow: "0 4px 18px rgba(0,0,0,0.9)",
          }}>LA GUÍA DEL CANAL</div>
        </AbsoluteFill>
      )}

      {/* ── LA ÚNICA COSTURA CON OVERLAY (bien lejos del QR: f=732 → 746) ── */}
      <SeamOcclude at={A3 - 8} dur={14} color={V.paper} angle={8} />

      {/* ── SFX (3) · nada suena encima del QR ── */}
      <Sequence from={20} durationInFrames={40} layout="none">
        <Audio src={staticFile("sfx/sfx_whoosh_soft.mp3")} volume={0.34} />
      </Sequence>
      <Sequence from={A2 + 60} durationInFrames={190} layout="none">
        <Audio src={staticFile("sfx/digit_tick.mp3")} volume={0.34} />
      </Sequence>
      <Sequence from={A3 + 126} durationInFrames={60} layout="none">
        <Audio src={staticFile("sfx/winner_chime.mp3")} volume={0.34} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MovGuia: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
  void acto;
  const localF = useCurrentFrame();
  const off = Math.round(localF - gFrame);
  const g = Math.max(0, Math.min(END, gFrame));
  return (
    <Sequence from={off} layout="none">
      <Escena g={g} />
    </Sequence>
  );
};
