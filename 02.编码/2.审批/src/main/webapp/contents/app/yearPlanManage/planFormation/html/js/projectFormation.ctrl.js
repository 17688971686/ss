(function () {
    'use strict';

    angular
        .module('app')
        .controller('projectFormationCtrl', projectFormation);

    projectFormation.$inject = ['$location','projectFormationSvc']; 

    function projectFormation($location, projectFormationSvc) {
        /* jshint validthis:true */
    	var vm = this;
      
        
        activate();
        function activate() {
            projectFormationSvc.grid(vm);
        }
    }
})();
