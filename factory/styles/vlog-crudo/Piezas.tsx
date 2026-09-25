// Piezas.tsx — primitivas del montaje VLOG CRUDO de la FÁBRICA (estilo compartido, NO clonar por slug).
// Procedencia: src/tcbriquetas/Piezas.tsx (Taller de Claudio). El build la copia a src/<slug>/Piezas.tsx
// para que el árbol de imports del farm sea autocontenido; la fuente de verdad es ESTE archivo.
// cero componentes. Lo único encima es el CTA: texto + QR opcional. El QR necesita un cuadro quieto
// para poder escanearse, por eso es la ÚNICA composición que sobrevive al vlog crudo.
//
// ⛔⛔ TODO video va con `OffthreadVideo`, NUNCA con `<Video>` (busca por tiempo, repite y saltea
// cuadros de forma irregular = el "se ve lageado").
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, Loop, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";

const INK = "#0A0B08";

/** rnd determinista con hash ENTERO. ⛔ `Math.sin(seed*12.9898)` con seeds grandes (el seed es el
 *  cuadro de arranque) pierde precisión y se correlaciona (medido en pinluz: racha 11, 43/57). */
const rnd = (seed: number, salt = 0) => {
  let h = Math.imul(((seed | 0) + salt * 7919) ^ 0x9e3779b9, 0x85ebca6b);
  h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};

/** Ken-Burns por CSS (subpíxel), distinto en CADA plano y al AZAR (regla del creador, todos los
 *  nichos): sentido in/out sorteado, cantidad sorteada, origen sorteado en 30-70 % de los dos ejes y
 *  deriva en cualquier ángulo, atada a la escala para que nunca asome el borde. */
const useKenBurns = (seed: number, intensidad = 1): React.CSSProperties => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const n = Math.max(2, durationInFrames);
  const t = interpolate(frame, [0, n], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const entra = rnd(seed, 1) > 0.5;
  const amp = (0.04 + rnd(seed, 2) * 0.08) * intensidad;
  const ang = rnd(seed, 3) * Math.PI * 2;
  const ox = 30 + rnd(seed, 4) * 40;
  const oy = 30 + rnd(seed, 5) * 40;
  const BASE = 1.045;
  const k = entra ? t : 1 - t;
  const z = BASE + amp * k;
  const margen = Math.min(ox, 100 - ox, oy, 100 - oy) * (BASE - 1);
  const dMax = Math.min(1.4, Math.max(0, margen));
  return {
    transform: `scale(${z.toFixed(4)}) translate(${(Math.cos(ang) * dMax * k).toFixed(3)}%, ${(Math.sin(ang) * dMax * k).toFixed(3)}%)`,
    transformOrigin: `${ox.toFixed(1)}% ${oy.toFixed(1)}%`,
  };
};

/** CLIP a sangre. ⛔ `loop` NO es prop de OffthreadVideo (se ignora y el clip se CONGELA): va
 *  `<Loop durationInFrames={frames}>` con los cuadros REALES que midió el build. */
export const Clip: React.FC<{ src: string; seed?: number; frames?: number; audio?: number }> = ({ src, seed = 1, frames, audio }) => {
  const t = useKenBurns(seed, 0.45);
  const { durationInFrames: d } = useVideoConfig();
  const video = <OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", ...t }} />;
  // SONIDO NATIVO del clip (agnes 2.5-flash) bajo la voz: una sola pasada (no se repite con el Loop),
  // fundido de 4 cuadros a cada lado para que el corte no haga clic.
  const fin = Math.min(d, frames && frames > 1 ? frames : d);
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      {frames && frames > 1 ? <Loop durationInFrames={frames}>{video}</Loop> : video}
      {audio ? <Sequence durationInFrames={fin} layout="none"><Audio src={staticFile(src)} volume={(f) => audio * Math.max(0, Math.min(1, f / 4, (fin - f) / 4))} /></Sequence> : null}
    </AbsoluteFill>
  );
};

/** FOTO con Ken-Burns (red de seguridad cuando el clip de agnes no llega o se rechaza). */
export const Foto: React.FC<{ src: string; seed?: number }> = ({ src, seed = 1 }) => {
  const t = useKenBurns(seed);
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", ...t }} />
    </AbsoluteFill>
  );
};

