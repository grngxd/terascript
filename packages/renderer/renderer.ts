import { existsSync } from "fs";
import { Node, Project, ts, TypeChecker, VariableStatement } from "ts-morph";

export const morph = async (): Promise<Project> => {
    if (!existsSync("tsconfig.json")) {
        return Promise.reject(new Error("No config file found"));
    }

    return new Project({
        tsConfigFilePath: "tsconfig.json",
    });
};

function renderVariableStatement(renderedProject: RenderedProject, node: VariableStatement, checker: TypeChecker) {
	const declaration = node.getDeclarationList().getDeclarations()[0];
	const name = declaration.getName();
	const value = declaration.getInitializer()?.getText();
	// parse value from string to number or boolean or array or string
	const parsedValue = JSON.parse(value!);

	const kind = declaration.getInitializer()?.getKind();

    if (kind === ts.SyntaxKind.ArrayLiteralExpression) {
		renderedProject.targets[0].lists.push({
			[name]: [name, parsedValue],
		});
	} else {
		renderedProject.targets[0].variables.push({
			[name]: [name, parsedValue],
		});
	}
}

const nodeRenderers: Partial<Record<ts.SyntaxKind, (renderedProject: RenderedProject, node: Node, checker: TypeChecker) => void>> = {
    [ts.SyntaxKind.VariableStatement]: (renderedProject, node, checker) => renderVariableStatement(renderedProject, node as VariableStatement, checker),
};

const projectBoilerplate: any = {
    targets: [
        {
            "isStage": true,
            "name": "Stage",
            "variables": [],
            "lists": [],
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

type RenderedProject = typeof projectBoilerplate;

export const render = async () => {
    const project = await morph();
    const sourceFiles = project.getSourceFiles();

    const renderedProject: RenderedProject = {
        ...projectBoilerplate,
    };

    sourceFiles.forEach((sourceFile) => {
        sourceFile.forEachDescendant((node) => {
            const renderer = nodeRenderers[node.getKind()];
			let value = null;
            if (renderer) {
                value = renderer(renderedProject, node, project.getTypeChecker());
            }
        });
    });

    console.log(renderedProject);

    return renderedProject;
};