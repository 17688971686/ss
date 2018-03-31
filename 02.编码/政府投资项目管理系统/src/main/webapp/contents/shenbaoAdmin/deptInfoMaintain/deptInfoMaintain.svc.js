(function() {
	'use strict';

	angular.module('app').factory('deptInfoMaintainSvc', deptInfoMaintain);

	deptInfoMaintain.$inject = [ '$http','$compile' ];	
	function deptInfoMaintain($http,$compile) {	
		var url_userUnitInfo = "/shenbaoAdmin/userUnitInfo";
		var service = {
			getUnitInfo : getUnitInfo,
			save:save,
			getDeptInfo:getDeptInfo,
			getLoginUserUnitinfo:getLoginUserUnitinfo
		};		
		return service;	
		
		function getLoginUserUnitinfo(vm){
			var httpOptions = {
					method : 'get',
					url : url_userUnitInfo
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.userUnitinfo=response.data || {};
						if(vm.userUnitinfo.id == vm.id || vm.id == undefined ||vm.userUnitinfo.id == undefined){
							save(vm)
						}else{
							common.alert({
								vm : vm,
								msg : "无法修改非本单位的信息！",
								fn : function() {
									$('.alertDialog').modal('hide');
								}
							});
						}
					}
				});
				
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}
		
		//begin#save
		function save(vm){
			//验证表单信息
			common.initJqValidation();
			var isValid = $('form').valid();
			//验证通过
			if(isValid){
				vm.isSubmit = true;
				var httpOptions = {
						method : 'post',
						url : url_userUnitInfo,
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
									location.reload();
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
		}
		
		/**
		 * 获取单位的基本信息
		 */
		//begin#getDeptInfo
		function getUnitInfo(vm,id){
			var httpOptions = {
					method : 'get',
					url : common.format(url_userUnitInfo + "/id?$filter=id eq '{0}'", id)
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.model=response.data.value[0] || {};
					}
				});
				
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		}
		
		
		function getDeptInfo(vm){
		var httpOptions = {
				method : 'get',
				url : url_userUnitInfo
			};
		
		var httpSuccess = function success(response) {
			common.requestSuccess({
				vm:vm,
				response:response,
				fn:function(){
					vm.model=response.data|| {};
				}
			});
			
		};
			
		common.http({
			vm:vm,
			$http:$http,
			httpOptions:httpOptions,
			success:httpSuccess
		});
	}
	}
})();