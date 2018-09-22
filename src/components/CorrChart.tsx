import * as React from "react";
import ReactEcharts from "echarts-for-react";
import { flatten } from "lodash";
import { EChartOption } from "echarts";
import styles from "./styles";
import { optionsCorr } from "./optionsCorr";
import { config } from "../strat/config";

interface State {
  isLoading: boolean;
  options: EChartOption;
}

interface Props {
  x: number[];
  y: number[];
  regEquation: number[];
}

export class CorrChart extends React.Component<Props, State> {
  readonly state: State = {
    isLoading: true,
    options: optionsCorr
  };

  componentWillMount() {
    const xMin = Math.min.apply(null, this.props.x);
    const xMax = Math.max.apply(null, this.props.x);

    const regMin = this.props.regEquation[0] * xMin + this.props.regEquation[1];
    const regMax = this.props.regEquation[0] * xMax + this.props.regEquation[1];

    this.setState({
      options: {
        ...this.state.options,
        series: [
          {
            ...this.state.options.series[0],
            type: "scatter",
            symbolSize: 10,
            data: this.props.x.map((x, i) => [x, this.props.y[i]])
          },
          {
            ...this.state.options.series[0],
            color: "red",
            type: "line",
            data: [[xMin, regMin], [xMax, regMax]]
          }
        ]
      },
      isLoading: false
    });
  }

  style = {
    fontFamily: "Saira, sans-serif",
    fontSize: 10
  };

  render() {
    return (
      <div style={this.style}>
        <ReactEcharts
          option={this.state.options}
          style={{ height: "600px", width: "100%" }}
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
