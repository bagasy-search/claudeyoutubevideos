// lkit · componentes NUEVOS v2 (12-oct-2026): los que Opus pidió en las correcciones de fhkitchen (sup_plan / CORR_plan).
// Genéricos (sirven a cualquier tema Loretta: "13 cosas", "12 pasos", "9 errores"…). Tiempos = segundos ABSOLUTOS del video.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, useCurrentFrame } from "remotion";
import { SERIF, LABEL, HAND, fr, cl, ez, eo, lin, img, clip, C, Grade, Grain, Mark, Print, Chip, Bed, Stage, FullPhoto, Tick, sp, useT, fit, shadowTxt, type P } from "./core";

// ── ITEM CARD: la tarjeta grande de cada cosa. Papel a la izquierda (ITEM n OF N + número gigante + nombre + PAGE),
//    en `t` el nombre se tacha y entra "INSTEAD:" con lo que se usaba; foto real a la derecha (y la de reemplazo `k2` en `t`). ≥ 6 s ──
export const ItemCard: P<{ n: number; of?: number; word?: string; name: string; instead: string; page?: string; k: string; k2?: string; t: number; bed?: string; lab?: string }> =
  ({ a, d, n, of, word = "ITEM", name, instead, page, k, k2, t, bed, lab }) => {
    const { f, at } = useT(a);
    const c = sp(f, 0, 14, 110), nb = sp(f, 4, 12, 150), nm = sp(f, 9, 14, 160);
    const T = at(t), ins = sp(f, T, 13, 170), sw = sp(f, T, 15, 120);
    const head = of ? `${word} ${n} DE ${of}` : `${word} ${n}`;
    const nameSz = fit(name, 700, 92, "serif", 2);
    const insSz = fit(instead, 700, 80, "hand", 2);
    return (
      <Stage f={f} T={d} drift={0.5}>
        <Bed k={bed || k} f={f} T={d} dim={0.5} />
        {/* fotos a la derecha: la cosa de hoy y, en t, lo de antes encima */}
        <div style={{ position: "absolute", left: 1330, top: 530, translate: "-50% -50%", transform: `perspective(1600px) rotateY(-8deg) translateX(${(1 - c) * 900}px) rotateZ(1.5deg)`, opacity: cl(c * 2) }}>
          <Print k={k} w={880} h={590} f={f} mat={15} filter={k2 && f > T ? `saturate(${1 - 0.6 * sw})` : undefined} />
          {k2 ? <div style={{ position: "absolute", left: 250, top: 230, transform: `translateX(${(1 - sw) * 1000}px) rotate(${-4 + 1.5 * sw}deg)`, opacity: cl(sw * 3) }}>
            <Print k={k2} w={640} h={420} f={f} mat={14} />
          </div> : null}
        </div>
        {/* la tarjeta de papel */}
        <div style={{ position: "absolute", left: 70, top: 120, width: 820, transform: `translateX(${(1 - c) * -760}px) rotate(-1.5deg)`, opacity: cl(c * 2) }}>
          <div style={{ position: "relative", background: C.paper, borderRadius: 6, padding: "34px 50px 46px", boxShadow: "0 50px 90px rgba(0,0,0,0.5)",
            backgroundImage: "repeating-linear-gradient(180deg, rgba(0,0,0,0) 0 57px, rgba(90,120,170,0.16) 57px 58px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20 }}>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 6, color: C.lilacDeep, whiteSpace: "nowrap" }}>{head}</div>
              {page ? <div style={{ flex: "none", opacity: nm }}><Chip txt={page} size={34} bg={C.red} color="#fff" rot={3} /></div> : null}
            </div>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 240, lineHeight: 0.92, color: C.lilacDeep, marginTop: 6, opacity: nb, transform: `scale(${1.25 - 0.25 * nb})`, transformOrigin: "0 80%" }}>{n}</div>
            <div style={{ position: "relative", display: "inline-block", marginTop: 10, opacity: nm, transform: `translateY(${(1 - nm) * 24}px)` }}>
              {/* tachado POR RENGLÓN (antes solo cruzaba el primero cuando el nombre ocupaba 2): fondo por fragmento con box-decoration clone */}
              <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: nameSz, lineHeight: 1.04, color: f > T && !lab ? C.inkSoft : C.ink, maxWidth: 720 }}>
                <span style={{ backgroundImage: `linear-gradient(${C.red}, ${C.red})`, backgroundRepeat: "no-repeat", backgroundPosition: "0 55%",
                  backgroundSize: `${lab ? 0 : 100 * ez((f - T) / 8)}% ${Math.max(6, nameSz * 0.1)}px`, WebkitBoxDecorationBreak: "clone", boxDecorationBreak: "clone" } as React.CSSProperties}>{name}</span>
              </div>
            </div>
            <div style={{ marginTop: 26, minHeight: insSz * 1.1, opacity: ins, transform: `translateX(${(1 - ins) * -40}px)` }}>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 40, letterSpacing: 4, color: C.red }}>{lab || "EN SU LUGAR:"}</div>
              <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: insSz, lineHeight: 1.0, color: C.pen, marginTop: 4 }}>{instead}</div>
            </div>
          </div>
        </div>
        <Grade vig={0.38} />
      </Stage>
    );
  };

