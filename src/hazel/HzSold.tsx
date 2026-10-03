// Kit del video hazelsold (10 cosas que la familia cree que valen). Tres piezas con profundidad (cama + plano medio +
// polvo/luz al frente), en el idioma del cartel de remate de Hazel:
//   HzCabinetScale — una balanza de bronce: en un plato, la vitrina entera (cada pieza cae con su etiqueta de vendido);
//                    en el otro, la cómoda que nadie quería. Con reveal, la balanza se vence del lado de la cómoda.
//   HzBottomMark   — la base de una pieza dada vuelta: una lupa barre y aparece la marca; abajo, la línea de marcas
//                    con su veredicto (vieja = vale, nueva = no).
//   HzListedVsSold — dos etiquetas: lo que alguien PIDE (grande, se tacha y se cae) contra lo que alguien PAGÓ.
// Textos SIEMPRE por props.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { HZ, LABEL, SERIF, TYPE, hexA, rnd } from "./HzTheme";
import { HzBed, Stamp, Tag, ease } from "./HzParts";

const Dust: React.FC<{ n: number; seed: number }> = ({ n, seed }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: n }).map((_, i) => {
        const r = (o: number) => rnd(seed * 61 + i * 7 + o);
        const s = 3 + r(1) * 7; const x = (r(2) * 1920 + f * (0.3 + r(3)) * 0.8) % 1920; const y = (r(4) * 1080 + Math.sin(f / 30 + i) * 18 + f * 0.2) % 1080;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", background: "rgba(255,240,200,0.55)", filter: "blur(1px)", opacity: 0.4 + 0.6 * r(5) }} />;
      })}
    </AbsoluteFill>
  );
};
const Title: React.FC<{ text: string; top?: number }> = ({ text, top = 52 }) => (
  <div style={{ position: "absolute", top, width: "100%", textAlign: "center", fontFamily: SERIF, fontSize: 66, color: HZ.white, textShadow: "0 4px 16px rgba(0,0,0,0.6)" }}>{text}</div>
);

