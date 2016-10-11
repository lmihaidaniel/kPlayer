//sytem related
var fs = require('fs');
var path = require('path');
var url = require('url');
var spawn = require('child_process').spawn;
//build related
var pkg = require('./package.json'),
  gulp = require('gulp'),
  liveserver = require('live-server');
//package & scorm related
var sco_settings = require('./scorm.config.json'),
  scopackage = require('node-scorm-packager');

//helper+utilities functions
var deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};

if (!fs.existsSync('build/')){
    fs.mkdirSync('build/');
}
if (!fs.existsSync('assets/')){
    fs.mkdirSync('assets/');
}

function noOp() {};

var Cleanup = function Cleanup(callback) {
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
    console.log('Ctrl-C...');
    console.log('\n');
    process.exit(2);
  });

  //catch uncaught exceptions, trace, then exit normally
  process.on('uncaughtException', function(e) {
    console.log('Uncaught Exception...');
    console.log(e.stack);
    process.exit(99);
  });
};

Cleanup(function() {
  liveserver.shutdown();
});


//SCRIPT PACK RELATED
gulp.task('cleanPackage', function(done) {
  deleteFolderRecursive('./dist');
  done();
});

gulp.task('addCoreFiles', ['cleanPackage'], function(done) {
  gulp.src('app/index.html').pipe(gulp.dest('dist/'));
  gulp.src('build/bundle.css').pipe(gulp.dest('dist/assets/'));
  gulp.src('lib/core/svgSprite/kmlPlayer.svg').pipe(gulp.dest('dist/assets/'));
  return gulp.src('build/bundle.js').pipe(gulp.dest('dist/assets/'));
});

gulp.task('createDistribution', ['addCoreFiles'], function() {
  return gulp.src('assets/**')
    .pipe(gulp.dest('dist/assets/'));
});

gulp.task('pack', ['rollup', 'cleanPackage', 'addCoreFiles', 'createDistribution'], function(done) {
  done();
});


//SCRIPT RUN ROLLUP
gulp.task('rollup', function(cb) {
  var ls = spawn("npm", ['run', 'rollup']);
  ls.stdout.on('data', (data) => {
    console.log(`${data}`);
  });
  ls.stderr.on('data', function(data) {
    console.log('grep stderr: ' + data);
  });
  ls.on('close', (code) => {
    cb();
  });
});


//SCRIPT development build
var params_server = {
  port: 3000, // Set the server port. Defaults to 8080. 
  host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP. 
  root: "./app", // Set root directory that's being server. Defaults to cwd. 
  open: true, // When false, it won't load your browser by default. 
  ignore: 'sass,videos', // comma-separated string for paths to ignore 
  file: "index.html", // When set, serve this file for every 404 (useful for single-page applications) 
  wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec. 
  mount: [
    ['/assets', './assets'], ['/kmlPlayer.svg', './lib/core/svgSprite/kmlPlayer.svg']
  ], // Mount a directory to a route. 
  logLevel: 1, // 0 = errors only, 1 = some, 2 = lots 
  middleware: [function(req, res, next) {
    function returnFile(src, res, type) {
      res.setHeader('Content-Type', type);
      res.end(fs.readFileSync('./build/' + src).toString());
    }
    var parsed = url.parse(req.url);
    if (parsed.pathname.indexOf('bundle.js.map') > -1) {
      returnFile('bundle.js.map', res, 'application/json');
      return;
    }
    if (parsed.pathname.indexOf('bundle.js') > -1) {
      returnFile('bundle.js', res, 'application/javascript');
      return;
    }
    if (parsed.pathname.indexOf('bundle.css') > -1) {
      returnFile('bundle.css', res, 'text/css');
      return;
    }
    next();
  }]
};

gulp.task('build', function(cb) {
  var ls = spawn("npm", ['run', 'rollup']);
  ls.stdout.on('data', (data) => {
    console.log(`${data}`);
  });
  ls.stderr.on('data', function(data) {
    console.log('grep stderr: ' + data);
  });
  ls.on('close', (code) => {
    console.log("watching for changes");
    gulp.watch(['lib/**/*.js', 'lib/**/*.sss', 'app/**/*.js', 'app/**/*.sss'], ['rollup']);
    liveserver.start(params_server);
  });
});

//SCRIPT BUILD RELATED
gulp.task('default', function() {
  if (process.env.NODE_ENV !== 'production') {
    gulp.start('build');
  } else {
    gulp.start('pack', function(){
      console.log('package builded');
    });
  }
});

//SCRIPT INIT
gulp.task('boilerplate', function() {
  return gulp.src('boilerplate/**')
    .pipe(gulp.dest('app/'))
    .on('end', function() {
      console.log('boilerplate initiated');
      gulp.start('default');
    });
});

//SCORM BUILD RELATED
let args = process.argv.slice(2);
if (sco_settings) {
  if (sco_settings.enabled && args[0] === 'scorm') {
        scopackage({
          version: sco_settings.version || "1.2", // '1.2', '2004 3rd Edition', '2004 4th Edition'
          organization: sco_settings.organization || "Test Company", //{String} Company name
          title: sco_settings.title || "Test Course", // {String}
          identifier: sco_settings.identifier || 0, // {String} Uses 0 and course title if left empty
          masteryScore: sco_settings.masteryScore || 80, //{Number} Uses 80 if left empty
          startingPage: sco_settings.startingPage || 'index.html', //Uses index.html if left empty
          source: 'dist',
          destination: 'scorm'
        }, function() {
            console.log("scorm added");
        })
        return;
  }
}

fs.stat('app/index.js', function(err, stat) {
  if (err == null) {
    gulp.start('default');
  } else {
    gulp.start('boilerplate');
  }
});