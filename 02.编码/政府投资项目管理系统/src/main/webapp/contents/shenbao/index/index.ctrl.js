(function () {
    'use strict';

    angular
        .module('app')
        .controller('indexCtrl', index);

    index.$inject = ['$location','indexSvc']; 

    function index($location, indexSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.type='tzgg';
        
        vm.article=function(type){
        	switch(type){
        		case 1:
        			vm.articles=vm.model.article_tzgg;
        			vm.type='tzgg';
        		break;
        		case 2:
        			vm.articles=vm.model.article_zcfg;
        			vm.type='zcfg';
            	break;
        		case 3:
        			vm.articles=vm.model.article_bszn;
        			vm.type='bszn';
        		break;
        		case 4:
        			vm.articles=vm.model.article_cybg;
        			vm.type='cybg';
        	}
        	$('.column .title li').removeClass('focus');
        	$('.article_'+type).addClass('focus');
        	
        };
        vm.formatDate = function(datStr){
        	return common.formatDate(datStr);
        };
        vm.submit=function(str){
        	indexSvc.submit(vm,str);
        };
        vm.keyEnter = function (e) {
            if (e.which === 13) {
                vm.submit();
            }
        };
       
        activate();
        function activate() {
        	indexSvc.getArticle(vm);        	
        }
    }
})();
