/* globals require */
//build related
var pkg = require('./package.json');
var gulp = require('gulp');
var rollup = require('rollup');
//js related
var babel = require('rollup-plugin-babel');
var uglify = require('uglify-js');
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

var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');

var default_sss = ['src/index.sss', 'src/core/**/*.sss'],
    default_js = [];

var modules = {
  sss: [],
  js: []
};

for (var i = 0, len = pkg.modules.length; i < len; i++) {
  modules.sss.push('src/modules/'+pkg.modules[i]+'/index.sss');
  modules.js.push('src/modules/'+pkg.modules[i]+'/index.js');
}

var config = {
  banner: '/*! ' + pkg.name + ' - v' + pkg.version + ' */',
  modules: {
    sss: [],
    js: []
  },
  compile: {
    moduleName: 'kmlPlayer',
    entry: 'src/index.js', // Entry file
    plugins: [
      nodeResolve({ jsnext: true, main: true }),
      commonjs(),
      babel({
        exclude: 'node_modules/**',
        plugins: [["transform-react-jsx", { "pragma":"h" }]]
      })
    ]
  },
  build: {
    moduleName: 'kmlPlayer',
    entry: './build/index.js', // Entry file
    plugins: [
      babel({
        exclude: 'node_modules/**',
        compact : true,
        presets: ['es2015-rollup'],
        plugins: [["transform-react-jsx", { "pragma":"h" }],['transform-es2015-classes', {loose: true}]] // needed to add support to classes in <=ie10
      })
    ]
  }
};

config.modules.sss = default_sss.concat(modules.sss);
config.modules.js = default_js.concat(modules.js);

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
    //postcssFont({hosted: '../src/fonts'}),
    cssnext({
      browsers: ['> 5%', 'last 2 versions', 'ie > 8', 'Firefox ESR', 'Opera 12.1']
    }),
    csswring
  ];
  return gulp.src(config.modules.sss)
    .pipe(postcss(processors))
    .pipe(sourcemaps.init())
    .pipe(concat('kmlPlayer.css'))
    .pipe(gulp.dest('./dist'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./test'))
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
        dest: 'build/index.js', // Exit file
      });
    }).then(function() {
      console.log(config.build.moduleName + ' js compiled');
      setTimeout(function(){gulp.start('build');},300);
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
        dest: 'test/' + config.build.moduleName + '.js', // Exit file
      });
      fs.writeFileSync('dist/kmlPlayer.js', config.banner + '\n' + js_minify(result.code));
    }).then(function() {
      //fs.createReadStream('index.html').pipe(fs.createWriteStream('build/index.html'));
      console.log(config.build.moduleName + ' builded');
    }).catch(function(error) {
      console.log(error);
    });
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.sss', ['css']);
  gulp.watch('src/**/*.js', ['compile']);
});

gulp.task('default', function() {
  gulp.start('compile');
  gulp.start('css');
  gulp.start('watch');
});

gulp.start('default');
