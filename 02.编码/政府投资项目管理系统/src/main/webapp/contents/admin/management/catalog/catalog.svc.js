(function() {
	'use strict';

	angular.module('app').factory('catalogSvc', catalog);

	catalog.$inject = [ '$http','$location'];

	function catalog($http,$location) {
		
		var url_catalog = '/management/catalog';
		
		var service = {
				createCatalog : createCatalog,
				grid_InvestmentProject : grid_InvestmentProject,
				getCatalogById : getCatalogById,
				updateCatalog : updateCatalog,
				grid_InvestmentProjectSecondary : grid_InvestmentProjectSecondary,
				deleteSecondaryCatalog : deleteSecondaryCatalog,//投资项目删除次级目录
				createSecondCatalog : createSecondCatalog,//创建投资项目次级目录
				changeSecondCatalog : changeSecondCatalog,//更改投资项目次级目录信息
				getSecondCatalogById : getSecondCatalogById,//根据投资项目二级目录id获取二级目录信息
				grid_projectType : grid_projectType,//投资项目类型信息列表
				grid_constructionType : grid_constructionType,//投资项目建设类型列表
				removeSecondCatalogs : removeSecondCatalogs,//批量删除投资项目次级目录
				deleteCatalog : deleteCatalog,//投资项目删除主目录
				removeFirstCatalogs : removeFirstCatalogs,//投资项目批量删除主目录
				grid_policyCatalog : grid_policyCatalog,//政策目录类型列表
				createPolicyCatalog : createPolicyCatalog,//创建政策目录
				getPolicyCatalogById : getPolicyCatalogById,//根据政策目录id获取信息
				grid_policyCatalogSecondary : grid_policyCatalogSecondary,//政策目录次级目录列表
				deletePolicyCatalog : deletePolicyCatalog,//根据政策条目id删除记录
				deletePolicyCatalogs : deletePolicyCatalogs,//批量删除政策条目信息
				updatePolicyCatalog : updatePolicyCatalog//更新政策条目数据
				
		};
		return service;
		
		//更新政策条目数据
		function updatePolicyCatalog(vm){
			var httpOptions = {
					method : "put",
					url : common.format(url_catalog+"/updatePolicyCatalog"),
					data : vm.model
			};
			var httpSuccess = function(response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								$('.alertDialog').modal('hide');
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
		}//end fun updatePolicyCatalog
		
		//批量删除政策条目信息
		function deletePolicyCatalogs(vm,id){
			var httpOptions = {
					method : 'delete',
					url : common.format(url_catalog+"/deletePolicyCatalogs"),
					data : id
			};
			var httpSuccess = function (response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								$('.alertDialog').modal('hide');
								//判断是否存在参数id(主目录路径不存在参数id)，来刷新主目录列表还是次目录列表
								if(vm.id){
									vm.policyCatalogSecondaryGrid.dataSource.read();
								}else{
									vm.policyCatalogGrid.dataSource.read();
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
		}//end fun deletePolicyCatalogs
		
		//根据政策项目次级条目id删除记录
		function deletePolicyCatalog(vm,id){
			var httpOptions = {
					method : 'put',
					url : common.format(url_catalog+"/deletePolicyCatalog?id={0}", id),
			};
			var httpSuccess = function (response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								$('.alertDialog').modal('hide');
								//判断是否存在参数id(主目录路径不存在参数id)，来刷新主目录列表还是次目录列表
								if(vm.id){
									vm.policyCatalogSecondaryGrid.dataSource.read();
								}else{
									vm.policyCatalogGrid.dataSource.read();
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
		}//end fun deleteolicyCatalog
		
		//政策目录次级目录列表
		function grid_policyCatalogSecondary(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_catalog+"/policyCatalog")),
				schema : common.kendoGridConfig().schema({
					id : "id"					
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "code",
					dir : "asc"
				},
				filter:{//只根据父id显示子项
					field:'parentId',
					operator:'eq',
					value:vm.id
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
				{
					template : function(item) {
						return kendo.format("<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"
				},
				{
					field : "name",
					title : "名称",						
					filterable : true
				},
				{
					field : "code",
					title : "编码",
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 180,
					template : function(item) {
						return common.format($('#columnBtns').html(),item.id);
					}
				}
			];
			// End:column

			vm.policyCatalogSecondaryGrid = {					
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords : common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable : true
			};
		}//end fun grid_policyCatalogSecondary
		
		//根据政策目录id获取信息
		function getPolicyCatalogById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_catalog + "/policyCatalog?$filter=id eq '{0}'", vm.id)					
				};
			var httpSuccess = function success(response) {
					vm.model=response.data.value[0] || {};
					if(vm.model.parentId != '' || vm.model.parentId.trim() != ''){
			        	//显示次级编辑页面内容！
			        	vm.isPolicyCatalogSecondList = true;
			        	vm.id = vm.model.parentId;
					}
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun getPolicyCatalogById
		
		
		//创建政策目录
		function createPolicyCatalog(vm){
			var httpOptions = {
					method : 'post',
					url : common.format(url_catalog+"/policyCatalog"),
					data:vm.model
			};
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								$('.alertDialog').modal('hide');
								$('.modal-backdrop').remove();
								if(vm.id){//如果是次级目录列表添加数据，则返回次级目录列表页面
									location.href = "#/catalog/policyCatalogSecondList/"+vm.id;
								}else{//如果是一级目录列表添加数据，则返回一级目录列表页面
									location.href = "#/catalog/policyCatalog";
								}
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
		}//end fun createPolicyCatalog
		
		//政策目录类型列表
		function grid_policyCatalog(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(common.format(url_catalog+"/policyCatalog")),
				schema : common.kendoGridConfig().schema({
					id : "id"					
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "code",
					dir : "asc"
				},
				filter:{//只显示父级目录
					field:'parentId',
					operator:'eq',
					value:''
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
				{
					template : function(item) {
						return kendo.format("<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

				},
				{
					field : "name",
					title : "名称",						
					filterable : true
				},
				{
					field : "code",
					title : "编码",
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 200,
					template : function(item) {
						return common.format($('#columnBtns').html(),item.id);
					}
				}
			];
			// End:column

			vm.policyCatalogGrid = {					
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords : common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable : true
			};
			
		}
		
		//批量删除主目录
		function removeFirstCatalogs(vm,id){
			var httpOptions = {
					method : 'delete',
					url : url_catalog,
					data : id
			};
			var httpSuccess = function (response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						$('.alertDialog').modal('hide');
						$('.modal-backdrop').remove();
						if(vm.model.type == 'projectIndustry'){
							vm.investmentProjectGrid.dataSource.read();
						}
						if(vm.model.type == 'projectType'){
							vm.projectTypeGrid.dataSource.read();
						}
						if(vm.model.type == 'constructionType'){
							vm.constructionTypeGrid.dataSource.read();
						}
					}
				});
			};
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		
			
		}
		
		//删除主目录
		function deleteCatalog(vm,id){
			var httpOptions = {
					method : 'put',
					url : common.format(url_catalog+"/delete?id={0}", id),
			};
			var httpSuccess = function (response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								$('.alertDialog').modal('hide');
								$('.modal-backdrop').remove();
								if(vm.model.type == 'projectIndustry'){
									vm.investmentProjectGrid.dataSource.read();
								}
								if(vm.model.type == 'projectType'){
									vm.projectTypeGrid.dataSource.read();
								}
								if(vm.model.type == 'constructionType'){
									vm.constructionTypeGrid.dataSource.read();
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
		}
		
		
		//批量删除次级目录
		function removeSecondCatalogs(vm,id){
			var httpOptions = {
					method : 'delete',
					url : url_catalog,
					data : id
			};
			var httpSuccess = function (response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						vm.investmentProjectSecondaryGrid.dataSource.read();
					}
				});
			};
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun removeSecondCatalogs
		
		//建设类型列表
		function grid_constructionType(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_catalog),
				schema : common.kendoGridConfig().schema({
					id : "id"					
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "code",
					dir : "asc"
				},
				filter:[{//只显示父级目录
					field:'parentId',
					operator:'eq',
					value:''
				},
				{
					field:'type',
					operator:'eq',
					value:'constructionType'
					
				}]
			});
			// End:dataSource

			// Begin:column
			var columns = [
				{
					template : function(item) {
						return kendo.format("<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

				},
				{
					field : "name",
					title : "名称",						
					filterable : true
				},
				{
					field : "code",
					title : "编码",
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 180,
					template : function(item) {
						return common.format($('#columnBtns').html(),item.id);
					}
				}
			];
			// End:column

			vm.constructionTypeGrid = {					
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords : common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable : true
			};
		}//end fun grid_constructionType
		
		//项目类型信息列表
		function grid_projectType(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_catalog),
				schema : common.kendoGridConfig().schema({
					id : "id"					
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "code",
					dir : "asc"
				},
				filter:[{//只显示父级目录
					field:'parentId',
					operator:'eq',
					value:''
				},
				{
					field:'type',
					operator:'eq',
					value:'projectType'
					
				}]
			});
			// End:dataSource

			// Begin:column
			var columns = [
				{
					template : function(item) {
						return kendo.format("<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

				},
				{
					field : "name",
					title : "名称",						
					filterable : true
				},
				{
					field : "code",
					title : "编码",
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 180,
					template : function(item) {
						return common.format($('#columnBtns').html(),item.id);
					}
				}
			];
			// End:column

			vm.projectTypeGrid = {					
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords : common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable : true
			};
		}
		
		//更改次级目录信息
		function changeSecondCatalog(vm){
			var httpOptions = {
					method : "put",
					url : url_catalog,
					data : vm.secondary
			};
			var httpSuccess = function(response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								$('.alertDialog').modal('hide');
								vm.investmentProjectSecondaryGrid.dataSource.read();
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
		}//end fun changeSecondCatalog
		
		//删除次级目录
		function deleteSecondaryCatalog(vm,id){
			var httpOptions = {
					method : 'put',
					url : common.format(url_catalog+"/delete?id={0}", id),
			};
			var httpSuccess = function (response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								$('.alertDialog').modal('hide');
								vm.investmentProjectSecondaryGrid.dataSource.read();
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
		}//end fun deleteSecondaryCatalog
		
		//获得次级目录信息
		function grid_InvestmentProjectSecondary(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_catalog),
				schema : common.kendoGridConfig().schema({
					id : "id"					
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "code",
					dir : "asc"
				},
				filter:{//只根据父id显示子项
					field:'parentId',
					operator:'eq',
					value:vm.id
				}
			});
			// End:dataSource

			// Begin:column
			var columns = [
				{
					template : function(item) {
						return kendo.format("<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"
				},
				{
					field : "name",
					title : "名称",						
					filterable : true
				},
				{
					field : "code",
					title : "编码",
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 180,
					template : function(item) {
						return common.format($('#columnBtns').html(),item.id);
					}
				}
			];
			// End:column

			vm.investmentProjectSecondaryGrid = {					
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords : common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable : true
			};
			
		}//end fun grid_InvestmentProjectSecondary
		
		//更新一级目录信息
		function updateCatalog(vm){
			var httpOptions = {
					method : "put",
					url : url_catalog,
					data : vm.model
			};
			var httpSuccess = function(response){
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								$('.alertDialog').modal('hide');
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
		}//end fun updateCatalog
		
		function getCatalogById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_catalog + "?$filter=id eq '{0}'", vm.id)					
				};
			var httpSuccess = function success(response) {
					vm.model=response.data.value[0] || {};
					vm.isShow = false;
					//看是否含有次级目录，没有就隐藏列表
		        	if(vm.model.type == 'projectType' || vm.model.type == 'constructionType'){
		        		vm.isShow = true;
		        	}
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun getCatalogById
		
		function getSecondCatalogById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_catalog + "?$filter=id eq '{0}'", vm.secondCatalogId)					
				};
			var httpSuccess = function success(response) {
				vm.secondary=response.data.value[0] || {};
			};
			
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}//end fun getSecondCatalogById
		
		function grid_InvestmentProject(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_catalog),
				schema : common.kendoGridConfig().schema({
					id : "id"					
				}),
				serverPaging : true,
				serverSorting : true,
				serverFiltering : true,
				pageSize : 10,
				sort : {
					field : "code",
					dir : "asc"
				},
				filter:[{//只显示父级目录
					field:'parentId',
					operator:'eq',
					value:''
				},
				{
					field:'type',
					operator:'eq',
					value:'projectIndustry'
					
				}]
			});
			// End:dataSource

			// Begin:column
			var columns = [
				{
					template : function(item) {
						return kendo.format("<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox'/>",item.id);
					},
					filterable : false,
					width : 40,
					title : "<input id='checkboxAll' type='checkbox'  class='checkbox'/>"

				},
				{
					field : "name",
					title : "名称",						
					filterable : true
				},
				{
					field : "code",
					title : "编码",
					filterable : true
				},
				{
					field : "",
					title : "操作",
					width : 180,
					template : function(item) {
						return common.format($('#columnBtns').html(),item.id);
					}
				}
			];
			// End:column

			vm.investmentProjectGrid = {					
					dataSource : common.gridDataSource(dataSource),
					filterable : common.kendoGridConfig().filterable,
					pageable : common.kendoGridConfig().pageable,
					noRecords : common.kendoGridConfig().noRecordMessage,
					columns : columns,
					resizable : true
			};
			
		}//end fun grid_InvestmentProject
		
		//新增投资项目数据
		function createCatalog(vm){
			var httpOptions = {
					method : 'post',
					url : common.format(url_catalog),
					data:vm.model
			};
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								$('.alertDialog').modal('hide');
								$('.modal-backdrop').remove();
								if(vm.model.type == 'projectIndustry'){
									vm.investmentProjectGrid.dataSource.read();
								}
								if(vm.model.type == 'projectType'){
									vm.projectTypeGrid.dataSource.read();
								}
								if(vm.model.type == 'constructionType'){
									vm.constructionTypeGrid.dataSource.read();
								}
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
		}//end fun createCatalog
		
		//创建二级目录数据
		function createSecondCatalog(vm){
			
			var httpOptions = {
					method : 'post',
					url : common.format(url_catalog),
					data:vm.secondary
			};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function(){
						common.alert({
							vm : vm,
							msg : "操作成功",
							fn : function() {
								$('.alertDialog').modal('hide');
								$('.modal-backdrop').remove();
								vm.investmentProjectSecondaryGrid.dataSource.read();
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
		}//end fun createSecondCatalog
	}
})();