/** PISO del avatar: la PLACA de Claudio en su taller (la misma imagen que animó InfiniteTalk).
 *  Sólo se ve si un plano no llega a su ventana: nunca negro. Push lento, nunca estático. */
export const PlacaPiso: React.FC<{ src: string }> = ({ src }) => {
  const f = useCurrentFrame();
  const s = 1.03 + Math.sin(f / 900) * 0.02;
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)})` }} />
    </AbsoluteFill>
  );
};

/** VENTANA del avatar (InfiniteTalk, lipsync real de ESA frase). Muteado: el audio sale del máster.
 *  El push es el MISMO que el de la placa (misma fórmula sobre el cuadro GLOBAL), así la entrada y la
 *  salida de la ventana no saltan de escala. */
export type FxCue = { start: number; dur: number; kind: "detras" | "orbita"; props: any };
export const AvatarVentana: React.FC<{ src: string; desde: number; fg?: string; fx?: FxCue[] }> = ({ src, desde, fg, fx }) => {
  const f = useCurrentFrame() + desde;
  const s = 1.03 + Math.sin(f / 900) * 0.02;
  const V: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" };
  // COMPOSITING (cmenino, 24-sep-2026): las capas del efecto van ADENTRO del mismo contenedor que el
  // avatar (mismo push), en sándwich: fondo → efecto "detrás" → recorte del presentador → efecto
  // "delante". Así el texto queda pegado a la escena y el presentador lo tapa como en una portada.
  const capa = (lado: "back" | "front") => (fx || []).map((c, i) => (
    <Sequence key={lado + i} from={c.start} durationInFrames={c.dur} layout="none">
      <AbsoluteFill><FxCapa kind={c.kind} props={c.props} dur={c.dur} lado={lado} /></AbsoluteFill>
    </Sequence>
  ));
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${s.toFixed(4)})` }}>
        <OffthreadVideo src={staticFile(src)} muted style={V} />
        {fg && fx?.length ? capa("back") : null}
        {fg && fx?.length ? <OffthreadVideo src={staticFile(fg)} muted transparent style={V} /> : null}
        {fg && fx?.length ? capa("front") : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ─── COMPOSITING DE LA VENTANA ─────────────────────────────────────────────────────────────────
const { fontFamily: ANTON } = loadAnton();
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** TÍTULO DETRÁS del presentador (técnica de portada de revista). Letras que suben desde una línea
 *  de corte, deriva lenta propia (profundidad distinta a la del push) y salida con desenfoque. */
const FxDetras: React.FC<{ texto?: string; sub?: string; lineas?: { t: string; at?: number }[]; y?: number; dur: number }> = ({ texto, sub, lineas, y = 0.33, dur }) => {
  const f = useCurrentFrame();
  const L = lineas?.length ? lineas : [{ t: texto || "", at: 0 }];
  const maxChars = Math.max(...L.map((l) => l.t.length));
  const size = Math.min(L.length > 1 ? 250 : 470, Math.floor(1780 / Math.max(1, maxChars * 0.5)));
  const sale = interpolate(f, [dur - 9, dur], [0, 1], clamp);
  const drift = interpolate(f, [0, dur], [1.0, 1.04], clamp);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-start", paddingTop: Math.max(0, Math.round(y * 1080 - (L.length * size * 0.92) / 2)) }}>
      <div style={{ transform: `scale(${drift.toFixed(4)}) translateY(${(-sale * 30).toFixed(1)}px)`, opacity: 1 - sale, filter: `blur(${(sale * 8).toFixed(2)}px)`, textAlign: "center" }}>
        {L.map((l, li) => {
          const f0 = Math.round((l.at || 0) * 30);
          return (
            <div key={li} style={{ overflow: "hidden", lineHeight: 0.88, paddingTop: size * 0.04 }}>
              {[...l.t.toUpperCase()].map((ch, i) => {
                const k = ease(interpolate(f, [f0 + i * 1.3, f0 + i * 1.3 + 11], [0, 1], clamp));
                return (
                  <span key={i} style={{
                    display: "inline-block", fontFamily: ANTON, fontSize: size, letterSpacing: size * -0.01, whiteSpace: "pre",
                    color: "#F3EEE4", backgroundImage: "linear-gradient(180deg,#FFFFFF 0%,#EDE6DA 62%,#CFC6B8 100%)",
                    WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 22px 34px rgba(0,0,0,0.42))",
                    transform: `translateY(${((1 - k) * 105).toFixed(1)}%)`,
                  }}>{ch}</span>
                );
              })}
            </div>
          );
        })}
        {sub ? (() => {
          const k = ease(interpolate(f, [10, 24], [0, 1], clamp));
          return <div style={{ display: "inline-flex", alignItems: "center", gap: 18, marginTop: 14, opacity: k, transform: `translateY(${((1 - k) * 24).toFixed(1)}px)` }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: ROJO, boxShadow: `0 0 18px ${ROJO}` }} />
            <div style={{ fontFamily: ANTON, fontSize: 58, letterSpacing: 4, color: "#fff", textShadow: SOMBRA }}>{sub.toUpperCase()}</div>
          </div>;
        })() : null}
      </div>
    </AbsoluteFill>
  );
};

