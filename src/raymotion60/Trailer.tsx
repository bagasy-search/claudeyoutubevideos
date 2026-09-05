import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as oswald} from '@remotion/google-fonts/Oswald';
import {loadFont as inter} from '@remotion/google-fonts/Inter';
import {Exploded, Guide, Screw} from './Main';

const TITLE=oswald('normal',{weights:['500','600','700'],subsets:['latin']}).fontFamily;
const BODY=inter('normal',{weights:['400','500','600','700'],subsets:['latin']}).fontFamily;
const gold='#DBB56B', white='#F5F0E6';
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const rise=(f:number,a=0,b=20)=>interpolate(f,[a,b],[0,1],{...clamp,easing:Easing.bezier(.16,1,.3,1)});
const src=(name:string)=>staticFile(`${['avatar78.mp4','porch.mp4','floor.jpg','bridge.mp4'].includes(name)?'raytrailer78':'raymotion60'}/${name}`);

// Every shot is timed to the approved voice; no narration is moved for an edit.
export const TRAILER_SHOTS=[
 [0,59,'Ray / cold open'],[59,95,'Cylinder macro'],[95,152,'Broken pine macro'],
 [152,230,'Ray on the porch'],[230,307,'Short fastener macro'],
 [307,373,'Homeowner'],[373,430,'Expensive cylinder'],[430,510,'Ray / wood'],[510,580,'Wood close-up'],
 [580,641,'Ray / never caught'],[641,724,'Real hinge installation'],[724,795,'4,000 / real work'],
 [795,880,'35 years / Ray'],[880,982,'Real measurement'],
 [982,1070,'Bolt inspection'],[1070,1160,'Cylinder macro'],
 [1160,1250,'Strike / fastener'],[1250,1322,'Three quarter inch'],
 [1322,1480,'Exploded load path'],[1480,1560,'Real screw driving'],[1560,1640,'Structure / closer'],
 [1640,1757,'Ray / first principle'],[1757,1871,'Ray / not a vault'],[1871,1978,'Ray / honest limits'],
 [1978,2089,'Lock / no magic product'],[2089,2202,'Real hinge / whole doorway'],[2202,2322,'Real screw / connection'],
 [2322,2340,'Original video bridge'],
] as const;

const Grade:React.FC<{dark?:number}>=({dark=.12})=><AbsoluteFill style={{pointerEvents:'none'}}>
 <AbsoluteFill style={{background:`linear-gradient(0deg,rgba(3,12,12,${.48+dark}),transparent 58%),linear-gradient(90deg,#04202318,#e4b9710b)`,mixBlendMode:'multiply'}}/>
 <AbsoluteFill style={{background:'radial-gradient(ellipse at 48% 42%,transparent 38%,#02090955 100%)'}}/>
</AbsoluteFill>;

const ImageShot:React.FC<{name:string;zoom?:number;end?:number;origin?:string;pan?:number;children?:React.ReactNode}>=({name,zoom=1.04,end=1.12,origin='50% 50%',pan=0,children})=>{
 const f=useCurrentFrame();const k=rise(f,0,160);
 return <AbsoluteFill style={{overflow:'hidden',background:'#0a1212'}}><Img src={src(name)} style={{width:'100%',height:'100%',objectFit:'cover',transformOrigin:origin,transform:`scale(${zoom+(end-zoom)*k}) translateX(${pan*k}px)`}}/><Grade/>{children}</AbsoluteFill>;
};
const Film:React.FC<{name:string;start?:number;rate?:number;zoom?:number;push?:number;origin?:string;children?:React.ReactNode}>=({name,start=0,rate=1,zoom=1.015,push=.035,origin='50% 50%',children})=>{
 const f=useCurrentFrame();const k=rise(f,0,180);
 return <AbsoluteFill style={{overflow:'hidden',background:'#0a1212'}}><OffthreadVideo src={src(name)} startFrom={start} playbackRate={rate} muted style={{width:'100%',height:'100%',objectFit:'cover',transformOrigin:origin,transform:`scale(${zoom+push*k})`}}/><Grade/>{children}</AbsoluteFill>;
};

const Type:React.FC<{eyebrow?:string;children:React.ReactNode;size?:number;top?:number;delay?:number;golden?:boolean}>=({eyebrow,children,size=118,top=700,delay=0,golden=false})=>{
 const f=useCurrentFrame();const k=rise(f,delay,delay+18);
 return <div style={{position:'absolute',left:105,right:95,top,color:white,textShadow:'0 5px 30px #0009',opacity:k}}>
  {eyebrow&&<div style={{fontFamily:BODY,fontSize:17,fontWeight:600,letterSpacing:3,color:gold,marginBottom:20}}>{eyebrow}</div>}
  <div style={{overflow:'hidden'}}><div style={{fontFamily:TITLE,fontSize:size,fontWeight:600,lineHeight:1.04,letterSpacing:-1.8,color:golden?gold:white,transform:`translateY(${(1-k)*110}%)`}}>{children}</div></div>
 </div>;
};

