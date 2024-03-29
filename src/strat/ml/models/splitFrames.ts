export interface TrainBatch {
  features: number[][];
  labels: number[];
}

export const splitFrames = (features: number[][], labels: number[], batchSize: number) => {
  const batches: TrainBatch[] = [];

  // ask: change this
  // const stepLength = batchSize;
  const stepLength = 10;

  for (let i = 0; i < features.length; i += stepLength) {
    if (i + batchSize < features.length) {
      const from = i;
      const to = i + batchSize;
      batches.push({ features: features.slice(from, to), labels: labels.slice(from, to) });
    } else {
      // take last sample from end with overlap with previous
      const from = features.length - batchSize;
      const to = features.length;
      batches.push({ features: features.slice(from, to), labels: labels.slice(from, to) });
    }
  }

  return batches;
};
