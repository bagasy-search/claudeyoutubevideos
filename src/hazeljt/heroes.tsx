// ── HÉROES de Hazel Appraises (hazeljt, 16-oct): componentes PURO CSS anclados a su frase (el test de 10 s de las joyas).
// Materiales dibujados con gradientes: terciopelo de joyero, latón, lino, etiqueta de precio de feria, papel de tasación.
import React from "react";
import { AbsoluteFill } from "remotion";
import { sp, cl, ez, useT, P, LABEL, HAND, SERIF } from "../lkit/core";

const RED = "#C8202B", INK = "#2A211C", BRASS = "#C9A24A", LINEN = "#F3ECDD", GREEN = "#2F6B3F", VEL = "#5A1424";
const velvet: React.CSSProperties = {
  background: `radial-gradient(ellipse at 50% 30%, #8A2438 0%, ${VEL} 55%, #2E0912 100%)`,
};
const linen: React.CSSProperties = {
  background: `repeating-linear-gradient(0deg, rgba(90,70,40,0.035) 0 1px, transparent 1px 4px),
    repeating-linear-gradient(90deg, rgba(90,70,40,0.035) 0 1px, transparent 1px 4px),
    linear-gradient(160deg, #FAF5EA 0%, ${LINEN} 60%, #E6DAC2 100%)`,
};
const card: React.CSSProperties = {
  background: "linear-gradient(170deg, #FFFDF7 0%, #F6EFDF 100%)", borderRadius: 10,
  boxShadow: "0 28px 50px rgba(30,10,5,0.45), 0 4px 10px rgba(30,10,5,0.3)",
};
const brass: React.CSSProperties = {
  background: "linear-gradient(135deg, #F3D98B 0%, #C9A24A 35%, #8F6C22 65%, #E6C46F 100%)",
};
const full: React.CSSProperties = { position: "absolute", left: 0, top: 0, width: 1920, height: 1080 };
const rise = (f: number, at: number, dy = 40) => ({ opacity: cl((f - at) / 9), transform: `translateY(${(1 - sp(f, at, 14, 120)) * dy}px)` });
const drift = (f: number, d: number) => `scale(${1.03 - 0.03 * cl(f / Math.max(1, d))})`;
const Wrap: React.FC<{ f: number; d: number; bg: React.CSSProperties; children: React.ReactNode }> = ({ f, d, bg, children }) => (
  <AbsoluteFill style={{ overflow: "hidden", ...bg }}>
    <div style={{ ...full, transform: drift(f, d), transformOrigin: "50% 50%" }}>{children}</div>
  </AbsoluteFill>
);
const Banner: React.FC<{ txt: string; f: number; at: number; top?: number; size?: number }> = ({ txt, f, at, top = 860, size = 84 }) => (
  <div style={{ position: "absolute", left: 0, top, width: 1920, height: size * 1.6, background: RED, display: "flex", alignItems: "center", justifyContent: "center",
    transform: `scaleX(${ez((f - at) / 10)})`, boxShadow: "0 10px 30px rgba(0,0,0,0.35)" }}>
    <div style={{ color: "#fff", fontFamily: LABEL, fontWeight: 800, fontSize: size, letterSpacing: 3, opacity: cl((f - at - 6) / 6) }}>{txt}</div>
  </div>
);

const CHECKS = ["WEIGHT", "A NAME", "METAL MARK", "THE CLASP", "THE STONES", "MAGNET", "THE LOUPE"];