const FastenerMacro:React.FC<{measure?:boolean}>=({measure=false})=>{
 const f=useCurrentFrame();const k=rise(f,0,28);
 return <AbsoluteFill style={{background:'radial-gradient(ellipse at 65% 45%,#465248,#152321 48%,#061111)'}}>
  <div style={{position:'absolute',inset:-100,background:'linear-gradient(115deg,transparent 35%,#f5d79717 45%,transparent 60%)',transform:`translateX(${f*1.3}px)`}}/>
  <div style={{position:'absolute',left:350,top:350,perspective:1300,width:1300,height:400}}>
   <div style={{transformStyle:'preserve-3d',transform:`rotateY(${-24+rise(f,0,90)*14}deg) rotateZ(-12deg) scale(${1.55+.08*k})`}}><Screw id={measure?'macro-measure':'macro-early'}/></div>
  </div>
  <div style={{position:'absolute',left:185,top:685,width:1430*k,height:2,background:gold,boxShadow:'0 0 18px #d8b46b44'}}/>
  {[185,1615].map(x=><div key={x} style={{position:'absolute',left:x,top:671,width:2,height:30,background:gold,opacity:k}}/>)}
  <Type eyebrow={measure?'THE ORIGINAL STRIKE SCREWS':'A STRONG LOCK. A WEAK CONNECTION.'} top={measure?730:770} size={measure?134:83}>{measure?<><span style={{color:gold}}>¾ INCH.</span> THAT WAS ALL.</>:'SHORTER THAN A THUMBNAIL.'}</Type>
  <div style={{position:'absolute',left:105,top:80,fontFamily:BODY,fontSize:15,letterSpacing:3,color:'#c9c9b1'}}>DETAIL STUDY / NOT TO SCALE</div>
  <Grade dark={0}/>
 </AbsoluteFill>;
};

const WorkStat:React.FC=()=>{
 const f=useCurrentFrame();const k=rise(f,7,25);
 return <Film name="stock_hinge.mp4" start={90} zoom={1.11} push={.035}>
  <AbsoluteFill style={{background:'linear-gradient(90deg,#061212a8,transparent)'}}/>
  <div style={{position:'absolute',left:96,top:520,fontFamily:TITLE,fontWeight:700,fontSize:290,lineHeight:1,color:gold,letterSpacing:-8,transform:`translateY(${(1-k)*100}px)`,opacity:k,textShadow:'0 12px 35px #0008'}}>4,000<span style={{display:'inline-block',fontSize:74,letterSpacing:2,color:white,marginLeft:32}}>DOORS.</span></div>
  <div style={{position:'absolute',left:110,top:861,fontFamily:BODY,fontSize:20,letterSpacing:4,color:white,opacity:k}}>REPLACED. ONE HOUSE AT A TIME.</div>
 </Film>;
};

const LoadPath:React.FC=()=>{
 const f=useCurrentFrame();return <AbsoluteFill style={{overflow:'hidden'}}>
  <div style={{position:'absolute',inset:0,transformOrigin:'56% 66%',transform:`scale(${1+rise(f,85,145)*.11}) translateX(${-rise(f,85,145)*36}px)`}}><Exploded/></div>
 </AbsoluteFill>;
};

const Opening:React.FC=()=> <Film name="avatar78.mp4" zoom={1.035} push={.025}><Type eyebrow="RAY KESSLER" top={775} delay={8}>STILL LOCKED.</Type></Film>;

