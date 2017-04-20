(function () {
    'use strict';

    angular
        .module('app')
        .controller('perToDoCtrl', perToDo);

    perToDo.$inject = ['$location','perToDoSvc']; 

    function perToDo($location, perToDoSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '个人待办列表';
        
        vm.projectDetais = function(id){
        	common.alert(id);
        }

       
        activate();
        function activate() {
        	perToDoSvc.grid(vm);
        }
    }
})();