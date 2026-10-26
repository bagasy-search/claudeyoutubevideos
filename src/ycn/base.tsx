// Bloques comunes de los episodios de Yellow Coat Nell: atajos de actor, escenas por set con el mostrador por delante,
// HUD «DAY N» a mano con rayitas, diálogos escritos a mano (los lee el narrador), foto polaroid y pantalla final.
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { Clave, golpe, useF } from "../anikit/camara";
import { Actor, Paso } from "../anikit/actor";
import { Escena } from "../anikit/escena";
import { Look, LuzP, Personaje, Pose, pose } from "../anikit/personaje";
import { F_HUD, F_MANO, MarcaCorto, Pildora } from "../anikit/pantalla";
import { PAL, NELL, NIÑO, RIM, ROJO, TIZA, AMARILLO } from "./elenco";
import { Pistas, PistasProps, MostradorSnack, MostradorZapatos, Banco, PISTAS_PISO } from "./sets/pistas";
import { CocinaYcn } from "./sets/cocina";
import { Freezer } from "./sets/freezer";
import { SalaPinsetters } from "./sets/pinsetters";
import { Fachada } from "./sets/fachada";

export const P = PISTAS_PISO;
// cuadro local de un instante de la voz, dentro de un plano que empieza en t0 (s)
export const kDe = (t0: number) => (t: number) => Math.round((t - t0) * 30);

// ---------- actor en una línea ----------
type Cl<T> = { f: number; v: T }[];
export type Ac = {
  l: Look; x?: number; ruta?: Paso[]; y?: number; p?: string | Partial<Pose> | Cl<string | Partial<Pose>>; c?: string | Cl<string>;
  d?: 1 | -1 | Cl<1 | -1>; habla?: [number, number][]; mir?: { x: number; y: number } | Cl<{ x: number; y: number }>; sent?: number | Cl<number | undefined>;
  mD?: React.ReactNode | ((f: number) => React.ReactNode); mI?: React.ReactNode | ((f: number) => React.ReactNode); luz?: LuzP; seed?: number; correr?: number;
  op?: (f: number) => number; ajuste?: (p: Pose, f: number) => Pose; esc?: number;
};
const cl = <T,>(v: T | Cl<T> | undefined): Cl<T> | undefined => (v === undefined ? undefined : Array.isArray(v) && v.length && typeof v[0] === "object" && v[0] !== null && "f" in (v[0] as any) ? (v as Cl<T>) : [{ f: 0, v: v as T }]);
export const A: React.FC<Ac & { luzDef?: LuzP }> = (a) => {
  const nino = a.l === NELL || a.l.alto === NELL.alto;
  return (
    <Actor look={a.l} escala={(a.esc ?? 1) * (nino ? NIÑO : 1)} seed={a.seed ?? 1} ruta={a.ruta ? a.ruta.map((r) => ({ ...r, y: r.y ?? a.y ?? P })) : [{ f: 0, x: a.x ?? 0, y: a.y ?? P }]}
      poses={cl(a.p) ?? [{ f: 0, v: "parado" }]} caras={cl(a.c) ?? [{ f: 0, v: "neutral" }]} dir={cl(a.d)} habla={a.habla} miradas={cl(a.mir)}
      asiento={cl(a.sent)} enManoD={a.mD} enManoI={a.mI} luz={a.luz ?? a.luzDef ?? RIM.liga} correr={a.correr} opacidad={a.op} ajuste={a.ajuste} />
  );
};

// ---------- escenas por set (los actores van en `gente`; `sobre` = lo que va por delante del mostrador) ----------
type Base = { cl: Clave[]; gente?: Ac[]; extra?: React.ReactNode; sobre?: React.ReactNode; hud?: React.ReactNode; seed?: number; mano?: number; luzAct?: LuzP };
const Gente: React.FC<{ g?: Ac[]; luz: LuzP }> = ({ g = [], luz }) => <>{g.map((a, i) => <A key={i} seed={i + 1} luzDef={luz} {...a} />)}</>;

