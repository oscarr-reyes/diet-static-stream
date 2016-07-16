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
			var readStream = fs.createReadStream(file.dir);

			// Send file when opens
			readStream.on("open", function(){
				$.status("200");
				$.header("Content-Type", file.mime);
				$.header("Cache-Control", module.CONST.OPTIONS.cache);
				readStream.pipe($.response);
			});

			// Send an error when something failes
			readStream.on("error", function(err){
				$.end(err);
			});
		}

		// The requested file was not found, send 404
		else{
			$.status("404");
			$.end("Page Not Found");
		}
	}
}