import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import './style.css';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function DeleteAccount() {
   const [validated, setValidated] = useState(false);
   const [password, setPassword] = useState('');
   const [response, setResponse] = useState('');
   const [error, setError] = useState('');
   const [csrfToken, setCsrfToken] = useState('');

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

   // Form submission for account deletion
   async function deleteaccount(e) {
     e.preventDefault();

     const form = e.currentTarget;
     if(form.checkValidity() === false) {
       e.stopPropagation();

     } else {
       try {
         const response = await axios.post(`${API_URL}/api/v1/delete_account`, {
            password: password
         },
         {
            headers: {
              'X-CSRF-TOKEN': csrfToken
            },
            withCredentials: true
         });
  
         setResponse(response.statusText); 
       } catch(error) {
         setError(error.response.data);
 
       } finally {
         setTimeout(() => setError(''), 3000); 
       }
     }

     setValidated(true); 
   }

   function Response() {
      return (
        <div>
          {response ? (
            <Navigate to={`/signin`} /> // Navigate to the sign-in page on successful deletion
          ) : (
            <div>
              <p style={{color: 'red', textAlign: 'center'}}>{error.message}</p> // Display error message
            </div>
          )}
        </div>
      );
   }

   return (
     <div>
        <Container>
            <Row className="d-flex align-items-center justify-content-center mt-4">
               <Col md={5}>
                  <Response />
                  <div className='p-4'>
                     <Form noValidate validated={validated} onSubmit={deleteaccount}>
                        <Form.Group controlId="exampleForm.ControlInput1">
                           <Form.Label style={{color: 'white'}}>Confirm password</Form.Label>
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
                        <button type="submit" className="btn btn-danger mt-3">Delete</button>
                     </Form>
                  </div>
               </Col>
            </Row>
        </Container>
     </div>
   )
}
