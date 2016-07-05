let fn_contextmenu = function(e) {
	e.stopPropagation();
	e.preventDefault();
	return false;
}
export default function contextMenu(el) {
	if (el) {
		this.disable = function() {
			el.addEventListener('contextmenu', fn_contextmenu);
		}
		this.enable = function() {
			el.removeEventListener('contextmenu', fn_contextmenu);
		}
	}
};