import module from './exports.js'; // both static and dynamic importers will work

// or
import('./exports.js').then(m => {
	const module = m.default;
	console.log('dynamic import\n', module);
});

// ES2015 consumer
module.then(exports => {
	// will log "module"
	console.log('ES2015 consumer\n', exports.my);
});

// ES2017 consumer
(async () => {
	const module = await (
		await import('./exports.js')
	).default;
	console.log('ES2017 consumer\n', module);
})();

// ES2017 consumer and exporter
export default new Promise(async $export => {
	const module = await (
		await import('./exports.js')
	).default;
	console.log('ES2017 consumer and exporter\n', module);
	$export({ module, method() { } });
});
