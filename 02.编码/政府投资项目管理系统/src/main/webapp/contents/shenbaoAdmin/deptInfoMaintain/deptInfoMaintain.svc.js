(function() {
	'use strict';

	angular.module('app').factory('deptInfoMaintainSvc', deptInfoMaintain);

	deptInfoMaintain.$inject = [ '$http','$compile' ];	
	function deptInfoMaintain($http,$compile) {	
		var url_userUnitInfo = "/shenbaoAdmin/userUnitInfo";
			
		var service = {
			getDeptInfo : getDeptInfo,
			save:save
		};		
		return service;	
		
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
									location.reload();
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
			}		
		}
		//begin#getDeptInfo
		function getDeptInfo(vm){
			var httpOptions = {
					method : 'get',
					url : url_userUnitInfo,
				}
				var httpSuccess = function success(response) {					
					vm.model=response.data.value[0] || {};
				}
				
				common.http({
					vm:vm,
					$http:$http,
					httpOptions:httpOptions,
					success:httpSuccess
				});
		}

	}
})();