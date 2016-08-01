//break each element inside the timeline as a generic component - buttons, progress, etc with their own life cycle and events
import dom from '../../helpers/dom';
import {
	procentFromString,
	textSelection
} from '../../helpers/utils';
let defaults = {
	x: 0,
	width: '100%',
	height: '8%',
	minHeight: 36,
}
export default function(parentPlayer) {
	return (function() {
		let Timeline = function() {
			let fragment = document.createDocumentFragment();
			let playBtn = dom.createElement('button', {
				'class': 'play'
			});
			let volumeBtn = dom.createElement('button', {
				'class': 'volume'
			});
			let fullScreenBtn = dom.createElement('button', {
				'class': 'fullscreen'
			});
			let pw = dom.createElement('div', {
				'class': 'kmlProgress'
			});
			let pc = dom.createElement('div', {
				'class': 'kmlCuepoints'
			});
			let pl = dom.createElement('div', {
				'class': 'progressline'
			});
			//pl.appendChild(dom.createElement('div', {'class': 'progressBubble'}));
			pw.appendChild(pl);
			fragment.appendChild(playBtn);
			fragment.appendChild(pw);
			fragment.appendChild(pc);
			fragment.appendChild(volumeBtn);
			fragment.appendChild(fullScreenBtn);
			this.cuepointsWrapper = pc;
			let wrapper = null;
			if (parentPlayer.timelineContainer != null) {
				this.wrapper = parentPlayer.timelineContainer(defaults);
				this.wrapper.content(fragment);
				wrapper = this.wrapper.wrapper;
			} else {
				this.wrapper = dom.createElement('div', {
					class: "kmlTimeline",
					style: "position: absolute; left: 0; width: "+defaults.width+"; height: "+defaults.height+"; top: auto; bottom: 0;"
				});
				parentPlayer.wrapper.appendChild(this.wrapper);
				wrapper = this.wrapper;
				this.wrapper.appendChild(fragment);
			}
			let pwFlag = 0;
			let pwVFlag = 0;
			let caclPw = function(el, e) {
				let dim = el.getBoundingClientRect();
				let x = e.clientX - dim.left;
				let t = x / dim.width * 100;
				let d = t * parentPlayer.duration() / 100;
				pl.style.width = t + "%";
				parentPlayer.seek(d);
			}
			pw.addEventListener('mousedown', (e) => {
				pwFlag = 1;
				pwVFlag = parentPlayer.paused();
				textSelection.lock();
				parentPlayer.pause();
				caclPw(pw, e);
			});
			pw.addEventListener('mouseup', (e) => {
				if(pwFlag){
					pwFlag = 0;
					textSelection.unlock();
					if (!pwVFlag) {
						parentPlayer.play();
					}
					caclPw(pw, e);
				}
			});
			pw.addEventListener('mousemove', (e) => {
				if (pwFlag) {
					caclPw(pw, e);
				}else{
					return;
				}
			});
			pw.addEventListener('mouseout', (e) => {
				if (pwFlag) {
					pwFlag = 0;
					textSelection.unlock();
					if (!pwVFlag) {
						parentPlayer.play();
					}
					caclPw(pw, e);
				}
			});
			playBtn.addEventListener('click', () => {
				try {
					playBtn.blur();
				} catch (e) {}
				parentPlayer.togglePlay();
			});
			volumeBtn.addEventListener('click', () => {
				try {
					volumeBtn.blur();
				} catch (e) {}
				parentPlayer.toggleMute();
			});
			fullScreenBtn.addEventListener('click', () => {
				try {
					fullScreenBtn.blur();
				} catch (e) {}
				parentPlayer.toggleFullScreen();
			})
			let forwardCls = "";
			let replayCls = "";
			parentPlayer.on('forward', function(v){
				if(v){
					forwardCls = 'forward_'+v;
					dom.addClass(playBtn, forwardCls);	
				}else{
					setTimeout(()=>{
						dom.removeClass(playBtn, forwardCls);	
					}, 250);
				}
			});
			parentPlayer.on('replay', function(v){
				if(v){
					replayCls = 'replay_'+v;
					dom.addClass(playBtn, replayCls);
				}else{
					setTimeout(()=>{
						dom.removeClass(playBtn, replayCls);
					}, 250);
				}
			});
			parentPlayer.on('timeupdate', function() {
				pl.style.width = this.currentTime() / this.duration() * 100 + "%";
			});
			parentPlayer.on('volumechange', function() {
				let v = this.volume();
				if (this.muted()) {
					dom.addClass(volumeBtn, 'mute');
					return
				} else {
					dom.removeClass(volumeBtn, 'mute');
				}
				dom.removeClass(volumeBtn, 'down up off mute');
				if (v < .5) {
					dom.addClass(volumeBtn, 'down');
				} else {
					dom.addClass(volumeBtn, 'up');
				}
				if (v == 0) {
					dom.addClass(volumeBtn, 'off');
				}
			});
			parentPlayer.on('enterFullScreen', function() {
				dom.addClass(fullScreenBtn, 'exit');
			});
			parentPlayer.on('exitFullScreen', function() {
				dom.removeClass(fullScreenBtn, 'exit');
			});
			parentPlayer.on('play', () => {
				dom.removeClass(playBtn, 'play');
				dom.addClass(playBtn, 'pause');
			});
			parentPlayer.on('pause', () => {
				dom.removeClass(playBtn, 'pause');
				dom.addClass(playBtn, 'play');
			});
			parentPlayer.on('resize', () => {
				this.resize();
			})
			let w = 0;
			let cache_sc = 0;
			this.resize = () => {
				let sc = procentFromString(defaults.height) * parentPlayer.height() / 100;
				if (cache_sc != sc) {
					cache_sc = sc;
					if (sc < defaults.minHeight) {
						w = sc = defaults.minHeight;
						if (this.wrapper.settings) {
							this.wrapper.settings({
								height: defaults.minHeight + "px"
							});
						} else {
							wrapper.style.height = defaults.minHeight + "px";
						}
						playBtn.style.width = w + "px";
						pc.style.left = pw.style.left = w + "px";
						pc.style.right = pw.style.right = 2 * w + "px";

						volumeBtn.style.width = w + "px";
						volumeBtn.style.right = w + "px";

						fullScreenBtn.style.width = w + "px";
						fullScreenBtn.style.right = 0;
					} else {
						if (this.wrapper.settings) {
							this.wrapper.settings({
								height: defaults.height
							});
						} else {
							wrapper.style.height = defaults.height;
						}
						w = sc / parentPlayer.width() * 100;
						playBtn.style.width = w + "%";
						pc.style.left = pw.style.left = w + "%";
						pc.style.right = pw.style.right = 2 * w + "%";

						volumeBtn.style.width = w + "%";
						volumeBtn.style.right = w + "%";

						fullScreenBtn.style.width = w + "%";
						fullScreenBtn.style.right = 0;
					}
				}
			}
			let _closed = false;
			this.closed = (v) => {
				if (typeof v === 'boolean') {
					if (v) {
						dom.addClass(wrapper, 'closed');
					} else {
						dom.removeClass(wrapper, 'closed');
					}
					_closed = v;
				}
				return _closed;
			}

			parentPlayer.on('user-idle', (v) => {
				if(v){
					if (!parentPlayer.paused())
						this.closed(true);
				}else{
					this.closed(false);
				}
			});

			parentPlayer.on('pause', () => {
				if (this.closed()) {
					this.closed(false);
				}
			});

			this.addClass = (cls) => {
				if (cls != 'kmlTimeline')
					dom.addClass(wrapper, cls);
			}
			this.removeClass = (cls) => {
				if (cls != 'kmlTimeline')
					dom.removeClass(wrapper, cls);
			}
			this.toggleClass = (cls) => {
				if (cls != 'kmlTimeline')
					dom.toggleClass(wrapper, cls);
			}
		}
		return new Timeline();
	})();
};