import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {F_BODY, F_DISPLAY, Keyring, V, rgba} from './RayStage';

/** Stable, scannable guide card. Only the entrance and exit move. */
export const RayCta: React.FC<{
  title?: string; sub?: string; domain?: string; eyebrow?: string;
  qr?: string; showQr?: boolean; action?: string; durationInFrames?: number;
}> = ({
  title='The One Afternoon Door',sub='Know what to check before you buy another lock.',
  domain='raykessler.vercel.app',eyebrow='CHECK YOUR DOOR TODAY',action='SCAN TO SEE THE GUIDE',
  qr,showQr=true,durationInFrames=1340,
}) => {
  const f=useCurrentFrame();
  const opts={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
  const arrival=interpolate(f,[0,24],[0,1],{...opts,easing:Easing.out(Easing.cubic)});
  const departure=interpolate(f,[durationInFrames-18,durationInFrames-1],[0,1],opts);
  const rule=interpolate(f,[10,36],[0,1],{...opts,easing:Easing.out(Easing.cubic)});
  if(!showQr||!qr)return null;
  return <AbsoluteFill style={{pointerEvents:'none'}}>
    <div style={{position:'absolute',right:48,top:54,width:720,height:290,boxSizing:'border-box',
      opacity:arrival*(1-departure),transform:`translateY(${((1-arrival)*24-departure*10).toFixed(2)}px)`,
      border:`1px solid ${rgba(V.brass,0.82)}`,borderRadius:18,
      background:'linear-gradient(130deg,rgba(10,17,16,0.98),rgba(24,31,27,0.98))',
      boxShadow:'0 22px 60px rgba(0,0,0,0.44),0 4px 12px rgba(0,0,0,0.22),inset 0 1px 0 rgba(255,255,255,0.08)',
      padding:'19px 20px',display:'grid',gridTemplateColumns:'1fr 246px',gap:18,overflow:'hidden'}}>
      <div style={{position:'absolute',left:24,right:24,top:0,height:2,transformOrigin:'left',transform:`scaleX(${rule})`,
        background:`linear-gradient(90deg,${V.brass},${rgba(V.brass,0.1)})`}}/>
      <div style={{minWidth:0,display:'flex',flexDirection:'column',justifyContent:'space-between',padding:'2px 0'}}>
        <div style={{display:'flex',alignItems:'center',gap:9,color:V.brass,fontFamily:F_DISPLAY,fontSize:18,
          fontWeight:700,letterSpacing:2.1,lineHeight:1.1}}><Keyring size={24}/>{eyebrow}</div>
        <div style={{fontFamily:F_DISPLAY,fontWeight:700,fontSize:43,lineHeight:1.02,color:'#FFF9EB',maxWidth:385}}>{title}</div>
        <div style={{fontFamily:F_BODY,fontSize:22,lineHeight:1.25,fontWeight:500,color:'#DDDCD1',maxWidth:370}}>{sub}</div>
        <div style={{height:39,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 14px',
          background:'linear-gradient(110deg,#E6C574,#CDA74F)',borderRadius:7,color:'#172019',
          boxShadow:'inset 0 1px 0 rgba(255,255,255,0.35)',fontFamily:F_DISPLAY,fontWeight:800,fontSize:23,letterSpacing:1}}>
          <span>{action}</span><span style={{fontFamily:F_BODY,fontSize:27,lineHeight:1}}>→</span>
        </div>
      </div>
      <div style={{height:250,width:246,boxSizing:'border-box',background:'#FFFFFF',borderRadius:12,
        padding:'5px 12px',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
        boxShadow:'0 5px 16px rgba(0,0,0,0.18)'}}>
        <Img src={staticFile(qr)} style={{width:222,height:222,display:'block',flexShrink:0}}/>
        <div style={{fontFamily:F_BODY,fontSize:14,fontWeight:650,color:'#23322B',lineHeight:'18px',whiteSpace:'nowrap'}}>{domain}</div>
      </div>
    </div>
  </AbsoluteFill>;
};
