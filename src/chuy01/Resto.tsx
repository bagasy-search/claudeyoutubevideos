// chuy01 · MINUTOS 2 a 11 (72,3 → 703,3 s). Sigue la MISMA toma del minuto 1: avatar ↔ mundo 3D del taller ↔ fotos/clips, sin cortes secos
// (latigazo, iris o portal en cada borde). Los bordes del avatar = ventanas pagadas (avwin.json); el mundo usa escenas.ts.
// Cada tramo trae piezas NUEVAS (piezas2.tsx), todas ancladas con at("frase") a la voz real. Audio fuera de Remotion. Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { World as WorldRaw, PT, screenCar, camSpeed } from "./taller3d";
import { makeAt } from "./at";
import CAPS from "./caps.json";
import AVW from "./avwin.json";
import AVAIL from "./avail.json";
import { BigNum, COL, Card3D, Flash, FONT, P, Portal, Receipt, Tag, Thermo, e, ei, extrude, s } from "./lib";
import * as K from "./piezas2";

const at = makeAt(CAPS as [string, number][]);
const WIN = AVW as { ms: number; me: number; off: number }[];
const REEL = (AVAIL as { reel: boolean }).reel;
const CLIPS = (AVAIL as { clips: string[] }).clips;
const CLIPDUR = ((AVAIL as { dur?: Record<string, number> }).dur ?? {}) as Record<string, number>;
export const START = 72.3, FIN = 703.3;
export const FULL_FRAMES = s(FIN);

// ---------------- capas base ----------------
// avatar de cualquier ventana (preroll de 14 cuadros: entra ya hablando bajo el latigazo; sin halo ni borde borroso)
const Avatar: React.FC<{ t: number }> = ({ t }) => {
  if (!REEL) return <Img src={staticFile(P + "av_still.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />;
  const w = WIN.find((x) => t >= x.ms - 0.5 && t < x.me + 0.6);
  if (!w) return <AbsoluteFill style={{ background: "#000" }} />;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={Math.max(0, s(w.ms) - 15)} durationInFrames={s(w.me - w.ms) + 40} layout="none">
        <OffthreadVideo src={staticFile(P + "reel0.mp4")} startFrom={Math.max(0, s(w.off) - 15)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Sequence>
    </AbsoluteFill>
  );
};
// el mundo con desenfoque de movimiento de la cámara (y opcional desenfoque de fondo para tarjetas)
const World: React.FC<{ t: number; bg?: number }> = ({ t, bg = 0 }) => {
  const v0 = camSpeed(t), v = { bx: Math.min(6, v0.bx * 0.5), by: Math.min(4, v0.by * 0.5) };
  const id = "mbr" + Math.round(t * 30);
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}><filter id={id}><feGaussianBlur stdDeviation={`${(v.bx + bg).toFixed(2)} ${(v.by + bg).toFixed(2)}`} /></filter></svg>
      <AbsoluteFill style={{ filter: v.bx + v.by + bg > 0.6 ? `url(#${id})` : undefined }}><WorldRaw t={t} /></AbsoluteFill>
      {bg > 0 && <AbsoluteFill style={{ background: `rgba(5,7,11,${Math.min(0.5, bg * 0.05)})` }} />}
    </AbsoluteFill>
  );
};
// foto (o clip LTX si llegó) con empuje lento; nunca se repite
const Shot: React.FC<{ k: string; t: number; a: number; z?: [number, number]; o?: [number, number]; dur?: number; blur?: number }> = ({ k, t, a, z = [1.03, 1.12], o = [50, 50], dur = 10, blur = 0 }) => {
  const sc = z[0] + (z[1] - z[0]) * e(t, a, a + dur);
  // la foto queda SIEMPRE debajo: si el clip es más corto que el tramo, termina en su primer cuadro (la misma foto), nunca en negro
  const inner = <>
    <Img src={staticFile(P + "img_" + k + ".jpg")} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} />
    {CLIPS.includes(k) && <Sequence from={s(a)} durationInFrames={Math.max(1, s(CLIPDUR[k] ?? 5) - 2)} layout="none"><OffthreadVideo src={staticFile(P + "ltx_" + k + ".mp4")} muted style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>}
  </>;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}><AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: `${o[0]}% ${o[1]}%`, filter: blur > 0 ? `blur(${blur}px) brightness(.7)` : undefined }}>{inner}</AbsoluteFill></AbsoluteFill>;
};

// ---------------- transiciones ----------------
const Whip: React.FC<{ k: number; prev: React.ReactNode; cur: React.ReactNode; dir?: number; vert?: boolean }> = ({ k, prev, cur, dir = -1, vert }) => {
  const mb = Math.sin(k * Math.PI) * 46, ax = vert ? "Y" : "X", L = vert ? 1080 : 1920;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate${ax}(${dir * k * L}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{prev}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `translate${ax}(${-dir * (1 - k) * L}px)`, filter: mb > 1 ? `blur(${mb}px)` : undefined }}>{cur}</AbsoluteFill>
    </AbsoluteFill>
  );
};
const Iris: React.FC<{ k: number; x: number; y: number; prev: React.ReactNode; cur: React.ReactNode }> = ({ k, x, y, prev, cur }) => {
  const R = Math.hypot(Math.max(x, 1920 - x), Math.max(y, 1080 - y)) * 1.02;
  const r1 = k < 0.5 ? R * (1 - k * 2) : 0, r2 = k >= 0.5 ? R * (k - 0.5) * 2 : 0, r = k < 0.5 ? r1 : r2;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {k < 0.5 ? <AbsoluteFill style={{ clipPath: `circle(${r1}px at ${x}px ${y}px)` }}>{prev}</AbsoluteFill> : <AbsoluteFill style={{ clipPath: `circle(${r2}px at ${x}px ${y}px)` }}>{cur}</AbsoluteFill>}
      <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", boxShadow: "0 0 0 6px rgba(255,178,87,.85), 0 0 50px 12px rgba(255,140,40,.35)" }} />
    </AbsoluteFill>
  );
};
// portal: el plano nuevo se abre en un círculo desde un punto, con empuje de cámara del plano viejo
const PortalT: React.FC<{ k: number; x: number; y: number; prev: React.ReactNode; cur: React.ReactNode }> = ({ k, x, y, prev, cur }) => (
  <AbsoluteFill>
    <AbsoluteFill style={{ transform: `scale(${1 + k * 0.5})`, transformOrigin: `${x}px ${y}px` }}>{prev}</AbsoluteFill>
    <Portal x={x} y={y} r={k}>{cur}</Portal>
  </AbsoluteFill>
);

// ---------------- tramos ----------------
type Base = { k: "av" } | { k: "w"; bg?: number; frz?: number } | { k: "img"; id: string; z?: [number, number]; o?: [number, number]; blur?: number } | { k: "bore"; id: string; label: string } | { k: "dark" };
type Tr = "whip" | "whipR" | "whipV" | "iris" | "portal";
type Seg = { a: number; b: Base; tr?: Tr; px?: [number, number]; ov?: (t: number, a: number, z: number) => React.ReactNode };
const AV: Base = { k: "av" }, WD: Base = { k: "w" };
const img = (id: string, z?: [number, number], o?: [number, number]): Base => ({ k: "img", id, z, o });
const sp = (t: number, q: [number, number, number]) => screenCar(t, q);

