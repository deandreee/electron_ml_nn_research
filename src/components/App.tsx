import * as React from "react";
import ReactEcharts from "echarts-for-react";
import { EChartOption } from "echarts";
import styles from "./styles";
import { options } from "./options";
import * as strat from "../strat";
import * as Database from "better-sqlite3";
// import * as path from "path";
import * as chartUtils from "./chartUtils";
import { CoinList, CoinData } from "../strat/types";
import { getLegend } from "./getLegend";

interface State {
  isLoading: boolean;
  options: EChartOption;
  coins: CoinList;
}

export class App extends React.Component {
  readonly state: State = {
    isLoading: true,
    options: options,
    coins: {}
  };

  async componentWillMount() {
    // const dbBinance = new Database("./binance_0.1.db");

    const coins = strat.run();

    let { min, max } = chartUtils.getMinMax(
      coins.EOS.candles.map(x => x && x.percentChange)
    );

    // const min = 0.5;
    // const max = 1.05;

    const series = Object.keys(coins).map(k => {
      // const series = ["BTC", "ETH", "XRP", "BCC", "XLM", "TRX", "EOS"].map(k => {
      // const series = ["BTC", "EOS"].map(k => {
      return {
        ...this.state.options.series[0],
        color: coins[k].color || "white",
        data: coins[k].candles.map(x => x && [x.start * 1000, x.percentChange]),
        name: k,
        large: true
      };
    });

    const seriesTrades = {
      symbolSize: 5,
      data: [[coins.BTC.buyAtTs * 1000, coins.BTC.buyAtProfit]],
      color: "red",
      type: "scatter"
    };

    const legend = getLegend(coins);

    this.setState({
      options: {
        ...this.state.options,
        legend,
        yAxis: { ...this.state.options.yAxis, min, max },
        series: [...series, seriesTrades]
      },
      isLoading: false,
      coins
    });
  }

  style = {
    fontFamily: "Saira, sans-serif",
    fontSize: 10
  };

  pad = (s: string, size: number): string => {
    while (s.length < size) s += " ";
    return s;
  };

  render() {
    return (
      <div style={this.style}>
        <ReactEcharts
          option={this.state.options}
          style={{ height: "500px", width: "100%" }}
          notMerge={true}
          lazyUpdate={true}
          theme={"dark"}
          onEvents={{}}
          showLoading={this.state.isLoading}
          loadingOption={{
            color: styles.colors.primary,
            maskColor: styles.colors.background
          }}
        />
        <div>
          Profits:
          {Object.keys(this.state.coins).map(k => {
            const name = k;
            const profitLast = this.state.coins[k].profitLast;
            const profitMax = this.state.coins[k].profitMax;
            return (
              <div key={name} style={{ whiteSpace: "pre" }}>
                {this.pad(name, 8)} {this.pad(profitLast + "", 8)}{" "}
                {this.pad(profitMax + "", 8)}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
