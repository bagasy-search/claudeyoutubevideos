// ── HÉROES de Dockside Earl (earlsalmon, 17-oct): salmón de criadero vs salvaje. PURO CSS, anclados a su frase.
// Materiales dibujados con gradientes: tablones del muelle, hielo picado, acero galvanizado, papel de carnicero, pizarra de tiza,
// filetes de salmón (naranja con vetas de grasa / rojo magro). Dos familias: LABEL (rótulos) y HAND (tiza / mano).
import React from "react";
import { AbsoluteFill } from "remotion";
import { sp, cl, ez, useT, P, LABEL, HAND } from "../lkit/core";

const RED = "#C62828", INK = "#1E2328", SALM = "#F2884B", SOCK = "#B3182B", ICE = "#E8F3F8", NAVY = "#17324D", CHALK = "#F4F1E8", GOLD = "#F2C230";
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080 };

// ── materiales
const planks: React.CSSProperties = {
  background: `repeating-linear-gradient(90deg, rgba(0,0,0,0.28) 0 3px, transparent 3px 240px),
    repeating-linear-gradient(90deg, rgba(255,255,255,0.025) 0 1px, transparent 1px 7px),
    repeating-linear-gradient(0deg, rgba(60,40,20,0.10) 0 2px, transparent 2px 19px),
    linear-gradient(180deg, #8A7259 0%, #6E5844 45%, #5A4636 100%)`,
};
const iceBed: React.CSSProperties = {
  background: `radial-gradient(circle at 12% 30%, rgba(255,255,255,0.9) 0 7px, transparent 8px),
    radial-gradient(circle at 63% 72%, rgba(255,255,255,0.85) 0 9px, transparent 10px),
    radial-gradient(circle at 38% 55%, rgba(200,225,235,0.9) 0 6px, transparent 7px),
    radial-gradient(circle at 85% 20%, rgba(255,255,255,0.8) 0 8px, transparent 9px)`,
  backgroundSize: "46px 46px, 61px 61px, 37px 37px, 53px 53px", backgroundColor: "#D7E9F0",
};
const chalkboard: React.CSSProperties = {
  background: `radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.07) 0%, transparent 55%),
    radial-gradient(ellipse at 75% 80%, rgba(255,255,255,0.05) 0%, transparent 50%),
    linear-gradient(160deg, #2E3B33 0%, #22302A 60%, #1B2620 100%)`,
};
const butcher: React.CSSProperties = {
  background: `repeating-linear-gradient(0deg, rgba(120,90,60,0.05) 0 1px, transparent 1px 5px),
    repeating-linear-gradient(90deg, rgba(120,90,60,0.04) 0 1px, transparent 1px 6px),
    linear-gradient(170deg, #FBF6EC 0%, #F1E7D3 100%)`,
};
const steel: React.CSSProperties = {
  background: `repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 3px),
    linear-gradient(180deg, #C9D1D6 0%, #A8B3BA 50%, #8E9AA2 100%)`,
};
// filetes (salmón de criadero: naranja + vetas blancas anchas; salvaje: rojo profundo + líneas finas)
const fillet = (wild: boolean): React.CSSProperties => ({
  background: wild
    ? `repeating-linear-gradient(118deg, rgba(255,235,225,0.22) 0 3px, transparent 3px 34px), linear-gradient(160deg, #D6303F 0%, ${SOCK} 55%, #7E0F1E 100%)`
    : `repeating-linear-gradient(118deg, rgba(255,250,240,0.85) 0 9px, transparent 9px 44px), linear-gradient(160deg, #FFB07A 0%, ${SALM} 55%, #D9672F 100%)`,
  clipPath: "polygon(4% 18%, 30% 4%, 70% 0%, 96% 10%, 100% 52%, 92% 90%, 60% 100%, 22% 96%, 0% 70%)",
});

