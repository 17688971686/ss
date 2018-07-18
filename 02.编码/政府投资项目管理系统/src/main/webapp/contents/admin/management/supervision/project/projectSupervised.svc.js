(function() {
    'use strict';

    angular.module('appSupervision').factory('projectSupervisedSvc', project);

    project.$inject = [ '$http','$timeout' ];

    function project($http,$timeout) {
        var url_project = "/management/supervision/project";//获取项目信息数据
        var url_project_shenbaoAdmin = "/shenbaoAdmin/project";
        var url_userUnit　= "/shenbaoAdmin/userUnitInfo";
        var url_back = "#/supervision/tzxm";
        var service = {
            grid : grid,
            getDiagramViewerInfo:getDiagramViewerInfo,
            getProjectById : getProjectById,
            getProjectUnit : getProjectUnit
        };

        return service;
        
        // begin#grid
        function grid(vm) {
            // Begin:dataSource
            var dataSource = new kendo.data.DataSource({
                type : 'odata',
                transport : common.kendoGridConfig().transport(common.format(url_project+"/unitName")),
                schema : common.kendoGridConfig().schema({
                    id : "id"
                }),
                serverPaging : true,
                serverSorting : true,
                serverFiltering : true,
                pageSize : 10,
                sort : {
                    field : "createdDate",
                    dir : "desc"
                },
                filter:[
                    {
                        field:"projectInvestmentType",
                        operator:"eq",
                        value:common.basicDataConfig().projectInvestmentType_ZF
                    },
                    {
                        field:"projectShenBaoStage",
                        operator:"eq",
                        value:"projectShenBaoStage_1"
                    }
                ]
            });
            // End:dataSource

            // Begin:column
            var columns = [
                /*{
                    field : "projectNumber",
                    title : "项目代码",
                    width : 180,
                    filterable : false
                },*/
                {
                    field : "projectName",
                    title : "项目名称",
                    width : 250,
                    template:function(item){
                    	debugger
                        return common.format("<a href='#/projectDetails/{0}/{1}'>{2}</a>",item.projectId,item.projectInvestmentType,item.projectName);
                    },
                    filterable : true
                },
                {
                    field : "unitName",
                    title : "项目所属单位",
                    width : 150,
                    filterable:{
                        ui: function(element){
                            element.kendoDropDownList({
                                valuePrimitive: true,
                                dataSource: vm.basicData.userUnit,
                                dataTextField: "unitName",
                                dataValueField: "id"
                            });
                        }
                    },
                    template:function(item){
                        return common.getUnitName(item.unitName);
                    }
                },
                {
                    field : "projectStage",
                    title : "项目阶段",
                    width : 150,
                    template:function(item){
                        return common.getBasicDataDesc(item.projectStage);
                    },
                    filterable : {
                        ui: function(element){
                            element.kendoDropDownList({
                                valuePrimitive: true,
                                dataSource: common.getBacicDataByIndectity(common.basicDataConfig().projectStage),
                                dataTextField: "description",
                                dataValueField: "id"
                            });
                        }
                    }
                },
                {
                    field : "projectClassify",
                    title : "项目分类",
                    width : 150,
                    template:function(item){
                        return common.getBasicDataDesc(item.projectClassify);
                    },
                    filterable : false
                },
                {
                    field : "isMonthReport",
                    title : "是否月报",
                    template : function(item) {
                        if(item.isMonthReport){
                            return "是";
                        }else if(!item.isMonthReport){
                            return "否";
                        }
                    },
                    width : 150,
                    filterable : true
                },
                {
                    field : "",
                    title : "操作",
                    width : 250,
                    template : function(item) {
                        return common.format($('#columnBtns').html(),item.id,item.projectInvestmentType,"vm.getDiagramViewerInfo('" + item.monitor_processId + "','"+ item.id +"')","vm.isMonthReport('" +item.id+ "','"+item.isMonthReport+"')");
                    }

                }

            ];
            // End:column
            vm.gridOptions = {
                dataSource : common.gridDataSource(dataSource),
                filterable : common.kendoGridConfig().filterable,
                pageable : common.kendoGridConfig().pageable,
                noRecords : common.kendoGridConfig().noRecordMessage,
                columns : columns,
                resizable : true
            };

        }// end fun grid
        
        function getDiagramViewerInfo(vm,id,shenBaoInfoId){
            var httpOptions = {
                    method : 'get',
                    url : url_project + '/getDiagramViewerInfo?processInstanceId=' + id + "&shenBaoInfoId=" + shenBaoInfoId,
                };

                var httpSuccess = function success(response) {
                	 vm.diagramViewerUrl = "contents/diagram-viewer/index.html?processDefinitionId=" + response.data.processDefinitionId + "&processInstanceId=" + response.data.processInstanceId + "&shenBaoInfoId=" + shenBaoInfoId + "&roleType=" + response.data.roleType;
                	 
                	 $('#myModal_monitor').modal('show');
                     
                };

                common.http({
                    vm : vm,
                    $http : $http,
                    httpOptions : httpOptions,
                    success : httpSuccess
                });
        }
        
		/**
		 * 通过项目代码查询项目信息
		 */
		function getProjectById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project_shenbaoAdmin + "?$filter=id eq '{0}'", vm.id)
				};
			
			var httpSuccess = function success(response) {
				vm.model = response.data.value[0]||{};
				
				//查询项目的所属单位的单位名称
			   	getProjectUnit(vm);

			   	//项目类型的处理--多选框回显
			   	vm.model.projectType = common.stringToArray(vm.model.projectType,',');
				//日期展示
				vm.model.beginDate=common.formatDate(vm.model.beginDate);//开工日期
				vm.model.endDate=common.formatDate(vm.model.endDate);//竣工日期
				vm.model.pifuJYS_date=common.formatDate(vm.model.pifuJYS_date);//项目建议书批复日期			
				vm.model.pifuKXXYJBG_date=common.formatDate(vm.model.pifuKXXYJBG_date);//可行性研究报告批复日期
				vm.model.pifuCBSJYGS_date=common.formatDate(vm.model.pifuCBSJYGS_date);//初步设计与概算批复日期
				//如果是编辑页面并且为社会投资项目，则项目行业需要进行处理进行显示
				if(vm.page=='update' && vm.model.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){
					var child = $linq(common.getBasicData())
	        		.where(function(x){return x.id==vm.model.projectIndustry;})
	        		.toArray()[0];
					if(child.pId=="projectIndustry"){
						vm.model.projectIndustryParent=child.id;
					}else{
						vm.model.projectIndustryParent=child.pId;
					}
						vm.projectIndustryChange();
				}
				if(vm.page == 'projectInfo'){
					if(vm.model.projectInvestmentType==common.basicDataConfig().projectInvestmentType_ZF){//如果是政府投资
			 			  vm.isZFInvestment = true;
			 			 //相关附件文件上传文件种类
			 			  vm.relatedType=common.uploadFileTypeConfig().projectEdit;
			 		   }else if(vm.model.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){//如果是社会投资		  
			 			  vm.isSHInvestment = true;
			 			 //相关附件文件上传文件种类
			 			  vm.relatedType=common.uploadFileTypeConfig().projectEdit_SH;
			 		   }
				}
				// 国民经济行业分类
				var child2 = $linq(common.getBasicData()).where(function(x) {
					return x.id == vm.model.nationalIndustry
				}).toArray()[0];
				if (child2) {
					vm.model.nationalIndustryParent = child2.pId;
					vm.nationalIndustryChange();
				}
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 *获取项目单位信息 
		 */
		function getProjectUnit(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_userUnit + "/id?$filter=id eq '{0}'", vm.model.unitName)
				};
				var httpSuccess = function success(response) {
					vm.userUnit = response.data.value[0] || {};
				};
				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
        
    }
})();