import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import { SIGNUP } from '../api/auth/api';
import './style.css';

export default function Register() {
   const [validated, setValidated] = useState(false);
   const [name, setName] = useState('');
   const [username, setUsername] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);

   // Mutation function for registration
   const {status, error, isError, mutate} = SIGNUP();

    // Form submission for registration
   async function register(e) {
     e.preventDefault();
     setLoading(true);

     const form = e.currentTarget;
     if (form.checkValidity() === false) {
       e.stopPropagation();
       setLoading(false);

     } else {
       // Make an API request for registration submission
       mutate({name: name, username: username, email: email, password: password})
     }

     setValidated(true);
   }

   // Handle mutation response for registration
   useEffect(() => {
      if(isError) {
        setLoading(false);
      }
   }, [isError]);

   // Component to display the response or error messages
   function Response() {
     return (
       <div>
         {status === 'success' ? (
           <Navigate to={`/signin`} /> // Navigate to signin page on successful response
         ) : (
           // Display error messages for each field in red if errors occur
           (error ? (
             <div>
               <p style={{color: 'red', textAlign: 'center'}}>
                  {error.response.data.name}
               </p>
               <p style={{color: 'red', textAlign: 'center'}}>
                  {error.response.data.username}
               </p>
               <p style={{color: 'red', textAlign: 'center'}}>
                  {error.response.data.email}
               </p>
               <p style={{color: 'red', textAlign: 'center'}}>
                  {error.response.data.password}
               </p>
             </div>
           ) : (null))
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
                    <Form.Label style={{color: 'white'}}>Email</Form.Label>
                    <Form.Control 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      className='custom-input'
                    />
                    <Form.Control.Feedback type="invalid">
                       Please choose a email.
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="exampleForm.ControlInput4">
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
                  <button type="submit" className="btn btn-primary mt-2" disabled={loading}>
                     {loading ? 'Please wait...' : 'Signup'}
                  </button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
     </div>
   );
}
