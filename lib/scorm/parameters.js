export default function(version){
	let data = {
		"1.2": {
			id: "cmi.core.student_id",
			name: "cmi.core.student_name",
			language: "cmi.student_preference.language",
			audio: "cmi.student_preference.audio",
			location: "cmi.core.lesson_location",
			credit: "cmi.core.credit",
			entry: "cmi.core.entry",
			launch_data: "cmi.launch_data",
			lesson_mode: "cmi.core.lesson_mode",
			max_time_allowed: "cmi.student_data.max_time_allowed",
			session_time: "cmi.core.session_time",
			"score.min": "cmi.score.min",
			"score.max": "cmi.score.max",
			"score.raw": "cmi.score.raw",
			suspend_data: "cmi.suspend_data",
			total_time: "cmi.total_time"
		},
		"2004": {
			id: "cmi.learner_id",
			name: "cmi.learner_name",
			language: "cmi.learner_preference.language",
			audio: "cmi.learner_preference.audio_level",
			location: "cmi.location",
			credit: "cmi.credit",
			entry: "cmi.entry",
			launch_data: "cmi.launch_data",
			lesson_mode: "cmi.mode",
			max_time_allowed: "cmi.max_time_allowed",
			session_time: "cmi.session_time",
			"score.min": "cmi.score.min",
			"score.max": "cmi.score.max",
			"score.raw": "cmi.score.raw",
			suspend_data: "cmi.suspend_data",
			total_time: "cmi.total_time"
		}
	}
	return function(v){
		return data[version][v] || "";
	}
}