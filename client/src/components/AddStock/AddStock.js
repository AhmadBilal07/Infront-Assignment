import React, { useState } from "react";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";

const AddStocks = (props) => {
  const userID = props.userID;
  const [state, setState] = useState({
    symbol: "",
    shares: "",
    buyPrice: "",
  });
  const onInputChange = (event) => {
    const { name, value } = event.target;
    setState({
      ...state,
      [name]: value,
    });
  };
  function validateForm() {
    return (
      state.symbol.length > 0 &&
      state.shares.length > 0 &&
      state.buyPrice.length > 0
    );
  }
  function handleSubmit(event) {
    event.preventDefault();
    axios
      .post("http://localhost:3001/addStock", { ...state, userID })
      .then((response) => {
        console.log(response);
        alert(response.data.msg);
        setState({ symbol: "", shares: "", buyPrice: "" });
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
      <h2>Add Stock</h2>
      <Form onSubmit={handleSubmit}>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Shares</th>
              <th>Buy Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  name="symbol"
                  onChange={onInputChange}
                  value={state.symbol}
                />
              </td>
              <td>
                <input
                  name="shares"
                  onChange={onInputChange}
                  value={state.shares}
                />
              </td>
              <td>
                <input
                  name="buyPrice"
                  onChange={onInputChange}
                  value={state.buyPrice}
                />
              </td>
              <td>
                <Button
                  block
                  size="sm"
                  type="submit"
                  disabled={!validateForm()}
                >
                  Add
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </Form>
    </div>
  );
};
export default AddStocks;
