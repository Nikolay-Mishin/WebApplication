import h from './helpers/helpers.js';
const {
	config: { serverPHPconfig },
	modules: { connectPHP }
} = h;

export default function serverPHP() {
	return connectPHP.server(serverPHPconfig);
};
