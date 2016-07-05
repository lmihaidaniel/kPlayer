var _doc = document || {};
// Set the name of the hidden property and the change event for visibility
var hidden, visibilityChange;
if (typeof _doc.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
	hidden = "hidden";
	visibilityChange = "visibilitychange";
} else if (typeof _doc.mozHidden !== "undefined") {
	hidden = "mozHidden";
	visibilityChange = "mozvisibilitychange";
} else if (typeof _doc.msHidden !== "undefined") {
	hidden = "msHidden";
	visibilityChange = "msvisibilitychange";
} else if (typeof _doc.webkitHidden !== "undefined") {
	hidden = "webkitHidden";
	visibilityChange = "webkitvisibilitychange";
}

const isAvailable = function() {
	return !(typeof _doc[hidden] === "undefined");
}

export default function pageVisibility(_media, settings = {}) {
	let _available = isAvailable();
	if (_available) {
		let _enabled = false;
		let _playing = false;
		let paused = false;
		let setFlagPlaying = function() {
			_playing = true;
		};
		let events = {
			visible: function(){},
			hidden: function(){}
		};
		let destroyVisibility = function() {
			events = {
				visible: function(){},
				hidden: function(){}
			};
			_enabled = false;
			_playing = false;
			_doc.removeEventListener(visibilityChange, handleVisibilityChange, false);
			_media.removeEventListener('playing', setFlagPlaying);
		}
		let handleVisibilityChange = function() {
			if (_enabled) {
				if (_doc[hidden]) {
					if (_playing && !_media.paused) {
						_media.pause();
						paused = true;
					}
					events.hidden();
				} else {
					if (paused && _media.paused) {
						_media.play();
						paused = false;
					}
					events.visible();
				}
			}
		}
		let initVisibility = function initVisibility(settings) {
			if (_available) {
				_doc.removeEventListener(visibilityChange, handleVisibilityChange, false);
				_media.removeEventListener('playing', setFlagPlaying);
				
				events.visible = settings.onVisible || events.visible;
				events.hidden = settings.onHidden || events.hidden;
				_enabled = true;
				_doc.addEventListener(visibilityChange, handleVisibilityChange, false);
				_media.addEventListener('playing', setFlagPlaying);
			}
		}
		events.visible = settings.onVisible || events.visible;
		events.hidden = settings.onHidden || events.hidden;
		_enabled = true;
		_doc.addEventListener(visibilityChange, handleVisibilityChange, false);
		_media.addEventListener('playing', setFlagPlaying);

		this.init = initVisibility;
		this.destroy = destroyVisibility;
		this.on = function(event,fn) {
			if (event in events) events[event] = fn;
		};
		this.enabled = function(v) {
			if (typeof v === 'boolean') _enabled = v;
			return _enabled;
		}
	};
};