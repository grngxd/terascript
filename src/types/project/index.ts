import { z } from 'zod';

export const ScratchProjectSchema = z.object({
    name: z.string(),
});