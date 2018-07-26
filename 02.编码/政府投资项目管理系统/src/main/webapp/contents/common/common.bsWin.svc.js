/**
 * 自定义弹窗窗口（在对应的方法中注入bsWin对象）
 * 提示窗口使用方法：
 *  bsWin.alert("消息提示", "操作成功！", function () { console.log("This's close!"); } );
 * 或者
 *  bsWin.alert({
 *      title: "消息提示",
 *      message: "操作成功！",
 *      onClose: function () { console.log("This's close!"); }
 *  });
 * 询问窗口使用方法：
 *  bsWin.confirm("询问提示", "是否进行该操作！", function () { console.log("This's ok!"); }, function () { console.log("This's close!"); } );
 * 或者
 *  bsWin.confirm({
 *      title: "询问提示",
 *      message: "是否进行该操作！",
 *      onOk: function () { console.log("This's ok!"); },
 *      onClose: function () { console.log("This's close!"); }
 *  });
 */
(function () {
    'use strict';

    var app = angular.module('app'),
        alertTplPath = "template/dialog/alert.html",
        confirmTplPath = "template/dialog/confirm.html",
        reloginTplPath = "template/dialog/relogin.html";

    app.factory('bsWin', ["$rootScope", "$injector", "$templateCache", "bsWinConfig",
        function ($rootScope, $injector, $templateCache, bsWinConfig) {
            var index = 0, reloginWin = false;

            return {
                success: function (message, onClose) {
                    return this.alert({
                        message: message,
                        type: "success",
                        onClose: onClose
                    });
                },
                warning: function (message, onClose) {
                    return this.alert({
                        message: message,
                        type: "warning",
                        onClose: onClose
                    });
                },
                error: function (message, onClose) {
                    return this.alert({
                        message: message,
                        type: "error",
                        onClose: onClose
                    });
                },
                alert: function (options, message, onClose) {
                    if (!angular.isObject(options)) {
                        var title;
                        if (!message || angular.isFunction(message)) {
                            onClose = message;
                            message = options;
                        } else {
                            title = options;
                        }

                        options = {
                            message: message,
                            onClose: onClose || function () {
                            }
                        };
                        if (title) {
                            options.title = title;
                        }
                    }
                    options.templateUrl = alertTplPath;
                    return initWin(options);
                },
                confirm: function (options, message, onOk, onClose) {
                    if (!angular.isObject(options)) {
                        var title;
                        if (!message || angular.isFunction(message)) {
                            onClose = onOk || function () {
                            };
                            onOk = message || function () {
                            };
                            message = options;
                        } else {
                            title = options;
                        }

                        options = {
                            message: message,
                            onOk: onOk,
                            onClose: onClose
                        };
                        if (title) {
                            options.title = title;
                        }
                    }
                    options.templateUrl = confirmTplPath;
                    return initWin(options);
                }
            };

            function initWin(opt) {
                if (opt.msg) {
                    opt.message = opt.msg;
                }
                var options = angular.extend({}, bsWinConfig, opt);

                var newWin = {
                    winId: index++,
                    scope: $rootScope.$new()
                };

                createScope(newWin, options);

                if (options.onOk) {
                    newWin.scope.ok = function () {
                        if (options.onOk && options.onOk.apply(newWin) == false) {
                            return false;
                        }
                        newWin.el.modal("hide");
                    }
                }

                newWin.el = createWinEl(newWin.scope, options.templateUrl)
                    .on('hidden.bs.modal', function (e) {
                        if (options.onClose && options.onClose.apply(newWin, e) == false) {
                            return false;
                        }
                        destroy(newWin);
                    }).modal('show');  // 打开
                return newWin;
            }

            function createScope(win, options) {
                // console.log("bsWin createScope", options);
                win.scope.title = options.title;
                win.scope.message = options.message;

                win.scope.winId = win.winId;
                win.scope.type = options.type;
                win.scope.extraData = options.extraData;

                win.scope.options = {
                    onClose: options.onClose
                };
            }

            function createWinEl(scope, tpl) {
                // debugger;
                var $compile = $injector.get("$compile"),
                    elHtml = $compile($templateCache.get(tpl))(scope);
                return $(elHtml).appendTo("body");
            }

            /**
             * 销毁窗口
             * @param el
             */
            function destroy(win) {
                // console.log("bsWin destroy", win);
                win.scope.$destroy();
                win.el.unbind();
                win.el.remove();
                win.el = null;
                win = null;
            }

        }]);


    /**
     * 窗口默认配置
     */
    app.constant('bsWinConfig', {
        title: "提示窗口",
        message: "",
        type: "info",
        timeout: 0,
        templateUrl: alertTplPath,
        onOk: null,
        onClose: function (e) {
        }
    });

    app.run(["$templateCache", function ($templateCache) {
        // 提示窗口模板
        $templateCache.put(alertTplPath,
            '<div class="alertDialog modal fade" tabindex="-1" role="dialog" style="z-index: {{10000 + winId}};">\
                <div class="modal-dialog" role="document" style="margin:80px auto;width:80%;max-width:400px;">\
                    <div class="modal-content">\
                        <div class="modal-header bg-primary" style="height:30px;padding:5px;">\
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                            <h4 class="modal-title text-info">{{title || \'消息提醒\'}}</h4>\
                        </div>\
                        <div class="modal-body text-danger">\
                            <p class="alertDialogMessage">{{message}}</p>\
                        </div>\
                        <div class="modal-footer">\
                            <button type="button"  class="btn btn-btn-default btn-sm" data-dismiss="modal">关闭</button>\
                        </div>\
                    </div>\
                </div>\
            </div>');

        // 询问窗口模板
        $templateCache.put(confirmTplPath,
            '<div class="confirmDialog modal fade" tabindex="-1" role="dialog" style="z-index: {{10000 + winId}};">\
                <div class="modal-dialog" role="document" style="margin:80px auto;width:80%;max-width:400px;">\
                    <div class="modal-content">\
                        <div class="modal-header bg-primary" style="height:30px;padding:5px;">\
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\
                            <h4 class="modal-title text-info">{{title||\'提示\'}}</h4>\
                        </div>\
                        <div class="modal-body text-primary"><p><i class="fa fa-question-circle" aria-hidden="true"></i> {{message}}</p></div>\
                        <div class="modal-footer">\
                            <button type="button" ng-click="ok()" class="btn btn-success btn-sm" >确认</button>\
                            <button type="button"  class="btn btn-default btn-sm" data-dismiss="modal">取消</button>\
                        </div>\
                    </div>\
                </div>\
            </div>');

    }]);
})();