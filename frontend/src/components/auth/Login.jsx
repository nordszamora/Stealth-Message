import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import { SIGNIN } from '../api/auth/api';
import './style.css';

export default function Login() {
   const [validated, setValidated] = useState(false);
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);

   // Mutation function for authentication
   const {status, error, isError, mutate} = SIGNIN();

   // Form submission for authentication
   function login(e) {
     e.preventDefault();
     setLoading(true);

     const form = e.currentTarget; 
     if (form.checkValidity() === false) {
       e.stopPropagation();
       setLoading(false);
       
     } else {
      // Make an API request for authentication
       mutate({username: username, password: password});
     }

     setValidated(true); 
   }

   // Handle mutation response for authentication
   useEffect(() => {
     if(isError) {
       setLoading(false);
     }
   }, [isError]);

   // Component to display the response or error message
   function Response() {
     return (
       <div>
         {status === 'success' ? (
           <Navigate to={`/user`} /> // Navigate to user page on successful response
         ) : (
           // Display error message in red if an error occurs
           (error ? (<p style={{color: 'red', textAlign: 'center'}}>{error.response.data.message}</p>) : null)
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
                <div className='mt-2'>
                  <Link to={'/reset_password'} style={{textDecoration: 'none'}}>Reset Password</Link>
                </div>

                <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                   {loading ? 'Please wait...' : 'Signin'}
                </button>
              </Form>
             </div>
            </Col>
          </Row>
        </Container>
     </div>
   );
}
