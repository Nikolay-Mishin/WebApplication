import h from './helpers/helpers.js';
const {
	config: { serverPHPconfig },
	modules: { connectPHP }
} = h;

export default () => connectPHP.server(serverPHPconfig)
