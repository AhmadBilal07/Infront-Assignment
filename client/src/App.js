import React from "react";
import Header from "./components/Header/Header";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AddStocks from "./components/AddStock/AddStock"
import Landing from "./components/Landing/Landing";
import Login from "./components/Login/Login";
import SignUp from "./components/SignUp/SignUp";
import ListStocks from "./components/ListStocks/ListStocks";
import Home from "./components/Home/Home";

const App = () => {
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
    <div className="app">
      <BrowserRouter>
        <Header responseData={responseData} updateUser={updateUser} />
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
    </div>
  );
};
export default App;
