
> Weather Template
> author: erduotong
# 简介

这是一套适用于和风天气api的天气系统，可以帮您在笔记系统中帮你获得天气，并且他具有以下优势：
- 自带天气主页预览
- 自带日记模板
- 数据本地化，减少天气API的调用次数，免费的也够用!
- 通过API实时获得地点，无需手动更改
- 模块化，若不满意可以自行拓展
效果图预览:![](imgs/Pasted%20image%2020240817141902.png)![](./imgs/Pasted%20image%2020240817141842.png)
# 开始使用
## 插件
需求如下的插件:
- customJS `刚需 主要模块依赖`
- dataview `主页的数据视图`
- templater `日记的天气视图`
请自行前往Obsidian插件市场下载

## 插件配置
### Templater
- 设置`Templae Folder Location`为你存放该仓库日记模板的文件夹
- 开启`Trigger Tem plater on new file creation`
- 设置`Script files folder location`为你存放[日记视图脚本](./scripts/templater/getDailyWeather.js)的文件夹
### customJS
- 设置`Folder`为你存放[核心模块](./scripts/modules/weather.js)的文件夹，也可以单独导入![](./imgs/Pasted%20image%2020240817142757.png)注: **folder前面不要加`/`**
### dataview
- 将最顶部的五个选项全部打开![](./imgs/Pasted%20image%2020240817142829.png)
## 脚本配置
### 核心模块
- 路径:[核心模块](./scripts/modules/weather.js)
#### 可配置项
你一共拥有以下可配置项，你可以用任何一个文本编辑器`推荐vscode`来打开查看:
![](./imgs/Pasted%20image%2020240817143043.png)
- weather_key : 你的和风天气api的key，具体请前往[和风天气官网](https://id.qweather.com/#/registe)
- weather_length : 你需要未来多少天的天气，对日记的天气预测(也就是提前创建未来的日记)和主页视图有影响
- weather_max_save: 最多保存多少个地点的天气信息，也就是你最多能在本地保存多少个地点的天气，方便将来减少API调用次数
- weather_dealy_time: 保存天气的延迟时间，也就是你获取一次天气后，多少**毫秒**后就执行一次保存操作
- location_timeout_time & weather_timeout_time : 决定你的位置信息和天气信息会多久后允许刷新，若时间不足则直接用之前的数据
- data_dir: 你要在哪里保存本地数据，一定要是**文件名路径**，也就是要精确到一个文件，可以不存在，但是路径一定要存在。推荐的后缀名是.json
> 剩余的例如修改api的也有注释，欢迎大佬们自己修改成喜欢的样子
#### 未完成功能
在模块中，我们可以找到一个叫iconToEmoji的函数:![1](./imgs/Pasted%20image%2020240817143708.png)
我们可以看到weather那一栏，目前并不完整，如果出现了目前没有的天气，那么就会出现"undefined weather!!!!!!!"而不是一个emoji，所以需要自行添加。
> Q: 如何添加？

1. ![](./imgs/Pasted%20image%2020240817143843.png)我们将光标移动到这附近，在阴下面添加一行
2. 写上`天气名: "Emoji图标",` 注意最后的逗号![](./imgs/Pasted%20image%2020240817144014.png)
## 日记视图和主页视图
- 日记视图:[日记视图脚本](./scripts/templater/getDailyWeather.js)
- 主页视图:[主页视图脚本](./scripts/dataview/weatherView.js)
可以自行查看并修改渲染的方式，从`weather`模块中获得的数据都是完整的和风天气返回的数据
dataview的调用方式:

```dataviewjs
await dv.view("./scripts/dataview/weatherView",)
```


如果一切都配置正确，上方应该可以正确的展示出视图
