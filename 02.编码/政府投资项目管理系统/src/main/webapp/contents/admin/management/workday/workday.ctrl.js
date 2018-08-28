(function () {
    'use strict';

    angular
        .module('app')
        .controller('workdayCtrl', workday);

    workday.$inject = ['$location','workdaySvc','$state','$scope']; 

    function workday($location, workdaySvc,$state,$scope) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.title = "";
    	vm.model={};
    	activate();
    	
    	
        function activate() {        	
        	init();
        }
        
		function init(){
			workdaySvc.getworkdays(vm);	
			
	        
		}
    }    
})();
