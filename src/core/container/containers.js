import dom from '../../helpers/dom';
import deepmerge from '../../helpers/deepmerge';
import adaptiveSizePos from './adaptiveSizePos';
import Container from './container'
import popup from './popup'
import videoContainer from './videoContainer'

let defaults = {
	backgroundColor: '',
	onHide: null,
	onShow: null,
	externalControls: true,
	visible: false,
	pause: true
}

export default class Containers {
	constructor(ctx) {
		this.wrapper = dom.createElement('div', {
			class: 'kmlContainers'
		});
		this._els = [];
		let ac = new adaptiveSizePos({}, ctx);
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

		ctx.wrapper.appendChild(this.wrapper);


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

		this.add = function(opts, el = {}, type) {
			let cls = 'Container';
			if(type != 'container') cls = 'Popup';
			let settings = deepmerge(defaults, opts);
			let containerHolder = dom.createElement('div');
			ctx.addClass(containerHolder, 'kml'+cls+' hidden');
			let kmlContainerBody = dom.createElement('div');
			if (el) {
				if (!el.nodeType) {
					el = kmlContainerBody;
				}
			} else {
				el = kmlContainerBody;
			}
			dom.addClass(el, 'body');
			
			containerHolder.appendChild(el);
			let container = null;
			switch(type){
				case 'video':
					container = new videoContainer(containerHolder, settings, this, ctx);
					break;
				case 'popup':
					container = new popup(containerHolder, settings, this, ctx);
					break;
				default:
					container = new Container(containerHolder, settings, this, ctx);
				break;
			}
			
			this._els.push(container);
			this.wrapper.appendChild(containerHolder);
			return container;
		}

		this.remove = (container)=>{
			for(var i = 0, n = this._els.length; i<n; i+=1){
				let c = this._els[i];
				if(c.body === container){
					this._els.splice(i, 1);
					if(this._els.length == 0) this.enabled(false);
					break;
				}
			}
		}
	}
	els(id) {
		return this._els[id] || this._els;
	}
}