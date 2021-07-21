@echo off
@chcp 65001
cmd /c yarn
cmd /c ace build --production
xcopy .env* build\ 
xcopy cluster.js build\
xcopy *.cmd build\
xcopy *.lnk build\
md build\tmp
rd  ../../prod/server /S /Q > nul
md ../../prod/server
robocopy build/ ../../prod/server/ /e
cd ../../prod/server/
cmd /c start.cmd
cd ..
