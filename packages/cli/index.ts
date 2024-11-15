import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { buildCommand } from './commands/build';

yargs(hideBin(process.argv))
  .command(buildCommand)
  .help()
  .argv;