// chuy01 · MINUTO 1 (0-72,3 s). UNA toma sin cortes: el avatar, el mundo 3D del taller y los clips entran por portal / latigazo / iris.
// A avatar: odómetro que rueda a 100,000 KM, "CALLADO", portal desde el cofre abierto detrás de él
// B el taller en modo SALA DE EXHIBICIÓN: el carro "nuevecito" bajo el cenital, el marbete de agencia se escribe solo (✓ garantía / equipo / pantalla / barato)
// C la cámara entra por el parabrisas → POV en la avenida: letrero 40 °C, A/C MAX, el foquito amarillo se prende, tironea, humo → latigazo al avatar
// D avatar "ya valió": el rumor «NO AGUANTAN» → iris al taller
// E el taller se enciende: el carro entra, sube al elevador, cofre, la tapa de punterías flota, rayos X, aceite negro, turbo al rojo, arnés, soldaduras, frenos, DESPIECE
// F avatar: ✓ para bien / ✕ casi mata ese motor / sello NO FUE LA FÁBRICA → latigazo a las manos negras
// G las manos negras (clip) → la ORDEN DE INSPECCIÓN de 7 renglones; el 5 queda con candado → latigazo al avatar
// H avatar: rótulo DON CHUY, 64 AÑOS, 40 CON LAS MANOS EN MOTORES
// Todo anclado con at("frase") a la voz real (caps.json). Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import { World as WorldRaw, PT, screenCar, camSpeed } from "./taller3d";
import { makeAt } from "./at";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, COL, Flash, FONT, LowerThird, P, Portal, Tag, e, ei, extrude, s, spr } from "./lib";

const at = makeAt(CAPS as [string, number][]);
// ---- anclas (todas desde la voz) ----
const A = {
  km: at("100,000"), tapa: at("le quité la tapa"), callado: at("callado"), nadie: at("no me calla nadie"), imag: at("Imagínese"),
  carro: at("carro chino nuevecito"), cuatro: at("cuatro años"), garantia: at("garantía larga"), equipo: at("mucho equipo"), pantalla: at("pantalla grande"), barato: at("bien barato"),
  avenida: at("Ahorita va por la avenida"), grados: at("40 grados"), aire: at("el aire a todo"), repente: at("y de repente"), foquito: at("foquito amarillo"), tablero: at("en el tablero"),
  tironea: at("tironea"), quemado: at("huele a quemado"), piensa: at("usted piensa"), valio: at("ya valió"), dijeron: at("me dijeron que estos carros"), aguantan: at("no aguantan"),
  llego: at("pues ese carro llegó"), elevador: at("lo subí al elevador"), punterias: at("tapa de punterías"), aceite: at("le saqué el aceite"), turbo: at("el turbo"), cables: at("los cables"),
  soldaduras: at("las soldaduras"), frenos: at("los frenos"), pieza: at("pieza por pieza"),
  encontre: at("lo que encontré"), cree: at("usted cree"), bien: at("para bien"), mata: at("casi mata ese motor"), fabrica: at("no fue culpa de la fábrica"),
  ensenar: at("le voy a enseñar"), negras: at("las manos negras"), siete: at("las siete cosas"), peso: at("un solo peso"), usado: at("carro chino usado"),
  cinco: at("la número 5"), nadieSabe: at("casi nadie la sabe"), conocen: at("para los que no me conocen"), chuy: at("soy Chuy"), anos64: at("64 años"), cuarenta: at("y 40 con las manos"),
  monterrey: at("mi taller de Monterrey"),
};
// bordes de los bloques = las ventanas pagadas del avatar (avwin.json, ventanas fijas del minuto 1)
const WIN: { ms: number; me: number; off: number }[] = AVW as { ms: number; me: number; off: number }[];
const B1 = 8.95, B2 = 18.3, B3 = 27.5, B4 = 32.1, B5 = 43.42, B6 = 52.3, B7 = 63.95, END = 72.3;
export const MIN1_FRAMES = s(END);
const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = (AVAIL as { clips: string[] }).clips;
const CLIPDUR = ((AVAIL as { dur?: Record<string, number> }).dur ?? {}) as Record<string, number>;

