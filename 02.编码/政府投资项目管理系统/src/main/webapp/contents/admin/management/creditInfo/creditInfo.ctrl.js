(function () {
    'use strict';
    
    angular
        .module('app')
        .controller('creditInfoCtrl', creditInfo);

    creditInfo.$inject = ['$location','creditInfoSvc','$state','$scope','$sce']; 

    function creditInfo($location,creditInfoSvc,$state,$scope,$sce) {
        var vm = this;
        vm.title = "异常项目申报单位列表";
        vm.model={};
        vm.standby = {};
        vm.blackListModel = {};
        vm.illegalNameModel = {};
        vm.projectAnomalyModel = {};
        vm.page='list';
        vm.basicData = {};
        vm.id=$state.params.id;
        vm.projectNumber = $state.params.projectNumber;
        vm.projectName = $state.params.projectName;
        vm.unitName = $state.params.unitName;
        vm.createdDate = $state.params.createdDate;
        vm.shenBaoInfoId = $state.params.shenBaoInfoId;
        vm.selectedIndex = '';


        function init(){
        	if($state.current.name=='credit_illegalNameList'){
        		vm.page = 'illegalNameList';
        	}
        	if($state.current.name=='credit_illegalNameEdit'){
        		vm.page = 'addIllegalName';
        	}
        	if($state.current.name=='credit_updateIllegalName'){
        		vm.page='updateIllegalNameEdit';
        	}
        	if($state.current.name=='credit_illegalNameDetails'){
        		vm.page='illegalNameDetails';
        	}
        	if($state.current.name=='credit_blackList'){
        		vm.title = '黑名单项目申报单位列表';
        		vm.page = 'blackList';
        	}
        	if($state.current.name=='credit_blackListEdit'){
        		vm.title = '黑名单项目申报单位信息录入';
        		vm.page = 'addBlackList';
        	}
        	if($state.current.name=='credit_blackListDetails'){
        		vm.title = '黑名单项目申报单位信息详情';
        		vm.page = 'blackListDetails';
        	}
        	if($state.current.name=='credit_blackListAlter'){
        		vm.title = '黑名单项目申报单位信息更改';
        		vm.page = 'blackListAlter';
        	}
        	if($state.current.name=='credit_projectAnomaly'){
        		vm.title = '项目异常列表';
        		vm.page = 'projectAnomaly';
        	}
        	if($state.current.name=='credit_projectAnomalyEdit'){
        		vm.title = '项目异常信息录入';
        		vm.page = 'projectAnomalyEdit';
        	}
        	if($state.current.name=='credit_projectAnomalyDetails'){
        		vm.title = '项目异常信息详情';
        		vm.page = 'projectAnomalyDetails';
        	}
        	if($state.current.name=='credit_updateProjectAnomaly'){
        		vm.title = '项目异常信息修改';
        		vm.page = 'updateProjectAnomaly';
        	}
        	
        	vm.getBasicDataDesc = function(str){
           		return common.getBasicDataDesc(str);
           	};
        	
        	vm.getUnitName=function(unitId){
        		return common.getUnitName(unitId);
        	};
        	
        	vm.toDate=function(stringDate){
        		return common.toDate(stringDate);
        	};
        	
        	vm.formatDate=function(stringDate){
        		return common.formatDate(stringDate);
        	};
        	
        	vm.html = function(val){
           		return $sce.trustAsHtml(val);
           	};
        	
        	vm.basicData.userUnit = common.getUserUnits();
        }
        
        activate();
        function activate() {        	
        	init();
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
        	if(vm.page == 'blackListAlter'){
        		vm.isBlackListEdit = true;
        		page_blackListAlter();
        	}
        	if(vm.page == 'projectAnomaly'){
        		page_projectAnomaly();
        	}
        	if(vm.page == 'projectAnomalyEdit'){
        		page_projectAnomalyEdit();
        	}
        	if(vm.page == 'projectAnomalyDetails'){
        		page_projectAnomalyDetails();
        	}
        	if(vm.page == 'updateProjectAnomaly'){
        		page_updateProjectAnomaly();
        	}
        	
        }
        
        //项目异常信息变更页
        function page_updateProjectAnomaly(){
        	creditInfoSvc.getProjectAnomalyById(vm);
        	vm.updateProjectAnomalyInfo = function(){
        		common.initJqValidation();
            	var isValid = $('form').valid();
            	if(isValid ){
            		creditInfoSvc.updateProjectAnomalyById(vm);
            	}
        	};
        	vm.returnProjectAnomalyPage = function(){
        		location.href = "#/creditInfo/projectAnomalyList";
        	};
        }
        
        //项目异常详情页
        function page_projectAnomalyDetails(){
        	creditInfoSvc.getProjectAnomalyById(vm);
        }
        
        vm.returnProjectAnomalyPage = function(){
        	location.href = "#/creditInfo/projectAnomalyList";
        };
        
        //项目异常 录入页面
        function page_projectAnomalyEdit(){
        	vm.projectAnomalyModel.projectNumber = vm.projectNumber;
        	vm.projectAnomalyModel.projectName = vm.projectName;
        	vm.projectAnomalyModel.unitName = vm.unitName;
        	vm.projectAnomalyModel.shenbaoDate = vm.createdDate;
        	vm.projectAnomalyModel.shenBaoInfoId = vm.shenBaoInfoId;
        	vm.saveProjectAnomalyInfo = function(){
        		common.initJqValidation();
            	var isValid = $('form').valid();
            	if(isValid ){
            		vm.projectAnomalyModel.shenbaoDate = vm.toDate(vm.projectAnomalyModel.shenbaoDate);
            		creditInfoSvc.createProjectAnomaly(vm);
            	}
        	};
        }//end fun page_projectAnomalyEdit
        
        //项目异常列表页
        function page_projectAnomaly(){
        	creditInfoSvc.projectAnomalyGrid(vm);
        	//条件查询
     	    vm.searchProjectAnomaly=function(){
        		vm.projectAnomalyModel.shenbaoDate = vm.toDate(vm.projectAnomalyModel.shenbaoDate);
     		    var filters = [];
     		    if(vm.projectAnomalyModel.unitName !=null && vm.projectAnomalyModel.unitName !=''){
       			   filters.push({field:'unitName',operator:'eq',value:vm.projectAnomalyModel.unitName});
       		    }
     		    if(vm.projectAnomalyModel.shenbaoDate != null && vm.projectAnomalyModel.shenbaoDate != ''){
     			   filters.push({field:'shenbaoDate',operator:'eq',value:vm.projectAnomalyModel.shenbaoDate});
     		    }
     		    vm.gridProjectAnomalyInfo.dataSource.filter(filters);
     	    };
        	//点击录入按钮
        	vm.addAnomalyProject = function(){
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
    					var str = selectValue.split(",");
    					var projectNumber = str[0];
    					var projectName = str[1];
    					var unitName = str[2];
    					var createdDate = str[3];
    					var shenBaoInfoId = str[4];
    					vm.projectNumber = projectNumber;
    					vm.projectName = projectName;
    					vm.unitName = unitName;
    					vm.createdDate = createdDate;
    					vm.shenBaoInfoId = shenBaoInfoId;
    					creditInfoSvc.haveProjectAnomaly(vm);
    					$('.checkbox').removeAttr("checked");
    					$('#shenbaoList').modal('hide');
    					$(".modal-backdrop").remove(); //去掉模态框背面的阴影
    				}   
    			};   
    			//点击模态框的取消或X按钮
    			vm.closeWindow = function(){
    				$('.checkbox').removeAttr("checked");
    				$('#shenbaoList').modal('hide');
    				$(".modal-backdrop").remove(); //去掉模态框背面的阴影
    			};
            };
            //点击删除按钮
            vm.deleteProjectAnomaly = function(id){
            	vm.id = id;
            	common.confirm({
            		vm :vm,
            		title:"",
            		msg:"确认要删除此记录吗？",
            		fn : function(){
            			$('.confirmDialog').modal('hide');
            			creditInfoSvc.deleteProjectAnomalyById(vm);
            		}
            	});
            };
        }//end fun page_projectAnomaly
        
        
        //黑名单修改页
        function page_blackListAlter(){
            var myselect = document.getElementById('legalRepCertType');
            vm.selectedIndex = myselect.value;
        	//根据黑名单id获取数据
        	creditInfoSvc.getBlackListById(vm);
        	vm.basicData.legalRepCertType=common.getBacicDataByIndectity(common.basicDataConfig().credentialsType);
        	//点击更新按钮，进行数据更新操作
            vm.change = function () {
                vm.model.legalRepCertNumber = '';
                vm.selectedIndex = myselect.value;
            }
        	vm.updateBlackListInfo = function(){
        		common.initJqValidation();
            	var isValid = $('form').valid();
            	if(isValid ){
            		creditInfoSvc.updateBlackListById(vm);
            	}
        	};
        }
    	//点击取消按钮，返回黑名单列表页
    	vm.returnBlackListPage = function(){
    		location.href="#/creditInfo/blackList";
    	};
    	
        
        //黑名单详情页
        function page_blackListDetails(){
        	vm.basicData.legalRepCertType=common.getBacicDataByIndectity(common.basicDataConfig().credentialsType);
        	creditInfoSvc.getBlackListById(vm);
        }
        
        //黑名单录入页面
        function page_addBlackList(){
            var myselect = document.getElementById('legalRepCertType');
            vm.selectedIndex = myselect.value;
        	vm.basicData.legalRepCertType=common.getBacicDataByIndectity(common.basicDataConfig().credentialsType);
        	vm.title='黑名单信息录入';
        	vm.blackListModel.projectNumber=vm.projectNumber;
        	vm.blackListModel.projectName=vm.projectName;
        	vm.blackListModel.unitName=vm.unitName;
        	vm.blackListModel.shenbaoDate=vm.createdDate;
        	vm.blackListModel.shenBaoInfoId = vm.shenBaoInfoId;

            vm.change = function () {
                vm.blackListModel.legalRepCertNumber = '';
                vm.selectedIndex = myselect.value;
            }
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
            			var str = selectValue.split(",");
            			var projectNumber = str[0];
            			var projectName = str[1];
            			var unitName = str[2];
            			var createdDate = str[3];
            			var shenBaoInfoId = str[4];
            			vm.blackListModel.projectNumber = projectNumber;
            			vm.blackListModel.projectName = projectName;
            			vm.blackListModel.unitName = unitName;
            			vm.blackListModel.createdDate = createdDate;
            			vm.blackListModel.shenBaoInfoId = shenBaoInfoId;
            			creditInfoSvc.haveBlackList(vm);
            			$('.checkbox').removeAttr("checked");
            			$('#shenbaoList').modal('hide');
            			$(".modal-backdrop").remove(); //去掉模态框背面的阴影
            		}   
            	};   
            	//点击模态框的取消或X按钮
            	vm.closeShenBaoWindow = function(){
            		$('.checkbox').removeAttr("checked");
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
        	creditInfoSvc.illegalNameGrid(vm);
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
    					var str = selectValue.split(",");
    					var projectNumber = str[0];
    					var projectName = str[1];
    					var unitName = str[2];
    					var createdDate = str[3];
    					var shenBaoInfoId = str[4];
    					vm.projectNumber = projectNumber;
    					vm.projectName = projectName;
    					vm.unitName = unitName;
    					vm.createdDate = createdDate;
    					vm.shenBaoInfoId = shenBaoInfoId;
    					creditInfoSvc.haveIllegalName(vm);
    					$('.checkbox').removeAttr("checked");
    					$('#shenbaoList').modal('hide');
    					$(".modal-backdrop").remove(); //去掉模态框背面的阴影
    				}   
    			};   
    			//点击模态框的取消或X按钮
    			vm.closeWindow = function(){
    				$('.checkbox').removeAttr("checked");
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
        	vm.illegalNameModel.shenBaoInfoId = vm.shenBaoInfoId;
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
        
      //申报详情模态框
		vm.dialog_shenbaoInfo = function(id){
			vm.id = id;
			creditInfoSvc.getShenBaoInfoById(vm);
			$('#shenbaoInfo').modal({
                backdrop: 'static',
                keyboard:false
            });
			//初始化tab
      	   vm.tabStripOptions={
      			//TODO
      	   };
		};
		
    	//点击修改按钮 修改数据
        function page_illegalNameEdit(){
        	vm.title='信用异常名录信息更改';
        	creditInfoSvc.getIllegalNameById(vm);
        	vm.updateIllegalNameInfo = function(){
        		common.initJqValidation();
            	var isValid = $('form').valid();
            	if(isValid ){
            		creditInfoSvc.updateIllegalNameById(vm);
            	}
        	};
        }
        
    }
})();