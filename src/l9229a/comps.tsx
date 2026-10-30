import React from "react";
import { H } from "./hkit";
import { HCA } from "./lou_a";
import { HCA2 } from "./lou_a2";
import { HCA3 } from "./lou_a3";
export const HC: Record<string, React.FC<{ t: number; h: H }>> = { ...HCA, ...HCA2, ...HCA3, };
