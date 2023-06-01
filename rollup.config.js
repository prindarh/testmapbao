import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import {
    uglify
} from 'rollup-plugin-uglify';
import json from '@rollup/plugin-json'
import copy from 'rollup-plugin-copy'

export default {
    input: `src/index.js`,
    output: [{
            dir: 'dist',
            format: 'es',
        },
        // {
        //     file: "dist/index.js",
        //     format: "cjs",
        // },
    ],
    plugins: [
        json(),
        resolve(),
        commonjs(),
        babel({
            exclude: 'node_modules/**',
            runtimeHelpers: true,
        }),
        uglify(),
        copy({
            targets: [{
                src: 'public/Cesium',
                dest: 'dist'
            }],
            verbose: true

        })
    ],
};