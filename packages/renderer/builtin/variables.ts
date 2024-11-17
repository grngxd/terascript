import { GeneratorContext } from "+renderer/generator";
import { ScratchProject } from "+scratch";
import { ScratchOpCodes } from "+scratch/ast";
import { TypeChecker, VariableDeclaration } from "ts-morph";
import { renderExpression } from "./expressions";

export const renderVariableDeclaration = (ctx: GeneratorContext, scratchProject: ScratchProject, node: VariableDeclaration, checker: TypeChecker) => {
    const name = node.getName();
    const initializer = node.getInitializer();

    if (initializer) {
        const [expressionBlockId, expressionBlocks] = renderExpression(ctx, scratchProject, initializer, checker);
        const variableId = scratchProject.variable(undefined, name);

        const setVariableBlockId = scratchProject.createBlock({
            target: "Stage",
            opcode: ScratchOpCodes.DATA_SETVARIABLETO,
            fields: {
                VARIABLE: [name, variableId],
            },
            inputs: {
                VALUE: [1, expressionBlockId],
            },
            topLevel: true,
        });

        // Merge the expression blocks into the target's blocks
        Object.assign(scratchProject.data.targets[0].blocks, expressionBlocks);

        // Store the variable ID and the block ID that sets the variable
        ctx.variables[name] = [variableId, setVariableBlockId];
    }
};