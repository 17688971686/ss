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
        
        $(".menu li a").removeClass("focus");
        $(".menu li a:eq(4)").addClass("focus");

        $(".menu li a").click(function(){
            $(".menu li a").removeClass("focus");
            $(this).addClass("focus");
        });
        
        function init(){
        	if(routeName == 'planReach'){
        		vm.page = 'list';
        	}
        	if(routeName == 'planReachEdit'){
        		vm.page = 'edit';
        		if(vm.id){
        			vm.title="编辑申请表";
        		}else{
        			vm.title="新增申请表";
        		}
        	}
        	if(routeName == 'planReachPrint'){
        		vm.page = 'print';
        	}
        	
        	vm.formatNumber=function(number){
        		number=(number==''||number==undefined||number==null?0:parseFloat(number));
        		return number;
        	};
        	
        	vm.checkNumber=function(compared,compare){//对照值，实际值
        		var unqualifiedNum=false;
        		if(compare>compared){
        			unqualifiedNum=true;
        		}
        		return unqualifiedNum;
        	};
        	
        	vm.getProcessStateDesc=function(num){
        		return common.getProcessStateDesc(num);
        	};
        	
        	vm.getBasicDataDesc=function(str){
        		return common.getBasicDataDesc(str);
        	};
        	
        	//全选框选择
        	$(document).on('click', '#checkboxAll_planReachRecords', function () {
                var isSelected = $(this).is(':checked');
                $('.shenBaoRecordsGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
            });
        	
        	vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);
        	vm.basicData.projectConstrChar=common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);
        	vm.basicData.investmentType=common.getBacicDataByIndectity(common.basicDataConfig().projectInvestmentType);
        }//end fun init
        
        function list(){
//        	planReachSvc.getHasIncludYearPlan(vm);
//        	planReachSvc.getNotIncludYearPlan(vm);
//        	planReachSvc.planReachRecords(vm);
//        	
//        	//检查已纳入年度计划的计划下达申请资金
//        	vm.checkNum_ggys=function(id,compared){
//        		vm.unqualifiedNum_ggys=false;
//        		vm.unqualifiedNum_ggys=vm.checkNumber(compared,vm.formatNumber($("#ggys_"+id).val()));
//        		vm.checkPlanReachNum();
//        	};
//        	vm.checkNum_gtzj=function(id,compared){
//        		vm.unqualifiedNum_gtzj=false;
//        		vm.unqualifiedNum_gtzj=vm.checkNumber(compared,vm.formatNumber($("#gtzj_"+id).val()));
//        		vm.checkPlanReachNum();
//        	};
//        	vm.checkPlanReachNum=function(){
//        		vm.unqualifiedNum = false;
//        		vm.unqualifiedNum = vm.unqualifiedNum_ggys || vm.unqualifiedNum_gtzj;
//        		if(vm.unqualifiedNum){
//        			common.alert({
//        				vm:vm,
//        				msg:'申请资金大于安排资金，请重新输入！'
//        			});
//        		}
//        	};
//        	//已纳入年度计划的计划下达确认
//        	vm.confirmPlanReach=function(id){
//        		vm.model.sqPlanReach_ggys=vm.formatNumber($("#ggys_"+id).val());
//        		vm.model.sqPlanReach_gtzj=vm.formatNumber($("#gtzj_"+id).val());
//        		planReachSvc.comfirmPlanReach(vm,id);
//        	};
//        	//查看审批结果
//        	vm.showPlanReachGrid=function(projectNumber){
//        		//展示模态框
//         	   $("#shenBaoRecords").modal({
// 			        backdrop: 'static',
// 			        keyboard:true
//         	   });
//         	   vm.projectNumber = projectNumber;
//         	   //根据项目代码查询项目的申报记录 	  
//         	   vm.gridOptions_shenBaoRecords.dataSource.filter([{
//         		   	field:'projectNumber',
//					operator:'eq',
//					value:vm.projectNumber
//         	   },{
//         		   	field:'projectShenBaoStage',
//					operator:'eq',
//					value:common.basicDataConfig().projectShenBaoStage_jihuaxiada
//         	   }]);
//        	};
//        	//未纳入年度计划的计划下达申报记录
//        	vm.checkPlanReachDetails=function(projectNumber){
//        		vm.projectNumber = projectNumber;
//        		 $("#shenBaoRecords").modal({
// 			        backdrop: 'static',
// 			        keyboard:true
//         	   });
//        		//根据项目代码查询项目的申报记录  
//          	   vm.gridOptions_shenBaoRecords.dataSource.filter([
//          		   {
//          			 field:'projectNumber',
//          			 operator:'eq',
//          			 value:vm.projectNumber
//          		   },
//          		   {
//          			 field:'projectShenBaoStage',
//          			 operator:'eq',
//          			 value:common.basicDataConfig().projectShenBaoStage_jihuaxiada  
//          		   }
//          	   ]);
//        	}; 
//          	   
//          	   //删除计划下达
//          	   vm.deletePlanReach=function(id){
//          		   planReachSvc.deletePlanReach(vm,id);
//          	   };
//          	   //批量删除计划下达
//          	   vm.deletePlanReachs=function(){
//          		 var selectIds = common.getKendoCheckId('.shenBaoRecordsGrid');
//                 if (selectIds.length == 0) {
//                 	common.alert({
//                 		vm:vm,
//                 		msg:'请选择数据!'
//                 	});	
//                 } else {
//                 	var ids=[];
//                     for (var i = 0; i < selectIds.length; i++) {
//                     	ids.push(selectIds[i].value);
//     				}  
//                     var idStr=ids.join(',');
//                     vm.deletePlanReach(idStr);
//                 }
//          	   };
//          	 vm.click=function(){
//          		 $(".demo").printThis({
//          	        debug: false,
//          	        importCSS: true,
//          	        importStyle: true,
//          	        printContainer: true,
//          	        pageTitle: "通知公告",
//          	        removeInline: false,
//          	        printDelay: 333,
//          	        header: null,
//          	        formValues: true
//          	      });
//          	 };
//          	vm.clicks=function(){
//          		
//          	};
        	planReachSvc.grid(vm);
        	vm.deleteApplication=function(id){
        		common.confirm({
    				vm : vm,
					msg : "确认删除？",
					fn : function() {
						planReachSvc.deleteApplication(vm,id);
					}
        		});
        	};
        }//end fun list
        
        function edit(){
        	if(vm.id){
        		planReachSvc.getApplicationById(vm);
        	}
        	planReachSvc.getUserUnit(vm);//获取当前登陆单位信息
        	//项目批量选择
        	$(document).on('click', '#projects', function () {
                var isSelected = $(this).is(':checked');
                $('.projectsGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
            });
        	vm.addProject=function(){
        		//展示项目数据模态框
        		$("#myModal").modal({
			        backdrop: 'static',
			        keyboard:true
        		});
        	};
        	//确认添加申请的项目
        	vm.confirmProject=function(projectNumber,projectName,isIncludYearPlan,projectInvestSum,projectId){
        		common.initJqValidation();
    			var isValid = $('form').valid();
    			if(isValid){
    				var applicationTime = parseInt(kendo.toString(new Date(vm.model.applicationTime),"yyyy"));//查询条件：下一年度计划的计划年度为本年
    				//先判断是否有申报集合
            		if(vm.model.shenBaoInfoDtos){
            			//判断是否是重复添加
            			var isHas=false;
            			vm.model.shenBaoInfoDtos.every(function (item, i) {
            			    if (item.projectNumber == projectNumber) {
            			    	isHas=true;
            			    	return false;//如果是重复的，则停止循环
            			    }
            			    return true;
            			});
            			if(!isHas){//如果不重复
                			if(isIncludYearPlan){//判定是否已纳入年度计划
            					planReachSvc.getShenBaoInfoByProjectNumber(vm,projectNumber,isIncludYearPlan,applicationTime,true);
            				}else{
            					vm.model.shenBaoInfoDtos.push({projectId:projectId,projectNumber:projectNumber,projectName:projectName,isIncludYearPlan:isIncludYearPlan,
            						projectInvestSum:projectInvestSum,capitalAP_ggys_TheYear:0,capitalAP_gtzj_TheYear:0,sqPlanReach_ggys:0,sqPlanReach_gtzj:0,
            						processStage:common.basicDataConfig().processStage_qianshou,processState:common.basicDataConfig().processState_weikaishi,planYear:applicationTime});
            					}
            				}
            			}else{//如果没有申报集合
                			if(isIncludYearPlan){//判定添加的项目是否已纳入年度计划
            					//需要根据项目代码查询年度计划
            					planReachSvc.getShenBaoInfoByProjectNumber(vm,projectNumber,isIncludYearPlan,applicationTime,false);
            				}else{
                				vm.model.shenBaoInfoDtos=[{projectId:projectId,projectNumber:projectNumber,projectName:projectName,isIncludYearPlan:isIncludYearPlan,
                					projectInvestSum:projectInvestSum,capitalAP_ggys_TheYear:0,capitalAP_gtzj_TheYear:0,sqPlanReach_ggys:0,sqPlanReach_gtzj:0,
                					processStage:common.basicDataConfig().processStage_qianshou,processState:common.basicDataConfig().processState_weikaishi,planYear:applicationTime}];
            				}
        				}
    			}else{
    				$("#myModal").modal('hide');
    			}     		
        	};
        	//检查已纳入年度计划的计划下达申请资金
        	vm.checkNum_ggys=function(id,compared){
        		vm.unqualifiedNum_ggys=false;
        		vm.unqualifiedNum_ggys=vm.checkNumber(compared,vm.formatNumber($("#ggys_"+id).val()));//比较大小
        		vm.checkPlanReachNum();
        	};
        	vm.checkNum_gtzj=function(id,compared){
        		vm.unqualifiedNum_gtzj=false;
        		vm.unqualifiedNum_gtzj=vm.checkNumber(compared,vm.formatNumber($("#gtzj_"+id).val()));
        		vm.checkPlanReachNum();
        	};
        	vm.checkPlanReachNum=function(){//比较大小之后，给与提醒
        		vm.unqualifiedNum = false;
        		vm.unqualifiedNum = vm.unqualifiedNum_ggys || vm.unqualifiedNum_gtzj;
        		if(vm.unqualifiedNum){
        			common.alert({
        				vm:vm,
        				msg:'申请资金大于安排资金，请重新输入！'
        			});
        		}
        	};
        	//批量添加申请的项目
        	vm.confirmProjects=function(){
        		var selectIds = common.getKendoCheckId('.projectsGrid');
                if (selectIds.length == 0) {
                	common.alert({
                    	vm:vm,
                    	msg:'请选择数据!'             	
                    });
                } else {
                    for (var i = 0; i < selectIds.length; i++) {
                    	vm.confirmProject(selectIds[i].value.split(",")[0],selectIds[i].value.split(",")[1],selectIds[i].value.split(",")[2]=="true"?true:false,
                    			selectIds[i].value.split(",")[3],selectIds[i].value.split(",")[4]);
    				}  
                }   
        	};
        	//移除申请的项目
        	vm.removeProject=function(idx){
        		vm.model.shenBaoInfoDtos.splice(idx,1)
        	};
        	//确认新增申请
        	vm.addApplication=function(){
        		common.confirm({
    				vm : vm,
					msg : "确认创建之后，开始审批流程！是否确认？",
					fn : function() {
						planReachSvc.createApplication(vm);
					}
        		});
        	};
        	//确认更新申请
        	vm.editApplication=function(){
        		planReachSvc.updateApplication(vm);
        	};
        }//end fun edit
        
        function print(){
        	planReachSvc.getApplicationById(vm);
        	planReachSvc.getUserUnit(vm);//获取当前登陆单位信息
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
        }//end fun print
        
        active();
        function active(){
        	init();
        	if(vm.page == 'list'){
        		list();
        	}
        	if(vm.page == 'edit'){
        		edit();
        	}
        	if(vm.page == 'print'){
        		print();
        	}
        }//end fun active
    }
})();