// 1 · LISTA DE 7: tarjeta de tasación con los 7 chequeos; `hi` = el que se resalta (0 = todos van apareciendo)
export const SieteChequeos: P<{ hi?: number; titulo?: string }> = ({ d, hi = 0, titulo = "THE 10-SECOND TEST" }) => {
  const { f } = useT(0);
  return (
    <Wrap f={f} d={d} bg={velvet}>
      <div style={{ position: "absolute", left: 460, top: 70, width: 1000, height: 940, ...card, transform: "rotate(-1deg)", ...rise(f, 0, 50) }}>
        <div style={{ textAlign: "center", marginTop: 44, color: RED, fontFamily: LABEL, fontWeight: 800, fontSize: 70, letterSpacing: 3 }}>{titulo}</div>
        <div style={{ margin: "14px auto 0", width: 760, height: 4, background: BRASS }} />
        {CHECKS.map((c, i) => {
          const at = hi ? 4 : 8 + i * 5;
          const on = !hi || hi === i + 1;
          return (
            <div key={c} style={{ position: "absolute", left: 120, top: 190 + i * 100, display: "flex", alignItems: "center", gap: 34, ...rise(f, at, 24),
              opacity: cl((f - at) / 8) * (on ? 1 : 0.32) }}>
              <div style={{ width: 74, height: 74, borderRadius: 37, ...(on ? brass : { background: "#D8CFBF" }), color: INK, fontFamily: LABEL, fontWeight: 800,
                fontSize: 48, display: "flex", alignItems: "center", justifyContent: "center", transform: hi === i + 1 ? `scale(${1 + 0.12 * sp(f, 8, 8, 160)})` : undefined }}>{i + 1}</div>
              <div style={{ color: INK, fontFamily: SERIF, fontSize: 64, fontWeight: hi === i + 1 ? 700 : 500 }}>{c}</div>
            </div>
          );
        })}
      </div>
    </Wrap>
  );
};

// 2 · CRONÓMETRO: 10 segundos que corren con aguja
export const Diez: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const s = Math.min(10, Math.floor(cl((f - 6) / Math.max(30, d - 20)) * 10.99));
  const ang = cl((f - 6) / Math.max(30, d - 20)) * 360;
  return (
    <Wrap f={f} d={d} bg={linen}>
      <div style={{ position: "absolute", left: 560, top: 150, width: 640, height: 640, borderRadius: 320, background: "radial-gradient(circle at 40% 35%, #FFFFFF, #ECE3D0)",
        border: `22px solid ${INK}`, boxShadow: "0 30px 60px rgba(40,20,5,0.35)", ...rise(f, 0, 40) }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} style={{ position: "absolute", left: 298, top: 18, width: 6, height: 40, background: INK, transformOrigin: "3px 282px", transform: `rotate(${i * 36}deg)` }} />
        ))}
        <div style={{ position: "absolute", left: 293, top: 60, width: 14, height: 250, background: RED, borderRadius: 7, transformOrigin: "7px 240px", transform: `rotate(${ang}deg)` }} />
        <div style={{ position: "absolute", left: 270, top: 270, width: 60, height: 60, borderRadius: 30, background: INK }} />
      </div>
      <div style={{ position: "absolute", left: 1290, top: 300, color: RED, fontFamily: LABEL, fontWeight: 800, fontSize: 260, lineHeight: 1 }}>{s}</div>
      <div style={{ position: "absolute", left: 1300, top: 570, color: INK, fontFamily: LABEL, fontWeight: 700, fontSize: 64, letterSpacing: 3 }}>SECONDS</div>
      <Banner txt="TURN IT OVER" f={f} at={18} top={880} size={74} />
    </Wrap>
  );
};

