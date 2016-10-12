'use strict';

// Variable
var projectName = 'fk-template';
var src = 'src/';
var dist = 'dist/';

// Gulp
var gulp = require('gulp');
var gutil = require('gulp-util');
// System
var fs = require('fs');
var del = require('del');
// Pug (Jade)
var pug = require('gulp-pug');
// CSS
var cssBase64 = require('gulp-css-base64');
var autoprefixer = require('gulp-autoprefixer');
var cleancss = require('gulp-clean-css');
// SCSS
var sass = require('gulp-sass');
var compass = require('gulp-compass');
var scsslint = require('gulp-scss-lint');
var scss_stylish = require('gulp-scss-lint-stylish2');
var reporter = scss_stylish({errorsOnly: false});
// Images
var spritesmith = require('gulp.spritesmith');
// Favicon.ico
var realFavicon = require('gulp-real-favicon');
var FAVICON_DATA_FILE = src + 'faviconData.json';
// SVG
var svgmin = require('gulp-svgmin');
var svgstore = require('gulp-svgstore');
var raster = require('gulp-raster');
// JS(jQuery)
var uglify = require('gulp-uglify');
// Gulp useful plugins
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var size = require('gulp-size');
var zip = require('gulp-zip');
// LiveReload & Browser Syncing
var browserSync = require('browser-sync').create();
// Bower
var mainBowerFiles = require('main-bower-files');
// Modernizr
var modernizr = require('gulp-modernizr');
// FTP
var ftp = require('vinyl-ftp');

// Config
var config = {
  // Config Pug (Jade)
  pug: {pretty: true},
  // Config CSS Autoprefixer
  autoprefixer: {
    browsers: ['Explorer >= 6', 'Edge >= 12', 'Firefox >= 2', 'Chrome >= 4', 'Safari >= 3.1', 'Opera >= 10.1', 'iOS >= 3.2', 'OperaMini >= 8', 'Android >= 2.1', 'BlackBerry >= 7', 'OperaMobile >= 12', 'ChromeAndroid >= 47', 'FirefoxAndroid >= 42', 'ExplorerMobile >= 10'],
    cascade: false, add: true, remove: false
  },
  // Config CSS base64
  cssBase64: {
    baseDir: '../img/', maxWeightResource: 10 * 1024,
    extensionsAllowed: ['.svg', '.png', '.jpg', '.gif'] /*base64:skip*/
  },
  // Config CSS minify
  cleancss: {compatibility: 'ie7', debug: true},
  // Config SCSS(SASS)
  sass: {outputStyle: 'expanded', precision: 5, errLogToConsole: true, sourceComments: false},
  // Config Compass + SCSS(SASS)
  compass: {
    config_file: src + 'config.rb', require: false, environment: 'development', http_path: '/', project_path: src,
    css: src + 'css', font: src + 'fonts', image: src + 'img', javascript: src + 'js', sass: src + 'sass',
    style: 'expanded', relative: true, comments: true, logging: true, time: true, sourcemap: true, debug: false,
    task: 'compile' /*watch*/
  },
  // Config SCSS(SASS) Lint
  scsslint: {config: src + '.scss-lint.yml', maxBuffer: 300 * 1024, customReport: reporter.issues},
  // Config img
  sprite: {
    imgName: 'sprite.png', cssName: '_gulp-sprite.scss', imgPath: '../img/sprite.png',
    padding: 1, algorithm: 'binary-tree', cssFormat: 'scss',
    cssVarMap: function (sprite) {
      sprite.name = 's-' + sprite.name;
    }, cssTemplate: src + 'scss.template.handlebars',
    cssOpts: {
      cssSelector: function (sprite) {
        return '.icon-' + sprite.name;
      }
    }
  },
  // Config BrowserSync
  bs: {
    ui: false, server: {baseDir: src}, port: 8080, ghostMode: {clicks: false, forms: false, scroll: false},
    logLevel: 'info', logPrefix: 'BrowserSync', logFileChanges: true, online: false,
    reloadOnRestart: true, notify: true
  },
  // Config Bower
  bower: {
    paths: {bowerDirectory: 'bower_components', bowerrc: '.bowerrc', bowerJson: 'bower.json'},
    debugging: false, checkExistence: true, includeDev: true
  },
  // Config Gulp file size
  fileSize: {title: 'The size', gzip: false, pretty: true, showFiles: true, showTotal: true},
  // Config Gulp zip
  zip: {compress: true},
  // Config FTP
  ftp: JSON.parse(fs.readFileSync(src + 'ftp.json'))
};

