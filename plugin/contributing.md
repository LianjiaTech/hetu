## 贡献指南

这篇指南会指导你如何为 河图 贡献一份自己的力量，请在你要提 issue 或者 pull request 之前花几分钟来阅读一遍这篇指南。

## 分支管理
1.  master为线上分支, dev为功能分支
2.  命名方式 `姓名拼音_dev_分支功能说明`
3.  不能直接向dev/master上提交代码, 需要先提Merge Request, 然后再合并到dev/master上
4.  commit前加上以下关键字, 标注提交类型
  
| 关键字 | 功能          |
| ------ | ------------- |
| feat   | 添加新功能    |
| format | 调整代码格式  |
| fix    | 修复错误      |
| docs   | 修订文档/注释 |
示例:  
- `feat: 初始化文档管理模块`
- `fix: Editor模块的type属性不能为ppt, 修复因此导致的编辑器初始化失败问题`
- `docs: 添加提交规范`

## 功能迭代流程
1. 基于`dev`分支新建功能分支, 例如 `pyy_dev_完善组件库`
2. 本地功能开发, 完善文档
3. 合并到`dev`分支

## Bugs
1. 基于`master`分支新建功能分支, 例如 `pyy_dev_完善组件库`
2. 修复bug, 更新`changeLog.md`日志
3. 合并到`master`分支

## Pull Request

**在你发送 Pull Request 之前**，请确认你是按照下面的步骤来做的：

1. 基于 正确的分支 做修改。

2. 在项目根目录下运行了 npm install。

3. 如果你修复了一个 bug 或者新增了一个功能，请确保做了相应的测试，这很重要。

## 开发流程

```
# 安装依赖
npm install 

# 打包npm包
npm run build

# 安装文档依赖
cd ./site && npm install

# 启动文档服务, 在根目录下执行, 会自动监听src目录下, *.md 文件的变化 
npm run start:site

# 打包文档
npm run build:site

# 发布文档, 发布权限, 请联系 @姚泽源
npm run deploy:site

# 发布npm包, 发布权限, 请联系 @姚泽源
npm run deploy:npm
```
