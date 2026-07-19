import { Variants } from "framer-motion";
import { transitions } from "./transitions";

export const chartLine: Variants = {
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1, transition: { duration: 1.5, ease: "easeInOut" } },
};

export const chartBar: Variants = {
  initial: { scaleY: 0, opacity: 0 },
  animate: { scaleY: 1, opacity: 1, transition: transitions.smooth },
};
