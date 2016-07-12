import dom from '../../helpers/dom';
import Popup from './popup';
import Player from '../player';
import {
	isFunction
} from '../../helpers/utils';
export default class videoContainer extends Popup{
	constructor(el, opts, ctx, parentPlayer){
		super(el, opts, ctx, parentPlayer);
		let domVideo = document.createElement('video');
		this.body.appendChild(domVideo);
		this.player = new Player({video:domVideo});
		this.player.container
		let paused = false;
		this.on('hide', ()=>{
			paused = this.player.paused();
			this.player.pause();
		});
		this.on('show', ()=>{
			if(!paused){
				this.player.play();
			}
		});
		this.on('ended', ()=>{
			if (isFunction(opts.onEnded)) opts.onEnded();
		});
		opts.sizeRatio = opts.sizeRatio || 80;
		this.sizeRatio = function(s){
			opts.sizeRatio = s;
			this.emit('resize');
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
				fw = opts.sizeRatio*(fw/w*100)/100;
				fh = opts.sizeRatio;
			} else if (h > w/r) {
				fh = w/r;
				fw = w;
				hh = fh;
				headerHeight = (h/10)/fh*100;
				fh = opts.sizeRatio*(fh/h*100)/100;
				fw = opts.sizeRatio;
			}else{
				fw = opts.sizeRatio;
				fh = opts.sizeRatio;
			};
			x = (100 - fw)/2;
			y = (100 - fh)/2;
			//this._title.parentNode.style.transform = 'translateY(-100%)';	
			this._title.parentNode.style.height = headerHeight+'%';
			this.updateSizePos({
				x: x/w*ww+'%',
				y: 5+y/h*hh+'%',
				width : fw+"%",
				height: fh+"%"
			});
			this.autoLineHeight();
		});


		parentPlayer.on('loadedmetadata', ()=>{
			this.emit('resize');
		});
		this.player.on('loadedmetadata', ()=>{
			this.emit('resize');
		});
		this.load(opts.url);
	}
	load(url){
		this.player.load(url);
	}
}