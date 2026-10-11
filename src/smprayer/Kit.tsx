// smprayer · kit (Claude, 11-oct-2026): el kit de cltoilet/yo1/Kit2 con rótulos parametrizados y 2 reels de avatar.
// Cada componente recibe `a` (segundo de entrada en el video) y `d` (cuadros); los tiempos de sus props son SEGUNDOS ABSOLUTOS
// (las palabras de la voz), así cada golpe cae en su palabra. Fondo = un solo plano continuo; salida por cámara.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { SERIF, LABEL, HAND, fr, cl, ez, eo, lin, img, C, avAt, avSrc, Grade, Grain, Mark, Print, Chip, Bed, Stage, sp } from "./Base";

type P<T> = React.FC<T & { a: number; d: number }>;
const useT = (a: number) => { const f = useCurrentFrame(); return { f, at: (t: number) => fr(t) - fr(a) }; };
const shadowTxt = "0 6px 26px rgba(0,0,0,0.65)";

// ── CAPÍTULO: número gigante + Loretta hablando DENTRO de un marco; al final la cámara entra al marco = plano de avatar siguiente ──
export const Chapter: P<{ n: string; title: string; sub?: string; av?: boolean; k?: string; label?: string }> = ({ a, d, n, title, sub, av = true, k, label }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 13, 120), t = sp(f, 6, 14, 150), s2 = sp(f, 14, 14, 150);
  const cam = f / d;
  const W = 900, H = 506;
  return (
    <Stage f={f} T={d} push={[64.6, 50, 1920 / (W + 28)]} drift={0.4}>
      <Bed k={k || "p164"} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 120 - 30 * cam, top: 150, opacity: u, transform: `scale(${1.3 - 0.3 * u})`, transformOrigin: "30% 60%" }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 50, letterSpacing: 16, color: C.lilac, marginLeft: 20 }}>{label || (n === "BONUS" ? "THE" : "MISTAKE")}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: n.length > 2 ? 160 : 700, lineHeight: 0.86, color: "transparent",
          backgroundImage: "linear-gradient(170deg, #FFFDF8 10%, #E6DDF0 55%, #B4A2C6 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.5))" }}>{n}</div>
      </div>
      <div style={{ position: "absolute", left: 1240, top: 540, translate: "-50% -50%", transform: `perspective(1600px) rotateY(${-10 + 10 * ez(cam)}deg) translateX(${(1 - u) * 800}px)`, opacity: cl(u * 2) }}>
        <div style={{ background: "#FFFDF8", padding: 14, borderRadius: 4, boxShadow: `0 50px 90px ${C.shadow}` }}>
          <div style={{ width: W, height: H, overflow: "hidden", position: "relative", background: "#222" }}>
            {av ? <OffthreadVideo src={avSrc(a)} startFrom={fr(avAt(a))} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <Img src={img(k || "p164")} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + 0.08 * cam})` }} />}
          </div>
        </div>
        <div style={{ position: "absolute", left: -60, bottom: -50, opacity: t, transform: `translateY(${(1 - t) * 40}px) rotate(-2deg)` }}><Chip txt={title} size={64} /></div>
        {sub ? <div style={{ position: "absolute", right: -20, top: -40, opacity: s2, transform: `scale(${0.7 + 0.3 * s2}) rotate(3deg)` }}><Chip txt={sub} size={40} bg={C.red} color="#fff" /></div> : null}
      </div>
      <Grade vig={0.4} />
    </Stage>
  );
};

// ── LA TARJETA (pasos): papel de la página a la izquierda que se va tildando + foto grande del paso activo a la derecha ──
export const StepCard: P<{ page: string; head: string; steps: { t: number; txt: string; k: string }[]; bed?: string }> = ({ a, d, page, head, steps, bed }) => {
  const { f, at } = useT(a);
  const c = sp(f, 0, 14, 110);
  const act = steps.reduce((m, s, i) => (f >= at(s.t) ? i : m), -1);
  return (
    <Stage f={f} T={d} drift={0.5}>
      <Bed k={bed || steps[0].k} f={f} T={d} dim={0.5} />
      {/* foto del paso activo, grande, con cambio por deslizamiento */}
      {steps.map((s, i) => {
        const on = sp(f, at(s.t), 15, 130), off = i < steps.length - 1 ? sp(f, at(steps[i + 1].t), 15, 130) : 0;
        if (f < at(s.t) - 2 || off > 0.999) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 1270, top: 520, translate: "-50% -50%",
            transform: `perspective(1600px) rotateY(${-8}deg) translateX(${(1 - on) * 900 - off * 1300}px) rotateZ(${(i % 2 ? 1.5 : -1.5)}deg)`, opacity: cl(on * 2) * (1 - off) }}>
            <Print k={s.k} w={940} h={600} f={f} mat={15} />
            <div style={{ position: "absolute", left: -30, top: -34 }}><Chip txt={`STEP ${i + 1}`} size={40} bg={C.lilacDeep} color="#fff" rot={-4} /></div>
          </div>
        );
      })}
      {/* la tarjeta de papel */}
      <div style={{ position: "absolute", left: 90, top: 140, width: 640, transform: `translateX(${(1 - c) * -700}px) rotate(-1.5deg)`, opacity: cl(c * 2) }}>
        <div style={{ background: "#FBF5E6", borderRadius: 6, padding: "34px 40px 40px", boxShadow: "0 50px 90px rgba(0,0,0,0.5)",
          backgroundImage: "repeating-linear-gradient(180deg, rgba(0,0,0,0) 0 57px, rgba(90,120,170,0.18) 57px 58px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 34, letterSpacing: 6, color: C.lilacDeep }}>{head}</div>
            <Chip txt={page} size={30} bg={C.red} color="#fff" rot={3} />
          </div>
          {steps.map((s, i) => {
            const u = sp(f, at(s.t), 14, 170);
            return (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", marginTop: 14, opacity: 0.25 + 0.75 * u, transform: `translateX(${(1 - u) * -20}px)` }}>
                <div style={{ position: "relative", minWidth: 46, height: 46, borderRadius: 8, border: `3px solid ${i === act ? C.red : C.inkSoft}`, marginTop: 6 }}>
                  {f > at(s.t) + 4 ? <svg width={46} height={46} style={{ position: "absolute", left: -3, top: -3 }}><path d="M 9 24 L 19 34 L 38 10" fill="none" stroke={C.red} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo((f - at(s.t) - 4) / 6)} /></svg> : null}
                </div>
                <div style={{ fontFamily: HAND, fontSize: 46, lineHeight: 1.12, color: "#22314F" }}>{s.txt}</div>
              </div>
            );
          })}
        </div>
      </div>
      <Grade vig={0.38} />
    </Stage>
  );
};

// ── EL ERROR DE TODOS: la foto con el círculo rojo y el sello "THE MISTAKE" + frase ──
export const MistakeStamp: P<{ k: string; txt: string; cx?: number; cy?: number; at2?: number }> = ({ a, d, k, txt, cx = 50, cy = 70, at2 }) => {
  const { f, at } = useT(a);
  const s = sp(f, 4, 11, 240), t = sp(f, at2 ? at(at2) : 14, 14, 160);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1.08 + 0.1 * f / d})`, transformOrigin: `${cx}% ${cy}%` }}>
        <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.85)" }} />
        <Mark kind="circle" x={cx * 19.2 - 230} y={cy * 10.8 - 170} w={460} h={330} f={f} at={8} dur={10} sw={11} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(10,8,14,0.6) 0%, rgba(10,8,14,0) 55%)" }} />
      <div style={{ position: "absolute", left: 110, top: 200, transform: `rotate(-6deg) scale(${2.2 - 1.2 * s})`, opacity: cl(s * 3), transformOrigin: "0 50%" }}>
        <div style={{ border: `9px solid ${C.red}`, borderRadius: 12, padding: "6px 30px", fontFamily: LABEL, fontWeight: 700, fontSize: 92, color: C.red, letterSpacing: 6, background: "rgba(255,248,240,0.88)", boxShadow: "0 20px 50px rgba(0,0,0,0.45)" }}>THE MISTAKE</div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 400, width: 760, opacity: t, transform: `translateY(${(1 - t) * 30}px)`, fontFamily: SERIF, fontWeight: 800, fontSize: 70, lineHeight: 1.08, color: C.porc, textShadow: shadowTxt }}>{txt}</div>
      <Grade />
      <Grain />
    </AbsoluteFill>
  );
};

