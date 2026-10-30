// l9229a «Brother» · los componentes únicos (uno por minuto): objetos FOTORREALES recortados (agnes → rembg, public/img/<slug>/cut)
// animados por código sobre la mesa amarilla de Lou. Regla: objeto héroe grande y entero, acción física desde el primer segundo,
// cámara curva (Cam), sombra de contacto, la palabra grande sólo dentro de la escena. Ningún mecanismo se repite en la tanda l92.
import React from "react";
import { H, HAND, cl, eio, phys } from "./hkit";
import { Odo, Sello, Puff, CShadow, Grain } from "./obj";
import { S, D, rnd, bt, C, SER, Prop, Drop, Dust, Cam, Mesa, Word, Glow, Luz, land, swing } from "./pk";

// la mesa de fórmica amarilla de la cocina de Lou (con el borde cromado y la esquina saltada)
const Formica: React.FC<{ y0?: number; chip?: number }> = ({ y0 = 760, chip = 1 }) => <>
  <div style={{ position: "absolute", left: -300, top: y0, width: 2520, height: 1200 - y0, transformOrigin: "50% 0", transform: "perspective(900px) rotateX(40deg)",
    background: "radial-gradient(ellipse 50% 40% at 40% 20%, rgba(255,250,220,.35), transparent 70%), repeating-radial-gradient(circle at 30% 40%, rgba(120,90,20,.05) 0 2px, transparent 2px 9px), linear-gradient(180deg,#e9c457,#c99a2e)" }} />
  <div style={{ position: "absolute", left: 0, top: y0 - 6, width: 1920, height: 14, background: "linear-gradient(#f4f4f4,#8a8a8a 50%,#3a3a3a)", boxShadow: "0 6px 10px rgba(0,0,0,.4)" }} />
  {chip > 0 && <div style={{ position: "absolute", left: 1720, top: y0 - 6, width: 90 * chip, height: 40 * chip, background: "#5a4a2a", clipPath: "polygon(0 0,100% 0,70% 100%,20% 60%)" }} />}
</>;
// mano de papel rayado con letra a mano que se escribe sola (clip de izquierda a derecha)
const Ink: React.FC<{ tt: number; at: number; dur: number; x: number; y: number; txt: string; size?: number; col?: string; w?: number }> = ({ tt, at, dur, x, y, txt, size = 52, col = "#22314f", w = 900 }) => {
  const p = cl((tt - at) / dur); if (p <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, width: w, fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, lineHeight: 1.12, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>{txt}</div>;
};
const NIGHT = "radial-gradient(ellipse 60% 50% at 50% 30%, #3a2e1e, #0c0906 75%)";
const SNOW = "linear-gradient(#5a6672 0%,#8a96a2 45%,#c8d2da 70%,#e8eef2 100%)";

// m0 · el teléfono boca arriba: la lista de contactos baja, frena en BROTHER… y sigue de largo
const HPhoneScroll: C = ({ t, h }) => <S t={t} h={h} bg={NIGHT} f={(tt) => {
  const d = D(h), names = ["Dentist · Dr. Hale", "Don · Gutters", "Doris (church)", "Earl's widow", "BROTHER", "Feed store", "Gas co-op", "Harold", "Hardware"];
  const v = tt < 2.2 ? tt * 2.0 : tt < 4.6 ? 4.4 + (tt - 2.2) * 0.12 : 4.69 + (tt - 4.6) * 1.6, off = Math.min(v, 7.2) * 96;
  const slow = cl(1 - Math.abs(tt - 3.4) / 1.4);
  return <Cam tt={tt} d={d} z={0.09} fy={560}>
    <Glow x={960} y={120} r={520} o={0.9} />
    <Formica y0={640} chip={0} />
    <div style={{ position: "absolute", left: 960, top: 70, transform: "translate(-50%,0) perspective(1800px) rotateX(24deg)", transformOrigin: "50% 100%" }}>
      <div style={{ width: 470, height: 900, borderRadius: 60, background: "linear-gradient(135deg,#2a2a2e,#0a0a0c)", padding: 22, boxShadow: "0 60px 80px rgba(0,0,0,.7), inset 0 0 0 3px #4a4a50" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 42, overflow: "hidden", background: "#f2f2f4", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 120 - off }}>{names.map((n, i) => <div key={i} style={{ height: 96, display: "flex", alignItems: "center", gap: 24, padding: "0 30px", borderBottom: "1px solid #d8d8dc", background: n === "BROTHER" ? `rgba(255,190,90,${0.25 + 0.5 * slow})` : "transparent" }}>
            <div style={{ width: 58, height: 58, borderRadius: "50%", background: ["#8aa","#a98","#9a8","#89a","#c96","#9aa","#a99","#99a","#aa9"][i], color: "#fff", fontFamily: SER, fontWeight: 900, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>{n[0]}</div>
            <div style={{ fontFamily: SER, fontSize: 40, fontWeight: n === "BROTHER" ? 900 : 500, color: "#1a1a1e" }}>{n}</div></div>)}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 110, background: "#f2f2f4", borderBottom: "2px solid #ccc", fontFamily: SER, fontWeight: 900, fontSize: 52, padding: "34px 30px", color: "#111" }}>Contacts</div>
        </div>
      </div>
    </div>
    <Luz />
  </Cam>;
}} />;

// m0-1 · la mesa de la cena: cuatro sillas cromadas alrededor; tres se deslizan hacia atrás y se apagan, queda una
const HEmptyChairs: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), X = [420, 780, 1140, 1500];
  return <Cam tt={tt} d={d} z={0.06}>
    <Glow x={960} y={200} r={600} o={0.7} />
    <div style={{ position: "absolute", left: 300, top: 690, width: 1320, height: 70, borderRadius: 8, background: "linear-gradient(#efcb5c,#c99a2e)", boxShadow: "0 10px 0 #9a9a9a, 0 30px 50px rgba(0,0,0,.6)" }} />
    {X.map((x, i) => { const L = land(tt, 0.15 + i * 0.25, 600), go = i < 3 ? eio(tt, 2.2 + i * 0.9, 3.4 + i * 0.9) : 0;
      return L.on && <Prop key={i} id="chrome_chair" x={x + (i < 2 ? -1 : 1) * 260 * go} y={1000 + L.dy - 120 * go} w={340 * (1 - 0.35 * go)} sq={L.sq} o={1 - 0.85 * go} flip={i % 2 === 1} />; })}
    <Word tt={tt} at={d - 2.2} x={1500} y={300} txt="just me" size={110} r={-3} />
  </Cam>;
}} />;

// m1 · la caja que todavía no abrió: la tapa se levanta apenas y sale luz por la rendija, vuelve a cerrar
const HBoxTease: C = ({ t, h }) => <S t={t} h={h} bg={NIGHT} f={(tt) => {
  const d = D(h), lift = Math.max(0, Math.sin(cl((tt - 1.0) / (d - 2.5)) * Math.PI)) * 0.8;
  return <Cam tt={tt} d={d} z={0.1} fy={600}>
    <Mesa y0={800} />
    <Drop tt={tt} at={0.1} id="cardboard_box" x={960} y={980} w={760} h={500} />
    <Glow x={960} y={720} r={300 + 260 * lift} o={lift * 1.3} col="255,200,120" />
    {Array.from({ length: 12 }, (_, k) => { const p = (tt * 0.35 + k / 12) % 1; return <div key={k} style={{ position: "absolute", left: 760 + (k * 37) % 400, top: 720 - 300 * p, width: 6, height: 6, borderRadius: "50%", background: "rgba(255,220,160,.9)", opacity: lift * (1 - p) }} />; })}
    <Word tt={tt} at={1.6} x={960} y={250} txt="Gus's coat pocket" size={96} r={-2} />
  </Cam>;
}} />;

