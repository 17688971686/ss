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
        $(".menu li a").removeClass("focus");
        $(".menu li a:eq(1)").addClass("focus");
        $(".menu li a").click(function(){
            $(".menu li a").removeClass("focus");
            $(this).addClass("focus");
        });

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
        	vm.allUnit = common.getUserUnits().value;
        	 var keys = [];
        	 vm.output = [];
        	 angular.forEach(vm.allUnit, function(item) {
		          var key = item["id"];
		          if(keys.indexOf(key) === -1) {
		              keys.push(key);
		              vm.output.push(item);
		          }
		      });
        	vm.submit=function(){
        		deptInfoMaintainSvc.getLoginUserUnitinfo(vm);//先查用户单位向信息
//            	deptInfoMaintainSvc.save(vm);//保存单位基本信息
            };
            
            vm.changeUnit = function(){
            	//获取select对象
                var myselect = document.getElementById('unitName');
             //获取选中项的索引
                var index = myselect.selectedIndex;
            //typd_data后台传入的数据 list为json对象
                var json = vm.output;
            //获取选中行中的字段
                vm.id = json[index-1].id;
            	deptInfoMaintainSvc.getUnitInfo(vm,vm.id);
            }
        }
    }
})();