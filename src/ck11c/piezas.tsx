// ck11c · piezas (look 242 cookbook de iglesia). Mecanismos propios, distintos del registro lor11:
// receta escrita a MÁQUINA en la página del recetario (las letras caen con el golpe de tecla y el carro corre; al final cae el sello);
// carrusel = tablero de corcho del salón donde se pinchan las 10 fichas con foto; apertura de capítulo = renglón de la planilla
// de anotación del potluck en tabla con clip (se anota el plato y se tilda); barra = fila de 10 tarjetitas plegadas de mesa «dish N of 10»;
// recap = el mismo tablero de corcho: la ficha del plato se pincha y el contador de fuentes crece; fotos viejas pinchadas en el corcho con
// chinche; mapa a tinta marrón en el reverso del boletín de la iglesia con la ruta punteada; dato = tabla del Crowd Chart a máquina con su
// fuente (página real del libro); libro real + QR en la etiqueta de cartón atada a la tapa de una fuente.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, useCurrentFrame } from "remotion";
import { K, TYPE, SERIF, HAND, cl, lerp, eOut, eIO, spr, rnd, hash, sf, drift, Cork, Hall, BlurBg, Pin, Stamp, Page } from "./look";

const FPS = 30;
const useT = () => useCurrentFrame() / FPS;
const PINS = [K.pin, K.pin2, K.pin3];

// ---------- avatar (MEJORA 4: encuadres) ----------
export const Avatar: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS;
  const vid = (style: React.CSSProperties) => <OffthreadVideo src={sf(s.src)} startFrom={s.off} muted style={{ width: "100%", height: "100%", objectFit: "cover", ...style }} />;
  if (s.frame === "punch") return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{vid({ transform: `scale(${1.18 + 0.02 * cl(t / d)})`, transformOrigin: "46% 30%" })}</AbsoluteFill>;
  if (s.frame === "hands") return <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>{vid({ transform: `scale(${1.12 + 0.03 * cl(t / d)})`, transformOrigin: "46% 78%" })}</AbsoluteFill>;
  if (s.frame === "side" && s.side) {
    // el avatar se corre a la izquierda y la foto siguiente queda pinchada en el corcho a la derecha
    const k = eOut(t, 0.2, 0.9), pk = spr(t, 0.75, 9, 0.5);
    return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${-300 * k}px)` }}>{vid({})}</AbsoluteFill>
      <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 760, transform: `translateX(${(1 - k) * 800}px)`, overflow: "hidden", boxShadow: "-20px 0 40px rgba(0,0,0,.4)" }}>
        <div style={{ position: "absolute", left: -1160, top: 0, width: 1920, height: 1080 }}><Cork t={t} /></div>
        <div style={{ position: "absolute", left: 70, top: 200, width: 620, height: 600, padding: 16, background: "#fbf8f0", boxShadow: "0 16px 30px rgba(0,0,0,.4)", transform: `rotate(-2deg) translateY(${(1 - k) * 60}px)` }}>
          <Img src={sf(s.side)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.03 + 0.04 * cl(t / d)})` }} />
        </div>
        <Pin x={380} y={214} k={pk} />
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

