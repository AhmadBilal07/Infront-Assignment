var express = require("express");
const Users = require("../../db");
var uuid = require("uuid");
var fs = require("fs");

async function WriteFile(updatedUsers) {
  var result; // bool variable which tells whether the transaction was succesfull or not
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

module.exports.login = function (req, res) {
  console.log("login");
  const email = req.body.email;
  const password = req.body.password;
  var user = Users.find(
    (user) => user.email == email && user.password == password
  );
  var userID = user.id;
  if (user) {
    res.send({ status: 200, msg: "User Exists", userID: userID });
  } else {
    res.send({ status: 500, msg: "Some Error Occured While Logging In." });
  }
};

module.exports.signUp = async function (req, res) {
  console.log("Sign Up");
  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  var id = uuid.v1();
  var user = {
    id: id,
    email: email,
    firstName: firstName,
    lastName: lastName,
    password: password,
    stocks: [],
  };
  Users.push(user);
  var dbUpdated = await WriteFile(Users);
  var status;
  var msg;

  if (dbUpdated) {
    status = 200;
    msg = "User Created. Please Login Now";
  } else {
    status = 500;
    msg = "Some Error Occured.";
  }
  res.send({ status: status, msg: msg });
};
