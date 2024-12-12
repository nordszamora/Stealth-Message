import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import { SEND_TO_USER, SEND_MESSAGE } from '../api/sendmessage/api';
import "./style.css";

export default function SendMessage() {
   const [send_message, setMessage] = useState('');
   const [loading, setLoading] = useState(false);

   // Extract the 'secret' parameter from the URL
   const { secret } = useParams();

   // Response data from the SENDUSER
   const { data: User, isError, isLoading: UserLoading } = SEND_TO_USER(secret);

   // Mutation function for sending a message
   const { data: Message, mutate, isSuccess, isLoading: MessageLoading } = SEND_MESSAGE(secret);

   // Check loading or error states and return null or render the "Not Found"
   if(UserLoading && MessageLoading) return null;
   if(isError) return <h1 style={{color: 'white', textAlign: 'center'}}>Not Found</h1>;

   // Form submission for sending a message
   function sendmessage(e) {
      e.preventDefault();
      setLoading(true);

      // Make an API request for sending a message
      mutate({secret_message: send_message})
   }

   // Handle mutation response sending a message
   useEffect(() => {
      if(isSuccess) {
        setLoading(false);
      }
   }, [isSuccess]);
   
   return (
     <div>
        <Container>
          <Row className="d-flex align-items-center justify-content-center mt-2">
            <Col md={5}>
              <div>
                <h5 style={{color: 'white', textAlign: 'center'}}>Message for {User?.name}</h5>
                <p style={{color: 'lightgreen', textAlign: 'center'}}>{Message?.message}</p>
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
                    <button type="submit" className="custom-btn btn btn-primary mt-2" disabled={loading}>
                       {loading ? 'Sending...' : 'Submit'}
                    </button>
                  </Form>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
     </div>
   );
}
