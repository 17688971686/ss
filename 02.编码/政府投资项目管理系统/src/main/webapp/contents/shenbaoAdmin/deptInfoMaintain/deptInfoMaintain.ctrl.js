(function () {
    'use strict';

    angular
        .module('app')
        .controller('deptInfoMaintainCtrl', deptInfoMaintain);

    deptInfoMaintain.$inject = ['$location','deptInfoMaintainSvc']; 

    function deptInfoMaintain($location, deptInfoMaintainSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.page = "index";
        
        function init(){
	    	//基础数据--单位性质
	        vm.basicData_unitProperty=common.getBacicDataByIndectity(common.basicDataConfig().unitProperty);        	
	        //基础数据--行政区划街道
	        vm.basicData_area_Street=$linq(common.getBasicData())
									.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
									.toArray();
        }
               
        activate();
        function activate() {
        	init();
        	if(vm.page == 'index'){
        		page_index();
        	}
        }
        
        function page_index(){
        	deptInfoMaintainSvc.getDeptInfo(vm);//获取单位的基本信息
        	
        	vm.submit=function(){
            	deptInfoMaintainSvc.save(vm);//保存单位基本信息
            };
        }
    }
})();