// ctrsarten · piezas NUEVAS del cuerpo (min 2-14). Cada una nace con resorte, vive anclada a la voz y se va sola.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { loadFont } from "@remotion/google-fonts/Caveat";
import { COL, FONT, P, e, ei, extrude, spr } from "./lib";

export const { fontFamily: HAND } = loadFont("normal", { weights: ["700"], subsets: ["latin"] });
const op = (t: number, a: number, out: number) => e(t, a, a + 0.14) * (1 - e(t, out, out + 0.25));
const k1 = (t: number, a: number, k = 1) => Math.min(1.12, spr(t, a, k));
const card = (bg: string): React.CSSProperties => ({ background: bg, borderRadius: 26, boxShadow: "0 30px 70px rgba(0,0,0,.6), inset 0 -8px 0 rgba(0,0,0,.18), inset 0 2px 0 rgba(255,255,255,.35)" });

// --- iconos SVG propios (sin emojis: el Chrome del farm no los tiene) ---
export const Icon: React.FC<{ n: string; s?: number; c?: string }> = ({ n, s = 90, c = "#1b1205" }) => {
  const st = { fill: "none", stroke: c, strokeWidth: 7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const g: Record<string, React.ReactNode> = {
    guante: <path {...st} d="M30 88V52l-8-18a6 6 0 0 1 11-5l7 14V18a6 6 0 0 1 12 0v22V12a6 6 0 0 1 12 0v28V18a6 6 0 0 1 12 0v40c0 18-8 30-22 30H30z" />,
    ventana: <g {...st}><rect x="14" y="12" width="72" height="76" rx="4" /><path d="M50 12v76M14 50h72" /><path d="M64 30c6-6 14-6 18 0" /></g>,
    nomezcla: <g {...st}><path d="M28 30h16v12l8 10v30H20V52l8-10z" /><path d="M58 30h16v12l8 10v30H50" /><path d="M12 12l76 76" stroke={COL.red} /></g>,
    llama: <path {...st} d="M50 90c-18 0-28-12-28-28 0-18 16-26 18-46 10 8 14 18 12 28 6-4 8-10 8-14 10 8 18 20 18 32 0 16-10 28-28 28z" />,
    pastilla: <g {...st}><rect x="14" y="30" width="72" height="44" rx="8" /><path d="M14 54h72" /></g>,
    iman: <path {...st} d="M22 20v32a28 28 0 0 0 56 0V20H60v32a10 10 0 0 1-20 0V20z" />,
    reloj: <g {...st}><circle cx="50" cy="54" r="32" /><path d="M50 54V34M50 54l14 8M42 14h16" /></g>,
    madera: <g {...st}><path d="M70 14c10 4 12 18 2 26L40 72l-12 14-8-8 14-12 30-32c-6-10 0-22 6-20z" /></g>,
    esponja: <g {...st}><rect x="14" y="34" width="72" height="34" rx="8" /><path d="M14 50h72" /></g>,
    agua: <path {...st} d="M50 14C38 34 26 46 26 62a24 24 0 0 0 48 0c0-16-12-28-24-48z" />,
    check: <path {...st} d="M18 52l20 20 44-46" />,
  };
  return <svg width={s} height={s} viewBox="0 0 100 100">{g[n]}</svg>;
};

// 1 · tablero de seguridad: tres fichas gruesas que caen y se apilan en fila
export const SafetyRow: React.FC<{ t: number; items: { at: number; icon: string; text: string; col: string }[]; out: number; y?: number }> = ({ t, items, out, y = 760 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", gap: 34, perspective: 1200 }}>
    {items.map((it, i) => {
      const k = k1(t, it.at, 0.9), o = op(t, it.at, out);
      if (o <= 0.01) return <div key={i} style={{ width: 380 }} />;
      return (
        <div key={i} style={{ width: 380, height: 150, ...card(it.col), opacity: o, display: "flex", alignItems: "center", gap: 18, padding: "0 26px",
          transform: `translateY(${(1 - Math.min(1, k)) * -260}px) rotateX(${(1 - Math.min(1, k)) * 70}deg) rotateZ(${(i - 1) * 2}deg)` }}>
          <Icon n={it.icon} s={92} />
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 36, color: "#1b1205", lineHeight: 1.05 }}>{it.text}</div>
        </div>
      );
    })}
  </div>
);

