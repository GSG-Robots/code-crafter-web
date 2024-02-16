npm i .

npm i -g webpack webpack-cli

if ($MODE == "development") then
    echo("Building development version")
    npm run build-dev
else
    echo("Building production version")
    npm run build
fi
