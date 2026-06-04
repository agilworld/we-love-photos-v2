export type MediaQueryType = "sm" | "md" | "lg" | "xl" | "2xl";

export function isScreen(type: MediaQueryType) {
  let mql: MediaQueryList;

  switch (type) {
    case "sm":
      mql = window.matchMedia("(max-width: 640px)");
      break;

    case "md":
      mql = window.matchMedia("(max-width: 768px)");
      break;

    case "lg":
      mql = window.matchMedia("(max-width: 1024px)");
      break;

    case "xl":
      mql = window.matchMedia("(max-width: 1280px)");
      break;

    case "2xl":
      mql = window.matchMedia("(max-width: 1536px)");
      break;

    default:
      mql = window.matchMedia("(max-width: 1280px)");
      break;
  }

  return mql.matches;
}