// anclas más usadas
const A = {
  colonia: at("colonia Independencia"), radio: at("la radio nunca se apagaba"), cafe: at("café de olla"),
  marca: at("ninguna marca"), loque: at("Lo que ve es lo que hay"),
  honesto: at("le soy honesto"), lamina: at("pura lámina"), tragando: at("tragándome algunas palabras"), empecemos: at("Empecemos por donde"),
  taponCarter: at("tapón del cárter"), negro: at("negro, espeso"), chapo: at("como chapopote"), bayoneta: at("saco la bayoneta"), faltaba: at("Le faltaba casi"), pregunto: at("Le pregunto al dueño"), contesto: at("Sabe qué me contestó"), c15: at("Cada 15 mil"),
  manual: at("como dice el manual"), detalle: at("aquí está el detalle"),
  turbo: at("Este es un motor turbo"), inyeccion: at("de inyección directa"), l15: at("1.5 litros"), caliente: at("trabaja muy caliente"), vueltas: at("100,000 vueltas"), lubrica: at("se lubrica"),
  calor: at("con este calor, con"), trafico: at("con el tráfico"), semaforo: at("parado en el semáforo"), airep: at("el aire prendido"), normal: at("no es manejo normal"), severo: at("Eso es servicio severo"), mismoManual: at("Y el mismo manual"), mitad: at("se cambia a la mitad"), regla: at("Así que regla de taller"),
  enTurbo: at("En un turbo"), sintetico: at("Aceite sintético"), grado: at("del grado que pide"),
  k7500: at("7,500 kilómetros"), niUno: at("Ni uno más"), servicio: at("El servicio le cuesta"), turboNuevo: at("un turbo nuevo"), tapa: at("Ahora sí, le"),
  callado1: at("lo que me dejó callado"),
  esperaba: at("Yo esperaba ver lodo"), yno: at("Y no, los"), limpios: at("árboles de levas limpios"), sinMarcas: at("sin marcas"), buzos: at("los buzos parejos"), barniz: at("una capa ligera de barniz"),
  nadaLodo: at("pero nada de lodo"), camara: at("la cámara de inspección"),
  paredes: at("las paredes del cilindro"), rayadito: at("Ese rayadito"), cienmil: at("Con cien mil kilómetros"), todavia: at("todavía está ahí"),
  compresion: at("prueba de compresión"), c180: at("180, 178"), c180b: at("180, 179"), parejitos: at("Parejitos"), cansado: at("Un motor cansado"), esteNo: at("Este no"),
  cuesta: at("me cuesta decirlo"), bienHechos: at("están bien hechos"), cadena: at("la cadena de distribución"), noBanda: at("no banda"), c60: at("cada 60 mil como la banda"),
  enemigo: at("tiene un enemigo"), tensor: at("El tensor de la cadena"),
  viejo: at("Si el aceite está viejo"), estira: at("la cadena se estira"), medi: at("Le medí el estiramiento"), permitido: at("Estaba dentro de lo permitido"),
  cerquita: at("cerquita del límite"), otroAno: at("Otro año así"),
  cascabelear: at("empieza a cascabelear"), matraca: at("ruidito de matraca"), loOye: at("Si lo oye"), ochoMil: at("entre 8 y 14 mil"),
  noGusto: at("lo que de plano no me gustó"), multiple: at("el múltiple de admisión"),
  costra: at("Ve esa costra"), hongos: at("parecen hongos"), porque: at("Por qué pasa"), inyecta: at("se inyecta adentro"), noPasa: at("no pasa por las válvulas"),
  nadaLava: at("entonces nada las lava"), vapores: at("los vapores de aceite"),
  cocinan: at("cocinan y se hace costra"), mundo: at("inyección directa del mundo"), chinos: at("no nada más a los chinos"), japoneses: at("japoneses"), alemanes: at("alemanes"), americanos: at("americanos"), aTodos: at("a todos"),
  provoca: at("qué provoca"), tironee: at("tironee en frío"), flojo: at("que se sienta flojo"),
  foquitoMotor: at("se prenda el foquito del motor"), dueno2: at("lo que le pasó a este dueño"), nuez: at("Se limpia con cáscara"), d2500: at("entre 2,500 y 4,000"),
  previene: at("se previene con lo mismo"), aceiteBueno: at("Aceite bueno"), cortos: at("cambios cortos"), carretera: at("una carretera larga"),
  electrico: at("pasamos a lo eléctrico"), lopeor: at("esperaba lo peor"), primeroFalla: at("lo primero que falla"),
  tapasTablero: at("las tapas de abajo del tablero"),
  corrugado: at("tubo corrugado"), tela: at("cinta de tela"), conectores: at("los conectores del motor"), hule: at("sello de hule"), agua: at("no dejan entrar el agua"),
  apretadas: at("bien apretadas"), cuarenta: at("los cuarenta y tantos conectores"),
  sulfato: at("Ninguno con sulfato"), ninguno: at("Ninguno. Lo"), clip: at("clip de plástico roto"), rozar: at("empezando a rozar"), diez: at("Diez pesos de clip"), sinoLoVe: at("Pero si no lo ve"),
  pela: at("le pela el cable"), tresFoq: at("tres foquitos"),
  loco: at("lo trae a uno loco"), plasticos: at("Ahora los plásticos"), verdad: at("decir la verdad"), carcasa: at("La carcasa del termostato es"), grieta: at("tenía una grieta"), cabello: at("como un cabello"),
  costraBlanca: at("costra blanca de anticongelante"), goteaba: at("Goteaba poquito"),
  caliente2: at("con el motor caliente"), deposito: at("el depósito bajaba"), tampoco: at("Esto tampoco es"), modernos: at("Muchos carros modernos"), enMty: at("Pero en Monterrey"),
  sufre: at("ese plástico sufre"), k6080: at("tiene 60, 80"),
  frio: at("con el motor frío. Pásele"), dedo: at("Pásele el dedo"), cambiela: at("cámbiela antes"), p1500: at("anda en 1,500"),
  calentado: at("Un motor calentado"), m40: at("40 mil para arriba"), alto: at("lo subí bien alto"),
  soldaduras: at("Las soldaduras de puntos"), parejitas: at("parejitas"), robot: at("trabajo de robot"), piso: at("El piso trae"),
  sellador: at("el sellador de las uniones"), casi: at("casi todo, casi"),
  union: at("la unión del larguero"), incompleto: at("estaba incompleto"), franjita: at("una franjita"), oxido: at("óxido superficial"), nadaGrave: at("nada grave todavía"),
  costa: at("viviera en la costa"), salitre: at("con el salitre"), hoyo: at("eso sería un hoyo"),
  cepillo: at("cepillo de alambre"), convertidor: at("convertidor de óxido"), poliuretano: at("sellador de poliuretano"), p200: at("200 pesos de material"), frenos: at("Y ahora frenos"), acaban: at("se acaban los carros"),
  topes: at("por los topes"), baches: at("los baches"), bajadas: at("las bajadas. Los"),
  micrometro: at("con el micrómetro"), minimo: at("en el grosor mínimo"), balatas: at("Las balatas, con"), mm3: at("3 milímetros"), bujes: at("Los bujes de los brazos"),
  agrietados: at("agrietados. Ese"), cuartea: at("se cuartea con el calor"),
  vibraba: at("el volante vibraba"), seLeIba: at("se le iba tantito"), amort: at("Los amortiguadores"), soportes: at("Los soportes del motor"), bujesDiscos: at("Bujes, discos y balatas"),
  m69: at("entre 6 y 9 mil"), noDefecto: at("no es defecto"),
  ultimo: at("lo último, la transmisión"), dobleEmb: at("doble embrague"), muestra: at("Le saqué una muestra"), oscuro: at("oscuro, con olor"), nunca: at("Nunca se lo habían cambiado"),
  porVida: at("Es de por vida"), agencia: at("le dijeron en la agencia"), mire: at("Mire, compadre"),
  enCuarenta: at("en 40 años yo"), cada60: at("Ese aceite se cambia cada 60"), m3: at("Cuesta unos 3 mil"), reparada: at("Una transmisión de estas"),
  m4050: at("le salen 40, 50 mil"), cuenta: at("Haga la cuenta"), que: at("Entonces, ¿qué"),
  desechable: at("un carro desechable"), bienHecho: at("un motor bien hecho"), soldRobot: at("con soldaduras de robot"), cableado: at("un cableado mejor sellado"),
  nadieExplico: at("nadie le explicó"),
  a15: at("cuida El aceite de 15"), deVida: at("La transmisión de por vida"), clip10: at("Un clip de 10 pesos"), malHecho: at("no estaba mal hecho"), malCuidado: at("estaba mal cuidado"), cualquier: at("con cualquier marca"),
  refacciones: at("lo de las refacciones"), proveedor: at("Le pedí a mi proveedor"),
  dias11: at("tardó 11 días"), pensarlo: at("hay que pensarlo"), pregunte: at("pregunte en su ciudad"), prometido: at("lo prometido"), sieteCosas: at("prometido Las siete cosas"),
  historial: at("El historial de servicio"), facturas: at("enseñen las facturas"),
  cambios15: at("cada 15,000 o más"), arranque: at("Arránquelo en frío"), pidale: at("Pídale al vendedor"),
  oyeMatraca: at("Si oye matraca"), tres: at("es la cadena. 3."),
  escaneelo: at("Escaneelo"), escaner500: at("Un escáner de 500"), guardadas: at("fallas de encendido guardadas"), cuatro: at("La carcasa del termostato y las mangueras"),
  busque: at("Busque costra blanca"), cinco: at("costra blanca. 5."),
  casiNadie: at("La que casi nadie sabe"), pregunteAceite: at("Pregunte por el aceite"), pasa60: at("ya pasa de 60,000"), negocie: at("negocie el precio"), seis: at("6. Súbalo"),
  revise: at("Revise los bujes"), min10: at("Son 10 minutos"),
  cualquierTaller: at("cualquier taller se lo hace"), siete: at("7. Antes de firmar"), llame: at("llame a la refaccionaria"), precioTiempo: at("pida precio y tiempo"),
  balatas2: at("unas balatas. Si"), semanas: at("tres semanas"), conQue: at("con qué va a vivir"),
  yaEse: at("Y ya, ese es"), hicimos: at("Al dueño le hicimos"), limpiezaV: at("la limpieza de válvulas"), laCarcasa: at("la carcasa, el clip"), losFrenos: at("los frenos y los bujes"), tranquilo: at("Se fue tranquilo"), yaNo: at("ya no tironea"),
  tarea: at("Su tarea de esta semana"), ultimaFactura: at("la última factura"),
  seaChino: at("sea chino o no"), cadaCuantos: at("cada cuántos kilómetros"), nadaMas: at("Nada más eso"), suscribase: at("suscríbase"), campanita: at("campanita"), cuenteme: at("cuénteme abajo"),
  proximo: at("En el próximo vídeo"), errores: at("los errores que veo"), bajadas2: at("en las bajadas, y"), acabando: at("le está acabando la transmisión"),
  aquiLoEspero: at("Aquí lo espero"), manosNegras: at("en el taller, con las manos negras"), limpia: at("con la verdad limpia"),
};

