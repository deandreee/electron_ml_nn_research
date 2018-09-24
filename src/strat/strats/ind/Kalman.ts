import KalmanFilter from "kalmanjs";

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
