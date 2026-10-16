// ── HÉROES de La Cocina de Doña Chayo · chayo1 (caldo de res, 15-oct-2026) ──
// Mundo del rancho: cartas de lotería, etiqueta de precio en papel kraft, pizarra de mercado, cuenta en papel de estraza,
// recetario de la abuela en papel amarillento, postal de Pátzcuaro. Fotos reales en capas, cámara por claves,
// cada golpe en SU palabra (t = segundo absoluto de words.json). Familias: Fraunces (serif) + Caveat (mano).
import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { Bed, Mark, camAt, camStyle, sp, useT, ez, cl, img, SERIF, HAND, P } from "../lkit/core";

const GUINDA = "#7A1F2B", BARRO = "#B5562A", MAIZ = "#E9B23A", NOPAL = "#3E6A36", CREMA = "#F4E8CF", TINTA = "#2A211B", CHILE = "#B3261E";
// foto con paspartú, quieta (sin el brillo que barre del Print del kit: cero efectos)
const Foto: React.FC<{ k: string; w: number; h: number; f: number; mat?: number }> = ({ k, w, h, f, mat = 16 }) => (
  <div style={{ background: "#FFFDF8", padding: `${mat}px ${mat}px ${mat * 1.25}px`, borderRadius: 3, boxShadow: "0 40px 80px rgba(20,10,4,0.5), 0 6px 14px rgba(0,0,0,0.25)" }}>
    <div style={{ width: w, height: h, overflow: "hidden" }}><Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.03 * Math.sin(f / 50)})` }} /></div>
  </div>
);
const sombra = "0 30px 60px rgba(20,10,4,0.55), 0 6px 14px rgba(0,0,0,0.3)";
const txtSh = "0 4px 18px rgba(0,0,0,0.7)";
type Beat = { t: number; txt: string };

// papel kraft con textura de fibras (gradientes, sin imagen)
const kraft = { background: "radial-gradient(ellipse at 30% 20%, #D9B98A 0%, #C9A473 55%, #B98F5E 100%)" } as React.CSSProperties;
const papelViejo = { background: "radial-gradient(ellipse at 40% 30%, #F2E3B8 0%, #E6D19C 60%, #D4B97C 100%)" } as React.CSSProperties;

// ── carta de lotería: marco de color, número, foto real, nombre ──
const Carta: React.FC<{ k: string; n: number; name: string; f: number; w?: number; color?: string }> = ({ k, n, name, f, w = 300, color = GUINDA }) => {
  const h = w * 1.48;
  return (
    <div style={{ width: w, height: h, background: CREMA, borderRadius: 10, boxShadow: sombra, padding: w * 0.05, boxSizing: "border-box", position: "relative" }}>
      <div style={{ position: "absolute", inset: w * 0.03, border: `${w * 0.018}px solid ${color}`, borderRadius: 6 }} />
      <div style={{ position: "absolute", left: w * 0.08, top: w * 0.05, fontFamily: SERIF, fontWeight: 900, fontSize: w * 0.17, color }}>{n}</div>
      <div style={{ position: "absolute", left: w * 0.1, right: w * 0.1, top: w * 0.25, height: h * 0.58, overflow: "hidden", borderRadius: 3, boxShadow: "inset 0 0 0 2px rgba(0,0,0,0.25)" }}>
        <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.06 + 0.03 * Math.sin(f / 45)})` }} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: h * 0.035, textAlign: "center", fontFamily: SERIF, fontWeight: 800, fontSize: Math.min(w * 0.115, (w * 1.6) / Math.max(6, name.length)), color: TINTA, letterSpacing: 1, textTransform: "uppercase" }}>{name}</div>
    </div>
  );
};

