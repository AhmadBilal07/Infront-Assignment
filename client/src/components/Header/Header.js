import React from "react";
import styled from "styled-components";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import "./Header.css";
import AddStocks from "../AddStock/AddStock";
import Landing from "../Landing/Landing";
import Login from "../Login/Login";
import SignUp from "../SignUp/SignUp";
import ListStocks from "../ListStocks/ListStocks";
import Home from "../Home/Home";

const Header = () => {
  let [responseData, setResponseData] = React.useState({
    userID: "",
    userValid: false,
  });

  function updateUser(userID) {
    let userExist = false;
    if (userID) {
      userExist = true;
    }
    setResponseData({
      userID: userID,
      userValid: userExist,
    });
  }

  return (
    <header>
      <BrowserRouter>
        <nav className="stroke" id="mainNav">
          <ul>
            {responseData.userValid ? (
              <div className="floatleft">
                <li>
                  <Link to="/addStocks">
                    <span>Add Stocks</span>
                  </Link>
                </li>
                <li>
                  <Link to="myStocks">
                    <span>My Stocks</span>
                  </Link>
                </li>
              </div>
            ) : (
              ""
            )}
            <li id="appTitle">
              <Link to="/">
                <span>Stock App</span>
              </Link>
            </li>
            <div className="floatright">
              {responseData.userValid ? (
                <li>
                  <Link to="/">
                    <span onClick={() => updateUser("")}>Logout</span>
                  </Link>
                </li>
              ) : (
                <span>
                  <li>
                    <Link to="signUp">
                      <span>Sign Up</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="login">
                      <span>Login</span>
                    </Link>
                  </li>
                </span>
              )}
            </div>
          </ul>
        </nav>
        <Switch>
          <Route path="/login">
            <Login onLogin={updateUser} />
          </Route>
          <Route path="/signUp" exact>
            <SignUp />
          </Route>
          <Route path={"/myStocks"}>
            <ListStocks userID={responseData.userID} />
          </Route>
          <Route path="/addStocks">
            <AddStocks userID={responseData.userID} />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/">
            {responseData.userValid ? <Home /> : <Landing />}
          </Route>
        </Switch>
      </BrowserRouter>
    </header>
  );
};
export default Header;
