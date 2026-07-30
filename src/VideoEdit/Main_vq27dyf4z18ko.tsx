import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import {Audio, Video} from "@remotion/media";
import timeline from "./timeline_vq27dyf4z18ko.json";
import captions from "../../public/captions_vq27dyf4z18ko.json";

const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};
const palette = {ink: "#201b16", cream: "#f3ead8", amber: "#c98232", red: "#a63728", blue: "#4e8394"};

const activeCaptionIndex = (ms:number) => {
  let low = 0;
  let high = captions.length - 1;
  while (low <= high) {
    const mid = (low + high) >> 1;
    const word:any = captions[mid];
    if (ms < word.startMs) high = mid - 1;
    else if (ms > word.endMs + 80) low = mid + 1;
    else return mid;
  }
  return -1;
};

const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  const ms = frame / timeline.fps * 1000;
  const active = activeCaptionIndex(ms);
  if (active < 0) return null;
  const start = Math.max(0, active - (active % 5));
  const group = captions.slice(start, start + 5);
  return <div style={{position:"absolute",left:150,right:150,bottom:58,display:"flex",justifyContent:"center",gap:14,
    fontFamily:"Arial, sans-serif",fontSize:54,fontWeight:800,lineHeight:1.1,textTransform:"uppercase",
    textShadow:"0 4px 18px rgba(0,0,0,.9)"}}>
    {group.map((word: any, i: number) => <span key={start+i} style={{color:start+i===active?"#ffd36a":"white"}}>{word.text.trim()}</span>)}
  </div>;
};

const ComponentScene: React.FC<{scene:any}> = ({scene}) => {
  const frame = useCurrentFrame();
  const layer = scene.layers[0];
  const enter = interpolate(frame, [0, 14], [0, 1], clamp);
  const pulse = 1 + Math.sin(frame / 18) * 0.015;
  return <AbsoluteFill style={{background:`radial-gradient(circle at 70% 25%, #4e839455, transparent 35%), linear-gradient(135deg, ${palette.ink}, #40352a)`,
    color:palette.cream,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
    <div style={{position:"absolute",inset:-80,opacity:.18,transform:`rotate(${frame/20}deg)`,
      background:"repeating-conic-gradient(from 45deg, #c98232 0deg 3deg, transparent 3deg 18deg)"}}/>
    <div style={{width:1320,padding:"78px 92px",border:"3px solid #c9823288",borderRadius:44,
      background:"rgba(24,20,16,.88)",boxShadow:"0 30px 100px rgba(0,0,0,.5)",
      opacity:enter,transform:`translateY(${(1-enter)*45}px) scale(${pulse})`}}>
      <div style={{fontFamily:"Georgia, serif",fontSize:34,letterSpacing:6,color:palette.amber,marginBottom:24}}>
        {String(layer.component || "EXPLAINER").replace(/([a-z])([A-Z])/g,"$1 $2").toUpperCase()}
      </div>
      <div style={{fontFamily:"Georgia, serif",fontSize:82,fontWeight:800,lineHeight:1.02,marginBottom:34}}>
        {layer.title || scene.narration}
      </div>
      <div style={{fontFamily:"Arial, sans-serif",fontSize:38,lineHeight:1.3,color:"#eadcc5"}}>
        {layer.detail}
      </div>
      <div style={{height:10,marginTop:46,borderRadius:8,background:"#ffffff18",overflow:"hidden"}}>
        <div style={{height:"100%",width:`${Math.min(100, frame/Math.max(1,scene.duration)*100)}%`,background:palette.amber}}/>
      </div>
    </div>
  </AbsoluteFill>;
};

const VisualScene: React.FC<{scene:any}> = ({scene}) => {
  const frame = useCurrentFrame();
  const layer = scene.layers[0];
  const fadeFrames = Math.min(8, Math.max(1, Math.floor((scene.duration - 1) / 3)));
  const fadeOutStart = Math.max(fadeFrames + 1, scene.duration - fadeFrames);
  const fade = scene.duration <= 2
    ? 1
    : interpolate(frame, [0, fadeFrames, fadeOutStart, scene.duration], [0,1,1,0], clamp);
  const zoom = interpolate(frame, [0, Math.max(1, scene.duration)], [1.01, 1.09], clamp);
  if (layer.type === "component") return <ComponentScene scene={scene}/>;
  if (layer.type === "image") return <AbsoluteFill style={{background:"#111",opacity:fade}}>
    <Img src={staticFile(layer.src)} style={{width:"100%",height:"100%",objectFit:"cover",transform:`scale(${zoom})`}}/>
    <AbsoluteFill style={{background:"linear-gradient(180deg,rgba(0,0,0,.08),rgba(0,0,0,.22))"}}/>
  </AbsoluteFill>;
  const startFrom = layer.type === "avatar" ? scene.from : 0;
  return <AbsoluteFill style={{background:"#111",opacity:fade}}>
    <Video src={staticFile(layer.src)} muted startFrom={startFrom}
      style={{width:"100%",height:"100%",objectFit:"cover",transform:`scale(${layer.type==="avatar"?1:zoom})`}}/>
    {layer.type !== "avatar" ? <AbsoluteFill style={{background:"linear-gradient(180deg,transparent 55%,rgba(0,0,0,.32))"}}/> : null}
  </AbsoluteFill>;
};

export const BagasyTimeline_vq27dyf4z18ko: React.FC = () => <AbsoluteFill style={{background:"#111"}}>
  <Audio src={staticFile(timeline.audio_src)}/>
  {timeline.scenes.map((scene:any) => <Sequence key={scene.id} from={scene.from} durationInFrames={scene.duration}>
    <VisualScene scene={scene}/>
  </Sequence>)}
  <Caption/>
</AbsoluteFill>;
