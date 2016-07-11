import dom from '../../helpers/dom';
import relativeSizePos from './relativeSizePos';
import {
	isFunction
} from '../../helpers/utils';

export default class Container {
	constructor(el, opts, ctx, player) {
		let playerPaused = false;
		let isVisible = false;
		let externalControls = false;
		let body = dom.select('.body', el);
		let elDimension = function() {
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

		this.hide = function() {
			if (isVisible) {
				dom.addClass(el, 'hidden');
				setTimeout(() => {
					el.style.display = "none";
					if (isFunction(opts.onHide)) opts.onHide();
				}, 250);
				if(opts.pause){
					if (!playerPaused) {
						player.play();
					}
					isVisible = false;
					if (externalControls && opts.externalControls) {
						player.externalControls.enabled(true);
					}
				}
				ctx.checkVisibleElements();
			}
		}
		this.show = function() {
			if (!isVisible) {
				ctx.enabled(true);
				el.style.display = "block";
				setTimeout(() => {
					dom.removeClass(el, 'hidden');
					if (isFunction(opts.onHide)) opts.onShow();
				}, 50);
				if(opts.pause){
					if (!player.paused()) {
						playerPaused = false;
						player.pause();
					} else {
						playerPaused = true;
					}
				}
				isVisible = true;
				if(opts.externalControls){
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
			} else {
				overlay.style.backgroundColor
			}
		}

		this.backgroundColor();

		let clsElements = dom.selectAll('.triggerClose', el);
		for (var i = 0, n = clsElements.length; i < n; i += 1) {
			clsElements[i].addEventListener('click', this.hide);
		}


		if(opts.visible){
			this.show();
		}

		this.visible = function(v){
			if(typeof v === 'boolean') isVisible = v;
			return isVisible;
		}

	}
}