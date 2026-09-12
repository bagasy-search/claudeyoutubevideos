/**
 * GALERÍA DEV del kit AGUA OXIGENADA — no es un video real, es el banco de pruebas
 * para construir/validar cada componente aislado (motion + timing de SFX).
 * Preview:  npx remotion studio src/index_pxkit.tsx   → comp "PeroxideKit"
 */
import React from 'react';
import {Series} from 'remotion';
import {sec} from './theme';
import {BottleUncap, GluGluPour, FoamClean, TrickCard} from './PeroxideKit';

const A = sec(4.5);

export const TOTAL_FRAMES_PXKIT = A * 4;

export const PeroxideShowcase: React.FC = () => (
  <Series>
    <Series.Sequence durationInFrames={A}>
      <BottleUncap durationInFrames={A} eyebrow="Agua oxigenada" title="9 trucos que nadie te contó" />
    </Series.Sequence>
    <Series.Sequence durationInFrames={A}>
      <TrickCard durationInFrames={A} n={3} title="Juntas del baño como nuevas" sub="sin refregar" />
    </Series.Sequence>
    <Series.Sequence durationInFrames={A}>
      <GluGluPour durationInFrames={A} eyebrow="Cómo se aplica" title="Un chorrito basta" />
    </Series.Sequence>
    <Series.Sequence durationInFrames={A}>
      <FoamClean durationInFrames={A} eyebrow="Antes y después" title="La espuma hace el trabajo" cleanLabel="¡LIMPIO!" />
    </Series.Sequence>
  </Series>
);
