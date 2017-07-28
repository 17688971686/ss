(function () {
    'use strict';

    angular
        .module('app')
        .controller('basicDataCtrl', basicData);

    basicData.$inject = ['$location','basicDataSvc','$state','$scope']; 

    function basicData($location, basicDataSvc,$state,$scope) {
        /* jshint validthis:true */
    	var vm = this;
        vm.init=function(){  
        	vm.model={};
        	init_ztree();      	
        };//end init
        
        function init_ztree(){
        	var basicData=common.getBasicData();
        	var zTreeObj;
			var setting = {
					view:{
						nameIsHTML:true,
						addHoverDom: function(treeId, treeNode){
							if(treeNode.level != 0 && treeNode.canEdit){//新增按钮最高级没有,不可编辑也没有
								//添加新增按钮
								var sObj = $("#" + treeNode.tId + "_span");
								if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
								var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
								+ "' title='添加子节点' onfocus='this.blur();'></span>";
								sObj.after(addStr);
								var btn = $("#addBtn_"+treeNode.tId);
								//监听新增按钮
								if (btn) btn.bind("click", function(){
									window.global_basicData = null;
									basicData=common.getBasicData();
									
									var zTree = $.fn.zTree.getZTreeObj("zTree");
									//新增按钮触发时新节点的设置
									//获取父节点下的所有子节点的id的尾数的最大值
									var childIds = $linq(basicData)
									.where(function(x){return x.pId==treeNode.id;})
									.select(function(x){return {id:x.id};})
									.toArray();	
									var oldId, newId,oldIdSplit;
									if(childIds.length>0){//有子级代表新点击对象为父级新增										
										var idNum = [];
										var index = 0;
										for(var i=0;i<childIds.length;i++){
											var id = childIds[i].id;
											var idSplit = id.split("_");
											idNum[index+i] = parseInt(idSplit[idSplit.length-1],10);//获取所有子级id最后的一组数字									
										}
										//设置新增子级id的数值 数组中的最大值+1
										//获取数组中的最大值
										var idNumMax = Math.max.apply(null, idNum);
										//替换掉最后的数值
										 oldId = childIds[0].id;
										 oldIdSplit = oldId.split("_");
										 oldIdSplit[oldIdSplit.length-1] = idNumMax+1;//将最后的一个元素的值变更为最大值+1
										 newId = oldIdSplit.join("_");
									}else{//代表点击对象为子级新增按钮										
										 oldId = treeNode.id;
										 newId = oldId+"_1";
									}									
									var newnode={id:newId,name:"请编辑命名",identity:treeNode.identity,pId:treeNode.id,canEdit:true};
									zTree.addNodes(treeNode,newnode);
									//将新增的数据存放到数据库
									vm.model.id=newnode.id;
									vm.model.description=newnode.name;
									vm.model.identity=newnode.identity;
									vm.model.pId=newnode.pId;
									vm.model.canEdit = newnode.canEdit;
									basicDataSvc.createBasicData(vm);		
								});
							}
						},
						removeHoverDom: function(treeId, treeNode){
							$("#addBtn_"+treeNode.tId).unbind().remove(); 
						},
						showIcon: true,
						selectedMulti: true
						},
					edit:{
						enable: true,
						showRenameBtn: function(treeId, treeNode){//最高一级没有编辑按钮,不可编辑也没有
							if(treeNode.level == 0 || !treeNode.canEdit) return false;
							else return true;
						},
						showRemoveBtn: function(treeId, treeNode){//只有最子级才有删除按钮,不可编辑也没有
							if(treeNode.isParent || !treeNode.canEdit) return false;
							else return true;	 											              							
						},
						removeTitle : "删除",
						renameTitle : "编辑"
					},	
					callback:{
						onRename: function(e,treeId,treeNode){
							vm.model.id=treeNode.id;
							vm.model.description=treeNode.name;
							vm.model.identity=treeNode.identity;
							vm.model.pId=treeNode.pId;
							basicDataSvc.updateBasicData(vm);
						},
						onRemove: function(e,treeId, treeNode){							
							basicDataSvc.deleteBasicData(vm,treeNode.id);				                				        
						}
					}									
			};
			 
			
						
			var findChildren=function(pId){
				return $linq(basicData)
				.where(function(x){return x.pId==pId;})
				.select(function(x){return {id:x.id,name:x.description,pId:x.pId,identity:x.identity,canEdit:x.canEdit,children:findChildren(x.id)};})
				.toArray();
			};
			
			var zNodes = $linq(basicData)
				.where(function(x){return x.pId=="";})
				.select(
					function(x) {
						return {
							id : x.id,
							name :common.format('{0}{1}',x.description,x.canEdit?'':'<span style="color:red">[不可编辑]</span>'),
							pId:x.pId,
							canEdit:x.canEdit,
							identity:x.identity,
							children:findChildren(x.id)
						};
					}).toArray();
			
			var rootNode = {
					id : '',
					name : '基础数据',
					children : zNodes
				};
			
			zTreeObj = $.fn.zTree.init($("#zTree"), setting,rootNode);					
        }
        
  
        
        activate();
        function activate() {
        	vm.init();
        }
    }
})();
