// ── HÉROES de Stan the Butcher (stan8, 16-oct): 13 componentes PURO CSS (sin imágenes ni filtros pesados), cada uno anclado a SU frase.
// Materiales dibujados con gradientes: papel kraft, tiza sobre pizarra, sello de goma, acero, papel de carnicería.
import React from "react";
import { AbsoluteFill } from "remotion";
import { sp, cl, ez, useT, P, LABEL, HAND, C } from "../lkit/core";

const RED = "#B3262B", INK = "#231D18", KRAFT = "#C9A270", PAPER = "#F4EBD8", CHALK = "#F3F1EA", STEEL = "#8D969C";
const kraft: React.CSSProperties = {
  background: `repeating-linear-gradient(88deg, rgba(90,60,25,0.05) 0 2px, rgba(255,255,255,0.04) 2px 5px),
    radial-gradient(ellipse at 30% 20%, #D9B47F 0%, ${KRAFT} 55%, #A8794A 100%)`,
};
const butcherPaper: React.CSSProperties = {
  background: `repeating-linear-gradient(0deg, rgba(0,0,0,0.025) 0 1px, transparent 1px 9px),
    linear-gradient(160deg, #FBF6EA 0%, ${PAPER} 60%, #E9DCC0 100%)`,
};
const slate: React.CSSProperties = {
  background: `repeating-linear-gradient(72deg, rgba(255,255,255,0.025) 0 3px, transparent 3px 11px),
    radial-gradient(ellipse at 50% 35%, #34403A 0%, #242E2A 60%, #161D1A 100%)`,
};
const steel: React.CSSProperties = {
  background: `repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 2px, transparent 2px 6px),
    linear-gradient(180deg, #C9D0D4 0%, ${STEEL} 45%, #5E666B 100%)`,
};
const chalkTxt: React.CSSProperties = { color: CHALK, textShadow: "0 0 1px rgba(255,255,255,0.6), 0 2px 6px rgba(0,0,0,0.35)", fontFamily: HAND };
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080 };
// entrada suave del objeto principal: sube y aparece
const rise = (f: number, at: number, dy = 40) => ({ opacity: cl((f - at) / 9), transform: `translateY(${(1 - sp(f, at, 14, 120)) * dy}px)` });
// zoom lento de todo el plano (se siente vivo sin temblar)
const drift = (f: number, d: number) => `scale(${1.03 - 0.03 * cl(f / Math.max(1, d))})`;

// 1 · TIZA: pizarra con "17" escrito a mano (trazo que se dibuja con clip) + subtítulo
export const TizaCuenta: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const u = ez((f - 4) / 30);
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...slate }}>
      <div style={{ ...full, transform: drift(f, d), transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: 180, top: 250, ...chalkTxt, fontSize: 330, lineHeight: 0.9, fontWeight: 700,
          clipPath: `inset(0 ${(1 - u) * 100}% 0 0)` }}>17</div>
        <div style={{ position: "absolute", left: 180, top: 640, ...chalkTxt, fontSize: 120, opacity: cl((f - 22) / 10),
          transform: `translateX(${(1 - sp(f, 22, 16, 110)) * -30}px)` }}>things. Every day.</div>
        <div style={{ position: "absolute", left: 186, top: 800, width: 1000, height: 6, background: "rgba(243,241,234,0.7)",
          transform: `scaleX(${ez((f - 34) / 22)})`, transformOrigin: "0 50%", borderRadius: 3 }} />
        <div style={{ position: "absolute", left: 186, top: 840, ...chalkTxt, fontSize: 84, opacity: cl((f - 40) / 10), color: "#F2C230" }}>since 1974</div>
      </div>
    </AbsoluteFill>
  );
};

// 2 · SELLO DE GOMA: "BAKING SODA" cae sobre papel kraft y se marca con doble borde
export const SelloBicarb: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const s = 1.7 - 0.7 * sp(f, 3, 11, 180);
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...kraft }}>
      <div style={{ ...full, transform: drift(f, d), transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: 230, top: 210, width: 1460, height: 660, ...butcherPaper, transform: "rotate(-1.5deg)", boxShadow: "0 30px 60px rgba(40,20,5,0.45), 0 4px 10px rgba(40,20,5,0.3)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, display: "flex", alignItems: "center", justifyContent: "center",
          opacity: cl((f - 3) / 3), transform: `rotate(-7deg) scale(${s})` }}>
          <div style={{ border: `14px double ${RED}`, padding: "34px 70px 30px", color: RED, fontFamily: LABEL, fontWeight: 800, fontSize: 178,
            letterSpacing: 6, lineHeight: 1, mixBlendMode: "multiply", opacity: 0.93 }}>
            BAKING SODA
            <div style={{ fontSize: 64, letterSpacing: 4, textAlign: "center", marginTop: 14 }}>THE BOX IN THE FRIDGE</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 3 · VETAS: bloque de carne con fibras; un corte de cuchillo cruza en ángulo recto
