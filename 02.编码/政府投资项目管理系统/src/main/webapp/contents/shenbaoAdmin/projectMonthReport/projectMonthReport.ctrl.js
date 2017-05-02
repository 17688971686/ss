(function () {
    'use strict';

    angular
        .module('app')
        .controller('projectMonthReportCtrl', projectMonthReport);

    projectMonthReport.$inject = ['$location','projectMonthReportSvc']; 

    function projectMonthReport($location, projectMonthReportSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '项目月报列表';
        vm.titleFill = '项目月报填报选择';
        vm.titleFillInfo = '项目月报填报信息录入';
        
        //列表中的填报按钮
        vm.fill = function (id) {  
        	//alert("这是项目月报填写页面："+id);   //--测试用
       	 	//跳转到填报月报的月份选择页面
        	location.href = "#/projectMonthReportFill/"+id;
         
       }
       //月报信息填写页面
        vm.fillReport = function(type){
        	//alert("这是项目月报填写页面第"+type+"月");   //--测试用
        	//跳转到月报信息填写页面
        	location.href = "#/projectMonthReportInfoFill/"+type;
        }
        activate();
        function activate() {
        	projectMonthReportSvc.grid(vm);
        }
    }
})();