(function () {
    'use strict';

    angular.module('app').config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('planReachPackEdit', {
            url: '/planReach/packPlan/addProject/:id/:isStartProcess/:planReachId/:isCan',
            params: {"id": null},
            templateUrl: '/shenbaoAdmin/planReach/html/packPlan',
            controller: 'planReachPackEditCtrl',
            controllerAs: 'vm'
        });
    }]).controller('planReachPackEditCtrl', ["$state", "planReachSvc", "bsWin", '$scope', planReachPackEditCtrl]);

    function planReachPackEditCtrl($state, planReachSvc, bsWin, $scope) {
        var vm = this;
        vm.id = $state.params.id;//请求中的id参数
        vm.planReachId = $state.params.planReachId;//请求中的id参数
        vm.isStartProcess = $state.params.isStartProcess;//请求中的id参数
        vm.isCan = $state.params.isCan;
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
        //获取建设单位名称
        vm.getUnitName = function (unitId) {
            return common.getUnitName(unitId);
        };

        vm.getTaskinfo = function (shenbaoId) {
            planReachSvc.getHistoryInfo(vm, shenbaoId);
        }

        //获取申报信息
        vm.getShenBaoInfo = function (shenbaoId) {
            planReachSvc.getShenBaoInfoById(vm, shenbaoId);
        }
        //更新申报信息
        vm.editShenBaoInfo = function (shenbaoId) {
            planReachSvc.updateShenBaoInfo(vm);
        }
        //项目批量选择
        $(document).on('click', '#projects', function () {
            var isSelected = $(this).is(':checked');
            $('.projectsGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
        });
        $('#myModal').on('show.bs.modal', function (e) {
            vm.gridOptions_shenbaoInfo.dataSource.read();
        });

        vm.startProcessOne = function (id) {
            // common.initJqValidation();
            // var isValid = $('form').valid();
            // if (isValid) {
                planReachSvc.startProcessOne(vm, id);
            // }
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
                planReachSvc.addShenBaoInfoToPack(vm, idStr, vm.planReachId);//添加申报信息到打包列表中
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
                planReachSvc.deletePlanShenBaoInfo(vm, idStr);//添加申报信息到打包列表中
            }
        };

        function format(val) {
            if (val == null || val == '' || val == 'undefined' || isNaN(val)) {
                return 0;
            }
            return val.toFixed("4");
        }

        vm.addmoney = function (shenbaoId, num1, num2) {
            if (num1 == null ||
                num2 == null) {
                bsWin.success("请正确填写资金！");
            } else {
                for (var int = 0; int < vm.model.shenBaoInfoDtos.length; int++) {
                    var array_element = vm.model.shenBaoInfoDtos[int];
                    if (shenbaoId == array_element.id) {
                        array_element.sqPlanReach_ggys = num1;
                        array_element.sqPlanReach_gtzj = num2;
                        if (num1 + num2 + array_element.apInvestSum > array_element.projectInvestSum) {
                            vm.isSubmit = true;
                            bsWin.success("申请资金+累计投资超过总投资,请重新填写！");
                        } else {
                            vm.isSubmit = false;
                            planReachSvc.updateShnebaoInfo(vm, array_element);
                        }
                    }
                }
            }
        }

        //备注模态框的上传成功
        vm.uploadFileSuccess = function (e) {
            var type = $(e.sender.element).parents('.uploadBox').attr('data-type');
            if (e.XMLHttpRequest.status == 200) {
                angular.forEach(eval("(" + e.XMLHttpRequest.response + ")").data, function (fileObj, index) {
                    $scope.$apply(function () {
                        if (vm.model.shenBaoInfo.attachmentDtos) {
                            vm.model.shenBaoInfo.attachmentDtos.push({
                                name: fileObj.originalFilename,
                                url: fileObj.randomName,
                                type: type
                            });
                        } else {
                            vm.model.shenBaoInfo.attachmentDtos = [{
                                name: fileObj.originalFilename,
                                url: fileObj.randomName,
                                type: type
                            }];
                        }
                    });
                })
            }
        };
        //备注模态框的上传
        vm.uploadFile = {
            async: {saveUrl: '/common/save', removeUrl: '/common/remove', autoUpload: true},
            error: vm.uploadError,
            success: vm.uploadFileSuccess,
            localization: {select: '上传文件'},
            showFileList: false,
            multiple: false,
            validation: {
                maxFileSize: common.basicDataConfig().uploadSize
            },
            select: vm.onSelect
        };
        //备注模态框删除上传文件
        vm.fileDelete = function (idx) {
            var file = vm.model.shenBaoInfo.attachmentDtos[idx];
            if (file) {
                vm.model.shenBaoInfo.attachmentDtos.splice(idx, 1);
            }
        };

        $(".menu li a").removeClass("focus");
        $(".menu li a:eq(4)").addClass("focus");

        $(".menu li a").click(function () {
            $(".menu li a").removeClass("focus");
            $(this).addClass("focus");
        });

        vm.exprotExcel = function () {
            location.href = common.format("/shenbaoAdmin/planReach/exportExcelForDB?id={0}", vm.id);
        };
    }

})();