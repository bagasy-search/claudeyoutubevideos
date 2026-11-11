// swl11c · piezas (look 370 libro de cuentas). Mecanismos propios, distintos del registro lor11:
// la receta se asienta en el libro de cuentas con la regla que baja renglón por renglón y el costo en la columna de centavos;
// recap = el mismo libro con la cuenta corrida (cada plato suma su renglón y el total se arrastra); foto vieja boca abajo que se da vuelta
// (al dorso, el año a lápiz); las recetas del título en una tira larga que la cámara recorre; separador de pestaña de índice que asoma;
// monedas de cobre «dish N of 11»; mapa en tinta; dato en recorte de diario con su fuente; libro + QR en etiqueta de precio con hilo.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, useCurrentFrame } from "remotion";
import { K, HAND, SERIF, TYPE, cl, lerp, eOut, eIO, spr, rnd, hash, sf, drift, Table, BlurBg, Ledger, Ruler, LEDGER_ROW } from "./look";

const FPS = 30;
const useT = () => useCurrentFrame() / FPS;

// ---------- avatar (MEJORA 4: encuadres) ----------
export const Avatar: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS;
  const vid = (style: React.CSSProperties) => <OffthreadVideo src={sf(s.src)} startFrom={s.off} muted style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />;
  if (s.frame === "punch") return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{vid({ transform: `scale(${1.17 + 0.02 * cl(t / d)})`, transformOrigin: "50% 28%" })}</AbsoluteFill>;
  if (s.frame === "hands") return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{vid({ transform: `scale(${1.1 + 0.03 * cl(t / d)})`, transformOrigin: "50% 65%" })}</AbsoluteFill>;
  if (s.frame === "side" && s.side) {
    // el avatar se corre a la izquierda y la foto siguiente entra a la derecha como hoja del libro de cuentas
    const k = eOut(t, 0.2, 0.9);
    return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${-260 * k}px)` }}>{vid({})}</AbsoluteFill>
      <div style={{ position: "absolute", top: 70, bottom: 70, right: 60, width: 700, transform: `translateX(${(1 - k) * 900}px) rotate(1.5deg)`, background: K.page, padding: 16, boxShadow: "0 24px 50px rgba(0,0,0,.45)" }}>
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 40, width: 2, background: "rgba(184,50,44,.45)" }} />
        <Img src={sf(s.side)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.03 + 0.04 * cl(t / d)})` }} />
      </div>
    </AbsoluteFill>;
  }
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{vid({ transform: `scale(${1.0 + 0.025 * cl(t / d)})`, transformOrigin: "50% 40%" })}</AbsoluteFill>;
};

// ---------- clip real (Y): entero, sin recortar, con un empuje lento ----------
export const ClipY: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS, sd = hash(s.uid);
  const z = 1.0 + 0.04 * cl(t / d), dir = sd % 2 ? 1 : -1;
  const rate = s.cd && s.cd < d ? Math.max(0.6, s.cd / d) : 1;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#17120c" }}>
    <OffthreadVideo src={sf(s.src)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z}) translateX(${dir * 10 * cl(t / d)}px)` }} />
  </AbsoluteFill>;
};
export const Veo: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS;
  const rate = s.vd < d + 0.1 ? Math.max(0.5, (s.vd - 0.15) / d) : 1;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#17120c" }}>
    <OffthreadVideo src={sf(s.src)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.03 * cl(t / d)})` }} />
  </AbsoluteFill>;
};

