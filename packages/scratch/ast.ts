// scratch opcodes
export enum ScratchOpCodes {
    // Motion
    MOVE_STEPS = "motion_movesteps",
    TURN_RIGHT = "motion_turnright",
    TURN_LEFT = "motion_turnleft",
    GOTO_XY = "motion_gotoxy",
    // Looks
    SAY = "looks_say",
    // Events
    WHEN_FLAG_CLICKED = "event_whenflagclicked",
    // Control
    WAIT = "control_wait",

    // Operators
    OPERATOR_ADD = "operator_add",
    OPERATOR_SUBTRACT = "operator_subtract",
    OPERATOR_MULTIPLY = "operator_multiply",
    OPERATOR_DIVIDE = "operator_divide",

    // Math
    MATH_NUMBER = "math_number",

    // Variables
    DATA_SETVARIABLETO = "data_setvariableto",
    DATA_VARIABLE = "data_variable",
}

export type ScratchOpCode = keyof typeof ScratchOpCodes;

export type ScratchMotionOpcode =
    | ScratchOpCodes.MOVE_STEPS
    | ScratchOpCodes.TURN_RIGHT
    | ScratchOpCodes.TURN_LEFT
    | ScratchOpCodes.GOTO_XY;

export type ScratchLooksOpcode =
    | ScratchOpCodes.SAY;

export type ScratchEventOpcode =
    | ScratchOpCodes.WHEN_FLAG_CLICKED;

export type ScratchControlOpcode =
    | ScratchOpCodes.WAIT;

export type ScratchBlock = {
    id: string;
    opcode: ScratchOpCodes;
    next?: string;
    parent?: string;
    x?: number;
    y?: number;
    topLevel?: boolean;
    inputs?: Record<string, any>;
    fields?: Record<string, any>;
    shadow?: boolean;
}

export type ScratchBlocks = Record<string, ScratchBlock>;

export function parseBlocks(blocksData: any): ScratchBlocks {
    let blocks: ScratchBlocks = {};
    for (const [id, data] of Object.entries(blocksData)) {
        blocks = {
            [id]: {
                id,
                opcode: (data as any).opcode as ScratchOpCodes,
                next: (data as any).next,
                parent: (data as any).parent,
                x: (data as any).x,
                y: (data as any).y,
                topLevel: (data as any).topLevel,
                inputs: (data as any).inputs,
                fields: (data as any).fields,
                shadow: (data as any).shadow,
            }
        };
    }
    return blocks;
}