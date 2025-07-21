import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from "@rollup/plugin-commonjs";
import nodePolyfills from 'rollup-plugin-polyfill-node';
import typescript from '@rollup/plugin-typescript';


export default {
    input: 'shared/content-script.ts',
    output: {
        file: 'shared/content-script.js',
        format: 'cjs'
    },
    plugins: [nodeResolve({
            browser: true,
            preferBuiltins: false
        }
    ), commonjs(), typescript(), nodePolyfills()
    ]
};