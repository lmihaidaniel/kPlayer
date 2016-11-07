import Media from './index';
import _cancelRequests from '../../helpers/cancelVideoNetworkRequest';
import {
	mimeVideo
} from '../../helpers/mimeType';
export default class Video extends Media {
	constructor(el) {
		super(el, 'video');
		this.media.setAttribute('webkit-playsinline', 'true');
		this.media.setAttribute('playsinline', 'true');
		this.canPlay = {
			mp4: mimeVideo(this.media, 'video/mp4'),
			webm: mimeVideo(this.media, 'video/webm'),
			ogg: mimeVideo(this.media, 'video/ogg')
		}
	}

	/* Gives or returns the address of an image file that the user agent can show while no video data is available. The attribute, if present, must contain a valid non-empty URL potentially surrounded by spaces */
	poster(v) {
		if (v !== undefined) {
			this.media.poster = v;
		}
		return this.media.poster;
	}

	/* The src property sets or returns the current source of the audio/video, The source is the actual location (URL) of the audio/video file */
	src(v) {
		if (v !== undefined) {
			if(this.media.src != "") _cancelRequests(this.media);
			if (v instanceof Array) {
				for (var i = 0, n = v.length; i += 1;) {
					if (v[i]['type'] === "video/mp4" && this.canPlay.mp4) {
						return this.media.src = v[i]['src'];
					}
					if (v[i]['type'] === "video/webm" && this.canPlay.webm) {
						return this.media.src = v[i]['src'];
					}
					if (v[i]['type'] === "video/ogg" && this.canPlay.ogg) {
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

}