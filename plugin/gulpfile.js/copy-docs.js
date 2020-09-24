const gulp = require('gulp')
const chalk = require('chalk')
const del = require('del')

async function cleanDocs(cb) {
  await del(['site/components/**/*'])
  cb()
}

function copyDocs(cb) {
  gulp
    .src('src/components/**/*.md')
    .pipe(gulp.dest('site/components'))
  cb()
}

if (process.argv.indexOf('-w') !== -1) {
  console.log(chalk.blue('正在监听文件变化'))
  gulp.watch('src/components/**/*.md', { delay: 1000 }, copyDocs)
}

exports.default = gulp.series(cleanDocs, copyDocs)
