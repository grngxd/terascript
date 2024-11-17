import { expect } from "chai";
import { ScratchOpCodes } from "./ast";
import { ScratchProject } from "./index";

describe("ScratchProject", () => {
    let project: ScratchProject;

    beforeEach(() => {
        project = new ScratchProject();
    });

    it("should find the stage target", () => {
        const stage = project.findTarget("Stage");
        expect(stage).to.not.be.undefined;
        expect(stage?.isStage).to.be.true;
    });

    it("should add a variable to the stage", () => {
        const uuid = project.variable("Stage", "myVar", 10);
        const variable = project.variable("Stage", "myVar");
        expect(variable).to.not.be.undefined;
        expect(variable?.[0]).to.equal(uuid);
        expect(variable?.[1][1]).to.equal(10);
    });

    it("should add a list to the stage", () => {
        const uuid = project.list("Stage", "myList", [1, 2, 3]);
        const list = project.list("Stage", "myList");
        expect(list).to.not.be.undefined;
        expect(list?.[0]).to.equal(uuid);
        expect(list?.[1][1]).to.deep.equal([1, 2, 3]);
    });

    it("should create a new sprite", () => {
        const sprite = project.sprite("Sprite1");
        expect(sprite).to.not.be.undefined;
        expect(sprite.name).to.equal("Sprite1");
        expect(sprite.isStage).to.be.false;
    });

    it("should create a new block", () => {
        const blockId = project.createBlock({
            target: "Stage",
            opcode: ScratchOpCodes.MOVE_STEPS,
            x: 10,
            y: 20,
            topLevel: true,
        });
        const stage = project.findTarget("Stage");
        expect(stage?.blocks[blockId]).to.not.be.undefined;
        expect(stage?.blocks[blockId].opcode).to.equal("motion_movesteps");
    });

    it("should edit an existing block", () => {
        const blockId = project.createBlock({
            target: "Stage",
            opcode: ScratchOpCodes.MOVE_STEPS,
            x: 10,
            y: 20,
            topLevel: true,
        });
        project.editBlock("Stage", blockId, {
            x: 30,
            y: 40,
        });
        const stage = project.findTarget("Stage");
        expect(stage?.blocks[blockId].x).to.equal(30);
        expect(stage?.blocks[blockId].y).to.equal(40);
    });

    it("should serialize and deserialize project data", () => {
        const json = project.toJSON();
        const newProject = ScratchProject.fromJSON(json);
        expect(newProject.toJSON()).to.deep.equal(json);
    });
});