/** DATOS QUE ORBITAN al presentador: un anillo inclinado alrededor de la cabeza; lo que pasa por
 *  detrás se dibuja en la capa "back" (lo tapa el recorte) y lo que pasa por delante en "front". */
const FxOrbita: React.FC<{ items: string[]; cx?: number; cy?: number; rx?: number; ry?: number; tilt?: number; periodoS?: number; dur: number; lado: "back" | "front" }> = ({ items, cx = 0.515, cy = 0.27, rx = 0.2, ry = 0.055, tilt = -7, periodoS = 7, dur, lado }) => {
  const f = useCurrentFrame();
  const W = 1920, H = 1080;
  const X = cx * W, Y = cy * H, RX = rx * W, RY = ry * H;
  const entra = ease(interpolate(f, [0, 16], [0, 1], clamp));
  const sale = interpolate(f, [dur - 9, dur], [1, 0], clamp);
  const vis = entra * sale;
  const giro = (f / 30) * ((2 * Math.PI) / periodoS);
  const arco = (desde: number, hasta: number) => {
    const pts: string[] = [];
    for (let a = desde; a <= hasta + 1e-6; a += Math.PI / 48) pts.push(`${(X + RX * Math.cos(a)).toFixed(1)},${(Y + RY * Math.sin(a)).toFixed(1)}`);
    return pts.join(" ");
  };
  // en pantalla, el lado de ATRÁS del anillo es la mitad de arriba (sin<0), el de ADELANTE la de abajo
  const front = lado === "front";
  const largo = 2 * Math.PI * Math.sqrt((RX * RX + RY * RY) / 2);
  return (
    <AbsoluteFill style={{ opacity: vis, transform: `rotate(${tilt}deg)`, transformOrigin: `${X}px ${Y}px` }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <polyline points={front ? arco(0, Math.PI) : arco(Math.PI, 2 * Math.PI)} fill="none"
          stroke={front ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.38)"} strokeWidth={front ? 3 : 2}
          strokeDasharray={largo} strokeDashoffset={(1 - entra) * largo}
          style={{ filter: `drop-shadow(0 0 8px ${front ? "rgba(226,58,46,0.9)" : "rgba(226,58,46,0.5)"})` }} />
      </svg>
      {items.map((t, i) => {
        const a = giro + (i * 2 * Math.PI) / items.length + Math.PI / 2;
        const z = Math.sin(a);                 // >0 = delante del presentador
        if ((z >= 0) !== front) return null;
        const d = (z + 1) / 2;                 // 0 atrás … 1 adelante
        const k = ease(interpolate(f, [8 + i * 5, 22 + i * 5], [0, 1], clamp));
        return (
          <div key={i} style={{
            position: "absolute", left: X + RX * Math.cos(a), top: Y + RY * Math.sin(a),
            transform: `translate(-50%,-50%) rotate(${-tilt}deg) scale(${((0.7 + 0.35 * d) * k).toFixed(3)})`,
            opacity: (0.45 + 0.55 * d) * k, filter: `blur(${((1 - d) * 1.6).toFixed(2)}px)`,
            display: "flex", alignItems: "center", gap: 14, padding: "12px 26px 12px 20px", borderRadius: 999,
            background: "rgba(10,11,8,0.74)", border: "1px solid rgba(255,255,255,0.22)", boxShadow: "0 14px 34px rgba(0,0,0,0.5)", whiteSpace: "nowrap",
          }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: ROJO, boxShadow: `0 0 14px ${ROJO}` }} />
            <div style={{ fontFamily: ANTON, fontSize: 46, letterSpacing: 2, color: "#fff" }}>{t.toUpperCase()}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const FxCapa: React.FC<{ kind: string; props: any; dur: number; lado: "back" | "front" }> = ({ kind, props, dur, lado }) => {
  if (kind === "detras") return lado === "back" ? <FxDetras {...props} dur={dur} /> : null;
  if (kind === "orbita") return <FxOrbita {...props} dur={dur} lado={lado} />;
  return null;
};

// ─── EDICIÓN DEL PRIMER MINUTO (spec.hook) ─────────────────────────────────────────────────────
// Todo anclado al ms de la palabra por el build. Las piezas BASE reemplazan los planos del tramo;
// las OVER van encima. Nada de placas: el recurso es el corte, el zoom, la luz y el sonido.
const S = (s: number) => Math.round(s * 30);

/** plano con ZOOM FIJO (jump cut: dos cortes seguidos del mismo plano a 1.00 y 1.12) + deriva mínima. */
const HookFoto: React.FC<{ src: string; z?: number; ox?: number; oy?: number; clip?: boolean; frames?: number }> = ({ src, z = 1.0, ox = 50, oy = 45, clip, frames }) => {
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const zz = z * interpolate(f, [0, Math.max(2, d)], [1.0, 1.025], clamp);
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zz.toFixed(4)})`, transformOrigin: `${ox}% ${oy}%` };
  const v = clip ? <OffthreadVideo src={staticFile(src)} muted style={st} /> : <Img src={staticFile(src)} style={st} />;
  return <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>{clip && frames && frames > 1 ? <Loop durationInFrames={frames}>{v}</Loop> : v}</AbsoluteFill>;
};

/** DÍA → NOCHE en el MISMO encuadre (dos imágenes con la misma composición): cae la luz, el foco se
 *  enciende con un destello (bloom) en `bx,by`, y opcionalmente vuelve el día (`tDia`). */
const DiaNoche: React.FC<{ dia: string; noche: string; apagada?: string; tNoche: number; tLuz: number; tDia?: number; bx?: number; by?: number }> = ({ dia, noche, apagada, tNoche, tLuz, tDia, bx = 50, by = 40 }) => {
  const f = useCurrentFrame();
  const { durationInFrames: d } = useVideoConfig();
  const z = interpolate(f, [0, d], [1.02, 1.09], clamp);
  let nOp = interpolate(f, [S(tNoche), S(tNoche) + 34], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  if (tDia != null) nOp *= 1 - interpolate(f, [S(tDia), S(tDia) + 26], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const encendida = f >= S(tLuz) && (tDia == null || f < S(tDia) + 8);
  const bloom = encendida ? interpolate(f, [S(tLuz), S(tLuz) + 3, S(tLuz) + 16], [0, 1, 0.35], clamp) : 0;
  const img: React.CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" };
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${z.toFixed(4)})`, transformOrigin: `${bx}% ${by}%` }}>
        <Img src={staticFile(dia)} style={img} />
        {/* antes de que se prenda, la noche va con el foco APAGADO (su propia imagen, mismo encuadre);
            sin ella, la misma noche bajada de luz */}
        {apagada ? <Img src={staticFile(apagada)} style={{ ...img, opacity: encendida ? 0 : nOp }} /> : null}
        <Img src={staticFile(noche)} style={{ ...img, opacity: apagada ? (encendida ? nOp : 0) : nOp, filter: encendida || apagada ? "none" : "brightness(0.42) saturate(0.8)" }} />
        <AbsoluteFill style={{ background: `radial-gradient(circle at ${bx}% ${by}%, rgba(255,246,225,${(0.85 * bloom).toFixed(3)}) 0%, rgba(255,236,200,${(0.35 * bloom).toFixed(3)}) 14%, rgba(0,0,0,0) 42%)`, mixBlendMode: "screen" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** RELOJ que corre de `desde` a `hasta` (hh:mm, cruzando medianoche) y remata con `remate`. */
const Reloj: React.FC<{ desde: string; hasta: string; tFin: number; remate?: string; tRemate?: number; dur: number }> = ({ desde, hasta, tFin, remate, tRemate, dur }) => {
  const f = useCurrentFrame();
  const aMin = (s: string) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };
  let a = aMin(desde), b = aMin(hasta); if (b <= a) b += 24 * 60;
  const k = interpolate(f, [4, S(tFin)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const m = Math.round(a + (b - a) * k) % (24 * 60);
  const hh = String(Math.floor(m / 60)).padStart(2, "0"), mm = String(m % 60).padStart(2, "0");
  const entra = ease(interpolate(f, [0, 10], [0, 1], clamp));
  const sale = interpolate(f, [dur - 8, dur], [1, 0], clamp);
  const r = tRemate != null ? ease(interpolate(f, [S(tRemate), S(tRemate) + 9], [0, 1], clamp)) : 0;
  const pulso = k < 1 ? 1 : 1 + 0.04 * Math.sin((f - S(tFin)) / 2.2) * Math.exp(-(f - S(tFin)) / 12);
  return (
    <AbsoluteFill style={{ opacity: entra * sale }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 58%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 55%)" }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", paddingTop: 120 }}>
        <div style={{ display: "flex", alignItems: "baseline", transform: `translateY(${((1 - entra) * 40).toFixed(1)}px) scale(${pulso.toFixed(4)})` }}>
          {[...`${hh}:${mm}`].map((c, i) => (
            <span key={i} style={{ fontFamily: ANTON, fontSize: 230, width: c === ":" ? 70 : 128, textAlign: "center", color: "#FFF", textShadow: SOMBRA, opacity: c === ":" && f % 30 > 15 && k < 1 ? 0.35 : 1 }}>{c}</span>
          ))}
        </div>
        {remate ? <div style={{ marginTop: 6, fontFamily: ANTON, fontSize: 96, letterSpacing: 6, color: "#fff", background: ROJO, padding: "4px 30px", opacity: r, transform: `scale(${(1.35 - 0.35 * r).toFixed(3)}) rotate(-3deg)`, boxShadow: SOMBRA }}>{remate.toUpperCase()}</div> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** RELÁMPAGO: doble destello blanco (2 + 2 cuadros) con la caída de un rayo real. */
const Flash: React.FC = () => {
  const f = useCurrentFrame();
  const op = [0.92, 0.6, 0.05, 0.0, 0.75, 0.45, 0.18, 0.06][f] ?? 0;
  return <AbsoluteFill style={{ backgroundColor: "#F4F7FF", opacity: op }} />;
};

/** CAÍDA A NEGRO (el silencio antes del remate): entra en 3 cuadros y se corta seco. */
const Negro: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ backgroundColor: "#000", opacity: interpolate(f, [0, 3], [0, 1], clamp) }} />;
};

/** CASCADA de piezas con su precio (recortes PNG flotando) y el TOTAL al final. */
const Cascada: React.FC<{ items: { img: string; label: string; precio: string; at: number }[]; total?: string; tTotal?: number; dur: number }> = ({ items, total, tTotal, dur }) => {
  const f = useCurrentFrame();
  const sale = interpolate(f, [dur - 8, dur], [1, 0], clamp);
  const n = items.length, ancho = 1640 / n;
  const t = tTotal != null ? ease(interpolate(f, [S(tTotal), S(tTotal) + 10], [0, 1], clamp)) : 0;
  return (
    <AbsoluteFill style={{ opacity: sale }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,11,8,0) 30%, rgba(10,11,8,0.78) 70%, rgba(10,11,8,0.9) 100%)" }} />
      {items.map((it, i) => {
        const k = ease(interpolate(f, [S(it.at), S(it.at) + 12], [0, 1], clamp));
        const flota = Math.sin((f + i * 17) / 22) * 6;
        return (
          <div key={i} style={{ position: "absolute", left: 140 + i * ancho, width: ancho - 24, bottom: 150, textAlign: "center",
            opacity: k, transform: `translateY(${((1 - k) * 160 + flota).toFixed(1)}px) rotate(${((1 - k) * (i % 2 ? 8 : -8)).toFixed(2)}deg)` }}>
            <Img src={staticFile(it.img)} style={{ width: "100%", height: 250, objectFit: "contain", filter: "drop-shadow(0 26px 28px rgba(0,0,0,0.65))" }} />
            <div style={{ fontFamily: ANTON, fontSize: 40, color: "#fff", letterSpacing: 2, textShadow: SOMBRA, marginTop: 6 }}>{it.label.toUpperCase()}</div>
            <div style={{ display: "inline-block", marginTop: 6, fontFamily: ANTON, fontSize: 52, color: "#0A0B08", background: "#F2B233", padding: "0 18px", borderRadius: 6 }}>{it.precio}</div>
          </div>
        );
      })}
      {total ? <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", opacity: t, transform: `scale(${(1.3 - 0.3 * t).toFixed(3)})` }}>
        <span style={{ fontFamily: ANTON, fontSize: 150, color: "#fff", textShadow: SOMBRA, letterSpacing: 2 }}>{total.toUpperCase()}</span>
      </div> : null}
    </AbsoluteFill>
  );
};

/** MAPA de piezas del hook (el build emite `<Hook kind=... />`). Un kind desconocido no dibuja nada y
 *  el build ya lo frenó antes (compuerta hookKinds). */
export const HOOK_KINDS = ["foto", "clip", "dianoche", "reloj", "flash", "negro", "cascada"];
export const Hook: React.FC<{ kind: string; props: any; dur: number }> = ({ kind, props, dur }) => {
  if (kind === "foto") return <HookFoto {...props} />;
  if (kind === "clip") return <HookFoto {...props} clip />;
  if (kind === "dianoche") return <DiaNoche {...props} />;
  if (kind === "reloj") return <Reloj {...props} dur={dur} />;
  if (kind === "flash") return <Flash />;
  if (kind === "negro") return <Negro />;
  if (kind === "cascada") return <Cascada {...props} dur={dur} />;
  return null;
};

/** CTA DE CANAL — suscripción + lo que viene. OVERLAY en la esquina inferior, sin tarjeta a pantalla
 *  completa. ⛔ Va en la capa `over`, NUNCA como cue base (en dale1 dejó 13 s de negro). */
export const CtaFinal: React.FC<{ head: string; sub?: string; qr?: string }> = ({ head, sub, qr }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const inP = interpolate(frame, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = interpolate(frame, [Math.max(16, durationInFrames - 10), durationInFrames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const a = Math.min(inP, out);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 64, bottom: 150, maxWidth: 1600, opacity: a, transform: `translateY(${((1 - inP) * 26).toFixed(1)}px)`, display: "flex", alignItems: "flex-end", gap: 20 }}>
        <div style={{ padding: "18px 30px 20px", background: "rgba(10,11,8,.74)", borderLeft: "6px solid #F2B233" }}>
          <div style={{ fontFamily: "Oswald, Impact, system-ui, sans-serif", fontSize: 72, lineHeight: 1.04, fontWeight: 800, textTransform: "uppercase", color: "#FFFFFF", textShadow: "0 4px 24px rgba(0,0,0,.95)" }}>{head}</div>
          {sub ? <div style={{ fontFamily: "Oswald, Impact, system-ui, sans-serif", fontSize: 42, lineHeight: 1.15, marginTop: 10, color: "#F2B233", textShadow: "0 4px 22px rgba(0,0,0,.95)" }}>{sub}</div> : null}
          </div>
          {qr ? (
            <div style={{ display: "flex", alignItems: "center", gap: 18, padding: 14, background: "#FFFFFF", borderLeft: "6px solid #F2B233" }}>
              <Img src={staticFile(qr)} style={{ width: 208, height: 208, display: "block", imageRendering: "pixelated" }} />
            </div>
          ) : null}
      </div>
    </AbsoluteFill>
  );
};

/** APERTURA CON LA MINIATURA (truco del creador, 20-sep-2026): el primer fotograma del video ES la
 *  miniatura, animada apenas por agnes, y al segundo un corte glitch del que sale el presentador
 *  hablando. El que hace clic aterriza en la MISMA imagen que clickeó.
 *  ⛔ Sin Ken-Burns y con `scale(1)` EXACTO en el cuadro 0: cualquier zoom (Clip usa 1,045) rompe el
 *  calce con la miniatura y el truco deja de leerse. El push arranca DESPUÉS del cuadro 0. */
export const AperturaMiniatura: React.FC<{ src?: string; foto?: string; frames?: number }> = ({ src, foto, frames }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = interpolate(frame, [0, Math.max(2, durationInFrames)], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", transform: `scale(${(1 + 0.02 * t).toFixed(4)})` };
  const video = src ? <OffthreadVideo src={staticFile(src)} muted style={st} /> : null;
  // ⛔ El cuadro 0 tiene que ser la miniatura EXACTA, y agnes la re-genera con un leve zoom (medido:
  //    PSNR 20 dB contra la original, misma composición). Por eso la miniatura de verdad va ENCIMA y
  //    se funde al clip en 6 cuadros: el calce es exacto por construcción, no por suerte del modelo.
  const velo = !foto ? 0 : !src ? 1 : interpolate(frame, [4, 10], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: INK, overflow: "hidden" }}>
      {video && frames && frames > 1 ? <Loop durationInFrames={frames}>{video}</Loop> : video}
      {foto && velo > 0 ? <Img src={staticFile(foto)} style={{ ...st, position: "absolute", inset: 0, opacity: velo }} /> : null}
    </AbsoluteFill>
  );
};

/** CORTE GLITCH neutro (sin marca): tajadas horizontales que patinan + separación RGB, sube y baja
 *  en `durationInFrames`. Va en la capa `over`, encima del cambio de la miniatura al presentador. */
export const GlitchCut: React.FC<{ durationInFrames?: number }> = ({ durationInFrames = 12 }) => {
  const frame = useCurrentFrame();
  const env = Math.sin(Math.max(0, Math.min(1, frame / durationInFrames)) * Math.PI);
  const SLICES = 9;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(255,60,60,0.13), transparent 18%, transparent 82%, rgba(80,200,255,0.13))", transform: `translateX(${(env * 10).toFixed(2)}px)`, opacity: env }} />
      {Array.from({ length: SLICES }).map((_, k) => {
        const on = rnd(k + 7, Math.floor(frame / 2)) > 0.45;
        if (!on) return null;
        const dx = (rnd(k, Math.floor(frame / 2)) - 0.5) * 90 * env;
        return (
          <div key={k} style={{
            position: "absolute", left: 0, right: 0, top: `${(k / SLICES) * 100}%`, height: `${100 / SLICES}%`,
            transform: `translateX(${dx.toFixed(2)}px)`, background: k % 2 === 0 ? "rgba(255,255,255,0.07)" : "rgba(80,200,255,0.06)",
            opacity: env,
          }} />
        );
      })}
      <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: env * 0.12 }} />
    </AbsoluteFill>
  );
};

