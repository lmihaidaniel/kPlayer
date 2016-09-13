//FOR DOCUMENTATION
//
//https://pipwerks.com/laboratory/scorm/api-wrapper-javascript/
//
//
import pipwerks from 'pipwerks-scorm-api-wrapper';
import deepmerge from '../helpers/deepmerge';
import {
	isEl
} from '../helpers/dom';
import {
	formatTime
} from './utils';
import {isFunction} from '../helpers/utils';
import scormParams from './parameters';
//import Storage from '../helpers/storage';

let SCORM = pipwerks.SCORM;
let _param = scormParams();

let suspend_data = function() {
	let d = SCORM.get(_param('suspend_data'));
	if (d) {
		return JSON.parse(d);
	} else {
		return false;
	}
}

let defaults = {
	lng: 'fr',
	time: 0,
	location: null,
	done: false
}

export default class Scorm {
	constructor(cb) {
		this._scorm = null;
		this.state = {
			finished: false
		}
		this.version = '1.2';
		this.init(cb);
		this.student = {
			id: this.getParameter(_param('id')),
			name: this.getParameter(_param('name'))
		};
		this.__data = deepmerge(defaults, this.suspend_data());
		window.onunload = (event) => {
			this.finish();
		};
		window.onbeforeunload = (event) => {
			this.finish();
		};
	}

	data(d){
		let c = this.__data;
		if(d != null){
			c = deepmerge(this.__data, d);
			this.__data = c;
		}
		return c;
	}

	/**
	 * [init description]
	 * @return {[type]} [description]
	 */
	init(cb) {
		this.sco = SCORM;
		var success = SCORM.init();
		if (success) {
			this.version = SCORM.version;
			_param = scormParams(this.version);
			this.startDate = Date.now();
			/*
			//allready handled by the pipwerks.scorm wrapper
			const lessonStatus = this.status();
			if (lessonStatus === 'not attempted') {
				this.status("incomplete");
			}
			*/
			this.setParameter(_param('score.min'), 0);
			this.setParameter(_param('score.max'), this.scoreByVersion(100));
			// var status = sco.get("cmi.core.lesson_status");
			// if(status != "completed"){
			//   success = sco.set("cmi.core.lesson_status", "completed");
			//   if(success){
			//      sco.quit();
			//   }
			// }
			
			if (isFunction(cb)) cb(this);
		}
	}

	/**
	 * [setParameter description]
	 * @param {[type]} p [description]
	 * @param {[type]} v [description]
	 */
	setParameter(p, v) {
		return SCORM.set(p, v);
	}

	/**
	 * [getParameter description]
	 * @param  {[type]} p [description]
	 * @return {[type]}   [description]
	 */
	getParameter(p) {
		return SCORM.get(p);
	}

	/**
	 * [save description]
	 * @return {[type]} [description]
	 */
	save() {
		//this.time();
		this.suspend_data({});
		SCORM.save();
	}

	/**
	 * [commit description]
	 * @return {[type]} [description]
	 */
	commit() {
		//doLMSCommit();
		SCORM.save();
	}

	scoreByVersion(v){
		let c = v;
		if(this.version != '1.2'){
			c = v/10;
		}
		console.log(v);
		return c;
	}

	/**
	 * [score description]
	 * @param  {[type]} v [description]
	 * @return {[type]}   [description]
	 */
	score(v) {
		if (!this.state.finished) {
			if (v != null) {
				const score = parseInt(v, 10);
				let r = this.setParameter(_param('score.raw'), this.scoreByVersion(score));
				if(this.version != '1.2') {
					this.setParameter('cmi.score.scaled', this.scoreByVersion(score)/10);
				}
				console.log(r);
				this.commit();
				return r;
			} else {
				return parseInt(this.getParameter(_param('score.raw'), 10));
			}
		}
	}

	/**
	 * [credit description]
	 * @param  {[type]} v [description]
	 * @return {[type]}   [description]
	 */
	credit(v){
		if (!this.state.finished) {
			//credit,browsed
			if (v != null) {
				let r = this.setParameter(_param('credit'), v);
				this.commit();
				return r;
			}
			return this.getParameter(_param('credit'));
		}
	}

	/**
	 * [status description]
	 * @param  {[type]} v [description]
	 * @return {[type]}   [description]
	 */
	status(v) {
		if (!this.state.finished) {
			//passed,failed,completed,incomplete,browsed,not attempted
			if (v != null) {
				let r = SCORM.status('set', v);
				this.commit();
				return r;
			}
			return SCORM.status('get');
		}
	}

	/**
	 * [suspend_data description]
	 * @param  {[type]} p [description]
	 * @return {[type]}   [description]
	 */
	suspend_data(p) {
		if (!this.state.finished) {
			if (p != null) {
				//console.log(JSON.stringify(p));
				let r = SCORM.set(_param('suspend_data'), JSON.stringify(p));
				this.commit();
				return r;
			} else {
				return suspend_data() || {};
			}
		}
	}

	/**
	 * [language description]
	 * @param  {[type]} v [description]
	 * @return {[type]}   [description]
	 */
	language(v) {
		if (!this.state.finished) {
			if (v != null) {
				this.suspend_data(this.data({lng:v}));
			}else{
				let lng = this.getParameter(_param("language")) || defaults.lng;
				if (lng == '' || !lng || lng == null || lng == undefined) {
					this.data({lng : "fr"});
				}else{
					this.suspend_data(this.data({lng:lng.slice(0, 2).toLowerCase()}));
				}
			}
		}
	}

	/**
	 * [location description]
	 * @param  {[type]} v [description]
	 * @return {[type]}   [description]
	 */
	location(v) {
		if (!this.state.finished) {
			if (v != null) {
				let r = this.setParameter(_param('location'), v);
				this.commit();
				return r;
			}
			return this.getParameter(_param('location'))
		}
	}

	/**
	 * [time description]
	 * @param  {[type]} v [description]
	 * @return {[type]}   [description]
	 */
	time(v) {
		if (!this.state.finished) {
			if (v != null) {
				const sessionTime = Date.now() - this.startDate;
				if (sessionTime > 1000)  {
					let r = this.setParameter(_param('session_time'), formatTime(sessionTime));
					//doLMSCommit();
					this.commit();
					return r;
				}
				return false;
			}
			return this.getParameter(_param('session_time'));
		}
	}

	/**
	 * bindClose
	 * @description bindClose and close window
	 */
	bindClose(el) {
		if (isEl(el)) {
			el.addEventListener('click', () => {
				this.finish(function() {
					window.top.close();
				});
			});
		}
	}

	/**
	 * Finish
	 * @description finish
	 */
	finish(cb) {
		if (!this.state.finished) {
			this.time();
			this.save();
			if (SCORM.quit()) {
				this.state.finished = true;
				if (isFunction(cb)) cb();
			}
		}
	}
}