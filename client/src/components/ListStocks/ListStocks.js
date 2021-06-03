import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";

const ListStocks = (props) => {
  let [responseData, setResponseData] = React.useState("");
  const userID = props.userID;
  console.log(userID);
  const fetchData = React.useCallback(() => {
    axios
      .get("http://localhost:3001/myStocks/userID/" + userID)
      .then((response) => {
        var temp = JSON.stringify(response.data.stocks);
        var rows = JSON.parse(temp).map((stock, index) => (
          <tr key={index}>
            <td>{stock.symbol}</td>
            <td>{stock.name}</td>
            <td>{stock.price}</td>
            <td>{stock.shares}</td>
            <td>{stock.buyPrice}</td>
            <td>{stock.currentValue}</td>
            <td>{stock.yield}</td>
            <td>
              <Button
                block
                size="sm"
                type="submit"
                variant="danger"
                onClick={() => handleSubmit(stock.symbol)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ));
        setResponseData(rows);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  function handleSubmit(stockSymbol) {
    axios
      .delete(
        "http://localhost:3001/deleteStock/" + stockSymbol + "/userID/" + userID
      )
      .then((response) => {
        console.log(response);
        alert(response.data.msg);
        fetchData();
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  return (
    <div
      id="tableWrapper"
      style={{
        width: "75%",
        textAlign: "center",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <h2>List of Stocks</h2>
      <Table striped bordered hover align="center" size="sm">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price</th>
            <th>#</th>
            <th>Buy Value</th>
            <th>Current Value</th>
            <th>Yield</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{responseData}</tbody>
      </Table>
    </div>
  );
};
export default ListStocks;
