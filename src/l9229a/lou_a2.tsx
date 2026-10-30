// l9229a «Brother» · VUELTA 2 del evaluador (30-oct): pisa las piezas que quedaron <8 en lou_a.tsx.
// Lo que pidió el evaluador en casi todas: nada de fondo beige liso → la escena REAL (foto del lugar, apenas desenfocada) detrás,
// el objeto grande y entero dentro del cuadro, la acción clave bien visible y nada de texto cortado o chico para celular.
import React from "react";
import { Img } from "remotion";
import { HAND, cl, eio, phys, img } from "./hkit";
import { Odo, Sello, Puff, Grain } from "./obj";
import { S, D, rnd, bt, C, SER, Prop, Drop, Dust, Cam, Mesa, Word, Glow, Luz, land, swing } from "./pk";

// la foto real del lugar detrás, apenas desenfocada y con un viñeteo cálido: el objeto vive EN la casa de Lou
const Fondo: React.FC<{ id: string; tt: number; b?: number; br?: number; s?: number; y?: string }> = ({ id, tt, b = 5, br = 0.72, s = 1.08, y = "50%" }) => <>
  <Img src={img(id)} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, objectFit: "cover", objectPosition: `50% ${y}`, filter: `blur(${b}px) brightness(${br}) saturate(.9)`, transform: `scale(${s + 0.012 * tt})` }} />
  <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 75% 70% at 50% 45%, transparent 40%, rgba(10,6,2,.55) 100%)" }} />
</>;
const Formica: React.FC<{ y0?: number }> = ({ y0 = 760 }) => <>
  <div style={{ position: "absolute", left: -300, top: y0, width: 2520, height: 1200 - y0, transformOrigin: "50% 0", transform: "perspective(900px) rotateX(40deg)",
    background: "radial-gradient(ellipse 50% 40% at 40% 20%, rgba(255,250,220,.35), transparent 70%), repeating-radial-gradient(circle at 30% 40%, rgba(120,90,20,.05) 0 2px, transparent 2px 9px), linear-gradient(180deg,#e9c457,#c99a2e)" }} />
  <div style={{ position: "absolute", left: 0, top: y0 - 6, width: 1920, height: 14, background: "linear-gradient(#f4f4f4,#8a8a8a 50%,#3a3a3a)", boxShadow: "0 6px 10px rgba(0,0,0,.4)" }} />
