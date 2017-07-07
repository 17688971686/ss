
module.exports = function (grunt) {
    var allJs = [
        '../../src/main/webapp/contents/common/common.js',
        '../../src/main/webapp/contents/admin/app.js',
        '../../src/main/webapp/contents/admin/framework/demo/demo.ctrl.js',
        '../../src/main/webapp/contents/admin/framework/demo/demo.svc.js',
        '../../src/main/webapp/contents/admin/framework/home/home.ctrl.js',
        '../../src/main/webapp/contents/admin/framework/home/home.svc.js',
        '../../src/main/webapp/contents/admin/framework/log/log.ctrl.js',
        '../../src/main/webapp/contents/admin/framework/log/log.svc.js',
        '../../src/main/webapp/contents/admin/framework/org/org.ctrl.js',
        '../../src/main/webapp/contents/admin/framework/org/org.edit.ctrl.js',
        '../../src/main/webapp/contents/admin/framework/org/orgUser.ctrl.js',
        '../../src/main/webapp/contents/admin/framework/org/org.svc.js',
        '../../src/main/webapp/contents/admin/framework/org/orgUser.svc.js',
        '../../src/main/webapp/contents/admin/framework/role/role.ctrl.js',
        '../../src/main/webapp/contents/admin/framework/role/role.edit.ctrl.js',
        '../../src/main/webapp/contents/admin/framework/role/role.svc.js',
        '../../src/main/webapp/contents/admin/framework/user/user.ctrl.js',
        '../../src/main/webapp/contents/admin/framework/user/user.edit.ctrl.js',
        '../../src/main/webapp/contents/admin/framework/user/user.svc.js',
        '../../src/main/webapp/contents/admin/management/basicData/basicData.ctrl.js',
        '../../src/main/webapp/contents/admin/management/basicData/basicData.svc.js',
        '../../src/main/webapp/contents/admin/management/monthReport/monthReport.ctrl.js',
        '../../src/main/webapp/contents/admin/management/monthReport/monthReport.svc.js',
        '../../src/main/webapp/contents/admin/management/portal/portal.ctrl.js',
        '../../src/main/webapp/contents/admin/management/portal/portal.svc.js',
        '../../src/main/webapp/contents/admin/management/project/project.ctrl.js',
        '../../src/main/webapp/contents/admin/management/project/project.svc.js',
        '../../src/main/webapp/contents/admin/management/sysConfig/sysConfig.ctrl.js',
        '../../src/main/webapp/contents/admin/management/sysConfig/sysConfig.svc.js',
        '../../src/main/webapp/contents/admin/management/task/task.ctrl.js',
        '../../src/main/webapp/contents/admin/management/task/task.svc.js',
        '../../src/main/webapp/contents/admin/management/yearPlan/yearPlan.ctrl.js',
        '../../src/main/webapp/contents/admin/management/yearPlan/yearPlan.svc.js'      
    ];    
    grunt.initConfig({		
        jshint: {
        	all: [
                '../../src/main/webapp/contents/admin/**/*.js',
                '!../../src/main/webapp/contents/admin/dest/*.js'
            ],
			options:{
				es3:true,//多余的逗号会提示错误
				laxbreak:true
			}

        },
        concat: {
            options: {
                separator: ';'
            },
            all: {
                src: allJs,
                dest: '../../src/main/webapp/contents/admin/dest/app.js',
            }
        },
        uglify: {
            all: {
                files: {
                    '../../src/main/webapp/contents/admin/dest/app.min.js': ['../../src/main/webapp/contents/admin/dest/app.js']
                }
            }
        }

    });
    grunt.loadNpmTasks('grunt-injector');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
	
	grunt.registerTask('default',['jshint','concat','uglify']);

};