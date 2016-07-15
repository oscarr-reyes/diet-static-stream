var helper  = require("./lib/helper");
var path    = require("path");
var flutils = require("flutils");
var fileLib = require("./lib/file");
var fs      = require("fs");

module.CONST = {
	OPTIONS: null
};

module.exports = function(options){
	// Define Constant options
	module.CONST.OPTIONS = helper.parseOptions(options);

	return function($){
		var dir = path.join(module.CONST.OPTIONS.path, $.url.pathname);
		var file;

		// Find the requested file
		if(file = fileLib.findFile(dir)){
			var readStream = fs.createReadStream(file);

			readStream.on("open", function(){
				readStream.pipe($.response);
			});

			readStream.on("error", function(err){
				$.end(err);
			});
		}

		else {
			$.end();
		}
	}
}