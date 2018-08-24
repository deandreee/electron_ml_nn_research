import * as React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { CoinData, RoundTrip } from "../strat/types";
import * as moment from "moment";

interface Props {
  coin: CoinData;
}

export class Roundtrips extends React.Component<Props, {}> {
  render() {
    const columns = [
      {
        id: "entryAt",
        Header: "Entry at",
        accessor: (x: RoundTrip) => moment(x.entryAt).format("DD MMM    HH:mm")
      },
      {
        id: "exitAt",
        Header: "Exit at",
        accessor: (x: RoundTrip) => moment(x.exitAt).format("DD MMM   HH:mm")
      },

      {
        id: "duration",
        Header: "Exposure",
        accessor: (x: RoundTrip) => moment.duration(x.duration, "ms").humanize()
      },
      {
        Header: "Entry Balance",
        accessor: "entryBalance"
      },
      {
        Header: "Exit Balance",
        accessor: "exitBalance"
      },
      {
        Header: "P&L",
        accessor: "pnl"
      },
      {
        Header: "Profit",
        accessor: "profit"
      }
    ];

    return (
      <div>
        <ReactTable
          className="-striped -highlight"
          data={this.props.coin.trader.performanceAnalyzer.roundTrips}
          columns={columns}
          getProps={() => ({
            style: {
              color: "white"
            }
          })}
        />
      </div>
    );
  }
}
