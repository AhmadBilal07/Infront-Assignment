const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

const axios = require("axios");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var Login = require("../server/src/Login/Login");
var Stocks = require("../server/src/ManageStocks/ManageStocks");

http.createServer(app).listen(3001, () => {
  console.log("Listen on 0.0.0.0:3001");
});
app.get("/", (_, res) => {
  res.send({ status: 200 });
});

// Routes
app.post("/login", Login.login);
app.post("/signUp", Login.signUp);
app.post("/addStock", Stocks.addStock);
app.delete("/deleteStock/:symbol/userID/:userID", Stocks.deleteStock);
app.patch("/updateStock", Stocks.updateStock);
app.get("/myStocks/userID/:userID", Stocks.myStocks);


process.on("SIGINT", function () {
  process.exit();
});
