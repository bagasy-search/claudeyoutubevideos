// lcf11b · piezas (look 313 libreta espiral). Mecanismos propios, distintos del registro lor11:
// hoja que baja desde el espiral y el lápiz escribe + porciones encerradas en birome; páginas que pasan por el espiral en el recap;
// lista con casillas que se tildan; foto vieja que se calza en las esquinas de un álbum negro; grilla de 11 casilleros que se llenan;
// separador con pestaña para cada cena; palitos de conteo «supper N of 11»; mapa a lápiz; dato en papelito con su fuente; libro + QR en un post-it.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, useCurrentFrame } from "remotion";
import { K, HAND, SERIF, SANS, cl, lerp, eOut, eIO, spr, rnd, hash, sf, hand, Counter, BlurBg, NotePage, Ring } from "./look";

const FPS = 30;
const useT = () => useCurrentFrame() / FPS;

// ---------- avatar (MEJORA 4: encuadres) ----------
export const Avatar: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS;
  const vid = (style: React.CSSProperties) => <OffthreadVideo src={sf(s.src)} startFrom={s.off} muted style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />;
  if (s.frame === "punch") return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{vid({ transform: `scale(${1.16 + 0.02 * cl(t / d)})`, transformOrigin: "52% 30%" })}</AbsoluteFill>;
  if (s.frame === "hands") return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{vid({ transform: `scale(${1.08 + 0.03 * cl(t / d)})`, transformOrigin: "50% 62%" })}</AbsoluteFill>;
  if (s.frame === "strip" && s.side) {
    // la foto siguiente entra como tira vertical por la derecha, con el borde perforado de la libreta
    const k = eOut(t, 0.2, 0.9);
    return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${-200 * k}px)` }}>{vid({})}</AbsoluteFill>
      <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 640, transform: `translateX(${(1 - k) * 700}px)`, overflow: "hidden", borderLeft: `14px solid ${K.page}`, boxShadow: "-20px 0 40px rgba(0,0,0,.35)" }}>
        <Img src={sf(s.side)} style={{ position: "absolute", left: -640, top: 0, width: 1920, height: 1080, objectFit: "cover", transform: `scale(${1.05 + 0.04 * cl(t / d)})` }} />
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

// ---------- foto (G): Ken Burns con punto de interés por plano ----------
export const Photo: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS, sd = hash(s.uid);
  const k = eIO(t, 0, d), z0 = 1.03 + 0.04 * (sd % 3), z1 = z0 + 0.08 + 0.04 * rnd(sd);
  const ox = 30 + 40 * rnd(sd + 3), oy = 35 + 30 * rnd(sd + 5), dx = (sd % 2 ? 1 : -1) * 22 * k;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#17120c" }}>
    <Img src={sf(s.src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${dx}px) scale(${lerp(z0, z1, k)})`, transformOrigin: `${ox}% ${oy}%` }} />
  </AbsoluteFill>;
};

