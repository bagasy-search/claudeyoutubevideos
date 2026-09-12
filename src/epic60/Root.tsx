import React from 'react';
import {Composition} from 'remotion';
import {EpicVideo} from './EpicVideo';
import {epicSchema} from './schema';

export const Root: React.FC = () => (
  <Composition
    id="Epic60"
    component={EpicVideo}
    durationInFrames={1800}
    fps={30}
    width={1920}
    height={1080}
    schema={epicSchema}
    defaultProps={{
      channelName: 'TU CANAL',
      avatarName: 'TUX',
      accentColor: '#ffd60a',
    }}
  />
);
