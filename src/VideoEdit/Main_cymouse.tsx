import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, interpolate, Easing } from "remotion";
import { Video } from "@remotion/media";
import { AvatarLayer, type AvatarWindow } from "./scenes/AvatarLayer";
import { KineticHeadline } from "./scenes/KineticHeadline";
import {
  BigNumber, ParchmentCard, QuoteCard, ChecklistCard, CornerLabel, PaperChart,
} from "./amish/AmishKit";
import {
  ToothChisel, MouseGapScale, EntryPointMap, HuntTool, PackLayers, MetalVsWool,
} from "./amish/MouseKit";
import { CY_BEATS, CY_BROLL, CY_END, CY_SEAM } from "./cues_cymouse.gen";

// ═══════════════════════════════════════════════════════════════════════════
// cymouse — "Two Cheap Metals Eliminate Any Mouse Forever"
// Canal: claudio yoder (@claudioyoder-amish) · look amish-doc, modo AVATAR.
//
// Particularidad de este video: el creador grabó el avatar SÓLO con los primeros
// 11:01 de la locución. `cymouse_opt.mp4` es ese avatar repetido 2× con el audio
// master de 20:15 ya muxeado. El lipsync es exacto hasta CY_SEAM (661,2 s) y de
// ahí en adelante es un bucle — por eso:
//   · la costura (661,2 s) cae SIEMPRE bajo b-roll o componente (lo verifica el generador)
//   · después de la costura el DIRECTOR no le cede momentos al presentador: queda
//     de fondo en huecos cortos, donde una boca desincronizada no se lee
//
// ★ ANTI-HUECO: el avatar es el FONDO GARANTIZADO. La base de `buildWindows` es "full";
//   sólo se oculta mientras hay contenido encima, y cada contenido trae su cobertura REAL
//   (sondeada con ffprobe en el generador). Los OVERLAY (CornerLabel) NO ocultan el avatar:
//   están diseñados para ir encima, y si ocultaran quedarían segundos de negro.
// ═══════════════════════════════════════════════════════════════════════════

const FPS = 30;
const sec = (s: number) => Math.round(s * FPS);
export const TOTAL_FRAMES_CYMOUSE = sec(CY_END);
const AVATAR = "cymouse_opt.mp4";

const OVERLAY_KINDS = new Set(["CornerLabel"]);

// ventanas del QR: sólo mientras se menciona la guía (CTA 1 y CTA de cierre)
const QR_WINDOWS: [number, number][] = [
  [524.0, 541.0],     // cta1 — "el link está arriba de la descripción"
  [1152.6, 1176.0],   // close — el pedido final
];

function buildWindows(): AvatarWindow[] {
  type Iv = { s: number; e: number };
  const ivComp: Iv[] = CY_BEATS.filter((b) => !OVERLAY_KINDS.has(b.kind))
    .map((b) => ({ s: b.start, e: b.start + b.dur }));
  const ivCont: Iv[] = CY_BROLL.map((b) => ({ s: b.start, e: b.start + b.dur }));
  const dentro = (ivs: Iv[], t: number) => ivs.some((x) => t >= x.s - 0.02 && t < x.e - 0.02);

  const w: AvatarWindow[] = [];
  let last: AvatarWindow["mode"] | null = null;
  for (let t = 0; t <= CY_END + 0.001; t += 0.1) {
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
  const zoom = dir === 1
    ? interpolate(f, [0, dur], [1, 1.07], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) })
    : interpolate(f, [0, dur], [1.07, 1], { extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad) });
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#14100b" }}>
      <Img
        src={staticFile(src)}
        style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, willChange: "transform" }}
      />
    </AbsoluteFill>
  );
};

