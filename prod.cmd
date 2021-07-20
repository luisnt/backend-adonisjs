@echo off
cmd /c yarn build
xcopy .env* build\ 
xcopy ace.cmd build\
xcopy cluster.js build\
md build\tmp
cd build 
cmd /c yarn install --production
echo.
cmd /c @ace migration:run
cmd /c @ace migration:run
echo.
cmd /c node cluster.js
echo.
echo.
cd ..
