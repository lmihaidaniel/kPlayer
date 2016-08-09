import deepmerge from '../../helpers/deepmerge';
import {isFunction} from '../../helpers/utils';
let _instances = [];
export default class Chapters {
	constructor(player, settings, equalVisuals = true, _d) {
		this.els = [];
		this.destroy();
		let duration = _d || player.duration();
		settings = settings || [{
			start: 0
		}];
		let progressDivs = [];
		let _no = settings.length;
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
			if (k > 0) offsetStart = settings[k-1].end;
			if (equalVisuals) {
				visual.start = k * duration / _no;
				visual.end = (k + 1) * duration / _no;
			}
			visual.width = true;

			if (visual.label != null) {
				var label = document.createElement('span');
				label.innerHTML = visual.label;
				visual.content.appendChild(label);
				visual.label = null;
			}

			progressDivs.push(progress);

			let caclPw = function(el, e, d, o) {
				let dim = el.getBoundingClientRect();
				let x = e.pageX - dim.left;
				let t = x / dim.width * 100;
				player.currentTime(t * d / 100 + o);
			}
			let _on = {
				touchstart: (function(cp_d){
					return function(e) {
						this.el.flagPlay = !player.paused();
						player.pause();
						caclPw(this.el,e,cp_d,offsetStart);
					}
				})(settings[k].end - settings[k].start),
				touchmove: (function(cp_d){
					return function(e) {
						// alert(e);
						caclPw(this.el,e,cp_d,offsetStart);
					}
				})(settings[k].end - settings[k].start),
				touchleave: (function(cp_d){
					return function(e) {
						if(this.el.flagPlay) player.play();
						caclPw(this.el,e,cp_d,offsetStart);
					}
				})(settings[k].end - settings[k].start),
				touchend: (function(cp_d){
					return function(e) {
						if(this.el.flagPlay) player.play();
						caclPw(this.el,e,cp_d,offsetStart);
					}
				})(settings[k].end - settings[k].start)
			}

			visual.on = deepmerge(visual.on, _on);

			var visualCP = player.cuepoints.add(visual);
			visualCP.id = k;
			this.els.push(visualCP);
			_instances.push(visualCP);

			meta.on = {
				start: (function(t, current, onStart) {
					return function() {
						for (var i = 0, n = progressDivs.length; i<n; i+=1) {
							if (i < current) progressDivs[i].style.width = 100 + "%";
							if (i > current) progressDivs[i].style.width = 0;
						}
						if(isFunction(onStart)){
							onStart.bind(this)();
						}
					}
				})(meta.title, k, settings[k].on['start']),
				process: (function(i, start, end) {
					var pEl = progressDivs[i];
					return function(t) {
						if (t >= start && end >= t) {
							var w = (t - start) / (end - start) * 100;
							if (w >= 99) w = 100;
							pEl.style.width = w + "%";
						}
					}
				})(k, meta.start, meta.end),
				end: settings[k].on['end']
			}

			var metaCP = player.cuepoints.add(meta);
			_instances.push(metaCP);
		}
	}
	destroy() {
		this.els = [];
		for (var i = 0, n = _instances.length; i < n; i += 1) {
			let instance = _instances[i];
			if (instance.destroy) instance.destroy(true);
		}
	}
}