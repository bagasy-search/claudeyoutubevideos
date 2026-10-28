// cer28 · componentes únicos de LLAVES (cer28c): candado de combinación, sobre cerrado, el llavero que se separa, la etiqueta
// que se corta y los colores, las copias que se reparten, el cilindro por dentro, la mudanza, la señal del vecino, la mesita de luz,
// la maceta que esconde la llave.
import React from "react";
import { AMB, DIM, GRN, H, HAND, Head, MARK, Photo, RED, Shadow, Sheen, Stage, TX, Tag, cl, eIn, eio, phys } from "./hkit";
import type { HP } from "./heroes_g1";

const gold = ["#f1dc8a", "#c9a64a", "#8a6e2a"], silver = ["#f1f1f1", "#b9bcc0", "#7d8186"];
// llave de perfil (cabeza + paletón), en SVG
export const Key: React.FC<{ w?: number; col?: string[]; cap?: string; style?: React.CSSProperties }> = ({ w = 300, col = gold, cap, style }) => (
  <svg width={w} height={w * 0.4} viewBox="0 0 300 120" style={style}>
    <defs><linearGradient id={"kg" + col[0].slice(1)} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={col[0]} /><stop offset="0.5" stopColor={col[1]} /><stop offset="1" stopColor={col[2]} /></linearGradient></defs>
    <circle cx={60} cy={60} r={50} fill={cap ?? `url(#kg${col[0].slice(1)})`} /><circle cx={42} cy={60} r={14} fill="#0b0b0c" />
    <path d="M 104 46 L 292 46 L 292 74 L 270 74 L 270 92 L 252 92 L 252 74 L 232 74 L 232 86 L 214 86 L 214 74 L 190 74 L 190 96 L 172 96 L 172 74 L 104 74 Z" fill={`url(#kg${col[0].slice(1)})`} />
  </svg>);

// ---------- 46 · CANDADO DE COMBINACIÓN: los cuatro tambores ruedan; el 0000 se tacha ----------
export const HCombo: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris">{(tt) => {
  const fin = String(h.v ?? "7392").split(""), x0 = eio(tt, 1.0, 1.4);
  return <>
    <Shadow x={960} y={900} w={900} />
    <div style={{ position: "absolute", left: 960 - 420, top: 300, width: 840, height: 520, borderRadius: 40, background: "linear-gradient(160deg,#42464c,#1b1d20)", boxShadow: "0 50px 110px rgba(0,0,0,.7), inset 0 3px 0 rgba(255,255,255,.12)" }}>
      <Sheen p={(tt * 0.2) % 1} r={40} o={0.15} />
      <div style={{ position: "absolute", left: 80, top: 130, display: "flex", gap: 30 }}>
        {fin.map((d, i) => { const k = eio(tt, 2.0 + i * 0.3, 3.0 + i * 0.3), pos = tt < 2 ? 0 : (+d + 20) * k;
          return <div key={i} style={{ position: "relative", width: 150, height: 250, overflow: "hidden", borderRadius: 18, background: "linear-gradient(90deg,#111,#3d3d3d 20%,#cfcfcf 50%,#3d3d3d 80%,#111)" }}>
            <div style={{ position: "absolute", left: 0, right: 0, top: 0, transform: `translateY(${-(pos % 10) * 250}px)` }}>{Array.from({ length: 11 }, (_, j) => <div key={j} style={{ height: 250, lineHeight: "250px", textAlign: "center", fontWeight: 900, fontSize: 150, color: "#141414" }}>{j % 10}</div>)}</div>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,.8), transparent 35%, transparent 65%, rgba(0,0,0,.8))" }} />
          </div>; })}
      </div>
      <svg width={840} height={520} style={{ position: "absolute", left: 0, top: 0 }}><line x1={70} y1={260} x2={770} y2={260} stroke={RED} strokeWidth={16} strokeLinecap="round" pathLength={1} strokeDasharray={`${x0 * (1 - cl((tt - 2) * 3))} 1`} /></svg>
    </div>
    <Tag tt={tt} at={0.5} x={960} y={220} txt={h.a ?? "0000 DE FÁBRICA"} col={RED} size={46} />
    <Tag tt={tt} at={3.6} x={960} y={950} txt={h.b ?? "NADA QUE VER CONTIGO"} col={GRN} size={46} />
  </>;
}}</Stage>;

