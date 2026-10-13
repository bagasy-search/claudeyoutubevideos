// alpiso · escenas héroe (Claude, 13-oct-2026). Capas: cama (foto real) → material (fotos impresas, página real de la guía)
// → marcas (círculos rojos, notas a mano, chips) → anillo sólo cuando se dice un tiempo → grano y grade.
// Todos los tiempos (t, t1…) son SEGUNDOS ABSOLUTOS de la voz; a = segundo de entrada, d = cuadros.
// ⛔ Ningún objeto se dibuja con CSS: todo es foto real. CSS sólo para notas, chips, marcas, anillos y cámara.
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { HAND, LABEL, SERIF, fr, cl, ez, eo, lin, img, C, Grade, Grain, Mark, Print, Chip, Bed, sp } from "./Base";
import { CL } from "../claudio/ClTheme";

type P<T> = React.FC<T & { a: number; d: number }>;
const useT = (a: number) => { const f = useCurrentFrame(); return { f, at: (t: number) => fr(t) - fr(a) }; };

// cámara: empuja hacia (x,y) del lienzo 1920x1080 con claves en segundos absolutos
type K = { t: number; s: number; x: number; y: number };
export const camOf = (at: (t: number) => number, keys: K[]) => {
  const ks = keys.map((k) => ({ ...k, f: at(k.t) }));
  return (f: number) => {
    if (f <= ks[0].f) return { s: ks[0].s, x: ks[0].x, y: ks[0].y };
    for (let i = 1; i < ks.length; i++) {
      if (f <= ks[i].f) {
        const u = ez((f - ks[i - 1].f) / Math.max(1, ks[i].f - ks[i - 1].f));
        return { s: ks[i - 1].s + (ks[i].s - ks[i - 1].s) * u, x: ks[i - 1].x + (ks[i].x - ks[i - 1].x) * u, y: ks[i - 1].y + (ks[i].y - ks[i - 1].y) * u };
      }
    }
    const l = ks[ks.length - 1]; return { s: l.s, x: l.x, y: l.y };
  };
};
// capa de cámara: la imagen de 1920x1080 se mueve según camOf
const Cam: React.FC<{ cam: (f: number) => { s: number; x: number; y: number }; f: number; children: React.ReactNode }> = ({ cam, f, children }) => {
  const c = cam(f);
  return <AbsoluteFill style={{ transform: `translate(${(960 - c.x) * (c.s - 1)}px, ${(540 - c.y) * (c.s - 1)}px) scale(${c.s})`, transformOrigin: "50% 50%" }}>{children}</AbsoluteFill>;
};

// nota a mano de Claudio (papel crema, letra a mano, 2-6 palabras)
const Note: React.FC<{ txt: string; f: number; at: number; x: number; y: number; rot?: number; size?: number }> = ({ txt, f, at, x, y, rot = -3, size = 64 }) => {
  const u = sp(f, at, 14, 170);
  if (f < at - 2) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, fontFamily: HAND, fontWeight: 700, fontSize: size, lineHeight: 1.1, color: "#1d1a16",
      background: "#FBF6E8", padding: `${size * 0.18}px ${size * 0.36}px`, borderRadius: 6, boxShadow: "0 16px 34px rgba(0,0,0,0.35)",
      transform: `rotate(${rot}deg) translateY(${(1 - u) * 22}px)`, opacity: u, whiteSpace: "nowrap" }}>{txt}</div>
  );
};
// anillo con cuenta regresiva (sólo cuando la voz dice un tiempo)
const Ring: React.FC<{ f: number; at: number; dur: number; label: string; x: number; y: number }> = ({ f, at, dur, label, x, y }) => {
  if (f < at - 2) return null;
  const u = cl((f - at) / Math.max(1, dur));
  const sec = Math.round(dur * (1 - u) / 30 * 10) / 10;
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 230, height: 230, transform: "translate(-50%,-50%)" }}>
      <svg width="230" height="230" style={{ position: "absolute", inset: 0 }}>
        <circle cx="115" cy="115" r="98" fill="rgba(20,18,16,0.55)" stroke="rgba(255,255,255,0.25)" strokeWidth="10" />
        <circle cx="115" cy="115" r="98" fill="none" stroke={CL.yellow} strokeWidth="12" strokeLinecap="round"
          pathLength={1} strokeDasharray={1} strokeDashoffset={u} transform="rotate(-90 115 115)" />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: LABEL, color: C.porc, textTransform: "uppercase" }}>
        <div style={{ fontSize: 58, fontWeight: 700 }}>{label}</div>
        <div style={{ fontSize: 26, letterSpacing: 2, opacity: 0.85 }}>{sec.toFixed(1)} s</div>
      </div>
    </div>
  );
};
// tic verde a mano (sólo como marca de "bien")
const Tick: React.FC<{ f: number; at: number; x: number; y: number; s?: number }> = ({ f, at, x, y, s = 140 }) => {
  const u = eo((f - at) / 9);
  if (u <= 0) return null;
  return (
    <svg style={{ position: "absolute", left: x, top: y, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.4))" }} width={s} height={s}>
      <path d={`M ${s * 0.12} ${s * 0.55} L ${s * 0.4} ${s * 0.82} L ${s * 0.9} ${s * 0.18}`} fill="none" stroke="#3E8E55" strokeWidth={s * 0.1} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} />
    </svg>
  );
};

