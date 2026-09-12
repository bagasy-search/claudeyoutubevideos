import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {RenalItemCard} from './bastida/RenalItemCard';
import {BAS} from './bastida/theme';

const Root: React.FC = () => (
  <>
    <Composition id="QCardGood" component={RenalItemCard as any} durationInFrames={200} fps={30} width={1920} height={1080}
      defaultProps={{n: '3', name: 'Queso suizo', note: 'De los más bajos en sodio', img: 'img/qr_suizo.jpg', accent: BAS.si, side: 'right'} as any} />
    <Composition id="QCardBad" component={RenalItemCard as any} durationInFrames={200} fps={30} width={1920} height={1080}
      defaultProps={{n: '2', name: 'Queso azul', note: 'De los más salados que hay', img: 'img/qr_azul.jpg', accent: BAS.no, side: 'left'} as any} />
  </>
);
registerRoot(Root);
