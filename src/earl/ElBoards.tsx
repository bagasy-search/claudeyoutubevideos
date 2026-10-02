// Componentes 2D del kit Earl (todos DENTRO del mundo del galpón): tapa de conservadora escrita a marcador con
// precios / reglas, ingredientes con la palabra mala encerrada, recorte de diario clavado, 9 de 10 camarones con
// etiqueta, tamaño por conteo, bitácora del barco, temporadas, línea de etiqueta agrandada. Textos por props.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EL, LABEL, MARKER, BODY, STENCIL, rnd } from "./ElTheme";
import { ElBed, Lid, Marker, Stamp, Tape, ease, useIn } from "./ElParts";

// tapa de conservadora con renglones "item ...... precio" que se escriben cuando Earl los dice
export const ElCoolerBoard: React.FC<{ bed?: string; title: string; rows: { item: string; price?: string; hi?: boolean }[]; every?: number; stamp?: string; stampGood?: boolean; seed?: number }> = ({ bed, title, rows, every = 30, stamp, stampGood = false, seed = 3 }) => {
  const k = useIn(0, 13, 110);
  const H = 190 + rows.length * 104;
  return (
    <AbsoluteFill>
      <ElBed src={bed} seed={seed} dim={0.3} />
      <div style={{ position: "absolute", left: 300, top: (1080 - H) / 2, transform: `translateY(${(1 - k) * 900}px)` }}>
        <Lid w={1320} h={H} rot={-1.2}>
          <div style={{ fontFamily: STENCIL, fontSize: 52, color: EL.navy, letterSpacing: 3, marginBottom: 14, textTransform: "uppercase" }}>{title}</div>
          {rows.map((r, i) => {
            const at = 12 + i * every;
            return (
              <div key={i} style={{ display: "flex", alignItems: "baseline", height: 104, borderBottom: `3px dashed ${EL.cooler2}` }}>
                <Marker text={r.item} at={at} size={62} color={r.hi ? EL.red : EL.marker} style={{ flex: 1 }} />
                {r.price ? <Marker text={r.price} at={at + 8} size={74} color={r.hi ? EL.red : EL.marker} style={{ textAlign: "right" }} /> : null}
              </div>
            );
          })}
        </Lid>
      </div>
      {stamp ? <div style={{ position: "absolute", right: 140, bottom: 90 }}><Stamp text={stamp} at={12 + rows.length * every + 6} size={84} color={stampGood ? EL.green : EL.red} rot={-8} style={{ background: "rgba(255,255,255,0.9)" }} /></div> : null}
    </AbsoluteFill>
  );
};

// lista de ingredientes impresa en la bolsa; la palabra mala se encierra en rojo y cae el sello
export const ElIngredients: React.FC<{ bed?: string; items: string[]; bad?: number; stamp?: string; title?: string; seed?: number }> = ({ bed, items, bad = -1, stamp = "paying for water", title = "INGREDIENTS:", seed = 5 }) => {
  const f = useCurrentFrame();
  const k = useIn(0, 13, 110);
  return (
    <AbsoluteFill>
      <ElBed src={bed} seed={seed} dim={0.35} />
      <div style={{ position: "absolute", left: 240, top: 300, width: 1440, transform: `scale(${0.9 + 0.1 * k})`, opacity: k, background: "#F7FAFC", padding: "50px 60px", boxShadow: `0 30px 60px ${EL.shadow}`, borderTop: `16px solid #1F4E8C` }}>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 64, color: EL.ink, lineHeight: 1.35 }}>
          {title}{" "}
          {items.map((it, i) => {
            const o = interpolate(f, [8 + i * 12, 14 + i * 12], [0, 1], ease);
            const isBad = i === bad;
            const hk = interpolate(f, [8 + i * 12 + 14, 8 + i * 12 + 26], [0, 1], ease);
            return <span key={i} style={{ opacity: o, position: "relative", padding: "0 6px", color: isBad ? EL.red : EL.ink, background: isBad ? `rgba(255,226,92,${0.85 * hk})` : undefined }}>{it}{i < items.length - 1 ? "," : "."}</span>;
          })}
        </div>
      </div>
      {bad >= 0 ? <div style={{ position: "absolute", right: 140, bottom: 120 }}><Stamp text={stamp} at={8 + bad * 12 + 32} size={92} rot={-8} style={{ background: "rgba(255,255,255,0.9)" }} /></div> : null}
    </AbsoluteFill>
  );
};

