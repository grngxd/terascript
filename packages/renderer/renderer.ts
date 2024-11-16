import { ScratchProject } from "+scratch";
import { existsSync } from "fs";
import { Project } from "ts-morph";

export const morph = async (): Promise<Project> => {
    if (!existsSync("tsconfig.json")) {
        return Promise.reject(new Error("No config file found"));
    }

    return new Project({
        tsConfigFilePath: "tsconfig.json",
    });
};

const parseValue = (value: string): any => {
    try {
        const parsed = JSON.parse(value);
        if (typeof parsed === "number" || typeof parsed === "boolean" || Array.isArray(parsed) || typeof parsed === "string") {
            return parsed;
        }
    } catch (e) { }
    return value;
}

export const render = async () => {
    const project = await morph();
    const sourceFiles = project.getSourceFiles();

    const scratchProject = new ScratchProject();

    sourceFiles.forEach((sourceFile) => {});
};