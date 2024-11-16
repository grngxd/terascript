import { expect } from "chai";
import { existsSync } from "fs";
import { Project } from "ts-morph";
import { generate, morph, render } from "./generator";

describe("generator.morph()", () => {
    it("should return a ts-morph project", async () => {
        const project = await morph();
        expect(project).to.be.instanceOf(Project);
    });

    it("it should list all source files", async () => {
        const project = await morph();
        const sourceFiles = project.getSourceFiles();
        expect(sourceFiles.length).to.be.greaterThan(0);
    });

    it("should error if no config file is found", async () => {
        // Temporarily change the process.cwd to no directory without a config file
        const originalCwd = process.cwd;
        process.cwd = () => "|";

        try {
            await morph();
        } catch (error: any) {
            expect(error).to.be.an("error");
            expect(error.message).to.equal("No config file found");
        } finally {
            // Restore the original process.cwd
            process.cwd = originalCwd;
        }
    });
});

describe("generator.render()", () => {
    it("should render a project", async () => {
        const renderedProject = await render();
        
        expect(renderedProject).to.be.an("object");
        expect(renderedProject.data.targets).to.be.an("array");
        expect(renderedProject.data.monitors).to.be.an("array");
        expect(renderedProject.data.extensions).to.be.an("array");
    });

    it("should generate a project and write it to file", async () => {
        const out = await generate();

        expect(out).to.be.a("string");
        expect(existsSync(out)).to.be.true;
    });
});