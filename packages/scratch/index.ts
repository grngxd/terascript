import { generate } from "short-uuid";
import { ScratchBlock, ScratchBlocks, ScratchOpCodes } from "./ast";

interface Target {
    isStage: boolean;
    name: string;
    // { uuid: [name, value], ... }
    variables: Record<string, [string, any]>;
    lists: Record<string, [string, any]>;
    x?: number;
    y?: number;
    blocks: ScratchBlocks;
    broadcasts: Record<string, any>;
    comments: Record<string, any>;
    currentCostume: number;
    costumes: any[];
    sounds: any[];
    volume: number;
    layerOrder: number;
}

interface Sprite extends Target {
    visible: boolean;
    size: number;
    direction: number;
    draggable: boolean;
    rotationStyle: string;
}

interface Stage extends Target {
    tempo: number;
    videoTransparency: number;
    videoState: string;
    textToSpeechLanguage: string | null;
}

interface Meta {
    semver: string;
    vm: string;
    agent: string;
}

interface ScratchData {
    targets: Target[];
    monitors: any[];
    extensions: any[];
    meta: Meta;
}

export class ScratchProject {
    data: ScratchData = {
        targets: [
            {
                isStage: true,
                name: "Stage",
                variables: {},
                lists: {},
                x: 0,
                y: 0,
                blocks: {},
                broadcasts: {},
                comments: {},
                currentCostume: 0,
                costumes: [
                    {
                        assetId: "cd21514d0531fdffb22204e0ec5ed84a",
                        name: "backdrop1",
                        md5ext: "cd21514d0531fdffb22204e0ec5ed84a.svg",
                        dataFormat: "svg",
                        rotationCenterX: 240,
                        rotationCenterY: 180,
                    },
                ],
                sounds: [],
                volume: 100,
                layerOrder: 0,
                tempo: 60,
                videoTransparency: 50,
                videoState: "off",
                textToSpeechLanguage: null,
            } as Stage,
        ],
        monitors: [],
        extensions: [],
        meta: {
            semver: "3.0.0",
            vm: "0.2.0-prerelease.20190515153227",
            agent: "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) ScratchDesktop/3.3.0 Chrome/69.0.3497.128 Electron/4.2.0 Safari/537.36",
        },
    };

    findTarget(targetName: string): Target | undefined {
        return this.data.targets.find(t => t.name === targetName);
    }

    variable(target: string | undefined, name: string, value: any = null) {
        const targetObj = this.findTarget(target || "Stage");
        if (!targetObj) {
            throw new Error(`Target ${target} not found`);
        }

        if (value === null) {
            return Object.entries(targetObj.variables).find(([_, [n]]) => n === name);
        } else {
            const uuid = generate();
            targetObj.variables[uuid] = [name, value];

            return uuid;
        }
    }

    list(target: string, name: string, value: any = null) {
        const targetObj = this.findTarget(target);
        if (!targetObj) {
            throw new Error(`Target ${target} not found`);
        }

        if (value === null) {
            return Object.entries(targetObj.lists).find(([_, [n]]) => n === name);
        } else {
            const uuid = generate();
            targetObj.lists[uuid] = [name, value];

            return uuid;
        }
    }

    sprite(name: string) {
        let targetObj = this.findTarget(name) as Sprite;
        if (!targetObj) {
            targetObj = {
                isStage: false,
                name,
                variables: {},
                lists: {},
                x: 0,
                y: 0,
                blocks: {},
                broadcasts: {},
                comments: {},
                currentCostume: 0,
                costumes: [],
                sounds: [],
                volume: 100,
                layerOrder: 0,
                visible: true,
                size: 100,
                direction: 90,
                draggable: false,
                rotationStyle: "all around",
            }
            this.data.targets.push(targetObj);
        }
        return targetObj;
    }

    createBlock(options: {
        target: string;
        opcode: ScratchOpCodes;
        next?: string;
        parent?: string;
        x?: number;
        y?: number;
        topLevel?: boolean;
        inputs?: Record<string, any>;
        fields?: Record<string, any>;
        shadow?: boolean;
    }) {
        const targetObj = this.findTarget(options.target);
        if (!targetObj) {
            throw new Error(`Target ${options.target} not found`);
        }

        const id = generate();
        targetObj.blocks = {
            ...targetObj.blocks,

            [id]: {
                id,
                opcode: options.opcode,
                next: options.next,
                parent: options.parent,
                x: options.x,
                y: options.y,
                topLevel: options.topLevel,
                inputs: options.inputs,
                fields: options.fields,
                shadow: options.shadow,
            }
        };

        return id;
    };

    editBlock(target: string, id: string, options: Partial<ScratchBlock>) {
        const targetObj = this.findTarget(target);
        if (!targetObj) {
            throw new Error(`Target ${target} not found`);
        }

        if (!targetObj.blocks[id]) {
            throw new Error(`Block ${id} not found in target ${target}`);
        }

        targetObj.blocks[id] = { ...targetObj.blocks[id], ...options };
    }

    toJSON() {
        return this.data;
    }

    static fromJSON(data: ScratchData) {
        const s = new ScratchProject()
        s.data = data;
        return s;
    }

    addCostume(costume: string) {}
    addSound(sound: string) {}
}