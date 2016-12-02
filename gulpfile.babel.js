import gulp from 'gulp';
// import concat from 'gulp-concat';
import plumber from 'gulp-plumber';
import babel from 'gulp-babel';
import webpack from 'webpack';
import path from 'path';
import schema from 'gulp-graphql';
import gutil from 'gulp-util';
import configs from './webpack.config.babel';

const frontendConfig = configs;
const paths = {
  frontend: './build/',
  server: './src/server/**/*.js',
  schema: './src/server/data/schema.js',
};

// Regenerate the graphql schema and recompile the frontend code that relies on schema.json
gulp.task('generate-schema', () => (
  gulp.src(paths.schema)
  .pipe(schema({
    json: true,
    graphql: true
  }))
  .on('error', console.log)
  .pipe(gulp.dest('./build/server/data'))
));

gulp.task('frontend', (callback) => {
  // run webpack
  webpack(frontendConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      // output options
    }));
    callback();
  });
});

gulp.task('backend', () => (
  gulp.src(paths.server)
    .pipe(plumber())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest('./build/server'))
));

// recompile the schema whenever .js files in data are updated
gulp.task('watch-schema', () => {
  gulp.watch(path.join(__dirname, './src/server/data', '**/*.js'), ['generate-schema']);
});

gulp.task('watch-backend', () => (
  gulp.watch(['./src/server/**/*.js'], ['backend'])
));

gulp.task('watch', ['watch-schema', 'watch-backend']);

const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  gulp.task('default', ['generate-schema', 'backend', 'watch']);
} else if (env === 'production') {
  gulp.task('default', ['generate-schema', 'frontend', 'backend']);
}
