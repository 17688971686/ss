/**
 *************************************************
 ******      JS工具类，定义常用的方法           ******
 *************************************************
 */
(function (window) {
    'use strict';

    var util = {
        loginUrl: formatUrl("login"),
        initJqValidation: initJqValidation,
        /**
         *请求加上ContextPath
         *
         */
        formatUrl: formatUrl,
        checkLength:checkLength,
        /**
         * 字符串格式，第一个参数为需要格式的字符串，以一对花括号和数字{0}获取后面的参数，第二个参数开始为字符串提供格式的数据
         * 如：util.format("{0} {1} !", "Hello", "World");  浏览器的控制台的输出结果为Hello World !
         * @returns {*}
         */
        format: function () {
            var str = arguments[0] || "", _d;
            if (!str) return false;
            var data = Array.prototype.slice.call(arguments, 1);
            if (data.length == 1 && (angular.isObject(data[0]) || angular.isArray(data[0]))) {
                data = data[0];
            }
            return str.replace(
                /\{(\w+)(:[^\}]+)?(\.[^\}]+)?\}/g,
                function (m, i, f) {
                    _d = data[i];
                    if (typeof _d == "undefined" || _d == null) {
                        return "";
                    } else if (angular.isDate(_d)) {
                        return _d.format(f.substr(1));
                    } else if (angular.isObject(_d) || angular.isArray(_d)) {
                        return JSON.stringify(_d);
                    } else {
                        if (f && f.length > 1) {
                            _d = new Date(_d).format(f.substr(1));
                        }
                        return _d;
                    }
                });
        },
        /**
         * 根据表单根据odata格式数据   TODO 还需要处理or
         * @param from
         * @param filters
         * @returns {string|object}
         */
        buildOdataFilter: buildOdataFilter,
        getTableOption: getTableOption,
        getTableFilterOption: getTableFilterOption,
        getTableFixedOption:getTableFixedOption,
        /**
         * 高频执行事件/方法的防抖
         * @param func      延时调用函数
         * @param wait      延迟多长时间
         * @param immediate 是否立刻执行
         * @returns {Function}
         */
        debounce: function (func, wait, immediate) {
            var timeout, result;

            var debounced = function () {
                var context = this;
                var args = arguments;

                if (timeout) clearTimeout(timeout);
                if (immediate) {
                    // 如果已经执行过，不再执行
                    var callNow = !timeout;
                    timeout = setTimeout(function () {
                        timeout = null;
                    }, wait)
                    if (callNow) result = func.apply(context, args)
                }
                else {
                    timeout = setTimeout(function () {
                        result = func.apply(context, args)
                    }, wait);
                }
                return result;
            };

            debounced.cancel = function () {
                clearTimeout(timeout);
                timeout = null;
            };

            return debounced;
        },
        UUID: function () {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
            });
            return uuid;
        }
    };

    window.util = util;

    function initJqValidation(selector) {
        selector = selector || "form";
        $(selector).removeData("validator").removeData("unobtrusiveValidation");
        $.validator.unobtrusive.parse(selector);
    }

    function formatUrl(url) {
        if (typeof contextPath == "undefined") {
            return url;
        }
        return contextPath + '/' + url;
    }

    function checkLength(obj,max,id){
    	if(obj){
    		var length = obj.length;
    		if(length>max){
    			$("#"+id).html("<font size='5'>"+0+"</font>");
    		}else if(length<=max){
    			$("#"+id).html("<font size='5'>"+(max-length)+"</font>");
    		}
    	}else{
    		$("#"+id).html("<font size='5'>"+max+"</font>");
    	}
    }

    // 封装bs table的默认值
    var tableDefaultOption = {
            sidePagination: "server",
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            striped: true,						//是否显示行间隔色
            pagination: true,					//是否显示分页（*）
            pageNumber:1,                       //初始化加载第一页，默认第一页
            pageSize: 10,						//每页的记录行数（*）
            pageList: [5, 10, 25, 50],		//可供选择的每页的行数（*）
            showColumns: true,					//是否显示所有的列
            showRefresh: true,					//是否显示刷新按钮
        	minimumCountColumns: 2,				//最少允许的列数
            clickToSelect: false,                //是否启用点击选中行
            maintainSelected: true,
            totalField: "count",            // 修改bs table默认统计字段
            dataField: "value",             // 修改bs table默认数据字段
            defaultSort: "createdDate desc",
            defaultFilters: null,
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列
            showToggle:false,                    //是否显示详细视图和列表视图的切换按钮
            cardView: false,   		            //是否显示详细视图
            detailView: false,                  //是否显示父子表

    };

    function buildOdataFilter(from, defaultFilters) {
        var filters = [];

        if(defaultFilters){//拼接默认filter
            if (angular.isArray(defaultFilters)) {
                filters = filters.concat(defaultFilters);
            }else {
                filters.push(defaultFilters)
            }
        }

        function push(name, operator, val) {
            var names = name.split("|");
            if (names.length > 1) {
                var orLogic = [];
                for (var n in names) {
                    orLogic.push({
                        field: names[n],
                        operator: operator,
                        value: val
                    });
                }
                filters.push({
                    logic: "or",
                    filters: orLogic
                });
            } else {
                filters.push({
                    field: name,
                    operator: operator,
                    value: val
                });
            }
        }

        $(from).find('input,select,textarea').each(function (index, obj) {
            var $me = $(this), val = obj.value, name = obj.name, operator;
            if (!name || !val || obj.type=='checkbox') return;
            if (name.indexOf("filter_") == 0) {
                var tmp = name.split("_");
                if (tmp.length == 3) {
                    operator = tmp[1];
                    name = tmp[2] || "";
                } else if (tmp.length == 2) {
                    operator = "like";
                    name = tmp[1] || "";
                } else {
                    return;
                }
            } else if (val) {
                operator = $me.attr("operator") || "eq";
            }

            var type = obj.getAttribute('data-type')||obj.type;
            switch (type){
                case 'int': ;
                case 'number': val = parseInt(val);break;
                case 'boolean': val = val === 'true';break;
                case 'range': operator = 'range';break;
                case 'date': ;
                case 'time': ;
                case 'datetime':
                    val = new Date(val.length<16?(val+' 00:00:00'): val);
                    break;
                default: ;
            }

            if(operator === 'range'){//值域筛选
                if(val.indexOf(',')!=-1){
                    val = val.split(',');
                    if(val[0] || val[0]===0 ){
                        push(name, 'gte', val[0]);
                    }
                    if(val[1] || val[1]===0 ){
                        push(name, 'lt', val[1]);
                    }
                }else {
                    push(name, 'eq', val);
                }
            }else {
                push(name, operator, val);
            }
        });

        return filters.length == 0 ? "" : $.toOdataFilter({
            logic: "and",
            filters: filters
        });
    }

    /**
     * 获取bs table的配置项（默认封装，带分页）
     * @param option    自定义配置项
     */
    function getTableOption(option) {
        option = option || {};
        return $.extend({}, tableDefaultOption, {
            queryParams: function (params) {
                var me = this,
                    _params = {
                        "$skip": params.offset,
                        "$top": params.limit,
                        "$orderby": !params.sort ? me.defaultSort : (params.sort + " " + params.order),
                        "$filter": buildOdataFilter(me.toolbar || "#filter", me.defaultFilters)
                    };
                if (me.pagination) {
                    _params["$inlinecount"] = "allpages";
                }
                return _params;
            }
        }, option);
    }

    function getTableFilterOption(option) {
        option = option || {};
        return $.extend({}, tableDefaultOption, {
            filterControl: true,
            filterShowClear: true
        }, option);
    }
    function getTableFixedOption(option) {
        option = option || {};
        return $.extend({}, tableDefaultOption, {
            rightFixedColumns:true,
            rightFixedNumber:1,
            queryParams: function (params) {
                var me = this,
                    _params = {
                        "$skip": params.offset,
                        "$top": params.limit,
                        "$orderby": !params.sort ? me.defaultSort : (params.sort + " " + params.order),
                        "$filter": buildOdataFilter(me.toolbar || "#filter", me.defaultFilters)
                    };
                if (me.pagination) {
                    _params["$inlinecount"] = "allpages";
                }
                return _params;
            },
        }, option);
    }

    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).format("yyyy-MM-dd HH:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).format("yyyy-M-d H:m:s.S")      ==> 2006-7-2 8:9:4.18
    if (!Date.prototype.format) {
        Date.prototype.format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "H+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }
    }

})(window);