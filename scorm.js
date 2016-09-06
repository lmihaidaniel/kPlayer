var pkg = require('./package.json'),
  fs = require('fs'),
  gulp = require('gulp')
scopackage = require('node-scorm-packager');

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

gulp.task('moveBase', function() {
  return gulp.src('dist/**')
    .pipe(gulp.dest('ScormFolder/'));
});
gulp.task('moveExtended', ['moveBase'], function() {
  return gulp.src('assets/**')
    .pipe(gulp.dest('ScormFolder/'));
});

gulp.task('zip', function(done) {
  console.log('Waiting for manifest to be build ...');
  setTimeout(function() {
    var path = require('path');
    var dist = 'Scorm' + pkg.scorm.version;;
    var archiveName = path.resolve(__dirname, 'scorm/' + dist + '.zip');
    var archiveDir = path.resolve(__dirname, 'scorm/' + dist);

    var archiver = require('archiver')('zip');
    var files = require('glob').sync('**/*.*', {
      'cwd': archiveDir,
      'dot': false // include hidden files
    });

    var output = fs.createWriteStream(archiveName);
    archiver.on('error', function(error) {
      done();
      throw error;
    });
    output.on('close', done);

    files.forEach(function(file) {

      var filePath = path.resolve(archiveDir, file);

      // `archiver.bulk` does not maintain the file
      // permissions, so we need to add files individually
      archiver.append(fs.createReadStream(filePath), {
        'name': file,
        'mode': fs.statSync(filePath)
      });

    });

    archiver.pipe(output);
    archiver.finalize();

    console.log('\nZip created at ' + archiveName);
  }, 2000);
});

gulp.task('scorm', function(done) {
  scopackage({
    version: pkg.scorm.version || "1.2", // '1.2', '2004 3rd Edition', '2004 4th Edition'
    organization: pkg.scorm.organization || "Test Company", //{String} Company name
    title: pkg.scorm.title || "Test Course", // {String}
    identifier: pkg.scorm.identifier || 0, // {String} Uses 0 and course title if left empty
    masteryScore: pkg.scorm.masteryScore || 80, //{Number} Uses 80 if left empty
    startingPage: pkg.scorm.startingPage || 'index.html', //Uses index.html if left empty
    source: 'ScormFolder',
    destination: 'scorm'
  }, function() {
    done();
  })
});


gulp.task('default', ['moveBase', 'moveExtended'], function(done) {
  done();
});

if (pkg.scorm) {
  if (pkg.scorm.enabled) {
    gulp.start('default', function() {
      gulp.start('scorm', function() {
        gulp.start('zip', function() {
          return deleteFolderRecursive('ScormFolder/');
        });
      });
    });
  } else {
    console.log("!!! Scorm configuration found in package.json but is disabled");
  }
} else {
  console.log("!!! No scorm configuration found in package.json ");
}