// 1 · LOTERÍA DE LOS 7 SECRETOS: las cartas se reparten sobre la mesa, cada una en SU palabra
export const Loteria: P<{ bed: string; head: Beat; cards: { k: string; name: string; t: number }[] }> = ({ a, d, bed, head, cards }) => {
  const { f, at } = useT(a);
  const pos = (i: number) => (i < 4 ? { x: 330 + i * 420, y: 420, r: [-5, 3, -2, 4][i] } : { x: 540 + (i - 4) * 420, y: 830, r: [3, -4, 2][i - 4] });
  const cur = Math.max(0, cards.reduce((m, c, i) => (f >= at(c.t) ? i : m), -1));
  const cam = camAt(f, at, [{ t: a, s: 1.0, x: 960, y: 600 }, ...cards.map((c, i) => ({ t: c.t, s: 1.04, x: 960 + (pos(i).x - 960) * 0.1, y: 600 + (pos(i).y - 600) * 0.08 }))], 1.1);
  const hu = sp(f, at(head.t), 14, 120);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.6} blur={10} />
      <AbsoluteFill style={camStyle(cam)}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
          {cards.map((c, i) => {
            if (f < at(c.t)) return null;
            const u = sp(f, at(c.t), 12, 130), p = pos(i);
            return (
              <div key={i} style={{ position: "absolute", left: p.x, top: p.y, translate: "-50% -50%", opacity: cl(u * 1.6),
                transform: `translate(${(1 - u) * 500}px, ${(1 - u) * -300}px) rotate(${p.r + (1 - u) * 25}deg) scale(${i === cur ? 1.06 : 0.97})` }}>
                <Carta k={c.k} n={i + 1} name={c.name} f={f} w={250} color={[GUINDA, BARRO, NOPAL, CHILE, MAIZ, GUINDA, NOPAL][i % 7]} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: 40, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 92, color: CREMA, textShadow: txtSh,
        opacity: cl(hu * 1.5), transform: `translateY(${(1 - hu) * -30}px)` }}>{head.txt}</div>
    </AbsoluteFill>
  );
};

// 2 · CARTA DEL SECRETO (apertura de cada secreto): la carta gira y entra; a la derecha el nombre a mano
export const CartaSecreto: P<{ bed: string; k: string; n: number; name: string; sub: string }> = ({ a, d, bed, k, n, name, sub }) => {
  const { f } = useT(a);
  const u = sp(f, 4, 12, 110), u2 = sp(f, 16, 14, 120), u3 = sp(f, 26, 14, 120);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.55} blur={12} z={[1.1, 1.18]} />
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(20,10,5,0.15) 0%, rgba(20,10,5,0.55) 60%, rgba(20,10,5,0.7) 100%)" }} />
      <div style={{ position: "absolute", left: 470, top: 540, translate: "-50% -50%", perspective: 1600 }}>
        <div style={{ transform: `rotateY(${(1 - u) * -100}deg) rotate(${-4 + 2 * Math.sin(f / 60)}deg) scale(${0.9 + 0.1 * u})`, opacity: cl(u * 2) }}>
          <Carta k={k} n={n} name={name} f={f} w={420} color={[GUINDA, BARRO, NOPAL, CHILE, MAIZ, GUINDA, NOPAL][(n - 1) % 7]} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 860, top: 300, width: 960 }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 84, color: MAIZ, textShadow: txtSh, opacity: cl(u2 * 1.5), transform: `translateX(${(1 - u2) * 60}px)` }}>Secreto número {n}</div>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: name.length > 14 ? 104 : 128, lineHeight: 1.0, color: CREMA, textShadow: txtSh, marginTop: 6,
          opacity: cl(u2 * 1.5), transform: `translateX(${(1 - u2) * 90}px)` }}>{name}</div>
        <div style={{ fontFamily: HAND, fontSize: 66, color: CREMA, textShadow: txtSh, marginTop: 26, opacity: cl(u3 * 1.5), transform: `translateY(${(1 - u3) * 20}px)` }}>{sub}</div>
      </div>
    </AbsoluteFill>
  );
};

