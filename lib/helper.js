var path = require("path");
var utils    = require("utils-pkg");

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
		index: opts.index !== undefined ? this.resolveIndex(opts.index) : "index",
		defaultExt: opts.defaultExt || "html",
		cache: opts.cache || "max-age=3600",
		showScriptName: opts.showScriptName || true
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

/**
 * Resolve the index value defined in options
 * Either boolean or string value
 * 
 * @param  {String|Boolean} val The provided value for the index
 * @return {String|Null}     	Return the correct value for file handler
 */
module.exports.resolveIndex = function(val){
	if(utils.isBoolean(val)){
		if(val == true){
			return "index"
		}

		else{
			return null;
		}
	}

	else if(utils.isString(val)){
		return val;
	}

	else{
		throw new Error("Index value not valid");
	}
}