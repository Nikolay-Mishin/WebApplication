import { log } from './baseHelpers.js';
import { JSDOM } from 'jsdom';

export { JSDOM };

export const dom = new JSDOM(`...`),
	{ window } = dom,
	{ document } = window;

export const nodeList = document.querySelectorAll('html'),
	html = nodeList[0],
	htmlEl = html.getPrototype(),
	create = (el = 'div') => document.createElement(el);

const h = {}.addRegister([create, { prop: 'createEl' }]),
	nodeListHelpers = nodeList.addRegister(
		{ filter(obj, cb) { return [].filter.call(obj, cb) } },
		function clearClasses(target, ...classList) {
			target.filter(placeholder => {
				log(placeholder)
				let contains = false
				classList.forEach(_class => { if (placeholder.classList.contains(_class)) contains = true })
				return contains
			}).forEach(placeholder => placeholder.classList.remove(classList))
		}
	),
	htmlElHelpers = htmlEl.addRegister(
		function getAll(el = 'html', target = document) {
			if (el instanceof HTMLElement) [el, target] = arguments.reverse()
			log([el, target])
			return target.querySelectorAll(el)
		},
		{ getStyles(el) { return el.currentStyle || getComputedStyle(el, '') } }, // IE || другой браузер
		{ get(el = 'html', target = document) { return target.querySelector(el) } },
		{ addEvent(el, event, cb) { return (el ? el : document).addEventListener(event, cb) } },
		function setHtml(target = '', pos = 'beforeend', html = '') {
			return (target ? target : document).insertAdjacentHTML(pos, html);
		},
		{ getRect(el = document) { return el.getBoundingClientRect(); } },
	);

[].registerAll();

export const { filter, clearClasses } = nodeListHelpers,
	{ getAll, getStyles, get, addEvent, setHtml, getRect } = htmlElHelpers;

export default { JSDOM, dom, nodeList, html, htmlEl }.assignDefine(h, nodeListHelpers, htmlElHelpers);

//html.classList.add('active');
//log(html.classList);

//log(nodeList.filter(el => el));

//nodeList.clearClasses('active');
//log(html.classList);

//log(html.getAll('body'));

//log(nullProto);

//log(nodeList.getProto());
//log(htmlEl.getProto());

//log(nodeList.getProto().hasOwn('filter'));
