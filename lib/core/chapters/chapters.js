import __style__ from './chapters.sss';
import deepmerge from '../../helpers/deepmerge';
import {
	isFunction
} from '../../helpers/utils';
import {
	isEl,
	emptyElement
} from '../../helpers/dom';
let _instances = [];
let _itemsWrapper = null;
export default class Chapters {
	constructor(player, settings, equalVisuals = true, _d, timeline) {
		if (_itemsWrapper == null) {
			_itemsWrapper = document.createElement('div');
			player.cuepoints.wrapper.appendChild(_itemsWrapper);
		}
		this.els = [];
		this.active = 0;
		this.player = player;
		timeline.wrapper.addClass('chapters');
		this.set(settings, equalVisuals, _d);
	}

	set(settings, equalVisuals = true, _d) {
		let player = this.player;
		this.destroy();
		let duration = _d || player.duration();
		settings = settings || [{
			start: 0
		}];
		let progressDivs = [];
		let _no = settings.length;

		let currentTime = (t, flag)=>{
			player.currentTime(t);
		}

		for (var k in settings) {
			settings[k].on = deepmerge({
				start: function() {},
				end: function() {},
				click: function() {},
				process: function() {},
				touchstart: false,
				touchend: false,
				touchmove: false,
				touchleave: false
			}, settings[k].on || {});
			settings[k].end = settings[k].end || duration;
			let visual = {
				start: settings[k].start,
				end: settings[k].end,
				on: {
					click: settings[k].on['click']
				},
				label: settings[k].label,
				items: settings[k].items,
				width: true
			};
			let meta = {
				start: settings[k].start,
				end: settings[k].end,
				label: settings[k].label,
				on: {},
				content: null
			};
			var progress = document.createElement('div');
			visual.content = document.createElement('div');
			progress.className = 'progress';
			visual.content.appendChild(progress);
			k = parseInt(k);
			let offsetStart = 0;
			if (k > 0) offsetStart = settings[k - 1].end;
			if (equalVisuals) {
				visual.start = k * duration / _no;
				visual.end = (k + 1) * duration / _no;
			}
			visual.width = true;

			if (visual.label != null) {
				if (isEl(visual.label)) {
					visual.content.appendChild(visual.label);
				} else {
					var label = document.createElement('span');
					label.innerHTML = visual.label;
					visual.content.appendChild(label);
				}
				visual.label = null;
			}

			if (visual.items != null) {
				let itemWrapper = document.createElement('div');
				itemWrapper.className = "kmlCuepoint-markers";
				itemWrapper.style.left = Math.ceil((visual.start / duration * 100)) + '%';
				itemWrapper.style.right = Math.floor((100 - visual.end / duration * 100)) + '%'
				for (let v in visual.items) {
					let vd = visual.items[v];
					if (vd.on) {
						vd.on.click = vd.on.click || function(v) {
							player.currentTime(v.start);
						};
					} else {
						vd.on = {
							click: function(v) {
								player.currentTime(v.start);
							}
						}
					}
					if (vd.start >= meta.start && vd.start <= meta.end) {
						var icon = document.createElement('div');
						icon.className = "kmlCuepoint-marker-point";
						icon.style.left = (vd.start - meta.start) / (meta.end - meta.start) * 100 + "%";
						icon.addEventListener('click', () => {
							vd.on.click(vd);
						});
						if (vd.icon) {
							icon.style.backgroundImage = 'url(' + vd.icon + ')';
						}
						if (!vd.end || vd.end > meta.end) vd.end = meta.end;
						_instances.push(player.cuepoints.add({
							start: vd.start,
							end: vd.end,
							on: vd.on || {}
						}));
						itemWrapper.appendChild(icon);
					}
				}
				visual.items = null;
				_itemsWrapper.appendChild(itemWrapper);
			}

			progressDivs.push(progress);

			let caclPw = function(el, e, d, o) {
				let dim = el.getBoundingClientRect();
				let x = e.pageX - dim.left;
				let t = x / dim.width * 100;
				let ct = t * d / 100 + o;
				if (player._constrainTime_flag) {
					if (ct <= player._constrainTime) {
						return ct;
					} else {
						return -1;
					}
				}
				return ct;
			}

			let self = this;

			let resetProgress = function(t, el) {
				for (var i = 0, n = progressDivs.length; i < n; i += 1) {
					if(self.active == 0){
						progressDivs[i].style.width = 0;
					}else{
						if (i < self.active) progressDivs[i].style.width = 100 + "%";
						if (i > self.active) progressDivs[i].style.width = 0;
					}
				}
				if (t != null) {
					el.active = true;
					progressDivs[t].style.width = 0;
				}
			}

			let _on = {
				touchstart: (function(i,cp_d) {
					return function(e) {
						console.log('current', this.active, self.active);
						let t = caclPw(this.el, e, cp_d, offsetStart);
						if (t > -1) {
							this.el.flagPlay = !player.paused();
							player.pause();
							if (this.active && self.active == i) {
								currentTime(t);
							} else {
								currentTime(offsetStart);
							}
						}
					}
				})(k, settings[k].end - settings[k].start),
				touchmove: (function(i,cp_d) {
					return function(e) {
						let t = caclPw(this.el, e, cp_d, offsetStart);
						if (t > -1) {
							if (this.active && self.active == i) {
								currentTime(t);
							}
						}
					}
				})(k,settings[k].end - settings[k].start),
				touchleave: (function(i,cp_d) {
					return function(e) {
						if (this.el.flagPlay) player.play();
						let t = caclPw(this.el, e, cp_d, offsetStart);
						if (t > -1) {
							if (this.active && self.active == i) {
								currentTime(t);
							}else{
								resetProgress(i, this);	
							}
						}
					}
				})(k,settings[k].end - settings[k].start),
				touchend: (function(i,cp_d) {
					return function(e) {
						if (this.el.flagPlay) player.play();
						let t = caclPw(this.el, e, cp_d, offsetStart);
						if (t > -1) {
							if (this.active && self.active == i) {
								currentTime(t);
							}else{
								resetProgress(i, this);	
							}
						}
					}
				})(k,settings[k].end - settings[k].start)
			}

			visual.on = deepmerge(visual.on, _on);

			var visualCP = player.cuepoints.add(visual);
			visualCP.id = k;
			visualCP.active = false;
			if(k==0) {
				this.active = 0;
				visualCP.active = true;
			}
			visualCP.locked = false;
			this.els.push(visualCP);
			_instances.push(visualCP);

			let tId = null;
			meta.on = {
				start: (function(t, current, onStart) {
					return function() {
						visualCP.active = true;
						clearTimeout(tId);
						if(self.active != current){
							tId = setTimeout(function(){self.active = current;}, 250);
						}
						for (var i = 0, n = progressDivs.length; i < n; i += 1) {
							if (i < current) {
								progressDivs[i].style.width = 100 + "%";
							}
							if (i > current) progressDivs[i].style.width = 0;
						}
						visualCP.addClass('active');
						if (isFunction(onStart)) {
							onStart.bind(this)();
						}
					}
				})(meta.title, k, settings[k].on['start']),
				process: (function(i, start, end) {
					var pEl = progressDivs[i];
					return function(t) {
						if (t >= start && end >= t) {
							var w = (t - start) / (end - start) * 100;
							pEl.style.width = w + "%";
						}
					}
				})(k, meta.start, meta.end),
				end: (function(onEnd) {
					return function() {
						visualCP.active = false;
						visualCP.removeClass('active');
						if (isFunction(onEnd)) {
							onEnd.bind(this)();
						}
					}
				})(settings[k].on['end'])
			}

			var metaCP = player.cuepoints.add(meta);
			_instances.push(metaCP);
		}
	}

	destroy() {
		emptyElement(_itemsWrapper);
		this.els = [];
		this.active = 0;
		for (var i = 0, n = _instances.length; i < n; i += 1) {
			let instance = _instances[i];
			if (instance.destroy) instance.destroy(true);
		}
	}
}