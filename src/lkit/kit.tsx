// lkit · componentes CLÁSICOS (los de fhflies/fhgarlic, mismo look, APIs limpias y texto que se ajusta solo).
// Cada uno es un PLANO: recibe `a` (s) y `d` (cuadros) del Player; los tiempos de sus props son segundos ABSOLUTOS.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { SERIF, LABEL, HAND, fr, cl, ez, eo, lin, img, C, KCFG, hasAv, avAt, avSrc, Grade, Grain, Mark, Print, Chip, Bed, Stage, FullPhoto, Tick, sp, useT, fit, shadowTxt, type P } from "./core";

// ── CAPÍTULO: número gigante + Loretta (o una foto) dentro de un marco; al final la cámara entra al marco ──
export const Chapter: P<{ n: string; title: string; sub?: string; label?: string; k: string; av?: boolean }> = ({ a, d, n, title, sub, label = "CHAPTER", k, av = true }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 13, 120), t = sp(f, 6, 14, 150), s2 = sp(f, 14, 14, 150);
  const cam = f / d;
  const W = 900, H = 506, useAv = av && hasAv();
  return (
    <Stage f={f} T={d} push={[64.6, 50, 1920 / (W + 28)]} drift={0.4}>
      <Bed k={k} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 120 - 30 * cam, top: 150, width: 640, opacity: u, transform: `scale(${1.3 - 0.3 * u})`, transformOrigin: "30% 60%" }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: fit(label, 620, 50, "label", 1, 16), letterSpacing: 16, color: C.lilac, marginLeft: 20, whiteSpace: "nowrap" }}>{label}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fit(n, 620, 700, "serif"), lineHeight: 0.86, color: "transparent", whiteSpace: "nowrap",
          backgroundImage: "linear-gradient(170deg, #FFFDF8 10%, #E6DDF0 55%, #B4A2C6 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.5))" }}>{n}</div>
      </div>
      <div style={{ position: "absolute", left: 1240, top: 540, translate: "-50% -50%", transform: `perspective(1600px) rotateY(${-10 + 10 * ez(cam)}deg) translateX(${(1 - u) * 800}px)`, opacity: cl(u * 2) }}>
        <div style={{ background: "#FFFDF8", padding: 14, borderRadius: 4, boxShadow: `0 50px 90px ${C.shadow}` }}>
          <div style={{ width: W, height: H, overflow: "hidden", position: "relative", background: "#222" }}>
            {useAv ? <OffthreadVideo src={avSrc(a)} startFrom={fr(avAt(a))} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + 0.08 * cam})` }} />}
          </div>
        </div>
        <div style={{ position: "absolute", left: -60, bottom: -50, opacity: t, transform: `translateY(${(1 - t) * 40}px) rotate(-2deg)` }}><Chip txt={title} size={64} maxW={980} /></div>
        {sub ? <div style={{ position: "absolute", right: -20, top: -40, opacity: s2, transform: `scale(${0.7 + 0.3 * s2}) rotate(3deg)` }}><Chip txt={sub} size={40} bg={C.red} color="#fff" maxW={700} /></div> : null}
      </div>
      <Grade vig={0.4} />
    </Stage>
  );
};

// ── TARJETA DE PASOS: papel rayado a la izquierda que se tilda + foto grande del paso activo a la derecha ──
export const StepCard: P<{ head: string; page?: string; steps: { t: number; txt: string; k: string }[]; bed?: string }> = ({ a, d, head, page, steps, bed }) => {
  const { f, at } = useT(a);
  const c = sp(f, 0, 14, 110);
  const act = steps.reduce((m, s, i) => (f >= at(s.t) ? i : m), -1);
  const st0 = (i: number) => (i === 0 ? 0 : at(steps[i].t));
  const longest = steps.reduce((m, s) => Math.max(m, s.txt.length), 1);
  const lines = steps.length <= 3 ? 2 : 1;
  const sz = Math.min(fit("x".repeat(longest), 660, 54, "hand", lines), steps.length > 4 ? 44 : 54);
  return (
    <Stage f={f} T={d} drift={0.5}>
      <Bed k={bed || steps[0].k} f={f} T={d} dim={0.5} />
      {steps.map((s, i) => {
        const on = sp(f, st0(i), 15, 130), off = i < steps.length - 1 ? sp(f, st0(i + 1), 15, 130) : 0;
        if (f < st0(i) - 2 || off > 0.999) return null;
        return (
          <div key={i} style={{ position: "absolute", left: 1350, top: 560, translate: "-50% -50%",
            transform: `perspective(1600px) rotateY(-8deg) translateX(${(1 - on) * 900 - off * 1300}px) rotateZ(${(i % 2 ? 1.5 : -1.5)}deg)`, opacity: cl(on * 2) * (1 - off) }}>
            <Print k={s.k} w={860} h={550} f={f} mat={15} />
            <div style={{ position: "absolute", right: -26, top: -34 }}><Chip txt={`STEP ${i + 1}`} size={40} bg={C.lilacDeep} color="#fff" rot={-4} /></div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 70, top: 110, width: 800, transform: `translateX(${(1 - c) * -700}px) rotate(-1.5deg)`, opacity: cl(c * 2) }}>
        <div style={{ background: C.paper, borderRadius: 6, padding: "34px 40px 40px", boxShadow: "0 50px 90px rgba(0,0,0,0.5)",
          backgroundImage: "repeating-linear-gradient(180deg, rgba(0,0,0,0) 0 57px, rgba(90,120,170,0.18) 57px 58px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, marginBottom: 18 }}>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: fit(head.toUpperCase(), page ? 500 : 700, 40, "label", 2, 5), letterSpacing: 5, color: C.lilacDeep, lineHeight: 1.1 }}>{head}</div>
            {page ? <div style={{ flex: "none" }}><Chip txt={page} size={30} bg={C.red} color="#fff" rot={3} /></div> : null}
          </div>
          {steps.map((s, i) => {
            const u = sp(f, at(s.t), 14, 170);
            return (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start", marginTop: 14, opacity: 0.25 + 0.75 * u, transform: `translateX(${(1 - u) * -20}px)` }}>
                <div style={{ position: "relative", minWidth: 46, height: 46, borderRadius: 8, border: `3px solid ${i === act ? C.red : C.inkSoft}`, marginTop: 6 }}>
                  {f > at(s.t) + 4 ? <svg width={46} height={46} style={{ position: "absolute", left: -3, top: -3 }}><path d="M 9 24 L 19 34 L 38 10" fill="none" stroke={C.red} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - eo((f - at(s.t) - 4) / 6)} /></svg> : null}
                </div>
                <div style={{ fontFamily: HAND, fontSize: sz, lineHeight: 1.12, color: C.pen }}>{s.txt}</div>
              </div>
            );
          })}
        </div>
      </div>
      <Grade vig={0.38} />
    </Stage>
  );
};

// ── EL ERROR: foto con círculo rojo + sello + frase (la frase entra en `t`) ──
export const MistakeStamp: P<{ k: string; txt: string; stamp?: string; cx?: number; cy?: number; t?: number }> = ({ a, d, k, txt, stamp = "THE MISTAKE", cx = 62, cy = 60, t }) => {
  const { f, at } = useT(a);
  const s = sp(f, 4, 11, 240), tt = sp(f, t != null ? at(t) : 14, 14, 160);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1.08 + 0.1 * f / d})`, transformOrigin: `${cx}% ${cy}%` }}>
        <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.85)" }} />
        <Mark kind="circle" x={cx * 19.2 - 230} y={cy * 10.8 - 170} w={460} h={330} f={f} at={8} dur={10} sw={11} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(10,8,14,0.66) 0%, rgba(10,8,14,0) 58%)" }} />
      <div style={{ position: "absolute", left: 110, top: 190, transform: `rotate(-6deg) scale(${2.2 - 1.2 * s})`, opacity: cl(s * 3), transformOrigin: "0 50%" }}>
        <div style={{ border: `9px solid ${C.red}`, borderRadius: 12, padding: "6px 30px", fontFamily: LABEL, fontWeight: 700, fontSize: fit(stamp, 760, 92, "label", 1, 6), color: C.red, letterSpacing: 6, background: "rgba(255,248,240,0.88)", boxShadow: "0 20px 50px rgba(0,0,0,0.45)", whiteSpace: "nowrap" }}>{stamp}</div>
      </div>
      <div style={{ position: "absolute", left: 120, top: 400, width: 780, opacity: tt, transform: `translateY(${(1 - tt) * 30}px)`, fontFamily: SERIF, fontWeight: 800, fontSize: fit(txt, 780, 72, "serif", 4), lineHeight: 1.08, color: C.porc, textShadow: shadowTxt }}>{txt}</div>
      <Grade />
      <Grain />
    </AbsoluteFill>
  );
};

