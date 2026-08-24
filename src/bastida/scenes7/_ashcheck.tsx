import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {AshFurnaceScene} from './AshFurnaceScene';

const Root: React.FC = () => (
  <>
    <Composition id="AshCheck" component={AshFurnaceScene} durationInFrames={430} fps={30} width={1920} height={1080} />
  </>
);

registerRoot(Root);
