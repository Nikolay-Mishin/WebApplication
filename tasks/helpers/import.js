// ES2015 simplified version
// flatten arguments to enable both
// imports([m1, m2]) or imports(m1, m2)
export default (...modules) => Promise.all(
	modules.concat.apply([], modules) // per each resolved module
		.map(async m => (await m).default) // ES2017 version
		//.map(m => Promise.resolve(m).then(m => m.default)) // return its default
);
