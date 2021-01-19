const http = require('http');
const ws = require('ws');
const fs = require('fs')

const wss = new ws.Server({noServer: true});

function accept(req, res) {
  // all incoming requests must be websockets or we return the index page
  if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() != 'websocket') {
    // console.log("not a websocket request")
    fs.stat("index.html", function(err, stats) {
    	if(err) {
    		console.log("index file not found");
    	} else {
    		// console.log("is dir: " + stats.isDirectory());
    		// console.log("index stats: " + stats.size);
    		res.writeHead(200, { 'content-type': 'text/html', 'content-length': stats.size })
    		fs.createReadStream('index.html').pipe(res);
    	}
  });
    
    return;
  }

  // can be Connection: keep-alive, Upgrade
  if (!req.headers.connection.match(/\bupgrade\b/i)) {
    res.end();
    return;
  }

  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onConnect);
}

function onConnect(ws) {
  ws.on('message', function (input) {
  console.log(input)
    ws.send(`Server got this message: ${input}`);

    setTimeout(() => ws.close(1000, "Bye!"), 5000);
  });
}

if (!module.parent) {
  http.createServer(accept).listen(8080);
} else {
  exports.accept = accept;
}