// Kit de la Comadre Cuca (cocina de rancho en Michoacán): barro, papel de estraza, talavera azul, chile rojo.
// Componentes PROPIOS del canal (registro en D:/rtmp/cuca14_COMPONENTES.md). Sólo CSS/DOM: nada se dibuja encima de las fotos;
// las escenas de estructura son de pantalla completa y la foto entra como OBJETO (copia impresa), nunca con gráficos encima.
import React from "react";
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadCaveat } from "@remotion/google-fonts/Caveat";

const SERIF = loadFraunces("normal", { weights: ["400", "600", "800"], subsets: ["latin", "latin-ext"] }).fontFamily;
const SANS = loadInter("normal", { weights: ["500", "600", "700"], subsets: ["latin", "latin-ext"] }).fontFamily;
const HAND = loadCaveat("normal", { weights: ["600", "700"], subsets: ["latin", "latin-ext"] }).fontFamily;

export const K = {
  barro: "#A4532C", barroOsc: "#6B3219", estraza: "#C8A272", estrazaClara: "#E2C99E", papel: "#F6ECD6",
  talavera: "#1D4C8F", talaveraClara: "#5C86C4", chile: "#B3261E", nopal: "#4D6A2C", tinta: "#2B1A10", cal: "#FBF7EE",
};
const CL = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const hashN = (n: number) => { let x = Math.imul(n + 7, 2654435761) >>> 0; x ^= x >>> 15; x = Math.imul(x, 2246822507) >>> 0; x ^= x >>> 13; return (x >>> 0) / 4294967296; };
const useSpr = (delay = 0, damping = 14, mass = 0.9) => { const f = useCurrentFrame(); const { fps } = useVideoConfig(); return spring({ frame: f - delay, fps, config: { damping, mass, stiffness: 120 } }); };
const useSalida = (dur: number, len = 12) => { const f = useCurrentFrame(); return interpolate(f, [dur - len, dur], [0, 1], { ...CL, easing: Easing.in(Easing.cubic) }); };

// papel de estraza: fibras con gradientes (textura del papel, no filtro de imagen)
const Estraza: React.FC<{ tono?: string; children?: React.ReactNode; style?: React.CSSProperties }> = ({ tono = K.estraza, children, style }) => (
  <AbsoluteFill style={{
    background: `radial-gradient(ellipse at 30% 20%, rgba(255,240,210,0.35), transparent 60%),
      radial-gradient(ellipse at 80% 90%, rgba(90,50,20,0.25), transparent 55%),
      repeating-linear-gradient(97deg, rgba(110,70,30,0.05) 0 2px, transparent 2px 7px),
      repeating-linear-gradient(8deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 11px), ${tono}`, ...style }}>{children}</AbsoluteFill>
);

// azulejo de talavera hecho con CSS (cenefa + flor central)
const Azulejo: React.FC<{ size: number; children?: React.ReactNode }> = ({ size, children }) => {
  const b = size * 0.11;
  return (
    <div style={{ width: size, height: size, position: "relative", background: K.cal, borderRadius: size * 0.03,
      boxShadow: "0 30px 60px rgba(40,20,5,0.45), inset 0 0 0 3px rgba(29,76,143,0.25), inset 0 -6px 18px rgba(80,50,20,0.15)" }}>
      <div style={{ position: "absolute", inset: b * 0.35, border: `${b * 0.22}px solid ${K.talavera}`, borderRadius: size * 0.02 }} />
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ position: "absolute", width: b * 1.6, height: b * 1.6, left: i % 2 ? size - b * 2.05 : b * 0.45, top: i < 2 ? b * 0.45 : size - b * 2.05,
          background: `radial-gradient(circle, ${K.chile} 0 18%, ${K.talavera} 19% 45%, transparent 46%), radial-gradient(circle, ${K.talaveraClara} 0 70%, transparent 71%)`, borderRadius: "50%" }} />
      ))}
      <div style={{ position: "absolute", inset: b * 1.4, border: `${Math.max(2, b * 0.06)}px solid ${K.talaveraClara}`, borderRadius: size * 0.015 }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>{children}</AbsoluteFill>
    </div>
  );
};

