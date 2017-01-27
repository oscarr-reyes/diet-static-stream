var helper  = require("./lib/helper");
var path    = require("path");
var flutils = require("flutils");
var fileLib = require("./lib/file");
var fs      = require("fs");

module.CONST = {
	OPTIONS: null
};

var opts;

module.exports = function(options){
	// Define Constant options
	module.CONST.OPTIONS = opts = helper.parseOptions(options);

	return function($){
		// Execute resolve request if passed
		if(opts.hook && opts.hook.request){
			opts.hook.request($);
		}
		
		var dir = path.join(opts.path, $.url.pathname);
		
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
				// Execute resolve cached if passed
				if(opts.hook && opts.hook.cached){
					opts.hook.cached($);
				}

				$.status("304");
				$.end();
			}
		}

		// The requested file was not found, send 404
		else{
			// Execute resolve fail if passed
			if(opts.hook && opts.hook.fail){
				opts.hook.fail($);
			}

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
		// Default headers
		var headers = {
			"Content-Type": file.mime,
			"Cache-Control": opts.cache,
			"Last-Modified": new Date(file.stats.mtime).toUTCString()
		};

		$.status("200");

		// Execute resolve function if defined in options
		if(opts.hook && opts.hook.success){
			opts.hook.success($, headers, file);
		}

		// Set all headers included with resolve
		for(h in headers){
			$.header(h, headers[h]);
		}

		readStream.pipe($.response);
	});
	
	// Send an error when something failes
	readStream.on("error", function(err){
		$.end(err);
	});	
}