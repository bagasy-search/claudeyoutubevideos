// Kit de planos de CHICAGO para tz05 y tz07 (sesión tz-c), armado sobre el mundo de tz-a (elenco, hud, utilería, sets).
// Cada plano es una Escena con el elenco ya parado en su lugar; se pisa sólo lo que cambia. Los actores aceptan un
// objeto o una función del cuadro (para que Mara crezca o se vuelva humo dentro del mismo plano).
import React from "react";
import { AbsoluteFill, interpolate, spring, useVideoConfig } from "remotion";
import { Clave, mira, useF } from "../../anikit/camara";
import { Actor, ActorProps } from "../../anikit/actor";
import { Escena } from "../../anikit/escena";
import { Halo } from "../../anikit/luz";
import { F_GLOBO, F_HUD } from "../../anikit/pantalla";
import { Look } from "../../anikit/personaje";
import { ACENTO, ESC, FRIO, LEO, LEO_CAPUCHA, MARA, ORO, PAL, PAL_DIA, TENZO } from "../elenco";
import { MAYA } from "../elenco_b";
import { FarolMano, TelMesa, Tel } from "../utileria";
import { Lavadero, LAV_PISO, LAV_PUNTOS as L } from "../sets/lavadero";
import { Cuarto, COLCHON_ALTO, CTO_PISO, CTO_PUNTOS as C } from "../sets/cuarto";
import { Broadway, BWY_PISO } from "../sets/broadway";
import { Colectivo36, COLECTIVO, COLECTIVO_PISO } from "../sets/wilson";

export { mira };
export type Act = Partial<ActorProps> | null;
type ActF = Act | ((f: number) => Act);
const res = (a: ActF | undefined, f: number): Act | undefined => (typeof a === "function" ? a(f) : a);

export const RIM_ORO = { lado: -1 as const, color: ORO, fuerza: 0.85 };
export const RIM_FRIO = { lado: 1 as const, color: FRIO, fuerza: 0.55 };
export const SENTADO = { tronco: 4, pI: 88, rI: 88, pD: 92, rD: 92, hI: 25, cI: 50, hD: 35, cD: 55 };
export const SENTADO_TEL = { ...SENTADO, hD: 30, cD: 125, cabeza: 22, tronco: 6 };
// manos de Tenzo sobre la mesa de doblar (cose / dobla): alterna dos poses cada `paso` cuadros
export const cosiendo = (f0: number, f1: number, paso = 14) =>
  Array.from({ length: Math.max(1, Math.floor((f1 - f0) / paso)) }).map((_, i) => ({ f: f0 + i * paso, v: i % 2 ? { hD: 52, cD: 78, hI: 30, cI: 96 } : { hD: 38, cD: 98, hI: 32, cI: 92 } }));
export const TENZO_MESA = { hD: 38, cD: 98, hI: 32, cI: 92 };

const mk = (def: Partial<ActorProps>, over: Act | undefined): ActorProps | null => (over === null ? null : ({ ...def, ...(over ?? {}) } as ActorProps));

// abrigo gris sobre la mesa: `doblez` 0 (abierto) → 1 (doblado), `boton` muestra el botón nuevo
export const Abrigo: React.FC<{ x: number; y: number; doblez?: number; boton?: boolean }> = ({ x, y, doblez = 0, boton = true }) => {
  const w = 300 - 170 * doblez, h = 16 + 26 * doblez;
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x={-w / 2} y={-h} width={w} height={h} rx={8} fill="#6b6e75" />
      <path d={`M${-w / 2 + 10},${-h + 6} H${w / 2 - 10}`} stroke="#5a5d64" strokeWidth={3} />
      {doblez < 0.5 && <path d={`M${-w / 2},${-h + 4} l-60,10 l8,${h - 4} l52,-4 Z`} fill="#62656c" />}
      {boton && <circle cx={w * 0.18} cy={-h / 2} r={5} fill="#d8cdb4" stroke="#8a7e66" strokeWidth={1.5} />}
    </g>
  );
};

