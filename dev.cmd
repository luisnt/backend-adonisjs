@echo off
@chcp 65001
cmd /c yarn install
echo.
cmd /c @ace migration:rollback
cmd /c @ace migration:run
echo.
cmd /c yarn dev
echo.
echo.
cd ..