// ventanas del avatar → tramos "av" (salvo 683,4: ahí la voz nueva del CTA no coincide con los labios → foto con la pregunta)
const W_ = (ms: number) => { const w = WIN.find((x) => Math.abs(x.ms - ms) < 0.3); if (!w) throw new Error("ventana " + ms); return w.ms; };

export const SEGS: Seg[] = [
  { a: 63.83, b: AV }, // (minuto 1, sólo como "anterior" de la primera transición)
  // ===== 72,4 · el tallercito de lámina de su papá (foto vieja) =====
  { a: 72.37, b: img("m2_papa", [1.04, 1.14], [45, 55]), tr: "portal", px: [1460, 420], ov: (t) => <>
    <Tag t={t} at={A.colonia} x={1250} y={330} dx={140} dy={-120} text="COL. INDEPENDENCIA" sub="MONTERREY · AÑOS 70" col={COL.amber} out={A.radio} size={50} />
    <K.DropChips t={t} out={80.0} x={120} y={150} items={[{ at: A.radio, txt: "LA RADIO SIEMPRE PRENDIDA" }, { at: A.cafe - 1.6, txt: "OLOR A GASOLINA" }, { at: A.cafe, txt: "Y A CAFÉ DE OLLA", col: "#c98a4a" }]} />
  </> },
  // el taller de hoy desde el portón
  { a: 80.1, b: WD, tr: "whip", ov: (t) => <K.Polaroid t={t} a={80.35} out={82.4} img="m2_papa" cap="con mi papá, 1975" x={1500} y={330} w={420} rot={6} /> },
  // ===== avatar · "aquí no me paga ninguna marca" =====
  { a: W_(82.53), b: AV, tr: "whipR", ov: (t) => <K.NoSponsor t={t} a={A.marca} b={A.loque} out={86.6} x={1340} y={300} /> },
  // ===== 86,8 · la lámina =====
  { a: 86.84, b: img("m2_lamina", [1.02, 1.1], [40, 50]), tr: "iris", px: [1300, 400], ov: (t) => <>
    <K.Knock t={t} a={A.lamina - 0.15} out={A.tragando} x={760} y={560} text="«PURA LÁMINA»" />
    <K.Sello t={t} a={A.tragando + 0.4} out={A.empecemos - 0.5} text="ME LAS VOY A TRAGAR" sub="ALGUNAS · NO TODAS" x={1320} y={830} col={COL.amber} rot={-5} size={64} />
  </> },
  // el cárter en rayos X
  { a: A.empecemos - 0.4, b: WD, tr: "portal", px: [760, 560], ov: (t) => <>
    <Tag t={t} at={A.empecemos + 0.5} x={sp(t, PT.pan).x} y={sp(t, PT.pan).y} dx={-260} dy={-160} text="EMPIEZA TODO" sub="EL ACEITE" col="#c9a35a" out={99.0} size={56} />
  </> },
  // ===== avatar · negro, espeso =====
  { a: W_(99.12), b: AV, tr: "whip", ov: (t) => <>
    <K.Drip t={t} a={A.negro} out={104.9} text="NEGRO · ESPESO" x={1350} y={260} size={110} />
    <Tag t={t} at={A.taponCarter} x={1500} y={700} dx={-120} dy={-80} text="TAPÓN DEL CÁRTER" col={COL.dim} out={A.negro - 0.1} size={40} />
  </> },
  // ===== 105 · bayoneta y dueño =====
  { a: 105.02, b: img("m2_bayoneta", [1.05, 1.15], [55, 40]), tr: "whipR", ov: (t) => <>
    <K.Drip t={t} a={A.chapo + 0.1} out={A.bayoneta + 0.6} text="CHAPOPOTE" x={1420} y={900} size={130} />
    <K.Dipstick t={t} a={A.faltaba - 0.5} out={A.pregunto - 0.2} x={140} y={720} />
  </> },
  { a: A.pregunto - 0.15, b: img("m2_dueno", [1.03, 1.1], [60, 45]), tr: "whipV", ov: (t) => <>
    <K.Bubble t={t} a={A.pregunto + 0.2} out={A.contesto} text="¿CADA CUÁNTO?" who="DON CHUY" x={180} y={160} />
    <K.Bubble t={t} a={A.c15} out={115.6} text="CADA 15 MIL" who="EL DUEÑO" x={1080} y={210} tail="r" />
  </> },
  // ===== avatar · "como dice el manual. Y aquí está el detalle" =====
  { a: W_(115.7), b: AV, tr: "whip", ov: (t) => <>
    <Tag t={t} at={A.manual} x={1480} y={640} dx={-80} dy={-140} text="«COMO DICE EL MANUAL»" col={COL.ice} out={A.detalle} size={46} />
    <BigNum t={t} at={A.detalle + 0.3} text="EL DETALLE" size={150} x={1360} y={300} out={119.3} edge="#6b3a10" col={COL.amber} />
  </> },
  // ===== 119,4 · el turbo en el mundo =====
  { a: 119.39, b: WD, tr: "portal", px: [1360, 300], ov: (t) => <>
    <K.SpecPlate t={t} out={A.vueltas - 0.3} x={1250} y={140} rows={[{ at: A.turbo + 0.3, txt: "TURBO" }, { at: A.inyeccion, txt: "INYECCIÓN DIRECTA" }, { at: A.l15, txt: "1.5 LITROS" }]} />
    <Tag t={t} at={A.caliente} x={sp(t, PT.turbo).x} y={sp(t, PT.turbo).y} dx={-300} dy={-120} text="MUY CALIENTE" col="#ff7a3a" out={A.vueltas - 0.2} size={56} />
    <K.Dial t={t} a={A.vueltas - 0.2} out={A.lubrica + 0.4} x={1500} y={330} to={100000} max={120000} label="RPM DEL TURBO" ticks={["0", "40K", "80K", "120K"]} read={(v) => Math.round(v).toLocaleString("en-US")} />
    <Tag t={t} at={A.lubrica + 0.5} x={sp(t, [-1.2, 0.65, -0.32]).x} y={sp(t, [-1.2, 0.65, -0.32]).y} dx={260} dy={-160} text="EL MISMO ACEITE" sub="DEL MOTOR" col="#ffb02e" out={132.1} size={54} />
  </> },
  // ===== avatar · Monterrey, calor, tráfico =====
  { a: W_(132.23), b: AV, tr: "whipR", ov: (t) => <K.DropChips t={t} out={136.8} x={1180} y={180} items={[{ at: A.calor, txt: "MONTERREY · CALOR", col: COL.red }, { at: A.trafico, txt: "TRÁFICO", col: "#ffcf3a" }]} /> },
  // ===== 137 · el semáforo =====
  { a: 136.97, b: img("m2_trafico", [1.02, 1.12], [50, 60]), tr: "whip", ov: (t) => <>
    <K.DropChips t={t} out={A.normal - 0.3} x={120} y={140} items={[{ at: A.semaforo, txt: "PARADO EN EL SEMÁFORO", col: COL.red }, { at: A.airep, txt: "A/C PRENDIDO", col: COL.ice }]} />
  </> },
  // desde la calle, contra el sol: severo
  { a: A.normal - 0.35, b: WD, tr: "iris", px: [700, 300], ov: (t) => <>
    <K.Dial t={t} a={A.normal} out={A.mismoManual - 0.2} x={1420} y={360} to={0.95} max={1} label="TIPO DE SERVICIO" ticks={["NORMAL", "", "SEVERO"]} read={(v) => (v > 0.8 ? "SEVERO" : "NORMAL")} zones={[[0, 0.5, "#2ee86a"], [0.5, 0.75, "#ffcf3a"], [0.75, 1, COL.red]]} />
  </> },
  { a: A.mismoManual - 0.2, b: img("m2_manual", [1.04, 1.12], [45, 55]), tr: "whipR", ov: (t) => <>
    <K.KmRuler t={t} a={A.mismoManual + 0.4} half={A.mitad} out={149.7} x={460} y={140} />
    <K.Sello t={t} a={A.regla + 0.2} out={149.7} text="REGLA DE TALLER" x={1400} y={860} col={COL.amber} rot={-4} size={66} />
  </> },
  // ===== avatar · sintético =====
  { a: W_(149.79), b: AV, tr: "whip", ov: (t) => <K.Brass t={t} a={A.enTurbo} out={153.9} title="REGLA DE TALLER · TURBO" rows={[{ at: A.sintetico, txt: "SINTÉTICO" }, { at: A.grado, txt: "DEL GRADO DEL MANUAL" }]} x={1060} y={170} /> },
  // ===== 154 · 7,500 km =====
  { a: 154.04, b: img("m2_sintetico", [1.03, 1.12], [50, 45]), tr: "whipV", ov: (t) => <>
    <BigNum t={t} at={A.k7500 - 0.3} text="7,500 KM" size={200} x={960} y={300} out={A.servicio - 0.3} sub="NI UNO MÁS" />
  </> },
  { a: A.servicio - 0.25, b: { k: "w", bg: 0 }, tr: "portal", px: [960, 300], ov: (t) => <>
    <K.PriceDuel t={t} a={A.servicio + 0.4} b={A.turboNuevo + 0.3} out={A.tapa - 0.3} x={1380} y={900} l={{ txt: "$1,200", v: 1200, lab: "EL SERVICIO" }} r={{ txt: "$15–25 MIL", v: 20000, lab: "TURBO NUEVO" }} />
    <Tag t={t} at={A.tapa + 0.2} x={sp(t, PT.cover).x} y={sp(t, PT.cover).y} dx={220} dy={-150} text="LA TAPA" col={COL.amber} out={165.0} size={54} />
  </> },
  // ===== avatar · callado =====
  { a: W_(165.09), b: AV, tr: "whipR", ov: (t) => <K.Sello t={t} a={A.callado1 + 0.2} out={169.3} text="CALLADO" x={1380} y={300} col={COL.ink} rot={-8} size={120} /> },
  // ===== 169,5 · lo que esperaba → lo que encontré =====
  { a: 169.45, b: { k: "w", bg: 14 }, tr: "iris", px: [1380, 300], ov: (t) => <K.Expect t={t} a={A.esperaba} out={A.yno - 0.1} x={960} y={540} /> },
  { a: A.yno - 0.05, b: WD, tr: "whipV", ov: (t) => <>
    <K.CheckList t={t} out={182.5} x={1180} y={160} title="LO QUE ENCONTRÉ" items={[{ at: A.limpios, txt: "LEVAS LIMPIAS" }, { at: A.sinMarcas, txt: "SIN MARCAS" }, { at: A.buzos, txt: "BUZOS PAREJOS" }, { at: A.barniz, txt: "BARNIZ LIGERO" }]} />
  </> },
  // ===== avatar · nada de lodo, la cámara =====
  { a: W_(182.56), b: AV, tr: "whip", ov: (t) => <>
    <K.Sello t={t} a={A.nadaLodo + 0.2} out={A.camara - 0.2} text="LODO: 0" x={1400} y={280} col="#2ee86a" rot={-6} size={100} />
    <Tag t={t} at={A.camara} x={1520} y={760} dx={-120} dy={-220} text="CÁMARA DE INSPECCIÓN" col={COL.ice} out={188.5} size={46} />
  </> },
  // ===== 188,6 · boroscopio =====
  { a: 188.6, b: img("m3_boroscopio", [1.03, 1.1], [55, 50]), tr: "portal", px: [1500, 600], ov: (t) => <>
    <Tag t={t} at={A.paredes} x={1150} y={560} dx={40} dy={-200} text="EL HUECO DE LA BUJÍA" col={COL.ice} out={A.rayadito - 0.3} size={44} />
  </> },
  { a: A.rayadito - 0.4, b: { k: "bore", id: "m3_rayado", label: "RAYADO DE FÁBRICA" }, tr: "iris", px: [960, 540], ov: (t) => <>
    <Tag t={t} at={A.cienmil} x={760} y={420} dx={-200} dy={-160} text="100,000 KM" sub="Y SIGUE AHÍ" col={COL.amber} out={199.9} size={58} />
  </> },
  // ===== avatar · compresión =====
  { a: W_(200.0), b: AV, tr: "whipR", ov: (t) => <K.PressureRow t={t} out={204.3} x={1340} y={140} vals={[{ at: A.c180, v: 180 }, { at: A.c180 + 0.6, v: 178 }, { at: 204.1, v: 180 }, { at: 204.2, v: 179 }]} /> },
  // ===== 204,4 · las 4 columnas parejas =====
  { a: 204.42, b: WD, tr: "whip", ov: (t) => <>
    <K.Sello t={t} a={A.parejitos} out={A.cansado - 0.2} text="PAREJITOS" x={1420} y={220} col="#2ee86a" rot={-5} size={96} />
    <Tag t={t} at={A.cansado + 0.4} x={sp(t, [-1.42, 1.35, 0.075]).x} y={sp(t, [-1.42, 1.35, 0.075]).y} dx={260} dy={-140} text="MOTOR CANSADO" sub="20–30 LIBRAS DE DIFERENCIA" col={COL.red} out={A.esteNo} size={52} />
    <K.Sello t={t} a={A.esteNo + 0.1} out={214.8} text="ESTE NO" x={1420} y={260} col={COL.ink} rot={6} size={110} />
  </> },
  // ===== avatar · me cuesta decirlo =====
  { a: W_(214.94), b: AV, tr: "whipR", ov: (t) => <Tag t={t} at={A.cuesta} x={1460} y={680} dx={-60} dy={-200} text="ME CUESTA DECIRLO…" col={COL.dim} out={218.4} size={50} /> },
  // ===== 218,5 · bien hechos + cadena =====
  { a: 218.49, b: WD, tr: "portal", px: [1300, 500], ov: (t) => <>
    <K.Rosette t={t} a={A.bienHechos} out={A.cadena - 0.2} x={1520} y={360} l1="BLOQUE Y" l2="CABEZA ✓" />
    <Tag t={t} at={A.cadena + 0.3} x={sp(t, PT.chain).x} y={sp(t, PT.chain).y} dx={-280} dy={-200} text="CADENA" sub="DE DISTRIBUCIÓN" col={COL.amber} out={A.noBanda} size={60} />
    <K.VersusCards t={t} a={A.noBanda} b={A.c60} out={231.2} y={770} L={{ icon: "chain", t1: "CADENA ✓", t2: "NO SE CAMBIA SEGUIDO", ok: true }} R={{ icon: "belt", t1: "BANDA", t2: "CADA 60 MIL", ok: false }} />
  </> },
  // ===== avatar · su enemigo =====
  { a: W_(231.29), b: AV, tr: "whip", ov: (t) => <K.Sello t={t} a={A.enemigo + 0.3} out={236.9} text="SU ENEMIGO:" sub="EL ACEITE SUCIO" x={1380} y={300} col={COL.red} rot={-6} size={90} /> },
  // ===== 237 · la cadena se afloja =====
  { a: 237.03, b: WD, tr: "iris", px: [1380, 300], ov: (t) => <>
    <Tag t={t} at={A.viejo + 0.6} x={sp(t, [-1.4, 0.62, 0.36]).x} y={sp(t, [-1.4, 0.62, 0.36]).y} dx={260} dy={-180} text="EL TENSOR NO EMPUJA" col={COL.red} out={A.estira} size={52} />
    <BigNum t={t} at={A.estira} text="SE ESTIRA" size={150} x={1300} y={880} out={243} col={COL.red} edge="#4a1410" />
  </> },
  { a: 243.0, b: img("m3_escaner", [1.03, 1.1], [50, 50]), tr: "whipV", ov: (t) => <K.ZoneBar t={t} a={A.medi + 0.6} out={248.1} x={960} y={640} to={0.83} title="ESTIRAMIENTO DE LA CADENA" read="DENTRO… PERO CERQUITA" /> },
  // ===== avatar · otro año así =====
  { a: W_(248.24), b: AV, tr: "whip", ov: (t) => <>
    <K.Sello t={t} a={A.otroAno} out={252.9} text="+1 AÑO" sub="CON ACEITE DE 15 MIL" x={1400} y={300} col={COL.red} rot={-6} size={100} />
  </> },
  // ===== 253 · el cascabeleo en frío =====
  { a: 253.02, b: img("m3_frio", [1.03, 1.1], [50, 45]), tr: "whipR", ov: (t) => <>
    <K.SoundWave t={t} a={A.cascabelear} out={A.loOye + 0.6} y={640} word="TRAC-TRAC-TRAC" />
    <K.Sello t={t} a={A.loOye + 0.3} out={A.ochoMil - 0.3} text="NO LO IGNORE" x={960} y={420} col={COL.amber} rot={-4} size={96} />
    <K.HangTag t={t} a={A.ochoMil} out={266.2} x={1300} y={0} price="$8–14 MIL" sub="CADENA + TENSOR + GUÍAS" />
  </> },
  // ===== avatar · lo que no me gustó =====
  { a: W_(266.34), b: AV, tr: "whip", ov: (t) => <>
    <K.Sello t={t} a={A.noGusto + 0.4} out={A.multiple} text="NO ME GUSTÓ" x={1400} y={280} col={COL.red} rot={-7} size={96} />
    <Tag t={t} at={A.multiple} x={1520} y={720} dx={-80} dy={-200} text="FUERA EL MÚLTIPLE" col={COL.amber} out={271.6} size={46} />
  </> },
  // ===== 271,7 · válvulas con costra =====
  { a: 271.75, b: img("m4_valvulas", [1.02, 1.08], [50, 50]), tr: "portal", px: [1400, 300], ov: (t) => <>
    <K.Loupe t={t} a={A.costra + 0.2} out={A.porque - 0.3} img="m4_valvulas" x={980} y={520} zoom={2.2} label="COSTRA DE CARBÓN" />
    <Tag t={t} at={A.hongos} x={640} y={420} dx={-220} dy={-160} text="«HONGOS QUEMADOS»" col={COL.amber} out={A.porque - 0.2} size={50} />
    <BigNum t={t} at={A.porque} text="¿POR QUÉ?" size={170} x={960} y={540} out={277.6} />
  </> },
  { a: 277.7, b: WD, tr: "iris", px: [960, 540], ov: (t) => <>
    <Tag t={t} at={A.inyecta} x={sp(t, [-1.4, 0.56, 0.075]).x} y={sp(t, [-1.4, 0.56, 0.075]).y} dx={280} dy={-200} text="ADENTRO DEL CILINDRO" col="#ffd36a" out={284.5} size={52} />
    <Tag t={t} at={A.noPasa} x={sp(t, [-1.56, 0.63, -0.075]).x} y={sp(t, [-1.56, 0.63, -0.075]).y} dx={-260} dy={160} text="NO LAVA LAS VÁLVULAS" col={COL.red} out={284.5} size={50} />
  </> },
  // ===== avatar · nada las lava =====
  { a: W_(284.57), b: AV, tr: "whipR", ov: (t) => <>
    <K.Sello t={t} a={A.nadaLava + 0.2} out={A.vapores} text="NADA LAS LAVA" x={1380} y={280} col={COL.red} rot={-5} size={90} />
    <Tag t={t} at={A.vapores + 0.3} x={1500} y={760} dx={-100} dy={-220} text="VAPORES DEL CÁRTER" col={COL.dim} out={290.9} size={46} />
  </> },
  // ===== 291 · los vapores se cocinan; pasa en todo el mundo =====
  { a: 290.98, b: WD, tr: "whip", ov: (t) => <>
    <Tag t={t} at={A.cocinan} x={sp(t, [-1.6, 0.95, 0]).x} y={sp(t, [-1.6, 0.95, 0]).y} dx={260} dy={-160} text="SE COCINAN = COSTRA" col={COL.amber} out={A.mundo} size={52} />
    <K.Origins t={t} items={[{ at: A.chinos, txt: "CHINOS" }, { at: A.japoneses, txt: "JAPONESES" }, { at: A.alemanes, txt: "ALEMANES" }, { at: A.americanos, txt: "AMERICANOS" }]} all={A.aTodos} out={301.9} y={700} />
  </> },
  // ===== avatar · qué provoca =====
  { a: W_(302.0), b: AV, tr: "whipR", ov: (t) => <K.DropChips t={t} out={306.4} x={1220} y={170} items={[{ at: A.tironee, txt: "TIRONEA EN FRÍO", col: COL.red }, { at: A.flojo, txt: "SE SIENTE FLOJO", col: "#ffcf3a" }]} /> },
  // ===== 306,5 · falla de encendido → cáscara de nuez =====
  { a: 306.49, b: { k: "dark" }, tr: "whip", ov: (t) => <>
    <K.Misfire t={t} a={306.6} out={A.nuez - 0.3} x={960} y={500} />
    <Tag t={t} at={A.dueno2} x={960} y={860} dx={0} dy={0} text="LO QUE LE PASÓ A ESTE DUEÑO" col={COL.amber} out={A.nuez - 0.3} size={50} />
  </> },
  { a: A.nuez - 0.3, b: img("m4_nuez", [1.04, 1.12], [45, 50]), tr: "portal", px: [960, 500], ov: (t) => <K.HangTag t={t} a={A.d2500} out={319.8} x={1340} y={0} price="$2,500–4,000" sub="LIMPIEZA DE VÁLVULAS" /> },
  // ===== avatar · se previene =====
  { a: W_(319.88), b: AV, tr: "whip", ov: (t) => <K.Rx t={t} out={324.5} x={1180} y={130} items={[{ at: A.aceiteBueno, txt: "Aceite bueno" }, { at: A.cortos, txt: "Cambios cortos" }, { at: 324.3, txt: "Carretera" }]} /> },
  // ===== 324,6 · la carretera → lo eléctrico =====
  { a: 324.57, b: img("m4_carretera", [1.02, 1.1], [50, 60]), tr: "whipR", ov: (t) => <>
    <K.Dial t={t} a={A.carretera} out={A.electrico - 0.4} x={1450} y={420} to={0.62} max={1} label="VELOCIDAD PAREJA" ticks={["0", "60", "120", "180"]} read={() => "110 KM/H"} zones={[[0, 1, "#8fd6ff"]]} />
  </> },
  { a: A.electrico - 0.3, b: WD, tr: "iris", px: [1450, 420], ov: (t) => <>
    <Tag t={t} at={A.lopeor} x={sp(t, PT.harness).x} y={sp(t, PT.harness).y} dx={260} dy={-200} text="AQUÍ ESPERABA LO PEOR" col={COL.ice} out={A.primeroFalla - 0.2} size={50} />
    <K.Bubble t={t} a={A.primeroFalla} out={335.6} text="«LO PRIMERO QUE FALLA»" who="LO QUE SE DICE" x={1000} y={120} tail="r" />
  </> },
  // ===== avatar · tapas del tablero =====
  { a: W_(335.73), b: AV, tr: "whip", ov: (t) => <Card3D id="img_m4_tablero" x={1160} y={170} w={620} h={350} ry={-16} o={e(t, A.tapasTablero, A.tapasTablero + 0.3) * (1 - e(t, 340.4, 340.7))} label="DEBAJO DEL TABLERO" labelCol={COL.ice} /> },
  // ===== 340,8 · corrugado, tela, sellos =====
  { a: 340.8, b: WD, tr: "whipR", ov: (t) => <>
    <K.CheckList t={t} out={A.conectores + 1.2} x={1220} y={170} items={[{ at: A.corrugado, txt: "TUBO CORRUGADO" }, { at: A.tela, txt: "CINTA DE TELA" }]} />
  </> },
  { a: A.conectores + 1.3, b: img("m4_conector", [1.05, 1.15], [50, 50]), tr: "portal", px: [960, 540], ov: (t) => <>
    <Tag t={t} at={A.hule} x={960} y={560} dx={260} dy={-200} text="SELLO DE HULE" col="#ff8a2a" out={350.9} size={58} />
    <K.Sello t={t} a={A.agua + 0.2} out={350.9} text="NO ENTRA AGUA" x={620} y={860} col={COL.ice} rot={-4} size={70} />
  </> },
  // ===== avatar · los 40 y tantos =====
  { a: W_(351.03), b: AV, tr: "whip", ov: (t) => <K.Count t={t} a={A.cuarenta} out={355.8} to={43} x={1420} y={330} label="CONECTORES REVISADOS" /> },
  // ===== 355,9 · cero sulfato; el clip roto =====
  { a: 355.87, b: WD, tr: "whipR", ov: (t) => <>
    <K.Sello t={t} a={A.ninguno} out={A.clip - 0.3} text="SULFATO: 0" x={1420} y={250} col="#2ee86a" rot={-6} size={100} />
  </> },
  { a: A.clip - 0.1, b: img("m4_clip", [1.04, 1.12], [50, 55]), tr: "iris", px: [1420, 250], ov: (t) => <>
    <Tag t={t} at={A.rozar} x={980} y={600} dx={-260} dy={-200} text="YA SE ESTABA ROZANDO" col={COL.red} out={A.diez - 0.2} size={50} />
    <K.Coin t={t} a={A.diez} out={368.6} x={1450} y={430} txt="$10" label="DE CLIP" />
  </> },
  // ===== avatar · tres foquitos =====
  { a: W_(368.67), b: AV, tr: "whip", ov: (t) => <K.DashTrio t={t} a={A.tresFoq} out={373.1} x={1360} y={300} /> },
  // ===== 373,2 · loco buscando la falla → los plásticos =====
  { a: 373.18, b: { k: "w", bg: 10 }, tr: "whipR", ov: (t) => <>
    <BigNum t={t} at={A.loco + 0.2} text="¿?¿?¿?" size={200} x={960} y={420} out={A.plasticos - 0.3} col={COL.ice} edge="#0a2a40" />
  </> },
  { a: A.plasticos - 0.2, b: WD, tr: "iris", px: [960, 420], ov: (t) => <>
    <K.Sello t={t} a={A.verdad + 0.3} out={A.carcasa} text="LA VERDAD" x={1420} y={230} col={COL.amber} rot={-5} size={90} />
    <Tag t={t} at={A.carcasa} x={sp(t, PT.thermo).x} y={sp(t, PT.thermo).y} dx={-280} dy={-180} text="CARCASA DEL TERMOSTATO" sub="DE PLÁSTICO" col={COL.ink} out={A.grieta} size={50} />
    <K.Hair t={t} a={A.cabello - 0.3} out={384.2} x={960} y={790} />
  </> },
  // ===== avatar · costra blanca =====
  { a: W_(384.27), b: AV, tr: "whip", ov: (t) => <K.DropChips t={t} out={388.4} x={1220} y={170} items={[{ at: A.costraBlanca, txt: "COSTRA BLANCA", col: "#f2efe6" }, { at: A.goteaba, txt: "GOTEABA POQUITO", col: "#ff6fae" }]} /> },
  // ===== 388,5 · el depósito → Monterrey =====
  { a: 388.53, b: img("m5_termostato", [1.05, 1.14], [50, 50]), tr: "whipR", ov: (t) => <Tag t={t} at={A.caliente2 - 0.4} x={960} y={540} dx={260} dy={-200} text="SÓLO CON EL MOTOR CALIENTE" col="#ff7a3a" out={A.deposito - 0.2} size={48} /> },
  { a: A.deposito - 0.3, b: img("m5_deposito", [1.03, 1.1], [50, 45]), tr: "whipV", ov: (t) => <>
    <K.Tank t={t} a={A.deposito} out={A.tampoco - 0.2} x={1440} y={200} />
    <K.Sello t={t} a={A.modernos} out={A.enMty - 0.2} text="NO SÓLO LOS CHINOS" x={1360} y={360} col={COL.ice} rot={-5} size={70} />
    <Thermo t={t} at={A.enMty} x={1320} y={260} from={25} to={42} out={400.8} />
  </> },
  // ===== avatar · 60, 80 mil =====
  { a: W_(400.92), b: AV, tr: "whip", ov: (t) => <BigNum t={t} at={A.k6080} text="60–80 MIL KM" size={130} x={1340} y={260} out={405.2} col={COL.amber} edge="#5a3a10" /> },
  // ===== 405,3 · revise en frío =====
  { a: 405.32, b: WD, tr: "portal", px: [1340, 260], ov: (t) => <>
    <Tag t={t} at={405.6} x={sp(t, PT.thermo).x} y={sp(t, PT.thermo).y} dx={-260} dy={-200} text="CON EL MOTOR FRÍO" col={COL.ice} out={A.dedo} size={52} />
    <Tag t={t} at={A.dedo} x={sp(t, PT.thermo).x} y={sp(t, PT.thermo).y} dx={260} dy={-160} text="PÁSELE EL DEDO" col={COL.ink} out={A.cambiela + 0.6} size={56} />
  </> },
  { a: A.cambiela + 0.7, b: { k: "w", bg: 12, frz: 411.9 }, tr: "whipV", ov: (t) => <K.PriceDuel t={t} a={A.p1500} b={416.0} out={416.8} x={960} y={940} l={{ txt: "$1,500–2,000", v: 1750, lab: "LA PIEZA" }} r={{ txt: "$40,000+", v: 40000, lab: "MOTOR CALENTADO" }} /> },
  // ===== avatar · motor calentado / lo subí =====
  { a: W_(416.87), b: AV, tr: "whip", ov: (t) => <Tag t={t} at={A.alto} x={1500} y={720} dx={-100} dy={-240} text="BIEN ALTO" sub="LA PARTE DE ABAJO" col={COL.amber} out={422.8} size={56} /> },
  // ===== 422,9 · soldaduras de punto =====
  { a: 422.89, b: WD, tr: "whipV", ov: (t) => <>
    <Tag t={t} at={A.parejitas} x={sp(t, PT.welds).x} y={sp(t, PT.welds).y} dx={220} dy={200} text="TODAS A LA MISMA DISTANCIA" col="#ffd27a" out={A.robot - 0.2} size={48} />
  </> },
  { a: A.robot - 0.2, b: img("m5_puntos", [1.03, 1.1], [50, 50]), tr: "iris", px: [1100, 700], ov: (t) => <>
    <K.Sello t={t} a={A.robot + 0.2} out={432.3} text="TRABAJO DE ROBOT" sub="BIEN CALIBRADO" x={1340} y={280} col="#2ee86a" rot={-5} size={80} />
  </> },
  // ===== avatar · casi =====
  { a: W_(432.41), b: AV, tr: "whip", ov: (t) => <K.Sello t={t} a={A.casi + 0.6} out={436.0} text="CASI." x={1420} y={300} col={COL.red} rot={-8} size={150} /> },
  // ===== 436,1 · la franjita con óxido =====
  { a: 436.15, b: WD, tr: "portal", px: [1420, 300], ov: (t) => <>
    <Tag t={t} at={A.franjita} x={sp(t, [1.35, 0.25, 0.74]).x} y={sp(t, [1.35, 0.25, 0.74]).y} dx={-260} dy={-200} text="10 CM SIN SELLAR" col="#ff7a2a" out={A.oxido - 0.1} size={54} />
  </> },
  { a: A.oxido - 0.1, b: img("m5_oxido", [1.04, 1.12], [55, 45]), tr: "whipR", ov: (t) => <K.Sello t={t} a={A.nadaGrave} out={448.9} text="NADA GRAVE" sub="TODAVÍA" x={1380} y={820} col={COL.amber} rot={-5} size={80} /> },
  // ===== avatar · la costa =====
  { a: W_(449.03), b: AV, tr: "whip", ov: (t) => <>
    <Card3D id="img_m5_costa" x={1120} y={150} w={660} h={372} ry={-16} o={e(t, A.costa, A.costa + 0.3) * (1 - e(t, 454.6, 454.9))} label={t > A.hoyo ? "5 AÑOS = UN HOYO" : "SALITRE"} labelCol={COL.red} />
  </> },
  // ===== 455 · el arreglo de 200 pesos → topes =====
  { a: 454.96, b: img("m5_cepillo", [1.03, 1.1], [50, 50]), tr: "whipR", ov: (t) => <Receipt t={t} title="MATERIAL" cur="$" rows={[{ at: A.cepillo, item: "CEPILLO", $: 60 }, { at: A.convertidor, item: "CONVERTIDOR", $: 80 }, { at: A.poliuretano, item: "SELLADOR", $: 60 }]} totalAt={A.p200} x={1300} y={150} out={A.frenos - 0.3} sc={1.05} /> },
  { a: A.frenos - 0.2, b: img("m6_topes", [1.03, 1.12], [50, 60]), tr: "whipV", ov: (t) => <K.Sello t={t} a={A.acaban} out={467.7} text="AQUÍ SE ACABAN" sub="LOS CARROS" x={1340} y={280} col={COL.red} rot={-5} size={80} /> },
  // ===== avatar · topes, baches, bajadas =====
  { a: W_(467.76), b: AV, tr: "whip", ov: (t) => <K.DropChips t={t} out={472.6} x={1240} y={160} items={[{ at: A.topes, txt: "TOPES" }, { at: A.baches, txt: "BACHES" }, { at: A.bajadas, txt: "BAJADAS" }]} /> },
  // ===== 472,7 · discos, balatas, bujes =====
  { a: 472.69, b: img("m6_micrometro", [1.04, 1.12], [50, 50]), tr: "whipR", ov: (t) => <K.ZoneBar t={t} a={A.micrometro} out={A.balatas - 0.2} x={960} y={720} to={0.97} title="GROSOR DEL DISCO" read="EN EL MÍNIMO" left="NUEVO" right="MÍNIMO" /> },
  { a: A.balatas - 0.15, b: img("m6_balatas", [1.04, 1.12], [50, 45]), tr: "whipV", ov: (t) => <BigNum t={t} at={A.mm3} text="3 MM" size={220} x={1400} y={330} out={A.bujes - 0.3} sub="YA TOCABA" /> },
  { a: A.bujes - 0.2, b: img("m6_bujes", [1.05, 1.15], [50, 50]), tr: "iris", px: [1400, 330], ov: (t) => <Tag t={t} at={A.bujes + 0.2} x={960} y={560} dx={260} dy={-220} text="BUJES DE LOS BRAZOS" sub="AQUÍ SÍ…" col={COL.red} out={484.0} size={54} /> },
  // ===== avatar · agrietados =====
  { a: W_(484.06), b: AV, tr: "whip", ov: (t) => <>
    <K.Sello t={t} a={A.agrietados} out={A.cuartea + 1.5} text="AGRIETADOS" x={1400} y={260} col={COL.red} rot={-6} size={96} />
    <K.DropChips t={t} out={489.7} x={1240} y={470} items={[{ at: A.cuartea, txt: "CALOR", col: COL.red }, { at: A.cuartea + 1.3, txt: "CADA TOPE DE LADO", col: "#ffcf3a" }]} />
  </> },
  // ===== 489,8 · la suspensión desde abajo =====
  { a: 489.85, b: WD, tr: "portal", px: [1400, 260], ov: (t) => <>
    <Tag t={t} at={A.vibraba} x={sp(t, PT.brake).x} y={sp(t, PT.brake).y} dx={260} dy={-200} text="VIBRA AL FRENAR" col={COL.red} out={A.amort - 0.2} size={52} />
    <K.CheckList t={t} out={501.6} x={1240} y={150} items={[{ at: A.amort, txt: "AMORTIGUADORES" }, { at: A.soportes, txt: "SOPORTES DEL MOTOR" }, { at: A.bujesDiscos, txt: "BUJES · DISCOS · BALATAS", bad: true }]} size={46} />
  </> },
  // ===== avatar · 6 a 9 mil, mantenimiento ≠ defecto =====
  { a: W_(501.69), b: AV, tr: "whip", ov: (t) => <>
    <BigNum t={t} at={A.m69} text="$6–9 MIL" size={140} x={1360} y={240} out={A.noDefecto - 0.3} col={COL.amber} edge="#5a3a10" sub="CON MANO DE OBRA" />
    <K.Sello t={t} a={A.noDefecto - 0.2} out={507.3} text="MANTENIMIENTO" sub="NO ES DEFECTO" x={1380} y={280} col="#2ee86a" rot={-5} size={80} />
  </> },
  // ===== 507,4 · la transmisión de doble embrague =====
  { a: 507.36, b: WD, tr: "whipR", ov: (t) => <>
    <Tag t={t} at={A.dobleEmb} x={sp(t, [-1.42, 0.33, -0.5]).x} y={sp(t, [-1.42, 0.33, -0.5]).y} dx={260} dy={-200} text="DOBLE EMBRAGUE" col={COL.ice} out={A.muestra - 0.2} size={56} />
  </> },
  { a: A.muestra - 0.1, b: img("m6_muestra", [1.04, 1.12], [50, 45]), tr: "portal", px: [960, 540], ov: (t) => <>
    <K.VersusCards t={t} a={A.oscuro - 0.3} b={A.oscuro + 0.2} out={518.3} y={760} L={{ icon: "red", t1: "SANO", t2: "ROJO, SIN OLOR", ok: true }} R={{ icon: "brown", t1: "ESTE", t2: "OSCURO · QUEMADO", ok: false }} />
    <K.Sello t={t} a={A.nunca} out={518.3} text="NUNCA SE CAMBIÓ" x={960} y={280} col={COL.red} rot={-4} size={86} />
  </> },
  // ===== avatar · «es de por vida» =====
  { a: W_(518.42), b: AV, tr: "whip", ov: (t) => <Card3D id="img_m6_agencia" x={1120} y={160} w={660} h={372} ry={-16} o={e(t, A.porVida - 0.2, A.porVida + 0.1) * (1 - e(t, 522.2, 522.5))} label="«ES DE POR VIDA»" labelCol={COL.amber} /> },
  // ===== 522,6 · nada es de por vida =====
  { a: 522.64, b: { k: "w", bg: 12, frz: 518.3 }, tr: "whipR", ov: (t) => <>
    <K.StrikeQuote t={t} a={522.8} hit={A.enCuarenta + 1.6} out={A.m3 - 0.3} text="de por vida" x={960} y={420} fix="CADA 60,000 KM" />
    <K.Bills t={t} a={A.m3} b={A.reparada + 1.2} out={534.6} x={960} y={900} l={[2, "$3 MIL"]} r={[15, "$40–50 MIL"]} />
  </> },
  // ===== avatar · haga la cuenta =====
  { a: W_(534.66), b: AV, tr: "whip", ov: (t) => <K.Sello t={t} a={A.cuenta} out={A.que - 0.2} text="HAGA LA CUENTA" x={1380} y={280} col={COL.amber} rot={-6} size={86} /> },
  // ===== 539,4 · el veredicto =====
  { a: 539.42, b: WD, tr: "portal", px: [1380, 280], ov: (t) => <>
    <K.Sello t={t} a={A.desechable} out={A.bienHecho - 0.2} text="¿DESECHABLE?" x={1400} y={250} col={COL.red} rot={-6} size={90} />
    <K.Score t={t} title="LO QUE ENCONTRÉ" out={551.5} x={1040} y={180} rows={[{ at: A.bienHecho, txt: "MOTOR BIEN HECHO", ok: true }, { at: A.soldRobot, txt: "SOLDADURAS DE ROBOT", ok: true }, { at: A.cableado, txt: "CABLEADO SELLADO", ok: true }]} />
  </> },
  // ===== avatar · nadie le explicó =====
  { a: W_(551.6), b: AV, tr: "whip", ov: (t) => <Tag t={t} at={A.nadieExplico} x={1500} y={700} dx={-100} dy={-240} text="NADIE LE EXPLICÓ" sub="CÓMO SE CUIDA" col={COL.amber} out={556.0} size={56} /> },
  // ===== 556,1 · la balanza =====
  { a: 556.09, b: { k: "w", bg: 12 }, tr: "whipR", ov: (t) => <>
    <K.Balance t={t} a={556.2} tip={A.malCuidado} out={567.0} x={960} y={300} items={[{ at: A.a15, txt: "ACEITE DE 15 MIL" }, { at: A.deVida, txt: "«DE POR VIDA»" }, { at: A.clip10, txt: "CLIP DE $10" }]} />
    <Tag t={t} at={A.cualquier} x={960} y={130} dx={0} dy={0} text="PASA CON CUALQUIER MARCA" col={COL.ink} out={567.0} size={52} />
  </> },
  // ===== avatar · refacciones =====
  { a: W_(567.14), b: AV, tr: "whip", ov: (t) => <Tag t={t} at={A.refacciones} x={1500} y={700} dx={-100} dy={-240} text="LAS REFACCIONES" col={COL.red} out={572.9} size={58} /> },
  // ===== 573 · 11 días → la lista de las 7 =====
  { a: 573.0, b: img("m7_proveedor", [1.03, 1.1], [50, 45]), tr: "whipR", ov: (t) => <>
    <K.Calendar t={t} a={A.dias11 - 0.3} out={A.pregunte + 1} days={11} x={1180} y={130} label="ESPERANDO LA PIEZA" />
    <Tag t={t} at={A.pregunte} x={700} y={520} dx={-200} dy={-200} text="¿QUÉ TAN RÁPIDO LLEGAN?" sub="PREGUNTE EN SU CIUDAD" col={COL.amber} out={A.prometido - 0.2} size={50} />
  </> },
  { a: A.prometido - 0.1, b: { k: "w", bg: 14, frz: 567 }, tr: "iris", px: [700, 520], ov: (t) => <>
    <BigNum t={t} at={A.prometido} text="LO PROMETIDO" size={110} x={960} y={150} out={587.4} col={COL.amber} edge="#5a3a10" />
    <K.SevenBook t={t} a={A.sieteCosas} out={587.4} hi={t > 587.2 ? 1 : 0} x={640} y={270} />
  </> },
  // ===== avatar · 1. historial =====
  { a: W_(587.48), b: AV, tr: "whip", ov: (t) => <K.Padlock t={t} a={A.historial - 0.1} open={1e9} out={591.2} x={1500} y={330} n="1" /> },
  // ===== 591,3 · facturas → arranque en frío =====
  { a: 591.35, b: img("m8_facturas", [1.03, 1.1], [50, 50]), tr: "whipR", ov: (t) => <Tag t={t} at={A.cambios15} x={980} y={560} dx={260} dy={-200} text="¿CADA 15,000 O MÁS?" sub="CUIDADO: TURBO Y CADENA" col={COL.red} out={A.arranque - 0.3} size={52} /> },
  { a: A.arranque - 0.3, b: WD, tr: "portal", px: [980, 560], ov: (t) => <>
    <BigNum t={t} at={A.arranque} text="2 · EN FRÍO" size={120} x={1320} y={180} out={601.9} col={COL.ice} edge="#0a2a40" />
    <Tag t={t} at={A.pidale} x={sp(t, PT.chain).x} y={sp(t, PT.chain).y} dx={-280} dy={-220} text="QUE NO LO PRENDA ANTES" col={COL.amber} out={601.9} size={48} />
  </> },
  // ===== avatar · matraca = cadena =====
  { a: W_(601.97), b: AV, tr: "whip", ov: (t) => <K.Sello t={t} a={A.oyeMatraca + 0.6} out={606.2} text="MATRACA = CADENA" x={1380} y={280} col={COL.red} rot={-5} size={80} /> },
  // ===== 606,3 · 3. escáner, 4. carcasa y mangueras =====
  { a: 606.27, b: img("m8_escaner500", [1.04, 1.12], [50, 50]), tr: "whipR", ov: (t) => <>
    <BigNum t={t} at={A.escaneelo} text="3" size={200} x={260} y={240} out={A.cuatro - 0.2} col={COL.ice} edge="#0a2a40" />
    <K.Lcd t={t} a={A.escaner500} out={A.cuatro - 0.2} x={1160} y={180} lines={["FALLAS GUARDADAS:", "P0302 FALLA CIL 2", "FOQUITO: APAGADO"]} />
  </> },
  { a: A.cuatro - 0.15, b: img("m8_mangueras", [1.04, 1.12], [50, 50]), tr: "whipV", ov: (t) => <BigNum t={t} at={A.cuatro} text="4" size={200} x={260} y={240} out={617.1} col={COL.amber} edge="#5a3a10" sub="CARCASA Y MANGUERAS" /> },
  // ===== avatar · costra blanca, 5 (candado) =====
  { a: W_(617.2), b: AV, tr: "whip", ov: (t) => <K.Padlock t={t} a={A.busque} open={A.cinco + 0.5} out={620.9} x={1480} y={330} n="5" /> },
  // ===== 621 · 5. aceite de la transmisión → 6. elevador =====
  { a: 620.99, b: WD, tr: "portal", px: [1480, 330], ov: (t) => <>
    <K.Sello t={t} a={A.casiNadie} out={A.pregunteAceite + 1.2} text="LA QUE CASI NADIE SABE" x={1360} y={200} col={COL.amber} rot={-4} size={60} />
    <Tag t={t} at={A.pregunteAceite} x={sp(t, [-1.42, 0.33, -0.5]).x} y={sp(t, [-1.42, 0.33, -0.5]).y} dx={260} dy={-160} text="ACEITE DE LA TRANSMISIÓN" col={COL.ice} out={A.negocie} size={50} />
    <K.Sello t={t} a={A.negocie} out={A.seis - 0.2} text="+60,000 → NEGOCIE" x={1300} y={820} col={COL.red} rot={-5} size={70} />
    <BigNum t={t} at={A.seis} text="6 · ELEVADOR" size={120} x={960} y={160} out={634.0} col={COL.ink} />
  </> },
  // ===== avatar · bujes, discos, uniones; 10 minutos =====
  { a: W_(634.09), b: AV, tr: "whip", ov: (t) => <K.DropChips t={t} out={638.9} x={1240} y={150} items={[{ at: A.revise, txt: "BUJES" }, { at: A.revise + 0.6, txt: "DISCOS" }, { at: A.revise + 1.2, txt: "UNIONES DEL PISO" }, { at: A.min10, txt: "10 MINUTOS", col: "#2ee86a" }]} /> },
  // ===== 639 · 7. la refaccionaria =====
  { a: 639.03, b: img("m8_lote", [1.03, 1.1], [45, 50]), tr: "whipR", ov: (t) => <>
    <BigNum t={t} at={A.siete} text="7" size={200} x={260} y={240} out={649.8} col={COL.amber} edge="#5a3a10" sub="ANTES DE FIRMAR" />
    <K.Call t={t} a={A.llame} out={649.8} x={1340} y={150} who="REFACCIONARIA" rows={[{ at: A.precioTiempo, txt: "¿PRECIO?" }, { at: A.precioTiempo + 0.7, txt: "¿TIEMPO?" }, { at: 649.3, txt: "CARCASA DE TERMOSTATO" }]} />
  </> },
  // ===== avatar · tres semanas =====
  { a: W_(649.89), b: AV, tr: "whip", ov: (t) => <>
    <K.Sello t={t} a={A.semanas} out={654.6} text="3 SEMANAS" sub="ASÍ VA A VIVIR" x={1380} y={280} col={COL.red} rot={-6} size={96} />
  </> },
  // ===== 654,7 · lo que se le hizo y se va =====
  { a: 654.71, b: img("m9_entrega", [1.03, 1.1], [50, 50]), tr: "portal", px: [1380, 280], ov: (t) => <Tag t={t} at={A.yaEse + 0.3} x={560} y={790} dx={20} dy={0} text="EL CARRO QUE ME DEJÓ CALLADO" col={COL.amber} out={A.hicimos - 0.3} size={54} /> },
  { a: A.hicimos - 0.25, b: WD, tr: "whipR", ov: (t) => <>
    <K.RepairOrder t={t} done={A.tranquilo} out={666.7} x={1220} y={120} rows={[{ at: A.hicimos + 0.6, txt: "ACEITE" }, { at: A.limpiezaV, txt: "LIMPIEZA DE VÁLVULAS" }, { at: A.laCarcasa, txt: "CARCASA" }, { at: A.laCarcasa + 0.6, txt: "CLIP" }, { at: A.losFrenos, txt: "FRENOS" }, { at: A.losFrenos + 0.7, txt: "BUJES" }]} />
    <K.Sello t={t} a={A.yaNo} out={666.7} text="YA NO TIRONEA" x={760} y={860} col="#2ee86a" rot={-4} size={80} />
  </> },
  // ===== avatar · su tarea =====
  { a: W_(666.76), b: AV, tr: "whip", ov: (t) => <K.Sello t={t} a={A.tarea + 0.3} out={671.4} text="TAREA" sub="LA ÚLTIMA FACTURA" x={1420} y={280} col={COL.amber} rot={-7} size={110} /> },
  // ===== 671,5 · la factura → CTA =====
  { a: 671.5, b: img("m9_factura", [1.04, 1.12], [50, 50]), tr: "whipR", ov: (t) => <Tag t={t} at={A.cadaCuantos} x={1000} y={560} dx={260} dy={-200} text="¿CADA CUÁNTOS KM?" sub={"SEA CHINO O NO"} col={COL.amber} out={A.nadaMas - 0.4} size={58} /> },
  { a: A.nadaMas - 0.3, b: WD, tr: "iris", px: [1000, 560], ov: (t) => <>
    <K.SubBell t={t} a={A.suscribase - 0.1} bell={A.campanita - 0.1} out={A.cuenteme - 0.2} x={960} y={300} />
  </> },
  // ===== 683,4 · la pregunta (la voz nueva no calza con los labios de la ventana → foto, sin avatar) =====
  { a: A.cuenteme - 0.1, b: img("m9_cafe", [1.03, 1.08], [50, 45]), tr: "portal", px: [960, 300], ov: (t) => <K.Question t={t} a={A.cuenteme + 0.2} out={686.9} text="¿USTED TIENE UN CARRO CHINO?" x={960} y={520} /> },
  // ===== 687 · el próximo video =====
  { a: 686.96, b: img("m9_bajada", [1.03, 1.12], [50, 55]), tr: "whipR", ov: (t) => <K.NextUp t={t} a={A.proximo + 0.3} out={697.8} title="EL ERROR EN LAS BAJADAS" sub="LO QUE LE ESTÁ ACABANDO LA TRANSMISIÓN" x={1240} y={170} /> },
  // ===== avatar · aquí lo espero =====
  { a: W_(697.94), b: AV, tr: "whip", },
  // ===== 701,7 · la cortina baja =====
  { a: 701.73, b: WD, tr: "portal", px: [1300, 360] },
];
SEGS.sort((p, q) => p.a - q.a);

