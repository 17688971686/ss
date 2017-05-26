(function () {
    'use strict';

    angular
        .module('app')
        .controller('demoCtrl', demo);

    demo.$inject = ['$location','demoSvc']; 

    function demo($location, demoSvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '';
        vm.tabActive=1;
        
        vm.tab=function(tabActive){
        	vm.tabActive=tabActive;        	
        }
        
        
        vm.showDialog=function(){
        	
        	 $('.myDialog').modal({
                 backdrop: 'static',
                 keyboard:false
             });
        }
        
        function datetimePicker(){
        	$("#datepicker").kendoDatePicker({
        		culture:'zh-CN'
        	});
        }
        
        function upload(){
        	 $("#files").kendoUpload({
                 async: {
                     saveUrl: "/demo/save",
                     removeUrl: "/demo/remove",
                     autoUpload: true
                 }
             });
        	 $("#files2").kendoUpload({
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
                 error:function(e){
                	 console.log("error:");
                	 console.log(e);
                	 if(e.XMLHttpRequest.status==200){
                		 var fileName=e.XMLHttpRequest.response;
                		 alert("文件名："+fileName);
                	 }
                 },
                 localization: {
                     select: "选择文件"
                 }
             });
        }
        
        vm.setCookie=function(){
        	common.cookie().set('myCookie','userName',vm.cookie.userName);   
        	common.cookie().set('myCookie','password',vm.cookie.password);  
        };
        vm.getCookie=function(){
        	var value1=common.cookie().get('myCookie','userName');     
        	var value2=common.cookie().get('myCookie','password'); 
        	alert(common.format("用户名:{0},密码:{1}",value1,value2));
        };
        
        vm.textSubmit=function(){
        	alert(vm.content);
        }
        
        vm.init_select=function(){
        	vm.parentCategory="";
        	vm.childCategory="";
        	var basicData=common.getBasicData();
        	vm.parentList=$linq(basicData).where(function(x){return x.identity=='projectIndustry'&&x.pId=="";})
        							  .toArray();
        	vm.parentChange=function(){
        		vm.childList=$linq(basicData).where(function(x){return x.pId==vm.parentCategory;})
				  .toArray();
        	}
        	console.log(basicData)
        }
       
        activate();
        function activate() {
        	datetimePicker();
        	upload();
        	demoSvc.treeList(vm);
        	vm.init_select();
        }
    }
})();
