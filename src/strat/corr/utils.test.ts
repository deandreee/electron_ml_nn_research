import * as utils from "./utils";
import { FeatureSplit } from "../features";

describe("utils", () => {
  test("shouldCalc 1", () => {
    const featureSplit: FeatureSplit = {
      name: "macd.vixFix.vwap.t3Macd.zerolagMACD.kst",
      fn: x => [
        x.ind.vixFix.x120.a,
        x.ind.macd.x120.sig9.histo,
        x.ind.vwap.x30.p40.den,
        x.ind.t3Macd.x120.sig2_16.histo,
        x.ind.zerolagMACD.x480.sig2_16.histo,
        x.ind.kst.x60.p_sig3.kst
      ]
    };
    const res = utils.shouldCalc([featureSplit], "vwap");
    expect(res).toEqual(true);
  });

  describe("shouldCalc 2", () => {
    const featureSplit: FeatureSplit = {
      name: "emaOCC.vixFix.kst2",
      fn: x => [
        x.ind.emaOCC.x1440.p25.diff,
        x.ind.vixFix.x480.a,
        x.ind.kst.x480.p_sig3_roc5_smaroc_5.kst,
        x.ind.kst.x480.p_sig3_roc5_smaroc_5.signal
      ]
    };

    test("wvap", () => {
      const res = utils.shouldCalc([featureSplit], "vwap");
      expect(res).toEqual(false);
    });

    test("emaOCC", () => {
      const res = utils.shouldCalc([featureSplit], "emaOCC");
      expect(res).toEqual(true);
    });

    test("vixFix", () => {
      const res = utils.shouldCalc([featureSplit], "vixFix");
      expect(res).toEqual(true);
    });

    test("kst", () => {
      const res = utils.shouldCalc([featureSplit], "kst");
      expect(res).toEqual(true);
    });
  });

  describe("getShouldCalc 2", () => {
    const featureSplit: FeatureSplit = {
      name: "emaOCC.vixFix.kst2",
      fn: x => [
        x.ind.emaOCC.x1440.p25.diff,
        x.ind.vixFix.x480.a,
        x.ind.kst.x480.p_sig3_roc5_smaroc_5.kst,
        x.ind.kst.x480.p_sig3_roc5_smaroc_5.signal
      ]
    };

    test("wvap", () => {
      const res = utils.getShouldCalc([featureSplit], "vwap");
      expect(res).toEqual({});
    });

    test("emaOCC", () => {
      const res = utils.getShouldCalc([featureSplit], "emaOCC");
      expect(res.x1440).toEqual(true);
    });

    test("vixFix", () => {
      const res = utils.getShouldCalc([featureSplit], "vixFix");
      expect(res.x480).toEqual(true);
    });

    test("kst", () => {
      const res = utils.getShouldCalc([featureSplit], "kst");
      expect(res.x480).toEqual(true);
    });
  });
});

export const allFalse = {
  x60: false,
  x120: false,
  x240: false,
  x480: false,
  x1440: false
};
