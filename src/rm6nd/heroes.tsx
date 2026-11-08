// tec29: los héroes se dibujan con ctec.tsx (TEC por h.ty); MAP queda vacío por compatibilidad con Main.
import type React from "react";
import type { H } from "./ckit";
export const MAP: Record<string, React.FC<{ t: number; h: H }>> = {};
