@echo off
echo.
echo === Chatbase Proto Bridge Files Location ===
echo.
echo The files are in your WSL environment. Here's how to find them:
echo.
echo METHOD 1: WSL Network Path
echo ------------------------
echo 1. Open File Explorer
echo 2. In the address bar, type: \\wsl$
echo 3. Navigate to: Ubuntu\root\chatbase-proto-bridge
echo.
echo METHOD 2: Copy to your Desktop
echo ------------------------------
echo Run this command in WSL/Ubuntu terminal:
echo cp -r /root/chatbase-proto-bridge ~/../../mnt/c/Users/%USERNAME%/Desktop/
echo.
echo METHOD 3: Current Windows Path
echo -----------------------------
echo If you downloaded the files, check:
echo - Your Downloads folder
echo - Your Desktop
echo - C:\Users\%USERNAME%\chatbase-proto-bridge
echo.
echo FILES YOU NEED TO UPLOAD TO GITHUB:
echo ----------------------------------
echo 1. api\health.js (NEW FILE)
echo 2. index.html (NEW FILE)
echo 3. vercel.json (UPDATE EXISTING)
echo.
pause