// ── ETIQUETA DE PRECIO: cuelga y se balancea; opcional precio de tienda tachado que entra en vs.t ──
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
        <div style={{ position: "relative", width: 560, boxSizing: "border-box", padding: "50px 40px 46px", background: C.paper, borderRadius: "60px 18px 18px 18px", boxShadow: "0 60px 100px rgba(0,0,0,0.5)", textAlign: "center",
          clipPath: "polygon(18% 0, 82% 0, 100% 16%, 100% 100%, 0 100%, 0 16%)" }}>
          <div style={{ width: 34, height: 34, borderRadius: 99, background: "#d8cfbd", margin: "-10px auto 14px", boxShadow: "inset 0 3px 6px rgba(0,0,0,0.3)" }} />
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fit(price, 470, 230, "serif"), lineHeight: 0.9, color: C.lilacDeep, whiteSpace: "nowrap" }}>{price}</div>
          <div style={{ fontFamily: HAND, fontSize: fit(sub, 470, 54, "hand", 2), lineHeight: 1.05, color: C.ink, marginTop: 10 }}>{sub}</div>
        </div>
      </div>
      {vs ? (
        <div style={{ position: "absolute", left: 1330, top: 330, opacity: v, transform: `translateY(${(1 - v) * 60}px) rotate(4deg)` }}>
          <div style={{ position: "relative", width: 440, boxSizing: "border-box", padding: "36px 30px", background: "#EDE7DA", borderRadius: 14, boxShadow: "0 40px 70px rgba(0,0,0,0.45)", textAlign: "center" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fit(vs.price, 380, 150, "serif"), color: "#8B8275", whiteSpace: "nowrap" }}>{vs.price}</div>
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: fit(vs.txt.toUpperCase(), 380, 34, "label", 2, 4), letterSpacing: 4, color: "#8B8275" }}>{vs.txt}</div>
            <Mark kind="strike" x={20} y={70} w={400} h={110} f={f} at={at(vs.t) + 8} dur={8} sw={13} />
          </div>
        </div>
      ) : null}
      <Grade vig={0.4} />
    </Stage>
  );
};

// ── NOTA A MANO (dichos de mamá, de Bernice): tarjeta rayada; cada renglón se escribe en SU palabra si trae `t` ──
type Line = string | { txt: string; t: number };
export const Note: P<{ lines: Line[]; sig?: string; k: string; chip?: { txt: string; t: number }; size?: number }> = ({ a, d, lines, sig, k, chip, size = 96 }) => {
  const { f, at } = useT(a);
  const c = sp(f, 0, 14, 120);
  const ch = chip ? sp(f, at(chip.t), 12, 200) : 0;
  const L = lines.map((l) => (typeof l === "string" ? { txt: l, t: undefined as number | undefined } : l));
  const longest = L.reduce((m, l) => Math.max(m, l.txt.length), 1);
  const sz = Math.min(size, fit("x".repeat(longest), 940, size, "hand"), L.length > 4 ? 70 : size);
  let last = 3;
  const st = L.map((l, i) => { const s0 = l.t != null ? at(l.t) : 3 + i * 16; const s1 = s0 + Math.max(14, l.txt.length * 0.9); last = Math.max(last, s1); return [s0, s1]; });
  return (
    <AbsoluteFill>
      <Bed k={k} f={f} T={d} dim={0.45} />
      <div style={{ position: "absolute", left: 960, top: 520, translate: "-50% -50%", transform: `perspective(1600px) rotateX(${(1 - c) * 40}deg) rotateZ(${-2.5 + 1.5 * f / d}deg) translateY(${(1 - c) * 400}px) scale(${1 + 0.04 * f / d})` }}>
        <div style={{ position: "relative", width: 1240, minHeight: 460, padding: "80px 110px 120px 170px", boxSizing: "border-box", background: "#F8F1DF", borderRadius: 6, boxShadow: "0 60px 110px rgba(0,0,0,0.55)",
          backgroundImage: "repeating-linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 62px, rgba(90,120,170,0.25) 63px, rgba(0,0,0,0) 64px)", overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 120, top: 0, bottom: 0, width: 2, background: "rgba(200,70,70,0.35)" }} />
          {L.map((l, i) => {
            const w = lin(f, st[i][0], st[i][1], 0, 1, (x) => x);
            return <div key={i} style={{ fontFamily: HAND, fontSize: sz, lineHeight: 1.12, whiteSpace: "nowrap", color: "#2E3B63", clipPath: `inset(0 ${100 - w * 100}% 0 0)` }}>{l.txt}</div>;
          })}
          {sig ? <div style={{ position: "absolute", right: 110, bottom: 36, fontFamily: HAND, fontSize: 72, color: "#2E3B63", opacity: lin(f, last, last + 9, 0, 1) }}>— {sig}</div> : null}
        </div>
        <div style={{ position: "absolute", left: 540, top: -26, width: 170, height: 52, background: "rgba(236,226,196,0.85)", transform: "rotate(-4deg)" }} />
        {chip ? <div style={{ position: "absolute", right: -60, bottom: -40, opacity: ch, transform: `scale(${0.6 + 0.4 * ch}) rotate(-5deg)` }}><Chip txt={chip.txt} font={HAND} size={66} ls={0} bg={C.lilacDeep} color="#fff" maxW={800} /></div> : null}
      </div>
      <Grade vig={0.36} />
    </AbsoluteFill>
  );
};

