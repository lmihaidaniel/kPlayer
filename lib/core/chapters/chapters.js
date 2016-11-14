import style from './chapters.sss';
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
let noOp = function(){};
export default class Chapters {
	constructor(player, _chapters, equalVisuals = true, _d, timeline) {
		if (_itemsWrapper == null) {
			_itemsWrapper = document.createElement('div');
			player.cuepoints.wrapper.appendChild(_itemsWrapper);
		}
		this.els = [];
		this.active = 0;
		this.player = player;
		timeline.wrapper.addClass('chapters');
		this.set(_chapters, equalVisuals, _d);
	}

	set(_chapters, equalVisuals = true, _d) {
		let player = this.player;
		this.destroy();
		let duration = _d || player.duration();
		_chapters = _chapters || [{
			start: 0
		}];
		let progressDivs = [];
		let _no = _chapters.length;

		let currentTime = (t, flag)=>{
			player.currentTime(t);
		}

		for (var k in _chapters) {
			_chapters[k].on = deepmerge({
				start: noOp,
				end: noOp,
				click: noOp,
				process: noOp,
				touchstart: false,
				touchend: false,
				touchmove: false,
				touchleave: false
			}, _chapters[k].on || {});
			_chapters[k].end = _chapters[k].end || duration;
			if(!isFunction(_chapters[k].on['process'])) _chapters[k].on['process'] = noOp;
			if(!isFunction(_chapters[k].on['start'])) _chapters[k].on['start'] = noOp;
			if(!isFunction(_chapters[k].on['click'])) _chapters[k].on['click'] = noOp;
			if(!isFunction(_chapters[k].on['end'])) _chapters[k].on['end'] = noOp;
			let visual = {
				start: _chapters[k].start,
				end: _chapters[k].end,
				on: {
					click: _chapters[k].on['click']
				},
				label: _chapters[k].label,
				items: _chapters[k].items,
				width: true,
				className: 'kmlCuepoint '+(_chapters[k].className || ""),
			    classActive: _chapters[k].classActive,
			    classInactive: _chapters[k].classInactive
			};
			let meta = {
				start: _chapters[k].start,
				end: _chapters[k].end,
				label: _chapters[k].label,
				on: {},
				content: null
			};
			var progress = document.createElement('div');
			visual.content = document.createElement('div');
			progress.className = 'progress';
			visual.content.appendChild(progress);
			k = parseInt(k);
			let offsetStart = 0;
			if (k > 0) offsetStart = _chapters[k - 1].end;
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
						if(vd.className) addClass(icon, vd.className);
						icon.style.left = (vd.start - meta.start) / (meta.end - meta.start) * 100 + "%";
						for(var k in vd.on){
							icon.addEventListener(k, function(){
								vd.on[k].bind(this)(vd);
							});
						}
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
			let _on = {
				touchstart: (function(i,cp_d) {
					return function(e) {
						this.el.flagPlay = !player.paused();
						let t = caclPw(this.el, e, cp_d, offsetStart);
						if (t > -1) {
							if (this.active && self.active == i) {
								currentTime(t);
							} else {
								currentTime(offsetStart);
							}
						}
					}
				})(k, _chapters[k].end - _chapters[k].start),
				touchmove: (function(i,cp_d) {
					return function(e) {
						player.pause();
						let t = caclPw(this.el, e, cp_d, offsetStart);
						if (t > -1) {
							if (this.active && self.active == i) {
								currentTime(t);
							}
						}
					}
				})(k,_chapters[k].end - _chapters[k].start),
				touchleave: (function(i,cp_d) {
					return function(e) {
						if (this.el.flagPlay) player.play();
						let t = caclPw(this.el, e, cp_d, offsetStart);
						if (t > -1) {
							if (this.active && self.active == i) {
								currentTime(t);
							}
						}
					}
				})(k,_chapters[k].end - _chapters[k].start),
				touchend: (function(i,cp_d) {
					return function(e) {
						if (this.el.flagPlay) player.play();
						let t = caclPw(this.el, e, cp_d, offsetStart);
						if (t > -1) {
							if (this.active && self.active == i) {
								currentTime(t);
							}
						}
					}
				})(k,_chapters[k].end - _chapters[k].start)
			}

			visual.on = deepmerge(visual.on, _on);

			var visualCP = player.cuepoints.add(visual);
			visualCP.id = k;
			visualCP.active = false;
			if(k==0) {
				this.active = 0;
				visualCP.active = true;
			}
			this.els.push(visualCP);
			_instances.push(visualCP);

			meta.on = {
				start: (function(current, onStart) {
					return function() {
						visualCP.active = true;
						setTimeout(function(){
							if(self.active != current) self.active = current;
						}, 250);
						for (var i = 0, n = progressDivs.length; i < n; i += 1) {
							if (i < current) {
								progressDivs[i].style.width = 100 + "%";
							}
							if (i > current) progressDivs[i].style.width = 0;
						}
						onStart.bind(this)();

					}
				})(k, _chapters[k].on['start']),
				process: (function(pEl, start, end, onProcess) {
					return function(t) {
						var w = (t - start) / (end - start) * 100;
						pEl.style.width = w + "%";
						onProcess.bind(this)(t);
					}
				})(progressDivs[k], meta.start, meta.end, _chapters[k].on['process']),
				end: (function(onEnd) {
					return function() {
						visualCP.active = false;
						onEnd.bind(this)();
					}
				})(_chapters[k].on['end'])
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