(function () {
    'use strict';

    angular
        .module('app')
        .controller('monthReportCtrl', monthReport);

    monthReport.$inject = ['$location','monthReportSvc']; 

    function monthReport($location,monthReportSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '项目列表';
        vm.titleReportSelect = '月报查看月份选择';
        vm.titleReportInfo = '月报详情';
        
        vm.lookReport = function(month){
        	//TODO 判断月份
        	
        	//跳转到月报详情页面
        	location.href = "#/monthReportDetais/"+month;
        }
        
        vm.remind = function(id){
        	alert("项目月报催辦："+id);  //--測試用
        }
        
        
        activate();
        function activate() {
        	monthReportSvc.grid(vm);
        }
    }
})();