import * as React from "react";
import * as strat from "../strat";
import { LinRegResult } from "../strat/corrCalc";
import { CoinList } from "../strat/types";
// import { AppCharts } from "./AppCharts";
import { AppCorr } from "./AppCorr";

interface State {
  coins: CoinList;
  linRegs: LinRegResult[];
}

export class App extends React.Component {
  readonly state: State = {
    coins: {},
    linRegs: []
  };

  async componentWillMount() {
    const { coins, linRegs } = await strat.run();

    this.setState({
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
        {/* <AppCharts coins={this.state.coins} /> */}
        <AppCorr linRegs={this.state.linRegs} />
      </div>
    );
  }
}
