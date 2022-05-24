import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
//import { getAllUsers } from './api'
import Iframe from "react-iframe";
import { useNavigate } from "react-router-dom";
import {Button, Table} from 'react-bootstrap';
import './Home.css';
import { Link } from "react-router-dom";
import TopThreeTable from "./TopThreeTable";
import Navigation from "./Navigation";


function App() {
  const [quicksightUrl, setquicksightUrl] = useState("");
  const [searchText, setText] = useState("");
  const navigate = useNavigate();
  
  function logout() {
    localStorage.clear();
    navigate("/");
  }
  useEffect(() => {
    if(localStorage.getItem("email") == null) {
      navigate("/");
      return <div>Redirecting to login...</div>;
    }
    async function fetchData() {
      try {
        const res = await axios.get(
          "https://sgc0m5do03.execute-api.us-east-1.amazonaws.com/dev/charts"
        );
        console.log("success: ", res);
        const qsUrl = res.data.EmbedUrl;
        setquicksightUrl(qsUrl);
        // setBody(res.data.athenaQueryRes);
      } catch (err) {
        console.log("err: ", err);
        return err;
      }
    }
    fetchData();
  }, []);
 
  return (
    <div className="App body3">
      <Navigation/><br></br><br></br>
      <Table>
        <tr className="body3">
          <TopThreeTable title={"Top 3 liked players of today"} api={"https://sgc0m5do03.execute-api.us-east-1.amazonaws.com/dev/topplayers?sentiment=POSITIVE&interval=24&count=3"}/>
          <TopThreeTable title={"Top 3 disliked players of today"} api={"https://sgc0m5do03.execute-api.us-east-1.amazonaws.com/dev/topplayers?sentiment=NEGATIVE&interval=24&count=3"}/>
          <TopThreeTable title={"Top 3 overall players of today"} api={"https://sgc0m5do03.execute-api.us-east-1.amazonaws.com/dev/topplayers?interval=24&count=3"}/>
        </tr><br></br>
        <tr className="body3">
          <TopThreeTable title={"Top 3 liked players of this week"} api={"https://sgc0m5do03.execute-api.us-east-1.amazonaws.com/dev/topplayers?sentiment=POSITIVE&interval=168&count=3"}/>
          <TopThreeTable title={"Top 3 disliked players of this week"} api={"https://sgc0m5do03.execute-api.us-east-1.amazonaws.com/dev/topplayers?sentiment=NEGATIVE&interval=168&count=3"}/>
          <TopThreeTable title={"Top 3 overall players of this week"} api={"https://sgc0m5do03.execute-api.us-east-1.amazonaws.com/dev/topplayers?interval=168&count=3"}/>
        </tr>
      </Table>
      <Iframe
        url={quicksightUrl}
        width="1000px"
        height="1000px"
        id="myId"
        className="myClassname"
        display="initial"
        position="relative"
      />
    </div>
  );
}

export default App;
