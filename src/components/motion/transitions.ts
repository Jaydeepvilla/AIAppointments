import { Transition } from "framer-motion";

export const transitions: Record<string, Transition> = {
  spring: { type: "spring", stiffness: 400, damping: 30 },
  snappy: { type: "spring", stiffness: 500, damping: 25 },
  easeOut: { type: "tween", ease: "easeOut", duration: 0.2 },
  easeInOut: { type: "tween", ease: "easeInOut", duration: 0.3 },
  slow: { type: "tween", ease: "easeInOut", duration: 0.5 },
  smooth: { type: "spring", stiffness: 300, damping: 40 },
};