// ── 1) KnockMap: planta del piso desde arriba, la cámara recorre; "a lata" = cinta marcada en 4 cerámicos ──
export const KnockMap: P<{ k: string; kn: number; cross: number[]; tap: number[]; note: { t: number; txt: string }; keys: K[] }> = ({ a, d, k, kn, cross, tap, note, keys }) => {
  const { f, at } = useT(a);
  const cam = camOf(at, keys);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#15110c" }}>
      <Cam cam={cam} f={f}>
        <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Cam>
      {cross.map((t, i) => {
        const x = 520 + (i % 2) * 520, y = 300 + Math.floor(i / 2) * 380;
        return (<React.Fragment key={i}>
          <Mark kind="strike" x={x} y={y} w={160} h={160} f={f} at={at(t)} dur={8} color="#D23B2E" sw={12} />
          <Mark kind="strike" x={x} y={y} w={160} h={160} f={f} at={at(t) + 4} dur={8} color="#D23B2E" sw={12} />
        </React.Fragment>);
      })}
      <Note txt="SORDO = BIEN" f={f} at={at(kn)} x={1240} y={180} rot={-4} size={72} />
      <Note txt="A LATA = SUELTO" f={f} at={at(kn) + 4} x={1240} y={300} rot={2} size={72} />
      {tap.map((t, i) => <Chip key={i} txt="cinta de pintor" size={34} rot={-3} />).slice(0, 0)}
      <Grade /><Grain />
    </AbsoluteFill>
  );
};

// ── 2) DotsUnder: dorso de una pieza con 4-5 puntos de pegamento (rojo) vs. peinado completo (tick verde) ──
export const DotsUnder: P<{ bad: string; good: string; dots: { x: number; y: number }[]; t1: number; t2: number; t3: number }> = ({ a, d, bad, good, dots, t1, t2, t3 }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill>
      <Bed k={bad} f={f} T={d} dim={0.5} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 0 }}>
        <div style={{ position: "absolute", left: 180, top: 170, transform: `scale(${0.97 + 0.03 * eo(f / 30)})` }}>
          <Print k={bad} w={700} h={500} f={f} mat={20}>
            {dots.map((p, i) => <Mark key={i} kind="circle" x={p.x * 7} y={p.y * 5} w={120} h={120} f={f} at={at(t1) + i * 3} dur={8} sw={10} />)}
          </Print>
        </div>
        <div style={{ position: "absolute", left: 1040, top: 170 }}>
          <Print k={good} w={700} h={500} f={f} mat={20} />
          <Tick f={f} at={at(t3)} x={560} y={300} />
        </div>
      </AbsoluteFill>
      <Note txt="SÓLO EN PUNTOS" f={f} at={at(t2)} x={230} y={740} rot={-3} size={70} />
      <Note txt="PEINADO EN TODO" f={f} at={at(t3)} x={1090} y={740} rot={2} size={70} />
      <Grade /><Grain />
    </AbsoluteFill>
  );
};

// ── 3) JointHoles: macro de la junta con dos agujeros en esquinas opuestas; chip "EN LA JUNTA" ──
export const JointHoles: P<{ k: string; h1: number; h2: number; chip: number; keys: K[] }> = ({ a, d, k, h1, h2, chip, keys }) => {
  const { f, at } = useT(a);
  const cam = camOf(at, keys);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#15110c" }}>
      <Bed k={k} f={f} T={d} dim={0.35} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Cam cam={cam} f={f}>
          <Print k={k} w={1100} h={620} f={f} mat={22}>
            <Mark kind="circle" x={120} y={90} w={170} h={170} f={f} at={at(h1)} dur={10} sw={11} />
            <Mark kind="circle" x={800} y={380} w={170} h={170} f={f} at={at(h2)} dur={10} sw={11} />
          </Print>
        </Cam>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 120, bottom: 150, opacity: eo((f - at(chip)) / 10) }}>
        <Chip txt="En la junta, nunca en la pieza" size={50} rot={-2} />
      </div>
      <Grade /><Grain />
    </AbsoluteFill>
  );
};

// ── 4) SyringeFlow: jeringa en el agujero → "asome" = el pegamento sale por el otro; anillo "DESPACIO" ──
export const SyringeFlow: P<{ k1: string; k2: string; t1: number; t2: number; ring: number; ringDur: number }> = ({ a, d, k1, k2, t1, t2, ring, ringDur }) => {
  const { f, at } = useT(a);
  const sw = eo((f - at(t2)) / 14);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={k1} f={f} T={d} dim={0.4} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "absolute", transform: `translateX(${-280 + 560 * sw}px)`, opacity: 1 }}>
          <Print k={sw > 0.5 ? k2 : k1} w={900} h={560} f={f} mat={20} />
        </div>
      </AbsoluteFill>
      <Ring f={f} at={at(ring)} dur={ringDur} label="despacio" x={1560} y={820} />
      <div style={{ position: "absolute", left: 120, top: 120, opacity: eo((f - at(t1)) / 10) }}>
        <Chip txt="Despacio" size={56} rot={-2} />
      </div>
      <Grade /><Grain />
    </AbsoluteFill>
  );
};