// ---------- 47 · EL SOBRE CERRADO: la copia entra, la solapa se cierra y el nombre se escribe por dentro ----------
export const HEnvelope: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const kin = eio(tt, 0.8, 1.6), flap = eio(tt, 1.8, 2.5), nm = eio(tt, 2.6, 3.4), seal = phys(tt, 3.4, 7, 0.4);
  return <>
    <Shadow x={960} y={860} w={980} />
    <div style={{ position: "absolute", left: 960 - 440, top: 360, width: 880, height: 480, background: "linear-gradient(180deg,#e9dcc0,#d6c39c)", boxShadow: "0 40px 90px rgba(0,0,0,.6)", perspective: 1400 }}>
      <Key w={360} style={{ position: "absolute", left: 260, top: -200 + kin * 300, transform: "rotate(-8deg)", opacity: 1 - cl((flap - 0.6) * 3) }} />
      <svg width={880} height={480} style={{ position: "absolute" }}><path d="M 0 480 L 440 240 L 880 480 Z" fill="#cdb88c" /><path d="M 0 0 L 440 280 L 880 0" fill="none" stroke="rgba(0,0,0,.12)" strokeWidth={3} /></svg>
      <div style={{ position: "absolute", left: 0, top: 0, width: 880, height: 300, transformOrigin: "50% 0%", transform: `rotateX(${180 - 180 * flap}deg)`, zIndex: 3 }}><svg width={880} height={300}><path d="M 0 0 L 880 0 L 440 290 Z" fill="#dccaa4" stroke="rgba(0,0,0,.15)" strokeWidth={3} /></svg></div>
      <div style={{ position: "absolute", left: 400, top: 230, width: 80 * seal, height: 80 * seal, marginLeft: -40 * seal + 40, marginTop: -40 * seal + 40, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #e0584a, #8a1d14)", zIndex: 4, boxShadow: "0 6px 12px rgba(0,0,0,.4)" }} />
      <div style={{ position: "absolute", left: 120, top: 360, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: "#3a2e1f", clipPath: `inset(0 ${(1 - nm) * 100}% 0 0)`, zIndex: 5 }}>{h.n ?? "Para: mi hija"}</div>
    </div>
    <Tag tt={tt} at={3.8} x={960} y={200} txt={h.lab ?? "SI ESTÁ ABIERTO, LO SABES"} col={AMB} size={46} />
  </>;
}}</Stage>;

// ---------- 48 · EL LLAVERO QUE SE SEPARA: todo junto en una argolla; la de casa se va al bolsillo y al taller va sólo la del auto ----------
export const HKeyring: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="split">{(tt) => {
  const sp = eio(tt, h.splitAt ?? 2.4, (h.splitAt ?? 2.4) + 1.2), keys = [gold, silver, gold, silver, gold];
  return <>
    <div style={{ position: "absolute", left: 960 - 90 - sp * 420, top: 260, width: 180, height: 180, borderRadius: "50%", border: "14px solid #c9c9c9", boxShadow: "0 10px 20px rgba(0,0,0,.4)" }} />
    {keys.map((c, i) => { const home = i > 0, x = 960 - 60 + (home ? -sp * 480 : sp * 420), rot = 70 + (i - 2) * 18 * (1 - sp * 0.4) + (home ? 0 : -sp * 40);
      return <div key={i} style={{ position: "absolute", left: x, top: 360 + (home ? sp * 40 : 0), transformOrigin: "0 0", transform: `rotate(${rot + 4 * Math.sin(tt * 1.5 + i)}deg)` }}><Key w={340} col={c} cap={i === 1 ? "#d23b2c" : undefined} /></div>; })}
    <div style={{ position: "absolute", left: 960 + sp * 420 - 140, top: 220, width: 280, height: 120, borderRadius: 30, background: "linear-gradient(160deg,#2b2b30,#0d0d10)", opacity: 1 }} />
    <Tag tt={tt} at={(h.splitAt ?? 2.4) + 1.2} x={480} y={860} txt={h.a ?? "CASA: EN TU BOLSILLO"} col={GRN} size={44} />
    <Tag tt={tt} at={(h.splitAt ?? 2.4) + 1.4} x={1420} y={860} txt={h.b ?? "AL TALLER: SÓLO EL AUTO"} col={AMB} size={44} />
    <Tag tt={tt} at={0.8} x={960} y={160} txt={h.c ?? "TODO JUNTO = TU CASA"} col={RED} size={44} />
  </>;
}}</Stage>;

