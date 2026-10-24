// ctrolla · LOS PLANOS del video entero (0 → END), todos anclados a la VOZ con A("frase") en orden de aparición.
// Cada sección del guion = sus tomas (foto/clip agnes · el laboratorio 3D con la olla · tablero) + sus piezas (FX) con entrada y salida.
// El motor (Body.tsx) resuelve las ventanas del avatar, las transiciones y la cámara única del laboratorio.
import React from "react";
import { PT, win, Ev } from "./cocina3d";
import { BigNum, COL, Chips, DrawX, Flash, FONT, Tag, Thermo, e, extrude, spr } from "./lib";
import { at, Line, Stamp, Sticker, Tablet3D } from "./base";
import { Balance, Book3D, CommentType, DescBox, Dose, EndCard, Equation, ErrorBanner, Habits, Note, Polaroids, RecapRail, SafetyRow, Section, Spent, SubBtn, Verdicts, Versus, WaterGauge } from "./body_fx";
import WORDS from "./words.json";

type V3 = [number, number, number];
export type Pose = { p: V3; l: V3; fov: number };
export type Via = "whip" | "rise" | "zoom" | "portal";
export type Beat = { a: number; k?: string; z?: [number, number]; w?: { A: Pose; B?: Pose; keys?: [number, Pose][]; ev: (t: number) => Partial<Ev> }; board?: boolean; c?: (t: number) => React.ReactNode; via?: Via; q?: V3 | [number, number]; out?: V3 | [number, number] };
type FX = { a: number; b: number; n: (t: number) => React.ReactNode };

const WL = WORDS as { w: string; s: number; e: number }[];
export const END = Math.round((WL[WL.length - 1].e + 1.2) * 30) / 30;

const PAN_TOP: Pose = { p: [0.62, 1.85, 0.9], l: [0.55, 1, 0.22], fov: 34 };
const PAN_SIDE: Pose = { p: [1.05, 1.38, 1.5], l: [0.55, 0.98, 0.3], fov: 36 };
const PAN_CLOSE: Pose = { p: [0.6, 1.72, 0.74], l: [0.55, 1.0, 0.24], fov: 34 };
const CLOCK: Pose = { p: [0.3, 2.32, 1.05], l: [0.22, 2.4, -1.42], fov: 40 };
const RACK: Pose = { p: [1.37, 1.42, 0.35], l: [1.37, 1.28, -1.42], fov: 38 };
const KNOB: Pose = { p: [0.95, 1.5, 1.3], l: [0.55, 0.95, 0.42], fov: 38 };
const WIDE: Pose = { p: [-0.9, 2.3, 3.1], l: [0.3, 1.25, -0.6], fov: 44 };
const SINK: Pose = { p: [-1.0, 1.9, 0.4], l: [-1.35, 0.95, -0.95], fov: 40 };
const LOW: Pose = { p: [1.2, 1.12, 1.0], l: [0.55, 1.02, 0.25], fov: 32 };
const push = (P: Pose, k = 0.1): Pose => ({ p: [P.p[0] + (P.l[0] - P.p[0]) * k, P.p[1] + (P.l[1] - P.p[1]) * k, P.p[2] + (P.l[2] - P.p[2]) * k], l: P.l, fov: P.fov - 2 });
export const CAMSTART = WIDE;

// ---------- anclas en orden: cada A() busca DESPUÉS de la anterior ----------
let CUR = 0;
const A = (f: string) => (CUR = at(f, CUR));
const F = (f: string) => at(f, CUR, true);

export const BEATS: Beat[] = [];
export const FXS: FX[] = [];
const ph = (a: number, k: string, via: Via = "whip", z?: [number, number]) => BEATS.push({ a, k, via, z });
const w3 = (a: number, A0: Pose, ev: (t: number) => Partial<Ev>, via: Via = "zoom", B?: Pose, keys?: [number, Pose][]) => BEATS.push({ a, via, w: { A: A0, B: B ?? push(A0, 0.12), keys, ev }, out: PT.pan });
const bd = (a: number, via: Via = "rise", c?: (t: number) => React.ReactNode) => BEATS.push({ a, board: true, via, c });
const fx = (a: number, b: number, n: (t: number) => React.ReactNode) => FXS.push({ a, b, n });

