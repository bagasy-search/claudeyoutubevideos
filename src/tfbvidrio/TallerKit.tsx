// TallerKit.tsx — set-pieces del Constructor Libre para tfbvidrio (vidrio doble empañado).
// Cada componente recibe `h` = tiempos por frase (segundos desde el inicio del cue, calculados contra el mapa de
// palabras) y `durF`. Todo texto llega por props o es contenido fijo del tema (en español).
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { T, FD, FL, FB, CL, ramp, rgba, rnd, useSpr, Bed, Ficha, Kick, Words, HandCircle, HandLine, Sello, TapeMeasure, Motes } from "./Taller";

type H = Record<string, number>;
const useF = () => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return { f, fps, s: (sec?: number) => Math.round((sec ?? 0) * fps) }; };
const Center: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", ...style }}>{children}</AbsoluteFill>;
const cam = (f: number, durF: number, push = 0.05) => `scale(${(1 + push * ramp(f, 0, Math.max(30, durF))).toFixed(4)}) translate(${(Math.sin(f / 70) * 6).toFixed(1)}px, ${(Math.cos(f / 90) * 4).toFixed(1)}px)`;

// 1 · GOLPE — zoom-punch + palabras que caen + círculo a mano
export const Golpe: React.FC<{ words: string; sub?: string; img: string; durF: number }> = ({ words, sub, img, durF }) => {
  const { f, fps } = useF();
  const punch = 1.28 - 0.28 * spring({ frame: f, fps, config: { damping: 11, mass: 0.6 } });
  const flash = 1 - ramp(f, 0, 7);
  const ws = words.split(/\s+/);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: T.wood2 }}>
      <AbsoluteFill style={{ transform: `scale(${(punch + 0.06 * ramp(f, 0, durF)).toFixed(4)})` }}>
        <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.9) sepia(0.12)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `radial-gradient(70% 60% at 50% 50%, transparent 30%, ${rgba("#140A04", 0.62)} 100%)` }} />
      <Center>
        <div style={{ position: "absolute", opacity: 0.95 }}><HandCircle u={ramp(f, 10, 30)} w={1250} h={640} stroke={14} /></div>
        <div style={{ display: "flex", gap: 36 }}>
          {ws.map((w, i) => {
            const k = spring({ frame: f - 4 - i * 6, fps, config: { damping: 9, mass: 0.55, stiffness: 170 } });
            return <div key={i} style={{ fontFamily: FD, fontWeight: 900, fontSize: 190, color: T.paper, letterSpacing: 2, textShadow: `0 10px 40px ${rgba("#140A04", 0.9)}, 0 3px 0 ${T.oxido}`, transform: `scale(${(2.2 - 1.2 * k).toFixed(3)})`, opacity: Math.min(1, k * 2) }}>{w}</div>;
          })}
        </div>
        {sub ? <div style={{ position: "absolute", top: "70%", fontFamily: FL, fontWeight: 600, fontSize: 44, letterSpacing: 6, textTransform: "uppercase", color: T.paper, background: T.oxido, padding: "8px 26px", opacity: ramp(f, 20, 30), transform: "rotate(-1.5deg)" }}>{sub}</div> : null}
      </Center>
      <AbsoluteFill style={{ background: "#FFF6E0", opacity: flash * 0.7 }} />
      <Motes />
    </AbsoluteFill>
  );
};