// 2 · polaroids de la carrera: caen sobre la mesa una encima de otra, cada una con su año escrito a mano
export const Polaroids: React.FC<{ t: number; items: { at: number; k: string; cap: string; yr: string }[]; out: number }> = ({ t, items, out }) => (
  <AbsoluteFill style={{ perspective: 1600 }}>
    {items.map((it, i) => {
      const k = k1(t, it.at, 0.8), o = op(t, it.at, out);
      if (o <= 0.01) return null;
      const x = 260 + i * 470, rz = [-7, 4, -3][i % 3], lift = (1 - Math.min(1, k));
      return (
        <div key={i} style={{ position: "absolute", left: x, top: 170, width: 440, padding: "20px 20px 90px", background: "#f7f3ea", borderRadius: 6, opacity: o,
          boxShadow: "0 40px 80px rgba(0,0,0,.65)", transform: `translateY(${lift * -700}px) translateZ(${lift * 400}px) rotateZ(${rz + lift * 25}deg) rotateX(${lift * 30}deg)` }}>
          <div style={{ width: 400, height: 400, overflow: "hidden", background: "#222" }}>
            <Img src={staticFile(P + "img_" + it.k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(.25) saturate(.85)", transform: `scale(${1.05 + 0.04 * e(t, it.at, it.at + 6)})` }} />
          </div>
          <div style={{ position: "absolute", left: 24, right: 24, bottom: 18, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontFamily: HAND, fontSize: 54, color: "#2a2620" }}>{it.cap}</span>
            <span style={{ fontFamily: HAND, fontSize: 40, color: "#8a5a2a" }}>{it.yr}</span>
          </div>
        </div>
      );
    })}
  </AbsoluteFill>
);

// 3 · el papelito de la señora: nota escrita a mano que se despliega con la frase
export const Note: React.FC<{ t: number; at: number; out: number; text: string; x: number; y: number; rot?: number }> = ({ t, at, out, text, x, y, rot = -4 }) => {
  const o = op(t, at, out), k = k1(t, at, 0.8);
  if (o <= 0.01) return null;
  const n = Math.round(text.length * e(t, at + 0.15, at + 0.15 + text.length * 0.035));
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 620, padding: "50px 46px", backgroundColor: "#f8eebc", opacity: o,
      transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${0.5 + 0.5 * Math.min(1, k)}) perspective(900px) rotateX(${(1 - Math.min(1, k)) * 60}deg)`,
      boxShadow: "0 30px 60px rgba(0,0,0,.55)", backgroundImage: "repeating-linear-gradient(180deg, transparent 0 62px, rgba(70,110,160,.25) 62px 64px), linear-gradient(180deg,#fff9d9,#f4e7a8)" }}>
      <div style={{ position: "absolute", left: "50%", top: -18, width: 140, height: 40, marginLeft: -70, background: "rgba(255,255,255,.55)", transform: "rotate(3deg)" }} />
      <div style={{ fontFamily: HAND, fontSize: 84, lineHeight: 1.0, color: "#26313f" }}>{text.slice(0, n)}</div>
    </div>
  );
};

// 4 · pantalla partida: 10 MIN (reloj que corre) contra UNA TARDE (el sol que cae)
export const Versus: React.FC<{ t: number; at: number; out: number; l: string; r: string }> = ({ t, at, out, l, r }) => {
  const o = op(t, at, out), sp = ei(t, at, at + 0.5);
  if (o <= 0.01) return null;
  const sun = e(t, at + 0.4, at + 4);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 960 * sp, height: 1080, overflow: "hidden", background: "linear-gradient(160deg,#1f6f55,#0e3b2e)" }}>
        <svg width={960} height={1080} style={{ position: "absolute", left: 0 }}>
          <circle cx={480} cy={470} r={230} fill="none" stroke="rgba(255,255,255,.2)" strokeWidth={30} />
          <circle cx={480} cy={470} r={230} fill="none" stroke="#9df0b4" strokeWidth={30} strokeDasharray={1445} strokeDashoffset={1445 * (1 - sun)} transform="rotate(-90 480 470)" strokeLinecap="round" />
        </svg>
        <div style={{ position: "absolute", left: 0, width: 960, top: 400, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 130, color: "#eafff1", textShadow: extrude(10, "#0a2a20") }}>{l}</div>
        <div style={{ position: "absolute", left: 0, width: 960, top: 800, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#9df0b4" }}>DE FUEGO</div>
      </div>
      <div style={{ position: "absolute", right: 0, top: 0, width: 960 * sp, height: 1080, overflow: "hidden", background: `linear-gradient(180deg, ${sun > 0.5 ? "#3a2340" : "#e0894a"}, #2a1720)` }}>
        <div style={{ position: "absolute", left: 960 * sp - 480 - 110, top: 150 + sun * 520, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(#ffd27a,#ff7a3a)", boxShadow: "0 0 120px 40px rgba(255,140,60,.6)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 300, background: "#1a0f14" }} />
        <div style={{ position: "absolute", right: 0, width: 960, top: 400, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 120, color: "#ffe6d0", textShadow: extrude(10, "#3a1a14") }}>{r}</div>
        <div style={{ position: "absolute", right: 0, width: 960, top: 800, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 64, color: "#ff9a7a" }}>DE FIBRA</div>
      </div>
      <div style={{ position: "absolute", left: 960 - 4, top: 0, width: 8, height: 1080, background: "#fff", opacity: sp, boxShadow: "0 0 30px #fff" }} />
    </AbsoluteFill>
  );
};

// 5 · el LIBRO 3D: tapa real → se abre → página real (zoom a una zona marcada)
export const Book3D: React.FC<{ t: number; at: number; open: number; out: number; page: string; x?: number; y?: number; sc?: number; zoomAt?: number; zoom?: [number, number, number]; mark?: [number, number, number, number]; markAt?: number; label?: string }> = ({ t, at, open, out, page, x = 960, y = 560, sc = 1, zoomAt = 1e9, zoom = [0.5, 0.45, 1.8], mark, markAt = 1e9, label }) => {
  const o = op(t, at, out), k = k1(t, at, 0.7);
  if (o <= 0.01) return null;
  const op1 = ei(t, open, open + 0.9), z = ei(t, zoomAt, zoomAt + 0.9);
  const Wd = 460, Hd = 595;
  const s0 = sc * (0.4 + 0.6 * Math.min(1, k)) * (1 + (zoom[2] - 1) * z);
  // al abrir, el libro se corre a la izquierda para que la página quede al centro
  const dx = -Wd / 2 * op1 * sc - (zoom[0] - 0.5) * Wd * 2 * z * sc * zoom[2], dy = -(zoom[1] - 0.5) * Hd * z * sc * zoom[2];
  const ry = -18 * (1 - op1) + Math.sin(t * 0.6) * 2 * (1 - z), rx = 22 * (1 - z) + 6 * (1 - op1);
  return (
    <div style={{ position: "absolute", left: x + dx, top: y + dy, width: 0, height: 0, perspective: 2200, opacity: o }}>
      <div style={{ position: "absolute", left: 0, top: 0, transformStyle: "preserve-3d", transform: `scale(${s0}) rotateX(${rx}deg) rotateY(${ry}deg) translateY(${(1 - Math.min(1, k)) * 300}px)` }}>
        {/* página derecha (la real) */}
        <div style={{ position: "absolute", left: 0, top: -Hd / 2, width: Wd, height: Hd, background: "#fffdf6", boxShadow: "0 40px 90px rgba(0,0,0,.55)", overflow: "hidden" }}>
          <Img src={staticFile(P + page)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,.18), transparent 12%)" }} />
          {mark && <div style={{ position: "absolute", left: mark[0] * Wd, top: mark[1] * Hd, width: mark[2] * Wd, height: mark[3] * Hd, border: "5px solid #ffb257", borderRadius: 10,
            boxShadow: "0 0 0 2000px rgba(0,0,0,.35), 0 0 30px rgba(255,178,87,.8)", opacity: e(t, markAt, markAt + 0.3), transform: `scale(${1.2 - 0.2 * e(t, markAt, markAt + 0.3)})` }} />}
        </div>
        {/* lomo + grosor */}
        <div style={{ position: "absolute", left: -14, top: -Hd / 2, width: 28, height: Hd, background: "linear-gradient(90deg,#6b3c1e,#9a5a2c)", transform: "rotateY(90deg)" }} />
        {/* tapa: gira sobre el lomo y descubre la página */}
        <div style={{ position: "absolute", left: 0, top: -Hd / 2, width: Wd, height: Hd, transformOrigin: "0 50%", transformStyle: "preserve-3d", transform: `translateZ(2px) rotateY(${-178 * op1}deg)` }}>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", boxShadow: "0 30px 70px rgba(0,0,0,.6)", borderRadius: "2px 8px 8px 2px", overflow: "hidden" }}>
            <Img src={staticFile(P + "guia_cover.jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(${110 + ry * 3}deg, transparent 35%, rgba(255,255,255,.25) 50%, transparent 65%)` }} />
          </div>
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "#f3ecdc" }} />
        </div>
      </div>
      {label && <div style={{ position: "absolute", left: -500, width: 1000, top: Hd / 2 * sc + 40, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 58, color: COL.amber, textShadow: extrude(6, "rgba(0,0,0,.6)"), opacity: e(t, open + 0.6, open + 0.9) * (1 - z) }}>{label}</div>}
    </div>
  );
};

// 6 · la descripción del video con el enlace en el RENGLÓN 1 + el cuadrito para la tele
export const DescBox: React.FC<{ t: number; at: number; out: number; qrAt?: number }> = ({ t, at, out, qrAt = 1e9 }) => {
  const o = op(t, at, out), k = k1(t, at, 0.8), hl = e(t, at + 0.6, at + 1.0), q = k1(t, qrAt, 0.8);
  if (o <= 0.01) return null;
  return (
    <AbsoluteFill style={{ opacity: o, perspective: 1600 }}>
      <div style={{ position: "absolute", left: 220, top: 230, width: 980, padding: "36px 44px", background: "#ffffff", borderRadius: 24, boxShadow: "0 40px 90px rgba(0,0,0,.6)",
        transform: `rotateY(${(1 - Math.min(1, k)) * -40 + 8}deg) rotateX(4deg) translateZ(${(1 - Math.min(1, k)) * -500}px)` }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, color: "#606060", letterSpacing: 2 }}>DESCRIPCIÓN</div>
        <div style={{ marginTop: 14, padding: "14px 18px", borderRadius: 12, background: `rgba(255,178,87,${0.35 * hl})`, outline: `4px solid rgba(255,140,40,${hl})`, fontFamily: FONT, fontWeight: 800, fontSize: 36, color: "#0b57d0", transform: `scale(${1 + 0.04 * hl})`, transformOrigin: "0 50%" }}>
          ▶ El Frasco Marrón de Claudio · el link, aquí en la 1ª línea
        </div>
        {["Las 12 cosas de hoy, con las medidas", "1. Qué es lo negro del fondo", "2. El imán: qué olla tienes", "3. Agua y UNA pastilla"].map((l, i) => (
          <div key={i} style={{ marginTop: 16, height: 30, fontFamily: FONT, fontWeight: 600, fontSize: 28, color: "#3a3a3a", opacity: 0.85 }}>{l}</div>
        ))}
      </div>
      {q > 0.01 && <div style={{ position: "absolute", left: 1310, top: 300, width: 400, padding: 26, background: "#fff", borderRadius: 26, boxShadow: "0 40px 90px rgba(0,0,0,.6)", transform: `scale(${Math.min(1, q)}) rotate(${(1 - Math.min(1, q)) * 30 + 3}deg)` }}>
        <Img src={staticFile(P + "qr.png")} style={{ width: 348, height: 348 }} />
        <div style={{ textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#1b1205", marginTop: 8 }}>¿EN LA TELE? ESCANEA</div>
      </div>}
    </AbsoluteFill>
  );
};

// 7 · CORTE de la sartén: metal / grasa cocinada (el pegamento) / carbón. modo agua = el agua caliente se mete por debajo; modo barniz = capas que se apilan
export const Section: React.FC<{ t: number; at: number; out: number; mode: "capas" | "agua" | "barniz"; labels?: [number, number, number]; x?: number; y?: number }> = ({ t, at, out, mode, labels = [1e9, 1e9, 1e9], x = 960, y = 560 }) => {
  const o = op(t, at, out), k = k1(t, at, 0.8);
  if (o <= 0.01) return null;
  const Wd = 1300, Lb = (txt: string, a: number, yy: number, col: string) => (
    <div style={{ position: "absolute", left: Wd + 40, top: yy - 30, fontFamily: FONT, fontWeight: 900, fontSize: 48, color: col, whiteSpace: "nowrap", opacity: e(t, a, a + 0.2), transform: `translateX(${(1 - e(t, a, a + 0.3)) * 60}px)`, textShadow: extrude(5, "rgba(0,0,0,.6)") }}>{txt}</div>);
  const flow = mode === "agua" ? e(t, at + 0.8, at + 5) : 0;
  const nb = mode === "barniz" ? Math.floor(1 + 9 * e(t, at + 0.4, at + 4.5)) : 0;
  return (
    <div style={{ position: "absolute", left: x - Wd / 2 - 280, top: y - 160, opacity: o, perspective: 1400 }}>
      <div style={{ position: "relative", width: Wd, height: 320, transform: `rotateX(${28 - 10 * Math.min(1, k)}deg) rotateY(-12deg) scale(${0.6 + 0.4 * Math.min(1, k)})`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", left: 0, top: 200, width: Wd, height: 110, background: "linear-gradient(180deg,#dfe3e7,#8d9399)", borderRadius: 8, boxShadow: "0 30px 60px rgba(0,0,0,.5)" }} />
        {mode !== "barniz" ? <>
          <div style={{ position: "absolute", left: 40, top: 168 - flow * 18, width: Wd - 80, height: 32, background: "linear-gradient(180deg,#d9a24a,#a66a1e)", borderRadius: 6 }} />
          {Array.from({ length: 16 }, (_, i) => <div key={i} style={{ position: "absolute", left: 40 + i * ((Wd - 80) / 16), top: 92 - flow * 30 - (flow > 0 ? Math.sin(i * 1.7) * 14 * flow : 0), width: (Wd - 80) / 16 - 4, height: 76, background: "linear-gradient(180deg,#2a2420,#0b0908)", borderRadius: 10, transform: `rotate(${flow * Math.sin(i * 2.3) * 9}deg)` }} />)}
          {flow > 0 && <div style={{ position: "absolute", left: 40, top: 160, width: (Wd - 80) * flow, height: 10, background: "linear-gradient(90deg,rgba(120,200,255,.9),rgba(120,200,255,.3))", borderRadius: 5, boxShadow: "0 0 20px rgba(120,200,255,.9)" }} />}
          {flow > 0 && Array.from({ length: 8 }, (_, i) => { const ph = ((t - at) * 0.6 + i / 8) % 1; return <div key={"w" + i} style={{ position: "absolute", left: 60 + ph * (Wd - 160), top: 150, fontFamily: FONT, fontWeight: 900, fontSize: 40, color: "#8fd6ff" }}>›</div>; })}
        </> : Array.from({ length: nb }, (_, i) => <div key={i} style={{ position: "absolute", left: 30, top: 186 - i * 13, width: Wd - 60, height: 12, background: `hsl(${28 - i * 2},${60 - i * 3}%,${42 - i * 3.2}%)`, borderRadius: 4, boxShadow: "0 2px 0 rgba(0,0,0,.3)" }} />)}
      </div>
      {mode === "barniz" ? <>{Lb("CAPA SOBRE CAPA", labels[0], 70, COL.amber)}{Lb("COMO UN BARNIZ", labels[1], 150, "#e0b080")}{Lb("METAL", labels[2], 255, "#dfe3e7")}</>
        : <>{Lb("CARBÓN", labels[0], 120, "#cfc6bd")}{Lb("GRASA = PEGAMENTO", labels[1], 185, COL.amber)}{Lb("METAL", labels[2], 255, "#dfe3e7")}</>}
    </div>
  );
};

// 8 · ecuación con fichas: A + B = resultado
export const Equation: React.FC<{ t: number; parts: { at: number; icon?: string; text: string; col: string }[]; out: number; y?: number }> = ({ t, parts, out, y = 720 }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center", alignItems: "center", gap: 26 }}>
    {parts.map((p, i) => {
      const k = k1(t, p.at, 0.9), o = op(t, p.at, out);
      const sign = i === 0 ? null : <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 110, color: COL.ink, opacity: o, textShadow: extrude(6, "#000") }}>{i === parts.length - 1 ? "=" : "+"}</div>;
      return <React.Fragment key={i}>{sign}<div style={{ ...card(p.col), opacity: o, padding: "22px 34px", display: "flex", alignItems: "center", gap: 16, transform: `scale(${0.3 + 0.7 * Math.min(1, k)}) rotate(${(1 - Math.min(1, k)) * -20}deg)` }}>
        {p.icon && <Icon n={p.icon} s={96} />}<div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 58, color: "#1b1205" }}>{p.text}</div></div></React.Fragment>;
    })}
  </div>
);

// 9 · veredicto por sartén: cuatro tarjetas con foto + sello
export const Verdicts: React.FC<{ t: number; items: { at: number; k: string; name: string; v: string; ok: number }[]; out: number }> = ({ t, items, out }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 210, display: "flex", justifyContent: "center", gap: 30, perspective: 1500 }}>
    {items.map((it, i) => {
      const k = k1(t, it.at, 0.85), o = op(t, it.at, out);
      const col = it.ok > 0.6 ? "#3ccf7a" : it.ok > 0.3 ? COL.amber : COL.red;
      return <div key={i} style={{ width: 400, opacity: o, transform: `translateY(${(1 - Math.min(1, k)) * 300}px) rotateY(${(1 - Math.min(1, k)) * 80}deg)` }}>
        <div style={{ width: 400, height: 400, borderRadius: 24, overflow: "hidden", border: "6px solid #fff", boxShadow: "0 30px 60px rgba(0,0,0,.6)" }}>
          <Img src={staticFile(P + "img_" + it.k + ".jpg")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ marginTop: 18, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: COL.ink, textShadow: extrude(5, "#000") }}>{it.name}</div>
        <div style={{ margin: "12px auto 0", width: 340, padding: "10px 0", textAlign: "center", borderRadius: 14, background: col, fontFamily: FONT, fontWeight: 900, fontSize: 38, color: "#10130f", transform: `scale(${e(t, it.at + 0.35, it.at + 0.5) * 1.0})` }}>{it.v}</div>
      </div>;
    })}
  </div>
);