// ── PÁGINA DEL LIBRO: sube de la mesa, pestaña, resaltador en `hl` (% alto); una página sola hace zoom al renglón ──
export const PageUp: P<{ pages: { src: string; tab: string; t: number; hl?: number; hlT?: number }[]; caption?: { txt: string; t: number }; k: string }> = ({ a, d, pages, caption, k }) => {
  const { f, at } = useT(a);
  const n = pages.length;
  const cap = caption ? sp(f, at(caption.t), 14, 160) : 0;
  const p0 = pages[0], hlY = 92 + ((p0.hl ?? 40) + 3) / 100 * 906;
  const hl0 = (p: { t: number; hlT?: number }) => (p.hlT != null ? at(p.hlT) : at(p.t) + 14);
  const pz = n === 1 && p0.hl != null ? eo(cl((f - hl0(p0) - 24) / 7)) : 0;
  return (
    <Stage f={f} T={d} drift={0.5}>
      <Bed k={k} f={f} T={d} dim={0.42} />
      <AbsoluteFill style={{ transform: `scale(${1 + 0.85 * pz})`, transformOrigin: `50% ${(hlY / 1080) * 100}%` }}>
        {pages.map((p, i) => {
          const up = sp(f, at(p.t), 15, 90), tab = sp(f, at(p.t) + 10, 12, 200);
          const hl = lin(f, hl0(p), hl0(p) + 20, 0, 1);
          const X = n === 1 ? 960 : 960 + (i - (n - 1) / 2) * 640;
          const w = n === 1 ? 700 : 540, h = w * 1.294;
          return (
            <div key={i} style={{ position: "absolute", left: X, top: 545, translate: "-50% -50%", transform: `perspective(1800px) rotateX(${(1 - up) * 58 + 6}deg) rotateZ(${(i % 2 ? 3 : -3) * up}deg) translateY(${(1 - up) * 300}px)`, transformOrigin: "50% 100%", opacity: cl(up * 3) }}>
              <div style={{ position: "relative", width: w, height: h, background: "#fff", boxShadow: "0 60px 100px rgba(0,0,0,0.55)", borderRadius: 3, overflow: "hidden" }}>
                <Img src={img(p.src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {p.hl != null ? <div style={{ position: "absolute", left: "6%", top: `${p.hl}%`, height: "6%", width: `${hl * 84}%`, background: "rgba(255,226,70,0.45)", mixBlendMode: "multiply", borderRadius: 6 }} /> : null}
                <AbsoluteFill style={{ background: "linear-gradient(150deg, rgba(255,250,235,0.18), rgba(0,0,0,0) 45%, rgba(20,16,30,0.18))" }} />
              </div>
              <div style={{ position: "absolute", left: -40, top: -34, transform: `translateX(${(1 - tab) * -100}px) rotate(-4deg)`, opacity: tab }}><Chip txt={p.tab} size={58} bg={C.red} color="#fff" maxW={w + 60} /></div>
            </div>
          );
        })}
      </AbsoluteFill>
      {caption ? <div style={{ position: "absolute", left: 80, right: 80, bottom: 50, textAlign: "center", opacity: cap, transform: `translateY(${(1 - cap) * 30}px)`, fontFamily: HAND, fontSize: fit(caption.txt, 1760, 74, "hand"), whiteSpace: "nowrap", color: C.porc, textShadow: shadowTxt }}>{caption.txt}</div> : null}
      <Grade vig={0.38} />
    </Stage>
  );
};

// ── LISTA QUE SE TILDA (reglas, repaso): renglones en su palabra; >6 sin fotos → 2 columnas (13 entran en pantalla) ──
export const Checklist: P<{ head: string; items: { t: number; txt: string; k?: string; no?: boolean }[]; k: string; page?: string; cols?: 1 | 2 }> = ({ a, d, head, items, k, page, cols }) => {
  const { f, at } = useT(a);
  const c = sp(f, 0, 14, 120);
  const big = items.some((x) => x.k);
  const nc = cols || (big || items.length > 6 ? 2 : 1);
  const rows = Math.ceil(items.length / nc);
  const W = nc === 2 ? 1700 : 1180;
  const rowH = Math.min(big ? 130 : 110, Math.floor((860 - 120) / rows) - (nc === 2 ? 12 : 16));
  const colW = nc === 2 ? (W - 36) / 2 : W;
  const textW = colW - (big ? 190 + 22 : 0) - 52 - 22 - 52;
  const longest = items.reduce((m, x) => (x.txt.length > m.length ? x.txt : m), "");
  const tsz = Math.min(Math.floor(rowH * 0.42), fit(longest.toUpperCase(), textW, 44, "label", 1, 1.5));
  const hsz = fit(head, page ? W - 260 : W, 84, "serif");
  return (
    <Stage f={f} T={d} drift={0.5}>
      <Bed k={k} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 960, top: 540, translate: "-50% -50%", width: W, opacity: cl(c * 2), transform: `translateY(${(1 - c) * 120}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 22 }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: hsz, whiteSpace: "nowrap", color: C.porc, textShadow: shadowTxt }}>{head}</div>
          {page ? <div style={{ flex: "none" }}><Chip txt={page} size={36} bg={C.red} color="#fff" rot={3} /></div> : null}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: nc === 2 ? "1fr 1fr" : "1fr", gridAutoFlow: nc === 2 ? "column" : "row", gridTemplateRows: nc === 2 ? `repeat(${rows}, auto)` : undefined, gap: nc === 2 ? "12px 36px" : 16 }}>
          {items.map((x, i) => {
            const u = sp(f, at(x.t), 14, 170);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 22, height: rowH, boxSizing: "border-box", background: "rgba(251,245,230,0.95)", borderRadius: 10, padding: big ? "8px 22px 8px 8px" : "0 26px", boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
                opacity: cl(u * 2), transform: `translateX(${(1 - u) * (i % 2 ? 80 : -80)}px) rotate(${(i % 2 ? 0.5 : -0.5)}deg)` }}>
                {x.k ? <div style={{ width: (rowH - 16) * 1.78, height: rowH - 16, overflow: "hidden", borderRadius: 6, flex: "none" }}><Img src={img(x.k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div> : null}
                <Tick f={f} at={at(x.t) + 5} no={x.no} size={Math.min(52, rowH - 20)} />
                <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: tsz, letterSpacing: 1.5, color: C.ink, textTransform: "uppercase", whiteSpace: "nowrap" }}>{x.txt}</div>
              </div>
            );
          })}
        </div>
      </div>
      <Grade vig={0.4} />
    </Stage>
  );
};

// ── NUNCA JUNTOS: filas "A ✕ B, C" que golpean en su palabra; veredicto opcional en verdict.t ──
export const NeverMix: P<{ head?: string; tag?: string; rows: { t: number; a: string; b: string[] }[]; k: string; verdict?: { t: number; txt: string } }> = ({ a, d, head = "Never mix these", tag, rows, k, verdict }) => {
  const { f, at } = useT(a);
  const h = sp(f, 0, 13, 160);
  const gap = Math.min(230, 640 / Math.max(1, rows.length));
  return (
    <Stage f={f} T={d} drift={0.4}>
      <Bed k={k} f={f} T={d} dim={0.6} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 90, textAlign: "center", opacity: h, transform: `translateY(${(1 - h) * -40}px)`, whiteSpace: "nowrap" }}>
        {tag ? <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 10, color: C.lilac }}>{tag} · </span> : null}
        <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fit(head, tag ? 1400 : 1700, 100, "serif"), color: C.porc, textShadow: shadowTxt }}>{head}</span>
      </div>
      {rows.map((r, i) => {
        const u = sp(f, at(r.t), 12, 200);
        const all = r.a.length + r.b.join("").length + r.b.length * 3;
        const s = Math.min(62, fit("X".repeat(all), 1500, 62, "label", 1, 3));
        return (
          <div key={i} style={{ position: "absolute", left: 960, top: 300 + i * gap, translate: "-50% 0", display: "flex", alignItems: "center", gap: 30, opacity: cl(u * 2), transform: `scale(${1.3 - 0.3 * u})` }}>
            <Chip txt={r.a} size={s} rot={-2} />
            <div style={{ width: 96, height: 96, borderRadius: 99, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 14px 30px rgba(0,0,0,0.45)", transform: `rotate(${(1 - u) * 180}deg)`, flex: "none" }}>
              <svg width={52} height={52}><path d="M 8 8 L 44 44 M 44 8 L 8 44" stroke="#fff" strokeWidth={10} strokeLinecap="round" /></svg>
            </div>
            <div style={{ display: "flex", gap: 14, flexWrap: "nowrap" }}>
              {r.b.map((b, j) => { const v = sp(f, at(r.t) + 4 + j * 4, 13, 200); return <div key={j} style={{ opacity: v, transform: `translateY(${(1 - v) * 30}px)` }}><Chip txt={b} size={s * 0.75} rot={j % 2 ? 2 : -1.5} bg="#F1E4E1" /></div>; })}
            </div>
          </div>
        );
      })}
      {verdict ? (() => { const g = sp(f, at(verdict.t), 11, 220); return (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center", opacity: cl(g * 2), transform: `scale(${1.5 - 0.5 * g}) rotate(-3deg)` }}>
          <span style={{ border: `9px solid ${C.red}`, borderRadius: 12, padding: "6px 34px", fontFamily: LABEL, fontWeight: 700, fontSize: fit(verdict.txt, 1500, 96, "label", 1, 6), color: C.red, letterSpacing: 6, background: "rgba(255,248,240,0.9)", boxShadow: "0 20px 50px rgba(0,0,0,0.45)", whiteSpace: "nowrap" }}>{verdict.txt}</span>
        </div>); })() : null}
      <Grade vig={0.42} />
    </Stage>
  );
};

// ── DESFILE: cada cosa a PANTALLA COMPLETA (su foto) entra barriendo en su t; número + nombre + uso a la izquierda ──
export const Lineup: P<{ items: { t: number; name: string; use: string; k: string }[]; head?: string }> = ({ a, d, items, head }) => {
  const { f, at } = useT(a);
  const act = items.reduce((m, s, i) => (f >= at(s.t) ? i : m), 0);
  const it = items[act];
  const u = sp(f, at(it.t), 12, 190);
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {items.map((s, i) => {
        const s0 = i === 0 ? 0 : Math.max(0, at(s.t)), s1 = i < items.length - 1 ? at(items[i + 1].t) : d;
        if (f < s0 - 1 || f > s1 + 6) return null;
        const on = i === 0 ? 1 : eo(cl((f - s0 + 1) / 6));
        const k2 = (f - s0) / Math.max(1, s1 - s0);
        const punch = s1 - s0 > 50 && k2 >= 0.5 ? 1.3 : 1;
        return (
          <AbsoluteFill key={i} style={{ transform: `translateX(${(1 - on) * 1920}px)`, filter: on < 0.98 ? `blur(${(1 - on) * 24}px)` : undefined }}>
            <AbsoluteFill style={{ transform: `scale(${(1.04 + 0.06 * k2) * punch})`, transformOrigin: i % 2 ? "62% 48%" : "70% 55%" }}>
              <Img src={img(s.k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </AbsoluteFill>
          </AbsoluteFill>
        );
      })}
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(14,10,22,0.82) 0%, rgba(14,10,22,0.55) 38%, rgba(0,0,0,0) 62%)" }} />
      {head ? <div style={{ position: "absolute", left: 110, top: 80, fontFamily: LABEL, fontWeight: 700, fontSize: fit(head, 800, 38, "label", 1, 10), letterSpacing: 10, color: C.lilac, whiteSpace: "nowrap" }}>{head}</div> : null}
      <div style={{ position: "absolute", left: 100, top: 160, display: "flex", alignItems: "flex-end", gap: 10 }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 330, lineHeight: 0.84, color: C.porc, textShadow: shadowTxt, transform: `translateY(${(1 - u) * 40}px) scale(${1.15 - 0.15 * u})`, transformOrigin: "0% 100%" }}>{act + 1}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 90, color: "rgba(251,248,242,0.5)", marginBottom: 30 }}>/{items.length}</div>
      </div>
      <div style={{ position: "absolute", left: 110, top: 520, width: 800, opacity: u, transform: `translateX(${(1 - u) * -60}px)` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: fit(it.name, 800, 80, "serif", 2), lineHeight: 1.02, color: C.porc, textShadow: shadowTxt }}>{it.name}</div>
        <div style={{ fontFamily: HAND, fontSize: fit(it.use, 800, 60, "hand", 2), color: "#EADFF5", marginTop: 14, textShadow: shadowTxt }}>{it.use}</div>
      </div>
      <div style={{ position: "absolute", left: 114, bottom: 90, display: "flex", gap: 16 }}>
        {items.map((_, i) => <div key={i} style={{ width: i <= act ? 46 : 16, height: 16, borderRadius: 9, background: i <= act ? C.lilac : "rgba(255,255,255,0.3)" }} />)}
      </div>
      <Grade vig={0.35} />
    </AbsoluteFill>
  );
};

// ── NÚMERO GRANDE: cuenta hasta `num` desde `t` (o el corte) sobre la foto; prefijo/sufijo opcionales ($, %) ──
export const BigNumber: P<{ num: number; unit: string; txt?: string; k: string; t?: number; prefix?: string; suffix?: string; dur?: number }> = ({ a, d, num, unit, txt, k, t, prefix = "", suffix = "", dur = 24 }) => {
  const { f, at } = useT(a);
  const t0 = t != null ? at(t) : 0;
  const c = eo((f - t0) / dur), u = sp(f, t0, 13, 150), tt = sp(f, t0 + dur, 14, 160);
  const shown = `${prefix}${Math.round(num * c).toLocaleString("en-US")}${suffix}`, full = `${prefix}${num.toLocaleString("en-US")}${suffix}`;
  return (
    <Stage f={f} T={d} drift={0.8}>
      <Bed k={k} f={f} T={d} dim={0.4} z={[1.05, 1.15]} />
      <div style={{ position: "absolute", left: 60, right: 60, top: 210, textAlign: "center", opacity: u, transform: `scale(${1.2 - 0.2 * u})` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fit(full, 1700, 380, "serif"), lineHeight: 0.9, color: C.porc, textShadow: "0 20px 60px rgba(0,0,0,0.6)", fontVariantNumeric: "tabular-nums" }}>{shown}</div>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: fit(unit, 1700, 72, "label", 1, 18), letterSpacing: 18, color: C.lilac, marginTop: 6, whiteSpace: "nowrap" }}>{unit}</div>
      </div>
      {txt ? <div style={{ position: "absolute", left: 100, right: 100, bottom: 110, textAlign: "center", opacity: tt, fontFamily: HAND, fontSize: fit(txt, 1720, 70, "hand", 2), color: C.porc, textShadow: shadowTxt }}>{txt}</div> : null}
      <Grade vig={0.45} />
    </Stage>
  );
};

// ── MINIATURA DE OTRO VIDEO: tarjeta 3D que orbita + título palabra por palabra en su t; sale entrando a la miniatura ──
export const Thumb: P<{ thumb: string; tag: string; words: [string, number][]; k: string; push?: boolean }> = ({ a, d, thumb, tag, words, k, push = true }) => {
  const { f, at } = useT(a);
  const c = sp(f, 0, 14, 110), tg = sp(f, 8, 13, 180), cam = f / d;
  const all = words.map((w) => w[0]).join(" ");
  const ws = fit(all, 1640, 70, "serif", 2);
  return (
    <Stage f={f} T={d} push={push ? [50, 39.8, 2.4] : undefined} drift={0.5}>
      <Bed k={k} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 960, top: 420, translate: "-50% -50%", transform: `perspective(1800px) rotateY(${22 - 26 * cam}deg) rotateX(${6 - 4 * cam}deg) translateY(${(1 - c) * 500}px) scale(${0.9 + 0.1 * c})`, opacity: cl(c * 2) }}>
        <div style={{ position: "relative", width: 1000, height: 562, borderRadius: 18, overflow: "hidden", boxShadow: "0 70px 120px rgba(0,0,0,0.6), 0 0 0 2px rgba(255,255,255,0.25)" }}>
          <Img src={img(thumb)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.03 + 0.04 * cam})` }} />
          <div style={{ position: "absolute", top: "-40%", bottom: "-40%", width: "26%", left: `${-40 + ((f * 1.2) % 220)}%`, transform: "rotate(14deg)", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.2), rgba(255,255,255,0))" }} />
        </div>
        <div style={{ position: "absolute", right: -30, top: -50, opacity: tg, transform: `scale(${0.7 + 0.3 * tg}) rotate(-4deg)` }}><Chip txt={tag} size={46} bg={C.red} color="#fff" maxW={700} /></div>
      </div>
      <div style={{ position: "absolute", left: 140, right: 140, top: 770, textAlign: "center" }}>
        {words.map(([w, t], i) => { const u = sp(f, at(t), 15, 200); return <span key={i} style={{ display: "inline-block", marginRight: ws * 0.28, fontFamily: SERIF, fontWeight: 800, fontSize: ws, color: C.porc, opacity: u, transform: `translateY(${(1 - u) * 30}px)`, textShadow: shadowTxt }}>{w}</span>; })}
      </div>
      <Grade vig={0.4} />
    </Stage>
  );
};

