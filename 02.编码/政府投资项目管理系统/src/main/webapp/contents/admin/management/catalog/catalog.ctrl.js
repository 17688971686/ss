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
    	vm.type = $state.params.type;
    	vm.title='投资项目分类列表';
        
    	function init(){
    		
    		if($state.current.name == 'catalog_investment'){
    			vm.page = 'investment';
    			vm.type = 'projectIndustry';
    		}
    		if($state.current.name == 'catalog_investment_projectIndustry'){
    			vm.page = 'investment_projectIndustry';
    		}
    		if($state.current.name == 'catalog_addSecondCatalog'){
    			vm.page = 'addSecondCatalog';
    		}
    		if($state.current.name == 'catalog_investmentEdit'){
    			vm.page = 'investmentEdit';
    		}
    		if($state.current.name == 'catalog_investmentAlter'){
    			vm.page = 'investmentAlter';
    		}
    		if($state.current.name == 'catalog_investmentList_projectType'){
    			vm.page = 'investment';
    			vm.type = 'projectType';
    		}
    		if($state.current.name == 'catalog_investmentList_constructionType'){
    			vm.page = 'investment';
    			vm.type = 'constructionType';
    		}
    		if($state.current.name == 'catalog_policy'){
    			vm.page = 'policy';
    			vm.type = 'encourage';
    		}
    		if($state.current.name == 'catalog_policyAllowList'){
    			vm.page = 'policy';
    			vm.type = 'allow';
    		}
    		if($state.current.name == 'catalog_policyLimitList'){
    			vm.page = 'policy';
    			vm.type = 'limit';
    		}
    		if($state.current.name == 'catalog_policyCatalogEdit'){
    			vm.page = 'policyCatalogEdit';
    		}
    		if($state.current.name == 'catalog_policyCatalogAlter'){
    			vm.page = 'policyCatalogAlter';
    		}
    		if($state.current.name == 'catalog_partApprovalMatters'){
    			vm.page = 'partApprovalMattersList';
    		}
    		if($state.current.name == 'catalog_partApprovalMattersEdit'){
    			vm.page = 'partApprovalMattersEdit';
    		}
    		if($state.current.name == 'catalog_partApprovalMattersAlter'){
    			vm.page = 'partApprovalMattersAlter';
    		}
    		if($state.current.name == 'catalog_partApprovalMattersDetails'){
    			vm.page = 'partApprovalMattersDetails';
    		}
    		if($state.current.name == 'catalog_agencyServiceMatters'){
    			vm.page = 'agencyServiceMattersList';
    		}
    		if($state.current.name == 'catalog_agencyServiceMattersEdit'){
    			vm.page = 'agencyServiceMattersEdit';
    		}
    		if($state.current.name == 'catalog_agencyServiceMattersAlter'){
    			vm.page = 'agencyServiceMattersAlter';
    		}
    		if($state.current.name == 'catalog_agencyServiceMattersDetails'){
    			vm.page = 'agencyServiceMattersDetails';
    		}
    		
    		//全选框选择--项目行业分类
        	$(document).on('click', '#checkboxAll_projectIndustry', function () {
                var isSelected = $(this).is(':checked');
                $('.projectIndustryGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
            });
        	//全选框选择--项目类型
        	$(document).on('click', '#checkboxAll_projectType', function () {
                var isSelected = $(this).is(':checked');
                $('.projectTypeGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
            });
        	//全选框选择--建设类型
        	$(document).on('click', '#checkboxAll_constructionType', function () {
                var isSelected = $(this).is(':checked');
                $('.constructionTypeGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
            });
        	//全选框选择--鼓励类
        	$(document).on('click', '#checkboxAll_policyCatalog', function () {
                var isSelected = $(this).is(':checked');
                $('.policyCatalogEncourageGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
            });
        	//全选框选择--允许类
        	$(document).on('click', '#checkboxAll_policyAllow', function () {
                var isSelected = $(this).is(':checked');
                $('.policyCatalogAllowGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
            });
        	//全选框选择--限制类
        	$(document).on('click', '#checkboxAll_policyLimit', function () {
                var isSelected = $(this).is(':checked');
                $('.policyCatalogLimitGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
            });
        	
    		vm.alert=function(str){
    			vm.type= str;
    		};
    	}
    	
    	activate();
    	
        function activate() {
        	init();
        	if(vm.page == 'investment'){
        		page_investmentList();
        	}
        	if(vm.page == 'investment_projectIndustry'){
        		page_investment_projectIndustry();
        	}
        	if(vm.page == 'investmentEdit'){
        		page_investmentEdit();
        	}
        	if(vm.page == 'addSecondCatalog'){
        		page_addSecondCatalog();
        	}
        	if(vm.page == 'investmentAlter'){
        		page_investmentAlter();
        	}
        	if(vm.page == 'policy'){
        		page_policy();//政策目录列表
        	}
        	if(vm.page == 'policyCatalogEdit'){
        		page_policyCatalogEdit();//政策目录主目录添加页
        	}
        	if(vm.page == 'policyCatalogAlter'){
        		page_policyCatalogAlter();//政策条目修改
        	}
        	if(vm.page == 'partApprovalMattersList'){
        		page_partApprovalMattersList();//部门审批事项列表页
        	}
        	if(vm.page == 'partApprovalMattersEdit'){
        		page_partApprovalMattersEdit();//部门审批事项编辑页
        	}
        	if(vm.page == 'partApprovalMattersAlter'){
        		page_partApprovalMattersAlter();//部门审批事项更新页
        	}
        	if(vm.page == 'partApprovalMattersDetails'){
        		page_partApprovalMattersDetails();//部门审批事项详情页
        	}
        	if(vm.page == 'agencyServiceMattersList'){
        		page_agencyServiceMattersList();//中介服务事项目录列表页
        	}
        	if(vm.page == 'agencyServiceMattersEdit'){
        		page_agencyServiceMattersEdit();//中介服务事项编辑页
        	}
        	if(vm.page == 'agencyServiceMattersAlter'){
        		page_agencyServiceMattersAlter();//中介服务事项修改页
        	}
        	if(vm.page == 'agencyServiceMattersDetails'){
        		page_agencyServiceMattersDetails();//中介服务事项详情页
        	}
        	
        	
        }
        
        
      
        
        //中介服务事项详情页
        function page_agencyServiceMattersDetails(){
        	vm.title= '中介服务事项详情页';
        	vm.isAgencyServiceMattersDetails = true;
        	catalogSvc.getAgencyServiceMattersById(vm);
        }//end fun page_agencyServiceMattersDetails
        
        //中介服务事项修改页
        function page_agencyServiceMattersAlter(){
        	vm.title = '中介服务事项修改';
        	//显示更新按钮
        	vm.isShowConfirm = true;
        	//根据id获取原数据，显示在页面中
        	catalogSvc.getAgencyServiceMattersById(vm);
        	//更新按钮
        	vm.updateAgencyServiceMatters = function(){
        		common.initJqValidation();
        		var isValid = $('form').valid();
        		if(isValid){//通过则进行下一步
        			catalogSvc.updateAgencyServiceMatters(vm);
        		}
        	};
        	
        }//end fun page_agencyServiceMattersAlter
        
        //中介服务事项编辑页
        function page_agencyServiceMattersEdit(){
        	vm.title = '中介服务事项编辑';
        	vm.saveAgencyServiceMatters = function(){
        		common.initJqValidation();
        		var isValid = $('form').valid();
        		if(isValid){//通过则执行下一步
        			catalogSvc.createAgencyServiceMatters(vm);
        		}
        		
        	};
        	
        }//end fun page_agencyServiceMattersEdit
        
        //中介服务事项目录列表页
        function page_agencyServiceMattersList(){
        	vm.title = '中介服务事项列表';
        	catalogSvc.grid_agencyServiceMatters(vm);
        	//删除按钮
        	vm.deleteAgencyServiceMattersCatalog = function(id){
        		common.confirm({
        			vm : vm,
        			msg : '确认要删除此记录吗？',
        			fn : function(){
        				$('.confirmDialog').modal('hide');
        				catalogSvc.deleteAgencyServiceMattersCatalogs(vm,id);
        			}
        		});
        	};
        	//批量删除按钮
        	vm.deleteAgencyServiceMattersCatalogs = function(){
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
	                     	catalogSvc.deleteAgencyServiceMattersCatalogs(vm,idStr);
	                    }
	                });
	            }
        	};
        	
        }//end fun page_agencyServiceMattersList
        
        //部门审批事项详情页
        function page_partApprovalMattersDetails(){
        	vm.title = '部门审批事项详情';
        	vm.isPartApprovalMattersDetails = true;
        	catalogSvc.getpartApprovalMattersById(vm);
        }//end fun page_partApprovalMattersDetails
        
        //部门审批事项更新页
        function page_partApprovalMattersAlter(){
        	vm.title = '部门审批事项修改';
        	//显示更新按钮
        	vm.isShowConfirm = true;
        	//获取原数据
        	catalogSvc.getpartApprovalMattersById(vm);
        	//点击更新按钮
        	vm.updatePartApprovalMatters = function(){
        		common.initJqValidation();
        		var isValid = $('form').valid();
        		if(isValid){//通过则进行下一步
        			catalogSvc.updatePartApprovalMatters(vm);
        		}
        	};
        }//end fun page_partApprovalMattersAlter
        
        //部门审批事项编辑页
        function page_partApprovalMattersEdit(){
        	vm.title = '部门审批事项编辑';
        	vm.savePartApprovalMatters = function(){
        		common.initJqValidation();
        		var isValid = $('form').valid();
        		if(isValid){//通过则可以进行下一步
        			catalogSvc.createPartApprovalMatters(vm);
        		}
        	};
        }//end fun page_partApprovalMattersEdit
        
        //部门审批事项列表页
        function page_partApprovalMattersList(){
        	vm.title = '部门审批事项列表';
        	catalogSvc.grid_partApprovalMatters(vm);
        	//点击列表中的删除按钮，根据提示是否删除数据
        	vm.deletePartApprovalMattersCatalog = function(id){
        		common.confirm({
        			vm :vm,
            		title:"",
            		msg:"确认要删除此记录吗？",
            		fn : function(){
            			$('.confirmDialog').modal('hide');
            			catalogSvc.deletePartApprovalMattersCatalogs(vm,id);
            		}
        		});
        	};
        	//点击批量删除按钮，根据提示是否删除数据
        	vm.deletePartApprovalMattersCatalogs = function(){
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
	                     	catalogSvc.deletePartApprovalMattersCatalogs(vm,idStr);
	                    }
	                });
	            }
	    	};
        }//end fun page_partApprovalMattersList
        
        //政策条目修改
        function page_policyCatalogAlter(){
        	vm.title = '政策条目修改';
        	//显示更新按钮
        	vm.isShowConfirm = true;
        	//根据id获取源数据信息
        	catalogSvc.getPolicyCatalogById(vm);
        	//点击更新按钮进行更新数据操作
        	vm.updatePolicyCatalog = function(){
        		common.initJqValidation();
    			var isValid = $('form').valid();
        		if(isValid){//通过则可以进行下一步
        			catalogSvc.updatePolicyCatalog(vm);
        		}
        	};
        }//end fun page_policyCatalogAlter
        
        //政策条目添加页
        function page_policyCatalogEdit(){

        	if(vm.type == 'encourage'){
        		vm.title = '适用产业政策条目(鼓励类)编辑';
        		vm.policyCatalogEncourage = true;
        	}
        	if(vm.type == 'allow'){
        		vm.title = '适用产业政策条目(允许类)编辑';
        		vm.policyCatalogAllow = true;
        	}
        	if(vm.type == 'limit'){
        		vm.title = '适用产业政策条目(限制类)编辑';
        		vm.policyCatalogLimit = true;
        	}
        	vm.model.type = vm.type;
        	//创建按钮
        	vm.savePolicyCatalog = function(){
        		common.initJqValidation();
    			var isValid = $('form').valid();
    			if(isValid){//通过则可以进行下一步
    				catalogSvc.createPolicyCatalog(vm);
    			}
        	};
        }
        
        //政策目录页面
        function page_policy(){
        	vm.title = '适用产业政策类型列表';
        	//获取策类型列表
        	catalogSvc.grid_policyCatalog(vm);
        	catalogSvc.grid_policyAllow(vm);
        	catalogSvc.grid_policyLimit(vm);
        	//点击删除按钮，进行删除操作，同时删除所依附的次级所有目录
        	vm.deleteFirstPolicyCatalog = function(id){
        		common.confirm({
            		vm :vm,
            		title:"",
            		msg:"确认要删除此记录吗？",
            		fn : function(){
            			$('.confirmDialog').modal('hide');
            			catalogSvc.deletePolicyCatalogs(vm,id);
            		}
            	});
        	};
        	//点击批量删除按钮，根据提示是否删除记录
        	vm.deleteFirstPolicyCatalogs = function(){
        		var selectIds;
        		if(vm.type == 'encourage'){
        			selectIds = common.getKendoCheckId('.policyCatalogEncourageGrid');
				}else if(vm.type == 'allow'){
					selectIds = common.getKendoCheckId('.policyCatalogAllowGrid');
				}else if(vm.type == 'limit'){
					selectIds = common.getKendoCheckId('.policyCatalogLimitGrid');
				}
        		
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
	                     	catalogSvc.deletePolicyCatalogs(vm,idStr);
	                    }
	                });
	            }
	    	};
        }//end fun page_policy
        
        //投资项目修改和项目行业二级目录编辑页面
        function page_investment_projectIndustry(){
        	vm.title = '项目行业分类';
        	catalogSvc.getCatalogById(vm);
        	catalogSvc.grid_InvestmentProjectSecondary(vm);
        	
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
            			catalogSvc.removeSecondCatalogs(vm,id);
            		}
            	});
        	};
        }
        
        //投资项目修改页
        function page_investmentAlter(){
        	vm.isShowConfirm = true;
        	catalogSvc.getCatalogById(vm);
        	//更新按钮
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
        }
        
        //投资项目二级新增页
        function page_addSecondCatalog(){
        	vm.title = '项目行业编辑';
        	vm.projectIndustrySecondCatalog = true;
        	vm.model.type = 'projectIndustry';
        	vm.model.parentId = vm.id;
        	//创建按钮
        	vm.saveInvestment = function(){
    			common.initJqValidation();
    			var isValid = $('form').valid();
    			if(isValid){//通过则可以进行下一步
    				catalogSvc.createCatalog(vm);
    			}
    		};
        }//end fun page_addSecondCatalog
        
        //投资项目一级新增页
        function page_investmentEdit(){
        	if(vm.type == 'projectIndustry'){
        		vm.title = '项目行业编辑';
        		vm.projectIndustryCatalog = true;
        	}
        	if(vm.type == 'projectType'){
        		vm.title = '项目类型编辑';
        		vm.projectTypeCatalog = true;
        	}
        	if(vm.type == 'constructionType'){
        		vm.title = '建设类型编辑';
        		vm.constructionTypeCatalog = true;
        	}
        	vm.model.type = vm.type;
        	//创建按钮
        	vm.saveInvestment = function(){
    			common.initJqValidation();
    			var isValid = $('form').valid();
    			if(isValid){//通过则可以进行下一步
    				catalogSvc.createCatalog(vm);
    			}
    		};
        }//end fun page_investmentEdit
        
        //投资项目列表页
        function page_investmentList(){
        		
        	//获取投资项目列表,默认为项目行业
        	catalogSvc.grid_InvestmentProject(vm);
        	catalogSvc.grid_projectType(vm);
        	catalogSvc.grid_constructionType(vm);
        	
        	//删除按钮
        	vm.deleteCatalog = function(id){
        		common.confirm({
            		vm :vm,
            		title:"",
            		msg:"确认要删除此记录吗？",
            		fn : function(){
            			$('.confirmDialog').modal('hide');
            			catalogSvc.removeFirstCatalogs(vm,id);
            		}
            	});
        	};
        	//批量删除按钮
        	vm.deleteCatalogs = function(){
        		var selectIds;
        		if(vm.type == 'projectIndustry'){
        			selectIds = common.getKendoCheckId('.projectIndustryGrid');
				}else if(vm.type == 'projectType'){
					selectIds = common.getKendoCheckId('.projectTypeGrid');
				}else if(vm.type == 'constructionType'){
					selectIds = common.getKendoCheckId('.constructionTypeGrid');
				}
				
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
