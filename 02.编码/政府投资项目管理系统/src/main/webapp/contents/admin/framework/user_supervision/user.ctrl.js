(function () {
    'use strict';

    angular
        .module('appSupervision')
        .controller('userCtrl', user);

    user.$inject = ['$location','userSvc']; 

    function user($location, userSvc) {
        /* jshint validthis:true */
    	var vm = this;
        vm.title = '用户列表';
        

        vm.del = function (id) {        	       	 
             common.confirm({
            	 vm:vm,
            	 title:"",
            	 msg:"确认删除数据吗？",
            	 fn:function () {
                  	$('.confirmDialog').modal('hide');             	
                    userSvc.deleteUser(vm,id);
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
       
       vm.initUser=function(type,id){
    	   if(type=='password'){
    		   //var msg=$.md5('Passw0rd');//MD5加密密码
    		   //对密码进行RSA加密
    		   var key = $("#rsaPrivateKey").val();//获取公钥信息
               var rsa = new RSAKey();
               rsa.setPublic(key, "10001");
               var msg = rsa.encrypt('Passw0rd');//密码RSA公钥加密
    	   }
    	   if(type=='loginFailCount'){
    		   var msg=0;
    	   }
    	   userSvc.initUser(vm,type,id,msg);
       };
       
        activate();
        function activate() {
            userSvc.grid(vm);
        }
    }
})();
