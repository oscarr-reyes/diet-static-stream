# diet-static-stream
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

**defaultExt [String] - Optional (Default: html)**

Extension to look when there is no extension on the request
```HTTP
GET: www.example.com/images.html -> Server/static/images.html
GET: www.example.com/images -> Server/static/images.html OR Server/static/images/index.html according to index property
```

* * *

**cache [String] - Optional (Default: max-age=3600)**

Control-Cache value to set in header response

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

## F.A.Q
**What is the difference between diet-static and this one?**

The answer is simple, `diet-static` uses `fs.readFile`, and according to API docs of `node.js` it reads the entire contents of a file, meaning that all the data from a file is temporary stored in the memory, this is nice if you only read few files with small sizes.

But what happens when you use it on a server that has hundreds of requests for media files, this could lead the server to overload and crash. 

This package uses stream objects for sending chunks of data when they are being on read, this does not load data into the memory and we can avoid memory overload for hundreds of requests

##License
MIT