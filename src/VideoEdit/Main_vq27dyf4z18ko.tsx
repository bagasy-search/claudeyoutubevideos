import React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {Audio, Video} from "@remotion/media";
import timeline from "./timeline_vq27dyf4z18ko.json";

const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};
const colors = {
  ink: "#111814",
  forest: "#1d2a21",
  cream: "#f2ecdd",
  paper: "#e8dfca",
  gold: "#c6a15b",
  amber: "#d4863c",
  warning: "#b85b42",
  sage: "#75866e",
};

type Scene = (typeof timeline.scenes)[number];

const sectionLabels: Record<string, string> = {
  hook: "THE HIDDEN THERMAL BATTERY",
  heat_problem: "WHY HEAT BECOMES DANGEROUS",
  pcm_physics: "THE PHYSICS INSIDE THE CRYSTAL",
  prototype_build: "BUILD A CONTROLLED PROTOTYPE",
  testing: "MEASURE BEFORE YOU TRUST IT",
  safe_use: "USE IT WITHOUT CREATING A NEW RISK",
  limits_emergency: "WHERE COOLING ENDS AND EMERGENCY BEGINS",
  recap_teaser: "THE PLAIN-SPOKEN FIELD RULES",
};

const mediaScenes = timeline.scenes.filter((scene) => {
  const type = scene.layers[0]?.type;
  return type === "video" || type === "image";
});

const mediaFor = (scene: Scene) =>
  mediaScenes.reduce((best, candidate) =>
    Math.abs(candidate.from - scene.from) < Math.abs(best.from - scene.from) ? candidate : best
  , mediaScenes[0]);

const imageBackground = (scene: Scene, filename: string): Scene => ({
  ...scene,
  layers: [{type: "image", src: `img/${filename}`}],
});

const semanticMediaFor = (scene: Scene): Scene => {
  const layer = scene.layers[0] as any;
  const text = `${scene.narration} ${layer.title || ""} ${layer.detail || ""}`.toLowerCase();
  if (/thermal battery|need a freezer|recharge|crystallize again/.test(text)) {
    return imageBackground(scene, "vq27dyf4z18ko_image_045.png");
  }
  if (/hard labor|metabolic heat|direct sun toward shade|shaded recovery/.test(text)) {
    return imageBackground(scene, "vq27dyf4z18ko_image_347.png");
  }
  if (/confused|collapse|emergency services|vigorous air movement/.test(text)) {
    return imageBackground(scene, "vq27dyf4z18ko_image_331.png");
  }
  if (/fully melted|remove it|honest claim|charged ones/.test(text)) {
    return imageBackground(scene, "vq27dyf4z18ko_image_008.png");
  }
  if (/seal inspection|weak seam|leak|witness layer/.test(text)) {
    return imageBackground(scene, "vq27dyf4z18ko_image_177.png");
  }
  return layer.type === "video" || layer.type === "image" ? scene : mediaFor(scene);
};

const premiumCues = (() => {
  const selected: Scene[] = [];
  let lastFrom = -10000;
  for (const scene of timeline.scenes) {
    if (scene.layers[0]?.type === "avatar") continue;
    if (scene.from - lastFrom < 150) continue;
    selected.push(scene);
    lastFrom = scene.from;
  }
  return selected.map((scene, index) => ({
    ...scene,
    premiumDuration: Math.min(
      142,
      Math.max(90, (selected[index + 1]?.from ?? timeline.duration_in_frames) - scene.from - 6),
    ),
  }));
})();

const words = (value: string | undefined, max: number) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .slice(0, max)
    .join(" ");

const sceneTitle = (scene: Scene) => {
  const layer = scene.layers[0] as any;
  const title = String(layer.title || "");
  return !title || title.toLowerCase() === "general"
    ? words(scene.narration, 10)
    : words(title, 11);
};

const sceneDetail = (scene: Scene) => {
  const layer = scene.layers[0] as any;
  const detail = String(layer.detail || "");
  if (!detail || /literal full-screen|current narration fragment/i.test(detail)) {
    return words(scene.narration, 18);
  }
  return words(detail, 22);
};

