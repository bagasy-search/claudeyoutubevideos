// Main Stan (stan12; base Main Loretta lor11 S1): 3 capas (avatar por ventanas · material con entradas · overlays) + mezcla de audio.
// Sin Grade/viñeta/grano. Datos en cues.gen.ts (D:/rtmp/<slug>/tools/gen.mjs).
import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame, Easing } from "remotion";
import { SHOTS, AVATAR, OVERLAYS, TOTAL, MIX, MANO, PLATE } from "./cues.gen";
import * as K from "./Kit";
import * as E from "./Escenas";
import * as S from "./Carne";

export const TOTAL_FRAMES_STAN = TOTAL;
const TR = 8;

const Body: React.FC<{ s: any; dur: number }> = ({ s, dur }) => {
  const seed = s.id + 1;
  switch (s.view) {
    case "clip": return <K.Clip src={s.src} seed={seed} dur={dur} clipDur={s.clipDur} minRate={s.veo ? 0.42 : 0.6} />;
    case "photo": return <K.Photo src={s.src} seed={seed} dur={dur} />;
    case "clips": { let a = 0; return <AbsoluteFill>{s.parts.map((x: any, i: number) => { const el = <Sequence key={i} from={a} durationInFrames={x.dur}><K.Clip src={x.src} seed={seed + i * 7} dur={x.dur} clipDur={x.clipDur} minRate={0.6} /></Sequence>; a += x.dur; return el; })}{s.tail ? <Sequence from={a} durationInFrames={dur - a}><K.Photo src={s.tailSrc} seed={seed + 3} dur={dur - a} /></Sequence> : null}</AbsoluteFill>; }
    case "album": return <K.Album src={s.src} seed={seed} dur={dur} caption={s.caption} />;
    case "polaroid": return <K.PolaroidShot src={s.src} caption={s.caption} bg={s.bg} seed={seed} dur={dur} />;
    case "card": return <K.RecipeCard {...s.p} bg={s.bg} dur={dur} />;
    case "chap": return <K.ChapterOpen {...s.p} dur={dur} />;
    case "carousel": return <K.Carousel {...s.p} bg={s.bg} dur={dur} />;
    case "map": return <K.MapIowa {...s.p} dur={dur} />;
    case "stat": return <K.Stat {...s.p} bg={s.bg} dur={dur} />;
    case "thermo": return <K.Thermo {...s.p} bg={s.bg} dur={dur} />;
    case "oven": return <K.OvenDial {...s.p} bg={s.bg} dur={dur} />;
    case "timer": return <K.Timer {...s.p} bg={s.bg} dur={dur} />;
    case "clock2h": return <K.Clock2h {...s.p} bg={s.bg} dur={dur} />;
    case "list": return <K.ListCard {...s.p} bg={s.bg} dur={dur} />;
    case "guarda": return <K.Guarda {...s.p} bg={s.bg} dur={dur} />;
    case "cartas": return <K.Cartas {...s.p} bg={s.bg} dur={dur} />;
    case "cuenta": return <K.Cuenta {...s.p} bg={s.bg} dur={dur} />;
    case "book": return <K.BookPage {...s.p} bg={s.bg} seed={seed} dur={dur} />;
    case "qr": return <K.BookQR {...s.p} bg={s.bg} dur={dur} />;
    case "counter": return <K.CounterShot {...s.p} dur={dur} />;
    case "chapS": return <S.ChapS {...s.p} dur={dur} />;
    case "carruselS": return <S.CarruselS {...s.p} bg={s.bg} dur={dur} />;
    case "labelS": return <S.LabelS {...s.p} bg={s.bg} dur={dur} seed={seed} />;
    case "ticketS": return <S.TicketS {...s.p} bg={s.bg} dur={dur} />;
    case "boardS": return <S.BoardS {...s.p} dur={dur} />;
    case "scaleS": return <S.ScaleS {...s.p} bg={s.bg} dur={dur} />;
    case "weekS": return <S.WeekS {...s.p} bg={s.bg} dur={dur} />;
    case "wordS": return <S.WordS {...s.p} bg={s.bg} dur={dur} seed={seed} />;
    case "slipS": return <S.SlipS {...s.p} bg={s.bg} dur={dur} />;
    case "sumS": return <S.SumS {...s.p} bg={s.bg} dur={dur} />;
    case "listaS": return <S.ListaS {...s.p} bg={s.bg} dur={dur} />;
    case "diaS": return <S.DiaS {...s.p} bg={s.bg} dur={dur} />;
    case "barrasS": return <S.BarrasS {...s.p} bg={s.bg} dur={dur} />;
    case "freshS": return <S.FreshS {...s.p} bg={s.bg} dur={dur} />;
    case "pasosS": return <S.PasosS {...s.p} bg={s.bg} dur={dur} />;
    case "razasS": return <S.RazasS {...s.p} bg={s.bg} dur={dur} />;
    case "ribsS": return <S.RibsS {...s.p} bg={s.bg} dur={dur} />;
    case "nextS": return <S.NextS {...s.p} dur={dur} />;
    case "escena": { const C = (E as any)[s.p.name]; return C ? <C {...s.p} dur={dur} /> : null; }
    default: return null;
  }
};