var path = {
  src: {
    html: [src + '*.html'],
    pug: [src + 'pug/*.pug'],
    css: [src + 'css/*.css', '!' + src + 'css/*.min.css'],
    sass: [src + 'sass/**/*.scss'],
    sassLint: [src + 'sass/**/*.scss', '!' + src + 'sass/vendors/**/*.scss'],
    sprite: [src + 'img/sprite/*.*'],
    img: [src + 'img/**/*'],
    favicon: [src + 'img/favicon'],
    svg: src + 'img/svg/*.svg',
    js: [src + 'js/common.js'],
    zip: ['dist/**/{*,}.*', 'src/**/{*,}.*', '{*,}.*', '!*.{zip,rar}', '!.{git,idea,sass-cache}', '!{bower_components,node_modules}']
  },
  dest: {
    pug: src,
    css: src + 'css',
    sass: src + 'css',
    img: src + 'img/optimized',
    sprite: src + 'img',
    sprite_css: src + 'sass/module',
    svg: src + 'img',
    svgfallback: src + 'img/sprite',
    js: src + 'js',
    libs: src + 'js/libs',
    zip: './'
  },
  watch: {
    html: [src + '*.html'],
    pug: [src + 'pug/**/*.pug'],
    img: [src + 'img/**/*'],
    sprite: [src + 'img/sprite/*.*'],
    svg: [src + 'img/svg/*.svg'],
    css: [src + 'css/*.css', '!' + src + 'css/*.min.css'],
    sass: [src + 'sass/**/*.scss'],
    js: [src + 'js/common.js']
  },
  dist: {
    src: {
      css: [src + 'css/*.css'],
      fonts: [src + 'fonts/**/*.*'],
      img: [src + 'img/**/*.*', '!' + src + 'img/{sprite,svg,original}/**/*.*', '!' + src + 'img/{layout-home,favicon}.{jpg,png}'],
      js: [src + 'js/**/*.js', '!' + src + '/js/**/jquery.pixlayout.min.js'],
      html: [src + '*.html'],
      other: [src + 'favicon.ico', '.htaccess'],
      zip: [dist + '**/{*,}.*']
    },
    dest: {
      css: dist + 'css',
      fonts: dist + 'fonts',
      img: dist + 'img',
      js: dist + 'js',
      html: dist,
      zip: './'
    }
  }
};

function errorAlert(error) {
  notify.onError({title: 'Error', subtitle: 'Failure!', message: 'Check your terminal', sound: 'Sosumi'})(error); // Error Notification
  console.log(error.toString()); // Prints Error to Console
  this.emit('end'); // End function
}

function getFullDate() {
  var d = new Date(),
    year = d.getFullYear(),
    month = d.getMonth() < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1,
    date = d.getDate() < 10 ? '0' + d.getDate() : d.getDate(),
    hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours(),
    minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
  return date + '-' + month + '-' + year + '__' + hours + '.' + minutes;
}

gulp.task('server', function () {
  browserSync.init(config.bs);
});

gulp.task('libsBower', function () {
  return gulp.src(mainBowerFiles(config.bower))
    .pipe(plumber({errorHandler: errorAlert}))
    .pipe(gulp.dest(path.dest.libs));
});

gulp.task('svg-sprite', function () {
  return gulp.src([path.src.svg, '!' + src + 'img/svg/*_hover.svg'])
    .pipe(plumber({errorHandler: errorAlert}))
    .pipe(svgmin({js2svg: {pretty: false}}))
    .pipe(svgstore({inlineSvg: true}))
    .pipe(rename({basename: 'svg', prefix: '', suffix: '-sprite', extname: '.svg'}))
    .pipe(gulp.dest(path.dest.svg));
});

gulp.task('retina1dppx', function () {
  return gulp.src(path.src.svg)
    .pipe(plumber({errorHandler: errorAlert}))
    .pipe(raster({format: 'png', scale: 1}))
    .pipe(rename({extname: '.png'}))
    .pipe(gulp.dest(path.dest.svgfallback));
});

gulp.task('sprite', function () {
  var spriteData =
    gulp.src(path.src.sprite)
      .pipe(spritesmith(config.sprite));
  spriteData.img.pipe(gulp.dest(path.dest.sprite));
  return spriteData.css.pipe(gulp.dest(path.dest.sprite_css));
});

gulp.task('svg', gulp.series('svg-sprite', gulp.parallel('retina1dppx'), 'sprite'));


gulp.task('pug', function () {
  return gulp.src(path.src.pug)
    .pipe(plumber({errorHandler: errorAlert}))
    .pipe(pug(config.pug))
    .pipe(gulp.dest(path.dest.pug))
    .pipe(browserSync.stream());
});

