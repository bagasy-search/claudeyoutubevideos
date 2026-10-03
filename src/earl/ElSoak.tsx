// Kit del video earlsoap (camarones remojados en fosfato). Tres piezas con profundidad (cama + plano medio + partículas
// al frente con paralaje), en el idioma visual del galpón de Earl:
//   ElSoakSwell — tanque de vidrio: el camarón se hincha y brilla en el remojo, la balanza sube "por agua".
//   ElPanDuel   — dos sartenes de hierro vistas de arriba: el bueno dora y chisporrotea, el remojado hierve en agua lechosa.
//   ElColdChain — carta náutica: la ruta del camarón en el barco (red → mesa → frío → casa) sin remojo.
// Textos SIEMPRE por props.
import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EL, LABEL, MARKER, STENCIL, hexA, rnd } from "./ElTheme";
import { ElBed, Stamp, Tape, ease } from "./ElParts";

// camarón crudo de perfil (curvo, segmentado). `cook` 0..1 = de gris-rosado a naranja; `gloss` = brillo de remojo
export const Shrimp: React.FC<{ w: number; cook?: number; gloss?: number; brown?: number; style?: React.CSSProperties }> = ({ w, cook = 0, gloss = 0, brown = 0, style }) => {
  const mix = (a: number[], b: number[], k: number) => a.map((v, i) => Math.round(v + (b[i] - v) * k));
  const body = mix([196, 170, 160], [241, 128, 84], cook);
  const edge = mix(body, [150, 70, 35], brown);
  const c = `rgb(${body.join(",")})`, e = `rgb(${edge.join(",")})`;
  return (
    <svg width={w} height={w * 0.8} viewBox="0 0 200 160" style={style}>
      <defs>
        <radialGradient id={`sg${Math.round(cook * 9)}${Math.round(brown * 9)}`} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor={c} /><stop offset="100%" stopColor={e} />
        </radialGradient>
      </defs>
      <path d="M40 40 C 90 0, 175 20, 178 80 C 180 125, 140 150, 105 140 L 112 118 C 135 122, 152 104, 150 82 C 147 48, 100 38, 66 62 Z" fill={`url(#sg${Math.round(cook * 9)}${Math.round(brown * 9)})`} stroke={hexA("#5a2a14", 0.45)} strokeWidth={3} />
      {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${70 + i * 20} ${45 - (i > 2 ? (i - 2) * -8 : 0)} q 10 ${18 + i * 4} ${-4 + i * 3} ${36 + i * 6}`} stroke={hexA("#5a2a14", 0.35)} strokeWidth={3} fill="none" />)}
      <path d="M105 140 L 82 156 L 96 132 Z" fill={e} />
      <circle cx={52} cy={48} r={5} fill="#1b1b1b" />
      <path d="M44 40 C 20 20, 10 10, 4 4 M46 44 C 18 34, 8 30, 2 30" stroke={hexA("#5a2a14", 0.5)} strokeWidth={2} fill="none" />
      {gloss > 0 ? <path d="M70 36 C 110 22, 150 40, 160 70" stroke={`rgba(255,255,255,${0.75 * gloss})`} strokeWidth={9} strokeLinecap="round" fill="none" /> : null}
    </svg>
  );
};

// burbujas/partículas al frente con paralaje (capa de profundidad)
const Particles: React.FC<{ n: number; seed: number; color: string; size: [number, number]; rise?: number; drift?: number; blur?: number; area?: [number, number, number, number] }> = ({ n, seed, color, size, rise = 1.4, drift = 0.3, blur = 0, area = [0, 0, 1920, 1080] }) => {
  const f = useCurrentFrame();
  const [x0, y0, w, h] = area;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", filter: blur ? `blur(${blur}px)` : undefined }}>
      {Array.from({ length: n }).map((_, i) => {
        const r = (o: number) => rnd(seed * 97 + i * 13 + o);
        const s = size[0] + (size[1] - size[0]) * r(1);
        const y = y0 + ((r(2) * h - f * rise * (0.6 + r(3))) % h + h) % h;
        const x = x0 + r(4) * w + Math.sin(f / 18 + i) * 14 * drift;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: s, height: s, borderRadius: "50%", border: `2px solid ${color}`, background: hexA("#ffffff", 0.12) }} />;
      })}
    </AbsoluteFill>
  );
};

export const ElSoakSwell: React.FC<{ bed?: string; title?: string; tank?: string; scaleLabel?: string; tag?: string; seed?: number }> = ({ bed, title = "what the soak does", tank = "phosphate soak", scaleLabel = "you pay by the pound", tag = "+ water" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const inTank = spring({ frame: f - 6, fps, config: { damping: 15, stiffness: 90 } });
  const swell = interpolate(f, [24, 120], [0, 1], ease);
  const fill = interpolate(f, [4, 40], [0, 1], ease);
  const needle = interpolate(f, [30, 130], [-55, 25], ease);
  return (
    <AbsoluteFill>
      <ElBed src={bed} seed={11} dim={0.55} />
      <AbsoluteFill style={{ backdropFilter: "blur(6px)", background: hexA(EL.navyDeep, 0.25) }} />
      <div style={{ position: "absolute", top: 54, width: "100%", textAlign: "center", fontFamily: STENCIL, fontSize: 58, color: EL.white, textTransform: "uppercase", textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>{title}</div>
      {/* tanque de vidrio */}
      <div style={{ position: "absolute", left: 230, top: 190, width: 820, height: 720, borderRadius: 30, border: "6px solid rgba(255,255,255,0.55)", background: "linear-gradient(90deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02) 40%, rgba(255,255,255,0.12))", boxShadow: "0 40px 80px rgba(0,0,0,0.45), inset 0 0 40px rgba(255,255,255,0.12)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${fill * 78}%`, background: "linear-gradient(rgba(214,236,244,0.55), rgba(170,206,222,0.75))", borderTop: "4px solid rgba(255,255,255,0.7)" }} />
        <div style={{ position: "absolute", left: "50%", top: "52%", transform: `translate(-50%,-50%) translateY(${(1 - inTank) * -520}px) scale(${1 + swell * 0.28}) rotate(${-8 + Math.sin(f / 20) * 3}deg)` }}>
          <Shrimp w={430} cook={0.05} gloss={swell} />
        </div>
        <Particles n={26} seed={3} color="rgba(255,255,255,0.7)" size={[8, 22]} rise={2.2} area={[20, 200, 780, 520]} />
        <div style={{ position: "absolute", left: 30, top: 28 }}><Tape text={tank} rot={-2} size={40} /></div>
        <div style={{ position: "absolute", left: 18, top: 0, width: 60, height: "100%", background: "linear-gradient(90deg, rgba(255,255,255,0.35), transparent)" }} />
      </div>
      {/* balanza */}
      <div style={{ position: "absolute", left: 1150, top: 260, width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #ffffff, #dfe5e3 70%, #b9c2c0)", border: `16px solid ${EL.navy}`, boxShadow: "0 40px 70px rgba(0,0,0,0.5)", transform: `scale(${spring({ frame: f - 14, fps, config: { damping: 14 } })})` }}>
        {Array.from({ length: 21 }).map((_, i) => <div key={i} style={{ position: "absolute", left: 264, top: 24, width: 4, height: i % 5 ? 22 : 40, background: EL.ink, transformOrigin: "2px 240px", transform: `rotate(${-80 + i * 8}deg)` }} />)}
        <div style={{ position: "absolute", left: 266, top: 70, width: 8, height: 210, background: EL.red, borderRadius: 4, transformOrigin: "4px 210px", transform: `rotate(${needle}deg)`, boxShadow: "0 2px 6px rgba(0,0,0,0.4)" }} />
        <div style={{ position: "absolute", left: 250, top: 262, width: 40, height: 40, borderRadius: 20, background: EL.navy }} />
        <div style={{ position: "absolute", bottom: 90, width: "100%", textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 34, color: EL.inkSoft, textTransform: "uppercase" }}>{scaleLabel}</div>
      </div>
      <div style={{ position: "absolute", left: 1330, top: 860 }}><Stamp text={tag} at={110} size={64} color={EL.red} rot={-6} style={{ background: "rgba(255,255,255,0.92)", mixBlendMode: "normal" }} /></div>
      <Particles n={10} seed={8} color="rgba(255,255,255,0.35)" size={[30, 60]} rise={0.8} blur={3} />
    </AbsoluteFill>
  );
};

const Skillet: React.FC<{ x: number; label: string; good: boolean; f: number }> = ({ x, label, good, f }) => {
  const k = interpolate(f, [20, 150], [0, 1], ease);
  const puddle = good ? 0 : interpolate(f, [30, 140], [0, 1], ease);
  return (
    <div style={{ position: "absolute", left: x, top: 210, width: 760, height: 760 }}>
      <div style={{ position: "absolute", left: 700, top: 330, width: 300, height: 90, borderRadius: 30, background: "linear-gradient(#2a2a2a, #111)", boxShadow: "0 16px 30px rgba(0,0,0,0.5)" }} />
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 45% 40%, #3a3a3a, #161616 70%, #0b0b0b)", boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 0 0 26px #1c1c1c, inset 0 0 0 30px #2c2c2c" }} />
      {!good ? <div style={{ position: "absolute", left: 120, top: 120, width: 520, height: 520, borderRadius: "48% 52% 50% 50%", background: `radial-gradient(circle, rgba(236,232,220,${0.75 * puddle}), rgba(220,214,200,${0.45 * puddle}) 70%, transparent 72%)`, transform: `scale(${0.6 + puddle * 0.4})` }} /> : null}
      {[[230, 230, -20], [380, 300, 30], [260, 430, 160]].map(([sx, sy, rot], i) => (
        <div key={i} style={{ position: "absolute", left: sx, top: sy, transform: `rotate(${rot + Math.sin((f + i * 9) / (good ? 3 : 9)) * (good ? 2 : 0.6)}deg) scale(${good ? 1 : 1 - k * 0.18})` }}>
          <Shrimp w={190} cook={k} brown={good ? k * 0.7 : 0} gloss={good ? 0.15 : 0.6} />
        </div>
      ))}
      {good ? Array.from({ length: 22 }).map((_, i) => { const r = (o: number) => rnd(i * 7 + o); const t = (f + r(1) * 40) % 18; return <div key={i} style={{ position: "absolute", left: 150 + r(2) * 460, top: 150 + r(3) * 460, width: 8 + t, height: 8 + t, borderRadius: "50%", border: `2px solid rgba(255,220,150,${0.7 - t / 26})` }} />; }) : null}
      <div style={{ position: "absolute", top: -96, width: "100%", textAlign: "center" }}><Tape text={label} rot={good ? -3 : 2} size={52} color={good ? EL.green : EL.red} /></div>
    </div>
  );
};

export const ElPanDuel: React.FC<{ bed?: string; left?: string; right?: string; meter?: string; seed?: number }> = ({ bed, left = "untreated", right = "soaked", meter = "sizzle" }) => {
  const f = useCurrentFrame();
  const meterG = interpolate(f, [20, 70], [0, 0.92], ease) + Math.sin(f / 2) * 0.03;
  const meterB = interpolate(f, [20, 70], [0, 0.22], ease) + Math.sin(f / 5) * 0.02;
  const steam = (x: number, strong: boolean) => Array.from({ length: strong ? 9 : 4 }).map((_, i) => {
    const r = (o: number) => rnd(i * 17 + x + o); const t = ((f * (strong ? 1.6 : 0.8) + r(1) * 120) % 120) / 120;
    return <div key={i} style={{ position: "absolute", left: x + 160 + r(2) * 420 + Math.sin(f / 14 + i) * 30, top: 820 - t * 700, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle, rgba(255,255,255,${(strong ? 0.22 : 0.12) * (1 - t)}), transparent 70%)`, filter: "blur(10px)" }} />;
  });
  return (
    <AbsoluteFill>
      <ElBed src={bed} seed={4} dim={0.6} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0.0), rgba(0,0,0,0.55))" }} />
      <Skillet x={120} label={left} good f={f} />
      <Skillet x={1040} label={right} good={false} f={f} />
      {steam(120, true)}{steam(1040, false)}
      {[[480, meterG, EL.green], [1400, meterB, EL.red]].map(([x, v, c], i) => (
        <div key={i} style={{ position: "absolute", left: (x as number) - 210, top: 1000, width: 420 }}>
          <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 26, color: EL.white, textTransform: "uppercase", letterSpacing: 3, marginBottom: 6 }}>{meter}</div>
          <div style={{ height: 18, borderRadius: 9, background: "rgba(255,255,255,0.2)" }}><div style={{ height: 18, width: `${Math.max(0, Math.min(1, v as number)) * 100}%`, borderRadius: 9, background: c as string }} /></div>
        </div>
      ))}
    </AbsoluteFill>
  );
};

const Icon: React.FC<{ k: string }> = ({ k }) => {
  const s = { stroke: EL.navy, strokeWidth: 6, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (k === "net") return <svg width={90} height={90} viewBox="0 0 90 90"><path d="M10 15 L80 15 L60 80 L30 80 Z" {...s} /><path d="M22 35 L68 35 M27 55 L63 55 M35 15 L40 80 M55 15 L50 80" {...s} strokeWidth={3} /></svg>;
  if (k === "table") return <svg width={90} height={90} viewBox="0 0 90 90"><path d="M8 35 L82 35 L82 45 L8 45 Z M18 45 L18 80 M72 45 L72 80" {...s} /><circle cx={30} cy={28} r={6} {...s} /><circle cx={50} cy={26} r={6} {...s} /><circle cx={64} cy={29} r={5} {...s} /></svg>;
  if (k === "ice") return <svg width={90} height={90} viewBox="0 0 90 90"><path d="M45 8 L45 82 M13 26 L77 64 M13 64 L77 26" {...s} /><path d="M37 14 L45 22 L53 14 M37 76 L45 68 L53 76" {...s} strokeWidth={4} /></svg>;
  return <svg width={90} height={90} viewBox="0 0 90 90"><path d="M12 45 L45 14 L78 45 M22 38 L22 80 L68 80 L68 38" {...s} /><path d="M38 80 L38 58 L52 58 L52 80" {...s} /></svg>;
};

export const ElColdChain: React.FC<{ stops: { label: string; sub?: string; icon: "net" | "table" | "ice" | "home" }[]; title?: string; stamp?: string; every?: number }> = ({ stops, title = "how we kept shrimp on the boat", stamp = "no soak", every = 34 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const pts = stops.map((_, i) => [240 + i * (1440 / Math.max(1, stops.length - 1)), i % 2 ? 640 : 470]);
  const total = stops.length * every;
  const draw = interpolate(f, [8, 8 + total], [0, 1], ease);
  const d = pts.map(([x, y], i) => (i ? `S ${x - 160} ${y + (i % 2 ? -120 : 120)} ${x} ${y}` : `M ${x} ${y}`)).join(" ");
  return (
    <AbsoluteFill style={{ background: "#E9DFC6" }}>
      {/* carta náutica: capa de fondo con curvas de profundidad y leve paralaje */}
      <AbsoluteFill style={{ transform: `translateX(${-f * 0.25}px) scale(1.05)`, opacity: 0.55 }}>
        <svg width={2100} height={1080}>
          {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M -50 ${120 + i * 70} C 400 ${60 + i * 70}, 900 ${200 + i * 66}, 2150 ${110 + i * 72}`} stroke="#9fb7bf" strokeWidth={2} fill="none" />)}
          {Array.from({ length: 40 }).map((_, i) => <text key={i} x={rnd(i + 3) * 2000} y={rnd(i + 9) * 1050} fontFamily={LABEL} fontSize={22} fill="#7c949c">{Math.round(4 + rnd(i) * 30)}</text>)}
        </svg>
      </AbsoluteFill>
      <div style={{ position: "absolute", top: 50, width: "100%", textAlign: "center", fontFamily: STENCIL, fontSize: 56, color: EL.navy, textTransform: "uppercase" }}>{title}</div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <path d={d} stroke={EL.navy} strokeWidth={8} strokeDasharray="22 18" fill="none" pathLength={1} style={{ strokeDasharray: `${draw} 1` }} />
      </svg>
      {stops.map((s, i) => {
        const at = 8 + i * every; const k = spring({ frame: f - at, fps, config: { damping: 13, stiffness: 130 } });
        const [x, y] = pts[i];
        return (
          <div key={i} style={{ position: "absolute", left: x - 170, top: y + (i % 2 ? 60 : -330), width: 340, transform: `scale(${k}) rotate(${i % 2 ? 2 : -2}deg)`, background: "#FBF8EF", borderRadius: 18, padding: "22px 20px", boxShadow: "0 24px 40px rgba(19,40,66,0.35)", textAlign: "center", opacity: k }}>
            <Icon k={s.icon} />
            <div style={{ fontFamily: MARKER, fontSize: 40, color: EL.marker, lineHeight: 1.05, marginTop: 6 }}>{s.label}</div>
            {s.sub ? <div style={{ fontFamily: LABEL, fontSize: 26, color: EL.inkSoft, marginTop: 6, textTransform: "uppercase", letterSpacing: 1 }}>{s.sub}</div> : null}
          </div>
        );
      })}
      {pts.map(([x, y], i) => <div key={i} style={{ position: "absolute", left: x - 20, top: y - 20, width: 40, height: 40, borderRadius: 20, background: EL.buoy, border: "6px solid #fff", boxShadow: "0 4px 10px rgba(0,0,0,0.3)", transform: `scale(${interpolate(f, [8 + i * every - 4, 8 + i * every + 4], [0, 1], ease)})` }} />)}
      <div style={{ position: "absolute", left: 110, bottom: 90 }}><Stamp text={stamp} at={8 + total} size={78} color={EL.red} rot={-8} /></div>
      <Particles n={14} seed={21} color="rgba(255,255,255,0.8)" size={[10, 26]} rise={0.6} blur={1} />
    </AbsoluteFill>
  );
};