// recorte de diario clavado con cinta en la pared de chapa del galpón
export const ElClipping: React.FC<{ bed?: string; kicker?: string; headline: string; sub?: string; big?: string; seed?: number }> = ({ bed, kicker = "GULF COAST", headline, sub, big, seed = 9 }) => {
  const k = useIn(2, 12, 100);
  return (
    <AbsoluteFill>
      <ElBed src={bed} seed={seed} dim={0.4} />
      <div style={{ position: "absolute", left: "50%", top: 150, width: 1180, marginLeft: -590, transform: `rotate(${-2 + (1 - k) * -8}deg) translateY(${(1 - k) * 700}px)`, background: "#EEE9DC", padding: "46px 56px", boxShadow: `0 30px 60px ${EL.shadow}`, filter: "sepia(0.15)" }}>
        <div style={{ position: "absolute", left: 480, top: -22 }}><Tape text=" " rot={2} size={36} /></div>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 8, color: EL.inkSoft, borderBottom: `3px solid ${EL.ink}`, paddingBottom: 8 }}>{kicker}</div>
        <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 76, color: EL.ink, lineHeight: 1.05, marginTop: 18 }}>{headline}</div>
        {big ? <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 170, color: EL.red, lineHeight: 1, marginTop: 10 }}>{big}</div> : null}
        {sub ? <div style={{ fontFamily: BODY, fontWeight: 500, fontSize: 40, color: EL.inkSoft, marginTop: 14, columnCount: 2, columnGap: 40 }}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// N de cada M camarones sobre hielo picado: una etiqueta de cinta cae en cada uno (los "importados") y uno queda "GULF"
export const ElNineOfTen: React.FC<{ n?: number; of?: number; tag?: string; odd?: string; caption?: string; every?: number }> = ({ n = 9, of = 10, tag = "imported", odd = "Gulf", caption = "9 out of 10 shrimp eaten in America", every = 5 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 40%, #ffffff, ${EL.ice} 60%, #b9d6e2)` }}>
      {Array.from({ length: 160 }).map((_, i) => <div key={i} style={{ position: "absolute", left: rnd(i) * 1920, top: 300 + rnd(i + 500) * 780, width: 30 + rnd(i + 9) * 60, height: 24 + rnd(i + 3) * 40, background: "rgba(255,255,255,0.75)", borderRadius: 8, transform: `rotate(${rnd(i + 7) * 90}deg)`, boxShadow: "inset 0 -4px 8px rgba(120,170,190,0.35)" }} />)}
      <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 52, color: EL.navy, letterSpacing: 4, textTransform: "uppercase" }}>{caption}</div>
      <div style={{ position: "absolute", left: 140, right: 140, top: 300, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 40 }}>
        {Array.from({ length: of }).map((_, i) => {
          const at = 10 + i * every; const s = spring({ frame: f - at, fps, config: { damping: 11, stiffness: 160 } });
          const isOdd = i === of - 1 && n < of;
          return (
            <div key={i} style={{ position: "relative", width: 260, height: 220, transform: `scale(${s}) rotate(${(rnd(i) - 0.5) * 30}deg)` }}>
              <svg width={260} height={200} viewBox="0 0 260 200"><path d="M50 150 C 20 60, 160 10, 210 80 C 230 110, 200 150, 170 130 C 150 110, 170 80, 140 75 C 100 70, 80 120, 95 150 Z" fill={EL.shrimp} stroke="#c9653f" strokeWidth={6} /><path d="M50 150 L 20 185 L 70 175 Z" fill="#e2744a" /></svg>
              <div style={{ position: "absolute", left: 40, top: 150, opacity: interpolate(f, [at + 8, at + 12], [0, 1], ease) }}><Tape text={isOdd ? odd : tag} size={isOdd ? 40 : 34} color={isOdd ? EL.green : EL.red} rot={(rnd(i + 2) - 0.5) * 10} /></div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// tamaño honesto: el conteo por libra (16/20, 21/25…) frente a las palabras que no significan nada
export const ElCountSize: React.FC<{ bed?: string; counts: { c: string; note: string }[]; fake?: string[]; every?: number; seed?: number }> = ({ bed, counts, fake = ["JUMBO", "COLOSSAL", "EXTRA LARGE"], every = 24, seed = 4 }) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <ElBed src={bed} seed={seed} dim={0.4} />
      <div style={{ position: "absolute", left: 120, top: 140, display: "flex", flexDirection: "column", gap: 22 }}>
        {fake.map((w, i) => { const o = interpolate(f, [4 + i * 5, 8 + i * 5], [0, 1], ease); const s = interpolate(f, [30 + i * 4, 38 + i * 4], [0, 1], ease); return (
          <div key={i} style={{ position: "relative", opacity: o, fontFamily: LABEL, fontWeight: 700, fontSize: 96, color: EL.white, textShadow: "0 4px 12px rgba(0,0,0,0.5)" }}>{w}<div style={{ position: "absolute", left: -10, top: "50%", height: 12, width: `${110 * s}%`, background: EL.red, transform: "rotate(-5deg)", borderRadius: 6 }} /></div>); })}
      </div>
      <div style={{ position: "absolute", right: 120, top: 160, display: "flex", flexDirection: "column", gap: 30 }}>
        {counts.map((c, i) => { const at = 44 + i * every; const k = interpolate(f, [at, at + 10], [0, 1], ease); return (
          <div key={i} style={{ opacity: k, transform: `translateX(${(1 - k) * 200}px)`, background: EL.cooler, borderRadius: 20, padding: "18px 40px", boxShadow: `0 20px 40px ${EL.shadow}`, display: "flex", alignItems: "baseline", gap: 28 }}>
            <div style={{ fontFamily: STENCIL, fontSize: 120, color: EL.navy, lineHeight: 1 }}>{c.c}</div>
            <Marker text={c.note} at={at + 6} size={50} style={{ maxWidth: 420 }} />
          </div>); })}
      </div>
    </AbsoluteFill>
  );
};

// bitácora del Lady Beth: hora + lo que pasa, renglón por renglón (letra a marcador sobre papel cuadriculado)
export const ElBoatLog: React.FC<{ bed?: string; boat?: string; rows: { t: string; what: string }[]; every?: number; seed?: number }> = ({ bed, boat = "LADY BETH", rows, every = 40, seed = 6 }) => {
  const k = useIn(0, 13, 110);
  return (
    <AbsoluteFill>
      <ElBed src={bed} seed={seed} dim={0.35} />
      <div style={{ position: "absolute", left: 260, top: 110, width: 1400, height: 860, transform: `rotate(1deg) translateY(${(1 - k) * 900}px)`, background: "#FBFBF6", backgroundImage: "linear-gradient(rgba(47,111,143,0.15) 2px, transparent 2px), linear-gradient(90deg, rgba(47,111,143,0.15) 2px, transparent 2px)", backgroundSize: "52px 52px", boxShadow: `0 30px 60px ${EL.shadow}`, padding: "50px 70px" }}>
        <div style={{ fontFamily: STENCIL, fontSize: 58, color: EL.navy, marginBottom: 20 }}>{boat} · LOG</div>
        {rows.map((r, i) => { const at = 12 + i * every; return (
          <div key={i} style={{ display: "flex", alignItems: "baseline", height: 104 }}>
            <Marker text={r.t} at={at} size={56} color={EL.red} style={{ width: 260 }} />
            <Marker text={r.what} at={at + 6} size={56} style={{ flex: 1 }} />
          </div>); })}
      </div>
    </AbsoluteFill>
  );
};

// temporadas del Golfo en una tira de meses (marrón / blanco / rosado) con "hoy" marcado
export const ElSeason: React.FC<{ seasons: { name: string; from: number; to: number; color: string }[]; now?: number; title?: string }> = ({ seasons, now = 9, title = "Gulf shrimp seasons" }) => {
  const f = useCurrentFrame();
  const M = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"]; const X0 = 160, W = 1600 / 12;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(${EL.ice}, #ffffff)` }}>
      <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", fontFamily: STENCIL, fontSize: 64, color: EL.navy }}>{title}</div>
      {M.map((m, i) => <div key={i} style={{ position: "absolute", left: X0 + i * W, top: 260, width: W, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 48, color: i === now ? EL.red : EL.inkSoft }}>{m}</div>)}
      {seasons.map((s, i) => { const k = interpolate(f, [10 + i * 18, 30 + i * 18], [0, 1], ease); return (
        <div key={i} style={{ position: "absolute", left: X0 + s.from * W, top: 360 + i * 170, width: (s.to - s.from + 1) * W * k, height: 120, background: s.color, borderRadius: 60, boxShadow: `0 12px 24px ${EL.shadow}`, display: "flex", alignItems: "center", paddingLeft: 40, overflow: "visible" }}>
          <span style={{ fontFamily: MARKER, fontSize: 56, color: EL.white, whiteSpace: "nowrap", textShadow: "0 2px 6px rgba(0,0,0,0.35)" }}>{s.name}</span>
        </div>); })}
      <div style={{ position: "absolute", left: X0 + now * W + W / 2 - 3, top: 330, width: 6, height: 560, background: EL.red, opacity: interpolate(f, [60, 70], [0, 1], ease) }} />
      <div style={{ position: "absolute", left: X0 + now * W + W / 2 - 80, top: 900, width: 160, textAlign: "center", fontFamily: MARKER, fontSize: 50, color: EL.red, opacity: interpolate(f, [64, 74], [0, 1], ease) }}>now</div>
    </AbsoluteFill>
  );
};

// una línea de la etiqueta, agrandada sobre la foto de la bolsa, subrayada a marcador + veredicto
export const ElLabelLine: React.FC<{ bed?: string; n?: string; line: string; means: string; good?: boolean; seed?: number }> = ({ bed, n, line, means, good = false, seed = 8 }) => {
  const f = useCurrentFrame();
  const k = useIn(4, 12, 120);
  const u = interpolate(f, [18, 30], [0, 1], ease);
  return (
    <AbsoluteFill>
      <ElBed src={bed} seed={seed} dim={0.35} />
      <div style={{ position: "absolute", left: "50%", top: 330, transform: `translateX(-50%) scale(${0.85 + 0.15 * k})`, opacity: k, background: "#F7FAFC", padding: "34px 60px", boxShadow: `0 30px 60px ${EL.shadow}`, borderLeft: `18px solid #1F4E8C`, whiteSpace: "nowrap" }}>
        {n ? <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 32, letterSpacing: 7, color: EL.inkSoft }}>LINE {n}</div> : null}
        <div style={{ position: "relative", fontFamily: BODY, fontWeight: 700, fontSize: 96, color: EL.ink }}>{line}
          <svg style={{ position: "absolute", left: 0, bottom: -20 }} width="100%" height={30} preserveAspectRatio="none" viewBox="0 0 100 10"><path d={`M0 6 Q 25 ${2} 50 6 T 100 5`} stroke={EL.red} strokeWidth={2.4} fill="none" strokeDasharray={120} strokeDashoffset={120 * (1 - u)} /></svg>
        </div>
      </div>
      <div style={{ position: "absolute", left: "50%", top: 640, transform: "translateX(-50%)" }}><Stamp text={means} at={30} size={76} color={good ? EL.green : EL.red} rot={-4} style={{ background: "rgba(255,255,255,0.9)", whiteSpace: "nowrap" }} /></div>
    </AbsoluteFill>
  );
};