const Shot:React.FC<{index:number}>=({index})=>{
 switch(index){
 case 0:return <Opening/>;
 case 1:return <Film name="stock_lock.mp4" start={114} zoom={1.25} push={.08} origin="58% 50%"/>;
 case 2:return <ImageShot name="floor.jpg" zoom={1.62} end={1.75} origin="20% 40%"><Type top={795} size={100}>THE PINE GAVE WAY.</Type></ImageShot>;
 case 3:return <Film name="porch.mp4" zoom={1.04} push={.07}/>;
 case 4:return <FastenerMacro/>;
 case 5:return <ImageShot name="homeowner.jpg" zoom={1.03} end={1.10}/>;
 case 6:return <Film name="stock_lock.mp4" start={15} zoom={1.15} push={.07}><Type top={785} size={91}>EXPENSIVE HARDWARE.</Type></Film>;
 case 7:return <ImageShot name="ray_wood.jpg" zoom={1.04} end={1.10}/>;
 case 8:return <ImageShot name="ray_wood.jpg" zoom={1.8} end={1.95} origin="50% 88%"><Type top={790} size={97}>A LITTLE STRIP OF WOOD.</Type></ImageShot>;
 case 9:return <Film name="avatar78.mp4" start={580} zoom={1.09} push={.02}/>;
 case 10:return <Film name="stock_hinge.mp4" start={5} zoom={1.04}><Type eyebrow="AFTER THE BREAK-IN" top={770} size={93}>I REPLACED THE DOORS.</Type></Film>;
 case 11:return <WorkStat/>;
 case 12:return <Film name="avatar78.mp4" start={795} zoom={1.07} push={.025}><Type top={755} size={147} golden>35 YEARS.</Type></Film>;
 case 13:return <Film name="stock_measure.mp4" start={240} zoom={1.035} push={.075}><Type eyebrow="A WORKING LOCKSMITH’S PERSPECTIVE" top={785} size={86}>LOOK PAST THE SHINY PART.</Type></Film>;
 case 14:return <ImageShot name="bolt.jpg" zoom={1.05} end={1.16}><Type top={785} size={102}>THE LOCK WASN’T THE PROBLEM.</Type></ImageShot>;
 case 15:return <Film name="stock_lock.mp4" start={100} zoom={1.4} push={.07} origin="57% 50%"/>;
 case 16:return <ImageShot name="bolt.jpg" zoom={1.4} end={1.48} origin="73% 65%"><Type eyebrow="LOOK AT THE ATTACHMENT" top={795} size={91}>WHAT HELD IT?</Type></ImageShot>;
 case 17:return <FastenerMacro measure/>;
 case 18:return <LoadPath/>;
 case 19:return <Film name="stock_screw.mp4" start={303} zoom={1.04} push={.04}><Type top={795} size={108}>THE STRENGTH WAS BEHIND IT.</Type></Film>;
 case 20:return <Film name="stock_screw.mp4" start={383} zoom={1.3} push={.07} origin="54% 45%"><Type top={795} size={107} golden>STRONGER FRAMING. UNUSED.</Type></Film>;
 case 21:return <Film name="avatar78.mp4" start={1640} zoom={1.045} push={.018}><Type eyebrow="RAY’S FIRST PRINCIPLE" top={790} size={94}>START AT THE FRAME.</Type></Film>;
 case 22:return <Film name="avatar78.mp4" start={1757} zoom={1.14} push={.02}><Type top={800} size={100} delay={62}>A DOOR IS <span style={{color:gold}}>NOT A VAULT.</span></Type></Film>;
 case 23:return <Film name="avatar78.mp4" start={1871} zoom={1.045} push={.02}/>;
 case 24:return <Film name="stock_lock.mp4" start={5} zoom={1.1} push={.05}><Type top={795} size={104}>NO MAGIC BOX.</Type></Film>;
 case 25:return <Film name="stock_hinge.mp4" start={0} zoom={1.04} push={.025}><Type top={795} size={108}>THE WHOLE DOORWAY.</Type></Film>;
 case 26:return <Film name="stock_screw.mp4" start={305} zoom={1.05} push={.05}><Type top={795} size={104}>ONE CONNECTION AT A TIME.</Type></Film>;
 case 27:return <AbsoluteFill><OffthreadVideo src={src('bridge.mp4')} startFrom={42} muted style={{width:'100%',height:'100%',objectFit:'cover'}}/></AbsoluteFill>;
 default:return null;
 }
};

// Only the mechanical studies carry dimensional graphics. Footage occupies the
// full canvas everywhere else; the QR stays still and clear while shots move.
export const MainRaytrailer78:React.FC=()=>{
 const f=useCurrentFrame();const guideExit=interpolate(f,[2298,2322],[1,0],clamp);
 return <AbsoluteFill style={{background:'#081313'}}>
  {TRAILER_SHOTS.map(([from,to,name],index)=><Sequence key={name} from={from} durationInFrames={to-from}><Shot index={index}/></Sequence>)}
  {f<2322&&<div style={{position:'absolute',left:48,top:36,fontFamily:BODY,fontSize:13,fontWeight:600,letterSpacing:3,color:white,textShadow:'0 2px 10px #000'}}>RAY KESSLER <span style={{color:gold,marginLeft:17}}> / </span><span style={{marginLeft:17,opacity:.75}}>THE FOUR THOUSAND DOORS</span></div>}
  <Sequence from={997} durationInFrames={1325}><div style={{opacity:guideExit}}><Guide/></div></Sequence>
  <Audio src={staticFile('raytrailer78_fish.wav')}/>
 </AbsoluteFill>;
};