// ── CUÁNTO CUESTA: etiqueta de precio de papel que cuelga y se balancea; opcional contra el precio de la tienda tachado ──
export const CostTag: P<{ price: string; sub: string; k: string; vs?: { price: string; txt: string; t: number } }> = ({ a, d, price, sub, k, vs }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 9, 90);
  const sw = Math.sin(f / 9) * 6 * Math.exp(-f / 40);
  const v = vs ? sp(f, at(vs.t), 13, 170) : 0;
  return (
    <Stage f={f} T={d} drift={0.6}>
      <Bed k={k} f={f} T={d} dim={0.42} />
      <div style={{ position: "absolute", left: vs ? 620 : 960, top: 140, transformOrigin: "50% 0", transform: `translateX(-50%) translateY(${(1 - u) * -700}px) rotate(${sw}deg)` }}>
        <div style={{ width: 4, height: 120, background: "#9A8F7E", margin: "0 auto" }} />
        <div style={{ position: "relative", width: 560, padding: "50px 40px 46px", background: "#FBF5E6", borderRadius: "60px 18px 18px 18px", boxShadow: "0 60px 100px rgba(0,0,0,0.5)", textAlign: "center",
          clipPath: "polygon(18% 0, 82% 0, 100% 16%, 100% 100%, 0 100%, 0 16%)" }}>
          <div style={{ width: 34, height: 34, borderRadius: 99, background: "#d8cfbd", margin: "-10px auto 14px", boxShadow: "inset 0 3px 6px rgba(0,0,0,0.3)" }} />
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 230, lineHeight: 0.9, color: C.lilacDeep }}>{price}</div>
          <div style={{ fontFamily: HAND, fontSize: 54, color: C.ink, marginTop: 10 }}>{sub}</div>
        </div>
      </div>
      {vs ? (
        <div style={{ position: "absolute", left: 1330, top: 330, opacity: v, transform: `translateY(${(1 - v) * 60}px) rotate(4deg)` }}>
          <div style={{ position: "relative", width: 440, padding: "36px 30px", background: "#EDE7DA", borderRadius: 14, boxShadow: "0 40px 70px rgba(0,0,0,0.45)", textAlign: "center" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: "#8B8275" }}>{vs.price}</div>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 34, letterSpacing: 4, color: "#8B8275" }}>{vs.txt}</div>
            <Mark kind="strike" x={20} y={70} w={400} h={110} f={f} at={at(vs.t) + 8} dur={8} sw={13} />
          </div>
        </div>
      ) : null}
      <Grade vig={0.4} />
    </Stage>
  );
};