// ---------- el lavadero Spin City ----------
export type LavP = {
  cam: Clave[]; leo?: ActF; tenzo?: ActF; mara?: ActF; extra?: ActF[]; tren?: number; luzFarol?: number; hud?: React.ReactNode;
  medio?: React.ReactNode; frente?: React.ReactNode; seed?: number; mano?: number; abrigo?: number | null; tel?: { bocaAbajo?: boolean; vibra?: number } | null;
};
export const EnLavadero: React.FC<LavP> = ({ cam, leo, tenzo, mara, extra = [], tren = -1, luzFarol = 1, hud, medio, frente, seed = 1, mano = 2.5, abrigo = 0, tel = null }) => {
  const f = useF();
  const P = LAV_PISO;
  const a = mk({ look: LEO, escala: ESC, seed: 1, luz: RIM_FRIO, ruta: [{ f: 0, x: L.leo, y: P }], dir: [{ f: 0, v: 1 }], asiento: [{ f: 0, v: 66 }], poses: [{ f: 0, v: SENTADO }], caras: [{ f: 0, v: "neutral" }] }, res(leo, f));
  const t = mk({ look: TENZO, escala: ESC, seed: 2, luz: RIM_ORO, ruta: [{ f: 0, x: L.tenzo, y: P }], dir: [{ f: 0, v: -1 }], poses: [{ f: 0, v: TENZO_MESA }], caras: [{ f: 0, v: "neutral" }], miradas: [{ f: 0, v: { x: -0.2, y: 0.5 } }] }, res(tenzo, f));
  const m = res(mara, f);
  const mm = m ? mk({ look: MARA, escala: ESC * 1.1, seed: 5, ruta: [{ f: 0, x: L.leo - 170, y: P - 40 }], dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "feliz" }], opacidad: () => 0.92, poses: [{ f: 0, v: { hD: 60, cD: 60, hI: 40, cI: 70, cabeza: 14 } }] }, m) : null;
  return (
    <Escena Set={Lavadero} pal={PAL} seed={seed} mano={mano} claves={cam} setProps={{ tren, luzFarol, girando: [3, 7, 12, 22, 31] }}
      medio={<>
        {mm && <Actor {...mm} />}
        {abrigo !== null && <Abrigo x={L.mesa + 90} y={P - 150} doblez={abrigo} />}
        {tel && <TelMesa x={L.mesa + 260} y={P - 150} bocaAbajo={tel.bocaAbajo} vibra={tel.vibra} />}
        {t && <Actor {...t} />}
        {a && <Actor {...a} />}
        {extra.map((e, i) => { const x = res(e, f); return x ? <Actor key={i} {...(x as ActorProps)} /> : null; })}
        {medio}
      </>}
      frente={frente} hud={hud} />
  );
};
export const LAV = { ...L, P: LAV_PISO };

// ---------- el cuarto de Leo (Wilson Avenue) ----------
export type CtoP = { cam: Clave[]; leo?: ActF; mara?: ActF; dia?: boolean; luzPuerta?: number; lampara?: boolean; tren?: number; hud?: React.ReactNode; medio?: React.ReactNode; detras?: React.ReactNode; frente?: React.ReactNode; seed?: number; mano?: number };
export const EnCuarto: React.FC<CtoP> = ({ cam, leo, mara, dia, luzPuerta = 0, lampara = false, tren = -1, hud, medio, detras, frente, seed = 3, mano = 2.5 }) => {
  const f = useF();
  const P = CTO_PISO;
  const a = mk({ look: LEO, escala: ESC, seed: 1, luz: RIM_FRIO, ruta: [{ f: 0, x: C.colchon, y: P }], dir: [{ f: 0, v: 1 }], asiento: [{ f: 0, v: COLCHON_ALTO }], poses: [{ f: 0, v: SENTADO }], caras: [{ f: 0, v: "neutral" }] }, res(leo, f));
  const m = res(mara, f);
  const mm = m ? mk({ look: MARA, escala: ESC * 1.1, seed: 5, ruta: [{ f: 0, x: C.colchon - 200, y: P - 30 }], dir: [{ f: 0, v: 1 }], caras: [{ f: 0, v: "feliz" }], opacidad: () => 0.9 }, m) : null;
  return (
    <Escena Set={Cuarto} pal={dia ? PAL_DIA : PAL} seed={seed} mano={mano} claves={cam} setProps={{ luzPuerta, lampara, tren }}
      detras={detras}
      medio={<>{mm && <Actor {...mm} />}{a && <Actor {...a} />}{medio}</>} frente={frente} hud={hud} />
  );
};
export const CTO = { ...C, P: CTO_PISO, COLCHON_ALTO };