export const Sala: React.FC<Base & { sp?: Partial<PistasProps>; snack?: boolean; zapatos?: boolean; banco?: boolean; detras?: Ac[] }> = ({ cl, sp = {}, gente, extra, sobre, hud, seed = 1, mano = 2.5, snack, zapatos, banco, detras, luzAct }) => {
  const luz = luzAct ?? (sp.luz === "noche" ? RIM.noche : sp.luz === "alerta" ? RIM.neon : RIM.liga);
  return (
    <Escena Set={Pistas} pal={PAL} claves={cl} seed={seed} mano={mano} setProps={sp}
      medio={<>
        {banco && <Banco x={4120} />}
        <Gente g={detras} luz={luz} />
        {snack && <MostradorSnack />}
        {zapatos && <MostradorZapatos />}
        <Gente g={gente} luz={luz} />
        {extra}
        {sobre}
      </>}
      hud={hud} />
  );
};
export const Cocina: React.FC<Base & { sp?: Record<string, unknown> }> = ({ cl, sp = {}, gente, extra, hud, seed = 2, mano = 2.5, luzAct }) => (
  <Escena Set={CocinaYcn} pal={PAL} claves={cl} seed={seed} mano={mano} setProps={sp} medio={<><Gente g={gente} luz={luzAct ?? (sp.luz === "noche" ? RIM.noche : RIM.cocina)} />{extra}</>} hud={hud} />
);
export const EnFreezer: React.FC<Base & { sp?: Record<string, unknown> }> = ({ cl, sp = {}, gente, extra, hud, seed = 3, mano = 2.5, luzAct }) => (
  <Escena Set={Freezer} pal={PAL} claves={cl} seed={seed} mano={mano} setProps={sp} medio={<><Gente g={gente} luz={luzAct ?? RIM.frio} />{extra}</>} hud={hud} />
);
export const Maquinas: React.FC<Base & { sp?: Record<string, unknown> }> = ({ cl, sp = {}, gente, extra, hud, seed = 4, mano = 2.5, luzAct }) => (
  <Escena Set={SalaPinsetters} pal={PAL} claves={cl} seed={seed} mano={mano} setProps={sp} medio={<><Gente g={gente} luz={luzAct ?? RIM.linterna} />{extra}</>} hud={hud} />
);
export const Afuera: React.FC<Base & { sp?: Record<string, unknown> }> = ({ cl, sp = {}, gente, extra, hud, seed = 5, mano = 2.5, luzAct }) => (
  <Escena Set={Fachada} pal={PAL} claves={cl} seed={seed} mano={mano} setProps={sp} medio={<><Gente g={gente} luz={luzAct ?? RIM.neon} />{extra}</>} hud={hud} />
);

