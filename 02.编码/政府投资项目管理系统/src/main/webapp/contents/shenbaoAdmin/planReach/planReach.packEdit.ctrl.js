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
    }]).controller('planReachPackEditCtrl', ["$state", "planReachSvc", planReachPackEditCtrl]);

    function planReachPackEditCtrl($state, planReachSvc) {
        var vm = this;
        vm.id = $state.params.id;//请求中的id参数
        vm.isStartProcess = $state.params.isStartProcess;//请求中的id参数
        vm.model = {};

        //        	planReachSvc.getPackPlanById(vm);
        planReachSvc.getUserUnit(vm);//获取当前登陆单位信息
        planReachSvc.getShenBaoInfoGridFromPackPlan(vm);

        planReachSvc.getPackPlanById(vm);
        vm.addProject = function () {
            //展示项目数据模态框
            $("#myModal").modal({
                backdrop: 'static',
                keyboard: true
            });
        };
        vm.startProcessOne = function (id) {
            planReachSvc.startProcessOne(vm, id);
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
        vm.addmoney = function (shenbaoId) {
            if (vm.gg[shenbaoId] == undefined) {
                vm.gg[shenbaoId] = 0;
            }
            if (vm.gt[shenbaoId] == undefined) {
                vm.gt[shenbaoId] = 0;
            }
//        		var gg_total = 0;
//        		var gt_total = 0;
//        		for (var int = 0; int < vm.gg.length; int++) {
//        			gg_total += vm.gg[int];
//
//				}
//        		for (var int = 0; int < vm.gt.length; int++) {
//        			gt_total += vm.gt[int];
//
//				}
//        		var test =  $("#capitalSum1").siblings();
//        		if(gt_total> vm.capitalSCZ_gtzj_TheYear){
//        			common.alert({
//                    	vm:vm,
//                    	msg:'申请资金数超过计划安排数!'
//                    });
//        		}else{
            planReachSvc.updateShnebaoInfo(vm, shenbaoId);
//        		}

        }

        $(".menu li a").removeClass("focus");
        $(".menu li a:eq(4)").addClass("focus");

        $(".menu li a").click(function () {
            $(".menu li a").removeClass("focus");
            $(this).addClass("focus");
        });
    }

})();