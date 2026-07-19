import { Variants } from "framer-motion";
import { transitions } from "./transitions";

export const dropdownVariants: Variants = {
  initial: { opacity: 0, scale: 0.97, y: -5 },
  animate: { opacity: 1, scale: 1, y: 0, transition: transitions.spring },
  exit: { opacity: 0, scale: 0.97, y: -5, transition: transitions.easeOut },
};
