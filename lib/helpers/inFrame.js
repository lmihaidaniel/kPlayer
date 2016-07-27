export default function inIframe() {
	try {
		let is = (window.self !== window.top);
		if (is) {
			var arrFrames = parent.document.getElementsByTagName("IFRAME");
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
		return true;
	}
}