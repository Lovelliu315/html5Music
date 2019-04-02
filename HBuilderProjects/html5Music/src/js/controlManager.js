(function($, root){
	function controlManager(len){
		this.index = index;
		this.len = len
	}
	
	controlManager.prototype = {
		prev: function(){
			return this.getIndex(-1)
		},
		next: function(){
			return this.getIndex(1)
		},
		getIndex: function(val){
			var index = this.index;
			var len = this.len;
			var curIndex = (index + len + val) % len;
			this.index = curIndex;
			return curIndex
		}
	}
	
	root.controlManager = controlManager;
})(window.Zepto, window.player || {})
