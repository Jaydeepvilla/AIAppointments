import { TargetAndTransition } from "framer-motion";

export const hoverScale: TargetAndTransition = {
  scale: 1.02,
  transition: { type: "spring", stiffness: 400, damping: 25 },
};

export const tapScale: TargetAndTransition = {
  scale: 0.97,
};

export const hoverLift: TargetAndTransition = {
  y: -2,
  transition: { type: "spring", stiffness: 400, damping: 25 },
};
