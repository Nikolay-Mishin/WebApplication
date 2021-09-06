# webpack.config.js

```JavaScript
const webpack = require('webpack');
const path = require('path');

module.exports = {
    // configuration
};
```

### Mode

```JavaScript
module.exports = {
    mode: 'none', // development | production
};
```

### Output

```JavaScript
module.exports = {
    output: {
        filename: 'bundle.js',
    }
};
```

### Development

```JavaScript
module.exports = {
    devtool: 'source-map'
};
```

### Optimization

```JavaScript
module.exports = {
    optimization: {
        minimize: false,
    }
};
```

### Module

```JavaScript
module.exports = {
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        ['latest', { modules: false }],
                        'es2015',
                        'react'
                    ],
                },
            },
        ],
    }
};
```

### amd

```JavaScript
module.exports = {
    // amd: true,
    amd: {
        "define.amd": true,
        "require.amd": true,
        jQuery: true
    }
};
```

### Resolve

```JavaScript
module.exports = {
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
};
```

### Plugins

```JavaScript
module.exports = {
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
};
```

# Mode

Providing the mode configuration option tells webpack to use its built-in optimizations accordingly.

`string = 'production': 'none' | 'development' | 'production'`

### Usage

Just provide the `mode` option in the config:

```JavaScript
module.exports = {
  mode: 'development'
};
```

or pass it as a `CLI` argument:
https://webpack.js.org/api/cli/

```JavaScript
webpack --mode=development
```

The following string values are supported:

### `Table`

The following table explains other cases:

`Option` `Description`

If not set, webpack sets `production` as the default value for `mode`.

Please remember that setting `NODE_ENV` doesn't automatically set `mode`.

### Mode: development

```JavaScript
// webpack.development.config.js
module.exports = {
+ mode: 'development'
- devtool: 'eval',
- cache: true,
- performance: {
-   hints: false
- },
- output: {
-   pathinfo: true
- },
- optimization: {
-   namedModules: true,
-   namedChunks: true,
-   nodeEnv: 'development',
-   flagIncludedChunks: false,
-   occurrenceOrder: false,
-   sideEffects: false,
-   usedExports: false,
-   concatenateModules: false,
-   splitChunks: {
-     hidePathInfo: false,
-     minSize: 10000,
-     maxAsyncRequests: Infinity,
-     maxInitialRequests: Infinity,
-   },
-   noEmitOnErrors: false,
-   checkWasmTypes: false,
-   minimize: false,
-   removeAvailableModules: false
- },
- plugins: [
-   new webpack.NamedModulesPlugin(),
-   new webpack.NamedChunksPlugin(),
-   new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),
- ]
}
```

### Mode: production

```JavaScript
// webpack.production.config.js
module.exports = {
+  mode: 'production',
- performance: {
-   hints: 'warning'
- },
- output: {
-   pathinfo: false
- },
- optimization: {
-   namedModules: false,
-   namedChunks: false,
-   nodeEnv: 'production',
-   flagIncludedChunks: true,
-   occurrenceOrder: true,
-   sideEffects: true,
-   usedExports: true,
-   concatenateModules: true,
-   splitChunks: {
-     hidePathInfo: true,
-     minSize: 30000,
-     maxAsyncRequests: 5,
-     maxInitialRequests: 3,
-   },
-   noEmitOnErrors: true,
-   checkWasmTypes: true,
-   minimize: true,
- },
- plugins: [
-   new TerserPlugin(/* ... */),
-   new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
-   new webpack.optimize.ModuleConcatenationPlugin(),
-   new webpack.NoEmitOnErrorsPlugin()
- ]
}

### Mode: none

```JavaScript
// webpack.custom.config.js
module.exports = {
+ mode: 'none',
- performance: {
-  hints: false
- },
- optimization: {
-   flagIncludedChunks: false,
-   occurrenceOrder: false,
-   sideEffects: false,
-   usedExports: false,
-   concatenateModules: false,
-   splitChunks: {
-     hidePathInfo: false,
-     minSize: 10000,
-     maxAsyncRequests: Infinity,
-     maxInitialRequests: Infinity,
-   },
-   noEmitOnErrors: false,
-   checkWasmTypes: false,
-   minimize: false,
- },
- plugins: []
}
```

If you want to change the behavior according to the `mode` variable inside the `webpack.config.js`, you have to export a function instead of an object:

```JavaScript
var config = {
  entry: './app.js'
  //...
};

