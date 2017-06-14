(function () {
    'use strict';

    angular
        .module('app')
        .controller('monthReportCtrl', monthReport);

    monthReport.$inject = ['$location','monthReportSvc','$state','$scope']; 

    function monthReport($location, monthReportSvc,$state,$scope) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.model={};    
    	vm.page='list';
        vm.init=function(){   
        	if($state.current.name=='monthReport_details'){
        		vm.page='details';
        		vm.projectId=$state.params.projectId;
        		vm.year=$state.params.year;
        		vm.month=$state.params.month;
        	}
        }//end init
        
        activate();
        function activate() {
        	vm.init();
        	if(vm.page=='list'){
        		monthReportSvc.grid(vm);
        	}
        	if(vm.page=='details'){       		
        		page_details();
        	}
            
        }
        
        function page_details(){
        	//begin#基础数据
        	//批复类型
         	vm.basicData_approvalType=$linq(common.getBasicData())
    		  .where(function(x){return x.identity=='approvalType'&&x.pId=='approvalType';})
    		  .toArray();
         	//项目进度
         	vm.basicData_projectProgress=$linq(common.getBasicData())
    		  .where(function(x){return x.identity=='projectProgress'&&x.pId=='projectProgress';})
    		  .toArray();
        	//begin#上传类型
         	vm.uploadType=[['scenePicture','现场图片'],['other','其它材料']];
        	monthReportSvc.getProjectById(vm);
        }
        
        
    }
})();