// ── CTA DEL MEDIO: tapa del libro + QR que aparece en `t` y late (≥ 8 s en pantalla) ──
export const QrCard: P<{ k: string; t: number; txt?: string; qr?: string; cover?: string }> = ({ a, d, k, t, txt = "point your phone here", qr, cover }) => {
  const { f, at } = useT(a);
  const b = sp(f, 0, 14, 110), q = sp(f, at(t), 12, 160), cam = f / d;
  const pulse = 1 + 0.025 * Math.sin((f - at(t)) / 5) * (f > at(t) + 10 ? 1 : 0);
  return (
    <Stage f={f} T={d} drift={0.4}>
      <Bed k={k} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 640, top: 540, translate: "-50% -50%", transform: `perspective(1600px) rotateY(${18 - 10 * cam}deg) translateY(${(1 - b) * 600}px) rotateZ(-3deg)` }}>
        <Img src={img(cover || KCFG.cover)} style={{ width: 520, borderRadius: 6, boxShadow: "0 60px 110px rgba(0,0,0,0.6)" }} />
      </div>
      <div style={{ position: "absolute", left: 1330, top: 500, translate: "-50% -50%", opacity: q, transform: `scale(${(0.7 + 0.3 * q) * pulse}) rotate(2deg)` }}>
        <div style={{ background: "#fff", padding: 30, borderRadius: 18, boxShadow: "0 60px 110px rgba(0,0,0,0.55)" }}>
          <Img src={img(qr || KCFG.qr)} style={{ width: 420, height: 420, display: "block" }} />
        </div>
        <div style={{ textAlign: "center", marginTop: 26, width: 480, fontFamily: HAND, fontSize: fit(txt, 640, 60, "hand"), marginLeft: -0, whiteSpace: "nowrap", color: C.porc, textShadow: shadowTxt }}>{txt}</div>
      </div>
      <Grade vig={0.38} />
    </Stage>
  );
};

