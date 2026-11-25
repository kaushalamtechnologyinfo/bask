import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function useGSAP(effect, dependencies = []) {
  const scopeRef = useRef(null);

  useEffect(() => {
    if (!scopeRef.current) return;
    const ctx = gsap.context((contextSelf) => {
      effect(scopeRef.current, contextSelf);
    }, scopeRef.current);

    return () => ctx.revert();
  }, dependencies);

  return scopeRef;
}
