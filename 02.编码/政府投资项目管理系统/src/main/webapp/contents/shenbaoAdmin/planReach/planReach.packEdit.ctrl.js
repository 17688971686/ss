(function () {
    'use strict';

    angular.module('app').config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('planReachPackEdit', {
            url: '/planReach/packPlan/addProject/:id/:isStartProcess',
            params: {"id": null},
            templateUrl: '/shenbaoAdmin/planReach/html/packPlan',
            controller: 'planReachPackEditCtrl',
            controllerAs: 'vm'
        });
    }]).controller('planReachPackEditCtrl', ["$state", "planReachSvc","bsWin", planReachPackEditCtrl]);

    function planReachPackEditCtrl($state, planReachSvc,bsWin) {
        var vm = this;
        vm.id = $state.params.id;//请求中的id参数
        vm.isStartProcess = $state.params.isStartProcess;//请求中的id参数
        vm.model = {};
        vm.gg = {};
        vm.gt = {};
        vm.pa = {};
        vm.isSubmit = false;

        //        	planReachSvc.getPackPlanById(vm);
        //获取当前登陆单位信息
        planReachSvc.getUserUnit(vm, function () {
            planReachSvc.shenbaoInfoGrid(vm);
        });
        planReachSvc.getShenBaoInfoGridFromPackPlan(vm);

        planReachSvc.getPackPlanById(vm);

        //项目批量选择
        $(document).on('click', '#projects', function () {
            var isSelected = $(this).is(':checked');
            $('.projectsGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
        });
        $('#myModal').on('show.bs.modal', function (e) {
            vm.gridOptions_shenbaoInfo.dataSource.read();
        });

        vm.startProcessOne = function (id) {
//        	 common.initJqValidation();
//             var isValid = $('form').valid();
//             if (isValid) {
            	 planReachSvc.startProcessOne(vm, id);
//             }
        };

        vm.deleteProcessOne = function (id) {
            planReachSvc.deleteProcessOne(vm, id);
        };
        //打包信息点击添加项目模态框确认按钮
        vm.dialogConfirmSubmit_shenBaoInfo_plan = function () {
            //获取选中的申报信息的id
            var selectIds = common.getKendoCheckId('.projectsGrid');
            if (selectIds.length == 0) {
                common.alert({
                    vm: vm,
                    msg: '请选择数据!'
                });
            } else {
                var ids = [];
                for (var i = 0; i < selectIds.length; i++) {
                    ids.push(selectIds[i].value);
                }
                var idStr = ids.join(',');
                $('#myModal').modal('toggle');//关闭模态框
                planReachSvc.addShenBaoInfoToPack(vm, idStr);//添加申报信息到计划下达中
            }
        };

        vm.projectDeletes = function () {
            //获取选中的申报信息的id
            var selectIds = common.getKendoCheckId('.grid');
            if (selectIds.length == 0) {
                common.alert({
                    vm: vm,
                    msg: '请选择数据!'
                });
            } else {
                var ids = [];
                for (var i = 0; i < selectIds.length; i++) {
                    ids.push(selectIds[i].value);
                }
                var idStr = ids.join(',');
                planReachSvc.deletePlanShenBaoInfo(vm, idStr);//添加申报信息到计划下达中
            }
        };
        
        function format(val) {
    	    if (val == null || val == '' || val == 'undefined' || isNaN(val)) {
    	        return 0;
    	    }
    	    return  val.toFixed("4");
        }
        
        vm.addmoney = function (shenbaoId ,num1,num2) {
        	if(num1 == null ||
        			num2 == null ){
    			bsWin.success("请正确填写资金！");
    		}else{
    			for (var int = 0; int < vm.model.shenBaoInfoDtos.length; int++) {
    				var array_element = vm.model.shenBaoInfoDtos[int];
    				if(shenbaoId==array_element.id){
    					array_element.sqPlanReach_ggys = num1;
    					array_element.sqPlanReach_gtzj = num2;
    					if(num1 + num2 +array_element.apInvestSum > array_element.projectInvestSum){
    						vm.isSubmit = true;
    						bsWin.success("申请资金+累计投资超过总投资,请重新填写！");
    					}else{
    						vm.isSubmit = false;
    						planReachSvc.updateShnebaoInfo(vm,array_element);
    					}
    				}
    			}
    		}
        }

        $(".menu li a").removeClass("focus");
        $(".menu li a:eq(4)").addClass("focus");

        $(".menu li a").click(function () {
            $(".menu li a").removeClass("focus");
            $(this).addClass("focus");
        });
    }

})();