// MovPeligro.tsx — S12 · Las cuatro que no se hacen nunca. La primera mata a un tipo colgado de una escalera.
// ⭐ ÚNICA aparición de V.danger en todo el video: actos 1 y 2 (el inversor en la pared → el tipo en la línea).
// ── TABLA DE HANDOFF ────────────────────────────────────────────────────────────────────────
// acto | frames      | entra (cám / luz / materia)                    | sale (cám / luz / materia)
//  1   |    0 →  420 | z=-100 panX+140 · volt bajo · plástico blanco   | z≈-73 · danger · el cable y el tomacorriente
//  2   |  420 →  820 | mundo 2 (+2400 px) · torch de la linterna       | z≈-27 · danger apagándose · la goma del guante
//  3   |  820 → 1200 | z≈-27 · volt · plomo de las tapas abombadas     | z≈ -3 · volt · el pico de la curva
//  4   | 1200 → 1520 | z≈ -3 · volt bajo · madera del cajón cerrado    | z≈+11 · volt · el borne positivo
//  5   | 1520 → 1860 | z≈+11 · torch · cobre del cable rojo            | z=+20 panX+140 · torch · COBRE → MovCierre
// ── COSTURAS (ninguna es un fade) ───────────────────────────────────────────────────────────
//  1→2 f=420  MATCH-MOVE (rail 2400 px: la corriente sube por el cable y sale en el poste)
//  2→3 f=820  OCLUSIÓN V.ink2 (la goma del guante del operario cruza)
//  3→4 f=1200 CORTE EN EL BEAT SeamFlash volt
//  4→5 f=1520 ZOOM-THROUGH al borne positivo (at 1502, dur 18, foco 44/58)
//  5→▸ f=1860 OCLUSIÓN V.copper (el cobre del poste cruza) → MovCierre
import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame, Audio, staticFile } from "remotion";
import {
  V, F_DISPLAY, clamp01, lerp, eio, rnd, rgba, gcam, light,
  VoltAtmos, Layers, Plane, MediaCard, PhotoPlane, IconPng,
  Readout, SeamOcclude, SeamFlash, zoomThrough,
  Kick, Head, Body, Em, Bed,
} from "./VoltStage";

const END = 1860;
const A2 = 420, A3 = 820, A4 = 1200, A5 = 1520;
const WX = 2400;                      // el mundo 2 vive montado a +2400 px

const LN = (g: number, a: number, b: number) => clamp01((g - a) / Math.max(1, b - a));
const ES = (g: number, a: number, b: number) => eio(0, 1, LN(g, a, b));
const OP = (g: number, a: number, b: number, fi = 12, fo = 12) =>
  Math.min(LN(g, a, a + fi), 1 - LN(g, b - fo, b));

/** La corriente que sube por el cable — un gráfico, no una tarjeta: línea + carga que viaja. */
const Corriente: React.FC<{ g: number }> = ({ g }) => {
  const vivo = OP(g, 150, A2 + 10, 26, 16);
  if (vivo <= 0) return null;
  const t = ((g - 150) / 74) % 1;
  const x1 = 980, y1 = 640, x2 = 1720, y2 = 120;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, opacity: vivo }}>
      <div style={{
        position: "absolute", left: x1, top: y1,
        width: Math.round(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))), height: 3,
        transformOrigin: "0 50%",
        transform: `rotate(${(Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI}deg)`,
        background: `linear-gradient(90deg, ${rgba(V.danger, 0.10)}, ${rgba(V.danger, 0.72)})`,
      }} />
      {[0, 0.34, 0.68].map((o, i) => {
        const p = (t + o) % 1;
        return (
          <div key={i} style={{
            position: "absolute", left: lerp(x1, x2, p) - 9, top: lerp(y1, y2, p) - 9,
            width: 18, height: 18, borderRadius: 9, background: V.danger,
            boxShadow: `0 0 26px ${rgba(V.danger, 0.9)}`, opacity: 0.5 + 0.5 * Math.sin(p * Math.PI),
          }} />
        );
      })}
    </div>
  );
};