// ---------- 49 · LA ETIQUETA: la plaquita con la dirección se corta; en su lugar, colores ----------
export const HTagcut: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="wipe">{(tt) => {
  const cut = h.cutAt ?? 2.4, fall = eIn(tt, cut + 0.2, cut + 1.0), caps = ["#d23b2c", "#2f6fd6", "#2fa565"];
  return <>
    {caps.map((c, i) => { const s = phys(tt, i === 0 ? 0.3 : cut + 1.2 + i * 0.35, 6, 0.5), y = 300 + i * 220;
      return <div key={i} style={{ position: "absolute", left: 620, top: y, opacity: cl(s * 3), transform: `translateX(${(1 - s) * -300}px)` }}>
        <Key w={520} col={i === 1 ? silver : gold} cap={tt > cut + 1.2 + i * 0.35 ? c : undefined} />
        {tt > cut + 1.2 + i * 0.35 && <div style={{ position: "absolute", left: 560, top: 60, fontWeight: 900, fontSize: 40, color: c, whiteSpace: "nowrap" }}>{["CALLE", "ATRÁS", "GARAJE"][i]}</div>}
      </div>; })}
    <div style={{ position: "absolute", left: 420, top: 360 + fall * 700, transform: `rotate(${-10 + fall * 80}deg)`, opacity: 1 - fall * 0.8 }}>
      <div style={{ width: 300, height: 140, borderRadius: 16, background: "linear-gradient(160deg,#eee,#bbb)", boxShadow: "0 16px 30px rgba(0,0,0,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 34, color: "#333", textAlign: "center", lineHeight: 1.1 }}>{h.txt ?? "CALLE ROBLES 1284"}</div>
    </div>
    {tt > cut - 0.4 && tt < cut + 0.6 && <div style={{ position: "absolute", left: 560, top: 330, fontSize: 120, transform: `rotate(${Math.sin(tt * 30) * 12}deg)` }}>✂</div>}
    <Tag tt={tt} at={cut + 0.3} x={1500} y={200} txt={h.lab ?? "SIN DIRECCIÓN, ES BASURA"} col={AMB} size={44} />
  </>;
}}</Stage>;

// ---------- 50 · LAS COPIAS: de tu llave salen copias que vuelan a cada persona; una queda con signo de pregunta ----------
export const HCopies: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" bg="radial-gradient(ellipse 70% 60% at 50% 55%, #1c1914, #060505 78%)">{(tt) => {
  const I = (h.items ?? []) as { t: string; at: number; q?: boolean }[], C = { x: 960, y: 560 };
  return <>
    <div style={{ position: "absolute", left: C.x - 170, top: C.y - 60, filter: "drop-shadow(0 0 30px rgba(255,200,110,.5))" }}><Key w={340} /></div>
    {I.map((c, i) => { const q = (i / I.length) * Math.PI * 2 - Math.PI / 2, P = { x: C.x + Math.cos(q) * 640, y: C.y + Math.sin(q) * 340 }, k = eio(tt, c.at, c.at + 0.8), kx = C.x + (P.x - C.x) * k, ky = C.y + (P.y - C.y) * k - Math.sin(k * Math.PI) * 120;
      return <React.Fragment key={i}>
        <svg width={1920} height={1080} style={{ position: "absolute", left: 0, top: 0 }}><line x1={C.x} y1={C.y} x2={kx} y2={ky} stroke="rgba(255,200,110,.25)" strokeWidth={3} strokeDasharray="8 10" /></svg>
        <div style={{ position: "absolute", left: kx - 60, top: ky - 25, opacity: cl(k * 3) }}><Key w={120} /></div>
        <div style={{ position: "absolute", left: P.x, top: P.y + 60, transform: "translate(-50%,0)", opacity: cl((tt - c.at - 0.6) * 3), textAlign: "center" }}>
          <svg width={90} height={110} viewBox="0 0 90 110"><circle cx={45} cy={30} r={24} fill={c.q ? "#5a2a26" : "#c9b48c"} /><path d="M 6 110 Q 8 64 45 60 Q 82 64 84 110 Z" fill={c.q ? "#5a2a26" : "#c9b48c"} /></svg>
          <div style={{ fontWeight: 900, fontSize: 32, color: c.q ? RED : TX, whiteSpace: "nowrap" }}>{c.t}</div>
          {c.q && <div style={{ position: "absolute", left: 22, top: -40, fontFamily: MARK, fontSize: 80, color: RED, transform: `scale(${1 + 0.1 * Math.sin(tt * 6)})` }}>?</div>}
        </div></React.Fragment>; })}
    <div style={{ position: "absolute", right: 120, top: 100, fontWeight: 900, fontSize: 90, color: AMB }}>{I.filter((c) => tt > c.at + 0.6).length}<span style={{ fontSize: 36, color: DIM }}> COPIAS</span></div>
  </>;
}}</Stage>;

// ---------- 51 · EL CILINDRO POR DENTRO: la llave vieja alinea los pernos y abre; cilindro nuevo, los mismos pernos la frenan ----------
export const HPins: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="diag" bg="radial-gradient(ellipse 70% 60% at 50% 50%, #26221c, #080706 78%)">{(tt) => {
  const ch = h.swapAt ?? 3.2, in1 = eio(tt, 0.7, 1.6) * (1 - eio(tt, 2.4, 2.8)), sw = eio(tt, ch, ch + 0.8), in2 = eio(tt, ch + 1.0, ch + 1.8), cuts = [40, 70, 30, 60, 45];
  const cuts2 = [65, 30, 70, 35, 60], useNew = sw > 0.5, ins = useNew ? in2 : in1, ok = !useNew && in1 > 0.98;
  return <>
    <div style={{ position: "absolute", left: 460, top: 300, width: 1000, height: 420, borderRadius: 60, background: `linear-gradient(180deg, ${gold[0]}, ${gold[1]} 50%, ${gold[2]})`, boxShadow: "0 40px 90px rgba(0,0,0,.6)", transform: `rotateY(${sw * 360}deg)` }}><Sheen p={(tt * 0.2) % 1} r={60} o={0.3} /></div>
    <div style={{ position: "absolute", left: 520, top: 520, width: 880, height: 120, background: "#0c0b09", borderRadius: 10 }} />
    {cuts.map((c, i) => { const need = useNew ? cuts2[i] : c, pinY = 520 - (ins > 0.95 ? need : 70) * 1.2, x = 600 + i * 160;
      return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: x, top: 330, width: 50, height: pinY - 330, background: "linear-gradient(90deg,#6d6d6d,#e8e8e8,#7a7a7a)", borderRadius: 8 }} />
        <div style={{ position: "absolute", left: x, top: pinY, width: 50, height: 70, background: "linear-gradient(90deg,#8a6e2a,#f1dc8a,#8a6e2a)", borderRadius: 8 }} />
        <div style={{ position: "absolute", left: x - 6, top: 438, width: 62, height: 4, background: ok ? GRN : "rgba(255,255,255,.25)" }} />
      </React.Fragment>; })}
    <div style={{ position: "absolute", left: 1500 - ins * 900, top: 560, width: 1000, height: 70, background: `linear-gradient(180deg, ${silver[0]}, ${silver[2]})`, clipPath: `polygon(0 40%, ${cuts.map((c, i) => `${(140 + i * 160) / 10}% ${40 - c / 3}%`).join(",")}, 100% 40%, 100% 100%, 0 100%)` }} />
    <Tag tt={tt} at={1.7} x={960} y={200} txt={h.a ?? "LA LLAVE PERDIDA ABRE"} col={RED} size={46} />
    <Tag tt={tt} at={ch + 1.9} x={960} y={860} txt={h.b ?? "CILINDRO NUEVO: YA NO"} col={GRN} size={46} />
  </>;
}}</Stage>;