// 3 · BALANZA: plata maciza (pesada) contra enchapado (liviano) + "Shine lies. Weight tells the truth."
export const Balanza: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const tilt = 9 * sp(f, 10, 9, 70);
  return (
    <Wrap f={f} d={d} bg={linen}>
      <div style={{ position: "absolute", left: 950, top: 250, width: 20, height: 520, ...brass, borderRadius: 6 }} />
      <div style={{ position: "absolute", left: 860, top: 760, width: 200, height: 40, ...brass, borderRadius: 10 }} />
      <div style={{ position: "absolute", left: 360, top: 240, width: 1200, height: 0, transform: `rotate(${-tilt}deg)`, transformOrigin: "600px 0" }}>
        <div style={{ position: "absolute", left: 0, top: -8, width: 1200, height: 16, ...brass, borderRadius: 8 }} />
        {[0, 1].map((i) => (
          <div key={i} style={{ position: "absolute", left: i ? 1000 : 0, top: 0, width: 200, transform: `rotate(${tilt}deg)`, transformOrigin: "100px 0" }}>
            <div style={{ position: "absolute", left: 98, top: 0, width: 4, height: 220, background: "#8F6C22" }} />
            <div style={{ position: "absolute", left: -30, top: 220, width: 260, height: 50, borderRadius: "0 0 130px 130px", ...brass }} />
            <div style={{ position: "absolute", left: -10, top: 150, width: 220, textAlign: "center", fontFamily: LABEL, fontWeight: 800, fontSize: 44,
              color: i ? INK : "#fff", background: i ? "#E8D9A8" : "#8C949A", borderRadius: 8, padding: "8px 0" }}>{i ? "PLATED" : "STERLING"}</div>
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 0, top: 860, width: 1920, textAlign: "center", fontFamily: HAND, fontSize: 104, color: RED, ...rise(f, 22, 20) }}>
        Shine lies. Weight tells the truth.
      </div>
    </Wrap>
  );
};

// 4 · NOMBRES: placa de latón grabada con las firmas que valen (aparecen de a una)
export const Firmas: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const N = ["TRIFARI", "EISENBERG", "MIRIAM HASKELL", "HOBE", "BOUCHER", "SCHIAPARELLI", "WEISS", "CORO CRAFT", "KRAMER", "HATTIE CARNEGIE"];
  return (
    <Wrap f={f} d={d} bg={velvet}>
      <div style={{ position: "absolute", left: 0, top: 70, width: 1920, textAlign: "center", color: "#F6E7B8", fontFamily: LABEL, fontWeight: 800, fontSize: 64, letterSpacing: 6, ...rise(f, 0, 20) }}>
        TURN IT OVER · LOOK FOR A NAME
      </div>
      {N.map((n, i) => {
        const at = 6 + i * Math.max(3, Math.min(8, (d - 40) / N.length));
        const col = i % 2, row = Math.floor(i / 2);
        return (
          <div key={n} style={{ position: "absolute", left: 230 + col * 760, top: 210 + row * 158, width: 700, height: 120, ...brass, borderRadius: 60,
            display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 24px rgba(0,0,0,0.45), inset 0 2px 0 rgba(255,255,255,0.5)",
            opacity: cl((f - at) / 6), transform: `scale(${0.7 + 0.3 * sp(f, at, 10, 160)})` }}>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 56, color: "#4A3410", letterSpacing: 4, textShadow: "0 1px 0 rgba(255,255,255,0.45)" }}>{n}</div>
          </div>
        );
      })}
    </Wrap>
  );
};

