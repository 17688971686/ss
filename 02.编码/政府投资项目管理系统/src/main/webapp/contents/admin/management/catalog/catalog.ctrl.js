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
    		if($state.current.name == 'catalog_policy'){
    			vm.page = 'policy';
    		}
    		if($state.current.name == 'catalog_policyCatalogEdit'){
    			vm.page = 'policyCatalogEdit';
    		}
    		if($state.current.name == 'catalog_policyCatalogSecondList'){
    			vm.page = 'policyCatalogSecondList';
    		}
    		if($state.current.name == 'catalog_secondaryPolicyCatalogEdit'){
    			vm.page = 'secondaryPolicyCatalogEdit';
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
        	if(vm.page == 'policy'){
        		page_policy();//政策目录列表
        	}
        	if(vm.page == 'policyCatalogEdit'){
        		page_policyCatalogEdit();//政策目录主目录添加页
        	}
        	if(vm.page == 'policyCatalogSecondList'){
        		page_policyCatalogSecondList();//政策目录次级目录列表页
        	}
        	if(vm.page == 'secondaryPolicyCatalogEdit'){
        		page_secondaryPolicyCatalogEdit();//政策目录次级目录编辑页
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
        				catalogSvc.deleteAgencyServiceMattersCatalog(vm,id);
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
            			catalogSvc.deletePartApprovalMatters(vm,id);
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
        
        //政策条目编辑页面
        function page_secondaryPolicyCatalogEdit(){
        	vm.title = '政策条目编辑';
        	//根据vm.id是否存在，存在则显示次级编辑页面内容！
        	if(vm.id){
        		vm.isPolicyCatalogSecondList = true;
        	}
        	//点击按钮保存到数据信息
        	vm.savePolicyCatalog = function(){
        		common.initJqValidation();
    			var isValid = $('form').valid();
        		if(isValid){//通过则可以进行下一步
        			vm.model.parentId = vm.id;
        			catalogSvc.createPolicyCatalog(vm);
        		}
        	};
        }
        
        //政策目录次级目列表页
        function page_policyCatalogSecondList(){
        	//根据id获取政策目录信息
        	catalogSvc.getPolicyCatalogById(vm);
        	//根据parentId获取符合条件的次级目录列表
        	catalogSvc.grid_policyCatalogSecondary(vm);
        	//点击删除按钮，根据提示是否删除此条记录
        	vm.deleteSecondPolicyCatalog = function(id){
        		common.confirm({
            		vm :vm,
            		title:"",
            		msg:"确认要删除此记录吗？",
            		fn : function(){
            			$('.confirmDialog').modal('hide');
            			catalogSvc.deletePolicyCatalog(vm,id);
            		}
            	});
        	};
        	//点击批量删除按钮，根据提示是否删除记录
        	vm.deleteSecondPolicyCatalogs = function(){
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
	                     	catalogSvc.deletePolicyCatalogs(vm,idStr);
	                    }
	                });
	            }
	    	};
        	
        }//end fun policyCatalogSecondList
        
        //政策目录添加页
        function page_policyCatalogEdit(){
        	vm.title = '政策目录编辑';
        	vm.savePolicyCatalog = function(){
        		common.initJqValidation();
    			var isValid = $('form').valid();
    			if(isValid){//通过则可以进行下一步
    				catalogSvc.createPolicyCatalog(vm);
    			}
        	};
        }
        
        //政策目录列表页面
        function page_policy(){
        	vm.title = '适用产业政策类型列表';
        	//获取使用产业政策类型列表
        	catalogSvc.grid_policyCatalog(vm);
        	//点击删除按钮，进行删除操作，同时删除所依附的次级所有目录
        	vm.deleteFirstPolicyCatalog = function(id){
        		common.confirm({
            		vm :vm,
            		title:"",
            		msg:"确认要删除此记录吗？",
            		fn : function(){
            			$('.confirmDialog').modal('hide');
            			catalogSvc.deletePolicyCatalog(vm,id);
            		}
            	});
        	};
        	//点击批量删除按钮，根据提示是否删除记录
        	vm.deleteFirstPolicyCatalogs = function(){
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
        	//删除按钮
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
        	//批量删除按钮
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
