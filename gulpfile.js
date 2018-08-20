var gulp = require('gulp')

gulp.task('hbs', function () {
  var handlebars = require('gulp-compile-handlebars')
  var hbsBlog = require('hbs-blog')
  var pageConfig = require('./src/config.json')

  var localHelper = {
    getUrl: require('./src/helper/getUrl')
  }

  var options = {
    ignorePartials: true,
    batch: ['./src/partials'],
    helpers: Object.assign(
      {},
      localHelper,
      hbsBlog.helper
    )
  }

  return gulp.src('./src/**/*.html')
    .pipe(hbsBlog.document.gulp.load())
    .pipe(handlebars(pageConfig, options))
    .pipe(hbsBlog.document.gulp.remove())
    .pipe(gulp.dest('web'))
})

gulp.task('images', function () {
  var imagemin = require('gulp-imagemin')
  var imageminMozjpeg = require('imagemin-mozjpeg')

  gulp.src('src/media/**/*')
    .pipe(imagemin([
      imageminMozjpeg({quality: 80})
    ]))
    .pipe(gulp.dest('web/assets/media'))
})

gulp.task('js', function () {
  var uglify = require('gulp-uglify')
  var concat = require('gulp-concat')

  return gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(concat('script.js'))
    .pipe(gulp.dest('web/assets/js'))
})

gulp.task('copy', function () {
  var gulpCopy = require('gulp-copy')
  var sourceFiles = ['']
  var destination = 'web/assets/lib'

  return gulp.src(sourceFiles)
    .pipe(gulpCopy(destination, {prefix: 3}))
})

gulp.task('css', function () {
  var postcss = require('gulp-postcss')
  var cssnano = require('cssnano')
  var sass = require('gulp-sass')

  var cssSrc = [
    './src/css/styles.scss',
    './src/css/specific.scss',
    './node_modules/normalize-css/normalize.css'
  ]

  return gulp.src(cssSrc)
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      require('autoprefixer'),
      cssnano()
    ]))
    .pipe(gulp.dest('web/assets/css'))
})

gulp.task('default', ['hbs', 'css'])
gulp.task('build', ['hbs', 'css', 'images'])
gulp.task('watch', function () {
  return gulp.watch('./src/**/*', ['hbs', 'css'])
})
