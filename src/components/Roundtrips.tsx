import * as React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { CoinData, RoundTrip } from "../strat/types";

interface Props {
  coin: CoinData;
}

export class Roundtrips extends React.Component<Props, {}> {
  render() {
    const columns = [
      {
        id: "entryAt",
        Header: "Entry at",
        accessor: (x: RoundTrip) => x.entryAt.toISOString()
      },
      {
        id: "exitAt",
        Header: "Exit at",
        accessor: (x: RoundTrip) => x.exitAt.toISOString()
      },
      {
        Header: "Exposure",
        accessor: "duration"
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
