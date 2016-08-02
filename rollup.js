/* globals require */
//build related
var pkg = require('./package.json');
var gulp = require('gulp');
var rollup = require('rollup');
//js related
var babel = require('rollup-plugin-babel');
var uglify = require('uglify-js');
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');
var replace = require( 'rollup-plugin-replace' );
var filesize = require( 'rollup-plugin-filesize' );
//css related
var sourcemaps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var postcss = require('gulp-postcss');
var csswring = require('csswring');
var atImport = require('postcss-import');
var postcssFont = require('postcss-font-magician');
var cssnext = require('postcss-cssnext');
var precss = require('precss');
//sytem related
var fs = require('fs');
var path = require('path');

function copyFileSync(source, target) {

  var targetFile = target;

  //if target is a directory a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source, target) {
  var files = [];

  //check if folder needs to be created or integrated
  var targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }

  //copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(function(file) {
      var curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
}

var default_sss = ['lib/core/**/*.sss', 'lib/index.sss', 'app/**/*.sss'];

var config = {
  banner: '/*! ' + pkg.name + ' - v' + pkg.version + ' */',
  compile: {
    moduleName: 'kmlPlayer',
    entry: 'index.js', // Entry file
    plugins: [
      replace({
        VERSION: JSON.stringify( pkg.version )
      }),
      nodeResolve({
        jsnext: true,
        main: true
      }),
      commonjs(),
      babel({
        exclude: 'node_modules/**'
      }),
      filesize()
    ]
  },
  build: {
    moduleName: 'kmlPlayer',
    entry: './temp/index.js', // Entry file
    plugins: [
      babel({
        exclude: 'node_modules/**',
        compact: true,
        presets: ['es2015-rollup'],
        plugins: [
            ['transform-es2015-classes', {
              loose: true
            }]
          ] // needed to add support to classes in <=ie10
      })
    ]
  },
  app: {
    moduleName: 'app',
    entry: './app/index.js', // Entry file
    plugins: [
      babel({
        exclude: 'node_modules/**',
        compact: true,
        presets: ['es2015-rollup'],
        plugins: [
            ['transform-es2015-classes', {
              loose: true
            }]
          ] // needed to add support to classes in <=ie10
      })
    ]
  }
};

var js_minify = function(entry) {
  var result = uglify.minify(entry, {
    fromString: true,
    mangle: true,
    options: {
      banner: '/*! ' + pkg.name + ' - v' + pkg.version + ' */'
    },
    compress: {
      sequences: true,
      dead_code: true,
      conditionals: true,
      booleans: true,
      unused: true,
      if_return: true,
      join_vars: true,
      drop_console: true
    }
  });
  return result.code;
}

gulp.task('css', function() {
  var processors = [
    atImport,
    precss,
    postcssFont,
    //postcssFont({hosted: '../lib/fonts'}),
    cssnext({
      browsers: ['> 5%', 'last 2 versions', 'ie > 8', 'Firefox ESR', 'Opera 12.1']
    }),
    csswring
  ];
  return gulp.src(default_sss)
    .pipe(postcss(processors))
    .pipe(sourcemaps.init())
    .pipe(concat('kmlPlayer.css'))
    .pipe(gulp.dest('./dist'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./build'))
    .on('end', function() {
      console.log(config.build.moduleName + ' css created');
    });
});

gulp.task('compile', function() {
  rollup.rollup(config.compile)
    .then(function(bundle) {
      let result = bundle.generate({
        format: 'es',
        moduleName: config.build.moduleName,
      });
      bundle.write({
        format: 'es',
        moduleName: config.build.moduleName,
        dest: 'temp/index.js', // Exit file
      });
    }).then(function() {
      console.log(config.build.moduleName + ' js compiled');
      setTimeout(function() {
        gulp.start('build');
      }, 300);
    }).catch(function(error) {
      console.log(error);
    });
});

gulp.task('build', function() {
  rollup.rollup(config.build)
    .then(function(bundle) {
      // Generate bundle + sourcemap
      let result = bundle.generate({
        // output format - 'amd', 'cjs', 'es', 'iife', 'umd'
        format: 'iife',
        moduleName: config.build.moduleName,
      });
      bundle.write({
        format: 'iife',
        moduleName: config.build.moduleName,
        banner: config.banner,
        sourceMap: 'inline',
        sourceMap: true,
        dest: 'build/' + config.build.moduleName + '.js', // Exit file
      });
      fs.createReadStream('app/index.html').pipe(fs.createWriteStream('build/index.html'));
      copyFileSync('app/index.html','build/index.html');
      fs.writeFileSync('dist/kmlPlayer.js', config.banner + '\n' + js_minify(result.code));
    }).then(function() {
      copyFileSync('lib/core/svgSprite/kmlPlayer.svg', 'dist/');
      copyFileSync('lib/core/svgSprite/kmlPlayer.svg', 'build/');
      copyFolderRecursiveSync('app/assets', 'dist/');
      copyFolderRecursiveSync('app/assets', 'build/');
      copyFileSync('app/index.html','dist/index.html');
      console.log(config.build.moduleName + ' builded');
    }).catch(function(error) {
      console.log(error);
    });
});

gulp.task('app', function() {
  rollup.rollup(config.app)
    .then(function(bundle) {
      // Generate bundle + sourcemap
      let result = bundle.generate({
        // output format - 'amd', 'cjs', 'es', 'iife', 'umd'
        format: 'iife',
        moduleName: config.build.moduleName,
      });
      bundle.write({
        format: 'iife',
        moduleName: config.build.moduleName,
        banner: config.banner,
        sourceMap: 'inline',
        sourceMap: true,
        dest: 'app/' + config.build.moduleName + '.js', // Exit file
      });
      fs.writeFileSync('dist/kmlPlayer.js', config.banner + '\n' + js_minify(result.code));
    }).then(function() {
      // fs.createReadStream('app/index.html').pipe(fs.createWriteStream('dist/index.html'));
      console.log(config.build.moduleName + ' builded');
    }).catch(function(error) {
      console.log(error);
    });
});

gulp.task('watch', function() {
  gulp.watch('lib/**/*.sss', ['css']);
  gulp.watch('app/**/*.sss', ['css']);

  gulp.watch('lib/**/*.js', ['compile']);
  gulp.watch('app/**/*.js', ['compile']);
});

gulp.task('default', function() {
  gulp.start('compile');
  gulp.start('css');
  gulp.start('watch');
});

gulp.start('default');