const { basename: base, extname: ext } = require('path'),
	{ isArray, getFiles, fromEntries, keys } = require('./baseHelpers.js'),
	$import = (toObj, ...modules) => {
		const imports = modules.concat.apply([], modules)
			.map(m => {
				const module = require(m);
				return !toObj ? module : [base(m, ext(m)), module];
			});
		return !toObj ? imports : fromEntries(imports);
	};

// flatten arguments to enable both - imports([m1, m2]) or imports(m1, m2)
const imports = (...modules) => $import(false, ...modules),
	importModules = (path, exclude = []) => {
		const isArr = isArray(path),
			modules = (isArr ? path : getFiles(path, { exclude })).map(m => isArr ? m : `${path}/${m}`),
			imports = $import(true, ...modules);
		return fromEntries(keys(imports).map(m => [m.replace(/\-+/g, '_'), imports[m]]));
	};

module.exports = { imports, importModules };