// ── COMENTARIOS: caja de comentario genérica que se escribe sola + opciones que entran en su t ──
export const Comment: P<{ q: string; opts: { txt: string; t: number }[]; k: string }> = ({ a, d, q, opts, k }) => {
  const { f, at } = useT(a);
  const c = sp(f, 0, 14, 120);
  const n = Math.floor(lin(f, 6, 6 + q.length * 0.9, 0, q.length, (x) => x));
  const qs = fit(q, 1090, 56, "serif", 2);
  const os = Math.min(60, fit(opts.map((o) => o.txt).join("    "), 1700 - opts.length * 60, 60, "label", 1, 3));
  return (
    <Stage f={f} T={d} drift={0.5}>
      <Bed k={k} f={f} T={d} dim={0.5} />
      <div style={{ position: "absolute", left: 960, top: 360, translate: "-50% -50%", width: 1300, opacity: c, transform: `translateY(${(1 - c) * 100}px)` }}>
        <div style={{ background: "#FFFDF8", borderRadius: 22, padding: "36px 44px", boxShadow: "0 50px 100px rgba(0,0,0,0.5)", display: "flex", gap: 30, alignItems: "flex-start" }}>
          <div style={{ width: 90, height: 90, borderRadius: 99, background: C.lilac, flex: "none" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: LABEL, fontSize: 32, letterSpacing: 2, color: "#8B8275" }}>ADD A COMMENT…</div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: qs, lineHeight: 1.15, color: C.ink, marginTop: 8, minHeight: 70 }}>{q.slice(0, n)}<span style={{ opacity: f % 20 < 10 ? 1 : 0 }}>|</span></div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 40, right: 40, top: 660, display: "flex", justifyContent: "center", gap: 40 }}>
        {opts.map((o, i) => { const u = sp(f, at(o.t), 12, 200); return <div key={i} style={{ opacity: u, transform: `translateY(${(1 - u) * 50}px) scale(${0.8 + 0.2 * u})` }}><Chip txt={o.txt} size={os} rot={[-3, 2, -1][i % 3]} bg={i === 0 ? C.lilacDeep : "#FFFDF4"} color={i === 0 ? "#fff" : C.ink} /></div>; })}
      </div>
      <Grade vig={0.4} />
    </Stage>
  );
};

