const { log } = require('console'),
	{ concat, fromEntries, isObject, isDir, keys, values, isArray, getFiles, fileName } = require('./baseHelpers'),
	$import = (modules) => modules.map(m => require(m));

// flatten arguments to enable both - imports([m1, m2]) or imports(m1, m2)
const imports = (...modules) => $import(concat(modules)),
	importModules = (...modules) => {
		modules = concat(modules);
		const isObj = isObject(modules[0]),
			[_keys, _values, scan] = !isObj ? [[], [], isDir(modules[0])] : [keys(modules[0]), values(modules[0]), false];
		modules = scan ? modules.shift() : (isObj ? _values : modules);
		modules = (!scan ? modules : getFiles(modules, { exclude: scan && isArray(modules) ? modules.pop() : [] }))
			.map(m => !scan ? m : `${modules}/${m}`);
		return fromEntries($import(modules).map((m, i) => [isObj ? _keys[i] : fileName(modules[i]).replace(/\-+/g, '_'), m]));
	};

module.exports = { imports, importModules };
