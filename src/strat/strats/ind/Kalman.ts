import KalmanFilter from "kalmanjs";
import { Candle, IndChannel } from "../../types";

export class Kalman {
  period: number;
  kalman: any;

  constructor(period: number) {
    this.period = period;
    this.kalman = new KalmanFilter({ R: 0.01, Q: 3, B: 2 });
  }

  update = (price: number): number => {
    return this.kalman.filter(price);
  };
}
