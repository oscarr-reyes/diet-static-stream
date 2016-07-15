var package = module.package = module.parent;

var path    = require("path");
var flutils = require("flutils");
var helper  = require("./helper");

module.exports.findFile = function(dir){
	var directory = null;

	parsedDir = path.parse(dir);

	// Find file with default options
	if(!parsedDir.ext){
		var withExtension = helper.setExtension(dir, package.CONST.OPTIONS.defaultExt);
		var withIndex = path.join(dir, helper.setExtension(package.CONST.OPTIONS.index, package.CONST.OPTIONS.defaultExt));

		// Find file with default extension
		if(flutils.dirExists(withExtension)){
			directory = withExtension;
		}

		// Find file with default index
		else if(flutils.dirExists(withIndex)){
			directory = withIndex;
		}
	}

	else if(flutils.dirExists(dir)){
		directory = dir;
	}

	return directory;

}