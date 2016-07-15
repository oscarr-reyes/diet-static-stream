var path = require("path");

module.exports.parseOptions = function(opts){
	if(!opts.path){
		throw new Error("Path for static files is undefined");
	}

	return {
		path: path.resolve(opts.path),
		index: opts.index || "index",
		defaultExt: opts.defaultExt || "html"
	};
}

module.exports.setExtension = function(dir, ext){
	return dir + "." + ext;
}