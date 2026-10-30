import React from "react";
import { H } from "./hkit";
import { HCE } from "./lou_e";
import { HCE2 } from "./lou_e2";
import { HCE3 } from "./lou_e3";
import { HCE4 } from "./lou_e4";
export const HC: Record<string, React.FC<{ t: number; h: H }>> = { ...HCE, ...HCE2, ...HCE3, ...HCE4, };