// ── NOTA A MANO (dichos de mamá, Harold, Edna): tarjeta rayada, la letra se escribe ──
export const Note: P<{ lines: string[]; sig: string; k: string; chip?: { txt: string; t: number }; size?: number }> = ({ a, d, lines, sig, k, chip, size = 96 }) => {
  const { f, at } = useT(a);
  const c = sp(f, 0, 14, 120);
  const ch = chip ? sp(f, at(chip.t), 12, 200) : 0;
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} T={d} dim={0.45} />
      <div style={{ position: "absolute", left: 960, top: 520, translate: "-50% -50%", transform: `perspective(1600px) rotateX(${(1 - c) * 40}deg) rotateZ(${-2.5 + 1.5 * f / d}deg) translateY(${(1 - c) * 400}px) scale(${1 + 0.04 * f / d})` }}>
        <div style={{ position: "relative", width: 1240, minHeight: 520, padding: "90px 120px 120px 170px", boxSizing: "border-box", background: "#F8F1DF", borderRadius: 6, boxShadow: "0 60px 110px rgba(0,0,0,0.55)",
          backgroundImage: "repeating-linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 62px, rgba(90,120,170,0.25) 63px, rgba(0,0,0,0) 64px)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 120, top: 0, bottom: 0, width: 2, background: "rgba(200,70,70,0.35)" }} />
          {lines.map((l, i) => {
            const w = lin(f, 3 + i * 16, 3 + i * 16 + Math.max(14, l.length * 0.9), 0, 1, (x) => x);
            return <div key={i} style={{ fontFamily: HAND, fontSize: size, lineHeight: 1.12, whiteSpace: "nowrap", color: "#2E3B63", clipPath: `inset(0 ${100 - w * 100}% 0 0)` }}>{l}</div>;
          })}
          <div style={{ position: "absolute", right: 110, bottom: 40, fontFamily: HAND, fontSize: 72, color: "#2E3B63", opacity: lin(f, 3 + lines.length * 16, 12 + lines.length * 16, 0, 1) }}>— {sig}</div>
        </div>
        <div style={{ position: "absolute", left: 540, top: -26, width: 170, height: 52, background: "rgba(236,226,196,0.85)", transform: "rotate(-4deg)" }} />
        {chip ? <div style={{ position: "absolute", right: -60, bottom: -40, opacity: ch, transform: `scale(${0.6 + 0.4 * ch}) rotate(-5deg)` }}><Chip txt={chip.txt} font={HAND} size={66} ls={0} bg={C.lilacDeep} color="#fff" /></div> : null}
      </div>
      <Grade vig={0.36} />
    </AbsoluteFill>
  );
};

// ── PÁGINA DEL LIBRO: sube de la mesa a cámara, pestaña, resaltador; opcional segunda página al lado ──
export const PageUp: P<{ pages: { src: string; tab: string; t: number; hl?: number }[]; caption?: { txt: string; t: number }; k: string }> = ({ a, d, pages, caption, k }) => {
  const { f, at } = useT(a);
  const n = pages.length;
  const cap = caption ? sp(f, at(caption.t), 14, 160) : 0;
  const p0 = pages[0], hlY = 92 + ((p0.hl ?? 40) + 3) / 100 * 906;
  const pz = n === 1 && p0.hl != null ? eo(cl((f - at(p0.t) - 38) / 7)) : 0;
  return (
    <Stage f={f} T={d} drift={0.5}>
      <Bed k={k} f={f} T={d} dim={0.42} />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.85 * pz})`, transformOrigin: `50% ${(hlY / 1080) * 100}%` }}>
      {pages.map((p, i) => {
        const up = sp(f, at(p.t), 15, 90), tab = sp(f, at(p.t) + 10, 12, 200);
        const hl = lin(f, at(p.t) + 14, at(p.t) + 34, 0, 1);
        const X = n === 1 ? 960 : 960 + (i - (n - 1) / 2) * 640;
        const w = n === 1 ? 700 : 540, h = w * 1.294;
        return (
          <div key={i} style={{ position: "absolute", left: X, top: 545, translate: "-50% -50%", transform: `perspective(1800px) rotateX(${(1 - up) * 58 + 6}deg) rotateZ(${(i % 2 ? 3 : -3) * up}deg) translateY(${(1 - up) * 300}px)`, transformOrigin: "50% 100%", opacity: cl(up * 3) }}>
            <div style={{ position: "relative", width: w, height: h, background: "#fff", boxShadow: "0 60px 100px rgba(0,0,0,0.55)", borderRadius: 3, overflow: "hidden" }}>
              <Img src={img(p.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {p.hl != null ? <div style={{ position: "absolute", left: "6%", top: `${p.hl}%`, height: "6%", width: `${hl * 84}%`, background: "rgba(255,226,70,0.45)", mixBlendMode: "multiply", borderRadius: 6 }} /> : null}
              <AbsoluteFill style={{ background: "linear-gradient(150deg, rgba(255,250,235,0.18), rgba(0,0,0,0) 45%, rgba(20,16,30,0.18))" }} />
            </div>
            <div style={{ position: "absolute", right: -60, top: 60, transform: `translateX(${(1 - tab) * -100}px) rotate(4deg)`, opacity: tab }}><Chip txt={p.tab} size={58} bg={C.red} color="#fff" /></div>
          </div>
        );
      })}
      </AbsoluteFill>
      {caption ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", opacity: cap, transform: `translateY(${(1 - cap) * 30}px)`, fontFamily: HAND, fontSize: 74, color: C.porc, textShadow: shadowTxt }}>{caption.txt}</div> : null}
      <Grade vig={0.38} />
    </Stage>
  );
};

// ── LISTA QUE SE TILDA (reglas, repaso): cada renglón entra en su palabra, con miniatura real opcional ──
export const Checklist: P<{ head: string; items: { t: number; txt: string; k?: string; no?: boolean }[]; k: string; page?: string }> = ({ a, d, head, items, k, page }) => {
  const { f, at } = useT(a);
  const c = sp(f, 0, 14, 120);
  const big = items.some((x) => x.k);
  return (
    <Stage f={f} T={d} drift={0.5}>
      <Bed k={k} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 960, top: 540, translate: "-50% -50%", width: big ? 1500 : 1180, opacity: cl(c * 2), transform: `translateY(${(1 - c) * 120}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 26 }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: C.porc, textShadow: shadowTxt }}>{head}</div>
          {page ? <Chip txt={page} size={36} bg={C.red} color="#fff" rot={3} /> : null}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: big ? "1fr 1fr" : "1fr", gap: big ? "18px 40px" : 16 }}>
          {items.map((x, i) => {
            const u = sp(f, at(x.t), 14, 170);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, background: "rgba(251,245,230,0.94)", borderRadius: 10, padding: big ? "10px 22px 10px 10px" : "16px 26px", boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
                opacity: cl(u * 2), transform: `translateX(${(1 - u) * (i % 2 ? 80 : -80)}px) rotate(${(i % 2 ? 0.6 : -0.6)}deg)` }}>
                {x.k ? <div style={{ width: 190, height: 107, overflow: "hidden", borderRadius: 6, flex: "none" }}><Img src={img(x.k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div> : null}
                <svg width={52} height={52} style={{ flex: "none" }}>
                  <rect x={3} y={3} width={46} height={46} rx={8} fill="none" stroke={C.inkSoft} strokeWidth={3} />
                  {x.no ? <path d="M 12 12 L 40 40 M 40 12 L 12 40" stroke={C.red} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo((f - at(x.t) - 5) / 7)} fill="none" />
                    : <path d="M 11 27 L 21 37 L 41 13" stroke={C.sage} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo((f - at(x.t) - 5) / 7)} fill="none" />}
                </svg>
                <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: big ? 36 : 44, letterSpacing: 1.5, color: C.ink, textTransform: "uppercase" }}>{x.txt}</div>
              </div>
            );
          })}
        </div>
      </div>
      <Grade vig={0.4} />
    </Stage>
  );
};

