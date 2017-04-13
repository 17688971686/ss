(function () {
    'use strict';

    angular
        .module('app')
        .controller('suggestFeedbackCtrl', suggestFeedback);

    suggestFeedback.$inject = ['$location','suggestFeedbackSvc']; 

    function suggestFeedback($location, suggestFeedbackSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '建议反馈列表';
        
        activate();
        function activate() {
        	suggestFeedbackSvc.grid(vm);
        }
    }
})();