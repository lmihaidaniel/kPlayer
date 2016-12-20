export default function() {
	var laps = [];
	var StartMilliseconds = null;
	this.start = function() {
		this.pause();
		StartMilliseconds = new Date().getTime();
	};
	this.pause = function() {
		if (StartMilliseconds != null) {
			laps.push(new Date().getTime() - StartMilliseconds);
			StartMilliseconds = null;
		}
	};
	this.get = function() {
		var total = laps.reduce(function(a, b) {
			return a + b;
		}, 0);
		return {
			total: total,
			avg: total / laps.length
		}
	};
	this.reset = function() {
		laps = [];
		StartMilliseconds = null;
	};
	this.stop = function() {
		this.pause();
		return this.get();
	};
};