const rise = (f: number, at: number, dy = 40) => ({ opacity: cl((f - at) / 9), transform: `translateY(${(1 - sp(f, at, 14, 120)) * dy}px)` });
const drift = (f: number, d: number) => `scale(${1.03 - 0.03 * cl(f / Math.max(1, d))})`;
const Wrap: React.FC<{ f: number; d: number; bg: React.CSSProperties; children: React.ReactNode }> = ({ f, d, bg, children }) => (
  <AbsoluteFill style={{ overflow: "hidden", ...bg }}>
    <div style={{ ...full, transform: drift(f, d), transformOrigin: "50% 50%" }}>{children}</div>
    <div style={{ ...full, background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(0,0,0,0.28) 100%)", pointerEvents: "none" }} />
  </AbsoluteFill>
);
const Banner: React.FC<{ txt: string; f: number; at: number; top?: number; size?: number; bg?: string }> = ({ txt, f, at, top = 880, size = 78, bg = RED }) => (
  <div style={{ position: "absolute", left: 0, top, width: 1920, height: size * 1.6, background: bg, display: "flex", alignItems: "center", justifyContent: "center",
    transform: `scaleX(${ez((f - at) / 10)})`, boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
    <div style={{ color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: size, letterSpacing: 4, opacity: cl((f - at - 6) / 6) }}>{txt}</div>
  </div>
);
const Fillet: React.FC<{ wild: boolean; w: number; h: number; style?: React.CSSProperties }> = ({ wild, w, h, style }) => (
  <div style={{ position: "relative", width: w, height: h, filter: "drop-shadow(0 22px 22px rgba(0,0,0,0.38))", ...style }}>
    <div style={{ position: "absolute", inset: 0, ...fillet(wild) }} />
    <div style={{ position: "absolute", inset: 0, ...fillet(wild), background: "linear-gradient(115deg, rgba(255,255,255,0.35) 0%, transparent 35%, transparent 70%, rgba(0,0,0,0.18) 100%)" }} />
  </div>
);
// tarjetita de madera clavada (como en la miniatura)
const Stake: React.FC<{ txt: string; style?: React.CSSProperties; size?: number }> = ({ txt, style, size = 54 }) => (
  <div style={{ position: "absolute", ...style }}>
    <div style={{ position: "absolute", left: "50%", top: "86%", width: 16, height: 120, marginLeft: -8, background: "linear-gradient(90deg,#B98B57,#8C6539)" }} />
    <div style={{ position: "relative", padding: "14px 30px", background: "linear-gradient(170deg,#F2DDB4,#D9BC86)", borderRadius: 8, border: "4px solid #6B4A26",
      boxShadow: "0 12px 24px rgba(0,0,0,0.4)", fontFamily: LABEL, fontWeight: 700, fontSize: size, color: INK, textAlign: "center", lineHeight: 1.0, whiteSpace: "pre" }}>{txt}</div>
  </div>
);
const Cross: React.FC<{ f: number; at: number; size?: number; x: number; y: number }> = ({ f, at, size = 220, x, y }) => {
  const k = ez((f - at) / 8), k2 = ez((f - at - 6) / 8);
  const bar = (rot: number, kk: number): React.CSSProperties => ({ position: "absolute", left: 0, top: size / 2 - 14, width: size * kk, height: 28, background: RED, borderRadius: 14,
    transform: `rotate(${rot}deg)`, transformOrigin: "0 50%", boxShadow: "0 6px 14px rgba(0,0,0,0.35)" });
  return (
    <div style={{ position: "absolute", left: x, top: y, width: size, height: size }}>
      <div style={{ ...bar(45, k), left: 18, top: 4 }} />
      <div style={{ ...bar(-45, k2), left: 18, top: size - 32 }} />
    </div>
  );
};

// 1 · AMBOS LADOS MINTIERON: dos filetes en el hielo con su estaca y la X roja sobre cada "mentira"
export const AmbosMintieron: P<{}> = ({ d }) => {
  const { f } = useT(0);
  return (
    <Wrap f={f} d={d} bg={planks}>
      <div style={{ position: "absolute", left: 120, top: 520, width: 1680, height: 380, ...iceBed, borderRadius: 30, boxShadow: "inset 0 10px 30px rgba(0,0,0,0.25), 0 20px 40px rgba(0,0,0,0.4)" }} />
      <div style={{ position: "absolute", left: 230, top: 330, ...rise(f, 0, 60) }}><Fillet wild={false} w={560} h={360} /></div>
      <div style={{ position: "absolute", left: 1130, top: 330, ...rise(f, 6, 60) }}><Fillet wild w={560} h={360} /></div>
      <div style={{ ...rise(f, 10, 30) }}><Stake txt={"FARM\nRAISED"} style={{ left: 380, top: 120 }} /></div>
      <div style={{ ...rise(f, 14, 30) }}><Stake txt={"WILD\nCAUGHT"} style={{ left: 1290, top: 120 }} /></div>
      <div style={{ position: "absolute", left: 160, top: 712, width: 720, textAlign: "center", fontFamily: HAND, fontSize: 64, color: INK, opacity: cl((f - 26) / 8) }}>"It's poison!"</div>
      <div style={{ position: "absolute", left: 1040, top: 712, width: 720, textAlign: "center", fontFamily: HAND, fontSize: 64, color: INK, opacity: cl((f - 34) / 8) }}>"It's all the same!"</div>
      <Cross f={f} at={44} x={410} y={420} />
      <Cross f={f} at={52} x={1300} y={420} />
      <Banner txt="BOTH SIDES LIED" f={f} at={62} top={900} />
    </Wrap>
  );
};

// 2 · ATLANTIC = FARMED: etiqueta de bandeja de súper con la palabra ATLANTIC y el sello que cae encima
export const Atlantico: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const st = sp(f, 30, 10, 170);
  return (
    <Wrap f={f} d={d} bg={steel}>
      <div style={{ position: "absolute", left: 360, top: 150, width: 1200, height: 700, background: "linear-gradient(170deg,#24282C,#14171A)", borderRadius: 40,
        boxShadow: "0 40px 70px rgba(0,0,0,0.5)", ...rise(f, 0, 50) }}>
        <div style={{ position: "absolute", left: 120, top: 80 }}><Fillet wild={false} w={960} h={540} /></div>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1200, height: 700, borderRadius: 40, background: "linear-gradient(120deg, rgba(255,255,255,0.18) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.08) 100%)" }} />
      </div>
      <div style={{ position: "absolute", left: 610, top: 520, width: 700, height: 300, background: "#fff", borderRadius: 8, boxShadow: "0 16px 30px rgba(0,0,0,0.35)",
        transform: "rotate(-3deg)", ...rise(f, 8, 30) }}>
        <div style={{ height: 70, background: NAVY, color: "#fff", fontFamily: LABEL, fontSize: 40, letterSpacing: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>SALMON FILLET</div>
        <div style={{ textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 120, color: INK, marginTop: 20, letterSpacing: 4 }}>ATLANTIC</div>
        <div style={{ position: "absolute", left: 40, right: 40, bottom: 26, height: 30, background: "repeating-linear-gradient(90deg,#222 0 4px,transparent 4px 7px,#222 7px 9px,transparent 9px 14px)" }} />
      </div>
      <div style={{ position: "absolute", left: 1180, top: 300, width: 520, height: 210, border: `14px solid ${RED}`, borderRadius: 24, color: RED, fontFamily: LABEL, fontWeight: 700,
        fontSize: 130, letterSpacing: 8, display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(-12deg) scale(${2.2 - 1.2 * st})`, opacity: cl((f - 30) / 3),
        background: "rgba(255,255,255,0.12)" }}>FARMED</div>
      <div style={{ position: "absolute", left: 0, top: 920, width: 1920, textAlign: "center", fontFamily: LABEL, fontSize: 58, color: INK, letterSpacing: 2, opacity: cl((f - 46) / 8) }}>
        ATLANTIC = THE BREED, NOT THE OCEAN
      </div>
    </Wrap>
  );
};

// 3 · DE DÓNDE SALE EL COLOR: krill → salmón salvaje / pellet + astaxantina → salmón de criadero (misma molécula)
export const Color: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const node = (txt: string, sub: string, x: number, y: number, at: number, bg: string, col = "#fff") => (
    <div style={{ position: "absolute", left: x, top: y, width: 420, height: 190, borderRadius: 26, background: bg, boxShadow: "0 18px 34px rgba(0,0,0,0.4)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", ...rise(f, at, 30) }}>
      <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 60, color: col, letterSpacing: 2 }}>{txt}</div>
      <div style={{ fontFamily: HAND, fontSize: 40, color: col, opacity: 0.9 }}>{sub}</div>
    </div>
  );
  const arrow = (x: number, y: number, at: number) => (
    <div style={{ position: "absolute", left: x, top: y, width: 200 * ez((f - at) / 10), height: 14, background: CHALK, borderRadius: 7 }}>
      <div style={{ position: "absolute", right: -18, top: -14, width: 0, height: 0, borderLeft: "30px solid " + CHALK, borderTop: "21px solid transparent", borderBottom: "21px solid transparent",
        opacity: cl((f - at - 8) / 3) }} />
    </div>
  );
  return (
    <Wrap f={f} d={d} bg={chalkboard}>
      <div style={{ position: "absolute", left: 0, top: 60, width: 1920, textAlign: "center", fontFamily: HAND, fontSize: 92, color: CHALK, opacity: cl(f / 8) }}>Where the color comes from</div>
      {node("KRILL", "tiny ocean shrimp", 140, 280, 4, "linear-gradient(160deg,#F49A8C,#D9584B)")}
      {arrow(590, 368, 14)}
      {node("WILD", "red from what it eats", 830, 280, 20, `linear-gradient(160deg,#D6303F,${SOCK})`)}
      {node("PELLETS", "+ astaxanthin", 140, 600, 30, "linear-gradient(160deg,#9B7A55,#6E5236)")}
      {arrow(590, 688, 40)}
      {node("FARMED", "orange from the feed", 830, 600, 46, `linear-gradient(160deg,#FFB07A,${SALM})`, INK)}
      <div style={{ position: "absolute", left: 1330, top: 330, width: 470, height: 440, borderRadius: 30, border: `6px dashed ${GOLD}`, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", ...rise(f, 58, 30) }}>
        <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 74, color: GOLD, letterSpacing: 2, textAlign: "center", lineHeight: 1.05 }}>SAME<br />MOLECULE</div>
        <div style={{ fontFamily: HAND, fontSize: 52, color: CHALK, marginTop: 20, textAlign: "center" }}>in the food,<br />not painted on</div>
      </div>
    </Wrap>
  );
};

// 4 · ¿TÓXICO? balanza de veredicto: titular vs lo que no salió en las noticias (hi: 1 PCBs, 2 antibióticos, 3 piojos)
export const Toxico: P<{ hi?: number }> = ({ d, hi = 0 }) => {
  const { f } = useT(0);
  const rows: [string, string][] = [["PCBs & DIOXINS", "under FDA limits · down since"], ["ANTIBIOTICS", "Norway: very little now"], ["SEA LICE", "bad for fish, not your plate"]];
  return (
    <Wrap f={f} d={d} bg={butcher}>
      <div style={{ position: "absolute", left: 110, top: 110, width: 1340, height: 170, background: "#111", color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 72,
        display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 2, transform: "rotate(-1.5deg)", boxShadow: "0 18px 30px rgba(0,0,0,0.35)", ...rise(f, 0, 40) }}>
        "MOST TOXIC FOOD IN THE WORLD"
      </div>
      <div style={{ position: "absolute", left: 1500, top: 120, width: 330, height: 140, border: `10px solid ${RED}`, color: RED, fontFamily: LABEL, fontWeight: 700, fontSize: 80,
        display: "flex", alignItems: "center", justifyContent: "center", transform: `rotate(10deg) scale(${1.8 - 0.8 * sp(f, 18, 10, 170)})`, opacity: cl((f - 18) / 3), background: "rgba(255,255,255,0.85)" }}>FALSE</div>
      {rows.map(([a, b], i) => {
        const at = hi ? 6 : 30 + i * 12, on = !hi || hi === i + 1;
        return (
          <div key={a} style={{ position: "absolute", left: 260, top: 360 + i * 190, width: 1400, height: 150, borderRadius: 18, background: on ? "#fff" : "#EFE8DA",
            boxShadow: on ? "0 14px 26px rgba(0,0,0,0.22)" : "none", display: "flex", alignItems: "center", ...rise(f, at, 26), opacity: cl((f - at) / 8) * (on ? 1 : 0.4) }}>
            <div style={{ width: 22, alignSelf: "stretch", background: on ? GOLD : "#CFC6B4", borderRadius: "18px 0 0 18px" }} />
            <div style={{ marginLeft: 50, width: 560, fontFamily: LABEL, fontWeight: 700, fontSize: 66, color: INK }}>{a}</div>
            <div style={{ fontFamily: HAND, fontSize: 60, color: NAVY }}>{b}</div>
          </div>
        );
      })}
    </Wrap>
  );
};

// 5 · LO QUE TRAE EL FILETE: barras criadero vs salvaje (grasa, omega 3, omega 6, calorías) — cualitativo, sin cifras inventadas
export const Filete: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const R: [string, number, number][] = [["FAT", 0.9, 0.45], ["OMEGA-3", 0.82, 0.78], ["OMEGA-6", 0.85, 0.2], ["CALORIES", 0.85, 0.55]];
  return (
    <Wrap f={f} d={d} bg={planks}>
      <div style={{ position: "absolute", left: 90, top: 150, ...rise(f, 0, 40) }}><Fillet wild={false} w={420} h={300} /></div>
      <div style={{ position: "absolute", left: 90, top: 560, ...rise(f, 6, 40) }}><Fillet wild w={420} h={300} /></div>
      <div style={{ position: "absolute", left: 110, top: 460, width: 380, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 52, color: "#fff", textShadow: "0 4px 10px rgba(0,0,0,0.6)" }}>FARMED</div>
      <div style={{ position: "absolute", left: 110, top: 870, width: 380, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 52, color: "#fff", textShadow: "0 4px 10px rgba(0,0,0,0.6)" }}>WILD</div>
      <div style={{ position: "absolute", left: 620, top: 130, width: 1200, height: 820, ...butcher, borderRadius: 20, boxShadow: "0 30px 50px rgba(0,0,0,0.45)", ...rise(f, 4, 50) }}>
        {R.map(([n, a, b], i) => {
          const at = 16 + i * 10;
          return (
            <div key={n} style={{ position: "absolute", left: 60, top: 60 + i * 190, width: 1080 }}>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 50, color: INK, letterSpacing: 2 }}>{n}</div>
              <div style={{ marginTop: 10, height: 44, width: 1000 * a * ez((f - at) / 14), borderRadius: 22, background: `linear-gradient(90deg,#FFB07A,${SALM})`, boxShadow: "0 6px 12px rgba(0,0,0,0.18)" }} />
              <div style={{ marginTop: 10, height: 44, width: 1000 * b * ez((f - at - 4) / 14), borderRadius: 22, background: `linear-gradient(90deg,#D6303F,${SOCK})`, boxShadow: "0 6px 12px rgba(0,0,0,0.18)" }} />
            </div>
          );
        })}
      </div>
      <Banner txt="SAME SPECIES · DIFFERENT LIFE" f={f} at={64} top={950} size={60} bg={NAVY} />
    </Wrap>
  );
};

// 6 · MERCURIO: termómetro vertical con los peces en su altura; el salmón abajo, en verde
export const Mercurio: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const fish: [string, number, string][] = [["SWORDFISH", 0.97, RED], ["KING MACKEREL", 0.8, RED], ["SOME TUNA", 0.6, "#E08A1E"], ["SALMON", 0.1, "#2E8B57"]];
  const H = 720, lvl = ez((f - 8) / 26);
  return (
    <Wrap f={f} d={d} bg={chalkboard}>
      <div style={{ position: "absolute", left: 0, top: 50, width: 1920, textAlign: "center", fontFamily: HAND, fontSize: 90, color: CHALK }}>Mercury</div>
      <div style={{ position: "absolute", left: 560, top: 190, width: 90, height: H, borderRadius: 45, background: "rgba(255,255,255,0.12)", border: `5px solid ${CHALK}` }}>
        <div style={{ position: "absolute", left: 12, bottom: 12, width: 56, height: (H - 24) * 0.95 * lvl, borderRadius: 28, background: "linear-gradient(0deg,#2E8B57 0%,#E0B21E 50%,#C62828 100%)" }} />
      </div>
      {fish.map(([n, y, c], i) => {
        const at = 14 + i * 9;
        const top = 190 + H - 30 - y * (H - 60);
        return (
          <div key={n} style={{ position: "absolute", left: 690, top: top - 40, display: "flex", alignItems: "center", gap: 26, ...rise(f, at, 20) }}>
            <div style={{ width: 70, height: 8, background: CHALK }} />
            <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: n === "SALMON" ? 92 : 64, color: c, padding: n === "SALMON" ? "4px 26px" : 0,
              border: n === "SALMON" ? `6px solid #2E8B57` : "none", borderRadius: 16, background: n === "SALMON" ? "rgba(46,139,87,0.12)" : "none" }}>{n}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 1340, top: 780, fontFamily: HAND, fontSize: 64, color: GOLD, transform: "rotate(-4deg)", opacity: cl((f - 56) / 8) }}>FDA "best choice"</div>
    </Wrap>
  );
};

// 7 · LA ETIQUETA: el dorso del paquete con 5 renglones; `hi` = el que se marca (0 = van apareciendo y se marcan en orden)
export const Etiqueta: P<{ hi?: number }> = ({ d, hi = 0 }) => {
  const { f } = useT(0);
  const L: [string, string][] = [["WILD CAUGHT / FARM RAISED", "the big one"], ["PRODUCT OF: U.S.A. (ALASKA)", "the country"], ["SOCKEYE SALMON", "the name of the fish"],
    ["COLOR ADDED", "= farmed"], ["PREVIOUSLY FROZEN", "not a bad word"]];
  return (
    <Wrap f={f} d={d} bg={iceBed}>
      <div style={{ position: "absolute", left: 300, top: 70, width: 1320, height: 940, background: "#fff", borderRadius: 12, transform: "rotate(-1.2deg)",
        boxShadow: "0 40px 60px rgba(0,30,50,0.4), 0 6px 14px rgba(0,0,0,0.2)", ...rise(f, 0, 50) }}>
        <div style={{ height: 120, background: NAVY, borderRadius: "12px 12px 0 0", color: "#fff", fontFamily: LABEL, fontSize: 64, letterSpacing: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
          READ THE BACK
        </div>
        {L.map(([t, n], i) => {
          const at = hi ? 4 : 10 + i * 9, on = !hi || hi === i + 1, mark = hi ? hi === i + 1 : true;
          return (
            <div key={t} style={{ position: "absolute", left: 80, top: 170 + i * 150, width: 1160, height: 120, display: "flex", alignItems: "center", opacity: on ? 1 : 0.3 }}>
              <div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 56, color: INK, letterSpacing: 1, position: "relative" }}>
                {mark ? <div style={{ position: "absolute", left: -20, top: 6, bottom: 0, width: `calc(${100 * ez((f - at - 4) / 10)}% + 40px)`, background: "rgba(242,194,48,0.55)", borderRadius: 6 }} /> : null}
                <span style={{ position: "relative" }}>{t}</span>
              </div>
              <div style={{ marginLeft: "auto", fontFamily: HAND, fontSize: 52, color: RED, opacity: mark ? cl((f - at - 8) / 6) : 0 }}>{n}</div>
            </div>
          );
        })}
      </div>
    </Wrap>
  );
};

// 8 · LOS CINCO SALVAJES: cinco filetes del más rojo al más pálido con su nombre y apodo; `hi` resalta uno
export const CincoSalvajes: P<{ hi?: number }> = ({ d, hi = 0 }) => {
  const { f } = useT(0);
  const S: [string, string, string, string][] = [["KING", "chinook", "#E06A3A", "richest"], ["SOCKEYE", "red", "#B3182B", "deep red, firm"], ["COHO", "silver", "#E0543F", "milder"],
    ["KETA", "chum", "#EE9A7A", "lean, cheaper"], ["PINK", "the can", "#F4B3A0", "smallest"]];
  return (
    <Wrap f={f} d={d} bg={planks}>
      <div style={{ position: "absolute", left: 0, top: 50, width: 1920, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 80, color: "#fff", letterSpacing: 6, textShadow: "0 6px 16px rgba(0,0,0,0.5)" }}>
        THE FIVE WILD SALMON
      </div>
      {S.map(([n, nick, col, note], i) => {
        const at = hi ? 4 : 8 + i * 8, on = !hi || hi === i + 1;
        return (
          <div key={n} style={{ position: "absolute", left: 80 + i * 360, top: 230, width: 320, height: 720, ...rise(f, at, 40), opacity: cl((f - at) / 8) * (on ? 1 : 0.35),
            transform: `${rise(f, at, 40).transform} scale(${hi === i + 1 ? 1.06 : 1})` }}>
            <div style={{ position: "absolute", left: 0, top: 0, width: 320, height: 720, ...butcher, borderRadius: 18, boxShadow: "0 24px 40px rgba(0,0,0,0.45)" }} />
            <div style={{ position: "absolute", left: 30, top: 40, width: 260, height: 300, background: `repeating-linear-gradient(118deg, rgba(255,240,230,0.3) 0 3px, transparent 3px 30px), linear-gradient(160deg, ${col}, #7E0F1E)`,
              clipPath: "polygon(6% 14%, 40% 2%, 90% 8%, 100% 50%, 88% 94%, 40% 100%, 4% 80%)", filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.3))" }} />
            <div style={{ position: "absolute", left: 0, top: 380, width: 320, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 64, color: INK }}>{n}</div>
            <div style={{ position: "absolute", left: 0, top: 470, width: 320, textAlign: "center", fontFamily: HAND, fontSize: 50, color: NAVY }}>"{nick}"</div>
            <div style={{ position: "absolute", left: 20, top: 580, width: 280, textAlign: "center", fontFamily: HAND, fontSize: 44, color: RED }}>{note}</div>
          </div>
        );
      })}
    </Wrap>
  );
};

// 9 · LA PIZARRA DE PRECIOS: lo que cuesta cada uno por libra; el freezer y la lata se marcan con tiza
export const Precios: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const L: [string, string, boolean][] = [["Fresh farmed", "$9 – $14", false], ["Fresh wild, in season", "$15 – $25", false], ["King salmon", "$30 +", false],
    ["Frozen wild sockeye", "$10 – $11", true], ["Can of wild pink", "a few $", true]];
  return (
    <Wrap f={f} d={d} bg={planks}>
      <div style={{ position: "absolute", left: 240, top: 60, width: 1440, height: 960, ...chalkboard, border: "26px solid #6B4A26", borderRadius: 14, boxShadow: "0 40px 60px rgba(0,0,0,0.5)", ...rise(f, 0, 40) }}>
        <div style={{ textAlign: "center", marginTop: 30, fontFamily: HAND, fontSize: 96, color: CHALK }}>Salmon, per pound</div>
        {L.map(([n, p, star], i) => {
          const at = 10 + i * 9;
          return (
            <div key={n} style={{ position: "absolute", left: 90, top: 200 + i * 140, width: 1210, display: "flex", alignItems: "baseline", opacity: cl((f - at) / 8) }}>
              <div style={{ fontFamily: HAND, fontSize: 72, color: CHALK, whiteSpace: "nowrap", clipPath: `inset(0 ${100 - 100 * ez((f - at) / 12)}% 0 0)` }}>{n}</div>
              <div style={{ flex: 1, margin: "0 24px", borderBottom: "5px dotted rgba(244,241,232,0.45)" }} />
              <div style={{ fontFamily: HAND, fontSize: 80, color: star ? GOLD : CHALK, fontWeight: 700 }}>{p}</div>
              {star ? <div style={{ position: "absolute", left: -30, top: -10, width: 1270, height: 120, border: `6px solid ${GOLD}`, borderRadius: 60,
                clipPath: `inset(0 ${100 - 100 * ez((f - 64 - i * 4) / 12)}% 0 0)` }} /> : null}
            </div>
          );
        })}
      </div>
    </Wrap>
  );
};

