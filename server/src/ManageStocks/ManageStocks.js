var express = require("express");
const Users = require("../../db");
var fs = require("fs");
const axios = require("axios");

async function WriteFile(updatedUsers) {
  var result; // bool variable which tells whether the action was succesfull or not
  try {
    var file = await fs.createWriteStream("db.js");
    await file.write("const users = ");
    await file.write(JSON.stringify(updatedUsers, null, 2), { spaces: 4 });
    await file.write("\nmodule.exports = users");
    result = true;
  } catch (e) {
    result = false;
    console.log(e);
  }
  return result;
}

module.exports.addStock = async function (req, res) {
  var user;
  var stockExist = false; // Boolean variable which tells whether the stocks exist or not
  const symbol = req.body.symbol;
  const shares = req.body.shares;
  const buyPrice = req.body.buyPrice;
  const userID = req.body.userID;

  var stock = { symbol: symbol, shares: shares, buyPrice: buyPrice };
  // Finding the User
  for (const x of Users) {
    if (x.id == userID) {
      user = x;
      break;
    }
  }

  // Checking if the stock exists
  for (const x of user.stocks) {
    if (x.symbol == symbol) {
      stockExist = true;
      x.shares = parseInt(shares) + parseInt(x.shares);
      // Ambiguity
      // buy value should be updated to new value or the old value ?
      break;
    }
  }
  if (!stockExist) {
    user.stocks.push(stock);
  }
  var dbUpdated = await WriteFile(Users);
  var status;
  var msg;

  if (dbUpdated) {
    status = 200;
    msg = "Stock Added.";
  } else {
    status = 500;
    msg = "Some Error Occured While Adding Stock.";
  }
  res.send({ status: status, msg: msg });
};

module.exports.deleteStock = async function (req, res) {
  var user;
  var symbol = req.params.symbol;
  var userID = req.params.userID;
  console.log(symbol);
  console.log(userID);
  // Finding the User
  for (const x of Users) {
    if (x.id == userID) {
      user = x;
      break;
    }
  }
  // Finding and removing stock
  for (var i = 0; i < user.stocks.length; i++)
    if (user.stocks[i].symbol == symbol) {
        user.stocks.splice(i, 1);
    }
  var dbUpdated = await WriteFile(Users);
  var status;
  var msg;

  if (dbUpdated) {
    status = 200;
    msg = "Stock Deleted.";
  } else {
    status = 500;
    msg = "Some Error Occured While Deleting Stock.";
  }
  res.send({ status: status, msg: msg });
};

module.exports.updateStock = async function (req, res) {
  var user;
  const symbol = req.body.symbol;
  const userID = req.body.userID;
  const shares = req.body.shares;
  // Finding the User
  for (const x of Users) {
    if (x.id == userID) {
      user = x;
      break;
    }
  }
  // Finding and Update No. of Shares of the Stock
  for (var i = 0; i < user.stocks.length; i++)
    if (user.stocks[i].symbol == symbol) {
      user.stocks[i] = shares;
      break;
    }
  var dbUpdated = await WriteFile(Users);
  var status;
  var msg;
  if (dbUpdated) {
    status = 200;
    msg = "Stock Updated.";
  } else {
    status = 500;
    msg = "Some Error Occured While Updating Stock.";
  }
  res.send({ status: status, msg: msg });
};

module.exports.myStocks = async function (req, res) {

  var userID = req.params.userID;
  // Finding the User
  var user = Users.find((user) => user.id == userID);
  var userStocks = user.stocks.map((stock) => stock.symbol);
  // Creating Query to get live Stock values
  const stocksQuery = userStocks.map((stock) => "vwdkey=" + stock).join("&");
  var apiResponse;
  // Sending Get Request to fetch result
  axios
    .get(
      "https://test.solutions.vwdservices.com/internal/intake-test/sample-data/price-data?" +
        stocksQuery
    )
    .then((response) => {
      apiResponse = response.data;
      userStocks = user.stocks.map((stock) => {
        var stockfromAPI = apiResponse.find((s) => s.vwdKey == stock.symbol);
        var name = stockfromAPI.name;
        var price = stock.shares * stock.buyPrice;
        var currentValue = stockfromAPI.price * stock.shares;
        var yield = ((currentValue - price) / price) * 100;
        return {
          ...stock,
          name,
          price,
          currentValue,
          yield,
        };
      });
      res.send({ stocks: userStocks });
    })
    .catch((error) => {
      console.log(error);
    });
};
