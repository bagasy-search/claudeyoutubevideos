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
import timeline from "./timeline_v48vr0jexdrms.json";
const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};
const palette = {ink: "#201b16", cream: "#f3ead8", amber: "#c98232", red: "#a63728", blue: "#4e8394"};

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
  const fade = interpolate(frame, [0, 8, Math.max(9, scene.duration-8), scene.duration], [0,1,1,0], clamp);
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

export const BagasyTimeline_v48vr0jexdrms: React.FC = () => <AbsoluteFill style={{background:"#111"}}>
  <Audio src={staticFile(timeline.audio_src)}/>
  {timeline.scenes.map((scene:any) => <Sequence key={scene.id} from={scene.from} durationInFrames={scene.duration}>
    <VisualScene scene={scene}/>
  </Sequence>)}
</AbsoluteFill>;