export const VetasCorte: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const x = 990 * ez((f - 6) / 22);
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...butcherPaper }}>
      <div style={{ ...full, transform: drift(f, d), transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: 300, top: 300, width: 1000, height: 480, borderRadius: 14, overflow: "hidden",
          background: `repeating-linear-gradient(176deg, rgba(120,20,25,0.9) 0 7px, rgba(190,60,60,0.85) 7px 14px, rgba(240,200,190,0.55) 14px 16px),
            linear-gradient(90deg, #7A1A1E, #B5443F 60%, #7A1A1E)`, boxShadow: "0 30px 50px rgba(60,20,10,0.35)" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: x, background: "rgba(0,0,0,0.0)" }} />
          <div style={{ position: "absolute", left: x - 6, top: -40, width: 12, height: 560, background: `linear-gradient(90deg, #fff, ${STEEL})`, boxShadow: "0 0 18px rgba(255,255,255,0.6)" }} />
        </div>
        <div style={{ position: "absolute", left: 300, top: 830, color: INK, fontFamily: LABEL, fontWeight: 700, fontSize: 60, letterSpacing: 2, ...rise(f, 14, 20) }}>
          ACROSS THE GRAIN ↓
        </div>
        <div style={{ position: "absolute", left: 1040, top: 180, color: RED, fontFamily: HAND, fontSize: 96, transform: "rotate(-4deg)", ...rise(f, 18, 16) }}>
          not along it
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 4 · SAL: dos columnas en papel: "la noche antes" (✓) contra "justo antes" (✗)
export const SalAntes: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const tick = ez((f - 10) / 14);
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...kraft }}>
      <div style={{ ...full, transform: drift(f, d), transformOrigin: "50% 50%" }}>
        {[0, 1].map((i) => (
          <div key={i} style={{ position: "absolute", left: 220 + i * 800, top: 190, width: 700, height: 700, ...butcherPaper, borderRadius: 6,
            boxShadow: "0 26px 46px rgba(40,20,5,0.4)", transform: `rotate(${i ? 1.6 : -1.6}deg)`, ...rise(f, 4 + i * 6, 50) }}>
            <div style={{ padding: "50px 56px", color: INK, fontFamily: LABEL, fontWeight: 800, fontSize: 70, letterSpacing: 2, lineHeight: 1.05 }}>
              {i === 0 ? "THE NIGHT BEFORE" : "RIGHT BEFORE THE PAN"}
            </div>
            <div style={{ position: "absolute", left: 300, top: 330, width: 170, height: 170, borderRadius: 85,
              background: i === 0 ? "#2F6B3F" : RED, color: "#fff", fontFamily: LABEL, fontWeight: 900, fontSize: 150,
              display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${i === 0 ? tick : 0.3 + 0.7 * tick})` }}>
              {i === 0 ? "✓" : "✗"}
            </div>
            <div style={{ position: "absolute", left: 56, top: 560, color: INK, fontFamily: HAND, fontSize: 84 }}>
              {i === 0 ? "40 min, salt goes deep" : "only the surface"}
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 5 · TERMÓMETRO: columna que sube de la heladera a la cocina (38 °F → 60 °F)
export const TermoFrio: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const h = 620 * ez((f - 6) / 40);
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...slate }}>
      <div style={{ ...full, transform: drift(f, d), transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: 760, top: 180, width: 84, height: 700, borderRadius: 42, background: "#0E1210", boxShadow: "inset 0 0 0 6px #2B3330" }}>
          <div style={{ position: "absolute", left: 22, bottom: 40, width: 40, height: h, borderRadius: 20, background: `linear-gradient(90deg, #E0584F, ${RED})` }} />
          <div style={{ position: "absolute", left: -18, bottom: -30, width: 120, height: 120, borderRadius: 60, background: `radial-gradient(circle at 40% 35%, #E9645B, ${RED})` }} />
        </div>
        <div style={{ position: "absolute", left: 960, top: 230, ...chalkTxt, fontSize: 130, ...rise(f, 2, 24) }}>38°F</div>
        <div style={{ position: "absolute", left: 960, top: 420, ...chalkTxt, fontSize: 96, opacity: cl((f - 20) / 8), color: "#F2C230" }}>→ 60°F</div>
        <div style={{ position: "absolute", left: 960, top: 560, ...chalkTxt, fontSize: 70, ...rise(f, 26, 18) }}>30 minutes on the counter</div>
      </div>
    </AbsoluteFill>
  );
};

// 6 · MEDIDOR 3/4: regla de acero con una barra de carne que llega a 3/4 de pulgada
export const Medidor34: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const w = 1320 * 0.75 * ez((f - 4) / 26);
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...butcherPaper }}>
      <div style={{ ...full, transform: drift(f, d), transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: 300, top: 480, width: 1320, height: 70, ...steel, borderRadius: 4, boxShadow: "0 14px 26px rgba(0,0,0,0.3)" }}>
          {Array.from({ length: 17 }).map((_, i) => (
            <div key={i} style={{ position: "absolute", left: i * 82.5, top: 0, width: 3, height: i % 4 === 0 ? 46 : 26, background: INK, opacity: 0.8 }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 300, top: 400, width: w, height: 80, background: `linear-gradient(180deg, #B5443F, #7A1A1E)`, borderRadius: "10px 10px 0 0", boxShadow: "0 -6px 16px rgba(120,20,25,0.25)" }} />
        <div style={{ position: "absolute", left: 300 + 990, top: 300, width: 6, height: 180, background: RED, opacity: cl((f - 26) / 6) }} />
        <div style={{ position: "absolute", left: 300 + 990 - 170, top: 210, color: RED, fontFamily: LABEL, fontWeight: 800, fontSize: 96, opacity: cl((f - 28) / 6) }}>3/4 INCH</div>
        <div style={{ position: "absolute", left: 300, top: 640, color: INK, fontFamily: HAND, fontSize: 90, ...rise(f, 12, 20) }}>thick in the middle, that's the point</div>
      </div>
    </AbsoluteFill>
  );
};

// 7 · CRONÓMETRO: anillo cónico que se vacía en 90 s (lo que dura la costra)
export const Cronom90: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const left = 1 - cl((f - 4) / 60);
  const ang = Math.round(360 * left);
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...slate }}>
      <div style={{ ...full, transform: drift(f, d), transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: 710, top: 150, width: 500, height: 500, borderRadius: 250,
          background: `conic-gradient(#E0584F 0deg, ${RED} ${ang}deg, rgba(255,255,255,0.08) ${ang}deg 360deg)`, boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
          <div style={{ position: "absolute", left: 40, top: 40, right: 40, bottom: 40, borderRadius: 250, background: "#1A221F", display: "flex", alignItems: "center", justifyContent: "center", ...chalkTxt, fontSize: 150, fontWeight: 700 }}>
            90s
          </div>
        </div>
        <div style={{ position: "absolute", left: 0, width: 1920, top: 720, textAlign: "center", ...chalkTxt, fontSize: 96, opacity: cl((f - 8) / 10) }}>
          the crust. then leave it alone.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 8 · LADRILLO: carne picada apretada = ladrillo; se suelta y queda tierna
export const Ladrillo: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const loose = cl((f - d * 0.5) / 14);
  const sq = 1 - loose;
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...butcherPaper }}>
      <div style={{ ...full, transform: drift(f, d), transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: 620, top: 300, width: 680, height: 420, borderRadius: 18,
          background: `repeating-linear-gradient(35deg, rgba(90,15,20,0.5) 0 3px, transparent 3px 22px), linear-gradient(160deg, #B5443F, #8A2226)`,
          transform: `scale(${1 - 0.1 * sq}, ${1 - 0.22 * sq}) rotate(${-2 * sq}deg)`, boxShadow: "0 30px 50px rgba(60,10,10,0.4)",
          borderRadius: `${18 + 40 * loose}px` }}>
          {[0.2, 0.5, 0.75].map((x, i) => (
            <div key={i} style={{ position: "absolute", left: `${x * 100}%`, top: 0, bottom: 0, width: 3, background: "rgba(40,5,8,0.5)", opacity: sq }} />
          ))}
        </div>
        <div style={{ position: "absolute", left: 620, top: 780, width: 680, textAlign: "center", color: INK, fontFamily: LABEL, fontWeight: 800, fontSize: 70, opacity: sq }}>SQUEEZED = BRICK</div>
        <div style={{ position: "absolute", left: 620, top: 780, width: 680, textAlign: "center", color: "#2F6B3F", fontFamily: LABEL, fontWeight: 800, fontSize: 70, opacity: loose }}>LOOSE = TENDER</div>
      </div>
    </AbsoluteFill>
  );
};

