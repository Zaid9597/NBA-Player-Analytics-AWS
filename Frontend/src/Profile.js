import React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Navigation from "./Navigation";
import Iframe from "react-iframe";
import { Table } from 'react-bootstrap';


const Profile = () => {
    const [body, setBody] = useState([]);
    const [name, setName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        //single time
        fetchData();
      }, []);
      
      function setData(pname){
        const user = {
            email: localStorage.getItem("email"),
            player: pname
          };  
          try{
            axios.post(`https://sgc0m5do03.execute-api.us-east-1.amazonaws.com/dev/subscribe`,user)
            .then(res => {
              console.log(res);
              console.log(res.data);
              window.location.reload();
            })
        }
          catch(err){
            console.log("err: ", err)
            return err
          }
      };
    async function fetchData() {
        try{
          const res = await axios.get('https://sgc0m5do03.execute-api.us-east-1.amazonaws.com/dev/subscribe?username='+localStorage.getItem("email"));
          console.log("success: ", res)
          setBody(res.data);

        } catch(err){
          console.log("err: ", err)
          return err
        }
      };


    return (
        <div className='body3'>
          <Navigation/><br></br><br></br>
          <div className='profilemain'>
          <div className='profile1'>
            <table>
                <tr><td><strong>User Email Address</strong> : {localStorage.getItem("email")}</td></tr><br></br>
            </table>
            <table>
                <tr>
                    <td><strong>Add Player  :</strong></td><td></td>
                    <td>
                    <input
                    className="form-input profileadd"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  ></input>
                    </td>
                    <td>
                    <button  className="btn-sm btn-danger textini3" onClick={() => {setData(name)}}>
                Add
              </button>
                    </td>
                    
                </tr>
                </table>
            </div>
                  <br></br>
            <div className="profilebdr body2">
            <Table striped bordered hover table className='innertables'>
            <thead className="tabletop">
            <tr>
              <th>List of Subscribed Players</th> </tr>
            </thead>
            {body.map((val) => {
                  return (
                    <tr>
                      <td  className='innertext'> {val} </td>  
                    </tr>
                  );
                })}

            </Table>
            </div>
            </div>

        <Iframe
        width="1000px"
        height="500px"
        id="myId"
        className="myClassname"
        display="initial"
        position="relative"
      />
        </div>
    );
};

export default Profile;