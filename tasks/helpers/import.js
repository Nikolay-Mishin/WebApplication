import { log } from 'console';
import { pathToFileURL as toUrl } from 'url';
import { concat, fromEntries, isObject, isDir, keys, values, isArray, getFiles, fileName } from './baseHelpers.js';

const $import = async modules => Promise.all(modules.map(async m => (await import(m)).default));

// flatten arguments to enable both - imports([m1, m2]) or imports(m1, m2)
export const imports = (...modules) => $import(concat(modules)),
	importModules = async (...modules) => {
		modules = concat(modules);
		const isObj = isObject(modules[0]),
			[_keys, _values, scan] = !isObj ? [[], [], isDir(modules[0])] : [keys(modules[0]), values(modules[0]), false];
		modules = scan ? modules.shift() : (isObj ? _values : modules);
		modules = (!scan ? modules : getFiles(modules, { exclude: scan && isArray(modules) ? modules.pop() : [] }))
			.map(m => !scan ? m : `${toUrl(modules)}/${m}`);
		return fromEntries((await $import(modules))
			.map((m, i) => [isObj ? _keys[i] : fileName(modules[i]).replace(/\-+/g, '_'), m]));
	};

export default { imports, importModules };
