import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-display-xl",
        "text-display-lg",
        "text-heading-xl",
        "text-heading-lg",
        "text-heading-md",
        "text-title-lg",
        "text-title-md",
        "text-body-lg",
        "text-body-md",
        "text-body-sm",
        "text-label",
        "text-caption",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
