(function () {
    'use strict';

    angular
        .module('app')
        .controller('portalCtrl', portal);

    portal.$inject = ['$location','portalSvc','$state','$scope']; 

    function portal($location, portalSvc,$state,$scope) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.model={};
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
        	vm.onSelect=function(e){
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
        	//upload
        	$("#files").kendoUpload({
                async: {
                    saveUrl: "/common/save",
                    removeUrl: "/common/remove",
                    autoUpload: true
                },
                showFileList:false,
                select:vm.onSelect,
                success:function(e){
                    console.log("error:");
                    console.log(e);
                    if(e.XMLHttpRequest.status==200){
                        angular.forEach(eval("("+e.XMLHttpRequest.response+")").data, function (fileObj, index) {
                            $scope.$apply(function() {
                                if(vm.model.attachmentDtos){
                                    vm.model.attachmentDtos.push({
                                        name: fileObj.originalFilename,
                                        url: fileObj.randomName,
                                        type: vm.type
                                    });
                                } else {
                                    vm.model.attachmentDtos = [{
                                        name: fileObj.originalFilename,
                                        url: fileObj.randomName,
                                        type: vm.type
                                    }];
                                }
                            });
                        })
                        // var fileName=e.XMLHttpRequest.response;
                        // $scope.$apply(function(){
                        //     if(vm.model.attachmentDtos){
                        //         vm.model.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:vm.type});
                        //     }else{
                        //         vm.model.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:vm.type}];
                        //     }
                        // });
                    }
				},
                error:function(e){
                    common.alert({
                        vm : vm,
                        msg : e.XMLHttpRequest.response.message
                    });
                },
                localization: {
                    select: "上传文件"
                },
                validation: {
   	                maxFileSize: common.basicDataConfig().uploadSize
   	            }
            });
        };//end init_upload
       
        vm.delFile=function(idx){
        	vm.model.attachmentDtos.splice(idx,1);
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