// ---------- HUD: «DAY N» a mano + rayitas de tiza (arriba a la izquierda) + marca del canal ----------
export const HudDia: React.FC<{ dia: number | string; rayas?: number; desde?: number; hora?: string }> = ({ dia, rayas, desde = 0, hora }) => {
  const f = useF();
  const o = interpolate(f, [desde, desde + 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const n = rayas ?? (typeof dia === "number" ? dia : 0);
  return (
    <>
      <div style={{ position: "absolute", left: 56, top: 34, opacity: o, transform: "rotate(-3deg)" }}>
        <div style={{ fontFamily: F_MANO, fontWeight: 700, fontSize: 78, color: TIZA, lineHeight: 1, textShadow: "0 3px 0 rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.6)" }}>DAY {dia}</div>
        {n > 0 && (
          <svg width={260} height={56} style={{ marginTop: 4 }}>
            {Array.from({ length: n }).map((_, i) => {
              const g = Math.floor(i / 5), k = i % 5, x0 = 8 + g * 62;
              return k < 4 ? <path key={i} d={`M${x0 + k * 11},8 l${(i * 7) % 3 - 1},38`} stroke={TIZA} strokeWidth={5} strokeLinecap="round" /> : <path key={i} d={`M${x0 - 6},40 L${x0 + 42},12`} stroke={TIZA} strokeWidth={5} strokeLinecap="round" />;
            })}
          </svg>
        )}
      </div>
      {hora && <div style={{ position: "absolute", right: 56, top: 40, fontFamily: F_HUD, fontWeight: 600, fontSize: 40, color: "#f4efe4", opacity: o, textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>{hora}</div>}
      <MarcaCorto />
    </>
  );
};

// ---------- diálogo de otro personaje: escrito a mano cerca de quien habla (el narrador lo lee) ----------
export const COLOR_VOZ: Record<string, string> = { nell: AMARILLO, cal: "#8fc2ff", dot: "#ff8fb8", marlon: "#f4efe4", ana: "#9fd3ff", rafi: "#9be3a6", gus: "#f4efe4", otro: "#f4efe4", tv: "#ffd34d" };
export const Dice: React.FC<{ quien: keyof typeof COLOR_VOZ; t: string; x: number; y: number; desde: number; hasta?: number; tam?: number; rot?: number; centro?: boolean }> = ({ quien, t, x, y, desde, hasta, tam = 66, rot = -3, centro }) => {
  const f = useF();
  const n = 1e6; // la frase entra ENTERA con un fundido de 4 cuadros: nunca un cuadro con media palabra
  const o = Math.min(interpolate(f, [desde, desde + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), hasta ? interpolate(f, [hasta - 10, hasta], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1);
  if (f < desde) return null;
  const color = COLOR_VOZ[quien];
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `${centro ? "translateX(-50%) " : ""}rotate(${rot}deg)`, textAlign: centro ? "center" : undefined, fontFamily: F_MANO, fontWeight: 700, fontSize: tam, lineHeight: 1.05, color, opacity: o, whiteSpace: "pre", textShadow: "0 3px 0 rgba(0,0,0,0.65), 0 0 24px rgba(0,0,0,0.8)" }}>
      {t.split("").map((c, i) => <span key={i} style={{ opacity: Math.min(1, Math.max(0, n - i)) }}>{c}</span>)}
    </div>
  );
};

// ---------- rótulo de presentación: NOMBRE · edad (a mano, con flechita) ----------
export const Rotulo: React.FC<{ t: string; x: number; y: number; desde: number; hasta?: number; color?: string; flecha?: "izq" | "der" | "abajo" }> = ({ t, x, y, desde, hasta, color = TIZA, flecha = "abajo" }) => {
  const f = useF();
  if (f < desde) return null;
  const u = interpolate(f, [desde, desde + 8], [0, 1], { extrapolateRight: "clamp" });
  const o = hasta ? interpolate(f, [hasta - 10, hasta], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  const fl = flecha === "abajo" ? "M30,6 q-10,30 6,52 m-12,-10 l12,10 l4,-14" : flecha === "izq" ? "M60,30 q-30,-10 -52,6 m10,-12 l-10,12 l14,4" : "M0,30 q30,-10 52,6 m-10,-12 l10,12 l-14,4";
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o * u, transform: `scale(${0.85 + 0.15 * u}) rotate(-4deg)`, transformOrigin: "left top" }}>
      <div style={{ fontFamily: F_MANO, fontWeight: 700, fontSize: 60, color, whiteSpace: "pre", textShadow: "0 3px 0 rgba(0,0,0,0.6), 0 0 20px rgba(0,0,0,0.7)" }}>{t}</div>
      <svg width={80} height={70} style={{ marginLeft: 20 }}><path d={fl} stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" /></svg>
    </div>
  );
};

// ---------- foto polaroid de alguien que no está (Ana en el hospital) ----------
export const Foto: React.FC<{ l: Look; x: number; y: number; w?: number; rot?: number; fondo?: string; cara?: string; pie?: string; desde?: number; busto?: boolean }> = ({ l, x, y, w = 420, rot = -5, fondo = "#cfe0ee", cara = "feliz", pie, desde = 0, busto }) => {
  const f = useF();
  if (f < desde) return null;
  const u = interpolate(f, [desde, desde + 10], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, padding: 18, paddingBottom: 70, background: "#f6f1e6", transform: `rotate(${rot}deg) translateY(${(1 - u) * 40}px)`, opacity: u, boxShadow: "0 18px 40px rgba(0,0,0,0.55)" }}>
      <svg viewBox={busto ? "-101 -352 202 220" : "-220 -440 440 480"} width={w - 36} height={(w - 36) * 1.09} style={{ background: fondo, display: "block" }}>
        <rect x={-220} y={-60} width={440} height={100} fill="#a9bfd0" />
        <Personaje x={0} y={-20} p={pose("parado")} e={cara} look={l} luz={RIM.liga} />
      </svg>
      {pie && <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", fontFamily: F_MANO, fontWeight: 700, fontSize: 40, color: "#2a2420" }}>{pie}</div>}
    </div>
  );
};

