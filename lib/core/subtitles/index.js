import {addClass, removeClass} from '../../helpers/dom';
import subtitleToObject from '../../helpers/subtitleObject';
import ajax from '../../helpers/ajax';
export default class Subtitles {
	constructor(player) {
		this.index = null;
		this.cleared = null;
		this.wrapper = player.containers.wrapper.querySelector('.subtitles');
		let text = document.createElement('div');
		text.className = "subtitle-text";
		this.wrapper.appendChild(text);
		this.text = text;
		this.bucket = [];

		let timeupdate = (t)=>{
			this.display(t);
		};
		this.destroy = ()=>{
			this.index = null;
			this.cleared = null;
			this.text.innerHTML = "";
			this.text.style.display = "none";
			player.off('timeupdate', timeupdate);
		}
		this.init = ()=>{
			this.index = null;
			this.cleared = null;
			player.on('timeupdate', timeupdate);
			this.display(player.currentTime());
		}
		if(player.timeline){
			let h = 0;
			player.timeline.wrapper.on('closed', (v)=>{
				if(player.timeline.wrapper.visible()){
					if(v) {
						this.text.style.bottom = 0;
					}else{
						this.text.style.bottom = h;
					}
				}
			});
			player.timeline.wrapper.on('height', (v)=>{
				this.text.style.bottom = h = v;
			});
			// player.timeline.wrapper.on('show', (v)=>{
			// 	this.text.style.bottom = h = v || player.timeline.wrapper.style.height;
			// });
			player.timeline.wrapper.on('hide', (v)=>{
				this.text.style.bottom = h = 0;
			});
		}
	}
	background(v){
		addClass(this.text, 'bg');
	}
	shadow(v){
		addClass(this.text, 'shadow');
	}
	display(t) {
		for (var i = 0, n = this.bucket.length; i < n; i += 1) {
			let data = this.bucket[i];
			if (t >= data.start && t <= data.end) {
				if (this.index != i) {
					this.index = i;
					this.text.style.display = "inline-block";
					this.text.innerHTML = '<span>' + data.text + '</span>';
					this.cleared = false;
				}
			} else {
				if (this.index == i) {
					if (!this.cleared) {
						this.text.innerHTML = "";
						this.text.style.display = "none";
						this.cleared = true;
						this.index = null;
					}
				}
			}
		}
	}
	setSize(v) {
		this.wrapper.style.fontSize = v + "%";
	}
	load(src) {
		//removeDefaultSubtitles();
		if (src) {
			if (src instanceof Array) {
				this.bucket = src;
				this.init();
			} else {
				ajax().get(src).then((data, xhr) => {
					this.bucket = subtitleToObject(data);
					this.init();
				}).catch((err, xhr) => {
					this.destroy();
					return;
				});
			}
		} else {
			this.destroy();
		}
	}
}