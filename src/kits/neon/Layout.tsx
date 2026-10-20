// nx-formato-partido — 16:9 partido: ESCENARIO negro (2/3 izquierdos, cámara que se mueve sola) + COLUMNA del
// avatar a la derecha en 9:16 a alto completo (luces cian, cámara quieta) + subtítulo de UNA palabra abajo del
// escenario. El avatar nunca tapa el objeto: viven en rectángulos distintos.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { COL_W, ESC_W, FPS, H, N, SANS, W, Cam, Tiempo, clamp, ease, rnd } from "./base";
import type { Sfx } from "./sonidos";

const src = (p: string) => (p.startsWith("http") ? p : staticFile(p));

// ───────── avatar ─────────
// Generado aparte (RunPod, UN /run por video). Lo ideal: ref 9:16 con fondo oscuro y luces cian → el reel sale vertical
// y llena la columna sin agrandarse. Sin `ventanas` el avatar está todo el video; con ventanas, fuera de ellas la
// columna se desliza a la derecha y el escenario se ensancha (sin corte) hasta que el avatar vuelve.
export type AvatarSpec = {
  src?: string; // mp4 del avatar en public/
  img?: string; // o una foto fija (sólo para pruebas)
  startFrom?: number; // s del reel donde arranca (sin ventanas)
  ventanas?: { t0: number; t1: number; r0: number }[]; // t0/t1 en el video, r0 = segundo del reel
  foco?: [number, number]; // object-position en % (x, y)
  zoom?: number; // >1 agranda dentro de la columna · <1 = reel 16:9 achicado y apoyado abajo, fundido con la sala (pasar `aspecto`)
  aspecto?: number; // ancho/alto del reel (832/464 = 16:9 de RunPod); hace falta para zoom < 1
  grado?: "neon" | "ninguno"; // "neon" = rim cian + sombras frías para que cualquier avatar pegue con el escenario
};
export const presenciaAvatar = (av: AvatarSpec | undefined, t: number) => {
  if (!av || (!av.src && !av.img)) return 1; // sin avatar: la columna queda con la sala cian (reserva)
  if (!av.ventanas) return 1;
  let k = 0;
  for (const w of av.ventanas) k = Math.max(k, Math.min(interpolate(t, [w.t0 - 0.5, w.t0], [0, 1], { ...clamp, easing: ease }), interpolate(t, [w.t1, w.t1 + 0.5], [1, 0], { ...clamp, easing: ease })));
  return k;
};
export const anchoEscenario = (av: AvatarSpec | undefined, t: number) => ESC_W + COL_W * (1 - presenciaAvatar(av, t));

// la sala detrás del avatar (y la reserva cuando todavía no hay avatar): negro azulado, estantes fuera de foco y
// dos tubos cian verticales como en el molde
export const SalaCian: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg,#05080c 0%,#0a1117 55%,#060a0e 100%)", overflow: "hidden" }}>
    {Array.from({ length: 7 }).map((_, i) => (
      <div key={i} style={{ position: "absolute", left: 30 + rnd(i, 2) * 300, top: 120 + i * 120, width: 120 + rnd(i, 3) * 160, height: 34, borderRadius: 4, background: "rgba(120,160,190,.07)", filter: "blur(10px)" }} />
    ))}
    {[0.74, 0.93].map((x, i) => {
      const fl = 0.92 + 0.08 * Math.sin(t * (7 + i * 3) + i);
      return (
        <React.Fragment key={i}>
          <div style={{ position: "absolute", left: COL_W * x - 70, top: -40, width: 140, height: H + 80, background: `radial-gradient(ellipse at center, rgba(39,227,255,${0.28 * fl}) 0%, transparent 70%)`, filter: "blur(18px)" }} />
          <div style={{ position: "absolute", left: COL_W * x - 7, top: 60 + i * 40, width: 14, height: H - 180 - i * 60, borderRadius: 7, background: N.cianClaro, opacity: 0.9 * fl, boxShadow: `0 0 18px ${N.cian}, 0 0 60px ${N.cian}`, filter: "blur(2.5px)" }} />
        </React.Fragment>
      );
    })}
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 45%, transparent 35%, rgba(0,0,0,.65) 100%)" }} />
  </AbsoluteFill>
);