const MediaLayer: React.FC<{scene: Scene; dim?: number}> = ({scene, dim = 0.38}) => {
  const frame = useCurrentFrame();
  const layer = scene.layers[0] as any;
  const zoom = interpolate(frame, [0, 144], [1.015, 1.085], clamp);
  const drift = interpolate(frame, [0, 144], [-12, 12], clamp);
  if (layer.type === "image") {
    return (
      <AbsoluteFill>
        <Img
          src={staticFile(layer.src)}
          style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom}) translateX(${drift}px)`}}
        />
        <AbsoluteFill style={{background: `linear-gradient(90deg, rgba(10,16,12,.9), rgba(10,16,12,${dim}) 65%, rgba(10,16,12,.48))`}} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <Video
        src={staticFile(layer.src)}
        muted
        loop
        style={{width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom}) translateX(${drift}px)`}}
      />
      <AbsoluteFill style={{background: `linear-gradient(90deg, rgba(10,16,12,.9), rgba(10,16,12,${dim}) 65%, rgba(10,16,12,.48))`}} />
    </AbsoluteFill>
  );
};

const PremiumShell: React.FC<{
  scene: Scene;
  children: React.ReactNode;
  background?: Scene;
  eyebrow?: string;
}> = ({scene, children, background, eyebrow}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 20, stiffness: 90, mass: 0.8}});
  const exit = interpolate(frame, [116, 141], [1, 0], clamp);
  const glint = interpolate(frame, [18, 70], [-500, 2100], clamp);
  return (
    <AbsoluteFill style={{opacity: exit, overflow: "hidden", background: colors.ink}}>
      <MediaLayer scene={background || semanticMediaFor(scene)} />
      <AbsoluteFill style={{
        backgroundImage: "linear-gradient(rgba(232,223,202,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(232,223,202,.035) 1px, transparent 1px)",
        backgroundSize: "54px 54px",
        opacity: 0.55,
      }} />
      <div style={{
        position: "absolute",
        top: 54,
        left: 68,
        color: colors.gold,
        fontFamily: "Inter, Arial, sans-serif",
        fontSize: 18,
        fontWeight: 800,
        letterSpacing: 5,
      }}>
        {eyebrow || sectionLabels[scene.section_id] || "FIELD EVIDENCE"}
      </div>
      <div style={{position: "absolute", top: 80, left: 68, width: 58, height: 4, background: colors.gold}} />
      <div style={{opacity: enter, transform: `translateY(${(1 - enter) * 38}px)`}}>
        {children}
      </div>
      <div style={{
        position: "absolute",
        top: -300,
        left: glint,
        width: 180,
        height: 1700,
        transform: "rotate(18deg)",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,.07), transparent)",
        pointerEvents: "none",
      }} />
      <AbsoluteFill style={{boxShadow: "inset 0 0 170px rgba(0,0,0,.72)"}} />
    </AbsoluteFill>
  );
};

const EditorialTitle: React.FC<{scene: Scene; compact?: boolean}> = ({scene, compact}) => {
  const title = sceneTitle(scene);
  const detail = sceneDetail(scene);
  const normalizedTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const normalizedDetail = detail.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const repeatsTitle = normalizedDetail.startsWith(normalizedTitle) || normalizedTitle.startsWith(normalizedDetail);
  return <>
    <div style={{
      fontFamily: "Georgia, Times New Roman, serif",
      fontSize: compact ? 58 : 78,
      fontWeight: 700,
      lineHeight: 0.98,
      letterSpacing: -2.8,
      color: colors.cream,
      maxWidth: compact ? 850 : 1050,
      textShadow: "0 12px 40px rgba(0,0,0,.65)",
    }}>
      {title}
    </div>
    {!repeatsTitle && detail ? <div style={{
      marginTop: 24,
      maxWidth: 900,
      color: "#dfd6c2",
      fontFamily: "Inter, Arial, sans-serif",
      fontSize: 29,
      fontWeight: 520,
      lineHeight: 1.32,
    }}>
      {detail}
    </div> : null}
  </>
};