// ---------- 52 · LA MUDANZA: cajas que se apilan y las llaves de otros dando vueltas; cilindro nuevo y se esfuman ----------
export const HBoxes: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const who = (h.items ?? []) as { t: string; at: number }[], gone = eio(tt, h.goneAt ?? 4.4, (h.goneAt ?? 4.4) + 0.8);
  return <>
    {[[760, 760, 300], [1080, 760, 280], [910, 500, 260]].map(([x, y, w], i) => { const s = phys(tt, 0.3 + i * 0.35, 5, 0.45); return <div key={i} style={{ position: "absolute", left: x - w / 2, top: y - w * 0.8 + (1 - s) * -600, width: w, height: w * 0.8, background: "linear-gradient(160deg,#c89a5e,#9a6f3a)", boxShadow: "0 30px 50px rgba(0,0,0,.5), inset 0 -6px 0 rgba(0,0,0,.15)", opacity: cl(s * 3) }}>
      <div style={{ position: "absolute", left: w / 2 - 30, top: 0, width: 60, height: w * 0.8, background: "rgba(230,210,160,.6)" }} /></div>; })}
    <Shadow x={920} y={770} w={800} />
    {who.map((c, i) => { const q = tt * 0.6 + (i / who.length) * Math.PI * 2, x = 920 + Math.cos(q) * 620, y = 480 + Math.sin(q) * 260, k = cl(phys(tt, c.at, 6, 0.5)) * (1 - gone);
      return <div key={i} style={{ position: "absolute", left: x - 70, top: y - 30, opacity: k, transform: `scale(${0.8 + 0.2 * k})` }}><Key w={140} col={silver} /><div style={{ fontWeight: 900, fontSize: 28, color: DIM, whiteSpace: "nowrap" }}>{c.t}</div></div>; })}
    <Tag tt={tt} at={(h.goneAt ?? 4.4) + 0.6} x={920} y={180} txt={h.lab ?? "CILINDRO NUEVO EL PRIMER DÍA"} col={GRN} size={50} />
  </>;
}}</Stage>;

