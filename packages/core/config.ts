import { existsSync } from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { ScratchProject, ScratchProjectSchema } from "./schemas";

let _config: ScratchProject;

export async function getConfig() {
    if (_config) return _config;
    
    const configFile = [
        'scratch.config.ts',
        'scratch.config.mts',
        'scratch.config.cts',
        'scratch.config.js',
        'scratch.config.mjs',
        'scratch.config.cjs',
    ].find((file) => {
        return existsSync(path.resolve(process.cwd(), file));
    })

    if (!configFile) throw new Error('No config file found');
    
    _config = ScratchProjectSchema.parse(
      (
        await import(
          pathToFileURL(path.resolve(process.cwd(), configFile)).href
        )
      ).default
    );

    return _config;
}