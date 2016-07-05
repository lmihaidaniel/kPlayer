import deepmerge from './helpers/deepmerge';
import { capitalizeFirstLetter, scaleFont, debounce } from './helpers/utils';
import dom from './helpers/dom';
import autoFont from './core/autoFont';
import Media from './core/media/index';
import containerBounds from './helpers/containerBounds';
import pageVisibility from './helpers/pageVisibility';
import externalControls from './core/media/events/externalControls';
import ajax from './helpers/ajax';

const fn_contextmenu = function(e) {
	e.stopPropagation();
	e.preventDefault();
	return false;
}

const defaults = {
	defaultWidth: 960,
	defaultHeight: 540,
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
	constructor(el, settings, _events) {
		super(el);
		this.__settings = deepmerge(defaults, settings);
		dom.class.add(el, "kml" + capitalizeFirstLetter(el.nodeName.toLowerCase()));
		this.wrapper = dom.wrap(this.media, dom.createElement('div', {
			class: 'kmlPlayer'
		}));

		//initSettings
		for(var k in this.__settings){
			if(this[k]){
				this[k](this.__settings[k]);
				if(k==='autoplay' && this.__settings[k]) this.play();
			}
		}

		//initPageVisibility
		this.pageVisibility = new pageVisibility(el);

		//initexternalControls
		this.externalControls = new externalControls(el);

		//autoFONT
		let _width = ()=>{ return this.width() };
		if(typeof this.__settings.font === "boolean" && this.__settings.font) this.__settings.font = defaults.font;
		this.autoFont = new autoFont(this.wrapper, _width, this.__settings.font);
		if(this.__settings.font) this.autoFont.enabled(true);

		//initCallbackEvents
		for (var evt in _events) {
			this.on(evt, _events[evt], this);
		}
	}

	test(x,y){
		dom.triggerWebkitHardwareAcceleration(this.wrapper);
		dom.transform(this.wrapper, 'translate('+x+'px, '+y+'px)');
	}

	contextMenu(v){
		if (typeof v === 'boolean') {
			v ? this.media.removeEventListener('contextmenu', fn_contextmenu) : this.media.addEventListener('contextmenu', fn_contextmenu);
		}
	}

	ajax(options) {
		return ajax(options);
	}

	defaultWidth(v) {
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

	defaultHeight(v) {
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
		return this.defaultWidth() / this.defaultHeight();
	}

	bounds(v) {
		let data = containerBounds(this.media);
		if (data[v] !== undefined) return data[v];
		return data;
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

	addClass(v) {
		dom.class.add(this.wrapper, v);
	}
	removeClass(v) {
		if (v !== 'kmlPlayer') {
			dom.class.remove(this.wrapper, v);
		}
	}
	toggleClass(v) {
		if (v !== 'kmlPlayer') {
			dom.class.toggle(this.wrapper, v);
		}
	}
};

window.onerror = function(message, scriptUrl, line, column) {
    console.log(line, column, message);
    alert(line + ":" +column +"-"+ message);
};

export default kmlPlayer;