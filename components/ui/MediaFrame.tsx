import Image from "next/image";
import { ProceduralVisual, type VisualKind } from "@/components/industries/visuals";
import type { MediaAsset } from "@/content/industries";

type Props = {
  image?: MediaAsset;
  procedural?: VisualKind;
  uid?: string;
  sizes: string;
  className?: string;
  imageClassName?: string;
  preload?: boolean;
  decorative?: boolean;
};

/** Renders approved imagery when available, otherwise a deliberate procedural visual. */
export function MediaFrame({
  image,
  procedural,
  uid,
  sizes,
  className = "",
  imageClassName = "",
  preload,
  decorative,
}: Props) {
  return (
    <div className={`relative overflow-hidden bg-ink-900 ${className}`}>
      {image ? (
        <Image
          src={image.src}
          alt={decorative ? "" : image.alt}
          fill
          sizes={sizes}
          preload={preload}
          className={`object-cover ${imageClassName}`}
          style={{ objectPosition: image.focal ?? "50% 50%" }}
        />
      ) : procedural ? (
        <div className={`absolute inset-0 ${imageClassName}`} aria-hidden={decorative || undefined}>
          <ProceduralVisual kind={procedural} uid={uid} />
        </div>
      ) : (
        // Missing asset: deliberate dark gradient placeholder with stable dimensions.
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(70%_70%_at_60%_40%,#1a1710,#050505)]" />
      )}
    </div>
  );
}
