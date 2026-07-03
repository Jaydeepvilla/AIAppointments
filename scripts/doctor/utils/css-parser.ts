import fs from "fs/promises";
import path from "path";
import postcss from "postcss";
import glob from "fast-glob";

export interface CssTokens {
  cssVariables: Set<string>;
  utilities: Set<string>;
  keyframes: Set<string>;
  themeTokens: Set<string>; // tokens mapped to tailwind classes, e.g., 'primary' from --color-primary
}

/**
 * Parses CSS files to extract custom properties and theme configuration using PostCSS.
 */
export async function loadCssTokens(cwd: string, changedFiles?: string[]): Promise<CssTokens> {
  let cssFiles = await glob(["src/**/*.css", "app/**/*.css"], { cwd, absolute: true });
  
  if (changedFiles) {
    const changedSet = new Set(changedFiles.map(f => path.resolve(cwd, f).replace(/\\/g, '/')));
    cssFiles = cssFiles.filter(f => changedSet.has(path.resolve(cwd, f).replace(/\\/g, '/')));
  }
  
  const tokens: CssTokens = {
    cssVariables: new Set(),
    utilities: new Set(),
    keyframes: new Set(),
    themeTokens: new Set(),
  };

  for (const file of cssFiles) {
    const content = await fs.readFile(file, "utf-8");
    const root = postcss.parse(content);

    root.walkDecls((decl) => {
      // Collect CSS variables
      if (decl.prop.startsWith("--")) {
        tokens.cssVariables.add(decl.prop);
        
        // Infer theme tokens (Tailwind v4 maps --color-primary to bg-primary, text-primary, etc)
        const match = decl.prop.match(/^--(color|spacing|radius|shadow|font|space|primary|neutral|success|warning|error)-(.+)$/);
        if (match) {
          // Add the suffix as a valid theme token (e.g. 'primary', '500', 'destructive')
          // Wait, if it's `--color-primary`, the token is `primary`. If `--color-primary-500`, token is `primary-500`.
          // If it's `--spacing-space-4`, token is `space-4`.
          tokens.themeTokens.add(match[2]);
        }
      }
    });

    root.walkAtRules("utility", (rule) => {
      tokens.utilities.add(rule.params.trim());
    });

    root.walkAtRules("keyframes", (rule) => {
      tokens.keyframes.add(rule.params.trim());
    });
  }

  return tokens;
}
