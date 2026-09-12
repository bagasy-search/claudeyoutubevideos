import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { THEME_ALARM, THEME_AMISH, THEME_EARTH, THEME_NATURE, Theme, ThemeProvider } from "./theme";
import { VsDuel, BeforeAfter, DuelColumns, TierRanking } from "./compare";
import { BigStatReveal, StatGrid, RankBars, GaugeDial, DonutPercent } from "./stats";
import { CutawayCallouts, FlowSteps, CycleLoop, LayerStack } from "./diagrams";
import { NumberedSteps, ChecklistReveal, BulletCascade } from "./lists";
import { HookCaption, PullQuote, KaraokePhrase, HighlightSweep } from "./text";
import { TimelinePlayhead, MapPinPoint, RouteTrace, DateStampCorner } from "./place";
import { CornerEyebrow, ChapterTitle, LowerThirdId, CtaCard, StampBadge, MythTruth } from "./frame";
import { FramedPhoto, FloatingCutout, PhotoCarousel, SplitPanel } from "./media";

// ═══════════════════════════════════════════════════════════════════════════
// PremiumGallery — muestrario de TODOS los componentes del kit premium.
// Páginas de 2x2 (cada celda = el componente a 1920x1080 escalado 0.5).
// Cada página usa un theme distinto (rotando earth → nature → amish → alarm)
// para verificar themeabilidad de una pasada.
// Stills de verificación: frame = página*PAGE_DUR + 70.
// ═══════════════════════════════════════════════════════════════════════════

export const PAGE_DUR = 90;

type Demo = { name: string; el: (dur: number) => React.ReactNode };

const DEMOS: Demo[] = [
  // compare
  { name: "VsDuel", el: (d) => <VsDuel durationInFrames={d} /> },
  { name: "BeforeAfter", el: (d) => <BeforeAfter durationInFrames={d} /> },
  { name: "DuelColumns", el: (d) => <DuelColumns durationInFrames={d} /> },
  { name: "TierRanking", el: (d) => <TierRanking durationInFrames={d} /> },
  // stats
  { name: "BigStatReveal", el: (d) => <BigStatReveal durationInFrames={d} /> },
  { name: "StatGrid", el: (d) => <StatGrid durationInFrames={d} /> },
  { name: "RankBars", el: (d) => <RankBars durationInFrames={d} /> },
  { name: "GaugeDial", el: (d) => <GaugeDial durationInFrames={d} /> },
  { name: "DonutPercent", el: (d) => <DonutPercent durationInFrames={d} /> },
  // diagrams
  { name: "CutawayCallouts", el: (d) => <CutawayCallouts durationInFrames={d} /> },
  { name: "FlowSteps", el: (d) => <FlowSteps durationInFrames={d} /> },
  { name: "CycleLoop", el: (d) => <CycleLoop durationInFrames={d} /> },
  { name: "LayerStack", el: (d) => <LayerStack durationInFrames={d} /> },
  // lists
  { name: "NumberedSteps", el: (d) => <NumberedSteps durationInFrames={d} /> },
  { name: "ChecklistReveal", el: (d) => <ChecklistReveal durationInFrames={d} /> },
  { name: "BulletCascade", el: (d) => <BulletCascade durationInFrames={d} /> },
  // text
  { name: "HookCaption", el: (d) => <HookCaption durationInFrames={d} /> },
  { name: "PullQuote", el: (d) => <PullQuote durationInFrames={d} /> },
  { name: "KaraokePhrase", el: (d) => <KaraokePhrase durationInFrames={d} /> },
  { name: "HighlightSweep", el: (d) => <HighlightSweep durationInFrames={d} /> },
  // place
  { name: "TimelinePlayhead", el: (d) => <TimelinePlayhead durationInFrames={d} /> },
  { name: "MapPinPoint", el: (d) => <MapPinPoint durationInFrames={d} /> },
  { name: "RouteTrace", el: (d) => <RouteTrace durationInFrames={d} /> },
  { name: "DateStampCorner", el: (d) => <DateStampCorner durationInFrames={d} /> },
  // frame
  { name: "CornerEyebrow", el: (d) => <CornerEyebrow durationInFrames={d} /> },
  { name: "ChapterTitle", el: (d) => <ChapterTitle durationInFrames={d} /> },
  { name: "LowerThirdId", el: (d) => <LowerThirdId durationInFrames={d} /> },
  { name: "CtaCard", el: (d) => <CtaCard durationInFrames={d} /> },
  { name: "StampBadge", el: (d) => <StampBadge durationInFrames={d} /> },
  { name: "MythTruth", el: (d) => <MythTruth durationInFrames={d} /> },
  // media
  { name: "FramedPhoto", el: (d) => <FramedPhoto durationInFrames={d} /> },
  { name: "FloatingCutout", el: (d) => <FloatingCutout durationInFrames={d} /> },
  { name: "PhotoCarousel", el: (d) => <PhotoCarousel durationInFrames={d} /> },
  { name: "SplitPanel", el: (d) => <SplitPanel durationInFrames={d} /> },
];

const PAGE_THEMES: Theme[] = [THEME_EARTH, THEME_NATURE, THEME_AMISH, THEME_ALARM];

export const PAGES = Math.ceil(DEMOS.length / 4);
export const GALLERY_FRAMES = PAGES * PAGE_DUR;

const Cell: React.FC<{ demo: Demo; theme: Theme; col: number; row: number }> = ({ demo, theme, col, row }) => (
  <div
    style={{
      position: "absolute",
      left: col * 960 + 6,
      top: row * 540 + 6,
      width: 948,
      height: 528,
      overflow: "hidden",
      borderRadius: 10,
      background: theme.color.bg0,
      outline: "1px solid rgba(255,255,255,0.12)",
    }}
  >
    <div style={{ position: "absolute", width: 1920, height: 1080, transform: "scale(0.49375)", transformOrigin: "top left" }}>
      <ThemeProvider theme={theme}>{demo.el(PAGE_DUR)}</ThemeProvider>
    </div>
    <div
      style={{
        position: "absolute",
        left: 10,
        bottom: 10,
        background: "rgba(0,0,0,0.78)",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        fontWeight: 700,
        fontSize: 20,
        padding: "5px 14px",
        borderRadius: 7,
        letterSpacing: 0.5,
      }}
    >
      {demo.name} · {theme.name}
    </div>
  </div>
);

export const PremiumGallery: React.FC = () => {
  const frame = useCurrentFrame();
  const page = Math.min(PAGES - 1, Math.floor(frame / PAGE_DUR));
  return (
    <AbsoluteFill style={{ background: "#1c1c22" }}>
      {Array.from({ length: PAGES }, (_, p) => {
        if (p !== page) return null;
        const theme = PAGE_THEMES[p % PAGE_THEMES.length];
        return (
          <Sequence key={p} from={p * PAGE_DUR} durationInFrames={PAGE_DUR}>
            {DEMOS.slice(p * 4, p * 4 + 4).map((demo, i) => (
              <Cell key={demo.name} demo={demo} theme={theme} col={i % 2} row={Math.floor(i / 2)} />
            ))}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
