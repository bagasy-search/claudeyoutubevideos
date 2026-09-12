// cues_vslcurso.gen.tsx — GENERADO por build_vslcurso.mjs. NO editar a mano.
import React from "react";
import { Clip, Foto, AntesDespues, Cierre, CifraGrande, Duelo, Escalera, Frase, Lista, Pasos, Rotulo } from "../vslcurso/Piezas";
import { Mov1Comentarios } from "../vslcurso/Mov1Comentarios";
import { Mov2Numeros } from "../vslcurso/Mov2Numeros";
import { Mov3Cuenta } from "../vslcurso/Mov3Cuenta";
import { Mov4Origenes } from "../vslcurso/Mov4Origenes";
import { Mov5Curso } from "../vslcurso/Mov5Curso";
import { Mov6Cierre } from "../vslcurso/Mov6Cierre";

export type Cue = { key: string; start: number; dur: number; el: () => React.ReactNode };

/** capa BASE — b-roll a sangre. Donde no hay cue, el fondo es el avatar (AVATAR_WINDOWS). */
export const CUES: Cue[] = [
  { key: "b000", start: 525, dur: 32, el: () => <Foto src="img/vslp01.png" seed={525} /> },
  { key: "b001", start: 557, dur: 30, el: () => <Foto src="img/vslp03.png" seed={557} /> },
  { key: "b002", start: 587, dur: 28, el: () => <Foto src="img/vslp04.png" seed={587} /> },
  { key: "b003", start: 615, dur: 33, el: () => <Clip src="broll/vslcurso_001.mp4" seed={615} /> },
  { key: "b004", start: 761, dur: 61, el: () => <Clip src="broll/vslcurso_008.mp4" seed={761} /> },
  { key: "b005", start: 822, dur: 50, el: () => <Foto src="img/vsls04.png" seed={822} /> },
  { key: "b006", start: 1470, dur: 191, el: () => <Foto src="img/vslc03.png" seed={1470} /> },
  { key: "b007", start: 1661, dur: 90, el: () => <Foto src="img/vsls04.png" seed={1661} /> },
  { key: "b008", start: 1865, dur: 172, el: () => <Clip src="broll/vslcurso_031.mp4" seed={1865} /> },
  { key: "b009", start: 2751, dur: 123, el: () => <Foto src="img/vslm03.png" seed={2751} /> },
  { key: "b010", start: 2966, dur: 124, el: () => <Foto src="img/vslm01.png" seed={2966} /> },
  { key: "b011", start: 3090, dur: 69, el: () => <Foto src="img/vslx01.png" seed={3090} /> },
  { key: "b012", start: 3159, dur: 63, el: () => <Clip src="broll/vslcurso_037.mp4" seed={3159} /> },
  { key: "b013", start: 3762, dur: 138, el: () => <Foto src="img/vsls01.png" seed={3762} /> },
  { key: "b014", start: 3900, dur: 129, el: () => <Foto src="img/vsls04.png" seed={3900} /> },
  { key: "b015", start: 4029, dur: 171, el: () => <Foto src="img/vslx02.png" seed={4029} /> },
  { key: "b016", start: 4200, dur: 150, el: () => <Foto src="img/vslh01.png" seed={4200} /> },
  { key: "b017", start: 4350, dur: 111, el: () => <Foto src="img/vslg01.png" seed={4350} /> },
  { key: "b018", start: 4677, dur: 84, el: () => <Clip src="broll/vslcurso_008.mp4" seed={4677} /> },
  { key: "b019", start: 4761, dur: 189, el: () => <Foto src="img/vslk01.png" seed={4761} /> },
  { key: "b020", start: 4950, dur: 102, el: () => <Foto src="img/vsls04.png" seed={4950} /> },
  { key: "b021", start: 5052, dur: 210, el: () => <Foto src="img/vslc01.png" seed={5052} /> },
  { key: "b022", start: 5262, dur: 201, el: () => <Foto src="img/vslx02.png" seed={5262} /> },
  { key: "b023", start: 6066, dur: 213, el: () => <Foto src="img/vslx01.png" seed={6066} /> },
  { key: "b024", start: 6279, dur: 87, el: () => <Foto src="img/vsls04.png" seed={6279} /> },
  { key: "b025", start: 6546, dur: 105, el: () => <Clip src="broll/vslcurso_043.mp4" seed={6546} /> },
  { key: "b026", start: 6761, dur: 121, el: () => <Foto src="img/vslc03.png" seed={6761} /> },
  { key: "b027", start: 7002, dur: 108, el: () => <Foto src="img/vsls02.png" seed={7002} /> },
  { key: "b028", start: 7110, dur: 96, el: () => <Foto src="img/vslk01.png" seed={7110} /> },
  { key: "b029", start: 7206, dur: 90, el: () => <Clip src="broll/vslcurso_013.mp4" seed={7206} /> },
  { key: "b030", start: 7296, dur: 75, el: () => <Clip src="broll/vslcurso_037.mp4" seed={7296} /> },
  { key: "b031", start: 7371, dur: 72, el: () => <Foto src="img/vslp01.png" seed={7371} /> },
  { key: "b032", start: 7443, dur: 69, el: () => <Foto src="img/vsls04.png" seed={7443} /> },
];

