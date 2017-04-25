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
        
        //查看月报详情
        vm.lookReport = function(month){
        	//跳转到月报详情页面
        	location.href = "#/monthReportDetais/"+month;
        }
        
        vm.remind = function(id){
        	alert("项目月报催辦："+id);  //--測試用
        }
        
        vm.batchAddFillMonthReport = function(){
        	var selectIds = common.getKendoCheckId('.grid');
        	if (selectIds.length == 0) {
            	common.alert({
                	vm:vm,
                	msg:'请选择数据'                	
                });
            } else {
            	var ids=[];
                for (var i = 0; i < selectIds.length; i++) {
                	ids.push(selectIds[i].value);
				}  
                var idStr=ids.join(',');
                alert("这是测试--批量添加填写月报："+idStr); //--测试用
            }   
        }
        
        vm.batchRemoveFillMonthReport = function(){
        	var selectIds = common.getKendoCheckId('.grid');
        	if (selectIds.length == 0) {
            	common.alert({
                	vm:vm,
                	msg:'请选择数据'                	
                });
            } else {
            	var ids=[];
                for (var i = 0; i < selectIds.length; i++) {
                	ids.push(selectIds[i].value);
				}  
                var idStr=ids.join(',');
                alert("这是测试--批量取消填写月报："+idStr); //--测试用
            }           
        }
                
        activate();
        function activate() {
        	monthReportSvc.grid(vm);
        }
    }
})();