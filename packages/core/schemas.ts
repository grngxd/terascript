import { z } from "zod";

export const ScratchProjectSchema = z.object({
    name: z.string(),
    outFile: z.string(),
    assetsDir: z.string(),
});

export type ScratchProject = z.infer<typeof ScratchProjectSchema>;