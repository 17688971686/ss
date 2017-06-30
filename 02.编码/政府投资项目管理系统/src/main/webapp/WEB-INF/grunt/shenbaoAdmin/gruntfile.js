
module.exports = function (grunt) {
    var allJs = [
        '../../../contents/common/common.js',
        '../../../contents/shenbaoAdmin/app.js',
        '../../../contents/shenbaoAdmin/index/index.ctrl.js',
        '../../../contents/shenbaoAdmin/index/index.svc.js',
        '../../../contents/shenbaoAdmin/deptInfoMaintain/deptInfoMaintain.ctrl.js',
        '../../../contents/shenbaoAdmin/deptInfoMaintain/deptInfoMaintain.svc.js',
        '../../../contents/shenbaoAdmin/projectMonthReport/projectMonthReport.ctrl.js',
        '../../../contents/shenbaoAdmin/projectMonthReport/projectMonthReport.svc.js',
        '../../../contents/shenbaoAdmin/project/project.ctrl.js',
        '../../../contents/shenbaoAdmin/project/project.svc.js',
        '../../../contents/shenbaoAdmin/shenbao/shenbao.ctrl.js',
        '../../../contents/shenbaoAdmin/shenbao/shenbao.svc.js'
    ];    
    grunt.initConfig({		
        jshint: {
        	all: [
                '../../../contents/shenbaoAdmin/**/*.js',
                '!../../../contents/shenbaoAdmin/dest/*.js'
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
                dest: '../../../contents/shenbaoAdmin/dest/app.js',
            }
        },
        uglify: {
            all: {
                files: {
                    '../../../contents/shenbaoAdmin/dest/app.min.js': ['../../../contents/shenbaoAdmin/dest/app.js']
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