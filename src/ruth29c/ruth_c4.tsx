// ruth29c · 3ª vuelta (29-oct): los once ≤5 de la ronda 1, con objetos FOTORREALES recortados (public/img/<slug>/cut) y la física de pk.
// Todo entero en cuadro, acción visible a los 0,3 s, objetos apoyados con sombra de contacto, sin rótulos de esquina.
import React from "react";
import { cl, eio, phys } from "./hkit";
import { S, D, bt, C, Prop, Dust, Cam, Mesa, Luz, land, swing, SER } from "./pk";

const SKY = "linear-gradient(#a8c4d8 0%,#e8e0c0 46%,#b8a06a 48%,#7a5a32 100%)";
const Suelo: React.FC<{ y0?: number; c1?: string; c2?: string }> = ({ y0 = 560, c1 = "#9a7a4a", c2 = "#5a4022" }) => <div style={{ position: "absolute", left: -200, top: y0, width: 2320, height: 1300 - y0, background: `radial-gradient(circle at 30% 30%,rgba(0,0,0,.12) 2px,transparent 3px) 0 0/22px 22px, linear-gradient(${c1},${c2})`, transform: "perspective(900px) rotateX(42deg)", transformOrigin: "50% 0" }} />;
const Chapa: React.FC<{ x: number; y: number; txt: string; size?: number; r?: number; o?: number }> = ({ x, y, txt, size = 70, r = 0, o = 1 }) => <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) rotate(${r}deg)`, opacity: o, padding: `${size * 0.18}px ${size * 0.4}px`, borderRadius: size * 0.15, background: "linear-gradient(#ead6a8,#b8945a)", boxShadow: "0 12px 16px rgba(0,0,0,.5), inset 0 3px 0 rgba(255,245,220,.6)", fontFamily: SER, fontWeight: 900, fontSize: size, color: "#3a2410", whiteSpace: "nowrap" }}>{txt}</div>;

// la red del algodón: el fardo real en el centro con tres cuerdas gruesas a tres anclas (banco, tienda, tierra); se tira una y la onda recorre las otras; el fardo se ladea
const HCottonWeb: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), b = [bt(h, 0, d * 0.35), bt(h, 1, d * 0.65)], tug = (k: number) => { const a = k === 0 ? 0.3 : b[k - 1]; return swing(tt, a, 1, 7, 2.2); }, lean = 4 * (tug(0) + tug(1) + tug(2)) / 3;
  const A = [[260, 300, "BANK"], [1660, 300, "STORE"], [960, 980, "LAND"]] as [number, number, string][], cx = 960, cy = 560;
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={760} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{A.map(([x, y], k) => { const w = 40 * tug(k), mx = (x + cx) / 2 + w * (k === 2 ? 1 : 0), my = (y + cy) / 2 + w * (k === 2 ? 0 : 1); return <g key={k}>
      <path d={`M${x} ${y} Q${mx} ${my + 30} ${cx} ${cy}`} stroke="rgba(0,0,0,.35)" strokeWidth={22} fill="none" transform="translate(8,14)" />
      <path d={`M${x} ${y} Q${mx} ${my + 30} ${cx} ${cy}`} stroke="#b8945a" strokeWidth={18} fill="none" />
      <path d={`M${x} ${y} Q${mx} ${my + 30} ${cx} ${cy}`} stroke="#6a4a22" strokeWidth={18} fill="none" strokeDasharray="6 14" /></g>; })}</svg>
    {A.map(([x, y, nm], k) => <Chapa key={k} x={x} y={y} txt={nm} size={64} r={(k - 1) * 4 + 3 * tug(k)} />)}
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "960px 780px", transform: `rotate(${lean}deg)` }}><Prop id="cotton_bale" x={960} y={780} w={460} /></div>
  </Cam>;
}} />;

// la tienda de raya: la balanza de resorte grande cuelga; el saco de harina, el café y el zapato se cuelgan de a uno y la aguja baja; la bolsa de algodón casi no la mueve
const HStoreLedger: C = ({ t, h }) => <S t={t} h={h} bg="repeating-linear-gradient(90deg,#4a3420 0 5px,#5c4028 5px 200px)" f={(tt) => {
  const d = D(h), its = [["flour_sack", 220, 0.3], ["coffee_bag", 170, 0.25], ["shoe", 240, 0.2]] as [string, number, number][], step = (d * 0.6) / 3, at = (k: number) => 0.2 + k * step;
  const load = its.reduce((s, it, k) => s + (tt > at(k) + 0.3 ? it[2] : 0), 0), cot = tt > d * 0.72 ? 0.05 : 0, dial = load + cot, sw = swing(tt, at(Math.max(0, its.filter((_, k) => tt > at(k)).length - 1)) + 0.3, 5, 6, 2);
  return <Cam tt={tt} d={d} z={0.04} fy={480}>
    <Luz />
    <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "760px 60px", transform: `rotate(${sw}deg)` }}>
      <Prop id="spring_scale" x={760} y={560} w={300} sh={0} />
      <div style={{ position: "absolute", left: 742, top: 300 + 140 * dial, width: 36, height: 16, background: "#c41e1e", borderRadius: 4, boxShadow: "0 3px 4px rgba(0,0,0,.5)" }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M760 560 L760 ${600 + 60 * dial}`} stroke="#3a3a3a" strokeWidth={8} /></svg>
      {its.map(([id, w], k) => { const p = eio(tt, at(k), at(k) + 0.4); if (p <= 0) return null; const ox = (k - 1) * 120; return <div key={id}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={`M760 ${600 + 60 * dial} L${760 + ox} ${700 + 60 * dial}`} stroke="#c8b080" strokeWidth={4} /></svg>
        <Prop id={id} x={760 + ox} y={700 + 60 * dial + w * 0.9 - 200 * (1 - p)} w={w} sh={0} r={swing(tt, at(k) + 0.4, 10, 5, 2)} /></div>; })}
    </div>
    {tt > d * 0.7 && <Prop id="cotton_sack" x={1420} y={1000} w={360} />}
    {tt > d * 0.7 && <div style={{ position: "absolute", left: 1290, top: 1020, width: 260, height: 40, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(0,0,0,.4),transparent 70%)" }} />}
    <Dust tt={tt} at={d * 0.7} x={1420} y={1000} w={260} />
  </Cam>;
}} />;

