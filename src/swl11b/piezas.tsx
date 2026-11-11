// swl11b · piezas de estructura (avatar, clips, fotos, ficha de receta, libro, QR, carrusel, barra, mapa, datos, semana).
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, useCurrentFrame } from "remotion";
import { K, HAND, SERIF, SANS, cl, lerp, eOut, eIO, spr, rnd, hash, sf, hand, Wood, BlurBg, Tape, IndexCard } from "./look";

const FPS = 30;
const useT = () => useCurrentFrame() / FPS;

// ---------- avatar (MEJORA 4: encuadres) ----------
export const Avatar: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS;
  const vid = (style: React.CSSProperties) => <OffthreadVideo src={sf(s.src)} startFrom={s.off} muted style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />;
  if (s.frame === "punch") {
    const z = 1.12 + 0.015 * cl(t / d);
    return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{vid({ transform: `scale(${z})`, transformOrigin: "52% 34%" })}</AbsoluteFill>;
  }
  if (s.frame === "split" && s.side) {
    const k = eOut(t, 0.15, 0.75);
    return <AbsoluteFill style={{ background: K.card }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, overflow: "hidden" }}>{vid({ width: 1920, height: 1080, transform: "translateX(-430px)" })}</div>
      <div style={{ position: "absolute", left: 960 + 960 * (1 - k), top: 0, width: 960, height: 1080, overflow: "hidden", borderLeft: `8px solid ${K.card}` }}>
        <Img src={sf(s.side)} style={{ width: 1920 * 0.9, height: 1080 * 0.9 * 1.12, objectFit: "fill", transform: `translate(${-380 - 30 * t}px, -40px)` }} />
      </div>
    </AbsoluteFill>;
  }
  if (s.frame === "polaroid" && s.pol) {
    // la foto vieja que acaba de contar cae al lado de ella como polaroid y queda apoyada
    const k = spr(t, 0.35, 6, 0.55), out = eIO(t, d - 0.6, d);
    return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      {vid({})}
      <div style={{ position: "absolute", left: 1290, top: 250, width: 520, padding: "22px 22px 80px", background: "#fbf8f0", boxShadow: "0 30px 60px rgba(0,0,0,.45)",
        transform: `translateY(${(1 - k) * -900 + out * 900}px) rotate(${lerp(-22, 6, k)}deg)`, opacity: k > 0.01 ? 1 : 0 }}>
        <Img src={sf(s.pol)} style={{ width: 476, height: 360, objectFit: "cover", filter: "sepia(.25) saturate(.85)" }} />
        <Tape x={260} y={-4} w={170} rot={-4} />
      </div>
    </AbsoluteFill>;
  }
  return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{vid({ transform: `scale(${1.0 + 0.02 * cl(t / d)})`, transformOrigin: "50% 40%" })}</AbsoluteFill>;
};

// ---------- clip real (Y) y Veo (V) ----------
export const ClipY: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS, sd = hash(s.uid);
  const z = 1.04 + 0.05 * cl(t / d), dir = sd % 2 ? 1 : -1;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#1a120a" }}>
    <OffthreadVideo src={sf(s.src)} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z}) translateX(${dir * 12 * cl(t / d)}px)` }} />
  </AbsoluteFill>;
};
export const Veo: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS;
  const rate = s.vd < d + 0.1 ? Math.max(0.5, (s.vd - 0.15) / d) : 1;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#1a120a" }}>
    <OffthreadVideo src={sf(s.src)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.02 + 0.03 * cl(t / d)})` }} />
  </AbsoluteFill>;
};

// ---------- foto (G): Ken Burns con punto de interés distinto por plano; DETALLE = recorte cercano ----------
export const Photo: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS, sd = hash(s.uid);
  const det = s.det || 0;
  const z0 = det ? 1.45 + 0.1 * (sd % 3) : 1.03, z1 = z0 + (det ? 0.08 : 0.09);
  const ox = det ? 25 + 50 * rnd(sd) : 50, oy = det ? 30 + 40 * rnd(sd + 1) : 45;
  const k = eIO(t, 0, d);
  const dx = (sd % 2 ? 1 : -1) * 20 * k;
  return <AbsoluteFill style={{ overflow: "hidden", background: "#1a120a" }}>
    <Img src={sf(s.src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `translateX(${dx}px) scale(${lerp(z0, z1, k)})`, transformOrigin: `${ox}% ${oy}%` }} />
  </AbsoluteFill>;
};