export const ColumnaAvatar: React.FC<{ av?: AvatarSpec; t: number }> = ({ av, t }) => {
  const k = presenciaAvatar(av, t);
  if (k <= 0.001) return null;
  const foco = av?.foco ?? [50, 30];
  const zoom = av?.zoom ?? 1;
  const grado = (av?.grado ?? "neon") === "neon";
  const filtro = grado ? "brightness(.86) contrast(1.06) saturate(.82)" : undefined;
  // zoom < 1: el reel horizontal no se infla a alto completo (cara gigante); se apoya abajo y se funde arriba con la sala
  const chico = zoom < 1 && av?.aspecto;
  const mh = chico ? H * zoom : H, mw = chico ? Math.max(COL_W, mh * av!.aspecto!) : COL_W;
  const fundido = "linear-gradient(180deg, transparent 0%, #000 24%, #000 100%)";
  const media: React.CSSProperties = chico
    ? { position: "absolute", left: (COL_W - mw) * (foco[0] / 100), top: H - mh, width: mw, height: mh, objectFit: "cover", filter: filtro, WebkitMaskImage: fundido, maskImage: fundido }
    : { position: "absolute", inset: 0, width: COL_W, height: H, objectFit: "cover", objectPosition: `${foco[0]}% ${foco[1]}%`, transform: `scale(${zoom})`, transformOrigin: `${foco[0]}% ${foco[1]}%`, filter: filtro };
  return (
    <div style={{ position: "absolute", left: W - COL_W * k, top: 0, width: COL_W, height: H, overflow: "hidden", background: "#05080c" }}>
      <SalaCian t={t} />
      {av?.img && <Img src={src(av.img)} style={media} />}
      {av?.src && !av.ventanas && <OffthreadVideo src={src(av.src)} muted startFrom={Math.round((av.startFrom ?? 0) * FPS)} style={media} />}
      {av?.src && av.ventanas?.map((w, i) => {
        const from = Math.round(w.t0 * FPS), to = Math.round(w.t1 * FPS);
        // preroll de 10 cuadros: el avatar ya se mueve cuando entra (nunca arranca congelado)
        return (
          <Sequence key={i} from={from - 15} durationInFrames={to - from + 30} layout="none">
            <OffthreadVideo src={src(av.src!)} muted startFrom={Math.max(0, Math.round(w.r0 * FPS) - 15)} style={media} />
          </Sequence>
        );
      })}
      {grado && (
        <>
          <AbsoluteFill style={{ background: "#06222b", mixBlendMode: "soft-light", opacity: 0.55 }} />
          <AbsoluteFill style={{ background: "linear-gradient(270deg, rgba(39,227,255,.20) 0%, transparent 28%)", mixBlendMode: "screen" }} />
          <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(0,0,0,.55) 0%, transparent 22%), linear-gradient(0deg, rgba(0,0,0,.55) 0%, transparent 25%), linear-gradient(180deg, rgba(0,0,0,.35) 0%, transparent 18%)" }} />
        </>
      )}
      {/* tubo cian divisorio: la "luz" que separa el presentador del escenario */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 3, height: H, background: N.cianClaro, opacity: 0.85 * (0.94 + 0.06 * Math.sin(t * 9)), boxShadow: `0 0 10px ${N.cian}, 0 0 34px ${N.cian}, 0 0 90px rgba(39,227,255,.45)` }} />
    </div>
  );
};

// ───────── escenario ─────────
// Fondo negro con grano fino: retícula de puntos que viaja con la cámara (se nota el movimiento) + ruido de película
// en pantalla + viñeta. El blur de movimiento acompaña los vuelos de la cámara.
const Fondo: React.FC<{ c: Cam; w: number; f: number }> = ({ c, w, f }) => {
  const g = 26 * Math.sqrt(c.z);
  const ox = (-(c.x * c.z * 0.55) % g) + w / 2, oy = (-(c.y * c.z * 0.55) % g) + H / 2;
  return (
    <>
      <AbsoluteFill style={{ background: N.bg }} />
      <AbsoluteFill style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,.075) 1px, transparent 1.6px)", backgroundSize: `${g}px ${g}px`, backgroundPosition: `${ox}px ${oy}px` }} />
      <svg width={w} height={H} style={{ position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "screen" }}>
        <filter id="nxgrano"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 9} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width={w} height={H} filter="url(#nxgrano)" />
      </svg>
    </>
  );
};