// overlays del canal
const useInOut = (n = 10) => { const f = useCurrentFrame(); const { durationInFrames } = useVideoConfig(); return Math.min(interpolate(f, [0, n], [0, 1], ease), interpolate(f, [durationInFrames - n, durationInFrames], [1, 0], ease)); };
export const ElNameTag: React.FC<{ name?: string; line?: string }> = ({ name = "Earl", line = "31 years running a shrimp boat · Biloxi" }) => {
  const k = useInOut(12);
  return (
    <AbsoluteFill><div style={{ position: "absolute", left: 90, bottom: 100, opacity: k, transform: `translateX(${(1 - k) * -80}px)`, background: EL.navy, padding: "18px 36px", borderLeft: `14px solid ${EL.buoy}`, boxShadow: `0 20px 40px ${EL.shadow}` }}>
      <div style={{ fontFamily: STENCIL, fontSize: 84, color: EL.white, lineHeight: 1 }}>{name}</div>
      <div style={{ fontFamily: MARKER, fontSize: 40, color: "#DCEEF4" }}>{line}</div>
    </div></AbsoluteFill>
  );
};
export const ElAsk: React.FC<{ question: string; eyebrow?: string }> = ({ question, eyebrow = "tell me in the comments" }) => {
  const k = useInOut(12);
  return (
    <AbsoluteFill><div style={{ position: "absolute", right: 90, top: 90, width: 760, opacity: k, transform: `translateY(${(1 - k) * -60}px) rotate(1.5deg)`, background: EL.cooler, borderRadius: 18, padding: "24px 34px", borderTop: `12px solid ${EL.buoy}`, boxShadow: `0 20px 40px ${EL.shadow}` }}>
      <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: EL.buoy, textTransform: "uppercase" }}>{eyebrow}</div>
      <div style={{ fontFamily: MARKER, fontSize: 58, color: EL.marker, lineHeight: 1.08, marginTop: 6 }}>{question}</div>
    </div></AbsoluteFill>
  );
};
export const ElSubscribe: React.FC<{ text?: string; line?: string }> = ({ text = "Subscribe", line = "next time: the fish I won't sell" }) => {
  const k = useInOut(10); const f = useCurrentFrame();
  const press = interpolate(f, [26, 30, 36], [1, 0.92, 1], ease);
  return (
    <AbsoluteFill><div style={{ position: "absolute", left: "50%", bottom: 90, transform: `translateX(-50%) translateY(${(1 - k) * 60}px)`, opacity: k, display: "flex", alignItems: "center", gap: 24, background: EL.cooler, borderRadius: 14, padding: "18px 30px", boxShadow: `0 20px 40px ${EL.shadow}` }}>
      <div style={{ background: f > 30 ? EL.inkSoft : EL.red, color: EL.white, fontFamily: LABEL, fontWeight: 700, fontSize: 44, letterSpacing: 4, padding: "10px 30px", textTransform: "uppercase", transform: `scale(${press})` }}>{f > 30 ? "Subscribed" : text}</div>
      <div style={{ fontFamily: MARKER, fontSize: 44, color: EL.marker, whiteSpace: "nowrap" }}>{line}</div>
    </div></AbsoluteFill>
  );
};