// copia impresa de la foto, con borde blanco y sombra; entra con peso
const Copia: React.FC<{ src: string; w: number; h: number; rot: number; t: number; seed: number }> = ({ src, w, h, rot, t, seed }) => {
  const f = useCurrentFrame();
  const z = 1.04 + 0.05 * Math.min(1, f / 150);
  return (
    <div style={{ width: w, height: h, padding: 16, paddingBottom: 54, background: K.cal, transform: `rotate(${rot * (1 - 0.15 * t)}deg)`,
      boxShadow: "0 40px 70px rgba(30,15,5,0.5), 0 4px 10px rgba(30,15,5,0.35)" }}>
      <div style={{ width: "100%", height: "100%", overflow: "hidden", background: K.tinta }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, transformOrigin: `${40 + seed % 20}% 45%` }} />
      </div>
    </div>
  );
};

// ⭐ PasoTalavera — apertura de cada paso: el azulejo con el número cae sobre el papel de estraza y la copia de la foto del paso entra de lado.
export const PasoTalavera: React.FC<{ n: number; total: number; word?: string; title: string; src?: string; dur: number }> = ({ n, total, word = "Paso", title, src, dur }) => {
  const f = useCurrentFrame();
  const caida = useSpr(2, 11, 1.1);
  const copia = useSpr(10, 15, 1.2);
  const sal = useSalida(dur, 12);
  const palabras = title.split(" ");
  const cam = interpolate(f, [0, dur], [1, 1.045], CL);
  const drift = Math.sin(f / 40) * 6;
  const left = n % 2 === 1;
  return (
    <AbsoluteFill style={{ transform: `translateY(${-sal * 110}%)` }}>
      <Estraza>
        <AbsoluteFill style={{ transform: `scale(${cam}) translateX(${drift}px)`, transformOrigin: "50% 60%" }}>
          {/* azulejo con el número */}
          <div style={{ position: "absolute", left: left ? 170 : 1090, top: 170,
            transform: `translateY(${(1 - caida) * -900}px) rotate(${(1 - caida) * (left ? -24 : 24) + (left ? -4 : 4)}deg)` }}>
            <Azulejo size={560}>
              <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 300, color: K.talavera, lineHeight: 1, marginTop: -10 }}>{n}</div>
            </Azulejo>
            {/* sombra que se achica al caer */}
            <div style={{ position: "absolute", left: 40, right: 40, bottom: -60, height: 50, borderRadius: "50%", background: "rgba(60,30,10,0.35)",
              filter: "blur(18px)", opacity: caida, transform: `scaleX(${0.6 + 0.4 * caida})` }} />
          </div>
          {/* texto del paso */}
          <div style={{ position: "absolute", left: left ? 830 : 150, width: 900, top: src ? 150 : 330 }}>
            <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 40, letterSpacing: 8, color: K.barroOsc, textTransform: "uppercase",
              opacity: interpolate(f, [8, 20], [0, 1], CL) }}>{word} {n} de {total}</div>
            <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 86, lineHeight: 1.05, color: K.tinta, marginTop: 14 }}>
              {palabras.map((p, i) => {
                const s = interpolate(f, [14 + i * 3, 26 + i * 3], [0, 1], { ...CL, easing: Easing.out(Easing.back(1.6)) });
                return <span key={i} style={{ display: "inline-block", marginRight: 22, opacity: s, transform: `translateY(${(1 - s) * 40}px)` }}>{p}</span>;
              })}
            </div>
            <div style={{ height: 8, width: interpolate(f, [22, 44], [0, 260], { ...CL, easing: Easing.out(Easing.cubic) }), background: K.chile, borderRadius: 4, marginTop: 22 }} />
          </div>
          {src ? (
            <div style={{ position: "absolute", left: left ? 900 : 230, top: 560,
              transform: `translateX(${(1 - copia) * (left ? 1200 : -1200)}px) rotate(${(1 - copia) * (left ? 18 : -18)}deg)` }}>
              <Copia src={src} w={640} h={420} rot={left ? 3 : -3} t={copia} seed={n * 7} />
            </div>
          ) : null}
        </AbsoluteFill>
      </Estraza>
    </AbsoluteFill>
  );
};