// ---------------- avatar (10 cuadros de preroll por ventana, sin halo ni borde borroso) ----------------
const Avatar: React.FC<{ t: number; dark?: number }> = ({ t, dark = 0 }) => {
  const face = REEL ? <>{WIN.filter((w) => w.ms < END + 1).map((w, i) => (
    <Sequence key={i} from={Math.max(0, s(w.ms) - 10)} durationInFrames={s(w.me - w.ms) + 30} layout="none">
      <AbsoluteFill style={{ opacity: t >= w.ms - 0.02 && t < w.me + 0.6 ? 1 : 0 }}><OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 10)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    </Sequence>))}</> : <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.01 + 0.01 * Math.sin(t * 0.7)})` }} />;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000", filter: dark > 0 ? `brightness(${1 - dark})` : undefined }}>{face}</AbsoluteFill>;
};

// ---------------- el mundo con desenfoque de movimiento de la cámara ----------------
const World: React.FC<{ t: number }> = ({ t }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(6, v0.bx * 0.5), by: Math.min(4, v0.by * 0.5) };
  const id = "mb" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${v.bx.toFixed(2)} ${v.by.toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by > 0.6 ? `url(#${id})` : undefined }}><WorldRaw t={t} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

// toma (clip LTX si ya llegó, si no el cuadro clave) con empuje lento
const Shot: React.FC<{ k: string; t: number; a: number; z?: [number, number]; dur?: number; o?: [number, number] }> = ({ k, t, a, z = [1.03, 1.12], dur = 9, o = [50, 50] }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + dur);
  // la foto queda SIEMPRE debajo: si el clip es más corto que el tramo, nunca queda negro
  const inner = <>
    <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
    {CLIPS.includes(k) && <Sequence from={s(a)} durationInFrames={Math.max(1, s(CLIPDUR[k] ?? 5) - 2)} layout="none"><OffthreadVideo src={staticFile(P + "ltx_" + k + ".mp4")} muted style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>}
  </>;
  return <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: `${o[0]}% ${o[1]}%` }}>{inner}</AbsoluteFill>;
};

// latigazo horizontal entre dos capas (sale prev a la izquierda, entra cur por la derecha, con desenfoque)
const Whip: React.FC<{ k: number; prev: React.ReactNode; cur: React.ReactNode; dir?: number }> = ({ k, prev, cur, dir = -1 }) => {
  const mb = Math.sin(k * Math.PI) * 46;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${dir * k * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{prev}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `translateX(${-dir * (1 - k) * 1920}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{cur}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// iris: el plano se cierra en un círculo que se encoge hasta un punto y el siguiente nace desde ahí
const Iris: React.FC<{ k: number; x: number; y: number; prev: React.ReactNode; cur: React.ReactNode }> = ({ k, x, y, prev, cur }) => {
  const R = Math.hypot(Math.max(x, 1920 - x), Math.max(y, 1080 - y)) * 1.02;
  const r1 = k < 0.5 ? R * (1 - k * 2) : 0, r2 = k >= 0.5 ? R * (k - 0.5) * 2 : 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {k < 0.5 && <AbsoluteFill style={{ clipPath: `circle(${r1}px at ${x}px ${y}px)` }}>{prev}</AbsoluteFill>}
      {k >= 0.5 && <AbsoluteFill style={{ clipPath: `circle(${r2}px at ${x}px ${y}px)` }}>{cur}</AbsoluteFill>}
      <div style={{ position: "absolute", left: x - (k < 0.5 ? r1 : r2), top: y - (k < 0.5 ? r1 : r2), width: 2 * (k < 0.5 ? r1 : r2), height: 2 * (k < 0.5 ? r1 : r2), borderRadius: "50%", boxShadow: "0 0 0 6px rgba(255,178,87,.85), 0 0 50px 12px rgba(255,140,40,.35)" }} />
    </AbsoluteFill>
  );
};

// ================= PIEZAS NUEVAS DE ESTE MINUTO =================

// odómetro mecánico: tambores que ruedan hasta 100,000 (cada dígito con su cilindro y su sombra)
const Odometer: React.FC<{ t: number; a: number; out: number; x: number; y: number }> = ({ t, a, out, x, y }) => {
  const o = e(t, a - 0.35, a - 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const k = ei(t, a - 0.3, a + 0.9), val = 100000 * k, k2 = spr(t, a - 0.35, 0.9);
  const digits = 6, DH = 128;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1300 }}>
      <div style={{ transform: `translate(-50%,-50%) rotateX(${(1 - Math.min(1, k2)) * 60 + 8}deg) rotateY(-14deg) scale(${0.7 + 0.3 * Math.min(1, k2)})`, padding: "26px 30px 18px", borderRadius: 26, background: "linear-gradient(180deg,#1d1f23,#0b0c0e)", boxShadow: "0 50px 90px rgba(0,0,0,.75), inset 0 0 0 3px #3c3f45, inset 0 2px 0 rgba(255,255,255,.12)" }}>
        <div style={{ display: "flex", gap: 8 }}>
          {Array.from({ length: digits }, (_, i) => {
            const p = Math.pow(10, digits - 1 - i), d = (val / p) % 10; // posición continua del tambor
            const roll = i < digits - 1 ? d : d; void roll;
            return (
              <div key={i} style={{ width: 96, height: DH, overflow: "hidden", borderRadius: 10, background: i === 0 ? "#f3efe6" : "#121315", position: "relative", boxShadow: "inset 0 18px 18px -10px rgba(0,0,0,.85), inset 0 -18px 18px -10px rgba(0,0,0,.85)" }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: -d * DH }}>
                  {Array.from({ length: 11 }, (_, j) => <div key={j} style={{ height: DH, lineHeight: DH + "px", textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 104, color: i === 0 ? "#141414" : "#f3efe6" }}>{j % 10}</div>)}
                </div>
              </div>
            );
          })}
          <div style={{ alignSelf: "flex-end", marginLeft: 14, fontFamily: FONT, fontWeight: 900, fontSize: 50, color: COL.amber, letterSpacing: 2 }}>KM</div>
        </div>
      </div>
    </div>
  );
};

// palabra que se graba con un golpe y deja polvo (para "CALLADO")
const Slam: React.FC<{ t: number; a: number; out: number; text: string; x: number; y: number; size?: number; col?: string }> = ({ t, a, out, text, x, y, size = 150, col = COL.ink }) => {
  const o = e(t, a, a + 0.05) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const k = Math.min(1, (t - a) / 0.16), sc = 1.9 - 0.9 * k, dust = e(t, a + 0.1, a + 0.9);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${sc}) rotate(-3deg)` }}>
      {Array.from({ length: 14 }, (_, i) => { const an = (i / 14) * Math.PI * 2; return <div key={i} style={{ position: "absolute", left: "50%", top: "60%", width: 30, height: 30, borderRadius: "50%", background: "rgba(200,190,175,.45)", filter: "blur(8px)", opacity: k >= 1 ? 1 - dust : 0, transform: `translate(${Math.cos(an) * 320 * dust}px, ${Math.sin(an) * 90 * dust}px) scale(${1 + dust * 3})` }} />; })}
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 10, whiteSpace: "nowrap", textShadow: extrude(9, "#3a2f22") }}>{text}</div>
    </div>
  );
};

