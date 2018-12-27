import { MinMaxScaler } from "./MinMaxScaler";
import { FeatureSplit } from ".";

test("featureSplit | single", () => {
  const featureSplit: FeatureSplit = { name: "rsi_combo", fn: x => [x.ind.rsi30x10] };
  const minMaxScaler = new MinMaxScaler(featureSplit);
  const indicators = minMaxScaler.getIndicatorNames();
  expect(indicators).toEqual(["rsi30x10"]);
});

test("featureSplit | multiple", () => {
  const featureSplit: FeatureSplit = {
    name: "rsi_combo_macd",
    fn: x => [x.ind.rsi30x10, x.ind.rsi60x10, x.ind.rsi120x10, x.ind.rsi240x10, x.ind.rsi480x10]
  };
  const minMaxScaler = new MinMaxScaler(featureSplit);
  const indicators = minMaxScaler.getIndicatorNames();
  expect(indicators).toEqual(["rsi30x10", "rsi60x10", "rsi120x10", "rsi240x10", "rsi480x10"]);
});

test("featureSplit | with point", () => {
  const featureSplit: FeatureSplit = { name: "rsi_combo", fn: x => [x.ind.macd30.histo] };
  const minMaxScaler = new MinMaxScaler(featureSplit);
  const indicators = minMaxScaler.getIndicatorNames();
  expect(indicators).toEqual(["macd30.histo"]);
});

test("featureSplit | comment", () => {
  const featureSplit: FeatureSplit = {
    name: "rsi_combo",
    fn: x => [
      x.ind.rsi30x10,
      // x.ind.rsi60x10,
      x.ind.rsi120x10
    ]
  };
  const minMaxScaler = new MinMaxScaler(featureSplit);
  const indicators = minMaxScaler.getIndicatorNames();
  expect(indicators).toEqual(["rsi30x10", "rsi120x10"]);
});
