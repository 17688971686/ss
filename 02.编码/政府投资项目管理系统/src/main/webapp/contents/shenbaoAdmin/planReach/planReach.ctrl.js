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
        vm.isStartProcess=$state.params.isStartProcess;//请求中的id参数
        vm.basicData={};vm.model={};vm.projectNumber='';vm.unqualifiedNum=false;
        vm.gg = {};
        vm.gt = {};
        vm.pa = {};
        vm.isCan =true;
//        vm.capitalSCZ_ggys_TheYear = $state.params.capitalSCZ_ggys_TheYear;
//        vm.capitalSCZ_gtzj_TheYear = $state.params.capitalSCZ_gtzj_TheYear;
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
        	if(routeName == 'planReachPackEdit'){
        		vm.page = 'packPlanEdit';
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
        	
        	planReachSvc.getSysConfig(vm);
        	
        	vm.deleteApplication=function(id){
        		common.confirm({
    				vm : vm,
					msg : "确认删除？",
					fn : function() {
						planReachSvc.deleteApplication(vm,id);
						$('.confirmDialog').modal('hide');
					}
        		});
        	};
        	
        	vm.startProcess = function(planId){
        		planReachSvc.startProcess(vm,planId);
        	};
        	
        	vm.checkLength = function(obj,max,id){
   			 common.checkLength(obj,max,id);
        	};
        }//end fun list
        
        function edit(){
        	if(vm.id){
        		planReachSvc.getApplicationById(vm);
        	}
        	planReachSvc.getUserUnit(vm);//获取当前登陆单位信息
        	planReachSvc.getShenBaoInfoFromPlanReachApplicationGrid(vm);//获取计划下达中的申报项目
        	planReachSvc.getPackFromPlanGrid(vm);//获取计划下达中的打包计划
        	//项目批量选择
        	$(document).on('click', '#projects', function () {
                var isSelected = $(this).is(':checked');
                $('.projectsGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
            });
        	
        	vm.startProcessOne = function(id){
        		planReachSvc.startProcessOne(vm,id);
        	};
        	vm.deleteProcessOne = function(id){
        		planReachSvc.deleteProcessOne(vm,id);
        	};
        	vm.addProject=function(){
        		//展示项目数据模态框
        		$("#myModal").modal({
			        backdrop: 'static',
			        keyboard:true
        		});
        	};
        	
        	vm.projectDeletes=function(){
        		//获取选中的申报信息的id
    			var selectIds = common.getKendoCheckId('.shenbaogrid');
                if (selectIds.length == 0) {
                	common.alert({
                    	vm:vm,
                    	msg:'请选择数据!'             	
                    });
                } else {
                	var ids=[];
                    for (var i = 0; i < selectIds.length; i++) {
                    	ids.push(selectIds[i].value);
    				}
                    var idStr=ids.join(',');    
                    planReachSvc.deleteShenBaoInfo(vm,idStr);//添加申报信息到计划下达中                  
                }  
        	};
        	
        	vm.packDeletes=function(){
        		//获取选中的申报信息的id
    			var selectIds = common.getKendoCheckId('.packgrid');
                if (selectIds.length == 0) {
                	common.alert({
                    	vm:vm,
                    	msg:'请选择数据!'             	
                    });
                } else {
                	var ids=[];
                    for (var i = 0; i < selectIds.length; i++) {
                    	ids.push(selectIds[i].value);
    				}
                    var idStr=ids.join(',');    
                    planReachSvc.deletePacks(vm,idStr);//添加申报信息到计划下达中                  
                }  
        	};
        	
        	//展示项目数据模态框 在打包计划中添加单列项目时使用
        	vm.addProjectForPack =function(){
        		planReachSvc.projectForPackGrid(vm);
        		$("#projectModalForPack").modal({
			        backdrop: 'static',
			        keyboard:true
        		});
        	};
        	vm.addPack = function(){
        		//展示包含本单位的打包类计划
        		$("#packModal").modal({
			        backdrop: 'static',
			        keyboard:true
        		});
        	};
        	
        	//点击添加项目模态框确认按钮
    		vm.dialogConfirmSubmit_shenBaoInfo=function(){
    			//获取选中的申报信息的id
    			var selectIds = common.getKendoCheckId('.projectsGrid');
                if (selectIds.length == 0) {
                	common.alert({
                    	vm:vm,
                    	msg:'请选择数据!'             	
                    });
                } else {
                	var ids=[];
                    for (var i = 0; i < selectIds.length; i++) {
                    	ids.push(selectIds[i].value);
    				}
                    var idStr=ids.join(',');    
                    $('#myModal').modal('toggle');//关闭模态框
                    planReachSvc.addShenBaoInfoToPlanReach(vm,idStr);//添加申报信息到计划下达中                  
                }   
    		};
    		
    		//点击添加打包计划模态框确认按钮
    		vm.dialogConfirmSubmit_packPlan = function(){
    			//获取选中的申报信息的id
    			var selectIds = common.getKendoCheckId('.packsGrid');
                if (selectIds.length == 0) {
                	common.alert({
                    	vm:vm,
                    	msg:'请选择数据!'             	
                    });
                } else {
                	var ids=[];
                    for (var i = 0; i < selectIds.length; i++) {
                    	ids.push(selectIds[i].value);
    				}
                    var idStr=ids.join(',');    
                    console.log(idStr);
                    $('#packModal').modal('toggle');//关闭模态框
                    planReachSvc.addPackPlanToPlanReack(vm,idStr);//添加申报信息到计划中                  
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
        	
        	//添加打包计划
        	vm.confirmPack = function(name,totalMoney,year){
        		if(vm.model.packPlanDtos){
        			vm.model.packPlanDtos.push({name:name,totalMoney:totalMoney,capital_ggys:'',capital_gtzj:'',year:year});
            	}else{
            		vm.model.packPlanDtos=[{name:name,totalMoney:totalMoney,capital_ggys:'',capital_gtzj:'',year:year}];
            	}
        	};
        	
        	vm.addmoney = function(shenbaoId){
        		if(vm.gg[shenbaoId] == undefined){
        			vm.gg[shenbaoId] = 0;
        		}
        		if(vm.gt[shenbaoId] == undefined){
        			vm.gt[shenbaoId] = 0;
        		}
        		planReachSvc.updateShnebaoInfo(vm,shenbaoId);
        	}
        	//移除打包计划
        	vm.removePack = function(idx){
        		vm.model.packPlanDtos.splice(idx,1);
        	};
        	
        	//移除打包计划中的申报项目
        	vm.removeProjectForPack = function(idx){
        		vm.model.packPlanDtos.shenBaoInfoDtos.splice(idx,1);
        	};
        	
        	//移除申请的项目
        	vm.removeProject=function(idx){
        		vm.model.shenBaoInfoDtos.splice(idx,1)
        	};
        	//确认新增申请
        	vm.addApplication=function(){
        		planReachSvc.createApplication(vm);
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
        
        /**
         * 计划下达中打包计划页面
         */
        function packPlanEdit(){
//        	planReachSvc.getPackPlanById(vm);
        	planReachSvc.getUserUnit(vm);//获取当前登陆单位信息
        	planReachSvc.getShenBaoInfoGridFromPackPlan(vm);
        	
        	planReachSvc.getPackPlanById(vm);
        	vm.addProject=function(){
        		//展示项目数据模态框
        		$("#myModal").modal({
			        backdrop: 'static',
			        keyboard:true
        		});
        	};
        	vm.startProcessOne = function(id){
        		planReachSvc.startProcessOne(vm,id);
        	};
        	
        	vm.deleteProcessOne = function(id){
        		planReachSvc.deleteProcessOne(vm,id);
        	};
        	//打包信息点击添加项目模态框确认按钮
    		vm.dialogConfirmSubmit_shenBaoInfo_plan=function(){
    			//获取选中的申报信息的id
    			var selectIds = common.getKendoCheckId('.projectsGrid');
                if (selectIds.length == 0) {
                	common.alert({
                    	vm:vm,
                    	msg:'请选择数据!'             	
                    });
                } else {
                	var ids=[];
                    for (var i = 0; i < selectIds.length; i++) {
                    	ids.push(selectIds[i].value);
    				}
                    var idStr=ids.join(',');    
                    $('#myModal').modal('toggle');//关闭模态框
                    planReachSvc.addShenBaoInfoToPack(vm,idStr);//添加申报信息到计划下达中                  
                }   
    		};
    		
    		vm.projectDeletes=function(){
        		//获取选中的申报信息的id
    			var selectIds = common.getKendoCheckId('.grid');
                if (selectIds.length == 0) {
                	common.alert({
                    	vm:vm,
                    	msg:'请选择数据!'             	
                    });
                } else {
                	var ids=[];
                    for (var i = 0; i < selectIds.length; i++) {
                    	ids.push(selectIds[i].value);
    				}
                    var idStr=ids.join(',');    
                    planReachSvc.deletePlanShenBaoInfo(vm,idStr);//添加申报信息到计划下达中                  
                }  
        	};
    		vm.addmoney = function(shenbaoId){
        		if(vm.gg[shenbaoId] == undefined){
        			vm.gg[shenbaoId] = 0;
        		}
        		if(vm.gt[shenbaoId] == undefined){
        			vm.gt[shenbaoId] = 0;
        		}
//        		var gg_total = 0;
//        		var gt_total = 0;
//        		for (var int = 0; int < vm.gg.length; int++) {
//        			gg_total += vm.gg[int];
//					
//				}
//        		for (var int = 0; int < vm.gt.length; int++) {
//        			gt_total += vm.gt[int];
//					
//				}
//        		var test =  $("#capitalSum1").siblings();
//        		if(gt_total> vm.capitalSCZ_gtzj_TheYear){
//        			common.alert({
//                    	vm:vm,
//                    	msg:'申请资金数超过计划安排数!'             	
//                    });
//        		}else{
        			planReachSvc.updateShnebaoInfo(vm,shenbaoId);
//        		}
        		
        	}
        	
        }//end fun packPlanEdit
        
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
        	if(vm.page == 'packPlanEdit'){
        		packPlanEdit();
        	}
        }//end fun active
    }
})();