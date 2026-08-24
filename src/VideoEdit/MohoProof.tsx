import React from "react";
import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { THEME_EARTH } from "./kit/premium/theme";
import { PremiumOverlay } from "./scenes/PremiumOverlay";
import { HookCaption, BeforeAfter, DateStampCorner, FramedPhoto, BulletCascade, HighlightSweep, SplitPanel, FloatingCutout, PhotoCarousel, CutawayCallouts } from "./kit/premium";

// GENERADO por gen_mohoproof.mjs — no editar a mano.
export const PAGE = 180;
const PLATE = "img/moho_rincon_volvio.png";

const CASES: { name: string; zone: any; el: (d: number) => React.ReactNode }[] = [
  { name: "0.06s HookCaption", zone: "top", el: (d) => (
    <HookCaption durationInFrames={d} theme={THEME_EARTH} {...({"words":[{"text":"Ese moho"},{"text":"que limpiaste"},{"text":"YA VOLVIÓ","boxed":true},{"text":"y más grande"}],"sub":"Y no es porque limpies mal."} as any)} />
  ) },
  { name: "2.36s fotoHero", zone: "full", el: () => (
    <AbsoluteFill><Img src={staticFile("img/moho_tomas_frente_mancha.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
  ) },
  { name: "5.52s BeforeAfter", zone: "full", el: (d) => (
    <BeforeAfter durationInFrames={d} theme={THEME_EARTH} {...({"eyebrow":"Lo que me escriben todas las semanas","beforeLabel":"Recién limpiado con cloro","afterLabel":"Tres semanas después","beforeImage":"img/moho_rincon_blanqueado.png","afterImage":"img/moho_rincon_volvio.png","caption":"Mismo rincón, misma pared, la mancha más oscura que antes."} as any)} />
  ) },
  { name: "11s fotoHero", zone: "full", el: () => (
    <AbsoluteFill><Img src={staticFile("img/moho_tomas_celular_foto.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
  ) },
  { name: "13.34s DateStampCorner", zone: "top", el: (d) => (
    <DateStampCorner durationInFrames={d} theme={THEME_EARTH} {...({"date":"3 SEMANAS DESPUÉS","place":"El mismo rincón","corner":"tr"} as any)} />
  ) },
  { name: "15.87s FramedPhoto", zone: "full", el: (d) => (
    <FramedPhoto durationInFrames={d} theme={THEME_EARTH} {...({"image":"img/moho_tomas_linterna_rincon.png","caption":"El mismo rincón, tres semanas después","sub":"Volvió más oscura, y volvió exactamente donde estaba","kenburns":true} as any)} />
  ) },
  { name: "24.72s BulletCascade", zone: "left", el: (d) => (
    <BulletCascade durationInFrames={d} theme={THEME_EARTH} {...({"eyebrow":"Que quede claro desde el primer segundo","bullets":[{"pre":"No es que ","key":"limpies mal"},{"pre":"No es que seas ","key":"descuidado"},{"pre":"No es que tu casa sea ","key":"vieja"}]} as any)} />
  ) },
  { name: "32.12s HighlightSweep", zone: "top", el: (d) => (
    <HighlightSweep durationInFrames={d} theme={THEME_EARTH} {...({"pre":"Eso negro que ves en la pared ","highlight":"no es el hongo","post":": es apenas la punta.","note":"Lo que importa está metido adentro del revoque."} as any)} />
  ) },
  { name: "36.24s SplitPanel", zone: "full", el: (d) => (
    <SplitPanel durationInFrames={d} theme={THEME_EARTH} {...({"eyebrow":"Lo que en realidad estás mirando","title":"No es suciedad","image":"img/moho_tomas_pedazo_revoque.png","bullets":["El 90% de la gente cree que es mugre pegada","No sale con trapo, ni con fuerza, ni con cloro","Sigue creciendo aunque la superficie quede blanca"]} as any)} />
  ) },
  { name: "42.67s FloatingCutout", zone: "left", el: (d) => (
    <FloatingCutout durationInFrames={d} theme={THEME_EARTH} {...({"image":"img/moho_macro_aterciopelado.png","label":"ES UN SER VIVO","sub":"Un hongo, no una mancha de suciedad"} as any)} />
  ) },
  { name: "46.78s PhotoCarousel", zone: "full", el: (d) => (
    <PhotoCarousel durationInFrames={d} theme={THEME_EARTH} {...({"title":"El mismo hongo, tres lugares distintos","items":[{"image":"img/moho_pan_olvidado.png","label":"El del pan olvidado"},{"image":"img/moho_tronco_caido.png","label":"El del tronco caído"},{"image":"img/moho_rincon_pared_pariente.png","label":"El del rincón de tu pared"}]} as any)} />
  ) },
  { name: "54.7s CutawayCallouts", zone: "full", el: (d) => (
    <CutawayCallouts durationInFrames={d} theme={THEME_EARTH} {...({"eyebrow":"Por dentro de la pared","title":"Todo hongo tiene dos partes","image":"img/moho_corte_pared_micelio.png","callouts":[{"text":"La flor","sub":"La capa negra, verde o gris, aterciopelada: es la parte que fabrica las esporas","tx":0.33,"ty":0.26,"side":"left"},{"text":"La raíz: el micelio","sub":"Red de filamentos finísimos metida adentro del poro del revoque","tx":0.58,"ty":0.68,"side":"right"}]} as any)} />
  ) },
];

export const PROOF_FRAMES = CASES.length * PAGE;

const Plate: React.FC<{ src: string }> = ({ src }) => (
  <AbsoluteFill>
    <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </AbsoluteFill>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ position: "absolute", left: 24, bottom: 18, color: "#fff", font: "600 22px system-ui",
    background: "rgba(0,0,0,.55)", padding: "6px 14px", borderRadius: 8, zIndex: 99 }}>{children}</div>
);

export const MohoProof: React.FC = () => {
  const frame = useCurrentFrame();
  const page = Math.min(CASES.length - 1, Math.floor(frame / PAGE));
  const c = CASES[page];
  const isFoto = c.name.includes("fotoHero");
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence key={page} from={page * PAGE} durationInFrames={PAGE}>
        {isFoto ? c.el(PAGE) : (
          <>
            <Plate src={PLATE} />
            <PremiumOverlay durationInFrames={PAGE} zone={c.zone} theme={THEME_EARTH}>
              {c.el(PAGE)}
            </PremiumOverlay>
          </>
        )}
        <Label>{c.name}</Label>
      </Sequence>
    </AbsoluteFill>
  );
};
