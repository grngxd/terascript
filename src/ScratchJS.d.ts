declare module 'ScratchJS' {
    export class Sprite {
        constructor(name: string);
        say(message: string, time?: number): void;
    }

    export type ScratchProject = {
        name: string;
    };
}