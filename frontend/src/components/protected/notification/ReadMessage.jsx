import { useState, useEffect, useContext } from "react";
import { Navigate, useParams } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Context from "../../context/Context";

import "./style.css";

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function ReadMessage() {
   const [result, setResult] = useState('');
   const [notfoundkey, setNotFoundKey] = useState('');

   // Extract the 'key' parameter from the URL
   const { key } = useParams();

   // Context to access authentication status and loading state
   const { Isauthenticated, loading } = useContext(Context);

   // Fetch the message
   useEffect(() => {
    async function fetchMessage() {
      try {
        const response = await axios.get(`${API_URL}/api/v1/message/${key}`, {
           withCredentials: true 
        });
    
        setResult(response.data.secret_message); 
      } catch (error) {
        setNotFoundKey(error.response.status === 404);
      } 
    }

    fetchMessage(); 
   }, [key]); 

   return (
     <>
      <Container>
        <Row>
          <Col className="d-flex align-items-center justify-content-center">
            {loading ? (
              null // Show nothing while loading
            ) : (
              Isauthenticated ? (
                <div>
                  {!notfoundkey ? (
                    <div>
                      <h1 style={{color: 'white', textAlign: 'center'}} className="mt-2">Message</h1>

                      <div className='word-break mt-5'>
                        <p style={{color: 'white', textAlign: 'center', padding: '10px'}}>{result}</p>
                      </div>
                    </div>
                  ) : (
                    <h1 style={{color: 'white', textAlign: 'center'}} className="mt-2">Not Found</h1>
                  )}
                </div>
              ) : (
                <Navigate to={`/signin`} /> // Redirect to signin if not authenticated
              )
            )}
          </Col>
        </Row>
      </Container>
     </>
   );
}
