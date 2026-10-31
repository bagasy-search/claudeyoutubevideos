// sg29a · componentes ÚNICOS de este video (uno por minuto, ninguno se repite en la tanda: ver D:/rtmp/sg29_COMPONENTES.md).
// Cada uno vive en su ESCENARIO (Stage: la foto de ese momento desenfocada atrás + piso iluminado) y se ancla a la palabra.
// Sin rótulos arriba a la izquierda: la palabra va dentro de la escena (en el papel, en la etiqueta, en la madera).
import React from "react";
import { BRUSH, COL, FONT, cl, e, ei, extrude, lerp, rnd, sm, spr, vis } from "../sg29kit/k";
import { Contact, enter } from "../sg29kit/base";

type AtF = (ph: string, after?: number) => number;
export type FxP = { t: number; a: number; b: number };
type StageT = React.FC<{ t: number; a: number; b: number; bg: string; floor?: "wood" | "paper" | "soil" | "stone"; light?: number; zoom?: number; children: React.ReactNode }>;

const paperTag = (size: number, rot = 0): React.CSSProperties => ({ fontFamily: BRUSH, fontSize: size, color: COL.ink, background: `linear-gradient(180deg, ${COL.cream}, ${COL.paper})`, padding: "6px 22px 8px", borderRadius: 4, boxShadow: "0 12px 26px rgba(0,0,0,.45)", transform: `rotate(${rot}deg)`, whiteSpace: "nowrap", display: "inline-block" });
const big = (size: number, col = COL.cream): React.CSSProperties => ({ fontFamily: FONT, fontWeight: 800, fontSize: size, color: col, textShadow: extrude(10, "#3a2a1a"), lineHeight: 1, whiteSpace: "nowrap" });
const Seed: React.FC<{ x: number; y: number; r?: number; s?: number; c?: string; o?: number }> = ({ x, y, r = 0, s = 1, c = "#efe2b8", o = 1 }) => (
  <div style={{ position: "absolute", left: x - 11 * s, top: y - 17 * s, width: 22 * s, height: 34 * s, borderRadius: "50% 50% 46% 46% / 60% 60% 40% 40%", background: `radial-gradient(ellipse at 35% 30%, #fffaf0, ${c} 55%, #b9a66e)`, transform: `rotate(${r}deg)`, opacity: o, boxShadow: "0 3px 5px rgba(0,0,0,.35)" }} />
);
// cabeza de ajo dibujada (dientes en abanico)
const Garlic: React.FC<{ s?: number; sprout?: number }> = ({ s = 1, sprout = 0 }) => (
  <svg width={220 * s} height={240 * s} viewBox="0 0 220 240" style={{ overflow: "visible" }}>
    <defs><radialGradient id="gq" cx="40%" cy="35%"><stop offset="0" stopColor="#fffdf6" /><stop offset=".6" stopColor="#efe6d2" /><stop offset="1" stopColor="#c9b89a" /></radialGradient></defs>
    {sprout > 0 && <path d={`M110 40 Q118 ${40 - 60 * sprout} 104 ${40 - 110 * sprout}`} stroke="#6aa14a" strokeWidth={8} fill="none" strokeLinecap="round" />}
    {[-60, -30, 0, 30, 60].map((dx, i) => <path key={i} d={`M110 40 C ${110 + dx * 1.6} 70, ${110 + dx * 1.7} 190, ${110 + dx * 0.5} 215 C ${110 + dx * 0.2} 222, ${110 - dx * 0.1} 222, 110 215 Z`} fill="url(#gq)" stroke="#b7a27c" strokeWidth={2} />)}
    <path d="M100 40 Q110 10 120 40" fill="#d9ccb0" />
    {Array.from({ length: 9 }, (_, i) => <line key={i} x1={90 + i * 5} y1={218} x2={84 + i * 6} y2={236} stroke="#a8916a" strokeWidth={2} />)}
  </svg>
);

