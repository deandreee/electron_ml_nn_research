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
import { XmRsi, XmBase, VixFix, LRC, ZLEMA, MFI, BBands } from "./strats/ind";
import { pricesXAhead } from "./pricesXAhead";
import { linreg } from "./linreg";
import { linregSplitRSI } from "./linregSplitRSI";

// import { BB } from "../../../gekko-develop/strategies/indicators"; // babel polyfill error, let's fix later

let warmup = 30 * 15; // min
let extended = 240; // 1h

export const corr = (candles: Candle[]) => {
  const xmRsi = new XmRsi(60, 60);
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
  const mfi = new XmBase(60, times(60).map(x => new MFI(15)));
  const bbands = new XmBase(
    60,
    times(60).map(x => new BBands({ TimePeriod: 20, NbDevUp: 2, NbDevDn: 2 }))
  );

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
      zlema: xmZlema.update(candle),
      mfi: mfi.update(candle),
      bbands: bbands.update(candle, "close")
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

  linreg(candlesActual, x => x.ind.rsi, pctChange60m_, "reg_rsi_pctChange60m");

  linreg(
    candlesActual,
    x => x.ind.rsi,
    pctChange120m_,
    "reg_rsi_pctChange120m"
  );

  linreg(
    candlesActual,
    x => x.ind.rsi,
    pctChange240m_,
    "reg_rsi_pctChange240m"
  );

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

  const { x, y, regEquation } = linreg(
    candlesActual,
    x => x.ind.bbands.upper - x.ind.bbands.lower,
    pctChange120m_,
    "reg_bbands_pctChange120m"
  );

  linreg(
    candlesActual,
    x => x.ind.bbands.upper - x.ind.bbands.lower,
    pctChange240m_,
    "reg_bbands_pctChange240m"
  );

  return { x, y, regEquation };
};
