(function () {
    'use strict';
    angular
        .module('appSupervision')
        .controller('projectCtrl', project);

    project.$inject = ['$location','projectSupervisedSvc','$state','$scope','$sce'];

    function project($location, projectSupervisedSvc,$state,$scope,$sce) {
		/* jshint validthis:true */
        var vm = this;
        vm.title = "新增项目";
        vm.search={};
        vm.model={};
        vm.basicData={};
        vm.id=$state.params.id;
        vm.projectInvestmentType=$state.params.projectInvestmentType;
        vm.page="list";
        
        function init(){
            if($state.current.name=='projectDetails'){
                vm.page='details';
            }
            vm.getBasicDataDesc = function(Str){
                return common.getBasicDataDesc(Str);
            };
            vm.checkLength = function(obj,max,id){
                common.checkLength(obj,max,id);
            };
            vm.html = function(val){
                return $sce.trustAsHtml(val);
            };
            //用于查询、编辑、新增--基础数据
            vm.basicData.projectStage=common.getBacicDataByIndectity(common.basicDataConfig().projectStage);//项目阶段
            vm.basicData.userUnit=common.getUserUnits();
            vm.basicData.projectType=common.getBacicDataByIndectity(common.basicDataConfig().projectType);//项目类型
            vm.basicData.projectCategory=common.getBacicDataByIndectity(common.basicDataConfig().projectCategory);//项目类别
            vm.basicData.investmentType=common.getBacicDataByIndectity(common.basicDataConfig().projectInvestmentType);//项目投资类型
            // vm.basicData.shenpiUnit = common.getBacicDataByIndectity(common.basicDataConfig().shenpiUnit);
            // value:common.basicDataConfig().projectInvestmentType_ZF
            //审批单位
            vm.basicData.shenpiUnitType=$linq(common.getBasicData())
                .where(function(x){
                    if(x.pId=="shenpiUnitType"){
                        return x;
                    }
                })
                .toArray();//审批单位
            
            vm.basicData.shenpiStateType=$linq(common.getBasicData())
                .where(function(x){
                    if(x.pId=="shenpiStateType"){
                        return x;
                    }
                })
                .toArray();//审批事项状态

            vm.basicData.area_Street=$linq(common.getBasicData())
                .where(function(x){return x.identity==common.basicDataConfig().area&&x.pId==common.basicDataConfig().area_GM;})
                .toArray();//获取街道信息
            
            //查询当前系统IP、端口、流程定义ID和流程流程实例ID
            vm.getDiagramViewerInfo = function(id,shenBaoId){
            	projectSupervisedSvc.getDiagramViewerInfo(vm,id,shenBaoId);
            }

        }
        init();
        activate();
        function activate() {
            if(vm.page=='list'){
                init_list();
            }
            if(vm.page=='details'){
                init_details();
            }
        }
        
        function init_list(){
            projectSupervisedSvc.grid(vm);
            vm.projectItems=function(id){
                projectSupervisedSvc.projectItems(vm,id)
            };

            //统计xdf
            vm.search=function(){
                debugger;
                var filters = [];

                if(vm.search.projectName !=null && vm.search.projectName !=''){//查询条件--项目名称
                    filters.push({field:'projectName',operator:'contains',value:vm.search.projectName});
                }
                if(vm.search.projectStage !=null && vm.search.projectStage !=''){//查询条件--项目阶段
                    filters.push({field:'projectStage',operator:'eq',value:vm.search.projectStage});
                }
                
                filters.push({field:'projectInvestmentType',operator:'eq',value:common.basicDataConfig().projectInvestmentType_ZF});
                
                filters.push({field:'projectShenBaoStage',operator:'eq',value:"projectShenBaoStage_1"});

                vm.gridOptions.dataSource.filter(filters);
            };

            vm.model.projectInvestmentType = common.basicDataConfig().projectInvestmentType_ZF;//默认为政府投资项目

        }//init_list

        function init_details(){
        	projectSupervisedSvc.getProjectById(vm);
        }

    }
})();
