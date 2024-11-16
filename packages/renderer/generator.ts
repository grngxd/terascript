import { createSb3 } from "+builder/sb3";
import { ScratchProject } from "+scratch";
import { existsSync } from "fs";
import { Node, Project, ts, TypeChecker, VariableDeclaration } from "ts-morph";
import { renderVariableDeclaration } from "./builtin/variables";

export const morph = async (): Promise<Project> => {
    if (!existsSync("tsconfig.json")) {
        return Promise.reject(new Error("No config file found"));
    }

    return new Project({
        tsConfigFilePath: "tsconfig.json",
    });
};

export const render = async () => {
    const project = await morph();
    const sourceFiles = project.getSourceFiles();

    const scratchProject = new ScratchProject();

    sourceFiles.forEach((sourceFile) => {
        sourceFile.forEachDescendant((node) => {
            const renderer = renderers[node.getKind()];
            if (renderer) {
                renderer(scratchProject, node, project.getTypeChecker());
            }
        });
    });

    await createSb3(JSON.stringify(scratchProject), [], []);

    return scratchProject;
};

const renderers: Partial<Record<ts.SyntaxKind, (scratchProject: ScratchProject, node: Node, checker: TypeChecker) => void>> = {
    [ts.SyntaxKind.VariableDeclaration]: (scratchProject, node, checker) => renderVariableDeclaration(scratchProject, node as VariableDeclaration, checker),
};