// m1 · Iowa en la mesa: el contorno del estado se dibuja, el alfiler cae en el pueblo y la ruta pasa UNA vez y se va
const IOWA = "M60,40 L700,40 L712,60 L760,150 L790,200 L760,250 L720,300 L700,380 L660,420 L80,420 L70,380 L40,300 L30,200 L40,100 Z";
const HIowaPin: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), dr = eio(tt, 0.2, 1.8), road = eio(tt, 2.4, d - 1.2);
  return <Cam tt={tt} d={d} z={0.08} fx={1000} fy={520}>
    <Mesa y0={760} tone="#8a5c32" />
    <div style={{ position: "absolute", left: 560, top: 300, width: 820, height: 470, background: "linear-gradient(#efe4c6,#d9c99e)", transform: "rotate(-3deg)", boxShadow: "0 30px 60px rgba(0,0,0,.55)" }}>
      <Grain id="iowa" o={0.3} />
      <svg width={820} height={470} style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={IOWA} fill="rgba(120,150,80,.25)" stroke="#3a2a18" strokeWidth={6} strokeDasharray={2600} strokeDashoffset={2600 * (1 - dr)} strokeLinejoin="round" />
        <path d="M0,330 C200,320 340,250 450,240 C600,228 700,180 820,170" fill="none" stroke="#b3322a" strokeWidth={10} strokeDasharray={1000} strokeDashoffset={1000 * (1 - road)} strokeLinecap="round" />
      </svg>
    </div>
    <Drop tt={tt} at={1.6} id="push_pin" x={1020} y={545} w={90} h={500} dust={false} />
    <Word tt={tt} at={d - 2} x={1500} y={850} txt="IOWA · 1934" size={90} r={-3} />
  </Cam>;
}} />;

// m1-2 · la cocina es la misma: la pava abollada cae sobre la hornalla y se hamaca; la esquina saltada de la mesa se ilumina
const HKettleCorner: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), steam = cl((tt - 1.6) / 1.5);
  return <Cam tt={tt} d={d} z={0.07} fx={1300}>
    <Formica y0={740} />
    <Drop tt={tt} at={0.2} id="kettle_dented" x={800} y={930} w={600} h={600} r={swing(tt, 0.6, 4, 5, 1.2)} />
    {Array.from({ length: 8 }, (_, k) => { const p = (tt * 0.4 + k / 8) % 1; return <Puff key={k} x={980 + 60 * Math.sin(p * 6 + k)} y={600 - 360 * p} r={50 + 80 * p} o={steam * (1 - p) * 0.35} />; })}
    <Glow x={1760} y={760} r={170} o={0.6 + 0.4 * Math.sin(tt * 3)} />
    <Word tt={tt} at={1.8} x={1400} y={330} txt="same as always" size={100} r={-3} />
  </Cam>;
}} />;

