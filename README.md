# diet-static-stream
[![Build Status](https://travis-ci.org/Nosthertus/diet-static-stream.svg?branch=master)](https://travis-ci.org/Nosthertus/diet-static-stream)

Serve static files through streaming objects for Diet.js
## Installation
```bash
$ npm install diet-static-stream
```
## Usage
```Javascript
var diet = require("diet");
var dietStream = require("diet-static-stream");

var app = diet();

app.listen(80);

var static = dietStream({
	path: "static"
});

app.footer(static);
```

##Documentation
Diet-static-stream can take several options for it's usage

**path [String] - Required**

Path where `diet-static-stream` will serve the files

* * *

**index [String|Boolean] - Optional (Default: index)**

Filename to look when there is no extension especified in the request

if value is Boolean, it will search for index file as default if true, otherwise if false, it will not do automatic search for an index file

```HTTP
#When value is boolean and it's true
GET: www.example.com/images -> Server/static/images/index.html

#When value is boolean and it's false
GET: www.example.com/images -> Server/static/images.html

#Otherwise if value is string, search for provided filename as index
#Value: main
GET: www.example.com/images -> Server/static/images/main.html
```
* * *

**defaultExtension [String] - Optional (Default: html)**

Extension to look when there is no extension on the request
```HTTP
GET: www.example.com/images.html -> Server/static/images.html
GET: www.example.com/images -> Server/static/images.html OR Server/static/images/index.html according to index property
```

* * *

**cache [String|Function] - Optional (Default: max-age=3600)**

Control-Cache value to set in header response, if function is provided then all requests are executed within this function passing $ signal, if funtion returns false then all necessary headers for cache will be excluded

```JavaScript
stream({
	cache: function($){
    	//Set cache only for index.html
    	if($.url.pathname == "index.html"){
        	return "max-age=36000";
        }
        
        //Exclude cache headers for all requests that are not for index.html
        return false;
    }
});
```

* * *

**scriptName [Boolean] - Optional (Default: false)**

Whether require extension file on the request, if true `defaultExt` and `index` options will be ignored

```HTTP
#Value: true
GET: www.example.com/images -> Server/static/images #404 not found
GET: www.example.com/images/user_placeholder.jpg -> Server/static/images/user_placeholder.jpg #200 Found

#Value: false
#Find according to index and defaultExt values
GET: www.example.com/images -> Server/static/images/index.html
```

* * *

**hook [Object] - Optional**

If there is a need for hooks on request, this is handy for setting custom headers or any other change necessary, this property is a map of events that's executed in certain process

* **request [Function] ($: Signal) - Optional**
Request hook is executed just when module starts, before the file is searched, the signal `$` is the request response passed from the middleware

* **success [Function] ($: Signal, headers: Object, file: Object) - Optional**
Success hook is executed when the file is successfully opened, this function injects `$` signal along with `headers` as default headers set for the file found and `file` as object that contains the property used for the stream

* **fail [Function] ($: Signal) - Optional**
Fail hook is executed when the requested file was not found, right before responding `404`, the signal `$` is passed from the middleware

* **cached [Function] ($: Signal) - Optional**
Cached hook is executed when the requested file was found but it was not modified since the last request, making the response to be `304`, the signal `$` is passed from the middleware

## Benchmark Comparison
As explained before, both `diet-static` and `diet-static-stream` achieves the same end for sending static data to the client, due to the time it takes to make the data available to the client, i have made 2 phases which are:

* Resolve Time 
Resolve time is based on how long does the server take to make data available and start sending to client, this process was done by using `console.time()` right before the module starts loading the file, `console.timeEnd()` is executed when the module starts sending.

* Response Time
Response time is based on how long the client waits for the server to start recieving the requested data, this depends on latency and mostly `Resolve Time` on server, this process was achieved by using the comand `cURL`

The tests were done using fake files create from `fallocate` on `Linux`, the tests were done with this specs:

* OS: Linux/Debian Ubuntu 16.04 x64
* CPU: Intel Core I5 3.30GHz
* RAM: 4gb x 2 1600mhz
* HDD: 256gb 7200rpm

![Benchmark-Comparison](http://i.imgur.com/BHbZHGq.png)

## F.A.Q
**What is the difference between diet-static and this one?**

The answer is simple, `diet-static` uses `fs.readFile`, and according to API docs of `node.js` it reads the entire contents of a file, meaning that all the data from a file is temporary stored in the memory, this is nice if you only read few files with small sizes.

But what happens when you use it on a server that has hundreds of requests for media files, this could lead the server to overload and crash. 

This package uses stream objects for sending chunks of data when they are being on read, this does not load data into the memory and we can avoid memory overload for hundreds of requests

##Test
You can test the module by executing these commands:
```SH
$ npm test
```

if you have mocha globally installed:
```SH
$ mocha
```

##License
MIT