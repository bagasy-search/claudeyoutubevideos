import "./index.css";
import { Composition } from "remotion";
import {
  RenalLowerThird,
  FoodVerdict,
  CreatininaMeter,
  AlertSignals,
  RenalChapter,
  BastidaKitReel,
} from "./bastida/BastidaKit";
import { RenalCarousel } from "./bastida/BastidaCarousel";
import { FearToCalm, StrikeChips, HandUnderline, PresenterIntro, SideIllustration } from "./bastida/BastidaFX";
import { BenefitScene } from "./bastida/BenefitScene";
import { MainBastida, TOTAL_MIN1 } from "./bastida/Main_bastida";
import { MainBastida2, TOTAL_2 } from "./bastida/Main_bastida2";
import { ChapterAguaLimon } from "./bastida/ChapterAguaLimon";
import { ChapterScene, CHAPTER_CONFIGS } from "./bastida/ChapterScene";
import { CreatininaScene } from "./bastida/CreatininaScene";
import { FoodVerdictScene } from "./bastida/FoodVerdictScene";
import { AlertSignalsScene } from "./bastida/AlertSignalsScene";
import { GuideCTAScene } from "./bastida/GuideCTAScene";
import { NightShiftScene, OxidationScene } from "./bastida/VideoScenes2";

