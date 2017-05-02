(function () {
    'use strict';

    angular
        .module('app')
        .controller('perToDoCtrl', perToDo);

    perToDo.$inject = ['$location','perToDoSvc']; 

    function perToDo($location, perToDoSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = '个人待办列表';
        
        vm.projectDetais = function(id){
        	common.alert(id);
        }
        
        //合并审批项目
        vm.mergerApprovalItems = function(){
        	//获取被选中的项目id
        	var selectIds = common.getKendoCheckId('.grid');
        	if (selectIds.length == 0) {//如果没有选择
            	common.alert({
                	vm:vm,
                	msg:'请选择合并的项目'                	
                });
            }else {
            	var ids=[];
                for (var i = 0; i < selectIds.length; i++) {
                	//TODO 判断选择的项目是否是同一阶段的                	
                	ids.push(selectIds[i].value);
				}  
                var idStr=ids.join(',');
                //alert("这是测试--合并审批项目："+idStr); //--测试用
                //弹出合并模态框 TODO 怎么来编写模态框结构？
                common.confirm({
                	vm:vm,
               	 	title:"合并打包审批",
               	 	msg:"",               	 	
               	 	fn:function () {
                     	$('.confirmDialog').modal('hide');             	
                       
                    }
                });
                
                
                
            }   
        }

       
        activate();
        function activate() {
        	perToDoSvc.grid(vm);
        }
    }
})();