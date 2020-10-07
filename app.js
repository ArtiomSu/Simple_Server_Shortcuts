var http = require('http');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var spawn = require('child_process').spawn;

var app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
var publicDir = path.join(__dirname, 'public');

app.get('/', function (req, res) {
  console.log("sending index");
  res.sendFile(path.join(publicDir, 'index1.html'));
});

app.get('/stylesheets/:sheet_name', function (req, res, next) {
  console.log("sending style sheet ", req.params.sheet_name);

  var options = {
    root: path.join(__dirname, "public"+"/stylesheets")
  };

  res.sendFile(req.params.sheet_name, options, function (err) {
    if (err) {
      //res.send("hello");
      req.error = err;
      next();
    }
  });
});

app.get('/javascripts/:js_name', function (req, res, next) {
  console.log("sending javascript", req.params.js_name);

  var options = {
    root: path.join(__dirname, "public"+"/javascripts")
  };

  res.sendFile(req.params.js_name, options, function (err) {
    if (err) {
      //res.send("hello");
      req.error = err;
      next();
    }
  });
});

app.get('/devices/:type', function (req, res, next) {
  console.log("sending info page for ", req.params.type);

  var options = {
    root: path.join(__dirname, "public"+"/devices")
  };

  res.sendFile(req.params.type+".html", options, function (err) {
    if (err) {
      //res.send("hello");
      req.error = err;
      next();
    }
  });
});



app.get('/info/:type',function (req, res, next) {
  console.log("sending info type", req.params.type);
  let arguements = null;

  switch (req.params.type) {
    case "d":
      console.log("getting disk info");
      arguements = "-d";
      break;
    case "c":
      console.log("getting temperature info");
      arguements = "-c";
      break;
    case "t":
      console.log("getting top info");
      arguements = "-t";
      break;
    case "a":
      console.log("getting all info");
      arguements = "-a";
      break
  }

  if(arguements!== null){
      var prc = spawn('./info_script.sh',  [arguements]);
      let output = "";
  //noinspection JSUnresolvedFunction
      prc.stdout.setEncoding('utf8');
      prc.stdout.on('data', function (data) {
        var str = data.toString()

        var lines = str.split(/(\r?\n)/g).join("");
        output+=lines;
      })
      prc.on('close', function (code) {
        //console.log(output);
        return res.json({result:output});
      });


  }else{
      return res.json({result:"failed to get"});
  }


});


app.use(function(req, res) {
  if(req.error){
    console.log("error encountered");
  }
  console.log("not found1 ", req.url);
  res.statusCode = 404;
  return res.send("not found");
});





var port = normalizePort(process.env.PORT || '8080');
app.set('port', port);

var server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
