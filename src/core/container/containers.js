import dom from '../../helpers/dom';
import deepmerge from '../../helpers/deepmerge';
import adaptiveSizePos from './adaptiveSizePos';
import Container from './container'
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
			let settings = deepmerge(defaults, opts);
			let kmlContainer = dom.createElement('div');
			ctx.addClass(kmlContainer, 'kmlContainer hidden');
			let kmlOverlay = dom.createElement('div');
			ctx.addClass(kmlOverlay, 'overlay triggerClose');
			let kmlContainerBody = dom.createElement('div');
			if (el) {
				if (!el.nodeType) {
					el = kmlContainerBody;
				}
			} else {
				el = kmlContainerBody;
			}
			dom.addClass(el, 'body');
			kmlContainer.appendChild(kmlOverlay);
			kmlContainer.appendChild(el);
			let container = null;
			switch(type){
				case 'video':
					container = new videoContainer(kmlContainer, settings, this, ctx);
					break;
				default:
					container = new Container(kmlContainer, settings, this, ctx);
				break;
			}
			
			this._els.push(container);
			this.wrapper.appendChild(kmlContainer);
			return container;
		}
	}
	els(id) {
		return this._els[id] || this._els;
	}
}