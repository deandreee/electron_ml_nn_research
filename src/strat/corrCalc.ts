import { Candle, PctChange } from "./types";
import { getCandlePctChange, getAvgCandlePctChange } from "./utils";

const { XmBase, WaveManager, valueToOHLC } = require("../../../gekko-develop/strategies/utils");

const {
  MACD,
  RSI,
  LRC,
  BBANDS,
  VixFix,
  MFI,
  ATR,
  CCI,
  PSAR_TI,
  PSARProps,
  ADX,
  SMA
} = require("../../../gekko-develop/strategies/indicators");
const { ZerolagHATEMA, ZerolagMACD } = require("../../../gekko-develop/strategies/indicators/lizard");

const {
  InverseFisherTransform,
  InverseFisherTransformSmoothed
} = require("../../../gekko-develop/strategies/indicators/ninja");

// warmup = wait for first candle
// skipstart = wait for ind to have enough

// export const WARMUP = 240; // => biggest candle usedDASH
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

const wHist = {
  resultHistory: true
};

export const corrCalc = (candles: Candle[]) => {
  const waveManager10 = new WaveManager(10);
  const waveManager30 = new WaveManager(30);
  const waveManager60 = new WaveManager(60);
  const waveManager120 = new WaveManager(120);

  const rsi30x10 = new XmBase(waveManager30, () => new RSI({ interval: 10 }));
  const rsi60x10 = new XmBase(waveManager60, () => new RSI({ interval: 10 }));
  const rsi60x20 = new XmBase(waveManager60, () => new RSI({ interval: 20 }));
  const rsi120x10 = new XmBase(waveManager60, () => new RSI({ interval: 10 }));
  const vixFix30 = new XmBase(waveManager120, () => new VixFix({ pd: 22, bbl: 20, mult: 2.0, lb: 50, ph: 0.85 }));
  const vixFix60 = new XmBase(waveManager120, () => new VixFix({ pd: 22, bbl: 20, mult: 2.0, lb: 50, ph: 0.85 }));
  const vixFix120 = new XmBase(waveManager120, () => new VixFix({ pd: 22, bbl: 20, mult: 2.0, lb: 50, ph: 0.85 }));

  const lrc10 = new XmBase(waveManager10, () => new LRC(60));
  const lrc30 = new XmBase(waveManager30, () => new LRC(30));
  const lrc60 = new XmBase(waveManager60, () => new LRC(30));
  const lrc120 = new XmBase(waveManager120, () => new LRC(30));
  const lrc30_PSAR = new PSAR_TI(PSARProps._0_003, wHist);
  const lrc60_PSAR = new PSAR_TI(PSARProps._0_003, wHist);

  const zlema60Fast = new XmBase(waveManager120, () => new ZerolagHATEMA(20));
  const zlema60Slow = new XmBase(waveManager120, () => new ZerolagHATEMA(60));

  const mfi60_15 = new XmBase(waveManager60, () => new MFI(15));
  const mfi60_30 = new XmBase(waveManager60, () => new MFI(30));
  const mfi60_60 = new XmBase(waveManager60, () => new MFI(60));

  const mfi120_15 = new XmBase(waveManager120, () => new MFI(15));
  const mfi120_30 = new XmBase(waveManager120, () => new MFI(30));
  const mfi120_60 = new XmBase(waveManager120, () => new MFI(60));

  const bbands = new XmBase(waveManager60, () => new BBANDS({ TimePeriod: 20, NbDevUp: 2, NbDevDn: 2 }));

  const macd60 = new XmBase(waveManager60, () => new MACD({ short: 12, long: 26, signal: 9 }));
  const macd120 = new XmBase(waveManager120, () => new MACD({ short: 12, long: 26, signal: 9 }));
  const zerlagMacd60 = new XmBase(waveManager60, () => new ZerolagMACD({ short: 12, long: 26, signal: 9 }));
  const zerlagMacd120 = new XmBase(waveManager120, () => new ZerolagMACD({ short: 12, long: 26, signal: 9 }));

  const macdHistoLrc = new XmBase(waveManager120, () => new LRC(12));
  const macdHistoLrcSlow = new XmBase(waveManager120, () => new LRC(16));

  const atr60 = new ATR(60);
  const atr120 = new ATR(120);
  const atr240 = new ATR(240);
  const atr360 = new ATR(360);
  const atr480 = new ATR(480);
  const atr720 = new ATR(720);
  const atr960 = new ATR(960);
  const cci = new XmBase(waveManager60, () => new CCI({ constant: 0.015, history: 120 }));

  const macd60_PSAR = new PSAR_TI(PSARProps._0_0001, wHist);

  const macd60_ADX30 = new ADX(30, wHist);
  const macd60_ADX60 = new ADX(60, wHist);
  const macd60_ADX120 = new ADX(120, wHist);

  const macd120_ADX30 = new ADX(30, wHist);
  const macd120_ADX60 = new ADX(60, wHist);
  const macd120_ADX120 = new ADX(120, wHist);

  const volume60 = new SMA(60, wHist);
  const volume120 = new SMA(120, wHist);

  const ift30x5 = new XmBase(waveManager30, () => new InverseFisherTransform({ period: 5 }));
  const ift60x5 = new XmBase(waveManager60, () => new InverseFisherTransform({ period: 5 }));
  const ift60x15 = new XmBase(waveManager60, () => new InverseFisherTransform({ period: 15 }));
  const ift10x15 = new XmBase(waveManager10, () => new InverseFisherTransform({ period: 15 }));
  const ift30x15 = new XmBase(waveManager30, () => new InverseFisherTransform({ period: 15 }));
  const ift120x15 = new XmBase(waveManager120, () => new InverseFisherTransform({ period: 15 }));
  const ift10x30 = new XmBase(waveManager10, () => new InverseFisherTransform({ period: 30 }));
  const ift60x30 = new XmBase(waveManager60, () => new InverseFisherTransform({ period: 30 }));
  const ift120x30 = new XmBase(waveManager120, () => new InverseFisherTransform({ period: 30 }));
  const ifts10x15 = new XmBase(waveManager10, () => new InverseFisherTransformSmoothed({ period: 15 }));
  const ifts30x15 = new XmBase(waveManager30, () => new InverseFisherTransformSmoothed({ period: 15 }));
  const ifts60x15 = new XmBase(waveManager60, () => new InverseFisherTransformSmoothed({ period: 15 }));

  for (let i = 0; i < candles.length; i++) {
    const candle = candles[i];

    if (i >= candles.length - EXTENDED) {
      // only for pct change, not needed
      candle.ind = {};
      continue;
    }

    const bigCandle10 = waveManager10.update(candle);
    const bigCandle30 = waveManager30.update(candle);
    const bigCandle60 = waveManager60.update(candle);
    const bigCandle120 = waveManager120.update(candle);

    if (!bigCandle10 || !bigCandle30 || !bigCandle60 || !bigCandle120) {
      continue;
    }

    candle.ind = {
      rsi30x10: rsi30x10.update(bigCandle30),
      rsi60x10: rsi60x10.update(bigCandle60),
      rsi60x20: rsi60x20.update(bigCandle60),
      rsi120x10: rsi120x10.update(bigCandle120),
      vixFix30: vixFix30.update(bigCandle30),
      vixFix60: vixFix60.update(bigCandle60),
      vixFix120: vixFix120.update(bigCandle120),
      lrc10: lrc10.update(bigCandle10.close),
      lrc30: lrc30.update(bigCandle30.close),
      lrc60: lrc60.update(bigCandle60.close),
      lrc120: lrc120.update(bigCandle120.close),
      zlema60Fast: zlema60Fast.update(bigCandle60),
      zlema60Slow: zlema60Slow.update(bigCandle60),
      mfi60_15: mfi60_15.update(bigCandle60),
      mfi60_30: mfi60_30.update(bigCandle60),
      mfi60_60: mfi60_60.update(bigCandle60),
      mfi120_15: mfi120_15.update(bigCandle120),
      mfi120_30: mfi120_30.update(bigCandle120),
      mfi120_60: mfi120_60.update(bigCandle120),
      bbands: bbands.update(bigCandle60.close),
      macd60: macd60.update(bigCandle60.close),
      macd120: macd120.update(bigCandle120.close),
      zerlagMacd60: zerlagMacd60.update(bigCandle60),
      zerlagMacd120: zerlagMacd120.update(bigCandle120),
      atr60: atr60.update(candle),
      atr120: atr120.update(candle),
      atr240: atr240.update(candle),
      atr360: atr360.update(candle),
      atr480: atr480.update(candle),
      atr720: atr720.update(candle),
      atr960: atr960.update(candle),
      cci: cci.update(bigCandle60),
      volume60: volume60.update(candle.volume),
      volume120: volume120.update(candle.volume),
      ift30x5: ift30x5.update(bigCandle30),
      ift60x5: ift60x5.update(bigCandle60),
      ift60x15: ift60x15.update(bigCandle60),
      ift10x15: ift10x15.update(bigCandle10),
      ift30x15: ift30x15.update(bigCandle30),
      ift120x15: ift120x15.update(bigCandle120),
      ift10x30: ift10x30.update(bigCandle10),
      ift60x30: ift60x30.update(bigCandle60),
      ift120x30: ift120x30.update(bigCandle120),
      ifts10x15: ifts10x15.update(bigCandle10),
      ifts30x15: ifts30x15.update(bigCandle30),
      ifts60x15: ifts60x15.update(bigCandle60)
    };

    candle.ind.macdHistoLrc = macdHistoLrc.update(candle.ind.macd120 && candle.ind.macd120.histo);
    candle.ind.macdHistoLrcSlow = macdHistoLrcSlow.update(candle.ind.macd120 && candle.ind.macd120.histo);

    candle.ind.macd60_PSAR = macd60_PSAR.update(valueToOHLC(candle.ind.macd60 && candle.ind.macd60.histo));
    candle.ind.macd60_ADX30 = macd60_ADX30.update(valueToOHLC(candle.ind.macd60 && candle.ind.macd60.histo));
    candle.ind.macd60_ADX60 = macd60_ADX60.update(valueToOHLC(candle.ind.macd60 && candle.ind.macd60.histo));
    candle.ind.macd60_ADX120 = macd60_ADX120.update(valueToOHLC(candle.ind.macd60 && candle.ind.macd60.histo));

    candle.ind.macd120_ADX30 = macd120_ADX30.update(valueToOHLC(candle.ind.macd120 && candle.ind.macd120.histo));
    candle.ind.macd120_ADX60 = macd120_ADX60.update(valueToOHLC(candle.ind.macd120 && candle.ind.macd120.histo));
    candle.ind.macd120_ADX120 = macd120_ADX120.update(valueToOHLC(candle.ind.macd120 && candle.ind.macd120.histo));

    candle.ind.lrc30_PSAR = lrc30_PSAR.update(valueToOHLC(candle.ind.lrc30));
    candle.ind.lrc60_PSAR = lrc60_PSAR.update(valueToOHLC(candle.ind.lrc60));

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

  const candlesActual = candles.filter((x, i) => !(i < WARMUP_IND || i >= candles.length - EXTENDED));

  const pctChange: PctChange = {
    _10m: candlesActual.map(x => x.pctChange._10m),
    _60m: candlesActual.map(x => x.pctChange._60m),
    _120m: candlesActual.map(x => x.pctChange._120m),
    _240m: candlesActual.map(x => x.pctChange._240m),
    _480m: candlesActual.map(x => x.pctChange._480m),
    _24h: candlesActual.map(x => x.pctChange._24h)
  };

  const corrCandles = new CorrCandles(candles, candlesActual, WARMUP_IND, EXTENDED);

  return { corrCandles, pctChange };
};

export class CorrCandles {
  candles: Candle[];
  candlesActual: Candle[];
  WARMUP_IND: number;
  EXTENDED: number;

  constructor(candles: Candle[], candlesActual: Candle[], WARMUP_IND: number, EXTENDED: number) {
    this.candles = candles;
    this.candlesActual = candlesActual;
    this.WARMUP_IND = WARMUP_IND;
    this.EXTENDED = this.EXTENDED;
  }

  // candles actual is used further, but we still need to see the diff n periods ago,
  // so we look into full candles
  getPrev = (curr: number, minus: number) => {
    return this.candles[curr - minus + this.WARMUP_IND];
  };
}
