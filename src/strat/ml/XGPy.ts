import fetch from "node-fetch";

const root = "http://localhost:5000";
const headers = { "Content-Type": "application/json" };

export const train = async (features: number[][], labels: number[], xgOpts: any) => {
  const body = JSON.stringify({ features, labels, xgOpts });
  await fetch(`${root}/train`, { method: "POST", body, headers });
  // const json = await resp.json();
  return { free: () => {} };
};

export const predict = async (features: number[][], labels: number[]) => {
  const body = JSON.stringify({ features, labels });
  const resp = await fetch(`${root}/predict`, { method: "POST", body, headers });
  const json = await resp.json();
  return json.predicted as number[];
};
