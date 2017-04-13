(function () {
    'use strict';

    angular
        .module('app')
        .controller('remindersCtrl', reminders);

    reminders.$inject = ['$location','remindersSvc']; 

    function reminders($location, remindersSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '项目催办列表';
           
        activate();
        function activate() {
        	remindersSvc.grid(vm);
        }
    }
})();