// marbete de agencia pegado al costado del carro: se escribe renglón por renglón con ✓ verdes
const Marbete: React.FC<{ t: number; x: number; y: number; rows: { at: number; tx: string }[]; a: number; out: number }> = ({ t, x, y, rows, a, out }) => {
  const k = spr(t, a, 0.85), o = e(t, a, a + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, perspective: 1400 }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -600}px) rotateY(${-22 + (1 - Math.min(1, k)) * 40 + 2 * Math.sin(t * 0.8)}deg) rotateX(4deg)`, width: 560, background: "linear-gradient(180deg,#fdfcf8,#efebe1)", borderRadius: 8, padding: "26px 30px 30px", boxShadow: "0 60px 110px rgba(0,0,0,.8)", fontFamily: FONT, color: "#1b1d22" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "4px solid #1b1d22", paddingBottom: 10 }}>
          <div style={{ fontWeight: 900, fontSize: 40, letterSpacing: 3 }}>AUTO NUEVO</div>
          <div style={{ fontWeight: 800, fontSize: 22, color: "#666", letterSpacing: 2 }}>HACE 4 AÑOS</div>
        </div>
        {rows.map((r, i) => {
          const ok = e(t, r.at, r.at + 0.15), tick = e(t, r.at + 0.12, r.at + 0.4), n = Math.round(r.tx.length * e(t, r.at, r.at + 0.35));
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 16, opacity: 0.25 + 0.75 * ok }}>
              <svg width={52} height={52} viewBox="0 0 52 52"><rect x={3} y={3} width={46} height={46} rx={8} fill="none" stroke="#1b1d22" strokeWidth={4} />
                <path d="M12 27 L22 37 L41 15" fill="none" stroke="#1f9d4c" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={50} strokeDashoffset={50 * (1 - tick)} /></svg>
              <div style={{ fontWeight: 900, fontSize: 42, letterSpacing: 1 }}>{r.tx.slice(0, n)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// letrero LED de farmacia con la temperatura (puntos encendidos)
const LedSign: React.FC<{ t: number; a: number; out: number; x: number; y: number; text: string }> = ({ t, a, out, x, y, text }) => {
  const k = spr(t, a, 1), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const flick = t - a < 0.4 ? (Math.sin((t - a) * 80) > 0 ? 1 : 0.3) : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1000px) rotateY(${-16 + (1 - Math.min(1, k)) * -50}deg) scale(${0.6 + 0.4 * Math.min(1.05, k)})` }}>
      <div style={{ padding: "18px 34px", background: "#0a0b0c", borderRadius: 14, border: "6px solid #2a2c30", boxShadow: "0 40px 80px rgba(0,0,0,.7)" }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 900, fontSize: 150, lineHeight: 1, color: "#ff3b1f", opacity: flick, letterSpacing: 6,
          textShadow: "0 0 18px #ff3b1f, 0 0 50px #ff2a00", WebkitMaskImage: "radial-gradient(circle, #000 55%, transparent 60%)", WebkitMaskSize: "9px 9px" } as React.CSSProperties}>{text}</div>
      </div>
    </div>
  );
};

