import * as mlUtils from "./mlUtils";

test("1", () => {
  const feature = [1, 2, 3, 4, 5];
  const res = mlUtils.rescaleFeatures([feature]);
  expect(res).toEqual([1, 2, 3, 4, 5]);
});