// 5 · ETIQUETA DE VENDIDO: etiqueta de feria atada con hilo, "SOLD" + rango (props)
export const Vendido: P<{ que: string; precio: string; nota?: string }> = ({ d, que, precio, nota }) => {
  const { f } = useT(0);
  const sw = Math.sin(f / 14) * 2.2 * (1 - cl(f / 90));
  return (
    <Wrap f={f} d={d} bg={velvet}>
      <div style={{ position: "absolute", left: 960, top: -20, width: 3, height: 210, background: "#E9E2CF" }} />
      <div style={{ position: "absolute", left: 470, top: 180, width: 980, height: 620, transform: `rotate(${-3 + sw}deg)`, transformOrigin: "490px 0", ...rise(f, 0, 60) }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(170deg, #FBF4E0, #EADBB7)", borderRadius: "40px 40px 18px 18px",
          clipPath: "polygon(12% 0, 88% 0, 100% 14%, 100% 100%, 0 100%, 0 14%)", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", left: 460, top: 34, width: 60, height: 60, borderRadius: 30, background: VEL, boxShadow: "inset 0 4px 8px rgba(0,0,0,0.5)" }} />
        <div style={{ position: "absolute", left: 0, top: 130, width: 980, textAlign: "center", color: INK, fontFamily: SERIF, fontSize: 70, fontWeight: 700, padding: "0 50px", boxSizing: "border-box" }}>{que}</div>
        <div style={{ position: "absolute", left: 0, top: 260, width: 980, textAlign: "center", color: GREEN, fontFamily: LABEL, fontWeight: 800, fontSize: 150, ...rise(f, 8, 30) }}>{precio}</div>
        {nota ? <div style={{ position: "absolute", left: 0, top: 470, width: 980, textAlign: "center", color: "#6B6257", fontFamily: HAND, fontSize: 64, ...rise(f, 16, 16) }}>{nota}</div> : null}
      </div>
      <div style={{ position: "absolute", left: 1270, top: 140, padding: "14px 40px", border: `10px double ${RED}`, color: RED, fontFamily: LABEL, fontWeight: 800, fontSize: 96,
        letterSpacing: 6, transform: `rotate(12deg) scale(${1.8 - 0.8 * sp(f, 12, 11, 180)})`, opacity: cl((f - 12) / 3), background: "rgba(255,250,240,0.85)" }}>SOLD</div>
    </Wrap>
  );
};

// 6 · MARCAS DEL METAL: dos columnas, número solo (oro/plata maciza) contra letras (una capa)
export const Marcas: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const L = [["10K · 417", "10 karat gold"], ["14K · 585", "14 karat gold"], ["18K · 750", "18 karat gold"], ["925 · STERLING", "solid silver"]];
  const Rr = [["GF", "gold filled"], ["GP · GE", "gold plated"], ["HGE", "heavy plate"], ["RGP", "rolled gold plate"], ["1/20 12K", "thin layer"]];
  const Col = ({ x, t, c, rows, at }: { x: number; t: string; c: string; rows: string[][]; at: number }) => (
    <div style={{ position: "absolute", left: x, top: 120, width: 780, height: 820, ...card, ...rise(f, at, 50) }}>
      <div style={{ height: 120, background: c, borderRadius: "10px 10px 0 0", color: "#fff", fontFamily: LABEL, fontWeight: 800, fontSize: 62, display: "flex", alignItems: "center", justifyContent: "center", letterSpacing: 3 }}>{t}</div>
      {rows.map(([a, b], i) => (
        <div key={a} style={{ display: "flex", alignItems: "baseline", gap: 26, padding: "26px 50px 0", opacity: cl((f - at - 8 - i * 5) / 6) }}>
          <div style={{ fontFamily: LABEL, fontWeight: 800, fontSize: 64, color: INK, minWidth: 380 }}>{a}</div>
          <div style={{ fontFamily: HAND, fontSize: 54, color: "#6B6257" }}>{b}</div>
        </div>
      ))}
    </div>
  );
  return (
    <Wrap f={f} d={d} bg={linen}>
      <Col x={130} t="SOLID ✓" c={GREEN} rows={L} at={2} />
      <Col x={1010} t="JUST A COAT" c={RED} rows={Rr} at={Math.min(40, d * 0.35)} />
    </Wrap>
  );
};

// 7 · CIERRES: línea de tiempo con tres cierres dibujados
export const Cierres: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const steps = [
    { t: "C-CLASP", y: "before ~1910", draw: <div style={{ width: 150, height: 150, border: `14px solid ${BRASS}`, borderRadius: 75, borderRightColor: "transparent", transform: "rotate(-30deg)" }} /> },
    { t: "TROMBONE", y: "early 1900s", draw: <div style={{ width: 200, height: 40, ...brass, borderRadius: 20, boxShadow: "60px 0 0 -8px #8F6C22" }} /> },
    { t: "SAFETY CATCH", y: "1940s on", draw: <div style={{ width: 120, height: 120, ...brass, borderRadius: 24, boxShadow: "inset 0 0 0 16px #8F6C22" }} /> },
  ];
  return (
    <Wrap f={f} d={d} bg={velvet}>
      <div style={{ position: "absolute", left: 200, top: 560, width: 1520, height: 8, background: "#F6E7B8", transform: `scaleX(${ez((f - 2) / 24)})`, transformOrigin: "0 50%" }} />
      {steps.map((s, i) => (
        <div key={s.t} style={{ position: "absolute", left: 210 + i * 520, top: 200, width: 460, textAlign: "center", ...rise(f, 8 + i * 9, 40) }}>
          <div style={{ height: 230, display: "flex", alignItems: "center", justifyContent: "center" }}>{s.draw}</div>
          <div style={{ margin: "100px auto 0", width: 40, height: 40, borderRadius: 20, background: RED, border: "6px solid #F6E7B8" }} />
          <div style={{ marginTop: 30, color: "#fff", fontFamily: LABEL, fontWeight: 800, fontSize: 60, letterSpacing: 2 }}>{s.t}</div>
          <div style={{ color: "#F6E7B8", fontFamily: HAND, fontSize: 60 }}>{s.y}</div>
        </div>
      ))}
    </Wrap>
  );
};

