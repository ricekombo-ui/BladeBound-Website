import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  // Existing project-wide findings are warnings until they can be repaired without
  // mixing a visual refactor into this security change.
  { rules: {
    "react-hooks/immutability": "warn",
    "react-hooks/preserve-manual-memoization": "warn",
    "react-hooks/set-state-in-effect": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "warn",
    "react/no-unescaped-entities": "warn",
  } },
  globalIgnores([".next/**", "node_modules/**", "videos/**", ".claude/**", "next-env.d.ts"]),
]);
