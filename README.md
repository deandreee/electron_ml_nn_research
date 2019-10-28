# Electron ML/NN Research for Crypto Trading

## Install

There is some magic behind the scenes to make this runnable on both Electron and Node. See `Magic` section, if you are interested, what's going on.

```bash
# Clone this repo
git clone git@github.com:deandreee/electron_ml_nn_research.git
# cd to repo
cd electron_ml_nn_research
# switch to specific node version (install nvm if don't already have)
nvm install 12.8.1
nvm use 12.8.1
# magic init script
./init/run.sh
```

## Run

It is heavily suggested to run this with VS Code to execute all the pre-launch/build tasks and use the right args automatically (defined in `.vscode/launch.json`)

1. Open VS Code
2. Go to Debug tab
3. Choose `ELECTRON` or `NODE` mode
4. Press F5
   1. In `ELECTRON` mode, you should see a chart after few seconds. If nothing happens, press Ctrl+Shift+I to open DevTools console and look for error. If there is message about "DevTools disconnected", press F5 and check console again.
   2. In `NODE` mode, you should see some output in console.

## Magic

Installing dependencies for Electron is not the easiest task.
Installing for both Electron and Node simultaneously is even more difficult.
I wanted the code to be runnable from both Electron and Node quickly, without a long rebuild, so I implemented a hack.

Native dependencies (C/C++) are the ones that cause problems. They need to be built for a specific Node version. And even though I have synced this project so that they both use the same Node version (12.8.1.), `NODE_MODULES_VERSION` is still not the same, therefore we need to install dependencies separately for both of them. `./init/run.sh` is configured to do that for you. First, it installs dependencies for Node, moves them to `node_modules_node`, then rebuilds for Electron and moves that to `node_modules_electron`. When you run the code, VS Code pre-launch tasks are configured to switch `node_modules` symlink to the right one.