// ── CONTADOR "ITEM n OF N" (PISTA, no plano): arriba a la derecha durante TODA la sección de cada cosa.
//    counts = [{a, b, n}] en segundos absolutos; hide = tramos donde se esconde (p. ej. sobre un ItemCard). Se monta UNA vez sobre todo el video. ──
export const ItemCounter: React.FC<{ counts: { a: number; b: number; n: number }[]; of: number; word?: string; hide?: [number, number][] }> = ({ counts, of, word = "ITEM", hide = [] }) => {
  const f = useCurrentFrame(), t = f / 30;
  const cur = counts.find((c) => t >= c.a && t < c.b);
  if (!cur) return null;
  const k = sp(f, fr(cur.a), 14, 160);
  const out = lin(f, fr(cur.b) - 6, fr(cur.b), 0, 1);
  const hd = hide.reduce((m, [x, y]) => Math.max(m, cl(Math.min(f - fr(x) + 1, fr(y) - f + 1) / 6)), 0);
  const prev = counts.some((c) => Math.abs(c.b - cur.a) < 0.6); // si viene de otro item: el número salta, la caja no
  const op = (prev ? 1 : cl(k * 2)) * (1 - (counts.some((c) => Math.abs(c.a - cur.b) < 0.6) ? 0 : out)) * (1 - hd);
  if (op <= 0.01) return null;
  return (
    <div style={{ position: "absolute", right: 70, top: 56, opacity: op, transform: `translateY(${prev ? 0 : (1 - k) * -24}px)`, display: "flex", alignItems: "baseline", gap: 14,
      background: "rgba(14,10,22,0.78)", border: "2px solid #e0b25a", borderRadius: 14, padding: "10px 24px", boxShadow: "0 6px 18px rgba(0,0,0,0.45)" }}>
      <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 34, letterSpacing: 4, color: "#f6ecd6" }}>{word}</span>
      <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 52, lineHeight: 1, color: "#f3c76a", display: "inline-block", transform: `scale(${1.5 - 0.5 * k})` }}>{cur.n}</span>
      <span style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 34, letterSpacing: 4, color: "#f6ecd6" }}>DE {of}</span>
    </div>
  );
};

