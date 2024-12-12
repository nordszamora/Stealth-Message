import { useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Badge from "react-bootstrap/Badge";

import { AUTH_SUCCESS, USER_DATA, LOGOUT } from '../api/user/api';
import './style.css';

export default function User() {
   const [copySuccess, setCopySuccess] = useState('');

   // Response data from the AUTH_SUCCESS & USER_DATA
   const { data: IsAuth, error: IsAuthIssue, isLoading: IsAuthLoading} = AUTH_SUCCESS()
   const { data: UserData, error: UserIssue, isLoading: UserLoading} = USER_DATA()
  
   // Mutation function to logout account
   const { mutate } = LOGOUT(IsAuth?.csrf_token)

   // Check loading states and return null or navigate away as needed
   if(IsAuthLoading && UserLoading) return null;
   if(IsAuthIssue && UserIssue) return <Navigate to='/signin/'/>;

   // Form submission to logout account
   function logout() {
     // Make an API request to logout account
     mutate()
   }

   // Handle copying the link to the clipboard
   const handleCopy = () => {
     setCopySuccess('Link copied!');
     setTimeout(() => setCopySuccess(''), 3000);
   };

   return (
     <>
      {
        IsAuth?.isauth && (
          <div>
          <Container>
            <Row>
              <h1 className="banner mt-4">StealthMessage</h1>
              <Col className="d-flex align-items-center justify-content-center">
                <nav className="p-2 mt-4">
                  <Button variant="danger" as={Link} to={`/user/notification`}>
                     Message <Badge bg="success">{(UserData?.secret_messages.filter(data => data.has_read === 0).length)}</Badge>
                  </Button>
                </nav>

                <nav className="p-2 mt-4">
                  <DropdownButton id="dropdown-basic-button" title={`${UserData?.user_data.name}`} variant="secondary">
                      <Dropdown.Item as={Link} to={`/`}>Home</Dropdown.Item>
                      <Dropdown.Item as={Link} to={`/user/settings`}>Settings</Dropdown.Item>
                      <Dropdown.Item as={Link} to={`/signin`} onClick={logout}>Logout</Dropdown.Item>
                  </DropdownButton>
                </nav>
              </Col>
            </Row>

            <Row className="d-flex align-items-center justify-content-center mt-4">
              <Col md={5}>
               <div className='p-4'>
                 <p style={{color: 'white', textAlign: 'center', fontFamily: 'monospace'}}>Send this to everyone</p>
                 <Form>
                   <Form.Group controlId="exampleForm.ControlInput1" className="d-flex align-items-center">
                     <Form.Control 
                       type="text" 
                       value={`${location.protocol}://${location.hostname}:${location.port}/secret/${UserData?.user_data?.message_key}`} // Remove the "${location.port}" in production
                       readOnly
                     />
                     <CopyToClipboard text={`${location.protocol}://${location.hostname}:${location.port}/secret/${UserData?.user_data?.message_key}`} onCopy={handleCopy}> {/* Remove the "${location.port}" in production */}
                       <Button variant="light" className="ml-2">Copy</Button>
                     </CopyToClipboard>
                   </Form.Group>
                   {copySuccess && <p style={{ color: 'lightgreen', textAlign: 'center', marginTop: '10px' }}>{copySuccess}</p>}
                 </Form>
               </div>
              </Col>
            </Row>
          </Container>
        </div>
        )
      }
     </>
   );
}
