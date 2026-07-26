// Banco de pruebas TEMPORAL de las variantes de transición.
// Cada escena arranca 4 frames antes de un múltiplo de 100, así el still de los frames
// 100/200/300/400 cae EXACTAMENTE en el mismo instante del whip de entrada de cada una
// (frame 4 de 12) y las cuatro se comparan en igualdad de condiciones.
import React from 'react';
import {AbsoluteFill, Composition, registerRoot, Sequence, staticFile} from 'remotion';
import {FedStat, type FedTransitionVariant} from './FedererKit';

const VARIANTS: FedTransitionVariant[] = ['whip', 'lift', 'iris', 'fold'];
const DUR = 90;

const VarTest: React.FC = () => (
  <AbsoluteFill style={{background: '#020409'}}>
    {VARIANTS.map((v, i) => (
      <Sequence key={v} from={(i + 1) * 100 - 4} durationInFrames={DUR} name={v}>
        <FedStat
          kicker={`Variante · ${v}`}
          value={80}
          suffix="%"
          label="del envejecimiento lo hace el sol"
          sub="mismo contenido en las cuatro, para comparar el gesto"
          image={staticFile('img/vn2_fb_science.png')}
          mood="science"
          totalF={DUR}
          accent="#E9B44C"
          variant={v}
        />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Vn2VarTest"
    component={VarTest}
    durationInFrames={520}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(RemotionRoot);