// ── SWAP: la cosa de hoy a pantalla completa; en `t` (la palabra "instead") una cortina la empuja a la mitad izquierda
//    (se apaga y se tacha) y entra a la derecha "WHAT WE USED INSTEAD" con lo de antes ──
export const SwapCard: P<{ old: { k: string; txt: string }; neu: { k: string; txt: string }; t: number; head?: string; oldHead?: string }> =
  ({ a, d, old, neu, t, head = "LO QUE VA EN SU LUGAR", oldHead = "LO QUE HACE CASI TODO EL MUNDO" }) => {
    const { f, at } = useT(a);
    const T = at(t);
    const w = eo(cl((f - T) / 16));
    const h0 = sp(f, 4, 14, 160), h1 = sp(f, T + 8, 14, 160), x = sp(f, T + 12, 11, 220);
    const LW = 1920 - 960 * w;
    return (
      <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: LW, overflow: "hidden" }}>
          <Img src={img(old.k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + 0.06 * f / d})`, filter: `saturate(${1 - 0.55 * w}) brightness(${1 - 0.25 * w})` }} />
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,8,14,0.55) 0%, rgba(10,8,14,0) 30%, rgba(10,8,14,0) 65%, rgba(10,8,14,0.6) 100%)" }} />
          <div style={{ position: "absolute", left: 70, top: 70, opacity: h0, fontFamily: LABEL, fontWeight: 700, fontSize: fit(oldHead, 820, 44, "label", 1, 8), letterSpacing: 8, color: C.porc, textShadow: shadowTxt, whiteSpace: "nowrap" }}>{oldHead}</div>
          <div style={{ position: "absolute", left: 70, bottom: 90, opacity: h0, transform: `translateY(${(1 - h0) * 30}px)` }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <Chip txt={old.txt} size={60} rot={-2} maxW={800} />
              <Mark kind="strike" x={-10} y={0} w={Math.min(800, old.txt.length * 38 + 60)} h={90} f={f} at={T + 10} dur={8} sw={12} />
            </div>
          </div>
          {w > 0.5 ? <div style={{ position: "absolute", left: "50%", top: "46%", translate: "-50% -50%", width: 150, height: 150, borderRadius: 99, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.45)", transform: `scale(${x})` }}>
            <svg width={84} height={84}><path d="M 16 16 L 68 68 M 68 16 L 16 68" stroke="#fff" strokeWidth={15} strokeLinecap="round" /></svg>
          </div> : null}
        </div>
        <div style={{ position: "absolute", left: LW, top: 0, bottom: 0, width: 960, overflow: "hidden", borderLeft: w > 0 ? "10px solid #FBF5E6" : undefined, boxShadow: "-20px 0 50px rgba(0,0,0,0.5)" }}>
          <Img src={img(neu.k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.12 - 0.06 * w})` }} />
          <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,8,14,0.55) 0%, rgba(10,8,14,0) 30%, rgba(10,8,14,0) 65%, rgba(10,8,14,0.6) 100%)" }} />
          <div style={{ position: "absolute", left: 60, right: 40, top: 66, opacity: h1, transform: `translateY(${(1 - h1) * -20}px)`, fontFamily: LABEL, fontWeight: 700, fontSize: fit(head, 840, 46, "label", 1, 6), letterSpacing: 6, color: C.tape, textShadow: shadowTxt, whiteSpace: "nowrap" }}>{head}</div>
          <div style={{ position: "absolute", left: 60, bottom: 90, opacity: h1, transform: `translateY(${(1 - h1) * 30}px)` }}><Chip txt={neu.txt} size={64} font={HAND} ls={0} bg={C.lilacDeep} color="#fff" rot={2} maxW={820} /></div>
        </div>
        <Grade vig={0.3} />
        <Grain />
      </AbsoluteFill>
    );
  };

