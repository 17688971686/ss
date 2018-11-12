(function () {
    'use strict';
    
    angular
        .module('app')
        .controller('planReachCtrl', planReach);

    planReach.$inject = ['$location','planReachSvc','$state','$scope','$sce']; 

    function planReach($location, planReachSvc,$state,$scope,$sce) {
        /* jshint validthis:true */
        var vm = this;
        var routeName = $state.current.name;
        vm.id=$state.params.id;//请求中的id参数
        vm.basicData={};vm.model={};vm.projectNumber='';vm.unqualifiedNum=false;
        vm.gg = {};
        vm.gt = {};
        function init(){
        	if(routeName == 'planReach'){
        		vm.page = 'list';
        	}
        	if(routeName == 'planReach_tabList'){
        		vm.page = 'tabList';
        	}
        	if(routeName == 'planReach_tabEdit'){
        		vm.page = 'tabEdit';
        	}
        	if(routeName == 'planReachApprovalPrint'){
        		vm.page = 'print';
        	}
        	
        	vm.formatNumber=function(number){
        		number=(number==''||number==undefined||number==null?0:parseFloat(number));
        		return number;
        	};
        	
        	vm.checkNumber=function(compared,compare){
        		var unqualifiedNum=false;
        		if(compare>compared){
        			unqualifiedNum=true;
        		}
        		return unqualifiedNum;
        	};
        	  
        	vm.getBasicDataDesc=function(str){
        		return common.getBasicDataDesc(str);
        	};
        	
        	vm.getUnitName=function(unitId){
           		return common.getUnitName(unitId);
           	};
           	
           	vm.formatDate=function(str){
    			return common.formatDate(str);
    		};
    		
    		vm.html = function(val){
           		return $sce.trustAsHtml(val);
           	};
           	
           	//检查字符串可输入长度
    		vm.checkLength = function(obj,max,id){
    			 common.checkLength(obj,max,id);
         	};
        	
        	//全选框选择（委托事件）
        	$(document).on('click', '#checkboxAll_planReachRecords', function () {
                var isSelected = $(this).is(':checked');
                $('.shenBaoRecordsGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
            });
        	
        	vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);
        	vm.basicData.projectConstrChar=common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);
        	vm.basicData.investmentType=common.getBacicDataByIndectity(common.basicDataConfig().projectInvestmentType);
        	vm.basicData.processState=common.getBacicDataByIndectity(common.basicDataConfig().processState);
        	vm.basicData.projectIndustry_ZF=$linq(common.getBasicData())
	   			.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
	   			.toArray();//政府投资项目行业
        	vm.basicData.userUnit=common.getUserUnits();
        }//end fun init
        
        function list(){
        	planReachSvc.grid(vm);
        	
        	vm.addmoney = function (shenbaoId) {
                if (vm.gg[shenbaoId] == undefined) {
                    vm.gg[shenbaoId] = 0;
                }
                if (vm.gt[shenbaoId] == undefined) {
                    vm.gt[shenbaoId] = 0;
                }
                planReachSvc.updateShnebaoInfo(vm, shenbaoId);
            }
        	vm.basicData.userUnit=common.getUserUnits().value;//获取所有单位
		   	 var keys = [];
	    	 vm.output = [];
	    	 angular.forEach(vm.basicData.userUnit, function(item) {
		          var key = item["id"];
		          if(keys.indexOf(key) === -1) {
		              keys.push(key);
		              vm.output.push(item);
		          }
		      });
        	//查询
    		vm.search=function(){
    			var filters = [];
				filters.push({field:'projectShenBaoStage',operator:'eq',value:common.basicDataConfig().projectShenBaoStage_jihuaxiada});//默认条件--申报阶段为"计划下达"
				//filters.push({field:'processStage',operator:'eq',value:common.basicDataConfig().processState_mskfawen});//默认条件
				filters.push({field:'processState',operator:'eq',value:common.basicDataConfig().processState_pass});//默认条件
                //filters.push({field:'processState',operator:'eq',value:Number(common.basicDataConfig().processState_jinxingzhong)});

				if(vm.search.projectName !=null && vm.search.projectName !=''){//查询条件--项目名称
	     			   filters.push({field:'projectName',operator:'contains',value:vm.search.projectName});
	     		   }
     		   if(vm.search.unitName !=null && vm.search.unitName !=''){//查询条件--建设单位
     			  filters.push({field:'unitName',operator:'contains',value:vm.search.unitName});
     		   }
     		   if(vm.search.projectIndustry !=null && vm.search.projectIndustry !=''){//查询条件--项目行业
     			  filters.push({field:'projectIndustry',operator:'eq',value:vm.search.projectIndustry});
     		   }
 			  vm.gridOptions.dataSource.filter(filters);
    		};
    		 //清空查询条件
	   		vm.filterClear=function(){
	   			location.reload();
	   		};
	   		//退回操作
	   		vm.retreat=function(id){
	   			common.confirm({
	   				vm : vm,
					msg : "确认退回？",
					fn : function() {
						$('.confirmDialog').modal('hide');//去除确认模态框
		        		$("#tuiWen").modal({//展示退文缘由填写模态框
					        backdrop: 'static',
					        keyboard:true
		        		});
		        		//退回确认
		    	   		vm.retreatSubmit=function(){
		    	   			vm.model.relId = id;
	    	    			vm.model.thisProcessState = common.basicDataConfig().processState_notpass;
		    	   			$("#tuiWen").modal('hide');//去除退文缘由填写模态框
		    	   			planReachSvc.retreat(vm);//更新任务状态与申报信息状态
		    	   		};
					}
	   			});
	   		};
        }//end fun list
        
        function tabList(){
        	planReachSvc.planReachApprovaGrid(vm);
        	//删除计划下达批复
        	vm.deleteApproval=function(id){
        		common.confirm({
    				vm : vm,
					msg : "确认删除？",
					fn : function() {
						$('.confirmDialog').modal('hide');
						planReachSvc.deleteApproval(vm,id);
					}
        		});
        	};
        }//end fun tabList
        
        function tabEdit(){
        	if(vm.id){
        		planReachSvc.getPlanReachApprovalById(vm);
        	}
        	
        	vm.addmoneysGg = function (shenbaoId,xdPlanReach_ggys,xdPlanReach_gtzj) {
//               for (var int = 0; int < vm.model.shenBaoInfoDtos.length; int++) {
//				var array_element = vm.model.shenBaoInfoDtos[int];
//				if(array_element.id == shenbaoId){
//					
//					array_element.apPlanReach_ggys = array_element.apPlanReach_ggys - array_element.xdPlanReach_ggys+xdPlanReach_ggys;
//					array_element.apPlanReach_gtzj = array_element.xdPlanReach_gtzj - array_element.xdPlanReach_gtzj+xdPlanReach_gtzj;
//					array_element.apInvestSum = array_element.apInvestSum-array_element.xdPlanReach_ggys-array_element.xdPlanReach_gtzj+xdPlanReach_ggys+xdPlanReach_gtzj;
//					array_element.xdPlanReach_ggys = xdPlanReach_ggys;
//					array_element.xdPlanReach_gtzj = xdPlanReach_gtzj;
//				}
//			}
        		
                planReachSvc.updateShnebaoInfo(vm, shenbaoId,xdPlanReach_ggys,xdPlanReach_gtzj);
            }
        	//获取计划下达数据
        	planReachSvc.planReachGrid(vm);
        	//添加计划下达
        	vm.addPlanReach=function(){
        		//展示计划下达数据模态框
        		$("#myModal").modal({
			        backdrop: 'static',
			        keyboard:true
        		});
        	};
        	//全选框选择（委托事件）
        	$(document).on('click', '#checkboxAll_planReachData', function () {
                var isSelected = $(this).is(':checked');
                $('.planReachDataGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
            });
        	//添加计划下达数据
        	vm.confirmPlanReach=function(data){
        		var dataList = data.split(",");
        		var applicationTime = parseInt(kendo.toString(new Date(vm.model.applicationTime),"yyyy"));//查询条件：下一年度计划的计划年度为本年
        		if(vm.model.shenBaoInfoDtos){
        			var isHas=false;
        			vm.model.shenBaoInfoDtos.every(function (item, i) {
        			    if (item.id == dataList[0]) {
        			    	isHas=true;
        			    	return false;//如果是重复的，则停止循环
        			    }
        			    return true;
        			});
        		}
        		
				//先判断是否有申报集合
        		if(!isHas){
        			planReachSvc.checkIsOnly(vm,dataList);
        		}else{
        			common.alert({
                    	vm:vm,
                    	msg:'请勿重复添加!'             	
                    });
        		}
        		
    			
        	};
        	//批量添加计划下达数据
        	vm.confirmPlanReachs=function(){
        		var selectIds = common.getKendoCheckId('.planReachDataGrid');
                if (selectIds.length == 0) {
                	common.alert({
                    	vm:vm,
                    	msg:'请选择数据!'             	
                    });
                } else {
                    for (var i = 0; i < selectIds.length; i++) {
                    	vm.confirmPlanReach(selectIds[i].value);
    				}  
                }   
        	};
        	//移除计划下达数据
        	vm.removePlanReach=function(index){
        		vm.model.shenBaoInfoDtos.splice(index,1)
        	};
        	//确定创建计划下达批复表单
        	vm.addPlanReachApproval=function(){
        		planReachSvc.createApproval(vm);
        	};
        	//更新计划下达批复表单
        	vm.editPlanReachApproval=function(){
        		planReachSvc.updateApproval(vm);
        	};
        	vm.endProcess=function(id){
        		planReachSvc.endProcess(vm,id);
        	};
        	vm.endProcesss=function(){
        		planReachSvc.endProcesss(vm);
        	};
        }//end fun tabEdit
        
        function print(){
        	planReachSvc.getPlanReachApprovalById(vm);
        	var nowDate=new Date();
        	vm.nowDate = nowDate.getFullYear()+"年"+(nowDate.getMonth()+1)+"月"+nowDate.getDate()+"日";
        	//打印
        	vm.printBtn=function(){
	    		$("#printWindow").printThis({
	      	        debug: false,
	      	        importCSS: true,       // import page CSS
	      	      	importStyle: true,    // import style tags
	      	        printContainer: true,
	      	        removeInline: false,
	      	        printDelay: 333,
	      	        header: null,
	      	        formValues: true
	      	      });
        	};
        	//导出excel
            vm.exprotExcel=function(){
                location.href = common.format("/management/planReachManage/planReach/exportExcelForPlanReach?id={0}",vm.id);
			}
        }//end fun print
        
        active();
        function active(){
        	init();
        	if(vm.page == 'list'){
        		list();
        	}
        	if(vm.page == 'tabList'){
        		tabList();
        	}
        	if(vm.page == 'tabEdit'){
        		tabEdit();
        	}
        	if(vm.page == 'print'){
        		print();
        	}
        }//end fun active
    }
})();