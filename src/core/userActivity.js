import {isStrictNumeric} from '../helpers/utils'; 
export default function(parentPlayer, settings = {timeout: 2000}) {
	return (function() {
		let userActivity = function(){
			let isMobile = parentPlayer.device.isMobile;
			let timer = 0;
			let tid = null;
			let idle = true;
			let player = parentPlayer.wrapper;
			let forced = false;
			let timeoutDefault = settings.timeout;
			let check = ()=>{
				if(forced) return;
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
					player.addEventListener('keyup', check);	
				}				
			}
			this.unwatch=()=>{
				if(isMobile){
					player.removeEventListener('touchstart', check);
					player.removeEventListener('touchmove', check);
				}else{
					player.removeEventListener('mousemove', check);
					player.removeEventListener('keyup', check);
				}
				clearTimeout(tid);
			}
			this.watch();
			this.idle = (v)=>{
				if(v!=null){
					v = !!v;
					if(v) {
						parentPlayer.emit('user-is-idle');
						this.unwatch();
					}else{
						parentPlayer.emit('user-not-idle');
						this.watch();
					}
					forced = true;
					idle = v;
				}
				return idle;
			}
			this.reset =()=>{
				forced = false;
				idle = true;
			}
			this.timeout = (v)=>{
				if(isStrictNumeric(v)){
					console.log(v);
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