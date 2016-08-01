/*@@@@*/
import bigPlay from './ui/bigPlayButton';
/*@@@@*/
import requestAnimationFrame from '../polyfills/requestAnimationFrame';
import dom from '../helpers/dom';
import {isFunction} from '../helpers/utils';
import device from '../helpers/device';
import autoFont from './autoFont';
import Containers from './ui/containers';
import Player from './player';
import containerBounds from '../helpers/containerBounds';

class kmlPlayer extends Player {
	constructor(settings) {
		super(settings);

		this._bounds = {};

		//initContainers
		this.containers = new Containers(this);

		this.widget = function(sttg, el) {
			return this.containers.add(sttg, el, 'widget');
		}

		this.timelineContainer = function(sttg, el) {
			return this.containers.add(sttg, el, 'timeline');
		}

		this.videoContainer = function(sttg) {
			return this.containers.add(sttg, null, 'video');
		}

		this.popupContainer = function(sttg) {
			return this.containers.add(sttg, null, 'popup');
		}

		//autoFONT
		if (typeof this.__settings.font === "boolean" && this.__settings.font) this.__settings.font = defaults.font;
		this.autoFont = new autoFont(this.wrapper, this.__settings.font, this);
		if (this.__settings.font) this.autoFont.enabled(true);

		//initBigPlay
		this.bigPlay = new bigPlay(this);
		
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

	//overwrite duration
	duration() {
		if(this.__settings.duration != null){
			if(this.media.duration != null){
				return this.__settings.duration;
			}
		}
		return this.media.duration;
	}

	//overwrite bounds
	bounds(v) {
		if (this._bounds[v] != null) return this._bounds[v];
		return this._bounds;
	}
	
};

//disable on production
// if (device.isTouch) {
// 	window.onerror = function(message, scriptUrl, line, column) {
// 		console.log(line, column, message);
// 		alert(line + ":" + column + "-" + message);
// 	};
// }

export default kmlPlayer;