import requestAnimationFrame from './polyfills/requestAnimationFrame';
import dom from './helpers/dom';
import {isFunction} from './helpers/utils';
import device from './helpers/device';
import autoFont from './core/autoFont';
import Containers from './core/container/containers';
import Player from './core/player';
import containerBounds from './helpers/containerBounds';

class kmlPlayer extends Player {
	constructor(settings, _events, app) {
		super(settings, _events);

		this._bounds = {};

		//initContainers
		this.containers = new Containers(this);

		this.container = function(stg, el) {
			return this.containers.add(stg, el, 'container');
		}

		this.videoContainer = function(stg) {
			return this.containers.add(stg, null, 'video');
		}

		this.popupContainer = function(stg) {
			return this.containers.add(stg, null, 'popup');
		}

		//autoFONT
		if (typeof this.__settings.font === "boolean" && this.__settings.font) this.__settings.font = defaults.font;
		this.autoFont = new autoFont(this.wrapper, this.__settings.font, this);
		if (this.__settings.font) this.autoFont.enabled(true);

		if (typeof app === 'function') {
			app.bind(this);
		}

		this.on('loadedmetadata', () => {
			if (!this._app) {
				app.bind(this)();
				this._app = true;
			}
		});

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

	//overwrite bounds
	bounds(v) {
		if (this._bounds[v] != null) return this._bounds[v];
		return this._bounds;
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