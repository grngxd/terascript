import { expect } from "chai";
import { Project } from "ts-morph";
import { morph, render } from "./renderer";

describe("renderer.morph()", () => {
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

describe("renderer.render()", () => {
    it("should render a project", async () => {
        const renderedProject = await render();
        expect(renderedProject).to.be.an("object");
        expect(renderedProject.targets).to.be.an("array");
        expect(renderedProject.monitors).to.be.an("array");
        expect(renderedProject.extensions).to.be.an("array");
    });
});