// testigo del motor ámbar que se enciende con resplandor sobre el tablero
const CheckEngine: React.FC<{ t: number; a: number; out: number; x: number; y: number }> = ({ t, a, out, x, y }) => {
  const o = 1 - e(t, out, out + 0.25);
  if (t < a - 0.05 || o <= 0.01) return null;
  const on = t - a < 0.5 ? (Math.sin((t - a) * 50) > -0.2 ? 1 : 0.2) : 0.8 + 0.2 * Math.sin(t * 9);
  const k = spr(t, a, 1.1);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) scale(${0.5 + 0.5 * Math.min(1.1, k)})` }}>
      <div style={{ position: "absolute", left: -260, top: -260, width: 520, height: 520, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,170,20,${0.55 * on}), transparent 62%)` }} />
      <svg width={260} height={180} viewBox="0 0 26 18" style={{ position: "relative", filter: `drop-shadow(0 0 ${14 * on}px #ffae00) drop-shadow(0 0 ${36 * on}px #ff9000)` }}>
        <path d="M4 5h3V3h6v2h3l2 2h2v-1h2v8h-2v-1h-2l-2 3H7l-2-2H3v2H1V7h2V6z" fill={`rgba(255,${150 + 40 * on},0,${0.35 + 0.65 * on})`} />
      </svg>
    </div>
  );
};

// humo que sube desde abajo (CSS, volutas)
const Smoke: React.FC<{ t: number; a: number; out: number; x: number; y: number; w?: number }> = ({ t, a, out, x, y, w = 900 }) => {
  const o = e(t, a, a + 0.6) * (1 - e(t, out, out + 0.4));
  if (o <= 0.01) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: 16 }, (_, i) => {
        const ph = ((t - a) * 0.45 + i / 16) % 1, sx = x + (Math.sin(i * 7.3) * 0.5) * w + Math.sin(t * 1.3 + i) * 40;
        return <div key={i} style={{ position: "absolute", left: sx, top: y - ph * 520, width: 200 + ph * 260, height: 200 + ph * 260, transform: "translate(-50%,-50%)", borderRadius: "50%", background: "radial-gradient(circle, rgba(70,68,66,.55), transparent 65%)", opacity: o * Math.sin(ph * Math.PI), filter: "blur(18px)" }} />;
      })}
    </AbsoluteFill>
  );
};

// rumor: globo de comentario de redes que se infla y luego se tacha con un "?" rojo
const Rumor: React.FC<{ t: number; a: number; hit: number; out: number; x: number; y: number }> = ({ t, a, hit, out, x, y }) => {
  const k = spr(t, a, 0.9), o = e(t, a, a + 0.12) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const hk = e(t, hit, hit + 0.25);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) perspective(1200px) rotateY(${14 - (1 - Math.min(1, k)) * 50}deg) scale(${0.6 + 0.4 * Math.min(1.05, k)})` }}>
      <div style={{ position: "relative", padding: "24px 34px", borderRadius: 30, background: "rgba(245,245,245,.96)", boxShadow: "0 40px 80px rgba(0,0,0,.6)", fontFamily: FONT }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#9aa3ad" }} /><div style={{ width: 170, height: 16, borderRadius: 8, background: "#c9ced4" }} />
        </div>
        <div style={{ fontWeight: 900, fontSize: 58, color: "#1b1d22", whiteSpace: "nowrap" }}>«Esos carros NO AGUANTAN»</div>
        <div style={{ position: "absolute", left: 40, bottom: -26, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: "30px solid rgba(245,245,245,.96)" }} />
        {hk > 0 && <div style={{ position: "absolute", right: -60, top: -70, fontFamily: FONT, fontWeight: 900, fontSize: 190, color: COL.red, transform: `scale(${Math.min(1.1, spr(t, hit, 1.2))}) rotate(12deg)`, textShadow: extrude(7, "#4a0c08") }}>?</div>}
      </div>
    </div>
  );
};

// fichas de veredicto: ✓ verde / ✕ roja que caen sobre el avatar
const Verdict: React.FC<{ t: number; a: number; out: number; x: number; y: number; good: boolean; text: string }> = ({ t, a, out, x, y, good, text }) => {
  const k = spr(t, a, 1), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const col = good ? "#3ddc84" : COL.red;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) translateY(${(1 - Math.min(1, k)) * -260}px) rotate(${(good ? -4 : 5) + (1 - Math.min(1, k)) * 20}deg)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 34px 18px 20px", borderRadius: 22, background: "rgba(10,12,16,.92)", boxShadow: `0 30px 60px rgba(0,0,0,.6), inset 0 0 0 3px ${col}` }}>
        <div style={{ width: 76, height: 76, borderRadius: "50%", background: col, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 56, color: "#0b0c0e" }}>{good ? "✓" : "✕"}</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 52, color: COL.ink, whiteSpace: "nowrap", textShadow: extrude(4, "#000") }}>{text}</div>
      </div>
    </div>
  );
};

// sello de taller (tinta que se corre)
const Stamp: React.FC<{ t: number; a: number; text: string; x: number; y: number; out?: number; rot?: number; size?: number; col?: string }> = ({ t, a, text, x, y, out = 1e9, rot = -7, size = 92, col = COL.red }) => {
  const k = spr(t, a, 1.3), o = e(t, a, a + 0.06) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.3 - 1.3 * Math.min(1, k)})` }}>
      <div style={{ border: `9px solid ${col}`, borderRadius: 12, padding: "4px 28px", fontFamily: FONT, fontWeight: 900, fontSize: size, color: col, letterSpacing: 4, background: "rgba(20,0,0,.22)", boxShadow: `0 0 26px ${col}66`, whiteSpace: "nowrap" }}>{text}</div>
    </div>
  );
};

