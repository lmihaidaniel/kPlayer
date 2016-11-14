import style from './index.sss';
import {
	addClass,
	removeClass
} from '../../helpers/dom';
import subtitleToObject from '../../helpers/subtitleObject';
import ajax from '../../helpers/ajax';

export default class Subtitles {
	constructor(player) {
		this.index = null;
		this.cleared = null;
		this.wrapper = player.containers.wrapper.querySelector('.subtitles');
		let text = document.createElement('div');
		text.className = "subtitle-text";
		this.wrapper.appendChild(text);
		this.text = text;
		this.bucket = [];
		this.visible = true;

		let timeupdate = (t) => {
			if (!this.visible) {
				return;
			}
			this.display(t);
		};
		this.destroy = () => {
			this.index = null;
			this.cleared = null;
			this.text.innerHTML = "";
			this.text.style.display = "none";
			player.off('timeupdate', timeupdate);
		}
		this.init = () => {
			player.emit('timelineCheckSize');
			this.index = null;
			this.cleared = null;
			player.on('timeupdate', timeupdate);
			this.display(player.currentTime());
		}
		this.enabled = (t) => {
			if (typeof t === 'boolean') {
				this.visible = t;
				player.emit('subtitle_visible', t);
				if (t) {
					this.init();
				} else {
					this.destroy();
				}
			}
			return this.visible;
		}

		let h = 0;
		player.on('timelineClosed', (t, v) => {
			if (t.wrapper.visible()) {
				if (v) {
					this.text.style.bottom = 0;
				} else {
					this.text.style.bottom = h;
				}
			}
		});
		player.on('timelineHeight', (v) => {
			this.text.style.bottom = h = v;
		});
		player.on('toggle_subtitle', (t) => {
			this.enabled(t);
		});
		player.on('timelineShow', (v) => {
			this.text.style.bottom = h = v;
		});
		player.on('timelineHide', (v) => {
			this.text.style.bottom = h = 0;
		});
	}
	background(v) {
		addClass(this.text, 'bg');
	}
	shadow(v) {
		addClass(this.text, 'shadow');
	}
	display(t) {
		for (var i = 0, n = this.bucket.length; i < n; i += 1) {
			let data = this.bucket[i];
			if (t >= data.start && t <= data.end) {
				if (this.index != i) {
					this.index = i;
					this.text.style.display = "inline-block";
					this.text.innerHTML = '<span>' + data.text + '</span>';
					this.cleared = false;
				}
			} else {
				if (this.index == i) {
					if (!this.cleared) {
						this.text.innerHTML = "";
						this.text.style.display = "none";
						this.cleared = true;
						this.index = null;
					}
				}
			}
		}
	}
	setSize(v) {
		this.wrapper.style.fontSize = v + "%";
	}
	load(src) {
		//removeDefaultSubtitles();
		if (src) {
			if (src instanceof Array) {
				this.bucket = src;
				this.init();
			} else {
				ajax().get(src).then((data, xhr) => {
					this.bucket = subtitleToObject(data);
					this.init();
				}).catch((err, xhr) => {
					this.destroy();
					return;
				});
			}
		} else {
			this.destroy();
		}
	}
}