// ---------- MEJORA 8: foto de época como OBJETO: sale de un sobre de papel madera, con esquinas de cinta, y queda en la mesa ----------
export const OldPhoto: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS, sd = hash(s.uid);
  const det = s.det || 0;
  if (det) {
    // segunda toma de la misma foto: la cámara ya está encima, recorriendo un detalle
    const k = eIO(t, 0, d);
    return <AbsoluteFill style={{ overflow: "hidden", background: "#3b2a1a" }}>
      <Img src={sf(s.src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "sepia(.18)", transform: `scale(${lerp(1.5, 1.6, k)})`, transformOrigin: `${20 + 60 * rnd(sd)}% ${30 + 40 * rnd(sd + 2)}%` }} />
    </AbsoluteFill>;
  }
  const pull = eOut(t, 0.1, 1.3), cam = eIO(t, 0.4, d);
  const rot = lerp(-3, 2.2, rnd(sd)) * 1;
  const h = hand(t, sd % 7, 0.8);
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Wood t={t} />
    <AbsoluteFill style={{ transform: `translate(${h.x}px, ${h.y}px) scale(${lerp(0.92, 1.18, cam)}) rotate(${h.r}deg)`, transformOrigin: "50% 52%" }}>
      {/* sobre de papel madera (queda abajo, la foto sale hacia arriba) */}
      <div style={{ position: "absolute", left: 470, top: 640 + 160 * pull, width: 980, height: 520, background: "linear-gradient(180deg,#c9a46e,#b48c55)", borderRadius: 8, boxShadow: "0 30px 60px rgba(40,20,5,.5)", opacity: 1 - eOut(t, 1.2, 1.8) }} />
      <div style={{ position: "absolute", left: 960 - 520, top: lerp(700, 150, pull), width: 1040, height: 800, padding: 26, paddingBottom: 26, background: "#f7f1e1", boxShadow: "0 40px 80px rgba(30,15,5,.55)", transform: `rotate(${rot}deg)` }}>
        <Img src={sf(s.src)} style={{ width: 988, height: 748, objectFit: "cover", filter: "sepia(.2) saturate(.9)" }} />
        {pull > 0.95 && <><Tape x={30} y={30} w={120} rot={-40} /><Tape x={1010} y={30} w={120} rot={40} /><Tape x={30} y={770} w={120} rot={40} /><Tape x={1010} y={770} w={120} rot={-40} /></>}
      </div>
      <div style={{ position: "absolute", left: 470, top: 860 + 160 * pull, width: 980, height: 300, background: "linear-gradient(180deg,#bf975f,#a57d48)", borderRadius: "0 0 8px 8px", opacity: 1 - eOut(t, 1.2, 1.8) }} />
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- K: ficha de la receta (≥8 s). Entra a la mesa como objeto; la cámara baja de ingredientes a pasos ----------
export const RecipeCard: React.FC<{ s: any; c: any; recap?: boolean }> = ({ s, c, recap }) => {
  const t = useT(), d = s.dur / FPS, sd = hash(s.uid);
  if (!c) return <Wood t={t} />;
  const land = spr(t, 0.05, 6.5, 0.6);
  const cam = eIO(t, 1.2, Math.max(2, d - 0.6));
  const h = hand(t, sd % 9, 0.7);
  const W = 1500, H = 1000, ing = c.ingredients.slice(0, 8), st = c.steps.slice(0, 5);
  const lineGap = 44;
  const write = (i: number, a: number) => cl((t - a - i * 0.18) / 0.35);
  const camY = recap ? 0 : lerp(140, -170, cam);
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Wood t={t} />
    <AbsoluteFill style={{ transform: `translate(${h.x}px, ${h.y + camY}px) scale(${recap ? 0.92 : lerp(1.0, 1.1, cam)}) rotate(${h.r}deg)`, transformOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", left: 960 - W / 2, top: 540 - H / 2, transform: `translateY(${(1 - land) * -1300}px) rotate(${lerp(-14, -1.5, land)}deg)` }}>
        <IndexCard w={W} h={H} lineGap={lineGap} top={150}>
          <div style={{ position: "absolute", left: 60, top: 34, right: 60, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 84, color: K.ink, opacity: write(0, 0.5), whiteSpace: "nowrap" }}>{c.title}</div>
            <div style={{ fontFamily: HAND, fontWeight: 600, fontSize: 44, color: K.red, opacity: write(1, 0.6), whiteSpace: "nowrap" }}>{c.cost}</div>
          </div>
          <div style={{ position: "absolute", left: 64, top: 152, width: 640, fontFamily: HAND, fontWeight: 600, fontSize: 38, lineHeight: `${lineGap}px`, color: K.ink }}>
            {ing.map((x: string, i: number) => <div key={i} style={{ opacity: write(i, 1.0), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>• {x}</div>)}
          </div>
          <div style={{ position: "absolute", left: 740, top: 152, right: 50, fontFamily: HAND, fontWeight: 600, fontSize: 38, lineHeight: `${lineGap}px`, color: K.ink }}>
            {st.map((x: string, i: number) => <div key={i} style={{ opacity: write(i, 2.2) }}>{i + 1}. {x}</div>)}
          </div>
          <div style={{ position: "absolute", left: 64, right: 60, bottom: 26, fontFamily: HAND, fontWeight: 700, fontSize: 38, color: K.red, opacity: write(0, 3.6), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {[c.serves, c.time].filter(Boolean).join(" · ")}{c.tip ? `  —  ${c.tip}` : ""}
          </div>
        </IndexCard>
        <Tape x={W / 2} y={-6} w={220} rot={-3} o={cl(land * 1.3)} />
      </div>
    </AbsoluteFill>
    {recap && <div style={{ position: "absolute", right: 120, top: 90, fontFamily: HAND, fontWeight: 700, fontSize: 120, color: K.red, transform: `scale(${spr(t, 0.6, 9, 0.4)}) rotate(-12deg)` }}>✓</div>}
  </AbsoluteFill>;
};

// ---------- B: libro (tapa, página real abierta, libro cerrado) ----------
export const Book: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS, sd = hash(s.uid);
  const p = s.page as string;
  const h = hand(t, sd % 5, 0.6), cam = eIO(t, 0, d);
  const k = spr(t, 0.05, 6, 0.65);
  if (p === "book cover" || p === "book closed") {
    const closed = p === "book closed";
    return <AbsoluteFill style={{ overflow: "hidden" }}>
      <Wood t={t} />
      <div style={{ position: "absolute", left: 960 - 330, top: 540 - 440, width: 660, height: 880, transform: `translate(${h.x}px, ${h.y + (1 - k) * 700}px) rotate(${lerp(8, closed ? -4 : 2, k)}deg) scale(${lerp(0.95, 1.05, cam)})`,
        boxShadow: "18px 30px 60px rgba(40,20,5,.55), 6px 0 0 #efe6d2, 10px 0 0 #e2d7bf, 14px 0 0 #d6caae" }}>
        <Img src={sf("swl11b/book/p1.png")} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 4 }} />
      </div>
    </AbsoluteFill>;
  }
  const n = p.replace("p", "");
  // página real (PyMuPDF 200 dpi) apoyada sobre la mesa; la cámara se acerca hasta que se lee
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Wood t={t} />
    <AbsoluteFill style={{ transform: `translate(${h.x}px, ${h.y}px) scale(${lerp(1.0, 1.32, cam)})`, transformOrigin: "50% 38%" }}>
      <div style={{ position: "absolute", left: 960 - 380, top: 40, width: 760, height: 984, transform: `translateY(${(1 - k) * 900}px) rotate(${lerp(-6, -0.6, k)}deg)`, boxShadow: "0 40px 80px rgba(40,20,5,.5), -8px 0 0 #f1ead8" }}>
        <Img src={sf(`swl11b/book/p${n}.png`)} style={{ width: "100%", height: "100%", objectFit: "fill" }} />
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- Q: QR (≥8 s), sin URL escrita ----------
export const QR: React.FC<{ s: any }> = ({ s }) => {
  const t = useT();
  const k = spr(t, 0.05, 7, 0.6);
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Wood t={t} />
    <div style={{ position: "absolute", left: 260, top: 150, width: 560, height: 746, transform: `rotate(-4deg) translateY(${(1 - k) * 600}px)`, boxShadow: "16px 28px 50px rgba(40,20,5,.5)" }}>
      <Img src={sf("swl11b/book/p1.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
    <div style={{ position: "absolute", left: 980, top: 170, transform: `rotate(2deg) translateY(${(1 - k) * -700}px)` }}>
      <IndexCard w={680} h={740} top={110} lineGap={52}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 28, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 62, color: K.ink }}>Supper for One</div>
        <div style={{ position: "absolute", left: 110, top: 140, width: 460, height: 460, background: "#fffaf0", padding: 0 }}>
          <Img src={sf("swl11b/qr.png")} style={{ width: 460, height: 460 }} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 46, color: K.red }}>the link is in the description</div>
      </IndexCard>
      <Tape x={340} y={-4} w={200} rot={3} />
    </div>
  </AbsoluteFill>;
};

// ---------- MEJORA 3: apertura de cada receta = la ficha-título entra a la mesa, el número se dibuja y el nombre se escribe ----------
export const Opener: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS, sd = hash(s.uid);
  const land = spr(t, 0.1, 7, 0.55), cam = eIO(t, 0, d);
  const words = String(s.name).split(" ");
  const num = String(s.n);
  const draw = cl((t - 0.45) / 0.7);
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <BlurBg src={s.bg} t={t} dim={0.25} />
    <AbsoluteFill style={{ transform: `scale(${lerp(1, 1.06, cam)})` }}>
      <div style={{ position: "absolute", left: 960 - 620, top: 540 - 330, transform: `translateY(${(1 - land) * 1100}px) rotate(${lerp(10, -2 + (sd % 3), land)}deg)` }}>
        <IndexCard w={1240} h={660} top={210} lineGap={58}>
          <div style={{ position: "absolute", left: 70, top: 26, fontFamily: SERIF, fontSize: 210, lineHeight: "210px", color: "transparent", WebkitTextStroke: `4px ${K.red}`,
            clipPath: `inset(0 ${100 - draw * 100}% 0 0)` }}>{num}</div>
          <div style={{ position: "absolute", left: 70, top: 26, fontFamily: SERIF, fontSize: 210, lineHeight: "210px", color: K.red, opacity: cl((t - 1.1) / 0.4) }}>{num}</div>
          <div style={{ position: "absolute", left: 250, top: 92, fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: 6, color: K.pencil, opacity: cl((t - 0.5) / 0.3) }}>RECIPE {s.n} OF {s.of}</div>
          <div style={{ position: "absolute", left: 70, top: 262, right: 60, fontFamily: HAND, fontWeight: 700, fontSize: 112, lineHeight: "116px", color: K.ink }}>
            {words.map((w: string, i: number) => <span key={i} style={{ opacity: cl((t - 1.0 - i * 0.22) / 0.2), marginRight: 26, display: "inline-block" }}>{w}</span>)}
          </div>
        </IndexCard>
        <Tape x={130} y={10} w={190} rot={-28} o={land} /><Tape x={1110} y={10} w={190} rot={24} o={land} />
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- MEJORA 5: transición de capítulo = una ficha en blanco barre la pantalla y deja el título escrito a mano ----------
export const ChapterBar: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS;
  const sweep = eIO(t, 0, Math.min(0.9, d * 0.5));
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <BlurBg src={s.bg} t={t} dim={0.3} />
    <div style={{ position: "absolute", left: lerp(-2100, -40, sweep), top: 300, transform: "rotate(-2deg)" }}>
      <IndexCard w={2000} h={480} top={150} lineGap={56}>
        <div style={{ position: "absolute", left: 300, top: 170, fontFamily: HAND, fontWeight: 700, fontSize: 150, color: K.ink, opacity: cl((t - 0.5) / 0.3), whiteSpace: "nowrap" }}>{s.chapter}</div>
      </IndexCard>
    </div>
  </AbsoluteFill>;
};

// ---------- MEJORA 9: dato con su fuente (si dice USDA, la fuente es USDA; si es su cuenta, dice que es su cuenta del súper) ----------
export const Dato: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), sd = hash(s.uid);
  const [txt, src0] = String(s.val).split(" — ");
  const src = src0 ? (src0.trim() === "USDA" ? "Source: USDA Food Safety and Inspection Service" : src0) : "Loretta's grocery math · Iowa store prices, Nov 2026";
  const parts = txt.split(" · ");
  const k = spr(t, 0.05, 7.5, 0.5);
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <BlurBg src={s.bg} t={t} dim={0.28} />
    <div style={{ position: "absolute", left: 960 - 650, top: 540 - 300, transform: `rotate(${(sd % 2 ? 1.5 : -1.5)}deg) scale(${lerp(0.6, 1, k)})`, opacity: cl(k * 2) }}>
      <IndexCard w={1300} h={600} top={130} lineGap={64}>
        <div style={{ position: "absolute", left: 70, right: 60, top: 170, fontFamily: HAND, fontWeight: 700, fontSize: parts.length > 2 ? 74 : 104, lineHeight: parts.length > 2 ? "64px" : "128px", color: K.ink }}>
          {parts.map((p, i) => <div key={i} style={{ opacity: cl((t - 0.35 - i * 0.45) / 0.3), whiteSpace: "nowrap" }}>{p}</div>)}
        </div>
        <div style={{ position: "absolute", left: 70, right: 60, top: 42, fontFamily: SANS, fontWeight: 700, fontSize: 30, letterSpacing: 2, color: K.red, opacity: cl((t - 0.2) / 0.3) }}>{src}</div>
      </IndexCard>
      <Tape x={650} y={-4} w={200} rot={-2} />
    </div>
  </AbsoluteFill>;
};