// ── 5) Weight24: libros / bolsa de arena sobre la pieza; anillo de 24 h en "veinticuatro horas"; "NO PISAR" ──
export const Weight24: P<{ k: string; t24: number; note: number; ringDur: number }> = ({ a, d, k, t24, note, ringDur }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={k} f={f} T={d} dim={0.45} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Print k={k} w={920} h={560} f={f} mat={20} />
      </AbsoluteFill>
      <Ring f={f} at={at(t24)} dur={ringDur} label="24 h" x={1560} y={300} />
      <Note txt="NO PISAR" f={f} at={at(note)} x={160} y={800} rot={-3} size={96} />
      <Grade /><Grain />
    </AbsoluteFill>
  );
};

// ── 6) TentFloor: pasillo con dos piezas levantadas; empuje lento y arco rojo; luego la regla de 5 mm ──
export const TentFloor: P<{ k: string; k2: string; arc: number; ruler: number; note: number; keys: K[] }> = ({ a, d, k, k2, arc, ruler, note, keys }) => {
  const { f, at } = useT(a);
  const cam = camOf(at, keys);
  const sw = eo((f - at(ruler)) / 14);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#15110c" }}>
      <Cam cam={cam} f={f}>
        <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Cam>
      {sw > 0 && (
        <AbsoluteFill style={{ opacity: sw, justifyContent: "center", alignItems: "center" }}>
          <Print k={k2} w={860} h={520} f={f} mat={20} />
        </AbsoluteFill>
      )}
      <Mark kind="circle" x={760} y={380} w={420} h={260} f={f} at={at(arc)} dur={22} sw={12} />
      <Note txt="EL ZÓCALO LO TAPA" f={f} at={at(note)} x={1280} y={860} rot={-2} size={64} />
      <Grade /><Grain />
    </AbsoluteFill>
  );
};

// ── 7) PageSixteen: la página real de la guía sobre la mesa; tildes en los pasos que se nombran ──
export const PageSixteen: P<{ k: string; bed: string; reveal: number; checks: number[]; chip: number }> = ({ a, d, k, bed, reveal, checks, chip }) => {
  const { f, at } = useT(a);
  const u = eo((f - at(reveal)) / 26);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={d} dim={0.5} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ transform: `translateY(${(1 - u) * 60}px) scale(${0.92 + 0.08 * u})`, opacity: u }}>
          <Print k={k} w={560} h={740} f={f} mat={14}>
            {checks.map((t, i) => <Tick key={i} f={f} at={at(t)} x={40 + (i % 2) * 220} y={120 + i * 110} s={80} />)}
          </Print>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", right: 120, bottom: 150, opacity: eo((f - at(chip)) / 10) }}>
        <Chip txt="Página 16" size={54} rot={-2} />
      </div>
      <Grade /><Grain />
    </AbsoluteFill>
  );
};


// ── QR visual (sin voz, 6-8 s): portada + código del manual, línea "66 arreglos · menos que una visita" ──
export const QrVisual: P<{ cover: string; qr: string; line: string; kicker: string }> = ({ a, d, cover, qr, line, kicker }) => {
  const { f } = useT(a);
  const u = eo(f / 18);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#2C3036" }}>
      <AbsoluteFill style={{ opacity: 0.55, transform: `scale(${1.03 + 0.03 * f / Math.max(1, d)})` }}>
        <Img src={img(cover)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(10px) brightness(0.7)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: u }}>
        <div style={{ display: "flex", gap: 90, alignItems: "center", transform: `translateY(${(1 - u) * 40}px)` }}>
          <Print k={cover} w={380} h={500} f={f} mat={14} />
          <div style={{ background: "#FBF9F4", padding: 36, borderRadius: 14, boxShadow: "0 30px 60px rgba(0,0,0,0.4)" }}>
            <Img src={img(qr)} style={{ width: 380, height: 380, display: "block" }} />
          </div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, textAlign: "center", fontFamily: LABEL, color: "#FBF9F4", textTransform: "uppercase" }}>
        <div style={{ fontSize: 30, letterSpacing: 4, color: "#F2C230", opacity: u }}>{kicker}</div>
        <div style={{ fontSize: 60, fontWeight: 700, marginTop: 10, opacity: u, textShadow: "0 6px 20px rgba(0,0,0,0.6)" }}>{line}</div>
      </div>
      <Grain />
    </AbsoluteFill>
  );
};

export const NEW: Record<string, React.FC<any>> = { QrVisual, KnockMap, DotsUnder, JointHoles, SyringeFlow, Weight24, TentFloor, PageSixteen };
