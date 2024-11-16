import { getConfig } from "+core/config";
import { ScratchProject } from "+scratch";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import JSZip from "jszip";
import path from "path";

export const createSb3 = async (projectFile: string, costumeFiles: string[], soundFiles: string[]) => {
    const config = await getConfig();
    const project = ScratchProject.fromJSON(JSON.parse(projectFile));
    costumeFiles.forEach(costume => project.addCostume(costume));
    soundFiles.forEach(sound => project.addSound(sound));
    
    // an sb3 is basically a zip file with a different extension, contains the project.json (projectFile) and all the assets (costumeFiles, soundFiles)
    let zip = new JSZip();

    zip.file("project.json", projectFile);
    
    // write zip file to disk
    const content = await zip.generateAsync({ type: "nodebuffer" });

    // create folders if they don't exist
    if (!existsSync(config.outDir)) {
        mkdirSync(config.outDir, { recursive: true });
    }

    writeFileSync(
        path.join(config.outDir, `${config.name.toLowerCase().replaceAll(" ", "-")}.sb3`),
        content
    );

    return path.join(config.outDir, `${config.name.toLowerCase().replaceAll(" ", "-")}.sb3`)
}