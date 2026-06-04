import { useCallback, useEffect, useState } from "react";

export function useScrollEndEvent() {
  const [page, setPage] = useState<number>(0);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + Math.ceil(document.documentElement.scrollTop) ===
      document.documentElement.offsetHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return page;
}
