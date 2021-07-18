@echo off
cmd /c yarn build
xcopy .env* build\ 
xcopy ace.cmd build\
md build\tmp
cd build 
cmd /c yarn install --production
echo.
cmd /c @ace migration:run
echo.
cmd /c yarn start
echo.
echo.
cd ..