// ---------- 53 · LA SEÑAL DEL VECINO: la persiana sube a las 9; a las 11 sigue baja y el celular del vecino suena ----------
export const HSignal: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="shutter">{(tt) => {
  const hr = 8 + eio(tt, 0.8, 3.6) * 3.2, up = h.down ? 0 : eio(tt, 1.6, 2.2), ring = tt > 3.6 ? cl((tt - 3.6) * 3) : 0;
  return <>
    <div style={{ position: "absolute", left: 300, top: 220, width: 620, height: 640, background: "#d9cfbd", boxShadow: "0 40px 90px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 80, top: 90, width: 460, height: 420, background: "linear-gradient(180deg,#ffe2a8,#d79a4a)" }} />
      <div style={{ position: "absolute", left: 80, top: 90, width: 460, height: 420 * (1 - up), background: "repeating-linear-gradient(180deg,#8b8f94 0 26px,#6c7075 26px 30px)", boxShadow: "0 8px 12px rgba(0,0,0,.35)" }} />
      {h.pot && <div style={{ position: "absolute", left: 230, top: 450, width: 160, height: 120, borderRadius: "0 0 40px 40px", background: "#c4231a", opacity: up }} />}
    </div>
    <div style={{ position: "absolute", left: 1180, top: 260, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,#fbfaf6,#d8d3c8)", boxShadow: "0 0 0 14px #2b2b2e, 0 30px 60px rgba(0,0,0,.6)" }}>
      <div style={{ position: "absolute", left: 147, top: 40, width: 6, height: 110, background: "#222", transformOrigin: "3px 110px", transform: `rotate(${(hr % 1) * 360}deg)` }} />
      <div style={{ position: "absolute", left: 145, top: 70, width: 10, height: 80, background: "#222", transformOrigin: "5px 80px", transform: `rotate(${(hr % 12) * 30}deg)` }} />
    </div>
    <Tag tt={tt} at={1.0} x={1330} y={620} txt={`${Math.floor(hr)}:${String(Math.floor((hr % 1) * 60)).padStart(2, "0")}`} col={AMB} size={70} />
    <div style={{ position: "absolute", left: 1600, top: 500, width: 200, height: 360, borderRadius: 34, background: "#0e0f12", boxShadow: `0 0 0 6px #2a2b30, 0 0 ${60 * ring}px rgba(111,227,154,.6)`, transform: `rotate(${ring * Math.sin(tt * 40) * 6}deg) scale(${0.7 + 0.3 * cl(phys(tt, 3.4, 6, 0.5))})`, opacity: cl((tt - 3.3) * 3) }}>
      <div style={{ position: "absolute", left: 50, top: 120, width: 100, height: 100, borderRadius: "50%", background: GRN, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60 }}>📞</div>
    </div>
    <Tag tt={tt} at={3.8} x={1700} y={920} txt={h.lab ?? "EL VECINO TE LLAMA"} col={GRN} size={42} />
  </>;
}}</Stage>;

// ---------- 54 · LA MESITA DE LUZ DEL CERRAJERO: vista de arriba, las cinco cosas llegan de a una a su lugar ----------
export const HNightstand: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="iris" cam={0.6}>{(tt) => {
  const I = (h.items ?? []) as { t: string; img?: string; at: number }[], P = [[-330, -150], [40, -170], [-160, 150], [300, 110], [380, -200]];
  return <div style={{ position: "absolute", left: 960, top: 560, transformStyle: "preserve-3d", transform: "rotateX(48deg)" }}>
    <div style={{ position: "absolute", left: -640, top: -380, width: 1280, height: 760, borderRadius: 30, background: "linear-gradient(160deg,#9a6b3e,#6d4626)", boxShadow: "0 80px 140px rgba(0,0,0,.7)" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.25, borderRadius: 30, background: "repeating-linear-gradient(8deg, rgba(0,0,0,.25) 0 2px, transparent 2px 22px)" }} />
    </div>
    {I.map((c, i) => { const s = phys(tt, c.at, 6, 0.45), [x, y] = P[i % 5];
      return <div key={i} style={{ position: "absolute", left: x - 120, top: y - 120, transform: `translateZ(${(1 - s) * 500}px) rotateZ(${(i - 2) * 6 + (1 - s) * 30}deg)`, opacity: cl(s * 3) }}>
        <Photo id={c.img} w={240} h={240} r={30} style={{ boxShadow: "0 30px 40px rgba(0,0,0,.55)" }} />
        <div style={{ position: "absolute", left: -18, top: -18, width: 64, height: 64, borderRadius: "50%", background: AMB, color: "#1d1407", fontWeight: 900, fontSize: 38, display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 260, textAlign: "center", fontWeight: 900, fontSize: 36, whiteSpace: "nowrap", transform: "rotateX(-48deg)", textShadow: "0 6px 20px rgba(0,0,0,.8)" }}>{c.t}</div>
      </div>; })}
  </div>;
}}</Stage>;

// ---------- 55 · LA MACETA: se levanta y abajo está la llave; el cronómetro dice cuánto tardó en encontrarla ----------
export const HStone: React.FC<HP> = ({ t, h }) => <Stage t={t} h={h} mode="drop">{(tt) => {
  const lift = eio(tt, h.liftAt ?? 2.2, (h.liftAt ?? 2.2) + 0.8), sec = Math.min(+(h.v ?? 40), eio(tt, 0.6, (h.liftAt ?? 2.2) + 0.8) * +(h.v ?? 40));
  return <>
    <div style={{ position: "absolute", left: 0, top: 760, width: 1920, height: 320, background: "linear-gradient(180deg,#8e8576,#5d564a)" }} />
    <div style={{ position: "absolute", left: 960 - 160, top: 720, opacity: cl((lift - 0.3) * 3), filter: "drop-shadow(0 0 20px rgba(255,200,110,.7))" }}><Key w={320} /></div>
    <Shadow x={960} y={790} w={520} k={1 - lift} />
    <div style={{ position: "absolute", left: 960 - 220, top: 420 - lift * 260, width: 440, height: 380, transform: `rotate(${lift * -14}deg) translateX(${lift * -120}px)` }}>
      <div style={{ position: "absolute", left: 0, top: 40, width: 440, height: 340, clipPath: "polygon(0 0,100% 0,86% 100%,14% 100%)", background: "linear-gradient(90deg,#9a4a26,#c86a3a 40%,#8a3f1e)" }}><Sheen p={0.3} o={0.2} /></div>
      <div style={{ position: "absolute", left: -10, top: 20, width: 460, height: 60, borderRadius: 10, background: "#b05a30" }} />
      {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ position: "absolute", left: 80 + i * 50, top: -140 + (i % 2) * 30, width: 40, height: 180, borderRadius: "50% 50% 0 0", background: "#3d7a3a", transform: `rotate(${(i - 2.5) * 12}deg)`, transformOrigin: "50% 100%" }} />)}
    </div>
    <div style={{ position: "absolute", left: 1500, top: 300, fontWeight: 900, fontSize: 150, color: RED }}>{Math.round(sec)}<span style={{ fontSize: 50, color: DIM }}> s</span></div>
    <Tag tt={tt} at={(h.liftAt ?? 2.2) + 0.9} x={1560} y={520} txt={h.lab ?? "LO PRIMERO QUE BUSCA"} col={AMB} size={44} />
  </>;
}}</Stage>;