// ── DROP LIST (repisa que se llena): sobre la foto de una repisa VACÍA, cada cosa cae en SU palabra y queda en fila con su rótulo a mano.
//    Con `k` en el item cae una foto chica enmarcada; sin `k`, una etiqueta de papel kraft. El 1º debería caer apenas abre el plano ──
export const DropList: P<{ k: string; items: { t: number; txt: string; k?: string }[]; head?: string; shelfY?: number; x0?: number; x1?: number }> =
  ({ a, d, k, items, head, shelfY = 72, x0 = 12, x1 = 88 }) => {
    const { f, at } = useT(a);
    const n = items.length;
    const slot = ((x1 - x0) / Math.max(1, n)) * 19.2;
    const hasPh = items.some((x) => x.k);
    const W = Math.min(hasPh ? 300 : 260, slot - 24), Hp = W * 0.78;
    const lab = Math.min(52, ...items.map((x) => fit(x.txt, W - 30, 52, "hand", 1)));
    const h = sp(f, 0, 13, 160);
    const Y = shelfY * 10.8;
    return (
      <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
        <FullPhoto k={k} f={f} d={d} z={[1.02, 1.07]} o={`50% ${shelfY}%`} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,8,14,0.5) 0%, rgba(10,8,14,0) 28%)" }} />
        {head ? <div style={{ position: "absolute", left: 80, right: 80, top: 60, textAlign: "center", opacity: h, fontFamily: SERIF, fontWeight: 900, fontSize: fit(head, 1760, 88, "serif"), whiteSpace: "nowrap", color: C.porc, textShadow: shadowTxt }}>{head}</div> : null}
        {items.map((x, i) => {
          const T = at(x.t);
          if (f < T - 1) return null;
          const u = sp(f, T, 9, 170); // resorte flojo = rebote al apoyar
          const cx = (x0 * 19.2) + slot * (i + 0.5);
          const fall = (1 - u) * -(Y + 300);
          const land = cl((f - T - 6) / 6) * (1 - cl((f - T - 14) / 10));
          return (
            <div key={i} style={{ position: "absolute", left: cx, top: Y, translate: "-50% -100%", transform: `translateY(${fall}px) rotate(${(i % 2 ? 2 : -2) * (1 - u * 0.6)}deg)` }}>
              {x.k ? <Print k={x.k} w={W - 24} h={Hp} f={f} mat={10} /> : null}
              <div style={{ position: "relative", margin: x.k ? "-14px auto 0" : "0 auto", width: x.k ? W * 0.86 : W, boxSizing: "border-box", padding: x.k ? "6px 10px" : "34px 14px 26px", background: x.k ? C.paper : "#D9BC8C",
                borderRadius: x.k ? 4 : "10px 10px 6px 6px", boxShadow: "0 16px 30px rgba(0,0,0,0.45)", textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: lab, lineHeight: 1, color: x.k ? C.pen : "#3B2A18", whiteSpace: "nowrap" }}>
                {x.k ? null : <div style={{ position: "absolute", left: "50%", top: 10, width: 16, height: 16, marginLeft: -8, borderRadius: 99, background: "rgba(40,28,14,0.55)", boxShadow: "inset 0 2px 3px rgba(0,0,0,0.5)" }} />}
                {x.txt}
              </div>
              <div style={{ position: "absolute", left: "10%", right: "10%", bottom: -10, height: 14, borderRadius: "50%", background: "rgba(0,0,0,0.45)", filter: "blur(6px)", opacity: 0.4 + 0.6 * land }} />
            </div>
          );
        })}
        <Grade vig={0.32} />
        <Grain />
      </AbsoluteFill>
    );
  };

