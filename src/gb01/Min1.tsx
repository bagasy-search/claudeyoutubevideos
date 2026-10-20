// gb01 · MINUTO 1 (0-65,4 s) · The Glass Brain · "Psychology of Phone Addiction". Estilo explicador-neon + vara gary01:
// UN mundo, UNA cámara, sin cortes secos. Hilo visual:
//   monje a pantalla completa (ventana pagada 0) → se desenfoca y delante se dibuja la tragamonedas APAGADA ("no ves
//   las luces"), monedas que caen MUDAS, el cerebro de cristal se prende ("your brain can") → la máquina se enciende
//   ("let me show you") → el monje se funde en el escenario negro → 2:07 AM, el celular → cada tirón de "pull to
//   refresh" baja la palanca por un cable de luz: pierde, pierde, 777 → mensaje, like, risa → vuelo al cerebro: el
//   núcleo de dopamina se prende ANTES del premio (pull → maybe → prize) → plano general + el ojo que mira la mente →
//   vuelta al celular ("the one you are holding") → título → el cerebro se parte en 4 y adentro giran 4 engranajes →
//   la ola del impulso → los engranajes frenan ("stop working on you").
// Tiempos: TODO anclado a la palabra (words.json = Groq sobre gb01cut.wav). Avatar: avwin.json (ventanas pagadas).
// Audio fuera de Remotion (voz + efectos con mezcla_neon.py; encfin pega la mezcla). Render SÓLO en el farm.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FPS, N, SANS, SERIF, Hilo, Toma, clamp, ease, easeOut, makeCam, makeTiempo, pop, quieta, ramp, useT, vis, BlurDef, NeonPath, neonOn, useSvgId } from "../kits/neon/base";
import { AvatarSpec, ColumnaAvatar, Escenario, SfxTrack, anchoEscenario } from "../kits/neon/Layout";
import { TituloNeon } from "../kits/neon/Titulo";
import { pistaGb } from "./sonidos";
import { CableLuz, CelularPull, OjoMente, MalaNeon, tiemposMala, CerebroPartido, CerebroQuizas, LineaQuizas, OlaImpulso, TragaTiradas, altoCelular, enchufeIzq, finTirada, Tirada, Tiron } from "./piezas";
import WORDS from "./words.json";
import AVWIN from "./avwin.json";

const P = "gb01/";
const tiempo = makeTiempo(WORDS);
const T = tiempo.at, TE = tiempo.atEnd;
export const MIN1_FIN = TE("working on you") + 0.9;
export const MIN1_FRAMES = Math.ceil(MIN1_FIN * FPS);
const REEL = true; // reel del avatar en public/gb01/reel0.mp4

// ───────── tiempos ─────────
const t = {
  slot: T("slot machine"), lights: T("lights"), coins: T("coins"), hear: T("hear"), brain: T("brain can"), can: T("can", 8), show: T("show you"),
  two: T("two in the morning"), tired: T("tired"), just: T("just one more"), thumb: T("Your thumb"), down: T("down"), jumps: T("jumps"),
  nothing: T("Nothing new"), again1: T("pull again"), nothing2: T("Nothing", 22), again2: T("pull again", 23), there: T("there it is"),
  message: T("message"), like: T("like"), laugh: T("laugh"), video: T("video that"),
  tiny: T("tiny moment"), deep: T("deep inside"), lightsUp: T("lights up"), prize: T("prize arrives"), before: T("just before"), maybe: T("maybe", 37),
  monk: T("old monk"), watching: T("watching the mind"), own: T("my own first"), never: T("never seen"), machine: T("machine that"), holding: T("holding"),
  today: T("Today"), open: T("open the glass brain"), piece: T("piece by piece"), four: T("four gears"), scrolling: T("keep you scrolling"),
  practice: T("simple practice"), stop: T("stop working"),
};

// ───────── mundo (px) ─────────
const SLOT = { x: 0, y: 0, tam: 360 };
const CER = { x: 600, y: -60, tam: 480 };
const CEL = { x: -720, y: 30, ancho: 300 };
const LIN = { x: 600, y: 400, ancho: 860 };
const OJO = { x: 1500, y: -40, tam: 300 };
const MALA = { x: -300, y: 640, r: 170 };
const OLA = { x: 600, y: 360, ancho: 820 };
const altoCel = altoCelular(CEL.ancho);
const bordeDerCel: [number, number] = [CEL.x + CEL.ancho / 2 - 4, CEL.y + 40];