// ---------- foto (G): paneo lento con punto de interés por plano ----------
export const Photo: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS, sd = hash(s.uid);
  const k = eIO(t, 0, d), z0 = 1.03 + 0.04 * (sd % 3), z1 = z0 + 0.08 + 0.04 * rnd(sd);
  const ox = 30 + 40 * rnd(sd + 3), oy = 35 + 30 * rnd(sd + 5), dx = (sd % 2 ? 1 : -1) * 22 * k;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#17120c" }}>
    <Img src={sf(s.src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${dx}px) scale(${lerp(z0, z1, k)})`, transformOrigin: `${ox}% ${oy}%` }} />
  </AbsoluteFill>;
};

// ---------- MEJORA 8: foto vieja boca abajo sobre la mesa; se da vuelta (al dorso, el año a lápiz) y la cámara entra en ella ----------
export const OldPhoto: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS, sd = hash(s.uid);
  const flip = eIO(t, 0.6, 1.5), cam = eIO(t, 1.5, d);
  const W = 1040, H = 740, rot = lerp(-3, 3, rnd(sd));
  const dr = drift(t, sd % 7, 0.6);
  const year = s.year || "";
  const ang = 180 * (1 - flip);
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Table t={t} />
    <AbsoluteFill style={{ transform: `translate(${dr.x}px, ${dr.y}px) scale(${lerp(0.92, 1.3, cam)})`, transformOrigin: "50% 50%", perspective: 2600 }}>
      <div style={{ position: "absolute", left: 960 - W / 2, top: 540 - H / 2, width: W, height: H, transform: `rotate(${rot}deg) rotateY(${ang}deg) translateZ(${Math.sin(flip * Math.PI) * 160}px)`, transformStyle: "preserve-3d" }}>
        <div style={{ position: "absolute", inset: 0, padding: 20, background: "#f4ecda", boxShadow: "0 22px 44px rgba(0,0,0,.5)", backfaceVisibility: "hidden" }}>
          <Img src={sf(s.src)} style={{ width: W - 40, height: H - 40, objectFit: "cover", filter: "sepia(.12)" }} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "#ebe2cc", boxShadow: "0 22px 44px rgba(0,0,0,.5)", transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(115deg, rgba(120,100,70,.06) 0 2px, transparent 2px 9px)" }} />
          <div style={{ position: "absolute", left: 90, top: 120, fontFamily: HAND, fontSize: 84, color: K.pencil, opacity: 0.75, transform: "rotate(-4deg)" }}>{year}</div>
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- C card: la receta se asienta en el libro de cuentas; la regla baja renglón por renglón y el costo se escribe en la columna de centavos ----------
const money = (c: string) => (c || "").replace(/\s*(per plate|for three|for both)\s*/i, "").trim();
export const LedgerCard: React.FC<{ s: any; c: any }> = ({ s, c }) => {
  const t = useT(), d = s.dur / FPS, sd = hash(s.uid);
  if (!c) return <Table t={t} />;
  const slide = eOut(t, 0.05, 0.9), cam = eIO(t, 2.6, Math.max(3.2, d - 0.4));
  const dr = drift(t, sd % 9, 0.6);
  const W = 1640, H = 1000, TOP = 220;
  const ing: string[] = (c.ingredients || []); // completas: el renglón largo achica la letra en vez de cortarse
  const st: string[] = (c.steps || []).slice(0, 5);
  const per = Math.min(0.42, Math.max(0.22, (d - 4.2) / (ing.length + st.length)));
  const wr = (i: number) => cl((t - 1.0 - i * per) / 0.28);
  const lines = ing.length + 1;
  const rIdx = Math.min(lines, (t - 1.0) / per);
  const rulerY = TOP + LEDGER_ROW * Math.max(0, rIdx) + LEDGER_ROW - 4;
  const totalK = cl((t - 1.0 - ing.length * per - 0.1) / 0.35);
  const stA = 1.0 + ing.length * per + 0.5;
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Table t={t} />
    <AbsoluteFill style={{ transform: `translate(${dr.x}px, ${dr.y + lerp(40, -60, cam)}px) scale(${lerp(0.97, 1.06, cam)})` }}>
      <div style={{ position: "absolute", left: 960 - W / 2, top: 540 - H / 2, transform: `translateX(${(1 - slide) * 1900}px) rotate(${lerp(4, -0.8, slide)}deg)` }}>
        <Ledger w={W} h={H} money={280} top={TOP}>
          <div style={{ position: "absolute", left: 120, top: 40, right: 300, fontFamily: SERIF, fontWeight: 700, fontSize: 56, color: K.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", opacity: cl((t - 0.6) / 0.3) }}>{c.title}</div>
          <div style={{ position: "absolute", left: 122, top: 120, fontFamily: HAND, fontSize: 36, color: K.green, opacity: cl((t - 0.8) / 0.3), whiteSpace: "nowrap" }}>{[c.serves, c.time].filter(Boolean).join("  ·  ")}</div>
          <div style={{ position: "absolute", right: 30, top: 118, width: 240, textAlign: "center", fontFamily: TYPE, fontSize: 26, color: K.red, letterSpacing: 3 }}>COST</div>
          {ing.map((x, i) => (
            <div key={i} style={{ position: "absolute", left: 122, top: TOP + i * LEDGER_ROW + 4, width: 700, height: LEDGER_ROW, fontFamily: HAND, fontSize: x.length > 38 ? Math.floor(36 * 38 / x.length) : 36, lineHeight: `${LEDGER_ROW}px`, color: K.ink, whiteSpace: "nowrap",
              clipPath: `inset(0 ${100 - 100 * wr(i)}% 0 0)` }}>{x}</div>
          ))}
          {st.map((x, i) => (
            <div key={"s" + i} style={{ position: "absolute", left: 860, top: TOP + i * LEDGER_ROW * 1.6 + 4, width: 470, fontFamily: HAND, fontSize: 30, lineHeight: "40px", color: K.pencil, opacity: cl((t - stA - i * per) / 0.3) }}>
              <span style={{ color: K.red, marginRight: 10 }}>{i + 1}.</span>{x}
            </div>
          ))}
          {c.cost && <>
            <div style={{ position: "absolute", right: 22, width: 250, top: TOP + ing.length * LEDGER_ROW + 6, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 50, color: K.ink, clipPath: `inset(0 ${100 - 100 * totalK}% 0 0)` }}>{money(c.cost)}</div>
            <div style={{ position: "absolute", right: 34, width: 226 * totalK, top: TOP + (ing.length + 1) * LEDGER_ROW + 4, height: 3, background: K.ink }} />
            <div style={{ position: "absolute", right: 34, width: 226 * totalK, top: TOP + (ing.length + 1) * LEDGER_ROW + 11, height: 3, background: K.ink }} />
            <div style={{ position: "absolute", right: 22, width: 250, top: TOP + (ing.length + 1) * LEDGER_ROW + 18, textAlign: "center", fontFamily: TYPE, fontSize: 22, color: K.red, opacity: totalK }}>{/per plate/i.test(c.cost) ? "per plate" : /three/i.test(c.cost) ? "for three" : "this dish"}</div>
          </>}
          {c.tip && <div style={{ position: "absolute", left: 122, right: 320, bottom: 28, fontFamily: HAND, fontSize: 34, color: K.red, opacity: cl((t - stA - st.length * per - 0.3) / 0.4), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>✎ {c.tip}</div>}
          <Ruler w={W - 140} style={{ left: 70, top: rulerY, opacity: cl(1 - (t - stA) / 0.5) * cl((t - 0.7) / 0.3) }} />
        </Ledger>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- recap (MEJORA 10): la cuenta corrida de la semana; cada recap asienta su renglón, la foto del plato al lado y el total se arrastra ----------
export const RecapLedger: React.FC<{ s: any; rows: any[]; n: number; of: number }> = ({ s, rows, n, of }) => {
  const t = useT(), d = s.dur / FPS, sd = hash(s.uid);
  const W = 1700, H = 980, TOP = 150, ROW = 64;
  const vis = rows.slice(0, n);
  const k = cl((t - 0.3) / 0.6);
  const dr = drift(t, sd % 5, 0.5);
  const cur = rows[n - 1] || {};
  const firstY = Math.max(0, (n - 10)) * ROW;
  const sum = vis.reduce((a, r) => a + (r.cents || 0), 0);
  const prevSum = sum - (cur.cents || 0);
  const shown = Math.round(lerp(prevSum, sum, eOut(t, 0.9, 1.6)));
  const ph = spr(t, 0.5, 7, 0.6);
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Table t={t} />
    <AbsoluteFill style={{ transform: `translate(${dr.x}px, ${dr.y}px) scale(${lerp(1.0, 1.04, eIO(t, 0, d))})` }}>
      <div style={{ position: "absolute", left: 110, top: 50 }}>
        <Ledger w={W - 520} h={H} money={230} top={TOP}>
          <div style={{ position: "absolute", left: 120, top: 46, fontFamily: SERIF, fontWeight: 700, fontSize: 46, color: K.ink }}>Supper for one · what it cost</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: TOP, bottom: 90, overflow: "hidden" }}>
            {vis.map((r, i) => {
              const last = i === n - 1;
              return <div key={i} style={{ position: "absolute", left: 0, right: 0, top: i * ROW - firstY + 6, height: ROW, background: last ? `rgba(255,232,140,${0.45 * k})` : "transparent" }}>
                <div style={{ position: "absolute", left: 30, width: 60, textAlign: "right", fontFamily: TYPE, fontSize: 28, lineHeight: `${ROW}px`, color: K.red }}>{i + 1}</div>
                <div style={{ position: "absolute", left: 122, fontFamily: HAND, fontSize: 38, lineHeight: `${ROW}px`, color: K.ink, whiteSpace: "nowrap", clipPath: last ? `inset(0 ${100 - 100 * k}% 0 0)` : "none" }}>{r.name}</div>
                <div style={{ position: "absolute", right: 14, width: 210, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 38, lineHeight: `${ROW}px`, color: K.ink, opacity: last ? cl((t - 0.8) / 0.25) : 1 }}>{r.cost}</div>
              </div>;
            })}
          </div>
          <div style={{ position: "absolute", left: 122, right: 14, bottom: 26, height: 60, borderTop: `3px double ${K.ink}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: TYPE, fontSize: 28, color: K.red, letterSpacing: 2 }}>CARRIED FORWARD · {n} OF {of}</span>
            <span style={{ width: 210, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 42, color: K.ink }}>${(shown / 100).toFixed(2)}</span>
          </div>
        </Ledger>
      </div>
      {s.photo && <div style={{ position: "absolute", left: 1290, top: 210, width: 560, height: 420, padding: 14, background: "#fff", boxShadow: "0 18px 36px rgba(0,0,0,.4)", transform: `translateY(${(1 - ph) * 700}px) rotate(${2 + (n % 3) - 1}deg)` }}>
        <Img src={sf(s.photo)} style={{ width: 532, height: 392, objectFit: "cover" }} />
      </div>}
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- libro: tapa real; se abre y queda la página real; QR en una etiqueta de precio atada con hilo ----------
export const TagQR: React.FC<{ k: number; x: number; y: number; slug: string; label: string }> = ({ k, x, y, slug, label }) => {
  const sw = Math.sin(k * 6) * (1 - k) * 8;
  return <div style={{ position: "absolute", left: x, top: y, transformOrigin: "50% -120px", transform: `translateY(${(1 - k) * -900}px) rotate(${2 + sw}deg)` }}>
    <div style={{ position: "absolute", left: 255, top: -240, width: 3, height: 250, background: "#efe6d2", boxShadow: "1px 0 0 rgba(0,0,0,.25)" }} />
    <div style={{ position: "relative", width: 540, height: 660, background: K.tag, clipPath: "polygon(16% 0, 84% 0, 100% 10%, 100% 100%, 0 100%, 0 10%)", boxShadow: "0 18px 36px rgba(0,0,0,.35)", padding: "70px 40px 30px" }}>
      <div style={{ position: "absolute", left: 245, top: 22, width: 46, height: 46, borderRadius: 23, background: K.wood2, border: "6px solid #cdb27a" }} />
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 46, color: K.ink, textAlign: "center", lineHeight: "50px" }}>{label}</div>
      <div style={{ background: "#fff", width: 400, height: 400, margin: "16px auto 0", padding: 10 }}>
        <Img src={sf(`${slug}/qr.png`)} style={{ width: 380, height: 380, display: "block" }} />
      </div>
      <div style={{ fontFamily: HAND, fontSize: 34, color: K.red, textAlign: "center", marginTop: 10 }}>link in the description</div>
    </div>
  </div>;
};
export const Book: React.FC<{ s: any; slug: string; label: string }> = ({ s, slug, label }) => {
  const t = useT(), d = s.dur / FPS, sd = hash(s.uid);
  const p = s.page as string;
  const dr = drift(t, sd % 5, 0.5);
  const land = spr(t, 0.05, 6, 0.65), open = p === "close" ? 0 : eIO(t, 1.3, 2.5), cam = eIO(t, 2.5, d);
  const qrK = s.qr ? spr(t, s.qrAt ?? 3.4, 5, 0.55) : 0;
  const BW = 640, BH = 828, bx = s.qr ? 330 : 960 - BW / 2;
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Table t={t} />
    <AbsoluteFill style={{ transform: `translate(${dr.x}px, ${dr.y}px) scale(${lerp(1, s.qr ? 1.02 : 1.18, cam)})`, transformOrigin: "50% 45%", perspective: 3000 }}>
      <div style={{ position: "absolute", left: bx, top: 540 - BH / 2, width: BW, height: BH, transform: `translateY(${(1 - land) * 900}px) rotate(${lerp(-6, -1.2, land)}deg)` }}>
        {p !== "close" && <Img src={sf(`${slug}/libro/p${p}.png`)} style={{ position: "absolute", inset: 0, width: BW, height: BH, objectFit: "fill", boxShadow: "0 30px 60px rgba(20,10,0,.5)" }} />}
        <div style={{ position: "absolute", inset: 0, transformOrigin: "0% 50%", transform: `rotateY(${-170 * open}deg)`, backfaceVisibility: "hidden", boxShadow: "14px 26px 50px rgba(20,10,0,.55), 5px 0 0 #efe9da, 9px 0 0 #e1d9c6" }}>
          <Img src={sf(`${slug}/libro/cover.png`)} style={{ width: BW, height: BH, objectFit: "cover", borderRadius: 3 }} />
        </div>
      </div>
      {s.qr && <TagQR k={qrK} x={1140} y={250} slug={slug} label={label} />}
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- MEJORA 1: las recetas del título en una tira larga sobre la mesa; la cámara la recorre de punta a punta y cada plato recibe su precio ----------
export const DinnerStrip: React.FC<{ s: any; items: any[]; title: string }> = ({ s, items, title }) => {
  const t = useT(), d = s.dur / FPS;
  const CW = 520, GAP = 40, L = items.length * (CW + GAP);
  const pan = eIO(t, 0.8, d - 0.6);
  const x0 = 120, x1 = 1920 - L - 80;
  const x = lerp(x0, Math.min(x0, x1), pan);
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Table t={t} />
    <div style={{ position: "absolute", left: 120, top: 70, fontFamily: SERIF, fontWeight: 700, fontSize: 60, color: "#fbf3df", textShadow: "0 3px 10px rgba(0,0,0,.6)", opacity: cl((t - 0.2) / 0.4) }}>{title}</div>
    <div style={{ position: "absolute", left: x - 40, top: 210, width: L + 80, height: 720, background: K.page, boxShadow: `0 26px 50px ${K.shadow}` }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 590, height: 3, background: K.head }} />
    </div>
    {items.map((it, i) => {
      const cx = x + i * (CW + GAP);
      const vis = cx + CW / 2;
      const k = Math.min(spr(t, 0.3 + i * 0.12, 8, 0.6), 1 - Math.pow(1 - cl((1960 - cx) / 260), 3));
      const pk = cl((1500 - vis) / 300);
      return <div key={i} style={{ position: "absolute", left: cx, top: 240, width: CW }}>
        <div style={{ width: CW, height: 380, overflow: "hidden", transform: `translateY(${(1 - k) * 60}px)`, opacity: k, boxShadow: "0 8px 18px rgba(0,0,0,.25)" }}>
          <Img src={sf(it.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <div style={{ marginTop: 22, fontFamily: HAND, fontSize: 40, color: K.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}><span style={{ color: K.red }}>{i + 1}.</span> {it.name}</div>
        <div style={{ marginTop: 26, fontFamily: HAND, fontWeight: 700, fontSize: 52, color: K.ink, clipPath: `inset(0 ${100 - 100 * pk}% 0 0)` }}>{it.cost}</div>
      </div>;
    })}
  </AbsoluteFill>;
};

// ---------- MEJORA 3 + 5: apertura de cada plato = el canto del libro con pestañas de índice; asoma la pestaña N y el libro se abre en esa hoja ----------
export const IndexTab: React.FC<{ s: any; of: number }> = ({ s, of }) => {
  const t = useT(), d = s.dur / FPS;
  const n = s.n as number;
  const pull = eOut(t, 0.15, 0.7), open = eIO(t, 0.7, 1.4), cam = eIO(t, 0, d);
  const W = 1400, H = 820, TH = (H - 40) / of;
  const words = String(s.name || "").split(" ");
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <BlurBg src={s.bg} t={t} dim={0.3} />
    <AbsoluteFill style={{ transform: `scale(${lerp(1, 1.05, cam)})`, perspective: 2600 }}>
      <div style={{ position: "absolute", left: 960 - W / 2 - 40, top: 540 - H / 2 }}>
        {/* bloque de hojas con el canto a la derecha y las pestañas de índice */}
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, background: K.page, boxShadow: "0 30px 60px rgba(0,0,0,.5), 4px 4px 0 #dcd6bd, 8px 8px 0 #cfc8ab" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 120, bottom: 0, background: `repeating-linear-gradient(180deg, transparent 0 ${LEDGER_ROW - 2}px, ${K.rule} ${LEDGER_ROW - 2}px ${LEDGER_ROW}px)` }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, right: 260, width: 7, borderLeft: "2px solid rgba(184,50,44,.55)", borderRight: "2px solid rgba(184,50,44,.55)" }} />
          <div style={{ position: "absolute", left: 90, top: 60, fontFamily: TYPE, fontSize: 34, letterSpacing: 8, color: K.red, opacity: cl((t - 1.0) / 0.3) }}>DISH NUMBER</div>
          <div style={{ position: "absolute", left: 80, top: 110, fontFamily: SERIF, fontWeight: 700, fontSize: 280, lineHeight: "300px", color: K.ink, opacity: cl((t - 1.1) / 0.3), transform: `scale(${lerp(1.2, 1, eOut(t, 1.1, 1.5))})`, transformOrigin: "0 50%" }}>{n}</div>
          <div style={{ position: "absolute", left: 90, right: 300, top: 470, fontFamily: HAND, fontWeight: 700, fontSize: 88, lineHeight: "96px", color: K.ink }}>
            {words.map((w: string, i: number) => <span key={i} style={{ display: "inline-block", marginRight: 20, opacity: cl((t - 1.3 - i * 0.14) / 0.2) }}>{w}</span>)}
          </div>
          {s.cost && <div style={{ position: "absolute", right: 20, width: 220, top: 470, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 60, color: K.red, opacity: cl((t - 1.8) / 0.3) }}>{s.cost}</div>}
        </div>
        {Array.from({ length: of }, (_, i) => {
          const me = i + 1 === n;
          return <div key={i} style={{ position: "absolute", left: W + (me ? 26 * pull : 0), top: 20 + i * TH, width: 74, height: TH - 6, background: me ? "#f2d27a" : i % 2 ? "#cfe0c4" : "#d9e4ee", borderRadius: "0 10px 10px 0", boxShadow: "3px 3px 6px rgba(0,0,0,.3)",
            fontFamily: TYPE, fontWeight: 700, fontSize: 30, color: "#3b3326", textAlign: "center", lineHeight: `${TH - 6}px` }}>{i + 1}</div>;
        })}
        {/* la hoja de encima se abre hacia la izquierda en la pestaña */}
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0% 50%", transform: `rotateY(${-178 * open}deg)`, backfaceVisibility: "hidden", background: "#e9e3cb", boxShadow: "0 10px 30px rgba(0,0,0,.3)", opacity: open < 0.99 ? 1 : 0 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 120, bottom: 0, background: `repeating-linear-gradient(180deg, transparent 0 ${LEDGER_ROW - 2}px, ${K.rule} ${LEDGER_ROW - 2}px ${LEDGER_ROW}px)` }} />
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- MEJORA 2: monedas de cobre «dish N of 11» (se esconde con el avatar) ----------
export const Pennies: React.FC<{ n: number; of: number; name: string; o: number }> = ({ n, of, name, o }) => (
  <div style={{ position: "absolute", left: 44, bottom: 40, opacity: o, transform: `translateY(${(1 - o) * 30}px)`, background: "rgba(243,241,226,.95)", borderRadius: 6, padding: "10px 20px 14px", boxShadow: "0 10px 30px rgba(0,0,0,.35)", borderLeft: `6px solid ${K.red}` }}>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 34, color: K.ink, whiteSpace: "nowrap" }}>Dish {n} of {of} · {name}</div>
    <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
      {Array.from({ length: of }, (_, i) => <div key={i} style={{ width: 26, height: 26, borderRadius: 13, background: i < n ? `radial-gradient(circle at 35% 35%, #e6a774, ${K.copper} 60%, #7d4a1e)` : "transparent", border: `2px solid ${i < n ? "#7d4a1e" : "rgba(61,58,53,.35)"}` }} />)}
    </div>
  </div>
);

