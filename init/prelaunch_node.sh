[ -d node_modules ] && rm node_modules
ln -s node_modules_node node_modules 

./node_modules/typescript/bin/tsc -p tsconfig.be.json || {
    echo 'tsc failed!!!';
    exit 1; 
}

# tsc doesn't copy .js even with allowJs, need to do this manually
cp -r ./src/strat/gekko/indicators ./dist_be/strat/gekko/indicators
cp -r ./src/strat/gekko/utils ./dist_be/strat/gekko/utils