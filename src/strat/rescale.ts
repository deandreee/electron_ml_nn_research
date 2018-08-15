import * as statslite from "stats-lite";

// https://stats.stackexchange.com/questions/70801/how-to-normalize-data-to-0-1-range
// newvalue= (max'-min')/(max-min)*(value-max)+max'
// min' to max' => new
export const rescale = (value: number, min: number, max: number): number => {
  const newMin = 0;
  const newMax = 1;
  return ((newMax - newMin) / (max - min)) * (value - max) + newMax;
};

export const rescaleArr0to1 = (arr: number[]): number[] => {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const newMin = 0;
  const newMax = 1;
  return arr.map(
    value => ((newMax - newMin) / (max - min)) * (value - max) + newMax
  );
};

// from here https://github.com/mljs/libsvm/issues/14
export const rescaleForSvm = (arr: number[]): number[] => {
  const mean = statslite.mean(arr);
  const stddev = statslite.stdev(arr);
  return arr.map(x => (x - mean) / stddev);
};
