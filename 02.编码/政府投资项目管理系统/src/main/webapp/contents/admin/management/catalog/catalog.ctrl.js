(function () {
    'use strict';

    angular
        .module('app')
        .controller('catalogCtrl', catalog);

    catalog.$inject = ['$location','catalogSvc','$state','$scope','$sce']; 

    function catalog($location, catalogSvc,$state,$scope,$sce) {
        /* jshint validthis:true */
    	var vm = this;    	
    	vm.model={};
    	vm.basicData={};
    	vm.secondary = {};
    	vm.id = $state.params.id;
    	vm.title='项目行业分类列表';
    	vm.page="catalog_investmentProject";//默认为投资项目目录列表页
        
    	function init(){
    		
    		if($state.current.name == 'catalog_investment_projectIndustry'){
    			vm.page = 'investment_projectIndustry';
    		}
    		
    	}
    	activate();
        function activate() {
        	init();
        	if(vm.page == 'catalog_investmentProject'){
        		page_investmentList();
        	}
        	if(vm.page == 'investment_projectIndustry'){
        		page_investment_projectIndustry();
        	}
        }
        
        //投资项目修改和项目行业二级目录编辑页面
        function page_investment_projectIndustry(){
        	catalogSvc.getCatalogById(vm);
        	catalogSvc.grid_InvestmentProjectSecondary(vm);
        	//点击更新按钮
        	vm.updateCatalog = function(){
        		vm.model.id = vm.id;
        		common.initJqValidation();
    			var isValid = $('form').valid();
    			if(isValid){//通过则可以进行下一步
    				vm.secondary.parentId = vm.id;
    				vm.secondary.type = 'projectIndustry';
    				catalogSvc.updateCatalog(vm);
    			}
        	};
        	
        	//添加按钮
        	vm.addSecondary = function(){
        		$('#addSecondaryCatalog').modal('show');//显示投资项目模态框
        		//点击模态框确定按钮
        		vm.confirm_addSecond = function(){
        			common.initJqValidation();
        			var isValid = $('#second').valid();
        			if(isValid){//通过则可以进行下一步
        				vm.secondary.parentId = vm.id;
        				vm.secondary.type = 'projectIndustry';
        				catalogSvc.createSecondCatalog(vm);
        				$('.addName').val('');
        				$('.addCode').val('');
        				$('#addSecondaryCatalog').modal('hide');
    					$(".modal-backdrop").remove(); //去掉模态框背面的阴影
        			}
        		};
        		vm.cancelAdd = function(){
        			$('.addName').val('');
    				$('.addCode').val('');
    				$('#addSecondaryCatalog').modal('hide');
					$(".modal-backdrop").remove(); //去掉模态框背面的阴影
        		};
        	};
        	
        	//点击批量删除按钮
        	vm.deleteSecondaryCatalogs = function(){
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
	                common.confirm({
	               	 vm:vm,
	               	 title:"",
	               	 msg:"确认删除数据吗？",
	               	 fn:function () {
	                     	$('.confirmDialog').modal('hide');             	
	                     	catalogSvc.removeSecondCatalogs(vm,idStr);
	                    }
	                });
	            }
	    	};
        	
        	//删除按钮
        	vm.deleteSecondary = function(id){
        		common.confirm({
            		vm :vm,
            		title:"",
            		msg:"确认要删除此记录吗？",
            		fn : function(){
            			$('.confirmDialog').modal('hide');
            			catalogSvc.deleteSecondaryCatalog(vm,id);
            		}
            	});
        	};
        	//编辑按钮
        	vm.changeSecondary = function(id){
        		vm.secondCatalogId = id;
        		catalogSvc.getSecondCatalogById(vm);
        		$('#updateSecondaryCatalog').modal('show');
        		//点击模态框确定按钮
        		vm.confirm_updateSecond = function(){
        			common.initJqValidation();
        			var isValid = $('#second').valid();
        			if(isValid){//通过则可以进行下一步
        				catalogSvc.changeSecondCatalog(vm);
        				$('#updateSecondaryCatalog').modal('hide');
    					$(".modal-backdrop").remove(); //去掉模态框背面的阴影
        			}
        		};
        	};
        }
        
        //投资项目列表页
        function page_investmentList(){
        	vm.showProjectIndustry = false;
        	vm.model.type = 'projectIndustry';
        	//获取投资项目列表,默认为项目行业
        	catalogSvc.grid_InvestmentProject(vm);
        	//项目行业分类按钮
        	vm.showProjectIndustry = function(){
	          	vm.title='项目行业分类列表';
	          	vm.projectIndustryButton = false;
	          	vm.projectTypeButton = false;
	          	vm.constructionTypeButton= false;
	          	vm.projectIndustry = false;
	          	vm.projectType = false;
	          	vm.constructionType = false;
	          	vm.model.type = 'projectIndustry';
        	};
        	//项目类型按钮
        	vm.showProjectType = function(){
	          	vm.title = '项目类型列表';
	          	vm.projectTypeButton = true;
	          	vm.projectIndustryButton = true;
	          	vm.projectIndustry = true;
	          	vm.constructionTypeButton = false;
	          	vm.projectType = true;
	          	vm.constructionType = false;
	          	catalogSvc.grid_projectType(vm);
	          	vm.model.type = 'projectType';
        	};
        	//建设类型按钮
        	vm.showConstructionType = function(){
	          	vm.title = '建设类型列表';
	          	vm.projectIndustryButton = true;
	          	vm.projectTypeButton = false;
	          	vm.constructionTypeButton= true;
	          	vm.projectIndustry = true;
	          	vm.projectType = false;
	          	vm.constructionType = true;
	          	catalogSvc.grid_constructionType(vm);
	          	vm.model.type = 'constructionType';
        	};
        	
        	//点击新增按钮 
        	vm.addCatalog = function(){
        		$('#catalog').modal('show');//显示投资项目模态框
        		//点击模态框确定按钮
        		vm.confirmSubmit = function(){
        			common.initJqValidation();
        			var isValid = $('form').valid();
        			if(isValid){//通过则可以进行下一步
        				catalogSvc.createCatalog(vm);
        				$('.name').val('');
        				$('.code').val('');
        				$('#catalog').modal('hide');
    					$(".modal-backdrop").remove(); //去掉模态框背面的阴影
        			}
        		};
        		//点击模态框取消按钮，清空已填数据
        		vm.cancelMain =function(){
        			$('.name').val('');
    				$('.code').val('');
    				$('#catalog').modal('hide');
					$(".modal-backdrop").remove(); //去掉模态框背面的阴影
        		};
        	};
        	//点击删除按钮
        	vm.deleteCatalog = function(id){
        		common.confirm({
            		vm :vm,
            		title:"",
            		msg:"确认要删除此记录吗？",
            		fn : function(){
            			$('.confirmDialog').modal('hide');
            			catalogSvc.deleteCatalog(vm,id);
            		}
            	});
        	};
        	vm.deleteCatalogs = function(){
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
	                common.confirm({
	               	 vm:vm,
	               	 title:"",
	               	 msg:"确认删除数据吗？",
	               	 fn:function () {
	                     	$('.confirmDialog').modal('hide');             	
	                     	catalogSvc.removeFirstCatalogs(vm,idStr);
	                    }
	                });
	            }
	    	};
        	
        }//end fun page_catalog_investmentList
        
        
    }
})();
