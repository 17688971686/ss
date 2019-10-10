(function() {
    'use strict';

    angular.module('app').factory('roleMenuSvc', roleMenu);

    roleMenu.$inject = [ '$http'];
    function roleMenu($http) {
        var url_roleMenu = "/roleMenu";
        var url_back = '#/roleMenu';
        var url_resource= "/sys/resource";

        var service = {
            getRoleMenuList : getRoleMenuList,
            findRoleMenuById : findRoleMenuById,
            createRoleMenu : createRoleMenu,
            editRoleMenu : editRoleMenu,
            delRoleMenu : delRoleMenu
        };
        return service;

        function delRoleMenu(vm,id) {
            var httpOptions = {
                method: 'post',
                url: url_roleMenu + "/delRoleMenu?id=" + id
            };
            var httpSuccess = function success(response) {
                location.href = url_back;
                window.location.reload();
            };
            common.http({
                vm:vm,
                $http:$http,
                httpOptions:httpOptions,
                success:httpSuccess
            });
        }

        function editRoleMenu(vm) {
            var httpOptions = {
                method: 'post',
                url: url_roleMenu + "/editRoleMenu",
                data : vm.model
            };
            var httpSuccess = function success(response) {
                common.alert({
                    vm:vm,
                    msg:"更新成功",
                    fn:function() {
                        $('.alertDialog').modal('hide');
                        window.location.reload();
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

        function createRoleMenu(vm) {
            var httpOptions = {
                method: 'post',
                url: url_roleMenu,
                data : vm.model
            };
            var httpSuccess = function success(response) {
                common.alert({
                    vm:vm,
                    msg:"新增成功",
                    fn:function() {
                        $('.alertDialog').modal('hide');
                        window.location.reload();
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

        function findRoleMenuById(vm,fn) {
            var httpOptions = {
                method: 'get',
                url: url_roleMenu + "/findRoleMenuById?id=" + vm.id
            };
            var httpSuccess = function success(response) {
                common.requestSuccess({
                    vm:vm,
                    response:response,
                    fn: fn(response)
                });
            };
            common.http({
                vm:vm,
                $http:$http,
                httpOptions:httpOptions,
                success:httpSuccess
            });
        }

        // begin fun getRoleMenuList
        function getRoleMenuList(vm,fn){
            var httpOptions = {
                method: 'get',
                url: url_resource
            };
            var httpSuccess = function success(response) {
                common.requestSuccess({
                    vm:vm,
                    response:response,
                    fn: fn(response)
                });
            };
            common.http({
                vm:vm,
                $http:$http,
                httpOptions:httpOptions,
                success:httpSuccess
            });
        }
        // end fun getRoleMenuList
    }
})();