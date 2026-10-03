// prueba local de ElNight (reloj, cascada, excluidor 3D)
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ElNightClock, ElMoneyFall, ElTED3D } from "./ElNight";
const D = 150;
const ITEMS = [<ElNightClock from="3:30 pm" to="7:00 am" label="headed home" />, <ElMoneyFall start={{ label: "1,200 lb at the dock", amount: 4200 }} minus={[{ label: "fuel", amount: 1050 }, { label: "ice", amount: 200 }, { label: "groceries, nets, repairs", amount: 250 }, { label: "two strikers' shares", amount: 1300 }]} every={15} />, <ElTED3D />];
export const NIGHT_TEST_FRAMES = ITEMS.length * D;
export const ElNightTest: React.FC = () => <AbsoluteFill>{ITEMS.map((el, i) => <Sequence key={i} from={i * D} durationInFrames={D}>{el}</Sequence>)}</AbsoluteFill>;