// 10 · regla de agua al costado de la foto: nivel bien (1-2 dedos) / mal (hasta arriba)
export const WaterGauge: React.FC<{ t: number; at: number; bad: number; out: number; x?: number }> = ({ t, at, bad, out, x = 1540 }) => {
  const o = op(t, at, out), lv = e(t, at, at + 1.2) * 0.32 + e(t, bad, bad + 1.0) * 0.6, b = e(t, bad, bad + 0.3);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: 190, width: 220, height: 700, opacity: o }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: "rgba(255,255,255,.12)", border: "5px solid rgba(255,255,255,.85)", backdropFilter: "blur(6px)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${lv * 100}%`, background: b > 0.5 ? "linear-gradient(180deg,#ff8a7a,#c0392b)" : "linear-gradient(180deg,#9fe0ff,#3a8ed0)" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: "12%", background: "#111" }} />
      </div>
      <div style={{ position: "absolute", left: -330, top: 700 * (1 - 0.32) - 30, width: 310, textAlign: "right", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: "#9df0b4", textShadow: extrude(5, "#000") }}>1-2 DEDOS ✓</div>
      {b > 0.01 && <div style={{ position: "absolute", left: -380, top: 10, width: 360, textAlign: "right", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: COL.red, opacity: b, textShadow: extrude(5, "#000") }}>HASTA ARRIBA ✗</div>}
    </div>
  );
};

