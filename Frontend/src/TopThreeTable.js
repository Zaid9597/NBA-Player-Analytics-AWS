import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Table, Spinner } from 'react-bootstrap';
import PlayerPhoto from './PlayerPhoto';
import "./TopThreeTable.css"


const TopThreeTable = ({ title, api }) => {
    function arrowFun(val) {
        if (val.past_ranking == null) {
          return (<h4 className='greenar'>↑</h4>);
        } else if (val.ranking < val.past_ranking) {
          return (<h4 className='greenar'>↑</h4>);
        } else if (val.ranking > val.past_ranking) {
          return (<h4 className='redar'>↓</h4>);
        }
        return (<h4 className='greenar'>↑</h4>);
      }
    const [body, setBody] = useState([]);
    const [loading, setLoading] = useState(true);
    async function fetchData() {
        try {
            const res = await axios.get(api);
            res.data.sort((a,b)=>a.ranking-b.ranking);
            setBody(res.data);
            setLoading(false);
          } catch (err) {
            console.log("err: ", err);
            return err;
          }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <th className='tableContent'>
        <div>
          <h5><strong> {title} </strong></h5>
          <Table striped bordered hover className="bdr">
          <thead className="tabletop">
            <tr>
              <th> NAME </th> <th> RANKING </th> <th> TWEETS </th>
            </tr>
            </thead>  
          
            {loading ?                 
            <Spinner animation="border" role="status" variant="info" >
                <span className="visually-hidden">Loading...</span>
            </Spinner> : 
            body && body.map((val) => {
              return (
                <tr>
                  <td><PlayerPhoto playerName={val.player_full_name}/><br></br>
                  <a href={'/search/'+ val.player_full_name}>{val.player_full_name}</a></td>  
                  <td> <div className='tableContent homerankfix'>
                       {val.ranking}{arrowFun(val)}</div>
                  </td>
                  <td className='tableContent'> {val.count} </td>
                </tr>
              );
            })}
          </Table>
        </div>
      </th>
    );
};

export default TopThreeTable;