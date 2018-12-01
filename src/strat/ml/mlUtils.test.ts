import * as mlUtils from "./mlUtils";

const inMap = (arr: number[]) => {
  return arr.map(x => [x]);
};

const outMap = (arr: number[][]) => {
  return arr.map(x => x[0]);
};

test("1", () => {
  const feature = [1, 2, 3, 4, 5];
  const res = mlUtils.rescaleFeatures(inMap(feature));
  expect(outMap(res)).toEqual([-1, -0.5, 0, 0.5, 1]);
});

test("2", () => {
  const feature = [20, 10, 0, 10, 20];
  const res = mlUtils.rescaleFeatures(inMap(feature));
  expect(outMap(res)).toEqual([1, 0, -1, 0, 1]);
});

test("3", () => {
  const feature = [20, 10, 0, 10, 20];
  const res = mlUtils.rescaleFeatures(inMap(feature));
  expect(outMap(res)).toEqual([1, 0, -1, 0, 1]);
});

test("4", () => {
  const feature = [-100, -80, -50, 0, 60, 70, 100];
  const res = mlUtils.rescaleFeatures(inMap(feature));
  expect(outMap(res)).toEqual([-1, -0.8, -0.5, 0, 0.6, 0.7, 1]);
});

test("5", () => {
  const feature = [0, 25, 50, 75, 100];
  const res = mlUtils.rescaleFeatures(inMap(feature));
  expect(outMap(res)).toEqual([-1, -0.5, 0, 0.5, 1]);
});
