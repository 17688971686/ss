angular.module('starter.interceptors',[])
.factory('AuthInterceptor', function($q) {
  return {
    // 可选，拦截成功的请求
    request: function(config) {
    	config.params = config.params||{};
    	config.params.callKey = '5DF50E30-B215-45BC-B361-776AE1D09994';
      	return config || $q.when(config);
    }
  };
});