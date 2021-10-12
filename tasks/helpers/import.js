import { pathToFileURL as toUrl } from 'url';
import { concat } from './baseHelpers.js';

const $import = async modules => Promise.all(modules.map(async m => (await import(m)).default));

// flatten arguments to enable both - imports([m1, m2]) or imports(m1, m2)
export const imports = (...modules) => $import(concat(modules)),
	importModules = async (...modules) => {
		modules = concat(modules);
		const isObj = modules[0].isObject(),
			[keys, values, scan] = !isObj ? [[], [], modules[0].isDir()] : [modules[0].keys(), modules[0].values(), false];
		modules = scan ? modules.shift() : (isObj ? values : modules);
		modules = (!scan ? modules : modules.getFiles({ exclude: scan && modules.isArray() ? modules.pop() : [] }))
			.map(m => !scan ? m : `${toUrl(modules)}/${m}`);
		return (await $import(modules))
			.map((m, i) => [isObj ? keys[i] : modules[i].fileName().replace(/\-+/g, '_'), m]).fromEntries();
	};

export default { imports, importModules };
