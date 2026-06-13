import { useState, useEffect } from "react";

export function useColumnCount(): number {
  const [count, setCount] = useState<number>(3);

  useEffect(() => {
    const compute = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setCount(1);
      } else if (width < 1024) {
        setCount(2);
      } else {
        setCount(3);
      }
    };

    compute();
    window.addEventListener("resize", compute);

    return () => {
      window.removeEventListener("resize", compute);
    };
  }, []);

  return count;
}
