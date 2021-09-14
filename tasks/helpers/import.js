import { pathToFileURL as toUrl } from 'url';
import { basename as base, extname as ext } from 'path';
import { isArray, getFiles, fromEntries, keys } from './baseHelpers.js';

// ES2015 simplified version
// flatten arguments to enable both
// imports([m1, m2]) or imports(m1, m2)
export const imports = (...modules) => Promise.all(
		modules.concat.apply([], modules).map(async m => (await import(m)).default) // ES2017 version - per each resolved module
		//.map(m => Promise.resolve(m).then(m => m.default)) // return its default
	),
	_import = async (...modules) => Object.fromEntries(
		await Promise.all(modules.concat.apply([], modules)
			.map(async m => [base(m, ext(m)), (await import(m)).default]))
	),
	importModules = async (path, exclude = []) => {
		const isArr = isArray(path),
			imports = await _import((isArr ? path : getFiles(path, { exclude })).map(m => isArr ? m : `${toUrl(path)}/${m}`));
		return fromEntries(keys(imports).map(m => [m.replace(/\-+/g, '_'), imports[m]]));
	};

export default { imports, _import, importModules };
