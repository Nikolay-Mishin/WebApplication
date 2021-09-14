import imports from './import.js'; // grab the importer

// export through the same pattern
export const exports = await new Promise(async $export => {
	// grab many modules at once
	const [a, b] = await imports(
		import('./baseHelpers.js'),
		import('./helpers.js')
	);
	$export({ name: 'c', a, b }); // export this module
});

// ES2017 Asynchronous Export
export default new Promise(async $export => {
	const module = await Promise.resolve(
		{ my: 'module' }
	);
	$export(module);
});

// keeping the same pattern
export const promise = await new Promise(async $export => {
	$export({ my: 'module' }); // export the module
});

// dropping the Promise all together
// await async dependencies
export const _export = await (async () => {
	return { my: 'module' }; // export the module
})();
