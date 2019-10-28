[ -d node_modules ] && rm node_modules
ln -s node_modules_electron node_modules

./node_modules/typescript/bin/tsc -p tsconfig.json

# tsc doesn't copy .js even with allowJs, need to do this manually
cp -r ./src/strat/gekko/indicators ./dist/strat/gekko/indicators
cp -r ./src/strat/gekko/utils ./dist/strat/gekko/utils