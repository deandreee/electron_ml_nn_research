import * as access from "safe-access";
import styles from "./styles";

// (point: Array, params: Object|Array.<Object>, dom: HTMLDomElement, rect: Object, size: Object) => Array
// size:
// contentSize [465, 185]
// viewSize [1920, 500]
let positionDesktop = (
  pt: number[],
  params: any,
  domElem: any,
  rect: any,
  size: object
) => {
  // console.log(pt, rect, size);
  // console.log(pt);

  let [x, y] = pt;
  // return [ x - 10, y - 1 ];
  // return [ x, y ];

  let contentX = access(size, "contentSize[0]");
  let viewX = access(size, "viewSize[0]");

  if (!contentX || !viewX) {
    // just in case
    return [x, y];
  } else if (x + contentX > viewX) {
    return [x - contentX, y];
  } else {
    return [x, y];
  }
};

export const itemTooltip = {
  show: true,
  trigger: "item", // [ default: 'item' ]
  triggerOn: "mousemove", // click mousemove // [ default: 'mousemove|click' ]
  borderColor: styles.colors.primary,
  borderWidth: 3,
  textStyle: { fontFamily: styles.fontFamily },
  backgroundColor: "rgba(55,55,55,0.9)", // default opacity 0.7, let's make a bit more dark
  // position: positionDesktop,

  enterable: true, // need this so mouseover stops working while inside tooltip
  // showDelay: 500,
  hideDelay: 1000 // doesn't really change anything
};

// blue line with standart tooltip
export const axisTooltip = {
  // https://ecomfe.github.io/echarts-examples/public/editor.html?c=candlestick-sh-2015
  trigger: "axis",
  axisPointer: {
    animation: false,
    // type: "cross", // removes that label at the bottom of axis that makes it hard to read, very good
    lineStyle: {
      color: "#376df4",
      width: 2,
      opacity: 1
    }
  }
};
