(function () {
    'use strict';

    angular.module('app').config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('planReachEdit', {
            url: '/planReachEdit/:id/:isStartProcess/:isCan',
            params: {"id": null},
            templateUrl: '/shenbaoAdmin/planReach/html/edit',
            controller: 'planReachEditCtrl',
            controllerAs: 'vm'
        })
    }]).controller('planReachEditCtrl', ["$state", "planReachSvc", "bsWin",'$scope', planReachEditCtrl]);

    function planReachEditCtrl($state, planReachSvc, bsWin,$scope) {
        var vm = this;
        vm.id = $state.params.id;//请求中的id参数
        vm.isStartProcess = $state.params.isStartProcess;//请求中的id参数
        vm.isCan = $state.params.isCan;
        vm.model = {};
        vm.gg = {};
        vm.gt = {};
        vm.pa = {};
        vm.isSubmit = false;

        if (vm.id) {
            planReachSvc.getApplicationById(vm);
            vm.title = "编辑申请表";
        } else {
            vm.title = "新增申请表";
        }
        //获取当前登陆单位信息
        planReachSvc.getUserUnit(vm, function () {
            planReachSvc.projectGrid(vm);//获取项目数据
            planReachSvc.packGrid(vm);//获取打包类数据
        });
        planReachSvc.getShenBaoInfoFromPlanReachApplicationGrid(vm);//获取计划下达中的申报项目
        planReachSvc.getPackFromPlanGrid(vm);//获取计划下达中的打包计划
        //项目批量选择
        $(document).on('click', '#projects', function () {
            var isSelected = $(this).is(':checked');
            $('.projectsGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
        });

        var shenbaogrid = $('#shenbaogrid').on('click', '#checkboxAll', function () {
            var isSelected = $(this).is(':checked');
            shenbaogrid.find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
        });

        var packgrid = $('#packgrid').on('click', '#checkboxAll', function () {
            var isSelected = $(this).is(':checked');
            packgrid.find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
        });

        $('#myModal').on('show.bs.modal', function (e) {
            vm.gridOptions_project.dataSource.read();
        });
        $('#packModal').on('show.bs.modal', function (e) {
            vm.gridOptions_pack.dataSource.read();
        })

        vm.startProcessOne = function (id) {
        	 common.initJqValidation();
             var isValid = $('form').valid();
             if (isValid) {
            	 planReachSvc.startProcessOne(vm, id);
             }
        };
        vm.deleteProcessOne = function (id) {
            planReachSvc.deleteProcessOne(vm, id);
        };

        vm.checkLength = function(obj,max,id){
            common.checkLength(obj,max,id);
        };
        vm.projectDeletes = function () {
            //获取选中的申报信息的id
            var selectIds = common.getKendoCheckId(shenbaogrid);
            if (selectIds.length == 0) {
                bsWin.warning('请选择数据!');
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
            var selectIds = common.getKendoCheckId(packgrid);
            if (selectIds.length == 0) {
                bsWin.warning('请选择数据!');
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
        };
        // vm.addPack = function () {
        //     //展示包含本单位的打包类计划
        //     $("#packModal").modal({
        //         backdrop: 'static',
        //         keyboard: true
        //     });
        // };

        //点击添加项目模态框确认按钮
        vm.dialogConfirmSubmit_shenBaoInfo = function () {
            //获取选中的申报信息的id
            var selectIds = common.getKendoCheckId('.projectsGrid');
            if (selectIds.length == 0) {
                bsWin.warning('请选择数据!');
            } else {
                var ids = [];
                for (var i = 0; i < selectIds.length; i++) {
                    ids.push(selectIds[i].value);
                }
                var idStr = ids.join(',');
                planReachSvc.addShenBaoInfoToPlanReach(vm, idStr);//添加申报信息到计划下达中
            }
        };

        //点击添加打包计划模态框确认按钮
        vm.dialogConfirmSubmit_packPlan = function () {
            //获取选中的申报信息的id
            var selectIds = common.getKendoCheckId('.packsGrid');
            if (selectIds.length == 0) {
                bsWin.warning('请选择数据!');
            } else {
                var ids = [];
                for (var i = 0; i < selectIds.length; i++) {
                    ids.push(selectIds[i].value);
                }
                var idStr = ids.join(',');
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
                bsWin.warning('申请资金大于安排资金，请重新输入！');
            }
        };
        //批量添加申请的项目
        vm.confirmProjects = function () {
            var selectIds = common.getKendoCheckId('.projectsGrid');
            if (selectIds.length == 0) {
                bsWin.warning('请选择数据!');
            } else {
                for (var i = 0; i < selectIds.length; i++) {
                    vm.confirmProject(selectIds[i].value.split(",")[0], selectIds[i].value.split(",")[1], selectIds[i].value.split(",")[2] == "true" ? true : false,
                        selectIds[i].value.split(",")[3], selectIds[i].value.split(",")[4]);
                }
            }
        };

        //添加打包计划
        vm.confirmPack = function (name, totalMoney, year) {
            vm.model.packPlanDtos = vm.model.packPlanDtos || [];
            vm.model.packPlanDtos.push({
                name: name,
                totalMoney: totalMoney,
                capital_ggys: '',
                capital_gtzj: '',
                year: year
            });
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

        vm.getShenBaoInfo = function(shenbaoId){
            planReachSvc.getShenBaoInfoById(vm,shenbaoId);
        }

        vm.editShenBaoInfo = function(shenbaoId){
            planReachSvc.updateShenBaoInfo(vm);
        }

        $(".menu li a").removeClass("focus");
        $(".menu li a:eq(4)").addClass("focus");

        $(".menu li a").click(function () {
            $(".menu li a").removeClass("focus");
            $(this).addClass("focus");
        });

        vm.exprotExcel =function(){
            location.href = common.format("/shenbaoAdmin/planReach/exportExcelForDL?id={0}",vm.id);
        };

        //选择上传文件验证文件大小
        vm.onSelect=function(e){
            $.each(e.files, function (index, value) {
                if(value.size > common.basicDataConfig().uploadSize){
                    $scope.$apply(function(){
                        common.alert({
                            vm : vm,
                            msg : "上传文件过大！"
                        });
                    });
                }

            });
        };

        //文件上传成功
        vm.uploadSuccess=function(e){
            var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
            if(e.XMLHttpRequest.status==200){
                angular.forEach(eval("("+e.XMLHttpRequest.response+")").data, function (fileObj, index) {
                    $scope.$apply(function() {
                        if(vm.model.attachmentDtos){
                            vm.model.attachmentDtos.push({
                                name: fileObj.originalFilename,
                                url: fileObj.randomName,
                                type: type
                            });
                        } else {
                            vm.model.attachmentDtos = [{
                                name: fileObj.originalFilename,
                                url: fileObj.randomName,
                                type: type
                            }];
                        }
                    });
                })
            }
        };

        //扫描文件上传配置
        vm.uploadOptions={
            async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
            error:vm.uploadError,
            success:vm.uploadSuccess,
            localization:{select:'上传文件'},
            showFileList:false,
            multiple:false,
            validation: {
                maxFileSize: common.basicDataConfig().uploadSize
            },
            select:vm.onSelect
        };

        //删除上传文件
        vm.delFile=function(idx){
            var file = vm.model.attachmentDtos[idx];
            if(file){
                vm.model.attachmentDtos.splice(idx,1);
            }
        };

        //备注模态框的上传成功
        vm.uploadFileSuccess=function(e){
            var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
            if(e.XMLHttpRequest.status==200){
                angular.forEach(eval("("+e.XMLHttpRequest.response+")").data, function (fileObj, index) {
                    $scope.$apply(function() {
                        if(vm.model.shenBaoInfo.attachmentDtos){
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
        vm.uploadFile={
            async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
            error:vm.uploadError,
            success:vm.uploadFileSuccess,
            localization:{select:'上传文件'},
            showFileList:false,
            multiple:false,
            validation: {
                maxFileSize: common.basicDataConfig().uploadSize
            },
            select:vm.onSelect
        };
        //备注模态框删除上传文件
        vm.delFile=function(idx){
            var file = vm.model.shenBaoInfo.attachmentDtos[idx];
            if(file){
                vm.model.shenBaoInfo.attachmentDtos.splice(idx,1);
            }
        };
    }

})();