// 8 · PIEDRAS: garras (bien) contra pegamento (mal), dibujado en corte
export const Garras: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const Stone = ({ x, prong, at }: { x: number; prong: boolean; at: number }) => (
    <div style={{ position: "absolute", left: x, top: 200, width: 700, height: 640, ...card, ...rise(f, at, 50) }}>
      <div style={{ position: "absolute", left: 230, top: 120, width: 240, height: 240, transform: "rotate(45deg)",
        background: "conic-gradient(from 20deg, #ffffff, #cfe7ff, #ffffff, #e9f3ff, #bcd9f5, #ffffff)", boxShadow: "0 0 40px rgba(160,200,255,0.8)" }} />
      {prong ? [0, 1, 2, 3].map((k) => (
        <div key={k} style={{ position: "absolute", left: 340 + Math.cos(k * Math.PI / 2) * 150 - 14, top: 240 + Math.sin(k * Math.PI / 2) * 150 - 14, width: 28, height: 60,
          ...brass, borderRadius: 14, transform: `rotate(${k * 90}deg)` }} />
      )) : <div style={{ position: "absolute", left: 210, top: 330, width: 280, height: 40, borderRadius: 20, background: "rgba(230,215,150,0.85)", filter: "blur(2px)" }} />}
      <div style={{ position: "absolute", left: 0, top: 470, width: 700, textAlign: "center", fontFamily: LABEL, fontWeight: 800, fontSize: 70, color: prong ? GREEN : RED }}>
        {prong ? "PRONGS ✓" : "GLUED ✗"}
      </div>
      <div style={{ position: "absolute", left: 0, top: 560, width: 700, textAlign: "center", fontFamily: HAND, fontSize: 52, color: "#6B6257" }}>
        {prong ? "little claws hold the stone" : "a ring of dried glue"}
      </div>
    </div>
  );
  return (
    <Wrap f={f} d={d} bg={linen}>
      <Stone x={180} prong at={2} />
      <Stone x={1040} prong={false} at={12} />
    </Wrap>
  );
};

// 9 · JULIANA: las 3 señas sin firma, tildándose
export const Juliana: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const S = ["Big chunky stones, open-back prongs", "Bracelets in five big sections", "Figure-eight connectors on the back"];
  return (
    <Wrap f={f} d={d} bg={velvet}>
      <div style={{ position: "absolute", left: 260, top: 110, width: 1400, height: 860, ...card, ...rise(f, 0, 50) }}>
        <div style={{ textAlign: "center", marginTop: 50, color: VEL, fontFamily: SERIF, fontStyle: "italic", fontSize: 110, fontWeight: 700 }}>“Juliana”</div>
        <div style={{ textAlign: "center", color: "#6B6257", fontFamily: LABEL, fontSize: 46, letterSpacing: 4 }}>NEVER SIGNED · LATE 50s – 60s</div>
        {S.map((s, i) => {
          const at = 14 + i * Math.max(10, (d - 40) / 3);
          return (
            <div key={s} style={{ position: "absolute", left: 120, top: 330 + i * 150, display: "flex", alignItems: "center", gap: 40, opacity: cl((f - at) / 6) }}>
              <div style={{ width: 90, height: 90, borderRadius: 14, border: `6px solid ${INK}`, display: "flex", alignItems: "center", justifyContent: "center",
                color: GREEN, fontFamily: LABEL, fontWeight: 900, fontSize: 84 }}><span style={{ transform: `scale(${sp(f, at + 4, 10, 170)})` }}>✓</span></div>
              <div style={{ fontFamily: SERIF, fontSize: 64, color: INK }}>{s}</div>
            </div>
          );
        })}
      </div>
    </Wrap>
  );
};

