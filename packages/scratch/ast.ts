// scratch opcodes
export enum OpCodes {
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
}

export type OpCode = keyof typeof OpCodes;

export type MotionOpcode =
    | OpCodes.MOVE_STEPS
    | OpCodes.TURN_RIGHT
    | OpCodes.TURN_LEFT
    | OpCodes.GOTO_XY;

export type LooksOpcode =
    | OpCodes.SAY;

export type EventOpcode =
    | OpCodes.WHEN_FLAG_CLICKED;

export type ControlOpcode =
    | OpCodes.WAIT;

export type Block = {
    id: string;
    opcode: OpCode;
    next?: string;
    parent?: string;
    x?: number;
    y?: number;
    topLevel?: boolean;
    inputs?: Record<string, any>;
    fields?: Record<string, any>;
    shadow?: boolean;
}

export type Blocks = Record<string, Block>;