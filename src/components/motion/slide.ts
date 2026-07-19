import { Variants } from "framer-motion";
import { transitions } from "./transitions";

export const slideUp: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: transitions.smooth },
  exit: { opacity: 0, y: 15, transition: transitions.easeOut },
};

export const slideDown: Variants = {
  initial: { opacity: 0, y: -15 },
  animate: { opacity: 1, y: 0, transition: transitions.smooth },
  exit: { opacity: 0, y: -15, transition: transitions.easeOut },
};

export const slideLeft: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: transitions.smooth },
  exit: { opacity: 0, x: 20, transition: transitions.easeOut },
};

export const slideRight: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: transitions.smooth },
  exit: { opacity: 0, x: -20, transition: transitions.easeOut },
};
