import { times } from "lodash";
import { Candle } from "./types";
import { rescale } from "./rescale";

// min max for each feature, then re-calc
export const getTrainData = (candlesActual: Candle[]) => {
  // const features = candlesActual.map(x => x.features);
  // const labels = candlesActual.map(x => x.label);

  const testCandles = overSample(candlesActual);

  const testFeatures = scaleTestData(testCandles.map(x => x.features));
  const testLabels = testCandles.map(x => x.label);
  return { testFeatures, testLabels };
};

const scaleTestData = (features: number[][]) => {
  const fCount = features[0]!.length;
  const testFeatures = create2DArray(features.length, fCount);
  for (let f = 0; f < fCount; f++) {
    const min = Math.min(...features.map(x => x![f]));
    const max = Math.max(...features.map(x => x![f]));
    for (let i = 0; i < features.length; i++) {
      testFeatures[i][f] = rescale(features[i][f], min, max);
    }
  }
  return testFeatures;
};

const overSample = (candlesActual: Candle[]): Candle[] => {
  const candles0 = candlesActual.filter(x => x.label === 0);
  const candles1 = candlesActual.filter(x => x.label === 1);

  const multiplier = candles0.length / candles1.length;

  let copyCandles: Candle[] = [];
  times(Math.floor(multiplier), () => {
    copyCandles = copyCandles.concat(candles1);
  });

  return candlesActual.concat(copyCandles);
};

const create2DArray = (numRows: number, numColumns: number): number[][] => {
  let array = new Array(numRows);

  for (let i = 0; i < numRows; i++) {
    array[i] = new Array(numColumns);
  }

  return array;
};
