import { useCallback, useRef } from "react";

export function useVisibility(cb: (isVisible: boolean) => void, deps: React.DependencyList): (node: any) => void {
    const intersectionObserver = useRef<IntersectionObserver | null>(null);
    return useCallback(node => {
      if (intersectionObserver.current) {
        intersectionObserver.current.disconnect();
      }
  
      intersectionObserver.current = new IntersectionObserver(([entry]) => {
        cb(entry.isIntersecting);
      });
  
      if (node) intersectionObserver.current.observe(node);
    }, deps); 
  }
