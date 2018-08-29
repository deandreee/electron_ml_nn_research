import { LRC } from "./LRC";

import { Candle, IndChannel } from "../../types";

export class LRCChannel {
  depth: number;
  lrc: LRC;
  up: number;
  down: number;

  constructor(depth: number, up: number, down: number) {
    this.depth = depth;
    this.lrc = new LRC(depth);
    this.up = up;
    this.down = down;
  }

  update = (price: number): IndChannel => {
    const val = this.lrc.update(price);
    if (!val) {
      return { up: null, down: null };
    }

    const up = val + (val * this.up) / 100;
    const down = val + (val * this.down) / 100;
    return { up, down };
  };
}
