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
import timeline from "./timeline_v9uz8m1rssch.json";
const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};
const palette = {ink: "#201b16", cream: "#f3ead8", amber: "#c98232", red: "#a63728", blue: "#4e8394"};

const ComponentScene: React.FC<{scene:any}> = ({scene}) => {
  const frame = useCurrentFrame();
  const layer = scene.layers[0];
  const family = [...String(layer.family || layer.component || "evidence")].reduce((sum,c)=>sum+c.charCodeAt(0),0) % 10;
  const enter = interpolate(frame, [0, 18], [0, 1], clamp);
  const drift = Math.sin(frame / 28);
  const split = family % 3 === 0;
  const radial = family % 3 === 1;
  const title = layer.title || String(layer.component || "Evidence").replace(/([a-z])([A-Z])/g,"$1 $2");
  return <AbsoluteFill style={{background:family%2?"#0d1716":"#17130f",color:palette.cream,overflow:"hidden",perspective:1600}}>
    {/* 1: cinematic gradient plate */}
    <AbsoluteFill style={{background:`radial-gradient(circle at ${radial?25:75}% 28%, ${family%2?"#4e839466":"#c982324d"}, transparent 36%), linear-gradient(135deg, transparent, #0009)`,opacity:enter}}/>
    {/* 2: moving technical grid */}
    <AbsoluteFill style={{opacity:.13,transform:`translate3d(${drift*18}px,${-drift*10}px,0) scale(1.08)`,backgroundImage:"linear-gradient(#fff3 1px,transparent 1px),linear-gradient(90deg,#fff3 1px,transparent 1px)",backgroundSize:family%2?"72px 72px":"110px 110px"}}/>
    {/* 3-4: independent depth lights */}
    <div style={{position:"absolute",width:620,height:620,borderRadius:"50%",left:radial?-170:1250,top:-230,background:"#c9823238",filter:"blur(55px)",transform:`translateZ(40px) scale(${1+drift*.06})`}}/>
    <div style={{position:"absolute",width:480,height:480,borderRadius:"50%",right:radial?-90:1320,bottom:-180,background:"#4e83945c",filter:"blur(70px)",transform:`translateY(${drift*24}px) translateZ(80px)`}}/>
    {/* 5: architectural frame, deliberately not a generic rounded card */}
    <div style={{position:"absolute",left:split?90:family%2?180:760,top:split?120:190,width:split?820:980,height:split?840:700,borderLeft:"2px solid #c98232aa",borderTop:"2px solid #ffffff30",transform:`translate3d(0,${(1-enter)*55}px,120px) rotateY(${(1-enter)*(family%2?5:-5)}deg)`,opacity:enter}}/>
    {/* 6: semantic value / diagram object */}
    <div style={{position:"absolute",left:split?1030:family%2?1030:190,top:family%3===2?230:360,width:560,height:360,display:"grid",placeItems:"center",transform:`translate3d(${(1-enter)*(family%2?70:-70)}px,0,180px)`,opacity:enter}}>
      <div style={{position:"absolute",width:310,height:310,borderRadius:family%2?"50%":"18%",border:"3px solid #c98232",boxShadow:"0 0 0 28px #c9823214,0 0 0 58px #4e839412",transform:`rotate(${family*9+frame*.08}deg)`}}/>
      <div style={{fontFamily:"Arial, sans-serif",fontSize:layer.value?92:42,fontWeight:800,textAlign:"center",maxWidth:470}}>{layer.value || layer.icon || String(layer.component || "INSIGHT").replace(/([a-z])([A-Z])/g,"$1 $2").toUpperCase()}</div>
    </div>
    {/* 7: editorial hierarchy */}
    <div style={{position:"absolute",left:split?150:family%2?210:820,top:split?210:245,width:split?760:900,transform:`translate3d(0,${(1-enter)*42}px,240px)`,opacity:enter}}>
      <div style={{fontFamily:"Arial, sans-serif",fontSize:25,letterSpacing:7,textTransform:"uppercase",color:palette.amber,marginBottom:28}}>{String(layer.family || layer.component || "EVIDENCE").replaceAll("_"," ")}</div>
      <div style={{fontFamily:"Georgia, serif",fontSize:split?72:82,fontWeight:750,lineHeight:1.02,maxWidth:880}}>{title}</div>
      {layer.detail ? <div style={{fontFamily:"Arial, sans-serif",fontSize:31,lineHeight:1.35,color:"#e8dcc8",marginTop:30,maxWidth:760}}>{layer.detail}</div> : null}
    </div>
    {/* 8: controlled glint and progress accent */}
    <div style={{position:"absolute",left:-420+frame*9,top:-300,width:190,height:1700,background:"linear-gradient(90deg,transparent,#fff2,transparent)",transform:"rotate(24deg) translateZ(300px)",filter:"blur(10px)"}}/>
    <div style={{position:"absolute",left:90,right:90,bottom:72,height:4,background:"#ffffff18"}}><div style={{height:"100%",width:`${Math.min(100,frame/Math.max(1,scene.duration)*100)}%`,background:family%2?palette.blue:palette.amber}}/></div>
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
  </AbsoluteFill>;
  const startFrom = layer.type === "avatar" ? scene.from : 0;
  return <AbsoluteFill style={{background:"#111",opacity:fade}}>
    <Video src={staticFile(layer.src)} muted startFrom={startFrom}
      style={{width:"100%",height:"100%",objectFit:"cover",transform:`scale(${layer.type==="avatar"?1:zoom})`}}/>
  </AbsoluteFill>;
};

export const BagasyTimeline_v9uz8m1rssch: React.FC = () => <AbsoluteFill style={{background:"#111"}}>
  <Audio src={staticFile(timeline.audio_src)}/>
  {timeline.scenes.map((scene:any) => <Sequence key={scene.id} from={scene.from} durationInFrames={scene.duration}>
    <VisualScene scene={scene}/>
  </Sequence>)}
</AbsoluteFill>;