// ⭐ RecadoPregunta — la pregunta para los comentarios: un recado en papel de estraza colgado de un broche, se mece y se asienta.
export const RecadoPregunta: React.FC<{ text: string; dur: number }> = ({ text, dur }) => {
  const f = useCurrentFrame();
  const e = useSpr(0, 9, 1.0);
  const sal = useSalida(dur, 10);
  const mece = Math.sin(f / 9) * 5 * Math.exp(-f / 45);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", right: 90, bottom: 90, width: 760, transformOrigin: "50% -40px",
        transform: `translateY(${(1 - e) * 700 + sal * 700}px) rotate(${mece + 1.5}deg)` }}>
        {/* broche de madera */}
        <div style={{ position: "absolute", left: 340, top: -46, width: 34, height: 92, borderRadius: 6, zIndex: 2,
          background: "linear-gradient(90deg, #C79A62, #E8C590 45%, #B07E45)", boxShadow: "0 6px 10px rgba(0,0,0,0.35)" }} />
        <div style={{ background: `repeating-linear-gradient(95deg, rgba(110,70,30,0.06) 0 2px, transparent 2px 8px), ${K.estrazaClara}`,
          padding: "46px 50px 40px", boxShadow: "0 30px 50px rgba(0,0,0,0.45)", clipPath: "polygon(0 2%, 8% 0, 22% 1.5%, 40% 0, 63% 1.2%, 81% 0, 100% 1.6%, 99% 97%, 85% 100%, 64% 98%, 43% 100%, 21% 98.5%, 3% 100%)" }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 28, letterSpacing: 5, color: K.chile, textTransform: "uppercase" }}>Cuénteme abajo</div>
          <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 64, lineHeight: 1.08, color: K.tinta, marginTop: 8 }}>{text}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ⭐ SuscribeChile — botón rojo chile con la campanita; se aprieta con un dedo de luz y la campana tiembla.
