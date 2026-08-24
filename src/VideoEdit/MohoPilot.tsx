import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { THEME_EARTH } from "./kit/premium/theme";
import { PremiumOverlay } from "./scenes/PremiumOverlay";
import { HookCaption, BeforeAfter, FramedPhoto, BulletCascade, PhotoCarousel, CutawayCallouts } from "./kit/premium";

// GENERADO por gen_mohopilot.mjs — no editar a mano.
export const PILOT_FRAMES = 1917;

/** Capa base: mientras no exista el avatar, una foto fija de Tomás. */
const FullPhoto: React.FC<{ src: string }> = ({ src }) => (
  <AbsoluteFill><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
);

/** Fundido de entrada entre escenas de contenido (nunca contra el avatar). */
const Fade: React.FC<{ on: boolean; dur: number; z: number; children: React.ReactNode }> = ({ on, dur, z, children }) => {
  const f = useCurrentFrame();
  const op = on ? interpolate(f, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
  return <AbsoluteFill style={{ opacity: op, zIndex: z }}>{children}</AbsoluteFill>;
};

export const MohoPilot: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    {/* narración real: el máster completo, el piloto corta a los ~64s */}
    <Audio src={staticFile("moho.wav")} volume={1} />
    <FullPhoto src="ref_moho.png" />
      <Sequence from={2} durationInFrames={164} layout="none">
        <Fade on={false} dur={12} z={10}>
          <PremiumOverlay durationInFrames={164} zone="top" theme={THEME_EARTH}>
            <HookCaption durationInFrames={164} theme={THEME_EARTH} {...({"words":[{"text":"Ese moho"},{"text":"que limpiaste"},{"text":"YA VOLVIÓ","boxed":true}],"sub":"Y volvió más grande."} as any)} />
          </PremiumOverlay>
        </Fade>
        <Sequence from={0} durationInFrames={40} layout="none"><Audio src={staticFile("sfx/lib/impact_soft_1.mp3")} volume={0.32} /></Sequence>
      </Sequence>
      <Sequence from={166} durationInFrames={176} layout="none">
        <Fade on={false} dur={12} z={11}>
          <PremiumOverlay durationInFrames={176} zone="full" theme={THEME_EARTH}>
            <BeforeAfter durationInFrames={176} theme={THEME_EARTH} {...({"eyebrow":"Lo que me escriben","beforeLabel":"Con cloro","afterLabel":"Tres semanas después","beforeImage":"img/moho_rincon_blanqueado.png","afterImage":"img/moho_rincon_volvio.png","caption":"Volvió más oscura"} as any)} />
          </PremiumOverlay>
        </Fade>
        <Sequence from={0} durationInFrames={40} layout="none"><Audio src={staticFile("sfx/lib/swish_1.mp3")} volume={0.32} /></Sequence>
      </Sequence>
      <Sequence from={330} durationInFrames={70} layout="none">
        <Fade on={true} dur={12} z={12}>
          <FullPhoto src="img/moho_tomas_celular_foto.png" />
        </Fade>
        <Sequence from={0} durationInFrames={40} layout="none"><Audio src={staticFile("sfx/lib/click_soft_1.mp3")} volume={0.32} /></Sequence>
      </Sequence>
      <Sequence from={400} durationInFrames={76} layout="none">
        <Fade on={false} dur={12} z={13}>
          <FullPhoto src="ref_moho.png" />
        </Fade>
        <Sequence from={0} durationInFrames={40} layout="none"><Audio src={staticFile("sfx/lib/tick_1.mp3")} volume={0.32} /></Sequence>
      </Sequence>
      <Sequence from={476} durationInFrames={167} layout="none">
        <Fade on={false} dur={12} z={14}>
          <PremiumOverlay durationInFrames={167} zone="full" theme={THEME_EARTH}>
            <FramedPhoto durationInFrames={167} theme={THEME_EARTH} {...({"image":"img/moho_tomas_linterna_rincon.png","caption":"Mismo rincón otra vez","sub":"Más oscura que antes","kenburns":true,"push":0.45,"captionAt":2.69,"typewriter":true} as any)} />
          </PremiumOverlay>
        </Fade>
        <Sequence from={0} durationInFrames={40} layout="none"><Audio src={staticFile("sfx/lib/whoosh_soft_1.mp3")} volume={0.32} /></Sequence>
      </Sequence>
      <Sequence from={643} durationInFrames={99} layout="none">
        <Fade on={false} dur={12} z={15}>
          <FullPhoto src="ref_moho.png" />
        </Fade>
        <Sequence from={0} durationInFrames={40} layout="none"><Audio src={staticFile("sfx/lib/tap_1.mp3")} volume={0.32} /></Sequence>
      </Sequence>
      <Sequence from={742} durationInFrames={222} layout="none">
        <Fade on={false} dur={12} z={16}>
          <PremiumOverlay durationInFrames={222} zone="left" theme={THEME_EARTH}>
            <BulletCascade durationInFrames={222} theme={THEME_EARTH} {...({"eyebrow":"Que quede claro","bullets":[{"pre":"No es que ","key":"limpies mal"},{"pre":"No es que seas ","key":"descuidado"},{"pre":"No es que tu casa sea ","key":"vieja"}]} as any)} />
          </PremiumOverlay>
        </Fade>
        <Sequence from={0} durationInFrames={40} layout="none"><Audio src={staticFile("sfx/lib/page_flip_1.mp3")} volume={0.32} /></Sequence>
      </Sequence>
      <Sequence from={964} durationInFrames={124} layout="none">
        <Fade on={false} dur={12} z={17}>
          <FullPhoto src="img/moho_tomas_frente_mancha.png" />
        </Fade>
        <Sequence from={0} durationInFrames={40} layout="none"><Audio src={staticFile("sfx/lib/sub_drop_1.mp3")} volume={0.32} /></Sequence>
      </Sequence>
      <Sequence from={1087} durationInFrames={113} layout="none">
        <Fade on={false} dur={12} z={18}>
          <FullPhoto src="ref_moho.png" />
        </Fade>
        <Sequence from={0} durationInFrames={40} layout="none"><Audio src={staticFile("sfx/lib/tick_2.mp3")} volume={0.32} /></Sequence>
      </Sequence>
      <Sequence from={1200} durationInFrames={143} layout="none">
        <Fade on={false} dur={12} z={19}>
          <FullPhoto src="img/moho_tomas_pedazo_revoque.png" />
        </Fade>
        <Sequence from={0} durationInFrames={40} layout="none"><Audio src={staticFile("sfx/lib/light_pass_1.mp3")} volume={0.32} /></Sequence>
      </Sequence>
      <Sequence from={1331} durationInFrames={84} layout="none">
        <Fade on={true} dur={12} z={20}>
          <FullPhoto src="img/moho_macro_aterciopelado.png" />
        </Fade>
        <Sequence from={0} durationInFrames={40} layout="none"><Audio src={staticFile("sfx/lib/transition_1.mp3")} volume={0.32} /></Sequence>
      </Sequence>
      <Sequence from={1403} durationInFrames={158} layout="none">
        <Fade on={true} dur={12} z={21}>
          <PremiumOverlay durationInFrames={158} zone="full" theme={THEME_EARTH}>
            <PhotoCarousel durationInFrames={158} theme={THEME_EARTH} {...({"title":"El mismo hongo","shutter":true,"items":[{"image":"img/moho_pan_olvidado.png","label":"El pan olvidado"},{"image":"img/moho_tronco_caido.png","label":"El tronco caído"},{"image":"img/moho_rincon_pared_pariente.png","label":"Tu pared"}]} as any)} />
          </PremiumOverlay>
        </Fade>
        <Sequence from={0} durationInFrames={40} layout="none"><Audio src={staticFile("sfx/lib/card_slide_1.mp3")} volume={0.32} /></Sequence>
      </Sequence>
      <Sequence from={1561} durationInFrames={80} layout="none">
        <Fade on={false} dur={12} z={22}>
          <FullPhoto src="ref_moho.png" />
        </Fade>
        <Sequence from={0} durationInFrames={40} layout="none"><Audio src={staticFile("sfx/lib/tap_2.mp3")} volume={0.32} /></Sequence>
      </Sequence>
      <Sequence from={1641} durationInFrames={276} layout="none">
        <Fade on={false} dur={12} z={23}>
          <PremiumOverlay durationInFrames={276} zone="full" theme={THEME_EARTH}>
            <CutawayCallouts durationInFrames={276} theme={THEME_EARTH} {...({"eyebrow":"Adentro de la pared","title":"Tiene dos partes","image":"img/moho_corte_pared_micelio.png","callouts":[{"text":"La flor","sub":"Fabrica esporas","tx":0.34,"ty":0.24,"side":"left"},{"text":"La raíz","sub":"El micelio","tx":0.58,"ty":0.68,"side":"right"}]} as any)} />
          </PremiumOverlay>
        </Fade>
        <Sequence from={0} durationInFrames={40} layout="none"><Audio src={staticFile("sfx/lib/whoosh_glass_1.mp3")} volume={0.32} /></Sequence>
      </Sequence>
  </AbsoluteFill>
);
