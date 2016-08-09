import {
	selectAll,
	removeElement
} from './dom';
export default function(media) {
	// Remove child sources
	var sources = selectAll('source', media);
	for (var i = 0; i < sources.length; i++) {
		removeElement(sources[i]);
	}

	// Set blank audio src attribute
	// This is to prevent a MEDIA_ERR_SRC_NOT_SUPPORTED error
	// Small wav: https://github.com/mathiasbynens/small/blob/master/mp3.mp3
	// Info: http://stackoverflow.com/questions/32231579/how-to-properly-dispose-of-an-html5-audio-and-close-socket-or-connection
	media.setAttribute('src', 'data:audio/mp3;base64,/+MYxAAAAANIAAAAAExBTUUzLjk4LjIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');

	// Load the new empty source
	// This will cancel existing requests
	// See https://github.com/Selz/plyr/issues/174
	media.load();

	// Debugging
	console.log("Cancelled network requests for old media");
}