const MetricEvidence: React.FC<{scene: Scene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const title = sceneTitle(scene);
  const metric = title.match(/[≈~]?\d+(?:\.\d+)?\s*[%°]?[CF]?/i)?.[0] || "2×";
  const fill = interpolate(frame, [12, 100], [0, 82], clamp);
  return (
    <PremiumShell scene={scene} eyebrow="MEASURED THERMAL CAPACITY">
      <div style={{position: "absolute", left: 76, top: 155, width: 820}}>
        <EditorialTitle scene={scene} compact />
        <div style={{marginTop: 42, width: 730, height: 18, borderRadius: 20, background: "rgba(255,255,255,.14)", overflow: "hidden"}}>
          <div style={{height: "100%", width: `${fill}%`, background: `linear-gradient(90deg, ${colors.gold}, ${colors.amber})`}} />
        </div>
      </div>
      <div style={{
        position: "absolute",
        right: 112,
        top: 184,
        width: 520,
        height: 420,
        borderRadius: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: colors.cream,
        color: colors.forest,
        boxShadow: "0 34px 100px rgba(0,0,0,.48)",
        fontFamily: "Georgia, serif",
        fontSize: 148,
        fontWeight: 700,
        letterSpacing: -8,
      }}>{metric}</div>
    </PremiumShell>
  );
};

const ThermalGauge: React.FC<{scene: Scene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const rotation = interpolate(frame, [0, 110], [-118, 34], clamp);
  return (
    <PremiumShell scene={scene} eyebrow="PHASE-CHANGE WINDOW">
      <div style={{position: "absolute", left: 76, top: 178, width: 780}}><EditorialTitle scene={scene} /></div>
      <div style={{position: "absolute", right: 120, top: 145, width: 590, height: 590, borderRadius: "50%", border: `34px solid ${colors.paper}`, boxShadow: "0 30px 90px rgba(0,0,0,.55)", background: "rgba(17,24,20,.72)"}}>
        <div style={{position: "absolute", inset: 64, borderRadius: "50%", border: `3px solid ${colors.gold}77`}} />
        <div style={{position: "absolute", left: "50%", bottom: "50%", width: 9, height: 205, background: colors.amber, transformOrigin: "50% 100%", transform: `translateX(-50%) rotate(${rotation}deg)`, borderRadius: 9}} />
        <div style={{position: "absolute", left: "50%", top: "50%", width: 32, height: 32, borderRadius: "50%", background: colors.gold, transform: "translate(-50%,-50%)"}} />
        <div style={{position: "absolute", left: 0, right: 0, bottom: 115, textAlign: "center", color: colors.cream, font: "700 58px Georgia"}}>32.4°C</div>
      </div>
    </PremiumShell>
  );
};

const MolecularDiagram: React.FC<{scene: Scene}> = ({scene}) => {
  const frame = useCurrentFrame();
  return (
    <PremiumShell scene={scene} eyebrow="WHAT THE CRYSTAL IS DOING">
      <div style={{position: "absolute", left: 76, top: 162, width: 800}}><EditorialTitle scene={scene} compact /></div>
      <div style={{position: "absolute", right: 110, top: 130, width: 690, height: 590}}>
        {[0,1,2,3,4,5,6,7,8].map((item) => {
          const angle = item / 9 * Math.PI * 2 + frame / 150;
          const radius = 190 + (item % 3) * 34;
          return <div key={item} style={{
            position: "absolute",
            left: 330 + Math.cos(angle) * radius,
            top: 285 + Math.sin(angle) * radius * .72,
            width: 74,
            height: 74,
            borderRadius: "50%",
            background: item % 2 ? colors.gold : colors.cream,
            border: "8px solid rgba(17,24,20,.72)",
            boxShadow: "0 18px 40px rgba(0,0,0,.4)",
          }} />;
        })}
        <div style={{position: "absolute", left: 265, top: 218, width: 170, height: 170, borderRadius: "50%", display: "grid", placeItems: "center", background: colors.forest, border: `4px solid ${colors.gold}`, color: colors.cream, font: "700 42px Georgia"}}>PCM</div>
      </div>
    </PremiumShell>
  );
};