module.exports = (env, argv) => {

  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  if (argv.mode === 'production') {
    //...
  }

  return config;
};
```

### Further Reading
* `webpack default options (source code)`
https://github.com/webpack/webpack/blob/master/lib/WebpackOptionsDefaulter.js

# Entry and Context

The entry object is where webpack looks to start building the bundle. The context is an absolute string to the directory that contains the entry files.

### context

`object`

The base directory, an absolute path, for resolving entry points and loaders from configuration.

```JavaScript
module.exports = {
  //...
  context: path.resolve(__dirname, 'app')
};
```

By default the current directory is used, but it's recommended to pass a value in your configuration. This makes your configuration independent from CWD (current working directory).

### `entry`

`string [string]`
`object = { <key> string | [string] }`
`(function() => string | [string] | object = { <key> string | [string] })`

The point or points where to start the application bundling process. If an array is passed then all items will be processed.

A dynamically loaded module is not an entry point.

Simple rule: one entry point per HTML page. SPA: one entry point, MPA: multiple entry points.

```JavaScript
module.exports = {
  //...
  entry: {
    home: './home.js',
    about: './about.js',
    contact: './contact.js'
  }
};
```

### Naming

If a string or array of strings is passed, the chunk is named `main`. If an object is passed, each key is the name of a chunk, and the value describes the entry point for the chunk.

### Dynamic entry

If a function is passed then it will be invoked on every `make` event.
https://webpack.js.org/api/compiler-hooks/#make

Note that the make event triggers when webpack starts and for every invalidation when `watching for file changes`.
https://webpack.js.org/configuration/watch/

```JavaScript
module.exports = {
  //...
  entry: () => './demo'
};
```

or

```JavaScript
module.exports = {
  //...
  entry: () => new Promise((resolve) => resolve(['./demo', './demo2']))
};
```

For example: you can use dynamic entries to get the actual entries from an external source (remote server, file system content or database):

```JavaScript
module.exports = {
  entry() {
    // returns a promise that will be resolved with something
    // like ['src/main-layout.js', 'src/admin-layout.js']
    return fetchPathsFromSomeExternalSource(); 
  }
};
```

When combining with the `output.library` option: If an array is passed only the last item is exported.
https://webpack.js.org/configuration/output/

# Output

The top-level `output` key contains set of options instructing webpack on how and where it should output your bundles, assets and anything else you bundle or load with webpack.

### `output.filename`

`string`
`function (chunkData) => string`

This option determines the name of each output bundle. The bundle is written to the directory specified by the `output.path` option.
https://webpack.js.org/configuration/output/#outputpath

For a single `entry` point, this can be a static name.


```JavaScript
module.exports = {
  //...
  output: {
    filename: 'bundle.js'
  }
};
```

However, when creating multiple bundles via more than one entry point, code splitting, or various plugins, you should use one of the following substitutions to give each bundle a unique name...

Using entry name:

```JavaScript
module.exports = {
  //...
  output: {
    filename: '[name].bundle.js'
  }
};
```

Using internal chunk id:


```JavaScript
module.exports = {
  //...
  output: {
    filename: '[id].bundle.js'
  }
};
```

Using the unique hash generated for every build:

```JavaScript
module.exports = {
  //...
  output: {
    filename: '[name].[hash].bundle.js'
  }
};
```

Using hashes based on each chunks' content:

```JavaScript
module.exports = {
  //...
  output: {
    filename: '[chunkhash].bundle.js'
  }
};
```

Using hashes generated for extracted content:

```JavaScript
module.exports = {
  //...
  output: {
    filename: '[contenthash].bundle.css'
  }
};
```

Using function to return the filename:

```JavaScript
module.exports = {
  //...
  output: {
    filename: (chunkData) => {
      return chunkData.chunk.name === 'main' ? '[name].js': '[name]/[name].js';
    },
  }
};