// ORDEN DE INSPECCIÓN en tabla de pinza: 7 renglones tapados; el 5 se ilumina con candado
const Clipboard: React.FC<{ t: number; a: number; out: number; five: number; secret: number }> = ({ t, a, out, five, secret }) => {
  const k = spr(t, a, 0.8), o = e(t, a, a + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const f5 = e(t, five, five + 0.3);
  return (
    <div style={{ position: "absolute", left: 1290, top: 560, opacity: o, perspective: 1500 }}>
      <div style={{ transform: `translate(-50%,-50%) translateZ(${(1 - Math.min(1, k)) * -800}px) rotateY(${-18 + (1 - Math.min(1, k)) * 60}deg) rotateX(5deg) rotateZ(2deg)`, width: 640, padding: "70px 34px 34px", borderRadius: 18, background: "linear-gradient(180deg,#8a6a45,#6c5134)", boxShadow: "0 70px 120px rgba(0,0,0,.8)" }}>
        <div style={{ position: "absolute", left: "50%", top: -14, transform: "translateX(-50%)", width: 220, height: 64, borderRadius: 12, background: "linear-gradient(180deg,#d9dcdf,#8d9196)", boxShadow: "0 8px 16px rgba(0,0,0,.5)" }} />
        <div style={{ background: "#f6f2e8", borderRadius: 6, padding: "22px 26px 28px", fontFamily: FONT, color: "#1b1d22" }}>
          <div style={{ fontWeight: 900, fontSize: 34, letterSpacing: 3, borderBottom: "3px solid #1b1d22", paddingBottom: 8 }}>ANTES DE DAR UN PESO</div>
          {Array.from({ length: 7 }, (_, i) => {
            const ai = a + 0.35 + i * 0.12, ri = e(t, ai, ai + 0.15), is5 = i === 4;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14, opacity: ri, transform: `translateX(${(1 - ri) * 40}px)`, padding: "6px 10px", borderRadius: 8,
                background: is5 ? `rgba(255,190,40,${0.55 * f5})` : undefined, boxShadow: is5 && f5 > 0.05 ? `0 0 ${30 * f5}px rgba(255,170,20,${0.8 * f5})` : undefined, scale: is5 ? `${1 + 0.06 * f5}` : undefined }}>
                <div style={{ width: 46, fontWeight: 900, fontSize: 40, color: is5 && f5 > 0.3 ? "#b3261e" : "#1b1d22" }}>{i + 1}</div>
                <div style={{ flex: 1, height: 18, borderRadius: 9, background: is5 && f5 > 0.3 ? "#7a5a1a" : "#c9c3b5" }} />
                {is5 && f5 > 0.2 && <div style={{ fontSize: 40, transform: `scale(${Math.min(1.1, spr(t, five + 0.1, 1.2))})` }}>🔒</div>}
              </div>
            );
          })}
        </div>
      </div>
      {t >= secret && <div style={{ position: "absolute", right: 960, top: 70, fontFamily: FONT, fontWeight: 900, fontSize: 62, color: COL.amber, whiteSpace: "nowrap", opacity: e(t, secret, secret + 0.2), transform: `translateX(${(1 - e(t, secret, secret + 0.3)) * -40}px)`, textShadow: extrude(5, "#3a2400") }}>CASI NADIE LA SABE ➜</div>}
    </div>
  );
};