// ── balanza ─────────────────────────────────────────────────────────────────────────────────────────────────────
export const HzCabinetScale: React.FC<{ left: { label: string; price: string }[]; right: { label: string; price: string }; reveal?: boolean; title?: string; leftTitle?: string; bed?: string; every?: number; total?: string }> = ({ left, right, reveal = true, title = "the china cabinet vs. the garage", leftTitle = "the china cabinet", bed, every = 22, total }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const n = left.length; const rightAt = 14 + n * every + 10;
  // primero se vence a la izquierda (pesa la vitrina), cuando entra la cómoda se da vuelta
  const leftW = interpolate(f, [10, 14 + n * every], [0, 1], ease);
  const flip = reveal ? spring({ frame: f - rightAt - 12, fps, config: { damping: 9, stiffness: 50 } }) : 0;
  const ang = -7 * leftW + 16 * flip; // grados: negativo = baja la izquierda
  const cx = 960, cy = 400, arm = 580;
  const panY = (side: -1 | 1) => Math.sin((ang * Math.PI) / 180) * arm * side;
  const Pan: React.FC<{ side: -1 | 1; children: React.ReactNode }> = ({ side, children }) => {
    const x = cx + side * Math.cos((ang * Math.PI) / 180) * arm; const y = cy + panY(side);
    return (
      <>
        <svg style={{ position: "absolute", left: 0, top: 0 }} width={1920} height={1080}>
          <line x1={x} y1={y} x2={x - 250} y2={y + 330} stroke="#b08a3e" strokeWidth={4} />
          <line x1={x} y1={y} x2={x + 250} y2={y + 330} stroke="#b08a3e" strokeWidth={4} />
        </svg>
        <div style={{ position: "absolute", left: x - 290, top: y + 326, width: 580, height: 50, borderRadius: "0 0 290px 290px / 0 0 50px 50px", background: "linear-gradient(#e4c27a, #9c7430)", boxShadow: "0 22px 30px rgba(0,0,0,0.45)" }} />
        <div style={{ position: "absolute", left: x - 290, top: y + 326, width: 580, height: 0 }}>{children}</div>
      </>
    );
  };
  return (
    <AbsoluteFill>
      <HzBed src={bed} seed={13} dim={0.64} blur={6} />
      <Title text={title} />
      {/* poste y brazo */}
      <div style={{ position: "absolute", left: cx - 18, top: cy, width: 36, height: 640, background: "linear-gradient(90deg, #8a6a2c, #e4c27a, #8a6a2c)" }} />
      <div style={{ position: "absolute", left: cx - 160, top: 1000, width: 320, height: 46, borderRadius: 10, background: "linear-gradient(#c9a456, #7a5a22)" }} />
      <div style={{ position: "absolute", left: cx - arm, top: cy - 9, width: arm * 2, height: 18, borderRadius: 9, background: "linear-gradient(#f0d48e, #9c7430)", transform: `rotate(${ang}deg)`, transformOrigin: "50% 50%", boxShadow: "0 8px 14px rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", left: cx - 30, top: cy - 30, width: 60, height: 60, borderRadius: 30, background: "radial-gradient(circle at 35% 35%, #fff3c8, #b08a3e)" }} />
      <Pan side={-1}>
        {left.map((it, i) => {
          const s = spring({ frame: f - 14 - i * every, fps, config: { damping: 12 } });
          return (
            <div key={i} style={{ position: "absolute", left: 20 + (i % 2) * 275, top: -104 - Math.floor(i / 2) * 110 - (1 - s) * 500, opacity: s, transform: `rotate(${(i % 2 ? 4 : -4)}deg)` }}>
              <Tag w={260} h={100}><div style={{ paddingLeft: 26, fontFamily: LABEL, fontWeight: 700, fontSize: 24, color: HZ.inkSoft, textTransform: "uppercase", lineHeight: 1 }}>{it.label}</div><div style={{ paddingLeft: 26, fontFamily: SERIF, fontSize: 38, color: HZ.ink }}>{it.price}</div></Tag>
            </div>
          );
        })}
      </Pan>
      <Pan side={1}>
        {(() => {
          const s = spring({ frame: f - rightAt, fps, config: { damping: 11 } });
          return (
            <div style={{ position: "absolute", left: 60, top: -290 - (1 - s) * 600, opacity: s }}>
              {/* cómoda mid-century: cajón largo y patas finas abiertas */}
              <div style={{ width: 400, height: 170, borderRadius: 8, background: "linear-gradient(#a8693a, #7a4520)", boxShadow: "inset 0 0 0 4px rgba(0,0,0,0.15)", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, padding: 10, boxSizing: "border-box" }}>
                {[0, 1, 2].map((k) => <div key={k} style={{ background: "linear-gradient(#b5774a, #8a5228)", borderRadius: 4, position: "relative" }}><div style={{ position: "absolute", left: "35%", right: "35%", top: "45%", height: 6, borderRadius: 3, background: "#3b2412" }} /></div>)}
              </div>
              <svg width={400} height={120}><line x1={50} y1={0} x2={28} y2={116} stroke="#5a3214" strokeWidth={12} /><line x1={350} y1={0} x2={372} y2={116} stroke="#5a3214" strokeWidth={10} /></svg>
            </div>
          );
        })()}
      </Pan>
      <div style={{ position: "absolute", left: 120, top: 960, fontFamily: TYPE, fontSize: 34, color: HZ.white, textShadow: "0 3px 10px rgba(0,0,0,0.7)" }}>{leftTitle}{total ? ` · ${total}` : ""}</div>
      <div style={{ position: "absolute", right: 120, top: 930, textAlign: "right", opacity: interpolate(f, [rightAt, rightAt + 10], [0, 1], ease) }}>
        <div style={{ fontFamily: TYPE, fontSize: 34, color: HZ.white, textShadow: "0 3px 10px rgba(0,0,0,0.7)" }}>{right.label}</div>
        <div style={{ fontFamily: SERIF, fontSize: 64, color: reveal ? "#F6E7B8" : HZ.white, textShadow: "0 4px 14px rgba(0,0,0,0.7)" }}>{reveal ? right.price : "?"}</div>
      </div>
      <Dust n={22} seed={13} />
    </AbsoluteFill>
  );
};

