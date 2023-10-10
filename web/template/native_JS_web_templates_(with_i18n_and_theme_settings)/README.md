# 原生JS网页模板(带i18n和主题设置)

> 返回[目录](../../../README.md#目录)

## 概述

这是一个基于原生JavaScript的网页模板. 已经搭建i18n和主题设置

## 文档

> 有其他问题请在issue提出

项目入口: `index.html`

### 翻译(i18n)

获得翻译: 为html元素添加tKey 例如tKey='theme'  
设置翻译: 在src/i18n文件夹内先设置supported_languages.json 添加一个的支持的语言如下所示
"zh-CN":语言国际通用的简写
"language_self_identification":语言在要如何被它自己描述
"path":语言文件的路径

```json
{
  "zh-CN": {
    "language_self_identification": "简体中文 (中国)",
    "path": "./src/i18n/zh-CN.json"
  }
}
```

然后在src/i18n文件夹内添加一个语言文件, 例如zh-CN.json  
其中所有html中包含的tKey都需要有一个对应的翻译  
(例如刚刚有一个tKey='theme', 那么在zh-CN.json中就需要有一个"theme":以及它对应的翻译)

```json
{
  "theme": "主题",
  "light": "浅色",
  "dark": "深色"
}
```
### 主题设置
每个主题都有一个对应的css文件, 例如light.css和dark.css  
其中使用css变量+css选择器实现  
通过覆盖css来实现颜色的切换  
所以请尽量使用颜色变量来设置颜色  
(例如: `color: var(--color-text);`)