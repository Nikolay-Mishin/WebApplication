const { log } = require('console'),
	{ basename: base, extname: ext } = require('path'),
	{ fromEntries, isObject, keys, values, isDir, getFiles } = require('./baseHelpers'),
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
		const isObj = isObject(modules[0]),
			[_keys, _values, scan] = !isObj ? [[], [], isDir(modules[0])] : [keys(modules[0]), values(modules[0]), false],
			_exclude = scan ? modules.pop() : [];
		modules = scan ? modules.shift() : (isObj ? _values : modules);
		modules = (!scan ? modules : getFiles(modules, { _exclude })).map(m => !scan ? m : `${modules}/${m}`);
		const imports = $import(true, ...modules);
		return fromEntries(keys(imports).map((m, i) => [isObj ? _keys[i] : m.replace(/\-+/g, '_'), imports[m]]));
	};

module.exports = { imports, importModules };