// ── GONE LIST: foto de una casa/cocina llena; cada cosa se marca con círculo rojo + número en SU palabra y a los `fade` s
//    se "va" (se lava y desenfoca esa zona; el círculo queda tenue). x, y, r en % del cuadro ──
export const GoneList: P<{ k: string; items: { t: number; txt: string; x: number; y: number; r?: number }[]; head?: string; fade?: number }> =
  ({ a, d, k, items, head, fade = 1.2 }) => {
    const { f, at } = useT(a);
    const h = sp(f, 0, 13, 160);
    const sc = 1.03 + 0.05 * f / d;
    const gone = items.filter((x) => f >= at(x.t) + fr(fade)).length;
    return (
      <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
        <AbsoluteFill style={{ transform: `scale(${sc})` }}>
          <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {items.map((x, i) => {
            const g = cl((f - at(x.t) - fr(fade)) / 14);
            if (g <= 0) return null;
            const R = (x.r ?? 9) * 19.2;
            const mask = `radial-gradient(circle ${R}px at ${x.x * 19.2}px ${x.y * 10.8}px, #000 45%, transparent 100%)`;
            return (
              <AbsoluteFill key={i} style={{ opacity: g, WebkitMaskImage: mask, maskImage: mask }}>
                <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1) brightness(0.5) contrast(0.8) blur(2px)" }} />
              </AbsoluteFill>
            );
          })}
          {items.map((x, i) => {
            const T = at(x.t);
            if (f < T) return null;
            const R = (x.r ?? 9) * 19.2;
            const g = cl((f - T - fr(fade)) / 14);
            const b = sp(f, T + 4, 11, 220);
            const right = x.x > 70;
            return (
              <div key={"m" + i} style={{ position: "absolute", left: 0, top: 0 }}>
                <Mark kind="circle" x={x.x * 19.2 - R} y={x.y * 10.8 - R * 0.8} w={R * 2} h={R * 1.6} f={f} at={T} dur={9} sw={10} op={1 - 0.6 * g} />
                <div style={{ position: "absolute", left: x.x * 19.2 + (right ? -R - 40 : R - 30), top: Math.max(head ? 150 : 20, x.y * 10.8 - R * 0.8 - 30), width: 76, height: 76, borderRadius: 99, background: C.red, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: SERIF, fontWeight: 900, fontSize: 42, boxShadow: "0 10px 24px rgba(0,0,0,0.5)", transform: `scale(${b})` }}>{i + 1}</div>
                <div style={{ position: "absolute", top: x.y * 10.8 + R * 0.8 + 76 > 1060 ? x.y * 10.8 - R * 0.8 - 76 : x.y * 10.8 + R * 0.8 + 6, left: right ? x.x * 19.2 + R * 0.3 : x.x * 19.2 - R * 0.3, transform: right ? "translateX(-100%)" : undefined, opacity: b, whiteSpace: "nowrap" }}>
                  <div style={{ position: "relative" }}>
                    <Chip txt={x.txt} size={36} rot={-2} maxW={520} />
                    <Mark kind="strike" x={-6} y={4} w={Math.min(520, x.txt.length * 22 + 40)} h={50} f={f} at={T + fr(fade)} dur={8} sw={8} />
                  </div>
                </div>
              </div>
            );
          })}
        </AbsoluteFill>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,8,14,0.55) 0%, rgba(10,8,14,0) 22%)" }} />
        {head ? <div style={{ position: "absolute", left: 80, top: 54, opacity: h, fontFamily: SERIF, fontWeight: 900, fontSize: fit(head, 1300, 80, "serif"), whiteSpace: "nowrap", color: C.porc, textShadow: shadowTxt }}>{head}</div> : null}
        <div style={{ position: "absolute", right: 70, top: 60, opacity: h }}><Chip txt={`${gone} / ${items.length} GONE`} size={40} bg={C.red} color="#fff" rot={2} /></div>
        <Grade vig={0.3} />
        <Grain />
      </AbsoluteFill>
    );
  };