const TIRONES: Tiron[] = [{ t: t.down + 0.05, nada: true }, { t: t.again1 + 0.15, nada: true }, { t: t.again2 }];
const TIRADAS: Tirada[] = [
  { t: TIRONES[0].t, res: [2, 3, 1] },
  { t: TIRONES[1].t, res: [0, 0, 3] }, // casi: dos sietes y el tercero no
  { t: TIRONES[2].t, res: [0, 0, 0] },
];

// ───────── cámara: [t, x, y, zoom] ─────────
const tomas: Toma[] = [
  [0, 0, 20, 1.05],
  [t.slot, 0, 20, 1.05],
  [t.brain - 0.3, 0, 20, 1.08],
  [t.brain + 0.5, 300, -10, 0.95],
  [t.show, 300, -10, 0.98],
  [t.two - 0.15, 300, -10, 1.0],
  [t.two + 0.9, CEL.x, -40, 1.2],
  [t.thumb - 0.5, CEL.x, -30, 1.24],
  [t.thumb + 0.4, -370, -30, 1.0],
  [t.there, -370, -30, 1.04],
  [t.message - 0.1, -600, -60, 1.25],
  [t.tiny - 0.2, -600, -60, 1.3],
  [t.tiny + 0.9, CER.x, -60, 1.3],
  [t.lightsUp + 0.2, CER.x, -40, 1.38],
  [t.prize - 0.2, CER.x, 160, 0.9],
  [t.monk - 0.3, CER.x, 170, 0.93],
  [t.monk + 1.2, 300, 120, 0.58],
  [t.never - 0.2, 380, 110, 0.6],
  [t.machine - 0.2, CEL.x, 10, 1.12, 0, "out"],
  [t.holding + 0.3, CEL.x, 10, 1.18],
  [t.today + 0.2, CER.x, -60, 1.35],
  [t.piece - 0.2, CER.x, -50, 1.42],
  [t.piece + 0.6, CER.x, -40, 0.98],
  [t.practice - 0.6, CER.x, -10, 0.98],
  [t.practice + 0.3, CER.x, 110, 0.92],
  ...quieta(t.stop, MIN1_FIN, CER.x, 110, 0.92, 0.05),
];
export const cam = makeCam(tomas);

// ───────── avatar ─────────
// ventana 0 = pantalla completa (la apertura); las demás, en la columna 9:16 (el reel 16:9 achicado y apoyado abajo)
const WINS = AVWIN as { t0: number; t1: number; r0: number }[];
const AV: AvatarSpec = REEL
  ? { src: P + "reel0.mp4", ventanas: WINS.slice(1), foco: [50, 30], zoom: 0.62, aspecto: 16 / 9, grado: "neon" }
  : { img: P + "monje.png", ventanas: WINS.slice(1), foco: [50, 30], zoom: 0.62, aspecto: 16 / 9, grado: "neon" };
const W0 = WINS[0];
const tFund = t.two - 0.2; // el monje desenfocado se funde en el escenario negro

