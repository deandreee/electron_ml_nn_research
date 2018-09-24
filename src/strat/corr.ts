import { round2 } from "./utils";
import { Candle } from "./types";
import { getCandlePctChange, getAvgCandlePctChange } from "./utils";
import { linreg } from "./linreg";
import { linregSplitRSI } from "./linregSplitRSI";

const {
  XmBase,
  WaveManager
} = require("../../../gekko-develop/strategies/utils");

const {
  MACD,
  RSI,
  LRC,
  BBANDS,
  VixFix,
  MFI
} = require("../../../gekko-develop/strategies/indicators");
const {
  ZerolagHATEMA
} = require("../../../gekko-develop/strategies/indicators/lizard");

// warmup = wait for first candle
// skipstart = wait for ind to have enough

// export const WARMUP = 240; // => biggest candle used
export const WARMUP_IND = 120 * 60; // => ind ready
export const EXTENDED = 1500; // 1h

export interface LinRegResult {
  x: number[];
  y: number[];
  regEquation: number[];
  r2: number;
  corr: number;
  name: string;
}

export const corr = (candles: Candle[]) => {
  const waveManager10 = new WaveManager(10);
  const waveManager60 = new WaveManager(60);
  const waveManager120 = new WaveManager(120);

  const xmRsi = new XmBase(waveManager60, () => new RSI({ interval: 20 }));
  const xmVixFix = new XmBase(
    waveManager120,
    () => new VixFix({ pd: 22, bbl: 20, mult: 2.0, lb: 50, ph: 0.85 })
  );

  const lrc60 = new XmBase(waveManager60, () => new LRC(60));
  const lrc120 = new XmBase(waveManager120, () => new LRC(60));

  const zlema60Fast = new XmBase(waveManager120, () => new ZerolagHATEMA(20));
  const zlema60Slow = new XmBase(waveManager120, () => new ZerolagHATEMA(60));

  const mfi = new XmBase(waveManager120, () => new MFI(15));
  const bbands = new XmBase(
    waveManager60,
    () => new BBANDS({ TimePeriod: 20, NbDevUp: 2, NbDevDn: 2 })
  );

  const macd60 = new XmBase(
    waveManager60,
    () => new MACD({ short: 12, long: 26, signal: 9 })
  );

  const macd120 = new XmBase(
    waveManager120,
    () => new MACD({ short: 12, long: 26, signal: 9 })
  );

  const macdHistoLrc = new XmBase(waveManager120, () => new LRC(12));
  const macdHistoLrcSlow = new XmBase(waveManager120, () => new LRC(16));

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];

    if (i >= candles.length - EXTENDED) {
      // only for pct change, not needed
      candle.ind = {};
      continue;
    }

    const bigCandle10 = waveManager10.update(candle);
    const bigCandle60 = waveManager60.update(candle);
    const bigCandle120 = waveManager120.update(candle);

    if (!bigCandle10 || !bigCandle60 || !bigCandle120) {
      continue;
    }

    candle.ind = {
      rsi: xmRsi.update(bigCandle60),
      vixFix: xmVixFix.update(bigCandle120),
      lrc60: lrc60.update(bigCandle60.close),
      lrc120: lrc120.update(bigCandle120.close),
      zlema60Fast: zlema60Fast.update(bigCandle60),
      zlema60Slow: zlema60Slow.update(bigCandle60),
      mfi: mfi.update(bigCandle120),
      bbands: bbands.update(bigCandle60.close),
      macd60: macd60.update(bigCandle60.close),
      macd120: macd120.update(bigCandle120.close)
    };

    candle.ind.macdHistoLrc = macdHistoLrc.update(
      candle.ind.macd120 && candle.ind.macd120.histo
    );
    candle.ind.macdHistoLrcSlow = macdHistoLrcSlow.update(
      candle.ind.macd120 && candle.ind.macd120.histo
    );

    candle.pctChange60m = getCandlePctChange(candles, i + 60, i);

    candle.pctChange = {
      _10m: getCandlePctChange(candles, i + 10, i),
      _60m: getAvgCandlePctChange(candles, i, i + 50, i + 70),
      _120m: getAvgCandlePctChange(candles, i, i + 100, i + 140),
      _240m: getAvgCandlePctChange(candles, i, i + 220, i + 260),
      _480m: getAvgCandlePctChange(candles, i, i + 450, i + 500),
      _24h: getAvgCandlePctChange(candles, i, i + 1400, i + 1500)
    };
  }

  const candlesActual = candles.filter(
    (x, i) => !(i < WARMUP_IND || i >= candles.length - EXTENDED)
  );

  const pctChange10m = candlesActual.map(x => x.pctChange._10m);
  const pctChange60m = candlesActual.map(x => x.pctChange._60m);
  const pctChange120m = candlesActual.map(x => x.pctChange._120m);
  const pctChange240m = candlesActual.map(x => x.pctChange._240m);
  const pctChange480m = candlesActual.map(x => x.pctChange._480m);
  const pctChange24h = candlesActual.map(x => x.pctChange._24h);

  const linRegs: LinRegResult[] = [];

  /// RSI ///

  linreg(candlesActual, x => x.ind.rsi, pctChange10m, "RSI vs 10m");
  linreg(candlesActual, x => x.ind.rsi, pctChange60m, "RSI vs 60m");
  linreg(candlesActual, x => x.ind.rsi, pctChange120m, "RSI vs 120m");
  linreg(candlesActual, x => x.ind.rsi, pctChange240m, "RSI vs 240m");

  linregSplitRSI(
    candlesActual,
    x => x.ind.rsi,
    pctChange120m,
    "SPLIT RSI 120m"
  );

  linregSplitRSI(
    candlesActual,
    x => x.ind.rsi,
    pctChange240m,
    "SPLIT RSI 240m"
  );

  /// LRC ///

  linreg(candlesActual, x => x.ind.lrc60, pctChange120m, "LRC60 vs 120m");

  /// MFI ///

  linreg(candlesActual, x => x.ind.mfi, pctChange60m, "MFI vs 600m");
  linRegs.push(
    linreg(candlesActual, x => x.ind.mfi, pctChange120m, "MFI vs 120m")
  );
  linRegs.push(
    linreg(candlesActual, x => x.ind.mfi, pctChange240m, "MFI vs 240m")
  );
  linRegs.push(
    linreg(candlesActual, x => x.ind.mfi, pctChange480m, "MFI vs 480m")
  );
  linRegs.push(
    linreg(candlesActual, x => x.ind.mfi, pctChange24h, "MFI vs 24h")
  );

  /// VixFix ///
  // linreg(candlesActual, x => x.ind.vixFix, pctChange60m, "VIXFIX vs 60m");
  // linreg(candlesActual, x => x.ind.vixFix, pctChange120m, "VIXFIX vs 120m");
  // linreg(candlesActual, x => x.ind.vixFix, pctChange240m, "VIXFIX vs 240m");

  /// BBands ///

  linreg(
    candlesActual,
    x => x.ind.bbands.upper - x.ind.bbands.lower,
    pctChange10m,
    "BBands vs 10m"
  );

  linreg(
    candlesActual,
    x => x.ind.bbands.upper - x.ind.bbands.lower,
    pctChange60m,
    "BBands vs 60m"
  );

  linreg(
    candlesActual,
    x => x.ind.bbands.upper - x.ind.bbands.lower,
    pctChange120m,
    "BBands vs 120m"
  );

  linreg(
    candlesActual,
    x => x.ind.bbands.upper - x.ind.bbands.lower,
    pctChange240m,
    "BBands vs 240m"
  );

  // /// MACD ///

  linreg(
    candlesActual,
    x => round2(x.ind.macd120.histo),
    pctChange10m,
    "MACD vs 10m"
  );

  linreg(
    candlesActual,
    x => round2(x.ind.macd120.histo),
    pctChange60m,
    "MACD vs 60m"
  );

  linreg(
    candlesActual,
    x => round2(x.ind.macd120.histo),
    pctChange120m,
    "MACD vs 120m"
  );

  linreg(
    candlesActual,
    x => round2(x.ind.macd120.histo),
    pctChange240m,
    "MACD vs 240m"
  );

  // /// ZLEMA ///

  linreg(
    candlesActual,
    x => x.ind.zlema60Slow - x.ind.zlema60Fast,
    pctChange10m,
    "ZLEMA vs 10m"
  );

  linreg(
    candlesActual,
    x => x.ind.zlema60Slow - x.ind.zlema60Fast,
    pctChange60m,
    "ZLEMA vs 60m"
  );

  linreg(
    candlesActual,
    x => x.ind.zlema60Slow - x.ind.zlema60Fast,
    pctChange120m,
    "ZLEMA vs 120m"
  );

  linreg(
    candlesActual,
    x => x.ind.zlema60Slow - x.ind.zlema60Fast,
    pctChange240m,
    "ZLEMA vs 240m"
  );

  // /// MACD LRC ///

  linreg(
    candlesActual,
    x => x.ind.macdHistoLrcSlow - x.ind.macdHistoLrc,
    pctChange10m,
    "MACD LRC vs 10m"
  );

  linreg(
    candlesActual,
    x => x.ind.macdHistoLrcSlow - x.ind.macdHistoLrc,
    pctChange60m,
    "MACD LRC vs 60m"
  );

  linreg(
    candlesActual,
    x => x.ind.macdHistoLrcSlow - x.ind.macdHistoLrc,
    pctChange120m,
    "MACD LRC vs 120m"
  );

  linreg(
    candlesActual,
    x => x.ind.macdHistoLrcSlow - x.ind.macdHistoLrc,
    pctChange240m,
    "MACD LRC vs 240m"
  );

  linreg(
    candlesActual,
    x => x.ind.macdHistoLrcSlow - x.ind.macdHistoLrc,
    pctChange480m,
    "MACD LRC vs 480m"
  );

  linreg(
    candlesActual,
    x => x.ind.macdHistoLrcSlow - x.ind.macdHistoLrc,
    pctChange24h,
    "MACD LRC vs 24h"
  );

  return linRegs;
};
