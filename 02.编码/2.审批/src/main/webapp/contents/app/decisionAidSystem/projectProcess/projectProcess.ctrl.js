(function () {
    'use strict';

    angular
        .module('app')
        .controller('projectProcessCtrl', projectProcess);

    projectProcess.$inject = ['$location','projectProcessSvc']; 

    function projectProcess($location, projectProcessSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '项目全流程列表';
        

       
        activate();
        function activate() {
        	projectProcessSvc.grid(vm);
        }
    }
})();