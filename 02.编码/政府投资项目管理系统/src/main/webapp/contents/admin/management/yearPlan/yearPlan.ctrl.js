(function () {
    'use strict';

    angular
        .module('app')
        .controller('yearPlanCtrl', yearPlan);

    yearPlan.$inject = ['$location','yearPlanSvc','$state','$scope','$sce']; 

    function yearPlan($location, yearPlanSvc,$state,$scope,$sce) {
        /* jshint validthis:true */
    	var vm = this;
    	var routName=$state.current.name;
    	vm.model={};
    	vm.basicData={};
    	vm.title='申报信息编辑';
    	vm.search={};
    	vm.packageType={};
        vm.id=$state.params.id;
        vm.investmentType=$state.params.projectInvestmentType;
        vm.state=$state.params.state;
        vm.isZhudongxiada = true;
        vm.unitId = $state.params.unitid;
        vm.packid = $state.params.packid;
        vm.isZFInvestment = true;
        vm.isYearPlan = true;
        vm.model.yearPlanStatistics=[];


        vm.testtest = true;

    	function initPage(){
    		if(routName=='yearPlan_shenbaoInfoList'){//年度计划项目库--政投列表页
    			vm.page="shenbaoInfoList";
    		}
    		if(routName=='yearPlan_shenbaoInfoListSH'){//年度计划项目库--社投列表页
    			vm.page='shenbaoInfoListSH';
    		}
    		if(routName=='yearPlan_shenbaoInfoEdit'){//申报信息新增页面(政/社混用)
    			vm.page='shenbaoInfoAdd';
    		}
    		if(routName=='yearPlan_shenbaoInfoEdit' && vm.id !=""){//申报信息编辑页面(政/社混用)
    			vm.page='shenbaoInfoEdit';

    		}
    		if(routName=='shenbao_record'){
                vm.page='shenbao_record';
			}
    		if(routName=='yearPlan_planList'){//年度计划--政投列表页
    			vm.page='planList';
    		}
    		if(routName=='yearPlan_planEdit'){
    			vm.page='plan_create';
    		}
    		if(routName=='yearPlan_planEdit'&&vm.id){
    			vm.page='plan_update';
    		}
    		if(routName=='yearPlan_planBZ'){
    			vm.page='planBZ';
    		}
    		if(routName=='yearPlan_packList'){
    			vm.page = 'packList';
    		}
    		if(routName=='yearPlan_packEdit'){
    			if(vm.id){
    				vm.page='pack_update';
    			}else{
    				vm.page='pack_create';
    			}
    		}
    		if(routName == 'packPlanShenbaoinfos'){
                vm.page = 'projectList';
			}
    	}
    	
    	activate();
        function activate() {
        	initPage();
        	initPublicMethod();
        	initBasicData();



        	if(vm.page=='shenbaoInfoList'){
        		init_shenbaoInfoList();
        	}
        	if(vm.page=='shenbaoInfoListSH'){
        		init_shenbaoInfoListSH();
        	}
        	if(vm.page=='shenbaoInfoAdd'){
        		vm.shenBaoInfoAdd = true;
        		init_shenbaoInfoEdit();
        		
        	}
        	if(vm.page=='shenbaoInfoEdit'){
        		vm.shenBaoInfoEdit = true;
        		init_shenbaoInfoEdit();
        	}
        	if(vm.page=='planList'){
        		init_planList();
        	}
        	if(vm.page=='plan_create'){
        		init_planCreate();
        	}
        	if(vm.page=='plan_update'){
        		vm.isPlanEdit=true;
        		init_planUpadte();
        	}
        	if(vm.page=='planBZ'){
        		init_planBZ();
        	}
        	/* 新增的功能 */
        	if(vm.page == 'packList'){
        		init_packList();
        	}
        	if(vm.page=='pack_create'){
        		init_packAdd();
        	}
        	if(vm.page=='pack_update'){
        		vm.isPackEdit = true;
        		init_packEdit();
        	}
        	if(vm.page == 'projectList'){
        		init_projectList();
			}
			if(  vm.page=='shenbao_record'){
                init_shenbao_record();
			}
        };

        function init_shenbao_record(){
            yearPlanSvc.getShenBaoInfoById(vm);
		}


        vm.doSearch_plan=function() {

            yearPlanSvc.grid_yearPlan_shenbaoInfoList(vm);
        }

        vm.checkLength = function(obj,max,id){
            common.checkLength(obj,max,id);
        };

        vm.getUserById = function(id){
        	if(id != null && id != undefined && id != ""){
                return common.getUserById(id).value[0].displayName;
			}
		};


        vm.dialog_addPlanReach = function(id,projectId){
            //申报详情模态框
			vm.id = id;
            vm.projectId = projectId;
			yearPlanSvc.getProjectById(vm);
            yearPlanSvc.getPlanreachList(vm);
			$('#myModal_plan').modal({
				backdrop: 'static',
				keyboard:true
			});
		};

        vm.dialog_addPackPlan = function(id,unitId){
           location.href="#/packPlanShenbaoinfos/"+id+"/"+unitId+"/"+vm.id;
        };
        
        function init_packList(){
        	yearPlanSvc.grid_packList(vm);
    		//删除计划
    		vm.deletePack=function(id){
    			common.confirm({
    				vm:vm,
    				msg:"确认要删除数据吗？",
    				fn:function(){
    					$('.confirmDialog').modal('hide');
    					yearPlanSvc.pack_delete(vm,id);
    				}
    			});
    		};
    		//批量删除计划
    		vm.deletePacks=function(){
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
                    vm.deletePack(idStr);
                }   
    		};
        }//end init_packList
        
        function init_packEdit(){
        	if(vm.id){
        		yearPlanSvc.getPackPlanById(vm);//查询年度打包类型信息
        	}
        	
        	vm.allUnit = common.getUserUnits();//获取所有单位信息
        	 var keys = [];
        	 vm.output = [];
        	 angular.forEach(vm.allUnit, function(item) {
		          var key = item["id"];
		          if(keys.indexOf(key) === -1) {
		              keys.push(key);
		              vm.output.push(item);
		          }
		      });
        	//添加建设资金配置
        	vm.addConstructionUnit = function(){
        		if(vm.model.allocationCapitalDtos){
        			vm.model.allocationCapitalDtos.push({unitName:'',capital_ggys:'',capital_gtzj:'',capital_ggys_surplus:'',capital_gtzj_surplus:''});
            	}else{
            		vm.model.allocationCapitalDtos=[{unitName:'',capital_ggys:'',capital_gtzj:'',capital_ggys_surplus:'',capital_gtzj_surplus:''}];
            	}
        	};
        	
        	//移除建设单资金配置
        	vm.removeConstructionUnit=function(idx){
        		vm.model.allocationCapitalDtos.splice(idx,1);
    		};
    		vm.update = function(){
    			var configuredMoney = 0;
    			if(vm.model.allocationCapitalDtos != undefined){
    				for(var i=0;i<vm.model.allocationCapitalDtos.length;i++){
        				configuredMoney = configuredMoney+(vm.model.allocationCapitalDtos[i].capital_ggys + 
        						vm.model.allocationCapitalDtos[i].capital_gtzj);
        				vm.model.allocationCapitalDtos[i].capitalSCZ_gtzj_TheYear = 0;
        				vm.model.allocationCapitalDtos[i].capitalSCZ_ggys_TheYear = 0;
        			}
    			}
    			
    			if(configuredMoney <= vm.model.totalMoney){
    				//vm.model.surplusMoney = vm.model.totalMoney - configuredMoney;
    				yearPlanSvc.pack_update(vm);
    			}else{
    				common.alert({
    					vm:vm,
    					msg:'建设单位资金配置不能大于总指标，请重新配置！'             	
    				});
    			}
    		};
        }//end#init_packEdit
        
        function init_packAdd(){
        	vm.allUnit = common.getUserUnits();//获取所有单位信息
        	 var keys = [];
        	 vm.output = [];
        	 angular.forEach(vm.allUnit, function(item) {
		          var key = item["id"];
		          if(keys.indexOf(key) === -1) {
		              keys.push(key);
		              vm.output.push(item);
		          }
		      });
        	//添加建设资金配置
        	vm.addConstructionUnit = function(){
        		if(vm.model.allocationCapitalDtos){
        			vm.model.allocationCapitalDtos.push({unitName:'',capital_ggys:'',capital_gtzj:'',capital_ggys_surplus:'',capital_gtzj_surplus:''});
            	}else{
            		vm.model.allocationCapitalDtos=[{unitName:'',capital_ggys:'',capital_gtzj:'',capital_ggys_surplus:'',capital_gtzj_surplus:''}];
            	}
        	};
        	
        	//移除建设单资金配置
        	vm.removeConstructionUnit=function(idx){
        		vm.model.allocationCapitalDtos.splice(idx,1);
    		};
    		
    		/*vm.surplusMoney = function(){
    			if(vm.model.allocationCapitalDtos){
    				for(var i=0;i<vm.model.allocationCapitalDtos.length;i++){
            			configuredMoney = configuredMoney+(vm.model.allocationCapitalDtos[i].capital_ggys + 
            								vm.model.allocationCapitalDtos[i].capital_gtzj);
            		}
    				if(configuredMoney <= vm.model.totalMoney){
            			return vm.model.totalMoney - configuredMoney;
    				}
    			}
    		};*/
    		
        	//新增打包类项目
        	vm.create = function(){
        		var configuredMoney = 0;
        		if(vm.model.totalMoney=="" || !vm.model.totalMoney){
        			vm.model.totalMoney = 0;
        		}
        		if(vm.model.allocationCapitalDtos != undefined){
        			for(var i=0;i<vm.model.allocationCapitalDtos.length;i++){
            			configuredMoney = configuredMoney+(vm.model.allocationCapitalDtos[i].capital_ggys + 
            								vm.model.allocationCapitalDtos[i].capital_gtzj);
            		}
        		}
        		
        		if(configuredMoney <= vm.model.totalMoney){
        			
        			//vm.model.surplusMoney = vm.model.totalMoney - configuredMoney;
        			yearPlanSvc.pack_create(vm);
        		}else{
        			common.alert({
                    	vm:vm,
                    	msg:'建设单位资金配置不能大于总指标，请重新配置！'             	
                    });
        		}
        	};
        }//end#init_packAdd
    	
    	function initPublicMethod(){
    		//检查字符串可输入长度
    		vm.checkLength = function(obj,max,id){
    			 common.checkLength(obj,max,id);
         	};
         	//转换字典
         	vm.getBasicDataDesc = function(str){
         		return common.getBasicDataDesc(str);
         	};
         	//获取建设单位名称
         	vm.getUnitName=function(unitId){
         		return common.getUnitName(unitId);
         	};
         	//html页面绑定
         	vm.html = function(val){
         		return $sce.trustAsHtml(val);
         	};
    	}
    	
    	function initBasicData(){
    		//编制列表全选框选择
    		$(document).on('click', '#checkboxAll_shenBaoList', function () {
               var isSelected = $(this).is(':checked');
               $('.yearPlanCapitalGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
           });
    		//编制计划打包列表全选框
    		$(document).on('click', '#checkboxAll_packList', function () {
                var isSelected = $(this).is(':checked');
                $('.packPlanGrid').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
            });
    		$(document).on('click', '#checkboxAll', function () {
                var isSelected = $(this).is(':checked');
                $('.vm.gridOptions_packList').find('tr td:nth-child(1)').find('input:checkbox').prop('checked', isSelected);
            });
    		//刷新基础数据
    		window.global_basicData = null;
          	vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别	   		
	   		vm.basicData.projectConstrChar=common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);//项目建设性质	
	   		vm.basicData.auditState=common.getBacicDataByIndectity(common.basicDataConfig().auditState);//审核状态
     	   	vm.basicData.projectStage = common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段 	   		
  	   		vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类	   			   			       		   		
  	   		vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别	   		
  	   		vm.basicData.projectConstrChar=common.getBacicDataByIndectity(common.basicDataConfig().projectConstrChar);//项目建设性质	   			   		
  	   		vm.basicData.unitProperty=common.getBacicDataByIndectity(common.basicDataConfig().unitProperty);//单位性质
  	   		vm.basicData.packageType=common.getBacicDataByIndectity(common.basicDataConfig().packageType);//打包类型
  	   		vm.basicData.projectIndustryAll=common.getBacicDataByIndectity(common.basicDataConfig().projectIndustry);//项目行业分类
  	   		vm.basicData.projectIndustry_ZF=$linq(common.getBasicData())
  	   			.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
  	   			.toArray();//政府投资项目行业
	  	   	vm.basicData.projectIndustry_SH=$linq(common.getBasicData())
	 			.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_SH;})
	 			.toArray();//社会投资项目行业
	  	   	vm.projectIndustryChange=function(){
	  	   		//子集的显示
	  	   		if(!vm.search.projectIndustryParent || vm.search.projectIndustryParent==''){
	  	   			vm.searchIndustryChild=false;
	  	   		}else{
	  	   			vm.searchIndustryChild=true;
	  	   		}
	       		vm.basicData.projectIndustryChildren=$linq(common.getBasicData())
	       			.where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==vm.search.projectIndustryParent;})
	       			.toArray();
	  	   	};
  	   		vm.basicData.area_Street=$linq(common.getBasicData())
  	   			.where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
  	   			.toArray(); //行政区划街道
  	   		vm.basicData.userUnit=common.getUserUnits();//建设单位信息
  	   		vm.basicData.users=[];
    	}
    	
    	function commonShenBaoListMethod(){
    		vm.basicData.userUnit= common.getUserUnits();//获取所有单位
		   	 var keys = [];
	    	 vm.output = [];
	    	 angular.forEach(vm.basicData.userUnit, function(item) {
		          var key = item["id"];
		          if(keys.indexOf(key) === -1) {
		              keys.push(key);
		              vm.output.push(item);
		          }
		      });
          	//条件查询
          	vm.doSearch = function(type){
    			var filters = [];//封装查询条件
    			//列表默认查询条件
				filters.push({field:'projectShenBaoStage',operator:'eq',value:common.basicDataConfig().projectShenBaoStage_nextYearPlan});//默认条件--申报阶段为下一年度计划
				filters.push({field:'processState',operator:'eq',value:common.basicDataConfig().processState_pass});//默认条件--申报信息的状态为签收状态   
				if(type=='ZF'){
					filters.push({field:'projectInvestmentType',operator:'eq',value:common.basicDataConfig().projectInvestmentType_ZF});//默认条件--政投
          		}else if(type=='SH'){
          			filters.push({field:'projectInvestmentType',operator:'eq',value:common.basicDataConfig().projectInvestmentType_SH});//默认条件--社投
          		}
				//用户筛选条件
				if(vm.search.projectName !=null && vm.search.projectName !=''){//查询条件--项目名称
     			   filters.push({field:'projectName',operator:'contains',value:vm.search.projectName});
     		   }
     		   if(vm.search.projectCategory !=null && vm.search.projectCategory !=''){//查询条件--项目类别
     			   filters.push({field:'projectCategory',operator:'eq',value:vm.search.projectCategory});
     		   }
     		   if(vm.search.planYear !=null && vm.search.planYear !=''){//查询条件--计划年度
     			  filters.push({field:'planYear',operator:'eq',value:parseInt(vm.search.planYear,10)});
     		   }
     		   if(vm.search.unitName !=null && vm.search.unitName !=''){//查询条件--建设单位名称
     			  filters.push({field:'unitName',operator:'contains',value:vm.search.unitName});
     		   }
     		   if(vm.search.auditState !=null && vm.search.auditState !=''){//查询条件--审核状态
     			  filters.push({field:'auditState',operator:'eq',value:vm.search.auditState});
     		   }
     		   if(vm.search.projectConstrChar !=null && vm.search.projectConstrChar !=''){//查询条件--建设性质
     			  filters.push({field:'projectConstrChar',operator:'eq',value:vm.search.projectConstrChar});
     		   }
     		   if(vm.search.projectIndustry !=null && vm.search.projectIndustry !=''){//查询条件--项目行业
     			  filters.push({field:'projectIndustry',operator:'eq',value:vm.search.projectIndustry});
     		   }
     		  if(vm.search.receiver !=null && vm.search.receiver !=''){//查询条件--签收人
     			  if(vm.search.receiver == "me"){
     				 filters.push({field:'receiver',operator:'eq',value:window.profile_userId});
     			  }else if(vm.search.receiver == "other"){
     				 filters.push({field:'receiver',operator:'ne',value:window.profile_userId});
     			  }else if(vm.search.receiver == "all"){}
     		   }
     		  if(vm.search.packageType !=null && vm.search.packageType !=''){//查询条件--打包类型
     			 filters.push({field:'packageType',operator:'eq',value:vm.search.packageType});
     		  }
     		  if(type=='ZF'){
     			 vm.gridOptions.dataSource.filter(filters);
     		  }else if(type=='SH'){
     			 vm.yearPlanListGridOptionsSH.dataSource.filter(filters);
     		  }
    		};
          	
          	//清空查询条件(重置查询条件，并根据默认值查询,不用重新加载整个页面【ldm 2018-07-30】)
    		vm.filterClear=function(type){
                vm.search = {};
                vm.doSearch(type);
    			//location.reload();
    		};
    		
    		//新增年度计划项目信息按钮
    		vm.addShenBaoInfo=function(type){
    			var stage=common.basicDataConfig().projectShenBaoStage_nextYearPlan;//默认申报阶段为下一年度计划
    			var projectInvestmentType;
    			if(type=='ZF'){
    				projectInvestmentType=common.basicDataConfig().projectInvestmentType_ZF;//为政府投资类型
    			}else if(type=='SH'){
    				projectInvestmentType=common.basicDataConfig().projectInvestmentType_SH;//为社会投资类型
    			}
    			//跳转到编辑页面
    			$location.path("/yearPlan/shenbaoInfoEdit//"+projectInvestmentType+"/"+stage);
    		};
    		
    		
    		//申报详情模态框
    		vm.dialog_shenbaoInfo = function(id){
    			vm.id = id;
    			yearPlanSvc.getShenBaoInfoById(vm);

    			$('#shenbaoInfo').modal({
                    backdrop: 'static',
                    keyboard:true
                });
    		};
    		
    		//列表退文按钮
    		vm.retreat = function(id){
    			common.confirm({
    				vm:vm,
    				msg:"确定需要退文吗？",
    				fn:function(){
    					$('.confirmDialog').modal('hide');
    					//退文信息收集模态框弹出
    					$("#shenbaoInfoTuiWen").modal({
    				        backdrop: 'static',
    				        keyboard:true
    				    });
    					vm.model.shenBaoInfo.id = id;
    	    			vm.model.thisProcessState = common.basicDataConfig().processState_notpass;
    					//退文信息收集模态框确认
    					vm.retreatSubmit=function(){
    						$("#shenbaoInfoTuiWen").modal('hide');
    						yearPlanSvc.updateShenBaoInfoState(vm);
    					};
    				}
    			});
    		};
    	}
    	
    	function init_shenbaoInfoList(){
    		commonShenBaoListMethod();
    		yearPlanSvc.grid_shenbaoInfoList(vm);
    	}//end#init_shenbaoInfoList
    	
    	function init_shenbaoInfoListSH(){
    		commonShenBaoListMethod();
    		yearPlanSvc.grid_shenbaoInfoListSH(vm);
    	}//end#init_shenbaoInfoListSH
    	
    	function init_shenbaoInfoEdit(){
    		vm.auditState_auditPass=common.basicDataConfig().auditState_auditPass;//审核通过
    		vm.auditState_auditNotPass=common.basicDataConfig().auditState_auditNotPass;//审核未通过
    		//初始化页面
    		var init_page = function(){
	 		  vm.isYearPlan=vm.stage==common.basicDataConfig().projectShenBaoStage_nextYearPlan;//申报阶段为下一年度计划
	 		  if(vm.isYearPlan){
	 			 vm.isYearPlan = true;
   			   //初始化项目材料清单
   			   vm.materialsType=common.uploadFileTypeConfig().projectShenBaoStage_YearPlan;
   			   vm.uploadType=[['SCQQJFXD', '首次前期经费下达批复'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算'], ['ZJSQBG', '资金申请报告批复']];
	 		  }
	 	
	 		//如果是新增下一年度计划信息--禁止点击Tab切换
	 		  if(vm.shenBaoInfoAdd){
	 			 vm.isShenBaoInfoAdd=true;//审核按钮不能点击
	 			 $("#tab1").attr("disabled","true");
		 		  $("#tab2").attr("disabled","true");
		 		  $("#tab3").attr("disabled","true");
		 		  $("#tab4").attr("disabled","true");
	 		  }
    		};
    		//初始化基础数据
    		var init_basicData = function(){
    			if(vm.investmentType == common.basicDataConfig().projectInvestmentType_ZF){//如果为政府投资
    				vm.isZFInvestment = true; 
       			 	//基础数据--项目分类
         		   vm.basicData.projectClassify=$linq(common.getBasicData())
     	       		.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_ZF;})
     	       		.toArray();
         		   //基础数据--行业归口
         		  vm.basicData.projectIndustry=vm.basicData.projectIndustry_ZF;
         	   }else if(vm.investmentType == common.basicDataConfig().projectInvestmentType_SH){//如果为社会投资
         		   vm.isSHInvestment = true;
      			   //基础数据--项目分类
         		   vm.basicData.projectClassify=$linq(common.getBasicData())
     	       		.where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_SH;})
     	       		.toArray();
      			  //基础数据--行业归口
      			   vm.basicData.projectIndustry=vm.basicData.projectIndustry_SH;
         	   }
    	};
    	
    	init_page();
    	init_basicData();
    	
    	yearPlanSvc.getShenBaoInfoById(vm);
    	//项目所属单位发生变化
    	vm.unitNameChange=function(){
    		yearPlanSvc.getUserUnit(vm);
    	};
    	
   		//获取项目类型， 多选
   		vm.updateSelection = function(id){
   			if(vm.projectTypes.constructor == String){
   				vm.projectTypes=common.stringToArray(vm.projectTypes);
   			}
        	var index = vm.projectTypes.indexOf(id);
        	if(index == -1){
        		vm.projectTypes.push(id);
	       	}else{
	       		vm.projectTypes.splice(index,1);
	       	}	        	
        };
        
        //申报年份发生变化时触发
        vm.changeYear = function(){
  		   vm.planYear = parseInt(vm.model.shenBaoInfo.planYear,10);
  	    };
        
        //展示批复文件选择模态框
   		vm.choseDocument = function(e){
   			vm.pifuType=$(e.target).parents('.uploadBox').attr('data-type');
     	   $("#documentRecords").modal({
		        backdrop: 'static',
		        keyboard:true  			  
     	   });
     	   vm.grid_documentRecords.dataSource.read();//批复文件列表数据刷新
   		};
   		yearPlanSvc.documentRecordsGird(vm);//查询批复文件
 	   		
   		//批复文件选择模态框确认
   		vm.pifuChoseConfirm = function(){
   			//关闭模态框
   			$("#documentRecords").modal('hide');
   			$(".modal-backdrop").remove();
   			//获取选择框中的信息
   			var select = common.getKendoCheckId('.grid');
        	var fileName = select[0].value;
        	if(fileName){
        		var file = common.stringToArray(fileName,",");
        		var number = file[0];
        		var name = file[1];
        		var url =file[2];
        		vm.model.shenBaoInfo['pifu'+vm.pifuType+'_wenhao'] = number;
        		if(vm.model.shenBaoInfo.attachmentDtos){
     				  vm.model.shenBaoInfo.attachmentDtos.push({name:name,url:url,type:vm.pifuType});
     			 }else{
     				  vm.model.shenBaoInfo.attachmentDtos=[{name:name,url:url,type:vm.pifuType}];
     			 }
        	}
        };
     	  
   		//文件上传
 	   vm.uploadSuccess=function(e){
			var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
           	 if(e.XMLHttpRequest.status==200){
                 angular.forEach(eval("("+e.XMLHttpRequest.response+")").data, function (fileObj, index) {
                     $scope.$apply(function() {
                         if(vm.model.shenBaoInfo.attachmentDtos){
                             vm.model.shenBaoInfo.attachmentDtos.push({
                                 name: fileObj.originalFilename,
                                 url: fileObj.randomName,
                                 type: type
                             });
                         } else {
                             vm.model.shenBaoInfo.attachmentDtos = [{
                                 name: fileObj.originalFilename,
                                 url: fileObj.randomName,
                                 type: type
                             }];
                         }
                     });
                 })
           		 // var fileName=e.XMLHttpRequest.response;
           		 // $scope.$apply(function(){
           			//  if(vm.model.shenBaoInfo.attachmentDtos){
           			// 	 vm.model.shenBaoInfo.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
           			//  }else{
           			// 	 vm.model.shenBaoInfo.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
           			//  }
           		 // });
           	 }
   		};

            vm.uploadError = function(e) {
                common.alert({
                    vm : vm,
                    msg : e.XMLHttpRequest.response.message
                });
            }

   		vm.onSelect=function(e){
			$.each(e.files, function (index, value) {
	            if(value.size > common.basicDataConfig().uploadSize){
	            	$scope.$apply(function(){
		   				common.alert({
			        		vm : vm,
							msg : "上传文件过大！"
			            });               			           			
	          		 });
	            }
	            
	        });
    	};
		//批复文件上传配置
		vm.uploadOptions_pifu={
			async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
            error:vm.uploadError,
            success:vm.uploadSuccess,
			localization:{select:'上传文件'},
			showFileList:false,
			multiple:false,
			validation: {
                maxFileSize: common.basicDataConfig().uploadSize
            },
            select:vm.onSelect
		};
		//相关附件上传配置
		vm.uploadOptions={
			async:{saveUrl:'/common/save',removeUrl:'/common/remove',autoUpload:true},
            error:vm.uploadError,
            success:vm.uploadSuccess,
			localization:{select:'上传文件'},
			showFileList:false,
			multiple:true,
			validation: {
                maxFileSize: common.basicDataConfig().uploadSize
            },
            select:vm.onSelect
		};
    		
     	   //删除上传文件
   		 vm.delFile=function(idx){
   			var file = vm.model.shenBaoInfo.attachmentDtos[idx];
  			 if(file){//删除上传文件的同时删除批复文号
  				var pifuType = file.type;
  				vm.model.shenBaoInfo['pifu'+pifuType+'_wenhao'] = "";
  				vm.model.shenBaoInfo.attachmentDtos.splice(idx,1);
  			 }
   		 };
   		 	 
   		 //tab切换(上一步)
   		 vm.tabReturn = function(tabId){
     			var activeTab = $("#tab"+tabId);
 				vm.tabStrip.activateTab(activeTab);
      		};
   		
   		 //tab切换(下一步)
   		 vm.tabChange = function(tabId){
      			//验证表单
      			common.initJqValidation();
     			var isValid = $('form').valid();
     			var activeTab = $("#tab"+tabId);
     			if(isValid){//通过则跳转到下一页面
     				vm.tabStrip.activateTab(activeTab);
     			}
      		};
      	//添加建设单位
 		vm.addUnit=function(){
 			if(vm.constructionUnits.constructor == String){
 				vm.constructionUnits=common.stringToArray(vm.constructionUnits);
 			}
 			vm.constructionUnits.push('');
 			if(vm.constructionUnits.length >1){
				vm.canDelete = true;
			}
 		};
     	//删除建设单位
	   vm.deleteUnit=function(idx){
		   if(vm.canDelete){
			   if(vm.constructionUnits.constructor == String){
	 				vm.constructionUnits=common.stringToArray(vm.constructionUnits);
	 			}
			   vm.constructionUnits.splice(idx,1);
				if(vm.constructionUnits.length <=1){
					vm.canDelete = false;
				}
			}
	   };
	   //打包类型改变事件
	   vm.packageTypeChange=function(){
		   vm.isOtherPackageType=false;
		   if(vm.model.shenBaoInfo.packageType == 'other'){
			   vm.isOtherPackageType = true;
		   }
	   };
	   //打包类型新增其他保存
	   vm.savePackageType=function(){ 
		  yearPlanSvc.savePackageType(vm);
	   };
      	//项目纳入项目库
  		vm.addProjectToLibray=function(){
  			yearPlanSvc.addProjectToLibrary(vm);
  		};
		//项目纳出项目库
		vm.outProjectToLibrary=function(){
			yearPlanSvc.outProjectToLibrary(vm);
		}
      	//更新项目信息
  		vm.updateProject=function(){
            common.initJqValidation();
            var isValid = $('#form').valid();
            if (isValid){
                yearPlanSvc.updateProject(vm);
			}else {
                common.alert({
                    vm: vm,
                    msg: "您填写的信息不正确,请核对后提交!",
                });


			}

  		};
  		//确认更新
     	vm.update = function(){
//     		vm.model.shenBaoInfo.auditState=common.basicDataConfig().auditState_noAudit;//后台修改保存申报信息之后默认为未审核状态
     		yearPlanSvc.updateShenBaoInfo(vm);
     	};

     	//更新审核状态
     	vm.updateAuditState=function(auditState){
     		vm.isAudit = true;//用于设置跳转到列表页面
     		vm.model.shenBaoInfo.auditState = auditState;
     		 vm.model.shenBaoInfo.processStage = "已办结";
     		yearPlanSvc.updateShenBaoInfo(vm);
     	};
     	//确认创建
     	vm.create=function(){
     		yearPlanSvc.createShenBaoInfo(vm);
     	};
     	
    }//end#init_shenbaoInfoEdit
    	
    	//init_planList
    	function init_planList(){

    		yearPlanSvc.grid_planList(vm);
    		//删除计划
    		vm.deletePlan=function(id){
    			common.confirm({
    				vm:vm,
    				msg:"确认要删除数据吗？",
    				fn:function(){
    					$('.confirmDialog').modal('hide');
    					yearPlanSvc.plan_delete(vm,id);
    				}
    			});
    		};
    		//批量删除计划
    		vm.deletePlans=function(){
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
                    vm.deletePlan(idStr);
                }   
    		};
    	}//end#init_planBZList
    	
    	function init_planCreate(){
    		vm.create=function(){    		
    			yearPlanSvc.plan_create(vm);
    		};

            vm.lockYearPlan = function(isLock){
            	if(isLock){
                    common.initJqValidation();
                    var isValid = $('form').valid();
                    if (!isValid) {
                        vm.model.hasLock = false;
                    }
				}
			}

            vm.updateLock = function(){
				vm.model.hasLock = false;
            }
    	}//init_planBZList 
    	
    	function init_planUpadte(){
    		yearPlanSvc.getPlanById(vm);
    		vm.update=function(){
    			yearPlanSvc.plan_update(vm);
    		};

            vm.updateLock = function(){
            	if(vm.model.lockName == undefined || vm.model.lockName == null || vm.model.lockName == ''
                    ){
                    vm.model.hasLock = false;
				}else if(vm.model.lockName == window.profile_userId){
                    vm.model.hasLock = false;
                    yearPlanSvc.plan_update(vm);
				}else{
                    common.alert({
                        vm: vm,
                        msg: "无法解锁非本人锁定的计划!",
                    });
                }

            }
    	}//init_planUpadte
    	
    	function init_planBZ(){
            yearPlanSvc.getPlanStatisticsInfo(vm);//获取年度计划统计信息

            //查询
            vm.doSearch=function(){
                vm.filters = [];
                vm.filters.push({field:'projectInvestmentType',operator:'eq',value:common.basicDataConfig().projectInvestmentType_ZF});//默认条件--政府投资项目
                if(vm.search.projectName_plan !=null && vm.search.projectName_plan !=''){//查询条件--项目名称
                    vm.filters.push({field:'projectName',operator:'contains',value:vm.search.projectName_plan});
                }
                if(vm.search.projectStage_plan !=null && vm.search.projectStage_plan !=''){//查询条件--项目阶段
                    vm.filters.push({field:'projectStage',operator:'eq',value:vm.search.projectStage_plan});
                }
                if(vm.search.unitName_plan !=null && vm.search.unitName_plan !=''){
                    vm.filters.push({field:'unitName',operator:'eq',value:vm.search.unitName_plan});
                }
                if(vm.search.projectIndustry_plan !=null && vm.search.projectIndustry_plan !=''){//查询条件--项目行业
                    vm.filters.push({field:'projectIndustry',operator:'eq',value:vm.search.projectIndustry_plan});
                }
                if(vm.search.projectCategory_plan !=null && vm.search.projectCategory_plan !=''){//查询条件--项目行业
                    vm.filters.push({field:'projectCategory',operator:'eq',value:vm.search.projectCategory_plan});
                }
                var dataSource = $("#planGird").data("kendoGrid").dataSource;
                // yearPlanSvc.grid_yearPlan_shenbaoInfoList(vm);

                var Grid = $("div[data-role=grid]");//获取grid对象
                var Table = Grid.data("kendoGrid");//当前数据
                var Data = Table.dataSource.data();
                var aaa = vm.planGridOptions.dataSource.filter(vm.filters);
                var fiData = new kendo.data.Query(Data).filter(vm.filters).data;//获取过滤后的数据,方式一
                // var fiData = new kendo.data.Query.process(Data, { filter: filters }).data;//获取过滤后的数据，方式二
                Table.dataSource.view(fiData);//将过滤后的信息传给视图
                Table.dataSource._aggregateResult = new kendo.data.Query(fiData).aggregate(Table.dataSource.options.aggregate);//重新计算聚合列
                Table.refresh();//刷新页面信息
                // vm.planGridOptions.dataSource.filter(vm.filters);
                yearPlanSvc.getPlanStatisticsInfo(vm);
            };
            //清空查询条件
            vm.filterClear=function(){
                location.reload();
            };

    		yearPlanSvc.getPlanById(vm);//查询年度信息
    		yearPlanSvc.getPlanStatisticsInfo(vm);//获取年度计划统计信息
    		// yearPlanSvc.grid_yearPlan_addShenbaoInfoList(vm);//查询所有的可添加的申报信息列表
    		yearPlanSvc.grid_yearPlan_packPlan(vm);//获取年度计划所关联的打包类型
    		yearPlanSvc.grid_packListForYeanPlan(vm);//查询所有可添加的打包类型

            vm.saveShenBaoInfo = function(){
                $('#myModal_plan').modal('hide');
                common.confirm({
                    vm:vm,
                    msg:"确认要主动下达吗？",
                    fn:function(){
                        $('.confirmDialog').modal('hide');
                        yearPlanSvc.activeRelease(vm,vm.id);
                    }
                });
            }
    		
    		vm.basicData.userUnit=common.getUserUnits();//获取所有单位
		   	 var keys = [];
	    	 vm.output = [];
	    	 angular.forEach(vm.basicData.userUnit, function(item) {
		          var key = item["id"];
		          if(keys.indexOf(key) === -1) {
		              keys.push(key);
		              vm.output.push(item);
		          }
		      });
    		//添加项目计划弹出模态框
    		vm.dialog_addPlan=function(year){
    			 $('#addPlanList').modal({
                     backdrop: 'static',
                     keyboard:false
                 });
                vm.year = vm.model.plan.year;
                yearPlanSvc.grid_yearPlan_addShenbaoInfoList(vm);//查询所有的可添加的申报信息列表
    		};
    		//添加打包类型弹出模态框
    		vm.dialog_addPack=function(){
    			 $('#addPackList').modal({
                     backdrop: 'static',
                     keyboard:false
                 });
    		};
    		//添加计划查询绑定回车键按下事件
    		$("#addPlanSearchBtn").keydown(function(){
    			vm.search();
    		});
    		
    		//添加计划筛选
    		vm.search=function(){
    			var filters = [];
				filters.push({field:'projectShenBaoStage',operator:'eq',value:common.basicDataConfig().projectShenBaoStage_nextYearPlan});//默认条件--申报阶段为下一年度计划
                filters.push({field:'processState',operator:'eq',value:common.basicDataConfig().processState_pass});//默认条件--申报信息的状态为签收状态
                // filters.push({field:'isIncludYearPlan',operator:'eq',value:false});
                // filters.push({field:'planYear',operator:'eq',value:vm.year});


				if(vm.search.projectName !=null && vm.search.projectName !=''){//查询条件--项目名称
	     			   filters.push({field:'projectName',operator:'contains',value:vm.search.projectName});
	     		   }
     		   if(vm.search.projectIndustry !=null && vm.search.projectIndustry !=''){//查询条件--项目行业
     			   filters.push({field:'projectIndustry',operator:'eq',value:vm.search.projectIndustry});
     		   }
     		   if(vm.search.planYear !=null && vm.search.planYear !=''){//查询条件--计划年度
     			  filters.push({field:'planYear',operator:'eq',value:parseInt(vm.search.planYear,10)});
     		   }
     		   if(vm.search.unitName !=null && vm.search.unitName !=''){//查询条件--建设单位名称
     			  filters.push({field:'unitName',operator:'contains',value:vm.search.unitName});
     		   }
     		  if(vm.search.auditState !=null && vm.search.auditState !=''){//查询条件--审批状态
     			  filters.push({field:'auditState',operator:'eq',value:vm.search.auditState});
     		   }
     		   if(vm.search.projectConstrChar !=null && vm.search.projectConstrChar !=''){//查询条件--建设性质
     			  filters.push({field:'projectConstrChar',operator:'eq',value:vm.search.projectConstrChar});
     		   }
     		   if(vm.search.packageType !=null && vm.search.packageType !=''){//查询条件--打包类型
     			   filters.push({field:'packageType',operator:'eq',value:vm.search.packageType});
     		   }
                if(vm.search.projectCategory_plan !=null && vm.search.projectCategory_plan !=''){//查询条件--项目行业
                    filters.push({field:'projectCategory',operator:'eq',value:vm.search.projectCategory_plan});
                }
                if(vm.search.applyYearInvestStart !=null && vm.search.applyYearInvestStart !=''){//查询条件--申请年度投资开始
                    filters.push({field:'applyYearInvest',operator:'ge',value:vm.search.applyYearInvestStart});
                }
                if(vm.search.applyYearInvestEnd !=null && vm.search.applyYearInvestEnd !=''){//查询条件--申请年度投资开结束
                    filters.push({field:'applyYearInvest',operator:'le',value:vm.search.applyYearInvestEnd});
                }
     		  vm.addPlanGridOptions.dataSource.filter(filters);
    		};
    		//清空筛选条件
    		vm.filterClear=function(){
    			//清空人员设置的过滤条件
    			vm.search.projectName = '';
    			vm.search.projectIndustry = '';
    			vm.search.planYear = '';
    			vm.search.unitName = '';
    			vm.search.auditState = '';
    			vm.search.projectConstrChar = '';
    			vm.search.packageType = '';
    			//设置列表过滤项为默认的
    			var filters = [];
				filters.push({field:'projectShenBaoStage',operator:'eq',value:common.basicDataConfig().projectShenBaoStage_nextYearPlan});//默认条件--申报阶段为下一年度计划
				filters.push({field:'processState',operator:'eq',value:common.basicDataConfig().processState_pass});//默认条件--申报信息的状态为签收状态  
				vm.addPlanGridOptions.dataSource.filter(filters);
    		};
    		//模态框点击确认
    		vm.dialogConfirmSubmit=function(){
    			//获取选中的申报信息的id
    			var selectIds = common.getKendoCheckId('.grid');
                if (selectIds.length == 0) {
                	return;
                } else {
                	var ids=[];
                    for (var i = 0; i < selectIds.length; i++) {
                    	ids.push(selectIds[i].value);
    				}
                    var idStr=ids.join(',');              
                    $('#addPlanList').modal('toggle');//关闭模态框
                    yearPlanSvc.addShenBaoInfoconfirm(vm,idStr);//添加申报信息到计划中                  
                }   
    		};
    		//点击打包计划模态框确认按钮
    		vm.dialogConfirmSubmit_packPlan=function(){
    			//获取选中的申报信息的id
    			var selectIds = common.getKendoCheckId('.grid');
                if (selectIds.length == 0) {
                	return;
                } else {
                	var ids=[];
                    for (var i = 0; i < selectIds.length; i++) {
                    	ids.push(selectIds[i].value);
    				}
                    var idStr=ids.join(',');              
                    $('#addPackList').modal('toggle');//关闭模态框
                    yearPlanSvc.addPackPlanToYearPlan(vm,idStr);//添加申报信息到计划中                  
                }   
    		};
    		
    		//编制计划中的申报信息
    		 vm.popOver=function(e,id){
    			 //根据申报信息id查询出年度计划编制
    			 vm.currentCapitalId=id;
    			 yearPlanSvc.getYearPlanCapitalById(vm,id);
    			 //编制信息输入显示
    	    	   vm.isPopOver=true;
    	    	   var minClick=$(document).height()-50-230;
    	    	   if(e.pageY>minClick){
    	    		   e.pageY=minClick;
    	    	   }
    	    	   vm.popStyle={    	    			  
    	    			   left:e.pageX+'px',
    	    			   top:e.pageY+'px'
    	    	   };  
    	       };//popOver
    	     //更新编制信息  
    		 vm.updateCapital = function(){
    			 yearPlanSvc.updateYearPlanCapital(vm);
    		 };
    		 //移除计划中的申报信息
    		 vm.removeYearPlanCapital=function(){
    	    		var selectIds = common.getKendoCheckId('.yearPlanCapitalGrid');
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
    	                yearPlanSvc.removeYearPlanCapital(vm,idStr);
    	            }
    	    	};//removeYearPlanCapital
    	    	
    	    //移除年度计划中打包计划
    	    vm.removePack = function(){
    	    	var selectIds = common.getKendoCheckId('.packPlanGrid');
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
	                yearPlanSvc.removeYearPlanPack(vm,idStr);
	            }
    	    };
    	    	
    	    //批量操作是否填报
    	    vm.isMonthReports=function(){
    	    	function getKendoCheckId(){
    	    		var checkbox = $('.yearPlanCapitalGrid').find('tr td:nth-child(1)').find('input:checked');
        	        var data = [];
        	        checkbox.each(function () {
        	            var id = $(this).attr('projectId');
        	            data.push({ name: 'id', value: id });
        	        });
        	        return data;
    	    	}
    	    	var selectIds = getKendoCheckId();
                if (selectIds.length == 0) {
                	common.alert({
                    	vm:vm,
                    	msg:'请选择数据！'                	
                    });
                } else {
                	//弹出选择是否填报模态框
    				$("#myModal_edit").modal({
    	                backdrop: 'static',
    	                keyboard:true
    	            });
                	var ids=[];
                    for (var i = 0; i < selectIds.length; i++) {
                    	ids.push(selectIds[i].value);
    				}
                    var idStr=ids.join(',');
                    vm.isMonthReportId = idStr;
                }   
    	    };
    	  //更新项目是否填报状态
    		vm.updateIsMonthReport = function(){
    			yearPlanSvc.updateIsMonthReport(vm);
    		}; 
    	    //导出印刷版Excel
	    	vm.exportExcelForYS=function(){
	    		yearPlanSvc.exportExcelForYS(vm);
	    	};

    	}//init_planBZ
        function init_projectList(){
            yearPlanSvc.projectList(vm);

            //用于查询、新增、编辑--基础数据初始化
            vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
            // vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类型
            vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别
            vm.basicData.investmentType=common.getBacicDataByIndectity(common.basicDataConfig().projectInvestmentType);//项目投资类型
            vm.basicData.area_Street=$linq(common.getBasicData())
                .where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
                .toArray();//获取街道信息
            vm.basicData.projectIndustryAll=common.getBacicDataByIndectity(common.basicDataConfig().projectIndustry);//项目行业分类
            vm.basicData.projectIndustry_ZF=$linq(common.getBasicData())
                .where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
                .toArray();//政府投资项目行业
            vm.basicData.projectIndustry_SH=$linq(common.getBasicData())
                .where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_SH;})
                .toArray();//社会投资项目行业
            vm.basicData.projectClassify_ZF=$linq(common.getBasicData())
                .where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_ZF;})
                .toArray();//政府投资项目分类
            vm.basicData.projectClassify_SH=$linq(common.getBasicData())
                .where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_SH;})
                .toArray();//社会投资项目分类
            vm.basicData.userUnit=common.getUserUnits();//获取所有单位
            var keys = [];
            vm.output = [];
            angular.forEach(vm.basicData.userUnit, function(item) {
                var key = item["id"];
                if(keys.indexOf(key) === -1) {
                    keys.push(key);
                    vm.output.push(item);
                }
            });
            //国民经济行业分类
            vm.basicData.nationalIndustry=common.getBacicDataByIndectity(common.basicDataConfig().projectGoverEconClassify);
            vm.nationalIndustryChange=function(){
                vm.basicData.nationalIndustryChildren=$linq(common.getBasicData())
                    .where(function(x){return x.identity==common.basicDataConfig().projectGoverEconClassify&&x.pId==vm.model.nationalIndustryParent;})
                    .toArray();
            }

            //条件查询
            vm.search=function(){
                var filters = [];
                filters.push({field:'isLatestVersion',operator:'eq',value:true});//默认条件--查询最新版本的项目

                if(vm.search.projectName !=null && vm.search.projectName !=''){
                    filters.push({field:'projectName',operator:'contains',value:vm.search.projectName});
                }
                if(vm.search.projectStage !=null && vm.search.projectStage !=''){//查询条件--项目阶段
                    filters.push({field:'projectStage',operator:'eq',value:vm.search.projectStage});
                }
                if(vm.search.isIncludLibrary !=null && vm.search.isIncludLibrary !=null){//查询条件--是否已纳入项目库
                    if(vm.search.isIncludLibrary == "true"){
                        filters.push({field:'isIncludLibrary',operator:'eq',value:true});
                    }else if(vm.search.isIncludLibrary == "false"){
                        filters.push({field:'isIncludLibrary',operator:'eq',value:false});
                    }
                }
                if(vm.search.unitName !=null && vm.search.unitName !=''){//查询条件--项目所属单位
                    filters.push({field:'unitName',operator:'eq',value:vm.search.unitName});
                }
                if(vm.search.projectIndustry !=null && vm.search.projectIndustry !=''){//查询条件--项目行业
                    filters.push({field:'projectIndustry',operator:'eq',value:vm.search.projectIndustry});
                }
                if(vm.search.projectInvestmentType !=null && vm.search.projectInvestmentType !=''){//查询条件--项目投资类型
                    filters.push({field:'projectInvestmentType',operator:'eq',value:vm.search.projectInvestmentType});
                }

                vm.gridOptions_packproject.dataSource.filter(filters);
            };
            //条件查询--项目行业父级发生变化
            vm.searchIndustryFatherChange=function(){
                vm.searchIndustryIsZF = false;
                vm.searchIndustryIsSH = false;
                vm.searchIndustryChild=false;
                if(vm.searchIndustryFather == common.basicDataConfig().projectIndustry_ZF){
                    vm.searchIndustryIsZF = true;
                }else if(vm.searchIndustryFather == common.basicDataConfig().projectIndustry_SH){
                    vm.searchIndustryIsSH = true;
                }
            };
            //条件查询--项目行业子集发生变化
            vm.searchIndustryChildChange=function(){
                vm.searchIndustryChild=false;
                if(vm.search.projectIndustryChild !=null && vm.search.projectIndustryChild !=''){
                    vm.basicData.projectIndustryChild_SH=$linq(common.getBasicData())
                        .where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==vm.search.projectIndustryChild;})
                        .toArray();//社会投资项目行业子集
                    vm.searchIndustryChild=true;
                }
            };
            //清空查询条件
            vm.filterClear=function(){
                location.reload();
            };

            vm.dialog_addPackplan = function(id){
                //申报详情模态框
                vm.projectId = id;
                yearPlanSvc.getProjectinfo(vm);
                yearPlanSvc.getPlanreachList(vm);
                $('#myModal_plan').modal({
                    backdrop: 'static',
                    keyboard:true
                });
            };

            vm.saveShenBaoInfo = function(){
                $('#myModal_plan').modal('hide');
                common.confirm({
                    vm:vm,
                    msg:"确认要主动下达吗？",
                    fn:function(){
                        $('.confirmDialog').modal('hide');
                        yearPlanSvc.activeRelease(vm,vm.packid);
                    }
                });
            }

            vm.addProject = function(){

			}
        }
    } //yearPlan
})();
