import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import strip from 'rollup-plugin-strip';
import buble from 'rollup-plugin-buble';
import uglify from 'rollup-plugin-uglify';
import rollupJson from 'rollup-plugin-json';
import filesize from 'rollup-plugin-filesize';

import postcss from 'rollup-plugin-postcss-export';
import postcssImport from 'postcss-import';
import postcssCenter from 'postcss-center';
import postcssSass from 'precss';
import postcssNext from 'postcss-cssnext';
import postcssRemoveDuplicates from 'postcss-deduplicate';
import postcssMinifySelectors from 'postcss-minify-selectors';
import postcssClean from 'postcss-clean';

let postCss_plugins = [
	postcssImport,
	postcssCenter,
	postcssSass,
	postcssNext({
		browsers: ['> 5%', 'last 2 versions', 'ie > 8', 'Firefox ESR', 'Opera 12.1']
	}),
	postcssRemoveDuplicates,
	postcssMinifySelectors
];

let general = {
	sourceMap: true
}

if (process.env.NODE_ENV === 'production') {
	general.sourceMap = false;
	postCss_plugins.push(postcssClean);
}

export default {
	entry: 'app/index.js',
	plugins: [
		rollupJson(),
		postcss({
			plugins: postCss_plugins,
			extensions: ['.sss', '.css'],
			output: 'build/bundle.css'
		}),
		// eslint(),
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
		commonjs(),
		buble({
			transforms: {
				arrow: true,
				modules: true,
				classes: true,
				dangerousForOf: true
			}
		}),
		replace({
			ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
			__VERSION__: "1.0"
		}),
		(process.env.NODE_ENV === 'production' && uglify()),
		filesize()
	],
	moduleName: "kmlPlayer",
	format: "iife",
	dest: 'build/bundle.js',
	sourceMap: general.sourceMap,
	sourceMapFile: 'build/bundle.map'
}