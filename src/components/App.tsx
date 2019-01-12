import * as React from "react";
import * as strat from "../strat";
import { LinRegResult } from "../strat/types";
import { AppCharts } from "./AppCharts";
import { CorrCandles } from "../strat/corr/CorrCandles";
// import { AppCorr } from "./AppCorr";

interface State {
  coin: CorrCandles;
  linRegs: LinRegResult[];
  labelsPredicted: number[];
}

export class App extends React.Component {
  readonly state: State = {
    coin: null,
    linRegs: [],
    labelsPredicted: []
  };

  async componentWillMount() {
    const { coin, linRegs, labelsPredicted } = await strat.run();

    this.setState({
      coin,
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
      </div>
    );
  }
}
