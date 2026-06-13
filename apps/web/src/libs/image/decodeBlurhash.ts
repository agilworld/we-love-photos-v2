import { decode } from "blurhash";

export function blurhashToDataUrl(
  hash: string,
  width: number,
  height: number,
  punch = 1,
): string {
  if (typeof window === "undefined") {
    return "";
  }

  const w = Math.min(32, width || 32);
  const h = Math.min(32, height || 32);
  const pixels = decode(hash, w, h, punch);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return "";
  }

  const imgData = new ImageData(pixels as any, w, h);
  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL("image/png");
}