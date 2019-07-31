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
        	vm.allUnit = common.getUserUnits();
        	vm.allUnitName = ["区纪委监委机关","区委办公室、区政府办公室","区委组织部","区委宣传部","区教育局","光明公安分局",
                "区民政局","市规划和自然资源局光明管理局","市生态环境局光明管理局","区住房建设局","市交通运输局光明管理局",
                "区水务局","区文化广电旅游体育局","区卫生健康局","区应急管理局","区城管和综合执法局",
                "区政务服务数据管理局","区规划土地监察局","光明街道办事处","公明街道办事处","新湖街道办事处","凤凰街道办事处",
                "玉塘街道办事处","马田街道办事处","区建筑工务署","区科学城开发建设署","光明消防大队"];
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