/** los 6 MOVIMIENTOS — cada uno es UNA escena continua de 4-6 actos, con su propia atmósfera y
 *  la cámara del Escenario (función del frame GLOBAL, así que no reinician nada). Van ENCIMA de
 *  la base y tapan el cuadro entero. */
export const MOVIMIENTOS: Cue[] = [
  { key: "m0", start: 180, dur: 345, el: () => <Mov1Comentarios desde={180} /> },   // los dos comentarios REALES de YouTube
  { key: "m1", start: 872, dur: 440, el: () => <Mov2Numeros desde={872} /> },   // 80 · 150 · 300 — el carrusel 3D de precios
  { key: "m2", start: 2163, dur: 399, el: () => <Mov3Cuenta desde={2163} /> },   // la cuenta: 600 · 800 · 1.200 al mes
  { key: "m3", start: 3222, dur: 540, el: () => <Mov4Origenes desde={3222} /> },   // los tres orígenes del agua + el diagnóstico
  { key: "m4", start: 5463, dur: 522, el: () => <Mov5Curso desde={5463} /> },   // el curso por dentro: 16 clases + los documentos
  { key: "m5", start: 7599, dur: 489, el: () => <Mov6Cierre desde={7599} /> },   // garantía → las casas → alguien va a cobrar
];

