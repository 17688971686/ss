(function() {
	'use strict';

	angular.module('app').factory('deptInfoMaintainSvc', deptInfoMaintain);

	deptInfoMaintain.$inject = [ '$http','$compile' ];	
	function deptInfoMaintain($http,$compile) {	
		var url_userUnitInfo = "/shenbaoAdmin/userUnitInfo";
		var url_user = "/user";
		var service = {
			getDeptInfo : getDeptInfo,
			save:save,
			getUserUnitByName:getUserUnitByName
		};		
		return service;	
		
		function getUserUnitByName(vm){
			vm.user = "";
			var httpOptions = {
					method : 'get',
					url : url_user+"/"+common.getLoginUser()
				};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm:vm,
					response:response,
					fn:function(){
						vm.user=response.data.value[0] || {};
						vm.unitName = vm.user.orgs[0].name;
						vm.unitId = vm.user.orgs[0].id;
						vm.userName = vm.user.id;
					}
				});
				
			};
				
			common.http({
				vm:vm,
				$http:$http,
				httpOptions:httpOptions,
				success:httpSuccess
			});
		};
		
		//begin#save
		function save(vm){
			//验证表单信息
			common.initJqValidation();
			var isValid = $('form').valid();
			//验证通过
			if(isValid){
				vm.isSubmit = true;
				vm.model.unitName = vm.unitName;
				vm.model.deptId = vm.unitId;
				vm.model.userName = vm.userName;
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
	}
})();