// m2-3 · los cuatro hermanos: cuatro fotos viejas se reparten sobre la mesa como cartas, cada una cuando Lou la nombra, con su nombre a mano
const HBrotherDeal: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = [0.2, bt(h, 0, 3), bt(h, 1, 6), bt(h, 2, 9)], nm = ["Earl", "Gus", "Vern", "Lou"], ids = ["photo_boy1", "photo_boy2", "photo_boy3", "photo_boy4"];
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={700} />
    {ids.map((id, i) => { const p = phys(tt, at[i], 6, 0.55); if (p <= 0.01) return null; const x = 330 + i * 420, r = [-6, 4, -3, 7][i];
      return <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translate(${(1 - p) * -900}px,${(1 - p) * 300}px) rotate(${r * p + (1 - p) * -40}deg)`, transformOrigin: `${x}px 900px` }}>
        <Prop id={id} x={x} y={980} w={380} />
        <div style={{ position: "absolute", left: x - 120, top: 990, fontFamily: HAND, fontSize: 64, fontWeight: 700, color: "#f4ead2", textShadow: "0 4px 10px rgba(0,0,0,.8)", opacity: cl((tt - at[i] - 0.5) * 2) }}>{nm[i]}</div></div>; })}
  </Cam>;
}} />;

// m3 · la granja: el granero y el silo bajan del cielo; el silo se inclina al este con resorte y queda torcido
const HLeanSilo: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#9ec2dc 0%,#e8e2c8 55%,#7a8a3a 56%,#4a5a22 100%)" f={(tt) => {
  const d = D(h), lean = 7 * phys(tt, 2.2, 4, 0.3);
  return <Cam tt={tt} d={d} z={0.06}>
    {Array.from({ length: 9 }, (_, k) => <div key={k} style={{ position: "absolute", left: -100, top: 640 + k * 50, width: 2200, height: 8, background: "rgba(40,60,20,.45)", transform: `skewX(${(k - 4) * 6}deg)` }} />)}
    <Drop tt={tt} at={0.2} id="red_barn" x={760} y={760} w={760} h={800} />
    {(() => { const L = land(tt, 0.8, 900); return L.on && <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "1330px 760px", transform: `rotate(${lean}deg)` }}><Prop id="silo" x={1330} y={760 + L.dy} w={260} sq={L.sq} /></div>; })()}
    <Word tt={tt} at={1.4} x={480} y={250} txt="80 acres" size={120} r={-3} />
    <Word tt={tt} at={2.9} x={1560} y={230} txt="→ east" size={70} r={6} col="#fff3c8" />
  </Cam>;
}} />;

// m3-4 · el choclo vuela en arco, gira, pega y rebota; la palabra «Crooked Nose» cae torcida
const HCorncobArc: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = cl((tt - 0.4) / 1.1), hit = tt > 1.5, bx = 200 + 1100 * p, by = 700 - 520 * Math.sin(p * Math.PI * 0.9) + (hit ? 0 : 0);
  const after = hit ? land(tt, 1.5, -200, 8, 0.3) : null;
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={850} />
    {!hit ? <Prop id="corncob" x={bx} y={by} w={420} r={tt * 540} sh={0} /> : <Prop id="corncob" x={1300 + 160 * cl(tt - 1.5)} y={980} w={420} r={160 + 30 * (after?.k ?? 0)} sq={after?.sq ?? 0} />}
    {hit && tt < 2.0 && <Puff x={1300} y={600} r={200 * (tt - 1.5) * 4} o={1 - (tt - 1.5) * 2} />}
    <Word tt={tt} at={2.0} x={1000} y={380} txt="Crooked Nose" size={140} r={-9} />
  </Cam>;
}} />;

// m4 · la taza golpea la mesa: aplasta, el café salta y queda el anillo marcado en la madera para siempre
const HMugSlam: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, 0.6, 520, 14, 0.25), shake = tt > 0.9 && tt < 1.3 ? Math.sin(tt * 90) * 10 * (1.3 - tt) : 0, ring = cl((tt - 0.9) / 0.6), lift = eio(tt, 2.6, 3.6);
  return <div style={{ position: "absolute", inset: 0, transform: `translate(${shake}px,${shake * 0.6}px)` }}><Cam tt={tt} d={d} z={0.1} fy={760}>
    <Mesa y0={640} />
    <div style={{ position: "absolute", left: 800, top: 800, width: 330, height: 110, borderRadius: "50%", border: "14px solid rgba(70,35,12,.75)", opacity: ring, filter: "blur(1px)", boxShadow: "inset 0 0 18px rgba(40,20,5,.5)" }} />
    {L.on && <Prop id="coffee_mug" x={965} y={860 + L.dy - 520 * lift} w={360} sq={L.sq} o={1 - lift * 0.8} />}
    {tt > 0.9 && tt < 1.6 && Array.from({ length: 10 }, (_, k) => { const q = (tt - 0.9) / 0.7, a = -Math.PI * (0.1 + 0.8 * k / 9); return <div key={k} style={{ position: "absolute", left: 965 + Math.cos(a) * 300 * q, top: 720 + Math.sin(a) * 260 * q + 500 * q * q, width: 18, height: 18, borderRadius: "50%", background: "#3a1e08", opacity: 1 - q }} />; })}
    <Word tt={tt} at={3.2} x={960} y={330} txt="I was right." size={120} r={-2} />
  </Cam></div>;
}} />;

// m4-5 · la gorra deja el clavo, la puerta mosquitero se cierra sola con el resorte y rebota dos veces
const HCapDoor: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), up = eio(tt, 0.4, 1.4), door = tt < 1.8 ? 70 * eio(tt, 1.0, 1.6) : 70 * Math.exp(-2.4 * (tt - 1.8)) * Math.abs(Math.cos(7 * (tt - 1.8)));
  return <Cam tt={tt} d={d} z={0.06} fx={1100}>
    <div style={{ position: "absolute", left: 300, top: 0, width: 1320, height: 1080, background: "linear-gradient(90deg,#d8cdb2,#efe6cf 30%,#cfc3a6)" }} />
    <div style={{ position: "absolute", left: 980, top: 140, width: 460, height: 860, background: "linear-gradient(#a8c4d8,#e2e8dc 60%,#8a9a6a)" }} />
    <div style={{ position: "absolute", left: 980, top: 140, width: 460, height: 860, transformOrigin: "0 50%", transform: `perspective(1600px) rotateY(${-door}deg)`, border: "22px solid #e8e2d2", boxSizing: "border-box", background: "repeating-linear-gradient(0deg, rgba(40,40,40,.18) 0 1px, transparent 1px 4px), repeating-linear-gradient(90deg, rgba(40,40,40,.18) 0 1px, transparent 1px 4px)", boxShadow: "20px 0 40px rgba(0,0,0,.35)" }} />
    <div style={{ position: "absolute", left: 640, top: 330, width: 18, height: 18, borderRadius: "50%", background: "#555" }} />
    <Prop id="farm_cap" x={650 + 600 * up} y={420 - 140 * Math.sin(up * Math.PI) + 380 * up} w={300} r={-10 + 30 * up} sh={0} o={1 - eio(tt, 1.3, 1.7)} />
    <Word tt={tt} at={2.6} x={620} y={760} txt="31 years" size={150} r={-3} col="#3a2a18" />
  </Cam>;
}} />;

// m5 · el taco de almanaque: las hojas de 1979 a 2010 se arrancan solas y vuelan, el año rueda en latón
const HYearsTear: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.4, d - 1.4), yr = 1979 + 31 * p, n = Math.floor(31 * p);
  return <Cam tt={tt} d={d} z={0.06}>
    <div style={{ position: "absolute", left: 660, top: 160, width: 600, height: 700, background: "#f4efe2", boxShadow: "0 40px 70px rgba(0,0,0,.6)", borderTop: "60px solid #8a2a1e" }}>
      <div style={{ fontFamily: SER, fontWeight: 900, fontSize: 210, color: "#2a1d0c", textAlign: "center", marginTop: 120 }}>{Math.floor(yr)}</div>
      <div style={{ fontFamily: SER, fontSize: 60, color: "#8a2a1e", textAlign: "center" }}>DECEMBER 25</div>
    </div>
    {Array.from({ length: 6 }, (_, k) => { const q = ((31 * p) - n + k / 6) % 1; return <div key={k} style={{ position: "absolute", left: 660 + 900 * q, top: 220 + 600 * q * q - 200 * q, width: 600 * (1 - 0.4 * q), height: 640 * (1 - 0.4 * q), background: "#efe8d6", transform: `rotate(${40 * q + k * 7}deg)`, opacity: p < 1 ? (1 - q) * 0.9 : 0, boxShadow: "0 20px 30px rgba(0,0,0,.3)" }} />; })}
    <Odo x={1560} y={900} v={Math.min(31, 31 * p)} n={2} size={120} />
    <Word tt={tt} at={d - 1.6} x={420} y={880} txt="Christmases" size={90} r={-4} />
  </Cam>;
}} />;

// m5-6 · la balanza de bronce: en un plato cae la tasación, en el otro la foto de los hermanos; la balanza duda y se va del lado del hermano
const HScaleTip: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), ang = -9 * phys(tt, 0.8, 5, 0.3) + 18 * phys(tt, 2.6, 4, 0.28);
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={900} />
    <Prop id="balance_scale" x={960} y={1010} w={900} r={ang * 0.25} />
    <div style={{ position: "absolute", left: 600 - 30, top: 520 - ang * 12, width: 220, height: 160, background: "#f2ecd8", transform: "rotate(-4deg)", boxShadow: "0 10px 20px rgba(0,0,0,.4)", fontFamily: SER, fontSize: 30, fontWeight: 900, color: "#2a1d0c", padding: 14, opacity: cl((tt - 0.6) * 3) }}>APPRAISAL<br /><span style={{ fontSize: 22, fontWeight: 400 }}>80 acres · fair</span></div>
    <div style={{ position: "absolute", left: 1160, top: 520 + ang * 12, opacity: cl((tt - 2.4) * 3) }}><Prop id="photo_boy2" x={110} y={170} w={220} r={5} /></div>
    <Word tt={tt} at={1.0} x={680} y={360} txt="right" size={110} r={-4} />
    <Word tt={tt} at={2.8} x={1280} y={330} txt="a brother" size={110} r={3} />
  </Cam>;
}} />;

// m6 · la lápida sube de la tierra y el cincel graba «HE WAS RIGHT» letra por letra, con polvo de piedra
const HStoneEtch: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#6a747a 0%,#a8b0a8 55%,#4a5a32 56%,#2a3418 100%)" f={(tt) => {
  const d = D(h), up = eio(tt, 0.2, 1.6), txt = "HE WAS RIGHT", n = Math.floor(cl((tt - 1.8) / (d - 3.5)) * txt.length);
  return <Cam tt={tt} d={d} z={0.07}>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: "inset(0 0 15% 0)" }}><Prop id="headstone_blank" x={960} y={900 + 640 * (1 - up)} w={640} /></div>
    <div style={{ position: "absolute", left: 960, top: 560 + 640 * (1 - up), transform: "translateX(-50%)", fontFamily: SER, fontWeight: 900, fontSize: 64, letterSpacing: 6, color: "rgba(40,40,40,.85)", textShadow: "0 2px 0 rgba(255,255,255,.35)", whiteSpace: "nowrap" }}>{txt.slice(0, n)}</div>
    {n > 0 && n < txt.length && <Puff x={960 - 200 + n * 36} y={600} r={50} o={0.6 * Math.abs(Math.sin(tt * 12))} col="rgba(220,220,210,.9)" />}
  </Cam>;
}} />;

// m6-7 · la máquina de escribir tipea el testamento de una página; «in equal shares» se subraya en lápiz rojo
const HWillType: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = "LAST WILL — 1951\n\nAll that I own goes to my wife Ada,\nand after Ada, to my sons,\nin equal shares.\n\n— Henry", n = Math.floor(cl((tt - 0.6) / (bt(h, 0, 4) - 0.2)) * L.length), un = eio(tt, bt(h, 0, 4) + 0.6, bt(h, 0, 4) + 1.6), up = eio(tt, 0.4, d - 1) * 120;
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={820} />
    <div style={{ position: "absolute", left: 560, top: 30 - up * 0.3, width: 800, height: 640, background: "#f6f0de", boxShadow: "0 30px 50px rgba(0,0,0,.5)", padding: "60px 56px", fontFamily: "'Courier New', monospace", fontSize: 38, color: "#1e1a14", whiteSpace: "pre-wrap", lineHeight: 1.35 }}>
      {L.slice(0, n)}<Grain id="will" o={0.25} />
      <div style={{ position: "absolute", left: 50, top: 60 + 6 * 51.3 - 4, width: 360 * un, height: 7, background: "#b3322a", borderRadius: 4, transform: "rotate(-1deg)" }} />
    </div>
    <Prop id="typewriter" x={960} y={1180} w={860} r={tt > 0.6 && n < L.length ? Math.sin(tt * 40) * 0.4 : 0} />
  </Cam>;
}} />;

// m7 · la parcela partida en cuatro tiras iguales por un hilo; en la tira de Gus caen las botas embarradas de veinte años
const HBootsStrip: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#b8c8cc 0%,#d8d2b8 40%,#5a4a2a 41%,#3a2e18 100%)" f={(tt) => {
  const d = D(h);
  return <Cam tt={tt} d={d} z={0.06}>
    {[0, 1, 2].map((i) => { const p = eio(tt, 0.3 + i * 0.35, 1.0 + i * 0.35); return <div key={i} style={{ position: "absolute", left: 480 * (i + 1), top: 440, width: 4, height: 640 * p, background: "#f2e8c8", boxShadow: "0 0 8px rgba(255,240,200,.8)" }} />; })}
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 480 * i + 140, top: 470, fontFamily: HAND, fontSize: 64, color: "#f4ead2", opacity: cl((tt - 1.4 - i * 0.2) * 3) }}>{["Earl", "Gus", "Lou", "Vern"][i]} · ¼</div>)}
    <Drop tt={tt} at={2.4} id="work_boots" x={720} y={960} w={460} />
    <Glow x={720} y={800} r={300} o={cl((tt - 2.8) * 2)} />
    <Word tt={tt} at={3.4} x={1400} y={260} txt="equal ≠ fair" size={120} r={-3} />
  </Cam>;
}} />;

// m8 · la olla de hierro: la tapa salta con el vapor, los platos llegan deslizando uno por silla alrededor
const HPotRoast: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), lid = Math.max(0, Math.sin((tt - 1.0) * 9)) * 30 * Math.exp(-(tt - 1.0)) * (tt > 1 ? 1 : 0);
  return <Cam tt={tt} d={d} z={0.06}>
    <Formica y0={700} chip={0} />
    <Drop tt={tt} at={0.2} id="dutch_oven" x={960} y={880 - lid * 0.2} w={560} h={600} />
    {Array.from({ length: 9 }, (_, k) => { const p = (tt * 0.45 + k / 9) % 1; return <Puff key={k} x={960 + 80 * Math.sin(p * 5 + k)} y={600 - 380 * p} r={60 + 90 * p} o={cl(tt - 1) * (1 - p) * 0.4} />; })}
    {[[-1, 0], [1, 0], [-1, 1], [1, 1], [0, 1]].map(([s, r], i) => { const p = phys(tt, 1.6 + i * 0.3, 6, 0.6); return p > 0.01 && <Prop key={i} id="dinner_plate" x={960 + s * (380 + 220 * r) + s * (1 - p) * 900} y={880 + 120 * r} w={300} ry={0} style={{ transform: "scaleY(.4)" }} />; })}
    <Word tt={tt} at={3.4} x={960} y={250} txt="nobody leaves mad" size={100} r={-2} />
  </Cam>;
}} />;

// m9 · el torno del taller: el plato gira con estrías de luz, la lata de bulones se vuelca y los bulones ruedan
const HLatheSpin: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), tip = 70 * eio(tt, 2.0, 2.6);
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={900} tone="#5a5a52" />
    <Prop id="metal_lathe" x={820} y={960} w={1100} />
    <div style={{ position: "absolute", left: 440, top: 520, width: 170, height: 170, borderRadius: "50%", background: `conic-gradient(from ${tt * 2400}deg, rgba(255,255,255,.0), rgba(255,255,255,.35) 20deg, rgba(255,255,255,0) 60deg, rgba(255,255,255,.3) 200deg, rgba(255,255,255,0) 240deg)`, mixBlendMode: "screen" }} />
    <Prop id="coffee_can_bolts" x={1560} y={960} w={300} r={tip} />
    {tt > 2.4 && Array.from({ length: 7 }, (_, k) => { const q = cl((tt - 2.4 - k * 0.06) / 1.2); return <div key={k} style={{ position: "absolute", left: 1650 + 260 * q * (0.5 + rnd(k)), top: 960 - 40 * Math.sin(q * Math.PI) + rnd(k + 3) * 30, width: 44, height: 22, borderRadius: 4, background: "linear-gradient(#d8d8d8,#6a6a6a)", transform: `rotate(${q * 720 * (rnd(k) + 0.3)}deg)` }} />; })}
    <Word tt={tt} at={1.0} x={1400} y={260} txt="29 years" size={130} r={-3} />
  </Cam>;
}} />;

// m9-10 · cuarenta palabras por día: el micrómetro sobre el banco y las frases secas caen como fichas a una pila que cuenta
const HFortyWords: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), ws = ["Pass the micrometer.", "Lock up when you go.", "Morning.", "Fine.", "Night."], v = Math.min(40, 40 * eio(tt, 0.4, d - 1.6));
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={820} tone="#6a5038" />
    <Prop id="micrometer" x={560} y={940} w={520} r={-8} />
    {ws.map((w, i) => { const L = land(tt, 0.5 + i * 0.8, 700); return L.on && <div key={i} style={{ position: "absolute", left: 1000 + (i % 2) * 40, top: 760 - i * 70 + L.dy, padding: "12px 26px", background: "#f2ead2", fontFamily: HAND, fontSize: 46, fontWeight: 700, color: "#2a1d0c", transform: `rotate(${(rnd(i) - 0.5) * 8}deg) scaleY(${1 - 0.1 * L.sq})`, boxShadow: "0 10px 18px rgba(0,0,0,.45)" }}>{w}</div>; })}
    <Odo x={1560} y={260} v={v} n={2} size={130} />
    <Word tt={tt} at={d - 1.8} x={1560} y={430} txt="words a day" size={70} r={-2} />
  </Cam>;
}} />;

// m10-11 · la sillita de nene se estira y crece hasta ser una silla de grande: el lugar en la mesa no cambió
const HChairGrow: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), g = eio(tt, 1.2, 3.0);
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={880} />
    {(() => { const L = land(tt, 0.2, 700); return L.on && <Prop id="child_chair" x={960} y={1000 + L.dy} w={360} sq={L.sq} o={1 - g} />; })()}
    {g > 0 && <Prop id="wood_chair" x={960} y={1000} w={360 + 160 * g} o={g} sq={-0.3 * (1 - g)} />}
    <Word tt={tt} at={0.8} x={500} y={330} txt="age 8" size={110} r={-4} out={2.6} />
    <Word tt={tt} at={3.0} x={1440} y={330} txt="age 50" size={110} r={3} />
  </Cam>;
}} />;

// m11 · el teléfono de pared suena: tiembla en el gancho, el reloj llega a las 8 en punto de un domingo
const HPhoneRing: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), ring = tt > 1.6 ? Math.sin(tt * 70) * 4 * (Math.sin(tt * 3) > 0 ? 1 : 0) : 0, ang = 230 + 10 * eio(tt, 0.2, 1.6);
  return <Cam tt={tt} d={d} z={0.07}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#c9b98e,#e8dcb6 40%,#c3b184)" }} />
    <Prop id="wall_phone" x={720} y={900} w={420} r={ring} sh={0} />
    <div style={{ position: "absolute", left: 1200, top: 240, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(#fdfaf0,#e6dcc4)", border: "16px solid #6a4a2a", boxShadow: "0 20px 40px rgba(0,0,0,.4)" }}>
      {Array.from({ length: 12 }, (_, k) => <div key={k} style={{ position: "absolute", left: 164, top: 10, width: 4, height: 22, background: "#333", transformOrigin: "2px 170px", transform: `rotate(${k * 30}deg)` }} />)}
      <div style={{ position: "absolute", left: 162, top: 60, width: 8, height: 110, background: "#222", transformOrigin: "4px 110px", transform: `rotate(${ang}deg)`, borderRadius: 4 }} />
      <div style={{ position: "absolute", left: 164, top: 34, width: 4, height: 136, background: "#b3322a", transformOrigin: "2px 136px", transform: `rotate(${tt * 30}deg)` }} />
    </div>
    {tt > 1.6 && [0, 1, 2].map((k) => { const q = ((tt - 1.6) * 1.4 + k / 3) % 1; return <div key={k} style={{ position: "absolute", left: 720 - 200 * (1 + q), top: 520 - 200 * (1 + q) / 2, width: 400 * (1 + q), height: 200 * (1 + q), borderRadius: "50%", border: "5px solid rgba(255,240,200,.6)", opacity: 1 - q }} />; })}
    <Word tt={tt} at={2.0} x={1380} y={760} txt="Sunday · 8:00" size={96} r={-3} col="#3a2a18" />
  </Cam>;
}} />;

// m12 · el almanaque de la forrajería: el lápiz de carpintero rodea cada domingo, uno por semana
const HCalCircle: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), wk = [0, 1, 2, 3].map((i) => eio(tt, 0.8 + i * 0.9, 1.5 + i * 0.9));
  const cur = Math.min(3, Math.floor(cl((tt - 0.8) / 3.6) * 4)), px = 1006, py = 330 + cur * 120;
  return <Cam tt={tt} d={d} z={0.06}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#c9b98e,#e8dcb6 40%,#c3b184)" }} />
    <Prop id="feed_calendar" x={900} y={1000} w={760} sh={0} />
    {wk.map((p, i) => <svg key={i} width={170} height={110} style={{ position: "absolute", left: 920, top: 280 + i * 120 }}><ellipse cx={85} cy={55} rx={74} ry={44} fill="none" stroke="#b3322a" strokeWidth={7} strokeDasharray={380} strokeDashoffset={380 * (1 - p)} strokeLinecap="round" /></svg>)}
    <Prop id="pencil" x={px + 80 + 40 * Math.cos(tt * 9)} y={py + 130 + 20 * Math.sin(tt * 9)} w={260} r={-35} sh={0.4} />
    <Word tt={tt} at={d - 2} x={1500} y={850} txt="same day, same hour" size={80} r={-3} col="#3a2a18" />
  </Cam>;
}} />;

// m13 · el camino de ripio de once millas: el pastel de ruibarbo va para un lado, el frasco de dulce de manzana viene del otro, se cruzan
const HPieRoad: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#c8b890 0%,#e8d8a8 38%,#8a7a4a 39%,#5a4a28 100%)" f={(tt) => {
  const d = D(h), p = eio(tt, 0.4, d - 1.2);
  return <Cam tt={tt} d={d} z={0.05}>
    <div style={{ position: "absolute", left: 960, top: 420, width: 0, height: 0, borderLeft: "900px solid transparent", borderRight: "900px solid transparent", borderBottom: "660px solid #a8987a", transform: "translateX(-50%)" }} />
    {Array.from({ length: 8 }, (_, k) => { const q = ((k / 8) + tt * 0.25) % 1; return <div key={k} style={{ position: "absolute", left: 960 - 6 - 20 * q, top: 430 + 640 * q * q, width: 12 + 40 * q, height: 6 + 30 * q * q, background: "rgba(240,230,200,.5)" }} />; })}
    <Prop id="rhubarb_pie" x={400 + 1100 * p} y={940 - 180 * Math.sin(p * Math.PI)} w={440} />
    <Prop id="apple_butter" x={1520 - 1100 * p} y={940 - 180 * Math.sin(p * Math.PI)} w={240} />
    <Odo x={960} y={180} v={11 * p} n={2} size={110} />
    <Word tt={tt} at={1.2} x={960} y={320} txt="miles" size={60} r={0} />
  </Cam>;
}} />;

// m14 · el pasillo de la iglesia: dos pares de zapatos enfrentados; uno se da vuelta hacia el otro y se detiene. 17 años
const HShoesTurn: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), turn = eio(tt, 1.4, 2.6);
  return <Cam tt={tt} d={d} z={0.07} fy={800}>
    <div style={{ position: "absolute", left: 0, top: 600, width: 1920, height: 480, background: "repeating-linear-gradient(90deg,#6a4a2a 0 6px,#8a6238 6px 160px)", transform: "perspective(900px) rotateX(55deg)", transformOrigin: "50% 0" }} />
    <div style={{ position: "absolute", left: 760, top: 600, width: 400, height: 480, background: "linear-gradient(#8a1e1e,#5a1010)", transform: "perspective(900px) rotateX(55deg)", transformOrigin: "50% 0" }} />
    <Drop tt={tt} at={0.2} id="dress_shoes" x={620} y={960} w={400} />
    <Prop id="dress_shoes" x={1300 - 120 * turn} y={960} w={400} flip={turn < 0.5} ry={(1 - turn) * 40} />
    <Word tt={tt} at={2.8} x={960} y={330} txt="a nod" size={130} r={-2} />
    <Word tt={tt} at={3.6} x={960} y={470} txt="after 17 years" size={70} r={-2} />
  </Cam>;
}} />;

// m14-15 · las líneas de batalla: dos filas de peones de madera se alinean detrás de cada hermano y se caen como dominó
const HPawnLines: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), fall = (i: number) => 85 * eio(tt, d - 3.2 + i * 0.12, d - 2.9 + i * 0.12);
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={760} />
    {Array.from({ length: 10 }, (_, i) => { const side = i < 5 ? -1 : 1, j = i % 5, L = land(tt, 0.3 + j * 0.25 + (side > 0 ? 0.12 : 0), 500);
      return L.on && <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: `${960 + side * (200 + j * 150)}px 990px`, transform: `rotate(${side * fall(j)}deg)` }}><Prop id="wood_pawn" x={960 + side * (200 + j * 150)} y={990 - j * 18 + L.dy} w={140 - j * 8} sq={L.sq} /></div>; })}
    <Word tt={tt} at={1.6} x={960} y={300} txt="not a war" size={130} r={-3} />
  </Cam>;
}} />;

// m17 · el monitor del hospital: la línea verde late; la palabra «tomorrow» se escribe y se tacha
const HMonitorTomorrow: C = ({ t, h }) => <S t={t} h={h} bg="radial-gradient(ellipse at 50% 40%,#1a2a2a,#050a0a 75%)" f={(tt) => {
  const d = D(h), N = 60, pts = Array.from({ length: N }, (_, i) => { const x = i / (N - 1), ph = ((x * 3 + tt * 0.9) % 1); const y = ph > 0.42 && ph < 0.46 ? -1 : ph > 0.46 && ph < 0.5 ? 0.8 : 0; return `${x * 1400},${200 + y * 140}`; }).join(" ");
  return <Cam tt={tt} d={d} z={0.06}>
    <div style={{ position: "absolute", left: 260, top: 180, width: 1400, height: 400, borderRadius: 30, background: "#020806", boxShadow: "0 0 0 16px #2a3030, 0 40px 80px rgba(0,0,0,.7)" }}>
      <svg width={1400} height={400}><polyline points={pts} fill="none" stroke="#5aff9a" strokeWidth={6} style={{ filter: "drop-shadow(0 0 10px #5aff9a)" }} /></svg>
    </div>
    <Ink tt={tt} at={1.4} dur={1.2} x={640} y={700} txt="tomorrow" size={130} col="#f2ead2" />
    <svg width={760} height={120} style={{ position: "absolute", left: 600, top: 740 }}><line x1={10} y1={60} x2={10 + 720 * eio(tt, 3.0, 3.6)} y2={50} stroke="#ff5a4a" strokeWidth={14} strokeLinecap="round" /></svg>
  </Cam>;
}} />;

// m17-18 · la silla del hospital sale del marco de la puerta y se acerca a la cama: en la pieza, no en la puerta
const HChairInRoom: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.8, 3.0);
  return <Cam tt={tt} d={d} z={0.07}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#d8dcd2,#b8bcb0 70%,#8a8e84)" }} />
    <div style={{ position: "absolute", left: 1280, top: 520, width: 560, height: 260, borderRadius: 20, background: "linear-gradient(#f4f4ee,#d8d8ce)", boxShadow: "0 30px 50px rgba(0,0,0,.35)" }} />
    <div style={{ position: "absolute", left: 140, top: 120, width: 380, height: 880, border: "26px solid #8a7a5a", borderBottom: "none", background: "linear-gradient(#3a3a32,#1a1a14)" }} />
    <Prop id="hospital_chair" x={330 + 820 * p} y={960 - 40 * p} w={380 + 120 * p} />
    <Word tt={tt} at={1.2} x={330} y={80} txt="not the doorway" size={70} r={-2} out={2.6} />
    <Word tt={tt} at={3.2} x={1100} y={260} txt="the room" size={140} r={-3} />
  </Cam>;
}} />;

// m18-19 · la navaja de hueso pasa de mano en mano: se abre, y las etiquetas Henry → Earl → Lou → Tommy corren debajo
const HKnifeHands: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), st = [0.2, bt(h, 0, 2.5), bt(h, 1, 5), bt(h, 2, 7.5)], nm = ["Henry", "Earl", "Lou", "Tommy"], cur = st.filter((x) => tt >= x).length - 1, open = eio(tt, 0.6, 1.4);
  const x = 420 + Math.max(0, cur) * 360 + 360 * cl((tt - st[Math.max(0, cur)]) * 0) ;
  return <Cam tt={tt} d={d} z={0.05}>
    <Mesa y0={800} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateX(${(x - 420)}px)`, transition: "none" }}>
      <Prop id={open > 0.5 ? "knife_open" : "knife_closed"} x={420} y={900 - 30 * Math.abs(Math.sin(tt * 2))} w={480} r={-6} />
    </div>
    {nm.map((n, i) => { const on = tt >= st[i]; return <div key={i} style={{ position: "absolute", left: 300 + i * 360, top: 940, width: 240, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 60, color: i === cur ? "#ffd27a" : "rgba(244,234,210,.55)", opacity: on ? 1 : 0.15, transform: `scale(${i === cur ? 1.15 : 1})` }}>{n}{i < 3 && <span style={{ position: "absolute", right: -70, color: "rgba(244,234,210,.5)" }}>→</span>}</div>; })}
    <Word tt={tt} at={1.4} x={960} y={250} txt="belongs to all of us" size={96} r={-2} />
  </Cam>;
}} />;

