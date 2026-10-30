import React from "react";
import { H } from "./hkit";
import { HCA } from "./ruth_a";
import { HCA2 } from "./ruth_a2";
import { HCA4 } from "./ruth_a4";
import { HCA5 } from "./ruth_a5";
export const HC: Record<string, React.FC<{ t: number; h: H }>> = { ...HCA, ...HCA2, ...HCA4, ...HCA5 };
