/**
 * Entry AISLADO de este video. NO se toca src/Root.tsx (lo comparten los otros
 * agentes y el próximo pisaría esta composición → "Could not find composition").
 * Render:  ENTRY=src/index_vucm3bvd4u3k.tsx node scripts/farm.mjs vucm3bvd4u3k Hormigueo <frames> <chunks>
 */
import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {
  Main_vucm3bvd4u3k,
  ACCENT_VUCM,
  AVATAR_VUCM,
} from './VideoEdit/Main_vucm3bvd4u3k';
import {TOTAL_FRAMES_VUCM3BVD4U3K} from './VideoEdit/cues_vucm3bvd4u3k.gen';

const Root: React.FC = () => (
  <Composition
    id="Hormigueo"
    component={Main_vucm3bvd4u3k}
    durationInFrames={TOTAL_FRAMES_VUCM3BVD4U3K}
    fps={30}
    width={1920}
    height={1080}
    defaultProps={{avatarSrc: AVATAR_VUCM, accent: ACCENT_VUCM}}
  />
);

registerRoot(Root);
