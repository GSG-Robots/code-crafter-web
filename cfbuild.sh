npm i .

npm i -g webpack webpack-cli sass

if [ "$MODE" == "development" ] then
    npm run build-dev
else
    npm run build
fi
