import requestAnimationFrame from './polyfills/requestAnimationFrame';
import tocca from './polyfills/tocca';
import inFrame from './helpers/inFrame';
import deepmerge from './helpers/deepmerge';
import {
	capitalizeFirstLetter,
	scaleFont,
	debounce
} from './helpers/utils';
import dom from './helpers/dom';
import device from './helpers/device';
import autoFont from './core/autoFont';
import Containers from './core/container/containers';
import Media from './core/media/index';
import containerBounds from './helpers/containerBounds';
import pageVisibility from './helpers/pageVisibility';
import externalControls from './core/media/events/externalControls';
import ajax from './helpers/ajax';

import clock from './clock';

const fn_contextmenu = function(e) {
	e.stopPropagation();
	e.preventDefault();
	return false;
}

const defaults = {
	videoWidth: 920,
	videoHeight: 520,
	autoplay: false,
	loop: false,
	controls: false,
	font: {
		ratio: 1,
		min: .5,
		units: "em"
	}
};

class kmlPlayer extends Media {
	constructor(settings, _events, app) {
		let el = settings.video;
		super(el);
		this.iframe = inFrame();
		if (el == null) return;
		this._bounds = {};
		this.device = device;
		this.__settings = deepmerge(defaults, settings);
		dom.addClass(el, "kml" + capitalizeFirstLetter(el.nodeName.toLowerCase()));
		this.wrapper = dom.wrap(this.media, dom.createElement('div', {
			class: 'kmlPlayer'
		}));
		dom.triggerWebkitHardwareAcceleration(this.wrapper);
		if (this.inIframe) {
			dom.addClass(this.wrapper, "inFrame");
		}
		//initSettings
		for (var k in this.__settings) {
			if (this[k]) {
				if (k === 'autoplay' && this.__settings[k] && !this.inIframe) {
					this.play();
					continue;
				}
				this[k](this.__settings[k]);
			}
			if (k === 'controls' && this.__settings[k] === "native") {
				this.nativeControls(true);
			}
		}

		//initPageVisibility
		this.pageVisibility = new pageVisibility(el);

		//initexternalControls
		this.externalControls = new externalControls(el);

		//initContainers
		this.containers = new Containers(this);

		this.container = function(stg, el){
			return this.containers.add(stg, el, 'container');
		}

		this.videoContainer = function(stg){
			return this.containers.add(stg, null, 'video');
		}

		this.popupContainer = function(stg){
			return this.containers.add(stg, null, 'popup');
		}

		//autoFONT
		if (typeof this.__settings.font === "boolean" && this.__settings.font) this.__settings.font = defaults.font;
		this.autoFont = new autoFont(this.wrapper, this.__settings.font, this);
		if (this.__settings.font) this.autoFont.enabled(true);

		//initCallbackEvents
		for (var evt in _events) {
			this.on(evt, _events[evt], this);
		}

		if (typeof app === 'function') {
			app.bind(this);
		}

		this.on('loadedmetadata', () => {
			if (this.media.width != this.media.videoWidth || this.media.height != this.media.videoHeight) {
				this.videoWidth();
				this.videoHeight();
				this.emit('resize');
			}
			if(!this._app){
				app.bind(this)();
				this._app = true;
			}
			
		});

		el.addEventListener('dbltap', ()=>{this.toggleFullScreen();});

		let videoSizeCache = {
			w: this.width(),
			x: this.offsetX(),
			y: this.offsetY(),
			h: this.height()
		}
		let checkVideoResize = () => {
			this._bounds = containerBounds(this.media);
			let w = this.width();
			let h = this.width();
			let x = this.offsetX();
			let y = this.offsetY();
			if (videoSizeCache.w != w || videoSizeCache.h != h || videoSizeCache.x != x || videoSizeCache.y != y) {
				videoSizeCache.w = w;
				videoSizeCache.h = h;
				videoSizeCache.x = x;
				videoSizeCache.y = y;
				this.emit('resize');
			}
			window.requestAnimationFrame(checkVideoResize);
		}

		checkVideoResize();
	}

	contextMenu(v) {
		if (typeof v === 'boolean') {
			v ? this.media.removeEventListener('contextmenu', fn_contextmenu) : this.media.addEventListener('contextmenu', fn_contextmenu);
		}
	}

	ajax(options) {
		return ajax(options);
	}

	videoWidth(v) {
		if (this.media.videoWidth) {
			this.media.width = this.media.videoWidth;
			return this.media.videoWidth;
		}
		if (!isNaN(v)) {
			v = parseFloat(v);
			this.media.width = v;
		}
		return this.media.width;
	}

	videoHeight(v) {
		if (this.media.videoHeight) {
			this.media.height = this.media.videoHeight;
			return this.media.videoHeight;
		}
		if (!isNaN(v)) {
			v = parseFloat(v);
			this.media.height = v;
		}
		return this.media.height;
	}

	scale() {
		return this.videoWidth() / this.videoHeight();
	}

	bounds(v) {
		if (this._bounds[v] !== null) return this._bounds[v];
		return this._bounds;
	}

	width() {
		return this.bounds('width');
	}

	height() {
		return this.bounds('height');
	}

	offsetX() {
		return this.bounds('offsetX');
	}

	offsetY() {
		return this.bounds('offsetY');
	}

	wrapperHeight() {
		return this.media.offsetHeight;
	}

	wrapperWidth() {
		return this.media.offsetWidth;
	}

	wrapperScale() {
		return this.media.offsetWidth / this.media.offsetHeight;
	}

	addClass(v, el) {
		if (el != null) {
			dom.addClass(v, el);
			return;
		}
		dom.addClass(this.wrapper, v);
	}
	removeClass(v, el) {
		if (el != null) {
			dom.removeClass(v, el);
			return;
		}
		if (v !== 'kmlPlayer') {
			dom.removeClass(this.wrapper, v);
		}
	}
	toggleClass(v, el) {
		if (el != null) {
			dom.toggleClass(v, el);
			return;
		}
		if (v !== 'kmlPlayer') {
			dom.toggleClass(this.wrapper, v);
		}
	}

	clock(){
		return clock;
	}
};

//disable on production
if (device.isTouch) {
	window.onerror = function(message, scriptUrl, line, column) {
		console.log(line, column, message);
		alert(line + ":" + column + "-" + message);
	};
}

export default kmlPlayer;