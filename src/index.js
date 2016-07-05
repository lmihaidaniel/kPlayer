import classMixin from './helpers/classMixin';
import deepmerge from './helpers/deepmerge';
import extend from './helpers/extend';
import { capitalizeFirstLetter } from './helpers/utils';
import dom from './helpers/dom';
import Media from './core/media/index';
import containerBounds from './helpers/containerBounds';
import pageVisibility from './helpers/pageVisibility';
import contextMenu from './helpers/contextMenu';
import externalControls from './core/media/events/externalControls';
import ajax from './helpers/ajax';

const settings = Symbol('settings');
const defaults = {
	width: 960,
	height: 540
};

class kmlPlayer extends Media {
	constructor(el, settings, _events) {
		super(el);
		this[settings] = deepmerge(defaults, settings);
		dom.class.add(el, "kml" + capitalizeFirstLetter(el.nodeName.toLowerCase()));
		this.wrapper = dom.wrap(this.media, dom.createElement('div', {
			class: 'kmlPlayer'
		}));
		this.defaultWidth(this[settings].width);
		this.defaultHeight(this[settings].height);

		this.pageVisibility = new pageVisibility(el, {
			onHidden: () => {
				console.log(this.currentTime());
			}
		});
		this.contextMenu = new contextMenu(el);
		this.externalControls = new externalControls(el);

		for (var evt in _events) {
			this.on(evt, _events[evt], this);
		}
	}

	ajax(options) {
		return ajax(options);
	}

	defaultWidth(v) {
		if (this.media.videoWidth) {
			this.media.width = this.media.videoWidth;
			return this.media.videoWidth;
		}
		if (!isNaN(v)) {
			v = parseFloat(v);
			this.media.width = v;
		}
		return this.media.width;
	}

	defaultHeight(v) {
		if (this.media.videoHeight) {
			this.media.height = this.media.videoHeight;
			return this.media.videoHeight;
		}
		if (!isNaN(v)) {
			v = parseFloat(v);
			this.media.height = v;
		}
		return this.media.height;
	}

	scale() {
		return this.defaultWidth() / this.defaultHeight();
	}

	bounds(v) {
		let data = containerBounds(this.media);
		if (data[v] !== undefined) return data[v];
		return data;
	}

	width() {
		return this.bounds('width');
	}

	height() {
		return this.bounds('height');
	}

	offsetX() {
		return this.bounds('offsetX');
	}

	offsetY() {
		return this.bounds('offsetY');
	}

	wrapperHeight() {
		return this.media.offsetHeight;
	}

	wrapperWidth() {
		return this.media.offsetWidth;
	}

	wrapperScale() {
		return this.media.offsetWidth / this.media.offsetHeight;
	}

	addClass(v) {
		dom.class.add(this.wrapper, v);
	}
	removeClass(v) {
		if (v !== 'kmlPlayer') {
			dom.class.remove(this.wrapper, v);
		}
	}
	toggleClass(v) {
		if (v !== 'kmlPlayer') {
			dom.class.toggle(this.wrapper, v);
		}
	}
};

export default kmlPlayer;