// ── la marca del fondo ──────────────────────────────────────────────────────────────────────────────────────────
export const HzBottomMark: React.FC<{ mark: string; sub?: string; marks: { name: string; years: string; good: boolean }[]; title?: string; bed?: string; every?: number }> = ({ mark, sub = "", marks, title = "turn it over", bed, every = 22 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const flip = spring({ frame: f - 6, fps, config: { damping: 14, stiffness: 70 } });
  const t = interpolate(f, [24, 70], [0, 1], ease);
  const lx = 330 + Math.cos(t * Math.PI * 1.2) * 150, ly = 440 + Math.sin(t * Math.PI * 1.2) * 90;
  const stripAt = 80;
  return (
    <AbsoluteFill>
      <HzBed src={bed} seed={17} dim={0.66} blur={6} />
      <Title text={title} />
      {/* base de la pieza, vista de abajo */}
      <div style={{ position: "absolute", left: 130, top: 200, width: 600, height: 520, perspective: 1400 }}>
        <div style={{ width: "100%", height: "100%", transform: `rotateX(${(1 - flip) * 80}deg)`, borderRadius: "50%", background: "radial-gradient(ellipse at 45% 40%, #fbf6ea, #e3d6bb 60%, #c4b391)", boxShadow: "0 40px 60px rgba(0,0,0,0.5), inset 0 0 0 18px rgba(255,255,255,0.35)", position: "relative" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", filter: `blur(${(1 - t) * 6}px)`, opacity: 0.25 + t * 0.6 }}>
            <div style={{ fontFamily: SERIF, fontSize: 70, color: "#3b5fa0" }}>{mark}</div>
            {sub ? <div style={{ fontFamily: TYPE, fontSize: 30, color: "#3b5fa0", marginTop: 6 }}>{sub}</div> : null}
          </div>
        </div>
      </div>
      {/* lupa */}
      <div style={{ position: "absolute", left: lx - 110, top: ly - 110, width: 220, height: 220, borderRadius: 110, border: "16px solid #2b2016", background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.5), rgba(255,255,255,0.05) 60%)", boxShadow: "0 20px 30px rgba(0,0,0,0.45)", opacity: interpolate(f, [18, 26], [0, 1], ease) }}>
        <div style={{ position: "absolute", right: -70, bottom: -90, width: 40, height: 130, borderRadius: 14, background: "#2b2016", transform: "rotate(-40deg)" }} />
      </div>
      {/* línea de marcas */}
      <div style={{ position: "absolute", left: 860, top: 220, width: 940 }}>
        {marks.map((m, i) => {
          const s = spring({ frame: f - stripAt - i * every, fps, config: { damping: 14 } });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 24, opacity: s, transform: `translateX(${(1 - s) * 90}px)` }}>
              <div style={{ width: 22, height: 22, borderRadius: 11, background: m.good ? HZ.green : HZ.red, flexShrink: 0, boxShadow: `0 0 0 6px ${hexA(m.good ? HZ.green : HZ.red, 0.3)}` }} />
              <Tag w={760} h={104} color={m.good ? "#F6E7B8" : undefined}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", width: "100%", paddingLeft: 30, boxSizing: "border-box" }}>
                  <span style={{ fontFamily: SERIF, fontSize: 44, color: HZ.ink }}>{m.name}</span>
                  <span style={{ fontFamily: TYPE, fontSize: 32, color: m.good ? HZ.red : HZ.inkSoft }}>{m.years}</span>
                </div>
              </Tag>
            </div>
          );
        })}
      </div>
      <Dust n={20} seed={17} />
    </AbsoluteFill>
  );
};

// ── publicado vs vendido ────────────────────────────────────────────────────────────────────────────────────────
export const HzListedVsSold: React.FC<{ item: string; listed: string; sold: string; listedLabel?: string; soldLabel?: string; note?: string; bed?: string }> = ({ item, listed, sold, listedLabel = "somebody ASKED", soldLabel = "somebody PAID", note = "", bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const a = spring({ frame: f - 6, fps, config: { damping: 12 } });
  const strike = interpolate(f, [40, 54], [0, 1], ease);
  const fall = interpolate(f, [62, 92], [0, 1], { ...ease, easing: (x) => x * x });
  const b = spring({ frame: f - 70, fps, config: { damping: 11 } });
  return (
    <AbsoluteFill>
      <HzBed src={bed} seed={19} dim={0.62} blur={6} />
      <Title text={item} />
      <div style={{ position: "absolute", left: 200, top: 250 + fall * 900, transform: `scale(${a}) rotate(${-4 + fall * 40}deg)`, transformOrigin: "50% 0%", opacity: 1 - fall }}>
        <Tag w={640} h={420}>
          <div style={{ paddingLeft: 40, fontFamily: LABEL, fontWeight: 700, fontSize: 34, color: HZ.inkSoft, textTransform: "uppercase" }}>{listedLabel}</div>
          <div style={{ position: "relative", fontFamily: SERIF, fontSize: 130, color: HZ.ink, marginTop: 20, marginLeft: 40 }}>
            {listed}
            <div style={{ position: "absolute", left: -10, top: "52%", height: 12, width: `${strike * 105}%`, background: HZ.red, transform: "rotate(-6deg)", borderRadius: 6 }} />
          </div>
        </Tag>
      </div>
      <div style={{ position: "absolute", right: 200, top: 270, transform: `scale(${b}) rotate(3deg)`, transformOrigin: "50% 0%" }}>
        <Tag w={640} h={420} color="#F6E7B8">
          <div style={{ paddingLeft: 40, fontFamily: LABEL, fontWeight: 700, fontSize: 34, color: HZ.inkSoft, textTransform: "uppercase" }}>{soldLabel}</div>
          <div style={{ fontFamily: SERIF, fontSize: 130, color: HZ.red, marginTop: 20, marginLeft: 40 }}>{sold}</div>
        </Tag>
      </div>
      {note ? <div style={{ position: "absolute", bottom: 90, width: "100%", textAlign: "center", opacity: interpolate(f, [96, 110], [0, 1], ease) }}><Stamp text={note} at={96} size={46} color={HZ.red} rot={-3} style={{ background: "rgba(255,255,255,0.92)", mixBlendMode: "normal" }} /></div> : null}
      <Dust n={20} seed={19} />
    </AbsoluteFill>
  );
};
