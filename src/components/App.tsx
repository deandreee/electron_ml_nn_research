import * as React from "react";
// import ReactEcharts from "echarts-for-react";
import { EChartOption } from "echarts";
import { options } from "./options";
import * as strat from "../strat";
import { LinRegResult } from "../strat/corr";
// import * as chartUtils from "./chartUtils";
import { CoinList } from "../strat/types";
import { getLegend } from "./getLegend";
import { seriesInd } from "./series";
import { CorrChart } from "./CorrChart";

interface State {
  isLoading: boolean;
  options: EChartOption;
  coins: CoinList;
  linRegs: LinRegResult[];
}

export class App extends React.Component {
  readonly state: State = {
    isLoading: true,
    options: options,
    coins: {},
    linRegs: []
  };

  async componentWillMount() {
    const { coins, linRegs } = strat.run();

    // const currentProp = "percentChange";
    const currentProp = "close";

    const series = Object.keys(coins).map(k => {
      return {
        ...this.state.options.series[0],
        color: coins[k].color || "white",
        data: coins[k].candles.map(x => x && [x.start * 1000, x[currentProp]]),
        name: k,
        large: true,
        sampling: "average",
        symbol: "none"
      };
    });

    // const labelsFiltered = labelsPredicted
    //   .map((x, i) => ({ x, i }))
    //   .filter(x => x.x === 1);

    // const seriesLabelsPredicted = {
    //   symbolSize: 5,
    //   data: labelsFiltered.map(x => [
    //     coins[config.leadCoin].candles[x.i].start * 1000,
    //     coins[config.leadCoin].candles[x.i][currentProp]
    //   ]),
    //   color: "green",
    //   type: "scatter",
    //   large: true
    // };

    const seriesInd_ = seriesInd(currentProp, coins);

    const legend = getLegend(coins, seriesInd_);

    this.setState({
      options: {
        ...this.state.options,
        legend,
        series: [
          ...series,

          // ...seriesTrades(currentProp, coins),
          // ...seriesSignals(currentProp, coins),
          // seriesLabelsPredicted,
          ...seriesInd_
        ]
      },
      isLoading: false,
      coins,
      linRegs
    });
  }

  style = {
    fontFamily: "Saira, sans-serif",
    fontSize: 10
  };

  render() {
    return (
      <div style={this.style}>
        {/* <ReactEcharts
          option={this.state.options}
          style={{ height: "300px", width: "100%" }}
          notMerge={true}
          lazyUpdate={true}
          theme={"dark"}
          onEvents={{}}
          showLoading={this.state.isLoading}
          loadingOption={{
            color: styles.colors.primary,
            maskColor: styles.colors.background
          }}
        /> */}
        <div style={{ display: "flex" }}>
          <div style={{ width: "48%" }}>
            <CorrChart linReg={this.state.linRegs[0]} />
          </div>
          <div style={{ width: "48%" }}>
            <CorrChart linReg={this.state.linRegs[1]} />
          </div>
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ width: "48%" }}>
            <CorrChart linReg={this.state.linRegs[2]} />
          </div>
          <div style={{ width: "48%" }}>
            <CorrChart linReg={this.state.linRegs[3]} />
          </div>
        </div>
        {/* <Profits coins={this.state.coins} /> */}
        {/* <Roundtrips coin={this.state.coins[config.leadCoin]} /> */}
      </div>
    );
  }
}
