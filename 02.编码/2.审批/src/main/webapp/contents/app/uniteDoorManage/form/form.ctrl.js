(function () {
    'use strict';

    angular
        .module('app')
        .controller('formCtrl', form);

    form.$inject = ['$location','formSvc']; 

    function form($location, formSvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '常用表格列表';
        
        activate();
        function activate() {
            formSvc.grid(vm);
        }
    }
})();
