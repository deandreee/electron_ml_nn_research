import fetch from "node-fetch";

const root = "http://localhost:5000";
const headers = { "Content-Type": "application/json" };

interface RLResponse {
  episodes: number[][][];
}

export const rl = async (columns: string[], features: number[][], labels: number[]): Promise<RLResponse> => {
  const body = JSON.stringify({ columns, features, labels });
  const resp = await fetch(`${root}/rl`, { method: "POST", body, headers });
  const json = await resp.json();

  const { episodes } = json;
  return { episodes };
};
