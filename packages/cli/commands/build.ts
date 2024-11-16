import { getConfig } from '+core/config';
import * as generator from '+renderer/generator';
import path from 'path';
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
		try {
		const config = await getConfig();

		console.log('Building project...');

		const start = performance.now();
		await generator.generate().then((p) => {
			const end = performance.now();
			const duration = (end - start) / 1000;
			console.log(`Project built to ${path.resolve(p)} in ${duration.toFixed(3)}s`);
		});
		} catch (e) {
		console.error(e);
		process.exit(1);
		}
	},
};