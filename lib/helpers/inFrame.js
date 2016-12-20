export default function inIframe() {
	try {
		let is = false;
		if (window.location !== window.parent.location) {
			var arrFrames = window.parent.document.getElementsByTagName("IFRAME");
			is = false;
			for (var i = 0; i < arrFrames.length; i++) {
				let frame = arrFrames[i];
				if (frame.contentWindow === window) {
					is = frame;
					frame.setAttribute('allowfullscreen', 'true');
					frame.setAttribute('mozallowfullscreen', 'true');
					frame.setAttribute('webkitallowfullscreen', 'true');
					frame.setAttribute('frameborder', '0');
				};
			}
		}
		return is;
	} catch (e) {
		return false;
	}
}