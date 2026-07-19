import { Variants } from "framer-motion";
import { transitions } from "./transitions";

export const modalBackdrop: Variants = {
  initial: { opacity: 0, backdropFilter: "blur(0px)" },
  animate: { opacity: 1, backdropFilter: "blur(4px)", transition: transitions.easeOut },
  exit: { opacity: 0, backdropFilter: "blur(0px)", transition: transitions.easeOut },
};

export const modalContent: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: { opacity: 1, scale: 1, y: 0, transition: transitions.smooth },
  exit: { opacity: 0, scale: 0.95, y: 10, transition: transitions.easeOut },
};
