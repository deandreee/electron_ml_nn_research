# electron_ml_nn_research

## Install

Due to difficulties with Electron in combination with some specific dependencies, installing this requires some manual steps.

```bash
# Clone this repo
git clone git@github.com:deandreee/electron_ml_nn_research.git
# cd to repo
cd electron_ml_nn_research
# switch to specific node version
nvm use 12.8.1
# install dependencies
npm i
# rebuild better-sqlite3 for electron
./node_modules/.bin/electron-rebuild
# copy index.html and xgboost.wasm
./init/run.sh
```

## Run

It is heavily suggested to run this with VS Code to execute all the pre-build tasks and use the right args automatically (defined in `.vscode/launch.json`)

1. Open VS Code
2. Go to Debug tab
3. Choose `ELECTRON` or `NODE` mode
4. Press F5
