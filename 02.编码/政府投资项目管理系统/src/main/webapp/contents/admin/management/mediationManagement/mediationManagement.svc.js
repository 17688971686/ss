(function() {
	'use strict';

	angular.module('app').factory('mediationManagementSvc', mediationManagement);

	mediationManagement.$inject = [ '$http','$compile','$location' ];	
	function mediationManagement($http,$compile,$location) {	
		var url_mediationManagement="/management/mediationManagement";
		var service = {
			unitGrid:unitGrid,
			geMediationUnitById,geMediationUnitById,
			updateMediationUnit,updateMediationUnit,
			createMediationUnit:createMediationUnit,
			delMediationUnit:delMediationUnit
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
					vm.model.purchaseDate=common.formatDate(vm.model.purchaseDate);
					for(var i=0;i<vm.model.mediationManagementMaintainDtos.length;i++ ){
						vm.model.mediationManagementMaintainDtos[i].maintainDate=common.formatDate(vm.model.mediationManagementMaintainDtos[i].maintainDate);
					};
				};
				
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
		}
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

	}
})();