gulp.task('sass', function () {
  return gulp.src(path.src.sass)
    .pipe(plumber({errorHandler: errorAlert}))
    .pipe(sourcemaps.init())
    .pipe(sass(config.sass).on('error', sass.logError))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(path.dest.sass))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

gulp.task('compass', function () {
  return gulp.src(path.src.sass)
    .pipe(plumber({errorHandler: errorAlert}))
    .pipe(compass(config.compass))
    .pipe(gulp.dest(path.dest.sass))
    .pipe(browserSync.stream());
});

gulp.task('css', function () {
  return gulp.src(path.src.css)
    .pipe(plumber({errorHandler: errorAlert}))
    .pipe(sourcemaps.init())
    //.pipe(autoprefixer(config.autoprefixer))
    //.pipe(cmq(config.cmd)) // Give error buffer.js:148 throw new TypeError('must start with number, buffer, array or string');
    .pipe(cssBase64(config.cssBase64))
    .pipe(cleancss(config.cleancss))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(path.dest.css));
});

gulp.task('js', function () {
  return gulp.src(path.src.js)
    .pipe(plumber({errorHandler: errorAlert}))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(path.dest.js));
});

gulp.task('autoprefixer', function () {
  gulp.src(['css/main.css'])
    .pipe(plumber({errorHandler: errorAlert}))
    .pipe(autoprefixer(config.autoprefixer))
    .pipe(gulp.dest(path.dest.css));
});

gulp.task('scss-lint', function () {
  return gulp.src(path.src.sassLint, {since: gulp.lastRun('scss-lint')})
    .pipe(plumber({errorHandler: errorAlert}))
    .pipe(scsslint(config.scsslint));
});

gulp.task('pug-watch', gulp.parallel('pug', function () {
  gulp.watch(path.watch.pug, gulp.series('pug'));
}));

gulp.task('compass-watch', gulp.parallel('compass', function () {
  gulp.watch(path.watch.sass, gulp.series('compass'));
}));

gulp.task('sass-watch', gulp.parallel('sass', function () {
  gulp.watch(path.watch.sass, gulp.series('sass'));
}));

gulp.task('scss-lint-watch', gulp.parallel('scss-lint', function () {
  gulp.watch(path.watch.sass, gulp.series('scss-lint'));
}));

gulp.task('modernizr', function () {
  gulp.src(path.src.js)
    .pipe(plumber({errorHandler: errorAlert}))
    .pipe(modernizr('modernizr.js', {
      "devFile": false,
      //"dest": "libs/modernizr.js",
      "crawl": false,
      "uglify": false,
      "useBuffers": false,
      "customTests": [],
      "tests": [
        "input",
        "inputtypes",
        "svg",
        "cssanimations",
        "backdropfilter",
        "borderradius",
        "boxshadow",
        "boxsizing",
        "csscalc",
        "checked",
        "cubicbezierrange",
        "ellipsis",
        "cssfilters",
        "flexbox",
        "flexwrap",
        "fontface",
        "generatedcontent",
        "cssgradients",
        "csshairline",
        "hsla",
        "cssinvalid",
        "lastchild",
        "cssmask",
        "mediaqueries",
        "multiplebgs",
        "nthchild",
        "opacity",
        "csspointerevents",
        "cssreflections",
        "regions",
        "rgba",
        "supports",
        "csstransforms",
        "csstransforms3d",
        "preserve3d",
        "csstransitions",
        "cssvalid",
        "placeholder",
        "scriptasync",
        "scriptdefer",
        "svgasimg",
        "svgclippaths",
        "svgfilters",
        "svgforeignobject",
        "inlinesvg",
        "smil",
        "textareamaxlength",
        "touchevents"
      ],
      "options": [
        "domPrefixes",
        "prefixes",
        "addTest",
        "atRule",
        "hasEvent",
        "mq",
        "prefixed",
        "prefixedCSS",
        "prefixedCSSValue",
        "testAllProps",
        "testProp",
        "testStyles",
        //"html5printshiv",
        //"html5shiv",
        "setClasses"
      ]
    }))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(path.dest.libs));
});

gulp.task('zip', function () {
  return gulp.src(path.src.zip, {base: '.'})
    .pipe(plumber({errorHandler: errorAlert}))
    .pipe(zip(projectName + '(' + getFullDate() + ').zip', config.zip))
    .pipe(size(config.fileSize))
    .pipe(gulp.dest(path.dest.zip));
});

