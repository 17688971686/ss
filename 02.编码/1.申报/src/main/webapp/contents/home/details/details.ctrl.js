(function(){
	'use strict';
	angular.module('app').controller('detailsCtrl',details);
	
	details.$inject = ['$location','$state','detailsSvc'];
	
	function details($location,$state,detailsSvc){
		var vm = this;
		var id = $state.params.id;
		activate();
		function activate () {
			detailsSvc.getArticle(vm,id);
		}
	}
})();