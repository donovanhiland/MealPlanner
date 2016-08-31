import gulp from 'gulp';
import concat from 'gulp-concat';
import plumber from 'gulp-plumber';
import watch from 'gulp-watch';
import sass from 'gulp-sass';
import babel from 'gulp-babel';

const paths = {
  jsSource: ['./src/client/app.module.js', './src/client/**/*.js'],
  serverSource: ['./src/server/**/*.js'],
  sassSource: ['./src/client/styles/master.scss', './src/client/styles/**/*.scss']
};

const jsCb = () => {
  return gulp.src(paths.jsSource)
  .pipe(plumber())
  .pipe(babel({
    presets: ["es2015"]
  }))
  .pipe(concat('bundle.js'))
  .pipe(gulp.dest('./dist/public'));
};

const serverCb = () => {
  return gulp.src(paths.serverSource)
  .pipe(plumber())
  .pipe(babel({
    presets: ["es2015"]
  }))
  .pipe(gulp.dest('./dist'));
};

const stylesCb = () => {
  return gulp.src(paths.sassSource)
  .pipe(sass().on('error', sass.logError))
  .pipe(concat('styles.css'))
  .pipe(gulp.dest('./dist/public/assets'));
};

const watchCb = () => {
  watch(paths.jsSource, () => { gulp.start('js') });
  watch(paths.serverSource, () => { gulp.start('server') });
  watch(paths.sassSource, () => { gulp.start('styles') });
};

gulp.task('js', jsCb);
gulp.task('server', serverCb);
gulp.task('styles', stylesCb);
gulp.task('watch', watchCb);

gulp.task('default', ['watch', 'js', 'server', 'styles']);
