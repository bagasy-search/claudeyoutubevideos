// suengano · root unificado 1920x1080. Une apertura + bloques 65-974 s en una sola linea de tiempo.
// Tiempo original (video) -> tiempo del root: t >= 65 -> t - 20,18 (el hook cortado y la apertura lo cambian).
import React from "react";
import { Audio, AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { CountCard, Clipboard, ShelfTag } from "../repkit/Kit";
import avwin from "./avwin.json";
import s65 from "../../public/suengano_65_400.json";
import s400 from "../../public/suengano_400_540.json";
import s540 from "../../public/suengano_540_680.json";
import s680 from "../../public/suengano_680_820.json";
import s820 from "../../public/suengano_820_974.json";

type Shot = { from: number; to: number; kind: string; file: string | null; zoom?: number; motive?: string; clip?: number };
type Win = { n: string; ms: number; me: number; startFrom: number };
const WINS: Win[] = (avwin as unknown as { win: Win[] }).win;
const FPS = 30;
const SHIFT = 20.18;
const fr = (s: number) => Math.round(s * FPS);
const rel = (orig: number) => orig - SHIFT;
const REEL = staticFile("avatar/suengano_reel0_cfr.mp4");

// duraciones de los clips del pool (para estirar con playbackRate, igual que en los bloques)
const CLIP_S: Record<string, number> = {
  "broll/suengano/s265.mp4": 9.4667, "broll/suengano/s087.mp4": 10.8, "broll/suengano/s236.mp4": 7.5409,
  "broll/suengano/s295.mp4": 9.84, "broll/suengano/s339.mp4": 7.8, "broll/suengano/s373.mp4": 7.72,
  "broll/suengano/s127.mp4": 9.133, "broll/suengano/s165.mp4": 10.44, "broll/suengano/s409.mp4": 10.32,
  "broll/suengano/w072.mp4": 5.5055, "broll/suengano/z098.mp4": 11.4667, "broll/suengano/s155.mp4": 10.16,
};

const avStart = (t: number): number => {
  const w = WINS.find((x) => x.ms - 0.01 <= t && x.me >= t);
  if (!w) throw new Error("sin ventana AV para " + t);
  return w.startFrom + (t - w.ms);
};

const compC = (s: Shot, d: number): React.ReactNode => {
  const f = s.from;
  const near = (x: number) => Math.abs(f - x) < 0.1;
  if (near(184.72)) return <CountCard from={0} dur={d} n={1} of={3} word="TRAMPA" title="pan recién horneado en la entrada" bg="img/suengano/c_bg_s339.png" t={2} />;
  if (near(250.55)) return <Clipboard from={0} dur={d} title="Lista de compras" bg="img/suengano/N574.png" lines={[{ txt: "Leche", t: 1 }, { txt: "Pan", t: 4 }, { txt: "Arroz", t: 7 }]} />;
  if (near(326.85)) return <ShelfTag from={0} dur={d} bg="img/suengano/c_bg_s409.png" at={[960, 470]} product="Arroz blanco" price={1240} unitLine="$ 1.240 el kg" tPrint={1.2} tLupa={4} tCircle={7} />;
  if (near(468.23)) return <CountCard from={0} dur={d} n={1} of={2} word="TRUCO" title="la primera cifra engaña" bg="img/suengano/caja_a.png" t={1.5} />;
  if (near(475.5)) return <Clipboard from={0} dur={d} title="Cuenta corta" bg="img/suengano/N574.png" lines={[{ txt: "2.999", t: 1 }, { txt: "3.000", t: 3 }, { txt: "suma uno", t: 5 }]} />;
  if (near(615.38)) return <CountCard from={0} dur={d} n={9} of={17} word="ENGAÑO" title="el segundo no era gratis" bg="img/suengano/oferta_b2.png" t={1.5} />;
  if (near(623.0)) return <Clipboard from={0} dur={d} title="Precio por unidad" bg="img/suengano/N574.png" lines={[{ txt: "precio grande", t: 1 }, { txt: "precio por kilo", t: 3 }, { txt: "compara", t: 5 }]} />;
  if (near(630.0)) return <ShelfTag from={0} dur={d} bg="img/suengano/N145.png" at={[960, 470]} product="Café molido" price={1240} unitLine="$ 1.240 el kg" tPrint={0.8} tLupa={3.2} tCircle={5.5} />;
  if (near(771.81)) return <ShelfTag from={0} dur={d} bg="img/suengano/N145.png" at={[960, 470]} product="Chocolates" price={1500} unitLine="$ 1.500 el kg" tPrint={0.8} tLupa={3.2} tCircle={5.5} />;
  if (near(778.9)) return <Clipboard from={0} dur={d} title="Golosinas" bg="img/suengano/N574.png" lines={[{ txt: "a la altura del chico", t: 1 }, { txt: "pon el carrito lejos", t: 3 }, { txt: "avisa antes de comprar", t: 5 }]} />;
  if (near(914.81)) return <CountCard from={0} dur={d} n={1} of={3} word="TRUCO" title="antes de salir mira el ticket" bg="img/suengano/ticket_blank.png" t={1.5} />;
  if (near(930.0)) return <CountCard from={0} dur={d} n={2} of={3} word="TRUCO" title="busca el producto y compara" bg="img/suengano/caja_b.png" t={1.5} />;
  if (near(944.0)) return <CountCard from={0} dur={d} n={3} of={3} word="TRUCO" title="pide que lo verifiquen" bg="img/suengano/lista_recap.png" t={1.5} />;
  return null;
};

const Shots: React.FC<{ list: Shot[] }> = ({ list }) => (
  <>
    {list.map((s, i) => {
      const from = fr(rel(s.from));
      const dur = fr(s.to) - fr(s.from);
      const d = s.to - s.from;
      if (s.kind === "AV") {
        return (
          <Sequence key={"av" + i} from={from} durationInFrames={dur}>
            <AbsoluteFill style={{ backgroundColor: "#000" }}>
              <OffthreadVideo src={REEL} startFrom={Math.round(avStart(s.from) * FPS)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </AbsoluteFill>
          </Sequence>
        );
      }
      if (s.kind === "C") {
        const comp = compC(s, d);
        if (!comp) return null;
        return (
          <Sequence key={"c" + i} from={from} durationInFrames={dur}>
            <AbsoluteFill style={{ overflow: "hidden" }}>{comp}</AbsoluteFill>
          </Sequence>
        );
      }
      if (!s.file) return null;
      const isVideo = s.file.endsWith(".mp4");
      const src = isVideo ? s.file.replace("broll/suengano/", "broll/suengano_cfr/") : s.file;
      const clip = s.clip ?? CLIP_S[s.file];
      const rate = isVideo && clip ? Math.min(1, clip / d) : 1;
      const z = s.zoom ?? 1;
      return (
        <Sequence key={"s" + i} from={from} durationInFrames={dur}>
          <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, transform: `scale(${z})`, transformOrigin: "50% 50%" }}>
              {isVideo
                ? <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
            </div>
          </AbsoluteFill>
        </Sequence>
      );
    })}
  </>
);

// relleno 44,18-65 s: cuatro clips de footage propio, en orden
const FILL: { f: string; d: number; at: number }[] = [
  { f: "root/fill_w_produce.mp4", d: 7.5, at: 0 },
  { f: "root/fill_w014.mp4", d: 5.5, at: 7.5 },
  { f: "root/fill_w025c.mp4", d: 4.63, at: 13.0 },
  { f: "root/fill_w025.mp4", d: 3.19, at: 17.63 },
];

export const SuenganoRoot1080: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    {/* 0-11,18 s: apertura (con su audio) */}
    <Sequence from={0} durationInFrames={fr(11.18)}>
      <AbsoluteFill>
        <OffthreadVideo src={staticFile("root/apertura.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </Sequence>
    {/* gancho viejo cortado: se conserva 27,08-28,00 s (Soy Claudio) */}
    <Sequence from={fr(11.18)} durationInFrames={fr(0.92)}>
      <AbsoluteFill>
        <OffthreadVideo src={staticFile("root/edl_0_65.mp4")} startFrom={fr(27.08)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <Audio src={staticFile("root/voz_seam.wav")} trimBefore={0} />
    </Sequence>
    {/* cover L 1,2 s */}
    <Sequence from={fr(12.10)} durationInFrames={fr(1.2)}>
      <AbsoluteFill>
        <Img src={staticFile("img/suengano/L689.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </Sequence>
    {/* 33,48-44,18 s */}
    <Sequence from={fr(13.30)} durationInFrames={fr(10.70)}>
      <AbsoluteFill>
        <OffthreadVideo src={staticFile("root/edl_0_65.mp4")} startFrom={fr(33.48)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <Audio src={staticFile("root/voz_seam.wav")} trimBefore={fr(0.92)} />

    </Sequence>
    {/* relleno de footage 44,18-65 s con la voz maestra */}
    <Sequence from={fr(24.00)} durationInFrames={fr(20.82)}>
      {FILL.map((c, i) => (
        <Sequence key={i} from={fr(c.at)} durationInFrames={fr(c.d)}>
          <AbsoluteFill>
            <OffthreadVideo src={staticFile(c.f)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
        </Sequence>
      ))}
      <Audio src={staticFile("root/voz_seam.wav")} trimBefore={fr(11.62)} />
    </Sequence>
    {/* voz maestra del resto: desde 65 s original */}
    <Sequence from={fr(rel(65))}>
      <Audio src={staticFile("suenganocut.wav")} trimBefore={fr(65)} />
    </Sequence>
    <Shots list={s65 as Shot[]} />
    <Shots list={s400 as Shot[]} />
    <Shots list={s540 as Shot[]} />
    <Shots list={s680 as Shot[]} />
    <Shots list={s820 as Shot[]} />
  </AbsoluteFill>
);
