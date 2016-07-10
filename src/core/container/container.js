import dom from '../../helpers/dom';
import adaptiveSizePos from './adaptiveSizePos';
import relativeSizePos from './relativeSizePos';
export default class Container {
	constructor(ctx) {
		this.el = dom.createElement('div', {
			style: 'position:absolute; pointer-events: none;'
		});
		let ac = new adaptiveSizePos(function(){
			return {
				offsetX: ctx.offsetX(),
				offsetY: ctx.offsetY(),
				width: ctx.width(),
				height: ctx.height(),
				scale: ctx.width() / ctx.defaultWidth(),
				scaleY: ctx.width() / ctx.defaultHeight()
			};
		}, {}, ctx);
		ac.applyTo(this.el);
		ac.enabled(true);

		ctx.wrapper.appendChild(this.el);

		this.add = function(opts,el = {}) {
			if(!el.nodeType) el = dom.createElement('div');
			dom.addClass(el, 'kmlContainer');
			el.style.position = "absolute";
			el.style.pointerEvents = "all";
			let elDimension = function() {
				let d = new relativeSizePos(ctx,opts);
				el.style.width = d.width + "%";
				el.style.height = d.height + "%";
				if (dom.stylePrefix.transform) {
					dom.transform(el, 'translate(' + 100/d.width*d.x + '%,' + 100/d.height*d.y + '%)');
				} else {
					el.style.top = d.x + "%";
					el.style.left = d.y + "%";
				}
			}
			elDimension();
			this.el.appendChild(el);
			ctx.on('resize', elDimension);
		}
	}
}