/** capa OVER — las piezas sueltas, siempre POR ENCIMA de todo. */
export const OVERLAYS: Cue[] = [
  { key: "o00", start: 581, dur: 69, el: () => <Frase lineas={["La necesidad","YA EXISTE."]} blurSrc={"img/vslp03_blur.jpg"} desde={581} /> },
  { key: "o01", start: 1338, dur: 131, el: () => <Rotulo texto={"El precio está justo debajo de este video"} nota={"compáralo con esos números"} flecha={true} desde={1338} /> },
  { key: "o02", start: 1472, dur: 187, el: () => <Duelo eyebrow={"La comparación que importa"} titulo={"No lo compares con otro curso"} izq={{"rotulo":"Otro curso","sub":"tres horas de video que nunca vas a usar","img":"img/vslg02.png"}} der={{"rotulo":"Un trabajo cobrado","sub":"lo que te pagan por resolver una pared","img":"img/vsls04.png"}} blurSrc={"img/vslc03_blur.jpg"} desde={1472} /> },
  { key: "o03", start: 1664, dur: 85, el: () => <CifraGrande eyebrow={"Un servicio que puedes cobrar"} valor={150} sufijo={" dólares"} apoyo={"Por resolver una sola pared."} blurSrc={"img/vsls04_blur.jpg"} desde={1664} /> },
  { key: "o04", start: 1869, dur: 166, el: () => <Frase lineas={["La pregunta no es cuánto cuesta.","ES CUÁNTOS TRABAJOS."]} desde={1869} /> },
  { key: "o05", start: 2754, dur: 119, el: () => <Frase lineas={["No te prometo mil dólares.","TE MUESTRO LA MATEMÁTICA."]} blurSrc={"img/vslm03_blur.jpg"} desde={2754} /> },
  { key: "o06", start: 2985, dur: 104, el: () => <Rotulo texto={"Esto no es por lo que te pagan"} nota={"el líquido que compras en la ferretería"} blurSrc={"img/vslm01_blur.jpg"} desde={2985} /> },
  { key: "o07", start: 3768, dur: 258, el: () => <Pasos eyebrow={"El orden del oficio"} titulo={"Lo que aprendes, en orden"} pasos={[{"rotulo":"Diagnosticar","sub":"qué le pasa a la pared","img":"img/ic_diag.png"},{"rotulo":"Tratar","sub":"qué comprar y cómo aplicarlo","img":"img/ic_trat.png"},{"rotulo":"Cobrar","sub":"cuánto cobrar y cómo","img":"img/ic_pres.png"},{"rotulo":"Conseguir","sub":"de dónde salen los clientes","img":"img/ic_cobr.png"}]} en={[21,78,117,162]} blurSrc={"img/vsls01_blur.jpg"} desde={3768} /> },
  { key: "o08", start: 4029, dur: 432, el: () => <Lista eyebrow={"También aprendes"} titulo={"Lo que separa a un oficio de un favor"} items={["Qué trabajos aceptar y cuáles rechazar","Cómo hacer la visita","Cómo calcular un presupuesto","Qué responder cuando te dicen que es caro","De dónde salen tus primeros clientes"]} en={[18,126,162,210,303]} blurSrc={"img/vslx02_blur.jpg"} desde={4029} /> },
  { key: "o09", start: 4764, dur: 186, el: () => <AntesDespues eyebrow={"Tu primer objetivo"} titulo={"Un trabajo bien hecho, una foto, una recomendación"} antes={"img/vslad_ad4_antes.png"} despues={"img/vslad_ad4_despues.png"} blurSrc={"img/vslk01_blur.jpg"} desde={4764} /> },
  { key: "o10", start: 5052, dur: 207, el: () => <Escalera eyebrow={"Después empiezas a construir"} items={[{"valor":"4","nota":"trabajos al mes"},{"valor":"6","nota":"a mejores precios"},{"valor":"8","nota":"por recomendación"}]} en={[27,72,96]} blurSrc={"img/vslc01_blur.jpg"} desde={5052} /> },
  { key: "o11", start: 5262, dur: 198, el: () => <Lista eyebrow={"Quién guarda tu número"} titulo={"Los que necesitan a alguien cuando aparece este problema"} items={["Pintores","Plomeros","Administradores de edificios"]} en={[3,24,51]} blurSrc={"img/vslx02_blur.jpg"} desde={5262} /> },
  { key: "o12", start: 6069, dur: 207, el: () => <Duelo eyebrow={"Lo que cambia"} titulo={"Estás comprando un sistema"} izq={{"rotulo":"Mirar la pared","sub":"y no saber qué hacer con ella","img":"img/vslx01.png"}} der={{"rotulo":"Diagnosticarla y cobrarla","sub":"con el cuaderno y el medidor en la mano","img":"img/vsls03.png"}} blurSrc={"img/vslx01_blur.jpg"} desde={6069} /> },
  { key: "o13", start: 6459, dur: 90, el: () => <Rotulo texto={"Vuelve a mirar el precio de abajo"} flecha={true} desde={6459} /> },
  { key: "o14", start: 6552, dur: 96, el: () => <CifraGrande eyebrow={"Uno solo de estos trabajos"} valor={300} sufijo={" dólares"} apoyo={"Los más grandes llegan ahí, según la zona y la dificultad."} desde={6552} /> },
  { key: "o15", start: 6761, dur: 121, el: () => <Frase lineas={["El dinero de hoy,","O UNA HABILIDAD."]} blurSrc={"img/vslc03_blur.jpg"} desde={6761} /> },
  { key: "o16", start: 7005, dur: 198, el: () => <Lista eyebrow={"Antes de que decidas"} titulo={"Esto no es dinero fácil"} items={["Vas a tener que aprender","Vas a tener que trabajar bien","Vas a tener que salir a buscar los primeros clientes"]} en={[12,63,120]} blurSrc={"img/vsls02_blur.jpg"} desde={7005} /> },
  { key: "o17", start: 8160, dur: 169, el: () => <Cierre eyebrow={"El curso"} titulo={"¿Vas a ser tú?"} bullet={"16 clases, tres horas y los documentos que vas a usar en la casa del cliente"} cta={"EL BOTÓN ESTÁ JUSTO DEBAJO"} img={"img/vslg02.png"} desde={8160} /> },
];