// ---------- MEJORA 8: foto vieja que se calza en las 4 esquinas de una hoja de álbum negra; la cámara se acerca hasta la foto ----------
const Corner: React.FC<{ x: number; y: number; r: number; k: number }> = ({ x, y, r, k }) => (
  <div style={{ position: "absolute", left: x - 34, top: y - 34, width: 68, height: 68, transform: `rotate(${r}deg) scale(${k})`, opacity: k > 0.01 ? 1 : 0 }}>
    <div style={{ width: 0, height: 0, borderTop: "68px solid #1b1b1b", borderRight: "68px solid transparent", filter: "drop-shadow(1px 2px 1px rgba(255,255,255,.18))" }} />
  </div>
);
export const OldPhoto: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS, sd = hash(s.uid);
  const slide = eOut(t, 0.05, 1.1), cam = eIO(t, 1.0, d);
  const W = 1000, H = 720, X = 960 - W / 2, Y = 540 - H / 2 + 10;
  const h = hand(t, sd % 7, 0.7), rot = lerp(-2.5, 2.5, rnd(sd));
  return <AbsoluteFill style={{ overflow: "hidden", background: "#242220" }}>
    <AbsoluteFill style={{ transform: `translate(${h.x}px, ${h.y}px) scale(${lerp(0.94, 1.22, cam)}) rotate(${h.r}deg)`, transformOrigin: "50% 50%" }}>
      <AbsoluteFill style={{ background: "repeating-linear-gradient(90deg, rgba(255,255,255,.025) 0 1px, transparent 1px 5px), #2a2826" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 22, background: "#3a3632" }} />
      <div style={{ position: "absolute", left: X, top: Y, width: W, height: H, transform: `translateX(${(1 - slide) * 1300}px) rotate(${rot * (1 - slide) * 3 + rot}deg)`,
        padding: 18, background: "#f4ecda", boxShadow: "0 20px 40px rgba(0,0,0,.55)" }}>
        <Img src={sf(s.src)} style={{ width: W - 36, height: H - 36, objectFit: "cover", filter: "sepia(.15)" }} />
      </div>
      {[[X, Y, 0], [X + W, Y, 90], [X + W, Y + H, 180], [X, Y + H, 270]].map(([x, y, r], i) => <Corner key={i} x={x} y={y} r={r} k={spr(t, 1.0 + i * 0.12, 10, 0.5)} />)}
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- C card: la hoja baja desde el espiral (gira sobre los anillos), el lápiz escribe y la birome encierra las porciones ----------
const PORTION = /^((?:about |a |one |half |\d+\/?\d*\s?\d*\/?\d*)\s?(?:tbsp|tsp|cup|cups|lb|oz|pound|pounds|can|small can|rib|thigh|chop|eggs?|slices?)?)/i;
export const RecipeCard: React.FC<{ s: any; c: any }> = ({ s, c }) => {
  const t = useT(), d = s.dur / FPS, sd = hash(s.uid);
  if (!c) return <Counter t={t} />;
  const flip = eOut(t, 0.05, 1.0), cam = eIO(t, 2.4, Math.max(3, d - 0.5));
  const h = hand(t, sd % 9, 0.7);
  const W = 1560, H = 1000, ing = (c.ingredients || []).slice(0, 8), st = (c.steps || []).slice(0, 5);
  const wr = (i: number, a: number, step = 0.3) => cl((t - a - i * step) / 0.3);
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Counter t={t} />
    <AbsoluteFill style={{ transform: `translate(${h.x}px, ${h.y + lerp(90, -120, cam)}px) scale(${lerp(0.98, 1.1, cam)}) rotate(${h.r}deg)`, perspective: 2400 }}>
      <div style={{ position: "absolute", left: 960 - W / 2, top: 540 - H / 2, transformOrigin: "50% 0%", transform: `rotateX(${lerp(-100, 0, flip)}deg) rotate(-1deg)` }}>
        <NotePage w={W} h={H}>
          <div style={{ position: "absolute", left: 70, top: 78, right: 70, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 70, color: K.ink, opacity: wr(0, 0.7), whiteSpace: "nowrap" }}>{c.title}</div>
          </div>
          <div style={{ position: "absolute", left: 72, top: 172, display: "flex", gap: 22, fontFamily: HAND, fontSize: 40, color: K.red, opacity: wr(0, 1.0) }}>
            {[c.serves, c.time, c.cost].filter(Boolean).map((x: string, i: number) => <span key={i} style={{ whiteSpace: "nowrap" }}>{i ? "· " : ""}{x}</span>)}
          </div>
          <div style={{ position: "absolute", left: 80, top: 250, width: 640, fontFamily: HAND, fontSize: 44, lineHeight: "80px", color: K.pencil }}>
            {ing.map((x: string, i: number) => {
              const m = x.match(PORTION); const a = 1.2 + i * 0.32;
              return <div key={i} style={{ position: "relative", opacity: wr(i, 1.2, 0.32), whiteSpace: "nowrap", overflow: "visible", fontSize: x.length > 29 ? Math.floor(44 * 29 / x.length) : 44 }}>
                {m && m[1].trim() && <span style={{ position: "relative", display: "inline-block" }}><Ring k={cl((t - a - 0.6) / 0.4)} w={Math.max(90, m[1].length * 21 + 30)} />{m[1]}</span>}
                {m ? x.slice(m[1].length) : x}
              </div>;
            })}
          </div>
          <div style={{ position: "absolute", left: 790, top: 250, right: 60, fontFamily: HAND, fontSize: 42, lineHeight: "80px", color: K.pencil }}>
            {st.map((x: string, i: number) => <div key={i} style={{ opacity: wr(i, 2.6, 0.35), display: "flex", gap: 14 }}><span style={{ color: K.red }}>{i + 1}.</span><span style={{ lineHeight: "40px", paddingTop: 20 }}>{x}</span></div>)}
          </div>
          {c.tip && <div style={{ position: "absolute", left: 80, right: 70, bottom: 40, fontFamily: HAND, fontSize: 42, color: K.ink, opacity: wr(0, 4.2) }}>★ {c.tip}</div>}
        </NotePage>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- recap (MEJORA 10): la libreta abierta; la hoja anterior se da vuelta por el espiral y aparece la de esta receta con su foto sujeta por un clip ----------
export const RecapPage: React.FC<{ s: any; c: any; prev?: any; n: number; of: number }> = ({ s, c, prev, n, of }) => {
  const t = useT(), d = s.dur / FPS, sd = hash(s.uid);
  const turn = eIO(t, 0.0, 0.8), cam = eIO(t, 0.8, d);
  const W = 1500, H = 900, h = hand(t, sd % 5, 0.6);
  const body = (cc: any, photo?: string) => cc && <>
    <div style={{ position: "absolute", left: 70, top: 86, fontFamily: SERIF, fontWeight: 800, fontSize: 60, color: K.ink, whiteSpace: "nowrap" }}>{cc.title}</div>
    <div style={{ position: "absolute", left: 74, top: 170, width: 760, fontFamily: HAND, fontSize: 38, lineHeight: "62px", color: K.pencil }}>
      {(cc.ingredients || []).slice(0, 7).map((x: string, i: number) => <div key={i} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>– {x}</div>)}
      {cc.kind === "list" && <div>{(cc.sections || []).map((q: any) => q[0]).join(" · ")}</div>}
    </div>
    {photo && <div style={{ position: "absolute", right: 70, top: 160, width: 540, height: 400, padding: 12, background: "#fff", boxShadow: "0 14px 30px rgba(0,0,0,.3)", transform: "rotate(3deg)" }}>
      <Img src={sf(photo)} style={{ width: 516, height: 376, objectFit: "cover" }} />
      <div style={{ position: "absolute", left: 240, top: -26, width: 50, height: 90, border: "6px solid #8d939a", borderRadius: 24, borderBottomColor: "transparent" }} />
    </div>}
    <div style={{ position: "absolute", right: 80, bottom: 50, fontFamily: HAND, fontSize: 44, color: K.red }}>{cc.cost || ""}</div>
  </>;
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Counter t={t} />
    <AbsoluteFill style={{ transform: `translate(${h.x}px, ${h.y}px) scale(${lerp(0.96, 1.04, cam)})`, perspective: 2600 }}>
      <div style={{ position: "absolute", left: 960 - W / 2, top: 540 - H / 2 + 40 }}>
        <NotePage w={W} h={H}>{body(c, s.photo)}</NotePage>
      </div>
      {prev && turn < 1 && <div style={{ position: "absolute", left: 960 - W / 2, top: 540 - H / 2 + 40, transformOrigin: "50% 0%", transform: `rotateX(${lerp(0, 175, turn)}deg)`, backfaceVisibility: "hidden" }}>
        <NotePage w={W} h={H} rings={false}>{body(prev, s.prevPhoto)}</NotePage>
      </div>}
    </AbsoluteFill>
    <div style={{ position: "absolute", left: 70, top: 46, fontFamily: HAND, fontSize: 46, color: K.ink, background: "rgba(251,251,246,.92)", padding: "4px 18px", borderRadius: 6, transform: "rotate(-2deg)" }}>{n} of {of}</div>
  </AbsoluteFill>;
};

// ---------- lista de compras: casillas que se tildan a lápiz a medida que las nombra ----------
export const ShopList: React.FC<{ s: any; c: any }> = ({ s, c }) => {
  const t = useT(), d = s.dur / FPS, sd = hash(s.uid);
  const flip = eOut(t, 0.05, 0.9), h = hand(t, sd % 3, 0.6);
  const all: [string, string][] = []; (c.sections || []).forEach((q: any) => q[1].forEach((x: string) => all.push([q[0], x])));
  const per = Math.max(0.25, (d - 2.0) / all.length);
  const W = 1640, H = 1000;
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Counter t={t} />
    <AbsoluteFill style={{ transform: `translate(${h.x}px, ${h.y}px)`, perspective: 2400 }}>
      <div style={{ position: "absolute", left: 960 - W / 2, top: 540 - H / 2, transformOrigin: "50% 0%", transform: `rotateX(${lerp(-100, 0, flip)}deg)` }}>
        <NotePage w={W} h={H}>
          <div style={{ position: "absolute", left: 70, top: 78, fontFamily: SERIF, fontWeight: 800, fontSize: 64, color: K.ink }}>{c.title}</div>
          <div style={{ position: "absolute", right: 70, top: 98, fontFamily: HAND, fontSize: 44, color: K.red }}>{c.serves}</div>
          <div style={{ position: "absolute", left: 70, top: 180, right: 60, columnCount: 3, columnGap: 50, fontFamily: HAND, fontSize: 38, lineHeight: "52px", color: K.pencil }}>
            {all.map(([sec, x], i) => {
              const k = cl((t - 1.0 - i * per) / 0.25);
              return <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, breakInside: "avoid" }}>
                <div style={{ position: "relative", width: 30, height: 30, border: `3px solid ${K.pencil}`, borderRadius: 3, flex: "0 0 30px" }}>
                  <div style={{ position: "absolute", left: 2, top: -14, fontSize: 48, color: K.red, opacity: k, transform: `scale(${0.6 + 0.4 * k})` }}>✓</div>
                </div>
                <span style={{ whiteSpace: "nowrap", color: i < (c.sections[0][1].length) ? K.ink : K.pencil }}>{x}</span>
              </div>;
            })}
          </div>
        </NotePage>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- libro: tapa real; se abre (la tapa gira) y queda la página real; QR en un post-it pegado a la página ----------
