import { z } from "zod";

export const ScratchProjectSchema = z.object({
    name: z.string(),
    outDir: z.string(),
    assetsDir: z.string(),
});

export type ScratchProject = z.infer<typeof ScratchProjectSchema>;