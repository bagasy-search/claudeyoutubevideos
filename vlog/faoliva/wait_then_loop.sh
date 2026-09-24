S=$1
while powershell -NoProfile -Command "if ((Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { \$_.CommandLine -match 'faoliva/plan_$S\.json clips' }).Count -gt 0) { exit 0 } else { exit 1 }"; do sleep 60; done
bash /d/Proyectos/video2-wt/faoliva/vlog/faoliva/scene_loop2.sh $S
