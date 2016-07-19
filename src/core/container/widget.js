import Events from 'eventemitter3';
import dom from '../../helpers/dom';
import deepmerge from '../../helpers/deepmerge';
import backgroundColorFN from '../../helpers/backgroundColor';
import relativeSizePos from './relativeSizePos';
import {
	isFunction
} from '../../helpers/utils';

let defaults = {
	backgroundColor: '',
	onHide: null,
	onShow: null,
	externalControls: true,
	visible: true,
	pauseVideo: false
}

export default class Widget extends Events {
	constructor(el, opts, parent, parentPlayer) {
		super();
		this.wrapper = el;
		this._visible = false;
		this.parentPlayerPaused = false;
		this._settings = deepmerge(defaults, opts);
		this._cache = {};
		this.backgroundColor = backgroundColorFN(el);
		this.parent = parent;
		this.parentPlayer = parentPlayer;
		this.init();
	}
	settings(fopts){
		if (fopts) {
			this._settings = deepmerge(this._settings, fopts);
			this.resize();
		}
		return this._settings;
	}
	init() {
		this.parentPlayer.on('resize', () => {
			this.resize();
		});
		if (this._settings.visible) {
			this.show();
		} else {
			this.wrapper.style.display = "none";
		}
		this.resize();
	}
	visible(v) {
		if (typeof v === 'boolean') this._visible = v;
		return this._visible;
	}
	hide() {
		if (this.visible()) {
			this.visible(false);
			this.emit('beforeHide');
			dom.addClass(this.wrapper, 'hidden');
			if (this._settings.pauseVideo) {
				if (!this.parentPlayerPaused) {
					this.parentPlayer.play();
				}
			}
			setTimeout(() => {
				this.wrapper.style.display = "none";
				if (isFunction(this._settings.onHide)) this._settings.onHide();
				this.parent.checkVisibleElements();
				this.emit('hide');
			}, 250);
		}
	}
	show() {
		if (!this.visible()) {
			this.visible(true);
			this.emit('beforeShow');
			this.parent.enabled(true);
			this.wrapper.style.display = "block";
			setTimeout(() => {
				dom.removeClass(this.wrapper, 'hidden');
				if (isFunction(this._settings.onHide)) this._settings.onShow();
				this.emit('show');
			}, 50);
			if (this._settings.pauseVideo) {
				if (!this.parentPlayer.paused()) {
					this.parentPlayerPaused = false;
					this.parentPlayer.pause();
				} else {
					this.parentPlayerPaused = true;
				}
			}
		}
	}
	resize() {
		if (
			this._cache.width != this._settings.width ||
			this._cache.height != this._settings.height ||
			this._cache.x != this._settings.x ||
			this._cache.y != this._settings.y
		) {
			let d = new relativeSizePos(this.parentPlayer, this._settings);
			this.wrapper.style.width = d.width + "%";
			this.wrapper.style.height = d.height + "%";
			dom.transform(this.wrapper, 'translate(' + 100 / d.width * d.x + '%,' + 100 / d.height * d.y + '%)');
			this._cache.width = this._settings.width;
			this._cache.height = this._settings.height;
			this._cache.x = this._settings.x;
			this._cache.y = this._settings.y;
		}
		this.emit('resize');
	}
	addClass(cls) {
		if (cls != 'kmlWidget')
			dom.addClass(this.wrapper, cls);
	}
	removeClass(cls) {
		if (cls != 'kmlWidget')
			dom.removeClass(this.wrapper, cls);
	}
	toggleClass(cls) {
		if (cls != 'kmlWidget')
			dom.toggleClass(this.wrapper, cls);
	}
	content(el) {
		this.wrapper.innerHTML = el;
	}
	setFontSize(v) {
		this.wrapper.style.fontSize = v + "%";
	}
	destroy() {
		this.removeAllListeners();
		this.parent.remove(this.wrapper);
		dom.removeElement(this.wrapper);
	}
}