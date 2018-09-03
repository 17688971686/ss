(function () {
    'use strict';

    angular
        .module('app')
        .controller('workdayCtrl', workday);

    workday.$inject = ['$location','workdaySvc','$state','$scope'];

    function workday($location, workdaySvc,$state,$scope) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.title = "";
    	vm.model={};
    	vm.month = [1,2,3,4,5,6,7,8,9,10,11,12];

        activate();
        function activate() {
            workdaySvc.grid(vm);
        }

        //打开增加窗口
        vm.addWorkDay=function(){
            $("#workDay").kendoWindow({
                width: "45%",
                height: "auto",
                title: "新增工作日",
                visible: false,
                modal: true,
                /*           open:function(){
                           },*/
                closable: true,
                actions: ["Pin", "Minimize", "Maximize", "Close"]
            }).data("kendoWindow").center().open();
        }

        vm.create=function(){
            common.initJqValidation($('#form'));
            var isValid = $('#form').valid();
            if (isValid) {
                workdaySvc.createWorkday(vm);
            }

        }
        vm.del=function(id){
            common.confirm({
                vm: vm,
                title: "",
                msg: "确认删除数据吗？",
                fn: function () {
                    $('.confirmDialog').modal('hide');
                    workdaySvc.deleteWorkday(vm, id);
                }
            });
        }

        vm.dels = function () {
            var selectIds = common.getKendoCheckId('.grid');
            if (selectIds.length == 0) {
                common.alert({
                    vm: vm,
                    msg: '请选择数据'
                });
            } else {
                var ids = [];
                for (var i = 0; i < selectIds.length; i++) {
                    ids.push(selectIds[i].value);
                }
                var idStr = ids.join(',');
                vm.del(idStr);
            }
        };

        vm.doSearch=function(){
            var filters = [];
            if(vm.workdays.status !=null && vm.workdays.status !=''){//查询条件--标题
                filters.push({field:'status',operator:'eq',value:vm.workdays.status});
            }
            vm.gridOptions.dataSource.filter(filters);
            //workdaySvc.queryWorkday(vm);
        }

        vm.doClear=function(){
            var filters = [];
            vm.workdays.status = "";
            vm.gridOptions.dataSource.filter(filters);
            //workdaySvc.clearValue(vm);
        }
    }
})();