// m19 · el cajón de recetas se abre: una tarjeta sube sola y en la tapa queda pegado el papel «who gets it next»
const HRecipeBox: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), up = eio(tt, 1.0, 2.0), tape = phys(tt, 2.4, 6, 0.5);
  return <Cam tt={tt} d={d} z={0.06}>
    <Formica y0={760} chip={0} />
    <Drop tt={tt} at={0.2} id="recipe_box" x={900} y={980} w={620} />
    <div style={{ position: "absolute", left: 760, top: 620 - 260 * up, width: 300, height: 190, background: "#fbf6e6", borderTop: "8px solid #c0392b", transform: `rotate(${-4 + 4 * up}deg)`, boxShadow: "0 16px 26px rgba(0,0,0,.4)", opacity: cl(up * 3), fontFamily: HAND, fontSize: 34, color: "#22314f", padding: 16 }}>Ada's apple pie</div>
    {tape > 0.01 && <div style={{ position: "absolute", left: 1260, top: 380, width: 420, padding: "24px 28px", background: "#fffdf4", transform: `rotate(${3 - 6 * (1 - tape)}deg) scale(${tape})`, boxShadow: "0 18px 30px rgba(0,0,0,.45)", fontFamily: HAND, fontSize: 44, color: "#22314f" }}>
      <div style={{ position: "absolute", left: 150, top: -18, width: 120, height: 36, background: "rgba(240,230,190,.85)", transform: "rotate(-4deg)" }} />Next: Tommy<br />then: whoever fixes things</div>}
  </Cam>;
}} />;

