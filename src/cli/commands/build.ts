import fs from 'fs';
import path from 'path';
import { Project, SyntaxKind } from 'ts-morph';
import { pathToFileURL } from 'url';
import { ScratchProjectSchema } from '../../types/project';

export const buildCommand = {
  command: 'build',
  describe: 'Build the project',
  handler: async () => {
    const project = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });

    const config = ScratchProjectSchema.parse(
      (
        await import(
          pathToFileURL(path.resolve(process.cwd(), 'scratch.config.ts')).href
        )
      ).default
    );

    const sourceFiles = project.getSourceFiles();
    console.log(`Building project: ${config.name}`);

    const scratchProject = {
      targets: [],
      monitors: [],
      extensions: [],
      meta: {
        semver: "3.0.0",
        vm: "0.2.0-prerelease.20190515153227",
        agent: "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) ScratchDesktop/3.3.0 Chrome/69.0.3497.128 Electron/4.2.0 Safari/537.36"
      }
    };

    sourceFiles.forEach((file) => {
      console.log(file.getFilePath());
      const sourceFile = project.getSourceFileOrThrow(file.getFilePath());
      sourceFile.forEachDescendant((node) => {
        switch (node.getKind()) {
          case SyntaxKind.NewExpression:
            const newExpression = node.asKindOrThrow(SyntaxKind.NewExpression);
            const className = newExpression.getExpression().getText();
            if (className === 'Sprite') {
              const spriteName = newExpression.getArguments()[0].getText().replace(/['"]/g, '');
              scratchProject.targets.push({
                name: spriteName,
                isStage: false,
                variables: {},
                lists: {},
                broadcasts: {},
                blocks: {},
                comments: {},
                currentCostume: 0,
                costumes: [],
                sounds: [],
                volume: 100,
              });
            }
            break;
          case SyntaxKind.CallExpression:
            const callExpression = node.asKindOrThrow(SyntaxKind.CallExpression);
            const methodName = callExpression.getExpression().getText();
            if (methodName === 'sprite.say') {
              const message = callExpression.getArguments()[0].getText().replace(/['"]/g, '');
              const time = callExpression.getArguments()[1]?.getText() || '2';
              const sprite = scratchProject.targets.find(target => target.name === 'placeholderSprite');
              if (sprite) {
                sprite.blocks[`block_${Math.random().toString(36).substr(2, 9)}`] = {
                  opcode: 'looks_sayforsecs',
                  next: null,
                  parent: null,
                  inputs: {
                    MESSAGE: [1, [10, message]],
                    SECS: [1, [4, time]],
                  },
                  fields: {},
                  shadow: false,
                  topLevel: true,
                  x: 0,
                  y: 0,
                };
              }
            }
            break;
          default:
            break;
        }
      });
    });

    const outputPath = path.resolve(process.cwd(), 'out', `${config.name}_${Date.now()}.json`);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(scratchProject, null, 2));
    console.log(`Project built successfully: ${outputPath}`);
  },
};