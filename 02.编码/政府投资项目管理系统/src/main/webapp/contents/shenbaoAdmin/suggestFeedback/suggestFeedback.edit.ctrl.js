(function () {
    'use strict';

    angular
        .module('app')
        .controller('suggestFeedbackEditCtrl', suggestFeedback);

    suggestFeedback.$inject = ['$location','suggestFeedbackSvc']; 

    function suggestFeedback($location, suggestFeedbackSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '建议反馈数据编辑';
        vm.titleDetais = '建议反馈数据详情';
        
      
        
       
    }
})();