// 10 · ¿ESTÁ BUENO? cuatro chequeos (oler, apretar, bordes, escarcha); `hi` resalta uno
export const Chequeo: P<{ hi?: number }> = ({ d, hi = 0 }) => {
  const { f } = useT(0);
  const C: [string, string][] = [["SMELL", "clean, cold water"], ["PRESS", "springs back"], ["EDGES", "wet & shiny"], ["THE BAG", "no frost inside"]];
  return (
    <Wrap f={f} d={d} bg={steel}>
      <div style={{ position: "absolute", left: 0, top: 60, width: 1920, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 84, color: INK, letterSpacing: 6 }}>IS IT ANY GOOD?</div>
      {C.map(([a, b], i) => {
        const at = hi ? 4 : 8 + i * 9, on = !hi || hi === i + 1;
        const x = 150 + (i % 2) * 830, y = 230 + Math.floor(i / 2) * 390;
        return (
          <div key={a} style={{ position: "absolute", left: x, top: y, width: 790, height: 340, ...butcher, borderRadius: 24, boxShadow: on ? "0 26px 44px rgba(0,0,0,0.4)" : "0 6px 10px rgba(0,0,0,0.2)",
            ...rise(f, at, 30), opacity: cl((f - at) / 8) * (on ? 1 : 0.35) }}>
            <div style={{ position: "absolute", left: 40, top: 40, width: 120, height: 120, borderRadius: 60, background: on ? "#2E8B57" : "#9AA", color: "#fff", fontFamily: LABEL, fontWeight: 700,
              fontSize: 76, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${on ? 0.6 + 0.4 * sp(f, at + 6, 9, 170) : 1})` }}>✓</div>
            <div style={{ position: "absolute", left: 200, top: 46, fontFamily: LABEL, fontWeight: 700, fontSize: 84, color: INK, letterSpacing: 3 }}>{a}</div>
            <div style={{ position: "absolute", left: 200, top: 180, fontFamily: HAND, fontSize: 64, color: NAVY }}>{b}</div>
          </div>
        );
      })}
    </Wrap>
  );
};

// 11 · TARJETA DE RECETA: ficha vieja con ingredientes y pasos (blackened o patties)
export const Receta: P<{ cual?: "blackened" | "patties" }> = ({ d, cual = "blackened" }) => {
  const { f } = useT(0);
  const R = cual === "blackened"
    ? { t: "Blackened Salmon", i: ["Paprika", "Garlic powder", "Onion powder", "Cayenne", "Thyme · Oregano", "Black pepper · Salt"], s: "Cast iron, smoking hot · 2–3 min a side", foot: "dark outside, a little pink inside" }
    : { t: "Mama's Salmon Patties", i: ["1 big can pink salmon", "Soft bones mashed in", "1 egg", "Crushed saltines", "Chopped onion", "Pepper · hot sauce"], s: "Cast iron, a little oil · 3–4 min a side", foot: "golden brown · serve with grits" };
  return (
    <Wrap f={f} d={d} bg={planks}>
      <div style={{ position: "absolute", left: 330, top: 80, width: 1260, height: 900, background: "linear-gradient(175deg,#FFFDF5 0%,#F3EAD4 100%)", borderRadius: 10, transform: "rotate(-2deg)",
        boxShadow: "0 40px 60px rgba(0,0,0,0.5)", ...rise(f, 0, 50) }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", borderRadius: 10,
          background: "repeating-linear-gradient(180deg, transparent 0 74px, rgba(70,110,170,0.35) 74px 77px)", backgroundPosition: "0 150px" }} />
        <div style={{ position: "absolute", left: 120, top: 0, width: 4, height: "100%", background: "rgba(200,40,40,0.45)" }} />
        <div style={{ position: "absolute", left: 160, top: 40, fontFamily: HAND, fontSize: 104, color: RED }}>{R.t}</div>
        {R.i.map((x, k) => (
          <div key={x} style={{ position: "absolute", left: 180, top: 236 + k * 77, fontFamily: HAND, fontSize: 60, color: NAVY, opacity: cl((f - 10 - k * 6) / 6),
            clipPath: `inset(0 ${100 - 100 * ez((f - 10 - k * 6) / 10)}% 0 0)` }}>– {x}</div>
        ))}
        <div style={{ position: "absolute", left: 180, top: 236 + 6 * 77 + 10, fontFamily: HAND, fontSize: 60, color: INK, opacity: cl((f - 50) / 8) }}>{R.s}</div>
        <div style={{ position: "absolute", left: 520, top: 800, padding: "10px 30px", background: GOLD, fontFamily: LABEL, fontWeight: 700, fontSize: 42, color: INK, transform: "rotate(3deg)",
          boxShadow: "0 8px 16px rgba(0,0,0,0.25)", opacity: cl((f - 60) / 8) }}>{R.foot.toUpperCase()}</div>
      </div>
    </Wrap>
  );
};

// 12 · LA TAREA: el paquete dado vuelta con los DOS renglones que hay que encontrar
export const Tarea: P<{}> = ({ d }) => {
  const { f } = useT(0);
  return (
    <Wrap f={f} d={d} bg={chalkboard}>
      <div style={{ position: "absolute", left: 0, top: 70, width: 1920, textAlign: "center", fontFamily: HAND, fontSize: 100, color: CHALK }}>Your homework</div>
      {[["1", "FARM RAISED or WILD CAUGHT"], ["2", "THE COUNTRY"]].map(([n, t], i) => {
        const at = 10 + i * 14;
        return (
          <div key={n} style={{ position: "absolute", left: 260, top: 330 + i * 270, width: 1400, height: 200, ...butcher, borderRadius: 20, display: "flex", alignItems: "center",
            boxShadow: "0 24px 40px rgba(0,0,0,0.45)", ...rise(f, at, 30) }}>
            <div style={{ width: 150, height: 150, marginLeft: 30, borderRadius: 75, background: RED, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 96, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
            <div style={{ marginLeft: 50, fontFamily: LABEL, fontWeight: 700, fontSize: 76, color: INK, letterSpacing: 2 }}>{t}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 0, top: 900, width: 1920, textAlign: "center", fontFamily: HAND, fontSize: 64, color: GOLD, opacity: cl((f - 44) / 8) }}>Just read them once.</div>
    </Wrap>
  );
};

// 13 · SUSHI: crudo = casi siempre de criadero; salvaje crudo sólo si vino congelado para sushi
export const Sushi: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const box = (x: number, at: number, h: string, t: string, ok: boolean) => (
    <div style={{ position: "absolute", left: x, top: 250, width: 760, height: 560, ...butcher, borderRadius: 24, boxShadow: "0 30px 50px rgba(0,0,0,0.45)", ...rise(f, at, 40) }}>
      <div style={{ height: 130, borderRadius: "24px 24px 0 0", background: ok ? "#2E8B57" : RED, color: "#fff", fontFamily: LABEL, fontWeight: 700, fontSize: 70, letterSpacing: 3,
        display: "flex", alignItems: "center", justifyContent: "center" }}>{h}</div>
      <div style={{ padding: "50px 60px", fontFamily: HAND, fontSize: 64, color: INK, lineHeight: 1.25, whiteSpace: "pre-line" }}>{t}</div>
    </div>
  );
  return (
    <Wrap f={f} d={d} bg={steel}>
      <div style={{ position: "absolute", left: 0, top: 70, width: 1920, textAlign: "center", fontFamily: LABEL, fontWeight: 700, fontSize: 90, color: INK, letterSpacing: 6 }}>EATING IT RAW?</div>
      {box(150, 6, "FARMED", "Eats pellets\nfar less parasite risk\nwhat sushi bars use", true)}
      {box(1010, 16, "WILD", "Eats wild shrimp\nmust be frozen hard first\nor cook it", false)}
    </Wrap>
  );
};