// m20 · las huellas en la nieve: las grandes aparecen de a una hacia el granero, las chicas pisan adentro de cada una
const HSnowPrints: C = ({ t, h }) => <S t={t} h={h} bg={SNOW} f={(tt) => {
  const d = D(h), N = 8;
  return <Cam tt={tt} d={d} z={0.08} fy={700}>
    <div style={{ position: "absolute", left: 0, top: 560, width: 1920, height: 520, background: "linear-gradient(#e8eef2,#f8fbfc)" }} />
    {Array.from({ length: N }, (_, i) => { const a = 0.3 + i * 0.4, x = 260 + i * 200 + (i % 2) * 60, y = 1040 - i * 50, s = 2.2 - i * 0.16, big = cl((tt - a) * 4), sm = cl((tt - a - 1.6) * 4);
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x, top: y - 70 * s, width: 70 * s, height: 140 * s, borderRadius: "40% 40% 45% 45%", background: "radial-gradient(ellipse at 50% 40%, rgba(120,140,160,.75), rgba(170,190,205,.4) 70%)", transform: `rotate(${i % 2 ? 8 : -8}deg) scale(${big})`, boxShadow: "inset 0 6px 10px rgba(60,80,100,.5)" }} />
        <div style={{ position: "absolute", left: x + 14 * s, top: y - 50 * s, width: 40 * s, height: 86 * s, borderRadius: "40% 40% 45% 45%", background: "rgba(80,96,112,.75)", transform: `rotate(${i % 2 ? 8 : -8}deg) scale(${sm})` }} /></React.Fragment>; })}
    {Array.from({ length: 30 }, (_, k) => <div key={k} style={{ position: "absolute", left: (k * 137 + tt * 60) % 1920, top: (k * 71 + tt * 90) % 1080, width: 6, height: 6, borderRadius: "50%", background: "#fff", opacity: 0.7 }} />)}
    <Word tt={tt} at={d - 2.4} x={1400} y={300} txt="his boot prints" size={100} r={-3} col="#2a3440" />
  </Cam>;
}} />;

