import "./index.css";
import { AbsoluteFill, Composition, Sequence, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { MainFederer3, TOTAL_FRAMES_FED3 } from "./VideoEdit/Main_federer3";
import { AvatarPizarra } from "./VideoEdit/scenes/AvatarPizarra";
import { AvatarKeyword } from "./VideoEdit/scenes/AvatarKeyword";
import { LowerThird } from "./VideoEdit/scenes/LowerThird";
import { MitoVerdad } from "./VideoEdit/scenes/MitoVerdad";
import { ChecklistErrores } from "./VideoEdit/scenes/ChecklistErrores";
import { FraseCinetica } from "./VideoEdit/scenes/FraseCinetica";
import { ErrorStinger } from "./VideoEdit/scenes/ErrorStinger";
import { GuardaEsto } from "./VideoEdit/scenes/GuardaEsto";
import { FreezeZoom } from "./VideoEdit/scenes/FreezeZoom";
import { Media } from "./VideoEdit/components/Media";

const AV = "federer3_opt.mp4";
const ERRORS = ["Deshidratación", "Café o mate tarde", "Pantalla y postura", "Tensión nocturna", "Absorción bloqueada", "Azúcar de noche"];

const PIZ_ITEMS = [
  { at: 0, image: "img/fe3_ojo_cerca.jpg", eyebrow: "El mecanismo", caption: "La retina se repara de noche" },
  { at: 120, card: "Óxido nítrico", sub: "abre los capilares del ojo" },
  { at: 250, image: "img/fe3_arandanos_nuez.jpg", eyebrow: "El truco", caption: "Frutos rojos + una nuez" },
  { at: 390, image: "img/fe3_camina_noche.jpg", caption: "Una caminata después de cenar" },
];
const KW_ITEMS = [
  { at: 20, word: "ÓXIDO NÍTRICO", sub: "abre tus capilares", tone: "teal" as const },
  { at: 150, word: "5-6 HORAS", sub: "dura la cafeína en la sangre", tone: "warn" as const },
  { at: 300, word: "GLICACIÓN", sub: "el azúcar opaca el cristalino", tone: "warn" as const, image: "img/fe3_postre_noche.jpg" },
];
const FRASE = [
  { t: "El" }, { t: "daño" }, { t: "se" }, { t: "hace" }, { t: "mientras", hl: true }, { t: "dormís", hl: true },
];

const avatarBg = (from = 6000) => <OffthreadVideo src={staticFile(AV)} trimBefore={from} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />;

const LowerThirdDemo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0E1B22" }}>
    {avatarBg()}
    <Sequence from={20} durationInFrames={190} layout="none"><LowerThird durationInFrames={190} kicker="Advertencia" title="El daño se hace mientras dormís" desc="Si tu retina no recibe oxígeno de noche, la vista se nubla." tone="warn" /></Sequence>
    <Sequence from={230} durationInFrames={210} layout="none"><LowerThird durationInFrames={210} kicker="El truco" title="Café solo hasta el mediodía" desc="Después de las 3-4 pm te roba el sueño profundo." tone="teal" /></Sequence>
  </AbsoluteFill>
);
const ChecklistDemo: React.FC = () => {
  const f = useCurrentFrame();
  const active = Math.min(5, Math.floor(Math.max(0, f - 40) / 135)); // arranca tranquilo, revela cada ~4.5s
  return (<AbsoluteFill style={{ backgroundColor: "#0E1B22" }}>{avatarBg()}<ChecklistErrores durationInFrames={870} items={ERRORS} active={active} /></AbsoluteFill>);
};
const FraseDemo: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0E1B22" }}>
    <Media src="img/fe3_dormir_noche.jpg" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    <FraseCinetica durationInFrames={120} words={FRASE} perWord={11} tone="warn" />
  </AbsoluteFill>
);

export const RootFederer3: React.FC = () => (
  <>
    <Composition id="Federer3" component={MainFederer3} durationInFrames={TOTAL_FRAMES_FED3} fps={30} width={1920} height={1080} />
    <Composition id="AvatarPizarraDemo" component={AvatarPizarra} durationInFrames={520} fps={30} width={1920} height={1080} defaultProps={{ durationInFrames: 520, items: PIZ_ITEMS, avatar: AV, avatarFrom: 6000 }} />
    <Composition id="AvatarKeywordDemo" component={AvatarKeyword} durationInFrames={420} fps={30} width={1920} height={1080} defaultProps={{ durationInFrames: 420, items: KW_ITEMS, avatar: AV, avatarFrom: 6000 }} />
    <Composition id="LowerThirdDemo" component={LowerThirdDemo} durationInFrames={460} fps={30} width={1920} height={1080} />
    <Composition id="MitoVerdadDemo" component={MitoVerdad} durationInFrames={180} fps={30} width={1920} height={1080} defaultProps={{ durationInFrames: 180, myth: "Es la edad, no hay nada que hacer", truth: "Es tu circulación de noche" }} />
    <Composition id="ChecklistErroresDemo" component={ChecklistDemo} durationInFrames={870} fps={30} width={1920} height={1080} />
    <Composition id="FraseCineticaDemo" component={FraseDemo} durationInFrames={120} fps={30} width={1920} height={1080} />
    <Composition id="ErrorStingerDemo" component={ErrorStinger} durationInFrames={60} fps={30} width={1920} height={1080} defaultProps={{ durationInFrames: 60, number: "04", title: "La pantalla y la postura", tone: "warn" as const }} />
    <Composition id="GuardaEstoDemo" component={GuardaEsto} durationInFrames={180} fps={30} width={1920} height={1080} defaultProps={{ durationInFrames: 180, title: "Tu rutina de la noche", items: [
      { text: "Cena liviana, sin azúcar", image: "img/fe3_cena_liviana.jpg" },
      { text: "Último vaso de agua 45 min antes", image: "img/fe3_toma_ultimo_vaso.jpg" },
      { text: "Frutos rojos + una nuez", image: "img/fe3_arandanos_nuez.jpg" },
      { text: "Pantallas apagadas, luz cálida", image: "img/fe3_apaga_celular.jpg" },
      { text: "Caminata de 10-15 min", image: "img/fe3_camina_noche.jpg" },
    ] }} />
    <Composition id="FreezeZoomDemo" component={FreezeZoom} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={{ durationInFrames: 90, image: "img/fe3_ojo_cerca.jpg", x: 0.6, y: 0.45, label: "La retina", zoom: 2.0, tone: "teal" as const }} />
  </>
);
