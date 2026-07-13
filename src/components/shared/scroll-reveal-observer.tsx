"use client";

import { useEffect } from "react";

/**
 * Observes all `.reveal` elements and adds `.reveal-visible` when they
 * enter the viewport. Uses IntersectionObserver for performance.
 *
 * Drop this component once at the layout level — it auto-discovers
 * every `.reveal` element in the subtree.
 */
export function ScrollRevealObserver() {
  useEffect(() => {
    // Respect reduced-motion preference
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const targets = document.querySelectorAll<HTMLElement>(".reveal");

    if (prefersReduced) {
      // Immediately show everything
      targets.forEach(el => el.classList.add("reveal-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            observer.unobserve(entry.target); // once only
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null; // renderless
}
