import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {loadFont as oswald} from '@remotion/google-fonts/Oswald';
import {loadFont as inter} from '@remotion/google-fonts/Inter';

const DISPLAY=oswald('normal',{weights:['500','600','700'],subsets:['latin']}).fontFamily;
const BODY=inter('normal',{weights:['400','500','600','700'],subsets:['latin']}).fontFamily;
const C={ink:'#0C1212',paper:'#F5F0E6',gold:'#DBB56B',muted:'#AEAFA4',red:'#EC6650'};
const CLAMP={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const ease=Easing.bezier(.16,1,.3,1), smooth=Easing.bezier(.65,0,.35,1);
const p=(f:number,a=0,b=24)=>interpolate(f,[a,b],[0,1],{...CLAMP,easing:ease});
const file=(s:string)=>staticFile(`raymotion60/${s}`);
const keep3d:React.CSSProperties={transformStyle:'preserve-3d'};
const fill:React.CSSProperties={position:'absolute',inset:0};

export const CUES=[
 {from:0,to:95,id:'cold-open',title:'The lock was still locked',layers:7},
 {from:95,to:307,id:'failure',title:'Pine on the floor / short screw',layers:10},
 {from:307,to:580,id:'carousel',title:'Expensive deadbolt / little strip of wood',layers:12},
 {from:580,to:795,id:'field-work',title:'Four thousand doors',layers:8},
 {from:795,to:982,id:'experience',title:'Thirty-five years',layers:10},
 {from:982,to:1160,id:'inspection',title:'Not a weakness inside the lock',layers:9},
 {from:1160,to:1322,id:'measurement',title:'Three-quarter-inch screws',layers:9},
 {from:1322,to:1480,id:'exploded',title:'Hardware attached to thin pine',layers:12},
 {from:1480,to:1640,id:'framing',title:'The stronger framing behind it',layers:9},
 {from:1640,to:1748,id:'ray-return',title:'Before we get started',layers:7},
 {from:1748,to:1800,id:'resolve',title:'What holds the lock',layers:9},
];

const Label:React.FC<{children:React.ReactNode;style?:React.CSSProperties}>=({children,style})=><div style={{fontFamily:BODY,fontSize:19,fontWeight:600,letterSpacing:3,color:C.gold,...style}}>{children}</div>;
const Heading:React.FC<{children:React.ReactNode;style?:React.CSSProperties;delay?:number}>=({children,style,delay=0})=>{const f=useCurrentFrame();const k=p(f,delay,delay+26);return <div style={{overflow:'hidden',...style}}><div style={{fontFamily:DISPLAY,fontSize:104,fontWeight:600,lineHeight:1.03,letterSpacing:-1.7,color:C.paper,transform:`translateY(${(1-k)*112}%)`}}>{children}</div></div>};

const Stage:React.FC<{children:React.ReactNode;light?:boolean}>=({children,light=false})=>{
 const f=useCurrentFrame();
 return <AbsoluteFill style={{background:C.ink,color:C.paper,fontFamily:BODY,overflow:'hidden'}}>
  <div style={{...fill,background:light?'radial-gradient(ellipse at 70% 20%,#545444 0%,#202b29 36%,#0c1313 80%)':'radial-gradient(ellipse at 72% 30%,#384338 0%,#142122 40%,#091011 80%)'}}/>
  <div style={{position:'absolute',left:480,top:-500,width:900,height:1400,background:'linear-gradient(90deg,transparent,#e9c68118,transparent)',transform:`rotate(34deg) translateX(${f*.11}px)`,filter:'blur(60px)'}}/>
  <div style={{position:'absolute',left:-700,right:-700,top:650,height:1000,backgroundImage:'linear-gradient(#d5b16b28 1px,transparent 1px),linear-gradient(90deg,#d5b16b28 1px,transparent 1px)',backgroundSize:'95px 95px',transform:`perspective(900px) rotateX(67deg) translateY(${f*.15}px)`,transformOrigin:'50% 0',opacity:.34}}/>
  <svg width="1920" height="1080" style={{...fill,opacity:.10}}><defs><pattern id="fine-grain" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1" cy="2" r=".55" fill="white"/><circle cx="5" cy="6" r=".4" fill="white"/></pattern></defs><rect width="1920" height="1080" fill="url(#fine-grain)"/></svg>
  {children}
  <div style={{position:'absolute',left:-180,top:180,width:230,height:1250,background:'linear-gradient(90deg,#020808,#39463b)',transform:`rotate(-21deg) translateX(${f*.08}px)`,filter:'blur(17px)',opacity:.72}}/>
  <div style={{position:'absolute',right:-220,top:730,width:700,height:300,borderRadius:140,background:'linear-gradient(15deg,#070c0c,#84754f)',transform:`rotate(-26deg) translateX(${-f*.1}px)`,filter:'blur(25px)',opacity:.42}}/>
  <div style={{...fill,background:'radial-gradient(ellipse at 50% 48%,transparent 40%,#03080988 100%)',pointerEvents:'none'}}/>
 </AbsoluteFill>;
};

const Card:React.FC<{children:React.ReactNode;w?:number;h?:number;style?:React.CSSProperties;caption?:string;num?:string}>=({children,w=750,h=480,style,caption,num})=><div style={{position:'absolute',width:w,height:h,...keep3d,...style}}>
 <div style={{...fill,background:'#8a7046',transform:'translateZ(-12px)',borderRadius:14,boxShadow:'0 45px 90px #000b'}}/>
 <div style={{...fill,background:'#17211f',border:'1px solid #e9c68480',borderRadius:14,overflow:'hidden',transform:'translateZ(0px)'}}>
  {children}<div style={{...fill,background:'linear-gradient(0deg,#040b0cdc,transparent 43%)'}}/>
  {caption&&<div style={{position:'absolute',left:30,right:30,bottom:25,display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:DISPLAY,fontSize:31,letterSpacing:1.3}}><span>{caption}</span><span style={{fontFamily:BODY,fontSize:16,color:C.gold}}>{num}</span></div>}
  <div style={{...fill,background:'linear-gradient(132deg,#fff2,transparent 32%,transparent 78%,#fff1)',pointerEvents:'none'}}/>
 </div>
 <div style={{position:'absolute',left:10,right:10,bottom:-10,height:10,background:'linear-gradient(#9b7b46,#282b22)',transform:'rotateX(-65deg)',transformOrigin:'top'}}/>
</div>;
const Photo:React.FC<{src:string;style?:React.CSSProperties}>=({src,style})=><Img src={file(src)} style={{width:'100%',height:'100%',objectFit:'cover',...style}}/>;
const Clip:React.FC<{src:string;start?:number;rate?:number;style?:React.CSSProperties}>=({src,start=0,rate=1,style})=><OffthreadVideo src={file(src)} muted startFrom={start} playbackRate={rate} style={{width:'100%',height:'100%',objectFit:'cover',...style}}/>;

const Screw:React.FC<{style?:React.CSSProperties;id?:string}>=({style,id='s'})=><svg viewBox="0 0 820 180" style={{width:820,height:180,filter:'drop-shadow(0 25px 16px #0008)',...style}}>
 <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#444e4e"/><stop offset=".22" stopColor="#faf7e8"/><stop offset=".45" stopColor="#8b9996"/><stop offset=".65" stopColor="#dce1d6"/><stop offset="1" stopColor="#3e4a49"/></linearGradient></defs>
 <path d="M170 65 L684 65 L786 90 L684 115 L170 115Z" fill={`url(#${id})`} stroke="#cfd4c5" strokeWidth="2"/>
 {Array.from({length:23},(_,i)=><path key={i} d={`M${210+i*21} 63l-24 55`} stroke="#263433" strokeWidth="8"/>)}
 <path d="M170 65L123 30H91V150H123L170 115Z" fill={`url(#${id})`} stroke="#cfd4c5" strokeWidth="2"/>
 <ellipse cx="91" cy="90" rx="23" ry="60" fill={`url(#${id})`} stroke="#eff0df" strokeWidth="2"/>
 <path d="M88 58V122M76 90H103" stroke="#25302d" strokeWidth="10"/>
</svg>;

const Opening:React.FC=()=>{const f=useCurrentFrame();return <AbsoluteFill>
 <Clip src="avatar.mp4" style={{transform:`scale(${1.01+f*.00032})`}}/>
 <div style={{...fill,background:'linear-gradient(0deg,#061011dd,transparent 60%)'}}/>
 <div style={{position:'absolute',left:102,bottom:114}}><Label>RAY KESSLER / THE FOUR THOUSAND DOORS</Label><Heading delay={9} style={{marginTop:20}}>STILL LOCKED.</Heading></div>
 <div style={{position:'absolute',left:102,bottom:86,height:3,width:interpolate(f,[0,85],[0,920],CLAMP),background:C.gold}}/>
 </AbsoluteFill>};

const Failure:React.FC=()=>{const f=useCurrentFrame();const k=p(f,20,70);return <Stage>
 <div style={{position:'absolute',left:108,top:145}}><Label>01 / FOLLOW THE FAILURE</Label><Heading style={{marginTop:27}}>THE WEAK<br/><span style={{color:C.gold}}>LINK.</span></Heading></div>
 <div style={{position:'absolute',left:675,top:120,width:1060,height:780,perspective:1500}}>
  <div style={{...fill,...keep3d,transform:`rotateX(${8-f*.025}deg) rotateY(${-18+f*.075}deg)`}}>
   <div style={{position:'absolute',left:65,top:610,width:820,height:100,borderRadius:'50%',background:'#000b',filter:'blur(25px)',transform:'rotateX(62deg) translateZ(-140px)'}}/>
   {Array.from({length:6},(_,i)=><div key={i} style={{position:'absolute',left:80+i*111+(i-2.5)*p(f,0,38)*23,top:210+(i%2)*35,width:110,height:405,clipPath:`polygon(0 0,100% 8%,${70+i*3}% 100%,10% 90%)`,background:`repeating-linear-gradient(92deg,#a47746,#d7b276 10px,#bc935e 14px,#dfbe85 19px)`,boxShadow:'inset -10px 0 20px #43280f',transform:`translateZ(${(i%3)*45-100}px) rotateZ(${(i-2.5)*p(f)*4}deg)`,opacity:1-k*.62}}/>)}
   <div style={{position:'absolute',left:0,top:275,transform:`translateZ(${160+k*60}px) rotateZ(${-18+k*15}deg) translateY(${(1-k)*120}px)`,opacity:k}}><Screw id="failure-screw"/></div>
   <div style={{position:'absolute',left:80,top:548,width:745,height:2,background:C.gold,transform:'translateZ(150px)',opacity:k}}/>
   <div style={{position:'absolute',left:82,top:575,fontFamily:DISPLAY,fontSize:32,letterSpacing:1,color:C.paper,transform:'translateZ(150px)',opacity:k}}>SHORTER THAN A THUMBNAIL</div>
  </div>
 </div>
 <Label style={{position:'absolute',left:112,bottom:110,color:C.muted,fontSize:16}}>A STRONG LOCK. A WEAK CONNECTION.</Label>
 </Stage>};

const Carousel:React.FC=()=>{const f=useCurrentFrame();const shift=interpolate(f,[0,28,108,158,270],[0,0,0,1,1],{...CLAMP,easing:smooth});const items=[{label:'THE LOCK',num:'01',src:'stock_lock.mp4',video:true},{label:'THE HOMEOWNER',num:'02',src:'homeowner.jpg',video:false},{label:'WHAT HELD IT',num:'03',src:'ray_wood.jpg',video:false}];
 return <Stage light>
 <Label style={{position:'absolute',left:112,top:122}}>02 / LOOK PAST THE SHINY PART</Label>
 <div style={{position:'absolute',left:0,top:245,width:1920,height:655,perspective:1650}}>
  <div style={{...fill,...keep3d,transform:`rotateX(-4deg) translateY(${(1-p(f))*80}px)`}}>
  {items.map((it,i)=>{const rel=i-(shift*2);const x=960+rel*650;const z=100-Math.abs(rel)*250;return <Card key={it.src} w={770} h={485} caption={it.label} num={it.num} style={{left:x-385,top:5,transform:`translateZ(${z}px) rotateY(${-rel*29}deg)`,opacity:Math.max(.18,1-Math.abs(rel)*.32)}}>{it.video?<Clip src={it.src} rate={.8}/>:<Photo src={it.src}/>}</Card>})}
  </div>
 </div>
 <div style={{position:'absolute',left:115,bottom:91,right:112,display:'flex',alignItems:'center',gap:25}}><div style={{height:2,background:C.gold,width:120+shift*240}}/><div style={{fontFamily:DISPLAY,fontSize:40}}>{shift<.5?'EXPENSIVE HARDWARE':'A LITTLE STRIP OF WOOD'}</div><div style={{marginLeft:'auto',fontSize:18,color:C.muted}}>LOCK → CONNECTION → FRAME</div></div>
 </Stage>};

const FieldWork:React.FC=()=>{const f=useCurrentFrame();const n=p(f,150,180);return <Stage>
 <div style={{position:'absolute',left:120,top:175,width:1680,height:715,perspective:1600,opacity:1-n}}>
  <Card w={1000} h={600} caption="ON THE JOB" num="RAY’S EXPERIENCE" style={{left:0,top:20,transform:`rotateY(${-14+p(f)*6}deg) rotateZ(-2deg) translateZ(30px)`}}><Clip src="stock_hinge.mp4"/></Card>
  <div style={{position:'absolute',left:930,top:100,width:650,transform:`translateZ(${80+p(f)*40}px)`}}><Label>AFTER THE BREAK-IN</Label><Heading style={{marginTop:28}}>I REPLACED<br/>THE DOORS.</Heading></div>
 </div>
 <div style={{position:'absolute',left:530,top:320,fontFamily:DISPLAY,fontSize:310,fontWeight:700,letterSpacing:-7,lineHeight:1,color:C.gold,textShadow:'0 22px 55px #000d',opacity:n,transform:`translateY(${(1-n)*130}px) scale(${.8+n*.2})`}}>4,000<span style={{fontSize:48,letterSpacing:1,marginLeft:22,color:C.paper}}>DOORS</span></div>
 </Stage>};

const Experience:React.FC=()=>{const f=useCurrentFrame();const k=p(f,5,45);return <Stage>
 <div style={{position:'absolute',left:730,top:210,width:1010,height:635,perspective:1500}}><Card w={1000} h={600} caption="A WORKING LOCKSMITH’S PERSPECTIVE" style={{transform:`rotateY(${-18+f*.035}deg) rotateZ(2deg)`}}><Clip src="stock_measure.mp4" start={240}/></Card></div>
 <div style={{position:'absolute',left:135,top:185,perspective:1400}}><Label>03 / EXPERIENCE OVER APPEARANCE</Label><div style={{fontFamily:DISPLAY,fontWeight:700,fontSize:370,lineHeight:1.08,color:C.gold,letterSpacing:-12,transform:`rotateY(${-14+14*k}deg) translateY(${(1-k)*80}px)`}}>35</div><div style={{fontFamily:DISPLAY,fontSize:75,letterSpacing:10,color:C.paper,marginTop:-10}}>YEARS</div></div>
 <div style={{position:'absolute',left:132,right:137,bottom:116,display:'flex',alignItems:'end',height:66}}>{Array.from({length:36},(_,i)=><div key={i} style={{flex:1,height:i%5===0?50:22,borderLeft:`${i%5===0?2:1}px solid ${C.gold}`,opacity:p(f,i*1.7,i*1.7+10)}}/>)}</div>
 <Label style={{position:'absolute',left:136,bottom:72,color:C.muted,fontSize:17}}>LEARN TO LOOK PAST THE SHINY PART.</Label>
 </Stage>};

const Inspection:React.FC=()=>{const f=useCurrentFrame();const k=p(f,0,35);return <Stage light>
 <div style={{position:'absolute',left:850,top:360,perspective:1500}}><Card w={870} h={470} caption="THE CONNECTION MATTERS" style={{transform:`rotateY(${-16+f*.05}deg) rotateX(3deg) translateZ(45px)`}}><Photo src="bolt.jpg"/></Card></div>
 <div style={{position:'absolute',left:117,top:224,width:750}}><Label>04 / THE DIAGNOSIS</Label><Heading style={{marginTop:33}}>THE LOCK<br/>WASN’T<br/><span style={{color:C.gold}}>THE PROBLEM.</span></Heading></div>
 <div style={{position:'absolute',left:116,top:701,width:580*k,height:3,background:C.red}}/>
 <div style={{position:'absolute',left:116,top:737,fontSize:25,color:C.muted}}>Inspect what holds it to the house.</div>
 </Stage>};

const Measurement:React.FC=()=>{const f=useCurrentFrame();const k=p(f,0,34);return <Stage light>
 <div style={{position:'absolute',left:121,top:143}}><Label>05 / THE ORIGINAL STRIKE SCREWS</Label><div style={{fontFamily:DISPLAY,color:C.gold,fontSize:270,fontWeight:600,letterSpacing:-8,lineHeight:1.12,transform:`translateY(${(1-k)*65}px)`}}>¾<span style={{fontSize:88,letterSpacing:0,marginLeft:27,color:C.paper}}>INCH</span></div></div>
 <div style={{position:'absolute',left:850,top:405,perspective:1350,width:880,height:380}}><div style={{...keep3d,transform:`rotateY(${-19+f*.06}deg) rotateX(13deg) translateZ(100px)`}}><Screw id="measured-screw"/><div style={{position:'absolute',left:82,top:222,width:695*k,height:2,background:C.gold}}/><div style={{position:'absolute',left:82,top:209,width:2,height:28,background:C.gold}}/><div style={{position:'absolute',left:775,top:209,width:2,height:28,background:C.gold,opacity:k}}/>{Array.from({length:25},(_,i)=><div key={i} style={{position:'absolute',left:84+i*28.7,top:244,height:i%4===0?34:14,width:1,background:C.gold,opacity:.65*p(f,i*.6,i*.6+15)}}/>)}</div></div>
 <Heading delay={20} style={{position:'absolute',left:126,bottom:187}}>TOO LITTLE<br/>TO HOLD ON TO.</Heading>
 <Label style={{position:'absolute',left:126,bottom:105,color:C.muted,fontSize:16}}>SCHEMATIC / NOT TO SCALE</Label>
 </Stage>};

const Block:React.FC<{x:number;z:number;w:number;h?:number;depth:number;color:string;wood?:boolean;plate?:boolean;label:string;labelY?:number}>=({x,z,w,h=490,depth,color,wood=false,plate=false,label,labelY=540})=>{const face=wood?`repeating-linear-gradient(91deg,${color},${color} 13px,#ad815b 15px,${color} 18px)`:`linear-gradient(110deg,#e0e5dc,${color} 36%,#626c69 90%)`;return <div style={{position:'absolute',left:x,top:0,width:w,height:h,...keep3d,transform:`translateZ(${z}px)`}}>
 <div style={{...fill,background:face,border:'1px solid #efddb56b',boxShadow:'inset -12px 0 35px #0005'}}>{plate&&<><div style={{position:'absolute',left:27,top:166,width:74,height:158,borderRadius:5,background:'#080e0e',border:'4px solid #b4beb3',boxShadow:'inset 7px 8px 0 #303c35,2px 2px 0 #e6e7d9'}}/>{[48,410].map(y=><div key={y} style={{position:'absolute',left:48,top:y,width:29,height:29,borderRadius:'50%',background:'#081010',border:'4px solid #828f89',boxShadow:'1px 2px 0 #e0e6d9'}}/>)}</>}</div>
 <div style={{position:'absolute',left:w,top:0,width:depth,height:h,background:wood?'#765338':'#515e5a',transformOrigin:'left center',transform:'rotateY(90deg)'}}/>
 <div style={{position:'absolute',left:0,top:0,width:w,height:depth,background:wood?'#dabb8b':'#a9b3aa',transformOrigin:'center top',transform:'rotateX(-90deg)'}}/>
 <div style={{position:'absolute',top:labelY,left:-45,right:-90,fontFamily:DISPLAY,fontSize:29,letterSpacing:1,color:C.paper,whiteSpace:'nowrap',transform:'translateZ(15px)'}}>{label}</div>
 </div>};

const Exploded:React.FC=()=>{const f=useCurrentFrame();const k=p(f,0,52);return <Stage>
 <div style={{position:'absolute',left:110,top:155}}><Label>06 / THE LOAD PATH</Label><Heading style={{marginTop:27}}>SMALL HARDWARE.<br/><span style={{color:C.gold}}>THIN PINE.</span></Heading></div>
 <div style={{position:'absolute',left:655,top:445,width:1170,height:570,perspective:1600}}><div style={{...fill,...keep3d,transform:`rotateX(-9deg) rotateY(${-25+k*8}deg) scale(.84)`}}>
  <div style={{position:'absolute',left:0,top:440,width:1100,height:130,background:'#0009',filter:'blur(28px)',transform:'rotateX(75deg) translateZ(-100px)'}}/>
  <Block x={20} z={180*k} w={130} depth={18} color="#aebbb1" plate label="STRIKE"/>
  <Block x={210+50*k} z={35} w={160} depth={65} color="#d9b584" wood label="THIN JAMB"/>
  <div style={{position:'absolute',left:470,top:55,width:130,height:405,border:'2px dashed #c7b38460',transform:'translateZ(-40px)',opacity:k}}><div style={{position:'absolute',bottom:-96,fontFamily:DISPLAY,fontSize:29,color:C.muted}}>GAP</div></div>
  <Block x={620+90*k} z={-140*k} w={310} depth={140} color="#b38c59" wood label="STRUCTURAL FRAMING"/>
  <div style={{position:'absolute',left:-125,top:-25,transform:`translateZ(${180*k}px) rotateZ(0deg) scale(.42)`,transformOrigin:'0 50%'}}><Screw id="assembly-screw"/></div>
  <svg style={{position:'absolute',left:30,top:-69,transform:`translateZ(${180*k}px)`,overflow:'visible'}} width="800" height="200"><path d="M0 135H410" fill="none" stroke={C.red} strokeWidth="3" strokeDasharray="8 8" strokeDashoffset={-f*.5}/><circle cx="410" cy="135" r="22" fill={C.ink} stroke={C.red} strokeWidth="3"/></svg>
 </div></div>
 <Label style={{position:'absolute',left:111,bottom:105,color:C.muted,fontSize:16}}>EXPLODED VIEW / NOT TO SCALE</Label>
 </Stage>};

const Framing:React.FC=()=>{const f=useCurrentFrame();return <Stage>
 <div style={{position:'absolute',left:95,top:380,perspective:1550}}><Card w={960} h={555} caption="REACH THE STRUCTURE" style={{transform:`rotateY(${12-f*.04}deg) rotateZ(-1.4deg)`}}><Clip src="stock_screw.mp4" start={303}/></Card></div>
 <div style={{position:'absolute',left:1080,top:465,width:690}}><Label>THE MISSED CONNECTION</Label><Heading style={{marginTop:27}}>STRONGER<br/>FRAMING.<br/><span style={{color:C.gold}}>UNUSED.</span></Heading></div>
 <div style={{position:'absolute',left:115,top:196,fontFamily:DISPLAY,fontSize:77,lineHeight:1.08}}>THE STRENGTH<br/>WAS <span style={{color:C.gold}}>BEHIND IT.</span></div>
 </Stage>};

const RayReturn:React.FC=()=>{const f=useCurrentFrame();return <AbsoluteFill><Clip src="avatar.mp4" start={1640} style={{transform:`scale(${1.015+f*.00012})`}}/><div style={{...fill,background:'linear-gradient(0deg,#071112ed,transparent 52%)'}}/><div style={{position:'absolute',left:107,bottom:115}}><Label>RAY’S FIRST PRINCIPLE</Label><Heading style={{marginTop:22}}>START AT THE FRAME.</Heading></div></AbsoluteFill>};

const Resolve:React.FC=()=>{const f=useCurrentFrame();const k=p(f,0,26);return <Stage><div style={{position:'absolute',left:190,top:145,width:465,height:830,perspective:1100}}><div style={{...fill,border:'3px solid #DBB56B',boxShadow:'inset 0 0 70px #dbb56b1a,0 0 55px #dbb56b18',transform:`rotateY(${-32*(1-k)}deg)`}}><div style={{position:'absolute',inset:21,border:'1px solid #dbb56b66'}}/><div style={{position:'absolute',right:50,top:450,width:18,height:18,borderRadius:'50%',background:C.gold}}/></div></div><div style={{position:'absolute',left:784,top:350,width:950}}><Label>THE FOUR THOUSAND DOORS</Label><Heading style={{marginTop:24}}>WHAT HOLDS<br/><span style={{color:C.gold}}>THE LOCK.</span></Heading><div style={{marginTop:32,fontSize:23,color:C.muted,letterSpacing:4}}>RAY KESSLER</div></div></Stage>};

const Guide:React.FC=()=>{const f=useCurrentFrame();const k=p(f,0,24);return <div style={{position:'absolute',right:52,top:70,width:660,height:270,display:'flex',padding:16,gap:18,boxSizing:'border-box',borderRadius:16,border:'1px solid #c7a15b',background:'linear-gradient(125deg,#122120,#080f10)',boxShadow:'0 22px 55px #0008',opacity:k,transform:`translateY(${(1-k)*26}px)`}}>
 <div style={{flex:1,padding:'11px 0 0 7px'}}><div style={{fontFamily:BODY,fontSize:14,fontWeight:600,letterSpacing:2,color:C.gold}}>CHECK YOUR DOOR TODAY</div><div style={{fontFamily:DISPLAY,fontSize:38,lineHeight:1.12,color:C.paper,marginTop:16}}>The One<br/>Afternoon Door</div><div style={{marginTop:23,borderTop:'1px solid #ad8d4b66',paddingTop:15,fontFamily:BODY,fontSize:15,fontWeight:600,color:C.gold,letterSpacing:.7}}>SCAN TO SEE THE GUIDE →</div></div>
 <div style={{width:230,flexShrink:0,background:'white',borderRadius:8,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}><Img src={file('guide_qr.png')} style={{width:222,height:222,objectFit:'contain',flexShrink:0}}/><span style={{fontFamily:BODY,fontSize:10,fontWeight:700,color:'#152021',marginTop:-3}}>raykessler.vercel.app</span></div>
 </div>};

const Frame:React.FC=()=>{const f=useCurrentFrame();const cue=CUES.find(c=>f>=c.from&&f<c.to)!;return <><div style={{position:'absolute',left:54,top:36,color:C.paper,fontFamily:BODY,fontWeight:600,fontSize:14,letterSpacing:3}}>RAY KESSLER<span style={{color:C.gold,marginLeft:20}}>—</span><span style={{fontWeight:400,opacity:.6,marginLeft:20}}>THE FOUR THOUSAND DOORS</span></div><div style={{position:'absolute',right:55,bottom:34,fontFamily:BODY,color:'#e4d7b7aa',fontSize:12,letterSpacing:2}}>{String(CUES.indexOf(cue)+1).padStart(2,'0')} / 11</div><div style={{position:'absolute',left:55,bottom:39,height:2,width:1650,background:'#dbb56b25'}}/><div style={{position:'absolute',left:55,bottom:39,height:2,width:1650*f/1799,background:C.gold}}/></>};

const scenes=[Opening,Failure,Carousel,FieldWork,Experience,Inspection,Measurement,Exploded,Framing,RayReturn,Resolve];
export const MainRaymotion60:React.FC=()=> <AbsoluteFill style={{background:C.ink}}>
 {CUES.map((c,i)=>{const Component=scenes[i];return <Sequence key={c.id} from={c.from} durationInFrames={c.to-c.from}><Component/></Sequence>})}
 <Frame/>
 <Sequence from={997} durationInFrames={803}><Guide/></Sequence>
 <Audio src={staticFile('raymotion60_fish.wav')}/>
</AbsoluteFill>;
