import {createElement, hasClass, addClass, removeClass, toggleClass} from '../../helpers/dom';
import deepmerge from '../../helpers/deepmerge';
import adaptiveSizePos from './adaptiveSizePos';
import Widget from './widget';
import Hotspot from './hotspot';
import Popup from './popup';
import videoPopup from './video';
import timelineContainer from './timelineContainer';

export default class Containers {
	constructor(parentPlayer) {
		this.wrapper = createElement('div', {
			class: 'kmlContainers'
		});

		let popups = createElement('div', {class: 'popups'});
		let hotspots = createElement('div', {class: 'hotspots'});
		let widgets = createElement('div', {class: 'widgets'});
		let subtitles = createElement('div', {class: 'subtitles'});
		let timelines = createElement('div', {class: 'timelines'});
		
		this.wrapper.appendChild(subtitles);
		this.wrapper.appendChild(hotspots);
		this.wrapper.appendChild(widgets);
		this.wrapper.appendChild(timelines);
		this.wrapper.appendChild(popups);
		this._els = [];
		let ac = new adaptiveSizePos({}, parentPlayer);
		ac.applyTo(this.wrapper);

		this.enabled = function(v) {
			if (v != null) {
				if (v == 0) {
					v = false;
					this.wrapper.style.display = "none";
				}
				if(v){
					this.wrapper.style.display = "block";
				}
				ac.enabled(v);
			}
			return ac.enabled();
		}

		this.checkVisibleElements = function() {
			let no = 0;
			for (var k in this._els) {
				if (this._els[k].visible()) {
					no += 1;
				}
			}
			this.enabled(no);
		}

		parentPlayer.wrapper.appendChild(this.wrapper);


		let currentVisibles = [];
		this.hide = function(current) {
			for (var k in this._els) {
				let currentContainer = this._els[k];
				if (this._els[k] !== current) {
					if (currentContainer.visible()) {
						currentContainer.hide();
						currentVisibles.push(currentContainer);
						currentContainer.visible(false);
					}
				}
			}
		}

		this.show = function() {
			for (var k in currentVisibles) {
				currentVisibles[k].show();
			}
			currentVisibles = [];
		}

		this.add = function(settings, el = {}, type) {
			let cls = settings.className || '';
			let containerBody = createElement('div');
			if (el) {
				if (!el.nodeType) {
					el = containerBody;
				}
			} else {
				el = containerBody;
			}
			
			let container = null;
			switch(type){
				case 'hotspot':
					container = new Hotspot(parentPlayer, settings);
					hotspots.appendChild(container.wrapper);
					break;
				case 'video':
					addClass(containerBody, 'kmlPopup isVideo hidden ' + cls);
					container = new videoPopup(containerBody, settings, this, parentPlayer);
					popups.appendChild(container.wrapper);
					break;
				case 'popup':
					addClass(containerBody, 'kmlPopup hidden ' + cls);
					container = new Popup(containerBody, settings, this, parentPlayer);
					popups.appendChild(container.wrapper);
					break;
				case 'timeline':
					cls = settings.className || 'kmlTimeline';
					addClass(containerBody, cls);
					container = new timelineContainer(containerBody, settings, this, parentPlayer);
					timelines.appendChild(container.wrapper);
					break;
				default:
					addClass(containerBody, 'kmlWidget ' + cls);
					container = new Widget(containerBody, settings, this, parentPlayer);
					widgets.appendChild(container.wrapper);
				break;
			}
			
			this._els.push(container);
			return container;
		}

		this.remove = (container)=>{
			for(var i = 0, n = this._els.length; i<n; i+=1){
				let c = this._els[i];
				if(c.wrapper === container){
					this._els.splice(i, 1);
					if(this._els.length == 0) this.enabled(false);
					break;
				}
			}
		}
	}
	hasClass(cls){
		return hasClass(this.wrapper, cls);
	}
	addClass(cls){
		if(cls != 'kmlContainers')
		addClass(this.wrapper, cls);
	}
	removeClass(cls){
		if(cls != 'kmlContainers')
		removeClass(this.wrapper, cls);	
	}
	toggleClass(cls){
		if(cls != 'kmlContainers')
		toggleClass(this.wrapper, cls);		
	}
	els(id) {
		return this._els[id] || this._els;
	}
}