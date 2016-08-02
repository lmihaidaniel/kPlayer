//break each element inside the timeline as a generic component - buttons, progress, etc with their own life cycle and events
import {createElement, hasClass, addClass, removeClass, toggleClass} from '../../helpers/dom';
import {
	procentFromString,
	textSelection
} from '../../helpers/utils';
import svgSprite from '../svgSprite/index';
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
			let svg = new svgSprite();
			let playBtn = createElement('button');
			let playBtnSVG = svg.create('play', playBtn);
			let volumeBtn = createElement('button');
			let volumeBtnSVG = svg.create('volume-on', volumeBtn);
			let fullScreenBtn = createElement('button');
			let fullScreenBtnSVG = svg.create('fullscreen', fullScreenBtn);
			let pw = createElement('div', {
				'class': 'kmlProgress'
			});
			let pc = createElement('div', {
				'class': 'kmlCuepoints'
			});
			let pl = createElement('div', {
				'class': 'progressline'
			});
			//pl.appendChild(createElement('div', {'class': 'progressBubble'}));
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
				this.wrapper = createElement('div', {
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
				console.log(dim);
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
				parentPlayer.togglePlay();
				try {
					playBtn.blur();
				} catch (e) {}
			});
			volumeBtn.addEventListener('click', () => {
				parentPlayer.toggleMute();
				try {
					volumeBtn.blur();
				} catch (e) {}
			});
			fullScreenBtn.addEventListener('click', () => {
				parentPlayer.toggleFullScreen();
				try {
					fullScreenBtn.blur();
				} catch (e) {}
			})
			let forwardCls = "";
			let replayCls = "";
			parentPlayer.on('forward', function(v){
				if(v){
					forwardCls = 'forward_'+v;
					playBtnSVG.setAttribute('href', '#forward5');
				}else{
					setTimeout(()=>{
						parentPlayer.paused() ? playBtnSVG.setAttribute('href', '#pause') : playBtnSVG.setAttribute('href', '#play');
					}, 250);
				}
			});
			parentPlayer.on('replay', function(v){
				if(v){
					replayCls = 'replay_'+v;
					playBtnSVG.setAttribute('href', '#replay5');
				}else{
					setTimeout(()=>{
						parentPlayer.paused() ? playBtnSVG.setAttribute('href', '#pause') : playBtnSVG.setAttribute('href', '#play');
					}, 250);
				}
			});
			parentPlayer.on('timeupdate', function() {
				pl.style.width = this.currentTime() / this.duration() * 100 + "%";
			});
			parentPlayer.on('volumechange', function() {
				let v = this.volume();
				if (this.muted()) {
					volumeBtnSVG.setAttribute('href', '#volume-mute');
					return
				} else {
					volumeBtnSVG.setAttribute('href', '#volume-on');
				}
				if (v < .5) {
					volumeBtnSVG.setAttribute('href', '#volume-middle');
				} else {
					volumeBtnSVG.setAttribute('href', '#volume-on');
				}
				if (v == 0) {
					volumeBtnSVG.setAttribute('href', '#volume-off');
				}
			});
			parentPlayer.on('enterFullScreen', function() {
				addClass(fullScreenBtn, 'exit');
			});
			parentPlayer.on('exitFullScreen', function() {
				removeClass(fullScreenBtn, 'exit');
			});
			parentPlayer.on('play', () => {
				playBtnSVG.setAttribute('href', '#play');
			});
			parentPlayer.on('pause', () => {
				playBtnSVG.setAttribute('href', '#pause');
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
						addClass(wrapper, 'closed');
					} else {
						removeClass(wrapper, 'closed');
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
			this.hasClass = (cls) => {
				return hasClass(wrapper, cls);
			}
			this.addClass = (cls) => {
				if (cls != 'kmlTimeline')
					addClass(wrapper, cls);
			}
			this.removeClass = (cls) => {
				if (cls != 'kmlTimeline')
					removeClass(wrapper, cls);
			}
			this.toggleClass = (cls) => {
				if (cls != 'kmlTimeline')
					toggleClass(wrapper, cls);
			}
		}
		return new Timeline();
	})();
};