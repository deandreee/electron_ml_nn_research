import * as React from "react";
import ReactEcharts from "echarts-for-react";
import { EChartOption } from "echarts";
import styles from "./styles";
import { options } from "./options";
import * as strat from "../strat";

interface State {
  isLoading: boolean;
  options: EChartOption;
}

export class App extends React.Component {
  readonly state: State = {
    isLoading: true,
    options
  };

  async componentWillMount() {
    this.setState({ isLoading: false });
    const coins = await strat.run();
  }

  render() {
    return (
      <div>
        <ReactEcharts
          option={options}
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
      </div>
    );
  }
}
