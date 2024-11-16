import { getConfig } from '+core/config';
import path from 'path';
import process from 'process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import constants from '../core/constants';
import { buildCommand } from './commands/build';

const argv = yargs(hideBin(process.argv))
  .command(buildCommand)
  .version(constants.version)
  .option('project', {
    type: 'boolean',
    description: 'Print project information'
  })
  .option('cwd', {
    type: 'string',
    description: 'Change the current working directory'
  })
  .middleware(async (argv) => {
    if (argv.cwd) {
      process.chdir(path.resolve(argv.cwd));
    }
    if (argv.project) {
      try {
        const config = await getConfig();
        Object.entries(config).forEach(([key, value]) => {
          const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
          console.log(`${formattedKey}: ${value}`);
        });
        process.exit(0);
      } catch (e) {
        console.error(e);
        process.exit(1);
      }
    }
  })
  .demandCommand(0, '') // Allow no commands
  .help()
  .argv;

console.log(process.cwd());