// ElCurlRule — la regla de la C y la O: el mismo camarón se va curvando (recto → C → O) sobre la tabla de cortar,
// con la cocción de color; sellos "done" en la C y "too far" en la O.
const CurlShrimp: React.FC<{ curl: number; cook: number; size: number }> = ({ curl, cook, size }) => {
  const segs = 26; const arc = 25 + curl * 300; const R = size * 0.32;
  const c0 = [190, 168, 160], c1 = [242, 130, 86];
  const col = (k: number) => `rgb(${c0.map((v, i) => Math.round(v + (c1[i] - v) * cook * (0.85 + 0.15 * k))).join(",")})`;
  return (
    <svg width={size} height={size} viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}>
      {Array.from({ length: segs }).map((_, i) => {
        const t = i / (segs - 1); const a = ((-arc / 2 + t * arc) - 90) * Math.PI / 180;
        const flat = curl < 0.08; const x = flat ? (t - 0.5) * size * 0.75 : Math.cos(a) * R, y = flat ? 0 : Math.sin(a) * R + R * 0.25;
        const w = size * (0.17 - t * 0.11);
        return <ellipse key={i} cx={x} cy={y} rx={w * 0.75} ry={w * 0.62} fill={col(t)} stroke={i % 3 === 0 ? "rgba(90,42,20,0.35)" : "none"} strokeWidth={3} transform={`rotate(${flat ? 90 : (a * 180) / Math.PI + 90} ${x} ${y})`} />;
      })}
    </svg>
  );
};
export const ElCurlRule: React.FC<{ bed?: string; title?: string; cLabel?: string; oLabel?: string; rawLabel?: string }> = ({ bed, title = "watch the shape", rawLabel = "raw", cLabel = "C = cooked", oLabel = "O = overcooked" }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const k1 = interpolate(f, [20, 70], [0, 1], ease), k2 = interpolate(f, [90, 140], [0, 1], ease);
  const panel = (x: number, at: number, curl: number, cook: number, label: string, color: string) => {
    const s = spring({ frame: f - at, fps, config: { damping: 14 } });
    return (
      <div style={{ position: "absolute", left: x, top: 250, width: 500, height: 620, transform: `scale(${s})`, opacity: s }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: 30, background: "rgba(255,255,255,0.93)", boxShadow: "0 30px 60px rgba(0,0,0,0.45)" }} />
        <div style={{ position: "absolute", left: 50, top: 40 }}><CurlShrimp curl={curl} cook={cook} size={400} /></div>
        <div style={{ position: "absolute", bottom: 46, width: "100%", textAlign: "center", fontFamily: MARKER, fontSize: 56, color }}>{label}</div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <ElBed src={bed} seed={19} dim={0.55} />
      <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", fontFamily: STENCIL, fontSize: 62, color: EL.white, textTransform: "uppercase", textShadow: "0 4px 14px rgba(0,0,0,0.6)" }}>{title}</div>
      {panel(140, 4, 0, 0, rawLabel, EL.inkSoft)}
      {panel(710, 20, 0.08 + k1 * 0.45, k1, cLabel, EL.green)}
      {panel(1280, 90, 0.53 + k2 * 0.42, 1, oLabel, EL.red)}
      <div style={{ position: "absolute", left: 980, top: 200 }}><Stamp text="done" at={72} size={58} color={EL.green} rot={-8} style={{ background: "rgba(255,255,255,0.95)", mixBlendMode: "normal" }} /></div>
      <div style={{ position: "absolute", left: 1540, top: 200 }}><Stamp text="too far" at={142} size={58} color={EL.red} rot={7} style={{ background: "rgba(255,255,255,0.95)", mixBlendMode: "normal" }} /></div>
      <Particles n={8} seed={33} color="rgba(255,255,255,0.4)" size={[30, 70]} rise={0.9} blur={4} />
    </AbsoluteFill>
  );
};
