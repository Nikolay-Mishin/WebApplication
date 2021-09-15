import { log } from 'console';
import h from './helpers/helpers.js';
const {
		lastRun,
		modules: { gulp: { src, dest }, changed }
	} = h;

export default function move_test() {
	const { tasks: { data } } = h;
	return data('src/**/*')
		//.pipe(changed('www', { hasChanged: changed.compareContents }))
		//.pipe(dest('www'))
		.pipe(dest(function (file) {
			return file.extname == '.html' ? 'files/html' :
				file.extname == '.css' ? 'files/css' :
				file.extname == '.js' ? 'files/js' : 'files'
		}));
}