// la demostración: una sección de cerca grande en primer plano; detrás el surco de algodón cargado; los sombreros de los vecinos asoman sobre la cerca de a uno
const HFenceWatch: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), N = 4;
  return <Cam tt={tt} d={d} z={0.05} fy={620}>
    <Suelo y0={520} c1="#7a6a3a" c2="#4a3a1e" />
    {Array.from({ length: 5 }, (_, r) => Array.from({ length: 9 }, (_, c) => { const z = 0.45 + r * 0.14; return <Prop key={r + "_" + c} id="cotton_plant" x={120 + c * 220 + (r % 2) * 110} y={560 + r * 50} w={150 * z} sh={0} />; }))}
    {Array.from({ length: N }, (_, k) => { const g = phys(tt, 0.2 + k * (d - 1.2) / N, 7, 0.45), x = 380 + k * 380; return <div key={k} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${200 * (1 - g)}px)` }}>
      <div style={{ position: "absolute", left: x - 70, top: 650, width: 140, height: 150, borderRadius: "45% 45% 30% 30%", background: "radial-gradient(circle at 40% 30%,#8a6a50,#4a3220)" }} />
      <Prop id="farmer_hat" x={x} y={680} w={240} r={(k - 1.5) * 4} sh={0} /></div>; })}
    <div style={{ position: "absolute", left: -200, top: 740, width: 2320, height: 400, background: "linear-gradient(rgba(0,0,0,.0),rgba(0,0,0,.35))" }} />
    <Prop id="fence_section" x={960} y={1080} w={2000} sh={0} />
  </Cam>;
}} />;

// en minutos y no en días: los surcos en perspectiva; el biplano cruza bajo con su sombra y la estela blanca tapa las hileras; la cuadrilla a pie apenas avanza
const HDaysMinutes: C = ({ t, h }) => <S t={t} h={h} bg={SKY} f={(tt) => {
  const d = D(h), px = -300 + 2400 * eio(tt, 0, d * 0.8), dust = (x: number) => cl((px - x) / 300);
  return <Cam tt={tt} d={d} z={0.04}>
    <Suelo y0={500} c1="#8a7a42" c2="#4a3a1e" />
    {Array.from({ length: 7 }, (_, r) => <div key={r} style={{ position: "absolute", left: -200, top: 560 + r * 70 + r * r * 6, width: 2320, height: 10 + r * 4, background: "linear-gradient(90deg,#3a5a22,#5a7a32)", opacity: 0.9 }} />)}
    {Array.from({ length: 18 }, (_, k) => { const x = k * 120, o = dust(x); return o > 0 && <div key={k} style={{ position: "absolute", left: x - 120, top: 480 + (k % 3) * 20, width: 300, height: 420, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(250,250,245,.75),rgba(250,250,245,0) 70%)", opacity: o * (1 - 0.4 * cl((px - x - 900) / 600)), filter: "blur(6px)" }} />; })}
    <div style={{ position: "absolute", left: px - 260, top: 960, width: 520, height: 70, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(0,0,0,.45),transparent 70%)" }} />
    <Prop id="biplane" x={px} y={420 + 20 * Math.sin(tt * 2)} w={620} r={-3} sh={0} />
    {[0, 1, 2].map((k) => <Prop key={k} id="hand_worker" x={1500 + k * 120 + 30 * eio(tt, 0, d)} y={1000 + k * 10} w={200} sh={0.6} />)}
  </Cam>;
}} />;

// no fue sólo el gorgojo: la soga trenzada de hebras gruesas tensa entre dos manos; la hebra fina con el gorgojo se corta con chasquido; cada hebra con su chapa
const HReasonBar: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), cut = d * 0.55, sn = cl((tt - cut) / 0.5), ten = 1 - 0.5 * eio(tt, 0, 0.6), RS = ["JIM CROW", "WAGES", "LYNCHING", "WAR JOBS", "FLOODS"], COL = ["#8a3a2a", "#3a5a7a", "#2a2a2a", "#6a7a3a", "#4a6a8a"];
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={820} />
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {RS.map((_, k) => { const y = 340 + k * 60, sag = 30 * ten; return <path key={k} d={`M160 ${y} Q960 ${y + sag} 1760 ${y}`} stroke={COL[k]} strokeWidth={30} fill="none" strokeLinecap="round" />; })}
      {RS.map((_, k) => { const y = 340 + k * 60, sag = 30 * ten; return <path key={"h" + k} d={`M160 ${y - 8} Q960 ${y + sag - 8} 1760 ${y - 8}`} stroke="rgba(255,255,255,.25)" strokeWidth={6} fill="none" strokeDasharray="20 16" />; })}
      {sn <= 0 ? <path d={`M160 680 Q960 ${680 + 30 * ten} 1760 680`} stroke="#e8dcc0" strokeWidth={8} fill="none" /> : <>
        <path d={`M160 680 Q500 ${680 + 300 * sn} ${880 - 200 * sn} ${720 + 280 * sn}`} stroke="#e8dcc0" strokeWidth={8} fill="none" />
        <path d={`M1760 680 Q1420 ${680 + 300 * sn} ${1040 + 200 * sn} ${720 + 280 * sn}`} stroke="#e8dcc0" strokeWidth={8} fill="none" /></>}</svg>
    {sn > 0 && sn < 0.6 && <div style={{ position: "absolute", left: 960 - 90, top: 680 - 90, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,240,200,.9),transparent 70%)", opacity: 1 - sn / 0.6 }} />}
    <Prop id="weevil" x={960} y={sn > 0 ? 690 + 340 * sn * sn : 690} w={150} r={sn * 200} sh={0} />
    {RS.map((txt, k) => <Chapa key={k} x={1880 - 10 * k} y={340 + k * 60} txt={txt} size={30} o={eio(tt, 0.1 + k * 0.12, 0.4 + k * 0.12)} />)}
    <Prop id="hand_worker" x={130} y={560} w={300} r={90} sh={0} />
    <Prop id="hand_worker" x={1790} y={560} w={300} r={-90} flip sh={0} />
  </Cam>;
}} />;

// se cobraron el impuesto: la urna de madera con ranura; las boletas YES caen de a una por la ranura con peso; al final la tapa se abre y asoman apiladas
const HSelfTax: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), N = 6, at = (k: number) => -0.1 + k * (d * 0.6) / N, open = eio(tt, d * 0.72, d * 0.85), lidA = -110 * open + swing(tt, d * 0.85, 8, 6, 2) * open;
  const fallen = Array.from({ length: N }, (_, k) => tt > at(k) + 0.6 ? 1 : 0).reduce((a: number, b) => a + b, 0);
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={860} />
    <div style={{ position: "absolute", left: 960 - 300, top: 960, width: 600, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(0,0,0,.55),transparent 70%)" }} />
    <div style={{ position: "absolute", left: 960 - 270, top: 520, width: 540, height: 460, borderRadius: 10, background: "repeating-linear-gradient(90deg,rgba(0,0,0,.12) 0 3px,transparent 3px 90px), linear-gradient(#a8743e,#6a4420)", boxShadow: "inset 0 -20px 30px rgba(0,0,0,.35), 0 20px 30px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 120, top: 150, width: 300, height: 110, borderRadius: 8, background: "linear-gradient(#e8d0a0,#b89460)", fontFamily: SER, fontWeight: 900, fontSize: 70, color: "#3a2410", textAlign: "center", lineHeight: "110px", boxShadow: "0 6px 10px rgba(0,0,0,.4)" }}>VOTE</div></div>
    {open > 0.2 && Array.from({ length: fallen }, (_, k) => <Prop key={k} id="ballot" x={960 + (k % 2 ? 20 : -20)} y={560 - k * 14 - 60 * open} w={180} r={(k % 3 - 1) * 6} sh={0} />)}
    <div style={{ position: "absolute", left: 960 - 290, top: 490, width: 580, height: 40, transformOrigin: "0 50%", transform: `perspective(1000px) rotateX(${-lidA * 0.0}deg) rotate(${lidA * 0.35}deg)`, borderRadius: 6, background: "linear-gradient(#c8945a,#7a5028)", boxShadow: "0 10px 14px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 220, top: 12, width: 140, height: 16, borderRadius: 6, background: "#1a0e06", boxShadow: "inset 0 4px 6px #000" }} /></div>
    {Array.from({ length: N }, (_, k) => { const p = cl((tt - at(k)) / 0.6); if (p <= 0 || p >= 1) return null; return <div key={k} style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, clipPath: "inset(0 0 562px 0)" }}><Prop id="ballot" x={960} y={140 + 420 * p * p} w={170} r={(1 - p) * (k % 2 ? 14 : -14)} sh={0} /></div>; })}
  </Cam>;
}} />;

// cuánto tardó: la cinta métrica sale del carrete con su lengüeta y pasa los años; dos gorgojos caminan sobre ella; en 1990s la cinta se traba y el gorgojo salta a la mesa
const HCenturyBar: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), ext = 0.12 + 0.88 * eio(tt, 0, d * 0.7), L = 1500 * ext, x0 = 260, jump = cl((tt - d * 0.75) / 0.8), YR = [1892, 1910, 1930, 1950, 1970, 1990];
  return <Cam tt={tt} d={d} z={0.06} fx={x0 + L * 0.6} fy={620}>
    <Mesa y0={700} />
    <div style={{ position: "absolute", left: x0 - 150, top: 520, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%,#e8c070,#a87a2c 55%,#5a3a10)", boxShadow: "0 20px 26px rgba(0,0,0,.55)", transform: `rotate(${-ext * 720}deg)` }}>
      <div style={{ position: "absolute", left: 120, top: 120, width: 60, height: 60, borderRadius: "50%", background: "#3a2a10" }} /></div>
    <div style={{ position: "absolute", left: x0 + 120, top: 690, width: L, height: 70, background: "repeating-linear-gradient(90deg,#2a2a2a 0 3px,transparent 3px 30px), linear-gradient(#f4e078,#d8b840)", boxShadow: "0 14px 14px rgba(0,0,0,.45)", overflow: "hidden" }}>
      {YR.map((y, k) => <div key={y} style={{ position: "absolute", left: 40 + k * 280, top: 6, fontFamily: SER, fontWeight: 900, fontSize: 48, color: k === 5 ? "#c41e1e" : "#2a2a2a" }}>{k === 5 ? "1990s" : y}</div>)}</div>
    <div style={{ position: "absolute", left: x0 + 110 + L, top: 676, width: 30, height: 98, borderRadius: 4, background: "linear-gradient(90deg,#8a8e92,#d8dce0,#6a6e72)" }} />
    <Prop id="weevil" x={x0 + 200 + L * 0.55} y={700} w={140} r={4 * Math.sin(tt * 12)} />
    <Prop id="weevil" x={x0 + 120 + L - 90 + 300 * jump} y={700 + 220 * jump - 220 * Math.sin(jump * Math.PI) * 0.8} w={150} r={jump * 30} sh={jump > 0.95 ? 1 : 0} />
    {jump >= 1 && <Dust tt={tt} at={d * 0.75 + 0.8} x={x0 + 120 + L + 210} y={920} w={140} />}
  </Cam>;
}} />;

// la estatua: el monumento entero en el pedestal con el gorgojo en alto; la lona con pliegues se desliza hacia abajo y una luz cálida barre el bronce y la placa
const HStatueReveal: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#6a8aa8 0%,#c8c0a8 60%,#8a7a5a 62%,#5a4a32 100%)" f={(tt) => {
  const d = D(h), dn = eio(tt, 0.2, d * 0.45), sweep = eio(tt, d * 0.45, d * 0.75);
  return <Cam tt={tt} d={d} z={0.05} fy={500}>
    <div style={{ position: "absolute", left: 960 - 330, top: 1000, width: 660, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse,rgba(0,0,0,.55),transparent 70%)" }} />
    <div style={{ position: "absolute", left: 960 - 260, top: 820, width: 520, height: 200, background: "linear-gradient(#b8b0a0,#7a7468)", boxShadow: "inset 0 6px 0 rgba(255,255,255,.3), 0 20px 30px rgba(0,0,0,.5)" }}>
      <div style={{ position: "absolute", left: 90, top: 50, width: 340, height: 100, borderRadius: 8, background: "linear-gradient(135deg,#d8b060,#8a6020)", fontFamily: SER, fontWeight: 900, fontSize: 40, color: "#3a2208", textAlign: "center", lineHeight: "100px" }}>ENTERPRISE</div></div>
    <Prop id="statue" x={960} y={830} w={330} sh={0} />
    <div style={{ position: "absolute", left: 960 - 200 + 400 * sweep - 100, top: 120, width: 200, height: 900, background: "linear-gradient(90deg,transparent,rgba(255,220,150,.45),transparent)", mixBlendMode: "screen", opacity: sweep > 0 && sweep < 1 ? 1 : 0 }} />
    {dn < 1 && <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `translateY(${560 * dn}px)`, clipPath: `inset(0 0 ${260 + 560 * dn}px 0)` }}><Prop id="canvas_tarp" x={960} y={840} w={430} sh={0} /></div>}
    {dn > 0.6 && <div style={{ position: "absolute", left: 960 - 260, top: 960, width: 520, height: 70, borderRadius: "40% 40% 10% 10%", background: "linear-gradient(#c8b890,#8a7a58)", boxShadow: "0 10px 14px rgba(0,0,0,.45)", opacity: eio(dn, 0.6, 1) }} />}
  </Cam>;
}} />;

// la escuela con ruedas: camino de tierra en perspectiva; el carro entra desde el fondo con polvo, el toldo se mece y frena en el centro; se abre la lona del costado
const HSchoolWagon: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#a8c4d8 0%,#e8e0c0 50%,#b8a06a 52%,#8a6a3a 100%)" f={(tt) => {
  const d = D(h), p = 0.3 + 0.7 * eio(tt, 0, d * 0.45), s = 0.35 + 0.65 * p, bob = 4 * Math.sin(tt * 9) * (1 - eio(tt, d * 0.4, d * 0.5));
  return <Cam tt={tt} d={d} z={0.04} fy={620}>
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><polygon points="900,540 1020,540 1500,1080 420,1080" fill="#a88a5a" /><polygon points="930,540 990,540 1180,1080 740,1080" fill="rgba(0,0,0,.08)" /></svg>
    {[1, 2, 3].map((k) => <Dust key={k} tt={tt} at={k * 0.6} x={960} y={540 + 460 * p + 20} w={300 * s} col="rgba(200,180,130,.7)" />)}
    <Prop id="wagon" x={960} y={540 + 460 * p + bob} w={1000 * s} />
  </Cam>;
}} />;

// lo que oye, lo que ve, lo que hace: la trompetilla y los anteojos llegan y se van; el guante de cuero grande baja y se cierra sobre la mota
const HHearSeeDo: C = ({ t, h }) => <S t={t} h={h} f={(tt) => {
  const d = D(h), b1 = bt(h, 0, d * 0.33), b2 = bt(h, 1, d * 0.66), it = (a: number, b: number) => eio(tt, a, a + 0.4) * (1 - eio(tt, b - 0.3, b)), g = eio(tt, b2, b2 + 0.6), close = eio(tt, b2 + 0.6, b2 + 0.9);
  return <Cam tt={tt} d={d} z={0.04}>
    <Mesa y0={820} />
    <Prop id="ear_trumpet" x={960 - 1000 * (1 - it(-0.2, b1))} y={900} w={700} />
    <Prop id="spectacles" x={960 + 1000 * (1 - it(b1, b2))} y={880} w={620} />
    {tt > b2 - 0.2 && <Prop id="cotton_boll" x={960} y={960} w={260} sq={close * 0.4} />}
    {tt > b2 - 0.2 && <Prop id="leather_glove" x={960} y={980 - 520 * (1 - g) + 40 * close} w={420 - 60 * close} r={180} sh={g} style={{ transform: `rotate(180deg) scaleY(${1 - 0.15 * close})` }} />}
    <Dust tt={tt} at={b2 + 0.9} x={960} y={980} w={300} col="rgba(245,240,230,.8)" />
  </Cam>;
}} />;

// todo en un minuto: la colcha sobre la mesa clara; los retazos llegan plegados y se asientan con sombra; la aguja arrastra el hilo rojo en zigzag y los cose
const HQuiltRecap: C = ({ t, h }) => <S t={t} h={h} bg="linear-gradient(#e8dcc0,#c8b890)" f={(tt) => {
  const d = D(h), N = 6, at = (k: number) => -0.2 + k * (d - 1.6) / N, P = Array.from({ length: N }, (_, k) => ({ x: 560 + (k % 3) * 400, y: 360 + Math.floor(k / 3) * 360 })), ID = ["cotton_boll", "weevil", "pesticide_tank", "biplane", "suitcase", "statue"];
  const seam = cl((tt - 0.2) / (d - 0.6)) * N, cur = Math.min(N - 1, Math.floor(seam)), fr = seam - cur, nx = P[cur].x + 200 * Math.sin(fr * Math.PI * 4), ny = P[cur].y - 180 + 360 * fr;
  return <Cam tt={tt} d={d} z={0.05}>
    {P.map((p, k) => { const L = land(tt, at(k), 300), fold = 1 - eio(tt, at(k) + 0.2, at(k) + 0.6); if (!L.on) return null; return <div key={k}>
      <div style={{ position: "absolute", left: p.x - 195, top: p.y - 175 + L.dy, width: 390, height: 350, background: `repeating-linear-gradient(45deg,rgba(255,255,255,.12) 0 4px,transparent 4px 12px), ${["#b8443a", "#e8d8b0", "#4a6a8a", "#c89a4a", "#6a8a4a", "#8a5a7a"][k]}`, transformOrigin: "50% 0", transform: `perspective(900px) rotateX(${70 * fold}deg)`, boxShadow: "0 10px 14px rgba(0,0,0,.35)", border: "4px dashed rgba(255,255,255,.4)" }} />
      <Prop id={ID[k]} x={p.x} y={p.y + 110 + L.dy} w={k === 5 ? 120 : 200} sh={0.5} style={{ opacity: 1 - fold }} /></div>; })}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}><path d={P.slice(0, cur + 1).map((p, k) => `${k ? "L" : "M"}${p.x - 200} ${p.y - 180} L${p.x + 200} ${p.y + 180}`).join(" ") + ` L${nx} ${ny}`} stroke="#c41e1e" strokeWidth={5} fill="none" strokeDasharray="18 10" /></svg>
    <Prop id="needle_thread" x={nx + 160} y={ny + 30} w={360} r={-30} sh={0} />
  </Cam>;
}} />;

export const HCC4: Record<string, C> = {
  cottonWeb: HCottonWeb, storeLedger: HStoreLedger, fenceWatch: HFenceWatch, daysMinutes: HDaysMinutes, reasonBar: HReasonBar, selfTax: HSelfTax,
  centuryBar: HCenturyBar, statueReveal: HStatueReveal, schoolWagon: HSchoolWagon, hearSeeDo: HHearSeeDo, quiltRecap: HQuiltRecap,
};