// 2 · TACHADO — lo que NO hace falta cambiar, tachado uno por uno
export const Tachado: React.FC<{ kicker: string; items: string[]; img: string; durF: number }> = ({ kicker, items, img, durF }) => {
  const { f } = useF();
  const step = Math.max(10, Math.floor((durF - 30) / (items.length + 1)));
  return (
    <AbsoluteFill>
      <Bed img={img} dim={0.45} />
      <Center style={{ transform: cam(f, durF) }}>
        <Ficha w={1080} rot={-1.5}>
          <Kick text={kicker} delay={4} size={34} />
          <div style={{ marginTop: 24 }}>
            {items.map((it, i) => {
              const d = 12 + i * step; const u = ramp(f, d + 8, d + 18);
              return (
                <div key={i} style={{ position: "relative", display: "flex", alignItems: "center", gap: 26, margin: "12px 0", opacity: ramp(f, d - 6, d) }}>
                  <div style={{ fontFamily: FL, fontSize: 40, color: T.oro, width: 50 }}>{String(i + 1).padStart(2, "0")}</div>
                  <div style={{ position: "relative", fontFamily: FD, fontWeight: 700, fontSize: 76, color: u > 0.5 ? T.inkSoft : T.ink }}>
                    {it}
                    <svg style={{ position: "absolute", left: -10, top: "52%", width: "106%", height: 20, overflow: "visible" }} viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 6 C 30 2, 70 9, 100 4" stroke={T.oxido} strokeWidth={8} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - u} vectorEffect="non-scaling-stroke" />
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ position: "absolute", right: 60, bottom: 50 }}><Sello text="Sólo el sello" delay={12 + items.length * step} color={T.oro} size={46} /></div>
        </Ficha>
      </Center>
    </AbsoluteFill>
  );
};

// 3 · CAPÍTULO — cinta métrica que se despliega + número grande + título
export const Capitulo: React.FC<{ index: string; kicker: string; title: string; img: string; durF: number }> = ({ index, kicker, title, img, durF }) => {
  const { f } = useF();
  return (
    <AbsoluteFill>
      <Bed img={img} dim={0.55} />
      <div style={{ position: "absolute", left: 0, top: 170, transform: "rotate(-2deg)" }}><TapeMeasure u={ramp(f, 0, 22)} width={2000} height={70} /></div>
      <div style={{ position: "absolute", left: 150, top: 300, transform: cam(f, durF, 0.03) }}>
        <div style={{ fontFamily: FD, fontWeight: 900, fontSize: 300, lineHeight: 0.9, color: T.oroSoft, opacity: ramp(f, 6, 16), textShadow: `0 12px 40px ${rgba("#140A04", 0.7)}` }}>{index}</div>
        <div style={{ marginTop: 20 }}><Kick text={kicker} delay={12} color={T.paper} size={36} /></div>
        <div style={{ marginTop: 14 }}><Words text={title} delay={16} size={120} color={T.paper} /></div>
      </div>
    </AbsoluteFill>
  );
};

// iconos SVG de ventana con trapo (prueba del trapo)
const WinIcon: React.FC<{ fog: number; side: "in" | "out" | "none"; f: number }> = ({ fog, side, f }) => {
  const wipe = Math.sin(f / 9) * 30;
  return (
    <svg width={300} height={230} viewBox="0 0 300 230">
      <rect x="20" y="10" width="260" height="210" rx="6" fill="#DCE7E6" stroke={T.ink2} strokeWidth="10" />
      <line x1="150" y1="10" x2="150" y2="220" stroke={T.ink2} strokeWidth="8" />
      <rect x="30" y="20" width="240" height="190" fill="#FFFFFF" opacity={0.75 * fog} />
      {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={40 + rnd(i * 7) * 220} cy={30 + rnd(i * 3 + 1) * 170} r={3 + rnd(i) * 4} fill="#FFFFFF" opacity={0.9 * fog} />)}
      <g transform={`translate(${150 + (side === "none" ? wipe * 1.4 : wipe)}, 115)`}>
        <rect x="-40" y="-30" width="80" height="60" rx="16" fill={side === "out" ? T.oroSoft : "#F5EFE2"} stroke={T.ink2} strokeWidth="4" />
      </g>
    </svg>
  );
};
// 4 · TRAPO — tres resultados; focus = cuántos se revelaron (0..2)
export const Trapo: React.FC<{ focus: number; durF: number }> = ({ focus, durF }) => {
  const { f } = useF();
  const cols = [
    { k: "Se va por dentro", t: "Humedad de la casa", s: "se arregla ventilando", fog: 0.2, side: "in" as const, stamp: "Ventilar", c: T.ok },
    { k: "Se va por fuera", t: "Normal", s: "hasta aísla bien", fog: 0.25, side: "out" as const, stamp: "Tranquilo", c: T.oro },
    { k: "No se va con nada", t: "Sello roto", s: "la niebla está entre los vidrios", fog: 0.95, side: "none" as const, stamp: "Sello roto", c: T.oxido },
  ];
  return (
    <AbsoluteFill>
      <Bed dim={0.2} />
      <div style={{ position: "absolute", top: 70, width: "100%" }}><Kick text="La prueba del trapo" center size={40} color={T.paper} /></div>
      <Center style={{ transform: cam(f, durF, 0.03), top: 60 }}>
        <div style={{ display: "flex", gap: 44, alignItems: "flex-start" }}>
          {cols.map((c, i) => {
            const on = i <= focus; const isF = i === focus;
            return (
              <div key={i} style={{ opacity: on ? (isF ? 1 : 0.55) : 0.18, transform: `scale(${isF ? 1.06 : 0.94}) translateY(${isF ? -10 : 10}px)`, filter: on ? undefined : "grayscale(1)" }}>
                <Ficha w={520} h={640} rot={i === 1 ? 1 : -1.2} delay={isF ? 0 : -30} pad={36}>
                  <div style={{ fontFamily: FL, fontSize: 30, letterSpacing: 3, color: T.inkSoft, textTransform: "uppercase" }}>{`${i + 1} · ${c.k}`}</div>
                  <div style={{ margin: "18px auto 8px", width: 300 }}><WinIcon fog={isF ? interpolate(f, [0, 40], [0.95, c.fog], CL) : c.fog} side={c.side} f={isF ? f : 0} /></div>
                  <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 60, color: c.c, lineHeight: 1 }}>{on ? c.t : "?"}</div>
                  <div style={{ fontFamily: FB, fontSize: 36, color: T.ink2, marginTop: 10 }}>{on ? c.s : ""}</div>
                  {isF ? <div style={{ position: "absolute", right: 30, bottom: 34 }}><Sello text={c.stamp} delay={24} color={c.c} size={40} /></div> : null}
                </Ficha>
              </div>
            );
          })}
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// 5 · SEÑALES — polaroids que caen en su frase, con círculo a mano
const Polaroid: React.FC<{ img: string; cap: string; delay: number; rot: number; w?: number; circle?: boolean }> = ({ img, cap, delay, rot, w = 500, circle = true }) => {
  const { f } = useF(); const k = useSpr(delay, 11, 0.6);
  if (f < delay - 1) return <div style={{ width: w }} />;
  return (
    <div style={{ width: w, padding: "18px 18px 70px", background: "#FBF6EA", boxShadow: `0 26px 50px ${rgba("#140A04", 0.55)}`, transform: `translateY(${((1 - k) * -260).toFixed(1)}px) rotate(${(rot + (1 - k) * 12).toFixed(2)}deg)`, opacity: Math.min(1, k * 2), position: "relative" }}>
      <div style={{ width: "100%", height: w * 0.62, overflow: "hidden", position: "relative" }}>
        <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${(1.05 + 0.05 * ramp(f, delay, delay + 150)).toFixed(3)})` }} />
        {circle ? <div style={{ position: "absolute", left: "12%", top: "10%" }}><HandCircle u={ramp(f, delay + 14, delay + 30)} w={w * 0.72} h={w * 0.45} stroke={7} /></div> : null}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 14, textAlign: "center", fontFamily: FB, fontStyle: "italic", fontWeight: 700, fontSize: 38, color: T.ink }}>{cap}</div>
    </div>
  );
};
export const Senales: React.FC<{ kicker: string; items: { t: string; img: string }[]; h: H; durF: number }> = ({ kicker, items, h, durF }) => {
  const { f, s } = useF();
  const at = [Math.min(s(h.hit1 ?? 0.3), 12), s(h.hit2 ?? 3), s(h.hit3 ?? 6)];
  return (
    <AbsoluteFill>
      <Bed img={items[0]?.img} dim={0.55} blur={14} />
      <div style={{ position: "absolute", top: 80, width: "100%" }}><Kick text={kicker} center size={42} color={T.paper} /></div>
      <Center style={{ transform: cam(f, durF, 0.04), top: 50 }}>
        <div style={{ display: "flex", gap: 40 }}>
          {items.map((it, i) => <Polaroid key={i} img={it.img} cap={it.t} delay={at[i] ?? 0} rot={[-4, 2.5, -2][i] ?? 0} w={530} />)}
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// 6 · OPCIONES — 4 fichas numeradas; la del foco se levanta
const OPC = [
  { t: "Vivir con eso", s: "se ve mal y aísla menos" },
  { t: "Kit para desempañar", s: "quita niebla… con trampa" },
  { t: "Cambiar sólo el vidrio doble", s: "el arreglo que nadie cuenta" },
  { t: "Revisar la garantía", s: "en realidad va primero" },
];
export const Opciones: React.FC<{ focus: number; durF: number }> = ({ focus, durF }) => {
  const { f } = useF();
  return (
    <AbsoluteFill>
      <Bed dim={0.2} />
      <div style={{ position: "absolute", top: 90, width: "100%" }}><Kick text="Cuatro opciones reales" center size={42} color={T.paper} /></div>
      <Center style={{ transform: cam(f, durF, 0.03), top: 40 }}>
        <div style={{ display: "flex", gap: 30, alignItems: "center" }}>
          {OPC.map((o, i) => {
            const isF = i === focus; const past = i < focus;
            const k = isF ? useSprSafe(f, 0) : 1;
            return (
              <div key={i} style={{ transform: `translateY(${isF ? -40 * k : 30}px) scale(${isF ? 1 + 0.12 * k : 0.9}) rotate(${(i - 1.5) * 2}deg)`, opacity: isF ? 1 : past ? 0.7 : 0.35, zIndex: isF ? 2 : 1 }}>
                <Ficha w={400} h={520} rot={0} delay={-40} pad={34} tape={isF}>
                  <div style={{ fontFamily: FD, fontWeight: 900, fontSize: 150, lineHeight: 1, color: isF ? (i === 2 ? T.oro : T.oxido) : T.inkSoft }}>{i + 1}</div>
                  <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 54, lineHeight: 1.05, color: T.ink, marginTop: 20 }}>{o.t}</div>
                  <div style={{ fontFamily: FB, fontStyle: "italic", fontSize: 34, color: T.ink2, marginTop: 14, opacity: isF ? ramp(f, 10, 20) : 0.8 }}>{o.s}</div>
                  {isF && i === 2 ? <div style={{ position: "absolute", bottom: 30, right: 20 }}><Sello text="El arreglo" delay={20} color={T.oro} size={38} /></div> : null}
                </Ficha>
              </div>
            );
          })}
        </div>
      </Center>
    </AbsoluteFill>
  );
};
const useSprSafe = (f: number, d: number) => Math.min(1, Math.max(0, 1 - Math.exp(-(f - d) / 6) * Math.cos((f - d) / 5)));

// 7 · CINTA — etiquetas de cinta de papel que se pegan una por una
export const Cinta: React.FC<{ kicker: string; items: string[]; img: string; durF: number }> = ({ kicker, items, img, durF }) => {
  const { f } = useF();
  const step = Math.max(8, Math.floor((durF - 24) / (items.length + 0.5)));
  return (
    <AbsoluteFill>
      <Bed img={img} dim={0.5} blur={6} />
      <div style={{ position: "absolute", top: 110, width: "100%" }}><Kick text={kicker} center size={44} color={T.paper} /></div>
      <Center style={{ transform: cam(f, durF, 0.04), top: 40 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "40px 50px", width: 1500, justifyContent: "center" }}>
          {items.map((it, i) => {
            const d = 8 + i * step; const k = useSprSafe(f, d);
            if (f < d) return <div key={i} style={{ width: 0 }} />;
            return (
              <div key={i} style={{ padding: "26px 50px", background: rgba("#EFE3BE", 0.96), fontFamily: FL, fontWeight: 700, fontSize: 70, letterSpacing: 3, textTransform: "uppercase", color: T.ink,
                transform: `rotate(${((rnd(i * 5) - 0.5) * 8).toFixed(1)}deg) scale(${(1.6 - 0.6 * k).toFixed(3)})`, opacity: Math.min(1, k * 2), boxShadow: `0 16px 30px ${rgba("#140A04", 0.5)}`,
                borderLeft: `6px dotted ${rgba("#FFFFFF", 0.5)}`, borderRight: `6px dotted ${rgba("#FFFFFF", 0.5)}` }}>{it}</div>
            );
          })}
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// 8 · CORTE — sección del vidrio doble (focus 0 = partes · focus 1 = el sello)
export const Corte: React.FC<{ focus: number; h: H; durF: number }> = ({ focus, h, durF }) => {
  const { f, s } = useF();
  const a1 = focus ? 0 : s(h.hit1 ?? 0.5), a2 = focus ? 0 : s(h.hit2 ?? 3), a3 = focus ? 0 : s(h.hit3 ?? 6);
  const seal = focus ? ramp(f, 6, 26) : 0;
  const pulse = focus ? 0.5 + 0.5 * Math.sin(f / 5) : 0;
  const lab = (txt: string, d: number, y: number, c = T.ink) => (
    <div style={{ position: "absolute", left: 1010, top: y, display: "flex", alignItems: "center", gap: 18, opacity: ramp(f, d, d + 10), transform: `translateX(${((1 - ramp(f, d, d + 12)) * 40).toFixed(1)}px)` }}>
      <div style={{ width: 150 * ramp(f, d, d + 12), height: 5, background: c }} />
      <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 60, color: c }}>{txt}</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Bed paper />
      <div style={{ position: "absolute", top: 70, left: 120 }}><Kick text={focus ? "Donde se rompe" : "Por dentro: un sándwich"} size={40} /></div>
      <AbsoluteFill style={{ transform: cam(f, durF, 0.04) }}>
        <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute" }}>
          <rect x="360" y="160" width="70" height="820" fill={T.glass} stroke={T.ink2} strokeWidth="6" opacity={ramp(f, a1, a1 + 10)} />
          <rect x="770" y="160" width="70" height="820" fill={T.glass} stroke={T.ink2} strokeWidth="6" opacity={ramp(f, a1 + 4, a1 + 14)} />
          <rect x="430" y="160" width="340" height="700" fill="#EAF3F2" opacity={0.6 * ramp(f, a1 + 8, a1 + 18)} />
          <g opacity={ramp(f, a2, a2 + 10)}>
            <rect x="440" y="860" width="320" height="90" fill="#B8BCC0" stroke={T.ink2} strokeWidth="6" />
            {Array.from({ length: 22 }).map((_, i) => <circle key={i} cx={462 + (i % 11) * 28} cy={890 + Math.floor(i / 11) * 30} r={11} fill="#F4F1E8" stroke={T.ink2} strokeWidth="2" opacity={ramp(f, a3 + i, a3 + i + 6)} />)}
          </g>
          <path d="M430 950 L 430 1000 L 770 1000 L 770 950" fill="none" stroke={focus ? T.oxido : "#1E1612"} strokeWidth={focus ? 26 + 8 * pulse : 22} strokeLinejoin="round" opacity={focus ? 1 : ramp(f, a3 + 20, a3 + 30)} pathLength={1} strokeDasharray={1} strokeDashoffset={focus ? 1 - seal : 0} />
        </svg>
        {lab("Dos vidrios", a1, 230)}
        {lab("Aire seco", a1 + 14, 440, T.ink2)}
        {lab("Separador", a2, 800)}
        {lab("Bolitas secantes", a3, 890, T.oro)}
        {focus ? lab("EL SELLO", 20, 960, T.oxido) : null}
        {focus ? <div style={{ position: "absolute", left: 1150, top: 250 }}><Sello text="Aquí se rompe" delay={34} size={64} /></div> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 9 · CICLO — sol calienta y empuja / noche enfría y tira; contador que sube
export const Ciclo: React.FC<{ h: H; durF: number }> = ({ h, durF }) => {
  const { f, s } = useF();
  const nightAt = s(h.night ?? 3);
  const night = ramp(f, nightAt - 6, nightAt + 10);
  const cycles = f < nightAt ? 0 : Math.floor((f - nightAt) / 9);
  const bulge = f < nightAt ? 40 * ramp(f, 4, 30) : 40 * Math.cos((f - nightAt) / 9 * Math.PI);
  const count = Math.min(3000, Math.round(Math.pow(Math.max(0, f - nightAt) / Math.max(1, durF - nightAt), 2.2) * 3000));
  const sky = `linear-gradient(180deg, ${night > 0.5 ? T.night : "#E9B869"} 0%, ${night > 0.5 ? "#1C2430" : T.paper} 100%)`;
  return (
    <AbsoluteFill style={{ background: sky }}>
      <Motes />
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", transform: cam(f, durF, 0.03) }}>
        <g opacity={1 - night}><circle cx="300" cy="260" r={110 + 6 * Math.sin(f / 6)} fill="#F6C453" />{Array.from({ length: 12 }).map((_, i) => <line key={i} x1={300 + Math.cos(i / 12 * 6.28) * 140} y1={260 + Math.sin(i / 12 * 6.28) * 140} x2={300 + Math.cos(i / 12 * 6.28) * 190} y2={260 + Math.sin(i / 12 * 6.28) * 190} stroke="#F6C453" strokeWidth="12" strokeLinecap="round" />)}</g>
        <g opacity={night}><circle cx="300" cy="260" r="100" fill="#E8E4D6" /><circle cx="345" cy="230" r="90" fill={T.night} /></g>
        <path d={`M760 180 Q ${760 - bulge} 540 760 900`} fill="none" stroke={T.ink2} strokeWidth="26" />
        <path d={`M1160 180 Q ${1160 + bulge} 540 1160 900`} fill="none" stroke={T.ink2} strokeWidth="26" />
        <path d={`M760 180 Q ${760 - bulge} 540 760 900 L 1160 900 Q ${1160 + bulge} 540 1160 180 Z`} fill={night > 0.5 ? "#9FB3C4" : "#F3E3BD"} opacity="0.5" />
        <rect x="740" y="900" width="440" height="60" fill={T.ink} />
        <rect x="740" y="120" width="440" height="60" fill={T.ink} />
      </svg>
      <div style={{ position: "absolute", left: 1320, top: 360 }}>
        <div style={{ fontFamily: FL, fontSize: 44, letterSpacing: 5, color: night > 0.5 ? T.paper : T.ink, textTransform: "uppercase" }}>{night > 0.5 ? "Noche: tira" : "Sol: empuja"}</div>
        <div style={{ fontFamily: FD, fontWeight: 900, fontSize: 170, color: night > 0.5 ? T.oroSoft : T.oxido, lineHeight: 1 }}>{count.toLocaleString("es")}</div>
        <div style={{ fontFamily: FB, fontStyle: "italic", fontSize: 44, color: night > 0.5 ? T.paper : T.ink2 }}>{cycles > 0 ? "días y noches" : "cada día"}</div>
      </div>
    </AbsoluteFill>
  );
};

// 10 · CIFRA — número grande que cuenta + rótulo
export const Cifra: React.FC<{ value: number; kicker: string; label: string; img: string; durF: number }> = ({ value, kicker, label, img, durF }) => {
  const { f } = useF();
  const v = Math.round(value * Math.pow(ramp(f, 4, Math.min(40, durF * 0.6)), 0.6));
  return (
    <AbsoluteFill>
      <Bed img={img} dim={0.5} />
      <Center style={{ transform: cam(f, durF, 0.05) }}>
        <Kick text={kicker} center size={44} color={T.paper} delay={2} />
        <div style={{ fontFamily: FD, fontWeight: 900, fontSize: 330, lineHeight: 1, color: T.paper, textShadow: `0 14px 50px ${rgba("#140A04", 0.8)}` }}>{v.toLocaleString("es")}</div>
        <div style={{ width: 900, marginTop: -10 }}><TapeMeasure u={ramp(f, 10, 30)} width={900} height={46} /></div>
        <div style={{ marginTop: 26, fontFamily: FD, fontWeight: 700, fontSize: 70, color: T.oroSoft, opacity: ramp(f, 22, 32) }}>{label}</div>
      </Center>
    </AbsoluteFill>
  );
};

// 11 · NOTA — papel clavado con la frase + subrayado
export const Nota: React.FC<{ text: string; sub?: string; durF: number }> = ({ text, sub, durF }) => {
  const { f } = useF();
  return (
    <AbsoluteFill>
      <Bed dim={0.1} />
      <Center style={{ transform: cam(f, durF, 0.05) }}>
        <Ficha w={1350} rot={1.4} pad={80}>
          <div style={{ position: "absolute", left: 60, top: 40, width: 1230, height: "85%", backgroundImage: `repeating-linear-gradient(180deg, transparent 0 78px, ${rgba(T.oxido, 0.18)} 78px 80px)` }} />
          <Words text={text} delay={8} size={96} stagger={2} />
          {sub ? <div style={{ marginTop: 30, fontFamily: FB, fontStyle: "italic", fontSize: 50, color: T.oxido, opacity: ramp(f, 30, 42) }}>— {sub}</div> : null}
        </Ficha>
      </Center>
    </AbsoluteFill>
  );
};

// 12 · MITO — la creencia tachada con sello NO SIRVE → la verdad con check oro (2.5D)
export const Mito: React.FC<{ claim: string; truth: string; img: string; durF: number }> = ({ claim, truth, img, durF }) => {
  const { f, fps } = useF();
  const flip = Math.round(Math.min(durF * 0.45, 2.2 * fps));
  const kf = spring({ frame: f - flip, fps, config: { damping: 15, mass: 0.8 } });
  const tilt = Math.sin(f / 40) * 4;
  return (
    <AbsoluteFill>
      <Bed img={img} dim={0.45} />
      <Center style={{ perspective: 1800 }}>
        <div style={{ transform: `rotateY(${(tilt - 8 + 8 * kf).toFixed(2)}deg) rotateX(4deg)`, transformStyle: "preserve-3d" }}>
          <div style={{ transform: `translateX(${(-kf * 420).toFixed(1)}px) scale(${(1 - 0.25 * kf).toFixed(3)})`, opacity: 1 - 0.45 * kf }}>
            <Ficha w={900} rot={-2} pad={50}>
              <Kick text="Lo que se dice" size={30} />
              <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 84, color: T.ink, marginTop: 16, lineHeight: 1.05 }}>{claim}</div>
              <div style={{ position: "absolute", right: 40, bottom: 30 }}><Sello text="No sirve" delay={12} size={56} /></div>
            </Ficha>
          </div>
          {f >= flip ? (
            <div style={{ position: "absolute", left: 360, top: 170, transform: `translateY(${((1 - kf) * 200).toFixed(1)}px) rotate(1.5deg)`, opacity: Math.min(1, kf * 1.6) }}>
              <div style={{ width: 900, padding: "46px 56px", background: T.ink, borderRadius: 6, boxShadow: `0 30px 60px ${rgba("#140A04", 0.6)}`, borderTop: `8px solid ${T.oro}` }}>
                <div style={{ fontFamily: FL, fontSize: 32, letterSpacing: 5, color: T.oroSoft, textTransform: "uppercase" }}>✓ La verdad</div>
                <div style={{ marginTop: 14 }}><Words text={truth} delay={flip + 8} size={80} color={T.paper} stagger={2} /></div>
              </div>
            </div>
          ) : null}
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// 13 · FICHA DEL CASO — expediente con foto clipada, nombre, lugar y líneas
export const FichaCaso: React.FC<{ kicker: string; name: string; place: string; lines: string[]; img: string; durF: number }> = ({ kicker, name, place, lines, img, durF }) => {
  const { f } = useF();
  const step = Math.max(10, Math.floor((durF - 40) / (lines.length + 1)));
  return (
    <AbsoluteFill>
      <Bed img={img} dim={0.55} />
      <Center style={{ transform: cam(f, durF, 0.04) }}>
        <div style={{ display: "flex", gap: 60, alignItems: "center" }}>
          <Polaroid img={img} cap={place} delay={2} rot={-5} w={640} circle={false} />
          <Ficha w={880} rot={1.5} delay={8} pad={56}>
            <Kick text={kicker} delay={12} size={32} />
            <div style={{ fontFamily: FD, fontWeight: 900, fontSize: 110, color: T.ink, lineHeight: 1, marginTop: 14, opacity: ramp(f, 14, 24) }}>{name}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10, opacity: ramp(f, 18, 28) }}>
              <svg width="34" height="44" viewBox="0 0 34 44"><path d="M17 2 C 7 2 2 10 2 17 C 2 28 17 42 17 42 C 17 42 32 28 32 17 C 32 10 27 2 17 2 Z" fill={T.oxido} /><circle cx="17" cy="17" r="6" fill={T.paper} /></svg>
              <div style={{ fontFamily: FL, fontSize: 42, letterSpacing: 2, color: T.oxido, textTransform: "uppercase" }}>{place}</div>
            </div>
            <div style={{ marginTop: 26, borderTop: `3px solid ${T.oro}`, paddingTop: 16 }}>
              {lines.map((l, i) => <div key={i} style={{ fontFamily: FB, fontSize: 46, color: T.ink2, margin: "10px 0", opacity: ramp(f, 30 + i * step, 38 + i * step), transform: `translateX(${((1 - ramp(f, 30 + i * step, 40 + i * step)) * 30).toFixed(1)}px)` }}>— {l}</div>)}
            </div>
          </Ficha>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// 14 · CONTRAS — lista con ✗ óxido en su frase + polaroid
export const Contras: React.FC<{ kicker: string; items: string[]; img: string; h: H; durF: number }> = ({ kicker, items, img, h, durF }) => {
  const { f, s } = useF();
  const at = [4, s(h.hit1 ?? 2), s(h.hit2 ?? 4), s(h.hit3 ?? 6)];
  return (
    <AbsoluteFill>
      <Bed img={img} dim={0.5} />
      <Center style={{ transform: cam(f, durF, 0.04) }}>
        <div style={{ display: "flex", gap: 50, alignItems: "center" }}>
          <Polaroid img={img} cap="" delay={0} rot={-4} w={560} />
          <Ficha w={1000} rot={1} pad={54}>
            <Kick text={kicker} size={34} delay={4} />
            {items.map((it, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 26, marginTop: 22, opacity: ramp(f, at[i], at[i] + 8) }}>
                <div style={{ fontFamily: FL, fontWeight: 700, fontSize: 64, color: T.oxido, transform: `scale(${(1.8 - 0.8 * ramp(f, at[i], at[i] + 8)).toFixed(2)})` }}>✗</div>
                <div style={{ fontFamily: FD, fontWeight: 700, fontSize: 56, color: T.ink, lineHeight: 1.05 }}>{it}</div>
              </div>
            ))}
          </Ficha>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// 15 · LÁMINA — pantalla completa con zoom punto por punto (z1..z5 = segundos)
const ZONAS = [
  { x: 27, y: 38, z: 1.9 },   // corte (arriba izq)
  { x: 73, y: 38, z: 1.9 },   // prueba del trapo
  { x: 27, y: 75, z: 1.9 },   // 4 opciones
  { x: 73, y: 75, z: 1.9 },   // 3 errores
  { x: 50, y: 94, z: 1.75 },  // técnico (pie)
  { x: 50, y: 50, z: 1.0 },   // página entera
];
export const Lamina: React.FC<{ img: string; h: H; durF: number }> = ({ img, h, durF }) => {
  const { f, fps, s } = useF();
  const marks = [Math.round(1.2 * fps), s(h.z1), s(h.z2), s(h.z3), s(h.z4), s(h.z5)];
  let i = 0; for (let k = 0; k < marks.length; k++) if (f >= marks[k]) i = k;
  const prev = i === 0 ? { x: 50, y: 50, z: 1.0 } : ZONAS[i - 1];
  const cur = f < marks[0] ? { x: 50, y: 50, z: 1.0 } : ZONAS[i];
  const k = spring({ frame: f - (f < marks[0] ? 0 : marks[i]), fps, config: { damping: 20, mass: 1 } });
  const lerp = (a: number, b: number) => a + (b - a) * (f < marks[0] ? 0 : k);
  const z = lerp(prev.z, cur.z), x = lerp(prev.x, cur.x), y = lerp(prev.y, cur.y);
  const enter = ramp(f, 0, 14);
  // imagen 3:2 contenida en 16:9: alto 1080 → ancho 1620
  const W = 1620, Hh = 1080;
  const tx = (50 - x) / 100 * W * z, ty = (50 - y) / 100 * Hh * z;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(90% 90% at 50% 50%, ${T.paper2} 0%, ${T.wood} 100%)`, overflow: "hidden" }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: W, height: Hh, transform: `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${(z * (0.94 + 0.06 * enter)).toFixed(4)})`, boxShadow: `0 40px 90px ${rgba("#140A04", 0.6)}`, opacity: enter }}>
          <Img src={staticFile(img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", right: 60, top: 50, fontFamily: FL, fontSize: 30, letterSpacing: 4, color: T.paper, background: rgba(T.oxido, 0.9), padding: "8px 20px", opacity: ramp(f, marks[5] ?? durF, (marks[5] ?? durF) + 10) }}>PAUSA · SÁCALE UNA FOTO</div>
    </AbsoluteFill>
  );
};

