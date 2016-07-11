import dom from '../../helpers/dom';
import deepmerge from '../../helpers/deepmerge';
import Events from '../media/events/index';
import relativeSizePos from './relativeSizePos';
import {
	isFunction
} from '../../helpers/utils';

export default class Container extends Events{
	constructor(el, opts, ctx, player) {
		let playerPaused = false;
		let isVisible = false;
		let externalControls = false;
		let body = dom.select('.body', el);
		this.body = body;
		let elDimension = function(fopts) {
			if(fopts) opts = deepmerge(opts, fopts);
			let d = new relativeSizePos(player, opts);
			body.style.width = d.width + "%";
			body.style.height = d.height + "%";
			if (dom.stylePrefix.transform) {
				dom.transform(body, 'translate(' + 100 / d.width * d.x + '%,' + 100 / d.height * d.y + '%)');
			} else {
				body.style.top = d.x + "%";
				body.style.left = d.y + "%";
			}
		}
		elDimension();
		player.on('videoResize', elDimension);

		this.updateSizePos = function(data){
			elDimension(data);
		}

		this.hide = ()=>{
			if (isVisible) {
				dom.addClass(el, 'hidden');
				if (opts.pause) {
					if (!playerPaused) {
						player.play();
					}
					isVisible = false;
					if (externalControls && opts.externalControls) {
						player.externalControls.enabled(true);
					}
				}
				setTimeout(() => {
					el.style.display = "none";
					if (isFunction(opts.onHide)) opts.onHide();
					ctx.checkVisibleElements();
					this.emit('hide');
				}, 250);
			}
		}
		this.show = ()=>{
			if (!isVisible) {
				ctx.enabled(true);
				el.style.display = "block";
				setTimeout(() => {
					dom.removeClass(el, 'hidden');
					if (isFunction(opts.onHide)) opts.onShow();
					this.emit('show');
				}, 50);
				if (opts.pause) {
					if (!player.paused()) {
						playerPaused = false;
						player.pause();
					} else {
						playerPaused = true;
					}
				}
				isVisible = true;
				if (opts.externalControls) {
					if (player.externalControls.enabled()) {
						externalControls = true;
						player.externalControls.enabled(false);
					} else {
						externalControls = true;
					}
				}
			}
		}

		let overlay = dom.select('.overlay', el);

		this.backgroundColor = function(v) {
			if (v != null) {
				overlay.style.backgroundColor = v;
			} 
			return overlay.style.backgroundColor;
		}

		let clsElements = dom.selectAll('.triggerClose', el);
		for (var i = 0, n = clsElements.length; i < n; i += 1) {
			clsElements[i].addEventListener('click', this.hide);
		}


		if (opts.visible) {
			this.show();
		}

		this.visible = function(v) {
			if (typeof v === 'boolean') isVisible = v;
			return isVisible;
		}

	}
}