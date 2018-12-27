import { FeatureSplit } from ".";

export class MinMaxScaler {
  featureSplit: FeatureSplit;

  constructor(featureSplit: FeatureSplit) {
    this.featureSplit = featureSplit;
  }

  scale(features: number[][]) {
    console.log(this.featureSplit.fn.toString());
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
