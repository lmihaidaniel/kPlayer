import dom from '../../helpers/dom';
import containerExtended from './containerExtended';
import Player from '../player';
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
			// this.hide();
		});
		this.player.on('ended', ()=>{this.triggerEvent('ended');});
		this.player.on('loadedmetadata', ()=>{
			let y = 0;
			let x = 0;
			let w = parentPlayer.videoWidth();
			let h = parentPlayer.videoHeight();
			let ratio = this.player.scale();
			let fw = w; let fh = h;
			if (w > ratio*h) {
				fw = 8*(ratio*h)/10*w;
			} else {
				fh = 8*(w/ratio)/10*h;
			}
			let headerHeight =  8*80/fh;
			y = Math.round((100 - fh + headerHeight)/2);
			x = Math.round((100 - fw)/2);
			this.updateSizePos({x: x+'%', y: y+'%', width: fw+'%', height: fh+'%'});
			this._title.parentNode.style.height = headerHeight+'%';
			this._title.parentNode.style.top = -headerHeight+'%';
		});
		this.load(opts.url);
	}
	load(url){
		this.player.load(url);
	}
}