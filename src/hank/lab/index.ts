// Registro del lab de componentes Hank Out Back (cada componente en su archivo)
import React from "react";
import { CalendarRipper } from "./CalendarRipper";
import { ChapterCard } from "./ChapterCard";
import { CircleCallout } from "./CircleCallout";
import { DepthStill } from "./DepthStill";
import { DocHighlighter } from "./DocHighlighter";
import { EatOutSection } from "./EatOutSection";
import { EvidenceBoard } from "./EvidenceBoard";
import { FailedFixes } from "./FailedFixes";
import { FloridaDropMap } from "./FloridaDropMap";
import { FlowSplit } from "./FlowSplit";
import { FurTicker } from "./FurTicker";
import { GlobeDive3D } from "./GlobeDive3D";
import { PeltStacks } from "./PeltStacks";
import { PopulationSpread } from "./PopulationSpread";
import { ReceiptPrinter } from "./ReceiptPrinter";
import { ScaleSquares } from "./ScaleSquares";
import { SplitFlapBoard } from "./SplitFlapBoard";
import { SpotlightHunt } from "./SpotlightHunt";
import { TallyZoom } from "./TallyZoom";
import { ThermoDrop } from "./ThermoDrop";
import { VhsRewind } from "./VhsRewind";

export const LAB: Record<string, React.FC<any>> = { CalendarRipper, ChapterCard, CircleCallout, DepthStill, DocHighlighter, EatOutSection, EvidenceBoard, FailedFixes, FloridaDropMap, FlowSplit, FurTicker, GlobeDive3D, PeltStacks, PopulationSpread, ReceiptPrinter, ScaleSquares, SplitFlapBoard, SpotlightHunt, TallyZoom, ThermoDrop, VhsRewind };