// ---------- un tinte de recuerdo (flashback) sin filtros: velo cálido + viñeta dibujada ----------
export const Recuerdo: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(255,190,110,0.10) 40%, rgba(40,20,10,0.55) 100%)" }} />
);
// velo de color plano (noche, alerta) por encima del plano
export const Velo: React.FC<{ color: string; o: number }> = ({ color, o }) => <AbsoluteFill style={{ background: color, opacity: o }} />;

// ---------- pantalla final: el próximo episodio + suscribirse ----------
export const Final: React.FC<{ ep: number; titulo: string; fondo: React.ReactNode; lado?: boolean; encima?: React.ReactNode }> = ({ ep, titulo, fondo, lado, encima }) => {
  const f = useF();
  const u = interpolate(f, [0, 16], [0, 1], { extrapolateRight: "clamp" });
  if (lado) {
    // tarjeta en el tercio izquierdo, la escena viva a la derecha; un cursor va a SUBSCRIBE y hace clic
    const cx = interpolate(f, [40, 80], [900, 430], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
    const cy = interpolate(f, [40, 80], [1060, 755], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => 1 - Math.pow(1 - t, 3) });
    const clic = f >= 86;
    const pulso = interpolate(f, [86, 92, 100], [1, 0.9, 1.06], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const onda = interpolate(f, [86, 116], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <AbsoluteFill>
        {fondo}
        <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(8,6,10,0.78) 0%, rgba(8,6,10,0.6) 38%, rgba(8,6,10,0) 62%)", opacity: u }} />
        <div style={{ position: "absolute", left: 60, top: 200, width: 700, height: 400, borderRadius: 26, border: `6px solid ${AMARILLO}`, background: "rgba(0,0,0,0.55)", opacity: u, transform: `translateX(${(1 - u) * -80}px)`, boxShadow: "0 0 50px rgba(242,194,48,0.35)" }}>
          <div style={{ position: "absolute", left: 36, top: 28, fontFamily: F_HUD, fontWeight: 600, fontSize: 38, color: AMARILLO, letterSpacing: 3 }}>NEXT · EPISODE {ep}</div>
          <div style={{ position: "absolute", left: 36, right: 36, top: 100, fontFamily: F_MANO, fontWeight: 700, fontSize: 76, lineHeight: 1.02, color: "#f4efe4", textShadow: "0 4px 0 rgba(0,0,0,0.5)" }}>{titulo}</div>
          <div style={{ position: "absolute", right: 36, bottom: 24, fontSize: 80, color: AMARILLO, transform: `translateX(${Math.sin(f / 8) * 8}px)` }}>▶</div>
        </div>
        <div style={{ position: "absolute", left: 160, top: 650, width: 500, height: 110, borderRadius: 55, background: clic ? "#b0161c" : ROJO, transform: `scale(${pulso})`, opacity: u, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F_HUD, fontWeight: 800, fontSize: 54, letterSpacing: 4, color: "#fff", boxShadow: "0 8px 0 rgba(0,0,0,0.45)" }}>{clic ? "SUBSCRIBED ✓" : "SUBSCRIBE"}</div>
        {onda > 0 && onda < 1 && <div style={{ position: "absolute", left: 410 - 160 * onda, top: 705 - 160 * onda, width: 320 * onda, height: 320 * onda, borderRadius: "50%", border: `5px solid rgba(244,239,228,${1 - onda})` }} />}
        {encima}
        <svg width={70} height={90} viewBox="0 0 70 90" style={{ position: "absolute", left: cx, top: cy, transform: `scale(${clic && f < 96 ? 0.85 : 1})`, transformOrigin: "0 0", opacity: u }}>
          <path d="M4,4 L4,70 L22,54 L34,82 L46,76 L34,50 L58,50 Z" fill="#fff" stroke="#111" strokeWidth={5} strokeLinejoin="round" />
        </svg>
        <MarcaCorto />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      {fondo}
      <AbsoluteFill style={{ background: "rgba(8,6,10,0.55)", opacity: u }} />
      <div style={{ position: "absolute", left: 120, top: 250, width: 960, height: 540, borderRadius: 26, border: `6px solid ${AMARILLO}`, background: "rgba(0,0,0,0.35)", opacity: u, boxShadow: "0 0 50px rgba(242,194,48,0.35)" }}>
        <div style={{ position: "absolute", left: 40, top: 30, fontFamily: F_HUD, fontWeight: 600, fontSize: 40, color: AMARILLO, letterSpacing: 3 }}>NEXT · EPISODE {ep}</div>
        <div style={{ position: "absolute", left: 40, right: 40, top: 110, fontFamily: F_MANO, fontWeight: 700, fontSize: 92, lineHeight: 1.0, color: "#f4efe4", textShadow: "0 4px 0 rgba(0,0,0,0.5)" }}>{titulo}</div>
        <div style={{ position: "absolute", right: 40, bottom: 30, fontSize: 90, color: AMARILLO, transform: `translateX(${Math.sin(f / 8) * 8}px)` }}>▶</div>
      </div>
      <div style={{ position: "absolute", left: 1230, top: 470, width: 220, height: 220, borderRadius: 110, border: "6px solid #f4efe4", opacity: u }} />
      <Pildora texto="SUBSCRIBE" x={1340} y={740} desde={10} color={ROJO} tam={44} />
      <MarcaCorto />
    </AbsoluteFill>
  );
};

// sacudón de cámara (golpe seco): envuelve el plano entero
export const Sacude: React.FC<{ en: number[]; amp?: number; children: React.ReactNode }> = ({ en, amp = 8, children }) => {
  const f = useF();
  const g = en.reduce((a, t) => a + golpe(f, t, amp), 0);
  return <AbsoluteFill style={{ transform: `translate(${g}px, ${g * 0.6}px) scale(1.02)` }}>{children}</AbsoluteFill>;
};

// lista escrita a mano que se va llenando (el conteo de Rafi, las raciones de Dot): cada renglón aparece en su cuadro
export const Lista: React.FC<{ x: number; y: number; tam?: number; lineas: { t: string; desde?: number; color?: string; tachar?: number }[] }> = ({ x, y, tam = 58, lineas }) => {
  const f = useF();
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "rotate(-2deg)", padding: "22px 34px", background: "rgba(10,8,12,0.45)", borderRadius: 18 }}>
      {lineas.map((l, i) => {
        const d = l.desde ?? 0;
        if (f < d) return null;
        const u = interpolate(f, [d, d + 8], [0, 1], { extrapolateRight: "clamp" });
        const tx = l.tachar !== undefined ? interpolate(f, [l.tachar, l.tachar + 8], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
        return (
          <div key={i} style={{ position: "relative", fontFamily: F_MANO, fontWeight: 700, fontSize: tam, lineHeight: 1.08, color: l.color ?? TIZA, opacity: u, transform: `translateX(${(1 - u) * -20}px)`, whiteSpace: "nowrap", textShadow: "0 3px 0 rgba(0,0,0,0.5)" }}>
            {l.t}
            {tx > 0 && <div style={{ position: "absolute", left: 0, top: "52%", height: 6, width: `${tx}%`, background: ROJO, borderRadius: 3 }} />}
          </div>
        );
      })}
    </div>
  );
};
