import { Project } from "ts-morph";
import glob from "fast-glob";
import path from "path";
import fs from "fs";
import { DoctorConfig } from "../types";

/**
 * Parses all TypeScript/React files in the src directory and caches them.
 */
export async function loadAstProject(cwd: string, config: DoctorConfig, changedFiles?: string[]) {
  const project = new Project({
    tsConfigFilePath: path.join(cwd, "tsconfig.json"),
    skipAddingFilesFromTsConfig: true,
  });

  // Handle ignored paths
  const ignorePatterns = config.ignorePaths?.map(p => `!**/${p}/**`) || [];
  
  let files = await glob([
    "src/**/*.{ts,tsx}",
    ...ignorePatterns
  ], { cwd, absolute: true });

  if (changedFiles) {
    const changedSet = new Set(changedFiles.map(f => path.resolve(f).replace(/\\/g, '/')));
    files = files.filter(f => changedSet.has(path.resolve(f).replace(/\\/g, '/')));
    
    const dependencies = new Set<string>();
    const importRegex = /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g;
    const dynamicImportRegex = /import\(['"]([^'"]+)['"]\)/g;
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf-8');
        
        const extractImports = (regex: RegExp) => {
          let match;
          while ((match = regex.exec(content)) !== null) {
            const importPath = match[1];
            
            let resolvedPath = "";
            if (importPath.startsWith("@/")) {
              resolvedPath = path.join(cwd, "src", importPath.substring(2));
            } else if (importPath.startsWith(".")) {
              resolvedPath = path.join(path.dirname(file), importPath);
            } else {
              continue;
            }
            
            const extensions = [".tsx", ".ts", ".jsx", ".js"];
            let found = false;
            
            // Direct or with extension
            if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()) {
                dependencies.add(path.resolve(resolvedPath).replace(/\\/g, '/'));
                found = true;
            }
            
            if (!found) {
                for (const ext of extensions) {
                    if (fs.existsSync(`${resolvedPath}${ext}`)) {
                        dependencies.add(path.resolve(`${resolvedPath}${ext}`).replace(/\\/g, '/'));
                        found = true;
                        break;
                    }
                }
            }
            
            if (!found) {
                for (const ext of extensions) {
                    const indexPath = path.join(resolvedPath, `index${ext}`);
                    if (fs.existsSync(indexPath)) {
                        dependencies.add(path.resolve(indexPath).replace(/\\/g, '/'));
                        break;
                    }
                }
            }
          }
        };
        
        extractImports(importRegex);
        extractImports(dynamicImportRegex);
      } catch (e) {
         // Ignore errors reading file
      }
    }
    
    for (const dep of dependencies) {
      if (!changedSet.has(dep)) {
        files.push(dep);
      }
    }
  }

  // Basic mtime cache setup (just stores the hash/mtime to indicate staleness)
  const cacheDir = path.join(cwd, ".doctor");
  const cachePath = path.join(cacheDir, "cache.json");
  
  let cache: Record<string, number> = {};
  if (fs.existsSync(cachePath)) {
    try { cache = JSON.parse(fs.readFileSync(cachePath, "utf-8")); } catch(e) {}
  } else {
    if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
  }

  const updatedCache: Record<string, number> = {};
  const filesToAdd: string[] = [];

  for (const file of files) {
    const stats = fs.statSync(file);
    updatedCache[file] = stats.mtimeMs;
    // If the file changed, or isn't in cache, we definitely process it. 
    // Since ts-morph requires files to resolve cross-file references, we add all files.
    // In a true AST cache, you'd only add changed files and keep the Project in memory.
    // For single-run CLI, we must add all files. The cache is more useful for Watch mode or rule-level caching.
    filesToAdd.push(file);
  }

  // Write new cache
  fs.writeFileSync(cachePath, JSON.stringify(updatedCache, null, 2));

  project.addSourceFilesAtPaths(filesToAdd);

  return project;
}
