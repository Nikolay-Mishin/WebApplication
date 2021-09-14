import { log } from 'console';

import module from './export.js'; // both static and dynamic importers will work

import { exports, promise, _export } from './export.js';

//log('exports\n', exports.name);
//log('promise\n', promise);
//log('_export\n', _export);

// ES2017 consumer and exporter
export default await new Promise(async $export => {
	const module = await (await import('./export.js')).default;
	//log('ES2017 consumer and exporter\n', module);
	$export({ module, method() { } });
});

export { module };

// or
export const consumer = await import('./export.js').then(module => {
	//log('dynamic import\n', module.default);
	return module.default;
});

// ES2015 consumer
export const consumer2015 = await module.then(module => {
	//log('ES2015 consumer\n', module); // will log "module"
	return module;
});

// ES2017 consumer
export const consumer2017 = await (async () => {
	const module = await (await import('./export.js')).default;
	//log('ES2017 consumer\n', module);
	return module;
})();