export const SuscribeChile: React.FC<{ dur: number; nota?: string }> = ({ dur, nota = "Suscríbase, mija" }) => {
  const f = useCurrentFrame();
  const e = useSpr(0, 12, 0.9);
  const sal = useSalida(dur, 10);
  const press = interpolate(f, [38, 44, 52], [1, 0.9, 1], CL);
  const hecho = f > 44;
  const camp = f > 50 ? Math.sin((f - 50) / 2.2) * 18 * Math.exp(-(f - 50) / 18) : 0;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: "50%", bottom: 110, transform: `translateX(-50%) translateY(${(1 - e) * 300 + sal * 300}px)`, display: "flex", alignItems: "center", gap: 26 }}>
        <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 60, color: K.cal, textShadow: "0 3px 14px rgba(0,0,0,0.7)", transform: `rotate(-4deg)` }}>{nota}</div>
        <div style={{ transform: `scale(${press})`, background: hecho ? "#5A5A5A" : K.chile, color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: 46,
          padding: "22px 46px", borderRadius: 18, boxShadow: "0 18px 40px rgba(0,0,0,0.5)", letterSpacing: 1 }}>{hecho ? "SUSCRITO" : "SUSCRIBIRSE"}</div>
        <div style={{ width: 92, height: 92, borderRadius: "50%", background: K.cal, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 14px 30px rgba(0,0,0,0.45)", transform: `rotate(${camp}deg)`, opacity: interpolate(f, [46, 54], [0, 1], CL) }}>
          <div style={{ width: 40, height: 40, background: K.tinta, borderRadius: "20px 20px 6px 6px", position: "relative" }}>
            <div style={{ position: "absolute", bottom: -10, left: 13, width: 14, height: 10, borderRadius: "0 0 7px 7px", background: K.tinta }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ⭐ CuadernoRecap — la hoja del cuaderno de recetas de Cuca: renglones, margen rojo, cada paso se escribe y se palomea en su palabra.
export const CuadernoRecap: React.FC<{ titulo: string; items: string[]; marks: number[]; cruz?: boolean; dur: number }> = ({ titulo, items, marks, cruz, dur }) => {
  const f = useCurrentFrame();
  const e = useSpr(0, 16, 1.1);
  const sal = useSalida(dur, 12);
  const two = items.length > 6;
  const per = two ? Math.ceil(items.length / 2) : items.length;
  const row = two ? 96 : 104;
  // la cámara baja suave hacia el renglón que se está escribiendo
  const cur = marks.filter((m) => m <= f).length;
  const yCam = interpolate(cur % per, [0, per], [0, two ? -40 : -60], CL);
  return (
    <AbsoluteFill style={{ transform: `translateY(${-sal * 110}%)` }}>
      <Estraza tono={K.barro}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `translateY(${(1 - e) * 900 + yCam}px) rotate(${(1 - e) * 6 - 1}deg)` }}>
          <div style={{ width: 1600, height: 960, position: "relative", boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
            background: `repeating-linear-gradient(180deg, transparent 0 ${row - 2}px, rgba(29,76,143,0.22) ${row - 2}px ${row}px), ${K.papel}`, backgroundPositionY: 170 }}>
            <div style={{ position: "absolute", left: 120, top: 0, bottom: 0, width: 3, background: "rgba(179,38,30,0.55)" }} />
            <div style={{ position: "absolute", left: 170, top: 46, fontFamily: HAND, fontWeight: 700, fontSize: 84, color: K.barroOsc }}>{titulo}</div>
            {items.map((it, i) => {
              const col = two && i >= per ? 1 : 0;
              const y = 196 + (i % per) * row;
              const x = 170 + col * 740;
              const t0 = marks[i] ?? i * 20;
              const w = interpolate(f, [t0, t0 + 14], [0, 100], CL);
              const tick = interpolate(f, [t0 + 10, t0 + 22], [0, 1], { ...CL, easing: Easing.out(Easing.cubic) });
              return (
                <div key={i} style={{ position: "absolute", left: x, top: y, width: 700, height: row, display: "flex", alignItems: "flex-end", paddingBottom: 10 }}>
                  <svg width={58} height={58} viewBox="0 0 58 58" style={{ marginRight: 14, flex: "none" }}>
                    {cruz ? (
                      <>
                        <path d="M10 10 L48 48" stroke={K.chile} strokeWidth={7} strokeLinecap="round" fill="none" strokeDasharray={60} strokeDashoffset={60 * (1 - Math.min(1, tick * 2))} />
                        <path d="M48 10 L10 48" stroke={K.chile} strokeWidth={7} strokeLinecap="round" fill="none" strokeDasharray={60} strokeDashoffset={60 * (1 - Math.max(0, tick * 2 - 1))} />
                      </>
                    ) : (
                      <path d="M8 30 L23 46 L52 10" stroke={K.nopal} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" fill="none" strokeDasharray={70} strokeDashoffset={70 * (1 - tick)} />
                    )}
                  </svg>
                  <div style={{ fontFamily: HAND, fontWeight: 600, fontSize: two ? 50 : 56, color: K.tinta, whiteSpace: "nowrap", overflow: "hidden", clipPath: `inset(0 ${100 - w}% 0 0)` }}>
                    <span style={{ color: K.barro, marginRight: 12 }}>{i + 1}.</span>{it}
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </Estraza>
    </AbsoluteFill>
  );
};

// ⭐ PalabraRaiz — la etimología (molli + caxitl / comalli): dos fichas de barro se juntan y forman la palabra de hoy.
export const PalabraRaiz: React.FC<{ partes: { w: string; sig: string }[]; resultado: string; at2: number; dur: number }> = ({ partes, resultado, at2, dur }) => {
  const f = useCurrentFrame();
  const sal = useSalida(dur, 12);
  const junta = interpolate(f, [at2, at2 + 18], [0, 1], { ...CL, easing: Easing.inOut(Easing.cubic) });
  return (
    <AbsoluteFill style={{ transform: `translateY(${-sal * 110}%)` }}>
      <Estraza tono={K.estraza}>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div style={{ display: "flex", gap: interpolate(junta, [0, 1], [120, 0]), alignItems: "center" }}>
            {partes.map((p, i) => {
              const s = spring({ frame: f - 4 - i * 10, fps: 30, config: { damping: 12, mass: 1 } });
              return (
                <div key={i} style={{ transform: `translateY(${(1 - s) * 600}px) rotate(${(1 - s) * (i ? 14 : -14) + (1 - junta) * (i ? 3 : -3)}deg)`,
                  background: `radial-gradient(ellipse at 35% 30%, #C56A3D, ${K.barro} 55%, ${K.barroOsc})`, padding: "40px 64px", borderRadius: 34,
                  boxShadow: "0 30px 50px rgba(40,15,0,0.45), inset 0 4px 10px rgba(255,220,180,0.25)", textAlign: "center" }}>
                  <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 120, color: K.cal, lineHeight: 1 }}>{p.w}</div>
                  <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: 52, color: K.estrazaClara, marginTop: 6, opacity: 1 - junta * 0.4 }}>{p.sig}</div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 70, fontFamily: SERIF, fontWeight: 600, fontSize: 110, color: K.tinta,
            opacity: interpolate(f, [at2 + 14, at2 + 26], [0, 1], CL), transform: `scale(${interpolate(f, [at2 + 14, at2 + 30], [0.85, 1], { ...CL, easing: Easing.out(Easing.back(1.5)) })})` }}>
            = {resultado}
          </div>
        </AbsoluteFill>
      </Estraza>
    </AbsoluteFill>
  );
};

// ⭐ PremioOlla — apertura del paso PREMIO (el número doce): el azulejo gira y muestra la estrella del premio, se ilumina sin corte.
export const PremioOlla: React.FC<{ title: string; src?: string; dur: number }> = ({ title, src, dur }) => {
  const f = useCurrentFrame();
  const giro = interpolate(f, [4, 30], [180, 0], { ...CL, easing: Easing.out(Easing.back(1.2)) });
  const luz = interpolate(f, [26, 46], [0, 1], CL);
  const sal = useSalida(dur, 12);
  const copia = useSpr(18, 15, 1.2);
  return (
    <AbsoluteFill style={{ transform: `translateY(${-sal * 110}%)` }}>
      <Estraza tono={K.barroOsc}>
        <AbsoluteFill style={{ background: `radial-gradient(circle at 30% 45%, rgba(255,214,140,${0.45 * luz}), transparent 55%)` }} />
        <div style={{ position: "absolute", left: 200, top: 210, transform: `perspective(1400px) rotateY(${giro}deg)` }}>
          <Azulejo size={560}>
            <div style={{ fontFamily: SERIF, fontWeight: 800, fontSize: 250, color: K.chile, lineHeight: 1 }}>12</div>
          </Azulejo>
        </div>
        <div style={{ position: "absolute", left: 880, top: 200, width: 900 }}>
          <div style={{ fontFamily: SANS, fontWeight: 700, fontSize: 42, letterSpacing: 9, color: K.estrazaClara, opacity: luz }}>EL PREMIO</div>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 88, lineHeight: 1.05, color: K.cal, marginTop: 14, opacity: interpolate(f, [30, 42], [0, 1], CL) }}>{title}</div>
        </div>
        {src ? (
          <div style={{ position: "absolute", left: 960, top: 580, transform: `translateY(${(1 - copia) * 700}px)` }}>
            <Copia src={src} w={620} h={400} rot={-2.5} t={copia} seed={12} />
          </div>
        ) : null}
      </Estraza>
    </AbsoluteFill>
  );
};
