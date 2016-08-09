import Media from './index';
import _cancelRequests from '../../helpers/cancelAudioNetworkRequest';
import {
	mimeVideo
} from '../../helpers/mimeType';
export default class Audio extends Media {
	constructor(video) {
		super(null, 'audio');
		this.canPlay = {
			mp4: mimeVideo(this.media, 'audio/mp4'),
			mpeg: mimeVideo(this.media, 'audio/mpeg'),
			ogg: mimeVideo(this.media, 'audio/ogg'),
			wav: mimeVideo(this.media, 'audio/wav')
		}
		this.__sync = false;
		if (video) {
			if (video.play != null) {
				this.__sync = true;
				video.on('volumechange', (v) => {
					if (this._sync()) {
						if (video.muted()) {
							this.volume(0)
							return;
						}
						this.volume(v)
					}
				});
				video.on('play', () => {
					if (this._sync()) this.play();
				});
				video.on('playing', () => {
					if (this._sync()) this.play();
				});
				video.on('pause', () => {
					if (this._sync()) this.pause();
				});
				video.on('seeking', () => {
					if (this._sync()) this.currentTime(video.media.currentTime);
				});
				video.on('loadedmetadata', () => {
					if (this._sync()) {
						this.pause();
						this.currentTime(0);
					}
				});
				this.on('loadedmetadata', () => {
					if (this._sync()) {
						this.pause();
						if (!video.paused()) {
							this.play();
							this.volume(video.media.volume);
							this.currentTime(video.media.currentTime);
						}
					}
				});
			}
		}
	}

	_sync() {
		if (!this.__sync || this.media.currentSrc == "") {
			return false;
		}
		return true;
	}

	sync(v) {
		if (typeof v === 'boolean') {
			this.__sync = v;
			if (!v) {
				this.pause();
			}
		}
		return this.__sync;
	}

	/* The src property sets or returns the current source of the audio/video, The source is the actual location (URL) of the audio/video file */
	src(v) {
		if (v !== undefined) {
			_cancelRequests(this.media);
			if (v instanceof Array) {
				for (var i = 0, n = v.length; i += 1;) {
					if (v[i]['type'] === "audio/mp4" && this.canPlay.mp4) {
						return this.media.src = v[i]['src'];
					}
					if (v[i]['type'] === "audio/mpeg" && this.canPlay.webm) {
						return this.media.src = v[i]['src'];
					}
					if (v[i]['type'] === "audio/ogg" && this.canPlay.ogg) {
						return this.media.src = v[i]['src'];
					}
					if (v[i]['type'] === "audio/wav" && this.canPlay.ogg) {
						return this.media.src = v[i]['src'];
					}
				}
			} else if (v.src && v.type) {
				this.media.src = v.src;
			} else {
				this.media.src = v;
			}

		}
		return this.media.currentSrc;
	}

	/**
	 * [Re-loads the audio/video element, update the audio/video element after changing the source or other settings]
	 * @return {[type]} [description]
	 */
	// update for syncking
	// load(v) {
	// 	if (v !== undefined) {
	// 		this.src(v);
	// 	}
	// 	this.media.load();
	// }
}