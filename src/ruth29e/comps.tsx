import React from "react";
import { H } from "./hkit";
import { HCE } from "./ruth_e";
import { HCE2 } from "./ruth_e2";
import { HCE4 } from "./ruth_e4";
import { HCE5 } from "./ruth_e5";
export const HC: Record<string, React.FC<{ t: number; h: H }>> = { ...HCE, ...HCE2, ...HCE4, ...HCE5 };
