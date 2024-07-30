import { useState, useEffect, useContext } from "react";
import { Navigate, Link, Outlet } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Context from "../../context/Context";

import "./style.css";

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function Settings() {
   const [response, setResponse] = useState('');

   // Extract authentication status and loading state from Context
   const { Isauthenticated, loading } = useContext(Context);

   // Fetch user data 
   useEffect(() => {
      async function UserData() {
        try {
          // Make an API request to fetch user data
          const response = await axios.get(`${API_URL}/api/v1/user`, {
             withCredentials: true
          });
      
          setResponse(response.data.user_data);
        } catch(error) {
          console.log(error);
        }
      }

      UserData();
   }, []);

   return (
     <>
      <div id="detail">
        {/* Render loading state */}
        {loading ? (
          null
         ) : (
          // Check if the user is authenticated
          Isauthenticated ? (
           <div>
              <Container>
                <Row>
                  <Col className="d-flex align-items-center justify-content-center mt-2">
                    {/* Display user information */}
                    <h3 style={{color: 'white'}}>{response.name} (@{response.username})</h3>
                  </Col>
                </Row>
                <Row>
                  <Col className="d-flex align-items-center justify-content-center">
                    <nav>
                      {/* Navigation links for changing settings */}
                      <Link to={`change_name`} className='custom-change'>Change name</Link>
                      <Link to={`change_username`} className='custom-change'>Change username</Link>
                      <Link to={`change_password`} className='custom-change'>Change password</Link>
                      <Link to={`delete_account`} className='custom-delete'>Delete account</Link>
                    </nav>
                  </Col>
                </Row>
             </Container>

             {/* Render nested routes */}
             <Outlet />
           </div>
         ) : (
           // Redirect to sign-in page if not authenticated
           <Navigate to='/signin'/>
         ))}
     </div>
     </>
   )
}
