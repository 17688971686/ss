(function() {
	'use strict';

	angular.module('app').factory('indexSvc', index);

	index.$inject = [ '$http' ];	

	function index($http) {	
		var url_taskRecord="/shenbaoAdmin/taskRecord";
		var url_unitShenBao="/shenbaoAdmin/shenbao";
		var service = {
			getTaskRecords:getTaskRecords, //获取任务流程最新动态
			getUnitShenBaoInfos:getUnitShenBaoInfos,//获取单位申报信息
			taskRecordList:taskRecordList,//任务流程列表
		};		
		return service;
		
		/**
		 * 任务流程列表
		 */
		function taskRecordList(vm){
			//begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_taskRecord),
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
				}
			});
			// End:dataSource
			// Begin:column
			var columns = [					
					{
						field : "title",
						title : "名称",
						template:function(item){
							if(item.taskType == vm.taskType_yearPlan){
								return common.format('<a href="#/shenbao_record/{0}">{1}</a>',item.relId,item.title);
							}else if(item.taskType == vm.taskType_monthReport){
								return item.title;
							}							
						},
						filterable : false,
						
					},
					{
						field : "processSuggestion",
						title : "信息",						
						filterable : true,
					},
					{
						field : "processStateDesc",
						title : "状态",						
						filterable : true,
					},
					{
						field : "createdDate",
						title : "创建时间",
						template:function(item){
							return vm.formatDateTime(item.createdDate);
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
		}
		
		/**
		 * 获取单位申报信息
		 */
		function getUnitShenBaoInfos(vm){
			var httpOptions = {
					method : 'get',
					url : url_unitShenBao+"/unit",
				}

				var httpSuccess = function success(response) {
					vm.model.shenBaoInfo = response.data.value;	
				}
				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
		
		/**
		 * 获取当前用户申报项目任务流转消息
		 */
		function getTaskRecords(vm){
			var httpOptions = {
					method : 'get',
					url : url_taskRecord
				}

				var httpSuccess = function success(response) {
					vm.model.taskRecord = response.data.value;
				}
				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
		
		/**
		 * 查询申报的项目信息
		 */
		function getDeclareProjects(vm){
			var httpOptions = {
					method : 'get',
					url : declareProjects
				}

				var httpSuccess = function success(response) {
					vm.modelLists = response.data.value;
				}

				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
		
		/**
		 * 查询操作记录的信息
		 */
		function getOprationRecords(vm){
			var httpOptions = {
					method : 'get',
					url : common.format("{0}?filter=userId eq '{1}'",oprationRecords,global_userName)
				}

				var httpSuccess = function success(response) {
					vm.modelOprationLists = response.data.value;
				}

				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
		
		//begin#getArticle
		function getArticle(vm,type){
			var httpOptions = {
					method : 'get',
					url : user_article+type+'.js',
					data : vm.model
				}

				var httpSuccess = function success(response) {
					vm["article_"+type]=response.data;
					if(type=="announcement"){
						vm.articles=response.data;
					}
				}

				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});

		}
		//end#getArticle
		

		
		
		

	}
	
	
	
})();