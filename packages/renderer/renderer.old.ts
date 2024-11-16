import { ScratchProject } from "+scratch";
import { existsSync } from "fs";
import { Node, Project, ts, TypeChecker, VariableStatement } from "ts-morph";

export const morph = async (): Promise<Project> => {
    if (!existsSync("tsconfig.json")) {
        return Promise.reject(new Error("No config file found"));
    }

    return new Project({
        tsConfigFilePath: "tsconfig.json",
    });
};

function parseValue(value: string): any {
    try {
        const parsed = JSON.parse(value);
        if (typeof parsed === "number" || typeof parsed === "boolean" || Array.isArray(parsed) || typeof parsed === "string") {
            return parsed;
        }
    } catch (e) {
        // If JSON.parse fails, return the original string
    }
    return value;
}

function renderVariableStatement(scratchProject: ScratchProject, node: VariableStatement, checker: TypeChecker) {
    const declaration = node.getDeclarationList().getDeclarations()[0];
    const name = declaration.getName();
    const value = declaration.getInitializer()?.getText();
    if (value === undefined) return;

    const parsedValue = parseValue(value);

    const kind = declaration.getInitializer()?.getKind();
    const targetName = "Stage"; // Assuming all variables are added to the Stage target

    if (kind === ts.SyntaxKind.ArrayLiteralExpression) {
        scratchProject.list(targetName, name, parsedValue);
    } else {
        scratchProject.variable(targetName, name, parsedValue);
    }
}

const nodeRenderers: Partial<Record<ts.SyntaxKind, (scratchProject: ScratchProject, node: Node, checker: TypeChecker) => void>> = {
    [ts.SyntaxKind.VariableStatement]: (scratchProject, node, checker) => renderVariableStatement(scratchProject, node as VariableStatement, checker),
};

export const render = async () => {
    const project = await morph();
    const sourceFiles = project.getSourceFiles();

    const scratchProject = new ScratchProject();

    sourceFiles.forEach((sourceFile) => {
        sourceFile.forEachDescendant((node) => {
            const renderer = nodeRenderers[node.getKind()];
            if (renderer) {
                renderer(scratchProject, node, project.getTypeChecker());
            }
        });
    });

    console.log(scratchProject.data);

    return scratchProject.data;
};