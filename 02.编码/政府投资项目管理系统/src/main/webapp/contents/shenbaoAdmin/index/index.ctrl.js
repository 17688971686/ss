(function () {
    'use strict';

    angular
        .module('app')
        .controller('indexCtrl', index);

    index.$inject = ['$location','indexSvc']; 

    function index($location , indexSvc) {
        /* jshint validthis:true */
        var vm = this;        
       
       
        activate();
        function activate() {
        	
        }
    }
})();
