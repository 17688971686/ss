(function () {
    'use strict';

    angular
        .module('app')
        .controller('monthReportCtrl', monthReport);

    monthReport.$inject = ['$location','monthReportSvc']; 

    function monthReport($location,monthReportSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '项目月报列表';
        
        vm.remind = function(id){
        	alert("项目月报催辦："+id);  //--測試用
        }
        
        vm.edit = function(id){
        	alert("項目月報編輯："+id); //--測試用
        }
        
        vm.dels = function(ids){
        	alert("批量刪除項目月報："+ids);  //--測試用
        }
        
        activate();
        function activate() {
        	monthReportSvc.grid(vm);
        }
    }
})();