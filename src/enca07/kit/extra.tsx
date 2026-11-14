// Chief Aurelio · adaptador de los componentes extra (extra_base.tsx) a la API del Player ({dur, ...props}).
import React from "react";
import { useCurrentFrame } from "remotion";
import * as X from "./extra_base";
const wrap = (Comp: React.FC<any>): React.FC<any> => ({ dur, ...p }) => {
  const f = useCurrentFrame();
  return <Comp t={f / 30} a={0} d={dur / 30} {...p} />;
};
export const EXTRA: Record<string, React.FC<any>> = {
  Calendario: wrap(X.Calendario), Dias: wrap(X.Dias), Cuaderno: wrap(X.Cuaderno), Cartas: wrap(X.Cartas), Reglas: wrap(X.Reglas),
  Escalera: wrap(X.Escalera), Barras: wrap(X.Barras), Distancia: wrap(X.Distancia), Frase: wrap(X.Frase), PaySlip: wrap(X.PaySlip),
  SatTel: wrap(X.SatTel), Cita: wrap(X.Cita), Numero: wrap(X.Numero), Medidor: wrap(X.Medidor),
};
