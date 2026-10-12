// suqueso · minuto 60-400 s (R5). Generado por r5/gen_min2.py.
// AV: tramos <=8 s con reel (off = offset del reel en segundos). Real: clip normalizado nb2_* (startFrom en s). Still: L/N.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";

const FPS = 30;
const fr = (s: number) => Math.round(s * FPS);

const Push: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const f = useCurrentFrame();
  const t = Math.max(0, Math.min(1, f / Math.max(1, fr(dur))));
  const s = 1 + 0.06 * t;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{ width: "100%", height: "100%", transform: `scale(${s})`, transformOrigin: "50% 50%" }}>{children}</div>
    </AbsoluteFill>
  );
};

const AV: React.FC<{ a: number; b: number; off: number }> = ({ a, b, off }) => (
  <Sequence from={fr(a)} durationInFrames={fr(b - a)}>
    <AbsoluteFill>
      <OffthreadVideo src={staticFile("avatar_clips/suqueso/reel30_nb.mp4")} startFrom={fr(off)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
  </Sequence>
);
const Real: React.FC<{ a: number; b: number; src: string; st: number }> = ({ a, b, src, st }) => (
  <Sequence from={fr(a)} durationInFrames={fr(b - a)}>
    <Push dur={b - a}>
      <OffthreadVideo src={staticFile(`broll/suqueso/${src}`)} startFrom={fr(st)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Push>
  </Sequence>
);
const Still: React.FC<{ a: number; b: number; name: string }> = ({ a, b, name }) => (
  <Sequence from={fr(a)} durationInFrames={fr(b - a)}>
    <Push dur={b - a}>
      <Img src={staticFile(`img/suqueso/${name}.png`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </Push>
  </Sequence>
);


// CTA visual (cover El Manual del Repositor). Solo visual; la voz no se toca.
const CtaCard: React.FC<{ a: number; b: number }> = ({ a, b }) => (
  <Sequence from={fr(a)} durationInFrames={fr(b - a)}>
    <AbsoluteFill style={{ background: "rgba(0,0,0,0.80)", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 70, padding: 80, boxSizing: "border-box" }}>
      <Img src={staticFile("img/cta_combo.png")} style={{ height: 640, objectFit: "contain" }} />
      <div style={{ color: "#fff", fontFamily: "Arial Black, Arial, sans-serif", textAlign: "left", maxWidth: 620 }}>
        <div style={{ fontSize: 84, lineHeight: 1.05 }}>El Manual<br />del Repositor</div>
        <div style={{ fontSize: 40, marginTop: 36, color: "#ffd400" }}>LINK EN LA DESCRIPCIÓN</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Img src={staticFile("img/qr_repositor.png")} style={{ width: 300, height: 300, background: "#f5efe0", padding: 10, boxSizing: "border-box" }} />
        <div style={{ color: "#fff", fontFamily: "Arial, sans-serif", fontSize: 26, marginTop: 14 }}>Escanea con tu celular</div>
      </div>
    </AbsoluteFill>
  </Sequence>
);

// Respiro de componente: texto grande sobre el B-roll (no toca la voz).
const BreatherCard: React.FC<{ a: number; b: number; big: string; small: string }> = ({ a, b, big, small }) => (
  <Sequence from={fr(a)} durationInFrames={fr(b - a)}>
    <AbsoluteFill style={{ background: "rgba(0,0,0,0.72)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 120, boxSizing: "border-box", textAlign: "center" }}>
      <div style={{ color: "#ffd400", fontFamily: "Arial Black, Arial, sans-serif", fontSize: 150, lineHeight: 1.0 }}>{big}</div>
      <div style={{ color: "#fff", fontFamily: "Arial, sans-serif", fontSize: 54, marginTop: 40 }}>{small}</div>
    </AbsoluteFill>
  </Sequence>
);

export const Min3: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#000" }}>
    <Real a={400.000} b={407.000} src="nb3_19896989.mp4" st={0.0} />
    <Real a={407.000} b={414.000} src="nb3_20315763.mp4" st={0.0} />
    <Real a={414.000} b={421.000} src="nb3_28988753.mp4" st={0.0} />
    <Real a={421.000} b={428.000} src="nb3_29376327.mp4" st={0.0} />
    <Real a={428.000} b={435.000} src="nb3_29824279.mp4" st={0.0} />
    <Real a={435.000} b={442.000} src="nb3_3119255.mp4" st={0.0} />
    <Real a={442.000} b={449.000} src="nb3_34785311.mp4" st={0.0} />
    <Real a={449.000} b={456.000} src="nb3_34988877.mp4" st={0.0} />
    <Real a={456.000} b={463.000} src="nb3_36074343.mp4" st={0.0} />
    <Real a={463.000} b={470.000} src="nb3_3794065.mp4" st={0.0} />
    <Real a={470.000} b={477.000} src="nb3_39221979.mp4" st={0.0} />
    <Real a={477.000} b={484.000} src="nb3_39240105.mp4" st={0.0} />
    <Real a={484.000} b={491.000} src="nb3_39240106.mp4" st={0.0} />
    <Real a={491.000} b={498.000} src="nb3_4091009.mp4" st={0.0} />
    <Real a={498.000} b={505.000} src="nb3_4098420.mp4" st={0.0} />
    <Real a={505.000} b={512.000} src="nb3_4121625.mp4" st={0.0} />
    <Real a={512.000} b={519.000} src="nb3_4121714.mp4" st={0.0} />
    <Real a={519.000} b={526.000} src="nb3_4121739.mp4" st={0.0} />
    <Real a={526.000} b={533.000} src="nb3_4121744.mp4" st={0.0} />
    <Real a={533.000} b={540.000} src="nb3_4121746.mp4" st={0.0} />
    <Real a={540.000} b={547.000} src="nb3_4121747.mp4" st={0.0} />
    <Real a={547.000} b={554.000} src="nb3_4122971.mp4" st={0.0} />
    <Real a={554.000} b={561.000} src="nb3_4139401.mp4" st={0.0} />
    <Real a={561.000} b={568.000} src="nb3_4186967.mp4" st={0.0} />
    <Real a={568.000} b={575.000} src="nb3_4292301.mp4" st={0.0} />
    <Real a={575.000} b={582.000} src="nb3_4309719.mp4" st={0.0} />
    <Real a={582.000} b={589.000} src="nb3_4366190.mp4" st={0.0} />
    <Real a={589.000} b={596.000} src="nb3_5100068.mp4" st={0.0} />
    <Real a={596.000} b={603.000} src="nb3_5103990.mp4" st={0.0} />
    <Real a={603.000} b={610.000} src="nb3_5103996.mp4" st={0.0} />
    <Real a={610.000} b={617.000} src="nb3_5103999.mp4" st={0.0} />
    <Real a={617.000} b={624.000} src="nb3_5371527.mp4" st={0.0} />
    <Real a={624.000} b={631.000} src="nb3_6023333.mp4" st={0.0} />
    <Real a={631.000} b={638.000} src="nb3_6169113.mp4" st={0.0} />
    <Real a={638.000} b={645.000} src="nb3_6516822.mp4" st={0.0} />
    <Real a={645.000} b={652.000} src="nb3_7033608.mp4" st={0.0} />
    <Real a={652.000} b={659.000} src="nb3_7405923.mp4" st={0.0} />
    <Real a={659.000} b={666.000} src="nb3_7405929.mp4" st={0.0} />
    <Real a={666.000} b={673.000} src="nb3_7405932.mp4" st={0.0} />
    <Real a={673.000} b={680.000} src="nb3_7423920.mp4" st={0.0} />
    <Real a={680.000} b={687.000} src="nb3_8077529.mp4" st={0.0} />
    <Real a={687.000} b={694.000} src="nb3_8420602.mp4" st={0.0} />
    <Real a={694.000} b={701.000} src="nb3_8420776.mp4" st={0.0} />
    <Real a={701.000} b={708.000} src="nb3_8420777.mp4" st={0.0} />
    <Real a={708.000} b={715.000} src="nb3_8420781.mp4" st={0.0} />
    <Real a={715.000} b={722.000} src="nb3_8420784.mp4" st={0.0} />
    <Real a={722.000} b={729.000} src="nb3_8420786.mp4" st={0.0} />
    <Real a={729.000} b={736.000} src="nb3_8420787.mp4" st={0.0} />
    <Real a={736.000} b={743.000} src="nb3_8421356.mp4" st={0.0} />
    <Real a={743.000} b={750.000} src="nb3_9010435.mp4" st={0.0} />
    <Real a={750.000} b={757.000} src="nb3_9020663.mp4" st={0.0} />
    <Real a={757.000} b={764.000} src="nb3_992683.mp4" st={0.0} />
    <Real a={764.000} b={771.000} src="nb3_9945020.mp4" st={0.0} />
    <Real a={771.000} b={778.000} src="nb3_19896989.mp4" st={16.5} />
    <Real a={778.000} b={785.000} src="nb3_20315763.mp4" st={1.67} />
    <Real a={785.000} b={792.000} src="nb3_28988753.mp4" st={3.63} />
    <Real a={792.000} b={799.000} src="nb3_29376327.mp4" st={3.3} />
    <Real a={799.000} b={806.000} src="nb3_29824279.mp4" st={5.23} />
    <Real a={806.000} b={813.000} src="nb3_3119255.mp4" st={9.67} />
    <Real a={813.000} b={820.000} src="nb3_34785311.mp4" st={6.4} />
    <Real a={820.000} b={827.000} src="nb3_34988877.mp4" st={2.93} />
    <Real a={827.000} b={834.000} src="nb3_36074343.mp4" st={1.63} />
    <Real a={834.000} b={841.000} src="nb3_3794065.mp4" st={1.8} />
    <Real a={841.000} b={848.000} src="nb3_39221979.mp4" st={16.5} />
    <Real a={848.000} b={855.000} src="nb3_39240105.mp4" st={9.47} />
    <Real a={855.000} b={862.000} src="nb3_39240106.mp4" st={16.5} />
    <Real a={862.000} b={869.000} src="nb3_4091009.mp4" st={12.5} />
    <Real a={869.000} b={876.000} src="nb3_4098420.mp4" st={16.5} />
    <Real a={876.000} b={883.000} src="nb3_4121625.mp4" st={4.83} />
    <Real a={883.000} b={890.000} src="nb3_4121714.mp4" st={8.7} />
    <Real a={890.000} b={897.000} src="nb3_4121739.mp4" st={2.33} />
    <Real a={897.000} b={904.000} src="nb3_4121744.mp4" st={3.9} />
    <Real a={904.000} b={911.000} src="nb3_4121746.mp4" st={2.07} />
    <Real a={911.000} b={918.000} src="nb3_4121747.mp4" st={11.03} />
    <Real a={918.000} b={925.000} src="nb3_4122971.mp4" st={4.63} />
    <Real a={925.000} b={932.000} src="nb3_4139401.mp4" st={12.7} />
    <Real a={932.000} b={933.000} src="nb3_4186967.mp4" st={12.5} />
    <AV a={933.000} b={938.633} off={265.251} />
    <Real a={938.633} b={941.100} src="nb3_4292301.mp4" st={6.44} />
    <AV a={941.100} b={946.733} off={270.891} />
    <Real a={946.733} b={948.933} src="nb3_4309719.mp4" st={14.28} />
    <AV a={948.933} b={954.533} off={276.531} />
    <Real a={954.533} b={956.767} src="nb3_4366190.mp4" st={12.29} />
    <AV a={956.767} b={961.500} off={282.151} />
    <CtaCard a={421.65} b={433.8} />
    <CtaCard a={933.0} b={946.74} />
    <BreatherCard a={490} b={494} big="$ / kg" small="Compara el precio por kilo, no el número grande" />
    <BreatherCard a={610} b={614} big="0 g" small="Balanza en cero, con el papel encima" />
    <BreatherCard a={730} b={734} big="1 kilo" small="Hacé la cuenta: kilo x precio = total" />
    <BreatherCard a={850} b={854} big="Centro" small="Pedí el trozo del centro, no el de la corteza" />
  </AbsoluteFill>
);