// ── CHECK SCENE (la cocina a la noche, la casa antes de dormir…): foto real; lista de papel a la derecha que se tilda en SU palabra;
//    si el item trae x, y (%), además cae un tilde verde sobre ese lugar de la foto. `clock` = rótulo de hora ──
export const CheckScene: P<{ k: string; vid?: boolean; items: { t: number; txt: string; x?: number; y?: number }[]; head?: string; clock?: string; night?: boolean }> =
  ({ a, d, k, vid, items, head, clock, night = true }) => {
    const { f, at } = useT(a);
    const c = sp(f, 0, 14, 120), h = sp(f, 6, 13, 160);
    const W = 640;
    const longest = items.reduce((m, x) => (x.txt.length > m.length ? x.txt : m), "");
    const sz = Math.min(items.length > 5 ? 50 : 60, fit(longest, W - 140, 60, "hand", 1));
    return (
      <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#000" }}>
        <FullPhoto k={k} vid={vid} f={f} d={d} z={[1.03, 1.1]} filter={night ? "saturate(0.8) brightness(0.82) hue-rotate(-6deg)" : undefined} />
        {night ? <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(16,20,48,0.32), rgba(16,20,48,0.12))", mixBlendMode: "multiply" }} /> : null}
        {items.map((x, i) => {
          if (x.x == null || x.y == null) return null;
          const u = sp(f, at(x.t), 10, 230);
          if (f < at(x.t)) return null;
          return (
            <div key={"p" + i} style={{ position: "absolute", left: `${x.x}%`, top: `${x.y}%`, translate: "-50% -50%", transform: `scale(${u})`, width: 96, height: 96, borderRadius: 99, background: C.sage, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 8px rgba(255,255,255,0.35), 0 16px 30px rgba(0,0,0,0.5)" }}>
              <svg width={60} height={60}><path d="M 10 32 L 24 46 L 50 14" stroke="#fff" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          );
        })}
        {clock ? <div style={{ position: "absolute", left: 80, top: 70, opacity: h, transform: `translateY(${(1 - h) * -20}px)` }}><Chip txt={clock} size={56} bg="rgba(14,10,22,0.82)" color="#f3c76a" rot={-2} /></div> : null}
        <div style={{ position: "absolute", right: 70, top: 120, width: W, transform: `translateX(${(1 - c) * 760}px) rotate(1.5deg)`, opacity: cl(c * 2) }}>
          <div style={{ background: C.paper, borderRadius: 6, padding: "30px 40px 36px", boxShadow: "0 50px 90px rgba(0,0,0,0.55)", backgroundImage: "repeating-linear-gradient(180deg, rgba(0,0,0,0) 0 57px, rgba(90,120,170,0.16) 57px 58px)" }}>
            {head ? <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: fit(head.toUpperCase(), W - 80, 40, "label", 1, 5), letterSpacing: 5, color: C.lilacDeep, marginBottom: 10, whiteSpace: "nowrap" }}>{head}</div> : null}
            {items.map((x, i) => {
              const u = sp(f, at(x.t), 14, 170);
              return (
                <div key={i} style={{ display: "flex", gap: 18, alignItems: "center", marginTop: 12, opacity: 0.35 + 0.65 * u }}>
                  <Tick f={f} at={at(x.t) + 3} size={50} />
                  <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: sz, lineHeight: 1.05, color: C.pen, whiteSpace: "nowrap" }}>{x.txt}</div>
                </div>
              );
            })}
          </div>
        </div>
        <Grade vig={0.4} />
        <Grain />
      </AbsoluteFill>
    );
  };

