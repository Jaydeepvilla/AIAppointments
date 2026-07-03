import { Project, SyntaxKind, JsxOpeningElement, JsxSelfClosingElement } from "ts-morph";
import path from "path";
import fs from "fs";

const NATIVE_TO_SHARED: Record<string, string> = {
  button: "Button",
  input: "Input",
};

const cwd = process.cwd();
const project = new Project({
  tsConfigFilePath: path.join(cwd, "tsconfig.json"),
});

const sharedComponentsPath = path.join(cwd, "src", "components", "shared");

let changedFilesCount = 0;
let replacedElementsCount = 0;

for (const sourceFile of project.getSourceFiles()) {
  const filePath = sourceFile.getFilePath();

  // Skip files within components/ui or components/shared to avoid tampering with the library itself
  if (filePath.includes("components/ui") || filePath.includes("components/shared")) {
    continue;
  }

  // Find all JSX elements
  const jsxElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxOpeningElement);
  const jsxSelfClosingElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement);
  
  const allElements = [...jsxElements, ...jsxSelfClosingElements];
  
  let fileModified = false;
  const componentsToImport = new Set<string>();

  for (const element of allElements) {
    const tagNameNode = element.getTagNameNode();
    const tagName = tagNameNode.getText();

    if (NATIVE_TO_SHARED[tagName]) {
      const sharedName = NATIVE_TO_SHARED[tagName];
      const sharedFile = path.join(sharedComponentsPath, `${sharedName.toLowerCase()}.tsx`);
      
      // Proceed only if the shared component actually exists
      if (fs.existsSync(sharedFile)) {
        tagNameNode.replaceWithText(sharedName);
        componentsToImport.add(sharedName);
        fileModified = true;
        replacedElementsCount++;
        
        // If it's a JsxOpeningElement, we must also replace the closing element
        if (element.getKind() === SyntaxKind.JsxOpeningElement) {
          const parent = element.getParentIfKind(SyntaxKind.JsxElement);
          if (parent) {
            const closingElement = parent.getClosingElement();
            const closingTagNameNode = closingElement.getTagNameNode();
            if (closingTagNameNode.getText() === tagName) {
              closingTagNameNode.replaceWithText(sharedName);
            }
          }
        }
      }
    }
  }

  if (fileModified) {
    // Determine existing imports
    for (const component of componentsToImport) {
      const importPath = `@/components/shared/${component.toLowerCase()}`;
      
      // Check if it's already imported
      const hasImport = sourceFile.getImportDeclarations().some(imp => {
        const moduleSpecifier = imp.getModuleSpecifierValue();
        return moduleSpecifier === importPath && imp.getNamedImports().some(ni => ni.getName() === component);
      });
      
      if (!hasImport) {
        // Find if there's already an import for this path
        const existingImportDecl = sourceFile.getImportDeclarations().find(imp => imp.getModuleSpecifierValue() === importPath);
        if (existingImportDecl) {
          existingImportDecl.addNamedImport(component);
        } else {
          sourceFile.addImportDeclaration({
            namedImports: [component],
            moduleSpecifier: importPath,
          });
        }
      }
    }

    sourceFile.saveSync();
    changedFilesCount++;
    console.log(`Updated ${filePath}`);
  }
}

console.log(`\nCodemod Complete.`);
console.log(`Files modified: ${changedFilesCount}`);
console.log(`Elements replaced: ${replacedElementsCount}`);
