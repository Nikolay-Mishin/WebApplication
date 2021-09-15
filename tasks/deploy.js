import h from './helpers/helpers.js';
const {
	lastRun,
	config: { paths, deploy: { include, exclude } },
	modules: {
		gulp: { src },
		rs
	}
} = h;

export default function deploy() {
	return src(paths.build.root, lastRun(deploy))
		.pipe(rs({
			root: paths.build.root,
			hostname: deploy.host,
			destination: deploy.folder,
			port: deploy.port,
			include: include,
			exclude: exclude,
			recursive: true,
			archive: true,
			silent: false,
			compress: true
		}));
}
