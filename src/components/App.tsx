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
  err: Error;
}

export class App extends React.Component {
  readonly state: State = {
    coin: null,
    months: null,
    linRegs: [],
    labelsPredicted: [],
    err: null
  };

  async componentWillMount() {
    try {
      const { coin, months, linRegs, labelsPredicted } = await run();

      this.setState({
        coin,
        months,
        linRegs,
        labelsPredicted
      });
    } catch (err) {
      this.setState({ err });
    }
  }

  style = {
    fontFamily: "Saira, sans-serif",
    fontSize: 10
  };

  render() {
    return (
      <div style={this.style}>
        {this.state.err && (
          <div style={{ color: "red", fontWeight: "bold" }}>
            <div>ERROR: ${this.state.err.message}</div>
            <div>
              <pre>${this.state.err.stack}</pre>
            </div>
          </div>
        )}
        <AppCharts coin={this.state.coin} labelsPredicted={this.state.labelsPredicted} />
        {/* <AppCorr linRegs={this.state.linRegs} /> */}
        <DistrCharts months={this.state.months} />
      </div>
    );
  }
}