// contador de años con llave inglesa que gira (64 → 40 con las manos en motores)
const Years: React.FC<{ t: number; a: number; b: number; out: number; x: number; y: number }> = ({ t, a, b, out, x, y }) => {
  const o = e(t, a, a + 0.15) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const n1 = Math.round(64 * ei(t, a, a + 0.7)), n2 = Math.round(40 * ei(t, b, b + 0.8)), k2 = e(t, b, b + 0.2);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, fontFamily: FONT, transform: `scale(${Math.min(1.05, spr(t, a, 0.9))})`, transformOrigin: "0 50%" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
        <div style={{ fontWeight: 900, fontSize: 150, color: COL.ink, textShadow: extrude(8, "#3a2f22"), lineHeight: 1 }}>{n1}</div>
        <div style={{ fontWeight: 800, fontSize: 44, color: COL.dim, letterSpacing: 4 }}>AÑOS</div>
      </div>
      {k2 > 0 && <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: k2, marginTop: 6 }}>
        <svg width={86} height={86} viewBox="0 0 24 24" style={{ transform: `rotate(${(t - b) * 160}deg)` }}><path d="M21 7.5a5 5 0 0 1-6.8 4.7L6.5 20a2 2 0 0 1-2.8-2.8l7.8-7.7A5 5 0 0 1 17.5 3l-3 3 .6 2.9 2.9.6z" fill={COL.amber} /></svg>
        <div style={{ fontWeight: 900, fontSize: 96, color: COL.amber, textShadow: extrude(6, "#3a2400"), lineHeight: 1 }}>{n2}</div>
        <div style={{ fontWeight: 800, fontSize: 36, color: COL.ink, letterSpacing: 3, lineHeight: 1.1 }}>CON LAS MANOS<br />EN MOTORES</div>
      </div>}
    </div>
  );
};