// ---------- MEJORA 7: mapa en tinta azul sobre una hoja del libro de cuentas (Iowa, el pueblo y la iglesia) ----------
const IA = "M60,40 L700,40 L720,90 L760,150 L740,230 L700,300 L690,360 L80,360 L70,290 L40,200 L50,110 Z";
export const MapInk: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS;
  const slide = eOut(t, 0.05, 0.8), draw = eIO(t, 0.5, 2.1), cam = eIO(t, 0, d);
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Table t={t} />
    <AbsoluteFill style={{ transform: `scale(${lerp(1, 1.12, cam)})`, transformOrigin: "60% 55%" }}>
      <div style={{ position: "absolute", left: 960 - 720, top: 540 - 450, transform: `translateY(${(1 - slide) * 1200}px) rotate(-1deg)` }}>
        <Ledger w={1440} h={900} money={200} top={130}>
          <div style={{ position: "absolute", left: 120, top: 40, fontFamily: SERIF, fontWeight: 700, fontSize: 48, color: K.ink, opacity: cl((t - 0.4) / 0.3) }}>Where Sunday dinner comes from</div>
          <svg width={1440} height={900} style={{ position: "absolute", left: 0, top: 0 }}>
            <g transform="translate(220,250)">
              <path d={IA} fill="rgba(92,140,110,.14)" stroke={K.ink} strokeWidth={5} strokeLinejoin="round" strokeDasharray={2600} strokeDashoffset={2600 * (1 - draw)} />
              <path d="M420,330 C440,260 470,220 520,190" fill="none" stroke={K.red} strokeWidth={6} strokeDasharray="14 12" opacity={cl((t - 2.1) / 0.4)} />
              <circle cx={520} cy={190} r={14} fill={K.red} opacity={cl((t - 2.3) / 0.3)} />
              <path d="M512,150 L520,128 L528,150 M520,128 L520,112 M512,120 L528,120" stroke={K.ink} strokeWidth={4} fill="none" opacity={cl((t - 2.4) / 0.3)} />
            </g>
          </svg>
          <div style={{ position: "absolute", left: 470, top: 420, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: K.ink, opacity: cl((t - 1.4) / 0.3) }}>Iowa</div>
          <div style={{ position: "absolute", left: 770, top: 370, fontFamily: HAND, fontWeight: 700, fontSize: 52, color: K.red, opacity: cl((t - 2.5) / 0.3) }}>our church · Sunday at noon</div>
        </Ledger>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- MEJORA 9: dato en un recorte de diario (columna de precios) con su fuente; va sobre la foto del momento ----------
