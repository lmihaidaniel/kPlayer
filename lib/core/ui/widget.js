import Events from 'eventemitter3';
import {removeElement, hasClass, addClass, removeClass, toggleClass} from '../../helpers/dom';
import deepmerge from '../../helpers/deepmerge';
import backgroundColorFN from '../../helpers/backgroundColor';
import relativeSizePos from './relativeSizePos';
import Cuepoint from '../cuepoints/cuepoint';
import {
	isFunction
} from '../../helpers/utils';

let defaults = {
	backgroundColor: '',
	on: {
        hide: function(){},
        show: function(){},
        click: function(){}
    },
    cuepoints: [],
	externalControls: true,
	visible: true,
	pauseVideo: false
}

export default class Widget extends Events {
	constructor(el, opts, parent, parentPlayer) {
		super();
		this.wrapper = el;
		this._visible = false;
		this._controlVisibility = true;
		this.parentPlayerPaused = false;
		this._settings = deepmerge(defaults, opts);
		this._cache = {};
		this.backgroundColor = backgroundColorFN(el);
		this.parent = parent;
		this.parentPlayer = parentPlayer;
		this.init();
	}
	settings(fopts){
		if (fopts) {
			this._settings = deepmerge(this._settings, fopts);
			this.resize();
		}
		return this._settings;
	}
	init() {
		for(var k in this._settings['on']){
            if(isFunction(this._settings['on'][k])){
                this.on(k, this._settings['on'][k]);
            }
        }
        this.backgroundColor(this._settings['backgroundColor'], 1);
        let cuepoints = [];
		this.cuepoint = (options)=>{
			let cbs = options.on;
			options.on = {};
			let cp = new Cuepoint(this.parentPlayer, options);
			let cbfn = (fn)=>{
				return ()=>{
					fn(this);
				}
			}
			for(var k in cbs){
				let fn = cbfn(cbs[k]);
				cp.on(k, fn);
			}
			//check if you keep them by default
			
			cuepoints.push(cp)
			return cp;
		}
		this.cuepoints = ()=>{
			return cuepoints;
		}
        for(var k in this._settings['cuepoints']){
            this.cuepoint(this._settings['cuepoints'][k]);
        }
        this.wrapper.addEventListener('click', ()=>{this.emit('click')});
		this.parentPlayer.on('resize', () => {
			this.resize();
		});
		if (this._settings.visible) {
			this.show();
		} else {
			this.wrapper.style.display = "none";
		}
		this.resize();
	}
	controlVisibility(v){
		if (typeof v === 'boolean') this._controlVisibility = v;
		return this._controlVisibility;
	}
	visible(v) {
		if (typeof v === 'boolean') this._visible = v;
		return this._visible;
	}
	hide(f) {
		if (this.visible() && this._controlVisibility) {
			this.visible(false);
			this.emit('beforeHide');
			addClass(this.wrapper, 'hidden');
			if (this._settings.pauseVideo) {
				if (!this.parentPlayerPaused) {
					this.parentPlayer.play();
				}
			}
			if(f){
				this.wrapper.style.display = "none";
				this.parent.checkVisibleElements();
				this.emit('hide');
			}else{
				setTimeout(() => {
					this.wrapper.style.display = "none";
					this.parent.checkVisibleElements();
					this.emit('hide');
				}, 250);
			}
		}
	}
	show() {
		if (!this.visible() && this._controlVisibility) {
			this.visible(true);
			this.emit('beforeShow');
			this.parent.enabled(true);
			this.wrapper.style.display = "block";
			setTimeout(() => {
				removeClass(this.wrapper, 'hidden');
				this.emit('show');
			}, 50);
			if (this._settings.pauseVideo) {
				if (!this.parentPlayer.paused()) {
					this.parentPlayerPaused = false;
					this.parentPlayer.pause();
				} else {
					this.parentPlayerPaused = true;
				}
			}
		}
	}
	resize() {
		if (
			this._cache.width != this._settings.width ||
			this._cache.height != this._settings.height ||
			this._cache.x != this._settings.x ||
			this._cache.y != this._settings.y
		) {
			let d = new relativeSizePos(this.parentPlayer, this._settings);
			this.wrapper.style.width = d.width + "%";
			this.wrapper.style.height = d.height + "%";
			//transform(this.wrapper, 'translate(' + 100 / d.width * d.x + '%,' + 100 / d.height * d.y + '%)');
			this.wrapper.style.left = d.x + '%';
			this.wrapper.style.top =  d.y + '%';
			this._cache.width = this._settings.width;
			this._cache.height = this._settings.height;
			this._cache.x = this._settings.x;
			this._cache.y = this._settings.y;
		}
		this.emit('resize');
	}
	hasClass(cls) {
		return addClass(this.wrapper, cls);
	}
	addClass(cls) {
		if (cls != 'kmlWidget')
			addClass(this.wrapper, cls);
	}
	removeClass(cls) {
		if (cls != 'kmlWidget')
			removeClass(this.wrapper, cls);
	}
	toggleClass(cls) {
		if (cls != 'kmlWidget')
			toggleClass(this.wrapper, cls);
	}
	content(el) {
		if(el != null){
			if(el.nodeName){
				this.wrapper.appendChild(el);
			}else{
				this.wrapper.innerHTML = el;
			}
		}
	}
	setFontSize(v) {
		this.wrapper.style.fontSize = v + "%";
	}
	destroy() {
		this.removeAllListeners();
		this.parent.remove(this.wrapper);
		removeElement(this.wrapper);
	}
}