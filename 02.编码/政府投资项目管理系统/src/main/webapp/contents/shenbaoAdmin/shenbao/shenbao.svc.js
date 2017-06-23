(function() {
	'use strict';

	angular.module('app').factory('shenbaoSvc', shenbao);

	shenbao.$inject = ['$http','$compile'];	
	function shenbao($http,$compile) {
		var url_project = "/shenbaoAdmin/project/unitProject";
		var url_userUnit　= "/shenbaoAdmin/userUnitInfo";
		var url_shenbao = "/shenbaoAdmin/shenbao";
		var url_back = "#/shenbao";
		
		var service = {
			grid : grid,
			getProjectById:getProjectById,			
			createShenBaoInfo:createShenBaoInfo,
			recordsGird:recordsGird,
			getShenBaoInfoById:getShenBaoInfoById,
			updateShenBaoInfo:updateShenBaoInfo,
			isHadShenBaoInfo:isHadShenBaoInfo,
		};		
		return service;

		/**
		 * 根据项目id和申报阶段查询申报信息
		 */
		function isHadShenBaoInfo(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbao + "?$filter=projectId eq '{0}' and projectShenBaoStage eq '{1}'", vm.projectId,vm.projectShenBaoStage),
				}
				var httpSuccess = function success(response) {
				vm.model.shenBaoInfoDto = response.data.value;
					if(vm.model.shenBaoInfoDto.length>0){
						vm.isStageExist = true;
						vm.isConfirm = true;
					}else{
						vm.isStageExist = false;
						vm.isConfirm = false;
					}
				}				
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
		}//end#queryShenBaoInfo
		
		/**
		 * 更新申报信息
		 */
		function updateShenBaoInfo(vm){
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;

				var httpOptions = {
					method : 'put',
					url : url_shenbao,
					data : vm.model
				}

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
								}
							})
						}

					})
				}

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
				 })
			}
		}//end#updateShenBaoInfo
		
		/**
		 * 根据id获取申报信息
		 */
		function getShenBaoInfoById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_shenbao + "?$filter=id eq '{0}'", vm.id)
				}
				var httpSuccess = function success(response) {
					vm.model = response.data.value[0]||{};
						//日期展示
						vm.model.beginDate=common.toDate(vm.model.beginDate);//开工日期
						vm.model.endDate=common.toDate(vm.model.endDate);//竣工日期
						vm.model.pifuJYS_date=common.toDate(vm.model.pifuJYS_date);//项目建议书批复日期			
						vm.model.pifuKXXYJBG_date=common.toDate(vm.model.pifuKXXYJBG_date);//可行性研究报告批复日期
						vm.model.pifuCBSJYGS_date=common.toDate(vm.model.pifuCBSJYGS_date);//初步设计与概算批复日期
						if(vm.page=='record'){
							if(vm.model.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_nextYearPlan){
								vm.isYearPlan = true;
								vm.materialsType=[['XXJD','项目工程形象进度及年度资金需求情况'],['WCJSNR','年度完成建设内容及各阶段工作内容完成时间表'],
				   					['TTJH','历年政府投资计划下大文件(*)'],['GCXKZ','建设工程规划许可证'],['TDQK','土地落实情况、征地拆迁有关情况'],
				   					['XMJZ','项目进展情况相关资料'],['QQGZJH','前期工作计划文件'],['XMSSYJ','项目实施依据文件'],['HYJY','会议纪要']];
			    			   vm.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
							}
						}
		        		if(vm.page=='record_edit'){
		        			//项目行业归口
							var child = $linq(common.getBasicData())
			        		.where(function(x){return x.id==vm.model.projectIndustry})
			        		.toArray()[0];
			        		vm.model.projectIndustryParent=child.pId;
			        		vm.projectIndustryChange();	
		        		}									
						//资金处理
						vm.model.projectInvestSum=common.toMoney(vm.model.projectInvestSum);//项目总投资
						vm.model.projectInvestAccuSum=common.toMoney(vm.model.projectInvestAccuSum);//累计完成投资
						vm.model.capitalSCZ_ggys=common.toMoney(vm.model.capitalSCZ_ggys);//市财政-公共预算
						vm.model.capitalSCZ_gtzj=common.toMoney(vm.model.capitalSCZ_gtzj);//市财政-国土资金
						vm.model.capitalSCZ_zxzj=common.toMoney(vm.model.capitalSCZ_zxzj);//市财政-专项资金
						vm.model.capitalQCZ_ggys=common.toMoney(vm.model.capitalQCZ_ggys);//区财政-公共预算
						vm.model.capitalQCZ_gtzj=common.toMoney(vm.model.capitalQCZ_gtzj);//区财政-国土资金
						vm.model.capitalSHTZ=common.toMoney(vm.model.capitalSHTZ);//社会投资
						vm.model.capitalOther=common.toMoney(vm.model.capitalOther);//其他
						vm.model.applyYearInvest=common.toMoney(vm.model.applyYearInvest);//申请年度投资
						//计算资金筹措总计
						vm.capitalTotal=function(){
				  			 return (parseFloat(vm.model.capitalSCZ_ggys)||0 )
				  			 		+ (parseFloat(vm.model.capitalSCZ_gtzj)||0 )
				  			 		+ (parseFloat(vm.model.capitalSCZ_zxzj)||0 )
				  			 		+ (parseFloat(vm.model.capitalQCZ_ggys)||0 )
				  			 		+ (parseFloat(vm.model.capitalQCZ_gtzj)||0 )
				  			 		+ (parseFloat(vm.model.capitalSHTZ)||0 )
				  			 		+ (parseFloat(vm.model.capitalOther)||0) ;
				  		 }				
				}
				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
		
		
		/**
		 * 创建申报信息
		 */
		function createShenBaoInfo(vm){
			common.initJqValidation();
			var isValid=function(){
				var validFields=[
					['projectConstrChar','required','年度计划信息-项目建设性质必选'],
					['planYear','required','年度计划信息-计划年度必填'],
					['applyYearInvest','required','年度计划信息-申请年度投资必填'],
					['yearConstructionContent','required','年度计划信息-年度建设内容必填'],					
					['shenBaoUnitInfoDto.unitName','required','项目单位信息-单位名称必填'],
					['shenBaoUnitInfoDto.unitTel','required','项目单位信息-单位电话必填'],
					['shenBaoUnitInfoDto.unitEmail','required','项目单位信息-单位邮箱必填'],					
					['shenBaoUnitInfoDto.unitProperty','required','项目单位信息-单位性质必选'],
					['shenBaoUnitInfoDto.divisionId','required','项目单位信息-单位区域必选'],
					['shenBaoUnitInfoDto.unitAddress','required','项目单位信息-单位地址必填'],
					['shenBaoUnitInfoDto.unitResPerson','required','项目单位信息-单位负责人名称必填'],
					['shenBaoUnitInfoDto.resPersonTel','required','项目单位信息-单位负责人电话必填'],
					['shenBaoUnitInfoDto.resPersonMobile','required','项目单位信息-单位负责人手机必填'],
					['shenBaoUnitInfoDto.resPersonEmail','required','项目单位信息-单位负责人邮箱必填'],
					['shenBaoUnitInfoDto.unitContactPerson','required','项目单位信息-项目联系人名称必填'],
					['shenBaoUnitInfoDto.contactPersonTel','required','项目单位信息-项目联系人电话必填'],
					['shenBaoUnitInfoDto.contactPersonMobile','required','项目单位信息-项目联系人手机必填'],
					['shenBaoUnitInfoDto.contactPersonEmail','required','项目单位信息-项目联系人邮箱必填']					
				];
				vm.validMessage=[];
				$.each(validFields,function(idx,item){
					console.log(item[0]);
					var value='';
					if(item[0].indexOf('.')>0){
						var fields=item[0].split('.');
						value=vm.model[fields[0]][fields[1]];
					}
					else{
						value=vm.model[item[0]];
					}
							
					var msg=item[2];					
					if(item[1]=='required'){				
						var isExist=value&&value.trim()!=""					
						if(!isExist){
							vm.validMessage.push(msg);
						}						
					}
					
				});
				if(vm.validMessage.length>0){
					$('#validMsgDialog').modal({
		                 backdrop: 'static',
		                 keyboard:false
		             });
				}else{
					return true;
				}												
			}
			
			if (isValid()) {
				vm.isSubmit = true;				
				var httpOptions = {
					method : 'post',
					url : url_shenbao,
					data : vm.model
				}

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
									location.href = url_back;									
								}
							});
						}
					});
				}
				
				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});			
			}
		}
		
		/**
		 * 获取单位信息
		 */
		function getDeptInfo(vm){
			var httpOptions = {
					method : 'get',
					url : url_userUnit,
				}
				var httpSuccess = function success(response) {					
					vm.model.shenBaoUnitInfoDto = response.data;
				}
				
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
		}
		
		/**
		 * 通过项目代码查询项目信息
		 */
		function getProjectById(vm){
			var httpOptions = {
					method : 'get',
					url : common.format(url_project + "?$filter=id eq '{0}'", vm.id)
				}
				var httpSuccess = function success(response) {
					vm.model = response.data.value[0]||{};
					if(vm.page=='edit'){
						//日期展示
						vm.model.beginDate=common.toDate(vm.model.beginDate);//开工日期
						vm.model.endDate=common.toDate(vm.model.endDate);//竣工日期
						vm.model.pifuJYS_date=common.formatDate(vm.model.pifuJYS_date);//项目建议书批复日期			
						vm.model.pifuKXXYJBG_date=common.formatDate(vm.model.pifuKXXYJBG_date);//可行性研究报告批复日期
						vm.model.pifuCBSJYGS_date=common.formatDate(vm.model.pifuCBSJYGS_date);//初步设计与概算批复日期
		        		//项目行业归口
						var child = $linq(common.getBasicData())
		        		.where(function(x){return x.id==vm.model.projectIndustry})
		        		.toArray()[0];
		        		vm.model.projectIndustryParent=child.pId;
		        		vm.projectIndustryChange();			        		
									
						//资金处理
						vm.model.projectInvestSum=common.toMoney(vm.model.projectInvestSum);//项目总投资
						vm.model.projectInvestAccuSum=common.toMoney(vm.model.projectInvestAccuSum);//累计完成投资
						vm.model.capitalSCZ_ggys=common.toMoney(vm.model.capitalSCZ_ggys);//市财政-公共预算
						vm.model.capitalSCZ_gtzj=common.toMoney(vm.model.capitalSCZ_gtzj);//市财政-国土资金
						vm.model.capitalSCZ_zxzj=common.toMoney(vm.model.capitalSCZ_zxzj);//市财政-专项资金
						vm.model.capitalQCZ_ggys=common.toMoney(vm.model.capitalQCZ_ggys);//区财政-公共预算
						vm.model.capitalQCZ_gtzj=common.toMoney(vm.model.capitalQCZ_gtzj);//区财政-国土资金
						vm.model.capitalSHTZ=common.toMoney(vm.model.capitalSHTZ);//社会投资
						vm.model.capitalOther=common.toMoney(vm.model.capitalOther);//其他
						vm.model.applyYearInvest=common.toMoney(vm.model.applyYearInvest);//申请年度投资
						//计算资金筹措总计
						vm.capitalTotal=function(){
				  			 return (parseFloat(vm.model.capitalSCZ_ggys)||0 )
				  			 		+ (parseFloat(vm.model.capitalSCZ_gtzj)||0 )
				  			 		+ (parseFloat(vm.model.capitalSCZ_zxzj)||0 )
				  			 		+ (parseFloat(vm.model.capitalQCZ_ggys)||0 )
				  			 		+ (parseFloat(vm.model.capitalQCZ_gtzj)||0 )
				  			 		+ (parseFloat(vm.model.capitalSHTZ)||0 )
				  			 		+ (parseFloat(vm.model.capitalOther)||0) ;
				  		 }
						vm.model.projectId = vm.model.id;
					}
					vm.model.projectShenBaoStage = vm.stage;
					getDeptInfo(vm);
				}
				common.http({
					vm : vm,
					$http : $http,
					httpOptions : httpOptions,
					success : httpSuccess
				});
		}
		
		/**
		 * 单位申报记录列表数据获取
		 */
		function recordsGird(vm){
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_shenbao+"/unit"),
				schema : common.kendoGridConfig().schema({
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
						field : "",
						title : "项目名称",
						template:function(item){
							return common.format('<a href="#/project/projectInfo/{0}">{1}</a>',item.projectId,item.projectName);
						},
						filterable : true,
						
					},
					{
						field : "projectShenBaoStageDesc",
						title : "申报阶段",						
						filterable : true,
					},
					{
						field : "planYear",
						title : "计划年度",						
						filterable : true,
					},
					{
						field : "",
						title : "操作",
						template : function(item) {
							return common.format($('#columnBtns').html(),item.id,item.projectShenBaoStage);
						}
					}
			];
			// End:column

			vm.gridOptions_records = {
				dataSource : common.gridDataSource(dataSource),
				filterable : common.kendoGridConfig().filterable,
				pageable : common.kendoGridConfig().pageable,
				noRecords : common.kendoGridConfig().noRecordMessage,
				columns : columns,
				resizable : true
			};
		}//End recordsGird
		
		/**
		 * 项目列表数据获取
		 */
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_project),
				schema : common.kendoGridConfig().schema({
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
						field : "projectName",
						title : "项目名称",						
						filterable : true,
						template:function(item){
							return common.format('<a href="#/project/projectInfo/{0}">{1}</a>',item.id,item.projectName);
						}
					},
					{
						field : "projectStageDesc",
						title : "项目阶段",
						width : 150,
						filterable : false
					},
					{
						field : "projectClassifyDesc",
						title : "项目分类",
						width : 150,
						filterable : false
					},
					{
						field : "",
						title : "操作",
						width : 180,
						template : function(item) {
							return common.format($('#columnBtns').html(),item.id,item.projectName);
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

	}
	
	
	
})();