const TD = 0.42; // duración de la transición (termina 0,05 s después del borde)
const layer = (sg: Seg, i: number, t: number) => {
  const nx = SEGS[i + 1]?.a ?? FIN + 1;
  const b = sg.b;
  const tc = Math.max(sg.a, Math.min(t, nx - 0.01));
  let base: React.ReactNode;
  if (b.k === "av") base = <Avatar t={t} />;
  else if (b.k === "w") base = <World t={b.frz ?? tc} bg={b.bg} />;
  else if (b.k === "img") base = <Shot k={b.id} t={t} a={sg.a} z={b.z} o={b.o} dur={nx - sg.a} />;
  else if (b.k === "bore") base = <K.Borescope t={t} a={sg.a} img={b.id} label={b.label} />;
  else base = <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #121a24, #04060a)" }} />;
  return <AbsoluteFill key={"L" + i}>{base}{sg.ov?.(t, sg.a, nx)}</AbsoluteFill>;
};

export const Resto: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ background: "#05070b" }}>
    <RestoBody t={t} />
    {t > 699 && <K.Signature t={t} a={A.manosNegras - 0.2} b={A.limpia - 0.3} out={FIN} l1="las manos negras," l2="la verdad limpia" />}
    {t > FIN - 0.5 && <AbsoluteFill style={{ background: "#000", opacity: e(t, FIN - 0.5, FIN) }} />}
  </AbsoluteFill>
);
const RestoBody: React.FC<{ t: number }> = ({ t }) => {
  let i = SEGS.findIndex((sg, j) => t >= sg.a && t < (SEGS[j + 1]?.a ?? 1e9));
  if (i < 0) i = 0;
  const nx = SEGS[i + 1];
  // transición entrante (empieza TD antes del borde del tramo que viene)
  if (nx && t >= nx.a - TD + 0.05) {
    const k = ei(t, nx.a - TD + 0.05, nx.a + 0.05);
    const prev = layer(SEGS[i], i, t), cur = layer(nx, i + 1, t);
    return <AbsoluteFill style={{ background: "#05070b" }}>{trans(nx, k, prev, cur)}</AbsoluteFill>;
  }
  if (t < SEGS[i].a + 0.05 && i > 0) {
    const k = ei(t, SEGS[i].a - TD + 0.05, SEGS[i].a + 0.05);
    return <AbsoluteFill style={{ background: "#05070b" }}>{trans(SEGS[i], k, layer(SEGS[i - 1], i - 1, t), layer(SEGS[i], i, t))}</AbsoluteFill>;
  }
  return (
    <AbsoluteFill style={{ background: "#05070b" }}>
      {layer(SEGS[i], i, t)}
      <Flash t={t} at={SEGS[i].a} col="#fff6e0" peak={0.18} w={0.25} />
    </AbsoluteFill>
  );
};
const trans = (sg: Seg, k: number, prev: React.ReactNode, cur: React.ReactNode) => {
  const [x, y] = sg.px ?? [960, 540];
  switch (sg.tr) {
    case "iris": return <Iris k={k} x={x} y={y} prev={prev} cur={cur} />;
    case "portal": return <PortalT k={k} x={x} y={y} prev={prev} cur={cur} />;
    case "whipR": return <Whip k={k} prev={prev} cur={cur} dir={1} />;
    case "whipV": return <Whip k={k} prev={prev} cur={cur} vert />;
    default: return <Whip k={k} prev={prev} cur={cur} />;
  }
};
void FONT; void extrude;
