// ── HÉROES de Abuela Rosa · rosa3 (25 comidas con HUEVO · 16-oct-2026) ──
// Mundo del corral (nada repetido de rosa1/rosa2): tarjeta escarchada de enero de 1958, las doce gallinas que se apagan,
// dos huevos que alcanzan para siete platos, huevera de cartón que se llena hasta 25, tres huevos numerados que se rajan,
// recetario con cinta en el capítulo del huevo, banner en cajón de madera, canasto con paja (cómo guardarlos), balanza
// huevo contra pan dulce, tres vasos de agua (huevo fresco/viejo), reloj de diez minutos, bandeja del bautizo (6 huevos → 24
// cuartos), la vela del sábado, la primera noche en el suelo, la docena que da seis cenas. Familias: Fraunces + Caveat.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { sp, useT, cl, img, SERIF, HAND, P } from "../lkit/core";

const YEMA = "#F2A81D", CLARA = "#FBF7EE", CASCARA = "#E9D3B4", PAJA = "#D9B65A", CORRAL = "#6B4A2B", TINTA = "#2A2118", ESCARCHA = "#CFE3EE", ROJO = "#B5321F", VERDE = "#4F6B34";
const sombra = "0 30px 60px rgba(15,10,5,0.55), 0 6px 14px rgba(0,0,0,0.3)";
const txtSh = "0 4px 18px rgba(0,0,0,0.75)";
type Beat = { t: number; txt: string };
const tablas: React.CSSProperties = {
  background: "repeating-linear-gradient(0deg, #7A5534 0px, #8A6340 88px, #5E3F25 90px, #7F5938 180px, #57391F 182px)",
};
const paja: React.CSSProperties = { backgroundColor: "#C9A24A", backgroundImage: "repeating-linear-gradient(35deg, rgba(255,240,180,0.35) 0 3px, transparent 3px 14px), repeating-linear-gradient(-28deg, rgba(120,80,20,0.35) 0 2px, transparent 2px 11px)" };
const carton: React.CSSProperties = { background: "radial-gradient(ellipse at 40% 30%, #C9B79A 0%, #B09D7E 70%, #9A8768 100%)" };
const papel: React.CSSProperties = { background: "radial-gradient(ellipse at 45% 35%, #FFF9EA 0%, #F3E7C9 75%, #E6D4A8 100%)" };
const Escrito: React.FC<{ f: number; at: number; dur?: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ f, at, dur = 18, children, style }) => {
  const u = cl((f - at) / dur);
  return <div style={{ ...style, clipPath: `inset(-20% ${100 - u * 110}% -20% -5%)`, whiteSpace: "nowrap", paddingRight: 12 }}>{children}</div>;
};
// huevo dibujado en CSS (forma ovalada con brillo); crack = 0..1 dibuja la rajadura en zigzag
const Huevo: React.FC<{ w: number; color?: string; crack?: number; style?: React.CSSProperties; children?: React.ReactNode }> = ({ w, color = CASCARA, crack = 0, style, children }) => (
  <div style={{ position: "relative", width: w, height: w * 1.3, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: `radial-gradient(ellipse at 35% 28%, #FFFDF8 0%, ${color} 45%, #B89A72 100%)`, boxShadow: "0 18px 30px rgba(0,0,0,0.4)", ...style }}>
    {crack > 0 && (
      <svg viewBox="0 0 100 130" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <polyline points="4,62 18,54 30,66 44,52 58,66 72,52 84,64 96,56" fill="none" stroke={TINTA} strokeWidth={2.4} strokeDasharray={140} strokeDashoffset={140 * (1 - crack)} />
      </svg>
    )}
    {children}
  </div>
);
// gallina en silueta SVG (cuerpo, cola, cabeza, cresta, pico, patas)
const Gallina: React.FC<{ w: number }> = ({ w }) => (
  <svg viewBox="0 0 120 110" width={w} height={w * 0.92} style={{ filter: "drop-shadow(0 10px 12px rgba(0,0,0,0.45))" }}>
    <path d="M18 40 Q6 20 20 12 Q24 30 34 38 Z" fill="#7A4B22" />
    <ellipse cx="55" cy="62" rx="40" ry="30" fill="#C8783A" />
    <path d="M30 60 Q55 80 80 58 Q66 74 44 72 Z" fill="#9E5626" />
    <circle cx="90" cy="36" r="15" fill="#C8783A" />
    <path d="M82 22 Q86 12 90 20 Q94 10 98 20 Q102 14 102 26 Z" fill="#C0281C" />
    <path d="M104 36 L114 40 L104 44 Z" fill="#E9A31B" />
    <circle cx="94" cy="33" r="2.6" fill="#1B1208" />
    <path d="M96 46 Q100 54 94 56 Q92 50 96 46 Z" fill="#C0281C" />
    <path d="M48 90 L46 104 M62 90 L64 104" stroke="#E9A31B" strokeWidth="4" strokeLinecap="round" />
  </svg>
);
const Foto: React.FC<{ k: string; w: number; h: number; mat?: number; rot?: number; style?: React.CSSProperties }> = ({ k, w, h, mat = 18, rot = 0, style }) => (
  <div style={{ width: w, padding: mat, paddingBottom: mat * 3.2, background: "#FBF8F1", boxShadow: sombra, transform: `rotate(${rot}deg)`, ...style }}>
    <Img src={img(k)} style={{ width: "100%", height: h, objectFit: "cover", display: "block" }} />
  </div>
);

