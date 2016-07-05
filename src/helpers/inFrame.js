export default function inIframe(){
	try {
	  if (parent !== window) {
	    if (window.frameElement) {
	      window.frameElement.setAttribute('allowfullscreen', 'true');
	      window.frameElement.setAttribute('mozallowfullscreen', 'true');
	      window.frameElement.setAttribute('webkitallowfullscreen', 'true');
	      window.frameElement.setAttribute('frameborder', '0');
	    }
	  }
	}
	catch(err){}
}