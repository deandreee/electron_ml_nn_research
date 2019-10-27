# cleanup if previous build
[ -d node_modules ] && rm node_modules
[ -d node_modules_node ] && rm -rf node_modules_node
[ -d node_modules_electron ] && rm -rf node_modules_electron

# normal install
npm i

# save node version
cp -r node_modules node_modules_node

# rebuild for electron
./node_modules/.bin/electron-rebuild
mv node_modules node_modules_electron

# init node symlink (doesn't matter which one, prelaunch tasks will override anyway)
ln -s node_modules_node node_modules

# pre-create dist dir
mkdir -p dist

# react imports have different import path (with ../)
# let's handle thisin a simple way, don't wanna mess with webpack 
cp ./init/index.html ./dist/index.html

# this needs to be in dist
# again, don't wanna mess with webpack wasm imports
cp ./node_modules/ml-xgboost/dist/wasm/xgboost.wasm ./dist/xgboost.wasm