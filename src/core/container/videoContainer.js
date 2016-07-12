import dom from '../../helpers/dom';
import containerExtended from './containerExtended';
import Player from '../player';
import {
	isFunction
} from '../../helpers/utils';
export default class videoContainer extends containerExtended{
	constructor(el, opts, ctx, parentPlayer){
		super(el, opts, ctx, parentPlayer);
		let domVideo = document.createElement('video');
		let videoHolder = document.createElement('div');
		dom.addClass(videoHolder, 'videoHolder');
		videoHolder.appendChild(domVideo);
		this.player = new Player({video:domVideo});
		this.body.appendChild(videoHolder);
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
		this.player.on('ended', ()=>{this.emit('ended');});
		this.on('resize', ()=>{
			let y = 0;
			let x = 0;
			let w = parentPlayer.width();
			let h = parentPlayer.height();
			let r = this.player.scale();
			let fw = w; let fh = h;
			let headerHeight = 10;
			if (w > r*h) {
				fw = r*h;
				fh = h;
				headerHeight =  (h/10)/fh*100;
				fw = 80*(fw/w*100)/100;
				fh = 80;
			} else if (h > w/r) {
				fh = w/r;
				fw = w;
				headerHeight =  (h/10)/fh*100;
				fh = 80*(fh/h*100)/100;
				fw = 80;
			}else{
				fw = 80;
				fh = 80;
			};
			this._title.parentNode.style.height = headerHeight+'%';
			this._title.parentNode.style.top = -headerHeight+'%';
			x = (100 - fw)/2;
			y = (100 + headerHeight/2 - fh)/2;
			this.updateSizePos({
				x: x+"%",
				y: y+"%",
				width : fw+"%",
				height: fh+"%"
			});
		});
		parentPlayer.on('loadedmetadata', ()=>{
			this.emit('resize');
		});
		this.player.on('loadedmetadata', ()=>{
			this.emit('resize');
		});
		this.load(opts.url);
	}
	play(){
		this.player.play();
	}
	pause(){
		this.player.pause();
	}
	load(url){
		this.player.load(url);
	}
}