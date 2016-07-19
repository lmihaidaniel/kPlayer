import dom from '../helpers/dom';
import {procentFromString} from '../helpers/utils'; 
let defaults = {
	x: 0,
	y: "90%",
	width: "100%",
	height: "10%"
}
export default function(parentPlayer) {
	return (function() {
		let Timeline = function() {
			let fragment = document.createDocumentFragment();
			let playBtn = dom.createElement('button', {'class': 'play'});
			let volumeBtn = dom.createElement('button', {'class': 'volume'});
			let fullScreenBtn = dom.createElement('button', {'class': 'fullscreen'});
			let pw  = dom.createElement('div', {'class': 'kmlProgress'});
			let pl = dom.createElement('div', {'class': 'progressline'});
			pw.appendChild(pl);
			fragment.appendChild(playBtn);
			fragment.appendChild(pw);
			fragment.appendChild(volumeBtn);
			fragment.appendChild(fullScreenBtn);
			let wrapper = null;
			if(parentPlayer.timelineContainer != null){
				this.wrapper = parentPlayer.timelineContainer(defaults);
				this.wrapper.content(fragment);
				wrapper = this.wrapper.wrapper;
			}else{
				this.wrapper = dom.createElement('div', {class:"kmlTimeline",style: "position: absolute; left: 0; width: 100%; height: 10%; top: auto; bottom: 0;"});
				parentPlayer.wrapper.appendChild(this.wrapper);
				wrapper = this.wrapper;
				this.wrapper.appendChild(fragment);
			}

			pw.addEventListener('click', (e)=>{
	            let dim = pw.getBoundingClientRect();
	            let x = e.clientX - dim.left;
	            let t = x / dim.width * 100;
	            let d = t*parentPlayer.duration()/100;
	            parentPlayer.seek(d);
            });
			playBtn.addEventListener('click', ()=>{
				try{
					playBtn.blur();
				}catch(e){}
				parentPlayer.togglePlay();
			});
			volumeBtn.addEventListener('click', ()=>{
				try{
					volumeBtn.blur();
				}catch(e){}
				parentPlayer.toggleMute();
			});
			fullScreenBtn.addEventListener('click', ()=>{
				try{
					fullScreenBtn.blur();
				}catch(e){}
				parentPlayer.toggleFullScreen();
			})
			parentPlayer.on('timeupdate', function(){
				pl.style.width = this.currentTime()/this.duration()*100 + "%";
			});
			parentPlayer.on('volumechange', function(){
				let v = this.volume();
				if(this.muted()){
					dom.addClass(volumeBtn, 'mute');
					return
				}else{
					dom.removeClass(volumeBtn, 'mute');
				}
				dom.removeClass(volumeBtn, 'down up off mute');
				if(v < .5){
					dom.addClass(volumeBtn, 'down');
				}else{
					dom.addClass(volumeBtn, 'up');
				}
				if(v == 0){
					dom.addClass(volumeBtn, 'off');
				}
			});
			parentPlayer.on('enterFullScreen', function(){
				dom.addClass(fullScreenBtn, 'exit');
			});
			parentPlayer.on('exitFullScreen', function(){
				dom.removeClass(fullScreenBtn, 'exit');
			});
			parentPlayer.on('play', ()=>{
				dom.removeClass(playBtn, 'play');
				dom.addClass(playBtn, 'pause');
			});
			parentPlayer.on('pause', ()=>{
				dom.removeClass(playBtn, 'pause');
				dom.addClass(playBtn, 'play');
			});
			let w = 0;
			this.resize = ()=>{
				let sc = procentFromString(defaults.height)*parentPlayer.height()/100;
				w = sc/parentPlayer.width()*100;
				playBtn.style.width = w + "%";
				pw.style.left = sc/parentPlayer.width()*100 + "%";
				pw.style.width = 100 - 3*w + "%";

				volumeBtn.style.width = w + "%";
				volumeBtn.style.left = 100 - 2*w + "%";

				fullScreenBtn.style.width = w + "%";
				fullScreenBtn.style.left = 100 - w + "%";
			}
			let _closed = false;
			this.closed =(v)=>{
				if(typeof v === 'boolean'){
					if(v) {
						dom.addClass(wrapper, 'closed');
					}else{
						dom.removeClass(wrapper, 'closed');
					}
					_closed = v;
				}
				return _closed;
			}

			parentPlayer.on('user-is-idle', ()=>{
				if(!parentPlayer.paused())
				this.closed(true);
			});
			parentPlayer.on('user-not-idle', ()=>{
				this.closed(false);
			});

			parentPlayer.on('pause', ()=>{
				if(this.closed()){
					this.closed(false);
				}
			});

			this.addClass=(cls)=>{
				if(cls != 'kmlTimeline')
				dom.addClass(wrapper, cls);
			}
			this.removeClass=(cls)=>{
				if(cls != 'kmlTimeline')
				dom.removeClass(wrapper, cls);
			}
			this.toggleClass=(cls)=>{
				if(cls != 'kmlTimeline')
				dom.toggleClass(wrapper, cls);
			}
		}
		return new Timeline();
	})();
};