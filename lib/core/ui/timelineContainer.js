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
	width: "100%",
	height: null,
	x: 0,
	y: null
}

export default class TimelineContainer extends Events {
	constructor(el, opts, parent, parentPlayer) {
		super();
		this.wrapper = el;
		this._visible = false;
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
		}
		return this._settings;
	}
	init() {
		if (this._settings.visible) {
			this.show();
		} else {
			this.wrapper.style.display = "none";
		}
		this.parentPlayer.on('resize', ()=>{this.resize()});
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
		}
	}
	resize() {
		if (
			this._cache.width != this._settings.width ||
			this._cache.height != this._settings.height ||
			this._cache.x != this._settings.x ||
			this._cache.y != this._settings.y 
		) {
			if(this._settings.width != null) this._cache.width = this.wrapper.style.width = this._settings.width;
			if(this._settings.height != null) this._cache.height = this.wrapper.style.height = this._settings.height;
			if(this._settings.x != null) this._cache.x = this.wrapper.style.left = this._settings.x;
			if(this._settings.y != null) this._cache.y = this.wrapper.style.top =  this._settings.y;
		}
	}
	addClass(cls) {
		if (cls != 'kmlTimeline')
			dom.addClass(this.wrapper, cls);
	}
	removeClass(cls) {
		if (cls != 'kmlTimeline')
			dom.removeClass(this.wrapper, cls);
	}
	toggleClass(cls) {
		if (cls != 'kmlTimeline')
			dom.toggleClass(this.wrapper, cls);
	}
	content(el) {
		if(el != null){
			if(el.nodeName){
				this.wrapper.appendChild(el);
			}else{
				this.wrapper.innerHTML = el;
			}
		}
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