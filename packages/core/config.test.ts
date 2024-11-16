import { expect } from 'chai';
import { getConfig } from './config';

describe('core.config.getConfig()', () => {
	it('should load the configuration', async () => {
		const config = await getConfig();
		expect(config).to.have.property('name');
		expect(config).to.have.property('outDir');
		expect(config).to.have.property('assetsDir');
	});

	it('should throw an error if no config file is found', async () => {
		// Temporarily change the process.cwd to no directory without a config file
		const originalCwd = process.cwd;
		process.cwd = () => "|";

		try {
			await getConfig();
		} catch (error: any) {
			expect(error).to.be.an('error');
			expect(error.message).to.equal('No config file found');
		} finally {
			// Restore the original process.cwd
			process.cwd = originalCwd;
		}
	});

	it('should parse the configuration correctly', async () => {
		const config = await getConfig();
		expect(config).to.be.an('object');
		expect(config).to.have.property('name').that.is.a('string');
		expect(config).to.have.property('outDir').that.is.a('string');
		expect(config).to.have.property('assetsDir').that.is.a('string');
	});
});