import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import './Home.css';
import Logo from './nba-logo-1.jpg';
var data = require("./out.json");

const Navigation = () => {
  const [searchText, setText] = useState("");
  const [value, setValue] = useState("");

  const navigate = useNavigate();


  function logout() {
    localStorage.clear();
    navigate("/");
  }

  const onChange = (event) => {
    setText(event.target.value);
  };

  const onSearch = (searchTerm) => {
    setValue(searchTerm);
    setText(searchTerm);
  };

  return (
    <div>
        <Navbar variant="dark" fixed="top"  className="navbar1">
          <Container fluid>
            <Navbar.Brand>
                <img
              alt=""
              src={Logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}               
              <strong>NBA Player Analytics</strong></Navbar.Brand>
              <Nav
                className="me-auto my-2 my-lg-0"
                style={{ maxHeight: '100px' }}
                navbarScroll
              >
                <Nav.Link href="/Home"><strong>Home</strong></Nav.Link>
                      </Nav>
                        <button variant="primary" size="sm" className="button1"
                          onClick={() => {
                            logout();
                          }}
                          type="submit">
                            Logout
                        </button>
                        <button variant="primary" size="sm" className="button1"
                          onClick={() => {
                            navigate("/profile");
                          }}
                          type="submit">
                          Profile
                      </button>
                </Container><br></br>
            </Navbar>
              <div className="search-container">
                <div className="search-inner searchloc">
                <input
                className="nav-border"
                placeholder={"Search for a Player"} 
                value={searchText}
                onChange={onChange}/>
                  <button variant="primary" size="sm" className="button1"
                        onClick={() => {
                          if(value){
                          navigate("/search/" + searchText);
                        }}}
                        type="submit"
                      >Search
                      </button>
                        </div>
                        <div className="dropdown innertext searchdrop"> 
                          {data
                            .filter((item) => {
                          const searchTerm = searchText.toLowerCase();
                          const fullName = item.player_name.toLowerCase();
                       return (
                          searchTerm &&
                          fullName.startsWith(searchTerm) &&
                          fullName !== searchTerm
                          );
                      })
                      .slice(0, 10)
                      .map((item) => (
                        <div
                        onClick={() => onSearch(item.player_name)}
                        className="dropdown-row"
                      key={item.player_name}>
                  {item.player_name}
            </div>
            ))}
          </div>
      </div><br></br><br></br>
      </div>
          );
}
export default Navigation;
