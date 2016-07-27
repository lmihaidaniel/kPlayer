//break each element inside the timeline as a generic component - buttons, progress, etc with their own life cycle and events
import dom from '../../helpers/dom';
import {
	procentFromString
} from '../../helpers/utils';
let defaults = {
	x: 0,
	width: '100%',
	height: '6%',
	minHeight: 32
}
export default function(parentPlayer) {
	return (function() {
		let Timeline = function() {
			let fragment = document.createDocumentFragment();
			let playBtn = dom.createElement('button', {
				'class': 'play'
			});
			let pc = dom.createElement('div', {
				'class': 'kmlCuepoints'
			});
			let pl = dom.createElement('div', {
				'class': 'progressline'
			});
			//pl.appendChild(dom.createElement('div', {'class': 'progressBubble'}));
			fragment.appendChild(playBtn);
			fragment.appendChild(pc);
			this.cuepointsWrapper = pc;
			let wrapper = null;
			if (parentPlayer.timelineContainer != null) {
				this.wrapper = parentPlayer.timelineContainer(defaults);
				this.wrapper.content(fragment);
				wrapper = this.wrapper.wrapper;
			} else {
				this.wrapper = dom.createElement('div', {
					class: "kmlTimeline",
					style: "position: absolute; left: 0; width: "+defaults.width+"; height: "+defaults.height+"; top: auto; bottom: 0;"
				});
				parentPlayer.wrapper.appendChild(this.wrapper);
				wrapper = this.wrapper;
				this.wrapper.appendChild(fragment);
			}
			parentPlayer.on('play', () => {
				dom.removeClass(playBtn, 'play');
				dom.addClass(playBtn, 'pause');
			});
			parentPlayer.on('pause', () => {
				dom.removeClass(playBtn, 'pause');
				dom.addClass(playBtn, 'play');
			});
			parentPlayer.on('resize', () => {
				this.resize();
			})
			let w = 0;
			let cache_sc = 0;
			this.resize = () => {
				let sc = procentFromString(defaults.height) * parentPlayer.height() / 100;
				if (cache_sc != sc) {
					cache_sc = sc;
					if (sc < defaults.minHeight) {
						w = sc = defaults.minHeight;
						if (this.wrapper.settings) {
							this.wrapper.settings({
								height: defaults.minHeight + "px"
							});
						} else {
							wrapper.style.height = defaults.minHeight + "px";
						}
						playBtn.style.width = w + "px";
						pc.style.left = w + "px";
						pc.style.right = 0 + "px";						
					} else {
						if (this.wrapper.settings) {
							this.wrapper.settings({
								height: defaults.height
							});
						} else {
							wrapper.style.height = defaults.height;
						}
						w = sc / parentPlayer.width() * 100;
						playBtn.style.width = w + "%";
						pc.style.left = w + "%";
						pc.style.right =  0 + "%";						
					}
				}
			}
		}
		return new Timeline();
	})();
};