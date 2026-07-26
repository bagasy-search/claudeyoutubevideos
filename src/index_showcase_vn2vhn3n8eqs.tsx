// Vitrina TEMPORAL de auditoría: encadena los componentes nuevos que el muestreo del
// video completo no llega a tocar (sus beats duran 3-5s sobre 21 minutos). Un solo job
// de stills y los veo a todos. No entra en el render final.
import React from 'react';
import {AbsoluteFill, Composition, registerRoot, Sequence, staticFile} from 'remotion';
import {FedRivet} from './FedRivet_vn2vhn3n8eqs';
import {FedTrial} from './FedTrial_vn2vhn3n8eqs';
import {FedLabelScan} from './FedLabelScan_vn2vhn3n8eqs';
import {FedSeal} from './FedSeal_vn2vhn3n8eqs';
import {FedOilBars} from './FedOilBars_vn2vhn3n8eqs';
import {FedBrickWall} from './FedBrickWall_vn2vhn3n8eqs';
import {FedSplitFace} from './FedSplitFace_vn2vhn3n8eqs';
import {FedBlacklist} from './FedBlacklist_vn2vhn3n8eqs';
import {FedRoutineRing} from './FedRoutineRing_vn2vhn3n8eqs';

const ACCENT = '#E9B44C';
const D = 120;

const Showcase: React.FC = () => (
  <AbsoluteFill style={{background: '#020409'}}>
    <Sequence from={0} durationInFrames={D} name="Rivet">
      <FedRivet
        mode="rivet"
        title="Sin linoleico no hay remache"
        sub="y sin remache, la pared filtra"
        chainLabel="Ácido linoleico"
        targetLabel="Ceramida"
        resultLabel="Acilceramida · el remache"
        totalF={D}
        accent={ACCENT}
      />
    </Sequence>
    <Sequence from={D} durationInFrames={D} name="RivetDisorder">
      <FedRivet
        mode="disorder"
        title="El oleico abre la puerta"
        sub="desordena las láminas y abre huecos"
        chainLabel="Ácido oleico"
        targetLabel="Láminas de grasa"
        resultLabel="La pared filtra"
        totalF={D}
        accent={ACCENT}
      />
    </Sequence>
    <Sequence from={D * 2} durationInFrames={D} name="Trial">
      <FedTrial
        journal="Pediatric Dermatology"
        year="2013"
        n={19}
        design="aleatorizado · dos antebrazos · 4 semanas"
        title="El brazo del oliva perdió MÁS agua"
        sub="que antes de empezar"
        groupA={{label: 'Oliva', value: 24, suffix: '%', tone: 'bad'}}
        groupB={{label: 'Girasol', value: 7, suffix: '%', tone: 'good'}}
        unit="pérdida de agua"
        verdict="El oliva desarma la barrera"
        totalF={D}
        accent={ACCENT}
      />
    </Sequence>
    <Sequence from={D * 3} durationInFrames={D} name="LabelScan">
      <FedLabelScan
        title="El girasol común"
        sub="este es el que le sirve"
        labelName="ACEITE DE GIRASOL"
        labelSub="alto linoleico"
        verdict="ok"
        verdictLabel="PARA LA PIEL"
        liquid="#D8A33C"
        bars={[
          {label: 'Linoleico', pct: 60, tone: 'good'},
          {label: 'Oleico', pct: 25, tone: 'bad'},
        ]}
        totalF={D}
        accent={ACCENT}
      />
    </Sequence>
    <Sequence from={D * 4} durationInFrames={D} name="Seal">
      <FedSeal
        title="El aceite es la tapa, no el contenido"
        sub="un aceite vegetal puro es anhidro"
        leftLabel="Aceite sobre piel SECA"
        rightLabel="Aceite sobre piel HÚMEDA"
        leftNote="sella la nada"
        rightNote="sella el agua"
        dropLabel="0% de agua"
        totalF={D}
        accent={ACCENT}
      />
    </Sequence>
    <Sequence from={D * 5} durationInFrames={D} name="OilBars">
      <FedOilBars
        title="La proporción decide"
        sub="no el precio, no la marca, no el aroma"
        highlight="Oliva"
        cutoff={40}
        cutoffLabel="mínimo útil"
        foot="El oliva tiene la peor relación de la lista."
        totalF={D}
        accent={ACCENT}
      />
    </Sequence>
    <Sequence from={D * 6} durationInFrames={D} name="BrickWall">
      <FedBrickWall
        state="build"
        title="La pared de su piel"
        sub="ladrillos de células muertas, cemento de grasa"
        legend={[
          {label: 'Ceramidas', pct: '50%'},
          {label: 'Colesterol', pct: '25%'},
          {label: 'Ácidos grasos', pct: '25%'},
        ]}
        totalF={D}
        accent={ACCENT}
      />
    </Sequence>
    <Sequence from={D * 7} durationInFrames={D} name="SplitFace">
      <FedSplitFace
        image={staticFile('img/vn2_c32.png')}
        title="La misma cara, dos edades"
        sub="veinte años más de un solo lado"
        leftLabel="25 años contra la ventanilla"
        rightLabel="el otro lado, 69 años"
        callouts={['Piel engrosada y colgada', 'Surcos profundos', 'Poros dilatados y tapados']}
        journal="New England Journal of Medicine"
        year="2012"
        totalF={D}
        accent={ACCENT}
      />
    </Sequence>
    <Sequence from={D * 8} durationInFrames={D} name="Blacklist">
      <FedBlacklist
        index="01 / 03"
        name="Aceite de oliva"
        reason="Aumentó significativamente la pérdida de agua por la piel — también en piel perfectamente sana."
        evidence="Danby · Pediatric Dermatology · 2013"
        stamp="NO SE PONE"
        totalF={D}
        accent={ACCENT}
      />
    </Sequence>
    <Sequence from={D * 9} durationInFrames={D} name="RoutineRing">
      <FedRoutineRing step={4} kicker="Esta noche" totalF={D} accent={ACCENT} />
    </Sequence>
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Vn2Showcase"
    component={Showcase}
    durationInFrames={D * 10}
    fps={30}
    width={1920}
    height={1080}
  />
);

registerRoot(RemotionRoot);
