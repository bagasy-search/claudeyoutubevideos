/**
 * Main_tfbvidrio — El Constructor Libre · "Ventana de Vidrio Doble Empañada: El Arreglo Que Nadie Te Cuenta"
 * Cada cue base cubre su tramo (build garantiza cobertura): avatar RunPod · clip Pexels · ag (agnes) · foto · componente TALLER.
 * Encima: overlays (frase cinética / trazo a mano). Audio: UN <Audio> con el máster + SFX mezclados. Todo video muteado.
 */
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { T, Clip, AgClip, Foto, AvatarWin, TalkOverlay, MarkOverlay } from "./Taller";
import * as K from "./TallerKit";
import { BEATS, OVERLAYS, SFX, TOTAL_FRAMES_TFBVIDRIO } from "./cues.gen";

const Scene: React.FC<{ c: any; d: number }> = ({ c, d }) => {
  const h = c.h || {};
  switch (c.kind) {
    case "avatar": return <AvatarWin src={c.src} seed={c.seed} />;
    case "clip": return <Clip src={c.src} seed={c.seed} frames={c.frames} />;
    case "ag": return <AgClip src={c.src} still={c.still} seed={c.seed} frames={c.frames} />;
    case "foto": return <Foto src={c.src} seed={c.seed} />;
    case "golpe": return <K.Golpe words={c.words} sub={c.sub} img={c.img} durF={d} />;
    case "tachado": return <K.Tachado kicker={c.kicker} items={c.items} img={c.img} durF={d} />;
    case "capitulo": return <K.Capitulo index={c.index} kicker={c.kicker} title={c.title} img={c.img} durF={d} />;
    case "trapo": return <K.Trapo focus={c.focus} durF={d} />;
    case "senales": return <K.Senales kicker={c.kicker} items={c.items} h={h} durF={d} />;
    case "opciones": return <K.Opciones focus={c.focus} durF={d} />;
    case "cinta": return <K.Cinta kicker={c.kicker} items={c.items} img={c.img} durF={d} />;
    case "corte": return <K.Corte focus={c.focus} h={h} durF={d} />;
    case "ciclo": return <K.Ciclo h={h} durF={d} />;
    case "cifra": return <K.Cifra value={c.value} kicker={c.kicker} label={c.label} img={c.img} durF={d} />;
    case "nota": return <K.Nota text={c.text} sub={c.sub} durF={d} />;
    case "mito": return <K.Mito claim={c.claim} truth={c.truth} img={c.img} durF={d} />;
    case "ficha": return <K.FichaCaso kicker={c.kicker} name={c.name} place={c.place} lines={c.lines} img={c.img} durF={d} />;
    case "contras": return <K.Contras kicker={c.kicker} items={c.items} img={c.img} h={h} durF={d} />;
    case "lamina": return <K.Lamina img={c.img} h={h} durF={d} />;
    case "cta": return <K.Cta variant={c.variant} kicker={c.kicker} title={c.title} h={h} durF={d} lamina={c.lamina} />;
    case "muro": return <K.Muro kicker={c.kicker} items={c.items} durF={d} />;
    case "paso": return <K.Paso step={c.step} total={c.total} title={c.title} sub={c.sub} img={c.img} durF={d} />;
    case "medida": return <K.Medida focus={c.focus} h={h} durF={d} />;
    case "duelo": return <K.Duelo kicker={c.kicker} left={c.left} right={c.right} h={h} durF={d} />;
    case "repaso": return <K.Repaso kicker={c.kicker} items={c.items} h={h} durF={d} />;
    case "secuencia": return <K.Secuencia kicker={c.kicker} items={c.items} h={h} durF={d} />;
    case "pregunta": return <K.Pregunta q={c.q} sub={c.sub} durF={d} />;
    case "alerta": return <K.Alerta kicker={c.kicker} items={c.items} h={h} durF={d} />;
    case "calzos": return <K.Calzos h={h} durF={d} />;
    default: return null;
  }
};

export const MainTfbvidrio: React.FC = () => {
  const { fps } = useVideoConfig();
  const seq = (c: any, el: (d: number) => React.ReactNode, key: string) => {
    const from = Math.round(c.start * fps); const d = Math.max(1, Math.round(c.dur * fps));
    return <Sequence key={key} from={from} durationInFrames={d} premountFor={20} name={`${c.kind} · ${c.id}`}>{el(d)}</Sequence>;
  };
  return (
    <AbsoluteFill style={{ background: T.wood2, overflow: "hidden" }}>
      <Audio src={staticFile("tfbvidrio/tfbvidrio.m4a")} />
      {BEATS.map((c: any) => seq(c, (d) => <Scene c={c} d={d} />, c.id))}
      {OVERLAYS.map((c: any) => seq(c, (d) => (c.kind === "talk" ? <TalkOverlay kicker={c.kicker} title={c.title} hot={c.hot} durF={d} /> : <MarkOverlay kind={c.shape || "circle"} text={c.text} x={c.x} y={c.y} durF={d} />), c.id))}
      {SFX.map((s: any, i: number) => <Sequence key={`sfx${i}`} from={Math.round(s.at * fps)} durationInFrames={Math.round(3 * fps)}><Audio src={staticFile(s.src)} volume={s.vol} /></Sequence>)}
    </AbsoluteFill>
  );
};
export const TOTAL_FRAMES = TOTAL_FRAMES_TFBVIDRIO;