// 11 · dosis: pastillas que caen en su casilla
export const Dose: React.FC<{ t: number; rows: { at: number; n: number; text: string }[]; out: number }> = ({ t, rows, out }) => (
  <div style={{ position: "absolute", left: 120, top: 260, display: "flex", flexDirection: "column", gap: 40 }}>
    {rows.map((r, i) => {
      const o = op(t, r.at, out);
      return <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, opacity: o, transform: `translateX(${(1 - e(t, r.at, r.at + 0.3)) * -200}px)` }}>
        <div style={{ display: "flex", gap: 14, width: 280 }}>{Array.from({ length: r.n }, (_, j) => { const kk = k1(t, r.at + 0.2 + j * 0.25); return <div key={j} style={{ width: 120, height: 80, borderRadius: 14, background: "linear-gradient(180deg,#fff 58%,#2a72cf 58%)", boxShadow: "0 16px 30px rgba(0,0,0,.5)", transform: `translateY(${(1 - Math.min(1, kk)) * -240}px) rotate(${(1 - Math.min(1, kk)) * 40}deg)` }} />; })}</div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 56, color: COL.ink, textShadow: extrude(6, "#000") }}>{r.text}</div>
      </div>;
    })}
  </div>
);

// 12 · cartel de ERROR con contador de 4
export const ErrorBanner: React.FC<{ t: number; at: number; out: number; n: number; text: string }> = ({ t, at, out, n, text }) => {
  const o = op(t, at, out), k = k1(t, at, 0.9);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 90, top: 90, opacity: o, transform: `rotate(-3deg) scale(${0.4 + 0.6 * Math.min(1, k)})`, transformOrigin: "0 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20, background: COL.red, padding: "18px 34px", borderRadius: 20, boxShadow: "0 30px 60px rgba(0,0,0,.6), inset 0 -8px 0 rgba(0,0,0,.25)" }}>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 70, color: "#fff" }}>ERROR #{n}</div>
        <div style={{ display: "flex", gap: 10 }}>{[1, 2, 3, 4].map((i) => <div key={i} style={{ width: 26, height: 26, borderRadius: 13, background: i <= n ? "#fff" : "rgba(255,255,255,.3)" }} />)}</div>
      </div>
      <div style={{ marginTop: 16, fontFamily: FONT, fontWeight: 900, fontSize: 54, color: COL.ink, textShadow: extrude(6, "#000"), maxWidth: 1100 }}>{text}</div>
    </div>
  );
};

