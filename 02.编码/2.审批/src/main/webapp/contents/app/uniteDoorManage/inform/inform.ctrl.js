(function () {
    'use strict';

    angular
        .module('app')
        .controller('informCtrl', inform);

    inform.$inject = ['$location','informSvc']; 

    function inform($location, informSvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '通知公告列表';
        

        activate();
        function activate() {
            informSvc.grid(vm);
        }
    }
})();
