import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import "./style.css";

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function SendMessage() {
   const [name, setName] = useState('');
   const [send_message, setMessage] = useState('');
   const [response, setResponse] = useState('');
   const [loading, setLoading] = useState(true);
   const [notfoundkey, setNotFoundKey] = useState('');

   // Extract the 'secret' parameter from the URL
   const { secret } = useParams();

   // Fetch the user's information based on the 'secret'
   useEffect(() => {
      async function fetchUser() {
        try {
          // Make an API request to fetch the user's name
          const response = await axios.get(`${API_URL}/api/v1/secret/${secret}`);
         
          setName(response.data.name); 
        } catch (error) {
          setNotFoundKey(error.response.status === 404);

        } finally {
          setLoading(false);
        }
      }

      fetchUser();
   }, [secret]); 

   // Form submission for anonymous message
   async function sendmessage(e) {
     e.preventDefault(); 

     try {
       // Make an API request for sending a message
       const response = await axios.post(`${API_URL}/api/v1/secret/${secret}`, {
          secret_message: send_message
       });

       setMessage('');
       setResponse(response.data.message); 

       setTimeout(() => setResponse(''), 3000);
     } catch (error) {
       console.log(error);
     }
   }
   
   return (
     <div>
        <Container>
          <Row className="d-flex align-items-center justify-content-center mt-2">
            <Col md={5}>
              {loading ? (
                null
              ) : (
                <div>
                   {!notfoundkey ? (
                    <div>
                      <h5 style={{color: 'white', textAlign: 'center'}}>Message for {name}</h5>
                      <p style={{color: 'lightgreen', textAlign: 'center'}}>{response}</p>
                      <div className="p-4">
                        <Form onSubmit={sendmessage}>
                          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Control 
                              as="textarea" 
                              rows={6} 
                              value={send_message} 
                              onChange={(e) => setMessage(e.target.value)} 
                              placeholder='Enter your message here...' 
                              className='custom-input'
                            />
                          </Form.Group>
                          <button type="submit" className="custom-btn btn btn-primary mt-2">Submit</button>
                        </Form>
                      </div>
                    </div>
                  ) : (
                    <h1 style={{color: 'white', textAlign: 'center'}}>Not Found</h1>
                  )}
                </div>
              )}
            </Col>
          </Row>
        </Container>
     </div>
   );
}
