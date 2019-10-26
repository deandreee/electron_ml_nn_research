mkdir -p dist

# react imports have different import path (with ../)
# let's handle thisin a simple way, don't wanna mess with webpack 
cp ./init/index.html ./dist/index.html

# this needs to be in dist
# again, don't wanna mess with webpack wasm imports
cp ./node_modules/ml-xgboost/dist/wasm/xgboost.wasm ./dist/xgboost.wasm