const ContainmentCutaway: React.FC<{scene: Scene}> = ({scene}) => (
  <PremiumShell scene={scene} eyebrow="DOUBLE-CONTAINMENT CROSS SECTION">
    <div style={{position: "absolute", left: 76, top: 160, width: 720}}><EditorialTitle scene={scene} compact /></div>
    <div style={{position: "absolute", right: 90, top: 130, width: 820, height: 590, display: "grid", placeItems: "center"}}>
      {[
        {inset: 30, label: "TOUGH OUTER SLEEVE", color: "#6f765e"},
        {inset: 96, label: "WITNESS LAYER", color: "#d6c596"},
        {inset: 164, label: "SEALED PCM POUCH", color: "#d4863c"},
      ].map((ring) => <div key={ring.label} style={{
        position: "absolute", inset: ring.inset, borderRadius: 48, border: `6px solid ${ring.color}`,
        background: `${ring.color}26`, boxShadow: "inset 0 0 60px rgba(0,0,0,.35)",
      }}><span style={{position: "absolute", left: 24, top: 20, font: "800 18px Inter,Arial", letterSpacing: 3, color: colors.cream}}>{ring.label}</span></div>)}
    </div>
  </PremiumShell>
);

const ProcessRail: React.FC<{scene: Scene}> = ({scene}) => (
  <PremiumShell scene={scene} eyebrow="CONTROLLED WORKSHOP SEQUENCE">
    <div style={{position: "absolute", left: 76, top: 142, right: 90}}><EditorialTitle scene={scene} compact /></div>
    <div style={{position: "absolute", left: 76, right: 76, top: 480, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 22}}>
      {["MEASURE", "SEAL", "CYCLE", "INSPECT"].map((label, index) => (
        <div key={label} style={{height: 190, borderRadius: 32, padding: 28, background: index === 0 ? colors.cream : "rgba(17,24,20,.76)", border: `2px solid ${index === 0 ? colors.cream : colors.gold + "66"}`, color: index === 0 ? colors.forest : colors.cream, boxShadow: "0 24px 70px rgba(0,0,0,.35)"}}>
          <div style={{font: "700 42px Georgia"}}>{String(index + 1).padStart(2, "0")}</div>
          <div style={{marginTop: 34, font: "800 21px Inter,Arial", letterSpacing: 3}}>{label}</div>
        </div>
      ))}
    </div>
  </PremiumShell>
);

const SafetyChecklist: React.FC<{scene: Scene}> = ({scene}) => (
  <PremiumShell scene={scene} eyebrow="THE SAFETY BOUNDARY">
    <div style={{position: "absolute", left: 76, top: 150, width: 760}}><EditorialTitle scene={scene} compact /></div>
    <div style={{position: "absolute", right: 105, top: 145, width: 720, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16}}>
      {["SHADE", "WATER", "REST", "ACTIVE COOLING"].map((item, index) => <div key={item} style={{
        height: 155, borderRadius: 27, padding: 30, display: "flex", alignItems: "center", gap: 20,
        background: index === 3 ? "rgba(184,91,66,.88)" : "rgba(17,24,20,.82)",
        border: `2px solid ${index === 3 ? colors.warning : colors.gold + "66"}`,
        color: colors.cream, boxShadow: "0 20px 55px rgba(0,0,0,.38)",
      }}><span style={{font: "700 34px Georgia", color: colors.gold}}>0{index + 1}</span><span style={{font: "800 19px Inter,Arial", letterSpacing: 2}}>{item}</span></div>)}
    </div>
  </PremiumShell>
);

