/// <binding ProjectOpened='_tasksWatch, _test' />

import _tasksWatch from './tasks/helpers/tasksWatch.js';
export { _tasksWatch };
import tasks from './tasks/helpers/tasks.js';
import h from './tasks/helpers/helpers.js';
const { modules, setMode } = h,
	{ series, parallel } = modules.gulp;

export const {
		// clean, html, js, dev_html, dev_scss, dev_js, dev_img, generate_favicon, server, watch, prod_html, prod_scss, prod_js,
		//deploy: _deploy
	} = tasks,
	//build = tasks.build = series(clean, parallel(html, js)),
	//move = tasks.move = series(clean, tasks.move_files),
	//dev = tasks.dev = series(clean, setMode(), parallel(dev_html, dev_scss, dev_js, dev_img/*, generate_favicon*/), server, watch),
	//prod = tasks.prod = series(clean, setMode(true), parallel(prod_html, prod_scss, prod_js, dev_img)),
	//deploy = tasks.deploy = series(tasks.prod, _deploy),
	//_test = tasks._test = import('./tasks/helpers/test.js');
	_test = tasks._test = (await import('./tasks/helpers/test.js')).default;

//export { _tasksWatch, build, move, dev, prod, deploy, _test };
export { _tasksWatch };

// задача по умолчанию
//export default tasks.default = series(tasks.build);

console.log('exports\n', tasks);
