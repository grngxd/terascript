import { GeneratorContext } from "+renderer/generator";
import { ScratchProject } from "+scratch";
import { ScratchOpCodes } from "+scratch/ast";
import { expect } from "chai";
import { ExpressionStatement, Project } from "ts-morph";
import { renderExpression } from "./expressions";

describe("renderExpression", () => {
    const project = new Project();
    const sourceFile = project.createSourceFile("temp.ts", "", { overwrite: true });

    it("should render 5 + 10", () => {
        const statement = sourceFile.addStatements("5 + 10;")[0] as ExpressionStatement;
        const expression = statement.getExpression();
        const ctx: GeneratorContext = {
            variables: {},
        }; // Mock or create a real context as needed
        const scratchProject = new ScratchProject();
        const checker = project.getTypeChecker();

        const blocks = renderExpression(ctx, scratchProject, expression, checker);

        const blockIds = Object.keys(blocks);
        expect(blockIds).to.have.lengthOf(3); // One for the operator and two for the numbers

        // Find the operator block
        const operatorBlockId = blockIds.find(id => blocks[id].opcode === ScratchOpCodes.OPERATOR_ADD);
        expect(operatorBlockId).to.not.be.undefined;

        const operatorBlock = blocks[operatorBlockId!];
        expect(operatorBlock).to.include({
            opcode: ScratchOpCodes.OPERATOR_ADD,
        });

        const num1BlockId = operatorBlock.inputs!.NUM1[1];
        const num1Block = blocks[num1BlockId];
        expect(num1Block).to.include({
            opcode: ScratchOpCodes.MATH_NUMBER,
        });
        expect(num1Block.fields).to.deep.equal({
            NUM: '5',
        });

        const num2BlockId = operatorBlock.inputs!.NUM2[1];
        const num2Block = blocks[num2BlockId];
        expect(num2Block).to.include({
            opcode: ScratchOpCodes.MATH_NUMBER,
        });
        expect(num2Block.fields).to.deep.equal({
            NUM: '10',
        });
    });

    it("should render 18 / (12 * 3)", () => {
        const statement = sourceFile.addStatements("18 / (12 * 3);")[0] as ExpressionStatement;
        const expression = statement.getExpression();
        const ctx: GeneratorContext = {
            variables: {},
        }; // Mock or create a real context as needed
        const scratchProject = new ScratchProject();
        const checker = project.getTypeChecker();

        const blocks = renderExpression(ctx, scratchProject, expression, checker);

        const blockIds = Object.keys(blocks);
        expect(blockIds).to.have.lengthOf(5); // One for the division, one for the multiplication, and three for the numbers

        // Find the division block
        const divisionBlockId = blockIds.find(id => blocks[id].opcode === ScratchOpCodes.OPERATOR_DIVIDE);
        expect(divisionBlockId).to.not.be.undefined;

        const divisionBlock = blocks[divisionBlockId!];
        expect(divisionBlock).to.include({
            opcode: ScratchOpCodes.OPERATOR_DIVIDE,
        });

        const num1BlockId = divisionBlock.inputs!.NUM1[1];
        const num1Block = blocks[num1BlockId];
        expect(num1Block).to.include({
            opcode: ScratchOpCodes.MATH_NUMBER,
        });
        expect(num1Block.fields).to.deep.equal({
            NUM: '18',
        });

        const multiplicationBlockId = divisionBlock.inputs!.NUM2[1];
        const multiplicationBlock = blocks[multiplicationBlockId];
        expect(multiplicationBlock).to.include({
            opcode: ScratchOpCodes.OPERATOR_MULTIPLY,
        });

        const mulNum1BlockId = multiplicationBlock.inputs!.NUM1[1];
        const mulNum1Block = blocks[mulNum1BlockId];
        expect(mulNum1Block).to.include({
            opcode: ScratchOpCodes.MATH_NUMBER,
        });
        expect(mulNum1Block.fields).to.deep.equal({
            NUM: '12',
        });

        const mulNum2BlockId = multiplicationBlock.inputs!.NUM2[1];
        const mulNum2Block = blocks[mulNum2BlockId];
        expect(mulNum2Block).to.include({
            opcode: ScratchOpCodes.MATH_NUMBER,
        });
        expect(mulNum2Block.fields).to.deep.equal({
            NUM: '3',
        });
    });
});