module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	uglify: {
	  options: {
	    banner: '/* \n' +
				' * <%= pkg.name %> - <%= pkg.description %> \n' +
				' * Copyright(c) <%= pkg.author %> <%= grunt.template.today("yyyy") %> (License: <%= pkg.license %>) \n' +
				' * <%= grunt.template.today("dd-mm-yyyy") %> - Version: <%= pkg.version %> \n' +
				' */ \n'
	  },
	  build: {
	    src: '<%= pkg.name %>.js',
	    dest: 'dist/<%= pkg.name %>.min.js'
	  }
		},
		watch: {
		files: '<%= pkg.name %>.js',
		tasks: 'reload'
	}
	});

 	// Load the plugin that provides the "uglify" task.
 	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.loadNpmTasks('grunt-contrib-watch');

 	// Default task(s).
 	grunt.registerTask('reload', ['uglify']);

 	// Default task(s).
 	grunt.registerTask('default', ['reload', 'watch']);
};
