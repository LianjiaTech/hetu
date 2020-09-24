require('module-alias').addAlias('~/src', __dirname + '/')
import '@babel/polyfill'

/*
|--------------------------------------------------------------------------
| Ace Setup
|--------------------------------------------------------------------------
|
| Ace is the command line utility to create and run terminal commands.
| Here we setup the environment and register ace commands.
|
*/
// https://adonisjs.com/docs/4.1/installation
// @ts-ignore
import ace from '@adonisjs/ace'

const registedCommandList = [
  // 任务调度
  './commands/task/manage', //  任务调度
  './commands/summary/develop_report', // 研发提效报告
  './commands/summary/online_report', // 上线报告
]

// register commands
for (let command of registedCommandList) {
  ace.addCommand(require(command)['default'])
}

// 引入全局模块
import '~/src/model/global'

// Boot ace to execute commands
ace.wireUpWithCommander()
ace.invoke()
