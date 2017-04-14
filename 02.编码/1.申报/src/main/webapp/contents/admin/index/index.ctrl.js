(function () {
    'use strict';

    angular
        .module('app')
        .controller('indexCtrl', index);

    index.$inject = ['$location','indexSvc']; 

    function index($location, indexSvc) {
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
       
        activate();
        function activate() {
        	indexSvc.getArticle(vm,'announcement');
        	indexSvc.getArticle(vm,'policy');
        }
    }
})();
