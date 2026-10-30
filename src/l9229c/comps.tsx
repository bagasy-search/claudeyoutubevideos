import React from "react";
import { H } from "./hkit";
import { HCC } from "./lou_c";
import { HCC2 } from "./lou_c2";
import { HCC3 } from "./lou_c3";
import { HCC4 } from "./lou_c4";
export const HC: Record<string, React.FC<{ t: number; h: H }>> = { ...HCC, ...HCC2, ...HCC3, ...HCC4, };
