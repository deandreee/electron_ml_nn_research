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
  PSARProps
} = require("../../../gekko-develop/strategies/indicators");
const { ZerolagHATEMA } = require("../../../gekko-develop/strategies/indicators/lizard");

const { InverseFisherTransformSmoothed } = require("../../../gekko-develop/strategies/indicators/ninja");

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

export const corrCalc = (candles: Candle[]) => {
  const waveManager10 = new WaveManager(10);
  const waveManager30 = new WaveManager(30);
  const waveManager60 = new WaveManager(60);
  const waveManager120 = new WaveManager(120);

  const xmRsi = new XmBase(waveManager60, () => new RSI({ interval: 20 }));
  const xmVixFix = new XmBase(waveManager120, () => new VixFix({ pd: 22, bbl: 20, mult: 2.0, lb: 50, ph: 0.85 }));

  const lrc60 = new XmBase(waveManager60, () => new LRC(60));
  const lrc120 = new XmBase(waveManager120, () => new LRC(60));

  const zlema60Fast = new XmBase(waveManager120, () => new ZerolagHATEMA(20));
  const zlema60Slow = new XmBase(waveManager120, () => new ZerolagHATEMA(60));

  const mfi = new XmBase(waveManager60, () => new MFI(30));
  const bbands = new XmBase(waveManager60, () => new BBANDS({ TimePeriod: 20, NbDevUp: 2, NbDevDn: 2 }));

  const macd60 = new XmBase(waveManager60, () => new MACD({ short: 12, long: 26, signal: 9 }));

  const macd120 = new XmBase(waveManager120, () => new MACD({ short: 12, long: 26, signal: 9 }));

  const macdHistoLrc = new XmBase(waveManager120, () => new LRC(12));
  const macdHistoLrcSlow = new XmBase(waveManager120, () => new LRC(16));

  const atr60 = new ATR(60);
  const atr240 = new ATR(240);
  const cci = new CCI({ constant: 0.015, history: 120 });

  const macd60_PSAR = new PSAR_TI(PSARProps._0_0001, {
    resultHistory: true
  });

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
      mfi: mfi.update(bigCandle60),
      bbands: bbands.update(bigCandle60.close),
      macd60: macd60.update(bigCandle60.close),
      macd120: macd120.update(bigCandle120.close),
      atr60: atr60.update(candle),
      atr240: atr240.update(candle),
      cci: cci.update(candle),
      ifts10x15: ifts10x15.update(bigCandle10),
      ifts30x15: ifts30x15.update(bigCandle30),
      ifts60x15: ifts60x15.update(bigCandle60)
    };

    candle.ind.macdHistoLrc = macdHistoLrc.update(candle.ind.macd120 && candle.ind.macd120.histo);
    candle.ind.macdHistoLrcSlow = macdHistoLrcSlow.update(candle.ind.macd120 && candle.ind.macd120.histo);

    candle.ind.macd60_PSAR = macd60_PSAR.update(valueToOHLC(candle.ind.macd60 && candle.ind.macd60.histo));

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

  return { candlesActual, pctChange };
};