export const PostItQR: React.FC<{ k: number; x: number; y: number; r?: number }> = ({ k, x, y, r = 3 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 520, height: 600, background: "#fbe98a", boxShadow: "0 18px 36px rgba(0,0,0,.35)",
    transform: `rotate(${r}deg) translateY(${(1 - k) * 1100}px)`, padding: 30 }}>
    <div style={{ fontFamily: HAND, fontSize: 52, color: K.ink, textAlign: "center", lineHeight: "56px" }}>Supper for One</div>
    <Img src={sf("lcf11b/qr.png")} style={{ width: 400, height: 400, display: "block", margin: "18px auto 0" }} />
    <div style={{ fontFamily: HAND, fontSize: 38, color: K.red, textAlign: "center", marginTop: 8 }}>link in the description</div>
  </div>
);
export const Book: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS, sd = hash(s.uid);
  const p = s.page as string; // "24" | "51" | "close"
  const h = hand(t, sd % 5, 0.6);
  const land = spr(t, 0.05, 6, 0.65), open = p === "close" ? 0 : eIO(t, 1.4, 2.6), cam = eIO(t, 2.6, d);
  const qrK = s.qr ? spr(t, s.qrAt ?? 3.5, 6, 0.6) : 0;
  const BW = 640, BH = 828;
  const bx = s.qr ? 360 : 960 - BW / 2;
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Counter t={t} />
    <AbsoluteFill style={{ transform: `translate(${h.x}px, ${h.y}px) scale(${lerp(1, s.qr ? 1.02 : 1.18, cam)})`, transformOrigin: "50% 45%", perspective: 3000 }}>
      <div style={{ position: "absolute", left: bx, top: 540 - BH / 2, width: BW, height: BH, transform: `translateY(${(1 - land) * 900}px) rotate(${lerp(-7, -1.5, land)}deg)` }}>
        {/* página real debajo */}
        {p !== "close" && <Img src={sf(`lcf11b/libro/p${p}.png`)} style={{ position: "absolute", inset: 0, width: BW, height: BH, objectFit: "fill", boxShadow: "0 30px 60px rgba(30,20,10,.45)" }} />}
        {/* tapa que gira hacia la izquierda */}
        <div style={{ position: "absolute", inset: 0, transformOrigin: "0% 50%", transform: `rotateY(${-170 * open}deg)`, backfaceVisibility: "hidden",
          boxShadow: "14px 26px 50px rgba(30,20,10,.5), 5px 0 0 #efe9da, 9px 0 0 #e1d9c6" }}>
          <Img src={sf("lcf11b/libro/cover.png")} style={{ width: BW, height: BH, objectFit: "cover", borderRadius: 3 }} />
        </div>
      </div>
      {s.qr && <PostItQR k={qrK} x={1130} y={230} />}
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- MEJORA 1: las 11 cenas en una grilla de la libreta; cada casillero se llena con su foto en orden ----------
export const SupperGrid: React.FC<{ s: any; items: any[] }> = ({ s, items }) => {
  const t = useT(), d = s.dur / FPS;
  const per = Math.min(0.55, (d - 2) / items.length), cam = eIO(t, 0, d);
  const W = 1700, H = 960;
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Counter t={t} />
    <AbsoluteFill style={{ transform: `scale(${lerp(1.0, 1.05, cam)})` }}>
      <div style={{ position: "absolute", left: 960 - W / 2, top: 560 - H / 2 }}>
        <NotePage w={W} h={H}>
          <div style={{ position: "absolute", left: 70, top: 70, fontFamily: SERIF, fontWeight: 800, fontSize: 58, color: K.ink }}>Eleven little suppers · one pan of sauce</div>
          {items.map((it, i) => {
            const col = i % 4, row = Math.floor(i / 4);
            const k = spr(t, 0.6 + i * per, 9, 0.55);
            return <div key={i} style={{ position: "absolute", left: 70 + col * 395, top: 160 + row * 262, width: 370, height: 240, border: `3px dashed ${K.pencil}`, borderRadius: 6 }}>
              <div style={{ position: "absolute", inset: 8, overflow: "hidden", transform: `scale(${k})`, opacity: k > 0.02 ? 1 : 0, borderRadius: 4 }}>
                <Img src={sf(it.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "4px 12px", background: "rgba(251,251,246,.9)", fontFamily: HAND, fontSize: 30, color: K.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{i + 1}. {it.name}</div>
              </div>
            </div>;
          })}
        </NotePage>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- MEJORA 3 + 5: apertura de cada cena = la libreta pasa a una hoja separadora con pestaña de color; número a lápiz y nombre ----------
const TABC = ["#e8b4b8", "#b9d7a8", "#a9c9e4", "#f3d38c", "#c9b6e4", "#f2b48c"];
export const Divider: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS;
  const turn = eIO(t, 0, 0.7), cam = eIO(t, 0, d);
  const col = TABC[(s.n - 1) % TABC.length];
  const W = 1400, H = 820;
  const words = String(s.name || "").split(" ");
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <BlurBg src={s.bg} t={t} dim={0.25} />
    <AbsoluteFill style={{ transform: `scale(${lerp(1, 1.05, cam)})`, perspective: 2600 }}>
      <div style={{ position: "absolute", left: 960 - W / 2, top: 540 - H / 2 + 30, transformOrigin: "50% 0%", transform: `rotateX(${lerp(-95, 0, turn)}deg)` }}>
        <div style={{ position: "relative", width: W, height: H, background: col, borderRadius: 6, boxShadow: "0 30px 60px rgba(0,0,0,.45)" }}>
          <div style={{ position: "absolute", right: 90 + ((s.n - 1) % 6) * 140, bottom: -64, width: 170, height: 70, background: col, borderRadius: "0 0 14px 14px", fontFamily: SANS, fontWeight: 700, fontSize: 40, color: "#3b3326", textAlign: "center", lineHeight: "62px" }}>{s.n}</div>
          <div style={{ position: "absolute", left: 90, top: 70, fontFamily: SANS, fontWeight: 700, fontSize: 36, letterSpacing: 8, color: "#3b3326", opacity: cl((t - 0.6) / 0.3) }}>SUPPER NUMBER</div>
          <div style={{ position: "absolute", left: 80, top: 110, fontFamily: SERIF, fontWeight: 800, fontSize: 300, lineHeight: "320px", color: "#2a241b", opacity: cl((t - 0.7) / 0.3), transform: `scale(${lerp(1.25, 1, eOut(t, 0.7, 1.1))})`, transformOrigin: "0 50%" }}>{s.n}</div>
          <div style={{ position: "absolute", left: 90, right: 80, top: 460, fontFamily: HAND, fontSize: 96, lineHeight: "104px", color: "#2a241b" }}>
            {words.map((w: string, i: number) => <span key={i} style={{ display: "inline-block", marginRight: 22, opacity: cl((t - 1.0 - i * 0.16) / 0.2) }}>{w}</span>)}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- MEJORA 2: palitos de conteo a lápiz «supper N of 11» en la esquina (se esconde con el avatar) ----------
export const Tally: React.FC<{ n: number; of: number; name: string; o: number }> = ({ n, of, name, o }) => (
  <div style={{ position: "absolute", left: 44, bottom: 40, opacity: o, transform: `translateY(${(1 - o) * 30}px)`, background: "rgba(251,251,246,.94)", borderRadius: 8, padding: "10px 20px 12px", boxShadow: "0 10px 30px rgba(0,0,0,.3)" }}>
    <div style={{ fontFamily: HAND, fontSize: 36, color: K.ink, whiteSpace: "nowrap" }}>Supper {n} of {of} · {name}</div>
    <div style={{ display: "flex", gap: 7, marginTop: 4, height: 34, alignItems: "flex-end" }}>
      {Array.from({ length: of }, (_, i) => <div key={i} style={{ width: 5, height: 32, background: i < n ? K.red : "rgba(60,58,55,.25)", transform: `rotate(${(i % 3) - 1}deg)`, borderRadius: 2, marginRight: i % 5 === 4 ? 12 : 0 }} />)}
    </div>
  </div>
);

// ---------- MEJORA 7: mapa a lápiz en la libreta (MN→IA para la hotdish; Des Moines para el supper club) ----------
const MN = "M150,40 L420,40 L430,90 L520,110 L470,170 L420,230 L430,300 L470,350 L470,420 L150,420 L150,300 L130,200 L140,110 Z";
const IA = "M150,430 L480,430 L500,470 L520,520 L500,580 L470,620 L170,620 L160,560 L140,500 Z";
export const MapPencil: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS;
  const flip = eOut(t, 0.05, 0.8), draw = eIO(t, 0.5, 2.0), cam = eIO(t, 0, d);
  const mn = s.val === "mn";
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Counter t={t} />
    <AbsoluteFill style={{ transform: `scale(${lerp(1, 1.1, cam)})`, transformOrigin: "45% 55%", perspective: 2400 }}>
      <div style={{ position: "absolute", left: 960 - 700, top: 540 - 470, transformOrigin: "50% 0%", transform: `rotateX(${lerp(-100, 0, flip)}deg)` }}>
        <NotePage w={1400} h={940}>
          <svg width={1400} height={940} style={{ position: "absolute", left: 0, top: 0 }}>
            <g transform="translate(330,150)">
              <path d={MN} fill={mn ? "rgba(169,201,228,.35)" : "none"} stroke={K.pencil} strokeWidth={5} strokeLinejoin="round" strokeDasharray={2600} strokeDashoffset={2600 * (1 - draw)} opacity={mn ? 1 : 0.35} />
              <path d={IA} fill="rgba(185,215,168,.35)" stroke={K.pencil} strokeWidth={5} strokeLinejoin="round" strokeDasharray={2000} strokeDashoffset={2000 * (1 - draw)} />
              {mn && <path d="M300,250 C380,330 380,420 330,520" fill="none" stroke={K.red} strokeWidth={7} strokeDasharray="16 12" opacity={cl((t - 1.9) / 0.3)} />}
              {!mn && <text x={355} y={545} fontSize={80} fill={K.red} opacity={cl((t - 1.9) / 0.3)}>★</text>}
            </g>
          </svg>
          <div style={{ position: "absolute", left: 520, top: 360, fontFamily: HAND, fontSize: 64, color: K.ink, opacity: mn ? cl((t - 1.2) / 0.3) : 0.4 }}>Minnesota</div>
          <div style={{ position: "absolute", left: 560, top: 640, fontFamily: HAND, fontSize: 64, color: K.ink, opacity: cl((t - 1.4) / 0.3) }}>Iowa</div>
          {!mn && <div style={{ position: "absolute", left: 840, top: 650, fontFamily: HAND, fontSize: 58, color: K.red, opacity: cl((t - 2.1) / 0.3) }}>Des Moines</div>}
          {mn && <div style={{ position: "absolute", left: 830, top: 470, fontFamily: HAND, fontSize: 52, color: K.red, opacity: cl((t - 2.2) / 0.3) }}>hotdish came south</div>}
        </NotePage>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- MEJORA 9: dato en un papelito arrancado de la libreta, con su fuente (va sobre la foto del momento, ≤15 s) ----------
export const Dato: React.FC<{ o: any }> = ({ o }) => {
  const t = useCurrentFrame() / FPS;
  const k = spr(t, 0.05, 8, 0.55), out = eIO(t, o.dur / FPS - 0.4, o.dur / FPS);
  return <div style={{ position: "absolute", right: 90, top: 110, width: 640, transform: `translateX(${(1 - k) * 800 + out * 800}px) rotate(2deg)` }}>
    <div style={{ background: K.page, padding: "26px 34px 22px", boxShadow: "0 20px 40px rgba(0,0,0,.4)", clipPath: "polygon(0 4%, 6% 0, 14% 3%, 22% 0, 31% 3%, 40% 0, 50% 3%, 60% 0, 70% 3%, 80% 0, 90% 3%, 100% 0, 100% 100%, 0 100%)" }}>
      {o.lines.map((l: string, i: number) => <div key={i} style={{ fontFamily: HAND, fontSize: i === o.lines.length - 1 ? 56 : 44, color: i === o.lines.length - 1 ? K.red : K.pencil, lineHeight: "62px", opacity: cl((t - 0.3 - i * 0.35) / 0.25), whiteSpace: "nowrap" }}>{l}</div>)}
      <div style={{ fontFamily: SANS, fontWeight: 500, fontSize: 22, color: "#6b675f", marginTop: 8, opacity: cl((t - 0.5) / 0.3) }}>{o.src}</div>
    </div>
  </div>;
};