// m21 · la foto de la mula cae, el sello «1936» la estampa: no se hablaron nunca más
const HMuleStamp: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h);
  return <Cam tt={tt} d={d} z={0.07}>
    <Mesa y0={760} />
    <Drop tt={tt} at={0.2} id="mule_photo" x={900} y={980} w={680} r={-4} />
    <Sello tt={tt} at={1.6} x={1240} y={520} txt="1936" size={110} r={-12} />
    <Word tt={tt} at={2.6} x={1400} y={820} txt="over a mule" size={110} r={-3} />
  </Cam>;
}} />;

// m22 · la radio Philco: el dial se enciende y la aguja barre; afuera la nieve cruza de costado y el montón crece
const HPhilcoStorm: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#1e2630,#3a4652 60%,#c8d2da 61%,#e8eef2)" f={(tt) => {
  const d = D(h), drift = eio(tt, 0.2, d) * 200;
  return <Cam tt={tt} d={d} z={0.06}>
    {Array.from({ length: 70 }, (_, k) => <div key={k} style={{ position: "absolute", left: ((k * 211 + tt * (900 + (k % 5) * 200)) % 2200) - 140, top: (k * 97 + tt * 120) % 1080, width: 8, height: 4, borderRadius: 4, background: "#fff", opacity: 0.8 }} />)}
    <div style={{ position: "absolute", left: 0, top: 1080 - drift, width: 1920, height: drift, background: "linear-gradient(#e8eef2,#fff)", borderRadius: "60% 40% 0 0 / 30% 20% 0 0" }} />
    <Prop id="philco_radio" x={960} y={960} w={660} />
    <Glow x={960} y={740} r={200} o={0.7 + 0.3 * Math.sin(tt * 5)} col="255,190,90" />
    <Word tt={tt} at={1.4} x={960} y={230} txt="January 1975" size={110} r={-2} col="#f4f4f4" />
  </Cam>;
}} />;

