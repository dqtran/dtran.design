var path = require('path');

module.exports = function(files){

	var controllers = {};

	files.forEach(function (file) {
		var fileName = path.basename(file, '.js');
		var newName = fileName.replace('Controller', '');
		controllers[newName.toLowerCase()] = require(file);
 	 	
 	});
	return controllers;
}
