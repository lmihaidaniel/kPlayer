import Events from 'eventemitter3';
import dom from '../../helpers/dom';
import deepmerge from '../../helpers/deepmerge';
import backgroundColor from '../../helpers/backgroundColor';
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
		body.backgroundColor = backgroundColor(body);
		super();
		this.ctx = ctx;
		this.body = body;
		this.config = function(fopts) {
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
			this.emit('config');
			return d;
		}
		this.config();
		player.on('resize', this.config);

		this.hide = ()=>{
			if (isVisible) {
				this.emit('beforeHide');
				dom.addClass(el, 'hidden');
				isVisible = false;
				if (opts.pause) {
					if (!playerPaused) {
						player.play();
					}
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
				isVisible = true;
				this.emit('beforeShow');
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

		if (opts.visible) {
			this.show();
		}

		this.visible = function(v) {
			if (typeof v === 'boolean') isVisible = v;
			return isVisible;
		}
	}
	destroy(){
		this.removeAllListeners();
		this.ctx.remove(this.body);
	}
}