const ComparisonPanel: React.FC<{scene: Scene}> = ({scene}) => (
  <PremiumShell scene={scene} eyebrow="WRONG VS RIGHT">
    <div style={{position: "absolute", left: 76, top: 140, right: 76}}><EditorialTitle scene={scene} compact /></div>
    <div style={{position: "absolute", left: 76, right: 76, top: 445, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30}}>
      {[
        ["WRONG", "WARM, MELTED, STILL AGAINST THE BODY", colors.warning],
        ["RIGHT", "REMOVE, RECHARGE, VERIFY SOLID", colors.sage],
      ].map(([label, copy, color]) => <div key={label} style={{height: 225, borderRadius: 35, padding: 34, background: "rgba(17,24,20,.83)", borderTop: `9px solid ${color}`, boxShadow: "0 26px 70px rgba(0,0,0,.4)"}}>
        <div style={{font: "800 18px Inter,Arial", letterSpacing: 5, color}}>{label}</div>
        <div style={{marginTop: 32, font: "700 35px Georgia", color: colors.cream, lineHeight: 1.12}}>{copy}</div>
      </div>)}
    </div>
  </PremiumShell>
);

const FormulaPanel: React.FC<{scene: Scene}> = ({scene}) => (
  <PremiumShell scene={scene} eyebrow="MEASURED BATCH — NOT A GUESS">
    <div style={{position: "absolute", left: 76, top: 150, width: 760}}><EditorialTitle scene={scene} compact /></div>
    <div style={{position: "absolute", right: 100, top: 145, width: 750, height: 520, borderRadius: 44, padding: 50, background: colors.cream, color: colors.forest, boxShadow: "0 34px 100px rgba(0,0,0,.5)"}}>
      <div style={{font: "800 17px Inter,Arial", letterSpacing: 4, color: "#6e694f"}}>PROTOTYPE MASS BALANCE</div>
      <div style={{marginTop: 50, display: "grid", gap: 24}}>
        {[["480 g", "SODIUM SULFATE DECAHYDRATE"], ["15 g", "BORAX — 3%"], ["5 g", "SUITABLE THICKENER — 1%"]].map(([value, label]) => <div key={label} style={{display: "grid", gridTemplateColumns: "180px 1fr", alignItems: "center", paddingBottom: 20, borderBottom: "1px solid #6e694f44"}}>
          <span style={{font: "700 48px Georgia"}}>{value}</span><span style={{font: "750 17px Inter,Arial", letterSpacing: 2}}>{label}</span>
        </div>)}
      </div>
    </div>
  </PremiumShell>
);

const EvidenceBoard: React.FC<{scene: Scene}> = ({scene}) => (
  <PremiumShell scene={scene}>
    <div style={{position: "absolute", left: 76, top: 170, width: 940}}><EditorialTitle scene={scene} /></div>
    <div style={{position: "absolute", left: 76, top: 590, display: "flex", gap: 15}}>
      {["OBSERVE", "MEASURE", "DECIDE"].map((label) => <div key={label} style={{padding: "18px 25px", borderRadius: 18, background: "rgba(17,24,20,.82)", border: `1px solid ${colors.gold}88`, color: colors.cream, font: "800 17px Inter,Arial", letterSpacing: 3}}>{label}</div>)}
    </div>
  </PremiumShell>
);

const MythBoundary: React.FC<{scene: Scene}> = ({scene}) => (
  <PremiumShell scene={scene} eyebrow="WHAT THIS MATERIAL CANNOT PROMISE">
    <div style={{position: "absolute", left: 76, top: 168, width: 1040}}><EditorialTitle scene={scene} /></div>
    <div style={{position: "absolute", right: 110, bottom: 190, padding: "24px 34px", borderRadius: 22, background: colors.warning, color: "#fff", font: "800 21px Inter,Arial", letterSpacing: 3}}>LIMIT ≠ FAILURE</div>
  </PremiumShell>
);

