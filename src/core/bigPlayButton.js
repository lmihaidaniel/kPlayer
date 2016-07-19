import dom from '../helpers/dom';
const bigButton = '<svg x="0px" y="0px" width="98px" height="98px" viewBox="0 0 213.7 213.7" enable-background="new 0 0 213.7 213.7" xml:space="preserve"><polygon class="triangle" id="XMLID_18_" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="73.5,62.5 148.5,105.8 73.5,149.1 "></polygon><circle class="circle" id="XMLID_17_" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" cx="106.8" cy="106.8" r="103.3"></circle></svg>'
export default function(parentPlayer) {
	return (function() {
		let bigPlayButton = function(){
			let isMobile = parentPlayer.device.isMobile;
			let autoplay = parentPlayer.__settings['autoplay'];
			let wrapper = dom.createElement('div', {class: "kmlBigPlay hidden"});
			let btn = dom.createElement('div', {class: 'kmlBigPlayButton'});
			btn.innerHTML = bigButton;
			wrapper.addEventListener('click', ()=>{
				this.hide();
			});
			wrapper.appendChild(btn);
			parentPlayer.wrapper.appendChild(wrapper);

			this.show = ()=>{
				if(parentPlayer.containers){
					parentPlayer.containers.hide();
				}
				parentPlayer.pause();
				wrapper.style.display = "block";
				dom.removeClass(wrapper, 'hidden');
			}
			this.hide = ()=>{
				if(parentPlayer.containers){
					parentPlayer.containers.show();
				}
				dom.addClass(wrapper, 'hidden');
				setTimeout(()=>{
					wrapper.style.display = "none";
					parentPlayer.play();
				}, 200);
			}

			if(!autoplay || isMobile){
				this.show();
			}else{
				wrapper.style.display = "none";
			}
		}
		return new bigPlayButton();
	})();
};