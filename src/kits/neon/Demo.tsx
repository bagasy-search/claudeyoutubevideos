// Escena de prueba del kit neon (~40 s): los 12 recursos nx-* en UN solo plano, sin cortes. Tiempos sintéticos desde
// el guion (palabrasDeGuion); con voz real se reemplaza por su words.json y todo se re-ancla solo (at("frase")).
// Mundo: cada área a ≥1300 px de la anterior, unida por un hilo de luz; al final la cámara vuelve al bucle ancla y en
// el vuelo se ve el mundo entero.
import React from "react";
import { Hilo, makeCam, makeTiempo, palabrasDeGuion, quieta, Toma } from "./base";
import { FormatoPartido, SfxTrack, AvatarSpec } from "./Layout";
import { BucleNeon, NumeroCapitulo, ResumenBucle, vueloBucle, geoBucle } from "./Bucle";
import { CollageTitulo, TituloNeon } from "./Titulo";
import { ObjetoNeon, bordeObjeto } from "./Objetos";
import { CelularUI } from "./Celular";
import { FichasCasino } from "./Fichas";
import { HojaGuion } from "./Hoja";
import { ClipTarjeta } from "./ClipTarjeta";
import { CartaGira } from "./Carta";
import { CaminoAB } from "./Camino";
import { GraficoLinea } from "./Grafico";
import { pista } from "./sonidos";

export const GUION = [
  "Así funciona la trampa de los videos cortos.",
  "Tu cerebro pide premio, y la app le da una tragamonedas.",
  "Uno: la sorpresa.",
  "Cada vez que deslizás, puede salir algo mejor.",
  "Hacen falta tres cosas: promesa, duda y giro.",
  "El guion: yo voy a romper la regla.",
  "Este creador llegó a dos millones.",
  "¿Por qué no podés parar?",
  "Creías que ibas a mirar uno, y terminaste en otro.",
  "Lo bueno sube y baja; lo excelente te vuelve a enganchar.",
  "Repasemos: promesa, duda, giro, enganche.",
].join(" ");

const tiempo = makeTiempo(palabrasDeGuion(GUION));
const T = tiempo.at;
export const DEMO_FRAMES = Math.ceil((tiempo.fin + 1.6) * 30);

// ───────── mundo ─────────
const BUC = { x: 0, y: 200, a: 300 };
const g = geoBucle(BUC.a);
const enBucle = (u: number): [number, number] => { const p = g.at(u); return [BUC.x + p.x, BUC.y + p.y]; };
const CER = { x: 1300, y: 150, tam: 360, forma: "cerebro" as const };
const TRA = { x: 1300, y: 640, tam: 380, forma: "tragamonedas" as const };
const CEL = { x: 300, y: 960, ancho: 300 };
const FIC = { x: 2400, y: 1150 };
const HOJ = { x: 3650, y: 990, ancho: 760, alto: 820 };
const CLI = { x: 4850, y: 800, ancho: 680 };
const CAR = { x: 6250, y: 900, w: 250 };
const CAM = { x: 7750, y: 950, ancho: 1100, alto: 720 };
const GRA = { x: 9250, y: 960 };

// ───────── tiempos (todo anclado a la palabra) ─────────
const t = {
  titulo: T("Así") - 0.15, rojo: T("trampa"), colapso: T("videos"),
  cerebro: T("cerebro"), sinapsis: T("premio"), app: T("app"), palanca: T("da") + 0.05,
  uno: T("Uno"), cada: T("Cada"), deslizas: T("deslizás"), mejor: T("mejor"), puede: T("puede"), salir: T("salir"),
  hacen: T("Hacen"), promesa: T("promesa"), duda: T("duda"), giro: T("giro"),
  guion: T("El guion"), yo: T("yo voy"), romper: T("romper"),
  este: T("Este"), dos: T("dos millones"),
  porque: T("Por qué"), podes: T("podés"), parar: T("parar"),
  creias: T("Creías"), ibas: T("ibas"), terminaste: T("terminaste"),
  bueno: T("Lo bueno"), excelente: T("excelente"),
  repasemos: T("Repasemos"),
};
const tBucle = t.colapso + 0.25;
const R = { promesa: T("promesa", t.repasemos), duda: T("duda", t.repasemos), giro: T("giro", t.repasemos), enganche: T("enganche", t.repasemos) };

