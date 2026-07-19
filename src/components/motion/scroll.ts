import { Variants } from "framer-motion";
import { transitions } from "./transitions";

export const scrollReveal: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: transitions.smooth },
};

export const scrollRevealStagger: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: transitions.smooth },
};