</>;
const Ink: React.FC<{ tt: number; at: number; dur: number; x: number; y: number; txt: string; size?: number; col?: string; w?: number }> = ({ tt, at, dur, x, y, txt, size = 52, col = "#22314f", w = 900 }) => {
  const p = cl((tt - at) / dur); if (p <= 0) return null;
  return <div style={{ position: "absolute", left: x, top: y, width: w, fontFamily: HAND, fontWeight: 700, fontSize: size, color: col, lineHeight: 1.12, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)` }}>{txt}</div>;
};
const BOX = { position: "absolute" as const, left: 0, top: 0, width: 1920, height: 1080 };

// m0 · el teléfono GRANDE boca arriba en la mesa de noche: el pulgar arrastra la lista, BROTHER frena con resorte, vibra… y sigue de largo
const HPhoneScroll: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), names = ["Dentist · Dr. Hale", "Don · Gutters", "Doris (church)", "Earl's widow", "BROTHER", "Feed store", "Gas co-op", "Harold", "Hardware", "Iowa Seed Co."];
  const stop = 4 * 120, v = tt < 1.8 ? stop * eio(tt, 0.2, 1.8) : tt < 3.6 ? stop + 18 * Math.sin((tt - 1.8) * 14) * Math.exp(-(tt - 1.8) * 3) : stop + 700 * eio(tt, 3.6, d - 0.8);
  const hot = cl(1 - Math.abs(tt - 2.7) / 1.2), blur = tt > 3.6 && tt < d - 1 ? 3 : 0, thumbY = 640 - 300 * ((tt * 0.8) % 1);
  return <Cam tt={tt} d={d} z={0.08} fy={560}>
    <Fondo id="la_e01" tt={tt} b={9} br={0.5} />
    <Formica y0={720} />
    <div style={{ position: "absolute", left: 960, top: 40, transform: "translate(-50%,0) perspective(2000px) rotateX(16deg) rotateZ(-4deg)", transformOrigin: "50% 100%" }}>
      <div style={{ width: 560, height: 1000, borderRadius: 70, background: "linear-gradient(135deg,#2a2a2e,#0a0a0c)", padding: 24, boxShadow: "0 70px 90px rgba(0,0,0,.75), inset 0 0 0 3px #4a4a50" }}>
        <div style={{ width: "100%", height: "100%", borderRadius: 48, overflow: "hidden", background: "#f2f2f4", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 130 - v, filter: `blur(${blur}px)` }}>{names.map((n, i) => <div key={i} style={{ height: 120, display: "flex", alignItems: "center", gap: 26, padding: "0 30px", borderBottom: "1px solid #d8d8dc", background: n === "BROTHER" ? `rgba(255,170,60,${0.2 + 0.6 * hot})` : "transparent" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: ["#8aa", "#a98", "#9a8", "#89a", "#c96", "#9aa", "#a99", "#99a", "#aa9", "#9a9"][i], color: "#fff", fontFamily: SER, fontWeight: 900, fontSize: 36, display: "flex", alignItems: "center", justifyContent: "center" }}>{n[0]}</div>
            <div style={{ fontFamily: SER, fontSize: n === "BROTHER" ? 58 : 46, fontWeight: n === "BROTHER" ? 900 : 500, color: "#1a1a1e" }}>{n}</div></div>)}</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 120, background: "#f2f2f4", borderBottom: "2px solid #ccc", fontFamily: SER, fontWeight: 900, fontSize: 58, padding: "34px 30px", color: "#111" }}>Contacts</div>
        </div>
      </div>
    </div>
    <Luz />
  </Cam>;
}} />;

// m0-1 · la mesa de la cena servida: cuatro sillas y cuatro platos; tres sillas se deslizan hacia atrás arrastrando su sombra y su plato se enfría (se apaga)
const HEmptyChairs: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), X = [380, 760, 1160, 1540];
  return <Cam tt={tt} d={d} z={0.06} fy={700}>
    <Fondo id="L_cocina" tt={tt} b={7} br={0.55} />
    <Formica y0={640} />
    {X.map((x, i) => { const go = i < 3 ? eio(tt, 1.8 + i * 0.8, 2.9 + i * 0.8) : 0, cold = go;
      return <React.Fragment key={i}>
        <div style={{ ...BOX, transform: `translateY(${-260 * go}px) scale(${1 - 0.3 * go})`, transformOrigin: `${x}px 1000px`, filter: `brightness(${1 - 0.6 * go})` }}><Prop id="chrome_chair" x={x} y={1060} w={360} flip={i % 2 === 1} /></div>
        <Prop id="dinner_plate" x={x} y={800} w={230} sh={0.6} style={{ filter: `saturate(${1 - cold}) brightness(${1 - 0.45 * cold})` }} />
        {i === 3 && <Glow x={x} y={760} r={240} o={eio(tt, 4.0, 4.8)} />}
      </React.Fragment>; })}
    <Word tt={tt} at={d - 2.0} x={1500} y={230} txt="just me" size={120} r={-3} />
  </Cam>;
}} />;

// m1 · la caja cerrada: la tapa se levanta dos dedos sobre la bisagra, sale una cuña de luz dorada por la rendija y la tapa baja con un golpe
const HBoxTease: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), op = Math.max(0, Math.sin(cl((tt - 1.2) / (d - 3)) * Math.PI)), slam = tt > d - 1.8 ? 0 : op;
  return <Cam tt={tt} d={d} z={0.1} fy={640}>
    <Fondo id="L_taller" tt={tt} b={8} br={0.4} />
    <Mesa y0={760} tone="#6a4a2a" />
    {/* cuña de luz que sale por la rendija */}
    <div style={{ position: "absolute", left: 560, top: 300, width: 800, height: 380, background: "radial-gradient(ellipse 50% 100% at 50% 100%, rgba(255,210,120,.85), transparent 75%)", clipPath: "polygon(30% 100%, 70% 100%, 100% 0, 0 0)", opacity: slam * 0.9, mixBlendMode: "screen", filter: "blur(6px)" }} />
    <div style={{ position: "absolute", left: 600, top: 650, width: 720, height: 360, background: "linear-gradient(#a07a4a,#6a4a28)", borderRadius: 8, boxShadow: "0 40px 60px rgba(0,0,0,.6), inset 0 0 0 4px rgba(0,0,0,.25)" }}>
      <div style={{ position: "absolute", left: 30, top: 140, width: 660, height: 6, background: "rgba(60,35,15,.5)" }} />
      <Grain id="caja" o={0.3} />
    </div>
    <div style={{ position: "absolute", left: 580, top: 600, width: 760, height: 70, background: "linear-gradient(#b88c58,#8a6438)", borderRadius: 8, transformOrigin: "50% 100%", transform: `perspective(1200px) rotateX(${-30 * slam}deg) translateY(${tt > d - 1.8 && tt < d - 1.5 ? 6 : 0}px)`, boxShadow: "0 10px 20px rgba(0,0,0,.5)" }} />
    <Glow x={960} y={640} r={260} o={slam * 1.2} col="255,200,110" />
    {tt > d - 1.8 && <Dust tt={tt} at={d - 1.8} x={960} y={660} w={600} />}
  </Cam>;
}} />;

// m1 · el mapa doblado de Iowa (contorno real con el Mississippi a la derecha y el Missouri a la izquierda); la chincheta cae y se clava sobre la granja
const IOWA = "M40,60 L700,52 L716,90 L742,128 L770,150 L792,198 L776,236 L748,262 L736,300 L712,330 L700,372 L668,396 L80,404 L62,370 L50,330 L44,280 L30,240 L36,190 L28,140 Z";
const HIowaPin: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), dr = eio(tt, 0.2, 1.4), pin = land(tt, 1.8, 600, 10, 0.3);
  return <Cam tt={tt} d={d} z={0.09} fx={1020} fy={560}>
    <Fondo id="L_cocina" tt={tt} b={8} br={0.5} />
    <Formica y0={700} />
    <div style={{ position: "absolute", left: 480, top: 240, width: 1000, height: 560, transform: "perspective(1600px) rotateX(28deg) rotate(-3deg)", transformOrigin: "50% 100%", background: "linear-gradient(90deg,#f2e8cc 0 24.8%,#e2d6b4 25% 25.2%,#efe4c6 25.4% 49.8%,#ddd0ac 50% 50.2%,#f2e8cc 50.4% 74.8%,#e0d3b0 75% 75.2%,#efe4c6 75.4%)", boxShadow: "0 40px 70px rgba(0,0,0,.6)" }}>
      <Grain id="mapa" o={0.3} />
      <svg width={1000} height={560} viewBox="0 0 840 460" style={{ position: "absolute", left: 0, top: 0 }}>
        <path d={IOWA} fill="rgba(140,170,90,.35)" stroke="#3a2a18" strokeWidth={5} strokeDasharray={2600} strokeDashoffset={2600 * (1 - dr)} strokeLinejoin="round" />
        <path d="M700,52 C730,120 790,170 792,200 C780,250 740,280 700,372" fill="none" stroke="#4a7ab0" strokeWidth={7} opacity={dr} />
        <path d="M40,60 C30,140 40,260 80,404" fill="none" stroke="#4a7ab0" strokeWidth={6} opacity={dr} />
        <text x={330} y={250} fontFamily="Georgia" fontWeight={900} fontSize={64} fill="#3a2a18" opacity={cl((tt - 1.0) * 2)} letterSpacing={10}>IOWA</text>
        {[[180, 120], [520, 160], [610, 330], [260, 340], [420, 110]].map(([x, y], k) => <circle key={k} cx={x} cy={y} r={6} fill="#3a2a18" opacity={dr} />)}
      </svg>
    </div>
    {pin.on && <div style={{ position: "absolute", left: 1040 - 40, top: 470 + pin.dy - 120, width: 80, height: 130 }}>
      <div style={{ width: 70, height: 70, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#ff8a7a,#b3221a 60%,#6a100a)", boxShadow: "0 10px 14px rgba(0,0,0,.5)" }} />
      <div style={{ marginLeft: 33, width: 5, height: 60, background: "linear-gradient(90deg,#ddd,#777)" }} />
    </div>}
    {pin.on && pin.k > 0.9 && <div style={{ position: "absolute", left: 1015, top: 585, width: 70, height: 16, borderRadius: "50%", background: "rgba(0,0,0,.35)", filter: "blur(3px)" }} />}
    <Word tt={tt} at={2.6} x={1500} y={190} txt="1934" size={120} r={-3} />
  </Cam>;
}} />;

// m1-2 · la hornalla prende con llama azul debajo de la pava abollada; un cono de luz barre la mesa hasta la esquina saltada y la cámara se le acerca
const HKettleCorner: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), fire = cl((tt - 0.5) * 3), sweep = eio(tt, 1.8, 3.2), zx = eio(tt, 3.0, d - 0.6);
  return <div style={{ ...BOX, transformOrigin: "1620px 820px", transform: `scale(${1 + 0.25 * zx})` }}><Cam tt={tt} d={d} z={0.04}>
    <Fondo id="L_cocina" tt={tt} b={6} br={0.55} />
    {/* la cocina blanca: hornalla y parrilla */}
    <div style={{ position: "absolute", left: 300, top: 760, width: 760, height: 330, background: "linear-gradient(#f2f0ea,#c8c4ba)", borderRadius: 10, boxShadow: "0 30px 50px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 470, top: 720, width: 420, height: 60, borderRadius: "50%", background: "#222", boxShadow: "inset 0 0 0 10px #444" }} />
    {Array.from({ length: 16 }, (_, k) => { const a = (k / 16) * Math.PI * 2, fl = 1 + 0.25 * Math.sin(tt * 20 + k); return <div key={k} style={{ position: "absolute", left: 680 + Math.cos(a) * 150 - 8, top: 742 + Math.sin(a) * 18 - 30 * fl * fire, width: 16, height: 30 * fl * fire, borderRadius: "50% 50% 40% 40%", background: "linear-gradient(#bfe0ff,#3a7aff 60%,#1a3aaa)", opacity: fire * 0.9, filter: "blur(1px)" }} />; })}
    <Prop id="kettle_dented" x={680} y={745} w={480} r={swing(tt, 0.3, 3, 5, 1.2)} />
    {Array.from({ length: 8 }, (_, k) => { const p = (tt * 0.4 + k / 8) % 1; return <Puff key={k} x={860 + 60 * Math.sin(p * 6 + k)} y={420 - 300 * p} r={50 + 80 * p} o={cl((tt - 1.4) / 1.5) * (1 - p) * 0.35} />; })}
    <Formica y0={860} />
    <div style={{ position: "absolute", left: 1640, top: 854, width: 130, height: 60, background: "#5a4a2a", clipPath: "polygon(0 0,100% 0,70% 100%,20% 60%)", boxShadow: "inset 0 0 8px #000" }} />
    {/* el cono de luz de la ventana que barre hasta la esquina */}
    <div style={{ position: "absolute", left: 600 + 1000 * sweep, top: 700, width: 420, height: 380, background: "radial-gradient(ellipse at 50% 60%, rgba(255,236,190,.55), transparent 65%)", mixBlendMode: "screen" }} />
  </Cam></div>;
}} />;

// m2-3 · las cuatro fotos vuelan en arco desde abajo a la izquierda, giran y aterrizan torcidas sobre la mesa, solapándose, con el nombre a lápiz en el borde
const HBrotherDeal: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), at = [0.2, bt(h, 0, 3), bt(h, 1, 6), bt(h, 2, 9)], nm = ["Earl", "Gus", "Vern", "Lou"], ids = ["photo_boy1", "photo_boy2", "photo_boy3", "photo_boy4"];
  return <Cam tt={tt} d={d} z={0.05} fy={620}>
    <Fondo id="L_cocina" tt={tt} b={8} br={0.5} />
    <Formica y0={560} />
    {ids.map((id, i) => { const q = cl((tt - at[i]) / 0.7); if (q <= 0) return null; const x = 400 + i * 380, y = 960 - (i % 2) * 40, r = [-8, 5, -4, 9][i];
      const L = q < 1 ? null : land(tt, at[i] + 0.7, 0, 9, 0.35), sx = -200 + (x + 200) * q, sy = 1300 - (1300 - y) * q - 380 * Math.sin(q * Math.PI);
      return <div key={i} style={{ ...BOX, transform: `translate(${sx - x}px,${sy - y}px) rotate(${r + (1 - q) * -260}deg)`, transformOrigin: `${x}px ${y - 200}px`, zIndex: i }}>
        <Prop id={id} x={x} y={y} w={430} sq={L?.sq ?? 0} />
        <div style={{ position: "absolute", left: x - 150, top: y - 90, width: 300, textAlign: "center", fontFamily: HAND, fontSize: 66, fontWeight: 700, color: "#2a2a40", background: "rgba(250,245,230,.92)", transform: "rotate(-2deg)", opacity: cl((tt - at[i] - 0.8) * 3) }}>{nm[i]}</div></div>; })}
  </Cam>;
}} />;

// m3 · la granja de verdad al atardecer: el silo de hormigón (recortado) se inclina hacia el este con resorte y su sombra larga gira con él
const HLeanSilo: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), lean = 7 * phys(tt, 2.0, 4, 0.3);
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="L_granja" tt={tt} b={3} br={0.75} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,170,80,.18), transparent 50%)" }} />
    <Drop tt={tt} at={0.2} id="red_barn" x={640} y={900} w={760} h={800} />
    <div style={{ position: "absolute", left: 1290, top: 880, width: 600, height: 60, borderRadius: "50%", background: "rgba(20,10,0,.45)", filter: "blur(8px)", transformOrigin: "0 50%", transform: `rotate(${-6 + lean * 1.5}deg)` }} />
    {(() => { const L = land(tt, 0.7, 900); return L.on && <div style={{ ...BOX, transformOrigin: "1290px 900px", transform: `rotate(${lean}deg)` }}><Prop id="silo" x={1290} y={900 + L.dy} w={300} sq={L.sq} /></div>; })()}
    <Word tt={tt} at={1.2} x={520} y={200} txt="80 acres" size={130} r={-3} />
  </Cam>;
}} />;

// m3-4 · el choclo GRANDE vuela hacia la cámara, pega contra el borde de la mesa, salta con granos, y «Crooked Nose» cae torcida con peso
const HCorncobArc: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = cl((tt - 0.3) / 1.0), hit = tt > 1.3, bounce = hit ? phys(tt, 1.3, 7, 0.3) : 0;
  return <Cam tt={tt} d={d} z={0.06} fy={760}>
    <Fondo id="L_granja" tt={tt} b={9} br={0.5} />
    <Mesa y0={780} tone="#7a5636" />
    {!hit ? <Prop id="corncob" x={200 + 760 * p} y={420 + 380 * p * p} w={380 + 300 * p} r={tt * 420} sh={0} blur={2} />
      : <Prop id="corncob" x={960 + 140 * bounce} y={900 - 120 * Math.sin(bounce * Math.PI) * (1 - cl(tt - 2))} w={620} r={150 + 20 * bounce} />}
    {hit && Array.from({ length: 14 }, (_, k) => { const q = cl((tt - 1.3) / 0.9), a = -Math.PI * (0.1 + 0.8 * rnd(k)); return q < 1 && <div key={k} style={{ position: "absolute", left: 960 + Math.cos(a) * 420 * q, top: 820 + Math.sin(a) * 380 * q + 600 * q * q, width: 22, height: 26, borderRadius: "40%", background: "linear-gradient(#ffe27a,#d9a21a)", opacity: 1 - q }} />; })}
    {hit && tt < 1.8 && <Puff x={960} y={800} r={300 * (tt - 1.3) * 3} o={1 - (tt - 1.3) * 2} col="rgba(230,210,160,.8)" />}
    {(() => { const L = land(tt, 2.0, 500, 8, 0.32); return L.on && <div style={{ position: "absolute", left: 960, top: 300 + L.dy, transform: `translate(-50%,0) rotate(-9deg) scaleY(${1 - 0.12 * L.sq})`, fontFamily: SER, fontWeight: 900, fontSize: 150, color: "#f3e6c6", textShadow: "0 12px 26px rgba(0,0,0,.75)", whiteSpace: "nowrap" }}>Crooked Nose</div>; })()}
  </Cam>;
}} />;

// m4 · la taza enlozada cae, aplasta, lanza una corona de café con gotas y el anillo oscuro queda quemado en la mesa
const HMugSlam: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = land(tt, 0.5, 520, 14, 0.25), hit = 0.5 + 0.34, shake = tt > hit && tt < hit + 0.35 ? Math.sin(tt * 90) * 12 * (hit + 0.35 - tt) : 0, ring = cl((tt - hit) / 0.8);
  return <div style={{ ...BOX, transform: `translate(${shake}px,${shake * 0.6}px)` }}><Cam tt={tt} d={d} z={0.1} fy={800}>
    <Fondo id="L_cocina" tt={tt} b={8} br={0.5} />
    <Formica y0={620} />
    <div style={{ position: "absolute", left: 770, top: 850, width: 390, height: 130, borderRadius: "50%", border: "16px solid rgba(70,35,12,.8)", opacity: ring, filter: "blur(1px)", boxShadow: "inset 0 0 22px rgba(40,20,5,.6)" }} />
    {/* la corona de café */}
    {tt > hit && tt < hit + 0.5 && <div style={{ position: "absolute", left: 965 - 220 * cl((tt - hit) * 4), top: 760 - 80 * cl((tt - hit) * 4), width: 440 * cl((tt - hit) * 4), height: 140 * cl((tt - hit) * 4), borderRadius: "50%", border: "10px solid rgba(60,28,8,.85)", borderTopColor: "transparent", opacity: 1 - (tt - hit) * 2 }} />}
    {tt > hit && tt < hit + 1.0 && Array.from({ length: 16 }, (_, k) => { const q = (tt - hit) / 1.0, a = -Math.PI * (0.05 + 0.9 * k / 15); return <div key={k} style={{ position: "absolute", left: 965 + Math.cos(a) * 380 * q, top: 760 + Math.sin(a) * 340 * q + 700 * q * q, width: 16 + 10 * rnd(k), height: 22 + 10 * rnd(k), borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 30%,#8a5a2a,#3a1e08)", opacity: 1 - q }} />; })}
    {L.on && <Prop id="coffee_mug" x={965} y={920 + L.dy} w={400} sq={L.sq} />}
    <Word tt={tt} at={2.6} x={960} y={260} txt="I was right." size={130} r={-2} />
  </Cam></div>;
}} />;

// m4-5 · la puerta mosquitero de verdad (marco de madera, malla, resorte): la gorra se suelta del clavo y cae; la puerta se cierra sola y rebota dos veces
const HCapDoor: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), fall = land(tt, 0.6, -1, 9, 0.3), door = tt < 1.8 ? 75 * eio(tt, 0.2, 0.9) : 75 * Math.exp(-2.2 * (tt - 1.8)) * Math.abs(Math.cos(7 * (tt - 1.8)));
  const cy = tt < 0.6 ? 380 : Math.min(1000, 380 + 1400 * (tt - 0.6) ** 2);
  return <Cam tt={tt} d={d} z={0.06} fx={1000}>
    <Fondo id="L_porche" tt={tt} b={4} br={0.65} />
    {/* marco de la puerta en la pared */}
    <div style={{ position: "absolute", left: 640, top: 60, width: 700, height: 1020, background: "rgba(40,30,20,.15)", boxShadow: "inset 0 0 0 30px #e8e2d2, 0 30px 60px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 670, top: 90, width: 640, height: 990, transformOrigin: "0 50%", transform: `perspective(1800px) rotateY(${-door}deg)`, boxShadow: "30px 0 50px rgba(0,0,0,.4)" }}>
      <div style={{ position: "absolute", inset: 0, border: "34px solid #ece4cc", borderTopWidth: 40, boxSizing: "border-box", background: "repeating-linear-gradient(0deg, rgba(30,30,30,.32) 0 1px, transparent 1px 5px), repeating-linear-gradient(90deg, rgba(30,30,30,.32) 0 1px, transparent 1px 5px), rgba(180,190,180,.12)" }} />
      <div style={{ position: "absolute", left: 0, top: 470, width: 640, height: 30, background: "#ece4cc" }} />
      <div style={{ position: "absolute", left: 560, top: 470, width: 26, height: 26, borderRadius: "50%", background: "radial-gradient(#e8d08a,#8a6a2a)" }} />
      {/* el resorte */}
      <div style={{ position: "absolute", left: 30, top: 300, width: 160, height: 14, background: "repeating-linear-gradient(90deg,#999 0 4px,#444 4px 8px)", transform: `scaleX(${1 + door / 120})`, transformOrigin: "0 50%" }} />
    </div>
    <div style={{ position: "absolute", left: 420, top: 330, width: 16, height: 16, borderRadius: "50%", background: "#444", boxShadow: "0 2px 0 #aaa" }} />
    <Prop id="farm_cap" x={430} y={cy + 100} w={260} r={tt < 0.6 ? -8 : -8 + 220 * cl((tt - 0.6) / 0.8)} sh={cy > 990 ? 1 : 0} />
    <Word tt={tt} at={2.4} x={1420} y={300} txt="31 years" size={130} r={-3} />
  </Cam>;
}} />;

// m5 · el taco de almanaque de latón colgado del clavo: las hojas OPACAS se arrancan de a una, vuelan girando, y el año rueda en un rodillo
const HYearsTear: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.4, d - 1.4), N = 31, n = Math.floor(N * p), q = N * p - n;
  const pg = (y: number) => <div style={{ position: "absolute", inset: 0, background: "#f4efe2" }}>
    <div style={{ height: 80, background: "#8a2a1e", color: "#f4efe2", fontFamily: SER, fontWeight: 900, fontSize: 52, textAlign: "center", lineHeight: "80px" }}>DECEMBER</div>
    <div style={{ fontFamily: SER, fontWeight: 900, fontSize: 250, color: "#2a1d0c", textAlign: "center", lineHeight: "300px" }}>25</div>
    <div style={{ fontFamily: SER, fontWeight: 700, fontSize: 72, color: "#8a2a1e", textAlign: "center" }}>{y}</div></div>;
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="L_cocina" tt={tt} b={7} br={0.5} />
    <div style={{ position: "absolute", left: 950, top: 70, width: 20, height: 20, borderRadius: "50%", background: "#333" }} />
    <div style={{ position: "absolute", left: 640, top: 100, width: 640, height: 600, background: "linear-gradient(120deg,#6a4a1a,#e8c870 45%,#8a6a2a)", borderRadius: 12, boxShadow: "0 40px 70px rgba(0,0,0,.6)" }} />
    <div style={{ position: "absolute", left: 670, top: 170, width: 580, height: 510, boxShadow: "0 4px 0 #ddd6c4, 0 8px 0 #cfc8b4" }}>{pg(Math.min(2010, 1979 + n + (p >= 1 ? 0 : 1)))}</div>
    {p < 1 && <div style={{ position: "absolute", left: 670, top: 170, width: 580, height: 510, transformOrigin: "50% 0", transform: `translate(${700 * q * q}px,${-200 * q + 900 * q * q}px) rotate(${q * 70}deg)`, boxShadow: "0 20px 30px rgba(0,0,0,.35)", opacity: 1 - q * 0.3 }}>{pg(1979 + n)}</div>}
    <Odo x={1620} y={880} v={Math.min(31, N * p)} n={2} size={110} />
    <Word tt={tt} at={d - 1.6} x={460} y={860} txt="Christmases" size={100} r={-4} />
  </Cam>;
}} />;

// m5-6 · la balanza: en el plato izquierdo cae la tasación, en el derecho la foto sepia de los cuatro hermanos; la balanza duda y cae del lado del hermano
const HScaleTip: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), ang = -10 * phys(tt, 0.7, 5, 0.3) + 20 * phys(tt, 2.4, 3.5, 0.22), ph = land(tt, 2.0, 600, 9, 0.35);
  const pan = (s: number) => 600 + s * ang * 9;
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="la_e09" tt={tt} b={9} br={0.45} />
    <Mesa y0={900} />
    <Prop id="balance_scale" x={960} y={1010} w={940} r={ang * 0.25} />
    <div style={{ position: "absolute", left: 520, top: pan(-1) - 160, width: 280, height: 190, background: "#f2ecd8", transform: "rotate(-4deg)", boxShadow: "0 10px 20px rgba(0,0,0,.45)", fontFamily: SER, fontWeight: 900, fontSize: 40, color: "#2a1d0c", padding: 18, opacity: cl((tt - 0.5) * 3) }}>APPRAISAL<div style={{ fontSize: 34, fontWeight: 400, marginTop: 10 }}>80 acres</div></div>
    {ph.on && <div style={{ position: "absolute", left: 1140, top: pan(1) - 210 + ph.dy, width: 290, height: 220, background: "#f0e8d4", padding: 14, transform: "rotate(5deg)", boxShadow: "0 12px 22px rgba(0,0,0,.5)" }}>
      <div style={{ width: "100%", height: "100%", display: "flex", gap: 4, background: "#6a5236" }}>{[1, 2, 3, 4].map((k) => <Img key={k} src={staticImg(k)} style={{ flex: 1, objectFit: "cover", filter: "sepia(.8) contrast(1.1)" }} />)}</div></div>}
    <Word tt={tt} at={3.0} x={1500} y={240} txt="a brother" size={120} r={3} />
  </Cam>;
}} />;
const staticImg = (k: number) => img("cut/photo_boy" + k).replace(/\.jpg$/, ".webp");

// m6 · el cincel y el martillo graban «HE WAS RIGHT» en dos renglones dentro de la lápida, con chispas y polvo de piedra en cada golpe
const HStoneEtch: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), up = eio(tt, 0.2, 1.4), txt = "HE WASRIGHT", N = 11, k = cl((tt - 1.6) / (d - 3.0)) * N, n = Math.floor(k), hit = (k - n) < 0.25;
  const pos = (i: number) => i < 6 ? { x: 960 - 150 + i * 60, y: 520 } : { x: 960 - 150 + (i - 6) * 62, y: 640 };
  const cur = pos(Math.min(N - 1, n));
  return <Cam tt={tt} d={d} z={0.07}>
    <Fondo id="L_cementerio" tt={tt} b={4} br={0.7} />
    <div style={{ ...BOX, clipPath: "inset(0 0 8% 0)" }}><Prop id="headstone_blank" x={960} y={1000 + 700 * (1 - up)} w={720} /></div>
    <div style={{ position: "absolute", left: 960, top: 470 + 700 * (1 - up), transform: "translateX(-50%)", width: 420, textAlign: "center", fontFamily: SER, fontWeight: 900, fontSize: 92, lineHeight: "120px", letterSpacing: 4, color: "rgba(50,50,50,.9)", textShadow: "0 -2px 0 rgba(0,0,0,.5), 0 2px 0 rgba(255,255,255,.4)" }}>
      {"HE WAS".slice(0, Math.min(6, n))}<br />{n > 6 ? "RIGHT".slice(0, n - 6) : ""}</div>
    {n < N && tt > 1.6 && <>
      <div style={{ position: "absolute", left: cur.x + 10, top: cur.y - 180 - (hit ? 0 : 30), width: 22, height: 200, background: "linear-gradient(90deg,#aaa,#eee,#888)", transform: "rotate(18deg)", borderRadius: 4 }} />
      <div style={{ position: "absolute", left: cur.x + 40, top: cur.y - 330 - (hit ? 0 : 70), width: 140, height: 60, borderRadius: 8, background: "linear-gradient(#5a5a5a,#2a2a2a)", transform: `rotate(${hit ? 10 : -25}deg)` }} />
      {hit && Array.from({ length: 8 }, (_, j) => <div key={j} style={{ position: "absolute", left: cur.x + 20 + 80 * (rnd(j + n) - 0.5), top: cur.y + 20 - 60 * rnd(j * 3 + n), width: 6, height: 6, borderRadius: "50%", background: j % 2 ? "#ffe7a0" : "#ddd" }} />)}
      <Puff x={cur.x + 30} y={cur.y + 40} r={60} o={hit ? 0.7 : 0.3} col="rgba(220,220,210,.9)" />
    </>}
  </Cam>;
}} />;

// m7 · la parcela partida en cuatro tiras por un hilo tenso con estacas; las botas embarradas caen con golpe en la tira de Gus y dejan barro
const HBootsStrip: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), boot = land(tt, 2.4, 800, 9, 0.3);
  return <Cam tt={tt} d={d} z={0.06} fy={700}>
    <Fondo id="L_granja" tt={tt} b={4} br={0.65} y="80%" />
    {[0, 1, 2].map((i) => { const p = eio(tt, 0.3 + i * 0.35, 1.0 + i * 0.35), x = 480 * (i + 1), top = 380; return <React.Fragment key={i}>
      <div style={{ position: "absolute", left: x - 8, top: top - 40, width: 16, height: 70, background: "linear-gradient(90deg,#c8a878,#7a5a32)", opacity: p > 0 ? 1 : 0 }} />
      <div style={{ position: "absolute", left: x - 1, top, width: 3, height: 700 * p, background: "#fff", boxShadow: "0 0 6px rgba(255,255,255,.9)", transformOrigin: "50% 0", transform: `skewX(${(i - 1) * -20}deg)` }} /></React.Fragment>; })}
    {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 480 * i + 240, top: 420, transform: "translateX(-50%)", padding: "8px 26px", background: "rgba(250,245,230,.92)", fontFamily: HAND, fontSize: 70, fontWeight: 700, color: "#2a2a40", opacity: cl((tt - 1.3 - i * 0.2) * 3), boxShadow: "0 8px 16px rgba(0,0,0,.4)" }}>{["Earl", "Gus", "Lou", "Vern"][i]}</div>)}
    {boot.on && <Prop id="work_boots" x={720} y={980 + boot.dy} w={500} sq={boot.sq} />}
    {boot.on && boot.k > 0.95 && Array.from({ length: 10 }, (_, k) => { const q = cl((tt - 2.75) / 0.6); return <div key={k} style={{ position: "absolute", left: 720 + 300 * (rnd(k) - 0.5) * (0.5 + q), top: 980 - 60 * rnd(k + 5) * Math.sin(q * Math.PI), width: 20, height: 14, borderRadius: "50%", background: "#3a2a14", opacity: q < 1 ? 1 : 0.8 }} />; })}
    <Glow x={720} y={820} r={320} o={cl((tt - 2.8) * 2) * 0.8} />
  </Cam>;
}} />;

// m8 · la olla de hierro: la tapa salta con una nube de vapor y los platos llegan deslizando DE A UNO hasta cada lugar, con sombra
const HPotRoast: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), lidUp = tt > 1.0 ? Math.max(0, Math.sin((tt - 1.0) * 6)) * 60 * Math.exp(-(tt - 1.0) * 0.9) : 0;
  return <Cam tt={tt} d={d} z={0.06} fy={700}>
    <Fondo id="L_cocina" tt={tt} b={8} br={0.5} />
    <Formica y0={600} />
    <Drop tt={tt} at={0.2} id="dutch_oven" x={960} y={860} w={520} h={600} />
    <div style={{ position: "absolute", left: 960 - 230, top: 470 - lidUp, width: 460, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 30%,#4a4a4a,#111 70%)", transform: `rotate(${lidUp * 0.15}deg)`, opacity: tt > 0.9 ? 1 : 0, boxShadow: "0 8px 14px rgba(0,0,0,.5)" }} />
    {Array.from({ length: 10 }, (_, k) => { const p = (tt * 0.45 + k / 10) % 1; return <Puff key={k} x={960 + 90 * Math.sin(p * 5 + k)} y={460 - 380 * p} r={60 + 100 * p} o={cl(tt - 1) * (1 - p) * 0.45} />; })}
    {[[-1, 0], [1, 0], [-1, 1], [1, 1]].map(([s, r], i) => { const a = 1.8 + i * 0.75, p = phys(tt, a, 5, 0.6); if (p <= 0.01) return null; const tx = 960 + s * (420 + 180 * r), ty = 800 + 160 * r;
      return <div key={i} style={{ position: "absolute", left: tx - 160 + s * (1 - p) * 1100, top: ty - 50, width: 320, height: 100, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 45%,#fbfaf4 45%,#d8d4c8 60%,#f4f2ea 70%)", boxShadow: "0 14px 18px rgba(0,0,0,.45)" }} />; })}
    <Word tt={tt} at={d - 2} x={960} y={200} txt="nobody leaves mad" size={110} r={-2} />
  </Cam>;
}} />;

// m9 · el torno: el plato gira con estrías de luz y virutas que saltan; la lata se vuelca DENTRO del banco y los bulones ruedan con sombra
const HLatheSpin: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), tip = 80 * eio(tt, 2.0, 2.5);
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="la_e04" tt={tt} b={7} br={0.5} />
    <Mesa y0={880} tone="#5a5a52" />
    <Prop id="metal_lathe" x={760} y={960} w={1050} />
    <div style={{ position: "absolute", left: 395, top: 515, width: 180, height: 180, borderRadius: "50%", background: `conic-gradient(from ${tt * 2400}deg, rgba(255,255,255,0), rgba(255,255,255,.4) 20deg, rgba(255,255,255,0) 60deg, rgba(255,255,255,.35) 200deg, rgba(255,255,255,0) 240deg)`, mixBlendMode: "screen" }} />
    {Array.from({ length: 10 }, (_, k) => { const q = ((tt * 1.3 + k / 10) % 1); return tt < 1.9 && <div key={k} style={{ position: "absolute", left: 600 + 240 * q, top: 600 - 160 * q + 300 * q * q, width: 26, height: 8, borderRadius: 6, border: "3px solid #d8c8a0", borderBottom: "none", transform: `rotate(${q * 500}deg)`, opacity: 1 - q }} />; })}
    <Prop id="coffee_can_bolts" x={1260} y={960} w={280} r={tip} />
    {tt > 2.3 && Array.from({ length: 8 }, (_, k) => { const q = cl((tt - 2.3 - k * 0.06) / 1.4), ex = 1340 + 300 * q * (0.4 + 0.6 * rnd(k)); return <React.Fragment key={k}>
      <div style={{ position: "absolute", left: ex, top: 990 + rnd(k + 3) * 40, width: 50, height: 10, borderRadius: "50%", background: "rgba(0,0,0,.35)", filter: "blur(2px)" }} />
      <div style={{ position: "absolute", left: ex, top: 960 - 50 * Math.sin(q * Math.PI) + rnd(k + 3) * 40, width: 50, height: 26, borderRadius: 5, background: "linear-gradient(#e8e8e8,#6a6a6a)", transform: `rotate(${q * 720 * (rnd(k) + 0.3)}deg)` }} /></React.Fragment>; })}
    <Word tt={tt} at={1.0} x={1400} y={240} txt="29 years" size={130} r={-3} />
  </Cam>;
}} />;

// m10-11 · la silla azul de nene se estira por tramos (patas, respaldo) hasta ser la silla de roble, contra la mesa amarilla que no se mueve
const HChairGrow: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), g1 = eio(tt, 1.2, 1.8), g2 = eio(tt, 2.0, 2.6), g3 = eio(tt, 2.8, 3.4), g = (g1 + g2 + g3) / 3, mix = g3;
  return <Cam tt={tt} d={d} z={0.06} fy={700}>
    <Fondo id="L_cocina" tt={tt} b={8} br={0.5} />
    <div style={{ position: "absolute", left: 1020, top: 560, width: 900, height: 60, background: "linear-gradient(#efcb5c,#c99a2e)", boxShadow: "0 10px 0 #9a9a9a, 0 30px 40px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 1080, top: 630, width: 20, height: 450, background: "linear-gradient(90deg,#ddd,#777)" }} />
    {(() => { const L = land(tt, 0.2, 700); return L.on && <div style={{ ...BOX, transformOrigin: "760px 1040px", transform: `scale(${1 + 0.25 * g1 + 0.2 * g2},${1 + 0.45 * g1 + 0.3 * g2})` }}><Prop id="child_chair" x={760} y={1040 + L.dy} w={340} sq={L.sq + (Math.sin(tt * 30) * 0.1 * (g1 * (1 - g1) + g2 * (1 - g2)) * 4)} o={1 - mix} /></div>; })()}
    {mix > 0 && <Prop id="wood_chair" x={760} y={1040} w={560} o={mix} />}
    <Word tt={tt} at={0.6} x={460} y={220} txt="age 8" size={120} r={-4} out={2.6} />
    <Word tt={tt} at={3.2} x={460} y={220} txt="age 50" size={120} r={-4} />
  </Cam>;
}} />;

// m11 · el teléfono de pared con cable en espiral cuelga del gancho y tiembla con el timbre; al lado, el reloj llega a las 8 en punto
const HPhoneRing: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), ringing = tt > 1.6 && Math.sin(tt * 3) > 0, ring = ringing ? Math.sin(tt * 70) * 5 : 0, ang = 228 + 12 * eio(tt, 0.2, 1.6);
  return <Cam tt={tt} d={d} z={0.07}>
    <Fondo id="la_e19" tt={tt} b={6} br={0.6} />
    <Prop id="wall_phone" x={700} y={720} w={440} r={ring} sh={0} />
    <svg width={300} height={420} style={{ position: "absolute", left: 600, top: 680 }}><path d={Array.from({ length: 30 }, (_, k) => `${k ? "L" : "M"}${100 + 30 * Math.sin(k * 1.4) + k * 1.5 + ring},${k * 13}`).join(" ")} fill="none" stroke="#d8ccb0" strokeWidth={9} strokeLinecap="round" /></svg>
    <div style={{ position: "absolute", left: 1180, top: 200, width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(#fdfaf0,#e6dcc4)", border: "18px solid #6a4a2a", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
      {Array.from({ length: 12 }, (_, k) => <div key={k} style={{ position: "absolute", left: 180, top: 10, width: 6, height: 26, background: "#333", transformOrigin: "3px 190px", transform: `rotate(${k * 30}deg)` }} />)}
      <div style={{ position: "absolute", left: 178, top: 70, width: 10, height: 120, background: "#222", transformOrigin: "5px 120px", transform: `rotate(${ang}deg)`, borderRadius: 4 }} />
      <div style={{ position: "absolute", left: 180, top: 30, width: 6, height: 160, background: "#222", transformOrigin: "3px 160px", transform: `rotate(${360 * eio(tt, 0.2, 1.6)}deg)`, borderRadius: 4 }} />
    </div>
    {ringing && [0, 1, 2].map((k) => { const q = ((tt - 1.6) * 1.4 + k / 3) % 1; return <div key={k} style={{ position: "absolute", left: 700 - 160 * (1 + q), top: 470 - 100 * (1 + q), width: 320 * (1 + q), height: 200 * (1 + q), borderRadius: "50%", border: "6px solid rgba(255,240,200,.7)", opacity: 1 - q }} />; })}
    <Word tt={tt} at={2.0} x={1380} y={760} txt="Sunday · 8:00" size={100} r={-3} />
  </Cam>;
}} />;

// m12 · el almanaque de la forrajería colgado de un clavo: la mano de Lou dibuja con lápiz de carpintero el óvalo de UN domingo, y la cámara entra a ese día
const HCalCircle: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), circ = eio(tt, 1.0, 2.4), zin = eio(tt, 2.6, d - 0.6), a = circ * Math.PI * 2;
  const cx = 1110, cy = 640, px = cx + 120 * Math.cos(a - Math.PI / 2), py = cy + 70 * Math.sin(a - Math.PI / 2);
  return <div style={{ ...BOX, transformOrigin: `${cx}px ${cy}px`, transform: `scale(${1 + 0.9 * zin})` }}><Cam tt={tt} d={d} z={0.04}>
    <Fondo id="L_cocina" tt={tt} b={8} br={0.55} />
    <div style={{ position: "absolute", left: 950, top: 40, width: 20, height: 20, borderRadius: "50%", background: "#333" }} />
    <div style={{ position: "absolute", left: 560, top: 70, width: 800, height: 940, background: "#f6f2e6", boxShadow: "0 40px 70px rgba(0,0,0,.55)" }}>
      <div style={{ height: 300, background: "linear-gradient(#5a7a3a,#3a5a22)", color: "#fff6dc", fontFamily: SER, fontWeight: 900, textAlign: "center", paddingTop: 40 }}><div style={{ fontSize: 56 }}>KOSTER FEED & SEED</div><div style={{ fontSize: 110 }}>MARCH</div></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", padding: 20, gap: 0 }}>
        {["S", "M", "T", "W", "T", "F", "S"].map((x, i) => <div key={"h" + i} style={{ fontFamily: SER, fontWeight: 900, fontSize: 40, color: i === 0 ? "#b3322a" : "#333", textAlign: "center", height: 60 }}>{x}</div>)}
        {Array.from({ length: 35 }, (_, i) => <div key={i} style={{ fontFamily: SER, fontSize: 52, fontWeight: 700, color: i % 7 === 0 ? "#b3322a" : "#333", textAlign: "center", height: 104, borderTop: "1px solid #ddd" }}>{i < 31 ? i + 1 : ""}</div>)}
      </div>
    </div>
    <svg width={300} height={200} style={{ position: "absolute", left: cx - 150, top: cy - 100 }}><ellipse cx={150} cy={100} rx={120} ry={70} fill="none" stroke="#b3322a" strokeWidth={12} strokeDasharray={620} strokeDashoffset={620 * (1 - circ)} strokeLinecap="round" transform="rotate(-6 150 100)" /></svg>
    {tt > 0.5 && tt < 2.8 && <div style={{ position: "absolute", left: px, top: py, width: 0, height: 0 }}>
      <div style={{ position: "absolute", left: -10, top: -10, width: 300, height: 34, borderRadius: 6, background: "linear-gradient(#e8c060,#c08a20)", transform: "rotate(35deg)", transformOrigin: "0 50%", boxShadow: "0 10px 14px rgba(0,0,0,.4)" }} />
    </div>}
  </Cam></div>;
}} />;

// m13 · el camino de ripio REAL en perspectiva: postes de cerca que pasan; el pastel en tabla y el frasco se cruzan a mitad de las once millas
const HPieRoad: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.4, d - 1.2), meet = 1 - Math.abs(p - 0.5) * 2;
  return <div style={{ ...BOX, transformOrigin: "960px 900px", transform: `scale(${1 + 0.18 * meet})` }}><Cam tt={tt} d={d} z={0.03}>
    <Fondo id="la_e21" tt={tt} b={2} br={0.8} y="60%" />
    {Array.from({ length: 6 }, (_, k) => { const q = ((k / 6) + tt * 0.3) % 1, s = 0.2 + 1.6 * q * q; return <div key={k} style={{ position: "absolute", left: 960 + 120 + 900 * q * q, top: 520 + 420 * q * q - 160 * s, width: 14 * s, height: 180 * s, background: "linear-gradient(90deg,#8a6a42,#4a3418)", opacity: cl(q * 4) }} />; })}
    <Prop id="rhubarb_pie" x={380 + 600 * p} y={940 - 30 * Math.sin(tt * 12) * cl(1 - p)} w={460} />
    <Prop id="apple_butter" x={1560 - 600 * p} y={900 + 20 * Math.sin(tt * 10)} w={260} />
    {Array.from({ length: 4 }, (_, k) => <Puff key={k} x={380 + 600 * p - 260 - k * 60} y={930} r={50 + k * 20} o={0.35 * (1 - k / 4)} col="rgba(220,200,160,.8)" />)}
    <Glow x={960} y={820} r={300} o={meet > 0.85 ? (meet - 0.85) * 6 : 0} />
    <Word tt={tt} at={1.0} x={960} y={200} txt="11 miles" size={130} r={-2} />
  </Cam></div>;
}} />;

// m14 · cenital sobre la alfombra roja del pasillo encerado: un par de zapatos gira 40° con peso y se detiene frente al otro. 17 años
const HShoesTurn: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), turn = phys(tt, 1.4, 5, 0.45), wob = Math.sin(tt * 18) * 3 * cl(1 - Math.abs(tt - 1.8) * 2);
  return <Cam tt={tt} d={d} z={0.06}>
    <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(90deg,#6a4626 0 8px,#9a6c40 8px 150px)" }} />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,240,210,.18), transparent 40%, rgba(255,240,210,.1) 60%, transparent)" }} />
    <div style={{ position: "absolute", left: 640, top: 0, width: 640, height: 1080, background: "linear-gradient(90deg,#5a1010,#8a1e1e 10%,#8a1e1e 90%,#5a1010)", boxShadow: "inset 0 0 0 10px #c8a040" }} />
    <div style={{ ...BOX, transformOrigin: "960px 300px", transform: "rotate(180deg)" }}><Prop id="dress_shoes" x={960} y={420} w={420} /></div>
    <div style={{ ...BOX, transformOrigin: "960px 780px", transform: `rotate(${-40 * (1 - turn) + wob}deg) translateX(${120 * (1 - turn)}px)` }}><Prop id="dress_shoes" x={960} y={900} w={420} /></div>
    <Word tt={tt} at={2.6} x={1600} y={500} txt="a nod" size={130} r={-2} />
    <Word tt={tt} at={3.2} x={1600} y={650} txt="17 years" size={90} r={-2} />
  </Cam>;
}} />;

// m14-15 · dos filas de peones de madera enfrentadas sobre la mesa; el primero de cada fila cae y arrastra a los demás en cadena (cámara baja lateral)
const HPawnLines: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), T0 = d - 3.6, fall = (j: number) => 82 * eio(tt, T0 + j * 0.16, T0 + j * 0.16 + 0.3);
  return <Cam tt={tt} d={d} z={0.05} fy={720}>
    <Fondo id="L_cocina" tt={tt} b={8} br={0.5} />
    <Formica y0={640} />
    {Array.from({ length: 10 }, (_, i) => { const side = i < 5 ? -1 : 1, j = i % 5, x = 960 + side * (130 + j * 140), L = land(tt, 0.3 + j * 0.22 + (side > 0 ? 0.11 : 0), 500), sz = 200 - j * 10;
      return L.on && <div key={i} style={{ ...BOX, transformOrigin: `${x}px 960px`, transform: `rotate(${-side * fall(j)}deg)` }}><Prop id="wood_pawn" x={x} y={960 + L.dy} w={sz} sq={L.sq} flip={side > 0} /></div>; })}
    <Word tt={tt} at={1.6} x={960} y={230} txt="not a war" size={130} r={-3} />
  </Cam>;
}} />;

// m17 · el monitor de hospital real (marco, brillo en el vidrio) en su carrito junto a la cama; la línea verde late; «tomorrow» se escribe grande y se tacha
const HMonitorTomorrow: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), N = 70, pts = Array.from({ length: N }, (_, i) => { const x = i / (N - 1), ph = ((x * 3 + tt * 0.9) % 1); const y = ph > 0.42 && ph < 0.46 ? -1 : ph > 0.46 && ph < 0.5 ? 0.8 : 0; return `${40 + x * 820},${170 + y * 110}`; }).join(" ");
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="la_e25" tt={tt} b={7} br={0.45} />
    <div style={{ position: "absolute", left: 980, top: 820, width: 900, height: 200, background: "linear-gradient(#e8ece8,#b8bcb8)", borderRadius: 20, boxShadow: "0 -6px 0 #f4f6f4, 0 30px 40px rgba(0,0,0,.5)" }} />
    <div style={{ position: "absolute", left: 470, top: 640, width: 30, height: 440, background: "linear-gradient(90deg,#888,#ddd,#888)" }} />
    <div style={{ position: "absolute", left: 60, top: 120, width: 900, height: 520, borderRadius: 26, background: "linear-gradient(#3a4044,#1a1e20)", padding: 30, boxShadow: "0 40px 80px rgba(0,0,0,.7)" }}>
      <div style={{ position: "relative", width: 840, height: 400, background: "#020806", borderRadius: 10, overflow: "hidden" }}>
        <svg width={900} height={400}><polyline points={pts} fill="none" stroke="#5aff9a" strokeWidth={7} style={{ filter: "drop-shadow(0 0 10px #5aff9a)" }} /><text x={640} y={360} fill="#5aff9a" fontFamily="monospace" fontSize={60} fontWeight={700}>{Math.round(64 + 3 * Math.sin(tt))}</text></svg>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(125deg, rgba(255,255,255,.14), transparent 35%)" }} />
      </div>
    </div>
    <Ink tt={tt} at={1.2} dur={1.2} x={1060} y={260} txt="tomorrow" size={170} col="#f6eeda" w={820} />
    <svg width={820} height={160} style={{ position: "absolute", left: 1040, top: 300 }}><path d={`M10,90 Q400,${60 + 10 * Math.sin(tt)} ${10 + 760 * eio(tt, 2.8, 3.4)},70`} fill="none" stroke="#ff4a3a" strokeWidth={18} strokeLinecap="round" /></svg>
  </Cam>;
}} />;

// m17-18 · la cama de hospital real con sábana en perspectiva y luz fría de ventana; la silla verde sale del marco de la puerta y se arrastra hasta la cama
const HChairInRoom: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.8, 3.2), jig = Math.sin(tt * 26) * 2 * (p > 0 && p < 1 ? 1 : 0);
  return <Cam tt={tt} d={d} z={0.07} fx={1100}>
    <Fondo id="la_e26" tt={tt} b={10} br={0.45} />
    <div style={{ position: "absolute", left: 1500, top: 80, width: 360, height: 480, background: "linear-gradient(#cfe0ec,#9ab0c0)", boxShadow: "inset 0 0 0 16px #e8ece8" }} />
    <div style={{ position: "absolute", left: 1500, top: 80, width: 360, height: 1000, background: "linear-gradient(200deg, rgba(200,225,245,.35), transparent 60%)", mixBlendMode: "screen" }} />
    {/* la cama */}
    <div style={{ position: "absolute", left: 1080, top: 560, width: 860, height: 300, transform: "perspective(1400px) rotateX(48deg)", transformOrigin: "50% 100%", background: "linear-gradient(#ffffff,#dfe4e8)", borderRadius: 14, boxShadow: "0 30px 40px rgba(0,0,0,.4)" }} />
    <div style={{ position: "absolute", left: 1130, top: 600, width: 240, height: 110, borderRadius: 40, background: "linear-gradient(#fbfbfb,#d8dde2)" }} />
    <div style={{ position: "absolute", left: 1080, top: 860, width: 860, height: 220, background: "linear-gradient(#c8ccd0,#8a9096)", boxShadow: "inset 0 10px 0 #e8ecef" }} />
    {/* el marco de la puerta */}
    <div style={{ position: "absolute", left: 60, top: 100, width: 400, height: 980, border: "30px solid #8a7a5a", borderBottom: "none", background: "linear-gradient(#2a2a22,#121210)" }} />
    <Prop id="hospital_chair" x={260 + 680 * p + jig} y={1000 - 20 * p} w={420 + 140 * p} />
    {p > 0 && p < 1 && <Dust tt={tt} at={tt - 0.3} x={260 + 680 * p - 100} y={1000} w={200} />}
    <Word tt={tt} at={3.2} x={700} y={200} txt="in the room" size={130} r={-3} />
  </Cam>;
}} />;

// m18-19 · MANOS viejas se pasan la navaja de hueso en primer plano; al abrirse la hoja brilla y el nombre de cada dueño se estampa en la tira de cuero
const HKnifeHands: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), st = [0.2, bt(h, 0, 2.5), bt(h, 1, 5), bt(h, 2, 7.5)], nm = ["HENRY", "EARL", "LOU", "TOMMY"], cur = Math.max(0, st.filter((x) => tt >= x).length - 1);
  const pass = cl((tt - st[cur]) / 0.8), open = eio(tt, 0.6, 1.2), shine = cl(1 - Math.abs(tt - 1.3) * 3);
  const hand = (x: number, from: number, o: number) => <div style={{ position: "absolute", left: x - 180, top: 600, width: 360, height: 300, opacity: o, transform: `translateX(${from}px)` }}>
    <div style={{ position: "absolute", left: 40, top: 80, width: 300, height: 180, borderRadius: "90px 60px 70px 90px", background: "linear-gradient(170deg,#d8a888,#9a6648)", boxShadow: "0 20px 30px rgba(0,0,0,.5), inset 0 -10px 20px rgba(80,40,20,.4)" }} />
    {[0, 1, 2, 3].map((k) => <div key={k} style={{ position: "absolute", left: 60 + k * 62, top: 40 + (k % 2) * 10, width: 56, height: 90, borderRadius: 28, background: "linear-gradient(#d0a080,#a8704e)", boxShadow: "inset 0 -6px 10px rgba(80,40,20,.35)" }} />)}
  </div>;
  return <Cam tt={tt} d={d} z={0.05} fy={720}>
    <Fondo id="la_e27" tt={tt} b={9} br={0.45} />
    <div style={{ ...BOX, transform: `translate(${-800 + 400 * (cur - 1 + pass)}px,${-160 * Math.sin(pass * Math.PI)}px) rotate(${-20 * Math.sin(pass * Math.PI)}deg)`, transformOrigin: "1160px 700px" }}>
      <Prop id={open > 0.5 ? "knife_open" : "knife_closed"} x={1160} y={860} w={560} r={-8} sh={0.6} />
      <Glow x={1240} y={600} r={200} o={shine} col="255,255,255" />
    </div>
    <div style={{ position: "absolute", left: 160, top: 900, width: 1600, height: 110, background: "linear-gradient(#8a5a2a,#5a3618)", borderRadius: 8, boxShadow: "0 16px 24px rgba(0,0,0,.5)", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
      {nm.map((n, i) => <div key={i} style={{ fontFamily: SER, fontWeight: 900, fontSize: 64, letterSpacing: 6, color: i <= cur ? "#2a1606" : "transparent", textShadow: i <= cur ? "0 2px 0 rgba(255,200,140,.4)" : "none", transform: `scale(${i === cur ? 1 + 0.3 * (1 - cl((tt - st[i]) * 4)) : 1})` }}>{n}</div>)}
    </div>
  </Cam>;
}} />;

// m19 · el cajón de recetas de madera abre la tapa; una ficha sube con peso, viene a cámara y se pega con cinta en la tapa interior
const HRecipeBox: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), up = phys(tt, 1.0, 5, 0.5), cam = eio(tt, 2.2, 3.2);
  return <div style={{ ...BOX, transformOrigin: "1000px 420px", transform: `scale(${1 + 0.35 * cam})` }}><Cam tt={tt} d={d} z={0.05}>
    <Fondo id="L_cocina" tt={tt} b={8} br={0.5} />
    <Formica y0={740} />
    <Drop tt={tt} at={0.2} id="recipe_box" x={1000} y={1000} w={640} />
    <div style={{ position: "absolute", left: 1000 - 230, top: 640 - 330 * up, width: 460, height: 290, background: "repeating-linear-gradient(#fbf6e6 0 50px,#b9cfe2 50px 52px)", borderTop: "12px solid #c0392b", transform: `rotate(${-5 + 3 * up}deg)`, boxShadow: "0 22px 36px rgba(0,0,0,.45)", opacity: cl(up * 3), fontFamily: HAND, fontWeight: 700, fontSize: 52, color: "#22314f", padding: "18px 26px", lineHeight: "52px" }}>
      Ada's apple pie<br /><span style={{ color: "#b3322a" }}>Next: Tommy</span>
      <div style={{ position: "absolute", left: 170, top: -24, width: 130, height: 40, background: "rgba(240,230,190,.85)", transform: "rotate(-4deg)", opacity: cam }} />
    </div>
  </Cam></div>;
}} />;

// m20 · la foto REAL de las huellas en la nieve hacia el granero; por encima, las huellas grandes se hunden de a una con sombra interna y las chicas pisan adentro
const HSnowPrints: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), N = 7;
  return <Cam tt={tt} d={d} z={0.08} fy={700}>
    <Fondo id="la_e28" tt={tt} b={1} br={0.85} y="70%" />
    {Array.from({ length: N }, (_, i) => { const a = 0.3 + i * 0.45, s = 2.4 - i * 0.24, x = 860 + (i % 2 ? 90 : -90) * s / 2 - i * 20, y = 1060 - i * 72, big = cl((tt - a) * 4), sm = cl((tt - a - 1.8) * 4);
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x, top: y - 70 * s, width: 70 * s, height: 150 * s, borderRadius: "42% 42% 46% 46%", background: "radial-gradient(ellipse at 50% 40%, rgba(110,130,150,.8), rgba(180,198,212,.45) 70%)", transform: `rotate(${i % 2 ? 8 : -8}deg) scale(${big})`, boxShadow: "inset 0 10px 14px rgba(50,70,90,.6), 0 -3px 0 rgba(255,255,255,.8)" }} />
        <div style={{ position: "absolute", left: x + 16 * s, top: y - 50 * s, width: 38 * s, height: 90 * s, borderRadius: "42% 42% 46% 46%", background: "rgba(70,86,104,.8)", transform: `rotate(${i % 2 ? 8 : -8}deg) scale(${sm})`, boxShadow: "inset 0 6px 8px rgba(30,40,50,.6)" }} /></React.Fragment>; })}
    {Array.from({ length: 40 }, (_, k) => <div key={k} style={{ position: "absolute", left: (k * 137 + tt * 50) % 1920, top: (k * 71 + tt * 80) % 1080, width: 6 + (k % 3) * 2, height: 6 + (k % 3) * 2, borderRadius: "50%", background: "#fff", opacity: 0.8 }} />)}
  </Cam>;
}} />;

// m21 · la foto vieja de la mula cae con peso sobre la mesa; el sello de goma baja y estampa «1936» ENTERO sobre el cielo de la foto
const HMuleStamp: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h);
  return <Cam tt={tt} d={d} z={0.07}>
    <Fondo id="la_e08" tt={tt} b={10} br={0.45} />
    <Mesa y0={760} />
    <Drop tt={tt} at={0.2} id="mule_photo" x={760} y={1000} w={760} r={-4} />
    <Sello tt={tt} at={1.6} x={740} y={420} txt="1936" size={120} r={-10} />
    <Word tt={tt} at={2.6} x={1450} y={500} txt="over a mule" size={110} r={-3} />
  </Cam>;
}} />;

// m22 · la ventana de la cocina con la nieve cruzando de costado y el montón creciendo en el alféizar; la Philco al frente con la aguja que barre y el parlante que vibra
const HPhilcoStorm: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), drift = eio(tt, 0.2, d) * 120, needle = 300 + 220 * Math.sin(tt * 0.9), vib = Math.sin(tt * 60) * 1.5;
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="L_cocina" tt={tt} b={8} br={0.45} />
    <div style={{ position: "absolute", left: 360, top: 80, width: 1200, height: 640, overflow: "hidden", boxShadow: "inset 0 0 0 26px #ece4cc, 0 20px 40px rgba(0,0,0,.4)" }}>
      <Img src={img("la_e29")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.85)" }} />
      {Array.from({ length: 80 }, (_, k) => <div key={k} style={{ position: "absolute", left: ((k * 211 + tt * (800 + (k % 5) * 220)) % 1500) - 150, top: (k * 97 + tt * 140) % 640, width: 10, height: 5, borderRadius: 4, background: "#fff", opacity: 0.85 }} />)}
      <div style={{ position: "absolute", left: 300, top: 0, width: 26, height: 640, background: "#ece4cc" }} /><div style={{ position: "absolute", left: 0, top: 300, width: 1200, height: 26, background: "#ece4cc" }} />
      <div style={{ position: "absolute", left: 26, bottom: 26, width: 1148, height: drift, background: "linear-gradient(#ffffff,#dde6ec)", borderRadius: "40% 60% 0 0 / 60% 80% 0 0" }} />
    </div>
    <Mesa y0={820} />
    <div style={{ ...BOX, transform: `translate(${vib}px,0)` }}><Prop id="philco_radio" x={960} y={1050} w={600} /></div>
    <div style={{ position: "absolute", left: 960 - 220 + needle * 0.6, top: 850, width: 5, height: 50, background: "#b3221a" }} />
    <Glow x={960} y={870} r={200} o={0.6 + 0.3 * Math.sin(tt * 5)} col="255,190,90" />
    <Word tt={tt} at={1.4} x={1650} y={940} txt="Jan 1975" size={90} r={-3} />
  </Cam>;
}} />;

// m23 · la caja de herramientas roja cerrada con su candado: los copos caen y se ACUMULAN sobre la tapa formando una capa de nieve
const HToolboxSnow: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), cover = eio(tt, 0.8, d - 0.8);
  return <Cam tt={tt} d={d} z={0.07}>
    <Fondo id="la_e05" tt={tt} b={9} br={0.4} />
    <Mesa y0={800} tone="#6a4a2a" />
    <Prop id="toolbox_red" x={960} y={990} w={720} />
    <div style={{ position: "absolute", left: 950, top: 830, width: 40, height: 46, borderRadius: "8px 8px 4px 4px", background: "linear-gradient(#e8c870,#8a6a2a)", border: "6px solid #aa8a3a", borderBottom: "none" }} />
    <div style={{ position: "absolute", left: 620, top: 690 - 50 * cover, width: 680, height: 30 + 60 * cover, borderRadius: "50% 50% 14px 14px / 80% 80% 14px 14px", background: "linear-gradient(#ffffff,#e4ecf2)", opacity: cl(cover * 3), boxShadow: "0 6px 10px rgba(0,0,0,.2)" }} />
    {Array.from({ length: 50 }, (_, k) => { const q = ((tt * 0.35 + rnd(k)) % 1); return <div key={k} style={{ position: "absolute", left: 560 + rnd(k + 9) * 800 + 30 * Math.sin(tt * 2 + k), top: -20 + 720 * q, width: 8 + (k % 3) * 4, height: 8 + (k % 3) * 4, borderRadius: "50%", background: "#fff", opacity: 0.9 }} />; })}
    <Word tt={tt} at={2.0} x={960} y={200} txt="I could have gone." size={110} r={-2} />
  </Cam>;
}} />;

// m24 · la libreta de espiral en perspectiva: la mano con lápiz grueso escribe SÓLO el número y dos palabras por paso, y dibuja la tilde
const HStepsPad: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), st = [0.3, bt(h, 0, 4), bt(h, 1, 8), bt(h, 2, 12)], tx = ["1  Plain Tuesday", "2  Call. Don't text.", "3  Not the old business", "4  Talk about nothing"];
  const cur = Math.max(0, st.filter((x) => tt >= x).length - 1), pw = cl((tt - st[cur]) / 1.2), hx = 520 + 760 * pw, hy = 240 + cur * 190;
  return <Cam tt={tt} d={d} z={0.05}>
    <Fondo id="L_cocina" tt={tt} b={8} br={0.5} />
    <Formica y0={760} />
    <div style={{ position: "absolute", left: 360, top: 60, width: 1200, height: 900, transform: "perspective(1800px) rotateX(18deg)", transformOrigin: "50% 100%", background: "repeating-linear-gradient(#fbf8ef 0 94px,#9fc0dd 94px 96px)", borderLeft: "6px solid #d9534f", boxShadow: "0 40px 70px rgba(0,0,0,.55)" }}>
      <div style={{ position: "absolute", left: 0, top: -30, width: 1200, height: 40, background: "repeating-linear-gradient(90deg,transparent 0 30px,#888 30px 44px,transparent 44px 60px)", borderRadius: 10 }} />
      {tx.map((s_, i) => <React.Fragment key={i}><Ink tt={tt} at={st[i]} dur={1.2} x={70} y={120 + i * 190} txt={s_} size={92} w={1000} />
        {tt > st[i] + 1.4 && <svg width={120} height={110} style={{ position: "absolute", left: 1060, top: 110 + i * 190 }}><path d="M10,60 L45,95 L110,10" fill="none" stroke="#2e8b3a" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={200} strokeDashoffset={200 * (1 - cl((tt - st[i] - 1.4) * 3))} /></svg>}</React.Fragment>)}
    </div>
    <div style={{ position: "absolute", left: hx, top: hy, width: 0, height: 0 }}>
      <div style={{ position: "absolute", left: 0, top: -40, width: 26, height: 280, borderRadius: 6, background: "linear-gradient(90deg,#c08a20,#e8c060)", transform: "rotate(-30deg)", transformOrigin: "50% 0" }} />
    </div>
  </Cam>;
}} />;

// m25 · la servilleta arrugada: un marcador rojo de verdad tacha «I'm sorry if you felt» de un trazo y redondea «my part», con la cámara pegada al trazo
const HSorryScrap: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), x1 = eio(tt, 1.4, 2.0), circ = eio(tt, 3.0, 4.0), mk = tt < 2.0 ? { x: 160 + 860 * x1, y: 300 } : { x: 1080 + 300 * Math.cos(circ * 6.28), y: 640 + 90 * Math.sin(circ * 6.28) }, zf = eio(tt, 2.6, 3.2);
  return <div style={{ ...BOX, transformOrigin: "960px 560px", transform: `scale(${1 + 0.1 * zf})` }}><Cam tt={tt} d={d} z={0.04}>
    <Fondo id="L_cocina" tt={tt} b={8} br={0.45} />
    <Formica y0={700} />
    <div style={{ position: "absolute", left: 160, top: 120, width: 1600, height: 760, background: "radial-gradient(circle at 30% 30%,#fffdf6,#ece6d4)", transform: "rotate(-2deg)", boxShadow: "0 40px 70px rgba(0,0,0,.5)", clipPath: "polygon(1% 3%,20% 0,45% 2%,70% 0,99% 2%,100% 40%,98% 97%,60% 100%,30% 98%,0 100%,2% 50%)" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(35deg, rgba(0,0,0,.03) 0 30px, rgba(255,255,255,.4) 30px 34px, transparent 34px 90px)" }} />
      <Ink tt={tt} at={0.2} dur={0.9} x={80} y={110} txt="I'm sorry if you felt…" size={96} col="#555" w={1300} />
      <div style={{ position: "absolute", left: 70, top: 168, width: 900 * x1, height: 16, background: "#d42a1a", borderRadius: 8, transform: "rotate(-1deg)" }} />
      <Ink tt={tt} at={2.0} dur={1.0} x={80} y={420} txt="I'm sorry for my part." size={120} w={1400} col="#22314f" />
      <svg width={700} height={260} style={{ position: "absolute", left: 640, top: 370 }}><ellipse cx={350} cy={130} rx={320} ry={100} fill="none" stroke="#d42a1a" strokeWidth={14} strokeDasharray={1700} strokeDashoffset={1700 * (1 - circ)} strokeLinecap="round" /></svg>
    </div>
    {tt > 1.3 && tt < 4.2 && <div style={{ position: "absolute", left: mk.x, top: mk.y, width: 0, height: 0 }}>
      <div style={{ position: "absolute", left: 0, top: -30, width: 50, height: 300, borderRadius: "10px 10px 20px 20px", background: "linear-gradient(90deg,#8a0a0a,#d42a1a,#8a0a0a)", transform: "rotate(-25deg)", transformOrigin: "50% 0", boxShadow: "0 20px 30px rgba(0,0,0,.4)" }} />
    </div>}
  </Cam></div>;
}} />;

// m26 · el saco de granero desplegado sobre la mesa: la mano saca el sobre amarillo del bolsillo interior y lo acerca a cámara
const HCoatPocket: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), b = bt(h, 0, 3), up = eio(tt, b + 0.3, b + 1.8), unf = eio(tt, 0.2, 1.2);
  return <Cam tt={tt} d={d} z={0.06} fy={600}>
    <Fondo id="la_e05" tt={tt} b={9} br={0.45} />
    <Mesa y0={620} tone="#6a4a2a" />
    <div style={{ ...BOX, transformOrigin: "960px 1060px", transform: `scaleY(${0.3 + 0.7 * unf})` }}><Prop id="barn_coat" x={960} y={1080} w={1000} /></div>
    <div style={{ ...BOX, opacity: cl((tt - b) * 3) }}>
      <Prop id="envelope_stamp" x={1040 + 60 * up} y={760 - 240 * up} w={300 + 180 * up} r={-10 + 10 * up} sh={up} />
    </div>
    <Glow x={1100} y={560} r={360} o={up * 0.8} />
  </Cam>;
}} />;

// m27 · el papel de carta viejo sobre el escritorio: la pluma fuente escribe renglón por renglón (tinta húmeda que brilla) y al costado el sobre abierto
const HLetterInk: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), L = ["Lou.", "You were right.", "I was just tired.", "I'm sorry I walked out.", "— Gus"], dt = (d - 2) / L.length, cur = Math.min(L.length - 1, Math.floor((tt - 0.4) / dt)), pw = cl(((tt - 0.4) - cur * dt) / (dt * 0.85));
  const nx = 520 + 70 + Math.min(900, L[Math.max(0, cur)].length * 44) * pw, ny = 130 + Math.max(0, cur) * 160 + 40;
  return <Cam tt={tt} d={d} z={0.05} fy={420}>
    <Fondo id="la_e34" tt={tt} b={9} br={0.45} />
    <Mesa y0={900} />
    <div style={{ position: "absolute", left: 520, top: 40, width: 1000, height: 960, background: "linear-gradient(#f4ead0,#e2d2a8)", transform: "rotate(1.2deg)", boxShadow: "0 40px 80px rgba(0,0,0,.6)" }}>
      <Grain id="carta" o={0.35} />
      {L.map((l, i) => <Ink key={i} tt={tt} at={0.4 + i * dt} dur={dt * 0.85} x={70} y={90 + i * 160} txt={l} size={i === 0 || i === L.length - 1 ? 92 : 80} w={900} col={i === cur && pw < 1 ? "#2a3a78" : "#1e2a48"} />)}
    </div>
    <Prop id="envelope_stamp" x={260} y={980} w={420} r={-12} />
    {tt > 0.4 && tt < d - 0.8 && <div style={{ position: "absolute", left: nx, top: ny, width: 0, height: 0 }}>
      <div style={{ position: "absolute", left: -6, top: -360, width: 30, height: 380, borderRadius: "14px 14px 4px 4px", background: "linear-gradient(90deg,#0a0a0a,#3a3a4a,#0a0a0a)", transform: "rotate(28deg)", transformOrigin: "50% 100%" }} />
      <div style={{ position: "absolute", left: -2, top: -30, width: 14, height: 34, background: "linear-gradient(90deg,#c8a040,#f0d890)", clipPath: "polygon(0 0,100% 0,50% 100%)", transform: "rotate(28deg)", transformOrigin: "50% 100%" }} />
    </div>}
  </Cam>;
}} />;

// m28 · el buzón de campo REAL en su poste junto al ripio: la bandera roja en bisagra sube, tiembla arriba y vuelve a bajar
const HMailboxFlag: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), up = Math.max(0, Math.sin(cl((tt - 0.8) / (d - 2.0)) * Math.PI)), fl = 90 * Math.min(1, up * 1.6) + Math.sin(tt * 22) * 4 * up;
  return <Cam tt={tt} d={d} z={0.07} fx={1100}>
    <Fondo id="L_granja" tt={tt} b={6} br={0.6} />
    <div style={{ position: "absolute", left: 1000, top: 640, width: 60, height: 440, background: "linear-gradient(90deg,#6a5032,#a8865a,#5a4024)" }} />
    <div style={{ position: "absolute", left: 1080, top: 1050, width: 500, height: 30, borderRadius: "50%", background: "rgba(0,0,0,.35)", filter: "blur(6px)" }} />
    <div style={{ position: "absolute", left: 760, top: 470, width: 560, height: 220, borderRadius: "110px 110px 6px 6px", background: "linear-gradient(#e8ecec,#9aa2a6 60%,#6a7276)", boxShadow: "0 30px 40px rgba(0,0,0,.45), inset -20px 0 30px rgba(0,0,0,.2)" }} />
    <div style={{ position: "absolute", left: 740, top: 470, width: 40, height: 220, borderRadius: "20px 20px 4px 4px", background: "linear-gradient(90deg,#5a6266,#c8ccd0)" }} />
    {/* bandera en bisagra */}
    <div style={{ position: "absolute", left: 1260, top: 600, width: 0, height: 0, transform: `rotate(${-fl}deg)` }}>
      <div style={{ position: "absolute", left: -10, top: -10, width: 200, height: 20, background: "#c0221a", borderRadius: 4 }} />
      <div style={{ position: "absolute", left: 130, top: -60, width: 90, height: 80, background: "linear-gradient(#e0342a,#a0180e)", borderRadius: 6, boxShadow: "0 8px 12px rgba(0,0,0,.4)" }} />
    </div>
    <div style={{ position: "absolute", left: 1248, top: 588, width: 24, height: 24, borderRadius: "50%", background: "#444" }} />
  </Cam>;
}} />;

// m28-29 · la camioneta azul recorre el ripio en perspectiva larga con la nube de polvo atrás; adentro, el odómetro mecánico del tablero rueda hasta 11
const HTruckMiles: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), p = eio(tt, 0.3, d - 0.8), x = 200 + 1300 * p, sc = 1.0 - 0.45 * p, y = 980 - 260 * p;
  return <Cam tt={tt} d={d} z={0.04}>
    <Fondo id="la_e21" tt={tt} b={2} br={0.8} y="60%" />
    {Array.from({ length: 7 }, (_, k) => <Puff key={k} x={x - (360 + k * 110) * sc} y={y - 60 * sc - k * 6} r={(70 + k * 30) * sc} o={0.45 * (1 - k / 7) * cl(p * 6)} col="rgba(215,195,155,.85)" />)}
    <Prop id="pickup_truck" x={x} y={y + 4 * Math.sin(tt * 18)} w={860 * sc} flip />
    <div style={{ position: "absolute", left: 1520, top: 70, width: 340, height: 200, borderRadius: 20, background: "linear-gradient(#2a2a2a,#0a0a0a)", boxShadow: "0 20px 30px rgba(0,0,0,.6), inset 0 0 0 6px #555" }} />
    <Odo x={1690} y={170} v={11 * p} n={2} size={100} />
    <Word tt={tt} at={1.0} x={560} y={200} txt="go first" size={130} r={-2} />
  </Cam>;
}} />;

// m29 · el calendario de hojas arrancables: SATURDAY se arranca y deja ver TUESDAY; el reloj de huevo de cinco minutos se da cuerda con la perilla
const HTuesdayTimer: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), days = ["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY"], tear = (i: number) => eio(tt, 0.4 + i * 0.6, 0.9 + i * 0.6), k = [0, 1, 2].filter((i) => tear(i) >= 1).length;
  const knob = tt < 2.6 ? -300 * eio(tt, 2.2, 2.8) : -300 + 50 * (tt - 2.8);
  const page = (s: string, red: boolean) => <div style={{ position: "absolute", inset: 0, background: "#f4efe2" }}><div style={{ height: 80, background: "#2a4a6a" }} /><div style={{ fontFamily: SER, fontWeight: 900, fontSize: 100, color: red ? "#b3322a" : "#2a1d0c", textAlign: "center", marginTop: 150 }}>{s}</div></div>;
  return <Cam tt={tt} d={d} z={0.06}>
    <Fondo id="L_cocina" tt={tt} b={8} br={0.5} />
    <Formica y0={800} />
    <div style={{ position: "absolute", left: 280, top: 160, width: 700, height: 520, boxShadow: "0 30px 50px rgba(0,0,0,.5)" }}>{page(days[Math.min(3, k + 1)], k + 1 === 3)}</div>
    {k < 3 && <div style={{ position: "absolute", left: 280, top: 160, width: 700, height: 520, transformOrigin: "0 0", transform: `translate(${300 * tear(k) ** 2}px,${600 * tear(k) ** 2}px) rotate(${50 * tear(k)}deg)`, opacity: 1 - tear(k) * 0.5 }}>{page(days[k], false)}</div>}
    <div style={{ ...BOX, transformOrigin: "1420px 860px", transform: `rotate(${knob * 0.04}deg)` }}><Drop tt={tt} at={0.3} id="egg_timer" x={1420} y={980} w={400} /></div>
    <Word tt={tt} at={2.9} x={1420} y={260} txt="5 minutes" size={110} r={-3} />
  </Cam>;
}} />;

// m30 · el repaso: siete fichas caen con peso una a una en abanico ABIERTO (sin pisarse el texto); «GO FIRST» aterriza arriba, entera dentro del cuadro
const HRecapCards: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), tx = ["Right is expensive", "Talk money early", "Oldest isn't boss", "Call on dull days", "Spouses keep the road", "Say it in the room", "One thing for all"];
  const st = [0.3, ...Array.from({ length: 6 }, (_, i) => bt(h, i, 2 + i * 2.6))], last = bt(h, 6, 18), LL = land(tt, last, 700, 9, 0.4);
  const pos = [[330, 330], [960, 300], [1590, 330], [330, 640], [960, 610], [1590, 640], [960, 900]];
  return <Cam tt={tt} d={d} z={0.04}>
    <Fondo id="L_cocina" tt={tt} b={9} br={0.45} />
    <Formica y0={380} />
    {tx.map((s_, i) => { const L = land(tt, st[i], 600, 9, 0.4); if (!L.on) return null; const [x, y] = pos[i], r = (rnd(i) - 0.5) * 8;
      return <div key={i} style={{ position: "absolute", left: x - 300, top: y - 130 + L.dy, width: 600, height: 250, background: "repeating-linear-gradient(#fbf6e6 0 54px,#b9cfe2 54px 56px)", borderTop: "12px solid #c0392b", transform: `rotate(${r}deg) scaleY(${1 - 0.1 * L.sq})`, boxShadow: "0 18px 30px rgba(0,0,0,.5)", fontFamily: HAND, fontWeight: 700, fontSize: 66, color: "#22314f", padding: "56px 16px", textAlign: "center", opacity: LL.on ? 0.55 : 1 }}>{s_}</div>; })}
    {LL.on && <div style={{ position: "absolute", left: 960 - 380, top: 340 + LL.dy, width: 760, height: 380, background: "#fff3c8", borderTop: "16px solid #b3322a", transform: `rotate(-2deg) scaleY(${1 - 0.1 * LL.sq})`, boxShadow: "0 40px 60px rgba(0,0,0,.6)", fontFamily: HAND, fontWeight: 700, fontSize: 150, color: "#22314f", textAlign: "center", lineHeight: "330px" }}>GO FIRST</div>}
  </Cam>;
}} />;

export const HCA2: Record<string, C> = {
  phoneScroll: HPhoneScroll, emptyChairs: HEmptyChairs, boxTease: HBoxTease, iowaPin: HIowaPin, kettleCorner: HKettleCorner, brotherDeal: HBrotherDeal,
  leanSilo: HLeanSilo, corncobArc: HCorncobArc, mugSlam: HMugSlam, capDoor: HCapDoor, yearsTear: HYearsTear, scaleTip: HScaleTip, stoneEtch: HStoneEtch,
  bootsStrip: HBootsStrip, potRoast: HPotRoast, latheSpin: HLatheSpin, chairGrow: HChairGrow, phoneRing: HPhoneRing, calCircle: HCalCircle, pieRoad: HPieRoad,
  shoesTurn: HShoesTurn, pawnLines: HPawnLines, monitorTomorrow: HMonitorTomorrow, chairInRoom: HChairInRoom, knifeHands: HKnifeHands, recipeBox: HRecipeBox,
  snowPrints: HSnowPrints, muleStamp: HMuleStamp, philcoStorm: HPhilcoStorm, toolboxSnow: HToolboxSnow, stepsPad: HStepsPad, sorryScrap: HSorryScrap,
  coatPocket: HCoatPocket, letterInk: HLetterInk, mailboxFlag: HMailboxFlag, truckMiles: HTruckMiles, tuesdayTimer: HTuesdayTimer, recapCards: HRecapCards,
};
