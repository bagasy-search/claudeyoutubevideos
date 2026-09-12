import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {TOTAL} from '../config';
import {useBrand} from '../lib/Brand';

export const ProgressBar: React.FC = () => {
  const f = useCurrentFrame();
  const {width} = useVideoConfig();
  const {accent} = useBrand();
  const w = (f / (TOTAL - 1)) * width;
  return (
    <div style={{position: 'absolute', left: 0, bottom: 0, height: 4, width, background: 'rgba(255,255,255,0.06)', zIndex: 55}}>
      <div style={{height: '100%', width: w, background: `linear-gradient(90deg, ${accent}, #2ee6ff)`, boxShadow: `0 0 14px ${accent}`}} />
    </div>
  );
};
