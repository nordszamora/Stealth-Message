import { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import { CHECK_TOKEN, RESET_CONFIRMATION } from '../api/reset_pass/api';
import './style.css';

export default function ResetConfirmation() {
   const [validated, setValidated] = useState(false);
   const [password, setPassword] = useState('');
   const [confirm, setConfirm] = useState('');
   const [loading, setLoading] = useState(false);
   const [feedback, setFeedback] = useState('');

   // Extract the 'key' parameter from the URL
   const { token } = useParams();

   // Response data from the CHECK_TOKEN
   const { error: TokenNotFound, isError, isLoading } = CHECK_TOKEN(token);

   // Mutation function to reset confirmation
   const { error: Issue, mutate, isSuccess } = RESET_CONFIRMATION();

   // Handle mutation response for checking password length
   useEffect(() => {
      if(Issue) {
        setLoading(false);
      }
    }, [Issue]);

   // Check loading states and return null or render "Token Not Found"
   if(isLoading) return null;
   if(isError) return <h1 style={{color: 'white', textAlign: 'center'}}>{TokenNotFound?.response?.data?.message}</h1>

   // Form submission for reset confirmation
   function reset_confirmation(e) {
     e.preventDefault();
     setLoading(true);

     const form = e.currentTarget; 
     if (form.checkValidity() === false) {
       e.stopPropagation();
       setLoading(false);

     } else {
       // Validation to check if password was matched
       // Make an API request for reset confirmation submission
       if(password === confirm) {
         mutate({ token: token, new_password: password })
       } else {
         setTimeout(() => {
            setLoading(false);
            setFeedback('* Password was not matched')
         }, 800);
       }
     }

     setValidated(true);
     setFeedback('');
   }

   // Check if success then navigate away as needed
   if(isSuccess) return <Navigate to='/signin'/>;

   return (
     <div>
        <Container>
          <Row className="d-flex align-items-center justify-content-center mt-3">
            <Col md={5}>
             <h1 style={{color: 'white', textAlign: 'center'}}>Reset Confirmation</h1>
             <p style={{color: 'lightblue', textAlign: 'center'}}>Confirmation will expired in 5 minutes.</p> 

             <p style={{color: 'red', textAlign: 'center'}}>{feedback || Issue?.response?.data?.new_password}</p> 
  
             <div className='p-4'>
              <Form noValidate validated={validated} onSubmit={reset_confirmation}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label style={{color: 'white'}}>New password</Form.Label>
                  <Form.Control 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className='custom-input'
                  />
                  <Form.Control.Feedback type="invalid">
                     Provide your new password.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                  <Form.Label style={{color: 'white'}}>Confirm password</Form.Label>
                  <Form.Control 
                    type="password" 
                    value={confirm} 
                    onChange={(e) => setConfirm(e.target.value)} 
                    required 
                    className='custom-input'
                  />
                  <Form.Control.Feedback type="invalid">
                     Confirm your new password.
                  </Form.Control.Feedback>
                </Form.Group>
                <button type="submit" className="btn btn-primary mt-2" disabled={loading}>
                   {loading ? 'Confirming...' : 'Confirm'}
                </button>
              </Form>
             </div>
            </Col>
          </Row>
        </Container>
     </div>
   )
}
