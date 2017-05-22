(function() {
	'use strict';

	angular.module('app').factory('monthReportSvc', monthReport);

	monthReport.$inject = [ '$http','$compile' ];	
	function monthReport($http,$compile) {	
		var url_projectInfo = "/projectInfo";		
		var url_projectMonthReport = "/shenbaoAdmin/projectMonthReport";//获取月报数据
		
		var service = {
			grid : grid,
			getMonthReportInfo:getMonthReportInfo
		};		
		return service;	
		
		function getMonthReportInfo(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_projectMonthReport + "?$filter=id eq '{0}'", vm.id),
				}
				var httpSuccess = function success(response) {
					vm.model = response.data.value[0]||{};
					vm.isJueSuan=vm.model.projectBuildStage=="projectBuildStage_03";
				}
				
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
		}//getMonthReportInfo
		
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_projectInfo), //获取数据
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
						field : "projectName",
						title : "项目名称",
						width : 200,
						template:function(data){
							//根据不同的申报阶段点击项目链接跳转到不同的详情页面
							return "<a href='#/projectDetails/"+data.id+"'>"+data.projectName+"</a>";							
						},
						filterable : true
					},
					
					{
						field : "projectStageValue",
						title : "申报阶段",
						width : 165,
						filterable : false
					},
					{
						field : "shenBaoYear",
						title : "申报年度",
						width : 80,
						filterable : false
					},
					{
						field : "",
						title : "填报月份",
						template:function(data){
							var returnStr="";
							//return $('#columnBtns').html();
							
							
							for(var i=1;i<=12;i++){
								var month="0";
								if(i<10){
									month+=i+"";
								}else{
									month=i;
								}
								if(data.monthReportDtos.length>0){
									var isExist=false;
									var monthId=""
									data.monthReportDtos.forEach(function(e,idx){
										if(e.submitMonth==data.shenBaoYear+month){
											isExist=true;
											monthId=e.id;
										}										
									});
									if(isExist){
										returnStr+=common.format('<a class="btn btn-xs btn-success" href="#/monthReport/{1}">{0}月</a> ',month,monthId);
									}else{
										returnStr+=common.format('<button class="btn btn-xs">{0}月</button> ',month);
									}
								}
								else{
									returnStr+=common.format('<button class="btn btn-xs">{0}月</button> ',month);
								}
							}
							return returnStr;
							//return common.format($('#columnBtns').html(),data.id,data.projectName,data.projectBuildStage);		
						},
						width:250,
						filterable : false
					}															
			];
			// End:column
		
			vm.gridOptions={
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