// 10 · IMÁN: imán de heladera sobre la cadena — "test the chain, not the clasp"
export const Iman: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const x = 1300 - 520 * ez((f - 6) / 20);
  return (
    <Wrap f={f} d={d} bg={linen}>
      <div style={{ position: "absolute", left: 140, top: 520, width: 1640, height: 40, borderRadius: 20,
        background: "repeating-linear-gradient(90deg, #E8C766 0 26px, #A9822F 26px 30px, #F5DC8E 30px 56px, #8F6C22 56px 60px)", boxShadow: "0 10px 20px rgba(0,0,0,0.25)" }} />
      <div style={{ position: "absolute", left: 1640, top: 500, width: 110, height: 80, borderRadius: 18, background: "linear-gradient(#B9C0C4, #6E767B)" }} />
      <div style={{ position: "absolute", left: 1600, top: 610, fontFamily: LABEL, fontWeight: 700, fontSize: 40, color: "#6B6257" }}>clasp (steel spring)</div>
      <div style={{ position: "absolute", left: x, top: 240, width: 200, height: 240, ...rise(f, 0, 30) }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 200, height: 170, borderRadius: "100px 100px 0 0", border: `56px solid ${RED}`, borderBottom: "none", boxSizing: "border-box" }} />
        <div style={{ position: "absolute", left: 0, top: 170, width: 56, height: 60, background: "#C9CED1" }} />
        <div style={{ position: "absolute", left: 144, top: 170, width: 56, height: 60, background: "#C9CED1" }} />
      </div>
      <div style={{ position: "absolute", left: 0, top: 120, width: 1920, textAlign: "center", fontFamily: LABEL, fontWeight: 800, fontSize: 70, color: INK, ...rise(f, 4, 20) }}>
        GOLD & SILVER DON'T STICK
      </div>
      <Banner txt="TEST THE CHAIN, NOT THE CLASP" f={f} at={24} top={800} size={78} />
    </Wrap>
  );
};

// 11 · PERLA: prueba del diente — áspera (real) contra lisa (vidrio/plástico)
export const Perla: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const P2 = ({ x, real, at }: { x: number; real: boolean; at: number }) => (
    <div style={{ position: "absolute", left: x, top: 180, width: 640, textAlign: "center", ...rise(f, at, 40) }}>
      <div style={{ margin: "0 auto", width: 380, height: 380, borderRadius: 190,
        background: real ? "radial-gradient(circle at 35% 30%, #FFFFFF 0%, #F1E9DD 35%, #D8CBB8 75%, #B9A890 100%)" : "radial-gradient(circle at 35% 30%, #FFFFFF 0%, #F5F2EE 50%, #DCD6CE 100%)",
        boxShadow: "0 30px 50px rgba(0,0,0,0.35)", position: "relative", overflow: "hidden" }}>
        {real ? <div style={{ position: "absolute", inset: 0, background: "repeating-radial-gradient(circle at 60% 60%, rgba(120,100,70,0.10) 0 2px, transparent 2px 7px)" }} /> : null}
      </div>
      <div style={{ marginTop: 50, fontFamily: LABEL, fontWeight: 800, fontSize: 76, color: real ? GREEN : RED }}>{real ? "GRITTY = REAL" : "SMOOTH = FAKE"}</div>
      <div style={{ fontFamily: HAND, fontSize: 56, color: "#F6E7B8" }}>{real ? "like fine sand" : "like a marble"}</div>
    </div>
  );
  return (
    <Wrap f={f} d={d} bg={velvet}>
      <P2 x={240} real at={2} />
      <P2 x={1040} real={false} at={12} />
    </Wrap>
  );
};

