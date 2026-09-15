import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Foto, Clip, AvatarWin, LaminaCTA } from "./Piezas";
import { BASE, COMPS, TOTAL_FRAMES } from "./cues.gen";
import { LowerThird } from "../_fed6/VideoEdit/scenes/LowerThird";
import { FraseCinetica } from "../_fed6/VideoEdit/scenes/FraseCinetica";
import { ErrorStinger } from "../_fed6/VideoEdit/scenes/ErrorStinger";
import { DatoImpacto } from "../_fed6/VideoEdit/scenes/DatoImpacto";
import { ListaFlotante } from "../_fed6/VideoEdit/scenes/ListaFlotante";
import { MitoRevelado } from "../_fed6/VideoEdit/scenes/MitoRevelado";
import { FreezeZoom } from "../_fed6/VideoEdit/scenes/FreezeZoom";
// clon local: el original trae "Línea de tiempo" / "Hitos" escritos a mano, sin prop (canal EN)
import { LineaTiempoPiel } from "./LineaTiempoEN";

// ── CANAL "Dr. Federer — The Nightly Remedy" (EN) · legsswellcold ─────────────
// Audio = máster Fish (voz del canal). Avatar = InfiniteTalk/RunPod SÓLO en las ventanas visibles
// (reel `legsswellcold_avatar.mp4`, recortado con trimBefore). Todo video por OffthreadVideo.
export const TOTAL_FRAMES_LEGSSWELLCOLD = TOTAL_FRAMES;
const AVATAR_REEL = "legsswellcold_avatar.mp4";

const renderComp = (b: any, d: number) =>
  b.kind === "lowerthird" ? <LowerThird durationInFrames={d} title={b.title} desc={b.desc} kicker={b.kicker} tag={b.tag ?? "DR. FEDERER"} tone={b.tone} />
  : b.kind === "frasecinetica" ? <FraseCinetica durationInFrames={d} words={b.words} ats={b.ats} perWord={b.perWord} tone={b.tone} />
  : b.kind === "errorstinger" ? <ErrorStinger durationInFrames={d} number={b.number} title={b.title} tone={b.tone} eyebrow={b.eyebrow} />
  : b.kind === "datoimpacto" ? <DatoImpacto durationInFrames={d} figure={b.figure} unit={b.unit} eyebrow={b.eyebrow} caption={b.label} image={b.image} tone={b.tone} />
  : b.kind === "checklist" ? <ListaFlotante durationInFrames={d} title={b.title} image={b.image} items={b.items} tone={b.tone} />
  : b.kind === "mitoverdad" ? <MitoRevelado durationInFrames={d} myth={b.myth} truth={b.truth} image={b.image} flipAt={b.flipAt}
      mythLabel="THE MYTH" truthLabel="WHAT'S REALLY HAPPENING" />
  : b.kind === "lineatiempo" ? <LineaTiempoPiel durationInFrames={d} title={b.title} marks={b.marks} tone={b.tone} />
  : b.kind === "freezezoom" ? <FreezeZoom durationInFrames={d} image={b.image} x={b.x} y={b.y} label={b.label} zoom={b.zoom} tone={b.tone} />
  : b.kind === "laminacta" ? <LaminaCTA image={b.image} cover={b.cover} qr={b.qr} domain={b.domain} />
  : null;

export const MainLegsswellcold: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0E1D23" }}>
    <Audio src={staticFile("legsswellcold.m4a")} />

    {/* BASE contigua frame a frame: fotos · clips agnes · ventanas del avatar */}
    {BASE.map((b: any, i: number) => (
      <Sequence key={`b${i}`} from={b.from} durationInFrames={b.dur} premountFor={30}>
        {b.kind === "avatar" ? <AvatarWin src={AVATAR_REEL} trimFrames={b.trim} seed={b.seed} />
          : b.kind === "clip" ? <Clip src={b.src} seed={b.seed} frames={b.frames} />
          : <Foto src={b.src} seed={b.seed} />}
      </Sequence>
    ))}

    {/* COMPONENTES (_fed6) + CTA sobre la lámina */}
    {COMPS.map((c: any, i: number) => (
      <Sequence key={`c${i}`} from={c.from} durationInFrames={c.dur} layout="none">
        {renderComp(c, c.dur)}
      </Sequence>
    ))}
  </AbsoluteFill>
);
