(function () {
    'use strict';

    //设置一个全局查询条件,解决本功能页面跳转查询条件不被重置的问题
    var search_All = {};

    angular.module('app').controller('taskNewAuditCtrl', taskNewAudit);

    taskNewAudit.$inject = ['$location', 'taskNewAuditSvc', '$state', '$scope', '$sce', '$rootScope'];

    function taskNewAudit($location, taskNewAuditSvc, $state, $scope, $sce, $rootScope) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = "";
        vm.model = {};
        vm.search = {};
        vm.basicData = {};
        vm.page = "todoAuditList";
        vm.nextUsers = [];
        //任务处理--请求参数
        vm.id = $state.params.id;
        vm.isPass = "";
        //初始化参数
        vm.nextProcessRadio = "";
        vm.processStage_qianshou = common.basicDataConfig().processStage_qianshou;
        vm.processStage_kzshenhe = common.basicDataConfig().processStage_kzshenhe;
        vm.processStage_jbrbanli = common.basicDataConfig().processStage_jbrbanli;
        vm.processStage_weituopishen = common.basicDataConfig().processStage_weituopishen;
        vm.processState_niwendengji = common.basicDataConfig().processState_niwendengji;

        function init() {
            if ($state.current.name == 'task_todo_audit') {//待办列表--审批类
                vm.page = 'todoAuditList';
            }
            if ($state.current.name == 'task_handle_audit') {//处理页面--审批类
                vm.page = "handleAudit";
            }
            if ($state.current.name == 'task_handle_yuepi') {//处理页面--阅批
                vm.page = "handleYuepi";
            }
            if ($state.current.name == 'task_handle_keshi') {//处理页面--阅批
                vm.page = "handleKeshi";
            }
            if ($state.current.name == 'task_shenPi') {//已办列表--审批类
                vm.page = "complete_shenPi";
            }
            if ($state.current.name == 'task_shenPiDetails') {//审批类详细信息展示
                vm.page = 'task_shenPiDetails';
            }
            if ($state.current.name == 'task_todo_audit_other') {//科室列表--审批类
                vm.page = 'task_todo_audit_other';
            }
            if ($state.current.name == 'task_todo_yuepi') {//科室列表--审批类
                vm.page = 'task_todo_yuepi';
            }
            if($state.current.name == 'print'){
        		vm.page = 'print';
        	}
            vm.formatDate = function (str) {
                return common.formatDate(str);
            };

            vm.getBasicDataDesc = function (str) {//流转信息显示
                return common.getBasicDataDesc(str);
            };

            vm.getBasicDataComment = function (str) {//获取基础数据comment
                return common.getBasicDataComment(str);
            };

            vm.checkLength = function (obj, max, id) {
                common.checkLength(obj, max, id);
            };

            vm.html = function (val) {
                return $sce.trustAsHtml(val);
            };

            vm.getUnitName = function (unitId) {
                return common.getUnitName(unitId);
            };

            vm.getUserName = function (userId) {
                var user = common.getUserById(userId).value[0];
                return user.displayName != null && user.displayName != '' && user.displayName != undefined ? user.displayName : user.loginName;
            };

            //初始化基础数据
            vm.basicData.projectIndustry_ZF = $linq(common.getBasicData())
                .where(function (x) {
                    return x.identity == common.basicDataConfig().projectIndustry && x.pId == common.basicDataConfig().projectIndustry_ZF;
                })
                .toArray();//政府投资行业
            vm.basicData.projectIndustry_SH = $linq(common.getBasicData())
                .where(function (x) {
                    return x.identity == common.basicDataConfig().projectIndustry && x.pId == common.basicDataConfig().projectIndustry_SH;
                })
                .toArray();//社会投资行业
            vm.basicData.projectClassify_ZF = $linq(common.getBasicData())
                .where(function (x) {
                    return x.identity == common.basicDataConfig().projectClassify && x.pId == common.basicDataConfig().projectClassify_ZF;
                })
                .toArray();//政府项目分类
            vm.basicData.projectClassify_SH = $linq(common.getBasicData())
                .where(function (x) {
                    return x.identity == common.basicDataConfig().projectClassify && x.pId == common.basicDataConfig().projectClassify_SH;
                })
                .toArray();//社会项目分类
            vm.basicData.area_Street = $linq(common.getBasicData())
                .where(function (x) {
                    return x.identity == common.basicDataConfig().area && x.pId == common.basicDataConfig().area_GM;
                })
                .toArray(); //行政区划街道
            vm.basicData.projectConstrChar = common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);//项目建设性质
            vm.basicData.projectStage = common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
            vm.basicData.projectShenBaoStage = common.getBacicDataByIndectity(common.basicDataConfig().projectShenBaoStage);//申报阶段
            vm.basicData.projectType = common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类型
            vm.basicData.projectCategory = common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别
            vm.basicData.projectConstrChar = common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);//项目建设性质
            vm.basicData.unitProperty = common.getBacicDataByIndectity(common.basicDataConfig().unitProperty);//单位性质
            vm.basicData.processState = common.getBacicDataByIndectity(common.basicDataConfig().processState);//审批状态
            vm.basicData.auditState = common.getBacicDataByIndectity(common.basicDataConfig().auditState);//审核状态
            vm.basicData.taskType = common.getBacicDataByIndectity(common.basicDataConfig().taskType);//任务类型
            vm.basicData.hecretHierarchy = common.getBacicDataByIndectity(common.basicDataConfig().hecretHierarchy)//获取秘密等级信息
            vm.basicData.fileSet = common.getBacicDataByIndectity(common.basicDataConfig().fileSet);//获取文件缓急信息
            vm.basicData.documentType = common.getBacicDataByIndectity(common.basicDataConfig().documentType);//获取文件种类信息
            vm.basicData.openType = common.getBacicDataByIndectity(common.basicDataConfig().openType);//获取公开种类信息
            vm.basicData.postingCategory = common.getBacicDataByIndectity(common.basicDataConfig().postingCategory);//获取发文种类信息
            vm.basicData.taskTypeForShenPi = [common.basicDataConfig().taskType_JYS, common.basicDataConfig().taskType_KXXYJBG,
                common.basicDataConfig().taskType_CBSJYGS, common.basicDataConfig().taskType_ZJSQBG];
            //国民经济行业分类
            vm.basicData.nationalIndustry = common.getBacicDataByIndectity(common.basicDataConfig().projectGoverEconClassify);
            vm.nationalIndustryChange = function () {
                vm.basicData.nationalIndustryChildren = $linq(common.getBasicData())
                    .where(function (x) {
                        return x.identity == common.basicDataConfig().projectGoverEconClassify && x.pId == vm.model.shenBaoInfo.nationalIndustryParent;
                    })
                    .toArray();
            }
        }

        activate();

        function activate() {
            init();
            if (vm.page == 'todoAuditList') {
                init_todoAuditList();
            }
            if (vm.page == 'handleAudit' || vm.page == 'handleYuepi' || vm.page == "handleKeshi") {
                init_handleAudit();
            }
            if (vm.page == 'complete_shenPi') {
                init_complete_shenPiList();
            }
            if (vm.page == 'task_shenPiDetails') {
                init_task_shenPiDetails();
            }
            if (vm.page == 'task_todo_audit_other') {
                task_todo_audit_other();
            }
            if (vm.page == 'task_todo_yuepi') {
                task_todo_yuepi();
            }
            if(vm.page == 'print'){
        		print();
        	}
            vm.formatDateTime = function (time) {
                return common.formatDateTime(time);
            };
            //填写/查看评审报批单模态框
            vm.editApproval = function (str) {
                if (str == 'edit') {
                    vm.isEditApproval = true;
                    vm.isLookApproval = false;
                } else if (str == 'look') {
                    vm.isLookApproval = true;
                    vm.isEditApproval = false;
                }
                taskNewAuditSvc.getApproval(vm);//查询评审报批单
            };
            //填写/查看发文拟稿模态框
            vm.draftOpen = function (str) {
                if (str == 'edit') {
                    vm.isEditDraft = true;
                    vm.isLookDraft = false;
                } else if (str == 'look') {
                    vm.isLookDraft = true;
                    vm.isEditDraft = false;
                }
                taskNewAuditSvc.getDraftIssued(vm);//查询发文拟稿
                
               
            };
            
            vm.checkDraft = function(drafts){
                if(drafts){
                	return "是";
                }else{
                	return "否";
                }

            }
            //弹出申报详情模态框
            vm.dialog_shenbaoInfo = function () {
                $("#shenbaoInfo").modal({
                    backdrop: 'static',
                    keyboard: true
                });
            };
        }

        function task_todo_audit_other() {
            taskNewAuditSvc.otherGrid(vm);

            vm.basicData.userUnit = common.getUserUnits().value;//获取所有单位
            var keys = [];
            vm.output = [];
            angular.forEach(vm.basicData.userUnit, function (item) {
                var key = item["id"];
                if (keys.indexOf(key) === -1) {
                    keys.push(key);
                    vm.output.push(item);
                }
            });
            //查询
            vm.search = function () {
                var filters = [];
//                filters.push({field: 'complate', operator: 'eq', value: false});//默认条件--没有完成的任务

                if (vm.search.title != null && vm.search.title != '') {//查询条件--标题
                    filters.push({field: 'projectName', operator: 'contains', value: vm.search.title});
                }
                if (vm.search.unitName != null && vm.search.unitName != '') {//查询条件--任务建设单位
                    filters.push({field: 'unitName', operator: 'contains', value: vm.search.unitName});
                }
                if (vm.search.projectIndustry != null && vm.search.projectIndustry != '') {//查询条件--项目行业
                    filters.push({field: 'projectIndustry', operator: 'eq', value: vm.search.projectIndustry});
                }
                vm.gridOptions_other.dataSource.filter(filters);
            };
            //清空筛选条件
            vm.filterClear = function () {
                location.reload();
            };
        };

        function task_todo_yuepi() {
            taskNewAuditSvc.yuepiGrid(vm);
            vm.yuepi=function(id){
        		taskNewAuditSvc.yuepi(vm,id);
        	}
            vm.basicData.userUnit = common.getUserUnits().value;//获取所有单位
            var keys = [];
            vm.output = [];
            angular.forEach(vm.basicData.userUnit, function (item) {
                var key = item["id"];
                if (keys.indexOf(key) === -1) {
                    keys.push(key);
                    vm.output.push(item);
                }
            });
            //查询
            vm.search = function () {
                var filters = [];
//                filters.push({field: 'complate', operator: 'eq', value: false});//默认条件--没有完成的任务

                if (vm.search.title != null && vm.search.title != '') {//查询条件--标题
                    filters.push({field: 'projectName', operator: 'contains', value: vm.search.title});
                }
                if (vm.search.unitName != null && vm.search.unitName != '') {//查询条件--任务建设单位
                    filters.push({field: 'unitName', operator: 'contains', value: vm.search.unitName});
                }
                if (vm.search.projectIndustry != null && vm.search.projectIndustry != '') {//查询条件--项目行业
                    filters.push({field: 'projectIndustry', operator: 'eq', value: vm.search.projectIndustry});
                }
                vm.gridOptions_other.dataSource.filter(filters);
            };
            //清空筛选条件
            vm.filterClear = function () {
                location.reload();
            };
        };

        function init_todoAuditList() {
            //将全局变量查询条件的值赋给vm.search
            vm.search = search_All;
            taskNewAuditSvc.grid(vm);
            vm.basicData.userUnit = common.getUserUnits().value;//获取所有单位
            var keys = [];
            vm.output = [];
            angular.forEach(vm.basicData.userUnit, function (item) {
                var key = item["id"];
                if (keys.indexOf(key) === -1) {
                    keys.push(key);
                    vm.output.push(item);
                }
            });
            //查询
            vm.doSearch = function () {
                var filters = [];
//                filters.push({field: 'complate', operator: 'eq', value: false});//默认条件--没有完成的任务
                filters.push({field: 'thisUser', operator: 'eq', value: window.profile_userId});//默认条件--当前登录人员

                if (vm.search.title != null && vm.search.title != '') {//查询条件--标题
                    filters.push({field: 'projectName', operator: 'contains', value: vm.search.title});
                }
                if (vm.search.unitName != null && vm.search.unitName != '') {//查询条件--任务建设单位
                    filters.push({field: 'unitName', operator: 'contains', value: vm.search.unitName});
                }
                if (vm.search.projectIndustry != null && vm.search.projectIndustry != '') {//查询条件--项目行业
                    filters.push({field: 'projectIndustry', operator: 'eq', value: vm.search.projectIndustry});
                }
                vm.gridOptions.dataSource.filter(filters);
                //给全局查询条件赋值
                search_All = vm.search;
            };
            //清空筛选条件
            vm.filterClear = function () {
                vm.search = {};
                vm.doSearch();
                //清空全局查询条件
                search_All = {};
                //location.reload();
            };
            //页面加载的时候重新调用一次查询方法
            vm.doSearch.call();
        }//end init_todoAuditList

        function init_handleAudit() {
        	vm.isShow = true;
            //查询流转信息
            taskNewAuditSvc.getHistoryInfo(vm);
            //查询申报信息
            taskNewAuditSvc.getShenBaoInfoById(vm);
            //查询批复文件
            taskNewAuditSvc.replyFileGird(vm);
            //常用意见列表
            taskNewAuditSvc.opinionGird(vm);
            //查询意见
            taskNewAuditSvc.getOpinion(vm);
            
            taskNewAuditSvc.getSysConfigs(vm);


            vm.selectionUser = function (id) {

                if (vm.nextUsers.length == 0) {
                    vm.nextUsers.push(id);
                } else {
                    var index = vm.nextUsers.indexOf(id);
                    if (index == -1) {
                        vm.nextUsers.push(id);
                    } else {
                        vm.nextUsers.splice(index, 1);
                    }
                }

            };

            /****************申报信息相关 begin**********************/

            vm.showActiviti = function () {
                taskNewAuditSvc.showActiviti(vm);
            }
            //弹出申报信息复核模态款
            vm.dialog_shenbaoInfoEdit = function () {
                $("#shenbaoInfoEdit").modal({
                    backdrop: 'static',
                    keyboard: false
                });
            };
            //获取项目类型， 多选
            vm.updateSelection = function (id) {
                var index = vm.projectTypes.indexOf(id);
                if (index == -1) {
                    vm.projectTypes.push(id);
                } else {
                    vm.projectTypes.splice(index, 1);
                }
            };
            //选择上传文件验证文件大小
            vm.onSelect = function (e) {
                $.each(e.files, function (index, value) {
                    if (value.size > common.basicDataConfig().uploadSize) {
                        $scope.$apply(function () {
                            common.alert({
                                vm: vm,
                                msg: "上传文件过大！"
                            });
                        });
                    }

                });
            };
           
            vm.uploadError = function (e) {
                common.alert({
                    vm: vm,
                    msg: e.XMLHttpRequest.response.message
                });
            }
            
            //删除上传文件
            vm.delFile = function (idx) {
                var file = vm.project.attachmentDtos[idx];
                if (file) {//删除上传文件的同时删除批复文号
                    var pifuType = file.type;
                    vm.project['pifu' + pifuType + '_wenhao'] = "";
                    vm.project.attachmentDtos.splice(idx, 1);
                }
            };


            taskNewAuditSvc.documentRecordsGird(vm);//查询批复文件


            //展示批复文件选择模态框
            vm.choseDocument = function (e) {
                vm.pifuType = $(e.target).parents('.uploadBox').attr('data-type');
                $(".documentRecords").modal({
                    backdrop: 'static',
                    keyboard: false
                });
                vm.grid_documentRecords.dataSource.read();//批复文件列表数据刷新
            };
            vm.uploadType = [['SCQQJFXD', '首次前期经费下达批复'],['KXXYJBG', '可行性研究报告批复'], ['CBSJYGS', '初步设计与概算批复'], ['ZJSQBG', '资金申请报告批复']];
            //批复文件选择模态框确认
            vm.pifuChoseConfirm = function () {
                //关闭模态框
                $(".documentRecords").modal('hide');
                //获取选择框中的信息
                var select = common.getKendoCheckId('.grid');
                var fileName = select[0].value;
                if (fileName) {
                    var file = common.stringToArray(fileName, ",");
                    var number = file[0];
                    var name = file[1];
                    var url = file[2];
                    vm.project['pifu' + vm.pifuType + '_wenhao'] = number;
                    if (vm.project.attachmentDtos) {
                    	vm.project.attachmentDtos.push({name: name, url: url, type: vm.pifuType});
                    } else {
                    	vm.project.attachmentDtos = [{name: name, url: url, type: vm.pifuType}];
                    }
                }
            };
            //批复文件列表模态框关闭
            vm.dismissReplyFile = function () {
                $("#documentRecords").modal('hide');
            };
            //复核申报信息保存
            vm.saveShenBaoInfo = function () {
                taskNewAuditSvc.saveShenBaoInfo(vm);
            };
            /****************申报信息相关 end**********************/


            /****************审批附件相关 begin**********************/
            //相关附件文件上传文件种类
            vm.uploadSuccess_shenpi = function (e) {
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

            //相关附件上传配置
            vm.uploadOptions_shenpi = {
                async: {saveUrl: '/common/save', removeUrl: '/common/remove', autoUpload: true},
                error: vm.uploadError,
                success: vm.uploadSuccess_shenpi,
                localization: {select: '上传文件'},
                showFileList: false,
                multiple: true,
                validation: {
                    maxFileSize: common.basicDataConfig().uploadSize
                },
                select: vm.onSelect
            };

            //删除上传文件
            vm.delFile_shenpi = function (idx) {
                var file = vm.model.shenBaoInfo.attachmentDtos[idx];
                if (file) {
                    vm.model.shenBaoInfo.attachmentDtos.splice(idx, 1);
                }
            };
            
            //文件上传成功
            vm.uploadSuccess_pifu = function (e) {
            	  var type = $(e.sender.element).parents('.uploadBox').attr('data-type');
                  if (e.XMLHttpRequest.status == 200) {
                      angular.forEach(eval("(" + e.XMLHttpRequest.response + ")").data, function (fileObj, index) {
                          $scope.$apply(function () {
                              if (vm.project.attachmentDtos) {
                                  vm.project.attachmentDtos.push({
                                      name: fileObj.originalFilename,
                                      url: fileObj.randomName,
                                      type: type
                                  });
                              } else {
                                  vm.project.attachmentDtos = [{
                                      name: fileObj.originalFilename,
                                      url: fileObj.randomName,
                                      type: type
                                  }];
                              }
                          });
                      })
                  }
            };
            //批复文件上传配置
            vm.uploadOptions_pifu = {
            		  async: {saveUrl: '/common/save', removeUrl: '/common/remove', autoUpload: true},
                      error: vm.uploadError,
                      success: vm.uploadSuccess_pifu,
                      localization: {select: '上传文件'},
                      showFileList: false,
                      multiple: true,
                      validation: {
                          maxFileSize: common.basicDataConfig().uploadSize
                      },
                      select: vm.onSelect
            };
         

            /****************审批附件相关 end**********************/

            /****************评审报批附件相关 begin**********************/
            //相关附件文件上传文件种类
            vm.uploadSuccess_approval = function (e) {
                var type = $(e.sender.element).parents('.uploadBox').attr('data-type');
                if (e.XMLHttpRequest.status == 200) {
                    angular.forEach(eval("(" + e.XMLHttpRequest.response + ")").data, function (fileObj, index) {
                        $scope.$apply(function () {
                            if (vm.approval.attachmentDtos) {
                                vm.approval.attachmentDtos.push({
                                    name: fileObj.originalFilename,
                                    url: fileObj.randomName,
                                    type: type
                                });
                            } else {
                                vm.approval.attachmentDtos = [{
                                    name: fileObj.originalFilename,
                                    url: fileObj.randomName,
                                    type: type
                                }];
                            }
                        });
                    })
                }
            };

            //相关附件上传配置
            vm.uploadOptions_approval = {
                async: {saveUrl: '/common/save', removeUrl: '/common/remove', autoUpload: true},
                error: vm.uploadError,
                success: vm.uploadSuccess_approval,
                localization: {select: '上传文件'},
                showFileList: false,
                multiple: true,
                validation: {
                    maxFileSize: common.basicDataConfig().uploadSize
                },
                select: vm.onSelect
            };

            //删除上传文件
            vm.delFile_approval = function (idx) {
                var file = vm.approval.attachmentDtos[idx];
                if (file) {
                    vm.approval.attachmentDtos.splice(idx, 1);
                }
            };
            /****************评审报批附件相关 end**********************/

            /****************常用意见相关 begin**********************/
            //切换常用意见
            vm.changeOpin = function () {
                vm.processSuggestion = vm.model.opinion;
            };

            //保存常用意见
            vm.saveOpinion = function () {
                if (vm.processSuggestion != "" && vm.processSuggestion != undefined) {
                    taskNewAuditSvc.saveOpinion(vm);
                }
            };

            //常用意见管理模态框
            vm.showOpinion = function () {
                $('.opinion').modal({
                    backdrop: 'static',
                    keyboard: true
                });
        		vm.model.opinion = {"opinion":opin,"id":id};
        	};
        	
        	//编辑意见
        	vm.editOpin=function(){
        		taskNewAuditSvc.editOpin(vm);
        	};
        	//删除意见
        	vm.remove=function(id){
        		taskNewAuditSvc.deleteOpin(vm,id);
        	};
/****************常用意见相关 end**********************/        	
        	
	  	   	//保存审批单
	       	vm.saveApproval=function(){
	       		taskNewAuditSvc.saveApproval(vm);
	       	};
	       	//保存发文拟稿
        	vm.saveDraft=function(){
        		taskNewAuditSvc.saveDraft(vm);
        	};
        	
		   //处理
        	vm.handle=function(str){
        		if(vm.isPass == false){
        			vm.isPass ="";
        		}
        		if((vm.model.shenBaoInfo.thisTaskName == 'usertask12' || vm.model.shenBaoInfo.thisTaskName == 'usertask18') && vm.isPass == "5" && vm.nextUsers == ""){
        			vm.nextUsers = "e03930db-9e32-4158-afe4-9357945df1ae";
        		}
        		
    			if((vm.model.shenBaoInfo.thisTaskName == 'usertask1' || vm.model.shenBaoInfo.thisTaskName == 'usertask5') && vm.isPass == "1" && vm.nextUsers == "" && str =="next"){
							vm.nextUsers = vm.banliUsers;
							taskNewAuditSvc.handle(vm,str);
    			}else if((vm.model.shenBaoInfo.thisTaskName == 'usertask6' ||vm.model.shenBaoInfo.thisTaskName == 'usertask7' )&& vm.isPass == "1" && vm.nextUsers == ""){
							vm.nextUsers = vm.banwenUsers;
							taskNewAuditSvc.handle(vm,str);
//    				vm.nextUsers = '10fac944-1244-4279-9c8e-c6eb9a9c9dc5';//办文顾丽娜
    			}else if((vm.model.shenBaoInfo.thisTaskName == 'usertask17' || vm.model.shenBaoInfo.thisTaskName == 'usertask19' ||
    					vm.model.shenBaoInfo.thisTaskName == 'usertask13' || vm.model.shenBaoInfo.thisTaskName == 'usertask21') && vm.isPass == "5" && vm.nextUsers == "" && str =="next"){
							vm.nextUsers = vm.yinwenUsers;
							taskNewAuditSvc.handle(vm,str);
//    				vm.nextUsers = '6548a46b-c2c2-4650-b8dd-ae50a01cafaf';//印文胡伟军
    			}else if((vm.isPass == "" || vm.isPass == undefined ) && str =="next") {
        			common.alert({
						vm : vm,
						msg : "请选择办理环节后提交！",
						fn : function() {
							$('.alertDialog').modal('hide');
						}
					});
        		}else if(str =="next" && vm.nextUsers != "" || str =="reback" || str =="banjie"){
        			
							taskNewAuditSvc.handle(vm,str);
							//过滤出局领导退回的情况，单独判断
    			}else if (str =="tuiwen" ){
        		   if((vm.model.shenBaoInfo.thisTaskName == 'usertask13' ||  vm.model.shenBaoInfo.thisTaskName == 'usertask17'
        			   ||  vm.model.shenBaoInfo.thisTaskName == 'usertask19' || vm.model.shenBaoInfo.thisTaskName == 'usertask21') && vm.nextUsers == ""){
                       common.alert({
                           vm : vm,
                           msg : "请选择经办人后提交！",
                           fn : function() {
                               $('.alertDialog').modal('hide');
                           }
                       });
                   }else{
                       taskNewAuditSvc.handle(vm,str);
                   } 
                }else {
    				common.alert({
						vm : vm,
						msg : "请选择经办人后提交！",
						fn : function() {
							$('.alertDialog').modal('hide');
						}
					});
    			}
        	};
        	
        	vm.changeDeptUsers=function(num){
    			vm.nextUsers = '';
        		vm.num = num;
        		if(vm.model.shenBaoInfo.thisTaskName == 'usertask3' || vm.model.shenBaoInfo.thisTaskName == 'usertask23'){
        			if(num == "8"){
        				taskNewAuditSvc.getDeptByName(vm,"评审中心");
        			}else{
        				taskNewAuditSvc.getDeptByName(vm,"投资科");
        			}
        			
        		}else if(vm.model.shenBaoInfo.thisTaskName == 'usertask17' || vm.model.shenBaoInfo.thisTaskName == 'usertask19' || vm.model.shenBaoInfo.thisTaskName == 'usertask13' || vm.model.shenBaoInfo.thisTaskName == 'usertask21'){
        			
        			if(num == "5"){
        				
        				taskNewAuditSvc.getDeptByName(vm,"办公室");
        			}else if(num == "6"){
        				taskNewAuditSvc.getDeptByName(vm,"局领导");
        			}else {
        				taskNewAuditSvc.getDeptByName(vm,"投资科");
        			}
        			
        		}else if(vm.model.shenBaoInfo.thisTaskName == 'usertask13' || vm.model.shenBaoInfo.thisTaskName == 'usertask21'){
        			if(num == "5"){
        				taskNewAuditSvc.getDeptByName(vm,"办公室");
        			}else{
        				taskNewAuditSvc.getDeptByName(vm,"投资科");
        			}
        		}else if(vm.model.shenBaoInfo.thisTaskName == 'usertask12' || vm.model.shenBaoInfo.thisTaskName == 'usertask18'){
        			
        				vm.user =[];
        				for (var i = 0; i < vm.model.dept.userDtos.length; i++) {
							var user = vm.model.dept.userDtos[i];
							for (var j = 0; j < user.roles.length; j++) {
								var role = user.roles[j];
								if(role.roleName == "副局长" && num == "5"){
										vm.user.push(user);
									}else if(role.roleName == "局长" && num == "6"){
										vm.user.push(user);
									}
							}
							
						}
        		}
        		
        	}
        	vm.updateNumber=function(){
        		taskNewAuditSvc.saveShenBaoInfo(vm);
        	}
        	vm.pinglun=function(flag){
        		taskNewAuditSvc.pinglun(vm,flag);
        	}
        	vm.yuepi=function(id){
        		taskNewAuditSvc.yuepi(vm,id);
        	}
/****************审批处理相关 end**********************/       	
        }//end init_handleAudit

        function init_complete_shenPiList() {
            taskNewAuditSvc.complete_shenPiGird(vm);

            vm.basicData.userUnit = common.getUserUnits().value;//获取所有单位
            var keys = [];
            vm.output = [];
            angular.forEach(vm.basicData.userUnit, function (item) {
                var key = item["id"];
                if (keys.indexOf(key) === -1) {
                    keys.push(key);
                    vm.output.push(item);
                }
            });
            //查询
            vm.doSearch = function () {
                var filters = [];
                if (vm.search.title != null && vm.search.title != '') {//查询条件--标题
                    filters.push({field: 'projectName', operator: 'contains', value: vm.search.title});
                }
                if (vm.search.unitName != null && vm.search.unitName != '') {//查询条件--任务建设单位
                    filters.push({field: 'unitName', operator: 'contains', value: vm.search.unitName});
                }
                if (vm.search.projectIndustry != null && vm.search.projectIndustry != '') {//查询条件--项目行业
                    filters.push({field: 'projectIndustry', operator: 'eq', value: vm.search.projectIndustry});
                }
                vm.gridOptions_complete_shenPi.dataSource.filter(filters);
            };
            //清空筛选条件
            vm.filterClear = function () {
                vm.search = {};
                vm.doSearch();
                //location.reload();
            };
        }//end#init_complete_shenPiList

        function init_task_shenPiDetails() {
            //查询流转信息
            taskNewAuditSvc.getHistoryInfo(vm);
            //查询申报信息
            taskNewAuditSvc.getShenBaoInfoById(vm);
            //查询批复文件
            taskNewAuditSvc.replyFileGird(vm);

            vm.showActiviti = function () {
                taskNewAuditSvc.showActiviti(vm);
            }
            //弹出申报信息复核模态款
            vm.dialog_shenbaoInfoEdit = function () {
                $("#shenbaoInfoEdit").modal({
                    backdrop: 'static',
                    keyboard: false
                });
            };

            //复核申报信息保存
            vm.saveShenBaoInfo = function () {
                taskNewAuditSvc.saveShenBaoInfo(vm);
            };
        }//end#init_task_shenPiDetails
        
        function print(){
        	taskNewAuditSvc.getShenBaoInfoById(vm);
        	taskNewAuditSvc.getDraftIssued(vm);
        	taskNewAuditSvc.getHistoryInfo(vm);
        	var nowDate=new Date();
        	 vm.getBasicDataDesc = function (str) {//流转信息显示
                 return common.getBasicDataDesc(str);
             };
        	vm.nowDate = nowDate.getFullYear()+"年"+(nowDate.getMonth()+1)+"月"+nowDate.getDate()+"日";
        	//打印
        	vm.printBtn=function(){
        		$("#printWindow").printThis({
          	        debug: false,
          	        importCSS: true,       // import page CSS
          	      	importStyle: true,    // import style tags
          	        printContainer: true,
          	        removeInline: false,
          	        printDelay: 333,
          	        header: null,
          	        formValues: true
          	      });
        	};
        }//end fun print
    }
})();
