import {isStrictNumeric} from '../helpers/utils'; 
export default function(parentPlayer, settings = {timeout: 2000}) {
	return (function() {
		let userActivity = function(){
			let isMobile = parentPlayer.device.isMobile;
			let timer = 0;
			let tid = null;
			let idle = true;
			let player = parentPlayer.wrapper;
			let timeoutDefault = settings.timeout;
			let check = ()=>{
  				if (tid){
  					if(idle){
  						parentPlayer.emit('user-not-idle');
  					}
  					clearTimeout(tid);
  				}
  				idle = false;
  				tid = setTimeout(()=>{
				    idle = true;
				    parentPlayer.emit('user-is-idle');
				  }, settings.timeout);
			}
			this.watch=()=>{
				if(isMobile){
					player.addEventListener('touchstart', check);
					player.addEventListener('touchmove', check);
				}else{
					player.addEventListener('mousemove', check);
					window.addEventListener('keyup', check);	
				}				
			}
			this.unwatch=()=>{
				if(isMobile){
					player.removeEventListener('touchstart', check);
					player.removeEventListener('touchmove', check);
				}else{
					player.removeEventListener('mousemove', check);
					window.removeEventListener('keyup', check);
				}
				clearTimeout(tid);
			}
			this.watch();
			this.suspend = (v)=>{
				if(v!=null){
					v = !!v;
					if(v) {
						parentPlayer.emit('user-is-idle');
					}else{
						parentPlayer.emit('user-not-idle');
					}
					this.unwatch();
					idle = v;
				}
				return idle;
			}
			this.idle = (v)=>{
				if(v!=null){
					v = !!v;
					if(v) {
						parentPlayer.emit('user-is-idle');
					}else{
						parentPlayer.emit('user-not-idle');
					}
					idle = v;
	  				tid = setTimeout(()=>{
					    idle = true;
					    parentPlayer.emit('user-is-idle');
					  }, settings.timeout);
				}
				return idle;
			}
			this.resume =()=>{
				idle = true;
				this.watch();
			}
			this.timeout = (v)=>{
				if(isStrictNumeric(v)){
					settings.timeout = v;
				}else{
					settings.timeout = timeoutDefault;
				}
				return settings.timeout;
			}
		}
		return new userActivity();
	})();
};