// Generate the icons. This task takes a few seconds to complete.
// You should run it at least once to create the icons. Then,
// you should run it whenever RealFaviconGenerator updates its
// package (see the check-for-favicon-update task below).
gulp.task('generate-favicon', function (done) {
  realFavicon.generateFavicon({
    masterPicture: path.src.favicon + '.png', // 310x310 px
    dest: path.src.favicon.toString(),
    iconsPath: 'img/favicon',
    design: {
      ios: {
        pictureAspect: 'backgroundAndMargin',
        backgroundColor: '#ffffff',
        margin: '14%',
        assets: {
          ios6AndPriorIcons: false,
          ios7AndLaterIcons: false,
          precomposedIcons: false,
          declareOnlyDefaultIcon: true
        },
        appName: 'My app'
      },
      desktopBrowser: {},
      windows: {
        pictureAspect: 'whiteSilhouette',
        backgroundColor: '#da532c',
        onConflict: 'override',
        assets: {
          windows80Ie10Tile: false,
          windows10Ie11EdgeTiles: {
            small: false,
            medium: true,
            big: false,
            rectangle: false
          }
        },
        appName: 'My app'
      },
      androidChrome: {
        pictureAspect: 'noChange',
        themeColor: '#ffffff',
        manifest: {
          name: 'My app',
          display: 'standalone',
          orientation: 'notSet',
          onConflict: 'override',
          declared: true
        },
        assets: {
          legacyIcon: false,
          lowResolutionIcons: false
        }
      },
      safariPinnedTab: {
        pictureAspect: 'silhouette',
        themeColor: '#ff6347'
      }
    },
    settings: {
      scalingAlgorithm: 'Mitchell',
      errorOnImageTooSmall: false
    },
    markupFile: FAVICON_DATA_FILE
  }, function () {
    done();
  });
});

// Inject the favicon markups in your HTML pages. You should run
// this task whenever you modify a page. You can keep this task
// as is or refactor your existing HTML pipeline.
gulp.task('inject-favicon-markups', function () {
  return gulp.src([src + 'favicon.html']) // List of the HTML files where to inject favicon markups
    .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
    .pipe(gulp.dest(src)); // Path to the directory where to store the HTML files
});

// Check for updates on RealFaviconGenerator (think: Apple has just
// released a new Touch icon along with the latest version of iOS).
// Run this task from time to time. Ideally, make it part of your
// continuous integration system.
gulp.task('check-for-favicon-update', function (done) {
  var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
  realFavicon.checkForUpdates(currentVersion, function (err) {
    if (err) {
      throw err;
    }
  });
  done();
});

// Distribute functions
function cleanDist() {
  return del(path.dist.dest.html);
}

function cssDist() {
  return gulp.src(path.dist.src.css)
    .pipe(gulp.dest(path.dist.dest.css));
}

function fontsDist() {
  return gulp.src(path.dist.src.fonts)
    .pipe(gulp.dest(path.dist.dest.fonts));
}

function imgDist() {
  return gulp.src(path.dist.src.img)
    .pipe(gulp.dest(path.dist.dest.img));
}

function jsDist() {
  return gulp.src(path.dist.src.js)
    .pipe(gulp.dest(path.dist.dest.js));
}

function htmlDist() {
  return gulp.src(path.dist.src.html)
    .pipe(gulp.dest(path.dist.dest.html));
}

function otherDist() {
  return gulp.src(path.dist.src.other)
    .pipe(gulp.dest(path.dist.dest.html));
}

function zipDist() {
  return gulp.src(path.dist.src.zip, {base: '.'})
    .pipe(plumber({errorHandler: errorAlert}))
    .pipe(zip(projectName + '__dist(' + getFullDate() + ').zip', config.zip))
    .pipe(size(config.fileSize))
    .pipe(gulp.dest(path.dist.dest.zip));
}
// End Distribute functions

gulp.task('dist', gulp.series(cleanDist, gulp.parallel(cssDist, fontsDist, imgDist, jsDist, htmlDist, otherDist), zipDist));

gulp.task('deploy', gulp.series('dist', function () {
  var ftpConnection = ftp.create({
    host: config.ftp.host, // FTP host, default is localhost
    user: config.ftp.user, // FTP user, default is anonymous
    password: config.ftp.password, // FTP password, default is anonymous@
    port: 21, // FTP port, default is 21
    log: gutil.log, // Log function
    parallel: 10 // Number of parallel transfers, default is 3
  });
  // using base = '.' default is will transfer everything to /public_html correctly
  // turn off buffering in gulp.src for best performance
  return gulp.src(path.dist.src.zip, {base: './dist', buffer: false})
    .pipe(ftpConnection.newer('/' + projectName)) // only upload newer files
    .pipe(ftpConnection.dest('/' + projectName));
}));

gulp.task('build', gulp.series('deploy', cleanDist));

gulp.task('default', gulp.parallel('server', function () {
  gulp.watch(path.watch.pug, gulp.series('pug'));
  //gulp.watch(path.watch.sass, gulp.series('compass'));
  gulp.watch(path.watch.sass, gulp.series('sass'));
  gulp.watch(path.watch.sass, gulp.series('scss-lint'));
  gulp.watch(path.watch.sprite, gulp.series('sprite'));
  gulp.watch(path.watch.svg, gulp.series('svg'));
}));
