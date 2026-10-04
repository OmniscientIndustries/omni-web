import type { ProceduralVisual as Kind } from "@/content/industries";
import { AirportApron } from "./AirportApron";
import { BrainVisual } from "./BrainVisual";
import { ConstructionTwin } from "./ConstructionTwin";
import { FarmingLayers } from "./FarmingLayers";
import { MiningSite } from "./MiningSite";
import { SarvaPattern } from "./SarvaPattern";

export type VisualKind = Kind | "brain";

/**
 * Procedural stand-ins for imagery that has not yet been approved.
 * They keep stable dimensions and the brand palette until final assets land in /public/media.
 */
export function ProceduralVisual({ kind, uid }: { kind: VisualKind; uid?: string }) {
  const id = uid ?? kind;
  switch (kind) {
    case "sarva":
      return <SarvaPattern uid={id} />;
    case "construction":
      return <ConstructionTwin uid={id} />;
    case "airports":
      return <AirportApron uid={id} />;
    case "farming":
      return <FarmingLayers uid={id} />;
    case "mining":
      return <MiningSite uid={id} />;
    case "brain":
      return <BrainVisual uid={id} />;
  }
}
