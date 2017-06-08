(function () {
    'use strict';

    angular
        .module('app')
        .controller('projectCtrl', project);

    project.$inject = ['$location','projectSvc','$state','$scope']; 

    function project($location, projectSvc,$state,$scope) {
        /* jshint validthis:true */
    	var vm = this;
    	vm.title = "新增项目";
    	vm.model={};
        vm.id=$state.params.id;        
    	vm.page="list";
    	function init(){    		
    		if($state.current.name=='projectEdit'){
    			vm.page='create'
    		}
    		if(vm.id){
    			vm.page='update';
    		}
    		
    	}
    	init();    	
    	activate();
        function activate() {
        	
        	
        	if(vm.page=='list'){
        		init_list();
        	}
        	if(vm.page=='create'){
        		init_create();
        	}
        	if(vm.page=='update'){
        		init_create();
        		init_update();
        	}
        }
    	
    	function init_list(){
    		projectSvc.grid(vm);
    		
    		vm.del = function (id) {
                common.confirm({
               	 vm:vm,
               	 title:"",
               	 msg:"确认删除数据吗？",
               	 fn:function () { 
               		$('.confirmDialog').modal('hide');
                    projectSvc.deleteProject(vm,id);
                    }
                })
           }//del
    		vm.dels = function(){
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
           }//dels
          
    	}//init_list
    	
    	function init_create(){
    		//建设单位信息
    		projectSvc.getUserUnits(vm);
    		//begin#基础数据
    		vm.basicData={};    
    		//项目阶段
    		vm.basicData.projectStage=$linq(common.getBasicData())
    		.where(function(x){return x.identity=='projectStage'&&x.pId=='projectStage';})
    		.toArray();
    		//项目类型
    		vm.basicData.projectType=$linq(common.getBasicData())
    		.where(function(x){return x.identity=='projectType'&&x.pId=='projectType';})
    		.toArray();
    		//行业归口
    		vm.basicData.projectIndustry=$linq(common.getBasicData())
    		.where(function(x){return x.identity=='projectIndustry'&&x.pId=='projectIndustry';})
    		.toArray();    		
    		
    		vm.projectIndustryChange=function(){    		
        		vm.basicData.projectIndustryChildren=$linq(common.getBasicData())
        		.where(function(x){return x.identity=='projectIndustry'&&x.pId==vm.model.projectIndustryParent;})
        		.toArray();
    		}
    		//投资类型
    		vm.basicData.projectInvestmentType=$linq(common.getBasicData())
    		.where(function(x){return x.identity=='projectInvestmentType'&&x.pId=='projectInvestmentType';})
    		.toArray(); 
    		//项目分类
    		vm.basicData.projectClassify=$linq(common.getBasicData())
    		.where(function(x){return x.identity=='projectClassify'&&x.pId=='projectClassify';})
    		.toArray(); 
    		//end#基础数据
    		
    		//批复文件上传
    		vm.uploadType=[['JYS','项目建议书'],
    			['KXXYJBG','可行性研究报告'],
    			['CBSJYGS','初步设计与概算']];
    		
    		vm.uploadSuccess=function(e){
     			var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
	           	 if(e.XMLHttpRequest.status==200){
	           		 var fileName=e.XMLHttpRequest.response;
	           		 $scope.$apply(function(){
	           			 if(vm.model.attachmentDtos){
	           				 vm.model.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
	           			 }else{
	           				 vm.model.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
	           			 }                			           			
	           		 });
	           	 }
    		}
    		 vm.delFile=function(idx){
            	 vm.model.attachmentDtos.splice(idx,1);
             }
    		 
    		 vm.capitalTotal=function(){
    			 return (parseFloat(vm.model.capitalSCZ_ggys)||0 )
    			 		+ (parseFloat(vm.model.capitalSCZ_gtzj)||0 )
    			 		+ (parseFloat(vm.model.capitalSCZ_zxzj)||0 )
    			 		+ (parseFloat(vm.model.capitalQCZ_ggys)||0 )
    			 		+ (parseFloat(vm.model.capitalQCZ_gtzj)||0 )
    			 		+ (parseFloat(vm.model.capitalSHTZ)||0 )
    			 		+ (parseFloat(vm.model.capitalOther)||0) ;
    		 }
	        
    		 vm.create = function () {    			 
    		     projectSvc.createProject(vm);    		     
    		 }
    		 
    		 
    			 
    		 
    	}//init_create
    	
    	function init_update(){
    		vm.title = "编辑项目"
    		//获取项目信息
    		projectSvc.getProjectById(vm);
    		//更新项目
    		vm.update = function(){
    			projectSvc.updateProject(vm);
    		}   	   		
    	}//init_update        
    }
})();
