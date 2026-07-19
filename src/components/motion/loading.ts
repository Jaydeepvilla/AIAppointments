import { Variants } from "framer-motion";

export const skeletonShimmer: Variants = {
  initial: { backgroundPosition: "-1000px 0" },
  animate: {
    backgroundPosition: "1000px 0",
    transition: { repeat: Infinity, duration: 1.5, ease: "linear" },
  },
};

export const spinnerRotate: Variants = {
  animate: {
    rotate: 360,
    transition: { repeat: Infinity, duration: 1, ease: "linear" },
  },
};
