// prueba local de OpTape
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { OpTape } from "./OpTape";
const D = 260;
const ROWS = [{ item: "layer feed x22", amt: "420.00" }, { item: "shavings & straw", amt: "132.00" }, { item: "shell, scratch, meds", amt: "66.00" }, { item: "heated base + power", amt: "80.00" }, { item: "wire + camera", amt: "100.00" }, { item: "4 pullets", amt: "80.00" }];
const ITEMS = [<OpTape rows={ROWS} total="$878.00" divide={{ by: "201 dozen", result: "$4.37" }} title="one year, every receipt" />];
export const DOZEN_TEST_FRAMES = ITEMS.length * D;
export const OpDozenTest: React.FC = () => <AbsoluteFill>{ITEMS.map((el, i) => <Sequence key={i} from={i * D} durationInFrames={D}>{el}</Sequence>)}</AbsoluteFill>;