// (5) transiciones de capítulo y entradas: corte, fundido, empuje, o la ficha que barre
const Enter: React.FC<{ trans: string; children: React.ReactNode; seed: number }> = ({ trans, children, seed }) => {
  const f = useCurrentFrame();
  if (trans === "fade") return <AbsoluteFill style={{ opacity: interpolate(f, [0, TR], [0, 1], { extrapolateRight: "clamp" }) }}>{children}</AbsoluteFill>;
  if (trans === "push") {
    const dir = K.hash(seed) % 2 ? 1 : -1;
    const x = interpolate(f, [0, TR + 2], [dir * 100, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    return <AbsoluteFill style={{ transform: `translateX(${x}%)` }}>{children}</AbsoluteFill>;
  }
  if (trans === "lift") { // capítulo: el plano nuevo sube como un paquete que se apoya en el mostrador
    const y = interpolate(f, [0, 14], [100, 0], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
    const r = interpolate(f, [0, 14], [4, 0], { extrapolateRight: "clamp" });
    return <AbsoluteFill style={{ transform: `translateY(${y}%) rotate(${r}deg)`, boxShadow: "0 -20px 50px rgba(0,0,0,0.5)" }}>{children}</AbsoluteFill>;
  }
  return <AbsoluteFill>{children}</AbsoluteFill>;
};

const Overlay: React.FC<{ o: any }> = ({ o }) => {
  switch (o.type) {
    case "price": return <K.Price text={o.text} dur={o.dur} />;
    case "progress": return <S.ProgS n={o.n} N={o.N} title={o.title} dur={o.dur} unit={o.unit} />;
    case "pregunta": return <K.Pregunta text={o.text} dur={o.dur} />;
    default: return null;
  }
};

export const MainStan: React.FC = () => (
  <AbsoluteFill style={{ background: "#111" }}>
    {AVATAR.map((a: any, i: number) => (
      <Sequence key={"a" + i} from={a.from} durationInFrames={a.dur} premountFor={30}>
        <K.AvatarFramed src={a.src} seed={i} dur={a.dur} mods={a.mods} mano={MANO} plate={PLATE} />
      </Sequence>
    ))}
    {SHOTS.map((s: any, i: number) => {
      if (s.k === "A") return null;
      const nx = SHOTS[i + 1];
      const tail = nx && nx.k !== "A" && nx.trans && nx.trans !== "cut" ? TR + 8 : 0;
      return (
        <Sequence key={"s" + s.id} from={s.from} durationInFrames={Math.min(s.dur + tail, TOTAL - s.from)} premountFor={45}>
          <Enter trans={s.trans || "cut"} seed={s.id}><Body s={s} dur={s.dur} /></Enter>
        </Sequence>
      );
    })}
    {OVERLAYS.map((o: any, i: number) => (
      <Sequence key={"o" + i} from={o.from} durationInFrames={Math.min(o.dur, TOTAL - o.from)}><Overlay o={o} /></Sequence>
    ))}
    {/* audio: lo mezcla el job mix y lo pega encfin */}
  </AbsoluteFill>
);
