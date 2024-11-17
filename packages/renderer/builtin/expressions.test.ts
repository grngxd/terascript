import { GeneratorContext } from "+renderer/generator";
import { ScratchProject } from "+scratch";
import { ScratchOpCodes } from "+scratch/ast";
import { expect } from "chai";
import proxyquire from "proxyquire";
import sinon from "sinon";
import { ExpressionStatement, Project } from "ts-morph";

describe("renderExpression", () => {
    const project = new Project();
    const sourceFile = project.createSourceFile("temp.ts", "", { overwrite: true });

    let renderExpression: any;
    let c = 0;

    before(() => {
        renderExpression = proxyquire("./expressions", {
            "short-uuid": {
                generate: () => {
                    // increment the counter
                    c++;
                    return c.toString();
                }
            }
        }).renderExpression;
    });

    after(() => {
        sinon.restore();
    });

    it("should render 5 + 5", () => {
        const statement = sourceFile.addStatements("5 + 5;")[0] as ExpressionStatement;
        const expression = statement.getExpression();
        const ctx = {} as GeneratorContext;
        const scratchProject = new ScratchProject();
        const blocks = renderExpression(ctx, scratchProject, expression, project.getTypeChecker());

        expect(blocks).to.not.be.undefined;
        expect(blocks).to.deep.equal({
            "1": {
                id: "1",
                opcode: ScratchOpCodes.OPERATOR_ADD,
                inputs: {
                    NUM1: [1, "3"],
                    NUM2: [1, "5"]
                },
                fields: {},
                shadow: false,
                topLevel: false
            },
            "3": {
                id: "3",
                opcode: ScratchOpCodes.MATH_NUMBER,
                fields: {
                    NUM: "5"
                },
                inputs: {},
                shadow: true,
                topLevel: false
            },
            "5": {
                id: "5",
                opcode: ScratchOpCodes.MATH_NUMBER,
                fields: {
                    NUM: "5"
                },
                inputs: {},
                shadow: true,
                topLevel: false
            }
        });
    });

    it("should render 5 + 5 + 5", () => {
        const statement = sourceFile.addStatements("5 + 5 + 5;")[0] as ExpressionStatement;
        const expression = statement.getExpression();
        const ctx = {} as GeneratorContext;
        const scratchProject = new ScratchProject();
        const blocks = renderExpression(ctx, scratchProject, expression, project.getTypeChecker());

        expect(blocks).to.not.be.undefined;
        expect(blocks).to.equal({
            "1": {
                id: "1",
                opcode: ScratchOpCodes.OPERATOR_ADD,
                inputs: {
                    NUM1: [1, "3"],
                    NUM2: [1, "5"]
                },
                fields: {},
                shadow: false,
                topLevel: false
            },
            "3": {
                id: "3",
                opcode: ScratchOpCodes.OPERATOR_ADD,
                inputs: {
                    NUM1: [1, "7"],
                    NUM2: [1, "9"]
                },
                fields: {},
                shadow: false,
                topLevel: false
            },
            "5": {
                id: "5",
                opcode: ScratchOpCodes.MATH_NUMBER,
                fields: {
                    NUM: "5"
                },
                inputs: {},
                shadow: true,
                topLevel: false
            },
            "7": {
                id: "7",
                opcode: ScratchOpCodes.MATH_NUMBER,
                fields: {
                    NUM: "5"
                },
                inputs: {},
                shadow: true,
                topLevel: false
            },
            "9": {
                id: "9",
                opcode: ScratchOpCodes.MATH_NUMBER,
                fields: {
                    NUM: "5"
                },
                inputs: {},
                shadow: true,
                topLevel: false
            }
        });
    });
});