// Kit del video hazeljewel (el joyero de 1800 de una venta de garaje). Tres piezas con profundidad (cama + plano
// medio + polvo/luz al frente), en el idioma del cartel de remate de Hazel:
//   HzBoxOpen    — un joyero de nogal visto de frente: la tapa se abre, sube la bandeja y van saliendo etiquetas con
//                  lo que había adentro (y lo que valía)
//   HzGoldStamps — el decodificador de sellos: cada sello cae sobre un eslabón y una barra muestra cuánto oro hay
//   HzCameoLight — tres camafeos y una linterna que pasa por detrás: el de caracol brilla rosado, la piedra no deja
//                  pasar luz, el de plástico muestra la costura del molde
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
const Title: React.FC<{ text: string }> = ({ text }) => <div style={{ position: "absolute", top: 52, width: "100%", textAlign: "center", fontFamily: SERIF, fontSize: 66, color: HZ.white, textShadow: "0 4px 16px rgba(0,0,0,0.6)" }}>{text}</div>;

// ── el joyero ──────────────────────────────────────────────────────────────────────────────────────────────────
export const HzBoxOpen: React.FC<{ items: { label: string; price: string; hi?: boolean }[]; title?: string; paid?: string; every?: number; bed?: string }> = ({ items, title = "what was inside the $20 box", paid = "$20", every = 22, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const lid = spring({ frame: f - 8, fps, config: { damping: 16, stiffness: 50 } });
  const tray = spring({ frame: f - 30, fps, config: { damping: 15 } });
  const glow = interpolate(f, [20, 60], [0, 1], ease);
  const bx = 220, by = 520, bw = 640, bh = 300;
  return (
    <AbsoluteFill>
      <HzBed src={bed} seed={23} dim={0.66} blur={6} />
      <Title text={title} />
      {/* la caja */}
      <div style={{ position: "absolute", left: bx, top: by, width: bw, height: bh, perspective: 1400 }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 12, background: "linear-gradient(#7a4a2a, #4f2d17)", boxShadow: "0 40px 60px rgba(0,0,0,0.55), inset 0 0 0 10px rgba(0,0,0,0.15)" }} />
        <div style={{ position: "absolute", left: 24, right: 24, top: 18, height: 120, borderRadius: 8, background: "linear-gradient(#b8434f, #7d2230)", boxShadow: `inset 0 0 40px rgba(0,0,0,0.5), 0 0 ${60 * glow}px rgba(255,220,150,${0.5 * glow})` }} />
        {/* bandeja que sube */}
        <div style={{ position: "absolute", left: 40, right: 40, top: 30 - tray * 120, height: 90, borderRadius: 8, background: "linear-gradient(#c45a63, #8d2b37)", border: "6px solid #5a3219", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6, padding: 6, boxSizing: "border-box" }}>
          {[0, 1, 2, 3].map((k) => <div key={k} style={{ background: "rgba(0,0,0,0.18)", borderRadius: 4, position: "relative" }}><div style={{ position: "absolute", left: "30%", top: "30%", width: "40%", height: "40%", borderRadius: "50%", background: k % 2 ? "#e9d38a" : "#f3efe6", boxShadow: "0 0 10px rgba(255,240,200,0.8)" }} /></div>)}
        </div>
        <div style={{ position: "absolute", left: bw / 2 - 22, top: 150, width: 44, height: 56, borderRadius: 8, background: "linear-gradient(#e8c87a, #a07a2e)" }}><div style={{ width: 10, height: 22, margin: "16px auto", background: "#3b2412", borderRadius: 4 }} /></div>
        {/* tapa */}
        <div style={{ position: "absolute", left: 0, top: -200, width: bw, height: 200, transformOrigin: "50% 100%", transform: `rotateX(${lid * 105}deg)`, borderRadius: "12px 12px 4px 4px", background: "linear-gradient(#8a5532, #5b331b)", boxShadow: "inset 0 0 0 10px rgba(0,0,0,0.15)" }} />
      </div>
      <div style={{ position: "absolute", left: bx, top: by + bh + 30, width: bw, textAlign: "center" }}><Tag w={300} h={110} style={{ margin: "0 auto" }}><div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 24, color: HZ.inkSoft, textTransform: "uppercase" }}>paid</div><div style={{ fontFamily: SERIF, fontSize: 52, color: HZ.ink }}>{paid}</div></Tag></div>
      {/* lo que salió */}
      <div style={{ position: "absolute", left: 980, top: 200, width: 800 }}>
        {items.map((it, i) => {
          const k = spring({ frame: f - 50 - i * every, fps, config: { damping: 13 } });
          return (
            <div key={i} style={{ marginBottom: 14, opacity: k, transform: `translateX(${(1 - k) * -120}px) rotate(${(i % 2 ? 1 : -1) * 1.5}deg)` }}>
              <Tag w={780} h={92} color={it.hi ? "#F6E7B8" : undefined}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", width: "100%", paddingLeft: 26, boxSizing: "border-box" }}>
                  <span style={{ fontFamily: SERIF, fontSize: 40, color: HZ.ink }}>{it.label}</span>
                  <span style={{ fontFamily: TYPE, fontSize: 34, color: it.hi ? HZ.red : HZ.inkSoft }}>{it.price}</span>
                </div>
              </Tag>
            </div>
          );
        })}
      </div>
      <Dust n={22} seed={23} />
    </AbsoluteFill>
  );
};

