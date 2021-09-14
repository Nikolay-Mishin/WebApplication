import module from './export.js'; // both static and dynamic importers will work

// or
export const consumer = import('./export.js').then(m => {
	const module = m.default;
	console.log('dynamic import\n', module);
});

// ES2015 consumer
export const consumer2015 = module.then(exports => {
	console.log('ES2015 consumer\n', exports.my); // will log "module"
});

// ES2017 consumer
export const consumer2017 = (async () => {
	const module = (await import('./export.js')).default;
	console.log('ES2017 consumer - module\n', module);
	const _module = await module;
	console.log('ES2017 consumer\n', _module);
})();

// ES2017 consumer and exporter
export default new Promise(async $export => {
	const module = (await import('./export.js')).default;
	console.log('ES2017 consumer and exporter - module\n', module);
	const _module = await module;
	console.log('ES2017 consumer and exporter\n', _module);
	$export({ _module, method() { } });
});

export const module2 = (await import('./export.js')).default;
console.log('module2\n', module2);

import { exports, promise, _export } from './export.js';

console.log('exports\n', exports);
console.log('promise\n', promise);
console.log('_export\n', _export);
