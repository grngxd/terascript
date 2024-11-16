interface Target {
    isStage: boolean;
    name: string;
    variables: Record<string, any>[];
    lists: Record<string, any>[];
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
                variables: [],
                lists: [],
            }
        ],
        monitors: [],
        extensions: [],
        meta: {
            semver: "3.0.0",
            vm: "0.2.0-prerelease.20190515153227",
            agent: "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) ScratchDesktop/3.3.0 Chrome/69.0.3497.128 Electron/4.2.0 Safari/537.36",
        },
    };

    private findTarget(targetName: string): Target | undefined {
        return this.data.targets.find(t => t.name === targetName);
    }

    variable(target: string, name: string, value: any = null) {
        const targetObj = this.findTarget(target);
        if (!targetObj) {
            throw new Error(`Target ${target} not found`);
        }

        if (value === null) {
            return targetObj.variables.find(v => v[name]);
        } else {
            targetObj.variables.push({ [name]: [name, value] });
        }
    }

    list(target: string, name: string, value: any = null) {
        const targetObj = this.findTarget(target);
        if (!targetObj) {
            throw new Error(`Target ${target} not found`);
        }

        if (value === null) {
            return targetObj.lists.find(l => l[name]);
        } else {
            targetObj.lists.push({ [name]: [name, value] });
        }
    }

    sprite(name: string) {
        let targetObj = this.findTarget(name);
        if (!targetObj) {
            targetObj = {
                isStage: false,
                name: name,
                variables: [],
                lists: [],
            };
            this.data.targets.push(targetObj);
        }
        return targetObj;
    }
}