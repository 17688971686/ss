(function () {
    'use strict';

    angular
        .module('app')
        .controller('indexCtrl', index);

    index.$inject = ['$location','indexSvc']; 

    function index($location , indexSvc) {
        /* jshint validthis:true */
        var vm = this;
        
        vm.article=function(type){
        	switch(type){
        		case 1:
        			vm.articles=vm.article_announcement;
        		break;
        		case 2:
        			vm.articles=vm.article_policy;
            	break;
        	}
        	$('.column .title li').removeClass('focus');
        	$('.article_'+type).addClass('focus');
        	
        }
        vm.submit=function(){
        	location.href="/admin/index";
        }
        
        /**
         * 查看项目详情
         * @param id 项目代码
         */
        vm.projectDetails = function(id){
        	//不同的申报阶段然后跳转不同的项目查看页面
        	location.href = "#/projectDetails/"+id;
        }
       
        activate();
        function activate() {
        	indexSvc.getDeclareProjects(vm);//获取申报的项目信息
        	indexSvc.getOprationRecords(vm);//获取操作记录的信息
        }
    }
})();
