import error from '../../helpers/error';
import Fullscreen from '../fullscreen';
import _cancelRequests from '../../helpers/cancelVideoNetworkRequest';
import {mimeVideo} from '../../helpers/mimeType';

//https://www.w3.org/2010/05/video/mediaevents.html
let _events = ['ended', 'progress', 'stalled', 'playing', 'waiting', 'canplay', 'canplaythrough', 'loadstart', 'loadeddata', 'loadedmetadata', 'timeupdate', 'volumechange', 'play', 'playing', 'pause', 'error', 'seeking', 'emptied', 'seeked', 'ratechange', 'suspend'];

export default class Media extends Fullscreen {
	constructor(el) {
		super();
		if(el == null){
			error("You need to supply a HTMLVideoElement to instantiate the player");
			return;
		}
		this.media = el;
		_events.forEach((k) => {
			el.addEventListener(k, () => {
				this.emit(k);
			});
		});

		this.canPlay = {
			mp4: mimeVideo(el,'video/mp4'),
			webm: mimeVideo(el,'video/webm'),
			ogg: mimeVideo(el,'video/ogg')
		}
	}

	/*** Global attributes */

	/* A Boolean attribute; if specified, the video automatically begins to play back as soon as it can do so without stopping to finish loading the data. If not return the auoplay attribute. */
	autoplay(v) {
		if (typeof v === 'boolean') {
			this.media.autoplay = v;
		}
		return this.media.autoplay;
	}

	/* Returns the time ranges of the buffered media. This attribute contains a TimeRanges object */
	buffered()  {
		return this.media.buffered;
	}

	/* If this attribute is present, the browser will offer controls to allow the user to control video playback, including volume, seeking, and pause/resume playback. When not set returns if the controls are present */
	nativeControls(v) {
		if (typeof v === 'boolean') {
			this.media.controls = v;
		}
		return this.media.controls;
	}

	/* anonymous, use-credentials, false */
	crossorigin(v) {
		if (v === 'use-credentials') {
			this.media.crossOrigin = 'use-credentials';
			return v;
		}
		if (v) {
			this.media.crossOrigin = 'anonymous';
			return 'anonymous';
		}
		if (v === false) this.media.crossOrigin = null;
		return this.media.crossOrigin;
	}

	/* A Boolean attribute; if specified, we will, upon reaching the end of the video, automatically seek back to the start. */
	loop(v) {
		if (typeof v === 'boolean') {
			this.media.loop = v;
		}
		return this.media.loop;
	}

	/*A Boolean attribute which indicates the default setting of the audio contained in the video. If set, the audio will be initially silenced. Its default value is false, meaning that the audio will be played when the video is played*/
	muted(v) {
		if (typeof v === 'boolean') {
			this.media.muted = v;
		}
		return !!this.media.muted;
	}

	/* Mute the video */
	mute() {
		this.muted(true);
	}

	/* UnMute the video */
	unmute() {
		this.muted(false);
	}

	/* Toggle the muted stance of the video */
	toggleMute() {
		return this.muted(!this.muted());
	}

	/* Returns A TimeRanges object indicating all the ranges of the video that have been played.*/
	played() {
		return this.media.played;
	}

	/*
	This enumerated attribute is intended to provide a hint to the browser about what the author thinks will lead to the best user experience. It may have one of the following values:
		none: indicates that the video should not be preloaded.
		metadata: indicates that only video metadata (e.g. length) is fetched.
		auto: indicates that the whole video file could be downloaded, even if the user is not expected to use it.
	the empty string: synonym of the auto value.
	*/
	preload(v) {
		if (v === 'metadata' || v === "meta") {
			this.media.preload = 'metadata';
			return 'metadata';
		}
		if (v) {
			this.media.preload = 'auto';
			return 'auto';
		}
		if (v === false) {
			this.media.preload = 'none';
			return 'none';
		}
		return this.media.preload;
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
			_cancelRequests(this.media);
			if(v instanceof Array){
				for(var i = 0, n = v.length; i+=1;){
					if(v[i]['type'] === "video/mp4" && this.canPlay.mp4){
						return this.media.src = v[i]['src'];
					}
					if(v[i]['type'] === "video/webm" && this.canPlay.webm){
						return this.media.src = v[i]['src'];
					}
					if(v[i]['type'] === "video/ogg" && this.canPlay.ogg){
						return this.media.src = v[i]['src'];
					}
				}
			}else if(v.src && v.type){
				this.media.src = v.src;
			}else{
				this.media.src = v;
			}
			
		}
		return this.media.currentSrc;
	}

	/*** Global Events */

	/* Starts playing the audio/video */
	play() {
		this.media.play();
	}

	/* Pauses the currently playing audio/video */
	pause() {
		this.media.pause();
	}

	/* Return the currently playing status of audio/video */
	paused() {
		return this.media.paused;
	}

	/* Return the currently playing status of audio/video */
	playing() {
		return this.media.paused;
	}

	/* Toggle play/pause for the audio/video */
	togglePlay() {
		this.media.paused ? this.play() : this.pause();
	}

	currentTime(v) {
		if (v === null || isNaN(v)) {
			return this.media.currentTime;
		}
		v = parseFloat(v);
		if (v > this.media.duration) {
			v = this.media.duration;
		}
		if (v < 0) {
			v = 0;
		}
		this.media.currentTime = v;
		return v;
	}

	seek(v) {
		return this.currentTime(v);
	}

	/**
	 * [Re-loads the audio/video element, update the audio/video element after changing the source or other settings]
	 * @return {[type]} [description]
	 */
	load(v) {
		if (v !== undefined) {
			this.src(v);
		}
		this.media.load();
	}

	duration() {
		return this.media.duration;
	}

	volume(v) {
		// Return current volume if value 
		if (v === null || isNaN(v)) {
			return this.media.volume;
		}
		v = parseFloat(v);
		if (v > 1) {
			v = 1;
		}
		if (v < 0) {
			v = 0;
		}
		this.media.volume = v;
		return v;
	}
}