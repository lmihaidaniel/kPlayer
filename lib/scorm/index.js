//FOR DOCUMENTATION
//
//https://pipwerks.com/laboratory/scorm/api-wrapper-javascript/
//
//
import pipwerks from 'pipwerks-scorm-api-wrapper';
import deepmerge from '../helpers/deepmerge';
import {
	formatTime
} from './utils';
import scormParams from './parameters';
//import Storage from '../helpers/storage';

let SCORM = pipwerks.SCORM;
let _param = scormParams("1.2");

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
	done: false,
}

export default class Scorm {
	constructor() {
			this._scorm = null;
			this.state = {
				finished: false
			}
			this.version = '1.2';
			this.init();
			this.student = {
				id: this.getParameter(_param('id')),
				name: this.getParameter(_param('name'))
			};
			this.data = deepmerge(defaults, this.suspend_data());
			window.onunload = (event) => {
				this.quit();
			};
			window.onbeforeunload = (event) => {
				this.quit();
			};
		}

	/**
	 * [init description]
	 * @return {[type]} [description]
	 */
	init() {
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
			this.setParameter(_param('score.max'), 100);
			// var status = sco.get("cmi.core.lesson_status");
			// if(status != "completed"){
			//   success = sco.set("cmi.core.lesson_status", "completed");
			//   if(success){
			//      sco.quit();
			//   }
			// }
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
		//this.suspend_data(JSON.stringify(this.data));
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

	/**
	 * [score description]
	 * @param  {[type]} v [description]
	 * @return {[type]}   [description]
	 */
	score(v) {
		if (!this.state.finished) {
			if (v != null) {
				const score = parseInt(v, 10);
				let r = this.setParameter(_param('score.raw'), score);
				this.commit();
				return r;
			} else {
				return parseInt(this.getParameter(_param('score.raw'), 10));
			}
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
		let lng = this.getParameter("cmi.student_preference.language") || defaults.lng;
		return lng.slice(0, 2).toLowerCase();
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
						let r = this.setParameterParameter(_param('session_time'), formatTime(sessionTime));
						//doLMSCommit();
						this.commit();
						return r;
					}
					return false;
				}
				return this.getParameterParameter(_param('session_time'));
			}
		}

	/**
	 * Exit
	 * @description exit and close window
	 */
	close() {
		this.finish();
		if (this.state.finished) {
			window.top.close();
		}
	}

	/**
	 * Finish
	 * @description finish
	 */
	finish() {
		if (!this.state.finished) {
			if (SCORM.quit()) {
				this.state.finished = true;
			}
		}
	}
}