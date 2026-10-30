import React from "react";
import { H } from "./hkit";
import { HCB } from "./ruth_b";
import { HCB2 } from "./ruth_b2";
import { HCB4 } from "./ruth_b4";
import { HCB5 } from "./ruth_b5";
export const HC: Record<string, React.FC<{ t: number; h: H }>> = { ...HCB, ...HCB2, ...HCB4, ...HCB5 };
