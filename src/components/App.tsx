import * as React from "react";
import { run } from "../strat/run";
import { LinRegResult, Prediction } from "../strat/types";
import { AppCharts } from "./AppCharts";
import { DistrCharts } from "./DistrCharts";
import { CorrCandles } from "../strat/corr/CorrCandles";
import { CorrCandleMonths } from "../strat/run/queryCorrCandlesMonths";
// import { AppCorr } from "./AppCorr";

interface State {
  coin: CorrCandles;
  months: CorrCandleMonths;
  linRegs: LinRegResult[];
  labelsPredicted: Prediction[];
}

export class App extends React.Component {
  readonly state: State = {
    coin: null,
    months: null,
    linRegs: [],
    labelsPredicted: []
  };

  async componentWillMount() {
    const { coin, months, linRegs, labelsPredicted } = await run();

    this.setState({
      coin,
      months,
      linRegs,
      labelsPredicted
    });
  }

  style = {
    fontFamily: "Saira, sans-serif",
    fontSize: 10
  };

  render() {
    return (
      <div style={this.style}>
        <AppCharts coin={this.state.coin} labelsPredicted={this.state.labelsPredicted} />
        {/* <AppCorr linRegs={this.state.linRegs} /> */}
        <DistrCharts months={this.state.months} />
      </div>
    );
  }
}