// 12 · PEDIDO vs VENDIDO: "ASKING $1,000" tachado, "SOLD $45" en verde
export const PedidoVendido: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const cut = ez((f - 14) / 10);
  return (
    <Wrap f={f} d={d} bg={linen}>
      <div style={{ position: "absolute", left: 200, top: 220, width: 700, height: 520, ...card, transform: "rotate(-2deg)", ...rise(f, 0, 40) }}>
        <div style={{ textAlign: "center", marginTop: 70, fontFamily: LABEL, fontWeight: 800, fontSize: 80, color: "#6B6257", letterSpacing: 4 }}>ASKING</div>
        <div style={{ textAlign: "center", marginTop: 40, fontFamily: LABEL, fontWeight: 800, fontSize: 170, color: "#6B6257" }}>$1,000</div>
        <div style={{ position: "absolute", left: 60, top: 300, width: 580 * cut, height: 18, background: RED, transform: "rotate(-8deg)", borderRadius: 9 }} />
      </div>
      <div style={{ position: "absolute", left: 1020, top: 220, width: 700, height: 520, ...card, transform: "rotate(2deg)", border: `8px solid ${GREEN}`, ...rise(f, 20, 40) }}>
        <div style={{ textAlign: "center", marginTop: 70, fontFamily: LABEL, fontWeight: 800, fontSize: 80, color: GREEN, letterSpacing: 4 }}>SOLD</div>
        <div style={{ textAlign: "center", marginTop: 40, fontFamily: LABEL, fontWeight: 800, fontSize: 170, color: GREEN }}>$45</div>
      </div>
      <Banner txt="LOOK AT WHAT SOLD" f={f} at={30} top={830} size={78} />
    </Wrap>
  );
};

// 13 · DÓNDE VENDER: tres cajas (por peso / de a una / en un lote)
export const DondeVender: P<{ hi?: number }> = ({ d, hi = 0 }) => {
  const { f } = useT(0);
  const B = [
    ["GOLD & SILVER", "By weight", "Scale you can see · two offers"],
    ["SIGNED PIECES", "One at a time", "Front, back & signature photos"],
    ["THE TANGLE", "As one lot", "Crafters love a mixed box"],
  ];
  return (
    <Wrap f={f} d={d} bg={velvet}>
      {B.map(([t, a, b], i) => {
        const on = !hi || hi === i + 1;
        return (
          <div key={t} style={{ position: "absolute", left: 120 + i * 580, top: 180, width: 520, height: 720, ...card, ...rise(f, 2 + i * 8, 50), opacity: cl((f - 2 - i * 8) / 8) * (on ? 1 : 0.4) }}>
            <div style={{ height: 130, ...(on ? brass : { background: "#D8CFBF" }), borderRadius: "10px 10px 0 0", display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: LABEL, fontWeight: 800, fontSize: 54, color: INK, letterSpacing: 2 }}>{t}</div>
            <div style={{ textAlign: "center", marginTop: 110, fontFamily: SERIF, fontWeight: 700, fontSize: 82, color: RED }}>{a}</div>
            <div style={{ textAlign: "center", margin: "60px 40px 0", fontFamily: HAND, fontSize: 56, color: "#6B6257", lineHeight: 1.15 }}>{b}</div>
          </div>
        );
      })}
    </Wrap>
  );
};