// m23 · la caja de herramientas roja queda cerrada en la mesa mientras la nieve la tapa: «could have gone»
const HToolboxSnow: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), cover = eio(tt, 1.0, d - 1);
  return <Cam tt={tt} d={d} z={0.07}>
    <Mesa y0={800} />
    <Drop tt={tt} at={0.2} id="toolbox_red" x={960} y={980} w={720} />
    {Array.from({ length: 40 }, (_, k) => { const q = ((tt * 0.3 + k / 40) % 1); return <div key={k} style={{ position: "absolute", left: 560 + (k * 53) % 800, top: 100 + 800 * q, width: 10, height: 10, borderRadius: "50%", background: "#fff", opacity: 0.85 }} />; })}
    <div style={{ position: "absolute", left: 600, top: 760 - 60 * cover, width: 720, height: 70 * cover, borderRadius: "50% 50% 10px 10px", background: "linear-gradient(#fff,#dfe8ee)", opacity: cover }} />
    <Word tt={tt} at={2.0} x={960} y={260} txt="I could have gone." size={110} r={-2} />
  </Cam>;
}} />;

// m24 · la libreta: cada paso se escribe a mano cuando Lou lo dice y la tilde cae al lado
const HStepsPad: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), st = [0.3, bt(h, 0, 4), bt(h, 1, 8), bt(h, 2, 12)], tx = ["1 · Pick a plain Tuesday", "2 · Call. Don't text.", "3 · \"I'm not calling about the old business.\"", "4 · Talk about nothing. 5 minutes."];
  return <Cam tt={tt} d={d} z={0.05} fy={300}>
    <Formica y0={900} chip={0} />
    <div style={{ position: "absolute", left: 420, top: 70, width: 1080, height: 860, background: "repeating-linear-gradient(#fbf8ef 0 76px,#9fc0dd 76px 78px)", borderLeft: "6px solid #d9534f", boxShadow: "0 40px 70px rgba(0,0,0,.55)", transform: "rotate(-1.5deg)" }}>
      {tx.map((s_, i) => <React.Fragment key={i}><Ink tt={tt} at={st[i]} dur={1.4} x={60} y={110 + i * 180} txt={s_} size={56} w={960} />
        {tt > st[i] + 1.6 && <div style={{ position: "absolute", left: 990, top: 100 + i * 180, fontFamily: MARKF, fontSize: 80, color: "#2e8b3a", transform: `scale(${phys(tt, st[i] + 1.6, 9, 0.4)})` }}>✓</div>}</React.Fragment>)}
    </div>
  </Cam>;
}} />;
const MARKF = "Georgia, serif";

// m25 · la frase de una sola línea: «I'm sorry if you felt» se tacha, «for my part» queda redondeado en rojo
const HSorryScrap: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), x1 = eio(tt, 2.0, 2.5), x2 = eio(tt, 2.7, 3.2), circ = eio(tt, 3.6, 4.6);
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={820} />
    <div style={{ position: "absolute", left: 360, top: 160, width: 1200, height: 620, background: "#f6f0de", transform: "rotate(-2deg)", boxShadow: "0 40px 70px rgba(0,0,0,.55)" }}>
      <Grain id="scrap" o={0.25} />
      <Ink tt={tt} at={0.2} dur={0.8} x={70} y={60} txt="I'm sorry if you felt…" size={70} col="#555" />
      <Ink tt={tt} at={0.9} dur={0.8} x={70} y={180} txt="We both made mistakes…" size={70} col="#555" />
      <div style={{ position: "absolute", left: 60, top: 108, width: 640 * x1, height: 8, background: "#b3322a" }} />
      <div style={{ position: "absolute", left: 60, top: 228, width: 700 * x2, height: 8, background: "#b3322a" }} />
      <Ink tt={tt} at={1.6} dur={1.6} x={70} y={330} txt="I was wrong about some of it, and I'm sorry for my part." size={64} w={1060} col="#22314f" />
      <svg width={420} height={130} style={{ position: "absolute", left: 30, top: 395 }}><ellipse cx={190} cy={60} rx={170} ry={50} fill="none" stroke="#b3322a" strokeWidth={8} strokeDasharray={1100} strokeDashoffset={1100 * (1 - circ)} /></svg>
    </div>
  </Cam>;
}} />;

// m26 · el saco de granero de Gus: se despliega sobre la mesa y del bolsillo interior asoma el sobre que sube a cámara
const HCoatPocket: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), b = bt(h, 0, 4), up = eio(tt, b + 0.4, b + 2.0), unf = eio(tt, 0.2, 1.4);
  return <Cam tt={tt} d={d} z={0.06}>
    <Mesa y0={700} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 1000px", transform: `scaleY(${0.3 + 0.7 * unf})` }}><Prop id="barn_coat" x={960} y={1060} w={1000} /></div>
    <Prop id="envelope_stamp" x={1080 + 120 * up} y={760 - 380 * up} w={360 + 240 * up} r={-10 + 12 * up} sh={up} o={cl((tt - b) * 3)} />
    <Glow x={1150} y={500} r={360} o={up} />
  </Cam>;
}} />;