// 16 · CTA — portada 2.5D + páginas reales en abanico + QR real grande + dominio legible
export const Cta: React.FC<{ variant: number; kicker: string; title: string; h: H; durF: number; lamina?: string }> = ({ variant, kicker, title, h, durF, lamina }) => {
  const { f, fps, s } = useF();
  const qrAt = s(h.qr ?? 1.5);
  const kq = spring({ frame: f - qrAt, fps, config: { damping: 14, mass: 0.7 } });
  const float = Math.sin(f / 30) * 10; const tilt = Math.sin(f / 50) * 5;
  const peeks = ["img/tfbvidrio/peek1.jpg", "img/tfbvidrio/peek3.jpg", "img/tfbvidrio/peek5.jpg", "img/tfbvidrio/peek7.jpg", variant === 2 ? "img/tfbvidrio/peek2.jpg" : "img/tfbvidrio/peek4.jpg", variant === 3 ? "img/tfbvidrio/peek6.jpg" : "img/tfbvidrio/peek8.jpg"];
  return (
    <AbsoluteFill>
      <Bed dim={0.05} />
      {variant === 1 && lamina ? <div style={{ position: "absolute", left: -60, top: 330, width: 620, transform: "rotate(-7deg)", opacity: 0.8, boxShadow: `0 20px 40px ${rgba("#140A04", 0.5)}` }}><Img src={staticFile(lamina)} style={{ width: "100%", display: "block" }} /></div> : null}
      <div style={{ position: "absolute", left: 80, top: 50, width: 1060, padding: "20px 30px", background: rgba("#1A0F08", 0.82), borderRadius: 6, zIndex: 3 }}>
        <Kick text={kicker} size={32} color={T.oroSoft} delay={2} />
        <div style={{ marginTop: 10 }}><Words text={title} size={72} color={T.paper} delay={6} stagger={2} /></div>
      </div>
      <div style={{ position: "absolute", left: 360, top: 250, width: 800, height: 700, perspective: 2000 }}>
        {peeks.map((p, i) => {
          const k = useSprSafe(f, 10 + i * 4); const ang = (i - 2.5) * 9;
          return <Img key={i} src={staticFile(p)} style={{ position: "absolute", left: 180, top: 40, width: 420, borderRadius: 4, boxShadow: `0 20px 40px ${rgba("#140A04", 0.5)}`, transformOrigin: "50% 120%", transform: `rotate(${(ang * Math.min(1, k)).toFixed(2)}deg) translateY(${((1 - Math.min(1, k)) * 80).toFixed(1)}px)`, opacity: Math.min(1, k * 2) }} />;
        })}
        <div style={{ position: "absolute", left: 170, top: 0, width: 460, transform: `translateY(${float.toFixed(1)}px) rotateY(${(-14 + tilt).toFixed(2)}deg) rotateX(5deg)`, transformStyle: "preserve-3d" }}>
          <Img src={staticFile("img/tfbvidrio/portada-coleccion.jpg")} style={{ width: "100%", borderRadius: 6, boxShadow: `30px 40px 70px ${rgba("#140A04", 0.7)}, inset 0 0 0 1px ${rgba("#FFFFFF", 0.2)}` }} />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${30 + (f % 120) / 2}%, ${rgba("#FFFFFF", 0.22)} ${38 + (f % 120) / 2}%, transparent ${46 + (f % 120) / 2}%)`, borderRadius: 6 }} />
        </div>
      </div>
      {f >= qrAt ? (
        <div style={{ position: "absolute", right: 130, top: 250, transform: `scale(${(0.6 + 0.4 * kq).toFixed(3)}) rotate(${((1 - kq) * 6).toFixed(2)}deg)`, opacity: Math.min(1, kq * 2), transformOrigin: "50% 50%" }}>
          <div style={{ background: "#FFFFFF", padding: 36, borderRadius: 14, boxShadow: `0 30px 70px ${rgba("#140A04", 0.65)}` }}>
            <Img src={staticFile("img/tfbvidrio/qr_tfbvidrio.png")} style={{ width: 520, height: 520, display: "block", imageRendering: "pixelated" }} />
          </div>
          <div style={{ marginTop: 22, textAlign: "center", fontFamily: FL, fontWeight: 700, fontSize: 58, letterSpacing: 1, color: T.paper, background: T.oxido, padding: "10px 16px", borderRadius: 6 }}>constructorlibre.com</div>
          <div style={{ marginTop: 12, textAlign: "center", fontFamily: FB, fontStyle: "italic", fontSize: 40, color: T.paper }}>En el televisor: apunta tu teléfono</div>
        </div>
      ) : null}
      <div style={{ position: "absolute", left: 80, bottom: 40, zIndex: 4, fontFamily: FL, fontSize: 34, letterSpacing: 3, color: T.paper, background: rgba("#1A0F08", 0.85), padding: "8px 20px", borderRadius: 4, opacity: ramp(f, 30, 40) }}>EN EL TELÉFONO: EL ENLACE ESTÁ EN LA DESCRIPCIÓN ↓</div>
    </AbsoluteFill>
  );
};

// 17 · MURO — fotos de resultados que caen sobre la mesa
export const Muro: React.FC<{ kicker: string; items: { img: string; cap: string }[]; durF: number }> = ({ kicker, items, durF }) => {
  const { f } = useF();
  const step = Math.max(8, Math.floor((durF - 20) / (items.length + 0.5)));
  const pos = [{ l: 120, t: 220, r: -6 }, { l: 560, t: 170, r: 4 }, { l: 1000, t: 250, r: -3 }, { l: 1400, t: 190, r: 5 }];
  return (
    <AbsoluteFill>
      <Bed dim={0.1} />
      <div style={{ position: "absolute", bottom: 90, width: "100%" }}><Kick text={kicker} center size={44} color={T.paper} delay={4} /></div>
      <AbsoluteFill style={{ transform: cam(f, durF, 0.05) }}>
        {items.map((it, i) => <div key={i} style={{ position: "absolute", left: pos[i % 4].l, top: pos[i % 4].t }}><Polaroid img={it.img} cap={it.cap} delay={4 + i * step} rot={pos[i % 4].r} w={470} circle={false} /></div>)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 18 · PASO — etiqueta PASO n/N sobre cinta métrica + título + foto en ficha
export const Paso: React.FC<{ step: number; total: number; title: string; sub: string; img: string; durF: number }> = ({ step, total, title, sub, img, durF }) => {
  const { f } = useF();
  return (
    <AbsoluteFill>
      <Bed img={img} dim={0.55} />
      <div style={{ position: "absolute", left: 0, bottom: 130, transform: "rotate(1.5deg)" }}><TapeMeasure u={ramp(f, 0, 20)} width={2000} height={60} /></div>
      <AbsoluteFill style={{ transform: cam(f, durF, 0.04) }}>
        <div style={{ position: "absolute", left: 140, top: 180 }}>
          <div style={{ display: "inline-block", fontFamily: FL, fontWeight: 700, fontSize: 56, letterSpacing: 6, color: T.paper, background: T.oxido, padding: "10px 28px", transform: `rotate(-2deg) scale(${(0.7 + 0.3 * useSprSafe(f, 2)).toFixed(3)})` }}>PASO {step} / {total}</div>
          <div style={{ marginTop: 30 }}><Words text={title} size={150} color={T.paper} delay={8} /></div>
          <div style={{ marginTop: 18, fontFamily: FB, fontStyle: "italic", fontSize: 56, color: T.oroSoft, opacity: ramp(f, 20, 30) }}>{sub}</div>
        </div>
        <div style={{ position: "absolute", right: 150, top: 200 }}><Polaroid img={img} cap="" delay={6} rot={4} w={600} circle={false} /></div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 19 · MEDIDA — vidrio con 3 líneas de cinta (arriba/medio/abajo); focus 1 = la más chica
export const Medida: React.FC<{ focus: number; h: H; durF: number }> = ({ focus, h, durF }) => {
  const { f, s } = useF();
  const at = focus ? [0, 0, 0] : [6, s(h.hit1 ?? 2), s(h.hit2 ?? 4)];
  const rows = [{ y: 250, w: 902, t: "Arriba" }, { y: 540, w: 886, t: "Al medio" }, { y: 830, w: 896, t: "Abajo" }];
  const pickU = focus ? ramp(f, 12, 30) : 0;
  return (
    <AbsoluteFill>
      <Bed paper />
      <div style={{ position: "absolute", left: 110, top: 70 }}><Kick text={focus ? "A la vidriería: la más chica" : "Mide el vidrio en tres alturas"} size={40} /></div>
      <AbsoluteFill style={{ transform: cam(f, durF, 0.03) }}>
        <div style={{ position: "absolute", left: 180, top: 160, width: 1000, height: 820, background: `linear-gradient(135deg, #DCEBEA 0%, #F4FAF9 45%, #CFE0DF 100%)`, border: `18px solid ${T.ink2}`, boxShadow: `0 30px 60px ${rgba("#140A04", 0.35)}` }} />
        {rows.map((r, i) => {
          const u = focus ? 1 : ramp(f, at[i], at[i] + 16);
          const isPick = focus && i === 1;
          return (
            <div key={i} style={{ position: "absolute", left: 230, top: r.y, opacity: focus && !isPick ? 0.4 : 1 }}>
              <TapeMeasure u={u} width={r.w} height={54} />
              <div style={{ position: "absolute", left: 960, top: -6, fontFamily: FD, fontWeight: 800, fontSize: 60, color: isPick ? T.oxido : T.ink, whiteSpace: "nowrap", opacity: focus ? 1 : ramp(f, at[i] + 10, at[i] + 18) }}>{r.t}</div>
              {isPick ? <div style={{ position: "absolute", left: 880, top: -90 }}><HandCircle u={pickU} w={420} h={230} /></div> : null}
            </div>
          );
        })}
        {focus ? <div style={{ position: "absolute", left: 1330, top: 700 }}><Sello text="La más chica" delay={26} size={70} /></div> : <div style={{ position: "absolute", left: 1330, top: 700, fontFamily: FB, fontStyle: "italic", fontSize: 54, color: T.ink2, width: 520, opacity: ramp(f, at[2] + 20, at[2] + 30) }}>…y el alto: izquierda, centro y derecha</div>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 20 · DUELO — dos fichas: la correcta (✓ oro) y la que falla (✗ óxido); la derecha entra en `flip`
export const Duelo: React.FC<{ kicker: string; left: { t: string; s: string; ok: number }; right: { t: string; s: string; ok: number }; h: H; durF: number }> = ({ kicker, left, right, h, durF }) => {
  const { f, s } = useF();
  const flip = s(h.flip ?? 2);
  const card = (c: { t: string; s: string; ok: number }, d: number, rot: number) => (
    <Ficha w={720} h={560} rot={rot} delay={d} pad={54}>
      <div style={{ fontFamily: FL, fontWeight: 700, fontSize: 120, color: c.ok ? T.ok : T.oxido, lineHeight: 1 }}>{c.ok ? "✓" : "✗"}</div>
      <div style={{ fontFamily: FD, fontWeight: 900, fontSize: 96, color: T.ink, lineHeight: 1, marginTop: 14 }}>{c.t}</div>
      <div style={{ fontFamily: FB, fontStyle: "italic", fontSize: 50, color: T.ink2, marginTop: 20 }}>{c.s}</div>
      <div style={{ position: "absolute", right: 40, bottom: 40 }}><Sello text={c.ok ? "Sí" : "No"} delay={d + 16} color={c.ok ? T.ok : T.oxido} size={60} /></div>
    </Ficha>
  );
  return (
    <AbsoluteFill>
      <Bed dim={0.15} />
      <div style={{ position: "absolute", top: 80, width: "100%" }}><Kick text={kicker} center size={42} color={T.paper} /></div>
      <Center style={{ transform: cam(f, durF, 0.03), top: 50 }}>
        <div style={{ display: "flex", gap: 90, alignItems: "center" }}>
          {card(left, 2, -2)}
          <div style={{ fontFamily: FD, fontWeight: 900, fontStyle: "italic", fontSize: 90, color: T.oroSoft, opacity: ramp(f, flip - 6, flip) }}>vs</div>
          {f >= flip - 1 ? card(right, flip, 2) : <div style={{ width: 720 }} />}
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// 21 · REPASO — checklist en ficha, cada ✓ en su frase
export const Repaso: React.FC<{ kicker: string; items: string[]; h: H; durF: number }> = ({ kicker, items, h, durF }) => {
  const { f, s } = useF();
  const at = [6, s(h.hit1 ?? 2.5), s(h.hit2 ?? 5), s(h.hit3 ?? 7.5)];
  return (
    <AbsoluteFill>
      <Bed dim={0.1} />
      <Center style={{ transform: cam(f, durF, 0.04) }}>
        <Ficha w={1300} rot={-1} pad={70}>
          <Kick text={kicker} size={38} delay={2} />
          {items.map((it, i) => {
            const d = at[i] ?? 6; const u = ramp(f, d, d + 10);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 34, marginTop: 30, opacity: 0.25 + 0.75 * u }}>
                <div style={{ width: 84, height: 84, border: `6px solid ${T.ink2}`, borderRadius: 8, position: "relative", flex: "0 0 auto" }}>
                  <svg width="100" height="90" viewBox="0 0 100 90" style={{ position: "absolute", left: -2, top: -16, overflow: "visible" }}><path d="M12 48 L 40 76 L 96 6" fill="none" stroke={T.oxido} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ramp(f, d + 2, d + 12)} /></svg>
                </div>
                <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 70, color: T.ink, lineHeight: 1.05 }}>{it}</div>
              </div>
            );
          })}
        </Ficha>
      </Center>
    </AbsoluteFill>
  );
};

