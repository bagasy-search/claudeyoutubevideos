// HzWhereToSell — mapa de caminos sobre un tablero manila clavado encima de la foto del objeto: del objeto salen
// caminos punteados (se dibujan) hasta cada lugar de venta, con lo que se lleva cada uno; el recomendado lleva sello.
// Props: bed, item, routes[{name, take, note?}], best (índice), stamp.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { HZ, LABEL, SERIF, TYPE, manilaBg } from "./HzTheme";
import { HzBed, Stamp, Tag, ease, useIn } from "./HzParts";

export type Route = { name: string; take: string; note?: string };

export const HzWhereToSell: React.FC<{ bed?: string; item: string; routes: Route[]; best?: number; stamp?: string; seed?: number }> = ({ bed, item, routes, best = -1, stamp = "start here", seed = 21 }) => {
  const f = useCurrentFrame();
  const inn = useIn(0, 16, 120);
  const n = routes.length;
  const ox = 330, oy = 540;
  const pts = routes.map((_, i) => ({ x: 1250, y: n === 1 ? 540 : 200 + (i * 680) / (n - 1) }));
  return (
    <AbsoluteFill>
      <HzBed src={bed} seed={seed} dim={0.25} blur={2} />
      <div style={{ position: "absolute", inset: 50, ...manilaBg(), borderRadius: 10, boxShadow: `0 30px 60px ${HZ.shadow}`, transform: `scale(${interpolate(inn, [0, 1], [0.92, 1])})`, opacity: inn }}>
        <div style={{ position: "absolute", left: 60, top: 36 }}><div style={{ fontFamily: LABEL, fontWeight: 700, fontSize: 34, letterSpacing: 8, color: HZ.red, textTransform: "uppercase" }}>where to sell it</div></div>
        <svg style={{ position: "absolute", inset: 0 }} width="1820" height="980" viewBox="0 0 1820 980">
          {pts.map((p, i) => {
            const a = 18 + i * 12; const d = interpolate(f, [a, a + 22], [1, 0], ease);
            const mx = (ox + p.x) / 2;
            return <path key={i} d={`M ${ox + 200} ${oy - 50} C ${mx} ${oy - 50}, ${mx} ${p.y - 50}, ${p.x - 40} ${p.y - 50}`} fill="none" stroke={i === best ? HZ.red : HZ.inkSoft} strokeWidth={i === best ? 8 : 5} strokeDasharray="14 12" pathLength={1000} strokeDashoffset={d * 1000} opacity={0.85} />;
          })}
        </svg>
        <div style={{ position: "absolute", left: 120, top: oy - 50 - 140 }}>
          <Tag w={420} h={240}><div style={{ fontFamily: SERIF, fontSize: 60, color: HZ.ink, lineHeight: 1.05 }}>{item}</div></Tag>
        </div>
        {routes.map((r, i) => {
          const a = 30 + i * 12; const op = interpolate(f, [a, a + 8], [0, 1], ease);
          return (
            <div key={i} style={{ position: "absolute", left: pts[i].x - 40, top: pts[i].y - 50 - 70, width: 520, opacity: op, transform: `translateX(${(1 - op) * 40}px)` }}>
              <div style={{ background: HZ.paper, borderLeft: `10px solid ${i === best ? HZ.red : HZ.gold}`, padding: "16px 24px", boxShadow: `0 12px 24px ${HZ.shadow}` }}>
                <div style={{ fontFamily: SERIF, fontSize: 46, color: HZ.ink, lineHeight: 1.05 }}>{r.name}</div>
                <div style={{ fontFamily: TYPE, fontSize: 30, color: i === best ? HZ.red : HZ.inkSoft }}>{r.take}</div>
                {r.note ? <div style={{ fontFamily: TYPE, fontSize: 24, color: HZ.inkSoft }}>{r.note}</div> : null}
              </div>
              {i === best ? <div style={{ position: "absolute", right: -40, top: -46 }}><Stamp text={stamp} at={a + 26} size={44} rot={8} /></div> : null}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