export const Clipping: React.FC<{ o: any }> = ({ o }) => {
  const t = useCurrentFrame() / FPS, D = o.dur / FPS;
  const k = spr(t, 0.05, 7, 0.6), out = eIO(t, D - 0.4, D);
  return <div style={{ position: "absolute", right: 90, top: 100, width: 660, transform: `translateY(${(1 - k) * -700 - out * 900}px) rotate(-1.5deg)` }}>
    <div style={{ background: "#ece6d3", padding: "26px 34px 22px", boxShadow: "0 20px 40px rgba(0,0,0,.45)", clipPath: "polygon(0 2%, 4% 0, 9% 2%, 15% 0, 22% 1%, 30% 0, 41% 2%, 52% 0, 63% 2%, 75% 0, 86% 2%, 100% 0, 99% 50%, 100% 100%, 88% 98%, 74% 100%, 60% 98%, 45% 100%, 30% 98%, 15% 100%, 0 98%, 1% 50%)" }}>
      <div style={{ fontFamily: TYPE, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: "#4a443a", borderBottom: "2px solid #4a443a", paddingBottom: 6, marginBottom: 8 }}>{o.head || "WHAT IT COST"}</div>
      {o.lines.map((l: string, i: number) => {
        const last = i === o.lines.length - 1;
        return <div key={i} style={{ fontFamily: last ? HAND : TYPE, fontWeight: 700, fontSize: last ? 54 : 34, color: last ? K.red : "#2b2721", lineHeight: last ? "66px" : "48px", opacity: cl((t - 0.3 - i * 0.35) / 0.25), whiteSpace: "nowrap" }}>{l}</div>;
      })}
      <div style={{ fontFamily: TYPE, fontSize: 20, color: "#6b655a", marginTop: 8, opacity: cl((t - 0.5) / 0.3) }}>{o.src}</div>
    </div>
  </div>;
};