// 22 · SECUENCIA — pasos numerados unidos por flechas, cada uno en su frase
export const Secuencia: React.FC<{ kicker: string; items: string[]; h: H; durF: number }> = ({ kicker, items, h, durF }) => {
  const { f, s } = useF();
  const at = [4, s(h.hit1 ?? 2), s(h.hit2 ?? 4), s(h.hit3 ?? 6)];
  return (
    <AbsoluteFill>
      <Bed dim={0.2} />
      <div style={{ position: "absolute", top: 110, width: "100%" }}><Kick text={kicker} center size={46} color={T.paper} /></div>
      <Center style={{ transform: cam(f, durF, 0.03), top: 40 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {items.map((it, i) => {
            const d = at[i] ?? 4; const k = useSprSafe(f, d);
            return (
              <React.Fragment key={i}>
                {i > 0 ? <svg width="90" height="60" viewBox="0 0 90 60" style={{ opacity: ramp(f, d - 4, d) }}><path d="M5 30 L 70 30 M 50 10 L 78 30 L 50 50" stroke={T.oroSoft} strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
                <div style={{ width: 340, height: 420, background: `linear-gradient(160deg, ${T.paper} 0%, ${T.paper2} 100%)`, borderRadius: 6, padding: 30, boxSizing: "border-box", boxShadow: `0 24px 50px ${rgba("#140A04", 0.55)}`, transform: `translateY(${((1 - Math.min(1, k)) * 80).toFixed(1)}px) rotate(${((i % 2 ? 1 : -1) * 1.5).toFixed(1)}deg)`, opacity: f < d ? 0.15 : Math.min(1, k * 2) }}>
                  <div style={{ fontFamily: FD, fontWeight: 900, fontSize: 130, color: T.oxido, lineHeight: 1 }}>{i + 1}</div>
                  <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 56, color: T.ink, lineHeight: 1.05, marginTop: 20 }}>{it}</div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// 23 · PREGUNTA — pregunta grande a máquina con cursor + subrayado a lápiz
export const Pregunta: React.FC<{ q: string; sub?: string; durF: number }> = ({ q, sub, durF }) => {
  const { f } = useF();
  const n = Math.min(q.length, Math.floor(Math.max(0, f - 4) / 1.6));
  const done = n >= q.length; const doneAt = 4 + q.length * 1.6;
  return (
    <AbsoluteFill>
      <Bed paper />
      <Center style={{ transform: cam(f, durF, 0.06) }}>
        <div style={{ position: "relative", fontFamily: FD, fontWeight: 900, fontSize: 170, color: T.ink, textAlign: "center", maxWidth: 1600, lineHeight: 1.05 }}>
          {q.slice(0, n)}<span style={{ opacity: done ? (Math.floor(f / 12) % 2 ? 0 : 1) : 1, color: T.oxido }}>|</span>
          {done ? <HandLine u={ramp(f, doneAt, doneAt + 14)} /> : null}
        </div>
        {sub ? <div style={{ marginTop: 50, fontFamily: FB, fontStyle: "italic", fontSize: 60, color: T.oxido, opacity: ramp(f, doneAt + 6, doneAt + 16) }}>{sub}</div> : null}
      </Center>
    </AbsoluteFill>
  );
};

// 24 · ALERTA — tablero de seguridad con 4 íconos que se encienden en su frase
const ICONS: Record<number, React.ReactNode> = {
  0: <path d="M30 90 L 30 45 Q 30 35 38 35 Q 46 35 46 45 L 46 30 Q 46 20 54 20 Q 62 20 62 30 L 62 35 Q 62 25 70 25 Q 78 25 78 35 L 78 70 Q 78 95 55 100 L 45 100 Q 30 98 30 90 Z" />,
  1: <g><circle cx="35" cy="60" r="20" /><circle cx="85" cy="60" r="20" /><path d="M55 58 Q 60 50 65 58" /></g>,
  2: <g><circle cx="35" cy="30" r="12" /><path d="M20 100 L 22 55 Q 35 45 48 55 L 50 100" /><circle cx="85" cy="30" r="12" /><path d="M70 100 L 72 55 Q 85 45 98 55 L 100 100" /><path d="M45 70 L 75 70" /></g>,
  3: <g><path d="M30 105 L 30 15 L 60 15 L 60 105" /><path d="M30 35 L 60 35 M 30 55 L 60 55 M 30 75 L 60 75" /><path d="M75 20 L 95 60 L 55 60 Z" /></g>,
};
export const Alerta: React.FC<{ kicker: string; items: string[]; h: H; durF: number }> = ({ kicker, items, h, durF }) => {
  const { f, s } = useF();
  const at = [6, s(h.hit1 ?? 2), s(h.hit2 ?? 4), s(h.hit3 ?? 6)];
  return (
    <AbsoluteFill>
      <Bed dim={0.25} />
      <Center style={{ transform: cam(f, durF, 0.03) }}>
        <div style={{ background: T.ink, borderTop: `14px solid ${T.oxido}`, padding: "50px 70px", borderRadius: 8, boxShadow: `0 40px 80px ${rgba("#140A04", 0.7)}` }}>
          <Kick text={kicker} size={44} color={T.oroSoft} center />
          <div style={{ display: "flex", gap: 40, marginTop: 40 }}>
            {items.map((it, i) => {
              const d = at[i] ?? 6; const on = ramp(f, d, d + 8);
              return (
                <div key={i} style={{ width: 330, height: 400, background: on > 0.5 ? T.paper : rgba(T.paper, 0.12), borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${(0.92 + 0.08 * on).toFixed(3)})` }}>
                  <svg width="170" height="160" viewBox="0 0 120 120" style={{ fill: "none", stroke: on > 0.5 ? (i === 3 ? T.oxido : T.ink) : rgba(T.paper, 0.4), strokeWidth: 7, strokeLinecap: "round", strokeLinejoin: "round" }}>{ICONS[i]}</svg>
                  <div style={{ fontFamily: FD, fontWeight: 800, fontSize: 46, textAlign: "center", color: on > 0.5 ? (i === 3 ? T.oxido : T.ink) : rgba(T.paper, 0.4), marginTop: 20, padding: "0 20px", lineHeight: 1.05 }}>{it}</div>
                </div>
              );
            })}
          </div>
        </div>
      </Center>
    </AbsoluteFill>
  );
};

// 25 · CALZOS — el vidrio apoya en dos calzos a ~10 cm de las esquinas + calzos laterales
export const Calzos: React.FC<{ h: H; durF: number }> = ({ h, durF }) => {
  const { f, s } = useF();
  const a1 = s(h.hit1 ?? 2), a2 = s(h.hit2 ?? 5);
  const drop = (d: number) => (1 - ramp(f, d, d + 10)) * -300;
  const glassY = f < a1 + 14 ? -260 * (1 - ramp(f, 0, a1 + 14)) : 0;
  return (
    <AbsoluteFill>
      <Bed paper />
      <div style={{ position: "absolute", left: 110, top: 70 }}><Kick text="Los calzos: el vidrio nunca apoya en el metal" size={38} /></div>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", transform: cam(f, durF, 0.03) }}>
        <path d="M220 220 L 220 900 L 1700 900 L 1700 220" fill="none" stroke={T.ink2} strokeWidth="40" />
        <g transform={`translate(0, ${glassY.toFixed(1)})`}>
          <rect x="300" y="250" width="1320" height="600" fill="#DCEBEA" stroke={T.ink2} strokeWidth="8" opacity={0.95} />
        </g>
        {[430, 1400].map((x, i) => <rect key={i} x={x} y={850 + drop(a1 + i * 4)} width="90" height="30" fill="#1E1612" />)}
        {[{ x: 262, y: 520 }, { x: 1620, y: 520 }].map((p, i) => <rect key={i} x={p.x} y={p.y} width="38" height="90" fill="#1E1612" opacity={ramp(f, a2 + i * 4, a2 + i * 4 + 8)} />)}
        <g opacity={ramp(f, a1 + 16, a1 + 26)} stroke={T.oxido} strokeWidth="5" fill="none">
          <path d="M300 960 L 430 960 M 300 940 L 300 980 M 430 940 L 430 980" />
          <path d="M1490 960 L 1620 960 M 1490 940 L 1490 980 M 1620 940 L 1620 980" />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 300, top: 990, fontFamily: FL, fontWeight: 700, fontSize: 46, color: T.oxido, opacity: ramp(f, a1 + 16, a1 + 26) }}>~10 cm</div>
      <div style={{ position: "absolute", left: 1470, top: 990, fontFamily: FL, fontWeight: 700, fontSize: 46, color: T.oxido, opacity: ramp(f, a1 + 16, a1 + 26) }}>~10 cm</div>
      <div style={{ position: "absolute", left: 560, top: 480, fontFamily: FD, fontWeight: 800, fontSize: 62, color: T.ink2, opacity: ramp(f, a2 + 10, a2 + 20) }}>centrado, sin tocar el marco</div>
    </AbsoluteFill>
  );
};
