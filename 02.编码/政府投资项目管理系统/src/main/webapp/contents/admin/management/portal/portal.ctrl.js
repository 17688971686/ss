(function () {
    'use strict';

    angular
        .module('app')
        .controller('portalCtrl', portal);

    portal.$inject = ['$location','portalSvc','$state','$scope']; 

    function portal($location, portalSvc,$state,$scope) {
        /* jshint validthis:true */
    	var vm = this;    	
    	vm.type=$state.params.type;
    	vm.id=$state.params.id; 
        vm.init=function(){   
        	//title
        	switch (vm.type) {
			case "tzgg":
				vm.title="通知公告";
				break;
			case "zcfg":
				vm.title="政策法规";
				break;
			case "bszn":
				vm.title="办事指南";
				break;
			case "cybg":
				vm.title="常用表格";
				break;			
			}
        	//page
        	switch (vm.id) {
			case undefined:
				vm.page="list";
				break;
			case "":
				vm.page="create";
			break;
			default:
				vm.page="update";
				break;
			} 
        	
        };//end init
        
        vm.init_upload=function(){
        	vm.files=[];
        	//upload
        	$("#files").kendoUpload({
                async: {
                    saveUrl: "/common/save",
                    removeUrl: "/common/remove",
                    autoUpload: true
                },
                showFileList:false,
                select:function(e){
               	 console.log("select:");
               	 console.log(e);
                },
                success:function(e){
                	
                },
                error:function(e){
               	 console.log("error:");
               	 console.log(e);
               	 if(e.XMLHttpRequest.status==200){
               		 var fileName=e.XMLHttpRequest.response;
               		 $scope.$apply(function(){               			 
               			vm.files.push(fileName);               			
               		 });
               		 
               	 }
                },
                localization: {
                    select: "上传文件"
                }
            });
        };//end init_upload
       
        vm.delFile=function(idx){
        	vm.files.splice(idx,1);
        };
        
        vm.del = function (id) {        	 
             common.confirm({
            	 vm:vm,
            	 title:"",
            	 msg:"确认删除数据吗？",
            	 fn:function () {
                  	$('.confirmDialog').modal('hide');             	
                    portalSvc.del(vm,id);
                 }
             });
        };
        
        vm.dels = function () {     
        	var selectIds = common.getKendoCheckId('.grid');
            if (selectIds.length == 0) {
            	common.alert({
                	vm:vm,
                	msg:'请选择数据'               	
                });
            } else {
            	var ids=[];
                for (var i = 0; i < selectIds.length; i++) {
                	ids.push(selectIds[i].value);
				}  
                var idStr=ids.join(',');
                vm.del(idStr);
            }   
       };
        
        vm.create=function(){
        	portalSvc.create(vm);
        };
        vm.update=function(){
        	portalSvc.update(vm);
        };
        activate();
        function activate() {
        	vm.init();
        	if(vm.page=='list'){
        		portalSvc.grid(vm);
        	}
        	if(vm.page=='update'){
        		portalSvc.getById(vm);
        	}
        	if(vm.page=='create'||vm.page=='update'){
        		vm.init_upload();
        	}                        
        }
    }
})();
