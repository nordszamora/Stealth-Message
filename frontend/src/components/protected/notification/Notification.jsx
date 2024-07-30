import { useState, useEffect, useContext } from "react";
import { Navigate, Link } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import Context from "../../context/Context";

import './style.css';

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Notification() {
   const [result, setResult] = useState([]);
   const [csrfToken, setCsrfToken] = useState('');

   // Context to access authentication status and loading state
   const { Isauthenticated, loading } = useContext(Context);

   // Function to get a csrf token
   useEffect(() => {
      async function GetCsrfToken() {
        try {
          const response = await axios.get(`${API_URL}/api/v1/csrf`, { withCredentials: true });
       
          setCsrfToken(response.data.csrf_token);
        } catch(error) {
          console.log(error);
        }
      }

      GetCsrfToken();
   }, []);

   // Fetch user messages
   useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await axios.get(`${API_URL}/api/v1/user`, {
          withCredentials: true 
        });
      
        setResult(response.data.secret_messages); 
      } catch (error) {
        console.log(error); 
      }
    }

    fetchMessages(); 
   }, []);

   // Function to mark a message as read
   async function has_read(key) {
     try {
       await axios.put(`${API_URL}/api/v1/message/${key}`, {
          has_read: true 
       }, 
       {
          headers: {
            'X-CSRF-TOKEN': csrfToken
          },
          withCredentials: true
       });

     } catch (error) {
       console.log(error);
     }
   }

   // Function to remove a message from the list
   async function remove(key) {
     setResult((prevMessage) => prevMessage.filter((msg) => msg.read_key !== key));

     try {
       await axios.delete(`${API_URL}/api/v1/message/${key}`, {
         headers: {
           'X-CSRF-TOKEN': csrfToken
         },

         withCredentials: true
       });

     } catch (error) {
       console.log(error); 
     }
   }

   return (
     <>
      <Container>
        <h1 style={{color: 'white', textAlign: 'center'}} className='mt-2'>Message Notification</h1>
        <Row>
          <Col className="d-flex align-items-center justify-content-center mt-4">
           {loading ? (
              null // Show nothing while loading
            ) : (
              Isauthenticated ? (
                <div>
                  {(result.length === 0) ? (
                    <div>
                      <p style={{color: 'white'}}>No message yet.</p>
                    </div>
                  ) : (
                    <div>
                       {result.map((data, index) => {
                          return (
                            <div key={index}>
                              <div className='mt-3 mb-4'>
                                <Link to={`/user/notification/read/${data.read_key}`} onClick={() => has_read(data.read_key)} className='custom-notification' style={{color: data.has_read ? 'gray' : 'white', border: data.has_read ? '1px solid gray' : '1px solid white'}}>
                                  New message {data.has_read ? null : <span style={{color: 'lightgreen'}}>*</span>}
                                </Link>
                                <Button variant="light" className="ml-2" onClick={() => remove(data.read_key)}>Remove</Button>
                              </div>
                            </div>
                          )
                      }).reverse()} {/* Reverse the list to show the newest first */}
                    </div>
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
