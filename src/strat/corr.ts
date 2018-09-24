import { times, round2 } from "./utils";
import { Series } from "pandas-js";
import * as regression from "regression";
import { Candle } from "./types";
import {
  getCandlePctChange,
  getMaxCandlePctChange,
  getAvgCandlePctChange,
  getPctChange
} from "./utils";
import { XmBase } from "./strats/ind";
import { pricesXAhead } from "./pricesXAhead";
import { linreg } from "./linreg";
import { linregSplitRSI } from "./linregSplitRSI";

// import { BB } from "../../../gekko-develop/strategies/indicators"; // babel polyfill error, let's fix later (only for MFI, can include TI lib only once)
const {
  MACD,
  PSAR_TI,
  PSARProps,
  RSI,
  LRC,
  BBANDS
} = require("../../../gekko-develop/strategies/indicators");
const {
  ZerolagHATEMA
} = require("../../../gekko-develop/strategies/indicators/lizard");

// let warmup = 30 * 15; // RSI min
// let warmup = 26 * 240; // MACD min

// warmup = wait for first candle
// skipstart = wait for ind to have enough

const warmup = 240; // ZLEMA
const skipStart = 120 * 60;
let extended = 240; // 1h

export interface LinRegResult {
  x: number[];
  y: number[];
  regEquation: number[];
  r2: number;
  corr: number;
  name: string;
}