// ── RECUERDO: polaroid sepia con fecha y leyenda escritas (entran en `t`) ──
export const Memory: P<{ k: string; caption: string; date: string; t?: number }> = ({ a, d, k, caption, date, t }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 13, 100), c = sp(f, t != null ? at(t) : 12, 14, 160), cam = f / d;
  return (
    <Stage f={f} T={d} drift={0.8}>
      <Bed k={k} f={f} T={d} dim={0.55} />
      <AbsoluteFill style={{ background: "rgba(90,60,20,0.18)", mixBlendMode: "multiply" }} />
      <div style={{ position: "absolute", left: 960, top: 520, translate: "-50% -50%", transform: `rotate(${-4 + 2 * cam}deg) translateY(${(1 - u) * 600}px) scale(${1 + 0.04 * cam})` }}>
        <div style={{ position: "relative", background: "#F6F0E2", padding: "30px 30px 120px", boxShadow: "0 60px 110px rgba(0,0,0,0.6)" }}>
          <div style={{ width: 980, height: 551, overflow: "hidden" }}><Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(0.75) contrast(1.05) brightness(0.95)", transform: `scale(${1.05 + 0.06 * cam})` }} /></div>
          <div style={{ position: "absolute", left: 50, bottom: 22, width: 900, fontFamily: HAND, fontSize: fit(caption, 900, 52, "hand", 2), lineHeight: 1.05, color: "#3A3A52", opacity: c }}>{caption}</div>
          <div style={{ position: "absolute", right: 50, top: 2, fontFamily: HAND, fontSize: 36, color: "#7A5A3A", opacity: c }}>{date}</div>
        </div>
      </div>
      <Grade vig={0.5} />
      <Grain />
    </Stage>
  );
};

// ── CUIDADO: cinta de precaución que cruza + rótulo + la frase grande (entra en `t` o enseguida) ──
export const Careful: P<{ k: string; vid?: boolean; txt: string; tag: string; t?: number }> = ({ a, d, k, vid, txt, tag, t }) => {
  const { f, at } = useT(a);
  const tp = eo(f / 14), tt = sp(f, t != null ? at(t) : 10, 14, 150);
  return (
    <AbsoluteFill>
      <FullPhoto k={k} vid={vid} f={f} d={d} dim={0.2} />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,8,14,0.55) 0%, rgba(10,8,14,0) 45%, rgba(10,8,14,0.6) 100%)" }} />
      <div style={{ position: "absolute", left: -100, top: 70, width: 2200 * tp, height: 74, transform: "rotate(-2deg)", background: `repeating-linear-gradient(-45deg, ${C.tape} 0 46px, #1E1A14 46px 92px)`, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }} />
      <div style={{ position: "absolute", left: 120, top: 190, opacity: tt, transform: `translateX(${(1 - tt) * -40}px) rotate(-2deg)` }}><Chip txt={tag} size={50} bg={C.tape} color="#1E1A14" maxW={1500} /></div>
      <div style={{ position: "absolute", left: 120, right: 260, bottom: 120, opacity: tt, transform: `translateY(${(1 - tt) * 40}px)`, fontFamily: SERIF, fontWeight: 900, fontSize: fit(txt, 1540, 100, "serif", 3), lineHeight: 1.05, color: C.porc, textShadow: shadowTxt }}>{txt}</div>
      <Grade vig={0.3} />
    </AbsoluteFill>
  );
};

// ── SÍ / NO: dos fotos enmarcadas; la del NO se tacha en no.t, la del SÍ recibe el tilde en yes.t ──
export const DoDont: P<{ k: string; no: { k: string; txt: string; t: number }; yes: { k: string; txt: string; t: number } }> = ({ a, d, k, yes, no }) => {
  const { f, at } = useT(a);
  const N = sp(f, at(no.t), 13, 150), Y = sp(f, at(yes.t), 13, 150);
  const card = (x: { k: string; txt: string }, u: number, X: number, good: boolean, R: number) => (
    <div style={{ position: "absolute", left: X, top: 480, translate: "-50% -50%", opacity: cl(u * 2), transform: `translateY(${(1 - u) * 300}px) rotate(${R}deg)` }}>
      <Print k={x.k} w={720} h={460} f={f} />
      <div style={{ position: "absolute", left: "50%", top: "45%", translate: "-50% -50%", width: 180, height: 180, borderRadius: 99, background: good ? C.sage : C.red, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.45)", transform: `scale(${eo(cl((f - (good ? at(yes.t) : at(no.t)) - 8) / 8))})` }}>
        <svg width={100} height={100}>{good ? <path d="M18 52 L42 76 L84 26" stroke="#fff" strokeWidth={16} fill="none" strokeLinecap="round" /> : <path d="M22 22 L78 78 M78 22 L22 78" stroke="#fff" strokeWidth={16} strokeLinecap="round" />}</svg>
      </div>
      <div style={{ position: "absolute", left: -40, right: -40, bottom: -86, textAlign: "center" }}><Chip txt={x.txt} size={44} bg={good ? "#FFFDF4" : C.red} color={good ? C.ink : "#fff"} rot={-R} maxW={820} /></div>
    </div>
  );
  return (
    <Stage f={f} T={d} drift={0.5}>
      <Bed k={k} f={f} T={d} dim={0.55} />
      {card(no, N, 520, false, -2.5)}
      {card(yes, Y, 1400, true, 2)}
      <Grade vig={0.4} />
    </Stage>
  );
};

// ── ARCHIVO REAL: película de dominio público (4:3) sobre su propio desenfoque, temblor de gate y parpadeo; o foto real enmarcada ──
export const Arc: P<{ src: string; vid?: boolean; cap: string; big?: string; credit?: string; ofs?: number }> = ({ a, d, src, vid, cap, big, credit, ofs = 0 }) => {
  const { f } = useT(a);
  const c = sp(f, 8, 14, 150), b = big ? sp(f, 14, 12, 170) : 0;
  const wx = Math.sin(f * 1.7) * 1.2 + Math.sin(f * 0.37) * 0.8, wy = Math.cos(f * 2.3) * 0.9;
  const fl = 1 + 0.035 * Math.sin(f * 3.1) * Math.sin(f * 0.7);
  const W = big ? 1180 : 1360, H = W * 0.75, X = big ? 690 : 960;
  const media = (st: React.CSSProperties) => vid ? <OffthreadVideo src={staticFile(src.includes("/") ? src : `${KCFG.arcDir}/${src}.mp4`)} startFrom={fr(ofs)} muted style={st} /> : <Img src={img(src)} style={st} />;
  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0b09", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(30px) brightness(0.35) saturate(0.7)", transform: "scale(1.3)" }}>{media({ width: "100%", height: "100%", objectFit: "cover" })}</AbsoluteFill>
      <div style={{ position: "absolute", left: X, top: 520, width: W, height: H, translate: "-50% -50%", transform: `translate(${wx}px, ${wy}px) scale(${1 + 0.03 * f / d})`, boxShadow: "0 50px 100px rgba(0,0,0,0.7)", overflow: "hidden", borderRadius: vid ? 10 : 3, outline: vid ? undefined : "14px solid #FFFDF8" }}>
        <div style={{ width: "100%", height: "100%", filter: `brightness(${fl}) contrast(1.04)` }}>{media({ width: "100%", height: "100%", objectFit: "cover" })}</div>
        <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)" }} />
      </div>
      <div style={{ position: "absolute", left: X - W / 2 - 20, bottom: 34, opacity: c, transform: `translateY(${(1 - c) * 30}px) rotate(-1.5deg)`, display: "flex", gap: 14, alignItems: "center" }}>
        <Chip txt={vid ? "REAL FOOTAGE" : "REAL PHOTO"} size={30} bg={C.red} color="#fff" rot={0} />
        <Chip txt={cap} size={46} font={HAND} ls={0} rot={0} maxW={W - 240} />
      </div>
      {credit ? <div style={{ position: "absolute", right: 30, bottom: 12, fontFamily: LABEL, fontSize: 20, letterSpacing: 1, color: "rgba(255,255,255,0.55)" }}>{credit}</div> : null}
      {big ? <div style={{ position: "absolute", left: 1310, right: 50, top: 300, textAlign: "center", opacity: b, transform: `scale(${1.25 - 0.25 * b})` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fit(big.split(" ")[0], 540, 250, "serif"), lineHeight: 0.9, color: C.porc, textShadow: shadowTxt, whiteSpace: "nowrap" }}>{big.split(" ")[0]}</div>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: fit(big.split(" ").slice(1).join(" "), 540, 64, "label", 2, 12), letterSpacing: 12, color: C.lilac }}>{big.split(" ").slice(1).join(" ")}</div>
      </div> : null}
      <Grain />
    </AbsoluteFill>
  );
};

