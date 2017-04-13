(function(){
	'use strict';
	angular.module('app').controller('indexCtrl',index);
	
	index.$inject = ['$location','indexSvc'];
	 
	function index($location,indexSvc){
		var vm = this;
		
		activate();
		function activate(){
			indexSvc.getArticle(vm,'announcement');
			indexSvc.getArticle(vm, 'policy');
			indexSvc.getArticle(vm, 'workGuide');
			indexSvc.getArticle(vm, 'form');
		}
	}
	
})();