// 9 · DIAL 130 °F: medidor semicircular con aguja que llega a 130
export const Dial130: P<{}> = ({ d }) => {
  const { f } = useT(0);
  // escala 0-200 °F en el semicírculo: 130 °F = 65 % del arco
  const ang = -90 + 180 * 0.65 * ez((f - 4) / 32);
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...slate }}>
      <div style={{ ...full, transform: drift(f, d), transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: 660, top: 170, width: 600, height: 300, borderRadius: "300px 300px 0 0", overflow: "hidden",
          background: "conic-gradient(from 270deg at 50% 100%, #2D6E8E 0deg, #E7C34A 60deg, #E0584F 120deg, #7A1A1E 180deg, transparent 180deg)" }}>
          <div style={{ position: "absolute", left: 60, top: 60, right: 60, bottom: -300, borderRadius: "270px 270px 0 0", background: "#1A221F" }} />
        </div>
        <div style={{ position: "absolute", left: 950, top: 264, width: 8, height: 200, background: CHALK, transformOrigin: "50% 100%", transform: `rotate(${ang}deg)`, borderRadius: 4, boxShadow: "0 0 12px rgba(255,255,255,0.4)" }} />
        <div style={{ position: "absolute", left: 930, top: 440, width: 48, height: 48, borderRadius: 24, background: CHALK }} />
        <div style={{ position: "absolute", left: 0, width: 1920, top: 560, textAlign: "center", ...chalkTxt, fontSize: 210, fontWeight: 700, opacity: cl((f - 14) / 10) }}>130°F</div>
        <div style={{ position: "absolute", left: 0, width: 1920, top: 800, textAlign: "center", ...chalkTxt, fontSize: 80, opacity: cl((f - 22) / 10), color: "#F2C230" }}>then take it off. it keeps climbing.</div>
      </div>
    </AbsoluteFill>
  );
};