// ── NUNCA MEZCLAR: filas "A ✕ B" que golpean en su palabra, sobre la página 3 desenfocada ──
export const NeverMix: P<{ rows: { t: number; a: string; b: string[] }[]; k: string; gas?: [number, string] }> = ({ a, d, rows, k, gas }) => {
  const { f, at } = useT(a);
  const h = sp(f, 0, 13, 160);
  return (
    <Stage f={f} T={d} drift={0.4}>
      <Bed k={k} f={f} T={d} dim={0.6} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 90, textAlign: "center", opacity: h, transform: `translateY(${(1 - h) * -40}px)` }}>
        <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 10, color: C.lilac }}>PAGE 3 · </span>
        <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 100, color: C.porc, textShadow: shadowTxt }}>Never mix these</span>
      </div>
      {rows.map((r, i) => {
        const u = sp(f, at(r.t), 12, 200);
        return (
          <div key={i} style={{ position: "absolute", left: 960, top: 330 + i * 230, translate: "-50% 0", display: "flex", alignItems: "center", gap: 30, opacity: cl(u * 2), transform: `scale(${1.3 - 0.3 * u})` }}>
            <Chip txt={r.a} size={62} rot={-2} />
            <div style={{ width: 96, height: 96, borderRadius: 99, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 30px rgba(0,0,0,0.45)", transform: `rotate(${(1 - u) * 180}deg)` }}>
              <svg width={52} height={52}><path d="M 8 8 L 44 44 M 44 8 L 8 44" stroke="#fff" strokeWidth={10} strokeLinecap="round" /></svg>
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "nowrap" }}>
              {r.b.map((b, j) => { const v = sp(f, at(r.t) + 4 + j * 4, 13, 200); return <div key={j} style={{ opacity: v, transform: `translateY(${(1 - v) * 30}px)` }}><Chip txt={b} size={46} rot={j % 2 ? 2 : -1.5} bg="#F1E4E1" /></div>; })}
            </div>
          </div>
        );
      })}
      {gas ? (() => { const g = sp(f, at(gas[0]), 11, 220); return (
        <div style={{ position: "absolute", left: 0, right: 0, top: 640, textAlign: "center", opacity: cl(g * 2), transform: `scale(${1.5 - 0.5 * g}) rotate(-3deg)` }}>
          <span style={{ border: `9px solid ${C.red}`, borderRadius: 12, padding: "6px 34px", fontFamily: LABEL, fontWeight: 700, fontSize: 96, color: C.red, letterSpacing: 6, background: "rgba(255,248,240,0.9)", boxShadow: "0 20px 50px rgba(0,0,0,0.45)" }}>= {gas[1]}</span>
        </div>); })() : null}
      <Grade vig={0.42} />
    </Stage>
  );
};

// ── LA REPISA v2: cada cosa a PANTALLA COMPLETA (su foto), entra barriendo; a mitad de su tiempo la cámara corta más cerca. Número + nombre + uso a la izquierda ──
export const Shelf: P<{ items: { t: number; name: string; use: string; k: string }[]; k: string; head?: string }> = ({ a, d, items, head = "UNDER MY SINK · PAGE 4" }) => {
  const { f, at } = useT(a);
  const act = items.reduce((m, s, i) => (f >= at(s.t) ? i : m), 0);
  const it = items[act];
  const u = sp(f, at(it.t), 12, 190);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {items.map((s, i) => {
        const s0 = Math.max(0, at(s.t)), s1 = i < items.length - 1 ? at(items[i + 1].t) : d;
        if (f < s0 - 1 || f > s1 + 6) return null;
        const on = i === 0 ? 1 : eo(cl((f - s0 + 1) / 6));
        const mid = s0 + (s1 - s0) * 0.5, punch = s1 - s0 > 50 && f >= mid ? 1 : 0;
        const k2 = (f - s0) / Math.max(1, s1 - s0);
        const sc = (1.04 + 0.06 * k2) * (punch ? 1.3 : 1);
        return (
          <AbsoluteFill key={i} style={{ transform: `translateX(${(1 - on) * 1920}px)`, filter: on < 0.98 ? `blur(${(1 - on) * 24}px)` : undefined }}>
            <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: i % 2 ? "62% 48%" : "70% 55%" }}>
              <Img src={img(s.k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </AbsoluteFill>
          </AbsoluteFill>
        );
      })}
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(14,10,22,0.82) 0%, rgba(14,10,22,0.55) 38%, rgba(0,0,0,0) 62%)" }} />
      <div style={{ position: "absolute", left: 110, top: 80, fontFamily: LABEL, fontWeight: 700, fontSize: 38, letterSpacing: 10, color: C.lilac }}>{head}</div>
      <div style={{ position: "absolute", left: 100, top: 160, display: "flex", alignItems: "flex-end", gap: 10 }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 330, lineHeight: 0.84, color: C.porc, textShadow: shadowTxt, transform: `translateY(${(1 - u) * 40}px) scale(${1.15 - 0.15 * u})`, transformOrigin: "0% 100%" }}>{act + 1}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: "rgba(251,248,242,0.5)", marginBottom: 30 }}>/{items.length}</div>
      </div>
      <div style={{ position: "absolute", left: 110, top: 520, width: 800, opacity: u, transform: `translateX(${(1 - u) * -60}px)` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 80, lineHeight: 1.02, color: C.porc, textShadow: shadowTxt }}>{it.name}</div>
        <div style={{ fontFamily: HAND, fontSize: 60, color: "#EADFF5", marginTop: 14, textShadow: shadowTxt }}>{it.use}</div>
      </div>
      <div style={{ position: "absolute", left: 114, bottom: 90, display: "flex", gap: 16 }}>
        {items.map((_, i) => <div key={i} style={{ width: i <= act ? 46 : 16, height: 16, borderRadius: 9, background: i <= act ? C.lilac : "rgba(255,255,255,0.3)" }} />)}
      </div>
      <Grade vig={0.35} />
    </AbsoluteFill>
  );
};

