(function() {
	'use strict';

	angular.module('app').factory('mediationManagementSvc', mediationManagement);

	mediationManagement.$inject = [ '$http','$compile','$location' ];	
	function mediationManagement($http,$compile,$location) {	
		var url_mediationManagement="/management/mediationManagement";
		var url_project = "/management/project";//获取项目信息数据
		var service = {
			unitGrid:unitGrid,//中介单位列表
			geMediationUnitById,geMediationUnitById,//中介单位详细信息
			updateMediationUnit,updateMediationUnit,//编辑中介单位
			createMediationUnit:createMediationUnit,//创建中介单位
			delMediationUnit:delMediationUnit,//删除中介单位
			assistReviewGrid:assistReviewGrid,//协审活动列表
			getAssistReviewById:getAssistReviewById,//协审活动详细信息
			mediationUnitGrid:mediationUnitGrid,//中介单位弹出列表
			projectGrid:projectGrid,//项目库弹出列表
			updateAssistReview:updateAssistReview,  //编辑协审活动评价
			createAssistReview:createAssistReview ,  //创建协审活动
			delAssistReview:delAssistReview, //删除协审活动
			updateOnlyAssistReview:updateOnlyAssistReview //编辑协审活动
		};		
		return service;	
		function delMediationUnit(vm,id) {
            vm.isSubmit = true;
            var httpOptions = {
                method: 'delete',
                url:url_mediationManagement,
                data:id 
            };
            var httpSuccess = function success(response) {
                
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    vm.isSubmit = false;
	                    vm.unitGridOptions.dataSource.read();
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
		function delAssistReview(vm,id) {
            vm.isSubmit = true;
            var httpOptions = {
                method: 'delete',
                url:url_mediationManagement+"/delAssistReview",
                data:id 
            };
            var httpSuccess = function success(response) {
                
                common.requestSuccess({
					vm:vm,
					response:response,
					fn:function () {
	                    vm.isSubmit = false;
	                    vm.assistReviewGridOptions.dataSource.read();
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
		//创建协审活动
		function createAssistReview(vm) {
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
	            vm.model.type=vm.type;	        
				var httpOptions = {
					method : 'post',
					url : url_mediationManagement+"/createAssistReview",
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
									location.href = "#/assistReviewList";
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
		}// end func createAssistReview
		function updateMediationUnit(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				vm.model.id=vm.id;// id			
				var httpOptions = {
					method : 'put',
					url : url_mediationManagement,
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
		function geMediationUnitById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_mediationManagement + "?$filter=id eq '{0}'", vm.id)
				};
				var httpSuccess = function success(response) {
					vm.model = response.data.value[0];	
				};
				
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
		}
		function getAssistReviewById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_mediationManagement+"/assistReviewList" + "?$filter=id eq '{0}'", vm.id)
				};
				var httpSuccess = function success(response) {
					vm.model = response.data.value[0];	
					vm.model.assistReviewBeginDate=common.formatDateTime(vm.model.assistReviewBeginDate);
					vm.model.assistReviewEndDate=common.formatDateTime(vm.model.assistReviewEndDate);
				};
				
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
		}
		
		//编辑协审活动评价
		function updateAssistReview(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				vm.model.id=vm.id;// id			
				var httpOptions = {
					method : 'put',
					url : url_mediationManagement+"/updateAssistReview",
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
		}// end fun updateAssistReview
		//编辑协审活动评价
		function updateOnlyAssistReview(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				vm.model.id=vm.id;// id			
				var httpOptions = {
					method : 'put',
					url : url_mediationManagement+"/updateOnlyAssistReview",
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
		}// end fun updateOnlyAssistReview
		//创建中介单位信息
		function createMediationUnit(vm) {
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
	            vm.model.type=vm.type;	        
				var httpOptions = {
					method : 'post',
					url : url_mediationManagement,
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
									location.href = "#/mediationUnitList";
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
		//协审活动列表
		function assistReviewGrid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_mediationManagement+"/assistReviewList"), //获取数据
				schema : common.kendoGridConfig().schema({ //返回的数据的处理
					id : "id",
					fields : {
						createdDate : {
							type : "date"
						}
				
					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,			
				pageSize: 10,
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
										"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox' />",
										item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'  />"
					
				},
				{
					field : "assistReviewName",
					title : "协审活动名称",						
					template:"",
					filterable : true
				},
				{
					field : "assistReviewBeginDate",
					title : "协审活动开始时间",						
					template:function(item){
						return common.formatDateTime(item.assistReviewBeginDate);
					},
					filterable : true
				},
				{
					field : "assistReviewEndDate",
					title : "协审活动结束时间",						
					template:function(item){
						return common.formatDateTime(item.assistReviewEndDate);
					},
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 380,
					template:function(item){
						var flag;
						if(item.isEvaluation){
							flag=false;
						}else {
							flag=true;
						}
						return common.format($('#columnBtns').html(),item.id,flag);
						
					}
				}
					  								
			];
			// End:column
		
			vm.assistReviewGridOptions={
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords:common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable: true
				};
		}// end fun grid
		//中介单位列表
		function unitGrid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_mediationManagement), //获取数据
				schema : common.kendoGridConfig().schema({ //返回的数据的处理
					id : "id",
					fields : {
						createdDate : {
							type : "date"
						}
					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,			
				pageSize: 10,
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
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox' />",
											item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'  />"
						
					},
					  
					{
						field : "mediationUnitName",
						title : "中介单位名称",						
						template:"",
						filterable : true
					},
					{
						field : "businessScope",
						title : "中介机构经营范围",						
						template:"",
						filterable : true
					},
					{
						field : "",
						title : "操作",
						width : 280,
						template:function(item){
							var flag;
							if(item.reviewResult!=null&&item.reviewResult!=""){
								flag=false;
							}else {
								flag=true;
							}
							return common.format($('#columnBtns').html(),item.id,flag);
							
						}
					}
																				
			];
			// End:column
		
			vm.unitGridOptions={
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords:common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable: true
				};
		}// end fun grid
		function mediationUnitGrid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_mediationManagement), //获取数据
				schema : common.kendoGridConfig().schema({ //返回的数据的处理
					id : "id",
					fields : {
						createdDate : {
							type : "date"
						}
					}
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,			
				pageSize: 10,
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
											"<input type='checkbox'  value='{0}'  relId='{0}' name='mediationUnit' class='checkbox' />",
											item.id+","+item.mediationUnitName);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'  />"
						
					},
					  
					{
						field : "mediationUnitName",
						title : "中介单位名称",						
						template:"",
						filterable : true
					},
					{
						field : "businessScope",
						title : "中介机构经营范围",						
						template:"",
						filterable : true
					}
					
																				
			];
			// End:column
		
			vm.mediationUnitGridOptions={
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords:common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable: true
				};
		}// end fun grid
		// begin#grid
		function projectGrid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_project+"/unitName")),
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
	}
})();