@echo off
title TM FASHION HOUSE - Ready-to-Wear ^& Bespoke Tailoring
echo =======================================================================
echo          TM FASHION HOUSE - HAUTE COUTURE ^& READY-TO-WEAR
echo =======================================================================
echo.
echo Starting local fashion house server...
echo.

set AGY_NODE="C:\Users\HP\AppData\Roaming\Antigravity\bin\agy-node.cmd"

if exist %AGY_NODE% (
    start http://localhost:3000
    %AGY_NODE% server.js
) else (
    echo Opening index.html directly in your default browser...
    start index.html
)

pause
