import React from "react";
import {AbsoluteFill, OffthreadVideo, Sequence, staticFile} from "remotion";
import {Audio} from "@remotion/media";
import timeline from "./timeline_vaf1bq9f6c4j.json";
import {
  FedBeforeAfter,
  FedChapter,
  FedChecklist,
  FedCta,
  FedFullShot,
  FedHero,
  FedLowerThird,
  FedMolecule,
  FedOilCarousel,
  FedQuote,
  FedStat,
  FedStep,
} from "../FedererKit";

const accent = "#E9B44C";
const publicAsset = (value?: string | null) => value ? staticFile(value) : undefined;
const transitionVariant = (scene:any): "none"|"whip"|"lift"|"iris"|"fold" => {
  const value = String(scene.transition || scene.layers?.[0]?.transition_variant || "none").toLowerCase();
  return (["none","whip","lift","iris","fold"] as const).includes(value as any) ? value as any : "none";
};

const FedererComponent: React.FC<{scene:any}> = ({scene}) => {
  const layer = scene.layers[0];
  const key = String(layer.render_component || layer.family || layer.component || "hero").toLowerCase();
  const title = layer.title || "";
  const sub = layer.sub || "";
  const image = publicAsset(layer.image);
  const imageB = publicAsset(layer.image_b);
  const variant = transitionVariant(scene);
  const common = {totalF: scene.duration, accent, variant};
  if (/chapter|section|capitulo/.test(key)) return <FedChapter {...common} kicker={layer.kicker || ""} title={title} sub={sub}/>;
  if (/stat|metric|percent|number|evidence|data/.test(key)) {
    const raw = String(layer.value || "0");
    const value = Number.parseFloat(raw.replace(/[^0-9.-]/g, "")) || 0;
    const suffix = layer.suffix || (raw.includes("%") ? "%" : "");
    return <FedStat {...common} kicker={layer.kicker || ""} value={value} suffix={suffix} label={title} sub={sub} image={image}/>;
  }
  if (/quote|citation|recommendation/.test(key) && layer.attributed) return <FedQuote {...common} kicker={layer.kicker || ""} quote={title} author={layer.author || "Dr. Federer"} role={layer.role || ""} image={image}/>;
  if (/molecule|mechanism|cause|science|pathway|diagram/.test(key)) return <FedMolecule {...common} kicker={layer.kicker || ""} title={title} sub={sub} centerLabel={layer.icon || ""} image={image} nodes={(layer.nodes || []).map((label:string)=>({label}))}/>;
  if (/step|process|ritual|method|how/.test(key)) return <FedStep {...common} step={layer.step || 1} total={layer.total || 3} title={title} sub={sub} image={image}/>;
  if (/before|after|compare|versus/.test(key) && image && imageB) return <FedBeforeAfter {...common} kicker={layer.kicker || ""} title={title} imageA={image} imageB={imageB}/>;
  if (/check|list|safety|warning|boundary/.test(key)) return <FedChecklist {...common} kicker={layer.kicker || ""} title={title} items={layer.items || []}/>;
  if (/carousel|advice|options/.test(key) && (layer.cards || []).length >= 2) return <FedOilCarousel cards={layer.cards.map((card:any)=>({...card,image:staticFile(card.image)}))} kicker={layer.kicker || title} accent={accent}/>;
  if (/lower|identity|authority/.test(key)) return <FedLowerThird {...common} name={layer.author || "Dr. Federer"} role={layer.role || ""} topic={title} avatarSrc={null}/>;
  if (/cta|closing|subscribe/.test(key)) return <FedCta {...common} kicker={layer.kicker || ""} title={title} sub={sub} image={image}/>;
  return <FedHero {...common} kicker={layer.kicker || ""} title={title} sub={sub} image={image} side={scene.from % 2 ? "left" : "right"}/>;
};

const FedererScene: React.FC<{scene:any}> = ({scene}) => {
  const layer = scene.layers[0];
  const variant = transitionVariant(scene);
  if (layer.type === "avatar") return null;
  if (layer.type === "component") return <FedererComponent scene={scene}/>;
  if (layer.type === "image") return <FedFullShot totalF={scene.duration} src={staticFile(layer.src)} video={false} accent={accent} variant={variant}/>;
  return <FedFullShot totalF={scene.duration} src={staticFile(layer.src)} video startFrom={0} accent={accent} variant={variant}/>;
};

export const BagasyTimeline_vaf1bq9f6c4j: React.FC = () => <AbsoluteFill style={{background:"#020409"}}>
  <Audio src={staticFile(timeline.audio_src)}/>
  <OffthreadVideo src={staticFile(timeline.avatar_src)} muted style={{width:"100%",height:"100%",objectFit:"cover"}}/>
  {timeline.scenes.map((scene:any) => <Sequence key={scene.id} from={scene.from} durationInFrames={scene.duration}>
    <FedererScene scene={scene}/>
  </Sequence>)}
</AbsoluteFill>;
