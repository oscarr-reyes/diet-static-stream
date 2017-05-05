var diet    = require("diet");
var expect  = require("expect");
var stream  = require("../index.js");
var request = require("supertest");

describe("server response", function(){
	var app;

	before(function(){
		app = diet({ silent: true });
		app.listen(8080);

		app.footer(stream({
			path: "test/static",
			hook: {
				request: function($){
					$.header("x-hook-request", "true");
				},
				success: function($, headers, file){
					headers["x-hook-success"] = "true";
				},
				fail: function($){
					$.header("x-hook-fail", "true");
				},
				cached: function($){
					$.header("x-hook-cached", "true");
				}
			},
			cache: function($){
				if($.url.pathname == "/index.html"){
					return "max-age=36";
				}

				return false;
			}
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

	describe("hook executed", function(){
		it("should respond with request executed", function(done){
			request("http://localhost:8080").get("/index.html")
				.expect("x-hook-request", "true")
				.expect(200, done);
		});

		it("should respond with success executed", function(done){
			request("http://localhost:8080").get("/index.html")
				.expect("x-hook-success", "true")
				.expect(200, done);
		});

		it("should respond with fail executed", function(done){
			request("http://localhost:8080").get("/file.rand")
				.expect("x-hook-fail", "true")
				.expect(404, done);
		});
	});

	describe("cache control", function(){
		it("should set cache for index.html", function(done){
			request("http://localhost:8080").get("/index.html")
				.expect("Cache-Control", "max-age=36")
				.expect(200, done);
		});

		it("should not set cache for non-index.html", function(done){
			request("http://localhost:8080").get("/")
				.end(function(err, res){
					if(err){
						return done(err);
					}

					expect(res.headers).toExcludeKey("Cache-Control");

					done();
				});

		});
	});
});