import { basename as base, extname as ext } from 'path';

// ES2015 simplified version
// flatten arguments to enable both
// imports([m1, m2]) or imports(m1, m2)
export default (...modules) => Promise.all(
	modules.concat.apply([], modules).map(async m => (await import(m)).default) // ES2017 version - per each resolved module
		//.map(m => Promise.resolve(m).then(m => m.default)) // return its default
);

export const _import = async (...modules) => Object.fromEntries(
	await Promise.all(modules.concat.apply([], modules)
		.map(async m => [base(m, ext(m)), (await import(m)).default]))
);
