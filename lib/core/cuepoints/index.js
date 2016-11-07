import Events from 'eventemitter3';
import Cuepoint from './cuepoint';
import {
	isString,
	isFunction,
	isArray,
	isObject
} from '../../helpers/utils';
import deepmerge from '../../helpers/deepmerge';
import dom from '../../helpers/dom';
let defaults = {
	wrapper : null,
	on:{
		show: function(){},
		hide: function(){}
	}
};
export default class Cuepoints extends Events {
	constructor(parentPlayer, options) {
		super();
		this.parentPlayer = parentPlayer;
		this.settings = deepmerge(defaults, options);
		this.instances = [];
		this.wrapper = null;
		for(var k in this.settings['on']){
            if(isFunction(this.settings['on'][k])){
                this.on(k, this.settings['on'][k]);
            }
        }
		let el = this.settings["wrapper"];
		if (typeof el === 'string') this.wrapper = document.querySelector(el);
		if (el instanceof HTMLElement) this.wrapper = el;
		if(this.wrapper != null){
			if(parentPlayer.timeline){
				if(parentPlayer.timeline.cuepointsWrapper){
					this.wrapper = parentPlayer.timeline.cuepointsWrapper;
				}
			}
		}
	}
	add(options, wrapper) {
		if(wrapper != null) this.wrapper = wrapper;
		if(isArray(options)){
			let d = [];
			for(var k in options){
				var cp = new Cuepoint(this.parentPlayer, options, this.wrapper);
				this.instances.push(cp);		
				d.push(cp);
			}
			if(d.length>0) this.emit('add');
			return d;
		}else{
			var cp = new Cuepoint(this.parentPlayer, options, this.wrapper);
			this.instances.push(cp);
			this.emit('add');
			return cp;
		}
	}
	show() {
		for (var i = this.instances.length - 1; i >= 0; i--) {
			let cp = this.instances[i];
			if (cp.el) {
				cp.el.style.display = "block";
			}
		}
		this.emit('show');
	}
	hide() {
		for (var i = this.instances.length - 1; i >= 0; i--) {
			let cp = this.instances[i];
			if (cp.el) {
				cp.el.style.display = "none";
			}
		}
		this.emit('hide');
	}
	suspend() {
		for (var i = this.instances.length - 1; i >= 0; i--) {
			let cp = this.instances[i];
			cp.suspend();
		}
		this.emit('suspend');
	}
	activate() {
		for (var i = this.instances.length - 1; i >= 0; i--) {
			let cp = this.instances[i];
			cp.activate();
		}
		this.emit('activate');
	}
	destroy(keep) {
		for (var i = this.instances.length - 1; i >= 0; i--) {
			let cp = this.instances[i];
			if(keep != null) {
				for (var j = keep.length - 1; j >= 0; j--) {
					//to do - check if the comparison has the good logic
					if(keep[j] != cp){
						cp.destroy();
						this.instances[i] = null;
					}
				}
			}else{
				cp.destroy();
				this.instances[i] = null;
			}
		}
		if(keep == undefined) this.instances = [];
	}
	changeWrapper(el) {
		if (typeof el === 'string') this.wrapper = document.querySelector(el);
		if (el instanceof HTMLElement) this.wrapper = el;
		if (this.wrapper != null) {
			this.destroy(true);
			let j = this.instances.length;
			for (var i = 0; i < j; i++) {
				let cp = this.instances[i];
				if (cp.el) {
					cp.parentWrapper = this.wrapper;
					this.wrapper.appendChild(cp.el);
				}
				cp.activate();
			}
			this.emit('changeWrapper');
		}
	}
}