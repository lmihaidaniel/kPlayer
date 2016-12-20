import style from './player.sss';
import bigPlay from './ui/bigPlayButton';
import deepmerge from '../helpers/deepmerge';
import inFrame from '../helpers/inFrame';
import {
	capitalizeFirstLetter
} from '../helpers/utils';
import {
	isFunction
} from '../helpers/utils';
import {wrap,createElement,triggerWebkitHardwareAcceleration, hasClass, addClass, removeClass, toggleClass} from '../helpers/dom';
import device from '../helpers/device';
import Video from './media/video';
import externalControls from './events/externalControls';
import Cuepoint from './cuepoints/cuepoint';
import Cuepoints from './cuepoints/index';
import userActivity from './userActivity';
import Timer from './timer';
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
	fullWindow: false,
	idleTime: 5000
};

export default class Player extends Video {
	constructor(settings) {
		super(settings.player);
		//initSettings
		this.__settings = {};
		this._controls = true;
		//setup Player
		this.device = device;
		this.iframe = inFrame();
		addClass(this.media, "kmlVideo");
		this.wrapper = wrap(this.media, createElement('div', {
			class: 'kmlPlayer'
		}));
		triggerWebkitHardwareAcceleration(this.wrapper);
		if (this.inIframe) {
			addClass(this.wrapper, "inFrame");
		}

		//initPageVisibility
		this.pageVisibility = new pageVisibility(this.media);		

		//initexternalControls
		this.externalControls = new externalControls(this);

		//cuepoints
		this.cuepoints = new Cuepoints(this);

		this.cuepoint = function(options){
			return new Cuepoint(this, options, null);
		}

		//overrite defaults settings
		this.config(deepmerge(defaults, settings));

		//player time spent collector
		this.timer = new Timer();

		//initUserActivity
		this.userActivity = new userActivity(this, {timeout: this.__settings.idleTime});
		
		this.on('loadedmetadata', () => {
			if (this.media.width != this.media.videoWidth || this.media.height != this.media.videoHeight) {
				this.videoWidth();
				this.videoHeight();
				this.emit('resize');
			}
		});

		this.on('play', ()=>{
			this.timer.start();
		});

		this.on('pause', ()=>{
			this.timer.stop();
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

		//initBigPlay
		this.bigPlay = new bigPlay(this);

	}

	addComponent(Component, options = {}){
	    this[Component.name] = new Component(this, options);
	    this.emit('resize');
	    return this[Component.name];
	}

	config(settings) {
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

	videoScale(){
		return this.videoWidth()/this.videoHeight();
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

	played(){
		let _played = this.media.played;
		let ranges = [];
		let n = _played.length;
		let t = 0;
		for(var i=0; i<n; i+=1){
			let start = _played.start(i);
			let end = _played.end(i);
			ranges.push([start, end]);
			t += end-start;
		}
		return {
			ranges: ranges,
			time: t,
			duration: this.media.duration,
			completion: t/this.media.duration*100
		}
	}

	wrapperScale() {
		return this.media.offsetWidth / this.media.offsetHeight;
	}

	hasClass(v, el) {
		if (el != null) {
			return hasClass(v, el);
			return;
		}
		return hasClass(this.wrapper, v);
	}

	addClass(v, el) {
		if (el != null) {
			addClass(v, el);
			return;
		}
		addClass(this.wrapper, v);
	}
	removeClass(v, el) {
		if (el != null) {
			removeClass(v, el);
			return;
		}
		if (v !== 'kmlPlayer') {
			removeClass(this.wrapper, v);
		}
	}
	toggleClass(v, el) {
		if (el != null) {
			toggleClass(v, el);
			return;
		}
		if (v !== 'kmlPlayer') {
			toggleClass(this.wrapper, v);
		}
	}
};