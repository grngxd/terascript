import { createSb3 } from "+builder/sb3";
import { ScratchProject } from "+scratch";
import { ScratchOpCodes } from "+scratch/ast";
import { existsSync, writeFileSync } from "fs";
import { Node, Project, ts, TypeChecker, VariableDeclaration } from "ts-morph";
import { renderVariableDeclaration } from "./builtin/variables";

export const context: GeneratorContext = {
    sprites: {
        "Stage": {
            x: 0,
            y: 0,
            variables: {},
            lists: {},
            blocks: [],
        },
    },
}

export type GeneratorContext = {
    sprites: Record<string, {
        x: number;
        y: number;
        variables: Record<string, [any, any]>; // id: [variableId, setVariableBlockId]
        lists: Record<string, [any, any]>; // id: [listId, setListBlockId]
        // [ [ blockId:{ ... }, ... ], [ blockID: ] ]
        blocks: {
            target: string;
            opcode: ScratchOpCodes;
            next?: string;
            parent?: string;
            x?: number;
            y?: number;
            topLevel?: boolean;
            inputs?: Record<string, any>;
            fields?: Record<string, any>;
            shadow?: boolean;
        }[][];
    }>;
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

    const wfc = scratchProject.createBlock({
        target: "Stage",
        opcode: ScratchOpCodes.WHEN_FLAG_CLICKED,
        topLevel: true,
        x: 0,
        y: 0,
    });

    let lastBlockId: string | undefined = wfc;
    Object.entries(context.sprites["Stage"].blocks).forEach(([name, [variableId, setVariableBlockId]]) => {
        if (lastBlockId) {
            scratchProject.editBlock("Stage", lastBlockId, {
                next: setVariableBlockId,
            });
        }
        lastBlockId = setVariableBlockId;
    });

    writeFileSync("scratch.json", JSON.stringify(scratchProject, null, 2));

    return scratchProject;
};

export const generate = async () => {
    const renderedProject = JSON.stringify(await render());
    return await createSb3(renderedProject, [], []);
};