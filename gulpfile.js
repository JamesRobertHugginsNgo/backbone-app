const autoPrefixer = require('gulp-autoprefixer'),
  babel = require('gulp-babel'),
  cssNano = require('gulp-cssnano'),
  del = require('del'),
  esLint = require('gulp-eslint'),
  gulp = require('gulp'),
  mustache = require('gulp-mustache'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  sourceMaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify'),
  webServer = require('gulp-webserver');

////////////////////////////////////////////////////////////////////////////////

gulp.task('cleanup', () => del(['./dist/**']));

////////////////////////////////////////////////////////////////////////////////

const jsGlob = './src/**/*.js';

const buildJS = () => gulp.src(jsGlob)
  .pipe(mustache())
  .pipe(esLint())
  .pipe(esLint.format())
  .pipe(babel())
  .pipe(gulp.dest('./dist/'))
  .pipe(rename((path) => path.basename += '.min'))
  .pipe(sourceMaps.init())
  .pipe(uglify())
  .pipe(sourceMaps.write('.'))
  .pipe(gulp.dest('./dist/'));

gulp.task('cleanBuildJS', ['cleanup'], () => buildJS());

////////////////////////////////////////////////////////////////////////////////

const cssGlob = ['./src/**/*.css'];

const buildCSS = () => gulp.src(cssGlob)
  .pipe(mustache())
  .pipe(autoPrefixer())
  .pipe(gulp.dest('./dist/'))
  .pipe(rename((path) => path.basename += '.min'))
  .pipe(sourceMaps.init())
  .pipe(cssNano())
  .pipe(sourceMaps.write('.'))
  .pipe(gulp.dest('./dist/'));

gulp.task('cleanBuildCSS', ['cleanup'], () => buildCSS());

////////////////////////////////////////////////////////////////////////////////

const scssGlob = ['./src/**/*.scss'];

const buildSCSS = () => gulp.src(scssGlob)
  .pipe(mustache())
  .pipe(sass())
  .pipe(autoPrefixer())
  .pipe(gulp.dest('./dist/'))
  .pipe(rename((path) => path.basename += '.min'))
  .pipe(sourceMaps.init())
  .pipe(cssNano())
  .pipe(sourceMaps.write('.'))
  .pipe(gulp.dest('./dist/'));

gulp.task('cleanBuildSCSS', ['cleanup'], () => buildSCSS());

////////////////////////////////////////////////////////////////////////////////

const docGlob = ['./src/**/*.html'];

const buildDoc = () => gulp.src(docGlob)
  .pipe(mustache())
  .pipe(gulp.dest('./dist/'));

gulp.task('cleanBuildDoc', ['cleanup'], () => buildDoc());

////////////////////////////////////////////////////////////////////////////////

gulp.task('copyBabelPolyfill', ['cleanup'], () => gulp
  .src('./node_modules/babel-polyfill/dist/polyfill.min.js')
  .pipe(gulp.dest('./dist/vendor/babel-polyfill/')));

gulp.task('copyBackbone', ['cleanup'], () => gulp
  .src('./node_modules/backbone/backbone-min.{js,map}')
  .pipe(gulp.dest('./dist/vendor/backbone/')));

gulp.task('copyBootstrap', ['cleanup'], () => gulp
  .src('./node_modules/bootstrap/dist/{css,js}/bootstrap.min.{css,js}*')
  .pipe(gulp.dest('./dist/vendor/bootstrap/')));

gulp.task('copyJQuery', ['cleanup'], () => gulp
  .src('./node_modules/jquery/dist/jquery.min.{js,map}')
  .pipe(gulp.dest('./dist/vendor/jquery/')));

gulp.task('copyUnderscore', ['cleanup'], () => gulp
  .src('./node_modules/underscore/underscore-min.{js,map}')
  .pipe(gulp.dest('./dist/vendor/underscore/')));

gulp.task('copyDependencies', ['cleanup', 'copyBabelPolyfill', 'copyBackbone', 'copyBootstrap', 'copyJQuery', 'copyUnderscore']);

////////////////////////////////////////////////////////////////////////////////

gulp.task('default', ['cleanup', 'cleanBuildJS', 'cleanBuildCSS', 'cleanBuildSCSS', 'cleanBuildDoc', 'copyDependencies']);

////////////////////////////////////////////////////////////////////////////////

gulp.task('serve', ['default'], () => {
  gulp.src('.')
    .pipe(webServer({
      directoryListing: {
        enable: true,
        path: '.'
      },
      livereload: true,
      open: true,
      port: 8080
    }));

  gulp.watch(jsGlob, () => buildJS());
  gulp.watch(cssGlob, () => buildCSS());
  gulp.watch(scssGlob, () => buildSCSS());
  gulp.watch(docGlob, () => buildDoc());
});
