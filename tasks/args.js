import { log } from 'console';
import h from './helpers/helpers.js';
const { args: _args } = h;

export default async function args() { log(_args); };