const Apertura: React.FC<{ t: number }> = ({ t: tt }) => {
  if (tt > tFund + 1.0) return null;
  const blur = interpolate(tt, [t.slot + 0.2, W0.t1 - 0.05], [0, 22], { ...clamp, easing: ease });
  const dark = interpolate(tt, [t.slot + 0.2, W0.t1], [0, 0.62], clamp);
  const fade = 1 - ramp(tt, tFund, 0.9);
  const zoom = 1.0 + 0.04 * ramp(tt, 0, W0.t1, (k) => k) + 0.05 * ramp(tt, W0.t1, tFund - W0.t1, (k) => k);
  const img = { width: "100%", height: "100%", objectFit: "cover" as const };
  return (
    <AbsoluteFill style={{ opacity: fade, background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, filter: blur > 0.3 ? `blur(${blur}px) brightness(${1 - dark})` : undefined }}>
        {/* fuera de la ventana pagada: la foto del monje (ya desenfocada, no se nota que no habla) */}
        <Img src={staticFile(P + "monje.png")} style={img} />
        {REEL && (
          <Sequence from={0} durationInFrames={Math.round((W0.t1 + 0.1) * FPS)} layout="none">
            <AbsoluteFill><OffthreadVideo src={staticFile(P + "reel0.mp4")} muted style={img} /></AbsoluteFill>
          </Sequence>
        )}
      </AbsoluteFill>
      {/* rim cian como el escenario: el monje ya vive en la misma luz */}
      <AbsoluteFill style={{ background: "linear-gradient(270deg, rgba(39,227,255,.16) 0%, transparent 30%)", mixBlendMode: "screen" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};

// ───────── monedas que caen MUDAS + parlante tachado ─────────
const MonedasMudas: React.FC<{ x: number; y: number; t0: number; tMudo: number; t1: number }> = ({ x, y, t0, tMudo, t1 }) => {
  const tt = useT();
  const id = useSvgId("mm");
  if (!vis(tt, t0, t1)) return null;
  const op = 1 - ramp(tt, t1 - 0.4, 0.4);
  return (
    <div style={{ position: "absolute", left: x - 300, top: y, width: 600, height: 520, opacity: op }}>
      <svg width={600} height={520} style={{ overflow: "visible" }}>
        <defs><BlurDef id={id} s={3} /></defs>
        {Array.from({ length: 9 }).map((_, i) => {
          const d = tt - (t0 + i * 0.16);
          if (d < 0) return null;
          const yy = 10 + 260 * d * d + 40 * d, xx = 300 + (i % 2 ? 1 : -1) * (14 + i * 7) * d * 2.2;
          const giro = Math.abs(Math.cos(d * 7 + i));
          return yy < 560 ? <ellipse key={i} cx={xx} cy={yy} rx={18 * (0.25 + 0.75 * giro)} ry={18} fill="rgba(244,194,74,.12)" stroke={N.oro} strokeWidth={2.4} opacity={0.9} style={{ filter: `drop-shadow(0 0 6px ${N.oro})` }} /> : null;
        })}
        {/* parlante tachado */}
        <g transform="translate(470,90)" opacity={neonOn(tt, tMudo)}>
          <NeonPath d="M-30,-12 L-14,-12 L4,-30 L4,30 L-14,12 L-30,12 Z" color="#e6eeff" ancho={2} blurId={id} />
          <NeonPath d="M16,-14 Q26,0 16,14 M24,-24 Q42,0 24,24" color="#e6eeff" ancho={1.8} blurId={id} />
          <NeonPath d="M-38,34 L40,-34" color={N.rojo} ancho={2.6} blurId={id} k={ramp(tt, tMudo + 0.25, 0.3, easeOut)} len={120} />
        </g>
      </svg>
    </div>
  );
};

// ───────── texto en el mundo: sans negra + *itálica serif* ─────────
const Frase: React.FC<{ x: number; y: number; t0: number; t1: number; texto: string; size?: number; color?: string }> = ({ x, y, t0, t1, texto, size = 64, color = "#fff" }) => {
  const tt = useT();
  if (!vis(tt, t0, t1)) return null;
  const k = pop(tt, t0, 12), out = 1 - ramp(tt, t1 - 0.35, 0.35);
  const it = texto.startsWith("*");
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${0.85 + 0.15 * k})`, opacity: Math.min(1, k * 1.5) * out, fontFamily: it ? SERIF : SANS, fontStyle: it ? "italic" : "normal", fontWeight: it ? 400 : 900, fontSize: size, color, whiteSpace: "nowrap", letterSpacing: it ? 0 : -1, textShadow: `0 0 22px ${color === "#fff" ? "rgba(255,255,255,.35)" : color}` }}>{texto.replace(/\*/g, "")}</div>
  );
};

// reloj de neón grande: 2:07 AM (los dígitos se encienden de a uno)
const RelojNeon: React.FC<{ x: number; y: number; t0: number; t1: number }> = ({ x, y, t0, t1 }) => {
  const tt = useT();
  if (!vis(tt, t0, t1)) return null;
  const out = 1 - ramp(tt, t1 - 0.35, 0.35);
  const ch = "2:07".split("");
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", display: "flex", alignItems: "baseline", gap: 6, opacity: out }}>
      {ch.map((c, i) => <span key={i} style={{ fontFamily: SANS, fontWeight: 900, fontSize: 150, color: N.cianClaro, opacity: neonOn(tt, t0 + i * 0.07), textShadow: `0 0 18px ${N.cian}, 0 0 60px ${N.cian}`, letterSpacing: -4 }}>{c}</span>)}
      <span style={{ fontFamily: SANS, fontWeight: 800, fontSize: 56, color: N.cianClaro, opacity: neonOn(tt, t0 + 0.35), textShadow: `0 0 14px ${N.cian}`, marginLeft: 14 }}>AM</span>
    </div>
  );
};

// el cerebro entero hasta que se parte (CerebroPartido toma la posta en el mismo lugar, sin salto)
const CerebroHastaParte: React.FC = () => {
  const tt = useT();
  return tt < t.piece ? <CerebroQuizas {...CER} t0={t.brain} quizas={[t.can, t.lightsUp, t.maybe]} tPremio={t.prize + 0.4} etiqueta={{ texto: "maybe", t: t.maybe }} /> : null;
};

export const Mundo: React.FC = () => (
  <>
    <TragaTiradas {...SLOT} t0={t.slot} tiradas={TIRADAS} apagada={[1, t.show + 0.2]} />
    <MonedasMudas x={SLOT.x} y={SLOT.y + 250} t0={t.coins - 0.5} tMudo={t.hear} t1={t.brain + 0.8} />
    <Hilo a={[SLOT.x + 150, SLOT.y - 150]} b={[CER.x - CER.tam / 2 + 30, CER.y - 20]} t0={t.brain - 0.42} dur={0.42} sag={-40} />
    <CerebroHastaParte />
    <CerebroPartido {...CER} t0={t.brain} tParte={t.piece} tEngr={[0, 1, 2, 3].map((i) => t.four + 0.12 + i * 0.16)} tGira={t.scrolling} tFrena={t.stop} />
    {/* 2 AM: del costado de la máquina nace el hilo hasta el celular */}
    <RelojNeon x={CEL.x} y={CEL.y - altoCel / 2 - 120} t0={t.two + 0.1} t1={t.just - 0.1} />
    <Frase x={CEL.x} y={CEL.y - altoCel / 2 - 110} t0={t.just} t1={t.thumb + 0.2} texto="*“just one more video”*" size={76} />
    <CelularPull {...CEL} t0={t.two + 0.25} tirones={TIRONES} aviso={{ t: t.message, quien: "Mia", texto: "are you awake?" }} like={t.like + 0.1} risa={t.laugh} />
    <CableLuz a={enchufeIzq(SLOT.x, SLOT.y, SLOT.tam)} b={bordeDerCel} t0={t.two - 0.1} pulsos={TIRONES.map((x) => x.t)} sag={70} haciaA />
    <LineaQuizas {...LIN} t0={t.prize - 0.3} tMarcas={[t.prize - 0.1, t.maybe, t.prize + 0.2]} tPico={t.before + 0.3} t1={t.never + 0.6} />
    {/* "watching the mind, my own first": un ojo que mira la mente, colgado del cerebro */}
    <Hilo a={[CER.x + CER.tam / 2 - 20, CER.y - 30]} b={[OJO.x - OJO.tam / 2 + 20, OJO.y]} t0={t.watching - 0.42} t1={t.today + 0.4} dur={0.42} sag={-60} />
    <OjoMente {...OJO} t0={t.watching} tPropia={t.own} mira={[CER.x, CER.y]} t1={t.today + 0.4} />
    <Hilo a={[SLOT.x - 60, SLOT.y + 240]} b={[MALA.x, MALA.y - MALA.r - 15]} t0={t.monk - 0.3} t1={t.machine + 0.3} dur={0.5} sag={-50} />
    <MalaNeon {...MALA} t0={t.monk} t1={t.machine + 0.3} />
    <OlaImpulso {...OLA} t0={t.practice} />
  </>
);

// ───────── sonido Freesound CC0: UNO por micro-acción, con los mismos tiempos que los componentes ─────────
// (las monedas caen MUDAS a propósito: "you can't hear the coins")
const s = pistaGb();
s.add("neonOn", t.slot); s.add("traza", t.slot + 0.05, 0.6);
s.add("tic", t.hear + 0.25); s.add("vidrio", t.hear + 0.3, 0.5);
s.add("hilo", t.brain - 0.42); s.add("neonOn", t.brain); s.add("sinapsis", t.can);
// la máquina se enciende: golpe + las bombitas de la marquesina de a una
s.add("latido", t.show + 0.2); s.add("neonOn", t.show + 0.2, 0.8);
[0, 1, 2, 3].forEach((i) => s.add("digito", t.show + 0.3 + i * 0.07, 0.6));
// 2 AM
s.add("vuelo", t.two - 0.1); s.add("hilo", t.two - 0.1); s.add("aparece", t.two + 0.25);
[0, 1, 2, 3, 5].forEach((i) => s.add("digito", t.two + 0.1 + i * 0.07));
s.add("vidrio", t.just);
s.add("vuelo", t.thumb, 0.7);
// cada tirón: dedo → estira → la luz corre por el cable → palanca → rodillos → 3 frenadas (→ "No new posts" o 777)
for (const [i, tr] of TIRADAS.entries()) {
  s.add("toque", tr.t - 0.5); s.add("tiron", tr.t - 0.4); s.add("luz", tr.t - 0.35);
  s.add("palanca", tr.t); s.add("rodillos", tr.t + 0.02);
  [0.7, 0.9, 1.1].forEach((d) => s.add("rodilloFrena", tr.t + d));
  if (TIRONES[i].nada) s.add("vacio", tr.t + 0.38);
  else s.add("premio", finTirada(tr));
}
s.add("vuelo", t.message - 0.1, 0.6); s.add("aviso", t.message); s.add("like", t.like + 0.1); s.add("latido", t.like + 0.12, 0.6); s.add("aparece", t.laugh, 0.6);
// al cerebro: el núcleo se prende antes del premio
s.add("vueloLargo", t.tiny - 0.1); s.add("sinapsis", t.lightsUp);
s.add("vuelo", t.prize - 0.2, 0.6); s.add("tic", t.prize - 0.1); s.add("tic", t.prize + 0.2); s.add("traza", t.before - 0.6); s.add("digito", t.maybe); s.add("sinapsis", t.maybe);
s.add("vueloLargo", t.monk + 0.1); tiemposMala(t.monk).forEach((tb, i) => s.add("tic", tb, 0.5 + 0.3 * (i % 3 === 0 ? 1 : 0))); s.add("hilo", t.watching - 0.42); s.add("neonOn", t.watching, 0.8); s.add("tic", t.watching + 1.6, 0.7); s.add("sinapsis", t.own, 0.8);
s.add("vuelo", t.machine - 0.15); s.add("latido", t.holding, 0.6);
// título + el cerebro se parte + 4 engranajes que giran y frenan
s.add("vuelo", t.today); [0, 1, 2, 3].forEach((i) => s.add("tic", t.today + i * 0.09));
s.add("grieta", t.piece - 0.05); s.add("golpe", t.piece + 0.05); s.add("vuelo", t.piece + 0.1, 0.6);
[0, 1, 2, 3].forEach((i) => s.add("engranaje", t.four + 0.12 + i * 0.16));
s.add("maquinaGira", t.scrolling, 1, t.stop - t.scrolling + 1.2);
s.add("vuelo", t.practice - 0.6, 0.6); s.add("ola", t.practice);
s.add("maquinaFrena", t.stop); s.add("cierre", t.stop + 1.0);
export const EVENTOS_MIN1 = s.eventos;

// ───────── composición ─────────
export const Min1: React.FC<{ farm?: boolean }> = ({ farm }) => {
  const tt = useCurrentFrame() / FPS;
  const w = anchoEscenario(AV, tt);
  const fondo = ramp(tt, tFund, 0.9);
  return (
    <AbsoluteFill style={{ background: N.bg, overflow: "hidden" }}>
      <Apertura t={tt} />
      <Escenario cam={cam} w={w} mundo={<Mundo />} fondo={fondo}
        pantalla={<>
          <TituloNeon lineas={["Psychology of", "*Phone Addiction*"]} t0={t.today} t1={t.four - 0.1} w={w} y={56} tamanos={[44, 84]} />
        </>} />
      <ColumnaAvatar av={AV} t={tt} />
      {!farm && <SfxTrack eventos={EVENTOS_MIN1} hablando={tiempo.speaking} />}
    </AbsoluteFill>
  );
};
