import h, { log, error, nullProto } from './baseHelpers.js';
import { JSDOM } from 'jsdom';

export { JSDOM };

log('JSDOM:', JSDOM);

export const dom = new JSDOM(`...`),
	{ window } = dom,
	{ document } = window;

log('dom:', dom);
log('window:', window);
log('document:', document);

export const nodeList = document.querySelectorAll('html'),
	html = nodeList[0],
	htmlEl = html.getProto(),
    htmlProto = html.getPrototype(),
	create = {}._register(function create(el = 'div') { return document.createElement(el) });

log('nodeList:', nodeList);
log('htmlEl:', htmlEl);
log('htmlProto:', htmlProto);

const nodeListHelpers = nodeList.registerAll(
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
	htmlElHelpers = htmlEl.registerAll(
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

export const { filter, clearClasses } = nodeListHelpers,
	{ getAll, getStyles, get, addEvent, setHtml, getRect } = htmlElHelpers;

export default h.assignDefine({ JSDOM, dom, nodeList, html, htmlEl, htmlProto, create }, nodeListHelpers, htmlElHelpers);

log('h:', h);
log('htmlEl:', htmlEl);
log('htmlProto:', htmlProto);

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
