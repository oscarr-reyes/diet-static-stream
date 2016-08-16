var diet = require("diet");
var stream = require("../index.js");
var request = require("supertest");

describe("server response", function(){
	var app;

	before(function(){
		app = diet({ silent: true });
		app.listen(8080);

		app.footer(stream({
			path: "test/static"
		}));
	});

	it("should respond ok", function(done){
		request("http://localhost:8080").get("/")
			.expect(200, done);
	});

	it("should respond ok with specific url", function(done){
		request("http://localhost:8080").get("/index.html")
			.expect(200, done);
	});

	it("should respond NotFound", function(done){
		request("http://localhost:8080").get("/file.rand")
			.expect(404, done);
	});
})