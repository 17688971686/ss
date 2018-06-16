(function () {
    'use strict';

    angular
        .module('app')
        .controller('disbursedCtrl', disbursedCtrl);

    disbursedCtrl.$inject = ['$location', 'projectSvc', '$state', '$scope', '$sce'];

    function disbursedCtrl($location, projectSvc, $state, $scope, $sce) {
        var vm = this;
        vm.attachmentDtos = [];
        vm.result = null;
        vm.isProcessing = false;

        vm.uploadSuccess=function(e){
            if(e.XMLHttpRequest.status==200){
                var fileName=e.XMLHttpRequest.response;
                $scope.$apply(function(){
                    vm.attachmentDtos=[{fullName:fileName,fileName:fileName.split('_')[2]}];
                });
            }
        };

        //文件选择触发验证文件大小
        vm.onSelect=function(e){
            vm.result = null;
            vm.isProcessing = false;
            $.each(e.files, function (index, value) {
                if(value.size > common.basicDataConfig().uploadSize){
                    $scope.$apply(function(){
                        common.alert({
                            vm : vm,
                            msg : "上传文件过大！"
                        });
                    });
                }
            });
        };

        vm.uploadOptions = {
            async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
            error:vm.uploadSuccess,
            localization:{select:'上传文件'},
            showFileList:false,
            multiple:false,
            validation: {
                maxFileSize: common.basicDataConfig().uploadSize,
                allowedExtensions: [".xls", ".xlsx"]
            },
            select:vm.onSelect
        }

        vm.update = function(){
            vm.isProcessing = true;
            projectSvc.updateAlreadyDisbursedByExcel(vm, vm.attachmentDtos[0].fullName,
                function success(response) {
                    common.requestSuccess({
                        vm : vm,
                        response : response,
                        fn : function() {
                            vm.result = response.data;
                        }
                    });
                    vm.attachmentDtos.length = 0;
                    vm.isProcessing = false;
            });
        }


    }
})()