// ---------- Broadway (calle) ----------
export const EnCalle: React.FC<{ cam: Clave[]; leo?: ActF; extra?: ActF[]; dia?: boolean; tren?: number; hud?: React.ReactNode; medio?: React.ReactNode; seed?: number }> = ({ cam, leo, extra = [], dia, tren = -1, hud, medio, seed = 4 }) => {
  const f = useF();
  const a = mk({ look: LEO_CAPUCHA, escala: ESC, seed: 1, luz: RIM_FRIO, ruta: [{ f: 0, x: 600, y: BWY_PISO }], caras: [{ f: 0, v: "neutral" }] }, res(leo, f));
  return (
    <Escena Set={Broadway} pal={dia ? PAL_DIA : PAL} seed={seed} mano={2} claves={cam} setProps={{ hora: dia ? "dia" : "noche", tren }}
      medio={<>{a && <Actor {...a} />}{extra.map((e, i) => { const x = res(e, f); return x ? <Actor key={i} {...(x as ActorProps)} /> : null; })}{medio}</>} hud={hud} />
  );
};
export const BWY_P = BWY_PISO;

// ---------- el colectivo 36 (Leo y Maya) ----------
export const EnColectivo: React.FC<{ cam: Clave[]; leo?: ActF; maya?: ActF; hud?: React.ReactNode; medio?: React.ReactNode }> = ({ cam, leo, maya, hud, medio }) => {
  const f = useF();
  const P = COLECTIVO_PISO;
  const a = mk({ look: LEO, escala: ESC, seed: 1, ruta: [{ f: 0, x: COLECTIVO.asientoLeo, y: P }], dir: [{ f: 0, v: 1 }], asiento: [{ f: 0, v: COLECTIVO.asiento }], poses: [{ f: 0, v: SENTADO }], caras: [{ f: 0, v: "feliz" }], miradas: [{ f: 0, v: { x: 0.8, y: 0 } }] }, res(leo, f));
  const b = mk({ look: MAYA, escala: ESC, seed: 8, ruta: [{ f: 0, x: COLECTIVO.asientoMaya, y: P }], dir: [{ f: 0, v: -1 }], asiento: [{ f: 0, v: COLECTIVO.asiento }], poses: [{ f: 0, v: { ...SENTADO, hD: 60, cD: 100, hI: 55, cI: 105 } }], caras: [{ f: 0, v: "feliz" }] }, res(maya, f));
  return (
    <Escena Set={Colectivo36} pal={PAL_DIA} seed={9} mano={3} claves={cam} setProps={{ dia: true }}
      medio={<>{b && <Actor {...b} />}{a && <Actor {...a} />}{medio}</>} hud={hud} />
  );
};
export const COL = { ...COLECTIVO, P: COLECTIVO_PISO };

// ---------- INSERTO del celular a pantalla completa ----------
// el teléfono derecho al centro, la cámara respira y se acerca; `children` = contenido de la pantalla (div 440x900)
export const PantallaTel: React.FC<{ children?: React.ReactNode; zoom0?: number; zoom1?: number; dur?: number; fondo?: string; mano?: React.ReactNode; luz?: number }> = ({ children, zoom0 = 1, zoom1 = 1.08, dur = 150, fondo = "#0b0c10", mano, luz = 1 }) => {
  const f = useF();
  const z = interpolate(f, [0, dur], [zoom0, zoom1], { extrapolateRight: "clamp" }) * (1 + 0.004 * Math.sin(f / 23));
  const dx = 6 * Math.sin(f / 41), dy = 4 * Math.sin(f / 37 + 1);
  return (
    <AbsoluteFill style={{ background: fondo, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 960 - 700, top: 540 - 700, width: 1400, height: 1400, borderRadius: "50%", background: `radial-gradient(circle, ${ACENTO}${Math.round(40 * luz).toString(16).padStart(2, "0")} 0%, transparent 60%)` }} />
      <div style={{ position: "absolute", left: 960 - 250, top: 540 - 500, width: 500, height: 1000, transform: `translate(${dx}px,${dy}px) scale(${z})`, transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 56, background: "#121218", border: "6px solid #34343e" }} />
        <div style={{ position: "absolute", left: 24, top: 40, width: 440, height: 900, borderRadius: 30, overflow: "hidden", background: "#17171d" }}>{children}</div>
        <div style={{ position: "absolute", left: 200, top: 16, width: 100, height: 14, borderRadius: 7, background: "#060608" }} />
        {mano}
      </div>
    </AbsoluteFill>
  );
};

