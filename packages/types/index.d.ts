declare class Sprite {
    x: number;
    y: number;

    say(message: string, time?: number): void;
    clone(): Sprite;
}