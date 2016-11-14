//rollup
let rollup = require('rollup');
//rollup plugins
let nodeResolve = require('rollup-plugin-node-resolve');
let commonjs = require('rollup-plugin-commonjs');
let replace = require('rollup-plugin-replace');
let strip = require('rollup-plugin-strip');
let buble = require('rollup-plugin-buble');
let uglify = require('rollup-plugin-uglify');
let rollupJson = require('rollup-plugin-json');
let filesize = require('rollup-plugin-filesize');
let eslint = require('rollup-plugin-eslint');
//css related
let postcss = require('rollup-plugin-postcss-export');
let postcssImport = require('postcss-import');
let postcssCenter = require('postcss-center');
let postcssSass = require('precss');
let postcssNext = require('postcss-cssnext');
let postcssRemoveDuplicates = require('postcss-deduplicate');
let postcssMinifySelectors = require('postcss-minify-selectors');
let postcssDiscardDuplicates = require('postcss-discard-duplicates');
let perfectionist = require('perfectionist');
let postcssClean = require('postcss-clean');

let postCss_plugins = [
	postcssImport,
	postcssCenter,
	postcssSass,
	postcssMinifySelectors,
	postcssRemoveDuplicates,
	postcssDiscardDuplicates,
	postcssNext({
		browsers: ['> 5%', 'ie >= 9']
	})
];

let general = {
	sourceMap: true
}

if (process.env.NODE_ENV === 'production') {
	general.sourceMap = false;
	postCss_plugins.push(postcssClean({
		aggressiveMerging: true
	}));
} else {
	postCss_plugins.push(perfectionist);
}

// used to track the cache for subsequent bundles
let cache = null;
let rollitup = function(pkg, done) {
	rollup.rollup({
		// The bundle's starting point. This file will be
		// included, along with the minimum necessary code
		// from its dependencies
		entry: pkg.entry,
		// If you have a bundle you want to re-use (e.g., when using a watcher to rebuild as files change),
		// you can tell rollup use a previous bundle as its starting point.
		// This is entirely optional!
		cache: cache,
		plugins: [
			rollupJson(),
			postcss({
				plugins: postCss_plugins,
				output: pkg.dest.replace('.js', '.css')
			}),
			eslint(),
			(process.env.NODE_ENV === 'production' && strip({
				debugger: true,
				functions: ['console.log', 'assert.*', 'debug', 'alert'],
				sourceMap: false
			})),
			nodeResolve({
				jsnext: true,
				main: true,
				browser: true
			}),
			commonjs({
				exclude: 'node_modules/process-es6/**',
				include: []
			}),
			buble({
				transforms: {
					arrow: true,
					modules: true,
					classes: true,
					dangerousForOf: true
				}
			}),
			replace({
				__VERSION__: "1.0",
				'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
			}),
			(process.env.NODE_ENV === 'production' && uglify()),
			filesize()
		]
	}).then(function(bundle) {
		// Cache our bundle for later use (optional)
		cache = bundle;
		// rollup generate bundle
		bundle.write({
			banner: '/*! ' + pkg.name + ' - v' + pkg.version + ' */',
			moduleName: "kmlPlayer",
			format: "iife",
			dest: pkg.dest,
			sourceMap: true,
			sourceMapFile: pkg.dest + '.map'
		});
		if (typeof(done) == 'function') {
			done();
		}
	});
}
module.exports = rollitup;