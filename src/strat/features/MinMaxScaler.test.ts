import { MinMaxScaler } from "./MinMaxScaler";
import { FnGetFeature } from ".";
import { round1 } from "../utils";

describe("featureSplit", () => {
  test("getIndicatorNames | single", () => {
    const featureSplit: FnGetFeature = x => [x.ind.rsi.x30.p10];
    const minMaxScaler = new MinMaxScaler(featureSplit);
    const indicators = minMaxScaler.getIndicatorNames();
    expect(indicators).toEqual(["rsi30x10"]);
  });

  test("getIndicatorNames | multiple", () => {
    const featureSplit: FnGetFeature = x => [
      x.ind.rsi.x30.p10,
      x.ind.rsi.x60.p10,
      x.ind.rsi.x120.p10,
      x.ind.rsi.x240.p10,
      x.ind.rsi.x480.p10
    ];

    const minMaxScaler = new MinMaxScaler(featureSplit);
    const indicators = minMaxScaler.getIndicatorNames();
    expect(indicators).toEqual(["rsi30x10", "rsi60x10", "rsi120x10", "rsi240x10", "rsi480x10"]);
  });

  test("getIndicatorNames | with point", () => {
    const featureSplit: FnGetFeature = x => [x.ind.macd.x60.sig9.histo];
    const minMaxScaler = new MinMaxScaler(featureSplit);
    const indicators = minMaxScaler.getIndicatorNames();
    expect(indicators).toEqual(["macd.x60.sig9.histo"]);
  });

  test("getIndicatorNames | comment", () => {
    const featureSplit: FnGetFeature = x => [
      x.ind.rsi.x30.p10,
      // x.ind.rsi60x10,
      x.ind.rsi.x120.p10
    ];

    const minMaxScaler = new MinMaxScaler(featureSplit);
    const indicators = minMaxScaler.getIndicatorNames();
    expect(indicators).toEqual(["rsi30x10", "rsi120x10"]);
  });

  test("scaleInitial | feature count too much", () => {
    const featureSplit: FnGetFeature = x => [x.ind.rsi.x30.p10, x.ind.rsi.x120.p10];

    const minMaxScaler = new MinMaxScaler(featureSplit);

    const features = [[1, 2, 3]];
    expect(() => {
      minMaxScaler.scaleInitial(features);
    }).toThrowError("ERROR: indicators.length (2) !== features.length (3)");
  });

  test("scaleInitial | feature count not enough", () => {
    const featureSplit: FnGetFeature = x => [x.ind.rsi.x30.p10, x.ind.rsi.x120.p10];

    const minMaxScaler = new MinMaxScaler(featureSplit);

    const features = [[1]];
    expect(() => {
      minMaxScaler.scaleInitial(features);
    }).toThrowError("ERROR: indicators.length (2) !== features.length (1)");
  });

  test("scaleInitial | called 2x", () => {
    const featureSplit: FnGetFeature = x => [x.ind.rsi.x30.p10];

    const minMaxScaler = new MinMaxScaler(featureSplit);

    const features = [[1]];
    expect(() => {
      minMaxScaler.scaleInitial(features);
      minMaxScaler.scaleInitial(features);
    }).toThrowError("ERROR: scaleInitial can only be called single time");
  });

  test("scaleInitial | rsi", () => {
    const featureSplit: FnGetFeature = x => [x.ind.rsi.x30.p10];

    const minMaxScaler = new MinMaxScaler(featureSplit);

    const features = [[0], [25], [50], [75], [100]];
    const scaled = minMaxScaler.scaleInitial(features);

    expect(scaled).toEqual([[-1], [-0.5], [0], [0.5], [1]]);
  });

  test("scaleInitial | macd | 0 -> 10", () => {
    const featureSplit: FnGetFeature = x => [x.ind.macd.x120.sig9.histo];

    const minMaxScaler = new MinMaxScaler(featureSplit);

    const features = [[0], [2.5], [5.0], [7.5], [10.0]];
    const scaled = minMaxScaler.scaleInitial(features);

    expect(scaled).toEqual([[-1], [-0.5], [0], [0.5], [1]]);
  });

  test("scaleInitial | macd | -100 -> 100", () => {
    const featureSplit: FnGetFeature = x => [x.ind.macd.x120.sig9.histo];

    const minMaxScaler = new MinMaxScaler(featureSplit);

    const features = [[-100], [-80], [-50], [0], [60], [70], [100]];
    const scaled = minMaxScaler.scaleInitial(features);

    expect(scaled).toEqual([[-1], [-0.8], [-0.5], [0], [0.6], [0.7], [1]]);
  });

  test("scaleInitial | macd | 1 -> 5", () => {
    const featureSplit: FnGetFeature = x => [x.ind.macd.x120.sig9.histo];

    const minMaxScaler = new MinMaxScaler(featureSplit);

    const features = [[1], [2], [3], [4], [5]];
    const scaled = minMaxScaler.scaleInitial(features);

    expect(scaled).toEqual([[-1], [-0.5], [0], [0.5], [1]]);
  });

  test("scaleInitial | macd | rsi", () => {
    const featureSplit: FnGetFeature = x => [x.ind.macd.x120.sig9.histo, x.ind.rsi.x120.p10];

    const minMaxScaler = new MinMaxScaler(featureSplit);

    const features = [[-100, 0], [-80, 25], [0, 50], [70, 75], [100, 100]];
    const scaled = minMaxScaler.scaleInitial(features);

    expect(scaled).toEqual([[-1, -1], [-0.8, -0.5], [0, 0], [0.7, 0.5], [1, 1]]);
  });

  test("scale | macd | rsi", () => {
    const featureSplit: FnGetFeature = x => [x.ind.macd.x120.sig9.histo, x.ind.rsi.x120.p10];

    const minMaxScaler = new MinMaxScaler(featureSplit);

    const features = [[-100, 0], [-80, 25], [0, 50], [70, 75], [100, 100]];
    const scaled = minMaxScaler.scaleInitial(features);

    // guard
    expect(scaled).toEqual([[-1, -1], [-0.8, -0.5], [0, 0], [0.7, 0.5], [1, 1]]);

    const test = [[-110, 0], [-10, 25], [0, 50], [90, 75], [120, 100]];
    const testScaled = minMaxScaler.scale(test);

    expect(round1Features(testScaled)).toEqual([[-1.1, -1], [-0.1, -0.5], [0, 0], [0.9, 0.5], [1.2, 1]]);
  });
});

// helper
const round1Features = (features: number[][]) => {
  return features.map(f => f.map(x => round1(x)));
};
