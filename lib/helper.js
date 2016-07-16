var path = require("path");

/**
 * Parse options of the package
 * 
 * @param  {Object} opts Options given from the server
 * @return {Object}      Options object merged with default
 */
module.exports.parseOptions = function(opts){
	// Path is mandatory for this package, throw error if undefined
	if(!opts.path){
		throw new Error("Path for static files is undefined");
	}

	return {
		path: path.resolve(opts.path),
		index: opts.index || "index",
		defaultExt: opts.defaultExt || "html",
		cache: opts.cache || "max-age=3600"
	};
}

/**
 * Concatenate extension file with a directory
 * 
 * @param {String} dir The normal directory
 * @param {String} ext The new directory with the given extension
 */
module.exports.setExtension = function(dir, ext){
	return dir + "." + ext;
}