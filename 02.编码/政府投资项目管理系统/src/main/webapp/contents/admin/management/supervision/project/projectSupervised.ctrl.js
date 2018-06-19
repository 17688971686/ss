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
        vm.model.projectDto={};
        vm.model.shenPiUnitDto={};
        vm.basicData={};
        vm.id=$state.params.id;
        vm.projectInvestmentType=$state.params.projectInvestmentType;
        vm.page="list";
        
        //查询当前系统IP、端口、流程定义ID和流程流程实例ID
        vm.getDiagramViewerInfo = function(id){
        	debugger;
        	projectSupervisedSvc.getDiagramViewerInfo(vm,id);
        }
        
        function init(){
            // debugger;
            var routeName=$state.current.name;
            if($state.current.name=='project'){
                vm.isZFInvestment = true;
            }
            if($state.current.name=='project_SH'){
                vm.isSHInvestment = true;
            }
            if($state.current.name=='projectEdit'){
                vm.page='create';
            }
            if(vm.id){
                vm.page='update';
            }
            if($state.current.name=='projectDetails'){
                vm.page='details';
            }
            switch (routeName) {
                case "supervision_spdw":
                    vm.page="shenpiUnitList";
                    break;
                case "shenpiUnitChange":
                    if(vm.id){
                        vm.page="shenpiUnitUpdate";
                    }else{
                        vm.page="shenpiUnitCreate";
                    }break;
                case "shenpiUnitDetail":
                    vm.page="shenpiUnitDetail";
                    break;
                case "shenpiItemsList":
                    vm.page="shenpiItemsList";
                    break;
                case "shenpiItemsChange":
                    if(vm.id){
                        vm.page="shenpiItemsUpdate";
                    }else{
                        vm.page="shenpiItemsCreate";
                    }break;
                case "shenpifankuiItemsList":
                    vm.page="shenpifankuiItemsList";
                    break;
                case "shenpifankuiItemsChange":
                    vm.page="shenpifankuiItemsChange";
                    break;
                case "shenpifankuiItemsDetail":
                    vm.page="shenpifankuiItemsDetail";
                    break;
                case "shenpiItemsDetail":
                    vm.page="shenpiItemsDetail";
                    break;
                case "projectItems":
                    vm.page="projectItems";
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

            //	alert(1);
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
    

        }
        init();
        activate();
        function activate() {
            // debugger;
            if(vm.page=="projectItems"){
                //vm.title='审批事项详情';
                projectItems();
            }

            if(vm.page=="shenpiItemsDetail"){
                vm.title='审批事项详情';
                shenpiItemsDetail();
            }
            if(vm.page=="shenpifankuiItemsDetail"){
                vm.title='审批事项反馈详情';
                shenpifankuiItemsDetail();
            }
            if(vm.page=="shenpifankuiItemsChange"){
                vm.title='审批事项反馈';
                shenpifankuiItemsChange();
            }
            if(vm.page=="shenpifankuiItemsList"){
                vm.title='审批事项反馈列表';
                shenpifankuiItemsList();
            }
            if(vm.page=="shenpiItemsCreate"){
                vm.title='审批事项新增';
                shenpiItemsCreate();
            }
            if(vm.page=="shenpiItemsUpdate"){
                vm.title='审批事项编辑';
                shenpiItemsUpdate();
            }
            if(vm.page=="shenpiItemsList"){
                vm.title='审批事项列表';
                shenpiItemsList();
            }
            if(vm.page=='shenpiUnitDetail'){
                shenpiUnitDetail();
            }
            if(vm.page=='shenpiUnitCreate'){
                shenpiUnitCreate();
            }
            if(vm.page=='shenpiUnitUpdate'){
                shenpiUnitUpdate();
            }
            if(vm.page=='list'){
                init_list();
            }
            if(vm.page=='shenpiUnitList'){
                vm.title='审批单位列表';
                shenpiUnitList();
            }
            if(vm.page=='create'){
                //初始化CheckBox
                vm.model.projectType =[];
                init_create();
            }
            if(vm.page=='update'){
                init_create();
                init_update();
            }
            if(vm.page=='details'){
                init_details();
            }

        }
        function projectItems(){
            vm.projectItems=function(pid){
                projectSupervisedSvc.projectItems(vm.pid)};
        }
        function shenpiItemsDetail(){
            projectSupervisedSvc.getShenPiItemsById(vm);
        }
        function shenpifankuiItemsDetail(){

            projectSupervisedSvc.getShenPiItemsById(vm);


        }
        function shenpifankuiItemsChange(){

            projectSupervisedSvc.getShenPiItemsById(vm);
            vm.updateShenpiFanKui=function(){
                projectSupervisedSvc.updateShenpiItems(vm);
            };
        }
        function shenpifankuiItemsList(){
            projectSupervisedSvc.shenpifankuiItemsGrid(vm);
            // debugger;
            vm.searchShenPiItems=function(){
                var filters = [];
                if(vm.search.shenpiName !=null && vm.search.shenpiName !=''){
                    filters.push({field:'shenpiName',operator:'contains',value:vm.search.shenpiName});
                }
                if(vm.search.projectName !=null && vm.search.projectName !=''){
                    filters.push({field:'projectName',operator:'contains',value:vm.search.projectName});
                }
                if(vm.search.shenpiUnitName !=null && vm.search.shenpiUnitName !=''){
                    filters.push({field:'shenpiUnitName',operator:'contains',value:vm.search.shenpiUnitName});
                }
                vm.gridOptions.dataSource.filter(filters);
            };

        }
        vm.onchange = function onchangeValue(value) {
            debugger;
            if(value =="请选择" ){
                $("#shenpiName").val("");
            }else{
                // var bd =name;
                // var g = $("#dayShenPiUnit").html();
                // var g1 = $("#dayShenPiUnit").val();
                // var c = $("#shenpiName").val();
                // $("#shenpiName").val($("#dayShenPiUnit").html());
                // $("#day").val($("#shenpiUnitSelect").val());
            }
        }


        function shenpiItemsCreate(){
            vm.choiceProject=function(){
                $('.myDialog').modal({
                    backdrop: 'static',
                    keyboard:false
                });
            };
            vm.choiceShenPiUnit=function(){
                $('.myDialog1').modal({
                    backdrop: 'static',
                    keyboard:false
                });
            };
            projectSupervisedSvc.projectGrid(vm);
            projectSupervisedSvc.shenpiUnitGridSelect(vm);
            //提交选择项目
            vm.choiceProjectSubmit=function(){
                var str=$('input:radio[name="radio"]:checked').val();
                if (str==""||str==null) {
					/*common.alert({
					 vm:vm,
					 msg:'请选择数据'

					 });*/
                } else {
                    var strs= []; //定义一数组
                    strs=str.split(","); //字符分割
                    vm.model.projectDto.id=strs[0];
                    vm.model.projectDto.projectName=strs[1];
                    $('.myDialog').modal('hide');
                }

            };
            vm.choiceShenPiUnitSubmit=function(){
                var str=$('input:radio[name="radio1"]:checked').val();
                if (str==""||str==null) {
					/*common.alert({
					 vm:vm,
					 msg:'请选择数据'

					 });*/
                } else {
                    var strs= []; //定义一数组
                    strs=str.split(","); //字符分割
                    vm.model.shenPiUnitDto.id=strs[0];
                    vm.model.shenPiUnitDto.shenpiUnitName=strs[1];
                    $('.myDialog1').modal('hide');
                }

            };
            //移除选择项目
            vm.removeProject=function(){
                vm.model.projectDto={};
            };
            //移除选择单位
            vm.removeShenPiUnit=function(){
                vm.model.shenPiUnitDto={};
            };
            vm.createShenpiUnit=function(){
                var b = projectSupervisedSvc.createShenpiItems(vm);
                if(b ==false){
                    return ;
                }
            };
        }
        function shenpiItemsUpdate(){
            vm.choiceProject=function(){
                $('.myDialog').modal({
                    backdrop: 'static',
                    keyboard:false
                });
            };
            vm.choiceShenPiUnit=function(){
                $('.myDialog1').modal({
                    backdrop: 'static',
                    keyboard:false
                });
            };
            projectSupervisedSvc.projectGrid(vm);
            projectSupervisedSvc.shenpiUnitGridSelect(vm);
            projectSupervisedSvc.getShenPiItemsById(vm);
            //提交选择项目  shenpiItems  detail.html
            vm.choiceProjectSubmit=function(){
                // debugger;
                var str=$('input:radio[name="radio"]:checked').val();
                if (str==""||str==null) {
					/*common.alert({
					 vm:vm,
					 msg:'请选择数据'
					 });*/
                } else {
                    var strs= []; //定义一数组
                    strs=str.split(","); //字符分割
                    vm.model.projectDto.id=strs[0];
                    vm.model.projectDto.projectName=strs[1];
                    $('.myDialog').modal('hide');
                }

            };
            vm.choiceShenPiUnitSubmit=function(){
                // debugger;
                var str=$('input:radio[name="radio1"]:checked').val();
                if (str==""||str==null) {
					/*common.alert({
					 vm:vm,
					 msg:'请选择数据'
					 });*/
                } else {
                    var strs= []; //定义一数组
                    strs=str.split(","); //字符分割
                    vm.model.shenPiUnitDto.id=strs[0];
                    vm.model.shenPiUnitDto.shenpiUnitName=strs[1];
                    $('.myDialog1').modal('hide');
                }

            };
            //移除选择项目
            vm.removeProject=function(){
                vm.model.projectDto={};
            };
            //移除选择单位
            vm.removeShenPiUnit=function(){
                vm.model.shenPiUnitDto={};
            };
            //提交更新
            vm.updateShenpiItems=function (){
                projectSupervisedSvc.updateShenpiItems(vm);
            };
        }
        function shenpiItemsList(){
            projectSupervisedSvc.shenpiItemsGrid(vm);
            // debugger;

            vm.searchShenPiItems=function(){
                // debugger;
                var filters = [];
                if(vm.search.shenpiName !=null && vm.search.shenpiName !=''){
                    filters.push({field:'shenpiName',operator:'contains',value:vm.search.shenpiName});
                }
                if(vm.search.projectName !=null && vm.search.projectName !=''){
                    filters.push({field:'projectName',operator:'contains',value:vm.search.projectName});
                }
                if(vm.search.shenpiUnitName !=null && vm.search.shenpiUnitName !=''){
                    filters.push({field:'shenpiUnitName',operator:'contains',value:vm.search.shenpiUnitName});
                }
                vm.gridOptions.dataSource.filter(filters);
            };
            vm.delShenPiItem = function (id) {
                common.confirm({
                    vm:vm,
                    title:"",
                    msg:"确认删除数据吗？",
                    fn:function () {
                        $('.confirmDialog').modal('hide');
                        projectSupervisedSvc.delShenPiItem(vm,id);
                    }
                });
            };
            vm.delShenPiItems = function () {
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
                    vm.delShenPiItem(idStr);
                }
            };
        }
        function shenpiUnitDetail(){
            vm.title = "审批单位详情";
            projectSupervisedSvc.getShenPiUnitById(vm);
        }
        function shenpiUnitCreate(){
            vm.title = "审批单位新增";
            vm.createMediationUnit=function(){
                projectSupervisedSvc.createShenpiUnit(vm);
            };
        }
        function shenpiUnitUpdate(){
            vm.title = "审批单位编辑";
            projectSupervisedSvc.getShenPiUnitById(vm);
            vm.updateShenpiUnit=function(){
                projectSupervisedSvc.updateShenpiUnit(vm);
            };
        }

        function shenpiUnitList(){
            projectSupervisedSvc.shenpiUnitGrid(vm);

            vm.searchShenPiUnit=function(){
                // debugger;
                var filters = [];
                if(vm.search.shenpiUnitName !=null && vm.search.shenpiUnitName !=''){//查询条件--项目名称
                    filters.push({field:'shenpiUnitName',operator:'contains',value:vm.search.shenpiUnitName});
                }
                if(vm.search.contacts !=null && vm.search.contacts !=''){//查询条件--项目名称
                    filters.push({field:'contacts',operator:'contains',value:vm.search.contacts});
                }
                vm.gridOptions.dataSource.filter(filters);

            };
            vm.delShenPiUnit = function (id) {
                common.confirm({
                    vm:vm,
                    title:"",
                    msg:"确认删除数据吗？",
                    fn:function () {
                        $('.confirmDialog').modal('hide');
                        projectSupervisedSvc.delShenPiUnit(vm,id);
                    }
                });
            };
            vm.delShenPiUnits = function () {
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
                    vm.delShenPiUnit(idStr);
                }
            };

        }
        function init_list(){
            if(vm.isZFInvestment){
                projectSupervisedSvc.grid(vm);

            }
            if(vm.isSHInvestment){
                projectSupervisedSvc.grid_SH(vm);
            }
            projectSupervisedSvc.grid(vm);
            projectSupervisedSvc.shenpiOverdueGrid(vm);
            //查询
            projectSupervisedSvc.statistical(vm);
            vm.projectItems=function(id){
                projectSupervisedSvc.projectItems(vm,id)};

            //统计xdf
            vm.search=function(){
                // debugger;
                var filters = [];
                filters.push({field:'isLatestVersion',operator:'eq',value:true});//默认条件--项目最新版本
                if(vm.isZFInvestment){
                    filters.push({field:'projectInvestmentType',operator:'eq',value:common.basicDataConfig().projectInvestmentType_ZF});//默认条件--政府投资项目
                    filters.push({field:'isIncludLibrary',operator:'eq',value:true});//默认条件--项目纳入项目库
                }
                if(vm.isSHInvestment){
                    filters.push({field:'projectInvestmentType',operator:'eq',value:common.basicDataConfig().projectInvestmentType_SH});//默认条件--政府投资项目
                }

                if(vm.search.projectName !=null && vm.search.projectName !=''){//查询条件--项目名称
                    filters.push({field:'projectName',operator:'contains',value:vm.search.projectName});
                }
                if(vm.search.projectStage !=null && vm.search.projectStage !=''){//查询条件--项目阶段
                    filters.push({field:'projectStage',operator:'eq',value:vm.search.projectStage});
                }
                // vm.basicData.investmentType=common.getBacicDataByIndectity(common.basicDataConfig().projectInvestmentType);//项目投资类型
                // vm.basicData.shenpiUnit = common.getBacicDataByIndectity(common.basicDataConfig().shenpiUnit);//审批单位
                debugger;
                if(vm.search.shenpiUnit !=null && vm.search.shenpiUnit !=''){//查询条件--审批事项
                    filters.push({field:'shenpiUnit',operator:'eq',value:vm.search.shenpiUnit});
                }

                if(vm.search.isMonthReport !=null && vm.search.isMonthReport !=''){
                    if(vm.search.isMonthReport == "true"){
                        filters.push({field:'isMonthReport',operator:'eq',value:true});
                    }else if(vm.search.isMonthReport == "false"){
                        filters.push({field:'isMonthReport',operator:'eq',value:false});
                    }
                }
                if(vm.search.unitName !=null && vm.search.unitName !=''){
                    filters.push({field:'unitName',operator:'eq',value:vm.search.unitName});
                }


                if(vm.isZFInvestment){
                    vm.gridOptions.dataSource.filter(filters);
                }else if(vm.isSHInvestment){
                    vm.gridOptions_SH.dataSource.filter(filters);
                }else{
                    vm.gridOptions.dataSource.filter(filters);
                }
            };

            //点击新增项目弹出模态框
            vm.addProject = function(){
                $("#myModal_add").modal({
                    backdrop: 'static',
                    keyboard:false
                });
            };
            //点击模态框确认按钮跳转不同的信息录入页面
            vm.confirmInvestmentType=function(){
                $(".modal-backdrop").remove();
                $location.path("/projectEdit//"+vm.model.projectInvestmentType);
            };
            vm.model.projectInvestmentType = common.basicDataConfig().projectInvestmentType_ZF;//默认为政府投资项目

            vm.isMonthReport=function(id,isMonthReport){
                vm.model.isMonthReport = isMonthReport;
                vm.model.id=id;
                //弹出模态框
                $("#myModal_edit").modal({
                    backdrop: 'static',
                    keyboard:false
                });
            };

            //更新项目是否填报状态
            vm.updateIsMonthReport = function(){
                projectSupervisedSvc.updateIsMonthReport(vm);
            };

            vm.del = function (id) {
                common.confirm({
                    vm:vm,
                    title:"",
                    msg:"确认删除数据吗？",
                    fn:function () {
                        $('.confirmDialog').modal('hide');
                        projectSupervisedSvc.deleteProject(vm,id);
                    }
                });
            };//del

            vm.dels = function(){
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
                    vm.del(idStr);
                }
            };//dels
        }//init_list

        function init_create(){
            vm.model.projectInvestmentType = vm.projectInvestmentType;//项目投资类型用于数据收集
            if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_ZF){//如果是政府投资
                //基础数据--项目分类
                vm.basicData.projectClassify=$linq(common.getBasicData())
                    .where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_ZF;})
                    .toArray();
                //基础数据--行业归口
                vm.basicData.projectIndustry=$linq(common.getBasicData())
                    .where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_ZF;})
                    .toArray();
                vm.isZFInvestment = true;
            }else if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){//如果是社会投资
                //基础数据--项目分类
                vm.basicData.projectClassify=$linq(common.getBasicData())
                    .where(function(x){return x.identity==common.basicDataConfig().projectClassify&&x.pId==common.basicDataConfig().projectClassify_SH;})
                    .toArray();
                //基础数据--行业归口
                vm.basicData.projectIndustry=$linq(common.getBasicData())
                    .where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==common.basicDataConfig().projectIndustry_SH;})
                    .toArray();

                vm.projectIndustryChange=function(){
                    vm.basicData.projectIndustryChildren=$linq(common.getBasicData())
                        .where(function(x){return x.identity==common.basicDataConfig().projectIndustry&&x.pId==vm.model.projectIndustryParent;})
                        .toArray();
                };
                vm.isSHInvestment = true;
            }
            //获取当前所有的用户单位信息
            projectSupervisedSvc.getUserUnits(vm);

            //获取项目类型， 多选
            vm.updateSelection = function(id){
                var index = vm.model.projectType.indexOf(id);
                if(index == -1){
                    vm.model.projectType.push(id);
                }else{
                    vm.model.projectType.splice(index,1);
                }
            };
            //end#基础数据

            //批复文件上传
            vm.uploadType=[['JYS','项目建议书批复'],['KXXYJBG','可行性研究报告批复'],['CBSJYGS','初步设计与概算批复']];
            //相关附件文件上传文件种类
            vm.relatedType=common.uploadFileTypeConfig().projectEdit;

            vm.uploadSuccess=function(e){
                var type=$(e.sender.element).parents('.uploadBox').attr('data-type');
                if(e.XMLHttpRequest.status==200){
                    var fileName=e.XMLHttpRequest.response;
                    $scope.$apply(function(){
                        if(vm.model.attachmentDtos){
                            vm.model.attachmentDtos.push({name:fileName.split('_')[2],url:fileName,type:type});
                        }else{
                            vm.model.attachmentDtos=[{name:fileName.split('_')[2],url:fileName,type:type}];
                        }
                    });
                }
            };

            //展示批复文件选择模态框
            vm.choseDocument = function(e){
                vm.pifuType=$(e.target).parents('.uploadBox').attr('data-type');
                $("#documentRecords").modal({
                    backdrop: 'static',
                    keyboard:false
                });
                vm.gridOptions_documentRecords.dataSource.read();//批复文件列表数据刷新
            };
            projectSupervisedSvc.documentRecordsGird(vm);//查询批复文件

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
                    vm.model['pifu'+vm.pifuType+'_wenhao'] = number;
                    if(vm.model.attachmentDtos){
                        vm.model.attachmentDtos.push({name:name,url:url,type:vm.pifuType});
                    }else{
                        vm.model.attachmentDtos=[{name:name,url:url,type:vm.pifuType}];
                    }
                }
            };

            //文件选择触发验证文件大小
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
                error:vm.uploadSuccess,
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
                error:vm.uploadSuccess,
                localization:{select:'上传文件'},
                showFileList:false,
                multiple:true,
                validation: {
                    maxFileSize: common.basicDataConfig().uploadSize
                },
                select:vm.onSelect
            };

            vm.delFile=function(idx){
                var file = vm.model.attachmentDtos[idx];
                if(file){//删除上传文件的同时删除批复文号
                    var pifuType = file.type;
                    vm.model['pifu'+pifuType+'_wenhao'] = "";
                    vm.model.attachmentDtos.splice(idx,1);
                }
            };
            //资金来源计算
            vm.capitalTotal=function(){
                return common.getSum([
                    vm.model.capitalSCZ_ggys||0,vm.model.capitalSCZ_gtzj||0,vm.model.capitalSCZ_zxzj||0,
                    vm.model.capitalQCZ_ggys||0,vm.model.capitalQCZ_gtzj||0,
                    vm.model.capitalSHTZ||0,vm.model.capitalZYYS||0,
                    vm.model.capitalOther||0]);
            };

            vm.create = function () {
                projectSupervisedSvc.createProject(vm);
            };
        }//init_create

        function init_update(){
            vm.title = "编辑项目";
            //获取项目信息
            projectSupervisedSvc.getProjectById(vm);
            //更新项目
            vm.update = function(){
                projectSupervisedSvc.updateProject(vm);
            };
        }//init_update

        function init_details(){
            projectSupervisedSvc.getProjectById(vm);

            if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_ZF){//如果是政府投资
                vm.isZFInvestment = true;
                //相关附件文件上传文件种类
                vm.relatedType=common.uploadFileTypeConfig().projectEdit;
            }else if(vm.projectInvestmentType==common.basicDataConfig().projectInvestmentType_SH){//如果是社会投资
                vm.isSHInvestment = true;
                //相关附件文件上传文件种类
                vm.relatedType=common.uploadFileTypeConfig().projectEdit_SH;
            }
            //相关附件文件上传文件种类
            vm.relatedType=common.uploadFileTypeConfig().projectEdit;
        }
    }
})();
