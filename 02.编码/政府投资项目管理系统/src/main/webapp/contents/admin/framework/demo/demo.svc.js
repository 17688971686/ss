(function() {
	'use strict';

	angular.module('app').factory('demoSvc', demo);

	demo.$inject = [ '$http' ];

	function demo($http) {
		var url_account_password = "/verifyNum/changePwd";
		
		var service = {			
			upload : upload,
			treeList:treeList
		};

		return service;
		
		function treeList(vm){			
			var crudServiceBaseUrl = "https://demos.telerik.com/kendo-ui/service";
			var dataSource={
                    transport: {
                        read:  {
                            url: crudServiceBaseUrl + "/EmployeeDirectory/All",
                            dataType: "jsonp"
                        }
                    },
                    schema: {
                        model: {
                            id: "EmployeeId",
                            parentId: "ReportsTo",
                            fields: {
                                EmployeeId: { type: "number", editable: false, nullable: false },
                                ReportsTo: { nullable: true, type: "number" },
                                FirstName: { validation: { required: true } },
                                LastName: { validation: { required: true } },
                                HireDate: { type: "date" },
                                Phone: { type: "string" },                               
                                BirthDate: { type: "date" },
                                Extension: { type: "number", validation: { min: 0, required: true } },
                                Position: { type: "string" }
                            }
                        }
                    }
			};
			var columns=[
                { field: "FirstName", title: "First Name", width: "150px" },
                { field: "LastName", title: "Last Name", width: "150px" },
                { field: "Position" },
                { title: "Location",
                  template: "{{ dataItem.City }}, {{ dataItem.Country }}"
                },
                { command: ["edit"] }
            ];
			vm.treelistOptions ={
					dataSource:dataSource,
					columns:columns
			};
                    
		}

		// begin#updatedemo
		function upload(vm) {
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
				// common.alert({
				// vm:vm,
				// msg:"您填写的信息不正确,请核对后提交!"
				// })
			}
		}
	}
})();