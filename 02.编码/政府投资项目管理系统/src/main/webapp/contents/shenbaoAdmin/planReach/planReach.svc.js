(function () {
    'use strict';

    angular.module('app').factory('planReachSvc', planReach);

    planReach.$inject = ['$http', '$compile', '$location', "bsWin"];

    function planReach($http, $compile, $location, bsWin) {
        var url = "/shenbaoAdmin/planReach";
        var url_shenbao = "/shenbaoAdmin/shenbao";
        var url_project = "/shenbaoAdmin/project";
        var url_userUnit = "/shenbaoAdmin/userUnitInfo";
        var url_back = "/planReach";
        var url_pack = "/shenbaoAdmin/yearPlan";
        var url_packPlan = '/management/packPlan';
        var url_getSysConfigs = "/sys/getSysConfig";
        var url_planList = "/management/yearPlan";
        var url_shenbaoInfoList = "/management/shenbao";

        return {
            getHasIncludYearPlan: getHasIncludYearPlan,
            getNotIncludYearPlan: getNotIncludYearPlan,
            planReachRecords: planReachRecords,
            comfirmPlanReach: comfirmPlanReach,
            deletePlanReach: deletePlanReach,
            grid: grid,
            projectGrid: projectGrid,
            getUserUnit: getUserUnit,
            getShenBaoInfoByProjectNumber: getShenBaoInfoByProjectNumber,
            createApplication: createApplication,
            updateApplication: updateApplication,
            deleteApplication: deleteApplication,
            getApplicationById: getApplicationById,
            packGrid: packGrid,
            projectForPackGrid: projectForPackGrid,
            getShenBaoInfoFromPlanReachApplicationGrid: getShenBaoInfoFromPlanReachApplicationGrid,
            addShenBaoInfoToPlanReach: addShenBaoInfoToPlanReach,
            getPackFromPlanGrid: getPackFromPlanGrid,
            addPackPlanToPlanReack: addPackPlanToPlanReack,
            getShenBaoInfoGridFromPackPlan: getShenBaoInfoGridFromPackPlan,
            getPackPlanById: getPackPlanById,//查询打包计划信息
            addShenBaoInfoToPack: addShenBaoInfoToPack,//打包计划添加申报信息
            startProcess: startProcess,//开始计划下达审批流程
            updateShnebaoInfo: updateShnebaoInfo,//更新申报信息的安排资金
            deleteShenBaoInfo: deleteShenBaoInfo,//删除打包计划的申报信息
            deletePacks: deletePacks,//删除打包计划中的打包信息
            deletePlanShenBaoInfo: deletePlanShenBaoInfo,//删除打包信息的申报信息
            getSysConfig: getSysConfig,//查询配置信息
            shenbaoInfoGrid: shenbaoInfoGrid,//所有下一年度计划
            startProcessOne: startProcessOne,//单个项目启动流程
            deleteProcessOne: deleteProcessOne//撤销流程
        };

        function deleteProcessOne(vm, id) {
            $http.get(common.format(url + "/deleteProcessOne?shenbaoId={0}", id)).then(function () {
                vm.shenBaoInfo_gridOptions_plan && vm.shenBaoInfo_gridOptions_plan.dataSource.read();
                vm.shenBaoInfo_gridOptions && vm.shenBaoInfo_gridOptions.dataSource.read();
            })
        }//end fun

        function startProcessOne(vm, id) {
            $http.get(common.format(url + "/startProcessOne?shenbaoId={0}", id)).then(function () {
                vm.shenBaoInfo_gridOptions_plan && vm.shenBaoInfo_gridOptions_plan.dataSource.read();
                vm.shenBaoInfo_gridOptions && vm.shenBaoInfo_gridOptions.dataSource.read();
            })
        }//end fun


        function getSysConfig(vm) {
            $http.get(common.format(
                url_getSysConfigs + "?configName={0}",
                common.basicDataConfig().taskType_jihuaPort
            )).success(function (data) {
                vm.sysconfig = data || {};
                if (vm.sysconfig.configValue) {
                    var time = vm.sysconfig.configValue.split("-");
                    var nowTime = new Date();
                    if (nowTime.getTime() > time[0] && nowTime.getTime() < time[1]) {
                        vm.isCan = false;
                    }
                }
            })
        }//end fun

        function deletePlanShenBaoInfo(vm, ids) {
            $http.post(common.format(url + "/deletePlanShenBaoInfo/{0}", vm.id), ids).then(function () {
                bsWin.success("操作成功");
                vm.shenBaoInfo_gridOptions_plan.dataSource.read();//编制打包计划列表数据刷新
            })
        };

        function deletePacks(vm, ids) {
            $http.post(common.format(url + "/deletePack/{0}", vm.id), ids).then(function () {
                bsWin.success("操作成功");
                vm.packPlan_gridOptions.dataSource.read();//编制打包计划列表数据刷新
            })
        };

        function deleteShenBaoInfo(vm, ids) {
            $http.post(common.format(url + "/deleteShenBaoInfo/{0}", vm.id), ids).then(function () {
                bsWin.success("操作成功");
                vm.shenBaoInfo_gridOptions.dataSource.read();//编制打包计划列表数据刷新
            })
        };

        function updateShnebaoInfo(vm, shenbaoId) {
            $http.post(common.format(url + "/updateShnebaoInfo/{0}/{1}/{2}", shenbaoId, vm.gg[shenbaoId], vm.gt[shenbaoId])).then(function () {
                vm.shenBaoInfo_gridOptions_plan && vm.shenBaoInfo_gridOptions_plan.dataSource && vm.shenBaoInfo_gridOptions_plan.dataSource.read();
                //编制打包计划列表数据刷新
                vm.shenBaoInfo_gridOptions && vm.shenBaoInfo_gridOptions.dataSource && vm.shenBaoInfo_gridOptions.dataSource.read();
            })
        };

        function startProcess(vm, planId) {
            $http.post(common.format(url + "/startProcess/{0}", planId)).then(function () {
                bsWin.success("操作成功");
                vm.gridOptions.dataSource.read();
            })
        };

        function getPackPlanById(vm) {
            $http.get(common.format(url_packPlan + "?$filter=id eq '{0}'", vm.id)).success(function (data) {
                vm.model = data.value[0] || {};
                // console.log(vm.model);
                vm.model.allocationCapitalDtos = vm.model.allocationCapitals;
                //刷新文字输入长度
//				vm.checkLength(vm.model.remark,500,'remarkTips');
                //vm.planYear = vm.model.plan.year;//用于编制列表表头年份的绑定
//				vm.shenBaoInfo_gridOptions_plan.dataSource = vm.model.shenBaoInfoDtos;
            })
        }//end fun getPackPlanById

        /**
         * 为计划下达申请添加打包类型
         */
        function addPackPlanToPlanReack(vm, ids) {
            $http.post(common.format(url + "/addPackPlan/{0}", vm.id), ids).then(function () {
                bsWin.success("操作成功");
                vm.packPlan_gridOptions.dataSource.read();//编制打包计划列表数据刷新
            })
        }//end function addPackPlanToPlanReack

        /**
         * 为计划下达申请添加申报项目
         */
        function addShenBaoInfoToPlanReach(vm, ids) {
            $http.post(common.format(url + "/addShenBaoInfo/{0}", vm.id), ids).then(function () {
                // bsWin.success("操作成功");
                //编制打包计划列表数据刷新
                vm.shenBaoInfo_gridOptions.dataSource.read();

                $('#myModal').modal('toggle');//关闭模态框
            })
        }//end fun addShenBaoInfoToYearPlan

        /**
         * 为计划下达申请添加申报项目
         */
        function addShenBaoInfoToPack(vm, ids) {
            $http.post(common.format(url + "/addShenBaoInfoToPack/{0}", vm.id), ids).then(function () {
                bsWin.success("操作成功");
                vm.shenBaoInfo_gridOptions_plan.dataSource.read();//编制打包计划列表数据刷新
            })
        }//end fun addShenBaoInfoToYearPlan

        /**
         * 根据项目代码获取下一年度申报信息
         */
        function getShenBaoInfoByProjectNumber(vm, projectNumber, isIncludYearPlan, applicationTime, isHas) {
            var httpOptions = {
                method: 'get',
                url: common.format(url_shenbao + "?$filter=projectNumber eq '{0}' and isIncludYearPlan eq {1} and projectShenBaoStage eq '{3}' and planYear eq {2}", projectNumber, isIncludYearPlan, applicationTime, common.basicDataConfig().projectShenBaoStage_nextYearPlan)
            };
            var httpSuccess = function success(response) {
                vm.shenBaoInfo = response.data.value[0] || {};
                if (isHas) {
                    vm.model.packPlanDtos.shenBaoInfoDtos.push({
                        id: vm.shenBaoInfo.id,
                        projectId: vm.shenBaoInfo.projectId,
                        projectNumber: projectNumber,
                        projectName: vm.shenBaoInfo.projectName,
                        isIncludYearPlan: isIncludYearPlan,
                        projectInvestSum: vm.shenBaoInfo.projectInvestSum,
                        capitalAP_ggys_TheYear: vm.shenBaoInfo.capitalAP_ggys_TheYear,
                        capitalAP_gtzj_TheYear: vm.shenBaoInfo.capitalAP_gtzj_TheYear,
                        sqPlanReach_ggys: vm.shenBaoInfo.capitalAP_ggys_TheYear,
                        sqPlanReach_gtzj: vm.shenBaoInfo.capitalAP_gtzj_TheYear,
                        processState: common.basicDataConfig().processState_weikaishi,
                        processStage: common.basicDataConfig().processStage_qianshou
                    });
                } else {
                    vm.model.packPlanDtos.shenBaoInfoDtos = [{
                        id: vm.shenBaoInfo.id,
                        projectId: vm.shenBaoInfo.projectId,
                        projectNumber: projectNumber,
                        projectName: vm.shenBaoInfo.projectName,
                        isIncludYearPlan: isIncludYearPlan,
                        projectInvestSum: vm.shenBaoInfo.projectInvestSum,
                        capitalAP_ggys_TheYear: vm.shenBaoInfo.capitalAP_ggys_TheYear,
                        capitalAP_gtzj_TheYear: vm.shenBaoInfo.capitalAP_gtzj_TheYear,
                        sqPlanReach_ggys: vm.shenBaoInfo.capitalAP_ggys_TheYear,
                        sqPlanReach_gtzj: vm.shenBaoInfo.capitalAP_gtzj_TheYear,
                        processState: common.basicDataConfig().processState_weikaishi,
                        processStage: common.basicDataConfig().processStage_qianshou
                    }];
                }
            };
            common.http({
                vm: vm,
                $http: $http,
                httpOptions: httpOptions,
                success: httpSuccess
            });
        }//end fun getShenBaoInfoByProjectNumber

        /**
         * 根据id获取计划下达申请信息
         */
        function getApplicationById(vm) {
            $http.get(common.format(url + "?$filter=id eq '{0}'", vm.id)).success(function (data) {
                vm.model = data.value[0] || {};
                //时间信息的展示
                vm.model.applicationTime = common.formatDate(vm.model.applicationTime);
                //移除按钮是否可点击
                vm.processStage_tianbao = common.basicDataConfig().processStage_tianbao;
                vm.processStage_qianshou = common.basicDataConfig().processStage_qianshou;
                vm.processState_pass = common.basicDataConfig().processState_pass;
                vm.processState_notPass = common.basicDataConfig().processState_notpass;
                vm.shenbaoList = [];
                vm.shenbaoList = vm.shenbaoList.concat(vm.model.shenBaoInfoDtos);
                if (vm.model.planPackDtos != "") {
                    for (var int = 0; int < vm.model.planPackDtos.length; int++) {
                        var array_element = vm.model.planPackDtos[int];
                        if (array_element.shenBaoInfoDtos != "") {
                            vm.shenbaoList = vm.shenbaoList.concat(array_element.shenBaoInfoDtos);
                        }
                    }
                }
            })
        }//end fun getApplicationById

        /**
         * 删除计划下达申请
         */
        function deleteApplication(vm, id) {
            $http.post(url + '/deletePlanReach', id).then(function () {
                vm.isSubmit = false;
                bsWin.success("操作成功！");
                vm.gridOptions.dataSource.read();
            }, function () {
                vm.isSubmit = false;
            })
        }//end fun deleteApplication

        /**
         * 更新计划下达申请
         */
        function updateApplication(vm) {
            common.initJqValidation();
            var isValid = $('form').valid();
            if (isValid) {
                vm.isSubmit = true;
                $http.post(url + '/updatePlanReach').then(function () {
                    vm.isSubmit = false;
                    bsWin.success("操作成功！");
                    $location.path(url_back);//创建成功返回到列表页
                }, function () {
                    vm.isSubmit = false;
                })
            }
        }//end fun updateApplication

        /**
         * 创建计划下达申请
         */
        function createApplication(vm, fn) {
            common.initJqValidation();
            var isValid = $('form').valid();
            if (isValid) {
                vm.isSubmit = true;
                $http.post(url, vm.model).then(function () {
                    vm.isSubmit = false;
                    if (angular.isFunction(fn)) {
                        fn();
                    } else {
                        $location.path(url_back);//创建成功返回到列表页
                    }
                    bsWin.success("操作成功！");
                }, function () {
                    vm.isSubmit = false;
                });
            }
        }//end fun createApplication

        /**
         * 获取当前登陆用户单位
         */
        function getUserUnit(vm, fn) {
            $http.get(url_userUnit).success(function (data) {
                vm.userUnit = data || {};
                vm.model.applicationUnit = vm.userUnit.id;//设置项目的所属单位名称
                angular.isFunction(fn) && fn();
            })
        }//end fun getUserUnit

        /**
         * 项目信息列表
         */
        function projectGrid(vm) {
            var dataSource = new kendo.data.DataSource({
                type: 'odata',
                transport: common.kendoGridConfig().transport(url + "/getShenbaoInfoFromYearplan"),
                schema: common.kendoGridConfig().schema({
                    id: "id",
                    fields: {
                        isIncludYearPlan: {
                            type: "boolean"
                        }
                    }
                }),
                serverPaging: false,
                serverSorting: true,
                serverFiltering: true,
                pageSize: 10,
                sort: {
                    field: "createdDate",
                    dir: "desc"
                },
                filter: [{
                    field: 'unitName',
                    operator: 'eq',
                    value: vm.userUnit.id
                },
                    {
                        field: 'isLatestVersion',
                        operator: 'eq',
                        value: true
                    },
                    {
                        field: 'isIncludPack',
                        operator: 'eq',
                        value: false
                    }
                ]
            });
            var columns = [
                {
                    template: function (item) {
                        return kendo
                            .format(
                                "<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>", item.id);
                    },
                    filterable: false,
                    width: 40,
                    title: "<input id='projects' type='checkbox'  class='checkbox'/>"
                },
                {
                    field: "projectName",
                    title: "项目名称",
                    width: 250,
                    filterable: true
                },
                {
                    field: "projectIndustry",
                    title: "项目行业",
                    width: 150,
                    filterable: {
                        ui: function (element) {
                            element.kendoDropDownList({
                                valuePrimitive: true,
                                dataSource: $linq(common.getBasicData())
                                    .where(function (x) {
                                        return x.identity == common.basicDataConfig().projectIndustry && x.pId == common.basicDataConfig().projectIndustry_ZF;
                                    })
                                    .toArray(),
                                dataTextField: "description",
                                dataValueField: "id",
                                filter: "startswith"
                            });
                        }
                    },
                    template: function (item) {
                        return common.getBasicDataDesc(item.projectIndustry);
                    }
                },
                {
                    field: "isIncludPack",
                    title: "是否加入打包计划",
                    width: 150,
                    filterable: true,
                    template: function (item) {
                        if (item.isIncludPack) {
                            return "是";
                        } else {
                            return "否";
                        }
                    }
                }
            ];
            vm.gridOptions_project = {
                dataSource: common.gridDataSource(dataSource),
                filterable: common.kendoGridConfig().filterable,
                pageable: common.kendoGridConfig().pageable,
                noRecords: common.kendoGridConfig().noRecordMessage,
                columns: columns,
                resizable: true
            };
        }//end fun projectGrid

        function grid(vm) {
            var dataSource = new kendo.data.DataSource({
                type: 'odata',
                transport: common.kendoGridConfig().transport(url),
                schema: common.kendoGridConfig().schema({
                    id: "id"
                }),
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
                pageSize: 10,
                sort: {
                    field: "createdDate",
                    dir: "desc"
                },
                requestStart: function () {
                    kendo.ui.progress($("#loading"), true);
                },
                requestEnd: function () {
                    kendo.ui.progress($("#loading"), false);
                }
            });
            var columns = [
                {
                    template: function (item) {
                        return kendo
                            .format(
                                "<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
                                item.id);
                    },
                    filterable: false,
                    width: 40,
                    title: "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"
                },
                {
                    field: "applicationName",
                    title: "标题",
                    width: 250,
                    filterable: true
                },
                {
                    field: "",
                    title: "项目数量",
                    width: 150,
                    filterable: false,
                    template: function (item) {
                        var alllength = 0;
                        for (var int = 0; int < item.planPackDtos.length; int++) {
                            var array_element = item.planPackDtos[int];
                            alllength = alllength + array_element.shenBaoInfoDtos.length;
                        }
                        return item.shenBaoInfoDtos.length + alllength;
                    }
                },
                {
                    field: "applicationTime",
                    title: "申请时间",
                    width: 100,
                    filterable: false,
                    template: function (item) {
                        return common.formatDate(item.applicationTime);
                    }
                },
                {
                    field: "",
                    title: "操作",
                    width: 150,
                    template: function (item) {
                        return common.format($('#columnBtns_applications').html(), item.id, item.isStartProcess);
                    }
                }
            ];
            vm.gridOptions = {
                dataSource: common.gridDataSource(dataSource),
                filterable: common.kendoGridConfig().filterable,
                pageable: common.kendoGridConfig().pageable,
                noRecords: common.kendoGridConfig().noRecordMessage,
                columns: columns,
                resizable: true
            };
        }//end fun grid

        /**
         * 删除计划下达申请
         */
        function deletePlanReach(vm, id) {
            vm.isSubmit = true;
            var httpOptions = {
                method: 'post',
                url: url_shenbao + '/deleteShenbao',
                data: id
            };

            var httpSuccess = function success(response) {
                common.requestSuccess({
                    vm: vm,
                    response: response,
                    fn: function () {
                        vm.isSubmit = false;
                        $('.alertDialog').modal('hide');
                        $(".modal-backdrop").remove();
                        vm.gridOptions_shenBaoRecords.dataSource.read();
                    }
                });
            };

            common.http({
                vm: vm,
                $http: $http,
                httpOptions: httpOptions,
                success: httpSuccess
            });
        }//end fun deletePlanReach

        /**
         * 确认计划下达资金
         */
        function comfirmPlanReach(vm, id) {
            var httpOptions = {
                method: 'post',
                url: url + "/comfirmPlanReach",
                data: {
                    "id": id,
                    "sqPlanReach_ggys": vm.model.sqPlanReach_ggys,
                    "sqPlanReach_gtzj": vm.model.sqPlanReach_gtzj
                }
            };

            var httpSuccess = function success(response) {
                common.requestSuccess({
                    vm: vm,
                    response: response,
                    fn: function () {
                        vm.hasIncludGridOptions.dataSource.read();
                    }
                });
            };

            common.http({
                vm: vm,
                $http: $http,
                httpOptions: httpOptions,
                success: httpSuccess
            });
        }//end fun comfirmPlanReach

        /**
         * 获取已纳入年度计划的项目数据
         */
        function getHasIncludYearPlan(vm) {
            var dataSource = new kendo.data.DataSource({
                type: 'odata',
                transport: common.kendoGridConfig().transport(common.format(url + "/hasInclud")),
                schema: common.kendoGridConfig().schema({
                    id: "id",
                    fields: {
                        planYear: {
                            type: "number"
                        }
                    }
                }),
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
                pageSize: 10,
                sort: {
                    field: "createdDate",
                    dir: "desc"
                },
                filter: [
                    {
                        field: 'isIncludYearPlan',
                        operator: 'eq',
                        value: true
                    },
                    {
                        field: 'projectShenBaoStage',
                        operator: 'eq',
                        value: common.basicDataConfig().projectShenBaoStage_nextYearPlan
                    },
                ],
                requestStart: function () {
                    kendo.ui.progress($("#loading"), true);
                },
                requestEnd: function () {
                    kendo.ui.progress($("#loading"), false);
                }
            });

            var columns = [
                {
                    field: "projectName",
                    title: "项目名称",
                    width: 250,
                    filterable: true,
                    template: function (item) {
                        var css = "text-primary";
                        return common.format('<a class="{2}" href="#/project/projectInfo/{0}">{1}</a>', item.projectId, item.projectName, css);
                    },
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;"
                    }
                },
                {
                    field: "projectConstrChar",
                    title: "建设性质",
                    template: function (item) {
                        return common.getBasicDataDesc(item.projectConstrChar);
                    },
                    width: 100,
                    filterable: {
                        ui: function (element) {
                            element.kendoDropDownList({
                                valuePrimitive: true,
                                dataSource: vm.basicData.projectConstrChar,
                                dataTextField: "description",
                                dataValueField: "id",
                                filter: "startswith"
                            });
                        }
                    },
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;"
                    }
                },
                {
                    field: "projectIndustry",
                    title: "项目行业",
                    template: function (item) {
                        return common.getBasicDataDesc(item.projectIndustry);
                    },
                    width: 120,
                    filterable: false,
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;"
                    }
                },
                {
                    field: "planYear",
                    title: "计划年度",
                    width: 100,
                    filterable: true,
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;"
                    }
                },
                {
                    title: "申请资金(万元)",
                    columns: [
                        {
                            field: "capitalSCZ_ggys_TheYear",
                            title: "公共预算",
                            width: 80,
                            filterable: false,
                            headerAttributes: {
                                "class": "table-header-cell",
                                style: "text-align: center;vertical-align: middle;"
                            }
                        },
                        {
                            field: "capitalSCZ_gtzj_TheYear",
                            title: "国土基金",
                            width: 80,
                            filterable: false,
                            headerAttributes: {
                                "class": "table-header-cell",
                                style: "text-align: center;vertical-align: middle;"
                            }
                        }
                    ],
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;"
                    }
                },
                {
                    title: "安排资金(万元)",
                    columns: [
                        {
                            field: "capitalAP_ggys_TheYear",
                            title: "公共预算",
                            width: 80,
                            filterable: false,
                            headerAttributes: {
                                "class": "table-header-cell",
                                style: "text-align: center;vertical-align: middle;"
                            }
                        },
                        {
                            field: "capitalAP_gtzj_TheYear",
                            title: "国土基金",
                            width: 80,
                            filterable: false,
                            headerAttributes: {
                                "class": "table-header-cell",
                                style: "text-align: center;vertical-align: middle;"
                            }
                        }
                    ],
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;"
                    }
                },
                {
                    title: "计划下达申请(万元)",
                    columns: [
                        {
                            field: "sqPlanReach_ggys",
                            title: "公共预算",
                            width: 100,
                            filterable: false,
                            template: function (item) {
                                return common.format($('#input_ggys').html(), item.id, item.sqPlanReach_ggys, item.capitalAP_ggys_TheYear);
                            },
                            headerAttributes: {
                                "class": "table-header-cell",
                                style: "text-align: center;vertical-align: middle;"
                            }
                        },
                        {
                            field: "sqPlanReach_gtzj",
                            title: "国土基金",
                            width: 100,
                            filterable: false,
                            headerAttributes: {
                                "class": "table-header-cell",
                                style: "text-align: center;vertical-align: middle;"
                            },
                            template: function (item) {
                                return common.format($('#input_gtzj').html(), item.id, item.sqPlanReach_gtzj, item.capitalAP_gtzj_TheYear);
                            },
                        }
                    ],
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;"
                    }
                },
                {
                    title: "操作",
                    width: 175,
                    template: function (item) {
                        var isShowConfirmBtn = !item.isPlanReach;
                        var isShowEditBtn = item.isPlanReach && item.prcessState != common.basicDataConfig().processState_pass
                        return common.format($('#columnBtns_hasInclud').html(), item.id, isShowConfirmBtn, isShowEditBtn, item.projectNumber);
                    },
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;"
                    }
                }
            ];

            vm.hasIncludGridOptions = {
                dataSource: common.gridDataSource(dataSource),
                filterable: common.kendoGridConfig().filterable,
                pageable: common.kendoGridConfig().pageable,
                noRecords: common.kendoGridConfig().noRecordMessage,
                columns: columns,
                resizable: true,
                sortable: true,
                scrollable: true
            };
        }//end fun getHasIncludYearPlan

        /**
         * 获取未纳入年度计划的项目数据
         */
        function getNotIncludYearPlan(vm) {
            var dataSource = new kendo.data.DataSource({
                type: 'odata',
                transport: common.kendoGridConfig().transport(common.format(url + "/notInclud")),
                schema: common.kendoGridConfig().schema({
                    id: "id"
                }),
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
                pageSize: 10,
                sort: {
                    field: "createdDate",
                    dir: "desc"
                },
                filter: [
                    {
                        field: 'isIncludYearPlan',
                        operator: 'eq',
                        value: false
                    },
                    {
                        field: 'projectInvestmentType',
                        operator: 'eq',
                        value: common.basicDataConfig().projectInvestmentType_ZF
                    },
                ],
                requestStart: function () {
                    kendo.ui.progress($("#loading"), true);
                },
                requestEnd: function () {
                    kendo.ui.progress($("#loading"), false);
                }
            });

            var columns = [
                {
                    template: function (item) {
                        return kendo
                            .format(
                                "<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
                                item.id);
                    },
                    filterable: false,
                    width: 40,
                    title: "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"
                },
                {
                    field: "projectName",
                    title: "项目名称",
                    width: 250,
                    filterable: true,
                    template: function (item) {
                        var css = "text-primary";
                        return common.format('<a class="{2}" href="#/project/projectInfo/{0}">{1}</a>', item.id, item.projectName, css);
                    }
                },

                {
                    field: "projectStage",
                    title: "项目阶段",
                    template: function (item) {
                        return common.getBasicDataDesc(item.projectStage);
                    },
                    width: 150,
                    filterable: {
                        ui: function (element) {
                            element.kendoDropDownList({
                                valuePrimitive: true,
                                dataSource: vm.basicData.projectStage,
                                dataTextField: "description",
                                dataValueField: "id",
                                filter: "startswith"
                            });
                        }
                    }
                },
                {
                    field: "projectInvestmentType",
                    title: "项目投资类型",
                    width: 120,
                    template: function (item) {
                        return common.getBasicDataDesc(item.projectInvestmentType);
                    },
                    filterable: {
                        ui: function (element) {
                            element.kendoDropDownList({
                                valuePrimitive: true,
                                dataSource: vm.basicData.investmentType,
                                dataTextField: "description",
                                dataValueField: "id",
                                filter: "startswith"
                            });
                        }
                    }
                },
                {
                    field: "projectIndustry",
                    title: "项目行业",
                    template: function (item) {
                        return common.getBasicDataDesc(item.projectIndustry);
                    },
                    width: 120,
                    filterable: false
                },
                {
                    field: "",
                    title: "操作",
                    width: 85,
                    template: function (item) {
                        var isHideEditBtn = item.isPlanReach;
                        return common.format($('#columnBtns_notInclud').html(),
                            item.id, item.projectInvestmentType, common.basicDataConfig().projectShenBaoStage_jihuaxiada, item.projectNumber, isHideEditBtn);
                    }
                }

            ];

            vm.notIncludGridOptions = {
                dataSource: common.gridDataSource(dataSource),
                filterable: common.kendoGridConfig().filterable,
                pageable: common.kendoGridConfig().pageable,
                noRecords: common.kendoGridConfig().noRecordMessage,
                columns: columns,
                resizable: true,
                sortable: true,
                scrollable: true
            };
        }//end fun getNotIncludYearPlan

        function planReachRecords(vm) {
            var dataSource = new kendo.data.DataSource({
                type: 'odata',
                transport: common.kendoGridConfig().transport(url_shenbao),
                schema: common.kendoGridConfig().schema({
                    id: "id"
                }),
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
                pageSize: 10,
                sort: {
                    field: "createdDate",
                    dir: "desc"
                },
                filter: [
                    {
                        field: 'projectNumber',
                        operator: 'eq',
                        value: vm.projectNumber
                    },
                    {
                        field: 'projectShenBaoStage',
                        operator: 'eq',
                        value: common.basicDataConfig().projectShenBaoStage_jihuaxiada
                    }
                ]

            });
            var columns = [
                {
                    template: function (item) {
                        return kendo
                            .format(
                                "<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
                                item.id);
                    },
                    filterable: false,
                    width: 40,
                    title: "<input id='checkboxAll_planReachRecords' type='checkbox'  class='checkbox'/>"
                },
                {
                    field: "projectName",
                    title: "项目名称",
                    width: 250,
                    filterable: false
                },
                {
                    field: "processStage",
                    title: "审批阶段",
                    width: 150,
                    filterable: false,
                    template: function (item) {
                        return common.format("<span class='text-danger'>{0}</span>", common.getBasicDataDesc(item.processStage));
                    }
                },
                {
                    field: "processState",
                    title: "审批状态",
                    width: 150,
                    filterable: false,
                    template: function (item) {
                        return common.format("<span class='text-danger'>{0}</span>", common.getProcessStateDesc(item.processState));
                    }
                },
                {
                    field: "planYear",
                    title: "计划年度",
                    width: 100,
                    filterable: false
                },
                {
                    field: "",
                    title: "操作",
                    width: 200,
                    template: function (item) {
                        var isShowEditAndRemoveBtn = (item.processStage == common.basicDataConfig().processStage_qianshou && item.processState == common.basicDataConfig().processState_jinxingzhong)
                            || item.processState == common.basicDataConfig().processState_notpass || item.processStage == common.basicDataConfig().processStage_tianbao;
                        return common.format($('#columnBtns_records').html(), item.id, item.projectInvestmentType, item.projectShenBaoStage, isShowEditAndRemoveBtn ? '' : 'display:none', "vm.deleteShenBaoInfo('" + item.id + "')");
                    }
                }
            ];
            vm.gridOptions_shenBaoRecords = {
                dataSource: common.gridDataSource(dataSource),
                filterable: common.kendoGridConfig().filterable,
                pageable: common.kendoGridConfig().pageable,
                noRecords: common.kendoGridConfig().noRecordMessage,
                columns: columns,
                resizable: true
            };
        }

        function packGrid(vm) {
            var dataSource = new kendo.data.DataSource({
                type: 'odata',
                transport: common.kendoGridConfig().transport(url + "/packPlanList"),
                schema: common.kendoGridConfig().schema({
                    id: "id"
                }),
                serverPaging: false,
                serverSorting: true,
                serverFiltering: true,
                pageSize: 10,
                sort: {
                    field: "createdDate",
                    dir: "desc"
                }
            });
            var columns = [
                {
                    template: function (item) {
                        return kendo
                            .format(
                                "<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>", item.id);
                    },
                    filterable: false,
                    width: 40,
                    title: "<input id='projects' type='checkbox'  class='checkbox'/>"
                },
                {
                    field: "name",
                    title: "项目名称",
                    filterable: true
                },
                {
                    field: "year",
                    title: "年度",
                    filterable: true
                }
            ];
            vm.gridOptions_pack = {
                dataSource: common.gridDataSource(dataSource),
                filterable: common.kendoGridConfig().filterable,
                pageable: common.kendoGridConfig().pageable,
                noRecords: common.kendoGridConfig().noRecordMessage,
                columns: columns,
                resizable: true
            };
        }

        /**
         * 为打包计划添加项目
         */
        function projectForPackGrid(vm) {
            var dataSource = new kendo.data.DataSource({
                type: 'odata',
                transport: common.kendoGridConfig().transport(url_project),
                schema: common.kendoGridConfig().schema({
                    id: "id",
                    fields: {
                        isIncludYearPlan: {
                            type: "boolean"
                        }
                    }
                }),
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
                pageSize: 10,
                sort: {
                    field: "createdDate",
                    dir: "desc"
                },
                filter: [{
                    field: 'unitName',
                    operator: 'eq',
                    value: vm.userUnit.id
                },
                    {
                        field: 'isLatestVersion',
                        operator: 'eq',
                        value: true
                    },
                    {
                        field: 'isIncludYearPlan',
                        operator: 'eq',
                        value: false
                    }
                ]
            });
            var columns = [
                {
                    template: function (item) {
                        return kendo
                            .format(
                                "<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
                                item.projectNumber + "," + item.projectName + "," + item.isIncludYearPlan + "," + item.projectInvestSum + "," + item.id);
                    },
                    filterable: false,
                    width: 40,
                    title: "<input id='projects' type='checkbox'  class='checkbox'/>"
                },
                {
                    field: "projectName",
                    title: "项目名称",
                    width: 250,
                    filterable: true
                },
                {
                    field: "projectIndustry",
                    title: "项目行业",
                    width: 150,
                    filterable: {
                        ui: function (element) {
                            element.kendoDropDownList({
                                valuePrimitive: true,
                                dataSource: $linq(common.getBasicData())
                                    .where(function (x) {
                                        return x.identity == common.basicDataConfig().projectIndustry && x.pId == common.basicDataConfig().projectIndustry_ZF;
                                    })
                                    .toArray(),
                                dataTextField: "description",
                                dataValueField: "id",
                                filter: "startswith"
                            });
                        }
                    },
                    template: function (item) {
                        return common.getBasicDataDesc(item.projectIndustry);
                    }
                },
                {
                    field: "isIncludYearPlan",
                    title: "是否纳入年度计划",
                    width: 150,
                    filterable: true,
                    template: function (item) {
                        if (item.isIncludYearPlan) {
                            return "是";
                        } else {
                            return "否";
                        }
                    }
                },
                {
                    field: "",
                    title: "操作",
                    width: 80,
                    template: function (item) {
                        return common.format($('#columnBtn_projectsForPack').html(), item.projectNumber, item.projectName, item.isIncludYearPlan, item.projectInvestSum, item.id);
                    }
                }
            ];
            vm.gridOptions_projectForPack = {
                dataSource: common.gridDataSource(dataSource),
                filterable: common.kendoGridConfig().filterable,
                pageable: common.kendoGridConfig().pageable,
                noRecords: common.kendoGridConfig().noRecordMessage,
                columns: columns,
                resizable: true
            };
        }//end fun projectForPackGrid

        /**
         * 获取计划下达申请中的单列项目
         */
        function getShenBaoInfoFromPlanReachApplicationGrid(vm) {
            var dataSource = new kendo.data.DataSource({
                type: 'odata',
                transport: common.kendoGridConfig().transport(url + "/" + vm.id + "/shenBaoInfoList"),
                schema: common.kendoGridConfig().schema({
                    id: "id"
                }),
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
                pageSize: 10,
                sort: {
                    field: "createdDate",
                    dir: "desc"
                }
            });
            // End:dataSource

            // Begin:column
            var columns = [
                {
                    template: function (item) {
                        return common.format(
                            "<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
                            item.id);
                    },
                    filterable: false,
                    width: 40,
                    title: "<input id='checkboxAll' type='checkbox'  class='checkbox'/>",
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;"
                    }
                },
                {
                    field: "projectName",
                    title: "项目名称",
                    width: 300,
                    template: function (item) {
                        return common.format('<a href="#/project/projectInfo/{0}">{2}</a>', item.projectId, item.projectInvestmentType, item.projectName);
                    },
                    filterable: false,
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;",
                        rowspan: 2
                    }
                },
                {
                    field: "projectInvestSum",
                    title: "总投资",
                    width: 140,
                    filterable: false,
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;"
                    }
                },
                {
                    field: "apInvestSum",
                    title: "累计安排资金",
                    width: 140,
                    filterable: false,
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;"
                    }
                },
                {
                    title: "安排资金（万元）",
                    columns: [{
                        field: "apPlanReach_ggys",
                        title: "公共预算",
                        width: 80,
                        filterable: false,
                        headerAttributes: {
                            "class": "table-header-cell",
                            style: "text-align: center;"
                        }
                    }, {
                        field: "apPlanReach_gtzj",
                        title: "国土基金",
                        width: 80,
                        filterable: false,
                        headerAttributes: {
                            "class": "table-header-cell",
                            style: "text-align: center;"
                        }
                    }],
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;"
                    }
                },
                {
                    title: "申请资金（万元）",
                    columns: [{
                        field: "sqPlanReach_ggys",
                        title: "公共预算",
                        width: 120,
                        filterable: false,
                        template: function (item) {
                            vm.gg[item.id] = item.sqPlanReach_ggys;
                            var isShow = item.processState == common.basicDataConfig().processState_weikaishi || item.processState == common.basicDataConfig().processState_notpass || item.processState == common.basicDataConfig().processState_tuiwen;
                            if (vm.isStartProcess == 'true' && isShow == true) {
                                vm.isShow = true;
                            } else if (vm.isStartProcess == 'true' && isShow == false) {
                                vm.isShow = false;
                            } else if (vm.isStartProcess == 'false' && isShow == true) {
                                vm.isShow = true;
                            } else if (vm.isStartProcess == 'false' && isShow == false) {
                                vm.isShow = false;
                            }
                            return common.format($('#input').html(), item.id, item.sqPlanReach_ggys, vm.isShow);
                        },
                        headerAttributes: {
                            "class": "table-header-cell",
                            style: "text-align: center;vertical-align: middle;"
                        }
                    }, {
                        field: "sqPlanReach_gtzj",
                        title: "国土基金",
                        width: 120,
                        filterable: false,
                        template: function (item) {
                            vm.gt[item.id] = item.sqPlanReach_gtzj;
                            var isShow = item.processState == common.basicDataConfig().processState_weikaishi || item.processState == common.basicDataConfig().processState_notpass || item.processState == common.basicDataConfig().processState_tuiwen;
                            if (vm.isStartProcess == 'true' && isShow == true) {
                                vm.isShow = true;
                            } else if (vm.isStartProcess == 'true' && isShow == false) {
                                vm.isShow = false;
                            } else if (vm.isStartProcess == 'false' && isShow == true) {
                                vm.isShow = true;
                            } else if (vm.isStartProcess == 'false' && isShow == false) {
                                vm.isShow = false;
                            }
                            return common.format($('#input2').html(), item.id, item.sqPlanReach_gtzj, vm.isShow);
                        },
                        headerAttributes: {
                            "class": "table-header-cell",
                            style: "text-align: center;vertical-align: middle;"
                        }
                    }
                    ],
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;"
                    }

                },
                {
                    field: "processStage",
                    title: "审批阶段",
                    width: 160,
                    filterable: false,
                    template: function (item) {
                        return common.format("<span class='text-danger'>{0}</span>", item.processStage);
                    }
                },
                {
                    field: "processState",
                    title: "审批状态",
                    width: 150,
                    filterable: false,
                    template: function (item) {
                        return common.format("<span class='text-danger'>{0}</span>", common.getProcessStateDesc(item.processState));
                    }
                },
                {
                    field: "",
                    title: "操作",
                    width: 150,
                    filterable: false,
                    template: function (item) {
                        var isShow = item.processState == common.basicDataConfig().processState_weikaishi || item.processState == common.basicDataConfig().processState_notpass || item.processState == common.basicDataConfig().processState_tuiwen;
                        if (vm.isStartProcess == 'true' && isShow == true) {
                            vm.isShow = true;
                        } else if (vm.isStartProcess == 'true' && isShow == false) {
                            vm.isShow = false;
                        } else if (vm.isStartProcess == 'false' && isShow == true) {
                            vm.isShow = true;
                        } else if (vm.isStartProcess == 'false' && isShow == false) {
                            vm.isShow = false;
                        }
                        var isReceiver = item.receiver != null ? false : true;
                        return common.format($('#columnBtns_button_1').html(), item.id, vm.isShow, isReceiver);
                    },
                    attributes: {
                        style: "font-size: 14.5px"
                    },
                    headerAttributes: {
                        style: "text-align:center;font-size: 14.5px"
                    }
                }
            ];
            // End:column

            vm.shenBaoInfo_gridOptions = {
                excel: {
                    fileName: "年度计划编制.xlsx"
                },
                dataSource: common.gridDataSource(dataSource),
                filterable: common.kendoGridConfig().filterable,
                pageable: common.kendoGridConfig().pageable,
                noRecords: common.kendoGridConfig().noRecordMessage,
                columns: columns,
                resizable: true
            };
        }//end getShenBaoInfoFromPlanReachApplicationGrid

        /**
         * 获取计划下达中的打包项目
         */
        function getPackFromPlanGrid(vm) {
            var dataSource = new kendo.data.DataSource({
                type: 'odata',
                transport: common.kendoGridConfig().transport(url + "/" + vm.id + "/packPlanList"),
                schema: common.kendoGridConfig().schema({
                    id: "id"
                }),
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
                pageSize: 10,
                sort: {
                    field: "createdDate",
                    dir: "desc"
                }
            });
            // End:dataSource

            // Begin:column
            var columns = [
                {
                    template: function (item) {
                        return kendo
                            .format(
                                "<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
                                item.id);
                    },
                    filterable: false,
                    width: 40,
                    title: "<input id='checkboxAll' type='checkbox'  class='checkbox'/>",
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;"
                    }
                },
                {
                    field: "name",
                    title: "打包名称",
                    template: function (item) {
                        return common.format('<a href="#/planReach/packPlan/addProject/{0}/{1}" >{2}</a>', item.id, vm.isStartProcess, item.name);
                    },
                    width: 300,
                    filterable: false,
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;",
                        rowspan: 2
                    }
                },
                {
                    field: "year",
                    title: "年度",
                    width: 120,
                    filterable: false,
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;"
                    }
                },
                {
                    title: "安排资金（万元）",
                    columns: [
                        {
                            field: "capitalSCZ_ggys_TheYear",
                            title: "公共预算",
                            width: 100,
                            filterable: false,
                            headerAttributes: {
                                "class": "table-header-cell",
                                style: "text-align: center;"
                            }
                        },
                        {
                            field: "capitalSCZ_gtzj_TheYear",
                            title: "国土基金",
                            width: 100,
                            filterable: false,
                            headerAttributes: {
                                "class": "table-header-cell",
                                style: "text-align: center;"
                            }
                        },
                    ],
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;"
                    }
                },
                {
                    filed: "",
                    title: "操作",
                    width: 260,
                    template: function (item) {
                        return common.format($('#columnBtns_shenBaoInfo').html(), item.id, vm.isStartProcess);
                    },
                    attributes: {
                        style: "font-size: 14.5px"
                    },
                    headerAttributes: {
                        style: "text-align:center;font-size: 14.5px"
                    }
                }
            ];
            // End:column

            vm.packPlan_gridOptions = {
                excel: {
                    fileName: "年度计划编制.xlsx"
                },
                dataSource: common.gridDataSource(dataSource),
                filterable: common.kendoGridConfig().filterable,
                pageable: common.kendoGridConfig().pageable,
                noRecords: common.kendoGridConfig().noRecordMessage,
                columns: columns,
                resizable: true,
                scrollable: true
            };
        }//end fun getPackFromPlanGrid

        /**
         * 获取计划下达中打包计划中的申报项目
         */
        function getShenBaoInfoGridFromPackPlan(vm) {
            var dataSource = new kendo.data.DataSource({
                type: 'odata',
                transport: common.kendoGridConfig().transport(url + "/" + vm.id + "/shenBaoInfoFromPack"),
                schema: common.kendoGridConfig().schema({
                    id: "id"
                }),
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
                pageSize: 10,
                sort: {
                    field: "createdDate",
                    dir: "desc"
                }
            });
            // End:dataSource

            // Begin:column
            var columns = [
                {
                    template: function (item) {
                        return kendo
                            .format(
                                "<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
                                item.id);
                    },
                    filterable: false,
                    width: 40,
                    title: "<input id='checkboxAll' type='checkbox'  class='checkbox'/>",
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;"
                    }
                },
                {
                    field: "projectName",
                    title: "项目名称",
                    template: function (item) {
                        return common.format('<a href="#/project/projectInfo/{0}" >{2}</a>', item.id, item.projectInvestmentType, item.projectName);
                    },
                    width: 300,
                    filterable: false,
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;",
                        rowspan: 2
                    }
                },
                {
                    field: "projectInvestSum",
                    title: "总投资",
                    width: 120,
                    filterable: false,
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;"
                    }
                },
                {
                    field: "apInvestSum",
                    title: "累计安排资金",
                    width: 140,
                    filterable: false,
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;"
                    }
                },
                {
                    title: "安排资金（万元）",
                    columns: [
                        {
                            field: "apPlanReach_ggys",
                            title: "公共预算",
                            width: 100,
                            filterable: false,
                            headerAttributes: {
                                "class": "table-header-cell",
                                style: "text-align: center;"
                            }
                        },
                        {
                            field: "apPlanReach_gtzj",
                            title: "国土基金",
                            width: 100,
                            filterable: false,
                            headerAttributes: {
                                "class": "table-header-cell",
                                style: "text-align: center;"
                            }
                        },
                    ],
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;"
                    }
                },
                {
                    title: "申请资金（万元）",
                    columns: [
                        {
                            field: "sqPlanReach_ggys",
                            title: "公共预算",
                            width: 130,
                            filterable: false,
                            template: function (item) {
                                vm.gg[item.id] = item.sqPlanReach_ggys;
                                var isShow = item.processState == common.basicDataConfig().processState_weikaishi || item.processState == common.basicDataConfig().processState_notpass || item.processState == common.basicDataConfig().processState_tuiwen;
                                if (vm.isStartProcess == 'true' && isShow == true) {
                                    vm.isShow = true;
                                } else if (vm.isStartProcess == 'true' && isShow == false) {
                                    vm.isShow = false;
                                } else if (vm.isStartProcess == 'false' && isShow == true) {
                                    vm.isShow = true;
                                } else if (vm.isStartProcess == 'false' && isShow == false) {
                                    vm.isShow = false;
                                }
                                return common.format($('#input').html(), item.id, item.sqPlanReach_ggys, vm.isShow);
                            },
                            headerAttributes: {
                                "class": "table-header-cell",
                                style: "text-align: center;vertical-align: middle;"
                            }
                        },
                        {
                            field: "sqPlanReach_gtzj",
                            title: "国土基金",
                            width: 130,
                            filterable: false,
                            template: function (item) {
                                vm.gt[item.id] = item.sqPlanReach_gtzj;
                                var isShow = item.processState == common.basicDataConfig().processState_weikaishi || item.processState == common.basicDataConfig().processState_notpass || item.processState == common.basicDataConfig().processState_tuiwen;
                                if (vm.isStartProcess == 'true' && isShow == true) {
                                    vm.isShow = true;
                                } else if (vm.isStartProcess == 'true' && isShow == false) {
                                    vm.isShow = false;
                                } else if (vm.isStartProcess == 'false' && isShow == true) {
                                    vm.isShow = true;
                                } else if (vm.isStartProcess == 'false' && isShow == false) {
                                    vm.isShow = false;
                                }
                                return common.format($('#input2').html(), item.id, item.sqPlanReach_gtzj, vm.isShow);
                            },
                            headerAttributes: {
                                "class": "table-header-cell",
                                style: "text-align: center;vertical-align: middle;"
                            }
                        }
                    ],
                    headerAttributes: {
                        "class": "table-header-cell",
                        style: "text-align: center;vertical-align: middle;"
                    }
                },
                {
                    field: "processStage",
                    title: "审批阶段",
                    width: 160,
                    filterable: false,
                    template: function (item) {
                        return common.format("<span class='text-danger'>{0}</span>", item.processStage);
                    }
                },
                {
                    field: "processState",
                    title: "审批状态",
                    width: 150,
                    filterable: false,
                    template: function (item) {
                        return common.format("<span class='text-danger'>{0}</span>", common.getProcessStateDesc(item.processState));
                    }
                },
                {
                    field: "",
                    title: "操作",
                    width: 150,
                    filterable: false,
                    template: function (item) {
                        var isShow = item.processState == common.basicDataConfig().processState_weikaishi || item.processState == common.basicDataConfig().processState_notpass || item.processState == common.basicDataConfig().processState_tuiwen;
                        if (vm.isStartProcess == 'true' && isShow == true) {
                            vm.isShow = true;
                        } else if (vm.isStartProcess == 'true' && isShow == false) {
                            vm.isShow = false;
                        } else if (vm.isStartProcess == 'false' && isShow == true) {
                            vm.isShow = true;
                        } else if (vm.isStartProcess == 'false' && isShow == false) {
                            vm.isShow = false;
                        }
                        var isReceiver = item.receiver != null ? false : true;
                        return common.format($('#columnBtns_button_2').html(), item.id, vm.isShow, isReceiver);
                    },
                    attributes: {
                        style: "font-size: 14.5px"
                    },
                    headerAttributes: {
                        style: "text-align:center;font-size: 14.5px"
                    }
                }
            ];
            // End:column

            vm.shenBaoInfo_gridOptions_plan = {
                excel: {
                    fileName: "年度计划编制.xlsx"
                },
                dataSource: common.gridDataSource(dataSource),
                filterable: common.kendoGridConfig().filterable,
                pageable: common.kendoGridConfig().pageable,
                noRecords: common.kendoGridConfig().noRecordMessage,
                columns: columns,
                resizable: true,
                scrollable: true
            };
        }//end fun getShenBaoInfoGridFromPackPlan

        function shenbaoInfoGrid(vm) {
            var dataSource = new kendo.data.DataSource({
                type: 'odata',
                transport: common.kendoGridConfig().transport(url_shenbaoInfoList),
                schema: common.kendoGridConfig().schema({
                    id: "id",
                    fields: {
                        isIncludYearPlan: {
                            type: "boolean"
                        }
                    }
                }),
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
                pageSize: 10,
                sort: {
                    field: "createdDate",
                    dir: "desc"
                },
                filter: [{//申报阶段为下一年度计划
                    field: 'projectShenBaoStage',
                    operator: 'eq',
                    value: common.basicDataConfig().projectShenBaoStage_nextYearPlan
                },
                    {
                        field: 'unitName',
                        operator: 'eq',
                        value: vm.userUnit.id
                    },
                    {//审批状态为签收
                        field: 'processState',
                        operator: 'eq',
                        value: common.basicDataConfig().processState_pass
                    },
                    {
                        field: 'isIncludPack',
                        operator: 'eq',
                        value: false
                    }]
            });
            var columns = [
                {
                    template: function (item) {
                        return kendo
                            .format(
                                "<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>", item.id);
                    },
                    filterable: false,
                    width: 40,
                    title: "<input id='projects' type='checkbox'  class='checkbox'/>"
                },
                {
                    field: "projectName",
                    title: "项目名称",
                    width: 250,
                    filterable: true
                },
                {
                    field: "projectIndustry",
                    title: "项目行业",
                    width: 150,
                    filterable: {
                        ui: function (element) {
                            element.kendoDropDownList({
                                valuePrimitive: true,
                                dataSource: $linq(common.getBasicData())
                                    .where(function (x) {
                                        return x.identity == common.basicDataConfig().projectIndustry && x.pId == common.basicDataConfig().projectIndustry_ZF;
                                    })
                                    .toArray(),
                                dataTextField: "description",
                                dataValueField: "id",
                                filter: "startswith"
                            });
                        }
                    },
                    template: function (item) {
                        return common.getBasicDataDesc(item.projectIndustry);
                    }
                },
                {
                    field: "isIncludYearPlan",
                    title: "是否纳入年度计划",
                    width: 150,
                    filterable: true,
                    template: function (item) {
                        if (item.isIncludYearPlan) {
                            return "是";
                        } else {
                            return "否";
                        }
                    }
                }
            ];
            vm.gridOptions_shenbaoInfo = {
                dataSource: common.gridDataSource(dataSource),
                filterable: common.kendoGridConfig().filterable,
                pageable: common.kendoGridConfig().pageable,
                noRecords: common.kendoGridConfig().noRecordMessage,
                columns: columns,
                resizable: true
            };
        }//end fun projectGrid
    }
})();