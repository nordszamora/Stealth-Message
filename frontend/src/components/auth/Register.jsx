import { useState } from 'react';
import { Navigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import './style.css';

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
   const [validated, setValidated] = useState(false);
   const [name, setName] = useState('');
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [response, setResponse] = useState('');
   const [error, setError] = useState('');

    // Form submission for registration
   async function register(e) {
     e.preventDefault(); 

     const form = e.currentTarget;
     if (form.checkValidity() === false) {
       e.stopPropagation();

     } else {
       try {
         // Make an API request for registration submission
         const response = await axios.post(`${API_URL}/api/v1/register`, {
            name: name,
            username: username,
            password: password
         });

         setResponse(response.statusText);
       } catch (error) {
         setError(error.response.data);
   
       } finally {
         setTimeout(() => setError(''), 3000);
       }
     }

     setValidated(true);
   }

   // Component to display the response or error messages
   function Response() {
     return (
       <div>
         {response ? (
           <Navigate to={`/signin`} /> // Navigate to signin page on successful response
         ) : (
           // Display error messages for each field in red if errors occur
           <div>
             <p style={{color: 'red', textAlign: 'center'}}>{error.name}</p>
             <p style={{color: 'red', textAlign: 'center'}}>{error.username}</p>
             <p style={{color: 'red', textAlign: 'center'}}>{error.password}</p>
           </div>
         )}
       </div>
     );
   }

   return (
     <div>
        <Container>
          <Row className="d-flex align-items-center justify-content-center mt-3">
            <Col md={5}>
              <h1 style={{color: 'white', textAlign: 'center'}}>Create Account</h1>
              <Response />
              <div className='p-4'>
                <Form noValidate validated={validated} onSubmit={register}>
                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label style={{color: 'white'}}>Name</Form.Label>
                    <Form.Control 
                      type="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      required 
                      className='custom-input'
                    />
                    <Form.Control.Feedback type="invalid">
                       Provide your name.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                    <Form.Label style={{color: 'white'}}>Username</Form.Label>
                    <Form.Control 
                      type="username" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      required 
                      className='custom-input'
                    />
                    <Form.Control.Feedback type="invalid">
                       Please choose a username.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput3">
                    <Form.Label style={{color: 'white'}}>Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      value={password} 
                      onChange={(e) => 
                      setPassword(e.target.value)} 
                      required 
                      className='custom-input'
                    />
                    <Form.Control.Feedback type="invalid">
                       Please choose a password.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <button type="submit" className="btn btn-primary mt-2">Signup</button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
     </div>
   );
}
