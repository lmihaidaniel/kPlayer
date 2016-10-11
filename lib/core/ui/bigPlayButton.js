import __style__ from './bigPlayButton.sss';
import {createElement,select,removeClass,addClass} from '../../helpers/dom';
import backgroundColorFN from '../../helpers/backgroundColor';
import device from '../../helpers/device';
const bigButton = '<svg x="0px" y="0px" width="98px" height="98px" viewBox="0 0 213.7 213.7" enable-background="new 0 0 213.7 213.7" xml:space="preserve"><polygon class="triangle" id="XMLID_18_" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="73.5,62.5 148.5,105.8 73.5,149.1 "></polygon><circle class="circle" id="XMLID_17_" fill="none" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" cx="106.8" cy="106.8" r="103.3"></circle></svg>'
export default function(parentPlayer) {
	return (function() {
		let bigPlayButton = function(){
			let autoplay = parentPlayer.__settings['autoplay'];
			let wrapper = createElement('div', {class: "kmlBigPlay hidden"});
			let btn = createElement('div', {class: 'kmlBigPlayButton'});
			btn.innerHTML = bigButton;
			let circle = select('.triangle', btn);
			let triangle = select('.circle', btn);
			wrapper.addEventListener('click', ()=>{
				parentPlayer.play();
			});
			wrapper.appendChild(btn);
			parentPlayer.wrapper.appendChild(wrapper);
			let hasExternalSeekEnabled = true;
			this.show = ()=>{
				hasExternalSeekEnabled = parentPlayer.externalControls.seekEnabled();
				parentPlayer.externalControls.seekEnabled(false);
				if(parentPlayer.containers){
					parentPlayer.containers.hide();
				}
				parentPlayer.pause();
				wrapper.style.display = "block";
				removeClass(wrapper, 'hidden');
			}
			this.hide = ()=>{
				parentPlayer.externalControls.seekEnabled(hasExternalSeekEnabled);
				addClass(wrapper, 'hidden');
				setTimeout(()=>{
					wrapper.style.display = "none";
					if(parentPlayer.containers){
						parentPlayer.containers.show();
					}
					//parentPlayer.play();
				}, 200);
			}

			if(!autoplay || device.isMobile){
				this.show();
			}else{
				wrapper.style.display = "none";
			}

			parentPlayer.on('play', ()=>{
				this.hide();
			})

			this.backgroundColor = backgroundColorFN(wrapper);
			this.color = (c)=>{
				circle.style.stroke = triangle.style.stroke = c;
			}
		}
		return new bigPlayButton();
	})();
};