(function () {
    'use strict';
    
    angular
        .module('app')
        .controller('creditInfoCtrl', creditInfo);

    creditInfo.$inject = ['$location','creditInfoSvc','$state','$scope','$sce']; 

    function creditInfo($location, creditInfoSvc,$state,$scope,$sce) {
        var vm = this;
        vm.title = "信用异常项目申报单位列表";
        vm.model={};
        vm.blackListModel = {};
        vm.illegalNameModel = {};
        vm.page='list';
        vm.basicData = {};
        vm.id=$state.params.id;
        vm.projectNumber=$state.params.projectNumber;
        vm.projectName=$state.params.projectName;
        vm.unitName=$state.params.unitName;
        vm.createdDate=$state.params.createdDate;
        
        vm.init=function(){
        	if($state.current.name=='credit_illegalNameList'){
        		vm.page = 'illegalNameList';
        	}
        	if($state.current.name=='credit_illegalNameEdit'){
        		vm.page = 'addIllegalName';
        	}
        	if($state.current.name=='credit_updateIllegalName'){
        		vm.page='updateIllegalNameEdit'
        	}
        	if($state.current.name=='credit_illegalNameDetails'){
        		vm.page='illegalNameDetails';
        	}
        	if($state.current.name=='credit_blackList'){
        		vm.title = '信用黑名单项目申报单位列表';
        		vm.page = 'blackList';
        	}
        	if($state.current.name=='credit_blackListEdit'){
        		vm.title = '信用黑名单信息录入';
        		vm.page = 'addBlackList';
        	}
        	if($state.current.name=='credit_blackListDetails'){
        		vm.title = '黑名单信息详情';
        		vm.page = 'blackListDetails';
        	}
        	if($state.current.name=='credit_blackListAlter'){
        		vm.title = '黑名单信息更改'
        		vm.page = 'blackListAlter';
        	}
        	
        	
        	vm.getUnitName=function(unitId){
        		return common.getUnitName(unitId);
        	};
        	
        	vm.toDate=function(stringDate){
        		return common.toDate(stringDate);
        	};
        	
        	vm.formatDate=function(stringDate){
        		return common.formatDate(stringDate);
        	};
        	
        	vm.basicData.userUnit = common.getUserUnits();
        };
        
        activate();
        function activate() {        	
        	vm.init();
        	if(vm.page == 'illegalNameList'){
        		page_illegalNameList();
        	}
        	if(vm.page == 'addIllegalName'){
        		page_addIllegalNameInfo();
        	}
        	if(vm.page == 'updateIllegalNameEdit'){
        		vm.isIllegalEdit = true;
        		page_illegalNameEdit();
        	}
        	if(vm.page == 'illegalNameDetails'){
        		page_illegalNameDetails();
        	}
        	if(vm.page == 'blackList'){
        		page_blackList();
        	}
        	if(vm.page == 'addBlackList'){
        		page_addBlackList();
        	}
        	if(vm.page == 'blackListDetails'){
        		page_blackListDetails();
        	}
        	if(vm.page = 'blackListAlter'){
        		vm.isBlackListEdit = true;
        		page_blackListAlter();
        	}
        	
        }
        
        //黑名单修改页
        function page_blackListAlter(){
        	//根据黑名单id获取数据
        	creditInfoSvc.getBlackListById(vm);
        	//点击更新按钮，进行数据更新操作
        	vm.updateBlackListInfo = function(){
        		creditInfoSvc.updateBlackListById(vm);
        	};
        }
    	//点击取消按钮，返回黑名单列表页
    	vm.returnBlackListPage = function(){
    		location.href="#/creditInfo/blackList";
    	};
    	
        
        //黑名单详情页
        function page_blackListDetails(){
        	creditInfoSvc.getBlackListById(vm);
        }
        
        //黑名单录入页面
        function page_addBlackList(){
        	vm.title='黑名单信息录入';
        	vm.blackListModel.projectNumber=vm.projectNumber;
        	vm.blackListModel.projectName=vm.projectName;
        	vm.blackListModel.unitName=vm.unitName;
        	vm.blackListModel.shenbaoDate=vm.createdDate;
        	//点击确定按钮，把页面录入的数据保存到数据库
        	vm.saveBlackListInfo=function(){
        		common.initJqValidation();
            	var isValid = $('form').valid();
            	if(isValid ){
            		vm.blackListModel.shenbaoDate = vm.toDate(vm.blackListModel.shenbaoDate);
            		creditInfoSvc.createBlackList(vm);
            	}
        	};
        }//end fun page_addBlackList
        
        //信用黑名单列表
        function page_blackList(){
        	creditInfoSvc.blackListGrid(vm);
            //黑名单列表页面 查询按钮
            vm.searchBlackList=function(){
            	vm.blackListModel.shenbaoDate = vm.toDate(vm.blackListModel.shenbaoDate);
     		    var filters = [];
     		    if(vm.blackListModel.unitName !=null && vm.blackListModel.unitName !=''){
       			   filters.push({field:'unitName',operator:'eq',value:vm.blackListModel.unitName});
       		    }
     		    if(vm.blackListModel.shenbaoDate != null && vm.blackListModel.shenbaoDate != ''){
     			   filters.push({field:'shenbaoDate',operator:'eq',value:vm.blackListModel.shenbaoDate});
     		    }
     		    vm.gridBlackListGrid.dataSource.filter(filters);
     	    };
     	    //信用黑名单列表 录入按钮
            vm.addBlackList = function(){
            	//获取申报项目列表
            	creditInfoSvc.grid(vm);
            	//显示项目列表模态框
            	$('#shenbaoList').modal('show');
            	//没有选择数据的时候，"确定"按钮不可用
            	vm.isConfirm = true;
            	//选择一条数据后，"确定"按钮可用
            	vm.change=function(){
            		vm.isConfirm = false;
            	};
            	//点击模态框的确定按钮
            	vm.confirmBlackList = function(){
            		var selectId = common.getKendoCheckId('.grid');
            		if (selectId.length == 0) {
            			return;
            		} else {
            			var selectValue = selectId[0].value;
            			var str = selectValue.split(",")
            			var projectNumber = str[0];
            			var projectName = str[1];
            			var unitName = str[2];
            			var createdDate = str[3];
            			vm.blackListModel.projectNumber = projectNumber;
            			vm.blackListModel.projectName = projectName;
            			vm.blackListModel.unitName = unitName;
            			vm.blackListModel.createdDate = createdDate;
            			creditInfoSvc.haveBlackList(vm);
            			$('#shenbaoList').modal('hide');
            			$(".modal-backdrop").remove(); //去掉模态框背面的阴影
            		}   
            	};   
            	//点击模态框的取消或X按钮
            	vm.closeShenBaoWindow = function(){
            		$('#checkbox').removeAttr("checked");
            		$('#shenbaoList').modal('hide');
            		$(".modal-backdrop").remove(); //去掉模态框背面的阴影
            	};
            };
     	    //点击删除按钮，删除该条黑名单信息
        	vm.deleteBlackList = function(id){
        		vm.id = id;
        		common.confirm({
            		vm :vm,
            		title:"",
            		msg:"确认要删除此记录吗？",
            		fn : function(){
            			$('.confirmDialog').modal('hide');
            			creditInfoSvc.deleteBlackListById(vm);
            		}
            	});
        	};
        }//end fun page_blackList
        
        //点击查看按钮，查看项目异常具体信息
        function page_illegalNameDetails(){
        	creditInfoSvc.getIllegalNameById(vm);
        }
        
        function page_illegalNameList(){
        	//获取异常项目名列表
        	creditInfoSvc.illegalNameGrid(vm)
        	//条件查询
     	    vm.searchIllegalName=function(){
        		vm.illegalNameModel.shenbaoDate = vm.toDate(vm.illegalNameModel.shenbaoDate);
     		    var filters = [];
     		    if(vm.illegalNameModel.unitName !=null && vm.illegalNameModel.unitName !=''){
       			   filters.push({field:'unitName',operator:'eq',value:vm.illegalNameModel.unitName});
       		    }
     		    if(vm.illegalNameModel.shenbaoDate != null && vm.illegalNameModel.shenbaoDate != ''){
     			   filters.push({field:'shenbaoDate',operator:'eq',value:vm.illegalNameModel.shenbaoDate});
     		    }
     		    vm.gridIllegalNameInfo.dataSource.filter(filters);
     	    };
     	    //信用异常名录列表页面 录入按钮
            vm.addIllegalName = function(){
            	//获取申报项目列表
            	creditInfoSvc.grid(vm);
            	//显示项目列表模态框
            	$('#shenbaoList').modal('show');
            	//没有选择数据的时候，"确定"按钮不可用
            	vm.isConfirm = true;
            	//选择一条数据后，"确定"按钮可用
            	vm.change=function(){
            		vm.isConfirm = false;
            	};
            	//点击模态框的确定按钮
    			vm.confirmSubmit = function(){
    				var selectId = common.getKendoCheckId('.grid');
    				if (selectId.length == 0) {
    					return;
    				} else {
    					var selectValue = selectId[0].value;
    					var str = selectValue.split(",")
    					var projectNumber = str[0];
    					var projectName = str[1];
    					var unitName = str[2];
    					var createdDate = str[3];
    					vm.projectNumber = projectNumber;
    					vm.projectName = projectName;
    					vm.unitName = unitName;
    					vm.createdDate = createdDate;
    					creditInfoSvc.haveIllegalName(vm);
    					$('#shenbaoList').modal('hide');
    					$(".modal-backdrop").remove(); //去掉模态框背面的阴影
    				}   
    			};   
    			//点击模态框的取消或X按钮
    			vm.closeWindow = function(){
    				$('#checkbox').removeAttr("checked");
    				$('#shenbaoList').modal('hide');
    				$(".modal-backdrop").remove(); //去掉模态框背面的阴影
    			};
            };
            //点击删除按钮
            vm.deleteIllegalName = function(id){
            	vm.id = id;
            	common.confirm({
            		vm :vm,
            		title:"",
            		msg:"确认要删除此记录吗？",
            		fn : function(){
            			$('.confirmDialog').modal('hide');
            			creditInfoSvc.deleteIllegalNameById(vm);
            		}
            	});
            };
        }//end fun page_illegalNameList
        
        //项目异常名录输入页面
        function page_addIllegalNameInfo(){
        	vm.title='项目异常名录信息录入';
        	vm.illegalNameModel.projectNumber = vm.projectNumber;
        	vm.illegalNameModel.projectName = vm.projectName;
        	vm.illegalNameModel.unitName = vm.unitName;
        	vm.illegalNameModel.shenbaoDate = vm.createdDate;
        	//点击确定按钮，把页面录入的数据保存到数据库
        	vm.saveIllegalNameInfo=function(){
        		common.initJqValidation();
            	var isValid = $('form').valid();
            	if(isValid ){
            		vm.illegalNameModel.shenbaoDate = vm.toDate(vm.illegalNameModel.shenbaoDate);
            		creditInfoSvc.createIllegalName(vm);
            	}
        	};
        }//end fun page_addIllegalNameInfo
        
        //点击取消按钮，返回信用异常目录页
        vm.returnIllegalNamePage=function(){
        	location.href="#/creditInfo/illegalNameList";
        };
        
    	//点击修改按钮 修改数据
        function page_illegalNameEdit(){
        	vm.title='信用异常名录信息更改';
        	creditInfoSvc.getIllegalNameById(vm);
        	vm.updateIllegalNameInfo = function(){
        		creditInfoSvc.updateIllegalNameById(vm);
        	};
        }
        
    }
})();