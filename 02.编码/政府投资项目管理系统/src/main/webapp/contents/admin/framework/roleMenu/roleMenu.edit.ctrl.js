(function () {
    'use strict';

    angular
        .module('app')
        .controller('roleMenuEditCtrl', roleMenuEdit);

    roleMenuEdit.$inject = ['roleMenuSvc','$state'];

    function roleMenuEdit(roleMenuSvc,$state) {
        var vm = this;
        vm.model = {};
        vm.title = '编辑权限菜单';
        vm.id = $state.params.id;

        activate();
        function activate() {
            vm.edit = function () {
                roleMenuSvc.editRoleMenu(vm);
            }
            
            roleMenuSvc.findRoleMenuById(vm,function(data){
                vm.model = data.data;
            })

            var resourceTree;
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
                resourceTree = $.fn.zTree.init($("#parentTreeEdit"), setting, zNodes);

                updateZtree();
            });

            function updateZtree() {
                var allNodes = resourceTree.transformToArray(resourceTree.getNodes());

                var nodes = $linq(allNodes).where(function (x) {
                    return x.id == vm.model.parentId;
                }).toArray();

                for (var i = 0, l = nodes.length; i < l; i++) {
                    resourceTree.checkNode(nodes[i], true, false);
                }
            }
        }
    }
})();