// 10 · LISTA EN EL MOSTRADOR: 3 controles que se tildan en papel de carnicería
export const ListaCarne: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const items = ["Bright red", "A little white fat", "Not slimy, not in its juice"];
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...kraft }}>
      <div style={{ ...full, transform: drift(f, d), transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: 500, top: 150, width: 920, height: 780, ...butcherPaper, borderRadius: 8, transform: "rotate(-1deg)", boxShadow: "0 30px 50px rgba(40,20,5,0.4)", ...rise(f, 0, 40) }}>
          <div style={{ padding: "54px 70px 0", color: INK, fontFamily: LABEL, fontWeight: 800, fontSize: 80, letterSpacing: 2 }}>AT THE CASE</div>
          {items.map((t, i) => {
            const u = ez((f - 10 - i * 12) / 12);
            return (
              <div key={i} style={{ position: "absolute", left: 70, top: 220 + i * 170, display: "flex", alignItems: "center", gap: 36 }}>
                <div style={{ width: 90, height: 90, border: `6px solid ${INK}`, borderRadius: 10, position: "relative", flex: "0 0 auto" }}>
                  <div style={{ position: "absolute", left: 22, top: 2, width: 26, height: 56, borderRight: `12px solid ${RED}`, borderBottom: `12px solid ${RED}`, transform: `rotate(45deg) scale(${u})`, transformOrigin: "50% 50%", opacity: u }} />
                </div>
                <div style={{ color: INK, fontFamily: HAND, fontSize: 88, opacity: cl((f - 8 - i * 12) / 8) }}>{t}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// 11 · CORTES BARATOS: encabezado "ASK FOR" y tres cortes numerados que entran uno tras otro (pizarra de menú)
export const CortesBaratos: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const cuts = ["Bottom round", "Flat iron", "Chuck eye"];
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...slate }}>
      <div style={{ ...full, transform: drift(f, d), transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: 0, width: 1920, top: 170, textAlign: "center", ...chalkTxt, fontSize: 120, opacity: cl(f / 8) }}>ASK FOR</div>
        {cuts.map((c, i) => (
          <div key={i} style={{ position: "absolute", left: 470, top: 370 + i * 190, width: 980, height: 150, display: "flex", alignItems: "center", gap: 48,
            borderBottom: "3px dashed rgba(243,241,234,0.35)", opacity: cl((f - 6 - i * 9) / 8), transform: `translateX(${(1 - sp(f, 6 + i * 9, 15, 130)) * 120}px)` }}>
            <div style={{ width: 120, height: 120, borderRadius: 60, border: `5px solid ${CHALK}`, display: "flex", alignItems: "center", justifyContent: "center", ...chalkTxt, fontSize: 80 }}>{i + 1}</div>
            <div style={{ ...chalkTxt, fontSize: 124, fontWeight: 700 }}>{c}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 12 · TRES PASOS: tarjetas de papel en fila (20 MIN → RINSE → PAT DRY) que entran en secuencia
export const TresPasos: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const steps = [["20 MIN", "in cold water"], ["RINSE", "well, under the tap"], ["PAT DRY", "or it tastes soapy"]];
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...kraft }}>
      <div style={{ ...full, transform: drift(f, d), transformOrigin: "50% 50%" }}>
        {steps.map(([h, s], i) => (
          <div key={i} style={{ position: "absolute", left: 180 + i * 540, top: 300, width: 480, height: 480, ...butcherPaper, borderRadius: 6,
            boxShadow: "0 26px 46px rgba(40,20,5,0.4)", transform: `rotate(${(i - 1) * 2}deg) translateY(${(1 - sp(f, 4 + i * 10, 13, 140)) * 80}px)`,
            opacity: cl((f - 4 - i * 10) / 8) }}>
            <div style={{ position: "absolute", left: 40, top: 60, color: RED, fontFamily: LABEL, fontWeight: 900, fontSize: 92, lineHeight: 1 }}>{h}</div>
            <div style={{ position: "absolute", left: 40, top: 240, color: INK, fontFamily: HAND, fontSize: 60, lineHeight: 1.1 }}>{s}</div>
            <div style={{ position: "absolute", left: 40, top: 400, color: INK, fontFamily: LABEL, fontWeight: 800, fontSize: 52 }}>{`STEP ${i + 1}`}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// 13 · PRECIO: comparador en papel de envolver: barra larga "restaurante" contra barra corta "en casa"
export const PrecioPlato: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const L = 1180 * ez((f - 4) / 26), S = 1180 * (9 / 24) * ez((f - 14) / 22);
  return (
    <AbsoluteFill style={{ overflow: "hidden", ...butcherPaper }}>
      <div style={{ ...full, transform: drift(f, d), transformOrigin: "50% 50%" }}>
        <div style={{ position: "absolute", left: 300, top: 220, color: INK, fontFamily: LABEL, fontWeight: 800, fontSize: 64, letterSpacing: 2, opacity: cl(f / 8) }}>DOWNTOWN STEAK</div>
        <div style={{ position: "absolute", left: 300, top: 300, width: L, height: 150, background: `linear-gradient(90deg, #7A1A1E, ${RED})`, borderRadius: 6 }} />
        <div style={{ position: "absolute", left: 300 + L - 300, top: 330, width: 300, textAlign: "right", color: "#fff", fontFamily: LABEL, fontWeight: 900, fontSize: 96, opacity: cl((f - 20) / 6) }}>$24</div>
        <div style={{ position: "absolute", left: 300, top: 560, color: INK, fontFamily: LABEL, fontWeight: 800, fontSize: 64, letterSpacing: 2, opacity: cl((f - 12) / 8) }}>MY KITCHEN, TONIGHT</div>
        <div style={{ position: "absolute", left: 300, top: 640, width: S, height: 150, background: "linear-gradient(90deg, #2F6B3F, #3F8A52)", borderRadius: 6 }} />
        <div style={{ position: "absolute", left: 300 + S + 24, top: 670, color: INK, fontFamily: LABEL, fontWeight: 900, fontSize: 96, opacity: cl((f - 34) / 6) }}>$9</div>
        <div style={{ position: "absolute", left: 300, top: 860, color: INK, fontFamily: HAND, fontSize: 80, opacity: cl((f - 40) / 8) }}>for four people</div>
      </div>
    </AbsoluteFill>
  );
};
