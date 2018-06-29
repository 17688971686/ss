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
        vm.show=true;
        vm.article=function(type){
        	if(!vm.model){
        		alert('内容加载中请稍后')
				return;
			}
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
                vm.submit('unit');
            }
        };
      
        activate();
        function activate() {
//        	indexSvc.getArticle(vm);
        	if(getExplorerInfo().type == "IE" ){
        		vm.isIE = true;
        	}
        	location.href="shenbaoAdmin";
// indexSvc.getSessionInfo(vm);
        	
        }
        
		function getExplorerInfo() {
			var explorer = window.navigator.userAgent.toLowerCase();
            var isIE = explorer.indexOf("compatible") > -1 && explorer.indexOf("msie") > -1; //判断是否IE<11浏览器
			var ver="";
			//ie
			if (isIE) {
				ver = explorer.match(/msie ([\d.]+)/)[1];
                var reIE = new RegExp("msie (\\d+\\.\\d+);");
                reIE.test(explorer);
                var fIEVersion = parseFloat(RegExp["$1"]);
                if(fIEVersion<9){
                    return {
                        type : "IE",
                        version : ver
                    };
                } else{
                	return{
                		type:"IEGT9",
						version:ver
					}
				}
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
			else{
				return{
					type:'Others',
					version:ver,
				}
			}
		}       
    }
})();
