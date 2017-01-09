import style from './index.sss';
import requestAnimationFrame from './polyfills/requestAnimationFrame';
import {isFunction} from './helpers/utils';
import device from './helpers/device';
import autoFont from './core/autoFont';
import Containers from './core/ui/containers';
import Player from './core/player';


class kmlPlayer extends Player {
	constructor(settings, app) {
		if(isFunction(settings)){ 
			app = settings;
			settings = {};
		};
		super(settings);

		//initContainers
		this.containers = new Containers(this);

		this.widget = function(sttg, el) {
			return this.containers.add(sttg, el, 'widget');
		}

		this.timelineContainer = function(sttg, el) {
			return this.containers.add(sttg, el, 'timeline');
		}

		this.videoContainer = function(sttg = {}) {
			return this.containers.add(sttg, null, 'video');
		}

		this.popupContainer = function(sttg) {
			return this.containers.add(sttg, null, 'popup');
		}

		//autoFONT
		if (typeof this.__settings.font === "boolean" && this.__settings.font) this.__settings.font = defaults.font;
		this.autoFont = new autoFont(this.wrapper, this.__settings.font, this);
		if (this.__settings.font) this.autoFont.enabled(true);
		
		let videoSizeCache = {
			w: this.width(),
			x: this.offsetX(),
			y: this.offsetY(),
			h: this.height()
		}
		let checkVideoResize = () => {
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

		this.once('loadedmetadata', ()=>{
			this.emit('ready');
			if(isFunction(app)){
				app.bind(this)();
			}
			this.emit('resize');
		});

		if(settings.video != null){
			this.load(settings.video);
		}
	}
	

	constrainTime(t){
		if(!this._constrainTimeInitiated){
			this._constrainTimeInitiated = true;

			this._constrainTime = t || 0;
			this._constrainTime_flag = false;
			
			this.on('timeupdate', (t)=>{
				if(this._constrainTime_flag){
					this.externalControls.__seek = false;
					if(t > this._constrainTime){
						this._constrainTime = t;
					}
				}else{
					this.externalControls.__seek = true;
				}
			});
		}
		if(t >= 0){
			this._constrainTime = t;
			this._constrainTime_flag = true;
		}else{
			this._constrainTime_flag = false;
		}
	}

	//overwrite duration
	duration() {
		if(this.__settings.duration != null){
			// if(this.media.duration != null){
			//	return this.__settings.duration;
			// }
			if(this.media.duration > this.__settings.duration){
				return this.__settings.duration;
			}
		}
		return this.media.duration || 0;
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