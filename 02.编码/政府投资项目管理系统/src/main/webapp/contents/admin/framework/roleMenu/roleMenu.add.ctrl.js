(function () {
    'use strict';

    angular
        .module('app')
        .controller('roleMenuAddCtrl', roleMenuAdd);

    roleMenuAdd.$inject = ['roleMenuSvc','$state','$scope'];

    function roleMenuAdd(roleMenuSvc,$state,$scope) {
        var vm = this;
        vm.model = {};
        vm.title = '新增权限菜单';
        vm.id = $state.params.id;

        activate();
        function activate() {
            vm.create = function () {
                if(vm.id){
                    vm.model.parentId = vm.id;
                    vm.model.itemOrder = vm.parentRoleMenu.itemOrder + 1;
                }
                vm.model.path = vm.model.name;
                if(!vm.model.path || vm.model.path == null || vm.model.path == ''){
                    common.alert({
                        vm: vm,
                        msg: '菜单名称不能为空!'
                    });
                }else{
                    $.ajax({
                        type: "get",
                        url: '/roleMenu/findRoleMenuByName',
                        data: {'name':vm.model.path},
                        async: false
                    }).success(function (data) {
                        var status = data;
                        if(status == 0){
                            roleMenuSvc.createRoleMenu(vm);
                        }else if(status == 1){
                            common.alert({
                                vm: vm,
                                msg: '菜单名称已存在，请确定后重新修改!'
                            });

                        }else{
                            common.alert({
                                vm: vm,
                                msg: '系统出现出错，请联系管理员!'
                            });
                        }
                    })
                }
            }

            if(vm.id){
                vm.hasParent = true;
                roleMenuSvc.findRoleMenuById(vm,function(data){
                    vm.parentRoleMenu = data.data;
                })
            }else{
                vm.hasParent = false;

                roleMenuSvc.getRoleMenuList(vm,function (response) {
                    var setting = {
                        check: {
                            enable: true,
                            chkStyle: "radio"
                        },
                        callback: {
                            onCheck: function (event, treeId, treeNode) {
                                if (treeNode.checked) {
                                    vm.model.parentId = treeNode.id;
                                    vm.model.itemOrder = treeNode.itemOrder + 1;
                                }
                            }
                        }
                    };
                    var zNodes = response.data;
                    $.fn.zTree.init($("#parentTree"), setting, zNodes);
                });
            }
        }
    }
})();
