var package = module.package = module.parent;

var path    = require("path");
var flutils = require("flutils");
var helper  = require("./helper");
var mime    = require("mime");

/**
 * Find the file with the given directory
 * 
 * @param  {String} dir Directory of the file/folder
 * @return {Object|Null}     Object with description of the file found, null if the file was not found
 */
module.exports.findFile = function(dir){
	var directory = null;

	parsedDir = path.parse(dir);

	// Find file with default extension if no extension is given
	if(!parsedDir.ext){
		var withExtension = helper.setExtension(dir, package.CONST.OPTIONS.defaultExt);
		var withIndex = path.join(dir, helper.setExtension(package.CONST.OPTIONS.index, package.CONST.OPTIONS.defaultExt));

		// Find file with default extension
		if(flutils.dirExists(withExtension)){
			directory = this.parseDir(withExtension);
		}

		// Find file with default index if default extension returns false
		else if(flutils.dirExists(withIndex)){
			directory = this.parseDir(withIndex);
		}
	}

	// Extension was given so look for the file directory
	else if(flutils.dirExists(dir)){
		directory = this.parseDir(dir);
	}

	return directory;
}

/**
 * Parse directory to object with mime information
 * 
 * @param  {String} dir The directory of the file
 * @return {Object}     Object with directory and mime values
 */
module.exports.parseDir = function(dir){
	return {
		dir: dir,
		mime: mime.lookup(dir)
	};
}