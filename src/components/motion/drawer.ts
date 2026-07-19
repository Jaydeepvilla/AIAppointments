import { Variants } from "framer-motion";
import { transitions } from "./transitions";

export const drawerRight: Variants = {
  initial: { x: "100%", opacity: 1 },
  animate: { x: 0, opacity: 1, transition: transitions.smooth },
  exit: { x: "100%", opacity: 1, transition: transitions.smooth },
};

export const drawerLeft: Variants = {
  initial: { x: "-100%", opacity: 1 },
  animate: { x: 0, opacity: 1, transition: transitions.smooth },
  exit: { x: "-100%", opacity: 1, transition: transitions.smooth },
};

export const drawerBottom: Variants = {
  initial: { y: "100%", opacity: 1 },
  animate: { y: 0, opacity: 1, transition: transitions.smooth },
  exit: { y: "100%", opacity: 1, transition: transitions.smooth },
};
