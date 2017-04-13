(function() {
	'use strict';

	angular.module('app').factory('policySvc', policy);

	policy.$inject = [ '$http' ];

	function policy($http) {
		var url_policy = "/contents/app/policy/data/inform.list.json";
		var url_back = '#/policy';
		var url_role = "/role";
		var service = {
			grid : grid,
			getpolicyById : getpolicyById,
			initZtreeClient : initZtreeClient,
			createpolicy : createpolicy,
			deletepolicy : deletepolicy,
			updatepolicy : updatepolicy
		};

		return service;

		// begin#updatepolicy
		function updatepolicy(vm) {
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
					method : 'put',
					url : url_policy,
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
				// common.alert({
				// vm:vm,
				// msg:"您填写的信息不正确,请核对后提交!"
				// })
			}

		}

		// begin#deletepolicy
		function deletepolicy(vm, id) {
			vm.isSubmit = true;
			var httpOptions = {
				method : 'delete',
				url : url_policy,
				data : id

			}
			var httpSuccess = function success(response) {

				common.requestSuccess({
					vm : vm,
					response : response,
					fn : function() {
						vm.isSubmit = false;
						vm.gridOptions.dataSource.read();
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

		// begin#createpolicy
		function createpolicy(vm) {
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

				var httpOptions = {
					method : 'post',
					url : url_policy,
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
							})
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

		// begin#initZtreeClient
		function initZtreeClient(vm) {
			var httpOptions = {
				method : 'get',
				url : url_role
			}
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

			}
			common.http({
				vm : vm,
				$http : $http,
				httpOptions : httpOptions,
				success : httpSuccess
			});
		}

		// begin#getpolicyById
		function getpolicyById(vm) {
			var httpOptions = {
				method : 'get',
				url : common.format(url_policy + "?$filter=id eq '{0}'", vm.id)
			}
			var httpSuccess = function success(response) {
				vm.model = response.data.value[0];
				if (vm.isUpdate) {
					initZtreeClient(vm);
				}
			}

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
				transport : common.kendoGridConfig().transport(url_policy),
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
											item.id)
						},
						filterable : false,
						width : 40,
						title : "<input id='checkboxAll' type='checkbox'  class='checkbox'  />"

					},
					{
						field : "pTitleName",
						title : "标题",
						width : 200,
						filterable : true
					},
					{
						field : "pClassify",
						title : "分类",
						filterable : false
					},
					{
						field : "pReleaseTime",
						title : "发布时间",
						width : 200,
						filterable : true,
						format : "{0:yyyy/MM/dd HH:mm:ss}"
					},
					{
						field : "pSource",
						title : "来源",
						width : 200,
						filterable : false,
					},
					{
						field : "pContent",
						title : "内容",
						width : 180,
						filterable : true
					},
					{
						field : "pAccessory",
						title : "附件",
						filterable : false
					},
					{
						field : "",
						title : "操作",
						width : 180,
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