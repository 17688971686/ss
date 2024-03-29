(function () {
    'use strict';

    angular
        .module('app')
        .controller('indexLoginCtrl', indexLogin);

    indexLogin.$inject = ['$location','indexLoginSvc']; 

    function indexLogin($location, indexLoginSvc) {
        /* jshint validthis:true */
        var vm = this;
        vm.type='tzgg';
        vm.show=true;
        vm.checked = false;
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
        	indexLoginSvc.submit(vm,str);
        };
        vm.keyEnter = function (e) {
            if (e.which === 13) {
                vm.submit('unit');
            }
        };
      
        vm.change = function(){
        	 vm.checked = ! vm.checked;
        }
        activate();
        function activate() {
        	indexLoginSvc.getArticle(vm);
        	if(getExplorerInfo().type == "IE" ){
        		vm.isIE = true;
        	}
        	
        	indexLoginSvc.getSessionInfo(vm);
        	
        }
        
		function getExplorerInfo() {
			var explorer = window.navigator.userAgent.toLowerCase();
			var ver="";
			//ie 
			if (explorer.indexOf("msie") >= 0) {
				 ver = explorer.match(/msie ([\d.]+)/)[1];
				return {
					type : "IE",
					version : ver
				};
			}
			//firefox 
			else if (explorer.indexOf("firefox") >= 0) {
				 ver = explorer.match(/firefox\/([\d.]+)/)[1];
				return {
					type : "Firefox",
					version : ver
				};
			}
			//Chrome
			else if (explorer.indexOf("chrome") >= 0) {
				 ver = explorer.match(/chrome\/([\d.]+)/)[1];
				return {
					type : "Chrome",
					version : ver
				};
			}
			//Opera
			else if (explorer.indexOf("opera") >= 0) {
				 ver = explorer.match(/opera.([\d.]+)/)[1];
				return {
					type : "Opera",
					version : ver
				};
			}
			//Safari
			else if (explorer.indexOf("Safari") >= 0) {
				 ver = explorer.match(/version\/([\d.]+)/)[1];
				return {
					type : "Safari",
					version : ver
				};
			}

		}       
    }
})();
