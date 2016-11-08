//break each element inside the timeline as a generic component - buttons, progress, etc with their own life cycle and events
import __style__ from './timeline.sss';
import deepmerge from '../../helpers/deepmerge'
import {
	createElement,
	hasClass,
	addClass,
	removeClass,
	toggleClass
} from '../../helpers/dom';
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
	height: '7%',
	minHeight: 36,
	idleTime: true,
	chapters: null
}

export default class Timeline {
	constructor(player, options) {
		let settings = deepmerge(defaults, options);
		let fragment = document.createDocumentFragment();
		let svg = new svgSprite();
		let playBtn = createElement('button');
		let playBtnSVG = svg.create('play', playBtn);
		let duration_el = createElement('div', {
			class: 'duration'
		});
		let duration_ = createElement('span');
		duration_el.appendChild(duration_);
		let pc = createElement('div', {
			'class': 'kmlCuepoints'
		});
		fragment.appendChild(playBtn);
		fragment.appendChild(pc);
		fragment.appendChild(duration_el);
		this.cuepointsWrapper = pc;
		this._height = settings.height;
		player.cuepoints.changeWrapper(pc);
		let wrapper = null;
		if (player.timelineContainer != null) {
			this.wrapper = player.timelineContainer(settings);
			this.wrapper.addClass('one');
			this.wrapper.content(fragment);
			wrapper = this.wrapper.wrapper;
		} else {
			this.wrapper = createElement('div', {
				class: "kmlTimeline one",
				style: "position: absolute; left: 0; width: " + settings.width + "; height: " + settings.height + "; top: auto; bottom: 0;"
			});
			player.wrapper.appendChild(this.wrapper);
			wrapper = this.wrapper;
			this.wrapper.appendChild(fragment);
		}
		playBtn.addEventListener('click', () => {
			player.togglePlay();
			try {
				playBtn.blur();
			} catch (e) {}
		});
		let forwardCls = "";
		let replayCls = "";
		player.on('forward', function(v) {
			if (v) {
				forwardCls = 'forward_' + v;
				playBtnSVG.setAttribute('href', '#forward5');
			} else {
				setTimeout(() => {
					player.paused() ? playBtnSVG.setAttribute('href', '#play') : playBtnSVG.setAttribute('href', '#pause');
				}, 250);
			}
		});
		player.on('replay', function(v) {
			if (v) {
				replayCls = 'replay_' + v;
				playBtnSVG.setAttribute('href', '#replay5');
			} else {
				setTimeout(() => {
					player.paused() ? playBtnSVG.setAttribute('href', '#play') : playBtnSVG.setAttribute('href', '#pause');
				}, 250);
			}
		});
		let remaining = true;
		duration_el.addEventListener('mouseenter', () => {
			remaining = false;
			duration_.innerHTML = formatTime(player.currentTime());
		});
		duration_el.addEventListener('mouseleave', () => {
			remaining = true;
			let t = player.currentTime();
			let d = player.duration();
			duration_.innerHTML = formatTime(d - t);

		});
		player.on('timeupdate', function() {
			let t = this.currentTime();
			let d = this.duration();
			if (remaining) {
				duration_.innerHTML = formatTime(d - t);
			} else {
				duration_.innerHTML = formatTime(t);
			}
		});
		player.on('play', () => {
			playBtnSVG.setAttribute('href', '#pause');
		});
		player.on('pause', () => {
			playBtnSVG.setAttribute('href', '#play');
		});
		player.on('resize', () => {
			this.resize();
		})
		let w = 0;
		let cache_sc = 0;
		let chace_units = "px";
		let timelineHeight = 0;
		this.resize = () => {
			let sc = procentFromString(settings.height) * player.height() / 100;
			if (cache_sc != sc && this.wrapper.visible()) {
				cache_sc = sc;
				chace_units = "px";
				if (sc < settings.minHeight) {
					w = sc = settings.minHeight;
					if (this.wrapper.settings) {
						this.wrapper.settings({
							height: settings.minHeight + "px"
						});
					} else {
						this._height = wrapper.style.height = settings.minHeight + "px";
					}
					timelineHeight = settings.minHeight + "px";
					player.emit('timelineHeight', settings.minHeight + "px");
					playBtn.style.width = w + "px";
					duration_el.style.width = pc.style.right = pc.style.left = w + "px";
				} else {
					if (this.wrapper.settings) {
						this.wrapper.settings({
							height: settings.height
						});
						this._height = settings.height;
					} else {
						this._height = wrapper.style.height = settings.height;
					}
					timelineHeight = settings.height;
					player.emit('timelineHeight', settings.height);
					w = sc / player.width() * 100;
					playBtn.style.width = w + "%";
					chace_units = "%";
					duration_el.style.width = pc.style.right = pc.style.left = w + "%";
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
			player.emit('timelineClosed', this, _closed);
			return _closed;
		}

		player.on('user-idle', (v) => {
			if(settings.idleTime){
				if (v) {
					if (!player.paused())
						this.closed(true);
				} else {
					this.closed(false);
				}
			}
		});

		player.on('pause', () => {
			if (this.closed()) {
				this.closed(false);
			}
		});

		player.on('timelineCheckSize', () => {
			this.resize();
			player.emit('timelineHeight', timelineHeight);
			this.closed();
		});

		this.wrapper.on('show', () => {
			this.resize();
		});

		this.show = () => {
			player.emit('timelineShow', this._height);
			this.closed(false);
			this.wrapper.show();
		}
		this.hide = () => {
			player.emit('timelineHide');
			this.wrapper.hide();
		}

		let chapters = new Chapters(player, null, true, null, this);
		this.chapters = (data, equalChapters, duration) => {
			chapters.set(data, equalChapters, duration);
		}
		if(settings.chapters != null){
			chapters.set(settings.chapters);
		}
	}
}