(function () {
    'use strict';

    angular
        .module('app')
        .controller('roleMenuCtrl', roleMenu);

    roleMenu.$inject = ['roleMenuSvc','$state','$scope'];

    function roleMenu(roleMenuSvc,$state,$scope) {
        var vm = this;
        vm.title = '权限菜单列表';

        activate();
        function activate() {
            var treeAddBtn = $("#treeAddBtn");

            roleMenuSvc.getRoleMenuList(vm,function (response) {
                var setting = {
                    edit: {
                        enable: true,
                        removeTitle: "删除菜单",
                        showRemoveBtn: function (treeId, treeNode) {
                            return true;
                        },
                        showRenameBtn: false
                    },
                    view: {
                        addHoverDom: function (treeId, treeNode) {
                            var sObj = $("#" + treeNode.tId + "_span");
                            if ($("#addBtn_"+treeNode.tId).length>0) return;
                            if (treeAddBtn.length > 0) {
                                var addStr = util.format(treeAddBtn.html(), treeNode.tId);
                                sObj.after(addStr);
                                var btn = $("#addBtn_" + treeNode.tId);
                                if (btn) btn.bind("click", function () {
                                    $state.go("roleMenu.add", {id: treeNode.id});
                                    return false;
                                });
                            }
                        },
                        removeHoverDom: function (treeId, treeNode) {
                            $("#addBtn_" + treeNode.tId).unbind().remove();
                        },
                        selectedMulti: false
                    },
                    callback: {
                        onClick: function (event, treeId, treeNode) {
                            $state.go('roleMenu.edit', {id: treeNode.id});
                        },
                        beforeRemove: function (treeId, treeNode) {
                            roleMenuSvc.delRoleMenu(vm,treeNode.id);
                            return false;
                        }
                    }
                };
                var zNodes = response.data;
                $.fn.zTree.init($("#zTree"), setting, zNodes);
            });
        }
    }
})();
