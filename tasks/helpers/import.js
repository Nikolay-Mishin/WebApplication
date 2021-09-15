const { log } = require('console'),
	{ basename: base, extname: ext } = require('path'),
	{ isArray, getFiles, fromEntries, keys } = require('./baseHelpers'),
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
	importModules = (...modules) => {
		const scan = modules[1] === true,
			exclude = scan ? modules.pop() : [];
		modules = scan ? modules.shift() : modules;
		//log('scan:', scan);
		//log('exclude:', exclude);
		//log('modules-scan\n', modules);
		modules = (!scan ? modules : getFiles(modules, { exclude })).map(m => !scan ? m : `${modules}/${m}`);
		//log('modules\n', modules);
		const imports = $import(true, ...modules);
		return fromEntries(keys(imports).map(m => [m.replace(/\-+/g, '_'), imports[m]]));
	};

module.exports = { imports, importModules };
