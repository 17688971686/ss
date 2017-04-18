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
        		case 3:
        			vm.articles=vm.article_workGuide;
        		break;
        		case 4:
        			vm.articles=vm.article_form;
        	}
        	$('.column .title li').removeClass('focus');
        	$('.article_'+type).addClass('focus');
        	
        }
        vm.submit=function(){
        	location.href="/admin";
        }
        vm.forgetCode = function(){
        	location.href = "/contents/home/index/html/forgetCode.html";
        }
       
        activate();
        function activate() {
        	indexSvc.getArticle(vm,'announcement');
        	indexSvc.getArticle(vm,'policy');
        	indexSvc.getArticle(vm,'workGuide');
        	indexSvc.getArticle(vm,'form');
        }
    }
})();
