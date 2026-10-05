// Entry mínimo del farm para un slug: src/index_<slug>.tsx (composición <Slug>) + tsconfig.<slug>.json. SLUG=x node vlog/loretta/mk_entry.mjs
import fs from "node:fs"; import { R, SLUG } from "./env.mjs";
const ID = SLUG[0].toUpperCase() + SLUG.slice(1);
fs.writeFileSync(R + `src/index_${SLUG}.tsx`, `// Entry MÍNIMO solo-${SLUG} (farm). Uso: ENTRY=src/index_${SLUG}.tsx
import React from "react";
import { registerRoot, Composition } from "remotion";
import { LorMain } from "./loretta/LorMain";
import { TL, OV, AUDIO, TOTAL_FRAMES } from "./${SLUG}/timeline.gen";

const Main: React.FC = () => <LorMain TL={TL} OV={OV} AUDIO={AUDIO} />;
const Root = () => <Composition id="${ID}" component={Main} durationInFrames={TOTAL_FRAMES} fps={30} width={1920} height={1080} />;
registerRoot(Root);
`);
fs.writeFileSync(R + `tsconfig.${SLUG}.json`, JSON.stringify({ extends: "./tsconfig.json", include: [], files: [`src/index_${SLUG}.tsx`, "src/loretta/three-shim.d.ts"], exclude: [] }));
console.log("entry", ID);