// ── GOLPES: los gráficos del HOOK ────────────────────────────────────────────────────────────────
// Pedido del creador (20-sep-2026): "después de la apertura, edición ultra atrapante, gráficos épicos".
// ⛔ Van en el HOOK y en los golpes, NO sobre el proceso: los 8 ganadores de este molde son cámara
//    fija, manos y CERO gráficos, y el formato crudo es lo que hace que el video calce con su
//    miniatura. Es la misma regla ya validada en Claudio Mendoza: primer minuto ultra agresivo, el
//    resto vlog crudo. Y [[feedback_edicion_limpia_no_sobrecargada]]: LIMPIO gana a denso.
// Todos entran rápido, se plantan y salen; ninguno tapa el cuadro con una placa.
const ROJO = "#E23A2E";
const SANS = '"Archivo Black", "Anton", Impact, system-ui, sans-serif';

/** entra de golpe (0-5), se planta, sale (últimos 6 cuadros) */
const useGolpe = (dur: number) => {
  const f = useCurrentFrame();
  const entra = interpolate(f, [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sale = interpolate(f, [dur - 6, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { f, op: Math.min(entra, sale), k: entra };
};
const SOMBRA = "0 6px 28px rgba(0,0,0,0.85), 0 2px 6px rgba(0,0,0,0.9)";

/** NÚMERO gigante que cae de golpe (temperaturas, litros, pesos, "3 vueltas"). */
export const NumeroGolpe: React.FC<{ n: string; sub?: string; dur: number }> = ({ n, sub, dur }) => {
  const { op, k } = useGolpe(dur);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: op }}>
      <div style={{ transform: `scale(${(0.82 + 0.18 * k).toFixed(3)})`, textAlign: "center" }}>
        <div style={{ fontFamily: SANS, fontSize: 250, lineHeight: 0.9, color: "#fff", textShadow: SOMBRA, letterSpacing: -6 }}>{n}</div>
        {sub ? <div style={{ fontFamily: SANS, fontSize: 64, color: ROJO, textShadow: SOMBRA, letterSpacing: 2, marginTop: 6 }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

/** SELLO estampado en diagonal ("NO LO TIRES", "OJO ACÁ"). Máximo 4 palabras. */
export const SelloGolpe: React.FC<{ texto: string; dur: number }> = ({ texto, dur }) => {
  const { op, k } = useGolpe(dur);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: op }}>
      <div style={{
        transform: `rotate(-7deg) scale(${(1.25 - 0.25 * k).toFixed(3)})`, background: ROJO, color: "#fff",
        fontFamily: SANS, fontSize: 96, padding: "14px 44px", letterSpacing: 1, boxShadow: SOMBRA,
      }}>{texto.toUpperCase()}</div>
    </AbsoluteFill>
  );
};

/** ETIQUETA de esquina con barra roja: nombra el material o el paso sin tapar la acción. */
export const EtiquetaGolpe: React.FC<{ texto: string; dur: number }> = ({ texto, dur }) => {
  const { op, k } = useGolpe(dur);
  return (
    <AbsoluteFill style={{ opacity: op }}>
      <div style={{ position: "absolute", left: 96, bottom: 110, display: "flex", alignItems: "stretch", transform: `translateX(${((1 - k) * -40).toFixed(1)}px)` }}>
        <div style={{ width: 12, background: ROJO }} />
        <div style={{ background: "rgba(10,11,8,0.82)", color: "#fff", fontFamily: SANS, fontSize: 54, padding: "10px 26px", letterSpacing: 1 }}>{texto.toUpperCase()}</div>
      </div>
    </AbsoluteFill>
  );
};

/** FRASE golpe palabra por palabra en el tercio inferior. Máximo 8 palabras. */
export const FraseGolpe: React.FC<{ texto: string; dur: number }> = ({ texto, dur }) => {
  const { f, op } = useGolpe(dur);
  const pal = texto.toUpperCase().split(/\s+/).filter(Boolean);
  const porPal = Math.max(2, Math.floor((dur * 0.55) / Math.max(1, pal.length)));
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 120, opacity: op }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0 18px", justifyContent: "center", maxWidth: 1500 }}>
        {pal.map((p, i) => (
          <span key={i} style={{
            fontFamily: SANS, fontSize: 72, color: i === pal.length - 1 ? ROJO : "#fff", textShadow: SOMBRA,
            opacity: f >= i * porPal ? 1 : 0, transform: `translateY(${f >= i * porPal ? 0 : 14}px)`,
          }}>{p}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** MAPA de golpes: el cue trae `kind` y el build no importa cada componente por su nombre.
 *  ⛔ Si un kind no está acá llegaría `undefined` y React tira el #130 sin decir cuál: se avisa. */
export const Golpe: React.FC<{ kind: string; props: any; dur: number }> = ({ kind, props, dur }) => {
  const M: Record<string, React.FC<any>> = { numero: NumeroGolpe, sello: SelloGolpe, etiqueta: EtiquetaGolpe, frase: FraseGolpe };
  const C = M[kind];
  if (!C) return null;
  return <C {...props} dur={dur} />;
};
