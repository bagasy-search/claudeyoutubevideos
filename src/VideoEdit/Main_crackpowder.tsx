import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { Video } from "@remotion/media";
import { AvatarLayer, type AvatarWindow } from "./scenes/AvatarLayer";
import { KineticHeadline } from "./scenes/KineticHeadline";
import { OptionCompare } from "./scenes/OptionCompare";
import {
  BigNumber, ParchmentCard, QuoteCard, ChecklistCard, CornerLabel,
} from "./amish/AmishKit";
import { CrackRepairDiagram } from "./amish/CrackRepairDiagram";
import { CP_BEATS, CP_BROLL, CP_END } from "./cues_crackpowder.gen";

// ═══════════════════════════════════════════════════════════════════════════
// crackpowder — "The $1 Powder That Seals Every Concrete Crack"
// Canal: claudio yoder (@claudioyoder-amish) · look amish-doc, modo AVATAR.
//
// Particularidad de este video: el avatar REAL dura 8:30 y el master 27:16, así que
// `crackpowder_opt.mp4` es ese avatar repetido 4× con el audio master ya muxeado. El
// lipsync es exacto hasta 510 s (secciones 1-4) y de ahí en adelante es un bucle, por
// eso las costuras (510 / 1020 / 1530 s) caen SIEMPRE bajo b-roll o componente — el
// plan lo verifica y el DIRECTOR lo respetó.
//
// ★ ANTI-HUECO: el avatar es el FONDO GARANTIZADO. La base de `buildWindows` es "full";
//   sólo se oculta mientras hay contenido encima, y cada contenido trae su cobertura REAL
//   (sondeada con ffprobe en el generador). Los overlays (CornerLabel) NO ocultan el avatar:
//   están diseñados para ir encima, y si ocultaran quedarían segundos de negro.
// ═══════════════════════════════════════════════════════════════════════════

const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);
export const TOTAL_FRAMES_CP = sec(CP_END);
const AVATAR = "crackpowder_opt.mp4";

const OVERLAY_KINDS = new Set(["CornerLabel"]);

function buildWindows(): AvatarWindow[] {
  type Iv = { s: number; e: number };
  // los overlays quedan FUERA: no tapan al avatar, van encima
  const ivComp: Iv[] = CP_BEATS.filter((b) => !OVERLAY_KINDS.has(b.kind)).map((b) => ({ s: b.start, e: b.start + b.dur }));
  const ivCont: Iv[] = CP_BROLL.map((b) => ({ s: b.start, e: b.start + b.dur }));
  const dentro = (ivs: Iv[], t: number) => ivs.some((x) => t >= x.s - 0.02 && t < x.e - 0.02);

  const w: AvatarWindow[] = [];
  let last: AvatarWindow["mode"] | null = null;
  for (let t = 0; t <= CP_END + 0.001; t += 0.1) {
    // base FULL: apenas se termina el contenido, el avatar vuelve a llenar la pantalla
    const mode: AvatarWindow["mode"] = dentro(ivComp, t) || dentro(ivCont, t) ? "hidden" : "full";
    if (mode !== last) { w.push({ start: +t.toFixed(2), mode }); last = mode; }
  }
  if (!w.length || w[0].start > 0) w.unshift({ start: 0, mode: "full" });
  return w;
}
const AVATAR_WINDOWS = buildWindows();

/** foto quieta con deriva lenta — el Ken Burns sutil del canal, nunca brusco */
const Still: React.FC<{ src: string; dur: number; i: number }> = ({ src, dur, i }) => {
  const f = useCurrentFrame();
  const dir = i % 2 === 0 ? 1 : -1;
  const z = interpolate(f, [0, dur], [1.045 - dir * 0.045, 1.045 + dir * 0.0], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const zoom = dir === 1 ? interpolate(f, [0, dur], [1, 1.07], { extrapolateRight: "clamp" })
                         : interpolate(f, [0, dur], [1.07, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#14100b" }}>
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, willChange: "transform" }}
      />
    </AbsoluteFill>
  );
};

const renderComp = (b: any, d: number) => {
  switch (b.kind) {
    case "BigNumber":          return <BigNumber durationInFrames={d} value={b.value} label={b.label} sub={b.sub} />;
    case "ParchmentCard":      return <ParchmentCard durationInFrames={d} title={b.title} body={b.body} side={b.side} />;
    case "QuoteCard":          return <QuoteCard durationInFrames={d} quote={b.quote} source={b.source} />;
    case "ChecklistCard":      return <ChecklistCard durationInFrames={d} title={b.title} items={b.items} />;
    case "CornerLabel":        return <CornerLabel durationInFrames={d} text={b.text} sub={b.sub} corner={b.corner} />;
    case "KineticHeadline":    return <KineticHeadline durationInFrames={d} tokens={b.tokens} eyebrow={b.eyebrow} hue="amber" bg="black" />;
    case "OptionCompare":      return <OptionCompare durationInFrames={d} left={b.left} right={b.right} />;
    case "CrackRepairDiagram": return <CrackRepairDiagram durationInFrames={d} mode={b.mode} title={b.title} caption={b.caption} />;
    default:                   return null;
  }
};

export const MainCrackpowder: React.FC = () => (
  <AbsoluteFill style={{ background: "#14100b" }}>
    {/* 1 · AVATAR — fondo garantizado + audio master (una sola instancia montada) */}
    <AvatarLayer src={AVATAR} windows={AVATAR_WINDOWS} wav="crackpowder.wav" />

    {/* 2 · B-ROLL — clips de agnes (sin cortar: el movimiento ya es del clip) y fotos con deriva */}
    {CP_BROLL.map((b: any, i: number) => (
      <Sequence key={`v${i}`} from={sec(b.start)} durationInFrames={Math.max(1, sec(b.dur))} layout="none">
        {b.video ? (
          <AbsoluteFill style={{ background: "#14100b" }}>
            <Video src={staticFile(b.src)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
        ) : (
          <Still src={b.src} dur={Math.max(1, sec(b.dur))} i={i} />
        )}
      </Sequence>
    ))}

    {/* 3 · COMPONENTES — encima del b-roll; los overlay conviven con el avatar */}
    {CP_BEATS.map((b: any, i: number) => {
      const d = Math.max(1, sec(b.dur));
      return (
        <Sequence key={`c${i}`} from={sec(b.start)} durationInFrames={d} layout="none">
          {renderComp(b, d)}
        </Sequence>
      );
    })}
  </AbsoluteFill>
);
