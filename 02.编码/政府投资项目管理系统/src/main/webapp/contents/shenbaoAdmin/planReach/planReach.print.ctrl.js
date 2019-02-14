(function () {
    'use strict';

    angular.module('app').config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state('planReachPrint', {
            url: '/planReachPrint/:id',
            params: {"id": null},
            templateUrl: '/shenbaoAdmin/planReach/html/print',
            controllerAs: "vm",
            controller: "planReachPrintCtrl"
        });
    }]).controller('planReachPrintCtrl', ["$state", "planReachSvc", planReachPrintCtrl]);

    function planReachPrintCtrl($state, planReachSvc) {
        var vm = this;
        vm.id = $state.params.id;//请求中的id参数
        vm.model = {};

        planReachSvc.getApplicationById(vm);
        planReachSvc.getUserUnit(vm);//获取当前登陆单位信息

        vm.nowDate = new Date().format("yyyy年MM月dd日");
        //打印
        vm.printBtn = function () {
            $("#printWindow").printThis({
                debug: false,
                importCSS: true,       // import page CSS
                importStyle: true,    // import style tags
                printContainer: true,
                removeInline: false,
                printDelay: 333,
                header: null,
                formValues: true
            });
        };

        $(".menu li a").removeClass("focus");
        $(".menu li a:eq(4)").addClass("focus");

        $(".menu li a").click(function () {
            $(".menu li a").removeClass("focus");
            $(this).addClass("focus");
        });

        vm.getBasicDataDesc = function (str) {
            return common.getBasicDataDesc(str);
        };

    }

})();