/** El hidrógeno que sube en el cajón cerrado — burbujas deterministas (rnd, nunca Math.random). */
const Burbujas: React.FC<{ g: number }> = ({ g }) => {
  const vivo = OP(g, A4 + 20, A5 - 6, 22, 16);
  if (vivo <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, opacity: vivo }}>
      {Array.from({ length: 18 }, (_, i) => {
        const s = rnd(i * 5.3);
        const dur = 90 + s * 70;
        const p = (((g - A4) / dur) + s) % 1;
        const d = 10 + rnd(i * 2.7) * 18;
        return (
          <div key={i} style={{
            position: "absolute",
            left: 470 + rnd(i * 9.1) * 520 + Math.sin(p * 6.4 + i) * 12,
            top: lerp(700, 250, p), width: d, height: d, borderRadius: d,
            border: `1.5px solid ${rgba(V.blade, 0.5)}`,
            background: rgba(V.blade, 0.10),
            opacity: Math.sin(p * Math.PI) * 0.9,
          }} />
        );
      })}
    </div>
  );
};

const Escena: React.FC<{ g: number }> = ({ g }) => {
  const cam = gcam(g, { z0: -100, z1: 20, panX: 140, panY: -20, ry: -2, rx: -2, dur: END });
  const rail = -WX * ES(g, A2 - 90, A2 + 20);
  const key = light(LN(g, 0, END), "volt", "torch");
  const zoom = zoomThrough(g, A5 - 18, 18, 44, 58);

  const o1 = OP(g, -20, A2 + 6, 1, 12);
  const o2 = OP(g, A2 - 150, A3 + 6, 40, 12);
  const o3 = OP(g, A3 - 6, A4 + 6, 14, 10);
  const o4 = OP(g, A4 - 6, A5 + 6, 12, 8);
  const o5 = OP(g, A5 - 14, END + 60, 16, 10);

  return (
    <AbsoluteFill style={{ backgroundColor: V.ink0 }}>
      <VoltAtmos
        tint={V.torch} tint2={V.volt}
        keyFrom={lerp(0.28, 0.36, LN(g, 0, END))}
        intensity={0.95} floor={lerp(0.72, 0.64, LN(g, 0, END))}
      />
      <Layers cam={`${cam.transform} translate3d(${rail.toFixed(1)}px,0,0)`}>
        {/* ═══ MUNDO 1 · la casa, el tomacorriente ══════════════════════════════ */}
        {o1 > 0 && (
          <AbsoluteFill style={{ transformStyle: "preserve-3d", opacity: o1 }}>
            <Plane z={-520}>
              <PhotoPlane src="broll/cmesodimac/cmes_mv_peli1.mp4" kind="video" dim={0.60} tint={V.volt} scale={1.2} />
            </Plane>
            <Plane z={-50}>
              <MediaCard src="broll/cmesodimac/cmes_mv_peli1.mp4" kind="video"
                w={980} h={560} x={44} y={53} ry={6} lit={0.94} litColor={key}
                sheenAt={44} label="EL CABLE Y LA PARED" />
            </Plane>
            <Plane z={140}>
              <Corriente g={g} />
              <div style={{ position: "absolute", left: 120, top: 148 }}>
                <Bed pad={24} w={700}>
                  <Kick color={V.danger}>LA QUE MATA</Kick>
                  <Head size={70}><Em color={V.danger}>Jamás</Em> a un tomacorriente de la pared.</Head>
                  <div style={{ height: 10 }} />
                  <Body size={29}>No hay una versión inteligente de eso.</Body>
                </Bed>
              </div>
              <IconPng src="img/cmesodimac/cmes_ic_enchufe.png" x={24} y={78} size={104} z={30} opacity={0.9} glow={V.danger} />
              <IconPng src="img/cmesodimac/cmes_ic_casa.png" x={35} y={78} size={104} z={30} opacity={0.9} />
            </Plane>
          </AbsoluteFill>
        )}

        {/* ═══ MUNDO 2 (+2400 px) · el poste, la batería, el fusible ═════════════ */}
        <AbsoluteFill style={{ transform: `translate3d(${WX}px,0,0)`, transformStyle: "preserve-3d" }}>
          <Plane z={-520}>
            <PhotoPlane src="broll/cmesodimac/cmes_mv_peli2.mp4" kind="video"
              dim={lerp(0.58, 0.66, LN(g, A2, A3))} tint={V.torch} scale={1.22} />
            {g > A3 - 10 && (
              <div style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, opacity: LN(g, A3 - 8, A3 + 6) }}>
                <PhotoPlane src="img/cmesodimac/cmes_mv_peli3.jpg" dim={0.62} tint={V.volt} scale={1.18} />
              </div>
            )}
          </Plane>

          {/* ── ACTO 2 · del otro lado hay un tipo ─────────────────────────────── */}
          {o2 > 0 && (
            <AbsoluteFill style={{ transformStyle: "preserve-3d", opacity: o2 }}>
              <Plane z={-60}>
                <MediaCard src="broll/cmesodimac/cmes_mv_peli2.mp4" kind="video"
                  w={1000} h={572} x={52} y={51} ry={-6} lit={0.96} litColor={V.torch}
                  sheenAt={A2 + 40} label="LA LÍNEA, EN EL APAGÓN" />
              </Plane>
              <Plane z={150}>
                <div style={{ position: "absolute", left: 118, top: 146 }}>
                  <Bed pad={24} w={640}>
                    <Kick color={V.danger}>DEL OTRO LADO</Kick>
                    <Head size={66}>Hay un tipo colgado de una escalera.</Head>
                    <div style={{ height: 10 }} />
                    <Body size={29}>Convencido de que la línea está muerta.</Body>
                  </Bed>
                </div>
                <Readout value="13.200" unit="V" label="AL OTRO LADO DEL TRANSFORMADOR"
                  at={A2 + 136} x={72} y={78} size={126} color={V.danger} />
                <IconPng src="img/cmesodimac/cmes_ic_rayo.png" x={86} y={22} size={124} z={40}
                  opacity={OP(g, A2 + 120, A3 - 20, 14, 20)} glow={V.danger} />
              </Plane>
            </AbsoluteFill>
          )}

          {/* ── ACTO 3 · nunca sin el regulador ────────────────────────────────── */}
          {o3 > 0 && (
            <AbsoluteFill style={{ transformStyle: "preserve-3d", opacity: o3 }}>
              <Plane z={-50}>
                <MediaCard src="img/cmesodimac/cmes_mv_peli3.jpg" kind="photo"
                  w={860} h={520} x={34} y={54} ry={7} lit={0.9} litColor={key}
                  sheenAt={A3 + 40} label="LAS TAPAS ABOMBADAS" />
              </Plane>
              <Plane z={140}>
                {/* el gráfico: la tensión que sigue subiendo porque nadie corta */}
                <div style={{ position: "absolute", left: 1120, top: 250, opacity: OP(g, A3 + 60, A4 - 20, 18, 20) }}>
                  <svg width="560" height="280" viewBox="0 0 560 280">
                    <line x1="0" y1="256" x2="560" y2="256" stroke={rgba(V.white, 0.32)} strokeWidth="2" />
                    <line x1="0" y1="96" x2="560" y2="96" stroke={rgba(V.voltSoft, 0.8)} strokeWidth="2" strokeDasharray="10 10" />
                    <path d="M0 250 C 130 244 210 206 300 128 S 470 30 560 14" fill="none"
                      stroke={V.white} strokeWidth="5" strokeLinecap="round" />
                  </svg>
                  <div style={{
                    position: "absolute", left: 4, top: 58, fontFamily: F_DISPLAY, fontWeight: 700,
                    fontSize: 24, letterSpacing: 2.6, color: rgba(V.voltSoft, 0.95),
                  }}>14,4 V · DONDE TENDRÍA QUE CORTAR</div>
                </div>
                <div style={{ position: "absolute", left: 120, top: 156 }}>
                  <Bed pad={24} w={600}>
                    <Kick>DOS</Kick>
                    <Head size={68}>Nunca sin el regulador en el medio.</Head>
                    <div style={{ height: 10 }} />
                    <Body size={29}>El panel sigue empujando, y el electrolito hierve.</Body>
                  </Bed>
                </div>
                <Readout value="15,8" unit="V" label="SIN NADIE QUE CORTE"
                  at={A3 + 220} x={74} y={24} size={122} color={V.volt} />
              </Plane>
            </AbsoluteFill>
          )}

          {/* ── ACTO 4 · ni adentro, ni en un cajón cerrado ────────────────────── */}
          {o4 > 0 && (
            <AbsoluteFill style={{ transformStyle: "preserve-3d", opacity: o4, transform: zoom.out }}>
              <Plane z={-60}>
                <MediaCard src="img/cmesodimac/cmes_mv_peli3.jpg" kind="photo"
                  w={560} h={340} x={34} y={56} ry={5} rx={2} lit={0.72} litColor={key}
                  label="ADENTRO DEL CAJÓN" />
                <MediaCard src="img/cmesodimac/cmes_lam_7conexiones.jpg" kind="photo"
                  w={520} h={660} x={73} y={50} ry={-9} rot={1.2} lit={0.86} litColor={key}
                  sheenAt={A4 + 60} label="LAS QUE NO SE HACEN NUNCA" />
              </Plane>
              <Plane z={150}>
                <Burbujas g={g} />
                <div style={{ position: "absolute", left: 118, top: 152 }}>
                  <Bed pad={24} w={560}>
                    <Kick>TRES</Kick>
                    <Head size={64}>Ni adentro, ni en un cajón cerrado.</Head>
                    <div style={{ height: 10 }} />
                    <Body size={29}>Cuando carga larga hidrógeno, y el hidrógeno prende con una chispa.</Body>
                  </Bed>
                </div>
                <IconPng src="img/cmesodimac/cmes_ic_humo.png" x={26} y={80} size={104} z={30} opacity={0.9} />
                <IconPng src="img/cmesodimac/cmes_ic_candado.png" x={37} y={80} size={98} z={30} opacity={0.85} />
              </Plane>
            </AbsoluteFill>
          )}

          {/* ── ACTO 5 · el fusible, a treinta centímetros ─────────────────────── */}
          {o5 > 0 && (
            <AbsoluteFill style={{ transformStyle: "preserve-3d", opacity: o5 }}>
              <Plane z={-40}>
                <MediaCard src="broll/cmesodimac/cmes_mv_peli4.mp4" kind="video"
                  w={900} h={520} x={38} y={54} ry={6} lit={0.94} litColor={V.torch}
                  sheenAt={A5 + 46} label="EL PORTAFUSIBLE, JUNTO AL BORNE" />
                <MediaCard src="img/cmesodimac/cmes_lam_cablefusible.jpg" kind="photo"
                  w={520} h={680} x={79} y={50} ry={-11} rot={-1.6} lit={0.9} litColor={key}
                  sheenAt={A5 + 150} label="LA TABLA, EN LA GUÍA" />
              </Plane>
              <Plane z={150}>
                <div style={{ position: "absolute", left: 118, top: 150 }}>
                  <Bed pad={24} w={560}>
                    <Kick>CUATRO</Kick>
                    <Head size={66}>El fusible, a treinta centímetros del borne.</Head>
                  </Bed>
                </div>
                <div style={{ opacity: OP(g, A5 + 50, A5 + 180, 12, 24) }}>
                  <Readout value="30" unit="cm" label="DEL BORNE POSITIVO"
                    at={A5 + 56} x={30} y={80} size={116} color={V.volt} />
                </div>
                <Readout value="600" unit="A" label="SI CRUZÁS LOS CABLES CON UNA LLAVE"
                  at={A5 + 200} x={46} y={80} size={132} color={V.volt} />
              </Plane>
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      </Layers>

      {/* ── LAS COSTURAS ── */}
      <SeamOcclude at={A3 - 8} dur={14} color={V.ink2} angle={-7} />
      <SeamFlash at={A4} color={V.volt} dur={8} />
      <SeamOcclude at={END - 10} dur={20} color={V.copper} angle={11} />

      {/* ── SFX (4) ── */}
      <Sequence from={A2 - 90} durationInFrames={120} layout="none">
        <Audio src={staticFile("sfx/sfx_whoosh_soft.mp3")} volume={0.4} />
      </Sequence>
      <Sequence from={A2 + 134} durationInFrames={44} layout="none">
        <Audio src={staticFile("sfx/impacto_hit.mp3")} volume={0.5} />
      </Sequence>
      <Sequence from={A4 - 4} durationInFrames={40} layout="none">
        <Audio src={staticFile("sfx/sfx_thump.mp3")} volume={0.42} />
      </Sequence>
      <Sequence from={A5 - 18} durationInFrames={34} layout="none">
        <Audio src={staticFile("sfx/cam_zoom_punch.mp3")} volume={0.4} />
      </Sequence>
    </AbsoluteFill>
  );
};

export const MovPeligro: React.FC<{ acto: number; gFrame: number }> = ({ acto, gFrame }) => {
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
