import { Navigate, useParams } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { AUTH_SUCCESS } from '../../api/user/api';
import { READ_MESSAGE } from '../../api/notification/api';
import "./style.css";

export default function ReadMessage() {

   // Extract the 'key' parameter from the URL
   const { key } = useParams();

   // Response data from the AUTH_SUCCESS & READ_MESSAGE
   const { data: IsAuth, isError: NotAuth, isLoading: IsAuthLoading } = AUTH_SUCCESS()
   const { data: ReadMessage, isError: ReadMessageIssue, isLoading: LoadMessage } = READ_MESSAGE(key)

   // Check loading or error states and return null or navigate away as needed or render the "Not Found"
   if(IsAuthLoading && LoadMessage) return null;
   if(NotAuth) return <Navigate to='/signin/'/>;
   if(ReadMessageIssue) return <h1 style={{color: 'white', textAlign: 'center'}} className="mt-2">Not Found</h1>;
   
   return (
    <>
      {
        IsAuth?.isauth && (
          <Container>
            <Row>
              <Col className="d-flex align-items-center justify-content-center">
                <div>
                  <div>
                    <h1 style={{color: 'white', textAlign: 'center'}} className="mt-2">Message</h1>

                    <div className='break-word mt-5'>
                      <p style={{color: 'white', textAlign: 'center', padding: '10px'}}>{ReadMessage?.secret_message}</p>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        )
      }
   </>
   );
}