// ── los sellos del oro ─────────────────────────────────────────────────────────────────────────────────────────
export const HzGoldStamps: React.FC<{ rows: { stamp: string; means: string; gold: number; tag?: string }[]; title?: string; every?: number; bed?: string }> = ({ rows, title = "what the stamp means", every = 30, bed }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <HzBed src={bed} seed={25} dim={0.68} blur={6} />
      <Title text={title} />
      {rows.map((r, i) => {
        const at = 12 + i * every; const s = spring({ frame: f - at, fps, config: { damping: 10, stiffness: 160 } });
        const fill = interpolate(f, [at + 10, at + 34], [0, r.gold], ease);
        const y = 210 + i * 200;
        return (
          <React.Fragment key={i}>
            {/* eslabón */}
            <div style={{ position: "absolute", left: 160, top: y, width: 240, height: 140, borderRadius: 70, background: "rgba(30,20,10,0.55)", border: `22px solid ${r.gold > 0.5 ? "#d8b04a" : r.gold > 0.05 ? "#c9a95a" : "#b9a77a"}`, boxShadow: "0 16px 26px rgba(0,0,0,0.45), inset 0 0 0 3px rgba(255,255,255,0.35)", boxSizing: "border-box" }} />
            {/* el sello que golpea */}
            <div style={{ position: "absolute", left: 200, top: y + 34, width: 160, textAlign: "center", fontFamily: TYPE, fontSize: 44, fontWeight: 700, color: "#F6E7B8", textShadow: "0 2px 8px rgba(0,0,0,0.8)", transform: `scale(${interpolate(s, [0, 1], [2.2, 1])})`, opacity: interpolate(f - at, [0, 4], [0, 1], ease) }}>{r.stamp}</div>
            {/* barra de oro */}
            <div style={{ position: "absolute", left: 470, top: y + 30, width: 760, height: 80, borderRadius: 40, background: "rgba(255,255,255,0.14)", border: "3px solid rgba(255,255,255,0.5)", overflow: "hidden" }}>
              <div style={{ width: `${fill * 100}%`, height: "100%", background: "linear-gradient(90deg, #f6dc8a, #c99a2e)" }} />
            </div>
            <div style={{ position: "absolute", left: 1270, top: y + 26, width: 560, opacity: interpolate(f, [at + 14, at + 24], [0, 1], ease) }}>
              <div style={{ fontFamily: SERIF, fontSize: 46, color: HZ.white, textShadow: "0 3px 10px rgba(0,0,0,0.6)" }}>{r.means}</div>
              {r.tag ? <div style={{ fontFamily: TYPE, fontSize: 30, color: "#F6E7B8" }}>{r.tag}</div> : null}
            </div>
          </React.Fragment>
        );
      })}
      <Dust n={20} seed={25} />
    </AbsoluteFill>
  );
};

