import { GeneratorContext } from "+renderer/generator";
import { ScratchProject } from "+scratch";
import { ScratchBlocks, ScratchOpCodes } from "+scratch/ast";
import { generate } from "short-uuid";
import { BinaryExpression, Expression, ParenthesizedExpression, ts, TypeChecker } from "ts-morph";

// Define a function to render a single expression to Scratch blocks
export const renderExpression = (ctx: GeneratorContext, scratchProject: ScratchProject, expression: Expression, checker: TypeChecker): ScratchBlocks => {
    const blocks: ScratchBlocks = {};

    const render = (expression: Expression): { id: string, block: any } => {
        const bid = generate();
        let block: any;

        if (expression instanceof BinaryExpression) {
            const left = render(expression.getLeft());
            const right = render(expression.getRight());
            const operator = expression.getOperatorToken().getKind();

            switch (operator) {
                case ts.SyntaxKind.PlusToken:
                    block = {
                        id: bid,
                        opcode: ScratchOpCodes.OPERATOR_ADD,
                        inputs: {
                            NUM1: [1, left.id],
                            NUM2: [1, right.id],
                        },
                    };
                    break;
                case ts.SyntaxKind.MinusToken:
                    block = {
                        id: bid,
                        opcode: ScratchOpCodes.OPERATOR_SUBTRACT,
                        inputs: {
                            NUM1: [1, left.id],
                            NUM2: [1, right.id],
                        },
                    };
                    break;
                case ts.SyntaxKind.AsteriskToken:
                    block = {
                        id: bid,
                        opcode: ScratchOpCodes.OPERATOR_MULTIPLY,
                        inputs: {
                            NUM1: [1, left.id],
                            NUM2: [1, right.id],
                        },
                    };
                    break;
                case ts.SyntaxKind.SlashToken:
                    block = {
                        id: bid,
                        opcode: ScratchOpCodes.OPERATOR_DIVIDE,
                        inputs: {
                            NUM1: [1, left.id],
                            NUM2: [1, right.id],
                        },
                    };
                    break;
                default:
                    throw new Error(`Unsupported operator: ${operator}`);
            }

            blocks[left.id] = left.block;
            blocks[right.id] = right.block;
        } else if (expression instanceof ParenthesizedExpression) {
            // Handle parenthesized expressions by recursively rendering the inner expression
            return render(expression.getExpression());
        } else {
            // Handle other types of expressions (e.g., literals, identifiers)
            if (expression.getKind() === ts.SyntaxKind.NumericLiteral) {
                block = {
                    id: bid,
                    opcode: ScratchOpCodes.MATH_NUMBER,
                    fields: {
                        NUM: expression.getText(),
                    },
                };
            } else if (expression.getKind() === ts.SyntaxKind.Identifier) {
                block = {
                    id: bid,
                    opcode: ScratchOpCodes.DATA_VARIABLE,
                    fields: {
                        VARIABLE: expression.getText(),
                    },
                };
            } else {
                throw new Error(`Unsupported expression: ${expression.getKind()}`);
            }
        }

        return { id: bid, block };
    };

    const result = render(expression);
    blocks[result.id] = result.block;

    return blocks;
};