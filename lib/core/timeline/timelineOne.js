//break each element inside the timeline as a generic component - buttons, progress, etc with their own life cycle and events
import __style__ from './timelineOne.sss';
import deepmerge from '../../helpers/deepmerge'
import {createElement, hasClass, addClass, removeClass, toggleClass} from '../../helpers/dom';
import {
	procentFromString,
	textSelection,
	formatTime
} from '../../helpers/utils';
import svgSprite from '../../core/svgSprite/index';
import Chapters from '../../core/chapters/chapters';
let defaults = {
	x: 0,
	width: '100%',
	height: '8%',
	minHeight: 36,
	popup: false
}
export default function(parentPlayer, options) {
	return (function() {
		let Timeline = function() {
			let settings = deepmerge(defaults, options);
			let fragment = document.createDocumentFragment();
			let svg = new svgSprite();
			let playBtn = createElement('button');
			let playBtnSVG = svg.create('play', playBtn);
			let duration_el = createElement('div', {class:'duration'});
			let duration_ = createElement('span');
			duration_el.appendChild(duration_);
			let pc = createElement('div', {
				'class': 'kmlCuepoints'
			});
			fragment.appendChild(playBtn);
			fragment.appendChild(pc);
			fragment.appendChild(duration_el);
			this.cuepointsWrapper = pc;
			let wrapper = null;
			if (parentPlayer.timelineContainer != null) {
				this.wrapper = parentPlayer.timelineContainer(settings);
				this.wrapper.addClass('one');
				this.wrapper.content(fragment);
				wrapper = this.wrapper.wrapper;
			} else {
				this.wrapper = createElement('div', {
					class: "kmlTimeline one",
					style: "position: absolute; left: 0; width: "+settings.width+"; height: "+settings.height+"; top: auto; bottom: 0;"
				});
				parentPlayer.wrapper.appendChild(this.wrapper);
				wrapper = this.wrapper;
				this.wrapper.appendChild(fragment);
			}
			playBtn.addEventListener('click', () => {
				parentPlayer.togglePlay();
				try {
					playBtn.blur();
				} catch (e) {}
			});
			let forwardCls = "";
			let replayCls = "";
			parentPlayer.on('forward', function(v){
				if(v){
					forwardCls = 'forward_'+v;
					playBtnSVG.setAttribute('href', '#forward5');
				}else{
					setTimeout(()=>{
						parentPlayer.paused() ? playBtnSVG.setAttribute('href', '#play') : playBtnSVG.setAttribute('href', '#pause');
					}, 250);
				}
			});
			parentPlayer.on('replay', function(v){
				if(v){
					replayCls = 'replay_'+v;
					playBtnSVG.setAttribute('href', '#replay5');
				}else{
					setTimeout(()=>{
						parentPlayer.paused() ? playBtnSVG.setAttribute('href', '#play') : playBtnSVG.setAttribute('href', '#pause');
					}, 250);
				}
			});
			let remaining = true;
			duration_el.addEventListener('mouseenter', ()=>{
				remaining = false;
				duration_.innerHTML = formatTime(parentPlayer.currentTime());
			});
			duration_el.addEventListener('mouseleave', ()=>{
				remaining = true;
				let t = parentPlayer.currentTime();
				let d = parentPlayer.duration();
				duration_.innerHTML = formatTime(d-t);
				
			});
			parentPlayer.on('timeupdate', function() {
				let t = this.currentTime();
				let d = this.duration();
				if(remaining) {
					duration_.innerHTML = formatTime(d-t);
				}else{
					duration_.innerHTML = formatTime(t);
				}
			});
			parentPlayer.on('play', () => {
				playBtnSVG.setAttribute('href', '#pause');
			});
			parentPlayer.on('pause', () => {
				playBtnSVG.setAttribute('href', '#play');
			});
			parentPlayer.on('resize', () => {
				this.resize();
			})
			let w = 0;
			let cache_sc = 0;
			this.resize = () => {
				let sc = procentFromString(settings.height) * parentPlayer.height() / 100;
				if (cache_sc != sc && this.wrapper.visible()) {
					cache_sc = sc;
					if (sc < settings.minHeight) {
						w = sc = settings.minHeight;
						if (this.wrapper.settings) {
							this.wrapper.settings({
								height: settings.minHeight + "px"
							});
						} else {
							wrapper.style.height = settings.minHeight + "px";
						}
						this.wrapper.emit('height', settings.minHeight + "px");
						playBtn.style.width = w + "px";
						duration_el.style.width = pc.style.right = pc.style.left  = w + "px";
						parentPlayer
					} else {
						if (this.wrapper.settings) {
							this.wrapper.settings({
								height: settings.height
							});
						} else {
							wrapper.style.height = settings.height;
						}
						this.wrapper.emit('height', settings.height);
						w = sc / parentPlayer.width() * 100;
						playBtn.style.width = w + "%";
						duration_el.style.width = pc.style.right =  pc.style.left = w + "%";
					}
				}
			}
			let _closed = false;
			this.closed = (v) => {
				if (typeof v === 'boolean') {
					if (v) {
						addClass(wrapper, 'closed');
						this.wrapper.emit('closed', true);
					} else {
						removeClass(wrapper, 'closed');
						this.wrapper.emit('closed', false);
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

			this.wrapper.on('show', ()=>{
				this.resize();
			});

			this.show = ()=>{
				this.closed(false);
				this.wrapper.show();
			}
			this.hide = ()=>{
				this.wrapper.hide();
			}

			this.setChapters = (chapters, equalChapters, duration)=>{
				this.chapters = new Chapters(parentPlayer, chapters, equalChapters, duration, this);
			}
		}
		return new Timeline();
	})();
};