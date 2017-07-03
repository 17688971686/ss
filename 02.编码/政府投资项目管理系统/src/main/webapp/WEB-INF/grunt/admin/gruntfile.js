
module.exports = function (grunt) {
    var allJs = [
        '../../../contents/common/common.js',
        '../../../contents/admin/app.js',
        '../../../contents/admin/framework/demo/demo.ctrl.js',
        '../../../contents/admin/framework/demo/demo.svc.js',
        '../../../contents/admin/framework/home/home.ctrl.js',
        '../../../contents/admin/framework/home/home.svc.js',
        '../../../contents/admin/framework/log/log.ctrl.js',
        '../../../contents/admin/framework/log/log.svc.js',
        '../../../contents/admin/framework/org/org.ctrl.js',
        '../../../contents/admin/framework/org/org.edit.ctrl.js',
        '../../../contents/admin/framework/org/orgUser.ctrl.js',
        '../../../contents/admin/framework/org/org.svc.js',
        '../../../contents/admin/framework/org/orgUser.svc.js',
        '../../../contents/admin/framework/role/role.ctrl.js',
        '../../../contents/admin/framework/role/role.edit.ctrl.js',
        '../../../contents/admin/framework/role/role.svc.js',
        '../../../contents/admin/framework/user/user.ctrl.js',
        '../../../contents/admin/framework/user/user.edit.ctrl.js',
        '../../../contents/admin/framework/user/user.svc.js',
        '../../../contents/admin/management/basicData/basicData.ctrl.js',
        '../../../contents/admin/management/basicData/basicData.svc.js',
        '../../../contents/admin/management/monthReport/monthReport.ctrl.js',
        '../../../contents/admin/management/monthReport/monthReport.svc.js',
        '../../../contents/admin/management/portal/portal.ctrl.js',
        '../../../contents/admin/management/portal/portal.svc.js',
        '../../../contents/admin/management/project/project.ctrl.js',
        '../../../contents/admin/management/project/project.svc.js',
        '../../../contents/admin/management/sysConfig/sysConfig.ctrl.js',
        '../../../contents/admin/management/sysConfig/sysConfig.svc.js',
        '../../../contents/admin/management/task/task.ctrl.js',
        '../../../contents/admin/management/task/task.svc.js',
        '../../../contents/admin/management/yearPlan/yearPlan.ctrl.js',
        '../../../contents/admin/management/yearPlan/yearPlan.svc.js'      
    ];    
    grunt.initConfig({		
        jshint: {
        	all: [
                '../../../contents/admin/**/*.js',
                '!../../../contents/admin/dest/*.js'
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
                dest: '../../../contents/admin/dest/app.js',
            }
        },
        uglify: {
            all: {
                files: {
                    '../../../contents/admin/dest/app.min.js': ['../../../contents/admin/dest/app.js']
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