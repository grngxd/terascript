import { getConfig } from '+core/config';
import * as generator from '+renderer/generator';
import { CommandModule } from 'yargs';

export const buildCommand: CommandModule = {
  command: 'build',
  describe: 'Build the project',
  builder: (yargs) => {
    return yargs.option('prod', {
      alias: 'p',
      type: 'boolean',
      description: 'Build for production',
    });
  },
  handler: async (argv) => {
    const config = await getConfig();

    console.log('Building project...');
    console.log(`Environment: ${argv.prod ? 'production' : 'development'}`);

    const p = performance.now();
    // Build the project
    await generator.generate().then((path) => {
      console.log(`Project built to ${path} in ${performance.now() - p * 1000}s`);
    });
  },
};