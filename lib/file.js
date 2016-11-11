var package = module.package = module.parent;

var path    = require("path");
var flutils = require("flutils");
var helper  = require("./helper");
var mime    = require("mime");
var utils   = require("utils-pkg");
var fs      = require("fs");

/**
 * Find the file with the given directory
 * 
 * @param  {String} dir Directory of the file/folder
 * @return {Object|Null}     Object with description of the file found, null if the file was not found
 */
module.exports.findFile = function(dir){
	var directory = null;

	parsedDir = path.parse(dir);

	// Find file with default extension if no extension is given as long as ScriptName option is false
	if(!package.CONST.OPTIONS.scriptName && !parsedDir.ext){
		// Search file with the index value
		if(!utils.isFalsy(package.CONST.OPTIONS.index)){
			var withIndex = path.join(dir, helper.setExtension(package.CONST.OPTIONS.index, package.CONST.OPTIONS.defaultExtension));
			
			// Find file with default index if default extension returns false
			if(flutils.dirExists(withIndex)){
				directory = this.parseDir(withIndex);
			}
		}

		else{
			var withExtension = helper.setExtension(dir, package.CONST.OPTIONS.defaultExtension);

			// Find file with default extension
			if(flutils.dirExists(withExtension)){
				directory = this.parseDir(withExtension);
			}
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
		file: (path.extname(dir) ? true : false),
		dir: dir,
		mime: mime.lookup(dir),
		stats: flutils.dirExists(dir) ? fs.statSync(dir) : null
	};
}