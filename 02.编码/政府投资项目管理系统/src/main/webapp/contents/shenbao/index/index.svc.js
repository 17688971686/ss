(function() {
	'use strict';

	angular.module('app').factory('indexSvc', index);

	index.$inject = [ '$http' ];	
	function index($http) {	
		var data_url="/indexData";
		var service = {
				getArticle:getArticle,
				submit:submit
		};		
		return service;	
		//begin#submit
		function submit(vm){
			common.initJqValidation();
            var isValid = $('form').valid();
            if (isValid) {
                vm.isSubmit = true;
                var httpOptions = {
                    method: 'post',
                    url: '/account/login',
                    data: vm.model
                }
                var httpSuccess = function success(response) {
                    vm.isSubmit = false;                        
                    common.requestSuccess({
                    	vm:vm,
                    	response:response,
                    	fn:function () {
                            
                            var isSuccess = response.data.isSuccess;
                            if (isSuccess) {
                                vm.message = "";
                                location.href = "/shenbaoAdmin";
                            } else {
                                
                                vm.message=response.data.message
                            }
                    	}
                    });

                }
                common.http({
                	vm:vm,
                	$http:$http,
                	httpOptions:httpOptions,
                	success:httpSuccess
                });
            }//if isvalid
		} //function
		
		//begin#getArticle
		function getArticle(vm,type){
			var httpOptions = {
					method : 'get',
					url : data_url,
					data : vm.model
				}

				var httpSuccess = function success(response) {
					vm.model=response.data;
					vm.articles=vm.model.article_tzgg;
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