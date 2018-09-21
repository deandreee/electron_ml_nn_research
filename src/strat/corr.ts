import { times } from "lodash-es";
import { Series } from "pandas-js";
import * as regression from "regression";
import { Candle } from "./types";
import { getCandlePctChange, getPctChange } from "./utils";
import { XmRsi, XmBase, VixFix, LRC, ZLEMA } from "./strats/ind";

let warmup = 30 * 15; // min
let extended = 240; // 1h

export const corr = (candles: Candle[]) => {
  const xmRsi = new XmRsi(120, 15);
  const xmVixFix = new XmBase(
    120,
    times(120).map(
      x => new VixFix({ pd: 22, bbl: 20, mult: 2.0, lb: 50, ph: 0.85 })
    )
  );
  const lrc60 = new LRC(60);
  const lrc120 = new LRC(120);
  const lrc240 = new LRC(240);
  const xmZlema = new XmBase(60, times(60).map(x => new ZLEMA(60)));

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
      vixFix: xmVixFix.update(candle),
      lrc60: lrc60.update(candle.close),
      lrc120: lrc120.update(candle.close),
      lrc240: lrc240.update(candle.close),
      zlema: xmZlema.update(candle)
    };

    candle.pctChange60m = getCandlePctChange(candles, i + 60, i);

    pctChange10m.push(getCandlePctChange(candles, i + 10, i));
    pctChange30m.push(getCandlePctChange(candles, i + 30, i));
    pctChange60m.push(getCandlePctChange(candles, i + 60, i));
    pctChange120m.push(getCandlePctChange(candles, i + 120, i));
    pctChange180m.push(getCandlePctChange(candles, i + 180, i));
    pctChange240m.push(getCandlePctChange(candles, i + 240, i));
  }

  // console.log("drop vs no drop: ", rsiDropCount, rsiNoDropCount);

  const skipStart = 60 * 60;

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
  const zlema_ = new Series(candlesActual.map(x => x.ind.zlema));

  const pctChange10m_ = pctChange10m.slice(skipStart);
  const pctChange30m_ = pctChange30m.slice(skipStart);
  const pctChange60m_ = pctChange60m.slice(skipStart);
  const pctChange120m_ = pctChange120m.slice(skipStart);
  const pctChange180m_ = pctChange180m.slice(skipStart);
  const pctChange240m_ = pctChange240m.slice(skipStart);

  console.log("rsi 10", round2(rsi.corr(new Series(pctChange10m_))));
  console.log("rsi 30", round2(rsi.corr(new Series(pctChange30m_))));
  console.log("rsi 60", round2(rsi.corr(new Series(pctChange60m_))));
  console.log("rsi 120", round2(rsi.corr(new Series(pctChange120m_))));
  console.log("rsi 180", round2(rsi.corr(new Series(pctChange180m_))));
  console.log("rsi 240", round2(rsi.corr(new Series(pctChange240m_))));

  console.log("vixFix 10", round2(vixFix.corr(new Series(pctChange10m_))));
  console.log("vixFix 30", round2(vixFix.corr(new Series(pctChange30m_))));
  console.log("vixFix 60", round2(vixFix.corr(new Series(pctChange60m_))));
  console.log("vixFix 120", round2(vixFix.corr(new Series(pctChange120m_))));
  console.log("vixFix 180", round2(vixFix.corr(new Series(pctChange180m_))));
  console.log("vixFix 240", round2(vixFix.corr(new Series(pctChange240m_))));

  console.log("lrc60_ 10", round2(lrc60_.corr(new Series(pctChange10m_))));
  console.log("lrc60_ 30", round2(lrc60_.corr(new Series(pctChange30m_))));
  console.log("lrc60_ 60", round2(lrc60_.corr(new Series(pctChange60m_))));
  console.log("lrc60_ 120", round2(lrc60_.corr(new Series(pctChange120m_))));
  console.log("lrc60_ 180", round2(lrc60_.corr(new Series(pctChange180m_))));
  console.log("lrc60_ 240", round2(lrc60_.corr(new Series(pctChange240m_))));

  console.log("lrc120_ 10", round2(lrc120_.corr(new Series(pctChange10m_))));
  console.log("lrc120_ 30", round2(lrc120_.corr(new Series(pctChange30m_))));
  console.log("lrc120_ 60", round2(lrc120_.corr(new Series(pctChange60m_))));
  console.log("lrc120_ 120", round2(lrc120_.corr(new Series(pctChange120m_))));
  console.log("lrc120_ 180", round2(lrc120_.corr(new Series(pctChange180m_))));
  console.log("lrc120_ 240", round2(lrc120_.corr(new Series(pctChange240m_))));

  console.log("lrc240_ 10", round2(lrc240_.corr(new Series(pctChange10m_))));
  console.log("lrc240_ 30", round2(lrc240_.corr(new Series(pctChange30m_))));
  console.log("lrc240_ 60", round2(lrc240_.corr(new Series(pctChange60m_))));
  console.log("lrc240_ 120", round2(lrc240_.corr(new Series(pctChange120m_))));
  console.log("lrc240_ 180", round2(lrc240_.corr(new Series(pctChange180m_))));
  console.log("lrc240_ 240", round2(lrc240_.corr(new Series(pctChange240m_))));

  console.log("zlema_ 10", round2(zlema_.corr(new Series(pctChange10m_))));
  console.log("zlema_ 30", round2(zlema_.corr(new Series(pctChange30m_))));
  console.log("zlema_ 60", round2(zlema_.corr(new Series(pctChange60m_))));
  console.log("zlema_ 120", round2(zlema_.corr(new Series(pctChange120m_))));
  console.log("zlema_ 180", round2(zlema_.corr(new Series(pctChange180m_))));
  console.log("zlema_ 240", round2(zlema_.corr(new Series(pctChange240m_))));

  const pricesXhAhead = candlesActual.map(
    (x, i) => candlesActualExtended[i + 240].close
  );
  const pricesXhAheadSeries = new Series(pricesXhAhead);

  console.log("rsi 10 vs prices", round2(rsi.corr(pricesXhAheadSeries)));
  console.log("vixFix 10 prices", round2(vixFix.corr(pricesXhAheadSeries)));
  console.log("lrc60_ vs prices", round2(lrc60_.corr(pricesXhAheadSeries)));
  console.log("lrc120_ vs prices", round2(lrc120_.corr(pricesXhAheadSeries)));
  console.log("lrc240 vs prices", round2(lrc240_.corr(pricesXhAheadSeries)));
  console.log("zlema_ vs prices", round2(zlema_.corr(pricesXhAheadSeries)));

  {
    const result = regression.linear(
      candlesActual
        .map(x => x.ind.lrc60.result)
        .map((x, i) => [x, pricesXhAhead[i]])
    );

    console.log("regression lrc60", {
      string: result.string,
      eq: result.equation,
      r2: result.r2
    });
  }

  {
    const result = regression.linear(
      candlesActual
        .map(x => x.ind.lrc120.result)
        .map((x, i) => [x, pricesXhAhead[i]])
    );

    console.log("regression lrc120", {
      string: result.string,
      eq: result.equation,
      r2: result.r2
    });
  }

  {
    const result = regression.linear(
      candlesActual
        .map(x => x.ind.lrc240.result)
        .map((x, i) => [x, pricesXhAhead[i]])
    );

    console.log("regression lrc240", {
      string: result.string,
      eq: result.equation,
      r2: result.r2
    });
  }

  {
    const result = regression.linear(
      candlesActual.map(x => x.ind.rsi).map((x, i) => [x, pricesXhAhead[i]])
    );

    console.log("regression rsi", {
      string: result.string,
      eq: result.equation,
      r2: result.r2
    });
  }

  {
    const result = regression.linear(
      candlesActual
        .map(x => x.ind.lrc240)
        .map((x, i) => [x.result, pctChange10m_[i]])
    );

    console.log("regression lrc240 pctChange10m_", {
      string: result.string,
      eq: result.equation,
      r2: result.r2
    });
  }

  {
    const result = regression.linear(
      candlesActual
        .map(x => x.ind.lrc240)
        .map((x, i) => [x.result, pctChange120m_[i]])
    );

    console.log("regression lrc240 pctChange120m_", {
      string: result.string,
      eq: result.equation,
      r2: result.r2
    });
  }

  {
    const result = regression.linear(
      candlesActual
        .map(x => x.ind.lrc240)
        .map((x, i) => [x.result, pctChange240m_[i]])
    );

    console.log("regression lrc240 pctChange240m_", {
      string: result.string,
      eq: result.equation,
      r2: result.r2
    });
  }

  {
    const lrc240PctChange: number[] = [];
    for (let i = 240; i < candlesActual.length; i++) {
      lrc240PctChange.push(
        getPctChange(
          candlesActual[i].ind.lrc240.result,
          candlesActual[i - 240].ind.lrc240.result
        )
      );
    }

    const pctChange240m_Sliced240 = pctChange240m_.slice(240);

    const result = regression.linear(
      lrc240PctChange.map((x, i) => [x, pctChange240m_Sliced240[i]])
    );

    console.log("regression lrc240PctChange", {
      string: result.string,
      eq: result.equation,
      r2: result.r2
    });

    const x = candlesActual.map(x => x.ind.lrc60.result);
    const y = pricesXhAhead;

    return { x, y };
  }
};

const round2 = (value: number) => {
  return Math.round(value * 100) / 100;
};
