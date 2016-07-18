import deepmerge from '../helpers/deepmerge';
import inFrame from '../helpers/inFrame';
import {capitalizeFirstLetter} from '../helpers/utils';
import dom from '../helpers/dom';
import device from '../helpers/device';
import Media from './media/index';
import containerBounds from '../helpers/containerBounds';
import pageVisibility from '../helpers/pageVisibility';
import externalControls from './media/events/externalControls';
import ajax from '../helpers/ajax';

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
	},
	contextMenu: false
};

export default class Player extends Media {
	constructor(settings, _events) {
		let el = settings.video;
		super(el);
		if (el == null) return;
		//initSettings
		this.__settings = {};
		this.settings(deepmerge(defaults, settings))

		//setup Player
		this.device = device;
		this.iframe = inFrame();
		dom.addClass(el, "kml" + capitalizeFirstLetter(el.nodeName.toLowerCase()));
		this.wrapper = dom.wrap(this.media, dom.createElement('div', {
			class: 'kmlPlayer'
		}));
		dom.triggerWebkitHardwareAcceleration(this.wrapper);
		if (this.inIframe) {
			dom.addClass(this.wrapper, "inFrame");
		}

		//initPageVisibility
		this.pageVisibility = new pageVisibility(el);

		//initexternalControls
		this.externalControls = new externalControls(el);

		//initCallbackEvents
		for (var evt in _events) {
			this.on(evt, _events[evt], this);
		}

		this.on('loadedmetadata', () => {
			if (this.media.width != this.media.videoWidth || this.media.height != this.media.videoHeight) {
				this.videoWidth();
				this.videoHeight();
				this.emit('resize');
			}
		});

	}

	settings(settings) {
		if (settings == null) return this.__settings;
		this.__settings = deepmerge(this.__settings, settings);
		//initSettings
		for (var k in this.__settings) {
			if (this[k]) {
				if (k === 'autoplay' && this.__settings[k]) {
					this.play();
					continue;
				}
				this[k](this.__settings[k]);
			}
			if (k === 'controls' && this.__settings[k] === "native") {
				this.nativeControls(true);
			}
		}
		return this.__settings;
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
		let data = containerBounds(this.media);
		if (data[v] != null) return data[v];
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
};