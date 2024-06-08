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
function update_title {
    param(
        [string]$extra_title
    )
    if ($extra_title -eq $null) {
        $Host.UI.RawUI.WindowTitle = $title
    }
    else {
        $Host.UI.RawUI.WindowTitle = "$title | $extra_title "
    }
}
 
function display_start_info {
    Write-Host "-----------------------"
    Write-Host "- "
    Write-Host "- 正在启动 $title..."
    Write-Host "- 重启次数:$($reboot.total)"
    if ($null -ne $reboot.last_time) {
        Write-Host "- 上次重启时间: $($reboot.last_time)"
    }               
    if ($reboot.unexpected_total -gt 0) {
        Write-Host "- ⚠️存在过短重启，次数为$($reboot.unexpected_total)"
        Write-Host "- 剩余尝试次数: $($reboot.max_unexpected - $reboot.unexpected_total)"
    }
    Write-Host "- "
    Write-Host "-----------------------"

}
function display_reboot_info {
    param(
        [int]$return_code
    )
    if ($reboot.unexpected_total -gt 0) {
        update_title -extra_title "⚠️"
    }
    else {
        update_title -extra_title "✅"
    }
    Write-Host "-----------------------"
    Write-Host "- "
    Write-Host "- 服务器已关闭，返回代码 $return_code"
    Write-Host "- 即将在$($reboot.interval)秒后重启"
    Write-Host "- 按任意键跳过重启,或按Ctrl+C关闭服务端"
    Write-Host "- "
    Write-Host "-----------------------"
    timeout -t $reboot.interval

}
function exit_with_error {
    param(
        [int]$return_code
    )
    update_title -extra_title "❌"
    Write-Host "-----------------------"
    Write-Host "- "
    Write-Host "- 短期内重启次数过多，已停止服务端"
    Write-Host "- 重启次数:$($reboot.total)"
    Write-Host "- 退出代码: $return_code"
    Write-Host "- 请检查服务端是否正常"
    Write-Host "- 按Enter退出"
    Write-Host "- "
    Write-Host "-----------------------"
    Pause
    exit 1 
} 
update_title -extra_title "✅"
while (1) {
    display_start_info
    if ($reboot.total -gt 0 ) {
        $reboot.last_time = Get-Date  
          
    }
    $result = run_server
    if ($null -ne $reboot.last_time) {
        $currentDate = Get-Date
        if (( $currentDate - $reboot.last_time).TotalSeconds -lt $reboot.min_interval) {
            $reboot.unexpected_total += 1
        }
        else {
            $reboot.unexpected_total = 0
        }
    }
    if ($reboot.unexpected_total -gt $reboot.max_unexpected) {
        exit_with_error -return_code $result
    }
    display_reboot_info -return_code $result   
    $reboot.total += 1
}