// 13 · balanza: una sartén nueva = una caja de pastillas; después la caja salva ×20
export const Balance: React.FC<{ t: number; at: number; even: number; many: number; out: number }> = ({ t, at, even, many, out }) => {
  const o = op(t, at, out), k = k1(t, at, 0.8);
  if (o <= 0.01) return null;
  const tilt = 14 * (1 - e(t, even, even + 1.2)) + Math.sin(t * 2) * 1.5 * e(t, even, even + 1.2);
  const m = Math.floor(20 * e(t, many, many + 2.5));
  return (
    <AbsoluteFill style={{ opacity: o, transform: `scale(${0.5 + 0.5 * Math.min(1, k)})` }}>
      <div style={{ position: "absolute", left: 960 - 14, top: 380, width: 28, height: 420, background: "linear-gradient(90deg,#b8bcc2,#6c7076)", borderRadius: 14 }} />
      <div style={{ position: "absolute", left: 960 - 160, top: 790, width: 320, height: 40, borderRadius: 20, background: "#555b62" }} />
      <div style={{ position: "absolute", left: 960 - 520, top: 370, width: 1040, height: 20, background: "#d6dade", borderRadius: 10, transform: `rotate(${tilt}deg)`, transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: -60, top: 20, width: 260, textAlign: "center" }}>
          <div style={{ margin: "0 auto", width: 230, height: 120, borderRadius: "0 0 120px 120px", background: "linear-gradient(180deg,#e8ecef,#9aa1a8)", boxShadow: "0 20px 40px rgba(0,0,0,.5)" }} />
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: COL.ink, marginTop: 10, textShadow: extrude(4, "#000") }}>SARTÉN NUEVA</div>
        </div>
        <div style={{ position: "absolute", right: -60, top: 20, width: 260, textAlign: "center" }}>
          <div style={{ margin: "0 auto", width: 200, height: 130, borderRadius: 14, background: "linear-gradient(180deg,#3a86e0,#1d4f9a)", boxShadow: "0 20px 40px rgba(0,0,0,.5)", fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>PASTILLAS</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 40, color: COL.ink, marginTop: 10, textShadow: extrude(4, "#000") }}>UNA CAJA</div>
        </div>
      </div>
      {m > 0 && <div style={{ position: "absolute", left: 360, right: 360, top: 880, display: "flex", gap: 8, justifyContent: "center" }}>{Array.from({ length: 20 }, (_, i) => <div key={i} style={{ width: 46, height: 46, borderRadius: 23, background: i < m ? "#e8ecef" : "rgba(255,255,255,.12)", boxShadow: i < m ? "0 0 16px rgba(160,255,200,.8)" : undefined, border: "4px solid #1b1f24" }} />)}
        <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 52, color: "#9df0b4", textShadow: extrude(5, "#000") }}>{m} SARTENES SALVADAS</div></div>}
    </AbsoluteFill>
  );
};

