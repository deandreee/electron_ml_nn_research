import styles from "./styles";
import * as chartUtils from "./chartUtils";

// interface FormatterParams {
//   value: number;
// }

export default {
  type: "time",
  // splitLine: { lineStyle: { color: 'white' }},
  axisLabel: {
    color: styles.colors.axis,
    fontFamily: styles.fontFamily,
    formatter: function(ts: number, index: number) {
      return chartUtils.formatDateShort(ts);
    }
  }
  // axisPointer: {
  //   // value: '2016-10-7',
  //   snap: true,
  //   triggerOn: "mousemove", // click mousemove mousemove|click
  //   type: "line", // line / shadow
  //   // status: true,
  //   lineStyle: {
  //     type: "dotted", // solid / dashed / dotted
  //     color: styles.colors.primary,
  //     opacity: 0.5,
  //     width: 5
  //   },
  //   label: {
  //     show: false,
  //     formatter: function(params: FormatterParams) {
  //       return params.value;
  //     },
  //     backgroundColor: "#004E52"
  //   },
  //   handle: {
  //     show: true,
  //     size: 0
  //     // color: '#004E52'
  //   }
  // }
};
