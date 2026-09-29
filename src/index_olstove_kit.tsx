// Entry solo del kit (stills de control de los componentes 3D). npx remotion still src/index_olstove_kit.tsx <id> out.png --frame=N
import { registerRoot, Composition } from "remotion";
import { StvStove3D } from "./olstove/StvStove3D";
import { StvFireStack3D } from "./olstove/StvFireStack3D";
import { StvCabinHeat3D } from "./olstove/StvCabinHeat3D";
import { StvMoistureMeter } from "./olstove/StvMoistureMeter";
import { StvDamperDial } from "./olstove/StvDamperDial";
import { StvCreosoteWarning } from "./olstove/StvCreosoteWarning";
import { StvCordStack } from "./olstove/StvCordStack";
import { StvChimneyDraft } from "./olstove/StvChimneyDraft";
import { StvSeasonCalendar } from "./olstove/StvSeasonCalendar";

const C = (id: string, component: React.FC<any>, frames: number, props: Record<string, unknown> = {}) => (
  <Composition key={id} id={id} component={component} durationInFrames={frames} fps={30} width={1920} height={1080} defaultProps={props} />
);
const Root = () => (
  <>
    {C("Stove-split", StvStove3D, 180, { mode: "split" })}
    {C("Stove-top", StvStove3D, 180, { mode: "topDown" })}
    {C("Stove-smolder", StvStove3D, 180, { mode: "smolder" })}
    {C("FireStack", StvFireStack3D, 240)}
    {C("CabinHeat", StvCabinHeat3D, 240)}
    {C("Moisture", StvMoistureMeter, 150)}
    {C("Damper", StvDamperDial, 150)}
    {C("Creosote", StvCreosoteWarning, 240)}
    {C("Creosote-fire", StvCreosoteWarning, 240, { fire: true })}
    {C("Cord", StvCordStack, 260)}
    {C("Draft", StvChimneyDraft, 200)}
    {C("Calendar", StvSeasonCalendar, 240)}
  </>
);
registerRoot(Root);