// etiqueta de precio de papel kraft colgando de un hilo (se mece con resorte)
const Etiqueta: React.FC<{ price: string; txt: string; u: number; f: number; strike?: number; color?: string }> = ({ price, txt, u, f, strike = 0, color = TINTA }) => {
  const sw = (1 - u) * 30 + 2.5 * Math.sin(f / 22) * (0.4 + 0.6 * u);
  return (
    <div style={{ transformOrigin: "50% -120px", transform: `rotate(${sw}deg)`, opacity: cl(u * 2) }}>
      <svg width={8} height={120} style={{ position: "absolute", left: "50%", top: -120, marginLeft: -4 }}><line x1={4} y1={0} x2={4} y2={120} stroke="#EFE6D2" strokeWidth={3} /></svg>
      <div style={{ ...kraft, position: "relative", padding: "34px 54px 30px", borderRadius: "14px 14px 10px 10px", boxShadow: sombra, clipPath: "polygon(16% 0, 84% 0, 100% 18%, 100% 100%, 0 100%, 0 18%)", minWidth: 300, textAlign: "center" }}>
        <div style={{ width: 26, height: 26, borderRadius: 13, background: "#3a2a1c", margin: "0 auto 10px", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.6)" }} />
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 150, lineHeight: 0.9, color }}>{price}</div>
        <div style={{ fontFamily: HAND, fontSize: 52, color: TINTA, marginTop: 6 }}>{txt}</div>
        {strike > 0 ? <Mark kind="strike" x={20} y={70} w={260} h={120} f={f} at={0} dur={1} op={strike} color={CHILE} sw={14} /> : null}
      </div>
    </div>
  );
};

// 3 · PRECIO EN PESOS: foto a pantalla completa con empuje; las etiquetas caen colgadas en su palabra; una se puede tachar
export const PesoTag: P<{ k: string; tags: { t: number; price: string; txt: string; x: number; strike?: number; red?: boolean }[]; note?: Beat }> = ({ a, d, k, tags, note }) => {
  const { f, at } = useT(a);
  const nu = note ? sp(f, at(note.t), 14, 130) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#120c08" }}>
      <AbsoluteFill style={{ transform: `scale(${1.04 + 0.08 * f / Math.max(1, d)})` }}>
        <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(10,6,3,0.55) 0%, rgba(10,6,3,0) 45%)" }} />
      {tags.map((g, i) => {
        if (f < at(g.t)) return null;
        const u = sp(f, at(g.t), 9, 90), su = g.strike && f >= at(g.strike) ? ez((f - at(g.strike)) / 12) : 0;
        return (
          <div key={i} style={{ position: "absolute", left: g.x, top: 170, translate: "-50% 0" }}>
            <Etiqueta price={g.price} txt={g.txt} u={u} f={f} strike={su} color={g.red ? CHILE : TINTA} />
          </div>
        );
      })}
      {note && f >= at(note.t) ? (
        <div style={{ position: "absolute", right: 90, bottom: 90, fontFamily: HAND, fontWeight: 700, fontSize: 80, color: CREMA, textShadow: txtSh, opacity: cl(nu * 1.5), transform: `rotate(-3deg) translateY(${(1 - nu) * 30}px)` }}>{note.txt}</div>
      ) : null}
    </AbsoluteFill>
  );
};

