import * as mlEvaluate from "./mlEvaluate";

describe("mlEvaluate", () => {
  test("r2 | 1", () => {
    const labels = [1, 2, 3, 4, 5];
    const predicted = [1, 2, 3, 4, 5];
    const { r2 } = mlEvaluate.evalRegR2(labels, predicted);
    expect(r2).toEqual(1);
  });

  test.only("corr r2 | 1", () => {
    const labels = [1, 2, 3, 4, 5];
    const predicted = [1, 2, 3, 4, 5];
    const { r2 } = mlEvaluate.evalRegCorr(labels, predicted);
    expect(r2).toEqual(1);
  });

  test("r2 | 0.9x", () => {
    const labels = [1, 2, 3, 4, 5];
    const predicted = [2, 2, 3, 4, 5];
    const { r2 } = mlEvaluate.evalRegR2(labels, predicted);
    expect(r2).toEqual(0.8);
  });

  test.only("corr r2 | 0.9x", () => {
    const labels = [1, 2, 3, 4, 5];
    const predicted = [2, 2, 3, 4, 5];
    const { r2 } = mlEvaluate.evalRegCorr(labels, predicted);
    expect(r2).toEqual(0.8);
  });

  test("r2 | 1", () => {
    const labels = [1, 2, 3, 4, 5];
    const predicted = [2, 3, 4, 5, 6];
    const { r2 } = mlEvaluate.evalRegR2(labels, predicted);
    expect(r2).toEqual(1);
  });

  test.only("corr r2 | 1", () => {
    const labels = [1, 2, 3, 4, 5];
    const predicted = [2, 3, 4, 5, 6];
    const { r2 } = mlEvaluate.evalRegCorr(labels, predicted);
    expect(r2).toEqual(1);
  });

  test("r2 | 0", () => {
    const labels = [1, 2, 3, 4, 5];
    const predicted = [3, 3, 3, 3, 3];
    const { r2 } = mlEvaluate.evalRegR2(labels, predicted);
    expect(r2).toEqual(0);
  });

  test.only("corr r2 | 0", () => {
    const labels = [1, 2, 3, 4, 5];
    const predicted = [3, 3, 3, 3, 3];
    const { r2 } = mlEvaluate.evalRegCorr(labels, predicted);
    expect(r2).toEqual(0);
  });

  //https://en.wikipedia.org/wiki/Coefficient_of_determination
  test("r2 | wiki", () => {
    const labels = [1, 2, 3, 4, 5];
    const predicted = [1.9, 3.7, 5.8, 8.0, 9.6];
    const { r2 } = mlEvaluate.evalRegR2(labels, predicted);
    expect(r2).toEqual(0.998);
  });

  test.only("corr r2 | wiki", () => {
    const labels = [1, 2, 3, 4, 5];
    const predicted = [1.9, 3.7, 5.8, 8.0, 9.6];
    const { r2 } = mlEvaluate.evalRegCorr(labels, predicted);
    expect(r2).toEqual(0.998);
  });
});
