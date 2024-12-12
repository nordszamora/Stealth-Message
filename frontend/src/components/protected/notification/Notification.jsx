import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import { AUTH_SUCCESS, USER_DATA } from '../../api/user/api';
import { HAS_READ_MESSAGE, REMOVE_MESSAGE } from '../../api/notification/api';
import './style.css';

export default function Notification() {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Response data from the AUTH_SUCCESS and USER_DATA
  const { data: IsAuth, error: IsAuthIssue, isLoading: IsAuthLoading } = AUTH_SUCCESS();
  const { data: UserData, error: UserIssue, isLoading: UserLoading } = USER_DATA();

  // Mutation function to mark a message as "read" and removing a message
  const { mutate: HasRead } = HAS_READ_MESSAGE(IsAuth?.csrf_token);
  const { mutate: RemoveMessage } = REMOVE_MESSAGE(IsAuth?.csrf_token);

  // Use effect to update result when UserData changes
  useEffect(() => {
    if (UserData?.secret_messages) {
      setResult(UserData.secret_messages);
      setLoading(false);
    } 
    if (!UserLoading) {
      setLoading(false);
    }
  }, [UserData, UserLoading]);

  // Check loading or error states and return null or navigate away as needed
  if (IsAuthLoading && UserLoading) return null;
  if (IsAuthIssue && UserIssue) return <Navigate to='/signin/' />;

  // Function to mark a message as read
  function has_read(key) {
    if (HasRead) {
      HasRead({ has_read: true, key: key });
    }
  }

  // Function to remove a message from the list
  function remove(key) {
    setResult((prevMessages) => prevMessages.filter((msg) => msg.read_key !== key));

    if (RemoveMessage) {
      RemoveMessage(key);
    }
  }

  return (
    <>
      {
        IsAuth?.isauth && (
          <Container>
            <h1 style={{ color: 'white', textAlign: 'center' }} className='mt-2'>Message Notification</h1>
            <Row>
              <Col className="d-flex align-items-center justify-content-center mt-4">
                <div>
                  {loading ? null : (
                    result.length === 0 ? (
                      <div>
                        <p style={{ color: 'white' }}>No message yet.</p>
                      </div>
                    ) : (
                      <div>
                        {result.map((data, index) => (
                          <div key={index}>
                            <div className='mt-3 mb-4'>
                              <Link to={`/user/notification/read/${data.read_key}`} onClick={() => has_read(data.read_key)} className='custom-notification' style={{ color: data.has_read ? 'gray' : 'white', border: data.has_read ? '1px solid gray' : '1px solid white' }}>
                                New message {data.has_read ? null : <span style={{ color: 'lightgreen' }}>*</span>}
                              </Link>
                              <Button variant="light" className="ml-2" onClick={() => remove(data.read_key)}>Remove</Button>
                            </div>
                          </div>
                        )).reverse()} {/* Reverse the list to show the newest first */}
                      </div>
                    )
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        )
      }
    </>
  );
}
