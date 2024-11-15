
export const buildCommand = {
  command: 'build',
  describe: 'Build the project',
  handler: async () => {
    // const project = new Project({
    //   tsConfigFilePath: 'tsconfig.json',
    // });

    // const config = ScratchProjectSchema.parse(
    //   (
    //     await import(
    //       pathToFileURL(path.resolve(process.cwd(), 'scratch.config.ts')).href
    //     )
    //   ).default
    // );

    // const sourceFiles = project.getSourceFiles();
    // console.log(`Building project: ${config.name}`);

    // const scratchProject = {
    //   targets: [],
    //   monitors: [],
    //   extensions: [],
    //   meta: {
    //     semver: "3.0.0",
    //     vm: "0.2.0-prerelease.20190515153227",
    //     agent: "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) ScratchDesktop/3.3.0 Chrome/69.0.3497.128 Electron/4.2.0 Safari/537.36"
    //   }
    // };

    // sourceFiles.forEach((file) => {
    //   console.log(file.getFilePath());
    //   const sourceFile = project.getSourceFileOrThrow(file.getFilePath());
    //   sourceFile.forEachDescendant((node) => {
    //     switch (node.getKind()) {
    //       case SyntaxKind.NewExpression:
    //         break;
    //       case SyntaxKind.CallExpression:
    //         break;
    //       default:
    //         break;
    //     }
    //   });
    // });

    // const outputPath = path.resolve(process.cwd(), 'out', `${config.name}_${Date.now()}.json`);
    // fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    // fs.writeFileSync(outputPath, JSON.stringify(scratchProject, null, 2));
    // console.log(`Project built successfully: ${outputPath}`);
  },
};