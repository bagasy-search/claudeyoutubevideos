// stan29a · registro de los componentes únicos (heroes.json → k) y las preguntas del mostrador.
import React from "react";
import { H } from "./hkit";
import { HCaliper, HDial, HDoneness, HDrain, HBucket, HFlip, HLayers, HLoupe, HPeel, HPolaroid, HProbe, HReceipt, HRoute, HRule, HSand, HShimmer, HTimer, HTowel } from "./sh1";
import { HBalance, HBaste, HCork, HEnvelope, HFridge, HNever, HNight, HOven, HPig, HPuddle, HRelax, HTicket, HWeekend } from "./sh2";

export const HC: Record<string, React.FC<{ t: number; h: H }>> = { receipt: HReceipt, polaroid: HPolaroid, caliper: HCaliper, doneness: HDoneness, loupe: HLoupe, drain: HDrain, dial: HDial,
  bucket: HBucket, sand: HSand, timer: HTimer, towel: HTowel, shimmer: HShimmer, flip: HFlip, layers: HLayers, rule: HRule, probe: HProbe, peel: HPeel, route: HRoute,
  baste: HBaste, puddle: HPuddle, relax: HRelax, envelope: HEnvelope, fridge: HFridge, night: HNight, weekend: HWeekend, never: HNever, cork: HCork, oven: HOven, pig: HPig,
  balance: HBalance, ticket: HTicket };
export const COMMENTS: { n: string; from: string; txt: string }[] = [];
