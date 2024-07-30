import { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import "./style.css";

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function ChangeName() {
   const [validated, setValidated] = useState(false);
   const [new_name, setName] = useState('');
   const [response, setResponse] = useState('');
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

   // Form submission for changing the name
   async function changename(e) {
     e.preventDefault();

     const form = e.currentTarget;
     if (form.checkValidity() === false) {
       e.stopPropagation();

     } else {
       try {
         // Make an API request to change the user's name
         const response = await axios.put(`${API_URL}/api/v1/change_name`, {
            name: new_name
         },
         {
            headers: {
              'X-CSRF-TOKEN': csrfToken
            },
            withCredentials: true
         });
 
         setResponse(response.data);
       } catch (error) {
         setResponse(error.response); 
      
       } finally {
         setTimeout(() => setResponse(''), 3000); 
       }
     }

     setValidated(true);
   }

   return (
     <div>
        <Container>
          <Row className="d-flex align-items-center justify-content-center mt-4">
            <Col md={5}>
              {/* Display success or error message */}
             {!response.status ? 
               <p style={{color: 'lightgreen', textAlign: 'center'}}>{response.message}</p> 
               : 
               <p style={{color: 'red', textAlign: 'center'}}>{response.data.name}</p>
             }
             <div className='p-4'>
              <Form noValidate validated={validated} onSubmit={changename}>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label style={{color: 'white'}}>New name</Form.Label>
                  {/* Input field for the new name */}
                  <Form.Control 
                    type="name" 
                    value={new_name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    className='custom-input'
                  />
                  <Form.Control.Feedback type="invalid">
                     Provide your name.
                  </Form.Control.Feedback>
                </Form.Group>
                <button type="submit" className="btn btn-primary mt-2">Change</button>
              </Form>
             </div>
            </Col>
          </Row>
        </Container>
     </div>
   )
}
