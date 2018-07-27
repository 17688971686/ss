(function () {
    'use strict';

    angular.module('app').config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('planReach', {
            url: "/planReach",
            controllerAs: "vm",
            templateUrl: '/shenbaoAdmin/planReach/html/list',
            controller: "planReachCtrl"
        });
    }]).controller('planReachCtrl', ["$state", "planReachSvc", "bsWin", planReachCtrl]);

    function planReachCtrl($state, planReachSvc, bsWin) {
        var vm = this;
        vm.isCan = true;

        planReachSvc.grid(vm);

        planReachSvc.getSysConfig(vm);

        vm.deleteApplication = function (id) {
            // common.confirm({
            //     vm: vm,
            //     msg: "确认删除？",
            //     fn: function () {
            //         planReachSvc.deleteApplication(vm, id);
            //         $('.confirmDialog').modal('hide');
            //     }
            // });
            bsWin.confirm("确认删除？", function () {
                planReachSvc.deleteApplication(vm, id);
            })
        };

        vm.startProcess = function (planId) {
            planReachSvc.startProcess(vm, planId);
        };

        $(".menu li a").removeClass("focus");
        $(".menu li a:eq(4)").addClass("focus");

        $(".menu li a").click(function () {
            $(".menu li a").removeClass("focus");
            $(this).addClass("focus");
        });
    }

})();