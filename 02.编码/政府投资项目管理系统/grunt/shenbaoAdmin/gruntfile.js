
module.exports = function (grunt) {
    var allJs = [
        '../../src/main/webapp/contents/common/common.js',
        '../../src/main/webapp/contents/shenbaoAdmin/app.js',
        '../../src/main/webapp/contents/shenbaoAdmin/index/index.ctrl.js',
        '../../src/main/webapp/contents/shenbaoAdmin/index/index.svc.js',
        '../../src/main/webapp/contents/shenbaoAdmin/deptInfoMaintain/deptInfoMaintain.ctrl.js',
        '../../src/main/webapp/contents/shenbaoAdmin/deptInfoMaintain/deptInfoMaintain.svc.js',
        '../../src/main/webapp/contents/shenbaoAdmin/projectMonthReport/projectMonthReport.ctrl.js',
        '../../src/main/webapp/contents/shenbaoAdmin/projectMonthReport/projectMonthReport.svc.js',
        '../../src/main/webapp/contents/shenbaoAdmin/project/project.ctrl.js',
        '../../src/main/webapp/contents/shenbaoAdmin/project/project.svc.js',
        '../../src/main/webapp/contents/shenbaoAdmin/shenbao/shenbao.ctrl.js',
        '../../src/main/webapp/contents/shenbaoAdmin/shenbao/shenbao.svc.js'
    ];    
    grunt.initConfig({
        jshint: {
        	all: [
                '../../src/main/webapp/contents/shenbaoAdmin/**/*.js',
                '!../../src/main/webapp/contents/shenbaoAdmin/dest/*.js'
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
                dest: '../../src/main/webapp/contents/shenbaoAdmin/dest/app.js',
            }
        },
        uglify: {
            all: {
                files: {
                    '../../src/main/webapp/contents/shenbaoAdmin/dest/app.min.js': ['../../src/main/webapp/contents/shenbaoAdmin/dest/app.js']
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