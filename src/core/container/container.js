import deepmerge from '../../helpers/deepmerge';
import {
	procentFromString
} from '../../helpers/utils';
import dom from '../../helpers/dom';
import adaptiveContainer from './adaptiveContainer';
let defaults = {
	x: 0,
	y: 0,
	width: 0,
	height: 0
}
export default class Container {
	constructor(ctx) {
		var _bounds = () => {
			return {
				offsetX: ctx.offsetX(),
				offsetY: ctx.offsetY(),
				width: ctx.width(),
				height: ctx.height(),
				scale: ctx.width() / ctx.defaultWidth(),
				scaleY: ctx.width() / ctx.defaultHeight()
			};
		};
		this.el = dom.createElement('div', {
			style: 'position:absolute; pointer-events: none;'
		});
		let ac = new adaptiveContainer(_bounds, {}, ctx);
		ac.applyTo(this.el);
		ac.enabled(true);

		ctx.wrapper.appendChild(this.el);

		this.add = function(opts,el = {}) {
			if(!el.nodeType) el = dom.createElement('div');
			let o = deepmerge(defaults, opts);
			el.style.position = "absolute";
			el.style.pointerEvents = "all";
			let elDimension = function() {
				let _w = procentFromString(o.width); 
				if(!_w) _w = o.width / ctx.defaultWidth() * 100;
				let _h = procentFromString(o.height); 
				if(!_h) _h = o.height / ctx.defaultHeight() * 100;
				let _x = procentFromString(o.x);
				if(!_x) _x = o.x / ctx.defaultWidth() * 100;
				let _y = procentFromString(o.y);
				if(!_y) _y = o.y / ctx.defaultHeight() * 100;

				el.style.width = _w + "%";
				el.style.height = _h + "%";
				if (dom.stylePrefix.transform) {
					dom.transform(el, 'translate(' + 100/_w*_x + '%,' + 100/_h*_y + '%)');
				} else {
					el.style.top = _x + "%";
					el.style.left = _y + "%";
				}
			}
			elDimension();
			this.el.appendChild(el);
			ctx.on('resize', elDimension);
		}
	}
}