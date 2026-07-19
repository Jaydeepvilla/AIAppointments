import { Variants } from "framer-motion";
import { transitions } from "./transitions";

export const fade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: transitions.easeOut },
  exit: { opacity: 0, transition: transitions.easeOut },
};

export const fadeSlow: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: transitions.slow },
  exit: { opacity: 0, transition: transitions.easeOut },
};