// 4 · PIZARRA DEL MERCADO: tiza que se escribe renglón por renglón; a la derecha la foto de lo que se nombra
export const Pizarra: P<{ bed: string; head: string; rows: { t: number; txt: string; k: string }[] }> = ({ a, d, bed, head, rows }) => {
  const { f, at } = useT(a);
  const cur = Math.max(0, rows.reduce((m, r, i) => (f >= at(r.t) ? i : m), -1));
  const pu = sp(f, 2, 14, 120);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.5} blur={12} />
      <div style={{ position: "absolute", left: 90, top: 120, width: 900, height: 820, transform: `translateX(${(1 - pu) * -200}px) rotate(-1.5deg)`, opacity: cl(pu * 2),
        background: "#6B4A2B", padding: 26, boxSizing: "border-box", borderRadius: 8, boxShadow: sombra }}>
        <div style={{ width: "100%", height: "100%", background: "radial-gradient(ellipse at 40% 35%, #34423A 0%, #26302A 70%, #1E2621 100%)", borderRadius: 3, position: "relative", padding: "40px 54px", boxSizing: "border-box" }}>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 80, color: MAIZ, opacity: 0.95 }}>{head}</div>
          <svg width={600} height={14} style={{ display: "block", marginBottom: 20 }}><path d="M 0 7 C 150 2, 400 12, 600 6" stroke="rgba(240,235,220,0.7)" strokeWidth={4} fill="none" /></svg>
          {rows.map((r, i) => {
            const u = cl((f - at(r.t)) / 18);
            if (u <= 0) return null;
            return (
              <div key={i} style={{ fontFamily: HAND, fontSize: Math.min(70, 1720 / Math.max(1, r.txt.length + 2)), lineHeight: 1.25, color: "rgba(244,240,228,0.95)", whiteSpace: "nowrap",
                clipPath: `inset(0 ${100 - u * 100}% 0 0)`, textShadow: "0 0 2px rgba(255,255,255,0.35)" }}>· {r.txt}</div>
            );
          })}
        </div>
      </div>
      {rows.map((r, i) => {
        if (f < at(r.t) || i < cur - 1) return null;
        const u = sp(f, at(r.t), 13, 130), on = i === cur;
        return (
          <div key={i} style={{ position: "absolute", left: 1450, top: 540, translate: "-50% -50%", opacity: on ? cl(u * 1.6) : 1 - cl((f - at(rows[cur].t)) / 10),
            transform: `translateY(${(1 - u) * 160}px) rotate(${i % 2 ? 3 : -3}deg)` }}>
            <Foto k={r.k} w={720} h={480} f={f} mat={16} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 5 · TATEMADO / ESPUMA: foto a pantalla completa; la cámara va a cada punto; círculo a mano + nota kraft en su palabra
export const Tatemado: P<{ k: string; beats: { t: number; txt: string; x: number; y: number }[] }> = ({ a, d, k, beats }) => {
  const { f, at } = useT(a);
  const K = [{ t: a, s: 1.0, x: 960, y: 540 }, ...beats.map((b, i) => ({ t: b.t, s: 1.12 + 0.05 * i, x: 960 + (b.x - 960) * 0.35, y: 540 + (b.y - 540) * 0.35 }))];
  const cam = camAt(f, at, K, 1.3);
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: "#0e0a07" }}>
      <AbsoluteFill style={camStyle(cam)}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080 }}>
          <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          {beats.map((b, i) => <Mark key={i} kind="circle" x={b.x - 170} y={b.y - 130} w={340} h={260} f={f} at={at(b.t) + 4} dur={12} color={MAIZ} sw={10} />)}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(10,6,3,0.55) 0%, rgba(10,6,3,0) 45%)" }} />
      {beats.map((b, i) => {
        if (f < at(b.t)) return null;
        const u = sp(f, at(b.t), 13, 140);
        return (
          <div key={i} style={{ position: "absolute", left: 80, top: 130 + i * 190, opacity: cl(u * 1.5), transform: `translateX(${(1 - u) * -80}px) rotate(${i % 2 ? 2 : -2}deg)` }}>
            <div style={{ ...kraft, padding: "16px 40px 20px", boxShadow: sombra, fontFamily: HAND, fontWeight: 700, fontSize: 74, color: TINTA, whiteSpace: "nowrap", borderRadius: 4 }}>{b.txt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 6 · CONTRA: dos fotos; la mala se tacha con una X roja en su palabra, la buena recibe la palomita verde; reloj opcional
export const Contra: P<{ bed: string; no: { k: string; txt: string; t: number }; yes: { k: string; txt: string; t: number }; clock?: Beat }> = ({ a, d, bed, no, yes, clock }) => {
  const { f, at } = useT(a);
  const nu = sp(f, 2, 13, 130), yu = sp(f, at(yes.t), 13, 130), xu = ez((f - at(no.t) - 6) / 10), cu = clock ? sp(f, at(clock.t), 12, 120) : 0;
  const ring = clock ? ez((f - at(clock.t)) / 40) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.6} blur={12} />
      <div style={{ position: "absolute", left: 500, top: 520, translate: "-50% -50%", opacity: cl(nu * 1.6), transform: `rotate(-3deg) scale(${1 - 0.06 * yu})` }}>
        <Foto k={no.k} w={720} h={470} f={f} filter={yu > 0 ? `saturate(${1 - 0.6 * yu})` : undefined} />
        <div style={{ textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 68, color: CREMA, textShadow: txtSh, marginTop: 14 }}>{no.txt}</div>
        {xu > 0 ? (
          <svg width={720} height={470} style={{ position: "absolute", left: 16, top: 16 }}>
            <path d="M 120 80 L 600 400" stroke={CHILE} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cl(xu * 2)} fill="none" />
            <path d="M 600 80 L 120 400" stroke={CHILE} strokeWidth={22} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - cl(xu * 2 - 1)} fill="none" />
          </svg>
        ) : null}
      </div>
      {f >= at(yes.t) ? (
        <div style={{ position: "absolute", left: 1400, top: 520, translate: "-50% -50%", opacity: cl(yu * 1.6), transform: `translateX(${(1 - yu) * 300}px) rotate(3deg) scale(${1.02})` }}>
          <Foto k={yes.k} w={760} h={500} f={f} />
          <div style={{ textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 72, color: MAIZ, textShadow: txtSh, marginTop: 14 }}>{yes.txt}</div>
          <div style={{ position: "absolute", right: -30, top: -40, width: 120, height: 120, borderRadius: 60, background: NOPAL, boxShadow: sombra, display: "flex", alignItems: "center", justifyContent: "center",
            transform: `scale(${sp(f, at(yes.t) + 8, 10, 160)})` }}>
            <svg width={70} height={70}><path d="M 10 38 L 28 56 L 62 14" stroke="#fff" strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
      ) : null}
      {clock && f >= at(clock.t) ? (
        <div style={{ position: "absolute", left: 960, top: 120, translate: "-50% -50%", transform: `scale(${cu})` }}>
          <svg width={220} height={220} style={{ position: "absolute", left: 0, top: 0 }}>
            <circle cx={110} cy={110} r={96} fill={CREMA} stroke="rgba(0,0,0,0.2)" strokeWidth={2} />
            <circle cx={110} cy={110} r={96} fill="none" stroke={BARRO} strokeWidth={14} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ring} transform="rotate(-90 110 110)" />
          </svg>
          <div style={{ width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HAND, fontWeight: 700, fontSize: 58, color: TINTA, position: "relative", textAlign: "center", lineHeight: 0.9 }}>{clock.txt}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// 7 · ORDEN DE LAS VERDURAS: un mecate con tres paradas (30 · 15 · 10 min); cada foto cae colgada con pinza en su palabra
export const Orden: P<{ bed: string; head: string; stops: { t: number; min: string; txt: string; k: string }[] }> = ({ a, d, bed, head, stops }) => {
  const { f, at } = useT(a);
  const ru = ez(f / 24);
  const xs = stops.map((_, i) => 380 + i * 580);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.55} blur={12} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 86, color: CREMA, textShadow: txtSh, opacity: cl(f / 12) }}>{head}</div>
      <svg width={1920} height={300} style={{ position: "absolute", left: 0, top: 150 }}>
        <path d="M -20 60 C 500 140, 1400 140, 1940 60" stroke="#D8C39A" strokeWidth={7} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ru} />
      </svg>
      {stops.map((s, i) => {
        if (f < at(s.t)) return null;
        const u = sp(f, at(s.t), 9, 100), sw = (1 - u) * 18 + 1.5 * Math.sin(f / 25 + i);
        return (
          <div key={i} style={{ position: "absolute", left: xs[i], top: 250, translate: "-50% 0", transformOrigin: "50% 0", transform: `rotate(${sw}deg) translateY(${(1 - u) * -120}px)`, opacity: cl(u * 2) }}>
            <div style={{ width: 34, height: 70, background: "#C9A26B", borderRadius: 6, margin: "0 auto -20px", position: "relative", zIndex: 2, boxShadow: "0 6px 10px rgba(0,0,0,0.4)" }} />
            <Foto k={s.k} w={460} h={330} f={f} mat={14} />
            <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
              <div style={{ background: [CHILE, BARRO, NOPAL][i % 3], color: "#fff", fontFamily: SERIF, fontWeight: 900, fontSize: 54, padding: "6px 26px", borderRadius: 40, boxShadow: sombra }}>{s.min}</div>
            </div>
            <div style={{ textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 58, color: CREMA, textShadow: txtSh, marginTop: 8, maxWidth: 520 }}>{s.txt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 8 · LA CUENTA en papel de estraza: renglones a mano en su palabra, raya, total, y el resultado en círculo rojo
export const Cuenta: P<{ bed: string; k: string; rows: { t: number; txt: string; n: string }[]; pre?: { txt: string; n: string }[]; total?: { t: number; n: string }; res?: Beat }> = ({ a, d, bed, k, rows, pre = [], total, res }) => {
  const { f, at } = useT(a);
  const pu = sp(f, 2, 14, 120), tu = total ? cl((f - at(total.t)) / 14) : 0, ru = res ? sp(f, at(res.t), 11, 130) : 0;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.5} blur={12} />
      <div style={{ position: "absolute", left: 1380, top: 520, translate: "-50% -50%", transform: `rotate(4deg) translateY(${(1 - pu) * 200}px)`, opacity: cl(pu * 2) }}>
        <Foto k={k} w={760} h={520} f={f} />
      </div>
      <div style={{ ...kraft, position: "absolute", left: 110, top: 90, width: 760, minHeight: 860, padding: "50px 60px", boxSizing: "border-box", boxShadow: sombra,
        transform: `rotate(-2deg) translateX(${(1 - pu) * -260}px)`, opacity: cl(pu * 2), clipPath: "polygon(0 1%, 4% 0, 9% 1.2%, 15% 0.2%, 22% 1%, 30% 0, 40% 1.3%, 52% 0.3%, 63% 1.1%, 74% 0, 85% 1%, 93% 0.2%, 100% 1%, 100% 100%, 0 100%)" }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 70, color: GUINDA, marginBottom: 14 }}>La cuenta del caldo</div>
        {pre.map((r, i) => (
          <div key={"p" + i} style={{ display: "flex", justifyContent: "space-between", fontFamily: HAND, fontSize: 62, lineHeight: 1.3, color: TINTA }}><span>{r.txt}</span><span style={{ fontWeight: 700 }}>{r.n}</span></div>
        ))}
        {rows.map((r, i) => {
          const u = cl((f - at(r.t)) / 14);
          if (u <= 0) return null;
          return (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontFamily: HAND, fontSize: 62, lineHeight: 1.3, color: TINTA, clipPath: `inset(0 ${100 - u * 100}% 0 0)` }}>
              <span>{r.txt}</span><span style={{ fontWeight: 700 }}>{r.n}</span>
            </div>
          );
        })}
        {tu > 0 ? (
          <div>
            <svg width={640} height={16}><path d="M 0 8 C 200 3, 450 13, 640 6" stroke={TINTA} strokeWidth={5} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tu} /></svg>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: HAND, fontWeight: 700, fontSize: 76, color: TINTA, opacity: tu }}><span>Total</span><span>{total!.n}</span></div>
          </div>
        ) : null}
        {res && f >= at(res.t) ? (
          <div style={{ marginTop: 26, display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", fontFamily: HAND, fontWeight: 700, fontSize: 84, color: CHILE, transform: `scale(${0.7 + 0.3 * ru})`, opacity: cl(ru * 1.5), padding: "10px 30px" }}>
              {res.txt}
              <Mark kind="circle" x={-20} y={-14} w={560} h={150} f={f} at={at(res.t) + 6} dur={14} color={CHILE} sw={8} />
            </div>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// 9 · RECETARIO DE LA ABUELA: hoja de cuaderno amarillenta con renglones azules y margen rojo; cada paso se escribe y recibe su palomita
export const Recetario: P<{ bed: string; head: string; rows: { t: number; txt: string }[]; n0?: number }> = ({ a, d, bed, head, rows, n0 = 0 }) => {
  const { f, at } = useT(a);
  const pu = sp(f, 2, 15, 110);
  const cur = Math.max(0, rows.reduce((m, r, i) => (f >= at(r.t) ? i : m), -1));
  const cam = camAt(f, at, [{ t: a, s: 1.0, x: 960, y: 540 }, ...rows.map((r, i) => ({ t: r.t, s: 1.06, x: 960, y: 420 + i * 40 }))], 1.4);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.6} blur={14} />
      <AbsoluteFill style={camStyle(cam)}>
        <div style={{ ...papelViejo, position: "absolute", left: 360, top: 40, width: 1200, height: 1000, boxShadow: sombra, transform: `rotate(-1.2deg) translateY(${(1 - pu) * 300}px)`, opacity: cl(pu * 2), borderRadius: 4,
          backgroundImage: "repeating-linear-gradient(180deg, rgba(0,0,0,0) 0px, rgba(0,0,0,0) 86px, rgba(70,100,160,0.35) 86px, rgba(70,100,160,0.35) 88px), radial-gradient(ellipse at 40% 30%, #F2E3B8 0%, #E6D19C 60%, #D4B97C 100%)" }}>
          <div style={{ position: "absolute", left: 120, top: 0, bottom: 0, width: 3, background: "rgba(180,40,40,0.55)" }} />
          <div style={{ position: "absolute", left: 160, top: 20, fontFamily: HAND, fontWeight: 700, fontSize: 76, color: GUINDA }}>{head}</div>
          {rows.map((r, i) => {
            const u = cl((f - at(r.t)) / 16);
            if (u <= 0) return null;
            return (
              <div key={i} style={{ position: "absolute", left: 160, top: 116 + i * 88, display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ fontFamily: HAND, fontSize: 64, color: i === cur ? TINTA : "rgba(42,33,27,0.82)", whiteSpace: "nowrap", paddingRight: 16, flexShrink: 0, clipPath: `inset(0 ${100 - u * 100}% 0 0)` }}>{i + 1 + n0}. {r.txt}</div>
                <svg width={60} height={50} style={{ opacity: cl((f - at(r.t) - 14) / 6) }}><path d="M 6 26 L 22 42 L 54 6" stroke={NOPAL} strokeWidth={8} fill="none" strokeLinecap="round" /></svg>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// 10 · POSTAL DE PÁTZCUARO: la foto como postal vieja con estampilla; leyendas a mano en su palabra
export const Postal: P<{ bed: string; k: string; place: string; beats: Beat[] }> = ({ a, d, bed, k, place, beats }) => {
  const { f, at } = useT(a);
  const pu = sp(f, 2, 14, 110);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.5} blur={12} />
      <div style={{ position: "absolute", left: 820, top: 520, translate: "-50% -50%", transform: `rotate(${-3 + 1.5 * (1 - pu)}deg) scale(${0.85 + 0.15 * pu + 0.03 * f / Math.max(1, d)})`, opacity: cl(pu * 2) }}>
        <div style={{ background: "#FBF4E4", padding: "26px 26px 90px", boxShadow: sombra, position: "relative" }}>
          <div style={{ width: 1100, height: 640, overflow: "hidden" }}><Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + 0.05 * f / Math.max(1, d)})` }} /></div>
          <div style={{ position: "absolute", left: 40, bottom: 20, fontFamily: HAND, fontWeight: 700, fontSize: 60, color: GUINDA }}>{place}</div>
          <div style={{ position: "absolute", right: -40, top: -50, width: 170, height: 200, background: MAIZ, border: "8px dashed #FBF4E4", boxShadow: sombra, transform: "rotate(8deg)",
            display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 40, color: GUINDA, textAlign: "center", lineHeight: 1 }}>MICH.<br />MÉX.</div>
        </div>
      </div>
      {beats.map((b, i) => {
        if (f < at(b.t)) return null;
        const u = sp(f, at(b.t), 13, 130);
        return (
          <div key={i} style={{ position: "absolute", left: 1450, top: 330 + i * 200, opacity: cl(u * 1.5), transform: `translateX(${(1 - u) * 120}px) rotate(${i % 2 ? 3 : -2}deg)` }}>
            <div style={{ ...kraft, padding: "14px 38px 18px", boxShadow: sombra, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: TINTA, whiteSpace: "nowrap", borderRadius: 4 }}>{b.txt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 11 · COMENTARIO: notita de papel de estraza clavada en el adobe; la pregunta se escribe sola y las respuestas entran en su palabra
export const Comentario: P<{ bed: string; q: string; opts: Beat[] }> = ({ a, d, bed, q, opts }) => {
  const { f, at } = useT(a);
  const u = sp(f, 2, 14, 110);
  const n = Math.floor(cl((f - 10) / (q.length * 0.8)) * q.length);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Bed k={bed} f={f} T={Math.max(1, d)} dim={0.5} blur={10} />
      <div style={{ position: "absolute", left: 960, top: 400, translate: "-50% -50%", width: 1300, opacity: cl(u * 2), transform: `rotate(${-1.5 + (1 - u) * 6}deg) translateY(${(1 - u) * -120}px)` }}>
        <div style={{ ...kraft, padding: "50px 70px 60px", boxShadow: sombra, position: "relative", borderRadius: 3 }}>
          <div style={{ position: "absolute", left: "50%", top: -18, width: 36, height: 36, borderRadius: 99, background: CHILE, boxShadow: "0 4px 8px rgba(0,0,0,0.5)" }} />
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: GUINDA }}>Cuéntame en los comentarios…</div>
          <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 72, lineHeight: 1.12, color: TINTA, marginTop: 14, minHeight: 170 }}>{q.slice(0, n)}</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 720, display: "flex", justifyContent: "center", gap: 70 }}>
        {opts.map((o, i) => {
          const v = sp(f, at(o.t), 12, 160);
          if (f < at(o.t)) return <div key={i} style={{ width: 0 }} />;
          return <div key={i} style={{ background: i ? CREMA : GUINDA, color: i ? TINTA : CREMA, fontFamily: HAND, fontWeight: 700, fontSize: 78, padding: "10px 46px 16px", borderRadius: 8,
            boxShadow: sombra, opacity: cl(v * 1.5), transform: `translateY(${(1 - v) * 60}px) rotate(${i ? 3 : -3}deg)` }}>{o.txt}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

// 12 · TURBIO: la foto del caldo que salió mal, nítida; un sello de goma rojo baja con la pregunta y la causa se escribe a mano en t
export const Turbio: P<{ bed: string; k: string; stamp: string; txt: string; t: number }> = ({ a, d, k, stamp, txt, t }) => {
  const { f, at } = useT(a);
  const s = sp(f, 4, 11, 240), tt = sp(f, at(t), 14, 160);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: TINTA }}>
      <AbsoluteFill style={{ transform: `scale(${1.06 + 0.08 * f / Math.max(1, d)})`, transformOrigin: "62% 60%" }}>
        <Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(20,10,5,0.66) 0%, rgba(20,10,5,0) 58%)" }} />
      <div style={{ position: "absolute", left: 110, top: 200, transform: `rotate(-6deg) scale(${2.2 - 1.2 * s})`, opacity: cl(s * 3), transformOrigin: "0 50%" }}>
        <div style={{ border: `10px solid ${CHILE}`, borderRadius: 14, padding: "4px 34px 12px", fontFamily: SERIF, fontWeight: 900, fontSize: 92, color: CHILE,
          background: "rgba(244,232,207,0.9)", boxShadow: sombra, whiteSpace: "nowrap" }}>{stamp}</div>
      </div>
      <div style={{ position: "absolute", left: 130, top: 420, width: 820, opacity: cl(tt * 1.5), transform: `translateY(${(1 - tt) * 30}px)`,
        fontFamily: HAND, fontWeight: 700, fontSize: 88, lineHeight: 1.05, color: CREMA, textShadow: txtSh }}>{txt}</div>
    </AbsoluteFill>
  );
};