// ---------- MEJORA 7: mapa de Iowa a mano en una ficha, con el trazo de la ruta hasta la iglesia ----------
const IOWA = "M60,40 L760,40 L770,70 L800,95 L812,140 L840,175 L846,215 L820,250 L800,300 L760,330 L748,380 L715,410 L690,440 L60,440 L45,400 L40,330 L20,280 L15,200 L30,140 L42,90 Z";
export const MapIowa: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS;
  const k = spr(t, 0.05, 7, 0.6), draw = eIO(t, 0.4, 2.4), cam = eIO(t, 0, d);
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Wood t={t} />
    <AbsoluteFill style={{ transform: `scale(${lerp(1, 1.12, cam)})`, transformOrigin: "58% 52%" }}>
      <div style={{ position: "absolute", left: 960 - 650, top: 540 - 380, transform: `translateY(${(1 - k) * 900}px) rotate(-1.5deg)` }}>
        <IndexCard w={1300} h={760} top={120} lineGap={60}>
          <svg width={1300} height={760} style={{ position: "absolute", left: 0, top: 0 }}>
            <g transform="translate(220,170)">
              <path d={IOWA} fill="rgba(140,190,120,.18)" stroke={K.ink} strokeWidth={6} strokeLinejoin="round" strokeDasharray={3200} strokeDashoffset={3200 * (1 - draw)} />
              <path d="M420,420 C380,330 470,300 450,230" fill="none" stroke={K.red} strokeWidth={6} strokeDasharray="14 12" opacity={cl((t - 2.2) / 0.4)} />
              <circle cx={450} cy={230} r={18 * spr(t, 2.6, 9, 0.4)} fill={K.red} />
            </g>
          </svg>
          <div style={{ position: "absolute", left: 70, top: 30, fontFamily: HAND, fontWeight: 700, fontSize: 72, color: K.ink, opacity: cl((t - 0.3) / 0.3) }}>Iowa</div>
          <div style={{ position: "absolute", left: 700, top: 360, fontFamily: HAND, fontWeight: 700, fontSize: 58, color: K.red, opacity: cl((t - 2.8) / 0.3), whiteSpace: "nowrap" }}>our church</div>
        </IndexCard>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- MEJORA 1: carrusel de las 7 recetas sobre la foto desenfocada; giran en profundidad y terminan en abanico ----------
