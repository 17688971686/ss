(function () {
    'use strict';

    angular.module('app').config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('planReachEdit', {
            url: '/planReachEdit/:id/:isStartProcess',
            params: {"id": null},
            templateUrl: '/shenbaoAdmin/planReach/html/edit',
            controller: 'planReachEditCtrl',
            controllerAs: 'vm'
        })
    }]).controller('planReachEditCtrl', ["$state", "planReachSvc", planReachEditCtrl]);

    function planReachEditCtrl($state, planReachSvc) {
        var vm = this;
        vm.id = $state.params.id;//请求中的id参数
        vm.isStartProcess = $state.params.isStartProcess;//请求中的id参数
        vm.model = {};

        if (vm.id) {
            planReachSvc.getApplicationById(vm);
            vm.title = "编辑申请表";
        } else {
            vm.title = "新增申请表";
        }
        planReachSvc.getUserUnit(vm);//获取当前登陆单位信息
        planReachSvc.getShenBaoInfoFromPlanReachApplicationGrid(vm);//获取计划下达中的申报项目
        planReachSvc.getPackFromPlanGrid(vm);//获取计划下达中的打包计划
        //项目批量选择
        $(document).on('click', '#projects', function () {
            var isSelected = $(this).is(':checked');
            $('.projectsGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
        });

        vm.startProcessOne = function (id) {
            planReachSvc.startProcessOne(vm, id);
        };
        vm.deleteProcessOne = function (id) {
            planReachSvc.deleteProcessOne(vm, id);
        };
        vm.addProject = function () {
            //展示项目数据模态框
            $("#myModal").modal({
                backdrop: 'static',
                keyboard: true
            });
        };

        vm.projectDeletes = function () {
            //获取选中的申报信息的id
            var selectIds = common.getKendoCheckId('.shenbaogrid');
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
                planReachSvc.deleteShenBaoInfo(vm, idStr);//添加申报信息到计划下达中
            }
        };

        vm.packDeletes = function () {
            //获取选中的申报信息的id
            var selectIds = common.getKendoCheckId('.packgrid');
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
                planReachSvc.deletePacks(vm, idStr);//添加申报信息到计划下达中
            }
        };

        //展示项目数据模态框 在打包计划中添加单列项目时使用
        vm.addProjectForPack = function () {
            planReachSvc.projectForPackGrid(vm);
            $("#projectModalForPack").modal({
                backdrop: 'static',
                keyboard: true
            });
        };
        vm.addPack = function () {
            //展示包含本单位的打包类计划
            $("#packModal").modal({
                backdrop: 'static',
                keyboard: true
            });
        };

        //点击添加项目模态框确认按钮
        vm.dialogConfirmSubmit_shenBaoInfo = function () {
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
                planReachSvc.addShenBaoInfoToPlanReach(vm, idStr);//添加申报信息到计划下达中
            }
        };

        //点击添加打包计划模态框确认按钮
        vm.dialogConfirmSubmit_packPlan = function () {
            //获取选中的申报信息的id
            var selectIds = common.getKendoCheckId('.packsGrid');
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
                console.log(idStr);
                $('#packModal').modal('toggle');//关闭模态框
                planReachSvc.addPackPlanToPlanReack(vm, idStr);//添加申报信息到计划中
            }
        };

        //检查已纳入年度计划的计划下达申请资金
        vm.checkNum_ggys = function (id, compared) {
            vm.unqualifiedNum_ggys = false;
            vm.unqualifiedNum_ggys = vm.checkNumber(compared, vm.formatNumber($("#ggys_" + id).val()));//比较大小
            vm.checkPlanReachNum();
        };
        vm.checkNum_gtzj = function (id, compared) {
            vm.unqualifiedNum_gtzj = false;
            vm.unqualifiedNum_gtzj = vm.checkNumber(compared, vm.formatNumber($("#gtzj_" + id).val()));
            vm.checkPlanReachNum();
        };
        vm.checkPlanReachNum = function () {//比较大小之后，给与提醒
            vm.unqualifiedNum = false;
            vm.unqualifiedNum = vm.unqualifiedNum_ggys || vm.unqualifiedNum_gtzj;
            if (vm.unqualifiedNum) {
                common.alert({
                    vm: vm,
                    msg: '申请资金大于安排资金，请重新输入！'
                });
            }
        };
        //批量添加申请的项目
        vm.confirmProjects = function () {
            var selectIds = common.getKendoCheckId('.projectsGrid');
            if (selectIds.length == 0) {
                common.alert({
                    vm: vm,
                    msg: '请选择数据!'
                });
            } else {
                for (var i = 0; i < selectIds.length; i++) {
                    vm.confirmProject(selectIds[i].value.split(",")[0], selectIds[i].value.split(",")[1], selectIds[i].value.split(",")[2] == "true" ? true : false,
                        selectIds[i].value.split(",")[3], selectIds[i].value.split(",")[4]);
                }
            }
        };

        //添加打包计划
        vm.confirmPack = function (name, totalMoney, year) {
            if (vm.model.packPlanDtos) {
                vm.model.packPlanDtos.push({
                    name: name,
                    totalMoney: totalMoney,
                    capital_ggys: '',
                    capital_gtzj: '',
                    year: year
                });
            } else {
                vm.model.packPlanDtos = [{
                    name: name,
                    totalMoney: totalMoney,
                    capital_ggys: '',
                    capital_gtzj: '',
                    year: year
                }];
            }
        };

        vm.addmoney = function (shenbaoId) {
            if (vm.gg[shenbaoId] == undefined) {
                vm.gg[shenbaoId] = 0;
            }
            if (vm.gt[shenbaoId] == undefined) {
                vm.gt[shenbaoId] = 0;
            }
            planReachSvc.updateShnebaoInfo(vm, shenbaoId);
        }
        //移除打包计划
        vm.removePack = function (idx) {
            vm.model.packPlanDtos.splice(idx, 1);
        };

        //移除打包计划中的申报项目
        vm.removeProjectForPack = function (idx) {
            vm.model.packPlanDtos.shenBaoInfoDtos.splice(idx, 1);
        };

        //移除申请的项目
        vm.removeProject = function (idx) {
            vm.model.shenBaoInfoDtos.splice(idx, 1)
        };
        //确认新增申请
        vm.addApplication = function () {
            planReachSvc.createApplication(vm);
        };
        //确认更新申请
        vm.editApplication = function () {
            planReachSvc.updateApplication(vm);
        };

        $(".menu li a").removeClass("focus");
        $(".menu li a:eq(4)").addClass("focus");

        $(".menu li a").click(function () {
            $(".menu li a").removeClass("focus");
            $(this).addClass("focus");
        });
    }

})();