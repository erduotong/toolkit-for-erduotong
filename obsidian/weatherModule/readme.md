# 天气模块

> 返回[目录](/README.md)
## 概述
这是一个适用于Obsidian的，基于customJS的天气模块  
你可以通过这个模块来获取天气信息，并用其他例如templater和dataView等插件来展示这些信息  
## 需求
- 和风天气API的key，具体获取方式请参考[和风天气官网](https://dev.qweather.com/)
- customJS插件，方便实现模块化，具体使用方式请参考customJS插件
## 使用
1. 新建一个customJS脚本，将[脚本文件](./weather.js)的内容复制到脚本中
2. 修改脚本中的`key`为你的和风天气API的key
3. 遵照文件顶部的文档注释来使用