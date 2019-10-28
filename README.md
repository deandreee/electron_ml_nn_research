# Electron ML/NN Research for Crypto Trading

Core idea: try different models (XGBoost/LSTM/LinReg/SVM/etc) to predict Crypto price movements (not the price itself!) based on features (usually technical indicators, like SMA, RSI, etc).

This is my personal testing ground, the goal here is to experiment, get results and evaluate ideas as fast possible, everything else is secondary. Therefor, a lot of configuration is simply comment/uncomment lines in code.

## Modes

Has 2 modes - UI (Electron) and Console (Node).

- UI (Electron) used for single runs when there is a need to inspect single chart visually, like looking at price and predicted direction (up/down/neutral).
- Console (Node) used for long running loops, e.g. Grid Tests or Genetic Algo (GA) optimization.

## Flow

Overall data/function flow is like this:

1. Query train+test data from SQLite DB
2. Calculate features/indicators
3. Train Model
4. Test/Evaluate Model
5. Display (chart/console) and save(csv) results depending if regression (MSE, R2) or classification (precision, recall, f-score)

## Features / Models

Each file under `/src/strat/run` is separate runnable model:

1. `runBatchedXG.ts` => runs XGBoost model

- Can switch between classification
- Modes: `Electron` / `Node`

2. `runBatchedLSTM.ts` => runs LSTM (TF/Keras) model

- Switch between different LSTM libs
  - Tensorflow (`mlLSTMTF.ts`)
  - Synaptic (`mlLSTMSynapticClass.ts`)
  - Neataptic (`mlLSTMNeatapticClass.ts`)
- For Tenforflow, has multiple switchable model config examples in `models/ml`, to switch, uncomment line in `mlLSTMTF.ts`, like:
  `import model from "./models/v5_VanillaClass";`

- Modes: `Electron` / `Node`

3. `runBatchedXG_all.ts` => loops through all features defined in features/index.ts (getAllPart1/2/3) and calculates MSE/R2 for test data set.

- Modes: `Node`

4. `runBatchedXG_wConfigGrid.ts` => takes grid of XGBoost params (eta, gamma, depth, etc) and loops through all of them, saving results in CSV.

- Modes: `Node`

5. `runBatchedXG_wGA.ts` => takes single feature and tries to GA optimize XGBoost params.

- Modes: `Node`

To switch between, uncomment the line in `strat/run.ts`
`import { runBatchedXG as runn } from "./run/runBatchedXG";`

## Config

## /run/models

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

## Data

For quick demo purposes, I've included a small SQLite data sample (in `data_demo`) with BTC/ETH/XRP 1m candles from 2018-03-01 to 2018-09-01.
