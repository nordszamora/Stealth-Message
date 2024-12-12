import { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import { RESET_REQUEST } from '../api/reset_pass/api';
import './style.css';

export default function ResetRequest() {
   const [validated, setValidated] = useState(false);
   const [account, setAccount] = useState('');
   const [loading, setLoading] = useState(false);

   // Mutation function to reset request
   const { data, isSuccess, isError, error, mutate } = RESET_REQUEST()

   // Form submission for Password request
   async function reset_request(e) {
     e.preventDefault();
     setLoading(true);

     const form = e.currentTarget; 
     if (form.checkValidity() === false) {
       e.stopPropagation();
       setLoading(false);

     } else {
       // Make an API request for reset request submission
       mutate({ account: account })
     }

     setValidated(true);
   }

   // Handle mutation response for reset request
   useEffect(() => {
      if(isSuccess) {
        setLoading(false);
      }
   }, [isSuccess]);

   return (
     <div>
        <Container>
          <Row className="d-flex align-items-center justify-content-center mt-3">
            <Col md={5}>
             <h1 style={{color: 'white', textAlign: 'center'}}>Password Reset</h1>
             <p style={{color: isError ? 'red' : 'lightgreen', textAlign: 'center'}}>{error?.response?.data.message || data?.message}</p>
             <div className='p-4'>
              <Form noValidate validated={validated} onSubmit={reset_request}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label style={{color: 'white'}}>Username or Email address</Form.Label>
                  <Form.Control 
                    type="account" 
                    value={account} 
                    onChange={(e) => setAccount(e.target.value)} 
                    required 
                    className='custom-input'
                  />
                  <Form.Control.Feedback type="invalid">
                     Provide your username or email address.
                  </Form.Control.Feedback>
                </Form.Group>
                <button type="submit" className="btn btn-primary mt-2" disabled={loading}>
                   {loading ? 'Please wait...' : 'Submit'}
                </button>
              </Form>
             </div>
            </Col>
          </Row>
        </Container>
     </div>
   )
}
