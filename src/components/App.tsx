import * as React from "react";
import ReactEcharts from "echarts-for-react";
import { flatten } from "lodash";
import { EChartOption } from "echarts";
import styles from "./styles";
import { options } from "./options";
import * as strat from "../strat";
// import * as chartUtils from "./chartUtils";
import { CoinList } from "../strat/types";
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

    const { coins, labelsPredicted } = strat.run();

    // let { min, max } = chartUtils.getMinMax(
    //   coins.EOS.candles.map(x => x && x.percentChange)
    // );

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
        large: true,
        sampling: "average"
      };
    });

    const seriesPctChange60m = {
      ...this.state.options.series[0],
      color: "red",
      data: coins.BTC.candles.map(x => x && [x.start * 1000, x.pctChange60m]),
      name: "PctChange60m",
      xAxisIndex: 1,
      yAxisIndex: 1,
      large: true,
      sampling: "average"
    };

    // const trades = coins.BTC.trader.performanceAnalyzer.tradeHistory.concat(
    // coins.ETH.trader.performanceAnalyzer.tradeHistory
    // );

    const seriesTrades = flatten(
      Object.keys(coins).map(key => {
        const trades = coins[key].trader.performanceAnalyzer.tradeHistory;

        const seriesTradesBuy = {
          symbolSize: 10,
          data: trades
            .filter(x => x.action === "buy")
            .map(x => [x.date.getTime(), x.candle.percentChange]),
          color: "green",
          type: "scatter",
          name: key
        };

        const seriesTradesSell = {
          symbolSize: 10,
          data: trades
            .filter(x => x.action === "sell")
            .map(x => [x.date.getTime(), x.candle.percentChange]),
          color: "red",
          type: "scatter",
          name: key
        };

        return [seriesTradesBuy, seriesTradesSell];
      })
    );

    // const seriesVolume = {
    //   type: "bar",
    //   color: "red",
    //   data: coins.BTC.candles.map(x => [x.start * 1000, x.volume]),
    //   name: "Volume",
    //   xAxisIndex: 1,
    //   yAxisIndex: 1,
    //   large: true,
    //   sampling: "average"
    // };

    const labelsFiltered = labelsPredicted
      .filter(x => x === 1)
      .map((x, i) => ({ x, i }));

    const seriesLabelsPredicted = {
      symbolSize: 5,
      data: labelsFiltered.map(x => [
        coins.BTC.candles[x.i].start * 1000,
        coins.BTC.candles[x.i].percentChange
      ]),
      color: "green",
      type: "scatter",
      large: true
    };

    const legend = getLegend(coins);

    this.setState({
      options: {
        ...this.state.options,
        legend,
        series: [
          ...series,
          ...seriesTrades,
          seriesLabelsPredicted,
          seriesPctChange60m
          // seriesVolume
        ]
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
            const coin = this.state.coins[k];
            const report = coin.trader.performanceAnalyzer.report;

            // const profit = Math.round(report.profit * 100) / 100;
            const market = Math.round(report.market * 100) / 100;
            const relativeProfit =
              Math.round(report.relativeProfit * 100) / 100;

            return (
              <div key={name} style={{ whiteSpace: "pre" }}>
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
                <span style={{ color: relativeProfit > 0 ? "green" : "red" }}>
                  |{" "}
                  {coin.trader.performanceAnalyzer.roundTrips
                    .map(x => Math.round(x.profit * 100) / 100)
                    .join("  |  ")}{" "}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
