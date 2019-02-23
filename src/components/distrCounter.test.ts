import * as distrCounter from "./distrCounter";

test("0.1", () => {
  const res = distrCounter.roundNear(0.09);
  expect(res).toEqual(0);
});

test("0.1", () => {
  const res = distrCounter.roundNear(0.1);
  expect(res).toEqual(0.2);
});

test("0.26", () => {
  const res = distrCounter.roundNear(0.26);
  expect(res).toEqual(0.2);
});

test("0.49", () => {
  const res = distrCounter.roundNear(0.49);
  expect(res).toEqual(0.4);
});

test("-0.09", () => {
  const res = distrCounter.roundNear(-0.09);
  expect(res).toEqual(0);
});

test("-0.09", () => {
  const res = distrCounter.roundNear(-0.09);
  expect(res).toEqual(0);
});

test("-0.11", () => {
  const res = distrCounter.roundNear(-0.11);
  expect(res).toEqual(-0.2);
});

test("-15.11", () => {
  const res = distrCounter.roundNear(-15.11);
  expect(res).toEqual(-15.2);
});

test("15.11", () => {
  const res = distrCounter.roundNear(15.11);
  expect(res).toEqual(15.2);
});

test("group", () => {
  const res = distrCounter.group([0.09, 0.11, -0.2, -0.09, 0, 0.01, -0.11, 55]);
  expect(res).toEqual({
    0: 4,
    [-0.2]: 2,
    [0.2]: 1,
    [55]: 1
  });
});
