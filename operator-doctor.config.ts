import { DoctorConfig } from "./scripts/doctor/types";

const config: DoctorConfig = {
  plugins: [],
  disabledRules: [],
  strict: false,
  strictThreshold: 80,
  ignorePaths: [
    "node_modules",
    ".next",
    "dist",
    "build"
  ]
};

export default config;
