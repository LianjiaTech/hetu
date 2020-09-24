const gulp = require('gulp')

function copyTypes(cb) {
  gulp.src('src/**/*.d.ts').pipe(gulp.dest('dist'))
  cb()
}

exports.default = copyTypes
