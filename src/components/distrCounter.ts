export const roundNear = (x: number) => {
  const res = Math.round(x * 5) / 5;
  return res === -0 ? 0 : res;
};

export const group = (labels: number[]) => {
  const count: { [x: number]: number } = {};
  for (let x of labels) {
    const r = roundNear(x);
    count[r] = count[r] ? count[r] + 1 : 1;
  }
  return count;
};

export const getLine = (labels: number[]) => {
  const count = group(labels);
  const res = [];
  for (let x in count) {
    res.push([parseInt(x), count[x]]);
  }
  return res.sort((a, b) => a[0] - b[0]);
};
