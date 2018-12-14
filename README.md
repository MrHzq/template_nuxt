# Nuxt 项目模板

## 已有配置

1. `scss`：CSS 预处理器

## 未有配置

1. UI 框架

## 已有插件

1. 封装了`$api`接口请求方法，可通过`this.$api.login()`调用，具体代码请看[hzq-axios](https://github.com/MrHzq/hzq-axios)
1. 封装了`$tool`工具方法，可通过`this.$tool.checkValEmpty()`调用。目前只包含`validator.js`里面的方法，之后可以自己往`$tool`中添加方法，具体代码请看[hzq-tool](https://github.com/MrHzq/hzq-tool)
1. 封装了`$getItem,$setItem,$copy`三个常用方法，具体代码请看[hzq-tool](https://github.com/MrHzq/hzq-tool)

## 使用方式

1. 先安装脚手架[hzq-cli](https://www.npmjs.com/package/hzq-cli)：`npm i -g hzq-cli`
1. `h -V`：查看版本号，确保安装成功
1. `h i`：根据提示，选择框架`nuxt`即可
