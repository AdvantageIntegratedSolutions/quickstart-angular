# quickstart
**QuickBase automatic build system**

quickstart is a local development environment and deployment tool for QuickBase. gulp-base utilizes gulp and its plugins to improve and automate the development environment and deployment for QuickBase.

## System Dependencies
* Node ^5.5.0

## Start New Project
* Create new repo on Github.
* Clone 'quickstart' repo.
```shell
  git clone https://github.com/AdvantageIntegratedSolutions/quickstart-angular.git <NEW APP NAME>
```

* Update the git origin remote with your app's repo url.
```shell
  git remote set-url origin <new repo git url>
```
* Run `npm install`

* Update configuration in config folder.

## Local Development
Start up a local server on "localhost:3000" with "gulp local" or "gulp watch".

Changes in the /app directory will trigger an automatic live-reload of your browser.

## Css & JavaScript
Sass and ES6 are totally allowed (but not mandatory).

To include your compiled JS and CSS, the following script includes can be found in the index.html file. This will work for both local devleopment and after deploying to QuickBase, as these paths are auto resolved to their corresponding QuickBase urls after running "gulp deploy".
```html
  <script src="https://s3.amazonaws.com/ais_libraries/BaseJS/x.x.x/base.min.js"></script>
  <script src="bundle.js"></script>
  <link rel="stylesheet" type="text/css" href="bundle.css">
```

## Modules
quickstart uses es6/requirejs modules via Browserify to compile your javascript files. To use Browserify give the "bootstrap" property in app.json the file path to the initialization javascript file for your app (the top of the .js file dependency tree).

## Deployment
Deploy to QuickBase with `gulp deploy`.

Deploying will automatically compile src code, push to QuickBase, and replace local paths in index.html with their corrseponding QuickBase urls for the bundled css and js files. HTML files are all uploaded to QB separately, so if you are referencing them in your code you will need to update those references manually to reflect their QB urls (for now, stay tuned for an update here).

## File Structure
All development has to be done inside the app/ directory, otherwise there are no enforced file structures. All files ending in .js will be run through Babel and Browserify, and all .css, .scss, or .sass files will be complied with Sass and sent through autoprefixer before being concatenated into a bundle.css file.

```
+-- dist ( production distribution, pages uploaded to QB )
|   +-- bundle.css ( compiled styles for production )
|   +-- bundle.js ( compiled js for local )
|   +-- index.html ( compiled html for local )
+-- build
|   +-- tasks ( all gulp tasks )
|   +-- paths.js ( defines file paths for gulp to reference )
+-- node_modules ( gulp dependencies )
+-- app
|   +-- layout
|   +-- shared
|   +-- styles
|   +-- index.html ( duh )
|   +-- main.js
|   +-- main.scss
+-- config
|   +-- app.config.js (store app settings)
|   +-- auth.config.js (store quickbase authentication incl realm, username, password, token)
|   +-- quickbase.config.js (store base.js config, tables, etc)
+-- tmp
|   +-- bundle.css ( compiled styles for local )
|   +-- bundle.js ( compiled js for local )
|   +-- index.html ( compiled html for local )
|   +-- templates.js ( compiled templates for local )
+-- package.json
+-- quickstart.config.js
+-- gulpfile.js ( loads the tasks defined in build/tasks/ )
+-- README.md ( fresh readme for project )
```