// ── NÚMERO GRANDE (51 años, 10 segundos, 30 minutos): cuenta hasta el número sobre la foto ──
export const BigNumber: P<{ num: number; unit: string; txt?: string; k: string; dur?: number }> = ({ a, d, num, unit, txt, k, dur = 24 }) => {
  const { f } = useT(a);
  const c = eo(f / dur), u = sp(f, 0, 13, 150), t = sp(f, dur, 14, 160);
  return (
    <Stage f={f} T={d} drift={0.8}>
      <Bed k={k} f={f} T={d} dim={0.4} z={[1.05, 1.15]} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 210, textAlign: "center", opacity: u, transform: `scale(${1.2 - 0.2 * u})` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 380, lineHeight: 0.9, color: C.porc, textShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>{Math.round(num * c)}</div>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 72, letterSpacing: 18, color: C.lilac, marginTop: 6 }}>{unit}</div>
      </div>
      {txt ? <div style={{ position: "absolute", left: 0, right: 0, bottom: 120, textAlign: "center", opacity: t, fontFamily: HAND, fontSize: 70, color: C.porc, textShadow: shadowTxt }}>{txt}</div> : null}
      <Grade vig={0.45} />
    </Stage>
  );
};

// ── MINIATURA DE OTRO VIDEO (canal, próximo): tarjeta 3D que orbita + título palabra por palabra; sale entrando ──
export const Thumb: P<{ thumb: string; tag: string; words: [string, number][]; k: string; push?: boolean }> = ({ a, d, thumb, tag, words, k, push = true }) => {
  const { f, at } = useT(a);
  const c = sp(f, 0, 14, 110), tg = sp(f, 8, 13, 180), cam = f / d;
  return (
    <Stage f={f} T={d} push={push ? [50, 39.8, 2.4] : undefined} drift={0.5}>
      <Bed k={k} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 960, top: 430, translate: "-50% -50%", transform: `perspective(1800px) rotateY(${22 - 26 * cam}deg) rotateX(${6 - 4 * cam}deg) translateY(${(1 - c) * 500}px) scale(${0.9 + 0.1 * c})`, opacity: cl(c * 2) }}>
        <div style={{ position: "relative", width: 1000, height: 562, borderRadius: 18, overflow: "hidden", boxShadow: "0 70px 120px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.25)" }}>
          <Img src={img(thumb)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.03 + 0.04 * cam})` }} />
          <div style={{ position: "absolute", top: "-40%", bottom: "-40%", width: "26%", left: `${-40 + ((f * 1.2) % 220)}%`, transform: "rotate(14deg)", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.2), rgba(255,255,255,0))" }} />
        </div>
        <div style={{ position: "absolute", right: -30, top: -50, opacity: tg, transform: `scale(${0.7 + 0.3 * tg}) rotate(-4deg)` }}><Chip txt={tag} size={46} bg={C.red} color="#fff" /></div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 730, textAlign: "center", padding: "0 220px", maxWidth: 1500, margin: "0 auto", lineHeight: 1.12 }}>
        {words.map(([w, t], i) => { const u = sp(f, at(t), 15, 200); return <span key={i} style={{ display: "inline-block", marginRight: 20, fontFamily: SERIF, fontWeight: 800, fontSize: 58, color: C.porc, opacity: u, transform: `translateY(${(1 - u) * 30}px)`, textShadow: shadowTxt }}>{w}</span>; })}
      </div>
      <Grade vig={0.4} />
    </Stage>
  );
};

// ── QR + LIBRO (CTA del medio) ──
export const QrCard: P<{ k: string; t: number }> = ({ a, d, k, t }) => {
  const { f, at } = useT(a);
  const b = sp(f, 0, 14, 110), q = sp(f, at(t), 12, 160), cam = f / d;
  const pulse = 1 + 0.025 * Math.sin((f - at(t)) / 5) * (f > at(t) + 10 ? 1 : 0);
  return (
    <Stage f={f} T={d} drift={0.4}>
      <Bed k={k} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 640, top: 540, translate: "-50% -50%", transform: `perspective(1600px) rotateY(${18 - 10 * cam}deg) translateY(${(1 - b) * 600}px) rotateZ(-3deg)` }}>
        <div style={{ width: 520, height: 674, borderRadius: 6, boxShadow: "0 60px 110px rgba(0,0,0,0.6)", background: "#f6efe2", border: "10px solid #5b2a4a", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center", fontFamily: "Georgia, serif", color: "#3b1f33" }}>
          <div style={{ fontSize: 30, letterSpacing: 4, textTransform: "uppercase", color: "#7a4a6a" }}>Fifty-Two</div>
          <div style={{ fontSize: 66, fontWeight: 700, lineHeight: 1.05, margin: "18px 0" }}>Sunday Mornings</div>
          <div style={{ fontSize: 34, fontStyle: "italic" }}>with Loretta</div>
          <div style={{ width: 120, height: 3, background: "#5b2a4a", margin: "34px 0" }} />
          <div style={{ fontSize: 26, lineHeight: 1.35 }}>A verse, a story and a prayer for every week of the year</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 1330, top: 520, translate: "-50% -50%", opacity: q, transform: `scale(${(0.7 + 0.3 * q) * pulse}) rotate(2deg)` }}>
        <div style={{ background: "#fff", padding: 30, borderRadius: 18, boxShadow: "0 60px 110px rgba(0,0,0,0.55)" }}>
          <Img src={img("img/smprayer/qr.jpg")} style={{ width: 420, height: 420, display: "block" }} />
        </div>
        <div style={{ textAlign: "center", marginTop: 26, fontFamily: HAND, fontSize: 60, color: C.porc, textShadow: shadowTxt }}>point your phone here</div>
      </div>
      <Grade vig={0.38} />
    </Stage>
  );
};

// ── ESPEJO bajo el borde: la mano con el espejo + lupa circular que muestra la película escondida ──
export const Mirror: P<{ k: string; zoomK: string; zx: number; zy: number; words: [string, number][] }> = ({ a, d, k, zoomK, zx, zy, words }) => {
  const { f, at } = useT(a);
  const m = sp(f, 8, 13, 120);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${1.05 + 0.06 * f / d})` }}><Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7)" }} /></AbsoluteFill>
      <div style={{ position: "absolute", left: 1250, top: 520, translate: "-50% -50%", width: 620, height: 620, borderRadius: 999, overflow: "hidden", opacity: m, transform: `scale(${0.5 + 0.5 * m})`,
        boxShadow: "0 0 0 18px #C9CED3, 0 0 0 24px #8E959C, 0 60px 110px rgba(0,0,0,0.6)" }}>
        <Img src={img(zoomK)} style={{ position: "absolute", width: 1920 * 1.6, height: 1080 * 1.6, left: -zx * 19.2 * 1.6 + 310, top: -zy * 10.8 * 1.6 + 310, maxWidth: "none", filter: "sepia(0.35) brightness(0.9)" }} />
        <AbsoluteFill style={{ background: "radial-gradient(circle at 35% 30%, rgba(255,255,255,0.3), rgba(255,255,255,0) 45%)" }} />
      </div>
      {words.map(([w, t], i) => { const u = sp(f, at(t), 14, 200); return <div key={i} style={{ position: "absolute", left: 200, top: 360 + i * 130, opacity: u, transform: `translateX(${(1 - u) * -40}px) rotate(-3deg)` }}><Chip txt={w} size={64} font={i ? HAND : LABEL} ls={i ? 0 : 3} bg={i ? "#FFFDF4" : C.red} color={i ? C.ink : "#fff"} /></div>; })}
      <Grade />
      <Grain />
    </AbsoluteFill>
  );
};

