// index_cmesegbat.tsx — GENERADO por la FÁBRICA. Entry propio: no comparte Root con otros videos.
import React from "react";
import { Composition, registerRoot } from "remotion";
import { MainCmesegbat, TOTAL_FRAMES_CMESEGBAT } from "./cmesegbat/Main_cmesegbat";

const Root: React.FC = () => (
  <Composition id="Cmesegbat" component={MainCmesegbat}
    durationInFrames={TOTAL_FRAMES_CMESEGBAT} fps={30} width={1920} height={1080} />
);
registerRoot(Root);
