import * as React from "react";
import { LinRegResult } from "../strat/corrCalc";
import { CorrChart } from "./CorrChart";

interface Props {
  linRegs: LinRegResult[];
}

export class AppCorr extends React.Component<Props> {
  render() {
    const { linRegs } = this.props;

    return (
      <>
        <div style={{ display: "flex" }}>
          <div style={{ width: "48%" }}>{linRegs[0] && <CorrChart linReg={linRegs[0]} />}</div>
          <div style={{ width: "48%" }}>{linRegs[1] && <CorrChart linReg={linRegs[1]} />}</div>
        </div>
        <div style={{ display: "flex" }}>
          <div style={{ width: "48%" }}>{linRegs[2] && <CorrChart linReg={linRegs[2]} />}</div>
          <div style={{ width: "48%" }}>{linRegs[3] && <CorrChart linReg={linRegs[3]} />}</div>
        </div>
      </>
    );
  }
}
