import { useState, useEffect, useContext } from "react";
import { Navigate, Link } from "react-router-dom";
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import Logout from "./Logout";
import Context from "../../components/context/Context";

import './style.css';

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function User() {
   const [result, setResult] = useState('');
   const [notification, setNotification] = useState([]);
   const [copySuccess, setCopySuccess] = useState('');

   // Extract authentication status and loading state from context
   const { Isauthenticated, loading } = useContext(Context);

   // Fetch user data and notifications on component mount
   useEffect(() => {
      async function UserData() {
        try {
          // Make an API request to get user data
          const response = await axios.get(`${API_URL}/api/v1/user`, {
             withCredentials: true
          });
      
          setResult(response.data.user_data);
          setNotification(response.data.secret_messages);
        } catch(error) {
          console.log(error);
        }
      }

      UserData();
   }, []);

   // Component to display notification link with unread count
   function Notify() {
    // Filter notifications to get unread ones
    const item = notification.filter(data => data.has_read === 0);

    return (
      <>
       <Link to={`/user/notification`} className='custom-header' style={{color: 'white', textDecoration: 'none'}}>
         Notification(<span style={{color: 'lightgreen'}}>{item.length}</span>)
       </Link>
      </>
    );
  }

   // Handle copying the link to the clipboard
   const handleCopy = () => {
     setCopySuccess('Link copied!');
     setTimeout(() => setCopySuccess(''), 3000);
   };

   return (
     <>
      {loading ? (
        // Render nothing while loading
        null
      ) : (
        Isauthenticated ? (
          <div>
            <Container>
              <Row>
                <Col className="d-flex align-items-center justify-content-center">
                  <nav>
                    {/* Render notification link, settings link, and logout component */}
                    <Notify />
                    <Link to={`/user/settings`} className='custom-header'>Settings</Link>
                    <Logout />
                  </nav>
                </Col>
              </Row>

              <Row className="d-flex align-items-center justify-content-center mt-4">
                <h1 style={{color: 'white', textAlign: 'center'}}>Welcome {result.name}</h1>
                <Col md={5}>
                 <div className='p-4'>
                   <p style={{color: 'white', textAlign: 'center', fontFamily: 'monospace'}}>Send this to everyone</p>
                   <Form>
                     <Form.Group controlId="exampleForm.ControlInput1" className="d-flex align-items-center">
                       {/* Display and copy the secret message link */}
                       <Form.Control 
                         type="text" 
                         value={`http://localhost:5173/secret/${result.message_key}`} 
                         readOnly
                       />
                       <CopyToClipboard text={`http://localhost:5173/secret/${result.message_key}`} onCopy={handleCopy}>
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
        ) : (
          // Redirect to sign-in page if user is not authenticated
          <Navigate to='/signin'/>
        )
      )}
     </>
   );
}
