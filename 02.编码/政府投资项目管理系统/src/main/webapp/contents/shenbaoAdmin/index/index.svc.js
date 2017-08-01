(function() {
	'use strict';

	angular.module('app').factory('indexSvc', index);

	index.$inject = ['$http'];	

	function index($http) {	
		var url_task="/shenbaoAdmin/task";
		var url_unitShenBao="/shenbaoAdmin/shenbao";
		var url_account_password="/account/password";
		var url_monthReport = "/shenbaoAdmin/projectMonthReport";
		var url_project = "/shenbaoAdmin/project";
		var url_login = "/";
		var service = {
			getTask:getTask, //获取任务最新动态
			getUnitShenBaoInfos:getUnitShenBaoInfos,//获取单位申报信息
			getMonthReportById:getMonthReportById,//根据id获取月报信息
			taskList:taskList,//任务流程列表
			changePwd:changePwd//修改密码
		};		
		return service;
		
		/**
		 * 根据id获取项目信息
		 */
		function getProjectById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project + "?$filter=id eq '{0}'", vm.model.monthReport.projectId)				
				};
			
			var httpSuccess = function success(response) {
				vm.model.project= response.data.value[0]||{};
				//项目类型的显示
				vm.model.project.projectType=common.stringToArray(vm.model.project.projectType,',');		
			};

			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 根据id获取月报信息
		 */
		function getMonthReportById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_monthReport + "?$filter=id eq '{0}'", vm.monthReportId)				
				};
			
			var httpSuccess = function success(response) {
				vm.model.monthReport= response.data.value[0]||{};
				getProjectById(vm);//根据关联的项目id获取项目信息
				//处理数据
				vm.model.monthReport.beginDate = common.formatDate(vm.model.monthReport.beginDate);
				vm.model.monthReport.endDate = common.formatDate(vm.model.monthReport.endDate);
				//上传文件类型
				vm.uploadType=[['scenePicture','现场图片'],['other','其它材料']];
			};

			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 修改密码
		 */
		function changePwd(vm) {
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				var httpOptions = {
					method : 'put',
					url : url_account_password,
					data : vm.model.password
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
									//跳转到登录页面进行重新登录
									location.href=url_login;
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
		
		/**
		 * 任务流程列表
		 */
		function taskList(vm){
			//begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_task),
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
							if(item.taskType == vm.taskType_yearPlan ||
									item.taskType == vm.taskType_JYS ||
									item.taskType ==  vm.taskType_KXXYJBG ||
									item.taskType == vm.taskType_CBSJYGS){
								return common.format('<a href="#/shenbao_record/{0}">{1}</a>',item.relId,item.title);
							}else if(item.taskType == vm.taskType_monthReport){
								return common.format('<a href="#/monthReportDetails/{0}">{1}</a>',item.relId,item.title);
							}						
						},
						width:305,
						filterable : false						
					},
					{
						field : "processSuggestion",
						title : "信息",
						width:441,
						template:function(item){
							return common.format('<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;width:441px;" title="{0}">{0}</span>',item.processSuggestion);
						},
						filterable : false
					},
					{
						field : "processState",
						title : "状态",
						template:function(item){
							return common.getBasicDataDesc(item.processState);
						},
						width:210,
						filterable : false
					},
					{
						field : "createdDate",
						title : "创建时间",
						width:165,
						template:function(item){
							return common.formatDateTime(item.createdDate);
						},
						filterable : false
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
		 * 获取单位项目申报信息
		 */
		function getUnitShenBaoInfos(vm){
			var httpOptions = {
					method : 'get',
					url : url_unitShenBao+"/unit"
				};

			var httpSuccess = function success(response) {
				vm.model.shenBaoInfo = response.data.value;	
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		
		/**
		 * 获取当前用户任务最新动态
		 */
		function getTask(vm){
			var httpOptions = {
					method : 'get',
					url : url_task+"?$orderby=createdDate desc"
				};

			var httpSuccess = function success(response) {
				vm.model.task = response.data.value;
			};
			
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
				};

				var httpSuccess = function success(response) {
					vm.modelLists = response.data.value;
				};

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
				};

				var httpSuccess = function success(response) {
					vm.modelOprationLists = response.data.value;
				};

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
				};

				var httpSuccess = function success(response) {
					vm["article_"+type]=response.data;
					if(type=="announcement"){
						vm.articles=response.data;
					}
				};

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