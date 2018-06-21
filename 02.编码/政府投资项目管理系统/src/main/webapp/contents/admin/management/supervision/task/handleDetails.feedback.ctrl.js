(function () {
    'use strict';

    angular
        .module('appSupervision')
        .controller('handleDetailsFeedbackCtrl', handleDetailsFeedback);

    handleDetailsFeedback.$inject = ['$location','handleDetailsFeedbackSvc','$state','$scope']; 

    function handleDetailsFeedback($location,handleDetailsFeedbackSvc,$state,$scope) {
    	var vm = this;
    	vm.shenbaoInfoId=$state.params.shenbaoInfoId;
    	vm.projectId=$state.params.projectId;
    	vm.processInstanceId=$state.params.processInstanceId;
    	vm.attachmentDtos = [];
    	vm.projectInfo = {};
      	
        //审批的附件类型
		vm.approvalAttsType = common.uploadFileTypeConfig().approvalAttsType;
		
		handleDetailsFeedbackSvc.getApprovalAtts(vm,vm.projectId);
		
		//查询当前流程中反馈的所有记录
		handleDetailsFeedbackSvc.getFeedbackComments(vm,vm.processInstanceId);
		
		//查询申报附件
		handleDetailsFeedbackSvc.getShenBaoAtts(vm,vm.shenbaoInfoId);
    }
})();
