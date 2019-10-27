[ -d node_modules ] && rm node_modules
ln -s node_modules_electron node_modules

tsc -p tsconfig.json