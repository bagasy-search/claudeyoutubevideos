import React from "react";
import { H } from "./hkit";
import { HCC } from "./ruth_c";
import { HCC2 } from "./ruth_c2";
import { HCC4 } from "./ruth_c4";
import { HCC5 } from "./ruth_c5";
export const HC: Record<string, React.FC<{ t: number; h: H }>> = { ...HCC, ...HCC2, ...HCC4, ...HCC5 };
