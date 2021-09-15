import { log } from 'console';
import { pathToFileURL as toUrl } from 'url';
import { basename as base, extname as ext } from 'path';
import { getFiles, fromEntries, keys } from './baseHelpers.js';

const $import = (toObj, ...modules) => (async (...modules) => {
	const imports = await Promise.all(modules.concat.apply([], modules)
		.map(async m => {
			const module = (await import(m)).default;
			return !toObj ? module : [base(m, ext(m)), module];
		}));
	return !toObj ? imports : fromEntries(imports);
})(...modules);

// flatten arguments to enable both - imports([m1, m2]) or imports(m1, m2)
export const imports = async (...modules) => await $import(false, ...modules),
	importModules = async (...modules) => {
		const scan = modules[1] === true,
			_exclude = scan ? modules.pop() : [];
		modules = scan ? modules.shift() : modules;
		//log('scan:', scan);
		//log('exclude:', _exclude);
		//log('modules-scan\n', modules);
		modules = (!scan ? modules : getFiles(modules, { _exclude })).map(m => !scan ? m : `${toUrl(modules)}/${m}`);
		//log('modules\n', modules);
		const imports = await $import(true, ...modules);
		return fromEntries(keys(imports).map(m => [m.replace(/\-+/g, '_'), imports[m]]));
	};

export default { imports, importModules };