// burbuja de chat; `yo` = Leo (derecha, gris claro), si no = otra persona (izquierda, ámbar). Aparece con resorte en `desde`
export const Burbuja: React.FC<{ texto: string; desde: number; yo?: boolean; y: number; escribe?: number; visto?: boolean }> = ({ texto, desde, yo, y, escribe, visto }) => {
  const f = useF();
  const { fps } = useVideoConfig();
  if (f < desde) return null;
  const s = spring({ frame: f - desde, fps, config: { damping: 14, stiffness: 160 } });
  const n = escribe ? Math.min(texto.length, Math.floor((f - desde) / escribe)) : texto.length;
  return (
    <div style={{ position: "absolute", top: y, [yo ? "right" : "left"]: 22, maxWidth: 330, transform: `scale(${0.6 + 0.4 * s})`, transformOrigin: yo ? "100% 100%" : "0% 100%", opacity: s }}>
      <div style={{ padding: "16px 22px", borderRadius: 26, background: yo ? "#e8e4dc" : ACENTO, color: yo ? "#1a1a20" : "#fff", fontFamily: F_HUD, fontWeight: 500, fontSize: 36, lineHeight: 1.22 }}>
        {texto.slice(0, n)}{escribe && n < texto.length ? <span style={{ opacity: Math.floor(f / 8) % 2 ? 1 : 0.2 }}>|</span> : null}
      </div>
      {visto && <div style={{ textAlign: yo ? "right" : "left", fontFamily: F_HUD, fontSize: 20, color: "#8a8a94", marginTop: 6 }}>Seen</div>}
    </div>
  );
};
// cabecera del chat
export const CabeceraChat: React.FC<{ nombre: string; color?: string }> = ({ nombre, color = "#3f9a6a" }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 110, background: "#202028", display: "flex", alignItems: "center", paddingLeft: 26, gap: 18 }}>
    <div style={{ width: 62, height: 62, borderRadius: 31, background: color, color: "#fff", fontFamily: F_HUD, fontSize: 32, display: "flex", alignItems: "center", justifyContent: "center" }}>{nombre[0]}</div>
    <div style={{ fontFamily: F_HUD, fontWeight: 600, fontSize: 34, color: "#ece8df" }}>{nombre}</div>
  </div>
);
// el cuadro de escritura de abajo, con el cursor que parpadea
export const CajaEscribir: React.FC<{ texto?: string; desde?: number; vel?: number }> = ({ texto = "", desde = 0, vel = 3 }) => {
  const f = useF();
  const n = Math.max(0, Math.min(texto.length, Math.floor((f - desde) / vel)));
  return (
    <div style={{ position: "absolute", left: 18, right: 18, bottom: 22, minHeight: 74, borderRadius: 37, background: "#26262e", padding: "18px 26px", fontFamily: F_HUD, fontSize: 28, color: "#e8e4dc" }}>
      {texto.slice(0, n)}<span style={{ opacity: Math.floor(f / 15) % 2 ? 1 : 0, color: ACENTO }}>|</span>
    </div>
  );
};
// pulgar que entra desde abajo y toca la pantalla en `toca`
export const Pulgar: React.FC<{ toca: number; x?: number; y?: number; piel?: string }> = ({ toca, x = 300, y = 560, piel = "#ecc9a3" }) => {
  const f = useF();
  const u = interpolate(f, [toca - 40, toca - 4, toca, toca + 10, toca + 40], [1, 0.08, 0, 0.05, 0.6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: x - 70, top: y + u * 600, width: 140, height: 640, transform: `rotate(-14deg)`, transformOrigin: "50% 0%" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "70px 70px 40px 40px", background: piel, boxShadow: "inset -14px 0 0 rgba(0,0,0,0.10)" }} />
      <div style={{ position: "absolute", left: 26, top: 22, width: 88, height: 96, borderRadius: "44px 44px 30px 30px", background: "#f6ddc0", opacity: 0.85 }} />
      {f >= toca && f < toca + 14 && <div style={{ position: "absolute", left: 30, top: -30, width: 80, height: 80, borderRadius: 40, border: `4px solid ${ACENTO}`, opacity: 1 - (f - toca) / 14 }} />}
    </div>
  );
};

// un "rostro hecho de luz": óvalo ámbar sin rasgos explícitos, con dos brillos (el anzuelo)
export const RostroLuz: React.FC = () => {
  const f = useF();
  const p = 0.85 + 0.15 * Math.sin(f / 9);
  return (
    <div style={{ position: "absolute", inset: 0, background: "#1b1016" }}>
      <div style={{ position: "absolute", left: 70, top: 160, width: 300, height: 400, borderRadius: "50%", background: `radial-gradient(ellipse at 50% 40%, #ffe0c6 0%, ${ACENTO} 45%, transparent 72%)`, opacity: p }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, height: 4, background: "#3a2a30" }} />
      {["♥ 12.4K", "↻ 908", "✉"].map((t, i) => <div key={i} style={{ position: "absolute", right: 24, top: 420 + i * 70, fontFamily: F_HUD, fontSize: 26, color: "#ffd9c2", opacity: 0.8 }}>{t}</div>)}
    </div>
  );
};

