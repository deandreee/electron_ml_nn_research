import * as React from "react";
import { CoinList } from "../strat/types";

interface Props {
  coins: CoinList;
}

export class Profits extends React.Component<Props, {}> {
  pad = (s: string, size: number): string => {
    while (s.length < size) s += " ";
    return s;
  };

  render() {
    return (
      <div>
        <span style={{ color: "white" }}>Profits:</span>
        {Object.keys(this.props.coins).map(k => {
          const name = k;
          const coin = this.props.coins[k];
          const report = coin.trader.performanceAnalyzer.report;

          // const profit = Math.round(report.profit * 100) / 100;
          const market = Math.round(report.market * 100) / 100;
          const relativeProfit = Math.round(report.relativeProfit * 100) / 100;

          return (
            <div key={name} style={{ whiteSpace: "pre", color: "white" }}>
              <span style={{ fontStyle: "bold" }}>{this.pad(name, 8)}</span>
              {/* <span style={{ color: profit > 0 ? "green" : "red" }}>
                {this.pad(profit + "", 8)}{" "}
              </span>*/}
              <span style={{ color: market > 0 ? "green" : "red" }}>
                {this.pad(market + "", 8)}{" "}
              </span>
              <span style={{ color: relativeProfit > 0 ? "green" : "red" }}>
                {this.pad(relativeProfit + "", 8)}{" "}
              </span>
              <span>
                |{" "}
                {coin.trader.performanceAnalyzer.roundTrips.map(x => (
                  <span style={{ color: x.profit > 0 ? "green" : "red" }}>
                    {Math.round(x.profit * 100) / 100} |{" "}
                  </span>
                ))}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
}
