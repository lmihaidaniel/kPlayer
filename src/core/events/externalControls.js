let _doc = document || {};
//rewrite as a class that extends the events - for better modularity
let externalControls = function(parentPlayer) {
	let _enabled = true;
	let _seek = true;
	let _tId = null;
	let media = parentPlayer.media;
	let keydown = function(e) {
		if (_enabled) {
			//bypass default native external controls when media is focused
			parentPlayer.wrapper.focus();
			if (e.keyCode == 32) { //space
				if (media.paused) {
					media.play();
				} else {
					media.pause();
				}
			}
			if (_seek) {
				if (e.keyCode == 37) { //left
					media.currentTime = media.currentTime - 5;
					parentPlayer.emit('replay', 5);
					return;
				}
				if (e.keyCode == 39) { //right
					media.currentTime = media.currentTime + 5;
					parentPlayer.emit('forward', 5);
					return;
				}
			}
			if (e.keyCode == 38) { //up
				let v = media.volume;
				v += .1;
				if (v > 1) v = 1;
				media.volume = v;
				return;
			}

			if (e.keyCode == 40) { //down
				let v = media.volume;
				v -= .1;
				if (v < 0) v = 0;
				media.volume = v;
				return;
			}
			/*if (self.controlBar) {
				if (self.controlBar.volumeMenuButton) {
					if (e.keyCode == 40 || e.keyCode == 38) {

						self.controlBar.volumeMenuButton.menuContent.el_.className = "vjs-menu show";
					}
				}
			}*/
		}
	};

	// this.onSpace = function() {

	// };

	let keyup = function(e) {
		if (_enabled) {			
			// if (e.keyCode == 40 || e.keyCode == 38) {
			// 	clearInterval(_tId);
			// 	if (self.controlBar.volumeMenuButton) {
			// 		_tId = setTimeout(function() {
			// 			self.controlBar.volumeMenuButton.menuContent.el_.className = "vjs-menu";
			// 		}, 500);
			// 	}
			// }
			if (_seek) {
				if (e.keyCode == 37) { //left
					parentPlayer.emit('replay', false);
					return;
				}
				if (e.keyCode == 39) { //right
					parentPlayer.emit('forward', false);
					return;
				}
			}
		}
	};
	this.enabled = function(b) {
		if (b === undefined) return _enabled;
		_enabled = b;

	};
	this.seekEnabled = function(b) {
		if (b === undefined) return _seek;
		_seek = b;
	};
	this.init = function() {
		_enabled = true;
		_tId = null;
		_seek = true;
		_doc.body.addEventListener('keydown', keydown.bind(this), false);
		_doc.body.addEventListener('keyup', keyup.bind(this), false);
	};
	this.destroy =  function() {
		_enabled = false;
		_tId = null;
		_seek = true;
		_doc.body.removeEventListener('keydown', keydown);
		_doc.body.removeEventListener('keyup', keyup);
	}
	this.init();
}
export default externalControls;