/** QR del canal — grande, o no se escanea en un celular */
const QrCorner: React.FC<{ durF: number }> = ({ durF }) => {
  const f = useCurrentFrame();
  const op = Math.min(
    interpolate(f, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(f, [durF - 12, durF], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{
        position: "absolute", right: 54, bottom: 54, opacity: op,
        display: "flex", alignItems: "center", gap: 26,
        background: "rgba(244,238,224,0.97)", border: "3px solid #6b4f2a",
        borderRadius: 24, padding: "26px 30px",
        boxShadow: "0 14px 44px rgba(40,26,10,0.42)",
        transform: `translateY(${(1 - op) * 16}px)`,
      }}>
        <Img src={staticFile("qr_almanac.png")} style={{ width: 300, height: 300, borderRadius: 12, background: "#fff", padding: 14 }} />
        <div style={{ maxWidth: 300, fontFamily: "Georgia, 'EB Garamond', serif", color: "#3a2a14" }}>
          <div style={{ fontSize: 42, fontWeight: 700, lineHeight: 1.08 }}>The Plain Almanac</div>
          <div style={{ fontSize: 30, marginTop: 12, color: "#6b4f2a", fontStyle: "italic" }}>Scan for the free guide</div>
          <div style={{ fontSize: 22, marginTop: 8, color: "#7c6a4c" }}>— or the link in the description</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const renderComp = (b: any, d: number) => {
  switch (b.kind) {
    // kit amish
    case "BigNumber":       return <BigNumber durationInFrames={d} value={b.value} label={b.label} sub={b.sub} />;
    case "ParchmentCard":   return <ParchmentCard durationInFrames={d} title={b.title} body={b.body} side={b.side} />;
    case "QuoteCard":       return <QuoteCard durationInFrames={d} quote={b.quote} source={b.source} />;
    case "ChecklistCard":   return <ChecklistCard durationInFrames={d} title={b.title} items={b.items} />;
    case "PaperChart":      return <PaperChart durationInFrames={d} title={b.title} unit={b.unit} rows={b.rows} />;
    case "CornerLabel":     return <CornerLabel durationInFrames={d} text={b.text} sub={b.sub} corner={b.corner} />;
    case "KineticHeadline": return <KineticHeadline durationInFrames={d} tokens={b.tokens} eyebrow={b.eyebrow} hue={b.hue ?? "amber"} bg={b.bg ?? "black"} />;
    // kit propio de este video
    case "ToothChisel":     return <ToothChisel durationInFrames={d} mode={b.mode} title={b.title} caption={b.caption} />;
    case "MouseGapScale":   return <MouseGapScale durationInFrames={d} mode={b.mode} title={b.title} caption={b.caption} />;
    case "EntryPointMap":   return <EntryPointMap durationInFrames={d} active={b.active} title={b.title} caption={b.caption} />;
    case "HuntTool":        return <HuntTool durationInFrames={d} mode={b.mode} title={b.title} caption={b.caption} />;
    case "PackLayers":      return <PackLayers durationInFrames={d} step={b.step} title={b.title} caption={b.caption} />;
    case "MetalVsWool":     return <MetalVsWool durationInFrames={d} title={b.title} left={b.left} right={b.right} />;
    default:                return null;
  }
};

export const MainCymouse: React.FC = () => (
  <AbsoluteFill style={{ background: "#14100b" }}>
    {/* 1 · AVATAR — fondo garantizado + audio master (una sola instancia montada) */}
    <AvatarLayer src={AVATAR} windows={AVATAR_WINDOWS} wav="cymouse.wav" />

    {/* 2 · B-ROLL — clips de agnes sin cortar (el movimiento ya es del clip) y fotos con deriva */}
    {CY_BROLL.map((b: any, i: number) => (
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
    {CY_BEATS.map((b: any, i: number) => {
      const d = Math.max(1, sec(b.dur));
      return (
        <Sequence key={`c${i}`} from={sec(b.start)} durationInFrames={d} layout="none">
          {renderComp(b, d)}
        </Sequence>
      );
    })}

    {/* 4 · QR de la guía — sólo en las ventanas donde se la menciona */}
    {QR_WINDOWS.map(([s, e], i) => (
      <Sequence key={`q${i}`} from={sec(s)} durationInFrames={sec(e - s)} layout="none">
        <QrCorner durF={sec(e - s)} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
