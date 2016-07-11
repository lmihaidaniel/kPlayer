import dom from '../../helpers/dom';
import bounds from '../../helpers/containerBounds';
import containerExtended from './containerExtended';
import Player from '../index';
export default class videoContainer extends containerExtended{
	constructor(el, opts, ctx, player){
		super(el, opts, ctx, player);
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
			let headerHeight = 0;
			let h = 0;
			let y = 0;
			let x = 0;
			let w = 0;
			let sc = this.player.scale();
			sc = 1;
			if(sc >= 1){
				h = 80*(player.videoWidth()/sc)/player.videoHeight();
			}else{
				h = 80*(player.videoWidth()*sc)/player.videoHeight();
			}
			headerHeight =  8*80/h;
			y = Math.round((100 - h + headerHeight/2)/2);
			this.updateSizePos({x: '10%', y: y+'%', width: '80%', height: h+'%'});
			// }else{
			// 	w = 80*(player.videoHeight()*sc)/player.videoWidth();
			// 	x = Math.round((100 - w)/2);
			// 	headerHeight =  8*w/80;
			// 	y = Math.round((10 + headerHeight/4));
			// 	this.updateSizePos({x: x+'%', y: y+'%', width: w+'%', height: '80%'});
			// }
			this._title.parentNode.style.height = headerHeight+'%';
			this._title.parentNode.style.top = -headerHeight+'%';
		});
		this.load(opts.url);
	}
	load(url){
		this.player.load(url);
	}
}