// ── PINES sobre la foto: lugares numerados en su t; opcional media pantalla "equivocada" en wrong.t ──
export const Pins: P<{ k: string; head: string; pins: { x: number; y: number; t: number; txt: string }[]; wrong?: { t: number; txt: string } }> = ({ a, d, k, head, pins, wrong }) => {
  const { f, at } = useT(a);
  const h = sp(f, 0, 13, 160), w = wrong ? lin(f, at(wrong.t), at(wrong.t) + 14, 0, 1) : 0;
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
              <div style={{ position: "absolute", ...(p.x > 60 ? { right: 80 } : { left: 80 }), top: 10 }}><Chip txt={p.txt} size={44} rot={-2} maxW={Math.max(300, (p.x > 60 ? p.x : 100 - p.x) * 19.2 - 140)} /></div>
            </div>
          );
        })}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 60, right: 60, top: 70, textAlign: "center", opacity: h, whiteSpace: "nowrap" }}>
        <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fit(head, 1800, 88, "serif"), color: C.porc, textShadow: shadowTxt }}>{head}</span>
      </div>
      {wrong ? <div style={{ position: "absolute", left: 140, bottom: 120, opacity: w, transform: `rotate(-6deg) scale(${1.4 - 0.4 * w})` }}>
        <div style={{ border: `8px solid ${C.red}`, borderRadius: 12, padding: "4px 26px", fontFamily: LABEL, fontWeight: 700, fontSize: fit(wrong.txt, 800, 70, "label", 1, 5), color: C.red, letterSpacing: 5, background: "rgba(255,248,240,0.88)", whiteSpace: "nowrap" }}>{wrong.txt}</div>
      </div> : null}
      <Grade />
      <Grain />
    </AbsoluteFill>
  );
};

