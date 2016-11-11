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
		
		// Find the requested file
		var file = fileLib.findFile(dir);
		
		// If directory is file
		if(file != null && file.file){
			var lastModified = $.header("if-modified-since");
			var modified = file.stats.mtime;

			// send file if "if-modified-since" header is undefined
			// if defined then compare if file is modified
			if(!lastModified || !helper.isEqualTime(lastModified, modified)){
				sendFile($, file);
			}

			// send 304 if file was not modified
			else{
				$.status("304");
				$.end();
			}

		}

		// The requested file was not found, send 404
		else{
			$.status("404");
			$.end("Page Not Found");
		}
	}
}

/**
 * Send chunks of file to the response
 * 
 * @param  {Object} $    The server response instance
 * @param  {Object} file The object that contains the file details
 */
function sendFile($, file){
	var readStream = fs.createReadStream(file.dir);
	// Send file when opens
	readStream.on("open", function(){
		$.status("200");
		$.header("Content-Type", file.mime);
		$.header("Cache-Control", module.CONST.OPTIONS.cache);
		$.header("Last-Modified", new Date(file.stats.mtime).toUTCString());
		readStream.pipe($.response);
	});
	
	// Send an error when something failes
	readStream.on("error", function(err){
		$.end(err);
	});	
}