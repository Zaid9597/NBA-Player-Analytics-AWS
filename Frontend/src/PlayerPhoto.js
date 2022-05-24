import React from 'react';
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


const PlayerPhoto = ({ playerName }) => {
    const [url, setUrl] = useState("");
    // const navigate = useNavigate();
    async function fetchPhotoUrl() {
        try{
          const res = await axios.get('https://09b7oxkoef.execute-api.us-east-1.amazonaws.com/v1/photo?player_name='+playerName);
          console.log("success: ", res)
          setUrl(res.data);

        } catch(err){
          console.log("err: ", err)
          return err
        }
    };

    useEffect(() => {
        fetchPhotoUrl();
    }, []);
      
    return (
        <img alt="poster" height = "60" width="82" src={url}></img>
    );
};

export default PlayerPhoto;