// 1 · HELADA: tarjeta escarchada; la escarcha crece desde los bordes y la fecha se escribe en su palabra
export const Helada: P<{ t: number; fecha: string; line: Beat }> = ({ a, d, t, fecha, line }) => {
  const { f, at } = useT(a);
  const fr = cl(f / 70);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #1D2B36 0%, #34495A 60%, #51677A 100%)", overflow: "hidden" }}>
      {Array.from({ length: 70 }).map((_, i) => {
        const x = (i * 271) % 1920, y = ((i * 137) % 1080 + f * (1.2 + (i % 5) * 0.3)) % 1080;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 4 + (i % 4) * 2, height: 4 + (i % 4) * 2, borderRadius: "50%", background: "rgba(255,255,255,0.7)" }} />;
      })}
      <div style={{ position: "absolute", left: 360, top: 180, width: 1200, height: 720, ...papel, boxShadow: sombra, transform: `rotate(-1.5deg) scale(${0.9 + 0.1 * sp(f, 0, 14, 100)})` }}>
        <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 ${40 + 120 * fr}px ${20 + 60 * fr}px ${ESCARCHA}` }} />
        <Escrito f={f} at={at(t)} dur={28} style={{ position: "absolute", left: 110, top: 110, fontFamily: HAND, fontWeight: 700, fontSize: 104, color: TINTA }}>{fecha}</Escrito>
        <div style={{ position: "absolute", left: 110, top: 270, width: 860, height: 6, background: ROJO, transform: `scaleX(${cl((f - at(t) - 24) / 14)})`, transformOrigin: "0 50%" }} />
        <Escrito f={f} at={at(line.t)} dur={26} style={{ position: "absolute", left: 110, top: 380, fontFamily: HAND, fontSize: 86, color: "#2F5873" }}>{line.txt}</Escrito>
      </div>
    </AbsoluteFill>
  );
};

// 2 · LAS DOCE GALLINAS: doce siluetas en el corral; en su palabra se apagan diez y quedan dos con luz
export const Gallinas: P<{ t: number; t2: number; txt: string; txt2: string }> = ({ a, d, t, t2, txt, txt2 }) => {
  const { f, at } = useT(a);
  const off = cl((f - at(t)) / 30), keep = sp(f, at(t2), 12, 120);
  return (
    <AbsoluteFill style={{ ...tablas, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, rgba(255,220,150,0.15) 0%, rgba(0,0,0,0.55) 100%)" }} />
      <div style={{ position: "absolute", left: 210, top: 250, display: "grid", gridTemplateColumns: "repeat(6, 250px)", rowGap: 60 }}>
        {Array.from({ length: 12 }).map((_, i) => {
          const alive = i === 4 || i === 9, u = sp(f, i * 2, 12, 140);
          const dead = !alive ? off : 0;
          return (
            <div key={i} style={{ fontSize: 170, textAlign: "center", transform: `scale(${u * (alive ? 1 + 0.18 * keep : 1)})`, filter: `grayscale(${dead}) brightness(${1 - 0.65 * dead})`, opacity: 1 - 0.55 * dead }}><Gallina w={190} /></div>
          );
        })}
      </div>
      <Escrito f={f} at={at(t)} dur={22} style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 86, color: CLARA, textShadow: txtSh }}>{txt}</Escrito>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 96, color: YEMA, textShadow: txtSh, opacity: cl(keep * 2) }}>{txt2}</div>
    </AbsoluteFill>
  );
};

// 3 · DOS HUEVOS, SIETE PLATOS: dos huevos al centro; en su palabra salen siete platos en arco alrededor
export const Siete: P<{ t: number; txt: string }> = ({ a, d, t, txt }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ background: "#EFE4CC", backgroundImage: `repeating-linear-gradient(45deg, ${ROJO}22 0 26px, transparent 26px 52px), repeating-linear-gradient(-45deg, ${ROJO}22 0 26px, transparent 26px 52px)`, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 960, top: 600, translate: "-50% -50%", display: "flex", gap: 30, transform: `scale(${sp(f, 0, 12, 110)})` }}>
        <Huevo w={150} /><Huevo w={150} />
      </div>
      {Array.from({ length: 7 }).map((_, i) => {
        const u = sp(f, Math.min(at(t), 24) + i * 6, 12, 130), ang = Math.PI * (0.05 + (i / 6) * 0.9);
        const x = 960 - Math.cos(ang) * 640, y = 640 - Math.sin(ang) * 420;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, #FFFFFF 0 52%, #E8E2D6 54%, #FFFFFF 62%, #D9D0C0 100%)", border: `5px solid ${"#2F5873"}`, boxShadow: sombra, transform: `scale(${u})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: TINTA }}>{i + 1}</div>
        );
      })}
      <Escrito f={f} at={Math.min(at(t), 70)} dur={22} style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 92, color: TINTA }}>{txt}</Escrito>
    </AbsoluteFill>
  );
};