// ── la linterna detrás del camafeo ─────────────────────────────────────────────────────────────────────────────
export const HzCameoLight: React.FC<{ cameos?: { label: string; verdict: string; kind: "shell" | "stone" | "plastic" }[]; title?: string; bed?: string }> = ({ cameos = [{ label: "carved shell", verdict: "glows pink · hand carved", kind: "shell" }, { label: "carved stone", verdict: "no light · cold, heavy", kind: "stone" }, { label: "molded plastic", verdict: "a seam · light and warm", kind: "plastic" }], title = "put a light behind it", bed }) => {
  const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig();
  const T = Math.max(90, durationInFrames - 40);
  const lx = interpolate(f, [15, T], [200, 1720], ease);
  return (
    <AbsoluteFill>
      <HzBed src={bed} seed={27} dim={0.8} blur={8} />
      <Title text={title} />
      {cameos.map((c, i) => {
        const cx = 420 + i * 540, cy = 520;
        const near = Math.max(0, 1 - Math.abs(lx - cx) / 260);
        const base = c.kind === "shell" ? "#f2b49a" : c.kind === "stone" ? "#5a4a44" : "#e6c9b8";
        const glow = c.kind === "shell" ? near : c.kind === "plastic" ? near * 0.35 : 0;
        const done = lx > cx + 120;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: cx - 150, top: cy - 190, width: 300, height: 380, borderRadius: "50%", border: "18px solid #c9a24a", boxSizing: "border-box", background: base, boxShadow: `0 30px 50px rgba(0,0,0,0.5), inset 0 0 ${120 * glow}px rgba(255,170,120,${0.9 * glow}), 0 0 ${80 * glow}px rgba(255,170,120,${0.6 * glow})`, overflow: "hidden" }}>
              {/* el perfil de la dama */}
              <svg width={264} height={344} viewBox="0 0 264 344" style={{ position: "absolute", left: 0, top: 0, opacity: c.kind === "stone" ? 0.9 : 1 }}>
                <path d="M150 60 C 110 60, 92 96, 98 128 C 84 138, 86 150, 96 154 C 92 168, 100 178, 112 178 C 114 200, 104 222, 92 246 C 120 262, 170 266, 196 250 C 178 226, 176 200, 182 180 C 206 168, 214 130, 204 102 C 196 76, 176 60, 150 60 Z" fill={c.kind === "stone" ? "#e8e2da" : "#fbf3ec"} opacity={0.95} />
                <circle cx={196} cy={96} r={30} fill={c.kind === "stone" ? "#e8e2da" : "#fbf3ec"} />
                <path d="M118 70 C 140 50, 190 52, 206 80" stroke={c.kind === "stone" ? "#cfc6bb" : "#efe2d6"} strokeWidth={10} fill="none" strokeLinecap="round" />
                {c.kind === "plastic" ? <line x1={0} y1={172} x2={264} y2={172} stroke="rgba(0,0,0,0.35)" strokeWidth={3} strokeDasharray="6 4" /> : null}
              </svg>
            </div>
            <div style={{ position: "absolute", left: cx - 200, top: cy + 220, width: 400, textAlign: "center" }}>
              <div style={{ fontFamily: SERIF, fontSize: 44, color: HZ.white }}>{c.label}</div>
              <div style={{ fontFamily: TYPE, fontSize: 30, color: c.kind === "shell" ? "#F6E7B8" : hexA(HZ.white, 0.8), opacity: done ? 1 : 0.2 }}>{c.verdict}</div>
            </div>
          </React.Fragment>
        );
      })}
      {/* la linterna (detrás: su haz se ve a los costados) */}
      <div style={{ position: "absolute", left: lx - 220, top: 300, width: 440, height: 440, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,245,220,0.35), transparent 65%)", mixBlendMode: "screen" }} />
      <Dust n={20} seed={27} />
    </AbsoluteFill>
  );
};
