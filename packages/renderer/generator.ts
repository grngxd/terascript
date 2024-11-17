import { createSb3 } from "+builder/sb3";
import { ScratchProject } from "+scratch";
import { existsSync, writeFileSync } from "fs";
import { Node, Project, ts, TypeChecker, VariableDeclaration } from "ts-morph";
import { renderVariableDeclaration } from "./builtin/variables";

export const context: GeneratorContext = {
    variables: {},
}

export type GeneratorContext = {
    // { name: [uuid, value] }
    variables: Record<string, [string, any]>;
}

export const morph = async (): Promise<Project> => {
    if (!existsSync("tsconfig.json")) {
        return Promise.reject(new Error("No config file found"));
    }

    return new Project({
        tsConfigFilePath: "tsconfig.json",
    });
};

const renderers: Partial<Record<ts.SyntaxKind, (ctx: GeneratorContext, scratchProject: ScratchProject, node: Node, checker: TypeChecker) => void>> = {
    [ts.SyntaxKind.VariableDeclaration]: (ctx: GeneratorContext, scratchProject, node, checker) => renderVariableDeclaration(ctx, scratchProject, node as VariableDeclaration, checker),
};

export const render = async () => {
    const project = await morph();
    const sourceFiles = project.getSourceFiles();

    const scratchProject = new ScratchProject();

    sourceFiles.forEach((sourceFile) => {
        sourceFile.forEachDescendant((node) => {
            const renderer = renderers[node.getKind()];
            if (renderer) {
                renderer(context, scratchProject, node, project.getTypeChecker());
            }
        });
    });
    
    writeFileSync("scratch.json", JSON.stringify(scratchProject, null, 2));

    return scratchProject;
};

export const generate = async () => {
    const renderedProject = JSON.stringify(await render());
    return await createSb3(renderedProject, [], []);
};