// ---------- piezas propias de este video ----------
const StepTitle: React.FC<{ t: number; at: number; out: number; n: number; text: string; col?: string }> = ({ t, at: a, out, n, text, col = COL.amber }) => {
  const k = Math.min(1.1, spr(t, a, 0.9)), o = e(t, a, a + 0.1) * (1 - e(t, out, out + 0.25));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 70, top: 70, opacity: o, display: "flex", alignItems: "center", gap: 22, transform: `translateX(${(1 - Math.min(1, k)) * -500}px)` }}>
      <div style={{ width: 130, height: 130, borderRadius: 30, background: col, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: n > 9 ? 78 : 96, color: "#1b1205", boxShadow: "0 20px 40px rgba(0,0,0,.6), inset 0 -8px 0 rgba(0,0,0,.2)", transform: `rotate(${(1 - Math.min(1, k)) * -90}deg)` }}>{n}</div>
      <div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, letterSpacing: 6, color: col, textShadow: "0 2px 10px #000, 0 0 3px #000" }}>{n} DE 12</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 66, color: COL.ink, textShadow: extrude(7, "rgba(0,0,0,.6)"), whiteSpace: "nowrap" }}>{text}</div>
      </div>
    </div>
  );
};
// los 12 casilleros (gancho de la promesa y re-ganchos): se van prendiendo; el 12 queda con candado
const Grid12: React.FC<{ t: number; at: number; out: number; on: number[]; lock?: boolean }> = ({ t, at: a, out, on, lock = true }) => {
  const o = e(t, a - 0.2, a + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 22, padding: "0 300px", opacity: o, perspective: 1400 }}>
      {Array.from({ length: 12 }, (_, i) => {
        const k = Math.min(1, spr(t, a + i * 0.06, 0.9)), lit = on[i] !== undefined ? e(t, on[i], on[i] + 0.2) : 0, last = i === 11 && lock;
        return <div key={i} style={{ width: 190, height: 150, borderRadius: 22, background: last ? "#2a1a0a" : lit > 0.5 ? COL.amber : "rgba(20,26,34,.82)", border: `4px solid ${last ? COL.amber : "rgba(255,255,255,.55)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 80, color: lit > 0.5 && !last ? "#1b1205" : "#fff", boxShadow: "0 20px 40px rgba(0,0,0,.55)", transform: `rotateX(${(1 - k) * 90}deg) scale(${1 + lit * 0.06 * (1 - e(t, on[i] + 0.3, on[i] + 0.8))})` }}>{last ? "?" : i + 1}</div>;
      })}
    </div>
  );
};
// imán: el fondo de la olla con el imán que cae y se pega (o se resbala)
const Magnet: React.FC<{ t: number; at: number; out: number; stick: boolean; x?: number; y?: number; label: string }> = ({ t, at: a, out, stick, x = 1460, y = 470, label }) => {
  const o = e(t, a - 0.1, a + 0.1) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  const d = Math.min(1, spr(t, a, 0.8)), slip = stick ? 0 : e(t, a + 0.7, a + 1.5) * 260;
  return (
    <div style={{ position: "absolute", left: x - 210, top: y - 210, width: 420, height: 420, opacity: o }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: stick ? "radial-gradient(circle at 35% 30%,#f2f4f6,#9aa1a8 70%,#6b7178)" : "radial-gradient(circle at 35% 30%,#e3e5e8,#b9bdc2 70%,#8e9298)", boxShadow: "0 30px 70px rgba(0,0,0,.6), inset 0 0 0 10px rgba(255,255,255,.25)" }} />
      <div style={{ position: "absolute", left: 150, top: 120 + (1 - d) * -400 + slip, width: 120, height: 130, borderRadius: "60px 60px 14px 14px", background: "linear-gradient(90deg,#d7262e 0 30%,transparent 30% 70%,#d7262e 70%)", borderTop: "40px solid #d7262e", transform: `rotate(${slip / 8}deg)` }} />
      <div style={{ position: "absolute", left: -60, right: -60, top: 440, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 52, color: stick ? "#9df0b4" : COL.amber, textShadow: extrude(6, "#000"), opacity: e(t, a + 0.5, a + 0.8) }}>{label}</div>
    </div>
  );
};
// lista que se va tildando (herramientas)
const ToolList: React.FC<{ t: number; items: { at: number; text: string }[]; out: number }> = ({ t, items, out }) => {
  const o = e(t, items[0].at - 0.3, items[0].at) * (1 - e(t, out, out + 0.3));
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 1040, top: 110, width: 780, padding: "30px 40px", borderRadius: 26, background: "#f4efe6", boxShadow: "0 40px 80px rgba(0,0,0,.6)", opacity: o, transform: "rotate(2deg)" }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: "#8a5a1a", marginBottom: 10 }}>LO QUE NECESITAS</div>
      {items.map((it, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, margin: "8px 0", opacity: e(t, it.at, it.at + 0.15) }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, border: "4px solid #1b1205", display: "flex", alignItems: "center", justifyContent: "center", color: "#2a9a52", fontFamily: FONT, fontWeight: 900, fontSize: 36 }}>{e(t, it.at + 0.2, it.at + 0.35) > 0.5 ? "✓" : ""}</div>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "#1b1205" }}>{it.text}</div>
      </div>)}
    </div>
  );
};

// ======================================================================
// HOOK
// ======================================================================
{
  const pas = A("una sola pastilla"), diez = A("y diez minutos"), neg = A("lo negro de diez"), sin = A("sin fibra de alambre"), mira = A("mira"), est = A("estás en la cocina"),
    gano = A("te ganó el sueño"), olor = A("y de repente"), cor = A("corres"), cos = A("una costra negra"), ani = A("con un anillo"), rem = A("la dejas en remojo"),
    tal = A("a la mañana tallas"), gua = A("y la guardas"), tir = A("o la tiras"), noes = A("no es que no"), nad = A("nadie te explicó"), cua = A("y cuando sabes");
  fx(pas, diez + 1.5, (t) => <Tablet3D t={t} at={pas + 0.2} x={1420} y={380} sc={0.9} out={diez + 1.2} />);
  w3(diez, PAN_SIDE, (t) => ({ water: 1, tab: 1, tabDrop: win(t, diez + 0.2, diez + 0.8), flame: win(t, diez + 0.5, diez + 1), foam: win(t, diez + 1, neg) * 0.6, steam: win(t, diez + 1.2, neg) }), "portal");
  fx(diez, neg - 0.1, (t) => <Line t={t} at={diez + 0.1} out={neg - 0.2} text="1 PASTILLA + 10 MIN DE FUEGO BAJITO" y={130} size={64} col={COL.amber} />);
  w3(neg, PAN_CLOSE, (t) => ({ water: 1 - win(t, neg + 0.5, sin), tab: 0, tabDrop: 1, lift: win(t, neg + 0.3, sin + 0.5), crust: 1 - win(t, neg + 1, sin + 1) * 0.8, steam: 0.4 }), "zoom", PAN_TOP);
  fx(neg, sin - 0.1, (t) => <Tag t={t} at={neg + 0.3} x={960} y={560} dx={-280} dy={-220} text="10 AÑOS DE NEGRO" sub="SE CAE SOLO" col={COL.amber} out={sin - 0.2} size={56} />);
  ph(sin, "o_alambre", "whip");
  fx(sin, mira, (t) => <DrawX t={t} at={sin + 0.4} x={420} y={240} w={1080} h={600} />);
  fx(sin + 0.8, mira, (t) => <Stamp t={t} at={sin + 0.9} text="SIN TALLAR · SIN COMPRAR NADA" x={960} y={900} rot={-3} size={70} out={mira - 0.2} />);
  ph(est, "o_frijoles_humo", "rise");
  ph(gano, "o_sofa", "whip");
  fx(gano, olor, (t) => <Sticker t={t} at={gano + 0.2} out={olor - 0.1} x={1450} y={300} icon="luna" text="TE GANÓ EL SUEÑO" col="#3a4f8f" />);
  w3(olor, KNOB, (t) => ({ flame: 1 - win(t, cor, cor + 0.5), smoke: win(t, olor, olor + 1) * (1 - win(t, cos, cos + 1)), crust: 1 }), "zoom");
  ph(cos, "o_costra", "zoom");
  fx(cos, ani, (t) => <Stamp t={t} at={A_("dura como piedra", cos)} text="DURA COMO PIEDRA" x={1350} y={300} rot={7} size={96} out={ani - 0.2} />);
  ph(ani, "o_anillo", "whip");
  ph(rem, "o_remojo", "rise");
  fx(rem, tal, (t) => <Sticker t={t} at={rem + 0.3} out={tal - 0.1} x={1450} y={300} icon="luna" text="TODA LA NOCHE" col="#3a4f8f" />);
  ph(tal, "c_tallar", "whip");
  fx(tal, gua, (t) => <Sticker t={t} at={tal + 0.4} out={gua - 0.1} x={1430} y={300} icon="reloj" text="MEDIA HORA" col="#8f5a2a" />);
  ph(gua, "o_mueble", "zoom");
  ph(tir, "c_guarda", "whip");
  w3(noes, WIDE, () => ({ day: 0.35, crust: 1 }), "zoom", push(WIDE, 0.25));
  fx(nad, cua, (t) => <Line t={t} at={nad} out={cua - 0.1} text="NADIE TE EXPLICÓ QUÉ ES ESO NEGRO" y={880} size={64} col={COL.amber} />);
  w3(cua, PAN_CLOSE, (t) => ({ water: 0.6, tabDrop: 1, lift: win(t, cua, cua + 3), crust: 1 - win(t, cua + 0.5, cua + 3) * 0.6 }), "zoom");
}
function A_(f: string, desde: number) { return at(f, desde); }

// ======================================================================
// PROMESA (12 cosas)
// ======================================================================
{
  const hoy = A("hoy te voy a contar"), que = A("qué es de verdad"), com = A("cómo saber qué olla"), cua = A("cuánta agua"), los = A("los diez minutos que"), lev = A("cómo se levanta sin"),
    dif = A("y después las ollas difíciles"), fri = A("la de los frijoles"), lec = A("la de la leche"), arr = A("la del arroz"), azu = A("la del azúcar"), pel = A("la de peltre"),
    exp = A("la olla exprés"), fon = A("y el fondo de afuera"), doce = A("y la número doce"), nad = A("es la que nadie hace"), err = A("los cinco errores"), cue = A("y hacemos las cuentas");
  bd(hoy, "rise");
  fx(hoy, doce - 0.2, (t) => <Grid12 t={t} at={hoy + 0.2} out={doce - 0.3} on={[que, com, cua, los, lev, fri, lec, arr, pel, exp, fon]} />);
  fx(azu, pel, (t) => <Line t={t} at={azu} out={pel - 0.1} text="+ EL AZÚCAR HECHO CARAMELO" y={900} size={56} col={COL.amber} />);
  fx(dif, doce - 0.2, (t) => <Line t={t} at={dif} out={doce - 0.3} text="LAS OLLAS DIFÍCILES, UNA POR UNA" y={150} size={60} />);
  w3(doce, CLOCK, (t) => ({ rem: 600, glow: win(t, doce, doce + 1) * 0.5 }), "zoom");
  fx(doce, err - 0.1, (t) => <BigNum t={t} at={doce + 0.2} text="#12" sub="LA QUE NADIE HACE" y={860} size={170} col={COL.amber} edge="#5a3a10" out={err - 0.2} />);
  fx(nad, err, (t) => <Flash t={t} at={nad} peak={0.35} />);
  bd(err, "whip");
  fx(err, cue + 3, (t) => <Chips t={t} at={err + 0.2} items={["5 ERRORES", "LAS PREGUNTAS", "LAS CUENTAS"]} out={cue + 2.5} y={520} />);
}

// ======================================================================
// AVISO
// ======================================================================
{
  const av = A("un aviso antes"), gu = A("guantes de goma siempre"), irr = A("irrita la piel"), ven = A("ventana abierta"), ni = A("fuera del alcance"), mez = A("y no lo mezcles"),
    clo = A("ni cloro"), vin = A("ni vinagre"), lim = A("ni el limpiador"), sol = A("la pastilla sola"), seg = A("y así de seguro");
  ph(gu, "c_guantes", "rise");
  fx(irr, ven, (t) => <Tag t={t} at={irr} x={1100} y={420} dx={240} dy={-180} text="IRRITA PIEL Y OJOS" col="#ffd34d" out={ven - 0.2} size={48} />);
  ph(ven, "c_ventana", "whip");
  ph(ni, "o_nino", "zoom");
  fx(ni, mez, (t) => <Tag t={t} at={ni + 0.4} x={900} y={520} dx={-260} dy={-200} text="PARECEN DULCES" col={COL.red} out={mez - 0.2} size={54} />);
  ph(mez, "o_nomezcla", "whip");
  fx(clo, sol, (t) => <><Stamp t={t} at={clo} text="NI CLORO" x={480} y={300} rot={-8} size={84} out={sol - 0.35} /><Stamp t={t} at={vin} text="NI VINAGRE" x={1420} y={330} rot={6} size={84} out={sol - 0.35} /><Stamp t={t} at={lim} text="NI LIMPIAHORNOS" x={960} y={820} rot={-4} size={84} out={sol - 0.35} /></>);
  ph(sol, "o_pastillas", "rise");
  fx(gu, seg + 1.5, (t) => <SafetyRow t={t} items={[{ at: gu, icon: "guante", text: "GUANTES DE GOMA", col: "#ffd34d" }, { at: ven, icon: "ventana", text: "VENTANA ABIERTA", col: "#8fd6ff" }, { at: mez, icon: "nomezcla", text: "NO MEZCLAR", col: "#ff9a8a" }]} out={seg + 1.2} />);
  void av;
}

// ======================================================================
// INTRO · doña Rosa
// ======================================================================
{
  const con = A("ya me conoces"), tre = A("treinta años de oficio"), fum = A("fumigador"), alb = A("albañil"), man = A("mantenimiento de edificios"), dep = A("me tocaba entregar"),
    sab = A("sabes qué era"), oll = A("ollas quemadas que"), acero = A("ollas de acero buenas"), yo = A("yo mismo tiré"), has = A("hasta que una señora"), ros = A("doña rosa"),
    vio = A("me vio tallando"), rio = A("y se rió"), mu = A("muchacho no la pelees"), met = A("se metió a la cocina"), alos = A("y a los diez minutos"), des = A("desde ese día");
  bd(con, "rise");
  fx(con, dep, (t) => <><BigNum t={t} at={tre} text="30 AÑOS" y={880} size={120} col={COL.amber} edge="#5a3a10" sub="DE OFICIO" out={dep - 0.3} /><Polaroids t={t} items={[{ at: fum, k: "p_fumigador", cap: "fumigador", yr: "'95" }, { at: alb, k: "p_albanil", cap: "albañil", yr: "'04" }, { at: man, k: "p_mantenimiento", cap: "mantenimiento", yr: "'13" }]} out={dep - 0.3} /></>);
  ph(dep, "o_depto", "whip");
  fx(sab, oll, (t) => <Line t={t} at={sab} out={oll - 0.1} text="¿LO QUE MÁS SE TIRABA?" y={130} size={74} />);
  ph(oll, "o_ollas_tiradas", "zoom");
  fx(acero, yo, (t) => <Stamp t={t} at={acero + 0.3} text="TODAVÍA SERVÍAN" x={1300} y={800} rot={-7} size={90} out={yo - 0.2} />);
  ph(yo, "o_basura", "whip");
  ph(has, "c_rosa", "rise");
  fx(ros, vio, (t) => <Tag t={t} at={ros} x={1250} y={380} dx={220} dy={-170} text="DOÑA ROSA" sub="DE LAS DE ANTES" col={COL.amber} out={vio - 0.2} size={54} />);
  ph(vio, "c_patio", "whip");
  fx(rio, met, (t) => <Note t={t} at={mu} out={met - 0.1} text="Muchacho, no la pelees: cocínala." x={1400} y={400} />);
  ph(met, "o_rosa_estufa", "zoom");
  w3(alos, PAN_CLOSE, (t) => ({ water: 0.5, tabDrop: 1, flame: 0.4, lift: win(t, alos + 0.3, des), crust: 1 - win(t, alos + 0.8, des) * 0.7, spat: win(t, alos + 1, des) }), "portal");
  bd(des, "zoom", (t) => <Versus t={t} at={des} out={1e9} l="10 MIN" r="UNA TARDE" />);
}

// ======================================================================
// CTA 1 · el libro, página 13, QR
// ======================================================================
{
  const rap = A("rápido mientras te tengo"), lib = A("lo escribí en un libro"), sel = A("se llama el frasco"), nov = A("noventa y cuatro arreglos"), esa = A("y esa costra marrón"),
    misma = A("la misma que vas"), pag = A("está en la página trece"), cue = A("cuesta menos que"), enl = A("el enlace está en"), esc = A("escanea el cuadrito"), las = A("las doce cosas de hoy"), vam = A("vamos a la estufa");
  ph(rap, "c_libro", "rise");
  fx(rap, lib, (t) => <Line t={t} at={rap} out={lib - 0.1} text="RÁPIDO, MIENTRAS TE TENGO AQUÍ" y={140} size={62} col={COL.amber} />);
  bd(lib, "zoom");
  fx(lib, misma, (t) => <Book3D t={t} at={lib} open={nov} out={misma - 0.2} page="guia_p12.png" label={t > sel ? "EL FRASCO MARRÓN DE CLAUDIO" : undefined} />);
  fx(nov, esa, (t) => <BigNum t={t} at={nov} text="94 ARREGLOS" sub="CADA UNO CON SU MEDIDA" y={900} size={90} col={COL.amber} edge="#5a3a10" out={esa - 0.2} />);
  w3(misma, PAN_TOP, () => ({ crust: 1, day: 0.7 }), "portal");
  fx(misma, pag, (t) => <Tag t={t} at={misma + 0.2} x={960} y={600} dx={-280} dy={-220} text="LA MISMA COSTRA" sub="DE LAS BANDEJAS DEL HORNO" col={COL.amber} out={pag - 0.2} size={52} />);
  bd(pag, "portal");
  fx(pag, cue, (t) => <Book3D t={t} at={pag - 0.2} open={pag + 0.2} out={cue - 0.2} page="guia_p13.png" zoomAt={pag + 1.0} zoom={[0.5, 0.37, 1.7]} mark={[0.06, 0.33, 0.88, 0.09]} markAt={pag + 1.5} label="PÁGINA 13" />);
  fx(cue, enl, (t) => <BigNum t={t} at={cue} text="MENOS QUE" sub="UNA OLLA NUEVA DE LAS BUENAS" y={480} size={150} col={COL.ink} out={enl - 0.2} />);
  fx(enl, vam, (t) => <DescBox t={t} at={enl} qrAt={esc} out={vam - 0.1} />);
  fx(las, vam, (t) => <Line t={t} at={las} out={vam - 0.1} text="LAS 12 COSAS TAMBIÉN ESTÁN AHÍ" y={980} size={46} />);
  w3(vam, WIDE, () => ({ day: 0.8 }), "zoom", PAN_SIDE);
}

// ======================================================================
// 1 · QUÉ ES LO NEGRO
// ======================================================================
{
  const n1 = A("número uno"), sec = A("ahí está todo el secreto"), cua = A("cuando la comida se quema"), az = A("el azúcar"), al = A("el almidón"), gr = A("y la grasa que tiene"), ca = A("casi carbón"),
    peg = A("queda pegado al metal"), pie = A("piensa en los frijoles"), det = A("el detergente de platos no"), fib = A("y la fibra de alambre lo único"), por = A("por eso la olla que tallaste"),
    loq = A("lo que funciona es"), alg = A("algo que lo disuelva"), cal = A("y calor"), pas = A("la pastilla de lavavajillas es justamente"), enl = A("en el lavavajillas la pastilla"), hor = A("una hora"),
    aqu = A("aquí le vamos a dar"), cie = A("esa es toda la ciencia"), mag = A("no hay magia");
  w3(n1, PAN_CLOSE, () => ({ day: 0.7, crust: 1 }), "zoom", PAN_TOP);
  fx(n1, cua + 6, (t) => <StepTitle t={t} at={n1 + 0.1} out={peg - 0.3} n={1} text="QUÉ ES LO NEGRO" />);
  fx(sec, az, (t) => <Line t={t} at={sec} out={az - 0.2} text="AHÍ ESTÁ TODO EL SECRETO" y={880} size={62} col={COL.amber} />);
  fx(az, peg, (t) => <Equation t={t} parts={[{ at: az, text: "AZÚCAR", col: "#ffe1a8" }, { at: al, text: "ALMIDÓN", col: "#f3ead8" }, { at: gr, text: "GRASA", col: "#ffcf7a" }, { at: ca, text: "CARBÓN", col: "#9a9088" }]} out={peg - 0.2} y={790} />);
  ph(ca, "o_carbon", "zoom");
  bd(peg, "rise");
  fx(peg, pie, (t) => <Section t={t} at={peg - 0.1} out={pie - 0.3} mode="capas" labels={[peg + 0.3, peg + 0.6, peg + 0.9]} y={600} />);
  ph(pie, "o_frijol_macro", "whip");
  ph(det, "o_detergente", "whip");
  fx(det, fib, (t) => <Line t={t} at={det + 0.3} out={fib - 0.1} text="ES PARA GRASA FRESCA, NO COCINADA" y={130} size={58} col={COL.amber} />);
  ph(fib, "o_rayas", "zoom");
  fx(fib, por + 3, (t) => <Stamp t={t} at={fib + 1} text="SÓLO RAYA" x={1350} y={300} rot={7} size={100} out={loq - 0.2} />);
  fx(por, loq, (t) => <Tag t={t} at={por + 0.3} x={960} y={560} dx={-280} dy={210} text="EN LA RAYA SE PEGA MÁS" col={COL.red} out={loq - 0.2} size={50} />);
  w3(loq, PAN_SIDE, (t) => ({ water: win(t, alg - 0.3, alg + 0.3), tab: win(t, alg, alg + 0.3), tabDrop: win(t, alg + 0.2, alg + 0.7), flame: win(t, cal, cal + 0.4), foam: win(t, cal + 0.4, pas + 4) * 0.5, steam: win(t, cal + 0.6, pas + 4) }), "whip");
  fx(loq, enl, (t) => <><Line t={t} at={loq} out={alg - 0.1} text="ABLANDAR EL PEGAMENTO" y={130} size={74} col="#9df0b4" /><Equation t={t} parts={[{ at: alg, icon: "pastilla", text: "DISUELVE", col: "#d9ecff" }, { at: cal, icon: "llama", text: "CALOR", col: "#ffcf7a" }, { at: pas, text: "SE DESPEGA", col: "#9df0b4" }]} out={enl - 0.2} y={800} /></>);
  ph(enl, "o_lavavajillas", "whip");
  fx(hor, aqu, (t) => <><Sticker t={t} at={hor} out={aqu - 0.3} x={1420} y={300} icon="reloj" text="UNA HORA" col="#2f5f8f" /><Thermo t={t} at={hor + 0.5} x={1650} y={600} from={20} to={65} out={aqu - 0.3} /></>);
  w3(aqu, PAN_SIDE, (t) => ({ water: 1, tab: 1 - win(t, aqu, aqu + 3) * 0.6, tabDrop: 1, flame: 1, foam: 0.6, steam: 0.8, glow: 0.3 }), "portal", PAN_CLOSE);
  fx(aqu, cie, (t) => <Tag t={t} at={aqu + 0.3} x={960} y={600} dx={-280} dy={-200} text="LO MISMO, EN LA ESTUFA" col={COL.amber} out={cie - 0.2} size={52} />);
  fx(cie, mag + 3, (t) => <Line t={t} at={cie} out={mag + 2.5} text={t < mag ? "ESA ES TODA LA CIENCIA" : "CALOR Y PACIENCIA"} y={880} size={74} col={COL.amber} />);
}

// ======================================================================
// 2 · QUÉ OLLA TIENES · el imán
// ======================================================================
{
  const n2 = A("número dos"), nad = A("esto nadie lo dice"), aga = A("agarra un imán"), sip = A("si se pega"), ace = A("es acero inoxidable"), mej = A("esa es la mejor"),
    nop = A("si el imán no se pega"), alu = A("casi seguro es aluminio"), las = A("las ollas de frijoles de toda"), man = A("se mancha oscuro"), asi = A("así que en aluminio"),
    pel = A("si es de peltre"), anti = A("si es antiadherente"), sale = A("la quemada sale fácil"), ray = A("si la rayas"), hie = A("si es de hierro fundido"), oxi = A("se te oxida"),
    bar = A("y si es de barro"), jab = A("te saben a jabón"), uni = A("un imán y un minuto"), arr = A("ya no arruinas");
  w3(n2, RACK, (t) => ({ rackHi: 1, mag: win(t, aga, sip) }), "zoom", push(RACK, 0.18));
  fx(n2, aga, (t) => <><StepTitle t={t} at={n2 + 0.1} out={aga + 3} n={2} text="QUÉ OLLA TIENES" col={COL.ice} /><Line t={t} at={nad} out={aga - 0.1} text="LO MÁS IMPORTANTE DEL VIDEO" y={880} size={66} col={COL.amber} /></>);
  ph(aga, "c_iman", "rise");
  fx(sip, nop, (t) => <Magnet t={t} at={sip} out={nop - 0.2} stick label={t > ace ? "ACERO INOXIDABLE ✓" : "SE PEGA"} />);
  fx(mej, nop, (t) => <Line t={t} at={mej} out={nop - 0.2} text="LA MEJOR PARA ESTE TRUCO" y={140} size={60} col="#9df0b4" />);
  ph(nop, "c_iman_alu", "whip");
  fx(nop, las, (t) => <Magnet t={t} at={nop + 0.3} out={las - 0.2} stick={false} x={1460} label="ALUMINIO" />);
  ph(las, "o_tipos", "zoom");
  ph(man, "o_alu_negro", "whip");
  fx(man, pel, (t) => <><Tag t={t} at={man + 0.2} x={900} y={520} dx={-240} dy={200} text="SE PONE GRIS NEGRO" col={COL.amber} out={pel - 0.2} size={52} /><Stamp t={t} at={asi} text="SIN PASTILLA · PUNTO 10" x={960} y={220} rot={-5} size={80} out={pel - 0.2} /></>);
  bd(pel, "rise");
  fx(pel, anti, (t) => <BigNum t={t} at={pel + 0.1} text="PELTRE" sub="CON CUIDADO · PUNTO 9" y={520} size={170} col={COL.ice2} edge="#26405a" out={anti - 0.2} />);
  ph(anti, "o_teflon", "whip");
  fx(sale, hie, (t) => <><Chips t={t} at={sale} items={["AGUA TIBIA", "UNA GOTA DE JABÓN"]} out={hie - 0.1} y={820} /><Stamp t={t} at={ray} text="SIN RASPAR" x={560} y={300} rot={-8} size={90} out={hie - 0.2} /></>);
  ph(hie, "o_hierro_oxido", "zoom");
  fx(oxi, bar, (t) => <Stamp t={t} at={oxi} text="NUNCA · SE OXIDA" x={1300} y={320} rot={6} size={96} out={bar - 0.2} />);
  ph(bar, "o_barro", "whip");
  fx(jab, uni, (t) => <Tag t={t} at={jab} x={900} y={560} dx={260} dy={-200} text="SABOR A JABÓN" col={COL.red} out={uni - 0.2} size={54} />);
  bd(uni, "zoom");
  fx(uni, arr + 4, (t) => <Verdicts t={t} items={[{ at: uni + 0.1, k: "c_iman", name: "ACERO", v: "SÍ", ok: 1 }, { at: uni + 0.4, k: "o_alu_negro", name: "ALUMINIO", v: "VINAGRE", ok: 0.5 }, { at: uni + 0.7, k: "o_hierro_oxido", name: "HIERRO", v: "NUNCA", ok: 0 }, { at: uni + 1.0, k: "o_barro", name: "BARRO", v: "NUNCA", ok: 0 }]} out={arr + 3.5} />);
}

// ======================================================================
// 3 · EL AGUA Y LA PASTILLA
// ======================================================================
{
  const n3 = A("número tres"), pon = A("pones la olla en la estufa"), ech = A("le echas agua de la llave"), dos = A("uno o dos dedos"), sil = A("si la llenas hasta arriba"), mit = A("trabaja la mitad"),
    ani = A("si la olla tiene el anillo"), ypo = A("y pones una sola pastilla"), cen = A("en el centro"), pel = A("si es de las que vienen"), env = A("si viene envuelta"), dia = A("para la olla de todos los días"),
    gra = A("para una olla grande"), ych = A("y para una olla chica"), par = A("la partes con un cuchillo"), loq = A("lo que hace casi todo el mundo es echar"), no = A("no la pastilla sola"), mez = A("mezclar productos");
  w3(n3, PAN_SIDE, () => ({}), "portal");
  fx(n3, ech, (t) => <StepTitle t={t} at={n3 + 0.1} out={ech + 2} n={3} text="EL AGUA Y LA PASTILLA" col={COL.ice} />);
  ph(ech, "c_agua", "whip");
  ph(dos, "o_dedos", "zoom");
  fx(dos, ani, (t) => <WaterGauge t={t} at={dos + 0.1} bad={sil} out={ani - 0.3} x={1560} />);
  ph(sil, "o_llena", "whip");
  fx(mit, ani, (t) => <Tag t={t} at={mit} x={520} y={820} dx={200} dy={-170} text="TRABAJA LA MITAD" col={COL.red} out={ani - 0.3} size={50} />);
  w3(ani, PAN_CLOSE, (t) => ({ water: win(t, ani, ani + 1.5) * 1.3 }), "zoom");
  ph(ypo, "c_pastilla", "rise");
  w3(cen, PAN_CLOSE, (t) => ({ water: 1, tab: win(t, cen - 0.3, cen), tabDrop: win(t, cen, cen + 0.5) }), "portal", PAN_TOP);
  fx(cen, pel, (t) => <Tag t={t} at={cen + 0.4} x={960} y={600} dx={-280} dy={-220} text="ENCIMA DE LO MÁS QUEMADO" col={COL.ice} out={pel - 0.2} size={50} />);
  ph(env, "o_plastico", "whip");
  fx(env, dia, (t) => <Stamp t={t} at={env + 1} text="EL PLÁSTICO SE SACA" x={1300} y={300} rot={6} size={80} out={dia - 0.2} />);
  bd(dia, "rise");
  fx(dia, loq, (t) => <Dose t={t} rows={[{ at: dia + 0.1, n: 1, text: "LA OLLA DE TODOS LOS DÍAS" }, { at: gra, n: 2, text: "OLLA GRANDE O MUY QUEMADA" }, { at: ych, n: 1, text: "½ · LA OLLA DE LA LECHE" }]} out={loq - 0.2} />);
  ph(gra + 2.5, "o_olla_grande", "whip");
  ph(par, "c_media", "zoom");
  ph(loq, "o_mezcla", "whip");
  fx(no, mez + 4, (t) => <><Stamp t={t} at={no} text="NO" x={1400} y={300} rot={8} size={160} out={mez + 3.5} /><Line t={t} at={mez} out={mez + 3.5} text="LA PASTILLA SOLA, CON EL AGUA" y={900} size={64} col={COL.amber} /></>);
}

// ======================================================================
// 4 · LOS DIEZ MINUTOS
// ======================================================================
{
  const n4 = A("número cuatro"), pre = A("prendes el fuego bajito"), bur = A("burbujitas chiquitas"), noun = A("no un hervor fuerte"), vas = A("vas a ver que la pastilla"), apa = A("aparece una espuma"),
    esa = A("esa espuma es"), alr = A("y al ratito"), raj = A("empiezan a aparecer rajitas"), peg = A("eso es el pegamento"), rel = A("pones el reloj"), ven = A("ventana abierta no te pongas"),
    tet = A("de la tetera"), ypor = A("y por qué bajito"), por = A("porque lo que despega"), unh = A("un hervor fuerte salpica"), baj = A("bajito paciencia"), tap = A("con la tapa puesta");
  w3(n4, KNOB, (t) => ({ water: 1, tabDrop: 1, flame: win(t, pre, pre + 0.6) }), "zoom");
  fx(n4, bur, (t) => <StepTitle t={t} at={n4 + 0.1} out={bur - 0.2} n={4} text="LOS DIEZ MINUTOS" />);
  ph(pre, "c_fuego", "whip");
  ph(bur, "o_hervor_bajo", "zoom");
  fx(noun, vas, (t) => <Stamp t={t} at={noun} text="NO UN HERVOR FUERTE" x={1300} y={300} rot={6} size={80} out={vas - 0.2} />);
  w3(vas, PAN_CLOSE, (t) => ({ water: 1, tabDrop: 1, tab: 1 - win(t, vas, apa), flame: 0.6, foam: win(t, apa - 1, apa + 1) * 0.8, steam: 0.6 }), "portal");
  ph(esa, "o_espuma", "whip");
  fx(esa, alr, (t) => <Line t={t} at={esa} out={alr - 0.1} text="LA PASTILLA TRABAJANDO" y={880} size={66} col={COL.ice} />);
  w3(alr, PAN_TOP, (t) => ({ water: 1, tabDrop: 1, flame: 0.6, foam: 0.6, lift: win(t, raj, peg + 3) * 0.5 }), "zoom");
  ph(raj, "o_rajitas", "zoom");
  fx(peg, rel, (t) => <Tag t={t} at={peg} x={960} y={560} dx={-280} dy={-220} text="SE SUELTA POR DEBAJO" col="#9df0b4" out={rel - 0.2} size={52} />);
  w3(rel, CLOCK, (t) => ({ rem: 600 - Math.max(0, t - rel - 0.5) * 20, hot: 0.4, glow: 0.5 }), "zoom", push(CLOCK, 0.15));
  ph(ven, "c_reloj", "whip");
  ph(tet, "o_tetera", "rise");
  bd(ypor, "zoom", (t) => <Versus t={t} at={ypor} out={1e9} l="BAJITO" r="FUERTE" />);
  w3(por, LOW, (t) => ({ water: 1, flame: 0.5, foam: 0.4, steam: 0.5, lift: win(t, por, unh) * 0.6 }), "portal");
  ph(unh, "o_derrame", "whip");
  fx(baj, tap + 6, (t) => <Chips t={t} at={baj} items={["BAJITO", "PACIENCIA", "EL RELOJ"]} out={tap - 0.2} y={860} />);
  ph(tap, "c_tapa", "zoom");
  fx(tap, tap + 7, (t) => <Tag t={t} at={tap + 1.5} x={960} y={450} dx={-260} dy={-170} text="TAPA CORRIDA" sub="SALE EL VAPOR, NO LA ESPUMA" col={COL.ice} out={tap + 6.5} size={52} />);
}

// ======================================================================
// 5 · CÓMO SE LEVANTA
// ======================================================================
{
  const n5 = A("número cinco"), pasa = A("pasados los diez minutos"), con = A("y con una espátula de madera"), emp = A("empujas lo negro"), loq = A("lo que estaba pegado como piedra"), lam = A("sale en láminas"),
    vas = A("vas a ver aparecer el metal"), nun = A("nunca uses cuchillo"), siq = A("si queda una isla negra"), nol = A("no la pelees le pones"), ahi = A("ahí está el secreto que"), alf = A("al final tiras el agua"), pas = A("y pasas la esponja");
  w3(n5, PAN_TOP, (t) => ({ water: 0.6, tabDrop: 1, flame: 1 - win(t, pasa, pasa + 0.6), foam: 0.3, steam: 0.4 }), "zoom");
  fx(n5, con, (t) => <><StepTitle t={t} at={n5 + 0.1} out={con - 0.2} n={5} text="CÓMO SE LEVANTA" col="#9df0b4" /><Sticker t={t} at={pasa + 1.5} out={con - 0.2} x={1450} y={330} icon="reloj" text="5 MIN A ENTIBIAR" col="#8f5a2a" /></>);
  ph(con, "c_cuchara", "whip");
  w3(emp, PAN_CLOSE, (t) => ({ water: 0.4, tabDrop: 1, spat: win(t, emp, emp + 1), lift: win(t, emp, lam + 2), crust: 1 - win(t, emp + 0.6, lam + 2) * 0.85 }), "portal", PAN_TOP);
  fx(loq, lam, (t) => <Tag t={t} at={loq + 0.3} x={960} y={560} dx={-280} dy={-220} text="SIN FUERZA" sub="DESDE EL BORDE AL CENTRO" col="#9df0b4" out={lam - 0.2} size={52} />);
  ph(lam, "o_laminas", "zoom");
  ph(vas, "c_brillo", "whip");
  ph(nun, "o_cuchillo", "zoom");
  fx(nun, siq, (t) => <DrawX t={t} at={nun + 0.4} x={420} y={240} w={1080} h={600} />);
  w3(siq, PAN_TOP, (t) => ({ crust: 0.15, island: 1 - win(t, nol + 2, ahi) * 0.9, shine: 0.6, water: win(t, nol, nol + 0.5) * 0.4 }), "whip");
  fx(siq, nol, (t) => <Tag t={t} at={siq + 0.4} x={960} y={600} dx={260} dy={-200} text="LA ISLA NEGRA" sub="DONDE PEGABA LA LLAMA" col={COL.amber} out={nol - 0.2} size={50} />);
  ph(nol, "o_isla", "zoom");
  fx(nol, ahi, (t) => <Sticker t={t} at={nol + 1.5} out={ahi - 0.2} x={1450} y={330} icon="reloj" text="+5 MIN" col="#8f5a2a" />);
  bd(ahi, "rise");
  fx(ahi, alf, (t) => <Note t={t} at={ahi + 0.3} out={alf - 0.1} text="La fuerza la hace el calor, no tu brazo." x={960} y={480} rot={-3} />);
  ph(alf, "c_tira", "whip");
  ph(pas, "o_esponja", "zoom");
}

// ======================================================================
// RE-GANCHO 1
// ======================================================================
{
  const has = A("hasta aquí es la base"), och = A("el ochenta por ciento"), per = A("pero ahora viene"), lod = A("lo de los frijoles no"), azu = A("y lo del azúcar"), qued = A("y quédate hasta el punto doce");
  bd(has, "whip");
  fx(has, per, (t) => <BigNum t={t} at={och} text="80 %" sub="DE LAS OLLAS QUEMADAS" y={520} size={240} col="#9df0b4" edge="#1c4a2a" out={per - 0.2} />);
  fx(lod, qued, (t) => <Chips t={t} at={lod} items={["FRIJOLES", "LECHE", "AZÚCAR"]} out={qued - 0.2} y={520} />);
  fx(azu, qued, (t) => <Line t={t} at={azu + 1} out={qued - 0.2} text="…Y UNO SALE SOLO CON AGUA" y={820} size={56} col={COL.amber} />);
  fx(qued, qued + 5, (t) => <Grid12 t={t} at={qued} out={qued + 4.5} on={[0, 0, 0, 0, 0].map((_, i) => qued + 0.2 + i * 0.12)} />);
}

// ======================================================================
// 6 · LOS FRIJOLES · don Ernesto
// ======================================================================
{
  const n6 = A("número seis"), est = A("esta es la más común"), cue = A("te cuento una"), don = A("don ernesto"), dom = A("todos los domingos"), cad = A("y cada tanto"), los = A("los frijoles dejan dos cosas"),
    lac = A("la costra negra del fondo"), yun = A("y un anillo oscuro en la pared"), ese = A("ese anillo es"), par = A("para la olla de frijoles primero"), tir = A("y lo tiras a la basura"),
    des = A("después agua hasta tapar el anillo"), dosp = A("y dos pastillas"), diez = A("diez minutos bajito cinco"), elf = A("el fondo sale primero"), ela = A("el anillo sale después"),
    sie = A("si el anillo se resiste"), apr = A("don ernesto aprendió"), con = A("y el consejo que le di");
  ph(n6, "o_frijoles_olla", "zoom");
  fx(n6, cue, (t) => <StepTitle t={t} at={n6 + 0.1} out={cue - 0.2} n={6} text="LA OLLA DE LOS FRIJOLES" />);
  fx(est, cue, (t) => <Line t={t} at={est} out={cue - 0.2} text="LA MÁS COMÚN · LA QUE MÁS SE TIRA" y={880} size={58} col={COL.amber} />);
  ph(don, "c_ernesto", "rise");
  fx(dom, cad, (t) => <><Tag t={t} at={don + 0.2} x={1200} y={400} dx={220} dy={-170} text="DON ERNESTO" sub="OLLA DE 10 LITROS" col={COL.amber} out={cad - 0.2} size={52} /><Sticker t={t} at={dom + 1.5} out={cad - 0.2} x={1450} y={660} icon="luna" text="LA SIESTA" col="#3a4f8f" /></>);
  w3(los, PAN_SIDE, () => ({ crust: 1, day: 0.7 }), "zoom", PAN_TOP);
  fx(lac, ese, (t) => <><Tag t={t} at={lac} x={960} y={620} dx={-280} dy={200} text="LA COSTRA DEL FONDO" col={COL.amber} out={ese + 3} size={48} /><Tag t={t} at={yun} x={960} y={420} dx={280} dy={-200} text="EL ANILLO DE LA PARED" col={COL.ice} out={ese + 3} size={48} /></>);
  ph(yun + 2, "c_anillo", "whip");
  ph(par, "c_raspa", "zoom");
  fx(tir, des, (t) => <Stamp t={t} at={tir + 0.5} text="A LA BASURA, NO AL FREGADERO" x={960} y={880} rot={-3} size={64} out={des - 0.2} />);
  w3(des, PAN_SIDE, (t) => ({ water: win(t, des, des + 1.5) * 1.3, tab: win(t, dosp, dosp + 0.3), tabDrop: win(t, dosp + 0.2, dosp + 0.8), flame: win(t, diez, diez + 0.5), foam: win(t, diez + 1, elf) * 0.6 }), "portal");
  fx(dosp, elf, (t) => <Dose t={t} rows={[{ at: dosp, n: 2, text: "AGUA HASTA TAPAR EL ANILLO" }]} out={elf - 0.2} />);
  fx(diez, elf, (t) => <Sticker t={t} at={diez + 0.2} out={elf - 0.2} x={1450} y={330} icon="reloj" text="10 + 5 MIN" col="#8f5a2a" />);
  ph(elf, "o_anillo_sale", "zoom");
  ph(sie, "c_costado", "whip");
  fx(sie, apr, (t) => <Sticker t={t} at={sie + 4} out={apr - 0.2} x={1450} y={330} icon="reloj" text="+30 MIN DE COSTADO" col="#2f5f8f" />);
  bd(apr, "rise");
  fx(apr, con + 9, (t) => <><Note t={t} at={apr + 0.3} out={con - 0.1} text="La olla le duró hasta el último día." x={960} y={460} rot={-3} /><Chips t={t} at={con + 2} items={["UN DEDO MÁS DE AGUA", "FUEGO AL MÍNIMO"]} out={con + 8.5} y={540} /></>);
}

// ======================================================================
// 7 · LA LECHE QUE SUBIÓ
// ======================================================================
{
  const n7 = A("número siete"), tra = A("esta es traicionera"), led = A("le das la espalda"), pel = A("película marrón"), lal = A("la leche tiene azúcar"), pega = A("pega como cola"), lob = A("lo bueno es"),
    med = A("media pastilla agua un dedo"), yaq = A("y aquí hay un detalle"), est = A("en la estufa y en la parrilla"), tra2 = A("con un trapo húmedo"), sil = A("si lo dejas"), yel = A("y el olor que queda"),
    cua = A("cuando sale la costra"), yun = A("y un consejo de oficio"), enj = A("siempre enjuagada antes"), esa = A("esa película de agua"), est2 = A("esto me lo enseñó");
  ph(n7, "o_leche_sube", "zoom");
  fx(n7, tra + 3, (t) => <StepTitle t={t} at={n7 + 0.1} out={led - 0.2} n={7} text="LA LECHE QUE SUBIÓ" col={COL.ice} />);
  fx(tra, led, (t) => <Line t={t} at={tra} out={led - 0.1} text="SE QUEMA EN UN SEGUNDO" y={880} size={64} col={COL.amber} />);
  ph(pel, "o_leche_pelicula", "whip");
  bd(lal, "rise");
  fx(lal, lob, (t) => <Equation t={t} parts={[{ at: lal + 0.3, text: "AZÚCAR", col: "#ffe1a8" }, { at: lal + 1.5, text: "PROTEÍNA", col: "#f3ead8" }, { at: pega, text: "COLA", col: "#9a9088" }]} out={lob - 0.2} y={520} />);
  w3(lob, PAN_CLOSE, (t) => ({ water: 0.5, tab: win(t, med, med + 0.3) * 0.5, tabDrop: win(t, med + 0.3, med + 0.8), flame: win(t, med + 1, med + 1.5) * 0.6, lift: win(t, med + 2, yaq) * 0.8, crust: 0.6 }), "portal");
  fx(med, yaq, (t) => <Dose t={t} rows={[{ at: med, n: 1, text: "½ PASTILLA · 5 MIN" }]} out={yaq - 0.2} />);
  ph(est, "o_parrilla", "whip");
  ph(tra2, "c_trapo", "zoom");
  fx(sil, yel, (t) => <Tag t={t} at={sil + 0.5} x={900} y={560} dx={260} dy={-200} text="AL OTRO DÍA SE VUELVE A QUEMAR" col={COL.red} out={yel - 0.2} size={46} />);
  w3(yel, PAN_TOP, (t) => ({ water: 0.5, flame: 0.5, steam: 0.7, lift: win(t, cua, cua + 2), crust: 1 - win(t, cua, cua + 2) * 0.8 }), "zoom");
  fx(cua, yun, (t) => <Line t={t} at={cua} out={yun - 0.1} text="SALE LA COSTRA, SALE EL OLOR" y={140} size={62} col="#9df0b4" />);
  ph(yun, "c_enjuaga_leche", "whip");
  fx(enj, est2 + 4, (t) => <Tag t={t} at={enj + 0.5} x={960} y={500} dx={-260} dy={-200} text="ENJUAGADA CON AGUA FRÍA" sub="SIN SECAR" col={COL.ice} out={est2 + 3.5} size={52} />);
  void esa;
}

// ======================================================================
// 8 · EL ARROZ Y EL CARAMELO
// ======================================================================
{
  const n8 = A("número ocho"), pri = A("te los pongo juntos"), arr = A("el arroz pegado el que"), ese = A("ese sale con la pastilla"), cin = A("cinco minutos bajito y la cuchara"), aho = A("ahora el azúcar"),
    fla = A("caramelo para el flan"), eso = A("eso negro es azúcar quemada"), sor = A("y aquí te voy a sorprender"), dis = A("se disuelve en agua caliente"), lee = A("le echas agua de la llave hasta taparlo"),
    der = A("se va derritiendo"), loq = A("lo que la gente hace es meterle"), no = A("no agua y fuego"), sid = A("si después de eso queda"), con = A("con eso la olla del flan");
  ph(n8, "o_arroz_tapa", "zoom");
  fx(n8, ese, (t) => <StepTitle t={t} at={n8 + 0.1} out={ese - 0.2} n={8} text="EL ARROZ Y EL CARAMELO" />);
  fx(pri, arr, (t) => <Line t={t} at={pri} out={arr - 0.1} text="PRIMOS, PERO SE SACAN DISTINTO" y={880} size={58} col={COL.amber} />);
  ph(ese, "c_arroz", "whip");
  fx(cin, aho, (t) => <Sticker t={t} at={cin} out={aho - 0.2} x={1450} y={330} icon="reloj" text="LA MITAD: 5 MIN" col="#8f5a2a" />);
  ph(fla, "o_flan", "rise");
  ph(eso, "o_caramelo", "zoom");
  fx(sor, lee, (t) => <Stamp t={t} at={sor + 1.5} text="SIN PASTILLA" x={1300} y={300} rot={6} size={100} out={lee - 0.2} />);
  fx(dis, lee, (t) => <Line t={t} at={dis} out={lee - 0.1} text="EL AZÚCAR SE DISUELVE EN AGUA" y={880} size={60} col={COL.ice} />);
  ph(lee, "c_caramelo_agua", "whip");
  ph(der, "o_caramelo_disuelve", "zoom");
  ph(loq, "c_caramelo", "whip");
  fx(loq, no, (t) => <DrawX t={t} at={loq + 1.5} x={420} y={240} w={1080} h={600} />);
  bd(no, "rise");
  fx(no, sid, (t) => <Equation t={t} parts={[{ at: no + 0.2, icon: "agua", text: "AGUA", col: "#d9ecff" }, { at: no + 0.6, icon: "llama", text: "FUEGO", col: "#ffcf7a" }]} out={sid - 0.2} y={500} />);
  w3(sid, PAN_TOP, (t) => ({ crust: 0.1, island: 0.8 - win(t, sid + 4, con) * 0.7, shine: 0.7, water: 0.4, tab: win(t, sid + 3, sid + 3.3), tabDrop: win(t, sid + 3.3, sid + 3.8) }), "portal");
  fx(con, con + 4, (t) => <Line t={t} at={con} out={con + 3.5} text="COMO NUEVA" y={140} size={90} col="#9df0b4" />);
}

// ======================================================================
// CTA 2 · suscribirse + página 34
// ======================================================================
{
  const sil = A("si llegaste hasta aquí"), sus = A("suscríbete"), meg = A("me gusta"), ysi = A("y si en tu casa además"), fue = A("la fuente de vidrio"), pla = A("o los platillos"),
    pag = A("en la página treinta y cuatro"), enl = A("el enlace otra vez"), cua = A("y el cuadrito"), aho = A("ahora vamos con las ollas");
  ph(sil, "c_suscribe", "rise");
  fx(sil, sus, (t) => <Line t={t} at={sil} out={sus - 0.1} text="YA TE AHORRASTE UNA OLLA NUEVA" y={140} size={62} col="#9df0b4" />);
  fx(sus, ysi, (t) => <SubBtn t={t} at={sus - 0.3} press={sus + 0.3} like={meg} out={ysi - 0.3} />);
  ph(fue, "o_fuente", "whip");
  ph(pla, "o_platillos", "zoom");
  bd(pag, "portal");
  fx(pag, enl, (t) => <Book3D t={t} at={pag - 0.2} open={pag + 0.3} out={enl - 0.2} page="guia_p34.png" zoomAt={pag + 1.4} zoom={[0.5, 0.4, 1.6]} label="PÁGINA 34" />);
  fx(enl, aho, (t) => <DescBox t={t} at={enl} qrAt={cua} out={aho - 0.1} />);
  w3(aho, WIDE, () => ({ day: 0.7 }), "zoom", RACK);
}

// ======================================================================
// 9 · EL PELTRE
// ======================================================================
{
  const n9 = A("número nueve"), laes = A("la esmaltada la azul"), esa = A("esa olla no es de metal"), loq = A("y lo que la arruina"), sil = A("si le pegas"), asi = A("así que en peltre"),
    lap = A("la pastilla sí la aguanta"), agu = A("agua tibia una pastilla"), qui = A("quince o veinte minutos"), des = A("después la dejas enfriar sola"), yem = A("y empujas con la madera"),
    sie = A("si el fondo del peltre"), yte = A("y te aviso"), esn = A("esa no es suciedad");
  ph(n9, "o_peltre", "zoom");
  fx(n9, esa, (t) => <StepTitle t={t} at={n9 + 0.1} out={esa - 0.2} n={9} text="LA OLLA DE PELTRE" col={COL.ice} />);
  bd(esa, "rise");
  fx(esa, loq, (t) => <Section t={t} at={esa} out={loq - 0.2} mode="capas" labels={[esa + 0.5, esa + 1.5, esa + 2.5]} y={600} />);
  fx(esa, loq, (t) => <Line t={t} at={esa + 1.5} out={loq - 0.2} text="METAL + UNA CAPA DE VIDRIO" y={140} size={64} col={COL.ice} />);
  ph(sil, "o_peltre_salto", "whip");
  fx(asi, lap, (t) => <><Stamp t={t} at={asi + 0.6} text="NADA DE FIBRA" x={500} y={300} rot={-7} size={74} out={lap - 0.2} /><Stamp t={t} at={asi + 1.4} text="NADA DE GOLPES" x={1420} y={760} rot={6} size={74} out={lap - 0.2} /></>);
  ph(agu, "c_peltre_fuego", "zoom");
  fx(agu, des, (t) => <><Thermo t={t} at={agu + 1} x={1650} y={600} from={20} to={85} out={des - 0.2} /><Sticker t={t} at={qui} out={des - 0.2} x={1400} y={250} icon="reloj" text="15-20 MIN SIN HERVIR" col="#2f5f8f" /></>);
  ph(des, "c_peltre", "whip");
  fx(des, yem, (t) => <Tag t={t} at={des + 1.5} x={960} y={500} dx={-260} dy={-190} text="SE CUARTEA CON EL CAMBIO BRUSCO" col={COL.amber} out={yem - 0.2} size={46} />);
  ph(yte, "o_peltre_amarillo", "zoom");
  fx(esn, esn + 6, (t) => <Tag t={t} at={esn} x={960} y={540} dx={260} dy={-200} text="NO ES SUCIEDAD" sub="NO LA PELEES" col="#9df0b4" out={esn + 5.5} size={52} />);
  void sie;
}

// ======================================================================
// 10 · ALUMINIO Y OLLA EXPRÉS
// ======================================================================
{
  const n10 = A("número diez"), ya = A("ya dijimos que el aluminio"), ent = A("entonces qué se hace"), vin = A("vinagre blanco o limón"), agu = A("agua hasta tapar lo quemado"), med = A("medio vaso de vinagre"),
    jug = A("o el jugo de dos limones"), elac = A("el ácido ablanda"), des = A("después la cuchara de palo"), ojo = A("ojo aquí el vinagre"), yen = A("y en la olla exprés"), seh = A("se hace destapada"),
    lag = A("la goma de la tapa"), ysi = A("y si la olla exprés tiene"), lav = A("las vaporeras de tamales"), asi = A("así las ollas de aluminio");
  w3(n10, RACK, () => ({ rackHi: 1 }), "zoom", push(RACK, 0.15));
  fx(n10, vin, (t) => <StepTitle t={t} at={n10 + 0.1} out={vin - 0.2} n={10} text="ALUMINIO Y OLLA EXPRÉS" />);
  fx(ya, ent, (t) => <Tag t={t} at={ya + 0.5} x={960} y={560} dx={-260} dy={-200} text="CON LA PASTILLA SE MANCHA" col={COL.red} out={ent - 0.2} size={50} />);
  ph(vin, "c_vinagre", "whip");
  bd(agu, "rise");
  fx(agu, elac, (t) => <Dose t={t} rows={[{ at: med, n: 0, text: "½ VASO DE VINAGRE POR LITRO" }, { at: jug, n: 0, text: "…O 2 LIMONES CON CÁSCARA" }]} out={elac - 0.2} />);
  ph(jug + 1.5, "c_limon", "zoom");
  ph(elac, "o_alu_brilla", "whip");
  fx(ojo, yen, (t) => <Stamp t={t} at={ojo + 0.8} text="EL VINAGRE SOLO, SIN PASTILLA" x={960} y={860} rot={-3} size={66} out={yen - 0.2} />);
  ph(yen, "o_presto", "rise");
  ph(seh, "c_presto", "whip");
  fx(seh, lag, (t) => <Stamp t={t} at={seh} text="DESTAPADA" x={1350} y={300} rot={6} size={100} out={lag - 0.2} />);
  ph(lag, "c_goma", "zoom");
  fx(lag, ysi, (t) => <Tag t={t} at={lag + 1.5} x={960} y={560} dx={260} dy={-200} text="A MANO · NUNCA HERVIDAS" col={COL.amber} out={ysi - 0.2} size={50} />);
  ph(lav, "o_vaporera", "whip");
  fx(asi, asi + 4, (t) => <Line t={t} at={asi} out={asi + 3.5} text="VUELVEN A BRILLAR" y={140} size={84} col={COL.ice2} />);
  void des; void ysi;
}

// ======================================================================
// RE-GANCHO 2
// ======================================================================
{
  const ya = A("ya sacamos lo de adentro"), sid = A("si das vuelta tu olla"), esa = A("esa es otra cosa"), ydes = A("y después viene el número doce");
  ph(ya, "c_volteo", "rise");
  ph(sid + 1.2, "o_fondo_afuera", "zoom");
  fx(esa, ydes, (t) => <Line t={t} at={esa} out={ydes - 0.1} text="LA COSTRA DE AFUERA ES OTRA COSA" y={140} size={60} col={COL.amber} />);
  fx(ydes, ydes + 4, (t) => <BigNum t={t} at={ydes + 0.2} text="#12" sub="YA VIENE" y={540} size={200} col={COL.amber} edge="#5a3a10" out={ydes + 3.5} />);
}

// ======================================================================
// 11 · EL FONDO DE AFUERA
// ======================================================================
{
  const n11 = A("número once"), esa = A("esa costra marrón que se forma"), noes = A("no es comida quemada"), esg = A("es grasa que salpicó"), por = A("por eso es lisa"), para = A("para esa haces así"),
    pon = A("pones dos pastillas"), met = A("y metes la olla de cabeza"), sin = A("si no te entra"), des = A("después con la esponja"), vas = A("vas a ver cómo el barniz"), est = A("esto es para acero inoxidable"),
    lav = A("la que es muy vieja"), una = A("una pasta gruesa"), lab = A("y la botella marrón"), lam = A("la misma que uso"), lac = A("la costra muy vieja"), ytd = A("y te digo algo de oficio"), una2 = A("una olla con el fondo limpio");
  ph(n11, "o_barniz", "zoom");
  fx(n11, esg, (t) => <StepTitle t={t} at={n11 + 0.1} out={esg - 0.2} n={11} text="EL FONDO DE AFUERA" />);
  fx(noes, esg, (t) => <Stamp t={t} at={noes} text="NO ES COMIDA" x={1350} y={300} rot={6} size={96} out={esg - 0.2} />);
  bd(esg, "rise");
  fx(esg, para, (t) => <Section t={t} at={esg} out={para - 0.2} mode="barniz" labels={[esg + 0.6, esg + 2, por]} y={600} />);
  ph(para, "c_tina", "whip");
  fx(pon, met, (t) => <Dose t={t} rows={[{ at: pon, n: 2, text: "AGUA BIEN CALIENTE" }]} out={met - 0.2} />);
  ph(met, "o_tina", "zoom");
  fx(met, des, (t) => <Sticker t={t} at={met + 1.5} out={des - 0.2} x={1450} y={330} icon="reloj" text="UNA HORA DE CABEZA" col="#2f5f8f" />);
  fx(sin, des, (t) => <Line t={t} at={sin} out={des - 0.1} text="DE COSTADO: GÍRALA CADA 20 MIN" y={880} size={56} col={COL.amber} />);
  ph(des, "c_circulos", "whip");
  ph(vas, "o_tiritas", "zoom");
  fx(est, lav, (t) => <Stamp t={t} at={est} text="SÓLO ACERO INOXIDABLE" x={960} y={860} rot={-3} size={70} out={lav - 0.2} />);
  bd(lav, "portal");
  fx(lav, una, (t) => <Book3D t={t} at={lav} open={lav + 0.6} out={una - 0.1} page="guia_p13.png" zoomAt={lav + 1.4} zoom={[0.5, 0.37, 1.7]} mark={[0.06, 0.33, 0.88, 0.09]} markAt={lav + 1.8} label="PÁGINA 13" />);
  ph(una, "c_pasta", "whip");
  fx(una, lam, (t) => <Chips t={t} at={una + 0.3} items={["BICARBONATO", "LA BOTELLA MARRÓN (3 %)"]} out={lam - 0.2} y={860} />);
  ph(lam, "o_pasta", "zoom");
  fx(lac, ytd, (t) => <Sticker t={t} at={lac} out={ytd - 0.2} x={1450} y={330} icon="reloj" text="2 O 3 VUELTAS" col="#8f5a2a" />);
  ph(ytd, "o_colgada", "rise");
  fx(una2, una2 + 5, (t) => <Line t={t} at={una2} out={una2 + 4.5} text="PARECE NUEVA AUNQUE TENGA 20 AÑOS" y={140} size={58} col="#9df0b4" />);
  void lab;
}

// ======================================================================
// 12 · EL QUE NADIE HACE
// ======================================================================
{
  const n12 = A("y número doce"), eslo = A("es lo que hacía doña rosa"), tre = A("tenían treinta años"), esel = A("es el minuto después"), cua = A("cuando sirves la comida"), ahi = A("ahí en ese momento"),
    ese = A("ese poquito de agua"), cuat = A("cuando terminas de comer"), loq = A("lo que pasa en casi todas"), yas = A("y así capa por capa"), nos = A("no se hace en un día"), yun = A("y una vez al mes"),
    dec = A("decía que era como lavarle"), ese2 = A("ese es el truco que nadie");
  w3(n12, CLOCK, (t) => ({ rem: 60, glow: win(t, n12, n12 + 1) }), "zoom");
  fx(n12, cua, (t) => <><StepTitle t={t} at={n12 + 0.1} out={cua - 0.2} n={12} text="EL QUE NADIE HACE" col="#9df0b4" /><BigNum t={t} at={tre} text="30 AÑOS" sub="Y PARECÍAN DE LA TIENDA" y={600} size={150} col={COL.amber} edge="#5a3a10" out={esel - 0.2} /></>);
  fx(esel, cua, (t) => <Line t={t} at={esel} out={cua - 0.1} text="EL MINUTO DESPUÉS DE COCINAR" y={880} size={66} col="#9df0b4" />);
  ph(cua, "c_sirve", "whip");
  ph(ahi, "c_chorrito", "zoom");
  w3(ese, PAN_CLOSE, (t) => ({ water: 0.25, hot: 0.6, steam: 0.5, crust: 0.2, lift: win(t, ese, cuat) }), "portal");
  fx(ese, cuat, (t) => <Tag t={t} at={ese + 0.5} x={960} y={600} dx={-280} dy={-200} text="DESPEGA ANTES DE QUE SEA COSTRA" col="#9df0b4" out={cuat - 0.2} size={46} />);
  ph(cuat, "c_lava_rapido", "whip");
  ph(loq, "o_restos", "rise");
  ph(yas, "o_capas", "zoom");
  fx(nos, yun, (t) => <Note t={t} at={nos} out={yun - 0.1} text="No se hace en un día: se hace en mil días de dejarla para después." x={960} y={760} rot={-2} />);
  ph(yun, "o_calendario", "whip");
  ph(yun + 4, "c_mantenimiento", "zoom");
  fx(yun, ese2, (t) => <Dose t={t} rows={[{ at: yun + 3, n: 1, text: "½ PASTILLA · 5 MIN · 1 VEZ AL MES" }]} out={dec - 0.2} />);
  fx(dec, ese2 + 6, (t) => <Line t={t} at={dec} out={ese2 + 5.5} text="COMO LAVARLE LOS DIENTES" y={140} size={72} col={COL.amber} />);
}

// ======================================================================
// LOS 5 ERRORES
// ======================================================================
{
  const y5 = A("y ahora los cinco errores"), e1 = A("el primero dejarla"), enf = A("en frío no pasa"), e2 = A("el segundo echarle"), si = A("sí algo sale"), e3 = A("el tercero"), hac = A("hace un ruido fuerte"),
    des = A("después la olla baila"), sie = A("siempre deja que se entibie"), e4 = A("el cuarto"), ela = A("el agua se evapora"), diez = A("diez minutos el reloj en la mano"), e5 = A("y el quinto"),
    lao = A("la olla de aluminio que queda"), por = A("por eso el imán"), cre = A("créeme");
  ph(y5, "c_errores", "rise");
  ph(e1, "o_agua_fria", "whip");
  fx(e1, e2, (t) => <><ErrorBanner t={t} at={e1 + 0.1} out={e2 - 0.2} n={1} text="TODA LA NOCHE EN AGUA FRÍA" /><Line t={t} at={enf} out={e2 - 0.2} text="LO QUE TRABAJA ES EL CALOR" y={880} size={60} col={COL.amber} /></>);
  bd(e2, "rise");
  fx(e2, e3, (t) => <><ErrorBanner t={t} at={e2 + 0.1} out={e3 - 0.2} n={2} text="SAL GRUESA + FIBRA DE ALAMBRE" /><Tag t={t} at={si + 1} x={960} y={560} dx={-260} dy={-170} text="LO QUE SALE ES EL BRILLO" col={COL.red} out={e3 - 0.2} size={52} /></>);
  ph(e3, "c_choque", "whip");
  fx(e3, sie, (t) => <ErrorBanner t={t} at={e3 + 0.1} out={sie - 0.2} n={3} text="CALIENTE, DIRECTO AL AGUA FRÍA" />);
  fx(hac, des, (t) => <Flash t={t} at={hac} peak={0.45} />);
  w3(des, LOW, () => ({ wobble: 1, flame: 0.7 }), "zoom");
  fx(des, sie, (t) => <Tag t={t} at={des + 0.5} x={960} y={600} dx={-280} dy={-200} text="EL FONDO SE TUERCE" col={COL.red} out={sie - 0.2} size={52} />);
  fx(sie, e4, (t) => <Line t={t} at={sie} out={e4 - 0.1} text="QUE SE ENTIBIE SOLA" y={140} size={74} col="#9df0b4" />);
  ph(e4, "o_seca_pastilla", "whip");
  fx(e4, e5, (t) => <><ErrorBanner t={t} at={e4 + 0.1} out={e5 - 0.2} n={4} text="PRENDER EL FUEGO Y SALIR" /><Sticker t={t} at={diez} out={e5 - 0.2} x={1450} y={330} icon="reloj" text="10 MIN · TÚ AL LADO" col="#8f5a2a" /></>);
  bd(e5, "rise");
  fx(e5, cre, (t) => <ErrorBanner t={t} at={e5 + 0.1} out={cre - 0.2} n={5} text="LA PASTILLA EN TODO, SIN MIRAR" />);
  fx(lao, por, (t) => <Verdicts t={t} items={[{ at: lao, k: "o_alu_negro", name: "ALUMINIO", v: "NEGRA", ok: 0 }, { at: lao + 1.5, k: "o_hierro_oxido", name: "HIERRO", v: "OXIDADA", ok: 0 }, { at: lao + 3, k: "o_barro", name: "BARRO", v: "CON SABOR", ok: 0 }]} out={por - 0.2} />);
  w3(por, RACK, (t) => ({ rackHi: 1, mag: win(t, por, por + 1) }), "zoom");
  fx(cre, cre + 6, (t) => <Line t={t} at={cre} out={cre + 5.5} text="POR ESO SE TIRAN MÁS OLLAS QUE POR EL QUEMADO" y={880} size={50} col={COL.amber} />);
}

// ======================================================================
// LAS PREGUNTAS
// ======================================================================
{
  const yah = A("y ahora las preguntas"), p1 = A("la primera claudio"), sis = A("sí sirve"), una = A("una cucharada sopera de polvo"), loq = A("lo que no sirve es"), p2 = A("la segunda"), ahi = A("ahí usas bicarbonato"),
    sol = A("solo en acero inoxidable no"), p3 = A("la tercera"), por = A("por eso al final la lavas"), p4 = A("la cuarta"), lat = A("la tapa la dejas"), yel = A("y el borde de goma"), p5 = A("la quinta"),
    no = A("no porque es aluminio"), p6 = A("y la sexta"), esa = A("esa es grasa cocinada pura"), ese = A("ese aceite no va");
  bd(yah, "rise");
  fx(yah, p1, (t) => <Line t={t} at={yah} out={p1 - 0.1} text="LO QUE MÁS ME PREGUNTAN" y={140} size={74} col={COL.amber} />);
  fx(p1, sis, (t) => <CommentType t={t} at={p1} out={sis - 0.1} text="Claudio, ¿y si no tengo pastillas? ¿Sirve el polvo o el gel?" y={460} />);
  ph(sis, "o_polvo_gel", "whip");
  ph(una, "c_polvo", "zoom");
  fx(una, loq, (t) => <Chips t={t} at={una + 0.3} items={["1 CDA DE POLVO", "2 DE GEL", "= 1 PASTILLA"]} out={loq - 0.2} y={860} />);
  fx(loq, p2, (t) => <Stamp t={t} at={loq + 0.5} text="EL LÍQUIDO DE PLATOS, NO" x={960} y={300} rot={-4} size={72} out={p2 - 0.2} />);
  bd(p2, "rise");
  fx(p2, ahi, (t) => <CommentType t={t} at={p2} out={ahi - 0.1} text="¿Y si no tengo nada de lavavajillas?" y={460} />);
  ph(ahi, "c_bicarb", "whip");
  fx(ahi, p3, (t) => <><Chips t={t} at={ahi + 0.5} items={["2 CDAS DE BICARBONATO", "15 MIN BAJITO"]} out={p3 - 0.2} y={860} /><Stamp t={t} at={sol} text="SÓLO ACERO" x={1350} y={300} rot={6} size={80} out={p3 - 0.2} /></>);
  bd(p3, "rise");
  fx(p3, p4, (t) => <><CommentType t={t} at={p3} out={por - 0.2} text="¿Queda algo de detergente en la olla?" y={460} /><Chips t={t} at={por} items={["TU JABÓN DE SIEMPRE", "2 ENJUAGUES"]} out={p4 - 0.2} y={540} /></>);
  ph(p4, "o_tapa_vidrio", "whip");
  fx(p4, lat, (t) => <Stamp t={t} at={p4 + 2.5} text="LA TAPA DE VIDRIO, NUNCA AL FUEGO" x={960} y={860} rot={-3} size={62} out={lat - 0.2} />);
  ph(lat, "c_tapa_vidrio", "zoom");
  fx(lat, p5, (t) => <Sticker t={t} at={lat + 1} out={p5 - 0.2} x={1450} y={330} icon="reloj" text="½ PASTILLA · MEDIA HORA" col="#2f5f8f" />);
  ph(p5, "o_greca", "whip");
  fx(no, p6, (t) => <Tag t={t} at={no} x={960} y={540} dx={260} dy={-200} text="ES ALUMINIO: VINAGRE" col={COL.amber} out={p6 - 0.2} size={52} />);
  ph(p6, "o_aceite", "rise");
  fx(esa, ese, (t) => <Line t={t} at={esa} out={ese - 0.1} text="LA QUE MEJOR SALE" y={140} size={74} col="#9df0b4" />);
  ph(ese, "c_aceite_frit", "whip");
  fx(ese, ese + 6, (t) => <Stamp t={t} at={ese + 0.3} text="NO VA AL FREGADERO" x={1350} y={300} rot={6} size={80} out={ese + 5.5} />);
  void yel;
}

// ======================================================================
// LO QUE DOÑA ROSA NUNCA HACÍA
// ======================================================================
{
  const yya = A("y ya que te nombré"), n1 = A("nunca dejaba una olla vacía"), n2 = A("nunca usaba el fuego fuerte"), lac = A("la comida se pega por apuro"), n3 = A("nunca guardaba una olla mojada"), las = A("las secaba con un trapo"),
    n4 = A("nunca pero nunca"), lod = A("lo decía con la mano"), n5 = A("nunca usaba la fibra"), n6 = A("y nunca tiraba una olla"), mec = A("me decía muchacho"), con = A("con los años"), las2 = A("las ollas de su casa"),
    yno = A("y no tenía ningún"), ese = A("ese es el verdadero secreto");
  ph(yya, "c_rosa_regano", "rise");
  fx(yya, n1, (t) => <Line t={t} at={yya + 1} out={n1 - 0.1} text="LO QUE DOÑA ROSA NUNCA HACÍA" y={140} size={66} col={COL.amber} />);
  w3(n1, PAN_SIDE, (t) => ({ water: 0, crust: 0, shine: 0.8, flame: win(t, n1 + 1, n1 + 1.5) * (1 - win(t, n1 + 4, n1 + 5)), smoke: win(t, n1 + 2.5, n1 + 4) * 0.5 }), "zoom");
  bd(n2, "rise");
  fx(n2, n6 + 1, (t) => <Habits t={t} items={[{ at: n1 + 0.1, text: "NUNCA UNA OLLA VACÍA EN EL FUEGO" }, { at: n2, text: "NUNCA FUEGO FUERTE PARA GUISAR" }, { at: n3, text: "NUNCA UNA ADENTRO DE OTRA, MOJADA" }]} out={n3 + 1} />);
  fx(lac, n3, (t) => <Line t={t} at={lac} out={n3 - 0.1} text="SE PEGA POR APURO, NO POR MALA SUERTE" y={900} size={54} col={COL.amber} />);
  ph(n3 + 2, "c_seca", "whip");
  fx(las, n4, (t) => <Tag t={t} at={las} x={960} y={540} dx={-260} dy={-190} text="BOCA ABAJO EN LA ESTUFA TIBIA" col="#9df0b4" out={n4 - 0.2} size={48} />);
  bd(n4, "zoom");
  fx(n4, mec + 4, (t) => <Habits t={t} items={[{ at: n4, text: "NUNCA AGUA FRÍA A LA OLLA CALIENTE" }, { at: n5, text: "NUNCA FIBRA EN LO BRILLANTE" }, { at: n6, text: "NUNCA TIRARLA SIN DOS INTENTOS" }]} out={mec - 0.2} />);
  fx(lod, n5, (t) => <Flash t={t} at={lod + 0.8} peak={0.25} />);
  fx(mec, con, (t) => <Note t={t} at={mec + 0.3} out={con - 0.1} text="La olla no se tira porque está negra: se tira cuando tiene un agujero." x={960} y={500} rot={-3} />);
  ph(las2, "c_rosa_ollas", "whip");
  w3(yno, WIDE, () => ({ day: 0.85, crust: 0, shine: 0.6 }), "zoom", push(WIDE, 0.3));
  fx(ese, ese + 12, (t) => <Line t={t} at={ese} out={ese + 11} text={t < ese + 4 ? "NO ES LO QUE COMPRAS" : "ES LO QUE HACES CADA DÍA"} y={140} size={72} col={COL.amber} />);
  void con;
}

// ======================================================================
// SEGÚN DÓNDE VIVAS · DINERO · HONESTO · HERRAMIENTAS
// ======================================================================
{
  const und = A("un detalle según dónde"), sie = A("si en tu casa el agua es dura"), pue = A("puede que después de limpiar"), eso = A("eso no es la costra es el sarro"), sal = A("sale con un chorrito de vinagre"),
    yvi = A("y si vives en un lugar"), elh = A("el hollín sale más fácil");
  ph(sie, "o_llave_sarro", "rise");
  ph(pue, "o_sarro", "zoom");
  fx(eso, sal, (t) => <Tag t={t} at={eso} x={960} y={540} dx={-260} dy={-200} text="ES SARRO, NO COSTRA" col={COL.ice} out={sal - 0.2} size={52} />);
  ph(sal, "c_sarro", "whip");
  fx(sal, yvi, (t) => <Stamp t={t} at={sal + 6} text="NUNCA JUNTO CON LA PASTILLA" x={960} y={860} rot={-3} size={64} out={yvi - 0.2} />);
  ph(yvi, "o_hollin", "zoom");
  fx(elh, elh + 6, (t) => <Chips t={t} at={elh} items={["AGUA CALIENTE", "PASTILLA", "ESPONJA"]} out={elh + 5.5} y={860} />);
  void und;
}
{
  const yah = A("y ahora hagamos cuentas"), una = A("una olla buena de acero"), cue = A("cuesta lo mismo que varias"), yco = A("y con una caja salvas"), lae = A("la esponja de alambre que usaste"),
    aqu = A("aquí gastas una pastilla"), dmin = A("diez minutos de gas"), yun = A("y una cuchara de palo"), noc = A("no compraste nada"), ylo = A("y lo que más ahorras");
  ph(una, "o_nueva", "rise");
  bd(cue, "zoom");
  fx(cue, lae, (t) => <Balance t={t} at={cue} even={cue + 1.5} many={yco} out={lae - 0.2} />);
  ph(lae, "o_caja_vs_olla", "whip");
  bd(aqu, "rise");
  fx(aqu, ylo, (t) => <Spent t={t} rows={[{ at: aqu + 0.3, text: "UNA PASTILLA" }, { at: dmin, text: "10 MIN DE GAS" }, { at: yun, text: "LA CUCHARA DE PALO" }]} totalAt={noc} out={ylo - 0.2} />);
  fx(ylo, ylo + 6, (t) => <Line t={t} at={ylo + 1.5} out={ylo + 5.5} text="LA TARDE ENTERA Y LOS DEDOS" y={540} size={80} col="#9df0b4" />);
  void yah;
}
{
  const yte = A("y te soy honesto"), sit = A("si tu olla tiene la costra de diez"), noe = A("no es que el truco no sirvió"), sie = A("si el fondo de acero quedó"), sila = A("si la antiadherente ya tiene"),
    ysi = A("y si la olla de aluminio ya tiene"), pre = A("prefiero decírtelo yo");
  bd(yte, "rise");
  fx(sit, sie, (t) => <><Sticker t={t} at={sit + 1.5} out={sie - 0.2} x={1400} y={300} icon="reloj" text="2 O 3 VUELTAS" col="#8f5a2a" /><Line t={t} at={noe} out={sie - 0.2} text="CADA VUELTA SE LLEVA UNA CAPA" y={760} size={62} col={COL.amber} /></>);
  ph(sie, "o_arcoiris", "whip");
  fx(sie, sila, (t) => <Tag t={t} at={sie + 3} x={960} y={540} dx={-260} dy={-200} text="NO ES MUGRE" sub="EL ACERO SE CALENTÓ DE MÁS" col="#9df0b4" out={sila - 0.2} size={50} />);
  ph(sila, "o_pelado", "zoom");
  fx(sila, ysi, (t) => <Stamp t={t} at={sila + 3} text="ESA YA CUMPLIÓ" x={1350} y={300} rot={6} size={90} out={ysi - 0.2} />);
  ph(ysi, "o_picado", "whip");
  fx(pre, pre + 4, (t) => <Line t={t} at={pre} out={pre + 3.5} text="ANTES DE QUE PIERDAS UNA TARDE" y={140} size={62} col={COL.amber} />);
}
{
  const tel = A("te dejo la lista completa"), una = A("una o dos pastillas de lavavajillas"), uni = A("un imán de la heladera"), agu = A("agua de la llave una"), esp = A("una espátula o una cuchara"),
    gua = A("guantes de goma una"), espo = A("una esponja que no raye"), elr = A("el reloj de la cocina"), par = A("para el aluminio vinagre"), ypa = A("y para el fondo de afuera"), eso = A("eso es todo"), nad = A("nada que no tengas");
  ph(tel, "c_lista", "rise");
  fx(una, nad + 3, (t) => <ToolList t={t} items={[{ at: una, text: "1-2 PASTILLAS (O POLVO / GEL)" }, { at: uni, text: "UN IMÁN" }, { at: agu, text: "AGUA DE LA LLAVE" }, { at: esp, text: "CUCHARA DE PALO" }, { at: gua, text: "GUANTES DE GOMA" }, { at: espo, text: "ESPONJA QUE NO RAYA" }, { at: elr, text: "EL RELOJ" }, { at: par, text: "VINAGRE O 2 LIMONES" }, { at: ypa, text: "BICARBONATO + BOTELLA MARRÓN" }]} out={nad + 2.5} />);
  void eso;
}

// ======================================================================
// RESUMEN · COMENTARIOS · CTA 3 · PRÓXIMO · CIERRE
// ======================================================================
{
  const tel = A("te lo repito rápido"), r1 = A("uno lo negro"), r2 = A("dos el imán"), r3 = A("tres agua uno"), r4 = A("cuatro diez minutos"), r5 = A("cinco entibiar"), r6 = A("seis los frijoles"),
    r7 = A("siete la leche"), r8 = A("ocho el arroz"), r9 = A("nueve el peltre"), r10 = A("diez el aluminio"), r11 = A("once el fondo"), r12 = A("y doce el que nadie hace"), fin = F("una vez al mes");
  w3(tel, WIDE, (t) => ({ day: 0.8, crust: 1 - win(t, tel, fin) * 0.9, shine: win(t, r5, r6) * 0.8 }), "zoom", PAN_TOP, [[r6, PAN_SIDE], [r10, RACK]]);
  fx(r1, r7 - 0.1, (t) => <RecapRail t={t} at={r1 - 0.2} out={r7 - 0.4} steps={[{ at: r1, text: "LO NEGRO SE ABLANDA" }, { at: r2, text: "EL IMÁN" }, { at: r3, text: "1-2 DEDOS · 1 PASTILLA" }, { at: r4, text: "10 MIN BAJITO" }, { at: r5, text: "MADERA DESDE EL BORDE" }, { at: r6, text: "FRIJOLES: 2 PASTILLAS" }]} />);
  fx(r7, fin + 2, (t) => <RecapRail t={t} at={r7 - 0.2} out={fin + 1.5} steps={[{ at: r7, text: "LECHE: ½ · 5 MIN" }, { at: r8, text: "CARAMELO: SÓLO AGUA" }, { at: r9, text: "PELTRE SIN HERVIR" }, { at: r10, text: "ALUMINIO: VINAGRE" }, { at: r11, text: "AFUERA: 1 HORA DE CABEZA" }, { at: r12, text: "EL CHORRITO AL SERVIR" }]} />);
  fx(r7 - 0.3, r7 + 0.4, (t) => <Flash t={t} at={r7 - 0.2} peak={0.3} />);
}
{
  const yah = A("y ahora te pregunto yo"), esc = A("escríbemelo en los comentarios"), las = A("las doce cosas con las medidas"), ysi = A("y si después de las ollas"), gua = A("guárdalo en el celular"),
    enel = A("en el próximo te cuento"), lao = A("la olla quemada no se talla"), nos = A("nos vemos en el próximo"), pas = A("pastilla diez minutos");
  ph(yah, "c_comenta", "rise");
  fx(yah, las, (t) => <CommentType t={t} at={esc - 0.2} out={las - 0.2} text="Se me quemaron los frijoles y la olla lleva 4 años guardada… (tu país)" y={760} />);
  bd(las, "zoom");
  fx(las, enel, (t) => <Book3D t={t} at={ysi - 0.3} open={ysi + 0.3} out={enel - 0.2} page="guia_p34.png" label="EL FRASCO MARRÓN DE CLAUDIO" />);
  fx(las, ysi, (t) => <Line t={t} at={las} out={ysi - 0.2} text="LAS 12 COSAS, EN LA DESCRIPCIÓN" y={540} size={72} col={COL.amber} />);
  fx(gua, enel, (t) => <Line t={t} at={gua} out={enel - 0.1} text="EL LINK, EN LA 1ª LÍNEA DE LA DESCRIPCIÓN" y={980} size={46} />);
  w3(enel, SINK, () => ({ day: 0.8 }), "whip", push(SINK, 0.2));
  fx(enel, lao, (t) => <Line t={t} at={enel + 0.5} out={lao - 0.1} text="PRÓXIMO: EL FREGADERO QUE NO SE TAPA" y={140} size={60} col={COL.ice} />);
  ph(lao, "c_cierre", "rise");
  w3(nos, PAN_TOP, (t) => ({ crust: 0, shine: 0.9, tab: win(t, pas, pas + 0.3), day: 0.85 }), "zoom");
  fx(pas, END + 1, (t) => <EndCard t={t} at={pas} l1="PASTILLA + 10 MIN" l2="NO LA TIRES" />);
}
