import React from 'react';
import {AbsoluteFill,Audio,OffthreadVideo,Sequence,staticFile,useCurrentFrame} from 'remotion';
import {Foto, StatBug} from '../rksafe/RayStage';
import {BigStat} from '../rksafe/BigStat';
import {MythTruth} from '../rksafe/MythTruth';
import {SplitVs} from '../rksafe/SplitVs';
import {ProcessChips} from '../rksafe/ProcessChips';
import {RouteFlow} from '../rksafe/RouteFlow';
import {RayChecklist} from '../rksafe/RayChecklist';
import {CheckCard} from '../rksafe/CheckCard';
import {PullQuote} from '../rksafe/PullQuote';
import {RayCta} from '../rksafe/RayCta';
const RayvaultAvatar:React.FC<{start:number}>=({start})=>{const f=useCurrentFrame();return <OffthreadVideo muted src={staticFile('rayvault_avatar.mp4')} startFrom={start} style={{width:'100%',height:'100%',objectFit:'cover',transform:`scale(${(1.006+f*0.000035).toFixed(5)})`}} />;};
// Eight source-audited mechanical corrections. Each is an original diagram;
// no photo/clip is reused and every existing narration boundary is preserved.
const RayvaultMechanicalRepair:React.FC<{kind:string}>=({kind})=>{
  const f=useCurrentFrame();
  const ease=(a:number,b:number)=>{const x=Math.max(0,Math.min(1,(f-a)/(b-a)));return x*x*(3-2*x);};
  const brass='#CDA451',ink='#172B2A',wood='#C89D6A',steel='#A8B7B8',red='#B14538';
  const titles:Record<string,string>={strike:'A small plate. A small attachment area.',jobs:'Related jobs. Different connections.',travel:'Full travel — with the door closed.',rubbing:'Correct the fit. Don’t rely on wear.',keypad:'Convenience at the door.',instructions:'Clear installation requirements.',brace:'The floor contact matters.',framing:'Connect the strike to sound framing.'};
  const label=(x:number,y:number,t:string,color=ink,size=31)=><text x={x} y={y} fill={color} fontSize={size} fontWeight={650} fontFamily="Arial, sans-serif">{t}</text>;
  const screwHead=(x:number,y:number)=><g><circle cx={x} cy={y} r={18} fill="#748687" stroke="#DDE5E3" strokeWidth={3}/><path d={`M${x-9} ${y}h18 M${x} ${y-9}v18`} stroke={ink} strokeWidth={3}/></g>;
  const plate=(x:number,y:number,w=170,h=360)=><g><rect x={x} y={y} width={w} height={h} rx={12} fill={steel} stroke="#506969" strokeWidth={4}/><rect x={x+w*.26} y={y+h*.33} width={w*.48} height={h*.34} rx={4} fill="#314442"/>{screwHead(x+w/2,y+h*.13)}{screwHead(x+w/2,y+h*.87)}</g>;
  const woodGrain=(x:number,y:number,w:number,h:number)=><g>{Array.from({length:9},(_,i)=><path key={i} d={`M${x+12} ${y+18+i*(h-36)/8} Q${x+w*.45} ${y+26+i*(h-36)/8} ${x+w-12} ${y+18+i*(h-36)/8}`} fill="none" stroke="#9E774D" opacity={.22} strokeWidth={3}/>)}</g>;
  const fastener=(x:number,y:number,length:number)=><g><path d={`M${x} ${y}h${length-20}l20 0 -20 9 H${x}Z`} fill="#64797B"/>{Array.from({length:Math.floor((length-25)/16)},(_,i)=><path key={i} d={`M${x+10+i*16} ${y-5}l-6 18`} stroke="#3C5154" strokeWidth={3}/>)}<rect x={x-5} y={y-12} width={9} height={32} rx={3} fill="#A8B7B8"/></g>;
  const travel=kind==='travel';const boltY=travel?478:442+36*ease(50,105);const extension=travel?80+230*ease(25,100):310;
  return <AbsoluteFill style={{background:'linear-gradient(130deg,#F8F4E9,#E7E4D7)',color:ink}}>
    <svg viewBox="0 0 1920 1080" style={{width:'100%',height:'100%'}}>
      <defs><pattern id={`grain-${kind}`} width="60" height="60" patternUnits="userSpaceOnUse"><circle cx="12" cy="17" r="1" fill="#53615B" opacity=".09"/></pattern></defs>
      <rect width="1920" height="1080" fill={`url(#grain-${kind})`}/>
      <path d="M120 170H1800" stroke={brass} strokeWidth={3}/>
      {label(120,125,titles[kind],ink,49)}
      <g transform={`translate(${(1-ease(0,18))*12} 0)`}>
      {kind==='strike'&&<g>
        <rect x={600} y={245} width={510} height={630} rx={8} fill={wood}/>{woodGrain(600,245,510,630)}
        <rect x={752} y={356} width={200} height={407} rx={16} fill={brass} opacity={.15+.1*ease(15,55)}/>{plate(768,380)}
        <path d="M840 426H1210 M840 693H1210" stroke={brass} strokeWidth={3}/>
        {label(1230,448,'Two fixing points')}{label(1230,708,'A limited area')}
        {label(610,953,'Small strike plate',ink,38)}
      </g>}
      {kind==='jobs'&&<g>
        <rect x={270} y={285} width={1380} height={615} rx={8} fill="#DED6C4"/>
        <rect x={405} y={337} width={1130} height={515} fill="#FAF8F0" stroke={wood} strokeWidth={45}/>
        <rect x={590} y={364} width={760} height={465} fill="#E8EBDD" stroke="#81948E" strokeWidth={4}/>
        <rect x={535} y={460} width={35} height={210} rx={4} fill={brass}/>
        <rect x={590} y={475} width={35} height={184} rx={4} fill={steel}/>
        {[435,650].map(y=><rect key={y} x={1340} y={y} width={65} height={75} rx={4} fill={steel} stroke={ink} strokeWidth={3}/>)}
        <path d="M535 540H205V970 M612 662V970 M1385 686V970" fill="none" stroke={ink} strokeWidth={3}/>
        {label(145,1020,'Jamb reinforcement',ink,30)}{label(600,1020,'Door-edge reinforcement',ink,30)}{label(1320,1020,'Hinge attachment',ink,30)}
      </g>}
      {(kind==='travel'||kind==='rubbing')&&<g>
        {label(305,300,'DOOR',ink,28)}{label(1015,300,'JAMB + RECEIVING POCKET',ink,28)}
        <rect x={300} y={355} width={600} height={355} rx={4} fill={wood}/>{woodGrain(300,355,600,355)}
        <rect x={1000} y={355} width={530} height={355} rx={4} fill="#CEAD80"/>{woodGrain(1000,355,530,355)}
        <rect x={985} y={400} width={30} height={220} fill={steel}/>
        <rect x={985} y={459} width={290} height={110} fill="#324841"/>
        <rect x={762} y={boltY} width={extension} height={74} rx={5} fill={steel} stroke="#627777" strokeWidth={4}/>
        <rect x={810} y={415} width={28} height={188} fill="#829597"/>
        {kind==='rubbing'&&<circle cx={991} cy={457} r={38} fill="none" stroke={red} opacity={1-ease(55,106)} strokeWidth={6}/>}
        <path d="M810 798H1170" stroke={travel?brass:ink} strokeWidth={5}/><path d="M1150 784L1170 798 1150 812" fill="none" stroke={travel?brass:ink} strokeWidth={5}/>
        {label(330,895,travel?'The bolt reaches its full locked position.':f<90?'Rubbing is a fit problem.':'Correct the alignment for smooth travel.',ink,39)}
        {label(330,947,'Section diagram', '#5B6D63',24)}
      </g>}
      {kind==='keypad'&&<g>
        <rect x={440} y={228} width={970} height={810} fill={wood}/>{woodGrain(440,228,970,810)}
        <rect x={1245} y={228} width={95} height={810} fill="#C39865"/>
        <rect x={800} y={304} width={278} height={438} rx={34} fill={ink} stroke="#718680" strokeWidth={7}/>
        <rect x={827} y={333} width={222} height={57} rx={8} fill="#425D51"/>
        {Array.from({length:9},(_,i)=>{const x=851+(i%3)*88,y=435+Math.floor(i/3)*90;const active=i===4&&f>30&&f<80;return <g key={i}><circle cx={x} cy={y} r={31} fill={active?brass:'#374E48'}/><text x={x} y={y+11} textAnchor="middle" fontFamily="Arial" fontSize={30} fill={active?ink:'#EDF1E9'}>{i+1}</text></g>;})}
        <circle cx={939} cy={850} r={59} fill={steel} stroke="#60787A" strokeWidth={6}/>
        <path d="M1058 527H1500" stroke={brass} strokeWidth={4}/>{label(1460,590,'Keypad entry',ink,34)}
      </g>}
      {kind==='instructions'&&<g>
        <rect x={265} y={256} width={650} height={730} rx={6} fill="#FFFEF8" stroke="#C7CBBF" strokeWidth={3}/>
        {label(328,350,'Before choosing hardware',ink,36)}
        {['Fasteners','Fit','Installation'].map((t,i)=><g key={t} opacity={.45+.55*ease(8+i*18,26+i*18)}><rect x={330} y={414+i*148} width={42} height={42} rx={5} fill="none" stroke={brass} strokeWidth={4}/>{label(406,448+i*148,t,ink,39)}<path d={`M330 ${490+i*148}H836`} stroke="#CED2C6" strokeWidth={2}/></g>)}
        <rect x={1120} y={332} width={365} height={535} fill={wood}/>{woodGrain(1120,332,365,535)}{plate(1215,400,170,360)}
        <path d="M985 590H1120" stroke={brass} strokeWidth={5} strokeDasharray="10 9"/>
      </g>}
      {kind==='brace'&&<g>
        <path d="M250 925H1710" stroke={ink} strokeWidth={8}/>
        <rect x={455} y={266} width={85} height={655} fill={wood} stroke="#967041" strokeWidth={4}/>
        <path d="M540 472H594" stroke={steel} strokeWidth={24}/><circle cx={595} cy={472} r={31} fill={steel} stroke={ink} strokeWidth={4}/>
        <g transform={`translate(${ease(45,100)*22} 0)`}>
          <path d="M563 451Q590 521 624 453" fill="none" stroke={ink} strokeWidth={15}/>
          <path d="M592 492L1125 886" stroke="#557174" strokeWidth={37}/><path d="M601 498L1132 887" stroke="#BDCACA" strokeWidth={18}/>
          <ellipse cx={1130} cy={897} rx={91} ry={22} fill={ink}/>
          <path d="M943 921Q1080 913 1285 921L1340 943H920Z" fill="#B69D7B" stroke="#8C795D" strokeWidth={3}/>
        </g>
        <path d="M1350 775L1230 877" stroke={brass} strokeWidth={4}/>{label(1355,754,'Rubber foot',ink,35)}
        <path d="M992 992H1265" stroke={red} strokeWidth={5}/><path d="M1008 980L992 992 1008 1004 M1249 980L1265 992 1249 1004" fill="none" stroke={red} strokeWidth={4}/>
        {label(345,1036,'A loose rug can move beneath the foot.',ink,35)}
      </g>}
      {kind==='framing'&&<g>
        <rect x={355} y={280} width={280} height={610} fill="#E6D6B6"/>{woodGrain(355,280,280,610)}
        <rect x={635} y={280} width={145} height={610} fill="#E6E9DA"/>
        <rect x={780} y={280} width={615} height={610} fill={wood}/>{woodGrain(780,280,615,610)}
        <rect x={635} y={392} width={145} height={72} fill="#BF955A"/><rect x={635} y={723} width={145} height={72} fill="#BF955A"/>
        <rect x={337} y={345} width={35} height={496} rx={3} fill={steel}/>
        <rect x={337} y={526} width={156} height={134} fill="#384F46"/>
        {fastener(356,427,650)}{fastener(356,758,650)}
        {label(355,962,'Jamb',ink,32)}{label(625,962,'Solid shim',ink,32)}{label(1020,962,'Sound framing',ink,32)}
        {label(1060,382,'Compatible fasteners',ink,32)}
      </g>}
      </g>
    </svg>
  </AbsoluteFill>;
};
export const TOTAL_FRAMES_RAYVAULT=52404;
export const MainRayvault:React.FC<{audioEnabled?:boolean}>=({audioEnabled=true})=> <AbsoluteFill style={{backgroundColor:'#0A0A0C'}}>
<Sequence key="rv_001" from={0} durationInFrames={95}><AbsoluteFill><RayvaultAvatar start={0} /></AbsoluteFill></Sequence>
<Sequence key="rv_002" from={95} durationInFrames={57}><AbsoluteFill><Foto src="img/rayvault_m_01.jpg" seed={95} /></AbsoluteFill></Sequence>
<Sequence key="rv_003" from={152} durationInFrames={155}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_h_02.mp4")} playbackRate={0.977419} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_004" from={307} durationInFrames={123}><AbsoluteFill><Foto src="img/rayvault_rv_004_fix1.jpg" seed={307} /></AbsoluteFill></Sequence>
<Sequence key="rv_005" from={430} durationInFrames={150}><AbsoluteFill><Foto src="img/rayvault_h_01_r1.jpg" seed={430} /></AbsoluteFill></Sequence>
<Sequence key="rv_006" from={580} durationInFrames={144}><AbsoluteFill><Foto src="img/rayvault_rv_006.jpg" seed={580} /></AbsoluteFill></Sequence>
<Sequence key="rv_007" from={724} durationInFrames={71}><AbsoluteFill><BigStat durationInFrames={71} {...({"value":"4,000","unit":"","caption":"Doors replaced — Ray’s experience","tone":"brass","bed":"img/rayvault_rv_007_fix1.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_008" from={795} durationInFrames={187}><AbsoluteFill><BigStat durationInFrames={187} {...({"value":"35","unit":"years","caption":"A working locksmith’s perspective","tone":"brass","bed":"img/rayvault_rv_008.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_009" from={982} durationInFrames={178}><AbsoluteFill><Foto src="img/rayvault_rv_009.jpg" seed={982} /></AbsoluteFill></Sequence>
<Sequence key="rv_010" from={1160} durationInFrames={162}><AbsoluteFill><BigStat durationInFrames={162} {...({"value":"¾ inch","unit":"","caption":"The original short strike screws","tone":"brass","bed":"img/rayvault_rv_010.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_011" from={1322} durationInFrames={157}><AbsoluteFill><Foto src="img/rayvault_rv_011.jpg" seed={1322} /></AbsoluteFill></Sequence>
<Sequence key="rv_012" from={1479} durationInFrames={161}><AbsoluteFill><Foto src="img/rayvault_rv_012.jpg" seed={1479} /></AbsoluteFill></Sequence>
<Sequence key="rv_013" from={1640} durationInFrames={117}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_rv_013.mp4")} playbackRate={1.000000} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_014" from={1757} durationInFrames={114}><AbsoluteFill><MythTruth durationInFrames={114} {...({"myth":"A home door is a vault","truth":"Strengthen the complete doorway","kicker":"CHECK THE ASSUMPTION","bed":"img/rayvault_rv_014_fix1.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_014b" from={1871} durationInFrames={218}><AbsoluteFill><Foto src="img/rayvault_rv_014b_fix1.jpg" seed={1871} /></AbsoluteFill></Sequence>
<Sequence key="rv_015" from={2089} durationInFrames={233}><AbsoluteFill><Foto src="img/rayvault_rv_015.jpg" seed={2089} /></AbsoluteFill></Sequence>
<Sequence key="rv_016" from={2322} durationInFrames={166}><AbsoluteFill><SplitVs durationInFrames={166} {...({"leftLabel":"Unnecessary bunker","leftValue":"$20,000","rightLabel":"Practical first check","rightValue":"$3 screw","verdict":"Inspect before you spend","bed":"img/rayvault_rv_016.jpg","leftImage":"img/rayvault_rv_016_left.jpg","rightImage":"img/rayvault_rv_016_right_fix1.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_017" from={2488} durationInFrames={196}><AbsoluteFill><ProcessChips durationInFrames={196} {...({"title":"In the right order","kicker":"PRACTICAL CHECKS","steps":[{"title":"Plate"},{"title":"Frame repair"},{"title":"Door assessment"}],"bed":"img/rayvault_rv_017.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_017b" from={2684} durationInFrames={122}><AbsoluteFill><Foto src="img/rayvault_rv_017b.jpg" seed={2684} /></AbsoluteFill></Sequence>
<Sequence key="rv_018" from={2806} durationInFrames={288}><AbsoluteFill><Foto src="img/rayvault_rv_018.jpg" seed={2806} /></AbsoluteFill></Sequence>
<Sequence key="rv_019" from={3094} durationInFrames={155}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_h_03.mp4")} playbackRate={0.977419} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_020" from={3249} durationInFrames={184}><AbsoluteFill><Foto src="img/rayvault_rv_020_fix2.jpg" seed={3249} /></AbsoluteFill></Sequence>
<Sequence key="rv_021" from={3433} durationInFrames={140}><AbsoluteFill><Foto src="img/rayvault_rv_021_fix1.jpg" seed={3433} /></AbsoluteFill></Sequence>
<Sequence key="rv_022" from={3573} durationInFrames={123}><AbsoluteFill><Foto src="img/rayvault_rv_022.jpg" seed={3573} /></AbsoluteFill></Sequence>
<Sequence key="rv_023" from={3696} durationInFrames={229}><AbsoluteFill><RouteFlow durationInFrames={229} {...({"title":"Know the layers","kicker":"WOOD-FRAMED EXAMPLE","steps":[{"label":"Jamb"},{"label":"Gap"},{"label":"Solid shim"},{"label":"Framing"}],"bed":"img/rayvault_rv_023.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_024" from={3925} durationInFrames={121}><AbsoluteFill><Foto src="img/rayvault_rv_024.jpg" seed={3925} /></AbsoluteFill></Sequence>
<Sequence key="rv_025" from={4046} durationInFrames={188}><AbsoluteFill><Foto src="img/rayvault_rv_025.jpg" seed={4046} /></AbsoluteFill></Sequence>
<Sequence key="rv_025b" from={4234} durationInFrames={205}><AbsoluteFill><Foto src="img/rayvault_rv_025b.jpg" seed={4234} /></AbsoluteFill></Sequence>
<Sequence key="rv_026" from={4439} durationInFrames={185}><AbsoluteFill><Foto src="img/rayvault_rv_026.jpg" seed={4439} /></AbsoluteFill></Sequence>
<Sequence key="rv_027" from={4624} durationInFrames={168}><AbsoluteFill><MythTruth durationInFrames={168} {...({"myth":"Brick exterior = strong attachment","truth":"The strike still needs sound framing","kicker":"CHECK THE ASSUMPTION","bed":"img/rayvault_rv_027.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_028" from={4792} durationInFrames={184}><AbsoluteFill><Foto src="img/rayvault_rv_028.jpg" seed={4792} /></AbsoluteFill></Sequence>
<Sequence key="rv_029" from={4976} durationInFrames={222}><AbsoluteFill><RouteFlow durationInFrames={222} {...({"title":"Follow the connection","kicker":"ONE CONTINUOUS LOAD PATH","steps":[{"label":"Door"},{"label":"Bolt"},{"label":"Strike"},{"label":"Fasteners"},{"label":"Framing"}],"bed":"img/rayvault_m_03.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_030" from={5198} durationInFrames={233}><AbsoluteFill><Foto src="img/rayvault_rv_030.jpg" seed={5198} /></AbsoluteFill></Sequence>
<Sequence key="rv_031" from={5431} durationInFrames={268}><AbsoluteFill><RayChecklist durationInFrames={268} {...({"title":"Check the actual installation","kicker":"RAY’S CHECK","items":[{"text":"Loose hardware"},{"text":"Cracked wood"},{"text":"Rusty fasteners"}],"bed":"img/rayvault_rv_031.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_032" from={5699} durationInFrames={146}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_rv_032.mp4")} playbackRate={1.000000} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_033" from={5845} durationInFrames={193}><AbsoluteFill><Foto src="img/rayvault_rv_033_fix2.jpg" seed={5845} /></AbsoluteFill></Sequence>
<Sequence key="rv_034" from={6038} durationInFrames={155}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_rv_034.mp4")} playbackRate={0.977419} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_035" from={6193} durationInFrames={309}><AbsoluteFill><Foto src="img/rayvault_rv_035.jpg" seed={6193} /></AbsoluteFill></Sequence>
<Sequence key="rv_036" from={6502} durationInFrames={150}><AbsoluteFill><BigStat durationInFrames={150} {...({"value":"3 inches","unit":"","caption":"Common starting point — confirm the framing","tone":"brass","bed":"img/rayvault_m_02.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_037" from={6652} durationInFrames={109}><AbsoluteFill><Foto src="img/rayvault_rv_037.jpg" seed={6652} /></AbsoluteFill></Sequence>
<Sequence key="rv_038" from={6761} durationInFrames={213}><AbsoluteFill><Foto src="img/rayvault_rv_038.jpg" seed={6761} /></AbsoluteFill></Sequence>
<Sequence key="rv_039" from={6974} durationInFrames={169}><AbsoluteFill><MythTruth durationInFrames={169} {...({"myth":"Length alone settles the choice","truth":"Hardware and framing determine the fastener","kicker":"CHECK THE ASSUMPTION","bed":"img/rayvault_rv_039_fix2.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_040" from={7143} durationInFrames={223}><AbsoluteFill><Foto src="img/rayvault_rv_040.jpg" seed={7143} /></AbsoluteFill></Sequence>
<Sequence key="rv_041" from={7366} durationInFrames={166}><AbsoluteFill><SplitVs durationInFrames={166} {...({"leftLabel":"Drywall screw","leftValue":"Brittle","rightLabel":"Specified fastener","rightValue":"Compatible","verdict":"Match the hardware","bed":"img/rayvault_rv_041.jpg","leftImage":"img/rayvault_rv_041_left.jpg","rightImage":"img/rayvault_rv_041_right.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_042" from={7532} durationInFrames={126}><AbsoluteFill><Foto src="img/rayvault_rv_042_fix1.jpg" seed={7532} /></AbsoluteFill></Sequence>
<Sequence key="rv_043" from={7658} durationInFrames={289}><AbsoluteFill><Foto src="img/rayvault_rv_043.jpg" seed={7658} /></AbsoluteFill></Sequence>
<Sequence key="rv_044" from={7947} durationInFrames={256}><AbsoluteFill><Foto src="img/rayvault_rv_044.jpg" seed={7947} /></AbsoluteFill></Sequence>
<Sequence key="rv_045" from={8203} durationInFrames={198}><AbsoluteFill><Foto src="img/rayvault_rv_045.jpg" seed={8203} /></AbsoluteFill></Sequence>
<Sequence key="rv_046" from={8401} durationInFrames={232}><AbsoluteFill><Foto src="img/rayvault_rv_046.jpg" seed={8401} /></AbsoluteFill></Sequence>
<Sequence key="rv_047" from={8633} durationInFrames={196}><AbsoluteFill><Foto src="img/rayvault_rv_047_fix2.jpg" seed={8633} /></AbsoluteFill></Sequence>
<Sequence key="rv_048" from={8829} durationInFrames={203}><AbsoluteFill><Foto src="img/rayvault_m_06.jpg" seed={8829} /></AbsoluteFill></Sequence>
<Sequence key="rv_049" from={9032} durationInFrames={134}><AbsoluteFill><Foto src="img/rayvault_rv_049_fix1.jpg" seed={9032} /></AbsoluteFill></Sequence>
<Sequence key="rv_050" from={9166} durationInFrames={248}><AbsoluteFill><Foto src="img/rayvault_h_04.jpg" seed={9166} /></AbsoluteFill></Sequence>
<Sequence key="rv_051" from={9414} durationInFrames={109}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_h_06.mp4")} playbackRate={1.000000} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_052" from={9523} durationInFrames={243}><AbsoluteFill><Foto src="img/rayvault_rv_052_fix1.jpg" seed={9523} /></AbsoluteFill></Sequence>
<Sequence key="rv_053" from={9766} durationInFrames={96}><AbsoluteFill><Foto src="img/rayvault_m_04.jpg" seed={9766} /></AbsoluteFill></Sequence>
<Sequence key="rv_054" from={9862} durationInFrames={201}><AbsoluteFill><Foto src="img/rayvault_rv_054.jpg" seed={9862} /></AbsoluteFill></Sequence>
<Sequence key="rv_055" from={10063} durationInFrames={192}><AbsoluteFill><Foto src="img/rayvault_rv_055.jpg" seed={10063} /></AbsoluteFill></Sequence>
<Sequence key="rv_056" from={10255} durationInFrames={147}><AbsoluteFill><Foto src="img/rayvault_rv_056.jpg" seed={10255} /></AbsoluteFill></Sequence>
<Sequence key="rv_057" from={10402} durationInFrames={254}><AbsoluteFill><Foto src="img/rayvault_rv_057.jpg" seed={10402} /></AbsoluteFill></Sequence>
<Sequence key="rv_058" from={10656} durationInFrames={265}><AbsoluteFill><Foto src="img/rayvault_rv_058_fix2.jpg" seed={10656} /></AbsoluteFill></Sequence>
<Sequence key="rv_059" from={10921} durationInFrames={294}><AbsoluteFill><Foto src="img/rayvault_rv_059.jpg" seed={10921} /></AbsoluteFill></Sequence>
<Sequence key="rv_060" from={11215} durationInFrames={177}><AbsoluteFill><Foto src="img/rayvault_rv_060.jpg" seed={11215} /></AbsoluteFill></Sequence>
<Sequence key="rv_061" from={11392} durationInFrames={297}><AbsoluteFill><CheckCard durationInFrames={297} {...({"title":"Check the actual installation","kicker":"RAY’S CHECK","items":[{"text":"Hardware compatibility"},{"text":"Screw size"},{"text":"Framing location"},{"text":"Alignment"}],"bed":"img/rayvault_rv_061.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_062" from={11689} durationInFrames={289}><AbsoluteFill><Foto src="img/rayvault_rv_062.jpg" seed={11689} /></AbsoluteFill></Sequence>
<Sequence key="rv_062b" from={11978} durationInFrames={156}><AbsoluteFill><Foto src="img/rayvault_rv_062b.jpg" seed={11978} /></AbsoluteFill></Sequence>
<Sequence key="rv_063" from={12134} durationInFrames={168}><AbsoluteFill><Foto src="img/rayvault_rv_063.jpg" seed={12134} /></AbsoluteFill></Sequence>
<Sequence key="rv_064" from={12302} durationInFrames={156}><AbsoluteFill><Foto src="img/rayvault_rv_064.jpg" seed={12302} /></AbsoluteFill></Sequence>
<Sequence key="rv_064b" from={12458} durationInFrames={170}><AbsoluteFill><Foto src="img/rayvault_rv_064b.jpg" seed={12458} /></AbsoluteFill></Sequence>
<Sequence key="rv_065" from={12628} durationInFrames={168}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_h_07.mp4")} playbackRate={0.901786} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_066" from={12796} durationInFrames={263}><AbsoluteFill><Foto src="img/rayvault_m_05.jpg" seed={12796} /></AbsoluteFill></Sequence>
<Sequence key="rv_067" from={13059} durationInFrames={128}><AbsoluteFill><Foto src="img/rayvault_rv_067.jpg" seed={13059} /></AbsoluteFill></Sequence>
<Sequence key="rv_068" from={13187} durationInFrames={91}><AbsoluteFill><Foto src="img/rayvault_rv_068.jpg" seed={13187} /></AbsoluteFill></Sequence>
<Sequence key="rv_068b" from={13278} durationInFrames={295}><AbsoluteFill><Foto src="img/rayvault_rv_068b.jpg" seed={13278} /></AbsoluteFill></Sequence>
<Sequence key="rv_069" from={13573} durationInFrames={252}><AbsoluteFill><Foto src="img/rayvault_rv_069.jpg" seed={13573} /></AbsoluteFill></Sequence>
<Sequence key="rv_070" from={13825} durationInFrames={300}><AbsoluteFill><Foto src="img/rayvault_rv_070.jpg" seed={13825} /></AbsoluteFill></Sequence>
<Sequence key="rv_071" from={14125} durationInFrames={116}><AbsoluteFill><Foto src="img/rayvault_rv_071.jpg" seed={14125} /></AbsoluteFill></Sequence>
<Sequence key="rv_072" from={14241} durationInFrames={130}><AbsoluteFill><MythTruth durationInFrames={130} {...({"myth":"Covering damage repairs it","truth":"Repair the wood first","kicker":"CHECK THE ASSUMPTION","bed":"img/rayvault_rv_072_fix2.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_073" from={14371} durationInFrames={195}><AbsoluteFill><Foto src="img/rayvault_rv_073.jpg" seed={14371} /></AbsoluteFill></Sequence>
<Sequence key="rv_073b" from={14566} durationInFrames={117}><AbsoluteFill><Foto src="img/rayvault_rv_073b.jpg" seed={14566} /></AbsoluteFill></Sequence>
<Sequence key="rv_074" from={14683} durationInFrames={192}><AbsoluteFill><ProcessChips durationInFrames={192} {...({"title":"In the right order","kicker":"PRACTICAL CHECKS","steps":[{"title":"Sound repair"},{"title":"Replacement jamb"},{"title":"Complete unit"}],"bed":"img/rayvault_rv_074.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_074b" from={14875} durationInFrames={141}><AbsoluteFill><Foto src="img/rayvault_rv_074b.jpg" seed={14875} /></AbsoluteFill></Sequence>
<Sequence key="rv_075" from={15016} durationInFrames={140}><AbsoluteFill><Foto src="img/rayvault_rv_075_fix1.jpg" seed={15016} /></AbsoluteFill></Sequence>
<Sequence key="rv_076" from={15156} durationInFrames={243}><AbsoluteFill><Foto src="img/rayvault_rv_076.jpg" seed={15156} /></AbsoluteFill></Sequence>
<Sequence key="rv_077" from={15399} durationInFrames={253}><AbsoluteFill><SplitVs durationInFrames={253} {...({"leftLabel":"Foam","leftValue":"Sealing","rightLabel":"Solid shim","rightValue":"Support","verdict":"Different jobs","bed":"img/rayvault_rv_077.jpg","leftImage":"img/rayvault_rv_077_left_fix3.jpg","rightImage":"img/rayvault_rv_077_right_fix3.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_078" from={15652} durationInFrames={239}><AbsoluteFill><Foto src="img/rayvault_rv_078.jpg" seed={15652} /></AbsoluteFill></Sequence>
<Sequence key="rv_079" from={15891} durationInFrames={180}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_h_08.mp4")} playbackRate={0.841667} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_080" from={16071} durationInFrames={133}><RayvaultMechanicalRepair kind="strike" /></Sequence>
<Sequence key="rv_081" from={16204} durationInFrames={236}><AbsoluteFill><Foto src="img/rayvault_rv_081_fix1.jpg" seed={16204} /></AbsoluteFill></Sequence>
<Sequence key="rv_081b" from={16440} durationInFrames={88}><AbsoluteFill><Foto src="img/rayvault_rv_081b.jpg" seed={16440} /></AbsoluteFill></Sequence>
<Sequence key="rv_082" from={16528} durationInFrames={129}><AbsoluteFill><Foto src="img/rayvault_m_07.jpg" seed={16528} /></AbsoluteFill></Sequence>
<Sequence key="rv_083" from={16657} durationInFrames={87}><AbsoluteFill><Foto src="img/rayvault_rv_083.jpg" seed={16657} /></AbsoluteFill></Sequence>
<Sequence key="rv_084" from={16744} durationInFrames={124}><RayvaultMechanicalRepair kind="jobs" /></Sequence>
<Sequence key="rv_085" from={16868} durationInFrames={250}><AbsoluteFill><Foto src="img/rayvault_rv_085.jpg" seed={16868} /></AbsoluteFill></Sequence>
<Sequence key="rv_086" from={17118} durationInFrames={170}><AbsoluteFill><Foto src="img/rayvault_rv_086.jpg" seed={17118} /></AbsoluteFill></Sequence>
<Sequence key="rv_087" from={17288} durationInFrames={200}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_rv_087.mp4")} playbackRate={0.757500} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_087b" from={17488} durationInFrames={154}><AbsoluteFill><Foto src="img/rayvault_rv_087b_fix1.jpg" seed={17488} /></AbsoluteFill></Sequence>
<Sequence key="rv_088" from={17642} durationInFrames={212}><AbsoluteFill><Foto src="img/rayvault_rv_088.jpg" seed={17642} /></AbsoluteFill></Sequence>
<Sequence key="rv_089" from={17854} durationInFrames={134}><AbsoluteFill><Foto src="img/rayvault_rv_089_fix2.jpg" seed={17854} /></AbsoluteFill></Sequence>
<Sequence key="rv_090" from={17988} durationInFrames={114}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_rv_090.mp4")} playbackRate={1.000000} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_091" from={18102} durationInFrames={178}><AbsoluteFill><Foto src="img/rayvault_rv_091.jpg" seed={18102} /></AbsoluteFill></Sequence>
<Sequence key="rv_092" from={18280} durationInFrames={122}><AbsoluteFill><Foto src="img/rayvault_rv_092.jpg" seed={18280} /></AbsoluteFill></Sequence>
<Sequence key="rv_093" from={18402} durationInFrames={204}><AbsoluteFill><CheckCard durationInFrames={204} {...({"title":"Check the actual installation","kicker":"RAY’S CHECK","items":[{"text":"Fits the door"},{"text":"Clear installation requirements"},{"text":"Sound structural material"}],"bed":"img/rayvault_rv_093_fix1.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_093b" from={18606} durationInFrames={110}><AbsoluteFill><Foto src="img/rayvault_rv_093b.jpg" seed={18606} /></AbsoluteFill></Sequence>
<Sequence key="rv_094" from={18716} durationInFrames={263}><AbsoluteFill><Foto src="img/rayvault_rv_094.jpg" seed={18716} /></AbsoluteFill></Sequence>
<Sequence key="rv_095" from={18979} durationInFrames={279}><AbsoluteFill><Foto src="img/rayvault_rv_095.jpg" seed={18979} /></AbsoluteFill></Sequence>
<Sequence key="rv_096" from={19258} durationInFrames={166}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_rv_096.mp4")} playbackRate={0.912651} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_097" from={19424} durationInFrames={235}><AbsoluteFill><Foto src="img/rayvault_rv_097_fix1.jpg" seed={19424} /></AbsoluteFill></Sequence>
<Sequence key="rv_097b" from={19659} durationInFrames={148}><AbsoluteFill><Foto src="img/rayvault_rv_097b.jpg" seed={19659} /></AbsoluteFill></Sequence>
<Sequence key="rv_098" from={19807} durationInFrames={159}><AbsoluteFill><BigStat durationInFrames={159} {...({"value":"1 inch","unit":"","caption":"Nominal throw — verify installed travel","tone":"brass","bed":"img/rayvault_m_08.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_098b" from={19966} durationInFrames={180}><AbsoluteFill><BigStat durationInFrames={180} {...({"value":"1 inch","unit":"","caption":"Nominal throw — verify installed travel","tone":"brass","bed":"img/rayvault_rv_098b_fix2.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_099" from={20146} durationInFrames={123}><AbsoluteFill><MythTruth durationInFrames={123} {...({"myth":"Package throw = installed travel","truth":"Observe the actual fully locked position","kicker":"CHECK THE ASSUMPTION","bed":"img/rayvault_rv_099.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_099b" from={20269} durationInFrames={184}><AbsoluteFill><Foto src="img/rayvault_rv_099b.jpg" seed={20269} /></AbsoluteFill></Sequence>
<Sequence key="rv_100" from={20453} durationInFrames={198}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_h_09_r1.mp4")} playbackRate={0.765152} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_101" from={20651} durationInFrames={100}><AbsoluteFill><Foto src="img/rayvault_rv_101.jpg" seed={20651} /></AbsoluteFill></Sequence>
<Sequence key="rv_102" from={20751} durationInFrames={112}><AbsoluteFill><Foto src="img/rayvault_rv_102_fix2.jpg" seed={20751} /></AbsoluteFill></Sequence>
<Sequence key="rv_103" from={20863} durationInFrames={207}><RayvaultMechanicalRepair kind="travel" /></Sequence>
<Sequence key="rv_103b" from={21070} durationInFrames={139}><AbsoluteFill><Foto src="img/rayvault_rv_103b.jpg" seed={21070} /></AbsoluteFill></Sequence>
<Sequence key="rv_104" from={21209} durationInFrames={122}><AbsoluteFill><Foto src="img/rayvault_rv_104.jpg" seed={21209} /></AbsoluteFill></Sequence>
<Sequence key="rv_104b" from={21331} durationInFrames={150}><AbsoluteFill><Foto src="img/rayvault_rv_104b_fix1.jpg" seed={21331} /></AbsoluteFill></Sequence>
<Sequence key="rv_105" from={21481} durationInFrames={58}><AbsoluteFill><Foto src="img/rayvault_rv_105.jpg" seed={21481} /></AbsoluteFill></Sequence>
<Sequence key="rv_106" from={21539} durationInFrames={179}><AbsoluteFill><Foto src="img/rayvault_rv_106.jpg" seed={21539} /></AbsoluteFill></Sequence>
<Sequence key="rv_107" from={21718} durationInFrames={222}><AbsoluteFill><Foto src="img/rayvault_rv_107_fix2.jpg" seed={21718} /></AbsoluteFill></Sequence>
<Sequence key="rv_107b" from={21940} durationInFrames={156}><AbsoluteFill><Foto src="img/rayvault_rv_107b.jpg" seed={21940} /></AbsoluteFill></Sequence>
<Sequence key="rv_108" from={22096} durationInFrames={293}><AbsoluteFill><RouteFlow durationInFrames={293} {...({"title":"Projection is not engagement","kicker":"FOLLOW THE CONNECTION","steps":[{"label":"Door edge"},{"label":"Projection"},{"label":"Door gap"},{"label":"Receiving pocket"},{"label":"Sound support"}],"bed":"img/rayvault_rv_108_fix2.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_109" from={22389} durationInFrames={209}><AbsoluteFill><RayChecklist durationInFrames={209} {...({"title":"Check the actual installation","kicker":"RAY’S CHECK","items":[{"text":"Proper door fit"},{"text":"Specified receiving clearance"},{"text":"Full bolt travel"}],"bed":"img/rayvault_rv_109.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_110" from={22598} durationInFrames={221}><AbsoluteFill><Foto src="img/rayvault_rv_110.jpg" seed={22598} /></AbsoluteFill></Sequence>
<Sequence key="rv_111" from={22819} durationInFrames={151}><AbsoluteFill><Foto src="img/rayvault_rv_111.jpg" seed={22819} /></AbsoluteFill></Sequence>
<Sequence key="rv_112" from={22970} durationInFrames={201}><AbsoluteFill><ProcessChips durationInFrames={201} {...({"title":"In the right order","kicker":"PRACTICAL CHECKS","steps":[{"title":"Strike position"},{"title":"Hinge sag"},{"title":"Seal fit"}],"bed":"img/rayvault_rv_112_fix2.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_112b" from={23171} durationInFrames={194}><AbsoluteFill><Foto src="img/rayvault_rv_112b.jpg" seed={23171} /></AbsoluteFill></Sequence>
<Sequence key="rv_113" from={23365} durationInFrames={232}><AbsoluteFill><Foto src="img/rayvault_rv_113_fix2.jpg" seed={23365} /></AbsoluteFill></Sequence>
<Sequence key="rv_114" from={23597} durationInFrames={209}><AbsoluteFill><Foto src="img/rayvault_rv_114.jpg" seed={23597} /></AbsoluteFill></Sequence>
<Sequence key="rv_115" from={23806} durationInFrames={179}><AbsoluteFill><Foto src="img/rayvault_rv_115.jpg" seed={23806} /></AbsoluteFill></Sequence>
<Sequence key="rv_116" from={23985} durationInFrames={131}><AbsoluteFill><Foto src="img/rayvault_m_09_r1.jpg" seed={23985} /></AbsoluteFill></Sequence>
<Sequence key="rv_116b" from={24116} durationInFrames={222}><AbsoluteFill><Foto src="img/rayvault_rv_116b_fix2.jpg" seed={24116} /></AbsoluteFill></Sequence>
<Sequence key="rv_117" from={24338} durationInFrames={160}><AbsoluteFill><Foto src="img/rayvault_rv_117.jpg" seed={24338} /></AbsoluteFill></Sequence>
<Sequence key="rv_118" from={24498} durationInFrames={120}><AbsoluteFill><Foto src="img/rayvault_h_11_fix3.jpg" seed={24498} /></AbsoluteFill></Sequence>
<Sequence key="rv_119" from={24618} durationInFrames={192}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_rv_119.mp4")} playbackRate={0.789062} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_120" from={24810} durationInFrames={105}><AbsoluteFill><Foto src="img/rayvault_rv_120.jpg" seed={24810} /></AbsoluteFill></Sequence>
<Sequence key="rv_121" from={24915} durationInFrames={111}><AbsoluteFill><Foto src="img/rayvault_rv_121.jpg" seed={24915} /></AbsoluteFill></Sequence>
<Sequence key="rv_122" from={25026} durationInFrames={211}><RayvaultMechanicalRepair kind="rubbing" /></Sequence>
<Sequence key="rv_123" from={25237} durationInFrames={306}><AbsoluteFill><Foto src="img/rayvault_rv_123_fix1.jpg" seed={25237} /></AbsoluteFill></Sequence>
<Sequence key="rv_124" from={25543} durationInFrames={122}><AbsoluteFill><Foto src="img/rayvault_rv_124.jpg" seed={25543} /></AbsoluteFill></Sequence>
<Sequence key="rv_125" from={25665} durationInFrames={216}><AbsoluteFill><Foto src="img/rayvault_rv_125.jpg" seed={25665} /></AbsoluteFill></Sequence>
<Sequence key="rv_125b" from={25881} durationInFrames={91}><AbsoluteFill><Foto src="img/rayvault_rv_125b.jpg" seed={25881} /></AbsoluteFill></Sequence>
<Sequence key="rv_126" from={25972} durationInFrames={156}><AbsoluteFill><Foto src="img/rayvault_rv_126_fix2.jpg" seed={25972} /></AbsoluteFill></Sequence>
<Sequence key="rv_127" from={26128} durationInFrames={304}><AbsoluteFill><Foto src="img/rayvault_rv_127_fix1.jpg" seed={26128} /></AbsoluteFill></Sequence>
<Sequence key="rv_128" from={26432} durationInFrames={211}><AbsoluteFill><Foto src="img/rayvault_m_10.jpg" seed={26432} /></AbsoluteFill></Sequence>
<Sequence key="rv_128b" from={26643} durationInFrames={226}><AbsoluteFill><Foto src="img/rayvault_rv_128b.jpg" seed={26643} /></AbsoluteFill></Sequence>
<Sequence key="rv_129" from={26869} durationInFrames={98}><AbsoluteFill><MythTruth durationInFrames={98} {...({"myth":"Material name settles the question","truth":"Inspect the complete assembly","kicker":"CHECK THE ASSUMPTION","bed":"img/rayvault_rv_129.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_130" from={26967} durationInFrames={269}><AbsoluteFill><RayChecklist durationInFrames={269} {...({"title":"Check the actual installation","kicker":"RAY’S CHECK","items":[{"text":"Exterior suitability"},{"text":"Door condition"},{"text":"Lock area"},{"text":"Hinges and frame"}],"bed":"img/rayvault_rv_130.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_130b" from={27236} durationInFrames={71}><AbsoluteFill><Foto src="img/rayvault_rv_130b.jpg" seed={27236} /></AbsoluteFill></Sequence>
<Sequence key="rv_131" from={27307} durationInFrames={221}><AbsoluteFill><Foto src="img/rayvault_rv_131.jpg" seed={27307} /></AbsoluteFill></Sequence>
<Sequence key="rv_131b" from={27528} durationInFrames={134}><AbsoluteFill><Foto src="img/rayvault_rv_131b.jpg" seed={27528} /></AbsoluteFill></Sequence>
<Sequence key="rv_132" from={27662} durationInFrames={132}><AbsoluteFill><Foto src="img/rayvault_rv_132_fix1.jpg" seed={27662} /></AbsoluteFill></Sequence>
<Sequence key="rv_133" from={27794} durationInFrames={163}><AbsoluteFill><Foto src="img/rayvault_rv_133.jpg" seed={27794} /></AbsoluteFill></Sequence>
<Sequence key="rv_134" from={27957} durationInFrames={239}><AbsoluteFill><Foto src="img/rayvault_rv_134.jpg" seed={27957} /></AbsoluteFill></Sequence>
<Sequence key="rv_135" from={28196} durationInFrames={188}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_rv_135.mp4")} playbackRate={0.805851} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_136" from={28384} durationInFrames={164}><AbsoluteFill><Foto src="img/rayvault_rv_136.jpg" seed={28384} /></AbsoluteFill></Sequence>
<Sequence key="rv_137" from={28548} durationInFrames={122}><AbsoluteFill><CheckCard durationInFrames={122} {...({"title":"Check the actual installation","kicker":"RAY’S CHECK","items":[{"text":"Wood can split"},{"text":"Steel needs a sound frame"},{"text":"Fiberglass needs correct hardware"}],"bed":"img/rayvault_rv_137_fix1.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_137b" from={28670} durationInFrames={138}><AbsoluteFill><Foto src="img/rayvault_rv_137b.jpg" seed={28670} /></AbsoluteFill></Sequence>
<Sequence key="rv_137c" from={28808} durationInFrames={150}><AbsoluteFill><Foto src="img/rayvault_rv_137c.jpg" seed={28808} /></AbsoluteFill></Sequence>
<Sequence key="rv_138" from={28958} durationInFrames={256}><AbsoluteFill><Foto src="img/rayvault_rv_138_fix1.jpg" seed={28958} /></AbsoluteFill></Sequence>
<Sequence key="rv_139" from={29214} durationInFrames={150}><AbsoluteFill><PullQuote durationInFrames={150} {...({"quote":"Keep the sound door you have.","attrib":"Ray Kessler","bed":"img/rayvault_rv_139.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_140" from={29364} durationInFrames={160}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_h_13.mp4")} playbackRate={0.946875} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_141" from={29524} durationInFrames={294}><AbsoluteFill><Foto src="img/rayvault_rv_141.jpg" seed={29524} /></AbsoluteFill></Sequence>
<Sequence key="rv_142" from={29818} durationInFrames={229}><AbsoluteFill><Foto src="img/rayvault_m_11.jpg" seed={29818} /></AbsoluteFill></Sequence>
<Sequence key="rv_143" from={30047} durationInFrames={189}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_rv_143.mp4")} playbackRate={0.801587} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_144" from={30236} durationInFrames={276}><AbsoluteFill><Foto src="img/rayvault_rv_144.jpg" seed={30236} /></AbsoluteFill></Sequence>
<Sequence key="rv_145" from={30512} durationInFrames={79}><AbsoluteFill><Foto src="img/rayvault_rv_145.jpg" seed={30512} /></AbsoluteFill></Sequence>
<Sequence key="rv_146" from={30591} durationInFrames={225}><AbsoluteFill><Foto src="img/rayvault_rv_146_fix1.jpg" seed={30591} /></AbsoluteFill></Sequence>
<Sequence key="rv_147" from={30816} durationInFrames={204}><AbsoluteFill><Foto src="img/rayvault_rv_147.jpg" seed={30816} /></AbsoluteFill></Sequence>
<Sequence key="rv_147b" from={31020} durationInFrames={171}><AbsoluteFill><Foto src="img/rayvault_rv_147b_fix1.jpg" seed={31020} /></AbsoluteFill></Sequence>
<Sequence key="rv_148" from={31191} durationInFrames={231}><AbsoluteFill><CheckCard durationInFrames={231} {...({"title":"Check the actual installation","kicker":"RAY’S CHECK","items":[{"text":"Glass"},{"text":"Retention"},{"text":"Complete assembly"}],"bed":"img/rayvault_rv_148.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_149" from={31422} durationInFrames={168}><AbsoluteFill><SplitVs durationInFrames={168} {...({"leftLabel":"Decorative film","leftValue":"Privacy","rightLabel":"Glazing system","rightValue":"Assembly","verdict":"Assess glass and retention","bed":"img/rayvault_m_12.jpg","leftImage":"img/rayvault_rv_149_left.jpg","rightImage":"img/rayvault_rv_149_right.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_150" from={31590} durationInFrames={206}><AbsoluteFill><Foto src="img/rayvault_rv_150.jpg" seed={31590} /></AbsoluteFill></Sequence>
<Sequence key="rv_150b" from={31796} durationInFrames={102}><AbsoluteFill><Foto src="img/rayvault_rv_150b.jpg" seed={31796} /></AbsoluteFill></Sequence>
<Sequence key="rv_151" from={31898} durationInFrames={223}><AbsoluteFill><Foto src="img/rayvault_rv_151_fix1.jpg" seed={31898} /></AbsoluteFill></Sequence>
<Sequence key="rv_152" from={32121} durationInFrames={176}><AbsoluteFill><Foto src="img/rayvault_rv_152.jpg" seed={32121} /></AbsoluteFill></Sequence>
<Sequence key="rv_152b" from={32297} durationInFrames={132}><AbsoluteFill><Foto src="img/rayvault_rv_152b.jpg" seed={32297} /></AbsoluteFill></Sequence>
<Sequence key="rv_153" from={32429} durationInFrames={127}><AbsoluteFill><Foto src="img/rayvault_rv_153.jpg" seed={32429} /></AbsoluteFill></Sequence>
<Sequence key="rv_154" from={32556} durationInFrames={175}><AbsoluteFill><MythTruth durationInFrames={175} {...({"myth":"Privacy reinforces the glass","truth":"Have the glazing assessed","kicker":"CHECK THE ASSUMPTION","bed":"img/rayvault_rv_154.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_155" from={32731} durationInFrames={103}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_rv_155.mp4")} playbackRate={1.000000} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_156" from={32834} durationInFrames={90}><AbsoluteFill><Foto src="img/rayvault_rv_156.jpg" seed={32834} /></AbsoluteFill></Sequence>
<Sequence key="rv_157" from={32924} durationInFrames={183}><AbsoluteFill><Foto src="img/rayvault_rv_157.jpg" seed={32924} /></AbsoluteFill></Sequence>
<Sequence key="rv_158" from={33107} durationInFrames={150}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_h_14.mp4")} playbackRate={1.000000} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_159" from={33257} durationInFrames={250}><AbsoluteFill><Foto src="img/rayvault_rv_159.jpg" seed={33257} /></AbsoluteFill></Sequence>
<Sequence key="rv_160" from={33507} durationInFrames={96}><AbsoluteFill><Foto src="img/rayvault_rv_160.jpg" seed={33507} /></AbsoluteFill></Sequence>
<Sequence key="rv_161" from={33603} durationInFrames={161}><AbsoluteFill><Foto src="img/rayvault_rv_161_fix2.jpg" seed={33603} /></AbsoluteFill></Sequence>
<Sequence key="rv_162" from={33764} durationInFrames={129}><AbsoluteFill><ProcessChips durationInFrames={129} {...({"title":"In the right order","kicker":"PRACTICAL CHECKS","steps":[{"title":"Sound frame"},{"title":"Mechanical fit"},{"title":"Convenience"}],"bed":"img/rayvault_rv_162_fix1.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_163" from={33893} durationInFrames={128}><RayvaultMechanicalRepair kind="keypad" /></Sequence>
<Sequence key="rv_163b" from={34021} durationInFrames={247}><AbsoluteFill><Foto src="img/rayvault_rv_163b_fix1.jpg" seed={34021} /></AbsoluteFill></Sequence>
<Sequence key="rv_164" from={34268} durationInFrames={180}><AbsoluteFill><MythTruth durationInFrames={180} {...({"myth":"Smart hardware repairs a weak frame","truth":"Prepare the doorway first","kicker":"CHECK THE ASSUMPTION","bed":"img/rayvault_rv_164.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_165" from={34448} durationInFrames={80}><AbsoluteFill><Foto src="img/rayvault_rv_165.jpg" seed={34448} /></AbsoluteFill></Sequence>
<Sequence key="rv_165b" from={34528} durationInFrames={230}><AbsoluteFill><RayChecklist durationInFrames={230} {...({"title":"Check the actual installation","kicker":"RAY’S CHECK","items":[{"text":"Physical hardware"},{"text":"Compatibility"},{"text":"Power arrangements"},{"text":"Inside operation"}],"bed":"img/rayvault_rv_165b.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_165c" from={34758} durationInFrames={98}><AbsoluteFill><Foto src="img/rayvault_rv_165c_fix2.jpg" seed={34758} /></AbsoluteFill></Sequence>
<Sequence key="rv_166" from={34856} durationInFrames={121}><AbsoluteFill><Foto src="img/rayvault_rv_166.jpg" seed={34856} /></AbsoluteFill></Sequence>
<Sequence key="rv_166b" from={34977} durationInFrames={196}><RayvaultMechanicalRepair kind="instructions" /></Sequence>
<Sequence key="rv_167" from={35173} durationInFrames={103}><AbsoluteFill><Foto src="img/rayvault_rv_167_fix1.jpg" seed={35173} /></AbsoluteFill></Sequence>
<Sequence key="rv_168" from={35276} durationInFrames={232}><AbsoluteFill><Foto src="img/rayvault_rv_168_fix1.jpg" seed={35276} /></AbsoluteFill></Sequence>
<Sequence key="rv_169" from={35508} durationInFrames={152}><AbsoluteFill><PullQuote durationInFrames={152} {...({"quote":"The doorway does its own work.","attrib":"Ray Kessler","bed":"img/rayvault_rv_169.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_170" from={35660} durationInFrames={174}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_h_15.mp4")} playbackRate={0.870690} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_171" from={35834} durationInFrames={145}><AbsoluteFill><Foto src="img/rayvault_rv_171_fix1.jpg" seed={35834} /></AbsoluteFill></Sequence>
<Sequence key="rv_172" from={35979} durationInFrames={221}><AbsoluteFill><CheckCard durationInFrames={221} {...({"title":"Check the actual installation","kicker":"RAY’S CHECK","items":[{"text":"Floor surface"},{"text":"Door arrangement"},{"text":"Positioning"}],"bed":"img/rayvault_rv_172_fix1.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_173" from={36200} durationInFrames={250}><RayvaultMechanicalRepair kind="brace" /></Sequence>
<Sequence key="rv_174" from={36450} durationInFrames={180}><AbsoluteFill><Foto src="img/rayvault_rv_174_fix1.jpg" seed={36450} /></AbsoluteFill></Sequence>
<Sequence key="rv_175" from={36630} durationInFrames={240}><AbsoluteFill><Foto src="img/rayvault_rv_175_fix1.jpg" seed={36630} /></AbsoluteFill></Sequence>
<Sequence key="rv_176" from={36870} durationInFrames={95}><AbsoluteFill><Foto src="img/rayvault_rv_176.jpg" seed={36870} /></AbsoluteFill></Sequence>
<Sequence key="rv_177" from={36965} durationInFrames={256}><AbsoluteFill><Foto src="img/rayvault_rv_177.jpg" seed={36965} /></AbsoluteFill></Sequence>
<Sequence key="rv_178" from={37221} durationInFrames={255}><AbsoluteFill><MythTruth durationInFrames={255} {...({"myth":"One demonstration fits every entrance","truth":"Assess your device and installation","kicker":"CHECK THE ASSUMPTION","bed":"img/rayvault_rv_178_fix1.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_179" from={37476} durationInFrames={167}><AbsoluteFill><Foto src="img/rayvault_rv_179_fix1.jpg" seed={37476} /></AbsoluteFill></Sequence>
<Sequence key="rv_180" from={37643} durationInFrames={253}><AbsoluteFill><Foto src="img/rayvault_rv_180.jpg" seed={37643} /></AbsoluteFill></Sequence>
<Sequence key="rv_181" from={37896} durationInFrames={194}><AbsoluteFill><Foto src="img/rayvault_rv_181_fix1.jpg" seed={37896} /></AbsoluteFill></Sequence>
<Sequence key="rv_182" from={38090} durationInFrames={175}><AbsoluteFill><Foto src="img/rayvault_rv_182.jpg" seed={38090} /></AbsoluteFill></Sequence>
<Sequence key="rv_183" from={38265} durationInFrames={280}><AbsoluteFill><ProcessChips durationInFrames={280} {...({"title":"In the right order","kicker":"PRACTICAL CHECKS","steps":[{"title":"Working door"},{"title":"Compatible device"},{"title":"Easy exit"}],"bed":"img/rayvault_rv_183.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_184" from={38545} durationInFrames={277}><AbsoluteFill><Foto src="img/rayvault_rv_184_fix1.jpg" seed={38545} /></AbsoluteFill></Sequence>
<Sequence key="rv_185" from={38822} durationInFrames={154}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_h_16.mp4")} playbackRate={0.983766} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_186" from={38976} durationInFrames={163}><AbsoluteFill><Foto src="img/rayvault_rv_186.jpg" seed={38976} /></AbsoluteFill></Sequence>
<Sequence key="rv_186b" from={39139} durationInFrames={158}><AbsoluteFill><Foto src="img/rayvault_rv_186b.jpg" seed={39139} /></AbsoluteFill></Sequence>
<Sequence key="rv_187" from={39297} durationInFrames={114}><AbsoluteFill><Foto src="img/rayvault_rv_187.jpg" seed={39297} /></AbsoluteFill></Sequence>
<Sequence key="rv_188" from={39411} durationInFrames={175}><AbsoluteFill><Foto src="img/rayvault_rv_188.jpg" seed={39411} /></AbsoluteFill></Sequence>
<Sequence key="rv_189" from={39586} durationInFrames={248}><AbsoluteFill><Foto src="img/rayvault_rv_189.jpg" seed={39586} /></AbsoluteFill></Sequence>
<Sequence key="rv_190" from={39834} durationInFrames={127}><AbsoluteFill><Foto src="img/rayvault_rv_190.jpg" seed={39834} /></AbsoluteFill></Sequence>
<Sequence key="rv_190b" from={39961} durationInFrames={193}><AbsoluteFill><Foto src="img/rayvault_rv_190b.jpg" seed={39961} /></AbsoluteFill></Sequence>
<Sequence key="rv_191" from={40154} durationInFrames={199}><AbsoluteFill><Foto src="img/rayvault_rv_191_fix1.jpg" seed={40154} /></AbsoluteFill></Sequence>
<Sequence key="rv_192" from={40353} durationInFrames={146}><AbsoluteFill><Foto src="img/rayvault_rv_192.jpg" seed={40353} /></AbsoluteFill></Sequence>
<Sequence key="rv_193" from={40499} durationInFrames={124}><AbsoluteFill><SplitVs durationInFrames={124} {...({"leftLabel":"Wood frame","leftValue":"Wood fastener","rightLabel":"Other systems","rightValue":"Specified fixings","verdict":"Attachment depends on material","bed":"img/rayvault_rv_193.jpg","leftImage":"img/rayvault_rv_193_left.jpg","rightImage":"img/rayvault_rv_193_right.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_193b" from={40623} durationInFrames={294}><AbsoluteFill><Foto src="img/rayvault_rv_193b.jpg" seed={40623} /></AbsoluteFill></Sequence>
<Sequence key="rv_194" from={40917} durationInFrames={130}><AbsoluteFill><MythTruth durationInFrames={130} {...({"myth":"Wood screws fit every frame","truth":"Use the system’s specified attachment","kicker":"CHECK THE ASSUMPTION","bed":"img/rayvault_rv_194.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_195" from={41047} durationInFrames={191}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_rv_195.mp4")} playbackRate={0.793194} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_196" from={41238} durationInFrames={236}><AbsoluteFill><RayChecklist durationInFrames={236} {...({"title":"Check the actual installation","kicker":"RAY’S CHECK","items":[{"text":"Hidden damage"},{"text":"Moved opening"},{"text":"Uncertain framing"},{"text":"Unidentified hardware"}],"bed":"img/rayvault_rv_196.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_197" from={41474} durationInFrames={296}><AbsoluteFill><Foto src="img/rayvault_rv_197.jpg" seed={41474} /></AbsoluteFill></Sequence>
<Sequence key="rv_198" from={41770} durationInFrames={184}><AbsoluteFill><PullQuote durationInFrames={184} {...({"quote":"Diagnose before you buy.","attrib":"Ray Kessler","bed":"img/rayvault_rv_198.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_199" from={41954} durationInFrames={139}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_rv_199.mp4")} playbackRate={1.000000} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_200" from={42093} durationInFrames={68}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_h_17.mp4")} playbackRate={1.000000} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_200b" from={42161} durationInFrames={91}><AbsoluteFill><ProcessChips durationInFrames={91} {...({"title":"In the right order","kicker":"PRACTICAL CHECKS","steps":[{"title":"Strike"},{"title":"Hinges"}],"bed":"img/rayvault_rv_200b_fix1.jpg","startIndex":1} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_200c" from={42252} durationInFrames={125}><AbsoluteFill><ProcessChips durationInFrames={125} {...({"title":"In the right order","kicker":"PRACTICAL CHECKS","steps":[{"title":"Jamb bottom"},{"title":"Lock edge"}],"bed":"img/rayvault_rv_200c.jpg","startIndex":3} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_201" from={42377} durationInFrames={100}><AbsoluteFill><Foto src="img/rayvault_rv_201_fix1.jpg" seed={42377} /></AbsoluteFill></Sequence>
<Sequence key="rv_202" from={42477} durationInFrames={170}><AbsoluteFill><Foto src="img/rayvault_rv_202_fix4.jpg" seed={42477} /></AbsoluteFill></Sequence>
<Sequence key="rv_203" from={42647} durationInFrames={180}><AbsoluteFill><Foto src="img/rayvault_rv_203.jpg" seed={42647} /></AbsoluteFill></Sequence>
<Sequence key="rv_204" from={42827} durationInFrames={246}><AbsoluteFill><RayChecklist durationInFrames={246} {...({"title":"Check the actual installation","kicker":"RAY’S CHECK","items":[{"text":"Damaged wood"},{"text":"Serious misalignment"},{"text":"Unsuitable exterior door"}],"bed":"img/rayvault_rv_204_fix1.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_204b" from={43073} durationInFrames={114}><AbsoluteFill><Foto src="img/rayvault_rv_204b.jpg" seed={43073} /></AbsoluteFill></Sequence>
<Sequence key="rv_205" from={43187} durationInFrames={216}><RayvaultMechanicalRepair kind="framing" /></Sequence>
<Sequence key="rv_206" from={43403} durationInFrames={247}><AbsoluteFill><Foto src="img/rayvault_rv_206.jpg" seed={43403} /></AbsoluteFill></Sequence>
<Sequence key="rv_207" from={43650} durationInFrames={269}><AbsoluteFill><SplitVs durationInFrames={269} {...({"leftLabel":"Unsuitable lock","leftValue":"Replace","rightLabel":"Sound suitable lock","rightValue":"Keep","verdict":"Condition decides","bed":"img/rayvault_rv_207.jpg","leftImage":"img/rayvault_rv_207_left.jpg","rightImage":"img/rayvault_rv_207_right_fix2.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_208" from={43919} durationInFrames={85}><AbsoluteFill><Foto src="img/rayvault_rv_208.jpg" seed={43919} /></AbsoluteFill></Sequence>
<Sequence key="rv_209" from={44004} durationInFrames={273}><AbsoluteFill><Foto src="img/rayvault_rv_209.jpg" seed={44004} /></AbsoluteFill></Sequence>
<Sequence key="rv_210" from={44277} durationInFrames={194}><AbsoluteFill><Foto src="img/rayvault_rv_210.jpg" seed={44277} /></AbsoluteFill></Sequence>
<Sequence key="rv_211" from={44471} durationInFrames={195}><AbsoluteFill><Foto src="img/rayvault_rv_211.jpg" seed={44471} /></AbsoluteFill></Sequence>
<Sequence key="rv_212" from={44666} durationInFrames={96}><AbsoluteFill><Foto src="img/rayvault_rv_212_fix1.jpg" seed={44666} /></AbsoluteFill></Sequence>
<Sequence key="rv_213" from={44762} durationInFrames={155}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_rv_213.mp4")} playbackRate={0.977419} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_214" from={44917} durationInFrames={251}><AbsoluteFill><Foto src="img/rayvault_rv_214.jpg" seed={44917} /></AbsoluteFill></Sequence>
<Sequence key="rv_215" from={45168} durationInFrames={117}><AbsoluteFill><Foto src="img/rayvault_rv_215.jpg" seed={45168} /></AbsoluteFill></Sequence>
<Sequence key="rv_216" from={45285} durationInFrames={97}><AbsoluteFill><Foto src="img/rayvault_rv_216_fix1.jpg" seed={45285} /></AbsoluteFill></Sequence>
<Sequence key="rv_217" from={45382} durationInFrames={266}><AbsoluteFill><CheckCard durationInFrames={266} {...({"title":"Planning allowances","kicker":"RAY’S CHECK","items":[{"text":"Illustrative examples"},{"text":"Your opening changes the quote"},{"text":"Check included kit parts"}],"bed":"img/rayvault_rv_217_fix1.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_218" from={45648} durationInFrames={191}><AbsoluteFill><Foto src="img/rayvault_rv_218.jpg" seed={45648} /></AbsoluteFill></Sequence>
<Sequence key="rv_219" from={45839} durationInFrames={289}><AbsoluteFill><BigStat durationInFrames={289} {...({"value":"$20–50","unit":"","caption":"Reinforced strike + fasteners","tone":"brass","bed":"img/rayvault_rv_219_fix1.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_220" from={46128} durationInFrames={226}><AbsoluteFill><Foto src="img/rayvault_rv_220_fix2.jpg" seed={46128} /></AbsoluteFill></Sequence>
<Sequence key="rv_221" from={46354} durationInFrames={153}><AbsoluteFill><BigStat durationInFrames={153} {...({"value":"$5–15","unit":"","caption":"Suitable hinge fasteners","tone":"brass","bed":"img/rayvault_rv_221_fix1.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_222" from={46507} durationInFrames={182}><AbsoluteFill><Foto src="img/rayvault_rv_222.jpg" seed={46507} /></AbsoluteFill></Sequence>
<Sequence key="rv_223" from={46689} durationInFrames={164}><AbsoluteFill><BigStat durationInFrames={164} {...({"value":"$0","unit":"","caption":"Keep a sound, suitable deadbolt","tone":"brass","bed":"img/rayvault_rv_223_fix2.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_224" from={46853} durationInFrames={223}><AbsoluteFill><Foto src="img/rayvault_rv_224.jpg" seed={46853} /></AbsoluteFill></Sequence>
<Sequence key="rv_225" from={47076} durationInFrames={98}><AbsoluteFill><BigStat durationInFrames={98} {...({"value":"$10–20","unit":"","caption":"Small fitting supplies","tone":"brass","bed":"img/rayvault_rv_225.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_226" from={47174} durationInFrames={84}><AbsoluteFill><Foto src="img/rayvault_m_14.jpg" seed={47174} /></AbsoluteFill></Sequence>
<Sequence key="rv_226b" from={47258} durationInFrames={114}><AbsoluteFill><BigStat durationInFrames={114} {...({"value":"$35","unit":"","caption":"Example: strike + fasteners","tone":"brass","bed":"img/rayvault_rv_226b_fix2.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_226c" from={47372} durationInFrames={186}><AbsoluteFill><RayChecklist durationInFrames={186} {...({"title":"Complete the example","kicker":"RAY’S CHECK","items":[{"text":"Hinge screws: $10"},{"text":"Deadbolt: $60"},{"text":"Fitting supplies: $10"}],"bed":"img/rayvault_rv_226c.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_227" from={47558} durationInFrames={192}><AbsoluteFill><BigStat durationInFrames={192} {...({"value":"$115","unit":"","caption":"Example materials total; existing tools","tone":"brass","bed":"img/rayvault_rv_227.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_228" from={47750} durationInFrames={246}><AbsoluteFill><Foto src="img/rayvault_rv_228_fix2.jpg" seed={47750} /></AbsoluteFill></Sequence>
<Sequence key="rv_229" from={47996} durationInFrames={300}><AbsoluteFill><BigStat durationInFrames={300} {...({"value":"$235","unit":"","caption":"Example: $160 − $35 + $110","tone":"brass","bed":"img/rayvault_rv_229.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_230" from={48296} durationInFrames={128}><AbsoluteFill><SplitVs durationInFrames={128} {...({"leftLabel":"Small strike","leftValue":"$35","rightLabel":"Jamb system","rightValue":"$110","verdict":"Replace one line — never count both","bed":"img/rayvault_rv_230_fix2.jpg","leftImage":"img/rayvault_rv_230_left_fix1.jpg","rightImage":"img/rayvault_rv_230_right_fix1.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_231" from={48424} durationInFrames={122}><AbsoluteFill><ProcessChips durationInFrames={122} {...({"title":"In the right order","kicker":"PRACTICAL CHECKS","steps":[{"title":"Hardware"},{"title":"Glazing"},{"title":"Complete door"}],"bed":"img/rayvault_rv_231_fix1.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_232" from={48546} durationInFrames={164}><AbsoluteFill><Foto src="img/rayvault_rv_232.jpg" seed={48546} /></AbsoluteFill></Sequence>
<Sequence key="rv_233" from={48710} durationInFrames={189}><AbsoluteFill><Foto src="img/rayvault_rv_233.jpg" seed={48710} /></AbsoluteFill></Sequence>
<Sequence key="rv_234" from={48899} durationInFrames={300}><AbsoluteFill><BigStat durationInFrames={300} {...({"value":"$585","unit":"","caption":"Illustration only: $235 + $350 glazing","tone":"brass","bed":"img/rayvault_rv_234_fix1.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_235" from={49199} durationInFrames={180}><AbsoluteFill><Foto src="img/rayvault_rv_235.jpg" seed={49199} /></AbsoluteFill></Sequence>
<Sequence key="rv_236" from={49379} durationInFrames={70}><AbsoluteFill><Foto src="img/rayvault_rv_236_fix1.jpg" seed={49379} /></AbsoluteFill></Sequence>
<Sequence key="rv_236b" from={49449} durationInFrames={282}><AbsoluteFill><RayChecklist durationInFrames={282} {...({"title":"Outside these totals","kicker":"RAY’S CHECK","items":[{"text":"Installation labor"},{"text":"Structural repairs"},{"text":"Tools and tax"},{"text":"Replacement door"}],"bed":"img/rayvault_rv_236b.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_237" from={49731} durationInFrames={97}><AbsoluteFill><PullQuote durationInFrames={97} {...({"quote":"Fix the weakness you found.","attrib":"Ray Kessler","bed":"img/rayvault_rv_237.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_238" from={49828} durationInFrames={212}><AbsoluteFill><Foto src="img/rayvault_rv_238.jpg" seed={49828} /></AbsoluteFill></Sequence>
<Sequence key="rv_239" from={50040} durationInFrames={123}><AbsoluteFill><Foto src="img/rayvault_rv_239_fix1.jpg" seed={50040} /></AbsoluteFill></Sequence>
<Sequence key="rv_240" from={50163} durationInFrames={222}><AbsoluteFill><ProcessChips durationInFrames={222} {...({"title":"In the right order","kicker":"PRACTICAL CHECKS","steps":[{"title":"Inspect"},{"title":"Measure"},{"title":"Choose"},{"title":"Get help"}],"bed":"img/rayvault_rv_240.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_241" from={50385} durationInFrames={95}><AbsoluteFill><Foto src="img/rayvault_rv_241_fix1.jpg" seed={50385} /></AbsoluteFill></Sequence>
<Sequence key="rv_242" from={50480} durationInFrames={218}><AbsoluteFill><Foto src="img/rayvault_rv_242_fix1.jpg" seed={50480} /></AbsoluteFill></Sequence>
<Sequence key="rv_243" from={50698} durationInFrames={231}><AbsoluteFill><Foto src="img/rayvault_rv_243_fix1.jpg" seed={50698} /></AbsoluteFill></Sequence>
<Sequence key="rv_244" from={50929} durationInFrames={187}><AbsoluteFill><Foto src="img/rayvault_rv_244.jpg" seed={50929} /></AbsoluteFill></Sequence>
<Sequence key="rv_245" from={51116} durationInFrames={112}><AbsoluteFill><Foto src="img/rayvault_rv_245.jpg" seed={51116} /></AbsoluteFill></Sequence>
<Sequence key="rv_246" from={51228} durationInFrames={71}><AbsoluteFill><Foto src="img/rayvault_rv_246.jpg" seed={51228} /></AbsoluteFill></Sequence>
<Sequence key="rv_247" from={51299} durationInFrames={157}><AbsoluteFill><Foto src="img/rayvault_rv_247_fix1.jpg" seed={51299} /></AbsoluteFill></Sequence>
<Sequence key="rv_248" from={51456} durationInFrames={191}><AbsoluteFill><RayChecklist durationInFrames={191} {...({"title":"Final operating check","kicker":"RAY’S CHECK","items":[{"text":"Rubbing"},{"text":"Loose hardware"},{"text":"Incomplete bolt travel"}],"bed":"img/rayvault_rv_248_fix2.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="rv_249" from={51647} durationInFrames={49}><AbsoluteFill><Foto src="img/rayvault_rv_249_fix1.jpg" seed={51647} /></AbsoluteFill></Sequence>
<Sequence key="rv_250" from={51696} durationInFrames={105}><AbsoluteFill><Foto src="img/rayvault_rv_250.jpg" seed={51696} /></AbsoluteFill></Sequence>
<Sequence key="rv_251" from={51801} durationInFrames={63}><AbsoluteFill><OffthreadVideo muted src={staticFile("broll/rayvault_h_18.mp4")} playbackRate={1.000000} style={{width:'100%',height:'100%',objectFit:'cover'}} /></AbsoluteFill></Sequence>
<Sequence key="rv_252" from={51864} durationInFrames={125}><AbsoluteFill><Foto src="img/rayvault_rv_252.jpg" seed={51864} /></AbsoluteFill></Sequence>
<Sequence key="rv_253" from={51989} durationInFrames={60}><AbsoluteFill><Foto src="img/rayvault_rv_253.jpg" seed={51989} /></AbsoluteFill></Sequence>
<Sequence key="rv_254" from={52049} durationInFrames={101}><AbsoluteFill><Foto src="img/rayvault_rv_254.jpg" seed={52049} /></AbsoluteFill></Sequence>
<Sequence key="rv_255" from={52150} durationInFrames={169}><AbsoluteFill><Foto src="img/rayvault_rv_255.jpg" seed={52150} /></AbsoluteFill></Sequence>
<Sequence key="rv_256" from={52319} durationInFrames={85}><AbsoluteFill><PullQuote durationInFrames={85} {...({"quote":"Start with what holds the lock to the house.","attrib":"Ray Kessler","bed":"img/rayvault_rv_256_fix2.jpg"} as any)} /></AbsoluteFill></Sequence>
<Sequence key="over_rv_220_overlay" from={46128} durationInFrames={226} layout="none"><StatBug durationInFrames={226} {...({"value":"$75–200+","unit":"","caption":"More extensive jamb system","tone":"brass","series":"ILLUSTRATIVE MATERIAL ALLOWANCE"} as any)} /></Sequence>
<Sequence key="over_rv_222_overlay" from={46507} durationInFrames={182} layout="none"><StatBug durationInFrames={182} {...({"value":"$40–120","unit":"","caption":"Conventional replacement deadbolt","tone":"brass","series":"ILLUSTRATIVE MATERIAL ALLOWANCE"} as any)} /></Sequence>
<Sequence key="over_rv_224_overlay" from={46853} durationInFrames={223} layout="none"><StatBug durationInFrames={223} {...({"value":"$30–70","unit":"","caption":"Door-edge reinforcement — if needed","tone":"brass","series":"ILLUSTRATIVE MATERIAL ALLOWANCE"} as any)} /></Sequence>
<Sequence key="over_rv_228_overlay" from={47750} durationInFrames={246} layout="none"><StatBug durationInFrames={246} {...({"value":"$160","unit":"","caption":"Example: $115 + $45 suitable sleeve","tone":"brass","series":"ILLUSTRATIVE MATERIAL ALLOWANCE"} as any)} /></Sequence>
<Sequence key="over_guide_early" from={982} durationInFrames={1340} layout="none"><RayCta durationInFrames={1340} {...({"title":"The One Afternoon Door","sub":"Know what to check before you buy another lock.","domain":"raykessler.vercel.app","eyebrow":"CHECK YOUR DOOR TODAY","action":"SCAN TO SEE THE GUIDE","qr":"qr_rayvault.png","showQr":true} as any)} /></Sequence>
<Sequence key="over_guide_closing" from={50385} durationInFrames={1860} layout="none"><RayCta durationInFrames={1860} {...({"title":"The One Afternoon Door","sub":"Know what to check before you buy another lock.","domain":"raykessler.vercel.app","eyebrow":"CHECK YOUR DOOR TODAY","action":"SCAN TO SEE THE GUIDE","qr":"qr_rayvault.png","showQr":true} as any)} /></Sequence>
{audioEnabled&&<Audio src={staticFile('rayvault_fish.wav')} />}
</AbsoluteFill>;
