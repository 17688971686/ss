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
        //检查浏览器及其版本
        getExplorerInfo();
		function getExplorerInfo() {
			var explorer = window.navigator.userAgent.toLowerCase();
			//ie 
			if (explorer.indexOf("msie") >= 0) {
				var ver = explorer.match(/msie ([\d.]+)/)[1];
				return {
					type : "IE",
					version : ver
				};
			}
			//firefox 
			else if (explorer.indexOf("firefox") >= 0) {
				var ver = explorer.match(/firefox\/([\d.]+)/)[1];
				return {
					type : "Firefox",
					version : ver
				};
			}
			//Chrome
			else if (explorer.indexOf("chrome") >= 0) {
				var ver = explorer.match(/chrome\/([\d.]+)/)[1];
				return {
					type : "Chrome",
					version : ver
				};
			}
			//Opera
			else if (explorer.indexOf("opera") >= 0) {
				var ver = explorer.match(/opera.([\d.]+)/)[1];
				return {
					type : "Opera",
					version : ver
				};
			}
			//Safari
			else if (explorer.indexOf("Safari") >= 0) {
				var ver = explorer.match(/version\/([\d.]+)/)[1];
				return {
					type : "Safari",
					version : ver
				};
			}

		}
		//判断IE浏览器版本
    	if(getExplorerInfo().type=="IE" && getExplorerInfo().version<10 ){
    		//$location.path(url_back);
    		vm.isIE = true;
    	}
        
    }
})();
