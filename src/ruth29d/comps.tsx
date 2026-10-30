import React from "react";
import { H } from "./hkit";
import { HCD } from "./ruth_d";
import { HCD2 } from "./ruth_d2";
import { HCD4 } from "./ruth_d4";
import { HCD5 } from "./ruth_d5";
import { HCD6 } from "./ruth_d6";
export const HC: Record<string, React.FC<{ t: number; h: H }>> = { ...HCD, ...HCD2, ...HCD4, ...HCD5, ...HCD6 };
