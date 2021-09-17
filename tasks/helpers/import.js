import { log } from 'console';
import { pathToFileURL as toUrl } from 'url';
import { basename as base, extname as ext } from 'path';
import { concat, fromEntries, isObject, isDir, keys, values, getFiles } from './baseHelpers.js';

const $import = async (toObj, ...modules) => {
	const imports = await Promise.all(concat(modules).map(async m => {
		const module = (await import(m)).default;
		return !toObj ? module : [base(m, ext(m)), module];
	}));
	return !toObj ? imports : fromEntries(imports);
};

// flatten arguments to enable both - imports([m1, m2]) or imports(m1, m2)
export const imports = (...modules) => $import(false, ...modules),
	importModules = async (...modules) => {
		const isObj = isObject(modules[0]),
			[_keys, _values, scan] = !isObj ? [[], [], isDir(modules[0])] : [keys(modules[0]), values(modules[0]), false],
			_exclude = scan ? modules.pop() : [];
		modules = scan ? modules.shift() : (isObj ? _values : modules);
		modules = (!scan ? modules : getFiles(modules, { _exclude })).map(m => !scan ? m : `${toUrl(modules)}/${m}`);
		const imports = await $import(true, ...modules);
		return fromEntries(keys(imports).map((m, i) => [isObj ? _keys[i] : m.replace(/\-+/g, '_'), imports[m]]));
	};

export default { imports, importModules };
