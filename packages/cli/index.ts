import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import constants from '../core/constants';
import { buildCommand } from './commands/build';

yargs(hideBin(process.argv))
  .command(buildCommand)
  .version(constants.version)
  .demandCommand(1, '')
  .help()
  .argv;