// ── MARCO: "la base es el marco del cuadro" — la foto adentro de un marco dorado colgado en la pared ──
export const FrameArt: P<{ k: string; bed: string; caption: string; t: number }> = ({ a, d, k, bed, caption, t }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 100), c = sp(f, at(t), 14, 160);
  return (
    <Stage f={f} T={d} drift={0.8}>
      <Bed k={bed} f={f} T={d} dim={0.45} />
      <div style={{ position: "absolute", left: 960, top: 500, translate: "-50% -50%", transform: `rotate(${-1 + Math.sin(f / 30) * 0.5}deg) translateY(${(1 - u) * -600}px)` }}>
        <div style={{ padding: 46, borderRadius: 6, background: "linear-gradient(135deg, #E9CF8A, #A98234 40%, #F2DC9C 55%, #8C6A28 100%)", boxShadow: "0 60px 110px rgba(0,0,0,0.6), inset 0 0 0 6px rgba(80,56,18,0.5)" }}>
          <div style={{ padding: 24, background: "#F4EEDF", boxShadow: "inset 0 4px 12px rgba(0,0,0,0.3)" }}>
            <div style={{ width: 960, height: 540, overflow: "hidden" }}><Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + 0.06 * f / d})` }} /></div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", opacity: c, transform: `translateY(${(1 - c) * 30}px)`, fontFamily: HAND, fontSize: 76, color: C.porc, textShadow: shadowTxt }}>{caption}</div>
      <Grade vig={0.42} />
    </Stage>
  );
};

// ── PINES sobre la foto: los 5 lugares de afuera, después la mitad equivocada se tiñe ──
export const Pins: P<{ k: string; head: string; pins: { x: number; y: number; t: number; txt: string }[]; wrong?: number }> = ({ a, d, k, head, pins, wrong }) => {
  const { f, at } = useT(a);
  const h = sp(f, 0, 13, 160), w = wrong ? lin(f, at(wrong), at(wrong) + 14, 0, 1) : 0;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${1.04 + 0.06 * f / d})` }}>
        <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <AbsoluteFill style={{ background: "rgba(10,8,14,0.25)" }} />
        {wrong ? <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${50 * w}%`, background: "rgba(192,57,43,0.32)", borderRight: w > 0 ? "6px dashed rgba(255,255,255,0.8)" : undefined }} /> : null}
        {pins.map((p, i) => {
          const u = sp(f, at(p.t), 10, 220), pulse = 1 + 0.12 * Math.max(0, Math.sin((f - at(p.t)) / 6));
          return (
            <div key={i} style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: `translate(-50%,-100%) scale(${u})` }}>
              <div style={{ width: 66, height: 66, borderRadius: 99, background: C.lilacDeep, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 40, boxShadow: `0 0 0 ${8 * pulse}px rgba(180,162,198,0.5), 0 14px 26px rgba(0,0,0,0.5)` }}>{i + 1}</div>
              <div style={{ position: "absolute", ...(p.x > 65 ? { right: 80 } : { left: 80 }), top: 10 }}><Chip txt={p.txt} size={44} rot={-2} /></div>
            </div>
          );
        })}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 70, textAlign: "center", opacity: h }}>
        <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 88, color: C.porc, textShadow: shadowTxt }}>{head}</span>
      </div>
      {wrong ? <div style={{ position: "absolute", left: 140, bottom: 120, opacity: w, transform: `rotate(-6deg) scale(${1.4 - 0.4 * w})` }}>
        <div style={{ border: `8px solid ${C.red}`, borderRadius: 12, padding: "4px 26px", fontFamily: LABEL, fontWeight: 700, fontSize: 70, color: C.red, letterSpacing: 5, background: "rgba(255,248,240,0.88)" }}>THE WRONG HALF</div>
      </div> : null}
      <Grade />
      <Grain />
    </AbsoluteFill>
  );
};

// ── COMENTARIOS: caja de comentario genérica (sin marca) que se escribe sola + 3 opciones ──
export const Comment: P<{ q: string; opts: { txt: string; t: number }[]; k: string }> = ({ a, d, q, opts, k }) => {
  const { f, at } = useT(a);
  const c = sp(f, 0, 14, 120);
  const n = Math.floor(lin(f, 6, 6 + q.length * 0.9, 0, q.length, (x) => x));
  return (
    <Stage f={f} T={d} drift={0.5}>
      <Bed k={k} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 960, top: 380, translate: "-50% -50%", width: 1300, opacity: c, transform: `translateY(${(1 - c) * 100}px)` }}>
        <div style={{ background: "#FFFDF8", borderRadius: 22, padding: "36px 44px", boxShadow: "0 50px 100px rgba(0,0,0,0.5)", display: "flex", gap: 30, alignItems: "flex-start" }}>
          <div style={{ width: 90, height: 90, borderRadius: 99, background: C.lilac, flex: "none" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: LABEL, fontSize: 32, letterSpacing: 2, color: "#8B8275" }}>ADD A COMMENT…</div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 56, color: C.ink, marginTop: 8, minHeight: 70 }}>{q.slice(0, n)}<span style={{ opacity: f % 20 < 10 ? 1 : 0 }}>|</span></div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", gap: 40 }}>
        {opts.map((o, i) => { const u = sp(f, at(o.t), 12, 200); return <div key={i} style={{ opacity: u, transform: `translateY(${(1 - u) * 50}px) scale(${0.8 + 0.2 * u})` }}><Chip txt={o.txt} size={60} rot={[-3, 2, -1][i % 3]} bg={i === 0 ? C.lilacDeep : "#FFFDF4"} color={i === 0 ? "#fff" : C.ink} /></div>; })}
      </div>
      <Grade vig={0.4} />
    </Stage>
  );
};

// ── LINTERNA (un rincón oscuro se descubre) ──
export const Flashlight: P<{ k: string; from: [number, number]; to: [number, number]; on: number; words: [string, number, number, number][] }> = ({ a, d, k, from, to, on, words }) => {
  const { f, at } = useT(a);
  const dark = lin(f, 0, 12, 0, 0.93);
  const isOn = f >= at(on);
  const q = ez((f - at(on)) / 40);
  const bx = from[0] + (to[0] - from[0]) * q + 1.5 * Math.sin(f / 7), by = from[1] + (to[1] - from[1]) * q + 1.2 * Math.cos(f / 9);
  const R = 300 + (isOn && f - at(on) < 4 ? -200 : 0);
  const flick = isOn && f - at(on) < 6 ? (f % 2 ? 0.5 : 1) : 1;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${1.06 + 0.06 * f / d})`, transformOrigin: `${to[0]}% ${to[1]}%` }}><Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      <AbsoluteFill style={{ background: isOn ? `radial-gradient(circle ${R}px at ${bx}% ${by}%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 42%, rgba(4,4,10,${dark * flick}) 100%)` : `rgba(4,4,10,${dark})` }} />
      {isOn ? <AbsoluteFill style={{ background: `radial-gradient(circle ${R * 0.8}px at ${bx}% ${by}%, rgba(255,236,190,0.16), rgba(255,236,190,0) 70%)`, mixBlendMode: "screen" }} /> : null}
      {words.map(([w, t, x, y], i) => { const u = sp(f, at(t), 14, 200); return <div key={i} style={{ position: "absolute", left: x, top: y, opacity: u, transform: `translateY(${(1 - u) * 24}px) rotate(-4deg)`, fontFamily: HAND, fontSize: 96, color: "#F3E9D2", textShadow: "0 0 30px rgba(255,220,160,0.35)" }}>{w}</div>; })}
      <Grain />
    </AbsoluteFill>
  );
};