// ── FOTOS EN SERIE: un solo plano con cambios de foto en su palabra (fundido + empuje que alterna); marca roja opcional por foto.
//    Sirve para fundir tomas cortas en una (p. ej. "n_antsill → n_chalkline con la línea de tiza dibujada en 'chalk line'") ──
export const PhotoSeq: P<{ photos: { k: string; t?: number; vid?: boolean; cap?: string; mark?: { kind: "circle" | "strike" | "under"; x: number; y: number; w: number; h: number; t: number } }[] }> = ({ a, d, photos }) => {
  const { f, at } = useT(a);
  const st = photos.map((p, i) => (i === 0 ? 0 : at(p.t ?? a)));
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {photos.map((p, i) => {
        const s0 = st[i], s1 = i < photos.length - 1 ? st[i + 1] : d;
        if (f < s0 - 1 || f > s1 + 12) return null;
        const on = i === 0 ? 1 : eo(cl((f - s0) / 10));
        const k2 = (f - s0) / Math.max(1, s1 - s0 + 12);
        const zin = i % 2 === 0;
        const sc = zin ? 1.04 + 0.08 * k2 : 1.12 - 0.08 * k2;
        const cp = p.cap ? sp(f, s0 + 6, 14, 170) : 0;
        return (
          <AbsoluteFill key={i} style={{ opacity: on }}>
            <AbsoluteFill style={{ transform: `scale(${sc})`, transformOrigin: i % 3 === 1 ? "35% 50%" : i % 3 === 2 ? "65% 45%" : "50% 50%" }}>
              {p.vid ? <OffthreadVideo src={clip(p.k)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Img src={img(p.k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              {p.mark ? <Mark kind={p.mark.kind} x={p.mark.x * 19.2} y={p.mark.y * 10.8} w={p.mark.w * 19.2} h={p.mark.h * 10.8} f={f} at={at(p.mark.t)} dur={12} sw={12} color={p.mark.kind === "under" ? "#FFFDF4" : C.red} /> : null}
            </AbsoluteFill>
            {p.cap ? <div style={{ position: "absolute", left: 110, bottom: 110, opacity: cp, transform: `translateX(${(1 - cp) * -40}px)` }}><Chip txt={p.cap} size={56} font={HAND} ls={0} rot={-2} maxW={1500} /></div> : null}
          </AbsoluteFill>
        );
      })}
      <Grade vig={0.32} />
    </AbsoluteFill>
  );
};

// ── APERTURA DESDE LA MINIATURA: la miniatura REAL a pantalla completa, quieta (sin palabras encima) hasta `fade`;
//    fundido suave + empuje lento a la foto/clip que la calca (`k`); opcional texto cinético en su palabra ──
export const ThumbOpen: P<{ thumb: string; k: string; vid?: boolean; fade?: number; o?: [number, number]; words?: [string, number][] }> = ({ a, d, thumb, k, vid, fade, o = [50, 45], words }) => {
  const { f, at } = useT(a);
  const F = fade != null ? at(fade) : 45;
  const x = eo(cl((f - F) / 18));
  const k2 = cl((f - F) / Math.max(1, d - F));
  const sz = words ? fit(words.map((w) => w[0]).join(" "), 1680, 110, "serif", 2) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ opacity: x, transform: vid ? undefined : `scale(${1.0 + 0.12 * k2})`, transformOrigin: `${o[0]}% ${o[1]}%` }}>
        {vid ? <OffthreadVideo src={clip(k)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - x, transform: `scale(${1 + 0.04 * x})`, transformOrigin: `${o[0]}% ${o[1]}%` }}>
        <Img src={img(thumb)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      {words ? <>
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,8,14,0) 45%, rgba(10,8,14,0.6) 100%)", opacity: x }} />
        <div style={{ position: "absolute", left: 120, right: 120, bottom: 120, display: "flex", flexWrap: "wrap", gap: `0 ${sz * 0.26}px` }}>
          {words.map(([w, t], i) => { const u = sp(f, at(t), 14, 200); return <div key={i} style={{ fontFamily: SERIF, fontWeight: 900, fontSize: sz, lineHeight: 1.05, color: C.porc, opacity: f >= at(t) ? u : 0, transform: `translateY(${(1 - u) * 50}px)`, textShadow: "0 8px 30px rgba(0,0,0,0.6)" }}>{w}</div>; })}
        </div>
      </> : null}
      <AbsoluteFill style={{ opacity: x }}><Grade vig={0.3} /></AbsoluteFill>
    </AbsoluteFill>
  );
};

export const ITEMS: Record<string, React.FC<any>> = { ItemCard, SwapCard, DropList, GoneList, CheckScene, PhotoSeq, ThumbOpen };
