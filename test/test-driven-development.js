var expect = require("expect");
var helper = require("./../lib/helper.js");
var file   = require("./../lib/file.js");
var path   = require("path");

/*
 * Define CONST options for file.js
 */
module.CONST = {
	OPTIONS: helper.parseOptions({
		path: "test/static"
	})
};

describe("helper functions", function(){
	it("should parse options", function(){
		expect(function(){
			helper.parseOptions();
		}).toThrow("Options is undefined");

		expect(function(){
			helper.parseOptions([]);
		}).toThrow("Options parameter must be an object");

		expect(function(){
			helper.parseOptions({});
		}).toThrow("Path for static files is undefined");

		expect(function(){
			helper.parseOptions({path: "static", hook: "test"});
		}).toThrow("Hook must be a map object");

		expect(function(){
			helper.parseOptions({path: "static", hook: {request: "test"}});
		}).toThrow("Hook request must be a function");

		expect(function(){
			helper.parseOptions({path: "static", hook: {success: "test"}});
		}).toThrow("Hook success must be a function");

		expect(function(){
			helper.parseOptions({path: "static", hook: {fail: "test"}});
		}).toThrow("Hook fail must be a function");

		expect(function(){
			helper.parseOptions({path: "static", hook: {cached: "test"}});
		}).toThrow("Hook cached must be a function");

		expect(helper.parseOptions({path: "static"})).toIncludeKeys([
			"path",
			"index",
			"defaultExtension",
			"cache",
			"scriptName"
		]);
	});

	it("should set extension", function(){
		// Do not set extension cause parameter extension is undefined
		expect(helper.setExtension("path/to/file")).toBe("path/to/file");

		// Set extension to path without extension
		expect(helper.setExtension("path/to/file", "md")).toBe("path/to/file.md");
		
		// Change extension to path with extension
		expect(helper.setExtension("path/to/file.js", "md")).toBe("path/to/file.md");
	});

	it("should resolve index", function(){
		expect(function(){
			helper.resolveIndex([]);
		}).toThrow("Index value not valid");

		expect(helper.resolveIndex(true)).toBe("index");
		expect(helper.resolveIndex(false)).toBe(null);
		expect(helper.resolveIndex("file")).toBe("file");
	});
});

describe("file functions", function(){
	it("should parse directory", function(){
		// The directory found is not a file
		expect(file.parseDir("path/to/file")).toInclude({file: false});
		
		// The directory found is a file
		expect(file.parseDir("path/to/file.js")).toInclude({file: true});
	});

	it("should find file", function(){
		var dir = module.CONST.OPTIONS.path;

		// When a file is not found
		expect(file.findFile("path/to/file")).toBe(null);

		// When no extension was given in url
		expect(file.findFile(dir)).toInclude({
			file: true,
			dir: path.join(dir, "index.html")
		});

		// When extension was given in url
		expect(file.findFile(path.join(dir, "index.html"))).toInclude({
			file: true,
			dir: path.join(dir, "index.html")
		});
	});

	it("should contain file stats properly", function(){
		// File does not exist so stats should be null
		expect(file.parseDir("path/to/file.js").stats).toBe(null);

		// File does exists, stats should be an object
		expect(file.parseDir("test/static/index.html").stats).toNotBe(null);
	});
});