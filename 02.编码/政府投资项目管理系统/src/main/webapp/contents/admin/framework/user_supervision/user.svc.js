(function() {
	'use strict';

	angular.module('appSupervision').factory('userSvc', user);

	user.$inject = [ '$http' ];

	function user($http) {
		var url_user = "/user";
		var url_back = '#/user';
		var url_role = "/role";
		var service = {
			grid : grid,
			getUserById : getUserById,
			initUser:initUser,
			initZtreeClient : initZtreeClient,
			createUser : createUser,
			deleteUser : deleteUser,
			updateUser : updateUser
		};

		return service;

		// begin#updateUser
		function updateUser(vm) {
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;
				vm.model.id = vm.id;// id

				// zTree
				var nodes = getZtreeChecked();
				var nodes_role = $linq(nodes).where(function(x) {
					return x.isParent == false;
				}).select(function(x) {
					return {
						id : x.id,
						roleName : x.name						
					};
				}).toArray();
				vm.model.roles = nodes_role;
				var httpOptions = {
					method : 'post',
					url : url_user+'/updateUser',
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
		 * 初始化用户
		 */
		function initUser(vm,type,id,msg){
			vm.isSubmit = true;
			
			var httpOptions = {
				method : 'post',
				url : url_user+"/initUser",
				data : {"id":id,"type":type,"msg":msg}
			};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function() {
						vm.isSubmit = false;
						if(type=='password'){
							common.alert({
								vm:vm,
								msg:'初始化密码成功！密码为：Passw0rd'
							});
						}
						if(type=='loginFailCount'){
							common.alert({
								vm:vm,
								msg:'初始化登陆失败次数成功！'
							});
						}
					}

				});
			};
			
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}//end fun initUser

		// begin#deleteUser
		function deleteUser(vm, id) {
			vm.isSubmit = true;
			
			var httpOptions = {
				method : 'post',
				url : url_user+'/deleteUser',
				data : id
			};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function() {
						vm.isSubmit = false;
						vm.gridOptions.dataSource.read();
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

		// begin#createUser
		function createUser(vm) {
			common.initJqValidation();
			var isValid = $('form').valid();
			if (isValid) {
				vm.isSubmit = true;

				// zTree
				var nodes = getZtreeChecked();
				var nodes_roles = $linq(nodes).where(function(x) {
					return x.isParent == false;
				}).select(function(x) {
					return {
						id : x.id,
						roleName : x.name
					};
				}).toArray();
				vm.model.roles = nodes_roles;
				//对密码进行RSA加密
				var key = $("#rsaPrivateKey").val();//获取公钥信息
                var rsa = new RSAKey();
                rsa.setPublic(key, "10001");
                vm.model.password = rsa.encrypt(vm.model.password);//密码RSA公钥加密
                vm.model.passwordConfirm = rsa.encrypt(vm.model.passwordConfirm);//密码RSA公钥加密

				var httpOptions = {
					method : 'post',
					url : url_user,
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
									$('.modal-backdrop').remove();
									location.href = url_back;
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

		// begin#initZtreeClient
		function initZtreeClient(vm) {
			var httpOptions = {
				method : 'get',
				url : url_role
			};
			
			var httpSuccess = function success(response) {
				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function() {
						var zTreeObj;
						var setting = {
							check : {
								chkboxType : {
									"Y" : "ps",
									"N" : "ps"
								},
								enable : true
							}
						};
						var zNodes = $linq(response.data.value).select(
								function(x) {
									return {
										id : x.id,
										name : x.roleName
									};
								}).toArray();
						var rootNode = {
							id : '',
							name : '角色集合',
							children : zNodes
						};
						zTreeObj = $.fn.zTree.init($("#zTree"), setting,
								rootNode);
						if (vm.isUpdate) {
							updateZtree(vm);

						}
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

		// begin#getUserById
		function getUserById(vm) {
			var httpOptions = {
				method : 'get',
				url : common.format(url_user + "?$filter=id eq '{0}'", vm.id)
			};
			
			var httpSuccess = function success(response) {
				vm.model = response.data.value[0];
				if (vm.isUpdate) {
					initZtreeClient(vm);
				}
			};

			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}
		// begin#grid
		function grid(vm) {
			// Begin:dataSource
			var dataSource = new kendo.data.DataSource({
				type : 'odata',
				transport : common.kendoGridConfig().transport(url_user),
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
						template : function(item) {
							return kendo
									.format(
											"<input type='checkbox'  relId='{0}' name='checkbox' class='checkbox' />",
											item.id);
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'  />"

					},
					{
						field : "loginName",
						title : "登录名",
						width : 200,
						filterable : true
					},
					{
						field : "displayName",
						title : "显示名",
						width : 200,
						filterable : true
					},
					{
						field : "comment",
						title : "描述",
						filterable : false
					},
					{
						field : "createdDate",
						title : "创建时间",
						width : 180,
						filterable : false,
						format : "{0:yyyy/MM/dd HH:mm:ss}"

					},
					{
						field : "",
						title : "操作",
						width : 250,
						template : function(item) {
							return common.format($('#columnBtns').html(),
									"vm.del('" + item.id + "')", item.id);

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

		// begin common fun
		function getZtreeChecked() {
			var treeObj = $.fn.zTree.getZTreeObj("zTree");
			var nodes = treeObj.getCheckedNodes(true);
			return nodes;
		}

		function updateZtree(vm) {
			var treeObj = $.fn.zTree.getZTreeObj("zTree");
			var checkedNodes = $linq(vm.model.roles).select(function(x) {
				return x.roleName;
			}).toArray();
			var allNodes = treeObj.getNodesByParam("level", 1, null);

			var nodes = $linq(allNodes).where(function(x) {
				return $linq(checkedNodes).contains(x.name);
			}).toArray();

			for (var i = 0, l = nodes.length; i < l; i++) {
				treeObj.checkNode(nodes[i], true, true);
			}
		}
		// end common fun
	}
})();