// 14 · lista sobre la foto cenital: cada cosa se marca en su lugar
export const CheckOn: React.FC<{ t: number; items: { at: number; x: number; y: number; text: string }[]; out: number }> = ({ t, items, out }) => (
  <AbsoluteFill>
    {items.map((it, i) => {
      const o = op(t, it.at, out), k = k1(t, it.at, 1.1);
      if (o <= 0.01) return null;
      return <div key={i} style={{ position: "absolute", left: it.x, top: it.y, opacity: o, transform: `translate(-50%,-50%) scale(${Math.min(1, k)})`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 70, height: 70, borderRadius: 35, background: "#3ccf7a", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 26px rgba(0,0,0,.55)" }}><Icon n="check" s={56} c="#fff" /></div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: "#fff", background: "rgba(10,14,20,.78)", padding: "8px 16px", borderRadius: 12, whiteSpace: "nowrap" }}>{it.text}</div>
      </div>;
    })}
  </AbsoluteFill>
);

// 15 · cajita de comentario que se escribe sola
export const CommentType: React.FC<{ t: number; at: number; out: number; text: string; y?: number }> = ({ t, at, out, text, y = 760 }) => {
  const o = op(t, at, out), k = k1(t, at, 0.9);
  if (o <= 0.01) return null;
  const n = Math.round(text.length * e(t, at + 0.4, at + 0.4 + text.length * 0.05));
  return (
    <div style={{ position: "absolute", left: 960, top: y, width: 1200, opacity: o, transform: `translate(-50%,0) translateY(${(1 - Math.min(1, k)) * 200}px)`, background: "#fff", borderRadius: 22, padding: "24px 30px", boxShadow: "0 30px 70px rgba(0,0,0,.6)", display: "flex", gap: 22, alignItems: "center" }}>
      <div style={{ width: 70, height: 70, borderRadius: 35, background: "#c9a27a", flexShrink: 0 }} />
      <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 40, color: "#1a1a1a", flex: 1 }}>{text.slice(0, n)}<span style={{ opacity: Math.sin(t * 10) > 0 ? 1 : 0 }}>|</span></div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#fff", background: "#0b57d0", padding: "12px 22px", borderRadius: 30 }}>COMENTAR</div>
    </div>
  );
};

