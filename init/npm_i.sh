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