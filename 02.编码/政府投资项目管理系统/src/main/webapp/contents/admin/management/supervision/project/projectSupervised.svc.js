(function() {
	'use strict';

	angular.module('appSupervision').factory('projectSupervisedSvc', project);

	project.$inject = [ '$http' ];

	function project($http) {
		var url_project = "/management/supervision/project";//获取项目信息数据
		var url_userUnit = "/management/userUnit";//获取单位信息
		var url_back = "#/supervision/tzxm";
		var url_backSH = "#/project_SH";
		var url_document="/management/replyFile";
		var service = {
			grid : grid,
			statistical:statistical,
			grid_SH:grid_SH,
			getProjectById:getProjectById,
			getUserUnits:getUserUnits,
			updateProject:updateProject,
			createProject:createProject,
			updateIsMonthReport:updateIsMonthReport,
			documentRecordsGird:documentRecordsGird,
			shenpiUnitGrid:shenpiUnitGrid,
			getShenPiUnitById:getShenPiUnitById,
			updateShenpiUnit:updateShenpiUnit,
			createShenpiUnit:createShenpiUnit,
			delShenPiUnit:delShenPiUnit,
			shenpiItemsGrid:shenpiItemsGrid,
			getShenPiItemsById:getShenPiItemsById,
			projectGrid:projectGrid,
			shenpiUnitGridSelect:shenpiUnitGridSelect,
			updateShenpiItems:updateShenpiItems,
			createShenpiItems:createShenpiItems,
			delShenPiItem:delShenPiItem,
			shenpifankuiItemsGrid:shenpifankuiItemsGrid,
			shenpiOverdueGrid:shenpiOverdueGrid,
			projectItems:projectItems
			
		};

		return service;
		//逾期事项项目所以的事项
		function projectItems(vm,id){

			var httpOptions = {
					method : 'get',
					url : common.format(url_project+"/shenpiItems" + "?$filter=projectId eq '{0}'", id)
				};
			
			var httpSuccess = function success(response) {
				vm.projectItemsModel = response.data.value;
				for (var i = 0; i < vm.projectItemsModel.length; i++) {
					if(vm.projectItemsModel[i].shenpiResult){
						vm.projectItemsModel[i].shenpiEndDate= "审批结束";
						continue;
					}
					var falg1=new Date(vm.projectItemsModel[i].shenpiBeginDate).getTime()-new Date(common.formatDate(new Date())).getTime();
					var flag=((new Date(vm.projectItemsModel[i].shenpiEndDate).getTime())-(new Date(common.formatDate(new Date())).getTime()))/(24 * 60 * 60 * 1000);
					if(falg1>0){
						vm.projectItemsModel[i].shenpiEndDate="尚未开始";
					}
					else{vm.projectItemsModel[i].shenpiEndDate= flag ;}	
				}
				
				console.log(vm.projectItemsModel);
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		
			
		}
		
		function delShenPiItem(vm,id) {
            vm.isSubmit = true;
            var httpOptions = {
                method: 'post',
                url:url_project+"/delShenPiItem",
                data:id 
            };
            var httpSuccess = function success(response) {
                
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    vm.isSubmit = false;
	                    vm.gridOptions.dataSource.read();
	                }
					
				});
            };
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
        }// end fun delete
		// begin#statistical 统计代码  xdf
        function statistical(vm) {
/*            $http({
                method: 'GET',
                url:  url_project+"/shenpiItems"
            }).then(function successCallback(response) {
                console.log(response);
            }, function errorCallback(response) {
                // 请求失败执行代码
                console.log(response);
            });*/


            $http({
                method: 'GET',
                url: url_project+"/unitName"
            }).then(function successCallback(response) {

            	 //console.log(response);
                 var  resData=response.data.value;
                 var  i;
                 var  toTaData={
                                 projectName:[],Stage1:[],Stage2:[],Stage3:[],Stage4:[],Stage5:[],Stage6:[],tMonth:[],fMonth:[]
				                };


                 for (i in resData)
					   {
						   if(resData[i].isIncludLibrary==true && resData[i].projectInvestmentType==common.basicDataConfig().projectInvestmentType_ZF && resData[i].isLatestVersion==true){
                               toTaData.projectName[i]=resData[i].projectName;

                               switch(resData[i].projectStage)
                               {
                                   case "projectStage_1":
                                       toTaData.Stage1[i]=resData[i].projectName;
                                       break;
                                   case "projectStage_2":
                                       toTaData.Stage2[i]=resData[i].projectName;
                                       break;
                                   case "projectStage_3":
                                       toTaData.Stage3[i]=resData[i].projectName;
                                       break;
                                   case "projectStage_4":
                                       toTaData.Stage4[i]=resData[i].projectName;
                                       break;
                                   case "projectStage_5":
                                       toTaData.Stage5[i]=resData[i].projectName;
                                       break;
                                   case "projectStage_6":
                                       toTaData.Stage6[i]=resData[i].projectName;
                                       break;

                               }
                               if(resData[i].isMonthReport==true){
                                   toTaData.tMonth[i]=resData[i].projectName;
							   }else{
                                   toTaData.fMonth[i]=resData[i].projectName;
							   }


                           }
					   }
              //  dataAnimate(sticalcount(toTaData.projectName));
				vm.statistical={
                	total:sticalcount(toTaData.projectName),
                    Stage1:{
                        num : sticalcount(toTaData.Stage1),
                        width : sticalcount(toTaData.Stage1)/sticalcount(toTaData.projectName)*100+"%"
                    },
                    Stage2:{
                        num : sticalcount(toTaData.Stage2),
                        width : sticalcount(toTaData.Stage2)/sticalcount(toTaData.projectName)*100+"%"
                    },
                    Stage3:{
                        num : sticalcount(toTaData.Stage3),
                        width : sticalcount(toTaData.Stage3)/sticalcount(toTaData.projectName)*100+"%"
                    },
                    Stage4:{
                        num : sticalcount(toTaData.Stage4),
                        width : sticalcount(toTaData.Stage4)/sticalcount(toTaData.projectName)*100+"%"
                    },
                    Stage5:{
                        num : sticalcount(toTaData.Stage5),
                        width : sticalcount(toTaData.Stage5)/sticalcount(toTaData.projectName)*100+"%"
                    },
                    Stage6:{
                        num : sticalcount(toTaData.Stage6),
                        width : sticalcount(toTaData.Stage6)/sticalcount(toTaData.projectName)*100+"%"
                    },
                    tMonth:{
                        num : sticalcount(toTaData.tMonth),
                        percent : sticalcount(toTaData.tMonth)/sticalcount(toTaData.projectName)*100+"%"
                    },
                    fMonth:{
                        num : sticalcount(toTaData.fMonth),
                        percent : sticalcount(toTaData.fMonth)/sticalcount(toTaData.projectName)*100+"%"
                    }
				};

            //console.log(vm.statistical);

            }, function errorCallback(response) {
                // 请求失败执行代码
                console.log(response);
            });

            /////////////////////////审批进程中项目列表////////////////////////////////////

        }

     function sticalcount(vm){
         var t = typeof vm;
             var n = 0;
             for(var i in vm){
                 n++;
             }
         if(n>0){
             return n;
          }
         return 0;
	 }
        // 统计结束
		function delShenPiUnit(vm,id) {
            vm.isSubmit = true;
            var httpOptions = {
                method: 'post',
                url:url_project+"/delShenPiUnit",
                data:id 
            };
            var httpSuccess = function success(response) {
                
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    vm.isSubmit = false;
	                    vm.gridOptions.dataSource.read();
	                }
					
				});
            };
            common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
        }// end fun delete
		//审批事项逾期 begin shenpiOverdueGrid
		function shenpiOverdueGrid(vm){

			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_project+"/shenpiItemsOverdue")),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						createdDate : {
							type : "date"
						},
						isMonthReport:{
							type:"boolean"
						},
						isIncludLibrary:{
							type:"boolean"
						}
						
					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 5,
				sort : {
					field : "createdDate",
					dir : "desc"
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
					
					 {
						field : "shenpiName",
						title : "审批事项",				
						filterable : false
					},
					 {
						field : "projectName",
						title : "审批项目",
						width : '',						
						filterable : false
					},
					 {
						field : "shenpiUnitName",
						title : "审批单位",
						width : "",						
						filterable : false
					},
					{
						
						field : "",
						title : "剩余天数",
						width : "",			
						template : function(item) {
							var falg1=new Date(item.shenpiBeginDate).getTime()-new Date(common.formatDate(new Date())).getTime();
							var flag=((new Date(item.shenpiEndDate).getTime())-(new Date(common.formatDate(new Date())).getTime()))/(24 * 60 * 60 * 1000);
							if(falg1>0){
								return"尚未开始";
							}
							else{
							if(flag>0){
								return  flag ;}
							else{
								return  "<span style='color:red'>" +flag+"</span>";}
							}
							}
					},
					{
						field : "",
						title : "操作",
						width : "",
						template : function(item) {
							return common.format($('#shenpinColumnBtns').html(),item.projectDto.id);
						}

					}

			];
			
			//vm.shenpiOverdueCount=
			var dataBound= function(e) {
				  };
			 vm.shenpiOverdueGridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				dataBound:dataBound,
				resizable : true
			};
		}
		//end shenpiOverdueGrid
		// begin#grid
		function shenpiUnitGridSelect(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_project+"/shenpiUnit")),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						createdDate : {
							type : "date"
						},
						isMonthReport:{
							type:"boolean"
						},
						isIncludLibrary:{
							type:"boolean"
						}
						
					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input  type='radio'  relId='{0}' value='{0}' name='radio1' class='radio' />",
											item.id+","+item.shenpiUnitName);
						},
						filterable : false,
						width : 40,
						title : ""

					},
					{
						field : "shenpiUnitName",
						title : "单位名称",
						template:"",
						filterable : true
					},
					{
						field : "contacts",
						title : "单位负责人",
						template:"",
						filterable : true
					},
					{
						field : "contactsTel",
						title : "联系人电话",
						template:"",
						filterable : true
					}
			];
			// End:column

			vm.shenpiUnitGridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}// end fun grid
		// begin#grid
		function projectGrid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format("/management/project/unitName")),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						createdDate : {
							type : "date"
						},
						isMonthReport:{
							type:"boolean"
						},
						isIncludLibrary:{
							type:"boolean"
						}
						
					}
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
						field:"isLatestVersion",
						operator:"eq",
						value:true
					},{
						field:"isIncludLibrary",
						operator:"eq",
						value:true
					}
				]
			});
			// End:dataSource

			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input  type='radio'  relId='{0}' value='{0}' name='radio' class='radio' />",
											item.id+","+item.projectName);
						},
						filterable : false,
						width : 40,
						title : ""

					},
					{
						field : "projectName",
						title : "项目名称",
						template:function(item){
							return common.format("<a href='#/projectDetails/{0}/{1}'>{2}</a>",item.id,item.projectInvestmentType,item.projectName);
						},
						filterable : true
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
					}
					
				

			];
			// End:column

			vm.projectGridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}// end fun grid
		function createShenpiUnit(vm) {
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
	            vm.model.type=vm.type;	        
				var httpOptions = {
					method : 'post',
					url : url_project+"/createShenpiUnit",
					data : vm.model
				};
				var httpSuccess = function success(response) {				
					
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function() {							
							
							common.alert({
								vm:vm,
								msg:"操作成功",
								fn:function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									location.href = "#/supervision/spdw";
								}
							});
						}
						
					});

				};

				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});

			} else {				
			}
		}// end func create
		function createShenpiItems(vm) {
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
	            vm.model.type=vm.type;	        
				var httpOptions = {
					method : 'post',
					url : url_project+"/createShenpiItems",
					data : vm.model
				};
				var httpSuccess = function success(response) {				
					
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function() {							
							
							common.alert({
								vm:vm,
								msg:"操作成功",
								fn:function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									location.href = "#/supervision/spsx";
								}
							});
						}
						
					});

				};

				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});

			} else {				
			}
		}// end func create
		/**
		 *获取审批事项信息 
		 */
		function getShenPiItemsById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project+"/shenpiItems" + "?$filter=id eq '{0}'", vm.id)
				};
			
			var httpSuccess = function success(response) {
				vm.model = response.data.value[0] || {};
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		/**
		 *获取审批单位信息 
		 */
		function getShenPiUnitById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project+"/shenpiUnit" + "?$filter=id eq '{0}'", vm.id)
				};
			
			var httpSuccess = function success(response) {
				vm.model = response.data.value[0] || {};
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		/**
		 * 获取当前登录用户用户的单位信息
		 */
		function getUserUnits(vm){
			var httpOptions = {
					method : 'get',
					url : url_userUnit
				};
				var httpSuccess = function success(response) {
					vm.userUnits = response.data.value;
				};
				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
		/*
		 * 审批事项编辑
		 * 
		 */
		function updateShenpiItems(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				vm.model.id=vm.id;// id			
				var httpOptions = {
					method : 'post',
					url : url_project+"/updateShenpiItems",
					data : vm.model
				};

				var httpSuccess = function success(response) {
					
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function() {
							
							common.alert({
								vm:vm,
								msg:"操作成功",
								fn:function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');							
								}
							});
						}
						
					});
				};

				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});

			} else {
			}
		}// end fun update
		/*
		 * 审批单位编辑
		 * 
		 */
		function updateShenpiUnit(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				vm.model.id=vm.id;// id			
				var httpOptions = {
					method : 'post',
					url : url_project+"/updateShenpiUnit",
					data : vm.model
				};

				var httpSuccess = function success(response) {
					
					common.requestSuccess({
						vm:vm,
						response:response,
						fn:function() {
							
							common.alert({
								vm:vm,
								msg:"操作成功",
								fn:function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');							
								}
							});
						}
						
					});
				};

				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});

			} else {
			}
		}// end fun update
		/**
		 * 创建项目
		 */		
		function createProject(vm){		 		   
			common.initJqValidation();
			var isValid = $('form').valid();        
			if (isValid) {
				vm.isSubmit = true;	
				vm.model.projectType=common.arrayToString(vm.model.projectType,',');//项目类型的处理

				var httpOptions = {
					method : 'post',
					url : url_project,
					data : vm.model
				};

				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm : vm,
						response : response,
						fn : function() {
							common.alert({
								vm : vm,
								msg : "操作成功",
								fn : function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();
									if(vm.isZFInvestment){
										location.href=url_back;
									}else if(vm.isSHInvestment){
										location.href=url_backSH;
									}									
								}
							});
						}
					});
				};

				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
			}else{
				common.alert({
					vm:vm,
					msg:"您填写的信息不正确,请核对后提交!"
				});

			}
		}
		//end#createProject
		
		/**
		 * 更新是否填写月报
		 */
		function updateIsMonthReport(vm){
			var httpOptions = {
					method : 'post',
					url : url_project+"/isMonthReport",
					data : vm.model
				};

				var httpSuccess = function success(response) {
					//关闭模态框
					$("#myModal_edit").modal('hide');
					//刷新表格数据
					if(vm.isZFInvestment){
						vm.gridOptions.dataSource.read(); 
					}else if(vm.isSHInvestment){
						vm.gridOptions_SH.dataSource.read(); 
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
		 * 更新项目信息
		 */
		//begin#updateProject
		function updateProject(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				vm.model.projectType=common.arrayToString(vm.model.projectType,',');
				
				var httpOptions = {
					method : 'post',
					url : url_project+'/updateProject',
					data : vm.model
				};

				var httpSuccess = function success(response) {
					common.requestSuccess({
						vm : vm,
						response : response,
						fn : function() {
							common.alert({
								vm : vm,
								msg : "操作成功",
								fn : function() {
									vm.isSubmit = false;
									$('.alertDialog').modal('hide');
									$('.modal-backdrop').remove();						
									if(vm.isZFInvestment){
										location.href=url_back;
									}else if(vm.isSHInvestment){
										location.href=url_backSH;
									}
								}
							});
						}
					});
				};

				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});

			} else {
				 common.alert({
				 vm:vm,
				 msg:"您填写的信息不正确,请核对后提交!"
				 });
			}
		}
		//end#updateProject
		
		
		
		/**
		 * 通过项目代码查询项目信息
		 */
		//begin#getProjectById
		function getProjectById(vm){
			
			var httpOptions = {
					method : 'get',
					url : common.format(url_project + "?$filter=id eq '{0}'", vm.id)
				};
			
			var httpSuccess = function success(response) {
				vm.model = response.data.value[0]||{};
				
				//查询项目的所属单位的单位名称
			   	getProjectUnit(vm);

			   	//项目类型的处理--多选框回显					
				vm.model.projectType=common.stringToArray(vm.model.projectType,',');

				//日期展示
				vm.model.beginDate=common.formatDate(vm.model.beginDate);//开工日期
				vm.model.endDate=common.formatDate(vm.model.endDate);//竣工日期
				vm.model.pifuJYS_date=common.formatDate(vm.model.pifuJYS_date);//项目建议书批复日期			
				vm.model.pifuKXXYJBG_date=common.formatDate(vm.model.pifuKXXYJBG_date);//可行性研究报告批复日期
				vm.model.pifuCBSJYGS_date=common.formatDate(vm.model.pifuCBSJYGS_date);//初步设计与概算批复日期
				
				//金额处理
        		vm.model.projectInvestSum=common.toMoney(vm.model.projectInvestSum);//项目总投资
				vm.model.projectInvestAccuSum=common.toMoney(vm.model.projectInvestAccuSum);//累计完成投资
				vm.model.capitalSCZ_ggys=common.toMoney(vm.model.capitalSCZ_ggys);//市财政-公共预算
				vm.model.capitalSCZ_gtzj=common.toMoney(vm.model.capitalSCZ_gtzj);//市财政-国土资金
				vm.model.capitalSCZ_zxzj=common.toMoney(vm.model.capitalSCZ_zxzj);//市财政-专项资金
				vm.model.capitalQCZ_ggys=common.toMoney(vm.model.capitalQCZ_ggys);//区财政-公共预算
				vm.model.capitalQCZ_gtzj=common.toMoney(vm.model.capitalQCZ_gtzj);//区财政-国土资金
				vm.model.capitalZYYS=common.toMoney(vm.model.capitalZYYS);//中央预算内投资
				vm.model.capitalSHTZ=common.toMoney(vm.model.capitalSHTZ);//社会投资
				vm.model.capitalOther=common.toMoney(vm.model.capitalOther);//其他
				if(vm.page=='update'){
					if(vm.model.projectInvestmentType == common.basicDataConfig().projectInvestmentType_SH){//社会投资项目
						//项目行业归口
						var child = $linq(common.getBasicData()).where(function(x){return x.id==vm.model.projectIndustry;}).toArray()[0];
		        		vm.model.projectIndustryParent=child.pId;
		        		vm.projectIndustryChange();	
					}     		        		
				}
				if(vm.page=='details'){				
					//计算资金筹措总计
					//资金来源计算
			   		 vm.capitalTotal=function(){
			   			 return common.getSum([
			   					 vm.model.capitalSCZ_ggys||0,vm.model.capitalSCZ_gtzj||0,vm.model.capitalSCZ_zxzj||0,
			   					 vm.model.capitalQCZ_ggys||0,vm.model.capitalQCZ_gtzj||0,
			   					 vm.model.capitalSHTZ||0,vm.model.capitalZYYS||0,
			   					 vm.model.capitalOther||0]);
			   		 };		
				}
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		//end#getProjectById
		
		//文件选择模态框
		function documentRecordsGird(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_document),						
				schema : common.kendoGridConfig().schema({
					id : "id"
					
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10
					
			});
			// End:dataSource
			// Begin:column
			var columns = [
				{
					template : function(item) {
						return kendo
								.format(
										"<input type='radio'  relId='{0},{1},{2}' name='checkbox'/>",
										item.number,item.name,item.fullName);
					},
					filterable : false,
					width : 40,
					title : ""
				},
				{
					field : "number",
					title : "文号",
					width:180,
					
					filterable : true
				},
				{
					field : "name",
					title : "文件名",
					width : 550,
					template:function(item){
						return common.format("<a href='/contents/upload/{1}'>{0}</a>",item.name,item.fullName);
					},
					filterable : true
					
				}
				
		];
			// End:column

			vm.gridOptions_documentRecords = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		}
		// begin#grid
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_project+"/unitName")),
				schema : common.kendoGridConfig().schema({
					id : "id"
//					fields : {
//						createdDate : {
//							type : "date"
//						},
//						isMonthReport:{
//							type:"boolean"
//						},
//						isIncludLibrary:{
//							type:"boolean"
//						}
//						
//					}
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
						field:"isLatestVersion",
						operator:"eq",
						value:true
					},{
						field:"isIncludLibrary",
						operator:"eq",
						value:true
					}
				]
			});
			// End:dataSource

			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
											item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

					},
					 {
						field : "projectNumber",
						title : "项目代码",
						width : 180,						
						filterable : false
					},
					{
						field : "projectName",
						title : "项目名称",
						width : 250,
						template:function(item){
							return common.format("<a href='#/projectDetails/{0}/{1}'>{2}</a>",item.id,item.projectInvestmentType,item.projectName);
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
							return common.format($('#columnBtns').html(),item.id,item.projectInvestmentType,"vm.isMonthReport('" +item.id+ "','"+item.isMonthReport+"')");
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
		// begin#shenpifankuiItemsGrid
		function shenpifankuiItemsGrid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_project+"/shenpiItems")),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						createdDate : {
							type : "date"
						},
						isMonthReport:{
							type:"boolean"
						},
						isIncludLibrary:{
							type:"boolean"
						}
						
					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
											item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

					},
					
					 {
						field : "shenpiName",
						title : "审批事项",				
						filterable : false
					},
					 {
						field : "projectName",
						title : "审批项目",
						width : '',						
						filterable : false
					},
					 {
						field : "shenpiUnitName",
						title : "审批单位",
						width : "",						
						filterable : false
					},
{
						
						field : "",
						title : "剩余天数",
						width : "",			
						template : function(item) {
							if(item.shenpiResult){
								return "审批结束";
							}
							var falg1=new Date(item.shenpiBeginDate).getTime()-new Date(common.formatDate(new Date())).getTime();
							var flag=((new Date(item.shenpiEndDate).getTime())-(new Date(common.formatDate(new Date())).getTime()))/(24 * 60 * 60 * 1000);
							if(falg1>0){
								return"尚未开始";
							}
							else{
							if(flag>0){
								return  flag ;}
							else{
								return  "<span style='color:red'>" +flag+"</span>";}
							}
							}
					},
					{
						field : "",
						title : "操作",
						width : "",
						template : function(item) {
							return common.format($('#columnBtns').html(),item.id);
						}

					}

			];
			// End:column
			var dataBound= function(e) {
				    console.log(e);
				  };
			vm.gridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				dataBound:dataBound,
				resizable : true
			};

		}// end fun shenpifankuiItemsGrid
		// begin#shenpiItemsGrid
		function shenpiItemsGrid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_project+"/shenpiItems")),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						createdDate : {
							type : "date"
						},
						isMonthReport:{
							type:"boolean"
						},
						isIncludLibrary:{
							type:"boolean"
						}
						
					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
											item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

					},
					
					 {
						field : "shenpiName",
						title : "审批事项",				
						filterable : false
					},
					 {
						field : "projectName",
						title : "审批项目",
						width : '',						
						filterable : false
					},
					 {
						field : "shenpiUnitName",
						title : "审批单位",
						width : "",						
						filterable : false
					},
					{
						
						field : "",
						title : "剩余天数",
						width : "",			
						template : function(item) {
							if(item.shenpiResult){
								return "审批结束";
							}
							var falg1=new Date(item.shenpiBeginDate).getTime()-new Date(common.formatDate(new Date())).getTime();
							var flag=((new Date(item.shenpiEndDate).getTime())-(new Date(common.formatDate(new Date())).getTime()))/(24 * 60 * 60 * 1000);
							if(falg1>0){
								return"尚未开始";
							}
							else{
							if(flag>0){
								return  flag ;}
							else{
								return  "<span style='color:red'>" +flag+"</span>";}
							}
							}
					},
					{
						field : "",
						title : "操作",
						width : "",
						template : function(item) {
							return common.format($('#columnBtns').html(),item.id);
						}

					}

			];
			// End:column
			var dataBound= function(e) {
				    console.log(e);
				  };
			vm.gridOptions = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				dataBound:dataBound,
				resizable : true
			};

		}// end fun shenpiItemsGrid
		// begin#shenpiUnitGrid
		function shenpiUnitGrid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_project+"/shenpiUnit")),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						createdDate : {
							type : "date"
						},
						isMonthReport:{
							type:"boolean"
						},
						isIncludLibrary:{
							type:"boolean"
						}
						
					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "createdDate",
					dir : "desc"
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
											item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

					},
					 {
						field : "shenpiUnitName",
						title : "单位名称",
						width : "",						
						filterable : false
					},
					 {
						field : "contacts",
						title : "单位负责人",
						width : '',						
						filterable : false
					},
					 {
						field : "contactsTel",
						title : "单位负责人电话",
						width : "",						
						filterable : false
					},
					{
						field : "",
						title : "操作",
						width : "",
						template : function(item) {
							return common.format($('#columnBtns').html(),item.id);
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
		
		// begin
		function grid_SH(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_project),
				schema : common.kendoGridConfig().schema({
					id : "id",
					fields : {
						createdDate : {
							type : "date"
						},
						isMonthReport:{
							type:"boolean"
						},
						isIncludLibrary:{
							type:"boolean"
						}
						
					}
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
						field:"isLatestVersion",
						operator:"eq",
						value:true
					},{
						field:"projectInvestmentType",
						operator:"eq",
						value:common.basicDataConfig().projectInvestmentType_SH
					}
				]
			});
			// End:dataSource

			// Begin:column
			var columns = [
					{
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",
											item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

					},
					 {
						field : "projectNumber",
						title : "项目代码",
						width : 180,						
						filterable : false
					},
					{
						field : "projectName",
						title : "项目名称",
						template:function(item){
							return common.format("<a href='#/projectDetails/{0}/{1}'>{2}</a>",item.id,item.projectInvestmentType,item.projectName);
						},
						filterable : true
					},
					{
						field : "unitName",
						title : "建设单位",
						width : 150,
						filterable : true
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
							return common.format($('#columnBtns').html(),item.id,item.projectInvestmentType,"vm.isMonthReport('" +item.id+ "','"+item.isMonthReport+"')");
						}

					}

			];
			// End:column

			vm.gridOptions_SH = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};

		}// end fun grid
	}
	
	
})();