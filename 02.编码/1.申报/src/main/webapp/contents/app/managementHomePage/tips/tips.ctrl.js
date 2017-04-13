(function () {
    'use strict';

    angular
        .module('app')
        .controller('tipsCtrl', tips);

    tips.$inject = ['$location','tipsSvc']; 

    function tips($location, tipsSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '温馨提示列表';
        
        activate();
        function activate() {
        	tipsSvc.grid(vm);
        }
    }
})();