// 4 · HUEVERA: cartón de 5x5 que se llena huevo por huevo con el contador hasta 25
export const Huevera: P<{ t: number; n: number; txt: string; sub?: Beat }> = ({ a, d, t, n, txt, sub }) => {
  const { f, at } = useT(a);
  const k = Math.min(n, Math.floor(cl((f - at(t)) / 50) * n));
  return (
    <AbsoluteFill style={{ ...tablas, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 160, top: 120, width: 840, height: 840, ...carton, borderRadius: 20, boxShadow: sombra, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", padding: 30, gap: 14 }}>
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} style={{ borderRadius: "50%", background: "radial-gradient(circle at 50% 60%, #8E7B5E 0%, #A8957A 60%, #BCA98C 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {i < k && <Huevo w={92} style={{ transform: `scale(${sp(f, at(t) + (i / n) * 50, 10, 160)})` }} />}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 1080, top: 230, fontFamily: SERIF, fontWeight: 900, fontSize: 330, color: YEMA, textShadow: txtSh, lineHeight: 1 }}>{k}</div>
      <div style={{ position: "absolute", left: 1090, top: 580, width: 760, fontFamily: SERIF, fontWeight: 800, fontSize: 70, color: CLARA, textShadow: txtSh, lineHeight: 1.05 }}>{txt}</div>
      {sub && <Escrito f={f} at={at(sub.t)} dur={22} style={{ position: "absolute", left: 1090, top: 800, fontFamily: HAND, fontWeight: 700, fontSize: 70, color: PAJA, textShadow: txtSh }}>{sub.txt}</Escrito>}
    </AbsoluteFill>
  );
};

// 5 · TRES HUEVOS NUMERADOS: cada uno se raja en su palabra y deja ver lo que promete
export const Cascarones: P<{ items: { t: number; n: number; txt: string }[] }> = ({ a, d, items }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ ...paja, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 30%, rgba(40,25,5,0.6) 100%)" }} />
      {items.map((it, i) => {
        const x = 330 + i * 630, c = cl((f - at(it.t)) / 14), op = sp(f, at(it.t) + 12, 12, 120);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 470, translate: "-50% -50%" }}>
            <Huevo w={300} crack={c} style={{ transform: `rotate(${Math.sin((f - at(it.t)) / 2) * 4 * (1 - c)}deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 150, color: TINTA, opacity: 1 - op * 0.8 }}>{it.n}</div>
            </Huevo>
            <div style={{ position: "absolute", left: "50%", top: 470, translate: "-50% 0", width: 520, textAlign: "center", ...papel, padding: "14px 20px", boxShadow: sombra, fontFamily: HAND, fontWeight: 700, fontSize: 56, color: TINTA, lineHeight: 1.05, opacity: cl(op * 2), transform: `translateY(${(1 - op) * 60}px) rotate(${(i - 1) * 2}deg)` }}>
              <span style={{ color: ROJO }}>#{it.n}</span> · {it.txt}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 6 · RECETARIO CON CINTA: el libro entra y una cinta amarilla marca el capítulo del huevo y la página
export const LibroCinta: P<{ t: number; cap: Beat; page: Beat; foot?: string }> = ({ a, d, t, cap, page, foot }) => {
  const { f, at } = useT(a);
  const u = sp(f, at(t), 13, 110), c = sp(f, at(cap.t), 12, 140), p = sp(f, at(page.t), 10, 160);
  return (
    <AbsoluteFill style={{ ...paja, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "rgba(40,25,10,0.35)" }} />
      <div style={{ position: "absolute", left: 230, top: 110, width: 720, transform: `translateY(${(1 - u) * 700}px) rotate(${-4 + 2 * u}deg)` }}>
        <Img src={staticFile("rosa/libro1_3d.png")} style={{ width: "100%", filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.5))" }} />
        <div style={{ position: "absolute", left: "58%", top: -40, width: 70, height: 160 + 260 * c, background: YEMA, clipPath: "polygon(0 0,100% 0,100% 100%,50% 88%,0 100%)", boxShadow: "0 8px 14px rgba(0,0,0,0.35)" }} />
      </div>
      <div style={{ position: "absolute", left: 1060, top: 260, ...papel, padding: "30px 50px", boxShadow: sombra, transform: `rotate(2deg) translateX(${(1 - c) * 900}px)` }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: TINTA }}>{cap.txt}</div>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 120, color: ROJO, transform: `scale(${p})`, transformOrigin: "0 50%" }}>{page.txt}</div>
        {foot && <div style={{ fontFamily: HAND, fontSize: 52, color: "#5A4B38" }}>{foot}</div>}
      </div>
    </AbsoluteFill>
  );
};

// 7 · BANNER EN CAJÓN: el banner con QR montado como etiqueta de cajón de huevos, con clavos
export const BannerCajon: P<{}> = ({ a, d }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 13, 110);
  return (
    <AbsoluteFill style={{ ...tablas, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 960, top: 540, translate: "-50% -50%", width: 1640, padding: 30, background: "#C79A62", border: "14px solid #6E4A28", borderRadius: 10, boxShadow: sombra, transform: `scale(${0.8 + 0.2 * u}) rotate(${(1 - u) * -6}deg)` }}>
        <Img src={staticFile("rosa/banner_qr.png")} style={{ width: "100%", display: "block", borderRadius: 6 }} />
        {[[14, 14], [14, 1590], [10, 14], [10, 1590]].map(([y, x], i) => (
          <div key={i} style={{ position: "absolute", left: x, [i < 2 ? "top" : "bottom"]: y, width: 26, height: 26, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #ddd, #555)" } as React.CSSProperties} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 8 · CANASTO CON PAJA: cómo se guardan los huevos; cada regla aparece en una etiqueta de cartón
export const Canasto: P<{ head: string; k: string; items: Beat[] }> = ({ a, d, head, k, items }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ ...paja, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "rgba(30,20,5,0.3)" }} />
      <div style={{ position: "absolute", left: 110, top: 150 }}><Foto k={k} w={760} h={680} rot={-3} /></div>
      <div style={{ position: "absolute", left: 930, top: 80, fontFamily: SERIF, fontWeight: 900, fontSize: 66, color: CLARA, textShadow: txtSh, whiteSpace: "nowrap" }}>{head}</div>
      {items.map((it, i) => {
        const u = sp(f, at(it.t), 12, 140);
        return (
          <div key={i} style={{ position: "absolute", left: 1000, top: 230 + i * 190, ...carton, padding: "18px 36px", borderRadius: 8, boxShadow: sombra, fontFamily: HAND, fontWeight: 700, fontSize: 64, color: TINTA, opacity: cl(u * 2), transform: `translateX(${(1 - u) * 500}px) rotate(${i % 2 ? 2 : -2}deg)` }}>✓ {it.txt}</div>
        );
      })}
    </AbsoluteFill>
  );
};

// 9 · BALANZA: el huevo contra el pan dulce; el brazo se inclina hacia el huevo (más barato y con más fuerza)
export const Balanza: P<{ t: number; kL: string; kR: string; txtL: string; txtR: string; verdict: Beat }> = ({ a, d, t, kL, kR, txtL, txtR, verdict }) => {
  const { f, at } = useT(a);
  const tilt = 9 * sp(f, at(t), 16, 70), v = sp(f, at(verdict.t), 12, 130);
  const Plato: React.FC<{ k: string; txt: string; x: number; dy: number }> = ({ k, txt, x, dy }) => (
    <div style={{ position: "absolute", left: x, top: 470 + dy, translate: "-50% 0", textAlign: "center" }}>
      <div style={{ width: 360, height: 360, borderRadius: "50%", overflow: "hidden", border: "10px solid #B8873A", boxShadow: sombra }}><Img src={img(k)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
      <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, color: CLARA, textShadow: txtSh, marginTop: 10 }}>{txt}</div>
    </div>
  );
  const dy = Math.sin((tilt * Math.PI) / 180) * 480;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 40%, #6B4A2B 0%, #3A2716 100%)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 950, top: 300, width: 20, height: 620, background: "linear-gradient(90deg,#8C6A2C,#D9B261,#8C6A2C)" }} />
      <div style={{ position: "absolute", left: 960, top: 300, width: 1000, height: 16, translate: "-50% -50%", background: "linear-gradient(#D9B261,#8C6A2C)", transform: `rotate(${-tilt}deg)`, borderRadius: 8 }} />
      <Plato k={kL} txt={txtL} x={480} dy={dy} />
      <Plato k={kR} txt={txtR} x={1440} dy={-dy} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 60, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: YEMA, textShadow: txtSh, opacity: cl(v * 2), transform: `scale(${0.8 + 0.2 * v})` }}>{verdict.txt}</div>
    </AbsoluteFill>
  );
};

// 10 · TRES VASOS: la prueba del huevo fresco; cada vaso muestra el huevo acostado, parado o flotando en su palabra
export const Vasos: P<{ items: { t: number; txt: string; pos: "fondo" | "parado" | "flota" }[] }> = ({ a, d, items }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #EDE6D8 0%, #EDE6D8 70%, #9B7B55 70%, #7E6243 100%)", overflow: "hidden" }}>
      {items.map((it, i) => {
        const u = sp(f, at(it.t), 14, 90), x = 420 + i * 540;
        const yEnd = it.pos === "flota" ? 90 : it.pos === "parado" ? 330 : 400, rot = it.pos === "fondo" ? 90 : it.pos === "parado" ? 0 : 20;
        const ok = it.pos === "fondo" ? VERDE : it.pos === "parado" ? YEMA : ROJO;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: 230, translate: "-50% 0", opacity: cl(sp(f, at(it.t) - 8, 12, 140) * 2) }}>
            <div style={{ position: "relative", width: 300, height: 520, borderRadius: "0 0 40px 40px", border: "6px solid rgba(255,255,255,0.9)", borderTop: "none", background: "linear-gradient(90deg, rgba(255,255,255,0.35), rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.3))", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, right: 0, top: 70, bottom: 0, background: "rgba(150,200,230,0.45)" }} />
              <div style={{ position: "absolute", left: 150, top: 40 + (yEnd - 40) * u, translate: "-50% 0", transform: `rotate(${rot * u}deg)` }}><Huevo w={100} /></div>
            </div>
            <div style={{ marginTop: 26, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 60, color: ok, width: 420, translate: "-60px 0" }}>{it.txt}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 11 · RELOJ DE DIEZ MINUTOS: esfera de cocina; la aguja barre hasta 10 y abajo se escribe el resultado
export const Reloj: P<{ t: number; min: number; txt: string; sub?: Beat }> = ({ a, d, t, min, txt, sub }) => {
  const { f, at } = useT(a);
  const sw = cl((f - at(t)) / 60) * (min / 60) * 360;
  return (
    <AbsoluteFill style={{ background: "#2F5873", backgroundImage: "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.18) 0%, rgba(0,0,0,0.35) 100%)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 640, top: 470, translate: "-50% -50%", width: 680, height: 680, borderRadius: "50%", background: CLARA, border: "26px solid #D8D2C4", boxShadow: sombra }}>
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `conic-gradient(${YEMA}CC 0deg ${sw}deg, transparent ${sw}deg 360deg)` }} />
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 314, top: 20, width: 8, height: 44, background: TINTA, transform: `rotate(${i * 30}deg)`, transformOrigin: "4px 294px" }} />
        ))}
        <div style={{ position: "absolute", left: 309, top: 70, width: 18, height: 250, background: ROJO, borderRadius: 9, transform: `rotate(${sw}deg)`, transformOrigin: "9px 248px" }} />
        <div style={{ position: "absolute", left: 293, top: 293, width: 50, height: 50, borderRadius: "50%", background: TINTA }} />
      </div>
      <div style={{ position: "absolute", left: 1100, top: 280, fontFamily: SERIF, fontWeight: 900, fontSize: 200, color: CLARA, textShadow: txtSh, lineHeight: 1, whiteSpace: "nowrap" }}>{min} min</div>
      <div style={{ position: "absolute", left: 1110, top: 520, width: 760, fontFamily: HAND, fontWeight: 700, fontSize: 72, color: YEMA, textShadow: txtSh, lineHeight: 1.05 }}>{txt}</div>
      {sub && <Escrito f={f} at={at(sub.t)} dur={22} style={{ position: "absolute", left: 1110, top: 780, fontFamily: HAND, fontSize: 62, color: CLARA, textShadow: txtSh }}>{sub.txt}</Escrito>}
    </AbsoluteFill>
  );
};

// 12 · BANDEJA DEL BAUTIZO: seis huevos se parten en cuartos y llenan la bandeja (6 → 24) para veinte personas
export const Bandeja: P<{ t: number; t2: number; txt: string; txt2: string }> = ({ a, d, t, t2, txt, txt2 }) => {
  const { f, at } = useT(a);
  const split = cl((f - at(t2)) / 30);
  return (
    <AbsoluteFill style={{ background: "#F1EADB", backgroundImage: "radial-gradient(circle at 50% 50%, #ffffff 0%, #E4D9C2 100%)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 960, top: 600, translate: "-50% -50%", width: 1300, height: 720, borderRadius: "50%", background: "radial-gradient(ellipse, #E9E9EC 0%, #C9CACF 60%, #A6A7AD 100%)", border: "16px solid #BDBEC4", boxShadow: sombra }}>
        <div style={{ position: "absolute", inset: 60, borderRadius: "50%", background: `radial-gradient(ellipse, ${VERDE}55 0%, ${VERDE}22 70%, transparent 100%)` }} />
        {Array.from({ length: 24 }).map((_, i) => {
          const egg = Math.floor(i / 4), q = i % 4, ang0 = (egg / 6) * Math.PI * 2, show = q === 0 || split > 0;
          const ang = ang0 + split * ((q - 1.5) * 0.22), r = 190 + split * (q % 2) * 90;
          if (!show || f < at(t) + egg * 4) return null;
          const x = 634 + Math.cos(ang) * r * 1.5, y = 344 + Math.sin(ang) * r;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", width: split > 0 ? 90 : 120, height: split > 0 ? 60 : 90, borderRadius: "50%", background: `radial-gradient(circle at 50% 50%, ${YEMA} 0 32%, #F7D86A 34%, ${CLARA} 38%, #E8E0CE 100%)`, boxShadow: "0 6px 10px rgba(0,0,0,0.25)", transform: `scale(${sp(f, at(t) + egg * 4, 12, 150)})` }} />
          );
        })}
      </div>
      <Escrito f={f} at={at(t)} dur={22} style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 88, color: TINTA }}>{txt}</Escrito>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 30, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 84, color: ROJO, opacity: split }}>{txt2}</div>
    </AbsoluteFill>
  );
};