// ================= EL MINUTO =================
export const Min1: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  const L: React.ReactNode[] = [];

  // ===== A · 0-8,95 · avatar: odómetro, CALLADO; portal desde el cofre abierto detrás de él =====
  if (t < B1 + 0.05) {
    L.push(<Avatar key="avA" t={t} />);
    L.push(<Odometer key="odo" t={t} a={A.km} out={A.tapa - 0.1} x={400} y={760} />);
    L.push(<Slam key="cal" t={t} a={A.callado} out={A.imag - 0.15} text="CALLADO" x={400} y={170} size={118} />);
    L.push(<Tag key="nad" t={t} at={A.nadie} x={960} y={300} dx={-330} dy={150} text="A MÍ NO ME CALLA NADIE" col={COL.amber} out={A.imag} size={40} />);
    const r = ei(t, A.imag + 0.6, B1);
    if (r > 0) L.push(<Portal key="pA" x={1330} y={430} r={r}><World t={Math.max(8.4, t)} /></Portal>);
  }
  // ===== B · 8,95-18,3 · sala de exhibición: el carro nuevecito, el marbete; la cámara vuela al parabrisas → portal a la avenida =====
  if (t >= B1 && t < B2 + 0.05) {
    L.push(<World key="wB" t={t} />);
    const c = screenCar(t, [-0.2, 0.75, 0.86]);
    L.push(<Tag key="cc" t={t} at={A.carro} x={c.x} y={c.y} dx={-180} dy={-230} text="NUEVECITO" sub="CARRO CHINO" col={COL.ice} out={A.cuatro + 1.3} size={56} />);
    L.push(<BigNum key="4a" t={t} at={A.cuatro} text="HACE 4 AÑOS" size={92} x={960} y={150} out={A.garantia - 0.2} />);
    L.push(<Marbete key="mb" t={t} x={1420} y={560} a={A.garantia - 0.25} out={A.avenida - 0.1}
      rows={[{ at: A.garantia, tx: "GARANTÍA LARGA" }, { at: A.equipo, tx: "MUCHO EQUIPO" }, { at: A.pantalla, tx: "PANTALLA GRANDE" }, { at: A.barato, tx: "BIEN BARATO" }]} />);
    const w = screenCar(t, PT.windshield), r = ei(t, B2 - 0.45, B2);
    if (r > 0) L.push(<Portal key="pB" x={w.x} y={w.y} r={r}><Shot k="m1_pov" t={t} a={B2 - 0.45} o={[45, 40]} /></Portal>);
  }
  // ===== C · 18,3-27,5 · POV en la avenida: 40 °C, A/C MAX, el foquito, tironea, humo → latigazo al avatar =====
  if (t >= B2 && t < B3 + 0.05) {
    const tir = t > A.tironea ? Math.exp(-(t - A.tironea) * 1.2) * (1 - e(t, B3 - 0.6, B3)) : 0;
    const jx = Math.sin(t * 47) * 16 * tir * (Math.sin(t * 5) > 0 ? 1 : 0.3), jy = Math.sin(t * 61 + 1) * 10 * tir;
    const pov = (
      <AbsoluteFill key="pov" style={{ transform: `translate(${jx}px, ${jy}px)` }}>
        <Shot k="m1_pov" t={t} a={B2 - 0.45} o={[45, 40]} />
        <AbsoluteFill style={{ background: `rgba(255,140,40,${0.08 + 0.1 * e(t, A.grados, A.grados + 1)})`, mixBlendMode: "overlay" }} />
        <LedSign t={t} a={A.grados} out={A.repente} x={1500} y={250} text="40°C" />
        <Tag t={t} at={A.aire} x={1330} y={680} dx={150} dy={-120} text="A/C AL MÁXIMO" col={COL.ice} out={A.repente + 0.2} size={44} />
        <CheckEngine t={t} a={A.foquito} out={B3 - 0.3} x={735} y={712} />
        <Tag t={t} at={A.tablero} x={735} y={712} dx={-230} dy={-260} text="FOQUITO AMARILLO" col="#ffb000" out={A.tironea + 0.3} size={46} />
        <Stamp t={t} a={A.tironea} text="TIRONEA" x={1240} y={520} out={A.quemado} rot={6} size={84} col={COL.amber} />
        <Smoke t={t} a={A.quemado - 0.2} out={B3} x={960} y={1050} />
        <Tag t={t} at={A.quemado} x={980} y={560} dx={-260} dy={-200} text="HUELE A QUEMADO" col={COL.red} out={B3 - 0.4} size={50} />
      </AbsoluteFill>
    );
    const wk = ei(t, B3 - 0.4, B3 + 0.05);
    L.push(wk > 0 ? <Whip key="wC" k={wk} prev={pov} cur={<Avatar t={t} />} /> : pov);
    L.push(<Flash key="flR" t={t} at={A.repente} col="#ffd27a" peak={0.35} w={0.3} />);
  }
  // ===== D · 27,5-32,1 · avatar "ya valió"; el rumor «NO AGUANTAN» con "?" → iris al taller =====
  if (t >= B3 && t < B4 + 0.05) {
    const ik = ei(t, B4 - 0.5, B4 + 0.05);
    const av = (
      <AbsoluteFill>
        <Avatar t={t} />
        <Stamp t={t} a={A.valio} text="YA VALIÓ" x={1430} y={250} out={A.dijeron + 0.2} rot={8} size={100} />
        <Rumor t={t} a={A.dijeron} hit={A.llego - 0.45} out={B4 - 0.5} x={1360} y={330} />
      </AbsoluteFill>
    );
    L.push(ik > 0 ? <Iris key="irD" k={ik} x={1330} y={430} prev={av} cur={<World t={Math.max(B4, t)} />} /> : <React.Fragment key="avD">{av}</React.Fragment>);
  }
  // ===== E · 32,1-43,4 · el taller se enciende: entra, elevador, cofre, tapa, aceite, turbo, cables, soldaduras, frenos, despiece → latigazo =====
  if (t >= B4 + 0.05 && t < B5 + 0.05) {
    const sp = (q: [number, number, number]) => screenCar(t, q);
    const wE = (
      <AbsoluteFill>
        <World t={Math.min(t, B5 - 0.4)} />
        <Tag t={t} at={A.llego + 0.4} x={sp([-1.9, 0.9, 0]).x} y={sp([-1.9, 0.9, 0]).y} dx={-160} dy={-200} text="AYER · MI TALLER" col={COL.amber} out={A.elevador} size={48} />
        <Tag t={t} at={A.elevador} x={sp([0.1, 0.3, 0.86]).x} y={sp([0.1, 0.3, 0.86]).y} dx={200} dy={-120} text="AL ELEVADOR" out={A.punterias - 0.1} size={44} />
        <Tag t={t} at={A.punterias + 0.3} x={sp([-1.42, 1.4, 0]).x} y={sp([-1.42, 1.4, 0]).y} dx={260} dy={-160} text="TAPA DE PUNTERÍAS" col={COL.amber} out={A.aceite - 0.05} size={50} />
        <Tag t={t} at={A.aceite + 0.15} x={sp(PT.pan).x} y={sp(PT.pan).y} dx={-260} dy={130} text="EL ACEITE" col="#c9a35a" out={A.turbo - 0.05} size={50} />
        <Tag t={t} at={A.turbo} x={sp(PT.turbo).x} y={sp(PT.turbo).y} dx={240} dy={-170} text="EL TURBO" col="#ff7a3a" out={A.cables + 0.25} size={50} />
        <Tag t={t} at={A.cables} x={sp(PT.harness).x} y={sp(PT.harness).y} dx={-260} dy={-150} text="CABLES" col={COL.ice} out={A.soldaduras + 0.4} size={48} />
        <Tag t={t} at={A.soldaduras + 0.25} x={sp(PT.welds).x} y={sp(PT.welds).y} dx={200} dy={150} text="SOLDADURAS" col="#ffd27a" out={A.frenos + 0.2} size={48} />
        <Tag t={t} at={A.frenos + 0.1} x={sp(PT.brake).x} y={sp(PT.brake).y} dx={-240} dy={-150} text="FRENOS" col={COL.red} out={A.pieza} size={50} />
        <BigNum t={t} at={A.pieza} text="PIEZA POR PIEZA" size={104} y={150} out={B5 - 0.45} />
      </AbsoluteFill>
    );
    const wk = ei(t, B5 - 0.4, B5 + 0.05);
    L.push(wk > 0 ? <Whip key="wE" k={wk} prev={wE} cur={<Avatar t={t} />} dir={1} /> : <React.Fragment key="wE0">{wE}</React.Fragment>);
    L.push(<Flash key="flL" t={t} at={B4 + 0.05} col="#eaf4ff" peak={0.35} w={0.25} />);
  }
  // ===== F · 43,4-52,3 · avatar: ✓ para bien / ✕ casi mata ese motor / NO FUE LA FÁBRICA → latigazo a las manos negras =====
  if (t >= B5 + 0.05 && t < B6 + 0.05) {
    const av = (
      <AbsoluteFill>
        <Avatar t={t} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 110, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 62, letterSpacing: 4, color: COL.ink, opacity: e(t, A.encontre, A.encontre + 0.2) * (1 - e(t, A.bien - 0.2, A.bien)), textShadow: extrude(6, "#000") }}>NO ES LO QUE <span style={{ color: COL.amber }}>USTED CREE</span></div>
        <Verdict t={t} a={A.bien} out={A.fabrica - 0.1} x={1450} y={300} good text="PARA BIEN" />
        <Verdict t={t} a={A.mata} out={A.fabrica - 0.1} x={1450} y={450} good={false} text="CASI MATA EL MOTOR" />
        <Stamp t={t} a={A.fabrica + 0.3} text="NO FUE LA FÁBRICA" x={1400} y={360} out={B6 - 0.4} rot={-6} size={80} col={COL.amber} />
      </AbsoluteFill>
    );
    const wk = ei(t, B6 - 0.4, B6 + 0.05);
    L.push(wk > 0 ? <Whip key="wF" k={wk} prev={av} cur={<Shot k="m1_tapa" t={t} a={B6 - 0.4} />} /> : <React.Fragment key="avF">{av}</React.Fragment>);
  }
  // ===== G · 52,3-63,95 · las manos negras → la orden de inspección de 7; el 5 con candado → latigazo al avatar =====
  if (t >= B6 + 0.05 && t < B7 + 0.05) {
    const blurK = e(t, A.siete - 0.3, A.siete + 0.3);
    const g = (
      <AbsoluteFill>
        <AbsoluteFill style={{ filter: blurK > 0.02 ? `blur(${blurK * 14}px) brightness(${1 - blurK * 0.45})` : undefined }}>
          <Shot k="m1_tapa" t={t} a={B6 - 0.4} z={[1.03, 1.16]} dur={11} o={[40, 60]} />
        </AbsoluteFill>
        <Tag t={t} at={A.negras} x={560} y={830} dx={-60} dy={-300} text="CON LAS MANOS NEGRAS" col={COL.amber} out={A.siete - 0.2} size={52} />
        <Clipboard t={t} a={A.siete} out={B7 - 0.45} five={A.cinco} secret={A.nadieSabe} />
        <Tag t={t} at={A.usado} x={520} y={420} dx={-40} dy={-200} text="CARRO CHINO USADO" col={COL.ice} out={A.cinco} size={46} />
      </AbsoluteFill>
    );
    const wk = ei(t, B7 - 0.4, B7 + 0.05);
    L.push(wk > 0 ? <Whip key="wG" k={wk} prev={g} cur={<Avatar t={t} />} dir={1} /> : <React.Fragment key="g0">{g}</React.Fragment>);
  }
  // ===== H · 63,95-72,3 · avatar: DON CHUY, 64 años, 40 con las manos en motores =====
  if (t >= B7 + 0.05) {
    L.push(<Avatar key="avH" t={t} />);
    L.push(<LowerThird key="lt" t={t} at={A.chuy} out={END} name="DON CHUY" l2="MECÁNICO · MONTERREY" l2at={A.chuy + 0.6} />);
    L.push(<Years key="yr" t={t} a={A.anos64} b={A.cuarenta} out={END} x={1180} y={250} />);
  }
  return <AbsoluteFill style={{ background: "#05070b" }}>{L}</AbsoluteFill>;
};
