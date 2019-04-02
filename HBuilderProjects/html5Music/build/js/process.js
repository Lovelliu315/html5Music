(function($, root){
	var $scope = $(document.body);
	var curDuration;
	var lastPer = 0;
	var frameId;
	var startTime;
	function formatTime(duration){
		var duration = Math.round(duration);
		var minute = Math.floor(duration / 60);
		var second = duration - minute * 60;
		if(minute < 10){
			minute = "0" + minute;
		}
		
		if(second < 10){
			second = "0" + second;
		}
		
		return minute + ':' + second
	}
	
	function renderAllTime(duration){
		lastPer = 0;
		curDuration = duration;
		var allTime = formatTime(duration);
		$scope.find(".all-time").html(allTime);
	}
	
	//更新已播放时间和进度条
	function update(percent){
		var curTime = percent * curDuration;
		curTime = formatTime(curTime);
		$scope.find('.cur-time').html(curTime);
		var per = (percent - 1) * 100 + '%';
		$scope.find('.pro-top').css({
			transform: "translateX("+per+")"
		})
	}
	
	function start(){
		//开始播放时间
		startTime = new Date().getTime();
		cancelAnimationFrame(frameId);
		//每隔16.7ms执行一次
		function frame(){
			var curTime = new Date().getTime();
			var percent = lastPer + (curTime - startTime) / (curDuration * 1000)
			if(percent < 1){
				frameId = requestAnimationFrame(frame);
				update(percent);
			}else{
				cancelAnimationFrame(frameId);
				$scope.find(".next-btn").trigger("click");
			}
			
		}
		frame()
	}
	
	function stop(){
		var stopTime = new Date().getTime();
		console.log(lastPer);
		lastPer = lastPer + (stopTime - startTime) / (curDuration * 1000)
		cancelAnimationFrame(frameId)
	}
	
	root.process = {
		renderAllTime: renderAllTime,
		update: update,
		start: start,
		stop: stop
	}
	
	
})(window.Zepto, window.player || {})
