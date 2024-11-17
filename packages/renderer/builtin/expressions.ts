import { GeneratorContext } from "+renderer/generator";
import { ScratchProject } from "+scratch";
import { ScratchBlocks, ScratchOpCodes } from "+scratch/ast";
import { generate } from "short-uuid";
import { BinaryExpression, Expression, TypeChecker } from "ts-morph";

export const renderExpression = (ctx: GeneratorContext, scratchProject: ScratchProject, expression: Expression, checker: TypeChecker): [string, ScratchBlocks] => {
    let blocks: ScratchBlocks = {};
    const bid = generate();

    if (expression instanceof BinaryExpression) {
        const [leftId, leftBlocks] = renderExpression(ctx, scratchProject, expression.getLeft(), checker);
        const [rightId, rightBlocks] = renderExpression(ctx, scratchProject, expression.getRight(), checker);

        blocks = {
            ...blocks,
            [bid]: {
                id: bid,
                opcode: ScratchOpCodes.OPERATOR_ADD,
                inputs: {
                    NUM1: [1, leftId],
                    NUM2: [1, rightId],
                },
                fields: {},
                shadow: false,
                topLevel: false
            }
        };

        Object.assign(blocks, leftBlocks, rightBlocks);
    } else {
        blocks = {
            ...blocks,
            [bid]: {
                id: bid,
                opcode: ScratchOpCodes.MATH_NUMBER,
                fields: {
                    NUM: expression.getText()
                },
                inputs: {},
                shadow: true,
                topLevel: false
            }
        };
    }

    return [bid, blocks];
};