# 服务器启动脚本

> 返回[目录](../../../../README.md)

## 概述

一个用于启动服务器的脚本，他有以下功能
- 可自定义标题
- 自动重启
- 自动重启状态显示
- 过快重启自动停止

你可以参考下列注释来自定义你的服务器启动脚本
```
$title = "Server" # 服务器名
$reboot = New-Object psobject -Property @{ 
    interval         = 10 # 重启间隔 单位:秒
    min_interval     = 30 # 允许的最小间隔 单位:秒
    max_unexpected   = 3 # 允许的最大的过短重启次数 时间间隔小于min_interval

    total            = 0
    unexpected_total = 0
    last_time        = $null
}

function run_server { 
    # 修改下面的java为你要启动的应用程序 --jar为启动参数
    Start-Process -FilePath "java" -ArgumentList "--jar" -NoNewWindow -Wait
    return $LASTEXITCODE
}
```