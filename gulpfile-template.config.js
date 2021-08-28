const path = require('path');

const root = __dirname,
	build = path.resolve(root, 'build'),
	src = path.resolve(root, 'src');

module.exports = {
	root,
	build,
	src,
	pug2html: {
		beautifyHtml: false
	},
	lighthouse: {
		reportPath: path.resolve(root, 'reports'),
		PORT: 8080,
		chromeLauncherPort: 9222,
		config: {
			extends: 'lighthouse:default'
		},
		flags: {
			// available options - https://github.com/GoogleChrome/lighthouse/#cli-options
			chromeFlags: ['--show-paint-rects'],
			output: 'html'
		}
	},
	copyDependencies: {
		dist: path.resolve(root, 'local_modules')
	}
};
