export const config = {
  watch: {
    exchange: "binance",
    currency: "USDT",
    asset: "BCC",
    tickrate: 60
  },
  paperTrader: {
    enabled: true,
    // report the profit in the currency or the asset?
    reportInCurrency: true,
    // start balance, on what the current balance is compared with
    simulationBalance: {
      // these are in the unit types configured in the watcher.
      asset: 0,
      currency: 1000
    },
    // how much fee in % does each trade cost?
    feeMaker: 0.15,
    feeTaker: 0.25,
    feeUsing: "maker",
    // how much slippage/spread should Gekko assume per trade?
    slippage: 0.05
  },
  performanceAnalyzer: {
    enabled: true,
    riskFreeReturn: 5
  }
};
