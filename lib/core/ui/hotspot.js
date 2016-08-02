import Events from 'eventemitter3';
import {createElement,removeElement, hasClass, addClass,removeClass,toggleClass} from '../../helpers/dom';
import deepmerge from '../../helpers/deepmerge';
import backgroundColorFN from '../../helpers/backgroundColor';
import relativeSizePos from './relativeSizePos';
import {isArray, isObject, isFunction, isDomElement, isString, setCenterPoint} from '../../helpers/utils';

let defaults = {
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	origin: "topLeft",
	start: 0,
	end: -1,
	className: "kmlHotspot",
	on: {
		show: function() {},
		hide: function() {},
		mouseEnter: function() {},
		mouseLeave: function() {},
		mouseMove: function() {},
		click: function() {}
	},
	content: null,
	font: 100,
	path: false,
	visible: void 0
}

// check if it is better to use babel-polyfill or write the module not as a es6 class
// const forceHide = Symbol('forceHide');
// const pathStart = Symbol('pathStart');
// const pathEnd = Symbol('pathEnd');
// const refreshEnd = Symbol('refreshEnd');
// const refreshStart = Symbol('refreshStart');


export default class Hotspot extends Events {
	constructor(parentPlayer, options) {
		super();
		//somewhat private variables
		this.__forceHide = false;
		this.__pathStart = void 0;
		this.__pathEnd = void 0;
		this.__refreshStart = 0;
		this.__refreshEnd = 0;
		//create hotspot wrapper
		this.wrapper = createElement('div');
		this.wrapper.backgroundColor = backgroundColorFN(this.wrapper);

		//convert position and size to absolute values
		options = deepmerge(options,relativeSizePos(parentPlayer, options));

		this.__settings = deepmerge(defaults, options);
		this.parentPlayer = parentPlayer;
		this.x = this.__settings.x;
		this.y = this.__settings.y;
		this.width = this.__settings.width;
		this.height = this.__settings.height;
		this.origin = this.__settings.origin;
		this.start = this.__settings.start;
		this.end = this.__settings.end;
		this.path = this.__settings.path;
		this.visible = this.__settings.visible;
		if(isArray(this.path)){
			if (this.path[0]['start']) this.__pathStart = this.path[0]['start'];
			if (this.path[this.path.length - 1]['end']) this.__pathEnd = this.path[this.path.length - 1]['end'];
		}else{
			this.path = false;
		}

		for(var k in this.__settings['on']){
			let fn = this.__settings['on'][k];
			if(isFunction(fn)){
				this.on(k, (e)=>{fn(e);});
			}
		}

		this.init();
	}
	init(){
		this.addClass(this.__settings['className']);
		this.wrapper.style.position = "absolute";
		this.wrapper.style.top = (this.y || 0) + "%";
		this.wrapper.style.left = (this.x || 0) + "%";
		this.wrapper.style.width = (this.width || 0) + "%";
		this.wrapper.style.height = (this.height || 0) + "%";
		this.wrapper.addEventListener('click', (e)=>{ this.emit('click', e); });
		this.wrapper.addEventListener('mouseenter', (e)=>{ this.emit('mouseEnter', e); });
		this.wrapper.addEventListener('mouseleave', (e)=>{ this.emit('mouseLeave', e); });
		this.wrapper.addEventListener('mousemove', (e)=>{ this.emit('mouseMove', e); });

		if (this.start > 0) {
			this.visible = false;
			this.wrapper.style.display = "none";
		} else {
			this.visible = true;
			this.wrapper.style.display = "block";
		}
	}
	hasClass(cls){
		return hasClass(this.wrapper, cls);
	}
	addClass(cls){
		addClass(this.wrapper, cls);
	}
	removeClass(cls){
		removeClass(this.wrapper, cls);
	}
	toggleClass(cls){
		toggleClass(this.wrapper, cls);
	}
	content(cnt){
		if (cnt != null) {
			if (isFunction(cnt)) {
				cnt(this.wrapper).bind(this);
			}
			if (isDomElement(cnt)) {
				this.wrapper.appendChild(cnt);
			}
			if (isString(cnt)) {
				this.wrapper.innerHTML = cnt;
			}
			if (isObject(cnt)) {
				for (var k in cnt) {
					this.content(cnt[k]);
				}
			}
		}
		return this.wrapper;
	}
	font(){
		this.wrapper.fontSize = this.__settings['font'] + "%";
	}
	checkRefresh(t) {
		if (this.__pathStart != null && this.__pathEnd != null) {
			if (t >= this.__pathStart && t <= this.__pathEnd) {
				if (this.__refreshStart !== 0) this.__refreshStart = 0;
				if (this.__refreshEnd !== 0) this.__refreshEnd = 0;
			} else {
				if (t < this.__pathStart && this.__refreshStart !== 1) {
					this.resize();
					this.__refreshStart = 1;
				}
				if (t > this.__pathEnd && this.__refreshEnd !== 1) {
					this.resize();
					this.__refreshEnd = 1;
				}
			}
		}
	}
	resize(o, s) {
		if (this.visible) {
			// var p = player.bounds();
			// if (o === undefined) o = {
			// 	x: this.x,
			// 	y: this.y
			// };
			// if (s === undefined) s = {
			// 	width: this.width,
			// 	height: this.height
			// };

			// var oWidth = s.width * p.width / p.width_org,
			// 	oHeight = s.height * p.height / p.height_org,
			// 	posX = p.offset_x + o.x * p.width / p.width_org,
			// 	posY = p.offset_y + o.y * p.height / p.height_org,
			// 	c = setCenterPoint(posX, posY, oWidth, oHeight, this.origin),
			// 	transform = "";
			// posX = c.x;
			// posY = c.y;
			// this.el_.style.width = oWidth + "px";
			// this.el_.style.height = oHeight + "px";
			// this._width = oWidth;
			// this._height = oHeight;
			// if (stylePrefix.transform) {
			// 	transform += translate(posX, posY);
			// 	this.el_.style[stylePrefix.transform] = transform;
			// 	return
			// }
			// this.el_.style.left = posX + "px";
			// this.el_.style.top = posY + "px";
		}
	}
	destroy() {
		this.removeEventListeners();
		removeElement(this.wrapper);
	}
	show() {
		this.__forceHide = false;
		this.visible = true;
		this.resize();
		this.font();
		this.wrapper.style.display = "block";
		this.emit('show');
	}
	_show () {
		if (!this.visible && !this.__forceHide) {
			this.visible = true;
			this.resize();
			this.font();
			this.wrapper.style.display = "block";
			this.emit('show');
		}
	}
	hide() {
		this.__forceHide = true;
		this._hide();
	}
	_hide() {
		if (this.visible) {
			this.visible = false;
			this.emit('hide');
			this.wrapper.style.display = "none";
		}
	}
	originPoint(origin) {
		if (origin != void 0) {
			this.origin = origin;
			this.resize();
		}
		return this.origin;
	}
}