const shell = require('shelljs')

console.log('开始复制静态资源')

shell.mkdir('-p', 'dist/public/')
shell.cp('-Rf', 'src/public/*', 'dist/public/')
if (shell.test('-f', 'src/system_config.ini')) {
  shell.cp('-Rf', 'src/system_config.ini', 'dist/system_config.ini')
}

console.log('静态资源复制完毕')