// 16 · botón de suscribirse 3D que se aprieta + me gusta
export const SubBtn: React.FC<{ t: number; at: number; press: number; like: number; out: number }> = ({ t, at, press, like, out }) => {
  const o = op(t, at, out), k = k1(t, at, 0.9), p = e(t, press, press + 0.12) * (1 - e(t, press + 0.15, press + 0.35)), done = e(t, press + 0.1, press + 0.2), lk = k1(t, like, 1.1);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 1180, top: 760, opacity: o, transform: `scale(${0.5 + 0.5 * Math.min(1, k)})`, display: "flex", gap: 24, alignItems: "center" }}>
      <div style={{ padding: "26px 46px", borderRadius: 50, background: done > 0.5 ? "#3a3a3a" : "#e62117", fontFamily: FONT, fontWeight: 900, fontSize: 44, color: "#fff", boxShadow: `0 ${16 - p * 12}px 0 ${done > 0.5 ? "#1a1a1a" : "#8e130d"}, 0 30px 50px rgba(0,0,0,.5)`, transform: `translateY(${p * 12}px)` }}>{done > 0.5 ? "SUSCRITO ✓" : "SUSCRIBIRSE"}</div>
      {lk > 0.01 && <div style={{ width: 110, height: 110, borderRadius: 55, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${Math.min(1.15, lk)}) rotate(${(1 - Math.min(1, lk)) * -40}deg)`, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }}>
        <svg width={64} height={64} viewBox="0 0 100 100"><path d="M30 88V44l20-34c8 0 12 6 10 14l-4 16h26c8 0 12 6 10 14l-8 26c-2 6-6 8-12 8H30zM10 44h12v44H10z" fill="#0b57d0" /></svg></div>}
    </div>
  );
};

// 17 · tres costumbres: fichas que se dan vuelta
export const Habits: React.FC<{ t: number; items: { at: number; text: string }[]; out: number }> = ({ t, items, out }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", gap: 36, perspective: 1400 }}>
    {items.map((it, i) => {
      const f = ei(t, it.at, it.at + 0.6), o = op(t, it.at - 0.3, out);
      return <div key={i} style={{ width: 480, height: 420, opacity: o, transformStyle: "preserve-3d", transform: `rotateY(${180 - 180 * f}deg)` }}>
        <div style={{ position: "absolute", inset: 0, ...card("#1d2733"), backfaceVisibility: "hidden", transform: "rotateY(180deg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 150, color: "rgba(255,255,255,.2)" }}>{i + 1}</div>
        <div style={{ position: "absolute", inset: 0, ...card("#f4efe6"), backfaceVisibility: "hidden", padding: 36, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 90, color: "#3ccf7a" }}>{i + 1}</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 50, lineHeight: 1.05, color: "#1b1205" }}>{it.text}</div>
        </div>
      </div>;
    })}
  </div>
);

// 18 · recap: riel de 7 pasos que se van tildando
export const RecapRail: React.FC<{ t: number; at: number; out: number; steps: { at: number; text: string }[] }> = ({ t, at, out, steps }) => {
  const o = op(t, at, out);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 70, top: 120, opacity: o, display: "flex", flexDirection: "column", gap: 14 }}>
      {steps.map((s0, i) => {
        const on = e(t, s0.at, s0.at + 0.25), cur = on * (1 - e(t, (steps[i + 1]?.at ?? 1e9), (steps[i + 1]?.at ?? 1e9) + 0.3));
        return <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, transform: `translateX(${cur * 24}px) scale(${1 + cur * 0.08})`, transformOrigin: "0 50%" }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: on > 0.5 ? "#3ccf7a" : "rgba(20,26,34,.75)", border: "3px solid rgba(255,255,255,.6)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontWeight: 900, fontSize: 36, color: on > 0.5 ? "#0c1a10" : "#fff" }}>{i + 1}</div>
          <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: cur > 0.5 ? "#fff" : "rgba(255,255,255,.65)", background: cur > 0.5 ? "rgba(10,14,20,.8)" : "transparent", padding: "6px 14px", borderRadius: 10, textShadow: "0 3px 10px #000" }}>{s0.text}</div>
        </div>;
      })}
    </div>
  );
};

// 19 · recibo sin precios: lo que gastas
export const Spent: React.FC<{ t: number; rows: { at: number; text: string }[]; totalAt: number; out: number }> = ({ t, rows, totalAt, out }) => {
  const o = op(t, rows[0].at - 0.2, out), k = k1(t, rows[0].at - 0.2, 0.8);
  if (o <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: 1150, top: 170, width: 620, padding: "40px 40px 50px", background: "#fbf8f1", opacity: o, boxShadow: "0 40px 80px rgba(0,0,0,.6)", transform: `rotate(3deg) translateY(${(1 - Math.min(1, k)) * -500}px)`,
      clipPath: "polygon(0 0,100% 0,100% 96%,95% 100%,90% 96%,85% 100%,80% 96%,75% 100%,70% 96%,65% 100%,60% 96%,55% 100%,50% 96%,45% 100%,40% 96%,35% 100%,30% 96%,25% 100%,20% 96%,15% 100%,10% 96%,5% 100%,0 96%)" }}>
      <div style={{ fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 40, color: "#222", textAlign: "center", letterSpacing: 4 }}>LO QUE GASTAS</div>
      <div style={{ borderTop: "3px dashed #999", margin: "18px 0" }} />
      {rows.map((r, i) => <div key={i} style={{ fontFamily: "Courier New, monospace", fontWeight: 700, fontSize: 38, color: "#222", margin: "14px 0", opacity: e(t, r.at, r.at + 0.15) }}>+ {r.text}</div>)}
      <div style={{ borderTop: "3px dashed #999", margin: "18px 0" }} />
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 54, color: "#1f8a4c", textAlign: "center", opacity: e(t, totalAt, totalAt + 0.2), transform: `scale(${1 + 0.3 * (1 - e(t, totalAt, totalAt + 0.3))})` }}>NADA NUEVO</div>
    </div>
  );
};

// 20 · cartel final
export const EndCard: React.FC<{ t: number; at: number; l1: string; l2: string }> = ({ t, at, l1, l2 }) => {
  const k = k1(t, at, 0.7), k2 = k1(t, at + 0.5, 0.7);
  if (t < at) return null;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", perspective: 1200 }}>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 150, color: COL.ink, textShadow: extrude(14, "#3a2a18"), transform: `translateZ(${(1 - Math.min(1, k)) * -900}px) rotateX(8deg)` }}>{l1}</div>
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 92, color: "#9df0b4", textShadow: extrude(8, "#0a2a20"), transform: `scale(${Math.min(1, k2)})`, marginTop: 10 }}>{l2}</div>
    </AbsoluteFill>
  );
};
