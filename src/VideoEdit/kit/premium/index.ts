// ═══════════════════════════════════════════════════════════════════════════
// PREMIUM KIT — biblioteca de motion-graphics de estudio, themeable.
// Importá de acá: `import { VsDuel, THEME_NATURE } from "./kit/premium";`
// Catálogo completo + guía de cuándo usar cada uno: ver README.md.
// ═══════════════════════════════════════════════════════════════════════════

// Sistema de themes
export {
  ThemeProvider,
  ThemeContext,
  useTheme,
  THEMES,
  THEME_EARTH,
  THEME_NATURE,
  THEME_AMISH,
  THEME_ALARM,
  THEME_MEDICO,
  SPR,
} from "./theme";
export type { Theme, ThemeColors } from "./theme";

// Stagecraft — el modelo de 9 capas (usalo para componer planos bespoke)
export {
  Cinema,
  Grade,
  DepthBlur,
  Shafts,
  Scrim,
  Plate,
  Band,
  Column,
  Grain,
  Halation,
  Sweep,
  Dust,
  LensVignette,
  Slab,
  useKeyLight,
  tilt3d,
  slabShadow,
  specular,
  useRack,
  Reflection,
  Bokeh,
  mblur,
  useEntrance,
  OnPaper,
  OnFootage,
  useInk,
  Backdrop,
  Plinth,
  Kicker,
  Headline,
  Underline,
  StageCtx,
  useStage,
  useDrift,
  usePush,
  autoSize,
  typeShadow,
  ZONE_INFO,
} from "./stagecraft";
export type { StageZone, StageInfo } from "./stagecraft";

// Primitivas core (para componer bespoke encima del kit)
export {
  Panel,
  Card,
  Stage,
  Eyebrow,
  Display,
  Support,
  ImgOr,
  PhotoBlock,
  ContactShadow,
  Stroke,
  Arrow,
  Tick,
  Cross,
  Odo,
  Burst,
  Motas,
  Texture,
  Rays,
  Vignette,
  useBeat,
  kick,
  rand,
  wob,
  fmt,
  clamp01,
} from "./core";

// Comparación
export { VsDuel, BeforeAfter, DuelColumns, TierRanking } from "./compare";
export type { VsSide, DuelRow, TierRow } from "./compare";

// Números / stats
export { BigStatReveal, StatGrid, RankBars, GaugeDial, DonutPercent } from "./stats";
export type { StatCell, BarRow } from "./stats";

// Diagramas
export { CutawayCallouts, FlowSteps, CycleLoop, LayerStack } from "./diagrams";
export type { Callout, FlowNode, CycleNode, StackLayer } from "./diagrams";

// Listas
export { NumberedSteps, ChecklistReveal, BulletCascade } from "./lists";
export type { Step, Bullet } from "./lists";

// Texto / énfasis
export { HookCaption, PullQuote, KaraokePhrase, HighlightSweep } from "./text";
export type { HookWord } from "./text";

// Lugar / tiempo
export { TimelinePlayhead, MapPinPoint, RouteTrace, DateStampCorner } from "./place";
export type { TimeEvent } from "./place";

// Marco / identidad
export { CornerEyebrow, ChapterTitle, LowerThirdId, CtaCard, StampBadge, MythTruth } from "./frame";

// Media
export { FramedPhoto, FloatingCutout, PhotoCarousel, SplitPanel } from "./media";
export type { CarouselItem } from "./media";