export const Carousel: React.FC<{ s: any; items: any[]; title?: string }> = ({ s, items, title }) => {
  const t = useT(), d = s.dur / FPS, n = items.length;
  const fan = eIO(t, d - 2.4, d - 0.6);
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <BlurBg src={s.bg} t={t} dim={0.35} />
    <AbsoluteFill style={{ perspective: 1800 }}>
      {items.map((it, i) => {
        const a0 = (i / n) * Math.PI * 2 + t * 0.55;
        const enter = spr(t, 0.15 + i * 0.22, 7, 0.6);
        const x = Math.sin(a0) * 620, z = Math.cos(a0) * 420 - 200;
        const fx = (i - (n - 1) / 2) * 200, fr = (i - (n - 1) / 2) * 7;
        const X = lerp(x, fx, fan), Z = lerp(z, 0, fan), R = lerp(-Math.sin(a0) * 25, fr, fan), Y = lerp(0, Math.abs(i - (n - 1) / 2) * 22, fan);
        return <div key={i} style={{ position: "absolute", left: 960 - 170, top: 540 - 250 + Y, width: 340, height: 470, transform: `translateX(${X}px) translateZ(${Z}px) rotateY(${lerp(-Math.sin(a0) * 35, 0, fan)}deg) rotate(${R}deg) scale(${enter})`,
          zIndex: Math.round(lerp(Z, i, fan) + 1000), background: K.card, borderRadius: 8, boxShadow: "0 24px 50px rgba(0,0,0,.45)", padding: 16 }}>
          <Img src={sf(it.img)} style={{ width: 308, height: 300, objectFit: "cover", borderRadius: 4 }} />
          <div style={{ fontFamily: SERIF, fontSize: 54, color: K.red, lineHeight: "60px", marginTop: 6 }}>{it.n}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 36, lineHeight: "36px", color: K.ink }}>{it.name}</div>
        </div>;
      })}
    </AbsoluteFill>
    {title && <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 78, color: K.tx, textShadow: "0 6px 24px rgba(0,0,0,.6)", opacity: cl((t - 0.6) / 0.4) }}>{title}</div>}
  </AbsoluteFill>;
};