// letrero chico recto a pie de inserto (hora, lugar)
export const Hora: React.FC<{ texto: string; desde?: number; x?: number; y?: number }> = ({ texto, desde = 0, x = 1640, y = 56 }) => {
  const f = useF();
  const o = interpolate(f, [desde, desde + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <div style={{ position: "absolute", right: 1920 - x - 200, top: y, opacity: o, fontFamily: F_HUD, fontWeight: 500, fontSize: 38, letterSpacing: 2, color: "#e9e3d6", textShadow: "0 2px 0 rgba(0,0,0,0.4), 0 0 18px rgba(0,0,0,0.55)" }}>{texto}</div>;
};

// fundido a negro dentro de un plano (para el farol que se apaga)
export const Negro: React.FC<{ desde: number; d?: number }> = ({ desde, d = 30 }) => {
  const f = useF();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [desde, desde + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }} />;
};

// tarjeta final: el próximo episodio (título y la frase de despedida de Tenzo), limpia y recta
export const TarjetaFinal: React.FC<{ proximo: string; frase: string }> = ({ proximo, frase }) => {
  const f = useF();
  const o = interpolate(f, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#0b0c10", alignItems: "center", justifyContent: "center" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><FarolSolo f={f} /></svg>
      <div style={{ opacity: o, textAlign: "center", fontFamily: F_HUD }}>
        <div style={{ fontSize: 30, letterSpacing: 8, color: "#9a958c", marginBottom: 18 }}>TOMORROW NIGHT</div>
        <div style={{ fontSize: 74, fontWeight: 600, color: "#f4efe6", marginBottom: 34 }}>{proximo}</div>
        <div style={{ fontSize: 34, color: ORO }}>{frase}</div>
      </div>
      <div style={{ position: "absolute", right: 64, bottom: 44, fontFamily: F_HUD, fontWeight: 500, fontSize: 30, letterSpacing: 3, color: "#efe8da", opacity: 0.85 }}>Tenzo Films</div>
    </AbsoluteFill>
  );
};
const FarolSolo: React.FC<{ f: number }> = ({ f }) => (
  <g transform="translate(960,200)">
    <Halo x={0} y={0} r={260} color={ORO} fuerza={0.35 + 0.05 * Math.sin(f / 10)} />
    <g transform="translate(0,40) scale(0.9)"><FarolMano /></g>
  </g>
);

// ---------- recuerdo / inserto gris: torres de vidrio con miles de ventanitas ámbar (la soga fabricada) ----------
export const Torres: React.FC = () => {
  const f = useF();
  const z = 1 + f * 0.0007;
  const T = [[120, 260, 300], [460, 120, 340], [840, 60, 280], [1160, 180, 320], [1520, 100, 300]];
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#151922, #2a303b)" }}>
      <svg width={1920} height={1080} style={{ transform: `scale(${z})`, transformOrigin: "50% 80%" }}>
        {T.map(([x, top, w], i) => (
          <g key={i}>
            <rect x={x} y={top} width={w} height={1080 - top} fill={["#2b313b", "#323946", "#272d36", "#353c49", "#2d333e"][i]} />
            {Array.from({ length: Math.floor((1080 - top) / 36) * Math.floor(w / 34) }).map((_, k) => {
              const cols = Math.floor(w / 34);
              const cx = x + 12 + (k % cols) * 34, cy = top + 18 + Math.floor(k / cols) * 36;
              const on = ((k * 7919 + i * 131) % 11) < 6;
              const tit = on && ((k + Math.floor(f / 20)) % 23 === 0);
              return <rect key={k} x={cx} y={cy} width={16} height={20} rx={2} fill={on ? ACENTO : "#1c2028"} opacity={on ? (tit ? 0.45 : 0.85) : 1} />;
            })}
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// marco de RECUERDO (gris, con un borde de papel); el contenido es una Escena chica
export const Recuerdo: React.FC<{ children: React.ReactNode; desde?: number }> = ({ children, desde = 0 }) => {
  const f = useF();
  const s = interpolate(f, [desde, desde + 16], [0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = interpolate(f, [desde, desde + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", left: 960 - 520, top: 540 - 300, width: 1040, height: 600, opacity: o, transform: `scale(${s}) rotate(0deg)`, borderRadius: 18, overflow: "hidden", border: "10px solid #e8e2d4", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
      <div style={{ position: "absolute", left: -440, top: -240, width: 1920, height: 1080, transform: "scale(0.55)", transformOrigin: "50% 50%" }}>{children}</div>
    </div>
  );
};

export type { Look };
