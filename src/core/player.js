/*@@@@*/
import Timeline from './timeline/timeline';
/*@@@@*/
import deepmerge from '../helpers/deepmerge';
import inFrame from '../helpers/inFrame';
import {
	capitalizeFirstLetter
} from '../helpers/utils';
import {
	isFunction
} from '../helpers/utils';
import dom from '../helpers/dom';
import device from '../helpers/device';
import Media from './media/index';
import externalControls from './events/externalControls';
import Cuepoint from './cuepoints/cuepoint';
import Cuepoints from './cuepoints/index';
import userActivity from './userActivity';
import containerBounds from '../helpers/containerBounds';
import pageVisibility from '../helpers/pageVisibility';
import ajax from '../helpers/ajax';

const fn_contextmenu = function(e) {
	e.stopPropagation();
	e.preventDefault();
	return false;
}

const defaults = {
	videoWidth: 960,
	videoHeight: 540,
	autoplay: false,
	loop: false,
	controls: true,
	font: {
		ratio: 1,
		min: .5,
		units: "em"
	},
	externalControls: true,
	contextMenu: false,
	fullWindow: false
};

export default class Player extends Media {
	constructor(settings, app) {
		let el = settings.video;
		super(el);
		if (el == null) return;
		//initSettings
		this.__settings = {};
		this._controls = true;
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
		this.externalControls = new externalControls(this);

		//initUserActivity
		this.userActivity = new userActivity(this);

		//initCallbackEvents
		if (isFunction(app)) {
			app.bind(this)();
		}

		this.settings(deepmerge(defaults, settings));

		this.on('loadedmetadata', () => {
			if (this.media.width != this.media.videoWidth || this.media.height != this.media.videoHeight) {
				this.videoWidth();
				this.videoHeight();
				this.emit('resize');
			}
		});
		if (this.__settings['autoplay'] != null) {
			if (this.__settings['autoplay']) {
				this.play();
			} else {
				this.autoplay(false);
			}
		}

		if (this.__settings['fullWindow'] != null) {
			if (this.__settings['fullWindow']) {
				this.requestFullWindow();
			}
		}


		this.cuepoint = function(options){
			return new Cuepoint(this, options, null);
		}

		this.cuepoints = new Cuepoints(this);

	}

	initTimeline() {
		if (this.__settings['controls'] !== "native") {
			if (this.__settings['controls']) {
				this.timeline = new Timeline(this);
				if(!this.cuepoints.wrapper){
					this.cuepoints.changeWrapper(this.timeline.cuepointsWrapper);
				}
			}
		}
	}

	timeline() {}

	settings(settings) {
		if (settings == null) return this.__settings;
		this.__settings = deepmerge(this.__settings, settings);
		//initSettings
		for (var k in this.__settings) {
			if (this[k] != null) {
				if (isFunction(this[k])) this[k](this.__settings[k]);
			}
			if (k === 'controls' && this.__settings[k] === "native") {
				this.nativeControls(true);
			}
		}
		return this.__settings;
	}

	controls(v) {
		if (typeof v === 'boolean') {
			if (v) {
				if (this.__settings['controls'] === "native") this.nativeControls(true);
				if (this.__settings['externalControls']) this.externalControls.enabled(true);
				this._controls = true;
			} else {
				this.externalControls.enabled(false);
				this.nativeControls(false);
				this._controls = false;
			}
		}
		return this._controls;
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