"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getCachedBlurhash } from "@/libs/image/blurhashCache";
import { cn } from "@/libs/utils";

type BlurHashImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurHash?: string;
  color?: string;
  className?: string;
};

export function BlurHashImage({
  src,
  alt,
  width,
  height,
  blurHash,
  color,
  className,
}: BlurHashImageProps) {
  const [phase, setPhase] = useState<"buffer" | "ready">("buffer");
  const [placeholder, setPlaceholder] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (blurHash && width && height) {
      setPlaceholder(getCachedBlurhash(blurHash, width, height));
    }
  }, [blurHash, width, height]);

  const reveal = useCallback(() => {
    requestAnimationFrame(() => setPhase("ready"));
  }, []);

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      reveal();
    }
  }, [reveal]);

  return (
    <div
      className={cn("relative overflow-hidden rounded-lg mx-auto", className)}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          phase === "ready" ? "opacity-0" : "opacity-100",
        )}
        style={{
          backgroundImage: placeholder ? `url(${placeholder})` : undefined,
          backgroundColor: !placeholder ? (color ?? "#e2e8f0") : undefined,
          backgroundSize: "cover",
          scale: phase === "buffer" && placeholder ? "1.02" : "1",
        }}
      />
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={reveal}
        onError={() => setPhase("ready")}
        className={cn(
          "absolute mx-auto inset-0 h-full w-full object-cover transition-opacity duration-500",
          phase === "ready" ? "opacity-100" : "opacity-0",
        )}
      />
    </div>
  );
}