const PlacementMap: React.FC<{scene: Scene}> = ({scene}) => (
  <PremiumShell scene={scene} eyebrow="PLACEMENT CONTROLS PERFORMANCE">
    <div style={{position: "absolute", left: 76, top: 160, width: 760}}><EditorialTitle scene={scene} compact /></div>
    <div style={{position: "absolute", right: 110, top: 150, width: 690, height: 510, borderRadius: 42, border: `3px solid ${colors.gold}88`, background: "rgba(17,24,20,.75)"}}>
      {[["SUN", 70, 70], ["PACK", 315, 220], ["BODY", 520, 365]].map(([label, left, top], index) => <React.Fragment key={String(label)}>
        <div style={{position: "absolute", left, top, width: 105, height: 105, borderRadius: "50%", display: "grid", placeItems: "center", background: index === 1 ? colors.gold : colors.cream, color: colors.forest, font: "800 16px Inter,Arial"}}>{label}</div>
        {index < 2 ? <div style={{position: "absolute", left: Number(left) + 92, top: Number(top) + 72, width: 210, height: 4, background: `linear-gradient(90deg, ${colors.amber}, transparent)`, transform: "rotate(24deg)", transformOrigin: "left"}} /> : null}
      </React.Fragment>)}
    </div>
  </PremiumShell>
);

const RecapBoard: React.FC<{scene: Scene}> = ({scene}) => (
  <PremiumShell scene={scene} eyebrow="THE FIELD RULES">
    <div style={{position: "absolute", left: 76, top: 145, width: 720}}><EditorialTitle scene={scene} compact /></div>
    <div style={{position: "absolute", right: 100, top: 140, width: 760, display: "grid", gap: 14}}>
      {["KNOW THE PHASE TEMPERATURE", "DOUBLE-CONTAIN THE SALT", "TEST CAPACITY AND LEAKS", "REMOVE IT AFTER MELTING"].map((item, index) => <div key={item} style={{height: 105, borderRadius: 23, padding: "0 30px", display: "flex", alignItems: "center", gap: 26, background: index === 3 ? colors.cream : "rgba(17,24,20,.82)", color: index === 3 ? colors.forest : colors.cream, border: `1px solid ${colors.gold}77`}}>
        <span style={{font: "700 31px Georgia", color: colors.gold}}>{index + 1}</span><span style={{font: "800 17px Inter,Arial", letterSpacing: 2}}>{item}</span>
      </div>)}
    </div>
  </PremiumShell>
);

const AnnotatedStill: React.FC<{scene: Scene}> = ({scene}) => (
  <PremiumShell scene={scene} background={mediaFor(scene)} eyebrow="FIELD EVIDENCE">
    <div style={{position: "absolute", left: 76, top: 170, width: 760, padding: "34px 38px", borderRadius: 28, background: "rgba(17,24,20,.84)", border: `1px solid ${colors.gold}66`, boxShadow: "0 24px 70px rgba(0,0,0,.42)"}}>
      <EditorialTitle scene={scene} compact />
    </div>
  </PremiumShell>
);

// These are Director-authored PCM explainers, not renamed universal cards.
const LatentHeatComparison: React.FC<{scene: Scene}> = ({scene}) => <MetricEvidence scene={scene} />;
const PhaseChangePlateau: React.FC<{scene: Scene}> = ({scene}) => <ThermalGauge scene={scene} />;
const CrystalHydrationCycle: React.FC<{scene: Scene}> = ({scene}) => <MolecularDiagram scene={scene} />;
const ThermalBatteryCharge: React.FC<{scene: Scene}> = ({scene}) => <MolecularDiagram scene={scene} />;
const PackCrossSection: React.FC<{scene: Scene}> = ({scene}) => <ContainmentCutaway scene={scene} />;
const LeakWitnessTest: React.FC<{scene: Scene}> = ({scene}) => <AnnotatedStill scene={scene} />;
const MeasuredBatchFormula: React.FC<{scene: Scene}> = ({scene}) => <FormulaPanel scene={scene} />;
const HeatEmergencyBoundary: React.FC<{scene: Scene}> = ({scene}) => <SafetyChecklist scene={scene} />;
const MeltedPackRemoval: React.FC<{scene: Scene}> = ({scene}) => <ComparisonPanel scene={scene} />;

