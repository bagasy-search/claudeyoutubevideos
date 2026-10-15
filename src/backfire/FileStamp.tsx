// FileStamp.tsx — LA IDENTIDAD DEL CANAL: cada video es un expediente. Una carpeta manila REAL (foto)
// sobre el escritorio de Walt, la etiqueta escrita a máquina "CASE FILE Nº 05", el título del caso, y
// un SELLO que cae en la palabra justa. Se usa en la presentación (~1:00) y en cada cambio de acto
// ("PART 3 · THE RELEASE").
//
// ⛔ La carpeta es una FOTO (kit: img/wb_folder.jpg — carpeta manila sobre el escritorio de la estación
//    de campo, sin cara, sin marcas). La etiqueta se escribe encima. Sin foto cae a un papel liso.
// ⛔ Beats en palabras: `typeAt` = la etiqueta se tipea (letra por letra, 0,05 s c/u); `stampAt` = cae el sello.
import React from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { W, F_TYPE, F_BODY, useAbs, prog, Grade, Stamp, rgba, useOut } from "./Stage";

export const FileStamp: React.FC<{
  fileNo: string | number;   // 5 → "CASE FILE Nº 05"
  label?: string;            // reemplaza "CASE FILE Nº 05" (otros canales: "THE PART THEY LEFT OUT · Nº 01")
  title: string;             // "THE CANE TOAD" (corto, mayúsculas)
  sub?: string;              // "Queensland, Australia · 1935"
  part?: string;             // "PART 3 · THE RELEASE" (en cambios de acto)
  stamp?: string;            // "OPEN" · "BACKFIRED" · "STILL SPREADING" · "" sin sello
  folder?: string;           // foto real de la carpeta (def img/wb_folder.jpg)
  labelX?: number;          // centro de la etiqueta en % (def: centro de la carpeta de img/wb_folder.jpg)
  labelY?: number;
  typeAt?: number;
  stampAt?: number;
  bed?: string;
  t0?: number;
  durationInFrames?: number;
}> = ({ fileNo, label: labelTxt, title, sub, part, stamp = "OPEN", folder = "img/wb_folder.jpg", labelX = 47, labelY = 58, typeAt, stampAt, t0, durationInFrames }) => {
  const now = useAbs(t0);
  const start = t0 ?? 0;
  const out = useOut(durationInFrames);
  const ta = typeAt ?? start + 0.3;
  const label = labelTxt ?? `CASE FILE Nº ${String(fileNo).padStart(2, "0")}`;
  const typed = Math.max(0, Math.min(label.length, Math.floor((now - ta) / 0.05)));
  const tA = prog(now, ta + label.length * 0.05, 0.5);
  const sA = prog(now, ta + label.length * 0.05 + 0.4, 0.5);
  const st = prog(now, stampAt ?? ta + 1.9, 0.32);
  const z = 1.0 + 0.012 * Math.max(0, now - start);
  return (
    <AbsoluteFill style={{ backgroundColor: W.ink0, overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${Math.min(1.12, z).toFixed(4)})` }}>
        {folder ? <Img src={staticFile(folder)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.9)" }} /> : <AbsoluteFill style={{ background: W.manila }} />}
        <AbsoluteFill style={{ background: `radial-gradient(70% 60% at 50% 50%, transparent 40%, ${rgba(W.ink0, 0.55)} 100%)` }} />
        {/* etiqueta pegada en la carpeta */}
        <div style={{ position: "absolute", left: `${labelX}%`, top: `${labelY}%`, transform: "translate(-50%,-50%) rotate(-1.6deg)", width: 900, background: rgba(W.paper, 0.97), padding: "28px 44px 32px", boxShadow: "0 10px 26px rgba(0,0,0,.42)", opacity: out }}>
          <div style={{ fontFamily: F_TYPE, fontSize: 52, letterSpacing: 6, color: W.ink0 }}>{label.slice(0, typed)}<span style={{ opacity: typed < label.length && Math.floor(now * 3) % 2 === 0 ? 1 : 0 }}>▌</span></div>
          <div style={{ height: 3, background: rgba(W.ink0, 0.6), margin: "16px 0 20px" }} />
          <div style={{ fontFamily: F_BODY, fontWeight: 700, fontSize: title.length > 22 ? 58 : 76, lineHeight: 1.02, color: W.ink0, opacity: tA, transform: `translateY(${((1 - tA) * 10).toFixed(1)}px)` }}>{title}</div>
          {sub ? <div style={{ fontFamily: F_TYPE, fontSize: 36, color: rgba(W.ink0, 0.75), marginTop: 14, opacity: sA }}>{sub}</div> : null}
          {part ? <div style={{ fontFamily: F_TYPE, fontSize: 40, color: W.red, marginTop: 18, letterSpacing: 3, opacity: sA }}>{part}</div> : null}
        </div>
        {stamp ? <Stamp text={stamp} p={st * out} x={labelX + 17} y={labelY + 15} size={88} rot={-11} color={W.red} /> : null}
      </AbsoluteFill>
      <Grade vignette={0.45} />
    </AbsoluteFill>
  );
};
