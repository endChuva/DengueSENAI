@echo off
echo Verificando se o Node.js e o npm estão instalados...

:: Verifica se o npm está instalado
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ERRO: npm não encontrado. Instale o Node.js antes de continuar.
    exit /b 1
)

echo Instalando as dependências do projeto...
npm install express body-parser mysql2

echo Dependências instaladas com sucesso!
pause