// ── RECUERDO: polaroid sepia de "aquel domingo" con fecha escrita, sobre la iglesia/baño desenfocado ──
export const Memory: P<{ k: string; caption: string; date: string; t?: number }> = ({ a, d, k, caption, date, t }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 13, 100), c = sp(f, t ? at(t) : 12, 14, 160), cam = f / d;
  return (
    <Stage f={f} T={d} drift={0.8}>
      <Bed k={k} f={f} T={d} dim={0.55} />
      <AbsoluteFill style={{ background: "rgba(90,60,20,0.18)", mixBlendMode: "multiply" }} />
      <div style={{ position: "absolute", left: 960, top: 520, translate: "-50% -50%", transform: `rotate(${-4 + 2 * cam}deg) translateY(${(1 - u) * 600}px) scale(${1 + 0.04 * cam})` }}>
        <div style={{ background: "#F6F0E2", padding: "30px 30px 120px", boxShadow: "0 60px 110px rgba(0,0,0,0.6)" }}>
          <div style={{ width: 980, height: 551, overflow: "hidden" }}><Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.75) contrast(1.05) brightness(0.95)", transform: `scale(${1.05 + 0.06 * cam})` }} /></div>
          <div style={{ position: "absolute", left: 50, bottom: 30, fontFamily: HAND, fontSize: 64, color: "#3A3A52", opacity: c }}>{caption}</div>
          <div style={{ position: "absolute", right: 50, bottom: 34, fontFamily: HAND, fontSize: 50, color: "#7A5A3A", opacity: c }}>{date}</div>
        </div>
      </div>
      <Grade vig={0.5} />
      <Grain />
    </Stage>
  );
};