// 13 · LA VELA DEL SÁBADO: foto en penumbra con una llama que respira y la frase de Antonio escrita a mano
export const Vela: P<{ k: string; t: number; txt: string }> = ({ a, d, k, t, txt }) => {
  const { f, at } = useT(a);
  const fl = 0.85 + 0.15 * Math.sin(f / 3) * Math.sin(f / 7.3);
  return (
    <AbsoluteFill style={{ background: "#120C07", overflow: "hidden" }}>
      <Img src={img(k)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.04 + f * 0.0006})`, filter: `brightness(${0.55 + 0.12 * fl})` }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, rgba(255,170,60,${0.28 * fl}) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.65) 100%)` }} />
      <Escrito f={f} at={at(t)} dur={30} style={{ position: "absolute", left: 0, right: 0, bottom: 90, textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 110, color: "#FFE2A8", textShadow: "0 0 30px rgba(255,160,60,0.8)" }}>{txt}</Escrito>
    </AbsoluteFill>
  );
};

// 14 · LA PRIMERA NOCHE: polaroid en el piso de tierra; al lado, lo que tenían, tachando lo que no
export const PrimeraNoche: P<{ k: string; items: { t: number; txt: string; no?: boolean }[] }> = ({ a, d, k, items }) => {
  const { f, at } = useT(a);
  return (
    <AbsoluteFill style={{ background: "#8A6A48", backgroundImage: "radial-gradient(circle at 20% 30%, rgba(0,0,0,0.12) 0 3px, transparent 4px), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.08) 0 2px, transparent 3px)", backgroundSize: "60px 60px, 44px 44px", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 40% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)" }} />
      <div style={{ position: "absolute", left: 120, top: 120, transform: `translateY(${(1 - sp(f, 0, 14, 90)) * -900}px)` }}><Foto k={k} w={820} h={640} rot={-4} /></div>
      {items.map((it, i) => {
        const u = sp(f, at(it.t), 12, 140), s = it.no ? cl((f - at(it.t) - 10) / 12) : 0;
        return (
          <div key={i} style={{ position: "absolute", left: 1080, top: 140 + i * 125, fontFamily: HAND, fontWeight: 700, fontSize: 76, color: it.no ? "#3A2A1A" : CLARA, textShadow: it.no ? "none" : txtSh, opacity: cl(u * 2), transform: `translateX(${(1 - u) * 300}px)` }}>
            {it.txt}
            {it.no && <div style={{ position: "absolute", left: -10, top: "52%", height: 7, width: `${s * 110}%`, background: ROJO, transform: "rotate(-3deg)" }} />}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// 15 · LA DOCENA: doce huevos se juntan de a dos y cada par cae en una noche de la semana (seis cenas)
export const Docena: P<{ t: number; t2: number; days: string[]; txt: string }> = ({ a, d, t, t2, days, txt }) => {
  const { f, at } = useT(a);
  const m = sp(f, at(t2), 16, 80);
  return (
    <AbsoluteFill style={{ background: "#F0E7D2", backgroundImage: `repeating-linear-gradient(0deg, transparent 0 58px, #2F587322 58px 60px)`, overflow: "hidden" }}>
      <Escrito f={f} at={at(t)} dur={22} style={{ position: "absolute", left: 0, right: 0, top: 50, textAlign: "center", fontFamily: SERIF, fontWeight: 900, fontSize: 84, color: TINTA }}>{txt}</Escrito>
      {days.map((dy, i) => (
        <div key={"d" + i} style={{ position: "absolute", left: 120 + i * 285, top: 640, width: 255, height: 300, ...papel, boxShadow: sombra, borderTop: `30px solid ${i % 2 ? YEMA : ROJO}`, opacity: cl(m * 2), textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 58, color: TINTA, paddingTop: 170 }}>{dy}</div>
      ))}
      {Array.from({ length: 12 }).map((_, i) => {
        const x0 = 330 + (i % 6) * 220, y0 = 220 + Math.floor(i / 6) * 190, day = Math.floor(i / 2);
        const x1 = 120 + day * 285 + 127 + (i % 2 ? 40 : -40), y1 = 690;
        const u = sp(f, at(t) + i * 2, 12, 150);
        return <div key={i} style={{ position: "absolute", left: x0 + (x1 - x0) * m, top: y0 + (y1 - y0) * m, translate: "-50% 0", transform: `scale(${u * (1 - 0.25 * m)})` }}><Huevo w={90} /></div>;
      })}
    </AbsoluteFill>
  );
};

// ── SUPERPOSICIONES ──
// etiqueta de cada plato: un huevo con el número (arriba a la izquierda) y la tira de cartón con nombre, página y costo
export const HuevoTag: P<{ n: number; name: string; page?: number; cost?: string }> = ({ a, d, n, name, page, cost }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 13, 130), out = cl((f - (d - 12)) / 12);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 60, top: 50, display: "flex", alignItems: "center", transform: `translateX(${(1 - u) * -700 - out * 700}px)`, opacity: 1 - out }}>
        <Huevo w={130} style={{ zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, color: TINTA }}>{n}</div>
        </Huevo>
        <div style={{ marginLeft: -26, padding: "14px 34px 14px 50px", ...carton, borderRadius: "0 14px 14px 0", boxShadow: sombra, borderBottom: `6px solid ${YEMA}` }}>
          <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: name.length > 30 ? 44 : 52, color: TINTA, whiteSpace: "nowrap" }}>{name}</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 42, color: ROJO }}>{[page ? `recetario · pág. ${page}` : "", cost || ""].filter(Boolean).join("   ·   ")}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
export const QRCorner3: P<{ txt?: string }> = ({ a, d, txt }) => {
  const { f } = useT(a);
  const u = sp(f, 0, 14, 120), out = cl((f - (d - 10)) / 10);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", right: 60, bottom: 60, width: 320, ...carton, borderRadius: 16, padding: 16, boxShadow: sombra, border: `6px solid ${YEMA}`, transform: `scale(${u * (1 - out)}) rotate(${(1 - u) * 20}deg)`, transformOrigin: "100% 100%" }}>
        <Img src={staticFile("rosa/qr_card.png")} style={{ width: "100%", borderRadius: 10 }} />
        {txt && <div style={{ textAlign: "center", fontFamily: HAND, fontWeight: 700, fontSize: 40, color: TINTA, marginTop: 6 }}>{txt}</div>}
      </div>
    </AbsoluteFill>
  );
};
