[ -d node_modules ] && rm node_modules
ln -s node_modules_electron node_modules

./node_modules/typescript/bin/tsc -p tsconfig.json