// ── RÓTULO sobre b-roll (no es un plano: va en una pista encima): chip que entra en su palabra y sale con movimiento ──
export const Kicker: React.FC<{ txt: string; d: number; side?: "l" | "r"; red?: boolean; hand?: boolean }> = ({ txt, d, side = "l", red, hand }) => {
  const f = useCurrentFrame();
  const u = sp(f, 0, 13, 190), o = lin(f, d - 8, d, 0, 1);
  return (
    <div style={{ position: "absolute", [side === "l" ? "left" : "right"]: 110, bottom: 130, opacity: u * (1 - o), transform: `translateX(${(side === "l" ? -1 : 1) * ((1 - u) * 80 + o * 120)}px) rotate(${side === "l" ? -2 : 2}deg)` }}>
      <Chip txt={txt} size={hand ? 64 : 52} font={hand ? HAND : LABEL} ls={hand ? 0 : 3} bg={red ? C.red : "#FFFDF4"} color={red ? "#fff" : C.ink} />
    </div>
  );
};

// ── CÁMARA POR GOLPES: en cada palabra-golpe el encuadre del componente salta (4 cuadros, suave) entre 4 posiciones = un operador de cámara ──
const CAMS = [{ s: 1.0, x: 50, y: 50 }, { s: 1.065, x: 40, y: 46 }, { s: 1.0, x: 50, y: 52 }, { s: 1.065, x: 60, y: 54 }];
export const BeatCam: React.FC<{ a: number; beats: number[]; children: React.ReactNode }> = ({ a, beats, children }) => {
  const f = useCurrentFrame();
  let i = -1; beats.forEach((b, j) => { if (f >= fr(b) - fr(a)) i = j; });
  const cur = CAMS[(i + 1) % 4], prev = CAMS[(i + 4) % 4];
  const u = i < 0 ? 1 : eo(cl((f - (fr(beats[i]) - fr(a))) / 4));
  const S = prev.s + (cur.s - prev.s) * u, X = prev.x + (cur.x - prev.x) * u, Y = prev.y + (cur.y - prev.y) * u;
  return <AbsoluteFill style={{ transform: `scale(${S})`, transformOrigin: `${X}% ${Y}%` }}>{children}</AbsoluteFill>;
};

// ── ADELANTO: 1,5 s del pago que viene (foto real del final), desaturada → color, chip "COMING UP" ──
export const Tease: P<{ k: string; txt: string; tag?: string }> = ({ d, k, txt, tag = "COMING UP" }) => {
  const f = useCurrentFrame();
  const u = sp(f, 0, 10, 200), sat = lin(f, 0, 10, 0, 1);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1.25 - 0.12 * f / Math.max(1, d)})`, filter: `saturate(${0.2 + 0.8 * sat}) brightness(${0.75 + 0.25 * sat})` }}>
        <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(0,0,0,0) 40%, rgba(10,6,18,0.7) 100%)" }} />
      <div style={{ position: "absolute", left: 110, top: 96, opacity: u, transform: `translateY(${(1 - u) * -30}px)` }}><Chip txt={tag} size={46} bg={C.red} color="#fff" rot={-3} /></div>
      <div style={{ position: "absolute", left: 110, bottom: 110, opacity: u, transform: `translateX(${(1 - u) * -60}px)`, fontFamily: HAND, fontSize: 86, color: C.porc, textShadow: shadowTxt }}>{txt}</div>
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: lin(f, 0, 3, 0.55, 0) }} />
      <Grade vig={0.3} />
    </AbsoluteFill>
  );
};

// ── PALABRA CLAVE: 1 palabra grande en su sílaba, golpe de escala y se va ──
export const Pop: React.FC<{ txt: string; d: number }> = ({ txt, d }) => {
  const f = useCurrentFrame();
  const u = sp(f, 0, 8, 260), o = lin(f, d - 5, d, 0, 1);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 690, textAlign: "center", opacity: cl(u * 2) * (1 - o), transform: `scale(${1.35 - 0.35 * u + 0.04 * f / Math.max(1, d)})` }}>
      <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 180, color: C.porc, letterSpacing: 2, textShadow: "0 8px 40px rgba(0,0,0,0.75), 0 2px 6px rgba(0,0,0,0.6)" }}>{txt}</span>
      <div style={{ margin: "0 auto", marginTop: -6, width: 220 * eo(cl((f - 3) / 7)), height: 10, borderRadius: 6, background: C.lilac }} />
    </div>
  );
};

// ── CONTADOR DE LOS 5 LUGARES: arriba a la derecha, chiquito; se llena en cada capítulo ──
export const Hud: React.FC<{ a: number; chs: number[]; hide: [number, number][] }> = ({ a, chs, hide }) => {
  const f = useCurrentFrame(), t = a + f / 30;
  const n = chs.filter((c) => t >= c).length;
  if (n < 1) return null;
  const pop = sp(f, fr(chs[n - 1]) - fr(a), 10, 220);
  const h = hide.some(([x, y]) => t >= x - 0.1 && t < y + 0.15) ? 0 : 1;
  return (
    <div style={{ position: "absolute", right: 70, top: 56, display: "flex", alignItems: "center", gap: 14, opacity: 0.94 * h, background: "rgba(16,12,26,0.55)", padding: "12px 18px", borderRadius: 12 }}>
      <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 28, letterSpacing: 5, color: C.porc }}>SPOT <span style={{ color: C.lilac, display: "inline-block", transform: `scale(${1.6 - 0.6 * pop})` }}>{n}</span>/5</div>
      <div style={{ display: "flex", gap: 7 }}>
        {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{ width: i < n ? 30 : 12, height: 12, borderRadius: 6, background: i < n ? (i === n - 1 ? C.lilac : "rgba(234,223,245,0.8)") : "rgba(255,255,255,0.28)", transform: i === n - 1 ? `scaleY(${1.8 - 0.8 * pop})` : undefined }} />)}
      </div>
    </div>
  );
};

export const KIT: Record<string, React.FC<any>> = { Chapter, StepCard, MistakeStamp, CostTag, Note, PageUp, Checklist, NeverMix, Shelf, BigNumber, Thumb, QrCard, Mirror, FrameArt, Pins, Comment, Flashlight, Memory, Tease };
