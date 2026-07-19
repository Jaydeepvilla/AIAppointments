import { Variants } from "framer-motion";
import { transitions } from "./transitions";

export const scaleUp: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: transitions.spring },
  exit: { opacity: 0, scale: 0.95, transition: transitions.easeOut },
};

export const scalePop: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1, transition: transitions.snappy },
  exit: { opacity: 0, scale: 0.8, transition: transitions.easeOut },
};
