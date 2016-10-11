import __style__ from './popup.sss';
import Events from 'eventemitter3';
import {selectAll, createElement, removeElement, autoLineHeight, hasClass, addClass,removeClass,toggleClass} from '../../helpers/dom';
import deepmerge from '../../helpers/deepmerge';
import backgroundColorFN from '../../helpers/backgroundColor';
import relativeSizePos from './relativeSizePos';
import Cuepoint from '../cuepoints/cuepoint';
import svgSprite from '../svgSprite/index';
import {
	isFunction
} from '../../helpers/utils';

let defaults = {
	backgroundColor: '',
	on:{
		show: function(){},
		beforeShow: function(){},
		beforeHide: function(){},
		hide: function(){},
	},
	width: "60%",
	height: "60%",
	header: true,
	headerBg: null,
	headerBgAlpha: 1,
	cuepoints: [],
	externalControls: false,
	visible: false,
	pauseVideo: true,
	single: false
}

export default class Popup extends Events {
	constructor(el, opts, parent, parentPlayer) {
		super();
		let svg = new svgSprite();
		this.wrapper = el;
		let body = createElement('div', {'class': 'body'});
		let overlay = createElement('div');
		addClass(overlay, 'overlay triggerClose');
		this.wrapper.appendChild(overlay);
		this.wrapper.appendChild(body);
		this.body = body;
		this.overlay = overlay;

		this._content = createElement('div', {'class': 'content'});
		this.body.appendChild(this._content);

		this._settings = deepmerge(defaults, opts);

		//header
		if(this._settings['header']){
		let header = document.createElement('h1');
		addClass(header, 'header');
		this._title = document.createElement('span');
		header.appendChild(this._title);
		this._closeBtn = document.createElement('a');
		// this._closeBtn.innerHTML = "<img src='svg/ic_close.svg'/>";
		svg.create('x', this._closeBtn);
		addClass(this._closeBtn, 'closeBtn triggerClose');
		header.appendChild(this._closeBtn);
		this.body.appendChild(header);
		this.header = header;
		this.header.backgroundColor = backgroundColorFN(this.header);
		}else{
			removeClass(overlay, 'triggerClose');
		}
		this.body.backgroundColor = backgroundColorFN(this.body);
		this.overlay.backgroundColor = backgroundColorFN(this.overlay);
		//end header


		this._visible = false;
		this.parentPlayerPaused = false;
		if(this._settings['header']){
			this.header.backgroundColor(this._settings.headerBg, 1);
			this.title(this._settings.title);
		}
		this._cache = {};
		this.backgroundColor = backgroundColorFN(overlay);
		this.parent = parent;
		this.parentPlayer = parentPlayer;


		this.setSize = function(s){
			let d = this.settings({x: (100-s)/2+"%", y: (100-s)/2+"%", width: s+"%", height: s+"%"});
			if(this._settings['header']){
				if(d.y < 10) { 
					header.style.transform = 'translateY(0)';
				} else{
					header.style.transform = 'translateY(-100%)';
				}
			}
		}

		//EVENTS
		let events = ['resize', 'show'];
		events.map((evt)=>{
			this.on(evt, () => {
				this.resize();
				this.autoLineHeight();
			});
		});

		for(var k in this._settings['on']){
            if(isFunction(this._settings['on'][k])){
                this.on(k, this._settings['on'][k]);
            }
        }

        let cuepoints = [];
		this.cuepoint = (options)=>{
			let cp = new Cuepoint(parentPlayer, options);
			//check if you keep them by default
			//cp.on('start', ()=>{console.log('logo show');this.show();});
			//cp.on('end', ()=>{console.log('logo hide');this.hide();});
			cuepoints.push(cp)
			return cp;
		}
		this.cuepoints = ()=>{
			return cuepoints;
		}

		let clsElements = selectAll('.triggerClose', el);
		for (var i = 0, n = clsElements.length; i < n; i += 1) {
			clsElements[i].addEventListener('click', ()=>{this.hide();});
		}

		let externalControls = parentPlayer.externalControls.enabled();

		this.on('beforeShow', ()=>{
			if (this._settings.externalControls != null) {
				externalControls = parentPlayer.externalControls.enabled();
				parentPlayer.externalControls.enabled(this._settings.externalControls);
			}
		});

		this.on('beforeHide', ()=>{
			if (this._settings.pauseVideo) {
				parentPlayer.externalControls.enabled(externalControls);
			}
		});

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
		this.parentPlayer.on('resize', () => {
			this.emit('resize');
		});
		if (this._settings.visible) {
			this.show();
		} else {
			this.wrapper.style.display = "none";
		}
		this.resize();
	}
	visible(v) {
		if (typeof v === 'boolean') this._visible = v;
		return this._visible;
	}
	hide() {
		if (this._visible) {
			this._visible = false;
			this.emit('beforeHide');
			addClass(this.wrapper, 'hidden');
			if (this._settings.pauseVideo) {
				if (!this.parentPlayerPaused) {
					this.parentPlayer.play();
				}
			}
			setTimeout(() => {
				this.wrapper.style.display = "none";
				this.parent.checkVisibleElements();
				this.emit('hide');
			}, 250);
		}
	}
	show() {
		if (!this._visible) {
			this._visible = true;
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
			this.body.style.width = d.width + "%";
			this.body.style.height = d.height + "%";
			//transform(this.body, 'translate(' + 100 / d.width * d.x + '%,' + 100 / d.height * d.y + '%)');
			this.body.style.left = (100 - d.width)/2 + '%';
			this.body.style.top =  (100 - d.height)/2 + '%';
			this._cache.width = this._settings.width;
			this._cache.height = this._settings.height;
			this._cache.x = this._settings.x;
			this._cache.y = this._settings.y;
		}
	}
	hasClass(cls) {
		return hasClass(this.body, cls);
	}
	addClass(cls) {
		if (cls != 'kmlPopup')
			addClass(this.body, cls);
	}
	removeClass(cls) {
		if (cls != 'kmlPopup')
			removeClass(this.body, cls);
	}
	toggleClass(cls) {
		if (cls != 'kmlPopup')
			toggleClass(this.body, cls);
	}
	content(el) {
		if(el != null){
			if(el.nodeName){
				this._content.appendChild(el);
			}else{
				this._content.innerHTML = el;
			}
		}
	}
	setFontSize(v) {
		this.body.style.fontSize = v + "%";
	}
	autoLineHeight(el) {
		if(this.visible()){
			if (el) {
				autoLineHeight(el);
			} else {
				if(this._title)
				autoLineHeight(this._title.parentNode);
			}
		}
	}
	title(v) {
		if (v != null) {
			this._title.innerHTML = v;
			this.autoLineHeight();
			return v;
		}
		return this._title.innerHTML;
	}
	destroy() {
		this.removeAllListeners();
		this.parent.remove(this.wrapper);
		removeElement(this.wrapper);
	}
}