var http = require('http');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var spawn = require('child_process').spawn;
const jwt = require('jsonwebtoken');
const TOKEN_SECRET = require('crypto').randomBytes(64).toString('hex');
const dotenv = require('dotenv');
const crypto = require("crypto");
var bcrypt = require('bcryptjs');
const fs = require('fs');


dotenv.config();
const USER_NAME = process.env.USER_NAME;
const USER_ID = process.env.USER_ID;
const USER_PASSWORD = process.env.USER_PASSWORD;
var token_random_time = crypto.randomInt(0, 100000000);
var token_salt_ramdon = bcrypt.genSaltSync(10);
var seasons = [];

function readSeasons(req, res){
  try {
    const file = fs.readFileSync('seasons.json');
    seasons = JSON.parse(file.toString());
    res.json(seasons);
  } catch (error) {
    console.log("failed to read seasons");
    console.error(error);
    res.statusCode=500;
    res.json({status: "failed"});
  }
}

function writeSeasons(req, res){
  try {
    fs.writeFileSync('seasons.json', JSON.stringify(seasons));
    res.json({status: "success"});
  } catch (error) {
    console.log("failed to save seasons");
    console.error(error);
    res.statusCode=500;
    res.json({status: "failed"});
  }
}

var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
//app.use(express.static(path.join(__dirname, 'public')));
var publicDir = path.join(__dirname, 'public');


function generateAccessToken(username) {
  return jwt.sign(username, TOKEN_SECRET, { expiresIn: '1800s' }); //30 mins
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];
  if(token){
    token = authHeader.split(' ')[1].replace(/[\""]/g, '');
  }
  token_random_time = crypto.randomInt(0, 100000000);
  token_salt_ramdon = bcrypt.genSaltSync(10);

  if (token == null){
    res.setHeader("token_salt", token_salt_ramdon);
    res.setHeader("token_rand", token_random_time);
    res.statusCode=403;
    return res.sendFile(path.join(publicDir, 'login.html'));
  }

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    if (err){
      console.log(err);
      res.statusCode=403;
      res.setHeader("token_salt", token_salt_ramdon);
      res.setHeader("token_rand", token_random_time);
      return res.sendFile(path.join(publicDir, 'login.html'));
    }
    req.user = user;
    next();
  });
}

app.get('/', function (req, res) {
  console.log("sending index");
  res.sendFile(path.join(publicDir, 'index1.html'));
});

app.post('/login', (req, res) =>{
  let token = "error";
  if(req.body.username && req.body.hash){
    let hash =  bcrypt.hashSync(USER_ID+USER_PASSWORD+token_random_time.toString(),token_salt_ramdon);
    if(req.body.username === USER_NAME && req.body.hash === hash){
      token = generateAccessToken({username: req.body.username});
    }
  }
  res.json(token);
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

app.get('/images/:image_name', function (req, res, next) {
  console.log("sending image", req.params.image_name);

  var options = {
    root: path.join(__dirname, "public"+"/images")
  };

  res.sendFile(req.params.js_name, options, function (err) {
    if (err) {
      req.error = err;
      next();
    }
  });
});

app.get('/devices/:type', authenticateToken, function (req, res, next) {
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



app.get('/info/:type', authenticateToken, function (req, res, next) {
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

app.get('/seasons', function(req, res, next) {
  readSeasons(req, res);
});

app.post('/seasons', function(req, res, next) {
  seasons = req.body;
  writeSeasons(req, res);
});

app.options('/seasons', function(req, res, next) {
  res.send();
})


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
