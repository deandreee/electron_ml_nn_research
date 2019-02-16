import * as mlEvaluate from "./mlEvaluate";
import { round2 } from "../utils";

describe("mlEvaluate", () => {
  test("r2 | 1", () => {
    const truu = [1, 2, 3, 4, 5];
    const pred = [1, 2, 3, 4, 5];
    const { r2 } = mlEvaluate.evalRegR2(truu, pred);
    expect(r2).toEqual(1);
  });

  test("r2 | 0.95", () => {
    const truu = [3, -0.5, 2, 7];
    const pred = [2.5, 0.0, 2, 8];
    const { r2 } = mlEvaluate.evalRegR2(truu, pred);
    expect(round2(r2)).toEqual(0.95);
  });

  test("r2 | 0", () => {
    const truu = [1, 2, 3];
    const pred = [2, 2, 2];
    const { r2 } = mlEvaluate.evalRegR2(truu, pred);
    expect(r2).toEqual(0);
  });

  test("r2 | -3", () => {
    const truu = [1, 2, 3];
    const pred = [3, 2, 1];
    const { r2 } = mlEvaluate.evalRegR2(truu, pred);
    expect(r2).toEqual(-3);
  });

  test("r2 | -1.6", () => {
    const truu = [1, 2, 3, 4, 5];
    const pred = [5, 3, 1, 2, 4];
    const { r2 } = mlEvaluate.evalRegR2(truu, pred);
    expect(r2).toEqual(-1.6);
  });

  test("r2 | 0.9", () => {
    const truu = [1, 2, 3, 4, 5];
    const pred = [1, 1, 3, 4, 5];
    const { r2 } = mlEvaluate.evalRegR2(truu, pred);
    expect(r2).toEqual(0.9);
  });

  test("r2 | 0.8", () => {
    const truu = [1, 2, 3, 4, 5];
    const pred = [1, 1, 3, 4, 4];
    const { r2 } = mlEvaluate.evalRegR2(truu, pred);
    expect(r2).toEqual(0.8);
  });

  test("r2 | 0.4", () => {
    const truu = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const pred = [1, 1, 3, 4, 4, 5, 1, 8, 8, 7];
    const { r2 } = mlEvaluate.evalRegR2(truu, pred);
    expect(round2(r2)).toEqual(0.41);
  });

  test("r2 | -0.07", () => {
    const truu = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 1, 5, 7, 8, 9, 2, 4, 5, 10];
    const pred = [1, 1, 3, 4, 4, 5, 1, 8, 8, 7, 7, 7, 7, 9, 2, 3, 4, 5, 10];
    const { r2 } = mlEvaluate.evalRegR2(truu, pred);
    expect(round2(r2)).toEqual(-0.07);
  });
});
