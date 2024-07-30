import { useState } from 'react';
import { Navigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import './style.css';

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
   const [validated, setValidated] = useState(false);
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [response, setResponse] = useState('');
   const [error, setError] = useState('');

   // Form submission for authentication
   async function login(e) {
     e.preventDefault();

     const form = e.currentTarget; 
     if (form.checkValidity() === false) {
       e.stopPropagation();

     } else {
       try {
         // Make an API request for login submission
         const response = await axios.post(`${API_URL}/api/v1/login`, {
            username: username,
            password: password
         },
         {
            withCredentials: true 
         });

         setResponse(response.statusText);
       } catch (error) {
         setError(error.response.data.message);
      
       } finally {
         setTimeout(() => setError(''), 3000);
       }
     }

     setValidated(true);
   }

   // Component to display the response or error message
   function Response() {
     return (
       <div>
         {response ? (
           <Navigate to={`/user`} /> // Navigate to user page on successful response
         ) : (
           // Display error message in red if an error occurs
           <p style={{color: 'red', textAlign: 'center'}}>{error}</p>
         )}
       </div>
     );
   }

   return (
     <div>
        <Container>
          <Row className="d-flex align-items-center justify-content-center mt-3">
            <Col md={5}>
             <h1 style={{color: 'white', textAlign: 'center'}}>Login</h1>
             <Response />
             <div className='p-4'>
              <Form noValidate validated={validated} onSubmit={login}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label style={{color: 'white'}}>Username</Form.Label>
                  <Form.Control 
                    type="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                    required 
                    className='custom-input'
                  />
                  <Form.Control.Feedback type="invalid">
                     Provide your username.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                  <Form.Label style={{color: 'white'}}>Password</Form.Label>
                  <Form.Control 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className='custom-input'
                  />
                  <Form.Control.Feedback type="invalid">
                     Provide your password.
                  </Form.Control.Feedback>
                </Form.Group>
                <button type="submit" className="btn btn-primary mt-2">Signin</button>
              </Form>
             </div>
            </Col>
          </Row>
        </Container>
     </div>
   )
}
