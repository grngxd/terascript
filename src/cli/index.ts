import { hideBin } from 'yargs/helpers';
import yargs from 'yargs/yargs';
import { buildCommand } from './commands/build';

yargs(hideBin(process.argv))
  .command(buildCommand)
  .help()
  .argv;