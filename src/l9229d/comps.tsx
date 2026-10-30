import React from "react";
import { H } from "./hkit";
import { HCD } from "./lou_d";
import { HCD2 } from "./lou_d2";
import { HCD3 } from "./lou_d3";
import { HCD4 } from "./lou_d4";
export const HC: Record<string, React.FC<{ t: number; h: H }>> = { ...HCD, ...HCD2, ...HCD3, ...HCD4, };