// 14 · NO VALE NADA: lista tachándose
export const NadaVale: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const L = ["Green or black plated chains", "Glued stones gone dark & cloudy", "Plastic beads from the 70s & 80s", "Modern mass-made pins"];
  return (
    <Wrap f={f} d={d} bg={linen}>
      <div style={{ position: "absolute", left: 0, top: 90, width: 1920, textAlign: "center", fontFamily: LABEL, fontWeight: 800, fontSize: 84, color: RED, letterSpacing: 3, ...rise(f, 0, 20) }}>
        NOT WORTH YOUR TIME
      </div>
      {L.map((s, i) => {
        const at = 8 + i * Math.max(8, (d - 30) / 4);
        return (
          <div key={s} style={{ position: "absolute", left: 300, top: 260 + i * 170, width: 1320, height: 130, ...card, display: "flex", alignItems: "center", ...rise(f, at, 30) }}>
            <div style={{ marginLeft: 50, fontFamily: SERIF, fontSize: 64, color: INK }}>{s}</div>
            <div style={{ position: "absolute", left: 30, top: 60, width: 1260 * ez((f - at - 8) / 10), height: 10, background: RED, borderRadius: 5 }} />
          </div>
        );
      })}
    </Wrap>
  );
};

// 15 · LA CUENTA: caja de $10 contra lo que sale separando
export const LaCuenta: P<{}> = ({ d }) => {
  const { f } = useT(0);
  const L = [["Broken 14K chain", "by weight"], ["2 sterling pieces", "by weight"], ["3 signed brooches", "one at a time"], ["Juliana bracelet", "on its own"], ["The rest", "one lot"]];
  return (
    <Wrap f={f} d={d} bg={velvet}>
      <div style={{ position: "absolute", left: 140, top: 260, width: 560, height: 520, ...card, ...rise(f, 0, 40), textAlign: "center" }}>
        <div style={{ marginTop: 80, fontFamily: LABEL, fontWeight: 800, fontSize: 66, color: "#6B6257" }}>YARD SALE BOX</div>
        <div style={{ marginTop: 40, fontFamily: LABEL, fontWeight: 800, fontSize: 200, color: RED }}>$10</div>
      </div>
      <div style={{ position: "absolute", left: 760, top: 120, width: 1020, height: 840, ...card }}>
        {L.map(([a, b], i) => {
          const at = 10 + i * Math.max(6, (d - 50) / 6);
          return (
            <div key={a} style={{ display: "flex", justifyContent: "space-between", padding: "36px 60px 0", opacity: cl((f - at) / 6) }}>
              <div style={{ fontFamily: SERIF, fontSize: 58, color: INK }}>{a}</div>
              <div style={{ fontFamily: HAND, fontSize: 54, color: "#6B6257" }}>{b}</div>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 60, top: 640, width: 900, height: 6, background: INK, transform: `scaleX(${ez((f - d * 0.6) / 10)})`, transformOrigin: "0 50%" }} />
        <div style={{ position: "absolute", left: 0, top: 680, width: 1020, textAlign: "center", fontFamily: LABEL, fontWeight: 800, fontSize: 86, color: GREEN, opacity: cl((f - d * 0.65) / 8) }}>
          SEVERAL HUNDRED
        </div>
      </div>
    </Wrap>
  );
};

// 16 · TAREA: tres piezas, siete chequeos
export const Tarea: P<{}> = ({ d }) => {
  const { f } = useT(0);
  return (
    <Wrap f={f} d={d} bg={linen}>
      <div style={{ position: "absolute", left: 0, top: 120, width: 1920, textAlign: "center", fontFamily: HAND, fontSize: 120, color: VEL, ...rise(f, 0, 20) }}>Tonight's homework</div>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: 360 + i * 420, top: 380, width: 340, height: 340, borderRadius: 170, ...velvet, border: `10px solid ${BRASS}`,
          display: "flex", alignItems: "center", justifyContent: "center", color: "#F6E7B8", fontFamily: LABEL, fontWeight: 800, fontSize: 160,
          transform: `scale(${sp(f, 8 + i * 6, 11, 150)})` }}>{i + 1}</div>
      ))}
      <div style={{ position: "absolute", left: 0, top: 800, width: 1920, textAlign: "center", fontFamily: LABEL, fontWeight: 800, fontSize: 76, color: INK, letterSpacing: 3, ...rise(f, 26, 20) }}>
        3 PIECES · 7 CHECKS
      </div>
    </Wrap>
  );
};
