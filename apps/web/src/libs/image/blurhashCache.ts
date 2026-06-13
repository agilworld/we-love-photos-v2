import { blurhashToDataUrl } from "./decodeBlurhash";

const cache = new Map<string, string>();

export function getCachedBlurhash(
  hash: string,
  w: number,
  h: number,
): string {
  if (typeof window === "undefined") {
    return "";
  }

  const key = `${hash}:${w}x${h}`;
  let url = cache.get(key);

  if (!url) {
    url = blurhashToDataUrl(hash, w, h);
    if (url) {
      cache.set(key, url);
    }
  }

  return url;
}