export const corr = (candles: Candle[]) => {
  const xmRsi = new XmBase(60, times(60).map(x => new RSI(20)));
  // const xmVixFix = new XmBase(
  //   120,
  //   times(120).map(
  //     x => new VixFix({ pd: 22, bbl: 20, mult: 2.0, lb: 50, ph: 0.85 })
  //   )
  // );
  const lrc60 = new LRC(60);
  const lrc120 = new LRC(120);
  const lrc240 = new LRC(240);

  const zlema60Fast = new XmBase(
    120,
    times(120).map(x => new ZerolagHATEMA(20))
  );
  const zlema60Slow = new XmBase(
    120,
    times(120).map(x => new ZerolagHATEMA(60))
  );

  // const mfi = new XmBase(60, times(60).map(x => new MFI(15)));
  const bbands = new XmBase(
    60,
    times(60).map(x => new BBANDS({ TimePeriod: 20, NbDevUp: 2, NbDevDn: 2 }))
  );
  const macd60 = new XmBase(
    60,
    times(60).map(x => new MACD({ short: 12, long: 26, signal: 9 }))
  );

  const macd120 = new XmBase(
    120,
    times(120).map(x => new MACD({ short: 12, long: 26, signal: 9 }))
  );

  const macdHistoLrc = new XmBase(120, times(120).map(x => new LRC(12)));

  const macdHistoLrcSlow = new XmBase(120, times(120).map(x => new LRC(16)));

  const macd240 = new XmBase(
    240,
    times(240).map(x => new MACD({ short: 12, long: 26, signal: 9 }))
  );

  const macd60_PSAR = new PSAR_TI(PSARProps._0_0001, {
    resultHistory: true
  });

  const pctChange10m: number[] = [];
  const pctChange30m: number[] = [];
  const pctChange60m: number[] = [];
  const pctChange120m: number[] = [];
  const pctChange180m: number[] = [];
  const pctChange240m: number[] = [];

  let rsiDropCount = 0;
  let rsiNoDropCount = 0;

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];

    if (i < warmup || i >= candles.length - extended) {
      candle.ind = {};
      continue; // history warmup
    }

    candle.ind = {
      rsi: xmRsi.update(candle),
      // vixFix: xmVixFix.update(candle),
      lrc60: lrc60.update(candle.close),
      lrc120: lrc120.update(candle.close),
      lrc240: lrc240.update(candle.close),
      zlema60Fast: zlema60Fast.update(candle),
      zlema60Slow: zlema60Slow.update(candle),
      // mfi: mfi.update(candle),
      bbands: bbands.update(candle, "close"),
      macd60: macd60.update(candle, "close"),
      macd120: macd120.update(candle, "close"),
      macd240: macd240.update(candle, "close"),
      macdHistoLrc: macdHistoLrc.update(candle, "close"),
      macdHistoLrcSlow: macdHistoLrcSlow.update(candle, "close")
    };

    candle.pctChange60m = getCandlePctChange(candles, i + 60, i);

    pctChange10m.push(getCandlePctChange(candles, i + 10, i));
    pctChange30m.push(getCandlePctChange(candles, i + 30, i));
    pctChange60m.push(getCandlePctChange(candles, i + 60, i));
    pctChange120m.push(getAvgCandlePctChange(candles, i, i + 100, i + 140));
    pctChange180m.push(getCandlePctChange(candles, i + 180, i));
    pctChange240m.push(getCandlePctChange(candles, i + 240, i));
  }

  // console.log("drop vs no drop: ", rsiDropCount, rsiNoDropCount);

  const candlesActual = candles.filter(
    (x, i) => !(i < warmup + skipStart || i >= candles.length - extended)
  );
  const candlesActualExtended = candles.filter(
    (x, i) => !(i < warmup + skipStart)
  );

  // const rsi = new Series(candlesActual.map(x => (x.ind.rsi > 80 ? 1 : 0))); // this binary version might be worth trying
  const rsi = new Series(candlesActual.map(x => x.ind.rsi));
  const vixFix = new Series(candlesActual.map(x => x.ind.vixFix));
  const lrc60_ = new Series(candlesActual.map(x => x.ind.lrc60.result));
  const lrc120_ = new Series(candlesActual.map(x => x.ind.lrc120.result));
  const lrc240_ = new Series(candlesActual.map(x => x.ind.lrc240.result));

  const pctChange10m_ = pctChange10m.slice(skipStart);
  const pctChange30m_ = pctChange30m.slice(skipStart);
  const pctChange60m_ = pctChange60m.slice(skipStart);
  const pctChange120m_ = pctChange120m.slice(skipStart);
  const pctChange180m_ = pctChange180m.slice(skipStart);
  const pctChange240m_ = pctChange240m.slice(skipStart);

  pricesXAhead(candlesActual, candlesActualExtended);

  // linreg(
  //   candlesActual,
  //   x => x.ind.lrc240 && x.ind.lrc240.result,
  //   pctChange10m_,
  //   "reg lrc240 pctChange10m"
  // );

  // linreg(
  //   candlesActual,
  //   x => x.ind.lrc240 && x.ind.lrc240.result,
  //   pctChange120m_,
  //   "reg lrc240 pctChange120m"
  // );

  // linreg(
  //   candlesActual,
  //   x => x.ind.lrc240 && x.ind.lrc240.result,
  //   pctChange240m_,
  //   "reg lrc240 pctChange240m"
  // );

  // LRC pct change, could be useful later
  // {
  //   const lrc240PctChange: number[] = [];
  //   for (let i = 240; i < candlesActual.length; i++) {
  //     lrc240PctChange.push(
  //       getPctChange(
  //         candlesActual[i].ind.lrc240.result,
  //         candlesActual[i - 240].ind.lrc240.result
  //       )
  //     );
  //   }

  const linRegs = [];

  linreg(candlesActual, x => x.ind.rsi, pctChange60m_, "reg_rsi_pctChange60m");

  linreg(candlesActual, x => x.ind.rsi, pctChange10m_, "RSI vs 10m");
  linreg(candlesActual, x => x.ind.rsi, pctChange60m_, "RSI vs 60m");
  linreg(candlesActual, x => x.ind.rsi, pctChange120m_, "RSI vs 120m");
  linreg(candlesActual, x => x.ind.rsi, pctChange240m_, "RSI vs 240m");

  linregSplitRSI(
    candlesActual,
    x => x.ind.rsi,
    pctChange120m_,
    "reg SPLIT RSI 120m"
  );

  linregSplitRSI(
    candlesActual,
    x => x.ind.rsi,
    pctChange240m_,
    "reg SPLIT RSI 240m"
  );

  linreg(
    candlesActual,
    x => x.ind.lrc60 && x.ind.lrc60.result,
    pctChange120m_,
    "reg_lrc60_pctChange120m"
  );

  linreg(
    candlesActual,
    x => x.ind.mfi,
    pctChange120m_,
    "reg_mfi_pctChange120m"
  );

  /// VixFix ///

  linreg(
    candlesActual,
    x => x.ind.vixFix,
    pctChange60m_,
    "reg_vixFix_pctChange60m"
  );

  linreg(
    candlesActual,
    x => x.ind.vixFix,
    pctChange120m_,
    "reg_vixFix_pctChange120m"
  );

  linreg(
    candlesActual,
    x => x.ind.vixFix,
    pctChange240m_,
    "reg_vixFix_pctChange240m"
  );

  /// BBands ///

  linreg(
    candlesActual,
    x => x.ind.bbands.upper - x.ind.bbands.lower,
    pctChange10m_,
    "reg_bbands_pctChange10m"
  );

  linreg(
    candlesActual,
    x => x.ind.bbands.upper - x.ind.bbands.lower,
    pctChange60m_,
    "reg_bbands_pctChange60m"
  );

  linreg(
    candlesActual,
    x => x.ind.bbands.upper - x.ind.bbands.lower,
    pctChange120m_,
    "reg_bbands_pctChange120m"
  );

  linreg(
    candlesActual,
    x => x.ind.bbands.upper - x.ind.bbands.lower,
    pctChange240m_,
    "BBands vs 240m"
  );

  /// MACD ///

  linreg(
    candlesActual,
    x => round2(x.ind.macd120.histo),
    pctChange10m_,
    "MACD vs 10m"
  );

  linreg(
    candlesActual,
    x => round2(x.ind.macd120.histo),
    pctChange60m_,
    "MACD vs 60m"
  );

  linreg(
    candlesActual,
    x => round2(x.ind.macd120.histo),
    pctChange120m_,
    "MACD vs 120m"
  );

  linreg(
    candlesActual,
    x => round2(x.ind.macd120.histo),
    pctChange240m_,
    "MACD vs 240m"
  );

  /// ZLEMA ///

  linreg(
    candlesActual,
    x => x.ind.zlema60Slow - x.ind.zlema60Fast,
    pctChange10m_,
    "ZLEMA vs 10m"
  );

  linreg(
    candlesActual,
    x => x.ind.zlema60Slow - x.ind.zlema60Fast,
    pctChange60m_,
    "ZLEMA vs 60m"
  );

  linreg(
    candlesActual,
    x => x.ind.zlema60Slow - x.ind.zlema60Fast,
    pctChange120m_,
    "ZLEMA vs 120m"
  );

  linreg(
    candlesActual,
    x => x.ind.zlema60Slow - x.ind.zlema60Fast,
    pctChange240m_,
    "ZLEMA vs 240m"
  );

  /// MACD LRC ///
  linRegs.push(
    linreg(
      candlesActual,
      x => x.ind.macdHistoLrcSlow - x.ind.macdHistoLrc,
      pctChange10m_,
      "MACD LRC vs 10m"
    )
  );
  linRegs.push(
    linreg(
      candlesActual,
      x => x.ind.macdHistoLrcSlow - x.ind.macdHistoLrc,
      pctChange60m_,
      "MACD LRC vs 60m"
    )
  );
  linRegs.push(
    linreg(
      candlesActual,
      x => x.ind.macdHistoLrcSlow - x.ind.macdHistoLrc,
      pctChange120m_,
      "MACD LRC vs 120m"
    )
  );
  linRegs.push(
    linreg(
      candlesActual,
      x => x.ind.macdHistoLrcSlow - x.ind.macdHistoLrc,
      pctChange240m_,
      "MACD LRC vs 240m"
    )
  );

  return linRegs;
};
