  import React,{useEffect, useState, ReactDOM} from 'react';
  import { useParams } from 'react-router-dom';
  import axios from "axios";
  import TweetEmbed from 'react-tweet-embed'
  import { Table, Spinner } from 'react-bootstrap';
  import './Home.css';
  import Navigation from "./Navigation";

  const Search = () => {
    
      const {searchTerm} = useParams();
      const [statLoading, setStatLoading] = useState(true);
      const [tweetLoading, setTweetLoading] = useState(true);
      const [body, setBody] = useState([]);
      const [body1, setBody1] = useState([]);
      const [body2, setBody2] = useState([]);


      useEffect(() => {
        
        //single time
        fetchData();
      }, []);


      async function fetchData() {
          try{
            const res = await axios.get('https://sgc0m5do03.execute-api.us-east-1.amazonaws.com/dev/playerv2?fullname='+searchTerm);
            const res1 = await axios.get('https://sgc0m5do03.execute-api.us-east-1.amazonaws.com/dev/tweets?fullname='+searchTerm+'&count=1');
            const res2 = await axios.get('https://09b7oxkoef.execute-api.us-east-1.amazonaws.com/v1/photo?player_name='+searchTerm);

            console.log("success: ", res)
            setBody(res.data);
            setStatLoading(false);
            setBody1(res1.data);
            setTweetLoading(false);
            setBody2(res2.data);

          } catch(err){
            console.log("err: ", err)
            return err
          }
        };
          function arrowFun(val) {
            if (val.past_ranking == null) {
              return (<h4 className='greenar2'>↑</h4>);
            } else if (val.ranking < val.past_ranking) {
              return (<h4 className='greenar2'>↑</h4>);
            } else if (val.ranking > val.past_ranking) {
              return (<h4 className='redar2'>↓</h4>);
            }
            return (<h4 className='greenar2'>↑</h4>);
          }
  
      return (
          <div className='body1'>
            <Navigation/><br></br>
            <div className='mainPlayer body2'>
              {body.map((val) => {
                if(val.interval=="week" && val.sentiment=='all'){
                    return (
                      <div>
                        <img alt="poster" height = "100" width="136" src={body2}></img><br></br>
                        <h3>{val.player_full_name}</h3>
                      </div>
                    );}
                  }
                  )}
              </div>
              <br></br>
          <div>
            {statLoading ?                 
              <Spinner animation="border" >
                  <span className="visually-hidden">Loading...</span>
              </Spinner> : <></>
            }
          </div>
          <div className="row">
          <div className="col mainsearch"> 
          <Table striped bordered hover className="bdr">
            <thead className="tabletop">
              <tr>
                <th> Ranking </th> <th> Total Tweet Count </th> <th> Past Ranking </th> <th> Past Tweet Counts </th>
              </tr>
              </thead>
  
              {body.map((val) => {
                if(val.interval=="week" && val.sentiment=='all'){
                    return (
                          <tr>
                          <td><div className='searchfix'>{val.ranking}<div className='searchfix3'>{arrowFun(val)}</div></div></td> 
                          <td className='innertext'>{val.count}</td>
                          <td className='innertext'>{val.past_ranking}</td>
                          <td className='innertext'>{val.past_count}</td>
                          </tr>
                    );}
                  }
                  )}
              </Table>
              </div>
              <div className="col"> 
              <Table striped bordered hover className="bdr">
                <thead className="tabletop">
                  <tr>
                    <th> Today's postive ranking</th> 
                    <th> Today's negative ranking</th>
                     <th>Weekly postive ranking</th>
                      <th>Weekly negative ranking</th>
                  </tr>
                  </thead>
              {body.map((val) => {
                if(val.interval=="day" && val.sentiment=='positive'){
                    return (
                     <td><div className='searchfix2'>{val.ranking} {arrowFun(val)}</div></td> 
                    );}
                  }
                  )}
   
              {body.map((val) => {
                if(val.interval=="day" && val.sentiment=='negative'){
                    return (
                      <td><div className='searchfix2'>{val.ranking} {arrowFun(val)}</div></td> 
                    );}
                  }
                  )}
  
              {body.map((val) => {
                if(val.interval=="week" && val.sentiment=='positive'){
                    return (
                      <td><div className='searchfix2'>{val.ranking} {arrowFun(val)}</div></td> 
                    );}
                  }
                  )}
  
              {body.map((val) => {
                if(val.interval=="week" && val.sentiment=='negative'){
                    return (
                      <td><div className='searchfix2'>{val.ranking} {arrowFun(val)}</div></td> 
                    );}
                  }
                  )}
                </Table>
                </div>
  
  
              </div>
              <Table bordered table-striped className="bdrsearch" >
              <thead className="tabletop">
                  <tr>
                    <th><h3><strong>User Tweets</strong></h3></th>
                  </tr>
                  </thead>
              <div className="row">
  
              <div>
                {tweetLoading ?                 
                <Spinner animation="border" variant="light">
                    <span className="visually-hidden">Loading...</span>
                </Spinner> : <></>
                }
              </div>
              {body1.map((val, index) => {
  
                  if (index == 0)
                  return (
  
                    <div className="col tabletop2"> <strong>{val.sentiment+' Tweet'}</strong> <TweetEmbed tweetId= {val.tweet_id} options={{width: 420, theme: 'dark'}}/>  </div> 
  
                  );})}
  
  
              {body1.map((val, index) => {
  
                    if (index == 1)
                    return (
  
                      <div className="col tabletop2"> <strong>{val.sentiment+' Tweet'}</strong>  <TweetEmbed tweetId= {val.tweet_id} options={{width: 420, theme: 'dark'}}/>  </div> 
  
                    );})}
  
  
              {body1.map((val, index) => {
  
                if (index == 2)
                return (
                  <div className="col tabletop2"> <strong>{val.sentiment+' Tweet'}</strong> <TweetEmbed tweetId= {val.tweet_id} options={{width: 420, theme: 'dark'}}/> </div>
                    );})}
              </div>
                  </Table>
          </div>
      );
  };
  
  export default Search;