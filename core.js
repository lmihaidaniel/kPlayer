//sytem related
var fs = require('fs-extra'),
  path = require('path'),
  url = require('url'),
  spawn = require('child_process').spawn;
//build related
var pkg = require('./package.json'),
  watchDeamon = require('watch'),
  liveserver = require('live-server'),
  watchMonitors = [];
//package & scorm related
var sco_settings = require('./scorm.config.json'),
  scopackage = require('simple-scorm-packager');

let args = process.argv.slice(2);
let __action__ = args[0] || "build";
let __env__ = Object.create(process.env);
__env__.NODE_ENV = process.env.NODE_ENV || 'development';

let _logSuccess = function(msg, title) {
  var date = new Date;
  var time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  console.log('[' + time + ']', title||'build', "'" + '\x1b[32m' + msg + '\x1b[0m' + "'");
};

let _logError = function(err, title) {
  var date = new Date;
  var time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  console.log('[' + time + ']', title||'build', '\x1b[31m', err, '\x1b[0m');
};

//live-server
var params_server = {
  port: 3000, // Set the server port. Defaults to 8080. 
  host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP. 
  root: "./app/index.html", // Set root directory that's being server. Defaults to cwd. 
  open: true, // When false, it won't load your browser by default. 
  ignore: 'sass,videos', // comma-separated string for paths to ignore 
  //file: "index.html", // When set, serve this file for every 404 (useful for single-page applications) 
  //wait: 0, // Waits for all changes, before reloading. Defaults to 0 sec. 
  mount: [
    ['/assets', './assets'],
    ['/assets', './build'],
    ['/kmlPlayer.svg', './lib/core/svgSprite/kmlPlayer.svg']
  ], // Mount a directory to a route. 
  logLevel: 1 // 0 = errors only, 1 = some, 2 = lots 
};

//helper+utilities functions
function noOp() {};

let server_close = function() {
  liveserver.shutdown();
}

let __next__ = function(err, cb_success, cb_error) {
  let _success = cb_success || noOp;
  let _error = cb_error || noOp;
  if (!err) {
    _success();
  } else {
    server_close();
    _error();
  }
}

var processBeforeClose = function processBeforeClose(callback) {
  // attach user callback to the process event emitter
  // if no callback, it will still exit gracefully on Ctrl-C
  callback = callback || noOp;
  process.on('cleanup', callback);

  // do app specific cleaning before exiting
  process.on('exit', function() {
    process.emit('cleanup');
  });

  // catch ctrl+c event and exit normally
  process.on('SIGINT', function() {
    _logError('...', 'quitting');
    process.exit(2);
  });

  //catch uncaught exceptions, trace, then exit normally
  process.on('uncaughtException', function(e) {
    _logError('Uncaught Exception...', 'quitting');
    _logError(e.stack, 'quitting');
    process.exit(99);
  });
};

processBeforeClose(function() {
  for(var k in watchMonitors){
    let watchMonitor = watchMonitors[k];
    if(watchMonitor['stop']){
        watchMonitor.stop();
        watchMonitor = null;
    }
  }
  server_close();
});

//rollup
function rollup(done, error) {
  let er = false;
  var ls = spawn("npm", ['run', 'rollup'], {
    env: __env__
  });
  _logSuccess("start", 'ROLLUP');
  ls.stdout.on('data', (data) => {
    let d = data.toString();
    if(!d.startsWith("\n>")) console.log(d);
  });
  ls.stderr.on('data', function(data) {
    er = true;
    let d = data.toString();
    if(d.startsWith("Error")) _logError(d, '!!!');
    if(d.startsWith("SyntaxError")) _logError(d, '!!!');
  });
  ls.on('error', (code) => {
    if (error) error(code);
  });
  ls.on('close', (code) => {
    if (done && !er) done(code);
  });
}

//build
function build(done, error) {
  rollup(done, error);
}

//serve
function serve(done, error) {
  // fs.ensureDirSync('./assets');
  build(function() {
    watch(function(){
      liveserver.start(params_server);
    });  
  });
}

//watch
function watch(done) {
  let t = 0;
  watchDeamon.createMonitor('./app', function(monitor) {
    watchMonitors.push(monitor);
    monitor.files['./app/**/*.html','./app/**/*.js', './app/**/*.sss'];
    monitor.on("changed", function(f, curr, prev) {
      _logSuccess(f, 'file changed');
      rollup();
    });
    t+=1;
    if(t==2 && done){
      done();
    }
  })
  watchDeamon.createMonitor('./lib', function(monitor) {
    watchMonitors.push(monitor);
    monitor.files['./lib/**/*.js', './lib/**/*.sss'];
    monitor.on("changed", function(f, curr, prev) {
      _logSuccess(f, 'file changed');
      rollup();
    });
    t+=1;
    if(t==2 && done){
      done();
    }
  });
}

//packaging
function package_init(done, error) {
  fs.emptyDir('./bundle', function(err) {
    __next__(err, function() {
      fs.copy('./lib/core/svgSprite/kmlPlayer.svg', './bundle/assets/kmlPlayer.svg', function(err) {
        __next__(err, function() {
          fs.copySync('./app/index.html', './bundle/index.html');
          fs.copySync('./build/bundle.css', './bundle/assets/bundle.css');
          fs.copySync('./build/bundle.js', './bundle/assets/bundle.js');
          if(__env__.NODE_ENV != "production") {
            fs.copySync('./build/bundle.js.map', './bundle/assets/bundle.js.map');
          }
          fs.copy('./assets/', './bundle/assets/', function(err){
            __next__(err, function() {
              _logSuccess("created", 'BUNDLE');
              if (done) done();
            });
          });
        });
      });
    }, function() {
      _logError('Cannot delete ./bundle', 'BUNDLE');
    });
  });
}

function package_create(done, error) {
  rollup(function(){
    _logSuccess("init", 'BUNDLE');
    package_init(done, error);
  });
}

//SCORM BUILD RELATED
function scorm(done) {
  if (sco_settings) {
    package_create(function() {
          scopackage({
            author: sco_settings.author,
            version: sco_settings.version, // '1.2', '2004 3rd Edition', '2004 4th Edition'
            organization: sco_settings.organization, //{String} Company name
            title: sco_settings.title, // {String}
            identifier: sco_settings.identifier, // {String} Uses 0 and course title if left empty
            masteryScore: sco_settings.masteryScore, //{Number} Uses 80 if left empty
            startingPage: sco_settings.startingPage, //Uses index.html if left empty
            package: sco_settings.package,
            source: 'bundle'
          }, done);
    });
  }
}

function init() {
  fs.ensureDirSync("./build");
  fs.stat('./app/index.js', function(err) {
    _logSuccess(__env__.NODE_ENV, 'ENVIRONMENT');
    if (err) {
      _logSuccess('boilerplating', 'INIT');
      fs.copySync('./lib/index.html', './app/index.html');
      fs.ensureFileSync('./app/index.js');
    }
    switch (__action__) {
      case "serve":
        serve();
        return;
      case "bundle":
        package_create();
        return;
      case "scorm":
        scorm();
        return;
      default:
        build();
        return;
    }
  });
}
init();