```

Make sure to read the `Caching guide` for details. There are more steps involved than just setting this option.
https://webpack.js.org/guides/caching/

Note this option is called filename but you are still allowed to use something like 'js/[name]/bundle.js' to create a folder structure.

Note this option does not affect output files for on-demand-loaded chunks. For these files the `output.chunkFilename` option is used. Files created by loaders also aren't affected. In this case you would have to try the specific loader's available options.
https://webpack.js.org/configuration/output/#outputchunkfilename

The following substitutions are available in template strings (via webpack's internal `TemplatedPathPlugin`):
https://github.com/webpack/webpack/blob/master/lib/TemplatedPathPlugin.js

### `Table`

`Template` `Description`

### `output.chunkFilename`

`string = '[id].js'`

This option determines the name of non-entry chunk files. See `output.filename` option for details on the possible values.

Note that these filenames need to be generated at runtime to send the requests for chunks. Because of this, placeholders like `[name]` and `[chunkhash]` need to add a mapping from chunk id to placeholder value to the output bundle with the webpack runtime. This increases the size and may invalidate the bundle when placeholder value for any chunk changes.

By default `[id].js` is used or a value inferred from `output.filename` (`[name]` is replaced with `[id]` or `[id].` is prepended).

```JavaScript
module.exports = {
  //...
  output: {
    //...
    chunkFilename: '[id].js'
  }
};
```

# Resolve

`object`

Configure how modules are resolved. For example, when calling `import 'lodash'` in ES2015, the resolve options can change where webpack goes to look for `'lodash'` (see `modules`).
https://webpack.js.org/configuration/resolve/#resolvemodules

### `resolve.extensions`

Многие файлы конфигурации Webpack имеют свойство разрешения расширений с пустой строкой, как показано ниже. Пустая строка нужна, чтобы способствовать импорту без расширений вроде require(“./myJSFile”) или импортировать myJSFile из ./myJSFile без файловых расширений.

```JavaScript
resolve: {
    extensions: ['', '.js', '.jsx']
}
```

### `resolve.alias`

`object`

Create aliases to `import` or `require` certain modules more easily. For example, to alias a bunch of commonly used `src/` folders:

```JavaScript
module.exports = {
  //...
  resolve: {
    alias: {
      Utilities: path.resolve(__dirname, 'src/utilities/'),
      Templates: path.resolve(__dirname, 'src/templates/')
    }
  }
};
```

Now, instead of using relative paths when importing like so:

```JavaScript
import Utility from '../../utilities/utility';
```

you can use the alias:

```JavaScript
import Utility from 'Utilities/utility';
```

A trailing `$` can also be added to the given object's keys to signify an exact match:

```JavaScript
module.exports = {
  //...
  resolve: {
    alias: {
      xyz$: path.resolve(__dirname, 'path/to/file.js')
    }
  }
};
```

which would yield these results:

```JavaScript
// Exact match, so path/to/file.js is resolved and imported
import Test1 from 'xyz';
// Not an exact match, normal resolution takes place
import Test2 from 'xyz/file.js';
```

The following table explains other cases:

### `Table`

The following table explains other cases:

`alias:` `import 'xyz'` `import 'xyz/file.js'`

### `resolve.modules`

`[string] = ['node_modules']`

Tell webpack what directories should be searched when resolving modules.

Absolute and relative paths can both be used, but be aware that they will behave a bit differently.

A relative path will be scanned similarly to how Node scans for `node_modules`, by looking through the current directory as well as its ancestors (i.e. `./node_modules`, `../node_modules`, and on).

With an absolute path, it will only search in the given directory.

```JavaScript
module.exports = {
  //...
  resolve: {
    modules: ['node_modules']
  }
};
```

If you want to add a directory to search in that takes precedence over `node_modules/`:

```JavaScript
module.exports = {
  //...
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  }
};
```

# Watch and WatchOptions

webpack can watch files and recompile whenever they change. This page explains how to enable this and a couple of tweaks you can make if watching does not work properly for you.

### `watch`

`boolean = false`

Turn on watch mode. This means that after the initial build, webpack will continue to watch for changes in any of the resolved files.

```JavaScript
module.exports = {
  //...
  watch: true
};
```

In `webpack-dev-server` and `webpack-dev-middleware` watch mode is enabled by default.

https://github.com/webpack/webpack-dev-server
https://github.com/webpack/webpack-dev-middleware

### `watchOptions`

`object`

A set of options used to customize watch mode:

```JavaScript
module.exports = {
  //...
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  }
};
```

### `watchOptions.aggregateTimeout`

`number = 300`

Add a delay before rebuilding once the first file changed. This allows webpack to aggregate any other changes made during this time period into one rebuild. Pass a value in milliseconds:

```JavaScript
module.exports = {
  //...
  watchOptions: {
    aggregateTimeout: 600
  }
};
```

### `watchOptions.ignored`

`RegExp` `anymatch`
https://github.com/micromatch/anymatch

For some systems, watching many file systems can result in a lot of CPU or memory usage. It is possible to exclude a huge folder like `node_modules`:

```JavaScript
module.exports = {
  //...
  watchOptions: {
    ignored: /node_modules/
  }
};
```

It is also possible to have and use multiple `anymatch` patterns:

```JavaScript
module.exports = {
  //...
  watchOptions: {
    ignored: ['files/**/*.js', 'node_modules']
  }
};
```

If you use `require.context`, webpack will watch your entire directory. You will need to ignore files and/or directories so that unwanted changes will not trigger a rebuild.

### Windows Paths

Because webpack expects absolute paths for many config options such as `__dirname + '/app/folder'` the Windows `\` path separator can break some functionality.

Use the correct separators. I.e. `path.resolve(__dirname, 'app/folder')` or `path.join(__dirname, 'app', 'folder')`.

# Plugins

The `plugins` option is used to customize the webpack build process in a variety of ways. webpack comes with a variety built-in plugins available under `webpack.[plugin-name]`. See `Plugins page` for a list of plugins and documentation but note that there are a lot more out in the community.
https://webpack.js.org/plugins/

Note: This page only discusses using plugins, however if you are interested in writing your own please visit `Writing a Plugin`.
https://webpack.js.org/contribute/writing-a-plugin/

### `plugins`

`[Plugin]`

An array of webpack plugins. For example, `DefinePlugin` allows you to create global constants which can be configured at compile time. This can be useful for allowing different behavior between development builds and release builds.
https://webpack.js.org/plugins/define-plugin/

```JavaScript
module.exports = {
  //...
  plugins: [
    new webpack.DefinePlugin({
      // Definitions...
    })
  ]
};
```

A more complex example, using multiple plugins, might look something like this:

```JavaScript
var webpack = require('webpack');
// importing plugins that do not come by default in webpack
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');

// adding plugins to your configuration
module.exports = {
  //...
  plugins: [
    new ExtractTextPlugin({
      filename: 'build.min.css',
      allChunks: true,
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // compile time plugins
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
    }),
    // webpack-dev-server enhancement plugins
    new DashboardPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ]
};
```