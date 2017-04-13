(function () {
    'use strict';

    angular
        .module('app')
        .controller('perHasDoneCtrl', perHasDone);

    perHasDone.$inject = ['$location','perHasDoneSvc']; 

    function perHasDone($location, perHasDoneSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '个人已办列表';
        
        vm.projectDetais = function(id){
        	common.alert(id);
        }

       
        activate();
        function activate() {
        	perHasDoneSvc.grid(vm);
        }
    }
})();