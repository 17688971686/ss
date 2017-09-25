angular.module('starter.controllers', ["chart.js", "ngCordova"])

    .controller('WelcomeCtrl', function ($scope) { })

    .controller('LoginCtrl', function ($scope, $rootScope, $ionicModal, $ionicLoading, Account, APP_EVENTS) {
        $scope.loginData = {};
        $scope.loginFailed = false;

        $scope.doLogin = function () {
            $ionicLoading.show();
            Account.login($scope.loginData.loginName, $scope.loginData.password).then(function (data) {

                $ionicLoading.hide();
                if (data.isSuccess) {
                    $rootScope.user = data.user;
                    $rootScope.$broadcast(APP_EVENTS.loggedIn);
                } else {
                    $scope.loginFailed = true;
                }
            })
        }
    })

    .controller('PlanningCtrl', function ($scope, $rootScope, Account,Planning) {

        //登陆验证
        Account.isLogin().then(function (data) {
            Account.loggedUser();
            if (!data) {
                $rootScope.showLoginView();
            };
        });
        
       Planning.findAll().then(function(data){
       		$scope.yearPlannings = data;
       		
       });
        
    })
	.controller('PlanningDetailCtrl', function ($scope, $rootScope, $stateParams,$ionicLoading,Account,Planning) {	 
		$scope.planningId = $stateParams.id;
		$ionicLoading.show();
	       Planning.findById($scope.planningId).then(function(res){
	       		$ionicLoading.hide();
	       		$scope.yearPlanning = res;	       		
	       });
	        
	})
	//年度计划项目
	.controller('PlanningProjectsCtrl', function ($scope, $rootScope, $stateParams,$ionicLoading,Planning) {	 
		$scope.planningId = $stateParams.id;
        Planning.findProjectsById($scope.planningId).then(function(projects){
       		$scope.projects = projects;      		
       });
	        
	})
    .controller('PlanningSlideboxCtrl', function ($scope, $rootScope, $state, $ionicSlideBoxDelegate, $ionicSideMenuDelegate) {

        $ionicSlideBoxDelegate.start();

        $scope.titles = [
            "2016年计划编制",
            "编制原则",
            "投资规模和资金来源",
            "投资结构-项目类别",
            "投资结构-项目单位",
            "投资结构-项目区域",
            "投资结构-项目领域",
            "重点领域、项目计划安排情况",
            "重点领域、项目计划安排情况",
            "关于计划编制工作的几点说明",
            "下一步工作建议",
            "下一步工作建议"
        ];

        $scope.slideIndex = 0;
        $scope.title = $scope.titles[$scope.slideIndex];

        if (ionic.Platform.isIOS()) {
            $rootScope.prevIcon = 'ion-ios-arrow-thin-left';
            $rootScope.nextIcon = 'ion-ios-arrow-thin-right';
        } else if (ionic.Platform.isAndroid()) {
            $rootScope.prevIcon = 'ion-android-arrow-back';
            $rootScope.nextIcon = 'ion-android-arrow-forward';
        } else {
            $rootScope.prevIcon = 'ion-ios-arrow-back';
            $rootScope.nextIcon = 'ion-ios-arrow-forward';
        }

        $scope.endSlide = function () {
            $ionicSlideBoxDelegate.slide(0);
            $state.go('tab.planning');
        };
        $scope.next = function () {
            $ionicSlideBoxDelegate.next();
        };
        $scope.previous = function () {
            $ionicSlideBoxDelegate.previous();
        };

        $scope.slideTo = function (index) {
            $ionicSlideBoxDelegate.slide(index);
            $ionicSideMenuDelegate.toggleLeft(false);
        };

        $scope.slideChanged = function (index) {
            $scope.slideIndex = index;
            $scope.title = $scope.titles[$scope.slideIndex];
        };

        $scope.toggleLeft = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };

        $scope.labels1 = ['2015', '2016'];
        $scope.series1 = ['年度投资总规模'];
        $scope.data1 = [
            [44, 84.7]
        ];
        $scope.colours1 = [{
            fillColor: '#7030e4',
            //strokeColor: 'rgba(47, 132, 71, 0.8)',
            highlightFill: '#9266e2',
            highlightStroke: '#9266e2'
        }];
        $scope.options1 = {
            scaleFontSize: 10
        };

        $scope.labels2 = ["合计", "新区综合办", "新区纪检监察局（审计局）"];
        $scope.data2 = [300, 500, 100];
        $scope.colours2 = ["#6330e4", "#a730e4", "#ec2cb4"];
        $scope.labels2 = ["合计 ", "新区综合办", "新区纪检监察局（审计局）"];
        $scope.options2 = {};

        $scope.labels3 = ["合计 ", "新区综合办", "新区纪检监察局（审计局）", "新区发展和财政局", "新区经济服务局", "新区社会建设局", "新区公共事业局", '市规划国土委龙华管理局', '市交委龙华交通运输局', '深圳市公安消防支队龙华新区大队', '深圳市公安消防支队特勤大队民治中队', '观湖办事处', '民治办事处', '龙华办事处', '大浪办事处', '福城办事处', '观澜办事处', '各有关单位（专项资金）'];
        $scope.data3 = [
            [280000, 20000, 20000, 20000, 30000, 20000, 45000, 125000, 25000, 10000, 45000, 10000, 20000, 30000, 10000, 155000, 30000, 20000, 40000, 40000, 35000, 45000, 35000, 38000, 95000]
        ];
        $scope.colours3 = [{
            fillColor: '#e6efff',
            strokeColor: '#73a8ff',
            //highlightFill: 'rgba(47, 132, 71, 0.8)',
            pointColor: '#ec2cb4',
            pointStrokeColor: '#ec2cb4',
            //shighlightStroke: 'rgba(47, 132, 71, 0.8)'
        }];
        $scope.series3 = ['2016年资金安排（万元）'];
        //pointHitDetectionRadius 设置小一些，解决一次选中三个点的bug
        $scope.options3 = {
            scaleFontSize: 10,
            pointDotRadius: 2,
            pointHitDetectionRadius: 5
        };

        $scope.labels4 = ["观湖辖区", "民治辖区", "龙华辖区", '大浪辖区', '福城辖区', '观澜辖区', '跨区域'];
        $scope.data4 = [10.56, 9.50, 9.97, 10.10, 8.24, 7.99, 43.64];
        $scope.colours4 = ["#a730e4", "#ec2cb4", "#ec2c2c", "#30c4e4", "#3070e4", "#3034e4", "#6330e4"];

        $scope.labels5 = ['道路交通', '环境保护及地质灾害治理、水利设施、水治理', '环境提升、改善', '教育', '医疗卫生', '文化、体育设施', '科技及产业配套', '社会公共安全', '城市建设', '党政机关', '专项资金、项目预留金'];
        $scope.series5 = ['预计安排'];
        $scope.data5 = [
            [130, 59, 80, 81, 56, 55, 40, 90, 80, 112, 150]
        ];
        $scope.colours5 = [{
            fillColor: '#3074e4',
            //strokeColor: 'rgba(47, 132, 71, 0.8)',
            highlightFill: '#6b92d3',
            // highlightStroke: 'rgba(47, 132, 71, 0.8)'
        }];
        $scope.options5 = {
            scaleFontSize: 10
        };
    })

    .controller('ChatsCtrl', function ($scope, $rootScope, Account) {

        //登陆验证
        Account.isLogin().then(function (data) {
            if (!data) {
                $rootScope.showLoginView();
            };
        });
    })

    .controller('StatisticAnalysis', function ($scope, $ionicActionSheet, ChartData, $ionicLoading) {
        $scope.selectedYear = '2016';
        $scope.PhaseTotaldata = [0, 0, 0]; //饼状总投资
        $scope.PhaseTotallabels = ["A类", "B类", "C类"]; //饼状总投资lable

        $scope.PhaseArrangelabels = ["A类", "B类", "C类"]; //饼状安排资金
        $scope.PhaseArrangedata = [0, 0, 0]; //饼状安排资金 lable
        $scope.PhaseArrangecolour = ["#99b958", "#4e80bb", "#bd4e4c"];

        var TotalPie = []; //树状图总投资
        var TotalPieLables = []; //树状图总投资 lable

        var ArrangePie = []; //树状图安排资金
        var ArrangeMoneyLable = []; //树状图安排资金lable

        //初始化加载图表  
        $ionicLoading.show();

        //2016年总投资-按阶段分
        ChartData.TotalHisData($scope.selectedYear).then(function (data) {
            $scope.PhaseTotaldata = [];
            $scope.PhaseTotallabels = [];
            for (var i = 0; i < data.length; i++) {
                $scope.PhaseTotallabels.push(data[i].DimensionName);
                $scope.PhaseTotaldata.push(data[i].InvestmentMoney);
                $ionicLoading.hide();
            }
        })
        $scope.PhaseTotalcolour = ["#99b958", "#4e80bb", "#bd4e4c"];

        //2016年安排资金-按阶段分
        $scope.PhaseArrangedata = [];
        $scope.PhaseArrangecolour = [];
        $ionicLoading.show();
        ChartData.ArrangeMoneyData($scope.selectedYear).then(function (data) {
            for (var i = 0; i < data.length; i++) {
                $scope.PhaseArrangedata.push(data[i].InvestmentMoney);
                $ionicLoading.hide();
            }
        })
        $scope.PhaseArrangecolour = ["#99b958", "#4e80bb", "#bd4e4c"];

        //2016年总投资-按项目类别分   
        TotalPieLables = [];
        TotalPie = [];
        ChartData.TotalPieChartData($scope.selectedYear).then(function (data) {
            for (var i = 0; i < data.length; i++) {
                TotalPieLables.push(data[i].DimensionName);
                TotalPie.push(changeTwoDecimal((data[i].InvestmentMoney) / 10000));
            }
        })
        $scope.ProjectTypeToeallabels = TotalPieLables;    //['道路交通', '城市建设', '公共安全', '市容环境提神、改善及市容市政设施', '环境保护及地质灾害治理、水利设施、水治理', '教育', '医疗卫生', '文化体育', '科技产业配套', '党政机关及其他', '专项资金'];
        $scope.ProjectTypeToealseries = ['Series A'];
        $scope.ProjectTypeToealcolours = [{
            fillColor: '#4e81bd',
            //strokeColor: 'rgba(47, 132, 71, 0.8)',
            highlightFill: '#99b3d1',
            //highlightStroke: '#9266e2'
        }];
        $scope.ProjectTypeToealdata = [TotalPie];  //[[65, 59, 80, 81, 56, 55, 40, 67, 80, 42, 76]];

        //2016年安排资金-按项目类别分
        ArrangeMoneyLable = [];
        ArrangePie = [];
        ChartData.ArrangeMoneyPieChartData($scope.selectedYear).then(function (data) {
            for (var i = 0; i < data.length; i++) {
                ArrangeMoneyLable.push(data[i].DimensionName);
                ArrangePie.push(changeTwoDecimal((data[i].InvestmentMoney) / 10000));
            }
        })

        $scope.ProjectTypeAllocatelabels = ArrangeMoneyLable;
        $scope.ProjectTypeAllocateseries = ['Series A'];
        $scope.ProjectTypeAllocatecolours = [{
            fillColor: '#4e81bd',
            //strokeColor: 'rgba(47, 132, 71, 0.8)',
            highlightFill: '#99b3d1',
            //highlightStroke: '#9266e2'
        }];
        $scope.ProjectTypeAllocatedata = [ArrangePie]; //[[65, 59, 80, 81, 56, 55, 40, 67, 80, 42, 76]];

        //历年数据
        var toatlData = [];      //数据
        var AnnualData = [];
        var ArrangeData = [];
        var hisYear = [];    //年份

        ChartData.HorsthChartData().then(function (data) {
            for (var i = 0; i < data.length; i++) {
                hisYear.push(data[i].Year);
                toatlData.push((data[i].InvestTotal) / 10000);
                AnnualData.push((data[i].InvestAnnual) / 10000);
                ArrangeData.push((data[i].ArrangeMoney) / 10000);
            }

            $scope.HistoricalData = [toatlData, AnnualData, ArrangeData];;
            $scope.HistoricalDataseries = ['总投资', '资金需求', '资金安排'];
            $scope.HistoricalDatalabels = hisYear;
        })

        $scope.Historicalcolours = [{
            fillColor: '#4e81bd',
            //strokeColor: 'rgba(47, 132, 71, 0.8)',
            highlightFill: '#779bc7',
            //highlightStroke: '#779bc7'
        }, {
            fillColor: '#99b958',
            //strokeColor: 'rgba(47, 132, 71, 0.8)',
            highlightFill: '#aac476',
            //highlightStroke: '#aac476'
        }, {
            fillColor: '#bd4e4c',
            //strokeColor: 'rgba(47, 132, 71, 0.8)',
            highlightFill: '#c97c7b',
            //highlightStroke: '#c97c7b'
        }];

        $scope.listSelect = function (year) {
            $ionicLoading.show();
            if (document.getElementById("CharType").innerHTML == "1") {    //chartType代表图表的各种类型（总投资：按阶段分、安排资金：按阶段分、总投资：按项目类别、安排资金：按项目类别、历年数据），ChartType,已经失效，无用
                //2016年总投资-按阶段分
                $scope.PhaseTotallabels = [];
                $scope.PhaseTotaldata = [];
                ChartData.TotalHisData(year).then(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        $scope.PhaseTotallabels.push(data[i].DimensionName);
                        $scope.PhaseTotaldata.push(data[i].InvestmentMoney);
                        $ionicLoading.hide();
                    }
                })

                //2016年安排资金-按阶段分
                $scope.PhaseArrangedata = [];
                ChartData.ArrangeMoneyData(year).then(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        //$scope.PhaseArrangelabels.push(data[i].DimensionName);
                        $scope.PhaseArrangedata.push(data[i].InvestmentMoney);
                    }
                })
                $scope.PhaseArrangecolour = ["#99b958", "#4e80bb", "#bd4e4c"];


                //2016年总投资-按项目类别分   
                TotalPieLables = [];
                TotalPie = [];
                ChartData.TotalPieChartData(year).then(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        TotalPieLables.push(data[i].DimensionName);
                        TotalPie.push(changeTwoDecimal((data[i].InvestmentMoney) / 10000));
                    }
                })
                $scope.ProjectTypeToeallabels = TotalPieLables;
                $scope.ProjectTypeToealseries = ['Series A'];
                $scope.ProjectTypeToealcolours = [{
                    fillColor: '#4e81bd',
                    //strokeColor: 'rgba(47, 132, 71, 0.8)',
                    highlightFill: '#99b3d1',
                    //highlightStroke: '#9266e2'
                }];
                $scope.ProjectTypeToealdata = [TotalPie];

                //2016年安排资金-按项目类别分
                ArrangeMoneyLable = [];
                ArrangePie = [];
                ChartData.ArrangeMoneyPieChartData(year).then(function (data) {
                    for (var i = 0; i < data.length; i++) {
                        ArrangeMoneyLable.push(data[i].DimensionName);
                        ArrangePie.push(changeTwoDecimal((data[i].InvestmentMoney) / 10000));
                    }
                })

                $scope.ProjectTypeAllocatelabels = ArrangeMoneyLable;
                $scope.ProjectTypeAllocateseries = ['Series A'];
                $scope.ProjectTypeAllocatecolours = [{
                    fillColor: '#4e81bd',
                    //strokeColor: 'rgba(47, 132, 71, 0.8)',
                    highlightFill: '#99b3d1',
                    //highlightStroke: '#9266e2'
                }];
                $scope.ProjectTypeAllocatedata = [ArrangePie];
            }
        }; //下拉框改变事件

        //js处理数据，保留小数点后两位
        var changeTwoDecimal = function changeTwoDecimal(floatvar) {
            var f_x = parseFloat(floatvar);
            if (isNaN(f_x)) {
                alert('function:changeTwoDecimal->parameter error');
                return false;
            }
            var f_x = Math.round(floatvar * 100) / 100;
            return f_x;
        }

        $scope.isChart1Visbile = true;
        $scope.isChart2Visbile = true;
        $scope.isChart3Visbile = true;
        $scope.isChart4Visbile = true;
        $scope.isChart5Visbile = true;
        $scope.isListSelect = true;


    })

    .controller('ChatDetailCtrl', function ($scope, $stateParams) {
        $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('LocationCtrl', function ($scope, $rootScope, $ionicModal, $ionicLoading, $cordovaToast, Projects, Industries, InvestSources, ProjectTypes, Investments, Account) {
        $scope.form = {};
        $scope.query = null;
        $scope.industries = [];
        $scope.investSources = [];
        $scope.projectTypes = [];
        $scope.investments = [];

        Industries.findAll().then(function (data) {
            $scope.industries = data;
        });

        InvestSources.findAll().then(function (data) {
            $scope.investSources = data;
        });

        ProjectTypes.findAll().then(function (data) {
            $scope.projectTypes = data;
        });

        Investments.findAll().then(function (data) {
            $scope.investments = data;
        });

        //登陆验证
        Account.isLogin().then(function (data) {
            if (!data) {
                $rootScope.showLoginView();
            };
        });


        var map = new BMap.Map("map", {
            enableMapClick: true
        }); // 创建地图实例  
        var point = new BMap.Point(114.05, 22.65);
        map.centerAndZoom(point, 12); // 初始化地图，设置中心点坐标和地图级别  
        // map.addControl(new BMap.ZoomControl()); //添加地图缩放控件

        $ionicModal.fromTemplateUrl('templates/modal-search.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.searchModal = modal;
        });

        var buildQuery = function () {

            var query = "";
            if (!!$scope.form.keyword) {
                query += "!!$.ProjectName.match(/" + $scope.form.keyword + "/i) &&";
            };
            if (!!$scope.form.danwei) {
                query += "!!$.UnitName.match(/" + $scope.form.danwei + "/i) &&";
            };
            if (!!$scope.form.industry) {
                query += "$.DomainClassName == '" + $scope.form.industry.name + "' &&";
            };
            if (!!$scope.form.investment) {
                query += $scope.form.investment.query + " &&";
            };
            if (!!$scope.form.projectType) {
                query += "$.ProjectCategory == '" + $scope.form.projectType.name + "' &&";
            };
            if (!!$scope.form.investSource) {
                query += "$.InvestSources == '" + $scope.form.investSource.name + "' &&";
            };

            query += "1 == 1"

            $scope.query = query;
        };

        $scope.showModal = function () {
            $scope.searchModal.show();
        }

        $scope.closeModal = function () {
            $scope.searchModal.hide();
        }




        $scope.ok = function () {
            $ionicLoading.show();
            $scope.searchModal.hide();

            //清除地图上所有覆盖物
            map.clearOverlays();

            buildQuery();
            Projects.findByQuery($scope.query).then(function (data) {
                $ionicLoading.hide();

                if (data.length == 0) {
                    if (window.cordova) {
                        $cordovaToast.show('没有查询结果', 'short', 'center');
                    } else {
                        alert('没有查询结果');
                    };
                } else {
                    data.forEach(function (prj) {

                        if (!!prj.MapInfo && prj.MapInfo != '[]|[]|[]') {

                            var maps = prj.MapInfo.split('|');
                            var centerPoint = {};

                            if (eval(maps[0]).length != 0) {
                                // 点
                                console.log('点');
                                var point = eval(maps[0])[0].n;
                                centerPoint = {
                                    lng: point.lng,
                                    lat: point.lat
                                };
                            } else if (eval(maps[1]).length != 0) {
                                // 线
                                console.log('线');
                                var points = eval(maps[1])[0].n;
                                centerPoint = points[Math.ceil(points.length / 2)];
                                var linePonits = [];
                                points.forEach(function (p) {
                                    linePonits.push(new BMap.Point(p.lng, p.lat));
                                });
                                var polyline = new BMap.Polyline(
                                    linePonits, {
                                        strokeColor: "blue",
                                        strokeWeight: 2,
                                        strokeOpacity: 0.5
                                    });

                                map.addOverlay(polyline);

                            } else if (eval(maps[2]).length != 0) {
                                // 面
                                console.log('面');
                                var points2 = eval(maps[2])[0].n;
                                var minLng = Enumerable.From(points2).Min('$.lng');
                                var maxLng = Enumerable.From(points2).Max('$.lng');
                                var minLat = Enumerable.From(points2).Min('$.lat');
                                var maxLat = Enumerable.From(points2).Max('$.lat');
                                centerPoint = {
                                    lat: (maxLat + minLat) / 2,
                                    lng: (maxLng + minLng) / 2
                                };
                                var areaPonits = [];
                                points2.forEach(function (p) {
                                    areaPonits.push(new BMap.Point(p.lng, p.lat));
                                });

                                var polygon = new BMap.Polygon(areaPonits, {
                                    strokeColor: "blue",
                                    strokeWeight: 2,
                                    strokeOpacity: 0.5
                                }); //创建多边形
                                map.addOverlay(polygon);
                            };

                            //添加标记
                            var marker = new BMap.Marker(new BMap.Point(centerPoint.lng, centerPoint.lat)); //创建标注

                            var content = "<a href='#/tab/location-detail/location/" + prj.ProjectId + "' id='myUrl'>" + prj.ProjectName + "</a>"
                            var infoWindow = new BMap.InfoWindow(content);
                            marker.addEventListener("click", function () {
                                this.openInfoWindow(infoWindow);

                            });
                            map.addOverlay(marker); // 将标注添加到地图中
                        };
                    });
                }
            })
        }
    })

    .controller('SettingsCtrl', function ($scope, $rootScope, $ionicLoading, $ionicModal, Account) {
        $scope.formdata = {
            realname: null,
            password: null,
            newpassword: null,
            repassword: null
        };

        //登陆验证
        Account.isLogin().then(function (data) {
            if (!data) {
                $rootScope.showLoginView();
            }
        });

        $scope.showSetRealNameView = function () {
            if (!!$rootScope.user) {
                $scope.formdata.realname = $rootScope.user.realName;
            };

            $ionicModal.fromTemplateUrl('templates/modal-setrealname.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.setRealNameModal = modal;
                $scope.setRealNameModal.show();
            });
        };

        $scope.closeSetRealNameView = function () {
            $scope.setRealNameModal.hide();
        };

        $scope.setRealName = function (form) {

            if (form.$valid) {
                $scope.setRealNameModal.hide();
                Account.setRealName($rootScope.user.id, $scope.formdata.realname);
            };

        }

        $scope.showSetPasswordView = function () {

            $ionicModal.fromTemplateUrl('templates/modal-setpassword.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.setPasswordModal = modal;
                $scope.setPasswordModal.show();
            });
        };

        $scope.closeSetPasswordView = function () {
            $scope.setPasswordModal.hide();
        };

        $scope.setPassword = function (form) {

            if (form.$valid) {
                $scope.setPasswordModal.hide();
                Account.setPassword($rootScope.user.username, $scope.formdata.password, $scope.formdata.newpassword);
            };
        }
    })

    .controller('GeneralCtrl', function ($scope, $rootScope, $ionicActionSheet, Account) {

        $scope.logout = function () {
            $ionicActionSheet.show({

                titleText: '确定要退出登录吗？',
                destructiveText: '确定退出',
                cancelText: '取消',
                destructiveButtonClicked: function () {
                    Account.logout();
                    $rootScope.showLoginView();
                    return true;
                }
            });
        }
    })

    .controller('UpdateCtrl', function ($scope, AppService) {
        $scope.autoCheckUpdate = true;
        $scope.update = null;
        $scope.isChecking = true;

        $scope.changeAutoCheckUpdate = function (value) {
            AppService.setAutoCheckUpdate(value);
        };

        $scope.gotoUpdate = function () {
            window.open($scope.update.updateUrl, '_system');
        }

        AppService.isAutoCheckUpdate().then(function (data) {
            $scope.autoCheckUpdate = data;
        });

        AppService.checkUpdate().then(function (data) {
            $scope.update = data;
            $scope.isChecking = false;
        });
    })

    .controller('AboutCtrl', function ($scope, APP_CONFIG) {
        $scope.config = APP_CONFIG;
    })

    .controller('ProjectCtrl', function ($scope, $rootScope, APP_CONFIG,REQUEST_URL_LIST,$state, Snapshots, Account,$http) {

        //登陆验证
        Account.isLogin().then(function (data) {
            if (!data) {
                $rootScope.showLoginView();
            };
        });
       
       /*$http({
          method: 'GET',
          url: APP_CONFIG.host + REQUEST_URL_LIST.url_projectreposity,
          timeount: 200000
        }).then(function(res){
        	console.log(res.data);
        });*/
       
       console.log('login in ,show project...');

        if (!$rootScope.querydata) {
            $rootScope.querydata = {};
        };

        $scope.isEdit = false;
        $scope.closeCircleClass = '';

       /* Snapshots.findAll().then(function (data) {
            $rootScope.snapshots = data;
        });*/

        $scope.search = function () {
            $state.go("tab.project-list");
        }

        $scope.onEdit = function () {
            $scope.closeCircleClass = 'active';
            $scope.isEdit = true;
        }

        $scope.onDone = function () {
            $scope.closeCircleClass = '';
            $scope.isEdit = false;
        }

        $scope.delete = function (id) {
            Snapshots.delete(id).then(function (data) {
                $rootScope.snapshots = data;
            })
        }
    })

    .controller('ProjectListCtrl', function (Account,$scope, $rootScope, $ionicScrollDelegate, $ionicModal, $ionicLoading, $state, $stateParams, $ionicPopup, $cordovaToast, Projects, Industries, Investments, ProjectTypes, InvestSources, Snapshots) {

		//登陆验证
        Account.isLogin().then(function (data) {
            if (!data) {
                $rootScope.showLoginView();
            };
        });
        
        if (!$rootScope.querydata) {
            $rootScope.querydata = {};
        };
        $scope.form = {
            prjName: null,
            entName: null,
            industry: null,
            investment: null,
            prjType: null,
            investSrc: null,
            saveToSnapshot: false
        };

        $scope.isInitData = false; //是否初始化
        $scope.projects = [];
        $scope.pageSize = 10; //默认值
        $scope.nextPage = 1;
        $scope.totalPage = 0;
        $scope.industries = [];
        $scope.investSources = [];
        $scope.projectTypes = [];
        $scope.investments = [];
        //$scope.snapshot = $stateParams.snapshot;
        //筛选下拉选项
        $scope.industry = true;
        $scope.investment = true;
        $scope.year = true;
        $scope.more = true;
        //linq.js 查询方法
        $scope.query = null;

        (function () {
            Industries.findAll().then(function (data) {
                $scope.industries = data;
            });

            InvestSources.findAll().then(function (data) {
                $scope.investSources = data;
            });

            ProjectTypes.findAll().then(function (data) {
                $scope.projectTypes = data;
            });

            Investments.findAll().then(function (data) {
                $scope.investments = data;
            });

        })();

        var buildQuery = function () {

            var query = "";
            if (!!$rootScope.querydata.keyword) {
                // query += "&& !!$.name.match(/^" + $scope.querydata.keyword + "/i)";
                query += "!!$.ProjectName.match(/" + $rootScope.querydata.keyword + "/i) &&";
            };
            if (!!$rootScope.querydata.danwei) {
                query += "!!$.UnitName.match(/" + $rootScope.querydata.danwei + "/i) &&";
            };
            if (!!$rootScope.querydata.industry) {
                query += "$.DomainClassName == '" + $rootScope.querydata.industry + "' &&";
            };
            if (!!$rootScope.querydata.investment) {
                query += $rootScope.querydata.investmentQuery + " &&";
            };
            if (!!$rootScope.querydata.projectType) {
                query += "$.ProjectCategory == '" + $rootScope.querydata.projectType + "' &&";
            };
            if (!!$rootScope.querydata.investSource) {
                query += "$.InvestSources == '" + $rootScope.querydata.investSource + "' &&";
            };

            query += "1 == 1"

            $scope.query = query;
        };

        $scope.loadMore = function () {

			console.log('loadMore');
            Projects.findData($scope.nextPage, $scope.pageSize, $scope.query).then(function (data) {
                $scope.totalPage = data.totalPage;
                data.data.forEach(function (item) {
                    $scope.projects.push(item);
                });
                $scope.nextPage = data.page + 1;
				console.log($scope.totalPage);
                $scope.isInitData = true;
                $ionicLoading.hide();

                $scope.$broadcast('scroll.infiniteScrollComplete');
            });
        };

        $scope.moreDataCanBeLoaded = function () {
            if (!$scope.isInitData) {
                return true;
            } else if ($scope.nextPage <= $scope.totalPage) {
                return true;
            } else {
                return false;
            }
        };

        $scope.industrySelected = function (id) {

            $scope.industry = !$scope.industry;
            $scope.investment = $scope.year = $scope.more = true;
            $scope.isActive = !$scope.industry

            Industries.findById(id).then(function (data) {
                if (!!data) {
                    $scope.querydata.industry = data.name;
                } else {
                    $scope.querydata.industry = null;
                }
                console.log($scope.querydata.industry);
                $scope.search();
            });

        };

        $scope.investmentSelected = function (id) {

            $scope.investment = !$scope.investment;
            $scope.industry = $scope.year = $scope.more = true;
            $scope.isActive = !$scope.investment;

            Investments.findById(id).then(function (data) {
                if (!!data) {
                    $scope.querydata.investment = data.name;
                    $scope.querydata.investmentQuery = data.query;
                } else {
                    $scope.querydata.investment = null;
                    $scope.querydata.investmentQuery = null;
                };

                $scope.search();
            })
        };

        $scope.typeSelected = function (id) {
            $scope.year = !$scope.year;
            $scope.industry = $scope.investment = $scope.more = true;
            $scope.isActive = !$scope.year

            $scope.search();
        };

        $scope.search = function () {
            buildQuery();
            $scope.projects = [];
            $scope.nextPage = 1;
            $scope.isInitData = false;

            $ionicScrollDelegate.scrollBottom();
        }

        $scope.cancel = function () {
            //关闭下拉框
            $scope.more = !$scope.more;
            $scope.industry = $scope.investment = $scope.year = true;
            $scope.isActive = !$scope.more;

            $scope.form = {
                prjName: null,
                entName: null,
                industry: null,
                investment: null,
                prjType: null,
                investSrc: null,
                saveToSnapshot: false
            };
        }

        $scope.ok = function () {
        	alert('123');
            //关闭下拉框
            $scope.more = !$scope.more;
            $scope.industry = $scope.investment = $scope.year = true;
            $scope.isActive = !$scope.more;

            $rootScope.querydata.keyword = $scope.form.prjName;
            $rootScope.querydata.danwei = $scope.form.entName;

            if (!!$scope.form.industry) {
                $rootScope.querydata.industry = $scope.form.industry.name;
            } else {
                $rootScope.querydata.industry = null;
            }
            if (!!$scope.form.investment) {
                $rootScope.querydata.investment = $scope.form.investment.name;
            } else {
                $rootScope.querydata.investment = null;
            }
            if (!!$scope.form.investment) {
                $rootScope.querydata.investmentQuery = $scope.form.investment.query;
            } else {
                $rootScope.querydata.investmentQuery = null;
            }
            if (!!$scope.form.prjType) {
                $rootScope.querydata.projectType = $scope.form.prjType.name;
            } else {
                $rootScope.querydata.projectType = null;
            }
            if (!!$scope.form.investSrc) {
                $rootScope.querydata.investSource = $scope.form.investSrc.name;
            } else {
                $rootScope.querydata.investSource = null;
            }

            $scope.search();

            if ($scope.form.saveToSnapshot) {
                $ionicPopup.show({
                    template: '<input type="text" ng-model="querydata.snapshot">',
                    title: '请输入快照名',
                    // subTitle: '',
                    scope: $scope,
                    buttons: [{
                        text: '取消'
                    }, {
                        text: '<b>保存</b>',
                        type: 'button-positive',
                        onTap: function (e) {
                            if (!$scope.querydata.snapshot) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                Snapshots.add($scope.querydata.snapshot, $scope.query).then(function (data) {
                                    $rootScope.snapshots = data;
                                    $scope.form.saveToSnapshot = false;
                                    if (window.cordova) {
                                        $cordovaToast.show('已保存', 'short', 'center');
                                    } else {
                                        alert('已保存');
                                    };
                                });
                            }
                        }
                    }]
                });
            };
        }

        $scope.toggleIndustry = function () {
            $ionicScrollDelegate.$getByHandle('mainScroll').freezeScroll(!!$scope.industry);
            $scope.industry = !$scope.industry;
            $scope.investment = $scope.year = $scope.more = true;
            $scope.isActive = !$scope.industry
        };
        $scope.toggleInvestment = function () {
            $ionicScrollDelegate.$getByHandle('mainScroll').freezeScroll(!!$scope.investment);
            $scope.investment = !$scope.investment;
            $scope.industry = $scope.year = $scope.more = true;
            $scope.isActive = !$scope.investment;
        };
        $scope.toggleYear = function () {
            $ionicScrollDelegate.$getByHandle('mainScroll').freezeScroll(!!$scope.year);
            $scope.year = !$scope.year;
            $scope.industry = $scope.investment = $scope.more = true;
            $scope.isActive = !$scope.year
        };
        $scope.toggleMore = function () {
            $ionicScrollDelegate.$getByHandle('mainScroll').freezeScroll(!!$scope.more);
            $scope.more = !$scope.more;
            $scope.industry = $scope.investment = $scope.year = true;
            $scope.isActive = !$scope.more
        };

        $scope.toggleBackdrop = function () {
            $scope.industry = $scope.investment = $scope.year = $scope.more = true;
            $scope.isActive = "";
        };

		//$scope.search();
       /* if (!!$scope.snapshot && !!$rootScope.snapshots) {
            $scope.query = Enumerable.From($rootScope.snapshots).Where('$.ID == ' + $scope.snapshot).Single().QueryStr;
        } else {
            $scope.search();
        };*/

    })

    .controller('ProjectDetailCtrl', function ($scope, $stateParams, $ionicLoading, Projects) {
        $ionicLoading.show();
        $scope.type = $stateParams.type;
        $scope.projectId = $stateParams.id;
        $scope.unitName = $stateParams.unitName;
        $scope.projectNumber = $stateParams.projectNumber;
        $scope.project = {};

        Projects.findByIdNumAndUnitName($scope.projectId,$scope.unitName,$scope.projectNumber).then(function (data) {

            $scope.project = data;
            $ionicLoading.hide();
        })
    })
	.controller('MonthReportCtrl', function ($scope, $stateParams, $ionicLoading, Projects) {
        $ionicLoading.show();
        $scope.projectId = $stateParams.id;
        $scope.project = {};
        $scope.submitYearMonth = {};
        var date=new Date();
        var currentYear = date.getFullYear();
        $scope.years = [];	
        for(var i = 2013;i<=currentYear;i++){
        	$scope.years.push(i);
        }
		$scope.currentYear = currentYear+'';
		$scope.months=['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
        Projects.findById($scope.projectId).then(function (data) {
			$ionicLoading.hide();
            $scope.project = data;
            
            calMonthReports($scope.currentYear);
            
        });
        
        
        function calMonthReports(year){
        	//将月份暂时全部设为未填状态
    		for (var i =1; i <= 12; i++) {
        		$scope.submitYearMonth['m'+i]=false;
			}
    		//获取项目当前年份现有月报
    		 var monthReports=$linq($scope.project.monthReportDtos)
 		 		.where(function(x){
 		 			console.log(x.submitYear+'-'+year);
 		 			return x.submitYear==year;}
 		 		);
    		//设置按钮状态
    		 monthReports.foreach(function(x){
    			 if(x.processState != null){//有状态则代表已有填写月报
    				 if(x.processState == common.basicDataConfig().processState_tuiWen){//如果为退文状态
    					 $scope.tuiwenYearMonth['m'+x.submitMonth]=true;
    				 }else{//如果为其他状态
    					 $scope.submitYearMonth['m'+x.submitMonth]=true;
    				 }
    			 }
    		 });

        }
        //月报年份改变时
        $scope.setMonthSelected = function(year){
        	 calMonthReports(year);       		 
        }
        
        
    })
	//月报详细页面控制器
	.controller('MonthReportDetailCtrl', function ($scope, $stateParams, $ionicLoading, Projects) {
        $ionicLoading.show();
        $scope.projectId = $stateParams.id;
        $scope.year = $stateParams.year;
        $scope.month = $stateParams.month;
        $scope.project = {};
        Projects.findById($scope.projectId).then(function (data) {
			$ionicLoading.hide();
            $scope.project = data;
            $scope.monthReport = {};
            //计算当前的月报
            var report=$linq($scope.project.monthReportDtos)
						.where(function(x){return x.submitYear==$scope.year && x.submitMonth==$scope.month;})
						.toArray();
			if(report.length>0){//有月报
				$scope.isReportExist=true;
				for (var i = 0; i < report.length; i++) {
					if(report[i].isLatestVersion == true){
						$scope.monthReport=report[i];
					}
				}
            
        	};
        	//关联上项目
			$scope.monthReport.projectId = $scope.project.id;
			$scope.monthReport.projectNumber = $scope.project.projectNumber;
			$scope.monthReport.projectRepName = $scope.project.projectRepName;
			$scope.monthReport.projectRepMobile = $scope.project.projectRepMobile;
			//项目开工以及竣工日期的获取
			$scope.monthReport.beginDate = $scope.project.beginDate;
			$scope.monthReport.endDate = $scope.project.endDate;
			//项目相关资金获取
			$scope.monthReport.invertPlanTotal = $scope.project.projectInvestSum;//项目总投资
			$scope.monthReport.actuallyFinishiInvestment= $scope.project.projectInvestAccuSum;//累计完成投资
			//资金处理
			$scope.monthReport.releasePlanTotal = $scope.monthReport.releasePlanTotal;//截止上年底累计下达计划
			$scope.monthReport.thisYearPlanInvestment = $scope.monthReport.thisYearPlanInvestment;//本年度计划完成投资
			$scope.monthReport.thisYearPlanHasInvestment = $scope.monthReport.thisYearPlanHasInvestment;//本年度已下达计划
			$scope.monthReport.thisYearAccumulatedInvestment = $scope.monthReport.thisYearAccumulatedInvestment;				
			$scope.monthReport.thisMonthPlanInvestTotal = $scope.monthReport.thisMonthPlanInvestTotal;//本月计划完成投资
			$scope.monthReport.thisMonthInvestTotal = $scope.monthReport.thisMonthInvestTotal;//本月完成投资
			$scope.monthReport.thisYearAccumulatedInvestment = $scope.monthReport.thisYearAccumulatedInvestment;//本年度已完成投资						
			$scope.monthReport.firstQuarCompInvestment = $scope.monthReport.firstQuarCompInvestment;//1到3月份完成投资
			$scope.monthReport.secondQuarCompInvestment = $scope.monthReport.secondQuarCompInvestment;//1到6月份完成投资
			$scope.monthReport.thirdQuarCompInvestment = $scope.monthReport.thirdQuarCompInvestment;//1到9月份完成投资
			$scope.monthReport.fourthQuarCompInvestment = $scope.monthReport.fourthQuarCompInvestment;//1到12月份完成投资
			
			$scope.uploadType=[['scenePicture','现场图片'],['other','其它材料']]; 
		});
        
    })
    .controller('ProjectPreparesCtrl', function ($scope, $stateParams, $ionicLoading, Projects) {
        $ionicLoading.show();
        $scope.projectId = $stateParams.id;
        $scope.projectPrepares = [];
        Projects.findProjectPrepares($scope.projectId).then(function (data) {
            $scope.projectPrepares = data;
            $ionicLoading.hide();
        })
    })

    .controller('ProjectProcessesCtrl', function ($scope, $stateParams, $ionicLoading, Projects) {
        $ionicLoading.show();
        $scope.projectId = $stateParams.id;
        $scope.projectprocess = {};
        $scope.projectType = null; //1：项建、可研、概算；2：前期计划、新开工计划、续建计划、清资结算计划
        Projects.findProjectProcessDetail($scope.projectId).then(function (data) {
            if (!!data) {
                $scope.projectprocess = data;
                if (data.TypeName == '项目建议书' || data.TypeName == '可行性研究报告' || data.TypeName == '项目总概算') {
                    $scope.projectType = 1;
                } else if (data.TypeName == '前期计划' || data.TypeName == '新开工计划' || data.TypeName == '续建计划' || data.TypeName == '清资结算计划') {
                    $scope.projectType = 2;
                }
            };

            $ionicLoading.hide();
        })
    })
    //项目申报详情控制器
	.controller('ProjectShenboCtrl', function ($scope, $stateParams, $ionicLoading, Projects) {
        $ionicLoading.show();
        $scope.projectId = $stateParams.id;
        $scope.projectprocess = {};
        $scope.projectType = null; //1：项建、可研、概算；2：前期计划、新开工计划、续建计划、清资结算计划
        Projects.findProjectShenbaoDetail($scope.projectId).then(function (data) {
            if (!!data) {
            	
            	$scope.projectshenbao = data;
            	if($scope.projectshenbao.constructionUnit){
            		$scope.projectshenbao.constructionUnit = $scope.projectshenbao.constructionUnit.split(',');
            	}
            	if($scope.projectshenbao.projectShenBaoStage == common.basicDataConfig().projectShenBaoStage_nextYearPlan){//申报阶段为:下一年度计划
					$scope.projectshenbao.isYearPlan = true;
					$scope.projectshenbao.uploadType=[['JYS','项目建议书'],['KXXYJBG','可行性研究报告'],['CBSJYGS','初步设计与概算']];
				}
            	//$scope.projectshenbao.constructionUnit = common.arrayToString(data.constructionUnit,',');
                /*$scope.projectprocess = data;
                if (data.TypeName == '项目建议书' || data.TypeName == '可行性研究报告' || data.TypeName == '项目总概算') {
                    $scope.projectType = 1;
                } else if (data.TypeName == '前期计划' || data.TypeName == '新开工计划' || data.TypeName == '续建计划' || data.TypeName == '清资结算计划') {
                    $scope.projectType = 2;
                }*/
            };

            $ionicLoading.hide();
        })
    })
    .controller('ProjectSchedulesCtrl', function ($scope, $stateParams, $ionicLoading, $ionicModal, Projects) {

        $scope.projectId = $stateParams.id;
        $scope.year = $stateParams.year;
        $scope.month = null;
        $scope.projectType = null; //1：区投区建；2：市投区建、市投市建
        $scope.projectschedule = {};

        $ionicModal.fromTemplateUrl('templates/select-month.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
            if (!$scope.month) {
                $scope.modal.show();
            };
        });

        $scope.selectMonth = function () {
            $scope.modal.show();
        }

        $scope.$on('monthSelected', function (e, month) {
            $ionicLoading.show();
            $scope.modal.hide();
            $scope.month = month;
            Projects.findProjectScheduleDetail($scope.projectId, $scope.year, $scope.month).then(function (data) {
                if (!!data) {
                    $scope.projectschedule = data;
                    if (data.ProjectCategory == '区投区建') {
                        $scope.projectType = 1;
                    } else if (data.ProjectCategory == '市投区建' || data.ProjectCategory == '市投市建') {
                        $scope.projectType = 2;
                    }
                };

                $ionicLoading.hide();
            })
        });
    })

    .controller('SelectMonthCtrl', function ($scope, $rootScope) {

        $scope.selectMonth = function (month) {
            $rootScope.$broadcast('monthSelected', month);
        }
    })