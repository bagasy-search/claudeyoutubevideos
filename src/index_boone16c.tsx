import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Video, Plan, durPlan} from './boone/Video';
import plan from './boone/plan_boone16c.json';
const P = plan as unknown as Plan;
const Root: React.FC = () => (
  <>
    <Composition id="Boone16c" component={Video} width={1920} height={1080} fps={24} durationInFrames={Math.max(24, durPlan(P))} defaultProps={{plan: P}} />
  </>
);
registerRoot(Root);
