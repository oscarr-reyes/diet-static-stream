var path = require("path");
var utils    = require("utils-pkg");

/**
 * Parse options of the package
 * 
 * @param  {Object} opts Options given from the server
 * @return {Object}      Options object merged with default
 */
module.exports.parseOptions = function(opts){
	if(typeof opts == "undefined"){
		throw new Error("Options is undefined");
	}

	else if(!utils.isObject(opts)){
		throw new Error("Options parameter must be an object");
	}

	else{
		// Path is mandatory for this package, throw error if undefined
		if(!opts.path){
			throw new Error("Path for static files is undefined");
		}

		// Set the errors for resolve option
		else if(typeof opts.hook != "undefined"){
			var hook = opts.hook,
				events  = ["request", "success", "fail", "cached"];

			if(!utils.isObject(hook)){
				throw new Error("Hook must be a map object");
			}

			// Throw an error if any of the listed events is
			// not a valid passed value
			events.forEach(function(e){
				if(utils.inKeyObject(hook, e) && !utils.isFunction(hook[e])){
					throw new Error(`Hook ${e} must be a function`);
				}
			});
		}

		// Throw error if cache is defined with invalid values
		// Valid values are string or function
		else if(typeof opts.cache != "undefined"){
			if(!utils.isFunction(opts.cache) && !utils.isString(opts.cache)){
				throw new Error("Cache value must be a string or function");
			}
		}

		return {
			path: path.resolve(opts.path),
			index: opts.index !== undefined ? this.resolveIndex(opts.index) : "index",
			defaultExtension: opts.defaultExtension || "html",
			cache: opts.cache || "max-age=3600",
			scriptName: opts.scriptName !== undefined ? opts.scriptName : false,
			hook: opts.hook || null
		};
	}
}

/**
 * Give or replace extension file with a directory
 * 
 * @param {String} dir The normal directory
 * @param {String} ext The new directory with the given extension
 */
module.exports.setExtension = function(dir, ext){
	if(ext){
		if(path.extname(dir)){
			return dir.replace(path.extname(dir), "." + ext);
		}

		return dir + "." + ext;
	}

	return dir;
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

/**
 * Compares 2 date times regardless of which format they are,
 * ignoring milliseconds
 * 
 * @param  {Date}  time1 The date string/object to compare
 * @param  {Date}  time2 The date string/object to compare
 * @return {Boolean}     Whether they have the same time
 */
module.exports.isEqualTime = function(time1, time2){
	var time1 = new Date(time1)
		.getTime()
		.toString()
		.slice(0, -3);
	
	var time2 = new Date(time2)
		.getTime()
		.toString()
		.slice(0, -3);

	return time1 == time2;
}