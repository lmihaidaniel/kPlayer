import style from './chapters.sss';
import deepmerge from '../../helpers/deepmerge';
import {isFunction} from '../../helpers/utils';
import {addClass, isEl} from '../../helpers/dom';
let _instances = [];
export default class Chapters {
	constructor(player, settings, equalVisuals = true, _d) {
		this.els = [];
		this.active = 0;
		this.toBeActive = 0;
		this.destroy();
		player.timeline.wrapper.addClass('chapters');
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
				meta : true,
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
			let offsetStart = settings[k].start;
			if (k > 0) offsetStart = settings[k-1].end;
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


			progressDivs.push(progress);

			let caclPw = function(el, e, d, o) {
				let dim = el.getBoundingClientRect();
				let x = e.pageX - dim.left;
				let t = x / dim.width * 100;
				let ct = t * d / 100 + o;
				if(player._constrainTime_flag){
					if(ct <= player._constrainTime){
						return ct;
					}else{
						return -1;
					}
				}
				return ct;
			}
			let self = this;

			let resetProgress = function(t){
				for (var i = 0, n = progressDivs.length; i<n; i+=1) {
					if (i < self.active) progressDivs[i].style.width = 100 + "%";
					if (i > self.active) progressDivs[i].style.width = 0;
				}
				if(t != null){
					progressDivs[t].style.width = 0;
				}
			}

			let _on = {
				touchstart: (function(i,cp_d){
					return function(e) {
						this.el.flagPlay = !player.paused();
						player.pause();
						let t = caclPw(this.el,e,cp_d,offsetStart);
						if(t > -1){
							self.toBeActive = i;
						}
						if(self.active == i){
							if(t > -1){
								player.currentTime(t);
							}
						}else{
							if(t > -1){
								player.currentTime(offsetStart);
							}
						}
					}
				})(k,settings[k].end - settings[k].start),
				touchmove: (function(i,cp_d){
					return function(e) {
						// alert(e);
						if(self.active == i){
							let t = caclPw(this.el,e,cp_d,offsetStart);
							if(t > -1){
								player.currentTime(t);
							}
						}
					}
				})(k,settings[k].end - settings[k].start),
				touchleave: (function(i,cp_d){
					return function(e) {
						if(this.el.flagPlay) player.play();
						if(self.active == i){
							let t = caclPw(this.el,e,cp_d,offsetStart);
							if(t > -1){
								player.currentTime(t);
							}
						}else{
							self.active = i;
							resetProgress(i);
						}
					}
				})(k,settings[k].end - settings[k].start),
				touchend: (function(i,cp_d){
					return function(e) {
						if(this.el.flagPlay) player.play();
						if(self.active == i){
							let t = caclPw(this.el,e,cp_d,offsetStart);
							if(t > -1){
								player.currentTime(t);
							}
						}else{
							self.active = i;
							resetProgress(i);
						}
					}
				})(k,settings[k].end - settings[k].start)
			}

			visual.on = deepmerge(visual.on, _on);

			var visualCP = player.cuepoints.add(visual);
			visualCP.id = k;
			if(k === 0) visualCP.active = true;
			this.els.push(visualCP);
			_instances.push(visualCP);

			meta.on = {
				start: (function(i, start, end, onStart) {
					return function() {
						let t = player.currentTime();
						if(t <= end && t >= start){
							self.active = i;
							self.toBeActive = i;
						}
						resetProgress();
						if(isFunction(onStart)){
							onStart.bind(this)();
						}
					}
				})(k, meta.start, meta.end, settings[k].on['start']),
				process: (function(i, start, end) {
					var pEl = progressDivs[i];
					return function(t) {
						if (t >= start && end >= t) {
							var w = (t - start) / (end - start) * 100;
							if(self.toBeActive == i){
								pEl.style.width = w + "%";
							}
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