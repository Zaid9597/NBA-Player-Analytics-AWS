import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home"
import Login from "./Login"
import Signup from "./Signup"
import Search from "./Search";
import Profile from "./Profile";
import ConfirmSignup from "./confirmSignup";

function App() {
  return (
    <Router>
      <div className="App">
        <div className="App-body">
          <Routes>
            <Route exact path="/" element={<Login />}></Route>
            <Route exact path="/search/:searchTerm" element={<Search />}></Route>
            <Route exact path="/home" element={<Home />}/>
            <Route exact path="/signup" element={<Signup />}/>
            <Route exact path="/verify" element={<ConfirmSignup />}/>
            <Route exact path="/profile" element={<Profile />}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
