import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import strip from 'rollup-plugin-strip';
import typescript from 'rollup-plugin-typescript';
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
import postcssDiscardDuplicates from 'postcss-discard-duplicates';
import perfectionist from 'perfectionist';
import postcssClean from 'postcss-clean';

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

export default {
	entry: 'app/index.ts',
	plugins: [
		rollupJson(),
		// TD: rollup-plugin-postcss-export update to support cache so that rollup can use the rollup's cache system
		// After this rollup should be used directly from/with JS API
		postcss({
			plugins: postCss_plugins,
			extensions: ['.sss', '.css'],
			output: 'build/bundle.css'
		}),
		(process.env.NODE_ENV === 'production' && strip({
			debugger: true,
			functions: ['console.log', 'assert.*', 'debug', 'alert'],
			sourceMap: false
		})),
		typescript({
			//default use tsconfig.json but can be ovverride here 
      		//typescript: require('some-typescript-fork') //default use TS 1.8.9 but can use other specific compiler version/fork
		}),
		nodeResolve({
			jsnext: true,
			main: true,
			browser: true
		}),
		commonjs({
			exclude: 'node_modules/process-es6/**',
			include: []
		}),
		replace({
			__VERSION__: "1.0",
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
		}),
		(process.env.NODE_ENV === 'production' && uglify()),
		filesize()
	],
	moduleName: "kmlPlayer",
	format: "iife",
	dest: 'build/bundle.js',
	sourceMap: true, //general.sourceMap,
	sourceMapFile: 'build/bundle.js.map'
}