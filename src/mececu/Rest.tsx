// mececu · EL RESTO (fin del minuto 1 → final). Un solo hilo sin cortes secos: el avatar en cada ventana del reel,
// tomas reales con empuje propio (cada foto UNA sola vez) y, entre medio, piezas 2D sobre el pizarrón del taller
// (la computadora que aprende y olvida, la batería con su borne negativo, el cronómetro de 15 min, la ventanilla que
// reaprende, la aguja del ralentí, la guía abierta en la pág. 23/39…). Todo anclado a la voz con at("frase").
// Uniones: barrido / portal / iris / zoom / cortina, nunca con desenfoque. Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { Avatar, Shot, Stamp, WIN, MIN1_END } from "./Min1";
import { at, END } from "./at";
import { BigNum, COL, DrawX, Flash, Portal, Tag, e, ei } from "./lib";
import { Comment, Desc, ErrorCard, Flow, KitTray, Libro, MaxTimer, NextCard, Recap, Rows, StepPlate, Subscribe, VsCard } from "./kit2d";
import { Aguja, Bateria, Crono, Ecu, Fondo, Ventanilla } from "./ecu2d";

export const REST_START = MIN1_END;
export const FULL_END = END;

type Base = (t: number) => React.ReactNode;
const AV = (ms: number, me: number): Base => (t) => <Avatar t={Math.min(Math.max(t, ms), me - 0.03)} />;
const S = (k: string, a: number, z: [number, number] = [1.03, 1.13], dur = 8, ox = 0, oy = 0): Base => (t) => <Shot k={k} t={t} a={a} z={z} ox={ox} oy={oy} dur={dur} />;
// fondo de las piezas = el MISMO mundo 3D del minuto 1 (cámara quieta en su último encuadre), oscurecido, con la grilla encima
const Mundo: React.FC<{ t: number; tone: string }> = ({ t, tone }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ transform: `scale(${1.06 + 0.03 * Math.sin(t * 0.13)}) translate(${8 * Math.sin(t * 0.09)}px, ${5 * Math.cos(t * 0.11)}px)` }}><Img src={staticFile("mececu/mundo_bg.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
    <AbsoluteFill style={{ background: tone, opacity: 0.78 }} />
    <AbsoluteFill style={{ opacity: 0.55 }}><Fondo t={t} /></AbsoluteFill>
  </AbsoluteFill>
);
const BK: Base = (t) => <Mundo t={t} tone="#070c14" />;
const BKr: Base = (t) => <Mundo t={t} tone="#1a0909" />;

type Tr = "cut" | "swipeL" | "swipeR" | "up" | "down" | "portal" | "iris" | "zoom" | "fade" | "wipe";
type Seg = { a: number; base: Base; tr?: Tr; px?: number; py?: number };
const D = 0.36;

const Trans: React.FC<{ t: number; s: Seg; from: React.ReactNode; to: React.ReactNode }> = ({ t, s, from, to }) => {
  const k = ei(t, s.a, s.a + D), tr = s.tr ?? "fade";
  const L = (n: React.ReactNode, st: React.CSSProperties, key: string) => <AbsoluteFill key={key} style={st}>{n}</AbsoluteFill>;
  if (tr === "swipeL" || tr === "swipeR" || tr === "up" || tr === "down") {
    const dir = tr === "swipeL" || tr === "up" ? 1 : -1, ax = tr === "up" || tr === "down" ? "Y" : "X", DD = ax === "Y" ? 1080 : 1920;
    return <AbsoluteFill>{L(from, { transform: `translate${ax}(${-dir * k * DD}px)` }, "f")}{L(to, { transform: `translate${ax}(${dir * (1 - k) * DD}px)` }, "t")}</AbsoluteFill>;
  }
  if (tr === "portal") return <AbsoluteFill><AbsoluteFill>{from}</AbsoluteFill><Portal x={s.px ?? 960} y={s.py ?? 540} r={k}>{to}</Portal></AbsoluteFill>;
  if (tr === "iris") return <AbsoluteFill><AbsoluteFill>{from}</AbsoluteFill><AbsoluteFill style={{ clipPath: `circle(${k * 1150}px at ${s.px ?? 960}px ${s.py ?? 540}px)` }}>{to}</AbsoluteFill><Flash t={t} at={s.a + 0.02} col="#eaf6ff" peak={0.3} w={0.3} /></AbsoluteFill>;
  if (tr === "wipe") return <AbsoluteFill><AbsoluteFill>{from}</AbsoluteFill><AbsoluteFill style={{ clipPath: `inset(${(1 - k) * 100}% 0 0 0)` }}>{to}</AbsoluteFill></AbsoluteFill>;
  if (tr === "zoom") return <AbsoluteFill><AbsoluteFill style={{ transform: `scale(${0.94 + 0.06 * k})` }}>{to}</AbsoluteFill><AbsoluteFill style={{ opacity: 1 - k, transform: `scale(${1 + k * 0.35})` }}>{from}</AbsoluteFill></AbsoluteFill>;
  return <AbsoluteFill><AbsoluteFill>{from}</AbsoluteFill><AbsoluteFill style={{ opacity: k }}>{to}</AbsoluteFill></AbsoluteFill>;
};

// ventana del avatar que arranca cerca de ms
const W_ = (ms: number) => { const w = WIN.find((x) => Math.abs(x.ms - ms) < 0.3); if (!w) throw new Error("sin ventana de avatar en " + ms); return w; };
const me = (ms: number) => W_(ms).me;
const inAv = (t: number) => WIN.some((w) => t >= w.ms - 0.05 && t < w.me + 0.05);

// los momentos de la voz que usan las tomas y las piezas
const M = () => ({
  internet: at("internet esta lleno", 94), cajita: at("es una cajita de metal", 158), escape: at("el escape", 172), inyectar: at("gasolina inyectar", 172),
  elena: at("dona elena ya la conoces", 108), nieta: at("la nieta le leyo", 123), borra: at("eso es lo que borra", 209), aprendido: at("lo aprendido", 213),
  sirve: at("entonces sirve para esto", 219), noSirve: at("y no sirve para esto", 239), luzMotor: at("no sirve para esconder", 250), caja: at("en una caja automatica", 261),
  leeCod: at("primero lee el codigo", 268), antes: at("ahora antes de tocar nada", 273), adv1: at("advertencia numero uno", 278), tarjeta: at("en una tarjetita", 298),
  adv2: at("advertencia numero 2", 312), asiento: at("tambien se borra la hora", 352), adv3: at("advertencia numero 3", 383), amarillo: at("nunca nunca toques los", 404),
  reconectes: at("cuando reconectes", 418), pag39: at("esta en el manual en la pagina 39", 434), adv4: at("advertencia numero 4", 448), cajuela: at("esta en la cajuela", 463),
  europeo: at("si tu auto es europeo", 466), suscr: at("suscribete al canal", 486), link2: at("el link esta abajo", 510), paso1: at("paso 1 el auto", 515),
  proxi: at("si tu auto tiene llave de proximidad", 526), paso2: at("paso 2 la herramienta", 540), polvo: at("si los bornes tienen polvo", 551), bicarb: at("lo limpias con agua", 568),
  paso3: at("paso 3 el borne", 573), aflojas: at("aflojas la tuerca", 580), sacas: at("y sacas el borne", 584), envuelvo: at("yo lo envuelvo", 593),
  regla: at("y la regla de oro", 604), cortocircuito: at("eso es un cortocircuito", 612), primero: at("el negativo es el primero", 625), paso4: at("paso 4 esperar", 630),
  espero15: at("yo espero 15", 636), juntes: at("hay quien te dice que juntes", 652), crono: at("pon un cronometro", 662), paso5: at("paso 5 reconectar", 667),
  chispita: at("puede saltar una chispita", 682), chispaGrande: at("si salta una chispa grande", 688), parte: at("y ahora la parte que todos", 697), contacto: at("das contacto sin arrancar", 702),
  acel: at("no tocas el acelerador", 711), diezMin: at("unos 10 minutos hasta", 719), ventilador: at("hasta que se prenda el ventilador", 719), manejas: at("despues manejas normal", 730),
  semana: at("en una semana de manejo", 746), ventUlt: at("y por ultimo las ventanillas", 750), libreta: at("ya lo tenia anotado", 754), quieta: at("se quedo quieta", 772),
  talleres: at("en muchos talleres", 790), pregunta: at("pregunta en el mostrador", 806), repaso: at("te repaso", 815), dime: at("ahora dime tu", 844),
  botella: at("y la prueba con una botella", 874), linea: at("le escribi una sola linea", 882),
});

const buildSegs = (): Seg[] => {
  const T = M();
  const g = (a: number, base: Base, tr?: Tr, extra: Partial<Seg> = {}): Seg => ({ a, base, tr, ...extra });
  const av = (ms: number, tr: Tr = "swipeL"): Seg[] => { const w = W_(ms); return [{ a: w.ms, base: AV(w.ms, w.me), tr }]; };
  const sh = (k: string, a: number, b: number, tr: Tr = "swipeL", z: [number, number] = [1.03, 1.13], extra: Partial<Seg> = {}) => g(a, S(k, a, z, b - a), tr, extra);
  return [
    // --- INTRO: un taller honesto → internet dice "para todo" → no es para todo → la manguerita de Elena ---
    sh("r_taller", REST_START, T.internet, "swipeL", [1.04, 1.14]),
    sh("r_internet", T.internet, 99.2, "zoom", [1.1, 1.02]),
    ...av(99.2, "up"),
    g(me(99.2), BK, "iris"),
    sh("e_manguera", T.elena, 116.1, "swipeR", [1.02, 1.14]),
    ...av(116.1),
    sh("e_ralenti", me(116.1), T.nieta, "down", [1.03, 1.12]),
    sh("e_patio", T.nieta, 129.3, "swipeL", [1.02, 1.12]),
    ...av(129.3, "swipeR"),
    g(me(129.3), BK, "portal"),
    ...av(146.6, "up"),
    // --- LA COMPUTADORA ---
    g(me(146.6), BK, "down"),
    sh("u_caja", T.cajita, 163.6, "portal", [1.0, 1.12], { px: 960, py: 540 }),
    ...av(163.6, "swipeL"),
    sh("u_sensores", me(163.6), T.escape, "swipeR", [1.02, 1.12]),
    sh("u_escape", T.escape, T.inyectar, "swipeL", [1.04, 1.12]),
    sh("u_inyector", T.inyectar, 180.4, "zoom", [1.1, 1.02]),
    ...av(180.4, "up"),
    g(me(180.4), BK, "wipe"),
    ...av(198.7, "swipeL"),
    sh("u_tablero", me(198.7), T.borra, "swipeR", [1.02, 1.12]),
    g(T.borra, BK, "iris"),
    ...av(215.9, "up"),
    // --- PARA QUÉ SIRVE · PARA QUÉ NO ---
    g(me(215.9), BK, "down"),
    sh("w_cuerpo", at("una limpieza del cuerpo", 227), 231.8, "zoom", [1.08, 1.0]),
    ...av(231.8, "swipeL"),
    sh("c_capot", me(231.8), T.noSirve, "swipeR", [1.02, 1.12]),
    sh("w_bujia", T.noSirve, 249.1, "portal", [1.0, 1.12], { px: 960, py: 560 }),
    ...av(249.1, "swipeL"),
    g(me(249.1), BKr, "wipe"),
    sh("w_caja", T.caja, 264.3, "swipeR", [1.03, 1.13]),
    ...av(264.3, "up"),
    sh("w_escaner", me(264.3), T.antes, "down", [1.02, 1.12]),
    g(T.antes, BKr, "iris"),
    // --- ADVERTENCIA 1: LA RADIO ---
    ...av(281.0, "swipeL"),
    sh("a_radio", me(281.0), 298.5, "swipeR", [1.02, 1.14]),
    ...av(298.5, "up"),
    sh("a_tarjeta", me(298.5), 312.7, "down", [1.03, 1.13]),
    // --- ADVERTENCIA 2: LAS VENTANILLAS ---
    ...av(312.7, "swipeL"),
    sh("a_ventanilla", me(312.7), 331.2, "swipeR", [1.02, 1.12]),
    ...av(331.2, "swipeL"),
    g(me(331.2), BK, "iris"),
    ...av(348.0, "up"),
    sh("a_asiento", me(348.0), 364.4, "down", [1.03, 1.13]),
    ...av(364.4, "swipeR"),
    sh("a_volante", me(364.4), 378.0, "swipeL", [1.02, 1.12]),
    ...av(378.0, "swipeR"),
    // --- ADVERTENCIA 3: EL AIRBAG ---
    g(me(378.0), BKr, "wipe"),
    ...av(394.4, "swipeL"),
    g(me(394.4), BKr, "zoom"),
    ...av(411.2, "up"),
    sh("a_amarillo", me(411.2), 427.9, "down", [1.04, 1.14]),
    ...av(427.9, "swipeL"),
    g(me(427.9), BKr, "iris"),
    ...av(442.7, "swipeR"),
    // --- ADVERTENCIA 4: NO TODOS SON IGUALES ---
    g(me(442.7), BKr, "wipe"),
    sh("a_naranja", at("hibrido", 454), 459.4, "zoom", [1.1, 1.02]),
    ...av(459.4, "swipeL"),
    sh("a_cajuela", me(459.4), T.europeo, "swipeR", [1.02, 1.12]),
    g(T.europeo, BK, "iris"),
    ...av(476.5, "up"),
    g(me(476.5), BK, "down"),
    // --- CTA 2 ---
    ...av(492.9, "swipeL"),
    g(me(492.9), BK, "zoom"),
    ...av(509.1, "swipeR"),
    // --- EL PASO A PASO ---
    g(me(509.1), BK, "wipe"),
    sh("p_apagado", T.paso1 + 0.4, 525.1, "swipeL", [1.02, 1.12]),
    ...av(525.1, "up"),
    g(me(525.1), BKr, "down"),
    ...av(542.9, "swipeL"),
    sh("p_herramientas", me(542.9), T.polvo, "swipeR", [1.02, 1.12]),
    sh("p_sulfato", T.polvo, 561.2, "zoom", [1.1, 1.02]),
    ...av(561.2, "swipeL"),
    sh("p_bicarbonato", me(561.2), 575.5, "swipeR", [1.03, 1.13]),
    ...av(575.5, "up"),
    sh("p_aflojar", me(575.5), T.sacas, "down", [1.04, 1.14]),
    g(T.sacas, BK, "iris"),
    ...av(593.7, "swipeL"),
    sh("p_envuelto", me(593.7), T.regla, "swipeR", [1.02, 1.12]),
    g(T.regla, BKr, "wipe"),
    ...av(610.6, "up"),
    sh("p_chispa", me(610.6), T.primero, "down", [1.0, 1.12]),
    g(T.primero, BK, "iris"),
    ...av(628.9, "swipeL"),
    g(me(628.9), BK, "zoom"),
    ...av(646.3, "swipeR"),
    g(me(646.3), BKr, "wipe"),
    ...av(661.5, "up"),
    sh("p_cronometro", me(661.5), T.paso5, "down", [1.03, 1.13]),
    g(T.paso5, BK, "iris"),
    ...av(677.2, "swipeL"),
    sh("p_apretar", me(677.2), T.chispaGrande, "swipeR", [1.04, 1.14]),
    g(T.chispaGrande, BKr, "wipe"),
    // --- EL REAPRENDIZAJE ---
    ...av(694.3, "up"),
    g(me(694.3), BK, "down"),
    sh("r_luces", T.contacto + 0.6, 708.5, "zoom", [1.08, 1.0]),
    ...av(708.5, "swipeL"),
    sh("r_aire", me(708.5), T.diezMin, "swipeR", [1.02, 1.12]),
    sh("r_ventilador", T.diezMin, 725.8, "portal", [1.0, 1.12], { px: 960, py: 540 }),
    ...av(725.8, "swipeL"),
    sh("r_ruta", me(725.8), 741.6, "swipeR", [1.03, 1.14]),
    ...av(741.6, "up"),
    g(me(741.6), BK, "down"),
    sh("r_libreta", T.libreta, 758.5, "swipeL", [1.02, 1.12]),
    ...av(758.5, "swipeR"),
    g(me(758.5), BK, "iris"),
    ...av(775.4, "up"),
    sh("c_quieta", me(775.4), T.talleres, "down", [1.02, 1.1]),
    g(T.talleres, BK, "wipe"),
    ...av(791.8, "swipeL"),
    sh("c_mostrador", me(791.8), 809.6, "swipeR", [1.02, 1.12]),
    ...av(809.6, "up"),
    // --- EL REPASO + CIERRE ---
    g(me(809.6), BK, "down"),
    ...av(828.0, "swipeL"),
    g(me(828.0), BK, "zoom"),
    ...av(841.9, "swipeR"),
    g(me(841.9), BK, "wipe"),
    ...av(858.3, "up"),
    g(me(858.3), BK, "down"),
    ...av(873.5, "swipeL"),
    sh("c_botella", me(873.5), T.linea, "swipeR", [1.03, 1.13]),
    g(T.linea, BK, "iris"),
    ...av(889.6, "up"),
  ].filter((s) => s.a < FULL_END).sort((a, b) => a.a - b.a);
};

// ---------- piezas encima (cada una maneja su entrada/salida) ----------
type Ov = { a: number; b: number; n: (t: number) => React.ReactNode };

const buildOvs = (): Ov[] => {
  const T = M();
  const o = (a: number, b: number, n: (t: number) => React.ReactNode): Ov => ({ a, b, n });
  const big = (key: string, a: number, out: number, text: string, y = 200, size = 100, col: string = COL.ink, edge = "#1c2a3a", sub?: string, x = 960) =>
    o(a, out, (t) => <BigNum key={key} t={t} at={a} text={text} x={x} y={y} size={size} col={col} edge={edge} out={out} sub={sub} />);
  const tag = (key: string, a: number, out: number, x: number, y: number, text: string, dx = 260, dy = -160, col: string = COL.ink, size = 50, sub?: string) =>
    o(a, out, (t) => <Tag key={key} t={t} at={a} x={x} y={y} dx={dx} dy={dy} text={text} col={col} out={out} size={size} sub={sub} />);
  const stamp = (key: string, a: number, out: number, text: string, x = 1400, y = 860, col: string = COL.red, size = 90, rot = -7) =>
    o(a, out, (t) => <Stamp key={key} t={t} at={a} text={text} x={x} y={y} out={out} col={col} size={size} rot={rot} />);
  const GREEN = "#7dff9e", YEL = "#ffd60a", ORG = "#ff9f43";
  return [
    // --- INTRO ---
    tag("hon", at("un buen taller hace esto", 88), T.internet - 0.1, 960, 520, "UN TALLER HONESTO LO HACE", 300, -200, GREEN, 50, "Y NO TE LO COBRA"),
    big("todo", T.internet + 0.3, 99.1, "“DESCONECTA LA BATERÍA PARA TODO”", 880, 62, COL.ink, "#1c2a3a"),
    stamp("nopt", at("no es para todo", 100), me(99.2) - 0.1, "NO ES PARA TODO", 1400, 860, COL.red, 90),
    o(me(99.2), T.elena - 0.05, (t) => <Ecu key="ecu0" t={t} at={me(99.2) + 0.05} out={T.elena - 0.2} label="TENÍA QUE APRENDER SOLA" />),
    tag("mang", T.elena + 1.5, 116.0, 900, 560, "MANGUERITA DE VACÍO PARTIDA", 300, -220, ORG, 50),
    big("luz", at("se cambio la luz", 117), me(116.1) - 0.1, "LUZ APAGADA… PERO SIGUE RARO", 200, 76, YEL, "#5a4500", undefined, 1200),
    o(me(116.1), T.nieta, (t) => <Aguja key="ag0" t={t} at={me(116.1) + 0.2} out={T.nieta - 0.2} calmAt={1e9} x={1500} y={480} sc={0.62} />),
    tag("frio", at("sobre todo en frio", 122), T.nieta - 0.1, 700, 560, "SOBRE TODO EN FRÍO", -200, -220, COL.ice, 50),
    tag("tel", T.nieta + 0.3, 129.2, 960, 520, "LA NIETA LO LEYÓ EN EL TELÉFONO", 300, -200, COL.ink, 46),
    big("hago", at("lo hago o no lo hago", 129), me(129.3) - 0.1, "“¿LO HAGO O NO LO HAGO?”", 200, 84, YEL, "#5a4500", undefined, 1250),
    // --- CTA 1: la guía en la pág. 23 ---
    o(me(129.3), 146.5, (t) => <Libro key="lib23" t={t} at={me(129.3) + 0.05} openAt={at("todo lo de la bateria", 136)} out={146.4} page={23}
      hl={{ at: at("esta en mi manual del mecanico", 140) + 0.2, x: 0.07, y: 0.13, w: 0.86, h: 0.4 }} />),
    o(at("link esta abajo", 146), 151.7, (t) => <Desc key="d1" t={t} at={at("link esta abajo", 146)} out={me(146.6) - 0.15} />),
    // --- LA COMPUTADORA ---
    o(me(146.6), T.cajita - 0.05, (t) => <Ecu key="ecu1" t={t} at={me(146.6) + 0.1} out={T.cajita - 0.2} />),
    big("eq", at("la eq o la centralita", 157), T.cajita - 0.1, "ECU · CENTRALITA", 170, 90, YEL, "#5a4500"),
    tag("donde", at("a veces en el motor", 162), 163.5, 960, 520, "EN EL MOTOR O DETRÁS DEL TABLERO", 300, -220, COL.ink, 44),
    big("mira", at("mira todo el tiempo", 165), me(163.6) - 0.1, "MIRA TODO EL TIEMPO", 200, 84, COL.ice, "#0a2a40", undefined, 1300),
    tag("sen", me(163.6) + 0.3, T.escape - 0.1, 960, 520, "LOS SENSORES", 300, -200, COL.ice, 60, "AIRE · TEMPERATURA"),
    tag("oxi", T.escape + 0.1, T.inyectar - 0.1, 960, 560, "EL OXÍGENO QUE SALE", 300, -200, ORG, 52),
    tag("gas", T.inyectar + 0.2, 180.3, 960, 520, "CUÁNTA GASOLINA INYECTAR", 300, -200, YEL, 52, "Y A CUÁNTAS VUELTAS"),
    big("apr", at("computadora aprende con los meses", 182), me(180.4) - 0.1, "APRENDE CON LOS MESES", 200, 84, GREEN, "#0a3a1a", undefined, 1300),
    o(me(180.4), 198.6, (t) => <Ecu key="ecu2" t={t} at={me(180.4) + 0.1} out={198.5} x={700} />),
    o(me(180.4), 198.6, (t) => <Rows key="corrige" t={t} title="VA CORRIGIENDO SUS NÚMEROS" x={1450} y={520} out={198.5} sc={0.85} rows={[
      { at: at("para tu motor con su", 186), ic: "🔧", tx: "TU DESGASTE" }, { at: at("con su gasolina", 188), ic: "⛽", tx: "TU GASOLINA" },
      { at: at("con su manguerita partida", 189), ic: "💨", tx: "TU MANGUERITA PARTIDA" }]} />),
    big("comp", at("le agrego gasolina", 198), me(198.7) - 0.1, "LE AGREGÓ GASOLINA", 200, 80, ORG, "#4a2000", undefined, 1300),
    stamp("noex", at("algo que ya no existe", 203), me(198.7) - 0.1, "ALGO QUE YA NO EXISTE", 1350, 880, COL.red, 70),
    tag("dias", at("puede tardar dias o semanas", 209), T.borra - 0.1, 960, 520, "TARDA DÍAS O SEMANAS", 300, -200, ORG, 52),
    o(T.borra, me(215.9) + 0.5, (t) => inAv(t) ? null : <Ecu key="ecu3" t={t} at={T.borra + 0.1} resetAt={T.aprendido} out={215.8} />),
    big("fab", at("vuelve a sus numeros de fabrica", 215), me(215.9) - 0.1, "DE FÁBRICA → DE CERO", 200, 84, COL.ice, "#0a2a40", undefined, 1300),
    // --- PARA QUÉ SIRVE ---
    o(me(215.9), 231.7, (t) => <Rows key="sirve" t={t} title="SIRVE DESPUÉS DE UN ARREGLO" x={960} y={560} out={at("una limpieza del cuerpo", 227) - 0.2} rows={[
      { at: at("una manguera un sensor", 225), ic: "💨", tx: "UNA MANGUERA" }, { at: at("un sensor nuevo", 225), ic: "📡", tx: "UN SENSOR NUEVO" },
      { at: at("una limpieza del cuerpo", 226) - 0.4, ic: "🧽", tx: "CUERPO DE ACELERACIÓN" }]} />),
    tag("bnueva", at("una bateria nueva", 228), 231.7, 960, 520, "UNA BATERÍA NUEVA", 300, -200, GREEN, 54),
    big("ral", at("cuando el auto tiene el", 231), me(231.8) - 0.1, "RALENTÍ RARO + CAUSA YA ARREGLADA", 200, 64, GREEN, "#0a3a1a", undefined, 1150),
    tag("ayuda", at("ahi desconectar la bateria", 236), T.noSirve - 0.1, 960, 520, "AYUDA A QUE ANDE BIEN MÁS RÁPIDO", 300, -200, GREEN, 44),
    stamp("rota", at("no arregla una pieza rota", 243), 249.0, "NO ARREGLA PIEZAS ROTAS", 1300, 880, COL.red, 74),
    tag("bujia", at("si una bujia esta gastada", 245), 249.0, 960, 560, "LA BUJÍA SIGUE GASTADA", 300, -220, ORG, 50),
    big("12", at("a fallar en un dia o dos", 251), me(249.1) - 0.1, "VUELVE A FALLAR EN 1-2 DÍAS", 200, 76, COL.red, "#3a0a06", undefined, 1250),
    o(me(249.1), T.caja + 0.2, (t) => <Rows key="nosirve" t={t} title="NO SIRVE PARA…" x={960} y={560} out={T.caja} rows={[
      { at: me(249.1) + 0.1, ic: "🔩", tx: "ARREGLAR UNA PIEZA ROTA", no: true }, { at: T.luzMotor + 0.3, ic: "💡", tx: "ESCONDER LA LUZ DEL MOTOR", no: true },
      { at: at("tambien el registro", 258), ic: "📋", tx: "BORRA LO QUE EL MECÁNICO NECESITA", no: true }]} />),
    tag("patina", T.caja + 0.5, 264.2, 960, 520, "CAJA QUE PATINA O DA GOLPES", 300, -200, COL.red, 48),
    stamp("tall", at("eso es para el taller siempre", 264), me(264.3) - 0.1, "ESO: AL TALLER", 1400, 860, COL.red, 90),
    tag("cod", T.leeCod + 0.2, T.antes - 0.1, 960, 520, "PRIMERO, LEE EL CÓDIGO", 300, -200, YEL, 54),
    big("final", at("es para el final", 274), T.antes - 0.1, "EL REINICIO VA AL FINAL", 880, 80, GREEN, "#0a3a1a"),
    big("4adv", T.antes + 0.3, T.adv1 - 0.1, "LAS 4 ADVERTENCIAS", 540, 140, COL.red, "#3a0a06"),
    // --- ADVERTENCIA 1 ---
    o(T.adv1, 280.9, (t) => <ErrorCard key="a1" t={t} at={T.adv1} out={280.8} n={1} of={4} tx="EL CÓDIGO DE LA RADIO" head="ADVERTENCIA" />),
    tag("traba", at("radio con traba antirrobo", 287), at("y sin ese codigo", 294) - 0.1, 960, 520, "TRABA ANTIRROBO", 300, -200, YEL, 56),
    tag("45", at("un codigo de cuatro", 292), at("y sin ese codigo", 294) - 0.1, 960, 520, "PIDE 4 O 5 NÚMEROS", -320, 200, COL.ice, 52),
    big("nopr", at("la radio no prende mas", 296), 298.4, "SIN CÓDIGO NO PRENDE MÁS", 880, 80, COL.red, "#3a0a06"),
    tag("guant", T.tarjeta + 0.3, 312.6, 960, 560, "LA TARJETITA DEL MANUAL", 300, -220, YEL, 50, "EN LA GUANTERA"),
    stamp("busc", at("buscalo antes", 305), 312.6, "BÚSCALO ANTES", 1400, 860, GREEN, 84),
    big("nodes", at("no desconectes nada", 307), 312.6, "SIN EL CÓDIGO, NO DESCONECTES NADA", 180, 62, COL.red, "#3a0a06"),
    // --- ADVERTENCIA 2 ---
    o(T.adv2, me(312.7), (t) => <ErrorCard key="a2" t={t} at={T.adv2} out={me(312.7) - 0.1} n={2} of={4} tx="LAS VENTANILLAS" head="ADVERTENCIA" y={300} />),
    tag("toque", me(312.7) + 0.3, at("al cortar la corriente", 322) - 0.1, 960, 480, "SUBEN SOLAS DE UN TOQUE", 300, -200, COL.ice, 50),
    tag("pierde", at("al cortar la corriente", 322), 331.1, 960, 480, "PIERDEN DÓNDE ES ARRIBA Y ABAJO", 300, -200, ORG, 44),
    stamp("norota", at("no esta rota", 331), 331.1, "NO ESTÁ ROTA", 1400, 860, GREEN, 84),
    big("ens", at("hay que ensenarle de nuevo", 332), me(331.2) - 0.1, "HAY QUE ENSEÑARLE DE NUEVO", 200, 76, GREEN, "#0a3a1a", undefined, 1250),
    o(me(331.2), 347.9, (t) => <Ventanilla key="ven" t={t} at={me(331.2) + 0.05} out={347.8} downAt={me(331.2) + 0.5} upAt={at("despues las subes del todo", 341)} />),
    big("techo", at("lo mismo con el techo", 349), me(348.0) - 0.1, "IGUAL CON EL TECHO CORREDIZO", 200, 70, COL.ice, "#0a2a40", undefined, 1250),
    o(T.asiento, 364.3, (t) => <KitTray key="borra" t={t} out={364.2} y={110} items={[
      { at: T.asiento + 0.2, ic: "🕒", tx: "LA HORA" }, { at: at("las emisoras guardadas", 357), ic: "📻", tx: "LAS EMISORAS" }, { at: at("la memoria del asiento", 360), ic: "💺", tx: "ASIENTO Y ESPEJOS" }]} />),
    stamp("anot", at("pero anotalo antes", 363), me(364.4) - 0.1, "ANÓTALO ANTES", 1400, 860, YEL, 84),
    tag("estab", at("luz del control de estabilidad", 371), at("casi siempre se apaga", 375) - 0.1, 960, 480, "LUZ DE CONTROL DE ESTABILIDAD", 300, -200, ORG, 44),
    tag("tope", at("girando el volante de un tope", 377), 377.9, 960, 520, "DE UN TOPE AL OTRO", 300, -200, GREEN, 54, "CON EL MOTOR EN MARCHA"),
    stamp("calib", at("se calibra en el taller", 384), me(378.0) - 0.1, "SI NO SE APAGA: TALLER", 1350, 880, COL.red, 70),
    // --- ADVERTENCIA 3 ---
    o(T.adv3, at("airbag las bolsas", 389), (t) => <ErrorCard key="a3" t={t} at={T.adv3} out={at("airbag las bolsas", 389) - 0.1} n={3} of={4} tx="EL AIRBAG" head="ADVERTENCIA" />),
    stamp("seria", at("y esta es la mas seria", 386) + 0.2, at("airbag las bolsas", 389) - 0.1, "LA MÁS SERIA", 1400, 880, COL.red, 90),
    big("res", at("tienen su propia reserva", 390), 394.3, "TIENE SU PROPIA RESERVA DE ENERGÍA", 540, 68, ORG, "#4a2000", "AUNQUE DESCONECTES LA BATERÍA"),
    o(me(394.4), 411.1, (t) => <MaxTimer key="esp" t={t} at={me(394.4) + 0.1} out={411.0} x={560} y={480} label="⏱" sub="ESPERA LO QUE DICE EL MANUAL" col={YEL} fill={4} />),
    tag("cerca", at("cerca del volante del tablero", 400), 411.1, 1300, 760, "VOLANTE · TABLERO · ASIENTOS", 0, -1, COL.ink, 46),
    stamp("notoca", at("no se desenchufa", 416), 427.8, "NO SE TOCA", 1400, 860, COL.red, 110),
    tag("amar", me(411.2) + 0.2, T.reconectes - 0.1, 900, 600, "CONECTORES AMARILLOS", 300, -220, YEL, 54, "BAJO LOS ASIENTOS · COLUMNA"),
    tag("nadie", T.reconectes + 0.2, 427.8, 900, 520, "NADIE ADENTRO · LLAVE AFUERA", 300, -200, GREEN, 48),
    o(me(427.9), T.pag39 - 0.05, (t) => <VsCard key="luzab" t={t} at={me(427.9) + 0.05} out={T.pag39 - 0.2} y={540}
      l={{ h: "SE PRENDE Y SE APAGA", rows: [{ at: me(427.9) + 0.4, tx: "TODO BIEN" }] }}
      r={{ h: "SE QUEDA PRENDIDA", rows: [{ at: at("si se queda prendida", 431), tx: "VIO ALGO RARO" }, { at: at("ya no es para hacerlo", 434), tx: "NO ES PARA LA CASA" }] }} />),
    o(T.pag39, 442.6, (t) => <Libro key="lib39" t={t} at={T.pag39 + 0.05} openAt={T.pag39 + 0.2} out={442.5} page={39} hl={{ at: at("la lista de cuando llevarlo", 440), x: 0.07, y: 0.13, w: 0.86, h: 0.4 }} />),
    stamp("2da", at("no hay segunda", 447), me(442.7) - 0.1, "NO HAY SEGUNDA OPORTUNIDAD", 1250, 880, COL.red, 66),
    // --- ADVERTENCIA 4 ---
    o(T.adv4, at("hibrido", 454), (t) => <ErrorCard key="a4" t={t} at={T.adv4} out={at("hibrido", 454) - 0.1} n={4} of={4} tx="NO TODOS LOS AUTOS SON IGUALES" head="ADVERTENCIA" />),
    tag("nar", at("los cables naranjas", 456), 459.3, 960, 520, "CABLES NARANJAS: ALTO VOLTAJE", 300, -200, ORG, 48, "NO SE TOCAN NUNCA"),
    big("12v", at("la de 12 voltios", 461), me(459.4) - 0.1, "LA CHICA, DE 12 V", 200, 84, YEL, "#5a4500", undefined, 1350),
    tag("caju", T.cajuela + 0.2, T.europeo - 0.1, 960, 520, "EN LA CAJUELA O BAJO UN ASIENTO", 300, -200, COL.ink, 44),
    o(T.europeo, 476.4, (t) => <Rows key="ojo" t={t} title="FÍJATE EN EL MANUAL ANTES SI…" x={960} y={560} out={476.3} rows={[
      { at: T.europeo + 0.2, ic: "🇪🇺", tx: "ES EUROPEO Y MODERNO" }, { at: at("apaga el motor en los semaforos", 471), ic: "🚦", tx: "APAGA EL MOTOR EN LOS SEMÁFOROS" },
      { at: at("se registre con un", 476), ic: "💻", tx: "LA BATERÍA NUEVA SE REGISTRA" }]} />),
    big("norompe", at("no lo rompe", 481), me(476.5) - 0.1, "10 MINUTOS NO LO ROMPEN", 200, 80, GREEN, "#0a3a1a", undefined, 1300),
    big("amigo", at("es tu mejor amigo", 484), T.suscr - 0.1, "EL MANUAL DEL AUTO: TU MEJOR AMIGO", 540, 76, YEL, "#5a4500"),
    // --- CTA 2 ---
    o(T.suscr, 492.8, (t) => <Subscribe key="sub" t={t} at={T.suscr} clickAt={at("al canal", 488) + 0.1} out={492.7} y={560} />),
    o(me(492.9), 509.0, (t) => <Libro key="lib58" t={t} at={me(492.9) + 0.05} openAt={1e9} out={508.9} page={23} x={700} />),
    big("58", at("tienes 58 trucos", 498), 509.0, "58 TRUCOS DE TALLER", 200, 78, YEL, "#5a4500", undefined, 1340),
    big("most", at("lo que tienes que decir", 503), 509.0, "LO QUE DICES EN EL MOSTRADOR", 820, 60, COL.ink, "#1c2a3a", undefined, 1340),
    big("rev", at("por menos de lo que", 508), me(509.1) - 0.1, "MENOS QUE UNA SOLA REVISIÓN", 200, 80, GREEN, "#0a3a1a", undefined, 1300),
    o(T.link2, me(509.1), (t) => <Desc key="d2" t={t} at={T.link2} out={me(509.1) - 0.15} />),
    // --- EL PASO A PASO ---
    o(me(509.1), T.paso1 + 0.4, (t) => <StepPlate key="pap" t={t} at={me(509.1) + 0.1} out={T.paso1 + 0.2} n="EL PASO" tx="A PASO" y={500} />),
    o(T.paso1 + 0.4, 525.0, (t) => <KitTray key="ap" t={t} out={524.9} y={110} items={[
      { at: at("la llave afuera", 518), ic: "🔑", tx: "LLAVE AFUERA" }, { at: at("las luces apagadas", 519), ic: "💡", tx: "LUCES" }, { at: at("radio apagada", 521), ic: "📻", tx: "RADIO" }, { at: at("las puertas cerradas", 522), ic: "🚪", tx: "PUERTAS" }]} />),
    big("p1", T.paso1 + 0.4, 525.0, "PASO 1 · TODO APAGADO", 880, 76, GREEN, "#0a3a1a"),
    big("prox", T.proxi, me(525.1) - 0.1, "¿LLAVE DE PROXIMIDAD?", 200, 84, YEL, "#5a4500", undefined, 1300),
    o(me(525.1), T.paso2, (t) => <KitTray key="prx" t={t} out={T.paso2 - 0.2} y={560} items={[
      { at: at("deja una ventanilla", 530), ic: "🪟", tx: "UNA VENTANILLA ABIERTA" }, { at: at("o la llave en tu bolsillo", 532), ic: "👖", tx: "LA LLAVE EN TU BOLSILLO" }]} />),
    big("trab", at("hay autos que al reconectar", 535), T.paso2 - 0.1, "HAY AUTOS QUE SE TRABAN SOLOS", 230, 80, COL.red, "#3a0a06", "CON LA LLAVE ADENTRO"),
    o(T.paso2, me(542.9) + 0.5, (t) => inAv(t) ? null : <StepPlate key="p2" t={t} at={T.paso2} out={me(542.9) - 0.1} n="PASO 2" tx="LA HERRAMIENTA" y={500} />),
    big("10mm", at("una llave de 10", 543), me(542.9) - 0.1, "LLAVE DE 10 MM", 200, 100, COL.ice, "#0a2a40", "A VECES 8 O 13", 1300),
    o(me(542.9), T.polvo - 0.05, (t) => <KitTray key="herr" t={t} out={T.polvo - 0.2} y={110} items={[
      { at: me(542.9) + 0.2, ic: "🔧", tx: "LLAVE DE BOCA O ESTRELLA" }, { at: at("unos guantes", 551), ic: "🧤", tx: "GUANTES" }]} />),
    tag("lentes", at("unos lentes porque", 557), 561.1, 960, 480, "LENTES: ESE POLVO ES ÁCIDO", 300, -200, YEL, 48),
    stamp("fumes", at("no fumes cerca", 561), me(561.2) - 0.1, "NO FUMES CERCA", 1400, 860, COL.red, 90),
    tag("bica", T.bicarb + 0.2, 575.4, 960, 520, "AGUA + BICARBONATO + CEPILLO", 300, -200, COL.ice, 46, "TRUCO 10 DEL MANUAL"),
    o(T.paso3, me(575.5) + 0.3, (t) => <StepPlate key="p3" t={t} at={T.paso3} out={me(575.5) - 0.1} n="PASO 3" tx="EL NEGATIVO ( − )" c1={["#cfd6dc", "#59626e"]} y={300} />),
    big("nunca+", at("nunca el positivo", 581), me(575.5) - 0.1, "NUNCA EL POSITIVO", 860, 90, COL.red, "#3a0a06"),
    tag("vueltas", T.aflojas + 0.3, T.sacas - 0.1, 960, 540, "UNAS VUELTAS, NADA MÁS", 300, -200, GREEN, 52),
    o(T.sacas, 593.6, (t) => <Bateria key="bat1" t={t} at={T.sacas + 0.05} offAt={T.sacas + 0.3} out={593.5} note="SIN HACER PALANCA" />),
    stamp("lejos", at("y lo dejas lejos", 589), 593.6, "LEJOS DEL POSTE", 1450, 220, YEL, 74),
    tag("trapo", me(593.7) + 0.3, T.regla - 0.1, 960, 520, "ENVUELTO Y DOBLADO HACIA AFUERA", 300, -200, YEL, 46),
    big("perd", at("no se reinicia nada", 602), T.regla - 0.1, "SI SE APOYA: NO SE REINICIA NADA", 880, 66, COL.red, "#3a0a06"),
    o(T.regla, 610.5, (t) => <Bateria key="bat2" t={t} at={T.regla + 0.05} offAt={-10} out={610.4} spark={at("al mismo tiempo el borne positivo", 608)} note="LA LLAVE NUNCA TOCA + Y METAL A LA VEZ" />),
    big("oro", T.regla + 0.2, 610.5, "LA REGLA DE ORO", 140, 96, YEL, "#5a4500"),
    stamp("quema", at("te puede quemar la mano", 616), me(610.6) - 0.1, "TE QUEMA LA MANO", 1400, 860, COL.red, 84),
    tag("seguro", at("con el negativo afuera", 622), T.primero - 0.1, 960, 520, "NEGATIVO AFUERA: NO PASA NADA", 300, -200, GREEN, 46),
    o(T.primero, 628.8, (t) => <Flow key="ord" t={t} out={628.7} y={540} items={[
      { at: T.primero + 0.2, ic: "−", tx: "EL PRIMERO QUE SALE", col: "#cfd6dc" }, { at: at("y el ultimo que entra", 628), ic: "−", tx: "EL ÚLTIMO QUE ENTRA", col: GREEN }]} />),
    o(T.paso4, me(628.9) + 0.3, (t) => <StepPlate key="p4" t={t} at={T.paso4} out={me(628.9) - 0.1} n="PASO 4" tx="ESPERAR" y={300} />),
    o(me(628.9), 646.2, (t) => <Crono key="c15" t={t} at={me(628.9) + 0.05} runAt={T.espero15} out={646.1} secs={900} dur={7} x={700} sub="15, NO 10" />),
    tag("cond", at("unos condensadores", 640), 646.2, 1420, 760, "CONDENSADORES = PEQUEÑAS BATERÍAS", 0, -1, COL.ice, 42),
    big("2min", at("a los dos minutos", 649), me(646.3) - 0.1, "A LOS 2 MIN: NO BORRASTE NADA", 200, 70, COL.red, "#3a0a06", undefined, 1200),
    big("junt", T.juntes, 661.4, "“JUNTA LOS DOS CABLES”", 260, 90, COL.ink, "#1c2a3a"),
    o(T.juntes, 661.4, (t) => <DrawX key="xj" t={t} at={at("no lo hagas", 656)} x={960} y={300} w={980} h={200} />),
    big("cc", at("es un cortocircuito directo", 660), 661.4, "CORTOCIRCUITO DIRECTO", 640, 100, COL.red, "#3a0a06"),
    tag("limp", at("y mientras tanto limpia los bornes", 665), T.paso5 - 0.1, 960, 520, "MIENTRAS TANTO: LIMPIA LOS BORNES", 300, -200, GREEN, 44),
    o(T.paso5, 677.1, (t) => <Bateria key="bat3" t={t} at={T.paso5 + 0.05} offAt={-10} onAt={at("negativo en su poste", 670)} out={677.0} note="BIEN ABAJO · TUERCA FIRME" />),
    big("p5", T.paso5 + 0.1, 677.1, "PASO 5 · RECONECTAR", 140, 90, GREEN, "#0a3a1a"),
    big("bruto", at("ni flojo ni a lo bruto", 677), me(677.2) - 0.1, "NI FLOJO NI A LO BRUTO", 200, 84, YEL, "#5a4500", undefined, 1300),
    tag("chica", T.chispita + 0.2, T.chispaGrande - 0.1, 960, 520, "CHISPITA CHICA = NORMAL", 300, -200, GREEN, 52, "SE DESPIERTAN LOS MÓDULOS"),
    big("grande", T.chispaGrande + 0.2, 694.2, "CHISPA GRANDE CON RUIDO", 300, 90, COL.red, "#3a0a06", "ALGO QUEDÓ PRENDIDO: LUCES Y PUERTAS"),
    // --- EL REAPRENDIZAJE ---
    big("salt", T.parte, me(694.3) - 0.1, "LA PARTE QUE TODOS SE SALTEAN", 200, 70, YEL, "#5a4500", undefined, 1250),
    o(me(694.3), T.contacto + 0.6, (t) => <StepPlate key="rea" t={t} at={me(694.3) + 0.1} out={T.contacto + 0.4} n="EL REAPRENDIZAJE" tx="CÓMO SE HACE" y={500} />),
    tag("cont", T.contacto + 0.8, 708.4, 960, 480, "CONTACTO SIN ARRANCAR", 300, -200, YEL, 52, "HASTA QUE SE APAGUEN LAS LUCES"),
    stamp("acel", T.acel + 0.2, me(708.5) - 0.1, "NO TOQUES EL ACELERADOR", 1300, 880, COL.red, 70),
    o(me(708.5), T.diezMin, (t) => <KitTray key="apag" t={t} out={T.diezMin - 0.2} y={110} items={[
      { at: at("con el aire acondicionado apagado", 714), ic: "❄", tx: "AIRE APAGADO", no: true }, { at: at("las luces apagadas la radio", 717), ic: "💡", tx: "LUCES", no: true }, { at: at("la radio apagada dejas", 718), ic: "📻", tx: "RADIO", no: true }]} />),
    o(T.diezMin, 725.7, (t) => <Crono key="c10" t={t} at={T.diezMin + 0.05} runAt={T.diezMin + 0.3} out={725.6} secs={600} dur={4} x={560} y={300} sub="EN RALENTÍ" />),
    tag("vent", T.ventilador + 0.3, 725.7, 1300, 760, "HASTA QUE PRENDA EL VENTILADOR", 0, -1, COL.ice, 44),
    big("cero", at("la computadora aprende de cero", 726), me(725.8) - 0.1, "APRENDE DE CERO DÓNDE VA EL RALENTÍ", 200, 60, GREEN, "#0a3a1a", undefined, 1150),
    tag("ruta", T.manejas + 0.3, 741.5, 960, 520, "CIUDAD + UN TRAMO PAREJO", 300, -200, GREEN, 52, "SIN APURARTE"),
    big("dist", at("puede sentirse un poco distinto", 738), 741.5, "LOS PRIMEROS DÍAS SE SIENTE DISTINTO", 880, 60, COL.ink, "#1c2a3a"),
    big("apr2", at("esta aprendiendo de nuevo", 746), me(741.6) - 0.1, "ESTÁ APRENDIENDO", 200, 90, GREEN, "#0a3a1a", undefined, 1350),
    o(me(741.6), T.libreta - 0.05, (t) => <Ecu key="ecu4" t={t} at={me(741.6) + 0.05} resetAt={me(741.6) - 10} learnAt={T.semana} out={T.libreta - 0.2} label="1 SEMANA DE MANEJO" />),
    big("vult", T.ventUlt, T.libreta - 0.1, "Y LAS VENTANILLAS, UNA POR UNA", 900, 66, COL.ice, "#0a2a40"),
    tag("azul", T.libreta + 0.3, 758.4, 960, 520, "LA LIBRETA AZUL", 300, -200, COL.ice, 56, "EL CÓDIGO, ANOTADO ANTES"),
    big("15c", at("15 minutos de cronometro", 763), me(758.5) - 0.1, "15 MIN DE CRONÓMETRO", 200, 84, GREEN, "#0a3a1a", undefined, 1300),
    o(me(758.5), 775.3, (t) => <Aguja key="ag1" t={t} at={me(758.5) + 0.05} out={775.2} calmAt={T.quieta} x={700} />),
    o(me(758.5), 775.3, (t) => <Rows key="hic" t={t} title="LO QUE HICIMOS" x={1450} y={520} out={775.2} sc={0.85} rows={[
      { at: me(758.5) + 0.2, ic: "🧽", tx: "BORNES LIMPIOS" }, { at: at("reconectamos 10 minutos", 766), ic: "🔌", tx: "RECONECTAMOS" }, { at: at("en relenti sin tocar nada", 769), ic: "⏱", tx: "10 MIN EN RALENTÍ" }]} />),
    tag("tint", at("las llaves dejaron de tintinear", 773), 775.3, 700, 300, "LAS LLAVES YA NO TINTINEAN", 300, -150, GREEN, 46),
    big("todo", at("eso era todo", 779), me(775.4) - 0.1, "“¿ESO ERA TODO?”", 200, 96, "#ffd08a", "#4a2a00", undefined, 1350),
    big("sin", at("sin ese arreglo", 785), T.talleres - 0.1, "SIN EL ARREGLO, NO SERVÍA DE NADA", 860, 66, COL.red, "#3a0a06"),
    big("aparte", at("se cobra como un", 795), 791.7, "EN MUCHOS TALLERES: SERVICIO APARTE", 540, 70, YEL, "#5a4500", "EL REAPRENDIZAJE DEL RALENTÍ"),
    tag("esc", at("hay autos que solo", 800), 809.5, 960, 480, "ALGUNOS SÓLO CON ESCÁNER", 300, -200, ORG, 50),
    tag("mismo", at("lo que acabas de ver es lo mismo", 807), 809.5, 960, 480, "EN MUCHOS, ES LO MISMO", -320, 220, GREEN, 50),
    big("preg", T.pregunta + 0.2, me(809.6) - 0.1, "“¿LO APRENDE SOLO O NECESITA ESCÁNER?”", 200, 58, COL.ink, "#1c2a3a", undefined, 1150),
    // --- EL REPASO ---
    o(T.repaso, T.dime - 0.2, (t) => inAv(t) ? null : <Recap key="rcp" t={t} out={T.dime - 0.3} title="EL REPASO DE CLAUDIO" rows={[
      { at: at("despues de un arreglo", 818), tx: "SÓLO DESPUÉS DE UN ARREGLO" }, { at: at("no arregla piezas rotas", 822), tx: "PIEZAS ROTAS O ESCONDER FALLAS", no: true },
      { at: at("antes el codigo de la radio", 826), tx: "ANTES: EL CÓDIGO DE LA RADIO" }, { at: at("la llave afuera del auto", 828), tx: "LA LLAVE AFUERA DEL AUTO" },
      { at: at("de 10 el negativo", 832), tx: "LLAVE DE 10 · EL NEGATIVO PRIMERO" }, { at: at("15 minutos sin juntar", 834), tx: "15 MIN, SIN JUNTAR CABLES" },
      { at: at("reconectar firme nadie", 836), tx: "FIRME · NADIE ADENTRO" }, { at: at("mirar que se apague", 838), tx: "QUE SE APAGUE LA LUZ DEL AIRBAG" },
      { at: at("10 minutos en ralenti sin", 840), tx: "10 MIN EN RALENTÍ, SIN TOCAR" }, { at: at("ensenarle de nuevo a las ventanillas", 843), tx: "REENSEÑAR LAS VENTANILLAS" }]} />),
    o(me(841.9), 858.2, (t) => <Comment key="cmt" t={t} at={me(841.9) + 0.1} typeAt={at("cuentamelo en los", 852) - 0.4} out={858.1} text="Me quedé 3 semanas sin radio 😅 · desde México" x={960} y={560} />),
    big("unico", at("que no eres el unico", 855), 858.2, "NO ERES EL ÚNICO", 860, 90, YEL, "#5a4500"),
    big("pais", at("dime de que pais", 858), me(858.3) - 0.1, "¿DESDE QUÉ PAÍS? ¿QUÉ AUTO?", 200, 76, YEL, "#5a4500", undefined, 1300),
    o(me(858.3), 873.4, (t) => <NextCard key="next" t={t} at={me(858.3) + 0.05} out={873.3} img="img_c_correa.jpg" title="EL CHILLIDO DE LAS MAÑANAS FRÍAS: ¿LA CORREA?" x={1180} y={520} />),
    big("capn", me(858.3) + 0.1, 873.3, "OTRO CAPÍTULO DEL AUTO DE ELENA", 140, 60, "#ffd08a", "#4a2a00", undefined, 760),
    tag("bot", me(873.5) + 0.3, T.linea - 0.1, 960, 520, "LA PRUEBA DE LA BOTELLA DE AGUA", 300, -200, COL.ice, 46, "LA VERDAD EN UN SEGUNDO"),
    big("negro", at("negro primero", 887), 889.5, "NEGRO PRIMERO · NEGRO ÚLTIMO", 540, 96, YEL, "#5a4500"),
    big("libl", T.linea + 0.2, 889.5, "UNA SOLA LÍNEA EN LA LIBRETA", 220, 64, COL.ink, "#1c2a3a"),
    big("apr3", at("a veces solo hay que dejarlos aprender", 893), END, "A VECES SÓLO HAY QUE DEJARLOS APRENDER", 160, 56, COL.ink, "#1c2a3a"),
  ];
};

let SEGS: Seg[] | null = null, OVS: Ov[] | null = null;

export const Rest: React.FC = () => {
  const f = useCurrentFrame(), t = f / 30;
  SEGS = SEGS ?? buildSegs(); OVS = OVS ?? buildOvs();
  let i = 0;
  for (let j = 0; j < SEGS.length; j++) if (SEGS[j].a <= t) i = j;
  const cur = SEGS[i], prev = SEGS[i - 1];
  const base = prev && t < cur.a + D && cur.tr !== "cut" ? <Trans t={t} s={cur} from={prev.base(t)} to={cur.base(t)} /> : cur.base(t);
  const ovs = OVS.filter((x) => t >= x.a - 0.25 && t < x.b + 0.6).map((x, k) => <React.Fragment key={k + "_" + x.a}>{x.n(t)}</React.Fragment>);
  const fade = 0.75 * e(t, FULL_END - 0.6, FULL_END - 0.05); // tope 75 %: a negro pleno el blackframe lo cuenta como cuadro negro
  return (
    <AbsoluteFill style={{ background: "#0b0e13" }}>
      {base}
      {ovs}
      {fade > 0 && <AbsoluteFill style={{ background: "#000", opacity: fade }} />}
    </AbsoluteFill>
  );
};
