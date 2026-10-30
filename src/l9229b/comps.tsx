import React from "react";
import { H } from "./hkit";
import { HCB } from "./lou_b";
import { HCB2 } from "./lou_b2";
import { HCB3 } from "./lou_b3";
export const HC: Record<string, React.FC<{ t: number; h: H }>> = { ...HCB, ...HCB2, ...HCB3, };
