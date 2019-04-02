var $ = window.Zepto;
var root = window.player;
var $scope = $(document.body);

var index = 0;
var songList, controlManager;
var audio = new root.audioControl();
function bindEvent(){
	$scope.on("click", ".prev-btn", function(){
//		if(index === 0){
//			index = songList.length - 1
//		}else{
//			index--;
//		}
		index = controlManager.prev(songList[index])
		console.log(index)
		root.render(songList[index]);
	});
	
	$scope.on("click", ".next-btn", function(){
//		if(index === songList.length - 1){
//			index = 0
//		}else{
//			index++;
//		}
		index = controlManager.next(songList[index])
		root.render(songList[index]);
		$scope.trigger("play:change")
		console.log(index)
	})	
	$scope.on("click", ".play-btn", function(){
		if(audio.status == "play"){
			audio.pause();
			root.process.stop();
		}else{
			audio.play();
			root.process.start();
		}
		$(this).toggleClass("pause");
	})
	
	$scope.on("play:change", function(){
		audio.getAudio(songList[index].audio);
		if(audio.status == "play"){
			audio.play();
			root.process.start();
		}
		root.process.renderAllTime(songList[index].duration);
		root.process.update(0);
	})
	
}

function bindTouch(){
	var $slider = $scope.find(".slider-pointer");
	var offset = $scope.find(".pro-wrapper").offset();
	var left = offset.left;
	var width = offset.width;
	$slider.on('touchstart', function(){
		root.process.stop();
	}).on('touchmove', function(e){
		var x = e.changedTouches[0].clientX;
		var per = (x - left) / width;
		if(per < 0 ){
			per = 0;
		}
		if(per > 1){
			per = 1;
		}
		root.process.update(per);
	}).on('touchend', function(e){
		var x = e.changedTouches[0].clientX;
		var per = (x - left) / width;
		if(per < 0 ){
			per = 0;
		}
		if(per > 1){
			per = 1;
		}
		var curDuration = songList[index].duration;
		var curTime = per * curDuration;
		audio.playTo(curTime);
		$scope.find(".play-btn").addClass("playing");
	})
}

function getData(url){
	$.ajax({
		type: "GET",
		url: url,
		success: function(data){
			
			songList = data;
			bindEvent();
			bindTouch();
			controlManager = new root.controlManager(songList.length)
			root.render(songList[index]);
			$scope.trigger("play:change");
		},
		error: function(){
			console.log("error")
		}
		
	})
}



getData("../mock/data.json");