// ───────── cámara ─────────
const tomas: Toma[] = [
  [0, 0, 170, 1.0],
  [t.cerebro - 0.55, 0, 200, 1.1],
  [t.cerebro + 0.35, 1300, 170, 1.15],
  [t.app - 0.3, 1300, 220, 1.1],
  [t.app + 0.5, 1300, 440, 0.95],
  [t.uno - 0.55, 1300, 450, 0.98, 0, "in"],
  ...vueloBucle(BUC, t.uno, t.cada - 0.2, 0.53, 0.72, 4.2, [0, 230]), // arriba del lóbulo derecho: el tubo pasa abajo, el número arriba
  [t.cada + 0.4, CEL.x, 900, 0.95],
  [t.hacen - 0.35, CEL.x, 920, 1.0],
  [t.hacen + 0.4, FIC.x - 150, FIC.y - 40, 0.9],
  [t.guion - 0.35, FIC.x - 150, FIC.y - 20, 0.95],
  [t.guion + 0.4, HOJ.x, 1000, 0.98],
  [t.este - 0.35, HOJ.x, 1000, 1.03],
  [t.este + 0.4, CLI.x, 900, 1.0],
  [t.porque - 0.35, CLI.x, 910, 1.05],
  [t.porque + 0.35, CAR.x, 790, 1.0],
  [t.creias - 0.05, CAR.x, 800, 1.06],
  [t.creias + 0.6, CAM.x, 880, 0.9],
  [t.bueno - 0.35, CAM.x, 890, 0.95],
  [t.bueno + 0.35, GRA.x, 900, 0.93],
  [t.repasemos - 0.15, GRA.x, 920, 0.98],
  ...quieta(t.repasemos + 1.0, tiempo.fin + 1.6, BUC.x, BUC.y, 1.25, 0.06),
];
const cam = makeCam(tomas);

// ───────── sonido (los mismos tiempos que los componentes) ─────────
const s = pista();
s.titulo(t.titulo, 7);
s.collage({ t0: 0.35, tRojo: t.rojo, tColapso: t.colapso });
s.bucle({ t0: tBucle });
s.vuelo(t.cerebro - 0.5);
s.objeto({ t0: t.cerebro, colgado: true, forma: "cerebro", activo: t.sinapsis });
s.objeto({ t0: t.app, colgado: true, forma: "tragamonedas", activo: t.palanca });
s.capitulo({ tVuelo: t.uno - 0.6, tNumero: t.uno });
s.vuelo(t.cada - 0.1);
s.celular({ t0: t.cada + 0.15, colgado: true, toques: [t.deslizas, t.mejor], aviso: { t: t.salir }, pulsos: [t.puede] });
s.vuelo(t.hacen - 0.3);
s.add("hilo", t.hacen - 0.42);
s.fichas({ items: [{ t: t.promesa }, { t: t.duda }, { t: t.giro }] });
s.vuelo(t.guion - 0.3); s.add("hilo", t.guion - 0.42);
const RENGLON = { fila: 6, texto: "Yo voy a romper la regla.", t: t.yo, resaltar: "romper la regla", tResaltar: t.romper + 0.35 };
s.hoja({ t0: t.guion, renglones: [RENGLON] });
s.vuelo(t.este - 0.3);
s.clip({ t0: t.este, colgado: true, resaltar: [{ t: t.dos }], cifra: { t: t.dos, dur: 1.0 } });
s.vuelo(t.porque - 0.3); s.add("hilo", t.porque - 0.42);
s.carta({ t0: t.porque - 0.1, tGiro: t.podes });
s.vuelo(t.creias); s.add("hilo", t.creias - 0.42);
s.camino({ t0: t.creias, tB: t.terminaste - 0.25, tLuz: t.ibas, tDesvio: t.terminaste });
s.vuelo(t.bueno - 0.3); s.add("hilo", t.bueno - 0.42);
s.grafico({ paneles: [{ t: t.bueno + 0.1, dur: 1.4 }, { t: t.excelente, dur: 1.6 }] });
s.vuelo(t.repasemos, true);
s.resumen({ palabras: [{ t: R.promesa }, { t: R.duda }, { t: R.giro }, { t: R.enganche }] });
export const EVENTOS_DEMO = s.eventos;

const IMGS = ["neon/col_0.jpg", "neon/col_1.jpg", "neon/col_2.jpg", "neon/col_3.jpg", "neon/col_4.jpg", "neon/col_5.jpg", "neon/col_6.jpg", "neon/col_7.jpg", "neon/col_8.jpg"];
// reel de prueba 16:9 (RunPod) → achicado y apoyado abajo; con la ref 9:16 oscura de producción va sin zoom
const AVATAR: AvatarSpec = { src: "neon/avatar_demo.mp4", startFrom: 12, foco: [50, 30], zoom: 0.62, aspecto: 832 / 464, grado: "neon" };