// ── MARCO: la foto dentro de un marco dorado colgado; leyenda a mano en `t` ──
export const FrameArt: P<{ k: string; bed: string; caption: string; t: number }> = ({ a, d, k, bed, caption, t }) => {
  const { f, at } = useT(a);
  const u = sp(f, 0, 14, 100), c = sp(f, at(t), 14, 160);
  return (
    <Stage f={f} T={d} drift={0.8}>
      <Bed k={bed} f={f} T={d} dim={0.45} />
      <div style={{ position: "absolute", left: 960, top: 480, translate: "-50% -50%", transform: `rotate(${-1 + Math.sin(f / 30) * 0.5}deg) translateY(${(1 - u) * -600}px)` }}>
        <div style={{ padding: 46, borderRadius: 6, background: "linear-gradient(135deg, #E9CF8A, #A98234 40%, #F2DC9C 55%, #8C6A28 100%)", boxShadow: "0 60px 110px rgba(0,0,0,0.6), inset 0 0 0 6px rgba(80,56,18,0.5)" }}>
          <div style={{ padding: 24, background: "#F4EEDF", boxShadow: "inset 0 4px 12px rgba(0,0,0,0.3)" }}>
            <div style={{ width: 960, height: 540, overflow: "hidden" }}><Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + 0.06 * f / d})` }} /></div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, bottom: 50, textAlign: "center", opacity: c, transform: `translateY(${(1 - c) * 30}px)`, fontFamily: HAND, fontSize: fit(caption, 1760, 76, "hand"), whiteSpace: "nowrap", color: C.porc, textShadow: shadowTxt }}>{caption}</div>
      <Grade vig={0.42} />
    </Stage>
  );
};

// ── LINTERNA: el cuadro se oscurece; en `on` se prende un haz que viaja de `from` a `to` (%); palabras a mano en su t ──
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
      {words.map(([w, t, x, y], i) => { const u = sp(f, at(t), 14, 200); return <div key={i} style={{ position: "absolute", left: x, top: y, opacity: u, transform: `translateY(${(1 - u) * 24}px) rotate(-4deg)`, fontFamily: HAND, fontSize: fit(w, Math.max(300, 1840 - x), 96, "hand"), whiteSpace: "nowrap", color: "#F3E9D2", textShadow: "0 0 30px rgba(255,220,160,0.35)" }}>{w}</div>; })}
      <Grain />
    </AbsoluteFill>
  );
};

// ── ADELANTO: 1,5-3 s del pago que viene, desaturada → color, chip "COMING UP" ──
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
      <div style={{ position: "absolute", left: 110, right: 110, bottom: 100, opacity: u, transform: `translateX(${(1 - u) * -60}px)`, fontFamily: HAND, fontSize: fit(txt, 1700, 86, "hand", 2), lineHeight: 1.05, color: C.porc, textShadow: shadowTxt }}>{txt}</div>
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: lin(f, 0, 3, 0.55, 0) }} />
      <Grade vig={0.3} />
    </AbsoluteFill>
  );
};

// ── TEXTO CINÉTICO sobre foto/clip a pantalla completa: palabras en su t, una frase por vez (sirve de apertura) ──
export const Kinetic: P<{ k: string; vid?: boolean; words: [string, number][]; size?: number }> = ({ a, d, k, vid, words, size = 110 }) => {
  const { f, at } = useT(a);
  const G: [string, number][][] = [[]];
  words.forEach((w) => { G[G.length - 1].push(w); if (/[.!?]$/.test(w[0])) G.push([]); });
  const gs = G.filter((g) => g.length);
  const gi = gs.reduce((m, g, i) => (f >= at(g[0][1]) - 2 ? i : m), 0);
  const sz = Math.min(size, fit(gs[gi].map((w) => w[0]).join(" "), 1680, size, "serif", 2));
  return (
    <AbsoluteFill>
      <FullPhoto k={k} vid={vid} f={f} d={d} o="50% 40%" />
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,8,14,0) 40%, rgba(10,8,14,0.65) 100%)" }} />
      <div style={{ position: "absolute", left: 120, right: 120, bottom: 120, display: "flex", flexWrap: "wrap", gap: `0 ${sz * 0.26}px` }}>
        {gs[gi].map(([w, t], i) => { const u = sp(f, at(t), 14, 200);
          return <div key={gi + "_" + i} style={{ fontFamily: SERIF, fontWeight: 900, fontSize: sz, lineHeight: 1.05, color: C.porc, opacity: u, transform: `translateY(${(1 - u) * 50}px)`, textShadow: "0 8px 30px rgba(0,0,0,0.6)" }}>{w}</div>; })}
      </div>
      <Grade vig={0.35} />
    </AbsoluteFill>
  );
};

// ── MITAD Y MITAD: una línea parte la foto; rótulo izquierdo en l.t (mitad tiñe rojo), derecho en r.t (brillo), pie en foot.t ──
export const SplitHalf: P<{ k: string; vid?: boolean; l: { txt: string; t: number }; r: { txt: string; t: number }; foot?: { txt: string; t: number } }> = ({ a, d, k, vid, l, r, foot }) => {
  const { f, at } = useT(a);
  const line = eo(f / 20), L = sp(f, at(l.t), 13, 170), R = sp(f, at(r.t), 13, 170), S = foot ? sp(f, at(foot.t), 14, 160) : 0;
  const sweep = cl((f - at(r.t)) / 40);
  return (
    <AbsoluteFill>
      <FullPhoto k={k} vid={vid} f={f} d={d} />
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "50%", background: `rgba(192,57,43,${0.16 * L})` }} />
      {sweep > 0 && sweep < 1 ? <div style={{ position: "absolute", top: "-30%", bottom: "-30%", width: "16%", left: `${50 + 50 * sweep - 8}%`, transform: "rotate(10deg)", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.35), rgba(255,255,255,0))" }} /> : null}
      <div style={{ position: "absolute", left: 958, top: 0, width: 4, height: `${100 * line}%`, background: "repeating-linear-gradient(180deg, #fff 0 26px, rgba(255,255,255,0) 26px 44px)", filter: "drop-shadow(0 0 6px rgba(0,0,0,0.6))" }} />
      <div style={{ position: "absolute", left: 100, top: 130, opacity: L, transform: `translateY(${(1 - L) * 30}px) rotate(-3deg)` }}><Chip txt={l.txt} size={64} bg={C.red} color="#fff" maxW={780} /></div>
      <div style={{ position: "absolute", right: 100, top: 130, opacity: R, transform: `translateY(${(1 - R) * 30}px) rotate(3deg)` }}><Chip txt={r.txt} size={64} maxW={780} /></div>
      {foot ? <div style={{ position: "absolute", left: 80, right: 80, bottom: 100, textAlign: "center", opacity: S, fontFamily: HAND, fontSize: fit(foot.txt, 1760, 84, "hand"), whiteSpace: "nowrap", color: C.porc, textShadow: shadowTxt }}>{foot.txt}</div> : null}
      <Grade vig={0.3} />
    </AbsoluteFill>
  );
};

// ═════════ superposiciones (van ENCIMA de otro plano, pista aparte; reciben d en cuadros) ═════════
// rótulo que entra en su palabra y sale con movimiento (p. ej. "STAY FOR #9")
export const Kicker: React.FC<{ txt: string; d: number; side?: "l" | "r"; red?: boolean; hand?: boolean }> = ({ txt, d, side = "l", red, hand }) => {
  const f = useCurrentFrame();
  const u = sp(f, 0, 13, 190), o = lin(f, d - 8, d, 0, 1);
  return (
    <div style={{ position: "absolute", [side === "l" ? "left" : "right"]: 110, bottom: 130, opacity: u * (1 - o), transform: `translateX(${(side === "l" ? -1 : 1) * ((1 - u) * 80 + o * 120)}px) rotate(${side === "l" ? -2 : 2}deg)` }}>
      <Chip txt={txt} size={hand ? 64 : 52} font={hand ? HAND : LABEL} ls={hand ? 0 : 3} bg={red ? C.red : "#FFFDF4"} color={red ? "#fff" : C.ink} maxW={1500} />
    </div>
  );
};
// palabra clave grande con golpe de escala
export const Pop: React.FC<{ txt: string; d: number }> = ({ txt, d }) => {
  const f = useCurrentFrame();
  const u = sp(f, 0, 8, 260), o = lin(f, d - 5, d, 0, 1);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top: 690, textAlign: "center", opacity: cl(u * 2) * (1 - o), transform: `scale(${1.35 - 0.35 * u + 0.04 * f / Math.max(1, d)})` }}>
      <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: fit(txt, 1700, 180, "serif"), whiteSpace: "nowrap", color: C.porc, letterSpacing: 2, textShadow: "0 8px 40px rgba(0,0,0,0.75), 0 2px 6px rgba(0,0,0,0.6)" }}>{txt}</span>
      <div style={{ margin: "0 auto", marginTop: -6, width: 220 * eo(cl((f - 3) / 7)), height: 10, borderRadius: 6, background: C.lilac }} />
    </div>
  );
};

export const KIT: Record<string, React.FC<any>> = { Chapter, StepCard, MistakeStamp, CostTag, Note, PageUp, Checklist, NeverMix, Lineup, BigNumber, Thumb, QrCard, Comment, Memory, Careful, DoDont, Arc, Pins, FrameArt, Flashlight, Tease, Kinetic, SplitHalf };
export const OVERLAYS: Record<string, React.FC<any>> = { Kicker, Pop };