// Root de REVIEW del kit "Dr. Bastida · Salud Renal" — cada componente firma como su
// propia Composition (prefijo Bas_) para verlo aislado, + Bas_KitReel que los encadena.
// Render de uno: npx remotion render src/index-bastida.ts Bas_FoodVerdict out.mp4
export const RootBastida: React.FC = () => (
  <>
    <Composition
      id="Bas-Main-Min1"
      component={MainBastida}
      durationInFrames={TOTAL_MIN1}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="Bas-Main2"
      component={MainBastida2}
      durationInFrames={TOTAL_2}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="Bas-RenalCarousel"
      component={RenalCarousel}
      durationInFrames={480}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        title: "5 bebidas que sus riñones necesitan",
        kicker: "Salud renal · 60+",
        introDur: 42,
        reveals: [60, 150, 240, 330, 420],
        cards: [
          { name: "Agua con limón", img: "img/bas_agua_limon.png" },
          { name: "Agua de cebada", img: "img/bas_cebada.png" },
          { name: "Jengibre", img: "img/bas_jengibre.png" },
          { name: "Hibisco", img: "img/bas_hibisco.png" },
          { name: "Agua", img: "img/bas_agua.png" },
        ],
      }}
    />
    <Composition
      id="Bas-BenefitFarmacia"
      component={BenefitScene}
      durationInFrames={90}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ variant: "farmacia" as const }}
    />
    <Composition
      id="Bas-BenefitFortuna"
      component={BenefitScene}
      durationInFrames={90}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ variant: "fortuna" as const }}
    />
    <Composition
      id="Bas-PresenterIntro"
      component={PresenterIntro}
      durationInFrames={150}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        name: "Dr. Emilio Bastida",
        role: "Nefrólogo · Salud Renal",
        kicker: "Su médico de confianza",
        img: "renal/bastida_cutout.png",
      }}
    />
    <Composition
      id="Bas-CarouselTease"
      component={RenalCarousel}
      durationInFrames={120}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        title: "Una de estas cinco…",
        kicker: "Salud renal · 60+",
        introDur: 42,
        reveals: [],
        teaseIndex: 2,
        cards: [
          { name: "Agua con limón", tint: "#D9E24A" },
          { name: "Agua de cebada", tint: "#D9B36A" },
          { name: "Jengibre", tint: "#E8912F" },
          { name: "Hibisco", tint: "#C63B6A" },
          { name: "Agua", tint: "#34C6E0" },
        ],
      }}
    />
    <Composition
      id="Bas-StrikeChips"
      component={StrikeChips}
      durationInFrames={90}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        bg: "#0A2536",
        items: [
          { label: "Sin farmacia", icon: "cross" as const },
          { label: "Sin gastar una fortuna", icon: "money" as const },
        ],
      }}
    />
    <Composition
      id="Bas-HandUnderline"
      component={HandUnderline}
      durationInFrames={90}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ phrase: "todavía está a tiempo", note: "¡a tiempo!", bg: "#0A2536" }}
    />
    <Composition
      id="Bas-FearToCalm"
      component={FearToCalm}
      durationInFrames={210}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ word: "DIÁLISIS", calm: ["Respire.", "No estamos ahí."], breakAt: 96 }}
    />
    <Composition
      id="Bas-KitReel"
      component={BastidaKitReel}
      durationInFrames={30 * 15}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition id="Bas-NightShift" component={NightShiftScene} durationInFrames={110} fps={30} width={1920} height={1080} />
    <Composition id="Bas-Oxidation" component={OxidationScene} durationInFrames={110} fps={30} width={1920} height={1080} defaultProps={{ breakAt: 60 }} />
    <Composition id="Bas-GuideCTAScene" component={GuideCTAScene} durationInFrames={120} fps={30} width={1920} height={1080} />
    <Composition id="Bas-AlertSignalsScene" component={AlertSignalsScene} durationInFrames={120} fps={30} width={1920} height={1080} />
    <Composition id="Bas-FoodVerdictScene" component={FoodVerdictScene} durationInFrames={120} fps={30} width={1920} height={1080} />
    <Composition id="Bas-CreatininaScene" component={CreatininaScene} durationInFrames={120} fps={30} width={1920} height={1080} defaultProps={{ from: 2.4, to: 1.3, caption: "Creatinina", subcaption: "se estabilizó" }} />
    <Composition id="Bas-Chapter-Cebada" component={ChapterScene} durationInFrames={100} fps={30} width={1920} height={1080} defaultProps={CHAPTER_CONFIGS.cebada} />
    <Composition id="Bas-Chapter-Jengibre" component={ChapterScene} durationInFrames={100} fps={30} width={1920} height={1080} defaultProps={CHAPTER_CONFIGS.jengibre} />
    <Composition id="Bas-Chapter-Hibisco" component={ChapterScene} durationInFrames={100} fps={30} width={1920} height={1080} defaultProps={CHAPTER_CONFIGS.hibisco} />
    <Composition id="Bas-Chapter-Agua" component={ChapterScene} durationInFrames={100} fps={30} width={1920} height={1080} defaultProps={CHAPTER_CONFIGS.agua} />
    <Composition
      id="Bas-SideIllustration"
      component={SideIllustration}
      durationInFrames={120}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ img: "img/ill/bas_ill_lemon_water.png", side: "right" as const, caption: "Agua con limón", dur: 120, size: 460 }}
    />
    <Composition
      id="Bas-ChapterAguaLimon"
      component={ChapterAguaLimon}
      durationInFrames={100}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="Bas-RenalChapter"
      component={RenalChapter}
      durationInFrames={30 * 3}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ number: "3", unit: "FRUTAS", subtitle: "que puede comer sin riesgo", mood: "water" as const }}
    />
    <Composition
      id="Bas-FoodVerdict"
      component={FoodVerdict}
      durationInFrames={30 * 4}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        title: "Riñones en riesgo",
        goodLabel: "PROTEGEN",
        badLabel: "DAÑAN",
        good: [{ name: "Arándanos" }, { name: "Coliflor" }, { name: "Pimiento rojo" }, { name: "Clara de huevo" }],
        bad: [{ name: "Embutidos" }, { name: "Quesos curados" }, { name: "Refrescos cola" }, { name: "Enlatados" }],
        mood: "science" as const,
      }}
    />
    <Composition
      id="Bas-CreatininaMeter"
      component={CreatininaMeter}
      durationInFrames={30 * 4}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ from: 2.4, to: 1.1, unit: "mg/dL", caption: "Creatinina", subcaption: "en 30 días" }}
    />
    <Composition
      id="Bas-AlertSignals"
      component={AlertSignals}
      durationInFrames={30 * 5}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        title: "Sus riñones ya están pidiendo ayuda",
        signals: [
          "Orina espumosa por la mañana",
          "Hinchazón en tobillos y párpados",
          "Cansancio que no se va",
          "Picazón en la piel sin causa",
        ],
        footer: "Si reconoce 2 o más, consulte a su médico",
      }}
    />
    <Composition
      id="Bas-RenalLowerThird"
      component={RenalLowerThird}
      durationInFrames={30 * 3}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{ name: "Dr. Emilio Bastida", role: "Nefrólogo · Salud Renal", tag: "RIÑONES 60+", focusX: 0.5 }}
    />
  </>
);
