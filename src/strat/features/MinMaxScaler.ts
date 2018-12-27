import { FeatureSplit } from ".";
import { minBy, maxBy } from "lodash";
import { rescale } from "../rescale";

interface MinMax {
  min: number;
  max: number;
}

interface MinMaxMap {
  [indicator: string]: MinMax;
}

export class MinMaxScaler {
  featureSplit: FeatureSplit;
  indicators: string[];
  minMaxMap: MinMaxMap;

  constructor(featureSplit: FeatureSplit) {
    this.featureSplit = featureSplit;
  }

  // scale for training set, can only be called single time
  scaleInitial(features: number[][]) {
    if (this.indicators) {
      throw new Error("ERROR: scaleInitial can only be called single time");
    }

    this.indicators = this.getIndicatorNames();

    // sanity check
    if (this.indicators.length !== features[0].length) {
      throw new Error(
        `ERROR: indicators.length (${this.indicators.length}) !== features.length (${features[0].length})`
      );
    }

    this.minMaxMap = this.getMinMaxFeatureMap(features);
    return this.scale(features);
  }

  // scale each next testing set, reusing existing minMaxMap
  scale(features: number[][]) {
    return features.map(f => {
      return f.map((x, i) => {
        const minMax = this.getMinMaxByIdx(i);
        return rescale(x, minMax.min, minMax.max);
      });
    });
  }

  getMinMaxByIdx(idx: number) {
    const indicator = this.indicators[idx];
    return this.minMaxMap[indicator];
  }

  getMinMaxFeatureMap(features: number[][]) {
    const fCount = features[0].length; // small count like 5
    let minMaxMap: MinMaxMap = {};
    for (let fc = 0; fc < fCount; fc++) {
      // big length like 50k
      const indicator = this.indicators[fc];

      const hardcoded = this.getHardcodedMinMax(indicator);
      if (hardcoded) {
        minMaxMap[indicator] = hardcoded;
      } else {
        const min = minBy(features, x => x[fc])[fc];
        const max = maxBy(features, x => x[fc])[fc];
        minMaxMap[indicator] = { min, max };
      }
    }

    return minMaxMap;
  }

  getHardcodedMinMax(indicator: string) {
    const hardcoded_0_100 = ["rsi"];

    for (let x of hardcoded_0_100) {
      if (indicator.startsWith(x)) {
        return { min: 0, max: 100 };
      }
    }
    return null;
  }

  getIndicatorNames() {
    let fn = this.featureSplit.fn.toString();
    fn = fn.replace("x => [", "");
    fn = fn.replace("]", "");
    const indicators = fn
      .split(",")
      .map(x => x.trim())
      .map(x => x.replace("x.ind.", ""))
      .filter(x => x.indexOf("//") !== 0);

    return indicators;
  }
}