export const mkFx = (Stage: StageT, at: AtF, atEnd: AtF) => {
  // la palabra manda; si ya se dijo antes de que entre la escena, el golpe ocurre apenas entra (nunca "ya pasó")
  const A = (ph: string, a: number) => { try { return Math.max(at(ph, a - 2), a + 0.35); } catch { return a + 1; } };

  // 1 · cubo de basura vs sobre de $4,99: chorro de semillas que cuenta 0→200, el sobre con 12
  const TrashVsPacket: React.FC<FxP> = ({ t, a, b }) => {
    const t1 = A("200 seeds", a), t2 = A("for a little paper envelope", a), t3 = A("12", t2 + 1.5), t4 = A("you threw away", t3);
    const n = Math.round(200 * ei(t, t1 - 0.4, t1 + 1.4));
    const pk = enter(t, t2, b, "right");
    return <Stage t={t} a={a} b={b} bg="a_trash_seeds" floor="wood">
      {/* el cubo */}
      <div style={{ position: "absolute", left: 300, top: 470, width: 380, height: 420, perspective: 900 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "14px 14px 40px 40px", background: "linear-gradient(90deg,#5d6366,#a3a9ac 35%,#6f7578 70%,#4a4f52)", transform: "rotateX(8deg)", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }}>
          {Array.from({ length: 7 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + i * 50, top: 30, width: 6, height: 360, background: "rgba(0,0,0,.18)", borderRadius: 3 }} />)}
        </div>
        <div style={{ position: "absolute", left: -10, top: -24, width: 400, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse at 50% 60%, #1c1a17, #3b3d3f 70%, #8d9396)" }} />
      </div>
      <Contact x={490} y={895} w={460} />
      {/* el chorro de semillas desde la cuchara */}
      {Array.from({ length: 60 }, (_, i) => {
        const st = t1 - 0.4 + i * 0.03, k = (t - st) / 0.7; if (k < 0 || k > 1) return null;
        return <Seed key={i} x={420 + rnd(i, 2) * 140 + 60 * k} y={190 + 300 * k * k} r={rnd(i, 3) * 360 + k * 200} s={0.9} c="#f1d38a" />;
      })}
      <div style={{ position: "absolute", left: 490, top: 330, transform: "translate(-50%,-50%)", ...big(190, COL.cream), opacity: e(t, t1 - 0.3, t1) }}>{n}</div>
      {/* el sobre del vivero */}
      <div style={{ position: "absolute", left: 1180, top: 300, width: 420, height: 560, opacity: pk.o, transform: pk.tr, perspective: 1200 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#f4ead2,#e2d3ae)", borderRadius: 8, boxShadow: "0 30px 70px rgba(0,0,0,.55)", transform: `rotateY(${-12 + 6 * Math.sin(t * 0.7)}deg)` }}>
          <div style={{ position: "absolute", left: 40, top: 40, right: 40, height: 230, borderRadius: 6, background: "radial-gradient(circle at 50% 60%, #f2a33a, #c96a1c)", boxShadow: "inset 0 0 30px rgba(0,0,0,.3)" }} />
          <div style={{ position: "absolute", left: 40, top: 300, fontFamily: FONT, fontWeight: 800, fontSize: 52, color: COL.ink }}>SQUASH</div>
          <div style={{ position: "absolute", left: 40, top: 370, fontFamily: BRUSH, fontSize: 44, color: "#6a5a40" }}>12 seeds</div>
          <div style={{ position: "absolute", right: -30, top: 400, transform: `rotate(-12deg) scale(${Math.min(1.1, spr(t, t2 + 0.4))})`, background: COL.red, color: COL.cream, fontFamily: FONT, fontWeight: 800, fontSize: 64, padding: "10px 26px", borderRadius: 10, boxShadow: "0 12px 26px rgba(0,0,0,.5)" }}>$4.99</div>
        </div>
      </div>
      <Contact x={1390} y={890} w={420} o={pk.o * 0.5} />
      {/* doce, contadas una a una al decir "Twelve." */}
      {Array.from({ length: 12 }, (_, i) => { const k = e(t, t3 + i * 0.05, t3 + i * 0.05 + 0.2); return k > 0 ? <Seed key={i} x={1250 + (i % 6) * 52} y={930 + Math.floor(i / 6) * 50} r={20 * (i % 3 - 1)} o={k} /> : null; })}
      {t > t4 && <div style={{ position: "absolute", left: 960, top: 130, transform: `translateX(-50%) scale(${Math.min(1.05, spr(t, t4))})`, ...big(96, COL.cream) }}>200 <span style={{ color: COL.gold, fontSize: 60 }}>vs</span> 12</div>}
    </Stage>;
  };

  // 2 · el estante de las 5 sobras: caen de a una con peso; la quinta queda bajo un paño hasta "glass of water"
  const FiveShelf: React.FC<FxP> = ({ t, a, b }) => {
    const ts = ["garlic", "squash seeds", "pepper seeds", "tomato seeds", "and one more"].map((p) => A(p, a));
    const tg = A("in a glass of water", a), t7 = A("seven days", a);
    const items = [
      <Garlic key="g" s={0.7} />,
      <div key="s" style={{ width: 160, height: 120, position: "relative" }}>{Array.from({ length: 14 }, (_, i) => <Seed key={i} x={20 + rnd(i, 1) * 120} y={40 + rnd(i, 2) * 70} r={rnd(i, 3) * 180} c="#f1d38a" />)}</div>,
      <svg key="p" width={150} height={170} viewBox="0 0 150 170"><path d="M75 30 C 20 30, 10 90, 30 140 C 45 170, 105 170, 120 140 C 140 90, 130 30, 75 30Z" fill="#c8321e" /><path d="M75 30 L 75 8" stroke="#4f7f34" strokeWidth={10} strokeLinecap="round" /><ellipse cx={55} cy={70} rx={10} ry={26} fill="rgba(255,255,255,.35)" /></svg>,
      <svg key="t" width={160} height={150} viewBox="0 0 160 150"><circle cx={80} cy={85} r={60} fill="#d42a1e" /><path d="M80 25 l-25 -10 l25 18 l25 -18 z" fill="#4f7f34" /><ellipse cx={60} cy={65} rx={12} ry={18} fill="rgba(255,255,255,.3)" /></svg>,
      <div key="o" style={{ width: 120, height: 190, position: "relative" }}>
        <div style={{ position: "absolute", left: 10, top: 60, width: 100, height: 130, borderRadius: "6px 6px 16px 16px", background: "linear-gradient(90deg, rgba(220,240,250,.5), rgba(255,255,255,.15), rgba(220,240,250,.5))", border: "2px solid rgba(255,255,255,.6)" }} />
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 38 + i * 16, top: 100 - 90 * e(t, t7, t7 + 1.5), width: 10, height: 100 + 90 * e(t, t7, t7 + 1.5), background: "linear-gradient(180deg,#5fae4a,#e9f2d8 70%)", borderRadius: 6 }} />)}
      </div>,
    ];
    return <Stage t={t} a={a} b={b} bg="a_five_scraps" floor="wood">
      <div style={{ position: "absolute", left: 160, top: 690, width: 1600, height: 40, background: "linear-gradient(180deg,#a07a4c,#6b4c2c)", borderRadius: 4, boxShadow: "0 30px 50px rgba(0,0,0,.55)" }} />
      {items.map((_, i) => t < ts[i] ? <div key={"h" + i} style={{ position: "absolute", left: 340 + i * 310 - 90, top: 640, width: 180, height: 50, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(0,0,0,.35), transparent 70%)" }}></div> : null)}
      {items.map((it, i) => {
        const q = spr(t, ts[i], 1.1); if (t < ts[i] - 0.05) return null;
        const x = 340 + i * 310, drop = (1 - Math.min(1.05, q)) * -520;
        return <div key={i} style={{ position: "absolute", left: x, top: 690, transform: `translate(-50%,-100%) translateY(${drop}px) scale(1.45)`, transformOrigin: "50% 100%" }}>
          {it}
          <div style={{ position: "absolute", left: "50%", top: "100%", transform: "translate(-50%, 52px)", ...paperTag(40, (i % 2 ? 3 : -3)) }}>{["garlic", "squash", "pepper", "tomato", i === 4 && t < tg ? "?" : "green onion"][i]}</div>
        </div>;
      })}
      {/* el paño sobre la quinta: se levanta al decir "glass of water" */}
      {t > ts[4] && <div style={{ position: "absolute", left: 1580 - 110, top: 690 - 260 - 380 * ei(t, tg, tg + 0.8), width: 220, height: 260, background: "repeating-linear-gradient(45deg,#c8321e 0 14px,#f3ead8 14px 28px)", borderRadius: "40% 40% 10px 10px", boxShadow: "0 18px 30px rgba(0,0,0,.45)", transform: `rotate(${-8 * ei(t, tg, tg + 0.8)}deg)`, opacity: 1 - e(t, tg + 0.6, tg + 0.9) }} />}
    </Stage>;
  };

  // 3 · dos sobres en el tiempo: el del frasco de arroz sigue entero 4 años; el de la bolsa se deshace en 1 invierno
  const TwoEnvelopesTime: React.FC<FxP> = ({ t, a, b }) => {
    const tY = A("four years", a), tW = A("one winter", a);
    const yr = Math.min(4, Math.floor(1 + 3.99 * e(t, tY - 0.3, tY + 2.4)));
    const crumble = e(t, tW, tW + 1.6);
    const Env: React.FC<{ x: number; label: string; dust: number }> = ({ x, label, dust }) => <div style={{ position: "absolute", left: x, top: 330, width: 360, height: 460 }}>
      {dust < 1 && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(170deg,#efe3c4,#d4c296)", borderRadius: 6, boxShadow: "0 26px 60px rgba(0,0,0,.5)", clipPath: dust > 0 ? `polygon(0 ${dust * 100}%, 100% ${dust * 60}%, 100% 100%, 0 100%)` : undefined, filter: `grayscale(${dust}) brightness(${1 - 0.4 * dust})` }}>
        <div style={{ position: "absolute", left: 30, top: 50, fontFamily: BRUSH, fontSize: 58, color: COL.ink }}>{label}</div>
        <div style={{ position: "absolute", left: 30, top: 130, fontFamily: BRUSH, fontSize: 46, color: "#7a5a3a" }}>Kabocha</div>
      </div>}
      {dust > 0 && Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: rnd(i, 1) * 360, top: 460 * dust * rnd(i, 2) + 600 * dust * dust * rnd(i, 4), width: 8, height: 8, borderRadius: 2, background: "#8d8370", opacity: 1 - dust * 0.6 }} />)}
    </div>;
    return <Stage t={t} a={a} b={b} bg="a_rice_jar_shelf" floor="wood">
      <Env x={360} label="1958" dust={0} />
      <div style={{ position: "absolute", left: 320, top: 250, width: 440, height: 600, borderRadius: "40px 40px 60px 60px", background: "linear-gradient(90deg, rgba(220,240,250,.32), rgba(255,255,255,.08) 40%, rgba(220,240,250,.32))", border: "5px solid rgba(255,255,255,.65)", boxShadow: "inset 0 -70px 0 rgba(240,232,210,.92), 0 30px 60px rgba(0,0,0,.4)" }}>
        <div style={{ position: "absolute", left: 20, top: -50, width: 400, height: 50, borderRadius: 12, background: "linear-gradient(180deg,#c9ccd0,#7d8288)" }} />
        {Array.from({ length: 40 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + rnd(i, 1) * 370, top: 540 + rnd(i, 2) * 40, width: 12, height: 6, borderRadius: 3, background: "#d9b77a" }} />)}
      </div>
      <div style={{ position: "absolute", left: 540, top: 820, transform: "translateX(-50%)", ...paperTag(52, -2) }}>rice jar · year {yr}</div>
      <Env x={1200} label="1971" dust={crumble} />
      <div style={{ position: "absolute", left: 1380, top: 820, transform: "translateX(-50%)", ...paperTag(52, 2), opacity: e(t, tW, tW + 0.3) }}>plastic bag · 1 winter</div>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 380 + i * 90, top: 250, width: 70, height: 70, borderRadius: 10, background: i < yr ? COL.gold : "rgba(255,255,255,.15)", transform: `scale(${i < yr ? Math.min(1.1, spr(t, tY + i * 0.6)) : 0.8})`, ...big(40, COL.ink), textShadow: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</div>)}
    </Stage>;
  };

  // 4 · el libro de cuentas de la madre: los años pasan y la columna "semillas compradas" queda en 0
  const Ledger: React.FC<FxP> = ({ t, a, b }) => {
    const t0 = A("never bought one packet", a), t1 = A("not one", t0);
    const scroll = 50 * ei(t, t0 - 0.5, t1 + 2.5);
    return <Stage t={t} a={a} b={b} bg="a_osaka_house" floor="paper" zoom={1}>
      <div style={{ position: "absolute", left: 960, top: 560, width: 1100, height: 760, transform: "translate(-50%,-50%) perspective(1400px) rotateX(28deg)", background: "linear-gradient(90deg,#efe5cc,#f7f0de 48%,#d9cba8 50%,#f7f0de 52%,#efe5cc)", borderRadius: 10, boxShadow: "0 50px 90px rgba(0,0,0,.55)", overflow: "hidden" }}>
        {Array.from({ length: 70 }, (_, i) => { const y = 60 + i * 64 - scroll * 64; if (y < -60 || y > 800) return null; const yr = 1946 + i;
          return <div key={i} style={{ position: "absolute", left: 0, right: 0, top: y, height: 64, borderBottom: "2px solid rgba(43,63,99,.25)" }}>
            <span style={{ position: "absolute", left: 80, top: 8, fontFamily: BRUSH, fontSize: 44, color: COL.indigo }}>{yr}</span>
            <span style={{ position: "absolute", left: 300, top: 8, fontFamily: BRUSH, fontSize: 40, color: "#6a5a40" }}>{["kabocha", "tomato", "negi", "togarashi", "garlic", "daikon"][i % 6]} · saved</span>
            <span style={{ position: "absolute", left: 820, top: 4, fontFamily: FONT, fontWeight: 800, fontSize: 46, color: COL.red }}>0</span>
          </div>; })}
        <div style={{ position: "absolute", left: 790, top: 0, bottom: 0, width: 3, background: "rgba(200,50,30,.4)" }} />
      </div>
      <div style={{ position: "absolute", left: 1380, top: 140, transform: `rotate(-8deg) scale(${Math.min(1.08, spr(t, t1))})`, opacity: e(t, t1, t1 + 0.1), border: `8px solid ${COL.red}`, padding: "4px 24px", fontFamily: FONT, fontWeight: 800, fontSize: 58, color: COL.red, background: "rgba(251,246,234,.92)" }}>NOT ONE</div>
    </Stage>;
  };

  // 5 · el furin (campanita de viento) cuya tira dice SUBSCRIBE: suena al decirlo
  const Furin: React.FC<FxP> = ({ t, a, b }) => {
    const tp = A("press subscribe", a), tf = A("it is free", tp);
    const ring = t > tp ? Math.exp(-(t - tp) * 1.2) : 0;
    const sw = Math.sin(t * 1.3) * 3 + Math.sin((t - tp) * 9) * 16 * ring;
    return <Stage t={t} a={a} b={b} bg="a_garlic_eaves" floor="wood">
      <div style={{ position: "absolute", left: 960, top: 0, width: 4, height: 230, background: "#333", transformOrigin: "50% 0", transform: `rotate(${sw * 0.3}deg)` }} />
      <div style={{ position: "absolute", left: 960, top: 200, transformOrigin: "50% -200px", transform: `translateX(-50%) rotate(${sw}deg)` }}>
        <div style={{ width: 220, height: 180, borderRadius: "50% 50% 12% 12% / 70% 70% 12% 12%", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,.9), rgba(200,230,245,.55) 40%, rgba(120,170,200,.45))", border: "2px solid rgba(255,255,255,.7)", boxShadow: "0 20px 50px rgba(0,0,0,.35)", position: "relative" }}>
          <svg width={220} height={180} style={{ position: "absolute" }}><path d="M40 110 q30 -40 60 0 t60 0" stroke={COL.red} strokeWidth={6} fill="none" /><circle cx={80} cy={70} r={14} fill={COL.red} /><circle cx={140} cy={60} r={10} fill={COL.indigo} /></svg>
        </div>
        <div style={{ width: 3, height: 70, background: "#555", margin: "0 auto" }} />
        <div style={{ marginLeft: -110, width: 440, height: 140, background: `linear-gradient(180deg, ${COL.cream}, ${COL.paper})`, boxShadow: "0 14px 30px rgba(0,0,0,.4)", transform: `rotate(${sw * 0.6}deg)`, transformOrigin: "50% 0", display: "flex", alignItems: "center", justifyContent: "center", borderTop: `12px solid ${COL.red}` }}>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 70, color: COL.ink, letterSpacing: 3 }}>SUBSCRIBE</div>
        </div>
      </div>
      {[0, 1, 2].map((i) => { const k = cl((t - tp - i * 0.25) / 1.2); return k > 0 && k < 1 ? <div key={i} style={{ position: "absolute", left: 960 - 160 - 300 * k, top: 290 - 160 - 300 * k, width: 320 + 600 * k, height: 320 + 600 * k, borderRadius: "50%", border: `3px solid rgba(251,246,234,${0.6 * (1 - k)})` }} /> : null; })}
      <div style={{ position: "absolute", left: 1180, top: 700, opacity: e(t, tf, tf + 0.3), ...paperTag(60, 4) }}>free · every week</div>
    </Stage>;
  };

  // 6 · la cómoda de la cocina: el SEGUNDO cajón sale hacia cámara y muestra los sobres con nombre y año
  const SeedDrawer: React.FC<FxP> = ({ t, a, b }) => {
    const to = A("second drawer", a), tk = A("kabacha 1958", a), tt = A("tomato from mr tanaka", a);
    const pull = ei(t, to, to + 1.4);
    return <Stage t={t} a={a} b={b} bg="a_seed_drawer" floor="wood">
      <div style={{ position: "absolute", left: 960, top: 600, transform: "translate(-50%,-50%) perspective(1600px) rotateX(-8deg) rotateY(-18deg)", transformStyle: "preserve-3d", width: 760, height: 620 }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,#6b4628,#8a5c34 50%,#6b4628)", borderRadius: 8, boxShadow: "0 50px 90px rgba(0,0,0,.6)" }} />
        {[0, 1, 2].map((i) => { const z = i === 1 ? 300 * pull : 0;
          return <div key={i} style={{ position: "absolute", left: 40, top: 40 + i * 190, width: 680, height: 160, transform: `translateZ(${z}px)`, transformStyle: "preserve-3d" }}>
            {i === 1 && <div style={{ position: "absolute", left: 0, top: 0, width: 680, height: 300 * pull, transformOrigin: "50% 0", transform: "rotateX(90deg)", background: "linear-gradient(180deg,#5a3a20,#7a5230)" }}>
              {[0, 1, 2, 3, 4].map((j) => <div key={j} style={{ position: "absolute", left: 40 + j * 125, top: 20, width: 110, height: Math.max(0, 300 * pull - 40), background: "linear-gradient(180deg,#e9dcbc,#d2c096)", border: "1px solid #b9a77f" }} />)}
            </div>}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#a0703f,#7d532d)", borderRadius: 6, boxShadow: "inset 0 0 0 4px rgba(0,0,0,.2), 0 10px 20px rgba(0,0,0,.4)" }}>
              <div style={{ position: "absolute", left: 300, top: 64, width: 80, height: 22, borderRadius: 11, background: "linear-gradient(180deg,#d9c08a,#8a6a38)" }} />
            </div>
          </div>; })}
      </div>
      {[[tk, "Kabocha · 1958", 300, -6], [tt, "Tomato · Mr. Tanaka · 1962", 1260, 5]].map(([ta, txt, x, r], i) => { const q = enter(t, ta as number, b, i ? "right" : "left");
        return <div key={i} style={{ position: "absolute", left: x as number, top: 190, opacity: q.o, transform: q.tr }}>
          <div style={{ width: 380, height: 250, background: "linear-gradient(170deg,#efe3c4,#d4c296)", boxShadow: "0 24px 50px rgba(0,0,0,.5)", transform: `rotate(${r}deg)`, padding: 30, fontFamily: BRUSH, fontSize: 48, color: COL.ink, lineHeight: 1.1, backgroundImage: "repeating-linear-gradient(0deg, transparent 0 30px, rgba(0,0,0,.05) 30px 31px)" }}>{txt as string}</div>
        </div>; })}
    </Stage>;
  };

  // 7 · el trueque por la cerca: dos puñados que cruzan en arco (pepino ⇄ berenjena)
  const FenceTrade: React.FC<FxP> = ({ t, a, b }) => {
    const tc = A("cucumber seeds", a), te = A("eggplant", a);
    const arc = (t0: number, x0: number, x1: number, col: string, n: number) => Array.from({ length: n }, (_, i) => {
      const k = (t - t0 - i * 0.04) / 0.9; if (k < 0 || k > 1.3) return null; const q = Math.min(1, k);
      return <Seed key={col + i} x={lerp(x0, x1, q) + (rnd(i, 2) - 0.5) * 40} y={560 - 330 * Math.sin(Math.PI * q) + (rnd(i, 3) - 0.5) * 30} r={q * 400} s={1.4} c={col} />;
    });
    return <Stage t={t} a={a} b={b} bg="a_trade_fence" floor="soil">
      {/* la cerca de bambú del barrio, a lo ancho: cañas con nudos y dos travesaños; los puñados pasan POR ENCIMA */}
      {Array.from({ length: 34 }, (_, j) => <div key={j} style={{ position: "absolute", left: 140 + j * 48, top: 600 + (j % 3) * 6, width: 30, height: 340, borderRadius: 6, background: "repeating-linear-gradient(180deg, transparent 0 96px, rgba(60,45,20,.55) 96px 101px), linear-gradient(90deg,#8d7a4a,#cdbb84 45%,#9a8650 70%,#6f5f38)", boxShadow: "2px 0 8px rgba(0,0,0,.35)" }} />)}
      {[660, 800].map((y) => <div key={y} style={{ position: "absolute", left: 120, top: y, width: 1680, height: 22, borderRadius: 11, background: "linear-gradient(180deg,#b8a46a,#7a6838)", boxShadow: "0 6px 12px rgba(0,0,0,.4)" }} />)}
      {/* manos ahuecadas */}
      {[[400, 1], [1520, -1]].map(([x, d], i) => <svg key={i} width={420} height={260} style={{ position: "absolute", left: (x as number) - 210, top: 470, transform: `scaleX(${d})`, filter: "drop-shadow(0 16px 20px rgba(0,0,0,.45))" }} viewBox="0 0 260 160"><path d="M10 60 Q60 150 160 140 Q240 130 250 70 L230 60 Q200 110 140 105 Q70 100 40 40 Z" fill="#e3b391" stroke="#a87455" strokeWidth={3} /></svg>)}
      <div style={{ position: "absolute", left: 300, top: 430, width: 230, height: 70, borderRadius: 35, background: "radial-gradient(ellipse at 40% 30%, #9fd07a, #3f7a2a 70%)", transform: "rotate(-12deg)", boxShadow: "0 12px 20px rgba(0,0,0,.45)", backgroundImage: "radial-gradient(circle, rgba(255,255,255,.35) 2px, transparent 3px)", backgroundSize: "26px 20px" }} />
      <div style={{ position: "absolute", left: 1410, top: 400, width: 200, height: 120, borderRadius: "60% 40% 40% 60% / 55% 50% 50% 45%", background: "radial-gradient(ellipse at 35% 30%, #a77bc9, #4a1f63 65%)", transform: "rotate(14deg)", boxShadow: "0 12px 20px rgba(0,0,0,.45)" }}><div style={{ position: "absolute", left: -26, top: 36, width: 50, height: 46, borderRadius: "50% 20% 20% 50%", background: "#4f7f34" }} /></div>
      {arc(tc, 430, 1490, "#e8f0c8", 14)}{arc(te, 1490, 430, "#f6e7b0", 14)}
      <div style={{ position: "absolute", left: 300, top: 300, ...paperTag(64, -3), opacity: e(t, tc, tc + 0.3) }}>cucumber →</div>
      <div style={{ position: "absolute", left: 1340, top: 300, ...paperTag(64, 3), opacity: e(t, te, te + 0.3) }}>← eggplant</div>
    </Stage>;
  };

  // 8 · rayos X del diente de ajo: una línea de luz barre y adentro aparece la plantita entera
  const CloveXray: React.FC<FxP> = ({ t, a, b }) => {
    const ts = A("a whole little plant", a), sc = ei(t, ts - 0.3, ts + 1.6);
    return <Stage t={t} a={a} b={b} bg="a_garlic_heads" floor="wood" light={0.8}>
      <div style={{ position: "absolute", left: 960, top: 560, transform: `translate(-50%,-50%) rotate(${4 * Math.sin(t * 0.6)}deg)` }}>
        <svg width={420} height={620} viewBox="0 0 420 620">
          <defs><radialGradient id="cv" cx="38%" cy="35%"><stop offset="0" stopColor="#fffdf4" /><stop offset=".7" stopColor="#eadcbc" /><stop offset="1" stopColor="#bba67e" /></radialGradient>
            <clipPath id="cx"><rect x={0} y={0} width={420} height={620 * sc} /></clipPath></defs>
          <path id="cl" d="M210 30 C 120 120, 70 330, 110 520 C 140 600, 280 600, 310 520 C 350 330, 300 120, 210 30 Z" fill="url(#cv)" stroke="#a8916a" strokeWidth={4} />
          <g clipPath="url(#cx)">
            <path d="M210 30 C 120 120, 70 330, 110 520 C 140 600, 280 600, 310 520 C 350 330, 300 120, 210 30 Z" fill="#f6eedb" opacity={0.92} />
            <path d="M210 520 C 205 400, 214 260, 210 80" stroke="#4f9f3a" strokeWidth={16} fill="none" strokeLinecap="round" />
            <path d="M210 260 C 180 220, 175 170, 182 120" stroke="#6fbe5a" strokeWidth={10} fill="none" />
            {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M210 540 q ${(i - 4) * 18} 40 ${(i - 4) * 26} 70`} stroke="#a8916a" strokeWidth={5} fill="none" />)}
          </g>
          <rect x={0} y={620 * sc - 4} width={420} height={8} fill="#bff" opacity={sc > 0 && sc < 1 ? 0.9 : 0} style={{ filter: "blur(2px)" }} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 1290, top: 380, opacity: e(t, ts + 0.8, ts + 1.1), ...paperTag(72, 4) }}>shoot</div>
      <div style={{ position: "absolute", left: 1270, top: 760, opacity: e(t, ts + 1.2, ts + 1.5), ...paperTag(72, -3) }}>roots</div>
    </Stage>;
  };

  // 9 · corte de tierra con el tiempo corriendo: octubre raíces → nieve → brote → julio cabeza entera
  const SoilSeasons: React.FC<FxP> = ({ t, a, b }) => {
    const tr = A("makes roots in the cold", a), tsn = A("under the snow", a), tsp = A("it shoots up", a), tj = A("by july", a);
    const roots = e(t, tr, tr + 1.4), snow = e(t, tsn, tsn + 1) * (1 - e(t, tsp - 0.3, tsp + 0.4)), shoot = e(t, tsp, tsp + 1.4), head = e(t, tj, tj + 1.5);
    const month = t < tsn ? "OCTOBER" : t < tsp ? "JANUARY" : t < tj ? "APRIL" : "JULY";
    return <Stage t={t} a={a} b={b} bg="a_straw_bed" floor="soil">
      <div style={{ position: "absolute", left: 360, top: 300, width: 1200, height: 620, borderRadius: 12, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.55)", border: "10px solid #5a3d22" }}>
        <div style={{ position: "absolute", inset: 0, top: 200, background: "linear-gradient(180deg,#5a3f2a,#3a281a)", backgroundImage: "radial-gradient(#6b4c33 1px, transparent 2px)", backgroundSize: "14px 14px" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 200, background: "linear-gradient(180deg,#b9cfdc,#e6eef2)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 200 - 70 * snow, height: 70 * snow + 2, background: "linear-gradient(180deg,#fff,#e9f1f6)" }} />
        {[0, 1, 2].map((i) => { const x = 250 + i * 350;
          return <div key={i} style={{ position: "absolute", left: x, top: 330 }}>
            <svg width={300} height={300} style={{ position: "absolute", left: -150, top: -60, overflow: "visible" }}>
              {Array.from({ length: 8 }, (_, r) => <path key={r} d={`M150 120 q ${(r - 3.5) * 20} ${60 * roots} ${(r - 3.5) * 34 * roots} ${130 * roots}`} stroke="#efe0bf" strokeWidth={3} fill="none" />)}
              <path d={`M150 70 L150 ${70 - (180 + 120 * head) * shoot}`} stroke="#5fae4a" strokeWidth={10} strokeLinecap="round" />
              <path d={`M150 ${20 - 120 * shoot} q ${50 * shoot} -40 ${70 * shoot} -110`} stroke="#6fbe5a" strokeWidth={8} fill="none" />
              <ellipse cx={150} cy={95} rx={30 + 50 * head} ry={34 + 36 * head} fill="#efe6d2" stroke="#b7a27c" strokeWidth={3} />
            </svg>
          </div>; })}
      </div>
      <div style={{ position: "absolute", left: 960, top: 200, transform: "translateX(-50%)", ...big(80) }}>{month}</div>
    </Stage>;
  };

  // 10 · el mapa de Ohio 1971 dibujado en tinta: edificio, estacionamiento, la franja de tierra y 3 cabezas plantadas
  const ParkingMap: React.FC<FxP> = ({ t, a, b }) => {
    const t0 = Math.min(A("behind our apartment building", a), a + 0.6), t1 = A("strip of dirt", a), t2 = A("the landlord", a);
    const d = (k: number, len: number) => ({ strokeDasharray: len, strokeDashoffset: len * (1 - k) });
    return <Stage t={t} a={a} b={b} bg="a_parking_strip" floor="paper">
      <div style={{ position: "absolute", left: 960, top: 560, transform: "translate(-50%,-50%) perspective(1400px) rotateX(40deg) rotateZ(-6deg)", width: 1200, height: 700, background: "#f1e7cf", boxShadow: "0 50px 90px rgba(0,0,0,.5)", borderRadius: 6 }}>
        <svg width={1200} height={700}>
          <rect x={120} y={80} width={520} height={240} fill="none" stroke={COL.ink} strokeWidth={6} style={d(e(t, t0, t0 + 1.2), 1600)} />
          {Array.from({ length: 8 }, (_, i) => <rect key={i} x={160 + i * 60} y={120} width={36} height={50} fill="none" stroke={COL.ink} strokeWidth={3} style={d(e(t, t0 + 0.6 + i * 0.05, t0 + 1.2 + i * 0.05), 200)} />)}
          {Array.from({ length: 7 }, (_, i) => <line key={i} x1={120 + i * 130} y1={460} x2={120 + i * 130} y2={620} stroke={COL.ink} strokeWidth={4} style={d(e(t, t0 + 1, t0 + 1.6), 160)} />)}
          {[0, 2, 3, 5].map((i) => <g key={i} opacity={e(t, t0 + 1.4, t0 + 1.8)}><rect x={140 + i * 130} y={490} width={90} height={120} rx={20} fill={["#c8321e", "#2b3f63", "#d9a441", "#5f8f3a"][i % 4]} stroke={COL.ink} strokeWidth={3} /><rect x={152 + i * 130} y={512} width={66} height={30} rx={8} fill="#cfe6f0" /><rect x={152 + i * 130} y={566} width={66} height={24} rx={8} fill="#cfe6f0" /></g>)}
          <rect x={120} y={360} width={900 * e(t, t1, t1 + 1)} height={56} fill="#7a5636" />
        </svg>
        {[0, 1, 2].map((i) => { const q = spr(t, t1 + 0.9 + i * 0.25); return t > t1 + 0.85 + i * 0.25 ? <div key={i} style={{ position: "absolute", left: 260 + i * 260, top: 388, transform: `translate(-50%,-100%) translateY(${(1 - Math.min(1, q)) * -200}px) rotateX(-40deg)` }}><Garlic s={0.4} /></div> : null; })}
        <div style={{ position: "absolute", left: 140, top: 20, fontFamily: BRUSH, fontSize: 48, color: COL.ink, opacity: e(t, t0, t0 + 0.4) }}>apartment · Ohio 1971</div>
        <div style={{ position: "absolute", left: 700, top: 640, fontFamily: BRUSH, fontSize: 44, color: COL.indigo, opacity: e(t, t0 + 1.2, t0 + 1.6) }}>parking lot</div>
      </div>
      <div style={{ position: "absolute", left: 1460, top: 220, opacity: e(t, t2, t2 + 0.3), transform: `rotate(6deg) scale(${Math.min(1.06, spr(t, t2))})`, background: COL.cream, borderRadius: 30, padding: "18px 34px", fontFamily: BRUSH, fontSize: 52, color: COL.ink, boxShadow: "0 16px 30px rgba(0,0,0,.4)" }}>crazy?</div>
    </Stage>;
  };

  // 11 · la balanza: cabeza firme y pesada contra una blanda; el brazo se inclina con peso real
  const HeadScale: React.FC<FxP> = ({ t, a, b }) => {
    const th = A("heavy in the hand", a), tg = A("green tip", a);
    const tilt = -14 * spr(t, th, 0.7) + 2 * Math.sin(t * 2) * Math.exp(-Math.max(0, t - th - 1));
    const rows = [[A("choose a firm head", a), "firm"], [th, "heavy"], [A("fat cloves", a), "fat cloves"], [tg, "a green tip = perfect"]] as [number, string][];
    return <Stage t={t} a={a} b={b} bg="a_garlic_heads" floor="wood">
      <div style={{ position: "absolute", left: 640, top: 360 }}>
        <div style={{ position: "absolute", left: -12, top: 0, width: 24, height: 460, background: "linear-gradient(90deg,#8a6a38,#d9c08a,#8a6a38)" }} />
        <div style={{ position: "absolute", left: -120, top: 450, width: 240, height: 40, borderRadius: 8, background: "linear-gradient(180deg,#a07a4c,#5a3d22)" }} />
        <div style={{ position: "absolute", left: -360, top: -8, width: 720, height: 16, borderRadius: 8, background: "linear-gradient(180deg,#e8d29a,#9a7a3a)", transform: `rotate(${tilt}deg)` }}>
          {[0, 1].map((i) => { const x = i ? 680 : 40; const cnt = -tilt * (i ? 1 : -1);
            return <div key={i} style={{ position: "absolute", left: x, top: 8, transform: `rotate(${-tilt}deg)`, transformOrigin: "0 0" }}>
              <div style={{ position: "absolute", left: -2, top: 0, width: 2, height: 160, background: "#555" }} />
              <div style={{ position: "absolute", left: -110, top: 160, width: 220, height: 30, borderRadius: "0 0 110px 110px", background: "linear-gradient(180deg,#d9c08a,#8a6a38)" }} />
              <div style={{ position: "absolute", left: 0, top: 160, transform: `translate(-50%,-100%) scale(${i ? 0.55 : 0.75})`, transformOrigin: "50% 100%", filter: i ? "saturate(.6) brightness(.85)" : undefined }}><Garlic s={1} /></div>
              {cnt === 0 ? null : null}
            </div>; })}
        </div>
      </div>
      <div style={{ position: "absolute", left: 1180, top: 300 }}>
        {rows.map(([ta, txt], i) => { const q = enter(t, ta, b, "right"); return <div key={i} style={{ opacity: q.o, transform: q.tr, marginBottom: 26, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 54, height: 54, borderRadius: 8, background: COL.cream, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 16px rgba(0,0,0,.4)" }}><svg width={40} height={40}><path d="M6 22 L16 32 L34 8" stroke={COL.leaf} strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray={50} strokeDashoffset={50 * (1 - e(t, ta + 0.1, ta + 0.4))} /></svg></div>
          <div style={paperTag(50, 0)}>{txt}</div></div>; })}
      </div>
    </Stage>;
  };

  // 12 · regla de plantar: corte de tierra, el diente baja punta arriba, regla de 2", compás de 6", manta de paja que cae
  const PlantRuler: React.FC<FxP> = ({ t, a, b }) => {
    const tp = A("pointy end up", a), t2 = A("two inches deep", a), t6 = A("six inches between", a), ts = A("blanket of straw", a);
    const dn = ei(t, tp, tp + 1), cal = e(t, t6, t6 + 1), straw = e(t, ts, ts + 1.6);
    return <Stage t={t} a={a} b={b} bg="a_clove_ruler" floor="soil">
      <div style={{ position: "absolute", left: 260, top: 520, width: 1400, height: 400, background: "linear-gradient(180deg,#5a3f2a,#2e2015)", borderTop: "4px solid #7a5a3a", boxShadow: "0 30px 60px rgba(0,0,0,.5)" }} />
      {[0, 1, 2].map((i) => { const x = 560 + i * 400;
        return <div key={i} style={{ position: "absolute", left: x, top: 380 + 260 * (i === 0 ? dn : e(t, t6 + i * 0.3, t6 + i * 0.3 + 0.8)), transform: "translate(-50%,-50%)" }}>
          <svg width={90} height={130} viewBox="0 0 90 130"><path d="M45 4 C 15 40, 10 90, 25 120 L 65 120 C 80 90, 75 40, 45 4 Z" fill="#efe6d2" stroke="#a8916a" strokeWidth={3} /></svg>
        </div>; })}
      {/* regla de 2 pulgadas */}
      <div style={{ position: "absolute", left: 400, top: 520, width: 70, height: 200 * e(t, t2, t2 + 0.7), background: "repeating-linear-gradient(180deg,#e9d38a 0 18px,#3a2a1a 18px 20px)", border: "3px solid #6a4a22", overflow: "hidden" }} />
      <div style={{ position: "absolute", left: 300, top: 560, opacity: e(t, t2, t2 + 0.3), ...big(70) }}>2"</div>
      {/* compás de 6 pulgadas */}
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d={`M560 470 L ${560 + 400 * cal} 470`} stroke={COL.gold} strokeWidth={6} />
        <path d="M560 450 L560 490" stroke={COL.gold} strokeWidth={6} />
        <path d={`M${560 + 400 * cal} 450 L${560 + 400 * cal} 490`} stroke={COL.gold} strokeWidth={6} />
      </svg>
      <div style={{ position: "absolute", left: 760, top: 380, transform: "translateX(-50%)", opacity: cal, ...big(70, COL.gold) }}>6"</div>
      {/* la paja */}
      {Array.from({ length: 110 }, (_, i) => { const k = cl((straw - rnd(i, 1) * 0.5) / 0.5); if (k <= 0) return null;
        return <div key={i} style={{ position: "absolute", left: 270 + rnd(i, 2) * 1380, top: lerp(-40, 440 + rnd(i, 3) * 70, sm(k)), width: 90 + rnd(i, 4) * 60, height: 6, borderRadius: 3, background: ["#e7c56a", "#d9b24f", "#f1d98a"][i % 3], transform: `rotate(${(rnd(i, 5) - 0.5) * 40}deg)`, boxShadow: "0 2px 3px rgba(0,0,0,.3)" }} />; })}
      <div style={{ position: "absolute", left: 1500, top: 300, opacity: e(t, ts + 1, ts + 1.4), ...paperTag(50, 4) }}>3-4" of straw</div>
    </Stage>;
  };

  // 13 · espejo: diente grande → cabeza grande / diente chico → cabeza chica, creciendo a la vez; la cosecha mejora año a año
  const BigSmall: React.FC<FxP> = ({ t, a, b }) => {
    const tb = A("big clove big head", a), ts = A("small clove small head", a), te = A("a little better", a);
    const gB = e(t, tb, tb + 1.6), gS = e(t, ts, ts + 1.6);
    return <Stage t={t} a={a} b={b} bg="a_big_small" floor="wood">
      <div style={{ position: "absolute", left: 958, top: 140, width: 4, height: 760, background: "linear-gradient(180deg,transparent,rgba(255,255,255,.6),transparent)" }} />
      {[[540, gB, 1, "BIG"], [1380, gS, 0.55, "small"]].map(([x, g, s, l], i) => <div key={i} style={{ position: "absolute", left: x as number, top: 820, transform: "translateX(-50%)" }}>
        <div style={{ position: "absolute", left: 0, bottom: 0, transform: `translateX(-50%) scale(${(s as number) * (0.35 + 0.65 * (g as number))})`, transformOrigin: "50% 100%" }}><Garlic s={1.6} sprout={(g as number) * 0.3} /></div>
        <div style={{ position: "absolute", left: 0, top: 30, transform: "translateX(-50%)", ...paperTag(56, i ? 3 : -3) }}>{l as string} clove</div>
      </div>)}
      <Contact x={540} y={830} w={420} /><Contact x={1380} y={830} w={260} />
      <div style={{ position: "absolute", left: 960, top: 150, transform: `translateX(-50%) scale(${Math.min(1.06, spr(t, te))})`, opacity: e(t, te, te + 0.2), ...paperTag(64, -2) }}>every year a little better</div>
    </Stage>;
  };

  // 14 · el bol de agua visto de costado: las llenas se hunden, las vacías flotan y un dedo las saca
  const SinkFloat: React.FC<FxP> = ({ t, a, b }) => {
    const tw = A("bowl of water", a), ts = A("sink to the bottom", a), tf = A("the ones that float", a);
    return <Stage t={t} a={a} b={b} bg="a_sink_float" floor="wood">
      <div style={{ position: "absolute", left: 460, top: 380, width: 1000, height: 480, borderRadius: "0 0 500px 500px / 0 0 300px 300px", background: "linear-gradient(180deg, rgba(190,225,240,.25), rgba(120,180,210,.45))", border: "6px solid rgba(255,255,255,.55)", borderTop: "none", overflow: "hidden", boxShadow: "inset 0 -30px 60px rgba(30,60,80,.4), 0 40px 80px rgba(0,0,0,.4)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 60 + Math.sin(t * 2) * 3, height: 6, background: "rgba(255,255,255,.7)" }} />
        {Array.from({ length: 26 }, (_, i) => { const full = i % 3 !== 0; const t0 = tw + i * 0.05; if (t < t0) return null;
          const k = cl((t - t0) / 0.5), ys = full ? lerp(-40, 360 + rnd(i, 4) * 50, ei(t, ts - 0.4 + rnd(i, 7) * 0.4, ts + 1.2)) : 44 + Math.sin(t * 2 + i) * 4;
          const flick = !full ? e(t, tf + 0.6 + (i % 5) * 0.2, tf + 1 + (i % 5) * 0.2) : 0;
          return <Seed key={i} x={60 + rnd(i, 2) * 880 + flick * 900} y={Math.min(ys, lerp(-60, ys, k)) - flick * 300} r={rnd(i, 3) * 180 + (full ? 0 : 80)} s={1.9} c={full ? "#f1d38a" : "#fff7e2"} o={full ? 1 : 0.85} />; })}
      </div>
      <div style={{ position: "absolute", left: 300, top: 760, opacity: e(t, ts, ts + 0.3), ...paperTag(52, -4) }}>full = sink ✓</div>
      <div style={{ position: "absolute", left: 1420, top: 300, opacity: e(t, tf, tf + 0.3), ...paperTag(52, 4) }}>empty = float ✕</div>
    </Stage>;
  };

  // 15 · plato vs servilleta de papel: la semilla se despega del plato y en el papel se rompe
  const TowelTear: React.FC<FxP> = ({ t, a, b }) => {
    const tn = A("not on a paper towel", a), tt = A("tearing the seed", a);
    const lift = ei(t, tt - 0.6, tt + 0.6);
    return <Stage t={t} a={a} b={b} bg="a_paper_stuck" floor="wood">
      {[[560, "ceramic plate", true], [1360, "paper towel", false]].map(([x, l, ok], i) => <div key={i} style={{ position: "absolute", left: x as number, top: 600, transform: "translate(-50%,-50%)" }}>
        <div style={{ width: 520, height: 300, borderRadius: ok ? "50%" : 8, background: ok ? "radial-gradient(ellipse at 45% 40%, #ffffff, #e9eef0 60%, #c7cfd2)" : "repeating-linear-gradient(45deg,#f8f6f0 0 10px,#efece4 10px 20px)", boxShadow: "0 30px 60px rgba(0,0,0,.45)", transform: "perspective(900px) rotateX(55deg)" }} />
        <div style={{ position: "absolute", left: 260, top: 130 - 140 * lift }}>
          {ok ? <Seed x={0} y={0} s={4.4} c="#f1d38a" /> : <>
            <Seed x={-6} y={0} s={4.4} c="#f1d38a" o={1} />
            <div style={{ position: "absolute", left: -55, top: 50, width: 110, height: 150 * lift, background: "repeating-linear-gradient(90deg,#fbf9f2 0 5px,rgba(240,236,226,.4) 5px 9px)", clipPath: "polygon(0 0, 100% 0, 85% 100%, 60% 70%, 40% 100%, 15% 75%)", opacity: 0.95 }} />
          </>}
        </div>
        <div style={{ position: "absolute", left: 260, top: 330, transform: "translateX(-50%)", ...paperTag(48, i ? 3 : -3) }}>{l as string}</div>
        <div style={{ position: "absolute", left: 400, top: -30, transform: `scale(${Math.min(1.1, spr(t, tt + 0.4))})`, opacity: e(t, tt + 0.4, tt + 0.5), fontFamily: FONT, fontWeight: 800, fontSize: 120, color: ok ? COL.leaf : COL.red, textShadow: "0 6px 16px rgba(0,0,0,.5)" }}>{ok ? "✓" : "✕"}</div>
      </div>)}
      {t > tn && t < tn + 0.6 && null}
    </Stage>;
  };

  // 16 · la prueba de doblar: una semilla se dobla como goma (mojada), la otra se PARTE (seca)
  const BendTest: React.FC<FxP> = ({ t, a, b }) => {
    const tr = Math.max(A("bends like rubber", a), a + 0.6), ts = Math.max(A("if it snaps", a), tr + 2.2);
    const bend = Math.sin(Math.PI * cl((t - tr) / 1.6)) * 38, snap = t > ts + 0.4;
    const Big: React.FC<{ rot: number; c: string }> = ({ rot, c }) => <div style={{ width: 120, height: 260, borderRadius: "50% 50% 46% 46% / 60% 60% 40% 40%", background: `radial-gradient(ellipse at 35% 30%, #fffaf0, ${c} 55%, #b9a66e)`, transform: `rotate(${rot}deg)`, boxShadow: "0 10px 20px rgba(0,0,0,.4)" }} />;
    return <Stage t={t} a={a} b={b} bg="a_bend_snap" floor="wood">
      <div style={{ position: "absolute", left: 560, top: 360, transform: "translateX(-50%)" }}>
        <div style={{ position: "relative", width: 120, height: 260 }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 120, height: 130, overflow: "hidden", transformOrigin: "50% 100%", transform: `rotate(${-bend}deg)` }}><Big rot={0} c="#e9d9a0" /></div>
          <div style={{ position: "absolute", left: 0, top: 130, width: 120, height: 130, overflow: "hidden" }}><div style={{ marginTop: -130 }}><Big rot={0} c="#e9d9a0" /></div></div>
        </div>
        <div style={{ position: "absolute", left: 60, top: 320, transform: "translateX(-50%)", ...paperTag(52, -3), opacity: e(t, tr, tr + 0.3) }}>bends = wet</div>
      </div>
      <div style={{ position: "absolute", left: 1360, top: 360, transform: "translateX(-50%)" }}>
        <div style={{ position: "relative", width: 120, height: 260 }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: 120, height: 130, overflow: "hidden", transformOrigin: "30% 100%", transform: snap ? `translate(${-30 * e(t, ts + 0.4, ts + 0.8)}px,${-20 * e(t, ts + 0.4, ts + 0.8)}px) rotate(${-28 * e(t, ts + 0.4, ts + 0.8)}deg)` : `rotate(${-6 * e(t, ts, ts + 0.4)}deg)` }}><Big rot={0} c="#f3e6bd" /></div>
          <div style={{ position: "absolute", left: 0, top: 130, width: 120, height: 130, overflow: "hidden", transform: snap ? `translate(${16 * e(t, ts + 0.4, ts + 0.8)}px, 8px) rotate(${14 * e(t, ts + 0.4, ts + 0.8)}deg)` : undefined }}><div style={{ marginTop: -130 }}><Big rot={0} c="#f3e6bd" /></div></div>
          {snap && Array.from({ length: 10 }, (_, i) => { const k = cl((t - ts - 0.4) / 0.6); return <div key={i} style={{ position: "absolute", left: 60 + Math.cos(i) * 160 * k, top: 130 + Math.sin(i * 2.1) * 120 * k + 200 * k * k, width: 8, height: 8, background: "#f3e6bd", opacity: 1 - k }} />; })}
        </div>
        <div style={{ position: "absolute", left: 60, top: 320, transform: "translateX(-50%)", ...paperTag(52, 3), opacity: e(t, ts + 0.4, ts + 0.7) }}>snaps = ready</div>
      </div>
    </Stage>;
  };

  // 17 · la abeja que cruza: vuela en ocho entre la flor de zapallo y la de zucchini, deja polen, sale un zapallo "sorpresa"
  const BeeCross: React.FC<FxP> = ({ t, a, b }) => {
    const tc = Math.max(A("can cross", a), a + 0.4), tsu = Math.min(A("a surprise in the garden is a gift", a), b - 2.6);
    const k = cl((t - tc) / 4), ang = k * Math.PI * 4;
    const bx = 960 + Math.sin(ang) * 420, by = 470 + Math.sin(ang * 2) * 120;
    const Flower: React.FC<{ x: number; c: string }> = ({ x, c }) => <svg width={260} height={260} style={{ position: "absolute", left: x - 130, top: 340 }} viewBox="0 0 260 260">{Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx={130} cy={70} rx={46} ry={70} fill={c} transform={`rotate(${i * 72} 130 130)`} />)}<circle cx={130} cy={130} r={30} fill="#e8a12a" /></svg>;
    return <Stage t={t} a={a} b={b} bg="a_squash_cross" floor="soil">
      <Flower x={540} c="#f2b632" /><Flower x={1380} c="#f7cf4a" />
      <div style={{ position: "absolute", left: 470, top: 640, ...paperTag(48, -3) }}>pumpkin</div>
      <div style={{ position: "absolute", left: 1310, top: 640, ...paperTag(48, 3) }}>zucchini</div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{Array.from({ length: 50 }, (_, i) => { const kk = (i / 50) * k, an = kk * Math.PI * 4; return <circle key={i} cx={960 + Math.sin(an) * 420} cy={470 + Math.sin(an * 2) * 120} r={4} fill="#ffd34a" opacity={0.7} />; })}</svg>
      {k > 0 && k < 1.02 && <div style={{ position: "absolute", left: bx - 30, top: by - 22, width: 60, height: 44, borderRadius: "50%", background: "repeating-linear-gradient(90deg,#2a2016 0 10px,#f2c230 10px 20px)", boxShadow: "0 6px 10px rgba(0,0,0,.4)" }}>
        <div style={{ position: "absolute", left: 14, top: -20, width: 30, height: 26, borderRadius: "50%", background: "rgba(255,255,255,.7)", transform: `scaleY(${0.6 + 0.4 * Math.sin(t * 60)})` }} />
      </div>}
      {t > tsu && <div style={{ position: "absolute", left: 960, top: 780, transform: `translate(-50%,-50%) scale(${Math.min(1.08, spr(t, tsu))})` }}>
        <div style={{ width: 300, height: 190, borderRadius: "50%", background: "repeating-linear-gradient(90deg,#f2a33a 0 30px,#5f8f3a 30px 50px,#f7cf4a 50px 70px)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
        <div style={{ position: "absolute", left: 120, top: -40, width: 60, height: 60, background: COL.red, transform: "rotate(45deg)", borderRadius: 8 }} />
      </div>}
    </Stage>;
  };

  // 18 · el semáforo de la madurez: el morrón pasa de verde a rojo y el medidor "semillas listas" sube; el verde = chico sacado de la escuela
  const RipeMeter: React.FC<FxP> = ({ t, a, b }) => {
    const tr = A("red orange or yellow", a), tg = A("never green", a), ts = A("10 years old", a);
    const c = ei(t, tr - 0.6, tr + 1.4) * (1 - ei(t, tg - 0.2, tg + 0.5));
    const col = c < 0.5 ? `rgb(${lerp(70, 240, c * 2)},${lerp(150, 170, c * 2)},${lerp(60, 40, c * 2)})` : `rgb(${lerp(240, 200, (c - 0.5) * 2)},${lerp(170, 40, (c - 0.5) * 2)},${lerp(40, 30, (c - 0.5) * 2)})`;
    return <Stage t={t} a={a} b={b} bg="a_pepper_ripe_green" floor="wood">
      <svg width={420} height={480} viewBox="0 0 150 170" style={{ position: "absolute", left: 420, top: 280 }}><path d="M75 30 C 20 30, 10 90, 30 140 C 45 170, 105 170, 120 140 C 140 90, 130 30, 75 30Z" fill={col} /><path d="M75 30 L 75 8" stroke="#4f7f34" strokeWidth={10} strokeLinecap="round" /><ellipse cx={55} cy={70} rx={10} ry={26} fill="rgba(255,255,255,.35)" /></svg>
      <div style={{ position: "absolute", left: 1150, top: 260, width: 90, height: 560, borderRadius: 45, background: "rgba(255,255,255,.2)", border: "4px solid rgba(255,255,255,.6)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${25 + 75 * c}%`, background: `linear-gradient(0deg, ${COL.leaf}, #8fd06a)` }} />
      </div>
      <div style={{ position: "absolute", left: 1270, top: 280, ...big(76, c > 0.6 ? COL.gold : "#9fd47a") }}>{c > 0.6 ? "READY" : "NOT YET"}</div>
      <div style={{ position: "absolute", left: 1270, top: 400, ...paperTag(50, 2) }}>seeds ready?</div>
      <div style={{ position: "absolute", left: 1270, top: 640, opacity: e(t, ts, ts + 0.3), ...paperTag(46, -2) }}>green = left school at ten</div>
    </Stage>;
  };

  // 19 · el plato que suena: se inclina, las semillas secas resbalan y "suenan" (ondas); después, el aviso de los guantes con 3 lavadas
  const RattlePlate: React.FC<FxP> = ({ t, a, b }) => {
    const tr = A("they rattle on the plate", a), tw = A("wash your hands three times", a);
    const tilt = Math.sin((t - tr) * 9) * 7 * e(t, tr, tr + 0.2) * (1 - e(t, tr + 1.4, tr + 2));
    const washes = t < tw ? 0 : Math.min(3, 1 + Math.floor((t - tw) / 0.45));
    return <Stage t={t} a={a} b={b} bg="a_pepper_core" floor="wood">
      <div style={{ position: "absolute", left: 760, top: 600, transform: `translate(-50%,-50%) perspective(900px) rotateX(55deg) rotateZ(${tilt}deg)` }}>
        <div style={{ width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%, #ffffff, #e9eef0 60%, #c7cfd2)", boxShadow: "0 40px 80px rgba(0,0,0,.45)", position: "relative" }}>
          {Array.from({ length: 34 }, (_, i) => <Seed key={i} x={170 + rnd(i, 1) * 360 + tilt * 6 * rnd(i, 5)} y={170 + rnd(i, 2) * 360} r={rnd(i, 3) * 360} s={1.7} c="#f6e9b5" />)}
        </div>
      </div>
      {[0, 1, 2].map((i) => { const k = cl(((t - tr - i * 0.3) % 0.9) / 0.9); return t > tr && t < tr + 2 ? <div key={i} style={{ position: "absolute", left: 760 - 400 - 120 * k, top: 600 - 120 - 60 * k, width: 800 + 240 * k, height: 240 + 120 * k, borderRadius: "50%", border: `3px solid rgba(251,246,234,${0.5 * (1 - k)})` }} /> : null; })}
      <div style={{ position: "absolute", left: 1350, top: 300, opacity: e(t, tw - 0.3, tw), display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={paperTag(54, 3)}>hot pepper: gloves</div>
        <div style={{ display: "flex", gap: 18 }}>{[0, 1, 2].map((i) => <div key={i} style={{ width: 110, height: 110, borderRadius: "50%", background: i < washes ? "radial-gradient(circle,#bfe6f5,#5aa6c8)" : "rgba(255,255,255,.15)", transform: `scale(${i < washes ? Math.min(1.1, spr(t, tw + i * 0.45)) : 0.8})`, display: "flex", alignItems: "center", justifyContent: "center", ...big(54, COL.cream) }}>{i + 1}</div>)}</div>
      </div>
    </Stage>;
  };

  // 20 · el microscopio: el lente se acerca a una semilla con su capa de gelatina; los "frenos" la mantienen dormida
  const JellyScope: React.FC<FxP> = ({ t, a, b }) => {
    const tj = A("little jelly coat", a), tb = A("natural break", a), td = A("carry disease", a);
    const R = 360 * ei(t, tj - 0.4, tj + 0.6);
    return <Stage t={t} a={a} b={b} bg="a_tanaka_tomatoes" floor="wood" light={0.7}>
      <svg width={720} height={720} viewBox="0 0 200 200" style={{ position: "absolute", left: 600, top: 180, filter: "drop-shadow(0 30px 40px rgba(0,0,0,.5))" }}><circle cx={100} cy={100} r={94} fill="#c8241a" /><circle cx={100} cy={100} r={82} fill="#ef5a43" />{[0, 1, 2, 3].map((i) => <path key={i} d={`M100 100 L ${100 + Math.cos(i * 1.57 + 0.4) * 80} ${100 + Math.sin(i * 1.57 + 0.4) * 80}`} stroke="#c8321e" strokeWidth={8} />)}<circle cx={100} cy={100} r={16} fill="#f07a62" />{Array.from({ length: 18 }, (_, i) => { const an = i * 0.349 + 0.2, rr = 40 + (i % 3) * 10; return <ellipse key={i} cx={100 + Math.cos(an) * rr} cy={100 + Math.sin(an) * rr} rx={4.5} ry={6.5} fill="#f7e7b0" stroke="rgba(255,255,255,.8)" strokeWidth={2.5} />; })}</svg>
      {R > 2 && <div style={{ position: "absolute", left: 960 + R * 0.62, top: 540 + R * 0.62, width: 64, height: 320, borderRadius: 22, background: "linear-gradient(90deg,#2a1a0e,#6b4628,#2a1a0e)", transform: "rotate(-45deg)", transformOrigin: "32px 0", boxShadow: "0 20px 30px rgba(0,0,0,.5)" }} />}
      {R > 2 && <div style={{ position: "absolute", left: 960 - R, top: 540 - R, width: R * 2, height: R * 2, borderRadius: "50%", overflow: "hidden", border: "18px solid #2a2a2a", boxShadow: "0 0 0 6px #777, 0 40px 80px rgba(0,0,0,.6)", background: "radial-gradient(circle, #ffe0d0, #f5a08a 70%, #c8503a)" }}>
        <div style={{ position: "absolute", left: R - 180, top: R - 130, width: 360, height: 260, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,.55), rgba(255,240,220,.25) 60%, transparent 70%)", border: "3px solid rgba(255,255,255,.5)", transform: `scale(${1 + 0.03 * Math.sin(t * 3)})` }} />
        <div style={{ position: "absolute", left: R - 50, top: R - 75 }}><Seed x={50} y={75} s={4.2} c="#efe0b0" /></div>
        {[0, 1, 2, 3].map((i) => { const an = i * Math.PI / 2 + 0.6; return <div key={i} style={{ position: "absolute", left: R + Math.cos(an) * 150 - 40, top: R + Math.sin(an) * 110 - 12, width: 80, height: 24, borderRadius: 6, background: COL.red, transform: `rotate(${an * 57}deg) scale(${Math.min(1.1, spr(t, tb + i * 0.15))})`, opacity: e(t, tb, tb + 0.2) }} />; })}
      </div>}
      <div style={{ position: "absolute", left: 1420, top: 330, opacity: e(t, tb, tb + 0.3), ...paperTag(54, 4) }}>the brake</div>
      <div style={{ position: "absolute", left: 1420, top: 700, opacity: e(t, td, td + 0.3), ...paperTag(50, -3) }}>+ disease</div>
    </Stage>;
  };

  // 21 · el frasco de 3 días: almanaque que se arranca 1-2-3, crece la nata de moho, remolino, las buenas al fondo
  const FermentJar: React.FC<FxP> = ({ t, a, b }) => {
    const t3 = A("wait three days", a), tm = A("thin white mold", a), ts = A("fill the jar with water and stir", a), tk = A("the good seeds sink", ts);
    const day = t < t3 ? 1 : Math.min(3, 1 + Math.floor((t - t3) / 0.7));
    const mold = e(t, tm, tm + 1.5), swirl = t > ts ? (t - ts) * 8 : 0, sink = e(t, tk, tk + 1.4);
    return <Stage t={t} a={a} b={b} bg="a_mold_jar" floor="wood">
      <div style={{ position: "absolute", left: 640, top: 260, width: 440, height: 600, borderRadius: "30px 30px 50px 50px", background: "linear-gradient(90deg, rgba(220,240,250,.35), rgba(255,255,255,.12) 40%, rgba(220,240,250,.35))", border: "5px solid rgba(255,255,255,.6)", overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,.45)" }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 160, bottom: 0, background: `linear-gradient(180deg, rgba(220,90,60,${0.55 - 0.35 * sink}), rgba(200,70,50,${0.7 - 0.4 * sink}))` }} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, height: 34 * mold * (1 - e(t, tk + 0.6, tk + 1.4)), background: "radial-gradient(circle at 20% 50%, #fff 8px, transparent 9px), radial-gradient(circle at 60% 40%, #f4f4ee 12px, transparent 13px), linear-gradient(180deg,#f7f6ef,#dcdcd2)", backgroundSize: "60px 34px, 90px 34px, 100% 100%", opacity: 0.95 }} />
        {Array.from({ length: 30 }, (_, i) => { const r = 60 + rnd(i, 1) * 140, an = rnd(i, 2) * 6.28 + swirl * (1 - sink);
          const x = 220 + Math.cos(an) * r * (1 - sink * 0.6), y = lerp(260 + rnd(i, 3) * 200, 540 + rnd(i, 4) * 30, i % 4 ? sink : 0);
          return <Seed key={i} x={x} y={y} r={an * 57} s={1.2} c="#efe0b0" />; })}
      </div>
      <div style={{ position: "absolute", left: 1240, top: 300, width: 300, height: 340, perspective: 900 }}>
        {[3, 2, 1].map((d) => { const torn = d < day ? 1 : 0; const tt0 = t3 + (d - 1) * 0.7 + 0.7; const k = torn ? e(t, tt0, tt0 + 0.5) : 0;
          return <div key={d} style={{ position: "absolute", inset: 0, background: d === day ? COL.cream : COL.paper, borderTop: `40px solid ${COL.red}`, boxShadow: "0 16px 30px rgba(0,0,0,.45)", transformOrigin: "50% 0", transform: `rotateX(${k * 110}deg)`, opacity: 1 - k, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "#6a5a40" }}>DAY</div><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 170, color: COL.ink, lineHeight: 1 }}>{d}</div></div>; })}
      </div>
      <div style={{ position: "absolute", left: 1240, top: 700, opacity: e(t, tm, tm + 0.3), ...paperTag(50, 3) }}>white mold = good</div>
    </Stage>;
  };

  // 22 · árbol de familia: reliquia → hijos iguales; híbrido → hijos distintos
  const FamilyTree: React.FC<FxP> = ({ t, a, b }) => {
    const th = A("heirloom", a), ty = A("a hybrid from the store", a);
    const Tom: React.FC<{ x: number; y: number; s: number; c: string; sx?: number; sy?: number; k: number }> = ({ x, y, s, c, sx = 1, sy = 1, k }) => k <= 0 ? null : <div style={{ position: "absolute", left: x, top: y, width: 100 * s * sx, height: 90 * s * sy, transform: `translate(-50%,-50%) scale(${Math.min(1.08, k)})`, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #ffb0a0, ${c} 60%)`, boxShadow: "0 12px 20px rgba(0,0,0,.4)" }} />;
    const tree = (x0: number, t0: number, kids: [string, number, number, number][], label: string) => <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{kids.map((_, i) => <path key={i} d={`M${x0} 400 C ${x0} 520, ${x0 - 220 + i * 220} 520, ${x0 - 220 + i * 220} 640`} stroke={COL.cream} strokeWidth={10} fill="none" strokeDasharray={320} strokeDashoffset={320 * (1 - e(t, t0 + 0.4, t0 + 1))} />)}</svg>
      <Tom x={x0} y={330} s={2.1} c="#d42a1e" k={spr(t, t0)} />
      {kids.map(([c, s, sx, sy], i) => <Tom key={i} x={x0 - 220 + i * 220} y={700} s={s * 1.5} c={c} sx={sx} sy={sy} k={spr(t, t0 + 1 + i * 0.2)} />)}
      <div style={{ position: "absolute", left: x0, top: 820, transform: "translateX(-50%)", opacity: e(t, t0, t0 + 0.3), ...paperTag(52, 0) }}>{label}</div>
    </>;
    return <Stage t={t} a={a} b={b} bg="a_heirloom_hybrid" floor="wood">
      {tree(520, th, [["#d42a1e", 1, 1, 1], ["#d42a1e", 1, 1, 1], ["#d42a1e", 1, 1, 1]], "heirloom: same")}
      {tree(1400, ty, [["#e8771c", 0.7, 1, 1], ["#d42a1e", 1, 1.4, 0.8], ["#c8a02a", 0.9, 0.8, 1.3]], "hybrid: surprise")}
    </Stage>;
  };

  // 23 · el vaso de cebolla de verdeo con regla: día 1→7 crece 4", la tijera corta y vuelve a crecer (×3), después a la maceta
  const OnionRegrow: React.FC<FxP> = ({ t, a, b }) => {
    const t1 = A("in one day", a), t7 = A("in seven days", a), tc = A("cut it use it", a), tp = A("plant the roots in a pot", a);
    const day = t < t1 ? 0 : t < t7 ? 1 : 7;
    const cycle = t > tc ? Math.min(3, Math.floor((t - tc) / 1.1)) : 0, ph = t > tc ? ((t - tc) % 1.1) / 1.1 : 0;
    const base = t < t1 ? 20 : t < t7 ? 20 + 40 * e(t, t1, t1 + 1) : 60 + 260 * e(t, t7, t7 + 1.4);
    const h = t > tc && cycle < 3 ? (ph < 0.25 ? 320 - 300 * (ph / 0.25) : 20 + 300 * sm((ph - 0.25) / 0.75)) : base;
    const pot = e(t, tp, tp + 0.8);
    return <Stage t={t} a={a} b={b} bg="a_onion_day7" floor="wood">
      <div style={{ position: "absolute", left: 860 - 320 * pot, top: 520, width: 200, height: 300, borderRadius: "10px 10px 30px 30px", background: pot > 0.5 ? "linear-gradient(90deg,#a8643a,#c8804e,#a8643a)" : "linear-gradient(90deg, rgba(220,240,250,.4), rgba(255,255,255,.12), rgba(220,240,250,.4))", border: "4px solid rgba(255,255,255,.6)", boxShadow: "0 30px 60px rgba(0,0,0,.45)" }}>
        {pot < 0.5 && <div style={{ position: "absolute", left: 0, right: 0, top: 150, bottom: 0, background: "rgba(150,200,220,.35)" }} />}
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 50 + i * 40, bottom: 40, width: 22, height: 120 + h, background: "linear-gradient(0deg,#f2f5e8 0 110px,#6fbe5a 130px,#4f9f3a)", borderRadius: 11 }} />)}
      </div>
      <div style={{ position: "absolute", left: 1120, top: 220, width: 60, height: 520, background: "repeating-linear-gradient(0deg,#e9d38a 0 64px,#3a2a1a 64px 67px)", border: "3px solid #6a4a22" }} />
      <div style={{ position: "absolute", left: 1210, top: 640 - h, ...big(56) }}>{(h / 80).toFixed(1)}"</div>
      <div style={{ position: "absolute", left: 1440, top: 260, width: 220, height: 220, borderRadius: 12, background: COL.cream, borderTop: `36px solid ${COL.red}`, boxShadow: "0 16px 30px rgba(0,0,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 34, color: "#6a5a40" }}>DAY</div><div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 110, color: COL.ink, lineHeight: 1 }}>{day}</div></div>
      {t > tc && <div style={{ position: "absolute", left: 1440, top: 560, ...paperTag(52, 3) }}>cut & regrow ×{Math.min(3, cycle + 1)}</div>}
    </Stage>;
  };

  // 24 · la votación de la mitad: tres sobres-candidatos y barras que suben mientras se escribe el comentario
  const SeedVote: React.FC<FxP> = ({ t, a, b }) => {
    const tq = A("the squash the tomato the pepper", a);
    const opts: [string, string, number][] = [["squash", "#f2a33a", 0.82], ["tomato", "#d42a1e", 0.64], ["pepper", "#c8321e", 0.47]];
    const msg = "The tomato, Sachiko!"; const n = Math.floor(cl((t - tq - 1) / 1.6) * msg.length);
    return <Stage t={t} a={a} b={b} bg="a_girl_fence" floor="paper" zoom={1.08}>
      {opts.map(([l, c, v], i) => { const k = e(t, tq + i * 0.35, tq + i * 0.35 + 1.2) * v; return <div key={i} style={{ position: "absolute", left: 520 + i * 300, top: 820, width: 200, transform: "translateY(-100%)" }}>
        <div style={{ position: "absolute", left: 100, bottom: 480 * k + 16, transform: "translateX(-50%)", textAlign: "center", opacity: e(t, tq + i * 0.35, tq + i * 0.35 + 0.3) }}>
          <div style={{ width: 130, height: 110, margin: "0 auto", borderRadius: i === 0 ? "46% 46% 40% 40%" : i === 2 ? "40% 40% 50% 50% / 30% 30% 70% 70%" : "50%", background: `radial-gradient(circle at 35% 30%, rgba(255,255,255,.55), ${c} 55%, ${COL.ink})`, boxShadow: "0 12px 20px rgba(0,0,0,.4)" }} />
          <div style={{ ...big(60, COL.cream), marginTop: 8 }}>{Math.round(1500 * k)}</div>
        </div>
        <div style={{ width: 200, height: 480 * k, background: `linear-gradient(180deg, ${c}, ${COL.ink})`, borderRadius: "10px 10px 0 0", boxShadow: "0 20px 40px rgba(0,0,0,.4)" }} />
        <div style={{ position: "absolute", left: 100, top: "100%", transform: "translate(-50%,16px)", ...paperTag(50, (i - 1) * 3) }}>{l}</div>
      </div>; })}
      <div style={{ position: "absolute", left: 1360, top: 300, width: 440, background: "#fff", borderRadius: 14, padding: 26, boxShadow: "0 20px 50px rgba(0,0,0,.45)", fontFamily: "Arial", fontSize: 34, color: "#222", opacity: e(t, tq + 0.8, tq + 1.1) }}>
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 14 }}><div style={{ width: 50, height: 50, borderRadius: "50%", background: COL.indigo }} /><div style={{ fontSize: 26, color: "#666" }}>comment</div></div>
        {msg.slice(0, n)}<span style={{ opacity: Math.sin(t * 8) > 0 ? 1 : 0 }}>|</span>
      </div>
    </Stage>;
  };

  // 25 · los tres enemigos: calor, humedad y luz atacan al sobre; papel, fresco y oscuro los rebotan
  const ThreeEnemies: React.FC<FxP> = ({ t, a, b }) => {
    const th = A("heat wet and light", a), tp = A("a paper envelope never plastic", a), tc = A("a cool place", a), td = A("a dark place", a);
    const shields = [tp, tc, td], enemies: [string, string, number][] = [["HEAT", "#e8771c", -1], ["WET", "#5aa6c8", 0], ["LIGHT", "#f2c230", 1]];
    return <Stage t={t} a={a} b={b} bg="a_bedroom_drawer" floor="wood">
      <div style={{ position: "absolute", left: 960, top: 600, transform: "translate(-50%,-50%) rotate(-4deg)", width: 400, height: 500, background: "linear-gradient(170deg,#efe3c4,#d4c296)", boxShadow: "0 30px 60px rgba(0,0,0,.5)", padding: 36, fontFamily: BRUSH, fontSize: 84, lineHeight: 1.05, color: COL.ink }}>seeds<br />asleep<div style={{ fontSize: 44, color: "#7a5a3a", marginTop: 30 }}>Kabocha · 2026</div></div>
      {enemies.map(([l, c, d], i) => { const t0 = th + i * 0.35; const k = e(t, t0, t0 + 1.2); const blocked = t > shields[i];
        const pos = blocked ? 1 - e(t, shields[i], shields[i] + 0.6) * 0.6 : k; const an = (-90 + d * 55) * Math.PI / 180;
        const x = 960 + Math.cos(an) * lerp(720, 330, pos), y = 600 + Math.sin(an) * lerp(560, 330, pos) * 0.9;
        return <React.Fragment key={i}>
          <div style={{ position: "absolute", left: x, top: y, transform: "translate(-50%,-50%)", width: 170, height: 170, borderRadius: "50%", background: `radial-gradient(circle, ${c}, transparent 70%)`, opacity: e(t, t0, t0 + 0.2) * (blocked ? 0.6 : 1), display: "flex", alignItems: "center", justifyContent: "center", ...big(40) }}>{l}</div>
          {blocked && <div style={{ position: "absolute", left: 960 + Math.cos(an) * 260, top: 600 + Math.sin(an) * 230, transform: `translate(-50%,-50%) rotate(${an * 57 + 90}deg) scale(${Math.min(1.1, spr(t, shields[i]))})`, width: 220, height: 26, borderRadius: 13, background: COL.cream, boxShadow: `0 0 30px ${c}` }} />}
          {blocked && <div style={{ position: "absolute", left: 960 + Math.cos(an) * 260, top: 600 + Math.sin(an) * 230 + (d === 0 ? -70 : 60), transform: "translate(-50%,-50%)", ...paperTag(40, 0), opacity: e(t, shields[i] + 0.2, shields[i] + 0.4) }}>{["paper", "cool", "dark"][i]}</div>}
        </React.Fragment>; })}
    </Stage>;
  };

  // 26 · el lápiz escribe nombre y año trazo a trazo; después el cajón de "misterios" sin año
  const PencilLabel: React.FC<FxP> = ({ t, a, b }) => {
    const tn = A("the name and the year", a), tm = A("a drawer full of mysteries", a);
    const txt = "Kabocha  2026", n = cl((t - tn) / 1.8) * txt.length;
    const myst = e(t, tm, tm + 0.6);
    return <Stage t={t} a={a} b={b} bg="a_envelope_write" floor="paper">
      <div style={{ position: "absolute", left: 960, top: 520, transform: `translate(-50%,-50%) perspective(1200px) rotateX(${20 + 30 * myst}deg) scale(${1 - 0.4 * myst})`, width: 900, height: 560, background: "linear-gradient(170deg,#f2e7cc,#d9c8a0)", boxShadow: "0 40px 80px rgba(0,0,0,.5)", borderRadius: 6 }}>
        <div style={{ position: "absolute", left: 90, top: 200, fontFamily: BRUSH, fontSize: 130, color: COL.ink, whiteSpace: "pre" }}>{txt.slice(0, Math.floor(n))}</div>
        {t < tn + 2 && <div style={{ position: "absolute", left: 90 + Math.floor(n) * 58, top: 120, width: 26, height: 300, background: "linear-gradient(90deg,#f2c230,#d9a441)", transform: `rotate(28deg) translateY(${Math.sin(t * 30) * 6}px)`, borderRadius: "4px 4px 0 0", boxShadow: "0 10px 20px rgba(0,0,0,.4)" }} />}
      </div>
      {myst > 0 && Array.from({ length: 10 }, (_, i) => <div key={i} style={{ position: "absolute", left: 180 + (i % 5) * 330, top: i < 5 ? 110 : 820, width: 220, height: 150, background: "linear-gradient(170deg,#d8ccb0,#b9aa86)", transform: `rotate(${(rnd(i, 1) - 0.5) * 20}deg) scale(${Math.min(1.1, spr(t, tm + i * 0.08))})`, boxShadow: "0 14px 26px rgba(0,0,0,.45)", display: "flex", alignItems: "center", justifyContent: "center", ...big(90, COL.indigo), textShadow: "none" }}>?</div>)}
    </Stage>;
  };

  // 27 · los cinco errores en tablas de madera que giran (rotateX) y muestran el error tachado
  const MistakeBoards: React.FC<FxP> = ({ t, a, b }) => {
    const ms = ["mistake 1", "mistake 2", "mistake 3", "mistake 4", "and mistake 5"].map((p) => A(p, a));
    const txt = ["weakest plant", "not dry", "plastic, no air", "no name, no year", "all in one place"];
    return <Stage t={t} a={a} b={b} bg="a_sister_envelope" floor="wood">
      {txt.map((tx, i) => { const k = ei(t, ms[i], ms[i] + 0.6), on = t >= ms[i]; const y = 150 + i * 160;
        return <div key={i} style={{ position: "absolute", left: 960, top: y, width: 1100, height: 130, transform: `translateX(-50%) perspective(1100px) rotateX(${(1 - k) * 12}deg) translateY(${on ? (1 - k) * 18 : 0}px)`, background: on ? "linear-gradient(180deg,#a07a4c,#6b4c2c)" : "linear-gradient(180deg,#6b4c2c,#4a3420)", backgroundImage: "repeating-linear-gradient(90deg, rgba(0,0,0,.08) 0 3px, transparent 3px 60px)", borderRadius: 8, boxShadow: on ? "0 16px 30px rgba(0,0,0,.45)" : "0 8px 16px rgba(0,0,0,.4)", display: "flex", alignItems: "center", gap: 40, paddingLeft: 40, overflow: "hidden" }}>
          <div style={{ ...big(80, on ? COL.gold : "#8a6a48"), textShadow: extrude(5, "#2a1a0a") }}>{i + 1}</div>
          <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 62, color: COL.cream, position: "relative", opacity: k, transform: `translateX(${(1 - k) * 80}px)` }}>{tx}<div style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 8, background: COL.red, transformOrigin: "0 50%", transform: `scaleX(${e(t, ms[i] + 0.8, ms[i] + 1.2)})`, borderRadius: 4 }} /></div>
        </div>; })}
    </Stage>;
  };

  // 28 · la prueba de la servilleta: 10 semillas en grilla, brotan 7, la fracción 7/10 se arma
  const GermGrid: React.FC<FxP> = ({ t, a, b }) => {
    const t10 = A("put 10 seeds", a), tc = A("count how many sprouted", a), t7 = A("if 7 come up", a);
    return <Stage t={t} a={a} b={b} bg="a_towel_test" floor="paper">
      <div style={{ position: "absolute", left: 300, top: 330, width: 900, height: 480, background: "repeating-linear-gradient(45deg,#f4f7f8 0 12px,#e6ecee 12px 24px)", borderRadius: 10, boxShadow: "0 30px 60px rgba(0,0,0,.4)", transform: "perspective(1200px) rotateX(30deg)" }}>
        {Array.from({ length: 10 }, (_, i) => { const x = 110 + (i % 5) * 170, y = 140 + Math.floor(i / 5) * 200, on = e(t, t10 + i * 0.12, t10 + i * 0.12 + 0.2), sp = [0, 1, 2, 4, 5, 6, 8].includes(i) ? e(t, tc + i * 0.1, tc + i * 0.1 + 0.8) : 0;
          return <div key={i} style={{ position: "absolute", left: x, top: y, opacity: on }}>
            <Seed x={0} y={0} s={1.5} c="#f1d38a" />
            {sp > 0 && <svg width={120} height={120} style={{ position: "absolute", left: -20, top: -100, overflow: "visible" }}><path d={`M20 90 q ${10 * sp} ${-50 * sp} ${40 * sp} ${-70 * sp}`} stroke="#6fbe5a" strokeWidth={7} fill="none" strokeLinecap="round" /><ellipse cx={20 + 40 * sp} cy={90 - 70 * sp} rx={14 * sp} ry={8 * sp} fill="#8fd06a" /></svg>}
          </div>; })}
      </div>
      <div style={{ position: "absolute", left: 1480, top: 540, transform: `translate(-50%,-50%) scale(${Math.min(1.08, spr(t, t7))})`, opacity: e(t, t7, t7 + 0.1), ...big(230) }}>7<span style={{ fontSize: 120, color: COL.gold }}>/10</span></div>
    </Stage>;
  };

  // 29 · el ábaco (soroban): las cuentas suman la primavera comprada ($40) y la cuenta de la madre se vacía a 0
  const Soroban: React.FC<FxP> = ({ t, a, b }) => {
    const t40 = A("every spring before you buy", a), t0 = A("way cost nothing", a);
    const val = t < t0 ? Math.round(40 * e(t, t40 - 1.8, t40 + 0.6)) : Math.round(40 * (1 - e(t, t0, t0 + 0.9)));
    const tens = Math.floor(val / 10), ones = val % 10;
    return <Stage t={t} a={a} b={b} bg="a_table_plates" floor="wood">
      <div style={{ position: "absolute", left: 960, top: 560, transform: "translate(-50%,-50%) perspective(1300px) rotateX(24deg)", width: 1000, height: 440, background: "linear-gradient(180deg,#5a3a20,#3a2414)", borderRadius: 16, boxShadow: "0 40px 80px rgba(0,0,0,.6)", padding: 30 }}>
        <div style={{ position: "absolute", left: 30, right: 30, top: 130, height: 14, background: "#2a1a0e" }} />
        {[0, 1, 2, 3, 4, 5].map((c) => { const lit = c === 3 ? tens : c === 4 ? ones : 0; const x = 120 + c * 150;
          return <div key={c} style={{ position: "absolute", left: x, top: 30, width: 8, height: 380, background: "#c9b08a" }}>
            {[0, 1, 2, 3].map((j) => { const up = j < (lit % 5); return <div key={j} style={{ position: "absolute", left: -46, top: up ? 160 + j * 52 : 220 + j * 52, width: 100, height: 46, borderRadius: "50%", background: up ? "radial-gradient(ellipse at 40% 30%, #f6d58a, #b8802a)" : "radial-gradient(ellipse at 40% 30%, #8a5a30, #4a2a14)", transition: "none", boxShadow: "0 6px 10px rgba(0,0,0,.4)" }} />; })}
            <div style={{ position: "absolute", left: -46, top: lit >= 5 ? 80 : 20, width: 100, height: 46, borderRadius: "50%", background: lit >= 5 ? "radial-gradient(ellipse at 40% 30%, #f6d58a, #b8802a)" : "radial-gradient(ellipse at 40% 30%, #8a5a30, #4a2a14)" }} />
          </div>; })}
      </div>
      <div style={{ position: "absolute", left: 960, top: 170, transform: "translateX(-50%)", ...big(140, val === 0 && t > t0 ? COL.gold : COL.cream) }}>${val}</div>
      <div style={{ position: "absolute", left: 960, top: 850, transform: "translateX(-50%)", ...paperTag(52, 0) }}>{t < t0 ? "every spring, from the store" : "my mother's way"}</div>
    </Stage>;
  };

  // 30 · la pista de la primavera: carriles pimiento / tomate / zapallo contra la línea de la última helada; pétalos de cerezo que caen
  const SpringTrack: React.FC<FxP> = ({ t, a, b }) => {
    const tp = A("peppers are slow", a), tt = A("then the tomatoes a week later", a), tsq = A("when the cherry petals fell", a), tf = A("six to eight weeks before the last frost", a);
    const lanes: [string, number, number, number, string][] = [["peppers", tp, 0.05, 0.62, "#c8321e"], ["tomatoes", tt, 0.17, 0.62, "#d42a1e"], ["squash", tsq, 0.7, 0.98, "#f2a33a"]];
    const X = (f: number) => 300 + f * 1320;
    return <Stage t={t} a={a} b={b} bg="a_balcony_pots" floor="paper">
      <div style={{ position: "absolute", left: 300, top: 260, width: 1320, height: 560, background: "rgba(251,246,234,.92)", borderRadius: 12, boxShadow: "0 30px 60px rgba(0,0,0,.45)" }} />
      {["MAR", "APR", "MAY", "JUN"].map((m, i) => <div key={i} style={{ position: "absolute", left: X(i * 0.25) + 20, top: 280, fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#8a7a60" }}>{m}</div>)}
      <div style={{ position: "absolute", left: X(0.62), top: 270, width: 6, height: 540, background: COL.indigo, opacity: e(t, tf, tf + 0.4) }} />
      <div style={{ position: "absolute", left: X(0.62) + 14, top: 760, fontFamily: BRUSH, fontSize: 40, color: COL.indigo, opacity: e(t, tf, tf + 0.4) }}>last frost</div>
      {lanes.map(([l, , f0, f1], i) => <div key={"g" + i} style={{ position: "absolute", left: X(f0), top: 380 + i * 130, width: X(f1) - X(f0), height: 70, borderRadius: 35, border: "4px dashed rgba(90,70,40,.45)", display: "flex", alignItems: "center", paddingLeft: 24, fontFamily: FONT, fontWeight: 800, fontSize: 40, color: "rgba(90,70,40,.6)" }}>{l}</div>)}
      {lanes.map(([l, t0, f0, f1, c], i) => { const k = e(t, t0, t0 + 1.2); return <React.Fragment key={i}>
        <div style={{ position: "absolute", left: X(f0), top: 380 + i * 130, width: (X(f1) - X(f0)) * k, height: 70, borderRadius: 35, background: `linear-gradient(90deg, ${c}, ${COL.ink})`, boxShadow: "0 10px 20px rgba(0,0,0,.3)" }} />
        <div style={{ position: "absolute", left: X(f0) + 24, top: 384 + i * 130, fontFamily: FONT, fontWeight: 800, fontSize: 44, color: COL.cream, opacity: k }}>{l}{i < 2 ? " · inside" : " · in the ground"}</div>
      </React.Fragment>; })}
      {t > tsq && Array.from({ length: 24 }, (_, i) => { const k = cl((t - tsq - rnd(i, 1) * 0.8) / 2.4); return k > 0 ? <div key={i} style={{ position: "absolute", left: X(0.6) + rnd(i, 2) * 500 + Math.sin(k * 6 + i) * 40, top: 160 + k * 700, width: 26, height: 18, borderRadius: "60% 40% 60% 40%", background: "#f7c6d4", transform: `rotate(${k * 400 + i * 30}deg)`, opacity: 1 - k * 0.5 }} /> : null; })}
    </Stage>;
  };

  // 31 · el frasco de arroz por dentro: al abrir entra aire húmedo (gotitas), viaja al atado de arroz y el higrómetro baja
  const RiceJar: React.FC<FxP> = ({ t, a, b }) => {
    const to = A("every time you open the jar", a), tr = A("the rice takes it", a), tb = A("before the seeds do", a);
    const lid = e(t, to, to + 0.5) * (1 - e(t, to + 1.6, to + 2.1)), hum = lerp(62, 18, e(t, tr, tb + 1.6));
    return <Stage t={t} a={a} b={b} bg="a_rice_jar_shelf" floor="wood">
      <div style={{ position: "absolute", left: 560, top: 230, width: 520, height: 680 }}>
        <div style={{ position: "absolute", left: 30, top: -40 - 120 * lid, width: 460, height: 60, borderRadius: 12, background: "linear-gradient(180deg,#c9ccd0,#7d8288)", transform: `rotate(${-14 * lid}deg)`, boxShadow: "0 10px 20px rgba(0,0,0,.4)" }} />
        <div style={{ position: "absolute", inset: 0, borderRadius: "40px 40px 60px 60px", background: "linear-gradient(90deg, rgba(220,240,250,.35), rgba(255,255,255,.1) 40%, rgba(220,240,250,.35))", border: "5px solid rgba(255,255,255,.6)", boxShadow: "0 40px 80px rgba(0,0,0,.45)" }} />
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ position: "absolute", left: 50 + i * 82, top: 150 + (i % 2) * 20, width: 74, height: 340, background: "linear-gradient(170deg,#efe3c4,#d4c296)", transform: `rotate(${(i - 2) * 3}deg)`, boxShadow: "0 8px 14px rgba(0,0,0,.3)", fontFamily: BRUSH, fontSize: 30, writingMode: "vertical-rl", padding: 10, color: COL.ink }}>{["garlic", "kabocha", "tomato", "pepper", "negi"][i]}</div>)}
        <div style={{ position: "absolute", left: 140, top: 540, width: 240, height: 110, borderRadius: "50% 50% 40% 40%", background: "radial-gradient(ellipse at 40% 30%, #ffffff, #e9e2cf)", boxShadow: "0 10px 20px rgba(0,0,0,.35)" }}>
          {Array.from({ length: 24 }, (_, i) => <div key={i} style={{ position: "absolute", left: 30 + rnd(i, 1) * 170, top: 20 + rnd(i, 2) * 60, width: 12, height: 6, borderRadius: 3, background: "#d9b77a" }} />)}
        </div>
        {/* gotitas que entran y van al arroz */}
        {Array.from({ length: 16 }, (_, i) => { const t0 = to + 0.4 + i * 0.09, k = cl((t - t0) / 1.6); if (k <= 0 || k >= 1) return null;
          const x = lerp(80 + rnd(i, 3) * 360, 260, sm(k)), y = lerp(-20, 590, sm(k)) + Math.sin(k * 9 + i) * 20 * (1 - k);
          return <div key={i} style={{ position: "absolute", left: x, top: y, width: 18, height: 24, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(circle at 35% 30%, #fff, #7fc0e0)", opacity: 1 - k * 0.6 }} />; })}
      </div>
      <div style={{ position: "absolute", left: 1320, top: 320, width: 320, height: 320, borderRadius: "50%", background: "radial-gradient(circle,#fbf6ea,#e7dcc4)", border: "12px solid #8a6a38", boxShadow: "0 20px 40px rgba(0,0,0,.45)" }}>
        <svg width={296} height={296} style={{ position: "absolute", left: 0, top: 0 }}>
          <path d="M40 200 A 110 110 0 0 1 256 200" stroke="#5aa6c8" strokeWidth={14} fill="none" />
          <line x1={148} y1={200} x2={148 + Math.cos(Math.PI + (hum / 80) * Math.PI) * 100} y2={200 + Math.sin(Math.PI + (hum / 80) * Math.PI) * 100} stroke={COL.red} strokeWidth={8} strokeLinecap="round" />
          <circle cx={148} cy={200} r={14} fill={COL.ink} />
        </svg>
        <div style={{ position: "absolute", left: 0, right: 0, top: 220, textAlign: "center", fontFamily: FONT, fontWeight: 800, fontSize: 46, color: COL.ink }}>{Math.round(hum)}%</div>
      </div>
      <div style={{ position: "absolute", left: 1330, top: 700, ...paperTag(50, 3) }}>damp air in the jar</div>
    </Stage>;
  };

  // 32 · el abanico del repaso: cinco naipes-sobre que se abren y se iluminan al nombrarse
  const RecapFan: React.FC<FxP> = ({ t, a, b }) => {
    const ns = ["1 garlic the biggest", "2 squash seeds washed", "3 pepper seeds only", "number four tomato", "and number five green onion"].map((p) => A(p, a));
    const lab = ["garlic", "squash", "pepper", "tomato", "green onion"], sub = ["big cloves · 2\" · straw", "sink · plate · bend", "ripe only · never green", "3 days · mold · rinse", "half water · every 2 days"];
    const open = ei(t, a, a + 1.2);
    const cur = ns.reduce((k, x, i) => (t >= x ? i : k), -1);
    return <Stage t={t} a={a} b={b} bg="a_rice_jar_shelf" floor="wood">
      {lab.map((l, i) => { const an = (i - 2) * 23 * open, on = i === cur;
        return <div key={i} style={{ position: "absolute", left: 960, top: 980, zIndex: on ? 10 : i, transformOrigin: "50% 100%", transform: `translateX(-50%) rotate(${on ? an * 0.4 : an}deg) translateY(${on ? -110 : 0}px) scale(${on ? 1.08 : 1})` }}>
          <div style={{ width: 340, height: 620, marginTop: -620, background: on ? `linear-gradient(170deg,${COL.cream},${COL.paper})` : "linear-gradient(170deg,#d8ccb0,#b9aa86)", borderRadius: 12, boxShadow: on ? `0 0 60px rgba(217,164,65,.6), 0 30px 60px rgba(0,0,0,.5)` : "0 20px 40px rgba(0,0,0,.45)", padding: 26, borderTop: `16px solid ${on ? COL.red : "#8a7a60"}` }}>
            <div style={{ ...big(70, COL.ink), textShadow: "none" }}>{i + 1}</div>
            <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56, color: COL.ink, marginTop: 10, lineHeight: 1.05 }}>{l}</div>
            <div style={{ fontFamily: BRUSH, fontSize: 48, color: "#6a5a40", marginTop: 16, whiteSpace: "normal", lineHeight: 1.1 }}>{sub[i]}</div>
          </div></div>; })}
    </Stage>;
  };

  // 33 · la tarea: un vasito con la raíz y un almanaque de 7 días que vuela hoja a hoja, la cebolla crece un poquito con cada hoja
  const Homework: React.FC<FxP> = ({ t, a, b }) => {
    const tg = Math.min(A("in a glass of water by the window", a), a + 0.4), t7 = A("in seven days", a);
    const d = t < t7 ? 0 : Math.min(7, Math.floor((t - t7) / 0.32) + 1);
    return <Stage t={t} a={a} b={b} bg="a_sake_cup_onions" floor="wood">
      <div style={{ position: "absolute", left: 600, top: 470, width: 280, height: 400, borderRadius: "10px 10px 36px 36px", background: "linear-gradient(90deg, rgba(220,240,250,.4), rgba(255,255,255,.12), rgba(220,240,250,.4))", border: "4px solid rgba(255,255,255,.6)", opacity: e(t, tg, tg + 0.3) }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 70 + i * 50, bottom: 50, width: 30, height: 170 + d * 40, background: "linear-gradient(0deg,#f2f5e8 0 110px,#6fbe5a 130px,#4f9f3a)", borderRadius: 11 }} />)}
      </div>
      <div style={{ position: "absolute", left: 1150, top: 300, width: 300, height: 340 }}>
        {Array.from({ length: 8 }, (_, j) => { const i = 7 - j; const k = i < d ? e(t, t7 + i * 0.32, t7 + i * 0.32 + 0.3) : 0;
          return <div key={i} style={{ position: "absolute", inset: 0, background: COL.cream, borderTop: `40px solid ${COL.red}`, boxShadow: "0 16px 30px rgba(0,0,0,.4)", transform: `translate(${k * 500}px, ${-k * 200}px) rotate(${k * 40}deg)`, opacity: 1 - k, display: "flex", alignItems: "center", justifyContent: "center", ...big(160, COL.ink), textShadow: "none" }}>{i === 7 ? "✓" : i + 1}</div>; })}
      </div>
    </Stage>;
  };

  return { TrashVsPacket, FiveShelf, TwoEnvelopesTime, Ledger, Furin, SeedDrawer, FenceTrade, CloveXray, SoilSeasons, ParkingMap, HeadScale, PlantRuler, BigSmall, SinkFloat, TowelTear, BendTest, BeeCross, RipeMeter, RattlePlate, JellyScope, FermentJar, FamilyTree, OnionRegrow, SeedVote, ThreeEnemies, PencilLabel, MistakeBoards, GermGrid, Soroban, SpringTrack, RiceJar, RecapFan, Homework };
};
