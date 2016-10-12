# fk-template
[![Build Status](https://travis-ci.org/kudinovfedor/fk-template.svg?branch=master)](https://travis-ci.org/kudinovfedor/fk-template)
[![Dependency status](https://david-dm.org/kudinovfedor/fk-template.svg)](https://david-dm.org/kudinovfedor/fk-template)
[![devDependency Status](https://david-dm.org/kudinovfedor/fk-template/dev-status.svg)](https://david-dm.org/kudinovfedor/fk-template/?type=dev)

This project uses the Pug(Jade) for HTML, Sass + Compass for CSS, SMACSS structure with additions, Gulp - the streaming build system, Bower - package manager for the web
#### Installation all components on OS Windows
**[Install Ruby](http://rubyinstaller.org/downloads/)** **`v2.3.1`**<br/>
**[Install DevKit](http://rubyinstaller.org/downloads/)** `For use with Ruby 2.0 and above` **[optional]**<br/>
```sh
$ cd C:\DevKit
$ ruby dk.rb init
# open C:\DevKit\config.yml
# add this line and save:
- C:/Ruby23-x64
$ ruby dk.rb install
```
**[Install Node.js](https://nodejs.org/dist/latest-v4.x/)** **`v4`**

```sh
# install Compass, Sass, Pug(Jade), Gulp, Bower, scss_lint, htmlhint, jshint, eslint, dependencies
$ npm run set-all
# IF AN ERROR OCCURS, TRY THE CODE BELOW

# install Compass, Sass, scss_lint
$ gem update && gem update --system && gem install compass scss_lint

# install oily_png (must be installed DevKit) [optional]
$ gem install oily_png

# update npm
$ npm install -g npm

# install Pug(Jade), Gulp, Bower, htmlhint, jshint, eslint
$ npm install -g gulp-cli pug bower htmlhint jshint eslint

# install npm-check-updates [optional]
$ npm install -g npm-check-updates

# install dependencies listed in package.json
$ npm install

# install dependencies listed in bower.json
$ bower install
```
