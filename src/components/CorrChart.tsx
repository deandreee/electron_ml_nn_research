import * as React from "react";
import ReactEcharts from "echarts-for-react";
import { EChartOption } from "echarts";
import styles from "./styles";
import { optionsCorr } from "./optionsCorr";
import { LinRegResult } from "../strat/corr";
import { round2 } from "../strat/utils";

interface State {
  isLoading: boolean;
  options: EChartOption;
}

interface Props {
  linReg: LinRegResult;
}

export class CorrChart extends React.Component<Props, State> {
  readonly state: State = {
    isLoading: true,
    options: optionsCorr
  };

  componentWillMount() {
    const xMin = round2(Math.min.apply(null, this.props.linReg.x));
    const xMax = round2(Math.max.apply(null, this.props.linReg.x));

    const yMin = round2(Math.min.apply(null, this.props.linReg.y));
    const yMax = round2(Math.max.apply(null, this.props.linReg.y));

    const regMin =
      this.props.linReg.regEquation[0] * xMin +
      this.props.linReg.regEquation[1];
    const regMax =
      this.props.linReg.regEquation[0] * xMax +
      this.props.linReg.regEquation[1];

    this.setState({
      options: {
        ...this.state.options,
        xAxis: { ...this.state.options.xAxis, min: xMin, max: xMax },
        yAxis: { ...this.state.options.yAxis, min: yMin, max: yMax },
        title: {
          text: `${this.props.linReg.name}`,
          subtext: `r2: ${this.props.linReg.r2} | corr: ${
            this.props.linReg.corr
          }`,
          left: "center",
          textStyle: {
            fontSize: 10
          }
        },
        series: [
          {
            ...this.state.options.series[0],
            type: "scatter",
            symbolSize: 10,
            data: this.props.linReg.x.map((x, i) => [x, this.props.linReg.y[i]])
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
