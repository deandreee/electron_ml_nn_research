[ -d node_modules ] && rm node_modules
ln -s node_modules_node node_modules 

tsc -p tsconfig.be.json