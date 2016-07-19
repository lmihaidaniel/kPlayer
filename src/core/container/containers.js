import dom from '../../helpers/dom';
import deepmerge from '../../helpers/deepmerge';
import adaptiveSizePos from './adaptiveSizePos';
import Widget from './widget'
import Popup from './popup'
import videoPopup from './video'

export default class Containers {
	constructor(parentPlayer) {
		this.wrapper = dom.createElement('div', {
			class: 'kmlContainers'
		});
		let popups = dom.createElement('div', {class: 'popups'});
		let widgets = dom.createElement('div', {class: 'widgets'});
		this.wrapper.appendChild(popups);
		this.wrapper.appendChild(widgets);
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
			let containerBody = dom.createElement('div');
			if (el) {
				if (!el.nodeType) {
					el = containerBody;
				}
			} else {
				el = containerBody;
			}
			
			let container = null;
			switch(type){
				case 'video':
					dom.addClass(containerBody, 'kmlPopup isVideo hidden ' + cls);
					container = new videoPopup(containerBody, settings, this, parentPlayer);
					popups.appendChild(container.wrapper);
					break;
				case 'popup':
					dom.addClass(containerBody, 'kmlPopup hidden ' + cls);
					container = new Popup(containerBody, settings, this, parentPlayer);
					popups.appendChild(container.wrapper);
					break;
				default:
					dom.addClass(containerBody, 'kmlWidget ' + cls);
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
	addClass(cls){
		if(cls != 'kmlContainers')
		dom.addClass(this.wrapper, cls);
	}
	removeClass(cls){
		if(cls != 'kmlContainers')
		dom.removeClass(this.wrapper, cls);	
	}
	toggleClass(cls){
		if(cls != 'kmlContainers')
		dom.toggleClass(this.wrapper, cls);		
	}
	els(id) {
		return this._els[id] || this._els;
	}
}