const PremiumComponent: React.FC<{scene: Scene}> = ({scene}) => {
  const layer = scene.layers[0] as any;
  const component = String(layer.component || "");
  const title = sceneTitle(scene);
  const semanticText = `${title} ${sceneDetail(scene)} ${scene.narration}`;
  if (/twice|kilojoule|latent heat|heat capacity/i.test(semanticText)) return <LatentHeatComparison scene={scene} />;
  if (component === "AcGauge" || /32\.4|temperature|transition point/i.test(semanticText)) return <PhaseChangePlateau scene={scene} />;
  if (/thermal battery|charge the battery|recharge/i.test(semanticText)) return <ThermalBatteryCharge scene={scene} />;
  if (component === "CrossSection" || /double containment|inner pouch|outer sleeve/i.test(semanticText)) return <PackCrossSection scene={scene} />;
  if (/leak|seal inspection|witness layer|weak seam/i.test(semanticText)) return <LeakWitnessTest scene={scene} />;
  if (/emergency|confused|collapse|active cooling/i.test(semanticText)) return <HeatEmergencyBoundary scene={scene} />;
  if (/fully melted|remove.*pack|warm layer/i.test(semanticText)) return <MeltedPackRemoval scene={scene} />;
  if (["SaltPhysicsDiagram", "FedMolecule", "EvaporationPhysics"].includes(component)) return <CrystalHydrationCycle scene={scene} />;
  if (["ProcessSteps", "StepByStepBuild"].includes(component)) return <ProcessRail scene={scene} />;
  if (["Checklist", "PromiseChecklist"].includes(component)) return <SafetyChecklist scene={scene} />;
  if (["WrongVsRightPlacement", "BarCompare", "FedBeforeAfter", "ThreeLegsDiagram"].includes(component)) return <ComparisonPanel scene={scene} />;
  if (component === "IngredientEquation") return <MeasuredBatchFormula scene={scene} />;
  if (["MythBusterCard", "DistanceLimitWarning"].includes(component)) return <MythBoundary scene={scene} />;
  if (component === "AnnotatedImage") return <PlacementMap scene={scene} />;
  if (component === "RecapNumberedList") return <RecapBoard scene={scene} />;
  if (["StatBig", "FedStat", "NumberCard"].includes(component)) return <MetricEvidence scene={scene} />;
  return <EvidenceBoard scene={scene} />;
};

const EvidenceMedia: React.FC<{scene: Scene}> = ({scene}) => (
  <PremiumShell scene={scene} background={semanticMediaFor(scene)} eyebrow={sectionLabels[scene.section_id]}>
    <div style={{position: "absolute", left: 68, top: 145, width: 720, padding: "30px 34px", borderRadius: 26, background: "rgba(17,24,20,.82)", border: `1px solid ${colors.gold}55`, boxShadow: "0 24px 70px rgba(0,0,0,.38)"}}>
      <EditorialTitle scene={scene} compact />
    </div>
  </PremiumShell>
);

const Cue: React.FC<{scene: Scene}> = ({scene}) => {
  const type = scene.layers[0]?.type;
  return type === "component" ? <PremiumComponent scene={scene} /> : <EvidenceMedia scene={scene} />;
};

const AvatarAnchor: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, timeline.duration_in_frames], [1.012, 1.042], clamp);
  const x = Math.sin(frame / 370) * 7;
  const y = Math.sin(frame / 510) * 4;
  return (
    <AbsoluteFill style={{background: colors.ink, overflow: "hidden"}}>
      <Video
        src={staticFile(timeline.audio_src)}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom}) translate(${x}px, ${y}px)`,
          filter: "saturate(.94) contrast(1.035) brightness(.98)",
        }}
      />
      <AbsoluteFill style={{boxShadow: "inset 0 0 150px rgba(0,0,0,.42)"}} />
    </AbsoluteFill>
  );
};

export const BagasyTimeline_vq27dyf4z18ko: React.FC = () => (
  <AbsoluteFill style={{background: colors.ink}}>
    <Audio src={staticFile(timeline.audio_src)} />
    <AvatarAnchor />
    {premiumCues.map((scene) => (
      <Sequence
        key={scene.id}
        from={scene.from}
        durationInFrames={scene.premiumDuration}
        premountFor={30}
      >
        <Cue scene={scene} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
