'use strict';
 
//var fs = require('fs'); 
var path = require('path'); 
 
module.exports = function (grunt) {

	grunt.initConfig({
		paths: {
			sourcePath: './_source/',
			devPath: 		'./_dev/',
			distPath: 	'./_dist/',				
			distHashDataPath: './.hash.json'
		}
	});
	
	// WATCH
  
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.config('watch', {
		options: {
			livereload: true
		},	
		less: {
			options: {
				event: ['changed'],
			},
			files: '<%= paths.sourcePath %>_less/*.less',
			tasks: ['on-less-change']
		},
		js: {
			options: {
				event: ['changed'],
			},
			files: '<%= paths.sourcePath %>js/*.js',
			tasks: ['on-js-watch-change']
		},
		json: {
			options: {
				event: ['changed'],
			},
			files: ['<%= paths.sourcePath %>**/*.html','<%= paths.sourcePath %>**/*.md'],
			tasks: ['on-source-change']
		}
	});
	
	// JS MIN
	
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.config('uglify', {
    dist: {
      files: {
        '<%= paths.distPath %>js/scripts.min.js': ['<%= paths.distPath %>js/*.js']
      }
    }
	});
	
	// JS HINT
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.config('jshint', {
		options: {
      'curly': true,
			'eqeqeq': true,
			'undef': true,
			'browser': true,
			'unused': false,
			'quotmark': 'single',
			'noarg': true,
			'nonew': true,
			'newcap': true,
			'latedef': true,
			'freeze': true,
			'immed': true,
			'bitwise': true,
			'camelcase': true,
			'indent': 2,
			'strict': false,
			'devel' : true,
			'globals': {
				'jQuery': true
			}
    },
    'src-for-dev': ['<%= paths.sourcePath %>js/*.js'],
    'src-for-dist': {
      options: {
        'devel': false,
      },
      files: {
        src: ['<%= paths.sourcePath %>js/*.js']
      },
    }
	});
	
	// CLEAN
	
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.config('clean', {    
		'dev': {
			src: '<%= paths.devPath %>'
		},
		'dist': {
			src: '<%= paths.distPath %>'
		},
		'dev-js': {
			src: '<%= paths.devPath %>js/'
		}, 
		'dist-non-min' : {
			src: ['<%= paths.distPath %>js/**/*.js', '!<%= paths.distPath %>js/**/*.min.js', '<%= paths.distPath %>css/**/*.css', '!<%= paths.distPath %>css/**/*.min.css']
		},
		'dist-non-hash-assets': {
			src:['<%= paths.distPath %>**/*.{css,js}','!<%= paths.distPath %>**/*.*.{css,js}','<%= paths.distPath %>**/*.min.{css,js}']
		},
		'dist-hash-data': {
			src: '<%= paths.distHashDataPath %>'
		}
	});
	
	// LESS
	
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.config('less', {    
		'src-to-dev': {
			options: {
				// Specifies directories to scan for @import directives when parsing. 
				// Default value is the directory of the source, which is probably what you want.
				paths: ["<%= paths.sourcePath %>_less/","bower_components/bootstrap/less/"], 
			},
			files: {
				// compilation.css : source.less
				'<%= paths.devPath %>css/theme.css' : '<%= paths.sourcePath %>_less/theme.less'
			}
		},
		'dist-minify': {
			options: {
				cleancss: true,
				report: 'min'
			},
			files: {
				'<%= paths.distPath %>css/theme.min.css': '<%= paths.distPath %>css/theme.css'
			}
		}
	});
  
  // COPY
  
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.config('copy', {    
		'src-js-to-dev': {
			expand: true,
			cwd: '<%= paths.sourcePath %>js/',
			src: '**/*.js',
			dest: '<%= paths.devPath %>/js/',
			flatten: false
		},
		dist: {
			expand: true,
			cwd: '<%= paths.devPath %>',
			src: '**',
			dest: '<%= paths.distPath %>',
			flatten: false
		}
	});
		
	// CONNECT
	
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.config('connect', {
		'dev': {
			options: {
				port: 1234,
				base: '<%= paths.devPath %>',
				keepalive:false,
				open: true,
				debug: true,
				livereload: true
			}
		}
	});
	
	// JSON LINT
	
	grunt.loadNpmTasks('grunt-jsonlint');
	grunt.config('jsonlint', {
		source: {
			src: [ '<%= paths.sourcePath %>**/*.json' ]
		}
	});
	
	// JECKYLL
	
	grunt.loadNpmTasks('grunt-jekyll');
	grunt.config('jekyll', {
		options: {                          
			src: '<%= paths.sourcePath %>'
		},
		dev: {
			options: {
			dest: '<%= paths.devPath %>',
			config: './jekyll-config.yml'
			}
		}
	});

  // CACHE HASH
    
  grunt.loadNpmTasks('grunt-hash');
  grunt.config('hash-actual', {
    options: {
			mapping: '<%= paths.distHashDataPath %>', // mapping file so your server can serve the right files
			srcBasePath: '<%= paths.distPath %>', // the base Path you want to remove from the `key` string in the mapping file
			destBasePath: '<%= paths.distPath %>', // the base Path you want to remove from the `value` string in the mapping file
			flatten: false, // Set to true if you don't want to keep folder structure in the `key` value in the mapping file
			hashLength: 8, // hash length, the max value depends on your hash function
			hashFunction: function(source, encoding){ // default is md5
				return require('crypto').createHash('sha1').update(source, encoding).digest('hex');
			}
		},
		'js': {
			src: '<%= paths.distPath %>js/*.min.js',  //all your js that needs a hash appended to it
			dest: '<%= paths.distPath %>js/' //where the new files will be created
		},
		'js-vendor': {
			src: '<%= paths.distPath %>js/vendor/*.min.js',  //all your js that needs a hash appended to it
			dest: '<%= paths.distPath %>js/vendor/' //where the new files will be created
		},
		css: {
			src: '<%= paths.distPath %>css/*.min.css',  
			dest: '<%= paths.distPath %>css/'
		}
  });
  grunt.renameTask('hash', 'hash-actual');
	grunt.registerTask(
		'hash', 
		['clean:dist-hash-data','hash-actual']
	);
	
	//grunt.renameTask('jekyll', 'jekyll-actual');
	//grunt.registerTask('jekyll', ['jekyll-actual','clean:non-hash-dist-assets']);
	
	// ENVIRONMENT TAGS
	
	//grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-string-replace');
	grunt.config('string-replace', {
		'dist-html': {
			options: {
				replacements: [
					// Remove dev only code blocks
					{
						pattern: /<!--(\s*)ifdev:start((.|\n)*?)ifdev:end(\s*)-->/ig,
						replacement: ''
					},
					// Remove dist only comment wrappers
					{
						pattern: /<!--(\s*)ifdist:start/ig,
						replacement: ''
					},				
					{
						pattern: /ifdist:end(\s*)-->/ig,
						replacement: ''
					},
					// Retain sq bracket comments
					{
						pattern: /(<!--\[((.|\n)*?)\]-->)/ig,
						replacement: function (match, p1) {		
							p1 = p1.split('<!--').join('{~comment:start~}');
							p1 = p1.split('-->').join('{~comment:end~}');
              return p1;
            }
					},
					// Remove html comments
					{
						pattern: /<!--((.|\n)*?)-->/ig,
						replacement: ''
					},
					// Restore sq bracket comments
					{
						pattern: /(\{~comment:start~\})/ig,
						replacement: '<!--'
					},
					{
						pattern: /(\{~comment:end~\})/ig,
						replacement: '-->'
					},
				]
			},
			files: [
				{expand: true, flatten: false, cwd: '<%= paths.distPath %>', src: '**/*.html', dest: '<%= paths.distPath %>'}
			]
    }
	});
	
	grunt.registerTask('dist-embed-hash-links', function() {
			
			var hashData = grunt.file.readJSON(grunt.config.get('paths.distHashDataPath'));
			
			var replacements = [];
			
			for (var sourceFilePath in hashData){
				var hashFilePath = hashData[sourceFilePath];
				var find = {};
				find.pattern = new RegExp(sourceFilePath.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi');
				find.replacement = hashFilePath;
				replacements.push(find);
			}
			
			grunt.config('string-replace', {
        'dist-embed-hash-links': {
					options: {
						replacements: replacements
					},
					files: [
						{expand: true, flatten: false, cwd: '<%= paths.distPath %>', src: '**/*.html', dest: '<%= paths.distPath %>'}
					]
				}
   	 	});
			grunt.task.run('string-replace');
			
	});
	
	// GITHUB PAGES
	if (grunt.option('msg')){
		grunt.config.set('gh-pages.options.message', grunt.option('msg'));
	}
	
	grunt.loadNpmTasks('grunt-gh-pages');
	grunt.config('gh-pages', {
			options: {
			base: '<%= paths.distPath %>',
			message: 'Deploy to |gh-pages| branch.'
		},
		src: ['**']
	});
				
  // TASKS
  
	grunt.registerTask(
		'on-source-change', 
		['build:dev'] // Verify js
	);
	
	grunt.registerTask(
		'on-js-watch-change', 
		['jshint:src-for-dev', 'clean:dev-js', 'copy:src-js-to-dev'] // Verify js
	);
	
	grunt.registerTask(
		'on-less-change', 
		['less:src-to-dev'] // Rebuild css
	);
	
	grunt.registerTask(
		'build:dev', 
		['clean:dev', 'clean:dist', 'jekyll', 'less:src-to-dev'] //,'bowercopy','uglify', 'less', 'hash', 'jekyll']
	);
	
	grunt.registerTask(
		'default', 
		[ 'dev']
	);
	
	grunt.registerTask(
		'dev', 
		[ 'build:dev', 'connect:dev', 'watch']
	);
	
	grunt.registerTask(
		'output', 
		['dist']
	);
	
	grunt.registerTask(
		'dist', 
		['jshint:src-for-dist', 
		'clean:dev', 
		'clean:dist', 
		'jekyll', 
		'less:src-to-dev', 
		'copy:dist', 
		'less:dist-minify', 
		'uglify:dist', 
		'clean:dist-non-min', 
		'string-replace:dist-html', 
		'hash', 
		'clean:dist-non-hash-assets',
		'dist-embed-hash-links',
		'gh-pages']
	);
	
};