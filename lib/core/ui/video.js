/*@@@@*/
import Timeline from './timeline';
/*@@@@*/
import {replaceElement} from '../../helpers/dom';
import Popup from './popup';
import Player from '../player';
import {
	isFunction
} from '../../helpers/utils';
export default class videoPopup extends Popup{
	constructor(el, opts, parent, parentPlayer){
		super(el, opts, parent, parentPlayer);
		let domVideo = document.createElement('video');
		replaceElement(this._content, domVideo);
		this.player = new Player({el:domVideo}, null);
		this.player.supportsFullScreen = false;
		this.player.addComponent(Timeline, {popup: true});
		this.player.media.addEventListener('click', ()=>{
			if(!this.player.userActivity.idle()){
				this.player.togglePlay();
			}else{
				this.player.userActivity.idle(false);
			}
		});
		let paused = false;
		this.player.externalControls.enabled(false);
		this.on('beforeHide', ()=>{
			paused = this.player.paused();
			this.player.pause();
			this.player.externalControls.enabled(false);
		});
		this.on('show', ()=>{
			if(!paused){
				this.player.play();
			}
			this.player.Timeline.resize();
			this.player.externalControls.enabled(true);
		});
		this.on('ended', ()=>{
			if (isFunction(opts.onEnded)) opts.onEnded();
		});
		opts.size = opts.size || 80;
		let defaultSize = opts.size;
		this.setSize = function(s){
			defaultSize = opts.size = s;
			this.emit('resize');
		}
		this.player.requestFullWindow = ()=>{
			opts.size = 100;
			this.overlay.backgroundColor("#000000",0.9);
			this.addClass('full');
			this.emit('resize');
			this.player.emit('enterFullScreen');
			this.player.isFullWindow = function() {
	            return true;
	        };
		}
		this.player.cancelFullWindow = ()=>{
			this.overlay.backgroundColor("#000000",0.6);
			opts.size = defaultSize;
			this.removeClass('full');
			this.emit('resize');
			this.player.emit('exitFullScreen');
			this.player.isFullWindow = function() {
	            return false;
	        };
		}
		this.player.on('ended', ()=>{this.emit('ended');});
		this.on('resize', ()=>{
			let y = 0;
			let x = 0;
			let w = parentPlayer.width();
			let h = parentPlayer.height();
			let r = this.player.scale();
			let fw = w; let fh = h;
			let ww = w; let hh = h;
			let headerHeight = 10;
			if (w > r*h) {
				fw = r*h;
				fh = h;
				ww = fw;
				headerHeight = (h/10)/fh*100;
				fw = opts.size*(fw/w*100)/100;
				fh = opts.size;
			} else if (h > w/r) {
				fh = w/r;
				fw = w;
				hh = fh;
				headerHeight = (h/10)/fh*100;
				fh = opts.size*(fh/h*100)/100;
				fw = opts.size;
			}else{
				fw = opts.size;
				fh = opts.size;
			};
			x = (100 - fw)/2;
			y = (100 - fh)/2;
			this._title.parentNode.style.height = headerHeight+'%';
			// let d = this.settings({
			// 	// x: x/w*ww+'%',
			// 	// y: y/h*hh+'%',
			// 	x: (100-fw)/2+'%',
			// 	y: (100-fh)/2+'%',
			// 	width : fw+"%",
			// 	height: fh+"%"
			// });
			let d = {
				// x: x/w*ww+'%',
				// y: y/h*hh+'%',
				x: (100-fw)/2,
				y: (100-fh)/2,
				width : fw,
				height: fh
			};
			if(headerHeight <= d.y){
				this._title.parentNode.style.transform = 'translateY(-100%)';
				this.body.style.top =  d.y + headerHeight/2 + '%';
			}else{
				this._title.parentNode.style.transform = 'translateY(0)';
				this.body.style.top =  d.y + '%';
			}
			this.body.style.width = d.width + "%";
			this.body.style.height = d.height + "%";
			this.body.style.left = d.x + '%';
			this.autoLineHeight();
		});

		parentPlayer.on('loadedmetadata', ()=>{
			this.emit('resize');
		});
		this.player.on('loadedmetadata', ()=>{
			this.emit('resize');
		});
		this.player.load(opts.url);
	}
	content(){
		return this.player;
	}
}