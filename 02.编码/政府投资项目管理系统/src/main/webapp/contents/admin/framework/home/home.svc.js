(function() {
	'use strict';

	angular.module('app').factory('homeSvc', home);

	home.$inject = [ '$http' ];

	function home($http) {
		var url_account_password = "/account/password";
		
		var service = {			
			changePwd : changePwd			
		};

		return service;
				
		// begin#updatehome
		function changePwd(vm) {
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				//RSA加密
				var key = $("#rsaPrivateKey").val();//获取公钥信息
				var rsa = new RSAKey();
				rsa.setPublic(key, "10001");
				vm.model.password = rsa.encrypt(vm.model.password);
				
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
								msg : "操作成功!",
								fn : function() {
									vm.isSubmit = false;
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
			}
		}
	}
})();