const Mundo: React.FC = () => (
  <>
    <CollageTitulo x={BUC.x} y={BUC.y} t0={0.35} imgs={IMGS} tRojo={t.rojo} tColapso={t.colapso} destino={BUC} celda={[150, 200]} gap={14} />
    <BucleNeon x={BUC.x} y={BUC.y} a={BUC.a} t0={tBucle} />
    <ObjetoNeon {...CER} t0={t.cerebro} etiqueta="Psicología" colgadoDe={enBucle(0.75)} sag={90} activo={t.sinapsis} />
    <ObjetoNeon {...TRA} t0={t.app} colgadoDe={bordeObjeto(CER, "abajo")} activo={t.palanca} />
    <CelularUI x={CEL.x} y={CEL.y} ancho={CEL.ancho} t0={t.cada + 0.15} colgadoDe={enBucle(0.875)} toques={[t.deslizas, t.mejor]} aviso={{ texto: "Nuevo video para vos", t: t.salir }} pulsos={[t.puede]} />
    <Hilo a={[CEL.x + CEL.ancho / 2, CEL.y - 60]} b={[FIC.x - 400, FIC.y - 180]} t0={t.hacen - 0.42} dur={0.42} sag={-40} />
    <FichasCasino x={FIC.x} y={FIC.y} t0={t.hacen} titulo="Hacen falta *tres cosas*" items={[{ texto: "una promesa", t: t.promesa }, { texto: "una duda", t: t.duda }, { texto: "un giro", t: t.giro }]} />
    <Hilo a={[FIC.x + 420, FIC.y - 100]} b={[HOJ.x - HOJ.ancho / 2, HOJ.y - 120]} t0={t.guion - 0.42} dur={0.42} sag={50} />
    <HojaGuion x={HOJ.x} y={HOJ.y} t0={t.guion} renglones={[RENGLON]} ancho={HOJ.ancho} alto={HOJ.alto} />
    <ClipTarjeta x={CLI.x} y={CLI.y} t0={t.este} clip="neon/clip_demo.mp4" startFrom={2} ancho={CLI.ancho} ratio={16 / 9} colgadoDe={[HOJ.x + HOJ.ancho / 2 - 30, HOJ.y - HOJ.alto / 2]}
      handle="@el.creador" cifra={{ hasta: 2000000, sufijo: "vistas", t: t.dos, dur: 1.0 }} resaltar={[{ x: 0.52, y: 0.2, w: 0.3, h: 0.6, t: t.dos }]} />
    <Hilo a={[CLI.x + CLI.ancho / 2, CLI.y]} b={[CAR.x - CAR.w / 2 - 10, CAR.y]} t0={t.porque - 0.42} dur={0.42} sag={60} />
    <CartaGira x={CAR.x} y={CAR.y} w={CAR.w} t0={t.porque - 0.1} tGiro={t.podes} frente={{ texto: "¿Por qué no podés parar?" }} titulo={["La gran *pregunta*"]} />
    <Hilo a={[CAR.x + CAR.w / 2 + 10, CAR.y + 60]} b={[CAM.x - CAM.ancho / 2 + CAM.ancho * 0.12, CAM.y + CAM.alto / 2 + 20]} t0={t.creias - 0.42} dur={0.42} sag={-80} />
    <CaminoAB x={CAM.x} y={CAM.y} ancho={CAM.ancho} alto={CAM.alto} t0={t.creias} tB={t.terminaste - 0.25} tLuz={t.ibas} tDesvio={t.terminaste} etiquetaA="uno" etiquetaB="otro" titulo="Creías que ibas a *mirar uno*" />
    <Hilo a={[CAM.x - CAM.ancho / 2 + CAM.ancho * 0.9 + 40, CAM.y - CAM.alto / 2 + CAM.alto * 0.11]} b={[GRA.x - 330, GRA.y - 330]} t0={t.bueno - 0.42} dur={0.42} sag={40} />
    <GraficoLinea x={GRA.x} y={GRA.y} t0={t.bueno - 0.3} paneles={[{ titulo: "Lo *bueno*", t: t.bueno + 0.1, curva: "arco", dur: 1.4 }, { titulo: "Lo *excelente*", t: t.excelente, curva: "rulos", color: "#8dffa0", dur: 1.6 }]} />
    <ResumenBucle x={BUC.x} y={BUC.y} a={BUC.a} palabras={[{ texto: "promesa", t: R.promesa }, { texto: "duda", t: R.duda }, { texto: "giro", t: R.giro }, { texto: "enganche", t: R.enganche }]} />
  </>
);

export const Demo: React.FC<{ farm?: boolean; avatar?: boolean }> = ({ farm, avatar = true }) => (
  <FormatoPartido
    cam={cam}
    mundo={<Mundo />}
    avatar={avatar ? AVATAR : undefined}
    tiempo={tiempo}
    pantalla={(w) => (
      <>
        <TituloNeon lineas={["Así funciona", "*la trampa* de los videos cortos"]} t0={t.titulo} t1={t.cerebro - 0.2} w={w} y={60} tamanos={[40, 64]} />
        <NumeroCapitulo n={1} texto="La sorpresa" t0={t.uno} t1={t.cada + 0.1} w={w} />
      </>
    )}
  >
    {!farm && <SfxTrack eventos={EVENTOS_DEMO} hablando={tiempo.speaking} />}
  </FormatoPartido>
);