// ---------- la semana: cada día una ficha que se agrega a la fila del corcho ----------
export const WeekDay: React.FC<{ s: any; idx: number; days: any[] }> = ({ s, idx, days }) => {
  const t = useT();
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Wood t={t} />
    {days.slice(0, idx + 1).map((dd, i) => {
      const me = i === idx, k = me ? spr(t, 0.05, 7, 0.55) : 1;
      const col = i % 3, row = Math.floor(i / 3);
      const x = 160 + col * 560, y = 110 + row * 470;
      const [day, ...rest] = String(dd.val).split(" ");
      return <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translateY(${(1 - k) * -700}px) rotate(${((i * 37) % 7) - 3}deg)`, opacity: me ? 1 : 0.92 }}>
        <IndexCard w={500} h={400} top={96} lineGap={50}>
          {dd.img && <Img src={sf(dd.img)} style={{ position: "absolute", left: 24, top: 120, width: 452, height: 250, objectFit: "cover", borderRadius: 3 }} />}
          <div style={{ position: "absolute", left: 26, top: 14, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: K.red }}>{day}</div>
          <div style={{ position: "absolute", left: 26, right: 20, top: 74, fontFamily: HAND, fontWeight: 700, fontSize: 34, color: K.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rest.join(" ")}</div>
        </IndexCard>
        <Tape x={250} y={-4} w={150} rot={(i % 2 ? 4 : -4)} />
      </div>;
    })}
  </AbsoluteFill>;
};

// ---------- MEJORA 2: barra de progreso «recipe 3 of 7» (esquina inferior derecha; se esconde en el avatar) ----------
export const Progress: React.FC<{ n: number; of: number; name: string; t: number; o: number }> = ({ n, of, name, t, o }) => (
  <div style={{ position: "absolute", right: 46, bottom: 40, opacity: o, transform: `translateY(${(1 - o) * 30}px)`, background: "rgba(253,250,241,.93)", borderRadius: 10, padding: "12px 20px 14px", boxShadow: "0 10px 30px rgba(0,0,0,.35)" }}>
    <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 36, color: K.ink, whiteSpace: "nowrap" }}>Recipe {n} of {of} · {name}</div>
    <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
      {Array.from({ length: of }, (_, i) => <div key={i} style={{ width: 22, height: 22, borderRadius: 11, border: `3px solid ${K.red}`, background: i < n ? K.red : "transparent" }} />)}
    </div>
  </div>
);

// ---------- la lista de compras de la semana: un anotador rayado en la mesa, cada cosa se escribe cuando Loretta la nombra ----------
// 3 planos seguidos (part 0/1/2) con encuadre distinto sobre el MISMO anotador: lo ya escrito queda arriba.
export const SHOP: { t: number; txt: string; q?: string }[] = [
  { t: 2367.3, txt: "russets", q: "10 lb bag" }, { t: 2369.9, txt: "ground beef", q: "1 lb · split in 4" }, { t: 2373.0, txt: "breakfast sausage", q: "1 roll · split in 4" },
  { t: 2376.5, txt: "rotisserie chicken" }, { t: 2378.4, txt: "ham steak" }, { t: 2379.7, txt: "frozen broccoli", q: "1 bag" },
  { t: 2381.7, txt: "sharp cheddar", q: "a block — shred it" }, { t: 2387.5, txt: "sour cream", q: "small tub" }, { t: 2389.9, txt: "green onions", q: "1 bunch" },
  { t: 2391.5, txt: "kidney beans", q: "1 can" }, { t: 2393.2, txt: "tomato sauce", q: "1 can" }, { t: 2395.3, txt: "taco seasoning", q: "1 packet" }, { t: 2397.1, txt: "barbecue sauce", q: "1 bottle" },
];
export const ShoppingList: React.FC<{ s: any; part: number }> = ({ s, part }) => {
  const t = useT(), d = s.dur / FPS, now = s.from / FPS + t;
  const GAP = 96, TOP = 250, PW = 1180;
  const cam = [
    { z0: 0.70, z1: 0.74, y0: 70, y1: 40, r0: -1.5, r1: -0.8, x: 0 },
    { z0: 1.02, z1: 1.06, y0: 540 - (TOP + GAP * 7.5) * 1.02, y1: 540 - (TOP + GAP * 7.9) * 1.06, r0: 1.6, r1: 1.0, x: 60 },
    { z0: 0.90, z1: 0.93, y0: 560 - (TOP + GAP * 10.6) * 0.90, y1: 560 - (TOP + GAP * 11.0) * 0.93, r0: -2.2, r1: -1.4, x: -40 },
  ][part];
  const k = eIO(t, 0, d), z = lerp(cam.z0, cam.z1, k), y = lerp(cam.y0, cam.y1, k), r = lerp(cam.r0, cam.r1, k);
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Wood t={now} />
    <div style={{ position: "absolute", left: 960 - PW / 2 + cam.x, top: 0, width: PW, transformOrigin: "50% 0%", transform: `translateY(${y}px) scale(${z}) rotate(${r}deg)` }}>
      <IndexCard w={PW} h={TOP + GAP * 13 + 120} lineGap={GAP} top={TOP - 30}>
        <div style={{ position: "absolute", left: 90, top: 70, fontFamily: HAND, fontWeight: 700, fontSize: 92, color: K.red, transform: "rotate(-1.5deg)" }}>Groceries — my potato week</div>
        {SHOP.map((it, i) => {
          const w = eOut(now, it.t, it.t + 0.7);
          if (w <= 0) return null;
          const yy = TOP + GAP * i + GAP * 0.08 - 30;
          return <div key={i} style={{ position: "absolute", left: 110, top: yy, height: GAP, display: "flex", alignItems: "flex-end", gap: 26, clipPath: `inset(0 ${100 - 100 * w}% 0 0)`, transform: `rotate(${(rnd(i) - 0.5) * 1.2}deg)` }}>
            <span style={{ width: 40, height: 40, marginBottom: 24, border: `4px solid ${K.ink}`, borderRadius: 4, transform: `rotate(${(rnd(i + 9) - 0.5) * 8}deg)`, opacity: 0.8 }} />
            <span style={{ fontFamily: HAND, fontWeight: 700, fontSize: 70, lineHeight: `${GAP}px`, color: K.ink }}>{it.txt}</span>
            {it.q && <span style={{ fontFamily: HAND, fontWeight: 600, fontSize: 50, lineHeight: `${GAP}px`, color: K.pencil, opacity: 0.85 }}>{it.q}</span>}
          </div>;
        })}
      </IndexCard>
    </div>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 95% 85% at 50% 50%, transparent 60%, rgba(40,20,6,.35))" }} />
  </AbsoluteFill>;
};