// fondo = opacidad del negro con retícula (0 = transparente: deja ver lo que haya debajo, p. ej. el avatar a pantalla completa)
export const Escenario: React.FC<{ cam: (t: number) => Cam; w: number; mundo: React.ReactNode; pantalla?: React.ReactNode; fondo?: number }> = ({ cam, w, mundo, pantalla, fondo = 1 }) => {
  const f = useCurrentFrame();
  const t = f / FPS;
  const c = cam(t), c0 = cam(Math.max(0, t - 1 / FPS));
  const vx = Math.abs(c.x - c0.x) * c.z, vy = Math.abs(c.y - c0.y) * c.z, vz = Math.abs(Math.log(c.z / c0.z)) * 700;
  const bz = Math.min(4, vz * 0.22);
  const bx = Math.min(14, vx * 0.22) + bz, by = Math.min(14, vy * 0.22) + bz;
  const blur = bx + by > 0.8;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: H, overflow: "hidden" }}>
      {fondo > 0.001 && <div style={{ position: "absolute", inset: 0, opacity: fondo }}><Fondo c={c} w={w} f={f} /></div>}
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id="nxmb" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={`${bx.toFixed(2)} ${by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: blur ? "url(#nxmb)" : undefined }}>
        <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${w / 2}px,${H / 2}px) rotate(${c.rot}deg) scale(${c.z}) translate(${-c.x}px,${-c.y}px)` }}>
          {mundo}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 46%, transparent 55%, rgba(0,0,0,.55) 100%)", pointerEvents: "none", opacity: fondo }} />
      {pantalla}
    </div>
  );
};

// ───────── subtítulo de UNA palabra: blanco, chico, siempre en el mismo lugar (abajo del escenario) ─────────
export const SubtituloPalabra: React.FC<{ tiempo: Tiempo; t: number; w: number; y?: number; size?: number }> = ({ tiempo, t, w, y = H - 74, size = 36 }) => {
  const p = tiempo.palabraEn(t);
  if (!p) return null;
  const d = t - p.s;
  const s = interpolate(d, [0, 0.1], [0.9, 1], clamp);
  const o = interpolate(d, [0, 0.06], [0.4, 1], clamp);
  const txt = p.raw.replace(/^[¿¡"«(]+|[")»]+$/g, "");
  return (
    <div style={{ position: "absolute", left: w / 2, top: y, transform: `translate(-50%,-50%) scale(${s})`, opacity: o, fontFamily: SANS, fontWeight: 800, fontSize: size, color: "#fff", letterSpacing: -0.3, whiteSpace: "nowrap", textShadow: "0 2px 10px rgba(0,0,0,.8)" }}>{txt}</div>
  );
};

// ───────── el formato completo ─────────
export const FormatoPartido: React.FC<{
  cam: (t: number) => Cam;
  mundo: React.ReactNode; // objetos en coordenadas del MUNDO (los mueve la cámara)
  pantalla?: (w: number) => React.ReactNode; // capas fijas del escenario (títulos, número de capítulo); recibe el ancho actual
  avatar?: AvatarSpec;
  tiempo?: Tiempo; // para el subtítulo de una palabra
  children?: React.ReactNode; // audio (voz + SfxTrack)
}> = ({ cam, mundo, pantalla, avatar, tiempo, children }) => {
  const t = useCurrentFrame() / FPS;
  const w = anchoEscenario(avatar, t);
  return (
    <AbsoluteFill style={{ background: N.bg, overflow: "hidden" }}>
      <Escenario cam={cam} w={w} mundo={mundo} pantalla={<>{pantalla?.(w)}{tiempo && <SubtituloPalabra tiempo={tiempo} t={t} w={w} />}</>} />
      <ColumnaAvatar av={avatar} t={t} />
      {children}
    </AbsoluteFill>
  );
};

// ───────── sonidos en el PREVIEW (Studio). El final se mezcla fuera de Remotion con mezcla_neon.py (0 desfase) ─────────
// Mientras se habla, cada efecto baja a la mitad; cola de 6 cuadros para que nada corte seco.
export const SfxTrack: React.FC<{ eventos: Sfx[]; hablando?: (t: number) => boolean }> = ({ eventos, hablando }) => (
  <>
    {eventos.map(([t0, file, vol, dur], i) => {
      const n = Math.max(4, Math.round(dur * FPS)), from = Math.max(0, Math.round(t0 * FPS));
      return (
        <Sequence key={i} from={from} durationInFrames={n} layout="none">
          <Audio src={src(file)} volume={(fr) => vol * (hablando?.((from + fr) / FPS) ? 0.5 : 1) * interpolate(fr, [n - 6, n], [1, 0], clamp)} />
        </Sequence>
      );
    })}
  </>
);
