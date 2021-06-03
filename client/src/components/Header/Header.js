import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({ responseData, updateUser }) => {
  return (
    <header>
      <nav className="stroke" id="mainNav">
        <ul className="d-flex justify-content-between align-items-center">
          {responseData.userValid ? (
            <div className="d-flex">
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
          <div className="d-flex ml-auto">
            {responseData.userValid ? (
              <li>
                <Link to="/">
                  <span onClick={() => updateUser("")}>Logout</span>
                </Link>
              </li>
            ) : (
              <React.Fragment>
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
              </React.Fragment>
            )}
          </div>
        </ul>
      </nav>
    </header>
  );
};
export default Header;
