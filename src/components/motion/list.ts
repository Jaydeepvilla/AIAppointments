import { Variants } from "framer-motion";
import { transitions } from "./transitions";

export const listItem: Variants = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0, transition: transitions.easeOut },
  exit: { opacity: 0, x: -10, transition: transitions.easeOut },
};