// m27 · la carta de Gus se escribe sola con su letra, renglón por renglón
const HLetterInk: C = ({ t, h }) => <S t={t} h={h} bg={NIGHT} f={(tt) => {
  const d = D(h), L = ["Lou.", "You were right about the appraisal.", "I was just tired.", "I'm sorry I walked out.", "Dot makes the pie.", "— Gus"], dt = (d - 2) / L.length;
  return <Cam tt={tt} d={d} z={0.05} fy={400}>
    <Glow x={960} y={300} r={700} o={0.7} />
    <div style={{ position: "absolute", left: 460, top: 60, width: 1000, height: 960, background: "linear-gradient(#f4ead0,#e2d2a8)", transform: "rotate(1.5deg)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
      <Grain id="carta" o={0.35} />
      {L.map((l, i) => <Ink key={i} tt={tt} at={0.4 + i * dt} dur={dt * 0.85} x={70} y={70 + i * 140} txt={l} size={i === 0 || i === L.length - 1 ? 74 : 62} w={880} col="#1e2a48" />)}
    </div>
  </Cam>;
}} />;

// m28 · el buzón de campo: la bandera roja intenta subir, tiembla y vuelve a bajar. Nadie fue al buzón
const HMailboxFlag: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#b8c4cc 0%,#dcd8c8 55%,#8a8a6a 56%,#5a5a3a 100%)" f={(tt) => {
  const d = D(h), fl = 70 * Math.max(0, Math.sin(cl((tt - 0.8) / 1.6) * Math.PI)) * (1 - 0.3 * Math.sin(tt * 20) * cl(tt - 1.4));
  return <Cam tt={tt} d={d} z={0.07}>
    <Drop tt={tt} at={0.1} id="rural_mailbox" x={960} y={1000} w={620} r={fl * 0.04} />
    <Word tt={tt} at={2.6} x={960} y={250} txt="neither one of us went" size={90} r={-2} />
  </Cam>;
}} />;

// m28-29 · la camioneta azul cruza las once millas: el odómetro rueda, deja polvo atrás
const HTruckMiles: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#a8c4d8 0%,#e8e0c8 50%,#9a8a5a 51%,#6a5a32 100%)" f={(tt) => {
  const d = D(h), p = eio(tt, 0.3, d - 0.8), x = -300 + 2500 * p;
  return <Cam tt={tt} d={d} z={0.04}>
    <div style={{ position: "absolute", left: 0, top: 780, width: 1920, height: 130, background: "#8a7a5a" }} />
    {Array.from({ length: 6 }, (_, k) => <Puff key={k} x={x - 380 - k * 90} y={850 - k * 10} r={60 + k * 25} o={0.4 * (1 - k / 6) * cl(p * 5)} col="rgba(210,190,150,.8)" />)}
    <Prop id="pickup_truck" x={x} y={920 + 4 * Math.sin(tt * 18)} w={980} />
    <Odo x={960} y={250} v={11 * p} n={2} size={130} />
    <Word tt={tt} at={0.6} x={960} y={420} txt="go first" size={110} r={-2} />
  </Cam>;
}} />;

// m29 · la tarea: el día del almanaque gira hasta TUESDAY y el reloj de huevo de cinco minutos se da cuerda y corre
const HTuesdayTimer: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), days = ["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY"], q = eio(tt, 0.3, 2.2) * 3, k = Math.min(3, Math.floor(q + 1e-4)), fl = k === 3 ? 0 : q - k, wind = tt < 2.6 ? -300 * eio(tt, 2.0, 2.6) : -300 + 60 * (tt - 2.6);
  return <Cam tt={tt} d={d} z={0.06}>
    <Formica y0={780} chip={0} />
    <div style={{ position: "absolute", left: 360, top: 200, width: 640, height: 480, background: "#f4efe2", borderTop: "70px solid #2a4a6a", boxShadow: "0 30px 50px rgba(0,0,0,.5)", perspective: 1000 }}>
      <div style={{ fontFamily: SER, fontWeight: 900, fontSize: 96, color: k === 3 ? "#b3322a" : "#2a1d0c", textAlign: "center", marginTop: 130, transform: `rotateX(${fl * 90}deg)` }}>{days[k]}</div>
    </div>
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "1380px 800px", transform: `rotate(${wind * 0.05}deg)` }}><Drop tt={tt} at={0.3} id="egg_timer" x={1380} y={960} w={360} /></div>
    <Word tt={tt} at={2.8} x={1380} y={300} txt="5 minutes" size={100} r={-3} />
  </Cam>;
}} />;

// m30 · el repaso: siete fichas de receta caen en abanico sobre la mesa, cada una cuando Lou nombra su lección
const HRecapCards: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), tx = ["Right is expensive", "Talk money early", "Oldest isn't boss", "Call on dull days", "Spouses keep the road", "Say it in the room", "One thing for all", "GO FIRST"];
  const st = [0.3, ...Array.from({ length: 7 }, (_, i) => bt(h, i, 2 + i * 2.6))];
  return <Cam tt={tt} d={d} z={0.04} fy={600}>
    <Mesa y0={620} />
    <div style={{ position: "absolute", inset: 0, transform: "scale(1.45)", transformOrigin: "960px 1000px" }}>
    {tx.map((s_, i) => { const L = land(tt, st[i], 600, 9, 0.4), last = i === 7; if (!L.on) return null; const a = -35 + i * 10, x = 960 + Math.sin(a * Math.PI / 180) * 640, y = 1000 - Math.cos(a * Math.PI / 180) * 300;
      return <div key={i} style={{ position: "absolute", left: x - 170, top: y - 260 + L.dy, width: last ? 400 : 340, height: 220, background: last ? "#fff3c8" : "repeating-linear-gradient(#fbf6e6 0 44px,#b9cfe2 44px 46px)", borderTop: `10px solid ${last ? "#b3322a" : "#c0392b"}`, transform: `rotate(${a * 0.6}deg) scale(${last ? 1.25 : 1},${1 - 0.1 * L.sq})`, boxShadow: "0 18px 30px rgba(0,0,0,.5)", fontFamily: HAND, fontWeight: 700, fontSize: last ? 64 : 44, color: "#22314f", padding: "40px 20px", textAlign: "center", zIndex: i }}>{s_}</div>; })}
    </div>
  </Cam>;
}} />;

export const HCA: Record<string, C> = {
  phoneScroll: HPhoneScroll, emptyChairs: HEmptyChairs, boxTease: HBoxTease, iowaPin: HIowaPin, kettleCorner: HKettleCorner, brotherDeal: HBrotherDeal,
  leanSilo: HLeanSilo, corncobArc: HCorncobArc, mugSlam: HMugSlam, capDoor: HCapDoor, yearsTear: HYearsTear, scaleTip: HScaleTip, stoneEtch: HStoneEtch,
  willType: HWillType, bootsStrip: HBootsStrip, potRoast: HPotRoast, latheSpin: HLatheSpin, fortyWords: HFortyWords, chairGrow: HChairGrow, phoneRing: HPhoneRing,
  calCircle: HCalCircle, pieRoad: HPieRoad, shoesTurn: HShoesTurn, pawnLines: HPawnLines, monitorTomorrow: HMonitorTomorrow, chairInRoom: HChairInRoom,
  knifeHands: HKnifeHands, recipeBox: HRecipeBox, snowPrints: HSnowPrints, muleStamp: HMuleStamp, philcoStorm: HPhilcoStorm, toolboxSnow: HToolboxSnow,
  stepsPad: HStepsPad, sorryScrap: HSorryScrap, coatPocket: HCoatPocket, letterInk: HLetterInk, mailboxFlag: HMailboxFlag, truckMiles: HTruckMiles,
  tuesdayTimer: HTuesdayTimer, recapCards: HRecapCards,
};