// ---------- MEJORA 8: foto vieja pinchada en el corcho del salón (cae, la chinche la clava) y la cámara entra hasta llenar el cuadro ----------
export const OldPhoto: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS, sd = hash(s.uid);
  const fall = spr(t, 0.05, 7, 0.55), pk = spr(t, 0.75, 10, 0.5), cam = eIO(t, 1.2, d);
  const W = 1000, H = 720, rot = lerp(-4, 4, rnd(sd));
  const dr = drift(t, sd % 7, 0.6);
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Cork t={t} />
    <AbsoluteFill style={{ transform: `translate(${dr.x}px, ${dr.y}px) scale(${lerp(0.95, 1.55, cam)})`, transformOrigin: "50% 52%" }}>
      <div style={{ position: "absolute", left: 960 - W / 2, top: 540 - H / 2, width: W, height: H, padding: "22px 22px 70px", background: "#f7f1e2", boxShadow: `0 ${lerp(60, 18, fall)}px ${lerp(80, 30, fall)}px rgba(0,0,0,.45)`,
        transform: `translateY(${(1 - fall) * -120}px) scale(${lerp(1.12, 1, fall)}) rotate(${rot}deg)` }}>
        <Img src={sf(s.src)} style={{ width: W - 44, height: H - 92, objectFit: "cover", filter: "sepia(.1)" }} />
        {s.year && <div style={{ position: "absolute", left: 30, bottom: 16, fontFamily: HAND, fontSize: 38, color: K.ink }}>{s.year}</div>}
        <Pin x={W / 2} y={18} k={pk} c={PINS[sd % 3]} />
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- C card: la receta se escribe a máquina en la página del recetario, tecla por tecla; al final cae el sello ----------
export const TypedCard: React.FC<{ s: any; c: any; pageNo?: string }> = ({ s, c, pageNo }) => {
  const t = useT(), d = s.dur / FPS, sd = hash(s.uid);
  if (!c) return <Hall t={t} />;
  const land = spr(t, 0.05, 6, 0.7), cam = eIO(t, 0.6, d);
  const dr = drift(t, sd % 9, 0.5);
  const W = 1500, H = 1000;
  // sin cortar nada: cada renglón largo se parte en palabras (≤58 letras); los pasos llevan su número y la sangría en la 2ª línea
  const wrap = (x: string, first: string, rest: string) => { const out: string[] = []; let cur = first;
    for (const w of x.split(" ")) { if ((cur + w).length > 58 && cur.trim().length > first.trim().length) { out.push(cur.trimEnd()); cur = rest; } cur += w + " "; }
    out.push(cur.trimEnd()); return out; };
  const ing: string[] = (c.ingredients || []).flatMap((x: string) => wrap(x, "", "   "));
  const st: string[] = (c.steps || []).flatMap((x: string, i: number) => wrap(x, `${i + 1}. `, "   "));
  const lines = [c.title, ...ing, ...st];
  const total = lines.reduce((a, l) => a + l.length, 0);
  const avail = Math.max(2.5, d - 2.6);
  const cps = Math.max(28, total / avail);
  let acc = 0;
  const starts = lines.map((l) => { const a = acc; acc += l.length; return a; });
  const typed = (t - 0.8) * cps;
  const typedLine = (i: number) => Math.max(0, Math.min(lines[i].length, Math.floor(typed - starts[i])));
  const cur = starts.findIndex((a, i) => typed >= a && typed < a + lines[i].length);
  const done = typed >= total;
  const stampK = done ? cl((t - (0.8 + total / cps) - 0.2) / 0.18) : 0;
  const LI = 46, LS = 44, Y0 = 250, YS = Y0 + ing.length * LI + 34;
  const curY = cur < 0 ? 0 : cur === 0 ? 90 : cur <= ing.length ? Y0 + (cur - 1) * LI : YS + (cur - ing.length - 1) * LS;
  // la cámara sigue el renglón que se está escribiendo (lectura de arriba abajo)
  const follow = cl((curY - 280) / 520);
  const ty = (s0: string, n: number) => s0.slice(0, n);
  const caret = (i: number) => i === cur && !done ? <span style={{ display: "inline-block", width: 3, height: 34, background: K.ink, marginLeft: 2, opacity: Math.floor(t * 4) % 2 ? 1 : 0.2, verticalAlign: "middle" }} /> : null;
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Hall t={t} />
    <AbsoluteFill style={{ transform: `translate(${dr.x}px, ${dr.y + lerp(0, -260, follow * cam)}px) scale(${lerp(0.94, 1.12, cam)})`, transformOrigin: "45% 35%" }}>
      <div style={{ position: "absolute", left: 960 - W / 2, top: 50, transform: `translateY(${(1 - land) * 1200}px) rotate(${lerp(3, -0.6, land)}deg)` }}>
        <Page w={W} h={H + 260} folio={pageNo}>
          <div style={{ position: "absolute", left: 90, right: 90, top: 80, fontFamily: TYPE, fontSize: 50, lineHeight: "60px", color: K.ink, textTransform: "uppercase", letterSpacing: 1 }}>{ty(lines[0], typedLine(0))}{caret(0)}</div>
          <div style={{ position: "absolute", left: 92, top: 200, fontFamily: SERIF, fontStyle: "italic", fontSize: 30, color: K.ink2, opacity: cl((t - 0.8 - lines[0].length / cps) / 0.3) }}>{[c.serves && `Serves ${String(c.serves).toLowerCase()}`, c.time, c.cost].filter(Boolean).join("   ·   ")}</div>
          {ing.map((x, i) => (
            <div key={i} style={{ position: "absolute", left: 92, top: Y0 + i * LI, fontFamily: TYPE, fontSize: 33, lineHeight: `${LI}px`, color: K.ink, whiteSpace: "pre" }}>{ty(x, typedLine(i + 1))}{caret(i + 1)}</div>
          ))}
          {st.map((x, i) => (
            <div key={"s" + i} style={{ position: "absolute", left: 92, top: YS + i * LS, fontFamily: TYPE, fontSize: 31, lineHeight: `${LS}px`, color: K.ink2, whiteSpace: "pre" }}>{ty(x, typedLine(1 + ing.length + i))}{caret(1 + ing.length + i)}</div>
          ))}
          {c.tip && <div style={{ position: "absolute", left: 92, right: 520, top: YS + st.length * LS + 20, fontFamily: HAND, fontSize: 40, color: K.stamp, opacity: stampK, transform: "rotate(-1deg)" }}>— {c.tip}</div>}
          <Stamp k={stampK} x={W - 470} y={YS + st.length * LS - 10} />
        </Page>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- MEJORA 1: las recetas del título se pinchan una por una en el corcho del salón (ficha con foto) y la cámara recorre el tablero ----------
export const CorkBoard: React.FC<{ s: any; items: any[]; title: string }> = ({ s, items, title }) => {
  const t = useT(), d = s.dur / FPS;
  const n = items.length, cols = 5, CW = 330, CH = 380, GX = 30, GY = 40;
  const per = Math.min(0.9, Math.max(0.45, (d - 2.2) / n));
  const cam = eIO(t, 0.3, d - 0.3);
  const rowY = (i: number) => 170 + Math.floor(i / cols) * (CH + GY);
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Cork t={t} />
    <AbsoluteFill style={{ transform: `scale(${lerp(1.0, 1.06, cam)})`, transformOrigin: "50% 50%" }}>
      <div style={{ position: "absolute", left: 120, top: 46, padding: "10px 26px", background: K.cream, boxShadow: "0 8px 16px rgba(0,0,0,.35)", transform: "rotate(-1deg)", fontFamily: TYPE, fontSize: 44, color: K.ink, opacity: cl((t - 0.1) / 0.3) }}>{title}</div>
      <Pin x={140} y={58} k={spr(t, 0.3, 10, 0.5)} c={K.pin2} />
      {items.map((it, i) => {
        const a = 0.6 + i * per, k = spr(t, a, 8, 0.6), pk = spr(t, a + 0.25, 10, 0.5);
        const x = 90 + (i % cols) * (CW + GX) + (rnd(i + 3) - 0.5) * 20, y = rowY(i) + (rnd(i + 7) - 0.5) * 16, rot = (rnd(i + 11) - 0.5) * 6;
        if (t < a) return null;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: CW, height: CH, background: K.cream, padding: 12, boxShadow: `0 ${lerp(40, 12, k)}px ${lerp(50, 20, k)}px rgba(0,0,0,.4)`,
          transform: `translateY(${(1 - k) * -80}px) scale(${lerp(1.15, 1, k)}) rotate(${rot}deg)`, opacity: cl(k * 2) }}>
          <div style={{ width: CW - 24, height: 230, overflow: "hidden", background: "#ddd" }}>{it.img && <Img src={sf(it.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}</div>
          <div style={{ marginTop: 12, fontFamily: TYPE, fontSize: 26, lineHeight: "30px", color: K.ink, height: 92, overflow: "hidden" }}><span style={{ color: K.stamp }}>{i + 1}.</span> {it.name}</div>
          <Pin x={CW / 2} y={8} k={pk} c={PINS[i % 3]} />
        </div>;
      })}
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- MEJORA 3 + 5: apertura de cada plato = un renglón de la planilla del potluck en la tabla con clip; se anota el plato y se tilda ----------
export const SignUp: React.FC<{ s: any; of: number; names: string[] }> = ({ s, of, names }) => {
  const t = useT(), d = s.dur / FPS;
  const n = s.n as number;
  const land = spr(t, 0.05, 6, 0.7), cam = eIO(t, 0.3, d);
  const W = 1180, H = 1000, R0 = 250, RH = 66;
  const write = cl((t - 0.7) / 0.9), tick = cl((t - 1.7) / 0.25);
  const rowY = R0 + (n - 1) * RH;
  const fy = cl((rowY - 400) / 400);
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <BlurBg src={s.bg} t={t} dim={0.35} />
    <AbsoluteFill style={{ transform: `translateY(${lerp(0, -220 * fy, cam)}px) scale(${lerp(1, 1.12, cam)})`, transformOrigin: `50% ${(rowY + 40) / 10.8}%` }}>
      <div style={{ position: "absolute", left: 960 - W / 2, top: 40, width: W, height: H + 120, transform: `translateY(${(1 - land) * 1200}px) rotate(${lerp(-4, -1, land)}deg)` }}>
        {/* tabla de madera prensada con clip metálico */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(170deg,#a07a4f,#8a6640)", borderRadius: 26, boxShadow: "0 30px 60px rgba(0,0,0,.5)" }} />
        <div style={{ position: "absolute", left: 40, top: 70, right: 40, bottom: 40, background: "#fbf9f2", boxShadow: "0 4px 8px rgba(0,0,0,.25)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: TYPE, fontSize: 46, color: K.ink }}>POTLUCK SIGN-UP</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 112, textAlign: "center", fontFamily: SERIF, fontStyle: "italic", fontSize: 28, color: K.ink2 }}>Fellowship Hall · please write what you are bringing</div>
          {Array.from({ length: of }, (_, i) => {
            const me = i + 1 === n, past = i + 1 < n;
            return <div key={i} style={{ position: "absolute", left: 50, right: 50, top: R0 - 70 + i * RH, height: RH, borderBottom: "2px solid rgba(90,58,34,.3)" }}>
              <div style={{ position: "absolute", left: 0, width: 50, fontFamily: TYPE, fontSize: 30, lineHeight: `${RH}px`, color: K.ink2 }}>{i + 1}.</div>
              {(past || me) && <div style={{ position: "absolute", left: 60, fontFamily: HAND, fontSize: 44, lineHeight: `${RH}px`, color: "#24407a", whiteSpace: "nowrap", clipPath: me ? `inset(0 ${100 - 100 * write}% 0 0)` : "none" }}>{names[i]}</div>}
              {(past || me) && <div style={{ position: "absolute", right: 10, fontFamily: HAND, fontSize: 40, lineHeight: `${RH}px`, color: "#24407a", opacity: me ? cl((t - 1.4) / 0.3) : 1 }}>Loretta</div>}
              {(past || (me && tick > 0)) && <div style={{ position: "absolute", right: 150, top: 10, width: 44, height: 44, border: "3px solid rgba(90,58,34,.6)", fontFamily: HAND, fontSize: 52, lineHeight: "40px", color: K.stamp, textAlign: "center", transform: me ? `scale(${lerp(1.6, 1, tick)})` : "none" }}>✓</div>}
              {me && <div style={{ position: "absolute", left: -10, right: -10, top: 4, bottom: 4, background: `rgba(255,226,120,${0.28 * write})` }} />}
            </div>;
          })}
        </div>
        <div style={{ position: "absolute", left: W / 2 - 150, top: 20, width: 300, height: 90, borderRadius: 14, background: `linear-gradient(180deg,#e3e5e8,${K.clip} 55%,#8d9196)`, boxShadow: "0 8px 14px rgba(0,0,0,.35)" }} />
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- MEJORA 2: fila de tarjetitas plegadas de mesa «dish N of 10» (se esconde con el avatar) ----------
export const TentCards: React.FC<{ n: number; of: number; name: string; o: number }> = ({ n, of, name, o }) => (
  <div style={{ position: "absolute", left: 44, bottom: 36, opacity: o, transform: `translateY(${(1 - o) * 30}px)` }}>
    <div style={{ display: "inline-block", background: K.cream, padding: "8px 18px 8px", boxShadow: "0 10px 26px rgba(0,0,0,.35)", borderTop: `5px solid ${K.ink}` }}>
      <div style={{ fontFamily: TYPE, fontSize: 30, color: K.ink, whiteSpace: "nowrap" }}>Dish {n} of {of} · {name}</div>
      <div style={{ display: "flex", gap: 7, marginTop: 8, alignItems: "flex-end" }}>
        {Array.from({ length: of }, (_, i) => <div key={i} style={{ width: 30, height: i + 1 === n ? 30 : 20, background: i < n ? (i + 1 === n ? "#f2d27a" : K.cream2) : "transparent", border: `2px solid ${i < n ? K.ink2 : "rgba(90,58,34,.3)"}`,
          clipPath: "polygon(10% 0, 90% 0, 100% 100%, 0 100%)", fontFamily: TYPE, fontSize: 15, color: K.ink, textAlign: "center", lineHeight: i + 1 === n ? "30px" : "20px" }}>{i + 1 === n ? n : ""}</div>)}
      </div>
    </div>
  </div>
);

// ---------- recap (MEJORA 10): el plato vuelve al corcho; la ficha se pincha junto a las anteriores y el contador «pans on the table» sube ----------
export const RecapBoard: React.FC<{ s: any; rows: any[]; n: number; of: number }> = ({ s, rows, n, of }) => {
  const t = useT(), d = s.dur / FPS;
  const cols = 4, CW = 380, CH = 300;
  const cur = rows[n - 1] || {};
  const cam = eIO(t, 0, d);
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Cork t={t} />
    <AbsoluteFill style={{ transform: `scale(${lerp(1.02, 1.0, cam)})` }}>
      <div style={{ position: "absolute", left: 100, top: 50, fontFamily: TYPE, fontSize: 40, color: "#fbf3df", textShadow: "0 3px 8px rgba(0,0,0,.6)" }}>What to bring · the whole list</div>
      <div style={{ position: "absolute", right: 110, top: 40, padding: "8px 22px", background: K.cream, fontFamily: TYPE, fontSize: 34, color: K.stamp, boxShadow: "0 8px 16px rgba(0,0,0,.35)", transform: "rotate(1.5deg)" }}>{n} of {of}</div>
      {rows.slice(0, n).map((r, i) => {
        const me = i === n - 1, k = me ? spr(t, 0.2, 8, 0.6) : 1, pk = me ? spr(t, 0.5, 10, 0.5) : 1;
        const slot = i % 12;
        const x = 100 + (slot % cols) * (CW + 30) + (rnd(i + 5) - 0.5) * 16, y = 150 + Math.floor(slot / cols) * (CH + 24) + (rnd(i + 9) - 0.5) * 12;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: CW, height: CH, background: K.cream, padding: 10, boxShadow: `0 ${lerp(40, 10, k)}px ${lerp(50, 18, k)}px rgba(0,0,0,.4)`,
          transform: `translateY(${(1 - k) * -70}px) scale(${lerp(1.2, 1, k)}) rotate(${(rnd(i + 2) - 0.5) * 5}deg)`, opacity: cl(k * 2), outline: me ? `4px solid rgba(242,210,122,${cl(t / 0.5)})` : "none" }}>
          <div style={{ width: CW - 20, height: 200, overflow: "hidden", background: "#ddd" }}>{r.img && <Img src={sf(r.img)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}</div>
          <div style={{ marginTop: 10, fontFamily: TYPE, fontSize: 24, lineHeight: "28px", color: K.ink, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</div>
          {r.note && <div style={{ fontFamily: HAND, fontSize: 26, color: K.stamp, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.note}</div>}
          <Pin x={CW / 2} y={8} k={pk} c={PINS[i % 3]} />
        </div>;
      })}
      {cur.tip && <div style={{ position: "absolute", left: 100, right: 100, bottom: 40, fontFamily: HAND, fontSize: 40, color: "#fbf3df", textShadow: "0 3px 8px rgba(0,0,0,.7)", opacity: cl((t - 0.9) / 0.4), whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cur.tip}</div>}
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- libro real (tapa → página) + QR en la etiqueta de cartón atada al asa de una fuente tapada con papel aluminio ----------
export const DishTag: React.FC<{ k: number; x: number; y: number; slug: string }> = ({ k, x, y, slug }) => {
  const sw = Math.sin(k * 7) * (1 - k) * 10;
  return <div style={{ position: "absolute", left: x, top: y, transform: `translateX(${(1 - k) * 900}px)` }}>
    {/* fuente tapada con papel aluminio (vista de arriba) */}
    <div style={{ position: "absolute", left: -60, top: 420, width: 700, height: 360, borderRadius: 26, background: "linear-gradient(135deg,#d9dcdf,#aeb3b8 40%,#e6e8ea 55%,#9da2a7)", boxShadow: "0 24px 40px rgba(0,0,0,.4)" }} />
    <div style={{ position: "absolute", left: 250, top: 400, width: 90, height: 40, borderRadius: 20, border: "8px solid #6b6f73" }} />
    <div style={{ position: "absolute", left: 292, top: 330, width: 3, height: 90, background: "#c9b48a" }} />
    <div style={{ position: "absolute", left: 40, top: -20, width: 500, height: 380, background: "#d8c08e", borderRadius: 8, boxShadow: "0 16px 30px rgba(0,0,0,.35)", transform: `rotate(${-3 + sw}deg)`, transformOrigin: "50% 100%", padding: "22px 28px" }}>
      <div style={{ position: "absolute", left: 238, top: 10, width: 24, height: 24, borderRadius: 12, background: "#8a6a45", border: "4px solid #f0e2c0" }} />
      <div style={{ display: "flex", gap: 22, marginTop: 30 }}>
        <div style={{ background: "#fff", padding: 8 }}><Img src={sf(`${slug}/qr.png`)} style={{ width: 250, height: 250, display: "block" }} /></div>
        <div style={{ fontFamily: HAND, fontSize: 38, lineHeight: "44px", color: K.ink, paddingTop: 20 }}>Loretta's<br />Church Supper<br />Cookbook<div style={{ fontFamily: TYPE, fontSize: 22, color: K.stamp, marginTop: 14 }}>link in the<br />description</div></div>
      </div>
    </div>
  </div>;
};
export const Book: React.FC<{ s: any; slug: string }> = ({ s, slug }) => {
  const t = useT(), d = s.dur / FPS, sd = hash(s.uid);
  const p = s.page as string;
  const dr = drift(t, sd % 5, 0.5);
  const land = spr(t, 0.05, 6, 0.65), open = p === "close" ? 0 : eIO(t, 1.3, 2.5), cam = eIO(t, 2.5, d);
  const qrK = s.qr ? spr(t, s.qrAt ?? 3.4, 5, 0.6) : 0;
  const BW = 640, BH = 828, bx = s.qr ? 250 : 960 - BW / 2;
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Hall t={t} />
    <AbsoluteFill style={{ transform: `translate(${dr.x}px, ${dr.y}px) scale(${lerp(1, s.qr ? 1.02 : 1.18, cam)})`, transformOrigin: "50% 45%", perspective: 3000 }}>
      <div style={{ position: "absolute", left: bx, top: 540 - BH / 2, width: BW, height: BH, transform: `translateY(${(1 - land) * 900}px) rotate(${lerp(-6, -1.2, land)}deg)` }}>
        {p !== "close" && <Img src={sf(`${slug}/libro/p${p}.png`)} style={{ position: "absolute", inset: 0, width: BW, height: BH, objectFit: "fill", boxShadow: "0 30px 60px rgba(20,10,0,.5)" }} />}
        <div style={{ position: "absolute", inset: 0, transformOrigin: "0% 50%", transform: `rotateY(${-170 * open}deg)`, backfaceVisibility: "hidden", boxShadow: "14px 26px 50px rgba(20,10,0,.55), 5px 0 0 #efe9da, 9px 0 0 #e1d9c6" }}>
          <Img src={sf(`${slug}/libro/cover.png`)} style={{ width: BW, height: BH, objectFit: "cover", borderRadius: 3 }} />
        </div>
      </div>
      {s.qr && <DishTag k={qrK} x={1060} y={200} slug={slug} />}
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- MEJORA 7: mapa a tinta marrón en el reverso del boletín dominical (casa → iglesia), la fuente viaja por la ruta punteada ----------
const IA = "M60,40 L700,40 L720,90 L760,150 L740,230 L700,300 L690,360 L80,360 L70,290 L40,200 L50,110 Z";
export const MapBulletin: React.FC<{ s: any }> = ({ s }) => {
  const t = useT(), d = s.dur / FPS;
  const slide = eOut(t, 0.05, 0.8), draw = eIO(t, 0.5, 2.0), go = eIO(t, 2.2, Math.min(d - 0.4, 4.6)), cam = eIO(t, 0, d);
  const P0 = [330, 300], P1 = [470, 250], P2 = [560, 170];
  const bx = (k: number) => k < 0.5 ? lerp(P0[0], P1[0], k * 2) : lerp(P1[0], P2[0], k * 2 - 1);
  const by = (k: number) => k < 0.5 ? lerp(P0[1], P1[1], k * 2) : lerp(P1[1], P2[1], k * 2 - 1);
  return <AbsoluteFill style={{ overflow: "hidden" }}>
    <Hall t={t} />
    <AbsoluteFill style={{ transform: `scale(${lerp(1, 1.14, cam)})`, transformOrigin: "58% 50%" }}>
      <div style={{ position: "absolute", left: 960 - 720, top: 540 - 470, transform: `translateY(${(1 - slide) * 1200}px) rotate(1deg)` }}>
        <Page w={1440} h={940}>
          <div style={{ position: "absolute", left: 90, top: 70, fontFamily: TYPE, fontSize: 36, color: K.ink2, letterSpacing: 3 }}>SUNDAY BULLETIN · back page</div>
          <div style={{ position: "absolute", left: 90, top: 120, fontFamily: SERIF, fontWeight: 700, fontSize: 52, color: K.ink }}>From our kitchen to the church basement</div>
          <svg width={1440} height={940} style={{ position: "absolute", left: 0, top: 0 }}>
            <g transform="translate(240,300)">
              <path d={IA} fill="rgba(122,82,54,.08)" stroke={K.ink} strokeWidth={5} strokeLinejoin="round" strokeDasharray={2600} strokeDashoffset={2600 * (1 - draw)} />
              <path d={`M${P0[0]},${P0[1]} L${P1[0]},${P1[1]} L${P2[0]},${P2[1]}`} fill="none" stroke={K.stamp} strokeWidth={6} strokeDasharray="14 12" opacity={cl((t - 2.0) / 0.3)} />
              <circle cx={P0[0]} cy={P0[1]} r={12} fill={K.ink} opacity={cl((t - 2.0) / 0.3)} />
              <path d={`M${P2[0] - 10},${P2[1] - 40} L${P2[0]},${P2[1] - 64} L${P2[0] + 10},${P2[1] - 40} M${P2[0]},${P2[1] - 64} L${P2[0]},${P2[1] - 80} M${P2[0] - 8},${P2[1] - 72} L${P2[0] + 8},${P2[1] - 72}`} stroke={K.ink} strokeWidth={4} fill="none" opacity={cl((t - 2.0) / 0.3)} />
              <rect x={bx(go) - 22} y={by(go) - 13} width={44} height={26} rx={6} fill="#c9cdd1" stroke={K.ink} strokeWidth={3} opacity={cl((t - 2.2) / 0.2)} />
            </g>
          </svg>
          <div style={{ position: "absolute", left: 500, top: 520, fontFamily: HAND, fontSize: 70, color: K.ink, opacity: cl((t - 1.3) / 0.3) }}>Iowa</div>
          <div style={{ position: "absolute", left: 470, top: 640, fontFamily: HAND, fontSize: 40, color: K.ink2, opacity: cl((t - 2.1) / 0.3) }}>home</div>
          <div style={{ position: "absolute", left: 840, top: 360, fontFamily: HAND, fontSize: 46, color: K.stamp, opacity: cl((t - 2.6) / 0.3) }}>our Methodist church</div>
        </Page>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};

// ---------- MEJORA 9: dato = tabla del Crowd Chart escrita a máquina en una tira de papel del recetario, con su fuente (página real) ----------
export const CrowdChart: React.FC<{ o: any }> = ({ o }) => {
  const t = useCurrentFrame() / FPS, D = o.dur / FPS;
  const k = spr(t, 0.05, 7, 0.6), out = eIO(t, D - 0.4, D);
  return <div style={{ position: "absolute", right: 80, top: 90, width: 700, transform: `translateX(${(1 - k) * 900 + out * 900}px) rotate(1deg)` }}>
    <div style={{ background: K.cream, padding: "24px 32px 20px", boxShadow: "0 20px 40px rgba(0,0,0,.45)", borderTop: `6px solid ${K.ink}` }}>
      <div style={{ fontFamily: TYPE, fontSize: 30, letterSpacing: 3, color: K.ink, marginBottom: 10 }}>{o.head}</div>
      {o.rows.map((r: string[], i: number) => {
        const a = o.at ? o.at[i] : 0.35 + i * 0.5;
        return <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(90,58,34,.3)", fontFamily: TYPE, fontSize: 34, lineHeight: "54px", color: i === o.hi ? K.stamp : K.ink, opacity: cl((t - a) / 0.2),
          background: i === o.hi ? `rgba(242,210,122,${0.35 * cl((t - a) / 0.3)})` : "transparent" }}>
          {r.map((c, j) => <span key={j} style={{ width: j === 0 ? "44%" : "28%", textAlign: j === 0 ? "left" : "right" }}>{c}</span>)}
        </div>;
      })}
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 22, color: K.ink2, marginTop: 10, opacity: cl((t - 0.5) / 0.3) }}>{o.src}</div>
    </div>
  </div>;
};
